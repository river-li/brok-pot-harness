/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/read/image-utils.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_image_type = __toESM(require_image_type(), 1);
var import_mime_types = __toESM(require_mime_types(), 1);
function detectImageMimeType(bytes, filePath) {
  const result = (0, import_image_type.default)(bytes);
  if (result?.mime) {
    return result.mime;
  }
  if (filePath) {
    const mimeType = (0, import_mime_types.lookup)(filePath);
    if (mimeType && typeof mimeType === "string" && mimeType.startsWith("image/")) {
      return mimeType;
    }
    const ext2 = filePath.toLowerCase().match(/\.([^.]+)$/)?.[1];
    if (ext2) {
      const fallbackMap = {
        avif: "image/avif",
        heic: "image/heic",
        heif: "image/heif"
      };
      if (fallbackMap[ext2])
        return fallbackMap[ext2];
    }
  }
  return void 0;
}

