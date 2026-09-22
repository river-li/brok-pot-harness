/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/utils/dist/workspace-paths.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function getSafeConversationId(conversationId) {
  let safe = encodeURIComponent(conversationId);
  safe = safe.replace(/%/g, "_");
  if (safe.length > MAX_CONVERSATION_ID_LENGTH) {
    safe = safe.slice(0, MAX_CONVERSATION_ID_LENGTH);
  }
  return safe;
}
var TRANSCRIPTS_SUBDIR, MAX_CONVERSATION_ID_LENGTH;
var init_workspace_paths = __esm({
  "../packages/utils/dist/workspace-paths.js"() {
    "use strict";
    TRANSCRIPTS_SUBDIR = "agent-transcripts";
    MAX_CONVERSATION_ID_LENGTH = 200;
  }
});

