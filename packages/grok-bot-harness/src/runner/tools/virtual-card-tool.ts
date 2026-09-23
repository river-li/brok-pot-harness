init_invariant();
init_zod();
var VIRTUAL_CARD_MAX_AMOUNT_CENTS = 5e5;
var VIRTUAL_CARD_MIN_CONTEXT_LENGTH = 100;
var VIRTUAL_CARD_MAX_CONTEXT_LENGTH = 140;
var VIRTUAL_CARD_MAX_MERCHANT_NAME_LENGTH = 120;
var VIRTUAL_CARD_MAX_TITLE_LENGTH = 80;
var VIRTUAL_CARD_MAX_TITLE_WORDS = 7;
var VIRTUAL_CARD_MAX_LINE_ITEMS = 20;
var VIRTUAL_CARD_MAX_LINE_ITEM_LABEL_LENGTH = 80;
var VIRTUAL_CARD_CURRENCY = "usd";
var requestVirtualCardParameters = external_exports.object({
  amountCents: external_exports.number().int().positive().max(VIRTUAL_CARD_MAX_AMOUNT_CENTS).describe(
    `The total to authorize, in CENTS. 4200 means $42.00, not $4200. Whole cents only, at most ${VIRTUAL_CARD_MAX_AMOUNT_CENTS} (Link's ceiling). Include tax and shipping, and make lineItems sum to exactly this. It is the total that gets charged, and a card issued for less than the cart total is declined at checkout.`
  ),
  currency: external_exports.string().trim().toLowerCase().default(VIRTUAL_CARD_CURRENCY).describe(
    `Currency code. Only "${VIRTUAL_CARD_CURRENCY}" is supported, so omit this and pass amountCents in cents.`
  ),
  merchantName: external_exports.string().trim().min(1).describe('The store being paid, as the user would recognize it, e.g. "Nike".'),
  merchantUrl: external_exports.string().trim().min(1).describe('The merchant checkout URL, e.g. "https://nike.com/checkout". Must be http(s).'),
  title: external_exports.string().trim().min(1).describe(
    `A short, plain line naming this payment, the way the user would say it, e.g. "Pay Letterform Archive for Type Selection". This is the headline on the approval card, so keep it scannable: at most ${VIRTUAL_CARD_MAX_TITLE_WORDS} words, no amount (the card shows it), and no sentence about yourself.`
  ),
  context: external_exports.string().trim().min(VIRTUAL_CARD_MIN_CONTEXT_LENGTH).max(VIRTUAL_CARD_MAX_CONTEXT_LENGTH).describe(
    `One sentence on what is being bought and why, between ${VIRTUAL_CARD_MIN_CONTEXT_LENGTH} and ${VIRTUAL_CARD_MAX_CONTEXT_LENGTH} characters. The user reads this as the description on the approval card AND on Link's page, so write it for them: name the items and why you are buying now. Leave the prices to lineItems, do not restate the amount, and do not narrate what you are doing.`
  ),
  lineItems: external_exports.array(
    external_exports.object({
      label: external_exports.string().trim().min(1).describe(
        `What this line is, as the merchant's own cart names it, e.g. "Type Selection", "Tax", "Shipping".`
      ),
      amountCents: external_exports.number().int().describe("This line's cost in CENTS. Negative for a discount.")
    })
  ).min(1).max(VIRTUAL_CARD_MAX_LINE_ITEMS).describe(
    "The cart broken down line by line, which the user expands to see what they are paying for. Must sum EXACTLY to amountCents. Do not add a total row: the card renders one from amountCents."
  )
});
var STRIPE_LINK_POLL_TOOL_NAME = "get_spend_request";
function hasStripeLinkConnector(mcpTools) {
  return mcpTools.some((tool) => tool.toolName === STRIPE_LINK_POLL_TOOL_NAME);
}
function normalizeMerchantUrl(raw) {
  const parsed2 = parseMerchantUrl(raw);
  switch (parsed2.kind) {
    case "ok":
      return parsed2.url;
    case "not-a-url":
      throw new SandToolInputError(
        `merchantUrl ${JSON.stringify(raw)} is not a URL. Pass the full checkout URL including the scheme, e.g. "https://nike.com/checkout".`
      );
    case "bad-protocol":
      throw new SandToolInputError(
        `merchantUrl must be an http(s) URL; got ${JSON.stringify(parsed2.protocol)}.`
      );
  }
}
function normalizeCurrency(raw) {
  if (raw !== VIRTUAL_CARD_CURRENCY) {
    throw new SandToolInputError(
      `currency ${JSON.stringify(raw)} is not supported; only ${JSON.stringify(VIRTUAL_CARD_CURRENCY)} is. Price the purchase in US dollars, or tell the user this store cannot be paid this way.`
    );
  }
  return raw;
}
function normalizeTitle(raw) {
  const title = clampLine(raw, VIRTUAL_CARD_MAX_TITLE_LENGTH);
  const words2 = title.split(/\s+/).filter((word) => word.length > 0);
  if (words2.length > VIRTUAL_CARD_MAX_TITLE_WORDS) {
    throw new SandToolInputError(
      `title is ${words2.length} words; keep it to ${VIRTUAL_CARD_MAX_TITLE_WORDS} or fewer, naming the payment and nothing else, e.g. "Pay Letterform Archive for Type Selection".`
    );
  }
  return title;
}
function normalizeLineItems(items, amountCents) {
  const total = items.reduce((sum, item) => sum + item.amountCents, 0);
  if (total !== amountCents) {
    throw new SandToolInputError(
      `lineItems sum to ${total} cents but amountCents is ${amountCents}. They must match exactly; the card renders the total from amountCents, so do not include a total row.`
    );
  }
  return items.map((item) => ({
    label: clampLine(item.label, VIRTUAL_CARD_MAX_LINE_ITEM_LABEL_LENGTH),
    amountCents: item.amountCents
  }));
}
function normalizeVirtualCardRequest(args) {
  return {
    amountCents: args.amountCents,
    currency: normalizeCurrency(args.currency),
    merchantName: clampLine(args.merchantName, VIRTUAL_CARD_MAX_MERCHANT_NAME_LENGTH),
    merchantUrl: normalizeMerchantUrl(args.merchantUrl),
    title: normalizeTitle(args.title),
    context: clampBlock(args.context, VIRTUAL_CARD_MAX_CONTEXT_LENGTH),
    lineItems: normalizeLineItems(args.lineItems, args.amountCents)
  };
}
async function runRequestVirtualCard(args, deps) {
  const agentId = deps.getAgentId();
  invariant(agentId != null, "request_virtual_card was called outside an agent run.");
  const card = normalizeVirtualCardRequest(args);
  const outcome = await deps.requestCard({ agentId, card });
  if (outcome.kind === "already-pending") {
    return `The user still has your card request for ${outcome.merchantName} open and hasn't answered it, so this request was NOT sent. Two live purchase cards would let whichever they click first decide what gets bought. Do not ask again. If you need to tell them something, use SendToUser; otherwise wait, and you'll be resumed when they answer.`;
  }
  if (outcome.kind === "canceled") {
    return "The card request was NOT shown: it was canceled while being prepared (the conversation or agent was shut down or reset). Do not re-issue it.";
  }
  if (outcome.kind === "failed") {
    return `The card request was NOT shown: raising it failed (${outcome.reason}). Nothing was charged and no card is pending. Tell the user plainly that the request could not be sent, and ask whether to try again.`;
  }
  if (outcome.supersededRequestId !== void 0) {
    await deps.retireCard({ agentId, requestId: outcome.supersededRequestId });
  }
  deps.endTurn();
  deps.onSendMessage(
    buildVirtualCardApprovalMessage({ requestId: outcome.requestId, card }),
    Date.now()
  );
  if (deps.toolCallId !== void 0) deps.toolDecisions?.askAPerson(deps.toolCallId);
  return "Asked the user to authorize the card; your turn is over. If they approve, they finish on Link's page and you'll be resumed with the spend request id to poll. If they deny, you'll be resumed with that instead.";
}
function createRequestVirtualCardTool(deps) {
  return defineCommunicateTool(deps, {
    id: "REQUEST_VIRTUAL_CARD",
    name: "request_virtual_card",
    description: `Ask the user to authorize a one-time virtual card for a specific purchase. You cannot create a purchase yourself. This only ASKS; the user sees a card with the amount, the merchant, your reason, and the cart broken down line by line, and nothing is created unless they approve. Your turn ends when you call this. On approval they finish authorizing on Stripe Link's own page in their browser, and you are resumed with the spend request id; poll get_spend_request with it on a widening delay, waiting ${VIRTUAL_CARD_POLL_SCHEDULE} seconds before each check and saying NOTHING to the user in between, then fetch the card with include: ["card"] and type those details into the merchant's checkout. If it is still pending after the last check, give up and tell the user rather than polling on. Get the amount right the first time. It is the exact total that will be charged including tax and shipping, and a card issued for too little is declined at checkout. Raising a card while the user still has one open replaces it, and the older card is retired unanswered, so do that only when the purchase itself has changed or they asked for a new one, never to nudge them. If they deny, take that as final and do not re-ask for the same purchase.`,
    parameters: requestVirtualCardParameters,
    execute: async (ctx, args, d) => {
      const merchant = parseMerchantUrl(args.merchantUrl);
      if (merchant.kind === "ok") noteToolTargetHost(ctx, d.toolCallId, merchant.url);
      return runRequestVirtualCard(args, d);
    }
  });
}
