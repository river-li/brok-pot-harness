var import_promises58 = require("node:fs/promises");
var import_node_path114 = require("node:path");
init_system_errno();
init_mcp_diagnostics();
var LEGACY_MCP_AUTH_FILENAME = "mcp-auth.json";
async function cleanupLegacyMcpAuthCredentials(rootDir) {
  let entries;
  try {
    entries = await (0, import_promises58.readdir)(rootDir);
  } catch (error41) {
    if (findSystemErrno(error41) === "ENOENT") {
      return { outcome: "not_found", removedCount: 0 };
    }
    return { outcome: "error", removedCount: 0 };
  }
  const legacyFiles = entries.filter(isLegacyMcpAuthFile);
  if (legacyFiles.length === 0) {
    return { outcome: "not_found", removedCount: 0 };
  }
  let removedCount = 0;
  let sawError = false;
  for (const name17 of legacyFiles) {
    try {
      await (0, import_promises58.rm)((0, import_node_path114.join)(rootDir, name17), { force: true });
      removedCount += 1;
    } catch (error41) {
      reportMcpHostEdgeFailure("auth-cleanup-remove", error41);
      sawError = true;
    }
  }
  return { outcome: sawError ? "error" : "deleted", removedCount };
}
function isLegacyMcpAuthFile(name17) {
  return name17 === LEGACY_MCP_AUTH_FILENAME || name17.startsWith(`${LEGACY_MCP_AUTH_FILENAME}.`);
}
