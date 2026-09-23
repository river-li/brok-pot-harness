var import_node_fs48 = require("node:fs");
var import_node_path89 = require("node:path");
var import_node_url11 = require("node:url");
var CHANNEL_ATTACHMENT_MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
var GENERIC_BINARY_MIME = "application/octet-stream";
function tryParseUrl(raw) {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}
function toLocalPath(raw) {
  const parsed2 = tryParseUrl(raw);
  if (parsed2 == null) {
    return raw.length > 0 ? raw : null;
  }
  if (parsed2.protocol === "file:") {
    try {
      return (0, import_node_url11.fileURLToPath)(parsed2);
    } catch {
      return null;
    }
  }
  return null;
}
function urlLooksLikeImage(raw) {
  const parsed2 = tryParseUrl(raw);
  if (parsed2 == null) return false;
  return imageMimeFromPath(parsed2.pathname) != null;
}
async function resolveChannelAttachment(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.length === 0) return null;
  const parsed2 = tryParseUrl(rawUrl);
  if (parsed2?.protocol === "https:" || parsed2?.protocol === "http:") {
    return { transport: "url", isImage: urlLooksLikeImage(rawUrl), url: rawUrl };
  }
  const localPath = toLocalPath(rawUrl);
  if (localPath == null) return null;
  const resolved = reanchorSandPath(localPath, { acceptBoxModelVisibleAlias: true });
  let size;
  try {
    const stat28 = await import_node_fs48.promises.stat(resolved);
    if (!stat28.isFile()) return null;
    size = stat28.size;
  } catch (error42) {
    reportFallbackUnlessAbsent("channel_attachment", error42);
    return null;
  }
  if (size === 0 || size > CHANNEL_ATTACHMENT_MAX_UPLOAD_BYTES) return null;
  let data;
  try {
    data = await import_node_fs48.promises.readFile(resolved);
  } catch (error42) {
    reportFallbackUnlessAbsent("channel_attachment", error42);
    return null;
  }
  const imageMime = imageMimeFromPath(resolved);
  const mime2 = imageMime ?? videoMimeFromPath(resolved) ?? GENERIC_BINARY_MIME;
  return {
    transport: "upload",
    isImage: imageMime != null,
    bytes: new Uint8Array(data),
    filename: (0, import_node_path89.basename)(resolved),
    mime: mime2
  };
}
