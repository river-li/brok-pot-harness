/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/summarization-orchestrator.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist2();
init_dist();

// @recovered-fragment 2/2
var __addDisposableResource35 = function(env, value, async) {
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
var __disposeResources35 = /* @__PURE__ */ (function(SuppressedError2) {
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
var logger60 = createLogger("@anysphere/agent");
function countMessageKinds(messages) {
  let userMessages = 0;
  let systemMessages = 0;
  let assistantMessages = 0;
  let toolMessages = 0;
  let toolCalls3 = 0;
  for (const message of messages) {
    switch (message.role) {
      case "user":
        userMessages++;
        break;
      case "system":
        systemMessages++;
        break;
      case "assistant":
        assistantMessages++;
        if (Array.isArray(message.content)) {
          for (const part of message.content) {
            if (part.type === "tool-call") {
              toolCalls3++;
            }
          }
        }
        break;
      case "tool":
        toolMessages++;
        break;
      default: {
        const _exhaustiveCheck = message;
        throw new Error(`Unknown message role: ${String(_exhaustiveCheck)}`);
      }
    }
  }
  return {
    userMessages,
    systemMessages,
    assistantMessages,
    toolMessages,
    toolCalls: toolCalls3
  };
}
function messagesEqualByValue(redactedMessage, plainMessage) {
  if (plainMessage === void 0)
    return false;
  if (redactedMessage.role !== plainMessage.role)
    return false;
  const unwrappedMessage = fromRedactedCoreMessage(redactedMessage, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  const aBytes = coreMessageSerde2.serialize(unwrappedMessage);
  const bBytes = coreMessageSerde2.serialize(plainMessage);
  if (aBytes.length !== bBytes.length)
    return false;
  for (let i = 0; i < aBytes.length; i++) {
    if (aBytes[i] !== bBytes[i])
      return false;
  }
  return true;
}
var summarizationTime = createHistogram("agenticComposer.summarizationTime", {
  description: "Time taken for summarization in milliseconds",
  labelNames: ["strategy", "triggerReason", "model", "summarizerType"]
});
var summarizationGenerationTime = createHistogram("agenticComposer.summarizationGenerationTime", {
  description: "Time spent generating a summary in milliseconds",
  labelNames: ["strategy", "triggerReason", "model", "summarizerType", "outcome"]
});
var summarizationCounter = createCounter("agenticComposer.summarization", {
  description: "Number of summarizations performed",
  labelNames: [
    "strategy",
    "triggerReason",
    "isToolCall",
    "model",
    "summarizerType",
    "clientversion",
    "clienttype"
  ]
});
var backgroundSummarizationStarted = createCounter("agent.background_summarization.started", {
  description: "Background summarizations started",
  labelNames: ["model"]
});
var backgroundSummarizationDiscarded = createCounter("agent.background_summarization.discarded", {
  description: "Background summarizations discarded at end of turn",
  labelNames: ["reason", "model"]
});
var backgroundSummarizationPersisted = createCounter("agent.background_summarization.persisted", {
  description: "Background summarizations persisted",
  labelNames: ["hadError", "errorKind", "model"]
});
var backgroundSummarizationTimeSavedMs = createHistogram("agent.background_summarization.time_saved_ms", {
  description: "Milliseconds saved by running summarization in the background (generation duration minus persist wait)",
  labelNames: ["model"]
});
var backgroundSummarizationPersistedEstimatedTokens = createHistogram("agent.background_summarization.persisted_estimated_tokens", {
  description: "Estimated token count of all messages after background summarization is persisted (replacement + unsummarized)",
  labelNames: ["model"]
});
var backgroundSummarizationPersistedAdditionalMessages = createHistogram("agent.background_summarization.persisted_additional_messages", {
  description: "Number of additional messages (arrived after background summarization started) that are appended when a background summarization is persisted, bucketed by message kind",
  labelNames: ["model", "kind"]
});
var SummarizationOrchestrator = class {
  constructor(externalSummarizer, selfSummarizerFactory, backgroundSummarizationProps, canUseSelfSummaryNow) {
    this.externalSummarizer = externalSummarizer;
    this.selfSummarizerFactory = selfSummarizerFactory;
    this.backgroundSummarizationProps = backgroundSummarizationProps;
    this.canUseSelfSummaryNow = canUseSelfSummaryNow;
  }
  shouldStartBackgroundSummarization(tokenDetails, messages, ctx) {
    const evalMaxTokensBeforeSummarization = ctx !== void 0 ? EVAL_ENFORCED_MAX_TOKENS_BEFORE_SUMMARIZATION(ctx) : void 0;
    if (ctx !== void 0 && evalMaxTokensBeforeSummarization !== void 0 && tokenDetails.usedTokens >= evalMaxTokensBeforeSummarization) {
      logger60.info(ctx, "[summarization] using eval override for max tokens before summarization", {
        evalMaxTokensBeforeSummarization,
        usedTokens: tokenDetails.usedTokens,
        maxTokens: tokenDetails.maxTokens
      });
      return true;
    }
    const bgResult = this.backgroundSummarizationProps && shouldStartBackgroundSummarization(tokenDetails.usedTokens, tokenDetails.maxTokens, this.backgroundSummarizationProps);
    const selfResult = this.selfSummarizerFactory && (this.canUseSelfSummaryNow?.() ?? true) && shouldPerformSelfSummary(messages, tokenDetails, ctx);
    if (bgResult)
      return true;
    if (selfResult)
      return true;
    return false;
  }
  canUseSelfSummary(options2) {
    return this.selfSummarizerFactory !== void 0 && (this.canUseSelfSummaryNow?.() ?? true) && options2.tools !== void 0 && options2.extraT !== void 0;
  }
  getSummarizer(stateHandler, interactionListener, config2, options2) {
    if (options2.forceExternalModel) {
      config2.onExternalSummarizationStart?.();
      return this.externalSummarizer;
    }
    if (this.canUseSelfSummary(options2)) {
      return this.selfSummarizerFactory(stateHandler, interactionListener, options2.tools, options2.extraT, options2.descriptionProps);
    }
    config2.onExternalSummarizationStart?.();
    return this.externalSummarizer;
  }
  async handleSummarization(parentCtx, stateHandler, rootPromptExecutor, interactionListener, config2, requestContext, options2) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource35(env_1, createSpan(parentCtx.withName("handleSummarization")), false);
      const ctx = spanCtxt.ctx;
      const getTokenDetails = () => options2.launchTokenDetails ?? stateHandler.tokenDetails;
      const { lastMode, isRootProject } = await resolveProjectConversationContext(ctx, stateHandler);
      if (options2.backgroundSummarizationMode === BackgroundSummarizationMode.Background && options2.canStartBackgroundSummary?.() === false) {
        return void 0;
      }
      if (isRootProject) {
        stateHandler.isRootProjectConversation = true;
      }
      const modePrompt = processModeSystemReminder(stateHandler.resolveStepMode({ mode: lastMode }), config2, requestContext, void 0, { isUserTurn: false });
      const projectRootPrompt = stateHandler.isRootProjectConversation ? `<system_reminder>
${formatProjectCompactionPrompt({
        promptText: config2.projectPromptTextGenerator?.(),
        guidanceText: config2.projectPromptGuidanceGenerator?.(),
        sendMessageToolName: isProjectSendMessageEnabled(stateHandler) ? stateHandler.getProjectSendMessageToolName() : void 0,
        coordinatorToolsEnabled: config2.featureFlags?.cloudCoordinatorToolsEnabled === true,
        coordinatorProgressEnabled: config2.featureFlags?.cloudCoordinatorProgressEnabled === true,
        coordinatorSteerFollowupsEnabled: config2.featureFlags?.cloudCoordinatorSteerFollowupsEnabled === true,
        coordinatorPlacementConsentEnabled: config2.featureFlags?.cloudCoordinatorPlacementConsentEnabled === true
      })}
</system_reminder>` : void 0;
      const allMessages = rootPromptExecutor.getMessages();
      const unredAllMessages = fromRedactedCoreMessages(allMessages, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      if (!allMessages.find((message) => message.role === "system")) {
        logger60.warn(ctx, "Compaction skipped due to missing system message", {
          summarization: { allMessagesCount: allMessages.length }
        });
        throw new Error("No system prompt found");
      }
      const { messagesForSummarization } = prepareMessagesForCompaction(allMessages);
      const summarizer = this.getSummarizer(stateHandler, interactionListener, config2, options2);
      let summarizerModelId = summarizer.getMetricsModelLabel();
      let summarizationLogFields = {
        summarizationMode: options2.backgroundSummarizationMode,
        triggerReason: options2.triggerReason,
        model: summarizerModelId
      };
      const strategy = options2.fullSummarization ? "v5NalFull" : "v5NalPartial";
      const triggerReason = options2.triggerReason;
      let summarizerType = options2.forceExternalModel === true || !this.canUseSelfSummary(options2) ? "external" : "self";
      const selfSummaryFlavor = config2.selfSummaryConfig?.flavor ?? "generic";
      const settledSnapshotCacheSafe = summarizerType === "external" || selfSummaryFlavor === "anthropic-explicit" || selfSummaryFlavor === "openai-compact";
      let settledMessages = allMessages;
      if (options2.backgroundSummarizationMode === BackgroundSummarizationMode.Background && options2.fullSummarization !== true && settledSnapshotCacheSafe && options2.settledMessageCount !== void 0 && options2.settledMessageCount < allMessages.length) {
        const candidate = allMessages.slice(0, options2.settledMessageCount);
        if (candidate.some((message) => message.role === "system")) {
          settledMessages = candidate;
        }
      }
      let useInProgressBackgroundSummarization = false;
      if (stateHandler.backgroundSummarizationPromiseInfo !== null && stateHandler.messagesUndergoingSummarization !== null) {
        const storedMessages = stateHandler.messagesUndergoingSummarization;
        const prefixValid = storedMessages.every((message, index) => messagesEqualByValue(message, unredAllMessages[index]));
        if (prefixValid) {
          summarizerModelId = stateHandler.backgroundSummarizationPromiseInfo.modelId;
          summarizerType = stateHandler.backgroundSummarizationPromiseInfo.summarizerType;
          summarizationLogFields = {
            ...summarizationLogFields,
            model: summarizerModelId
          };
          logger60.info(ctx, "Summarization with valid prefix is already underway.", {
            summarization: {
              ...summarizationLogFields,
              messagesInCurrentSummarizeRequestCount: messagesForSummarization.length,
              messagesAlreadyUndergoingSummarizationCount: storedMessages.length
            }
          });
          useInProgressBackgroundSummarization = true;
        } else {
          logger60.info(ctx, "Summarization prefix invalid. Clearing in-progress state.", {
            summarization: {
              ...summarizationLogFields,
              messagesInCurrentSummarizeRequestCount: messagesForSummarization.length,
              messagesAlreadyUndergoingSummarizationCount: storedMessages.length
            }
          });
          if (options2.backgroundSummarizationMode === BackgroundSummarizationMode.BackgroundAndPersistIfCompleted) {
            logger60.warn(ctx, "Clearing state in mode BackgroundAndPersistIfCompleted", {
              summarization: {
                ...summarizationLogFields,
                messagesInCurrentSummarizeRequestCount: messagesForSummarization.length,
                messagesAlreadyUndergoingSummarizationCount: storedMessages.length
              }
            });
          }
          backgroundSummarizationDiscarded.increment(ctx, 1, {
            reason: "prefix_invalid",
            model: stateHandler.backgroundSummarizationPromiseInfo.modelId
          });
          emitSummaryLifecycleAbandoned(ctx, stateHandler.backgroundSummarizationPromiseInfo, "prefix_invalid");
          stateHandler.clearBackgroundSummarizationState();
        }
      }
      if (!useInProgressBackgroundSummarization) {
        if (options2.backgroundSummarizationMode === BackgroundSummarizationMode.WaitForCompletionIfStarted) {
          logger60.info(ctx, "No in-flight background summarization in WaitForCompletionIfStarted mode. Returning without starting one.", {
            summarization: {
              ...summarizationLogFields,
              messagesInCurrentSummarizeRequestCount: messagesForSummarization.length
            }
          });
          return void 0;
        }
        if (options2.backgroundSummarizationMode === BackgroundSummarizationMode.BackgroundAndPersistIfCompleted) {
          logger60.warn(ctx, "Starting summarization in BackgroundAndPersistIfCompleted mode which should only be called for a completed summarization", {
            summarization: {
              ...summarizationLogFields,
              messagesInCurrentSummarizeRequestCount: messagesForSummarization.length
            }
          });
        }
        const cancellationToken = { cancelled: false };
        const lifecycle = createLiveSummaryLifecycle({
          summarizationModelId: summarizerModelId,
          mainModelId: config2.modelId,
          summarizerType
        });
        emitSummaryLifecycleStarted(ctx, lifecycle);
        const summarizationPromise = (async () => {
          const generationStart = performance.now();
          try {
            logger60.info(ctx, "Starting new background summarization", {
              summarization: {
                ...summarizationLogFields,
                messagesToSummarizeCount: messagesForSummarization.length,
                settledMessagesCount: settledMessages.length,
                allMessagesCount: allMessages.length,
                summarizerModel: summarizerModelId,
                summarizationMode: options2.backgroundSummarizationMode,
                triggerReason: options2.triggerReason
              }
            });
            backgroundSummarizationStarted.increment(ctx, 1, {
              model: summarizerModelId
            });
            const todoItems = await Promise.all(stateHandler.todos.map((todoRef) => todoRef.get(ctx)));
            const todoContent = formatTodosForSummarization(todoItems);
            const includeTranscriptInSummary = config2.enableTranscriptInSummary === true && requestContext.env?.agentTranscriptsFolder !== void 0 && config2.agentType !== AgentType.BACKGROUND;
            const result = await summarizer.summarize(ctx, settledMessages, {
              privacyMode: stateHandler.getPrivacyMode(),
              fullSummarization: options2.fullSummarization,
              currentPlan: options2.currentPlan,
              modePrompt,
              projectRootPrompt,
              agentTranscriptsFolder: includeTranscriptInSummary ? requestContext.env?.agentTranscriptsFolder : void 0,
              conversationId: config2.conversationId,
              automationTriggerContext: options2.automationTriggerContext,
              todoContent,
              customModeSkillBlock: config2.featureFlags?.dropCustomPromptContext === true || stateHandler.durableSkillBlocks.length === 0 ? void 0 : stateHandler.durableSkillBlocks.join("\n\n"),
              backgroundSummarizationMode: options2.backgroundSummarizationMode,
              triggerReason: options2.triggerReason,
              enableRetryOutputTokenLimit: options2.backgroundSummarizationMode === BackgroundSummarizationMode.WaitForCompletion ? true : void 0,
              cancellationToken,
              contextWindowTokens: getTokenDetails().maxTokens
            });
            const generationDuration = performance.now() - generationStart;
            summarizationGenerationTime.histogram(ctx, generationDuration, {
              strategy,
              triggerReason,
              model: summarizerModelId,
              summarizerType,
              outcome: "success"
            });
            emitSummaryLifecycleCompleted(ctx, lifecycle, result.hadError === true ? "fallback" : "generated");
            stateHandler.setBackgroundSummarizationHasCompleted(generationDuration);
            logger60.info(ctx, "Background summarization completed", {
              summarization: {
                ...summarizationLogFields,
                messagesToSummarizeCount: messagesForSummarization.length
              }
            });
            return result;
          } catch (e) {
            const generationDuration = performance.now() - generationStart;
            const errorKind = getRetryDirective(e, {
              transientRetryDelayMs: 0
            }).errorType;
            summarizationGenerationTime.histogram(ctx, generationDuration, {
              strategy,
              triggerReason,
              model: summarizerModelId,
              summarizerType,
              outcome: "error"
            });
            logger60.error(ctx, "Background summarization failed, clearing state", e, {
              summarization: {
                ...summarizationLogFields
              }
            });
            if (summarizerType === "self" && (errorKind === "InputTokenLimitError" || errorKind === "InputTooLargeError" || errorKind === "OutputTokensLimitExceededError")) {
              stateHandler.setSelfSummaryInputLimitFailureTokenCount(getTokenDetails().usedTokens);
            }
            emitSummaryLifecycleAbandoned(ctx, lifecycle, "generation_failed");
            stateHandler.clearBackgroundSummarizationState();
            throw e;
          }
        })();
        const promiseInfo = {
          kind: "live_generation",
          promise: summarizationPromise,
          modelId: summarizerModelId,
          summarizerType,
          startInvocationId: options2.currentInvocationId,
          startUsedTokens: getTokenDetails().usedTokens,
          startMaxTokens: getTokenDetails().maxTokens,
          triggerReason: options2.triggerReason,
          lifecycle
        };
        stateHandler.setBackgroundSummarizationState(promiseInfo, settledMessages, cancellationToken);
        if (config2.pendingSummaryStore !== void 0 && config2.conversationId !== void 0) {
          stashSummarizationResultWhenOrphaned({
            ctx,
            store: config2.pendingSummaryStore,
            conversationId: config2.conversationId,
            privacyMode: stateHandler.getPrivacyMode(),
            summarizationPromise,
            cancellationToken,
            messagesSummarized: settledMessages,
            modelId: summarizerModelId,
            summarizerType,
            startInvocationId: options2.currentInvocationId,
            startUsedTokens: getTokenDetails().usedTokens,
            startMaxTokens: getTokenDetails().maxTokens,
            usedTokensThresholdToStartBackgroundSummarization: config2.backgroundSummarizationProps.usedTokensThresholdToStartBackgroundSummarization,
            usedTokensThresholdToPersistBackgroundSummarization: config2.backgroundSummarizationProps.usedTokensThresholdToPersistBackgroundSummarization,
            triggerReason: options2.triggerReason,
            summaryLifecycleId: lifecycle.summaryLifecycleId,
            logFields: summarizationLogFields
          });
          config2.pendingSummaryStore.trackPendingGeneration?.({
            conversationId: config2.conversationId,
            promiseInfo,
            messagesSummarized: settledMessages
          });
        }
      }
      switch (options2.backgroundSummarizationMode) {
        case BackgroundSummarizationMode.Background:
          logger60.info(ctx, "Background summarization in progress in Background mode. Returning without awaiting completion.", {
            summarization: summarizationLogFields
          });
          return void 0;
        case BackgroundSummarizationMode.BackgroundAndPersistIfCompleted:
          if (!stateHandler.backgroundSummarizationHasCompleted) {
            logger60.info(ctx, "Background summarization is not completed yet in BackgroundAndPersistIfCompleted mode. REturning without awaiting completion.", { summarization: summarizationLogFields });
            return void 0;
          }
          logger60.info(ctx, "Background summarization has completed in BackgroundAndPersistIfCompleted mode. Going to persist summary.", { summarization: summarizationLogFields });
          break;
        case BackgroundSummarizationMode.WaitForCompletion:
          if (!stateHandler.backgroundSummarizationHasCompleted) {
            logger60.info(ctx, "Background summarization is not completed in WaitForCompletion mode. Going to wait for completion and then persist summary.", { summarization: summarizationLogFields });
          } else {
            logger60.info(ctx, "Background summarization has completed in WaitForCompletion mode. Going to persist summary.", { summarization: summarizationLogFields });
          }
          break;
        case BackgroundSummarizationMode.WaitForCompletionIfStarted:
          if (!stateHandler.backgroundSummarizationHasCompleted) {
            logger60.info(ctx, "In-flight background summarization is not completed in WaitForCompletionIfStarted mode. Going to wait for completion and then persist summary.", { summarization: summarizationLogFields });
          } else {
            logger60.info(ctx, "In-flight background summarization has completed in WaitForCompletionIfStarted mode. Going to persist summary.", { summarization: summarizationLogFields });
          }
          break;
        default: {
          const _exhaustiveCheck = options2.backgroundSummarizationMode;
          throw new Error(`Unknown background summarization mode: ${options2.backgroundSummarizationMode}`);
        }
      }
      const { contextWindowSize, contextTokens, contextUsagePercent } = getContextUsageInfo(stateHandler.tokenDetails);
      const isFirstCompaction = stateHandler.summaryArchives.length === 0 && stateHandler.selfSummaryCount === 0;
      const hookTrigger = options2.triggerReason === "force_option" || options2.triggerReason === "force_dev_testing" ? "manual" : "auto";
      let hookMessage;
      if (config2.enableExecuteHookExec && isHookStepConfigured(requestContext.hooksConfig?.configuredSteps, "preCompact")) {
        try {
          const env_2 = { stack: [], error: void 0, hasError: false };
          try {
            const span = __addDisposableResource35(env_2, createSpan(ctx.withName("agent.lifecycleHook.preCompact")), false);
            const hookCtx = span.ctx;
            const remoteHookExecutor = options2.resourceAccessor.get(hookExecutorResource);
            if (remoteHookExecutor) {
              const hookArgs = new ExecuteHookArgs({
                request: new ExecuteHookRequest({
                  request: {
                    case: "preCompact",
                    value: new PreCompactRequestQuery({
                      trigger: hookTrigger,
                      contextUsagePercent,
                      contextTokens: BigInt(contextTokens),
                      contextWindowSize: BigInt(contextWindowSize),
                      messageCount: allMessages.length,
                      messagesToCompact: messagesForSummarization.length,
                      isFirstCompaction,
                      conversationId: getConversationId(ctx) ?? void 0,
                      generationId: getRequestId(ctx) ?? void 0,
                      model: summarizerModelId
                    })
                  }
                })
              });
              const result = await remoteHookExecutor.execute(hookCtx, hookArgs);
              if (result.response?.response.case === "preCompact") {
                const userMessage = result.response.response.value.userMessage;
                if (userMessage) {
                  hookMessage = userMessage;
                  logger60.info(hookCtx, "[summarization] preCompact hook message", {
                    summarization: { userMessage: hookMessage }
                  });
                }
              }
            }
          } catch (e_1) {
            env_2.error = e_1;
            env_2.hasError = true;
          } finally {
            __disposeResources35(env_2);
          }
        } catch (error3) {
          logger60.warn(ctx, "[summarization] preCompact hook execution failed", {
            summarization: { error: error3 }
          });
        }
      }
      let summarizationFailed = false;
      try {
        if (options2.backgroundSummarizationMode === BackgroundSummarizationMode.WaitForCompletion || options2.backgroundSummarizationMode === BackgroundSummarizationMode.WaitForCompletionIfStarted || // By the time we get here, if mode is BackgroundAndPersistIfCompleted, we have already checked that
        // the summarization has completed. Otherwise, we would have returned earlier.
        options2.backgroundSummarizationMode === BackgroundSummarizationMode.BackgroundAndPersistIfCompleted) {
          await interactionListener.sendUpdate(ctx, RedactedUpdates.summaryStarted(PrivacyMode.UNSPECIFIED));
        }
        const beforeSummarize = performance.now();
        const messagesSummarized = stateHandler.messagesUndergoingSummarization;
        const backgroundSummarizationPromiseInfo = stateHandler.backgroundSummarizationPromiseInfo;
        if (messagesSummarized === null || backgroundSummarizationPromiseInfo === null) {
          summarizationFailed = true;
          logger60.warn(ctx, "Background summarization state cleared during handleSummarization; skipping", { summarization: summarizationLogFields });
          return void 0;
        }
        const backgroundSummarizationModelId = backgroundSummarizationPromiseInfo.modelId;
        const result = await backgroundSummarizationPromiseInfo.promise;
        const { messagesActuallySummarized, newSummaryMessage, preservedOriginalTailMessages, rawSummary, summary, fullReplacementMessages, onPersisted } = result;
        const summarizationDuration = performance.now() - beforeSummarize;
        const hadAbortError = result.errorKind?.toLowerCase()?.includes("abort") === true;
        const candidateWasAborted = hadAbortError || result.errorKind === "Cancelled";
        if (this.backgroundSummarizationProps?.discardOnError !== false && result.hadError && (options2.backgroundSummarizationMode !== BackgroundSummarizationMode.WaitForCompletion && options2.backgroundSummarizationMode !== BackgroundSummarizationMode.WaitForCompletionIfStarted || hadAbortError)) {
          summarizationFailed = true;
          stateHandler.clearBackgroundSummarizationState();
          backgroundSummarizationDiscarded.increment(ctx, 1, {
            reason: hadAbortError ? "abort_error" : "summarization_error",
            model: backgroundSummarizationModelId
          });
          emitSummaryLifecycleAbandoned(ctx, backgroundSummarizationPromiseInfo, candidateWasAborted ? "candidate_aborted" : "candidate_error");
          logger60.warn(ctx, "Discarding background summarization due to generation error", {
            summarization: {
              ...summarizationLogFields,
              errorKind: result.errorKind ?? "unknown"
            }
          });
          return void 0;
        }
        const redactedCoreMessageSerde = createRedactedCoreMessageSerde(stateHandler.getPrivacyMode());
        const rawWindowTail = messagesForSummarization.length - messagesActuallySummarized.length;
        if (rawWindowTail < 0) {
          logger60.warn(ctx, "Clamping negative windowTail during compaction", {
            summarization: {
              messagesForSummarizationCount: messagesForSummarization.length,
              messagesActuallySummarizedCount: messagesActuallySummarized.length,
              rawWindowTail
            }
          });
        }
        stateHandler.pushSummaryArchive(createRedactedConversationSummaryArchive(stateHandler.getPrivacyMode(), {
          summarizedMessages: await Promise.all(messagesActuallySummarized.filter((m2) => !m2.providerOptions?.cursor?.isSummary).map(async (message) => {
            const serializedMessage = redactedCoreMessageSerde.serialize(message);
            const blobId = await getBlobId(serializedMessage);
            await stateHandler.getBlobStore().setBlob(ctx, blobId, serializedMessage);
            return blobId;
          })),
          summary: summary.summary,
          summaryMessage: await (async () => {
            const serializedMessage = redactedCoreMessageSerde.serialize(newSummaryMessage);
            const blobId = await getBlobId(serializedMessage);
            await stateHandler.getBlobStore().setBlob(ctx, blobId, serializedMessage);
            return blobId;
          })(),
          // Clamp to >= 0 because this field is proto uint32 and negatives fail serialization.
          // Investigation notes: `windowTail` is consumed by prompt-logging metadata to define
          // summary/window ranges, not to drive the actual conversation rewrite. In edge cases
          // where archive math goes negative (e.g. 0-for-compaction, 1-actually-summarized),
          // clamping is safer: we preserve a best-effort window range instead of crashing stream.
          windowTail: Math.max(0, rawWindowTail)
        }));
        const generationDurationMsBeforeClear = stateHandler.backgroundSummarizationGenerationDurationMs;
        stateHandler.clearBackgroundSummarizationState();
        stateHandler.tokenDetailsStaleAfterSummarization = true;
        const replacementMessages = config2.getNamedAgentSelfDocument !== void 0 ? await refreshNamedAgentSelfDocumentInMessages(ctx, fullReplacementMessages, config2.getNamedAgentSelfDocument, stateHandler.getPrivacyMode()) : fullReplacementMessages;
        rootPromptExecutor.clearMessages();
        rootPromptExecutor.appendMessages(replacementMessages);
        const messagesNotSummarized = allMessages.slice(messagesSummarized.length);
        rootPromptExecutor.appendMessages(messagesNotSummarized);
        stateHandler.messageCountAtLastCompaction = rootPromptExecutor.getMessages().length;
        stateHandler.retainCompletedAskQuestionReceipts(collectLiveAskQuestionOriginalIds(rootPromptExecutor.getMessages()));
        const persistedEstimatedTokens = estimateTokenCount2(replacementMessages) + estimateTokenCount2(messagesNotSummarized);
        const model = summarizerModelId;
        const additionalMessagesStats = countMessageKinds(messagesNotSummarized);
        logger60.info(ctx, "Persisted completed summarization", {
          summarization: {
            ...summarizationLogFields,
            messagesSummarizedCount: messagesSummarized.length,
            messagesNotSummarizedCount: messagesNotSummarized.length,
            additionalMessagesUserCount: additionalMessagesStats.userMessages,
            additionalMessagesSystemCount: additionalMessagesStats.systemMessages,
            additionalMessagesAssistantCount: additionalMessagesStats.assistantMessages,
            additionalMessagesToolMessageCount: additionalMessagesStats.toolMessages,
            additionalMessagesToolCallCount: additionalMessagesStats.toolCalls,
            persistedEstimatedTokens,
            hadError: result.hadError === true,
            errorKind: result.hadError === true ? result.errorKind ?? "unknown" : "none",
            model
          }
        });
        backgroundSummarizationPersisted.increment(ctx, 1, {
          hadError: result.hadError === true ? "true" : "false",
          errorKind: result.hadError === true ? result.errorKind ?? "unknown" : "none",
          model: backgroundSummarizationModelId
        });
        backgroundSummarizationPersistedEstimatedTokens.histogram(ctx, persistedEstimatedTokens, {
          model: backgroundSummarizationModelId
        });
        backgroundSummarizationPersistedAdditionalMessages.histogram(ctx, additionalMessagesStats.userMessages, { model: backgroundSummarizationModelId, kind: "user_message" });
        backgroundSummarizationPersistedAdditionalMessages.histogram(ctx, additionalMessagesStats.systemMessages, { model: backgroundSummarizationModelId, kind: "system_message" });
        backgroundSummarizationPersistedAdditionalMessages.histogram(ctx, additionalMessagesStats.assistantMessages, { model: backgroundSummarizationModelId, kind: "assistant_message" });
        backgroundSummarizationPersistedAdditionalMessages.histogram(ctx, additionalMessagesStats.toolMessages, { model: backgroundSummarizationModelId, kind: "tool_message" });
        backgroundSummarizationPersistedAdditionalMessages.histogram(ctx, additionalMessagesStats.toolCalls, { model: backgroundSummarizationModelId, kind: "tool_call" });
        stateHandler.clearSelfSummaryInputLimitFailureTokenCount();
        onPersisted?.();
        summarizationTime.histogram(ctx, summarizationDuration, {
          strategy,
          triggerReason,
          model,
          summarizerType
        });
        if (generationDurationMsBeforeClear !== null) {
          const timeSavedMs = Math.max(0, generationDurationMsBeforeClear - summarizationDuration);
          backgroundSummarizationTimeSavedMs.histogram(ctx, timeSavedMs, {
            model: backgroundSummarizationModelId
          });
        }
        summarizationCounter.increment(ctx, 1, {
          strategy,
          triggerReason,
          isToolCall: options2.isToolCall === true ? "true" : "false",
          model,
          summarizerType,
          ...getClientVersionMetricTagsFromContext(ctx)
        });
        const summarizedStats = countMessageKinds(messagesActuallySummarized);
        const eventTracker = getAgentEventTracker(ctx);
        emitSummaryLifecyclePersisted(ctx, backgroundSummarizationPromiseInfo);
        eventTracker.trackSummarizationTriggered(ctx, {
          userMessageCountBeforeSummarization: summarizedStats.userMessages,
          toolCallCountBeforeSummarization: summarizedStats.toolCalls,
          summaryLengthInChars: summary.summary.length,
          summarizationModelId: backgroundSummarizationModelId,
          mainModelId: config2.modelId,
          summarizerType,
          summarizationStartInvocationId: backgroundSummarizationPromiseInfo.startInvocationId,
          summarizationPersistInvocationId: options2.currentInvocationId,
          triggerTokensUsed: backgroundSummarizationPromiseInfo.startUsedTokens,
          triggerTokensMax: backgroundSummarizationPromiseInfo.startMaxTokens,
          additionalMessagesCount: messagesNotSummarized.length,
          additionalUserMessageCount: additionalMessagesStats.userMessages,
          additionalSystemMessageCount: additionalMessagesStats.systemMessages,
          additionalAssistantMessageCount: additionalMessagesStats.assistantMessages,
          additionalToolMessageCount: additionalMessagesStats.toolMessages,
          additionalToolCallCount: additionalMessagesStats.toolCalls,
          summaryLifecycleId: backgroundSummarizationPromiseInfo.lifecycle?.summaryLifecycleId
        });
        const gradingTailMessages = [...preservedOriginalTailMessages, ...messagesNotSummarized];
        const preservedTailMessageSet = new Set(preservedOriginalTailMessages);
        const preservedTailIndices = new Set(fullReplacementMessages.flatMap((message, index) => preservedTailMessageSet.has(message) ? [index] : []));
        const effectiveContextMessages = [
          ...replacementMessages.filter((message, index) => message === newSummaryMessage || message.providerOptions?.cursor?.isSummary === true || preservedTailIndices.has(index)),
          ...messagesNotSummarized
        ];
        eventTracker.trackSummarizationPersistedForQualityGrading?.(ctx, {
          preSummarizationMessages: messagesActuallySummarized,
          // Keep the diagnostic and product-outcome candidates separate:
          // summary-only grades raw model output, while effective quality grades
          // the actual persisted carrier plus the true preserved tail.
          modelSummaryText: summary.summary.safeTransform(() => rawSummary.text),
          persistedSummaryMessage: newSummaryMessage,
          effectiveContextMessages,
          preservedTailMessages: gradingTailMessages,
          summarizerType,
          // Lets analysis exclude deterministic fallback output from the
          // model-summary lane while still grading the product outcome.
          summarizationHadError: result.hadError === true,
          summarizationErrorKind: result.hadError === true ? result.errorKind ?? "unknown" : void 0,
          summarizationModelId: backgroundSummarizationModelId,
          mainModelId: config2.modelId,
          summarizationStartInvocationId: backgroundSummarizationPromiseInfo.startInvocationId,
          summarizationPersistInvocationId: options2.currentInvocationId
        });
        if (config2.enableTranscriptInSummary === true && requestContext.env?.agentTranscriptsFolder !== void 0 && config2.agentType !== AgentType.BACKGROUND) {
          logger60.info(ctx, "Summary includes transcript pointer", {
            summarization: { conversationId: config2.conversationId }
          });
        }
        return summary.summary;
      } catch (error3) {
        summarizationFailed = true;
        throw error3;
      } finally {
        if (options2.backgroundSummarizationMode === BackgroundSummarizationMode.WaitForCompletion || options2.backgroundSummarizationMode === BackgroundSummarizationMode.WaitForCompletionIfStarted || options2.backgroundSummarizationMode === BackgroundSummarizationMode.BackgroundAndPersistIfCompleted) {
          await interactionListener.sendUpdate(ctx, toRedactedInteractionUpdate(Updates.summaryCompleted(hookMessage, summarizationFailed ? true : void 0), PrivacyMode.UNSPECIFIED));
        }
      }
    } catch (e_2) {
      env_1.error = e_2;
      env_1.hasError = true;
    } finally {
      __disposeResources35(env_1);
    }
  }
};

