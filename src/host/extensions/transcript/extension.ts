/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
init_dist4();
init_scheduling();

// @recovered-fragment 2/3
init_sand_agent_model();
init_errors();

// @recovered-fragment 3/3
var transcriptExtension = defineHostExtension({
  id: "transcript",
  dependencies: [
    HostExtensions.Attachments,
    HostExtensions.ContentSearch,
    HostExtensions.CredentialProvider,
    HostExtensions.Experiments,
    HostExtensions.Inference,
    HostExtensions.Mcp,
    HostExtensions.Memory,
    HostExtensions.RemoteAgentMessaging,
    HostExtensions.Secrets,
    HostExtensions.Session,
    HostExtensions.Telemetry,
    HostExtensions.Trays,
    HostExtensions.TurnExecution,
    HostExtensions.UserFormVault
  ],
  start: (context2) => {
    const sandRoot = getSandRootDir();
    const manager = new TranscriptManager(
      context2.deps.session.store,
      new SandUpgradeResumeStore(sandRoot),
      new SandAckObligationStore(sandRoot),
      new PromptAcceptanceLedger(sandRoot),
      new SandPendingWakeStore(sandRoot),
      void 0,
      void 0,
      void 0,
      {
        runLifecycle: context2.host.environment.runLifecycle,
        recreateWakeCarryDisabled: context2.host.environment.recreateWakeCarryDisabled,
        agentInboundCoalesceMs: context2.host.environment.agentInboundCoalesceMs,
        interruptedUserTurnStore: new SandInterruptedUserTurnStore(sandRoot)
      }
    );
    manager.setTelemetry(context2.deps.telemetry.brain);
    manager.setCloudAgentMetrics({
      ctx: createContext().with(loggerKey, { log: () => {
      } }).with(metricsKey, context2.deps.telemetry.metrics),
      harness: "box"
    });
    manager.setProductAnalytics(context2.deps.telemetry.analytics);
    manager.setTraceFlusher(context2.deps.telemetry.flushTracing);
    manager.setHostLog(
      (message, level) => context2.deps.telemetry.logs.reportHostLog(level, message)
    );
    manager.setMemory(context2.deps.memory);
    manager.setContentSearch(context2.deps["content-search"]);
    manager.setAttachments(context2.deps.attachments);
    manager.setTrayErrors(context2.deps.trays);
    manager.setBoxSecretStore(async (secret) => {
      const status = await context2.deps.secrets.setSecret(secret);
      return status.isApplied;
    });
    manager.setTemporalMemberDelegate(context2.deps["remote-agent-messaging"]);
    manager.setCredentialAutoFillPort(
      (args) => context2.deps["credential-provider"].requestAutoFill(args)
    );
    manager.setUserFormPort({
      end: (agentId, requestId2) => context2.deps.session.endUserForm(agentId, requestId2),
      recordResolution: (report) => context2.deps.session.recordUserFormResolution(report),
      fill: (agentId, values, consentedHost, submitAfterFill) => context2.deps.session.fillUserForm(agentId, values, consentedHost, submitAfterFill),
      holdForRemap: (agentId, hold) => context2.deps.session.holdUserFormForRemap(agentId, hold),
      settleRemap: (args) => context2.deps.session.settleUserFormRemap(args),
      startHandoff: (request5) => context2.deps.session.startHandoff(request5)
    });
    manager.setUserFormVault(context2.deps["user-form-vault"]);
    manager.setAutomationAgentGoneTerminalGate(
      () => context2.deps.experiments.checkFeatureGate("sand_automation_agent_gone_terminal", {
        disableExposureLog: true
      })
    );
    manager.setAutomationSubagentGate(
      () => context2.deps.experiments.checkFeatureGate("sand_subagent_automation", {
        disableExposureLog: false
      })
    );
    manager.voiceCalls.setOverheardGate(
      () => context2.deps.experiments.checkFeatureGate("sand_voice_call_overheard", {
        disableExposureLog: true
      })
    );
    manager.voiceCalls.setSteerGate(
      () => context2.deps.experiments.checkFeatureGate("sand_voice_steer", {
        disableExposureLog: true
      })
    );
    manager.voiceCalls.setFinalWordGate(
      () => process.env.GROKBOT_LOCAL_MODE === "1" || context2.deps.experiments.checkFeatureGate("sand_voice_final_word", {
        disableExposureLog: true
      })
    );
    const cardCopyDeadline = createDeadlinePolicy({
      name: "sand-voice-call-card-copy",
      timeoutMs: VOICE_CALL_CARD_COPY_DEADLINE_MS
    });
    manager.voiceCalls.setCardCopyAuthor(
      (record2) => authorVoiceCallCardCopy({
        record: record2,
        deadline: cardCopyDeadline,
        createExecutor: () => context2.deps.inference.port.createSession(() => {
        }, {
          modelId: SAND_SUMMARIZATION_MODEL_ID,
          isSummarizationSession: true,
          skipLabeling: true
        }).getExecutor()
      })
    );
    manager.roster.setOutlineStreamCoalescing(
      createDebouncePolicy({
        name: "transcript-outline-stream",
        delayMs: OUTLINE_STREAM_COALESCE_MS
      })
    );
    const execution = context2.deps["turn-execution"];
    manager.setTurnExecution({
      get canExecute() {
        return execution.canExecute;
      },
      get canExecuteGroupMember() {
        return execution.canExecute;
      },
      get isLocalWorkAllowed() {
        return execution.isLocalWorkAllowed;
      },
      isRunReady: () => execution.isRunReady(),
      createRunner: (session, hooks) => execution.createRunner(session, hooks),
      createGroupMemberRunner: (session, hooks) => execution.createGroupMemberRunner(session, hooks)
    });
    manager.setAutomationConfigChanged(() => {
      void context2.host.events.emit("transcript.automation-config-changed", {});
    });
    manager.setListenerConnectObserver(({ agentId, platform: platform2 }) => {
      void context2.host.events.emit("transcript.listener-connect-card", {
        agentId,
        platform: platform2
      });
    });
    manager.turnRuntime.onUserTurnSettled = (event) => {
      void context2.host.events.emit("transcript.user-turn-settled", event);
    };
    manager.draftExecution = createDraftExecutionAdapter(context2.deps.mcp.mcp);
    void manager.draftSends.sweepStrandedDraftSends();
    const bootStartedAtMs = realClock.now();
    const sweepExpiredVirtualCardsOnBoot = async () => {
      await context2.host.whenBackgroundWorkReady;
      try {
        await manager.widgetResponses.expireAllPendingVirtualCardApprovalCards({
          ifPendingBeforeMs: bootStartedAtMs - PENDING_VIRTUAL_CARD_TTL_SECONDS * 1e3
        });
      } catch (error42) {
        context2.host.log(`virtual card boot sweep failed (${errorLogTag(error42)})`);
      }
    };
    void sweepExpiredVirtualCardsOnBoot();
    const restoreCredentialRequestExpiryTimersOnBoot = async () => {
      await context2.host.whenBackgroundWorkReady;
      try {
        await manager.widgetResponses.restoreCredentialRequestExpiryTimers();
      } catch (error42) {
        context2.host.log(`credential request expiry restore failed (${errorLogTag(error42)})`);
      }
    };
    void restoreCredentialRequestExpiryTimersOnBoot();
    manager.setAgentRunLifecycleObserver((event) => {
      switch (event.type) {
        case "started":
          void context2.host.events.emit("transcript.run-started", {
            requestId: event.requestId
          });
          return;
        case "ended":
          void context2.host.events.emit("transcript.run-ended", {
            requestId: event.requestId
          });
          return;
      }
      const _exhaustive = event;
      void _exhaustive;
    });
    context2.onStop(() => manager.dispose());
    return Object.assign(manager, { feedback: new FeedbackEntries(manager) });
  }
});
