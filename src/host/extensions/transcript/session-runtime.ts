var import_node_path156 = require("node:path");
init_dist3();
init_errors();
function readActivationGap(db, shippedThroughId) {
  return shippedThroughId == null ? db.getTranscriptEntries() : db.getTranscriptEntriesAfter(shippedThroughId);
}
var AgentGoneError = class extends SandDomainError {
  name = "AgentGoneError";
  constructor(agentId) {
    super(`Bot ${agentId} no longer exists`);
  }
};
function isAgentAbsent(error42) {
  return error42 instanceof AgentGoneError || chainCarriesMarker(error42, "isAgentMissing");
}
var SessionRuntime = class {
  constructor(tm, windowedActivationDefer) {
    this.tm = tm;
    this.windowedActivationDefer = windowedActivationDefer;
  }
  tm;
  windowedActivationDefer;
  activeSession;
  loaded = false;
  isWindowFocused = false;
  windowFocusedAtMs = null;
  inMemoryTranscriptAgentId = null;
  liveSessions = /* @__PURE__ */ new Map();
  pendingSessionOpens = /* @__PURE__ */ new Map();
  deletedAgentIds = /* @__PURE__ */ new Set();
  windowedActivationTail = Promise.resolve();
  windowedActivationAbort = null;
  pendingActivationAgentId = null;
  activationPinCounts = /* @__PURE__ */ new Map();
  deferredRetirementSessions = /* @__PURE__ */ new Set();
  deferSessionRetirementWhileActivating(session) {
    if (!this.activationPinCounts.has(session)) return false;
    this.deferredRetirementSessions.add(session);
    return true;
  }
  pinSessionActivation(session) {
    this.activationPinCounts.set(session, (this.activationPinCounts.get(session) ?? 0) + 1);
    return {
      [Symbol.dispose]: () => {
        const remaining = (this.activationPinCounts.get(session) ?? 1) - 1;
        if (remaining === 0) {
          this.activationPinCounts.delete(session);
          if (this.deferredRetirementSessions.delete(session)) {
            void this.tm.runLifecycle.retireSession(session);
          }
        } else {
          this.activationPinCounts.set(session, remaining);
        }
      }
    };
  }
  async settledOpen(pending) {
    if (pending == null) return void 0;
    const [settled] = await Promise.allSettled([pending]);
    return settled.status === "fulfilled" ? settled.value : void 0;
  }
  invalidateDeferredActivation() {
    this.windowedActivationAbort?.abort();
    this.windowedActivationAbort = null;
    this.pendingActivationAgentId = null;
  }
  clearPendingActivationClaim(owner) {
    if (this.windowedActivationAbort === owner) this.pendingActivationAgentId = null;
  }
  getActiveAgentDir() {
    const session = this.activeSession;
    return session == null ? void 0 : (0, import_node_path156.dirname)(session.dbPath);
  }
  async ensureLoaded() {
    const session = await this.restoreSession();
    if (session == null) {
      if (!this.loaded) {
        this.loaded = true;
        this.tm.roster.emit({ type: "cleared" });
      }
      return [];
    }
    if (!this.loaded) {
      const entries = await this.tm.sessionStore.getTranscriptEntries(session);
      this.setActiveTranscript(session.id, entries);
      this.loaded = true;
      this.tm.roster.emit({ type: "snapshot", activeAgentId: session.id, entries });
      return entries;
    }
    return getTranscript();
  }
  getEntries() {
    return getTranscript();
  }
  appendEntry(rawEntry, options2) {
    const entry = withTimestampMs(rawEntry);
    appendEntry(entry);
    if (options2?.persistBeforeEmit === true) {
      const isDurable = this.activeSession?.db.appendTranscriptEntry(entry) ?? false;
      try {
        options2.onPersistOutcome?.(isDurable);
      } catch {
      }
      if (options2.deferEmit !== true) this.tm.roster.emit({ type: "appended", entry });
    } else {
      this.tm.roster.emit({ type: "appended", entry });
      this.activeSession?.db.appendTranscriptEntry(entry);
    }
    if ((entry.kind === "send-message" || entry.kind === "message" || entry.kind === "user-attachment") && entryRaisesUserActivitySignal(entry) && this.activeSession != null) {
      this.markActiveSessionArrival(this.activeSession, {
        incrementsUnread: entryRaisesUnreadSignal(entry)
      });
    }
    return entry;
  }
  markActiveSessionArrival(session, options2 = {}) {
    const now = Date.now();
    this.tm.sessionStore.markSessionActivity(session, {
      at: now,
      ...options2
    });
    if (this.isWindowFocused) {
      this.tm.sessionStore.markSessionViewedNow(session, now, {
        preserveManualUnread: true
      });
    } else {
      void this.tm.roster.emitAgentUpdate(session.id);
    }
  }
  async setWindowFocused(isFocused) {
    const wasFocused = this.isWindowFocused;
    this.isWindowFocused = isFocused;
    this.windowFocusedAtMs = isFocused ? Date.now() : null;
    if (!isFocused || wasFocused) return;
    const active = this.activeSession;
    if (active == null) return;
    const unread = active.db.getUnreadState();
    if (unread.isManuallyUnread || unread.lastUnreadActivityAt <= unread.lastViewedAt) {
      return;
    }
    await this.tm.sessionStore.markSessionViewed(active, Date.now(), {
      preserveManualUnread: true
    });
    void this.tm.roster.emitAgentUpdate(active.id);
  }
  setActiveTranscript(agentId, entries) {
    setTranscript(entries);
    this.inMemoryTranscriptAgentId = agentId;
  }
  mirrorActiveTranscript(session) {
    setTranscriptSource(() => session.db.getTranscriptEntries());
    this.inMemoryTranscriptAgentId = session.id;
  }
  clearActiveTranscript(agentId) {
    clearTranscript();
    this.inMemoryTranscriptAgentId = agentId;
  }
  getActiveAgentId() {
    return this.activeSession?.id ?? null;
  }
  getAnnouncedActiveAgentId() {
    return this.pendingActivationAgentId ?? this.getActiveAgentId();
  }
  getWindowFocusedAtMs() {
    return this.windowFocusedAtMs;
  }
  noteDesktopContact() {
    if (!this.isWindowFocused) return;
    this.windowFocusedAtMs = Date.now();
  }
  async switchAgent(agentId) {
    const current = this.activeSession;
    if (current?.id === agentId) {
      await this.reannounceAfterRedirect(agentId);
      return getTranscript();
    }
    const previousAgentId = this.announcedAgentId();
    this.invalidateDeferredActivation();
    const { session } = await this.activateSession(agentId, current, Date.now(), "full");
    const entries = getTranscript();
    this.tm.roster.emit({ type: "snapshot", activeAgentId: session.id, entries });
    await this.announceActivation({ agentId: session.id, previousAgentId });
    return entries;
  }
  announceRemoteActivation(agentId) {
    const previousAgentId = this.announcedAgentId();
    this.invalidateDeferredActivation();
    this.pendingActivationAgentId = agentId;
    if (previousAgentId === agentId) return Promise.resolve();
    const at2 = Date.now();
    this.markSessionLeftBehind(this.activeSession, at2);
    this.tm.sessionStore.markAgentViewed(agentId, at2);
    return this.announceActivation({ agentId, previousAgentId });
  }
  announcedAgentId() {
    return this.getAnnouncedActiveAgentId() ?? void 0;
  }
  async reannounceAfterRedirect(agentId) {
    const previousAgentId = this.announcedAgentId();
    this.invalidateDeferredActivation();
    if (previousAgentId === void 0 || previousAgentId === agentId) return;
    await this.announceActivation({ agentId, previousAgentId });
  }
  async activateSession(agentId, current, viewedAt, mirror2, deferred) {
    var _stack = [];
    try {
      let nextSession = this.resolveLiveSession(agentId) ?? await this.openSessionOnce(agentId);
      const _activationPin = __using(_stack, this.pinSessionActivation(nextSession));
      if (deferred?.isSuperseded() === true) return void 0;
      this.markSessionLeftBehind(current, viewedAt);
      await this.tm.sessionStore.markSessionViewed(nextSession, viewedAt);
      if (deferred?.isSuperseded() === true) return void 0;
      while (this.isSessionStale(nextSession)) {
        await this.forgetSettledOpen(agentId, nextSession);
        nextSession = this.resolveLiveSession(agentId) ?? await this.openSessionOnce(agentId);
        if (deferred?.isSuperseded() === true) return void 0;
        await this.tm.sessionStore.markSessionViewed(nextSession, viewedAt);
        if (deferred?.isSuperseded() === true) return void 0;
      }
      const unread = nextSession.db.getUnreadState();
      if (unread.isManuallyUnread || unread.lastUnreadActivityAt > unread.lastViewedAt) {
        this.tm.sessionStore.markSessionViewedNow(nextSession);
      }
      const gap = deferred == null ? [] : readActivationGap(nextSession.db, deferred.shippedThroughId);
      if (mirror2 === "full") {
        this.setActiveTranscript(nextSession.id, nextSession.db.getTranscriptEntries());
      } else {
        this.mirrorActiveTranscript(nextSession);
      }
      this.loaded = true;
      await this.replaceSession(nextSession);
      return { session: nextSession, gap };
    } catch (_2) {
      var _error = _2, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  isSessionStale(session) {
    return this.tm.runLifecycle.isSessionRetiring(session) || !session.db.isOpen;
  }
  resolveLiveSession(agentId) {
    const live = this.liveSessions.get(agentId);
    if (live == null) return void 0;
    if (!this.isSessionStale(live)) return live;
    void this.tm.runLifecycle.retireSession(live);
    return void 0;
  }
  markSessionLeftBehind(current, at2) {
    if (current == null || !this.isWindowFocused) return;
    this.tm.sessionStore.markSessionViewedNow(current, at2, { preserveManualUnread: true });
  }
  announceActivation(roles) {
    const flushed = this.tm.roster.emitAgentUpdate(roles.agentId);
    if (roles.previousAgentId != null && roles.previousAgentId !== roles.agentId) {
      void this.tm.roster.emitAgentUpdate(roles.previousAgentId);
    }
    return flushed;
  }
  async openAgentWindowed(agentId, limit) {
    return this.openAgentBounded(
      agentId,
      (db) => db.getTranscriptWindow({ limit }),
      () => this.getAgentTranscriptWindow(agentId, { limit })
    );
  }
  async openAgentTail(agentId, limit) {
    return this.openAgentBounded(
      agentId,
      (db) => db.getTranscriptTail({ limit }),
      () => this.getAgentTranscriptTail(agentId, { limit })
    );
  }
  async openAgentBounded(agentId, readLive, readCold) {
    const live = this.resolveLiveSession(agentId);
    if (this.activeSession?.id === agentId && live !== void 0) {
      const reply3 = readLive(live.db);
      await this.reannounceAfterRedirect(agentId);
      return reply3;
    }
    const current = this.activeSession;
    const previousAgentId = this.announcedAgentId();
    if (live !== void 0) {
      this.invalidateDeferredActivation();
      const reply3 = readLive(live.db);
      const activated = await this.activateSession(agentId, current, Date.now(), "deferred", {
        isSuperseded: () => this.tm.disposed,
        shippedThroughId: reply3.entries.at(-1)?.id
      });
      if (activated === void 0) return reply3;
      this.emitActivationGap(activated.gap);
      await this.announceActivation({ agentId, previousAgentId });
      return reply3;
    }
    const reply2 = readCold();
    const openedAt = Date.now();
    this.markSessionLeftBehind(current, openedAt);
    this.tm.sessionStore.markAgentViewed(agentId, openedAt);
    const outgoingRowShipped = this.announceActivation({ agentId, previousAgentId });
    this.scheduleWindowedActivation(
      agentId,
      reply2.entries.at(-1)?.id,
      openedAt,
      outgoingRowShipped
    );
    return reply2;
  }
  scheduleWindowedActivation(agentId, shippedThroughId, openedAt, outgoingRowShipped) {
    this.invalidateDeferredActivation();
    const abort = new AbortController();
    this.windowedActivationAbort = abort;
    this.pendingActivationAgentId = agentId;
    const { signal } = abort;
    const isSuperseded = () => signal.aborted || this.tm.disposed;
    this.windowedActivationTail = this.windowedActivationTail.then(async () => {
      await this.windowedActivationDefer.settled();
      await outgoingRowShipped;
      if (isSuperseded()) {
        this.clearPendingActivationClaim(abort);
        return;
      }
      const current = this.activeSession;
      const activated = await this.activateSession(agentId, current, openedAt, "deferred", {
        isSuperseded,
        shippedThroughId
      });
      this.clearPendingActivationClaim(abort);
      if (activated === void 0) return;
      this.emitActivationGap(activated.gap);
      await this.announceActivation({ agentId, previousAgentId: current?.id });
    }).catch((error42) => {
      this.clearPendingActivationClaim(abort);
      this.tm.hostLog(
        `[sand] windowed background activation failed for ${agentId}: ${errorLogTag(error42)}`,
        "error"
      );
    });
  }
  emitActivationGap(gap) {
    for (const entry of gap) {
      this.tm.roster.emit({ type: "appended", entry });
    }
  }
  getAgentTranscriptWindow(agentId, query) {
    return this.resolveLiveSession(agentId)?.db.getTranscriptWindow(query) ?? this.tm.sessionStore.readAgentTranscriptWindow(agentId, query);
  }
  getAgentTranscriptTail(agentId, query) {
    return this.resolveLiveSession(agentId)?.db.getTranscriptTail(query) ?? this.tm.sessionStore.readAgentTranscriptTail(agentId, query);
  }
  getAgentThread(agentId, rootId) {
    return this.resolveLiveSession(agentId)?.db.getThread(rootId) ?? this.tm.sessionStore.readAgentThread(agentId, rootId);
  }
  async ensureActionTarget(agentId) {
    if (agentId == null || this.activeSession?.id === agentId) return;
    await this.tm.switchAgent(agentId);
  }
  async getAgentTranscript(agentId) {
    if (this.activeSession?.id === agentId && this.inMemoryTranscriptAgentId === agentId) {
      return getTranscript();
    }
    return this.tm.sessionStore.getAgentTranscriptEntries(agentId);
  }
  getAgentTranscriptPage(agentId, query) {
    return this.resolveLiveSession(agentId)?.db.getTranscriptPage(query) ?? this.tm.sessionStore.readAgentTranscriptPage(agentId, query);
  }
  async resolveBackgroundSession(agentId) {
    if (this.isAgentGone(agentId)) throw new AgentGoneError(agentId);
    let session = this.resolveLiveSession(agentId) ?? await this.openSessionOnce(agentId);
    while (this.isSessionStale(session)) {
      if (this.isAgentGone(agentId)) throw new AgentGoneError(agentId);
      await this.forgetSettledOpen(agentId, session);
      session = this.resolveLiveSession(agentId) ?? await this.openSessionOnce(agentId);
    }
    void this.holdVendedSessionThroughCallerTurn(session);
    return session;
  }
  async holdVendedSessionThroughCallerTurn(session) {
    const pin = this.pinSessionActivation(session);
    await delay2(0);
    pin[Symbol.dispose]();
  }
  async forgetSettledOpen(agentId, stale) {
    const pending = this.pendingSessionOpens.get(agentId);
    if (pending == null || await this.settledOpen(pending) !== stale) return;
    if (this.pendingSessionOpens.get(agentId) === pending) {
      this.pendingSessionOpens.delete(agentId);
    }
  }
  openSessionOnce(agentId) {
    const pending = this.pendingSessionOpens.get(agentId);
    if (pending != null) return pending;
    const open9 = this.tm.sessionStore.openSession(agentId).catch((error42) => {
      if (this.pendingSessionOpens.get(agentId) === open9) {
        this.pendingSessionOpens.delete(agentId);
      }
      throw error42;
    });
    this.pendingSessionOpens.set(agentId, open9);
    return open9;
  }
  async restoreSession() {
    if (this.activeSession != null) return this.activeSession;
    const agents = await this.tm.sessionStore.listAgents();
    const recordIds = await this.tm.sessionStore.listAgentRecordIds();
    const persistedId = this.tm.sessionStore.readActiveAgentId();
    const isPersistedRestorable = persistedId != null && (agents.some((a) => a.id === persistedId) || recordIds.includes(persistedId));
    const ranked = [
      ...isPersistedRestorable ? [persistedId] : [],
      ...agents.map((a) => a.id),
      ...recordIds
    ];
    const orderedIds = [...new Set(ranked)];
    for (const id of orderedIds) {
      try {
        const session = await this.openSessionOnce(id);
        await this.tm.sessionStore.markSessionViewed(session);
        this.setActiveSession(session);
        this.tm.runLifecycle.watchActiveSession(session);
        return session;
      } catch (error42) {
        this.tm.hostLog(
          `[sand] skipping unopenable agent ${id} on boot: ${errorLogTag(error42)}`,
          "error"
        );
      }
    }
    return null;
  }
  async ensureSession() {
    const restored = await this.restoreSession();
    if (restored != null) return restored;
    const session = await this.tm.sessionStore.createFallbackSession();
    await this.tm.sessionStore.markSessionViewed(session);
    this.setActiveSession(session);
    this.tm.runLifecycle.watchActiveSession(session);
    return session;
  }
  clearActiveSession() {
    if (this.activeSession != null) this.tm.roster.invalidateActiveOutline();
    this.activeSession = void 0;
    this.tm.sessionStore.writeActiveAgentId("");
  }
  setActiveSession(session) {
    const previous = this.activeSession;
    if (previous != null && previous.id !== session.id) {
      void this.tm.automationRuntime.enqueueAutomationLifecycleMutation({
        agentId: previous.id,
        mutation: () => {
          if (this.deletedAgentIds.has(previous.id) || !this.tm.sessionStore.agentExists(previous.id)) {
            this.tm.automationRuntime.lastKnownAutomations.delete(previous.id);
            return;
          }
          const current = previous.automations.listDefinitions();
          this.tm.automationRuntime.recordInactiveAutomationChanges({
            agentId: previous.id,
            before: current,
            after: current,
            source: "agent"
          });
        }
      });
    }
    if (previous?.id !== session.id) {
      this.tm.roster.invalidateActiveOutline();
    }
    this.activeSession = session;
    this.liveSessions.set(session.id, session);
    this.tm.sessionStore.writeActiveAgentId(session.id);
  }
  isAgentGone(agentId) {
    return this.deletedAgentIds.has(agentId) || !this.tm.sessionStore.agentExists(agentId);
  }
  async replaceSession(session) {
    const previous = this.activeSession;
    this.setActiveSession(session);
    this.tm.runLifecycle.watchActiveSession(session);
    await this.tm.runLifecycle.retireSession(previous);
  }
};
