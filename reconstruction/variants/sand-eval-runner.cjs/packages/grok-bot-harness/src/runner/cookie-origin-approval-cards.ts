/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/cookie-origin-approval-cards.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto34 = require("node:crypto");

// @recovered-fragment 2/2
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
function withCookieOriginApprovalCards(port, host) {
  return {
    request: async (request3) => {
      if (request3.origins.length === 0) return await port.request(request3);
      const requestId = (0, import_node_crypto34.randomUUID)();
      host.transport?.onUpdate({
        type: "send-message",
        message: {
          type: "cookie-origin-approval",
          approval: {
            requestId,
            items: cookieOriginApprovalItemsFromOrigins(request3.origins),
            status: "pending"
          }
        },
        timestampMs: Date.now()
      });
      const settleCard = (settlement) => {
        host.transport?.onUpdate({
          type: "cookie-origin-approval-status",
          requestId,
          status: settlement.status,
          ...settlement.items === void 0 ? {} : { items: settlement.items },
          approvedItems: settlement.approvedItems
        });
      };
      let outcome;
      try {
        outcome = await port.request({
          ...request3,
          requestId,
          agentId: host.getConversationId()
        });
      } catch (error3) {
        settleCard({ status: "expired", approvedItems: [] });
        throw error3;
      }
      settleCard(
        cookieOriginApprovalCardSettlement(outcome) ?? { status: "expired", approvedItems: [] }
      );
      return outcome;
    }
  };
}

