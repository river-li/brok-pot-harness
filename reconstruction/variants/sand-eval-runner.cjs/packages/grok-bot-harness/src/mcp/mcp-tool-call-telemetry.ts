/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/mcp/mcp-tool-call-telemetry.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var OTHER_MCP_TOOL = "other";
var ALLOWLISTED_MCP_TOOLS = new Set(
  PLAYWRIGHT_MCP_TOOLS_LIST.map((row) => row.name)
);
function boundedMcpToolName(toolName) {
  if (toolName === void 0) return OTHER_MCP_TOOL;
  return ALLOWLISTED_MCP_TOOLS.has(toolName) ? toolName : OTHER_MCP_TOOL;
}
var DURATION_MS_CAP = 24 * 60 * 60 * 1e3;

