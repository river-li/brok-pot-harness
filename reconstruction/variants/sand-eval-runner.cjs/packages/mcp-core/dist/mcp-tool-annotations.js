/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/mcp-tool-annotations.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isDeclaredReadOnlyMcpTool(annotations) {
  if (annotations === void 0) {
    return false;
  }
  if (annotations.destructiveHint === true) {
    return false;
  }
  return annotations.readOnlyHint === true;
}
function parseMcpToolAnnotations(annotationsJson) {
  if (annotationsJson === void 0 || annotationsJson.length === 0) {
    return void 0;
  }
  try {
    const parsed = JSON.parse(annotationsJson);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch (_a20) {
  }
  return void 0;
}
function toolAnnotationsJsonField(annotations) {
  if (annotations === void 0) {
    return {};
  }
  const bounded = {};
  if (typeof annotations.title === "string" && annotations.title.length > 0) {
    bounded.title = annotations.title.slice(0, MAX_TOOL_ANNOTATION_TITLE_LENGTH);
  }
  for (const key of [
    "readOnlyHint",
    "destructiveHint",
    "idempotentHint",
    "openWorldHint"
  ]) {
    if (typeof annotations[key] === "boolean") {
      bounded[key] = annotations[key];
    }
  }
  if (Object.keys(bounded).length === 0) {
    return {};
  }
  return { annotationsJson: JSON.stringify(bounded) };
}
var MAX_TOOL_ANNOTATION_TITLE_LENGTH;
var init_mcp_tool_annotations = __esm({
  "../packages/mcp-core/dist/mcp-tool-annotations.js"() {
    "use strict";
    MAX_TOOL_ANNOTATION_TITLE_LENGTH = 256;
  }
});

