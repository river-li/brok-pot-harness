init_dist4();
var logger98 = createLogger("@anysphere/agent-client:stall-detector");
var SERVER_HEARTBEAT_INTERVAL_MS = 1e4;
var DEFAULT_STALL_DETECTOR_FAIL_TIMEOUT_MS = 3 * SERVER_HEARTBEAT_INTERVAL_MS;
var MIN_STALL_DETECTOR_FAIL_TIMEOUT_MS = 2 * SERVER_HEARTBEAT_INTERVAL_MS;
var streamStallCount = createCounter("agent_client.stream.stall.count", {
  description: "Number of bidirectional stream stalls detected",
  labelNames: ["activity_type", "message_type", "loop"]
});
var streamStallDuration = createHistogram("agent_client.stream.stall.duration_ms", {
  description: "Duration of stream stalls in milliseconds",
  labelNames: ["activity_type", "loop"]
});
var streamDidStall = createCounter("agent_client.stream.did_stall", {
  description: "Number of streams that experienced at least one stall",
  labelNames: ["loop"]
});
var streamTotal = createCounter("agent_client.stream.total", {
  description: "Total number of streams monitored",
  labelNames: ["loop"]
});
