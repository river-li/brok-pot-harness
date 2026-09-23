function maybeAddCommunicationTools(args) {
  const { tools, host, hasParentToolParity } = args;
  if (!host.isSubagentRunner && host.connectedActivity != null && host.connectedActivity.sources.length > 0 && host.gates.connectedActivity({ logExposure: true })) {
    tools.push(createFetchConnectedActivityTool(host.connectedActivity));
  }
  const outboundCall = host.outboundCall;
  if (!hasParentToolParity || host.isParentMediatedAutomationSubagent || outboundCall == null) {
    return;
  }
  tools.push(
    createPlacePhoneCallTool({
      outboundCall,
      reviewCall: async ({ toolCallId, target, signal }) => {
        host.assertNoPendingAutoReviewApproval();
        return reviewSandOutboundCall({
          ctx: host.ctx,
          toolCallId,
          target,
          signal,
          options: {
            agentId: host.getConversationId(),
            fixtureNotice: outboundCall.fixtureNotice,
            autoReviewController: host.autoReviewController,
            toolDecisions: host.toolDecisionAudit,
            getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource())
          }
        });
      }
    })
  );
}
