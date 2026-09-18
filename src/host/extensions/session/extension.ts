var sessionExtension = defineHostExtension({
  id: "session",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.Experiments,
    HostExtensions.ForeverBox,
    HostExtensions.PrivacyMode,
    HostExtensions.Settings,
    HostExtensions.Telemetry
  ],
  start: (context2) => {
    pinSessionDiagnosticsReporter(
      (report) => context2.deps.telemetry.logs.reportSessionDiagnostic(report)
    );
    pinConversationGcReporter((report) => context2.deps.telemetry.logs.reportConversationGc(report));
    pinConversationEnvironment(context2.host.environment.conversation);
    const store = new SandAgentSessionStore(
      (level, line) => context2.deps.telemetry.logs.reportHostLog(level, line),
      void 0,
      () => context2.deps.settings.getUserTimeZone()
    );
    store.setFiveMinuteAutomationFloorResolver(
      () => context2.deps.experiments.checkFeatureGate("sand_five_min_automation_floor", {
        disableExposureLog: true
      })
    );
    context2.deps.experiments.pinGateOnAuthenticatedBootstrap(
      "sand_legacy_store_blob_retirement",
      pinLegacyStoreBlobRetirement
    );
    context2.deps.experiments.pinGateOnAuthenticatedBootstrap(
      "grok_bot_conversation_gc",
      pinConversationGc
    );
    pinConversationSizeLimitsReader(
      () => context2.deps.experiments.getDynamicConfig("grok_bot_conversation_size_limits", {
        disableExposureLog: true
      })
    );
    const handoff = new BoxHandoffService({
      box: context2.deps["forever-box"].box,
      ctx: createContext().with(loggerKey, { log: () => {
      } }).with(metricsKey, context2.deps.telemetry.metrics),
      telemetry: {
        reportBoxHelp: (args) => context2.deps.telemetry.logs.reportBoxHelp(args),
        trackEvent: (name17, properties) => context2.deps.telemetry.analytics.trackEvent(name17, properties)
      },
      privacyMode: context2.deps["privacy-mode"],
      onStarted: (args) => {
        void context2.host.events.emit("session.box-handoff-started", args);
      },
      onEnded: (args) => context2.host.events.emit("session.box-handoff-ended", args, {
        failureMode: "reject"
      }),
      onStatusChanged: (agentId) => {
        void context2.host.events.emit("session.box-handoff-status-changed", {
          agentId
        });
      }
    });
    const userForms = new UserFormService({
      box: context2.deps["forever-box"].box,
      ctx: createContext().with(loggerKey, { log: () => {
      } }).with(metricsKey, context2.deps.telemetry.metrics),
      privacyMode: context2.deps["privacy-mode"]
    });
    const virtualCards = new VirtualCardService({
      backend: {
        backend: context2.host.environment.backend,
        getAccessToken: context2.deps.auth.getAccessToken,
        getTeamId: context2.deps.auth.getTeamId,
        getMachineId: context2.deps.auth.getMachineId
      }
    });
    return {
      store,
      transcriptsDir: () => getSandTranscriptsDir(),
      conversationBlobsPath: (dbPath) => (0, import_node_path143.join)((0, import_node_path143.dirname)(dbPath), CONVERSATION_BLOBS_FILENAME),
      pendingHandoff: (agentId) => handoff.get(agentId),
      startHandoff: (request3) => handoff.start(request3),
      endHandoff: (agentId, trigger2) => handoff.end(agentId, trigger2),
      forgetHandoff: (agentId) => handoff.forget(agentId),
      startUserForm: (request3) => userForms.start(request3),
      endUserForm: (agentId, requestId2) => userForms.end(agentId, requestId2),
      recordUserFormResolution: (report) => userForms.recordResolution(report),
      forgetUserForm: (agentId) => userForms.forget(agentId),
      fillUserForm: (agentId, values, consentedHost, submitAfterFill) => userForms.fill(agentId, values, consentedHost, submitAfterFill),
      holdUserFormForRemap: (agentId, hold) => userForms.holdForRemap(agentId, hold),
      hasUserFormRemapHold: (agentId) => userForms.hasRemapHold(agentId),
      remapUserFormTargets: (args) => userForms.remap(args),
      settleUserFormRemap: (args) => userForms.settleRemap(args),
      startVirtualCard: (request3) => virtualCards.start(request3),
      pendingVirtualCard: (agentId) => virtualCards.get(agentId),
      forgetVirtualCard: (agentId) => virtualCards.forget(agentId)
    };
  }
});
