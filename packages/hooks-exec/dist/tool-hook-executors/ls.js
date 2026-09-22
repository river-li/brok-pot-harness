/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-exec/dist/tool-hook-executors/ls.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_ls_exec_pb();
var lsHooksConfig = {
  toolName: HooksToolName.LS,
  getToolCallId: getToolCallIdFromArgs,
  createToolInput: (args) => ({
    file_path: args.path,
    ignore: args.ignore
  }),
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.file_path === "string") {
      args.path = updatedInput.file_path;
    }
  },
  createRejectedResult: (args, reason) => new LsResult({
    result: {
      case: "rejected",
      value: new LsRejected({
        path: args.path,
        reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    switch (result.result.case) {
      case "error":
        return result.result.value.error || "Ls error";
      case "rejected":
        return result.result.value.reason || "Ls rejected";
      case "timeout":
        return "Ls operation timed out";
      default:
        return "Unknown error";
    }
  },
  getFailureType: (result) => result.result.case === "timeout" ? "timeout" : "error",
  createSuccessOutput: (args) => ({
    file_path: args.path,
    success: true
  })
};

