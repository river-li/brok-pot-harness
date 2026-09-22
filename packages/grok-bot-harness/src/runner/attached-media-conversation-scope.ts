/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/attached-media-conversation-scope.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

