var MCP_SERVER_ID_PATTERN = /^[1-9]\d*$/;
function isMcpServerId(rawId) {
  return MCP_SERVER_ID_PATTERN.test(rawId.trim());
}
function validateMcpServerId(rawId) {
  const id = rawId.trim();
  if (!isMcpServerId(id)) {
    throw new SandMcpConfigError("MCP server ID must be a positive decimal string.");
  }
  return id;
}
function isGrokDisplayServerId(rawId) {
  return rawId.startsWith("grok:") && rawId.length > "grok:".length;
}
var MCP_DISPLAY_SERVER_ID_PATTERN = /^-?[1-9]\d*$/;
function validateMcpDisplayServerId(rawId) {
  const id = rawId.trim();
  if (isGrokDisplayServerId(id)) {
    return id;
  }
  if (!MCP_DISPLAY_SERVER_ID_PATTERN.test(id)) {
    throw new SandMcpConfigError("MCP server ID must be a decimal string.");
  }
  return id;
}
function parseInt32McpServerId(rawId) {
  const parsed2 = Number(validateMcpServerId(rawId));
  if (!Number.isSafeInteger(parsed2) || parsed2 > 2147483647) {
    throw new SandMcpConfigError("MCP server ID is outside the supported range.");
  }
  return parsed2;
}
