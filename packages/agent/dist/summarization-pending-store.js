init_dist4();
var logger59 = createLogger("summarization-pending-store");
var pendingSummaryAdoption = createCounter("agent.background_summarization.pending_adoption", {
  description: "Outcomes of pending-summary adoption attempts at request start (adopted | persist_declined | rejected_prefix_mismatch | rejected_too_few_messages | rejected_threshold | rejected_version | error | empty)",
  labelNames: ["model", "outcome"]
});
var pendingSummaryAgeAtTake = createHistogram("agent.background_summarization.pending_age_ms", {
  description: "Age of a stashed pending summary when the next request takes it; ages near the store's TTL mean stashes are expiring before the conversation returns",
  labelNames: ["model"]
});
var backgroundSummarizationStashed = createCounter("agent.background_summarization.stashed", {
  description: "Post-turn stash outcomes for background summarizations that outlived their turn (stored | skipped_too_large | skipped_superseded | skipped_error_result | store_error)",
  labelNames: ["model", "outcome"]
});
function toBase642(bytes) {
  return Buffer.from(bytes).toString("base64");
}
function fromBase642(b64) {
  return new Uint8Array(Buffer.from(b64, "base64"));
}
async function hashMessagesPrefix(privacyMode, messages2) {
  const serde = createRedactedCoreMessageSerde(privacyMode);
  const chunks = [];
  for (const message of messages2) {
    const serialized = serde.serialize(message);
    const lengthPrefix = new Uint8Array(4);
    new DataView(lengthPrefix.buffer).setUint32(0, serialized.length);
    chunks.push(lengthPrefix, serialized);
  }
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }
  const digest = await crypto.subtle.digest("SHA-256", combined);
  return toBase642(new Uint8Array(digest));
}
async function buildPendingSummaryRecord(args) {
  const serde = createRedactedCoreMessageSerde(args.privacyMode);
  const { fullReplacementMessages, newSummaryMessage } = args.result;
  const summaryMessageIndex = fullReplacementMessages.indexOf(newSummaryMessage);
  if (summaryMessageIndex === -1) {
    throw new Error("Pending summary stash: summary carrier is not present in the replacement layout by reference");
  }
  const preservedTailIndices = args.result.preservedOriginalTailMessages.map((message) => {
    const index = fullReplacementMessages.indexOf(message);
    if (index === -1) {
      throw new Error("Pending summary stash: preserved tail message is not present in the replacement layout by reference");
    }
    return index;
  });
  const snapshotIndexByMessage = /* @__PURE__ */ new Map();
  args.messagesSummarized.forEach((message, index) => {
    snapshotIndexByMessage.set(message, index);
  });
  const replacementLayout = fullReplacementMessages.map((message) => {
    const prefixIndex = snapshotIndexByMessage.get(message);
    if (prefixIndex !== void 0) {
      return { prefixIndex };
    }
    return { messageB64: toBase642(serde.serialize(message)) };
  });
  return {
    version: 2,
    conversationId: args.conversationId,
    prefixHashB64: await hashMessagesPrefix(args.privacyMode, args.messagesSummarized),
    messagesSummarizedCount: args.messagesSummarized.length,
    messagesActuallySummarizedCount: args.result.messagesActuallySummarized.length,
    replacementLayout,
    summaryMessageIndex,
    preservedTailIndices,
    // STORAGE_FOR_USAGE: the record is stored server-side solely to serve
    // this user's own conversation on their next request. `enforcing` makes
    // unwrap throw (rather than soft-log) for privacy modes that disallow
    // storage of code data (NO_STORAGE), so the stash is skipped — enforcing
    // the privacy decision at the redaction layer in addition to the
    // backend-side wiring gate.
    summaryText: args.result.summary.summary.unwrap(PrivacyCapability.STORAGE_FOR_USAGE, {
      enforcing: true
    }),
    rawSummary: {
      text: args.result.rawSummary.text,
      inputTokens: args.result.rawSummary.inputTokens,
      outputTokens: args.result.rawSummary.outputTokens
    },
    modelId: args.modelId,
    summarizerType: args.summarizerType,
    startInvocationId: args.startInvocationId,
    startUsedTokens: args.startUsedTokens,
    startMaxTokens: args.startMaxTokens,
    usedTokensThresholdToStartBackgroundSummarization: args.usedTokensThresholdToStartBackgroundSummarization,
    usedTokensThresholdToPersistBackgroundSummarization: args.usedTokensThresholdToPersistBackgroundSummarization,
    triggerReason: args.triggerReason,
    summaryLifecycleId: args.summaryLifecycleId,
    launchedAtMs: args.launchedAtMs,
    createdAtMs: Date.now()
  };
}
function rehydrateSummarizationResult(args) {
  const serde = createRedactedCoreMessageSerde(args.privacyMode);
  const { record: record2 } = args;
  const fullReplacementMessages = record2.replacementLayout.map((entry) => {
    if ("prefixIndex" in entry) {
      const message = args.validatedPrefixMessages[entry.prefixIndex];
      if (message === void 0) {
        throw new Error("Pending summary record has an out-of-range prefix reference");
      }
      return message;
    }
    return serde.deserialize(fromBase642(entry.messageB64));
  });
  const newSummaryMessage = fullReplacementMessages[record2.summaryMessageIndex];
  if (newSummaryMessage === void 0) {
    throw new Error("Pending summary record has an invalid carrier index");
  }
  const preservedOriginalTailMessages = record2.preservedTailIndices.map((index) => {
    const message = fullReplacementMessages[index];
    if (message === void 0) {
      throw new Error("Pending summary record has an invalid tail index");
    }
    return message;
  });
  const summaryString = createRedactedString(record2.summaryText, DataClassification.CODE, "pendingSummaryText", args.privacyMode);
  return {
    messagesActuallySummarized: args.validatedPrefixMessages.slice(0, record2.messagesActuallySummarizedCount),
    newSummaryMessage,
    preservedOriginalTailMessages,
    rawSummary: {
      text: record2.rawSummary.text,
      inputTokens: record2.rawSummary.inputTokens,
      outputTokens: record2.rawSummary.outputTokens
    },
    summary: { summary: summaryString },
    fullReplacementMessages,
    onPersisted: args.onPersisted
  };
}
function stashSummarizationResultWhenOrphaned(args) {
  const { ctx } = args;
  const launchedAtMs = Date.now();
  let completedResult;
  let stashStarted = false;
  const stashResult = async (result) => {
    stashStarted = true;
    if (result.hadError === true) {
      backgroundSummarizationStashed.increment(ctx, 1, {
        model: args.modelId,
        outcome: "skipped_error_result"
      });
      return;
    }
    try {
      const record2 = await buildPendingSummaryRecord({
        privacyMode: args.privacyMode,
        conversationId: args.conversationId,
        messagesSummarized: args.messagesSummarized,
        result,
        modelId: args.modelId,
        summarizerType: args.summarizerType,
        startInvocationId: args.startInvocationId,
        startUsedTokens: args.startUsedTokens,
        startMaxTokens: args.startMaxTokens,
        usedTokensThresholdToStartBackgroundSummarization: args.usedTokensThresholdToStartBackgroundSummarization,
        usedTokensThresholdToPersistBackgroundSummarization: args.usedTokensThresholdToPersistBackgroundSummarization,
        triggerReason: args.triggerReason,
        summaryLifecycleId: args.summaryLifecycleId,
        launchedAtMs
      });
      const storeOutcome = await args.store.store(ctx, record2);
      backgroundSummarizationStashed.increment(ctx, 1, {
        model: args.modelId,
        outcome: storeOutcome
      });
      if (storeOutcome === "stored") {
        logger59.info(ctx, "[summarization-stash] Stashed pending summary", {
          summarization: {
            ...args.logFields,
            messagesSummarizedCount: args.messagesSummarized.length
          }
        });
      } else {
        logger59.info(ctx, "[summarization-stash] Pending summary not stored", {
          summarization: { ...args.logFields, storeOutcome }
        });
      }
    } catch (error42) {
      backgroundSummarizationStashed.increment(ctx, 1, {
        model: args.modelId,
        outcome: "store_error"
      });
      logger59.warn(ctx, "[summarization-stash] Failed to stash pending summary", {
        summarization: { ...args.logFields, error: error42 }
      });
    }
  };
  const stashAndTrack = (result) => {
    if (result === void 0 || !args.cancellationToken.cancelled || stashStarted) {
      return void 0;
    }
    const write2 = stashResult(result);
    args.store.trackPendingWrite?.(write2);
    return write2;
  };
  args.cancellationToken.onCancelled = () => {
    void stashAndTrack(completedResult);
  };
  args.summarizationPromise.then(async (result) => {
    if (!args.cancellationToken.cancelled) {
      completedResult = result;
      return;
    }
    await stashAndTrack(result);
  }).catch(() => {
  });
}
async function takePendingSummaryForAdoption(args) {
  const { ctx } = args;
  const record2 = await args.store.take(ctx, args.conversationId);
  if (record2 === void 0) {
    pendingSummaryAdoption.increment(ctx, 1, { model: "none", outcome: "empty" });
    return void 0;
  }
  pendingSummaryAgeAtTake.histogram(ctx, Date.now() - record2.createdAtMs, {
    model: record2.modelId ?? "unknown"
  });
  const abandonPrefixInvalid = () => {
    if (record2.summaryLifecycleId !== void 0) {
      emitSummaryLifecycleAbandoned(ctx, resumeSummaryLifecycle({
        ...record2,
        summaryLifecycleId: record2.summaryLifecycleId,
        summarizationModelId: record2.modelId
      }), "prefix_invalid");
    }
    return void 0;
  };
  if (record2.version !== 2) {
    pendingSummaryAdoption.increment(ctx, 1, {
      model: record2.modelId ?? "unknown",
      outcome: "rejected_version"
    });
    return void 0;
  }
  if (record2.messagesSummarizedCount > args.currentMessages.length) {
    pendingSummaryAdoption.increment(ctx, 1, {
      model: record2.modelId,
      outcome: "rejected_too_few_messages"
    });
    return abandonPrefixInvalid();
  }
  if (!args.stillWarrantsCompaction(record2)) {
    pendingSummaryAdoption.increment(ctx, 1, {
      model: record2.modelId,
      outcome: "rejected_threshold"
    });
    return void 0;
  }
  const prefixMessages = args.currentMessages.slice(0, record2.messagesSummarizedCount);
  const prefixHash = await hashMessagesPrefix(args.privacyMode, prefixMessages);
  if (prefixHash !== record2.prefixHashB64) {
    pendingSummaryAdoption.increment(ctx, 1, {
      model: record2.modelId,
      outcome: "rejected_prefix_mismatch"
    });
    logger59.info(ctx, "[summarization-adopt] Pending summary prefix mismatch; falling back to normal behavior", {
      messagesSummarizedCount: record2.messagesSummarizedCount,
      currentMessagesCount: args.currentMessages.length,
      stashAgeMs: Date.now() - record2.createdAtMs
    });
    return abandonPrefixInvalid();
  }
  const result = rehydrateSummarizationResult({
    privacyMode: args.privacyMode,
    record: record2,
    validatedPrefixMessages: prefixMessages
  });
  return { record: record2, result, prefixMessages };
}
