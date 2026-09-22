/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/working-state-export/working-state-warm-eligibility.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isWorkingStateWarmEligible(agentId, deps) {
  if (!deps.isStoreEnabled()) return false;
  if (!deps.isV2StoreEnabled()) return false;
  if (deps.hasActivePause()) return false;
  if (!deps.hasAuthenticatedBootstrap()) return false;
  if (!deps.isBoxAgent(agentId)) return false;
  return deps.checkGate();
}
function boxAgentPopulation(agentIds, runningAgentIds, isBoxAgent) {
  const boxAgentIds = agentIds.filter(isBoxAgent);
  return {
    idleAgentIds: boxAgentIds.filter((agentId) => !runningAgentIds.has(agentId)),
    totalAgents: boxAgentIds.length
  };
}

