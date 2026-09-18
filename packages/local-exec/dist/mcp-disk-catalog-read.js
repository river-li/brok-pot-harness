var import_promises41 = require("node:fs/promises");
var import_node_path73 = require("node:path");
async function readMcpDiskCatalogToolNamesForProjectDir(projectDir, serverIdentifier) {
  const sanitized = sanitizeServerName(serverIdentifier);
  const toolsDir = (0, import_node_path73.join)(projectDir, MCP_DISK_CATALOG_MCPS_DIR, sanitized, MCP_DISK_CATALOG_TOOLS_DIR);
  let entries;
  try {
    entries = await (0, import_promises41.readdir)(toolsDir);
  } catch (err) {
    if (err?.code === "ENOENT") {
      return { toolNames: [], toolsDirExists: false };
    }
    throw err;
  }
  const toolNames = await Promise.all(entries.map(async (entryName) => {
    if (!entryName.endsWith(".json")) {
      return void 0;
    }
    try {
      const content = await (0, import_promises41.readFile)((0, import_node_path73.join)(toolsDir, entryName), "utf8");
      return parseMcpToolNameFromDiskDefinitionJson(content);
    } catch {
      return void 0;
    }
  }));
  const unique = /* @__PURE__ */ new Set();
  for (const name17 of toolNames) {
    if (name17) {
      unique.add(name17);
    }
  }
  const sorted = Array.from(unique).sort((a, b2) => a.localeCompare(b2));
  return { toolNames: sorted, toolsDirExists: true };
}
