var DENIED_CLASSIFICATIONS = /* @__PURE__ */ new Set(["user_rejected", "hook_denied"]);
var CANCELLED_CLASSIFICATIONS = /* @__PURE__ */ new Set(["aborted", "timeout"]);
function toolResultOutcome(event) {
  if (event.success) return "success";
  if (event.errorClassification !== void 0) {
    if (DENIED_CLASSIFICATIONS.has(event.errorClassification)) return "denied";
    if (CANCELLED_CLASSIFICATIONS.has(event.errorClassification)) return "cancelled";
  }
  return event.auditOutcome ?? "error";
}
function toolResultAuditRecord(event, identity) {
  if (event.toolIdentifier === "MCP") return void 0;
  const errorCategory = event.success ? void 0 : event.errorClassification ?? event.errorClass;
  return {
    agentId: identity.agentId,
    turnId: event.requestId,
    rootTurnId: event.rootParentRequestId ?? event.requestId,
    subagentId: event.conversationId !== void 0 && event.conversationId !== identity.agentId ? event.conversationId : void 0,
    boxId: identity.boxId,
    toolCallId: event.toolCallId,
    occurredAtMs: event.startedAtMs,
    action: {
      kind: "toolResult",
      toolName: event.toolIdentifier.toLowerCase(),
      outcome: toolResultOutcome(event),
      durationMs: Math.max(0, event.endedAtMs - event.startedAtMs),
      ...errorCategory === void 0 ? {} : { errorCategory }
    }
  };
}
