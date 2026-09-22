/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/errors/connect-errors.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_esm2();

// @recovered-fragment 2/2
init_bounded();
init_errors();
var boundedConnectClass = brandedEnumOf(
  CONNECT_CODE_TAGS.map((code) => `ConnectError.${code}`),
  "ConnectError.Other"
);
function connectErrorClassOf(error42) {
  if (error42 instanceof ConnectError) return `ConnectError.${Code[error42.code]}`;
  return errorClassOf(error42);
}
function boundedConnectErrorClassOf(error42) {
  if (error42 instanceof ConnectError) {
    return boundedConnectClass(`ConnectError.${Code[error42.code]}`) ?? brandLiteralEnum("ConnectError.Other");
  }
  return boundedTelemetryToken(errorClassOf(error42));
}
function isRateLimitConnectError(error42) {
  return error42 instanceof ConnectError && error42.code === Code.ResourceExhausted;
}
function isInvalidArgumentConnectError(error42) {
  return error42 instanceof ConnectError && error42.code === Code.InvalidArgument;
}
function isDeadlineExceededConnectError(error42) {
  return error42 instanceof ConnectError && error42.code === Code.DeadlineExceeded;
}
function isUnimplementedConnectError(error42) {
  return error42 instanceof ConnectError && error42.code === Code.Unimplemented;
}
function isTransientConnectError(error42) {
  if (!(error42 instanceof ConnectError)) return false;
  switch (error42.code) {
    case Code.Unavailable:
    case Code.DeadlineExceeded:
    case Code.ResourceExhausted:
      return true;
    default:
      return false;
  }
}
function getConnectRetryAfterMs(error42, nowMs2 = Date.now()) {
  if (!(error42 instanceof ConnectError)) return void 0;
  return parseRetryAfterHeaderMs(error42.metadata.get("retry-after"), nowMs2);
}

