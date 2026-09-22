/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/channels/inbound-entries.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function appendChannelInboundEntries(tm, session, seeds) {
  const isActive = session.id === tm.sessions.activeSession?.id;
  let raisesUserActivity = false;
  for (const seed of seeds) {
    const entries = isActive ? getTranscript() : session.db.getTranscriptEntries();
    const entry = {
      kind: "message",
      id: nextEntryId(entries, "user-message"),
      role: "user",
      content: seed.text,
      isStreaming: false,
      timestampMs: seed.timestampMs,
      channel: seed.channel,
      ...seed.sender !== void 0 ? { channelSender: seed.sender } : {}
    };
    raisesUserActivity ||= entryRaisesUserActivitySignal(entry);
    if (isActive) {
      tm.appendEntry(entry);
    } else {
      session.db.appendTranscriptEntry(entry);
    }
  }
  if (!isActive) {
    if (raisesUserActivity) tm.sessionStore.markSessionActivity(session);
    void tm.roster.emitAgentUpdate(session.id);
  }
}

