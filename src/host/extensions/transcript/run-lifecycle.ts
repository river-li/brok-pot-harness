var RUN_WATCHDOG_DEFAULT_MS = 12e4;
var RUN_WATCHDOG_GRACE_DEFAULT_MS = 3e4;
var FORCED_PAUSE_REAP_DEFAULT_MS = 5 * 6e4;
function spendInitiationAnalyticsProps(initiation) {
  if (initiation === void 0) return {};
  const props = {
    turn_unit_type: initiation.type,
    turn_unit_id: initiation.id,
    initiated_at_ms: initiation.timestampMs
  };
  if (initiation.initiatingMessageCount === void 0) return props;
  return { ...props, initiating_message_count: initiation.initiatingMessageCount };
}
var RunLifecycle = class {
  constructor(tm, environment) {
    this.tm = tm;
    this.forcedPauseReapMs = environment.forcedPauseReapMs ?? FORCED_PAUSE_REAP_DEFAULT_MS;
    this.runScheduler = environment.schedulerDisabled ? null : new SandRunScheduler({
      watchdogMs: environment.watchdogMs ?? RUN_WATCHDOG_DEFAULT_MS,
      watchdogGraceMs: environment.watchdogGraceMs ?? RUN_WATCHDOG_GRACE_DEFAULT_MS,
      interruptWedgedRun: (agentId) => this.tm.runnerRegistry.interruptWedgedRunForWatchdog(agentId),
      telemetry: {
        onAccepted: (event) => this.tm.telemetry.reportQueueAccepted({
          conversationId: event.agentId,
          lane: event.lane,
          source: event.source,
          position: event.position,
          depthUser: event.depthUser,
          depthAgent: event.depthAgent,
          depthBackground: event.depthBackground,
          hasActive: event.hasActive
        }),
        onDequeued: (event) => this.tm.telemetry.reportQueueDequeued({
          conversationId: event.agentId,
          lane: event.lane,
          source: event.source,
          queueWaitMs: event.queueWaitMs,
          ...event.acceptedToRunMs != null ? { acceptedToRunMs: event.acceptedToRunMs } : {},
          jumpedBackground: event.jumpedBackground,
          depthUser: event.depthUser,
          depthAgent: event.depthAgent,
          depthBackground: event.depthBackground
        }),
        onWatchdog: (event) => {
          if (event.stage === "escape") {
            this.tm.ackObligations.retireAckRunToken(event.agentId, event.ackToken);
          }
          this.tm.telemetry.reportQueueWatchdog({
            conversationId: event.agentId,
            stage: event.stage,
            activeLane: event.activeLane,
            activeSource: event.activeSource,
            activeRuntimeMs: event.activeRuntimeMs,
            ...event.waitingUserAgeMs != null ? { waitingUserAgeMs: event.waitingUserAgeMs } : {},
            ...event.interrupted != null ? { interrupted: event.interrupted } : {}
          });
        }
      },
      onRunStart: (agentId) => this.tm.sendPipeline.sendAttachmentBatchIds.delete(agentId)
    });
  }
  tm;
  inFlightRunCounts = /* @__PURE__ */ new Map();
  pauseStopDeadlines = /* @__PURE__ */ new Map();
  reapedWedgedSessions = /* @__PURE__ */ new Map();
  forcedPauseReapMs;
  runWindowStartedAt = /* @__PURE__ */ new Map();
  turnWorthyBeginCounts = /* @__PURE__ */ new Map();
  syntheticTurnIdentities = /* @__PURE__ */ new Map();
  activeRunSession = null;
  runChains = /* @__PURE__ */ new Map();
  runScheduler;
  composingMessageSessionIds = /* @__PURE__ */ new Set();
  retryingSessionIds = /* @__PURE__ */ new Set();
  sessionActivities = /* @__PURE__ */ new Map();
  sessionActivityHolds = /* @__PURE__ */ new Map();
  lastRequestIdBySession = /* @__PURE__ */ new Map();
  persistedSpendRequestIds = /* @__PURE__ */ new Map();
  turnRequestIdsBySession = /* @__PURE__ */ new Map();
  completedTurnRequestIdsBySession = /* @__PURE__ */ new Map();
  activeLifecycleRequestIdsBySession = /* @__PURE__ */ new Map();
  observedRequestIdsByLifecycleRequest = /* @__PURE__ */ new Map();
  activeAgentPeerBatches = /* @__PURE__ */ new Map();
  agentPeerBatchByRequestId = /* @__PURE__ */ new Map();
  turnEndedSeqBySession = /* @__PURE__ */ new Map();
  retiringSessions = /* @__PURE__ */ new WeakSet();
  serverActivityOverlayProvider = null;
  async recordRequestId(requestId2, session, source) {
    if (session == null) return;
    try {
      session.db.recordRequestId(
        requestId2,
        Date.now(),
        this.tm.turnRuntime.activeRequestPrompts.get(session.id),
        source ?? this.tm.turnRuntime.activeRequestSources.get(session.id)
      );
      await this.tm.roster.emitAgentUpdate(session.id);
    } catch {
    }
  }
  trackTurnRequestId(sessionId, requestId2) {
    const trimmed = requestId2.trim();
    if (trimmed.length === 0) return;
    const ids = this.turnRequestIdsBySession.get(sessionId);
    if (ids != null) {
      ids.add(trimmed);
    } else {
      this.turnRequestIdsBySession.set(sessionId, /* @__PURE__ */ new Set([trimmed]));
    }
    const lifecycleRequestId = this.activeLifecycleRequestIdsBySession.get(sessionId)?.at(-1);
    if (lifecycleRequestId != null) {
      const observed = this.observedRequestIdsByLifecycleRequest.get(lifecycleRequestId);
      if (observed != null) {
        observed.add(trimmed);
      } else {
        this.observedRequestIdsByLifecycleRequest.set(
          lifecycleRequestId,
          /* @__PURE__ */ new Set([lifecycleRequestId, trimmed])
        );
      }
    }
  }
  reportTurnUsage(session, usage) {
    const requestIds = this.turnRequestIdsBySession.get(session.id);
    this.turnRequestIdsBySession.delete(session.id);
    if (requestIds != null && requestIds.size > 0) {
      const completedIds = this.completedTurnRequestIdsBySession.get(session.id);
      if (completedIds == null) {
        this.completedTurnRequestIdsBySession.set(session.id, new Set(requestIds));
      } else {
        for (const requestId2 of requestIds) completedIds.add(requestId2);
      }
    }
    const turnEndedSeq = (this.turnEndedSeqBySession.get(session.id) ?? 0) + 1;
    this.turnEndedSeqBySession.set(session.id, turnEndedSeq);
    this.tm.telemetry.reportTurnUsage({
      conversationId: session.id,
      source: this.tm.turnRuntime.activeRequestSources.get(session.id) ?? "turn",
      usage,
      requestId: requestIds?.values().next().value,
      requestIdCount: requestIds?.size ?? 0,
      turnEndedSeq
    });
  }
  recordRequestStarted(session, event) {
    const active = this.activeLifecycleRequestIdsBySession.get(session.id) ?? [];
    active.push(event.requestId);
    this.activeLifecycleRequestIdsBySession.set(session.id, active);
    this.observedRequestIdsByLifecycleRequest.set(event.requestId, /* @__PURE__ */ new Set([event.requestId]));
    const peerBatch = this.activeAgentPeerBatches.get(session.id);
    if (peerBatch != null) this.agentPeerBatchByRequestId.set(event.requestId, peerBatch);
    this.trackTurnRequestId(session.id, event.requestId);
  }
  recordRequestCompleted(session, event) {
    this.trackTurnRequestId(session.id, event.requestId);
    const requestIds = this.observedRequestIdsByLifecycleRequest.get(event.requestId) ?? /* @__PURE__ */ new Set([event.requestId]);
    this.observedRequestIdsByLifecycleRequest.delete(event.requestId);
    const active = this.activeLifecycleRequestIdsBySession.get(session.id)?.filter((requestId2) => requestId2 !== event.requestId);
    if (active == null || active.length === 0) {
      this.activeLifecycleRequestIdsBySession.delete(session.id);
    } else {
      this.activeLifecycleRequestIdsBySession.set(session.id, active);
    }
    const initiation = spendInitiationForRequest(session, event.requestId);
    const peerBatch = this.agentPeerBatchByRequestId.get(event.requestId);
    this.agentPeerBatchByRequestId.delete(event.requestId);
    this.tm.productAnalytics.trackEvent("sand.request.completed", {
      conversation_id: event.conversationId,
      request_id: event.requestId,
      request_ids: JSON.stringify([...requestIds].sort()),
      ...event.lineage?.parentRequestId === void 0 ? {} : { parent_request_id: event.lineage.parentRequestId },
      ...event.lineage?.rootParentRequestId === void 0 ? {} : { root_parent_request_id: event.lineage.rootParentRequestId },
      source: event.source ?? "turn",
      initiator: event.initiator,
      is_group_member: event.isGroupMemberTurn,
      started_at_ms: event.startedAtMs,
      ended_at_ms: event.endedAtMs,
      ...spendInitiationAnalyticsProps(initiation),
      ...peerBatch == null ? {} : {
        peer_batch_id: peerBatch.batchId,
        queue_batch_size: peerBatch.queueBatchSize,
        queue_wait_ms: peerBatch.queueWaitMs,
        messages_arrived_while_running: peerBatch.messagesArrivedWhileRunning,
        compaction_epoch: peerBatch.compactionEpoch
      }
    });
  }
  hasActiveRequest(sessionId) {
    return (this.activeLifecycleRequestIdsBySession.get(sessionId)?.length ?? 0) > 0;
  }
  beginAgentPeerBatch(sessionId, telemetry) {
    this.activeAgentPeerBatches.set(sessionId, telemetry);
  }
  endAgentPeerBatch(sessionId) {
    this.activeAgentPeerBatches.delete(sessionId);
  }
  enqueueExclusiveRun(agentId, task, options2) {
    if (this.tm.disposed) return Promise.resolve().then(options2.onCancelled);
    const scheduler = this.runScheduler;
    if (scheduler != null) {
      return scheduler.enqueue(agentId, task, options2);
    }
    const previous = this.runChains.get(agentId) ?? Promise.resolve();
    const result = previous.then(() => {
      if (this.tm.disposed) return options2.onCancelled?.();
      this.tm.sendPipeline.sendAttachmentBatchIds.delete(agentId);
      return task();
    });
    this.runChains.set(
      agentId,
      Promise.allSettled([result]).then(() => {
      })
    );
    return result;
  }
  async drainExclusiveRuns(agentId) {
    if (this.runScheduler != null) {
      await this.runScheduler.drain(agentId);
      return;
    }
    await this.runChains.get(agentId);
  }
  getRunQueueDiagnostics() {
    const scheduler = this.runScheduler;
    if (scheduler == null) return [];
    const now = Date.now();
    const byAgent = /* @__PURE__ */ new Map();
    for (const queue of scheduler.getDiagnostics()) {
      byAgent.set(queue.agentId, { ...queue, ackOutstanding: false });
    }
    for (const obligation of this.tm.ackObligationStore?.list() ?? []) {
      const existing = byAgent.get(obligation.agentId) ?? {
        agentId: obligation.agentId,
        depthUser: 0,
        depthAgent: 0,
        depthBackground: 0,
        depthTotal: 0,
        ackOutstanding: false
      };
      byAgent.set(obligation.agentId, {
        ...existing,
        ackOutstanding: true,
        ackAgeMs: now - obligation.createdAtMs,
        ackCoalescedCount: obligation.coalescedCount
      });
    }
    return [...byAgent.values()];
  }
  beginSessionRun(session, options2) {
    const inFlight = this.inFlightRunCounts.get(session) ?? 0;
    if (inFlight === 0) {
      this.runWindowStartedAt.set(session, Date.now());
    }
    if (options2?.isGroupMemberTurn !== true) {
      this.turnWorthyBeginCounts.set(session, (this.turnWorthyBeginCounts.get(session) ?? 0) + 1);
    }
    if (options2?.initiationMessageId != null) {
      const existing = this.syntheticTurnIdentities.get(session.id);
      if (existing == null) {
        this.syntheticTurnIdentities.set(session.id, {
          requestId: (0, import_node_crypto74.randomUUID)(),
          messageIds: /* @__PURE__ */ new Set([options2.initiationMessageId]),
          initiatedAtMs: options2.initiatedAtMs ?? Date.now()
        });
      } else {
        existing.messageIds.add(options2.initiationMessageId);
        existing.initiatedAtMs = Math.min(
          existing.initiatedAtMs,
          options2.initiatedAtMs ?? existing.initiatedAtMs
        );
      }
    }
    this.inFlightRunCounts.set(session, inFlight + 1);
    this.tm.sessions.liveSessions.set(session.id, session);
    this.activeRunSession = session;
    void this.tm.roster.emitAgentUpdate(session.id);
  }
  syntheticTurnLineage(sessionId) {
    const requestId2 = this.syntheticTurnIdentities.get(sessionId)?.requestId;
    return requestId2 == null ? void 0 : { parentRequestId: requestId2, rootParentRequestId: requestId2 };
  }
  sweepWedgedPausedRuns() {
    const now = this.tm.clock.monotonicNow();
    for (const session of [...this.pauseStopDeadlines.keys()]) {
      if (!this.inFlightRunCounts.has(session)) this.pauseStopDeadlines.delete(session);
    }
    for (const session of [...this.reapedWedgedSessions.keys()]) {
      if (!this.inFlightRunCounts.has(session)) this.reapedWedgedSessions.delete(session);
    }
    for (const [session, count] of this.inFlightRunCounts) {
      if (count <= (this.reapedWedgedSessions.get(session) ?? 0)) {
        this.pauseStopDeadlines.delete(session);
        continue;
      }
      const deadline = this.pauseStopDeadlines.get(session);
      if (deadline == null) {
        this.pauseStopDeadlines.set(session, now + this.forcedPauseReapMs);
      } else if (now >= deadline) {
        this.reapWedgedPausedRun(session, now - deadline + this.forcedPauseReapMs);
      }
    }
  }
  clearForcedPauseDeadlines() {
    this.pauseStopDeadlines.clear();
  }
  reapWedgedPausedRun(session, pausedForMs) {
    this.pauseStopDeadlines.delete(session);
    const source = this.tm.turnRuntime.activeRequestSources.get(session.id) ?? "turn";
    const hasMarker = this.tm.upgradeResumeStore?.listPending().some((m2) => m2.agentId === session.id) === true;
    if (!hasMarker) {
      if (source === "background-revival") {
        this.tm.upgradeResume.markAgentResumePendingForPausedRevival(session);
      } else {
        this.tm.upgradeResume.markAgentResumePending(session, source);
      }
    }
    this.tm.runnerRegistry.interruptWedgedRunForWatchdog(session.id);
    const zombieSettled = this.runScheduler?.escapeReapedRun(session.id);
    const count = this.inFlightRunCounts.get(session) ?? 0;
    this.reapedWedgedSessions.set(
      session,
      Math.min(count, (this.reapedWedgedSessions.get(session) ?? 0) + 1)
    );
    void zombieSettled?.then(() => this.retireReapedExclusion(session));
    this.tm.telemetry.reportWedgedRunReap({
      conversationId: session.id,
      source,
      inFlightCount: count,
      pausedForMs
    });
  }
  retireReapedExclusion(session) {
    const reaped = this.reapedWedgedSessions.get(session);
    if (reaped == null) return;
    const next = Math.min(reaped - 1, this.inFlightRunCounts.get(session) ?? 0);
    if (next <= 0) {
      this.reapedWedgedSessions.delete(session);
    } else {
      this.reapedWedgedSessions.set(session, next);
    }
  }
  endSessionRun(session) {
    if (!this.inFlightRunCounts.has(session)) return;
    this.tm.voiceCalls.forgetOverheard(session.id);
    this.setSessionComposing(session.id, false);
    this.setSessionRetrying(session.id, false);
    this.setSessionActivity(session.id, void 0);
    this.sessionActivityHolds.delete(session.id);
    const remaining = (this.inFlightRunCounts.get(session) ?? 1) - 1;
    if (remaining > 0) {
      this.inFlightRunCounts.set(session, remaining);
      return;
    }
    this.inFlightRunCounts.delete(session);
    this.reapedWedgedSessions.delete(session);
    this.recordTurnCompleted(session);
    this.tm.turnRuntime.activeRequestPrompts.delete(session.id);
    this.tm.turnRuntime.activeRequestSources.delete(session.id);
    this.turnRequestIdsBySession.delete(session.id);
    this.completedTurnRequestIdsBySession.delete(session.id);
    const lifecycleRequestIds = this.activeLifecycleRequestIdsBySession.get(session.id);
    this.activeLifecycleRequestIdsBySession.delete(session.id);
    for (const lifecycleRequestId of lifecycleRequestIds ?? []) {
      this.observedRequestIdsByLifecycleRequest.delete(lifecycleRequestId);
      this.agentPeerBatchByRequestId.delete(lifecycleRequestId);
    }
    this.activeAgentPeerBatches.delete(session.id);
    this.turnEndedSeqBySession.delete(session.id);
    this.tm.sendPipeline.sendAttachmentBatchIds.delete(session.id);
    if (this.activeRunSession === session) this.activeRunSession = null;
    const endedAgentId = session.id;
    this.tm.ackObligations.scheduleAckRedriveAfterIdle(endedAgentId);
    void this.retireSession(session);
    void this.tm.roster.emitAgentUpdate(endedAgentId);
  }
  recordTurnCompleted(session) {
    const startedAt = this.runWindowStartedAt.get(session);
    this.runWindowStartedAt.delete(session);
    const turnWorthyBegins = this.turnWorthyBeginCounts.get(session) ?? 0;
    this.turnWorthyBeginCounts.delete(session);
    const identity = this.syntheticTurnIdentities.get(session.id);
    this.syntheticTurnIdentities.delete(session.id);
    if (turnWorthyBegins === 0) return;
    const requestIds = new Set(this.completedTurnRequestIdsBySession.get(session.id));
    for (const requestId2 of this.turnRequestIdsBySession.get(session.id) ?? []) {
      requestIds.add(requestId2);
    }
    const source = this.tm.turnRuntime.activeRequestSources.get(session.id) ?? "turn";
    const initiation = identity == null ? void 0 : messageSpendInitiation(session, [...identity.messageIds], identity.initiatedAtMs);
    this.tm.productAnalytics.trackEvent("sand.turn.completed", {
      agent_id: session.id,
      source,
      initiator: classifySandTurnInitiator({ isSubagentRunner: false, requestSource: source }),
      is_group: this.tm.groupChat.isGroupSession(session),
      duration_ms: startedAt != null ? Date.now() - startedAt : 0,
      ...identity == null ? {} : { request_id: identity.requestId },
      request_ids: JSON.stringify([...requestIds].sort()),
      ...spendInitiationAnalyticsProps(initiation)
    });
  }
  isSessionRetiring(session) {
    return this.retiringSessions.has(session);
  }
  async retireSession(session) {
    if (session == null) return;
    const pending = this.tm.sessions.pendingSessionOpens.get(session.id);
    const ownsPendingOpen = pending != null && await this.tm.sessions.settledOpen(pending) === session;
    if (session === this.tm.sessions.activeSession) return;
    if (this.tm.sessions.deferSessionRetirementWhileActivating(session)) return;
    if (this.inFlightRunCounts.has(session)) return;
    if (this.tm.runnerRegistry.subagentOwnership.hasPendingWork(session)) return;
    if (this.tm.disposed || this.tm.sessions.deletedAgentIds.has(session.id)) return;
    if (this.retiringSessions.has(session)) return;
    this.retiringSessions.add(session);
    if (this.tm.sessions.liveSessions.get(session.id) === session) {
      this.tm.runnerRegistry.runners.get(session.id)?.expireAutoReviewApprovals();
      this.tm.sessions.liveSessions.delete(session.id);
      this.tm.runnerRegistry.runners.delete(session.id);
    }
    if (ownsPendingOpen && this.tm.sessions.pendingSessionOpens.get(session.id) === pending) {
      this.tm.sessions.pendingSessionOpens.delete(session.id);
    }
    await session.agentStore.dispose();
    session.db.close();
  }
  runningAgentIds() {
    const running = /* @__PURE__ */ new Set();
    for (const [session, count] of this.inFlightRunCounts) {
      if (count > (this.reapedWedgedSessions.get(session) ?? 0)) running.add(session.id);
    }
    return running;
  }
  liveRunningAgentIds() {
    const running = new Set(this.runningAgentIds());
    for (const agentId of this.tm.roster.liveSubagentParentIds()) running.add(agentId);
    return running;
  }
  setServerActivityOverlayProvider(provider) {
    this.serverActivityOverlayProvider = provider;
  }
  withRunStates(agents) {
    const running = this.runningAgentIds();
    const subagentParents = this.tm.roster.liveSubagentParentIds();
    const composing = this.composingMessageSessionIds;
    const retrying = this.retryingSessionIds;
    const activities = this.sessionActivities;
    return agents.map((agent) => {
      const summary = withoutBoxAwaitingForTemporal(agent);
      if (agent.harness === "temporal") {
        const overlay2 = this.serverActivityOverlayProvider?.(agent.id);
        if (overlay2 != null) return overlaidAgentSummaryOf(summary, overlay2);
      }
      const isRunningTurn = running.has(agent.id);
      const isRunning = isRunningTurn || subagentParents.has(agent.id);
      const isComposingMessage = isRunning && composing.has(agent.id);
      const isRetrying = isRunning && retrying.has(agent.id);
      const currentActivity = isRunning ? activities.get(agent.id) : void 0;
      const activeGroupMemberId = isRunning ? this.tm.groupChat.activeTemporalMemberIdsByGroup.get(agent.id) : void 0;
      if (summary.isRunning === isRunning && (summary.isRunningTurn ?? false) === isRunningTurn && summary.isComposingMessage === isComposingMessage && (summary.isRetrying ?? false) === isRetrying && areAgentActivitiesEqual(summary.currentActivity, currentActivity) && summary.activeGroupMemberId === activeGroupMemberId) {
        return summary;
      }
      return {
        ...summary,
        isRunning,
        isRunningTurn,
        isComposingMessage,
        isRetrying,
        currentActivity,
        activeGroupMemberId
      };
    });
  }
  setSessionComposing(sessionId, isComposing) {
    const had = this.composingMessageSessionIds.has(sessionId);
    if (isComposing === had) return;
    if (isComposing) {
      this.composingMessageSessionIds.add(sessionId);
    } else {
      this.composingMessageSessionIds.delete(sessionId);
    }
    void this.tm.roster.emitAgentUpdate(sessionId);
  }
  setSessionRetrying(sessionId, isRetrying) {
    const had = this.retryingSessionIds.has(sessionId);
    if (isRetrying === had) return;
    if (isRetrying) {
      this.retryingSessionIds.add(sessionId);
    } else {
      this.retryingSessionIds.delete(sessionId);
    }
    void this.tm.roster.emitAgentUpdate(sessionId);
  }
  trackRetryingFromUpdate(update, session) {
    if (update.type === "retrying") {
      const runEpoch = this.tm.turnRuntime.activeTurnEpochs.get(session.id);
      if (runEpoch !== void 0 && runEpoch !== this.tm.sendPipeline.currentTurnEpoch(session)) {
        return;
      }
      this.setSessionRetrying(session.id, true);
      return;
    }
    if (update.type === "text-delta" || update.type === "thinking-delta" || update.type === "tool-call" || update.type === "send-message" || update.type === "turn-ended") {
      this.setSessionRetrying(session.id, false);
    }
  }
  setSessionActivity(sessionId, activity) {
    const had = this.sessionActivities.get(sessionId);
    if (areAgentActivitiesEqual(had, activity)) return;
    if (activity == null) {
      this.sessionActivities.delete(sessionId);
    } else {
      this.sessionActivities.set(sessionId, activity);
    }
    void this.tm.roster.emitAgentUpdate(sessionId);
  }
  trackActivityFromUpdate(update, sessionId) {
    const priorHold = this.sessionActivityHolds.get(sessionId) ?? INITIAL_NAMED_ACTIVITY_HOLD_STATE;
    const { transition, state } = resolveNamedActivityHold(
      update,
      priorHold,
      Date.now(),
      NAMED_ACTIVITY_MAX_HOLD_MS
    );
    if (state === INITIAL_NAMED_ACTIVITY_HOLD_STATE) {
      this.sessionActivityHolds.delete(sessionId);
    } else {
      this.sessionActivityHolds.set(sessionId, state);
    }
    this.applyActivityTransition(sessionId, transition);
  }
  applyActivityTransition(sessionId, transition) {
    if (transition.type === "keep") return;
    this.setSessionActivity(sessionId, transition.type === "set" ? transition.activity : void 0);
  }
  trackComposingFromUpdate(update, sessionId) {
    if (update.type === "tool-call" && update.name === SEND_MESSAGE_TOOL_CALL_OUTLINE_NAME) {
      this.setSessionComposing(sessionId, update.status === "pending");
      return;
    }
    if (update.type === "send-message" || update.type === "turn-ended") {
      this.setSessionComposing(sessionId, false);
    }
  }
  closeSessionWhenIdle(session) {
    if (this.inFlightRunCounts.has(session)) return;
    if (this.tm.runnerRegistry.subagentOwnership.hasPendingWork(session)) return;
    session.db.close();
  }
  watchActiveSession(session) {
    this.tm.automationRuntime.watchSessionAutomations(session);
    this.tm.skillCommands.watchSessionSkills(session);
    this.tm.roster.watchSessionProfile(session);
  }
};
