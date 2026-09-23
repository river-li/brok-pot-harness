function loopDetectedGuardrailRecord(report, identity, attribution) {
  const mitigationNudgesAgent = report.mode === "on" && report.mitigation !== "none";
  return {
    agentId: identity.agentId,
    ...attribution,
    turnId: report.requestId,
    boxId: identity.boxId,
    occurredAtMs: Date.now(),
    action: {
      kind: "guardrail",
      guardrailKind: "loop_detected",
      detector: report.loopKind,
      action: mitigationNudgesAgent ? "warned" : "continued",
      source: "runtime",
      count: report.repetitions
    }
  };
}
function botBlockedGuardrailRecord(hit, navigation) {
  const { action: _navigation, sequence: _sequence, ...envelope } = navigation;
  return {
    ...envelope,
    action: {
      kind: "guardrail",
      guardrailKind: "bot_blocked",
      detector: hit.family,
      action: "continued",
      source: "runtime",
      targetHost: hit.blockedHost
    }
  };
}
var INTERRUPTING_RETIREMENTS = /* @__PURE__ */ new Set([
  "cancelled",
  "user_redirect"
]);
function toolEscalationOf(decision) {
  if (decision.hold === void 0) return void 0;
  const retired = decision.approved ? void 0 : decision.retired;
  return {
    hold: decision.hold,
    interrupted: retired !== void 0 && INTERRUPTING_RETIREMENTS.has(retired)
  };
}
function holdResolutionOf(outcome) {
  switch (outcome) {
    case "allowed":
      return "resumed";
    case "denied":
      return "denied";
    case "held":
    case "timed_out":
      return "abandoned";
  }
}
function toolEscalationGuardrailRecords(escalation, envelope, answer) {
  const { hold } = escalation;
  const resolution = holdResolutionOf(answer.outcome);
  const shared = {
    kind: "guardrail",
    detector: hold.surface,
    source: answer.approvalMode === "auto_review" ? "classifier" : "policy",
    toolName: answer.toolName,
    decisionId: answer.decisionId
  };
  return [
    {
      ...envelope,
      occurredAtMs: hold.createdAtMs,
      action: { ...shared, guardrailKind: "tool_escalation", action: "stopped" }
    },
    {
      ...envelope,
      occurredAtMs: hold.resolvedAtMs,
      action: {
        ...shared,
        guardrailKind: escalation.interrupted ? "interrupted" : "pause",
        action: resolution === "resumed" ? "continued" : "stopped",
        resolution,
        durationMs: Math.max(0, hold.resolvedAtMs - hold.createdAtMs)
      }
    }
  ];
}
