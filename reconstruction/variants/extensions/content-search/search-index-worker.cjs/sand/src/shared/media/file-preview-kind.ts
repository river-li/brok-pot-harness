/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/media/file-preview-kind.ts
 * Bundle: sand-host/extensions/content-search/search-index-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var IMAGE_EXTENSIONS = new Set(
  Object.keys(SERVABLE_IMAGE_MIME_FROM_EXTENSION).map((ext) => ext.slice(1))
);
var VIDEO_EXTENSIONS = new Set(
  Object.keys(VIDEO_MIME_FROM_EXTENSION).map((ext) => ext.slice(1))
);
var AUDIO_EXTENSIONS = new Set(
  Object.keys(AUDIO_MIME_FROM_EXTENSION).map((ext) => ext.slice(1))
);
var MARKDOWN_EXTENSIONS = /* @__PURE__ */ new Set(["md", "markdown", "mdx"]);
var JSON_EXTENSIONS = /* @__PURE__ */ new Set(["json"]);
var HTML_EXTENSIONS = /* @__PURE__ */ new Set(["html", "htm"]);
var TABLE_EXTENSIONS = /* @__PURE__ */ new Set(["csv", "tsv", "xlsx", "xls"]);
function getFilePreviewKind(nameOrPath) {
  const ext = attachmentExtension(nameOrPath);
  if (ext == null) return "unknown";
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  if (VIDEO_EXTENSIONS.has(ext)) return "video";
  if (AUDIO_EXTENSIONS.has(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  if (TABLE_EXTENSIONS.has(ext)) return "table";
  if (JSON_EXTENSIONS.has(ext)) return "json";
  if (MARKDOWN_EXTENSIONS.has(ext)) return "markdown";
  if (HTML_EXTENSIONS.has(ext)) return "html";
  if (ext === "docx") return "docx";
  if (isTextPreviewableName(nameOrPath)) return "text";
  return "unknown";
}

