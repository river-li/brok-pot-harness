/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/reference.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var logger5 = createLogger("@anysphere/agent-kv:reference");
var LARGE_LAZY_REFERENCE_BLOB_BYTES = 512 * 1024;
var lazyReferenceCacheMiss = createCounter("agent_kv.lazy_reference.cache_miss", {
  description: "Number of large or slow LazyReference cache misses that require loading and deserializing a blob",
  labelNames: ["blob_type"]
});
var lazyReferenceDeserializeBytes = createHistogram("agent_kv.lazy_reference.deserialize_bytes", {
  description: "Blob byte size loaded on a large or slow LazyReference deserialize cache miss",
  labelNames: ["blob_type"]
});
var lazyReferenceDeserializeDuration = createHistogram("agent_kv.lazy_reference.deserialize_ms", {
  description: "Time spent deserializing a blob on a large or slow LazyReference cache miss",
  labelNames: ["blob_type"]
});

