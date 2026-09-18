init_errors();
var SLACK_MEMBER_ID_PATTERN = /^[UW][A-Z0-9]{2,}$/;
var SLACK_IM_ID_PATTERN = /^D[A-Z0-9]{2,}$/;
var SLACK_ADDRESS_MISSING_THREAD_TS_ERROR = "Slack channel address is missing its thread timestamp";
var SlackChatAddressError = class extends SandDomainError {
  name = "SlackChatAddressError";
  constructor() {
    super(SLACK_ADDRESS_MISSING_THREAD_TS_ERROR);
  }
};
function parseSlackChatTarget(chat) {
  const separator = chat.indexOf(":");
  if (separator > 0 && separator < chat.length - 1) {
    return {
      kind: "thread",
      channel: chat.slice(0, separator),
      threadTs: chat.slice(separator + 1)
    };
  }
  if (separator === -1 && SLACK_MEMBER_ID_PATTERN.test(chat)) {
    return { kind: "member_dm", memberId: chat };
  }
  if (separator === -1 && SLACK_IM_ID_PATTERN.test(chat)) {
    return { kind: "im", channel: chat };
  }
  throw new SlackChatAddressError();
}
function describeChannelAddressProblem(address) {
  const parsed2 = parseChannelAddress(address);
  if (parsed2 === null) {
    return `"${address}" is not a valid channel address, so nothing was sent. An address is shaped platform:chat. ${SLACK_ADDRESS_SHAPES_LINE}`;
  }
  if (parsed2.platform !== SLACK_PLATFORM) return void 0;
  try {
    parseSlackChatTarget(parsed2.chat);
    return void 0;
  } catch (error41) {
    if (!(error41 instanceof SlackChatAddressError)) throw error41;
    return `"${address}" cannot be delivered (${error41.message}), so nothing was sent. ${SLACK_ADDRESS_SHAPES_LINE}`;
  }
}
