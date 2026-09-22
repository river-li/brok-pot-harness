/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/remote-hooks.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();
init_exec_pb();
init_hooks_pb();
init_requested_model_pb();
init_esm();

// @recovered-fragment 2/2
var logger15 = createLogger("remote-hooks");
function safeBuildRemoteHookContexts(ctx, toolName, toolCallId, hookEventName, additionalContext) {
  try {
    return createHookAdditionalContexts({
      hookEventName,
      additionalContext
    });
  } catch (error42) {
    if (error42 instanceof HookAdditionalContextTooLargeError) {
      logger15.warn(ctx, `${hookEventName} additional_context exceeded max size; dropping carrier`, {
        toolName,
        toolCallId,
        hookEventName,
        actualLength: error42.actualLength,
        maxLength: error42.maxLength
      });
      return [];
    }
    throw error42;
  }
}
var remoteHookDuration = createHistogram("remote_hook.duration_ms", {
  description: "Duration of remote hook execution in milliseconds",
  labelNames: ["hook_type", "outcome"]
});
var remoteHookCount = createCounter("remote_hook.count", {
  description: "Count of remote hook executions",
  labelNames: ["hook_type", "outcome"]
});
function recordRemoteHookMetrics(ctx, durationMs, hookType, outcome) {
  remoteHookDuration.histogram(ctx, durationMs, {
    hook_type: hookType,
    outcome
  });
  remoteHookCount.increment(ctx, 1, {
    hook_type: hookType,
    outcome
  });
}
function isHookExecutionTimeout(error42) {
  if (!(error42 instanceof Error)) {
    return false;
  }
  const msg = error42.message.toLowerCase();
  return msg.includes("timed out") || msg.includes("timeout");
}
function toRemoteHookModelFields(requestContext, options2) {
  const modelId = requestContext.modelId ?? options2.modelId;
  const modelParams = requestContext.modelParams ?? options2.modelParams;
  return {
    ...modelId !== void 0 && { modelId },
    ...modelParams !== void 0 && modelParams.length > 0 ? {
      modelParams: modelParams.map((param) => new RequestedModel_ModelParameterValue(param))
    } : {}
  };
}
var RemoteHookBlockedError = class extends Error {
  constructor(message, reason) {
    super(message);
    this.reason = reason;
    this.toolCallAuditOutcome = "denied";
    this.name = "RemoteHookBlockedError";
  }
};
function isTimeoutError(error42) {
  return error42 instanceof ToolTimeoutError || error42 instanceof Error && error42.name === "TimeoutError";
}
function sanitizeToolInputForStruct(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function getRemoteHookExecutor(options2, hookStep) {
  const { resourceAccessor, enableExecuteHookExec, configuredSteps } = options2;
  if (!enableExecuteHookExec) {
    return void 0;
  }
  if (!isHookStepConfigured(configuredSteps, hookStep)) {
    return void 0;
  }
  return resourceAccessor.get(hookExecutorResource);
}
function buildRequestIds(ctx, requestContext) {
  const conversationId = requestContext.conversationId ?? getConversationId(ctx) ?? requestContext.toolCallId;
  const generationId = requestContext.generationId ?? getRequestId(ctx) ?? requestContext.toolCallId;
  return { conversationId, generationId };
}
function checkRemotePreToolUsePermission(toolName, result) {
  if (result.permission === "deny") {
    const reason = result.userMessage ? `${toolName} blocked by preToolUse hook: ${result.userMessage}` : `${toolName} blocked by preToolUse hook`;
    throw new RemoteHookBlockedError(reason, reason);
  }
  if (result.permission === "ask") {
    const reason = "The 'ask' permission for preToolUse hooks is not yet implemented. Use 'allow' or 'deny' instead.";
    throw new RemoteHookBlockedError(reason, reason);
  }
  return result;
}
async function executeRemoteAfterAgentThoughtHook(args) {
  const { ctx, text: text2, durationMs: thoughtDurationMs, requestContext, options: options2 } = args;
  const remoteHookExecutor = getRemoteHookExecutor(options2, "afterAgentThought");
  if (!remoteHookExecutor) {
    return;
  }
  const { conversationId, generationId } = buildRequestIds(ctx, requestContext);
  const startTime = performance.now();
  try {
    const hookArgs = new ExecuteHookArgs({
      request: new ExecuteHookRequest({
        request: {
          case: "afterAgentThought",
          value: new AfterAgentThoughtRequestQuery({
            text: text2,
            durationMs: thoughtDurationMs !== void 0 ? BigInt(thoughtDurationMs) : void 0,
            conversationId,
            generationId,
            model: requestContext.model ?? options2.model,
            ...toRemoteHookModelFields(requestContext, options2)
          })
        }
      })
    });
    await remoteHookExecutor.execute(ctx, hookArgs);
    const durationMs = Math.round(performance.now() - startTime);
    recordRemoteHookMetrics(ctx, durationMs, "afterAgentThought", "success");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "afterAgentThought",
      hookSource: "remote",
      hookType: "afterAgentThought",
      status: "success",
      latencyMs: durationMs,
      failClosed: false
    });
  } catch (error42) {
    const durationMs = Math.round(performance.now() - startTime);
    const timedOut = isHookExecutionTimeout(error42);
    recordRemoteHookMetrics(ctx, durationMs, "afterAgentThought", "failure");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "afterAgentThought",
      hookSource: "remote",
      hookType: "afterAgentThought",
      status: timedOut ? "timeout" : "failed",
      latencyMs: durationMs,
      failClosed: false,
      timedOut
    });
    logger15.warn(ctx, "afterAgentThought hook execution failed", {
      toolCallId: requestContext.toolCallId,
      error: error42 instanceof Error ? error42.message : String(error42),
      durationMs
    });
  }
}
async function executeRemoteSubagentStartHook(args) {
  const { ctx, subagentId, subagentType, task, parentConversationId: providedParentConversationId, subagentModel, isParallelWorker, gitBranch, requestContext, options: options2 } = args;
  const remoteHookExecutor = getRemoteHookExecutor(options2, "subagentStart");
  if (!remoteHookExecutor) {
    return {};
  }
  const { conversationId, generationId } = buildRequestIds(ctx, requestContext);
  const parentConversationId = providedParentConversationId ?? conversationId;
  logger15.info(ctx, "subagentStart hook firing", {
    subagentId,
    subagentType,
    toolCallId: requestContext.toolCallId
  });
  const startTime = performance.now();
  try {
    const hookArgs = new ExecuteHookArgs({
      request: new ExecuteHookRequest({
        request: {
          case: "subagentStart",
          value: new SubagentStartRequestQuery({
            subagentId,
            subagentType,
            task,
            parentConversationId,
            toolCallId: requestContext.toolCallId,
            subagentModel,
            isParallelWorker,
            gitBranch,
            conversationId,
            generationId,
            model: requestContext.model ?? options2.model,
            ...toRemoteHookModelFields(requestContext, options2)
          })
        }
      })
    });
    const result = await remoteHookExecutor.execute(ctx, hookArgs);
    const durationMs = Math.round(performance.now() - startTime);
    if (result.response?.response.case !== "subagentStart") {
      logger15.warn(ctx, "subagentStart hook returned unexpected response", {
        subagentId,
        subagentType,
        toolCallId: requestContext.toolCallId,
        responseCase: result.response?.response.case,
        durationMs
      });
      recordRemoteHookMetrics(ctx, durationMs, "subagentStart", "failure");
      getAgentEventTracker(ctx).trackHookExecuted(ctx, {
        hookStep: "subagentStart",
        hookSource: "remote",
        hookType: "subagentStart",
        status: "failed",
        latencyMs: durationMs,
        failClosed: false
      });
      return {};
    }
    const response = result.response.response.value;
    const blocked = response.permission === "deny" || response.permission === "ask";
    recordRemoteHookMetrics(ctx, durationMs, "subagentStart", "success");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "subagentStart",
      hookSource: "remote",
      hookType: "subagentStart",
      status: blocked ? "blocked" : "success",
      latencyMs: durationMs,
      failClosed: false
    });
    logger15.info(ctx, "subagentStart hook completed", {
      subagentId,
      subagentType,
      toolCallId: requestContext.toolCallId,
      permission: response.permission ?? "none",
      durationMs
    });
    return {
      permission: response.permission,
      userMessage: response.userMessage
    };
  } catch (error42) {
    const durationMs = Math.round(performance.now() - startTime);
    recordRemoteHookMetrics(ctx, durationMs, "subagentStart", "failure");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "subagentStart",
      hookSource: "remote",
      hookType: "subagentStart",
      status: isHookExecutionTimeout(error42) ? "timeout" : "failed",
      latencyMs: durationMs,
      failClosed: false,
      timedOut: isHookExecutionTimeout(error42)
    });
    throw error42;
  }
}
async function executeRemoteSubagentStopHook(args) {
  const { ctx, subagentId, subagentType, status, durationMs: subagentDurationMs, summary, parentConversationId: providedParentConversationId, messageCount, toolCallCount: toolCallCount2, errorMessage: errorMessage6, modifiedFiles, gitBranch, loopCount, task, description: description9, requestContext, options: options2 } = args;
  const remoteHookExecutor = getRemoteHookExecutor(options2, "subagentStop");
  if (!remoteHookExecutor) {
    return {};
  }
  const { conversationId, generationId } = buildRequestIds(ctx, requestContext);
  const parentConversationId = providedParentConversationId ?? conversationId;
  logger15.info(ctx, "subagentStop hook firing", {
    subagentId,
    subagentType,
    toolCallId: requestContext.toolCallId,
    status
  });
  const startTime = performance.now();
  try {
    const hookArgs = new ExecuteHookArgs({
      request: new ExecuteHookRequest({
        request: {
          case: "subagentStop",
          value: new SubagentStopRequestQuery({
            subagentId,
            subagentType,
            status,
            durationMs: BigInt(Math.round(subagentDurationMs)),
            summary,
            parentConversationId,
            messageCount,
            toolCallCount: toolCallCount2,
            errorMessage: errorMessage6,
            modifiedFiles,
            gitBranch,
            conversationId,
            generationId,
            model: requestContext.model ?? options2.model,
            ...toRemoteHookModelFields(requestContext, options2),
            loopCount,
            task,
            description: description9
          })
        }
      })
    });
    const result = await remoteHookExecutor.execute(ctx, hookArgs);
    const durationMs = Math.round(performance.now() - startTime);
    if (result.response?.response.case !== "subagentStop") {
      logger15.warn(ctx, "subagentStop hook returned unexpected response", {
        subagentId,
        subagentType,
        toolCallId: requestContext.toolCallId,
        responseCase: result.response?.response.case,
        durationMs
      });
      recordRemoteHookMetrics(ctx, durationMs, "subagentStop", "failure");
      getAgentEventTracker(ctx).trackHookExecuted(ctx, {
        hookStep: "subagentStop",
        hookSource: "remote",
        hookType: "subagentStop",
        status: "failed",
        latencyMs: durationMs,
        failClosed: false
      });
      return {};
    }
    const response = result.response.response.value;
    recordRemoteHookMetrics(ctx, durationMs, "subagentStop", "success");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "subagentStop",
      hookSource: "remote",
      hookType: "subagentStop",
      status: "success",
      latencyMs: durationMs,
      failClosed: false
    });
    logger15.info(ctx, "subagentStop hook completed", {
      subagentId,
      subagentType,
      toolCallId: requestContext.toolCallId,
      status,
      durationMs,
      hasFollowupMessage: !!response.followupMessage
    });
    return {
      followupMessage: response.followupMessage?.trim()
    };
  } catch (error42) {
    const durationMs = Math.round(performance.now() - startTime);
    recordRemoteHookMetrics(ctx, durationMs, "subagentStop", "failure");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "subagentStop",
      hookSource: "remote",
      hookType: "subagentStop",
      status: isHookExecutionTimeout(error42) ? "timeout" : "failed",
      latencyMs: durationMs,
      failClosed: false,
      timedOut: isHookExecutionTimeout(error42)
    });
    throw error42;
  }
}
async function executeRemotePreToolUseHookWithPermissionCheck(args) {
  const result = await executeRemotePreToolUseHook(args);
  return checkRemotePreToolUsePermission(args.toolName, result);
}
async function executeRemotePreToolUseHook(args) {
  const { ctx, toolName, toolInput, requestContext, options: options2 } = args;
  const remoteHookExecutor = getRemoteHookExecutor(options2, "preToolUse");
  if (!remoteHookExecutor) {
    return {};
  }
  const { conversationId, generationId } = buildRequestIds(ctx, requestContext);
  logger15.info(ctx, "preToolUse hook firing", {
    toolName,
    toolCallId: requestContext.toolCallId
  });
  const startTime = performance.now();
  try {
    const hookArgs = new ExecuteHookArgs({
      request: new ExecuteHookRequest({
        request: {
          case: "preToolUse",
          value: new PreToolUseRequestQuery({
            toolName,
            toolInput: Struct.fromJson(sanitizeToolInputForStruct(toolInput)),
            toolUseId: requestContext.toolCallId,
            conversationId,
            generationId,
            model: requestContext.model ?? options2.model,
            ...toRemoteHookModelFields(requestContext, options2)
          })
        }
      })
    });
    const result = await remoteHookExecutor.execute(ctx, hookArgs);
    const durationMs = Math.round(performance.now() - startTime);
    if (result.response?.response.case === "preToolUse") {
      const response = result.response.response.value;
      let updatedInput;
      if (response.updatedInput) {
        try {
          updatedInput = JSON.parse(response.updatedInput);
        } catch {
          logger15.warn(ctx, "Failed to parse preToolUse updatedInput", {
            toolName,
            toolCallId: requestContext.toolCallId
          });
        }
      }
      const hookAdditionalContexts = safeBuildRemoteHookContexts(ctx, toolName, requestContext.toolCallId, HookStep.preToolUse, response.additionalContext);
      appendHookAdditionalContexts(options2.hookContextCollector, hookAdditionalContexts);
      recordRemoteHookMetrics(ctx, durationMs, "preToolUse", "success");
      getAgentEventTracker(ctx).trackHookExecuted(ctx, {
        hookStep: "preToolUse",
        hookSource: "remote",
        hookType: "preToolUse",
        status: response.permission === "deny" || response.permission === "ask" ? "blocked" : "success",
        latencyMs: durationMs,
        failClosed: false,
        toolName
      });
      logger15.info(ctx, "preToolUse hook completed", {
        toolName,
        toolCallId: requestContext.toolCallId,
        permission: response.permission ?? "none",
        durationMs,
        hasUpdatedInput: !!updatedInput
      });
      return {
        permission: response.permission,
        userMessage: response.userMessage,
        agentMessage: response.agentMessage,
        updatedInput,
        hookAdditionalContexts
      };
    }
    recordRemoteHookMetrics(ctx, durationMs, "preToolUse", "success");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "preToolUse",
      hookSource: "remote",
      hookType: "preToolUse",
      status: "success",
      latencyMs: durationMs,
      failClosed: false,
      toolName
    });
    logger15.info(ctx, "preToolUse hook completed with no response", {
      toolName,
      toolCallId: requestContext.toolCallId,
      durationMs
    });
  } catch (error42) {
    const durationMs = Math.round(performance.now() - startTime);
    const timedOut = isHookExecutionTimeout(error42);
    recordRemoteHookMetrics(ctx, durationMs, "preToolUse", "failure");
    const hasFailClosed = remoteHookExecutor.hasFailClosedHooksForStep?.("preToolUse", toolName) ?? false;
    if (hasFailClosed) {
      const detail = error42 instanceof Error ? error42.message : "preToolUse hook error";
      const userMessage2 = `Tool blocked because this hook is configured to fail closed (block when it fails). preToolUse hook failed: ${detail}`;
      logger15.warn(ctx, "preToolUse hook failed (fail-closed)", {
        toolName,
        toolCallId: requestContext.toolCallId,
        error: error42 instanceof Error ? error42.message : String(error42),
        durationMs
      });
      getAgentEventTracker(ctx).trackHookExecuted(ctx, {
        hookStep: "preToolUse",
        hookSource: "remote",
        hookType: "preToolUse",
        status: timedOut ? "timeout" : "blocked",
        latencyMs: durationMs,
        failClosed: true,
        timedOut,
        toolName
      });
      return { permission: "deny", userMessage: userMessage2 };
    }
    logger15.warn(ctx, "preToolUse hook execution failed (fail-open)", {
      toolName,
      toolCallId: requestContext.toolCallId,
      error: error42 instanceof Error ? error42.message : String(error42),
      durationMs
    });
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "preToolUse",
      hookSource: "remote",
      hookType: "preToolUse",
      status: timedOut ? "timeout" : "failed",
      latencyMs: durationMs,
      failClosed: false,
      timedOut,
      toolName
    });
  }
  return {};
}
async function executeRemotePostToolUseHook(args) {
  const { ctx, toolName, toolInput, toolOutput, durationMs: toolDurationMs, requestContext, options: options2 } = args;
  const remoteHookExecutor = getRemoteHookExecutor(options2, "postToolUse");
  if (!remoteHookExecutor) {
    return [];
  }
  const { conversationId, generationId } = buildRequestIds(ctx, requestContext);
  logger15.info(ctx, "postToolUse hook firing", {
    toolName,
    toolCallId: requestContext.toolCallId
  });
  const startTime = performance.now();
  const hookArgs = new ExecuteHookArgs({
    request: new ExecuteHookRequest({
      request: {
        case: "postToolUse",
        value: new PostToolUseRequestQuery({
          toolName,
          toolInput: Struct.fromJson(sanitizeToolInputForStruct(toolInput)),
          toolOutput,
          durationMs: BigInt(Math.round(toolDurationMs)),
          toolUseId: requestContext.toolCallId,
          conversationId,
          generationId,
          model: requestContext.model ?? options2.model,
          ...toRemoteHookModelFields(requestContext, options2)
        })
      }
    })
  });
  try {
    const result = await remoteHookExecutor.execute(ctx, hookArgs);
    const durationMs = Math.round(performance.now() - startTime);
    const hookAdditionalContexts = result.response?.response.case === "postToolUse" ? safeBuildRemoteHookContexts(ctx, toolName, requestContext.toolCallId, HookStep.postToolUse, result.response.response.value.additionalContext) : [];
    appendHookAdditionalContexts(options2.hookContextCollector, hookAdditionalContexts);
    recordRemoteHookMetrics(ctx, durationMs, "postToolUse", "success");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "postToolUse",
      hookSource: "remote",
      hookType: "postToolUse",
      status: "success",
      latencyMs: durationMs,
      failClosed: false,
      toolName
    });
    logger15.info(ctx, "postToolUse hook completed", {
      toolName,
      toolCallId: requestContext.toolCallId,
      durationMs
    });
    return hookAdditionalContexts;
  } catch (error42) {
    const durationMs = Math.round(performance.now() - startTime);
    const timedOut = isHookExecutionTimeout(error42);
    const hasFailClosed = remoteHookExecutor.hasFailClosedHooksForStep?.("postToolUse", toolName) ?? false;
    recordRemoteHookMetrics(ctx, durationMs, "postToolUse", "failure");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "postToolUse",
      hookSource: "remote",
      hookType: "postToolUse",
      status: timedOut ? "timeout" : hasFailClosed ? "blocked" : "failed",
      latencyMs: durationMs,
      failClosed: hasFailClosed,
      timedOut,
      toolName
    });
    logger15.warn(ctx, "postToolUse hook execution failed", {
      toolName,
      toolCallId: requestContext.toolCallId,
      error: error42 instanceof Error ? error42.message : String(error42),
      durationMs
    });
  }
  return [];
}
async function executeRemotePostToolUseFailureHook(args) {
  const { ctx, toolName, toolInput, errorMessage: errorMessage6, failureType, durationMs: toolDurationMs, isInterrupt = false, requestContext, options: options2 } = args;
  const remoteHookExecutor = getRemoteHookExecutor(options2, "postToolUseFailure");
  if (!remoteHookExecutor) {
    return [];
  }
  const { conversationId, generationId } = buildRequestIds(ctx, requestContext);
  logger15.info(ctx, "postToolUseFailure hook firing", {
    toolName,
    toolCallId: requestContext.toolCallId,
    failureType
  });
  const startTime = performance.now();
  const hookArgs = new ExecuteHookArgs({
    request: new ExecuteHookRequest({
      request: {
        case: "postToolUseFailure",
        value: new PostToolUseFailureRequestQuery({
          toolName,
          toolInput: Struct.fromJson(sanitizeToolInputForStruct(toolInput)),
          errorMessage: errorMessage6,
          failureType,
          durationMs: BigInt(Math.round(toolDurationMs)),
          toolUseId: requestContext.toolCallId,
          isInterrupt,
          conversationId,
          generationId,
          model: requestContext.model ?? options2.model,
          ...toRemoteHookModelFields(requestContext, options2)
        })
      }
    })
  });
  try {
    const result = await remoteHookExecutor.execute(ctx, hookArgs);
    const durationMs = Math.round(performance.now() - startTime);
    const hookAdditionalContexts = result.response?.response.case === "postToolUseFailure" ? safeBuildRemoteHookContexts(ctx, toolName, requestContext.toolCallId, HookStep.postToolUseFailure, result.response.response.value.additionalContext) : [];
    appendHookAdditionalContexts(options2.hookContextCollector, hookAdditionalContexts);
    recordRemoteHookMetrics(ctx, durationMs, "postToolUseFailure", "success");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "postToolUseFailure",
      hookSource: "remote",
      hookType: "postToolUseFailure",
      status: "success",
      latencyMs: durationMs,
      failClosed: false,
      toolName,
      failureType
    });
    logger15.info(ctx, "postToolUseFailure hook completed", {
      toolName,
      toolCallId: requestContext.toolCallId,
      durationMs
    });
    return hookAdditionalContexts;
  } catch (error42) {
    const durationMs = Math.round(performance.now() - startTime);
    const timedOut = isHookExecutionTimeout(error42);
    const hasFailClosed = remoteHookExecutor.hasFailClosedHooksForStep?.("postToolUseFailure", toolName) ?? false;
    recordRemoteHookMetrics(ctx, durationMs, "postToolUseFailure", "failure");
    getAgentEventTracker(ctx).trackHookExecuted(ctx, {
      hookStep: "postToolUseFailure",
      hookSource: "remote",
      hookType: "postToolUseFailure",
      status: timedOut ? "timeout" : hasFailClosed ? "blocked" : "failed",
      latencyMs: durationMs,
      failClosed: hasFailClosed,
      timedOut,
      toolName,
      failureType
    });
    logger15.warn(ctx, "postToolUseFailure hook execution failed", {
      toolName,
      toolCallId: requestContext.toolCallId,
      error: error42 instanceof Error ? error42.message : String(error42),
      durationMs
    });
  }
  return [];
}
function withRemoteHooks(args) {
  const { executeFn, config: config2, requestContext, options: options2 } = args;
  return async (ctx, toolArgs) => {
    const startTime = performance.now();
    const toolInput = config2.createToolInput(toolArgs);
    const hookResult = await executeRemotePreToolUseHook({
      ctx,
      toolName: config2.toolName,
      toolInput,
      requestContext,
      options: options2
    });
    if (hookResult.permission === "deny") {
      const reason = hookResult.userMessage ?? `${config2.toolName} denied by hook`;
      return config2.createRejectedResult(toolArgs, reason);
    }
    if (hookResult.permission === "ask") {
      const reason = "The 'ask' permission for preToolUse hooks is not yet implemented";
      return config2.createRejectedResult(toolArgs, reason);
    }
    let actualToolInput = toolInput;
    if (hookResult.updatedInput && config2.applyUpdatedInput) {
      const applied = config2.applyUpdatedInput(toolArgs, hookResult.updatedInput);
      if (applied === false) {
        return config2.createRejectedResult(toolArgs, `${config2.toolName} hook argument rewrite is not allowed`);
      }
      actualToolInput = config2.createToolInput(toolArgs);
    }
    let result;
    try {
      result = await executeFn(ctx, toolArgs);
    } catch (error42) {
      const durationMs2 = performance.now() - startTime;
      const errorObj = error42 instanceof Error ? error42 : new Error(String(error42));
      try {
        await executeRemotePostToolUseFailureHook({
          ctx,
          toolName: config2.toolName,
          toolInput: actualToolInput,
          errorMessage: errorObj.message,
          failureType: isTimeoutError(error42) ? "timeout" : "error",
          durationMs: durationMs2,
          isInterrupt: false,
          requestContext,
          options: options2
        });
      } catch (hookError) {
        logger15.warn(ctx, "postToolUseFailure hook execution failed", {
          toolName: config2.toolName,
          toolCallId: requestContext.toolCallId,
          error: hookError instanceof Error ? hookError.message : String(hookError)
        });
      }
      throw error42;
    }
    const durationMs = performance.now() - startTime;
    const failureInfo = config2.getFailureInfo?.(result);
    if (failureInfo) {
      await executeRemotePostToolUseFailureHook({
        ctx,
        toolName: config2.toolName,
        toolInput: actualToolInput,
        errorMessage: failureInfo.errorMessage,
        failureType: failureInfo.failureType,
        durationMs,
        isInterrupt: false,
        requestContext,
        options: options2
      });
    } else {
      const toolOutput = JSON.stringify(config2.createSuccessOutput(toolArgs, result));
      await executeRemotePostToolUseHook({
        ctx,
        toolName: config2.toolName,
        toolInput: actualToolInput,
        toolOutput,
        durationMs,
        requestContext,
        options: options2
      });
    }
    return result;
  };
}

