/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/search-index-health-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var WARN_KINDS2 = /* @__PURE__ */ new Set([
  "dispose_drain_cut",
  "worker_terminate_failed",
  "job_retry"
]);
function searchIndexHealthTelemetry(report) {
  return {
    level: WARN_KINDS2.has(report.kind) ? "warn" : "error",
    event: SEARCH_INDEX_HEALTH_EVENT,
    metadata: {
      kind: report.kind,
      stage: report.stage,
      error_class: report.errorClass,
      count: report.count != null ? String(report.count) : void 0
    }
  };
}

