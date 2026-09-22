init_dist4();
var logger26 = createLogger("RetryBlobStore");
var retryAttempts = createCounter("agent_kv.retry.retries", {
  description: "Number of RetryBlobStore retry attempts (one per re-issued operation, not counting the first try)",
  labelNames: ["operation", "outcome"]
});
var retryGetBlobLatency = createHistogram("agent_kv.retry.get_blob.duration_ms", {
  description: "Duration of RetryBlobStore getBlob operations in milliseconds"
});
var retrySetBlobLatency = createHistogram("agent_kv.retry.set_blob.duration_ms", {
  description: "Duration of RetryBlobStore setBlob operations in milliseconds"
});
var retrySetBlobLocallyOnlyLatency = createHistogram("agent_kv.retry.set_blob_locally_only.duration_ms", {
  description: "Duration of RetryBlobStore setBlobLocallyOnly operations in milliseconds"
});
var retryFlushLatency = createHistogram("agent_kv.retry.flush.duration_ms", {
  description: "Duration of RetryBlobStore flush operations in milliseconds"
});
