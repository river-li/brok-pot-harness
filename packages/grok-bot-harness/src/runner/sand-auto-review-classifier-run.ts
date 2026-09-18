init_smart_mode_classifier_exec_pb();
var SAND_AUTO_REVIEW_BLOCK_REASON = "Blocked by Auto-review";
var SAND_AUTO_REVIEW_CLASSIFIER_MAX_ATTEMPTS = 1;
var SAND_AUTO_REVIEW_CLASSIFIER_TIMEOUT_MS = 15e3;
async function runSandAutoReviewClassifier(args) {
  try {
    const executor = args.resourceAccessor.get(smartModeClassifierExecutorResource);
    const result = await executeSmartModeClassifierWithMeasurement(
      args.ctx,
      executor,
      new SmartModeClassifierArgs({
        toolCallId: args.toolCallId,
        parentConversationId: getConversationGroupId(args.ctx) ?? getConversationId(args.ctx),
        target: args.buildTarget(),
        conversationContext: await args.loadConversationContext()
      }),
      args.mode,
      args.workspacePaths,
      {
        suppressToolCallIdLogging: true,
        maxAttempts: SAND_AUTO_REVIEW_CLASSIFIER_MAX_ATTEMPTS,
        timeoutMs: SAND_AUTO_REVIEW_CLASSIFIER_TIMEOUT_MS
      }
    );
    if (result.result.case !== "success") {
      return { kind: "reject", reason: args.errorReason };
    }
    const { decision, blockReason, proposedAllowRule } = result.result.value;
    if (decision === SmartModeClassifierDecision.BLOCK) {
      const proposedRule = proposedAllowRule?.trim();
      return {
        kind: "block",
        reason: blockReason?.trim() || SAND_AUTO_REVIEW_BLOCK_REASON,
        ...proposedRule !== void 0 && proposedRule.length > 0 ? { proposedRule } : {}
      };
    }
    return decision === SmartModeClassifierDecision.ALLOW ? { kind: "allow" } : { kind: "reject", reason: args.errorReason };
  } catch (error41) {
    if (error41 instanceof Error && error41.name === "AbortError") throw error41;
    return { kind: "reject", reason: args.errorReason };
  }
}
