/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/canvas-path.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function anchoredRoot(dir) {
  return escapeRegExp(dir.replace(/^\/+/, "").replace(/\/+$/, ""));
}
function normalizeCanvasPath(path31) {
  const segments = [];
  for (const segment of path31.replace(/\\/g, "/").split("/")) {
    if (segment === "" || segment === ".") {
      continue;
    }
    if (segment === "..") {
      segments.pop();
      continue;
    }
    segments.push(segment);
  }
  return segments.join("/");
}
function isManagedCanvasPath(path31) {
  const normalized = normalizeCanvasPath(path31);
  return MANAGED_CANVAS_REGEX.test(normalized) || STORE_CANVAS_REGEX.test(normalized) || USER_STORE_REPLICA_CANVAS_REGEX.test(normalized);
}
var STORE_CANVASES_MOUNT_ALTERNATION, AGENT_STORE_MOUNT_ROOT2, CLOUD_CANVAS_ROOT2, MANAGED_CANVAS_REGEX, STORE_CANVAS_REGEX, USER_STORE_REPLICA_CANVAS_REGEX;
var init_canvas_path = __esm({
  "../packages/utils/dist/canvas-path.js"() {
    "use strict";
    STORE_CANVASES_MOUNT_ALTERNATION = "user|automation";
    AGENT_STORE_MOUNT_ROOT2 = "/cursor/stores";
    CLOUD_CANVAS_ROOT2 = "canvases";
    MANAGED_CANVAS_REGEX = /(?:^|\/)\.cursor\/projects\/[^/]+\/canvases\/[^/]+\.canvas\.tsx$/i;
    STORE_CANVAS_REGEX = new RegExp(`^${anchoredRoot(AGENT_STORE_MOUNT_ROOT2)}/(?:${STORE_CANVASES_MOUNT_ALTERNATION})/${CLOUD_CANVAS_ROOT2}/(?:[^/]+/)?[^/]+\\.canvas\\.tsx$`);
    USER_STORE_REPLICA_CANVAS_REGEX = /(?:^|\/)[^/]+\/files\/canvases\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/source\.canvas\.tsx$/i;
  }
});

