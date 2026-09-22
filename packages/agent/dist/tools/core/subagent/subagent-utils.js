/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/subagent/subagent-utils.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isAnthropicModelId(modelId) {
  const normalized = modelId.toLowerCase();
  return normalized.startsWith("claude-") || normalized.startsWith("anthropic/claude-");
}
function shouldConvertMcpTupleSchemas(props, modelId) {
  const modelVendor = props.modelInfo?.vendor;
  return modelVendor === "anthropic" || isAnthropicModelId(modelId);
}

