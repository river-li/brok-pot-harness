/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/sand-agent-model.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function resolveComputerUseModelSelection({
  storedModel,
  overrideModel
}) {
  return overrideModel ?? storedModel;
}
var SAND_SUMMARIZATION_MODEL_ID, SAND_COMPUTER_USE_SUBAGENT_MODEL_ID, sandAgentModelParameterSchema, sandModelSelectionSchema, sandAgentDefaultModelSchema, sandComputerUseModelSchema, sandBrowserUseModelSchema, SAND_COMPUTER_USE_MODEL_SELECTION;
var init_sand_agent_model = __esm({
  "src/shared/agents/sand-agent-model.ts"() {
    "use strict";
    init_zod();
    init_agent_model();
    SAND_SUMMARIZATION_MODEL_ID = "gemini-2.5-flash";
    SAND_COMPUTER_USE_SUBAGENT_MODEL_ID = "sand-cua";
    sandAgentModelParameterSchema = external_exports.object({
      id: external_exports.string().min(1),
      value: external_exports.string()
    });
    sandModelSelectionSchema = external_exports.object({
      modelId: external_exports.string().min(1),
      maxMode: external_exports.boolean(),
      parameters: external_exports.array(sandAgentModelParameterSchema)
    });
    sandAgentDefaultModelSchema = sandModelSelectionSchema.extend({
      maxMode: external_exports.boolean().transform(() => true)
    });
    sandComputerUseModelSchema = sandModelSelectionSchema.refine(
      (model) => model.modelId.trim().length > 0,
      { path: ["modelId"] }
    );
    sandBrowserUseModelSchema = sandModelSelectionSchema.refine(
      (model) => model.modelId.trim().length > 0,
      { path: ["modelId"] }
    );
    SAND_COMPUTER_USE_MODEL_SELECTION = {
      modelId: SAND_COMPUTER_USE_SUBAGENT_MODEL_ID,
      maxMode: false,
      parameters: []
    };
  }
});

