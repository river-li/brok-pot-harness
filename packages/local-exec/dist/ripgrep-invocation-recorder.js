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
