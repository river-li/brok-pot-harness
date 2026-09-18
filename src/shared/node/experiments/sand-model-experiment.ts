var SAND_MODEL_EXPERIMENT_NAME = "sand_model_selection";
var SAND_MODEL_EXPERIMENT_OPUS_MEDIUM_SELECTION = {
  modelId: "claude-opus-4-8",
  maxMode: true,
  parameters: [
    { id: "thinking", value: "true" },
    { id: "context", value: "1m" },
    { id: "effort", value: "medium" },
    { id: "fast", value: "false" }
  ]
};
function parseSandModelExperimentOverride(value) {
  const raw = value?.trim().toLowerCase();
  if (raw == null || raw.length === 0) return void 0;
  if (raw === "control") return { active: true, arm: "control" };
  if (raw === "treatment" || raw === "test") {
    return { active: true, arm: "treatment" };
  }
  return void 0;
}
function resolveSandModelExperimentState(inputs) {
  if (inputs.envOverride != null) return inputs.envOverride;
  if (inputs.groupName == null) return void 0;
  return { active: true, arm: inputs.enabled ? "treatment" : "control" };
}
function selectSandModelExperimentModel(state, requestSource, configuredModel) {
  if (state == null || !state.active) return void 0;
  if (state.arm === "control") {
    return SAND_MODEL_EXPERIMENT_OPUS_MEDIUM_SELECTION;
  }
  return configuredModel ?? SAND_MODEL_EXPERIMENT_OPUS_MEDIUM_SELECTION;
}
var SAND_AUTOMATION_REQUEST_SOURCE = "automation";
function selectSandExperimentTurnModel(inputs) {
  const { state, requestSource } = inputs;
  if (state == null || !state.active || state.arm === "control") {
    return selectSandModelExperimentModel(state, requestSource, void 0);
  }
  const configuredModel = requestSource === SAND_AUTOMATION_REQUEST_SOURCE ? inputs.readConfiguredAutomationsModel() ?? inputs.readConfiguredDefaultModel() : inputs.readConfiguredDefaultModel();
  return selectSandModelExperimentModel(state, requestSource, configuredModel);
}
