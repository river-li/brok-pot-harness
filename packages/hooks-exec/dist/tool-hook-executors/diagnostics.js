init_diagnostics_exec_pb();
var diagnosticsHooksConfig = {
  toolName: HooksToolName.ReadLints,
  getToolCallId: getToolCallIdFromArgs,
  createToolInput: (args) => ({
    file_path: args.path
  }),
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.file_path === "string") {
      args.path = updatedInput.file_path;
    }
  },
  createRejectedResult: (args, reason) => new DiagnosticsResult({
    result: {
      case: "rejected",
      value: new DiagnosticsRejected({
        path: args.path,
        reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    switch (result.result.case) {
      case "error":
        return result.result.value.error || "Diagnostics error";
      case "rejected":
        return result.result.value.reason || "Diagnostics rejected";
      case "fileNotFound":
        return `File not found: ${result.result.value.path}`;
      case "permissionDenied":
        return `Permission denied: ${result.result.value.path}`;
      default:
        return "Unknown error";
    }
  },
  createSuccessOutput: (args, result) => {
    if (result.result.case === "success") {
      return {
        file_path: args.path,
        diagnostics_count: result.result.value.totalDiagnostics
      };
    }
    return { file_path: args.path, success: true };
  }
};
