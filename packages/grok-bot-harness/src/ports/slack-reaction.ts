var SLACK_CONVERSATION_ID_PATTERN = /^[CGD][A-Z0-9]{2,}$/;
var SLACK_MESSAGE_TS_PATTERN = /^\d+\.\d+$/;
var SLACK_EMOJI_NAME_PATTERN = /^[a-z0-9_+\-]+(::skin-tone-[2-6])?$/;
function normalizeSlackEmojiName(raw) {
  const trimmed = raw.trim().toLowerCase();
  const body = trimmed.startsWith(":") && trimmed.endsWith(":") && trimmed.length > 2 ? trimmed.slice(1, -1) : trimmed;
  return SLACK_EMOJI_NAME_PATTERN.test(body) ? body : void 0;
}
