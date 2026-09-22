/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/virtual-card.ts
 * Bundle: sand-host/host-main.cjs
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
  let parsed2;
  try {
    parsed2 = new URL(raw);
  } catch {
    return { kind: "not-a-url" };
  }
  if (parsed2.protocol !== "https:" && parsed2.protocol !== "http:") {
    return { kind: "bad-protocol", protocol: parsed2.protocol };
  }
  return { kind: "ok", url: parsed2.toString() };
}
var PENDING_VIRTUAL_CARD_TTL_SECONDS = 24 * 60 * 60;
var VIRTUAL_CARD_POLL_DELAYS_SECONDS = [5, 15, 30, 60];
var VIRTUAL_CARD_POLL_SCHEDULE = VIRTUAL_CARD_POLL_DELAYS_SECONDS.join(", then ");
function buildVirtualCardApprovedAck(spendRequestId) {
  return [
    `The user approved the card and is authorizing it on Stripe Link now. The spend request id is ${spendRequestId}.`,
    `Poll get_spend_request with that id on a widening delay: wait ${VIRTUAL_CARD_POLL_SCHEDULE} seconds, checking once after each wait.`,
    "Say nothing to the user while you poll. They are on Link's page, not reading the chat, and a running commentary of checking again is pure noise.",
    'Once the status is approved, call get_spend_request again with include: ["card"] and type the card details into the merchant checkout.',
    "If it comes back denied or expired, or is still pending after the last check, stop polling and say where it stands in one message. Do not create or ask for another card unless they ask you to."
  ].join(" ");
}
function buildVirtualCardDeniedAck() {
  return "The user declined the card, so nothing was authorized and no money moved. Do not ask again for the same purchase. Acknowledge it briefly and ask what they would like to do instead.";
}
function buildVirtualCardFailedAck() {
  return "The user approved the card but Stripe Link could not create it, so nothing was authorized and no money moved. Tell the user plainly that the card could not be created, and ask what they would like to do instead. Do not describe this as the user declining.";
}
function formatVirtualCardAmountForModel(card) {
  return `${(card.amountCents / 100).toFixed(2)} ${card.currency.toUpperCase()}`;
}
function buildVirtualCardExpiredAck(card) {
  const amount = formatVirtualCardAmountForModel(card);
  return [
    `Your card request for ${amount} at ${card.merchantName} expired before the user answered it, and they have just tried to approve it. Nothing was authorized and no money moved.`,
    "They still want this purchase, so raise it again with request_virtual_card instead of asking them to confirm a decision they already made.",
    "Re-check the merchant's total first if you can still reach it: time has passed, and a card issued for less than the cart total is declined at checkout.",
    "Say nothing before the new card, which speaks for itself. If the purchase is no longer possible at all, say why in one message and do not raise a card."
  ].join(" ");
}
function buildVirtualCardAnswerPrompt(answer) {
  if (!answer.approved) return buildVirtualCardDeniedAck();
  return answer.spendRequestId === void 0 ? buildVirtualCardFailedAck() : buildVirtualCardApprovedAck(answer.spendRequestId);
}

