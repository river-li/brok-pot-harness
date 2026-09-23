init_errors();
function classify2(args, mode) {
  const { ctx, options: options2, spec, target } = args;
  const { stateHandler, extractConversationContext } = options2;
  return runSandAutoReviewClassifier({
    ctx,
    resourceAccessor: options2.resourceAccessor,
    toolCallId: args.toolCallId,
    mode,
    buildTarget: () => spec.buildRiskTarget({
      target,
      personalInstructions: options2.personalInstructions,
      userAutoRunInstructions: options2.userAutoRunInstructions,
      projectAutoRunInstructions: options2.projectAutoRunInstructions
    }),
    loadConversationContext: async () => stateHandler === void 0 || extractConversationContext === void 0 ? [] : await extractConversationContext(ctx, stateHandler),
    workspacePaths: options2.workspacePaths,
    errorReason: spec.classifierErrorReason
  });
}
async function runSandAutoReviewFlow(args) {
  const { ctx, target, options: options2, spec } = args;
  if (options2.mode === "off") return { allowed: { by: "unreviewed" } };
  if (options2.mode === "shadow") {
    void classify2(args, "shadow").catch((error42) => {
      reportHostDiagnostic({
        kind: "auto_review_shadow_classify_failed",
        errorClass: errorLogTag(error42)
      });
    });
    return { allowed: { by: "unreviewed" } };
  }
  const recordRuleRefusalTheToolReportsAsText = () => {
    options2.toolDecisions?.decide(args.toolCallId, {
      source: "policy",
      approvalMode: "auto_review",
      outcome: "denied"
    });
  };
  const cancelled = () => {
    const { abortPolicy } = spec;
    if (abortPolicy.kind !== "deny" || args.signal?.aborted !== true) return void 0;
    recordRuleRefusalTheToolReportsAsText();
    return { allowed: false, reason: abortPolicy.reason };
  };
  const cancelledBeforeClassify = cancelled();
  if (cancelledBeforeClassify !== void 0) return cancelledBeforeClassify;
  const forcedReason = spec.requireApproval?.(target);
  if (forcedReason !== void 0) recordRuleRefusalTheToolReportsAsText();
  const decision = forcedReason === void 0 ? await classify2(args, "enforce") : { kind: "block", reason: forcedReason };
  const cancelledAfterClassify = cancelled();
  if (cancelledAfterClassify !== void 0) return cancelledAfterClassify;
  if (decision.kind === "allow") return { allowed: { by: "classifier" } };
  const controller = options2.autoReviewController;
  if (decision.kind !== "block" || controller === void 0) {
    return { allowed: false, reason: decision.reason };
  }
  const approval = await requestReviewedApproval(
    ctx,
    controller,
    {
      agentId: options2.agentId,
      surface: spec.surface,
      fingerprint: fingerprintSandAutoReviewTarget(spec.fingerprintPayload(target)),
      reason: decision.reason,
      summary: spec.summarize(target),
      ...decision.proposedRule === void 0 ? {} : { proposedRule: decision.proposedRule },
      ...args.signal !== void 0 ? { signal: args.signal } : {},
      ...options2.getApprovalExpiryPolicy !== void 0 ? { expiryPolicy: options2.getApprovalExpiryPolicy() } : {}
    },
    { toolCallId: args.toolCallId, approvalMode: "auto_review" }
  );
  const cancelledAfterApproval = cancelled();
  if (cancelledAfterApproval !== void 0) return cancelledAfterApproval;
  return approval.approved ? { allowed: { by: "user" } } : { allowed: false, reason: approval.reason ?? decision.reason };
}
