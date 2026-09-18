var SAND_STATIC_MCP_META_TOOL_NAMES = {
  discovery: "GetMcpTools",
  invocation: "CallMcpTool"
};
var SAND_DYNAMIC_MCP_META_TOOL_NAMES = {
  discovery: "GetDynamicTools",
  invocation: "CallDynamicTool"
};
function sandMcpMetaToolNames(usesDynamicToolNamespaces) {
  return usesDynamicToolNamespaces ? SAND_DYNAMIC_MCP_META_TOOL_NAMES : SAND_STATIC_MCP_META_TOOL_NAMES;
}
