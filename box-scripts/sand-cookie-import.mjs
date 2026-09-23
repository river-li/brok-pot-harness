import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";
import {
  connectBrowser,
  cookieKey,
  discoverChromeDebugPorts,
  discoverMonitorPorts,
  isRotatingAuthCookie,
  pushCookies,
  readCookies,
  toCookieParam,
} from "./cdp-cookies.mjs";
import { dropToBoxUser, parseSeed, serializeSeed, withSeedLock } from "./sand-cookie-persist.mjs";

const SEED_PATH =
  process.env.SAND_COOKIE_SEED_PATH ?? "/home/box/sand-data/chrome-cookie-seed.json";

function log(message) {
  process.stderr.write(`sand-cookie-import ${message}\n`);
}

export function parseCookieBatch(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { error: "malformed-batch" };
  }
  if (!Array.isArray(parsed)) return { error: "malformed-batch" };
  const cookies = parsed.filter(
    (cookie) =>
      cookie != null &&
      typeof cookie.name === "string" &&
      cookie.name.length > 0 &&
      typeof cookie.value === "string" &&
      typeof cookie.domain === "string" &&
      cookie.domain.length > 0 &&
      typeof cookie.path === "string",
  );
  return { cookies };
}

// `__Host-` cookies are valid with no Domain attribute, or with a Domain equal to the host when the host is an IP address (https://chromium.googlesource.com/chromium/src/+/refs/tags/151.0.7922.169/net/cookies/cookie_util.cc), and CDP derives a set cookie's default domain from `CookieParam.url` (https://chromedevtools.github.io/devtools-protocol/tot/Network/#type-CookieParam), so a `__Host-` cookie pushed by url lands host-only and a `.domain` seed row would never match it.
export function toLandedCookie(cookie) {
  const param = toCookieParam(cookie);
  if (param == null) return cookie;
  try {
    const domain = param.domain ?? new URL(param.url).hostname;
    return domain === cookie.domain ? cookie : { ...cookie, domain };
  } catch {
    return cookie;
  }
}

export function injectableCookies(batch) {
  return batch.filter((cookie) => toCookieParam(cookie) != null);
}

export function countLandedInJar(batch, after) {
  const landed = new Set();
  for (const cookie of batch) {
    try {
      if (after.has(landedCookieKey(cookie))) landed.add(cookieKey(cookie));
    } catch (error) {
      log(`a cookie has no key and is left out of the landed count: ${String(error)}`);
    }
  }
  return landed;
}

export function mergeSeedCookies(seedCookies, importedCookies) {
  const byKey = new Map();
  for (const cookie of seedCookies) {
    const landed = toLandedCookie(cookie);
    byKey.set(cookieKey(landed), landed);
  }
  for (const cookie of importedCookies) {
    if (isRotatingAuthCookie(cookie.name)) continue;
    if (toCookieParam(cookie) == null) continue;
    const landed = toLandedCookie(cookie);
    byKey.set(cookieKey(landed), landed);
  }
  return [...byKey.values()];
}

export function landedCookieKey(cookie) {
  return cookieKey(toLandedCookie(cookie));
}

async function injectIntoMonitor(port, batch) {
  const injectable = injectableCookies(batch);
  const browser = await connectBrowser(port);
  try {
    await pushCookies(browser, injectable.map(toCookieParam));
    const after = await readCookies(browser);
    return countLandedInJar(injectable, after);
  } finally {
    browser.close();
  }
}

async function injectIntoAllMonitors(batch) {
  const ports = discoverMonitorPorts();
  const landed = new Set();
  let monitorsReached = 0;
  for (const port of ports) {
    try {
      for (const key of await injectIntoMonitor(port, batch)) landed.add(key);
      monitorsReached += 1;
    } catch (error) {
      log(`inject into Chrome on port ${port} failed: ${String(error)}`);
    }
  }
  return {
    landed,
    chromeDebugPorts: discoverChromeDebugPorts().length,
    monitorsReached,
  };
}

export function countLandedSites(batch, landedKeys) {
  const sites = new Set();
  for (const cookie of batch) {
    if (!landedKeys.has(cookieKey(cookie))) continue;
    sites.add(cookie.domain.replace(/^\./, "").toLowerCase());
  }
  return sites.size;
}

export async function mergeIntoSeedFile(seedPath, batch, options = {}) {
  const fs = {
    mkdirSync,
    readFileSync,
    renameSync,
    writeFileSync,
    ...(options.fs ?? {}),
  };
  try {
    return await withSeedLock(
      seedPath,
      () => {
        let text = null;
        try {
          text = fs.readFileSync(seedPath, "utf8");
        } catch (error) {
          if (error?.code !== "ENOENT") {
            log(`could not read the seed file: ${String(error)}`);
            return { seedError: "seed-read-failed" };
          }
        }
        let existing = [];
        if (text != null) {
          const parsed = parseSeed(text);
          if (parsed == null) {
            log("the seed file does not hold a cookie seed");
            return { seedError: "seed-corrupt" };
          }
          existing = parsed;
        }
        const merged = mergeSeedCookies(existing, batch);
        fs.mkdirSync(dirname(seedPath), { recursive: true });
        const tmp = `${seedPath}.tmp`;
        fs.writeFileSync(tmp, serializeSeed(merged));
        fs.renameSync(tmp, seedPath);
        return { seedSize: merged.length };
      },
      { fs },
    );
  } catch (error) {
    log(`could not write the seed file: ${String(error)}`);
    return { seedError: "seed-write-failed" };
  }
}

async function main() {
  if (process.env.SAND_COOKIE_IMPORT_TOKEN !== "sand-cookie-import-host") {
    process.stdout.write(`${JSON.stringify({ injected: 0, sites: 0, error: "unauthorized" })}\n`);
    return;
  }
  const batchPath = process.env.SAND_COOKIE_IMPORT_BATCH_PATH ?? process.argv[2];
  if (batchPath == null || batchPath.length === 0) {
    log("no batch path given");
    process.stdout.write(`${JSON.stringify({ injected: 0, sites: 0 })}\n`);
    return;
  }
  let batchText;
  try {
    batchText = readFileSync(batchPath, "utf8");
  } catch (error) {
    log(`could not read the batch file: ${String(error)}`);
    process.stdout.write(`${JSON.stringify({ injected: 0, sites: 0 })}\n`);
    return;
  }
  const parsedBatch = parseCookieBatch(batchText);
  if (parsedBatch.error != null) {
    log("the batch file does not hold a cookie array");
    process.stdout.write(
      `${JSON.stringify({ injected: 0, sites: 0, error: parsedBatch.error })}\n`,
    );
    return;
  }
  const batch = parsedBatch.cookies;
  if (batch.length === 0) {
    process.stdout.write(`${JSON.stringify({ injected: 0, sites: 0 })}\n`);
    return;
  }
  if (!dropToBoxUser()) {
    process.stdout.write(
      `${JSON.stringify({ injected: 0, sites: 0, error: "privilege-drop-failed" })}\n`,
    );
    return;
  }
  const { landed, chromeDebugPorts, monitorsReached } = await injectIntoAllMonitors(batch);
  const injected = landed.size;
  const sites = countLandedSites(batch, landed);
  const seed = await mergeIntoSeedFile(SEED_PATH, batch);
  log(
    `injected ${injected}/${batch.length} cookie(s) into live Chrome; ` +
      (seed.seedError == null
        ? `seed now holds ${seed.seedSize} cookie(s)`
        : `seed unchanged (${seed.seedError})`),
  );
  const outcome = { injected, sites, chromeDebugPorts, monitorsReached };
  if (seed.seedError != null) outcome.seedError = seed.seedError;
  process.stdout.write(`${JSON.stringify(outcome)}\n`);
}

if (process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
