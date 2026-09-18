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
function stripContextTags(text2) {
  return stripTags(text2, CONTEXT_TAGS_TO_STRIP);
}
function stripTags(text2, tags) {
  let result = text2;
  for (const tag of tags) {
    const pattern = new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?</${tag}>`, "gi");
    result = result.replace(pattern, "");
  }
  return result.replace(/\n{3,}/g, "\n\n").trim();
}
var graphemeSegmenter = (() => {
  var _a19;
  const segmenterCtor = (_a19 = globalThis.Intl) === null || _a19 === void 0 ? void 0 : _a19.Segmenter;
  return segmenterCtor ? new segmenterCtor(void 0, { granularity: "grapheme" }) : void 0;
})();
function isHighSurrogate(code) {
  return code >= 55296 && code <= 56319;
}
function isLowSurrogate(code) {
  return code >= 56320 && code <= 57343;
}
function sliceHeadSafe(text2, maxUnits) {
  if (maxUnits <= 0) {
    return "";
  }
  if (text2.length <= maxUnits) {
    return text2;
  }
  if (graphemeSegmenter) {
    let out = "";
    for (const { segment } of graphemeSegmenter.segment(text2)) {
      if (out.length + segment.length > maxUnits) {
        break;
      }
      out += segment;
    }
    return out;
  }
  const end = isHighSurrogate(text2.charCodeAt(maxUnits - 1)) ? maxUnits - 1 : maxUnits;
  return text2.slice(0, end);
}
function sliceTailSafe(text2, maxUnits) {
  if (maxUnits <= 0) {
    return "";
  }
  if (text2.length <= maxUnits) {
    return text2;
  }
  if (graphemeSegmenter) {
    const segments = Array.from(graphemeSegmenter.segment(text2));
    let out = "";
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i].segment;
      if (out.length + seg.length > maxUnits) {
        break;
      }
      out = seg + out;
    }
    return out;
  }
  const start = isLowSurrogate(text2.charCodeAt(text2.length - maxUnits)) ? text2.length - maxUnits + 1 : text2.length - maxUnits;
  return text2.slice(start);
}
function truncateMiddle(text2, maxChars) {
  if (text2.length <= maxChars) {
    return text2;
  }
  const separator = "...";
  const charsPerSide = Math.max(1, Math.floor((maxChars - separator.length) / 2));
  return `${sliceHeadSafe(text2, charsPerSide)}${separator}${sliceTailSafe(text2, charsPerSide)}`;
}
