/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/turn-settle.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function resolveTranscriptPersistence(privacyMode) {
  switch (privacyMode) {
    case PrivacyMode.NO_TRAINING:
    case PrivacyMode.USAGE_DATA_TRAINING_ALLOWED:
    case PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED:
      return "enabled";
    case PrivacyMode.NO_STORAGE:
    case PrivacyMode.UNSPECIFIED:
    default:
      return "disabled";
  }
}
var TranscriptAppendAfterCheckpointError = class extends Error {
  isTranscriptAppendAfterCheckpointError = true;
  constructor(cause) {
    super(
      `conversation checkpoint persisted but transcript append failed: ${cause instanceof Error ? cause.message : String(cause)}`,
      { cause }
    );
    this.name = "TranscriptAppendAfterCheckpointError";
  }
};
function createTurnSettle(host, scope) {
  let text2 = "";
  let finalAssistantText = "";
  let sentMessageCount = 0;
  let reacted = false;
  let endedOnSilentToolCalls = false;
  let followupLabelingMessages;
  const agentMessages = [];
  const collectors = {
    collectText: (delta) => {
      text2 += delta;
    },
    collectSendMessage: () => {
      sentMessageCount++;
    },
    collectReaction: () => {
      reacted = true;
    },
    collectAgentMessage: (message) => {
      agentMessages.push(message);
    }
  };
  let profilePromptSnapshot;
  let pendingProfileAnnouncement;
  const setProfileSnapshot = (snapshot) => {
    profilePromptSnapshot = snapshot;
  };
  const noteProfileUpdateAppended = (identity) => {
    pendingProfileAnnouncement = identity;
  };
  const persistPendingProfileAnnouncement = () => {
    if (profilePromptSnapshot == null || pendingProfileAnnouncement == null) {
      return;
    }
    host.persistAnnouncedAgentProfile(
      scope.profilePromptSnapshots,
      profilePromptSnapshot,
      pendingProfileAnnouncement
    );
    pendingProfileAnnouncement = void 0;
  };
  let observedSummaryArchiveCount = 0;
  let transcriptPersistence = "unknown";
  let tokenDetailsPersistenceState = { kind: "fresh" };
  const noteBaseState = (baseState, privacyMode) => {
    observedSummaryArchiveCount = baseState.summaryArchives.length;
    const resolved = resolveTranscriptPersistence(privacyMode);
    transcriptPersistence = resolved;
    return resolved;
  };
  const prepareCheckpointForPersistence = (checkpoint) => {
    const summaryArchiveCount = checkpoint.summaryArchives.length;
    const tokenDetails = checkpoint.tokenDetails;
    if (summaryArchiveCount > observedSummaryArchiveCount) {
      observedSummaryArchiveCount = summaryArchiveCount;
      tokenDetailsPersistenceState = {
        kind: "stale",
        usedTokens: tokenDetails?.usedTokens,
        maxTokens: tokenDetails?.maxTokens
      };
    } else if (tokenDetailsPersistenceState.kind === "stale" && (tokenDetails?.usedTokens !== tokenDetailsPersistenceState.usedTokens || tokenDetails?.maxTokens !== tokenDetailsPersistenceState.maxTokens)) {
      tokenDetailsPersistenceState = { kind: "fresh" };
    }
    if (tokenDetailsPersistenceState.kind === "stale") {
      checkpoint.tokenDetails = void 0;
    }
  };
  const persistCheckpoint = async (ctx, checkpoint, finalizeCheckpoint) => {
    const preparedTranscriptMirror = transcriptPersistence === "enabled" ? host.transcriptMirror : void 0;
    if (preparedTranscriptMirror != null) {
      await preparedTranscriptMirror.prepareCheckpoint(
        ctx,
        host.getTranscriptId(),
        checkpoint,
        host.getBlobStore(),
        finalizeCheckpoint,
        finalizeCheckpoint || host.isSubagentRunner
      );
    }
    const store = host.agentStore();
    const completedTurnId = checkpoint.pendingToolCalls.length === 0 ? host.getCompletedTurnId?.() : void 0;
    try {
      if (store != null) {
        await store.handleCheckpoint(ctx, checkpoint, {
          awaitingUserInputTurnId: checkpoint.pendingToolCalls.length === 0 ? host.getAwaitingUserInputTurnId() : void 0,
          ...completedTurnId === void 0 ? {} : { completedTurnId }
        });
      } else {
        host.setLocalState(checkpoint);
      }
    } catch (error3) {
      if (preparedTranscriptMirror != null) {
        await Promise.allSettled([
          preparedTranscriptMirror.abortCheckpoint(ctx, host.getTranscriptId())
        ]);
      }
      throw error3;
    }
    if (preparedTranscriptMirror != null) {
      try {
        await preparedTranscriptMirror.commitCheckpoint(
          ctx,
          host.getTranscriptId(),
          store?.getMetadata("latestRootBlobId")
        );
      } catch (error3) {
        throw new TranscriptAppendAfterCheckpointError(error3);
      }
    } else if (transcriptPersistence === "disabled") {
      await host.transcriptMirror?.skipCheckpoint(
        ctx,
        host.getTranscriptId(),
        checkpoint,
        host.getBlobStore()
      );
    }
  };
  const persistStepCheckpoint = async (ctx, checkpoint) => {
    await persistCheckpoint(ctx, checkpoint, false);
    if (host.ownsRunner()) {
      persistPendingProfileAnnouncement();
    }
  };
  const captureFollowupLabelingMessages = (messages) => {
    followupLabelingMessages ??= messages;
  };
  const labelingIdentity = (args) => {
    const requestId = args.baseCtx.get(requestIdKey);
    if (requestId == null || requestId === "") {
      return;
    }
    return {
      conversationId: scope.conversationId,
      requestId,
      modelName: args.session.getModelId()
    };
  };
  const prepareFollowupLabeling = (identity, messages) => {
    if (messages.length === 0) {
      return;
    }
    return { ...identity, turnSeq: scope.turnSeq, messages };
  };
  const recordFollowupLabeling = (labeling) => {
    if (labeling == null) {
      return;
    }
    try {
      host.recordFollowupLabeling?.(labeling);
    } catch (error3) {
      reportHostDiagnostic({
        kind: "labeling_failed",
        stage: "followup_record",
        errorClass: errorLogTag(error3)
      });
    }
  };
  const recordPostTurnLabeling = (args) => {
    if (args.skipLabeling) {
      return;
    }
    const identity = labelingIdentity(args);
    if (identity == null || args.messages.length === 0) {
      return;
    }
    try {
      host.recordPostTurnLabeling?.({ ...identity, messages: args.messages });
    } catch (error3) {
      reportHostDiagnostic({
        kind: "labeling_failed",
        stage: "post_turn_record",
        errorClass: errorLogTag(error3)
      });
    }
  };
  const prepareFinalizedFollowupLabeling = (args, options2) => {
    const delivered = sentMessageCount > 0 || reacted;
    const advanceChainOnly = args.skipLabeling && args.advanceChainOnDelivery === true;
    if (args.skipLabeling && !advanceChainOnly) {
      return;
    }
    const supersededByUser = options2?.supersededByUser ?? host.wasSupersededByUser();
    if (!delivered && (supersededByUser || advanceChainOnly)) {
      return;
    }
    const identity = labelingIdentity(args);
    if (identity == null) {
      return;
    }
    return prepareFollowupLabeling(
      advanceChainOnly ? { ...identity, advanceChainOnly } : identity,
      followupLabelingMessages ?? host.latestPromptMessages()
    );
  };
  const recordFinalizedFollowupLabeling = (args) => {
    recordFollowupLabeling(prepareFinalizedFollowupLabeling(args));
  };
  const settleCompletedTurn = async (args) => {
    const turnEndedAtMs = Date.now();
    const messages = host.latestPromptMessages();
    finalAssistantText = lastAssistantText(messages);
    args.finalState.turnTimings.push(
      new StepTiming({
        timestampMs: BigInt(turnEndedAtMs),
        durationMs: BigInt(Math.max(0, turnEndedAtMs - args.turnStartedAtMs))
      })
    );
    if (!host.isSubagentRunner && !args.hidden) {
      endedOnSilentToolCalls = turnEndedOnSilentToolCalls(messages);
    }
    recordPostTurnLabeling({
      session: args.session,
      baseCtx: args.baseCtx,
      messages,
      skipLabeling: args.skipLabeling
    });
    if (!host.isRunSuperseded() && scope.memoryStore != null && !args.hidden && args.trimmedPrompt.length > 0 && (scope.memoryStore.recordMemoryEvidence != null || isMemorableExchange(args.trimmedPrompt))) {
      const exchange = {
        user: args.trimmedPrompt,
        agent: [...agentMessages, text2].filter((part) => part.trim().length > 0).join("\n")
      };
      await runTurnMemory(
        scope.memoryStore,
        scope.episodeProgress,
        args.session,
        args.baseCtx,
        args.turnStartedAtMs,
        exchange
      );
    }
  };
  const persistFinalState = async (baseCtx, finalState) => {
    prepareCheckpointForPersistence(finalState);
    await persistCheckpoint(baseCtx, finalState, true);
    persistPendingProfileAnnouncement();
  };
  const buildResult = (flags) => ({
    text: text2,
    ...host.isSubagentRunner ? { finalAssistantText } : {},
    sentMessageCount,
    reacted,
    aborted: flags.aborted,
    ...flags.pausedForUpgrade ? { pausedForUpgrade: true } : {},
    ...flags.awaitingUserSelection ? { awaitingUserSelection: true } : {},
    ...endedOnSilentToolCalls ? { endedOnSilentToolCalls: true } : {},
    ...flags.streamOutputProduced ? { streamOutputProduced: true } : {}
  });
  return {
    collectors,
    setProfileSnapshot,
    noteProfileUpdateAppended,
    noteBaseState,
    prepareCheckpointForPersistence,
    persistStepCheckpoint,
    captureFollowupLabelingMessages,
    prepareFinalizedFollowupLabeling,
    recordFinalizedFollowupLabeling,
    settleCompletedTurn,
    persistFinalState,
    buildResult
  };
}

