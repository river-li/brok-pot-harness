/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/email-turn-tools.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function emailTurnTools(host, review) {
  const email3 = host.email;
  if (email3 == null) return [];
  const refusing = email3.unavailableReason !== void 0;
  const getApprovalExpiryPolicy = () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource());
  const tools = [];
  if (!host.isParentMediatedAutomationSubagent) {
    tools.push(
      createSendEmailTool({
        email: email3,
        ...host.getAgentDirImpl === void 0 ? {} : { getAgentDir: host.getAgentDirImpl },
        ...refusing || review.mode === "off" ? {} : {
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
                provenance: {
                  requestSource: host.activeTurnRequestSource(),
                  wakeEmbedsExternalEvent: host.activeTurnAutomationWakeEmbedsExternalEvent(),
                  wakeEmail: host.activeTurnAutomationWakeEmail()
                },
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
      multipleInboxesEnabled: host.gates.agentEmailMultipleInboxes(),
      ...refusing ? {} : {
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

