/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tool-stream-executor.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist();
init_dist3();

// @recovered-fragment 2/2
var completedToolResultsByDeferredError = /* @__PURE__ */ new WeakMap();
function getToolResultsCompletedBeforeDeferral(error3) {
  return completedToolResultsByDeferredError.get(error3) ?? [];
}
function auditOutcomeField(error3) {
  const auditOutcome = toolCallAuditOutcomeOf(error3);
  return auditOutcome === void 0 ? {} : { auditOutcome };
}
function conversationStateOpsInReplayOrder(toolCallResults) {
  return toolCallResults.flatMap((result) => result.stateOps ?? []);
}
var RAW_ERROR_MESSAGE_CHARACTER_BUDGET = 2e4;
function collectRawErrorMessages(error3) {
  const messages = [];
  const queue = [error3];
  const seen = /* @__PURE__ */ new Set();
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === void 0 || seen.has(current)) {
      continue;
    }
    seen.add(current);
    if (current instanceof Error) {
      if (current.message.length > 0) {
        messages.push(truncateOutput(current.message, RAW_ERROR_MESSAGE_CHARACTER_BUDGET, true).output);
      }
      const cause = current.cause;
      if (cause !== void 0) {
        queue.push(cause);
      }
    }
  }
  return Array.from(new Set(messages));
}
var logger56 = createLogger("chat-inference/tool-call");
var TOOL_CALL_ID_CONTEXT_KEY = createKey(/* @__PURE__ */ Symbol("agent.toolCallId"), void 0);
var SEMANTIC_SEARCH_TOOL_NAME = "semantic_search";
var AGENT_STORE_CONFLICT_HOOK_EVENT_NAME4 = "agentStoreConflict";
function createConflictNoticeOnlyCollector() {
  const collector = [];
  const push = collector.push.bind(collector);
  collector.push = (...items) => push(...items.filter((item) => item.hookEventName === AGENT_STORE_CONFLICT_HOOK_EVENT_NAME4));
  return collector;
}
function getMcpVersionLabel(toolName) {
  if (toolName !== "mcp") {
    return "";
  }
  return "snapshots";
}
var toolCallDuration = createHistogram("tool_call.duration_ms", {
  description: "Duration of tool call execution in milliseconds",
  labelNames: [
    "toolName",
    "outcome",
    "team",
    "mcp_version",
    "clientversion",
    "clienttype",
    "remoteType",
    "isdynamic",
    "user.is_dev"
  ]
});
var toolCallResult = createCounter("tool_call.result", {
  description: "Result status of tool call execution",
  labelNames: [
    "toolName",
    "outcome",
    "team",
    "mcp_version",
    "clientversion",
    "clienttype",
    "remoteType",
    "os",
    "issubagent",
    "isuserapikey",
    "isdynamic",
    "user.is_dev"
  ]
});
var rawToolCallInputTokens = createHistogram("agent.tool_call.input_tokens", {
  description: "Approximate number of tokens in raw model-produced tool call arguments (argsText.length / 4)",
  labelNames: ["tool_name"]
});
var duplicateInboundToolCallId = createCounter("agent.duplicate_inbound_tool_call_id", {
  description: "Tool-call stream chunks whose id collided with an already-handled or in-flight tool call in the same model response",
  labelNames: ["chunkType", "disposition"]
});
function toolNameForLogging(toolName, toolMap) {
  if (!(toolName in toolMap)) {
    return "other";
  }
  return toolMap[toolName].toolIdentifier;
}
function resolveToolCallTelemetry(tool, args, isDirectDynamicTool = false) {
  const identity = resolveToolCallIdentity({
    tool,
    args,
    isDirectDynamicTool
  });
  return {
    ...identity,
    loggedToolName: identity.toolIdentifier === "unknown" ? "other" : identity.toolIdentifier.toLowerCase()
  };
}
function approximateTokenCountFromRawArgs(rawArgs) {
  if (rawArgs.length === 0) {
    return 0;
  }
  return Math.floor(rawArgs.length / 4);
}
async function* observeStreamChunks(stream3, observer) {
  for await (const chunk of stream3) {
    observer(chunk.type);
    yield chunk;
  }
}
function duplicateStream(stream3) {
  const stream1 = createWritableIterable();
  const stream22 = createWritableIterable();
  async function run() {
    try {
      for await (const chunk of stream3) {
        await stream1.write(chunk);
        await stream22.write(chunk);
      }
    } catch (e) {
      stream1.throw(e);
      stream22.throw(e);
    } finally {
      stream1.close();
      stream22.close();
    }
  }
  void run().catch((e) => {
    throw e;
  });
  return [stream1, stream22];
}
var ToolCallStream = class {
  constructor(toolCallId, toolName, inner) {
    this.toolCallId = toolCallId;
    this.toolName = toolName;
    this.inner = inner;
    this.written = "";
    this.resolveCompletedArgs = () => {
    };
    this.resolveCompletedArgsText = () => {
    };
    this.completedArgs = new Promise((resolve14) => {
      this.resolveCompletedArgs = resolve14;
    });
    this.completedArgsText = new Promise((resolve14) => {
      this.resolveCompletedArgsText = resolve14;
    });
  }
  async write(ctx, chunk) {
    this.written += chunk;
    this.writePreview(chunk);
    if (this.inner === void 0) {
      return;
    }
    void this.inner.write(chunk).catch((e) => {
      if (e instanceof WriteIterableClosedError) {
        return;
      }
      logger56.error(ctx, "Error writing to tool call stream", e);
    });
  }
  async complete(ctx, fullValue) {
    const rest = fullValue.slice(this.written.length);
    if (rest.length > 0) {
      this.written += rest;
      this.writePreview(rest);
      if (this.inner === void 0) {
        return;
      }
      try {
        await this.inner.write(rest);
      } catch (e) {
        if (e instanceof WriteIterableClosedError) {
          return;
        }
        logger56.error(ctx, "Error writing to tool call stream", e);
      }
    }
  }
  resolveArgs(args) {
    this.resolveCompletedArgs(args);
  }
  resolveArgsText(argsText) {
    this.resolveCompletedArgsText(argsText);
  }
  async close() {
    this.inner?.close();
  }
  writePreview(chunk) {
    try {
      this.previewArgsDelta?.(chunk);
    } catch {
      this.previewArgsDelta = void 0;
    }
  }
};
function startToolArgsPreview(ctx, interactionHandler, tool, stream3) {
  if (tool === void 0 || !("previewStreamingArgs" in tool)) {
    return;
  }
  stream3.previewArgsDelta = tool.previewStreamingArgs?.(ctx, interactionHandler, stream3.toolCallId);
}
function createOneShotArgsIterable(args) {
  return createOneShotStringIterable(typeof args === "string" ? args : JSON.stringify(args));
}
function createOneShotStringIterable(value) {
  return (async function* () {
    yield value;
  })();
}
function parseNativeToolArguments(value) {
  if (value === void 0) {
    return {};
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return void 0;
  }
  try {
    const parsed = JSON.parse(value);
    if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
  }
  return value;
}
function createToolMap(tools) {
  const toolMap = {};
  for (const tool of tools) {
    toolMap[tool.name] = tool;
    for (const alias of tool.executionAliases ?? []) {
      toolMap[alias] ??= tool;
    }
  }
  return toolMap;
}
function getDynamicInvocationToolNames(modelVisibleTools) {
  return new Set(modelVisibleTools.filter((tool) => tool.dynamicToolMetaRole === "invocation").map((tool) => tool.name));
}
function resolveEffectiveToolCallDescriptor(descriptor2, toolExecutionSet) {
  const dynamicInvocationToolNames = getDynamicInvocationToolNames(toolExecutionSet.modelVisibleTools);
  if (!dynamicInvocationToolNames.has(descriptor2.toolName)) {
    return descriptor2;
  }
  const executableToolNames = new Set(getExecutableTools(toolExecutionSet).map((tool) => tool.name));
  if (descriptor2.args === null || typeof descriptor2.args !== "object" || Array.isArray(descriptor2.args)) {
    return descriptor2;
  }
  const namespace = descriptor2.args.namespace;
  const toolName = descriptor2.args.toolName;
  if (namespace !== CURSOR_DYNAMIC_TOOLS_NAMESPACE || typeof toolName !== "string" || !executableToolNames.has(toolName)) {
    return descriptor2;
  }
  const args = parseNativeToolArguments(descriptor2.args.arguments);
  if (args === void 0) {
    return descriptor2;
  }
  return {
    ...descriptor2,
    effectiveNativeToolCall: { toolName, args }
  };
}
function getEffectiveToolCallName(descriptor2) {
  return descriptor2.effectiveNativeToolCall?.toolName ?? descriptor2.toolName;
}
function getEffectiveToolCallArgs(descriptor2) {
  return descriptor2.effectiveNativeToolCall?.args ?? descriptor2.args;
}
async function drainArgsStream(argsStream) {
  for await (const _2 of argsStream) {
  }
}
async function executeDeferredToolCall(ctx, descriptor2, toolMap, interactionHandler, extraT, recordToolCallResult, renderProps, streamingArgsIterable, completedArgs, directDynamicToolNames = /* @__PURE__ */ new Set()) {
  const effectiveToolName = getEffectiveToolCallName(descriptor2);
  const effectiveArgs = getEffectiveToolCallArgs(descriptor2);
  const tool = toolMap[effectiveToolName];
  const toolCallEventRecorder = ctx.get(toolCallEventRecorderKey);
  if (tool === void 0) {
    logger56.warn(ctx, "nal.tool_call.failure", {
      toolCallId: descriptor2.toolCallId,
      toolName: "other",
      toolNameFromModel: effectiveToolName,
      errorClassification: "tool_not_found",
      team: getToolOwnerTeam("unknown")
    });
    toolCallResult.increment(ctx, 1, {
      toolName: "other",
      outcome: "tool_not_found",
      team: getToolOwnerTeam("unknown"),
      mcp_version: "",
      ...getClientVersionMetricTagsFromContext(ctx),
      ...getClientRemoteTypeMetricTagFromContext(ctx),
      ...getClientOsMetricTagFromContext(ctx),
      issubagent: getIsSubagentFromContext(ctx) ? "true" : "false",
      isuserapikey: getIsUserApiKeyFromContext(ctx) ? "true" : "false",
      isdynamic: "false",
      "user.is_dev": getIsDevFromContext(ctx) ? "true" : "false"
    });
    getAgentEventTracker(ctx).trackToolCallResult(ctx, {
      toolName: "other",
      toolCallId: descriptor2.toolCallId,
      outcome: "tool_not_found"
    });
    if (toolCallEventRecorder !== void 0) {
      const notFoundAtMs = Date.now();
      recordToolCallSettled(toolCallEventRecorder, ctx, {
        toolCallId: descriptor2.toolCallId,
        toolIdentifier: "unknown",
        startedAtMs: notFoundAtMs,
        endedAtMs: notFoundAtMs,
        success: false,
        errorClass: TOOL_CALL_EVENT_TOOL_NOT_FOUND_ERROR_CLASS
      });
    }
    return {
      role: "tool",
      id: descriptor2.toolCallId,
      content: [
        {
          type: "tool-result",
          toolName: descriptor2.toolName,
          toolCallId: descriptor2.toolCallId,
          result: `Tool not found: ${effectiveToolName}. Available tools: ${Object.keys(toolMap).join(", ")}`
        }
      ]
    };
  }
  const startTimeMs = Date.now();
  const argsIterable = streamingArgsIterable ? streamingArgsIterable : createOneShotArgsIterable(effectiveArgs);
  const usedDynamicInvocationSurface = descriptor2.effectiveNativeToolCall !== void 0 || directDynamicToolNames.has(effectiveToolName);
  let telemetry = resolveToolCallTelemetry(tool, effectiveArgs, usedDynamicInvocationSurface);
  let telemetryLogFields = telemetry.isDynamic ? { isDynamicToolCall: true } : {};
  let didLogStart = false;
  const logToolCallStart = () => {
    didLogStart = true;
    logger56.info(ctx, "nal.tool_call.start", {
      toolCallId: descriptor2.toolCallId,
      toolName: telemetry.loggedToolName,
      team: getToolOwnerTeam(telemetry.toolIdentifier),
      ...telemetryLogFields
    });
    getAgentEventTracker(ctx).trackToolCallStarted(ctx, {
      toolName: telemetry.loggedToolName,
      toolCallId: descriptor2.toolCallId
    });
  };
  const extraTForFlag = extraT;
  const generalHookCarriersEnabled = extraTForFlag.enableHookAdditionalContext === true;
  const conflictNoticeCollectorEnabled = extraTForFlag.enableAgentStoreConflictNoticeCollector === true || extraTForFlag.enableAgentStoreConflictNotices === true;
  const hookContextCollector = generalHookCarriersEnabled ? [] : conflictNoticeCollectorEnabled ? createConflictNoticeOnlyCollector() : void 0;
  const toolCallCtx = ctx.with(TOOL_CALL_ID_CONTEXT_KEY, descriptor2.toolCallId);
  try {
    const executeTool = () => executeToolResultOrError(tool, toolCallCtx, interactionHandler, argsIterable, {
      ...extraT,
      toolCallId: descriptor2.toolCallId,
      hookContextCollector
    });
    const toolOutputPromise = executeTool().then((result) => ({ ok: true, result }), (error3) => ({ ok: false, error: error3 }));
    if (tool.resolveToolCallTelemetry !== void 0 && completedArgs !== void 0) {
      try {
        const telemetryRaceResult = await Promise.race([
          completedArgs.then((args) => ({
            source: "completedArgs",
            args
          })),
          toolOutputPromise.then((result) => ({
            source: "toolOutput",
            result
          }))
        ]);
        if (telemetryRaceResult.source === "completedArgs") {
          telemetry = resolveToolCallTelemetry(tool, telemetryRaceResult.args, usedDynamicInvocationSurface);
          telemetryLogFields = telemetry.isDynamic ? { isDynamicToolCall: true } : {};
        }
      } catch {
      }
    }
    logToolCallStart();
    const settledToolOutput = await toolOutputPromise;
    if (!settledToolOutput.ok) {
      throw settledToolOutput.error;
    }
    const toolOutputRaw = settledToolOutput.result;
    const extraTWithState = extraT;
    const blobStore = extraTWithState.stateHandler?.getBlobStore?.();
    const renderPropsWithBlobStore = {
      ...renderProps,
      blobStore
    };
    const toolOutput = await renderToolResultOrError(ctx, tool, toolOutputRaw, renderPropsWithBlobStore);
    const highLevelToolCallResult = {
      output: toolOutputRaw.result.toJson(),
      isError: toolOutput.isError
    };
    const settledAtMs = Date.now();
    const durationMs = settledAtMs - startTimeMs;
    let primaryContent;
    const textParts = [];
    for (const part of toolOutput.content) {
      if (part.type === "text") {
        textParts.push(part.text);
      }
    }
    if (textParts.length > 0) {
      primaryContent = textParts.join("\n");
    }
    let errorClassification;
    if (toolOutput.isError === true && "error" in toolOutputRaw) {
      errorClassification = toolOutputRaw.errorClassification;
    }
    const toolAbortReason = ctx.reason;
    const isToolIntentionalAbort = toolOutput.isError === true && ctx.canceled && toolAbortReason?.intentional === true;
    if (toolOutput.isError === true && "error" in toolOutputRaw) {
      const rawErrorMessages = collectRawErrorMessages(toolOutputRaw.error);
      if (rawErrorMessages.length > 0) {
        highLevelToolCallResult.rawErrorMessages = rawErrorMessages;
      }
      const logData = {
        toolCallId: descriptor2.toolCallId,
        toolName: telemetry.loggedToolName,
        durationMs,
        errorClassification,
        toolError: true,
        intentionalAbort: isToolIntentionalAbort,
        abortReason: toolAbortReason?.reason,
        team: getToolOwnerTeam(telemetry.toolIdentifier),
        errorMessage: typeof primaryContent === "string" ? primaryContent : void 0,
        mcp_version: getMcpVersionLabel(telemetry.loggedToolName),
        ...telemetryLogFields
      };
      if (isToolIntentionalAbort) {
        logger56.info(ctx, "nal.tool_call.aborted", logData);
      } else {
        logger56.error(ctx, "nal.tool_call.failure", toolOutputRaw.error, logData);
      }
    } else {
      logger56.info(ctx, "nal.tool_call.success", {
        toolCallId: descriptor2.toolCallId,
        toolName: telemetry.loggedToolName,
        durationMs,
        team: getToolOwnerTeam(telemetry.toolIdentifier),
        mcp_version: getMcpVersionLabel(telemetry.loggedToolName),
        ...telemetryLogFields
      });
    }
    if (recordToolCallResult) {
      await recordToolCallResult(ctx, toolOutput, telemetry.loggedToolName, errorClassification);
    }
    const outcome = errorClassification === void 0 ? "success" : errorClassification.toString();
    getAgentEventTracker(ctx).trackToolCallResult(ctx, {
      toolName: telemetry.loggedToolName,
      toolCallId: descriptor2.toolCallId,
      outcome
    });
    const team = getToolOwnerTeam(telemetry.toolIdentifier);
    const mcpVersion = getMcpVersionLabel(telemetry.loggedToolName);
    toolCallResult.increment(ctx, 1, {
      toolName: telemetry.loggedToolName,
      outcome,
      team,
      mcp_version: mcpVersion,
      ...getClientVersionMetricTagsFromContext(ctx),
      ...getClientRemoteTypeMetricTagFromContext(ctx),
      ...getClientOsMetricTagFromContext(ctx),
      issubagent: getIsSubagentFromContext(ctx) ? "true" : "false",
      isuserapikey: getIsUserApiKeyFromContext(ctx) ? "true" : "false",
      isdynamic: telemetry.isDynamic ? "true" : "false",
      "user.is_dev": getIsDevFromContext(ctx) ? "true" : "false"
    });
    if (telemetry.loggedToolName === SEMANTIC_SEARCH_TOOL_NAME) {
      logger56.info(ctx, "semantic search usage detected");
    }
    toolCallDuration.histogram(ctx, durationMs, {
      toolName: telemetry.loggedToolName,
      outcome,
      team,
      mcp_version: mcpVersion,
      ...getClientVersionMetricTagsFromContext(ctx),
      ...getClientRemoteTypeMetricTagFromContext(ctx),
      isdynamic: telemetry.isDynamic ? "true" : "false",
      "user.is_dev": getIsDevFromContext(ctx) ? "true" : "false"
    });
    const toolResultContent = [...toolOutput.content];
    const carriersToRender = generalHookCarriersEnabled || hookContextCollector === void 0 ? hookContextCollector ?? [] : hookContextCollector.filter((carrier) => carrier.hookEventName === AGENT_STORE_CONFLICT_HOOK_EVENT_NAME4);
    appendHookContextRemindersToCoreToolResult(textParts, toolResultContent, carriersToRender);
    primaryContent = textParts.length > 0 ? textParts.join("\n") : primaryContent;
    if (toolCallEventRecorder !== void 0) {
      recordToolCallSettled(toolCallEventRecorder, ctx, {
        toolCallId: descriptor2.toolCallId,
        toolIdentifier: telemetry.toolIdentifier,
        startedAtMs: startTimeMs,
        endedAtMs: settledAtMs,
        success: toolOutput.isError !== true,
        ...toolOutput.isError === true ? {
          errorClass: "error" in toolOutputRaw ? toolCallErrorClassOf(toolOutputRaw.error) : TOOL_CALL_EVENT_RESULT_ERROR_CLASS,
          ..."error" in toolOutputRaw ? auditOutcomeField(toolOutputRaw.error) : {},
          // An error result produced while the turn was being aborted is
          // the abort, whatever the tool classified it as (the log line
          // above says "aborted" for the same reason).
          ...isToolIntentionalAbort ? { errorClassification: ToolErrorClassification.ABORTED } : errorClassification !== void 0 ? { errorClassification: errorClassification.toString() } : {}
        } : {},
        ...measureRenderedToolResult(toolOutput)
      });
    }
    return {
      role: "tool",
      id: descriptor2.toolCallId,
      content: [
        {
          type: "tool-result",
          toolName: descriptor2.toolName,
          toolCallId: descriptor2.toolCallId,
          result: primaryContent,
          experimental_content: toolResultContent
        }
      ],
      providerOptions: {
        cursor: {
          highLevelToolCallResult: highLevelToolCallResult ?? {}
        }
      }
    };
  } catch (err) {
    if (!didLogStart) {
      logToolCallStart();
    }
    const settledAtMs = Date.now();
    const durationMs = settledAtMs - startTimeMs;
    const errorName = err instanceof Error ? err.name : typeof err;
    const errorMessage4 = err instanceof Error ? err.message : void 0;
    const errorClassification = isMcpToolNotFoundError(err) ? "tool_not_found" : err instanceof RetryableToolOrchestrationError ? err.classification : void 0;
    let outcome = errorClassification !== void 0 ? errorClassification : "error";
    const abortReason2 = ctx.reason;
    const isIntentionalAbort = ctx.canceled && abortReason2?.intentional === true;
    if (err instanceof InteractionListenerStreamClosedError || isIntentionalAbort) {
      const logLevel = isIntentionalAbort ? "info" : "warn";
      logger56[logLevel](ctx, "nal.tool_call.aborted", {
        error: err,
        toolCallId: descriptor2.toolCallId,
        toolName: telemetry.loggedToolName,
        durationMs,
        errorName,
        errorMessage: errorMessage4,
        errorClassification,
        intentionalAbort: isIntentionalAbort,
        abortReason: abortReason2?.reason,
        team: getToolOwnerTeam(telemetry.toolIdentifier),
        mcp_version: getMcpVersionLabel(telemetry.loggedToolName),
        ...telemetryLogFields
      });
      outcome = "aborted";
    } else {
      logger56.error(ctx, "nal.tool_call.unexpected_error_not_user_visible", err, {
        toolCallId: descriptor2.toolCallId,
        toolName: telemetry.loggedToolName,
        durationMs,
        errorName,
        errorMessage: errorMessage4,
        errorClassification,
        team: getToolOwnerTeam(telemetry.toolIdentifier),
        mcp_version: getMcpVersionLabel(telemetry.loggedToolName),
        ...telemetryLogFields
      });
    }
    if (toolCallEventRecorder !== void 0) {
      recordToolCallSettled(toolCallEventRecorder, ctx, {
        toolCallId: descriptor2.toolCallId,
        toolIdentifier: telemetry.toolIdentifier,
        startedAtMs: startTimeMs,
        endedAtMs: settledAtMs,
        success: false,
        errorClass: toolCallErrorClassOf(err),
        ...outcome === "error" ? {} : { errorClassification: outcome },
        ...auditOutcomeField(err)
      });
    }
    const catchTeam = getToolOwnerTeam(telemetry.toolIdentifier);
    const catchMcpVersion = getMcpVersionLabel(telemetry.loggedToolName);
    toolCallDuration.histogram(ctx, durationMs, {
      toolName: telemetry.loggedToolName,
      outcome,
      team: catchTeam,
      mcp_version: catchMcpVersion,
      ...getClientVersionMetricTagsFromContext(ctx),
      ...getClientRemoteTypeMetricTagFromContext(ctx),
      isdynamic: telemetry.isDynamic ? "true" : "false",
      "user.is_dev": getIsDevFromContext(ctx) ? "true" : "false"
    });
    toolCallResult.increment(ctx, 1, {
      toolName: telemetry.loggedToolName,
      outcome,
      team: catchTeam,
      mcp_version: catchMcpVersion,
      ...getClientVersionMetricTagsFromContext(ctx),
      ...getClientRemoteTypeMetricTagFromContext(ctx),
      ...getClientOsMetricTagFromContext(ctx),
      issubagent: getIsSubagentFromContext(ctx) ? "true" : "false",
      isuserapikey: getIsUserApiKeyFromContext(ctx) ? "true" : "false",
      isdynamic: telemetry.isDynamic ? "true" : "false",
      "user.is_dev": getIsDevFromContext(ctx) ? "true" : "false"
    });
    if (telemetry.loggedToolName === SEMANTIC_SEARCH_TOOL_NAME) {
      logger56.info(ctx, "semantic search usage detected");
    }
    getAgentEventTracker(ctx).trackToolCallResult(ctx, {
      toolName: telemetry.loggedToolName,
      toolCallId: descriptor2.toolCallId,
      outcome
    });
    throw err;
  }
}
function hasMeaningfulContentPart(part) {
  if (part.type === "text") {
    return part.text.trim().length > 0;
  }
  if (part.type === "reasoning") {
    return part.text.trim().length > 0;
  }
  return part.type === "tool-call" || part.type === "file";
}
function shouldSynthesizeResponseFromStreamContent(part) {
  if (part.type === "text") {
    return part.text.trim().length > 0;
  }
  return part.type === "tool-call" || part.type === "file";
}
function sanitizeContentBufferForReplay(buffer) {
  return buffer.flatMap((part) => {
    if (part.type !== "reasoning") {
      return [part];
    }
    const isSummary = part.providerOptions?.cursor?.isAlreadySummarizedThinking === true;
    if (!isSummary) {
      return [part];
    }
    if (part.signature !== void 0 && part.signature.length > 0) {
      const modelName = part.providerOptions?.cursor?.modelName;
      if (modelName === void 0) {
        return [];
      }
      const replacement = {
        type: "redacted-reasoning",
        data: part.signature,
        providerOptions: { cursor: { modelName } }
      };
      return [replacement];
    }
    return [];
  });
}
function hasMeaningfulResponseMessageContent(messages) {
  return messages.some((message) => {
    if (message.role !== "assistant") {
      return false;
    }
    if (typeof message.content === "string") {
      return message.content.trim().length > 0;
    }
    return message.content.some(hasMeaningfulContentPart);
  });
}
function responseOmitsStreamedToolCall(messages, contentBuffer) {
  const responseToolCallIds = new Set(messages.flatMap((message) => message.role === "assistant" && Array.isArray(message.content) ? message.content.flatMap((part) => part.type === "tool-call" ? [part.toolCallId] : []) : []));
  return contentBuffer.some((part) => part.type === "tool-call" && !responseToolCallIds.has(part.toolCallId));
}
function streamModelAndCollectToolCalls(ctx, executor, interactionHandler, modelVisibleTools, descriptionProps, firstToolCallHook, options2) {
  const emitToolCallEvents = options2?.emitToolCallEvents ?? true;
  let toolMap = options2?.executionToolMap;
  if (toolMap === void 0) {
    const modelVisibleToolMap = {};
    for (const tool of modelVisibleTools) {
      modelVisibleToolMap[tool.name] = tool;
    }
    toolMap = modelVisibleToolMap;
  }
  const toolDefinitions = toAgentTools(modelVisibleTools, descriptionProps ?? buildDescriptionGeneratorProps(modelVisibleTools));
  const acceptedUnadvertisedToolNames = options2?.acceptedUnadvertisedToolNames ?? [];
  const result = executor.stream(ctx, interactionHandler.invocationId, toolDefinitions, {
    acceptedUnadvertisedToolNames
  });
  const settledResultResponse = result.response.then((response) => ({ didReject: false, response }), (error3) => ({ didReject: true, error: error3 }));
  const chunkObserver = ctx.get(modelStreamChunkObserverKey);
  const sourceStream = chunkObserver === void 0 ? result.fullStream : observeStreamChunks(result.fullStream, chunkObserver);
  const [innerStream, fullStream] = duplicateStream(sourceStream);
  const toolCallsIterable = createWritableIterable();
  const toolCallEventsIterable = createWritableIterable();
  const responsePromise = (async () => {
    let currentStream;
    let currentToolCallId;
    let hasStartedToolCall = false;
    const handledToolCalls = /* @__PURE__ */ new Set();
    const contentBuffer = [];
    const newMessages = [];
    let response;
    let toolIterablesClosed = false;
    let shouldCloseToolIterables = false;
    const pendingDescriptorWrites = /* @__PURE__ */ new Set();
    const pendingEventWrites = /* @__PURE__ */ new Set();
    const maybeCloseToolIterables = () => {
      if (toolIterablesClosed || !shouldCloseToolIterables) {
        return;
      }
      const pendingWrites = emitToolCallEvents ? pendingEventWrites : pendingDescriptorWrites;
      if (pendingWrites.size > 0) {
        return;
      }
      toolIterablesClosed = true;
      toolCallsIterable.close();
      toolCallEventsIterable.close();
    };
    const closeCurrentStream = () => {
      if (currentStream !== void 0) {
        const stream3 = currentStream;
        stream3.close().catch((e) => {
          if (e instanceof Error && e.message.includes("WritableIterable is closed")) {
            return;
          }
          logger56.error(ctx, "Error closing tool call stream", e);
        });
        handledToolCalls.add(stream3.toolCallId);
        const tool = toolMap[stream3.toolName];
        const isCustomFormatTool = tool !== void 0 && "customToolFormat" in tool && tool.customToolFormat !== void 0;
        let argsParseError;
        const args = (() => {
          if (stream3.written.length === 0)
            return {};
          if (isCustomFormatTool)
            return stream3.written;
          try {
            return JSON.parse(stream3.written);
          } catch (error3) {
            argsParseError = error3;
            return stream3.written;
          }
        })();
        const call = {
          type: "tool-call",
          toolCallId: stream3.toolCallId,
          toolName: stream3.toolName,
          args
        };
        contentBuffer.push(call);
        stream3.resolveArgs(args);
        stream3.resolveArgsText(stream3.written);
        const descriptor2 = {
          toolCallId: stream3.toolCallId,
          toolName: stream3.toolName,
          args
        };
        const telemetry = tool === void 0 ? void 0 : resolveToolCallTelemetry(tool, args);
        const loggedToolName = telemetry === void 0 || telemetry.toolIdentifier === "unknown" ? "other" : telemetry.toolIdentifier;
        if (argsParseError !== void 0) {
          logger56.warn(ctx, "nal.tool_call.args_parse_failure", {
            toolCallId: stream3.toolCallId,
            toolName: loggedToolName,
            toolNameFromModel: stream3.toolName,
            errorClassification: "invalid_args",
            errorMessage: argsParseError instanceof Error ? argsParseError.message : String(argsParseError),
            writtenByteLength: Buffer.byteLength(stream3.written, "utf8"),
            containsArgMarkup: containsGlmToolCallMarkup(stream3.written),
            team: getToolOwnerTeam(telemetry?.toolIdentifier ?? "unknown")
          });
        }
        const approximateInputTokens = approximateTokenCountFromRawArgs(stream3.written);
        if (approximateInputTokens > 0) {
          rawToolCallInputTokens.histogram(ctx, approximateInputTokens, {
            tool_name: loggedToolName
          });
        }
        const pendingWrite = toolCallsIterable.write(descriptor2).catch(() => {
        });
        pendingDescriptorWrites.add(pendingWrite);
        void pendingWrite.finally(() => {
          pendingDescriptorWrites.delete(pendingWrite);
          maybeCloseToolIterables();
        });
      }
    };
    const closeToolIterables = () => {
      shouldCloseToolIterables = true;
      maybeCloseToolIterables();
    };
    try {
      for await (const chunk of innerStream) {
        if (chunk.type === "text-delta") {
          if (chunk.textDelta.length === 0) {
            continue;
          }
          const lastContent = contentBuffer.at(-1);
          if (lastContent !== void 0 && lastContent.type === "text") {
            lastContent.text += chunk.textDelta;
          } else {
            contentBuffer.push({
              type: "text",
              text: chunk.textDelta
            });
          }
        } else if (chunk.type === "reasoning") {
          const incomingProviderOptions = chunk.providerOptions;
          const last = contentBuffer.at(-1);
          if (last !== void 0 && last.type === "reasoning" && last.signature === void 0) {
            last.text += chunk.textDelta;
            const incomingCursor = incomingProviderOptions?.cursor;
            if (incomingCursor?.isAlreadySummarizedThinking === true || incomingCursor?.modelName !== void 0) {
              last.providerOptions = {
                ...last.providerOptions ?? {},
                cursor: {
                  ...last.providerOptions?.cursor ?? {},
                  ...incomingCursor.isAlreadySummarizedThinking === true ? { isAlreadySummarizedThinking: true } : {},
                  ...incomingCursor.modelName !== void 0 ? { modelName: incomingCursor.modelName } : {}
                }
              };
            }
          } else {
            contentBuffer.push({
              type: "reasoning",
              text: chunk.textDelta,
              ...incomingProviderOptions !== void 0 ? { providerOptions: incomingProviderOptions } : {}
            });
          }
        } else if (chunk.type === "redacted-reasoning") {
          const incomingProviderOptions = chunk.providerOptions;
          const last = contentBuffer.at(-1);
          if (last !== void 0 && last.type === "redacted-reasoning") {
            last.data += chunk.data;
            if (incomingProviderOptions?.cursor?.modelName !== void 0) {
              last.providerOptions = {
                ...last.providerOptions ?? {},
                cursor: {
                  ...last.providerOptions?.cursor ?? {},
                  modelName: incomingProviderOptions.cursor.modelName
                }
              };
            }
          } else {
            contentBuffer.push({
              type: "redacted-reasoning",
              data: chunk.data,
              ...incomingProviderOptions !== void 0 ? { providerOptions: incomingProviderOptions } : {}
            });
          }
        } else if (chunk.type === "reasoning-signature") {
          const last = contentBuffer.at(-1);
          if (last !== void 0 && last.type === "reasoning") {
            if (last.signature === void 0) {
              last.signature = chunk.signature;
            } else {
              contentBuffer.push({
                type: "reasoning",
                text: "",
                signature: chunk.signature
              });
            }
          }
        } else if (chunk.type === "tool-call-streaming-start") {
          const hasCurrentStreamForChunk = chunk.toolCallId === currentToolCallId;
          if (!hasStartedToolCall) {
            hasStartedToolCall = true;
          }
          if (handledToolCalls.has(chunk.toolCallId)) {
            logger56.warn(ctx, "nal.tool_call.duplicate_inbound_id", {
              toolCallId: chunk.toolCallId,
              toolName: chunk.toolName,
              chunkType: chunk.type,
              disposition: "dropped"
            });
            duplicateInboundToolCallId.increment(ctx, 1, {
              chunkType: chunk.type,
              disposition: "dropped"
            });
            continue;
          }
          if (!hasCurrentStreamForChunk) {
            closeCurrentStream();
            currentStream = new ToolCallStream(chunk.toolCallId, chunk.toolName, emitToolCallEvents ? createWritableIterable() : void 0);
            currentToolCallId = chunk.toolCallId;
            startToolArgsPreview(ctx, interactionHandler, toolMap[chunk.toolName], currentStream);
            if (currentStream.inner !== void 0) {
              const pendingWrite = toolCallEventsIterable.write({
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName,
                argsStream: currentStream.inner,
                completedArgs: currentStream.completedArgs,
                completedArgsText: currentStream.completedArgsText
              }).catch(() => {
              });
              pendingEventWrites.add(pendingWrite);
              void pendingWrite.finally(() => {
                pendingEventWrites.delete(pendingWrite);
                maybeCloseToolIterables();
              });
            }
          } else if (currentStream !== void 0) {
            if (currentStream.toolName === "") {
              currentStream.toolName = chunk.toolName;
            } else {
              logger56.warn(ctx, "nal.tool_call.duplicate_inbound_id", {
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName,
                chunkType: chunk.type,
                disposition: "merged"
              });
              duplicateInboundToolCallId.increment(ctx, 1, {
                chunkType: chunk.type,
                disposition: "merged"
              });
            }
          }
        } else if (chunk.type === "tool-call-delta" || chunk.type === "tool-call") {
          if (!hasStartedToolCall) {
            hasStartedToolCall = true;
          }
          if (handledToolCalls.has(chunk.toolCallId)) {
            logger56.warn(ctx, "nal.tool_call.duplicate_inbound_id", {
              toolCallId: chunk.toolCallId,
              toolName: chunk.toolName,
              chunkType: chunk.type,
              disposition: "dropped"
            });
            duplicateInboundToolCallId.increment(ctx, 1, {
              chunkType: chunk.type,
              disposition: "dropped"
            });
            continue;
          }
          if (chunk.toolCallId !== currentToolCallId) {
            closeCurrentStream();
            currentStream = new ToolCallStream(chunk.toolCallId, chunk.toolName, emitToolCallEvents ? createWritableIterable() : void 0);
            currentToolCallId = chunk.toolCallId;
            startToolArgsPreview(ctx, interactionHandler, toolMap[chunk.toolName], currentStream);
            if (currentStream.inner !== void 0) {
              const pendingWrite = toolCallEventsIterable.write({
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName,
                argsStream: currentStream.inner,
                completedArgs: currentStream.completedArgs,
                completedArgsText: currentStream.completedArgsText
              }).catch(() => {
              });
              pendingEventWrites.add(pendingWrite);
              void pendingWrite.finally(() => {
                pendingEventWrites.delete(pendingWrite);
                maybeCloseToolIterables();
              });
            }
            if (chunk.type === "tool-call-delta") {
              await currentStream.write(ctx, chunk.argsTextDelta);
            } else {
              const argsString = typeof chunk.args === "string" ? chunk.args : JSON.stringify(chunk.args);
              await currentStream.complete(ctx, argsString);
              closeCurrentStream();
              currentStream = void 0;
              currentToolCallId = void 0;
            }
          } else {
            if (currentStream === void 0) {
              throw new Error("No current stream found");
            }
            if (chunk.type === "tool-call-delta") {
              await currentStream.write(ctx, chunk.argsTextDelta);
            } else {
              const argsString = typeof chunk.args === "string" ? chunk.args : JSON.stringify(chunk.args);
              await currentStream.complete(ctx, argsString);
              closeCurrentStream();
              currentStream = void 0;
              currentToolCallId = void 0;
            }
          }
        }
      }
      closeCurrentStream();
      closeToolIterables();
      const settledResponse = await settledResultResponse;
      if (settledResponse.didReject) {
        throw settledResponse.error;
      }
      response = settledResponse.response;
      if (hasMeaningfulResponseMessageContent(response.messages) && !responseOmitsStreamedToolCall(response.messages, contentBuffer)) {
        newMessages.push(...response.messages);
      } else if (contentBuffer.some(shouldSynthesizeResponseFromStreamContent)) {
        newMessages.push({
          role: "assistant",
          content: sanitizeContentBufferForReplay(contentBuffer),
          id: response.id
        });
      } else {
        newMessages.push(...response.messages);
      }
    } catch (e) {
      closeCurrentStream();
      closeToolIterables();
      await settledResultResponse;
      const messages = [];
      messages.push({
        role: "assistant",
        content: sanitizeContentBufferForReplay(contentBuffer),
        id: "1"
      });
      response = {
        error: e instanceof Error ? e : new Error("Unknown error"),
        messages,
        id: "1",
        timestamp: /* @__PURE__ */ new Date(),
        modelId: "1",
        headers: {}
      };
      newMessages.push(...messages);
    }
    if (firstToolCallHook) {
      await firstToolCallHook(newMessages.map((m2) => JSON.stringify(m2)));
    }
    return {
      ...response,
      messages: newMessages
    };
  })();
  return {
    fullStream,
    toolCalls: toolCallsIterable,
    toolCallEvents: toolCallEventsIterable,
    response: responsePromise,
    usage: result.usage.catch(() => ({
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0
    })),
    extendedUsage: result.extendedUsage.catch(() => ({
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      maxTokens: 0
    })),
    providerMetadata: result.providerMetadata.catch(() => void 0),
    invocationId: result.invocationId
  };
}
function normalizeToolExecutionInput(tools) {
  if (Array.isArray(tools)) {
    return {
      modelVisibleTools: tools,
      additionalExecutableTools: []
    };
  }
  return tools;
}
function executeToolStream(ctx, executor, interactionHandler, tools, extraT, recordToolCallResult, descriptionProps, firstToolCallHook) {
  const toolExecutionSet = normalizeToolExecutionInput(tools);
  const { modelVisibleTools } = toolExecutionSet;
  const executableTools = getExecutableTools(toolExecutionSet);
  const directDynamicToolNames = getDirectDynamicToolNames(toolExecutionSet);
  const executionAliases = executableTools.flatMap((tool) => tool.executionAliases ?? []);
  const toolMap = createToolMap(executableTools);
  const dynamicInvocationToolNames = getDynamicInvocationToolNames(modelVisibleTools);
  const renderProps = {
    allTools: extractToolMetadataMap(executableTools)
  };
  const streamResult = streamModelAndCollectToolCalls(ctx, executor, interactionHandler, modelVisibleTools, descriptionProps, firstToolCallHook, {
    executionToolMap: toolMap,
    acceptedUnadvertisedToolNames: [...directDynamicToolNames, ...executionAliases]
  });
  const responsePromise = (async () => {
    const toolPromises = [];
    const trackToolPromise = (promise) => {
      promise.catch(() => void 0);
      toolPromises.push(promise);
    };
    let execBackendDown = false;
    const circuitBreakerRecordToolCallResult = async (resultCtx, result, loggedToolName, errorClassification) => {
      if (errorClassification === ToolErrorClassification.EXEC_BACKEND_UNAVAILABLE) {
        execBackendDown = true;
      }
      await recordToolCallResult(resultCtx, result, loggedToolName, errorClassification);
    };
    const consumeToolCalls = (async () => {
      for await (const event of streamResult.toolCallEvents) {
        if (execBackendDown) {
          void (async () => {
            try {
              for await (const _2 of event.argsStream) {
              }
            } catch {
            }
          })();
          const skippedToolResult = {
            content: [
              {
                type: "text",
                text: "Execution backend unavailable. Tool execution skipped."
              }
            ],
            isError: true
          };
          const loggedName = toolNameForLogging(event.toolName, toolMap);
          await circuitBreakerRecordToolCallResult(ctx, skippedToolResult, loggedName, ToolErrorClassification.EXEC_BACKEND_UNAVAILABLE);
          const skippedResult = {
            role: "tool",
            id: event.toolCallId,
            content: [
              {
                type: "tool-result",
                toolName: event.toolName,
                toolCallId: event.toolCallId,
                result: "Execution backend unavailable. Tool execution skipped."
              }
            ]
          };
          toolPromises.push(Promise.resolve(skippedResult));
          logger56.warn(ctx, "nal.tool_call.skipped_exec_backend_down", {
            toolCallId: event.toolCallId,
            toolName: event.toolName
          });
          continue;
        }
        if (dynamicInvocationToolNames.has(event.toolName)) {
          const drainOuterArgs = drainArgsStream(event.argsStream).catch(() => {
          });
          const [outerArgs, outerArgsText] = await Promise.all([
            event.completedArgs,
            event.completedArgsText
          ]);
          await drainOuterArgs;
          const outerDescriptor = {
            toolCallId: event.toolCallId,
            toolName: event.toolName,
            args: outerArgs
          };
          const descriptor3 = resolveEffectiveToolCallDescriptor(outerDescriptor, toolExecutionSet);
          const { effectiveNativeToolCall } = descriptor3;
          const argsIterable = effectiveNativeToolCall === void 0 ? createOneShotStringIterable(outerArgsText) : createOneShotArgsIterable(effectiveNativeToolCall.args);
          trackToolPromise(executeDeferredToolCall(ctx, descriptor3, toolMap, interactionHandler, extraT, circuitBreakerRecordToolCallResult, renderProps, argsIterable, void 0, directDynamicToolNames));
          continue;
        }
        const descriptor2 = {
          toolCallId: event.toolCallId,
          toolName: event.toolName,
          args: {}
        };
        trackToolPromise(executeDeferredToolCall(ctx, descriptor2, toolMap, interactionHandler, extraT, circuitBreakerRecordToolCallResult, renderProps, event.argsStream, event.completedArgs, directDynamicToolNames));
      }
    })();
    const [response] = await Promise.all([streamResult.response, consumeToolCalls]);
    const isValidToolResult = (toolId) => {
      return response.messages.some((p2) => p2.role === "assistant" && Array.isArray(p2.content) && p2.content.some((c) => c.type === "tool-call" && c.toolCallId === toolId));
    };
    let toolResults;
    try {
      toolResults = await Promise.all(toolPromises);
    } catch (error3) {
      if (error3 instanceof DeferredInteractionResponseError) {
        const settled = await Promise.allSettled(toolPromises);
        completedToolResultsByDeferredError.set(error3, settled.flatMap((outcome) => outcome.status === "fulfilled" && isValidToolResult(outcome.value.id) ? [outcome.value] : []));
        throw error3;
      }
      if (!isAgentStreamStartTimeoutRecoveryTurnError(error3)) {
        throw error3;
      }
      return {
        ...response,
        error: error3 instanceof Error ? error3 : new Error("Unknown tool error")
      };
    }
    const newMessages = [...response.messages, ...toolResults.filter((r) => isValidToolResult(r.id))];
    return {
      ...response,
      messages: newMessages
    };
  })();
  return {
    fullStream: streamResult.fullStream,
    response: responsePromise,
    providerMetadata: streamResult.providerMetadata,
    usage: streamResult.usage,
    extendedUsage: streamResult.extendedUsage,
    invocationId: streamResult.invocationId
  };
}
function executeModelStreamOnly(ctx, executor, interactionHandler, tools, descriptionProps, firstToolCallHook) {
  const toolExecutionSet = normalizeToolExecutionInput(tools);
  const { modelVisibleTools } = toolExecutionSet;
  const executableTools = getExecutableTools(toolExecutionSet);
  const directDynamicToolNames = getDirectDynamicToolNames(toolExecutionSet);
  const executionAliases = executableTools.flatMap((tool) => tool.executionAliases ?? []);
  const streamResult = streamModelAndCollectToolCalls(ctx, executor, interactionHandler, modelVisibleTools, descriptionProps, firstToolCallHook, {
    emitToolCallEvents: false,
    acceptedUnadvertisedToolNames: [...directDynamicToolNames, ...executionAliases]
  });
  const toolCallDescriptors = (async () => {
    const descriptors = [];
    for await (const descriptor2 of streamResult.toolCalls) {
      descriptors.push(resolveEffectiveToolCallDescriptor(descriptor2, toolExecutionSet));
    }
    return descriptors;
  })();
  return {
    fullStream: streamResult.fullStream,
    response: streamResult.response,
    providerMetadata: streamResult.providerMetadata,
    usage: streamResult.usage,
    extendedUsage: streamResult.extendedUsage,
    invocationId: streamResult.invocationId,
    toolCallDescriptors
  };
}
var BaseRedactedPromptBuilder = class {
  constructor(initialMessages) {
    this.messages = [];
    if (initialMessages) {
      this.messages = [...initialMessages];
    }
  }
  appendMessages(messages) {
    const arr = Array.isArray(messages) ? messages : [messages];
    this.messages.push(...arr);
    return this;
  }
  getState() {
    return [...this.messages];
  }
  getMessages() {
    return [...this.messages];
  }
  clearMessages() {
    this.messages = [];
  }
};
var SimplePromptToolExecutor = class {
  constructor(innerExecutor) {
    this.innerExecutor = innerExecutor;
  }
  appendMessages(messages) {
    this.innerExecutor.appendMessages(messages);
    return this;
  }
  getState() {
    return this.innerExecutor.getState();
  }
  getMessages() {
    return this.innerExecutor.getMessages();
  }
  clearMessages() {
    this.innerExecutor.clearMessages();
  }
  executeToolStream(ctx, _state, interactionHandler, tools, extraT, recordToolCallResult, descriptionProps, firstToolCallHook) {
    return executeToolStream(ctx, this.innerExecutor, interactionHandler, tools, extraT, recordToolCallResult, descriptionProps, firstToolCallHook);
  }
  executeModelStreamOnly(ctx, _state, interactionHandler, tools, descriptionProps, firstToolCallHook) {
    return executeModelStreamOnly(ctx, this.innerExecutor, interactionHandler, tools, descriptionProps, firstToolCallHook);
  }
  stream(ctx, invocationId, tools, options2) {
    return this.innerExecutor.stream(ctx, invocationId, tools, options2);
  }
};
var RedactedPromptToolExecutor = class {
  constructor(innerToolExecutor, privacyMode) {
    this.innerToolExecutor = innerToolExecutor;
    this.privacyMode = privacyMode;
    this.redactedWrapperMemo = /* @__PURE__ */ new WeakMap();
  }
  wrapStablePlainMessages(plainMessages) {
    return plainMessages.map((plainMessage) => {
      const memoized = this.redactedWrapperMemo.get(plainMessage);
      if (memoized !== void 0) {
        return memoized;
      }
      const [wrapped] = toRedactedCoreMessages([plainMessage], this.privacyMode);
      this.redactedWrapperMemo.set(plainMessage, wrapped);
      return wrapped;
    });
  }
  appendMessages(messages) {
    const arr = Array.isArray(messages) ? messages : [messages];
    const plain = fromRedactedCoreMessages(arr, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    for (let i = 0; i < plain.length; i++) {
      const wrapper = arr[i];
      const plainMessage = plain[i];
      if (wrapper !== void 0 && plainMessage !== void 0) {
        this.redactedWrapperMemo.set(plainMessage, wrapper);
      }
    }
    this.innerToolExecutor.appendMessages(plain);
    return this;
  }
  getState() {
    return this.wrapStablePlainMessages(this.innerToolExecutor.getState());
  }
  getMessages() {
    return this.wrapStablePlainMessages(this.innerToolExecutor.getMessages());
  }
  clearMessages() {
    this.innerToolExecutor.clearMessages();
    this.redactedWrapperMemo = /* @__PURE__ */ new WeakMap();
  }
  runWithToolCallEventRecorder(ctx, fn) {
    return this.innerToolExecutor.runWithToolCallEventRecorder === void 0 ? fn(ctx) : this.innerToolExecutor.runWithToolCallEventRecorder(ctx, fn);
  }
  executeToolStream(ctx, state, interactionHandler, tools, extraT, recordToolCallResult, descriptionProps, firstToolCallHook) {
    return this.innerToolExecutor.executeToolStream(ctx, state, interactionHandler, tools, extraT, recordToolCallResult, descriptionProps, firstToolCallHook);
  }
  executeModelStreamOnly(ctx, state, interactionHandler, tools, descriptionProps, firstToolCallHook) {
    return this.innerToolExecutor.executeModelStreamOnly(ctx, state, interactionHandler, tools, descriptionProps, firstToolCallHook);
  }
  stream(ctx, invocationId, tools, options2) {
    return this.innerToolExecutor.stream(ctx, invocationId, tools, options2);
  }
};

