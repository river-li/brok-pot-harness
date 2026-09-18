init_agent_store_ids();
var regExpLiteral = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var USER_STORE_CANVAS_SOURCE_PATH_PATTERN = new RegExp(
  `${regExpLiteral(`${USER_STORE_CANVASES_DIR}/`)}([0-9a-fA-F-]{36})/${regExpLiteral(CLOUD_CANVAS_SOURCE_BASENAME)}(?![\\w.-])`,
  "g"
);
var CANVAS_SOURCE_PATH_TEMPLATE = `${USER_STORE_CANVASES_DIR}/<uuid>/${CLOUD_CANVAS_SOURCE_BASENAME}`;
function hasUserStoreCanvasSourcePath(text2) {
  if (!text2.includes(USER_STORE_CANVASES_DIR)) return false;
  for (const match2 of text2.matchAll(USER_STORE_CANVAS_SOURCE_PATH_PATTERN)) {
    if (parseCloudCanvasId(match2[1] ?? "").ok) return true;
  }
  return false;
}
