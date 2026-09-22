/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/claude-code-types.js
 * Bundle: sand-host/sand-eval-runner.cjs
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

