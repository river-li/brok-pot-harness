var __addDisposableResource5 = function(env, value, async) {
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
var __disposeResources5 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error41, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error41, e.suppressed = suppressed, e;
});
var logger17 = createLogger("interaction-handler");
var THINKING_RELATED_CHUNK_TYPES = [
  "reasoning",
  "reasoning-signature",
  "redacted-reasoning"
];
var toolCallLatency = createHistogram("agent.tool_call.latency_ms", {
  description: "Latency of tool calls in milliseconds",
  labelNames: ["tool_name"]
});
var toolCallCount = createCounter("agent.tool_call.count", {
  description: "Total number of tool calls executed",
  labelNames: ["tool_name"]
});
var toolCallOutputTokens = createHistogram("agent.tool_call.output_tokens", {
  description: "Approximate number of tokens in tool call output (text.length / 4)",
  labelNames: ["tool_name"]
});
var toolCallResultTokens = createHistogram("agent.tool_call_result_tokens", {
  description: "Number of tokens in tool call result content",
  labelNames: ["tool_name", "success"]
});
var InteractionHandler = class {
  constructor(interactionProvider, toolCallRecorder, invocationId, overrideSignal, thinkingStyle, singleMessageLoopDetection = false, onThinkingCompleted) {
    this.interactionProvider = interactionProvider;
    this.toolCallRecorder = toolCallRecorder;
    this.invocationId = invocationId;
    this.overrideSignal = overrideSignal;
    this.thinkingStyle = thinkingStyle;
    this.onThinkingCompleted = onThinkingCompleted;
    this.latestToolCallsById = /* @__PURE__ */ new Map();
    this.shouldPreserveArgsOnErrorCallIds = /* @__PURE__ */ new Set();
    this.toolCallStartedAtMsByCallId = /* @__PURE__ */ new Map();
    this.leftoverTokenCharCount = 0;
    this.singleMessageLoopPolicy = normalizeAgentSingleMessageLoopDetection(singleMessageLoopDetection);
  }
  getOrCreateToolCallStartedAtMs(callId, candidate) {
    const existing = this.toolCallStartedAtMsByCallId.get(callId);
    if (existing !== void 0) {
      return existing;
    }
    const candidateNumber = candidate === void 0 ? void 0 : Number(candidate);
    const startedAtMs = candidateNumber !== void 0 && Number.isSafeInteger(candidateNumber) && candidateNumber > 0 ? candidateNumber : Date.now();
    this.toolCallStartedAtMsByCallId.set(callId, startedAtMs);
    return startedAtMs;
  }
  /** Expose the underlying InteractionListener for use with typed query helpers. */
  get listener() {
    return this.interactionProvider;
  }
  /** Returns the cancellation signal governing the current tool invocation. */
  getAbortSignal(ctx) {
    return this.overrideSignal ?? ctx.signal;
  }
  /**
   * Preserve streamed arguments for tools whose error serializer cannot
   * reconstruct them from the thrown error.
   */
  markToolCallForArgPreservation(callId) {
    this.shouldPreserveArgsOnErrorCallIds.add(callId);
  }
  rememberToolCallForArgPreservation(callId, toolCall) {
    this.rememberLatestToolCall(callId, toolCall);
  }
  applyArgsFromLatestToolCall(callId, incomingToolCall) {
    const latestToolCall = this.latestToolCallsById.get(callId);
    if (latestToolCall === void 0 || latestToolCall.tool.case !== incomingToolCall.tool.case) {
      return incomingToolCall;
    }
    const mergedToolCall = incomingToolCall.clone();
    if (mergedToolCall.tool.case === "createAgentToolCall" && latestToolCall.tool.case === "createAgentToolCall") {
      const latestArgs = latestToolCall.tool.value.args;
      if (latestArgs !== void 0) {
        mergedToolCall.tool.value.args = latestArgs.clone();
      }
      return mergedToolCall;
    }
    if (mergedToolCall.tool.case === "sendToAgentToolCall" && latestToolCall.tool.case === "sendToAgentToolCall") {
      const latestArgs = latestToolCall.tool.value.args;
      if (latestArgs !== void 0) {
        mergedToolCall.tool.value.args = latestArgs.clone();
      }
      return mergedToolCall;
    }
    if (mergedToolCall.tool.case === "editToolCall" && latestToolCall.tool.case === "editToolCall") {
      const latestArgs = latestToolCall.tool.value.args;
      if (latestArgs === void 0) {
        return mergedToolCall;
      }
      const mergedArgs = mergedToolCall.tool.value.args;
      if (mergedArgs === void 0) {
        mergedToolCall.tool.value.args = latestArgs.clone();
        return mergedToolCall;
      }
      if (mergedArgs.path.length === 0 && latestArgs.path.length > 0) {
        mergedArgs.path = latestArgs.path;
      }
      if (mergedArgs.streamContent === void 0 && latestArgs.streamContent !== void 0) {
        mergedArgs.streamContent = latestArgs.streamContent;
      }
      return mergedToolCall;
    }
    return mergedToolCall;
  }
  rememberLatestToolCall(callId, toolCall) {
    if (!this.shouldPreserveArgsOnErrorCallIds.has(callId)) {
      return;
    }
    this.latestToolCallsById.set(callId, this.applyArgsFromLatestToolCall(callId, toolCall));
  }
  async upsertRecordedToolCall(ctx, callId, toolCall) {
    if (this.toolCallRecorder.upsertToolCall !== void 0) {
      await this.toolCallRecorder.upsertToolCall(ctx, toolCall, callId);
      return;
    }
    this.toolCallRecorder.recordToolCall(toolCall, callId);
  }
  applyDeltaToLatestToolCall(callId, toolCallDelta) {
    if (!this.shouldPreserveArgsOnErrorCallIds.has(callId)) {
      return;
    }
    const latestToolCall = this.latestToolCallsById.get(callId);
    if (latestToolCall?.tool.case !== "editToolCall" || toolCallDelta.delta.case !== "editToolCallDelta") {
      return;
    }
    const editToolCall = latestToolCall.tool.value;
    editToolCall.args ??= new EditArgs();
    editToolCall.args.streamContent = (editToolCall.args.streamContent ?? "") + toolCallDelta.delta.value.streamContentDelta;
  }
  withToolCallMetadata(callId, toolCall, timestamps) {
    const startedAtMs = timestamps?.startedAtMs !== void 0 ? BigInt(timestamps.startedAtMs) : void 0;
    const completedAtMs = timestamps?.completedAtMs !== void 0 ? BigInt(timestamps.completedAtMs) : void 0;
    if (toolCall.toolCallId === callId && (startedAtMs === void 0 || toolCall.startedAtMs === startedAtMs) && (completedAtMs === void 0 || toolCall.completedAtMs === completedAtMs)) {
      return toolCall;
    }
    const stamped = toolCall.clone();
    stamped.toolCallId = callId;
    if (startedAtMs !== void 0) {
      stamped.startedAtMs = startedAtMs;
    }
    if (completedAtMs !== void 0) {
      stamped.completedAtMs = completedAtMs;
    }
    return stamped;
  }
  async emitTokenDeltaFromChars(ctx, newChars) {
    const combinedLength = this.leftoverTokenCharCount + newChars.length;
    const tokens = Math.floor(combinedLength / 4);
    this.leftoverTokenCharCount = combinedLength % 4;
    if (tokens > 0) {
      await this.interactionProvider.sendUpdate(ctx, Updates.tokenDelta(tokens));
    }
  }
  /** Checks if an error is consumer-side (e.g. Redis push failures) rather than model-side. */
  isConsumerSideError(error41) {
    if (!(error41 instanceof Error)) {
      return false;
    }
    if (error41.name === "CacheRuntimeError" || error41.message.includes("Cache operation") || error41.message.includes("Redis") || error41.message.includes("xadd")) {
      return true;
    }
    const stack = error41.stack ?? "";
    const stackFrames = stack.split("\n").slice(1).join("\n");
    return stackFrames.includes("sendUpdate") || stackFrames.includes("appendUpdateToConversationStreamAsync") || stackFrames.includes("pushAsync") || stackFrames.includes("conversationStream");
  }
  async consumeStream(ctx, fullStream, textHandler) {
    let _textAccumulator = "";
    let assistantStartTime;
    let currentAssistantActive = false;
    let thinkingAccumulator = "";
    let thinkingStartTime;
    let currentThinkingActive = false;
    const loopPolicy = this.singleMessageLoopPolicy;
    const singleMessageLoopDetector = loopPolicy !== void 0 ? new SingleMessageLoopDetector2() : null;
    const reasoningLoopDetector = loopPolicy !== void 0 ? new SingleMessageLoopDetector2() : null;
    const sealCurrentAssistant = async () => {
      if (!currentAssistantActive || assistantStartTime === void 0) {
        return;
      }
      currentAssistantActive = false;
      const startedAtMs = BigInt(assistantStartTime);
      const completedAtMs = BigInt(Date.now());
      assistantStartTime = void 0;
      if (textHandler.completeOpenMessageStep !== void 0) {
        textHandler.completeOpenMessageStep(completedAtMs);
        return;
      }
      await textHandler.recordText(ctx, "", startedAtMs, completedAtMs);
    };
    const sealCurrentThinking = async () => {
      if (!currentThinkingActive || thinkingStartTime === void 0) {
        return;
      }
      currentThinkingActive = false;
      if (reasoningLoopDetector !== null) {
        checkForAgentSingleMessageLooping({
          ctx,
          newText: "\n",
          detector: reasoningLoopDetector,
          caller: "nal",
          channel: "reasoning",
          reporting: loopPolicy?.reporting
        });
      }
      const completedAtMs = Date.now();
      const duration3 = Math.max(1, completedAtMs - thinkingStartTime);
      const startedAtMs = BigInt(thinkingStartTime);
      await this.interactionProvider.sendUpdate(ctx, Updates.thinkingCompleted(duration3, startedAtMs));
      await textHandler.recordThinking(ctx, "", duration3, startedAtMs, BigInt(completedAtMs));
      thinkingStartTime = void 0;
      const completedThinkingText = thinkingAccumulator;
      thinkingAccumulator = "";
      void this.onThinkingCompleted?.(ctx, {
        text: completedThinkingText,
        durationMs: duration3
      }).catch((error41) => {
        logger17.warn(ctx, "afterAgentThought hook callback failed", {
          error: error41 instanceof Error ? error41.message : String(error41)
        });
      });
    };
    try {
      for await (const chunk of fullStream) {
        if (chunk.type === "reasoning-signature") {
          await sealCurrentAssistant();
          if (thinkingAccumulator.length > 0) {
            await sealCurrentThinking();
          }
          continue;
        }
        if (currentThinkingActive && !THINKING_RELATED_CHUNK_TYPES.includes(chunk.type)) {
          await sealCurrentThinking();
        }
        if (currentAssistantActive && chunk.type !== "text-delta") {
          await sealCurrentAssistant();
        }
        if (chunk.type === "text-delta") {
          if (!currentAssistantActive || assistantStartTime === void 0) {
            assistantStartTime = Date.now();
            currentAssistantActive = true;
          }
          const startedAtMs = BigInt(assistantStartTime);
          _textAccumulator += chunk.textDelta;
          if (singleMessageLoopDetector !== null) {
            const singleMessageLoopResult = checkForAgentSingleMessageLooping({
              ctx,
              newText: chunk.textDelta,
              detector: singleMessageLoopDetector,
              caller: "nal",
              reporting: loopPolicy?.reporting
            });
            if (singleMessageLoopResult.loopDetected && loopPolicy?.responseAction === "retry_once") {
              throw new AgentLoopError({
                loopType: "singleMessage",
                loopKind: singleMessageLoopResult.loopKind ?? "single_message_multi_line",
                repetitions: singleMessageLoopResult.repetitions ?? 0,
                period: singleMessageLoopResult.period,
                evidenceFingerprint: singleMessageLoopResult.evidenceFingerprint
              });
            }
          }
          await this.interactionProvider.sendUpdate(ctx, Updates.textDelta(chunk.textDelta, startedAtMs));
          await this.emitTokenDeltaFromChars(ctx, chunk.textDelta);
          await textHandler.recordText(ctx, chunk.textDelta, startedAtMs);
        } else if (THINKING_RELATED_CHUNK_TYPES.includes(chunk.type)) {
          let activeThinkingStartTime = thinkingStartTime;
          if (!currentThinkingActive || activeThinkingStartTime === void 0) {
            activeThinkingStartTime = Date.now();
            thinkingStartTime = activeThinkingStartTime;
            currentThinkingActive = true;
          }
          const startedAtMs = BigInt(activeThinkingStartTime);
          let delta = "";
          if (chunk.type === "reasoning") {
            delta = chunk.textDelta;
          }
          thinkingAccumulator += delta;
          if (reasoningLoopDetector !== null && delta.length > 0) {
            checkForAgentSingleMessageLooping({
              ctx,
              newText: delta,
              detector: reasoningLoopDetector,
              caller: "nal",
              channel: "reasoning",
              reporting: loopPolicy?.reporting
            });
          }
          await this.interactionProvider.sendUpdate(ctx, Updates.thinkingDelta(delta, this.thinkingStyle, startedAtMs));
          await this.emitTokenDeltaFromChars(ctx, delta);
          await textHandler.recordThinking(ctx, delta, void 0, startedAtMs);
        } else if (chunk.type === "tool-call-delta") {
          await this.emitTokenDeltaFromChars(ctx, chunk.argsTextDelta);
        }
      }
    } catch (error41) {
      if (error41 instanceof AgentLoopError && error41.loopType === "singleMessage") {
        throw error41;
      }
      if (error41 instanceof InputTokenLimitError) {
        logger17.warn(ctx, "InputTokenLimitError will trigger blocking summarization", { error: error41 });
        return;
      }
      const streamAbortReason = ctx.reason;
      const isStreamIntentionalAbort = ctx.canceled && streamAbortReason?.intentional === true;
      if (isStreamIntentionalAbort) {
        logger17.info(ctx, "consumeStream aborted (intentional cancellation)", {
          error: error41,
          intentionalAbort: true,
          abortReason: streamAbortReason?.reason
        });
      } else {
        logger17.error(ctx, "Error in consumeStream", error41);
      }
      if (this.isConsumerSideError(error41)) {
        throw error41;
      }
    } finally {
      await sealCurrentThinking();
      await sealCurrentAssistant();
      textHandler.completeOpenMessageStep?.(BigInt(Date.now()));
    }
  }
  async emitPartialToolCall(ctx, callId, toolCall) {
    const startedAtMs = this.getOrCreateToolCallStartedAtMs(callId, toolCall.startedAtMs);
    const toolCallWithId = this.withToolCallMetadata(callId, toolCall, {
      startedAtMs
    });
    this.rememberLatestToolCall(callId, toolCallWithId);
    await this.interactionProvider.sendUpdate(ctx, Updates.partialToolCall(callId, toolCallWithId, this.invocationId));
  }
  async recordPendingToolCall(ctx, callId, toolCall) {
    const startedAtMs = this.getOrCreateToolCallStartedAtMs(callId, toolCall.startedAtMs);
    const toolCallWithId = this.withToolCallMetadata(callId, toolCall, {
      startedAtMs
    });
    const redactedToolCall = toRedactedToolCall(toolCallWithId, PrivacyMode.UNSPECIFIED);
    if (this.toolCallRecorder.recordPendingToolCall !== void 0) {
      await this.toolCallRecorder.recordPendingToolCall(ctx, redactedToolCall, callId);
      return;
    }
    await this.upsertRecordedToolCall(ctx, callId, redactedToolCall);
  }
  async emitToolCallDelta(ctx, callId, toolCallDelta) {
    this.applyDeltaToLatestToolCall(callId, toolCallDelta);
    const startedAtMs = this.getOrCreateToolCallStartedAtMs(callId, void 0);
    await this.interactionProvider.sendUpdate(ctx, Updates.toolCallDelta(callId, toolCallDelta, this.invocationId, BigInt(startedAtMs)));
  }
  // Errors are thrown from the tool, so we need to send the error result and complete the tool call.
  async emitToolCallError(ctx, callId, erroredToolCall) {
    const shouldPreserveArgs = this.shouldPreserveArgsOnErrorCallIds.has(callId);
    const toolCallWithArgs = shouldPreserveArgs ? this.applyArgsFromLatestToolCall(callId, erroredToolCall) : erroredToolCall;
    const startedAtMs = this.getOrCreateToolCallStartedAtMs(callId, toolCallWithArgs.startedAtMs);
    const toolCallWithId = this.withToolCallMetadata(callId, toolCallWithArgs, {
      startedAtMs,
      completedAtMs: Date.now()
    });
    this.toolCallStartedAtMsByCallId.delete(callId);
    this.latestToolCallsById.delete(callId);
    this.shouldPreserveArgsOnErrorCallIds.delete(callId);
    await this.interactionProvider.sendUpdate(ctx, Updates.toolCallCompleted(callId, toolCallWithId, this.invocationId));
    const redactedToolCall = toRedactedToolCall(toolCallWithId, PrivacyMode.UNSPECIFIED);
    if (toolCallWithId.tool.case === "askQuestionToolCall" || toolCallWithId.tool.case === "mcpAuthToolCall") {
      await this.upsertRecordedToolCall(ctx, callId, redactedToolCall);
    } else {
      this.toolCallRecorder.recordToolCall(redactedToolCall, callId);
    }
  }
  async recordToolCallResult(ctx, result, loggedToolName, errorClassification) {
    let totalTextLength = 0;
    for (const part of result.content) {
      if (part.type === "text") {
        totalTextLength += part.text.length;
        await this.emitTokenDeltaFromChars(ctx, part.text);
      }
    }
    if (totalTextLength > 0) {
      const approximateTokens = Math.floor(totalTextLength / 4);
      toolCallOutputTokens.histogram(ctx, approximateTokens, {
        tool_name: loggedToolName
      });
      toolCallResultTokens.histogram(ctx, approximateTokens, {
        tool_name: loggedToolName,
        success: errorClassification === void 0 ? "true" : "false"
      });
    }
  }
  /**
   * Sends a heartbeat update to keep the connection alive during long-running operations.
   */
  async sendHeartbeat(ctx) {
    await this.interactionProvider.sendUpdate(ctx, Updates.heartbeat());
  }
  /**
   * Execute a single tool call with start/completion update bookkeeping and
   * an optional central flush of hook additional contexts onto the outer
   * `ToolCall.hookAdditionalContexts`.
   *
   * `hookContextCollector`, when provided (almost always
   * `meta.hookContextCollector` from the tool handler), is appended to the
   * resulting tool call's `hookAdditionalContexts` after `resultMergeFn`
   * builds it but before the completion update is sent. This is the single
   * write site for the carriers; per-tool handlers no longer mutate
   * `result.hookAdditionalContexts` (the field is gone from per-tool result
   * protos), and they do not need to thread the collector themselves.
   * Callers without hooks may omit the argument.
   */
  async executeToolCall(parentCtx, toolCall, callId, promiseFn, resultMergeFn, hookContextCollector) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource5(env_1, createSpan(parentCtx.withName("executeToolCall")), false);
      const ctx = spanCtxt.ctx;
      const toolCallStartedAtMs = this.getOrCreateToolCallStartedAtMs(callId, toolCall.startedAtMs);
      const startSendStartMs = Date.now();
      {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
          const startSendSpan = __addDisposableResource5(env_2, createSpan(ctx.withName("executeToolCall.sendStartUpdate")), false);
          const toolCallWithId = this.withToolCallMetadata(callId, toolCall, {
            startedAtMs: toolCallStartedAtMs
          });
          this.rememberLatestToolCall(callId, toolCallWithId);
          await this.interactionProvider.sendUpdate(startSendSpan.ctx, Updates.toolCallStarted(callId, toolCallWithId, this.invocationId));
        } catch (e_1) {
          env_2.error = e_1;
          env_2.hasError = true;
        } finally {
          __disposeResources5(env_2);
        }
      }
      const startSendMs = Date.now() - startSendStartMs;
      if (startSendMs > 1e3) {
        logger17.warn(ctx, "nal.await_stall.start_send_slow", {
          callId,
          toolName: toolCall.tool?.case ?? "unknown",
          startSendMs
        });
      }
      const startTime = Date.now();
      let result;
      const abortSignal = this.getAbortSignal(ctx);
      const resolvers = Promise.withResolvers();
      if (abortSignal.aborted) {
        throw new ToolCallAbortedError();
      } else {
        abortSignal.addEventListener("abort", () => {
          resolvers.reject(new ToolCallAbortedError());
        }, { once: true });
      }
      promiseFn(ctx).then((r) => {
        result = r;
        const newToolCall2 = resultMergeFn(r);
        if (hookContextCollector && hookContextCollector.length > 0) {
          newToolCall2.hookAdditionalContexts.push(...hookContextCollector);
        }
        resolvers.resolve(newToolCall2);
      }).catch((error41) => {
        resolvers.reject(error41);
      });
      const newToolCall = this.withToolCallMetadata(callId, await resolvers.promise, { startedAtMs: toolCallStartedAtMs, completedAtMs: Date.now() });
      this.toolCallStartedAtMsByCallId.delete(callId);
      this.rememberLatestToolCall(callId, newToolCall);
      const toolExecutionMs = Date.now() - startTime;
      const toolName = toolCall.tool?.case ?? "unknown";
      toolCallLatency.histogram(ctx, toolExecutionMs, { tool_name: toolName });
      toolCallCount.increment(ctx, 1, { tool_name: toolName });
      const completionSendStartMs = Date.now();
      {
        const env_3 = { stack: [], error: void 0, hasError: false };
        try {
          const completionSendSpan = __addDisposableResource5(env_3, createSpan(ctx.withName("executeToolCall.sendCompletionUpdate")), false);
          await this.interactionProvider.sendUpdate(completionSendSpan.ctx, Updates.toolCallCompleted(callId, newToolCall, this.invocationId));
        } catch (e_2) {
          env_3.error = e_2;
          env_3.hasError = true;
        } finally {
          __disposeResources5(env_3);
        }
      }
      const completionSendMs = Date.now() - completionSendStartMs;
      if (completionSendMs > 1e3) {
        logger17.warn(ctx, "nal.await_stall.completion_send_slow", {
          callId,
          toolName,
          toolExecutionMs,
          completionSendMs
        });
      }
      const redactedToolCall = toRedactedToolCall(newToolCall, PrivacyMode.UNSPECIFIED);
      if (newToolCall.tool.case === "askQuestionToolCall" || newToolCall.tool.case === "mcpAuthToolCall") {
        await this.upsertRecordedToolCall(ctx, callId, redactedToolCall);
      } else {
        this.toolCallRecorder.recordToolCall(redactedToolCall, callId);
      }
      this.latestToolCallsById.delete(callId);
      this.shouldPreserveArgsOnErrorCallIds.delete(callId);
      return result;
    } catch (e_3) {
      env_1.error = e_3;
      env_1.hasError = true;
    } finally {
      __disposeResources5(env_1);
    }
  }
  async query(ctx, query) {
    return this.interactionProvider.query(ctx, query);
  }
};
