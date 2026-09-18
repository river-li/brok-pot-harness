init_dist3();
var logger23 = createLogger("ControlledKvManager");
var controlledGetBlobLatency = createHistogram("agent_kv.controlled.get_blob.duration_ms", {
  description: "Duration of ControlledKvManager getBlob operations in milliseconds"
});
var controlledSetBlobLatency = createHistogram("agent_kv.controlled.set_blob.duration_ms", {
  description: "Duration of ControlledKvManager setBlob operations in milliseconds"
});
