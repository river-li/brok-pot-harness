var HOOK_STEPS_SUPPORTING_ADDITIONAL_CONTEXT = /* @__PURE__ */ new Set([
  HookStep.sessionStart,
  HookStep.beforeSubmitPrompt,
  HookStep.preToolUse,
  HookStep.postToolUse,
  HookStep.postToolUseFailure
]);
var HookResponseValidatorMap = {
  [HookStep.beforeShellExecution]: validateBeforeCommandExecutionHookResponse,
  [HookStep.beforeMCPExecution]: validateBeforeCommandExecutionHookResponse,
  [HookStep.afterShellExecution]: validateAfterShellExecutionResponse,
  [HookStep.afterMCPExecution]: validateAfterMCPExecutionResponse,
  [HookStep.beforeReadFile]: validateBeforeReadFileResponse,
  [HookStep.afterFileEdit]: validateAfterEditFileResponse,
  [HookStep.beforeTabFileRead]: validateBeforeTabFileReadResponse,
  [HookStep.afterTabFileEdit]: validateAfterTabFileEditResponse,
  [HookStep.beforeSubmitPrompt]: validateBeforePromptSubmitResponse,
  [HookStep.stop]: validateStopResponse,
  [HookStep.afterAgentResponse]: validateAfterAgentResponseResponse,
  [HookStep.afterAgentThought]: validateAfterAgentThoughtResponse,
  [HookStep.sessionStart]: validateSessionStartResponse,
  [HookStep.sessionEnd]: validateSessionEndResponse,
  [HookStep.preCompact]: validatePreCompactResponse,
  [HookStep.subagentStart]: validateSubagentStartResponse,
  [HookStep.subagentStop]: validateSubagentStopResponse,
  [HookStep.preToolUse]: validatePreToolUseResponse,
  [HookStep.postToolUse]: validatePostToolUseResponse,
  [HookStep.postToolUseFailure]: validatePostToolUseFailureResponse,
  [HookStep.workspaceOpen]: validateWorkspaceOpenResponse
};
var PERMISSION_HOOK_STEPS = [
  HookStep.beforeShellExecution,
  HookStep.beforeMCPExecution,
  HookStep.beforeReadFile,
  HookStep.beforeTabFileRead,
  HookStep.subagentStart,
  HookStep.preToolUse
];
var WORKSPACE_LIFECYCLE_STEPS = [HookStep.workspaceOpen];
