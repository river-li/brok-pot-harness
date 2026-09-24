/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/ack-obligations.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto72 = require("node:crypto");

// @recovered-fragment 2/2
var MAX_ACK_REDRIVES = 3;
var ACK_REDRIVE_IDLE_DELAY_MS = 5e3;
function buildAckRedrivePrompt() {
  return "[System recovery] The user sent one or more messages that were never visibly acknowledged \u2014 the turns handling them were interrupted, or the app restarted before a reply went out. Their newest message may be MISSING from your context entirely. Respond now by actually invoking the SendMessage tool: if you can see their latest message and already completed what it asked, send a brief confirmation with the result; if you can see it but the work is not done, acknowledge them and continue the work; if you cannot be certain what they last asked, say you may have missed their latest message and ask them to resend it \u2014 NEVER guess or claim completion of work you cannot see. Plain assistant text is NEVER shown to the user; only a real SendMessage tool invocation reaches them. Do NOT end this turn with only thinking, an empty reply, or a plan to send later \u2014 ending the turn without a real SendMessage invocation delivers nothing and is a failure. Invoke SendMessage now, even if all you can send is a brief status update.";
}
var AckObligations = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  ackRedriveTimers = /* @__PURE__ */ new Map();
  ackRunTokens = /* @__PURE__ */ new Map();
  ackRedriveRecoveryIds = /* @__PURE__ */ new Map();
  recordAckObligationSend(session, acceptedAtMs) {
    const store = this.tm.ackObligationStore;
    if (store == null || this.tm.runLifecycle.runScheduler == null) return;
    this.clearAckRedriveTimer(session.id);
    const { obligation, created } = store.recordSend(session.id, {
      atMs: acceptedAtMs
    });
    this.tm.telemetry.reportAckObligation({
      conversationId: session.id,
      outcome: created ? "created" : "coalesced",
      ageMs: acceptedAtMs - obligation.createdAtMs,
      coalescedCount: obligation.coalescedCount
    });
  }
  armSendGuard(session, acceptedAtMs, owesAck) {
    let armed = owesAck;
    return {
      disarm: () => {
        armed = false;
      },
      [Symbol.dispose]: () => {
        if (!armed) return;
        const store = this.tm.ackObligationStore;
        if (store == null || this.tm.runLifecycle.runScheduler == null) return;
        if (store.get(session.id) == null) {
          this.recordAckObligationSend(session, acceptedAtMs);
        }
      }
    };
  }
  confirmAckObligationAfterInterrupt(session, acceptedAtMs, interrupted) {
    const store = this.tm.ackObligationStore;
    if (store == null || this.tm.runLifecycle.runScheduler == null) return;
    this.clearAckRedriveTimer(session.id);
    if (store.get(session.id) == null) {
      this.recordAckObligationSend(session, acceptedAtMs);
    }
    if (interrupted) store.recordInterrupt(session.id, acceptedAtMs);
  }
  mintAckRunToken(agentId) {
    if (this.tm.ackObligationStore == null || this.tm.runLifecycle.runScheduler == null) {
      return void 0;
    }
    const token = (0, import_node_crypto72.randomUUID)();
    const tokens = this.ackRunTokens.get(agentId) ?? /* @__PURE__ */ new Set();
    tokens.add(token);
    this.ackRunTokens.set(agentId, tokens);
    return token;
  }
  retireAckRunToken(agentId, token) {
    if (token == null) return;
    const tokens = this.ackRunTokens.get(agentId);
    if (tokens == null) return;
    tokens.delete(token);
    if (tokens.size === 0) this.ackRunTokens.delete(agentId);
  }
  fulfillAckObligation(agentId, ackToken) {
    if (agentId == null || ackToken == null) return;
    const store = this.tm.ackObligationStore;
    if (store == null || this.tm.runLifecycle.runScheduler == null) return;
    if (this.ackRunTokens.get(agentId)?.has(ackToken) !== true) return;
    const obligation = store.get(agentId);
    if (obligation == null) return;
    const recoveryIds = [
      ...(this.tm.turnRuntime.activeTurnRecoveryIds.get(agentId) ?? []),
      ...(this.ackRedriveRecoveryIds.get(agentId) ?? [])
    ];
    this.tm.interruptedUserTurnStore?.markVisibleAck(agentId, recoveryIds);
    store.clear(agentId);
    this.clearAckRedriveTimer(agentId);
    const now = Date.now();
    this.tm.telemetry.reportAckObligation({
      conversationId: agentId,
      outcome: "fulfilled",
      ageMs: now - obligation.createdAtMs,
      coalescedCount: obligation.coalescedCount,
      redriveAttempts: obligation.redriveAttempts,
      timeToFirstVisibleAckMs: now - obligation.createdAtMs,
      ...obligation.lastInterruptAtMs != null ? { interruptToReplacementAckMs: now - obligation.lastInterruptAtMs } : {}
    });
  }
  markAckObligationLost(agentId, reason) {
    const store = this.tm.ackObligationStore;
    if (store == null || this.tm.runLifecycle.runScheduler == null) return;
    const obligation = store.get(agentId);
    if (obligation == null) return;
    store.clear(agentId);
    this.clearAckRedriveTimer(agentId);
    this.tm.telemetry.reportAckObligation({
      conversationId: agentId,
      outcome: "lost",
      reason,
      ageMs: Date.now() - obligation.createdAtMs,
      coalescedCount: obligation.coalescedCount,
      redriveAttempts: obligation.redriveAttempts
    });
  }
  clearAckRedriveTimer(agentId) {
    const armed = this.ackRedriveTimers.get(agentId);
    if (armed == null) return;
    armed.dispose();
    this.ackRedriveTimers.delete(agentId);
  }
  scheduleAckRedriveAfterIdle(agentId) {
    this.armAckRedriveTimer(agentId, "idle");
  }
  armAckRedriveTimer(agentId, trigger2) {
    const store = this.tm.ackObligationStore;
    if (store == null || this.tm.runLifecycle.runScheduler == null) return;
    if (this.tm.disposed || this.tm.upgradeResume.pausingForUpgrade || !this.tm.execution.isLocalWorkAllowed) {
      return;
    }
    if (store.get(agentId) == null) return;
    this.clearAckRedriveTimer(agentId);
    this.ackRedriveTimers.set(
      agentId,
      this.tm.ackRedrivePolicy.arm(agentId, () => {
        this.ackRedriveTimers.delete(agentId);
        void this.redriveAckObligation(agentId, trigger2);
      })
    );
  }
  async redriveUnfulfilledAckObligations() {
    const store = this.tm.ackObligationStore;
    if (store == null || this.tm.runLifecycle.runScheduler == null) return;
    if (!this.tm.execution.canExecute || !this.tm.execution.isLocalWorkAllowed) return;
    for (const obligation of store.list()) {
      this.armAckRedriveTimer(obligation.agentId, "boot");
    }
  }
  async redriveAckObligation(agentId, trigger2) {
    const store = this.tm.ackObligationStore;
    if (store == null || this.tm.runLifecycle.runScheduler == null) return;
    if (!this.tm.execution.canExecute || !this.tm.execution.isLocalWorkAllowed) return;
    if (this.tm.disposed || this.tm.upgradeResume.pausingForUpgrade) return;
    const obligation = store.get(agentId);
    if (obligation == null) return;
    if (this.tm.sessions.isAgentGone(agentId)) {
      this.markAckObligationLost(agentId, "agent_deleted");
      return;
    }
    if (obligation.redriveAttempts >= MAX_ACK_REDRIVES) {
      this.markAckObligationLost(agentId, "max_redrives");
      return;
    }
    const bumped = store.recordRedriveAttempt(agentId);
    if (bumped == null) return;
    this.tm.telemetry.reportAckObligation({
      conversationId: agentId,
      outcome: "redrive",
      reason: trigger2,
      ageMs: Date.now() - bumped.createdAtMs,
      coalescedCount: bumped.coalescedCount,
      redriveAttempts: bumped.redriveAttempts
    });
    let session;
    try {
      session = await this.tm.sessions.resolveBackgroundSession(agentId);
    } catch {
      this.scheduleAckRedriveAfterIdle(agentId);
      return;
    }
    if (this.tm.groupChat.isGroupSession(session)) {
      store.clear(agentId);
      return;
    }
    const runner = this.tm.runnerRegistry.getRunner(session);
    this.tm.runLifecycle.beginSessionRun(session);
    const ackToken = this.mintAckRunToken(session.id);
    await this.tm.runLifecycle.enqueueExclusiveRun(
      session.id,
      async () => {
        this.tm.turnRuntime.activeRequestPrompts.delete(session.id);
        this.tm.turnRuntime.activeRequestSources.set(session.id, "handoff-resume");
        try {
          if (store.get(agentId) == null) return;
          const redriveStartedAtMs = Date.now();
          const prompt = buildAckRedrivePrompt();
          const messageId = `ack-redrive-${(0, import_node_crypto72.randomUUID)()}`;
          const recentUserMessages = [
            ...session.db.getTranscriptEntries().filter(
              (entry) => entry.kind === "message" && entry.role === "user" && entry.fromAgent == null && entry.channel == null
            ).map((entry) => ({
              id: entry.id,
              text: entry.content,
              richText: entry.richText
            })),
            { id: messageId, text: prompt }
          ];
          const recoveryIds = this.tm.interruptedUserTurnStore?.listPending()
            .filter((entry) => entry.agentId === agentId && entry.visibleAck !== true && entry.acceptedAtMs === bumped.lastSendAtMs)
            .map((entry) => entry.userMessageId) ?? [];
          this.ackRedriveRecoveryIds.set(agentId, recoveryIds);
          const result = await runner.run(prompt, {
            hidden: true,
            ackToken,
            messageId,
            recentUserMessages,
            requestSource: "handoff-resume"
          });
          if (!result.aborted && result.pausedForUpgrade !== true && store.get(agentId) == null) {
            for (const userMessageId of recoveryIds) {
              this.tm.interruptedUserTurnStore?.clear(agentId, userMessageId);
            }
          }
          await this.tm.roster.emitAgentUpdate(session.id);
          if (isDeliveryOwed(result) && !result.aborted && result.pausedForUpgrade !== true) {
            this.tm.reportTurnEmptyDelivery({
              conversationId: session.id,
              requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
              source: "ack_redrive",
              requestSource: "handoff-resume",
              redriveAttempts: bumped.redriveAttempts,
              toolCallCount: runner.getObservedToolCallCount(),
              streamOutputProduced: result.streamOutputProduced === true,
              durationMs: Date.now() - redriveStartedAtMs,
              ackOutstanding: store.get(agentId) != null
            });
          }
        } catch (error42) {
          this.tm.telemetry.reportAgentError({
            source: "ack_redrive",
            conversationId: session.id,
            requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
            error: classifyAgentError(error42),
            detail: sandErrorDetail(error42)
          });
        } finally {
          this.ackRedriveRecoveryIds.delete(agentId);
          try {
            await this.tm.publishInterruptedUserTurnNotices();
          } catch (error42) {
            this.tm.hostLog(`[sand] failed to publish interrupted-request notice after ack recovery: ${String(error42)}`, "warn");
          }
          this.retireAckRunToken(session.id, ackToken);
          this.tm.runLifecycle.endSessionRun(session);
        }
      },
      { lane: "background", source: "ack-redrive", ackToken }
    );
  }
};

