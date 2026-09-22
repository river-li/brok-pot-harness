/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/groups/group-chat.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var GROUP_CONFIG_VERSION = 1;
var GROUP_MAX_MEMBERS2 = 6;
var GROUP_MAX_MEMBER_TURNS = 10;
var GROUP_MAX_ROUNDS = 3;
var GROUP_PROMPT_HISTORY_LIMIT = 24;
var GROUP_MESSAGE_TEXT_MAX_LENGTH = 8e3;
var GROUP_MAX_MESSAGES_PER_TURN = 3;
var GROUP_WIND_DOWN_REMAINING_BUDGET = 2;
var GROUP_WIND_DOWN_NOTE = "The room is wrapping up this turn: reply only if it's essential, otherwise stay silent.";
var GROUP_MEMBER_TURN_MESSAGE_LIMIT_NOTICE = `Not delivered \u2014 you've reached this room turn's ${GROUP_MAX_MESSAGES_PER_TURN}-message limit. Consolidate, or wait for your next turn.`;
function orderRoundSpeakers(memberIds, round) {
  if (memberIds.length === 0) return [];
  const offset = (round % memberIds.length + memberIds.length) % memberIds.length;
  return [...memberIds.slice(offset), ...memberIds.slice(0, offset)];
}
var SandGroupNestingError = class extends Error {
  nestedGroupIds;
  constructor(nestedGroupIds) {
    super(
      `A group chat can only contain individual agents, not other group chats. Remove the group chat${nestedGroupIds.length === 1 ? "" : "s"} from the member list.`
    );
    this.name = "SandGroupNestingError";
    this.nestedGroupIds = [...nestedGroupIds];
  }
};
function assertMembersAreNotGroups(requestedMemberIds, isGroupId) {
  const nested = [...new Set(requestedMemberIds)].filter(isGroupId);
  if (nested.length > 0) throw new SandGroupNestingError(nested);
}
function memberMentionHandles(name17) {
  const lower = name17.trim().toLowerCase();
  if (lower.length === 0) return [];
  const handles = /* @__PURE__ */ new Set([lower, lower.replace(/\s+/g, "")]);
  const first = lower.split(/\s+/)[0];
  if (first != null && first.length > 0) handles.add(first);
  return [...handles];
}
var EVERYONE_MENTION = /(?:^|[^a-z0-9])@(everyone|all)\b/;
function isWordChar(char) {
  return char !== void 0 && /[a-z0-9]/.test(char);
}
function hasMentionAt(lower, handle) {
  const needle = `@${handle}`;
  let index = lower.indexOf(needle);
  while (index >= 0) {
    const before = lower[index - 1];
    const after = lower[index + needle.length];
    if (!isWordChar(before) && !isWordChar(after)) return true;
    index = lower.indexOf(needle, index + 1);
  }
  return false;
}
function parseGroupMentions(text2, members) {
  const lower = text2.toLowerCase();
  const isEveryone = EVERYONE_MENTION.test(lower);
  const memberIds = [];
  const seen = /* @__PURE__ */ new Set();
  for (const member of members) {
    if (seen.has(member.id)) continue;
    for (const handle of memberMentionHandles(member.name)) {
      if (hasMentionAt(lower, handle)) {
        memberIds.push(member.id);
        seen.add(member.id);
        break;
      }
    }
  }
  return { isEveryone, memberIds };
}
function resolveResponders(members, history) {
  let start = 0;
  for (let index = history.length - 1; index >= 0; index--) {
    if (history[index]?.speaker.kind === "user") {
      start = index;
      break;
    }
  }
  let isEveryone = false;
  const mentioned = /* @__PURE__ */ new Set();
  for (const message of history.slice(start)) {
    const targets = parseGroupMentions(message.content, members);
    if (targets.isEveryone) isEveryone = true;
    for (const id of targets.memberIds) mentioned.add(id);
  }
  if (isEveryone || mentioned.size === 0) return members;
  return members.filter((member) => mentioned.has(member.id));
}
function isPassContent(content) {
  const trimmed = content.trim();
  if (trimmed.length === 0) return true;
  return /^\(?\s*pass\s*\)?\.?$/i.test(trimmed);
}
var LEADING_PARENTHESIZED_PASS = /^\(\s*pass\s*\)[.!]?\s*(?:[-—–:;,]+\s*)?/i;
function stripLeadingPass(text2) {
  const trimmed = text2.trim();
  if (isPassContent(trimmed)) return "";
  const match2 = LEADING_PARENTHESIZED_PASS.exec(trimmed);
  if (match2 == null) return trimmed;
  const remainder = trimmed.slice(match2[0].length).trim();
  return /\w/.test(remainder) ? remainder : "";
}
function buildGroupRedriveNote() {
  return [
    "",
    "(Redelivery: your previous attempt at this turn was interrupted by a direct message to you. The room has NOT seen any reply from you for the messages above \u2014 anything you said or did while handling that direct message stayed in that private chat. If you already did the work, send the result to this room with SendToUser now; otherwise take the turn normally.)"
  ].join("\n");
}
function groupSpeakerLabel(speaker, viewerId) {
  if (speaker.kind === "user") {
    return speaker.name != null && speaker.name.length > 0 ? `${speaker.name} (user)` : "User";
  }
  const suffix = speaker.id === viewerId ? " (you)" : "";
  return `${speaker.name}${suffix}`;
}
function formatGroupLine(message, viewerId) {
  const replyNote = message.replyTo == null ? "" : `[in reply to ${groupSpeakerLabel(message.replyTo.speaker, viewerId)}: "${message.replyTo.quote}"] `;
  return `${groupSpeakerLabel(message.speaker, viewerId)}: ${replyNote}${message.content}`;
}
function formatGroupHistory(history, viewerId, limit = GROUP_PROMPT_HISTORY_LIMIT) {
  const recent = history.slice(-limit);
  if (recent.length === 0) return "(no messages yet)";
  return recent.map((message) => formatGroupLine(message, viewerId)).join("\n");
}
function groupDisplayName(group) {
  return group.name.trim().length > 0 ? group.name.trim() : "the group";
}
function formatGroupChatTag(group, peers) {
  const withClause = peers.length > 0 ? ` - with ${peers.map((peer) => peer.name).join(", ")}` : "";
  return `${GROUP_CHAT_TAG_PREFIX}"${groupDisplayName(group)}"${withClause}]`;
}
function messagesSinceMemberLastSpoke(history, memberId) {
  for (let index = history.length - 1; index >= 0; index--) {
    const speaker = history[index]?.speaker;
    if (speaker?.kind === "member" && speaker.id === memberId) {
      return history.slice(index + 1);
    }
  }
  return history;
}
function buildGroupTurnPrompt(args) {
  const { member, group, peers, newMessages, isWindingDown, isAttachmentOnlyTurn } = args;
  const lines2 = [formatGroupChatTag(group, peers)];
  const description9 = group.description.trim();
  if (description9.length > 0) lines2.push(`Room: ${description9}`);
  const describedPeers = peers.filter((peer) => peer.description.trim().length > 0);
  if (describedPeers.length > 0) {
    lines2.push(
      `Participants: ${describedPeers.map((peer) => `${peer.name} (${peer.description.trim()})`).join(", ")}`
    );
  }
  if (newMessages.length === 0) {
    lines2.push(
      isAttachmentOnlyTurn === true ? "The user shared attachments with the room." : "No new messages in the room since your last turn."
    );
  } else {
    lines2.push("New messages in the room (oldest first):");
    lines2.push(formatGroupHistory(newMessages, member.id));
  }
  lines2.push(
    "",
    `${GROUP_TURN_CLOSING_LINE_PREFIX}${member.name}. Reply in character with SendToUser if you have something worth adding; if you don't, end your turn without sending anything.`
  );
  if (isWindingDown === true) lines2.push(GROUP_WIND_DOWN_NOTE);
  return lines2.join("\n");
}

