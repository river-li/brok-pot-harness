/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/edit/plan-mode-file-policy.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MARKDOWN_SUFFIXES = [".md", ".markdown", ".mdown", ".mkd", ".mkdn", ".mdx"];
var MANAGED_CANVAS_REGEX2 = /(?:^|\/)\.cursor\/projects\/[^/]+\/canvases\/[^/]+\.canvas\.tsx$/i;
function isMarkdownEditPath(path30) {
  const normalizedPath = path30.trim().toLowerCase();
  return MARKDOWN_SUFFIXES.some((suffix) => normalizedPath.endsWith(suffix));
}
function isManagedCanvasEditPath(path30) {
  return MANAGED_CANVAS_REGEX2.test(path30.trim().replace(/\\/g, "/"));
}
function isPlanModeAllowedEditPath(path30) {
  return isMarkdownEditPath(path30) || isManagedCanvasEditPath(path30);
}

