/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/scm/connect-scm.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var parametersSchema27 = external_exports.object({
  github_repo: external_exports.string().regex(/^[^\s/]+\/[^\s/]+$/, "Expected repository in 'owner/name' form").optional().describe("Optional repository in 'owner/name' form that the user wants connected. Provide it when the user named a specific repo so the connect flow can also prompt to install the app there.")
});

