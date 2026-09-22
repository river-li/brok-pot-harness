/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/server-agent-proxy/voice-call-server-receipt.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var VoiceCallReceiptPublishError = class extends Error {
  name = "VoiceCallReceiptPublishError";
};
function voiceCallReceiptCommit(record2, authored) {
  const entries = voiceCallHangupEntries(record2, authored);
  return {
    agentId: record2.agentId,
    generation: 0,
    entries: entries.map((entry, index) => ({
      seq: BigInt(index),
      entryKind: entry.kind,
      entryId: entry.id,
      body: new TextEncoder().encode(JSON.stringify(entry)),
      updatedSeq: BigInt(index)
    }))
  };
}
async function publishVoiceCallReceiptToServer(record2, commit, authored) {
  const payload = voiceCallReceiptCommit(record2, authored);
  if (payload.entries.length === 0) return;
  const result = await commit(payload);
  if (result.committedCount === payload.entries.length) return;
  throw new VoiceCallReceiptPublishError(
    `voice call ${record2.callId} was saved on the box but its hang-up receipt never reached the server transcript`
  );
}

