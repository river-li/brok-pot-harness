// grok-bot-harness-file-length-exempt: 2053 lines at the W12-145b pin; a legacy browser driver, extracted whole from a template literal in #226504, that predates check-file-budgets admitting .mjs (the row makes it visible, it does not grow it); follow-up: a split row for the register, because check-file-budgets prices no growth of a marked file (approved-by: @poteto, until: 2026-11-30)
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";

const RESULT_MARKER = "__SAND_BROWSER_RESULT__";
const STATE_DIR = "/tmp/.sand-browser";
const WEBAUTHN_ARM_UNTIL_PATH = STATE_DIR + "/webauthn-armed-until";
const WEBAUTHN_BROWSER_ARM_MS = 20 * 60 * 1000;
const ACTION_TIMEOUT_MS = 10000;
const MAX_HOLD_DURATION_MS = 30000;
const NAVIGATE_TIMEOUT_MS = 25000;
const NAVIGATE_RETRY_DELAYS_MS = [1000, 2500];
const LOAD_SETTLE_TIMEOUT_MS = 5000;
const CDP_TEXT_MAX_CHARS = 20000;
const WATCHDOG_MS = 90000;
const RESULT_RESERVE_MS = 12000;
const DISCARDED_TAB_SILENCE_MS = 5000;
const TAB_CALL_DEADLINE_MS = 2000;
const TAB_CAP = 10;
const DRIVER_STARTED_AT = Date.now();
const ERROR_PAGE_SETTLE_MS = 600;
const CHROME_ERROR_PAGE_PREFIX = "chrome-error://";
const RECOVER_ERROR_PAGE_AFTER = new Set(["click", "mouse_click_xy", "type", "press_key", "cdp"]);
const TRANSIENT_NAVIGATION_ERROR =
  /net::ERR_(TUNNEL_CONNECTION_FAILED|PROXY_CONNECTION_FAILED|SOCKS_CONNECTION_FAILED|CONNECTION_(RESET|CLOSED|REFUSED|ABORTED|FAILED|TIMED_OUT)|EMPTY_RESPONSE|NETWORK_CHANGED|NAME_NOT_RESOLVED|NAME_RESOLUTION_FAILED|DNS_TIMED_OUT|ADDRESS_UNREACHABLE|INTERNET_DISCONNECTED|SOCKET_NOT_CONNECTED|HTTP2_PROTOCOL_ERROR|HTTP2_PING_FAILED|HTTP2_SERVER_REFUSED_STREAM|QUIC_PROTOCOL_ERROR|QUIC_HANDSHAKE_FAILED|NETWORK_IO_SUSPENDED)\b/;
const RELOADABLE_PROTOCOLS = new Set(["http:", "https:"]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withDeadline(promise, ms, message) {
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, deadline]).finally(() => clearTimeout(timer));
}

async function navigationOutrunsPlaywright(context, page) {
  let session;
  try {
    session = await context.newCDPSession(page);
    const info = await session.send("Target.getTargetInfo");
    return info.targetInfo.url !== page.url();
  } catch {
    return false;
  } finally {
    if (session !== undefined) await detachOrNote(session, "navigation probe's");
  }
}

async function settleIntoErrorPage(context, page) {
  if (page.isClosed() || isChromeErrorPage(page)) return;
  if (!(await navigationOutrunsPlaywright(context, page))) return;
  const deadline = Date.now() + ERROR_PAGE_SETTLE_MS;
  while (Date.now() < deadline) {
    await sleep(100);
    if (page.isClosed() || isChromeErrorPage(page)) return;
  }
}

function isTransientNavigationError(error) {
  try {
    const message = error instanceof Error ? String(error.message) : String(error);
    return TRANSIENT_NAVIGATION_ERROR.test(message);
  } catch {
    return false;
  }
}

function isChromeErrorPage(page) {
  return page.url().startsWith(CHROME_ERROR_PAGE_PREFIX);
}

function stripUrlCredentials(url) {
  try {
    const parsed = new URL(url);
    parsed.username = "";
    parsed.password = "";
    return parsed.href;
  } catch {
    return url;
  }
}

function anotherAttemptFitsWatchdog() {
  const remaining = DRIVER_STARTED_AT + WATCHDOG_MS - Date.now();
  return remaining > NAVIGATE_TIMEOUT_MS + LOAD_SETTLE_TIMEOUT_MS + RESULT_RESERVE_MS;
}

function recordableUrl(url) {
  return url.startsWith(CHROME_ERROR_PAGE_PREFIX) ? undefined : stripUrlCredentials(url);
}

async function stopLoading(page) {
  let session;
  try {
    session = await page.context().newCDPSession(page);
    await session.send("Page.stopLoading");
  } catch (failure) {
    noteIgnoredFailure("Page.stopLoading", failure);
  } finally {
    if (session !== undefined) await detachOrNote(session, "stop-loading");
  }
}

function redactUrlCredentialsInText(text) {
  return text.replace(/([a-z][a-z0-9+.-]*:\/\/)[^\s\/@]+@/gi, "$1");
}

function failureLine(failure) {
  let message;
  try {
    message = failure instanceof Error ? String(failure.message) : String(failure);
  } catch {
    message = "unknown failure";
  }
  return redactUrlCredentialsInText(message.split("\n")[0]);
}

function capCdpText(text) {
  if (text.length <= CDP_TEXT_MAX_CHARS) return text;
  const outDir = process.env.SAND_BROWSER_ARTIFACT_DIR || "/workspace/browser-cdp";
  mkdirSync(outDir, { recursive: true });
  const outPath = outDir + "/cdp-" + randomUUID() + ".json";
  writeFileSync(outPath, text);
  return JSON.stringify({
    truncated: true,
    outputFile: outPath,
    bytes: text.length,
    preview: text.slice(0, 2000),
  });
}

// stderr reaches the host only when the stdout result marker is missing, so a
// note never changes an op's result.
function noteIgnoredFailure(step, failure) {
  console.error("ignored: " + step + " failed: " + failureLine(failure));
}

function noteIgnoredFailureUnlessMissingFile(step, failure) {
  if (failure?.code !== "ENOENT") noteIgnoredFailure(step, failure);
}

// Playwright's detach sends Runtime.runIfWaitingForDebugger to the renderer
// before Target.detachFromTarget, so a page whose script holds the main thread
// stalls the detach even when every command the session ran was answered by
// the browser process.
function detachOrNote(session, owner) {
  return withDeadline(session.detach(), TAB_CALL_DEADLINE_MS, "detach timed out").catch((failure) =>
    noteIgnoredFailure("detaching the " + owner + " CDP session", failure),
  );
}

function settleAfter(page, action, timeoutMs) {
  return page
    .waitForLoadState("domcontentloaded", { timeout: timeoutMs })
    .catch((failure) => noteIgnoredFailure("settling the page after " + action, failure));
}

function noteSkippedDocuments(step, count) {
  if (count > 0) noteIgnoredFailure(step, String(count) + " document(s) skipped");
}

async function markSecretFill(element, value) {
  await element.evaluate(MARK_SECRET_FILL_FN, value);
}

async function gotoWithRecovery(page, url, recovery) {
  let lastFailure;
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: NAVIGATE_TIMEOUT_MS,
      });
      await page
        .waitForLoadState("load", { timeout: LOAD_SETTLE_TIMEOUT_MS })
        .catch((failure) => noteIgnoredFailure("waiting for the load event", failure));
      if (!recovery) return { retries: 0, status: undefined };
      if (!isChromeErrorPage(page)) {
        return { retries: attempt, status: response === null ? undefined : response.status() };
      }
      lastFailure = new Error(
        "Chrome showed its error page instead of " + stripUrlCredentials(url),
      );
    } catch (error) {
      await stopLoading(page);
      if (!recovery) throw new Error(failureLine(error));
      if (!isTransientNavigationError(error)) {
        if (attempt === 0) throw new Error(failureLine(error));
        throw new Error(
          "The page did not load after " +
            String(attempt + 1) +
            " attempts; the last one failed with: " +
            failureLine(error) +
            ". Earlier attempts hit a transient network failure (" +
            failureLine(lastFailure) +
            ").",
        );
      }
      lastFailure = error;
    }
    const exhausted = attempt >= NAVIGATE_RETRY_DELAYS_MS.length;
    if (exhausted || !anotherAttemptFitsWatchdog()) {
      throw new Error(
        "The page did not load after " +
          String(attempt + 1) +
          " attempts (" +
          failureLine(lastFailure) +
          "). The box's network path kept failing the request; retry browser_navigate, and report the failure if it persists.",
      );
    }
    await sleep(NAVIGATE_RETRY_DELAYS_MS[attempt]);
  }
}

function navigationNote(outcome) {
  const notes = [];
  if (outcome.retries > 0) {
    notes.push(
      "recovered after " +
        String(outcome.retries) +
        (outcome.retries === 1 ? " retry" : " retries") +
        " of a transient network failure",
    );
  }
  if (typeof outcome.status === "number" && outcome.status >= 400) {
    notes.push("the server answered HTTP " + String(outcome.status));
  }
  return notes.length > 0 ? " (" + notes.join("; ") + ")" : "";
}

async function intendedUrlFromHistory(context, page) {
  let session;
  try {
    session = await context.newCDPSession(page);
    const history = await session.send("Page.getNavigationHistory");
    const entry = history.entries[history.currentIndex];
    if (entry.transitionType === "form_submit") return undefined;
    return typeof entry.url === "string" ? entry.url : undefined;
  } catch {
    return undefined;
  } finally {
    if (session !== undefined) await detachOrNote(session, "navigation-history");
  }
}

function isReloadableUrl(url) {
  try {
    return RELOADABLE_PROTOCOLS.has(new URL(url).protocol);
  } catch {
    return false;
  }
}

async function recoverErrorPage(context, page) {
  const intendedUrl = await intendedUrlFromHistory(context, page);
  if (intendedUrl === undefined || !isReloadableUrl(intendedUrl)) return undefined;
  return gotoWithRecovery(page, intendedUrl, true);
}

function statePath(display) {
  return STATE_DIR + "/views-" + String(display) + ".json";
}

function armWebAuthn(ttlMs = WEBAUTHN_BROWSER_ARM_MS) {
  try {
    mkdirSync(STATE_DIR, { recursive: true });
    let until = Date.now() + ttlMs;
    try {
      const existing = readFileSync(WEBAUTHN_ARM_UNTIL_PATH, "utf8").trim();
      if (/^\d{1,15}$/.test(existing) && Number(existing) > until) {
        until = Number(existing);
      }
    } catch (failure) {
      noteIgnoredFailureUnlessMissingFile("reading the webauthn arm", failure);
    }
    const tmp = WEBAUTHN_ARM_UNTIL_PATH + "." + process.pid + ".tmp";
    writeFileSync(tmp, String(until) + "\n");
    renameSync(tmp, WEBAUTHN_ARM_UNTIL_PATH);
  } catch (failure) {
    noteIgnoredFailure("arming webauthn for recent browser use", failure);
  }
}

function loadState(display) {
  try {
    const parsed = JSON.parse(readFileSync(statePath(display), "utf8"));
    if (parsed && typeof parsed === "object") {
      return {
        views: parsed.views && typeof parsed.views === "object" ? parsed.views : {},
        urls: parsed.urls && typeof parsed.urls === "object" ? parsed.urls : {},
        frameRefs: parsed.frameRefs && typeof parsed.frameRefs === "object" ? parsed.frameRefs : {},
        recentTargets: Array.isArray(parsed.recentTargets) ? parsed.recentTargets : [],
        lastViewId: typeof parsed.lastViewId === "string" ? parsed.lastViewId : undefined,
      };
    }
  } catch (failure) {
    noteIgnoredFailureUnlessMissingFile("reading the view state", failure);
  }
  return { views: {}, urls: {}, frameRefs: {}, recentTargets: [], lastViewId: undefined };
}

function saveState(display, state) {
  writeState(display, state);
  armWebAuthn();
}

function writeState(display, state) {
  try {
    mkdirSync(STATE_DIR, { recursive: true });
    const current = loadState(display);
    const views = { ...current.views, ...state.views };
    const urls = { ...current.urls, ...state.urls };
    const frameRefs = { ...current.frameRefs };
    for (const [view, owners] of Object.entries(state.frameRefs ?? {})) {
      frameRefs[view] = { ...frameRefs[view], ...owners };
    }
    for (const removed of state.deletedViews ?? []) {
      delete views[removed];
      delete urls[removed];
      delete frameRefs[removed];
    }
    let lastViewId = state.lastViewId ?? current.lastViewId;
    if (lastViewId !== undefined && (state.deletedViews ?? []).includes(lastViewId)) {
      lastViewId = undefined;
    }
    const recentTargets = state.recentTargets ?? current.recentTargets;
    const merged = { views, urls, frameRefs, recentTargets, lastViewId };
    const tmp = statePath(display) + "." + String(process.pid) + ".tmp";
    writeFileSync(tmp, JSON.stringify(merged));
    renameSync(tmp, statePath(display));
  } catch (failure) {
    noteIgnoredFailure("saving the view state", failure);
  }
}

// Serializes cross-process claims on a live tab: two concurrent driver calls
// (same-step parallel browser tools) re-adopting by URL could otherwise pick
// the SAME tab for different views before either saves. The winner writes its
// claim to the state file INSIDE the lock, so the loser's fresh read inside
// its own turn sees the tab as taken. A lock older than 5s is treated as
// leaked by a crashed driver and broken. Failure to lock degrades to the
// unlocked behavior instead of failing the op.
async function withViewClaimLock(display, fn) {
  const lockPath = statePath(display) + ".lock";
  const deadline = Date.now() + 3000;
  let locked = false;
  while (!locked && Date.now() < deadline) {
    try {
      mkdirSync(STATE_DIR, { recursive: true });
      writeFileSync(lockPath, String(process.pid), { flag: "wx" });
      locked = true;
    } catch {
      try {
        if (Date.now() - statSync(lockPath).mtimeMs > 5000) unlinkSync(lockPath);
      } catch (failure) {
        noteIgnoredFailureUnlessMissingFile("breaking a stale view-claim lock", failure);
      }
      await sleep(50);
    }
  }
  try {
    return await fn();
  } finally {
    if (locked) {
      try {
        unlinkSync(lockPath);
      } catch (failure) {
        noteIgnoredFailureUnlessMissingFile("releasing the view-claim lock", failure);
      }
    }
  }
}

async function cdpAlive(port) {
  try {
    const res = await fetch("http://127.0.0.1:" + String(port) + "/json/version", {
      signal: AbortSignal.timeout(1500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// launch=false is the host user-form fill's ask (see createSandBrowserOpRunner):
// a relaunched blank browser cannot serve a form that lives in a tab of the
// browser the user consented on, so the wait below would only delay the answer.
async function ensureChrome(port, display, launch) {
  if (await cdpAlive(port)) return;
  if (!launch) {
    throw new Error("The box browser is not running: nothing answers CDP on port " + String(port));
  }
  await new Promise((resolve) => {
    const child = spawn("box-chrome", ["--new-window"], {
      env: { ...process.env, DISPLAY: ":" + String(display) },
      stdio: "ignore",
    });
    child.on("error", () => resolve(undefined));
    child.on("exit", () => resolve(undefined));
    setTimeout(() => resolve(undefined), 45000);
  });
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (await cdpAlive(port)) return;
    await sleep(500);
  }
  throw new Error("The box browser's CDP endpoint did not come up on port " + String(port));
}

// A minimal raw CDP socket for the pre-connect sweep below, on the box
// image's playwright-core bundled ws client (the box's plain node has no
// global WebSocket). Every send resolves with the response message, or
// undefined on timeout/failure; it never rejects and never hangs.
async function openCdpSocket(wsUrl) {
  let WS;
  try {
    const { createRequire } = await import("node:module");
    WS = createRequire(import.meta.url)("playwright-core/lib/utilsBundle").ws;
  } catch {
    return undefined;
  }
  let ws;
  try {
    ws = new WS(wsUrl);
  } catch {
    return undefined;
  }
  const opened = await new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), 3000);
    ws.on("open", () => {
      clearTimeout(timer);
      resolve(true);
    });
    ws.on("error", () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
  if (!opened) {
    try {
      ws.close();
    } catch (failure) {
      noteIgnoredFailure("closing the unopened CDP probe socket", failure);
    }
    return undefined;
  }
  let nextId = 1;
  const pending = new Map();
  ws.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(String(data));
    } catch (failure) {
      noteIgnoredFailure("parsing a CDP probe message", failure);
      return;
    }
    if (msg.id !== undefined && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  });
  const send = (method, params, sessionId, timeoutMs) =>
    new Promise((resolve) => {
      const id = nextId++;
      const timer = setTimeout(() => {
        pending.delete(id);
        resolve(undefined);
      }, timeoutMs);
      pending.set(id, (msg) => {
        clearTimeout(timer);
        resolve(msg);
      });
      const payload = { id, method, params: params !== undefined ? params : {} };
      if (sessionId !== undefined) payload.sessionId = sessionId;
      try {
        ws.send(JSON.stringify(payload));
      } catch {
        clearTimeout(timer);
        pending.delete(id);
        resolve(undefined);
      }
    });
  return {
    send,
    close: () => {
      try {
        ws.close();
      } catch (failure) {
        noteIgnoredFailure("closing the CDP probe socket", failure);
      }
    },
  };
}

function urlsOf(targets) {
  return targets.map((t) => stripUrlCredentials(String(t.url))).join(" ");
}

// Chrome lists the most recently active target first.
function rememberTargets(state, targets) {
  const listed = new Set(targets.map((t) => t.id));
  const known = new Set(state.recentTargets);
  state.recentTargets = [
    ...state.recentTargets.filter((id) => listed.has(id)),
    ...targets
      .filter((t) => !known.has(t.id))
      .map((t) => t.id)
      .reverse(),
  ];
}

function touchRecent(state, ids) {
  const touched = new Set(ids);
  state.recentTargets = [...state.recentTargets.filter((id) => !touched.has(id)), ...ids];
}

function requestedView(request, state) {
  const explicit = typeof request.viewId === "string" && request.viewId.length > 0;
  return { viewId: explicit ? request.viewId : (state.lastViewId ?? "default"), explicit };
}

function tabsOverCap(live, request, state) {
  const excess = live.length - TAB_CAP;
  if (excess <= 0) return [];
  const lastTarget = state.lastViewId === undefined ? undefined : state.views[state.lastViewId];
  const kept = new Set([state.views[requestedView(request, state).viewId], lastTarget]);
  const rank = new Map(state.recentTargets.map((id, i) => [id, i]));
  return live
    .filter((t) => !kept.has(t.id))
    .sort((a, b) => rank.get(a.id) - rank.get(b.id))
    .slice(0, excess);
}

// A discarded tab (Memory Saver, or any lifecycle discard) keeps a page target
// in the target list but has no renderer, so a renderer-bound command sent to
// it never answers. playwright's connectOverCDP auto-attaches to EVERY page,
// so one discarded tab hangs the whole connect and every driver call fails.
// Reviving the tab (activating it so Chrome reloads it) hands back the memory
// Chrome just reclaimed and, on a box full of heavy tabs, feeds the OOM that
// caused the discard, so discarded tabs are closed instead; the view keeps its
// last URL and resolvePage tells the agent to navigate again. No CDP field
// says "discarded", and a page whose script holds the main thread is just as
// silent, so only silence for the whole DISCARDED_TAB_SILENCE_MS closes a tab:
// a discarded tab never answers, a busy page answers once its script yields,
// and a CDP error is an answer. Best-effort throughout: on any failure the
// plain connect proceeds and reports its own error.
async function sweepTabs(port, request, state) {
  let socket;
  try {
    const base = "http://127.0.0.1:" + String(port);
    const listRes = await fetch(base + "/json/list", { signal: AbortSignal.timeout(1500) });
    if (!listRes.ok) return [];
    const targets = (await listRes.json()).filter((t) => t.type === "page");
    rememberTargets(state, targets);
    if (targets.length === 0) return [];
    const versionRes = await fetch(base + "/json/version", { signal: AbortSignal.timeout(1500) });
    if (!versionRes.ok) return [];
    const wsUrl = (await versionRes.json()).webSocketDebuggerUrl;
    if (typeof wsUrl !== "string" || wsUrl.length === 0) return [];
    socket = await openCdpSocket(wsUrl);
    if (socket === undefined) return [];
    // Attaching is answered by the browser process, so a refused or silent
    // attach says nothing about the renderer and never marks a tab discarded.
    const rendererState = async (targetId) => {
      const attached = await socket.send(
        "Target.attachToTarget",
        { targetId, flatten: true },
        undefined,
        2000,
      );
      if (attached === undefined || attached.result === undefined) return "hidden";
      const sessionId = attached.result.sessionId;
      const evaluated = await socket.send(
        "Runtime.evaluate",
        { expression: "document.visibilityState", returnByValue: true },
        sessionId,
        DISCARDED_TAB_SILENCE_MS,
      );
      socket.send("Target.detachFromTarget", { sessionId }, undefined, 1000);
      if (evaluated === undefined) return undefined;
      return evaluated.result?.result?.value === "visible" ? "visible" : "hidden";
    };
    const states = await Promise.all(targets.map((t) => rendererState(t.id)));
    const discarded = targets.filter((_, i) => states[i] === undefined);
    const onScreen = targets.filter((_, i) => states[i] === "visible").map((t) => t.id);
    touchRecent(state, onScreen.reverse());
    const evicted = tabsOverCap(
      targets.filter((_, i) => states[i] !== undefined),
      request,
      state,
    );
    const closing = [...discarded, ...evicted];
    if (closing.length === 0) return [];
    await Promise.all(
      closing.map((t) => socket.send("Target.closeTarget", { targetId: t.id }, undefined, 2000)),
    );
    const closed = new Set(closing.map((t) => t.id));
    state.recentTargets = state.recentTargets.filter((id) => !closed.has(id));
    if (discarded.length > 0) {
      console.error(
        "closed " + String(discarded.length) + " discarded tab(s): " + urlsOf(discarded),
      );
    }
    if (evicted.length > 0) {
      console.error(
        "closed " +
          String(evicted.length) +
          " tab(s) over the " +
          String(TAB_CAP) +
          "-tab cap: " +
          urlsOf(evicted),
      );
    }
    return evicted;
  } catch (failure) {
    noteIgnoredFailure("sweeping the tabs", failure);
    return [];
  } finally {
    if (socket !== undefined) socket.close();
  }
}

async function targetIdOf(context, page) {
  const session = await context.newCDPSession(page);
  try {
    const info = await session.send("Target.getTargetInfo");
    return info.targetInfo.targetId;
  } finally {
    await detachOrNote(session, "target-id");
  }
}

async function pagesByTargetId(context) {
  const byTarget = new Map();
  for (const p of context.pages().filter((page) => !page.isClosed())) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        byTarget.set(await targetIdOf(context, p), p);
        break;
      } catch {
        await sleep(150);
      }
    }
  }
  return byTarget;
}

function readoptableUrl(state, viewId) {
  const lastUrl = state.urls[viewId];
  return typeof lastUrl === "string" && lastUrl.length > 0 && lastUrl !== "about:blank"
    ? lastUrl
    : undefined;
}

function unclaimedTabShowing(byTarget, url, claimed) {
  for (const [targetId, page] of byTarget) {
    if (stripUrlCredentials(page.url()) === url && !claimed.has(targetId)) return [targetId, page];
  }
  return undefined;
}

function lastUsedTab(state, byTarget) {
  const lastTarget = state.lastViewId !== undefined ? state.views[state.lastViewId] : undefined;
  const pages = [...byTarget.values()];
  return (
    (lastTarget !== undefined ? byTarget.get(lastTarget) : undefined) ??
    pages.filter((p) => p.url() !== "about:blank").pop() ??
    pages[pages.length - 1]
  );
}

async function claimUnclaimedTabShowing(request, state, viewId, byTarget, url) {
  let page;
  await withViewClaimLock(request.display, async () => {
    // Re-read the persisted views inside the lock: a concurrent driver
    // process may have claimed a candidate after this one loaded state.
    const persisted = loadState(request.display);
    const claimed = new Set([...Object.values(state.views), ...Object.values(persisted.views)]);
    const found = unclaimedTabShowing(byTarget, url, claimed);
    if (found === undefined) return;
    const [targetId, tab] = found;
    page = tab;
    state.views[viewId] = targetId;
    saveState(request.display, { views: { [viewId]: targetId } });
  });
  return page;
}

async function resolvePage(request, context, state) {
  const { viewId, explicit } = requestedView(request, state);
  const mappedTarget = state.views[viewId];
  let byTarget = await pagesByTargetId(context);
  let page = mappedTarget !== undefined ? byTarget.get(mappedTarget) : undefined;
  if (page === undefined && mappedTarget !== undefined) {
    const deadline = Date.now() + 5000;
    while (page === undefined && Date.now() < deadline) {
      await sleep(400);
      byTarget = await pagesByTargetId(context);
      page = byTarget.get(mappedTarget);
    }
  }
  // Discarding a tab destroys its target and lists it again under a NEW
  // targetId with the same URL, so a mapped target that never comes back may
  // be the view's tab discarded (Memory Saver) and reloaded by a user click
  // rather than closed. Re-adopt the tab by its last recorded URL instead of
  // falling through to a blank new tab — only a tab no other view claims, so
  // two same-URL views cannot collapse.
  const lastUrl = readoptableUrl(state, viewId);
  if (page === undefined && mappedTarget !== undefined && lastUrl !== undefined) {
    page = await claimUnclaimedTabShowing(request, state, viewId, byTarget, lastUrl);
  }
  // The named view's tab is gone (closed by sweepTabs as discarded or over
  // the cap, or by anyone else) and no other tab shows its URL. Only navigate
  // may reopen the view in a fresh tab below; every other op would run against
  // a blank page and report nonsense, so it names the loss instead.
  if (page === undefined && mappedTarget !== undefined && explicit && request.op !== "navigate") {
    throw new Error(
      "View " +
        JSON.stringify(viewId) +
        " has no open tab: Chrome discarded it under memory pressure or it was closed." +
        (lastUrl !== undefined ? " It last showed " + lastUrl + "." : "") +
        " Use browser_navigate to reopen it.",
    );
  }
  // A view's FIRST use never mints a fresh about:blank tab beside live pages:
  // after a host user-form fill (or an earlier agent's work) the relevant page
  // is the display's last-used tab, and a new dedicated blank tab would strand
  // this agent's tools on about:blank while the filled page sits in another
  // tab. Non-navigating ops adopt the last-used tab, falling back to the most
  // recent real tab, then any tab. Navigate is the exception — adopting a live
  // page would clobber it — so a fresh view's navigate instead reuses an
  // existing UNCLAIMED blank tab when one exists (claimed under the lock so
  // two concurrent fresh views cannot navigate the same blank) and otherwise
  // opens its own tab below.
  if (page === undefined && mappedTarget === undefined && byTarget.size > 0) {
    page =
      request.op === "navigate"
        ? await claimUnclaimedTabShowing(request, state, viewId, byTarget, "about:blank")
        : lastUsedTab(state, byTarget);
  }
  if (page === undefined && !explicit && byTarget.size > 0) {
    const pages = [...byTarget.values()];
    page = pages[pages.length - 1];
  }
  if (page === undefined) {
    page = await context.newPage();
  }
  state.views[viewId] = await targetIdOf(context, page);
  state.lastViewId = viewId;
  page.setDefaultTimeout(ACTION_TIMEOUT_MS);
  frameRefsByPage.set(page, state.frameRefs[viewId]);
  return { page, viewId };
}

function expectedPage(state, { viewId, explicit }, byTarget) {
  const mappedTarget = state.views[viewId];
  if (mappedTarget === undefined) return lastUsedTab(state, byTarget);
  const mapped = byTarget.get(mappedTarget);
  if (mapped !== undefined) return mapped;
  const lastUrl = readoptableUrl(state, viewId);
  const showing =
    lastUrl === undefined
      ? undefined
      : unclaimedTabShowing(byTarget, lastUrl, new Set(Object.values(state.views)));
  if (showing !== undefined) return showing[1];
  return explicit ? undefined : [...byTarget.values()].pop();
}

// Host-side record (state file, out of page script's reach) of the walked frame that minted each ref.
const frameRefsByPage = new WeakMap();

const REF_LOOKUP_FN = ({ ref: r, token }) => {
  if (token !== undefined && globalThis.__sandRefState?.frameToken !== token) return "missing";
  const refs = globalThis.__sandRefs;
  if (refs == null || typeof refs.get !== "function") return "missing";
  const el = refs.get(r);
  if (el !== undefined && el !== null) {
    return el.isConnected === false ? "detached" : el;
  }
  const held = globalThis.__sandRefState?.byRef?.get(r);
  const node = held != null && typeof held.deref === "function" ? held.deref() : undefined;
  if (node != null && node.isConnected === false) return "detached";
  return "missing";
};

async function refHandle(page, ref) {
  const owners = frameRefsByPage.get(page);
  const token = owners != null ? owners[ref] : undefined;
  let why = "missing";
  if (typeof token !== "string") {
    const top = await page.evaluateHandle(REF_LOOKUP_FN, { ref });
    const topElement = top.asElement();
    if (topElement !== null) return topElement;
    why = await top.jsonValue().catch(() => "missing");
  } else {
    for (const frame of page.frames()) {
      if (frame === page.mainFrame() || frame.isDetached()) continue;
      const handle = await withDeadline(
        frame.evaluateHandle(REF_LOOKUP_FN, { ref, token }),
        FRAME_EVALUATE_TIMEOUT_MS,
        "ref lookup timed out",
      ).catch((failure) => {
        noteIgnoredFailure("looking a ref up in a child frame", failure);
        return undefined;
      });
      if (handle === undefined) continue;
      const element = handle.asElement();
      if (element !== null) return element;
      if ((await handle.jsonValue().catch(() => "missing")) === "detached") {
        why = "detached";
        break;
      }
    }
  }
  throw new Error(
    "Unknown or stale ref " +
      JSON.stringify(ref) +
      (why === "detached"
        ? ": the page replaced that element since the snapshot (a re-render or route change)"
        : "") +
      ". Take a fresh browser_snapshot and use a ref from it.",
  );
}

const SNAPSHOT_FN = (opts) => {
  const doc = globalThis.document;
  const win = globalThis.window;
  let state = globalThis.__sandRefState;
  if (state == null || typeof state.counter !== "number" || state.byRef == null) {
    state = {
      generation: String(performance.timeOrigin),
      counter: 0,
      byElement: new WeakMap(),
      byRef: new Map(),
    };
    globalThis.__sandRefState = state;
  }
  const refStart = typeof opts.refStart === "number" ? opts.refStart : 0;
  if (state.counter < refStart) state.counter = refStart;
  if (typeof opts.frameToken === "string" && typeof state.frameToken !== "string") {
    state.frameToken = opts.frameToken;
  }
  for (const [heldRef, held] of state.byRef) {
    const node = held != null && typeof held.deref === "function" ? held.deref() : undefined;
    if (node == null || node.isConnected !== true) state.byRef.delete(heldRef);
  }
  if (
    globalThis.__sandRefs == null ||
    typeof globalThis.__sandRefs.get !== "function" ||
    globalThis.__sandRefs instanceof Map
  ) {
    globalThis.__sandRefs = {
      get: (r) => {
        const current = globalThis.__sandRefState;
        if (current == null) return undefined;
        const held = current.byRef.get(r);
        const node = held != null && typeof held.deref === "function" ? held.deref() : undefined;
        return node != null && node.isConnected === true ? node : undefined;
      },
    };
  }
  let refsThisWalk = 0;
  const lines = ["[gen=" + state.generation + "]"];
  const maxNodes = 400;
  let nodeCount = 0;
  const shadowOf = (el) => el.shadowRoot ?? el.__sandShadowRoot ?? null;
  let closedShadowSuspects = 0;
  const interactiveMatcher =
    "a[href], button, input, select, textarea, summary, " +
    '[role="button"], [role="link"], [role="checkbox"], [role="radio"], ' +
    '[role="tab"], [role="menuitem"], [role="menuitemcheckbox"], [role="combobox"], ' +
    '[role="option"], [role="switch"], [role="searchbox"], [role="textbox"], ' +
    '[role="slider"], [contenteditable="true"], [onclick]';
  const hidesSubtree = (el) => {
    if (el.getAttribute("aria-hidden") === "true") return true;
    // The element's OWN window: elements from a pierced same-origin child
    // frame belong to another document, whose getComputedStyle is the one
    // that knows them.
    const view =
      el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : win;
    const style = view.getComputedStyle(el);
    return style.display === "none" || style.visibility === "hidden";
  };
  const hasVisibleBox = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  const isVisible = (el) => !hidesSubtree(el) && hasVisibleBox(el);
  const emptyBoxClipsEverythingInsideIt = (el) => {
    const view =
      el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : win;
    const style = view.getComputedStyle(el);
    return style.overflowX !== "visible" || style.overflowY !== "visible";
  };
  // A split-character code box (six maxlength=1 inputs) holds one character
  // of a host-filled secret, and the per-box element marks die when a form
  // re-render replaces the nodes. Registering bare single characters in the
  // value set would redact every lone digit on the page (quantity fields),
  // so a box is instead judged by its GROUP: when the group's concatenation
  // sits inside any registered secret (substring, so a partially distributed
  // fill from a failed write is still covered), the box's value is secret.
  const splitGroupHeldValue = (el) => {
    if (el.getAttribute("maxlength") !== "1") return undefined;
    let container = el.parentElement;
    for (let depth = 0; container !== null && depth < 3; depth++) {
      const boxes = [...container.querySelectorAll('input[maxlength="1"]')];
      if (boxes.length >= 2 && boxes.includes(el)) {
        return boxes.map((box) => box.value).join("");
      }
      container = container.parentElement;
    }
    return undefined;
  };
  const isSecretSplitGroupMember = (el, secretFillValues) => {
    if (typeof secretFillValues[Symbol.iterator] !== "function") return false;
    const held = splitGroupHeldValue(el);
    if (held === undefined || held.length === 0) return false;
    for (const registered of secretFillValues) {
      if (typeof registered === "string" && registered.length > 1 && registered.includes(held)) {
        return true;
      }
    }
    return false;
  };
  // Secret fills that type per key (split OTP, masked-input retry) deposit
  // keystrokes wherever document focus moves, so a page that steals focus
  // mid-fill can divert a multi-character fragment into a control the fill
  // never targeted — one that carries no element mark and holds no exact
  // set member. Any value whose significant characters sit inside a
  // registered secret (raw or reformatted by a mask) is treated as such a
  // fragment and redacted; single characters stay visible, because blanking
  // every lone digit on the page would over-redact wildly. The reverse
  // containment redacts too: text that HOLDS a whole registered secret
  // (a contenteditable that appended the glyphs to its existing content).
  const secretSignificant = (text) =>
    String(text ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  const isSecretFragmentValue = (candidate, secretFillValues) => {
    if (typeof secretFillValues[Symbol.iterator] !== "function") return false;
    if (typeof candidate !== "string") return false;
    const sig = secretSignificant(candidate);
    for (const registered of secretFillValues) {
      if (typeof registered !== "string" || registered.length <= 1) continue;
      if (candidate.length >= 2 && registered.includes(candidate)) return true;
      const sigRegistered = secretSignificant(registered);
      if (sig.length >= 2 && sigRegistered.includes(sig)) return true;
      if (candidate.includes(registered)) return true;
      if (sigRegistered.length > 1 && sig.includes(sigRegistered)) return true;
    }
    return false;
  };
  // The registered sets an element is judged against: its own window's (a
  // pierced frame's controls register there when they are the target) and
  // the top window's (the mark registers on top too, so a fragment a
  // focus-steal diverted into ANOTHER frame's control is still recognized).
  const secretFillSetsFor = (el) => {
    const sets = [];
    const view =
      el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : win;
    const own = view.__sandSecretFillValues;
    if (own !== undefined && own !== null) sets.push(own);
    const top = win.__sandSecretFillValues;
    if (view !== win && top !== undefined && top !== null) sets.push(top);
    return sets;
  };
  const isSecretForElement = (el, candidate, checkSplitGroup) =>
    secretFillSetsFor(el).some(
      (set) =>
        (typeof set.has === "function" && set.has(candidate)) ||
        (checkSplitGroup && isSecretSplitGroupMember(el, set)) ||
        isSecretFragmentValue(candidate, set),
    );
  const SECRET_AUTOCOMPLETE_TOKEN =
    /^(?:current-password|new-password|one-time-code|cc-(?:number|csc|exp(?:-month|-year)?))$/;
  const declaresSecretValue = (el) =>
    (el.getAttribute("type") ?? "").toLowerCase() === "password" ||
    (el.getAttribute("autocomplete") ?? "")
      .toLowerCase()
      .split(/\s+/)
      .some((token) => SECRET_AUTOCOMPLETE_TOKEN.test(token));
  // Visible frames whose document this snapshot could not enter (cross-origin
  // content, or a frame still loading). Reported instead of guessed at, so
  // the host and the model can tell "not on the page" apart from "may live in
  // a frame the snapshot cannot see". Hidden frames (tracking pixels) never
  // count. Manual identity dedupe makes a frame met by both walks count once.
  const unreachableFrames = [];
  let pierceReach = null;
  let pierceFrames = [];
  const withReachedFrameElements = (result) => {
    if (opts.__sandFrameIdentityEnvelope !== true) return result;
    return {
      result,
      reachedFrameElements: typeof opts.selector === "string" ? pierceFrames : unreachableFrames,
    };
  };
  const frameDocumentOf = (el) => {
    let child;
    try {
      child = el.contentDocument && el.contentDocument.body ? el.contentDocument : null;
    } catch {
      child = null;
    }
    if (child) return child;
    if (isVisible(el)) {
      let alreadyReached = false;
      for (let index = 0; index < unreachableFrames.length; index++) {
        if (unreachableFrames[index] !== el) continue;
        alreadyReached = true;
        break;
      }
      if (!alreadyReached) unreachableFrames[unreachableFrames.length] = el;
      if (pierceReach !== null) pierceReach[pierceReach.length] = el;
    }
    return undefined;
  };
  const isClosedShadowSuspect = (el) =>
    el.tagName.includes("-") &&
    shadowOf(el) === null &&
    el.querySelector(interactiveMatcher) === null;
  const isDefinedCustomElement = (el) => {
    const view =
      el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : win;
    return (
      view.customElements !== undefined &&
      view.customElements.get(el.tagName.toLowerCase()) !== undefined
    );
  };
  const closedShadowUnlockPending = (el) => {
    const tried = el.__sandClosedShadowUnlockTried;
    if (tried === true) return false;
    if (tried === "undefined") return isDefinedCustomElement(el);
    return true;
  };
  // Deep querySelector for the scoped snapshot: searches the top document,
  // then open shadow roots and same-origin frames, breadth-first. The
  // explicit ">>>" combinator re-roots each following stage at the previous
  // match, so a pierce selector like
  // 'faceplate-text-input[name="username"] >>> input[name="username"]'
  // resolves the inner control.
  // A model routinely authors a target the CSS engine cannot parse: a
  // Playwright-style `text=Email`, `button:has-text("Next")`, an `xpath=//…`
  // or a `form >> input`. `querySelectorAll` throws a SyntaxError on those,
  // which used to take the whole scoped snapshot op down as a non-infra
  // `ok:false` — the host then recorded target_missing AND the heal pass
  // treated the failed op as unavailable, so it never fell back to the card
  // label that would have resolved the very field on the page. An unparsable
  // stage (the throw is caught where the query runs, since selector engines
  // validate lazily) is a clean no-match flagged `invalid`, so the op still
  // returns ok and the host heals by label.
  const deepQuery = (selector) => {
    const stages = selector
      .split(">>>")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
    if (stages.length === 0) {
      return { element: null, closedShadow: false, invalid: true };
    }
    // Duplicate matches are the rule on real pages, not the edge case:
    // responsive sites render twin widgets (desktop + mobile) that reuse the
    // same ids and names with one twin hidden — aa.com's adc-text-input
    // booking fields are the canonical shape — and tree-order querySelector
    // hands back whichever twin comes first. A hidden first match used to
    // make the scoped snapshot mint nothing (target_missing) while a
    // perfectly fillable visible twin sat further down the page, so each
    // stage prefers the first VISIBLE match anywhere the deep walk can see
    // and keeps the first hidden match only as the fallback for diagnosis
    // when nothing visible matches.
    const queryStage = (roots, stage) => {
      const queue = [...roots];
      let hiddenFallback = null;
      while (queue.length > 0) {
        const scope = queue.shift();
        for (const found of scope.querySelectorAll(stage)) {
          if (isVisible(found)) return found;
          if (hiddenFallback === null) hiddenFallback = found;
        }
        for (const el of scope.querySelectorAll("*")) {
          const shadow = shadowOf(el);
          if (shadow) queue.push(shadow);
          const tag = el.tagName ? el.tagName.toLowerCase() : "";
          if (tag === "iframe" || tag === "frame") {
            const childDoc = frameDocumentOf(el);
            if (childDoc) queue.push(childDoc);
          }
        }
      }
      return hiddenFallback;
    };
    const searchRootsOf = (from) => {
      if (from === null) return [doc];
      const roots = [];
      const shadow = shadowOf(from);
      if (shadow) roots.push(shadow);
      if (/^(iframe|frame)$/i.test(from.tagName ?? "")) {
        const childDoc = frameDocumentOf(from);
        if (childDoc) roots.push(childDoc);
      }
      roots.push(from);
      return roots;
    };
    let matched = null;
    for (let stage = 0; stage < stages.length; stage++) {
      const unreachableFramesThisStageReached = [];
      pierceReach = unreachableFramesThisStageReached;
      let next;
      try {
        next = queryStage(searchRootsOf(matched), stages[stage]);
      } catch {
        pierceReach = null;
        return { element: null, closedShadow: false, invalid: true };
      }
      pierceReach = null;
      if (next === null) {
        pierceFrames = unreachableFramesThisStageReached;
        return {
          element: null,
          closedShadow: matched !== null && isClosedShadowSuspect(matched),
          ...(unreachableFramesThisStageReached.length > 0 ? { pierceStage: stage } : {}),
        };
      }
      matched = next;
    }
    return { element: matched, closedShadow: false };
  };
  const trim = (text, max) => {
    const t = (text ?? "").replace(/\s+/g, " ").trim();
    return t.length > max ? t.slice(0, max) + "…" : t;
  };
  const composedTextOf = (root) => {
    const seen = new Set();
    const visit = (node, depth) => {
      if (depth > 20 || seen.has(node)) return "";
      seen.add(node);
      if (node.nodeType === 3) return node.nodeValue ?? "";
      if (node.nodeType !== 1 && node.nodeType !== 11) return "";
      let children = node.childNodes;
      if (
        node.nodeType === 1 &&
        node.tagName.toLowerCase() === "slot" &&
        typeof node.assignedNodes === "function"
      ) {
        const assigned = node.assignedNodes({ flatten: true });
        if (assigned.length > 0) children = assigned;
      }
      let text = "";
      for (const child of children) text += " " + visit(child, depth + 1);
      return text;
    };
    return visit(root, 0);
  };
  const nameOf = (el) => {
    const aria = el.getAttribute("aria-label");
    if (aria) return trim(aria, 80);
    // aria-labelledby resolves in the element's own root (its shadow root or
    // its document): shadow-DOM inputs are commonly named this way and carry
    // no aria-label of their own.
    const labelledby = el.getAttribute("aria-labelledby");
    if (labelledby) {
      const rootNode = el.getRootNode();
      const scope =
        rootNode && typeof rootNode.getElementById === "function" ? rootNode : el.ownerDocument;
      const text = labelledby
        .split(/\s+/)
        .map((id) => {
          const target = scope.getElementById(id);
          return target ? composedTextOf(target) : "";
        })
        .join(" ");
      const trimmed = trim(text, 80);
      if (trimmed) return trimmed;
    }
    if (el.labels && el.labels.length > 0) return trim(el.labels[0].innerText, 80);
    const placeholder = el.getAttribute("placeholder");
    if (placeholder) return trim(placeholder, 80);
    const alt = el.getAttribute("alt");
    if (alt) return trim(alt, 80);
    const title = el.getAttribute("title");
    if (title) return trim(title, 80);
    return trim(el.innerText ?? el.value ?? "", 80);
  };
  const roleOf = (el) => {
    const explicit = el.getAttribute("role");
    if (explicit) return explicit;
    const tag = el.tagName.toLowerCase();
    if (tag === "a") return "link";
    if (tag === "button" || tag === "summary") return "button";
    if (tag === "select") return "combobox";
    if (tag === "textarea") return "textbox";
    if (tag === "input") {
      const type = (el.getAttribute("type") ?? "text").toLowerCase();
      if (type === "button" || type === "submit" || type === "reset") return "button";
      if (type === "checkbox") return "checkbox";
      if (type === "radio") return "radio";
      if (type === "range") return "slider";
      return "textbox";
    }
    if (/^h[1-6]$/.test(tag)) return "heading";
    return tag;
  };
  const describe = (el, depth) => {
    const role = roleOf(el);
    let name = nameOf(el);
    // An editable's own text can be its snapshot name — a contenteditable's
    // content directly, and an input's or textarea's through nameOf's
    // innerText/value fallback — so glyphs a focus-steal diverted into one
    // would serialize there rather than on a value= line. The secret checks
    // gate exactly those names: a label- or aria-derived name never carried
    // typed glyphs, and wiping a real field label that happens to sit
    // inside a secret would hide the very label the model targets by.
    const editableHost =
      el.isContentEditable === true || el.getAttribute("contenteditable") === "true";
    const isValueBearing = /^(input|textarea)$/i.test(el.tagName);
    const nameCameFromOwnContent =
      editableHost || (isValueBearing && name === trim(el.innerText ?? el.value ?? "", 80));
    // An own-content name carries the SAME signals as a value= line: the
    // element mark, the split group's concatenation, and the registered
    // sets. Anything weaker would let an unlabeled split-OTP box serialize
    // its digit as the line's name while its value= sits redacted.
    const nameIsSecret =
      nameCameFromOwnContent &&
      (el.hasAttribute("data-sand-secret-filled") ||
        declaresSecretValue(el) ||
        isSecretForElement(el, name, isValueBearing));
    if (name.length > 0 && nameIsSecret) {
      name = "<redacted>";
    }
    let line = "  ".repeat(Math.min(depth, 6)) + "- " + role;
    if (name) line += " " + JSON.stringify(name);
    if (el.matches(interactiveMatcher) && !el.disabled) {
      let ref;
      const cached = state.byElement.get(el);
      if (
        cached !== undefined &&
        (opts.probe === true || (cached.role === role && cached.name === name))
      ) {
        ref = cached.ref;
      } else {
        if (cached !== undefined) state.byRef.delete(cached.ref);
        state.counter += 1;
        ref = "e" + String(state.counter);
        state.byElement.set(el, { ref: ref, role: role, name: name });
      }
      state.byRef.set(ref, new WeakRef(el));
      refsThisWalk += 1;
      line += " [ref=" + ref + "]";
    }
    if (el.disabled) line += " disabled";
    if (el.checked === true) line += " checked";
    const tag = el.tagName.toLowerCase();
    if (
      (tag === "input" || tag === "textarea") &&
      typeof el.value === "string" &&
      el.value.length > 0
    ) {
      // A host-filled secret is redacted by two independent signals: the
      // driver's element mark (survives the site reformatting the value) and
      // the registered value sets (survive a re-render replacing the marked
      // element) — the element's own window's and the top window's, judged
      // by exact membership, the split group's concatenation, and fragment
      // containment (see isSecretForElement). Either signal alone redacts,
      // so a secret that landed in a plain text control is never serialized
      // back to the model.
      const hasSecretFillValue = isSecretForElement(el, el.value, tag === "input");
      const isSecret =
        declaresSecretValue(el) || el.hasAttribute("data-sand-secret-filled") || hasSecretFillValue;
      line += " value=" + (isSecret ? '"<redacted>"' : JSON.stringify(trim(el.value, 40)));
    }
    if (tag === "a") {
      const href = el.getAttribute("href");
      if (href && !href.startsWith("javascript:"))
        line += " href=" + JSON.stringify(trim(href, 80));
    }
    return line;
  };
  const walk = (el, depth) => {
    if (nodeCount >= maxNodes || depth > (opts.maxDepth ?? 20)) return;
    // Instanceof against the element's OWN window: a pierced child frame's
    // elements are instances of THAT frame's HTMLElement, never the top one.
    const view =
      el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : win;
    if (!(el instanceof view.HTMLElement)) return;
    const tag = el.tagName.toLowerCase();
    if (tag === "script" || tag === "style" || tag === "noscript") return;
    if (hidesSubtree(el)) return;
    const hasBox = hasVisibleBox(el);
    // Zero-size layout wrappers can contain painted controls, so omit their
    // own description but keep walking descendants. Frames still require a
    // visible box before traversal or unreachable accounting.
    if (tag === "iframe" || tag === "frame") {
      if (!hasBox) return;
      const childDoc = frameDocumentOf(el);
      if (childDoc !== undefined) {
        for (const child of childDoc.body.children) walk(child, depth);
      }
      return;
    }
    if (!hasBox && emptyBoxClipsEverythingInsideIt(el)) return;
    const isInteractive = el.matches(interactiveMatcher);
    const isHeading = /^h[1-6]$/.test(tag);
    const isTextual =
      !opts.interactive &&
      (tag === "p" || tag === "li" || tag === "label" || tag === "td" || tag === "th");
    if (hasBox && !isInteractive && isClosedShadowSuspect(el)) {
      if (opts.settleClosedShadow === true) {
        el.__sandClosedShadowUnlockTried = isDefinedCustomElement(el) ? true : "undefined";
      } else if (closedShadowUnlockPending(el)) {
        closedShadowSuspects += 1;
      }
    }
    let childDepth = depth;
    if (
      hasBox &&
      (isInteractive ||
        isHeading ||
        (isTextual &&
          trim(el.innerText, 10).length > 0 &&
          el.querySelector(interactiveMatcher) === null))
    ) {
      nodeCount += 1;
      lines.push(describe(el, depth));
      childDepth = depth + 1;
      if (tag === "select") {
        const indent = "  ".repeat(Math.min(childDepth, 6));
        const options = [...el.options];
        const shown = 20;
        const listed = options.filter((option, index) => index < shown || option.selected);
        for (const option of listed) {
          const label = trim(option.label || option.text, 80);
          lines.push(
            indent +
              "- option" +
              (label ? " " + JSON.stringify(label) : "") +
              (option.disabled ? " disabled" : "") +
              (option.selected ? " selected" : ""),
          );
        }
        if (options.length > listed.length) {
          lines.push(indent + "(+" + String(options.length - listed.length) + " more options)");
        }
      }
      if (isInteractive || isTextual) return;
    }
    // An open shadow root's children walk like light children — the editable
    // controls of custom elements (e.g. <faceplate-text-input>) live there.
    // Both trees are covered exactly once: slotted light children stay in
    // el.children, the shadow tree's own nodes appear only here.
    const shadow = shadowOf(el);
    if (shadow) {
      for (const child of shadow.children) walk(child, childDepth);
    }
    for (const child of el.children) walk(child, childDepth);
  };
  let selectorDiagnosis;
  let root;
  if (opts.selector) {
    const queried = deepQuery(opts.selector);
    root = queried.element ?? undefined;
    selectorDiagnosis = {
      matched: queried.element !== null,
      closedShadow: queried.closedShadow,
      ...(queried.invalid === true ? { invalid: true } : {}),
      ...(queried.pierceStage !== undefined ? { pierceStage: queried.pierceStage } : {}),
    };
  } else {
    root = doc.body;
  }
  if (!root) {
    const noMatchLine =
      selectorDiagnosis !== undefined && selectorDiagnosis.invalid === true
        ? "(the target is not a valid CSS selector, so nothing was matched — a browser target is a CSS selector, a [ref=eN] from a snapshot, or the visible label text; Playwright-style text= / :has-text() / xpath= / >> targets are not supported)"
        : "(no matching element for selector)";
    return withReachedFrameElements({
      lines: ["[gen=" + state.generation + "]", noMatchLine],
      refCount: 0,
      counterEnd: state.counter,
      frameToken: state.frameToken,
      unreachableFrames: unreachableFrames.length,
      closedShadowSuspects,
      selector: selectorDiagnosis,
    });
  }
  walk(root, 0);
  if (nodeCount >= maxNodes)
    lines.push("(snapshot truncated at " + String(maxNodes) + " elements)");
  // A scoped snapshot that matched an element but minted nothing fillable is
  // the closed-shadow signature when the match is a custom element whose
  // internals nothing can reach.
  if (selectorDiagnosis !== undefined && refsThisWalk === 0 && isClosedShadowSuspect(root)) {
    selectorDiagnosis.closedShadow = true;
  }
  return withReachedFrameElements({
    lines,
    refCount: refsThisWalk,
    counterEnd: state.counter,
    frameToken: state.frameToken,
    unreachableFrames: unreachableFrames.length,
    closedShadowSuspects,
    selector: selectorDiagnosis,
  });
};

const FRAME_EVALUATE_TIMEOUT_MS = 4000;
const UNREACHABLE_FRAMES_NOTE =
  " frame(s) on this page could not be inspected — cross-origin and still loading, or otherwise unreadable — so fields inside them are NOT in this snapshot and have no refs)";

const PARENT_CAN_SCRIPT_FN = () => {
  try {
    return globalThis.parent.document !== null;
  } catch {
    return false;
  }
};

async function walkRootFrames(page) {
  const main = page.mainFrame();
  const roots = [];
  for (const frame of page.frames()) {
    if (frame === main || frame.isDetached()) continue;
    const scriptable = await withDeadline(
      frame.evaluate(PARENT_CAN_SCRIPT_FN),
      FRAME_EVALUATE_TIMEOUT_MS,
      "frame probe timed out",
    ).catch((failure) => noteIgnoredFailure("probing a frame's cross-origin boundary", failure));
    if (scriptable !== false) continue;
    const element = await frame
      .frameElement()
      .catch((failure) => noteIgnoredFailure("resolving a cross-origin frame's element", failure));
    if (element === undefined || element === null) continue;
    const box = await element.boundingBox().catch((failure) => {
      noteIgnoredFailure("measuring a cross-origin frame's box", failure);
      return null;
    });
    if (box === null || box.width <= 0 || box.height <= 0) continue;
    let depth = 0;
    for (let f = frame.parentFrame(); f !== null; f = f.parentFrame()) depth += 1;
    roots.push({ frame, element, depth });
  }
  roots.sort((a, b) => a.depth - b.depth);
  return roots;
}

const FRAME_ATTACH_WAIT_MS = 1500;
async function awaitWalkRootFrames(page, expected) {
  const deadline = Date.now() + FRAME_ATTACH_WAIT_MS;
  for (;;) {
    const roots = await walkRootFrames(page);
    if (roots.length >= expected || Date.now() >= deadline) return roots;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Page JS cannot see a closed shadow root, but CDP's pierced DOM tree can:
// resolve each to a live object and hang it on its host as __sandShadowRoot for
// the in-page helpers. Resolves to whether the document was scanned.
async function unlockClosedShadowRoots(context, page, frame) {
  let session;
  try {
    session = await context.newCDPSession(frame);
  } catch (failure) {
    noteIgnoredFailure("opening a CDP session for the closed-shadow unlock", failure);
    return false;
  }
  let scanned = false;
  try {
    const { root } = await withDeadline(
      session.send("DOM.getDocument", { depth: -1, pierce: true }),
      FRAME_EVALUATE_TIMEOUT_MS * 2,
      "DOM.getDocument timed out",
    );
    const closedRoots = [];
    const visit = (node) => {
      for (const shadow of node.shadowRoots ?? []) {
        if (shadow.shadowRootType === "closed") closedRoots.push(shadow.backendNodeId);
        visit(shadow);
      }
      for (const child of node.children ?? []) visit(child);
      if (node.contentDocument) visit(node.contentDocument);
      if (node.templateContent) visit(node.templateContent);
    };
    visit(root);
    scanned = true;
    for (const backendNodeId of closedRoots) {
      try {
        const { object } = await session.send("DOM.resolveNode", { backendNodeId });
        await session.send("Runtime.callFunctionOn", {
          objectId: object.objectId,
          functionDeclaration: "function () { if (this.host) this.host.__sandShadowRoot = this; }",
        });
        await session
          .send("Runtime.releaseObject", { objectId: object.objectId })
          .catch((failure) => noteIgnoredFailure("releasing an unlocked shadow root", failure));
      } catch (failure) {
        noteIgnoredFailure("unlocking a closed shadow root", failure);
      }
    }
  } catch (failure) {
    noteIgnoredFailure("listing the closed shadow roots", failure);
  } finally {
    await detachOrNote(session, "closed-shadow unlock's");
  }
  return scanned;
}

async function hostFramesFromElements(elementsHandle) {
  const frames = new Set();
  const handles = await elementsHandle.getProperties();
  for (const handle of handles.values()) {
    try {
      const element = handle.asElement();
      if (element === null) continue;
      const frame = await element.contentFrame().catch((failure) => {
        noteIgnoredFailure("resolving a walked frame's host identity", failure);
        return null;
      });
      if (frame !== null) frames.add(frame);
    } finally {
      await handle.dispose();
    }
  }
  return frames;
}

async function evaluateSnapshotFrame(frame, opts) {
  const envelope = await frame.evaluateHandle(SNAPSHOT_FN, {
    ...opts,
    __sandFrameIdentityEnvelope: true,
  });
  const parts = await envelope.getProperties();
  try {
    const resultHandle = parts.get("result");
    const reachedHandle = parts.get("reachedFrameElements");
    if (resultHandle === undefined || reachedHandle === undefined) {
      throw new Error("Snapshot frame identity envelope was incomplete");
    }
    return {
      ...(await resultHandle.jsonValue()),
      reachedHostFrames: await hostFramesFromElements(reachedHandle),
    };
  } finally {
    for (const handle of parts.values()) await handle.dispose();
    await envelope.dispose();
  }
}

async function snapshotFrame(context, page, frame, opts) {
  let result = await evaluateSnapshotFrame(frame, opts);
  if (result.closedShadowSuspects > 0 && (await unlockClosedShadowRoots(context, page, frame))) {
    result = await evaluateSnapshotFrame(frame, { ...opts, settleClosedShadow: true });
  }
  return result;
}

function frameLabelOf(element) {
  return element
    .evaluate((el) => {
      const title = el.getAttribute("title") ?? el.getAttribute("name") ?? "";
      let host = "";
      try {
        host = new URL(el.src, el.ownerDocument.baseURI).host;
      } catch {
        host = "";
      }
      return [title, host].filter((part) => part.length > 0).join(" ");
    })
    .catch(() => "");
}

const RAISE_REF_COUNTER_FLOOR_FN = (floor) => {
  const state = globalThis.__sandRefState;
  if (state != null && typeof state.counter === "number" && state.counter < floor) {
    state.counter = floor;
  }
};

function remainingPierceSelector(selector, fromStage) {
  return selector
    .split(">>>")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .slice(fromStage)
    .join(" >>> ");
}

const SNAPSHOT_REF_PATTERN = /\[ref=(e\d+)\]/;

function recordRefOwners(refOwners, lines, owner) {
  for (const line of lines) {
    const match = SNAPSHOT_REF_PATTERN.exec(line);
    if (match !== null) refOwners[match[1]] = owner;
  }
}

async function snapshotAcrossFrames(context, page, opts) {
  const scoped = typeof opts.selector === "string";
  const main = await snapshotFrame(context, page, page, { ...opts, refStart: 0 });
  const lines = [...main.lines];
  const refOwners = {};
  recordRefOwners(refOwners, main.lines, null);
  let refCount = main.refCount;
  let nextRef = typeof main.counterEnd === "number" ? main.counterEnd : refCount;
  let unreachable = main.unreachableFrames;
  let closedShadowSuspects = main.closedShadowSuspects ?? 0;
  let selectorDiagnosis = main.selector;
  const finish = () => {
    if (unreachable > 0) lines.push("(" + String(unreachable) + UNREACHABLE_FRAMES_NOTE);
    return {
      lines,
      refCount,
      refOwners,
      unreachableFrames: unreachable,
      closedShadowSuspects,
      selector: selectorDiagnosis,
    };
  };
  if (unreachable === 0) return finish();
  if (
    scoped &&
    (selectorDiagnosis === undefined ||
      selectorDiagnosis.matched ||
      selectorDiagnosis.pierceStage === undefined)
  ) {
    return finish();
  }
  const roots = await awaitWalkRootFrames(page, unreachable);
  if (roots.length === 0) return finish();
  const searchedParents = new Map([
    [
      page.mainFrame(),
      {
        selector: opts.selector,
        pierceStage: selectorDiagnosis?.pierceStage,
        reachedFrames: main.reachedHostFrames,
      },
    ],
  ]);
  const crossOriginFrames = new Set(roots.map((root) => root.frame));
  const searchedAncestorOf = (frame) => {
    for (let ancestor = frame.parentFrame(); ancestor !== null; ancestor = ancestor.parentFrame()) {
      const searched = searchedParents.get(ancestor);
      if (searched !== undefined) return searched;
      if (crossOriginFrames.has(ancestor)) return undefined;
    }
    return undefined;
  };
  let successfullyWalkedFrames = 0;
  for (const { frame, element } of roots) {
    const parent = searchedAncestorOf(frame);
    if (parent === undefined || (scoped && parent.pierceStage === undefined)) continue;
    if (!parent.reachedFrames.has(frame)) continue;
    const selector = scoped
      ? remainingPierceSelector(parent.selector, parent.pierceStage)
      : undefined;
    const frameOpts = { ...opts, selector, refStart: nextRef, frameToken: randomUUID() };
    let result;
    try {
      result = await withDeadline(
        snapshotFrame(context, page, frame, frameOpts),
        FRAME_EVALUATE_TIMEOUT_MS * 3,
        "the frame snapshot timed out",
      );
    } catch (failure) {
      noteIgnoredFailure("snapshotting a cross-origin frame", failure);
      continue;
    }
    searchedParents.set(frame, {
      selector,
      pierceStage: result.selector?.pierceStage,
      reachedFrames: result.reachedHostFrames,
    });
    successfullyWalkedFrames += 1;
    if (typeof result.counterEnd === "number") nextRef = Math.max(nextRef, result.counterEnd);
    unreachable += result.unreachableFrames;
    closedShadowSuspects += result.closedShadowSuspects ?? 0;
    if (scoped) {
      if (result.selector === undefined || !result.selector.matched) continue;
      lines.length = 0;
      selectorDiagnosis = result.selector;
    }
    if (typeof result.frameToken === "string") {
      recordRefOwners(refOwners, result.lines, result.frameToken);
    }
    refCount += result.refCount;
    const frameLines = result.lines.filter((line) => !line.startsWith("[gen="));
    if (frameLines.length > 0) {
      lines.push(
        '- frame "' + (await frameLabelOf(element)) + '" (cross-origin, walked in its own context)',
      );
      lines.push(...frameLines.map((line) => "  " + line));
    }
    if (scoped) break;
  }
  if (successfullyWalkedFrames > 0) {
    await page
      .evaluate(RAISE_REF_COUNTER_FLOOR_FN, nextRef)
      .catch((failure) => noteIgnoredFailure("raising the top frame's ref counter", failure));
  }
  unreachable = Math.max(0, unreachable - successfullyWalkedFrames);
  return finish();
}

// A ref or selector can land on a custom-element HOST (<faceplate-text-input>)
// whose real control lives inside its open shadow root; Playwright refuses to
// fill the host. Writes descend to the first editable control beneath the
// element, crossing open shadow roots, and fall back to the element itself so
// Playwright still reports its own precise error on a genuinely uneditable
// target.
const EDITABLE_TARGET_FN = (el) => {
  // Editable = a control the write ops can act on. Hidden and button-like
  // input types never are: custom widgets commonly keep an input
  // type="hidden" for form association, and descending to it would trade a
  // click on the host (which delegated focus may deliver) for a write that
  // times out on an invisible element.
  const NEVER_EDITABLE_INPUT_TYPES = [
    "hidden",
    "button",
    "submit",
    "reset",
    "image",
    "file",
    "checkbox",
    "radio",
  ];
  const isEditable = (node) => {
    const tag = node.tagName ? node.tagName.toLowerCase() : "";
    if (tag === "textarea" || tag === "select" || node.isContentEditable === true) return true;
    if (tag !== "input") return false;
    const type = (node.getAttribute("type") ?? "text").toLowerCase();
    return !NEVER_EDITABLE_INPUT_TYPES.includes(type);
  };
  // The descent walks PAST an editable the page hides from the user: bot
  // honeypots (GitHub's input[name^="required_field_"]), autofill decoys
  // (Amazon's #auth-credential-autofill-hint), a two-step login's unrevealed
  // password (Microsoft's #i0118). Hidden is the snapshot's isVisible rule:
  // not rendered, a zero-size box, or the control's OWN aria-hidden — an
  // ANCESTOR's aria-hidden does not count, because cookie-consent and modal
  // libraries set it on main/#app while the fields underneath stay painted.
  const isHiddenDecoy = (node) => {
    const view =
      node.ownerDocument && node.ownerDocument.defaultView
        ? node.ownerDocument.defaultView
        : globalThis;
    const style = view.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return true;
    const rect = node.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return true;
    return node.getAttribute("aria-hidden") === "true";
  };
  if (isEditable(el)) return el;
  const queue = [el];
  while (queue.length > 0) {
    const current = queue.shift();
    const shadow = current.shadowRoot ?? current.__sandShadowRoot ?? null;
    const scopes = shadow ? [shadow, current] : [current];
    for (const scope of scopes) {
      for (const child of scope.children) {
        if (isEditable(child) && !isHiddenDecoy(child)) return child;
        queue.push(child);
      }
    }
  }
  return el;
};

async function editableHandle(element) {
  const handle = await element.evaluateHandle(EDITABLE_TARGET_FN);
  return handle.asElement() ?? element;
}

// The write boundary judges the exact control a write lands in by the rule
// EDITABLE_TARGET_FN's descent and SNAPSHOT_FN's isVisible share: a ref booked
// from a snapshot can be hidden by the time the write comes (a responsive
// relayout collapsed its twin widget), and Playwright's actionability check
// lets an aria-hidden control through, into a field the user never sees.
const WRITE_TARGET_IS_HIDDEN_FN = (el) => {
  const view =
    el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : globalThis;
  const style = view.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return true;
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return true;
  return el.getAttribute("aria-hidden") === "true";
};

async function writeTargetFrameIsHidden(page, element) {
  let frame = await element.ownerFrame().catch((failure) => {
    noteIgnoredFailure("resolving a write target's frame", failure);
    return null;
  });
  for (; frame !== null && frame !== page.mainFrame(); frame = frame.parentFrame()) {
    const frameElement = await frame.frameElement().catch((failure) => {
      noteIgnoredFailure("resolving a write target's frame element", failure);
      return null;
    });
    if (frameElement === null || (await frameElement.evaluate(WRITE_TARGET_IS_HIDDEN_FN))) {
      return true;
    }
  }
  return false;
}

async function writeTargetHandle(page, ref) {
  const element = await editableHandle(await refHandle(page, ref));
  if (
    (await element.evaluate(WRITE_TARGET_IS_HIDDEN_FN)) ||
    (await writeTargetFrameIsHidden(page, element))
  ) {
    throw new Error(
      "Hidden target " +
        JSON.stringify(ref) +
        ": the control is not painted (display:none, visibility:hidden, zero size, or aria-hidden), so it is a hidden duplicate or decoy of the field the user sees and was not written. Take a fresh browser_snapshot and use the ref of the visible control.",
    );
  }
  return element;
}

// Google-Places-style address inputs (and some date/phone widgets) ship
// `readonly` and lift it in their own focus handler, so native autofill cannot
// race the suggestion dropdown. Playwright's fill/type wait for the control to
// be editable BEFORE they focus it, so the write spun to the action timeout and
// left the field empty (a fill_op_failed on checkout/profile address steps).
// Focusing first lifts the attribute; a control that stays read-only after
// focus is genuinely display-only and fails fast with a clear reason instead of
// burning the timeout.
const WRITE_TARGET_IS_READONLY_FN = (el) => {
  const tag = el.tagName ? el.tagName.toLowerCase() : "";
  return (tag === "input" || tag === "textarea") && el.hasAttribute("readonly");
};

async function liftReadonlyByFocusing(element) {
  if (!(await element.evaluate(WRITE_TARGET_IS_READONLY_FN))) return;
  await element.focus();
  if (!(await element.evaluate(WRITE_TARGET_IS_READONLY_FN))) return;
  throw new Error(
    "The control is read-only and stayed read-only after being focused, so the page accepts no typed text there and the field was left unfilled. It is probably driven by a picker or display-only; hand the user the screen for this field.",
  );
}

// Whether a text control actually KEPT a write, judged inside the page and
// reported only as a verdict — the value itself never rides back on the
// result. Input-mask libraries (masked dates like Southwest's __/__
// departure field, phone masks) drive the control from their own keystroke
// state machine and cancel or revert Playwright's single bulk insertText, so
// a fill can report ok while the control still shows the empty template.
// "swallowed" = the request carried significant characters but the control
// holds none (empty, or bare mask literals like __/__), so the write must be
// retried per key or failed; "committed" = the control holds significant
// text (masks legitimately reformat, so equality is not required);
// "unverifiable" = not a value-bearing control or a no-op write, where
// Playwright's own outcome stands.
const FILL_COMMIT_STATE_FN = (el, value) => {
  const tag = el.tagName ? el.tagName.toLowerCase() : "";
  if (tag !== "input" && tag !== "textarea") return "unverifiable";
  const significant = (text) =>
    String(text ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  if (significant(value).length === 0) return "unverifiable";
  return significant(el.value).length === 0 ? "swallowed" : "committed";
};

async function fillCommitState(element, value) {
  return element.evaluate(FILL_COMMIT_STATE_FN, value);
}

// Per-key typing for the fill op. A secret's keystrokes are bound to the
// target: the focus sentinel marks any out-of-scope element that gains
// focus while the secret types, and every keystroke is preceded by a scope
// check that stops the fill the moment focus escapes — value-free, and the
// caller's failure path installs the redaction marks on top.
async function typeFillValuePerKey(page, element, value, secret, bindEachKeyToTarget = false) {
  if (secret !== true) {
    await page.keyboard.type(value, { delay: 20 });
    return;
  }
  if (!(await element.evaluate(TOP_WINDOW_REACHABLE_FN))) {
    if (!bindEachKeyToTarget) {
      throw new Error(
        "The target sits in a cross-origin frame, where the host cannot watch keyboard focus across the frame boundary while a secret types, so the per-key fill was refused and the field was left unfilled. Hand the user the screen for this field.",
      );
    }
    // ElementHandle.type focuses its element before typing. Repeating that
    // action per character keeps a single-control secret bound to the resolved
    // target even when a cross-origin parent changes focus between keys.
    for (const char of value) {
      await element.type(char);
      await sleep(20);
    }
    return;
  }
  noteSkippedDocuments(
    "arming the secret-fill focus sentinel on every reachable document",
    await element.evaluate(ARM_SECRET_FILL_FOCUS_SENTINEL_FN),
  );
  try {
    for (const char of value) {
      if (!(await element.evaluate(SECRET_FILL_FOCUS_IN_SCOPE_FN))) {
        throw new Error(
          "The page moved keyboard focus away from the target while a secret was being typed, so the fill was stopped. Hand the user the screen if this recurs.",
        );
      }
      await page.keyboard.type(char);
      await sleep(20);
    }
  } finally {
    await element
      .evaluate(DISARM_SECRET_FILL_FOCUS_SENTINEL_FN)
      .then((kept) => noteSkippedDocuments("disarming the secret-fill focus sentinel", kept))
      .catch((failure) => noteIgnoredFailure("disarming the secret-fill focus sentinel", failure));
  }
}

// A split-character code widget renders one box per character (six
// maxlength=1 inputs with focus auto-advance) while the form carries ONE
// code field. A single bulk insert clamps to the first box's maxlength and
// that box then reads non-empty — a committed-looking lie — so a
// multi-character write into such a box must be distributed per key (each
// keystroke lands wherever the widget moves focus) and judged against the
// GROUP's concatenated value, never one box's. The group is the single-char
// inputs of the nearest ancestor that holds at least two of them.
const SPLIT_CHAR_GROUP_FN = (el) => {
  const tag = el.tagName ? el.tagName.toLowerCase() : "";
  if (tag !== "input" || el.getAttribute("maxlength") !== "1") return 0;
  let container = el.parentElement;
  for (let depth = 0; container !== null && depth < 3; depth++) {
    const boxes = [...container.querySelectorAll('input[maxlength="1"]')];
    if (boxes.length >= 2 && boxes.includes(el)) return boxes.length;
    container = container.parentElement;
  }
  return 0;
};

const SPLIT_CHAR_COMMIT_FN = (el, value) => {
  let group = [];
  let container = el.parentElement;
  for (let depth = 0; container !== null && depth < 3; depth++) {
    const boxes = [...container.querySelectorAll('input[maxlength="1"]')];
    if (boxes.length >= 2 && boxes.includes(el)) {
      group = boxes;
      break;
    }
    container = container.parentElement;
  }
  if (group.length < 2) return "swallowed";
  const significant = (text) =>
    String(text ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  const held = significant(group.map((box) => box.value).join(""));
  return held === significant(value) && held.length > 0 ? "committed" : "swallowed";
};

// Whether the document's focus still sits inside the secret fill's allowed
// scope: the target control itself, anything beneath it, or — for a
// split-character box — its group's container. Per-key secret typing checks
// this before every keystroke, because page.keyboard.type follows live
// document focus: a page that steals focus mid-fill would otherwise collect
// the remaining glyphs into a control the fill never targeted.
const SECRET_FILL_FOCUS_IN_SCOPE_FN = (el) => {
  const doc = el.ownerDocument;
  let active = doc.activeElement;
  for (let hops = 0; active && hops < 10; hops++) {
    const shadow = active.shadowRoot ?? active.__sandShadowRoot ?? null;
    if (!shadow || !shadow.activeElement) break;
    active = shadow.activeElement;
  }
  if (active === null || active === undefined) return false;
  if (active === el || (typeof el.contains === "function" && el.contains(active))) return true;
  // Scope is the group's BOXES, never the whole container: a page can nest
  // a non-box thief control inside the container, and container.contains
  // would let it collect keystrokes unguarded.
  if (el.getAttribute("maxlength") === "1") {
    let container = el.parentElement;
    for (let depth = 0; container !== null && depth < 3; depth++) {
      const boxes = [...container.querySelectorAll('input[maxlength="1"]')];
      if (boxes.length >= 2 && boxes.includes(el)) return boxes.includes(active);
      container = container.parentElement;
    }
  }
  return false;
};

// The belt for the race the per-key check cannot see: focus stolen and
// returned between two checks. While a secret types, every out-of-scope
// element that GAINS focus is marked as secret-filled the moment it happens
// (focusin fires synchronously, before any keystroke can land in the
// thief), so a glyph that slipped into it is redacted by the element mark
// even though the value set never learns single characters. The listener
// sits on every same-origin document reachable from the top — a thief can
// live in the parent or a sibling frame of the target — and the mark lands
// on the DEEP focus target, descending frames and shadow roots, because a
// document-level focusin retargets to the shadow HOST while the value that
// must redact belongs to the inner control. Marking a thief that received
// nothing over-redacts one element's value, which is the safe direction.
// The sentinel disarms when the fill settles and self-disarms after 30s so
// a crashed driver call cannot leave it marking every focus change forever.
const ARM_SECRET_FILL_FOCUS_SENTINEL_FN = (el) => {
  const doc = el.ownerDocument;
  const win = doc.defaultView ?? globalThis;
  let topWin = win;
  try {
    if (win.top && win.top.document) topWin = win.top;
  } catch {
    topWin = win;
  }
  const inScope = (node) => {
    if (node === el || (typeof el.contains === "function" && el.contains(node))) return true;
    if (el.getAttribute("maxlength") === "1") {
      let container = el.parentElement;
      for (let depth = 0; container !== null && depth < 3; depth++) {
        const boxes = [...container.querySelectorAll('input[maxlength="1"]')];
        if (boxes.length >= 2 && boxes.includes(el)) return boxes.includes(node);
        container = container.parentElement;
      }
    }
    return false;
  };
  const deepFocusTarget = (node) => {
    let current = node;
    for (let hops = 0; current && hops < 10; hops++) {
      let framed;
      try {
        if (
          current.tagName &&
          /^(iframe|frame)$/i.test(current.tagName) &&
          current.contentDocument &&
          current.contentDocument.activeElement
        ) {
          framed = current.contentDocument.activeElement;
        }
      } catch {
        framed = null;
      }
      if (framed) {
        current = framed;
        continue;
      }
      const shadow = current.shadowRoot ?? current.__sandShadowRoot ?? null;
      if (shadow && shadow.activeElement) {
        current = shadow.activeElement;
        continue;
      }
      break;
    }
    return current;
  };
  const docs = [];
  let skipped = 0;
  const collectDocs = (rootDoc) => {
    docs.push(rootDoc);
    for (const frame of rootDoc.querySelectorAll("iframe, frame")) {
      try {
        if (frame.contentDocument && docs.length < 20 && !docs.includes(frame.contentDocument)) {
          collectDocs(frame.contentDocument);
        }
      } catch {
        skipped += 1;
      }
    }
  };
  try {
    collectDocs(topWin.document);
  } catch {
    skipped += 1;
  }
  if (!docs.includes(doc)) docs.push(doc);
  const previousDisarm = topWin.__sandSecretFillFocusSentinel;
  if (typeof previousDisarm === "function") previousDisarm();
  const listener = (event) => {
    const target = deepFocusTarget(event.target);
    if (target && typeof target.setAttribute === "function" && !inScope(target)) {
      target.setAttribute("data-sand-secret-filled", "");
    }
  };
  for (const d of docs) {
    try {
      d.addEventListener("focusin", listener, true);
    } catch {
      skipped += 1;
    }
  }
  let timer;
  const disarm = () => {
    let kept = 0;
    for (const d of docs) {
      try {
        d.removeEventListener("focusin", listener, true);
      } catch {
        kept += 1;
      }
    }
    topWin.clearTimeout(timer);
    if (topWin.__sandSecretFillFocusSentinel === disarm) {
      topWin.__sandSecretFillFocusSentinel = undefined;
    }
    return kept;
  };
  timer = topWin.setTimeout(disarm, 30000);
  topWin.__sandSecretFillFocusSentinel = disarm;
  return skipped;
};

const DISARM_SECRET_FILL_FOCUS_SENTINEL_FN = (el) => {
  const doc = el.ownerDocument;
  const win = doc.defaultView ?? globalThis;
  let topWin = win;
  try {
    if (win.top && win.top.document) topWin = win.top;
  } catch {
    topWin = win;
  }
  const disarm = topWin.__sandSecretFillFocusSentinel;
  return typeof disarm === "function" ? disarm() : 0;
};

// Installs the redaction signals a host secret fill leaves for SNAPSHOT_FN:
// the element mark (survives the site reformatting the value) and the
// page-scoped value set (survives a re-render replacing the marked element).
// Registered values: the requested secret, the control's current value when
// the site reformatted it, and for a split-character group the group's
// concatenation — SNAPSHOT_FN judges the sibling boxes against the set by
// that concatenation, so the digits stay redacted after the marked nodes are
// replaced without blanking every lone digit on the page. Runs on failed and
// swallowed fills too: those paths can leave typed secret fragments in the
// DOM (a partial split-OTP distribution), and the marks must land before the
// op reports the failure.
const TOP_WINDOW_REACHABLE_FN = (el) => {
  try {
    return Boolean(el.ownerDocument.defaultView.top.document);
  } catch {
    return false;
  }
};

const MARK_SECRET_FILL_FN = (el, value) => {
  const win = el.ownerDocument.defaultView ?? globalThis;
  // Register on the element's own window AND the top window: a focus-steal's
  // keystrokes land in whatever frame holds focus, and snapshots consult the
  // top set (secretFillSetsFor). An unreachable top receives no bookkeeping.
  let topReached = true;
  const registerValue = (registered) => {
    if (!(win.__sandSecretFillValues instanceof Set)) win.__sandSecretFillValues = new Set();
    win.__sandSecretFillValues.add(registered);
    try {
      if (win.top && win.top !== win) {
        if (!(win.top.__sandSecretFillValues instanceof Set))
          win.top.__sandSecretFillValues = new Set();
        win.top.__sandSecretFillValues.add(registered);
      }
    } catch {
      topReached = false;
    }
  };
  registerValue(value);
  el.setAttribute("data-sand-secret-filled", "");
  // A split-character group carries the secret across sibling boxes, so
  // every box gets the element mark; single-character box values stay out
  // of the value set (redacting every lone "1" on the page would
  // over-redact wildly), the marks and the group concatenation cover them.
  if (el.getAttribute("maxlength") === "1") {
    let container = el.parentElement;
    for (let depth = 0; container !== null && depth < 3; depth++) {
      const boxes = [...container.querySelectorAll('input[maxlength="1"]')];
      if (boxes.length >= 2 && boxes.includes(el)) {
        for (const box of boxes) box.setAttribute("data-sand-secret-filled", "");
        const held = boxes.map((box) => box.value).join("");
        if (held.length > 1) registerValue(held);
        break;
      }
      container = container.parentElement;
    }
  }
  if (typeof el.value === "string" && el.value.length > 1) registerValue(el.value);
  return topReached;
};

const RESOLVE_MODEL_AUTHORED_SELECT_VALUES_AGAINST_LIVE_OPTIONS_FN = (el, requested) => {
  const tag = el.tagName ? el.tagName.toLowerCase() : "";
  if (tag !== "select") return { kind: "not_select", tag, role: el.getAttribute("role") };
  if (!Array.isArray(requested)) return { kind: "unresolved" };
  const options = [...el.options].filter((option) => !option.disabled);
  if (options.length === 0) return { kind: "unresolved" };
  const significant = (text) =>
    String(text ?? "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]/gu, "");
  const labelOf = (option) => String(option.label ?? option.textContent ?? "").trim();
  const MIN_PREFIX_SIGNIFICANT_CHARS_SO_A_BARE_CODE_LIKE_AL_NEVER_TAKES_ALASKA = 4;
  const resolveVerbatimThenCaselessThenAlphanumericThenShortestLabelPrefix = (wanted) => {
    if (typeof wanted !== "string") return undefined;
    const verbatim = options.find(
      (option) => option.value === wanted || labelOf(option) === wanted.trim(),
    );
    if (verbatim) return verbatim;
    const lower = wanted.trim().toLowerCase();
    const caseless = options.find(
      (option) => option.value.toLowerCase() === lower || labelOf(option).toLowerCase() === lower,
    );
    if (caseless) return caseless;
    const sig = significant(wanted);
    if (sig.length === 0) return undefined;
    const normalized = options.find(
      (option) => significant(option.value) === sig || significant(labelOf(option)) === sig,
    );
    if (normalized) return normalized;
    const byPrefix = options.filter((option) => {
      const label = significant(labelOf(option));
      const shorter = Math.min(label.length, sig.length);
      if (shorter < MIN_PREFIX_SIGNIFICANT_CHARS_SO_A_BARE_CODE_LIKE_AL_NEVER_TAKES_ALASKA)
        return false;
      return label.startsWith(sig) || sig.startsWith(label);
    });
    byPrefix.sort((a, b) => labelOf(a).length - labelOf(b).length);
    return byPrefix[0];
  };
  const values = [];
  let fuzzy = false;
  for (const wanted of requested) {
    const option = resolveVerbatimThenCaselessThenAlphanumericThenShortestLabelPrefix(wanted);
    if (option === undefined) return { kind: "unmatched", optionCount: options.length };
    if (option.value !== wanted) fuzzy = true;
    values.push(option.value);
  }
  return { kind: "matched", values, fuzzy };
};

function holdDurationFor(args) {
  if (typeof args.holdDurationMs !== "number" || !(args.holdDurationMs > 0)) return 0;
  return Math.min(args.holdDurationMs, MAX_HOLD_DURATION_MS);
}

function clickOptionsFor(args) {
  const options = { timeout: ACTION_TIMEOUT_MS };
  if (args.button === "right" || args.button === "middle") options.button = args.button;
  if (Array.isArray(args.modifiers) && args.modifiers.length > 0)
    options.modifiers = args.modifiers;
  const hold = holdDurationFor(args);
  if (hold > 0) {
    options.delay = hold;
    options.timeout = ACTION_TIMEOUT_MS + hold;
  }
  if (args.doubleClick === true) options.clickCount = 2;
  return options;
}

async function openNewTab({ request, context, state }, url) {
  const page = await context.newPage();
  const { viewId } = requestedView(request, state);
  state.views[viewId] = await targetIdOf(context, page);
  state.lastViewId = viewId;
  if (url === undefined) return { page, viewId, summary: "Opened a new tab" };
  page.setDefaultTimeout(ACTION_TIMEOUT_MS);
  const outcome = await gotoWithRecovery(page, url, request.navigationRecovery === true);
  return {
    page,
    viewId,
    summary: "Opened " + stripUrlCredentials(url) + " in a new tab" + navigationNote(outcome),
    recoveredErrorPage: true,
  };
}

const OPS = {
  navigate: async ({ request, context, state }) => {
    if (request.newTab === true) return openNewTab({ request, context, state }, request.url);
    const { page, viewId } = await resolvePage(request, context, state);
    const outcome = await gotoWithRecovery(page, request.url, request.navigationRecovery === true);
    return {
      page,
      viewId,
      summary: "Navigated to " + stripUrlCredentials(request.url) + navigationNote(outcome),
      recoveredErrorPage: true,
    };
  },
  snapshot: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    const result = await snapshotAcrossFrames(context, page, {
      interactive: request.interactive === true,
      maxDepth: typeof request.maxDepth === "number" ? request.maxDepth : 20,
      selector:
        typeof request.selector === "string" && request.selector.length > 0
          ? request.selector
          : undefined,
      probe: request.probe === true,
    });
    if (request.probe !== true) {
      state.frameRefs[viewId] = { ...state.frameRefs[viewId], ...result.refOwners };
    }
    const data = result.lines.join("\n");
    const meta = { unreachableFrames: result.unreachableFrames ?? 0 };
    if (result.selector !== undefined) {
      meta.selectorMatched = result.selector.matched;
      meta.selectorClosedShadow = result.selector.closedShadow;
      if (result.selector.invalid === true) meta.selectorInvalid = true;
    }
    return {
      page,
      viewId,
      summary: "Captured page snapshot (" + String(result.refCount) + " interactive refs)",
      data,
      meta,
    };
  },
  click: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    const element = await refHandle(page, request.ref);
    const options = clickOptionsFor(request);
    if (typeof request.offsetX === "number" || typeof request.offsetY === "number") {
      const box = await element.boundingBox();
      if (box !== null) {
        options.position = {
          x: box.width / 2 + (request.offsetX ?? 0),
          y: box.height / 2 + (request.offsetY ?? 0),
        };
      }
    }
    await element.click(options);
    await settleAfter(page, "the click", 3000);
    return { page, viewId, summary: "Clicked " + (request.element ?? request.ref) };
  },
  mouse_click_xy: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    const hold = holdDurationFor(request);
    await page.mouse.click(request.x, request.y, {
      button: request.button === "right" || request.button === "middle" ? request.button : "left",
      ...(hold > 0 ? { delay: hold } : {}),
    });
    await settleAfter(page, "the click", 3000);
    return {
      page,
      viewId,
      summary: "Clicked at (" + String(request.x) + ", " + String(request.y) + ")",
    };
  },
  type: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    const element = await writeTargetHandle(page, request.ref);
    await element.click({ timeout: ACTION_TIMEOUT_MS });
    if (request.clear === true) {
      await element
        .fill("")
        .catch((failure) => noteIgnoredFailure("clearing the control before typing", failure));
    }
    await page.keyboard.type(request.text, { delay: request.slowly === true ? 40 : 0 });
    if (request.submit === true) {
      await page.keyboard.press("Enter");
      await settleAfter(page, "the submit", 5000);
    }
    return { page, viewId, summary: "Typed into " + (request.element ?? request.ref) };
  },
  fill: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    const element = await writeTargetHandle(page, request.ref);
    await liftReadonlyByFocusing(element);
    // What the LIVE control says it is, read from the exact element the write
    // goes to — not from the card's model-authored type/secret. The host's
    // vault refuses to save a value whose real destination was secret-shaped
    // (password type, credential/OTP/payment autocomplete, a split-character
    // code widget, or site-authored name/id/aria/placeholder text that sniffs
    // credential- or payment-like), and it fails closed when this capture is
    // missing, so a capture error only skips a convenience save.
    const controlBase = await element
      .evaluate((el) => {
        const attr = (name) => String(el.getAttribute(name) ?? "");
        // Case is preserved on purpose: the vault's credential/payment sniffs
        // are case-insensitive but split camelCase on uppercase humps, so
        // lowercasing here would glue ids like "verificationCode" into one
        // unmatchable token.
        const descriptor = [
          attr("name"),
          String(el.id ?? ""),
          attr("aria-label"),
          attr("placeholder"),
        ]
          .filter((part) => part.length > 0)
          .join(" ");
        return {
          type: String(el.type ?? el.tagName ?? "").toLowerCase(),
          autoComplete: attr("autocomplete").toLowerCase(),
          ...(descriptor.length > 0 ? { descriptor } : {}),
        };
      })
      .catch((error) => {
        console.error("control capture failed (vault save gate fails closed): " + String(error));
        return undefined;
      });
    let summary = "Filled " + (request.element ?? request.ref);
    // The group-membership probe runs unconditionally so the control report
    // marks a split-code box even for a single-character write; the per-key
    // FILL path keeps its original multi-character trigger.
    const splitGroupSize = await element.evaluate(SPLIT_CHAR_GROUP_FN).catch(() => 0);
    const control =
      controlBase !== undefined && splitGroupSize >= 2
        ? { ...controlBase, splitCharGroup: true }
        : controlBase;
    const splitBoxCount =
      typeof request.value === "string" && request.value.length > 1 ? splitGroupSize : 0;
    try {
      if (splitBoxCount >= 2) {
        // Split OTP path: type per key so the widget's focus auto-advance
        // distributes the characters, then judge the GROUP's concatenation —
        // a bulk insert would clamp to the first box and read as a
        // committed-looking single character.
        await element.click({ timeout: ACTION_TIMEOUT_MS });
        await typeFillValuePerKey(page, element, request.value, request.secret);
        if ((await element.evaluate(SPLIT_CHAR_COMMIT_FN, request.value)) === "swallowed") {
          throw new Error(
            "The target is a split-character code widget and the typed characters did not distribute across its boxes, so the code was left unfilled. Hand the user the screen if this recurs.",
          );
        }
        summary += " (distributed per key across the split-character code widget)";
      } else {
        await element.fill(request.value);
        // Masked controls can cancel the single bulk insertText that element.fill
        // performs (their beforeinput handlers only accept one key at a time), so
        // an ok from fill alone would report a field the page still shows empty.
        // When the control swallowed the write, retry as real per-key typing —
        // the event stream mask libraries are built for — then blur so the
        // control commits and fires its change; a control that swallows both
        // paths fails the op instead of pretending, with no value in the error.
        if ((await fillCommitState(element, request.value)) === "swallowed") {
          await element.click({ timeout: ACTION_TIMEOUT_MS });
          await element
            .fill("")
            .catch((failure) =>
              noteIgnoredFailure("clearing the masked control before per-key typing", failure),
            );
          await typeFillValuePerKey(page, element, request.value, request.secret, true);
          if ((await fillCommitState(element, request.value)) === "swallowed") {
            throw new Error(
              "The control did not keep the inserted text: an input mask on the page rejected both the set-value insert and per-key typing, so the field was left unfilled.",
            );
          }
          // Blur commits the mask's state, and the change dispatch stands in for
          // the native blur-change: a mask that cancels beforeinput and writes
          // the value itself never sets the browser's dirty flag, so the native
          // event cannot be counted on.
          await element.evaluate((el) => {
            el.blur();
            el.dispatchEvent(new Event("change", { bubbles: true }));
          });
          // The commit itself can swallow the write: a mask that clears an
          // incomplete value when it loses focus leaves the control empty
          // AFTER the pre-blur check passed, and reporting ok there would
          // fake a filled field — the exact lie this commit pipeline exists
          // to stop. Re-judge and fail honestly, with no value in the error.
          if ((await fillCommitState(element, request.value)) === "swallowed") {
            throw new Error(
              "The control cleared the typed text when it committed on blur: the page's input mask discarded the value, so the field was left unfilled.",
            );
          }
          summary += " (per-key typing; the control's input mask swallowed the set-value insert)";
        }
      }
    } catch (error) {
      // A failed or swallowed secret fill can still have typed fragments
      // into the DOM (a partial split-OTP distribution, mask remnants), so
      // the redaction marks must land BEFORE the failure surfaces — a later
      // snapshot would otherwise serialize those fragments to the model.
      // Best-effort: the op already reports the fill failure, and a page torn
      // down mid-op has no DOM left to leak.
      if (request.secret === true) {
        await markSecretFill(element, request.value).catch((failure) =>
          noteIgnoredFailure("marking the failed secret fill for redaction", failure),
        );
      }
      throw error;
    }
    // A host fill of a write-only secret leaves two redaction signals for
    // SNAPSHOT_FN, because the target can be an ordinary text control (OTP,
    // card fields, or a mis-resolved ref) whose value would otherwise be
    // serialized back to the model: the element mark survives the site
    // reformatting the value, the page-scoped value set survives a re-render
    // replacing the marked element. Both live inside the page, which already
    // holds the value in its own DOM, so neither adds exposure — and a failed
    // mark fails the op, so the fill only counts when the redaction
    // guarantee landed with it.
    if (request.secret === true) {
      await markSecretFill(element, request.value);
    }
    return { page, viewId, summary, ...(control === undefined ? {} : { control }) };
  },
  select_option: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    const element = await writeTargetHandle(page, request.ref);
    const values = Array.isArray(request.values) ? request.values : [];
    const resolved = await element
      .evaluate(RESOLVE_MODEL_AUTHORED_SELECT_VALUES_AGAINST_LIVE_OPTIONS_FN, values)
      .catch((failure) => {
        noteIgnoredFailure("resolving the select's options in the page", failure);
        return { kind: "unresolved" };
      });
    if (resolved.kind === "not_select") {
      throw new Error(
        "The target is not a native <select>: it is a <" +
          resolved.tag +
          (resolved.role ? ' role="' + resolved.role + '"' : "") +
          ">. Click it with browser_click, take a browser_snapshot, and click the option you want.",
      );
    }
    if (resolved.kind === "unmatched") {
      throw new Error(
        "None of the select's " +
          String(resolved.optionCount) +
          " options matched the requested value, by value or by visible label. Take a fresh browser_snapshot to read the control, and pass an option value or label the page actually offers.",
      );
    }
    let selected;
    if (resolved.kind === "matched") {
      selected = await element.selectOption(resolved.values);
    } else {
      try {
        selected = await element.selectOption(values);
      } catch {
        selected = await element.selectOption(values.map((v) => ({ label: v })));
      }
    }
    return {
      page,
      viewId,
      summary:
        "Selected " +
        JSON.stringify(selected) +
        " in " +
        (request.element ?? request.ref) +
        (resolved.kind === "matched" && resolved.fuzzy === true
          ? " (matched the requested value to the page's option by its visible label)"
          : ""),
    };
  },
  press_key: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    await page.keyboard.press(request.key);
    await settleAfter(page, "the key press", 3000);
    return { page, viewId, summary: "Pressed " + request.key };
  },
  scroll: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    if (typeof request.ref === "string" && request.ref.length > 0) {
      const element = await refHandle(page, request.ref);
      await element.scrollIntoViewIfNeeded();
      return {
        page,
        viewId,
        summary: "Scrolled " + (request.element ?? request.ref) + " into view",
      };
    }
    const amount = typeof request.amount === "number" && request.amount > 0 ? request.amount : 300;
    let deltaX = typeof request.deltaX === "number" ? request.deltaX : 0;
    let deltaY = typeof request.deltaY === "number" ? request.deltaY : 0;
    if (deltaX === 0 && deltaY === 0) {
      const direction = request.direction ?? "down";
      if (direction === "up") deltaY = -amount;
      else if (direction === "down") deltaY = amount;
      else if (direction === "left") deltaX = -amount;
      else deltaX = amount;
    }
    await page.mouse.wheel(deltaX, deltaY);
    await sleep(200);
    return {
      page,
      viewId,
      summary: "Scrolled by (" + String(deltaX) + ", " + String(deltaY) + ")",
    };
  },
  tabs: async ({ request, context, state }) => {
    const pages = context.pages().filter((p) => !p.isClosed());
    if (request.action === "list") {
      const ownPage = expectedPage(
        state,
        requestedView(request, state),
        await pagesByTargetId(context),
      );
      const entries = [];
      for (let i = 0; i < pages.length; i++) {
        entries.push({
          index: i,
          url: stripUrlCredentials(pages[i].url()),
          title: await withDeadline(
            pages[i].title(),
            TAB_CALL_DEADLINE_MS,
            "title timed out",
          ).catch(() => ""),
          ...(pages[i] === ownPage ? { current: true } : {}),
        });
      }
      return {
        summary: "Listed " + String(pages.length) + " tab(s)",
        data: JSON.stringify(entries, null, 1),
      };
    }
    if (request.action === "new") {
      return openNewTab(
        { request, context, state },
        typeof request.url === "string" && request.url.length > 0 ? request.url : undefined,
      );
    }
    let page;
    if (typeof request.index === "number") {
      page = pages[request.index];
      if (page === undefined) {
        throw new Error(
          "No tab at index " + String(request.index) + " (" + String(pages.length) + " open)",
        );
      }
    } else if (request.action === "close") {
      const currentTarget =
        state.lastViewId !== undefined ? state.views[state.lastViewId] : undefined;
      if (currentTarget !== undefined) {
        for (const p of pages) {
          try {
            if ((await targetIdOf(context, p)) === currentTarget) {
              page = p;
              break;
            }
          } catch (failure) {
            noteIgnoredFailure("reading a tab's target id while finding the current tab", failure);
          }
        }
      }
      if (page === undefined) {
        throw new Error("No current tab to close; pass an index from browser_tabs list.");
      }
    } else {
      throw new Error('Tab index is required for "' + String(request.action) + '".');
    }
    if (request.action === "select") {
      await page
        .bringToFront()
        .catch((failure) => noteIgnoredFailure("bringing the selected tab to front", failure));
      const targetId = await targetIdOf(context, page);
      // Rebind the CALLER's view to the selected tab. Every tool call carries
      // its agent's own viewId, so only updating lastViewId (or some other
      // view already mapped to the tab) would leave every subsequent
      // snapshot/click on the agent's OLD tab while this op reports success —
      // a false rebind.
      let viewId =
        typeof request.viewId === "string" && request.viewId.length > 0
          ? request.viewId
          : Object.keys(state.views).find((k) => state.views[k] === targetId);
      viewId ??= "tab-" + String(Date.now());
      state.views[viewId] = targetId;
      state.lastViewId = viewId;
      return { page, viewId, summary: "Selected tab " + String(request.index) };
    }
    if (request.action === "close") {
      const targetId = await targetIdOf(context, page).catch((failure) => {
        noteIgnoredFailure("reading the closing tab's target id", failure);
        return undefined;
      });
      const closedUrl = page.url();
      await page.close();
      if (targetId !== undefined) {
        state.deletedViews = state.deletedViews ?? [];
        for (const key of Object.keys(state.views)) {
          if (state.views[key] === targetId) {
            delete state.views[key];
            state.deletedViews.push(key);
            if (state.lastViewId === key) state.lastViewId = undefined;
          }
        }
      }
      // The remaining count makes each close in a "close the duplicate tabs"
      // sweep return a different result, so the loop detector reads the
      // sweep as progress rather than as a stuck identical call.
      const remaining = context.pages().filter((p) => !p.isClosed()).length;
      return {
        summary:
          "Closed tab (" +
          stripUrlCredentials(closedUrl) +
          "); " +
          String(remaining) +
          " tab(s) remain",
      };
    }
    throw new Error("Unknown tabs action: " + String(request.action));
  },
  screenshot: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    return { page, viewId, summary: "Took a screenshot", fullPage: request.fullPage === true };
  },
  drag: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    const source = await refHandle(page, request.sourceRef);
    await source.scrollIntoViewIfNeeded();
    const sourceBox = await source.boundingBox();
    if (sourceBox === null) throw new Error("The drag source has no visible bounding box.");
    let targetX;
    let targetY;
    if (typeof request.targetRef === "string" && request.targetRef.length > 0) {
      const target = await refHandle(page, request.targetRef);
      const targetBox = await target.boundingBox();
      if (targetBox === null) throw new Error("The drag target has no visible bounding box.");
      targetX = targetBox.x + targetBox.width / 2;
      targetY = targetBox.y + targetBox.height / 2;
    } else if (typeof request.targetX === "number" && typeof request.targetY === "number") {
      targetX = request.targetX;
      targetY = request.targetY;
    } else {
      throw new Error("drag needs targetRef or targetX/targetY.");
    }
    const startX = sourceBox.x + sourceBox.width / 2;
    const startY = sourceBox.y + sourceBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    const steps = 12;
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(
        startX + ((targetX - startX) * i) / steps,
        startY + ((targetY - startY) * i) / steps,
      );
    }
    await page.mouse.up();
    return {
      page,
      viewId,
      summary:
        "Dragged " +
        request.sourceRef +
        " to (" +
        String(Math.round(targetX)) +
        ", " +
        String(Math.round(targetY)) +
        ")",
    };
  },
  get_bounding_box: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    const element = await refHandle(page, request.ref);
    const box = await element.boundingBox();
    if (box === null) throw new Error("The element has no visible bounding box.");
    return {
      page,
      viewId,
      summary: "Bounding box for " + (request.element ?? request.ref),
      data: JSON.stringify({
        x: Math.round(box.x),
        y: Math.round(box.y),
        width: Math.round(box.width),
        height: Math.round(box.height),
      }),
    };
  },
  highlight: async ({ request, context, state }) => {
    const { page, viewId } = await resolvePage(request, context, state);
    await page
      .bringToFront()
      .catch((failure) => noteIgnoredFailure("bringing the highlighted tab to front", failure));
    const element = await refHandle(page, request.ref);
    await element.scrollIntoViewIfNeeded();
    const durationMs = Math.min(
      typeof request.durationMs === "number" && request.durationMs > 0 ? request.durationMs : 2000,
      5000,
    );
    await element.evaluate((el, ms) => {
      const doc = el.ownerDocument;
      const rect = el.getBoundingClientRect();
      const overlay = doc.createElement("div");
      overlay.style.cssText =
        "position:fixed;z-index:2147483647;pointer-events:none;border:3px solid #ff4d4f;" +
        "border-radius:4px;background:rgba(255,77,79,0.15);" +
        "left:" +
        String(rect.left - 3) +
        "px;top:" +
        String(rect.top - 3) +
        "px;" +
        "width:" +
        String(rect.width) +
        "px;height:" +
        String(rect.height) +
        "px;";
      doc.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), ms);
    }, durationMs);
    await sleep(300);
    return {
      page,
      viewId,
      summary:
        "Highlighted " + (request.element ?? request.ref) + " for " + String(durationMs) + "ms",
    };
  },
  cdp: async ({ request, context, state }) => {
    const method = typeof request.method === "string" ? request.method : "";
    const deniedPrefixes = [
      "Browser.",
      "Target.",
      "Storage.",
      "SystemInfo.",
      "Security.",
      "Input.",
      "Tethering.",
      "Cast.",
    ];
    const deniedMethods = [
      "Network.setCookie",
      "Network.setCookies",
      "Network.getCookies",
      "Network.getAllCookies",
      "Network.deleteCookies",
      "Network.clearBrowserCookies",
      "Network.clearBrowserCache",
    ];
    if (
      method.length === 0 ||
      deniedPrefixes.some((p) => method.startsWith(p)) ||
      deniedMethods.includes(method)
    ) {
      throw new Error(
        "CDP method " +
          JSON.stringify(method) +
          " is denied. Browser-wide, storage, cookie, cache, permission, target-management, and input commands are not allowed; use the dedicated browser tools instead.",
      );
    }
    const { page, viewId } = await resolvePage(request, context, state);
    const callerParams = request.params && typeof request.params === "object" ? request.params : {};
    const resultOutlivesTheDetachedSession = { returnByValue: true, awaitPromise: true };
    const params =
      method === "Runtime.evaluate" || method === "Runtime.callFunctionOn"
        ? { ...resultOutlivesTheDetachedSession, ...callerParams }
        : callerParams;
    const session = await context.newCDPSession(page);
    const deadlineMessage =
      "CDP " + method + " did not answer within " + String(NAVIGATE_TIMEOUT_MS / 1000) + "s";
    let timedOut = false;
    try {
      const result = await withDeadline(
        session.send(method, params),
        NAVIGATE_TIMEOUT_MS,
        deadlineMessage,
      ).catch((error) => {
        timedOut = error instanceof Error && error.message === deadlineMessage;
        throw error;
      });
      if (result.exceptionDetails) {
        const { exception, text } = result.exceptionDetails;
        throw new Error(
          "The page threw: " +
            capCdpText(String(exception?.description ?? exception?.value ?? text)),
        );
      }
      return {
        page,
        viewId,
        summary: "Ran CDP " + method,
        data: capCdpText(JSON.stringify(result)),
      };
    } finally {
      if (timedOut) await stopLoading(page);
      await withDeadline(session.detach(), 1000, "detach timed out").catch((failure) =>
        noteIgnoredFailure("detaching the cdp op's CDP session", failure),
      );
    }
  },
};

async function connectBrowser(request, state) {
  try {
    await ensureChrome(request.cdpPort, request.display, request.launchBrowser !== false);
    const evicted = await sweepTabs(request.cdpPort, request, state);
    const { chromium } = await import("playwright-core");
    const browser = await chromium.connectOverCDP("http://127.0.0.1:" + String(request.cdpPort), {
      timeout: 10000,
    });
    return { browser, evicted };
  } catch (error) {
    throw Object.assign(new Error(failureLine(error)), { infra: true });
  }
}

function capNote(evicted) {
  return (
    ". Closed " +
    String(evicted.length) +
    " least recently used tab(s) to keep the window within its " +
    String(TAB_CAP) +
    "-tab cap (" +
    urlsOf(evicted) +
    ")."
  );
}

async function sweepOnly(request, state) {
  const evicted = await sweepTabs(request.cdpPort, request, state);
  writeState(request.display, { recentTargets: state.recentTargets });
  return {
    ok: true,
    summary: "Swept the window's tabs" + (evicted.length > 0 ? capNote(evicted) : ""),
  };
}

async function run(request) {
  const state = loadState(request.display);
  if (request.op === "sweep") return sweepOnly(request, state);
  const connectStartedAt = performance.now();
  let connectMs;
  let browser;
  let evicted;
  try {
    ({ browser, evicted } = await connectBrowser(request, state));
    connectMs = Math.max(0, performance.now() - connectStartedAt);
  } catch (error) {
    const timed = error instanceof Error ? error : new Error(String(error));
    timed.connectMs = Math.max(0, performance.now() - connectStartedAt);
    throw timed;
  }
  try {
    const context = browser.contexts()[0] ?? (await browser.newContext());
    const loadedViews = { ...state.views };
    const loadedUrls = { ...state.urls };
    const loadedFrameRefs = { ...state.frameRefs };
    const loadedLastViewId = state.lastViewId;
    const op = OPS[request.op];
    if (op === undefined) throw new Error("Unknown op: " + String(request.op));
    let result;
    let opFailure;
    const opStartedAt = performance.now();
    try {
      result = await op({ request, context, state });
    } catch (error) {
      opFailure = error;
    }
    const opDurationMs = Math.max(0, performance.now() - opStartedAt);
    const recovery = request.navigationRecovery === true;
    const mayRecover =
      recovery &&
      result !== undefined &&
      result.page !== undefined &&
      result.recoveredErrorPage !== true &&
      RECOVER_ERROR_PAGE_AFTER.has(request.op);
    if (mayRecover) await settleIntoErrorPage(context, result.page);
    if (
      recovery &&
      result !== undefined &&
      result.page !== undefined &&
      result.recoveredErrorPage !== true &&
      !result.page.isClosed() &&
      isChromeErrorPage(result.page)
    ) {
      if (!mayRecover) {
        result.summary +=
          ". The page shows Chrome's error page: its last load failed. Use browser_navigate with the intended URL to retry.";
      } else {
        try {
          const outcome = await recoverErrorPage(context, result.page);
          result.summary +=
            outcome === undefined
              ? ". The page now shows Chrome's error page: the load failed (a form submission is never replayed automatically). Use browser_navigate with the intended URL, or re-submit the form, to retry."
              : ". The page landed on Chrome's error page, so it was reloaded automatically" +
                navigationNote(outcome) +
                ". Take a fresh browser_snapshot before acting on it.";
        } catch (error) {
          result.summary +=
            ". The page landed on Chrome's error page and reloading it failed: " +
            failureLine(error);
        }
      }
    }
    // Record the view's URL so a discard-churned target can be re-adopted by
    // URL on a later call (see resolvePage).
    if (result !== undefined && result.viewId !== undefined && result.page !== undefined) {
      const recordable = recordableUrl(result.page.url());
      if (recordable !== undefined) state.urls[result.viewId] = recordable;
    }
    if (result !== undefined && evicted.length > 0) result.summary += capNote(evicted);
    const used = result?.viewId === undefined ? undefined : state.views[result.viewId];
    if (used !== undefined) touchRecent(state, [used]);
    // Persist only the entries THIS process changed. state holds a snapshot of
    // the whole file from loadState, and writing it back wholesale would let
    // a concurrent driver call's save clobber fresher mappings with stale
    // ones (e.g. undo the other call's post-discard re-adoption).
    const dirtyViews = {};
    for (const key of Object.keys(state.views)) {
      if (state.views[key] !== loadedViews[key]) dirtyViews[key] = state.views[key];
    }
    const dirtyUrls = {};
    for (const key of Object.keys(state.urls)) {
      if (state.urls[key] !== loadedUrls[key]) dirtyUrls[key] = state.urls[key];
    }
    const dirtyFrameRefs = {};
    for (const key of Object.keys(state.frameRefs)) {
      const loaded = loadedFrameRefs[key] ?? {};
      for (const [ref, owner] of Object.entries(state.frameRefs[key] ?? {})) {
        if (loaded[ref] === owner) continue;
        dirtyFrameRefs[key] ??= {};
        dirtyFrameRefs[key][ref] = owner;
      }
    }
    saveState(request.display, {
      views: dirtyViews,
      urls: dirtyUrls,
      frameRefs: dirtyFrameRefs,
      recentTargets: state.recentTargets,
      deletedViews: state.deletedViews,
      // Only when THIS op changed it: an op that never resolves a view (e.g.
      // tabs list) must not write the loaded value back over a concurrent
      // call's fresher one.
      lastViewId: state.lastViewId !== loadedLastViewId ? state.lastViewId : undefined,
    });
    if (result === undefined) {
      throw Object.assign(opFailure instanceof Error ? opFailure : new Error(String(opFailure)), {
        opDurationMs,
        connectMs,
      });
    }
    const out = { ok: true, summary: result.summary, opDurationMs, connectMs };
    if (result.data !== undefined) out.data = result.data;
    if (result.meta !== undefined) out.meta = result.meta;
    if (result.control !== undefined) out.control = result.control;
    if (result.viewId !== undefined) out.viewId = result.viewId;
    if (result.page !== undefined) {
      out.url = stripUrlCredentials(result.page.url());
      out.title = await withDeadline(
        result.page.title(),
        TAB_CALL_DEADLINE_MS,
        "title timed out",
      ).catch(() => "");
      if (typeof request.screenshotPath === "string" && request.screenshotPath.length > 0) {
        mkdirSync(STATE_DIR, { recursive: true });
        const shotStartedAt = performance.now();
        await result.page
          .screenshot({
            path: request.screenshotPath,
            timeout: 8000,
            fullPage: result.fullPage === true,
          })
          .then(() => {
            out.screenshot = true;
            out.screenshotMs = Math.max(0, performance.now() - shotStartedAt);
          })
          .catch((failure) => noteIgnoredFailure("capturing the result screenshot", failure));
      }
    }
    return out;
  } catch (error) {
    const timed = error instanceof Error ? error : new Error(String(error));
    if (!Number.isFinite(timed.connectMs) || timed.connectMs < 0) {
      timed.connectMs = connectMs;
    }
    throw timed;
  } finally {
    await browser
      .close()
      .catch((failure) => noteIgnoredFailure("closing the browser connection", failure));
  }
}

const watchdog = setTimeout(
  () => {
    process.stdout.write(
      "\n" +
        RESULT_MARKER +
        JSON.stringify({
          ok: false,
          error: "Browser driver timed out after " + String(WATCHDOG_MS / 1000) + "s",
        }) +
        "\n",
    );
    process.exit(0);
  },
  WATCHDOG_MS - (Date.now() - DRIVER_STARTED_AT),
);

(async () => {
  let result;
  try {
    const raw =
      process.argv[2] === "--stdin"
        ? await new Promise((resolve, reject) => {
            let input = "";
            process.stdin.setEncoding("utf8");
            process.stdin.on("data", (chunk) => {
              input += chunk;
              const newline = input.indexOf("\n");
              if (newline !== -1) {
                process.stdin.pause();
                resolve(input.slice(0, newline));
              }
            });
            process.stdin.once("error", reject);
          })
        : (process.argv[2] ?? "");
    const request = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    result = await run(request);
  } catch (error) {
    result = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
    if (error instanceof Error && error.infra === true) result.infra = true;
    if (error instanceof Error && Number.isFinite(error.opDurationMs) && error.opDurationMs >= 0) {
      result.opDurationMs = error.opDurationMs;
    }
    if (error instanceof Error && Number.isFinite(error.connectMs) && error.connectMs >= 0) {
      result.connectMs = error.connectMs;
    }
  }
  clearTimeout(watchdog);
  process.stdout.write("\n" + RESULT_MARKER + JSON.stringify(result) + "\n");
  process.exit(0);
})();
