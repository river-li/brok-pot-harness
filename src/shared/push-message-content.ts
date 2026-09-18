function getPushMessageContentFromTranscript(entries) {
  const mainEntries = getMainTranscriptEntries(entries);
  let last;
  let predecessorId;
  for (let i = mainEntries.length - 1; i >= 0; i--) {
    const entry = mainEntries[i];
    if (entry?.kind !== "send-message") continue;
    if (last === void 0) {
      last = entry;
      continue;
    }
    predecessorId = entry.id;
    break;
  }
  if (last === void 0 || predecessorId === void 0 || predecessorId === "") {
    return null;
  }
  return {
    v: 1,
    predecessorMessageId: predecessorId,
    message: toPushMessageEntry(last)
  };
}
function toPushMessageEntry(entry) {
  const author = toPushMessageAuthor(entry.author);
  return {
    kind: "send-message",
    id: entry.id,
    message: structuredClone(entry.message),
    ...author !== void 0 ? { author } : {},
    ...entry.replyTo !== void 0 && entry.replyTo !== "" ? { replyTo: entry.replyTo } : {},
    ...entry.batchId !== void 0 && entry.batchId !== "" ? { batchId: entry.batchId } : {},
    ...typeof entry.timestampMs === "number" && Number.isFinite(entry.timestampMs) ? { timestampMs: entry.timestampMs } : {}
  };
}
function toPushMessageAuthor(author) {
  if (author == null || author.id === "" || author.name === "") {
    return void 0;
  }
  if (author.kind === void 0) {
    return { id: author.id, name: author.name };
  }
  return { id: author.id, name: author.name, kind: author.kind };
}
