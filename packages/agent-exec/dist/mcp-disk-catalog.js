var MCP_DISK_CATALOG_MCPS_DIR = "mcps";
var MCP_DISK_CATALOG_TOOLS_DIR = "tools";
function parseMcpToolNameFromDiskDefinitionJson(jsonText) {
  try {
    const parsed2 = JSON.parse(jsonText);
    if (typeof parsed2.name === "string" && parsed2.name.length > 0) {
      return parsed2.name;
    }
    if (typeof parsed2.toolName === "string" && parsed2.toolName.length > 0) {
      return parsed2.toolName;
    }
    return void 0;
  } catch (_a19) {
    return void 0;
  }
}
