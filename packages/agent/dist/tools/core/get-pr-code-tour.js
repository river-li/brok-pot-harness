/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/get-pr-code-tour.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
var parametersSchema18 = external_exports.object({
  revisionId: external_exports.string().optional().describe("Revision id from <pr_code_tour_context> or a previous GetPrCodeTour call. Omit to list all revisions for the active PR.")
});

