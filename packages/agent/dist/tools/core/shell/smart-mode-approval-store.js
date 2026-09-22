/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/smart-mode-approval-store.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var SMART_MODE_SHELL_APPROVAL_TTL_SECONDS = 24 * 60 * 60;
var SMART_MODE_SHELL_APPROVAL_TTL_MS = SMART_MODE_SHELL_APPROVAL_TTL_SECONDS * 1e3;
var smartModeShellApprovalRequestRecordSchema = external_exports.object({
  id: external_exports.string(),
  conversationId: external_exports.string(),
  createdAtMs: external_exports.number(),
  fingerprint: external_exports.string(),
  blockReason: external_exports.string()
});
var smartModeShellApprovalStoreResource = createResource(() => {
  throw new Error("Auto-review shell approval store is not configured");
}, () => {
});

