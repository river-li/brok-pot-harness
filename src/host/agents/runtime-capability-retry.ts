var RUNTIME_CAPABILITIES_RETRY_OPTIONS = {
  maxAttempts: 3,
  initialDelayMs: 1e3,
  maxDelayMs: 2e3,
  shouldRetry: (error42) => isTransientConnectError(error42) && !isRateLimitConnectError(error42)
};
