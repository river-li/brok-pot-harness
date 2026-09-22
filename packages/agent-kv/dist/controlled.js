/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/controlled.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
var logger23 = createLogger("ControlledKvManager");
var controlledGetBlobLatency = createHistogram("agent_kv.controlled.get_blob.duration_ms", {
  description: "Duration of ControlledKvManager getBlob operations in milliseconds"
});
var controlledSetBlobLatency = createHistogram("agent_kv.controlled.set_blob.duration_ms", {
  description: "Duration of ControlledKvManager setBlob operations in milliseconds"
});

