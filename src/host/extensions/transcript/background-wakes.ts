function distinctChannelAddresses(envelopes) {
  const seen = /* @__PURE__ */ new Set();
  for (const envelope of envelopes) {
    seen.add(formatChannelAddress(envelope.address));
  }
  return [...seen];
}
var BackgroundWakes = class {
  constructor(tm) {
    this.tm = tm;
    this.completionRevivals = new CompletionRevivals(tm);
    this.agentToAgent = new AgentToAgentMessaging(tm);
    this.pendingSubagentCompletions = this.completionRevivals.pendingSubagentCompletions;
    this.revivingSubagentAgentIds = this.completionRevivals.revivingSubagentAgentIds;
    this.pendingShellCompletions = this.completionRevivals.pendingShellCompletions;
    this.revivingShellAgentIds = this.completionRevivals.revivingShellAgentIds;
    this.pendingAgentInbound = this.agentToAgent.pendingAgentInbound;
  }
  tm;
  pendingInbound = /* @__PURE__ */ new Map();
  revivingInboundAgentIds = /* @__PURE__ */ new Set();
  pendingChannelFailures = /* @__PURE__ */ new Map();
  revivingChannelFailureAgentIds = /* @__PURE__ */ new Set();
  pendingEventWakes = /* @__PURE__ */ new Map();
  revivingEventAgentIds = /* @__PURE__ */ new Set();
  dmPreemptedWakeAgentIds = /* @__PURE__ */ new Set();
  completionRevivals;
  agentToAgent;
  pendingSubagentCompletions;
  revivingSubagentAgentIds;
  pendingShellCompletions;
  revivingShellAgentIds;
  pendingAgentInbound;
  handleBackgroundSubagentCompletion(...args) {
    return this.completionRevivals.handleBackgroundSubagentCompletion(...args);
  }
  handleBackgroundShellCompletion(...args) {
    this.completionRevivals.handleBackgroundShellCompletion(...args);
  }
  reviveForSubagentCompletions(agentId) {
    return this.completionRevivals.reviveForSubagentCompletions(agentId);
  }
  reviveForShellCompletions(agentId) {
    return this.completionRevivals.reviveForShellCompletions(agentId);
  }
  sendToAgent(...args) {
    return this.agentToAgent.sendToAgent(...args);
  }
  sendToRemotePeer(...args) {
    return this.agentToAgent.sendToRemotePeer(...args);
  }
  receivePeerAgentMessage(...args) {
    return this.agentToAgent.receiveFromPeer(...args);
  }
  appendAgentOutboundEntry(...args) {
    this.agentToAgent.appendAgentOutboundEntry(...args);
  }
  appendAgentInboundEntry(...args) {
    return this.agentToAgent.appendAgentInboundEntry(...args);
  }
  deliverToChannel(runSession, message, addressToken) {
    const agentId = runSession?.id ?? this.tm.sessions.activeSession?.id;
    if (agentId == null) return null;
    const outbound = buildChannelOutboundMessage(message);
    const requestSource = this.tm.turnRuntime.activeRequestSources.get(agentId) ?? "connector";
    if (VoiceCallChannel.callIdOf(addressToken) !== null) {
      const refusal = outbound?.kind === "text" ? this.tm.voiceCalls.speak({ agentId, address: addressToken, text: outbound.text }) : "not-spoken";
      if (refusal !== null) {
        this.queueChannelDeliveryFailure(agentId, {
          addressToken,
          requestSource,
          reason: VoiceCallChannelSends.reason(refusal, {
            address: addressToken,
            sendTool: SAND_SEND_TO_USER_TOOL_NAME
          })
        });
      }
      return refusal;
    }
    if (outbound == null) return null;
    void this.tm.channelDelivery(agentId, addressToken, outbound).catch((error41) => {
      const rawDetail = error41 instanceof Error ? error41.message : "Channel delivery failed";
      const reason = humanizeChannelDeliveryFailure({ addressToken, rawMessage: rawDetail });
      const copy = classifyChannelDeliveryFailure({ addressToken, rawMessage: rawDetail });
      this.tm.trayErrors.pushError({
        agentId,
        ...hostTrayTitle({ kind: "message_not_delivered" }),
        errorKind: copy.kind,
        errorParams: copy.params,
        rawDetail,
        dedupeKey: `channel-delivery-failed:${agentId}:${addressToken}`
      });
      this.queueChannelDeliveryFailure(agentId, { addressToken, requestSource, reason });
    });
    return null;
  }
  queueChannelDeliveryFailure(agentId, failure2) {
    if (!this.tm.pendingWakes.enqueuePendingWake(this.pendingChannelFailures, agentId, [failure2])) {
      return;
    }
    void this.reviveForChannelFailures(agentId);
  }
  async reviveForChannelFailures(agentId) {
    if (!this.tm.execution.canExecute) return;
    if (this.revivingChannelFailureAgentIds.has(agentId)) return;
    this.revivingChannelFailureAgentIds.add(agentId);
    try {
      while ((this.pendingChannelFailures.get(agentId)?.length ?? 0) > 0) {
        const failures = this.pendingChannelFailures.get(agentId) ?? [];
        this.pendingChannelFailures.delete(agentId);
        const handled = await this.runChannelFailureWake(agentId, failures);
        if (!handled) {
          const queuedSince = this.pendingChannelFailures.get(agentId) ?? [];
          this.pendingChannelFailures.set(agentId, [...failures, ...queuedSince]);
          break;
        }
      }
    } finally {
      this.revivingChannelFailureAgentIds.delete(agentId);
    }
  }
  async runChannelFailureWake(agentId, failures) {
    if (failures.length === 0) return true;
    if (!this.tm.execution.canExecute) return false;
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch (error41) {
      if (error41 instanceof AgentGoneError) return true;
      this.tm.telemetry.reportAgentError({
        source: "channel_failure",
        conversationId: agentId,
        error: classifyAgentError(error41),
        detail: sandErrorDetail(error41)
      });
      return false;
    }
    if (this.tm.groupChat.isGroupSession(session)) return true;
    const requestSource = this.failureWakeSource(failures);
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    await this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestPrompts.delete(session.id);
        this.tm.turnRuntime.activeRequestSources.set(session.id, requestSource);
        try {
          await runner.run(buildChannelDeliveryFailureWakePrompt(failures), {
            hidden: true,
            requestSource,
            ...this.tm.widgetResponses.collectUnansweredQuestionPrompts(session)
          });
          await this.tm.roster.emitAgentUpdate(session.id);
        } catch (error41) {
          this.tm.telemetry.reportAgentError({
            source: "channel_failure",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error41),
            detail: sandErrorDetail(error41)
          });
          const description10 = describeAgentRunError(error41);
          this.tm.trayErrors.pushError({
            agentId: session.id,
            ...description10,
            ...hostTrayTitle({ kind: "delivery_failure_follow_up_failed", description: description10 })
          });
        } finally {
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "background", source: "channel-failure" }
    );
    return true;
  }
  failureWakeSource(failures) {
    const [first, ...rest] = new Set(failures.map((failure2) => failure2.requestSource));
    if (first === void 0) return "connector";
    if (rest.length === 0) return first;
    return failures.every((failure2) => VoiceCallChannel.isOwnerStarted(failure2.requestSource)) ? "turn" : "connector";
  }
  wakeForInbound(agentId, envelope, ...rest) {
    if (!this.tm.pendingWakes.enqueuePendingWake(this.pendingInbound, agentId, [envelope, ...rest])) {
      return false;
    }
    void this.reviveForInbound(agentId);
    return true;
  }
  async reviveForInbound(agentId) {
    if (!this.tm.execution.canExecute) return;
    if (this.revivingInboundAgentIds.has(agentId)) return;
    this.revivingInboundAgentIds.add(agentId);
    try {
      while (this.tm.execution.canExecute && (this.pendingInbound.get(agentId)?.length ?? 0) > 0) {
        const { wake, kept } = this.nextInboundWake(this.pendingInbound.get(agentId) ?? []);
        if (kept.length > 0) {
          this.pendingInbound.set(agentId, kept);
        } else {
          this.pendingInbound.delete(agentId);
        }
        await this.runInboundWake(agentId, wake);
      }
    } finally {
      this.revivingInboundAgentIds.delete(agentId);
    }
  }
  nextInboundWake(queued) {
    const line = queued.map((envelope) => formatChannelAddress(envelope.address)).find((address) => VoiceCallChannel.callIdOf(address) !== null);
    if (line === void 0) {
      return { wake: { envelopes: queued, requestSource: "connector" }, kept: [] };
    }
    const onTheLine = (envelope) => formatChannelAddress(envelope.address) === line;
    return {
      wake: { envelopes: queued.filter(onTheLine), requestSource: "voice-call" },
      kept: queued.filter((envelope) => !onTheLine(envelope))
    };
  }
  lineStillOpenForTheAnswer(agentId, envelopes) {
    const address = voiceLineAwaitingAnAnswer(envelopes);
    if (address === null) return void 0;
    return this.tm.voiceCalls.lineIsOpen({ agentId, address }) ? address : void 0;
  }
  async runInboundWake(agentId, { envelopes, requestSource }) {
    if (envelopes.length === 0) return;
    if (!this.tm.execution.canExecute) return;
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch {
      return;
    }
    if (this.tm.groupChat.isGroupSession(session)) return;
    appendChannelInboundEntries(
      this.tm,
      session,
      envelopes.filter((envelope) => envelope.isDisplayed !== true).map((envelope) => ({
        channel: formatChannelAddress(envelope.address),
        text: envelope.text,
        timestampMs: envelope.timestampMs,
        sender: envelope.sender
      }))
    );
    const sourceAddresses = distinctChannelAddresses(envelopes);
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    await this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestPrompts.delete(session.id);
        this.tm.turnRuntime.activeRequestSources.set(session.id, requestSource);
        this.tm.turnRuntime.activeChannelAddresses.set(session.id, sourceAddresses);
        this.dmPreemptedWakeAgentIds.delete(session.id);
        try {
          this.notifyChannelActivity(session.id, sourceAddresses, true);
          const unansweredPrompts = this.tm.widgetResponses.collectUnansweredQuestionPrompts(session);
          const result = await runner.run(buildChannelInboundWakePrompt(envelopes), {
            hidden: true,
            requestSource,
            ...unansweredPrompts,
            selectedImages: collectInboundImages(envelopes)
          });
          const wasPreemptedByDm = this.dmPreemptedWakeAgentIds.delete(session.id);
          if (result.aborted && result.pausedForUpgrade !== true) {
            if (!wasPreemptedByDm) return;
            if (this.tm.sessions.isAgentGone(agentId)) return;
            const redrivable = envelopes.filter((envelope) => envelope.isRedriven !== true).map((envelope) => ({
              ...envelope,
              isDisplayed: true,
              isRedriven: true
            }));
            if (redrivable.length === 0) return;
            const queued = this.pendingInbound.get(agentId) ?? [];
            this.pendingInbound.set(agentId, [...redrivable, ...queued]);
            return;
          }
          if (!result.aborted && result.sentMessageCount === 0) {
            if (isVoiceCallCloseOnlyWake(envelopes)) {
              await runner.run(
                MainLoopVoicePrompt.callEndedNudge({
                  sendTool: SAND_SEND_TO_USER_TOOL_NAME
                }),
                { hidden: true }
              );
            } else {
              await this.tm.automationRuntime.ensureHiddenTurnReply(
                runner,
                this.lineStillOpenForTheAnswer(session.id, envelopes)
              );
            }
          }
          await this.tm.roster.emitAgentUpdate(session.id);
        } catch (error41) {
          this.tm.telemetry.reportAgentError({
            source: "connector",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error41),
            detail: sandErrorDetail(error41)
          });
          const description10 = describeAgentRunError(error41);
          this.tm.trayErrors.pushError({
            agentId: session.id,
            ...description10,
            ...hostTrayTitle({ kind: "channel_message_follow_up_failed", description: description10 })
          });
        } finally {
          this.tm.turnRuntime.activeChannelAddresses.delete(session.id);
          this.notifyChannelActivity(session.id, sourceAddresses, false);
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "background", source: "connector" }
    );
  }
  notifyChannelActivity(agentId, addressTokens, isActive) {
    if (this.tm.channelActivity == null) return;
    for (const addressToken of addressTokens) {
      this.tm.channelActivity(agentId, addressToken, isActive);
    }
  }
  async broadcastToAgents(targets, message) {
    const text2 = clampAgentMessage(message);
    if (text2.length === 0 || !this.tm.execution.canExecute) {
      return { total: 0, scheduled: 0 };
    }
    const ids = targets === "all" ? await this.tm.sessionStore.listAgentIds() : [...new Set(targets)];
    let scheduled = 0;
    for (const id of ids) {
      if (await this.scheduleBroadcast(id, text2)) scheduled++;
    }
    return { total: ids.length, scheduled };
  }
  async scheduleBroadcast(agentId, message) {
    if (this.tm.sessions.isAgentGone(agentId)) return false;
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch (error41) {
      if (!isAgentAbsent(error41)) {
        this.tm.telemetry.reportAgentError({
          source: "broadcast",
          conversationId: agentId,
          error: classifyAgentError(error41),
          detail: sandErrorDetail(error41)
        });
      }
      return false;
    }
    if (this.tm.groupChat.isGroupSession(session)) return false;
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    void this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestPrompts.delete(session.id);
        this.tm.turnRuntime.activeRequestSources.set(session.id, "broadcast");
        try {
          const result = await runner.run(buildAdminBroadcastWakePrompt(message), {
            hidden: true
          });
          if (!result.aborted && result.sentMessageCount === 0) {
            await this.tm.automationRuntime.ensureHiddenTurnReply(runner);
          }
          await this.tm.roster.emitAgentUpdate(session.id);
        } catch (error41) {
          this.tm.telemetry.reportAgentError({
            source: "broadcast",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error41),
            detail: sandErrorDetail(error41)
          });
          const description10 = describeAgentRunError(error41);
          this.tm.trayErrors.pushError({
            agentId: session.id,
            ...description10,
            ...hostTrayTitle({ kind: "broadcast_message_failed", description: description10 })
          });
        } finally {
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "background", source: "broadcast" }
    );
    return true;
  }
  emitTimelineEvent(agentId, event) {
    if (this.tm.sessions.isAgentGone(agentId)) return;
    void this.recordTimelineEvent(agentId, event);
  }
  async recordTimelineEvent(agentId, event) {
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch {
      return;
    }
    if (this.tm.groupChat.isGroupSession(session)) return;
    this.appendTimelineEventEntry(session, event);
    if (this.tm.runLifecycle.runningAgentIds().has(agentId)) return;
    this.queueEventWake(agentId, event);
  }
  appendTimelineEventEntry(session, event) {
    const entry = {
      kind: "event",
      id: `event-${crypto.randomUUID()}`,
      event,
      timestampMs: Date.now()
    };
    if (session.id === this.tm.sessions.activeSession?.id) {
      this.tm.appendEntry(entry);
    } else {
      session.db.appendTranscriptEntry(entry);
    }
  }
  queueEventWake(agentId, event) {
    if (!this.tm.pendingWakes.enqueuePendingWake(this.pendingEventWakes, agentId, [event])) {
      return;
    }
    void this.reviveForEvents(agentId);
  }
  async reviveForEvents(agentId) {
    if (!this.tm.execution.canExecute) return;
    if (this.revivingEventAgentIds.has(agentId)) return;
    this.revivingEventAgentIds.add(agentId);
    try {
      while ((this.pendingEventWakes.get(agentId)?.length ?? 0) > 0) {
        const events = this.pendingEventWakes.get(agentId) ?? [];
        this.pendingEventWakes.delete(agentId);
        try {
          await this.runEventWake(agentId, events);
        } catch (error41) {
          this.tm.hostLog(
            `[transcript-manager] event wake revival failed for ${agentId}: ${errorLogTag(error41)}`,
            "error"
          );
        }
      }
    } finally {
      this.revivingEventAgentIds.delete(agentId);
    }
  }
  async runEventWake(agentId, events) {
    if (events.length === 0) return;
    if (!this.tm.execution.canExecute) return;
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch {
      return;
    }
    if (this.tm.groupChat.isGroupSession(session)) return;
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    await this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestPrompts.delete(session.id);
        this.tm.turnRuntime.activeRequestSources.set(session.id, "event");
        try {
          await runner.run(buildTimelineEventWakePrompt(events), {
            hidden: true,
            isSilenceAllowed: true
          });
          await this.tm.roster.emitAgentUpdate(session.id);
        } catch (error41) {
          this.tm.telemetry.reportAgentError({
            source: "event",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error41),
            detail: sandErrorDetail(error41)
          });
          const description10 = describeAgentRunError(error41);
          this.tm.trayErrors.pushError({
            agentId: session.id,
            ...description10,
            ...hostTrayTitle({ kind: "timeline_event_follow_up_failed", description: description10 })
          });
        } finally {
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "background", source: "event" }
    );
  }
  hasRunningBackgroundShellWork() {
    for (const runner of this.tm.runnerRegistry.runners.values()) {
      if (runner.hasRunningBackgroundShellWork()) return true;
    }
    return false;
  }
};
