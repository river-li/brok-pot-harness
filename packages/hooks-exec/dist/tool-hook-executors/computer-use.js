/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-exec/dist/tool-hook-executors/computer-use.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_computer_use_tool_pb();
var computerUseHooksConfig = {
  toolName: HooksToolName.ComputerUse,
  getToolCallId: getToolCallIdFromArgs,
  createToolInput: (args) => ({
    actions_count: args.actions.length
  }),
  // No applyUpdatedInput - ComputerUse doesn't support input modification
  createRejectedResult: (_args, reason) => new ComputerUseResult({
    result: {
      case: "error",
      value: new ComputerUseError({
        error: reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    if (result.result.case === "error") {
      return result.result.value.error || "ComputerUse error";
    }
    return "Unknown error";
  },
  createSuccessOutput: (_args, result) => {
    if (result.result.case === "success") {
      return {
        action_count: result.result.value.actionCount,
        duration_ms: result.result.value.durationMs
      };
    }
    return { success: true };
  }
};

