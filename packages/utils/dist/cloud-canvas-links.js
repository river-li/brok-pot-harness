/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/cloud-canvas-links.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isCloudCanvasStoreId(value) {
  return PATH_SAFE_STORE_ID_PATTERN.test(value);
}
function isCloudCanvasId(value) {
  return CANVAS_UUID_PATTERN.test(value);
}
function parseCloudCanvasWebLink(href) {
  try {
    const parsed2 = new URL(href.trim());
    if (parsed2.protocol !== "https:" || !CURSOR_WEB_HOSTNAMES.has(parsed2.hostname) || parsed2.port.length > 0 || parsed2.username.length > 0 || parsed2.password.length > 0 || parsed2.search.length > 0 || parsed2.hash.length > 0) {
      return void 0;
    }
    const segments = parsed2.pathname.split("/").filter(Boolean);
    if (segments.length !== 3 || segments[0] !== "canvas" || parsed2.pathname !== `/${segments.join("/")}`) {
      return void 0;
    }
    const [, storeId, canvasId] = segments;
    if (storeId === void 0 || canvasId === void 0 || !isCloudCanvasStoreId(storeId) || !isCloudCanvasId(canvasId)) {
      return void 0;
    }
    return { storeId, canvasId: canvasId.toLowerCase() };
  } catch (_a19) {
    return void 0;
  }
}
var CURSOR_WEB_HOSTNAMES, CANVAS_UUID_PATTERN, PATH_SAFE_STORE_ID_PATTERN;
var init_cloud_canvas_links = __esm({
  "../packages/utils/dist/cloud-canvas-links.js"() {
    "use strict";
    CURSOR_WEB_HOSTNAMES = /* @__PURE__ */ new Set(["cursor.com", "www.cursor.com"]);
    CANVAS_UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    PATH_SAFE_STORE_ID_PATTERN = /^[0-9A-Za-z][0-9A-Za-z._-]{0,199}$/;
  }
});

