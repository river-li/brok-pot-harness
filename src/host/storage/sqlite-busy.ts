/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/storage/sqlite-busy.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_scheduling();
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
function sqlitePrimaryCode(error42) {
  if (!(error42 instanceof Error)) return void 0;
  if ("errcode" in error42 && typeof error42.errcode === "number" && Number.isInteger(error42.errcode)) {
    return error42.errcode & 255;
  }
  if ("code" in error42 && typeof error42.code === "string") {
    return SQLITE_PRIMARY_CODES.get(error42.code.split("_", 2).join("_"));
  }
  return void 0;
}
function isSqliteBusyError(error42) {
  const code = sqlitePrimaryCode(error42);
  return code === SQLITE_BUSY || code === SQLITE_LOCKED;
}
function isSqliteIoError(error42) {
  return sqlitePrimaryCode(error42) === SQLITE_IOERR;
}
function isSqliteCantOpenError(error42) {
  return sqlitePrimaryCode(error42) === SQLITE_CANTOPEN;
}
function isSqliteCorruptError(error42) {
  const code = sqlitePrimaryCode(error42);
  return code === SQLITE_CORRUPT || code === SQLITE_NOTADB;
}
async function retrySqliteBusy(operation, options2 = {}) {
  const attempts2 = Math.max(1, options2.attempts ?? 5);
  const backoff2 = createRetryPolicy({
    name: "sqlite-busy",
    maxAttempts: attempts2,
    initialDelayMs: options2.baseDelayMs ?? 100,
    maxDelayMs: Number.MAX_SAFE_INTEGER
  });
  let lastError;
  for (let attempt = 1; attempt <= attempts2; attempt++) {
    try {
      return await operation();
    } catch (error42) {
      if (!isSqliteBusyError(error42)) throw error42;
      lastError = error42;
      if (attempt < attempts2) {
        await backoff2.schedule(attempt).elapsed;
      }
    }
  }
  throw lastError;
}

