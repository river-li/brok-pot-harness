/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/codebase-telemetry/dist/types.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CodebaseKind = {
  UNSPECIFIED: 0,
  WORKSPACE_ROOT: 10,
  HOME_DIRECTORY: 11,
  DOT_CURSOR: 6,
  DOT_CLAUDE: 7,
  DOT_CODEX: 8,
  DOT_AGENTS: 9,
  GIT_MAIN_WORKTREE_ROOT: 1,
  GIT_LINKED_WORKTREE_ROOT: 3,
  PLAIN_DIRECTORY: 5
};
var CODEBASE_KINDS = new Set(Object.values(CodebaseKind));
function isCodebaseKind(kind) {
  return CODEBASE_KINDS.has(kind);
}
var CodebaseEnvironment = {
  USER_MACHINE: 1,
  CURSOR_CLOUD: 2,
  SAND_BOX: 3
};
var CODEBASE_ENVIRONMENTS = new Set(Object.values(CodebaseEnvironment));
function isCodebaseEnvironment(environment) {
  return CODEBASE_ENVIRONMENTS.has(environment);
}

