/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-validation.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var RESERVED_SERVER_NAMES = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function getTransport(config2) {
  if ("command" in config2) return "stdio";
  return config2.type === "sse" ? "sse" : "http";
}
function getCommand(config2) {
  if (!("command" in config2)) return void 0;
  return [config2.command, ...config2.args ?? []].join(" ");
}
function validateServerName(rawName) {
  const name17 = rawName.trim();
  if (name17.length === 0) {
    throw new SandMcpConfigError("MCP server name is required.");
  }
  if (RESERVED_SERVER_NAMES.has(name17)) {
    throw new SandMcpConfigError(`MCP server name "${name17}" is reserved.`);
  }
  if (name17.includes("/") || name17.includes("\\") || name17.includes("\0")) {
    throw new SandMcpConfigError("MCP server names cannot include slashes or null bytes.");
  }
  if (name17.includes("--")) {
    throw new SandMcpConfigError('MCP server names cannot include "--".');
  }
  return name17;
}
function parseServerConfig(configJson) {
  const parsed2 = JSON.parse(configJson);
  return mcpServerSchema.parse(parsed2);
}
function toJsonArgs(args) {
  const result = {};
  for (const [key, value] of Object.entries(args)) {
    result[key] = value.toJson();
  }
  return result;
}

