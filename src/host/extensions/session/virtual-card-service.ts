init_grok_bot_connect();
init_grok_bot_pb();
init_utils_pb();
init_esm2();
init_cursor_inference();
var RAISE_TIMEOUT_MS = 15e3;
function describeRaiseFailure(error41) {
  if (!(error41 instanceof ConnectError)) {
    return error41 instanceof Error ? error41.message : String(error41);
  }
  for (const entry of error41.findDetails(ErrorDetails)) {
    const detail = entry.details?.detail ?? "";
    if (detail.length > 0) return detail;
  }
  return error41.rawMessage.length > 0 ? error41.rawMessage : error41.message;
}
var VirtualCardService = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  serverReservationCache = /* @__PURE__ */ new Map();
  get(agentId) {
    return this.serverReservationCache.get(agentId) ?? null;
  }
  forget(agentId) {
    this.serverReservationCache.delete(agentId);
  }
  async start(request3) {
    let outcome;
    try {
      outcome = await (this.deps.raise ?? ((args) => this.raiseOverBackend(args)))({
        agentId: request3.agentId,
        card: request3.card
      });
    } catch (error41) {
      return { kind: "failed", reason: describeRaiseFailure(error41) };
    }
    if (outcome.kind === "started") {
      this.serverReservationCache.set(request3.agentId, {
        requestId: outcome.requestId,
        card: request3.card,
        requestedAtMs: Date.now()
      });
    }
    return outcome;
  }
  async raiseOverBackend(args) {
    const client = createSandCursorBackendClient(GrokBotService, this.deps.backend);
    const response = await client.raiseGrokBotVirtualCard(
      new RaiseGrokBotVirtualCardRequest({
        agentId: args.agentId,
        amountCents: BigInt(args.card.amountCents),
        currency: args.card.currency,
        merchantName: args.card.merchantName,
        merchantUrl: args.card.merchantUrl,
        context: args.card.context
      }),
      { timeoutMs: RAISE_TIMEOUT_MS }
    );
    if (response.outcome === GrokBotVirtualCardRaiseOutcome.ALREADY_PENDING) {
      return {
        kind: "already-pending",
        requestId: response.requestId,
        merchantName: response.merchantName ?? "the pending request"
      };
    }
    return {
      kind: "started",
      requestId: response.requestId,
      ...response.supersededRequestId === void 0 ? {} : { supersededRequestId: response.supersededRequestId }
    };
  }
};
