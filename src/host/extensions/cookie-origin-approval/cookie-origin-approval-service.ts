/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/cookie-origin-approval/cookie-origin-approval-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var TERMINAL_MEMO_CAP = 256;
function createCookieOriginApprovalPort(deps) {
  const settleResolved = async (outcome) => {
    const { decision, grants } = outcome;
    const presented = {
      ...outcome.auto === void 0 ? {} : { auto: outcome.auto },
      ...outcome.items === void 0 ? {} : { items: outcome.items }
    };
    if (decision === "deny" || outcome.cookies.length === 0) {
      return { kind: "resolved", decision, grants, injected: 0, ...presented };
    }
    try {
      const { injected } = await deps.inject(outcome.cookies);
      return { kind: "resolved", decision, grants, injected, ...presented };
    } catch (error42) {
      const errorClass = errorLogTag(error42);
      deps.log(`cookie approval inject failed (${errorClass})`);
      return { kind: "failed", stage: "inject", errorClass, decision, grants, ...presented };
    }
  };
  const toGatewayReply = async (outcome) => {
    if (outcome.kind === "pending" || outcome.kind === "refused") return outcome;
    if (outcome.kind === "listed") return { kind: "listed", items: outcome.items };
    if (outcome.kind === "failed") return outcome;
    return await settleResolved(outcome);
  };
  const terminalByRequestId = /* @__PURE__ */ new Map();
  const forgetTerminal = (requestId2, own) => {
    if (terminalByRequestId.get(requestId2) === own) terminalByRequestId.delete(requestId2);
  };
  const rememberTerminal = (requestId2, reply2) => {
    terminalByRequestId.set(requestId2, reply2);
    while (terminalByRequestId.size > TERMINAL_MEMO_CAP) {
      const oldest = terminalByRequestId.keys().next().value;
      if (oldest === void 0) break;
      terminalByRequestId.delete(oldest);
    }
  };
  return {
    request: async (args) => {
      const outcome = await deps.desktop.request({
        origins: args.origins,
        signal: args.signal,
        ...args.requestId === void 0 ? {} : { requestId: args.requestId },
        ...args.agentId === void 0 ? {} : { agentId: args.agentId }
      });
      if (outcome.kind === "listed") {
        return {
          kind: "listed",
          items: outcome.items.map((item) => ({
            profileId: item.profileId,
            origin: item.origin,
            profileDisplayName: item.profileDisplayName
          }))
        };
      }
      if (outcome.kind === "refused") return outcome;
      if (outcome.kind === "failed") {
        const { items: items2, ...failure2 } = outcome;
        return { ...failure2, ...items2 === void 0 ? {} : { presentedItems: items2 } };
      }
      const settled = await settleResolved(outcome);
      if (settled.kind === "failed") {
        const { items: items2, ...failure2 } = settled;
        return { ...failure2, ...items2 === void 0 ? {} : { presentedItems: items2 } };
      }
      const { items, ...resolved } = settled;
      return { ...resolved, ...items === void 0 ? {} : { presentedItems: items } };
    },
    beginRequest: async (args) => {
      const memo = terminalByRequestId.get(args.requestId);
      if (memo !== void 0) return await memo;
      const begun = deps.desktop.begin(args);
      return begun.kind === "started" ? { kind: "pending" } : begun;
    },
    awaitRequest: async ({ requestId: requestId2, waitMs }) => {
      const memo = terminalByRequestId.get(requestId2);
      if (memo !== void 0) return await memo;
      const outcome = await deps.desktop.awaitOutcome(requestId2, waitMs);
      if (outcome.kind === "pending") return { kind: "pending" };
      const existing = terminalByRequestId.get(requestId2);
      if (existing !== void 0) return await existing;
      const replyPromise = toGatewayReply(outcome);
      rememberTerminal(requestId2, replyPromise);
      const reply2 = await replyPromise;
      if (reply2.kind === "refused") forgetTerminal(requestId2, replyPromise);
      return reply2;
    },
    cancelRequest: async ({ requestId: requestId2 }) => {
      terminalByRequestId.delete(requestId2);
      deps.desktop.cancel(requestId2);
    }
  };
}

