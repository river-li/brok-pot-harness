/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/agents/runtime-capability-retry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var RUNTIME_CAPABILITIES_RETRY_OPTIONS = {
  maxAttempts: 3,
  initialDelayMs: 1e3,
  maxDelayMs: 2e3,
  shouldRetry: (error42) => isTransientConnectError(error42) && !isRateLimitConnectError(error42)
};

