/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/turn-runtime.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
init_dist4();

// @recovered-fragment 2/3
init_esm2();
init_bounded();
init_errors();
init_system_errno();

// @recovered-fragment 3/3
var MAX_REPLY_NUDGES = 3;
var REPLY_NUDGE_PROMPT = SAND_ONBOARDING_REPLY_NUDGE_PROMPT;
var CLOSING_SEND_NUDGE_PROMPT = "Your previous turn acknowledged the user and then ran tool calls, but ended without a follow-up SendToUser \u2014 the last thing the user saw is that opening acknowledgement, so whatever the tool calls produced after it never reached them. If that work produced the result or answer they are waiting on, deliver it now by actually invoking the SendToUser tool \u2014 make a real tool/function call, not text you write. Plain assistant text is NEVER shown to the user; only a real SendToUser tool invocation reaches them. If the work is genuinely unfinished, continue it and send the result once you have it.";
function isDeliveryOwed(result) {
  return result.sentMessageCount === 0 && !result.reacted;
}
function isBoxOwnerActingTurn(requestSource, entries) {
  return requestSource === "turn" && entries.length > 0 && entries.every(
    (entry) => entry?.kind === "message" && entry.role === "user" && entry.author == null && entry.fromUser == null && entry.channel == null && entry.channelSender == null && entry.fromAgent == null
  );
}
function turnEmptyDeliveryLogLine(report) {
  const ladder = report.redriveAttempts === void 0 ? `nudges=${report.replyNudgeAttempts ?? 0}` : `redrives=${report.redriveAttempts}`;
  return `turn ${report.conversationId} ended with delivery owed: source=${report.source} ${ladder} toolCalls=${report.toolCallCount} streamOutput=${report.streamOutputProduced} durationMs=${Math.round(report.durationMs)}`;
}
var TASK_ERROR_RESULT_CLASS = "task_error_result";
var connectCodeTag = brandedEnumOf(
  Object.values(Code).filter((value) => typeof value === "string"),
  "Other"
);
function connectCodeOf(error42) {
  const connectError = findBackendConnectError(error42, false);
  return connectError == null ? void 0 : connectCodeTag(Code[connectError.code]);
}
function turnTrayTitleKind(errorKind) {
  switch (errorKind) {
    case "provider_overloaded":
      return "model_provider_overloaded";
    case "backend_unreachable":
      return "backend_unreachable";
    default:
      return "bot_failed_to_respond";
  }
}
function classifyAgentError(error42) {
  if (isCheckpointPublicationFailure(error42)) {
    return SandError.checkpointPublicationFailed();
  }
  if (isBackendUnreachableError(error42)) {
    return SandError.turnBackendUnreachable({ errno: brandedErrno(findSystemErrno(error42)) });
  }
  if (isProviderCapacityError(error42)) {
    const retryAfterMs = serverRetryAfterMsFromError(error42);
    if (retryAfterMs !== void 0) {
      return SandError.backendCapacityDeferred({
        connectCode: connectCodeOf(error42),
        retryAfterMs
      });
    }
    return SandError.providerOverloaded({ connectCode: connectCodeOf(error42) });
  }
  if (isFirstTokenStallError(error42)) {
    return SandError.firstTokenStall();
  }
  if (isStreamIdleError(error42)) {
    return SandError.streamIdleStall();
  }
  if (isContextOverflowDeadEnd(error42)) {
    return SandError.contextWindowOverflow();
  }
  if (isConversationTooLargeRefusal(error42)) {
    return SandError.conversationTooLarge();
  }
  const connectCode = connectCodeOf(error42);
  if (isRetryableProviderError(error42)) {
    if (isTransientStreamError(error42)) {
      return SandError.streamReset({ connectCode, errno: brandedErrno(findSystemErrno(error42)) });
    }
    return SandError.turnRetryable({ connectCode });
  }
  if (connectCode !== void 0) {
    return SandError.backendRejected({ connectCode });
  }
  return SandError.agentUnclassified();
}
var TurnRuntime = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  replyThreadTargets = /* @__PURE__ */ new Map();
  forkTurnSessions = /* @__PURE__ */ new Set();
  settleCardStatus({
    runSession,
    isForActiveAgent,
    matchesCard,
    applyStatus
  }) {
    const targetSession = runSession ?? this.tm.sessions.activeSession ?? null;
    const dbTarget = targetSession?.db.getTranscriptEntries().find(matchesCard);
    const persisted = targetSession != null && dbTarget != null ? targetSession.db.updateTranscriptEntry(dbTarget.id, applyStatus) : null;
    const liveTarget = isForActiveAgent ? findEntryWhere(matchesCard) : void 0;
    const live = liveTarget != null ? updateEntry(liveTarget.id, applyStatus) : null;
    const shipped = live ?? persisted;
    if (shipped != null) {
      this.tm.roster.emit({ type: "updated", entry: shipped }, targetSession?.id);
    }
  }
  activeRequestPrompts = /* @__PURE__ */ new Map();
  activeRequestSources = /* @__PURE__ */ new Map();
  activeChannelAddresses = /* @__PURE__ */ new Map();
  activeTurnEpochs = /* @__PURE__ */ new Map();
  activeTurns = /* @__PURE__ */ new Map();
  turnBotBlocks = /* @__PURE__ */ new Map();
  openBotBlockTurns = /* @__PURE__ */ new Set();
  reportedDualSurfaceToolCalls = /* @__PURE__ */ new Map();
  reportedToolCallErrors = /* @__PURE__ */ new Map();
  reportedToolCallStalls = /* @__PURE__ */ new Map();
  reportedDynamicToolCalls = /* @__PURE__ */ new Map();
  reportedToolCallCompletions = /* @__PURE__ */ new Map();
  pendingToolCallStarts = /* @__PURE__ */ new Map();
  activeTurnRequestIds = /* @__PURE__ */ new Map();
  activeTurnUserMessageIds = /* @__PURE__ */ new Map();
  recoveredUserMessageIds = /* @__PURE__ */ new Map();
  templateSetupWriteHints = /* @__PURE__ */ new Map();
  onUserTurnSettled;
  armTemplateSetupWriteProvenance(hint) {
    let hints = this.templateSetupWriteHints.get(hint.sessionId);
    if (hints === void 0) {
      hints = /* @__PURE__ */ new Map();
      this.templateSetupWriteHints.set(hint.sessionId, hints);
    }
    hints.set(hint.messageId, hint.provenance);
  }
  disarmTemplateSetupWriteProvenance(target) {
    this.forgetTemplateSetupWriteHints(target.sessionId, [target.messageId]);
  }
  activeTemplateSetupWriteProvenance(sessionId) {
    const hints = this.templateSetupWriteHints.get(sessionId);
    if (hints === void 0 || this.activeRequestSources.get(sessionId) !== "turn") {
      return void 0;
    }
    let active;
    for (const messageId of this.activeTurnUserMessageIds.get(sessionId) ?? []) {
      const hint = hints.get(messageId);
      if (hint === void 0) continue;
      if (hint === "untrusted") return hint;
      active = hint;
    }
    return active;
  }
  activeTurnActsAsBoxOwner(session) {
    const messageIds = this.activeTurnUserMessageIds.get(session.id) ?? [];
    return isBoxOwnerActingTurn(
      this.activeRequestSources.get(session.id),
      messageIds.map((messageId) => session.db.getEntryById(messageId))
    );
  }
  forgetTemplateSetupWriteHints(sessionId, messageIds) {
    const hints = this.templateSetupWriteHints.get(sessionId);
    if (hints === void 0) return;
    for (const messageId of messageIds) hints.delete(messageId);
    if (hints.size === 0) this.templateSetupWriteHints.delete(sessionId);
  }
  recoverUserMessageIntoTurn(sessionId, messageId, targetMessageId) {
    let recoveredByTarget = this.recoveredUserMessageIds.get(sessionId);
    if (recoveredByTarget == null) {
      recoveredByTarget = /* @__PURE__ */ new Map();
      this.recoveredUserMessageIds.set(sessionId, recoveredByTarget);
    }
    const recovered = recoveredByTarget.get(targetMessageId) ?? /* @__PURE__ */ new Set();
    for (const previous of recoveredByTarget.get(messageId) ?? []) {
      recovered.add(previous);
    }
    recoveredByTarget.delete(messageId);
    recovered.add(messageId);
    recoveredByTarget.set(targetMessageId, recovered);
  }
  associateTurnUserMessages(session, requestId2) {
    for (const messageId of this.activeTurnUserMessageIds.get(session.id) ?? []) {
      const existing = session.db.getEntryById(messageId);
      if (existing?.kind !== "message" || existing.role !== "user" || existing.requestId != null) {
        continue;
      }
      const persisted = session.db.updateTranscriptEntry(
        messageId,
        (entry) => entry.kind === "message" && entry.role === "user" && entry.requestId == null ? { ...entry, requestId: requestId2 } : entry
      );
      if (persisted == null) continue;
      const updated = session.id === this.tm.sessions.activeSession?.id ? updateEntry(messageId, () => persisted) ?? persisted : persisted;
      this.tm.roster.emit({ type: "updated", entry: updated }, session.id);
    }
  }
  noteBotBlock(agentId, hit, turnId) {
    if (!this.openBotBlockTurns.has(agentId)) return;
    const liveTurnId = this.activeTurnRequestIds.get(agentId);
    if (turnId != null && liveTurnId != null && turnId !== liveTurnId) return;
    const current = this.turnBotBlocks.get(agentId);
    if (current !== void 0 && current.confidence === "high") return;
    if (current === void 0 || hit.confidence === "high") {
      this.turnBotBlocks.set(agentId, hit);
    }
  }
  takeLiveTurnBotBlock(session) {
    this.openBotBlockTurns.delete(session.id);
    const botBlock = this.turnBotBlocks.get(session.id);
    this.turnBotBlocks.delete(session.id);
    return botBlock;
  }
  settleClientTurn(session, clientNonce, outcome, options2) {
    const error42 = options2?.error;
    const botBlock = options2?.botBlock;
    if (clientNonce == null || clientNonce.length === 0) return;
    const errorTags = error42 === void 0 ? void 0 : sandErrorTags(error42);
    try {
      session.db.setLastTurnSettlement({
        clientNonce,
        outcome,
        settledAtMs: Date.now(),
        ...errorTags === void 0 ? {} : {
          errorCode: errorTags.error_code,
          errorDomain: errorTags.error_domain,
          errorRetryable: errorTags.error_retryable === "true"
        },
        ...botBlock === void 0 ? {} : { botBlock }
      });
    } catch (error43) {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "transcript_manager",
        errorClass: errorLogTag(error43)
      });
    }
  }
  markReportedOnce(args) {
    let seen = args.reported.get(args.sessionId);
    if (seen == null) {
      seen = /* @__PURE__ */ new Set();
      args.reported.set(args.sessionId, seen);
    }
    if (seen.has(args.toolCallId)) return false;
    seen.add(args.toolCallId);
    return true;
  }
  reportToolCallDiagnostic(session, observation) {
    const requestId2 = observation.requestId ?? this.tm.runLifecycle.lastRequestIdBySession.get(session.id);
    if (observation.kind === "dynamic") {
      const firstReport2 = this.markReportedOnce({
        reported: this.reportedDynamicToolCalls,
        sessionId: session.id,
        toolCallId: observation.toolCallId
      });
      if (!firstReport2) return;
      this.tm.telemetry.reportDynamicToolCall({
        conversationId: session.id,
        requestId: requestId2,
        toolName: observation.toolName,
        toolCallId: observation.toolCallId,
        outcome: observation.outcome,
        errorClass: observation.errorClass,
        durationMs: observation.durationMs
      });
      return;
    }
    if (observation.kind === "args_rejected") {
      this.tm.telemetry.reportToolCallArgsRejected({
        conversationId: session.id,
        requestId: requestId2,
        requestSource: this.activeRequestSources.get(session.id) ?? "turn",
        toolName: observation.toolName,
        toolCallId: observation.toolCallId,
        schemaVariant: observation.schemaVariant,
        rejection: observation.rejection,
        issueCount: observation.issueCount,
        issues: observation.issues
      });
      return;
    }
    const base = {
      conversationId: session.id,
      requestId: requestId2,
      toolName: observation.toolName,
      toolCallId: observation.toolCallId,
      connector: observation.connector
    };
    if (observation.kind === "completed") {
      const firstReport2 = this.markReportedOnce({
        reported: this.reportedToolCallCompletions,
        sessionId: session.id,
        toolCallId: observation.toolCallId
      });
      if (!firstReport2) return;
      this.tm.telemetry.reportToolCallCompleted({
        ...base,
        mcpTool: observation.mcpTool,
        transport: observation.transport,
        outcome: observation.outcome,
        errorClass: observation.errorClass,
        durationMs: observation.durationMs,
        windowIndex: observation.windowIndex
      });
      return;
    }
    if (observation.kind === "error") {
      const firstReport2 = this.markReportedOnce({
        reported: this.reportedToolCallErrors,
        sessionId: session.id,
        toolCallId: observation.toolCallId
      });
      if (!firstReport2) return;
      this.tm.telemetry.reportToolCallError({
        ...base,
        errorClass: observation.errorClass,
        durationMs: observation.durationMs
      });
      return;
    }
    const firstReport = this.markReportedOnce({
      reported: this.reportedToolCallStalls,
      sessionId: session.id,
      toolCallId: observation.toolCallId
    });
    if (!firstReport) return;
    this.tm.telemetry.reportToolCallStalled({
      ...base,
      elapsedMs: observation.elapsedMs
    });
  }
  async runTurn(session, runner, prompt, options2, epoch) {
    var _stack = [];
    try {
      const _flushOnTurnSettle = __using(_stack, {
        [Symbol.dispose]: () => this.tm.traceFlusher()
      });
      const turnTrace = __using(_stack, beginTurnTrace({
        parentCtx: options2.traceCtx,
        conversationId: session.id,
        turnType: "user",
        ...options2.queueStartEpochMs !== void 0 ? { startTime: new Date(options2.queueStartEpochMs) } : {},
        attributes: {
          "sand.turn_epoch": epoch,
          ...options2.clientNonce != null && options2.clientNonce.length > 0 ? { "sand.client_nonce": options2.clientNonce } : {},
          ...options2.messageId != null ? { "sand.message_id": options2.messageId } : {},
          ...options2.isFork === true ? { "sand.is_fork": true } : {}
        }
      }));
      const turnCtx = turnTrace?.ctx ?? options2.traceCtx;
      if (turnCtx !== void 0 && options2.queueStartEpochMs !== void 0 && options2.queueStartPerfMs !== void 0) {
        try {
          const queueWaitMs = Math.max(0, Math.round(performance.now() - options2.queueStartPerfMs));
          recordCompletedSpanIfParented(
            turnCtx.withName("turn-queue-wait"),
            {
              startTime: new Date(options2.queueStartEpochMs),
              attributes: {
                "sand.queue_wait_ms": queueWaitMs,
                "sand.conversation_id": session.id,
                ...options2.clientNonce != null && options2.clientNonce.length > 0 ? { "sand.client_nonce": options2.clientNonce } : {}
              }
            },
            new Date(options2.queueStartEpochMs + queueWaitMs)
          );
        } catch {
        }
      }
      if (epoch !== this.tm.sendPipeline.currentTurnEpoch(session) && options2.messageId != null) {
        const latestRecoverySend = this.tm.sendPipeline.latestRecoverySends.get(session.id);
        const rawTranscriptText = options2.recentUserMessages?.find(
          (message) => message.id === options2.messageId
        )?.text;
        const recoveryProofSucceeded = options2.selectedImages.length === 0 && (options2.selectedVideos?.length ?? 0) === 0 && (options2.attachedFilePaths?.length ?? 0) === 0 && options2.isFork !== true && options2.replyContext == null && rawTranscriptText != null && rawTranscriptText === prompt.trim() && epoch > (this.tm.sendPipeline.recoveryBreakEpochs.get(session.id) ?? 0) && latestRecoverySend != null && latestRecoverySend.epoch === this.tm.sendPipeline.currentTurnEpoch(session) && await runner.wouldRecoverViaPrepend(
          latestRecoverySend.recentUserMessages,
          latestRecoverySend.messageId,
          options2.messageId
        );
        const provablyRecoverable = recoveryProofSucceeded && epoch > (this.tm.sendPipeline.recoveryBreakEpochs.get(session.id) ?? 0) && latestRecoverySend === this.tm.sendPipeline.latestRecoverySends.get(session.id) && latestRecoverySend.epoch === this.tm.sendPipeline.currentTurnEpoch(session);
        if (provablyRecoverable) {
          this.recoverUserMessageIntoTurn(
            session.id,
            options2.messageId,
            latestRecoverySend.messageId
          );
          const skippedTurn = this.tm.telemetry.startTurn({
            conversationId: session.id,
            turnType: "new"
          });
          skippedTurn.finalize("cancelled");
          this.settleClientTurn(session, options2.clientNonce, "cancelled");
          void this.tm.roster.emitAgentUpdate(session.id);
          this.tm.ackObligations.retireAckRunToken(session.id, options2.ackToken);
          setTurnTraceAttributes(turnTrace, { "sand.outcome": "superseded" });
          this.tm.runLifecycle.endSessionRun(session);
          return;
        }
      }
      const trimmedPrompt = prompt.trim();
      if (trimmedPrompt.length > 0) {
        this.activeRequestPrompts.set(session.id, trimmedPrompt);
      } else {
        this.activeRequestPrompts.delete(session.id);
      }
      if (options2.replyContext != null) {
        this.replyThreadTargets.set(session, options2.replyContext.targetId);
      } else {
        this.replyThreadTargets.delete(session);
      }
      if (options2.isFork === true) {
        this.forkTurnSessions.add(session);
      } else {
        this.forkTurnSessions.delete(session);
      }
      this.activeTurnEpochs.set(session.id, epoch);
      this.openBotBlockTurns.add(session.id);
      this.turnBotBlocks.delete(session.id);
      const turnStartedAtMs = Date.now();
      const turn = this.tm.telemetry.startTurn({
        conversationId: session.id,
        turnType: "new"
      });
      this.activeTurns.set(session.id, turn);
      this.activeRequestSources.set(session.id, "turn");
      this.tm.boxHandoff.clearScmConnectLaunchGate(session.id);
      this.activeTurnRequestIds.delete(session.id);
      this.tm.runLifecycle.lastRequestIdBySession.delete(session.id);
      this.tm.runLifecycle.persistedSpendRequestIds.delete(session.id);
      const recoveredByTarget = this.recoveredUserMessageIds.get(session.id);
      const recoveredMessageIds = recoveredByTarget?.get(options2.messageId);
      recoveredByTarget?.delete(options2.messageId);
      if (recoveredByTarget?.size === 0) this.recoveredUserMessageIds.delete(session.id);
      const turnMessageIds = [...recoveredMessageIds ?? [], options2.messageId];
      this.activeTurnUserMessageIds.set(session.id, turnMessageIds);
      let spendRequestId;
      const onPersistableRunStarted = spendInitiationRecorder(
        session,
        messageSpendInitiation(session, turnMessageIds, options2.queueStartEpochMs ?? turnStartedAtMs),
        (requestId2) => {
          spendRequestId = requestId2;
          this.tm.runLifecycle.persistedSpendRequestIds.set(session.id, requestId2);
        }
      );
      const carriedWakeEntryIds = turnMessageIds.flatMap((messageId) => {
        const entryId = wakeOutcomeEntryIdOf(messageId);
        return entryId == null ? [] : [entryId];
      });
      try {
        const unansweredPrompts = this.tm.widgetResponses.collectUnansweredQuestionPrompts(session, {
          carriedWakeEntryIds
        });
        const result = await runner.run(prompt, {
          ...options2,
          ...unansweredPrompts,
          traceCtx: turnCtx,
          appendReplyReminder: true,
          requestSource: "turn",
          onModelResolved: (modelId) => turn.setModel(modelId),
          onPersistableRunStarted
        });
        let settledResult = result;
        if (result.pausedForUpgrade) {
          this.tm.upgradeResume.markAgentResumePending(session, "turn", { spendRequestId });
        } else if (!result.aborted && epoch === this.tm.sendPipeline.currentTurnEpoch(session)) {
          const settled = await this.ensureUserReply(runner, result, session, epoch, {
            advanceChainOnDelivery: false,
            ackToken: options2.ackToken,
            traceCtx: turnCtx,
            turnTrace,
            turn,
            onPersistableRunStarted
          });
          settledResult = settled.result;
          if (settledResult.pausedForUpgrade) {
            this.tm.upgradeResume.markAgentResumePending(session, "turn", { spendRequestId });
          }
          if (settled.deliveryOwed && !settledResult.aborted && settledResult.pausedForUpgrade !== true && epoch === this.tm.sendPipeline.currentTurnEpoch(session)) {
            this.tm.reportTurnEmptyDelivery({
              conversationId: session.id,
              requestId: this.tm.runLifecycle.lastRequestIdBySession.get(session.id),
              source: "turn",
              requestSource: "turn",
              replyNudgeAttempts: settled.replyNudgeAttempts,
              toolCallCount: runner.getObservedToolCallCount(),
              streamOutputProduced: settled.streamOutputProduced,
              durationMs: Date.now() - turnStartedAtMs,
              ackOutstanding: this.tm.ackObligationStore?.get(session.id) != null
            });
          }
        }
        await runner.drainNavigationAudit();
        const cancelled = settledResult.aborted || settledResult.pausedForUpgrade;
        turn.finalize(cancelled ? "cancelled" : "success");
        const settledBotBlock = this.takeLiveTurnBotBlock(session);
        this.settleClientTurn(
          session,
          options2.clientNonce,
          cancelled ? "cancelled" : "success",
          settledBotBlock === void 0 ? void 0 : { botBlock: settledBotBlock }
        );
        setTurnTraceAttributes(turnTrace, {
          "sand.outcome": resolveTurnTraceOutcome(settledResult)
        });
        if (this.onUserTurnSettled != null && !settledResult.aborted && settledResult.pausedForUpgrade !== true && epoch === this.tm.sendPipeline.currentTurnEpoch(session) && session.id === this.tm.sessions.activeSession?.id && !this.tm.groupChat.isGroupSession(session)) {
          const requestId2 = this.tm.runLifecycle.lastRequestIdBySession.get(session.id);
          if (requestId2 != null && endsOnPlainAgentReply(getTranscript())) {
            this.onUserTurnSettled({ agentId: session.id, requestId: requestId2 });
          }
        }
        await this.tm.roster.emitAgentUpdate(session.id);
        this.tm.automationRuntime.emitAutomations(session);
      } catch (error42) {
        await runner.drainNavigationAudit();
        const classified = classifyAgentError(error42);
        turn.finalize("error", classified, sandErrorDetail(error42));
        const erroredBotBlock = this.takeLiveTurnBotBlock(session);
        this.settleClientTurn(session, options2.clientNonce, "error", {
          error: classified,
          ...erroredBotBlock === void 0 ? {} : { botBlock: erroredBotBlock }
        });
        markTurnTraceError(turnTrace, error42);
        if (epoch === this.tm.sendPipeline.currentTurnEpoch(session)) {
          const description9 = describeAgentRunError(error42);
          const requestId2 = session.db.getRequestIds().at(-1)?.id;
          this.tm.trayErrors.pushError({
            agentId: session.id,
            requestId: requestId2,
            ...description9,
            ...hostTrayTitle({ kind: turnTrayTitleKind(description9.errorKind), description: description9 })
          });
        }
        await this.tm.roster.emitAgentUpdate(session.id);
      } finally {
        this.forgetTemplateSetupWriteHints(session.id, turnMessageIds);
        this.activeTurns.delete(session.id);
        this.openBotBlockTurns.delete(session.id);
        this.reportedDualSurfaceToolCalls.delete(session.id);
        this.reportedToolCallErrors.delete(session.id);
        this.reportedToolCallStalls.delete(session.id);
        this.reportedDynamicToolCalls.delete(session.id);
        this.reportedToolCallCompletions.delete(session.id);
        this.pendingToolCallStarts.delete(session.id);
        this.activeTurnRequestIds.delete(session.id);
        this.activeTurnUserMessageIds.delete(session.id);
        this.tm.runLifecycle.lastRequestIdBySession.delete(session.id);
        this.activeRequestPrompts.delete(session.id);
        this.activeRequestSources.delete(session.id);
        this.replyThreadTargets.delete(session);
        this.forkTurnSessions.delete(session);
        if (this.activeTurnEpochs.get(session.id) === epoch) {
          this.activeTurnEpochs.delete(session.id);
        }
        this.tm.ackObligations.retireAckRunToken(session.id, options2.ackToken);
        this.tm.runLifecycle.endSessionRun(session);
        if (this.tm.runLifecycle.persistedSpendRequestIds.get(session.id) === spendRequestId) {
          this.tm.runLifecycle.persistedSpendRequestIds.delete(session.id);
        }
      }
    } catch (_2) {
      var _error = _2, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  async ensureUserReply(runner, result, session, epoch, options2 = {}) {
    const nudgeRunOptions = {
      hidden: true,
      continuesTurn: true,
      advanceChainOnDelivery: options2.advanceChainOnDelivery,
      ackToken: options2.ackToken,
      traceCtx: options2.traceCtx,
      onModelResolved: (modelId) => options2.turn?.setModel(modelId),
      onPersistableRunStarted: options2.onPersistableRunStarted
    };
    let latest = result;
    let attempts2 = 0;
    let delivered = !isDeliveryOwed(result);
    let streamOutputProduced = result.streamOutputProduced === true;
    while (isDeliveryOwed(latest) && attempts2 < MAX_REPLY_NUDGES && epoch === this.tm.sendPipeline.currentTurnEpoch(session)) {
      attempts2++;
      latest = await runner.run(REPLY_NUDGE_PROMPT, nudgeRunOptions);
      delivered = delivered || !isDeliveryOwed(latest);
      streamOutputProduced = streamOutputProduced || latest.streamOutputProduced === true;
      if (latest.aborted) break;
    }
    if (latest.endedOnSilentToolCalls === true && !latest.aborted && latest.awaitingUserSelection !== true && latest.completionReason !== "send_to_user_end_turn" && epoch === this.tm.sendPipeline.currentTurnEpoch(session)) {
      setTurnTraceAttributes(options2.turnTrace, { "sand.closing_send_nudge": true });
      let nudged;
      try {
        nudged = await runner.run(CLOSING_SEND_NUDGE_PROMPT, nudgeRunOptions);
        latest = nudged;
        delivered = delivered || !isDeliveryOwed(nudged);
        streamOutputProduced = streamOutputProduced || nudged.streamOutputProduced === true;
      } finally {
        this.tm.telemetry.reportClosingSendNudge({
          conversationId: session.id,
          delivered: nudged != null && (nudged.sentMessageCount > 0 || nudged.reacted),
          sentMessageCount: nudged?.sentMessageCount ?? 0,
          aborted: nudged?.aborted ?? false
        });
      }
    }
    return {
      result: latest,
      replyNudgeAttempts: attempts2,
      deliveryOwed: !delivered,
      streamOutputProduced
    };
  }
  resolveReplyTarget(entries, candidateId) {
    return entries.some((entry) => entry.id === candidateId) ? candidateId : void 0;
  }
  buildReplyContext(entries, targetId) {
    if (targetId == null) return void 0;
    const target = entries.find((entry) => entry.id === targetId);
    if (target == null) return void 0;
    return { targetId, quote: describeRepliedMessageQuote(target) };
  }
  handleAgentUpdate(update, session) {
    const runSession = session ?? this.tm.runLifecycle.activeRunSession ?? this.tm.sessions.activeSession ?? null;
    const isForActiveAgent = runSession == null || runSession.id === this.tm.sessions.activeSession?.id;
    if (isForActiveAgent) {
      this.tm.roster.applyAgentUpdateToOutline(update);
    }
    if (runSession != null) {
      this.tm.runLifecycle.trackComposingFromUpdate(update, runSession.id);
      this.tm.runLifecycle.trackRetryingFromUpdate(update, runSession);
      this.tm.runLifecycle.trackActivityFromUpdate(update, runSession.id);
      this.tm.voiceCalls.overhear(update, runSession.id);
    }
    switch (update.type) {
      case "tool-call": {
        if (update.status === "pending" && runSession != null) {
          let starts = this.pendingToolCallStarts.get(runSession.id);
          if (starts == null) {
            starts = /* @__PURE__ */ new Map();
            this.pendingToolCallStarts.set(runSession.id, starts);
          }
          if (!starts.has(update.id)) starts.set(update.id, performance.now());
          const dual = sandDualSurfaceToolTelemetry(
            update.name,
            hasMachineTargetArgument(update.args)
          );
          if (dual != null) {
            let seen = this.reportedDualSurfaceToolCalls.get(runSession.id);
            if (seen == null) {
              seen = /* @__PURE__ */ new Set();
              this.reportedDualSurfaceToolCalls.set(runSession.id, seen);
            }
            if (!seen.has(update.id)) {
              seen.add(update.id);
              this.tm.telemetry.reportToolCallStarted({
                conversationId: runSession.id,
                requestId: this.tm.runLifecycle.lastRequestIdBySession.get(runSession.id),
                toolName: dual.toolName,
                toolCallId: update.id,
                surface: dual.surface
              });
            }
          }
        }
        if (update.status !== "pending" && runSession != null) {
          const starts = this.pendingToolCallStarts.get(runSession.id);
          const startedPerfMs = starts?.get(update.id);
          starts?.delete(update.id);
          if (update.status === "failed") {
            this.reportToolCallDiagnostic(runSession, {
              kind: "error",
              toolCallId: update.id,
              toolName: update.name,
              connector: UNKNOWN_CONNECTOR_TAG,
              errorClass: TASK_ERROR_RESULT_CLASS,
              ...startedPerfMs !== void 0 ? { durationMs: Math.round(performance.now() - startedPerfMs) } : {}
            });
          }
        }
        return void 0;
      }
      case "request-id": {
        if (runSession != null) {
          this.activeTurns.get(runSession.id)?.setRequestId(update.requestId);
          this.tm.runLifecycle.lastRequestIdBySession.set(runSession.id, update.requestId);
          this.tm.runLifecycle.trackTurnRequestId(runSession.id, update.requestId);
          if (this.activeTurnUserMessageIds.has(runSession.id) && !this.activeTurnRequestIds.has(runSession.id)) {
            this.activeTurnRequestIds.set(runSession.id, update.requestId);
            this.associateTurnUserMessages(runSession, update.requestId);
          }
        }
        void this.tm.runLifecycle.recordRequestId(update.requestId, runSession, update.source);
        return void 0;
      }
      case "turn-ended": {
        if (runSession != null) this.tm.runLifecycle.reportTurnUsage(runSession, update.usage);
        return void 0;
      }
      case "send-message": {
        if ((update.message.type === "text" || update.message.type === "attachment") && update.message.channel != null && update.message.channel.length > 0) {
          const voiceRefusal = this.tm.backgroundWakes.deliverToChannel(
            runSession,
            update.message,
            update.message.channel
          );
          if (voiceRefusal !== null) return void 0;
        }
        if (update.message.type === "listener-connect" && isListenerPlatform(update.message.platform)) {
          const ownerId = runSession?.id ?? this.tm.sessions.activeSession?.id;
          if (ownerId != null) {
            try {
              this.tm.onListenerConnectCard?.({
                agentId: ownerId,
                platform: update.message.platform
              });
            } catch {
            }
          }
        }
        if (update.message.type === "connector" && update.message.variant === "connect") {
          const ownerId = runSession?.id ?? this.tm.sessions.activeSession?.id;
          if (ownerId != null) {
            try {
              this.tm.onConnectorConnectCard?.({
                agentId: ownerId,
                connector: update.message.connector,
                ...update.message.serverId == null ? {} : { serverId: update.message.serverId }
              });
            } catch {
            }
          }
        }
        const entries = isForActiveAgent || runSession == null ? getTranscript() : runSession.db.getTranscriptEntries();
        const sendId = nextEntryId(entries, "send-message");
        const validatedMessage = this.tm.sendPipeline.validateAiReplyTarget(
          update.message,
          sendId,
          entries
        );
        const threadedMessage = this.tm.sendPipeline.applyAutoReplyThread(
          validatedMessage,
          runSession,
          entries
        );
        const attachmentBatchId = threadedMessage.type === "attachment" && runSession != null ? this.tm.sendPipeline.claimSendAttachmentBatchId(runSession.id) : void 0;
        const requestId2 = runSession == null ? void 0 : this.activeTurnRequestIds.get(runSession.id) ?? this.tm.runLifecycle.lastRequestIdBySession.get(runSession.id);
        const wake = runSession == null ? void 0 : agentWakeOf(this.activeRequestSources.get(runSession.id));
        const baseEntry = {
          ...createSendMessageEntry(sendId, threadedMessage, update.timestampMs),
          ...requestId2 != null ? { requestId: requestId2 } : {},
          ...wake != null ? { wake } : {},
          ...attachmentBatchId != null ? { batchId: attachmentBatchId } : {}
        };
        const boxStampedEntry = update.boxHandoff != null ? stampBoxRequestEntry(baseEntry, update.boxHandoff) : baseEntry;
        const stampedEntry = update.userForm != null ? stampUserFormEntry(boxStampedEntry, update.userForm) : boxStampedEntry;
        let routedEntry = stampedEntry;
        if (update.draftRoute != null) {
          routedEntry = {
            ...stampedEntry,
            draftRoute: update.draftRoute
          };
          if (update.draftRouteVerified != null) {
            routedEntry = {
              ...routedEntry,
              draftRouteVerified: update.draftRouteVerified
            };
          }
        }
        const entry = runSession != null && this.forkTurnSessions.has(runSession) ? { ...routedEntry, branched: true } : routedEntry;
        const credentialRequest = entry.message.type === "credential-request" ? entry.message.credentialRequest : null;
        if (credentialRequest != null) {
          const agentId = runSession?.id ?? this.tm.sessions.activeSession?.id;
          if (agentId != null) {
            this.tm.widgetResponses.scheduleCredentialRequestExpiry({
              agentId,
              entryId: sendId,
              expiresAtMs: credentialRequest.expiresAtMs
            });
          }
        }
        if (isForActiveAgent || runSession == null) {
          this.tm.sendPipeline.appendSendMessageEntry(entry);
          const activeId = runSession?.id ?? this.tm.sessions.activeSession?.id;
          if (credentialRequest?.autoFill === true && activeId != null) {
            void this.tm.widgetResponses.requestCredentialAutoFill({
              agentId: activeId,
              entryId: sendId,
              request: credentialRequest
            });
          }
          this.tm.ackObligations.fulfillAckObligation(activeId, update.ackToken);
          if (activeId != null) void this.tm.roster.emitAgentUpdate(activeId);
          return sendId;
        }
        runSession.db.appendTranscriptEntry(entry);
        if (credentialRequest?.autoFill === true) {
          void this.tm.widgetResponses.requestCredentialAutoFill({
            agentId: runSession.id,
            entryId: sendId,
            request: credentialRequest
          });
        }
        this.tm.ackObligations.fulfillAckObligation(runSession.id, update.ackToken);
        this.tm.sessionStore.markSessionActivity(runSession, {
          incrementsUnread: entryRaisesUnreadSignal(entry)
        });
        void this.tm.roster.emitAgentUpdate(runSession.id);
        return sendId;
      }
      case "auto-review-status": {
        const matchesCard = (entry) => entry.kind === "send-message" && entry.message.type === "auto-review-approval" && entry.message.approval.requestId === update.requestId;
        const applyStatus = (item) => item.kind === "send-message" && item.message.type === "auto-review-approval" && item.message.approval.requestId === update.requestId ? {
          ...item,
          message: {
            ...item.message,
            approval: {
              ...item.message.approval,
              status: update.status
            }
          }
        } : item;
        this.settleCardStatus({ runSession, isForActiveAgent, matchesCard, applyStatus });
        return void 0;
      }
      case "cookie-origin-approval-status": {
        const matchesCard = (entry) => isPendingCookieOriginApprovalEntry(entry) && entry.message.approval.requestId === update.requestId;
        const applyStatus = (item) => settlePendingCookieOriginApprovalEntry(item, update.status, update.requestId, {
          ...update.items === void 0 ? {} : { items: update.items },
          ...update.approvedItems === void 0 ? {} : { approvedItems: update.approvedItems }
        }) ?? item;
        this.settleCardStatus({ runSession, isForActiveAgent, matchesCard, applyStatus });
        return void 0;
      }
      case "local-tool-permission-status": {
        const matchesCard = (entry) => entry.kind === "send-message" && entry.message.type === "local-tool-permission" && entry.message.ask.requestId === update.requestId;
        const applyStatus = (item) => item.kind === "send-message" && item.message.type === "local-tool-permission" && item.message.ask.requestId === update.requestId ? {
          ...item,
          message: {
            ...item.message,
            ask: { ...item.message.ask, status: update.status }
          }
        } : item;
        this.settleCardStatus({ runSession, isForActiveAgent, matchesCard, applyStatus });
        return void 0;
      }
      case "react-to-message": {
        const emoji3 = update.emoji.trim();
        if (emoji3.length === 0 || !isMessageAddress(update.messageAddress)) {
          return void 0;
        }
        const reactSession = runSession ?? this.tm.sessions.activeSession ?? null;
        const target = reactSession != null && reactSession.id !== this.tm.sessions.activeSession?.id ? reactSession.db.getEntryById(update.messageAddress) : findEntry(update.messageAddress);
        if (target == null || !isUserMessageEntry(target)) return void 0;
        const applied = this.tm.widgetResponses.applyReaction({
          session: reactSession,
          entryId: update.messageAddress,
          emoji: emoji3,
          by: reactSession?.id ?? SAND_REACTION_AGENT
        });
        return applied != null ? update.messageAddress : void 0;
      }
      case "text-delta":
      case "thinking-delta":
      case "retrying":
        return void 0;
      default: {
        const _exhaustive = update;
        return _exhaustive;
      }
    }
  }
};

