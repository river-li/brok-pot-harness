var SAND_OUTBOUND_CALL_UNAVAILABLE_REASON = "Placing a live phone call needs your approval, which is not available in this conversation.";
var SAND_OUTBOUND_CALL_CANCELLED_REASON = "The phone call was cancelled before it was placed.";
var requests = createCounter("grok_bot.turn.outbound_call_request", {
  description: "One increment per place_phone_call the model attempted, by what the approval did with it: approved, declined by the owner, retired unanswered, refused because the conversation has no route to a card, or cancelled before the card went up. Its total is the top of the funnel that grok_bot.turn.outbound_call counts the dials of. Separate from grok_bot.auto_review.approval because a call raises its card on the mcp surface, where a couple of dozen calls a fortnight sit under six figures of MCP tool approvals with no tag to separate them",
  labelNames: ["result", "cause"]
});
async function reviewSandOutboundCall(args) {
  const ledger = humanOnlyReviewLedger(args.options.toolDecisions, args.toolCallId);
  const counted = (result, cause = "none") => requests.increment(args.ctx, 1, { result, cause });
  if (args.signal?.aborted === true) {
    ledger.ruleRefused();
    counted("cancelled");
    return { allowed: false, reason: SAND_OUTBOUND_CALL_CANCELLED_REASON };
  }
  const controller = args.options.autoReviewController;
  if (controller === void 0) {
    ledger.ruleRefused();
    counted("no_reviewer");
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
  if (approval.approved) {
    counted("approved");
    return { allowed: true };
  }
  if (approval.retired === void 0) counted("declined");
  else counted("retired", approval.retired);
  return { allowed: false, reason: approval.reason ?? "The user declined." };
}
