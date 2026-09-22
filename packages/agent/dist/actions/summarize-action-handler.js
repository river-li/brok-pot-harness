/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/summarize-action-handler.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
init_agent_pb();
var logger70 = createLogger("@anysphere/agent:summarize");
function summarizedConversationCharCount(messages2) {
  let total = 0;
  for (const message of messages2) {
    if (message.role !== "user" || message.providerOptions?.cursor?.isSummary !== true) {
      continue;
    }
    total += extractTextContent(message).length;
  }
  return total;
}
var SummarizeActionHandler = class {
  constructor(config2, resourceAccessor, interactionListener, orchestrator, conversationActionReceiver) {
    this.config = config2;
    this.resourceAccessor = resourceAccessor;
    this.interactionListener = interactionListener;
    this.orchestrator = orchestrator;
    this.conversationActionReceiver = conversationActionReceiver;
  }
  async handle(ctx, _action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const hasAnyMessages = rootPromptExecutor.getMessages().length > 0;
    if (!hasAnyMessages) {
      return await stateHandler.computeNewStructure(ctx);
    }
    const hasSystem = rootPromptExecutor.getMessages().some((m2) => m2.role === "system");
    if (!hasSystem) {
      const requestContext2 = await getRequestContext(ctx, void 0, this.resourceAccessor, buildRequestContextOptions(this.config));
      const toolSetHandle = this.config.toolsGenerator({
        resourceAccessor: this.resourceAccessor,
        stateHandler,
        agentSessionId: this.config.agentSessionId,
        mcpTools: [],
        repositoryInfos: requestContext2.repositoryInfo,
        blobStore: stateHandler.getBlobStore(),
        mode: stateHandler.mode ?? AgentMode.AGENT,
        loggingContext: ctx,
        requestContext: requestContext2,
        fileOperationLockManager: new FileOperationLockManager(),
        smartModeClassifierMode: this.config.smartModeClassifierMode,
        smartModeClassifierShadowMode: this.config.smartModeClassifierShadowMode,
        autoRejectFirstAskQuestion: this.config.autoRejectFirstAskQuestion
      });
      rootPromptExecutor.appendMessages(toRedactedCoreMessages([
        {
          role: "system",
          content: this.config.systemPromptGenerator({
            cursorRules: [],
            mode: stateHandler.mode ?? AgentMode.AGENT
          }, toolSetHandle)
        }
      ], stateHandler.getPrivacyMode()));
    }
    const requestContext = await getRequestContext(ctx, void 0, this.resourceAccessor, buildRequestContextOptions(this.config));
    const automationTriggerContext = this.config.automationInstructions !== void 0 ? extractAutomationTriggerContext(rootPromptExecutor.getMessages()) : void 0;
    if (this.config.summarizeActionMode === "threshold") {
      return await this.launchThresholdShapedSummary(ctx, stateHandler, rootPromptExecutor, mcpTools, requestContext, automationTriggerContext);
    }
    const summary = await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
      fullSummarization: true,
      backgroundSummarizationMode: BackgroundSummarizationMode.WaitForCompletion,
      triggerReason: "force_option",
      resourceAccessor: this.resourceAccessor,
      automationTriggerContext
    });
    if (!summary) {
      throw new Error("No summary generated, even though background summarization mode is WaitForCompletion");
    }
    stateHandler.setSummary(createRedactedConversationSummary(stateHandler.getPrivacyMode(), {
      summary
    }));
    await this.interactionListener.sendUpdate(ctx, RedactedUpdates.summary(summary));
    if (this.config.summarizeActionClearTurns) {
      await stateHandler.clearTurns();
    }
    const postSummarizeMessages = rootPromptExecutor.getMessages();
    const estimatedUsedTokens = estimateTokenCount2(postSummarizeMessages);
    const previousRedactedBreakdown = stateHandler.tokenDetails.breakdown;
    const refreshedBreakdown = previousRedactedBreakdown !== void 0 ? toRedactedPromptTokenBreakdownSnapshot(buildSummarizeRefreshSnapshot({
      previousSnapshot: fromRedactedPromptTokenBreakdownSnapshot(previousRedactedBreakdown, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
      newSummarizedConversationCharCount: summarizedConversationCharCount(postSummarizeMessages),
      totalUsedTokens: estimatedUsedTokens,
      maxTokens: stateHandler.tokenDetails.maxTokens
    }), stateHandler.getPrivacyMode()) : previousRedactedBreakdown;
    stateHandler.setTokenDetails(createRedactedConversationTokenDetails(stateHandler.getPrivacyMode(), {
      usedTokens: estimatedUsedTokens,
      maxTokens: stateHandler.tokenDetails.maxTokens,
      breakdown: refreshedBreakdown,
      promptContextUsageTree: void 0
    }));
    if (onStateUpdate) {
      if (this.config.fireAndForgetCheckpoints) {
        void stateHandler.computeNewStructure(ctx).then(async (checkpoint) => {
          await onStateUpdate(ctx, checkpoint);
        }).catch((error42) => {
          logger70.error(ctx, "Failed to persist summarization checkpoint", {
            error: error42
          });
        });
      } else {
        const checkpoint = await stateHandler.computeNewStructure(ctx);
        await onStateUpdate(ctx, checkpoint);
      }
    }
    return await stateHandler.computeNewStructure(ctx);
  }
  /**
   * Start the same background summarization the token threshold would start
   * (partial layout, the turn's tool set, self-summary when the model
   * supports it) and wait for it here, so a completed summary persists
   * through this run's own checkpoint like a turn persisting one. If the
   * run is cancelled first, only the wait stops: the generation runs on
   * detached and is handed off the way a turn end does, so the
   * pending-summary store stashes it for the next request to adopt.
   */
  async launchThresholdShapedSummary(ctx, stateHandler, rootPromptExecutor, mcpTools, requestContext, automationTriggerContext) {
    const { tools, extraT, descriptionProps } = await buildSummarizationToolContext({
      ctx,
      config: this.config,
      toolsGenerator: this.config.toolsGenerator,
      resourceAccessor: this.resourceAccessor,
      stateHandler,
      mode: stateHandler.mode ?? AgentMode.AGENT,
      mcpTools,
      repositoryInfos: requestContext.repositoryInfo,
      requestContext,
      fileOperationLockManager: new FileOperationLockManager(),
      contextInjectionSignal: this.conversationActionReceiver.getContextInjectionToolSignal?.()
    });
    const options2 = {
      triggerReason: "idle_timer",
      currentInvocationId: stateHandler.lastStepInvocationId,
      resourceAccessor: this.resourceAccessor,
      automationTriggerContext,
      tools,
      extraT,
      descriptionProps
    };
    await this.orchestrator.handleSummarization(ctx.withDetached(), stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
      ...options2,
      backgroundSummarizationMode: BackgroundSummarizationMode.Background
    });
    const launched = stateHandler.backgroundSummarizationPromiseInfo;
    const token = stateHandler.backgroundSummarizationCancellationToken;
    if (launched === null || token === null) {
      return await stateHandler.computeNewStructure(ctx);
    }
    const completed = await settledUnlessAborted(launched.promise, ctx.signal);
    if (completed !== void 0 && completed.hadError !== true && stateHandler.backgroundSummarizationPromiseInfo === launched) {
      await this.orchestrator.handleSummarization(ctx, stateHandler, rootPromptExecutor, this.interactionListener, this.config, requestContext, {
        ...options2,
        backgroundSummarizationMode: BackgroundSummarizationMode.WaitForCompletionIfStarted
      });
      return await stateHandler.computeNewStructure(ctx);
    }
    launched.promise.catch((error42) => {
      logger70.error(ctx, "Idle background summarization failed", {
        error: error42,
        model: launched.modelId
      });
    }).finally(() => {
      token.cancelled = true;
      token.onCancelled?.();
    });
    return await stateHandler.computeNewStructure(ctx);
  }
};

