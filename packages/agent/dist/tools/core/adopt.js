init_adopt_tool_pb();
init_zod();
var adoptParametersSchema = external_exports.object({
  source_agent_id: external_exports.string().min(1).describe("ID of the existing agent to adopt into this Project.")
}).strict();
var ADOPT_OUTCOME_LABELS = {
  [AdoptOutcome.UNSPECIFIED]: "unspecified",
  [AdoptOutcome.ALREADY_PARENTED]: "already-parented",
  [AdoptOutcome.EDGE_ONLY]: "edge-only",
  [AdoptOutcome.STORE_IMPORT_COMPLETED]: "Store-import-completed"
};
