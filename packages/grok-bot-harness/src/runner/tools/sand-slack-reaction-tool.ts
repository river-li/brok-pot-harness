/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-slack-reaction-tool.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
var SAND_REACT_TO_SLACK_MESSAGE_TOOL_NAME = "react_to_slack_message";
var reactToSlackMessageParameters = external_exports.object({
  channel: external_exports.string().trim().regex(SLACK_CONVERSATION_ID_PATTERN, "a Slack conversation id like C0123ABCD").describe(
    "The Slack conversation id the message is in (C\u2026, G\u2026 or D\u2026), as shown in the slack:<channel>:<ts> address of the thread or in a Slack read tool's output. Not a channel name."
  ),
  message_ts: external_exports.string().trim().regex(SLACK_MESSAGE_TS_PATTERN, "a Slack message ts like 1789569774.220229").describe(
    "The ts of the exact message to react to, e.g. 1789569774.220229. Read the thread first to get the ts of a specific reply; a thread's own address ends in the ts of its root message."
  ),
  emoji: external_exports.string().trim().min(1).max(64).describe(
    "The emoji shortcode, with or without colons: +1, eyes, white_check_mark, or a workspace custom emoji such as boo_thumbsdown. One emoji per call."
  )
});
function createReactToSlackMessageTool(reaction) {
  return defineCommunicateTool(reaction, {
    id: "PLATFORM_ACTION",
    name: SAND_REACT_TO_SLACK_MESSAGE_TOOL_NAME,
    description: "Add an emoji reaction to a Slack message as yourself \u2014 your own Slack app's bot user, the same identity your Slack replies carry. This is how you acknowledge, approve, or flag a message in Slack without posting text, and it works in every channel your Slack app is in, including Slack Connect channels shared with other companies. Prefer it over any connector tool named slack_add_reaction: that one reacts as a person's Slack account, not as you, and Slack refuses it in Slack Connect channels. Pass the conversation id and the message ts exactly as Slack shows them. Reacting with an emoji that is already on the message from you is a no-op. A reaction never carries an answer: when someone is waiting on a result, send it with SendToUser as well.",
    parameters: reactToSlackMessageParameters,
    describeActivity: (args) => ({ detail: args.emoji.trim(), target: args.channel.trim() }),
    execute: async (_ctx, args, slack) => {
      const emoji3 = normalizeSlackEmojiName(args.emoji);
      if (emoji3 === void 0) {
        throw new SandToolInputError(
          `"${args.emoji.trim()}" is not a Slack emoji shortcode. Pass the name Slack shows between colons, e.g. +1 or boo_thumbsdown, not a Unicode emoji.`
        );
      }
      const outcome = await slack.react({
        channel: args.channel.trim(),
        messageTs: args.message_ts.trim(),
        emoji: emoji3
      });
      return outcome.ok ? outcome.detail : `Not reacted \u2014 ${outcome.reason}`;
    }
  });
}

