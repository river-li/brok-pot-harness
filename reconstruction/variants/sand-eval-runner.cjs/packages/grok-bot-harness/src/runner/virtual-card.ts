/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/virtual-card.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function buildVirtualCardApprovalMessage(args) {
  return {
    type: "virtual-card-approval",
    approval: {
      requestId: args.requestId,
      amountCents: args.card.amountCents,
      currency: args.card.currency,
      merchantName: args.card.merchantName,
      merchantUrl: args.card.merchantUrl,
      title: args.card.title,
      context: args.card.context,
      lineItems: args.card.lineItems,
      status: "pending"
    }
  };
}
function parseMerchantUrl(raw) {
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return { kind: "not-a-url" };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { kind: "bad-protocol", protocol: parsed.protocol };
  }
  return { kind: "ok", url: parsed.toString() };
}
var PENDING_VIRTUAL_CARD_TTL_SECONDS = 24 * 60 * 60;
var VIRTUAL_CARD_POLL_DELAYS_SECONDS = [5, 15, 30, 60];
var VIRTUAL_CARD_POLL_SCHEDULE = VIRTUAL_CARD_POLL_DELAYS_SECONDS.join(", then ");

