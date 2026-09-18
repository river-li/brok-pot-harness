init_smart_mode_classifier_exec_pb();
init_esm();
init_errors();
var SAND_DRAFT_VERIFICATION_CLASSIFIER_TARGET_ACTION = "sand_draft_route_verification";
var SAND_DRAFT_VERIFICATION_CLASSIFIER_ERROR_REASON = "An error occurred while reviewing the connector reads that verify this draft's routing.";
function buildSandDraftVerificationRiskTarget(args) {
  const { route } = args;
  const argumentsJson = JSON.parse(
    JSON.stringify({
      surface: "mcp",
      purpose: "draft_route_verification",
      platform: route.platform,
      provider_identifier: route.providerIdentifier,
      reads: plannedDraftVerificationReads(route).map((read) => ({
        tool_name: read.toolName,
        arguments: read.args
      })),
      project_permissions: buildProjectPermissionsContext({
        personalInstructions: args.personalInstructions,
        userAutoRunInstructions: args.userAutoRunInstructions
      })
    })
  );
  return new SmartModeRiskTarget({
    action: SAND_DRAFT_VERIFICATION_CLASSIFIER_TARGET_ACTION,
    arguments: Struct.fromJson(argumentsJson)
  });
}
function summarizeVerificationReads(route) {
  const reads = plannedDraftVerificationReads(route).map((read) => read.toolName).join(", ");
  return `Read the ${route.platform === "email" ? "email" : "Slack"} connector "${route.providerIdentifier}" (${reads}) to verify a draft's routing before showing its composer card`;
}
function classify3(ctx, route, options2, toolCallId, mode) {
  const { stateHandler, extractConversationContext } = options2;
  return runSandAutoReviewClassifier({
    ctx,
    resourceAccessor: options2.resourceAccessor,
    toolCallId,
    mode,
    buildTarget: () => buildSandDraftVerificationRiskTarget({
      route,
      personalInstructions: options2.personalInstructions,
      userAutoRunInstructions: options2.userAutoRunInstructions
    }),
    loadConversationContext: async () => stateHandler === void 0 || extractConversationContext === void 0 ? [] : await extractConversationContext(ctx, stateHandler),
    errorReason: SAND_DRAFT_VERIFICATION_CLASSIFIER_ERROR_REASON
  });
}
async function reviewSandDraftRouteVerification(args) {
  const { ctx, route, options: options2, toolCallId } = args;
  if (options2.mode === "off") return { allowed: true };
  if (options2.mode === "shadow") {
    void classify3(ctx, route, options2, toolCallId, "shadow").catch((error41) => {
      reportHostDiagnostic({
        kind: "auto_review_shadow_classify_failed",
        errorClass: errorLogTag(error41)
      });
    });
    return { allowed: true };
  }
  const decision = await classify3(ctx, route, options2, toolCallId, "enforce");
  if (decision.kind === "allow") return { allowed: true };
  const controller = options2.autoReviewController;
  if (decision.kind !== "block" || controller === void 0) {
    return { allowed: false, reason: decision.reason };
  }
  const approval = await withToolExecutionTimeoutSuspended(
    ctx,
    () => controller.requestApproval({
      agentId: options2.agentId,
      surface: "mcp",
      fingerprint: fingerprintSandAutoReviewTarget({
        purpose: "draft_route_verification",
        platform: route.platform,
        provider_identifier: route.providerIdentifier,
        reads: plannedDraftVerificationReads(route)
      }),
      reason: decision.reason,
      summary: summarizeVerificationReads(route)
    })
  );
  return approval.approved ? { allowed: true } : { allowed: false, reason: approval.reason ?? decision.reason };
}
