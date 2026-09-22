/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/request-lineage.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

