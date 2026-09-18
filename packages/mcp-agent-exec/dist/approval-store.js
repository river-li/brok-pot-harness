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
