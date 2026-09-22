var import_node_fs13 = require("node:fs");
var import_node_path13 = require("node:path");
var import_node_sqlite = require("node:sqlite");
var DB_BUSY_TIMEOUT_MS = 5e3;
function applyStorePragmas(db, options2) {
  db.exec(`PRAGMA busy_timeout = ${options2.busyTimeoutMs ?? DB_BUSY_TIMEOUT_MS}`);
  try {
    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA synchronous = NORMAL");
  } catch (error42) {
    if (options2.allowWalFailure !== true) throw error42;
  }
  if (options2.incrementalAutoVacuum === true) {
    db.exec("PRAGMA auto_vacuum = INCREMENTAL");
  }
}
var dbWriteGenerations = /* @__PURE__ */ new Map();
function getSandAgentDbWriteGeneration(dbPath) {
  return dbWriteGenerations.get((0, import_node_path13.resolve)(dbPath)) ?? 0;
}
function bumpDbWriteGeneration(resolvedDbPath) {
  dbWriteGenerations.set(resolvedDbPath, (dbWriteGenerations.get(resolvedDbPath) ?? 0) + 1);
}
function deleteSandAgentDbWriteGeneration(dbPath) {
  dbWriteGenerations.delete((0, import_node_path13.resolve)(dbPath));
}
var liveDbHandlesByPath = /* @__PURE__ */ new Map();
function liveDbHandleCount(resolvedDbPath) {
  return liveDbHandlesByPath.get(resolvedDbPath) ?? 0;
}
function registerLiveDbHandle(resolvedDbPath) {
  liveDbHandlesByPath.set(resolvedDbPath, liveDbHandleCount(resolvedDbPath) + 1);
}
function releaseLiveDbHandle(resolvedDbPath) {
  const next = liveDbHandleCount(resolvedDbPath) - 1;
  if (next <= 0) liveDbHandlesByPath.delete(resolvedDbPath);
  else liveDbHandlesByPath.set(resolvedDbPath, next);
}
function hasLiveSandAgentDbHandle(dbPath) {
  return liveDbHandleCount((0, import_node_path13.resolve)(dbPath)) > 0;
}
function walFramesFullyFolded(row) {
  const log4 = typeof row?.log === "number" ? row.log : void 0;
  const checkpointed = typeof row?.checkpointed === "number" ? row.checkpointed : void 0;
  if (log4 === void 0 || checkpointed === void 0) return void 0;
  if (log4 < 0 || checkpointed < 0) return void 0;
  return checkpointed >= log4;
}
function checkpointSandAgentDb(dbPath, busyTimeoutMs = DB_BUSY_TIMEOUT_MS) {
  if (!(0, import_node_fs13.existsSync)(dbPath)) return true;
  let db;
  let result;
  try {
    db = new import_node_sqlite.DatabaseSync(dbPath);
    db.exec(`PRAGMA busy_timeout = ${busyTimeoutMs}`);
    result = db.prepare("PRAGMA wal_checkpoint(TRUNCATE)").get();
  } catch (error42) {
    reportFallback("store_db", error42);
    return false;
  } finally {
    db?.close();
  }
  const folded = walFramesFullyFolded(result);
  if (folded !== void 0) {
    return folded;
  }
  try {
    return (0, import_node_fs13.statSync)(`${dbPath}-wal`).size === 0;
  } catch (error42) {
    return error42?.code === "ENOENT";
  }
}
var SQLITE_DB_SIDECAR_SUFFIXES = ["-wal", "-shm", "-journal"];
