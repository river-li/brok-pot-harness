/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/writethrough-middleware.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var logger4 = createLogger("@anysphere/agent-kv");
var writethroughGetBlobLatency = createHistogram("agent_kv.writethrough.get_blob.duration_ms", {
  description: "Duration of WritethroughBlobStore getBlob operations in milliseconds"
});
var writethroughSetBlobLatency = createHistogram("agent_kv.writethrough.set_blob.duration_ms", {
  description: "Duration of WritethroughBlobStore setBlob operations in milliseconds"
});
var writethroughFlushLatency = createHistogram("agent_kv.writethrough.flush.duration_ms", {
  description: "Duration of WritethroughBlobStore flush operations in milliseconds"
});

