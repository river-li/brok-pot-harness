init_zod();
function emptyStringToUndefined(value) {
  return typeof value === "string" && value.trim() === "" ? void 0 : value;
}
var optionalNonEmptyTrimmedStringSchema = external_exports.preprocess(emptyStringToUndefined, external_exports.string().trim().min(1).optional());
var requiredNonEmptyTrimmedStringSchema = external_exports.preprocess(emptyStringToUndefined, external_exports.string().trim().min(1));
var currentStepParameterSchema = optionalNonEmptyTrimmedStringSchema.describe("Major step or phase you are on. Update when the subtask changes. Keep the text concise, high-level, and user-friendly.");
var communicateUpdateObjectSchema = external_exports.object({
  current_step: currentStepParameterSchema
});
var requiredCommunicateUpdateObjectSchema = external_exports.object({
  current_step: requiredNonEmptyTrimmedStringSchema.describe("Major step or phase you are on. Update when the subtask changes. Keep the text concise, high-level, and user-friendly.")
});
var finalSummaryParameterSchema = optionalNonEmptyTrimmedStringSchema.describe("User-facing executive summary succinctly reporting on your work / responding to the user's message; write this as a concise message speaking back to the user, not as a status tag. Typically 1-3 sentences, or a brief lead-in plus bullet points when there are multiple distinct takeaways, decisions, test results, etc. When using bullets, make them pleasant and easy to scan: 2-5 bullets when possible, one useful idea per bullet, ordered by importance to the user, concise but not cryptic, and no nested bullets unless the user requested detail. Use prose instead of bullets when there is only one main takeaway. Include the most relevant takeaways for the user, as implied by the user's original request. No unnecessary details. When answering questions by the user, include the full answer that the user is seeking. Examples of what to include: full answer(s) to user's question(s), high-level root cause while debugging, status update of completed (or in-progress) work, test results for specifically requested testing, blocking questions the user must answer before you can continue, links to newly created PRs, etc. Examples of what NOT to include (unless implicitly or explicitly requested by the user): tool calls / results, code / log / shell command excerpts, long file paths, line numbers, low-level implementation details, etc. Set this field just ONCE per turn, as the last thing you do before your final response, at the same time that you set the completed_subtitle field.");
var completedSubtitleParameterSchema = optionalNonEmptyTrimmedStringSchema.describe("4-6 word, past-tense, final summary of the work you have completed. Will be used as your agent subtitle in the UI. Keep the text concise, high-level, and user-friendly. Set this field ONCE per turn, as the last thing you do before your final response, at the same time that you set the final_summary field.");
