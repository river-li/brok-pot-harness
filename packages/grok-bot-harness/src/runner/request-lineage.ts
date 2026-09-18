function deriveSandRequestLineage(ctx, toolCallId, fallback2) {
  const parentRequestId = ctx.get(requestIdKey);
  if (parentRequestId != null && parentRequestId !== "") {
    return {
      parentRequestId,
      rootParentRequestId: getRootParentRequestId(ctx) ?? parentRequestId,
      ...toolCallId.length > 0 ? { parentAgentToolCallId: toolCallId } : {}
    };
  }
  if (fallback2 == null) return void 0;
  return {
    ...fallback2,
    ...toolCallId.length > 0 ? { parentAgentToolCallId: toolCallId } : {}
  };
}
