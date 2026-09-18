var ENABLED = true;
var WORKTRIES_REGEX = /(^\/(?:Users|home)\/[^/]+\/\.cursor\/)worktries(?=\/|$)/g;
function maybeRedirectWorktriesPath(originalPath) {
  if (!ENABLED) {
    return originalPath;
  }
  return originalPath.replace(WORKTRIES_REGEX, "$1worktrees");
}
