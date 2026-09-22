/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/prompts/claude-helpers.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isSlackV1_5ThreadBoundSession(props) {
  if (props.isSlackV1_5 !== true) {
    return false;
  }
  const sessionKind = props.namedAgentSessionKind?.trim() ?? "";
  return sessionKind === "" || sessionKind === "slack_thread";
}

