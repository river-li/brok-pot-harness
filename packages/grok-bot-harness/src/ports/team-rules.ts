function mergeTeamRulesByFullPath(batches) {
  const seen = /* @__PURE__ */ new Set();
  const merged = [];
  for (const batch of batches) {
    for (const rule of batch) {
      if (seen.has(rule.fullPath)) continue;
      seen.add(rule.fullPath);
      merged.push(rule);
    }
  }
  return merged;
}
