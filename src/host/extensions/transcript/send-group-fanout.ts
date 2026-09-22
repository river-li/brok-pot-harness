init_errors();
async function dispatchGroupSend(tm, args) {
  const {
    session,
    trimmedPrompt,
    attachments,
    userMessageId,
    awaitTurn,
    acceptedAtMs,
    traceCtx,
    nextTurnEpoch,
    acceptance
  } = args;
  if (tm.groupChat.isGroupSession(session)) {
    const epoch = nextTurnEpoch(session);
    tm.runLifecycle.beginSessionRun(session, {
      initiationMessageId: userMessageId,
      initiatedAtMs: acceptedAtMs
    });
    const groupTurnDone = tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      () => tm.groupChat.runGroupTurn(session, epoch, {
        lane: "user",
        attachments,
        isAttachmentOnlyTurn: trimmedPrompt.length === 0 && (attachments.selectedImages.length > 0 || attachments.selectedVideos.length > 0 || attachments.filePaths.length > 0),
        ...traceCtx == null ? {} : { traceCtx }
      }),
      { lane: "user", source: "group", acceptedAtMs }
    );
    acceptance.markAcceptedAfterDispatch();
    if (awaitTurn) {
      await groupTurnDone;
    } else {
      groupTurnDone.catch((error42) => {
        tm.hostLog(
          `[sand] detached group turn failed after send acceptance: ${errorLogTag(error42)}`,
          "error"
        );
      });
    }
    return true;
  }
  return false;
}
