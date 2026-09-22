/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/errors/bounded.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function brandedEnumOf(values, fallback2) {
  const admitted = new Set(values);
  return (value) => {
    if (value === void 0) return void 0;
    return admitted.has(value) ? value : fallback2;
  };
}
function brandLiteralEnum(value) {
  const literal2 = value;
  return literal2;
}
var CONNECT_CODE_TAGS = [
  "Canceled",
  "Unknown",
  "InvalidArgument",
  "DeadlineExceeded",
  "NotFound",
  "AlreadyExists",
  "PermissionDenied",
  "ResourceExhausted",
  "FailedPrecondition",
  "Aborted",
  "OutOfRange",
  "Unimplemented",
  "Internal",
  "Unavailable",
  "DataLoss",
  "Unauthenticated"
];
var CONNECT_CODE_FALLBACK = "Other";
var brandedConnectCode = brandedEnumOf(CONNECT_CODE_TAGS, CONNECT_CODE_FALLBACK);
var SAND_ERRNO_TAGS = [
  "ECONNREFUSED",
  "ECONNRESET",
  "ECONNABORTED",
  "ETIMEDOUT",
  "EPIPE",
  "ENETRESET",
  "ENETDOWN",
  "ENETUNREACH",
  "EHOSTUNREACH",
  "EHOSTDOWN",
  "EAI_AGAIN",
  "ENOTFOUND",
  "EADDRINUSE",
  "EACCES",
  "EPERM",
  "ENOENT",
  "ENOSPC",
  "EDQUOT",
  "EROFS",
  "EBUSY",
  "EMFILE",
  "EIO"
];
var SAND_ERRNO_FALLBACK = "E_OTHER";
var brandedErrno = brandedEnumOf(SAND_ERRNO_TAGS, SAND_ERRNO_FALLBACK);
var BOUNDED_TELEMETRY_ERROR_NAMES = [
  "Error",
  "TypeError",
  "AbortError",
  "DeadlineExceededError",
  "ConnectError"
];
var BOUNDED_TELEMETRY_TOKENS = [
  "client-paused",
  "dev-induced-offline",
  "network-return",
  "unknown",
  "cold_create",
  "first_connect",
  "manual_update",
  "manual_reset",
  "auto_update",
  "remote_reset",
  "reconnect",
  ...BOUNDED_TELEMETRY_ERROR_NAMES,
  ...BOUNDED_TELEMETRY_ERROR_NAMES.flatMap(
    (name17) => SAND_ERRNO_TAGS.map((errno) => `${name17}/${errno}`)
  )
];
var brandedTelemetryToken = brandedEnumOf(BOUNDED_TELEMETRY_TOKENS, "unknown");

