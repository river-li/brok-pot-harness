init_record_screen_exec_pb();
var recordScreenHooksConfig = {
  toolName: HooksToolName.RecordScreen,
  getToolCallId: getToolCallIdFromArgs,
  createToolInput: (args) => ({
    mode: args.mode,
    save_as_filename: args.saveAsFilename
  }),
  // No applyUpdatedInput - RecordScreen doesn't support input modification
  createRejectedResult: (_args, reason) => new RecordScreenResult({
    result: {
      case: "failure",
      value: new RecordScreenFailure({
        error: reason
      })
    }
  }),
  // RecordScreen considers non-failure results as success
  isSuccess: (result) => result.result.case !== "failure",
  getErrorMessage: (result) => {
    if (result.result.case === "failure") {
      return result.result.value.error || "RecordScreen failed";
    }
    return "Unknown error";
  },
  createSuccessOutput: (_args, result) => ({
    result_type: result.result.case
  })
};
