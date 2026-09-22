function scopeAttachedMediaToConversation({
  provider,
  transcriptId,
  conversationId
}) {
  if (provider === void 0 || transcriptId === conversationId) return provider;
  return {
    getSignedUrlForAttachedMedia: (ctx, request5) => provider.getSignedUrlForAttachedMedia(
      ctx,
      request5.conversationId === transcriptId ? { ...request5, conversationId } : request5
    )
  };
}
