var USER_INFO_TAG_REGEX = /<user_info>[\s\S]*<\/user_info>/;
function hasUserInfoTag(message) {
  const unredactedMessage = fromRedactedCoreMessage(message, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  const content = unredactedMessage.content;
  const textContent = Array.isArray(content) ? content.filter((part) => part.type === "text").map((part) => part.text).join("\n") : content;
  return USER_INFO_TAG_REGEX.test(textContent);
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
  "sandDiskPressureReminder",
  "sandMcpUnavailableReminder"
];
function isInjectedReminderMessage(message) {
  var _a19;
  if (message.role !== "user") {
    return false;
  }
  const cursor = (_a19 = message.providerOptions) === null || _a19 === void 0 ? void 0 : _a19.cursor;
  if (cursor === void 0) {
    return false;
  }
  return INJECTED_REMINDER_CURSOR_FLAGS.some((flag2) => cursor[flag2] === true);
}
function prepareMessagesForCompaction(messages2) {
  const systemMessage = messages2.find((message) => message.role === "system");
  let messagesForSummarization = messages2.filter((message) => message.role !== "system" && !isEmptyAssistantMessage3(message));
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
