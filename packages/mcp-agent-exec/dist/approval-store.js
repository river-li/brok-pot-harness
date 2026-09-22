/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-agent-exec/dist/approval-store.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var McpServerDisabledError = class extends Error {
  constructor(serverName) {
    super(`MCP server "${serverName}" is disabled`);
    this.name = "McpServerDisabledError";
  }
};
var McpServerNotApprovedError = class extends Error {
  constructor(serverName) {
    super(`MCP server "${serverName}" has not been approved`);
    this.serverName = serverName;
    this.name = "McpServerNotApprovedError";
  }
};

