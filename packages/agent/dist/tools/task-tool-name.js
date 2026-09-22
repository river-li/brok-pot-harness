/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/task-tool-name.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

