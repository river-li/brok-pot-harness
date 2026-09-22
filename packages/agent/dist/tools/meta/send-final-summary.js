/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/meta/send-final-summary.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var parametersSchema = external_exports.object({
  final_summary: external_exports.string().trim().min(1).describe("Brief final summary of the work you have performed. When helpful, include illustrative examples of completed work.")
});

