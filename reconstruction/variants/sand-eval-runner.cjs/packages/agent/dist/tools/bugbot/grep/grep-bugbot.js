/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/bugbot/grep/grep-bugbot.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
init_zod();
var logger76 = createLogger("tools/grep-bugbot");
var parametersSchema3 = external_exports.object({
  pattern: external_exports.string().describe("The regular expression pattern to search for in file contents"),
  path: external_exports.string().optional().describe("File or directory to search in. Defaults to repository root.")
});

