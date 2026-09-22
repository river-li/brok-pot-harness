/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-client/dist/stall-detector.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
var logger106 = createLogger("@anysphere/agent-client:stall-detector");
var streamStallCount = createCounter("agent_client.stream.stall.count", {
  description: "Number of bidirectional stream stalls detected",
  labelNames: ["activity_type", "message_type"]
});
var streamStallDuration = createHistogram("agent_client.stream.stall.duration_ms", {
  description: "Duration of stream stalls in milliseconds",
  labelNames: ["activity_type"]
});
var streamDidStall = createCounter("agent_client.stream.did_stall", {
  description: "Number of streams that experienced at least one stall"
});
var streamTotal = createCounter("agent_client.stream.total", {
  description: "Total number of streams monitored"
});

