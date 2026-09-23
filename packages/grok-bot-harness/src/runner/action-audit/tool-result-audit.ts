init_dist4();
var HOOK_DENIED_CLASSIFICATION = "hook_denied";
var DENIED_CLASSIFICATIONS = /* @__PURE__ */ new Set([
  "user_rejected",
  HOOK_DENIED_CLASSIFICATION
]);
var CANCELLED_CLASSIFICATIONS = /* @__PURE__ */ new Set(["aborted", "timeout"]);
function toolResultOutcome(event) {
  if (event.success) return "success";
  if (event.errorClassification !== void 0) {
    if (DENIED_CLASSIFICATIONS.has(event.errorClassification)) return "denied";
    if (CANCELLED_CLASSIFICATIONS.has(event.errorClassification)) return "cancelled";
  }
  return event.auditOutcome ?? "error";
}
function toolCallAuditEnvelope(event, identity) {
  return {
    agentId: identity.agentId,
    turnId: event.requestId,
    rootTurnId: event.rootParentRequestId ?? event.requestId,
    subagentId: event.conversationId !== void 0 && event.conversationId !== identity.agentId ? event.conversationId : void 0,
    boxId: identity.boxId,
    toolCallId: event.toolCallId,
    occurredAtMs: event.startedAtMs
  };
}
function toolResultAuditRecord(event, identity, targetHost) {
  if (event.toolIdentifier === "MCP") return void 0;
  const errorCategory = event.success ? void 0 : event.errorClassification ?? event.errorClass;
  return {
    ...toolCallAuditEnvelope(event, identity),
    action: {
      kind: "toolResult",
      toolName: event.toolIdentifier.toLowerCase(),
      outcome: toolResultOutcome(event),
      durationMs: Math.max(0, event.endedAtMs - event.startedAtMs),
      ...errorCategory === void 0 ? {} : { errorCategory },
      ...targetHost === void 0 ? {} : { targetHost }
    }
  };
}
var HTTP_URL = /^https?:\/\//i;
var OTHER_SCHEME_OR_LOGIN = /^[a-z][a-z0-9+.-]*:(?![0-9])/i;
var BARE_HOSTNAME = /^[a-z0-9.-]{1,253}$/;
function toolTargetHostOf(target) {
  const trimmed = target.trim();
  const isHttpUrl2 = HTTP_URL.test(trimmed);
  if (trimmed.length === 0 || !isHttpUrl2 && OTHER_SCHEME_OR_LOGIN.test(trimmed)) {
    return void 0;
  }
  let hostname3;
  try {
    hostname3 = new URL(isHttpUrl2 ? trimmed : `https://${trimmed}`).hostname;
  } catch {
    return void 0;
  }
  const host = hostname3.toLowerCase().replace(/^www\./, "");
  return BARE_HOSTNAME.test(host) ? host : void 0;
}
var MAX_PENDING_TARGET_CALLS = 256;
var ToolTargetLedger = class {
  hosts = /* @__PURE__ */ new Map();
  note(toolCallId, target) {
    const host = toolTargetHostOf(target);
    if (host === void 0 || toolCallId.length === 0) return;
    this.hosts.delete(toolCallId);
    this.hosts.set(toolCallId, host);
    if (this.hosts.size > MAX_PENDING_TARGET_CALLS) {
      const oldest = this.hosts.keys().next().value;
      if (oldest !== void 0) this.hosts.delete(oldest);
    }
  }
  take(toolCallId) {
    const host = this.hosts.get(toolCallId);
    this.hosts.delete(toolCallId);
    return host;
  }
};
var toolTargetLedgerKey = createKey(/* @__PURE__ */ Symbol("grok-bot-harness.tool-target-ledger"), void 0);
function noteToolTargetHost(ctx, toolCallId, target) {
  ctx.get(toolTargetLedgerKey)?.note(toolCallId, target);
}
