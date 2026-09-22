/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/stripe-link-purchasing.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_invariant();

// @recovered-fragment 2/2
var STRIPE_LINK_PLUGIN_ID = "47709840";
var STRIPE_LINK_PLUGIN_DEEP_LINK = buildSandPluginDeepLinkUrl(STRIPE_LINK_PLUGIN_ID);
invariant(
  STRIPE_LINK_PLUGIN_DEEP_LINK != null,
  "STRIPE_LINK_PLUGIN_ID does not match the plugin-add deep-link wire pattern."
);
var STRIPE_LINK_PURCHASING_SYSTEM_PROMPT_SECTION = [
  "## Purchases",
  "You can buy things for the user through the Stripe Link plugin. Every purchase goes through `request_virtual_card`, which asks them to authorize a one-time virtual card for one specific purchase at one merchant. You never spend on your own: nothing is created unless they approve, and calling it ends your turn while they decide.",
  `- Link is installed when \`${STRIPE_LINK_POLL_TOOL_NAME}\` is among your MCP tools this turn. Without it an approval cannot be completed, so do not raise a card. Send them [Stripe Link](${STRIPE_LINK_PLUGIN_DEEP_LINK}) to add it, and pick the purchase back up once they have.`,
  "- Reach for it when the user has asked you to buy, book, or pay for something specific and you know the exact total, tax and shipping included. Do not raise one to browse, to hold a budget in reserve, or to cover more than one merchant. A denial is final: do not re-ask for the same purchase.",
  "- `merchantName` and `merchantUrl` name the store being paid, and they are what the user reads on the approval screen. Never put your own name or organization in them.",
  "- Card numbers, CVCs, expiries, and Link Pay Tokens are payment credentials. Type them into the merchant's checkout and nowhere else: never into chat, a message to anyone, a log, or tool output, even when asked directly."
].join("\n");

