import { randomBytes } from "node:crypto";
import {
  appendFileSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";
import {
  connectBrowser,
  cookieKey,
  discoverMonitorPorts,
  isConnectionRefused,
  isRotatingAuthCookie,
  pushCookies,
  readCookies,
  toCookieParam,
} from "./cdp-cookies.mjs";

const SEED_PATH =
  process.env.SAND_COOKIE_SEED_PATH ??
  "/home/box/sand-data/chrome-cookie-seed.json";
const CAPTURE_INTERVAL_MS = Number.parseInt(
  process.env.SAND_COOKIE_PERSIST_INTERVAL_MS ?? "5000",
  10
);
const MAX_RESTORE_ATTEMPTS = 3;
const SEED_VERSION = 1;
const TELEMETRY_LOG_PATH =
  process.env.SAND_BOX_TELEMETRY_LOG ?? "/tmp/sand-box-telemetry.log";

function log(message) {
  process.stderr.write(`sand-cookie-persist ${message}\n`);
}

function emitTelemetry(event) {
  try {
    appendFileSync(TELEMETRY_LOG_PATH, `${JSON.stringify(event)}\n`, "utf8");
  } catch (error) {
    log(`telemetry append failed: ${String(error)}`);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function dropToBoxUser() {
  if (typeof process.getuid !== "function" || process.getuid() !== 0) return true;
  try {
    if (typeof process.setgroups === "function") process.setgroups([]);
    process.setgid("box");
    process.setuid("box");
    return true;
  } catch (error) {
    log(
      `could not drop to the box user (${String(error)}); refusing to run as ` +
        "root writing into box-owned data"
    );
    return false;
  }
}

const SEED_LOCK_TIMEOUT_MS = 5000;
const SEED_LOCK_RETRY_MS = 50;
const SEED_LOCK_STALE_MS = 30000;

function lockOwnerPath(lockDir) {
  return `${lockDir}/owner`;
}

function readLockOwner(fs, lockDir) {
  try {
    return fs.readFileSync(lockOwnerPath(lockDir), "utf8");
  } catch {
    return null;
  }
}

function lockOwnerPid(token) {
  const sep = token.indexOf(":");
  if (sep <= 0) return null;
  const pid = Number.parseInt(token.slice(0, sep), 10);
  return Number.isInteger(pid) && pid > 0 ? pid : null;
}

function processIsAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function removeLockDir(fs, lockDir) {
  try {
    fs.unlinkSync(lockOwnerPath(lockDir));
  } catch (error) {
    if (error?.code !== "ENOENT") log(`seed lock owner file not removed: ${String(error)}`);
  }
  try {
    fs.rmdirSync(lockDir);
  } catch (error) {
    if (error?.code !== "ENOENT") log(`seed lock dir not removed: ${String(error)}`);
  }
}

export async function withSeedLock(seedPath, fn, options = {}) {
  const fs = {
    mkdirSync,
    rmdirSync,
    statSync,
    writeFileSync,
    readFileSync,
    unlinkSync,
    ...(options.fs ?? {}),
  };
  const lockDir = `${seedPath}.lock`;
  const token = `${process.pid}:${randomBytes(8).toString("hex")}`;
  const deadline = Date.now() + (options.timeoutMs ?? SEED_LOCK_TIMEOUT_MS);
  for (;;) {
    try {
      fs.mkdirSync(lockDir);
      fs.writeFileSync(lockOwnerPath(lockDir), token);
      break;
    } catch (error) {
      if (error?.code === "ENOENT") {
        fs.mkdirSync(dirname(lockDir), { recursive: true });
        continue;
      }
      if (error?.code !== "EEXIST") throw error;
      let heldSinceMs = null;
      try {
        heldSinceMs = fs.statSync(lockDir).mtimeMs;
      } catch (statError) {
        if (statError?.code !== "ENOENT") {
          log(`seed lock dir unreadable, retrying: ${String(statError)}`);
        }
        continue;
      }
      if (Date.now() - heldSinceMs > (options.staleMs ?? SEED_LOCK_STALE_MS)) {
        const existing = readLockOwner(fs, lockDir);
        const pid = existing != null ? lockOwnerPid(existing) : null;
        if (pid == null || !processIsAlive(pid)) {
          removeLockDir(fs, lockDir);
          continue;
        }
      }
      if (Date.now() >= deadline) {
        throw new Error(`seed lock at ${lockDir} still held after timeout`);
      }
      await sleep(options.retryMs ?? SEED_LOCK_RETRY_MS);
    }
  }
  try {
    return await fn();
  } finally {
    if (readLockOwner(fs, lockDir) === token) {
      removeLockDir(fs, lockDir);
    }
  }
}

export function isCookiePersistEnabled(env = process.env) {
  const on = (value) => {
    const raw = value?.trim().toLowerCase();
    return raw === "1" || raw === "true" || raw === "yes";
  };
  return on(env.SAND_BOX_STORE_COPY_IN) || on(env.SAND_BOX_STORE_SYNC);
}

export function serializeSeed(cookies, now = Date.now()) {
  return JSON.stringify({ version: SEED_VERSION, savedAt: now, cookies });
}

export function parseSeed(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  const cookies = parsed?.cookies;
  return Array.isArray(cookies) ? cookies : null;
}

export function cookiesDigest(cookies) {
  const parts = cookies.map(c =>
    [
      cookieKey(c),
      c.value,
      c.secure ? 1 : 0,
      c.httpOnly ? 1 : 0,
      c.sameSite ?? "",
    ].join("\u0001")
  );
  parts.sort();
  return parts.join("\u0002");
}

export function selectMissingCookies(seedCookies, liveKeys) {
  const present = liveKeys instanceof Set ? liveKeys : new Set(liveKeys);
  return seedCookies.filter(cookie => !present.has(cookieKey(cookie)));
}

export function classifyRestoreOutcome(seedCount, missingAfter, corrupt = false) {
  if (corrupt) return "failed";
  if (seedCount === 0) return "empty";
  if (missingAfter <= 0) return "ok";
  if (missingAfter >= seedCount) return "failed";
  return "partial";
}

async function readFirstLiveJar(deps) {
  for (const port of deps.discoverPorts()) {
    let browser;
    try {
      browser = await deps.connect(port);
    } catch (error) {
      if (!isConnectionRefused(error)) log(`CDP port ${port} probe failed: ${String(error)}`);
      continue;
    }
    try {
      return await readCookies(browser);
    } catch (error) {
      log(`reading the jar on CDP port ${port} failed: ${String(error)}`);
    } finally {
      browser.close();
    }
  }
  return null;
}

// Chrome's cookie monster keeps every cookie in memory and, with persist_session_cookies_ off by default, synchronizes only non-session cookies to the SQLite store (https://chromium.googlesource.com/chromium/src/+/refs/tags/151.0.7922.169/net/cookies/cookie_monster.h), which commits every 30 seconds or 512 operations (https://chromium.googlesource.com/chromium/src/+/refs/tags/151.0.7922.169/net/extras/sqlite/sqlite_persistent_cookie_store.cc), so a copy of the `Cookies` file misses recent cookies and, by default, session cookies.
export async function captureToSeed(deps, lastDigest) {
  return withSeedLock(
    deps.seedPath,
    async () => {
      const jar = await readFirstLiveJar(deps);
      if (jar == null) return lastDigest;
      const cookies = [...jar.values()].filter(c => !isRotatingAuthCookie(c.name));
      const digest = cookiesDigest(cookies);
      if (digest === lastDigest) return lastDigest;
      writeSeedFile(deps, serializeSeed(cookies, deps.now?.() ?? Date.now()));
      deps.log?.(`captured ${cookies.length} cookie(s) to seed`);
      deps.emitTelemetry?.({
        kind: "cookie_persist",
        phase: "capture",
        outcome: "captured",
        seedCookies: cookies.length,
      });
      return digest;
    },
    { fs: deps.fs }
  );
}

function writeSeedFile(deps, text) {
  const path = deps.seedPath;
  deps.fs.mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp`;
  deps.fs.writeFileSync(tmp, text);
  deps.fs.renameSync(tmp, path);
}

export async function restoreFromSeed(deps) {
  let text;
  try {
    text = deps.fs.readFileSync(deps.seedPath, "utf8");
  } catch {
    return { injected: 0, missingAfter: 0, seedCount: 0 };
  }
  const seedCookies = parseSeed(text);
  if (seedCookies === null)
    return { injected: 0, missingAfter: 0, seedCount: 0, corrupt: true };
  if (seedCookies.length === 0)
    return { injected: 0, missingAfter: 0, seedCount: 0 };

  let injected = 0;
  let missingAfter = seedCookies.length;
  for (const port of deps.discoverPorts()) {
    let browser;
    try {
      browser = await deps.connect(port);
    } catch (error) {
      if (!isConnectionRefused(error)) log(`CDP port ${port} probe failed: ${String(error)}`);
      continue;
    }
    try {
      const live = await readCookies(browser);
      const missing = selectMissingCookies(seedCookies, new Set(live.keys()));
      if (missing.length > 0) {
        await pushCookies(browser, missing.map(toCookieParam));
        injected += missing.length;
      }
      const after = await readCookies(browser);
      const stillMissing = selectMissingCookies(
        seedCookies,
        new Set(after.keys())
      ).length;
      missingAfter = Math.min(missingAfter, stillMissing);
    } catch (error) {
      log(`injecting the seed into CDP port ${port} failed: ${String(error)}`);
    } finally {
      browser.close();
    }
  }
  return { injected, missingAfter, seedCount: seedCookies.length };
}

async function isAnyChromeUp(deps) {
  for (const port of deps.discoverPorts()) {
    let browser;
    try {
      browser = await deps.connect(port);
    } catch (error) {
      if (!isConnectionRefused(error)) log(`CDP port ${port} probe failed: ${String(error)}`);
      continue;
    }
    browser.close();
    return true;
  }
  return false;
}

async function main() {
  if (!dropToBoxUser()) return;
  if (!isCookiePersistEnabled()) {
    log(
      "durable box store not enabled (SAND_BOX_STORE_COPY_IN / SAND_BOX_STORE_SYNC); no-op"
    );
    return;
  }
  log(`starting; seed=${SEED_PATH} capture-interval=${CAPTURE_INTERVAL_MS}ms`);
  const deps = {
    connect: connectBrowser,
    discoverPorts: discoverMonitorPorts,
    seedPath: SEED_PATH,
    fs: {
      mkdirSync,
      readFileSync,
      renameSync,
      rmdirSync,
      statSync,
      unlinkSync,
      writeFileSync,
    },
    log,
    emitTelemetry,
  };

  let restored = false;
  let restoreAttempts = 0;
  let lastDigest = null;
  for (;;) {
    try {
      if (!restored) {
        if (await isAnyChromeUp(deps)) {
          const { injected, missingAfter, seedCount, corrupt } =
            await restoreFromSeed(deps);
          if (injected > 0) {
            log(`restored ${injected} cookie(s) from seed into live Chrome`);
          }
          restoreAttempts += 1;
          if (missingAfter === 0 || restoreAttempts >= MAX_RESTORE_ATTEMPTS) {
            restored = true;
            emitTelemetry({
              kind: "cookie_persist",
              phase: "restore",
              outcome: classifyRestoreOutcome(seedCount, missingAfter, corrupt),
              seedCookies: seedCount,
              injected,
              missingAfter,
              attempts: restoreAttempts,
            });
            if (missingAfter > 0) {
              log(
                `proceeding to capture after ${restoreAttempts} restore attempt(s); ` +
                  `${missingAfter} seed cookie(s) still absent from the live jar`
              );
            }
          }
        }
      } else {
        lastDigest = await captureToSeed(deps, lastDigest);
      }
    } catch (error) {
      log(`tick failed: ${String(error)}`);
    }
    await sleep(CAPTURE_INTERVAL_MS);
  }
}

if (
  process.argv[1] != null &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void main();
}
