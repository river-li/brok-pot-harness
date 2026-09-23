var SandSelfSummaryPromptToolExecutor = class extends SimplePromptToolExecutor {
  executeToolStream(...args) {
    const [
      ctx,
      state,
      interactionHandler,
      tools,
      _extra,
      _recordToolCallResult,
      descriptionProps,
      firstToolCallHook
    ] = args;
    const { toolCallDescriptors, ...result } = this.executeModelStreamOnly(
      ctx,
      state,
      interactionHandler,
      tools,
      descriptionProps,
      firstToolCallHook
    );
    return {
      ...result,
      response: Promise.all([result.response, toolCallDescriptors]).then(([response]) => response)
    };
  }
};
var SAND_AGENT_MAX_STEPS = 5e3;
function createSandBackgroundSummarizationProps(session, canUseSelfSummary, isSubagent, override) {
  const inputThreshold = () => {
    if (isSubagent || !canUseSelfSummary()) return void 0;
    const input = session.getEarlyCompaction();
    return input?.threshold !== void 0 && input.inputTokens >= input.threshold ? input.threshold : void 0;
  };
  return override ?? {
    get usedTokensThresholdToStartBackgroundSummarization() {
      return inputThreshold();
    },
    get usedTokensThresholdToPersistBackgroundSummarization() {
      return inputThreshold();
    },
    unusedTokensThresholdToStartBackgroundSummarization: 1e4,
    unusedPercentTokensThresholdToStartBackgroundSummarization: 0.1,
    unusedTokensThresholdToPersistBackgroundSummarization: 1e4,
    unusedPercentTokensThresholdToPersistBackgroundSummarization: 0.1,
    discardOnError: true,
    requireTriggerThresholdForMidLoopPersist: true
  };
}
function createSandPromptModelInfo(modelName) {
  return {
    vendor: "openai",
    modelName,
    promptVersion: "latest",
    isSonnet45: false,
    isGemini3: false,
    isGpt51: false,
    isGpt52: false,
    isGpt5: false,
    isSonnet4: false,
    isCodexFamily: false,
    isGpt52Codex: false,
    isGpt53Codex: false,
    isClaude4X: false,
    isOpus45: false,
    isOpus46: false,
    isGpt5Family: false,
    isComposer1: false,
    isComposer15: false,
    isComposer2: false,
    isGpt53CodexSpark: false
  };
}
function createTurnAgentComposition(host) {
  let subagentConfigsForRun;
  let executorProfileNamesForRun = /* @__PURE__ */ new Set();
  const automationSubagentRuns = /* @__PURE__ */ new Map();
  const disabledToolIdentifierSet = new Set(host.disabledToolIdentifiers ?? []);
  function createSubagentRunner(agentId, args, directionEpoch, loopDetection, inherited) {
    host.subagentOwnership?.assertOpen();
    const boxId = host.resolveBoxId();
    const remoteBoxPrewarm = host.remoteBoxHasDesktop ? remoteBoxPrewarmFor(args.subagentType, host.gates) : void 0;
    const preparedRemoteBoxConnection = remoteBoxPrewarm === void 0 ? void 0 : host.computerUse.prepareRemoteBox({ agentId, boxId, ...remoteBoxPrewarm });
    const isMediaReview = isMediaReviewSubagentType(args.subagentType);
    const mediaReviewSystemPrompt = isMediaReview ? findSubagentConfigByName(subagentConfigsForRun ?? [], args.subagentType)?.systemReminder?.(
      void 0
    ) : void 0;
    let systemPrompt = mediaReviewSystemPrompt;
    if (systemPrompt == null && inherited?.requestSource !== "automation") {
      systemPrompt = buildSandSubagentSystemPrompt({
        subagentType: args.subagentType,
        readonly: args.readonly
      });
    }
    const getAutoReviewParentConversationState = inherited?.sendMessageEnabled === true || host.isParentMediatedAutomationSubagent ? (ctx) => host.getAutoReviewConversationState(ctx) : void 0;
    return host.constructRunner({
      inference: host.inference,
      loggerBackend: host.loggerBackend,
      metricsBackend: host.metricsBackend,
      metricsHarness: host.metricsHarness,
      metricsSessionKind: host.metricsSessionKind,
      metricsClock: host.metricsClock,
      streamTuning: host.streamTuning,
      backgroundSummarizationPropsOverride: host.backgroundSummarizationPropsOverride,
      box: host.box,
      remoteBox: host.remoteBox,
      transport: inherited?.transport ?? host.subagentTransport,
      preparedRemoteBoxConnection,
      userComputers: host.userComputers,
      remoteBoxHasDesktop: host.remoteBoxHasDesktop,
      getRemoteBoxAvailable: host.getRemoteBoxAvailable,
      getBoxId: () => boxId,
      getAgentId: () => host.getConversationId(),
      onRunLifecycle: host.onRunLifecycle,
      onToolCallEvents: host.onToolCallEvents,
      requestContext: host.requestContext,
      modelVisibleTime: host.modelVisibleTime,
      webSearchService: host.webSearchService,
      webFetchService: host.webFetchService,
      ...host.disabledToolIdentifiers === void 0 ? {} : { disabledToolIdentifiers: host.disabledToolIdentifiers },
      actionAuditor: host.actionAuditor,
      actionAuditSequencer: host.actionAuditSequencer,
      ...host.attachBoxServers === void 0 ? {} : { attachBoxServers: host.attachBoxServers },
      navigationProbe: host.computerUse.getOrCreateNavigationProbe(),
      mcp: host.mcp(),
      createCloudAgentTool: host.createCloudAgentTool,
      gates: inherited?.sendMessageEnabled === true ? host.gates : pickSubagentGates(host.gates),
      loopDetectionMode: () => loopDetection !== void 0 ? loopDetectionModeOf(loopDetection) : host.loopDetectionMode?.() ?? "off",
      onLoopDetected: host.onLoopDetected,
      onLoopMitigation: host.onLoopMitigation,
      localToolPermission: host.localToolPermission,
      ...host.credentialFillLease === void 0 ? {} : { credentialFillLease: host.credentialFillLease },
      ...host.jevBrowserUse === void 0 ? {} : { jevBrowserUse: host.jevBrowserUse },
      inheritedDirectionEpoch: directionEpoch,
      autoReviewController: host.autoReviewController,
      autoReviewModes: host.autoReviewGate.currentModes(),
      getAutoReviewModes: host.getAutoReviewModes,
      autoReviewClassifierExecutor: host.autoReviewClassifierExecutor,
      getAutoReviewInstructions: host.getAutoReviewInstructions,
      hasUserComputer: host.hasUserComputer,
      isSubagent: true,
      ...inherited?.sendMessageEnabled === true ? { subagentSendMessageEnabled: true } : {},
      ...inherited?.sendMessageEnabled === true ? { parentMediatedAutomationSubagent: true } : {},
      ...getAutoReviewParentConversationState === void 0 ? {} : { getAutoReviewParentConversationState },
      subagentType: args.subagentType,
      subagentModelId: resolveSandSubagentModelId({
        subagentType: args.subagentType,
        modelId: args.modelId,
        acceptsExplicitModel: isMediaReview,
        executorProfileNames: executorProfileNamesForRun
      }),
      requestSource: inherited?.requestSource ?? host.activeTurnRequestSource(),
      automationId: inherited?.automationId ?? host.activeTurnAutomationId(),
      readVideoAttachmentBytes: host.readVideoAttachmentBytes,
      ...subagentInheritsBotSecrets(args.subagentType) ? { secretScopeId: host.secretScopeId, botSecrets: host.botSecrets } : {},
      transcriptMirror: host.transcriptMirror,
      subagentTranscriptId: agentId,
      persistImage: host.persistImage(),
      onComputerAction: host.onComputerAction,
      ...systemPrompt == null ? {} : { systemPrompt }
    });
  }
  function dispatchAutomationSubagent(args) {
    const existing = automationSubagentRuns.get(args.subagentAgentId);
    if (existing !== void 0) return existing;
    const subagentArgs = new SubagentArgs({
      subagentType: "generalPurpose",
      toolCallId: "",
      prompt: args.prompt,
      readonly: false
    });
    const runner = createSubagentRunner(args.subagentAgentId, subagentArgs, void 0, void 0, {
      requestSource: "automation",
      automationId: args.automationId,
      sendMessageEnabled: true,
      transport: createAutomationSubagentTransport(host.subagentTransport, {
        parentMediated: true
      })
    });
    host.subagents.sessions.set(args.subagentAgentId, runner);
    const subagentRequestId = computeSubagentRequestId(args.subagentAgentId);
    const nestedCompletions = [];
    runner.setBackgroundSubagentHandler?.((completion2) => {
      nestedCompletions.push(completion2);
    });
    runner.setBackgroundShellHandler?.((completion2) => {
      nestedCompletions.push(backgroundShellAsSubagentCompletion(completion2));
    });
    const automationWake = {
      id: args.automationId,
      name: args.automationName
    };
    const runOptions = {
      inferenceRequestId: subagentRequestId,
      hidden: true,
      isSilenceAllowed: true,
      ...args.onRequestId !== void 0 ? { onRequestId: args.onRequestId } : {},
      ...args.turnUnitId === void 0 ? {} : { turnUnitId: args.turnUnitId, turnUnitType: "wake" },
      automationWake: {
        ...automationWake,
        ...args.untrusted === true ? { untrusted: true } : {}
      }
    };
    const revivalRunOptions = {
      ...runOptions,
      resumeTurn: false,
      automationWake: { ...automationWake, untrusted: true }
    };
    const stopping = () => host.subagents.isAborting(args.subagentAgentId);
    function asAborted(result) {
      const { automationParentWake: _automationParentWake, ...rest } = result;
      return { ...rest, aborted: true };
    }
    const run = (async () => {
      let result = await runner.run(args.prompt, runOptions);
      while (!stopping() && result.automationParentWake === void 0 && ((runner.hasRunningBackgroundWork?.() ?? false) || nestedCompletions.length > 0)) {
        await runner.drainBackgroundWork?.();
        if (stopping()) break;
        const completions = nestedCompletions.splice(0);
        if (completions.length === 0) continue;
        result = await runner.run(
          buildSubagentRevival(completions, { canvasCursorAgentIds: host.canvasCursorAgentIds }),
          revivalRunOptions
        );
      }
      if (stopping() || result.automationParentWake !== void 0) {
        runner.setBackgroundSubagentHandler?.(() => void 0);
        runner.setBackgroundShellHandler?.(() => void 0);
        nestedCompletions.length = 0;
        if (stopping()) {
          await runner.drainBackgroundWork?.();
        } else {
          await runner.abortBackgroundWork?.("Automation handed off to its parent.");
        }
      }
      return stopping() ? asAborted(result) : result;
    })();
    const settlement = host.subagents.dispatchBackgroundSubagent({
      subagentAgentId: args.subagentAgentId,
      subagentType: "generalPurpose",
      toolCallId: "",
      subagentRequestId,
      prompt: args.prompt,
      quietOrigin: {
        automation: {
          id: args.automationId,
          name: args.automationName
        }
      },
      automationRunUuid: args.runUuid,
      run: () => run
    });
    const completion = settlement.then(async () => {
      const result = await run;
      return host.subagents.wasAborted(args.subagentAgentId) ? asAborted(result) : result;
    });
    automationSubagentRuns.set(args.subagentAgentId, completion);
    void completion.then(
      () => automationSubagentRuns.delete(args.subagentAgentId),
      () => automationSubagentRuns.delete(args.subagentAgentId)
    );
    return completion;
  }
  function buildAgentForRun(sessions, boxConnection, turnScope) {
    const {
      isSilenceAllowed,
      isGroupMemberTurn,
      loopDetection,
      privacyMode,
      quietOrigin,
      childRequestLineage,
      revivingDesktopSubagentAgentId: revivingDesktopSubagentAgentId2,
      directionEpoch,
      ackToken,
      pauseThisRun,
      completeThisRun,
      afterStepCheckpoint,
      streamWatchdog,
      updateObservers,
      isRunAwaitingUserSelection: isThisRunAwaitingUser,
      isRunCompletionRequested,
      turnEndThroughAgent,
      isTeamSetupUnderway,
      endThisRunAwaitingUser,
      requestAutomationParentWake,
      profilePromptSnapshot,
      prependedUserMessageDedupeFloorMessageId,
      onProfileUpdateAppended,
      userFormVaultKeys,
      diskPressureReminderEpisodeId,
      emittedConnectorCards,
      performanceObservation,
      captureFollowupLabelingMessages,
      conversationActionReceiver
    } = turnScope;
    const conservativeExecutorReuse = !host.isSystemPromptOverridden && host.gates.lessSubagentFanout();
    const machineIds = host.userComputers.list().map((machine) => machine.id);
    const sendToUserEndTurnEnabled = !host.isSubagentRunner && !host.isSystemPromptOverridden;
    const offerSendToUserEndTurn = () => sendToUserEndTurnEnabled;
    let userFormOfferEnabled;
    const offerUserForm = () => userFormOfferEnabled ??= host.gates.userForm({ logExposure: true });
    const systemPromptGenerator2 = host.systemPromptAssembly.createSystemPromptGeneratorForRun({
      profileSnapshot: profilePromptSnapshot,
      sendToUserEndTurnEnabled: offerSendToUserEndTurn,
      promptPolicy: { conservativeExecutorReuse }
    });
    const autoReviewModes = host.autoReviewGate.currentModes();
    const extractAutoReviewConversationContext = createSandAutoReviewClassifierContextExtractor(
      host.turnToolHost.getAutoReviewParentConversationState,
      { automationSubagent: host.isParentMediatedAutomationSubagent }
    );
    const autoReviewRequestContext = new RequestContext({
      env: new RequestContextEnv({
        smartModeClassifierAutoModeEnabled: true
      })
    });
    const getAutoReviewUserInstructions = () => host.autoReviewGate.userInstructions();
    const localToolPermission2 = host.localToolPermission;
    const getApprovalExpiryPolicy = () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource());
    const hostShellApprovalProvider = autoReviewModes.hostShell === "enforce" && host.autoReviewController !== void 0 ? createSandShellApprovalProvider({
      controller: host.autoReviewController,
      agentId: host.getConversationId(),
      surface: "host_shell",
      getExpiryPolicy: getApprovalExpiryPolicy,
      toolDecisionAudit: host.toolDecisionAudit,
      ...localToolPermission2 !== void 0 ? {
        beforeApproval: (request5) => localToolPermission2.awaitDesktopStandingDecision({
          agentId: host.getConversationId(),
          toolCallId: request5.toolCallId,
          signal: request5.signal,
          command: request5.command,
          ...request5.description !== void 0 ? { description: request5.description } : {},
          ...request5.machineId !== void 0 ? { machineId: request5.machineId } : {}
        })
      } : {}
    }) : void 0;
    const boxShellApprovalProvider = autoReviewModes.boxShell === "enforce" && host.autoReviewController !== void 0 ? createSandShellApprovalProvider({
      controller: host.autoReviewController,
      agentId: host.getConversationId(),
      surface: "box_shell",
      getExpiryPolicy: getApprovalExpiryPolicy,
      toolDecisionAudit: host.toolDecisionAudit
    }) : void 0;
    const mcpApprovalProvider = autoReviewModes.mcp === "enforce" && host.autoReviewController !== void 0 ? createSandMcpApprovalProvider({
      controller: host.autoReviewController,
      agentId: host.getConversationId(),
      getExpiryPolicy: getApprovalExpiryPolicy,
      toolDecisionAudit: host.toolDecisionAudit
    }) : void 0;
    const { agent: session, summarization: summarizationSession, canUseSelfSummary } = sessions;
    const applyDiskPressureReminder = diskPressureReminderEpisodeId !== null ? createDiskPressureReminderMiddleware(diskPressureReminderEpisodeId) : void 0;
    const turnToolHost = host.turnToolHost;
    const applyMcpUnavailableReminder = turnToolHost.isSubagentRunner && !turnToolHost.isParentMediatedAutomationSubagent || turnToolHost.mcp == null ? void 0 : createMcpUnavailableReminderMiddleware({
      isUnavailable: () => turnToolHost.isMcpDiscoveryUnavailableForTurn?.() === true,
      episodeId: childRequestLineage.parentRequestId
    });
    const applySendMessageReminder = createSendMessageReminderMiddleware({
      delegationWording: () => host.gates.sendToUserReminderDelegation()
    });
    const toolDescriptionSnapshots = host.toolDescriptionSnapshots();
    const applyFrozenToolDescriptions = toolDescriptionSnapshots === void 0 ? void 0 : createFrozenToolDescriptionsMiddleware({
      store: toolDescriptionSnapshots,
      compactionEpoch: () => host.compactionEpoch()
    });
    const applyStartOfTurnAckReminder = createStartOfTurnAckReminderMiddleware();
    const applyLoopNudge = loopDetection.kind === "active" ? createLoopNudgeMiddleware(loopDetection.multiMessage) : void 0;
    const onToolCallEvents = host.onToolCallEvents;
    const actionAuditor = host.actionAuditor;
    const toolCallEventSink = onToolCallEvents === void 0 && actionAuditor === void 0 ? void 0 : {
      getModelId: () => session.getModelId(),
      onEvents: (events) => {
        if (actionAuditor !== void 0) {
          const identity = { agentId: host.getConversationId(), boxId: host.resolveBoxId() };
          for (const event of events) {
            for (const decision of host.toolDecisionAudit?.settle(event, identity) ?? []) {
              actionAuditor.record(decision);
            }
            const record2 = toolResultAuditRecord(
              event,
              identity,
              host.toolTargets?.take(event.toolCallId)
            );
            if (record2 !== void 0) actionAuditor.record(record2);
          }
        }
        onToolCallEvents?.(
          events.map((event) => ({
            ...event,
            conversationId: host.getTranscriptId(),
            ...host.subagentType !== void 0 ? { subagentType: host.subagentType } : {}
          }))
        );
      }
    };
    const applyToolCallTelemetry = toolCallEventSink === void 0 ? void 0 : createToolCallEventMiddleware(toolCallEventSink);
    const outOfStepToolCallRecorder = toolCallEventSink === void 0 ? void 0 : createOutOfStepToolCallEventRecorder(toolCallEventSink);
    const toolSession = {
      getExecutor: () => {
        const baseExecutor = session.getExecutor();
        const frozenToolsExecutor = applyFrozenToolDescriptions?.(baseExecutor) ?? baseExecutor;
        const modelVisibleExecutor = createModelVisiblePathMiddleware(frozenToolsExecutor);
        const diskPressureExecutor = applyDiskPressureReminder?.(modelVisibleExecutor) ?? modelVisibleExecutor;
        const mcpUnavailableExecutor = applyMcpUnavailableReminder?.(diskPressureExecutor) ?? diskPressureExecutor;
        const reminderExecutor = chatSilenceRemindersCoverThisTurn({
          isSubagentRunner: host.isSubagentRunner,
          isSilenceAllowed,
          isGroupMemberTurn,
          requestSource: host.activeTurnRequestSource()
        }) ? applyStartOfTurnAckReminder(applySendMessageReminder(mcpUnavailableExecutor)) : mcpUnavailableExecutor;
        const executor = applyLoopNudge?.(reminderExecutor) ?? reminderExecutor;
        const automationCompletions = host.isSubagentRunner ? void 0 : host.automationCompletions();
        const snapshotExecutor = captureFollowupLabelingMessages === void 0 ? executor : createFirstStreamMessageSnapshotMiddleware(captureFollowupLabelingMessages)(executor);
        const completionAwareExecutor = automationCompletions === void 0 ? snapshotExecutor : createAutomationCompletionMiddleware(automationCompletions)(snapshotExecutor);
        const baseToolExecutor = new SimplePromptToolExecutor(
          completionAwareExecutor
        );
        const toolExecutor = applyToolCallTelemetry?.(baseToolExecutor) ?? baseToolExecutor;
        host.setLatestPromptMessagesGetter(() => toolExecutor.getMessages());
        return toolExecutor;
      }
    };
    const hasParentToolParity = !host.isSubagentRunner || host.isParentMediatedAutomationSubagent;
    const subagentLaunchReviewRequired = hasParentToolParity && autoReviewModes.subagentLaunch !== "off";
    const subagentHostAdapter = new SandSubagentHostAdapter(
      host.subagents.sessions,
      (agentId, args) => createSubagentRunner(agentId, args, directionEpoch, loopDetection),
      {
        dispatch: (params) => host.subagents.dispatchBackgroundSubagent({ ...params, quietOrigin }),
        getCombinedComputerUseDecision: host.subagents.getCombinedComputerUseDecision,
        isRunning: (subagentAgentId) => (host.subagentOwnership ?? host.subagents).isRunning(subagentAgentId),
        allocateComputerUseWindow: (subagentAgentId) => host.computerUse.allocateWindow(subagentAgentId),
        freeComputerUseWindow: (subagentAgentId) => host.computerUse.freeWindow(subagentAgentId)
      },
      subagentLaunchReviewRequired,
      host.detachedSubagents,
      quietOrigin,
      childRequestLineage,
      () => executorProfileNamesForRun,
      host.actionAuditSequencer,
      host.gates.browserUseJev() ? /* @__PURE__ */ new Map([["computerUse", "browserUseJev"]]) : void 0
    );
    const isUserFacingRunner = hasParentToolParity;
    const emitConnectorCard = (emission) => {
      if (host.isParentMediatedAutomationSubagent) return;
      const cardKey = `${emission.serverId}:${emission.variant}`;
      if (emittedConnectorCards.has(cardKey)) return;
      emittedConnectorCards.add(cardKey);
      host.emitUpdate(
        {
          type: "send-message",
          message: connectorCardEmissionToMessage(emission),
          timestampMs: Date.now(),
          ...ackToken != null ? { ackToken } : {}
        },
        updateObservers
      );
      armMcpAuthWait(host.turnToolHost.registerMcpAuthWait, emission);
    };
    const localEntries = [
      resourceEntry(subagentExecutorResource, createSubagentExecutor(subagentHostAdapter)),
      resourceEntry(
        requestContextExecutorResource,
        new SandRequestContextExecutor(
          host.requestContext,
          isUserFacingRunner,
          Object.values(autoReviewModes).includes("enforce"),
          isUserFacingRunner ? () => {
            const store = host.skillStore?.();
            if (store == null) return [];
            return toAgentSkills(store.list());
          } : void 0,
          host.modelVisibleTime
        )
      ),
      resourceEntry(subagentRegistryResource, new SubagentRegistry())
    ];
    if (host.autoReviewClassifierExecutor !== void 0 && Object.values(autoReviewModes).some((mode) => mode !== "off")) {
      localEntries.push(
        resourceEntry(smartModeClassifierExecutorResource, host.autoReviewClassifierExecutor)
      );
    }
    const mcpForTurn = host.mcp();
    if (mcpForTurn != null) {
      const mcpExecutor = mcpForTurn.createExecutor(
        host.persistImage(),
        host.promptGlue.createMcpTextSpiller(),
        {
          agentId: host.getConversationId()
        },
        host.mcpConfigJsonForTurn()
      );
      const mcp = mcpForTurn;
      const auditedMcpExecutor = host.actionAuditor != null ? wrapMcpExecutorForAudit(mcpExecutor, {
        auditor: host.actionAuditor,
        sequencer: host.actionAuditSequencer,
        agentId: host.getConversationId(),
        resolveTransport: (providerIdentifier) => mcp.resolveToolTransport(providerIdentifier),
        resolveDisplayName: (providerIdentifier) => mcp.resolveServerDisplayName?.(providerIdentifier)
      }) : mcpExecutor;
      const turnMcpExecutor = withPlaywrightSnapshotFallback(
        auditedMcpExecutor,
        host.turnToolHost.browserOperationHarness ?? "unavailable"
      );
      const connectCardEmittedForServer = /* @__PURE__ */ new Set();
      const surfaceNeedsAuthCard = async (providerIdentifier) => {
        if (!hasParentToolParity || mcp.resolveNeedsAuthSlot == null) {
          return null;
        }
        if (providerIdentifier.length === 0 || connectCardEmittedForServer.has(providerIdentifier)) {
          return null;
        }
        if (cursorScmProviderForMcpServerIdentifier(providerIdentifier) != null) {
          return null;
        }
        const slot = await mcp.resolveNeedsAuthSlot(providerIdentifier);
        if (slot == null) return null;
        if (host.isParentMediatedAutomationSubagent) {
          return `"${slot.serverName}" needs authentication. The automation cannot surface a connect card; call WakeParent with what the parent should ask the user to do.`;
        }
        connectCardEmittedForServer.add(providerIdentifier);
        emitConnectorCard({
          connector: slot.serverName,
          serverId: slot.serverId,
          variant: "connect"
        });
        return `"${slot.serverName}" needs authentication; its connect card is now in the chat. Finish unrelated work, then end your turn. You're resumed automatically when the user authorizes. Don't call AuthenticateMcpServer, send a link, or reach the service another way meanwhile.`;
      };
      const describeScmError = async (result, providerIdentifier, toolName) => {
        if (!hasParentToolParity || !host.turnToolHost.gates.scmConnectCard()) return null;
        if ((host.mcpConfigJsonForTurn()?.trim() ?? "").length > 0) return null;
        const scmError = scmToolErrorFromMcpResult(result, providerIdentifier);
        if (scmError == null) return null;
        if (host.isParentMediatedAutomationSubagent) {
          return `${scmError.provider} isn't usable from this automation (${scmError.code}). The automation cannot ask the user to connect it; call WakeParent with what the parent should ask the user to do.`;
        }
        return describeScmToolError(scmError, toolName);
      };
      localEntries.push(
        resourceEntry(mcpExecutorResource, {
          execute: async (ctx, args, options2) => {
            host.autoReviewGate.assertNoPendingApproval();
            const providerIdentifier = args.providerIdentifier.length > 0 ? args.providerIdentifier : args.serverIdentifier;
            const requestId2 = ctx.get(requestIdKey);
            const settleMcpExecObservation = host.observation.beginMcpExecObservation({
              toolCallId: args.toolCallId ?? "",
              connector: boundedConnectorTag(providerIdentifier),
              mcpTool: boundedMcpToolName(args.toolName.length > 0 ? args.toolName : args.name),
              resolveTransport: () => mcp.resolveToolTransport(providerIdentifier),
              windowIndex: playwrightBoxMcpWindowIndex(providerIdentifier),
              ...requestId2 != null ? { requestId: requestId2 } : {}
            });
            const scmWriteRefusal = await scmWriteBlock({
              providerIdentifier,
              toolName: args.name,
              tools: () => mcp.getTools(ctx, host.mcpConfigJsonForTurn()),
              blockedReason: host.turnToolHost.scmWriteBlockedReason
            });
            if (scmWriteRefusal !== null) {
              settleMcpExecObservation({ kind: "error", errorClass: "scm_write_gate" });
              return new McpResult({
                result: { case: "error", value: new McpError({ error: scmWriteRefusal }) }
              });
            }
            const attribution = { errorClass: null };
            let result;
            try {
              result = await turnMcpExecutor.execute(
                ctx.with(mcpExecAttributionKey, attribution),
                args,
                options2
              );
            } catch (error42) {
              settleMcpExecObservation({ kind: "error", errorClass: mcpErrorClassOf(error42) });
              throw error42;
            }
            if (result.result.case !== "error") {
              settleMcpExecObservation({
                kind: result.result.case === "success" && result.result.value.isError ? "tool_error" : "ok"
              });
              try {
                const note = await describeScmError(
                  result,
                  providerIdentifier,
                  args.toolName.length > 0 ? args.toolName : args.name
                );
                if (note != null) appendNoteToMcpResult(result, note);
              } catch (cardError) {
                reportHostDiagnostic({
                  kind: "scm_connect_surface_failed",
                  stage: "card_emit",
                  errorClass: errorLogTag(cardError)
                });
              }
              return result;
            }
            settleMcpExecObservation({
              kind: "error",
              errorClass: attribution.errorClass ?? MCP_ERROR_RESULT_CLASS
            });
            try {
              const note = await surfaceNeedsAuthCard(providerIdentifier);
              if (note != null) {
                result.result.value.error = `${result.result.value.error}
${note}`;
              }
            } catch (cardError) {
              reportHostDiagnostic({
                kind: "mcp_connect_card_failed",
                errorClass: errorLogTag(cardError)
              });
            }
            return result;
          }
        })
      );
      localEntries.push(
        resourceEntry(
          mcpStateExecutorResource,
          mcpForTurn.createStateExecutor(host.mcpConfigJsonForTurn())
        )
      );
    }
    if (host.actionAuditor != null || host.autoReviewController != null) {
      const base = boxConnection.remoteAccessor;
      const shellAudit = {
        auditor: host.actionAuditor,
        agentId: host.getConversationId(),
        target: (options2) => ({
          target: "user_machine",
          machineId: auditedUserMachineId(machineIds, options2)
        })
      };
      const baseShellStream = wrapShellStreamExecutorForAudit(
        base.get(shellStreamExecutorResource),
        shellAudit
      );
      const baseBackgroundShell = wrapBackgroundShellExecutorForAudit(
        base.get(backgroundShellExecutorResource),
        shellAudit
      );
      localEntries.push(
        resourceEntry(shellStreamExecutorResource, {
          execute: (ctx, args, options2) => {
            host.autoReviewGate.assertNoPendingApproval();
            return baseShellStream.execute(ctx, args, options2);
          }
        }),
        resourceEntry(backgroundShellExecutorResource, {
          execute: async (ctx, args, options2) => {
            host.autoReviewGate.assertNoPendingApproval();
            return await baseBackgroundShell.execute(ctx, args, options2);
          }
        })
      );
    }
    const resourceAccessor = new CombinedResourceAccessor(
      boxConnection.remoteAccessor,
      localEntries
    );
    const registerSubagentLaunchReviewer = (stateHandler) => {
      if (!subagentLaunchReviewRequired) return;
      subagentHostAdapter.setLaunchReviewer(async (reviewCtx, subagentArgs) => {
        const target = buildSandSubagentLaunchReviewTarget({
          prompt: subagentArgs.prompt,
          subagentType: subagentArgs.subagentType,
          readonly: subagentArgs.readonly,
          resume: subagentArgs.resumeAgentId !== void 0 && subagentArgs.resumeAgentId.length > 0
        });
        if (target === void 0) return { allowed: true };
        host.autoReviewGate.assertNoPendingApproval();
        return reviewSandSubagentAction({
          ctx: reviewCtx,
          toolCallId: subagentArgs.toolCallId,
          target,
          signal: reviewCtx.signal,
          options: {
            mode: autoReviewModes.subagentLaunch,
            agentId: host.getConversationId(),
            resourceAccessor,
            stateHandler,
            autoReviewController: host.autoReviewController,
            toolDecisions: host.toolDecisionAudit,
            getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource()),
            userAutoRunInstructions: getAutoReviewUserInstructions(),
            extractConversationContext: extractAutoReviewConversationContext
          }
        });
      });
    };
    const remoteBoxResourceAccessor = host.createRemoteBoxResourceAccessor();
    const webSearchService = host.webSearchService;
    const webFetchService = host.webFetchService;
    const subagentConfigs = !hasParentToolParity ? void 0 : buildSubagentConfigs({
      customSubagents: [],
      includeComputerUseSubagent: false,
      includeExploreSubagent: false,
      includeShellSubagent: false,
      includeBestOfNRunnerSubagent: false,
      includeDebugSubagent: false,
      includeBrowserUseSubagent: false,
      includeWatchVideoSubagent: true,
      includeVideoReviewSubagent: true,
      enableNestedSubagents: false,
      includeCursorGuideSubagent: false,
      includeCiInvestigatorSubagent: false,
      subagentModelOverrides: {}
    });
    subagentConfigsForRun = subagentConfigs;
    if (subagentConfigs != null && host.remoteBoxHasDesktop && host.getRemoteBoxAvailable()) {
      const combined = host.isCombinedComputerUseAvailable();
      const credentialFillEnabled = !host.isSubagentRunner && !host.isSystemPromptOverridden && host.turnToolHost.credentialAccess != null;
      if (host.gates.browserUseJev()) {
        subagentConfigs.push(createSandBrowserUseJevSubagentConfig());
      } else {
        subagentConfigs.push(
          createSandComputerUseSubagentConfig({ combined, credentialFillEnabled })
        );
      }
    }
    if (subagentConfigs != null && !host.isSystemPromptOverridden) {
      const generalPurposeIndex = subagentConfigs.findIndex(
        (config3) => getSubagentTypeName(config3.subagent_type) === GENERAL_PURPOSE_SUBAGENT_TYPE
      );
      const executorConfig = createSandExecutorSubagentConfig(conservativeExecutorReuse);
      if (generalPurposeIndex >= 0) {
        subagentConfigs.splice(generalPurposeIndex, 1, executorConfig);
      } else {
        subagentConfigs.push(executorConfig);
      }
    }
    const parentModelInfo = createSandPromptModelInfo(session.getModelId());
    const executorProfiles = subagentConfigs?.some(
      (config3) => getSubagentTypeName(config3.subagent_type) === EXECUTOR_SUBAGENT_TYPE
    ) ? host.inference.getExecutorProfiles?.(host.activeTurnRequestSource()) : void 0;
    executorProfileNamesForRun = new Set(
      executorProfiles?.profiles.map((profile) => profile.name) ?? []
    );
    const subagentModels = executorProfiles === void 0 ? createSubagentModels({
      [session.getModelId()]: { slug: session.getModelId() }
    }) : createSandExecutorProfileModels(executorProfiles);
    const geminiVideoAttachedMediaUrlProvider = scopeAttachedMediaToConversation({
      provider: host.inference.getGeminiVideoAttachedMediaUrlProvider?.(),
      transcriptId: host.getTranscriptId(),
      conversationId: host.getConversationId()
    });
    const usesGeminiDeveloperVideoUpload = host.isSubagentRunner && isMediaReviewSubagent(host.subagentType) && geminiVideoAttachedMediaUrlProvider !== void 0;
    const selfSummaryConfig = {
      promptSession: {
        getExecutor: (state) => {
          const sameToolDescriptionsAsTurn = session.getExecutorWithoutResolvedModelTracking(state);
          return new SandSelfSummaryPromptToolExecutor(
            applyFrozenToolDescriptions?.(sameToolDescriptionsAsTurn) ?? sameToolDescriptionsAsTurn
          );
        }
      },
      canUseSelfSummary,
      enableTranscriptEnrichment: true,
      promptVariant: host.gates.generalizedSelfSummaryPrompt() ? "generalized" : "coding",
      ...host.isSubagentRunner ? {} : { preserveUserDeliveryTail: SAND_IDLE_DELIVERY_TAIL }
    };
    const config2 = {
      maxSteps: SAND_AGENT_MAX_STEPS,
      modelId: session.getModelId(),
      agentTokenLimit: lastReportedContextWindow(session.getModelId()),
      selfSummaryConfig,
      backgroundSummarizationProps: createSandBackgroundSummarizationProps(
        session,
        canUseSelfSummary,
        host.isSubagentRunner,
        host.backgroundSummarizationPropsOverride
      ),
      pendingSummaryStore: host.pendingSummaryStore,
      ...turnEndThroughAgent ? { isTurnEndRequested: isRunCompletionRequested } : {},
      agentType: AgentType.IDE,
      featureFlags: {
        enableWatchVideoInIdeSubagent: true,
        sandSendMessageDeliveryOwed: host.gates.sendMessageDeliveryOwed(),
        /*
         * Per-turn timestamps stay in the appended suffix so a calendar-day
         * change does not invalidate the cached prompt prefix.
         * https://developers.openai.com/api/docs/guides/prompt-caching
         */
        userMessageTimestamps: true,
        rerenderUserInfoOnRequestContextRecovery: true,
        rerenderUserInfoOnSummarization: true,
        rerenderUserInfoOnTeamRulesChange: true,
        /*
         * The offloaded tool set and the subagent roster follow live box,
         * device, and gate state. Rewriting the first message for them
         * would drop the provider cache for the whole conversation, so the
         * current catalogs ride on the new user turn instead. The static
         * GetDynamicTools description follows the same policy: the two
         * surfaces render the same names, and one half alone recovers no cache.
         */
        deferUserInfoCatalogRerender: true,
        skipPreTurnStateSnapshot: true,
        ...usesGeminiDeveloperVideoUpload ? { geminiVideoAttachmentSignedUrlMaxBytes: GEMINI_VIDEO_SUBAGENT_MAX_BYTES } : {}
      },
      ...loopDetection.kind === "active" ? { singleMessageLoopDetection: loopDetection.singleMessage } : {},
      conversationId: host.getTranscriptId(),
      conversationGroupId: host.getConversationId(),
      attachedMediaUrlProvider: usesGeminiDeveloperVideoUpload ? geminiVideoAttachedMediaUrlProvider : void 0,
      systemPromptGenerator: systemPromptGenerator2,
      getUserInfoMemoryContext: () => host.systemPromptAssembly.getMemoryContextForUserInfo(),
      messageHistoryModifier: profilePromptSnapshot != null && onProfileUpdateAppended != null ? (messages2) => host.promptGlue.appendProfileUpdateToHistory(
        messages2,
        profilePromptSnapshot,
        onProfileUpdateAppended
      ) : void 0,
      toolsGenerator: (props) => {
        registerSubagentLaunchReviewer(props.stateHandler);
        const toolSetHandle = buildTurnTools(
          host.turnToolHost,
          {
            toolSession,
            summarizationSession,
            childRequestLineage,
            revivingDesktopSubagentAgentId: revivingDesktopSubagentAgentId2,
            conservativeExecutorReuse,
            config: config2,
            subagentConfigs,
            parentModelInfo,
            subagentModels,
            executorProfileSelectionEnabled: executorProfiles !== void 0,
            geminiVideoAttachedMediaUrlProvider,
            boxConnection,
            resourceAccessor,
            remoteBoxResourceAccessor,
            webSearchService,
            webFetchService,
            summarizationHandler: createSandSummarizationHandler(summarizationSession, {
              preserveLatestImage: host.isBoxScopedSubagent
            }),
            autoReviewModes,
            getAutoReviewUserInstructions,
            autoReviewRequestContext,
            hostShellApprovalProvider,
            boxShellApprovalProvider,
            mcpApprovalProvider,
            isThisRunAwaitingUser,
            isTeamSetupUnderway,
            ackToken,
            emitConnectorCard,
            pauseThisRun,
            completeThisRun,
            offerSendToUserEndTurn,
            offerUserForm,
            updateObservers,
            endThisRunAwaitingUser,
            requestAutomationParentWake,
            machineIds,
            userFormVaultKeys,
            privacyMode
          },
          props
        );
        if (disabledToolIdentifierSet.size === 0) return toolSetHandle;
        return toolSetHandle.transformToolsInPlace(
          (tools) => tools.filter((tool) => !disabledToolIdentifierSet.has(tool.toolIdentifier))
        );
      },
      webScraperService: new NoopWebScraperService(),
      documentationHydrationService: new NoopDocumentationHydrationService(),
      userInfoDisplayOptions: {
        disable: host.isBoxScopedSubagent,
        displayCursorRules: true,
        displaySkills: isUserFacingRunner,
        excludeAgentTranscripts: !hasParentToolParity || host.requestContext.resolve().transcriptsFolder == null
      },
      enableTerminalFiles: false,
      enableTranscriptInSummary: true,
      ...turnScope.summarizeActionMode === void 0 ? {} : { summarizeActionMode: turnScope.summarizeActionMode },
      prependedUserMessageDedupeFloorMessageId,
      fireAndForgetCheckpoints: host.fireAndForgetCheckpoints,
      afterStepCheckpoint: (_ctx, persisted) => afterStepCheckpoint(persisted)
    };
    const agent = new AnysphereAgent(
      config2,
      toolSession,
      toRedactedInteractionListener(
        new ForwardingInteractionListener(
          (update) => {
            streamWatchdog.noteUpdate(update);
            host.emitUpdate(update, updateObservers);
          },
          {
            onToolCall: (event, callId, toolCall) => {
              if (toolCall.tool.case === "mcpToolCall") {
                const args = toolCall.tool.value.args;
                host.observation.noteToolCallModelName(callId, args?.toolName || args?.name || "");
              }
              host.observation.observeAwaitToolCall(
                event,
                callId,
                toolCall,
                isThisRunAwaitingUser()
              );
              performanceObservation.toolCall({
                event,
                callId,
                toolName: toolCall.tool.case ?? "unknown"
              });
            },
            resolveToolName: (event, callId, outlineName) => host.toolCallIdentity.resolveModelToolName(event, callId, outlineName),
            onSurfaceUnresolvedPending: (callId, update) => host.toolCallIdentity.stashSurfaceUnresolvedPending(callId, update),
            onSummaryLifecycle: () => streamWatchdog.resetDeadline()
          }
        ),
        privacyMode
      ),
      resourceAccessor,
      host.getBlobStore(),
      createSandSummarizationHandler(summarizationSession, {
        preserveLatestImage: host.isBoxScopedSubagent
      }),
      conversationActionReceiver ?? new NoopConversationActionReceiver()
    );
    return { agent, outOfStepToolCallRecorder };
  }
  return { buildAgentForRun, dispatchAutomationSubagent };
}
