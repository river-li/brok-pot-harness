var RUNTIME_CAPABILITIES_RETRY_OPTIONS = {
  maxAttempts: 3,
  initialDelayMs: 1e3,
  maxDelayMs: 2e3,
  shouldRetry: (error41) => isTransientConnectError(error41) && !isRateLimitConnectError(error41)
};
