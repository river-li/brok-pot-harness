/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-transcript/dist/paths.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist3();
function getTranscriptRelativePath(args) {
  const safeId = getSafeConversationId(args.conversationId);
  if (args.kind === "subagent" && args.parentConversationId) {
    const safeParentId = getSafeConversationId(args.parentConversationId);
    return `${TRANSCRIPTS_SUBDIR}/${safeParentId}/subagents/${safeId}.${args.ext}`;
  }
  return `${TRANSCRIPTS_SUBDIR}/${safeId}/${safeId}.${args.ext}`;
}

