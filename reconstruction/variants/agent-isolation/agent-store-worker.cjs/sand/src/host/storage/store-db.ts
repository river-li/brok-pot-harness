/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/storage/store-db.ts
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_sqlite = require("node:sqlite");
var DB_BUSY_TIMEOUT_MS = 5e3;
function applyStorePragmas(db, options) {
  db.exec(`PRAGMA busy_timeout = ${options.busyTimeoutMs ?? DB_BUSY_TIMEOUT_MS}`);
  try {
    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA synchronous = NORMAL");
  } catch (error) {
    if (options.allowWalFailure !== true) throw error;
  }
  if (options.incrementalAutoVacuum === true) {
    db.exec("PRAGMA auto_vacuum = INCREMENTAL");
  }
}
var SQLITE_DB_SIDECAR_SUFFIXES = ["-wal", "-shm", "-journal"];

