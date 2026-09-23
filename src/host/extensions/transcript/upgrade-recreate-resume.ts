init_dist3();
init_errors();
var FORCED_UPGRADE_PAUSE_MAX_MS = 10 * 6e4;
var FORCED_UPGRADE_RETRY_COOLDOWN_MS = 30 * 6e4;
var FORCED_UPGRADE_POLL_STALE_MS = 5 * 6e4;
function buildUpgradeResumePrompt(source) {
  const tail = "You've been resumed with your full conversation intact. Continue exactly where you left off and finish what you were doing. If your previous step already completed an action, do NOT repeat it \u2014 just carry on from there. Remember: nothing reaches the user unless it's inside a SendMessage.";
  if (source === "automation") {
    return `[A background system update restarted your environment and interrupted a scheduled routine run mid-task. ${tail} This is still that routine's own run \u2014 nobody is waiting on it, so if its saved instruction says to stay quiet when there's nothing to report, ending with no SendMessage remains a valid outcome.]`;
  }
  if (source === "background-revival") {
    return `[A background system update restarted your environment and interrupted one of your background-work follow-ups mid-delivery. ${tail} This follow-up was your own background wake \u2014 nobody is waiting on a reply, so if the results above your interruption point carry nothing genuinely new for the user, ending with no SendMessage remains a valid outcome.]`;
  }
  return `[A background system update restarted your environment and interrupted you mid-task. ${tail}]`;
}
function isSameResumeMarker(left, right) {
  return left.agentId === right.agentId && left.markedAtMs === right.markedAtMs && left.source === right.source && left.automationId === right.automationId && left.automationRunId === right.automationRunId && left.spendRequestId === right.spendRequestId;
}
var UpgradeRecreateResume = class {
  constructor(tm, recreateWakeCarryDisabled) {
    this.tm = tm;
    this.recreateWakeCarryDisabled = recreateWakeCarryDisabled;
  }
  tm;
  recreateWakeCarryDisabled;
  pauseState = null;
  upgradeRetryNotBeforeMs = 0;
  pauseResumeInFlightAgentIds = /* @__PURE__ */ new Set();
  resumeOwnershipConfirmed = true;
  upgradePauseOwnershipConfirmed = false;
  requestResumeOwnershipRecovery = () => {
  };
  resumeOwnershipRecoveryRequested = false;
  get pausingForUpgrade() {
    return this.pauseState !== null;
  }
  async pauseTurnsForUpgrade() {
    const now = this.tm.clock.now();
    const runningTurns = this.runningTurnsForUpgrade();
    if (this.pauseState?.owner === "recreate") {
      return { quiescing: false, runningTurns: refuseSwapRunningTurns(runningTurns) };
    }
    if (this.pauseState === null && runningTurns > 0 && now < this.upgradeRetryNotBeforeMs) {
      return { quiescing: false, runningTurns };
    }
    if (this.pauseState === null) {
      this.upgradePauseOwnershipConfirmed = false;
      this.pauseState = {
        owner: "upgrade",
        startedAtMs: now,
        lastPollAtMs: now
      };
    } else {
      this.pauseState.lastPollAtMs = now;
    }
    this.signalTurnsForPause();
    return {
      quiescing: true,
      runningTurns
    };
  }
  isPausingForUpgrade() {
    return this.pausingForUpgrade;
  }
  isForcedUpgradePauseActive() {
    return this.pauseState?.owner === "upgrade";
  }
  invalidateResumeOwnership() {
    this.resumeOwnershipConfirmed = false;
  }
  setResumeOwnershipRecoveryRequester(request5) {
    this.requestResumeOwnershipRecovery = request5;
  }
  requestOwnershipRecovery() {
    if (this.resumeOwnershipRecoveryRequested) return;
    this.resumeOwnershipRecoveryRequested = true;
    this.requestResumeOwnershipRecovery();
  }
  cancelForcedUpgradePause() {
    if (this.pauseState?.owner !== "upgrade") return false;
    const pendingMarkers = this.tm.upgradeResumeStore?.listPending().length ?? 0;
    const runningTurns = this.runningTurnsForUpgrade();
    if (!this.upgradePauseOwnershipConfirmed && (pendingMarkers > 0 || runningTurns > 0)) {
      this.resumeOwnershipConfirmed = false;
      this.requestOwnershipRecovery();
    }
    this.liftPause([], void 0);
    this.upgradePauseOwnershipConfirmed = false;
    return true;
  }
  abandonOverBudgetUpgradePause(options2) {
    const state = this.pauseState;
    if (state?.owner !== "upgrade") return null;
    const now = this.tm.clock.now();
    if (now - state.startedAtMs < FORCED_UPGRADE_PAUSE_MAX_MS) return null;
    const runningTurns = this.runningTurnsForUpgrade();
    if (runningTurns === 0 && (!options2.allowIdleAfterStalePoll || now - state.lastPollAtMs < FORCED_UPGRADE_POLL_STALE_MS)) {
      return null;
    }
    this.upgradeRetryNotBeforeMs = now + FORCED_UPGRADE_RETRY_COOLDOWN_MS;
    const pendingMarkers = this.tm.upgradeResumeStore?.listPending().length ?? 0;
    if (!this.upgradePauseOwnershipConfirmed && (pendingMarkers > 0 || runningTurns > 0)) {
      this.resumeOwnershipConfirmed = false;
      this.requestOwnershipRecovery();
    }
    this.liftPause([], void 0);
    this.upgradePauseOwnershipConfirmed = false;
    return { runningTurns: refuseSwapRunningTurns(runningTurns) };
  }
  runningTurnsForUpgrade() {
    return (/* @__PURE__ */ new Set([...this.tm.runLifecycle.runningAgentIds(), ...this.pauseResumeInFlightAgentIds])).size;
  }
  signalTurnsForPause() {
    this.tm.traceFlusher();
    for (const session of this.tm.runLifecycle.inFlightRunCounts.keys()) {
      this.tm.runnerRegistry.runners.get(session.id)?.requestPauseForUpgrade();
      this.tm.runnerRegistry.activeGroupMemberRunners.get(session.id)?.requestPauseForUpgrade();
    }
    this.tm.runLifecycle.sweepWedgedPausedRuns();
  }
  markAllRunningAgentsForUpgradeResume() {
    for (const session of this.tm.runLifecycle.inFlightRunCounts.keys()) {
      const source = this.tm.turnRuntime.activeRequestSources.get(session.id) ?? "turn";
      if (source === "background-revival") {
        this.markAgentResumePendingForPausedRevival(session);
      } else {
        const requestId2 = this.tm.runLifecycle.persistedSpendRequestIds.get(session.id);
        const spendRequestId = spendInitiationForRequest(session, requestId2) == null ? void 0 : requestId2;
        const prior = this.tm.upgradeResumeStore?.listPending().find((marker17) => marker17.agentId === session.id);
        const sameResume = spendRequestId != null && prior != null && prior.spendRequestId === spendRequestId && prior.source === source;
        this.markAgentResumePending(session, source, {
          spendRequestId,
          ...sameResume ? { automationId: prior.automationId, automationRunId: prior.automationRunId } : {}
        });
      }
    }
  }
  markAgentResumePending(session, source, opts) {
    const prior = this.tm.upgradeResumeStore?.listPending().find((marker18) => marker18.agentId === session.id);
    const marker17 = {
      agentId: session.id,
      markedAtMs: Math.max(Date.now(), (prior?.markedAtMs ?? -1) + 1),
      source,
      ...opts?.automationId != null ? { automationId: opts.automationId } : {},
      ...opts?.automationRunId != null ? { automationRunId: opts.automationRunId } : {},
      ...opts?.spendRequestId != null ? { spendRequestId: opts.spendRequestId } : {}
    };
    this.tm.upgradeResumeStore?.markPending(marker17);
    if (this.pauseState === null) {
      if (this.resumeOwnershipConfirmed) this.startUpgradeResume(marker17);
      else this.requestOwnershipRecovery();
    }
  }
  markAgentResumePendingForPausedRevival(session) {
    const store = this.tm.upgradeResumeStore;
    if (store == null) return;
    if (store.listPending().some((marker17) => marker17.agentId === session.id)) {
      return;
    }
    this.markAgentResumePending(session, "background-revival");
  }
  async resumeInterruptedUpgradeTurns() {
    this.resumeOwnershipConfirmed = true;
    this.resumeOwnershipRecoveryRequested = false;
    if (this.tm.upgradeResumeStore == null || !this.tm.execution.canExecute) {
      return { resumed: 0, suppressedTemporal: 0 };
    }
    const pending = this.tm.upgradeResumeStore.listPending();
    if (pending.length === 0) return { resumed: 0, suppressedTemporal: 0 };
    let resumed = 0;
    let suppressedTemporal = 0;
    for (const marker17 of pending) {
      const outcome = this.startUpgradeResume(marker17);
      if (outcome === "resumed") resumed += 1;
      if (outcome === "suppressed_temporal") suppressedTemporal += 1;
    }
    return { resumed, suppressedTemporal };
  }
  hasPauseResumeInFlight() {
    return this.pauseResumeInFlightAgentIds.size > 0;
  }
  isResumeInFlight(agentId) {
    return this.pauseResumeInFlightAgentIds.has(agentId);
  }
  async resumeUpgradeAgent(marker17) {
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(marker17.agentId);
    } catch {
      return;
    }
    if (this.tm.groupChat.isGroupSession(session)) return;
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    const resumedSource = marker17.source === "notification" ? "background-revival" : marker17.source ?? "handoff-resume";
    const ackToken = resumedSource === "turn" || resumedSource === "handoff-resume" ? this.tm.ackObligations.mintAckRunToken(session.id) : void 0;
    await this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestSources.set(session.id, resumedSource);
        this.tm.runLifecycle.persistedSpendRequestIds.delete(session.id);
        let spendRequestId;
        try {
          const resumedAutomation = resumedSource === "automation" && marker17.automationId != null ? session.automations.get(marker17.automationId) : null;
          const resumedAutomationWake = {};
          if (resumedAutomation != null) {
            resumedAutomationWake.automationWake = {
              id: resumedAutomation.id,
              name: resumedAutomation.name
            };
          }
          const resumedInitiation = spendInitiationForRequest(session, marker17.spendRequestId);
          const resumedTurnUnit = resumedInitiation === void 0 ? {} : {
            turnUnitId: resumedInitiation.id,
            turnUnitType: resumedInitiation.type
          };
          const result = await runner.run(buildUpgradeResumePrompt(resumedSource), {
            hidden: true,
            ackToken,
            isSilenceAllowed: resumedSource === "automation" || resumedSource === "background-revival",
            ...resumedAutomationWake,
            requestSource: resumedSource,
            ...resumedTurnUnit,
            onPersistableRunStarted: spendInitiationRecorder(
              session,
              resumedInitiation,
              (requestId2) => {
                spendRequestId = requestId2;
                this.tm.runLifecycle.persistedSpendRequestIds.set(session.id, requestId2);
              }
            )
          });
          if (result.pausedForUpgrade) {
            const current = this.tm.upgradeResumeStore?.listPending().find((candidate) => candidate.agentId === marker17.agentId);
            if (current == null || isSameResumeMarker(current, marker17)) {
              this.tm.upgradeResumeStore?.markPending({
                ...marker17,
                markedAtMs: Math.max(Date.now(), marker17.markedAtMs + 1),
                spendRequestId: spendRequestId ?? marker17.spendRequestId
              });
            }
          }
          await this.tm.roster.emitAgentUpdate(session.id);
          this.tm.automationRuntime.emitAutomations(session);
        } catch (error42) {
          this.tm.telemetry.reportAgentError({
            source: "resume",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error42),
            detail: sandErrorDetail(error42)
          });
          const description9 = describeAgentRunError(error42);
          this.tm.trayErrors.pushError({
            agentId: session.id,
            ...description9,
            ...hostTrayTitle({ kind: "resume_after_host_update_failed", description: description9 })
          });
        } finally {
          this.tm.ackObligations.retireAckRunToken(session.id, ackToken);
          this.tm.runLifecycle.endSessionRun(session);
          if (this.tm.runLifecycle.persistedSpendRequestIds.get(session.id) === spendRequestId) {
            this.tm.runLifecycle.persistedSpendRequestIds.delete(session.id);
          }
        }
      },
      { lane: "background", source: "upgrade-resume", ackToken }
    );
  }
  getPauseState() {
    return {
      owner: this.pauseState?.owner ?? null,
      quiescent: this.outstandingWorkForRecreate() === 0
    };
  }
  outstandingWorkForRecreate() {
    return (/* @__PURE__ */ new Set([
      ...this.tm.liveRunningAgentIds(),
      ...this.tm.backgroundWakes.revivingSubagentAgentIds,
      ...this.tm.backgroundWakes.revivingShellAgentIds,
      ...this.pauseResumeInFlightAgentIds
    ])).size + (this.tm.hasRunningBackgroundShellWork() ? 1 : 0);
  }
  async pauseTurnsForRecreate() {
    const outstanding = this.outstandingWorkForRecreate();
    if (this.pauseState?.owner === "upgrade") {
      return {
        quiescing: false,
        runningTurns: Math.max(outstanding, 1),
        resumeAgentIds: this.listResumePendingAgentIds(),
        resumePendingWakes: this.listRecreateCarryPendingWakes()
      };
    }
    if (this.pauseState === null) {
      this.pauseState = {
        owner: "recreate",
        startedAtMs: this.tm.clock.now()
      };
    }
    this.signalTurnsForPause();
    return {
      quiescing: true,
      runningTurns: outstanding,
      resumeAgentIds: this.listResumePendingAgentIds(),
      resumePendingWakes: this.listRecreateCarryPendingWakes()
    };
  }
  listResumePendingAgentIds() {
    return (this.tm.upgradeResumeStore?.listPending() ?? []).filter((marker17) => !this.pauseResumeInFlightAgentIds.has(marker17.agentId)).map((marker17) => marker17.agentId);
  }
  listRecreateCarryPendingWakes() {
    const store = this.tm.pendingWakeStore;
    if (store == null || this.recreateWakeCarryDisabled) return [];
    return store.listPending().filter((marker17) => marker17.kind === "cloud-agent" || marker17.kind === "shell");
  }
  hasCarryablePendingWake() {
    return this.listRecreateCarryPendingWakes().length > 0;
  }
  hasMidDrainRevival() {
    return this.tm.backgroundWakes.revivingSubagentAgentIds.size > 0 || this.tm.backgroundWakes.revivingShellAgentIds.size > 0;
  }
  async resumeAfterRecreate(agentIds, carriedPendingWakes) {
    this.resumeOwnershipConfirmed = true;
    this.resumeOwnershipRecoveryRequested = false;
    if (this.pauseState?.owner === "upgrade") {
      this.upgradePauseOwnershipConfirmed = true;
      this.preserveResumeMarkers(agentIds);
      this.restoreCarriedPendingWakes(carriedPendingWakes);
      return { resumed: 0, suppressedTemporal: 0 };
    }
    return this.liftPause(agentIds, carriedPendingWakes);
  }
  parkResumeAfterIdentityReconcileFailure(agentIds, carriedPendingWakes) {
    this.resumeOwnershipConfirmed = false;
    this.preserveResumeMarkers(agentIds);
    this.restoreCarriedPendingWakes(carriedPendingWakes);
    if (this.pauseState?.owner !== "upgrade") this.releasePauseState();
  }
  preserveResumeMarkers(agentIds) {
    const pendingAgentIds = new Set(
      this.tm.upgradeResumeStore?.listPending().map((marker17) => marker17.agentId) ?? []
    );
    for (const agentId of agentIds) {
      if (!pendingAgentIds.has(agentId)) {
        this.tm.upgradeResumeStore?.markPending({ agentId, markedAtMs: Date.now() });
      }
    }
  }
  liftPause(agentIds, carriedPendingWakes) {
    this.releasePauseState();
    const localMarkers = this.tm.upgradeResumeStore?.listPending() ?? [];
    const localPendingAgentIds = localMarkers.map((marker17) => marker17.agentId);
    const agentIdsToResume = [.../* @__PURE__ */ new Set([...agentIds, ...localPendingAgentIds])];
    let resumed = 0;
    let suppressedTemporal = 0;
    for (const agentId of agentIdsToResume) {
      const localMarker = localMarkers.find((marker17) => marker17.agentId === agentId);
      const outcome = this.startUpgradeResume(localMarker ?? { agentId, markedAtMs: Date.now() });
      if (outcome === "resumed") resumed += 1;
      if (outcome === "suppressed_temporal") suppressedTemporal += 1;
    }
    this.restoreCarriedPendingWakes(carriedPendingWakes);
    return { resumed, suppressedTemporal };
  }
  releasePauseState() {
    this.pauseState = null;
    this.tm.runLifecycle.clearForcedPauseDeadlines();
    for (const runner of this.tm.runnerRegistry.runners.values()) {
      runner.cancelPauseForUpgrade();
    }
    for (const runner of this.tm.runnerRegistry.activeGroupMemberRunners.values()) {
      runner.cancelPauseForUpgrade();
    }
  }
  startUpgradeResume(marker17) {
    if (!this.resumeOwnershipConfirmed) {
      this.requestOwnershipRecovery();
      return "skipped";
    }
    if (this.tm.sessions.isAgentGone(marker17.agentId)) {
      this.tm.upgradeResumeStore?.clear(marker17.agentId);
      return "skipped";
    }
    if (this.pauseResumeInFlightAgentIds.has(marker17.agentId)) return "skipped";
    if (readSandProfileHarness(
      getSandProfilePath(this.tm.sessionStore.getAgentDir(marker17.agentId))
    ) === "temporal") {
      this.tm.upgradeResumeStore?.clear(marker17.agentId);
      return "suppressed_temporal";
    }
    this.tm.upgradeResumeStore?.markPending(marker17);
    this.pauseResumeInFlightAgentIds.add(marker17.agentId);
    const resume = this.resumeUpgradeAgent(marker17);
    void resume.then(
      () => this.finishUpgradeResume(marker17),
      (error42) => {
        this.tm.telemetry.reportAgentError({
          source: "resume",
          conversationId: marker17.agentId,
          error: classifyAgentError(error42),
          detail: sandErrorDetail(error42)
        });
        this.finishUpgradeResume(marker17);
      }
    );
    return "resumed";
  }
  finishUpgradeResume(marker17) {
    this.pauseResumeInFlightAgentIds.delete(marker17.agentId);
    if (this.tm.disposed) return;
    const pending = this.tm.upgradeResumeStore?.listPending().find((candidate) => candidate.agentId === marker17.agentId);
    if (pending != null && isSameResumeMarker(pending, marker17)) {
      this.tm.upgradeResumeStore?.clear(marker17.agentId);
      return;
    }
    if (this.pauseState !== null || !this.resumeOwnershipConfirmed) return;
    if (pending != null) this.startUpgradeResume(pending);
  }
  restoreCarriedPendingWakes(carriedPendingWakes) {
    if (carriedPendingWakes == null || carriedPendingWakes.length === 0) return;
    if (!this.tm.execution.canExecute) return;
    if (this.recreateWakeCarryDisabled) return;
    const now = Date.now();
    for (const marker17 of coercePendingWakeMarkers(carriedPendingWakes)) {
      if (marker17.kind !== "cloud-agent" && marker17.kind !== "shell") continue;
      const report = (outcome, reason) => {
        this.tm.telemetry.reportPendingWake({
          conversationId: marker17.agentId,
          outcome,
          kind: marker17.kind,
          workId: marker17.workId,
          ageMs: now - marker17.markedAtMs,
          ...reason != null ? { reason } : {},
          isQuietOrigin: marker17.quietOrigin != null
        });
      };
      if (this.tm.pendingWakeStore?.hasPending(marker17.agentId, marker17.kind, marker17.workId) === true) {
        report("rearm_skipped", "locally_owned");
        continue;
      }
      if (this.tm.sessions.isAgentGone(marker17.agentId)) {
        report("rearm_skipped", "agent_gone");
        continue;
      }
      if (this.tm.groupChat.isGroupAgentId(marker17.agentId)) {
        report("rearm_skipped", "group_session");
        continue;
      }
      const accepted = marker17.kind === "shell" ? { ...marker17, interruptedByRecreate: true } : marker17;
      const store = this.tm.pendingWakeStore;
      if (store == null) {
        report("persist_failed");
      } else {
        const persisted = attemptSync(() => store.markPending(accepted));
        if (!persisted.ok) report("persist_failed", errorLogTag(persisted.error));
      }
      report("carried");
    }
  }
  deliverRecreateInterruptedShellNotice(marker17, report) {
    report("dropped_with_notice");
    this.tm.backgroundWakes.handleBackgroundShellCompletion({
      agentId: marker17.agentId,
      shellId: marker17.workId,
      title: marker17.title ?? `Background command ${marker17.workId}`,
      status: "aborted",
      detail: "The computer update that rebuilt this agent's computer interrupted this background command; the command's process did not survive the update, so it will never report a completion. Check its terminal output file for what it got through, and re-run it if the work still matters.",
      ...marker17.quietOrigin != null ? { quietOrigin: marker17.quietOrigin } : {}
    });
  }
};
