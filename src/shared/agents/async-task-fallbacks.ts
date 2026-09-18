function asyncTaskFallbackLabel(kind, id) {
  switch (kind) {
    case "subagent":
      return {
        text: "Background task",
        labelKind: "background_task",
        labelParams: { id }
      };
    case "shell":
      return {
        text: `Background command ${id}`,
        labelKind: "background_command",
        labelParams: { id }
      };
    case "cloud-agent":
      return {
        text: `Cloud agent ${id}`,
        labelKind: "cloud_agent",
        labelParams: { id }
      };
  }
}
var ASYNC_TASK_REATTACHED_DETAIL = "reattached after a host restart";
var ASYNC_TASK_DURABLE_LEDGER_DETAIL = "from the durable pending-wake ledger";
