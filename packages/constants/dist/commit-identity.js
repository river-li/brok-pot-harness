/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/constants/dist/commit-identity.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function hasCursorCommitAttribution(text2) {
  const lower = text2.toLowerCase();
  return lower.includes(`co-authored-by: ${CURSOR_COAUTHOR_NAME.toLowerCase()}`) || lower.includes(LEGACY_MADE_WITH_TRAILER.toLowerCase());
}
var CURSOR_AGENT_EMAIL, CURSOR_COAUTHOR_NAME, CURSOR_COAUTHORED_BY_TRAILER, LEGACY_MADE_WITH_TRAILER;
var init_commit_identity = __esm({
  "../packages/constants/dist/commit-identity.js"() {
    "use strict";
    CURSOR_AGENT_EMAIL = "cursoragent@cursor.com";
    CURSOR_COAUTHOR_NAME = "Cursor";
    CURSOR_COAUTHORED_BY_TRAILER = `Co-authored-by: ${CURSOR_COAUTHOR_NAME} <${CURSOR_AGENT_EMAIL}>`;
    LEGACY_MADE_WITH_TRAILER = "Made-with: Cursor";
  }
});

