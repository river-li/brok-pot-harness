/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/session/draft-send-sweep.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function sweepStrandedDraftSends(db, isInFlight) {
  const settledEntries = [];
  for (const entry of db.getTranscriptEntries()) {
    if (isInFlight?.(entry.id) === true) continue;
    const settled = settleSendingDraftEntry(entry, "unconfirmed");
    if (settled == null) continue;
    const written = db.updateTranscriptEntry(entry.id, () => settled, { durable: true });
    if (written == null) continue;
    settledEntries.push(written);
  }
  return settledEntries;
}

