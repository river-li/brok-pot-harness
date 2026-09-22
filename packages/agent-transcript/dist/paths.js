init_dist3();
function getTranscriptRelativePath(args) {
  const safeId = getSafeConversationId(args.conversationId);
  if (args.kind === "subagent" && args.parentConversationId) {
    const safeParentId = getSafeConversationId(args.parentConversationId);
    return `${TRANSCRIPTS_SUBDIR}/${safeParentId}/subagents/${safeId}.${args.ext}`;
  }
  return `${TRANSCRIPTS_SUBDIR}/${safeId}/${safeId}.${args.ext}`;
}
