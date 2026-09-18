init_agent_pb();
init_subagents_pb();
var FSD_SUBAGENT_TYPE = "fsd";
var FSD_SUBAGENT_DESCRIPTION = "Use for Full Self Driving PR triage and merge-readiness work. When launching this subagent, set the Task description to a short PR summary. Pass only the FSD trigger description for this turn in the Task prompt (for example `check_suite (completed) with conclusion failure` or `pull_request (synchronize)`); the server rebuilds the full turn prompt with triage context and mode instructions. Do not pass the full turn prompt. This subagent is single-shot and does not support `resume`; start a fresh subagent for each FSD turn.";
function createFsdSubagentSystemPrompt(internalProps, toolSetHandle, context2) {
  return context2.baseSystemPromptGenerator({
    ...internalProps,
    isCloudMetaAgentParent: false,
    mode: AgentMode.AGENT,
    subagentType: void 0
  }, toolSetHandle);
}
function createFsdSubagentConfig() {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({ name: FSD_SUBAGENT_TYPE })
      }
    }),
    description: FSD_SUBAGENT_DESCRIPTION,
    preserveTaskTool: true,
    permissionMode: CustomSubagentPermissionMode.AGENT_ONLY,
    subagentSource: "builtin",
    inheritParentModel: true,
    systemPromptOverride: createFsdSubagentSystemPrompt
  };
}
