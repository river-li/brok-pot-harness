var BOOT_TURN = "b";
function nextEntryId(entries, kind) {
  const existingIds = new Set(entries.map((entry) => entry.id));
  const userMessageCount = countUserMessages(entries);
  if (kind === "user-message") {
    return firstUnusedId(existingIds, (turn2) => `t${turn2}u`, userMessageCount);
  }
  if (kind === "user-attachment") {
    return firstUnusedId(
      existingIds,
      (index) => `t${userMessageCount}ua${index}`,
      countTrailingUserAttachments(entries)
    );
  }
  const turn = userMessageCount === 0 ? BOOT_TURN : userMessageCount - 1;
  if (kind === "assistant-message") {
    return firstUnusedId(
      existingIds,
      (index) => `t${turn}a${index}`,
      countTrailingAssistantMessages(entries)
    );
  }
  return firstUnusedId(
    existingIds,
    (index) => `t${turn}s${index}`,
    countTrailingSendMessages(entries)
  );
}
function firstUnusedId(existingIds, mint2, startIndex) {
  let index = startIndex;
  let id = mint2(index);
  while (existingIds.has(id)) {
    id = mint2(++index);
  }
  return id;
}
function countUserMessages(entries) {
  let count = 0;
  for (const entry of entries) {
    if (entry.kind === "message" && entry.role === "user") count++;
  }
  return count;
}
function countTrailingUserAttachments(entries) {
  let count = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (entry == null) continue;
    if (entry.kind === "message" && entry.role === "user") break;
    if (entry.kind === "user-attachment") count++;
  }
  return count;
}
function countTrailingAssistantMessages(entries) {
  let count = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (entry == null) continue;
    if (entry.kind === "message" && entry.role === "user") break;
    if (entry.kind === "message" && entry.role === "assistant") count++;
  }
  return count;
}
function countTrailingSendMessages(entries) {
  let count = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (entry == null) continue;
    if (entry.kind === "message" && entry.role === "user") break;
    if (entry.kind === "send-message") count++;
  }
  return count;
}
