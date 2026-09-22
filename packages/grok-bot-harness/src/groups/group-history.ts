/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/groups/group-history.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function groupReplyTarget(entriesById, replyToId) {
  const target = replyToId == null ? void 0 : entriesById.get(replyToId);
  if (target == null) return void 0;
  let speaker;
  let rawQuote;
  if (target.kind === "message" && target.role === "user") {
    speaker = {
      kind: "user",
      ...target.fromUser?.name != null ? { name: target.fromUser.name } : {}
    };
    rawQuote = target.content;
  } else if (target.kind === "send-message" && target.message.type === "text" && target.author != null) {
    speaker = { kind: "member", id: target.author.id, name: target.author.name };
    rawQuote = target.message.content;
  } else {
    return void 0;
  }
  const quote2 = rawQuote.replace(/\s+/g, " ").trim().slice(0, GROUP_MESSAGE_TEXT_MAX_LENGTH);
  return quote2.length === 0 ? void 0 : { speaker, quote: quote2 };
}
function groupHistoryFromTranscriptEntries(entries) {
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const messages2 = [];
  for (const entry of entries) {
    if (entry.kind === "message" && entry.role === "user" && entry.content.trim().length > 0) {
      const replyTo = groupReplyTarget(entriesById, entry.replyTo);
      messages2.push({
        speaker: {
          kind: "user",
          ...entry.fromUser?.name != null ? { name: entry.fromUser.name } : {}
        },
        content: entry.content,
        ...replyTo != null ? { replyTo } : {}
      });
      continue;
    }
    if (entry.kind === "send-message" && entry.message.type === "text" && entry.author != null && entry.streaming !== true) {
      const replyTo = groupReplyTarget(entriesById, entry.replyTo);
      messages2.push({
        speaker: {
          kind: "member",
          id: entry.author.id,
          name: entry.author.name
        },
        content: entry.message.content,
        ...replyTo != null ? { replyTo } : {}
      });
    }
  }
  return messages2;
}

