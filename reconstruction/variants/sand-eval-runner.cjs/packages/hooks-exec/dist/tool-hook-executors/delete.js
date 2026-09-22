/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-exec/dist/tool-hook-executors/delete.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var deleteHooksConfig = {
  toolName: HooksToolName.Delete,
  getToolCallId: getToolCallIdFromArgs,
  createToolInput: (args) => ({
    file_path: args.path
  }),
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.file_path === "string") {
      args.path = updatedInput.file_path;
    }
  },
  createRejectedResult: (args, reason) => new DeleteResult({
    result: {
      case: "rejected",
      value: new DeleteRejected({
        path: args.path,
        reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    switch (result.result.case) {
      case "fileNotFound":
        return `File not found: ${result.result.value.path}`;
      case "notFile":
        return `Not a file: ${result.result.value.path}`;
      case "permissionDenied":
        return `Permission denied: ${result.result.value.path}`;
      case "fileBusy":
        return `File busy: ${result.result.value.path}`;
      case "rejected":
        return result.result.value.reason || "Delete rejected";
      case "error":
        return result.result.value.error || "Delete error";
      default:
        return "Unknown error";
    }
  },
  createSuccessOutput: (args) => ({
    file_path: args.path,
    deleted: true
  })
};

