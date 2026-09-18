init_bounded();
init_errors();
var boundedConnectClass = brandedEnumOf(
  CONNECT_CODE_TAGS.map((code) => `ConnectError.${code}`),
  "ConnectError.Other"
);
function connectErrorClassOf(error41) {
  if (error41 instanceof ConnectError) return `ConnectError.${Code[error41.code]}`;
  return errorClassOf(error41);
}
function boundedConnectErrorClassOf(error41) {
  if (error41 instanceof ConnectError) {
    return boundedConnectClass(`ConnectError.${Code[error41.code]}`) ?? brandLiteralEnum("ConnectError.Other");
  }
  return boundedTelemetryToken(errorClassOf(error41));
}
function isRateLimitConnectError(error41) {
  return error41 instanceof ConnectError && error41.code === Code.ResourceExhausted;
}
function isInvalidArgumentConnectError(error41) {
  return error41 instanceof ConnectError && error41.code === Code.InvalidArgument;
}
function isDeadlineExceededConnectError(error41) {
  return error41 instanceof ConnectError && error41.code === Code.DeadlineExceeded;
}
function isUnimplementedConnectError(error41) {
  return error41 instanceof ConnectError && error41.code === Code.Unimplemented;
}
function isTransientConnectError(error41) {
  if (!(error41 instanceof ConnectError)) return false;
  switch (error41.code) {
    case Code.Unavailable:
    case Code.DeadlineExceeded:
    case Code.ResourceExhausted:
      return true;
    default:
      return false;
  }
}
function getConnectRetryAfterMs(error41, nowMs2 = Date.now()) {
  if (!(error41 instanceof ConnectError)) return void 0;
  return parseRetryAfterHeaderMs(error41.metadata.get("retry-after"), nowMs2);
}
