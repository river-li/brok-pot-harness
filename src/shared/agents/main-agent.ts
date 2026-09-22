/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/main-agent.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MAIN_AGENT_ID_MAX_LENGTH = 64;
function isMainAgentId(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= MAIN_AGENT_ID_MAX_LENGTH;
}

