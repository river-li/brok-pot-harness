/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/mcp-meta-tool-names.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

