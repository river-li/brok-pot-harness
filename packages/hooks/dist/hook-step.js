/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/hook-step.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var HookStep = {
  beforeShellExecution: "beforeShellExecution",
  beforeMCPExecution: "beforeMCPExecution",
  afterShellExecution: "afterShellExecution",
  afterMCPExecution: "afterMCPExecution",
  beforeReadFile: "beforeReadFile",
  afterFileEdit: "afterFileEdit",
  beforeTabFileRead: "beforeTabFileRead",
  afterTabFileEdit: "afterTabFileEdit",
  stop: "stop",
  beforeSubmitPrompt: "beforeSubmitPrompt",
  afterAgentResponse: "afterAgentResponse",
  afterAgentThought: "afterAgentThought",
  sessionStart: "sessionStart",
  sessionEnd: "sessionEnd",
  preCompact: "preCompact",
  subagentStart: "subagentStart",
  subagentStop: "subagentStop",
  // Generic tool hooks - fire for all tool types
  preToolUse: "preToolUse",
  postToolUse: "postToolUse",
  postToolUseFailure: "postToolUseFailure",
  // Workspace lifecycle hooks - fire on workspace open/load events.
  // Unlike most other steps these are not tied to an agent session.
  workspaceOpen: "workspaceOpen"
};

