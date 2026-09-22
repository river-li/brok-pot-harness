/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/self-summary/openai-compaction-handler.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
var __addDisposableResource28 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources28 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var logger40 = createLogger("@anysphere/agent");
var compactionInputTokens2 = createHistogram("openai_compaction.input_token", {
  description: "Input tokens consumed during OpenAI compaction"
});
var compactionOutputTokens2 = createHistogram("openai_compaction.output_token", {
  description: "Output tokens generated during OpenAI compaction"
});
var compactionCacheReadTokens2 = createHistogram("openai_compaction.cache_read_token", {
  description: "Cache read tokens during OpenAI compaction"
});
var compactionCacheWriteTokens2 = createHistogram("openai_compaction.cache_write_token", {
  description: "Cache write tokens during OpenAI compaction"
});
var compactionTimeTakenMs2 = createHistogram("openai_compaction.time_taken_ms", {
  description: "Time taken for OpenAI compaction in milliseconds"
});
var compactionStatus2 = createCounter("openai_compaction.status", {
  description: "Count of OpenAI compaction attempts and their outcomes",
  labelNames: ["outcome", "errorKind"]
});
var OPENAI_COMPACTION_PROMPT = `You are performing a CONTEXT CHECKPOINT COMPACTION. Create a handoff summary for another LLM that will resume the task.

Include:
- Current progress and key decisions made
- Important context, constraints, or user preferences
- What remains to be done (clear next steps)
- Any critical data, examples, or references needed to continue

Be concise, structured, and focused on helping the next LLM seamlessly continue the work.
Do not make any tool calls.`;
var SUMMARY_PREFIX = "Another language model started to solve this problem and produced a summary of its thinking process. The workspace and transcript reflects changes made by the previous model \u2014 use your tools to inspect the current state of files, terminals, and other resources. Build on the work that has already been done and avoid duplicating work. Here is the summary produced by the other language model, use the information in this summary to assist with your own analysis:";
var APPROX_CHARS_PER_TOKEN = 4;
var COMPACT_USER_MESSAGE_MAX_TOKENS = 1e4;
var OpenAICompactionHandler = class {
  constructor(promptSession, stateHandler, interactionListener, tools, extraT, modelId, retryOptions) {
    this.promptSession = promptSession;
    this.stateHandler = stateHandler;
    this.interactionListener = interactionListener;
    this.tools = tools;
    this.extraT = extraT;
    this.modelId = modelId;
    this.retryOptions = retryOptions ?? {};
  }
  getModelId() {
    return this.modelId;
  }
  getMetricsModelLabel() {
    return this.modelId;
  }
  // ---------------------------------------------------------------------------
  // Phase 1: Partition messages
  // ---------------------------------------------------------------------------
  partitionMessages(messages, _options) {
    const { systemMessage, userInfoMessage, messagesForSummarization } = prepareMessagesForCompaction(messages);
    const skillBlocks = collectAllSkillBlocks(messagesForSummarization);
    const preservedTailMessages = collectBudgetedUserMessages(messagesForSummarization, COMPACT_USER_MESSAGE_MAX_TOKENS);
    return {
      systemMessage,
      userInfoMessage,
      messagesToSummarize: messagesForSummarization,
      preservedTailMessages,
      skillBlocks
    };
  }
  // ---------------------------------------------------------------------------
  // Phase 2: Generate summary via compaction prompt
  // ---------------------------------------------------------------------------
  async generateSummary(ctx, partitioned, _options) {
    if (!partitioned.systemMessage) {
      throw new Error("Expected system message in conversation");
    }
    const privacySource = partitioned.preservedTailMessages.at(-1) ?? partitioned.userInfoMessage ?? partitioned.systemMessage;
    logger40.info(ctx, "[openai-compaction] generating summary via compaction prompt", {
      preservedUserMessageCount: partitioned.preservedTailMessages.length
    });
    const compactInputMessages = [
      partitioned.systemMessage,
      ...partitioned.userInfoMessage ? [partitioned.userInfoMessage] : [],
      ...partitioned.messagesToSummarize,
      {
        _privacyMode: privacySource._privacyMode,
        role: "user",
        content: safeString(OPENAI_COMPACTION_PROMPT),
        providerOptions: SUMMARIZATION_CURSOR_PROVIDER_OPTIONS
      }
    ];
    const unredact = (m2) => fromRedactedCoreMessage(m2, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    const { assistantMessage, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens } = await executeSelfSummaryWithRetry(ctx, this.promptSession, this.stateHandler, this.interactionListener, compactInputMessages.map(unredact), this.tools, this.extraT, {
      // The reducer already preserves the trailing compaction prompt, so this
      // count only needs to cover the fixed leading context: system + userInfo.
      preservedPrefixMessageCount: 1 + (partitioned.userInfoMessage !== void 0 ? 1 : 0),
      ...this.retryOptions
    });
    compactionInputTokens2.histogram(ctx, inputTokens);
    compactionOutputTokens2.histogram(ctx, outputTokens);
    compactionCacheReadTokens2.histogram(ctx, cacheReadTokens);
    compactionCacheWriteTokens2.histogram(ctx, cacheWriteTokens);
    const summaryText = extractTextContent(toRedactedCoreMessage(assistantMessage, this.stateHandler.getPrivacyMode())).unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    return { text: summaryText, inputTokens, outputTokens };
  }
  // ---------------------------------------------------------------------------
  // Phase 3: Build summary message
  // ---------------------------------------------------------------------------
  buildSummaryMessage(rawSummary, partitioned, enrichments) {
    const durableBlocks = renderDurableBlocks("openai-compaction", enrichments);
    const wrappedContent = `${prependDurableBlocks("openai-compaction", durableBlocks)}${appendDurableBlocks("openai-compaction", durableBlocks)}

${SUMMARY_PREFIX}
${rawSummary.text}`;
    const lastUserQuery = partitioned.preservedTailMessages.at(-1);
    const privacySource = lastUserQuery ?? partitioned.userInfoMessage ?? partitioned.systemMessage;
    const summaryPrivacyMode = privacySource._privacyMode ?? this.stateHandler.getPrivacyMode();
    return {
      message: toRedactedCoreMessage({
        role: "user",
        content: wrappedContent,
        providerOptions: { cursor: { isSummary: true } }
      }, summaryPrivacyMode),
      summaryTextLength: wrappedContent.length
    };
  }
  // ---------------------------------------------------------------------------
  // Phase 4: Assemble final messages
  //
  // Follows the Codex mid-turn auto-compaction ordering:
  //   [system] [userInfo?] [recent user messages...] [summary]
  //
  // User messages go BEFORE the summary so the summary (handoff note) is the
  // last thing the model reads, matching the model's training expectation.
  // ---------------------------------------------------------------------------
  assembleFinalMessages(partitioned, summaryMessage) {
    if (!partitioned.systemMessage) {
      throw new Error("Expected system message in conversation");
    }
    return [
      partitioned.systemMessage,
      ...partitioned.userInfoMessage ? [partitioned.userInfoMessage] : [],
      ...partitioned.preservedTailMessages,
      summaryMessage
    ];
  }
  // ---------------------------------------------------------------------------
  // Top-level summarize
  // ---------------------------------------------------------------------------
  async summarize(ctx, messages, options2) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource28(env_1, createSpan(ctx.withName("OpenAICompactionHandler.summarize")), false);
      const innerCtx = spanCtxt.ctx;
      const startTime = performance.now();
      logger40.info(innerCtx, "[openai-compaction] summarize starting", {
        messageCount: messages.length,
        modelId: this.modelId
      });
      try {
        const pipelineResult = await runSummarizationPipeline(this, innerCtx, messages, options2);
        const summaryCodeString = createRedactedString(pipelineResult.rawSummary.text, DataClassification.CODE, "compaction-summary", this.stateHandler.getPrivacyMode());
        logger40.info(innerCtx, "[openai-compaction] summarize completed", {
          summaryTextLength: pipelineResult.rawSummary.text.length,
          fullReplacementMessagesCount: pipelineResult.fullReplacementMessages.length,
          messagesActuallySummarizedCount: pipelineResult.messagesActuallySummarized.length
        });
        compactionStatus2.increment(innerCtx, 1, {
          outcome: "success",
          errorKind: "Ok"
        });
        return {
          ...pipelineResult,
          summary: { summary: summaryCodeString },
          onPersisted: () => {
            this.stateHandler.incrementSelfSummaryCount();
          }
        };
      } catch (error3) {
        const errorKind = getRetryDirective(error3, {
          transientRetryDelayMs: 0
        }).errorType;
        compactionStatus2.increment(innerCtx, 1, {
          outcome: "failed",
          errorKind
        });
        throw error3;
      } finally {
        compactionTimeTakenMs2.histogram(innerCtx, performance.now() - startTime);
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources28(env_1);
    }
  }
};
function getMessageTextLength(message) {
  const content = message.content;
  if (isRedactedString(content)) {
    return content.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED).length;
  }
  if (Array.isArray(content)) {
    return content.reduce((acc, part) => {
      if (part.type === "text") {
        return acc + part.text.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED).length;
      }
      return acc;
    }, 0);
  }
  return 0;
}
function isSummaryMessage(message) {
  return message.providerOptions?.cursor?.isSummary === true;
}
function isNonSummaryUserMessage(message) {
  return message.role === "user" && !isSummaryMessage(message);
}
function extractTextContentForCompaction(message) {
  const content = message.content;
  if (isRedactedString(content)) {
    return content.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  }
  if (Array.isArray(content)) {
    return content.map((part) => part.type === "text" ? part.text.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : "").join("");
  }
  return "";
}
function extractUserQuerySegments(messageText2) {
  const userQueryMatches = messageText2.match(/<user_query>[\s\S]*?<\/user_query>/g);
  if (userQueryMatches === null) {
    return void 0;
  }
  const retained = userQueryMatches.join("\n\n").trim();
  return retained.length > 0 ? retained : void 0;
}
function toCompactionUserMessage(message) {
  const retainedUserQueryText = extractUserQuerySegments(extractTextContentForCompaction(message));
  if (retainedUserQueryText === void 0) {
    return void 0;
  }
  return {
    ...message,
    content: safeString(retainedUserQueryText)
  };
}
function collectBudgetedUserMessages(messages, maxTokens) {
  const userMessages = messages.filter(isNonSummaryUserMessage).map(toCompactionUserMessage).filter((message) => message !== void 0);
  const selected = [];
  let remainingTokens = maxTokens;
  for (let i = userMessages.length - 1; i >= 0 && remainingTokens > 0; i--) {
    const msg = userMessages[i];
    const approxTokens = Math.ceil(getMessageTextLength(msg) / APPROX_CHARS_PER_TOKEN);
    if (approxTokens <= remainingTokens) {
      selected.push(msg);
      remainingTokens -= approxTokens;
    } else {
      break;
    }
  }
  selected.reverse();
  return selected;
}

