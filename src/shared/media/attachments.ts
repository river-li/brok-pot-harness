/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/media/attachments.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_ATTACHMENT_KINDS = [
  "image",
  "video",
  "audio",
  "pdf",
  "markdown",
  "table",
  "json",
  "text",
  "document",
  "archive",
  "file"
];
var SAND_FALLBACK_ATTACHMENT_KIND = SAND_ATTACHMENT_KINDS[10];
var KIND_LABELS = {
  image: { singular: "image", plural: "images" },
  video: { singular: "video", plural: "videos" },
  audio: { singular: "audio file", plural: "audio files" },
  pdf: { singular: "PDF", plural: "PDFs" },
  markdown: { singular: "Markdown file", plural: "Markdown files" },
  table: { singular: "spreadsheet", plural: "spreadsheets" },
  json: { singular: "JSON file", plural: "JSON files" },
  text: { singular: "text file", plural: "text files" },
  document: { singular: "document", plural: "documents" },
  archive: { singular: "archive", plural: "archives" },
  file: { singular: "file", plural: "files" }
};
function kindPhrase(kind, count) {
  const label = KIND_LABELS[kind];
  return `${count} ${count === 1 ? label.singular : label.plural}`;
}
function mergeAttachmentKindCounts(kinds) {
  if (kinds == null || kinds.length === 0) return [];
  const known = kinds.filter((entry) => entry.count > 0).map(
    (entry) => KIND_LABELS[entry.kind] != null ? entry : { kind: "file", count: entry.count }
  );
  const merged = /* @__PURE__ */ new Map();
  for (const entry of known) {
    merged.set(entry.kind, (merged.get(entry.kind) ?? 0) + entry.count);
  }
  return [...merged].map(([kind, count]) => ({ kind, count }));
}
function formatAttachmentSentSummary(count, kinds) {
  const total = Math.max(1, Math.floor(count));
  const merged = mergeAttachmentKindCounts(kinds);
  if (merged.length === 0) return `Sent ${kindPhrase("file", total)}`;
  const first = merged[0];
  if (merged.length === 1 && first != null) {
    return `Sent ${kindPhrase(first.kind, total)}`;
  }
  const breakdown = merged.map((entry) => kindPhrase(entry.kind, entry.count)).join(", ");
  return `Sent ${kindPhrase("file", total)} \xB7 ${breakdown}`;
}

