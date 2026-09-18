var REMOTE_AGENT_MESSAGING_GATE = "grok_bot_temporal_harness";
var remoteAgentMessagingExtension = defineHostExtension({
  id: "remote-agent-messaging",
  dependencies: [HostExtensions.Auth, HostExtensions.Experiments, HostExtensions.Telemetry],
  start: (context2) => startRemoteAgentMessaging({ context: context2 })
});
function startRemoteAgentMessaging({
  context: context2,
  client = createSandCursorBackendClient(GrokBotService, {
    backend: context2.host.environment.backend,
    getAccessToken: context2.deps.auth.getAccessToken,
    getTeamId: context2.deps.auth.getTeamId,
    getMachineId: context2.deps.auth.getMachineId
  })
}) {
  const lifetime = new AbortController();
  context2.onStop(() => lifetime.abort());
  const capabilities = createRemoteAgentMessagingCapabilities({
    client,
    deadline: createDeadlinePolicy({
      name: "remote-agent-messaging-capabilities",
      timeoutMs: 1e4
    }),
    signal: lifetime.signal,
    legacy: () => context2.deps.experiments.checkFeatureGate(REMOTE_AGENT_MESSAGING_GATE, {
      disableExposureLog: true
    })
  });
  const isEnabled = capabilities.isEnabled;
  const reportFailure = (errorClass) => context2.deps.telemetry.logs.reportHostExtensionDiagnostic({
    extension: "remote_agent_messaging",
    errorClass
  });
  const capabilityRecovery = createRetryPolicy({
    name: "remote-agent-messaging-capability-recovery",
    ...RUNTIME_CAPABILITIES_RETRY_OPTIONS
  });
  const reportCapabilityFailure = (error41) => {
    if (!lifetime.signal.aborted) reportFailure(errorLogTag(error41));
  };
  const backgroundRefresh = createSingleFlight({
    read: () => (async () => {
      await context2.host.whenBackgroundWorkReady;
      if (lifetime.signal.aborted) return;
      await capabilityRecovery.runWithRetry(() => capabilities.refresh(), lifetime.signal);
    })().catch(reportCapabilityFailure),
    install: () => {
    }
  });
  const refreshAfterAuthRenewal = async () => {
    await (backgroundRefresh.isInFlight ? backgroundRefresh.run() : void 0);
    await backgroundRefresh.run();
  };
  context2.onStop(
    context2.deps.auth.subscribeToRenewal((event) => {
      if (event.outcome === "renewed") {
        void refreshAfterAuthRenewal().catch(reportCapabilityFailure);
      }
    })
  );
  void backgroundRefresh.run();
  return createRemoteAgentMessagingService({
    client,
    isEnabled,
    mintMessageId: () => (0, import_node_crypto60.randomUUID)(),
    reportFailure,
    temporalMemberTurns: createTemporalMemberTurns({
      client,
      isEnabled,
      mintNonce: () => (0, import_node_crypto60.randomUUID)(),
      clock: realClock,
      turnDeadline: createDeadlinePolicy({
        name: "remote-agent-messaging-temporal-member-turn",
        timeoutMs: TEMPORAL_MEMBER_TURN_HOST_TIMEOUT_MS
      }),
      reportFailure
    })
  });
}
