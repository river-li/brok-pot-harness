/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-auto-review.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto27 = require("node:crypto");
var SAND_AUTO_REVIEW_APPROVAL_TTL_MS = 10 * 60 * 1e3;
var SAND_AUTO_REVIEW_HOST_GENERATION = (0, import_node_crypto27.randomUUID)();
function sandAutoReviewApprovalExpiryPolicy(source) {
  return source === "turn" || source === "handoff-resume" ? "park" : "ttl";
}
var SAND_AUTO_REVIEW_MODES_OFF = {
  hostShell: "off",
  boxShell: "off",
  mcp: "off",
  computer: "off",
  automationWrite: "off",
  cloudAgent: "off",
  subagentLaunch: "off"
};
var SAND_AUTO_REVIEW_COMMAND_MAX_CHARS = 4e3;
function fingerprintSandAutoReviewTarget(target) {
  return (0, import_node_crypto27.createHash)("sha256").update(JSON.stringify(target)).digest("hex");
}

