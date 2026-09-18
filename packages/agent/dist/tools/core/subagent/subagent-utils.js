function isAnthropicModelId(modelId) {
  const normalized = modelId.toLowerCase();
  return normalized.startsWith("claude-") || normalized.startsWith("anthropic/claude-");
}
function shouldConvertMcpTupleSchemas(props, modelId) {
  const modelVendor = props.modelInfo?.vendor;
  return modelVendor === "anthropic" || isAnthropicModelId(modelId);
}
