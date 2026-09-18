function scopeAttachedMediaToConversation({
  provider,
  transcriptId,
  conversationId
}) {
  if (provider === void 0 || transcriptId === conversationId) return provider;
  return {
    getSignedUrlForAttachedMedia: (ctx, request3) => provider.getSignedUrlForAttachedMedia(
      ctx,
      request3.conversationId === transcriptId ? { ...request3, conversationId } : request3
    )
  };
}
