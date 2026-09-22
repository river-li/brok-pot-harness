/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/roster-projection.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_events2 = require("node:events");
init_scheduling();

// @recovered-fragment 2/2
var OUTLINE_STREAM_COALESCE_MS = 250;
var RosterProjection = class {
  constructor(tm) {
    this.tm = tm;
    this.rosterEmit = new RosterEmit(tm, this.emitter);
    this.profileWatch = new ProfileWatch(tm, this.emitter, this.rosterEmit);
    this.search = new RosterSearch(tm);
    this.lastKnownAgentNames = this.profileWatch.lastKnownAgentNames;
  }
  tm;
  emitter = new import_node_events2.EventEmitter();
  search;
  profileWatch;
  rosterEmit;
  lastKnownAgentNames;
  subagentWorkSources = /* @__PURE__ */ new Map();
  reportedSubagentParents = /* @__PURE__ */ new Set();
  lastRunnerAsyncTasks = /* @__PURE__ */ new Map();
  outline = [];
  outlineAgentId = null;
  streamingAssistantOutlineId;
  streamingThinkingOutlineId;
  activeOutlineLoad = null;
  activeOutlineGeneration = 0;
  pendingStreamOutlineUpdate = null;
  streamOutlineFlush = null;
  streamOutlineClock = realClock;
  lastStreamOutlineFlushAtMs = 0;
  setOutlineStreamCoalescing(policy, clock = realClock) {
    this.streamOutlineFlush?.dispose();
    this.streamOutlineFlush = policy.wrap(() => this.flushStreamOutlineUpdate());
    this.streamOutlineClock = clock;
    this.lastStreamOutlineFlushAtMs = clock.monotonicNow();
  }
  stopOutlineStreamCoalescing() {
    this.streamOutlineFlush?.dispose();
    this.streamOutlineFlush = null;
    this.pendingStreamOutlineUpdate = null;
  }
  flushStreamOutlineUpdate() {
    const pending = this.pendingStreamOutlineUpdate;
    if (pending == null) return;
    this.pendingStreamOutlineUpdate = null;
    this.lastStreamOutlineFlushAtMs = this.streamOutlineClock.monotonicNow();
    this.emitter.emit("outline", {
      type: "updated",
      agentId: pending.agentId,
      item: pending.item
    });
  }
  async listAgents() {
    const session = await this.tm.sessions.restoreSession();
    const announcedId = session == null ? void 0 : this.tm.sessions.getAnnouncedActiveAgentId() ?? session.id;
    const stamp = this.rosterEmit.reserveSnapshotStamp();
    const agents = this.rosterEmit.applySnapshotStamp(
      this.tm.runLifecycle.withRunStates(await this.tm.sessionStore.listAgents(announcedId)),
      stamp
    );
    await this.rosterEmit.seedRosterCache(agents);
    return agents;
  }
  async countAgentsOnDisk() {
    return (await this.tm.sessionStore.listAgents()).length;
  }
  searchAgents(...args) {
    return this.search.searchAgents(...args);
  }
  searchMedia(...args) {
    return this.search.searchMedia(...args);
  }
  listAgentsSync() {
    return this.rosterEmit.listAgentsSync();
  }
  replaceRosterCacheForTest(...args) {
    return this.rosterEmit.replaceRosterCacheForTest(...args);
  }
  subscribeAgents(listener) {
    this.emitter.on("agents", listener);
    return () => {
      this.emitter.off("agents", listener);
    };
  }
  subscribeAgentUpserted(listener) {
    this.emitter.on("agent-upserted", listener);
    return () => {
      this.emitter.off("agent-upserted", listener);
    };
  }
  emitProfileChanged(...args) {
    return this.profileWatch.emitProfileChanged(...args);
  }
  noteAgentIdentityRenamed(...args) {
    return this.profileWatch.noteAgentIdentityRenamed(...args);
  }
  noteHostWrittenAvatarVersion(...args) {
    return this.profileWatch.noteHostWrittenAvatarVersion(...args);
  }
  subscribeProfileChanged(...args) {
    return this.profileWatch.subscribeProfileChanged(...args);
  }
  watchSessionProfile(...args) {
    return this.profileWatch.watchSessionProfile(...args);
  }
  stopWatchingProfile(...args) {
    return this.profileWatch.stopWatchingProfile(...args);
  }
  getAgentDisplayProfile(...args) {
    return this.profileWatch.getAgentDisplayProfile(...args);
  }
  resolveAgentProfile(...args) {
    return this.profileWatch.resolveAgentProfile(...args);
  }
  emitAgents(...args) {
    return this.rosterEmit.emitAgents(...args);
  }
  emitAgentUpdate(...args) {
    return this.rosterEmit.emitAgentUpdate(...args);
  }
  emitsSettled() {
    return this.rosterEmit.settled();
  }
  reserveSnapshotStamp(...args) {
    return this.rosterEmit.reserveSnapshotStamp(...args);
  }
  finalizeSummaryForRpc(...args) {
    return this.rosterEmit.finalizeSummaryForRpc(...args);
  }
  subscribe(listener) {
    this.emitter.on("event", listener);
    return () => {
      this.emitter.off("event", listener);
    };
  }
  subscribeOutline(listener) {
    this.emitter.on("outline", listener);
    return () => {
      this.emitter.off("outline", listener);
    };
  }
  subscribeSubagents(listener) {
    this.emitter.on("subagents", listener);
    return () => {
      this.emitter.off("subagents", listener);
    };
  }
  subscribeAsyncTasks(listener) {
    this.emitter.on("async-tasks", listener);
    return () => {
      this.emitter.off("async-tasks", listener);
    };
  }
  async getSubagents(parentAgentId) {
    return this.tm.runnerRegistry.runners.get(parentAgentId)?.listSubagents() ?? [];
  }
  async getAsyncTasks(parentAgentId) {
    return this.mergedAsyncTasks(parentAgentId);
  }
  mergedAsyncTasks(parentAgentId) {
    if (this.tm.sessions.deletedAgentIds.has(parentAgentId)) return [];
    const cachedRunner = this.tm.runnerRegistry.runners.get(parentAgentId);
    const liveUnion = [...cachedRunner?.listAsyncTasks() ?? []];
    const seen = new Set(liveUnion.map((task) => `${task.kind}\0${task.id}`));
    for (const [runner, tasks] of this.lastRunnerAsyncTasks.get(parentAgentId) ?? []) {
      if (runner === cachedRunner) continue;
      for (const task of tasks) {
        const key = `${task.kind}\0${task.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        liveUnion.push(task);
      }
    }
    return mergeAsyncTasks(
      liveUnion,
      this.tm.pendingWakeStore?.listPending().filter((marker17) => marker17.agentId === parentAgentId) ?? []
    );
  }
  async getConversationOutline(agentId) {
    if (isSandSubagentId(agentId)) {
      let items2 = [];
      for (const runner of this.tm.runnerRegistry.runners.values()) {
        if (runner.hasSubagent(agentId)) {
          try {
            items2 = await runner.getSubagentOutline(agentId);
          } catch (error42) {
            reportFallback("roster_projection", error42);
            items2 = [];
          }
          break;
        }
      }
      this.emitOutline({ type: "snapshot", agentId, items: items2 });
      return items2;
    }
    const session = this.tm.sessions.activeSession ?? await this.tm.sessions.restoreSession();
    if (session?.id === agentId) {
      const generation = this.activeOutlineGeneration;
      const items2 = await this.loadActiveOutline(session);
      if (this.activeOutlineGeneration === generation) {
        this.emitOutline({ type: "snapshot", agentId, items: items2 });
      }
      return items2;
    }
    let items = [];
    try {
      items = await this.tm.sessionStore.getAgentOutline(agentId);
    } catch (error42) {
      reportFallback("roster_projection", error42);
      items = [];
    }
    this.emitOutline({ type: "snapshot", agentId, items });
    return items;
  }
  async loadActiveOutline(session) {
    if (this.outlineAgentId === session.id) {
      return this.activeOutlineLoad == null ? this.outline : await this.activeOutlineLoad;
    }
    this.outline = [];
    this.outlineAgentId = session.id;
    this.streamingAssistantOutlineId = void 0;
    this.streamingThinkingOutlineId = void 0;
    const generation = this.activeOutlineGeneration;
    const promise2 = (async () => {
      const items2 = await this.tm.sessionStore.getSessionOutline(session).then(
        (items3) => items3,
        () => []
      );
      if (this.activeOutlineGeneration === generation && this.tm.sessions.activeSession?.id === session.id && this.outlineAgentId === session.id) {
        this.outline = [...items2, ...this.outline];
        return this.outline;
      }
      return items2;
    })();
    this.activeOutlineLoad = promise2;
    const items = await promise2;
    if (this.activeOutlineLoad === promise2) this.activeOutlineLoad = null;
    return items;
  }
  invalidateActiveOutline() {
    this.flushStreamOutlineUpdate();
    this.activeOutlineGeneration += 1;
    this.activeOutlineLoad = null;
    this.outline = [];
    this.outlineAgentId = null;
    this.streamingAssistantOutlineId = void 0;
    this.streamingThinkingOutlineId = void 0;
  }
  appendOutlineItem(item) {
    this.outline = [...this.outline, item];
    if (this.outlineAgentId != null) {
      this.emitOutline({ type: "appended", agentId: this.outlineAgentId, item });
    }
  }
  updateOutlineItem(id, update, options2) {
    let updated = null;
    this.outline = this.outline.map((item) => {
      if (item.id !== id) return item;
      updated = update(item);
      return updated;
    });
    if (updated != null && this.outlineAgentId != null) {
      if (options2?.coalesce === true && this.streamOutlineFlush != null) {
        if (this.pendingStreamOutlineUpdate != null && this.pendingStreamOutlineUpdate.item.id !== id) {
          this.flushStreamOutlineUpdate();
        }
        this.pendingStreamOutlineUpdate = {
          agentId: this.outlineAgentId,
          item: updated
        };
        if (this.streamOutlineClock.monotonicNow() - this.lastStreamOutlineFlushAtMs >= OUTLINE_STREAM_COALESCE_MS) {
          this.flushStreamOutlineUpdate();
        } else {
          this.streamOutlineFlush();
        }
        return updated;
      }
      this.emitOutline({
        type: "updated",
        agentId: this.outlineAgentId,
        item: updated
      });
    }
    return updated;
  }
  applyAgentUpdateToOutline(update) {
    if (this.outlineAgentId == null) return;
    switch (update.type) {
      case "text-delta": {
        if (update.text.length === 0) return;
        this.streamingThinkingOutlineId = void 0;
        const existingId = this.streamingAssistantOutlineId;
        if (existingId != null) {
          const updated = this.updateOutlineItem(
            existingId,
            (item2) => item2.kind === "assistant-text" ? { ...item2, text: `${item2.text}${update.text}` } : item2,
            { coalesce: true }
          );
          if (updated != null) return;
        }
        const item = {
          kind: "assistant-text",
          id: crypto.randomUUID(),
          text: update.text
        };
        this.streamingAssistantOutlineId = item.id;
        this.appendOutlineItem(item);
        return;
      }
      case "thinking-delta": {
        if (update.text.length === 0) return;
        this.streamingAssistantOutlineId = void 0;
        const existingId = this.streamingThinkingOutlineId;
        if (existingId != null) {
          const updated = this.updateOutlineItem(
            existingId,
            (item2) => item2.kind === "thinking" ? { ...item2, text: `${item2.text}${update.text}` } : item2,
            { coalesce: true }
          );
          if (updated != null) return;
        }
        const item = {
          kind: "thinking",
          id: crypto.randomUUID(),
          text: update.text
        };
        this.streamingThinkingOutlineId = item.id;
        this.appendOutlineItem(item);
        return;
      }
      case "tool-call": {
        if (update.name === SEND_MESSAGE_TOOL_CALL_OUTLINE_NAME) return;
        this.streamingAssistantOutlineId = void 0;
        this.streamingThinkingOutlineId = void 0;
        const updated = this.updateOutlineItem(
          update.id,
          (item) => item.kind === "tool-call" ? {
            ...item,
            name: update.name,
            status: update.status,
            summary: update.summary ?? item.summary
          } : item
        );
        if (updated != null) return;
        this.appendOutlineItem({
          kind: "tool-call",
          id: update.id,
          name: update.name,
          status: update.status,
          summary: update.summary
        });
        return;
      }
      case "send-message": {
        this.streamingAssistantOutlineId = void 0;
        this.streamingThinkingOutlineId = void 0;
        this.appendOutlineItem({
          kind: "send-message",
          id: crypto.randomUUID(),
          message: update.message,
          timestampMs: update.timestampMs
        });
        return;
      }
      case "turn-ended": {
        this.streamingAssistantOutlineId = void 0;
        this.streamingThinkingOutlineId = void 0;
        return;
      }
      default:
        return;
    }
  }
  emit(event, owningAgentId) {
    this.emitter.emit("event", this.withOrderedStamp(this.withOwningAgentId(event, owningAgentId)));
  }
  withOrderedStamp(event) {
    const agentId = event.type === "snapshot" ? event.activeAgentId : event.agentId;
    if (agentId == null || agentId.length === 0) return event;
    const ordered = this.rosterEmit.replicaWriter.nextStamp(transcriptReplicaKey(agentId));
    if (event.type !== "snapshot") return { ...event, ordered };
    return {
      ...event,
      ordered,
      coverage: {
        kind: "transcript-live-range",
        fromSequence: 1,
        throughSequence: ordered.sequence
      }
    };
  }
  withOwningAgentId(event, owningAgentId) {
    if (event.type === "snapshot") return event;
    const agentId = owningAgentId ?? this.tm.sessions.inMemoryTranscriptAgentId;
    if (agentId == null || agentId.length === 0) return event;
    return { ...event, agentId };
  }
  emitOutline(event) {
    this.flushStreamOutlineUpdate();
    this.emitter.emit("outline", event);
  }
  emitAsyncTasks(runner, event) {
    if (this.tm.sessions.deletedAgentIds.has(event.parentAgentId)) return;
    const perRunner = this.lastRunnerAsyncTasks.get(event.parentAgentId) ?? /* @__PURE__ */ new Map();
    if (event.tasks.length === 0) {
      perRunner.delete(runner);
    } else {
      perRunner.set(runner, event.tasks);
    }
    if (perRunner.size === 0) {
      this.lastRunnerAsyncTasks.delete(event.parentAgentId);
    } else {
      this.lastRunnerAsyncTasks.set(event.parentAgentId, perRunner);
    }
    this.emitter.emit("async-tasks", {
      parentAgentId: event.parentAgentId,
      tasks: this.mergedAsyncTasks(event.parentAgentId)
    });
  }
  emitAsyncTasksForAgent(agentId) {
    this.emitter.emit("async-tasks", {
      parentAgentId: agentId,
      tasks: this.mergedAsyncTasks(agentId)
    });
  }
  emitSubagents(source, event) {
    const parentAgentId = event.parentAgentId;
    const sources = this.subagentWorkSources.get(parentAgentId) ?? /* @__PURE__ */ new Set();
    sources.add(source);
    this.subagentWorkSources.set(parentAgentId, sources);
    const hasRunningSubagent = this.liveSubagentParentIds().has(parentAgentId);
    const hadRunningSubagent = this.reportedSubagentParents.has(parentAgentId);
    if (hasRunningSubagent) {
      this.reportedSubagentParents.add(parentAgentId);
    } else {
      this.reportedSubagentParents.delete(parentAgentId);
    }
    try {
      this.emitter.emit("subagents", event);
    } catch (error42) {
      this.tm.productAnalytics.trackEvent("sand.subagent.fanout_failed", {
        agent_id: parentAgentId,
        error_type: error42 instanceof Error ? error42.name : "unknown"
      });
    }
    if (hasRunningSubagent === hadRunningSubagent) return;
    void this.emitAgentUpdate(parentAgentId);
  }
  liveSubagentParentIds() {
    const parents = /* @__PURE__ */ new Set();
    for (const [agentId, sources] of this.subagentWorkSources) {
      for (const source of sources) {
        if (source.hasRunningSubagents()) {
          parents.add(agentId);
        } else {
          sources.delete(source);
        }
      }
      if (sources.size === 0) this.subagentWorkSources.delete(agentId);
    }
    return parents;
  }
  forgetAgentSubagentWork(agentId) {
    this.subagentWorkSources.delete(agentId);
    this.reportedSubagentParents.delete(agentId);
  }
};

