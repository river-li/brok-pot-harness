/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/async-task-fallbacks.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

