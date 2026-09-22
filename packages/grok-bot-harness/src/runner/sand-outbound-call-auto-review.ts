/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-outbound-call-auto-review.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_OUTBOUND_CALL_UNAVAILABLE_REASON = "Placing a live phone call needs your approval, which is not available in this conversation.";
var SAND_OUTBOUND_CALL_CANCELLED_REASON = "The phone call was cancelled before it was placed.";
async function reviewSandOutboundCall(args) {
  if (args.signal?.aborted === true) {
    return { allowed: false, reason: SAND_OUTBOUND_CALL_CANCELLED_REASON };
  }
  const controller = args.options.autoReviewController;
  if (controller === void 0) {
    return { allowed: false, reason: SAND_OUTBOUND_CALL_UNAVAILABLE_REASON };
  }
  const { to: to3, instructions } = args.target;
  const approval = await withToolExecutionTimeoutSuspended(
    args.ctx,
    () => controller.requestApproval({
      agentId: args.options.agentId,
      surface: "mcp",
      fingerprint: fingerprintSandAutoReviewTarget({ to: to3, instructions }),
      reason: `This places a live phone call to ${to3} and speaks this script to whoever answers, and it cannot be recalled once you approve:

${instructions}`,
      summary: summarizeSandMcpAutoReviewAction({
        serverDisplayName: "Agent telephony",
        toolName: SAND_PLACE_PHONE_CALL_TOOL_NAME,
        mcpArguments: { to: to3, session: { instructions } }
      }),
      command: `Call ${to3}`,
      signal: args.signal,
      expiryPolicy: args.options.getApprovalExpiryPolicy?.()
    })
  );
  return approval.approved ? { allowed: true } : { allowed: false, reason: approval.reason ?? "The user declined." };
}

