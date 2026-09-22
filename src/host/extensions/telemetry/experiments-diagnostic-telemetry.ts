/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/experiments-diagnostic-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var INFO_KINDS = /* @__PURE__ */ new Set([
  "bootstrap_resolved",
  "bootstrap_anonymous",
  "bootstrap_discarded_auth_changed",
  "exposure_flush_failed",
  "shutdown_failed"
]);
var WARN_KINDS = /* @__PURE__ */ new Set([
  "bootstrap_config_unparseable",
  "bootstrap_cache_read_failed",
  "pre_pin_dropped",
  "config_parse_failed"
]);
function levelFor(diagnostic) {
  if (diagnostic.kind === "config_not_applied") {
    return diagnostic.reason === "identity_unhydrated" ? "info" : "warn";
  }
  if (INFO_KINDS.has(diagnostic.kind)) return "info";
  return WARN_KINDS.has(diagnostic.kind) ? "warn" : "error";
}
function experimentsDiagnosticTelemetry(diagnostic) {
  return {
    level: levelFor(diagnostic),
    event: EXPERIMENTS_DIAGNOSTIC_EVENT,
    metadata: {
      kind: diagnostic.kind,
      stage: diagnostic.stage,
      reason: diagnostic.reason,
      error_class: diagnostic.errorClass,
      gates_on_count: diagnostic.gatesOnCount != null ? String(diagnostic.gatesOnCount) : void 0,
      authenticated: diagnostic.authenticated != null ? String(diagnostic.authenticated) : void 0,
      count: diagnostic.count != null ? String(diagnostic.count) : void 0
    }
  };
}

