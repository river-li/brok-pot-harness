init_zod();
var SMART_MODE_MCP_APPROVAL_TTL_SECONDS = 24 * 60 * 60;
var SMART_MODE_MCP_APPROVAL_TTL_MS = SMART_MODE_MCP_APPROVAL_TTL_SECONDS * 1e3;
var smartModeMcpApprovalRequestRecordSchema = external_exports.object({
  id: external_exports.string(),
  conversationId: external_exports.string(),
  createdAtMs: external_exports.number(),
  fingerprint: external_exports.string(),
  blockReason: external_exports.string()
});
var smartModeMcpApprovalStoreResource = createResource(() => {
  throw new Error("Auto-review MCP approval store is not configured");
}, () => {
});
