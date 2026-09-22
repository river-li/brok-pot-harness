/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/host-event-bus-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function hostEventBusTelemetry(report) {
  return {
    level: "error",
    event: HOST_EVENT_BUS_EVENT,
    metadata: {
      kind: report.kind,
      topic: report.topic,
      error_class: report.errorClass
    }
  };
}

