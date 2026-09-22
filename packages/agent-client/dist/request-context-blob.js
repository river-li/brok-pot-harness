/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-client/dist/request-context-blob.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var REQUEST_CONTEXT_BLOB_HARD_MAX_BYTES = 15 * 1024 * 1024;
var REQUEST_CONTEXT_DYNAMIC_INLINE_MAX_BYTES = 1 * 1024 * 1024;
var DEFAULT_TRANSIENT_BLOB_BUDGET_BYTES = 4 * REQUEST_CONTEXT_BLOB_HARD_MAX_BYTES;
var requestContextBlobPrepared = createCounter("agent_client.request_context_blob.prepared", {
  description: "Prepared RequestContext blob references"
});
var requestContextBlobBytes = createHistogram("agent_client.request_context_blob.bytes", {
  description: "Serialized RequestContext bytes staged by the client"
});
var requestContextBlobPreparationDuration = createHistogram("agent_client.request_context_blob.preparation_ms", {
  description: "Time to hydrate, serialize, and hash RequestContext"
});

