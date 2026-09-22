/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/mcp/fetch-mcp-resource.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var baseParametersSchema2 = external_exports.object({
  server: external_exports.string(),
  uri: external_exports.string(),
  downloadPath: external_exports.string().optional()
});
var smartModeApprovalParametersSchema2 = external_exports.object({
  requestSmartModeApproval: external_exports.boolean().optional().describe("Set to true when immediately retrying the exact same resource fetch after Auto-review blocks it and you decide the user should approve it through the native approval card."),
  smartModeBlockReason: external_exports.string().optional().describe("Provide the exact block reason returned by Auto-review in the prior rejection. Required when requestSmartModeApproval is true so the approval card shows the original classifier reason without re-running the classifier.")
});

