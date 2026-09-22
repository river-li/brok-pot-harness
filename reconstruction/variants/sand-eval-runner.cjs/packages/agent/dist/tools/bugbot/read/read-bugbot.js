/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/bugbot/read/read-bugbot.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
init_zod();
var logger77 = createLogger("tools/read-bugbot");
var parametersSchema5 = external_exports.object({
  path: external_exports.string().describe("The repository-relative path of the file to read (as shown in the diff)."),
  offset: external_exports.number().optional().describe("The 1-indexed line number to start reading from. Only provide if the file is too large to read at once."),
  limit: external_exports.number().optional().describe("The number of lines to read. Only provide if the file is too large to read at once.")
});

