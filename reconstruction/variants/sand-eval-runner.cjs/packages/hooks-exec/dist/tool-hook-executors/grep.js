/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-exec/dist/tool-hook-executors/grep.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var grepHooksConfig = {
  toolName: HooksToolName.Grep,
  getToolCallId: getToolCallIdFromArgs,
  createToolInput: (args) => ({
    pattern: args.pattern,
    file_path: args.path,
    glob: args.glob,
    output_mode: args.outputMode
  }),
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.pattern === "string") {
      args.pattern = updatedInput.pattern;
    }
    if (typeof updatedInput.file_path === "string") {
      args.path = updatedInput.file_path;
    }
  },
  createRejectedResult: (_args, reason) => new GrepResult({
    result: {
      case: "error",
      value: new GrepError({
        error: reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    if (result.result.case === "error") {
      return result.result.value.error || "Grep error";
    }
    return "Unknown error";
  },
  createSuccessOutput: (args) => ({
    pattern: args.pattern,
    success: true
  })
};

