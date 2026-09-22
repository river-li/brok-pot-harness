/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/computer-operation.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_COMPUTER_ACTION_BITS = {
  screenshot: 1,
  click: 2,
  move: 4,
  drag: 8,
  type: 16,
  key: 32,
  scroll: 64,
  wait: 128
};
function reviewFailureAuditOutcome(failure2) {
  switch (failure2) {
    case "policy_denied":
    case "approval_denied":
      return "denied";
    case "cancelled":
      return "cancelled";
    default:
      return void 0;
  }
}

