/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/delete.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var parametersSchemaLatest = external_exports.object({
  path: external_exports.string().describe("The absolute path of the file to delete")
});
var parametersSchemaDsv3 = external_exports.object({
  target_file: external_exports.string().describe("The path of the file to delete, relative to the workspace root."),
  explanation: external_exports.string().optional().describe("One sentence explanation as to why this tool is being used, and how it contributes to the goal.")
});

