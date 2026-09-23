function subagentHandlesUntrustedContent(subagentType) {
  return isComputerUseSubagentType(subagentType) || isBrowserUseSubagentType(subagentType) || isBrowserUseJevSubagentType(subagentType);
}
function subagentInheritsBotSecrets(subagentType) {
  return !subagentHandlesUntrustedContent(subagentType);
}
