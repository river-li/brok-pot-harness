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
function brandedMatch(pattern, value) {
  return typeof value === "string" && pattern.test(value) ? value : void 0;
}
function brandedId(value) {
  return brandedMatch(OPAQUE_ID, value);
}
function brandedErrorClass(value) {
  return brandedMatch(ERROR_CLASS, value);
}
function boundedTelemetryToken(value) {
  if (value !== void 0 && !BOUNDED_TELEMETRY_TOKENS.includes(value) && /^[A-Za-z][A-Za-z0-9]*\/E[A-Z0-9_]+$/.test(value)) {
    return brandLiteralEnum("Error/E_OTHER");
  }
  return brandedTelemetryToken(value) ?? brandLiteralEnum("unknown");
}
var OPAQUE_ID, ERROR_CLASS, CONNECT_CODE_TAGS, CONNECT_CODE_FALLBACK, brandedConnectCode, SAND_ERRNO_TAGS, SAND_ERRNO_FALLBACK, brandedErrno, BOUNDED_TELEMETRY_ERROR_NAMES, BOUNDED_TELEMETRY_TOKENS, brandedTelemetryToken;
var init_bounded = __esm({
  "src/shared/errors/bounded.ts"() {
    "use strict";
    OPAQUE_ID = /^[0-9A-Za-z._:|-]{1,128}$/;
    ERROR_CLASS = /^[0-9A-Za-z._|:-]{1,64}$/;
    CONNECT_CODE_TAGS = [
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
    CONNECT_CODE_FALLBACK = "Other";
    brandedConnectCode = brandedEnumOf(CONNECT_CODE_TAGS, CONNECT_CODE_FALLBACK);
    SAND_ERRNO_TAGS = [
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
    SAND_ERRNO_FALLBACK = "E_OTHER";
    brandedErrno = brandedEnumOf(SAND_ERRNO_TAGS, SAND_ERRNO_FALLBACK);
    BOUNDED_TELEMETRY_ERROR_NAMES = [
      "Error",
      "TypeError",
      "AbortError",
      "DeadlineExceededError",
      "ConnectError"
    ];
    BOUNDED_TELEMETRY_TOKENS = [
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
    brandedTelemetryToken = brandedEnumOf(BOUNDED_TELEMETRY_TOKENS, "unknown");
  }
});
