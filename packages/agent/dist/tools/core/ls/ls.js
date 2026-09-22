/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/ls/ls.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var parametersSchema20 = external_exports.object({
  target_directory: external_exports.string().describe("Path to directory to list contents of."),
  ignore_globs: external_exports.array(external_exports.string()).optional().describe(`Optional array of glob patterns to ignore.
All patterns match anywhere in the target directory. Patterns not starting with "**/" are automatically prepended with "**/".

Examples:
	- "*.js" (becomes "**/*.js") - ignore all .js files
	- "**/node_modules/**" - ignore all node_modules directories
	- "**/test/**/test_*.ts" - ignore all test_*.ts files in any test directory`)
});

