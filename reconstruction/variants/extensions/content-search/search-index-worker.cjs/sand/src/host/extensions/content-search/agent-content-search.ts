/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/content-search/agent-content-search.ts
 * Bundle: sand-host/extensions/content-search/search-index-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var AGENT_CONTENT_SEARCH_MAX_MATCHES_PER_AGENT = 5;
var SNIPPET_LEAD = 30;
var SNIPPET_TRAIL = 60;
var ELLIPSIS = "\u2026";
function entrySearchText(entry) {
  switch (entry.kind) {
    case "message":
      return entry.content;
    case "send-message":
      return entry.message.type === "text" ? entry.message.content : "";
    case "notice":
      return entry.text;
    default:
      return "";
  }
}
function flatten(text) {
  return text.replace(/\s+/g, " ").trim();
}
function buildContentSnippet(text, normalizedQuery) {
  if (normalizedQuery.length === 0) return null;
  const flat = flatten(text);
  const index = flat.toLowerCase().indexOf(normalizedQuery);
  if (index < 0) return null;
  const start = Math.max(0, index - SNIPPET_LEAD);
  const end = Math.min(flat.length, index + normalizedQuery.length + SNIPPET_TRAIL);
  const core = flat.slice(start, end);
  const prefix = start > 0 ? ELLIPSIS : "";
  const suffix = end < flat.length ? ELLIPSIS : "";
  return `${prefix}${core}${suffix}`;
}

