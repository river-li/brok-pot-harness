init_errors();
var WidgetResponses = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  credentialExpiryTimers = /* @__PURE__ */ new Map();
  scheduleCredentialRequestExpiry(args) {
    const key = JSON.stringify([args.agentId, args.entryId]);
    this.credentialExpiryTimers.get(key)?.dispose();
    const timer = this.tm.clock.schedule(
      Math.max(0, args.expiresAtMs - this.tm.clock.now()),
      () => {
        this.credentialExpiryTimers.delete(key);
        void this.expireCredentialRequest({
          agentId: args.agentId,
          entryId: args.entryId
        }).catch((error42) => {
          reportHostDiagnostic({
            kind: "fallback_taken",
            stage: "transcript_manager",
            errorClass: errorLogTag(error42)
          });
        });
      }
    );
    this.credentialExpiryTimers.set(key, timer);
  }
  async restoreCredentialRequestExpiryTimers() {
    let agentIds;
    try {
      agentIds = await this.tm.sessionStore.listAgentIds();
    } catch (error42) {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "transcript_manager",
        errorClass: errorLogTag(error42)
      });
      return;
    }
    for (const agentId of agentIds) {
      if (this.tm.sessions.isAgentGone(agentId)) continue;
      const liveSession = this.tm.sessions.activeSession?.id === agentId ? this.tm.sessions.activeSession : this.tm.sessions.liveSessions.get(agentId);
      let session;
      try {
        session = liveSession ?? await this.tm.sessionStore.openSession(agentId);
      } catch (error42) {
        reportHostDiagnostic({
          kind: "fallback_taken",
          stage: "transcript_manager",
          errorClass: errorLogTag(error42)
        });
        continue;
      }
      try {
        for (const entry of session.db.getTranscriptEntries()) {
          if (entry.kind !== "send-message" || entry.message.type !== "credential-request" || entry.credentialResolution != null) {
            continue;
          }
          this.scheduleCredentialRequestExpiry({
            agentId,
            entryId: entry.id,
            expiresAtMs: entry.message.credentialRequest.expiresAtMs
          });
        }
      } catch (error42) {
        reportHostDiagnostic({
          kind: "fallback_taken",
          stage: "transcript_manager",
          errorClass: errorLogTag(error42)
        });
      } finally {
        if (liveSession == null) {
          await session.agentStore.dispose();
          session.db.close();
        }
      }
    }
  }
  cancelCredentialRequestExpiry(args) {
    const key = JSON.stringify([args.agentId, args.entryId]);
    this.credentialExpiryTimers.get(key)?.dispose();
    this.credentialExpiryTimers.delete(key);
  }
  dispose() {
    for (const timer of this.credentialExpiryTimers.values()) timer.dispose();
    this.credentialExpiryTimers.clear();
  }
  collectUnansweredQuestionPrompts(session, options2) {
    const isActive = session.id === this.tm.sessions.activeSession?.id && this.tm.sessions.inMemoryTranscriptAgentId === session.id;
    const entries = isActive ? getTranscript() : session.db.getTranscriptEntries();
    const carried = new Set(options2?.carriedWakeEntryIds ?? []);
    const skippedQuestionPrompts = [];
    const dismissedQuestionPrompts = [];
    const discardedDraftPrompts = [];
    const unconfirmedDraftPrompts = [];
    const unseenWakeOutcomes = [];
    const unseenEntryIds = [...carried];
    for (const entry of entries) {
      if (entry.kind !== "send-message") continue;
      if (entry.wakeOutcomeUnseen === true) {
        if (carried.has(entry.id)) continue;
        const summary2 = unseenWakeOutcomeSummary(entry);
        if (summary2 != null) unseenWakeOutcomes.push(summary2);
        unseenEntryIds.push(entry.id);
        continue;
      }
      if (entry.respondedValue != null || entry.widgetSkipped === true) continue;
      const discardedDraft = entry.draftSendState === "discarded" ? draftCardSummary(entry.message) : void 0;
      const unconfirmedDraft = entry.draftSendState === "unconfirmed" ? draftCardSummary(entry.message) : void 0;
      const summary = discardedDraft ?? unconfirmedDraft ?? skippablePromptSummary(entry.message);
      if (summary == null) continue;
      if (discardedDraft != null) {
        discardedDraftPrompts.push(summary);
      } else if (unconfirmedDraft != null) {
        unconfirmedDraftPrompts.push(summary);
      } else if (entry.widgetDismissed === true) {
        dismissedQuestionPrompts.push(summary);
      } else {
        skippedQuestionPrompts.push(summary);
      }
      const markSkipped = (e) => e.kind === "send-message" ? { ...e, widgetSkipped: true } : e;
      if (isActive) {
        const updated = updateEntry(entry.id, markSkipped);
        if (updated != null) this.tm.roster.emit({ type: "updated", entry: updated });
      }
      session.db.updateTranscriptEntry(entry.id, markSkipped);
    }
    return {
      skippedQuestionPrompts,
      dismissedQuestionPrompts,
      discardedDraftPrompts,
      unconfirmedDraftPrompts,
      unseenWakeOutcomes,
      ...this.wakeOutcomeSeenHook(session, unseenEntryIds)
    };
  }
  wakeOutcomeSeenHook(session, entryIds) {
    if (entryIds.length === 0) return {};
    let markedSeen = false;
    return {
      onStepCheckpointPersisted: () => {
        if (markedSeen) return;
        markedSeen = true;
        this.markWakeOutcomesSeen(session, entryIds);
      }
    };
  }
  markWakeOutcomesSeen(session, entryIds) {
    const isActive = session.id === this.tm.sessions.activeSession?.id && this.tm.sessions.inMemoryTranscriptAgentId === session.id;
    for (const entryId of entryIds) {
      let didStamp = false;
      const markSeen = (e) => {
        if (e.kind !== "send-message" || e.wakeOutcomeUnseen !== true) return e;
        didStamp = true;
        const { wakeOutcomeUnseen: _unseen, ...rest } = e;
        return rest;
      };
      if (isActive) {
        const updated = updateEntry(entryId, markSeen);
        if (didStamp && updated != null) this.tm.roster.emit({ type: "updated", entry: updated });
      }
      session.db.updateTranscriptEntry(entryId, markSeen);
    }
  }
  async respondToWidget(entryId, value, agentId) {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) return { accepted: false };
    await this.tm.sessions.ensureActionTarget(agentId);
    const targetAgentId = this.tm.sessions.activeSession?.id;
    if (!this.recordWidgetResponse(entryId, trimmedValue)) {
      return { accepted: false };
    }
    const widgetEntry = findEntry(entryId);
    const replyToId = widgetEntry?.kind === "send-message" ? widgetEntry.replyTo : void 0;
    let modelPrompt = trimmedValue;
    let guardApplied = false;
    try {
      if (trimmedValue.startsWith(SPEND_GUARD_VALUE_PREFIX) && targetAgentId != null) {
        const applied = await this.tm.automationRuntime.handleSpendGuardWidgetAnswer({
          agentId: targetAgentId,
          entryId,
          value: trimmedValue,
          onApplied: () => {
            guardApplied = true;
          }
        });
        if (applied == null) {
          this.rollbackWidgetResponse(entryId);
          return { accepted: false };
        }
        modelPrompt = applied;
      }
      const note = widgetEntry?.kind === "send-message" ? buildWidgetAnswerNote({
        targetId: entryId,
        quote: describeRepliedMessageQuote(widgetEntry)
      }) : "";
      await this.tm.sendPrompt(note.length > 0 ? `${note}
${modelPrompt}` : modelPrompt, {
        ...targetAgentId != null ? { agentId: targetAgentId } : {},
        ...replyToId != null ? { replyToId } : {},
        appendUserMessage: false,
        offRecordMessageId: `${SAND_WIDGET_ANSWER_MESSAGE_ID_PREFIX}${entryId}`,
        awaitTurn: false
      });
    } catch (error42) {
      if (guardApplied) return { accepted: true };
      this.rollbackWidgetResponse(entryId);
      throw error42;
    }
    return { accepted: true };
  }
  async settleStaleAutoReviewCard({
    agentId,
    entryId,
    requestId: requestId2
  }) {
    if (this.settlePendingAutoReviewApprovalsOnSession({ agentId, status: "expired", requestId: requestId2 })) {
      return true;
    }
    const expired = await this.tm.sessionStore.expirePendingAutoReviewApprovals(agentId, requestId2);
    if (expired.length > 0) void this.tm.roster.emitAgentUpdate(agentId);
    const settled = this.tm.sessionStore.readAgentTranscriptEntries(agentId).find(
      (entry) => entry.id === entryId && entry.kind === "send-message" && entry.message.type === "auto-review-approval" && entry.message.approval.requestId === requestId2
    );
    if (settled == null) return false;
    this.tm.roster.emit({ type: "updated", entry: settled }, agentId);
    return true;
  }
  async expireAllPendingAutoReviewApprovalCards() {
    const recordSweepFailure = (stage, error42) => {
      this.tm.telemetry.reportAutoReviewExpireSweepFailed({
        stage,
        errorClass: errorLogTag(error42)
      });
    };
    try {
      const activeId = this.tm.sessions.activeSession?.id;
      if (activeId != null) {
        this.settlePendingAutoReviewApprovalsOnSession({
          agentId: activeId,
          status: "expired"
        });
      }
      let agentIds;
      try {
        agentIds = await this.tm.sessionStore.listAgentIds();
      } catch (error42) {
        recordSweepFailure("list_agents", error42);
        return;
      }
      for (const agentId of agentIds) {
        if (agentId === activeId) continue;
        let expired;
        try {
          expired = await this.tm.sessionStore.expirePendingAutoReviewApprovals(agentId);
        } catch (error42) {
          recordSweepFailure("expire_agent", error42);
          continue;
        }
        if (expired.length > 0) void this.tm.roster.emitAgentUpdate(agentId);
      }
    } catch (error42) {
      recordSweepFailure("sweep", error42);
    }
  }
  settlePendingAutoReviewApprovalsOnSession(args) {
    const { agentId, status, requestId: requestId2 } = args;
    const session = this.tm.sessions.activeSession?.id === agentId ? this.tm.sessions.activeSession : this.tm.sessions.liveSessions.get(agentId) ?? null;
    if (session == null) return false;
    let retired = false;
    for (const entry of session.db.getTranscriptEntries()) {
      const settled = settlePendingAutoReviewApprovalEntry(entry, status, requestId2);
      if (settled == null) continue;
      session.db.updateTranscriptEntry(entry.id, () => settled);
      retired = true;
      const live = agentId === this.tm.sessions.activeSession?.id ? updateEntry(entry.id, () => settled) : null;
      this.tm.roster.emit({ type: "updated", entry: live ?? settled }, agentId);
    }
    return retired;
  }
  async settleStaleLocalToolPermissionCard({
    agentId,
    entryId,
    requestId: requestId2,
    status = "expired"
  }) {
    if (this.settlePendingLocalToolPermissionAsksOnSession({ agentId, requestId: requestId2, status })) {
      return "retired";
    }
    const expired = await this.tm.sessionStore.expirePendingLocalToolPermissionAsks({
      agentId,
      onlyRequestId: requestId2,
      status
    });
    if (expired.length > 0) void this.tm.roster.emitAgentUpdate(agentId);
    const settled = this.tm.sessionStore.readAgentTranscriptEntries(agentId).find(
      (entry) => entry.id === entryId && entry.kind === "send-message" && entry.message.type === "local-tool-permission" && entry.message.ask.requestId === requestId2
    );
    if (settled == null) return false;
    this.tm.roster.emit({ type: "updated", entry: settled }, agentId);
    return expired.length > 0 ? "retired" : "already-settled";
  }
  async expireAllPendingLocalToolPermissionCards(options2) {
    const reportSweepFailure = (error42) => {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "transcript_manager",
        errorClass: errorLogTag(error42)
      });
    };
    const ifPendingBeforeMs = options2?.ifPendingBeforeMs;
    const unlessRequestId = options2?.unlessRequestId;
    try {
      const activeId = this.tm.sessions.activeSession?.id;
      if (activeId != null) {
        this.settlePendingLocalToolPermissionAsksOnSession({
          agentId: activeId,
          ifPendingBeforeMs,
          unlessRequestId
        });
      }
      if (options2?.activeOnly === true) return;
      let agentIds;
      try {
        agentIds = await this.tm.sessionStore.listAgentIds();
      } catch (error42) {
        reportSweepFailure(error42);
        return;
      }
      for (const agentId of agentIds) {
        if (agentId === activeId) continue;
        let expired;
        try {
          expired = await this.tm.sessionStore.expirePendingLocalToolPermissionAsks({
            agentId,
            ifPendingBeforeMs,
            unlessRequestId
          });
        } catch (error42) {
          reportSweepFailure(error42);
          continue;
        }
        if (expired.length > 0) void this.tm.roster.emitAgentUpdate(agentId);
      }
    } catch (error42) {
      reportSweepFailure(error42);
    }
  }
  async expireAllPendingCookieOriginApprovalCards(options2) {
    const reportSweepFailure = (error42) => {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "transcript_manager",
        errorClass: errorLogTag(error42)
      });
    };
    const ifPendingBeforeMs = options2?.ifPendingBeforeMs;
    const unlessRequestId = options2?.unlessRequestId;
    try {
      const activeId = this.tm.sessions.activeSession?.id;
      if (activeId != null) {
        this.settlePendingCookieOriginApprovalsOnSession({
          agentId: activeId,
          ifPendingBeforeMs,
          unlessRequestId
        });
      }
      let agentIds;
      try {
        agentIds = await this.tm.sessionStore.listAgentIds();
      } catch (error42) {
        reportSweepFailure(error42);
        return;
      }
      for (const agentId of agentIds) {
        if (agentId === activeId) continue;
        let expired;
        try {
          expired = await this.tm.sessionStore.expirePendingCookieOriginApprovals({
            agentId,
            ifPendingBeforeMs,
            unlessRequestId
          });
        } catch (error42) {
          reportSweepFailure(error42);
          continue;
        }
        if (expired.length > 0) void this.tm.roster.emitAgentUpdate(agentId);
      }
    } catch (error42) {
      reportSweepFailure(error42);
    }
  }
  settlePendingCookieOriginApprovalsOnSession(args) {
    const { agentId, ifPendingBeforeMs, unlessRequestId } = args;
    const session = this.tm.sessions.activeSession?.id === agentId ? this.tm.sessions.activeSession : this.tm.sessions.liveSessions.get(agentId) ?? null;
    if (session == null) return false;
    let retired = false;
    for (const entry of session.db.getTranscriptEntries()) {
      if (ifPendingBeforeMs != null && entry.kind === "send-message" && entry.timestampMs != null && entry.timestampMs >= ifPendingBeforeMs) {
        continue;
      }
      if (unlessRequestId != null && entry.kind === "send-message" && entry.message.type === "cookie-origin-approval" && unlessRequestId(entry.message.approval.requestId)) {
        continue;
      }
      const settled = settlePendingCookieOriginApprovalEntry(entry, "expired");
      if (settled == null) continue;
      session.db.updateTranscriptEntry(entry.id, () => settled);
      retired = true;
      const live = agentId === this.tm.sessions.activeSession?.id ? updateEntry(entry.id, () => settled) : null;
      this.tm.roster.emit({ type: "updated", entry: live ?? settled }, agentId);
    }
    return retired;
  }
  settlePendingLocalToolPermissionAsksOnSession(args) {
    const { agentId, requestId: requestId2, ifPendingBeforeMs, unlessRequestId } = args;
    const status = args.status ?? "expired";
    const session = this.tm.sessions.activeSession?.id === agentId ? this.tm.sessions.activeSession : this.tm.sessions.liveSessions.get(agentId) ?? null;
    if (session == null) return false;
    let retired = false;
    for (const entry of session.db.getTranscriptEntries()) {
      if (ifPendingBeforeMs != null && entry.kind === "send-message" && entry.timestampMs != null && entry.timestampMs >= ifPendingBeforeMs) {
        continue;
      }
      if (unlessRequestId != null && entry.kind === "send-message" && entry.message.type === "local-tool-permission" && unlessRequestId(entry.message.ask.requestId)) {
        continue;
      }
      const settled = settlePendingLocalToolPermissionEntry(entry, status, requestId2);
      if (settled == null) continue;
      session.db.updateTranscriptEntry(entry.id, () => settled);
      retired = true;
      const live = agentId === this.tm.sessions.activeSession?.id ? updateEntry(entry.id, () => settled) : null;
      this.tm.roster.emit({ type: "updated", entry: live ?? settled }, agentId);
    }
    return retired;
  }
  async resolveVirtualCardApproval(args) {
    const retiredFromPending = await this.settlePendingVirtualCard({
      ...args,
      wakeOutcomeUnseen: true
    });
    if (retiredFromPending == null) return;
    await this.tm.boxHandoff.resumeWithHiddenPrompt(
      args.agentId,
      args.resolution === "expired" ? buildVirtualCardExpiredAck(retiredFromPending.approval) : buildVirtualCardAnswerPrompt({
        approved: args.resolution !== "denied",
        ...args.spendRequestId === void 0 ? {} : { spendRequestId: args.spendRequestId }
      }),
      "resume_after_user_form_failed",
      { wakeOutcomeEntryIds: [retiredFromPending.entryId] }
    );
  }
  async retireSupersededVirtualCard(args) {
    await this.settlePendingVirtualCard({ ...args, resolution: "expired" });
  }
  async settlePendingVirtualCard(args) {
    const onSession = this.settlePendingVirtualCardOnSession(args);
    if (onSession != null) return onSession;
    const settled = await this.tm.sessionStore.settleVirtualCardApproval({
      agentId: args.agentId,
      requestId: args.requestId,
      status: args.resolution,
      ...args.spendRequestId === void 0 ? {} : { spendRequestId: args.spendRequestId },
      ...args.failureReason === void 0 ? {} : { failureReason: args.failureReason },
      ...args.wakeOutcomeUnseen === true ? { wakeOutcomeUnseen: true } : {}
    });
    if (settled == null || settled.kind !== "send-message" || settled.message.type !== "virtual-card-approval") {
      return null;
    }
    this.tm.roster.emit({ type: "updated", entry: settled }, args.agentId);
    return { entryId: settled.id, approval: settled.message.approval };
  }
  settlePendingVirtualCardOnSession(args) {
    const { agentId, ifPendingBeforeMs, unlessRequestId } = args;
    const session = this.tm.sessions.activeSession?.id === agentId ? this.tm.sessions.activeSession : this.tm.sessions.liveSessions.get(agentId) ?? null;
    if (session == null) return null;
    let retired = null;
    for (const entry of session.db.getTranscriptEntries()) {
      if (ifPendingBeforeMs != null && entry.kind === "send-message" && entry.timestampMs != null && entry.timestampMs >= ifPendingBeforeMs) {
        continue;
      }
      if (unlessRequestId != null && entry.kind === "send-message" && entry.message.type === "virtual-card-approval" && unlessRequestId(entry.message.approval.requestId)) {
        continue;
      }
      const retiredEntry = settlePendingVirtualCardApprovalEntry(
        entry,
        args.resolution,
        args.requestId,
        {
          ...args.spendRequestId === void 0 ? {} : { spendRequestId: args.spendRequestId },
          ...args.failureReason === void 0 ? {} : { failureReason: args.failureReason }
        }
      );
      if (retiredEntry == null) continue;
      const settled = args.wakeOutcomeUnseen === true && retiredEntry.kind === "send-message" ? { ...retiredEntry, wakeOutcomeUnseen: true } : retiredEntry;
      session.db.updateTranscriptEntry(entry.id, () => settled);
      if (settled.kind === "send-message" && settled.message.type === "virtual-card-approval") {
        retired = { entryId: settled.id, approval: settled.message.approval };
      }
      const live = agentId === this.tm.sessions.activeSession?.id ? updateEntry(entry.id, () => settled) : null;
      this.tm.roster.emit({ type: "updated", entry: live ?? settled }, agentId);
    }
    return retired;
  }
  async expireAllPendingVirtualCardApprovalCards(options2) {
    const reportSweepFailure = (error42) => {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "transcript_manager",
        errorClass: errorLogTag(error42)
      });
    };
    const ifPendingBeforeMs = options2?.ifPendingBeforeMs;
    const unlessRequestId = options2?.unlessRequestId;
    try {
      const activeId = this.tm.sessions.activeSession?.id;
      if (activeId != null) {
        this.settlePendingVirtualCardOnSession({
          agentId: activeId,
          resolution: "expired",
          ifPendingBeforeMs,
          unlessRequestId
        });
      }
      let agentIds;
      try {
        agentIds = await this.tm.sessionStore.listAgentIds();
      } catch (error42) {
        reportSweepFailure(error42);
        return;
      }
      for (const agentId of agentIds) {
        if (agentId === activeId) continue;
        try {
          const expired = await this.tm.sessionStore.expirePendingVirtualCardApprovals({
            agentId,
            ifPendingBeforeMs,
            unlessRequestId
          });
          if (expired.length > 0) void this.tm.roster.emitAgentUpdate(agentId);
        } catch (error42) {
          reportSweepFailure(error42);
        }
      }
    } catch (error42) {
      reportSweepFailure(error42);
    }
  }
  async dismissWidget({
    entryId,
    agentId
  }) {
    await this.tm.sessions.ensureActionTarget(agentId);
    const existing = findEntry(entryId);
    if (existing == null || existing.kind !== "send-message" || existing.message.type !== "widget" || existing.respondedValue != null || existing.widgetDismissed === true) {
      return { accepted: false };
    }
    let didStamp = false;
    const markDismissed = (entry) => {
      if (entry.kind !== "send-message") return entry;
      if (entry.respondedValue != null || entry.widgetDismissed === true) {
        return entry;
      }
      didStamp = true;
      const { widgetSkipped: _skipped, ...rest } = entry;
      return { ...rest, widgetDismissed: true };
    };
    const updated = updateEntry(entryId, markDismissed);
    if (didStamp && updated != null) {
      this.tm.roster.emit({ type: "updated", entry: updated });
      this.tm.sessions.activeSession?.db.updateTranscriptEntry(entryId, markDismissed);
    }
    return { accepted: didStamp };
  }
  async storeSecret(target, value, agentId) {
    const trimmed = value.trim();
    if (trimmed.length === 0) return false;
    await this.tm.sessions.ensureActionTarget(agentId);
    const session = this.tm.sessions.activeSession;
    if (session == null) return false;
    return this.routeSecret(session.id, target, trimmed);
  }
  async expireCredentialRequest(args) {
    if (this.tm.sessions.isAgentGone(args.agentId)) return;
    const liveSession = this.tm.sessions.activeSession?.id === args.agentId ? this.tm.sessions.activeSession : this.tm.sessions.liveSessions.get(args.agentId);
    const session = liveSession ?? await this.tm.sessionStore.openSession(args.agentId);
    try {
      const entry = session.db.getEntryById(args.entryId);
      if (entry?.kind !== "send-message" || entry.message.type !== "credential-request" || entry.credentialResolution != null || this.tm.clock.now() < entry.message.credentialRequest.expiresAtMs) {
        return;
      }
      const request5 = entry.message.credentialRequest;
      const markExpired = (candidate) => candidate.kind === "send-message" && candidate.message.type === "credential-request" && candidate.credentialResolution == null ? { ...candidate, credentialResolution: "failed", wakeOutcomeUnseen: true } : candidate;
      const persisted = session.db.updateTranscriptEntry(args.entryId, markExpired);
      if (persisted == null) return;
      if (this.tm.sessions.activeSession?.id === args.agentId && this.tm.sessions.inMemoryTranscriptAgentId === args.agentId) {
        const updated = updateEntry(args.entryId, markExpired);
        if (updated != null) this.tm.roster.emit({ type: "updated", entry: updated });
      } else {
        void this.tm.roster.emitAgentUpdate(args.agentId);
      }
      await this.tm.boxHandoff.resumeWithHiddenPrompt(
        args.agentId,
        buildCredentialResolvedAck({
          request: request5,
          resolution: "failed",
          detail: "The credential request expired before approval."
        }),
        "resume_after_user_form_failed",
        { wakeOutcomeEntryIds: [args.entryId] }
      );
    } finally {
      if (liveSession == null) {
        await session.agentStore.dispose();
        session.db.close();
      }
    }
  }
  async requestCredentialAutoFill(args) {
    let outcome;
    try {
      outcome = await this.tm.requestCredentialAutoFill(args);
    } catch (error42) {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "transcript_manager",
        errorClass: errorLogTag(error42)
      });
      outcome = { accepted: false };
    }
    if (outcome.accepted) return;
    await this.tm.sessions.ensureActionTarget(args.agentId);
    const session = this.tm.sessions.activeSession;
    if (session == null || session.id !== args.agentId) return;
    const askUser = (item) => item.kind === "send-message" && item.message.type === "credential-request" && item.credentialResolution == null && item.message.credentialRequest.autoFill === true ? {
      ...item,
      message: {
        ...item.message,
        credentialRequest: { ...item.message.credentialRequest, autoFill: false }
      }
    } : item;
    const updated = updateEntry(args.entryId, askUser);
    if (updated != null) this.tm.roster.emit({ type: "updated", entry: updated });
    session.db.updateTranscriptEntry(args.entryId, askUser);
  }
  async getOpenCredentialRequest(args) {
    await this.tm.sessions.ensureActionTarget(args.agentId);
    const session = this.tm.sessions.activeSession;
    if (session == null) return null;
    const entry = findEntry(args.entryId);
    if (entry?.kind !== "send-message" || entry.message.type !== "credential-request" || entry.credentialResolution != null) {
      return null;
    }
    const request5 = entry.message.credentialRequest;
    if (this.tm.clock.now() < request5.expiresAtMs) {
      return request5;
    }
    await this.settleCredentialRequest({
      session,
      entryId: args.entryId,
      request: request5,
      resolution: "failed",
      detail: "The credential request expired before approval."
    });
    return null;
  }
  async resolveCredentialRequest(args) {
    await this.tm.sessions.ensureActionTarget(args.agentId);
    const session = this.tm.sessions.activeSession;
    if (session == null) return false;
    const entry = findEntry(args.entryId);
    if (entry?.kind !== "send-message" || entry.message.type !== "credential-request" || entry.credentialResolution != null) {
      return false;
    }
    const request5 = entry.message.credentialRequest;
    const requestIsCurrent = this.tm.clock.now() < request5.expiresAtMs;
    if (requestIsCurrent) {
      return await this.settleCredentialRequest({
        session,
        entryId: args.entryId,
        request: request5,
        resolution: args.resolution,
        ...args.detail == null ? {} : { detail: args.detail }
      });
    }
    return await this.settleCredentialRequest({
      session,
      entryId: args.entryId,
      request: request5,
      resolution: "failed",
      detail: "The credential request expired before approval."
    });
  }
  async settleCredentialRequest(args) {
    let didStamp = false;
    const markResolved = (item) => {
      if (item.kind !== "send-message" || item.message.type !== "credential-request" || item.credentialResolution != null) {
        return item;
      }
      didStamp = true;
      return { ...item, credentialResolution: args.resolution, wakeOutcomeUnseen: true };
    };
    const updated = updateEntry(args.entryId, markResolved);
    if (!didStamp) return false;
    this.cancelCredentialRequestExpiry({
      agentId: args.session.id,
      entryId: args.entryId
    });
    if (updated != null) {
      this.tm.roster.emit({ type: "updated", entry: updated });
    }
    args.session.db.updateTranscriptEntry(args.entryId, markResolved);
    await this.tm.boxHandoff.resumeWithHiddenPrompt(
      args.session.id,
      buildCredentialResolvedAck({
        request: args.request,
        resolution: args.resolution,
        ...args.detail == null ? {} : { detail: args.detail }
      }),
      "resume_after_user_form_failed",
      { wakeOutcomeEntryIds: [args.entryId] }
    );
    return true;
  }
  async submitSecret(entryId, value, agentId) {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    await this.tm.sessions.ensureActionTarget(agentId);
    const session = this.tm.sessions.activeSession;
    if (session == null) return;
    const entry = findEntry(entryId);
    if (entry == null || entry.kind !== "send-message" || entry.message.type !== "secret-request" || entry.secretProvided === true) {
      return;
    }
    const request5 = entry.message.secretRequest;
    if (!await this.routeSecret(session.id, request5.target, trimmed)) {
      this.tm.trayErrors.pushError({
        agentId: session.id,
        ...hostTrayTitle({ kind: "secret_store_failed" }),
        errorKind: "secret_store_failed"
      });
      const failed2 = new SandSecretStoreFailedError();
      try {
        await this.tm.boxHandoff.resumeWithHiddenPrompt(
          session.id,
          buildSecretSaveFailedAck(request5, failed2.message),
          "resume_after_secret_submission_failed"
        );
      } catch (error42) {
        reportHostDiagnostic({
          kind: "fallback_taken",
          stage: "transcript_manager",
          errorClass: errorLogTag(error42)
        });
      }
      throw failed2;
    }
    const markProvided = (item) => item.kind === "send-message" ? { ...item, secretProvided: true, wakeOutcomeUnseen: true } : item;
    const updated = updateEntry(entryId, markProvided);
    if (updated != null) this.tm.roster.emit({ type: "updated", entry: updated });
    session.db.updateTranscriptEntry(entryId, markProvided);
    await this.tm.boxHandoff.resumeWithHiddenPrompt(
      session.id,
      buildSecretProvidedAck(request5),
      "resume_after_secret_submission_failed",
      { wakeOutcomeEntryIds: [entryId] }
    );
  }
  async routeSecret(agentId, target, value) {
    switch (target.kind) {
      case "box-env":
        return this.tm.storeBoxSecret({ name: target.name, value });
      case "channel-credential": {
        const stored = this.tm.sessionStore.storeConnectorCredential(
          agentId,
          target.platform,
          target.field,
          value
        );
        if (stored) this.tm.channelConfigChanged?.();
        return stored;
      }
      case "bot-secret":
      case "bot-plugin-variable":
        return false;
    }
  }
  recordWidgetResponse(entryId, value) {
    const transcript = getTranscript();
    const existing = findEntry(entryId);
    if (existing == null || existing.kind !== "send-message" || existing.message.type !== "widget" || existing.respondedValue != null || existing.widgetDismissed === true) {
      return false;
    }
    if (existing.message.type === "widget" && existing.message.widget.dismissOnMoveOn === true) {
      const hasUserMomentAfterIn = (scope) => {
        const index = scope.findIndex((entry) => entry.id === entryId);
        return index >= 0 && scope.slice(index + 1).some(
          (entry) => isUserMessageEntry(entry) && !isAgentPeerMessageEntry(entry) || entry.kind === "send-message" && entry.message.type === "widget" && (entry.respondedValue != null || entry.widgetDismissed === true)
        );
      };
      const surfaces = [];
      const mainEntries = getMainTranscriptEntries(transcript);
      if (mainEntries.some((entry) => entry.id === entryId)) {
        surfaces.push(mainEntries);
      }
      const threadEntries = getThreadTranscriptEntries(transcript, entryId);
      if (threadEntries.length > 1) surfaces.push(threadEntries);
      if (surfaces.length > 0 && surfaces.every(hasUserMomentAfterIn)) {
        return false;
      }
    }
    let didStamp = false;
    const withResponse = (entry) => {
      if (entry.kind !== "send-message") return entry;
      if (entry.respondedValue != null || entry.widgetDismissed === true) {
        return entry;
      }
      didStamp = true;
      return { ...entry, respondedValue: value, wakeOutcomeUnseen: true };
    };
    const updated = updateEntry(entryId, withResponse);
    if (didStamp && updated != null) {
      this.tm.roster.emit({ type: "updated", entry: updated });
      this.tm.sessions.activeSession?.db.updateTranscriptEntry(entryId, withResponse);
    }
    return didStamp;
  }
  rollbackWidgetResponse(entryId) {
    const withoutResponse = (entry) => {
      if (entry.kind !== "send-message") return entry;
      const { respondedValue: _value, wakeOutcomeUnseen: _unseen, ...rest } = entry;
      return rest;
    };
    const updated = updateEntry(entryId, withoutResponse);
    if (updated != null) this.tm.roster.emit({ type: "updated", entry: updated });
    this.tm.sessions.activeSession?.db.updateTranscriptEntry(entryId, withoutResponse);
  }
  async reactToMessage(entryId, emoji3, agentId) {
    const trimmed = emoji3.trim();
    if (trimmed.length === 0) return;
    await this.tm.sessions.ensureActionTarget(agentId);
    const result = this.applyReaction({
      session: this.tm.sessions.activeSession ?? null,
      entryId,
      emoji: trimmed,
      by: SAND_REACTION_SELF
    });
    if (result == null) return;
    const activeAgentId = this.tm.sessions.activeSession?.id;
    if (!result.isAdding || activeAgentId == null) return;
    const prompt = buildReactionWakePrompt({ entry: result.before, emoji: trimmed });
    if (prompt != null) {
      void this.tm.boxHandoff.resumeWithHiddenPrompt(
        activeAgentId,
        prompt,
        "resume_after_reaction_failed"
      );
    }
  }
  applyReaction(args) {
    const { session, entryId, emoji: emoji3, by } = args;
    const isActive = session == null || session.id === this.tm.sessions.activeSession?.id;
    const before = isActive ? findEntry(entryId) : session.db.getEntryById(entryId);
    if (before == null) return null;
    const isAdding = !(before.reactions ?? []).some(
      (reaction) => reaction.emoji === emoji3 && reaction.by === by
    );
    const withToggle = (entry) => {
      const next = toggleReaction(entry.reactions, emoji3, by);
      const { reactions: _omit, ...rest } = entry;
      return next != null ? { ...rest, reactions: next } : rest;
    };
    if (isActive) {
      const updated = updateEntry(entryId, withToggle);
      if (updated == null) return null;
      this.tm.roster.emit({ type: "updated", entry: updated });
      this.tm.sessions.activeSession?.db.updateTranscriptEntry(entryId, withToggle);
    } else {
      session.db.updateTranscriptEntry(entryId, withToggle);
      void this.tm.roster.emitAgentUpdate(session.id);
    }
    return { before, isAdding };
  }
};
