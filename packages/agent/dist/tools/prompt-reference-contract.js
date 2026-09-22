/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/prompt-reference-contract.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto30 = require("node:crypto");
var PROMPT_REFERENCE_ID_LENGTH = 7;
var PROMPT_REFERENCE_ID_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var PROMPT_REFERENCE_ID_ALPHABET_LENGTH = PROMPT_REFERENCE_ID_ALPHABET.length;
var PROMPT_REFERENCE_ID_REGEX_SOURCE = `[A-Za-z0-9]{${PROMPT_REFERENCE_ID_LENGTH}}`;
var USER_MESSAGE_ID_TAG_TEXT_PREFIX = "<user_message_id>";
var USER_MESSAGE_ID_TAG_TEXT_SUFFIX = "</user_message_id>";
var TOOL_CALL_ID_TAG_TEXT_PREFIX = "<tool_call_id>";
var TOOL_CALL_ID_TAG_TEXT_SUFFIX = "</tool_call_id>";
var PROMPT_REFERENCE_ID_PATTERN = new RegExp(`^${PROMPT_REFERENCE_ID_REGEX_SOURCE}$`);
var LEADING_USER_MESSAGE_ID_TAG_PATTERN = new RegExp(`^${USER_MESSAGE_ID_TAG_TEXT_PREFIX}\\s*(${PROMPT_REFERENCE_ID_REGEX_SOURCE})\\s*${USER_MESSAGE_ID_TAG_TEXT_SUFFIX}\\n?`);
var LEADING_USER_MESSAGE_ID_TAG_LEGACY_PATTERN = new RegExp(`^${USER_MESSAGE_ID_TAG_TEXT_PREFIX}\\s*message_id=(${PROMPT_REFERENCE_ID_REGEX_SOURCE})\\s*${USER_MESSAGE_ID_TAG_TEXT_SUFFIX}\\n?`);
function createPromptReferenceIdFromMessageId(messageId) {
  const digest = (0, import_node_crypto30.createHash)("sha256").update(messageId).digest();
  let id = "";
  for (let i = 0; i < PROMPT_REFERENCE_ID_LENGTH; i++) {
    id += PROMPT_REFERENCE_ID_ALPHABET[digest[i] % PROMPT_REFERENCE_ID_ALPHABET_LENGTH];
  }
  return id;
}
function createPromptReferenceId(messageId) {
  const normalizedMessageId = messageId?.trim();
  if (normalizedMessageId !== void 0 && normalizedMessageId.length > 0) {
    return createPromptReferenceIdFromMessageId(normalizedMessageId);
  }
  let id = "";
  for (let i = 0; i < PROMPT_REFERENCE_ID_LENGTH; i++) {
    id += PROMPT_REFERENCE_ID_ALPHABET[(0, import_node_crypto30.randomInt)(0, PROMPT_REFERENCE_ID_ALPHABET_LENGTH)];
  }
  return id;
}
function isValidPromptReferenceId(id) {
  return PROMPT_REFERENCE_ID_PATTERN.test(id);
}
function renderUserMessageIdTag(id) {
  return `${USER_MESSAGE_ID_TAG_TEXT_PREFIX}${id}${USER_MESSAGE_ID_TAG_TEXT_SUFFIX}`;
}
function createToolCallReferenceId(toolCallId) {
  const normalizedToolCallId = toolCallId.trim();
  if (normalizedToolCallId.length === 0) {
    return "";
  }
  const separatorIndex = normalizedToolCallId.lastIndexOf("_");
  if (separatorIndex < 0) {
    return normalizedToolCallId;
  }
  const suffix = normalizedToolCallId.slice(separatorIndex + 1);
  if (suffix.length >= PROMPT_REFERENCE_ID_LENGTH) {
    const candidate = suffix.slice(0, PROMPT_REFERENCE_ID_LENGTH);
    if (isValidPromptReferenceId(candidate)) {
      return candidate;
    }
  }
  return normalizedToolCallId;
}
function renderToolCallIdTag(id) {
  return `${TOOL_CALL_ID_TAG_TEXT_PREFIX}${id}${TOOL_CALL_ID_TAG_TEXT_SUFFIX}`;
}
function parseLeadingUserMessageIdTag(text2) {
  const match2 = LEADING_USER_MESSAGE_ID_TAG_PATTERN.exec(text2) ?? LEADING_USER_MESSAGE_ID_TAG_LEGACY_PATTERN.exec(text2);
  if (match2 === null) {
    return void 0;
  }
  return {
    id: match2[1],
    strippedText: text2.slice(match2[0].length)
  };
}

