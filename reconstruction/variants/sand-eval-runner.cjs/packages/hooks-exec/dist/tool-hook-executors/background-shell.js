/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-exec/dist/tool-hook-executors/background-shell.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_background_shell_exec_pb();
init_shell_exec_pb();

// @recovered-fragment 2/2
var __awaiter45 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
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
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var backgroundShellHooksConfig = {
  toolName: HooksToolName.Shell,
  getToolCallId: getToolCallIdFromArgs,
  createToolInput: (args) => {
    const cwd = args.workingDirectory || "";
    return {
      command: args.command,
      cwd
    };
  },
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.command === "string") {
      args.command = updatedInput.command;
    }
    if (typeof updatedInput.cwd === "string") {
      args.workingDirectory = updatedInput.cwd;
    }
  },
  createRejectedResult: (args, reason) => new BackgroundShellSpawnResult({
    result: {
      case: "rejected",
      value: new ShellRejected({
        command: args.command,
        workingDirectory: args.workingDirectory,
        reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    switch (result.result.case) {
      case "error":
        return result.result.value.error || "BackgroundShell error";
      case "rejected":
        return result.result.value.reason || "BackgroundShell rejected";
      case "permissionDenied":
        return "Permission denied";
      case "sandboxUnsupported":
        return `Sandbox policy unsupported on this host: ${result.result.value.reason}`;
      default:
        return "Unknown error";
    }
  },
  createSuccessOutput: (_args, result) => {
    if (result.result.case === "success") {
      return {
        shell_id: result.result.value.shellId,
        pid: result.result.value.pid
      };
    }
    return { success: true };
  },
  getExtraHookFields: (args) => {
    const cwd = args.workingDirectory || "";
    return { cwd };
  },
  /**
   * Run beforeShellExecution hook before execution.
   * Sandbox is derived from args.sandboxPolicy (same logic as Shell/ShellStream).
   * Throws HookDeniedError if hook denies execution (generic-hooks handles the rest).
   */
  runPreExecutionHooks: (params) => __awaiter45(void 0, void 0, void 0, function* () {
    const { args, baseHookRequest, hookExecutor } = params;
    const cwd = args.workingDirectory || "";
    const sandbox = isSandboxed(args.sandboxPolicy);
    setShellHookApprovalRequirement(args, yield runBeforeShellExecutionPermissionHook({
      hookExecutor,
      baseHookRequest,
      command: args.command,
      cwd,
      sandbox
    }));
    return void 0;
  })
};
var writeShellStdinHooksConfig = {
  toolName: HooksToolName.WriteShellStdin,
  // No getToolCallId - WriteShellStdinArgs doesn't have toolCallId
  createToolInput: (args) => ({
    shell_id: args.shellId,
    chars_length: args.chars.length
  }),
  // No applyUpdatedInput - WriteShellStdin doesn't support input modification
  createRejectedResult: (_args, reason) => new WriteShellStdinResult({
    result: {
      case: "error",
      value: new WriteShellStdinError({
        error: reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    if (result.result.case === "error") {
      return result.result.value.error || "WriteShellStdin error";
    }
    return "Unknown error";
  },
  createSuccessOutput: (args) => ({
    shell_id: args.shellId,
    success: true
  })
};

