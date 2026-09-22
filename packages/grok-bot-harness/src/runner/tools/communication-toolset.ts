/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/communication-toolset.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function maybeAddCommunicationTools(args) {
  const { tools, host, hasParentToolParity } = args;
  if (!host.isSubagentRunner && host.connectedActivity != null && host.connectedActivity.sources.length > 0 && host.gates.connectedActivity()) {
    tools.push(createFetchConnectedActivityTool(host.connectedActivity));
  }
  if (!hasParentToolParity || host.isParentMediatedAutomationSubagent || host.outboundCall == null) {
    return;
  }
  tools.push(
    createPlacePhoneCallTool({
      outboundCall: host.outboundCall,
      reviewCall: async ({ target, signal }) => {
        host.assertNoPendingAutoReviewApproval();
        return reviewSandOutboundCall({
          ctx: host.ctx,
          target,
          signal,
          options: {
            agentId: host.getConversationId(),
            autoReviewController: host.autoReviewController,
            getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource())
          }
        });
      }
    })
  );
}

