/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/pi/pi-tools.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var editReplacementSchema = external_exports.object({
  oldText: external_exports.string().describe("Exact text for one targeted replacement. It must be unique in the original file and must not overlap with any other edits[].oldText in the same call."),
  newText: external_exports.string().describe("Replacement text for this targeted edit.")
});
var readSchema = external_exports.object({
  path: external_exports.string().describe("Path to the file to read (relative or absolute)"),
  offset: external_exports.number().optional().describe("Line number to start reading from (1-indexed)"),
  limit: external_exports.number().optional().describe("Maximum number of lines to read")
});
var bashSchema = external_exports.object({
  command: external_exports.string().describe("Bash command to execute"),
  timeout: external_exports.number().optional().describe("Timeout in seconds (optional, no default timeout)")
});
var editSchema = external_exports.object({
  path: external_exports.string().describe("Path to the file to edit (relative or absolute)"),
  edits: external_exports.array(editReplacementSchema).describe("One or more targeted replacements.")
});
var writeSchema = external_exports.object({
  path: external_exports.string().describe("Path to the file to write (relative or absolute)"),
  content: external_exports.string().describe("Content to write to the file")
});
var grepSchema = external_exports.object({
  pattern: external_exports.string().describe("Search pattern (regex or literal string)"),
  path: external_exports.string().optional().describe("Directory or file to search (default: current directory)"),
  glob: external_exports.string().optional().describe("Filter files by glob pattern, e.g. '*.ts' or '**/*.spec.ts'"),
  ignoreCase: external_exports.boolean().optional().describe("Case-insensitive search (default: false)"),
  literal: external_exports.boolean().optional().describe("Treat pattern as literal string instead of regex (default: false)"),
  context: external_exports.number().optional().describe("Number of lines to show before and after each match (default: 0)"),
  limit: external_exports.number().optional().describe("Maximum number of matches to return (default: 100)")
});
var findSchema = external_exports.object({
  pattern: external_exports.string().describe("Glob pattern to match files, e.g. '*.ts', '**/*.json', or 'src/**/*.spec.ts'"),
  path: external_exports.string().optional().describe("Directory to search in (default: current directory)"),
  limit: external_exports.number().optional().describe("Maximum number of results (default: 1000)")
});
var lsSchema = external_exports.object({
  path: external_exports.string().optional().describe("Directory to list (default: current directory)"),
  limit: external_exports.number().optional().describe("Maximum number of entries to return (default: 500)")
});

