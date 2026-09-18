function isSameRosterRow(cached2, next) {
  const { snapshotEpoch: _cachedEpoch, snapshotSeq: _cachedSeq, ...cachedRow } = cached2;
  const { snapshotEpoch: _nextEpoch, snapshotSeq: _nextSeq, ...nextRow } = next;
  return areJsonValuesEqual(cachedRow, nextRow);
}
var RosterEmit = class {
  constructor(tm, emitter) {
    this.tm = tm;
    this.emitter = emitter;
  }
  tm;
  emitter;
  cachedAgentSummaries = [];
  lastEmittedActiveAgentId = null;
  snapshotEpoch = crypto.randomUUID();
  snapshotSeq = 0;
  replicaWriter = new HostReplicaWriter(this.snapshotEpoch);
  rosterCacheSeeded = false;
  emitChain = Promise.resolve();
  pendingFullEmit = false;
  pendingDeltaAgentIds = /* @__PURE__ */ new Set();
  pendingEmitFlush = null;
  enqueueEmit(work) {
    const run = this.emitChain.then(work, work);
    this.emitChain = run.then(
      () => void 0,
      () => void 0
    );
    return run;
  }
  settled() {
    const parked2 = this.pendingEmitFlush;
    if (parked2 == null) return this.emitChain;
    const chain = () => this.emitChain;
    return parked2.then(chain, chain);
  }
  listAgentsSync() {
    return this.cachedAgentSummaries;
  }
  seedRosterCache(agents) {
    return this.enqueueEmit(async () => {
      if (this.rosterCacheSeeded) return;
      this.cachedAgentSummaries = agents;
      this.rosterCacheSeeded = true;
    });
  }
  replaceRosterCacheForTest(agents) {
    return this.enqueueEmit(async () => {
      this.cachedAgentSummaries = agents;
      this.rosterCacheSeeded = true;
    });
  }
  emitAgents() {
    this.pendingFullEmit = true;
    return this.scheduleCoalescedEmit();
  }
  scheduleCoalescedEmit() {
    const scheduled = this.pendingEmitFlush;
    if (scheduled != null) return scheduled;
    const flush = (async () => {
      await this.tm.taskBoundary.settled();
      await this.enqueueEmit(async () => {
        this.pendingEmitFlush = null;
        const full = this.pendingFullEmit;
        const agentIds = [...this.pendingDeltaAgentIds];
        this.pendingFullEmit = false;
        this.pendingDeltaAgentIds.clear();
        try {
          if (full) {
            await this.runEmitAgents();
            return;
          }
          const pendingSiblingAgentIds = new Set(agentIds);
          for (const agentId of agentIds) {
            pendingSiblingAgentIds.delete(agentId);
            const outcome = await this.runEmitAgentUpdate(agentId, pendingSiblingAgentIds);
            if (outcome === "full") return;
          }
        } catch (error41) {
          this.tm.hostLog(
            `[transcript-manager] coalesced roster emit failed: ${errorLogTag(error41)}`,
            "error"
          );
        }
      });
    })();
    this.pendingEmitFlush = flush;
    return flush;
  }
  reserveSnapshotStamp() {
    return {
      snapshotEpoch: this.snapshotEpoch,
      snapshotSeq: ++this.snapshotSeq
    };
  }
  applySnapshotStamp(agents, stamp) {
    return agents.map((agent) => ({ ...agent, ...stamp }));
  }
  finalizeSummaryForRpc(summary, stamp) {
    const [finalized] = this.applySnapshotStamp(
      this.tm.runLifecycle.withRunStates([summary]),
      stamp
    );
    return finalized ?? summary;
  }
  async runEmitAgents() {
    if (this.tm.disposed) return;
    const session = await this.tm.sessions.restoreSession();
    const announcedId = session == null ? this.tm.sessions.getAnnouncedActiveAgentId() ?? "" : this.tm.sessions.getAnnouncedActiveAgentId() ?? session.id;
    const stamp = this.reserveSnapshotStamp();
    const agents = this.applySnapshotStamp(
      this.tm.runLifecycle.withRunStates(
        await this.tm.sessionStore.listAgents(session == null ? void 0 : announcedId)
      ),
      stamp
    );
    this.cachedAgentSummaries = agents;
    this.rosterCacheSeeded = true;
    const activeAgentId = announcedId;
    this.lastEmittedActiveAgentId = activeAgentId;
    this.emitter.emit("agents", {
      activeAgentId,
      agents,
      ordered: this.replicaWriter.nextStamp(ROSTER_REPLICA_KEY),
      coverage: { kind: "complete-roster" }
    });
  }
  async buildAgentSummary(agentId) {
    const activeId = this.tm.sessions.activeSession?.id;
    const announcedId = this.tm.sessions.getAnnouncedActiveAgentId() ?? void 0;
    const live = activeId === agentId ? this.tm.sessions.activeSession : this.tm.sessions.liveSessions.get(agentId) ?? null;
    let summary = null;
    if (live != null) {
      try {
        summary = await this.tm.sessionStore.summarizeSession(live, announcedId);
      } catch (error41) {
        reportFallback("roster_emit", error41);
        summary = null;
      }
    }
    if (summary == null) {
      summary = await this.tm.sessionStore.summarizeAgentById(agentId, announcedId);
    }
    if (summary == null) return null;
    return this.tm.runLifecycle.withRunStates([summary])[0] ?? summary;
  }
  emitAgentUpdate(agentId) {
    this.pendingDeltaAgentIds.add(agentId);
    return this.scheduleCoalescedEmit();
  }
  async runEmitAgentUpdate(agentId, pendingSiblingAgentIds) {
    if (this.tm.disposed) return "failed";
    try {
      if (!this.rosterCacheSeeded) {
        await this.runEmitAgents();
        return "full";
      }
      const session = this.tm.sessions.activeSession ?? await this.tm.sessions.restoreSession();
      if (session == null) {
        await this.runEmitAgents();
        return "full";
      }
      const stamp = this.reserveSnapshotStamp();
      const summary = await this.buildAgentSummary(agentId);
      if (summary == null) {
        await this.runEmitAgents();
        return "full";
      }
      const patched = upsertAgentSummary(this.cachedAgentSummaries, summary);
      const reconciled = this.tm.runLifecycle.withRunStates(patched);
      const siblingRunFlagChanged = reconciled.some(
        (agent, index) => agent.id !== agentId && !pendingSiblingAgentIds.has(agent.id) && agent !== patched[index]
      );
      if (siblingRunFlagChanged) {
        await this.runEmitAgents();
        return "full";
      }
      const next = reconciled.find((agent) => agent.id === agentId) ?? summary;
      const activeAgentId = this.tm.sessions.getAnnouncedActiveAgentId() ?? session.id;
      const cached2 = this.cachedAgentSummaries.find((agent) => agent.id === agentId);
      if (cached2 != null && activeAgentId === this.lastEmittedActiveAgentId && isSameRosterRow(cached2, next)) {
        return "unchanged";
      }
      const [stamped] = this.applySnapshotStamp([next], stamp);
      const emitted = stamped ?? summary;
      this.cachedAgentSummaries = upsertAgentSummary(this.cachedAgentSummaries, emitted);
      this.lastEmittedActiveAgentId = activeAgentId;
      this.emitter.emit("agent-upserted", {
        activeAgentId,
        agent: emitted,
        ordered: this.replicaWriter.nextStamp(ROSTER_REPLICA_KEY)
      });
      return "delta";
    } catch (error41) {
      this.tm.hostLog(
        `[transcript-manager] incremental emit failed for ${agentId}; falling back to full emit: ${errorLogTag(error41)}`,
        "error"
      );
      try {
        await this.runEmitAgents();
        return "full";
      } catch (error42) {
        reportFallback("roster_emit", error42);
        return "failed";
      }
    }
  }
};
