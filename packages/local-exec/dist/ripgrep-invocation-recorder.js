/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/ripgrep-invocation-recorder.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var _handler;
function isRipgrepInvocationRecordingEnabled() {
  return _handler !== void 0;
}
function recordRipgrepInvocation(record2) {
  if (_handler === void 0) {
    return;
  }
  try {
    _handler(record2);
  } catch {
  }
}

