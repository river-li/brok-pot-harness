init_dist3();
var logger90 = createLogger("@anysphere/agent:mcp-direct-mode-clamp");
var mcpDirectModeClamped = createCounter("agent.mcp.direct_mode_clamped", {
  description: "Direct-mode MCP tool lists sliced down to maxDirectMcpTools before advertisement"
});
var PRIORITIZED_DIRECT_MCP_PROVIDERS = [
  ...BROWSER_MCP_PROVIDER_IDS,
  CUSTOM_USER_TOOLS_PROVIDER_ID
];
var SECONDARY_DIRECT_MCP_PROVIDERS = [
  CURSOR_SUBSCRIPTIONS_MCP_SERVER_NAME
];
var prioritizedDirectMcpProviders = new Set(PRIORITIZED_DIRECT_MCP_PROVIDERS);
var secondaryDirectMcpProviders = new Set(SECONDARY_DIRECT_MCP_PROVIDERS);
