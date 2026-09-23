function loopMitigationOutcomeOf(turnOutcome2) {
  switch (turnOutcome2) {
    case "success":
      return "success";
    case "awaiting_user":
      return "awaiting_user";
    case "aborted":
    case "quiesced_for_upgrade":
      return "aborted";
  }
}
function stampsInferenceTurnUnit(options2, host) {
  if (options2.turnUnitId == null) return false;
  if (options2.isGroupMemberTurn === true) return false;
  return !host.isSubagentRunner || host.isParentMediatedAutomationSubagent;
}
var SandEmptyPromptError = class extends Error {
  constructor() {
    super("Type a message before sending");
  }
};
var SandTurnInterruptedBeforeDispatchError = class extends Error {
  constructor() {
    super("Turn interrupted before dispatch");
  }
};
var RESUME_TURN_ACTION = new ConversationAction({
  action: { case: "resumeAction", value: new ResumeAction() }
});
var SUMMARIZE_ACTION = new ConversationAction({
  action: { case: "summarizeAction", value: new SummarizeAction() }
});
function createIdleCompactionCollector() {
  const requestIds = /* @__PURE__ */ new Set();
  let servedModel;
  const usage = { inputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0, outputTokens: 0 };
  const observer = {
    onRequestStart: () => ({
      onStreamEnd: () => {
      },
      onServedModel: (modelId) => {
        servedModel = modelId;
      },
      onUsage: (call) => {
        usage.inputTokens += call.inputTokens;
        usage.cacheReadTokens += call.cacheReadTokens;
        usage.cacheWriteTokens += call.cacheWriteTokens;
        usage.outputTokens += call.outputTokens;
      }
    })
  };
  return {
    observer,
    noteRequestId: (requestId2) => {
      requestIds.add(requestId2);
    },
    summary: () => ({
      requestIds: [...requestIds],
      ...servedModel === void 0 ? {} : { servedModel },
      usage: { ...usage }
    })
  };
}
var mcpStartupDeadline = createDeadlinePolicy({
  name: "mcp-turn-start-discovery",
  timeoutMs: 5e3
});
var nextTurnSeq = 0;
function getToolDescriptionUpdatesForTurn(host) {
  const store = host.toolDescriptionSnapshots();
  if (store === void 0) return null;
  const resolved = resolveFrozenToolDescriptionUpdates({
    snapshot: store.getToolDescriptionSnapshot(),
    compactionEpoch: host.getConversationState().summaryArchives.length
  });
  const text2 = renderFrozenToolDescriptionUpdates(resolved.updates);
  if (text2 === null || resolved.snapshotToPersist === void 0) return null;
  const snapshotToPersist = resolved.snapshotToPersist;
  return { text: text2, commit: () => store.setToolDescriptionSnapshot(snapshotToPersist) };
}
function createTurnRunShell(host) {
  const resolvedModelTracker = createSandResolvedModelTracker();
  const errorFreeSteps = createErrorFreeStepTracker({
    ctx: host.ctx,
    harness: host.metricsHarness,
    clock: host.metricsClock,
    isSubagentRunner: host.isSubagentRunner,
    inheritedRequestSource: host.inheritedRequestSource,
    userMessagesAccepted: host.metricsUserMessagesAccepted
  });
  let pausingForUpgrade = false;
  let cancelActiveRun = null;
  let activeRunDispatched = false;
  let activeRunRecoveryShaped = false;
  let unfinishedTasksReminderPending = false;
  let markActiveRunSupersededByUser = null;
  let clearActiveRunStopRequest = null;
  const steerInbox = new SandSteerInbox();
  function steer(prompt, options2 = {}) {
    if (host.steerReach.kind === "unsupported-harness") return { kind: "unsupported-harness" };
    return steerInbox.enqueue(prompt, options2);
  }
  function interrupt(reason, supersede) {
    const hadActiveRun = cancelActiveRun != null;
    if (hadActiveRun && !activeRunDispatched && supersede != null && (!supersede.carriesRecovery || !activeRunRecoveryShaped)) {
      return false;
    }
    if (hadActiveRun) {
      if (activeRunDispatched && supersede != null) {
        unfinishedTasksReminderPending = true;
      }
      host.setActiveRunInterrupted(true);
      clearActiveRunStopRequest?.();
      if (supersede != null) {
        markActiveRunSupersededByUser?.();
      }
    }
    cancelActiveRun?.(new SandRunAbortError({ intentional: true, reason }));
    return hadActiveRun;
  }
  function requestPauseForUpgrade() {
    pausingForUpgrade = true;
  }
  function isPausingForUpgrade() {
    return pausingForUpgrade;
  }
  function cancelPauseForUpgrade() {
    pausingForUpgrade = false;
  }
  function interruptAll(reason) {
    const hadActiveRun = interrupt(reason);
    for (const subagentAgentId of host.subagents.sessions.keys()) {
      host.subagents.abortSubagent({ subagentAgentId, reason });
    }
    return hadActiveRun;
  }
  async function discoverTurnStartMcpTools(ctx, mcpConfigJson) {
    host.setMcpDiscoveryUnavailableForTurn(false);
    host.setMcpConfigJsonForTurn(mcpConfigJson);
    const mcp = host.mcp();
    if (mcp == null) {
      return { kind: "resolved", tools: [] };
    }
    let tools = [];
    try {
      tools = [
        ...await traceSendPhase(ctx, "mcp.getTools", async (childCtx) => {
          const [discoveryCtx, cancelDiscovery] = childCtx.withCancel();
          try {
            return await mcpStartupDeadline.run(
              () => mcp.getTools(discoveryCtx, mcpConfigJson),
              childCtx.signal
            );
          } catch (error42) {
            cancelDiscovery(error42);
            throw error42;
          }
        })
      ];
    } catch (error42) {
      if (ctx.canceled) return { kind: "canceled", error: error42 };
      host.noteMcpToolDiscoveryFailed(error42);
    }
    mcp.refreshAccountConfig();
    return { kind: "resolved", tools };
  }
  async function run(prompt, options2 = {}) {
    const conversationId = host.getConversationId();
    beginTurnBotBlock({ conversationId });
    const hostReceiptPerfMs = host.metricsClock.monotonicNow();
    const errorFreeStep2 = errorFreeSteps.beginRun(options2, hostReceiptPerfMs);
    const performanceObservation = createTurnPerformanceObservation({
      ctx: host.ctx,
      harness: host.metricsHarness,
      sessionKind: host.metricsSessionKind,
      turnKind: host.metricsTurnKind?.(),
      initiator: classifySandTurnInitiator({
        isSubagentRunner: host.isSubagentRunner,
        isTopLevelAutomationSubagent: host.isParentMediatedAutomationSubagent,
        isGroupMemberTurn: options2.isGroupMemberTurn,
        requestSource: options2.requestSource ?? host.inheritedRequestSource
      }),
      startedAt: hostReceiptPerfMs,
      activityStartedAt: host.metricsActivityStartedAt,
      runRole: options2.metricsRunRole ?? "other",
      ...options2.metricsRunRole === "turn_start" && host.metricsUserMessageSentAt !== void 0 ? { userMessageSentAt: host.metricsUserMessageSentAt } : {},
      ...options2.metricsRunRole === "turn_start" && host.metricsTurnStartedAt !== void 0 ? { turnStartedAt: host.metricsTurnStartedAt } : {},
      clock: host.metricsClock
    });
    let outcome = "error";
    let failure2;
    try {
      const result = await runTurn(
        prompt,
        options2,
        hostReceiptPerfMs,
        performanceObservation,
        errorFreeStep2
      );
      outcome = resolveTurnTraceOutcome(result);
      return result;
    } catch (error42) {
      failure2 = error42;
      throw error42;
    } finally {
      const tags = resolveTurnOutcomeTags({ conversationId, outcome, error: failure2 });
      performanceObservation.complete(tags.outcome, tags.errorType);
      errorFreeStep2?.ended(tags.outcome, tags.errorType);
    }
  }
  async function runTurn(prompt, options2, hostReceiptPerfMs, performanceObservation, errorFreeStep2) {
    var _stack = [];
    try {
      const turnRequestSource = options2.requestSource ?? host.inheritedRequestSource;
      host.setActiveTurnRequestSource(turnRequestSource);
      if (turnRequestSource !== void 0 || options2.continuesTurn !== true) {
        host.setActiveTurnInitiatedBy(
          sandAuditInitiatedByOf({
            isSubagentRunner: host.isSubagentRunner,
            isTopLevelAutomationSubagent: host.isParentMediatedAutomationSubagent,
            isGroupMemberTurn: options2.isGroupMemberTurn,
            isConnectorWake: options2.isConnectorWake,
            requestSource: turnRequestSource
          })
        );
      }
      host.setActiveTurnAutomationWakeId(options2.automationWake?.id);
      host.setActiveTurnAutomationWakeEmbedsExternalEvent(
        options2.automationWake === void 0 ? void 0 : options2.automationWake.untrusted === true
      );
      host.setActiveTurnAutomationWakeEmail(options2.automationWake?.email);
      if (!host.isSubagentRunner && options2.autoReviewEpoch !== "continue") {
        host.beginAutoReviewUserMessageEpoch();
      }
      const [promptText, revival] = typeof prompt === "string" ? [prompt, void 0] : [prompt.prompt, prompt];
      const trimmedPrompt = promptText.trim();
      const selectedImageInputs = options2.selectedImages ?? [];
      const attachedFilePaths = options2.attachedFilePaths ?? [];
      const selectedVideoInputs = options2.selectedVideos ?? [];
      const resumeTurn = options2.resumeTurn === true;
      const idleCompaction = options2.idleCompaction === void 0 ? void 0 : createIdleCompactionCollector();
      const idleServedModel = options2.idleCompaction?.armingTurnServedModel;
      const promptlessAction = idleCompaction !== void 0 ? SUMMARIZE_ACTION : RESUME_TURN_ACTION;
      const actionOnly = resumeTurn || idleCompaction !== void 0;
      if (!actionOnly && trimmedPrompt.length === 0 && selectedImageInputs.length === 0 && attachedFilePaths.length === 0 && selectedVideoInputs.length === 0) {
        throw new SandEmptyPromptError();
      }
      const inferenceRequestId = options2.inferenceRequestId ?? crypto.randomUUID();
      const skipLabeling = host.isSubagentRunner || options2.hidden === true || options2.isGroupMemberTurn === true || idleCompaction !== void 0;
      const advanceChainOnDelivery = options2.hidden === true && !host.isSubagentRunner && options2.isGroupMemberTurn !== true && options2.advanceChainOnDelivery !== false;
      bindTurnBotBlock({
        conversationId: host.getConversationId(),
        turnId: inferenceRequestId
      });
      const lifecycleIdentity = {
        requestId: inferenceRequestId,
        conversationId: host.getTranscriptId(),
        source: turnRequestSource,
        initiator: classifySandTurnInitiator({
          isSubagentRunner: host.isSubagentRunner,
          isTopLevelAutomationSubagent: host.isParentMediatedAutomationSubagent,
          isGroupMemberTurn: options2.isGroupMemberTurn,
          requestSource: turnRequestSource
        }),
        lineage: options2.lineage,
        isGroupMemberTurn: options2.isGroupMemberTurn === true,
        startedAtMs: Date.now()
      };
      let runLifecycleEnded = false;
      const endRunLifecycle = () => {
        if (runLifecycleEnded) return;
        runLifecycleEnded = true;
        host.emitRunLifecycle({
          type: "ended",
          ...lifecycleIdentity,
          endedAtMs: Date.now()
        });
      };
      const transcriptId = host.getTranscriptId();
      const loopDetection = host.resolveTurnLoopDetection(inferenceRequestId, {
        turnId: inferenceRequestId,
        rootTurnId: options2.lineage?.rootParentRequestId ?? inferenceRequestId,
        subagentId: transcriptId !== host.getConversationId() ? transcriptId : void 0
      });
      let loopMitigationOutcome = "error";
      host.emitRunLifecycle({ type: "started", ...lifecycleIdentity });
      const _runLifecycle = __using(_stack, {
        [Symbol.dispose]: endRunLifecycle
      });
      const _settleLoopMitigations = __using(_stack, {
        [Symbol.dispose]: () => loopDetection.settleTurn(loopMitigationOutcome)
      });
      if (!host.isSubagentRunner && options2.autoReviewEpoch !== "continue") {
        host.localToolPermission?.beginTurn(host.getConversationId());
      }
      const runDirectionEpoch = host.isSubagentRunner ? host.inheritedDirectionEpoch : host.localToolPermission?.directionEpoch(host.getConversationId());
      const propagatedSpan = options2.traceCtx !== void 0 ? getSpan2(options2.traceCtx) : void 0;
      const turnTraceAttributes = {
        ...options2.automationWake != null ? { "sand.automation_id": options2.automationWake.id } : {},
        ...host.isSubagentRunner && host.subagentType != null ? { "sand.subagent_type": host.subagentType } : {}
      };
      const turnTrace = __using(_stack, (() => {
        if (propagatedSpan === void 0) {
          return beginTurnTrace({
            conversationId: host.getConversationId(),
            turnType: resolveTurnTraceType(options2),
            ...Object.keys(turnTraceAttributes).length > 0 ? { attributes: turnTraceAttributes } : {}
          });
        }
        if (host.isSubagentRunner) {
          return beginTurnTrace({
            parentCtx: options2.traceCtx,
            conversationId: host.getConversationId(),
            turnType: resolveTurnTraceType(options2),
            ...Object.keys(turnTraceAttributes).length > 0 ? { attributes: turnTraceAttributes } : {}
          });
        }
        return void 0;
      })());
      const parentSpan = turnTrace?.span ?? propagatedSpan;
      const spanBase = parentSpan !== void 0 ? host.ctx.with(SPAN_KEY2, parentSpan) : host.ctx;
      const runSpan = __using(_stack, createSpan(spanBase.withName("runner.run")));
      const runCtx = host.stampInheritableRunAttributes(
        runSpan.ctx,
        inferenceRequestId,
        resolveTurnTraceType(options2)
      );
      setTurnTraceAttributes(turnTrace, {
        "sand.request_id": inferenceRequestId
      });
      if (propagatedSpan !== void 0 && options2.hidden !== true && options2.inferenceRequestId === void 0) {
        host.stampCallerTurnRootRequestId(propagatedSpan, inferenceRequestId);
      }
      const conversationId = host.getConversationId();
      const generation = host.runGeneration();
      const turnSeq = ++nextTurnSeq;
      const diskPressureReminder = host.isSubagentRunner || idleCompaction !== void 0 ? void 0 : host.diskPressureReminder;
      const diskPressureReminderClaim = {
        agentId: conversationId,
        claimId: inferenceRequestId
      };
      let diskPressureReminderEpisodeId = null;
      const commitDiskPressureReminder = () => {
        if (diskPressureReminderEpisodeId !== null && diskPressureReminder?.commit(diskPressureReminderClaim) === true) {
          diskPressureReminderEpisodeId = null;
        }
      };
      const automationOriginPart = options2.automationWake != null ? { automation: options2.automationWake } : {};
      const runQuietOrigin = options2.isSilenceAllowed === true ? { ...automationOriginPart } : void 0;
      const turnAutomationId = options2.automationWake != null ? stableAutomationId({
        agentId: conversationId,
        localId: options2.automationWake.id
      }) : host.inheritedAutomationId;
      host.setActiveTurnAutomationId(turnAutomationId);
      const lineage = options2.lineage;
      const delegationAuditor = createDelegationAuditor(host.actionAuditor(), host);
      let baseCtx = runCtx.with(conversationIdKey, host.getTranscriptId()).with(conversationGroupIdKey, conversationId).with(secretScopeIdKey, host.secretScopeId).with(automationIdKey, turnAutomationId).with(sandQuietWorkOriginKey, runQuietOrigin).with(sandDelegationAuditorKey, delegationAuditor).with(sandTurnDirectionEpochKey, runDirectionEpoch).with(requestIdKey, inferenceRequestId).with(requestIdKey2, inferenceRequestId).with(suppressAgentLoopEvidencePreviewKey, loopDetection.kind === "active");
      if (lineage != null) {
        baseCtx = baseCtx.with(parentRequestIdKey2, lineage.parentRequestId).with(rootParentRequestIdKey2, lineage.rootParentRequestId).with(parentRequestIdKey, lineage.parentRequestId).with(rootParentRequestIdKey, lineage.rootParentRequestId);
        if (lineage.parentAgentToolCallId != null) {
          baseCtx = baseCtx.with(parentAgentToolCallIdKey2, lineage.parentAgentToolCallId).with(parentAgentToolCallIdKey, lineage.parentAgentToolCallId);
        }
      }
      if (host.isSubagentRunner && host.subagentType != null) {
        baseCtx = baseCtx.with(subagentTypeKey2, host.subagentType).with(subagentTypeKey, host.subagentType);
      }
      baseCtx = baseCtx.with(turnUnitIdKey, void 0).with(turnUnitTypeKey, void 0);
      if (stampsInferenceTurnUnit(options2, host)) {
        baseCtx = baseCtx.with(turnUnitIdKey, options2.turnUnitId).with(turnUnitTypeKey, options2.turnUnitType);
      }
      const [ctx, cancelRun] = baseCtx.withCancel();
      const _releaseTurnContext = __using(_stack, {
        [Symbol.dispose]: () => cancelRun(new SandRunAbortError({ intentional: true, reason: "turn run settled" }))
      });
      for (const settledDelegation of revival?.settledDelegations ?? []) {
        delegationAuditor?.completed(ctx, settledDelegation);
      }
      const streamWatchdog = createStreamWatchdog();
      let supersededByUser = false;
      let stopRequest = { kind: "none" };
      let deferredFollowupLabeling;
      cancelActiveRun = cancelRun;
      steerInbox.beginRun();
      clearActiveRunStopRequest = () => {
        stopRequest = { kind: "none" };
      };
      markActiveRunSupersededByUser = () => {
        supersededByUser = true;
      };
      const mcpToolsDiscovery = discoverTurnStartMcpTools(ctx, options2.mcpConfigJson);
      let automationParentWake;
      const requestAutomationParentWake = host.isParentMediatedAutomationSubagent ? (message) => {
        if (automationParentWake !== void 0) return;
        automationParentWake = message;
        cancelRun(
          new SandRunAbortError({
            intentional: true,
            reason: "automation requested parent mediation"
          })
        );
      } : void 0;
      const settle = createTurnSettle(
        {
          isSubagentRunner: host.isSubagentRunner,
          isRunSuperseded: () => host.runGeneration() !== generation,
          wasSupersededByUser: () => supersededByUser,
          ownsRunner: () => cancelActiveRun === cancelRun,
          getAwaitingUserInputTurnId: () => stopRequest.kind === "awaiting-user" ? stopRequest.requestId : void 0,
          getCompletedTurnId: () => stopRequest.kind === "complete" ? stopRequest.requestId : void 0,
          agentStore: () => host.agentStore(),
          getBlobStore: () => host.getBlobStore(),
          setLocalState: (state) => {
            host.setLocalState(state);
          },
          transcriptMirror: host.transcriptMirror,
          getTranscriptId: () => host.getTranscriptId(),
          persistAnnouncedAgentProfile: (store, turnSnapshot, identity) => host.systemPromptAssembly.persistAnnouncedAgentProfile(store, turnSnapshot, identity),
          recordPostTurnLabeling: host.inference.recordPostTurnLabeling != null ? (args) => host.inference.recordPostTurnLabeling?.(args) : void 0,
          recordFollowupLabeling: host.inference.recordFollowupLabeling != null ? (args) => host.inference.recordFollowupLabeling?.(args) : void 0,
          latestPromptMessages: () => host.latestPromptMessagesGetter()?.() ?? []
        },
        {
          conversationId,
          turnSeq,
          memoryStore: host.memoryStore(),
          episodeProgress: host.episodeProgress(),
          profilePromptSnapshots: host.profilePromptSnapshots()
        }
      );
      activeRunDispatched = false;
      const rawTranscriptText = options2.messageId != null ? options2.recentUserMessages?.find((message) => message.id === options2.messageId)?.text : void 0;
      activeRunRecoveryShaped = options2.messageId != null && selectedImageInputs.length === 0 && attachedFilePaths.length === 0 && selectedVideoInputs.length === 0 && options2.replyContext == null && rawTranscriptText != null && rawTranscriptText === trimmedPrompt;
      host.setActiveRunIsCanceled(() => ctx.canceled);
      host.setActiveRunInterrupted(false);
      const isRunAwaitingUserSelection = () => stopRequest.kind === "awaiting-user";
      const isRunStopped = () => stopRequest.kind !== "none";
      const completeThisRun = (requestId2 = inferenceRequestId) => {
        if (!ctx.canceled && cancelActiveRun === cancelRun && stopRequest.kind === "none") {
          stopRequest = { kind: "complete", requestId: requestId2 };
        }
      };
      const pauseThisRun = (requestId2 = inferenceRequestId) => {
        if (ctx.canceled) return;
        if (cancelActiveRun === cancelRun) {
          stopRequest = { kind: "awaiting-user", requestId: requestId2 };
          return;
        }
        cancelRun(
          new SandRunAbortError({
            intentional: true,
            reason: "awaiting user selection (escaped run)"
          })
        );
      };
      const endThisRunAwaitingUser = (reason) => {
        if (cancelActiveRun === cancelRun) {
          stopRequest = { kind: "awaiting-user", requestId: inferenceRequestId };
        }
        cancelRun(new SandRunAbortError({ intentional: true, reason }));
      };
      let aborted2 = false;
      let pausedForUpgrade = false;
      const inFlightStepCheckpoints = /* @__PURE__ */ new Set();
      const drainStepCheckpoints = async () => {
        while (inFlightStepCheckpoints.size > 0) {
          await Promise.allSettled(inFlightStepCheckpoints);
        }
      };
      const stopRunIfRequested = () => {
        if (ctx.canceled) return;
        if (isRunStopped()) {
          cancelRun(
            new SandRunAbortError({
              intentional: true,
              reason: isRunAwaitingUserSelection() ? "awaiting user selection" : "SendToUser completed turn"
            })
          );
        } else if (pausingForUpgrade) {
          pausedForUpgrade = true;
          cancelRun(
            new SandRunAbortError({
              intentional: true,
              reason: "quiescing for forced host upgrade"
            })
          );
        }
      };
      const afterStepCheckpoint = (persisted) => {
        inFlightStepCheckpoints.add(persisted);
        void persisted.finally(() => inFlightStepCheckpoints.delete(persisted));
        stopRunIfRequested();
      };
      let finalState;
      let armedDispatchObservation;
      let sessionForLabeling;
      const updateObservers = createRunUpdateObservers({
        collectors: settle.collectors,
        observeFirstToken: (chunkType) => armedDispatchObservation?.observeFirstToken(chunkType),
        pause: pauseThisRun,
        onDelivered: (update) => {
          switch (update.type) {
            case "send-message":
              performanceObservation.firstMessageDispatch();
              errorFreeStep2?.visibleOutput("message");
              return;
            case "text-delta":
              if (update.text.length > 0) errorFreeStep2?.visibleOutput("text");
              return;
            case "tool-call":
              errorFreeStep2?.visibleOutput("tool_call");
              return;
            default:
              return;
          }
        }
      });
      try {
        if (!host.isSubagentRunner) {
          await host.conversationSizeGuard?.();
        }
        await host.awaitAutoReviewPolicy?.();
        const privacyMode = await host.inference.resolvePrivacyMode();
        if (ctx.canceled) {
          throw new SandTurnInterruptedBeforeDispatchError();
        }
        diskPressureReminderEpisodeId = diskPressureReminder?.claim(diskPressureReminderClaim) ?? null;
        const profilePromptSnapshot = host.systemPromptAssembly.prepareAgentProfilePromptSnapshot(
          host.profilePromptSnapshots()
        );
        settle.setProfileSnapshot(profilePromptSnapshot);
        const profileUpdateForTurn = idleCompaction !== void 0 ? null : host.systemPromptAssembly.getAgentProfileUpdateForTurn(profilePromptSnapshot);
        if (profileUpdateForTurn != null) {
          settle.noteProfileUpdateAppended(profileUpdateForTurn.identity);
        }
        const frozenSectionUpdate = actionOnly ? null : host.systemPromptAssembly.getFrozenSectionUpdatesForTurn();
        const toolDescriptionUpdate = actionOnly ? null : getToolDescriptionUpdatesForTurn(host);
        const instructionsUpdateForTurn = [frozenSectionUpdate?.text, toolDescriptionUpdate?.text].filter((text2) => text2 !== void 0).join("\n\n");
        const appendUnfinishedTasksReminder = !actionOnly && (unfinishedTasksReminderPending || options2.unfinishedTasksReminder === true);
        const {
          action,
          automationStatusReminder,
          automationStatusCompactionEpoch,
          prependedUserMessageDedupeFloorMessageId
        } = actionOnly ? {
          action: promptlessAction,
          automationStatusReminder: null,
          automationStatusCompactionEpoch: 0,
          prependedUserMessageDedupeFloorMessageId: void 0
        } : await host.promptGlue.assembleTurnAction({
          runCtx,
          trimmedPrompt,
          options: options2,
          profileUpdateForTurn,
          instructionsUpdateForTurn: instructionsUpdateForTurn.length > 0 ? instructionsUpdateForTurn : null,
          appendUnfinishedTasksReminder,
          compactionEpoch: () => host.getConversationState().summaryArchives.length,
          shellWatchHost: host.shellWatchHost()
        });
        frozenSectionUpdate?.commit();
        toolDescriptionUpdate?.commit();
        const boxId = host.resolveBoxId();
        const emitRequestId = (requestId2) => {
          options2.onRequestId?.(requestId2);
          idleCompaction?.noteRequestId(requestId2);
          host.emitUpdate({ type: "request-id", requestId: requestId2 });
        };
        const executorProfile = host.subagentType === "executor" ? host.subagentModelId : void 0;
        const mainSessionOptions = {
          ...executorProfile === void 0 ? { modelId: host.subagentModelId } : { executorProfile },
          inferenceReason: isMediaReviewSubagent(host.subagentType) ? InferenceReason.GEMINI_VIDEO_SUBAGENT : void 0,
          isSubagent: host.isSubagentRunner,
          isComputerUseSubagent: host.isComputerUseSubagent,
          isBrowserUseSubagent: host.isBrowserUseSubagent,
          requestSource: turnRequestSource,
          skipLabeling,
          ...lineage != null ? { lineage } : {}
        };
        const promptPrefixObservation = createPromptPrefixObservation({
          ctx: runCtx,
          harness: host.metricsHarness,
          conversationId: () => host.getConversationId(),
          requestId: () => inferenceRequestId,
          requestSource: () => turnRequestSource,
          compactionEpoch: () => host.getConversationState().summaryArchives.length,
          sectionShas: () => host.systemPromptAssembly.getLastRenderedSectionShas(),
          snapshots: host.promptPrefixSnapshots(),
          telemetry: host.promptPrefixTelemetry()
        });
        const session = sanitizePromptSessionUsage(
          await traceSendPhase(
            runCtx,
            "inference.createSession",
            async () => host.inference.createSession(emitRequestId, mainSessionOptions)
          ),
          resolvedModelTracker,
          (modelId) => {
            performanceObservation.noteModelResolved(modelId);
            armedDispatchObservation?.noteModelResolved(modelId);
          },
          composeSandPromptStreamObservers(
            performanceObservation.streamObserver,
            promptPrefixObservation.streamObserver,
            idleCompaction?.observer
          ),
          composeSandPromptStreamObservers(
            promptPrefixObservation.streamObserver,
            idleCompaction?.observer
          )
        );
        sessionForLabeling = session;
        options2.onModelResolved?.(session.getModelId());
        if (host.isComputerUseSubagent) {
          host.computerUse.recordModelId(session.getModelId());
        }
        const summarizationSession = sanitizePromptSessionUsage(
          host.inference.createSession(
            (requestId2) => {
              idleCompaction?.noteRequestId(requestId2);
              host.emitUpdate({ type: "request-id", requestId: requestId2 });
            },
            {
              modelId: SAND_SUMMARIZATION_MODEL_ID,
              isSummarizationSession: true,
              ...lineage != null ? { lineage } : {}
            }
          ),
          void 0,
          void 0,
          composeSandPromptStreamObservers(
            promptPrefixObservation.streamObserver,
            idleCompaction?.observer
          )
        );
        const turnStartedAtMs = Date.now();
        const baseState = ConversationStateStructure.fromBinary(
          host.getConversationState().toBinary()
        );
        const transcriptPersistence = settle.noteBaseState(baseState, privacyMode);
        if (transcriptPersistence === "enabled") {
          options2.onPersistableRunStarted?.(inferenceRequestId);
          await host.transcriptMirror?.recover(
            baseCtx,
            host.getTranscriptId(),
            baseState,
            host.getBlobStore()
          );
        } else {
          await host.transcriptMirror?.skipCheckpoint(
            baseCtx,
            host.getTranscriptId(),
            baseState,
            host.getBlobStore()
          );
        }
        if (ctx.canceled) {
          throw new SandTurnInterruptedBeforeDispatchError();
        }
        const userFormVaultKeysPromise = host.resolveUserFormVaultKeysForRun?.().catch((error42) => {
          console.warn(
            `[sand:user-form-vault] keys-catalog fetch failed; request_user_form carries no catalog this run: ${errorLogTag(error42)}`
          );
          return void 0;
        }) ?? Promise.resolve(void 0);
        const boxConnection = await traceSendPhase(ctx, "box.ensureReady", async (childCtx) => {
          try {
            return await host.box.ensureReady(
              childCtx.with(
                sandBackgroundWorkRegistryKey,
                host.backgroundWatches.registry().forTurn(runQuietOrigin)
              ),
              boxId
            );
          } catch (error42) {
            if (error42 instanceof SandBoxDaemonUnreachableError) {
              const reason = boxNotReadyReasonForError(error42);
              throw new SandBoxNotReadyError(reason.errorKind, reason.message, { cause: error42 });
            }
            throw error42;
          }
        });
        const emittedConnectorCards = /* @__PURE__ */ new Set();
        await traceSendPhase(
          ctx,
          "botTemplateShare.prepareScope",
          () => host.prepareBotTemplateShareScope()
        );
        const mcpDiscovery = await mcpToolsDiscovery;
        if (mcpDiscovery.kind === "canceled") {
          throw mcpDiscovery.error;
        }
        const mcpTools = mcpDiscovery.tools;
        host.setMcpConnectedServerNamesForTurn(mcpTools.map((tool) => tool.providerIdentifier));
        host.setMcpCustomInstructionsForTurn(await host.promptGlue.resolveMcpCustomInstructions());
        const userFormVaultKeys = await userFormVaultKeysPromise;
        const buildTurnAgent = (turnSession) => {
          return host.turnAgentComposition.buildAgentForRun(
            {
              agent: turnSession,
              canUseSelfSummary: () => {
                const resolved = turnSession.getResolvedModelId();
                if (resolved === void 0 && idleServedModel !== void 0) {
                  return idleServedModel.selfSummary;
                }
                return sandSelfSummarySupported(resolved ?? turnSession.getModelId());
              },
              summarization: summarizationSession
            },
            boxConnection,
            {
              isSilenceAllowed: options2.isSilenceAllowed ?? false,
              isGroupMemberTurn: options2.isGroupMemberTurn ?? false,
              loopDetection,
              privacyMode,
              quietOrigin: runQuietOrigin,
              childRequestLineage: {
                parentRequestId: inferenceRequestId,
                rootParentRequestId: lineage?.rootParentRequestId ?? inferenceRequestId
              },
              revivingDesktopSubagentAgentId: options2.revivingDesktopSubagentAgentId,
              directionEpoch: runDirectionEpoch,
              ackToken: options2.ackToken,
              pauseThisRun,
              completeThisRun,
              afterStepCheckpoint,
              streamWatchdog,
              updateObservers,
              isRunAwaitingUserSelection,
              isTeamSetupUnderway: () => options2.teamSetupUnderway === true,
              endThisRunAwaitingUser,
              requestAutomationParentWake,
              profilePromptSnapshot,
              prependedUserMessageDedupeFloorMessageId,
              ...userFormVaultKeys !== void 0 ? { userFormVaultKeys } : {},
              diskPressureReminderEpisodeId,
              onProfileUpdateAppended: settle.noteProfileUpdateAppended,
              emittedConnectorCards,
              performanceObservation,
              conversationActionReceiver: steerInbox.receiver(privacyMode),
              ...idleCompaction === void 0 ? {} : { summarizeActionMode: "threshold" },
              ...skipLabeling || host.inference.recordFollowupLabeling == null ? {} : {
                captureFollowupLabelingMessages: settle.captureFollowupLabelingMessages
              }
            }
          );
        };
        const { agent, outOfStepToolCallRecorder } = await traceSendPhase(
          ctx,
          "buildAgentForRun",
          async () => buildTurnAgent(session)
        );
        if (ctx.canceled) {
          throw new SandTurnInterruptedBeforeDispatchError();
        }
        if (appendUnfinishedTasksReminder) {
          unfinishedTasksReminderPending = false;
        }
        activeRunDispatched = true;
        const ttftTraceSpan = options2.traceCtx !== void 0 ? getSpan2(options2.traceCtx) : void 0;
        if (ttftTraceSpan !== void 0) {
          armedDispatchObservation = host.observation.armDispatchObservation({
            runCtx,
            setRunAttribute: (key, value) => runSpan.span.setAttribute(key, value),
            addRunEvent: (name17, attributes) => runSpan.span.addEvent(name17, attributes),
            conversationId: host.getConversationId(),
            traceId: ttftTraceSpan.spanContext().traceId,
            spanId: ttftTraceSpan.spanContext().spanId,
            isFork: options2.isFork === true,
            hostReceiptPerfMs,
            enterEpochMs: options2.enterEpochMs,
            resolveModelId: () => session.getResolvedModelId() ?? session.getModelId()
          });
        }
        let checkpointChain = Promise.resolve();
        const streamAttempt = createStreamAttempt({
          ctx,
          streamTuning: host.streamTuning,
          transientStreamRetry: options2.transientStreamRetry != null || host.isSubagentRunner ? { ...host.streamTuning.headlessRetry, ...options2.transientStreamRetry } : void 0,
          hidden: options2.hidden === true,
          startStream: (attemptCtx, resumeFrom, persistCheckpoint) => {
            attemptCtx.signal.throwIfAborted();
            const state = resumeFrom ?? baseState;
            const pausedTurnId = resumeFrom != null && stopRequest.kind === "awaiting-user" ? stopRequest.requestId : host.agentStore()?.getAwaitingUserInputTurnId?.();
            const completedTurnId = resumeFrom != null && stopRequest.kind === "complete" ? stopRequest.requestId : host.agentStore()?.getCompletedTurnId?.();
            const stoppedTurnId = pausedTurnId ?? completedTurnId;
            if ((resumeTurn || resumeFrom != null) && stoppedTurnId !== void 0 && (options2.inferenceRequestId === void 0 || stoppedTurnId === inferenceRequestId) && state.pendingToolCalls.length === 0) {
              if (pausedTurnId === void 0) completeThisRun(stoppedTurnId);
              else pauseThisRun(stoppedTurnId);
              return Promise.resolve(state);
            }
            return agent.runStream(
              attemptCtx.with(turnToolCallAttributionStartKey, (callId) => {
                performanceObservation.toolCall({ event: "toolCallStarted", callId });
              }).with(toolCallEventRecorderKey, outOfStepToolCallRecorder),
              toRedactedConversationStateStructure(state, privacyMode),
              toRedactedConversationAction(
                resumeFrom != null ? RESUME_TURN_ACTION : action,
                privacyMode
              ),
              mcpTools,
              persistCheckpoint
            );
          },
          persistCheckpoint: (checkpointCtx, checkpoint, noteCheckpoint) => {
            const previous = checkpointChain;
            const settled = Promise.withResolvers();
            checkpointChain = settled.promise;
            return previous.then(async () => {
              try {
                if (host.runGeneration() !== generation || cancelActiveRun !== cancelRun) return;
                settle.prepareCheckpointForPersistence(checkpoint);
                await settle.persistStepCheckpoint(checkpointCtx, checkpoint);
                host.onPersistedCheckpoint?.();
                options2.onStepCheckpointPersisted?.();
                noteCheckpoint(checkpoint);
                await host.automationCompletions()?.commitCheckpoint();
                commitDiskPressureReminder();
                if (automationStatusReminder != null) {
                  host.promptGlue.noteAutomationStatusReminder(
                    automationStatusReminder,
                    automationStatusCompactionEpoch
                  );
                }
                if (checkpoint.pendingToolCalls.length === 0) stopRunIfRequested();
              } finally {
                settled.resolve();
              }
            });
          },
          drainStepCheckpoints,
          getStreamOutputProduced: streamWatchdog.getStreamOutputProduced,
          setStreamOutputProduced: streamWatchdog.setStreamOutputProduced,
          streamDeadlineConfig: () => host.streamDeadlineConfig(),
          setDeadlineHooks: streamWatchdog.setDeadlineHooks,
          clearDeadlineHooksIf: streamWatchdog.clearDeadlineHooksIf,
          clock: host.streamDeadlineClock,
          setTraceAttributes: (attributes) => setTurnTraceAttributes(runSpan, attributes),
          reportTurnRetry: (observation) => {
            host.observation.reportTurnRetry(observation);
            performanceObservation.retry(observation);
          },
          emitRetrying: () => host.emitUpdate({ type: "retrying" })
        });
        try {
          finalState = await streamAttempt.run();
        } finally {
          if (cancelActiveRun === cancelRun) steerInbox.endRun();
          performanceObservation.stopObservingInference();
          promptPrefixObservation.finalize();
          if (cancelActiveRun === cancelRun && !host.isSubagentRunner && idleCompaction === void 0) {
            const parentPrompt = promptPrefixObservation.parentTurnPrompt(session.getModelId());
            const resolvedModelId = session.getResolvedModelId();
            if (parentPrompt !== void 0) {
              host.noteParentTurnPrompt?.({
                ...parentPrompt,
                ...resolvedModelId === void 0 ? {} : {
                  servedModel: {
                    modelId: resolvedModelId,
                    selfSummary: sandSelfSummarySupported(resolvedModelId)
                  }
                }
              });
            }
          }
        }
        aborted2 = ctx.canceled && !isRunStopped() && !pausedForUpgrade;
        endRunLifecycle();
        if (!aborted2 && !pausedForUpgrade) {
          await settle.settleCompletedTurn({
            finalState,
            session,
            baseCtx,
            turnStartedAtMs,
            hidden: options2.hidden === true,
            trimmedPrompt,
            skipLabeling
          });
          settle.recordFinalizedFollowupLabeling({
            session,
            baseCtx,
            skipLabeling,
            advanceChainOnDelivery
          });
        }
      } catch (error42) {
        endRunLifecycle();
        if (!ctx.canceled) {
          markTurnTraceError(runSpan, error42);
          markTurnTraceError(turnTrace, error42);
          throw error42;
        }
        aborted2 = !isRunStopped() && !pausedForUpgrade;
      } finally {
        armedDispatchObservation?.settle();
        const ownsRunner = cancelActiveRun === cancelRun;
        if (aborted2 && supersededByUser && sessionForLabeling != null) {
          settle.recordFinalizedFollowupLabeling({
            session: sessionForLabeling,
            baseCtx,
            skipLabeling,
            advanceChainOnDelivery
          });
        } else if (aborted2 && sessionForLabeling != null) {
          deferredFollowupLabeling = settle.prepareFinalizedFollowupLabeling(
            {
              session: sessionForLabeling,
              baseCtx,
              skipLabeling,
              advanceChainOnDelivery
            },
            { supersededByUser: true }
          );
        }
        if (ownsRunner) {
          steerInbox.endRun();
          host.setLatestPromptMessagesGetter(void 0);
          cancelActiveRun = null;
          activeRunDispatched = false;
          activeRunRecoveryShaped = false;
          markActiveRunSupersededByUser = null;
          clearActiveRunStopRequest = null;
          host.observation.flushPendingAwaitsOnUnwind();
          host.setActiveRunIsCanceled(() => false);
          host.setActiveRunInterrupted(false);
        }
        try {
          if (ownsRunner && finalState != null && host.runGeneration() === generation) {
            await settle.persistFinalState(baseCtx, finalState);
            host.onPersistedCheckpoint?.();
            options2.onStepCheckpointPersisted?.();
            await host.automationCompletions()?.commitCheckpoint();
            commitDiskPressureReminder();
          }
        } finally {
          host.automationCompletions()?.rollbackCheckpoint();
          diskPressureReminder?.release(diskPressureReminderClaim);
        }
      }
      const result = settle.buildResult({
        aborted: automationParentWake === void 0 && aborted2,
        pausedForUpgrade,
        awaitingUserSelection: isRunAwaitingUserSelection(),
        streamOutputProduced: streamWatchdog.getStreamOutputProduced()
      });
      if (isRunStopped() && !isRunAwaitingUserSelection()) {
        result.completionReason = "send_to_user_end_turn";
        setTurnTraceAttributes(runSpan, { "sand.completion_reason": result.completionReason });
        setTurnTraceAttributes(turnTrace, { "sand.completion_reason": result.completionReason });
      }
      if (automationParentWake !== void 0) {
        result.automationParentWake = automationParentWake;
      }
      if (deferredFollowupLabeling !== void 0) {
        result.deferredFollowupLabeling = deferredFollowupLabeling;
      }
      if (idleCompaction !== void 0) {
        result.idleCompactionSummary = idleCompaction.summary;
      }
      const traceOutcome = resolveTurnTraceOutcome(result);
      const turnOutcome2 = adjustTurnOutcomeForBotBlock({
        conversationId: host.getConversationId(),
        outcome: traceOutcome
      }).outcome;
      setTurnTraceAttributes(runSpan, { "sand.outcome": turnOutcome2 });
      setTurnTraceAttributes(turnTrace, { "sand.outcome": turnOutcome2 });
      loopMitigationOutcome = loopMitigationOutcomeOf(traceOutcome);
      return result;
    } catch (_2) {
      var _error = _2, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  return {
    run,
    steer,
    interrupt,
    interruptAll,
    requestPauseForUpgrade,
    isPausingForUpgrade,
    cancelPauseForUpgrade
  };
}
