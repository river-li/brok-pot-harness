/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/sqlite-snapshot.ts
 * Bundle: sand-host/extensions/box-store-sync/box-store-vacuum-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_sqlite2 = require("node:sqlite");

// @recovered-fragment 2/2
function sqliteVacuumInto(srcPath, destPath, busyTimeoutMs = DB_BUSY_TIMEOUT_MS) {
  const db = new import_node_sqlite2.DatabaseSync(srcPath, { readOnly: true });
  try {
    db.exec(`PRAGMA busy_timeout = ${busyTimeoutMs}`);
    db.exec(`VACUUM INTO '${destPath.replace(/'/g, "''")}'`);
  } finally {
    db.close();
  }
}

