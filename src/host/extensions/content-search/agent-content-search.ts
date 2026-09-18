var AGENT_CONTENT_SEARCH_MAX_MATCHES_PER_AGENT = 5;
var AGENT_CONTENT_SEARCH_MAX_RESULTS = 50;
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
function entryRole(entry) {
  return entry.kind === "message" ? entry.role : "assistant";
}
function flatten(text2) {
  return text2.replace(/\s+/g, " ").trim();
}
function buildContentSnippet(text2, normalizedQuery) {
  if (normalizedQuery.length === 0) return null;
  const flat = flatten(text2);
  const index = flat.toLowerCase().indexOf(normalizedQuery);
  if (index < 0) return null;
  const start = Math.max(0, index - SNIPPET_LEAD);
  const end = Math.min(flat.length, index + normalizedQuery.length + SNIPPET_TRAIL);
  const core2 = flat.slice(start, end);
  const prefix = start > 0 ? ELLIPSIS : "";
  const suffix = end < flat.length ? ELLIPSIS : "";
  return `${prefix}${core2}${suffix}`;
}
function findAgentContentMatches(entries, normalizedQuery, limit = AGENT_CONTENT_SEARCH_MAX_MATCHES_PER_AGENT) {
  if (normalizedQuery.length === 0) return [];
  const matches = [];
  for (let i = entries.length - 1; i >= 0; i--) {
    if (matches.length >= limit) break;
    const entry = entries[i];
    if (entry == null) continue;
    if (isHiddenOutboundAgentPeerMessageEntry(entry)) continue;
    const snippet2 = buildContentSnippet(entrySearchText(entry), normalizedQuery);
    if (snippet2 == null) continue;
    matches.push({
      entryId: entry.id,
      role: entryRole(entry),
      timestampMs: entry.timestampMs ?? 0,
      snippet: snippet2
    });
  }
  return matches;
}
