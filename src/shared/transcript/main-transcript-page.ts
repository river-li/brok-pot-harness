/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/transcript/main-transcript-page.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

