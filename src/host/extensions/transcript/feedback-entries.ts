/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/feedback-entries.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function endsOnPlainAgentReply(entries) {
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (entry == null || entry.kind === "tool-call") continue;
    return entry.kind === "send-message" && entry.message.type === "text" && (entry.message.channel == null || entry.message.channel.length === 0) && entry.author == null && entry.branched !== true && entry.streaming !== true && entry.boxRequestId == null;
  }
  return false;
}
var FeedbackEntries = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  async appendFeedbackPrompt(args) {
    const session = this.tm.sessions.activeSession;
    if (session == null || session.id !== args.agentId) return null;
    const entry = {
      id: `fb-${args.requestId}`,
      kind: "feedback",
      requestId: args.requestId,
      state: "prompt",
      timestampMs: Date.now()
    };
    if (findEntry(entry.id) !== void 0) return null;
    this.tm.appendEntry(entry);
    return entry.id;
  }
  async setFeedbackVote(args) {
    await this.tm.sessions.ensureActionTarget(args.agentId);
    const before = findEntry(args.entryId);
    if (before == null || before.kind !== "feedback") return null;
    const withVote = (entry) => {
      if (entry.kind !== "feedback") return entry;
      const { sentiment: _omit, ...rest } = entry;
      return {
        ...rest,
        state: args.state,
        ...args.sentiment != null ? { sentiment: args.sentiment } : {}
      };
    };
    const updated = updateEntry(args.entryId, withVote);
    if (updated == null || updated.kind !== "feedback") return null;
    this.tm.roster.emit({ type: "updated", entry: updated });
    this.tm.sessions.activeSession?.db.updateTranscriptEntry(args.entryId, withVote);
    return updated;
  }
};

