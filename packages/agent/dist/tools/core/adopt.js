/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/adopt.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

