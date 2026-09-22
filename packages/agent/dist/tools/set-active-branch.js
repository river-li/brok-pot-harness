/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/set-active-branch.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var parametersSchema28 = external_exports.object({
  path: external_exports.string().describe("Absolute repository path for this branch update."),
  branchName: external_exports.string().describe("New active branch name.")
});

