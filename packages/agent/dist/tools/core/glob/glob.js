init_zod();
var globEmptyPatternFallback = createCounter("glob.empty_pattern_fallback", {
  description: "Glob retries after an executor rejected the empty-pattern invocation shape",
  labelNames: ["outcome"]
});
var parametersSchemaLatest2 = external_exports.object({
  target_directory: external_exports.string().optional().describe("Absolute path to directory to search for files in. If not provided, defaults to Cursor workspace root."),
  glob_pattern: external_exports.string().describe(`The glob pattern to match files against.
Patterns not starting with "**/" are automatically prepended with "**/" to enable recursive searching.

Examples:
	- "*.js" (becomes "**/*.js") - find all .js files
	- "**/node_modules/**" - find all node_modules directories
	- "**/test/**/test_*.ts" - find all test_*.ts files in any test directory`)
});
var parametersSchemaDsv32 = external_exports.object({
  target_directory: external_exports.string().optional().describe("Path to directory to search for files in. If not provided, defaults to Cursor workspace roots."),
  glob_pattern: external_exports.string().describe(`The glob pattern to match files against.
Patterns not starting with "**/" are automatically prepended with "**/" to enable recursive searching.

Examples:
	- "*.js" (becomes "**/*.js") - find all .js files
	- "**/node_modules/**" - find all node_modules directories
	- "**/test/**/test_*.ts" - find all test_*.ts files in any test directory
`)
});
