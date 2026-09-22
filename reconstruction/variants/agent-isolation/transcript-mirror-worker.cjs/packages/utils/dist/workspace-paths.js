/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/workspace-paths.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var TRANSCRIPTS_SUBDIR = "agent-transcripts";
var MAX_CONVERSATION_ID_LENGTH = 200;
function getSafeConversationId(conversationId) {
  let safe = encodeURIComponent(conversationId);
  safe = safe.replace(/%/g, "_");
  if (safe.length > MAX_CONVERSATION_ID_LENGTH) {
    safe = safe.slice(0, MAX_CONVERSATION_ID_LENGTH);
  }
  return safe;
}

