/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/turn-initiator.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var USER_INITIATED_REQUEST_SOURCES = /* @__PURE__ */ new Set([
  "turn",
  "automation",
  "voice-call"
]);
function classifySandTurnInitiator(options2) {
  if (options2.isGroupMemberTurn === true) return "subagent";
  if (options2.isTopLevelAutomationSubagent === true && options2.requestSource === "automation") {
    return "user";
  }
  if (options2.isSubagentRunner) return "subagent";
  if (options2.requestSource === "agent") return "agent_peer";
  if (options2.requestSource !== void 0 && USER_INITIATED_REQUEST_SOURCES.has(options2.requestSource)) {
    return "user";
  }
  return "other";
}

