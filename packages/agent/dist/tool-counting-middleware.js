var ToolCountingStateTracker = class {
  constructor() {
    this.toolCallCount = 0;
    this.resultClassificationCounts = /* @__PURE__ */ new Map();
  }
  /**
   * Returns the total number of failed tool calls (any non-success classification).
   */
  getFailedToolCallCount() {
    return Array.from(this.resultClassificationCounts.values()).reduce((sum, count) => sum + count, 0);
  }
  /**
   * Returns the number of unexpected tool call errors.
   * These are system errors, not model mistakes.
   */
  getUnexpectedToolCallErrorCount() {
    return (this.resultClassificationCounts.get(ToolErrorClassification.TIMEOUT) ?? 0) + (this.resultClassificationCounts.get(ToolErrorClassification.PROVIDER_ERROR) ?? 0) + (this.resultClassificationCounts.get(ToolErrorClassification.BAD_USER_DEVICE_STATE) ?? 0) + (this.resultClassificationCounts.get(ToolErrorClassification.OTHER_ERROR) ?? 0);
  }
  /**
   * Returns "true" or "false" string for whether any tool calls failed.
   */
  hasFailedToolCalls() {
    return this.getFailedToolCallCount() > 0 ? "true" : "false";
  }
  /**
   * Returns "true" or "false" string for whether any unexpected tool call errors occurred.
   */
  hasUnexpectedToolCallErrors() {
    return this.getUnexpectedToolCallErrorCount() > 0 ? "true" : "false";
  }
};
function createToolCountingMiddleware(state) {
  return (executor) => ({
    appendMessages(messages2) {
      executor.appendMessages(messages2);
      return this;
    },
    getState() {
      return executor.getState();
    },
    getMessages() {
      return executor.getMessages();
    },
    clearMessages() {
      executor.clearMessages();
    },
    executeToolStream(ctx, convState, interactionHandler, tools, extraT, recordToolCallResult, descriptionProps, firstToolCallHook) {
      return executor.executeToolStream(ctx, convState, interactionHandler, tools, extraT, async (ctx2, result, loggedToolName, errorClassification) => {
        await recordToolCallResult(ctx2, result, loggedToolName, errorClassification);
        state.toolCallCount++;
        if (errorClassification !== void 0) {
          const currentCount = state.resultClassificationCounts.get(errorClassification) ?? 0;
          state.resultClassificationCounts.set(errorClassification, currentCount + 1);
        }
      }, descriptionProps, firstToolCallHook);
    },
    executeModelStreamOnly(ctx, convState, interactionHandler, tools, descriptionProps, firstToolCallHook) {
      return executor.executeModelStreamOnly(ctx, convState, interactionHandler, tools, descriptionProps, firstToolCallHook);
    },
    stream(ctx, invocationId, tools, options2) {
      return executor.stream(ctx, invocationId, tools, options2);
    }
  });
}
