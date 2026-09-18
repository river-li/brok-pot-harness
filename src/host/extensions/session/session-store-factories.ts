function createUnavailableMemoryStore() {
  return {
    recall: () => ({ profile: [], recent: [] }),
    listMemories: () => [],
    addMemory: () => null,
    removeMemoryByContent: () => false,
    getLocation: () => null
  };
}
var NO_SESSION_MEMORY = {
  createAgentStore: () => createUnavailableMemoryStore(),
  agentHasContent: () => false
};
function automationStoreForDbPath(dbPath, resolveUserTimeZone = () => void 0, isFiveMinuteAutomationFloorEnabled = () => false, clock) {
  return new FileAutomationStore(
    getAgentAutomationsDir((0, import_node_path137.dirname)(dbPath)),
    resolveUserTimeZone,
    isFiveMinuteAutomationFloorEnabled,
    clock
  );
}
function skillStoreForDbPath(dbPath, resolveUserTimeZone = () => void 0, isFiveMinuteAutomationFloorEnabled = () => false) {
  const agentDir = (0, import_node_path137.dirname)(dbPath);
  const sandRoot = (0, import_node_path137.dirname)((0, import_node_path137.dirname)(agentDir));
  return new FileSkillStore(
    agentDir,
    getGlobalSkillsDir(sandRoot),
    resolveUserTimeZone,
    isFiveMinuteAutomationFloorEnabled
  );
}
function channelStoreForDbPath(dbPath) {
  return new FileChannelStore(getAgentChannelsDir((0, import_node_path137.dirname)(dbPath)));
}
