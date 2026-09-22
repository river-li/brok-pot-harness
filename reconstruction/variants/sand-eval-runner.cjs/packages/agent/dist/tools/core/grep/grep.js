/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/grep/grep.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
init_zod();
var logger84 = createLogger("tools/grep");
function coerceBooleanLike(val) {
  if (typeof val === "string") {
    const lower = val.toLowerCase();
    if (lower === "true")
      return true;
    if (lower === "false")
      return false;
  }
  return val;
}
var parametersSchema19 = external_exports.object({
  pattern: external_exports.string().describe("The regular expression pattern to search for in file contents"),
  path: external_exports.string().optional().describe("File or directory to search in (rg pattern -- PATH). Defaults to Cursor workspace root."),
  glob: external_exports.string().optional().describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob'),
  output_mode: external_exports.enum(["content", "files_with_matches", "count"]).describe('Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), "files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). Defaults to "content".').default("content").optional(),
  "-B": lenientNumber().optional().describe('Number of lines to show before each match (rg -B). Requires output_mode: "content", ignored otherwise.'),
  "-A": lenientNumber().optional().describe('Number of lines to show after each match (rg -A). Requires output_mode: "content", ignored otherwise.'),
  "-C": lenientNumber().optional().describe('Number of lines to show before and after each match (rg -C). Requires output_mode: "content", ignored otherwise.'),
  "-i": external_exports.preprocess(coerceBooleanLike, external_exports.boolean().optional().describe("Case insensitive search (rg -i) Defaults to false").default(false)),
  type: external_exports.string().optional().describe("File type to search (rg --type). Common types: js, py, rust, go, java, etc. More efficient than include for standard file types."),
  head_limit: lenientNumber(external_exports.number().min(0)).optional().describe('Limit output size. For "content" mode: limits total matches shown. For "files_with_matches" and "count" modes: limits number of files.'),
  offset: lenientNumber(external_exports.number().min(0)).optional().describe('Skip first N entries. For "content" mode: skips first N matches. For "files_with_matches" and "count" modes: skips first N files. Use with head_limit for pagination.'),
  multiline: external_exports.preprocess(coerceBooleanLike, external_exports.boolean().optional().describe("Enable multiline mode where . matches newlines and patterns can span lines (rg -U --multiline-dotall). Default: false.").default(false))
});
var parametersSchema08193 = external_exports.object({
  pattern: external_exports.string().describe("The regular expression pattern to search for in file contents (rg --regexp)"),
  path: external_exports.string().optional().describe("File or directory to search in (rg pattern -- PATH). Defaults to Cursor workspace roots."),
  glob: external_exports.string().optional().describe('Glob pattern (rg --glob GLOB -- PATH) to filter files (e.g. "*.js", "*.{ts,tsx}").'),
  output_mode: external_exports.enum(["content", "files_with_matches", "count"]).describe('Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), "files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). Defaults to "content".').default("content").optional(),
  "-B": lenientNumber().optional().describe('Number of lines to show before each match (rg -B). Requires output_mode: "content", ignored otherwise.'),
  "-A": lenientNumber().optional().describe('Number of lines to show after each match (rg -A). Requires output_mode: "content", ignored otherwise.'),
  "-C": lenientNumber().optional().describe('Number of lines to show before and after each match (rg -C). Requires output_mode: "content", ignored otherwise.'),
  "-i": external_exports.preprocess(coerceBooleanLike, external_exports.boolean().optional().describe("Case insensitive search (rg -i) Defaults to false").default(false)),
  type: external_exports.string().optional().describe("File type to search (rg --type). Common types: js, py, rust, go, java, etc. More efficient than glob for standard file types."),
  head_limit: lenientNumber(external_exports.number().min(0)).optional().describe('Limit output size. For "content" mode: limits total matches shown. For "files_with_matches" and "count" modes: limits number of files.'),
  offset: lenientNumber(external_exports.number().min(0)).optional().describe('Skip first N entries. For "content" mode: skips first N matches. For "files_with_matches" and "count" modes: skips first N files. Use with head_limit for pagination.'),
  multiline: external_exports.preprocess(coerceBooleanLike, external_exports.boolean().optional().describe("Enable multiline mode where . matches newlines and patterns can span lines (rg -U --multiline-dotall). Default: false.").default(false))
});

