/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/utils/read-block-handler.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
async function resolveFileReadBlock(blockReason, options2) {
  const resolution = await handleBlockReason(blockReason, {
    onNeedsApproval: async (approvalReason, approvalDetails) => {
      const requestReadApproval = options2.pendingDecisionProvider?.requestReadApproval?.bind(options2.pendingDecisionProvider);
      if (approvalDetails.type !== "fileRead" || !requestReadApproval) {
        return {
          kind: "denied",
          message: "Blocked by permissions configuration"
        };
      }
      const result = await requestReadApproval({
        type: OperationType.Read,
        details: {
          path: approvalDetails.path,
          reason: approvalReason
        },
        toolCallId: options2.toolCallId
      });
      if (!result.approved) {
        return { kind: "rejected", reason: result.reason };
      }
      return null;
    },
    onUserRejected: (reason) => ({ kind: "rejected", reason }),
    onPermissionDenied: (message) => ({ kind: "denied", message })
  });
  return resolution ?? { kind: "proceed" };
}

