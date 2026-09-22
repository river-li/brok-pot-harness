var META_PARENT_COMPLETION_TAG = "agent_notification";
var META_PARENT_COMPLETION_OPEN_TAG = `<${META_PARENT_COMPLETION_TAG}>`;
var META_PARENT_COMPLETION_CLOSE_TAG = `</${META_PARENT_COMPLETION_TAG}>`;
var META_PARENT_COMPLETION_SYSTEM_REMINDER = `<system_reminder>
Do not reiterate or repeat the contents of this agent notification to the user unless asked to do so.

Follow your instructions for Handling subagent notifications.
</system_reminder>`;
function isPreformattedResponseBody(text2) {
  return text2.includes("<response>") && text2.includes("</response>");
}
function neutralizeMetaParentWrapperTags(detail) {
  return detail.replace(new RegExp(`<\\/\\s*${META_PARENT_COMPLETION_TAG}\\s*>`, "gi"), `&lt;/${META_PARENT_COMPLETION_TAG}>`).replace(/<(\/?)\s*user_query\s*>/gi, "&lt;$1user_query>");
}
function normalizeMetaParentResponseBody(rawText) {
  const trimmedText = rawText.trim();
  if (isPreformattedResponseBody(trimmedText)) {
    return neutralizeMetaParentWrapperTags(trimmedText);
  }
  const escapedText = escapePromptXmlText(trimmedText);
  return ["<response>", escapedText.length > 0 ? escapedText : "No output", "</response>"].join("\n");
}
