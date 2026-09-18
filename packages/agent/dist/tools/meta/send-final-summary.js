init_zod();
var parametersSchema = external_exports.object({
  final_summary: external_exports.string().trim().min(1).describe("Brief final summary of the work you have performed. When helpful, include illustrative examples of completed work.")
});
