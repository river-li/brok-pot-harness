/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/smart-mode-approval.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto36 = require("node:crypto");
var SMART_MODE_APPROVAL_MISSING_CONVERSATION_REASON = "Auto-review shell approvals require a conversation id";
function policyFingerprint(policy) {
  if (policy === void 0) {
    return null;
  }
  return policy.toJson({ emitDefaultValues: true });
}
function computeSmartModeShellApprovalTargetFingerprint(target) {
  return (0, import_node_crypto36.createHash)("sha256").update(JSON.stringify({
    surface: target.surface,
    command: target.command,
    workingDirectory: target.workingDirectory ?? null,
    requestedSandboxPolicy: policyFingerprint(target.requestedSandboxPolicy),
    isBackground: target.isBackground,
    isReadonly: target.isReadonly,
    executionPlan: target.executionPlan
  })).digest("hex");
}
async function createSmartModeShellApprovalRequest(ctx, store, target) {
  const conversationId = getConversationId(ctx);
  if (conversationId === void 0) {
    throw new Error(SMART_MODE_APPROVAL_MISSING_CONVERSATION_REASON);
  }
  const fingerprint = computeSmartModeShellApprovalTargetFingerprint(target);
  const request5 = {
    id: (0, import_node_crypto36.randomUUID)(),
    conversationId,
    createdAtMs: Date.now(),
    fingerprint,
    blockReason: target.blockReason
  };
  await store.createPendingRequest(ctx, request5);
  return {
    requestId: request5.id,
    fingerprint,
    conversationId,
    blockReason: target.blockReason
  };
}

