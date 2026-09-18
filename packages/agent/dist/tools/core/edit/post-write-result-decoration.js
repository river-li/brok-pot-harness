var logger79 = createLogger("@anysphere/agent");
var eagerStoreConflictBarrier = createCounter("agent.store.eager_barrier", {
  description: "Eager same-result agent-store conflict barrier outcomes."
});
function recordEagerBarrierOutcome(ctx, outcome) {
  try {
    eagerStoreConflictBarrier.increment(ctx, 1, { outcome });
  } catch (error41) {
    logger79.warn(ctx, "Eager store conflict barrier telemetry failed", {
      error: error41
    });
  }
}
var DEFAULT_WRITE_BARRIER_TIMEOUT_MS2 = 2e3;
async function decoratePostWriteResultForModel(ctx, resourceAccessor, path31, resultForModel, toolCallId, options2) {
  const withCanvas = await decorateWithCanvasDiagnostics(ctx, resourceAccessor, path31, resultForModel, toolCallId);
  if (options2?.enableAgentStoreConflictNotices !== true) {
    return withCanvas;
  }
  return await decorateWithEagerStoreConflict({
    ctx,
    resourceAccessor,
    path: path31,
    resultForModel: withCanvas,
    writeBarrierTimeoutMs: options2.writeBarrierTimeoutMs,
    forceGraceTimeoutMs: options2.forceGraceTimeoutMs,
    onWriteBarrier: options2.onWriteBarrier
  });
}
async function decorateWithCanvasDiagnostics(ctx, resourceAccessor, path31, resultForModel, toolCallId) {
  if (!isManagedCanvasPath(path31)) {
    return resultForModel;
  }
  let executor;
  try {
    executor = resourceAccessor.get(canvasDiagnosticsExecutorResource);
  } catch {
    return resultForModel;
  }
  if (executor === void 0) {
    return resultForModel;
  }
  const diagText = await runCanvasPostEditDiagnostics(ctx, executor, path31, CANVAS_POST_EDIT_DIAGNOSTICS_TIMEOUT_MS(ctx), toolCallId);
  if (diagText === void 0) {
    return resultForModel;
  }
  return `${resultForModel}

${diagText}`;
}
async function decorateWithEagerStoreConflict(args) {
  const { ctx, resourceAccessor, path: path31, resultForModel } = args;
  const deadlineMs = args.writeBarrierTimeoutMs ?? DEFAULT_WRITE_BARRIER_TIMEOUT_MS2;
  const graceMs = Math.max(0, args.forceGraceTimeoutMs ?? deadlineMs);
  const outerDeadlineMs = deadlineMs > 0 ? deadlineMs + graceMs : 0;
  const barrierStartedAt = performance.now();
  let barrierOutcomeReported = false;
  const reportWriteBarrier = (outcome) => {
    if (barrierOutcomeReported) {
      return;
    }
    barrierOutcomeReported = true;
    try {
      args.onWriteBarrier?.({
        durationMs: performance.now() - barrierStartedAt,
        outcome
      });
    } catch {
    }
  };
  let executor;
  try {
    executor = resourceAccessor.get(agentStoreConflictNoticeExecutorResource);
  } catch {
    executor = void 0;
  }
  if (executor === void 0) {
    return resultForModel;
  }
  const deadline = { expired: false };
  let raceOutcome;
  const claimRace = (winner) => {
    if (raceOutcome !== void 0) {
      return false;
    }
    raceOutcome = winner;
    return true;
  };
  const isAbortSignalAborted = () => ctx.signal?.aborted === true || deadline.expired;
  const conversationId = getConversationId(ctx);
  const conflictNoticeArgs = conversationId !== void 0 ? { conversationId } : void 0;
  const noteDeferredForAbortRescue = async () => {
    try {
      await conflictNoticeNoteDeferredEagerWrittenPaths(executor, ctx, [path31], conflictNoticeArgs);
    } catch (error41) {
      logger79.warn(ctx, "Eager store conflict deferred-path note failed", {
        error: error41
      });
    }
  };
  if (isAbortSignalAborted()) {
    await noteDeferredForAbortRescue();
    return resultForModel;
  }
  const releaseEagerEvents = async (eventIds) => {
    if (eventIds.length === 0) {
      return;
    }
    try {
      await conflictNoticeRelease(executor, ctx, eventIds, conflictNoticeArgs);
    } catch (error41) {
      logger79.warn(ctx, "Eager store conflict release failed", { error: error41 });
    }
  };
  const ackIfStillLive = async (eventIds) => {
    if (isAbortSignalAborted() || !claimRace("eager")) {
      await releaseEagerEvents(eventIds);
      await noteDeferredForAbortRescue();
      return "aborted";
    }
    try {
      await conflictNoticeAck(executor, ctx, eventIds, conflictNoticeArgs);
      return "acked";
    } catch (error41) {
      logger79.warn(ctx, "Eager store conflict ack failed", { error: error41 });
      await releaseEagerEvents(eventIds);
      return "ack-failed";
    }
  };
  const fallbackJournalDrain = async (priorOutcome) => {
    const recordPrior = () => {
      recordEagerBarrierOutcome(ctx, priorOutcome);
    };
    if (isAbortSignalAborted()) {
      await noteDeferredForAbortRescue();
      recordPrior();
      return resultForModel;
    }
    let peeked;
    try {
      peeked = await conflictNoticePeek(executor, ctx, {
        ...conversationId !== void 0 ? { conversationId } : {}
      });
    } catch (error41) {
      logger79.warn(ctx, "Eager store conflict journal-drain fallback failed", {
        error: error41
      });
      recordPrior();
      return resultForModel;
    }
    if (peeked.kind !== "completed" && peeked.kind !== "timed-out") {
      recordPrior();
      return resultForModel;
    }
    const fallbackReminder = peeked.reminder;
    const fallbackEventIds = peeked.events.map((event) => event.eventId);
    if (fallbackReminder === void 0 || fallbackReminder.length === 0) {
      await releaseEagerEvents(fallbackEventIds);
      recordPrior();
      return resultForModel;
    }
    if (fallbackEventIds.length === 0) {
      recordPrior();
      return resultForModel;
    }
    if (isAbortSignalAborted()) {
      await releaseEagerEvents(fallbackEventIds);
      await noteDeferredForAbortRescue();
      recordPrior();
      return resultForModel;
    }
    const decorated = `${resultForModel}

${fallbackReminder}`;
    if (await ackIfStillLive(fallbackEventIds) === "aborted") {
      recordPrior();
      return resultForModel;
    }
    recordEagerBarrierOutcome(ctx, "journal_fallback");
    return decorated;
  };
  if (!(deadlineMs > 0)) {
    reportWriteBarrier("skipped");
    return await fallbackJournalDrain("degraded");
  }
  const runEager = async () => {
    try {
      const result = await conflictNoticeSyncAndPeek(executor, ctx, {
        writtenPaths: [path31],
        eager: true,
        timeoutMs: deadlineMs,
        ...conversationId !== void 0 ? { conversationId } : {}
      });
      switch (result.kind) {
        case "not-applicable":
          reportWriteBarrier("absent");
          return await fallbackJournalDrain("degraded");
        case "mount-passive":
          reportWriteBarrier("passive");
          return await fallbackJournalDrain("degraded");
        case "timed-out": {
          const timedOutReminder = result.reminder;
          if (timedOutReminder === void 0 || timedOutReminder.length === 0 || result.events.length === 0) {
            reportWriteBarrier("timeout");
            return await fallbackJournalDrain("timed_out");
          }
          const timedOutEventIds = result.events.map((event) => event.eventId);
          if (isAbortSignalAborted()) {
            await releaseEagerEvents(timedOutEventIds);
            await noteDeferredForAbortRescue();
            reportWriteBarrier("timeout");
            return resultForModel;
          }
          const decoratedTimedOut = `${resultForModel}

${timedOutReminder}`;
          if (await ackIfStillLive(timedOutEventIds) === "aborted") {
            reportWriteBarrier("timeout");
            return resultForModel;
          }
          recordEagerBarrierOutcome(ctx, "attributed_timed_out");
          reportWriteBarrier("timeout");
          return decoratedTimedOut;
        }
        case "failed":
          reportWriteBarrier("error");
          return await fallbackJournalDrain("error");
        case "completed":
          break;
        default: {
          const _exhaustive = result;
          void _exhaustive;
          return resultForModel;
        }
      }
      const reminder = result.reminder;
      const eventIds = result.events.map((event) => event.eventId);
      if (isAbortSignalAborted()) {
        await releaseEagerEvents(eventIds);
        await noteDeferredForAbortRescue();
        reportWriteBarrier(deadline.expired ? "timeout" : "synced");
        return resultForModel;
      }
      if (reminder === void 0 || reminder.length === 0) {
        reportWriteBarrier("synced");
        return await fallbackJournalDrain("clean");
      }
      const decorated = `${resultForModel}

${reminder}`;
      if (await ackIfStillLive(eventIds) === "aborted") {
        reportWriteBarrier(deadline.expired ? "timeout" : "synced");
        return resultForModel;
      }
      recordEagerBarrierOutcome(ctx, "attributed");
      try {
        logger79.info(ctx, "Local-sync eager conflict barrier attributed", {
          eventCount: eventIds.length
        });
      } catch {
      }
      reportWriteBarrier("synced");
      return decorated;
    } catch (error41) {
      logger79.warn(ctx, "Eager store conflict barrier failed", { error: error41 });
      reportWriteBarrier("error");
      return await fallbackJournalDrain("error");
    }
  };
  return await Promise.race([
    runEager().finally(() => {
      if (raceOutcome === void 0) {
        raceOutcome = "eager";
      }
    }),
    delay2(outerDeadlineMs).then(async () => {
      if (!claimRace("timeout")) {
        return await new Promise(() => {
        });
      }
      deadline.expired = true;
      await noteDeferredForAbortRescue();
      reportWriteBarrier("timeout");
      return resultForModel;
    })
  ]);
}
