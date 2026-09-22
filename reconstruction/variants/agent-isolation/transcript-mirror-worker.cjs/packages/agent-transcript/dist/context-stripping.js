/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-transcript/dist/context-stripping.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CONTEXT_TAGS_TO_STRIP = [
  "user_info",
  "project_layout",
  "rules",
  "always_applied_workspace_rules",
  "agent_requestable_workspace_rules",
  "user_rules",
  "agent_skills",
  "available_skills",
  "cloud_instructions",
  "cloud_task_instructions",
  "open_and_recently_viewed_files",
  "system_reminder",
  "system-reminder",
  // Grok Bot's pinned-section change note, appended inside the human's
  // <user_query> by the harness (grok-bot-harness/runner/frozen-prompt-section).
  "instructions_update",
  "mcp_instructions",
  "mcp_file_system",
  "mcp_file_system_servers",
  "git_status",
  "agent_transcripts",
  "cursor_rules_context",
  "attached_files",
  // Hard-coded (not shared with @anysphere/constants) so legacy
  // `system_notification` payloads are still stripped if the canonical tag ever changes.
  "system_notification",
  "task_notification",
  "agent_notification"
];
function stripContextTags(text) {
  return stripTags(text, CONTEXT_TAGS_TO_STRIP);
}
function stripTags(text, tags) {
  let result = text;
  for (const tag of tags) {
    const pattern = new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?</${tag}>`, "gi");
    result = result.replace(pattern, "");
  }
  return result.replace(/\n{3,}/g, "\n\n").trim();
}
var graphemeSegmenter = (() => {
  var _a;
  const segmenterCtor = (_a = globalThis.Intl) === null || _a === void 0 ? void 0 : _a.Segmenter;
  return segmenterCtor ? new segmenterCtor(void 0, { granularity: "grapheme" }) : void 0;
})();

