init_zod();
var SAND_TEAM_PUBLISH_TOOL_NAME = "team_publish";
var TEAM_PUBLISH_NOT_OWNER_LINE = "Only my owner can publish or unpublish me";
var TEAM_PUBLISH_NOT_OWNER_RESULT = `Refused: only the owner can publish or unpublish you, and only when they ask for it in their own chat with you. Say just this, as is: ${TEAM_PUBLISH_NOT_OWNER_LINE}`;
var TEAM_PUBLISH_UNAVAILABLE_RESULT = "Publishing is not available for this bot. Nothing changed.";
var TEAM_PUBLISH_SETUP_OPEN_RESULT = "Not yet: setup is still running. Publishing works once the setup cards are done and the Publish to team card is in the chat. Nothing changed.";
var TEAM_PUBLISH_DECLINED_RESULT = "The owner kept you published. Nothing changed.";
var teamPublishParameters = external_exports.object({
  action: external_exports.enum(["publish", "unpublish"]).describe(
    "publish: teammates can find and message you from then on. unpublish: make yourself a draft again that only the owner can see."
  )
});
function describePublish(outcome) {
  switch (outcome.kind) {
    case "published":
      return `Published. Teammates can now find you under New chat \u2192 Team Bots, and the card in this chat now shows Copy link for sharing you. Tell the owner in one short message.${outcome.slackAppExists ? "" : " You have no Slack app yet, so offer to add yourself to their Slack workspace."}`;
    case "already_published":
      return "You were already published, so nothing changed.";
    case "not_owner":
      return TEAM_PUBLISH_NOT_OWNER_RESULT;
    case "setup_open":
      return TEAM_PUBLISH_SETUP_OPEN_RESULT;
    case "unavailable":
      return TEAM_PUBLISH_UNAVAILABLE_RESULT;
  }
}
function describeUnpublish(outcome) {
  switch (outcome.kind) {
    case "unpublished":
      return "Unpublished. You are a draft again: teammates can't see or message you, and their routines on you wait, until you are published again, when their chats, routines and everything saved on you come back. The card in this chat offers Publish to team again. Tell the owner in one short message.";
    case "not_published":
      return "You are not published, so nothing changed.";
    case "not_owner":
      return TEAM_PUBLISH_NOT_OWNER_RESULT;
    case "setup_open":
      return TEAM_PUBLISH_SETUP_OPEN_RESULT;
    case "unavailable":
      return TEAM_PUBLISH_UNAVAILABLE_RESULT;
  }
}
function createTeamPublishTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_TEAM_PUBLISH_TOOL_NAME,
    description: "Publish yourself to your owner's team, or make yourself a draft again. Only your owner can use it, in their own chat with you, when they ask for it. publish: teammates can find and message you from then on; it works once setup has finished, while you are still a draft. unpublish: puts an approval card in the chat, and only the owner's tap makes you a draft again; teammates lose access until you are published again, and nothing saved on you is lost.",
    parameters: teamPublishParameters,
    describeActivity: (args) => ({ detail: args.action }),
    execute: async (ctx, args, d) => {
      const ledger = humanOnlyReviewLedger(d.toolDecisions, d.toolCallId);
      if (d.activeTurnRequestSource() !== "turn") {
        ledger.ruleRefused();
        return TEAM_PUBLISH_NOT_OWNER_RESULT;
      }
      if (d.isTeamSetupUnderway()) return TEAM_PUBLISH_SETUP_OPEN_RESULT;
      if (args.action === "publish") {
        return describePublish(await d.teamPublish.publish());
      }
      const ready3 = await d.teamPublish.checkUnpublish();
      if (ready3.kind !== "ready") {
        ledger.ruleRefused();
        return describeUnpublish(ready3);
      }
      const controller = d.autoReviewController;
      if (controller === void 0) {
        ledger.ruleRefused();
        return TEAM_PUBLISH_UNAVAILABLE_RESULT;
      }
      const approval = await requestReviewedApproval(
        ctx,
        controller,
        {
          surface: "mcp",
          fingerprint: fingerprintSandAutoReviewTarget({
            tool: SAND_TEAM_PUBLISH_TOOL_NAME,
            action: "unpublish",
            conversationId: d.getConversationId()
          }),
          reason: `This takes ${ready3.name} off the team. Teammates can't see or message it until you publish it again. Nothing saved on it is lost.`,
          summary: `Unpublish ${ready3.name} from the team`,
          onCardShown: ledger.cardShown,
          signal: ctx.signal,
          expiryPolicy: d.getApprovalExpiryPolicy()
        },
        { toolCallId: d.toolCallId, approvalMode: "ask_human" }
      );
      ledger.answered(approval);
      if (!approval.approved) return TEAM_PUBLISH_DECLINED_RESULT;
      return describeUnpublish(await d.teamPublish.unpublish());
    }
  });
}
