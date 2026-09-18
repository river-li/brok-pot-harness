var SAND_SUBAGENT_CLASSIFIER_TARGET_ACTION = "sand_subagent";
var SAND_SUBAGENT_CLASSIFIER_ERROR_REASON = "An error occurred while reviewing this task. Please review manually.";
function buildSandSubagentLaunchReviewTarget(args) {
  const prompt = args.prompt.trim();
  if (prompt.length === 0) return void 0;
  return {
    action: "launch",
    prompt,
    ...args.subagentType !== void 0 && args.subagentType.length > 0 ? { subagentType: args.subagentType } : {},
    ...args.readonly !== void 0 ? { readonly: args.readonly } : {},
    ...args.resume !== void 0 ? { resume: args.resume } : {}
  };
}
function buildSandSubagentSteerReviewTarget(args) {
  const prompt = args.message.trim();
  if (prompt.length === 0) return void 0;
  return {
    action: "steer",
    prompt,
    subagentAgentId: args.subagentAgentId,
    ...args.subagentType !== void 0 && args.subagentType.length > 0 ? { subagentType: args.subagentType } : {}
  };
}
function buildSandSubagentRiskTarget(args) {
  const { target } = args;
  return new SmartModeRiskTarget({
    action: SAND_SUBAGENT_CLASSIFIER_TARGET_ACTION,
    arguments: structFromRecord({
      surface: "subagent",
      action: target.action,
      prompt: target.prompt,
      subagent_type: target.subagentType,
      subagent_agent_id: target.subagentAgentId,
      readonly: target.readonly,
      resume: target.resume,
      project_permissions: buildProjectPermissionsContext({
        personalInstructions: args.personalInstructions,
        userAutoRunInstructions: args.userAutoRunInstructions,
        projectAutoRunInstructions: args.projectAutoRunInstructions
      })
    })
  });
}
var SAND_SUBAGENT_REVIEW_SPEC = {
  surface: "subagent",
  classifierErrorReason: SAND_SUBAGENT_CLASSIFIER_ERROR_REASON,
  buildRiskTarget: buildSandSubagentRiskTarget,
  fingerprintPayload: (target) => ({
    action: target.action,
    prompt: target.prompt,
    subagentType: target.subagentType,
    subagentAgentId: target.subagentAgentId,
    readonly: target.readonly,
    resume: target.resume
  }),
  summarize: (target) => summarizeSandSubagentAction({ action: target.action, prompt: target.prompt }),
  abortPolicy: { kind: "deny", reason: "The task was cancelled." }
};
async function reviewSandSubagentAction(args) {
  const decision = await runSandAutoReviewFlow({ ...args, spec: SAND_SUBAGENT_REVIEW_SPEC });
  return decision.allowed === false ? decision : { allowed: true };
}
