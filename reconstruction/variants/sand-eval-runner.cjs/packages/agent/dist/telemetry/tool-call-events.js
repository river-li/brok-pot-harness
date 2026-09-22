/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/telemetry/tool-call-events.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
function toolCallAuditOutcomeOf(error3) {
  if (typeof error3 !== "object" || error3 === null)
    return void 0;
  const outcome = error3.toolCallAuditOutcome;
  return outcome === "denied" || outcome === "cancelled" ? outcome : void 0;
}
var TOOL_CALL_EVENT_DEFERRED_ERROR_CLASS = "DeferredInteractionResponseError";
var TOOL_CALL_EVENT_RESULT_ERROR_CLASS = "tool_result_error";
var TOOL_CALL_EVENT_TOOL_NOT_FOUND_ERROR_CLASS = "tool_not_found";
var TOOL_CALL_EVENT_UNKNOWN_ERROR_CLASS = "Error";
var ERROR_CLASS_NAME_PATTERN = /^[A-Za-z_$][\w$.-]{0,63}$/;
function boundedErrorClassName(name17) {
  const trimmed = name17?.trim();
  return trimmed !== void 0 && trimmed !== "Error" && ERROR_CLASS_NAME_PATTERN.test(trimmed) ? trimmed : void 0;
}
function toolCallErrorClassOf(error3) {
  if (error3 instanceof DeferredInteractionResponseError) {
    return TOOL_CALL_EVENT_DEFERRED_ERROR_CLASS;
  }
  if (error3 instanceof Error) {
    return boundedErrorClassName(error3.constructor?.name) ?? TOOL_CALL_EVENT_UNKNOWN_ERROR_CLASS;
  }
  return TOOL_CALL_EVENT_UNKNOWN_ERROR_CLASS;
}
function measureRenderedToolResult(rendered) {
  let resultChars = 0;
  let resultImages = 0;
  for (const part of rendered.content) {
    if (part.type === "text") {
      resultChars += part.text.length;
    } else if (part.type === "image") {
      resultImages += 1;
    }
  }
  return { resultChars, resultImages };
}
var toolCallEventRecorderKey = createKey(/* @__PURE__ */ Symbol("toolCallEventRecorder"), void 0);
function recordToolCallSettled(recorder, ctx, observation) {
  try {
    recorder.recordToolCall(ctx, observation);
  } catch {
  }
}
function toToolCallEvent(ctx, observation, step) {
  const conversationId = ctx.get(conversationIdKey2);
  const subagentType = ctx.get(subagentTypeKey2);
  const parentRequestId = ctx.get(parentRequestIdKey2);
  const rootParentRequestId = ctx.get(rootParentRequestIdKey2);
  const parentAgentToolCallId = ctx.get(parentAgentToolCallIdKey2);
  const requestId = ctx.get(requestIdKey2);
  return {
    ...conversationId !== void 0 ? { conversationId } : {},
    ...subagentType !== void 0 ? { subagentType } : {},
    ...parentRequestId !== void 0 ? { parentRequestId } : {},
    ...rootParentRequestId !== void 0 ? { rootParentRequestId } : {},
    ...parentAgentToolCallId !== void 0 ? { parentAgentToolCallId } : {},
    ...requestId !== void 0 ? { requestId } : {},
    ...step.invocationId !== void 0 ? { invocationId: step.invocationId } : {},
    ...step.modelId !== void 0 ? { modelId: step.modelId } : {},
    ...observation
  };
}
var ToolCallStepTracker = class {
  constructor(options2) {
    this.options = options2;
    this.pending = [];
    this.stepEnded = false;
  }
  recordToolCall(ctx, observation) {
    if (observation.errorClass === TOOL_CALL_EVENT_DEFERRED_ERROR_CLASS) {
      return;
    }
    this.pending.push({ ctx, observation });
    this.flush();
  }
  attachStep(result) {
    result.invocationId.then((id) => {
      this.invocationId = id;
    }, () => void 0);
    result.response.then(() => this.endStep(), () => this.endStep());
  }
  endStep(invocationId) {
    if (invocationId !== void 0)
      this.invocationId = invocationId;
    this.stepEnded = true;
    this.flush();
  }
  flush() {
    if (!this.stepEnded || this.pending.length === 0) {
      return;
    }
    const modelId = this.options.getModelId?.();
    const batch = this.pending.splice(0).map(({ ctx, observation }) => toToolCallEvent(ctx, observation, {
      invocationId: this.invocationId,
      modelId
    }));
    try {
      this.options.onEvents(batch);
    } catch {
    }
  }
};
function createToolCallEventMiddleware(options2) {
  return (executor) => ({
    appendMessages(messages) {
      executor.appendMessages(messages);
      return this;
    },
    getMessages() {
      return executor.getMessages();
    },
    getState() {
      return executor.getState();
    },
    clearMessages() {
      executor.clearMessages();
    },
    executeToolStream(ctx, state, interactionHandler, tools, extraT, recordToolCallResult, descriptionProps, firstToolCallHook) {
      const tracker = new ToolCallStepTracker(options2);
      const result = executor.executeToolStream(ctx.with(toolCallEventRecorderKey, tracker), state, interactionHandler, tools, extraT, recordToolCallResult, descriptionProps, firstToolCallHook);
      tracker.attachStep(result);
      return result;
    },
    executeModelStreamOnly(ctx, state, interactionHandler, tools, descriptionProps, firstToolCallHook) {
      return executor.executeModelStreamOnly(ctx, state, interactionHandler, tools, descriptionProps, firstToolCallHook);
    },
    stream(ctx, invocationId, tools, options3) {
      return executor.stream(ctx, invocationId, tools, options3);
    },
    // The deferred calls a resume completes settle here, not in a model step:
    // one batch for them, tagged with the resume's invocation.
    async runWithToolCallEventRecorder(ctx, fn) {
      const tracker = new ToolCallStepTracker(options2);
      try {
        return await fn(ctx.with(toolCallEventRecorderKey, tracker));
      } finally {
        tracker.endStep(getInvocationId(ctx));
      }
    }
  });
}

