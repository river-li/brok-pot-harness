/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/chrome-import/cookie-origin-approval-frames.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_COOKIE_ORIGIN_APPROVAL_SETTLED_BUFFER_TTL_MS = 5 * 60 * 1e3;
var SAND_COOKIE_ORIGIN_APPROVAL_HEARTBEAT_INTERVAL_MS = 1e4;
var SAND_COOKIE_ORIGIN_APPROVAL_LIVENESS_WINDOW_MS = 3e4;
var SAND_COOKIE_ORIGIN_APPROVAL_MISSED_HEARTBEATS_BEFORE_RECONNECT = Math.ceil(
  SAND_COOKIE_ORIGIN_APPROVAL_LIVENESS_WINDOW_MS / SAND_COOKIE_ORIGIN_APPROVAL_HEARTBEAT_INTERVAL_MS
);

