init_zod();
var SAND_REACT_TO_MESSAGE_TOOL_NAME = "ReactToMessage";
var REACT_TO_MESSAGE_DESCRIPTION_LEAD = "React to one of the USER's messages with a single emoji tapback (like an iMessage reaction), attributed to you and shown as a small pill on their message.";
var REACT_TO_MESSAGE_DESCRIPTION_TAIL = "It toggles: reacting the same emoji to the same message again removes your reaction, which is how you take one back. Fire-and-forget: it doesn't end your turn and returns nothing to act on.";
var REACT_TO_MESSAGE_DESCRIPTION_CONTROL = `${REACT_TO_MESSAGE_DESCRIPTION_LEAD} Use this VERY sparingly, only when a reaction is the genuinely natural, human response and a reply would be overkill: they said something funny, shared good news, or a quick \u{1F44D} fits better than a sentence. It is NOT a substitute for a real reply when they asked you for something, and you never react just to seem friendly. Only react to the user's own messages (their [t3u]-style address), never your own sends. ${REACT_TO_MESSAGE_DESCRIPTION_TAIL} Mirror the user. If they don't use emoji, basically never do this.`;
var REACT_TO_MESSAGE_DESCRIPTION_ACTIVE = `${REACT_TO_MESSAGE_DESCRIPTION_LEAD} This is part of your everyday voice, the way people in a chat tap a reaction instead of typing an acknowledgement: use it when they thank you, agree, or wrap up (\u{1F44D}, \u2764\uFE0F), share good news (\u{1F389}), say something funny (\u{1F602}), or when a small request is done and the outcome is already in front of them (\u2705 on their request beats a \u201CDone!\u201D message). In those moments a lone reaction is a complete turn; don't follow it with a message saying the same thing. It is NOT a substitute for a real reply when they are waiting on an answer, result, or link. Those still go in SendToUser, with a reaction alongside if it fits. At most one reaction per message, never on your own sends, and hold back when the conversation is formal, tense, or the user is frustrated. Only react to the user's own messages (their [t3u]-style address). ${REACT_TO_MESSAGE_DESCRIPTION_TAIL}`;
var reactToMessageParameters = external_exports.object({
  message_address: external_exports.string().trim().min(1).describe(
    "The address of the USER message to react to, the [t3u]-style tag shown on their message. Only the user's own messages, never your own sends."
  ),
  emoji: external_exports.string().trim().min(1).max(16).describe("A single common emoji to react with, e.g. \u{1F44D}, \u2764\uFE0F, \u{1F602}, \u{1F389}.")
});
function createReactToMessageTool(deps) {
  return defineCommunicateTool(deps, {
    id: "SEND_TO_USER",
    name: SAND_REACT_TO_MESSAGE_TOOL_NAME,
    description: () => deps.activeReactions?.() === true ? REACT_TO_MESSAGE_DESCRIPTION_ACTIVE : REACT_TO_MESSAGE_DESCRIPTION_CONTROL,
    parameters: reactToMessageParameters,
    execute: async (_ctx, args, d) => {
      const address = args.message_address.trim();
      if (!isMessageAddress(address)) {
        return `"${address}" isn't a valid message address. React with the [t3u]-style tag shown on the user's message.`;
      }
      const emoji3 = args.emoji.trim();
      d.react({ messageAddress: address, emoji: emoji3 });
      return `Reacted ${emoji3} on ${address}. (Reactions toggle: react the same emoji again to take it back.)`;
    }
  });
}
