/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/channels/slack-address.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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
  const parsed = parseChannelAddress(address);
  if (parsed === null) {
    return `"${address}" is not a valid channel address, so nothing was sent. An address is shaped platform:chat. ${SLACK_ADDRESS_SHAPES_LINE}`;
  }
  if (parsed.platform !== SLACK_PLATFORM) return void 0;
  try {
    parseSlackChatTarget(parsed.chat);
    return void 0;
  } catch (error3) {
    if (!(error3 instanceof SlackChatAddressError)) throw error3;
    return `"${address}" cannot be delivered (${error3.message}), so nothing was sent. ${SLACK_ADDRESS_SHAPES_LINE}`;
  }
}

