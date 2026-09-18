var autoReviewExtension = defineHostExtension({
  id: "auto-review",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.Experiments,
    HostExtensions.Settings,
    HostExtensions.TeamAdminPolicy,
    HostExtensions.Telemetry,
    HostExtensions.Transcript
  ],
  start: (context2) => {
    const service = new AutoReviewService({
      auth: context2.deps.auth,
      experiments: {
        checkFeatureGate: (name17) => context2.deps.experiments.checkFeatureGate(name17, { disableExposureLog: true })
      },
      settings: context2.deps.settings,
      teamPolicy: context2.deps["team-admin-policy"],
      telemetry: context2.deps.telemetry.logs,
      awaitingSink: context2.deps.transcript.createAwaitingStateSink(),
      transcript: context2.deps.transcript,
      hostGeneration: SAND_AUTO_REVIEW_HOST_GENERATION,
      localMode: context2.host.environment.autoReviewMode,
      createClassifierExecutor: (auth2) => createSandBackendSmartModeClassifierExecutor({
        backend: context2.host.environment.backend,
        ...auth2
      })
    });
    context2.onStop(() => service.stop());
    const startedAtMs = Date.now();
    const sweepBadges = () => service.sweepStaleAwaitingBadges(() => context2.deps.transcript.listAgentIds(), startedAtMs);
    void context2.deps.transcript.expireAllPendingAutoReviewApprovalCards().then(sweepBadges, sweepBadges);
    return service;
  }
});
