/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/user-message-action/synthetic-user-message.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist2();
function extractCursorProviderOptions(message) {
  const providerOptions = message.providerOptions;
  return providerOptions?.cursor;
}
function getUserMessageTextContent(message) {
  if (message.role !== "user") {
    return void 0;
  }
  const content = message.content;
  if (typeof content === "string") {
    return content;
  }
  if (!Array.isArray(content)) {
    return void 0;
  }
  return content.filter((part) => part !== null && typeof part === "object" && "type" in part && part.type === "text" && "text" in part && typeof part.text === "string").map((part) => part.text).join("");
}
var NOTIFICATION_TAG_NAMES = [
  "system_notification",
  "agent_notification",
  "task_notification",
  // Glass durable side-chat boundary (synthetic prepended user turn).
  "side_chat_boundary"
];
var XML_TAG_REGEX = /<(?:(\/)\s*([A-Za-z_][\w:.-]*)\s*>|([A-Za-z_][\w:.-]*)(?:\s[^<>]*?)?(\/)?>)/g;
function isNotificationOnlyUserMessage(message) {
  const text2 = getUserMessageTextContent(message);
  if (text2 === void 0 || text2.length === 0) {
    return false;
  }
  const stack = [];
  for (const match2 of text2.matchAll(XML_TAG_REGEX)) {
    const [, closingSlash, closingTagName, openingTagName, selfClosingSlash] = match2;
    if (closingSlash !== void 0 && closingTagName !== void 0) {
      if (stack[stack.length - 1] === closingTagName) {
        stack.pop();
      }
      continue;
    }
    if (openingTagName === void 0) {
      continue;
    }
    if (stack.length === 0 && NOTIFICATION_TAG_NAMES.includes(openingTagName)) {
      return true;
    }
    if (selfClosingSlash === void 0) {
      stack.push(openingTagName);
    }
  }
  return false;
}
function isGoalContinuationNotificationMessage(message) {
  const text2 = getUserMessageTextContent(message);
  return text2 !== void 0 && text2.includes(`<${SYSTEM_NOTIFICATION_TAG} source="goal"`);
}
function isSyntheticUserMessage(message) {
  const cursor = extractCursorProviderOptions(message);
  return cursor?.isSummary === true || isNotificationOnlyUserMessage(message);
}

