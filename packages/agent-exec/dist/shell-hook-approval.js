init_shell_exec_pb();
function setShellHookApprovalRequirement(args, requirement) {
  if (requirement === void 0) {
    args.hookApprovalRequirement = void 0;
    return;
  }
  args.hookApprovalRequirement = new ShellHookApprovalRequirement(requirement);
}
function getShellHookApprovalRequirement(args) {
  return args.hookApprovalRequirement;
}
function createForcePromptHookApprovalRequirement(reason) {
  return new ShellHookApprovalRequirement({
    kind: ShellHookApprovalRequirement_Kind.FORCE_PROMPT,
    reason
  });
}
