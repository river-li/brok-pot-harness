var __awaiter29 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __asyncValues8 = function(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o[Symbol.asyncIterator], i;
  return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v2) {
      return new Promise(function(resolve29, reject2) {
        v2 = o[n](v2), settle(resolve29, reject2, v2.done, v2.value);
      });
    };
  }
  function settle(resolve29, reject2, d, v2) {
    Promise.resolve(v2).then(function(v3) {
      resolve29({ value: v3, done: d });
    }, reject2);
  }
};
var logger7 = createLogger("summarization-handler");
var MAX_TOOL_CONTENT_PART_CHARS = 1e5;
var MAX_PROMPT_BYTES = 9 * 1024 * 1024;
var MAX_SUMMARIZATION_RETRIES = 3;
var TRANSIENT_SUMMARIZATION_RETRY_DELAY_MS = 2e3;
var MIN_SUMMARIZATION_PROMPT_CHARS = 5e4;
var INPUT_TOKENS_WARN_THRESHOLD = 9e5;
var OUT_TOKENS_WARN_THRESHOLD = 18e3;
var SHORTER_OUTPUT_RETRY_PROMPT = `

Additional instruction: Write a shorter summary that focuses on the highest-signal context. Avoid long code snippets and avoid unnecessarily exhaustive detail. Prioritize the most recent user intent, recent implementation work, and unresolved blockers.
IMPORTANT: When listing user messages, you do not need to repeat each message verbatim. Concisely capture user intent.`;
var SUMMARIZATION_CURSOR_PROVIDER_OPTIONS = {
  cursor: {
    inferenceReason: "agent-summarization",
    featureType: "agenticComposerSummary"
  }
};
function executeSummarizationStream(ctx, promptSession, summaryPrompt, maxOutputTokens) {
  return __awaiter29(this, void 0, void 0, function* () {
    var _a19, e_1, _b2, _c2;
    const executor = promptSession.getExecutor([
      {
        role: "system",
        content: SUMMARIZATION_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: summaryPrompt,
        providerOptions: SUMMARIZATION_CURSOR_PROVIDER_OPTIONS
      }
    ]);
    const streamOptions = maxOutputTokens !== void 0 ? { maxTokens: maxOutputTokens } : {};
    const result = executor.stream(ctx, void 0, void 0, streamOptions);
    const streamLogFields = {
      promptLength: summaryPrompt.length,
      maxOutputTokens
    };
    result.extendedUsage.catch((e) => {
      logger7.error(ctx, "[summarization-handler] Error getting extended usage", e, {
        summarization: streamLogFields
      });
    });
    result.usage.catch((e) => {
      logger7.error(ctx, "[summarization-handler] Error getting usage", e, {
        summarization: streamLogFields
      });
    });
    result.providerMetadata.catch((e) => {
      logger7.error(ctx, "[summarization-handler] Error getting provider metadata", e, {
        summarization: streamLogFields
      });
    });
    result.invocationId.catch((e) => {
      logger7.error(ctx, "[summarization-handler] Error getting invocation id", e, {
        summarization: streamLogFields
      });
    });
    result.response.catch((e) => {
      logger7.error(ctx, "[summarization-handler] Error getting response", e, {
        summarization: streamLogFields
      });
    });
    try {
      for (var _d = true, _e2 = __asyncValues8(result.fullStream), _f; _f = yield _e2.next(), _a19 = _f.done, !_a19; _d = true) {
        _c2 = _f.value;
        _d = false;
        const _chunk = _c2;
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (!_d && !_a19 && (_b2 = _e2.return)) yield _b2.call(_e2);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    const response = yield result.response;
    const assistantMessages = response.messages.filter((m2) => m2.role === "assistant");
    if (assistantMessages.length > 1) {
      logger7.warn(ctx, "[summarization-handler] Summarization response contained more than one assistant message; using only the last to avoid duplicated summaries", {
        summarization: Object.assign(Object.assign({}, streamLogFields), { assistantMessageCount: assistantMessages.length })
      });
    }
    const lastAssistantMessage = assistantMessages.at(-1);
    const text2 = lastAssistantMessage === void 0 ? "" : Array.isArray(lastAssistantMessage.content) ? lastAssistantMessage.content.map((c) => c.type === "text" ? c.text : "").join("") : lastAssistantMessage.content;
    let inputTokens;
    let outputTokens;
    try {
      const extendedUsage = yield result.extendedUsage;
      inputTokens = extendedUsage.inputTokens;
      outputTokens = extendedUsage.outputTokens;
    } catch (_g) {
    }
    if (text2.trim().length === 0) {
      throw new Error("Summarization returned empty text");
    }
    return { text: text2, inputTokens, outputTokens };
  });
}
function formatGuardedToolPart(prefix, serializedValue) {
  if (serializedValue.length > MAX_TOOL_CONTENT_PART_CHARS) {
    const truncated = serializedValue.slice(0, MAX_TOOL_CONTENT_PART_CHARS);
    return `${prefix} ${truncated}
[... truncated, ${serializedValue.length} total chars]`;
  }
  return `${prefix} ${serializedValue}`;
}
function turnMessageToString(redactedMessage, enablePromptSizeGuards) {
  const message = fromRedactedCoreMessage(redactedMessage, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  const content = message.content;
  if (!Array.isArray(content)) {
    return content;
  }
  return content.map((c) => {
    var _a19, _b2;
    if (c.type === "text") {
      return c.text;
    } else if (c.type === "image") {
      return `[Image]`;
    } else if (c.type === "file") {
      return `[File]`;
    } else if (c.type === "reasoning") {
      return `[Thinking] ${c.text}`;
    } else if (c.type === "redacted-reasoning") {
      return `[Thinking]`;
    } else if (c.type === "tool-call") {
      const argsStr = (_a19 = JSON.stringify(c.args)) !== null && _a19 !== void 0 ? _a19 : "null";
      if (enablePromptSizeGuards) {
        return formatGuardedToolPart(`[Tool call] ${c.toolName}`, argsStr);
      }
      return `[Tool call] ${c.toolName} ${argsStr}`;
    } else if (c.type === "tool-result") {
      const resultStr = (_b2 = JSON.stringify(c.result)) !== null && _b2 !== void 0 ? _b2 : "null";
      if (enablePromptSizeGuards) {
        return formatGuardedToolPart(`[Tool result] ${c.toolName}`, resultStr);
      }
      return `[Tool result] ${c.toolName} ${resultStr}`;
    } else {
      return "";
    }
  }).join("\n\n");
}
function buildSummarizationPrompt(ctx, messages2, options2) {
  var _a19, _b2;
  var _c2, _d, _e2;
  const suffix = `
<summarization_request>${MORE_PROMPT}${(options2 === null || options2 === void 0 ? void 0 : options2.requestShorterOutput) ? SHORTER_OUTPUT_RETRY_PROMPT : ""}</summarization_request>`;
  const serialized = messages2.map((m2) => `${m2.role}: ${turnMessageToString(m2, true)}`);
  const fullPrompt = serialized.join("\n\n") + suffix;
  let promptBudget = (_c2 = options2 === null || options2 === void 0 ? void 0 : options2.maxPromptChars) !== null && _c2 !== void 0 ? _c2 : MAX_SUMMARIZATION_PROMPT_CHARS;
  const fullPromptBytes = Buffer.byteLength(fullPrompt, "utf-8");
  let didByteAdjust = false;
  let oldPromptBudget = -1;
  if (fullPromptBytes > MAX_PROMPT_BYTES) {
    const anticipatedBytesPerChar = fullPromptBytes / fullPrompt.length;
    const currentBytesPerChar = MAX_PROMPT_BYTES / promptBudget;
    if (anticipatedBytesPerChar > currentBytesPerChar * 0.95) {
      const newPromptBudget = Math.floor(MAX_PROMPT_BYTES / anticipatedBytesPerChar * 0.8);
      logger7.info(ctx, "[summarization-handler] Reducing prompt budget due to byte limit", {
        summarization: {
          byteAdjustment: {
            anticipatedBytesPerChar,
            currentBytesPerChar,
            oldPromptBudget: promptBudget,
            newPromptBudget
          }
        }
      });
      oldPromptBudget = promptBudget;
      promptBudget = newPromptBudget;
      didByteAdjust = true;
    }
  }
  if (fullPrompt.length > promptBudget) {
    logger7.info(ctx, "[summarization-handler] Would truncate summarization prompt", {
      summarization: {
        promptTruncation: {
          totalMessages: messages2.length,
          fullPromptLength: fullPrompt.length,
          lastSerializedMessageLength: (_d = (_a19 = serialized.at(-1)) === null || _a19 === void 0 ? void 0 : _a19.length) !== null && _d !== void 0 ? _d : 0,
          didByteAdjust,
          promptBudget
        }
      }
    });
  }
  const shouldTruncatePrompt = (options2 === null || options2 === void 0 ? void 0 : options2.maxPromptChars) !== void 0;
  if (!shouldTruncatePrompt || fullPrompt.length <= promptBudget) {
    return { prompt: fullPrompt, didTruncate: false };
  }
  const roles = messages2.map((m2) => m2.role);
  const result = truncatePromptFairly({
    ctx,
    serialized,
    roles,
    suffix,
    charBudget: promptBudget
  });
  if (result === null) {
    logger7.warn(ctx, "[summarization-handler] failed to build summarization prompt", {
      summarization: {
        totalMessages: messages2.length,
        originalChars: fullPrompt.length,
        promptBudget
      }
    });
    throw new CannotTruncatePromptError("Cannot fit any summarization message within prompt char budget", {
      totalMessages: messages2.length,
      originalChars: fullPrompt.length,
      budgetChars: promptBudget
    });
  }
  const { resultParts, droppedCount, truncatedCount, fullCount } = result;
  const separator = "\n\n";
  const preamble = droppedCount > 0 ? formatOmittedMessagesPreamble(droppedCount) : "";
  const joinedResult = resultParts.join(separator);
  const finalPrompt = preamble + joinedResult + suffix;
  if (joinedResult.length < 500) {
    logger7.warn(ctx, "[summarization-handler] Suspiciously short joined result length for summarization", {
      summarization: {
        joinedResultLength: joinedResult.length
      }
    });
  }
  const finalPromptBytes = Buffer.byteLength(finalPrompt, "utf-8");
  if (finalPromptBytes > MAX_PROMPT_BYTES) {
    logger7.warn(ctx, "[summarization-handler] Final prompt exceeded byte budget", {
      summarization: {
        adjustmentInfo: {
          promptBudget,
          originalPromptBytes: fullPromptBytes,
          originalPromptLength: fullPrompt.length,
          finalPromptLength: finalPrompt.length,
          finalPromptBytes,
          maxPromptBytes: MAX_PROMPT_BYTES,
          didByteAdjust,
          oldPromptBudget
        }
      }
    });
  }
  logger7.info(ctx, "[summarization-handler] Summarization prompt exceeded char budget; truncated", {
    summarization: {
      promptTruncation: {
        totalMessages: messages2.length,
        fullyDroppedMessages: droppedCount,
        truncatedMessages: truncatedCount,
        originalMessagesCount: fullCount,
        originalPromptLength: fullPrompt.length,
        originalPromptBytes: fullPromptBytes,
        originalLastMessageLength: (_e2 = (_b2 = serialized.at(-1)) === null || _b2 === void 0 ? void 0 : _b2.length) !== null && _e2 !== void 0 ? _e2 : 0,
        finalPromptBytes,
        finalPromptLength: finalPrompt.length,
        promptBudget,
        didByteAdjust
      }
    }
  });
  return { prompt: finalPrompt, didTruncate: true };
}
function stripNonPrintableCharacters(input) {
  return input.replace(/[^\P{Cc}\n\r\t]/gu, "");
}
function reducePromptBudget(opts) {
  const divisor = opts.attempt >= 2 ? 3 : 2;
  let next = Math.floor(opts.current / divisor);
  if (opts.originalPromptLength !== void 0) {
    next = Math.min(next, Math.floor(opts.originalPromptLength * 0.75));
  }
  return Math.max(MIN_SUMMARIZATION_PROMPT_CHARS, next);
}
function parseSummarizerModelLabel(modelId) {
  const anthropicRouted = modelId.match(/^((?:us|eu|global)\.anthropic)\.(.+)$/);
  if (anthropicRouted) {
    return { model: anthropicRouted[2], provider: anthropicRouted[1] };
  }
  const accountRouted = modelId.match(/^accounts\/([^/]+)\/models\/(.+)$/);
  if (accountRouted) {
    return { model: accountRouted[2], provider: accountRouted[1] };
  }
  return { model: modelId, provider: "default" };
}
function executeSummarizationWithRetry(ctx, promptSession, messages2, options2) {
  return __awaiter29(this, void 0, void 0, function* () {
    var _a19, _b2, _c2;
    var _d, _e2, _f, _g;
    const { model: metricsModel, provider: metricsProvider } = parseSummarizerModelLabel(promptSession.getModelId());
    const orchestrationLogFields = {
      summarizationMode: options2.backgroundSummarizationMode,
      triggerReason: options2.triggerReason,
      model: metricsModel
    };
    let promptBudget = (_d = options2.maxPromptChars) !== null && _d !== void 0 ? _d : MAX_SUMMARIZATION_PROMPT_CHARS;
    let requestShorterOutput = false;
    let lastErrorKind;
    const errorKinds = [];
    let attemptsPerformed = 0;
    let lastFailedPromptLength;
    let expectTruncationFromInputReduction = false;
    for (let attempt = 1; attempt <= MAX_SUMMARIZATION_RETRIES; attempt++) {
      if ((_a19 = options2.cancellationToken) === null || _a19 === void 0 ? void 0 : _a19.cancelled) {
        break;
      }
      attemptsPerformed++;
      try {
        logger7.info(ctx, "[summarization-handler] Attempt started", {
          summarization: Object.assign(Object.assign({}, orchestrationLogFields), {
            attempt,
            maxRetries: MAX_SUMMARIZATION_RETRIES,
            promptBudget,
            requestShorterOutput
          })
        });
        summarizationTryAttempts.increment(ctx, 1, {
          model: metricsModel,
          provider: metricsProvider
        });
        const buildPromptOptions = {
          requestShorterOutput,
          maxPromptChars: Math.min(promptBudget, MAX_SUMMARIZATION_PROMPT_CHARS)
        };
        let { prompt: summaryPrompt, didTruncate } = buildSummarizationPrompt(ctx, messages2, buildPromptOptions);
        if (expectTruncationFromInputReduction && attempt === MAX_SUMMARIZATION_RETRIES) {
          const originalLength = summaryPrompt.length;
          summaryPrompt = stripNonPrintableCharacters(summaryPrompt);
          const strippedChars = originalLength - summaryPrompt.length;
          if (strippedChars > 0) {
            logger7.info(ctx, "[summarization-handler] Stripped non-printable characters from prompt on final input-limit retry", {
              summarization: {
                attempt,
                originalLength,
                strippedLength: summaryPrompt.length,
                strippedChars
              }
            });
          }
        }
        if (expectTruncationFromInputReduction && !didTruncate) {
          logger7.warn(ctx, "[summarization-handler] Expected prompt truncation after input limit reduction but prompt fit within reduced budget", {
            summarization: {
              attempt,
              promptBudget,
              promptLength: summaryPrompt.length,
              lastFailedPromptLength
            }
          });
        }
        expectTruncationFromInputReduction = false;
        lastFailedPromptLength = summaryPrompt.length;
        const result = yield executeSummarizationStream(ctx, promptSession, summaryPrompt, options2.maxOutputTokens);
        logger7.info(ctx, "[summarization-handler] Attempt succeeded", {
          summarization: Object.assign(Object.assign({}, orchestrationLogFields), {
            attempt,
            contentLength: result.text.length,
            fullPromptLength: summaryPrompt.length,
            promptBudget,
            didTruncate
          })
        });
        summarizationTrySuccess.increment(ctx, 1, {
          model: metricsModel,
          provider: metricsProvider
        });
        summarizationAttempts.increment(ctx, 1, {
          invocation: options2.backgroundSummarizationMode,
          triggerReason: options2.triggerReason,
          model: metricsModel,
          provider: metricsProvider
        });
        summarizationSuccess.increment(ctx, 1, {
          invocation: options2.backgroundSummarizationMode,
          triggerReason: options2.triggerReason,
          model: metricsModel,
          provider: metricsProvider
        });
        if (options2.isFallbackToMainModel) {
          summarizationFallbackAttempts.increment(ctx);
        }
        return Object.assign(Object.assign({}, result), { hadError: false });
      } catch (error42) {
        const enableReduceInputsRetry = (_e2 = options2.enableReduceInputsRetry) !== null && _e2 !== void 0 ? _e2 : false;
        const enableRetryUncategorizedErrors = (_f = options2.enableRetryUncategorizedErrors) !== null && _f !== void 0 ? _f : true;
        const enableRetryOutputTokenLimit = (_g = options2.enableRetryOutputTokenLimit) !== null && _g !== void 0 ? _g : true;
        const retryDirective = getRetryDirective(error42, {
          transientRetryDelayMs: TRANSIENT_SUMMARIZATION_RETRY_DELAY_MS,
          enableReduceInputsRetry,
          enableRetryUncategorizedErrors,
          enableRetryOutputTokenLimit
        });
        if (retryDirective.reduceInputs) {
          logger7.info(ctx, "[summarization-handler] prompt guard did not reduce inputs enough", {
            summarization: {
              attempt,
              promptBudget,
              lastFailedPromptLength,
              summarizationMode: options2.backgroundSummarizationMode,
              triggerReason: options2.triggerReason
            }
          });
        }
        lastErrorKind = retryDirective.errorType;
        errorKinds.push(retryDirective.errorType);
        const willRetry = retryDirective.shouldRetry && attempt < MAX_SUMMARIZATION_RETRIES;
        summarizationTryFailures.increment(ctx, 1, {
          errorKind: retryDirective.errorType,
          invocation: options2.backgroundSummarizationMode,
          triggerReason: options2.triggerReason,
          model: metricsModel,
          provider: metricsProvider
        });
        logger7.error(ctx, "[summarization-handler] Error summarizing messages", error42, {
          summarization: Object.assign(Object.assign({}, orchestrationLogFields), { attempt, maxRetries: MAX_SUMMARIZATION_RETRIES, errorType: retryDirective.errorType, willRetry, retryDelayMs: retryDirective.retryDelayMs, requestShorterOutput: retryDirective.requestShorterOutput, reduceInputs: retryDirective.reduceInputs, options: {
            enableReduceInputsRetry,
            enableRetryUncategorizedErrors,
            enableRetryOutputTokenLimit
          } })
        });
        if (!willRetry) {
          break;
        }
        summarizationRetries.increment(ctx, 1, {
          errorKind: retryDirective.errorType
        });
        if (retryDirective.requestShorterOutput) {
          requestShorterOutput = true;
          logger7.info(ctx, "[summarization-handler] Retrying with shorter-output instruction", {
            summarization: Object.assign(Object.assign({}, orchestrationLogFields), { attempt })
          });
        }
        if (retryDirective.reduceInputs) {
          const nextPromptBudget = reducePromptBudget({
            current: promptBudget,
            attempt,
            originalPromptLength: lastFailedPromptLength
          });
          logger7.info(ctx, "[summarization-handler] Retrying with reduced input budget", {
            summarization: Object.assign(Object.assign({}, orchestrationLogFields), {
              attempt,
              previousPromptBudget: promptBudget,
              nextPromptBudget,
              lastFailedPromptLength
            })
          });
          promptBudget = nextPromptBudget;
          expectTruncationFromInputReduction = true;
        }
        if (retryDirective.retryDelayMs > 0) {
          logger7.info(ctx, "[summarization-handler] Retrying after delay", {
            summarization: Object.assign(Object.assign({}, orchestrationLogFields), { attempt, retryDelayMs: retryDirective.retryDelayMs })
          });
          yield new Promise((resolve29) => setTimeout(resolve29, retryDirective.retryDelayMs));
          if ((_b2 = options2.cancellationToken) === null || _b2 === void 0 ? void 0 : _b2.cancelled) {
            break;
          }
        }
      }
    }
    const wasCancelled = ((_c2 = options2.cancellationToken) === null || _c2 === void 0 ? void 0 : _c2.cancelled) === true;
    const errorKind = wasCancelled ? "Cancelled" : lastErrorKind !== null && lastErrorKind !== void 0 ? lastErrorKind : "UnknownError";
    if (wasCancelled) {
      logger7.info(ctx, "[summarization-handler] Summarization retries cancelled", {
        summarization: Object.assign(Object.assign({}, orchestrationLogFields), {
          attempts: attemptsPerformed,
          maxRetries: MAX_SUMMARIZATION_RETRIES,
          errorKind,
          errorKinds
        })
      });
    } else {
      logger7.warn(ctx, "[summarization-handler] All retries exhausted", {
        summarization: Object.assign(Object.assign({}, orchestrationLogFields), {
          attempts: attemptsPerformed,
          maxRetries: MAX_SUMMARIZATION_RETRIES,
          errorKind,
          errorKinds
        })
      });
    }
    summarizationAttempts.increment(ctx, 1, {
      invocation: options2.backgroundSummarizationMode,
      triggerReason: options2.triggerReason,
      model: metricsModel,
      provider: metricsProvider
    });
    summarizationFailures.increment(ctx, 1, {
      errorKind,
      invocation: options2.backgroundSummarizationMode,
      triggerReason: options2.triggerReason,
      model: metricsModel,
      provider: metricsProvider
    });
    if (options2.isFallbackToMainModel) {
      summarizationFallbackAttempts.increment(ctx);
      summarizationFallbackFailures.increment(ctx, 1, {
        errorKind,
        invocation: options2.backgroundSummarizationMode,
        triggerReason: options2.triggerReason
      });
    }
    if (options2.throwOnRetryExhaustion && !wasCancelled) {
      throw new Error(`Summarization failed after ${attemptsPerformed} attempts (${errorKinds.join(", ")})`);
    }
    return {
      text: "No summary generated",
      inputTokens: void 0,
      outputTokens: void 0,
      hadError: true,
      errorKind,
      isPlaceholder: true
    };
  });
}
var summarizationSuccess = createCounter("agent.summarization.success", {
  description: "Successful summarizations",
  labelNames: ["invocation", "triggerReason", "model", "provider"]
});
var summarizationAttempts = createCounter("agent.summarization.attempts", {
  description: "Total summarization attempts",
  labelNames: ["invocation", "triggerReason", "model", "provider"]
});
var summarizationFailures = createCounter("agent.summarization.failures", {
  description: "Failed summarizations",
  labelNames: ["errorKind", "invocation", "triggerReason", "model", "provider"]
});
var summarizationTryAttempts = createCounter("agent.summarization.try.attempts", {
  description: "Per-try summarization attempts within the retry loop",
  labelNames: ["model", "provider"]
});
var summarizationTrySuccess = createCounter("agent.summarization.try.success", {
  description: "Per-try successful summarization attempts",
  labelNames: ["model", "provider"]
});
var summarizationTryFailures = createCounter("agent.summarization.try.failures", {
  description: "Per-try failed summarization attempts",
  labelNames: ["errorKind", "invocation", "triggerReason", "model", "provider"]
});
var summarizationRetries = createCounter("agent.summarization.retries", {
  description: "Total retries (attempts beyond the first) that actually executed",
  labelNames: ["errorKind"]
});
var summaryLengthChars = createHistogram("agent.summarization.summary_length_chars", {
  description: "Summary length in characters"
});
var summaryBlockingDurationMs = createHistogram("agent.summarization.summary_blocking_duration_ms", {
  description: "Blocking duration of summarization"
});
var summarizationInputTokens = createHistogram("agent.summarization.input_tokens", {
  description: "Input tokens consumed during summarization",
  labelNames: ["model", "provider"]
});
var summarizationOutputTokens = createHistogram("agent.summarization.output_tokens", {
  description: "Output tokens generated during summarization",
  labelNames: ["model", "provider"]
});
var summarizationCompressionPercent = createHistogram("agent.summarization.compression_percent", {
  description: "Percentage of tokens removed by summarization: (input - output) / input * 100",
  labelNames: ["model", "provider"]
});
var summarizationOriginalLengthChars = createHistogram("agent.summarization.original_length_chars", {
  description: "Total character length of all messages before summarization",
  labelNames: ["model", "provider"]
});
var summarizationPersistedLengthChars = createHistogram("agent.summarization.persisted_length_chars", {
  description: "Total character length of all messages persisted after summarization (system + userInfo + summary + preserved tail)",
  labelNames: ["model", "provider"]
});
var summarizationTotalCompressionPercent = createHistogram("agent.summarization.total_compression_percent", {
  description: "End-to-end compression percentage including preserved tail messages: (1 - persisted/original) * 100",
  labelNames: ["model", "provider"]
});
var summarizationDeterministicFallbackUsed = createCounter("agent.summarization.deterministic_fallback.used", {
  description: "WaitForCompletion summarizations that fell back to deterministic compaction after LLM retries exhausted",
  labelNames: ["errorKind", "triggerReason", "model", "provider"]
});
var summarizationFallbackAttempts = createCounter("agent.summarization.fallback_attempts", {
  description: "Summarization attempts where all summarization models are blocked and the main model is used as fallback"
});
var summarizationFallbackFailures = createCounter("agent.summarization.fallback_failures", {
  description: "Failed summarizations where all summarization models are blocked and the main model is used as fallback",
  labelNames: ["errorKind", "invocation", "triggerReason"]
});
var timeBetweenLastTwoMessagesMs = createHistogram("agent.summarization.time_between_last_two_messages_ms", {
  description: "Time between last two messages in conversation"
});
var DEBUG_SUMMARIZATION_STRATEGY_FILE = import_node_path30.default.join(import_node_os6.default.homedir(), "debug-summarization-strategy.txt");
function hasToolInvocation(message) {
  const content = message.content;
  if (!Array.isArray(content)) {
    return false;
  }
  return content.some((part) => part.type === "tool-call");
}
function isToolResult(message) {
  if (message.role !== "tool") {
    return false;
  }
  const content = message.content;
  if (!Array.isArray(content)) {
    return false;
  }
  return content.some((part) => part.type === "tool-result");
}
function shouldForceSummarizationForTesting(messages2, evalCompletionMode) {
  var _a19, _b2;
  if (process.env.NODE_ENV === "production" && process.env.IS_EVALS_SERVICE !== "true") {
    return void 0;
  }
  if (messages2.length === 0) {
    return void 0;
  }
  const lastMessage = messages2[messages2.length - 1];
  const lastMessageIsUser = lastMessage.role === "user";
  const lastMessageIsToolResult = isToolResult(lastMessage);
  const numToolCalls = messages2.filter(hasToolInvocation).length;
  if (evalCompletionMode === "next-human") {
    return lastMessageIsUser ? BackgroundSummarizationMode.WaitForCompletion : void 0;
  }
  if (evalCompletionMode === "in-flight") {
    return BackgroundSummarizationMode.WaitForCompletionIfStarted;
  }
  try {
    const strategy = import_node_fs31.default.readFileSync(DEBUG_SUMMARIZATION_STRATEGY_FILE, "utf8").trim();
    if (strategy.startsWith("every-human")) {
      const numHumanMessages = messages2.filter((message) => message.role === "user").length;
      const numHumanMessagesLimit = Number.parseInt(strategy.includes(":") ? (_a19 = strategy.split(":")[1]) !== null && _a19 !== void 0 ? _a19 : "1" : "1", 10);
      return Number.isFinite(numHumanMessagesLimit) && numHumanMessagesLimit > 0 && lastMessageIsUser && numHumanMessages % numHumanMessagesLimit === 0 ? BackgroundSummarizationMode.WaitForCompletion : void 0;
    }
    if (strategy === "next-human") {
      if (lastMessageIsUser) {
        import_node_fs31.default.rmSync(DEBUG_SUMMARIZATION_STRATEGY_FILE);
      }
      return lastMessageIsUser ? BackgroundSummarizationMode.WaitForCompletion : void 0;
    }
    if (strategy === "next-tool") {
      if (lastMessageIsToolResult) {
        import_node_fs31.default.rmSync(DEBUG_SUMMARIZATION_STRATEGY_FILE);
      }
      return lastMessageIsToolResult ? BackgroundSummarizationMode.WaitForCompletion : void 0;
    }
    if (strategy.startsWith("every-tool")) {
      const numToolCallsLimit = Number.parseInt(strategy.includes(":") ? (_b2 = strategy.split(":")[1]) !== null && _b2 !== void 0 ? _b2 : "1" : "1", 10);
      return Number.isFinite(numToolCallsLimit) && numToolCallsLimit > 0 && lastMessageIsToolResult && numToolCalls % numToolCallsLimit === 0 ? BackgroundSummarizationMode.WaitForCompletion : void 0;
    }
  } catch (_err) {
  }
  return void 0;
}
var SUMMARIZATION_SYSTEM_PROMPT = `You are an intelligent assistant, tasked with summarizing the following conversation. You MUST follow the instructions given in the <summarization_request> tags and summarize the conversation. This summary will be provided to another AI assistant to continue the task at hand, so you should align the summary with the task in the conversation.`;
var PREVIOUS_CONVERSATION_SUMMARY_PREFIX = "[Previous conversation summary]:";
var SUMMARY_PRESERVED_IMAGE_NOTE = "[Latest screenshot]: The image below is the most recent screenshot from the summarized conversation, captured before the summary above was created. Use it to continue from the last known visual state; take a fresh screenshot if you need to confirm the current state.";
var MORE_PROMPT = `What you see above is the conversation so far, rendered as a transcript. Previous user messages, previous assistant messages, and tool calls are shown in tags, while the original system prompt has been removed. The content in the tags has been rendered exactly as it was in the original conversation.

Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions. This summary will be provided to another AI assistant to continue the task at hand, so you should align the summary with the task in the conversation above. So you should NEVER refer to summarization in your summary, just an output that could be used to continue the task.

This summary should be thorough in capturing technical details, code patterns, and architectural decisions
that would be essential for continuing development work without losing context.

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
   - file names
   - full code snippets
   - function signatures
   - file edits
- Errors that you ran into and how you fixed them
- Pay special attention to specific user feedback that you received, especially if the user told you to do
something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results or subagent prompts/results. These are critical for understanding the users' feedback and changing intent.
7. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
8. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
9. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests or really old requests that were already completed.

If there is a next step, include direct quotes from the most recent conversation
showing exactly what task you were working on and where you left off. This should be verbatim to ensure
there's no drift in task interpretation.

Here's an example of how your output should be structured:

<example>
Summary:
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]
   - [...]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Summary of the changes made to this file, if any]
      - [Important Code Snippet]
   - [File Name 2]
      - [Important Code Snippet]
   - [...]

4. Errors and fixes:
   - [Detailed description of error 1]:
      - [How you fixed the error]
      - [User feedback on the error if any]
   - [...]

5. Problem Solving:
   [Description of solved problems and ongoing troubleshooting]

6. All user messages:
   - [Detailed non tool use, non subagent user message]
   - [...]

7. Pending Tasks:
   - [Task 1]
   - [Task 2]
   - [...]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]
</example>

Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response.`;
var SummarizationHandler = class {
  constructor(promptSession, isFallbackToMainModel = false, options2) {
    var _a19, _b2, _c2, _d, _e2, _f, _g, _h, _j;
    this.promptSession = promptSession;
    this.isFallbackToMainModel = isFallbackToMainModel;
    this.enableReduceInputsRetry = (_a19 = options2 === null || options2 === void 0 ? void 0 : options2.enableReduceInputsRetry) !== null && _a19 !== void 0 ? _a19 : false;
    this.enableRetryUncategorizedErrors = (_b2 = options2 === null || options2 === void 0 ? void 0 : options2.enableRetryUncategorizedErrors) !== null && _b2 !== void 0 ? _b2 : true;
    this.throwOnRetryExhaustion = (_c2 = options2 === null || options2 === void 0 ? void 0 : options2.throwOnRetryExhaustion) !== null && _c2 !== void 0 ? _c2 : false;
    this.maxPromptChars = options2 === null || options2 === void 0 ? void 0 : options2.maxPromptChars;
    this.useRelaxedSplitIndexGuard = (_d = options2 === null || options2 === void 0 ? void 0 : options2.useRelaxedSplitIndexGuard) !== null && _d !== void 0 ? _d : false;
    this.preserveLastUserMessage = (_e2 = options2 === null || options2 === void 0 ? void 0 : options2.preserveLastUserMessage) !== null && _e2 !== void 0 ? _e2 : true;
    this.alwaysRetryOutputTokenLimit = (_f = options2 === null || options2 === void 0 ? void 0 : options2.alwaysRetryOutputTokenLimit) !== null && _f !== void 0 ? _f : true;
    this.preserveLatestImage = (_g = options2 === null || options2 === void 0 ? void 0 : options2.preserveLatestImage) !== null && _g !== void 0 ? _g : false;
    this.enableDeterministicFallback = (_h = options2 === null || options2 === void 0 ? void 0 : options2.enableDeterministicFallback) !== null && _h !== void 0 ? _h : false;
    this.deterministicFallbackWindowRatio = (_j = options2 === null || options2 === void 0 ? void 0 : options2.deterministicFallbackWindowRatio) !== null && _j !== void 0 ? _j : DEFAULT_DETERMINISTIC_FALLBACK_WINDOW_RATIO;
    this.maxOutputTokens = this.isFallbackToMainModel ? void 0 : options2 === null || options2 === void 0 ? void 0 : options2.maxOutputTokens;
  }
  getModelId() {
    return this.promptSession.getModelId();
  }
  getMetricsModelLabel() {
    return this.getMetricsLabels().model;
  }
  getMetricsLabels() {
    return parseSummarizerModelLabel(this.promptSession.getModelId());
  }
  // ---------------------------------------------------------------------------
  // Phase 1: Decompose
  // ---------------------------------------------------------------------------
  partitionMessages(messages2, options2) {
    var _a19, _b2;
    const { systemMessage, userInfoMessage, messagesForSummarization } = prepareMessagesForCompaction(messages2);
    let splitIndex = -1;
    for (let i = messagesForSummarization.length - 1; i >= 0; i--) {
      const message = messagesForSummarization[i];
      if (message.role === "user" && !isInjectedReminderMessage(message)) {
        splitIndex = i;
        break;
      }
    }
    const splitGuardThreshold = this.useRelaxedSplitIndexGuard ? 0 : 1;
    if (splitIndex <= splitGuardThreshold || options2.fullSummarization) {
      splitIndex = messagesForSummarization.length;
    }
    const preserveLastUser = this.preserveLastUserMessage && options2.fullSummarization !== true;
    const summarizeEnd = preserveLastUser ? splitIndex + 1 : splitIndex;
    const messagesToSummarize = messagesForSummarization.slice(0, summarizeEnd);
    let preservedTailMessages = messagesForSummarization.slice(splitIndex);
    if (preserveLastUser && preservedTailMessages.length === 0 && messagesToSummarize.length > 0) {
      let lastUserIndex = -1;
      for (let i = messagesToSummarize.length - 1; i >= 0; i--) {
        const m2 = messagesToSummarize[i];
        if (m2.role === "user" && ((_b2 = (_a19 = m2.providerOptions) === null || _a19 === void 0 ? void 0 : _a19.cursor) === null || _b2 === void 0 ? void 0 : _b2.isSummary) !== true && !isInjectedReminderMessage(m2)) {
          lastUserIndex = i;
          break;
        }
      }
      if (lastUserIndex !== -1 && lastUserIndex !== messagesToSummarize.length - 1) {
        preservedTailMessages = [messagesToSummarize[lastUserIndex]];
      }
    }
    const skillBlocks = collectAllSkillBlocks(messagesForSummarization);
    return {
      systemMessage,
      userInfoMessage,
      messagesToSummarize,
      preservedTailMessages,
      skillBlocks
    };
  }
  // ---------------------------------------------------------------------------
  // Phase 2: Generate summary
  // ---------------------------------------------------------------------------
  generateSummary(ctx, partitioned, options2) {
    return __awaiter29(this, void 0, void 0, function* () {
      var _a19;
      const result = yield executeSummarizationWithRetry(ctx, this.promptSession, partitioned.messagesToSummarize, {
        isFallbackToMainModel: this.isFallbackToMainModel,
        enableReduceInputsRetry: this.enableReduceInputsRetry,
        enableRetryUncategorizedErrors: this.enableRetryUncategorizedErrors,
        enableRetryOutputTokenLimit: (_a19 = options2.enableRetryOutputTokenLimit) !== null && _a19 !== void 0 ? _a19 : this.alwaysRetryOutputTokenLimit,
        throwOnRetryExhaustion: this.throwOnRetryExhaustion,
        maxPromptChars: this.maxPromptChars,
        backgroundSummarizationMode: options2.backgroundSummarizationMode,
        triggerReason: options2.triggerReason,
        maxOutputTokens: this.maxOutputTokens,
        cancellationToken: options2.cancellationToken
      });
      if (this.shouldUseDeterministicFallback(result) && partitioned.messagesToSummarize.length > 0) {
        const fallbackText = this.buildDeterministicFallbackText(ctx, partitioned, options2, result.errorKind);
        if (fallbackText !== null) {
          return Object.assign(Object.assign({}, result), { text: fallbackText, isPlaceholder: false });
        }
      }
      return result;
    });
  }
  shouldUseDeterministicFallback(result) {
    if (!this.enableDeterministicFallback) {
      return false;
    }
    if (!result.hadError) {
      return false;
    }
    const errorKind = result.errorKind;
    if (errorKind === "Cancelled") {
      return false;
    }
    if (errorKind === null || errorKind === void 0 ? void 0 : errorKind.toLowerCase().includes("abort")) {
      return false;
    }
    return true;
  }
  buildDeterministicFallbackText(ctx, partitioned, options2, errorKind) {
    const { model: metricsModel, provider: metricsProvider } = this.getMetricsLabels();
    const maxChars = computeDeterministicFallbackMaxChars(options2.contextWindowTokens, this.deterministicFallbackWindowRatio);
    const built = buildDeterministicSummaryText(ctx, partitioned.messagesToSummarize, { maxChars });
    if (built === null) {
      logger7.warn(ctx, "[summarization-handler] Deterministic fallback could not fit within budget; falling through to placeholder", {
        summarization: {
          model: metricsModel,
          triggerReason: options2.triggerReason,
          backgroundSummarizationMode: options2.backgroundSummarizationMode,
          errorKind: errorKind !== null && errorKind !== void 0 ? errorKind : "unknown",
          contextWindowTokens: options2.contextWindowTokens,
          windowRatio: this.deterministicFallbackWindowRatio,
          maxChars,
          totalMessages: partitioned.messagesToSummarize.length
        }
      });
      return null;
    }
    summarizationDeterministicFallbackUsed.increment(ctx, 1, {
      errorKind: errorKind !== null && errorKind !== void 0 ? errorKind : "unknown",
      triggerReason: options2.triggerReason,
      model: metricsModel,
      provider: metricsProvider
    });
    logger7.info(ctx, "[summarization-handler] Deterministic fallback produced summary", {
      summarization: {
        model: metricsModel,
        triggerReason: options2.triggerReason,
        backgroundSummarizationMode: options2.backgroundSummarizationMode,
        errorKind: errorKind !== null && errorKind !== void 0 ? errorKind : "unknown",
        contextWindowTokens: options2.contextWindowTokens,
        windowRatio: this.deterministicFallbackWindowRatio,
        maxChars,
        fallbackTextLength: built.text.length,
        fullyPreservedMessageCount: built.fullyPreservedMessageCount,
        truncatedCount: built.truncatedCount,
        droppedCount: built.droppedCount,
        totalMessages: partitioned.messagesToSummarize.length
      }
    });
    return built.text;
  }
  // ---------------------------------------------------------------------------
  // Phase 3: Build summary message
  // ---------------------------------------------------------------------------
  buildSummaryMessage(rawSummary, partitioned, enrichments, options2) {
    var _a19, _b2;
    var _c2, _d, _e2;
    const durableBlocks = renderDurableBlocks("external", enrichments);
    const summary = rawSummary.text + appendDurableBlocks("external", durableBlocks);
    const carrierContent = `${PREVIOUS_CONVERSATION_SUMMARY_PREFIX} ${summary}`;
    const privacyMode = (_e2 = (_d = (_c2 = options2 === null || options2 === void 0 ? void 0 : options2.privacyMode) !== null && _c2 !== void 0 ? _c2 : (_a19 = partitioned.messagesToSummarize[0]) === null || _a19 === void 0 ? void 0 : _a19._privacyMode) !== null && _d !== void 0 ? _d : (_b2 = partitioned.systemMessage) === null || _b2 === void 0 ? void 0 : _b2._privacyMode) !== null && _e2 !== void 0 ? _e2 : PrivacyMode.UNSPECIFIED;
    const preservedImage = this.preserveLatestImage && findLatestImagePart(partitioned.preservedTailMessages) === null ? findLatestImagePart(partitioned.messagesToSummarize) : null;
    const carrierMessage = preservedImage === null ? {
      role: "user",
      content: carrierContent,
      providerOptions: { cursor: { isSummary: true } }
    } : {
      role: "user",
      content: [
        { type: "text", text: carrierContent },
        { type: "text", text: SUMMARY_PRESERVED_IMAGE_NOTE },
        toUserMessageImagePart(preservedImage)
      ],
      providerOptions: { cursor: { isSummary: true } }
    };
    return {
      message: toRedactedCoreMessage(carrierMessage, privacyMode),
      summaryTextLength: carrierContent.length
    };
  }
  // ---------------------------------------------------------------------------
  // Phase 4: Assemble final messages
  // ---------------------------------------------------------------------------
  assembleFinalMessages(partitioned, summaryMessage) {
    return [
      ...partitioned.systemMessage ? [partitioned.systemMessage] : [],
      ...partitioned.userInfoMessage ? [partitioned.userInfoMessage] : [],
      summaryMessage,
      ...partitioned.preservedTailMessages
    ];
  }
  // ---------------------------------------------------------------------------
  // Top-level summarize  (delegates to pipeline + adds metrics)
  // ---------------------------------------------------------------------------
  summarize(ctx, messages2, options2) {
    return __awaiter29(this, void 0, void 0, function* () {
      var _a19;
      var _b2, _c2;
      if (!messages2.find((message) => message.role === "system")) {
        logger7.warn(ctx, "Compaction input has no system message", {
          summarization: { messagesCount: messages2.length }
        });
      }
      const { userInfoMessage } = prepareMessagesForCompaction(messages2);
      if (!userInfoMessage) {
        logger7.warn(ctx, "Compaction input has no userInfo message", {
          summarization: { messagesCount: messages2.length }
        });
      }
      const summarizationLogFields = {
        summarizationMode: options2.backgroundSummarizationMode,
        triggerReason: options2.triggerReason,
        model: this.getMetricsModelLabel()
      };
      const startTime = performance.now();
      let timeBetweenMessages;
      if (messages2.length >= 2) {
        const lastMsg = messages2[messages2.length - 1];
        const secondLastMsg = messages2[messages2.length - 2];
        if ("timestamp" in lastMsg && "timestamp" in secondLastMsg) {
          const lastTime = lastMsg.timestamp;
          const secondLastTime = secondLastMsg.timestamp;
          if (typeof lastTime === "number" && typeof secondLastTime === "number") {
            timeBetweenMessages = lastTime - secondLastTime;
          }
        }
      }
      try {
        const pipelineResult = yield runSummarizationPipeline(this, ctx, messages2, options2);
        const { rawSummary, summaryTextLength } = pipelineResult;
        const durationMs = performance.now() - startTime;
        this.recordMetrics(ctx, {
          rawSummary,
          durationMs,
          timeBetweenMessages,
          originalMessages: messages2,
          fullReplacementMessages: pipelineResult.fullReplacementMessages,
          summaryTextLength
        });
        const content = pipelineResult.newSummaryMessage.content;
        let carrierText;
        if (isRedactedString(content)) {
          carrierText = content;
        } else if (Array.isArray(content)) {
          for (const part of content) {
            if (part.type === "text" && isRedactedString(part.text)) {
              carrierText = part.text;
              break;
            }
          }
        }
        const summaryPrefix = `${PREVIOUS_CONVERSATION_SUMMARY_PREFIX} `;
        const summary = carrierText !== void 0 ? carrierText.safeTransform((summaryText) => summaryText.startsWith(summaryPrefix) ? summaryText.slice(summaryPrefix.length) : summaryText) : createRedactedString(pipelineResult.rawSummary.text, DataClassification.CODE, "summary", (_c2 = (_b2 = options2.privacyMode) !== null && _b2 !== void 0 ? _b2 : (_a19 = messages2[0]) === null || _a19 === void 0 ? void 0 : _a19._privacyMode) !== null && _c2 !== void 0 ? _c2 : PrivacyMode.UNSPECIFIED);
        const hadError = pipelineResult.rawSummary.hadError === true;
        logger7.info(ctx, "[summarization-handler] Summarization completed", {
          summarization: Object.assign(Object.assign({}, summarizationLogFields), {
            durationMs,
            hadError,
            errorKind: pipelineResult.rawSummary.errorKind
          })
        });
        return Object.assign(Object.assign({}, pipelineResult), { summary: { summary }, hadError, errorKind: pipelineResult.rawSummary.errorKind, isPlaceholder: pipelineResult.rawSummary.isPlaceholder === true });
      } catch (error42) {
        const durationMs = performance.now() - startTime;
        summaryBlockingDurationMs.histogram(ctx, durationMs);
        if (timeBetweenMessages !== void 0) {
          timeBetweenLastTwoMessagesMs.histogram(ctx, timeBetweenMessages);
        }
        logger7.error(ctx, "[summarization-handler] Summarize pipeline failed", error42, {
          summarization: summarizationLogFields
        });
        throw error42;
      }
    });
  }
  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------
  recordMetrics(ctx, params) {
    const { rawSummary, durationMs, timeBetweenMessages } = params;
    summaryBlockingDurationMs.histogram(ctx, durationMs);
    summaryLengthChars.histogram(ctx, params.summaryTextLength);
    const { model, provider } = this.getMetricsLabels();
    if (rawSummary.inputTokens !== void 0) {
      summarizationInputTokens.histogram(ctx, rawSummary.inputTokens, {
        model,
        provider
      });
      if (rawSummary.inputTokens > INPUT_TOKENS_WARN_THRESHOLD) {
        logger7.warn(ctx, "[summarization-handler] Summarization input tokens are very high", {
          summarization: {
            inputTokens: rawSummary.inputTokens,
            outputTokens: rawSummary.outputTokens,
            durationMs,
            model
          }
        });
      }
    }
    if (rawSummary.outputTokens !== void 0) {
      summarizationOutputTokens.histogram(ctx, rawSummary.outputTokens, {
        model,
        provider
      });
      if (rawSummary.outputTokens > OUT_TOKENS_WARN_THRESHOLD) {
        logger7.warn(ctx, "[summarization-handler] Summarization output tokens are very high", {
          summarization: {
            inputTokens: rawSummary.inputTokens,
            outputTokens: rawSummary.outputTokens,
            durationMs,
            model
          }
        });
      }
    }
    if (rawSummary.inputTokens !== void 0 && rawSummary.outputTokens !== void 0 && rawSummary.inputTokens > 0) {
      const pctRemoved = (rawSummary.inputTokens - rawSummary.outputTokens) / rawSummary.inputTokens * 100;
      summarizationCompressionPercent.histogram(ctx, pctRemoved, {
        model,
        provider
      });
    }
    if (timeBetweenMessages !== void 0) {
      timeBetweenLastTwoMessagesMs.histogram(ctx, timeBetweenMessages);
    }
    const originalLengthChars = this.totalRawSerializedCharLength(params.originalMessages);
    const persistedLengthChars = this.totalRawSerializedCharLength(params.fullReplacementMessages);
    summarizationOriginalLengthChars.histogram(ctx, originalLengthChars, {
      model,
      provider
    });
    summarizationPersistedLengthChars.histogram(ctx, persistedLengthChars, {
      model,
      provider
    });
    if (originalLengthChars > 0) {
      const compressionPercent = (originalLengthChars - persistedLengthChars) / originalLengthChars * 100;
      summarizationTotalCompressionPercent.histogram(ctx, compressionPercent, {
        model,
        provider
      });
    }
  }
  totalRawSerializedCharLength(messages2) {
    let total = 0;
    for (const message of messages2) {
      total += turnMessageToString(message, false).length;
    }
    return total;
  }
  /**
   * Checks if an error is related to input token/context limits.
   * The error detection logic is in openaiProxyAdapter.ts which converts
   * matching errors to InputTokenLimitError.
   */
  static isTokenLimitError(error42) {
    return error42 instanceof InputTokenLimitError;
  }
  /**
   * Checks if an error is a token-limit failure on either side of the model
   * call: input/context limit (InputTokenLimitError) or output max-tokens
   * limit (OutputTokensLimitExceededError). Matches by name through the error
   * cause chain in addition to instanceof, since these typed errors can lose
   * class identity across transport boundaries.
   */
  static isInputOrOutputTokenLimitError(error42) {
    return error42 instanceof InputTokenLimitError || hasErrorName(error42, "InputTokenLimitError") || error42 instanceof OutputTokensLimitExceededError || hasErrorName(error42, "OutputTokensLimitExceededError");
  }
};
