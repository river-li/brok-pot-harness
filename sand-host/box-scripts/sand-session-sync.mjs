import { statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  attachToPage,
  CDP_PORT_BASE,
  connectBrowser,
  cookieFingerprint,
  cookieRecency,
  detachSession,
  discoverMonitorPorts,
  hostMatchesCookieDomain,
  hostOfOrigin,
  isConnectionRefused,
  listPageTargets,
  pushCookies,
  readCookies,
  readPageStorage,
  reloadPage,
  setPageStorage,
  toCookieParam,
} from "./cdp-cookies.mjs";

const POLL_INTERVAL_MS = Number.parseInt(
  process.env.SAND_SESSION_SYNC_INTERVAL_MS ?? "1500",
  10
);

const STORAGE_SEP = "\u0000";
export function makeStorageKey(origin, key) {
  return `${origin}${STORAGE_SEP}${key}`;
}
export function splitStorageKey(storageKey) {
  const i = storageKey.indexOf(STORAGE_SEP);
  return [storageKey.slice(0, i), storageKey.slice(i + 1)];
}

export function mergeStorage(perMonitor) {
  const canonical = new Map();
  for (const origins of perMonitor) {
    for (const [origin, items] of origins) {
      for (const [key, value] of items) {
        const storageKey = makeStorageKey(origin, key);
        const existing = canonical.get(storageKey);
        if (existing == null || (existing === "" && value !== "")) {
          canonical.set(storageKey, value);
        }
      }
    }
  }
  return canonical;
}

export function selectStorageSeed(origin, canonical, currentItems, offered) {
  const entries = [];
  const offeredKeys = [];
  for (const [storageKey, value] of canonical) {
    const [o, key] = splitStorageKey(storageKey);
    if (o !== origin) continue;
    if (currentItems.has(key)) continue;
    if (offered?.get(storageKey) === value) continue;
    entries.push([key, value]);
    offeredKeys.push([storageKey, value]);
  }
  return { entries, offeredKeys };
}

export function mergeCookies(perMonitor) {
  const canonical = new Map();
  for (const cookies of perMonitor) {
    for (const [key, cookie] of cookies) {
      const existing = canonical.get(key);
      if (existing == null || cookieRecency(cookie) > cookieRecency(existing)) {
        canonical.set(key, cookie);
      }
    }
  }
  return canonical;
}

export function selectCookieSeed(canonical, currentCookies, offered) {
  const cookies = [];
  const offeredKeys = [];
  for (const [key, cookie] of canonical) {
    if (currentCookies.has(key)) continue;
    const fingerprint = cookieFingerprint(cookie);
    if (offered?.get(key) === fingerprint) continue;
    cookies.push(cookie);
    offeredKeys.push([key, fingerprint]);
  }
  return { cookies, offeredKeys };
}

export const MONITOR_BUSY_TTL_MS = 30_000;

export function readBusyMonitorPorts(ports, now = Date.now()) {
  const busy = new Set();
  for (const port of ports) {
    try {
      const { mtimeMs } = statSync(
        `/tmp/sand-monitor-busy-${port - CDP_PORT_BASE}`
      );
      if (now - mtimeMs < MONITOR_BUSY_TTL_MS) busy.add(port);
    } catch (error) {
      if (error?.code !== "ENOENT") {
        log(`busy marker for CDP port ${port} unreadable: ${String(error)}`);
      }
    }
  }
  return busy;
}

export const RELOAD_WINDOW_MS = 60_000;
export const RELOAD_MAX_PER_WINDOW = 3;
export const RELOAD_QUIET_MS = POLL_INTERVAL_MS * 10 + 5_000;

export class FreshIdentityReloadBreaker {
  constructor(now = Date.now) {
    this.now = now;
    this.byPort = new Map();
  }

  stateFor(port, host) {
    let perHost = this.byPort.get(port);
    if (perHost == null) {
      perHost = new Map();
      this.byPort.set(port, perHost);
    }
    let state = perHost.get(host);
    if (state == null) {
      state = { issued: [], open: false, lastRequestAt: null, pending: false };
      perHost.set(host, state);
    }
    return state;
  }

  clearPort(port) {
    this.byPort.delete(port);
  }

  hasPendingDeferrals(livePorts) {
    for (const port of livePorts) {
      const perHost = this.byPort.get(port);
      if (perHost == null) continue;
      for (const state of perHost.values()) {
        if (state.open && state.pending) return true;
      }
    }
    return false;
  }

  request(port, host) {
    const t = this.now();
    const state = this.stateFor(port, host);
    const quietForMs =
      state.lastRequestAt == null ? Infinity : t - state.lastRequestAt;
    state.lastRequestAt = t;
    if (state.open) {
      if (quietForMs < RELOAD_QUIET_MS) {
        state.pending = true;
        return "open";
      }
      state.open = false;
      state.pending = false;
      state.issued = [t];
      return "allow-after-quiet";
    }
    state.issued = state.issued.filter(at => t - at < RELOAD_WINDOW_MS);
    if (state.issued.length >= RELOAD_MAX_PER_WINDOW) {
      state.open = true;
      return "trip";
    }
    state.issued.push(t);
    return "allow";
  }

  takeDueDeferredHosts(availableByPort) {
    const t = this.now();
    const due = [];
    for (const [port, perHost] of this.byPort) {
      for (const [host, state] of perHost) {
        if (!state.open || !state.pending) continue;
        if (
          state.lastRequestAt != null &&
          t - state.lastRequestAt < RELOAD_QUIET_MS
        ) {
          continue;
        }
        if (availableByPort != null) {
          const available = availableByPort.get(port);
          if (available == null || !available.has(host)) continue;
        }
        state.open = false;
        state.pending = false;
        state.issued = [t];
        due.push({ port, host });
      }
    }
    return due;
  }

  requeueDeferral(port, host) {
    const state = this.stateFor(port, host);
    state.open = true;
    state.pending = true;
  }
}

function log(message) {
  process.stderr.write(`sand-session-sync ${message}\n`);
}

// Chrome keeps an in-memory list of all cookies and reads the backing store only until it has fetched them all (https://chromium.googlesource.com/chromium/src/+/refs/tags/151.0.7922.169/net/cookies/cookie_monster.h), and the DevTools IndexedDB domain has no method that writes an entry (https://chromedevtools.github.io/devtools-protocol/tot/IndexedDB/).
export class SessionSyncer {
  constructor() {
    this.browsers = new Map();
    this.cookieOffered = new Map();
    this.storageOffered = new Map();
    this.browserIdByPort = new Map();
    this.reloadBreaker = new FreshIdentityReloadBreaker();
    this.busyWithheldReloads = new Map();
  }

  syncBrowserIdentity(port, browserId) {
    const prev = this.browserIdByPort.get(port);
    if (prev != null && browserId !== "" && prev !== browserId) {
      this.cookieOffered.delete(port);
      this.storageOffered.delete(port);
      this.reloadBreaker.clearPort(port);
      this.busyWithheldReloads.delete(port);
      log(`monitor on CDP port ${port} was replaced; cleared offered state`);
    }
    if (browserId !== "") this.browserIdByPort.set(port, browserId);
  }

  recordCookieOffered(port, cookieKey, fingerprint) {
    let perKey = this.cookieOffered.get(port);
    if (perKey == null) {
      perKey = new Map();
      this.cookieOffered.set(port, perKey);
    }
    perKey.set(cookieKey, fingerprint);
  }

  recordStorageOffered(port, storageKey, value) {
    let perKey = this.storageOffered.get(port);
    if (perKey == null) {
      perKey = new Map();
      this.storageOffered.set(port, perKey);
    }
    perKey.set(storageKey, value);
  }

  async ensureConnections() {
    for (const port of discoverMonitorPorts()) {
      const existing = this.browsers.get(port);
      if (existing != null && !existing.isClosed) continue;
      try {
        const browser = await connectBrowser(port);
        this.browsers.set(port, browser);
        this.syncBrowserIdentity(port, browser.browserId);
        log(`connected to monitor on CDP port ${port}`);
      } catch (error) {
        if (!isConnectionRefused(error)) {
          log(`connecting to monitor on CDP port ${port} failed: ${String(error)}`);
        }
      }
    }
    for (const [port, browser] of this.browsers) {
      if (browser.isClosed) this.browsers.delete(port);
    }
  }

  async attachPages(browsers) {
    const byPort = new Map();
    for (const browser of browsers) {
      const pages = [];
      let targets;
      try {
        targets = await listPageTargets(browser);
      } catch {
        targets = [];
      }
      for (const { targetId } of targets) {
        const sessionId = await attachToPage(browser, targetId);
        if (sessionId == null) continue;
        const storage = await readPageStorage(browser, sessionId);
        if (storage == null) {
          await detachSession(browser, sessionId);
          continue;
        }
        pages.push({
          browser,
          sessionId,
          origin: storage.origin,
          items: storage.items,
        });
      }
      byPort.set(browser.port, pages);
    }
    return byPort;
  }

  async syncLocalStorage(pagesByPort) {
    const originsByPort = new Map();
    for (const [port, pages] of pagesByPort) {
      const origins = new Map();
      for (const page of pages) {
        let items = origins.get(page.origin);
        if (items == null) {
          items = new Map();
          origins.set(page.origin, items);
        }
        for (const [key, value] of page.items) items.set(key, value);
      }
      originsByPort.set(port, origins);
    }

    const canonical = mergeStorage([...originsByPort.values()]);
    const reloadHosts = new Map();
    let synced = 0;
    for (const [port, origins] of originsByPort) {
      const pages = pagesByPort.get(port) ?? [];
      for (const [origin, items] of origins) {
        const { entries, offeredKeys } = selectStorageSeed(
          origin,
          canonical,
          items,
          this.storageOffered.get(port)
        );
        if (entries.length === 0) continue;
        const originPage = pages.find((page) => page.origin === origin);
        if (originPage == null) continue;
        await setPageStorage(originPage.browser, originPage.sessionId, entries);
        for (const [storageKey, value] of offeredKeys) {
          this.recordStorageOffered(port, storageKey, value);
        }
        synced += entries.length;
        let hosts = reloadHosts.get(port);
        if (hosts == null) {
          hosts = new Set();
          reloadHosts.set(port, hosts);
        }
        hosts.add(hostOfOrigin(origin));
      }
    }
    if (synced > 0) {
      log(`mirrored ${synced} localStorage entr${synced === 1 ? "y" : "ies"} across monitors`);
    }
    return reloadHosts;
  }

  async tick() {
    await this.ensureConnections();
    const live = [...this.browsers.values()].filter(b => !b.isClosed);
    if (live.length === 0) return;
    const livePorts = live.map(b => b.port);
    if (
      live.length < 2 &&
      !this.reloadBreaker.hasPendingDeferrals(livePorts) &&
      !livePorts.some(port => this.busyWithheldReloads.has(port))
    ) {
      return;
    }

    const pagesByPort = await this.attachPages(live);
    const busyPorts = readBusyMonitorPorts(livePorts);
    try {
      if (live.length >= 2) {
        await this.mirrorSessions(live, pagesByPort, busyPorts);
      }
      await this.deliverDeferredReloads(pagesByPort, busyPorts);
      await this.deliverWithheldReloads(pagesByPort, busyPorts);
    } finally {
      for (const pages of pagesByPort.values()) {
        for (const page of pages) await detachSession(page.browser, page.sessionId);
      }
    }
  }

  async mirrorSessions(live, pagesByPort, busyPorts) {
    const newCookieDomains = new Map();

    const perBrowser = new Map();
    for (const browser of live) {
      try {
        perBrowser.set(browser.port, { browser, cookies: await readCookies(browser) });
      } catch {
        browser.fail(new Error("getCookies failed"));
      }
    }
    if (perBrowser.size < 2) return;

    const canonical = mergeCookies([...perBrowser.values()].map(v => v.cookies));

    let synced = 0;
    for (const [port, { browser, cookies }] of perBrowser) {
      const { cookies: seed, offeredKeys } = selectCookieSeed(
        canonical,
        cookies,
        this.cookieOffered.get(port)
      );
      if (seed.length === 0) continue;
      await pushCookies(browser, seed.map(toCookieParam));
      synced += seed.length;
      for (const [key, fingerprint] of offeredKeys) {
        this.recordCookieOffered(port, key, fingerprint);
      }
      let domains = newCookieDomains.get(port);
      if (domains == null) {
        domains = new Set();
        newCookieDomains.set(port, domains);
      }
      for (const cookie of seed) domains.add(cookie.domain);
    }

    if (synced > 0) {
      log(`mirrored ${synced} cookie write(s) across ${perBrowser.size} monitors`);
    }

    const reloadHosts = await this.syncLocalStorage(pagesByPort);
    await this.reloadReceivers(
      pagesByPort,
      reloadHosts,
      newCookieDomains,
      busyPorts
    );
  }

  requestReload(port, host) {
    const status = this.reloadBreaker.request(port, host);
    if (status === "trip") {
      log(
        `reload breaker OPEN for ${host} on CDP port ${port}: ` +
          `${RELOAD_MAX_PER_WINDOW} session-sync reloads within ${RELOAD_WINDOW_MS}ms ` +
          `(page storage is not converging); suppressing further reloads until it ` +
          `pauses — cookie/localStorage seeding continues`
      );
    } else if (status === "allow-after-quiet") {
      log(
        `reload breaker closed for ${host} on CDP port ${port} after a quiet ` +
          `period; session-sync reloads re-enabled`
      );
    }
    return status === "allow" || status === "allow-after-quiet";
  }

  async deliverDeferredReloads(pagesByPort, busyPorts) {
    const availableByPort = new Map();
    for (const [port, pages] of pagesByPort) {
      if (busyPorts.has(port)) continue;
      const liveHosts = new Set();
      for (const page of pages) {
        if (!page.browser.isClosed) liveHosts.add(hostOfOrigin(page.origin));
      }
      availableByPort.set(port, liveHosts);
    }
    for (const { port, host } of this.reloadBreaker.takeDueDeferredHosts(
      availableByPort
    )) {
      let delivered = false;
      for (const page of pagesByPort.get(port) ?? []) {
        if (hostOfOrigin(page.origin) !== host || page.browser.isClosed) continue;
        await reloadPage(page.browser, page.sessionId);
        if (!page.browser.isClosed) delivered = true;
      }
      if (delivered) {
        log(
          `reload breaker closed for ${host} on CDP port ${port} after a quiet ` +
            `period; delivering the reload it deferred while open`
        );
      } else {
        this.reloadBreaker.requeueDeferral(port, host);
      }
    }
  }

  async deliverWithheldReloads(pagesByPort, busyPorts) {
    for (const [port, hosts] of this.busyWithheldReloads) {
      if (busyPorts.has(port)) continue;
      const pages = pagesByPort.get(port);
      if (pages == null || pages.length === 0) continue;
      this.busyWithheldReloads.delete(port);
      for (const host of hosts) {
        if (!this.requestReload(port, host)) continue;
        log(
          `delivering the ${host} reload withheld while CDP port ${port}'s ` +
            `monitor was being driven`
        );
        for (const page of pages) {
          if (hostOfOrigin(page.origin) !== host || page.browser.isClosed) continue;
          await reloadPage(page.browser, page.sessionId);
        }
      }
    }
  }

  async reloadReceivers(pagesByPort, reloadHosts, newCookieDomains, busyPorts) {
    for (const [port, pages] of pagesByPort) {
      const hosts = reloadHosts.get(port);
      const domains = newCookieDomains.get(port);
      if ((hosts == null || hosts.size === 0) && (domains == null || domains.size === 0)) {
        continue;
      }
      const allowedByHost = new Map();
      for (const page of pages) {
        const host = hostOfOrigin(page.origin);
        const cookieHit =
          domains != null && [...domains].some(d => hostMatchesCookieDomain(host, d));
        const storageHit = hosts != null && hosts.has(host);
        if (!cookieHit && !storageHit) continue;
        let allowed = allowedByHost.get(host);
        if (allowed == null) {
          if (busyPorts.has(port)) {
            let withheld = this.busyWithheldReloads.get(port);
            if (withheld == null) {
              withheld = new Set();
              this.busyWithheldReloads.set(port, withheld);
            }
            withheld.add(host);
            log(
              `withholding the ${host} reload on CDP port ${port}: its monitor is ` +
                `being driven right now; seeding continues`
            );
            allowed = false;
          } else {
            allowed = this.requestReload(port, host);
          }
          allowedByHost.set(host, allowed);
        }
        if (allowed) {
          await reloadPage(page.browser, page.sessionId);
        }
      }
    }
  }
}

async function main() {
  log("starting; mirroring cookies + localStorage across box monitors");
  const syncer = new SessionSyncer();
  for (;;) {
    try {
      await syncer.tick();
    } catch (error) {
      log(`tick failed: ${String(error)}`);
    }
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

if (
  process.argv[1] != null &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void main();
}
