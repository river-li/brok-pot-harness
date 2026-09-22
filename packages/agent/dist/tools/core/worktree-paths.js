/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/worktree-paths.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ENABLED = true;
var WORKTRIES_REGEX = /(^\/(?:Users|home)\/[^/]+\/\.cursor\/)worktries(?=\/|$)/g;
function maybeRedirectWorktriesPath(originalPath) {
  if (!ENABLED) {
    return originalPath;
  }
  return originalPath.replace(WORKTRIES_REGEX, "$1worktrees");
}

