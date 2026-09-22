/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-auto-review-classifier-context.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function projectSandAutoReviewUserText(text2) {
  const body = stripLeadingSandTurnAssemblyNotes(
    stripSystemReminderBlocks(stripInstructionsUpdates(stripAgentProfileUpdates(text2)))
  );
  const own = stripGroupTurnClosing(stripAutomationWakeDeliveryGuidance(body));
  return own.length > 0 ? own : void 0;
}
var SAND_USER_MESSAGE_FILTER = {
  excludedUserMessageTextPrefixes: [SAND_HIDDEN_PROMPT_MARKER],
  trustedUserMessageTextPrefixes: [
    `${SAND_HIDDEN_PROMPT_MARKER}${SAND_TRUSTED_AUTOMATION_PROMPT_MARKER}`
  ],
  projectUserMessageText: projectSandAutoReviewUserText
};
var extractSandAutoReviewClassifierContext = (ctx, stateHandler) => tryExtractSandAutoReviewClassifierConversationContext(
  ctx,
  stateHandler,
  SAND_USER_MESSAGE_FILTER
);
var extractDescendantAutoReviewClassifierContext = (ctx, stateHandler) => tryExtractSandAutoReviewClassifierConversationContext(ctx, stateHandler, {
  ...SAND_USER_MESSAGE_FILTER,
  trustedUserMessagesOnly: true
});
function createSandAutoReviewClassifierContextExtractor(getParentConversationState, options2) {
  if (getParentConversationState === void 0) {
    return extractSandAutoReviewClassifierContext;
  }
  return async (ctx, childState) => {
    if (options2.automationSubagent) {
      const automationContext = await extractDescendantAutoReviewClassifierContext(ctx, childState);
      if (automationContext.some((message) => message.role === "user")) return automationContext;
    }
    let parentState;
    try {
      parentState = await getParentConversationState(ctx);
    } catch {
      return await extractSandAutoReviewClassifierContext(ctx, childState);
    }
    if (parentState === void 0) {
      return await extractSandAutoReviewClassifierContext(ctx, childState);
    }
    const [parentContext, childContext] = await Promise.all([
      extractSandAutoReviewClassifierContext(ctx, parentState),
      extractSandAutoReviewClassifierContext(ctx, childState)
    ]);
    return [
      ...parentContext.filter((message) => message.role !== "computer"),
      ...childContext.filter((message) => message.role === "computer")
    ];
  };
}

