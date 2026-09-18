function getTaskToolName(parentModelInfo) {
  const isComposer = parentModelInfo.isComposer1 || parentModelInfo.isComposer15;
  if (isComposer) {
    return "mcp_task";
  }
  if (isCodexPromptVersion(parentModelInfo.promptVersion)) {
    return "Subagent";
  }
  return "Task";
}
