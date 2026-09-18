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
