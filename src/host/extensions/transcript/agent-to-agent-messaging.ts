var import_node_crypto73 = require("node:crypto");
function partitionAgentInbound(messages2) {
  const priority = [];
  const rest = [];
  for (const message of messages2) {
    if (message.priority === true) priority.push(message);
    else rest.push(message);
  }
  return { priority, rest };
}
function prioritizeAgentInbound(messages2) {
  const parts = partitionAgentInbound(messages2);
  return [...parts.priority, ...parts.rest];
}
function mergeAgentInboundQueue(queued, deferred) {
  const newer = partitionAgentInbound(queued);
  const older = partitionAgentInbound(deferred);
  return [...older.priority, ...newer.priority, ...older.rest, ...newer.rest];
}
function cloudAgentExchangeRound(entries, bcId) {
  return entries.filter(
    (entry) => entry.kind === "message" && entry.toAgent?.kind === "cloud-agent" && entry.toAgent.id === bcId
  ).length;
}
function cloudAgentInboundEntryId(entries, bcId, report) {
  const digest = (0, import_node_crypto73.createHash)("sha256").update(`${bcId}
${cloudAgentExchangeRound(entries, bcId)}
${report}`).digest("hex").slice(0, 16);
  return `agent-inbound-${digest}`;
}
var PEER_MESSAGE_ID_LEDGER_CAP = 512;
var AGENT_INBOUND_REDRIVE_LIMIT = 3;
var AgentToAgentMessaging = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  pendingAgentInbound = /* @__PURE__ */ new Map();
  revivingAgentInboundIds = /* @__PURE__ */ new Set();
  inboundHoldReleases = /* @__PURE__ */ new Map();
  receivedPeerMessageIds = /* @__PURE__ */ new Set();
  async sendToAgent(fromAgentId, toAgentId, text2, images = [], priority = false) {
    const message = clampAgentMessage(text2);
    if (message.length === 0) return "Message was empty; nothing was sent.";
    if (toAgentId === fromAgentId) {
      return "An agent can't message itself.";
    }
    if (this.tm.sessions.isAgentGone(toAgentId)) {
      return "That agent no longer exists.";
    }
    const roster = await this.tm.sessionStore.listAgents();
    const target = roster.find((agent) => agent.id === toAgentId);
    if (target == null) {
      return `No agent found with id ${toAgentId}.`;
    }
    if (target.isGroup) {
      const ack = await this.tm.postToGroup(fromAgentId, toAgentId, message, priority);
      const notes = [];
      if (images.length > 0) {
        notes.push(
          `Note: the attached image${images.length === 1 ? " was" : "s were"} NOT delivered \u2014 group messages are text-only for now; send images to an agent directly.`
        );
      }
      if (priority) {
        notes.push("Note: priority is 1:1 only \u2014 this post did not interrupt members.");
      }
      return notes.length === 0 ? ack : `${ack} ${notes.join(" ")}`;
    }
    this.tm.productAnalytics.trackEvent("sand.agent_message.sent", {
      from_agent_id: fromAgentId,
      to_agent_id: toAgentId,
      is_group_target: false,
      is_priority: priority
    });
    const sender = roster.find((agent) => agent.id === fromAgentId);
    const from2 = {
      id: fromAgentId,
      name: sender?.name ?? "A Bot"
    };
    this.appendAgentOutboundEntry(
      fromAgentId,
      { id: toAgentId, name: target.name, kind: "agent" },
      message,
      Date.now(),
      { images }
    );
    this.queueInboundAndWake(toAgentId, {
      from: from2,
      text: message,
      ...images.length > 0 ? { images } : {},
      timestampMs: Date.now(),
      ...priority ? { priority: true } : {}
    });
    return priority ? `Sent to ${target.name} as a priority message \u2014 it jumps their queue and interrupts any routine or background work they are running; if they are mid-conversation with the user or handling another agent's message, it is delivered right after that. This is asynchronous \u2014 if they reply, it'll arrive later as a new message that wakes you; don't wait on it now.` : `Sent to ${target.name}. This is asynchronous \u2014 if they reply, it'll arrive later as a new message that wakes you; don't wait on it now.`;
  }
  async sendToRemotePeer(args) {
    const { fromAgentId, toAgentId, images = [], priority = false } = args;
    const message = clampAgentMessage(args.text);
    if (message.length === 0) return "Message was empty; nothing was sent.";
    if (toAgentId === fromAgentId) return "An agent can't message itself.";
    const result = await args.deliver({ fromAgentId, toAgentId, text: message });
    if (!result.delivered) return result.ack;
    const target = result.target ?? { id: toAgentId, name: `agent ${toAgentId}` };
    this.tm.productAnalytics.trackEvent("sand.agent_message.sent", {
      from_agent_id: fromAgentId,
      to_agent_id: toAgentId,
      is_group_target: false,
      is_priority: false
    });
    this.appendAgentOutboundEntry(
      fromAgentId,
      { id: toAgentId, name: target.name, kind: "agent" },
      message,
      Date.now(),
      { images }
    );
    const notes = [];
    if (images.length > 0) {
      notes.push(
        `Note: the attached image${images.length === 1 ? " was" : "s were"} NOT delivered \u2014 messages to agents running elsewhere are text-only for now.`
      );
    }
    if (priority) {
      notes.push(
        "Note: priority is not supported for agents running elsewhere \u2014 this was a normal send."
      );
    }
    return notes.length === 0 ? result.ack : `${result.ack} ${notes.join(" ")}`;
  }
  async receiveFromPeer(args) {
    const { from: from2, toAgentId, messageId } = args;
    const message = clampAgentMessage(args.text);
    if (message.length === 0) return "empty";
    if (this.tm.sessions.isAgentGone(toAgentId)) return "target_not_found";
    const roster = await this.tm.sessionStore.listAgents();
    const target = roster.find((agent) => agent.id === toAgentId);
    if (target == null) return "target_not_found";
    const ledgerKey = `${toAgentId}\0${messageId}`;
    if (messageId.length > 0 && this.receivedPeerMessageIds.has(ledgerKey)) return "delivered";
    if (target.isGroup) {
      const posted = await this.tm.groupChat.postToGroupWithStatus({
        fromAgentId: from2.id,
        groupId: toAgentId,
        text: message
      });
      switch (posted.status) {
        case "posted":
          this.rememberPeerMessageId(ledgerKey, messageId);
          return "delivered";
        case "empty":
          return "empty";
        case "not_found":
          return "target_not_found";
        case "not_member":
          return "not_member";
        case "unavailable":
          return "unavailable";
      }
    }
    this.rememberPeerMessageId(ledgerKey, messageId);
    this.queueInboundAndWake(toAgentId, { from: from2, text: message, timestampMs: Date.now() });
    return "delivered";
  }
  rememberPeerMessageId(ledgerKey, messageId) {
    if (messageId.length === 0) return;
    this.receivedPeerMessageIds.add(ledgerKey);
    if (this.receivedPeerMessageIds.size > PEER_MESSAGE_ID_LEDGER_CAP) {
      const oldest = this.receivedPeerMessageIds.values().next().value;
      if (oldest !== void 0) this.receivedPeerMessageIds.delete(oldest);
    }
  }
  queueInboundAndWake(toAgentId, inbound) {
    const queuedInbound = {
      ...inbound,
      queuedAtMs: Date.now(),
      arrivedWhileRunning: this.tm.runLifecycle.hasActiveRequest(toAgentId)
    };
    const queued = this.pendingAgentInbound.get(toAgentId) ?? [];
    if (inbound.priority === true) {
      const parts = partitionAgentInbound(queued);
      this.pendingAgentInbound.set(toAgentId, [...parts.priority, queuedInbound, ...parts.rest]);
      this.steerRecipientForPriorityPeer(toAgentId);
    } else {
      queued.push(queuedInbound);
      this.pendingAgentInbound.set(toAgentId, queued);
    }
    this.inboundHoldReleases.get(toAgentId)?.();
    void this.reviveForAgentInbound(toAgentId);
  }
  steerRecipientForPriorityPeer(agentId) {
    const scheduler = this.tm.runLifecycle.runScheduler;
    if (scheduler == null || scheduler.getActiveLane(agentId) !== "background") {
      return;
    }
    const reason = "superseded by a priority agent message";
    const wasInFlight = this.tm.runLifecycle.runningAgentIds().has(agentId);
    const hadActiveGroupMemberRun = this.tm.runnerRegistry.activeGroupMemberRunners.get(agentId)?.interrupt(reason) ?? false;
    if (hadActiveGroupMemberRun) {
      this.tm.groupChat.dmPreemptedGroupMemberIds.add(agentId);
    }
    const hadActive1v1Run = this.tm.runnerRegistry.runners.get(agentId)?.interrupt(reason) ?? false;
    if (hadActive1v1Run) {
      this.tm.backgroundWakes.dmPreemptedWakeAgentIds.add(agentId);
    }
    const hadActiveRun = hadActive1v1Run || hadActiveGroupMemberRun;
    if (!hadActiveRun && !wasInFlight) return;
    this.tm.telemetry.reportTurnInterrupt({
      conversationId: agentId,
      reason: "agent_steer",
      hadActiveRun,
      wasInFlight
    });
  }
  async reviveForAgentInbound(agentId) {
    if (!this.tm.execution.canExecute) return;
    if (this.revivingAgentInboundIds.has(agentId)) return;
    this.revivingAgentInboundIds.add(agentId);
    try {
      const hold = this.holdLoneInbound(agentId);
      if (hold != null) await hold;
      while (this.tm.execution.canExecute && (this.pendingAgentInbound.get(agentId)?.length ?? 0) > 0) {
        const messages2 = prioritizeAgentInbound(this.pendingAgentInbound.get(agentId) ?? []);
        this.pendingAgentInbound.delete(agentId);
        await this.runAgentInboundWake(agentId, messages2);
      }
    } finally {
      this.revivingAgentInboundIds.delete(agentId);
    }
  }
  holdLoneInbound(agentId) {
    const holdMs = this.tm.agentInboundCoalesceMs;
    if (holdMs <= 0 || (this.pendingAgentInbound.get(agentId)?.length ?? 0) !== 1 || this.tm.runLifecycle.hasActiveRequest(agentId)) {
      return void 0;
    }
    return new Promise((resolve29) => {
      let timer;
      const release = () => {
        timer?.dispose();
        this.inboundHoldReleases.delete(agentId);
        resolve29();
      };
      this.inboundHoldReleases.set(agentId, release);
      timer = this.tm.clock.schedule(holdMs, release);
    });
  }
  async runAgentInboundWake(agentId, messages2) {
    if (messages2.length === 0) return;
    if (!this.tm.execution.canExecute) return;
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch {
      return;
    }
    if (this.tm.groupChat.isGroupSession(session)) return;
    this.appendAgentInboundEntries(
      session,
      messages2.filter((message) => message.isDisplayed !== true)
    );
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    await this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        const batchStartedAtMs = Date.now();
        const oldestQueuedAtMs = Math.min(
          ...messages2.map((message) => message.queuedAtMs ?? batchStartedAtMs)
        );
        const batchTelemetry = {
          batchId: (0, import_node_crypto73.randomUUID)(),
          queueBatchSize: messages2.length,
          queueWaitMs: Math.max(0, batchStartedAtMs - oldestQueuedAtMs),
          messagesArrivedWhileRunning: messages2.filter(
            (message) => message.arrivedWhileRunning === true
          ).length,
          compactionEpoch: session.agentStore.getConversationStateStructure().summaryArchives.length
        };
        this.tm.turnRuntime.activeRequestPrompts.delete(session.id);
        this.tm.turnRuntime.activeRequestSources.set(session.id, "agent");
        this.tm.backgroundWakes.dmPreemptedWakeAgentIds.delete(session.id);
        try {
          const selectedImages = await loadAgentInboundImages(
            messages2.flatMap((message) => message.images ?? [])
          );
          this.tm.runLifecycle.beginAgentPeerBatch(session.id, batchTelemetry);
          const result = await (async () => {
            try {
              return await runner.run(
                buildAgentInboundBatchPrompt({
                  messages: messages2,
                  conservativeReplies: runner.gates.reducePeerChatter()
                }),
                {
                  hidden: true,
                  isSilenceAllowed: true,
                  requestSource: "agent",
                  ...selectedImages.length > 0 ? { selectedImages } : {}
                }
              );
            } finally {
              this.tm.runLifecycle.endAgentPeerBatch(session.id);
            }
          })();
          const wasPreemptedByDm = this.tm.backgroundWakes.dmPreemptedWakeAgentIds.delete(
            session.id
          );
          if (result.aborted && result.pausedForUpgrade !== true) {
            if (!wasPreemptedByDm) return;
            if (this.tm.sessions.isAgentGone(agentId)) return;
            const redrivable = messages2.filter((message) => (message.redriveCount ?? 0) < AGENT_INBOUND_REDRIVE_LIMIT).map((message) => ({
              ...message,
              isDisplayed: true,
              redriveCount: (message.redriveCount ?? 0) + 1
            }));
            if (redrivable.length < messages2.length) {
              this.tm.telemetry.reportPendingWake({
                conversationId: session.id,
                outcome: "dropped",
                kind: "agent-inbound",
                workId: batchTelemetry.batchId,
                ageMs: Date.now() - oldestQueuedAtMs,
                reason: "redrive_exhausted"
              });
            }
            if (redrivable.length === 0) return;
            const queued = this.pendingAgentInbound.get(agentId) ?? [];
            this.pendingAgentInbound.set(agentId, mergeAgentInboundQueue(queued, redrivable));
            return;
          }
          await this.tm.roster.emitAgentUpdate(session.id);
        } catch (error41) {
          this.tm.telemetry.reportAgentError({
            source: "agent",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error41),
            detail: sandErrorDetail(error41)
          });
          const description10 = describeAgentRunError(error41);
          this.tm.trayErrors.pushError({
            agentId: session.id,
            ...description10,
            ...hostTrayTitle({ kind: "agent_to_agent_message_failed", description: description10 })
          });
        } finally {
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "agent", source: "agent" }
    );
  }
  appendAgentInboundEntries(session, messages2) {
    const isActive = session.id === this.tm.sessions.activeSession?.id;
    let raisesUserActivity = false;
    for (const message of messages2) {
      const entries = isActive ? getTranscript() : session.db.getTranscriptEntries();
      const entry = {
        kind: "message",
        id: nextEntryId(entries, "user-message"),
        role: "user",
        content: message.text,
        isStreaming: false,
        timestampMs: message.timestampMs,
        fromAgent: message.from,
        ...message.images != null && message.images.length > 0 ? { images: message.images } : {}
      };
      raisesUserActivity ||= entryRaisesUserActivitySignal(entry);
      if (isActive) {
        this.tm.appendEntry(entry);
      } else {
        session.db.appendTranscriptEntry(entry);
      }
    }
    if (!isActive) {
      if (raisesUserActivity) this.tm.sessionStore.markSessionActivity(session);
      void this.tm.roster.emitAgentUpdate(session.id);
    }
  }
  async appendAgentInboundEntry(agentId, from2, text2, timestampMs2) {
    if (this.tm.sessions.isAgentGone(agentId)) return;
    const session = this.tm.sessions.liveSessions.get(agentId) ?? await this.tm.sessions.resolveBackgroundSession(agentId);
    const isActive = session.id === this.tm.sessions.activeSession?.id;
    const entries = isActive ? getTranscript() : session.db.getTranscriptEntries();
    const id = from2.kind === "cloud-agent" ? cloudAgentInboundEntryId(entries, from2.id, text2) : nextEntryId(entries, "user-message");
    if (entries.some((existing) => existing.id === id)) return;
    const entry = {
      kind: "message",
      id,
      role: "user",
      content: text2,
      isStreaming: false,
      timestampMs: timestampMs2,
      fromAgent: from2
    };
    if (isActive) {
      this.tm.appendEntry(entry);
    } else {
      session.db.appendTranscriptEntry(entry);
    }
    void this.tm.roster.emitAgentUpdate(session.id);
  }
  appendAgentOutboundEntry(fromAgentId, to3, text2, timestampMs2, media = {}) {
    const session = this.tm.sessions.liveSessions.get(fromAgentId);
    if (session == null) return;
    const isActive = session.id === this.tm.sessions.activeSession?.id;
    const entries = isActive ? getTranscript() : session.db.getTranscriptEntries();
    const { images = [], attachments = [] } = media;
    const entry = {
      kind: "message",
      id: nextEntryId(entries, "assistant-message"),
      role: "assistant",
      content: text2,
      isStreaming: false,
      timestampMs: timestampMs2,
      toAgent: to3,
      ...images.length > 0 ? { images } : {},
      ...attachments.length > 0 ? { attachments } : {}
    };
    if (isActive) {
      this.tm.appendEntry(entry);
    } else {
      session.db.appendTranscriptEntry(entry);
      if (entryRaisesUserActivitySignal(entry)) {
        this.tm.sessionStore.markSessionActivity(session);
      }
    }
    if (!isActive || isVisibleOutboundAgentPeerMessageEntry(entry)) {
      void this.tm.roster.emitAgentUpdate(session.id);
    }
  }
};
