function createDraftToolForTurn(host, turn, review, recordDelivery) {
  if (!host.gates.draftExternalMessage()) return null;
  if (host.isSubagentRunner) return null;
  const mcp = host.mcp;
  return createDraftExternalMessageTool({
    recordDelivery,
    onDraftMessage: (emission, timestampMs2) => {
      host.emitUpdate(
        {
          type: "send-message",
          message: emission.message,
          timestampMs: timestampMs2,
          draftRoute: emission.route,
          draftRouteVerified: emission.verification,
          ...turn.ackToken != null ? { ackToken: turn.ackToken } : {}
        },
        turn.updateObservers
      );
      return host.transport?.lastSentMessageId?.();
    },
    resolveRouteVerification: async (ctx, route, toolCallId) => {
      if (mcp == null) {
        return {
          ok: false,
          // eslint-disable-next-line lingui/no-unlocalized-strings -- model-facing refusal, not UI copy
          reason: "No connectors are available in this session."
        };
      }
      host.assertNoPendingAutoReviewApproval();
      const decision = await reviewSandDraftRouteVerification({
        ctx,
        toolCallId,
        route,
        options: {
          mode: turn.autoReviewModes.mcp,
          agentId: host.getConversationId(),
          resourceAccessor: turn.resourceAccessor,
          stateHandler: review.stateHandler,
          autoReviewController: host.autoReviewController,
          personalInstructions: host.getAutoReviewInstructions?.(),
          userAutoRunInstructions: turn.getAutoReviewUserInstructions(),
          extractConversationContext: review.extractConversationContext
        }
      });
      if (!decision.allowed) {
        return { ok: false, reason: decision.reason };
      }
      const execute = createDraftVerificationExecute(ctx, mcp, host.getConversationId());
      return resolveDraftRouteVerification(async (args) => {
        host.assertNoPendingAutoReviewApproval();
        return execute(args);
      }, route);
    }
  });
}
