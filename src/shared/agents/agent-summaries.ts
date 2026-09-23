function agentRecencyOf(summary) {
  return Math.max(summary.updatedAt, summary.lastActivityAt ?? 0);
}
function compareAgentSummaries(a, b2) {
  return agentRecencyOf(b2) - agentRecencyOf(a);
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
