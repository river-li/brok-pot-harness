/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/storage/agent-paths.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_os6 = require("node:os");
var import_node_path29 = require("node:path");

// @recovered-fragment 2/2
init_errors();
var SandInvalidAgentIdError = class extends SandDomainError {
  name = "SandInvalidAgentIdError";
};
function getSandAgentsRootDir(homeDir = (0, import_node_os6.homedir)()) {
  return (0, import_node_path29.join)(getSandRootDir(homeDir), "agents");
}
function assertValidSandAgentId(agentId) {
  if (!isSafeFolderId(agentId) || agentId !== agentId.trim()) {
    throw new SandInvalidAgentIdError(`Invalid Sand agent id: ${agentId}`);
  }
}
function resolveSandAgentDir(agentId, homeDir = (0, import_node_os6.homedir)()) {
  assertValidSandAgentId(agentId);
  const agentsRoot = getSandAgentsRootDir(homeDir);
  const agentDir = (0, import_node_path29.join)(agentsRoot, agentId);
  const rel = (0, import_node_path29.relative)(agentsRoot, agentDir);
  if (rel.length === 0 || rel === ".." || rel.startsWith(`..${import_node_path29.sep}`) || (0, import_node_path29.isAbsolute)(rel) || rel.includes(import_node_path29.sep)) {
    throw new SandInvalidAgentIdError(`Invalid Sand agent id: ${agentId}`);
  }
  return agentDir;
}

