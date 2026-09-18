init_errors();
var BoxRequestEntries = class {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  activeBoxRequest = null;
  trackBoxRequestEntry(entry) {
    if (entry.boxRequestId == null || entry.boxResolution != null) return;
    const session = this.tm.sessions.activeSession;
    if (session == null) return;
    const prior = this.activeBoxRequest;
    if (prior != null && prior.agentId === session.id) {
      void this.tm.resolveBoxRequestEntry(session.id, prior.requestId, "dismissed");
    }
    this.activeBoxRequest = {
      agentId: session.id,
      entryId: entry.id,
      requestId: entry.boxRequestId
    };
  }
  async resolveBoxRequestEntry(agentId, requestId2, resolution, options2) {
    if (this.activeBoxRequest?.requestId === requestId2) {
      this.activeBoxRequest = null;
    }
    const isBoxRequest = (current) => current.kind === "send-message" && current.boxRequestId === requestId2;
    const apply = (current) => {
      if (current.kind !== "send-message" || current.boxResolution != null) return current;
      return {
        ...current,
        boxResolution: resolution,
        ...options2?.wakeOutcomeUnseen === true ? { wakeOutcomeUnseen: true } : {}
      };
    };
    if (this.tm.sessions.isAgentGone(agentId)) return void 0;
    const liveSession = this.tm.sessions.activeSession?.id === agentId ? this.tm.sessions.activeSession : this.tm.sessions.liveSessions.get(agentId);
    let session;
    try {
      session = liveSession ?? await this.tm.sessionStore.openSession(agentId);
    } catch (error41) {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "transcript_manager",
        errorClass: errorLogTag(error41)
      });
      return void 0;
    }
    try {
      const target = session.db.getTranscriptEntries().find(isBoxRequest);
      if (target == null) return void 0;
      if (target.boxResolution != null) {
        return target.boxResolution === resolution ? target.id : void 0;
      }
      session.db.updateTranscriptEntry(target.id, apply);
      if (this.tm.sessions.activeSession?.id === agentId && this.tm.sessions.inMemoryTranscriptAgentId === agentId) {
        const updated = updateEntry(target.id, apply);
        if (updated != null) this.tm.roster.emit({ type: "updated", entry: updated });
      }
      return target.id;
    } finally {
      if (liveSession == null) {
        await session.agentStore.dispose();
        session.db.close();
      }
    }
  }
};
