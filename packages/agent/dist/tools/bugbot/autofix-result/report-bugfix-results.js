/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/bugbot/autofix-result/report-bugfix-results.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var reportBugfixResultsSchemaTowardsModel = external_exports.object({
  results: external_exports.array(external_exports.object({
    bug_id: external_exports.string().describe("The bug ID as provided in the bug list"),
    bug_title: external_exports.string().describe("The exact bug title as provided in the bug list"),
    verdict: external_exports.enum(["fixed", "false_positive", "could_not_fix", "resolved_by_other_fix"]).describe("The verdict for this bug"),
    explanation: external_exports.string().describe("A single concise sentence explaining the resolution or why it wasn't resolved"),
    severity: external_exports.enum(["high", "medium", "low"]).optional().describe("The severity of the bug as provided in the bug list (high, medium, or low)")
  })).describe("Results for each bug, in the same order as in the bug list")
});
var reportBugfixResultsSchemaForParsing = external_exports.object({
  results: external_exports.array(bugfixResultItemSchema)
});

