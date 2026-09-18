var import_node_crypto27 = require("node:crypto");
var SMART_MODE_MCP_APPROVAL_MISSING_CONVERSATION_REASON = "Auto-review MCP approvals require a conversation id";
function normalizeForFingerprint(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeForFingerprint);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).filter(([, entryValue]) => entryValue !== void 0).sort(([left], [right]) => left.localeCompare(right)).map(([key, entryValue]) => [key, normalizeForFingerprint(entryValue)]));
  }
  return value;
}
function computeSmartModeMcpApprovalTargetFingerprint(target) {
  return (0, import_node_crypto27.createHash)("sha256").update(JSON.stringify({
    serverIdentifier: target.serverIdentifier,
    serverName: target.serverName ?? null,
    serverDisplayName: target.serverDisplayName,
    toolName: target.toolName,
    mcpMode: target.mcpMode,
    mcpArguments: normalizeForFingerprint(target.mcpArguments ?? {}),
    toolDefinitionIdentity: target.toolDefinitionIdentity ?? null,
    toolDefinitionHash: target.toolDefinitionHash ?? null
  })).digest("hex");
}
async function createSmartModeMcpApprovalRequest(ctx, store, target) {
  const conversationId = getConversationId(ctx);
  if (conversationId === void 0) {
    throw new Error(SMART_MODE_MCP_APPROVAL_MISSING_CONVERSATION_REASON);
  }
  const fingerprint = computeSmartModeMcpApprovalTargetFingerprint(target);
  const request3 = {
    id: (0, import_node_crypto27.randomUUID)(),
    conversationId,
    createdAtMs: Date.now(),
    fingerprint,
    blockReason: target.blockReason
  };
  await store.createPendingRequest(ctx, request3);
  return {
    requestId: request3.id,
    fingerprint,
    conversationId,
    blockReason: target.blockReason
  };
}
async function cancelSmartModeMcpApprovalRequest(ctx, store, requestId2) {
  await store.deletePendingRequest(ctx, requestId2);
}
