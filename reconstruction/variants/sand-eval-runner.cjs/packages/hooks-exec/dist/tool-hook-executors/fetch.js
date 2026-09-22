/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-exec/dist/tool-hook-executors/fetch.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var fetchHooksConfig = {
  toolName: HooksToolName.Fetch,
  getToolCallId: getToolCallIdFromArgs,
  createToolInput: (args) => ({
    url: args.url
  }),
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.url === "string") {
      args.url = updatedInput.url;
    }
  },
  createRejectedResult: (args, reason) => new FetchResult({
    result: {
      case: "error",
      value: new FetchError({
        url: args.url,
        error: reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    if (result.result.case === "error") {
      return result.result.value.error || "Fetch error";
    }
    return "Unknown error";
  },
  createSuccessOutput: (args, result) => {
    if (result.result.case === "success") {
      return {
        url: args.url,
        status_code: result.result.value.statusCode,
        content_length: result.result.value.content.length
      };
    }
    return { url: args.url, success: true };
  }
};

