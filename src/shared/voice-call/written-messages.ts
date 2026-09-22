/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/voice-call/written-messages.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var VOICE_CALL_RECALL_PAGE_LIMIT = 256;
var VOICE_CALL_RECALL_MAX_PAGES = 16;
function typedInTheChat(entry) {
  if (entry.role !== "user" || entry.channel !== void 0 || entry.fromAgent !== void 0) {
    return null;
  }
  const text2 = entry.content.trim();
  return text2.length > 0 ? text2 : null;
}
var VoiceCallWrittenMessages = class _VoiceCallWrittenMessages {
  static ofTranscript(entries, limit = VOICE_CALL_SENT_MESSAGE_LIMIT) {
    const written = [];
    for (const entry of getChatTranscriptEntries(entries)) {
      if (entry.kind === "message") {
        const text3 = typedInTheChat(entry);
        if (text3 !== null) written.push({ id: entry.id, writer: "them", text: text3 });
        continue;
      }
      if (entry.kind !== "send-message") continue;
      const text2 = outlineSendMessageText(entry.message);
      if (text2 !== null) written.push({ id: entry.id, writer: "you", text: text2 });
    }
    return written.slice(-limit);
  }
  static fills(entries, limit) {
    return _VoiceCallWrittenMessages.ofTranscript(entries, limit).length >= limit;
  }
  static async recall(readTail, limit = VOICE_CALL_SENT_MESSAGE_LIMIT) {
    const collected = [];
    let beforeSeq;
    for (let page = 0; page < VOICE_CALL_RECALL_MAX_PAGES; page += 1) {
      const tail = await readTail({
        limit: VOICE_CALL_RECALL_PAGE_LIMIT,
        ...beforeSeq === void 0 ? {} : { beforeSeq }
      });
      collected.unshift(...tail.entries);
      beforeSeq = tail.nextBeforeSeq;
      if (beforeSeq === void 0 || _VoiceCallWrittenMessages.fills(collected, limit)) break;
    }
    return _VoiceCallWrittenMessages.ofTranscript(collected, limit);
  }
};

