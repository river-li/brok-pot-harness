function emailTurnTools(host, review) {
  const email3 = host.email;
  if (email3 == null) return [];
  const getApprovalExpiryPolicy = () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource());
  const tools = [];
  if (!host.isParentMediatedAutomationSubagent) {
    tools.push(
      createSendEmailTool({
        email: email3,
        ...host.getAgentDirImpl === void 0 ? {} : { getAgentDir: host.getAgentDirImpl },
        ...review.mode === "off" ? {} : {
          reviewSend: async ({ toolCallId, target, signal }) => {
            host.assertNoPendingAutoReviewApproval();
            return reviewSandEmailSend({
              ctx: host.ctx,
              toolCallId,
              ...signal !== void 0 ? { signal } : {},
              target,
              options: {
                mode: review.mode,
                agentId: host.getConversationId(),
                resourceAccessor: review.resourceAccessor,
                stateHandler: review.stateHandler,
                autoReviewController: host.autoReviewController,
                getApprovalExpiryPolicy,
                personalInstructions: host.getAutoReviewInstructions?.(),
                userAutoRunInstructions: review.getUserInstructions(),
                extractConversationContext: review.extractConversationContext
              }
            });
          }
        }
      })
    );
  }
  tools.push(
    createClaimEmailInboxTool({
      email: email3,
      reviewClaim: async ({ target, signal }) => {
        host.assertNoPendingAutoReviewApproval();
        return reviewSandEmailClaim({
          ctx: host.ctx,
          target,
          ...signal !== void 0 ? { signal } : {},
          options: {
            agentId: host.getConversationId(),
            autoReviewController: host.autoReviewController,
            getApprovalExpiryPolicy
          }
        });
      }
    }),
    createListEmailInboxesTool({ email: email3 }),
    createSearchEmailThreadsTool({ email: email3 }),
    createReadEmailThreadTool({ email: email3 }),
    createReadEmailAttachmentTool({
      email: email3,
      getPersistMediaBytes: () => host.persistMediaBytes
    })
  );
  return tools;
}
