/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-kv/dist/blob-store.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toUint8Array(b) {
  const buffer = b.buffer;
  if (typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer)
    return new Uint8Array(b);
  return new Uint8Array(buffer, b.byteOffset, b.byteLength);
}
var inMemoryGetBlobLatency = createHistogram("agent_kv.in_memory.get_blob.duration_ms", {
  description: "Duration of InMemoryBlobStore getBlob operations in milliseconds"
});
var inMemorySetBlobLatency = createHistogram("agent_kv.in_memory.set_blob.duration_ms", {
  description: "Duration of InMemoryBlobStore setBlob operations in milliseconds"
});

