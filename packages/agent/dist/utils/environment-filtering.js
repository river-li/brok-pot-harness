/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/environment-filtering.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function filterByAgentEnvironment(items, agentType) {
  if (agentType === void 0 || agentType === AgentType.BUGBOT) {
    return items;
  }
  const envMap = {
    [AgentType.BACKGROUND]: "cloud",
    [AgentType.BUGBOT]: "local",
    [AgentType.IDE]: "local",
    [AgentType.CLI]: "local"
  };
  return filterByEnvironment(items, envMap[agentType]);
}

