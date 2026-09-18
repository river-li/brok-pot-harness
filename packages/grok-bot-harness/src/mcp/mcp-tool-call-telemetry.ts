var OTHER_MCP_TOOL = "other";
var ALLOWLISTED_MCP_TOOLS = new Set(
  PLAYWRIGHT_MCP_TOOLS_LIST.map((row) => row.name)
);
function boundedMcpToolName(toolName) {
  if (toolName === void 0) return OTHER_MCP_TOOL;
  return ALLOWLISTED_MCP_TOOLS.has(toolName) ? toolName : OTHER_MCP_TOOL;
}
function boundedMcpTransport(transport) {
  switch (transport) {
    case "http":
      return "http";
    case "stdio":
      return "stdio";
    default:
      return "unknown";
  }
}
var DURATION_MS_CAP = 24 * 60 * 60 * 1e3;
var WINDOW_INDEX_CAP = 256;
function toolCallCompletedRow(report, harness) {
  return {
    conversation_id: report.conversationId,
    request_id: report.requestId,
    tool_name: report.toolName,
    tool_call_id: report.toolCallId,
    connector: report.connector,
    mcp_tool: boundedMcpToolName(report.mcpTool),
    transport: boundedMcpTransport(report.transport),
    harness,
    outcome: report.outcome,
    // The same bounded classes sand.tool_call.error ships: ConnectError.<Code>,
    // an Error constructor name, or one of the exec seam's own tokens.
    error_class: report.outcome === "error" ? report.errorClass : void 0,
    duration_ms: String(Math.min(Math.max(0, Math.round(report.durationMs)), DURATION_MS_CAP)),
    window_index: report.windowIndex === void 0 ? void 0 : String(Math.min(Math.max(0, Math.round(report.windowIndex)), WINDOW_INDEX_CAP))
  };
}
