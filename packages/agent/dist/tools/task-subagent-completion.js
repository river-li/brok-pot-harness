init_dist4();
init_agent_pb();
var logger71 = createLogger("task-subagent-completion");
async function processSubagentIterationSuccess(currentState, turnsAtStartOfIteration, iterState, completionCtx, deps, persistState, subagentType) {
  const { ctx, blobStore, registry: registry2 } = deps;
  const { subagentId, subagentRequestId, toolCallId, typeName, overriddenModelId, executionStartTime } = completionCtx;
  const runStreamDurationMs = Date.now() - executionStartTime;
  logger71.info(ctx, "Subagent runStream completed", {
    toolCallId,
    subagentType: typeName,
    durationMs: runStreamDurationMs,
    finalTurnsCount: currentState.turns.length,
    loopCount: iterState.loopCount,
    subagentId,
    subagentRequestId
  });
  persistState(ctx, subagentId, subagentType, new SubagentPersistedState({
    conversationState: currentState,
    modelId: overriddenModelId
  }));
  logger71.info(ctx, "Persisted subagent state", {
    toolCallId,
    subagentType: typeName,
    subagentId,
    subagentRequestId
  });
  const newTurns = currentState.turns.slice(turnsAtStartOfIteration);
  const lastAssistant = await extractLastAssistantMessage(ctx, newTurns, blobStore, {
    toolCallId,
    subagentType: typeName,
    turnsOffset: turnsAtStartOfIteration
  });
  const toolCallCount2 = await countToolCallsFromTurns(ctx, newTurns, blobStore);
  const totalDurationMs = Date.now() - executionStartTime;
  if (lastAssistant === void 0) {
    logger71.warn(ctx, "Subagent completed without an assistant message", {
      toolCallId,
      subagentType: typeName,
      durationMs: totalDurationMs,
      newTurnsCount: newTurns.length,
      totalTurnsCount: currentState.turns.length,
      toolCallCount: toolCallCount2,
      subagentId,
      subagentRequestId
    });
  }
  logger71.info(ctx, "Subagent runStream iteration completed", {
    toolCallId,
    subagentType: typeName,
    durationMs: totalDurationMs,
    newTurnsCount: newTurns.length,
    totalTurnsCount: currentState.turns.length,
    lastAssistantLength: lastAssistant?.length ?? 0,
    loopCount: iterState.loopCount,
    subagentId,
    subagentRequestId
  });
  let followupMessage;
  try {
    followupMessage = await executeSubagentStopHook({
      ...deps.hookContext,
      status: "completed",
      durationMs: totalDurationMs,
      messageCount: currentState.turns.length,
      toolCallCount: toolCallCount2,
      summary: lastAssistant,
      loopCount: iterState.loopCount,
      task: completionCtx.rawArgsPrompt,
      description: completionCtx.rawArgsDescription
    });
    iterState.subagentStopCalled = true;
  } catch (hookError) {
    iterState.subagentStopCalled = true;
    logger71.error(ctx, "Error executing subagentStop hook (success case)", hookError, {
      toolCallId,
      subagentType: typeName,
      subagentId,
      subagentRequestId
    });
  }
  if (followupMessage !== void 0 && followupMessage.length > 0) {
    logger71.info(ctx, "SubagentStop hook returned followup message, continuing subagent", {
      toolCallId,
      subagentType: typeName,
      loopCount: iterState.loopCount + 1,
      followupMessageLength: followupMessage.length,
      subagentId,
      subagentRequestId
    });
    iterState.loopCount++;
    const nextAction = buildFollowupAction({
      followupMessage,
      toolCallId,
      loopCount: iterState.loopCount,
      useAskMode: completionCtx.useAskModeForSubagent,
      selectedContext: completionCtx.selectedContext
    });
    return { shouldContinue: true, nextAction };
  }
  return buildFinalResult(currentState, iterState, completionCtx, deps);
}
function buildFollowupAction({ followupMessage, toolCallId, loopCount, useAskMode, selectedContext }) {
  return new ConversationAction({
    action: {
      case: "userMessageAction",
      value: new UserMessageAction({
        userMessage: new UserMessage({
          text: followupMessage,
          messageId: generateSeededUuid(`${toolCallId}-followup-${loopCount}`),
          mode: useAskMode ? AgentMode.ASK : AgentMode.AGENT,
          selectedContext
        })
      })
    }
  });
}
async function buildFinalResult(currentState, _iterState, completionCtx, deps) {
  const { ctx, blobStore, registry: registry2 } = deps;
  const { subagentId, analyticsSubagentType, overriddenModelId, effectiveReadonly, isParallel, initialTurnsCount, executionStartTime, toolCallId, parentModelName, resultSuffix, plugin, marketplace, pluginId, marketplaceId } = completionCtx;
  const allNewTurns = currentState.turns.slice(initialTurnsCount);
  const { conversationSteps: allConversationSteps, toolCallCount: finalToolCallCount } = await collectConversationStepsWithToolCallCount(ctx, allNewTurns, blobStore);
  const finalDurationMs = Date.now() - executionStartTime;
  const eventTracker = getAgentEventTracker(ctx);
  eventTracker.trackSubagentCompleted(ctx, {
    subagentType: analyticsSubagentType,
    subagentModel: overriddenModelId,
    parentModel: parentModelName,
    status: "success",
    durationMs: finalDurationMs,
    messageCount: allNewTurns.length,
    toolCallCount: finalToolCallCount,
    isReadonly: effectiveReadonly,
    isParallel,
    toolCallId,
    plugin,
    marketplace,
    pluginId,
    marketplaceId
  });
  registry2.cleanup(subagentId);
  const successResult = new TaskResult({
    result: {
      case: "success",
      value: new TaskSuccess({
        conversationSteps: allConversationSteps,
        agentId: subagentId,
        durationMs: BigInt(finalDurationMs),
        resultSuffix
      })
    }
  });
  if (deps.enableTaskToolHooksExec) {
    try {
      await executeRemotePostToolUseHook({
        ctx,
        toolName: deps.toolName,
        toolInput: deps.postToolUseHookInput,
        toolOutput: JSON.stringify({
          status: "success",
          agentId: subagentId,
          durationMs: finalDurationMs,
          messageCount: allNewTurns.length,
          toolCallCount: finalToolCallCount
        }),
        durationMs: finalDurationMs,
        requestContext: {
          toolCallId,
          model: overriddenModelId
        },
        options: {
          resourceAccessor: deps.resourceAccessor,
          enableExecuteHookExec: deps.enableTaskToolHooksExec,
          configuredSteps: deps.configuredSteps
        }
      });
    } catch (hookError) {
      logger71.error(ctx, "Error executing postToolUse hook", hookError, {
        toolCallId,
        subagentType: completionCtx.typeName,
        subagentId
      });
    }
  }
  return { shouldContinue: false, finalResult: successResult };
}
async function handleSubagentRunStreamError(runStreamError, currentState, iterState, completionCtx, deps, subagentCtxCanceled, abortOptions) {
  const { ctx } = deps;
  const { subagentId, subagentRequestId, toolCallId, typeName, overriddenModelId, executionStartTime } = completionCtx;
  const durationMs = Date.now() - executionStartTime;
  const isIntentionalAbort = subagentCtxCanceled && abortOptions?.intentional === true;
  const logData = {
    toolCallId,
    subagentType: typeName,
    modelId: overriddenModelId,
    durationMs,
    subagentId,
    subagentRequestId,
    intentionalAbort: isIntentionalAbort,
    abortReason: abortOptions?.reason,
    errorName: runStreamError instanceof Error ? runStreamError.name : "unknown",
    errorMessage: runStreamError instanceof Error ? runStreamError.message : String(runStreamError),
    errorStack: runStreamError instanceof Error ? runStreamError.stack : void 0
  };
  if (isIntentionalAbort) {
    logger71.info(ctx, "Subagent runStream aborted (intentional cancellation)", logData);
  } else {
    logger71.error(ctx, "Subagent runStream failed with exception", runStreamError, logData);
  }
  try {
    await executeSubagentStopHook({
      ...deps.hookContext,
      status: "error",
      durationMs,
      messageCount: currentState.turns.length,
      toolCallCount: 0,
      errorMessage: runStreamError instanceof Error ? runStreamError.message : String(runStreamError),
      loopCount: iterState.loopCount,
      task: completionCtx.rawArgsPrompt,
      description: completionCtx.rawArgsDescription
    });
    iterState.subagentStopCalled = true;
  } catch (hookError) {
    iterState.subagentStopCalled = true;
    logger71.error(ctx, "Error executing subagentStop hook (error case)", hookError, {
      toolCallId,
      subagentType: typeName,
      subagentId,
      subagentRequestId
    });
  }
  throw runStreamError;
}
async function handleSubagentExecutionError(error42, state, iterState, completionCtx, deps, subagentCtxCanceled, abortOptions) {
  const { ctx, registry: registry2 } = deps;
  const { subagentId, subagentRequestId, toolCallId, typeName, analyticsSubagentType, overriddenModelId, effectiveReadonly, isParallel, executionStartTime, parentModelName, plugin, marketplace, pluginId, marketplaceId } = completionCtx;
  const durationMs = Date.now() - executionStartTime;
  const isIntentionalTaskAbort = subagentCtxCanceled && abortOptions?.intentional === true;
  const taskErrorLogData = {
    toolCallId,
    subagentType: typeName,
    durationMs,
    subagentId,
    subagentRequestId,
    intentionalAbort: isIntentionalTaskAbort,
    abortReason: abortOptions?.reason,
    errorName: error42 instanceof Error ? error42.name : "unknown",
    errorMessage: error42 instanceof Error ? error42.message : String(error42),
    errorStack: error42 instanceof Error ? error42.stack : void 0,
    taskErrorShape: buildTaskErrorShapeSnapshot(error42)
  };
  if (isIntentionalTaskAbort) {
    logger71.info(ctx, "Task tool execution aborted (intentional cancellation)", taskErrorLogData);
  } else {
    logger71.error(ctx, "Task tool execution failed with exception", error42, taskErrorLogData);
  }
  if (iterState.runStreamCompleted && !iterState.subagentStopCalled && subagentId !== void 0 && overriddenModelId !== void 0) {
    try {
      await executeSubagentStopHook({
        ...deps.hookContext,
        status: "error",
        durationMs,
        messageCount: state?.turns.length ?? 0,
        toolCallCount: 0,
        errorMessage: error42 instanceof Error ? error42.message : String(error42),
        loopCount: iterState.loopCount,
        task: completionCtx.rawArgsPrompt,
        description: completionCtx.rawArgsDescription
      });
    } catch (hookError) {
      logger71.error(ctx, "Error executing subagentStop hook (post-execution error case)", hookError, {
        toolCallId,
        subagentType: typeName,
        subagentId,
        subagentRequestId
      });
    }
  }
  const eventTracker = getAgentEventTracker(ctx);
  eventTracker.trackSubagentCompleted(ctx, {
    subagentType: analyticsSubagentType,
    subagentModel: overriddenModelId,
    parentModel: parentModelName,
    status: "error",
    durationMs,
    messageCount: state?.turns.length ?? 0,
    toolCallCount: 0,
    isReadonly: effectiveReadonly,
    isParallel,
    toolCallId,
    plugin,
    marketplace,
    pluginId,
    marketplaceId
  });
  registry2.cleanup(subagentId);
  if (deps.enableTaskToolHooksExec) {
    try {
      await executeRemotePostToolUseFailureHook({
        ctx,
        toolName: deps.toolName,
        toolInput: deps.postToolUseHookInput,
        errorMessage: error42 instanceof Error ? error42.message : String(error42),
        failureType: "error",
        durationMs,
        isInterrupt: false,
        requestContext: {
          toolCallId,
          model: overriddenModelId
        },
        options: {
          resourceAccessor: deps.resourceAccessor,
          enableExecuteHookExec: deps.enableTaskToolHooksExec,
          configuredSteps: deps.configuredSteps
        }
      });
    } catch (hookError) {
      logger71.error(ctx, "Error executing postToolUseFailure hook", hookError, {
        toolCallId,
        subagentType: typeName,
        subagentId
      });
    }
  }
  if (shouldBubbleTaskErrorToOuterRetryLayer(ctx, error42, iterState.runStreamCompleted)) {
    const err = error42 instanceof Error ? error42 : new Error(String(error42));
    throw new RetryableToolOrchestrationError(err.message, { cause: err });
  }
  const classifiedTaskError = classifyTaskProviderError(error42);
  if (classifiedTaskError !== void 0) {
    throw classifiedTaskError;
  }
  throw error42;
}
