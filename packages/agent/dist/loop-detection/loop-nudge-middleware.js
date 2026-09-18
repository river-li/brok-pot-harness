function createLoopNudgeMiddleware(minRepetitionsOrOptions, minMessageLengthArg = 0, shouldInjectReminderArg = false) {
  const config2 = typeof minRepetitionsOrOptions === "number" ? {
    minRepetitions: minRepetitionsOrOptions,
    minMessageLength: minMessageLengthArg,
    injectReminder: shouldInjectReminderArg
  } : minRepetitionsOrOptions;
  return (executor) => {
    let lastCtx;
    const appliedNudgeFingerprints = /* @__PURE__ */ new Set();
    const checkForLoop = (ctx) => {
      try {
        checkAndHandleLoopOnToolResultAppend({
          ctx,
          currentMessages: executor.getMessages(),
          shouldInjectReminder: config2.injectReminder,
          appendMessage: (msg) => executor.appendMessages(msg),
          minRepetitions: config2.minRepetitions,
          minMessageLength: config2.minMessageLength,
          reporting: config2.reporting,
          appliedNudgeFingerprints,
          isExemptToolResult: config2.isExemptToolResult,
          changedResultsMinRepetitions: config2.changedResultsMinRepetitions,
          progressMinRepetitions: config2.progressMinRepetitions,
          normalizeToolResultForComparison: config2.normalizeToolResultForComparison,
          normalizeMessageTextForComparison: config2.normalizeMessageTextForComparison,
          outboundMessageFlood: config2.outboundMessageFlood,
          repetitionTolerantTools: config2.repetitionTolerantTools
        });
      } catch (_e2) {
      }
    };
    const wrappedExecutor = {
      // Wrap appendMessages to check for loops when tool messages are appended
      appendMessages(messages2) {
        const messagesToAppend = Array.isArray(messages2) ? messages2 : [messages2];
        const hasToolMessages = messagesToAppend.some((msg) => msg.role === "tool");
        executor.appendMessages(messages2);
        if (hasToolMessages && lastCtx) {
          checkForLoop(lastCtx);
        }
        return wrappedExecutor;
      },
      // Wrap stream to capture the context for loop detection
      stream(ctx, invocationId, tools, options2) {
        if (lastCtx === void 0 && executor.getMessages().at(-1)?.role === "tool") {
          checkForLoop(ctx);
        }
        lastCtx = ctx;
        return executor.stream(ctx, invocationId, tools, options2);
      },
      // Pass through other PromptExecutor methods unchanged
      getMessages() {
        return executor.getMessages();
      },
      getState() {
        return executor.getState();
      },
      clearMessages() {
        executor.clearMessages();
      }
    };
    return wrappedExecutor;
  };
}
