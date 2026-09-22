/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/shell-hook-approval.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

