init_zod();
var bugfixVerdictSchema = external_exports.enum([
  "fixed",
  "false_positive",
  "could_not_fix",
  "resolved_by_other_fix"
]);
var bugfixSeveritySchema = external_exports.enum(["high", "medium", "low"]);
var bugfixResultItemSchema = external_exports.object({
  bug_id: external_exports.string(),
  bug_title: external_exports.string(),
  verdict: bugfixVerdictSchema,
  explanation: external_exports.string(),
  severity: bugfixSeveritySchema.optional()
});
