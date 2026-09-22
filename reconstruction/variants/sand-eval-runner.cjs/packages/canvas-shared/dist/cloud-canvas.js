/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/canvas-shared/dist/cloud-canvas.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_agent_store_ids();
var USER_STORE_MOUNT_DIR = `${AGENT_STORE_MOUNT_ROOT2}/${AGENT_STORE_USER_MOUNT_NAME}`;
function formatStoreCanvasSourcePath(canvasesRoot, canvasId) {
  return `${canvasesRoot}/${canvasId}/${CLOUD_CANVAS_SOURCE_BASENAME}`;
}
function formatUserStoreCanvasSourcePath(canvasId) {
  return formatStoreCanvasSourcePath(USER_STORE_CANVASES_DIR, canvasId);
}
function parseCloudCanvasId(raw) {
  const normalized = raw.trim().toLowerCase();
  if (!BARE_UUID_PATTERN.test(normalized)) {
    return { ok: false };
  }
  return { ok: true, value: normalized };
}

