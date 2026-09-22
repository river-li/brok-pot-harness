/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/media/file-preview-kind.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var IMAGE_EXTENSIONS = new Set(
  Object.keys(SERVABLE_IMAGE_MIME_FROM_EXTENSION).map((ext2) => ext2.slice(1))
);
var VIDEO_EXTENSIONS2 = new Set(
  Object.keys(VIDEO_MIME_FROM_EXTENSION).map((ext2) => ext2.slice(1))
);
var AUDIO_EXTENSIONS = new Set(
  Object.keys(AUDIO_MIME_FROM_EXTENSION).map((ext2) => ext2.slice(1))
);
var MARKDOWN_EXTENSIONS = /* @__PURE__ */ new Set(["md", "markdown", "mdx"]);
var JSON_EXTENSIONS = /* @__PURE__ */ new Set(["json"]);
var HTML_EXTENSIONS = /* @__PURE__ */ new Set(["html", "htm"]);
var TABLE_EXTENSIONS = /* @__PURE__ */ new Set(["csv", "tsv", "xlsx", "xls"]);
function getFilePreviewKind(nameOrPath) {
  const ext2 = attachmentExtension(nameOrPath);
  if (ext2 == null) return "unknown";
  if (IMAGE_EXTENSIONS.has(ext2)) return "image";
  if (VIDEO_EXTENSIONS2.has(ext2)) return "video";
  if (AUDIO_EXTENSIONS.has(ext2)) return "audio";
  if (ext2 === "pdf") return "pdf";
  if (TABLE_EXTENSIONS.has(ext2)) return "table";
  if (JSON_EXTENSIONS.has(ext2)) return "json";
  if (MARKDOWN_EXTENSIONS.has(ext2)) return "markdown";
  if (HTML_EXTENSIONS.has(ext2)) return "html";
  if (ext2 === "docx") return "docx";
  if (isTextPreviewableName(nameOrPath)) return "text";
  return "unknown";
}

