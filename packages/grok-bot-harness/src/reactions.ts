function isUserMessageEntry(entry) {
  if (entry.kind === "message") return entry.role === "user";
  return entry.kind === "user-attachment";
}
function toggleReaction(reactions, emoji3, by, stamp) {
  const current = reactions ?? [];
  const hasReaction = current.some((reaction) => reaction.emoji === emoji3 && reaction.by === by);
  const next = hasReaction ? current.filter((reaction) => !(reaction.emoji === emoji3 && reaction.by === by)) : [...current, { emoji: emoji3, by, ...stamp === void 0 ? {} : { name: stamp.name } }];
  return next.length > 0 ? next : void 0;
}
function quotableEntryText(entry) {
  if (entry.kind === "message") return entry.content;
  if (entry.kind === "send-message" && entry.message.type === "text") return entry.message.content;
  if (entry.kind === "send-message" && entry.message.type === "widget") {
    const prompt = entry.message.widget.prompt;
    return typeof prompt === "string" ? prompt : "";
  }
  return "";
}
function describeMessageQuote(entry, maxChars) {
  const normalized = quotableEntryText(entry).replace(/\s+/g, " ").trim();
  if (normalized.length === 0) return entry.id;
  return maxChars != null && normalized.length > maxChars ? `${normalized.slice(0, maxChars)}\u2026` : normalized;
}
function describeReactedMessageQuote(entry) {
  return describeMessageQuote(entry, 80);
}
function describeRepliedMessageQuote(entry) {
  return describeMessageQuote(entry);
}
function buildReactionWakePrompt({
  entry,
  emoji: emoji3
}) {
  if (isUserMessageEntry(entry) || entry.reactions?.some(
    (reaction) => reaction.emoji === emoji3 && reaction.by === SAND_REACTION_SELF
  )) {
    return void 0;
  }
  return `[The user reacted ${emoji3} to your message: "${describeReactedMessageQuote(entry)}". You don't need to reply; act on it only if it's useful (e.g. acknowledge, adjust, or continue).]`;
}
