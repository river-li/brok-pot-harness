/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/summarization-stale-tokens.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function computeRestoredTokenStaleness(args) {
  const boundary = args.messageCountAtLastCompaction;
  if (boundary === void 0) {
    return false;
  }
  if (args.messages.length < boundary) {
    return false;
  }
  return !args.messages.slice(boundary).some((message) => message.role === "assistant");
}

