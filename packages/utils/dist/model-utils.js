function isCursorBigModel(modelName) {
  if (!modelName)
    return false;
  const lower = modelName.toLowerCase();
  return lower.includes("cursor-big") || lower.includes("dsv3") || lower.includes("kimi2p5-uninitialized") || lower.includes("kimi-k2p5-rl-") || lower.includes("kimi-k2p5-agent-") || lower.includes("titanium-0318") || lower.includes("composer") || lower.includes("genericbase");
}
var DSV3_TOOL_TOKENS_TO_STRIP;
var init_model_utils = __esm({
  "../packages/utils/dist/model-utils.js"() {
    "use strict";
    DSV3_TOOL_TOKENS_TO_STRIP = [
      // Original unicode tokens
      "<\uFF5Ctool\u2581calls\u2581begin\uFF5C>",
      "<\uFF5Ctool\u2581calls\u2581end\uFF5C>",
      "<\uFF5Ctool\u2581call\u2581begin\uFF5C>",
      "<\uFF5Ctool\u2581call\u2581end\uFF5C>",
      "<\uFF5Ctool\u2581outputs\u2581begin\uFF5C>",
      "<\uFF5Ctool\u2581outputs\u2581end\uFF5C>",
      "<\uFF5Ctool\u2581output\u2581begin\uFF5C>",
      "<\uFF5Ctool\u2581output\u2581end\uFF5C>",
      "<\uFF5Ctool\u2581sep\uFF5C>",
      // Redacted ASCII variants
      "<|redacted_tool_calls_begin|>",
      "<|redacted_tool_calls_end|>",
      "<|redacted_tool_call_begin|>",
      "<|redacted_tool_call_end|>",
      "<|redacted_tool_outputs_begin|>",
      "<|redacted_tool_outputs_end|>",
      "<|redacted_tool_output_begin|>",
      "<|redacted_tool_output_end|>",
      "<|redacted_tool_sep|>"
    ];
  }
});
