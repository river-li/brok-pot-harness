/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/mcp-disk-catalog.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MCP_DISK_CATALOG_MCPS_DIR = "mcps";
var MCP_DISK_CATALOG_TOOLS_DIR = "tools";
function parseMcpToolNameFromDiskDefinitionJson(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    if (typeof parsed.name === "string" && parsed.name.length > 0) {
      return parsed.name;
    }
    if (typeof parsed.toolName === "string" && parsed.toolName.length > 0) {
      return parsed.toolName;
    }
    return void 0;
  } catch (_a20) {
    return void 0;
  }
}

