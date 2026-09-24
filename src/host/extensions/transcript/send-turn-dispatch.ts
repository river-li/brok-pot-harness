/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/send-turn-dispatch.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
async function dispatchUserTurn(args) {
  const {
    tm,
    session,
    trimmedPrompt,
    richText,
    composedAtMs,
    enterEpochMs,
    clientNonce,
    mcpConfigJson,
    senderMachineId,
    awaitTurn,
    isFork,
    userMessageId,
    interruptedMessageId,
    replyContext,
    selectedImages,
    selectedVideos,
    fileAttachmentPaths,
    attachedFileSizes,
    attachedFilesOnBox,
    traceCtx,
    acceptedAtMs,
    wasInFlight,
    readAddressedTranscript,
    latestRecoverySends,
    recoveryBreakEpochs,
    nextTurnEpoch,
    acceptance,
    ackGuard
  } = args;
  const runner = tm.runnerRegistry.getRunner(session);
  const hasTranscriptUserMessage = !isOffRecordMessageId(userMessageId);
  const recentUserMessages = hasTranscriptUserMessage ? readAddressedTranscript().filter(
    (entry) => entry.kind === "message" && entry.role === "user" && entry.fromAgent == null && entry.channel == null
  ).map((entry) => ({
    id: entry.id,
    text: entry.content,
    richText: entry.richText
  })) : void 0;
  const expandedPrompt = tm.skillCommands.withMentionedAgentsContext(
    session,
    trimmedPrompt,
    tm.skillCommands.expandSkillReferences(session, trimmedPrompt, richText)
  );
  const composeNote = composedAtMs == null ? "" : buildComposedOfflineNote(composedAtMs);
  const promptForRun = composeNote.length > 0 ? `${composeNote}
${expandedPrompt}` : expandedPrompt;
  const epoch = nextTurnEpoch(session);
  const carriesRecovery = hasTranscriptUserMessage && !isFork;
  if (hasTranscriptUserMessage && !isFork && recentUserMessages != null) {
    latestRecoverySends.set(session.id, {
      epoch,
      messageId: userMessageId,
      recentUserMessages
    });
  } else {
    recoveryBreakEpochs.set(session.id, epoch);
  }
  tm.runLifecycle.beginSessionRun(session);
  const hadActiveGroupMemberRun = tm.runnerRegistry.activeGroupMemberRunners.get(session.id)?.interrupt("superseded by a direct user message") ?? false;
  if (hadActiveGroupMemberRun) {
    tm.groupChat.dmPreemptedGroupMemberIds.add(session.id);
  }
  const hadActive1v1Run = runner.interrupt("superseded by a new user message", {
    carriesRecovery
  });
  if (hadActive1v1Run) {
    tm.backgroundWakes.dmPreemptedWakeAgentIds.add(session.id);
  }
  const hadActiveRun = hadActive1v1Run || hadActiveGroupMemberRun;
  tm.telemetry.reportTurnInterrupt({
    conversationId: session.id,
    reason: "superseded",
    hadActiveRun,
    wasInFlight
  });
  tm.ackObligations.confirmAckObligationAfterInterrupt(session, acceptedAtMs, hadActiveRun);
  const ackToken = tm.ackObligations.mintAckRunToken(session.id);
  const queueStartEpochMs = Date.now();
  const queueStartPerfMs = performance.now();
  const turnDone = tm.runLifecycle.enqueueExclusiveRun(
    session.id,
    () => tm.turnRuntime.runTurn(
      session,
      runner,
      promptForRun,
      {
        richText,
        selectedImages,
        selectedVideos,
        attachedFilePaths: fileAttachmentPaths,
        attachedFileSizes,
        attachedFilesOnBox,
        messageId: userMessageId,
        ...interruptedMessageId == null ? {} : { interruptedMessageId },
        recentUserMessages,
        replyContext,
        senderMachineId,
        isFork,
        traceCtx,
        enterEpochMs,
        queueStartEpochMs,
        queueStartPerfMs,
        clientNonce,
        ackToken,
        mcpConfigJson
      },
      epoch
    ),
    { lane: "user", source: "turn", acceptedAtMs, ackToken }
  );
  ackGuard.disarm();
  acceptance.markAcceptedAfterDispatch();
  if (awaitTurn) {
    await turnDone;
    return;
  }
  turnDone.catch((error42) => {
    tm.hostLog(`[sand] detached turn failed after send acceptance: ${errorLogTag(error42)}`, "error");
  });
}

