var MAIN_TRANSCRIPT_PAGE_KINDS = [
  "send-message",
  "user-attachment",
  "voice-call"
];
var PAGE_KINDS = new Set(MAIN_TRANSCRIPT_PAGE_KINDS);
function isMainTranscriptPageEntry(entry) {
  if (isBranchedEntry(entry)) return false;
  if (PAGE_KINDS.has(entry.kind)) return true;
  return entry.kind === "message" && (entry.role === "user" || entry.fromAgent != null || entry.toAgent != null);
}
