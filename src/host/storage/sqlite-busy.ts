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
function sqlitePrimaryCode(error41) {
  if (!(error41 instanceof Error)) return void 0;
  if ("errcode" in error41 && typeof error41.errcode === "number" && Number.isInteger(error41.errcode)) {
    return error41.errcode & 255;
  }
  if ("code" in error41 && typeof error41.code === "string") {
    return SQLITE_PRIMARY_CODES.get(error41.code.split("_", 2).join("_"));
  }
  return void 0;
}
function isSqliteBusyError(error41) {
  const code = sqlitePrimaryCode(error41);
  return code === SQLITE_BUSY || code === SQLITE_LOCKED;
}
function isSqliteIoError(error41) {
  return sqlitePrimaryCode(error41) === SQLITE_IOERR;
}
function isSqliteCantOpenError(error41) {
  return sqlitePrimaryCode(error41) === SQLITE_CANTOPEN;
}
function isSqliteCorruptError(error41) {
  const code = sqlitePrimaryCode(error41);
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
    } catch (error41) {
      if (!isSqliteBusyError(error41)) throw error41;
      lastError = error41;
      if (attempt < attempts2) {
        await backoff2.schedule(attempt).elapsed;
      }
    }
  }
  throw lastError;
}
