function voiceCallReceiptEntry(record2, authored) {
  const description10 = authored === void 0 ? void 0 : SandVoiceCallReceipt.parse(authored);
  return {
    kind: "voice-call",
    id: `voice-call-${record2.callId}`,
    timestampMs: record2.endedAtMs,
    call: {
      ...SandVoiceCallRecords.summarize(record2),
      ...description10 === void 0 ? {} : { description: description10 }
    },
    ...record2.harnessMayCollect === true ? { conversation: SandVoiceCallRecords.conversation(record2) } : {}
  };
}
function voiceCallHangupEntries(record2, authored) {
  if (SandVoiceCallReceipt.isNoOp(record2)) return [];
  return [voiceCallReceiptEntry(record2, authored)];
}
function applyVoiceCallCardCopy(entry, authored) {
  if (entry.kind !== "voice-call" || authored === void 0) return entry;
  if (entry.call.description !== void 0) return entry;
  const description10 = SandVoiceCallReceipt.parse(authored);
  if (description10 === void 0) return entry;
  return { ...entry, call: { ...entry.call, description: description10 } };
}
