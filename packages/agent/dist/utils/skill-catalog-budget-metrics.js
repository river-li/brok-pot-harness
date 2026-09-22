/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/skill-catalog-budget-metrics.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var skillCatalogBudgetApplied = createCounter("skill_catalog_budget.applied", {
  description: "Model invocations that ran the skill-catalog budget pipeline, tagged by which strategy was selected",
  labelNames: ["strategy"]
});
var skillCatalogBudgetRenderedTokens = createHistogram("skill_catalog_budget.rendered_tokens", {
  description: "Estimated tokens rendered for the skill catalog after budgeting, tagged by strategy",
  labelNames: ["strategy"]
});
var skillCatalogBudgetUncappedTokens = createHistogram("skill_catalog_budget.uncapped_tokens", {
  description: "Estimated tokens the skill catalog would have rendered with no budget applied, tagged by the strategy that ran",
  labelNames: ["strategy"]
});
var skillCatalogBudgetOmittedCount = createHistogram("skill_catalog_budget.omitted_count", {
  description: "Number of skills omitted from the rendered catalog, tagged by strategy",
  labelNames: ["strategy"]
});
function emitSkillCatalogBudgetMetrics(ctx, input) {
  const tags = { strategy: input.strategy };
  skillCatalogBudgetApplied.increment(ctx, 1, tags);
  skillCatalogBudgetRenderedTokens.histogram(ctx, input.renderedTokens, tags);
  skillCatalogBudgetUncappedTokens.histogram(ctx, input.uncappedTokens, tags);
  skillCatalogBudgetOmittedCount.histogram(ctx, input.omittedCount, tags);
}

