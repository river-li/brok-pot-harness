init_zod();
var SAND_DEFAULT_MODEL_CONFIG_NAME = "sand_default_model";
var SAND_AUTOMATIONS_MODEL_CONFIG_NAME = "sand_automations_model";
var SAND_MODEL_FILTER_CONFIG_NAME = "sand_model_filter";
var MAX_MODEL_ID_LENGTH = 128;
var MAX_PARAMETERS = 16;
var MAX_PARAMETER_VALUE_LENGTH = 64;
var ROUTED_MODEL_IDS = /* @__PURE__ */ new Set([
  "default",
  "premium",
  "auto-low",
  "auto-medium",
  "auto-high",
  "auto-smart"
]);
var sandDefaultModelConfigSchema = external_exports.object({
  modelId: external_exports.string(),
  maxMode: external_exports.boolean(),
  parameters: external_exports.array(external_exports.object({ id: external_exports.string().min(1), value: external_exports.string() }))
});
var KEEP_DEFAULT = {
  selection: void 0,
  rejection: void 0
};
function refuse(rejection) {
  return { selection: void 0, rejection };
}
function resolveSandDefaultModelConfig(inputs) {
  if (!inputs.hasHydratedStatsigUserId) return refuse("identity_unhydrated");
  const parsed2 = sandDefaultModelConfigSchema.safeParse(inputs.raw);
  if (!parsed2.success) return refuse("malformed");
  const { modelId, maxMode, parameters: parameters2 } = parsed2.data;
  if (modelId.length === 0) return KEEP_DEFAULT;
  if (modelId.length > MAX_MODEL_ID_LENGTH || /[\s\p{Cc}]/u.test(modelId)) {
    return refuse("invalid_model_id");
  }
  if (parameters2.length > MAX_PARAMETERS) {
    return refuse("parameters_out_of_bounds");
  }
  const ids = /* @__PURE__ */ new Set();
  for (const parameter of parameters2) {
    if (parameter.value.length > MAX_PARAMETER_VALUE_LENGTH) {
      return refuse("parameters_out_of_bounds");
    }
    if (ids.has(parameter.id)) return refuse("duplicate_parameter");
    ids.add(parameter.id);
  }
  if (ROUTED_MODEL_IDS.has(modelId) && (maxMode || parameters2.length > 0)) {
    return refuse("routed_model_parameters");
  }
  return {
    selection: { modelId, maxMode, parameters: parameters2 },
    rejection: void 0
  };
}
