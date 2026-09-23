function cookieOriginApprovalCardSettlement(outcome) {
  if (outcome.kind === "listed") return null;
  if (outcome.kind === "refused") {
    if (outcome.reason === "denied") {
      return { status: "denied", items: [], approvedItems: [] };
    }
    return { status: "expired", approvedItems: [] };
  }
  const items = outcome.presentedItems;
  const withItems = items === void 0 ? {} : { items };
  if (outcome.kind === "failed") {
    return { status: "failed", ...withItems, approvedItems: grantedItems(items, outcome.grants) };
  }
  if (outcome.decision === "deny") {
    return { status: "denied", ...withItems, approvedItems: [] };
  }
  const approvedItems = grantedItems(items, outcome.grants);
  if (outcome.auto === true) {
    return { status: "allowed", ...withItems, approvedItems };
  }
  return {
    status: outcome.decision === "always-allow" ? "always" : "approved",
    ...withItems,
    approvedItems
  };
}
function grantedItems(items, grants) {
  const grantKeys = new Set(grants.map(cookieOriginGrantKey));
  return (items ?? []).filter((item) => grantKeys.has(cookieOriginGrantKey(item)));
}
var EXPIRED_CARD_ANSWERS = { expired: "timed_out", aborted: "held" };
function cookieOriginApprovalAnswer(outcome) {
  if (outcome.kind !== "listed" && outcome.kind !== "refused" && outcome.auto === true) {
    return void 0;
  }
  switch (cookieOriginApprovalCardSettlement(outcome)?.status) {
    case void 0:
    case "allowed":
      return void 0;
    case "approved":
    case "always":
    case "failed":
      return "allowed";
    case "denied":
      return "denied";
    case "expired": {
      const reason = outcome.kind === "refused" ? outcome.reason : void 0;
      return (reason === void 0 ? void 0 : EXPIRED_CARD_ANSWERS[reason]) ?? "unaskable";
    }
  }
}
function recordCookieOriginApprovalAnswer(audit, toolCallId, cardId, answer) {
  if (audit === void 0 || toolCallId === void 0 || answer === void 0) return;
  if (answer === "unaskable") humanOnlyReviewLedger(audit, toolCallId).ruleRefused();
  else
    audit.recordHumanAnswer(toolCallId, {
      decisionId: cardId,
      outcome: answer,
      approvalMode: "ask_human"
    });
}
function withCookieOriginApprovalCards(port, host) {
  return {
    request: async (request5) => {
      if (request5.origins.length === 0) return await port.request(request5);
      const requestId2 = (0, import_node_crypto79.randomUUID)();
      host.transport?.onUpdate({
        type: "send-message",
        message: {
          type: "cookie-origin-approval",
          approval: {
            requestId: requestId2,
            items: cookieOriginApprovalItemsFromOrigins(request5.origins),
            status: "pending"
          }
        },
        timestampMs: Date.now()
      });
      const settleCard = (settlement) => {
        host.transport?.onUpdate({
          type: "cookie-origin-approval-status",
          requestId: requestId2,
          status: settlement.status,
          ...settlement.items === void 0 ? {} : { items: settlement.items },
          approvedItems: settlement.approvedItems
        });
      };
      const record2 = (answer) => recordCookieOriginApprovalAnswer(
        host.toolDecisionAudit,
        request5.toolCallId,
        requestId2,
        answer
      );
      let outcome;
      try {
        outcome = await port.request({
          ...request5,
          requestId: requestId2,
          agentId: host.getConversationId()
        });
      } catch (error42) {
        settleCard({ status: "expired", approvedItems: [] });
        record2("unaskable");
        throw error42;
      }
      settleCard(
        cookieOriginApprovalCardSettlement(outcome) ?? { status: "expired", approvedItems: [] }
      );
      record2(cookieOriginApprovalAnswer(outcome));
      return outcome;
    }
  };
}
