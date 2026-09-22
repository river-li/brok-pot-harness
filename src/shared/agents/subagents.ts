/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/subagents.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_SUBAGENT_ID_PREFIX = "sand-subagent-";
function isSandSubagentId(id) {
  return id.startsWith(SAND_SUBAGENT_ID_PREFIX);
}
var SAND_ASYNC_TASK_KINDS = ["cloud-agent", "subagent", "shell"];

