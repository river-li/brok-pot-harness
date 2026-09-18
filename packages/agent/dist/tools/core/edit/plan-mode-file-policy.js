var MARKDOWN_SUFFIXES = [
  ".md",
  ".markdown",
  ".mdown",
  ".mkd",
  ".mkdn",
  ".mdx"
];
var MANAGED_CANVAS_REGEX2 = /(?:^|\/)\.cursor\/projects\/[^/]+\/canvases\/[^/]+\.canvas\.tsx$/i;
function isMarkdownEditPath(path31) {
  const normalizedPath = path31.trim().toLowerCase();
  return MARKDOWN_SUFFIXES.some((suffix) => normalizedPath.endsWith(suffix));
}
function isManagedCanvasEditPath(path31) {
  return MANAGED_CANVAS_REGEX2.test(path31.trim().replace(/\\/g, "/"));
}
function isPlanModeAllowedEditPath(path31) {
  return isMarkdownEditPath(path31) || isManagedCanvasEditPath(path31);
}
