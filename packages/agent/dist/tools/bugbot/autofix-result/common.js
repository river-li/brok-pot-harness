/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/bugbot/autofix-result/common.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var bugfixVerdictSchema = external_exports.enum(["fixed", "false_positive", "could_not_fix", "resolved_by_other_fix"]);
var bugfixSeveritySchema = external_exports.enum([
  "high",
  "medium",
  "low"
]);
var bugfixResultItemSchema = external_exports.object({
  bug_id: external_exports.string(),
  bug_title: external_exports.string(),
  verdict: bugfixVerdictSchema,
  explanation: external_exports.string(),
  severity: bugfixSeveritySchema.optional()
});

