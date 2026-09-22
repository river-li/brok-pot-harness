var MAX_AGENT_GONE_OBSERVATIONS = 256;
var SandAutomationSubagentRunIdMissingError = class extends SandDomainError {
  name = "SandAutomationSubagentRunIdMissingError";
  constructor() {
    super("A subagent automation run requires the server fire's run id");
  }
};
function firstEmailWakeEvent(events) {
  const emails = events.filter((event) => event.source === "email");
  const only = emails.length === 1 ? emails[0] : void 0;
  return only === void 0 ? void 0 : {
    fromAddress: only.fromAddress,
    inboxEmail: only.inboxEmail,
    authPassed: only.authPassed
  };
}
var AutomationRunPath = class {
  constructor(tm, spendGuard, eventFires) {
    this.tm = tm;
    this.spendGuard = spendGuard;
    this.eventFires = eventFires;
  }
  tm;
  spendGuard;
  eventFires;
  inFlightAutomationKeys = /* @__PURE__ */ new Set();
  automationFailureOccurrences = /* @__PURE__ */ new Map();
  agentGoneObservations = /* @__PURE__ */ new Map();
  noteAgentGone(agentId, enforced) {
    const existing = this.agentGoneObservations.get(agentId);
    if (existing != null) {
      existing.fireCount += 1;
      existing.enforced ||= enforced;
      return;
    }
    this.agentGoneObservations.set(agentId, { firstAtMs: Date.now(), fireCount: 1, enforced });
    while (this.agentGoneObservations.size > MAX_AGENT_GONE_OBSERVATIONS) {
      const oldest = this.agentGoneObservations.keys().next().value;
      if (oldest === void 0) break;
      this.agentGoneObservations.delete(oldest);
    }
  }
  reportAgentGoneRecovery(agentId, trigger2, runUuid) {
    const observation = this.agentGoneObservations.get(agentId);
    if (observation == null) return;
    this.agentGoneObservations.delete(agentId);
    this.tm.telemetry.reportAutomationAgentGoneRecovered({
      conversationId: agentId,
      trigger: trigger2,
      ...runUuid !== void 0 ? { runUuid } : {},
      msSinceFirstAgentGone: Math.max(0, Date.now() - observation.firstAtMs),
      agentGoneFireCount: observation.fireCount,
      enforced: observation.enforced
    });
  }
  raiseFiveMinuteFloorNotices(session, automation) {
    const floorNotices = automationNoticesToRaise(automation).filter(
      (notice) => notice.id === SAND_FIVE_MINUTE_AUTOMATION_FLOOR_NOTICE_ID
    );
    if (floorNotices.length === 0) return;
    const noticeEntries = floorNotices.map((notice) => ({
      kind: "notice",
      id: `notice-automation-${automation.id}-${notice.id}`,
      text: `The minimum routine interval is now 5 minutes. "${automation.name}" had an old cadence below that floor, so we changed this routine to run every 5 minutes.`,
      timestampMs: Date.now()
    }));
    const isActive = this.tm.sessions.activeSession?.id === session.id;
    if (isActive) {
      for (const entry of noticeEntries) {
        this.tm.appendEntry(entry);
      }
    } else {
      for (const entry of noticeEntries) {
        session.db.appendTranscriptEntry(entry);
      }
      this.tm.sessionStore.markSessionActivity(session);
      void this.tm.roster.emitAgentUpdate(session.id);
    }
    for (const notice of floorNotices) {
      session.automations.markNoticeRaised(automation.id, notice.id);
    }
  }
  async runGroupAutomation(session, automation, events) {
    const config2 = this.tm.groupChat.localGroupConfig((0, import_node_path157.dirname)(session.dbPath));
    if (config2 == null) return;
    const isActive = this.tm.sessions.activeSession?.id === session.id;
    const entries = isActive ? getTranscript() : session.db.getTranscriptEntries();
    this.raiseFiveMinuteFloorNotices(session, automation);
    const seed = createUserMessage(
      nextEntryId(entries, "user-message"),
      buildGroupAutomationSeed(automation, events),
      {}
    );
    if (isActive) {
      this.tm.appendEntry(seed);
    } else {
      session.db.appendTranscriptEntry(seed);
      this.tm.sessionStore.markSessionActivity(session);
      void this.tm.roster.emitAgentUpdate(session.id);
    }
    const orchestrator = new GroupChatOrchestrator(
      this.tm.groupChat.groupOrchestratorDeps(
        session,
        this.tm.sendPipeline.currentTurnEpoch(session),
        void 0,
        "background",
        "automation"
      )
    );
    await orchestrator.run({
      group: this.tm.groupChat.groupIdentityFor(session),
      memberIds: config2.memberIds
    });
  }
  async fireAutomation({
    agentId,
    automation,
    trigger: trigger2,
    events,
    runUuid,
    coalescedRunUuids,
    scheduledForMs,
    runAsSubagent,
    redriven
  }) {
    if (!this.tm.execution.canExecute) return void 0;
    const runKey = `${agentId}:${automation.id}`;
    const eventBatch = events ?? [];
    const isEventFire = eventBatch.length > 0;
    if (!isEventFire) {
      if (this.inFlightAutomationKeys.has(runKey)) {
        this.eventFires.reportFireDropped({
          agentId,
          trigger: trigger2,
          reason: "duplicate_in_flight",
          scheduledForMs,
          runUuid
        });
        return void 0;
      }
      this.inFlightAutomationKeys.add(runKey);
    }
    let runOutcome;
    let redriveAfterSupersede = false;
    try {
      let session;
      try {
        session = await this.tm.sessions.resolveBackgroundSession(agentId);
      } catch (error42) {
        if (!(error42 instanceof AgentGoneError)) {
          this.eventFires.reportFireDropped({
            agentId,
            trigger: trigger2,
            reason: "delivery_error",
            scheduledForMs,
            runUuid,
            error: error42
          });
          return void 0;
        }
        const enforce = this.tm.isAutomationAgentGoneTerminalEnabled?.() ?? false;
        this.noteAgentGone(agentId, enforce);
        this.eventFires.reportFireDropped({
          agentId,
          trigger: trigger2,
          reason: enforce ? "agent_gone" : "agent_gone_would_drop",
          scheduledForMs,
          runUuid
        });
        return enforce ? "error" : void 0;
      }
      this.reportAgentGoneRecovery(agentId, trigger2, runUuid);
      const isGroup = this.tm.groupChat.isGroupSession(session);
      const runner = isGroup ? null : this.tm.runnerRegistry.getRunner(session);
      const shouldRunAsSubagent = !isGroup && runAsSubagent === true;
      let spendGuardReminder;
      if (!isGroup && isBackgroundAutomationTrigger(trigger2)) {
        const guard = await this.spendGuard.apply(session, automation);
        if (guard.paused) {
          this.eventFires.reportFireDropped({
            agentId,
            trigger: trigger2,
            reason: "user_away_paused",
            scheduledForMs,
            runUuid
          });
          return void 0;
        }
        spendGuardReminder = guard.reminder;
      }
      await this.tm.automationRuntime.enqueueAutomationLifecycleMutation({
        agentId: session.id,
        mutation: () => {
          if (this.tm.sessions.activeSession?.id === session.id) {
            this.tm.automationRuntime.recordAutomationChangeEvents(session, "agent");
          } else {
            const current = session.automations.listDefinitions();
            this.tm.automationRuntime.recordInactiveAutomationChanges({
              agentId: session.id,
              before: current,
              after: current,
              source: "agent"
            });
          }
        }
      });
      this.recordAutomationRun(session, automation.id);
      const automationsBeforeRun = session.automations.listDefinitions();
      this.tm.runLifecycle.beginSessionRun(session);
      await this.tm.runLifecycle.enqueueExclusiveRun(
        session.id,
        async () => {
          const staleReason = this.reasonFireWentStaleInQueue(session, automation.id, trigger2);
          if (staleReason !== void 0) {
            this.tm.runLifecycle.endSessionRun(session);
            this.eventFires.reportFireDropped({
              agentId,
              trigger: trigger2,
              reason: staleReason,
              scheduledForMs,
              runUuid
            });
            return;
          }
          runOutcome = "error";
          this.tm.backgroundWakes.dmPreemptedWakeAgentIds.delete(session.id);
          this.tm.turnRuntime.activeRequestSources.set(session.id, "automation");
          this.tm.runLifecycle.persistedSpendRequestIds.delete(session.id);
          const execution = this.beginAutomationRun({
            session,
            automationId: automation.id,
            trigger: trigger2,
            ...isEventFire ? { eventSummary: describeTriggerEventBatch(eventBatch) } : {},
            ...runUuid !== void 0 ? { runUuid } : {},
            ...coalescedRunUuids != null && coalescedRunUuids.length > 0 ? { coalescedRunUuids } : {}
          });
          const runId = execution?.id ?? null;
          let spendRequestId;
          const onPersistableRunStarted = spendInitiationRecorder(
            session,
            execution == null ? void 0 : {
              type: "wake",
              id: execution.id,
              timestampMs: execution.startedAt,
              automationName: automation.name
            },
            (requestId3) => {
              spendRequestId = requestId3;
              this.tm.runLifecycle.persistedSpendRequestIds.set(session.id, requestId3);
            }
          );
          const firedAt = Date.now();
          let telemetryOutcome = "error";
          let sentMessageCount;
          let parentWakeRequested = false;
          let requestId2;
          const captureRequestId = (nextRequestId) => {
            if (requestId2 !== void 0) return;
            requestId2 = nextRequestId;
            if (runId == null) return;
            try {
              session.automations.setRunRequestIdDefinition({
                id: automation.id,
                runId,
                requestId: requestId2
              });
              this.tm.automationRuntime.emitAutomations(session);
            } catch (error42) {
              this.tm.telemetry.reportAgentError({
                source: "automation",
                conversationId: session.id,
                requestId: requestId2,
                error: classifyAgentError(error42)
              });
            }
          };
          try {
            if (isGroup) {
              const currentAutomation = session.automations.get(automation.id) ?? automation;
              await this.runGroupAutomation(
                session,
                currentAutomation,
                isEventFire ? eventBatch : void 0
              );
              this.finishAutomationRun(session, automation.id, runId, "ok");
              telemetryOutcome = "ok";
            } else if (runner != null) {
              const currentAutomation = session.automations.get(automation.id) ?? automation;
              this.raiseFiveMinuteFloorNotices(session, currentAutomation);
              const automationForWake = session.automations.get(automation.id) ?? currentAutomation;
              for (const notice of automationNoticesToRaise(automationForWake)) {
                session.automations.markNoticeRaised(automation.id, notice.id);
              }
              const untrustedWhenCarryingEventContent = isEventFire ? { untrusted: true } : {};
              const wakeEmail = firstEmailWakeEvent(eventBatch);
              const wakePrompt = buildAutomationWakePrompt(automationForWake, {
                timeZone: this.tm.sessionStore.getUserTimeZone(),
                ...isEventFire ? { events: eventBatch } : {},
                trigger: trigger2,
                parentMediated: shouldRunAsSubagent
              }) + (spendGuardReminder == null ? "" : `

${spendGuardReminder}`);
              const result = await (async () => {
                if (shouldRunAsSubagent) {
                  if (runUuid === void 0) {
                    throw new SandAutomationSubagentRunIdMissingError();
                  }
                  return await runner.runAutomationAsSubagent({
                    subagentAgentId: `sand-subagent-${runUuid}`,
                    runUuid,
                    prompt: buildAutomationSubagentPrompt({
                      wakePrompt,
                      parentTranscriptPointer: runner.getTranscriptPath() ?? `sand-agent://${session.id}/transcript`,
                      parentMediated: true
                    }),
                    automationId: automation.id,
                    automationName: automation.name,
                    ...untrustedWhenCarryingEventContent,
                    onRequestId: captureRequestId
                  });
                }
                return await runner.run(wakePrompt, {
                  hidden: true,
                  isSilenceAllowed: true,
                  automationWake: {
                    id: automation.id,
                    name: automation.name,
                    ...untrustedWhenCarryingEventContent,
                    ...wakeEmail === void 0 ? {} : { email: wakeEmail }
                  },
                  requestSource: "automation",
                  onRequestId: captureRequestId,
                  onPersistableRunStarted,
                  transientStreamRetry: {
                    onRetry: (info2) => {
                      this.tm.hostLog(
                        `[sand:automation] transient stream reset on "${automation.name}" (${automation.id}); retrying (attempt ${info2.attempt}) after ${info2.delayMs}ms: ` + errorMessage(info2.error),
                        "info"
                      );
                    }
                  }
                });
              })();
              sentMessageCount = result.sentMessageCount;
              const parentWake = result.automationParentWake?.trim();
              parentWakeRequested = shouldRunAsSubagent && parentWake !== void 0 && parentWake.length > 0;
              if (result.pausedForUpgrade) {
                this.finishAutomationRun(session, automation.id, runId, "error", {
                  ...requestId2 !== void 0 ? { requestId: requestId2 } : {},
                  detail: "Interrupted by a host update; resuming after restart."
                });
                this.tm.upgradeResume.markAgentResumePending(session, "automation", {
                  automationId: automation.id,
                  automationRunId: runId ?? void 0,
                  spendRequestId
                });
                telemetryOutcome = "interrupted";
              } else {
                const wasPreemptedByDm = this.tm.backgroundWakes.dmPreemptedWakeAgentIds.delete(
                  session.id
                );
                redriveAfterSupersede = result.aborted && wasPreemptedByDm && redriven !== true && !this.tm.sessions.isAgentGone(agentId);
                const rowAwaitsRedrive = redriveAfterSupersede && runUuid !== void 0;
                if (!rowAwaitsRedrive) {
                  let abortDetail;
                  if (result.aborted) {
                    abortDetail = redriveAfterSupersede ? "Interrupted by a new message; re-running." : "Interrupted before it finished.";
                  }
                  this.finishAutomationRun(
                    session,
                    automation.id,
                    runId,
                    result.aborted ? "error" : "ok",
                    {
                      ...requestId2 !== void 0 ? { requestId: requestId2 } : {},
                      ...abortDetail !== void 0 ? { detail: abortDetail } : {}
                    }
                  );
                }
                telemetryOutcome = result.aborted ? "interrupted" : "ok";
              }
            }
            await this.tm.roster.emitAgentUpdate(session.id);
            this.tm.automationRuntime.emitAutomations(session);
          } catch (error42) {
            this.tm.telemetry.reportAgentError({
              source: "automation",
              conversationId: session.id,
              requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
              error: classifyAgentError(error42),
              detail: sandErrorDetail(error42)
            });
            const description9 = describeAgentRunError(error42);
            const runDetail = description9.detail ?? description9.errorParams?.technicalDetail;
            this.finishAutomationRun(session, automation.id, runId, "error", {
              ...requestId2 !== void 0 ? { requestId: requestId2 } : {},
              ...runDetail !== void 0 ? { detail: runDetail } : {},
              ...description9.errorKind !== void 0 ? { errorKind: description9.errorKind } : {}
            });
            this.tm.automationRuntime.emitAutomations(session);
            this.notifyAutomationFailure(session, automation, trigger2, description9);
            telemetryOutcome = "error";
          } finally {
            if (telemetryOutcome === "ok") {
              this.clearAutomationFailureState(session.id, automation.id);
            }
            this.tm.runLifecycle.endSessionRun(session);
            if (this.tm.runLifecycle.persistedSpendRequestIds.get(session.id) === spendRequestId) {
              this.tm.runLifecycle.persistedSpendRequestIds.delete(session.id);
            }
            this.tm.telemetry.reportAutomationRun({
              conversationId: session.id,
              automationId: stableAutomationId({
                agentId: session.id,
                localId: automation.id
              }),
              trigger: trigger2,
              outcome: telemetryOutcome,
              isGroup,
              runAsSubagent: shouldRunAsSubagent,
              parentWakeRequested,
              durationMs: Date.now() - firedAt,
              scheduledForMs,
              latenessMs: scheduledForMs != null ? Math.max(0, firedAt - scheduledForMs) : void 0,
              sentMessageCount,
              ...isEventFire ? { eventBatchSize: eventBatch.length } : {}
            });
            await this.tm.automationRuntime.enqueueAutomationLifecycleMutation({
              agentId: session.id,
              mutation: () => {
                if (this.tm.sessions.activeSession?.id === session.id) {
                  this.tm.automationRuntime.recordAutomationChangeEvents(session, "agent");
                } else {
                  this.tm.automationRuntime.recordInactiveAutomationChanges({
                    agentId: session.id,
                    before: automationsBeforeRun,
                    after: session.automations.listDefinitions(),
                    source: "agent"
                  });
                }
              }
            });
            runOutcome = telemetryOutcome;
          }
        },
        { lane: "background", source: "automation" }
      );
    } finally {
      if (!isEventFire) {
        this.inFlightAutomationKeys.delete(runKey);
      }
    }
    if (redriveAfterSupersede) {
      return await this.fireAutomation({
        agentId,
        automation,
        trigger: trigger2,
        ...events !== void 0 ? { events } : {},
        ...runUuid !== void 0 ? { runUuid } : {},
        ...coalescedRunUuids !== void 0 ? { coalescedRunUuids } : {},
        ...scheduledForMs !== void 0 ? { scheduledForMs } : {},
        ...runAsSubagent !== void 0 ? { runAsSubagent } : {},
        redriven: true
      });
    }
    return runOutcome;
  }
  reasonFireWentStaleInQueue(session, automationId, trigger2) {
    if (trigger2 === "manual") return void 0;
    const live = session.automations.get(automationId);
    if (live == null) return "automation_missing";
    return live.isEnabled ? void 0 : "automation_disabled";
  }
  notifyAutomationFailure(session, automation, trigger2, description9) {
    if (isBackgroundAutomationTrigger(trigger2)) return;
    const failureBucket = description9.errorKind === "backend_message" || description9.errorKind === "unknown_failure" ? failureBucketFromDetail(description9.detail ?? description9.errorParams?.technicalDetail) : description9.errorKind;
    const key = `${session.id}:${automation.id}:${failureBucket}`;
    const occurrence = (this.automationFailureOccurrences.get(key) ?? 0) + 1;
    this.automationFailureOccurrences.set(key, occurrence);
    if (!shouldNotifyAutomationFailure(occurrence)) return;
    this.tm.trayErrors.pushError({
      agentId: session.id,
      ...hostTrayTitle({ kind: "automation_failed", name: automation.name }),
      errorKind: description9.errorKind,
      ...description9.detail != null ? { detail: description9.detail } : {},
      ...description9.errorParams != null ? { errorParams: description9.errorParams } : {},
      ...description9.rawDetail != null ? { rawDetail: description9.rawDetail } : {},
      ...description9.actions != null ? { actions: description9.actions } : {},
      dedupeKey: `automation-failure:${session.id}:${automation.id}:${failureBucket}`,
      count: occurrence
    });
  }
  clearAutomationFailureState(agentId, automationId) {
    const prefix = `${agentId}:${automationId}:`;
    for (const key of this.automationFailureOccurrences.keys()) {
      if (key.startsWith(prefix)) this.automationFailureOccurrences.delete(key);
    }
  }
  recordAutomationRun(session, automationId) {
    try {
      session.automations.recordRunDefinition(automationId);
    } catch {
    }
  }
  beginAutomationRun({
    session,
    automationId,
    trigger: trigger2,
    eventSummary,
    runUuid,
    coalescedRunUuids
  }) {
    try {
      return session.automations.beginRun({
        id: automationId,
        trigger: trigger2,
        ...eventSummary !== void 0 ? { event: eventSummary } : {},
        ...runUuid !== void 0 ? { runId: runUuid } : {},
        ...coalescedRunUuids !== void 0 ? { coalescedRunIds: coalescedRunUuids } : {}
      }) ?? null;
    } catch {
      return null;
    }
  }
  finishAutomationRun(session, automationId, runId, status, options2 = {}) {
    if (runId == null) return;
    try {
      session.automations.finishRunDefinition({
        id: automationId,
        runId,
        status,
        ...options2.requestId !== void 0 ? { requestId: options2.requestId } : {},
        ...options2.detail !== void 0 ? { detail: options2.detail } : {},
        ...options2.errorKind !== void 0 ? { errorKind: options2.errorKind } : {}
      });
    } catch {
    }
  }
};
