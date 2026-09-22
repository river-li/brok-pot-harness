/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/storage/sqlite-busy.ts
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SQLITE_BUSY = 5;
var SQLITE_LOCKED = 6;
var SQLITE_IOERR = 10;
var SQLITE_CORRUPT = 11;
var SQLITE_CANTOPEN = 14;
var SQLITE_NOTADB = 26;
var SQLITE_PRIMARY_CODES = /* @__PURE__ */ new Map([
  ["SQLITE_BUSY", SQLITE_BUSY],
  ["SQLITE_LOCKED", SQLITE_LOCKED],
  ["SQLITE_IOERR", SQLITE_IOERR],
  ["SQLITE_CORRUPT", SQLITE_CORRUPT],
  ["SQLITE_CANTOPEN", SQLITE_CANTOPEN],
  ["SQLITE_NOTADB", SQLITE_NOTADB]
]);
function sqlitePrimaryCode(error) {
  if (!(error instanceof Error)) return void 0;
  if ("errcode" in error && typeof error.errcode === "number" && Number.isInteger(error.errcode)) {
    return error.errcode & 255;
  }
  if ("code" in error && typeof error.code === "string") {
    return SQLITE_PRIMARY_CODES.get(error.code.split("_", 2).join("_"));
  }
  return void 0;
}
function isSqliteIoError(error) {
  return sqlitePrimaryCode(error) === SQLITE_IOERR;
}
function isSqliteCantOpenError(error) {
  return sqlitePrimaryCode(error) === SQLITE_CANTOPEN;
}
function isSqliteCorruptError(error) {
  const code = sqlitePrimaryCode(error);
  return code === SQLITE_CORRUPT || code === SQLITE_NOTADB;
}

