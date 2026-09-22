/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-feedback-tool.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var SAND_SEND_FEEDBACK_TOOL_NAME = "SendFeedback";
var sendFeedbackParameters = external_exports.object({
  message: external_exports.string().trim().min(1).max(SAND_AUTO_REVIEW_COMMAND_MAX_CHARS).describe("The user's feedback, in their own words.")
});
var RATE_LIMIT_FALLBACK_MINUTES = 5;
var FEEDBACK_NOT_APPROVED_MESSAGE = "Feedback was not sent: the user did not approve sending it. Do not retry; ask the user what they would like to do instead.";
var FEEDBACK_APPROVAL_UNAVAILABLE_MESSAGE = "Feedback was not sent: sending feedback needs the user's approval, which is not available in this conversation. Tell the user to use Help > Send Feedback instead.";
var FEEDBACK_PRIVACY_MODE_MESSAGE = "The feedback tool is unavailable in privacy mode. Tell the user to send their feedback themselves via Help > Send Feedback.";
function isAgentFeedbackBlockedByPrivacyMode(privacyMode) {
  switch (privacyMode) {
    case PrivacyMode.USAGE_DATA_TRAINING_ALLOWED:
    case PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED:
      return false;
    case PrivacyMode.NO_STORAGE:
    case PrivacyMode.NO_TRAINING:
    case PrivacyMode.UNSPECIFIED:
    default:
      return true;
  }
}
function createSendFeedbackTool(deps) {
  return defineCommunicateTool(deps, {
    id: "SEND_FEEDBACK",
    name: SAND_SEND_FEEDBACK_TOOL_NAME,
    description: "Send product feedback to the SpaceXAI team on the user's behalf. Use this ONLY when the user explicitly asks to file, send, or pass along feedback about Grok Bot. Summarize their feedback faithfully in their own words; never invent feedback and never send it unprompted. Never include code, credentials, file contents, or content drawn from connectors unless the user dictated it as part of their feedback. Feedback filed with this tool is read as product feedback but never receives a support response. Do not ask whether the user wants a reply and do not promise one. If they need a support response, tell them to use Help > Send Feedback and select the reply checkbox. The user reviews the exact message on an approval card and nothing is sent unless they approve. If the result says you were rate-limited, tell the user when to retry instead of retrying yourself.",
    parameters: sendFeedbackParameters,
    execute: async (ctx, args, d) => {
      if (isAgentFeedbackBlockedByPrivacyMode(d.privacyMode)) {
        return FEEDBACK_PRIVACY_MODE_MESSAGE;
      }
      const controller = d.autoReviewController;
      if (controller === void 0) {
        return FEEDBACK_APPROVAL_UNAVAILABLE_MESSAGE;
      }
      const conversationId = d.getConversationId();
      const approval = await withToolExecutionTimeoutSuspended(
        ctx,
        () => controller.requestApproval({
          surface: "feedback",
          fingerprint: fingerprintSandAutoReviewTarget({
            surface: "feedback",
            conversationId,
            message: args.message
          }),
          reason: "This exact text will be sent to the SpaceXAI team from your account as product feedback. Nothing is sent unless you approve.",
          summary: "Send product feedback to the SpaceXAI team",
          command: args.message,
          signal: ctx.signal,
          expiryPolicy: d.getApprovalExpiryPolicy()
        })
      );
      if (!approval.approved) {
        return FEEDBACK_NOT_APPROVED_MESSAGE;
      }
      let platformFields = {};
      if (approval.approvalPlatform !== void 0) {
        platformFields = {
          approvalPlatform: approval.approvalPlatform,
          clientSurface: approval.approvalPlatform === "desktop" ? "desktop" : "mobile"
        };
      }
      const outcome = await d.submitProductFeedback({
        message: args.message,
        conversationId,
        toolCallId: d.toolCallId,
        ...platformFields
      });
      if (outcome.result.ok) {
        return "Feedback sent to the SpaceXAI team as product feedback. It will not receive a support response. Confirm to the user that it went through.";
      }
      if (outcome.result.code === "rate-limited") {
        const minutes = Math.max(
          1,
          Math.ceil((outcome.retryAfterSeconds ?? RATE_LIMIT_FALLBACK_MINUTES * 60) / 60)
        );
        return `Feedback was rate-limited. Do not retry now; tell the user to try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`;
      }
      if (outcome.result.code === "privacy-mode") {
        return FEEDBACK_PRIVACY_MODE_MESSAGE;
      }
      return `Feedback could not be sent (${outcome.result.code}). Tell the user it did not go through.`;
    }
  });
}

