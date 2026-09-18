function filterByAgentEnvironment(items, agentType) {
  if (agentType === void 0 || agentType === AgentType.BUGBOT) {
    return items;
  }
  const envMap = {
    [AgentType.BACKGROUND]: "cloud",
    [AgentType.BUGBOT]: "local",
    [AgentType.IDE]: "local",
    [AgentType.CLI]: "local"
  };
  return filterByEnvironment(items, envMap[agentType]);
}
