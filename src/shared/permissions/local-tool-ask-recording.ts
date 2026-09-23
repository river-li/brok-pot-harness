var sandLocalToolAskRecorderKey = createKey(
  /* @__PURE__ */ Symbol("sand.local-tool.ask-recorder"),
  void 0
);
function recordSettledLocalToolAsk(ctx, scope, authorization) {
  const toolCallId = scope?.toolCallId;
  if (toolCallId === void 0 || authorization.settledAsk === void 0) return;
  ctx.get(sandLocalToolAskRecorderKey)?.recordLocalToolAuthorization(toolCallId, authorization);
}
async function authorizeLocalToolAction(ctx, gate, scope, request5) {
  const decision = await gate.authorize(scope, request5);
  recordSettledLocalToolAsk(ctx, scope, decision);
  if (!decision.allowed) {
    throw new SandLocalToolPermissionDeniedError(decision.reason);
  }
  return decision.approvalId;
}
