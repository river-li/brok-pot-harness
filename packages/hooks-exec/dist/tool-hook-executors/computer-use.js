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
