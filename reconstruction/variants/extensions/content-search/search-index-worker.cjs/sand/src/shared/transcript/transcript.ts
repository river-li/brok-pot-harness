/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/transcript/transcript.ts
 * Bundle: sand-host/extensions/content-search/search-index-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isOutboundAgentPeerMessageEntry(entry) {
  return entry != null && entry.kind === "message" && entry.toAgent != null;
}
function isHiddenOutboundAgentPeerMessageEntry(entry) {
  return isOutboundAgentPeerMessageEntry(entry) && entry.toAgent.kind !== "agent" && entry.toAgent.kind !== "cloud-agent";
}

