/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/groups/room-member-prompts.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ROOM_TURN_MESSAGE_LIMIT = 24;
var ROOM_TURN_TEXT_MAX_LENGTH = GROUP_MESSAGE_TEXT_MAX_LENGTH;
function toRoomTurnSpeaker(speaker, memberId) {
  if (speaker.kind === "user") {
    return {
      speakerKind: "human",
      speakerName: speaker.name != null && speaker.name.length > 0 ? clampLine(speaker.name, 120) : "User"
    };
  }
  return {
    speakerKind: "agent",
    speakerName: clampLine(speaker.name, 120),
    ...speaker.id === memberId ? { isSelf: true } : {}
  };
}
function fromRoomTurnSpeaker(message, selfMemberId) {
  const name17 = clampLine(message.speakerName, 120);
  if (message.speakerKind === "human") return { kind: "user", name: name17 };
  return {
    kind: "member",
    id: message.isSelf === true ? selfMemberId : `peer:${message.speakerName}`,
    name: name17
  };
}
function toRoomTurnMessages(history, memberId) {
  return history.slice(-ROOM_TURN_MESSAGE_LIMIT).map((message) => {
    const quote2 = message.replyTo == null ? "" : clampBlock(message.replyTo.quote, ROOM_TURN_TEXT_MAX_LENGTH);
    return {
      ...toRoomTurnSpeaker(message.speaker, memberId),
      text: clampBlock(message.content, ROOM_TURN_TEXT_MAX_LENGTH),
      ...message.replyTo != null && quote2.length > 0 ? { replyTo: { ...toRoomTurnSpeaker(message.replyTo.speaker, memberId), quote: quote2 } } : {}
    };
  });
}
function fromRoomTurnMessages(messages2, selfMemberId) {
  return messages2.slice(0, ROOM_TURN_MESSAGE_LIMIT).map((message) => {
    const quote2 = message.replyTo == null ? "" : clampBlock(message.replyTo.quote, ROOM_TURN_TEXT_MAX_LENGTH);
    return {
      speaker: fromRoomTurnSpeaker(message, selfMemberId),
      content: clampBlock(message.text, ROOM_TURN_TEXT_MAX_LENGTH),
      ...message.replyTo != null && quote2.length > 0 ? { replyTo: { speaker: fromRoomTurnSpeaker(message.replyTo, selfMemberId), quote: quote2 } } : {}
    };
  });
}

