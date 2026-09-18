init_errors();
init_invariant();
var SERVER_AGENT_ACTIVITY_GATE_RECHECK_MS = 6e4;
var SERVER_AGENT_ACTIVITY_DEFAULT_STALE_MS = 9e4;
function computerActionEventOf(action) {
  if (action.type !== "click" && action.type !== "move" && action.type !== "scroll" && action.type !== "drag") {
    return null;
  }
  if (!Number.isFinite(action.x) || !Number.isFinite(action.y)) return null;
  return {
    agentId: action.agentId,
    type: action.type,
    x: action.x,
    y: action.y,
    ...action.button.length > 0 ? { button: action.button } : {},
    ...action.count > 0 ? { count: action.count } : {}
  };
}
var IDLE_LIVE = {
  isRunning: false,
  isRunningTurn: false,
  isComposingMessage: false,
  isRetrying: false,
  awaitingUserResponse: null
};
function isSessionIdle(live) {
  return !live.isRunning && live.awaitingUserResponse === null && live.boxHandoff === void 0;
}
function compareSessionIds([left], [right]) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}
function mergeSessionLiveOverlays(sessions) {
  if (sessions.size === 0) return null;
  let primary = null;
  let isRunningTurn = false;
  let awaitingUserResponse = null;
  let boxHandoff;
  const runningSessionIds = [];
  const groupTurns = [];
  for (const [sessionId, { live }] of [...sessions].sort(compareSessionIds)) {
    const roomId = grokBotGroupChatRoomIdOf(sessionId);
    if (roomId !== void 0) {
      if (live.isRunning) {
        groupTurns.push({
          roomId,
          isComposingMessage: live.isComposingMessage,
          ...live.currentActivity === void 0 ? {} : { currentActivity: live.currentActivity }
        });
      }
      continue;
    }
    if (live.isRunning) {
      runningSessionIds.push(sessionId);
      primary ??= live;
      isRunningTurn ||= liveOverlayRunningTurn(live);
    }
    awaitingUserResponse ??= live.awaitingUserResponse;
    boxHandoff ??= live.boxHandoff;
  }
  return {
    ...primary ?? IDLE_LIVE,
    isRunningTurn,
    awaitingUserResponse,
    ...boxHandoff === void 0 ? {} : { boxHandoff },
    ...runningSessionIds.length === 0 ? {} : { runningSessionIds },
    ...groupTurns.length === 0 ? {} : { groupTurns }
  };
}
function activityOf(state) {
  const activity = state.activity;
  if (activity === void 0) return void 0;
  if (activity.kind !== "thinking" && activity.kind !== "tool") return void 0;
  return {
    kind: activity.kind,
    ...activity.tool.length > 0 ? { tool: activity.tool } : {},
    ...activity.detail.length > 0 ? { detail: activity.detail } : {},
    ...activity.target.length > 0 ? { target: activity.target } : {},
    ...activity.callId.length > 0 ? { callId: activity.callId } : {}
  };
}
function liveOverlayOf(state) {
  const activity = state.isRunning ? activityOf(state) : void 0;
  const awaiting = state.awaiting;
  return {
    isRunning: state.isRunning || state.hasRunningSubagents,
    isRunningTurn: state.isRunning,
    isComposingMessage: state.isRunning && state.isComposingMessage,
    isRetrying: state.isRunning && state.isRetrying,
    ...activity === void 0 ? {} : { currentActivity: activity },
    ...state.isRunning && state.activeGroupMemberId ? { activeGroupMemberId: state.activeGroupMemberId } : {},
    ...state.boxHandoffRequestId ? {
      boxHandoff: {
        requestId: state.boxHandoffRequestId,
        instruction: state.boxHandoffInstruction ?? ""
      }
    } : {},
    awaitingUserResponse: awaiting === void 0 ? null : {
      tabId: awaiting.tabId,
      reason: awaiting.reason,
      since: Number(awaiting.sinceMs)
    }
  };
}
function clientOverlayOf(state) {
  return {
    hasUnread: state.unreadCount > 0,
    unreadCount: state.unreadCount,
    ...state.lastViewedAtMs === void 0 ? {} : { lastViewedAt: Number(state.lastViewedAtMs) },
    ...state.lastActivityAtMs === void 0 ? {} : { lastActivityAt: Number(state.lastActivityAtMs) },
    ...state.lastEntryId === void 0 || state.lastEntryId.length === 0 ? {} : { newestEntryId: state.lastEntryId },
    ...state.lastMessageId === void 0 || state.lastMessageId.length === 0 ? {} : { lastMessageId: state.lastMessageId },
    ...state.lastMessagePreview === void 0 || state.lastMessagePreview.length === 0 ? {} : { lastMessagePreview: state.lastMessagePreview },
    isHiddenFromSidebar: state.hiddenFromSidebar
  };
}
function isIdle(state) {
  if (state.client !== null) return false;
  for (const [sessionId, session] of state.sessions) {
    if (grokBotGroupChatRoomIdOf(sessionId) !== void 0) {
      if (session.live.isRunning) return false;
    } else if (!isSessionIdle(session.live)) {
      return false;
    }
  }
  return true;
}
function createServerAgentActivity(deps) {
  const clock = deps.clock ?? realClock;
  const agents = /* @__PURE__ */ new Map();
  let gate = null;
  let gateRecheck = null;
  let stopped2 = false;
  let emitting = false;
  const shouldEmit = (agentId) => emitting && deps.isLegacySourceActive?.() !== false || deps.requiresServer?.({ agentId }) === true;
  const queue = [];
  const stateFor = (agentId) => {
    let state = agents.get(agentId);
    if (state === void 0) {
      state = { sessions: /* @__PURE__ */ new Map(), client: null };
      agents.set(agentId, state);
    }
    return state;
  };
  const clearStaleTimers = (state) => {
    for (const session of state.sessions.values()) {
      session.staleTimer?.dispose();
      session.staleTimer = null;
    }
  };
  const publish = (agentId) => {
    const state = agents.get(agentId);
    if (state === void 0) return;
    if (isIdle(state)) {
      clearStaleTimers(state);
      agents.delete(agentId);
      if (shouldEmit(agentId)) deps.emit({ agentId, live: null, client: null });
      return;
    }
    if (shouldEmit(agentId)) {
      deps.emit({ agentId, live: mergeSessionLiveOverlays(state.sessions), client: state.client });
    }
  };
  const settleStale = (agentId, sessionId, session) => {
    session.staleTimer = null;
    if (agents.get(agentId)?.sessions.get(sessionId) !== session || !session.live.isRunning) {
      return;
    }
    session.live = {
      ...IDLE_LIVE,
      awaitingUserResponse: session.live.awaitingUserResponse,
      ...session.live.boxHandoff === void 0 ? {} : { boxHandoff: session.live.boxHandoff }
    };
    publish(agentId);
  };
  const armStale = (agentId, sessionId, session, staleInMs) => {
    session.staleTimer?.dispose();
    session.staleTimer = null;
    if (!session.live.isRunning) return;
    if (staleInMs <= 0) {
      settleStale(agentId, sessionId, session);
      return;
    }
    session.staleTimer = clock.schedule(staleInMs, () => settleStale(agentId, sessionId, session));
  };
  const applyLive = (live) => {
    const state = stateFor(live.agentId);
    const sessionId = normalizeGrokBotSessionId(live.sessionId);
    const previous = state.sessions.get(sessionId);
    previous?.staleTimer?.dispose();
    state.sessions.delete(sessionId);
    const session = { live: liveOverlayOf(live), staleTimer: null };
    state.sessions.set(sessionId, session);
    const staleAfterMs = Number(live.staleAfterMs);
    const ttlMs = staleAfterMs > 0 ? staleAfterMs : SERVER_AGENT_ACTIVITY_DEFAULT_STALE_MS;
    const updatedAtMs = Number(live.updatedAtMs);
    const elapsedMs3 = updatedAtMs > 0 ? Math.max(0, clock.now() - updatedAtMs) : 0;
    armStale(live.agentId, sessionId, session, ttlMs - elapsedMs3);
    return live.agentId;
  };
  const applyClient = (client) => {
    const state = stateFor(client.agentId);
    state.client = clientOverlayOf(client);
    return client.agentId;
  };
  const applyFrame = (frame) => {
    const touched = /* @__PURE__ */ new Set();
    if (frame.snapshot) {
      for (const [agentId, state] of agents) {
        clearStaleTimers(state);
        state.sessions.clear();
        state.client = null;
        touched.add(agentId);
      }
    }
    for (const live of frame.live) touched.add(applyLive(live));
    for (const client of frame.client) touched.add(applyClient(client));
    for (const agentId of touched) publish(agentId);
  };
  const withdrawAll = () => {
    for (const agentId of agents.keys()) {
      if (shouldEmit(agentId)) deps.emit({ agentId, live: null, client: null });
    }
  };
  const clearAll = () => {
    withdrawAll();
    for (const state of agents.values()) clearStaleTimers(state);
    agents.clear();
  };
  const setEmitting = (enabled) => {
    if (enabled === emitting) return;
    if (!enabled) {
      for (const agentId of agents.keys()) {
        if (deps.requiresServer?.({ agentId }) !== true) {
          deps.emit({ agentId, live: null, client: null });
        }
      }
    }
    emitting = enabled;
    if (enabled) for (const agentId of agents.keys()) publish(agentId);
  };
  const scheduleGateRecheck = () => {
    gateRecheck?.dispose();
    gateRecheck = null;
    if (stopped2 || emitting || agents.size === 0) return;
    gateRecheck = clock.schedule(SERVER_AGENT_ACTIVITY_GATE_RECHECK_MS, () => {
      gateRecheck = null;
      void drain();
    });
  };
  const gateCheck = createSingleFlight({
    read: async () => await deps.isEnabled().then((enabled) => {
      gate = { enabled, checkedAt: clock.now() };
    }).catch((error41) => {
      deps.log(`server agent activity gate read failed: ${errorLogTag(error41)}`);
      gate = { enabled: false, checkedAt: clock.now() };
    }),
    install: () => {
    }
  });
  const resolveGate = async () => {
    const now = clock.now();
    if (gate !== null && now - gate.checkedAt < SERVER_AGENT_ACTIVITY_GATE_RECHECK_MS) {
      return gate.enabled;
    }
    await gateCheck.run();
    invariant(gate !== null, "activity gate read must install its result");
    return gate.enabled;
  };
  let draining = false;
  const drain = async () => {
    if (draining) return;
    draining = true;
    try {
      do {
        const enabled = await resolveGate();
        if (stopped2) return;
        setEmitting(enabled);
        const next = queue.shift();
        if (next === void 0) continue;
        if (next.kind === "state") {
          applyFrame(next.frame);
          continue;
        }
        for (const action of next.frame.actions) {
          if (!shouldEmit(action.agentId) && !isSandSubagentId(action.agentId)) continue;
          const event = computerActionEventOf(action);
          if (event !== null) deps.emitComputerAction?.(event);
        }
      } while (queue.length > 0 && !stopped2);
      scheduleGateRecheck();
    } finally {
      draining = false;
    }
  };
  return {
    ingest(frame) {
      if (stopped2) return;
      if (frame.snapshot) queue.length = 0;
      queue.push({ kind: "state", frame });
      void drain();
    },
    ingestComputerActions(frame) {
      if (stopped2) return;
      queue.push({ kind: "actions", frame });
      void drain();
    },
    setSourceActive(active) {
      if (stopped2 || active) return;
      queue.length = 0;
      for (const [agentId, state] of agents) {
        if (deps.requiresServer?.({ agentId }) === true) continue;
        if (emitting) deps.emit({ agentId, live: null, client: null });
        clearStaleTimers(state);
        agents.delete(agentId);
      }
    },
    snapshot() {
      const out = /* @__PURE__ */ new Map();
      for (const [agentId, state] of agents) {
        if (!shouldEmit(agentId)) continue;
        out.set(agentId, {
          agentId,
          live: mergeSessionLiveOverlays(state.sessions),
          client: state.client
        });
      }
      return out;
    },
    refresh() {
      if (stopped2) return;
      for (const agentId of agents.keys()) {
        if (deps.requiresServer?.({ agentId }) === true) publish(agentId);
      }
    },
    stop() {
      if (stopped2) return;
      queue.length = 0;
      gateRecheck?.dispose();
      gateRecheck = null;
      clearAll();
      stopped2 = true;
    }
  };
}
