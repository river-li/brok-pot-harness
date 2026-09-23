var __addDisposableResource20 = function(env, value, async) {
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
var __disposeResources20 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error42, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error42, e.suppressed = suppressed, e;
});
var logger57 = createLogger("prompt-suggestion");
var SILENCE_TAG_REGEX = /<{1,2}\/?\s*silence\s*\/?>/i;
var promptSuggestionOutcome = createCounter("agent.prompt_suggestion.outcome", {
  description: "Prompt suggestion outcome by model",
  labelNames: ["model", "outcome"]
});
function countWords(text2) {
  const words2 = text2.trim().split(/\s+/);
  return words2.length > 0 && words2[0] !== "" ? words2.length : 0;
}
function extractSuggestionWithReason(response, maxWords = PROMPT_SUGGESTION_MAX_WORDS) {
  const trimmed = response.trim();
  if (trimmed.length === 0) {
    return { type: "empty" };
  }
  if (SILENCE_TAG_REGEX.test(trimmed)) {
    return { type: "empty" };
  }
  const firstLine2 = trimmed.split(/\r?\n/)[0].trim();
  const unquoted = firstLine2.replace(/^"(.*)"$/, "$1").trim();
  if (unquoted.length === 0) {
    return { type: "empty" };
  }
  if (unquoted.startsWith("Human:")) {
    return {
      type: "bad_output",
      suggestion: unquoted,
      reason: "human_prefix"
    };
  }
  if (/<\/?think>/.test(unquoted)) {
    return {
      type: "bad_output",
      suggestion: unquoted,
      reason: "thinking_tags"
    };
  }
  const wordCount = countWords(unquoted);
  if (wordCount > maxWords) {
    return { type: "too_long", suggestion: unquoted, wordCount };
  }
  return { type: "success", suggestion: unquoted };
}
async function requestPromptSuggestion(parentCtx, invocationId, model, executor, interactionListener, tools, messagesSnapshot, priceOptions) {
  const env_1 = { stack: [], error: void 0, hasError: false };
  try {
    const spanCtxt = __addDisposableResource20(env_1, createSpan(parentCtx.withName("requestPromptSuggestion")), false);
    const ctx = spanCtxt.ctx;
    const currentMessages = messagesSnapshot ?? executor.getMessages();
    const maxCost = priceOptions?.maxInputTokenCost;
    const costFn = priceOptions?.getModelInputCostForContext;
    if (maxCost && maxCost > 0 && costFn) {
      const unwrappedMessages = fromRedactedCoreMessages(currentMessages, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      const { conversationHistoryTokens: rawEstimatedTokens } = countConversationHistoryTokens(unwrappedMessages);
      const SYSTEM_PROMPT_OVERHEAD_TOKENS = 2e4;
      const estimatedTokens = rawEstimatedTokens + SYSTEM_PROMPT_OVERHEAD_TOKENS;
      const inputCost = costFn(model, estimatedTokens);
      if (inputCost > maxCost) {
        logger57.info(ctx, "Prompt suggestion skipped: model too expensive", {
          model,
          rawEstimatedTokens,
          estimatedTokens,
          inputCost,
          maxCost
        });
        promptSuggestionOutcome.increment(ctx, 1, {
          model,
          outcome: "skipped_expensive"
        });
        return;
      }
    }
    if (messagesSnapshot) {
      executor.clearMessages();
      executor.appendMessages(messagesSnapshot);
    }
    const isDsv3 = isCursorBigModel(model);
    const promptMessage = promptSuggestionUserMessage(isDsv3);
    const userMessage2 = {
      role: "user",
      content: promptMessage,
      providerOptions: {
        cursor: {
          inferenceReason: "prompt-suggestion",
          featureType: "promptSuggestion"
        }
      }
    };
    executor.appendMessages(toRedactedCoreMessages([userMessage2], PrivacyMode.UNSPECIFIED));
    try {
      const maxTokens = isDsv3 ? 128 : 64;
      const streamResult = executor.stream(ctx, invocationId, tools, {
        maxTokens
      });
      const settledResponse = streamResult.response.then(() => ({ didReject: false }), (error42) => ({ didReject: true, error: error42 }));
      let responseText = "";
      for await (const chunk of streamResult.fullStream) {
        if (chunk.type === "text-delta") {
          responseText += chunk.textDelta;
        }
      }
      const responseResult = await settledResponse;
      if (responseResult.didReject) {
        throw responseResult.error;
      }
      const extendedUsage = await streamResult.extendedUsage;
      const cacheHitRatio = extendedUsage.inputTokens > 0 ? (extendedUsage.cacheReadTokens / extendedUsage.inputTokens).toFixed(2) : "N/A";
      logger57.info(ctx, "Prompt suggestion completed", {
        inputTokens: extendedUsage.inputTokens,
        cacheReadTokens: extendedUsage.cacheReadTokens,
        cacheHitRatio
      });
      const extractionResult = extractSuggestionWithReason(responseText);
      switch (extractionResult.type) {
        case "success":
          promptSuggestionOutcome.increment(ctx, 1, {
            model,
            outcome: "suggested"
          });
          await interactionListener.sendUpdate(ctx, Updates.promptSuggestion(extractionResult.suggestion));
          break;
        case "too_long":
          logger57.info(ctx, "Prompt suggestion discarded: too long", {
            wordCount: extractionResult.wordCount,
            maxWords: PROMPT_SUGGESTION_MAX_WORDS,
            suggestion: extractionResult.suggestion
          });
          promptSuggestionOutcome.increment(ctx, 1, {
            model,
            outcome: "too_long"
          });
          break;
        case "bad_output":
          logger57.info(ctx, "Prompt suggestion discarded: bad output", {
            reason: extractionResult.reason,
            suggestion: extractionResult.suggestion
          });
          promptSuggestionOutcome.increment(ctx, 1, {
            model,
            outcome: "bad_output"
          });
          break;
        case "empty":
          promptSuggestionOutcome.increment(ctx, 1, {
            model,
            outcome: "no_suggestion"
          });
          break;
      }
    } catch (error42) {
      promptSuggestionOutcome.increment(ctx, 1, {
        model,
        outcome: "error"
      });
      logger57.error(ctx, "Error during prompt suggestion request", error42);
    } finally {
      executor.clearMessages();
      executor.appendMessages(currentMessages);
    }
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    __disposeResources20(env_1);
  }
}
