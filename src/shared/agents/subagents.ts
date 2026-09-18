var SAND_SUBAGENT_ID_PREFIX = "sand-subagent-";
function isSandSubagentId(id) {
  return id.startsWith(SAND_SUBAGENT_ID_PREFIX);
}
var SAND_ASYNC_TASK_KINDS = ["cloud-agent", "subagent", "shell"];
