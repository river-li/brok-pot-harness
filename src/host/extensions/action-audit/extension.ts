/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/action-audit/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var actionAuditExtension = defineHostExtension({
  id: "action-audit",
  dependencies: [HostExtensions.Auth, HostExtensions.Experiments, HostExtensions.Telemetry],
  start: (context2) => {
    const service = createSandActionAuditor({
      isBackendForwardingEnabled: () => context2.deps.experiments.checkGate("sand_action_audit_logs", {
        disableExposureLog: true
      }),
      sendBatch: createSandAuditBatchSender({
        backend: context2.host.environment.backend,
        getAccessToken: context2.deps.auth.getAccessToken,
        getTeamId: context2.deps.auth.getTeamId,
        getMachineId: context2.deps.auth.getMachineId
      }),
      report: (diagnostic) => context2.deps.telemetry.logs.reportHostExtensionDiagnostic(diagnostic),
      flushPolicy: createPollingPolicy2({
        name: "action-audit-flush",
        intervalMs: ACTION_AUDIT_FLUSH_INTERVAL_MS
      })
    });
    context2.onStop(() => service.dispose());
    return service.auditor;
  }
});

