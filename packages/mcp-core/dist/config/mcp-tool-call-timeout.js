var DEFAULT_MCP_TOOL_CALL_MAX_TOTAL_TIMEOUT_MS, LEGACY_MCP_TOOL_CALL_TIMEOUT_MS;
var init_mcp_tool_call_timeout = __esm({
  "../packages/mcp-core/dist/config/mcp-tool-call-timeout.js"() {
    "use strict";
    init_error_message_utils();
    init_mcp_reconnect_config();
    DEFAULT_MCP_TOOL_CALL_MAX_TOTAL_TIMEOUT_MS = 60 * 6e4;
    LEGACY_MCP_TOOL_CALL_TIMEOUT_MS = 60 * 6e4;
  }
});
