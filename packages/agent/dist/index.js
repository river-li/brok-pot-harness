var __addDisposableResource38 = function(env, value, async) {
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
var __disposeResources38 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error42, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error42, e.suppressed = suppressed, e;
});
var logger96 = createLogger("@anysphere/agent");
var stateDeserializationDuration = createHistogram("agent.ttft.stateDeserializationMs", {
  description: "Time to deserialize conversation state from blob store in runStream"
});
var actionHandlerDuration = createHistogram("agent.ttft.actionHandlerMs", {
  description: "Time for the action handler (handle) to complete in runStream"
});
var finalizeRootPromptRestoreMode = createCounter("agent.finalize_step.root_prompt_restore_mode", {
  description: "Counts whether finalizeStep restores loaded root prompt blobs or used skip mode.",
  labelNames: ["mode"]
});
var overlapSetupStateHandle = createCounter("cloud_agents.overlap_setup_state_handle", {
  description: "Whether a prewarmed model-step state handle was adopted or discarded, and why.",
  labelNames: ["outcome", "reason"]
});
function finalizeNeedsRootPrompt(config2) {
  return config2.reminders !== void 0 && config2.reminders.length > 0 || config2.messageHistoryModifier !== void 0;
}
function withCompactionEpoch(ctx, stateHandler) {
  return ctx.with(compactionEpochKey, () => stateHandler.summaryArchives.length);
}
function recordTurnPrepPrewarm(ctx, outcome, residualWaitMs) {
  ctx.get(cloudAgentTurnPrepPrewarmRecorderKey)?.({
    outcome,
    residualWaitMs
  });
}
var AnysphereAgent = class {
  shouldTrackAgentTypeChange(actionCase) {
    return actionCase === "userMessageAction" || actionCase === "subscriptionNotificationAction" || actionCase === "goalContinuationAction" || actionCase === "resumeAction" || actionCase === "executePlanAction";
  }
  stateHandleOptions(options2) {
    return {
      ...options2,
      serializeSubagentStatesAsBlobRefs: this.config.featureFlags?.serializeSubagentStatesAsBlobRefs === true,
      restoreBlobFetchConcurrency: this.config.featureFlags?.agentStateRestoreBlobFetchConcurrency
    };
  }
  constructor(config2, promptSession, interactionListener, resourceAccessor, blobStore, summarizationHandler, conversationActionReceiver) {
    this.promptSession = promptSession;
    this.interactionListener = interactionListener;
    this.resourceAccessor = resourceAccessor;
    this.blobStore = blobStore;
    this.summarizationHandler = summarizationHandler;
    this.conversationActionReceiver = conversationActionReceiver;
    this.prewarmDiscardedBeforeSetup = false;
    if (config2.systemPromptGenerator === void 0) {
      throw new Error("systemPromptGenerator is required");
    }
    this.config = {
      planSystemReminderGenerator: () => "",
      askSystemReminderGenerator: (_options) => "",
      debugSystemReminderGenerator: (_debugModeConfig, _isFirstDebugModeMessage) => "",
      triageSystemReminderGenerator: () => "",
      projectSystemReminderGenerator: () => "",
      backgroundSummarizationProps: DISABLED_BACKGROUND_SUMMARIZATION_PROPS,
      formattingOptions: {
        shouldUseFormatCodeblock: true,
        gpt5StyleLineNumbers: false,
        gpt5CodexCatN: false
      },
      nonFileRules: [],
      immediatelyUpdateStateOnNewTurn: false,
      smartModeClassifierMode: false,
      smartModeClassifierShadowMode: false,
      doNotFailOnMaxSteps: false,
      enableAgentNotes: false,
      enableTerminalFiles: true,
      enableImageFiles: false,
      enableLongCodeSelectionSpillToFile: true,
      enableToolArgPreservation: true,
      strictArgParsing: false,
      enableExecuteHookExec: false,
      enableTranscriptInSummary: true,
      summarizeActionClearTurns: false,
      summarizeActionMode: "full",
      fireAndForgetCheckpoints: false,
      skipErrorStateCheckpoint: false,
      enablePrependedUserActions: true,
      ...config2,
      maxSteps: config2.maxSteps ?? MAX_AGENT_STEPS
    };
    this.config.nonFileRules = filterByActorIdentity(this.config.nonFileRules, this.config.actorIdentity);
    const selfSummarizerFactory = this.config.selfSummaryConfig ? (stateHandler, interactionListener2, tools, extraT, descriptionProps) => {
      const modelId = this.config.modelId ?? "self-summary";
      const selfSummaryConfig = this.config.selfSummaryConfig;
      const session = selfSummaryConfig.promptSession;
      const flavor = selfSummaryConfig.flavor ?? "generic";
      const baseRetryOptions = {
        enableReduceInputsRetry: selfSummaryConfig.enableReduceInputsRetry ?? true,
        enableRetryUncategorizedErrors: selfSummaryConfig.enableRetryUncategorizedErrors ?? true,
        descriptionProps
      };
      selfSummaryConfig.onSelfSummaryStart?.();
      switch (flavor) {
        case "xai-compact":
          return new XaiCompactionHandler(session, stateHandler, interactionListener2, tools, extraT, modelId, {
            ...baseRetryOptions,
            enableRetryNoSummaryResponse: selfSummaryConfig.enableRetryNoSummaryResponse ?? true,
            enableTranscriptEnrichment: selfSummaryConfig.enableTranscriptEnrichment ?? false
          });
        case "openai-compact":
          return new OpenAICompactionHandler(session, stateHandler, interactionListener2, tools, extraT, modelId, {
            ...baseRetryOptions,
            enableRetryNoSummaryResponse: selfSummaryConfig.openAiCompactionEnableRetryNoSummaryResponse ?? false
          });
        case "anthropic-explicit":
          return new AnthropicCompactionHandler(session, stateHandler, interactionListener2, tools, extraT, modelId, {
            ...baseRetryOptions,
            enableRetryNoSummaryResponse: selfSummaryConfig.anthropicCompactionEnableRetryNoSummaryResponse ?? false
          });
        case "generic":
          return new SelfSummarizer(session, stateHandler, interactionListener2, tools, extraT, modelId, {
            ...baseRetryOptions,
            enableRetryNoSummaryResponse: selfSummaryConfig.enableRetryNoSummaryResponse ?? true
          }, selfSummaryConfig.enableTranscriptEnrichment ?? false, selfSummaryConfig.promptVariant, selfSummaryConfig.preserveUserDeliveryTail);
        default: {
          const _exhaustive = flavor;
          return _exhaustive;
        }
      }
    } : void 0;
    const orchestrator = new SummarizationOrchestrator(this.summarizationHandler, selfSummarizerFactory, this.config.backgroundSummarizationProps, this.config.selfSummaryConfig?.canUseSelfSummary);
    this.orchestrator = orchestrator;
    this.actionHandlers = /* @__PURE__ */ new Map();
    const userMessageActionHandler = new UserMessageActionHandler(this.config, this.resourceAccessor, this.interactionListener, this.summarizationHandler, this.conversationActionReceiver, orchestrator);
    this.actionHandlers.set("userMessageAction", userMessageActionHandler);
    this.actionHandlers.set("subscriptionNotificationAction", new SubscriptionNotificationActionHandler(userMessageActionHandler));
    this.actionHandlers.set("goalContinuationAction", new GoalContinuationActionHandler(userMessageActionHandler, this.config.toolsGenerator, this.resourceAccessor, this.config.agentSessionId));
    this.actionHandlers.set("resumeAction", new ResumeActionHandler(this.config, this.resourceAccessor, this.interactionListener, this.summarizationHandler, this.conversationActionReceiver, orchestrator));
    this.actionHandlers.set("summarizeAction", new SummarizeActionHandler(this.config, this.resourceAccessor, this.interactionListener, orchestrator, this.conversationActionReceiver));
    this.actionHandlers.set("shellCommandAction", new ShellCommandActionHandler(this.config, this.resourceAccessor, this.interactionListener, this.summarizationHandler, this.conversationActionReceiver));
    this.actionHandlers.set("cancelAction", new CancelActionHandler(this.config, this.resourceAccessor, this.interactionListener, this.summarizationHandler, this.conversationActionReceiver));
    this.actionHandlers.set("executePlanAction", new ExecutePlanActionHandler(this.config, this.resourceAccessor, this.interactionListener, this.summarizationHandler, this.conversationActionReceiver, orchestrator));
    this.actionHandlers.set("asyncAskQuestionCompletionAction", new AsyncAskQuestionCompletionActionHandler(this.config, this.resourceAccessor, this.interactionListener, this.summarizationHandler, this.conversationActionReceiver, orchestrator));
    this.actionHandlers.set("backgroundTaskCompletionAction", new BackgroundTaskCompletionActionHandler(this.config, this.resourceAccessor, this.interactionListener, this.summarizationHandler, this.conversationActionReceiver, orchestrator));
    this.actionHandlers.set("backgroundShellAction", new BackgroundShellActionHandler());
    this.actionHandlers.set("backgroundSubagentAction", new BackgroundSubagentActionHandler());
  }
  async runStream(parentCtx, state, action, mcpTools, onStateUpdate, options2) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource38(env_1, createSpan(parentCtx.withName("runStream")), false);
      let ctx = withLogAttributes(spanCtxt.ctx, {
        action: action.action.case,
        modelName: this.config.modelId,
        ...this.config.canonicalModelName !== void 0 && {
          canonicalModelName: this.config.canonicalModelName
        }
      });
      if (this.config.conversationGroupId !== void 0) {
        ctx = ctx.with(conversationGroupIdKey2, this.config.conversationGroupId);
      }
      if (this.config.conversationId !== void 0) {
        ctx = ctx.with(conversationIdKey2, this.config.conversationId);
      }
      if (this.config.isBackground === true) {
        ctx = ctx.with(bubbleRetryableTaskErrorsKey, true);
      }
      const unredactedExecutor = this.promptSession.getExecutor();
      const baseExecutor = new RedactedPromptToolExecutor(unredactedExecutor, PrivacyMode.UNSPECIFIED);
      let restoredRootPromptImagePresence;
      const stateDeserStart = performance.now();
      const stateHandler = await ConversationStateHandle.fromConversationStateStructure(ctx, this.blobStore, state, baseExecutor, this.config.formattingOptions, this.config.modelId, this.config.agentType, this.stateHandleOptions({
        shouldTrackAgentTypeChange: this.shouldTrackAgentTypeChange(action.action.case),
        loadRootPromptBlobs: true,
        ...options2?.onRootPromptImagePresence !== void 0 ? {
          onRootPromptImagePresence: (presence) => {
            restoredRootPromptImagePresence = presence;
          }
        } : {}
      }));
      const stateDeserializationMs = performance.now() - stateDeserStart;
      stateDeserializationDuration.histogram(ctx, stateDeserializationMs);
      options2?.onStateDeserialized?.(stateDeserializationMs);
      if (restoredRootPromptImagePresence !== void 0) {
        options2?.onRootPromptImagePresence?.(restoredRootPromptImagePresence);
      }
      const currentAction = action;
      let currentState = state;
      const accumulatedUsage = {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
        reasoningTokens: 0
      };
      if (currentAction.action.case === void 0) {
        throw new Error("Action is required");
      }
      if (currentAction.action.case === "startPlanAction") {
        throw new Error("startPlanAction is deprecated; use userMessageAction with UserMessage.mode = PLAN");
      }
      spanCtxt.span.setAttribute("action", currentAction.action.case);
      const handler = this.actionHandlers.get(currentAction.action.case);
      if (!handler) {
        throw new Error(`Unsupported action type: ${currentAction.action.case}`);
      }
      const onStateUpdateWithFlush = async (innerCtx, state2) => {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
          const span = __addDisposableResource38(env_2, createSpan(innerCtx.withName("onStateUpdateWithFlush")), false);
          await this.blobStore.flush(span.ctx);
          await onStateUpdate?.(span.ctx, fromRedactedConversationStateStructure(state2, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
        } catch (e_2) {
          env_2.error = e_2;
          env_2.hasError = true;
        } finally {
          __disposeResources38(env_2);
        }
      };
      let promise2 = Promise.resolve();
      try {
        const actionHandlerStart = performance.now();
        currentState = await handler.handle(withCompactionEpoch(ctx, stateHandler), action.action.value, baseExecutor, stateHandler, mcpTools, onStateUpdateWithFlush);
        const actionHandlerMs = performance.now() - actionHandlerStart;
        actionHandlerDuration.histogram(ctx, actionHandlerMs, {
          action: currentAction.action.case ?? "unknown"
        });
        const mainUsage = stateHandler.getTurnUsageAndReset();
        accumulatedUsage.inputTokens += mainUsage.inputTokens;
        accumulatedUsage.outputTokens += mainUsage.outputTokens;
        accumulatedUsage.cacheReadTokens += mainUsage.cacheReadTokens;
        accumulatedUsage.cacheWriteTokens += mainUsage.cacheWriteTokens;
        accumulatedUsage.reasoningTokens += mainUsage.reasoningTokens ?? 0;
        if (this.config.fireAndForgetCheckpoints) {
          promise2 = promise2.then(() => onStateUpdateWithFlush(ctx, currentState)).catch((error42) => {
            logger96.error(ctx, "Failed to flush and update state", { error: error42 });
          });
        } else {
          await onStateUpdateWithFlush(ctx, currentState);
        }
        while (true) {
          const queuedAction = await this.conversationActionReceiver.peek(ctx);
          if (!queuedAction || !queuedAction.action.case) {
            break;
          }
          const queuedHandler = this.actionHandlers.get(queuedAction.action.case);
          if (!queuedHandler) {
            await this.conversationActionReceiver.pop(ctx);
            continue;
          }
          await this.conversationActionReceiver.pop(ctx);
          baseExecutor.clearMessages();
          const updatedStateHandler = await ConversationStateHandle.fromConversationStateStructure(ctx, this.blobStore, currentState, baseExecutor, this.config.formattingOptions, this.config.modelId, this.config.agentType, this.stateHandleOptions({
            shouldTrackAgentTypeChange: this.shouldTrackAgentTypeChange(queuedAction.action.case),
            loadRootPromptBlobs: true
          }));
          currentState = await queuedHandler.handle(withCompactionEpoch(ctx, updatedStateHandler), queuedAction.action.value, baseExecutor, updatedStateHandler, mcpTools, onStateUpdateWithFlush);
          const queuedUsage = updatedStateHandler.getTurnUsageAndReset();
          accumulatedUsage.inputTokens += queuedUsage.inputTokens;
          accumulatedUsage.outputTokens += queuedUsage.outputTokens;
          accumulatedUsage.cacheReadTokens += queuedUsage.cacheReadTokens;
          accumulatedUsage.cacheWriteTokens += queuedUsage.cacheWriteTokens;
          accumulatedUsage.reasoningTokens += queuedUsage.reasoningTokens ?? 0;
          if (this.config.fireAndForgetCheckpoints) {
            promise2 = promise2.then(() => onStateUpdateWithFlush(ctx, currentState)).catch((error42) => {
              logger96.error(ctx, "Failed to flush and update state", { error: error42 });
            });
          } else {
            await onStateUpdateWithFlush(ctx, currentState);
          }
        }
        if (!options2?.skipTurnEndedUpdate) {
          const hasUsage = accumulatedUsage.inputTokens > 0 || accumulatedUsage.outputTokens > 0 || accumulatedUsage.cacheReadTokens > 0 || accumulatedUsage.cacheWriteTokens > 0;
          await this.interactionListener.sendUpdate(ctx, toRedactedInteractionUpdate(Updates.turnEnded(hasUsage ? accumulatedUsage : void 0), action._privacyMode));
        }
        await flushPostTurnEndedWork(ctx, this.interactionListener);
        await promise2;
        await this.blobStore.flush(ctx);
        options2?.onTimings?.({
          stateDeserializationMs,
          actionHandlerMs
        });
        return fromRedactedConversationStateStructure(currentState, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      } catch (error42) {
        await drainPendingWritesOnRunStreamError(ctx, {
          pendingCheckpoints: promise2,
          flush: () => this.blobStore.flush(ctx)
        });
        throw error42;
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources38(env_1);
    }
  }
  buildSingleStepStateHandle(ctx, state, baseExecutor, trackAgentTypeChange) {
    return ConversationStateHandle.fromConversationStateStructure(ctx, this.blobStore, state, baseExecutor, this.config.formattingOptions, this.config.modelId, this.config.agentType, this.stateHandleOptions({
      shouldTrackAgentTypeChange: trackAgentTypeChange,
      loadRootPromptBlobs: true
    }));
  }
  /** Start state-handle blob loads early; setupSingleStep adopts at most once. */
  prewarmSingleStepStateHandle(parentCtx, state, actionCase) {
    const trackAgentTypeChange = this.shouldTrackAgentTypeChange(actionCase);
    const ctx = withLogAttributes(parentCtx.withName("prewarmSingleStepStateHandle"), {
      modelName: this.config.modelId,
      ...this.config.canonicalModelName !== void 0 && {
        canonicalModelName: this.config.canonicalModelName
      }
    });
    const baseExecutor = new RedactedPromptToolExecutor(this.promptSession.getExecutor(), PrivacyMode.UNSPECIFIED);
    const handlePromise = this.buildSingleStepStateHandle(ctx, state, baseExecutor, trackAgentTypeChange);
    void handlePromise.catch(() => {
    });
    this.prewarmedSingleStepStateHandle = {
      trackAgentTypeChange,
      baseExecutor,
      handlePromise
    };
    this.prewarmDiscardedBeforeSetup = false;
  }
  /**
   * Drop a prewarmed handle without adopting. When `reason` is set and a handle
   * was present, emits `cloud_agents.overlap_setup_state_handle`.
   */
  async discardPrewarmedSingleStepStateHandle(ctx, reason) {
    const prewarmed = this.prewarmedSingleStepStateHandle;
    this.prewarmedSingleStepStateHandle = void 0;
    if (prewarmed === void 0) {
      return;
    }
    this.prewarmDiscardedBeforeSetup = true;
    if (ctx !== void 0) {
      recordTurnPrepPrewarm(ctx, "discarded");
      if (reason !== void 0) {
        overlapSetupStateHandle.increment(ctx, 1, {
          outcome: "discarded",
          reason
        });
      }
    }
    await prewarmed.handlePromise.catch(() => {
    });
  }
  async setupSingleStep(parentCtx, state, action, onStateUpdate) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource38(env_3, createSpan(parentCtx.withName("setupSingleStep")), false);
      let ctx = withLogAttributes(spanCtxt.ctx, {
        action: action.action.case,
        modelName: this.config.modelId,
        ...this.config.canonicalModelName !== void 0 && {
          canonicalModelName: this.config.canonicalModelName
        }
      });
      if (this.config.conversationGroupId !== void 0) {
        ctx = ctx.with(conversationGroupIdKey2, this.config.conversationGroupId);
      }
      if (this.config.conversationId !== void 0) {
        ctx = ctx.with(conversationIdKey2, this.config.conversationId);
      }
      if (this.config.isBackground === true) {
        ctx = ctx.with(bubbleRetryableTaskErrorsKey, true);
      }
      const trackAgentTypeChange = this.shouldTrackAgentTypeChange(action.action.case);
      const prewarmed = this.prewarmedSingleStepStateHandle;
      this.prewarmedSingleStepStateHandle = void 0;
      const prewarmDiscardedBeforeSetup = this.prewarmDiscardedBeforeSetup;
      this.prewarmDiscardedBeforeSetup = false;
      const buildInlineSingleStep = async () => {
        const inlineBaseExecutor = new RedactedPromptToolExecutor(this.promptSession.getExecutor(), PrivacyMode.UNSPECIFIED);
        const inlineStateHandler = await this.buildSingleStepStateHandle(ctx, state, inlineBaseExecutor, trackAgentTypeChange);
        return {
          baseExecutor: inlineBaseExecutor,
          stateHandler: inlineStateHandler
        };
      };
      let baseExecutor;
      let stateHandler;
      if (prewarmed !== void 0 && prewarmed.trackAgentTypeChange === trackAgentTypeChange) {
        const residualWaitStartMs = performance.now();
        try {
          baseExecutor = prewarmed.baseExecutor;
          stateHandler = await prewarmed.handlePromise;
          recordTurnPrepPrewarm(ctx, "adopted", performance.now() - residualWaitStartMs);
          overlapSetupStateHandle.increment(ctx, 1, {
            outcome: "adopted",
            reason: "adopted"
          });
        } catch {
          recordTurnPrepPrewarm(ctx, "discarded");
          overlapSetupStateHandle.increment(ctx, 1, {
            outcome: "discarded",
            reason: "prewarm_build_failed"
          });
          ({ baseExecutor, stateHandler } = await buildInlineSingleStep());
        }
      } else {
        if (prewarmed !== void 0) {
          overlapSetupStateHandle.increment(ctx, 1, {
            outcome: "discarded",
            reason: "track_agent_type_change_mismatch"
          });
          await prewarmed.handlePromise.catch(() => {
          });
          recordTurnPrepPrewarm(ctx, "discarded");
        } else {
          recordTurnPrepPrewarm(ctx, prewarmDiscardedBeforeSetup ? "discarded" : "not_started");
        }
        ({ baseExecutor, stateHandler } = await buildInlineSingleStep());
      }
      if (action.action.case === void 0) {
        throw new Error("Action is required");
      }
      if (action.action.case === "startPlanAction") {
        throw new Error("startPlanAction is deprecated; use userMessageAction with UserMessage.mode = PLAN");
      }
      spanCtxt.span.setAttribute("action", action.action.case);
      const handler = this.actionHandlers.get(action.action.case);
      if (!handler) {
        throw new Error(`Unsupported action type: ${action.action.case}`);
      }
      const onStateUpdateWithFlush = async (innerCtx, innerState) => {
        const env_4 = { stack: [], error: void 0, hasError: false };
        try {
          const span = __addDisposableResource38(env_4, createSpan(innerCtx.withName("onStateUpdateWithFlush")), false);
          await this.blobStore.flush(span.ctx);
          await onStateUpdate?.(span.ctx, fromRedactedConversationStateStructure(innerState, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
        } catch (e_4) {
          env_4.error = e_4;
          env_4.hasError = true;
        } finally {
          __disposeResources38(env_4);
        }
      };
      return { ctx, baseExecutor, stateHandler, handler, onStateUpdateWithFlush };
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      __disposeResources38(env_3);
    }
  }
  /**
   * Runs a single step of the agent conversation. This is used by the cloud agent's
   * Temporal workflow which calls runStep repeatedly rather than running the full
   * turn loop in a single call.
   *
   * Unlike runStream which runs the full turn loop, this method executes exactly
   * one model invocation and returns whether there are more steps to run.
   *
   * @returns Object containing the updated state and whether a tool call was made
   */
  async runSingleStep(parentCtx, state, action, mcpTools, onStateUpdate) {
    const { ctx, baseExecutor, stateHandler, handler, onStateUpdateWithFlush } = await this.setupSingleStep(parentCtx, state, action, onStateUpdate);
    if (!this.isSingleStepHandler(handler)) {
      throw new Error(`Action handler for ${action.action.case} does not support single-step execution`);
    }
    const result = await handler.handleSingleStep(ctx, action.action.value, baseExecutor, stateHandler, mcpTools, onStateUpdateWithFlush);
    await onStateUpdateWithFlush(ctx, result.state);
    return {
      state: fromRedactedConversationStateStructure(result.state, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
      hasToolCall: result.hasToolCall
    };
  }
  getSplitStepHandler(actionCase) {
    if (actionCase !== void 0) {
      const handler = this.actionHandlers.get(actionCase);
      if (handler instanceof AbstractUserMessageActionHandler) {
        return handler;
      }
      if (handler instanceof SubscriptionNotificationActionHandler) {
        return handler.getUserMessageActionHandler();
      }
      if (handler instanceof GoalContinuationActionHandler) {
        return handler.getUserMessageActionHandler();
      }
      throw new Error(`Action handler for ${actionCase} does not support split-step execution`);
    }
    for (const handler of this.actionHandlers.values()) {
      if (handler instanceof AbstractUserMessageActionHandler) {
        return handler;
      }
    }
    throw new Error("No AbstractUserMessageActionHandler found");
  }
  async runModelStep(parentCtx, state, action, mcpTools, onStateUpdate) {
    const setupSingleStepStartMs = performance.now();
    const { ctx, baseExecutor, stateHandler, handler, onStateUpdateWithFlush } = await this.setupSingleStep(parentCtx, state, action, onStateUpdate);
    const setupSingleStepMs = performance.now() - setupSingleStepStartMs;
    if (!this.isSplitStepHandler(handler)) {
      throw new Error(`Action handler for ${action.action.case} does not support split-step execution`);
    }
    const result = await handler.handleModelStep(ctx, action.action.value, baseExecutor, stateHandler, mcpTools, onStateUpdateWithFlush);
    await onStateUpdateWithFlush(ctx, result.state);
    return {
      state: fromRedactedConversationStateStructure(result.state, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
      toolCallDescriptors: result.toolCallDescriptors,
      splitStepData: {
        ...result.splitStepData,
        actionCase: action.action.case
      },
      setupSingleStepMs
    };
  }
  async executeToolCall(parentCtx, state, descriptor2, mcpTools, splitStepData, fileOperationLockManager, onStateUpdate) {
    const env_5 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource38(env_5, createSpan(parentCtx.withName("executeToolCall")), false);
      const ctx = this.config.isBackground === true ? spanCtxt.ctx.with(bubbleRetryableTaskErrorsKey, true) : spanCtxt.ctx;
      const baseExecutor = new RedactedPromptToolExecutor(this.promptSession.getExecutor(), PrivacyMode.UNSPECIFIED);
      const stateHandler = await ConversationStateHandle.fromConversationStateStructure(ctx, this.blobStore, state, baseExecutor, this.config.formattingOptions, this.config.modelId, this.config.agentType, this.stateHandleOptions({
        shouldTrackAgentTypeChange: this.shouldTrackAgentTypeChange(splitStepData.actionCase),
        loadRootPromptBlobs: false
      }));
      const handler = this.getSplitStepHandler(splitStepData.actionCase);
      try {
        return await handler.executeToolCall(ctx, descriptor2, stateHandler, mcpTools, splitStepData, splitStepData.requestContext ?? new RequestContext(), fileOperationLockManager);
      } catch (error42) {
        if (error42 instanceof DeferredInteractionResponseError) {
          if (typeof onStateUpdate !== "function") {
            logger96.error(ctx, "executeToolCall missing onStateUpdate; cannot persist pending AskQuestion before pause");
          } else {
            try {
              const pendingState = await stateHandler.computeNewStructure(ctx);
              await onStateUpdate(ctx, fromRedactedConversationStateStructure(pendingState, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
            } catch (persistError) {
              logger96.error(ctx, "Failed to persist pending AskQuestion before pause", {
                error: persistError
              });
            }
          }
        }
        throw error42;
      }
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      __disposeResources38(env_5);
    }
  }
  async prepareSubagent(parentCtx, state, descriptor2, mcpTools, splitStepData, fileOperationLockManager) {
    const env_6 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource38(env_6, createSpan(parentCtx.withName("prepareSubagent")), false);
      const ctx = spanCtxt.ctx;
      const baseExecutor = new RedactedPromptToolExecutor(this.promptSession.getExecutor(), PrivacyMode.UNSPECIFIED);
      const stateHandler = await ConversationStateHandle.fromConversationStateStructure(ctx, this.blobStore, state, baseExecutor, this.config.formattingOptions, this.config.modelId, this.config.agentType, this.stateHandleOptions({
        shouldTrackAgentTypeChange: this.shouldTrackAgentTypeChange(splitStepData.actionCase),
        loadRootPromptBlobs: true
      }));
      const handler = this.getSplitStepHandler(splitStepData.actionCase);
      return handler.prepareSubagent(ctx, descriptor2, stateHandler, mcpTools, splitStepData, splitStepData.requestContext ?? new RequestContext(), fileOperationLockManager);
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      __disposeResources38(env_6);
    }
  }
  async finalizeStep(parentCtx, state, splitStepData, toolCallResults, _mcpTools, onStateUpdate) {
    const env_7 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource38(env_7, createSpan(parentCtx.withName("finalizeStep")), false);
      const ctx = spanCtxt.ctx;
      const baseExecutor = new RedactedPromptToolExecutor(this.promptSession.getExecutor(), PrivacyMode.UNSPECIFIED);
      const shouldSkipFinalizeRootPromptBlobs = !finalizeNeedsRootPrompt(this.config);
      finalizeRootPromptRestoreMode.increment(ctx, 1, {
        mode: shouldSkipFinalizeRootPromptBlobs ? "skipped" : "loaded"
      });
      const stateHandler = await ConversationStateHandle.fromConversationStateStructure(ctx, this.blobStore, state, baseExecutor, this.config.formattingOptions, this.config.modelId, this.config.agentType, this.stateHandleOptions({
        shouldTrackAgentTypeChange: this.shouldTrackAgentTypeChange(splitStepData.actionCase),
        loadRootPromptBlobs: !shouldSkipFinalizeRootPromptBlobs
      }));
      const onStateUpdateWithFlush = async (innerCtx, innerState) => {
        const env_8 = { stack: [], error: void 0, hasError: false };
        try {
          const span = __addDisposableResource38(env_8, createSpan(innerCtx.withName("onStateUpdateWithFlush")), false);
          await onStateUpdate?.(span.ctx, fromRedactedConversationStateStructure(innerState, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
          await this.blobStore.flush(span.ctx);
        } catch (e_8) {
          env_8.error = e_8;
          env_8.hasError = true;
        } finally {
          __disposeResources38(env_8);
        }
      };
      const handler = this.getSplitStepHandler(splitStepData.actionCase);
      const result = await handler.finalizeStep(ctx, splitStepData, toolCallResults, baseExecutor, stateHandler, onStateUpdateWithFlush);
      await onStateUpdateWithFlush(ctx, result.state);
      return {
        state: fromRedactedConversationStateStructure(result.state, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
        hasToolCall: result.hasToolCall
      };
    } catch (e_7) {
      env_7.error = e_7;
      env_7.hasError = true;
    } finally {
      __disposeResources38(env_7);
    }
  }
  /**
   * True when the conversation is large enough that the caller should kick
   * off a standalone background summarization (token-only threshold; same
   * threshold that starts the IDE's in-process background summarization).
   */
  shouldPrecomputeSummary(tokenDetails) {
    return this.orchestrator.shouldStartBackgroundSummarization(tokenDetails, []);
  }
  /**
   * Runs the existing blocking summarization path against a snapshot
   * conversation state and returns the summarized state, without mutating any
   * live state and without emitting any UI updates (a no-op interaction
   * listener swallows the summaryStarted/summaryCompleted updates the
   * blocking path sends).
   *
   * Used by cloud agents to compute a summarization off the turn's critical
   * path: the caller persists the returned state as a blob and a later model
   * step swaps it in after validating the snapshot still prefixes the live
   * conversation. Everything below this method is the unmodified
   * {@link SummarizationOrchestrator.handleSummarization} flow — including
   * its WaitForCompletion error policy: a non-abort summarizer error persists
   * the deterministically generated fallback summary (exactly what the
   * blocking path would summarize with at the threshold), while an abort
   * discards and returns undefined.
   *
   * Returns undefined when the summarization produced no summary (e.g. it was
   * discarded on error).
   */
  async computeSummarizedConversationState(parentCtx, state, requestContext) {
    const env_9 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource38(env_9, createSpan(parentCtx.withName("computeSummarizedConversationState")), false);
      const ctx = spanCtxt.ctx;
      const noopInteractionListener = {
        sendUpdate: async () => {
        },
        query: () => Promise.reject(new Error("Interaction queries are not supported during summarization"))
      };
      const baseExecutor = new RedactedPromptToolExecutor(this.promptSession.getExecutor(), PrivacyMode.UNSPECIFIED);
      const stateHandler = await ConversationStateHandle.fromConversationStateStructure(ctx, this.blobStore, state, baseExecutor, this.config.formattingOptions, this.config.modelId, this.config.agentType, { shouldTrackAgentTypeChange: false });
      const summary = await this.orchestrator.handleSummarization(ctx, stateHandler, baseExecutor, noopInteractionListener, this.config, requestContext, {
        backgroundSummarizationMode: BackgroundSummarizationMode.WaitForCompletion,
        triggerReason: "approaching_token_limit",
        resourceAccessor: this.resourceAccessor,
        // The summarization runs off-pod, without tool/VM context, so the
        // external summarizer is the only valid choice.
        forceExternalModel: true,
        currentInvocationId: stateHandler.lastStepInvocationId
      });
      if (summary === void 0) {
        return void 0;
      }
      const estimatedUsedTokens = estimateTokenCount2(baseExecutor.getMessages());
      stateHandler.setTokenDetails(createRedactedConversationTokenDetails(stateHandler.getPrivacyMode(), {
        usedTokens: estimatedUsedTokens,
        maxTokens: stateHandler.tokenDetails.maxTokens,
        breakdown: void 0,
        promptContextUsageTree: void 0
      }));
      const newState = await stateHandler.computeNewStructure(ctx);
      return fromRedactedConversationStateStructure(newState, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    } catch (e_9) {
      env_9.error = e_9;
      env_9.hasError = true;
    } finally {
      __disposeResources38(env_9);
    }
  }
  isSingleStepHandler(handler) {
    return "handleSingleStep" in handler;
  }
  isSplitStepHandler(handler) {
    return "handleModelStep" in handler;
  }
};
