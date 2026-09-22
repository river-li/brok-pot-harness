var __addDisposableResource26 = function(env, value, async) {
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
var __disposeResources26 = /* @__PURE__ */ (function(SuppressedError2) {
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
var logger38 = createLogger("@anysphere/agent");
var TRANSIENT_SELF_SUMMARY_RETRY_DELAY_MS = 2e3;
var TOOL_MESSAGE_DROP_THRESHOLD = 0.25;
var selfSummaryInputTokens = createHistogram("self_summary.input_token", {
  description: "Input tokens consumed during self-summarization",
  labelNames: ["membershiptype"]
});
var selfSummaryOutputTokens = createHistogram("self_summary.output_token", {
  description: "Output tokens generated during self-summarization",
  labelNames: ["membershiptype"]
});
var selfSummaryCacheReadTokens = createHistogram("self_summary.cache_read_token", {
  description: "Cache read tokens during self-summarization",
  labelNames: ["membershiptype"]
});
var selfSummaryCacheWriteTokens = createHistogram("self_summary.cache_write_token", {
  description: "Cache write tokens during self-summarization",
  labelNames: ["membershiptype"]
});
var selfSummaryTimeTakenMs = createHistogram("self_summary.time_taken_ms", {
  description: "Time taken for self-summarization in milliseconds",
  labelNames: ["membershiptype"]
});
var selfSummaryStatus = createCounter("self_summary.status", {
  description: "Count of self-summary attempts and their outcomes",
  labelNames: ["outcome", "errorKind", "membershiptype", "maxmode"]
});
var selfSummaryTryAttempts = createCounter("self_summary.try.attempts", {
  description: "Per-try self-summary attempts within the retry loop",
  labelNames: ["membershiptype"]
});
var selfSummaryTrySuccess = createCounter("self_summary.try.success", {
  description: "Per-try successful self-summary attempts",
  labelNames: ["membershiptype"]
});
var selfSummaryTryFailures = createCounter("self_summary.try.failures", {
  description: "Per-try failed self-summary attempts",
  labelNames: ["errorKind", "membershiptype"]
});
var selfSummaryRetries = createCounter("self_summary.retries", {
  description: "Total retries (attempts beyond the first) that actually executed",
  labelNames: ["errorKind", "membershiptype"]
});
var selfSummaryUnexpectedToolCalls = createCounter("self_summary.unexpected_tool_calls", {
  description: "Count of unexpected tool calls detected in self-summary response",
  labelNames: ["membershiptype"]
});
async function executeSelfSummaryStream(parentCtx, executor, stateHandler, interactionListener, tools, extraT, descriptionProps) {
  const env_1 = { stack: [], error: void 0, hasError: false };
  try {
    const spanCtxt = __addDisposableResource26(env_1, createSpan(parentCtx.withName("executeSelfSummaryStream")), false);
    const ctx = spanCtxt.ctx;
    const invocationId = getInvocationId(ctx);
    const noOpToolCallRecorder = {
      recordToolCall: () => {
      }
    };
    const noOpInteractionHandler = new InteractionHandler(toUnredactedInteractionListener(interactionListener, stateHandler.getPrivacyMode()), noOpToolCallRecorder, invocationId);
    const result = executor.executeToolStream(
      ctx,
      stateHandler,
      noOpInteractionHandler,
      tools,
      extraT,
      async () => {
      },
      // Prefer the main loop's description props so the serialized tool
      // definitions are byte-identical to the conversation's regular prompts
      // and the provider prompt cache stays warm.
      descriptionProps ?? buildDescriptionGeneratorProps(tools)
    );
    result.extendedUsage.catch((e) => {
      logger38.error(ctx, "[self-summary] Error getting extended usage", e, {
        summarization: { invocationId }
      });
    });
    result.usage.catch((e) => {
      logger38.error(ctx, "[self-summary] Error getting usage", e, {
        summarization: { invocationId }
      });
    });
    result.providerMetadata.catch((e) => {
      logger38.error(ctx, "[self-summary] Error getting provider metadata", e, {
        summarization: { invocationId }
      });
    });
    result.invocationId.catch((e) => {
      logger38.error(ctx, "[self-summary] Error getting invocation id", e, {
        summarization: { invocationId }
      });
    });
    result.response.catch((e) => {
      logger38.error(ctx, "[self-summary] Error getting response", e, {
        summarization: { invocationId }
      });
    });
    for await (const _chunk of result.fullStream) {
    }
    const response = await result.response;
    const extendedUsage = await result.extendedUsage;
    const membershipTags = getMembershipTypeMetricTagsFromContext(ctx);
    selfSummaryInputTokens.histogram(ctx, extendedUsage.inputTokens, membershipTags);
    selfSummaryOutputTokens.histogram(ctx, extendedUsage.outputTokens, membershipTags);
    selfSummaryCacheReadTokens.histogram(ctx, extendedUsage.cacheReadTokens, membershipTags);
    selfSummaryCacheWriteTokens.histogram(ctx, extendedUsage.cacheWriteTokens, membershipTags);
    if (response.error) {
      throw response.error;
    }
    stateHandler.addTurnUsage({
      inputTokens: extendedUsage.inputTokens,
      outputTokens: extendedUsage.outputTokens,
      cacheReadTokens: extendedUsage.cacheReadTokens,
      cacheWriteTokens: extendedUsage.cacheWriteTokens,
      reasoningTokens: extendedUsage.reasoningTokens
    });
    let hasAnyToolCalls = false;
    for (const message of response.messages) {
      const hasToolCalls = message.role === "assistant" && Array.isArray(message.content) && message.content.some((part) => part.type === "tool-call");
      if (hasToolCalls) {
        hasAnyToolCalls = true;
        selfSummaryUnexpectedToolCalls.increment(ctx, 1, membershipTags);
      }
    }
    if (hasAnyToolCalls) {
      logger38.error(ctx, "[self-summary] unexpected tool calls detected in summarization response", {
        summarization: { invocationId }
      });
    }
    if (response.messages.length > 1) {
      logger38.info(ctx, "[self-summary] self summary response stream contained more than one message", {
        summarization: {
          messageCount: response.messages.length,
          invocationId
        }
      });
    }
    const assistantMessage = response.messages.at(-1);
    if (assistantMessage?.role !== "assistant") {
      throw new NoSummaryResponseError();
    }
    const textContent2 = extractTextContent(toRedactedCoreMessage(assistantMessage, stateHandler.getPrivacyMode())).unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    return {
      assistantMessage,
      textContent: textContent2,
      inputTokens: extendedUsage.inputTokens,
      outputTokens: extendedUsage.outputTokens,
      cacheReadTokens: extendedUsage.cacheReadTokens,
      cacheWriteTokens: extendedUsage.cacheWriteTokens
    };
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    __disposeResources26(env_1);
  }
}
function appendShorterOutputRetryInstruction(inputMessages) {
  const nextMessages = inputMessages.slice();
  const promptMessage = nextMessages.at(-1);
  if (promptMessage === void 0 || promptMessage.role === "tool" || typeof promptMessage.content !== "string") {
    return inputMessages;
  }
  nextMessages[nextMessages.length - 1] = {
    ...promptMessage,
    content: `${promptMessage.content}${SHORTER_OUTPUT_RETRY_PROMPT}`
  };
  return nextMessages;
}
function reduceSelfSummaryInputMessages(inputMessages, preservedPrefixMessageCount) {
  if (inputMessages.length <= preservedPrefixMessageCount + 1) {
    return inputMessages;
  }
  const prefixMessages = inputMessages.slice(0, preservedPrefixMessageCount);
  const promptMessage = inputMessages.at(-1);
  const middleMessages = inputMessages.slice(preservedPrefixMessageCount, -1);
  const isAssistantToolCallMessage = (message) => message.role === "assistant" && Array.isArray(message.content) && message.content.some((part) => part.type === "tool-call");
  if (promptMessage === void 0 || middleMessages.length === 0) {
    return inputMessages;
  }
  const toolMessageCount = middleMessages.filter((message) => message.role === "tool").length;
  if (toolMessageCount > 0 && toolMessageCount / middleMessages.length >= TOOL_MESSAGE_DROP_THRESHOLD) {
    const keptMiddleMessages2 = middleMessages.filter((message) => message.role !== "tool" && !isAssistantToolCallMessage(message));
    return [...prefixMessages, ...keptMiddleMessages2, promptMessage];
  }
  if (middleMessages.length === 1) {
    const onlyMessage = middleMessages[0];
    if (onlyMessage.role === "tool" || typeof onlyMessage.content !== "string" || onlyMessage.content.length < 2) {
      return inputMessages;
    }
    const nextContent = onlyMessage.content.slice(Math.floor(onlyMessage.content.length / 2));
    return [...prefixMessages, { ...onlyMessage, content: nextContent }, promptMessage];
  }
  let keptMiddleMessageStartIndex = Math.floor(middleMessages.length / 2);
  while (keptMiddleMessageStartIndex < middleMessages.length && middleMessages[keptMiddleMessageStartIndex]?.role === "tool") {
    keptMiddleMessageStartIndex++;
  }
  const keptMiddleMessages = middleMessages.slice(keptMiddleMessageStartIndex);
  return [...prefixMessages, ...keptMiddleMessages, promptMessage];
}
async function executeSelfSummaryWithRetry(parentCtx, summarizationPromptSession, stateHandler, interactionListener, summarizationInputMessages, tools, extraT, options2) {
  const env_2 = { stack: [], error: void 0, hasError: false };
  try {
    const spanCtxt = __addDisposableResource26(env_2, createSpan(parentCtx.withName("executeSelfSummaryWithRetry")), false);
    const ctx = spanCtxt.ctx;
    const membershipTags = getMembershipTypeMetricTagsFromContext(ctx);
    const maxmode = getMaxModeFromContext(ctx) ? "true" : "false";
    let currentInputMessages = summarizationInputMessages;
    let requestShorterOutput = false;
    let lastErrorKind;
    for (let attempt = 1; attempt <= MAX_SELF_SUMMARY_RETRIES; attempt++) {
      logger38.info(ctx, "[self-summary] attempt started", {
        summarization: {
          attempt,
          maxRetries: MAX_SELF_SUMMARY_RETRIES,
          inputMessageCount: currentInputMessages.length,
          requestShorterOutput
        }
      });
      selfSummaryTryAttempts.increment(ctx, 1, membershipTags);
      try {
        const executor = summarizationPromptSession.getExecutor();
        executor.appendMessages(currentInputMessages);
        const result = await executeSelfSummaryStream(ctx, executor, stateHandler, interactionListener, tools, extraT, options2.descriptionProps);
        const hasContent = result.textContent.trim().length > 0;
        if (hasContent) {
          logger38.info(ctx, "[self-summary] attempt succeeded", {
            summarization: {
              attempt,
              contentLength: result.textContent.length
            }
          });
          selfSummaryTrySuccess.increment(ctx, 1, membershipTags);
          selfSummaryStatus.increment(ctx, 1, {
            outcome: "success",
            errorKind: "Ok",
            ...membershipTags,
            maxmode
          });
          return result;
        }
        const willRetry = attempt < MAX_SELF_SUMMARY_RETRIES;
        lastErrorKind = "EmptyContent";
        selfSummaryTryFailures.increment(ctx, 1, {
          errorKind: "EmptyContent",
          ...membershipTags
        });
        logger38.warn(ctx, "[self-summary] empty content received", {
          summarization: {
            attempt,
            maxRetries: MAX_SELF_SUMMARY_RETRIES,
            willRetry
          }
        });
        if (!willRetry) {
          break;
        }
        selfSummaryRetries.increment(ctx, 1, {
          errorKind: "EmptyContent",
          ...membershipTags
        });
      } catch (error3) {
        const enableRetryNoSummaryResponse = options2.enableRetryNoSummaryResponse ?? false;
        const enableReduceInputsRetry = options2.enableReduceInputsRetry ?? true;
        const enableRetryUncategorizedErrors = options2.enableRetryUncategorizedErrors ?? true;
        const retryDirective = getRetryDirective(error3, {
          transientRetryDelayMs: TRANSIENT_SELF_SUMMARY_RETRY_DELAY_MS,
          enableRetryNoSummaryResponse,
          enableReduceInputsRetry,
          enableRetryUncategorizedErrors
        });
        const willRetry = retryDirective.shouldRetry && attempt < MAX_SELF_SUMMARY_RETRIES;
        lastErrorKind = retryDirective.errorType;
        selfSummaryTryFailures.increment(ctx, 1, {
          errorKind: retryDirective.errorType,
          ...membershipTags
        });
        logger38.error(ctx, "[self-summary] attempt failed with error", error3, {
          summarization: {
            attempt,
            maxRetries: MAX_SELF_SUMMARY_RETRIES,
            errorType: retryDirective.errorType,
            willRetry,
            retryDelayMs: retryDirective.retryDelayMs,
            requestShorterOutput: retryDirective.requestShorterOutput,
            reduceInputs: retryDirective.reduceInputs,
            options: {
              enableReduceInputsRetry,
              enableRetryNoSummaryResponse,
              enableRetryUncategorizedErrors
            }
          }
        });
        if (!willRetry) {
          selfSummaryStatus.increment(ctx, 1, {
            outcome: "failed",
            errorKind: retryDirective.errorType,
            ...membershipTags,
            maxmode
          });
          throw error3;
        }
        selfSummaryRetries.increment(ctx, 1, {
          errorKind: retryDirective.errorType,
          ...membershipTags
        });
        if (retryDirective.requestShorterOutput && !requestShorterOutput) {
          currentInputMessages = appendShorterOutputRetryInstruction(currentInputMessages);
          requestShorterOutput = true;
          logger38.info(ctx, "[self-summary] retrying with shorter-output instruction", {
            summarization: {
              attempt,
              nextAttempt: attempt + 1
            }
          });
        }
        if (retryDirective.reduceInputs) {
          const nextInputMessages = reduceSelfSummaryInputMessages(currentInputMessages, options2.preservedPrefixMessageCount);
          logger38.info(ctx, "[self-summary] retrying with reduced inputs", {
            summarization: {
              attempt,
              previousInputMessageCount: currentInputMessages.length,
              nextInputMessageCount: nextInputMessages.length
            }
          });
          currentInputMessages = nextInputMessages;
        }
        if (retryDirective.retryDelayMs > 0) {
          logger38.info(ctx, "[self-summary] retrying after delay", {
            summarization: {
              attempt,
              retryDelayMs: retryDirective.retryDelayMs
            }
          });
          await delay(retryDirective.retryDelayMs);
        }
      }
    }
    logger38.error(ctx, "[self-summary] all retries exhausted", {
      summarization: {
        maxRetries: MAX_SELF_SUMMARY_RETRIES
      }
    });
    selfSummaryStatus.increment(ctx, 1, {
      outcome: "failed",
      errorKind: lastErrorKind ?? "EmptyContent",
      ...membershipTags,
      maxmode
    });
    throw new Error("[self-summary] all retries exhausted without valid content");
  } catch (e_2) {
    env_2.error = e_2;
    env_2.hasError = true;
  } finally {
    __disposeResources26(env_2);
  }
}
var SelfSummarizer = class {
  constructor(promptSession, stateHandler, interactionListener, tools, extraT, modelId, retryOptions, enableTranscriptEnrichment, promptVariant, deliveryTail) {
    this.promptSession = promptSession;
    this.stateHandler = stateHandler;
    this.interactionListener = interactionListener;
    this.tools = tools;
    this.extraT = extraT;
    this.modelId = modelId;
    this.deliveryTail = deliveryTail;
    this.retryOptions = retryOptions ?? {};
    this.enableTranscriptEnrichment = enableTranscriptEnrichment ?? false;
    this.summarizationPrompt = selfSummarizationPromptForVariant(promptVariant);
  }
  getModelId() {
    return this.modelId;
  }
  getMetricsModelLabel() {
    return this.modelId;
  }
  // ---------------------------------------------------------------------------
  // Phase 1: Decompose
  // ---------------------------------------------------------------------------
  partitionMessages(messages, options2) {
    if (messages.length < 3) {
      throw new Error(`Self-summary requires at least 3 messages, got ${messages.length}`);
    }
    const { systemMessage, userInfoMessage, messagesForSummarization } = prepareMessagesForCompaction(messages);
    if (!systemMessage || systemMessage.role !== "system") {
      throw new Error("Expected system message in conversation");
    }
    const lastUserIdx = findLastUserMessageIndex2(messages);
    const lastUserQuery = messages[lastUserIdx];
    const deliveryTail = lastUserQuery !== void 0 && this.deliveryTail !== void 0 && this.deliveryTail.triggerReasons.includes(options2.triggerReason) ? selectUserDeliveryTail(messages.slice(lastUserIdx + 1), this.deliveryTail) : [];
    const skillBlocks = collectAllSkillBlocks(messagesForSummarization);
    return {
      systemMessage,
      userInfoMessage,
      messagesToSummarize: messagesForSummarization,
      preservedTailMessages: lastUserQuery ? [lastUserQuery, ...deliveryTail] : [],
      skillBlocks
    };
  }
  // ---------------------------------------------------------------------------
  // Phase 2: Generate summary
  // ---------------------------------------------------------------------------
  async generateSummary(ctx, partitioned, _options) {
    if (!partitioned.systemMessage) {
      throw new Error("Expected system message in conversation");
    }
    const privacySource = partitioned.preservedTailMessages[0] ?? partitioned.userInfoMessage ?? partitioned.systemMessage;
    const summarizationInputMessages = [
      partitioned.systemMessage,
      ...partitioned.userInfoMessage ? [partitioned.userInfoMessage] : [],
      ...partitioned.messagesToSummarize,
      {
        _privacyMode: privacySource._privacyMode,
        role: "user",
        content: safeString(this.summarizationPrompt),
        providerOptions: SUMMARIZATION_CURSOR_PROVIDER_OPTIONS
      }
    ];
    const unredact = (m2) => fromRedactedCoreMessage(m2, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    const { assistantMessage } = await executeSelfSummaryWithRetry(ctx, this.promptSession, this.stateHandler, this.interactionListener, summarizationInputMessages.map(unredact), this.tools, this.extraT, {
      preservedPrefixMessageCount: 1 + (partitioned.userInfoMessage !== void 0 ? 1 : 0),
      ...this.retryOptions
    });
    const summaryText = extractTextContent(toRedactedCoreMessage(assistantMessage, this.stateHandler.getPrivacyMode())).unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    return { text: summaryText };
  }
  // ---------------------------------------------------------------------------
  // Phase 3: Build summary message
  // ---------------------------------------------------------------------------
  buildSummaryMessage(rawSummary, partitioned, enrichments) {
    const totalSummariesAfter = this.stateHandler.selfSummaryCount + 1;
    const durableBlocks = renderDurableBlocks("self-summary", enrichments, {
      includeTranscript: this.enableTranscriptEnrichment
    });
    const wrappedContent = `${prependDurableBlocks("self-summary", durableBlocks)}

Your conversation was summarized due to context constraints. Here is the summary of the conversation so far:

<summary_content>
${rawSummary.text}
</summary_content>${appendDurableBlocks("self-summary", durableBlocks)}

Total summaries generated so far for this user query: ${totalSummariesAfter}

If the task is complete, respond to the user. Otherwise, continue working on the task.`;
    const lastUserQuery = partitioned.preservedTailMessages[0];
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
  // ---------------------------------------------------------------------------
  assembleFinalMessages(partitioned, summaryMessage) {
    if (!partitioned.systemMessage) {
      throw new Error("Expected system message in conversation");
    }
    const [lastUserQuery, ...deliveryTail] = partitioned.preservedTailMessages;
    return [
      partitioned.systemMessage,
      ...partitioned.userInfoMessage ? [partitioned.userInfoMessage] : [],
      ...lastUserQuery === void 0 ? [] : [lastUserQuery],
      summaryMessage,
      ...deliveryTail
    ];
  }
  // ---------------------------------------------------------------------------
  // Top-level summarize  (delegates to pipeline + adds metrics / onPersisted)
  // ---------------------------------------------------------------------------
  async summarize(ctx, messages, options2) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource26(env_3, createSpan(ctx.withName("SelfSummarizer.summarize")), false);
      const innerCtx = spanCtxt.ctx;
      const startTime = performance.now();
      logger38.info(innerCtx, "[self-summary] SelfSummarizer.summarize starting", {
        summarization: {
          messageCount: messages.length,
          modelId: this.modelId
        }
      });
      try {
        const pipelineResult = await runSummarizationPipeline(this, innerCtx, messages, options2);
        const summaryCodeString = createRedactedString(pipelineResult.rawSummary.text, DataClassification.CODE, "summary", this.stateHandler.getPrivacyMode());
        logger38.info(innerCtx, "[self-summary] SelfSummarizer.summarize completed", {
          summarization: {
            summaryTextLength: pipelineResult.rawSummary.text.length,
            fullReplacementMessagesCount: pipelineResult.fullReplacementMessages.length,
            messagesActuallySummarizedCount: pipelineResult.messagesActuallySummarized.length
          }
        });
        return {
          ...pipelineResult,
          summary: { summary: summaryCodeString },
          onPersisted: () => {
            this.stateHandler.incrementSelfSummaryCount();
          }
        };
      } finally {
        selfSummaryTimeTakenMs.histogram(innerCtx, performance.now() - startTime, getMembershipTypeMetricTagsFromContext(innerCtx));
      }
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      __disposeResources26(env_3);
    }
  }
};
