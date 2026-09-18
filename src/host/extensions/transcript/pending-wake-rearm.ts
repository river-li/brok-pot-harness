init_dist2();
init_errors();
var PENDING_WAKE_STALE_MAX_AGE_MS = 48 * 60 * 60 * 1e3;
var PendingWakeRearm = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  persistPendingWake(event) {
    const store = this.tm.pendingWakeStore;
    if (store == null) return false;
    if (this.tm.sessions.deletedAgentIds.has(event.parentAgentId)) return false;
    const written = attemptSync(
      () => store.markPending({
        agentId: event.parentAgentId,
        kind: event.kind,
        workId: event.workId,
        markedAtMs: Date.now(),
        ...event.quietOrigin != null ? { quietOrigin: event.quietOrigin } : {},
        title: event.title,
        ...event.labelKind != null && event.labelParams != null ? { labelKind: event.labelKind, labelParams: event.labelParams } : {},
        ...event.subagentType != null ? { subagentType: event.subagentType } : {},
        ...event.automationRunUuid != null ? { automationRunUuid: event.automationRunUuid } : {},
        ...event.hiddenCard === true ? { hiddenCard: true } : {}
      })
    );
    this.tm.telemetry.reportPendingWake({
      conversationId: event.parentAgentId,
      outcome: written.ok ? "persisted" : "persist_failed",
      kind: event.kind,
      workId: event.workId,
      ...written.ok ? {} : { reason: errorLogTag(written.error) },
      isQuietOrigin: event.quietOrigin != null
    });
    return written.ok;
  }
  clearSettledPendingWake(settled) {
    const store = this.tm.pendingWakeStore;
    if (store == null) return;
    if (!store.clearOne(settled.agentId, settled.kind, settled.workId)) return;
    this.tm.telemetry.reportPendingWake({
      conversationId: settled.agentId,
      outcome: "settled",
      kind: settled.kind,
      workId: settled.workId
    });
    this.tm.roster.emitAsyncTasksForAgent(settled.agentId);
  }
  disarmPendingWake(event) {
    const store = this.tm.pendingWakeStore;
    if (store == null) return;
    if (!store.clearOne(event.parentAgentId, event.kind, event.workId)) return;
    this.tm.telemetry.reportPendingWake({
      conversationId: event.parentAgentId,
      outcome: "settled",
      kind: event.kind,
      workId: event.workId,
      reason: "aborted"
    });
    this.tm.roster.emitAsyncTasksForAgent(event.parentAgentId);
  }
  async rearmPendingWakes() {
    const store = this.tm.pendingWakeStore;
    if (store == null) return true;
    if (!this.tm.execution.canExecute) return false;
    const now = Date.now();
    for (const marker17 of store.pruneStale(PENDING_WAKE_STALE_MAX_AGE_MS, now)) {
      this.tm.telemetry.reportPendingWake({
        conversationId: marker17.agentId,
        outcome: "pruned",
        kind: marker17.kind,
        workId: marker17.workId,
        ageMs: now - marker17.markedAtMs,
        reason: "stale",
        isQuietOrigin: marker17.quietOrigin != null
      });
    }
    const pending = store.listPending();
    const results = await Promise.all(
      pending.map(async (marker17) => {
        if (this.tm.sessions.isAgentGone(marker17.agentId)) {
          if (!this.retainDuringRecovery(marker17)) {
            store.clearOne(marker17.agentId, marker17.kind, marker17.workId);
          }
          this.tm.telemetry.reportPendingWake({
            conversationId: marker17.agentId,
            outcome: "rearm_skipped",
            kind: marker17.kind,
            workId: marker17.workId,
            ageMs: now - marker17.markedAtMs,
            reason: "agent_gone",
            isQuietOrigin: marker17.quietOrigin != null
          });
          return true;
        }
        return await this.rearmPendingWake(marker17, now);
      })
    );
    return results.every(Boolean);
  }
  async rearmPendingWake(marker17, nowMs2, options2) {
    let succeeded = true;
    const report = (outcome, reason) => {
      if (outcome === "rearm_failed") {
        succeeded = false;
        void attemptSync(() => this.tm.pendingWakeStore?.markPending(marker17));
      }
      const effectiveReason = reason ?? (outcome === "rearmed" ? options2?.successReason : void 0);
      this.tm.telemetry.reportPendingWake({
        conversationId: marker17.agentId,
        outcome,
        kind: marker17.kind,
        workId: marker17.workId,
        ageMs: nowMs2 - marker17.markedAtMs,
        ...effectiveReason != null ? { reason: effectiveReason } : {},
        isQuietOrigin: marker17.quietOrigin != null
      });
    };
    if (readSandProfileHarness(
      getSandProfilePath(this.tm.sessionStore.getAgentDir(marker17.agentId))
    ) === "temporal") {
      this.tm.pendingWakeStore?.clearOne(marker17.agentId, marker17.kind, marker17.workId);
      report("rearm_skipped", "temporal_owner");
      return true;
    }
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(marker17.agentId);
    } catch {
      report("rearm_failed", "session_unavailable");
      return false;
    }
    if (this.tm.groupChat.isGroupSession(session)) {
      if (!(marker17.kind === "subagent" && marker17.automationRunUuid != null)) {
        this.tm.pendingWakeStore?.clearOne(marker17.agentId, marker17.kind, marker17.workId);
      }
      report("rearm_skipped", "group_session");
      return true;
    }
    try {
      switch (marker17.kind) {
        case "cloud-agent":
          this.rearmCloudAgentWake(session, marker17, report);
          return succeeded;
        case "shell":
          if (marker17.interruptedByRecreate === true) {
            this.tm.upgradeResume.deliverRecreateInterruptedShellNotice(marker17, report);
            return succeeded;
          }
          this.rearmShellWake(session, marker17, report);
          return succeeded;
        case "subagent":
          await this.reviveParentForLostSubagentWake(marker17, report);
          return succeeded;
        default: {
          const _exhaustive = marker17.kind;
          report("rearm_skipped", "unsupported_kind");
          return _exhaustive;
        }
      }
    } catch {
      report("rearm_failed", "error");
      return false;
    }
  }
  retainDuringRecovery(marker17) {
    return marker17.kind === "shell" && marker17.interruptedByRecreate === true || marker17.kind === "subagent" && marker17.automationRunUuid != null;
  }
  rearmCloudAgentWake(session, marker17, report) {
    const runner = this.tm.runnerRegistry.getRunner(session);
    const hiddenCard = marker17.hiddenCard === true ? { hiddenCard: true } : {};
    if (runner.getPendingCloudAgentWatchBcIds().includes(marker17.workId)) {
      this.persistPendingWake({
        parentAgentId: marker17.agentId,
        kind: "cloud-agent",
        workId: marker17.workId,
        title: marker17.title ?? `Cloud agent ${marker17.workId}`,
        ...marker17.labelKind != null && marker17.labelParams != null ? { labelKind: marker17.labelKind, labelParams: marker17.labelParams } : {},
        ...marker17.quietOrigin != null ? { quietOrigin: marker17.quietOrigin } : {},
        ...hiddenCard
      });
      report("rearmed");
      return;
    }
    runner.watchCloudAgent(marker17.workId, {
      afterFollowup: false,
      ...marker17.quietOrigin != null ? { quietOrigin: marker17.quietOrigin } : {},
      ...hiddenCard
    });
    if (runner.getPendingCloudAgentWatchBcIds().includes(marker17.workId)) {
      report("rearmed");
    } else {
      report("rearm_failed", "watch_not_armed");
    }
  }
  rearmShellWake(session, marker17, report) {
    const runner = this.tm.runnerRegistry.getRunner(session);
    runner.watchBackgroundShell(marker17.workId, {
      ...marker17.title != null ? { title: marker17.title } : {},
      ...marker17.labelKind != null && marker17.labelParams != null ? { labelKind: marker17.labelKind, labelParams: marker17.labelParams } : {},
      ...marker17.quietOrigin != null ? { quietOrigin: marker17.quietOrigin } : {}
    });
    report("rearmed");
  }
  async reviveParentForLostSubagentWake(marker17, report) {
    this.persistPendingWake({
      parentAgentId: marker17.agentId,
      kind: "subagent",
      workId: marker17.workId,
      title: marker17.title ?? "Background task",
      ...marker17.labelKind != null && marker17.labelParams != null ? { labelKind: marker17.labelKind, labelParams: marker17.labelParams } : {},
      ...marker17.subagentType != null ? { subagentType: marker17.subagentType } : {},
      ...marker17.automationRunUuid != null ? { automationRunUuid: marker17.automationRunUuid } : {},
      ...marker17.quietOrigin != null ? { quietOrigin: marker17.quietOrigin } : {}
    });
    report("rearmed", "interrupted_completion");
    if (marker17.automationRunUuid != null && this.tm.automationRunCompletionReporter !== void 0) {
      await this.tm.automationRunCompletionReporter({
        runUuid: marker17.automationRunUuid,
        status: "failed",
        errorMessage: "Automation subagent was interrupted by a Sand host restart."
      });
    }
    await this.tm.backgroundWakes.handleBackgroundSubagentCompletion({
      parentAgentId: marker17.agentId,
      subagentAgentId: marker17.workId,
      subagentType: marker17.subagentType ?? "task",
      toolCallId: "",
      title: marker17.title ?? "Background task",
      status: "error",
      result: "A host restart interrupted this background task before its result could be delivered; its in-process run did not survive, so its final state is unknown. Check its transcript (Await with this task id) if you need what it got through, and dispatch a fresh background task if the work still matters.",
      ...marker17.automationRunUuid != null ? { automationRunUuid: marker17.automationRunUuid } : {},
      ...marker17.quietOrigin != null ? { quietOrigin: marker17.quietOrigin } : {}
    });
  }
  enqueuePendingWake(queue, agentId, items) {
    if (this.tm.sessions.isAgentGone(agentId)) return false;
    const queued = queue.get(agentId) ?? [];
    queued.push(...items);
    queue.set(agentId, queued);
    return true;
  }
};
