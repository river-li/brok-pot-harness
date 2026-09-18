var FATAL_TELEMETRY_FLUSH_TIMEOUT_MS = 2e3;
var HOST_CRASH_MARKER_FORWARD_INTERVAL_MS = 5 * 6e4;
var HOST_LIFECYCLE_STUCK_MS = 5 * 6e4;
var telemetryExtension = defineHostExtension({
  id: "telemetry",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.Experiments,
    HostExtensions.Inference,
    HostExtensions.Settings
  ],
  start: async (context2) => {
    const service = new HostTelemetryService({
      environment: context2.host.environment,
      auth: context2.deps.auth,
      experiments: context2.deps.experiments,
      inference: context2.deps.inference,
      getOsLocale: () => context2.deps.settings.getOsLocale(),
      identityTags: {
        ...resolveSandBoxIdentityTags(),
        store_backend: context2.host.environment.boxStore.policy.kind
      },
      telemetryDisabled: context2.host.environment.telemetryDisabled,
      logShippingEnabled: context2.host.environment.boxStore.logShippingEnabled,
      hostLogFile: context2.host.environment.hostLogFile,
      metricsFlushPolling: createPollingPolicy2({
        name: "grok-bot-harness-metrics-flush",
        intervalMs: GROK_BOT_METRICS_FLUSH_INTERVAL_MS
      }),
      flushPolling: createPollingPolicy2({
        name: "sand-host-structured-log-flush",
        intervalMs: TELEMETRY_FLUSH_TICK_MS
      }),
      submitDeadline: createDeadlinePolicy({
        name: "sand-host-structured-log-submit",
        timeoutMs: STRUCTURED_LOG_SUBMIT_DEADLINE_MS
      }),
      identityHoldExpiry: createExpiryPolicy({
        name: "sand-host-telemetry-identity-hold",
        ttlMs: HOST_IDENTITY_HOLD_BACKSTOP_MS
      }),
      boxLogPolling: createPollingPolicy2({
        name: "sand-box-log-shipping",
        intervalMs: BOX_LOG_SHIP_INTERVAL_MS
      }),
      desktopHealthPolling: createPollingPolicy2({
        name: "sand-desktop-health-forwarding",
        intervalMs: DESKTOP_HEALTH_FORWARD_INTERVAL_MS
      }),
      egressIpPolling: createPollingPolicy2({
        name: "sand-egress-ip-probe",
        intervalMs: EGRESS_IP_PROBE_INTERVAL_MS
      }),
      egressIpProbeDeadline: createDeadlinePolicy({
        name: "sand-egress-ip-trace",
        timeoutMs: EGRESS_IP_PROBE_TIMEOUT_MS
      }),
      hostCrashMarkerStore: createHostCrashMarkerStore(),
      ...context2.host.environment.inBox ? {
        httpProxyNameOverrideStore: createHttpProxyNameOverrideStore(),
        boxBootId: context2.host.environment.boxBoot.id
      } : {},
      hostCrashMarkerPolling: createPollingPolicy2({
        name: "sand-host-crash-marker-forward",
        intervalMs: HOST_CRASH_MARKER_FORWARD_INTERVAL_MS
      }),
      fatalFlushDeadline: createDeadlinePolicy({
        name: "sand-host-fatal-telemetry-flush",
        timeoutMs: FATAL_TELEMETRY_FLUSH_TIMEOUT_MS
      }),
      clock: realClock,
      hostLifecycleWatchdog: createIdleWatchdogPolicy({
        name: "sand-host-lifecycle",
        idleMs: HOST_LIFECYCLE_STUCK_MS
      })
    });
    context2.onStop(() => service.dispose());
    await service.start();
    const api = service.api();
    pinExperimentsDiagnosticsReporter(
      (diagnostic) => api.logs.reportExperimentsDiagnostic(diagnostic)
    );
    return api;
  }
});
