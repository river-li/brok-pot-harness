init_dist3();
init_errors();
var logger103 = createLogger("sand:turn-performance");
var turnToolCallAttributionStartKey = createKey(
  /* @__PURE__ */ Symbol("turnToolCallAttributionStart"),
  void 0
);
var turnTtfi = createHistogram("grok_bot.turn.ttfi_ms", {
  labelNames: ["harness"]
});
var turnActivityTtfi = createHistogram("grok_bot.turn.activity_ttfi_ms", {
  labelNames: ["harness"]
});
var turnInferenceTtft = createHistogram("grok_bot.turn.inference_ttft_ms", {
  labelNames: ["harness"]
});
var turnFirstToken = createHistogram("grok_bot.turn.first_token_ms", {
  labelNames: ["harness", "session_kind", "model", "turn_kind"]
});
var turnFirstMessageDispatch = createHistogram("grok_bot.turn.first_message_dispatch_ms", {
  labelNames: ["harness", "session_kind", "model", "turn_kind"]
});
var turnStepInference = createHistogram("grok_bot.turn.step_inference_ms", {
  labelNames: ["harness", "outcome"]
});
var turnStepGap = createHistogram("grok_bot.turn.step_gap_ms", {
  labelNames: ["harness"]
});
var turnToolExecution = createHistogram("grok_bot.turn.tool_execution_ms", {
  labelNames: ["harness"]
});
var turnStepOverhead = createHistogram("grok_bot.turn.step_overhead_ms", {
  labelNames: ["harness"]
});
var turnDuration = createHistogram("grok_bot.turn.duration_ms", {
  labelNames: ["harness", "outcome", "initiator", "session_kind", "model", "turn_kind"]
});
var turnOutcome = createCounter("grok_bot.turn.outcome", {
  labelNames: [
    "harness",
    "outcome",
    "error_type",
    "initiator",
    "session_kind",
    "turn_kind"
  ]
});
var turnInferenceRetry = createCounter("grok_bot.turn.inference_retry", {
  labelNames: ["harness", "outcome"]
});
var turnInferenceRetryDelay = createHistogram("grok_bot.turn.inference_retry_delay_ms", {
  labelNames: ["harness", "server_paced"]
});
function safelyObserve(ctx, callback) {
  try {
    callback();
  } catch (error41) {
    logger103.warn(ctx, `Turn performance observation failed (${errorLogTag(error41)})`);
  }
}
function createTurnPerformanceObservation({
  ctx,
  harness,
  sessionKind = "main",
  turnKind = "other",
  initiator,
  startedAt,
  activityStartedAt
}) {
  let active = true;
  let firstRequestStarted = false;
  let firstMeaningfulPartSeen = false;
  let firstMessageDispatched = false;
  let previousRequestEndedAt;
  let occupiedGapMs = 0;
  let occupiedGapStartedAt;
  let suppressNextGap = false;
  let metricContext = ctx;
  const activeToolCalls = /* @__PURE__ */ new Map();
  let modelId;
  const awaitingModel = [];
  const sessionTags = () => ({
    session_kind: sessionKind,
    model: modelId ?? "unknown",
    turn_kind: turnKind
  });
  const onceModelKnown = (emit) => {
    if (modelId === void 0) {
      awaitingModel.push(emit);
      return;
    }
    safelyObserve(metricContext, emit);
  };
  const flushAwaitingModel = () => {
    for (const emit of awaitingModel.splice(0)) {
      safelyObserve(metricContext, emit);
    }
  };
  const streamObserver = {
    onRequestStart(requestCtx) {
      if (!active || harness === void 0) return void 0;
      metricContext = requestCtx;
      const requestStartedAt = performance.now();
      if (!firstRequestStarted) {
        firstRequestStarted = true;
        turnTtfi.histogram(requestCtx, requestStartedAt - startedAt, { harness });
        if (harness === "temporal" && activityStartedAt !== void 0) {
          turnActivityTtfi.histogram(requestCtx, requestStartedAt - activityStartedAt, {
            harness
          });
        }
      }
      if (previousRequestEndedAt !== void 0) {
        if (!suppressNextGap) {
          const gap = Math.max(0, requestStartedAt - previousRequestEndedAt);
          const occupied = occupiedGapMs + (occupiedGapStartedAt === void 0 ? 0 : Math.max(0, requestStartedAt - occupiedGapStartedAt));
          turnStepGap.histogram(requestCtx, gap, { harness });
          turnStepOverhead.histogram(requestCtx, Math.max(0, gap - occupied), { harness });
        }
        previousRequestEndedAt = void 0;
        occupiedGapMs = 0;
        occupiedGapStartedAt = void 0;
      }
      suppressNextGap = false;
      let ended = false;
      return {
        onStreamPart: firstMeaningfulPartSeen ? void 0 : (part) => {
          if (!active || firstMeaningfulPartSeen) return false;
          const meaningful = part.type === "text-delta" && part.textDelta.length > 0 || part.type === "reasoning" && part.textDelta.length > 0 || part.type === "tool-call-delta" && part.argsTextDelta.length > 0 || part.type === "tool-call";
          if (!meaningful) return true;
          firstMeaningfulPartSeen = true;
          const observedAt = performance.now();
          turnInferenceTtft.histogram(requestCtx, observedAt - requestStartedAt, {
            harness
          });
          onceModelKnown(
            () => turnFirstToken.histogram(requestCtx, observedAt - startedAt, {
              harness,
              ...sessionTags()
            })
          );
          return false;
        },
        onStreamEnd(outcome) {
          if (!active || ended) return;
          ended = true;
          const endedAt = performance.now();
          previousRequestEndedAt = endedAt;
          occupiedGapMs = 0;
          occupiedGapStartedAt = activeToolCalls.size > 0 ? endedAt : void 0;
          turnStepInference.histogram(requestCtx, endedAt - requestStartedAt, {
            harness,
            outcome
          });
        }
      };
    }
  };
  return {
    streamObserver,
    toolCall({ event, callId }) {
      if (!active || harness === void 0) return;
      safelyObserve(metricContext, () => {
        if (event === "toolCallStarted") {
          if (!activeToolCalls.has(callId)) {
            const toolStartedAt2 = performance.now();
            if (activeToolCalls.size === 0 && previousRequestEndedAt !== void 0) {
              occupiedGapStartedAt = toolStartedAt2;
            }
            activeToolCalls.set(callId, toolStartedAt2);
          }
          return;
        }
        if (event !== "toolCallCompleted") return;
        const toolStartedAt = activeToolCalls.get(callId);
        if (toolStartedAt === void 0) return;
        const endedAt = performance.now();
        activeToolCalls.delete(callId);
        if (activeToolCalls.size === 0 && previousRequestEndedAt !== void 0 && occupiedGapStartedAt !== void 0) {
          occupiedGapMs += Math.max(0, endedAt - occupiedGapStartedAt);
          occupiedGapStartedAt = void 0;
        }
        turnToolExecution.histogram(metricContext, Math.max(0, endedAt - toolStartedAt), {
          harness
        });
      });
    },
    retry(observation) {
      if (!active || harness === void 0) return;
      if (observation.outcome === "retried") {
        suppressNextGap = true;
      }
      safelyObserve(
        metricContext,
        () => turnInferenceRetry.increment(metricContext, 1, {
          harness,
          outcome: observation.outcome
        })
      );
      if (observation.outcome !== "retried" || observation.delayMs === void 0) return;
      const delayMs = observation.delayMs;
      safelyObserve(
        metricContext,
        () => turnInferenceRetryDelay.histogram(metricContext, delayMs, {
          harness,
          server_paced: String(observation.serverPaced === true)
        })
      );
    },
    firstMessageDispatch() {
      if (!active || firstMessageDispatched || harness === void 0) return;
      firstMessageDispatched = true;
      const dispatchedAt = performance.now();
      onceModelKnown(
        () => turnFirstMessageDispatch.histogram(metricContext, dispatchedAt - startedAt, {
          harness,
          ...sessionTags()
        })
      );
    },
    noteModelResolved(resolvedModelId) {
      modelId = resolvedModelId;
      flushAwaitingModel();
    },
    stopObservingInference() {
      active = false;
    },
    complete(outcome, errorType = "none") {
      active = false;
      if (harness === void 0) return;
      flushAwaitingModel();
      safelyObserve(
        metricContext,
        () => turnDuration.histogram(metricContext, performance.now() - startedAt, {
          harness,
          outcome,
          initiator,
          ...sessionTags()
        })
      );
      safelyObserve(
        metricContext,
        () => turnOutcome.increment(metricContext, 1, {
          harness,
          outcome,
          error_type: errorType,
          initiator,
          session_kind: sessionKind,
          turn_kind: turnKind
        })
      );
    }
  };
}
