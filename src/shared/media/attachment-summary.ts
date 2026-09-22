/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/media/attachment-summary.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var JSON_EXTENSIONS2 = /* @__PURE__ */ new Set(["json", "jsonc", "json5", "ndjson"]);
var ARCHIVE_EXTENSIONS = /* @__PURE__ */ new Set([
  "zip",
  "tar",
  "gz",
  "tgz",
  "bz2",
  "tbz2",
  "xz",
  "txz",
  "zst",
  "7z",
  "rar"
]);
var TABLE_MIME_TYPES = /* @__PURE__ */ new Set([
  "text/csv",
  "text/tab-separated-values",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]);
var DOCUMENT_MIME_TYPES = /* @__PURE__ */ new Set([
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);
var ARCHIVE_MIME_TYPES = /* @__PURE__ */ new Set([
  "application/zip",
  "application/x-zip-compressed",
  "application/gzip",
  "application/x-tar",
  "application/x-bzip2",
  "application/x-xz",
  "application/zstd",
  "application/x-7z-compressed",
  "application/x-rar-compressed",
  "application/vnd.rar"
]);
function classifyMimeType(rawMimeType) {
  const mime2 = (rawMimeType.split(";")[0] ?? "").trim().toLowerCase();
  if (mime2.startsWith("image/")) return "image";
  if (mime2.startsWith("video/")) return "video";
  if (mime2.startsWith("audio/")) return "audio";
  if (mime2 === "application/pdf") return "pdf";
  if (mime2 === "text/markdown") return "markdown";
  if (TABLE_MIME_TYPES.has(mime2)) return "table";
  if (mime2 === "application/json" || mime2.endsWith("+json")) return "json";
  if (DOCUMENT_MIME_TYPES.has(mime2)) return "document";
  if (ARCHIVE_MIME_TYPES.has(mime2)) return "archive";
  if (mime2.startsWith("text/")) return "text";
  return null;
}
function extensionSubject(source) {
  let pathname;
  try {
    pathname = new URL(source).pathname;
  } catch {
    return source;
  }
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}
function classifyPathLike(source) {
  const subject = extensionSubject(source);
  const previewKind = getFilePreviewKind(subject);
  switch (previewKind) {
    case "image":
    case "video":
    case "audio":
    case "pdf":
    case "markdown":
    case "table":
      return previewKind;
    case "docx":
      return "document";
    case "html":
      return "text";
    case "json":
      return "json";
    case "text": {
      const ext2 = attachmentExtension(subject);
      return ext2 != null && JSON_EXTENSIONS2.has(ext2) ? "json" : "text";
    }
    case "unknown": {
      const ext2 = attachmentExtension(subject);
      return ext2 != null && ARCHIVE_EXTENSIONS.has(ext2) ? "archive" : null;
    }
  }
  const _exhaustive = previewKind;
  return _exhaustive;
}
function classifyAttachment(source) {
  if (source.mimeType != null && source.mimeType.length > 0) {
    const byMime = classifyMimeType(source.mimeType);
    if (byMime != null) return byMime;
  }
  if (source.fileName != null && source.fileName.length > 0) {
    const byName = classifyPathLike(source.fileName);
    if (byName != null) return byName;
  }
  if (source.urlOrPath != null && source.urlOrPath.length > 0) {
    const byPath = classifyPathLike(source.urlOrPath);
    if (byPath != null) return byPath;
  }
  return "file";
}
function countAttachmentKinds(kinds) {
  const counts = /* @__PURE__ */ new Map();
  for (const kind of kinds) {
    counts.set(kind, (counts.get(kind) ?? 0) + 1);
  }
  return [...counts].map(([kind, count]) => ({ kind, count }));
}

