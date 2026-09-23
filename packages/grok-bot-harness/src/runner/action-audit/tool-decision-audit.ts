function cardOutcome(decision) {
  if (decision.approved) return "allowed";
  if (decision.retired === void 0) return "denied";
  return decision.retired === "ttl" ? "timed_out" : "held";
}
var MAX_PENDING_DECISION_CALLS = 256;
var toolDecisionAuditKey = createKey(/* @__PURE__ */ Symbol("grok-bot-harness.tool-decision-audit"), void 0);
function withDecisionLedger(ctx, audit) {
  return ctx.with(toolDecisionAuditKey, audit).with(sandLocalToolAskRecorderKey, audit);
}
var POLICY_ALLOWED = {
  source: "policy",
  approvalMode: "auto_review",
  outcome: "allowed"
};
var POLICY_DENIED = {
  source: "policy",
  approvalMode: "auto_review",
  outcome: "denied"
};
var HOOK_DENIED = {
  source: "hook",
  approvalMode: "hook",
  outcome: "denied"
};
var AUTOMATIC = {
  source: "automatic",
  approvalMode: "auto_allow",
  outcome: "allowed"
};
function sameVerdict(a, b2) {
  return a.source === b2.source && a.approvalMode === b2.approvalMode && a.outcome === b2.outcome && a.ruleId === b2.ruleId;
}
var ToolDecisionAudit = class {
  pending = /* @__PURE__ */ new Map();
  decide(toolCallId, verdict) {
    const call = this.touch(toolCallId);
    const sameVerdictBeforeThePark = call.decisions.find(
      (decision) => sameVerdict(decision, verdict)
    );
    if (sameVerdictBeforeThePark !== void 0) return sameVerdictBeforeThePark.decisionId;
    const decisionId = (0, import_node_crypto53.randomUUID)();
    call.decisions.push({ ...verdict, decisionId });
    return decisionId;
  }
  supersede(toolCallId, verdict) {
    this.touch(toolCallId).decisions.length = 0;
    return this.decide(toolCallId, verdict);
  }
  askAPerson(toolCallId) {
    this.touch(toolCallId).askedAPerson = true;
  }
  recordApproval(toolCallId, decision, approvalMode) {
    if (decision.approvalId === void 0) return;
    this.recordHumanAnswer(toolCallId, {
      decisionId: decision.approvalId,
      outcome: cardOutcome(decision),
      approvalMode,
      escalation: toolEscalationOf(decision)
    });
  }
  recordLocalToolAuthorization(toolCallId, authorization) {
    const ask = authorization.settledAsk;
    if (ask === void 0) return;
    this.recordHumanAnswer(toolCallId, {
      decisionId: ask.id,
      outcome: ask.outcome === "expired" ? "timed_out" : ask.outcome,
      approvalMode: "local_tool_permission"
    });
  }
  recordHumanAnswer(toolCallId, answer) {
    const call = this.touch(toolCallId);
    if (call.decisions.some((decision) => decision.decisionId === answer.decisionId)) return;
    const { escalation, ...verdict } = answer;
    call.decisions.push({
      source: "human",
      ...verdict,
      ...escalation === void 0 ? {} : { escalation }
    });
  }
  touch(toolCallId) {
    const call = this.pending.get(toolCallId) ?? { decisions: [], askedAPerson: false };
    this.pending.delete(toolCallId);
    this.pending.set(toolCallId, call);
    if (this.pending.size > MAX_PENDING_DECISION_CALLS) {
      const oldest = this.pending.keys().next().value;
      if (oldest !== void 0) this.pending.delete(oldest);
    }
    return call;
  }
  settle(event, identity) {
    const recorded = this.pending.get(event.toolCallId) ?? { decisions: [], askedAPerson: false };
    this.pending.delete(event.toolCallId);
    const outcome = toolResultOutcome(event);
    const decisions = outcome === "cancelled" ? recorded.decisions.filter((decision) => decision.outcome !== "denied") : recorded.decisions;
    if (outcome === "denied") {
      if (event.errorClassification === HOOK_DENIED_CLASSIFICATION) {
        decisions.push({ ...HOOK_DENIED, decisionId: (0, import_node_crypto53.randomUUID)() });
      }
    } else if (outcome !== "cancelled" && decisions.length === 0 && !recorded.askedAPerson) {
      decisions.push({ ...AUTOMATIC, decisionId: (0, import_node_crypto53.randomUUID)() });
    }
    const envelope = toolCallAuditEnvelope(event, identity);
    const toolName = event.toolIdentifier.toLowerCase();
    return decisions.flatMap(
      ({ decisionId, source, approvalMode, outcome: outcome2, ruleId, escalation }) => {
        const action = {
          kind: "toolDecision",
          decisionId,
          toolName,
          source,
          approvalMode,
          outcome: outcome2,
          ...ruleId === void 0 ? {} : { ruleId }
        };
        const guardrails = escalation === void 0 ? [] : toolEscalationGuardrailRecords(escalation, envelope, action);
        return [...guardrails, { ...envelope, action }];
      }
    );
  }
};
var ASK_HUMAN_RULE_DENIED = {
  source: "policy",
  approvalMode: "ask_human",
  outcome: "denied"
};
function humanOnlyReviewLedger(audit, toolCallId) {
  if (audit === void 0 || toolCallId === void 0 || toolCallId.length === 0) {
    return { ruleRefused: () => {
    }, cardShown: () => {
    }, answered: () => {
    } };
  }
  let askedAPerson = false;
  const ruleRefused = () => void audit.decide(toolCallId, ASK_HUMAN_RULE_DENIED);
  return {
    ruleRefused,
    cardShown: () => {
      askedAPerson = true;
      audit.askAPerson(toolCallId);
    },
    answered: (approval) => {
      if (!askedAPerson && !approval.approved) ruleRefused();
    }
  };
}
async function requestReviewedApproval(ctx, controller, request5, decision) {
  const answer = await withToolExecutionTimeoutSuspended(
    ctx,
    () => controller.requestApproval(request5)
  );
  if (decision.toolCallId !== void 0) {
    ctx.get(toolDecisionAuditKey)?.recordApproval(decision.toolCallId, answer, decision.approvalMode);
  }
  return answer;
}
var DecisionRecordingClassifierExecutor = class {
  constructor(inner, audit) {
    this.inner = inner;
    this.audit = audit;
  }
  inner;
  audit;
  async execute(ctx, args, options2) {
    if (ctx.get(smartModeClassifierModeKey) === "shadow" || args.toolCallId.length === 0) {
      return await this.inner.execute(ctx, args, options2);
    }
    const retriedAttempt = (ctx.get(smartModeClassifierAttemptIndexKey) ?? 0) > 0;
    const record2 = (verdict) => {
      if (retriedAttempt) this.audit.supersede(args.toolCallId, verdict);
      else this.audit.decide(args.toolCallId, verdict);
    };
    let refusedOnce = false;
    const refuseAtTheCancelNotTheSettle = () => {
      if (refusedOnce) return;
      refusedOnce = true;
      record2(POLICY_DENIED);
    };
    ctx.signal.addEventListener("abort", refuseAtTheCancelNotTheSettle, { once: true });
    try {
      const result = await this.inner.execute(ctx, args, options2);
      if (ctx.signal.aborted) {
        refuseAtTheCancelNotTheSettle();
      } else {
        record2(
          result.result.case === "success" && result.result.value.decision === SmartModeClassifierDecision.ALLOW ? POLICY_ALLOWED : POLICY_DENIED
        );
      }
      return result;
    } catch (error42) {
      refuseAtTheCancelNotTheSettle();
      throw error42;
    } finally {
      ctx.signal.removeEventListener("abort", refuseAtTheCancelNotTheSettle);
    }
  }
};
function withToolDecisions(executor, audit) {
  return new DecisionRecordingClassifierExecutor(
    executor instanceof DecisionRecordingClassifierExecutor ? executor.inner : executor,
    audit
  );
}
