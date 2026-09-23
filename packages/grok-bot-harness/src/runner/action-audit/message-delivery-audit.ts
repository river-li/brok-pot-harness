function scopeDeliveryMessageId(record2, scope) {
  if (record2.action.kind !== "messageDelivery" || record2.action.messageId === void 0) {
    return record2;
  }
  const { messageId, ...action } = record2.action;
  const scoped = scope(messageId);
  return { ...record2, action: scoped === void 0 ? action : { ...action, messageId: scoped } };
}
var NO_DELIVERY_REPORT = { settled: () => {
}, failed: () => {
} };
function bindMessageDeliveryReport(recorder, ctx, toolCallId, destination) {
  if (recorder === void 0) return NO_DELIVERY_REPORT;
  const settled = (settlement) => recorder(ctx, toolCallId, { ...destination, ...settlement });
  return {
    settled,
    failed: (error42, category = errorClassOf(error42)) => {
      if (error42 instanceof DeferredInteractionResponseError) return;
      settled({ result: "failed", failureCategory: category });
    }
  };
}
function createMessageDeliveryRecorder(auditor, identity) {
  if (auditor === void 0) return void 0;
  return (ctx, toolCallId, delivery) => {
    const agentId = identity.getAgentId();
    const turnId = ctx.get(requestIdKey);
    auditor.record({
      agentId,
      turnId,
      rootTurnId: getRootParentRequestId(ctx) ?? turnId,
      subagentId: subagentIdFromTurnContext(ctx, agentId),
      boxId: identity.resolveBoxId(),
      toolCallId,
      occurredAtMs: Date.now(),
      action: { kind: "messageDelivery", ...delivery }
    });
  };
}
