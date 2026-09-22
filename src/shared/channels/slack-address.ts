/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/channels/slack-address.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var SLACK_CHANNEL_ID_PATTERN = /^[CG][A-Z0-9]{2,}$/;
var SLACK_MEMBER_ID_PATTERN = /^[UW][A-Z0-9]{2,}$/;
var SLACK_IM_ID_PATTERN = /^D[A-Z0-9]{2,}$/;
var SLACK_ADDRESS_INVALID_ERROR = "not a Slack channel id, channel thread, person, or DM";
var SlackChatAddressError = class extends SandDomainError {
  name = "SlackChatAddressError";
  constructor() {
    super(SLACK_ADDRESS_INVALID_ERROR);
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
  if (separator === -1 && SLACK_CHANNEL_ID_PATTERN.test(chat)) {
    return { kind: "channel", channel: chat };
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
  } catch (error42) {
    if (!(error42 instanceof SlackChatAddressError)) throw error42;
    return `"${address}" cannot be delivered (${error42.message}), so nothing was sent. ${SLACK_ADDRESS_SHAPES_LINE}`;
  }
}

