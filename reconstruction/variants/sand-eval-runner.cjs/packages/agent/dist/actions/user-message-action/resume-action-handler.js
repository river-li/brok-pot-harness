/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/user-message-action/resume-action-handler.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist();

// @recovered-fragment 2/2
var __addDisposableResource41 = function(env, value, async) {
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
var __disposeResources41 = /* @__PURE__ */ (function(SuppressedError2) {
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
var ResumeActionHandler = class extends AbstractUserMessageActionHandler {
  async executePendingToolCalls(ctx, rootPromptExecutor, stateHandler, mergedMcpTools, requestContext, invocationId) {
    const pendingMessages = stateHandler.getRawPendingMessages();
    if (pendingMessages.length === 0) {
      return false;
    }
    if (stateHandler.turns.length === 0) {
      return false;
    }
    const lastTurnRef = stateHandler.turns[stateHandler.turns.length - 1];
    const turn = await lastTurnRef.get(ctx);
    if (!(turn instanceof AgentConversationTurnHandle)) {
      throw new Error("Expected last turn to be an agent turn");
    }
    const interactionHandler = new InteractionHandler(
      toUnredactedInteractionListener(this.interactionListener, stateHandler.getPrivacyMode()),
      turn,
      invocationId,
      void 0,
      // overrideSignal
      this.config.thinkingStyle,
      resolveAgentSingleMessageLoopDetection(this.config)
    );
    const mode = (await turn.userMessage.get(ctx)).mode;
    const fileOperationLockManager = new FileOperationLockManager();
    const toolSetHandle = this.config.toolsGenerator({
      resourceAccessor: this.resourceAccessor,
      stateHandler,
      agentSessionId: this.config.agentSessionId,
      mcpTools: mergedMcpTools,
      repositoryInfos: requestContext.repositoryInfo,
      blobStore: stateHandler.getBlobStore(),
      mode,
      loggingContext: ctx,
      requestContext,
      fileOperationLockManager,
      smartModeClassifierMode: this.config.smartModeClassifierMode,
      smartModeClassifierShadowMode: this.config.smartModeClassifierShadowMode,
      autoRejectFirstAskQuestion: this.config.autoRejectFirstAskQuestion
    });
    const pending = splitPendingMessages(pendingMessages.map((p2) => JSON.parse(p2.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED))));
    if (pending === void 0) {
      throw new Error("No assistant message to resume from");
    }
    const { messages, lastMessage, completedToolResults } = pending;
    const contracts = readPendingToolExecutionContracts(lastMessage);
    const { allowedToolNames, admittedEffectiveToolNames } = collectPendingToolAdmission({
      contracts: contracts.values()
    });
    const modelVisibleTools = toolSetHandle.getStaticTools();
    const scopedModelVisibleTools = allowedToolNames === void 0 ? modelVisibleTools : modelVisibleTools.filter((tool) => allowedToolNames.has(tool.name) || admittedEffectiveToolNames.has(tool.name));
    const toolExecutionSet = toolSetHandle.getToolExecutionSet(scopedModelVisibleTools);
    const executableTools = getExecutableTools(toolExecutionSet);
    const directDynamicToolNames = getDirectDynamicToolNames(toolExecutionSet);
    const toolMap = {};
    for (const tool of executableTools) {
      toolMap[tool.name] = tool;
    }
    const renderProps = {
      allTools: extractToolMetadataMap(executableTools),
      blobStore: stateHandler.getBlobStore()
    };
    const executePending = async (recordingCtx) => {
      const toolPromises = [];
      if (Array.isArray(lastMessage.content)) {
        for (const content of lastMessage.content) {
          if (content.type !== "tool-call")
            continue;
          const completedResult = completedToolResults.get(content.toolCallId);
          if (completedResult !== void 0) {
            toolPromises.push(Promise.resolve(completedResult));
            continue;
          }
          const contract = contracts.get(content.toolCallId);
          const descriptor2 = resolveDescriptorForPendingToolCall({
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
            contract,
            toolExecutionSet
          });
          const effectiveToolName = descriptor2.effectiveNativeToolCall?.toolName ?? descriptor2.toolName;
          const tool = toolMap[effectiveToolName];
          if (contract !== void 0 && tool !== void 0) {
            const validation = validatePendingToolContractIdentity({
              contract,
              tool,
              descriptor: descriptor2,
              directDynamicToolNames
            });
            if (!validation.ok) {
              toolPromises.push(Promise.resolve(createPendingToolContractMismatchResult(descriptor2, validation.reason)));
              continue;
            }
          }
          const conflictNoticesEnabled = this.config.featureFlags?.enableAgentStoreConflictNotices === true;
          toolPromises.push(executeDeferredToolCall(tool?.toolIdentifier === "TASK" ? recordingCtx.with(pendingSubagentReplayKey, {
            toolCallId: content.toolCallId
          }) : recordingCtx, descriptor2, toolMap, interactionHandler, {
            repositoryInfos: requestContext.repositoryInfo,
            stateHandler,
            workspacePaths: requestContext.env?.workspacePaths,
            // Mirror split-step deferred contexts so resume still runs eager
            // same-write decoration and post-tool journal drain on structured writes.
            enableHookAdditionalContext: this.config.featureFlags?.enableHookAdditionalContext === true,
            enableAgentStoreConflictNoticeCollector: conflictNoticesEnabled,
            enableAgentStoreConflictNotices: conflictNoticesEnabled,
            writeBarrierTimeoutMs: this.resolveWriteBarrierTimeoutMs(),
            onWriteBarrier: this.config.recordAgentStoreWriteBarrier
          }, async () => {
          }, renderProps, void 0, void 0, directDynamicToolNames));
        }
      }
      return Promise.all(toolPromises);
    };
    const toolResults = await (rootPromptExecutor.runWithToolCallEventRecorder?.(ctx, executePending) ?? executePending(ctx));
    messages.push(...toolResults);
    if (shouldTagToolCallIdsForCurrentContext(ctx)) {
      appendToolCallIdTagsToToolResults(messages);
    }
    turn.appendPromptMessages(toRedactedCoreMessages(messages, stateHandler.getPrivacyMode()));
    return true;
  }
  async handle(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource41(env_1, createSpan(parentCtx.withName("ResumeActionHandler.handle")), false);
      const ctx = span.ctx;
      const invocationId = getInvocationId(ctx);
      span.span.setAttribute("invocationId", invocationId);
      const requestContext = await getRequestContext(ctx, action.requestContext ? fromRedactedRequestContext(action.requestContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0, this.resourceAccessor, buildRequestContextOptions(this.config));
      const mergedMcpTools = this.mergeRequestContextTools(mcpTools, requestContext.tools);
      const completedPendingTools = await this.executePendingToolCalls(ctx, rootPromptExecutor, stateHandler, mergedMcpTools, requestContext, invocationId);
      if (completedPendingTools) {
        await onStateUpdate(ctx, await stateHandler.computeNewStructure(ctx));
        ctx.signal.throwIfAborted();
      }
      if (stateHandler.turns.length === 0) {
        return await stateHandler.computeNewStructure(ctx);
      }
      const lastTurnRef = stateHandler.turns[stateHandler.turns.length - 1];
      const maybeTurn = await lastTurnRef.get(ctx);
      if (!(maybeTurn instanceof AgentConversationTurnHandle)) {
        throw new Error("Expected last turn to be an agent turn");
      }
      const turn = maybeTurn;
      await this.runTurnLoop(ctx, rootPromptExecutor, stateHandler, turn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo, requestContext, onStateUpdate);
      return await stateHandler.computeNewStructure(ctx);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources41(env_1);
    }
  }
  async setupResumeStep(ctx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const invocationId = getInvocationId(ctx);
    const { requestContext, provenance: requestContextProvenance } = await resolveRequestContext({
      parentCtx: ctx,
      maybeRequestContext: action.requestContext ? fromRedactedRequestContext(action.requestContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0,
      resources: this.resourceAccessor,
      options: buildRequestContextOptions(this.config)
    });
    const mergedMcpTools = this.mergeRequestContextTools(mcpTools, requestContext.tools);
    const completedPendingTools = await this.executePendingToolCalls(ctx, rootPromptExecutor, stateHandler, mergedMcpTools, requestContext, invocationId);
    if (completedPendingTools) {
      await onStateUpdate(ctx, await stateHandler.computeNewStructure(ctx));
      ctx.signal.throwIfAborted();
    }
    if (stateHandler.turns.length === 0) {
      return { noTurns: true };
    }
    const lastTurnRef = stateHandler.turns[stateHandler.turns.length - 1];
    const maybeTurn = await lastTurnRef.get(ctx);
    if (!(maybeTurn instanceof AgentConversationTurnHandle)) {
      throw new Error("Expected last turn to be an agent turn");
    }
    return {
      turn: maybeTurn,
      mergedMcpTools,
      requestContext,
      requestContextProvenance
    };
  }
  async handleSingleStep(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource41(env_2, createSpan(parentCtx.withName("ResumeActionHandler.handleSingleStep")), false);
      const ctx = span.ctx;
      span.span.setAttribute("invocationId", getInvocationId(ctx));
      const setup = await this.setupResumeStep(ctx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate);
      if ("noTurns" in setup) {
        return {
          state: await stateHandler.computeNewStructure(ctx),
          hasToolCall: false
        };
      }
      const { turn, mergedMcpTools, requestContext } = setup;
      const { hasToolCall } = await this.runSingleStep(ctx, rootPromptExecutor, stateHandler, turn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo, requestContext, onStateUpdate);
      return {
        state: await stateHandler.computeNewStructure(ctx),
        hasToolCall
      };
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources41(env_2);
    }
  }
  async handleModelStep(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource41(env_3, createSpan(parentCtx.withName("ResumeActionHandler.handleModelStep")), false);
      const ctx = span.ctx;
      span.span.setAttribute("invocationId", getInvocationId(ctx));
      const setup = await this.setupResumeStep(ctx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate);
      if ("noTurns" in setup) {
        return {
          state: await stateHandler.computeNewStructure(ctx),
          toolCallDescriptors: [],
          splitStepData: { modelResponseMessages: [] }
        };
      }
      const { turn, mergedMcpTools, requestContext, requestContextProvenance } = setup;
      const { toolCallDescriptors, splitStepData } = await this.runModelStep(ctx, rootPromptExecutor, stateHandler, turn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo, requestContext, onStateUpdate);
      return {
        state: await stateHandler.computeNewStructure(ctx),
        toolCallDescriptors,
        splitStepData: {
          ...splitStepData,
          requestContextProvenance
        }
      };
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      __disposeResources41(env_3);
    }
  }
};

