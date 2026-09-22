/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/background-work-metadata.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function decodeBackgroundWorkMetadata(metadata) {
  const decoded = {};
  const title = metadata === null || metadata === void 0 ? void 0 : metadata.title;
  if (typeof title === "string" && title.trim().length > 0) {
    decoded.title = title;
  }
  const cwd = metadata === null || metadata === void 0 ? void 0 : metadata.cwd;
  if (typeof cwd === "string" && cwd.trim().length > 0) {
    decoded.cwd = cwd;
  }
  const rawStart = metadata === null || metadata === void 0 ? void 0 : metadata.startTimeMs;
  if (typeof rawStart === "string" && rawStart.length > 0) {
    const parsed2 = Number(rawStart);
    if (Number.isFinite(parsed2) && parsed2 > 0) {
      decoded.startTimeMs = Math.floor(parsed2);
    }
  }
  return decoded;
}

