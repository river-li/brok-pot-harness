/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/team-access-tools.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var SAND_OFFER_TEAM_ACCESS_TOOL_NAME = "offer_team_access";
var SAND_OFFER_SLACK_CONNECT_TOOL_NAME = "offer_slack_connect";
var offerCardParameters = external_exports.object({
  reason: external_exports.string().trim().max(200).optional().describe(
    `Optional short clause shown on the card explaining why you're offering, e.g. "so your teammates can message me too". No trailing period.`
  )
});
function createOfferTeamAccessTool(deps) {
  return defineCommunicateTool(deps, {
    id: "OFFER_TEAM_ACCESS",
    name: SAND_OFFER_TEAM_ACCESS_TOOL_NAME,
    description: "Show an in-chat card offering to share this bot with the user's team, with an Enable button and a Skip button. Use when the user works with teammates who would benefit from messaging this bot \u2014 typically once, near the end of getting-started. Enable runs the existing team-access flow and the user's choice comes back as their reply; Skip is a decline, so don't re-offer. The card is the whole ask: don't also paste instructions, links, or settings paths.",
    parameters: offerCardParameters,
    execute: async (_ctx, args, d) => {
      d.onSendMessage(
        { type: "team-access", ...args.reason == null ? {} : { reason: args.reason } },
        Date.now()
      );
      return "The team-access card is in the chat. The user's choice arrives as their reply \u2014 enabled means teammates can now see and message this bot; a skip is a decline, so continue without it and don't re-offer.";
    }
  });
}
function createOfferSlackConnectTool(deps) {
  return defineCommunicateTool(deps, {
    id: "OFFER_SLACK_CONNECT",
    name: SAND_OFFER_SLACK_CONNECT_TOOL_NAME,
    description: "Show an in-chat card offering to connect this bot to the user's Slack workspace, with a Connect button and a Skip button. Works for personal and team-shared bots alike; team access is not required. When team access and Slack are both missing during getting-started, offer team access first and this card after the user enables or skips it, or right away when they ask for Slack. Connect opens the existing Slack setup flow; when it completes you are woken automatically with a Slack-linked note, so don't ask the user to report back. A Skip arrives as their reply and is a decline, so don't re-offer. The card is the whole ask: don't also paste instructions or links.",
    parameters: offerCardParameters,
    execute: async (_ctx, args, d) => {
      d.onSendMessage(
        { type: "slack-connect", ...args.reason == null ? {} : { reason: args.reason } },
        Date.now()
      );
      return "The Slack connect card is in the chat. If the user connects, you're woken automatically once the link completes; a skip arrives as their reply and is a decline, so continue without it and don't re-offer.";
    }
  });
}

