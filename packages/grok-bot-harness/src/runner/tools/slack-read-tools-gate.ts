var SLACK_MCP_READ_TOOL_NAMES = /* @__PURE__ */ new Set([
  "slack_read_channel",
  "slack_read_thread"
]);
function hasSlackReadMcpTools(mcpTools) {
  return mcpTools.some((tool) => SLACK_MCP_READ_TOOL_NAMES.has(tool.toolName));
}
