init_dist3();
init_errors();
var logger100 = createLogger("sand:conversation-state");
function selectUnconfirmedUserMessages(params) {
  const { recentUserMessages, currentMessageId, lastTurnUserMessageId, hasConfirmedTurns } = params;
  if (currentMessageId == null || currentMessageId.length === 0) return [];
  const currentIndex = recentUserMessages.findIndex((m2) => m2.id === currentMessageId);
  if (currentIndex <= 0) return [];
  let startIndex;
  if (lastTurnUserMessageId != null && lastTurnUserMessageId.length > 0) {
    const watermarkIndex = recentUserMessages.findIndex((m2) => m2.id === lastTurnUserMessageId);
    if (watermarkIndex === -1) return [];
    startIndex = watermarkIndex + 1;
  } else if (!hasConfirmedTurns) {
    startIndex = 0;
  } else {
    return [];
  }
  if (startIndex >= currentIndex) return [];
  return recentUserMessages.slice(startIndex, currentIndex).filter((m2) => m2.text.trim().length > 0);
}
function buildUnansweredQuestionsNote(prompts) {
  const clean = (values) => values.flatMap((value) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? [trimmed] : [];
  });
  const skipped2 = clean(prompts.skipped);
  const dismissed = clean(prompts.dismissed);
  const discardedDrafts = clean(prompts.discardedDrafts ?? []);
  const unconfirmedDrafts = clean(prompts.unconfirmedDrafts ?? []);
  const unseenWakeOutcomes = clean(prompts.unseenWakeOutcomes ?? []);
  const sections = [];
  if (unseenWakeOutcomes.length === 1) {
    sections.push(
      `Earlier a card you raised was settled, but the turn carrying that outcome was cut off before you saw it. ${unseenWakeOutcomes[0]} Treat it as settled and already handled on the user's side: take it into account together with the message below, follow the guidance it carries, and don't raise the same card again.`
    );
  } else if (unseenWakeOutcomes.length > 1) {
    const list = unseenWakeOutcomes.map((outcome) => `
- ${outcome}`).join("");
    sections.push(
      `Earlier cards you raised were settled, but the turns carrying those outcomes were cut off before you saw them:${list}
Treat these as settled and already handled on the user's side: take them into account together with the message below, follow the guidance each one carries, and don't raise the same cards again.`
    );
  }
  if (skipped2.length === 1) {
    sections.push(
      `Earlier you prompted the user and they moved on without responding ("${skipped2[0]}") \u2014 treat it as skipped. Don't wait for or assume a response; continue with what you already know, and only ask again if you still genuinely need it.`
    );
  } else if (skipped2.length > 1) {
    const list = skipped2.map((prompt) => `
- "${prompt}"`).join("");
    sections.push(
      `Earlier you prompted the user for these and they moved on without responding \u2014 treat them as skipped:${list}
Don't wait for or assume responses; continue with what you already know, and only ask again if you still genuinely need to.`
    );
  }
  if (dismissed.length === 1) {
    sections.push(
      `The user dismissed your question ("${dismissed[0]}") without answering \u2014 they'd rather not respond. Don't ask it again or wait for an answer; continue with what you already know and decide yourself.`
    );
  } else if (dismissed.length > 1) {
    const list = dismissed.map((prompt) => `
- "${prompt}"`).join("");
    sections.push(
      `The user dismissed these questions without answering \u2014 they'd rather not respond:${list}
Don't ask them again or wait for answers; continue with what you already know and decide yourself.`
    );
  }
  if (discardedDrafts.length === 1) {
    sections.push(
      /* eslint-disable-next-line lingui/no-unlocalized-strings -- model-facing hidden prompt */
      `The user discarded your draft without sending ("${discardedDrafts[0]}") \u2014 they refused to send it. Do not send that message yourself (including via CallMcpTool or any connector send tool). Treat the draft as rejected; only draft or send again if the user explicitly asks.`
    );
  } else if (discardedDrafts.length > 1) {
    const list = discardedDrafts.map((prompt) => `
- "${prompt}"`).join("");
    sections.push(
      /* eslint-disable-next-line lingui/no-unlocalized-strings -- model-facing hidden prompt */
      `The user discarded these drafts without sending \u2014 they refused to send them:${list}
Do not send those messages yourself (including via CallMcpTool or any connector send tool). Treat the drafts as rejected; only draft or send again if the user explicitly asks.`
    );
  }
  if (unconfirmedDrafts.length === 1) {
    sections.push(
      /* eslint-disable-next-line lingui/no-unlocalized-strings -- model-facing hidden prompt */
      `A send of your draft did not confirm ("${unconfirmedDrafts[0]}") \u2014 it may or may not have gone out. Do not send that message yourself (including via CallMcpTool or any connector send tool). Check the destination before drafting or sending it again.`
    );
  } else if (unconfirmedDrafts.length > 1) {
    const list = unconfirmedDrafts.map((prompt) => `
- "${prompt}"`).join("");
    sections.push(
      /* eslint-disable-next-line lingui/no-unlocalized-strings -- model-facing hidden prompt */
      `Sends of these drafts did not confirm \u2014 they may or may not have gone out:${list}
Do not send those messages yourself (including via CallMcpTool or any connector send tool). Check the destination before drafting or sending them again.`
    );
  }
  if (sections.length === 0) return "";
  return `${SAND_HIDDEN_PROMPT_MARKER}${sections.join("\n\n")}`;
}
function toSafeTokenCount2(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}
function awaitBlockUntilMs(awaitCall) {
  const raw = awaitCall.args?.blockUntilMs;
  return raw == null ? 0 : Number(raw);
}
function classifyCompletedAwaitOutcome(awaitCall) {
  const result = awaitCall.result?.result;
  if (result?.case === "success") {
    const inner = result.value.awaitResult;
    if (inner?.case === "complete") {
      return inner.value.taskId.trim().length === 0 ? "slept_full" : "completed_early";
    }
    if (inner?.case === "stillRunning") {
      const match2 = inner.value.regexMatch;
      return match2 != null && match2.length > 0 ? "completed_early" : "slept_full";
    }
  }
  return "completed_early";
}
function sanitizeUsage(usage) {
  const promptTokens = toSafeTokenCount2(usage.promptTokens);
  const completionTokens = toSafeTokenCount2(usage.completionTokens);
  const totalTokens = toSafeTokenCount2(usage.totalTokens) || promptTokens + completionTokens;
  return {
    ...usage,
    promptTokens,
    completionTokens,
    totalTokens
  };
}
var contextWindowByModelForHostLifetime = /* @__PURE__ */ new Map();
function lastReportedContextWindow(modelId) {
  return contextWindowByModelForHostLifetime.get(modelId);
}
var selfSummarySupportByModelForHostLifetime = /* @__PURE__ */ new Map();
function lastReportedSelfSummarySupport(modelId) {
  return selfSummarySupportByModelForHostLifetime.get(modelId);
}
function composeSandPromptStreamObservers(...observers) {
  const present = observers.filter(
    (observer) => observer !== void 0
  );
  if (present.length === 0) return void 0;
  if (present.length === 1) return present[0];
  return {
    onRequestStart(ctx, request3) {
      const requestObservers = [];
      for (const observer of present) {
        safelyObservePromptStream(ctx, () => {
          const requestObserver = observer.onRequestStart(ctx, request3);
          if (requestObserver !== void 0) requestObservers.push(requestObserver);
        });
      }
      if (requestObservers.length === 0) return void 0;
      const partObservers = new Set(requestObservers.filter((observer) => observer.onStreamPart));
      return {
        onStreamPart: partObservers.size === 0 ? void 0 : (part) => {
          for (const observer of partObservers) {
            const keep = safelyObservePromptStream(ctx, () => {
              if (observer.onStreamPart?.(part) !== true) partObservers.delete(observer);
            });
            if (!keep) partObservers.delete(observer);
          }
          return partObservers.size > 0;
        },
        onStreamEnd(outcome) {
          for (const observer of requestObservers) {
            safelyObservePromptStream(ctx, () => observer.onStreamEnd(outcome));
          }
        },
        onUsage(usage) {
          for (const observer of requestObservers) {
            safelyObservePromptStream(ctx, () => observer.onUsage?.(usage));
          }
        }
      };
    }
  };
}
function safelyObservePromptStream(ctx, callback) {
  try {
    callback();
    return true;
  } catch (error41) {
    logger100.warn(ctx, `Prompt stream observer failed (${errorLogTag(error41)})`);
    return false;
  }
}
function sanitizeExtendedUsage(usage, modelId) {
  const maxTokens = toSafeTokenCount2(usage.maxTokens);
  if (maxTokens > 0) {
    contextWindowByModelForHostLifetime.set(modelId, maxTokens);
  }
  return {
    inputTokens: toSafeTokenCount2(usage.inputTokens),
    outputTokens: toSafeTokenCount2(usage.outputTokens),
    cacheReadTokens: toSafeTokenCount2(usage.cacheReadTokens),
    cacheWriteTokens: toSafeTokenCount2(usage.cacheWriteTokens),
    maxTokens
  };
}
async function* sanitizeFullStream(ctx, fullStream, observer) {
  let streamError;
  let outcome = "aborted";
  let observeParts = observer?.onStreamPart !== void 0;
  try {
    for await (const part of fullStream) {
      if (streamError != null) {
        continue;
      }
      if (observeParts) {
        try {
          observeParts = observer?.onStreamPart?.(part) === true;
        } catch {
          observeParts = false;
        }
      }
      if (part.type === "error") {
        streamError = part.error instanceof Error ? part.error : new Error(String(part.error));
        continue;
      }
      if (part.type === "finish") {
        yield {
          ...part,
          usage: sanitizeUsage(part.usage)
        };
        continue;
      }
      yield part;
    }
    if (streamError != null) {
      throw streamError;
    }
    outcome = "success";
  } catch (error41) {
    outcome = "error";
    throw error41;
  } finally {
    if (observer !== void 0) {
      safelyObservePromptStream(ctx, () => observer.onStreamEnd(outcome));
    }
  }
}
function sanitizeStreamResult(ctx, result, modelId, onResolvedModelId, streamObserver) {
  const response = Promise.all([result.response, result.extendedUsage]).then(
    ([response2, usage]) => {
      const resolvedModelId = response2.modelId.trim();
      if (resolvedModelId.length > 0) {
        onResolvedModelId?.(resolvedModelId, response2, usage);
        if (response2.supportsSelfSummary !== void 0) {
          selfSummarySupportByModelForHostLifetime.set(
            resolvedModelId,
            response2.supportsSelfSummary
          );
        }
      }
      return response2;
    }
  );
  return {
    ...result,
    fullStream: sanitizeFullStream(ctx, result.fullStream, streamObserver),
    response,
    usage: result.usage.then(sanitizeUsage),
    extendedUsage: Promise.all([result.extendedUsage, response]).then(([usage]) => {
      const sanitized = sanitizeExtendedUsage(usage, modelId);
      if (streamObserver?.onUsage !== void 0) {
        safelyObservePromptStream(ctx, () => streamObserver.onUsage?.(sanitized));
      }
      return sanitized;
    })
  };
}
function createSandResolvedModelTracker() {
  let nextRequestSequence = 0;
  const acceptedByRequestedModel = /* @__PURE__ */ new Map();
  return {
    get: (requestedModelId) => acceptedByRequestedModel.get(requestedModelId)?.modelId,
    beginRequest: (requestedModelId) => {
      const requestSequence = ++nextRequestSequence;
      return (resolvedModelId) => {
        const accepted = acceptedByRequestedModel.get(requestedModelId);
        if (accepted !== void 0 && accepted.requestSequence >= requestSequence) {
          return false;
        }
        acceptedByRequestedModel.set(requestedModelId, {
          requestSequence,
          modelId: resolvedModelId
        });
        return true;
      };
    }
  };
}
var UsageSanitizingMiddleware = class extends BaseMiddleware {
  constructor(innerExecutor, modelId, resolvedModelTracking, streamObserver) {
    super(innerExecutor);
    this.modelId = modelId;
    this.resolvedModelTracking = resolvedModelTracking;
    this.streamObserver = streamObserver;
  }
  modelId;
  resolvedModelTracking;
  streamObserver;
  stream(ctx, invocationId, tools, options2) {
    this.resolvedModelTracking?.onRequestStart();
    const acceptResolvedModelId = this.resolvedModelTracking?.tracker.beginRequest(this.modelId);
    const onResolvedModelId = (resolvedModelId, response, usage) => {
      if (acceptResolvedModelId?.(resolvedModelId) === true) {
        this.resolvedModelTracking?.onResolvedModelId(resolvedModelId, response, usage);
      }
    };
    if (this.streamObserver === void 0) {
      return sanitizeStreamResult(
        ctx,
        this.innerExecutor.stream(ctx, invocationId, tools, options2),
        this.modelId,
        onResolvedModelId
      );
    }
    let requestObserver;
    safelyObservePromptStream(ctx, () => {
      requestObserver = this.streamObserver?.onRequestStart(ctx, {
        messages: this.innerExecutor.getMessages(),
        tools
      });
    });
    let streamResult;
    try {
      streamResult = this.innerExecutor.stream(ctx, invocationId, tools, options2);
    } catch (error41) {
      safelyObservePromptStream(ctx, () => requestObserver?.onStreamEnd("error"));
      throw error41;
    }
    return sanitizeStreamResult(
      ctx,
      streamResult,
      this.modelId,
      onResolvedModelId,
      requestObserver
    );
  }
};
function sanitizePromptExecutorUsage(executor, modelId, resolvedModelTracking, streamObserver) {
  return new UsageSanitizingMiddleware(executor, modelId, resolvedModelTracking, streamObserver);
}
function sanitizePromptSessionUsage(session, resolvedModelTracker = createSandResolvedModelTracker(), onResolvedModelId, streamObserver, untrackedStreamObserver) {
  let resolvedModelId = resolvedModelTracker.get(session.getModelId());
  let earlyCompaction;
  const getEarlyCompaction = () => {
    if (earlyCompaction?.modelId !== session.getModelId()) {
      earlyCompaction = void 0;
    }
    return earlyCompaction;
  };
  return {
    getExecutor: (state) => {
      getEarlyCompaction();
      const requestedModelId = session.getModelId();
      return sanitizePromptExecutorUsage(
        session.getExecutor(state),
        requestedModelId,
        {
          tracker: resolvedModelTracker,
          onRequestStart: () => {
            earlyCompaction = void 0;
          },
          onResolvedModelId: (modelId, response, usage) => {
            if (requestedModelId !== session.getModelId()) return;
            resolvedModelId = modelId;
            earlyCompaction = {
              modelId: requestedModelId,
              threshold: response.error === void 0 ? response.earlyCompactionContextTokenThreshold : void 0,
              inputTokens: toSafeTokenCount2(usage.inputTokens)
            };
            onResolvedModelId?.(modelId);
          }
        },
        streamObserver
      );
    },
    getExecutorWithoutResolvedModelTracking: (state) => sanitizePromptExecutorUsage(
      session.getExecutor(state),
      session.getModelId(),
      void 0,
      untrackedStreamObserver
    ),
    getModelId: () => session.getModelId(),
    getResolvedModelId: () => resolvedModelId,
    getEarlyCompaction
  };
}
var DEPRECATED_CURSOR_GROK_4_5_MODELS = /* @__PURE__ */ new Set([
  "grok-4.5-medium",
  "grok-4.5-fast-medium",
  "grok-4.5-high",
  "grok-4.5-fast-high",
  "grok-4.5-xhigh",
  "grok-4.5-fast-xhigh"
]);
function shouldUseSandSelfSummary(modelId) {
  const model = modelId.split("#", 1)[0] ?? modelId;
  const xaiExternalParts = model.startsWith("XAIEXTERNAL--") ? model.split("--") : [];
  const xaiExternalProviderModel = xaiExternalParts.length === 3 && xaiExternalParts[1] !== "" ? xaiExternalParts[2] : void 0;
  return model === "grok-4.5" || DEPRECATED_CURSOR_GROK_4_5_MODELS.has(model) || model === "cursor-grok-4.5" || model.startsWith("cursor-grok-4.5-") || model === "vega" || model.startsWith("vega-") || model.startsWith("accounts/anysphere/models/vega") || model.startsWith("cursor/vega") || model === "v9" || model.startsWith("v9-") || xaiExternalProviderModel === "v9" || xaiExternalProviderModel?.startsWith("v9-") === true;
}
var SAND_SUMMARIZATION_MAX_PROMPT_CHARS = 28e5;
function createSandSummarizationHandler(summarizationSession, options2) {
  return new SummarizationHandler(summarizationSession, false, {
    enableReduceInputsRetry: true,
    maxPromptChars: SAND_SUMMARIZATION_MAX_PROMPT_CHARS,
    maxOutputTokens: 32e3,
    preserveLatestImage: options2?.preserveLatestImage ?? false
  });
}
