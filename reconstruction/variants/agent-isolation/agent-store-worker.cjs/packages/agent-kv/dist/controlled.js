/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/controlled.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var logger3 = createLogger("ControlledKvManager");
var controlledGetBlobLatency = createHistogram("agent_kv.controlled.get_blob.duration_ms", {
  description: "Duration of ControlledKvManager getBlob operations in milliseconds"
});
var controlledSetBlobLatency = createHistogram("agent_kv.controlled.set_blob.duration_ms", {
  description: "Duration of ControlledKvManager setBlob operations in milliseconds"
});

