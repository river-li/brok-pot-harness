/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/edit/write.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
var parametersSchema14 = external_exports.object({
  path: external_exports.string().describe("The absolute path to the file to modify"),
  contents: external_exports.string().describe("The contents to write to the file")
});
var parametersSchema08192 = external_exports.object({
  file_path: external_exports.string().describe("The path to the file to modify. Always specify the target file as the first argument. You can use either a relative path in the workspace or an absolute path."),
  contents: external_exports.string().describe("The contents of the file to write")
});

