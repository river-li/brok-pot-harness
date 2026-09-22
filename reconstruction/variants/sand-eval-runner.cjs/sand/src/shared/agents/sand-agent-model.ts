/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/sand-agent-model.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var SAND_SUMMARIZATION_MODEL_ID = "gemini-2.5-flash";
var sandAgentModelParameterSchema = external_exports.object({
  id: external_exports.string().min(1),
  value: external_exports.string()
});
var sandModelSelectionSchema = external_exports.object({
  modelId: external_exports.string().min(1),
  maxMode: external_exports.boolean(),
  parameters: external_exports.array(sandAgentModelParameterSchema)
});
var sandAgentDefaultModelSchema = sandModelSelectionSchema.extend({
  maxMode: external_exports.boolean().transform(() => true)
});
var sandComputerUseModelSchema = sandModelSelectionSchema.refine(
  (model) => model.modelId.trim().length > 0,
  { path: ["modelId"] }
);
var sandBrowserUseModelSchema = sandModelSelectionSchema.refine(
  (model) => model.modelId.trim().length > 0,
  { path: ["modelId"] }
);

