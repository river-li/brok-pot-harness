init_errors();
var SandInvalidAgentIdError = class extends SandDomainError {
  name = "SandInvalidAgentIdError";
};
function getSandAgentsRootDir(homeDir = (0, import_node_os21.homedir)()) {
  return (0, import_node_path81.join)(getSandRootDir(homeDir), "agents");
}
function assertValidSandAgentId(agentId) {
  if (!isSafeFolderId(agentId) || agentId !== agentId.trim()) {
    throw new SandInvalidAgentIdError(`Invalid Sand agent id: ${agentId}`);
  }
}
function resolveSandAgentDir(agentId, homeDir = (0, import_node_os21.homedir)()) {
  assertValidSandAgentId(agentId);
  const agentsRoot = getSandAgentsRootDir(homeDir);
  const agentDir = (0, import_node_path81.join)(agentsRoot, agentId);
  const rel = (0, import_node_path81.relative)(agentsRoot, agentDir);
  if (rel.length === 0 || rel === ".." || rel.startsWith(`..${import_node_path81.sep}`) || (0, import_node_path81.isAbsolute)(rel) || rel.includes(import_node_path81.sep)) {
    throw new SandInvalidAgentIdError(`Invalid Sand agent id: ${agentId}`);
  }
  return agentDir;
}
