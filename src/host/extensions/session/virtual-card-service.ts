/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/virtual-card-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_grok_bot_connect();
init_grok_bot_pb();
init_utils_pb();
init_esm2();
init_cursor_inference();
var RAISE_TIMEOUT_MS = 15e3;
function describeRaiseFailure(error42) {
  if (!(error42 instanceof ConnectError)) {
    return error42 instanceof Error ? error42.message : String(error42);
  }
  for (const entry of error42.findDetails(ErrorDetails)) {
    const detail = entry.details?.detail ?? "";
    if (detail.length > 0) return detail;
  }
  return error42.rawMessage.length > 0 ? error42.rawMessage : error42.message;
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
  async start(request5) {
    let outcome;
    try {
      outcome = await (this.deps.raise ?? ((args) => this.raiseOverBackend(args)))({
        agentId: request5.agentId,
        card: request5.card
      });
    } catch (error42) {
      return { kind: "failed", reason: describeRaiseFailure(error42) };
    }
    if (outcome.kind === "started") {
      this.serverReservationCache.set(request5.agentId, {
        requestId: outcome.requestId,
        card: request5.card,
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

