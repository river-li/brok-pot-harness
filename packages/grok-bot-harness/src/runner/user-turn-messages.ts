/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/user-turn-messages.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function resolveUserMessageId({
  id,
  transcriptMessageId
}) {
  return transcriptMessageId ?? (isOffRecordMessageId(id) ? id : `${SAND_OFF_RECORD_MESSAGE_ID_PREFIX}${id}`);
}

