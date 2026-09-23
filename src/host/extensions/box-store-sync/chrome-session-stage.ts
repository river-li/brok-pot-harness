var import_node_fs19 = require("node:fs");
var import_promises22 = require("node:fs/promises");
var import_node_os5 = require("node:os");
var import_node_path20 = require("node:path");
init_scheduling();
init_errors();
var CHROME_SESSION_CATEGORY_NAME = "chrome-session";
var CHROME_SESSION_DB_DIR = "/home/box/chrome-profile/Default";
var CHROME_SESSION_DB_REL_DIR = "home/box/chrome-profile/Default";
var CHROME_SESSION_DB_NAMES = [
  "Cookies",
  "Login Data",
  "Login Data For Account",
  "Web Data"
];
var CHROME_AUTH_STATE_REL_DIRS = [
  "Local Storage",
  "Session Storage",
  "IndexedDB",
  "Service Worker"
];
var CHROME_AUTH_STATE_CACHE_EXCLUDE_NAMES = ["CacheStorage", "ScriptCache"];
var CHROME_SESSION_STAGE_MAX_ATTEMPTS = 1;
var CHROME_SESSION_STAGE_RETRY_DELAY_MS = 150;
var CHROME_SESSION_STAGE_VACUUM_BUSY_TIMEOUT_MS = 100;
async function stageBoxChromeSession(deps) {
  const sessionDbDir = deps.sessionDbDir ?? CHROME_SESSION_DB_DIR;
  const sessionDbRelDir = deps.sessionDbRelDir ?? CHROME_SESSION_DB_REL_DIR;
  const sessionDbNames = deps.sessionDbNames ?? CHROME_SESSION_DB_NAMES;
  const fileExists = deps.fileExists ?? import_node_fs19.existsSync;
  const vacuum = deps.vacuum ?? ((src, dest) => sqliteVacuumInto(src, dest, CHROME_SESSION_STAGE_VACUUM_BUSY_TIMEOUT_MS));
  const copyLockedDb = deps.copyLockedDb ?? copyLockedSqliteDb;
  const log5 = deps.log ?? ((message) => console.log(`[chrome-session-stage] ${message}`));
  const dir = await (0, import_promises22.mkdtemp)((0, import_node_path20.join)((0, import_node_os5.tmpdir)(), "sand-chrome-session-"));
  const files = [];
  const skippedDbNames = [];
  const copiedDbNames = [];
  let lastErrorClass = null;
  let lastFailure;
  for (const name17 of sessionDbNames) {
    const src = (0, import_node_path20.join)(sessionDbDir, name17);
    if (!fileExists(src)) continue;
    const dest = (0, import_node_path20.join)(dir, name17);
    let mode;
    try {
      mode = (await (0, import_promises22.stat)(src)).mode & 511;
    } catch (error42) {
      skippedDbNames.push(name17);
      lastErrorClass = classifySqliteSnapshotFailure(
        error42,
        "read_source_main",
        "source_main"
      ).errorClass;
      log5(`stage skipped ${name17} because its mode could not be read: ${String(error42)}`);
      continue;
    }
    try {
      await vacuumIntoWithRetry(src, dest, {
        vacuum,
        retry: deps.retry,
        log: log5
      });
      files.push({
        relPath: `${sessionDbRelDir}/${name17}`,
        absPath: dest,
        mode
      });
    } catch (thrown) {
      const error42 = thrown instanceof RetryExhaustedError ? thrown.cause : thrown;
      let failure2 = {
        db: name17,
        phase: "vacuum",
        ...classifySqliteSnapshotFailure(error42, "vacuum_into", "source_or_staged_main")
      };
      if (isSqliteBusyError(error42)) {
        let rawCopyFailure;
        const copied = copyLockedDb({
          srcPath: src,
          destPath: dest,
          onFailure: (value) => {
            rawCopyFailure = value;
          }
        });
        if (copied) {
          files.push({
            relPath: `${sessionDbRelDir}/${name17}`,
            absPath: dest,
            mode
          });
          copiedDbNames.push(name17);
          continue;
        }
        if (rawCopyFailure !== void 0) {
          failure2 = { db: name17, phase: "raw_copy", ...rawCopyFailure };
        }
      }
      skippedDbNames.push(name17);
      lastErrorClass = failure2.errorClass;
      lastFailure = failure2;
      log5(`stage skipped ${name17} after retries: ${String(error42)}`);
    }
  }
  if (copiedDbNames.length > 0) {
    log5(
      `staged ${copiedDbNames.length} exclusively-locked db(s) via raw-copy fallback: ${copiedDbNames.join(", ")}`
    );
  }
  if (deps.report !== void 0 && (files.length > 0 || skippedDbNames.length > 0)) {
    deps.report({
      staged: files.length,
      skipped: skippedDbNames.length,
      skippedDbNames,
      errorClass: lastErrorClass,
      ...lastFailure === void 0 ? {} : { failure: lastFailure }
    });
  }
  return {
    files,
    skipped: skippedDbNames.length,
    cleanup: () => (0, import_promises22.rm)(dir, { recursive: true, force: true })
  };
}
async function vacuumIntoWithRetry(src, dest, deps) {
  const vacuum = deps.vacuum ?? sqliteVacuumInto;
  await deps.retry.runWithRetry(async (attempt) => {
    if (attempt > 1) {
      await (0, import_promises22.rm)(dest, { force: true }).catch((error42) => {
        deps.log(`retry pre-clean failed: ${errorMessage(error42)}`);
      });
    }
    vacuum(src, dest);
  });
}
function isChromeSessionStageRetryable(error42) {
  return /busy|locked/i.test(String(error42));
}
