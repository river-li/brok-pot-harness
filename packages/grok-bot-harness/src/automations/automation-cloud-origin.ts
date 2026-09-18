var SAND_ORIGIN_SERVER_EVENT_KINDS = [
  "pr-opened",
  "pr-pushed",
  "pr-merged",
  "pr-comment"
];
var ORIGIN_SERVER_EVENT_KINDS = new Set(SAND_ORIGIN_SERVER_EVENT_KINDS);
function isOriginServerEventKind(kind) {
  return ORIGIN_SERVER_EVENT_KINDS.has(kind);
}
function originServerShape(listener) {
  if (listener.pr !== void 0) return "pr_scoped";
  if (listener.userAllowlist !== void 0 && listener.userAllowlist.length > 0) {
    return "user_allowlist";
  }
  if (listener.events.length === 0 || !listener.events.every(isOriginServerEventKind)) {
    return "unsupported_events";
  }
  return "supported";
}
function originRepoUrl({
  host,
  repo
}) {
  return `https://${host}/git/${repo}.git`;
}
