/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/chrome-import/cookie-origin-approval-frames.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_unknown_record();

// @recovered-fragment 2/2
var GATEWAY_COOKIE_ORIGIN_APPROVAL_REQUESTS_PATH = "/cookie-origin-approval/requests";
var GATEWAY_COOKIE_ORIGIN_APPROVAL_RESPONSES_PATH = "/cookie-origin-approval/responses";
var SAND_NO_COOKIE_ORIGIN_APPROVAL_MACHINE_MESSAGE = "Your computer isn't connected right now, so Chrome cookie origins can't be reached. Open Grok Bot on that machine and try again.";
var SAND_COOKIE_ORIGIN_APPROVAL_MACHINE_UNAVAILABLE_MESSAGE = "Your computer looks disconnected, so Chrome cookie origins can't be reached. Reconnect it and try again.";
var SAND_COOKIE_ORIGIN_APPROVAL_ABORTED_MESSAGE = "The Chrome cookie origin request was cancelled before the user answered.";
var SAND_COOKIE_ORIGIN_APPROVAL_EXPIRED_MESSAGE = "The Chrome cookie origin request expired before the user answered.";
var SAND_COOKIE_ORIGIN_APPROVAL_ASK_TTL_MS = SAND_LOCAL_TOOL_ASK_TTL_MS;
var SAND_COOKIE_ORIGIN_APPROVAL_SETTLED_BUFFER_TTL_MS = 5 * 60 * 1e3;
var SAND_COOKIE_ORIGIN_APPROVAL_HEARTBEAT_INTERVAL_MS = 1e4;
var SAND_COOKIE_ORIGIN_APPROVAL_LIVENESS_WINDOW_MS = 3e4;
var SAND_COOKIE_ORIGIN_APPROVAL_MISSED_HEARTBEATS_BEFORE_RECONNECT = Math.ceil(
  SAND_COOKIE_ORIGIN_APPROVAL_LIVENESS_WINDOW_MS / SAND_COOKIE_ORIGIN_APPROVAL_HEARTBEAT_INTERVAL_MS
);
function parseCookieOriginApprovalRefusalReason(raw) {
  switch (raw) {
    case "no-machine":
    case "machine-stale":
    case "no-window":
    case "no-match":
    case "aborted":
    case "expired":
    case "unavailable":
    case "denied":
      return raw;
    default:
      return void 0;
  }
}

