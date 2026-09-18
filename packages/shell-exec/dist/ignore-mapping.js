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
