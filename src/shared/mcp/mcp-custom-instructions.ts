/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/mcp/mcp-custom-instructions.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MCP_CUSTOM_INSTRUCTIONS_MAX_LENGTH = 500;
function clampMcpCustomInstruction(raw) {
  return raw.length > MCP_CUSTOM_INSTRUCTIONS_MAX_LENGTH ? raw.slice(0, MCP_CUSTOM_INSTRUCTIONS_MAX_LENGTH) : raw;
}
var DEFAULT_MCP_CONNECTOR_INSTRUCTIONS = /* @__PURE__ */ new Map([
  [
    "hex",
    "When using Hex, get the underlying numbers as data: download/export the results as CSV or use the data the connector returns, and analyze those raw values directly. Don't read rendered charts or graphs from screenshots (computer-use chart reading is unreliable) \u2014 work from the actual data."
  ]
]);
function getDefaultMcpCustomInstruction(serverName) {
  return DEFAULT_MCP_CONNECTOR_INSTRUCTIONS.get(serverName.trim().toLowerCase()) ?? "";
}
function resolveMcpCustomInstruction(serverName, storedInstruction) {
  if (storedInstruction === void 0) {
    return getDefaultMcpCustomInstruction(serverName);
  }
  return storedInstruction.trim();
}
function formatMcpCustomInstructionToolNote(serverName, instructions) {
  return `Custom instructions for the "${serverName}" connector (always follow them when using this tool):
${instructions.trim()}`;
}
function selectConnectedMcpCustomInstructions(connectedServerNames, instructionsByServer) {
  const entries = [];
  for (const name17 of new Set(connectedServerNames)) {
    const instructions = resolveMcpCustomInstruction(name17, instructionsByServer.get(name17));
    if (instructions.length > 0) {
      entries.push({ name: name17, instructions });
    }
  }
  return entries.sort((a, b2) => a.name.localeCompare(b2.name));
}
function buildMcpCustomInstructionsSystemPromptSection(connectedServerNames, instructionsByServer) {
  const entries = selectConnectedMcpCustomInstructions(connectedServerNames, instructionsByServer);
  if (entries.length === 0) return null;
  return [
    "## Connector custom instructions",
    "Custom instructions are configured for some connected tools (MCP connectors). Always follow the matching instruction whenever you use that connector's tools, even before your first call to it:",
    ...entries.map((entry) => `- ${entry.name}: ${entry.instructions}`)
  ].join("\n");
}

