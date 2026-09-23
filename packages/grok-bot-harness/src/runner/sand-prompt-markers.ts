var SAND_HIDDEN_PROMPT_MARKER = "[SAND_HIDDEN_PROMPT]";
var SAND_TRUSTED_AUTOMATION_PROMPT_MARKER = "[SAND_TRUSTED_AUTOMATION_PROMPT]";
function automationWakeTrustMarker(wake) {
  if (wake === void 0 || wake.untrusted === true || wake.platformProactivity === true) {
    return "";
  }
  return SAND_TRUSTED_AUTOMATION_PROMPT_MARKER;
}
var SAND_OFF_RECORD_MESSAGE_ID_PREFIX = "offrec-";
var SAND_WIDGET_ANSWER_MESSAGE_ID_PREFIX = "widget:";
var SAND_SECRET_SUBMIT_MESSAGE_ID_PREFIX = "secret-submit:";
var SAND_CREDENTIAL_RESOLVE_MESSAGE_ID_PREFIX = "credential-resolve:";
var SAND_USER_FORM_MESSAGE_ID_PREFIX = "user-form:";
var SAND_DRAFT_SEND_MESSAGE_ID_PREFIX = "draft-send:";
var SAND_WAKE_OUTCOME_MESSAGE_ID_PREFIXES = [
  SAND_WIDGET_ANSWER_MESSAGE_ID_PREFIX,
  SAND_SECRET_SUBMIT_MESSAGE_ID_PREFIX,
  SAND_CREDENTIAL_RESOLVE_MESSAGE_ID_PREFIX,
  SAND_USER_FORM_MESSAGE_ID_PREFIX,
  SAND_DRAFT_SEND_MESSAGE_ID_PREFIX
];
var GROUP_CHAT_TAG_PREFIX = "[Group chat: ";
function isOffRecordMessageId(messageId) {
  return messageId?.startsWith(SAND_OFF_RECORD_MESSAGE_ID_PREFIX) === true;
}
function wakeOutcomeEntryIdOf(messageId) {
  if (messageId == null) return void 0;
  const bare = isOffRecordMessageId(messageId) ? messageId.slice(SAND_OFF_RECORD_MESSAGE_ID_PREFIX.length) : messageId;
  const prefix = SAND_WAKE_OUTCOME_MESSAGE_ID_PREFIXES.find(
    (candidate) => bare.startsWith(candidate)
  );
  if (prefix == null) return void 0;
  const entryId = bare.slice(prefix.length);
  return entryId.length > 0 ? entryId : void 0;
}
function isGroupTurnPromptText(text2) {
  const body = text2.startsWith(SAND_HIDDEN_PROMPT_MARKER) ? text2.slice(SAND_HIDDEN_PROMPT_MARKER.length) : text2;
  return body.startsWith(GROUP_CHAT_TAG_PREFIX);
}
var GROUP_TURN_CLOSING_LINE_PREFIX = "It's your turn, ";
function stripGroupTurnClosing(text2) {
  if (!isGroupTurnPromptText(text2)) return text2;
  const closingAt = lastLineStartingWith(text2, GROUP_TURN_CLOSING_LINE_PREFIX);
  return closingAt === void 0 ? text2 : text2.slice(0, closingAt).trimEnd();
}
function lastLineStartingWith(text2, prefix) {
  let found;
  let lineStart = 0;
  for (; ; ) {
    if (text2.startsWith(prefix, lineStart)) found = lineStart;
    const newline = text2.indexOf("\n", lineStart);
    if (newline === -1) return found;
    lineStart = newline + 1;
  }
}
var SAND_AUTOMATION_WAKE_CUE = "[routine]";
var SAND_AUTOMATION_WAKE_CARRY_OUT_PREFIX = "Carry it out now";
var SYSTEM_REMINDER_BLOCK_RE = /<system_reminder>(?:(?!<system_reminder>)[\s\S])*?<\/system_reminder>/g;
function stripSystemReminderBlocks(text2) {
  return text2.replace(SYSTEM_REMINDER_BLOCK_RE, "").replace(/\n{3,}/g, "\n\n").trim();
}
function stripAutomationWakeDeliveryGuidance(text2) {
  if (!text2.startsWith(SAND_AUTOMATION_WAKE_CUE)) return text2;
  const carryOutAt = lastLineStartingWith(text2, SAND_AUTOMATION_WAKE_CARRY_OUT_PREFIX);
  return carryOutAt === void 0 ? text2 : text2.slice(0, carryOutAt).trimEnd();
}
function stripLeadingSandTurnAssemblyNotes(text2) {
  let body = text2;
  for (; ; ) {
    const stripped = stripOneLeadingNote(body);
    if (stripped === void 0) return body;
    body = stripped;
  }
}
var SINGLE_LINE_NOTE_RES = [
  /^\[t\d{1,10}u\]$/,
  /^\[automation:[^\s\]]{1,64}\]$/,
  /^\[widget:[^\s\]]{1,64}\]$/,
  /^\[Sent from machine [A-Za-z0-9._:-]{1,127}\]$/,
  /^\[In reply to [^\n]*\]$/,
  /^\[Answering your question [^\n]*\]$/,
  /^\[Composed offline at [^\n]*\]$/
];
var MENTIONED_AGENTS_BLOCK_OPEN = "[Agents mentioned in this message";
function stripOneLeadingNote(body) {
  const newlineIndex = body.indexOf("\n");
  const firstLine2 = (newlineIndex === -1 ? body : body.slice(0, newlineIndex)).trimEnd();
  if (SINGLE_LINE_NOTE_RES.some((re3) => re3.test(firstLine2))) {
    return newlineIndex === -1 ? "" : body.slice(newlineIndex + 1).trimStart();
  }
  if (newlineIndex === -1) return void 0;
  if (firstLine2.startsWith(MENTIONED_AGENTS_BLOCK_OPEN)) {
    const blockClose = body.match(/\n\][ \t]*(?:\n|$)/);
    if (blockClose?.index === void 0) return void 0;
    return body.slice(blockClose.index + blockClose[0].length).trimStart();
  }
  return void 0;
}
