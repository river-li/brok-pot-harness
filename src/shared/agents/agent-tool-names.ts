/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/agent-tool-names.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_BOX_SHELL_TOOL_NAME = "Shell";
var SAND_BOX_READ_TOOL_NAME = "Read";
var SAND_BOX_AWAIT_SHELL_TOOL_NAME = "AwaitShell";
var SAND_MACHINE_SHELL_ACTIVITY_NAME = "MachineShell";
var SAND_COPY_TO_BOX_TOOL_NAME = "CopyToBox";
var SAND_COPY_FROM_BOX_TOOL_NAME = "CopyFromBox";
var SAND_LIST_MACHINES_TOOL_NAME = "ListMachines";
function sandDualSurfaceToolTelemetry(toolName, targetsUserComputer = false) {
  switch (toolName) {
    case SAND_BOX_SHELL_TOOL_NAME:
    case SAND_BOX_READ_TOOL_NAME:
    case SAND_BOX_AWAIT_SHELL_TOOL_NAME:
      return { toolName, surface: targetsUserComputer ? "external" : "box" };
    default:
      return void 0;
  }
}

