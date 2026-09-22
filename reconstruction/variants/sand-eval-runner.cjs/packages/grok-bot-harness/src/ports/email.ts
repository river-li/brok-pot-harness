/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/email.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_EMAIL_SEARCH_MODES = ["hybrid", "keyword", "semantic"];
function isInlineEmailAttachment(summary) {
  return summary.disposition === "inline" && summary.contentId !== null;
}

