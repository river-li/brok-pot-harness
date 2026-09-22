init_shell_exec_pb();
var __awaiter41 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function getOutputFromResult(result) {
  if (result.result.case === "success") {
    return result.result.value.stdout + result.result.value.stderr;
  } else if (result.result.case === "failure") {
    return result.result.value.stdout + result.result.value.stderr;
  }
  return "";
}
var shellHooksConfig = {
  toolName: HooksToolName.Shell,
  // Shell generates its own UUID - doesn't use toolCallId from args
  createToolInput: (args) => {
    const cwd = args.workingDirectory || "";
    const timeout2 = args.timeout;
    return Object.assign({ command: args.command, cwd }, typeof timeout2 === "number" && timeout2 > 0 && { timeout: timeout2 });
  },
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.command === "string") {
      args.command = updatedInput.command;
    }
    if (typeof updatedInput.cwd === "string") {
      args.workingDirectory = updatedInput.cwd;
    }
    if (typeof updatedInput.timeout === "number" && updatedInput.timeout >= 0) {
      args.timeout = updatedInput.timeout;
    }
  },
  createRejectedResult: (args, reason) => new ShellResult({
    result: {
      case: "rejected",
      value: new ShellRejected({
        command: args.command,
        workingDirectory: args.workingDirectory,
        reason
      })
    }
  }),
  isSuccess: (result) => {
    if (result.result.case === "success") {
      return true;
    }
    if (result.result.case === "failure" && !result.result.value.aborted) {
      return true;
    }
    return false;
  },
  getErrorMessage: (result) => {
    switch (result.result.case) {
      case "timeout":
        return `Command timed out after ${result.result.value.timeoutMs}ms`;
      case "spawnError":
        return result.result.value.error || "Failed to spawn command";
      case "failure":
        if (result.result.value.aborted) {
          return "Command was aborted";
        }
        return "Command failed";
      case "rejected":
        return result.result.value.reason || "Command rejected";
      default:
        return "Unknown error";
    }
  },
  getFailureType: (result) => {
    if (result.result.case === "timeout") {
      return "timeout";
    }
    return "error";
  },
  isInterrupt: (result) => {
    return result.result.case === "failure" && result.result.value.aborted === true;
  },
  createSuccessOutput: (_args, result) => {
    const output = getOutputFromResult(result);
    const exitCode = result.result.case === "success" ? 0 : 1;
    return { output, exitCode };
  },
  getExtraHookFields: (args) => {
    const cwd = args.workingDirectory || "";
    return { cwd };
  },
  /**
   * Run beforeShellExecution hook before execution.
   * Throws HookDeniedError if hook denies execution (generic-hooks handles the rest).
   */
  runPreExecutionHooks: (params) => __awaiter41(void 0, void 0, void 0, function* () {
    const { args, baseHookRequest, hookExecutor } = params;
    const cwd = args.workingDirectory || "";
    setShellHookApprovalRequirement(args, yield runBeforeShellExecutionPermissionHook({
      hookExecutor,
      baseHookRequest,
      command: args.command,
      cwd,
      sandbox: isSandboxed(args.requestedSandboxPolicy)
    }));
    return void 0;
  }),
  /**
   * Run afterShellExecution hook after execution.
   */
  runPostExecutionHooks: (params) => __awaiter41(void 0, void 0, void 0, function* () {
    const { args, result, baseHookRequest, hookExecutor, executionDurationMs } = params;
    const output = getOutputFromResult(result);
    yield hookExecutor.executeHookForStep(HookStep.afterShellExecution, Object.assign(Object.assign({}, baseHookRequest), { command: args.command, output, duration: executionDurationMs, sandbox: isSandboxed(args.requestedSandboxPolicy) }));
    return void 0;
  })
};
