/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-exec/dist/tool-hook-executors/read.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter46 = function(thisArg, _arguments, P2, generator) {
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
var readHooksConfig = {
  toolName: HooksToolName.Read,
  getToolCallId: getToolCallIdFromArgs,
  createToolInput: (args) => ({
    file_path: args.path
  }),
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.file_path === "string") {
      args.path = updatedInput.file_path;
    }
  },
  createRejectedResult: (args, reason) => new ReadResult({
    result: {
      case: "rejected",
      value: new ReadRejected({
        path: args.path,
        reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    switch (result.result.case) {
      case "error":
        return result.result.value.error || "Read error";
      case "rejected":
        return result.result.value.reason || "Read rejected";
      case "fileNotFound":
        return `File not found: ${result.result.value.path}`;
      case "permissionDenied":
        return `Permission denied: ${result.result.value.path}`;
      case "invalidFile":
        return `Invalid file: ${result.result.value.path}`;
      default:
        return "Unknown error";
    }
  },
  createSuccessOutput: (args, result) => {
    if (result.result.case === "success") {
      const content = result.result.value.output.case === "content" ? result.result.value.output.value : "";
      return { file_path: args.path, content_length: content.length };
    }
    return { file_path: args.path, success: true };
  },
  /**
   * Run beforeReadFile hook after successful read operations.
   * This allows hooks to inspect the file content and potentially block the read.
   * Throws HookDeniedError if the hook denies the read, or FailClosedError if hook infrastructure fails.
   */
  runPostExecutionHooks: (params) => __awaiter46(void 0, void 0, void 0, function* () {
    const { args, result, baseHookRequest, hookExecutor } = params;
    if (result.result.case !== "success") {
      return void 0;
    }
    const content = result.result.value.output.case === "content" ? result.result.value.output.value : "";
    const beforeReadResponse = yield withFailClosed(() => hookExecutor.executeHookForStep(HookStep.beforeReadFile, Object.assign(Object.assign({}, baseHookRequest), { content, file_path: args.path, attachments: [] })), "File read");
    if ((beforeReadResponse === null || beforeReadResponse === void 0 ? void 0 : beforeReadResponse.permission) === "deny") {
      const reason = createHookDenialMessage("File read", beforeReadResponse.user_message);
      throw new HookDeniedError(reason);
    }
    return void 0;
  })
};

