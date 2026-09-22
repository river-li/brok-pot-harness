/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-summarization/dist/prepare-messages.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var USER_INFO_TAG_REGEX = /<user_info>[\s\S]*<\/user_info>/;
function hasUserInfoTag(message) {
  const unredactedMessage = fromRedactedCoreMessage(message, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  const content = unredactedMessage.content;
  const textContent2 = Array.isArray(content) ? content.filter((part) => part.type === "text").map((part) => part.text).join("\n") : content;
  return USER_INFO_TAG_REGEX.test(textContent2);
}
function isEmptyAssistantMessage3(message) {
  if (message.role !== "assistant") {
    return false;
  }
  const unredacted = fromRedactedCoreMessage(message, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  const content = unredacted.content;
  if (typeof content === "string") {
    return content.length === 0;
  }
  if (Array.isArray(content)) {
    return content.length === 0;
  }
  return false;
}
var INJECTED_REMINDER_CURSOR_FLAGS = [
  "loopReminder",
  "sandSendMessageReminder",
  "sandEarlyResultReminder",
  "sandStartOfTurnAckReminder",
  "sandDiskPressureReminder"
];
function isInjectedReminderMessage(message) {
  var _a20;
  if (message.role !== "user") {
    return false;
  }
  const cursor = (_a20 = message.providerOptions) === null || _a20 === void 0 ? void 0 : _a20.cursor;
  if (cursor === void 0) {
    return false;
  }
  return INJECTED_REMINDER_CURSOR_FLAGS.some((flag) => cursor[flag] === true);
}
function prepareMessagesForCompaction(messages) {
  const systemMessage = messages.find((message) => message.role === "system");
  let messagesForSummarization = messages.filter((message) => message.role !== "system" && !isEmptyAssistantMessage3(message));
  let userInfoMessage;
  if (messagesForSummarization.length >= 2 && messagesForSummarization[0].role === "user" && messagesForSummarization[1].role === "user" && hasUserInfoTag(messagesForSummarization[0])) {
    userInfoMessage = messagesForSummarization[0];
    messagesForSummarization = messagesForSummarization.slice(1);
  }
  return {
    systemMessage,
    userInfoMessage,
    messagesForSummarization
  };
}

