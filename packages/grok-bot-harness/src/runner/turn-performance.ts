init_dist4();
init_scheduling();
init_errors();
var logger105 = createLogger("sand:turn-performance");
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
var turnTtir = createHistogram("grok_bot.turn.ttir_ms", {
  labelNames: ["harness", "session_kind", "model", "turn_kind"]
});
var PROMPT_SIZE_BUCKET_UPPER_BOUNDS = [
  [25e3, "0_25k"],
  [5e4, "25_50k"],
  [75e3, "50_75k"],
  [1e5, "75_100k"],
  [125e3, "100_125k"],
  [15e4, "125_150k"],
  [175e3, "150_175k"],
  [2e5, "175_200k"],
  [3e5, "200_300k"]
];
function classifyPromptSizeBucket(inputTokens) {
  if (inputTokens === void 0 || !Number.isFinite(inputTokens) || inputTokens <= 0) {
    return "unknown";
  }
  for (const [upperExclusive, bucket] of PROMPT_SIZE_BUCKET_UPPER_BOUNDS) {
    if (inputTokens < upperExclusive) return bucket;
  }
  return "300k_plus";
}
var turnInferenceTtft = createHistogram("grok_bot.turn.inference_ttft_ms", {
  labelNames: ["harness", "prompt_bucket", "cache_class"]
});
var turnFirstToken = createHistogram("grok_bot.turn.first_token_ms", {
  labelNames: ["harness", "session_kind", "model", "turn_kind"]
});
var turnFirstMessageDispatch = createHistogram("grok_bot.turn.first_message_dispatch_ms", {
  labelNames: ["harness", "session_kind", "model", "turn_kind"]
});
var FIRST_MESSAGE_LABELS = [
  "harness",
  "session_kind",
  "model",
  "turn_kind",
  "initiator",
  "run"
];
var turnUserSendToFirstMessage = createHistogram("grok_bot.turn.user_send_to_first_message_ms", {
  labelNames: ["harness", "session_kind", "model", "turn_kind", "initiator"]
});
var turnActivityFirstMessageDispatch = createHistogram(
  "grok_bot.turn.activity_first_message_dispatch_ms",
  { labelNames: FIRST_MESSAGE_LABELS }
);
var turnFirstCallTtft = createHistogram("grok_bot.turn.first_call_ttft_ms", {
  labelNames: FIRST_MESSAGE_LABELS
});
var turnFirstTokenToFirstMessage = createHistogram(
  "grok_bot.turn.first_token_to_first_message_ms",
  { labelNames: FIRST_MESSAGE_LABELS }
);
var turnStepsBeforeFirstMessage = createHistogram("grok_bot.turn.steps_before_first_message", {
  labelNames: ["harness", "session_kind", "turn_kind", "initiator", "run"]
});
var turnFirstTool = createCounter("grok_bot.turn.first_tool", {
  labelNames: ["harness", "session_kind", "turn_kind", "initiator", "run", "tool"]
});
var TOOL_LABEL = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;
var PROMPT_CACHE_LABELS = [
  "harness",
  "session_kind",
  "model",
  "turn_kind",
  "initiator",
  "run",
  "call"
];
var turnUncachedInputTokens = createHistogram("grok_bot.turn.uncached_input_tokens", {
  labelNames: PROMPT_CACHE_LABELS
});
var turnPromptCache = createCounter("grok_bot.turn.prompt_cache", {
  labelNames: [...PROMPT_CACHE_LABELS, "result"]
});
function classifyPromptCacheResult(inputTokens, cacheReadTokens) {
  if (cacheReadTokens <= 0) return "miss";
  const fraction = cacheReadTokens / inputTokens;
  if (fraction >= 0.95) return "hit";
  if (fraction >= 0.5) return "partial";
  return "prefix_only";
}
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
  } catch (error42) {
    logger105.warn(ctx, `Turn performance observation failed (${errorLogTag(error42)})`);
  }
}
function createTurnPerformanceObservation({
  ctx,
  harness,
  sessionKind = "main",
  turnKind = "other",
  initiator,
  startedAt,
  activityStartedAt,
  runRole = "other",
  userMessageSentAt,
  turnStartedAt,
  clock = realClock
}) {
  let active = true;
  let firstRequestStarted = false;
  let firstMeaningfulPartSeen = false;
  let firstMessageDispatched = false;
  let previousRequestEndedAt;
  let occupiedGapMs = 0;
  let occupiedGapStartedAt;
  let suppressNextGap = false;
  let stepsStarted = 0;
  let nextRequestIsRetry = false;
  let lastRequestState = "none";
  let firstMeaningfulAt;
  let pendingInferenceTtft;
  let firstToolCallId;
  let firstToolRecorded = false;
  let metricContext = ctx;
  const activeToolCalls = /* @__PURE__ */ new Map();
  let modelId;
  const awaitingModel = [];
  const sessionTags = () => ({
    session_kind: sessionKind,
    model: modelId ?? "unknown",
    turn_kind: turnKind
  });
  const firstMessageTags = () => ({ ...sessionTags(), initiator, run: runRole });
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
  const emitInferenceTtft = (usage) => {
    const pending = pendingInferenceTtft;
    if (pending === void 0) return;
    pendingInferenceTtft = void 0;
    safelyObserve(
      pending.ctx,
      () => turnInferenceTtft.histogram(pending.ctx, pending.ms, {
        harness: pending.harness,
        prompt_bucket: classifyPromptSizeBucket(usage?.inputTokens),
        cache_class: usage === void 0 || !(usage.inputTokens > 0) ? "unknown" : classifyPromptCacheResult(usage.inputTokens, usage.cacheReadTokens)
      })
    );
  };
  const streamObserver = {
    onRequestStart(requestCtx) {
      if (!active || harness === void 0) return void 0;
      metricContext = requestCtx;
      const requestStartedAt = clock.monotonicNow();
      if (!nextRequestIsRetry) stepsStarted += 1;
      nextRequestIsRetry = false;
      lastRequestState = "open";
      const requestStep = stepsStarted;
      if (!firstRequestStarted) {
        firstRequestStarted = true;
        turnTtfi.histogram(requestCtx, requestStartedAt - startedAt, { harness });
        if (harness === "temporal" && activityStartedAt !== void 0) {
          turnActivityTtfi.histogram(requestCtx, requestStartedAt - activityStartedAt, {
            harness
          });
        }
        const turnAt = turnStartedAt;
        if (turnAt !== void 0) {
          onceModelKnown(
            () => turnTtir.histogram(requestCtx, Math.max(0, requestStartedAt - turnAt), {
              harness,
              ...sessionTags()
            })
          );
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
      let ownsInferenceTtft = false;
      let requestUsage;
      return {
        onStreamPart: firstMeaningfulPartSeen ? void 0 : (part) => {
          if (!active || firstMeaningfulPartSeen) return false;
          const meaningful = part.type === "text-delta" && part.textDelta.length > 0 || part.type === "reasoning" && part.textDelta.length > 0 || part.type === "tool-call-delta" && part.argsTextDelta.length > 0 || part.type === "tool-call";
          if (!meaningful) return true;
          firstMeaningfulPartSeen = true;
          const observedAt = clock.monotonicNow();
          firstMeaningfulAt = observedAt;
          ownsInferenceTtft = true;
          pendingInferenceTtft = {
            ctx: requestCtx,
            ms: observedAt - requestStartedAt,
            harness
          };
          if (requestUsage !== void 0) emitInferenceTtft(requestUsage);
          if (requestStep === 1) {
            onceModelKnown(
              () => turnFirstCallTtft.histogram(requestCtx, observedAt - requestStartedAt, {
                harness,
                ...firstMessageTags()
              })
            );
          }
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
          lastRequestState = outcome === "success" ? "succeeded" : "failed";
          const endedAt = clock.monotonicNow();
          previousRequestEndedAt = endedAt;
          occupiedGapMs = 0;
          occupiedGapStartedAt = activeToolCalls.size > 0 ? endedAt : void 0;
          turnStepInference.histogram(requestCtx, endedAt - requestStartedAt, {
            harness,
            outcome
          });
        },
        onUsage(usage) {
          const inputTokens = usage.inputTokens;
          const cacheReadTokens = Math.min(Math.max(0, usage.cacheReadTokens), inputTokens);
          requestUsage = { inputTokens, cacheReadTokens };
          if (ownsInferenceTtft) emitInferenceTtft(requestUsage);
          if (!(inputTokens > 0)) return;
          const tags = {
            harness,
            ...firstMessageTags(),
            call: requestStep === 1 ? "first" : "later"
          };
          turnUncachedInputTokens.histogram(requestCtx, inputTokens - cacheReadTokens, tags);
          turnPromptCache.increment(requestCtx, 1, {
            ...tags,
            result: classifyPromptCacheResult(inputTokens, cacheReadTokens)
          });
        }
      };
    }
  };
  return {
    streamObserver,
    toolCall({
      event,
      callId,
      toolName
    }) {
      if (!active || harness === void 0) return;
      safelyObserve(metricContext, () => {
        if (event === "toolCallStarted") {
          firstToolCallId ??= callId;
          if (!firstToolRecorded && toolName !== void 0 && callId === firstToolCallId) {
            firstToolRecorded = true;
            turnFirstTool.increment(metricContext, 1, {
              harness,
              session_kind: sessionKind,
              turn_kind: turnKind,
              initiator,
              run: runRole,
              tool: TOOL_LABEL.test(toolName) ? toolName : "other"
            });
          }
          if (!activeToolCalls.has(callId)) {
            const toolStartedAt2 = clock.monotonicNow();
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
        const endedAt = clock.monotonicNow();
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
        nextRequestIsRetry = lastRequestState === "open" || lastRequestState === "failed";
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
      const dispatchedAt = clock.monotonicNow();
      onceModelKnown(
        () => turnFirstMessageDispatch.histogram(metricContext, dispatchedAt - startedAt, {
          harness,
          ...sessionTags()
        })
      );
      const sentAt = userMessageSentAt;
      if (harness === "temporal" && sentAt !== void 0) {
        onceModelKnown(
          () => turnUserSendToFirstMessage.histogram(metricContext, dispatchedAt - sentAt, {
            harness,
            ...sessionTags(),
            initiator
          })
        );
      }
      const activityAt = activityStartedAt;
      if (harness === "temporal" && activityAt !== void 0) {
        onceModelKnown(
          () => turnActivityFirstMessageDispatch.histogram(metricContext, dispatchedAt - activityAt, {
            harness,
            ...firstMessageTags()
          })
        );
      }
      const tokenAt = firstMeaningfulAt;
      if (tokenAt !== void 0) {
        onceModelKnown(
          () => turnFirstTokenToFirstMessage.histogram(metricContext, dispatchedAt - tokenAt, {
            harness,
            ...firstMessageTags()
          })
        );
      }
      if (stepsStarted > 0) {
        const steps = stepsStarted;
        safelyObserve(
          metricContext,
          () => turnStepsBeforeFirstMessage.histogram(metricContext, steps, {
            harness,
            session_kind: sessionKind,
            turn_kind: turnKind,
            initiator,
            run: runRole
          })
        );
      }
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
      emitInferenceTtft();
      safelyObserve(
        metricContext,
        () => turnDuration.histogram(metricContext, clock.monotonicNow() - startedAt, {
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
