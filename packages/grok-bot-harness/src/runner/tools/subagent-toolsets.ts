function recallMemoryTools(host) {
  if (host.memoryStore == null) return [];
  return [
    createRecallMemoryTool({
      memoryStore: () => host.memoryStore,
      userMemory: () => host.userMemory
    })
  ];
}
function sortMemoriesSubagentTools(host) {
  const tools = recallMemoryTools(host);
  if (host.agentState != null) {
    tools.push(
      createSandStateTool({
        state: host.agentState,
        conversationMemory: host.memoryStore?.memoryScopes,
        canCreateAutomation: () => false,
        fiveMinuteAutomationFloorEnabled: host.gates.fiveMinuteAutomationFloor,
        teamBot: () => host.teamBot?.() !== void 0
      })
    );
  }
  const onProposal = host.sortMemoriesProposal;
  if (host.memoryStore?.memoryScopes?.privateMain === true && onProposal !== void 0) {
    tools.push(
      createSortMemoriesTool({
        memoryScopes: () => host.memoryStore?.memoryScopes,
        onSendMessage: () => void 0,
        isAwaitingUserSelection: () => false,
        onProposal
      })
    );
  }
  return tools;
}
function carryOverSubagentTools(host) {
  const tools = recallMemoryTools(host);
  if (host.carryOver !== void 0) tools.push(createCarryOverTool(host.carryOver));
  return tools;
}
function skillsSubagentTools(host) {
  const tools = recallMemoryTools(host);
  if (host.skills !== void 0) tools.push(createSkillsTool(host.skills));
  return tools;
}
function sharePassSubagentTools(host) {
  if (!host.isSubagentRunner) return void 0;
  if (isSortMemoriesSubagentType(host.subagentType)) return sortMemoriesSubagentTools(host);
  if (isCarryOverSubagentType(host.subagentType)) return carryOverSubagentTools(host);
  if (isSkillsSubagentType(host.subagentType)) return skillsSubagentTools(host);
  return void 0;
}
