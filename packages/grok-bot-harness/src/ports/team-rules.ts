/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/team-rules.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

