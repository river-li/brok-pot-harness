/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/session-diagnostic-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var WARN_KINDS3 = /* @__PURE__ */ new Set([
  "open_io_retry",
  "wal_unavailable",
  "quarantine_copied",
  "stat_failed",
  "path_stat_failed",
  "connector_secrets_unreadable",
  "fallback_adopt_failed",
  "placeholder_check_failed",
  "degraded"
]);
var EVENT_BY_FAMILY = {
  store_db: SESSION_STORE_DB_EVENT,
  maintenance: SESSION_MAINTENANCE_EVENT,
  materialize: SESSION_MATERIALIZE_EVENT,
  summary_build: SESSION_SUMMARY_BUILD_EVENT
};
function sessionDiagnosticTelemetry(report) {
  const level = WARN_KINDS3.has(report.kind) ? "warn" : "error";
  if (report.family === "store_db") {
    return {
      level,
      event: EVENT_BY_FAMILY[report.family],
      metadata: {
        kind: report.kind,
        agent_id: report.agentId,
        error_class: report.errorClass,
        outcome: report.outcome,
        quarantine: report.quarantine,
        salvaged_kv: report.salvagedKv != null ? String(report.salvagedKv) : void 0,
        salvaged_blobs: report.salvagedBlobs != null ? String(report.salvagedBlobs) : void 0,
        salvaged_transcript: report.salvagedTranscript != null ? String(report.salvagedTranscript) : void 0,
        salvaged_automation_completions: report.salvagedAutomationCompletions != null ? String(report.salvagedAutomationCompletions) : void 0
      }
    };
  }
  return {
    level,
    event: EVENT_BY_FAMILY[report.family],
    metadata: {
      kind: report.kind,
      agent_id: report.agentId,
      error_class: report.errorClass
    }
  };
}

