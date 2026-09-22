/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-agent-exec/dist/mcp.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
init_dist7();
init_auth2();

// @recovered-fragment 2/3
init_types5();

// @recovered-fragment 3/3
var McpToolNotFoundError = class extends Error {
  constructor(toolName, availableTools) {
    super(`Tool ${toolName} not found, available tools: ${availableTools.join(", ")}`);
    this.toolName = toolName;
    this.availableTools = availableTools;
    this.name = "McpToolNotFoundError";
  }
};
function isMcpToolNotFoundError(error42) {
  if (error42 instanceof McpToolNotFoundError) {
    return true;
  }
  if (!(error42 instanceof Error) || error42.name !== "McpToolNotFoundError") {
    return false;
  }
  const candidate = error42;
  return typeof candidate.toolName === "string" && Array.isArray(candidate.availableTools);
}

