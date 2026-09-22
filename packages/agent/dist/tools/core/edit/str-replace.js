/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/edit/str-replace.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var strReplaceTotalCounter = createCounter("agent.tools.str_replace.total", {
  description: "Total str-replace operations",
  labelNames: []
});
var strReplaceSuccessCounter = createCounter("agent.tools.str_replace.success", {
  description: "Successful str-replace operations",
  labelNames: []
});
var strReplaceErrorCounter = createCounter("agent.tools.str_replace.error", {
  description: "Failed str-replace operations",
  labelNames: ["error_type"]
});
var strReplaceLatencyHistogram = createHistogram("agent.tools.str_replace.latency_ms", {
  description: "Latency of str-replace operations in milliseconds",
  labelNames: []
});
var strReplaceWhitespaceInsensitiveCounter = createCounter("agent.tools.str_replace.whitespace_insensitive", {
  description: "Number of times whitespace-insensitive fallback was used",
  labelNames: []
});
var strReplaceLinesModifiedHistogram = createHistogram("agent.tools.str_replace.lines_modified", {
  description: "Number of lines modified in str-replace operations",
  labelNames: []
});
var parametersSchema13 = external_exports.object({
  path: external_exports.string().describe("The absolute path to the file to modify"),
  old_string: external_exports.string().describe("The text to replace"),
  new_string: external_exports.string().describe("The text to replace it with (must be different from old_string)"),
  replace_all: external_exports.boolean().optional().describe("Replace all occurrences of old_string (default false)")
});
var parametersSchema1018 = external_exports.object({
  file_path: external_exports.string().describe("The path to the file to modify. Always specify the target file as the first argument. You can use either a relative path in the workspace or an absolute path."),
  old_string: external_exports.string().describe("The text to replace"),
  new_string: external_exports.string().describe("The text to replace it with (must be different from old_string)"),
  replace_all: external_exports.boolean().optional().describe("Replace all occurences of old_string (default false)").default(false)
});

