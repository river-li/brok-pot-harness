init_zod();
var findingSchema = external_exports.object({
  checkName: external_exports.string().min(1),
  detailsUrl: external_exports.string().optional(),
  tldr: external_exports.string().min(1),
  rootCause: external_exports.string().optional(),
  failingSignal: external_exports.string().optional(),
  suggestedNextStep: external_exports.string().optional(),
  diffRelation: external_exports.enum(["related", "unrelated", "unknown"]).optional(),
  diffRelationEvidence: external_exports.string().optional(),
  flakeAssessment: external_exports.enum(["likely", "unlikely", "unknown"]).optional(),
  flakeEvidence: external_exports.string().optional(),
  rerunAvailable: external_exports.boolean().optional(),
  rerunEvidence: external_exports.string().optional(),
  recommendedAction: external_exports.enum(["fix", "rerun", "wait", "ignore", "ask", "investigate"]).optional(),
  recommendedActionEvidence: external_exports.string().optional(),
  confidence: external_exports.enum(["high", "medium", "low"]).optional()
});
var overallSchema = external_exports.object({
  summary: external_exports.string().min(1),
  themes: external_exports.array(external_exports.string()).optional(),
  recommendedAction: external_exports.enum(["fix", "rerun", "wait", "ignore", "ask", "investigate"]).optional(),
  recommendedActionEvidence: external_exports.string().optional(),
  checkKeys: external_exports.array(external_exports.string()).optional()
});
var parametersSchema23 = external_exports.object({
  findings: external_exports.array(findingSchema).min(1).describe("One entry per failing CI check investigated. checkName and detailsUrl must match the check identity from the prompt verbatim."),
  overall: overallSchema.optional().describe("Optional cross-check summary when multiple checks were investigated in one turn.")
});
