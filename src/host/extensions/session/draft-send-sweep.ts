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
