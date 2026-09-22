/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/claude-code-types.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CLAUDE_EVENT_TO_CURSOR_STEP = {
  PreToolUse: HookStep.preToolUse,
  PermissionRequest: null,
  PostToolUse: HookStep.postToolUse,
  UserPromptSubmit: HookStep.beforeSubmitPrompt,
  Stop: HookStep.stop,
  SubagentStop: HookStep.subagentStop,
  SessionStart: HookStep.sessionStart,
  SessionEnd: HookStep.sessionEnd,
  PreCompact: HookStep.preCompact,
  Notification: null
};
var CURSOR_STEP_TO_CLAUDE_EVENT = Object.fromEntries(Object.entries(CLAUDE_EVENT_TO_CURSOR_STEP).filter((entry) => entry[1] !== null).map(([event, step]) => [step, event]));
var CLAUDE_TOOL_TO_CURSOR_TOOL = {
  Bash: "Shell",
  Read: "Read",
  Write: "Write",
  Edit: "Write",
  // Edit maps to Write
  Glob: null,
  // Not exposed in CLI
  Grep: "Grep",
  WebFetch: "WebFetch",
  WebSearch: "WebSearch",
  Task: "Task"
  // preToolUse/postToolUse supported
};
var UNSUPPORTED_CLAUDE_TOOLS = ["Glob"];
var UNSUPPORTED_CLAUDE_EVENTS = [
  "Notification",
  "PermissionRequest"
];

