function subagentHandlesUntrustedContent(subagentType) {
  return isComputerUseSubagentType(subagentType) || isBrowserUseSubagentType(subagentType);
}
function subagentInheritsBotSecrets(subagentType) {
  return !subagentHandlesUntrustedContent(subagentType);
}
