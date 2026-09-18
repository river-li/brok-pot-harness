var RETRYABLE_CONNECT_CODES = /* @__PURE__ */ new Set([
  Code.Unavailable,
  Code.ResourceExhausted,
  Code.Internal,
  Code.Aborted,
  Code.DeadlineExceeded
]);
