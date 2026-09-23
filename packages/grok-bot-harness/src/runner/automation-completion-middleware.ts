init_dist4();
init_errors();
var logger103 = createLogger("sand:automation-completion-middleware");
var SAND_AUTOMATION_COMPLETION_PROMPT_TAG = "sandAutomationCompletionId";
function completionIdOf(message) {
  const value = message.providerOptions?.cursor?.[SAND_AUTOMATION_COMPLETION_PROMPT_TAG];
  return typeof value === "string" ? value : void 0;
}
function createAutomationCompletionPromptMessage(completion) {
  return {
    role: "user",
    content: `${SAND_HIDDEN_PROMPT_MARKER}${completion.text}`,
    providerOptions: {
      cursor: {
        [SAND_AUTOMATION_COMPLETION_PROMPT_TAG]: completion.id
      }
    }
  };
}
function isAutomationCompletionPromptMessage(message) {
  return completionIdOf(message) !== void 0;
}
var AutomationCompletionMiddleware = class extends BaseMiddleware {
  constructor(innerExecutor, source) {
    super(innerExecutor);
    this.source = source;
  }
  source;
  injectedIds = /* @__PURE__ */ new Set();
  restoredInjectedIds = false;
  injectPending(ctx) {
    let completions;
    try {
      completions = this.source.drain();
    } catch (error42) {
      logger103.warn(ctx, "Failed to drain automation completion inbox", {
        error: errorLogTag(error42)
      });
      return;
    }
    const existingMessages = completions.length > 0 ? this.innerExecutor.getMessages() : [];
    if (completions.length > 0 && !this.restoredInjectedIds) {
      this.restoredInjectedIds = true;
      for (const message of existingMessages) {
        const completionId = completionIdOf(message);
        if (completionId !== void 0) this.injectedIds.add(completionId);
      }
    }
    const completionMessages2 = [];
    for (const completion of completions) {
      if (this.injectedIds.has(completion.id)) continue;
      this.injectedIds.add(completion.id);
      completionMessages2.push(createAutomationCompletionPromptMessage(completion));
    }
    if (completionMessages2.length > 0) {
      let trailingUserStart = existingMessages.length;
      while (trailingUserStart > 0) {
        const message = existingMessages[trailingUserStart - 1];
        if (message?.role !== "user" || isAutomationCompletionPromptMessage(message)) {
          break;
        }
        trailingUserStart--;
      }
      if (trailingUserStart === existingMessages.length) {
        this.innerExecutor.appendMessages(completionMessages2);
      } else {
        this.innerExecutor.clearMessages();
        this.innerExecutor.appendMessages([
          ...existingMessages.slice(0, trailingUserStart),
          ...completionMessages2,
          ...existingMessages.slice(trailingUserStart)
        ]);
      }
    }
    this.source.stageForCheckpoint(completions);
  }
  stream(ctx, invocationId, tools, options2) {
    this.injectPending(ctx);
    return this.innerExecutor.stream(ctx, invocationId, tools, options2);
  }
};
function createAutomationCompletionMiddleware(source) {
  return (executor) => new AutomationCompletionMiddleware(executor, source);
}
