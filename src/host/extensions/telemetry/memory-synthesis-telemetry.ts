/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/memory-synthesis-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function memorySynthesisTelemetry(report) {
  if (report.outcome === "skipped_gate") {
    return {
      level: "info",
      event: MEMORY_SYNTHESIS_EVENT,
      metadata: { outcome: report.outcome }
    };
  }
  if (report.outcome === "shed") {
    return {
      level: "warn",
      event: MEMORY_SYNTHESIS_EVENT,
      metadata: {
        outcome: report.outcome,
        ...sandErrorTags(report.cause),
        item_count: String(report.itemCount)
      }
    };
  }
  return {
    level: report.outcome === "failed" ? "warn" : "info",
    event: MEMORY_SYNTHESIS_EVENT,
    metadata: {
      outcome: report.outcome,
      ...report.outcome === "failed" ? sandErrorTags(report.cause) : {},
      duration_ms: String(Math.round(report.durationMs)),
      item_count: String(report.itemCount)
    }
  };
}

