/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/ignore-mapping.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createIgnoreMapping(patterns, baseDir) {
  if (!patterns || patterns.length === 0) {
    return {};
  }
  const validPatterns = patterns.map((pattern) => pattern.trim()).filter((pattern) => pattern !== "" && !pattern.startsWith("#"));
  if (validPatterns.length === 0) {
    return {};
  }
  return {
    [baseDir]: validPatterns
  };
}
var init_ignore_mapping = __esm({
  "../packages/shell-exec/dist/ignore-mapping.js"() {
    "use strict";
  }
});

