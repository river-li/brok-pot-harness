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
    } catch (error41) {
      if (preparedTranscriptMirror != null) {
        await Promise.allSettled([
          preparedTranscriptMirror.abortCheckpoint(ctx, host.getTranscriptId())
        ]);
      }
      throw error41;
    }
    if (preparedTranscriptMirror != null) {
      try {
        await preparedTranscriptMirror.commitCheckpoint(
          ctx,
          host.getTranscriptId(),
          store?.getMetadata("latestRootBlobId")
        );
      } catch (error41) {
        throw new TranscriptAppendAfterCheckpointError(error41);
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
  const captureFollowupLabelingMessages = (messages2) => {
    followupLabelingMessages ??= messages2;
  };
  const labelingIdentity = (args) => {
    const requestId2 = args.baseCtx.get(requestIdKey);
    if (requestId2 == null || requestId2 === "") {
      return;
    }
    return {
      conversationId: scope.conversationId,
      requestId: requestId2,
      modelName: args.session.getModelId()
    };
  };
  const prepareFollowupLabeling = (identity, messages2) => {
    if (messages2.length === 0) {
      return;
    }
    return { ...identity, turnSeq: scope.turnSeq, messages: messages2 };
  };
  const recordFollowupLabeling = (labeling) => {
    if (labeling == null) {
      return;
    }
    try {
      host.recordFollowupLabeling?.(labeling);
    } catch (error41) {
      reportHostDiagnostic({
        kind: "labeling_failed",
        stage: "followup_record",
        errorClass: errorLogTag(error41)
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
    } catch (error41) {
      reportHostDiagnostic({
        kind: "labeling_failed",
        stage: "post_turn_record",
        errorClass: errorLogTag(error41)
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
    const messages2 = host.latestPromptMessages();
    finalAssistantText = lastAssistantText(messages2);
    args.finalState.turnTimings.push(
      new StepTiming({
        timestampMs: BigInt(turnEndedAtMs),
        durationMs: BigInt(Math.max(0, turnEndedAtMs - args.turnStartedAtMs))
      })
    );
    if (!host.isSubagentRunner && !args.hidden) {
      endedOnSilentToolCalls = turnEndedOnSilentToolCalls(messages2);
    }
    recordPostTurnLabeling({
      session: args.session,
      baseCtx: args.baseCtx,
      messages: messages2,
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
