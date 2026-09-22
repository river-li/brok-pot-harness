/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/agent-summaries.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function compareAgentSummaries(a, b2) {
  return b2.updatedAt - a.updatedAt;
}
function upsertAgentSummary(summaries, updated) {
  let found = false;
  const next = summaries.map((summary) => {
    if (summary.id !== updated.id) return summary;
    found = true;
    return updated;
  });
  if (!found) next.push(updated);
  return next.sort(compareAgentSummaries);
}

