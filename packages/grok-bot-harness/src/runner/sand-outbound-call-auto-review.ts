var SAND_OUTBOUND_CALL_UNAVAILABLE_REASON = "Placing a live phone call needs your approval, which is not available in this conversation.";
var SAND_OUTBOUND_CALL_CANCELLED_REASON = "The phone call was cancelled before it was placed.";
async function reviewSandOutboundCall(args) {
  const ledger = humanOnlyReviewLedger(args.options.toolDecisions, args.toolCallId);
  if (args.signal?.aborted === true) {
    ledger.ruleRefused();
    return { allowed: false, reason: SAND_OUTBOUND_CALL_CANCELLED_REASON };
  }
  const controller = args.options.autoReviewController;
  if (controller === void 0) {
    ledger.ruleRefused();
    return { allowed: false, reason: SAND_OUTBOUND_CALL_UNAVAILABLE_REASON };
  }
  const { to: to3, instructions } = args.target;
  const approval = await requestReviewedApproval(
    args.ctx,
    controller,
    {
      agentId: args.options.agentId,
      surface: "mcp",
      fingerprint: fingerprintSandAutoReviewTarget({ to: to3, instructions }),
      reason: `This places a live phone call to ${to3} and speaks this script to whoever answers, and it cannot be recalled once you approve:

${instructions}`,
      summary: [
        args.options.fixtureNotice,
        summarizeSandMcpAutoReviewAction({
          serverDisplayName: "Agent telephony",
          toolName: SAND_PLACE_PHONE_CALL_TOOL_NAME,
          mcpArguments: { to: to3, session: { instructions } }
        })
      ].filter((part) => part !== void 0).join(" "),
      command: `Call ${to3}`,
      onCardShown: ledger.cardShown,
      signal: args.signal,
      expiryPolicy: args.options.getApprovalExpiryPolicy?.()
    },
    { toolCallId: args.toolCallId, approvalMode: "ask_human" }
  );
  ledger.answered(approval);
  return approval.approved ? { allowed: true } : { allowed: false, reason: approval.reason ?? "The user declined." };
}
