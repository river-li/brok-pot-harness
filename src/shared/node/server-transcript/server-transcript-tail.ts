var SERVER_TRANSCRIPT_TAIL_MAX_CURSORS = 256;
var SERVER_TRANSCRIPT_TAIL_INLINE_BODY_MAX_BYTES = 256 * 1024;
var SERVER_TRANSCRIPT_TAIL_DISABLED_RECHECK_MS = 6e4;
var SERVER_TRANSCRIPT_TAIL_GATE_RECHECK_MS = 6e4;
var SERVER_TRANSCRIPT_TAIL_EVICT_IDLE_MS = 10 * 6e4;
var SERVER_TRANSCRIPT_TAIL_CLEAN_RECONNECT_MIN_MS = 500;
var SERVER_TRANSCRIPT_TAIL_CLEAN_RECONNECT_MAX_MS = 3e3;
var SERVER_TRANSCRIPT_TAIL_RETRY_INITIAL_MS = 1e3;
var SERVER_TRANSCRIPT_TAIL_RETRY_MAX_MS = 6e4;
var SERVER_TRANSCRIPT_TAIL_REHYDRATE_LIMIT = 500;
var SERVER_TRANSCRIPT_TAIL_BODY_RETRY_MAX = 5;
var SERVER_TRANSCRIPT_TAIL_BODY_RETRY_INITIAL_MS = 2e3;
var SERVER_TRANSCRIPT_TAIL_BODY_RETRY_MAX_MS = 3e4;
var SERVER_TRANSCRIPT_TAIL_OMITTED_BODY_FETCH_MAX_CONCURRENT = 8;
var SERVER_TRANSCRIPT_TAIL_FALLBACK_AFTER_FAILURES = 3;
var SERVER_TRANSCRIPT_TAIL_STALL_MS = 6e4;
var LIST_LIMIT_MAX = 500;
function splitListedPage(entries, limit) {
  return {
    kept: entries.length > limit ? entries.slice(0, limit) : entries,
    hasMore: entries.length >= Math.min(limit + 1, LIST_LIMIT_MAX)
  };
}
var ServerTranscriptTailReadError = class extends SandDomainError {
  name = "ServerTranscriptTailReadError";
};
var ServerTranscriptTailStallError = class extends SandDomainError {
  name = "ServerTranscriptTailStallError";
};
var ServerTranscriptTailReadSupersededError = class extends ServerTranscriptTailReadError {
  name = "ServerTranscriptTailReadSupersededError";
};
function compareBigint(a, b2) {
  if (a < b2) return -1;
  if (a > b2) return 1;
  return 0;
}
function bodySourceOf(row) {
  if (row.blobHash != null) return "blob";
  if (row.bodyOmitted) return "omitted";
  return "none";
}
function tailStateKey(agentId, sessionId) {
  const normalized = normalizeGrokBotSessionId(sessionId);
  return normalized === DEFAULT_GROK_BOT_SESSION_ID ? agentId : `${agentId}\0${normalized}`;
}
function sessionRequestFieldOmittingDefault(sessionId) {
  const normalized = normalizeGrokBotSessionId(sessionId);
  return normalized === DEFAULT_GROK_BOT_SESSION_ID ? {} : { sessionId: normalized };
}
function mergeFrameRows(entries, deletes) {
  const merged = [
    ...entries.map((row) => ({ kind: "entry", row })),
    ...deletes.map((row) => ({ kind: "delete", row }))
  ];
  merged.sort((a, b2) => compareBigint(a.row.updatedSeq, b2.row.updatedSeq));
  return merged;
}
function createServerTranscriptTail(deps) {
  const clock = deps.clock ?? realClock;
  const random = deps.random ?? Math.random;
  const retryBackoff = deps.retryBackoff ?? createRetryPolicy({
    name: "server-transcript-tail-retry",
    mode: "until-signal",
    initialDelayMs: SERVER_TRANSCRIPT_TAIL_RETRY_INITIAL_MS,
    maxDelayMs: SERVER_TRANSCRIPT_TAIL_RETRY_MAX_MS,
    clock
  });
  const bodyRetryBackoff = deps.bodyRetryBackoff ?? createRetryPolicy({
    name: "server-transcript-tail-body-retry",
    maxAttempts: SERVER_TRANSCRIPT_TAIL_BODY_RETRY_MAX,
    initialDelayMs: SERVER_TRANSCRIPT_TAIL_BODY_RETRY_INITIAL_MS,
    maxDelayMs: SERVER_TRANSCRIPT_TAIL_BODY_RETRY_MAX_MS,
    jitter: "equal",
    clock,
    random
  });
  const cleanReconnectPause = createRetryPolicy({
    name: "server-transcript-tail-clean-reconnect",
    maxAttempts: 1,
    initialDelayMs: SERVER_TRANSCRIPT_TAIL_CLEAN_RECONNECT_MAX_MS,
    maxDelayMs: SERVER_TRANSCRIPT_TAIL_CLEAN_RECONNECT_MAX_MS,
    jitter: "full",
    clock,
    random
  });
  const stallWatchdog = deps.stallWatchdog ?? createIdleWatchdogPolicy({
    name: "server-transcript-tail-stall",
    idleMs: SERVER_TRANSCRIPT_TAIL_STALL_MS,
    clock
  });
  const decoder2 = new TextDecoder();
  const agents = /* @__PURE__ */ new Map();
  let phase = SERVER_TRANSCRIPT_TAIL_INITIAL_PHASE;
  let epochBumpFloor = 0;
  let mountedAgentId = null;
  let streamLifetime = null;
  const transition = (next) => {
    const previous = phase;
    phase = next;
    const lifetime = lifetimeOf(previous);
    if (lifetime !== null && lifetime !== lifetimeOf(next)) lifetime.abort();
    const recovery = recoveryTimerOf(previous);
    if (recovery !== null && recovery !== recoveryTimerOf(next)) recovery.dispose();
  };
  const pin = (agentId) => {
    if (agentId === mountedAgentId) return;
    mountedAgentId = agentId;
    deps.log(`server transcript tail pinned ${agentId}`);
  };
  const readGenerationFor = (agentId) => requiresServer(agentId) ? phase.generations.destructive : phase.generations.fallback + phase.generations.recovery;
  const requiresServer = (agentId) => deps.requiredAgents?.has(agentId) === true;
  const hasRequiredAgents = () => (deps.requiredAgents?.size ?? 0) > 0;
  const acceptsAgent = (agentId) => deps.acceptsAgent?.({ agentId }) !== false && (requiresServer(agentId) || isLegacyActive(phase));
  const emit = (event) => {
    const agentId = event.type === "snapshot" ? event.activeAgentId : event.agentId;
    if (phase.kind === "stopped" || agentId === void 0 || !acceptsAgent(agentId)) return;
    deps.emit(event);
  };
  const locks = /* @__PURE__ */ new Map();
  const withAgent = async (lockKey, work) => {
    const previous = locks.get(lockKey) ?? Promise.resolve();
    let release = () => {
    };
    const held = new Promise((resolve29) => {
      release = resolve29;
    });
    locks.set(lockKey, held);
    await previous;
    try {
      return await work();
    } finally {
      release();
      if (locks.get(lockKey) === held) locks.delete(lockKey);
    }
  };
  const stateFor = (agentId, sessionId = DEFAULT_GROK_BOT_SESSION_ID) => {
    const key = tailStateKey(agentId, sessionId);
    let state = agents.get(key);
    if (state == null) {
      state = {
        agentId,
        sessionId: normalizeGrokBotSessionId(sessionId),
        generation: 0,
        streamAckUpdatedSeq: BigInt(0),
        rows: /* @__PURE__ */ new Map(),
        counter: 0,
        epochBump: epochBumpFloor,
        windowFloorSeq: BigInt(0),
        maxLiveSeq: BigInt(0),
        needsRehydrate: false,
        lastTouchedAt: clock.monotonicNow(),
        pendingBodies: /* @__PURE__ */ new Map(),
        lostBodies: /* @__PURE__ */ new Map(),
        bodyRetry: null
      };
      agents.set(key, state);
    }
    state.lastTouchedAt = clock.monotonicNow();
    return state;
  };
  const epochOf = (state) => {
    const recovery = requiresServer(state.agentId) || phase.generations.recovery === 0 ? "" : `:recovery:${phase.generations.recovery}`;
    const epoch = `${deps.bootId}:${state.generation}${recovery}`;
    return state.epochBump === 0 ? epoch : `${epoch}:${state.epochBump}`;
  };
  const activate = () => {
    transition(connected(phase));
    if (isLegacyActive(phase)) deps.onActiveChange?.(true);
  };
  const fallBack = ({
    reason,
    recoverable = false
  }) => {
    if (!canFallBack(phase, { recoverable })) return false;
    const wasServing = phase.legacy.kind === "serving";
    transition(
      fallenBack(
        phase,
        recoverable ? {
          kind: "recovering",
          timer: clock.schedule(SERVER_TRANSCRIPT_TAIL_DISABLED_RECHECK_MS, recover)
        } : { kind: "retired" }
      )
    );
    for (const [id, state] of agents) {
      if (!recoverable || !requiresServer(id)) cancelBodyRetry(state);
      if (!requiresServer(id)) agents.delete(id);
    }
    deps.log(
      `server transcript tail falling back to the gateway for BOX agents${recoverable ? " until recovery" : " for the rest of this coordinator's life"}: ${reason}`
    );
    if (wasServing) deps.onActiveChange?.(false);
    if (hasRequiredAgents()) return false;
    if (phase.kind === "running") transition(tornDown(phase));
    return true;
  };
  const recover = () => {
    invariant(
      phase.kind !== "stopped" && phase.legacy.kind === "recovering",
      "server transcript tail: the recovery timer fired outside a recovering phase"
    );
    if (phase.kind === "running") transition(tornDown(phase));
    start();
  };
  const updateLegacyEnabled = ({ enabled }) => {
    const wasLegacyActive = isLegacyActive(phase);
    transition(gated(phase, enabled));
    if (!enabled) fallBack({ reason: "gate off" });
    else if (!wasLegacyActive && isLegacyActive(phase)) deps.onActiveChange?.(true);
  };
  const nextStamp = (state) => {
    state.counter += 1;
    return {
      replicaKey: transcriptReplicaKeyForSession(state),
      epoch: epochOf(state),
      sequence: state.counter
    };
  };
  const cancelBodyRetry = (state) => {
    state.bodyRetry?.handle.dispose();
    state.bodyRetry = null;
  };
  const resetForGeneration = (state, generation) => {
    cancelBodyRetry(state);
    state.generation = generation;
    state.streamAckUpdatedSeq = BigInt(0);
    state.rows.clear();
    state.counter = 0;
    state.epochBump = epochBumpFloor;
    state.windowFloorSeq = BigInt(0);
    state.maxLiveSeq = BigInt(0);
    state.needsRehydrate = false;
    state.pendingBodies.clear();
    state.lostBodies.clear();
  };
  const adoptGeneration = (state, generation, options2 = {}) => {
    if (generation === 0) return true;
    if (state.generation === 0) {
      state.generation = generation;
      return true;
    }
    if (generation === state.generation) return true;
    if (generation < state.generation && options2.authoritative !== true) return false;
    if (state.counter > 0) {
      emit({
        type: "cleared",
        agentId: state.agentId,
        ordered: nextStamp(state)
      });
    }
    resetForGeneration(state, generation);
    return true;
  };
  const bumpEpoch = (state) => {
    cancelBodyRetry(state);
    state.epochBump += 1;
    state.counter = 0;
    state.rows.clear();
    state.streamAckUpdatedSeq = BigInt(0);
    state.windowFloorSeq = BigInt(0);
    state.maxLiveSeq = BigInt(0);
    state.pendingBodies.clear();
  };
  let droppedRows = 0;
  const decodeBody = (body) => {
    if (body == null) {
      droppedRows += 1;
      return null;
    }
    let parsed2;
    try {
      parsed2 = JSON.parse(decoder2.decode(body));
    } catch (error41) {
      droppedRows += 1;
      deps.log(`server transcript row body is not JSON: ${errorLogTag(error41)}`);
      return null;
    }
    const entry = transcriptEntryOfJson(parsed2);
    if (entry == null) droppedRows += 1;
    return entry;
  };
  const reportDroppedRows = (context2) => {
    if (droppedRows === 0) return;
    deps.log(`server transcript ${context2}: dropped ${droppedRows} undecodable row(s)`);
    droppedRows = 0;
  };
  const fetchOmittedRows = async (args) => {
    const { agentId, sessionId, generation, seqs, signal } = args;
    const outcomes = /* @__PURE__ */ new Map();
    const queue = [...seqs];
    const worker = async () => {
      while (signal?.aborted !== true) {
        const seq2 = queue.shift();
        if (seq2 === void 0) return;
        try {
          const listed = await deps.client.list(
            {
              agentId,
              generation,
              beforeSeq: seq2 + BigInt(1),
              limit: 1,
              ...sessionRequestFieldOmittingDefault(sessionId)
            },
            signal
          );
          const row = listed.entries.find((candidate) => candidate.seq === seq2);
          outcomes.set(seq2, row == null ? { kind: "missing" } : { kind: "found", row });
        } catch (error41) {
          outcomes.set(seq2, { kind: "failed", error: error41 });
        }
      }
    };
    const workers = Math.min(SERVER_TRANSCRIPT_TAIL_OMITTED_BODY_FETCH_MAX_CONCURRENT, seqs.length);
    await Promise.all(Array.from({ length: workers }, worker));
    return outcomes;
  };
  const resolveBodies = async (args) => {
    const { agentId, sessionId, generation, rows, signal } = args;
    const bodies = /* @__PURE__ */ new Map();
    const blobHashBySeq = /* @__PURE__ */ new Map();
    const omitted = [];
    for (const row of rows) {
      if (row.body != null) bodies.set(row.seq, row.body);
      else if (row.blobHash != null) blobHashBySeq.set(row.seq, row.blobHash);
      else if (row.bodyOmitted) omitted.push(row.seq);
    }
    if (omitted.length > 0) {
      const fetched = await fetchOmittedRows({
        agentId,
        sessionId,
        generation,
        seqs: omitted,
        signal
      });
      const failures = [...fetched.values()].flatMap(
        (outcome) => outcome.kind === "failed" ? [outcome.error] : []
      );
      const gateOff = failures.find((error41) => error41 instanceof ServerTranscriptTailDisabledError);
      if (gateOff !== void 0) throw gateOff;
      if (failures.length > 0) {
        if (signal?.aborted === true) throw failures[0];
        deps.log(
          `server transcript omitted-body re-list for ${agentId}: ${failures.length} of ${omitted.length} failed: ${errorLogTag(failures[0])}`
        );
      }
      for (const seq2 of omitted) {
        const outcome = fetched.get(seq2);
        if (outcome?.kind !== "found") continue;
        if (outcome.row.body != null) bodies.set(seq2, outcome.row.body);
        else if (outcome.row.blobHash != null) blobHashBySeq.set(seq2, outcome.row.blobHash);
      }
    }
    if (blobHashBySeq.size > 0) {
      const blobs = await deps.client.readBlobs([...new Set(blobHashBySeq.values())], signal);
      for (const [seq2, blobHash] of blobHashBySeq) {
        const blob = blobs.get(blobHash);
        if (blob != null) bodies.set(seq2, blob);
      }
    }
    return bodies;
  };
  const noteBodyLost = (state, row) => {
    const reportedThrough = state.lostBodies.get(row.seq);
    if (reportedThrough != null && reportedThrough >= row.updatedSeq) return;
    state.lostBodies.set(row.seq, row.updatedSeq);
    deps.onRowLost?.({
      agentId: state.agentId,
      generation: state.generation,
      seq: Number(row.seq),
      bodySource: bodySourceOf(row),
      attempts: SERVER_TRANSCRIPT_TAIL_BODY_RETRY_MAX
    });
  };
  const deferBody = (state, row) => {
    const pending = state.pendingBodies.get(row.seq);
    const attempts2 = pending == null || pending.row.updatedSeq < row.updatedSeq ? 1 : pending.attempts + 1;
    if (attempts2 > SERVER_TRANSCRIPT_TAIL_BODY_RETRY_MAX) {
      state.pendingBodies.delete(row.seq);
      deps.log(
        `server transcript row ${state.agentId}/${row.seq} body unresolved after ${SERVER_TRANSCRIPT_TAIL_BODY_RETRY_MAX} attempts`
      );
      noteBodyLost(state, row);
      return;
    }
    state.pendingBodies.set(row.seq, { row, attempts: attempts2 });
    scheduleBodyRetry(state, attempts2);
  };
  const settlePendingBody = (args) => {
    const pending = args.state.pendingBodies.get(args.seq);
    if (pending != null && pending.row.updatedSeq <= args.throughUpdatedSeq) {
      args.state.pendingBodies.delete(args.seq);
    }
  };
  const applyEntry = (state, row, body) => {
    const previous = state.rows.get(row.seq);
    if (previous != null && previous.updatedSeq >= row.updatedSeq) {
      settlePendingBody({
        state,
        seq: row.seq,
        throughUpdatedSeq: previous.updatedSeq
      });
      return;
    }
    if (body == null) {
      deferBody(state, row);
      return;
    }
    settlePendingBody({
      state,
      seq: row.seq,
      throughUpdatedSeq: row.updatedSeq
    });
    const entry = decodeBody(body);
    if (entry == null) {
      state.rows.set(row.seq, {
        updatedSeq: row.updatedSeq,
        id: previous?.id ?? null
      });
      return;
    }
    const agentId = state.agentId;
    if (previous?.id != null && previous.id !== entry.id) {
      emit({
        type: "removed",
        id: previous.id,
        agentId,
        ordered: nextStamp(state)
      });
    }
    const isKnownLive = previous?.id === entry.id;
    const isBelowWindow = previous == null && state.windowFloorSeq > BigInt(0) && row.seq < state.windowFloorSeq;
    if (!isKnownLive && !isBelowWindow && previous?.id == null && row.seq < state.maxLiveSeq) {
      state.rows.set(row.seq, { updatedSeq: row.updatedSeq, id: entry.id });
      state.needsRehydrate = true;
      return;
    }
    if (row.seq > state.maxLiveSeq) state.maxLiveSeq = row.seq;
    emit({
      type: isKnownLive || isBelowWindow ? "updated" : "appended",
      entry,
      agentId,
      ordered: nextStamp(state)
    });
    state.rows.set(row.seq, { updatedSeq: row.updatedSeq, id: entry.id });
  };
  const applyDelete = (state, row) => {
    const previous = state.rows.get(row.seq);
    settlePendingBody({
      state,
      seq: row.seq,
      throughUpdatedSeq: row.updatedSeq
    });
    if (previous != null && previous.updatedSeq >= row.updatedSeq) return;
    const id = row.entryId ?? previous?.id ?? null;
    if (id != null && (previous?.id != null || row.entryId != null)) {
      emit({
        type: "removed",
        id,
        agentId: state.agentId,
        ordered: nextStamp(state)
      });
    }
    state.rows.set(row.seq, { updatedSeq: row.updatedSeq, id: null });
  };
  const listPage = async (state, args) => {
    const limit = Math.max(1, Math.min(args.limit, LIST_LIMIT_MAX));
    const response = await deps.client.list(
      {
        agentId: state.agentId,
        ...state.generation === 0 ? {} : { generation: state.generation },
        ...args.beforeSeq === void 0 ? {} : { beforeSeq: args.beforeSeq },
        limit: Math.min(limit + 1, LIST_LIMIT_MAX),
        ...sessionRequestFieldOmittingDefault(state.sessionId)
      },
      args.signal
    );
    const { kept, hasMore } = splitListedPage(response.entries, limit);
    const bodies = await resolveBodies({
      agentId: state.agentId,
      sessionId: state.sessionId,
      generation: response.generation,
      rows: kept,
      ...args.signal === void 0 ? {} : { signal: args.signal }
    });
    const unresolved = kept.filter((row) => !bodies.has(row.seq)).length;
    if (unresolved > 0) {
      throw new ServerTranscriptTailReadError(
        `${unresolved} row body(ies) in the history page for ${state.agentId} could not be resolved`
      );
    }
    const entries = [];
    let oldestSeq = null;
    for (const row of kept.toReversed()) {
      const entry = decodeBody(bodies.get(row.seq));
      if (oldestSeq == null || row.seq < oldestSeq) oldestSeq = row.seq;
      if (entry == null) continue;
      entries.push(entry);
    }
    reportDroppedRows(`page for ${state.agentId}`);
    return {
      generation: response.generation,
      page: {
        entries,
        ...hasMore && oldestSeq != null ? { nextBeforeSeq: Number(oldestSeq) } : {}
      }
    };
  };
  const recordListedRows = (state, rows, bodiesById) => {
    const seedsCursor = state.streamAckUpdatedSeq === BigInt(0);
    let floor2 = null;
    let newest = BigInt(0);
    for (const row of rows) {
      if (floor2 == null || row.seq < floor2) floor2 = row.seq;
      if (row.updatedSeq > newest) newest = row.updatedSeq;
      const previous = state.rows.get(row.seq);
      if (previous != null && previous.updatedSeq >= row.updatedSeq) continue;
      const id = bodiesById.get(row.seq) ?? previous?.id ?? null;
      state.rows.set(row.seq, { updatedSeq: row.updatedSeq, id });
      if (id != null && row.seq > state.maxLiveSeq) state.maxLiveSeq = row.seq;
    }
    if (seedsCursor && newest > state.streamAckUpdatedSeq) {
      state.streamAckUpdatedSeq = newest;
    }
    if (floor2 != null && (state.windowFloorSeq === BigInt(0) || floor2 < state.windowFloorSeq)) {
      state.windowFloorSeq = floor2;
    }
  };
  const scheduleBodyRetry = (state, attempt) => {
    if (phase.kind !== "running" || state.pendingBodies.size === 0 || state.bodyRetry != null || !acceptsAgent(state.agentId))
      return;
    if (attempt > SERVER_TRANSCRIPT_TAIL_BODY_RETRY_MAX) return;
    const handle = bodyRetryBackoff.schedule(attempt);
    state.bodyRetry = { handle, attempt };
    void retryPendingBodiesAfter(state, handle);
  };
  const retryPendingBodiesAfter = async (state, handle) => {
    try {
      await handle.elapsed;
    } catch (error41) {
      if (state.bodyRetry?.handle !== handle) return;
      throw error41;
    }
    if (state.bodyRetry?.handle !== handle) return;
    const { attempt } = state.bodyRetry;
    state.bodyRetry = null;
    await retryPendingBodies(state, attempt);
  };
  const retryPendingBodies = (state, attempt) => {
    const readGeneration = readGenerationFor(state.agentId);
    const stateKey = tailStateKey(state.agentId, state.sessionId);
    return withAgent(stateKey, async () => {
      const signal = lifetimeOf(phase)?.signal;
      if (signal == null || signal.aborted || readGeneration !== readGenerationFor(state.agentId) || !acceptsAgent(state.agentId) || agents.get(stateKey) !== state) {
        return;
      }
      if (state.pendingBodies.size === 0) return;
      try {
        await applyRows(
          {
            agentId: state.agentId,
            sessionId: state.sessionId,
            generation: state.generation,
            entries: [],
            deletes: []
          },
          signal
        );
      } catch (error41) {
        if (signal.aborted || error41 instanceof ServerTranscriptTailReadSupersededError || !acceptsAgent(state.agentId))
          return;
        deps.log(`server transcript body retry for ${state.agentId} failed: ${errorLogTag(error41)}`);
      } finally {
        if (!signal.aborted && readGeneration === readGenerationFor(state.agentId) && acceptsAgent(state.agentId) && agents.get(stateKey) === state) {
          scheduleBodyRetry(state, attempt + 1);
        }
      }
    });
  };
  const readNewestPage = async (state, args) => {
    const readGeneration = readGenerationFor(state.agentId);
    const boundedLimit = Math.max(1, Math.min(args.limit, LIST_LIMIT_MAX));
    const response = await deps.client.list(
      {
        agentId: state.agentId,
        limit: Math.min(boundedLimit + 1, LIST_LIMIT_MAX),
        ...sessionRequestFieldOmittingDefault(state.sessionId)
      },
      args.signal
    );
    const { kept, hasMore } = splitListedPage(response.entries, boundedLimit);
    const bodies = await resolveBodies({
      agentId: state.agentId,
      sessionId: state.sessionId,
      generation: response.generation,
      rows: kept,
      ...args.signal === void 0 ? {} : { signal: args.signal }
    });
    if (agents.get(tailStateKey(state.agentId, state.sessionId)) !== state || args.signal?.aborted === true || readGeneration !== readGenerationFor(state.agentId) || args.rehydrate === true && !acceptsAgent(state.agentId)) {
      throw new ServerTranscriptTailReadSupersededError("server transcript read superseded");
    }
    if (args.rehydrate === true) bumpEpoch(state);
    if (response.generation !== 0 && response.generation !== state.generation) {
      adoptGeneration(state, response.generation, { authoritative: true });
    }
    const entries = [];
    const idsBySeq = /* @__PURE__ */ new Map();
    const resolved = [];
    let oldestSeq = null;
    for (const row of kept.toReversed()) {
      if (oldestSeq == null || row.seq < oldestSeq) oldestSeq = row.seq;
      const body = bodies.get(row.seq);
      if (body == null) {
        const previous = state.rows.get(row.seq);
        if (response.generation === state.generation && (previous == null || previous.updatedSeq < row.updatedSeq)) {
          deferBody(state, row);
        }
        continue;
      }
      resolved.push(row);
      const entry = decodeBody(body);
      if (entry == null) continue;
      idsBySeq.set(row.seq, entry.id);
      entries.push(entry);
    }
    if (response.generation === state.generation) {
      recordListedRows(state, resolved, idsBySeq);
      scheduleBodyRetry(state, 1);
    }
    reportDroppedRows(`tail for ${state.agentId}`);
    const page = {
      entries,
      ...hasMore && oldestSeq != null ? { nextBeforeSeq: Number(oldestSeq) } : {}
    };
    if (args.rehydrate === true) {
      if (page.nextBeforeSeq != null) state.counter = 1;
      const stamp = nextStamp(state);
      emit({
        type: "snapshot",
        activeAgentId: state.agentId,
        entries: page.entries,
        ordered: stamp,
        coverage: {
          kind: "transcript-live-range",
          fromSequence: page.nextBeforeSeq == null ? 1 : stamp.sequence,
          throughSequence: stamp.sequence
        }
      });
      state.needsRehydrate = false;
    }
    return page;
  };
  const rehydrate = async (state, signal) => {
    state.needsRehydrate = true;
    await readNewestPage(state, {
      limit: SERVER_TRANSCRIPT_TAIL_REHYDRATE_LIMIT,
      signal,
      rehydrate: true
    });
  };
  const handleRows = async (frame, signal) => {
    const readGeneration = readGenerationFor(frame.agentId);
    await withAgent(tailStateKey(frame.agentId, frame.sessionId), async () => {
      if (readGeneration !== readGenerationFor(frame.agentId)) return;
      await applyRows(frame, signal);
    });
  };
  const applyRows = async (frame, signal) => {
    if (signal.aborted || !acceptsAgent(frame.agentId)) return;
    const readGeneration = readGenerationFor(frame.agentId);
    const state = stateFor(frame.agentId, frame.sessionId);
    if (!adoptGeneration(state, frame.generation)) return;
    if (state.needsRehydrate) await rehydrate(state, signal);
    const retried = [...state.pendingBodies.values()].map((pending) => pending.row).filter((row) => !frame.entries.some((fresh2) => fresh2.seq === row.seq));
    const rows = mergeFrameRows([...retried, ...frame.entries], frame.deletes);
    const fresh = rows.flatMap((item) => {
      if (item.kind !== "entry") return [];
      const previous = state.rows.get(item.row.seq);
      return previous == null || previous.updatedSeq < item.row.updatedSeq ? [item.row] : [];
    });
    const bodies = await resolveBodies({
      agentId: frame.agentId,
      sessionId: frame.sessionId,
      generation: frame.generation,
      rows: fresh,
      signal
    });
    if (signal.aborted || readGeneration !== readGenerationFor(frame.agentId) || !acceptsAgent(frame.agentId) || agents.get(tailStateKey(frame.agentId, frame.sessionId)) !== state)
      return;
    for (const item of rows) {
      if (item.kind === "entry") applyEntry(state, item.row, bodies.get(item.row.seq));
      else applyDelete(state, item.row);
    }
    let highWater = state.streamAckUpdatedSeq;
    for (const row of [...frame.entries, ...frame.deletes]) {
      if (row.updatedSeq > highWater) highWater = row.updatedSeq;
    }
    state.streamAckUpdatedSeq = highWater;
    reportDroppedRows(`rows for ${frame.agentId}`);
    if (state.pendingBodies.size === 0) cancelBodyRetry(state);
    if (state.needsRehydrate) await rehydrate(state, signal);
  };
  const handleFrame = async (frame, signal) => {
    if (phase.kind === "stopped" || signal.aborted) return;
    switch (frame.frame.case) {
      case "rows":
        await handleRows(
          {
            ...frame.frame.value,
            sessionId: normalizeGrokBotSessionId(frame.frame.value.sessionId)
          },
          signal
        );
        return;
      case "cleared": {
        const { agentId, newGeneration, sessionId } = frame.frame.value;
        if (!acceptsAgent(agentId)) return;
        const readGeneration = readGenerationFor(agentId);
        const normalizedSessionId = normalizeGrokBotSessionId(sessionId);
        await withAgent(tailStateKey(agentId, normalizedSessionId), async () => {
          if (signal.aborted || readGeneration !== readGenerationFor(agentId) || !acceptsAgent(agentId))
            return;
          adoptGeneration(stateFor(agentId, normalizedSessionId), newGeneration, {
            authoritative: true
          });
        });
        return;
      }
      case "cursorTooOld": {
        const { agentId, generation, sessionId } = frame.frame.value;
        if (!acceptsAgent(agentId)) return;
        const readGeneration = readGenerationFor(agentId);
        const normalizedSessionId = normalizeGrokBotSessionId(sessionId);
        await withAgent(tailStateKey(agentId, normalizedSessionId), async () => {
          if (signal.aborted || readGeneration !== readGenerationFor(agentId) || !acceptsAgent(agentId))
            return;
          const state = stateFor(agentId, normalizedSessionId);
          adoptGeneration(state, generation, { authoritative: true });
          await rehydrate(state, signal);
        });
        return;
      }
      case "agentState": {
        const state = frame.frame.value.clone();
        state.live = state.live.filter((item) => acceptsAgent(item.agentId));
        state.client = state.client.filter((item) => acceptsAgent(item.agentId));
        deps.onAgentState?.(state);
        return;
      }
      case "computerActions": {
        const actions = frame.frame.value.clone();
        actions.actions = actions.actions.filter((item) => acceptsAgent(item.agentId));
        deps.onComputerActions?.(actions);
        return;
      }
      case "agentStateChanged":
        if (!acceptsAgent(frame.frame.value.agentId)) return;
        deps.onAgentStateChanged?.(frame.frame.value);
        return;
      case "rosterChanged":
        deps.onRosterChanged?.(frame.frame.value);
        return;
      case "connected":
      case "heartbeat":
      case "turnFailed":
      case "boxState":
      case void 0:
        return;
      default: {
        const _exhaustive = frame.frame;
        void _exhaustive;
      }
    }
  };
  const unlistedWatchAdmissionCovers = (state) => state.sessionId === DEFAULT_GROK_BOT_SESSION_ID;
  const cursorsForConnect = () => {
    const listed = [...agents.values()].filter((state) => state.generation > 0 || !unlistedWatchAdmissionCovers(state)).sort((a, b2) => b2.lastTouchedAt - a.lastTouchedAt);
    const kept = listed.slice(0, SERVER_TRANSCRIPT_TAIL_MAX_CURSORS);
    for (const state of listed.slice(SERVER_TRANSCRIPT_TAIL_MAX_CURSORS)) {
      if (state.counter > 0 || state.rows.size > 0) state.needsRehydrate = true;
    }
    return kept.map((state) => {
      let afterUpdatedSeq = state.needsRehydrate ? BigInt(0) : state.streamAckUpdatedSeq;
      for (const pending of state.pendingBodies.values()) {
        const before = pending.row.updatedSeq - BigInt(1);
        if (before < afterUpdatedSeq) afterUpdatedSeq = before;
      }
      return {
        agentId: state.agentId,
        generation: state.generation,
        afterUpdatedSeq,
        ...sessionRequestFieldOmittingDefault(state.sessionId)
      };
    });
  };
  const isSettled = (state) => !locks.has(tailStateKey(state.agentId, state.sessionId)) && state.agentId !== mountedAgentId && state.pendingBodies.size === 0 && state.bodyRetry == null;
  const sweepSettled = () => {
    const now = clock.monotonicNow();
    const byRecency2 = [...agents.values()].sort((a, b2) => b2.lastTouchedAt - a.lastTouchedAt);
    let evicted = 0;
    let releasedRows = 0;
    for (const [rank, state] of byRecency2.entries()) {
      const idle = now - state.lastTouchedAt >= SERVER_TRANSCRIPT_TAIL_EVICT_IDLE_MS;
      if (!isSettled(state) || !idle && rank < SERVER_TRANSCRIPT_TAIL_MAX_CURSORS) continue;
      agents.delete(tailStateKey(state.agentId, state.sessionId));
      epochBumpFloor = Math.max(epochBumpFloor, state.epochBump + 1);
      evicted += 1;
      releasedRows += state.rows.size;
    }
    if (evicted === 0) return;
    let retainedRows = 0;
    for (const state of agents.values()) retainedRows += state.rows.size;
    deps.log(
      `server transcript tail evicted ${evicted} settled agent state(s) holding ${releasedRows} row(s); ${agents.size} state(s) holding ${retainedRows} row(s) retained`
    );
  };
  const park = (signal) => new Promise((resolve29) => {
    if (signal.aborted) {
      resolve29();
      return;
    }
    const wake = () => {
      transition(unparked(phase));
      leave();
    };
    const timer = clock.schedule(SERVER_TRANSCRIPT_TAIL_DISABLED_RECHECK_MS, wake);
    const leave = () => {
      timer.dispose();
      signal.removeEventListener("abort", leave);
      resolve29();
    };
    signal.addEventListener("abort", leave, { once: true });
    transition(parked(phase, { wake }));
  });
  const settle = async (delay5, signal) => {
    try {
      await delay5.elapsed;
    } catch (error41) {
      if (!signal.aborted) throw error41;
    }
  };
  const recheckGateWhileOpen = (signal) => {
    let scheduled = null;
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
      scheduled?.dispose();
      scheduled = null;
      signal.removeEventListener("abort", cancel);
    };
    const tick = () => {
      if (cancelled || signal.aborted) return;
      scheduled = clock.schedule(SERVER_TRANSCRIPT_TAIL_GATE_RECHECK_MS, () => {
        scheduled = null;
        sweepSettled();
        void deps.client.isEnabled().then(
          (enabled) => {
            if (cancelled || signal.aborted) return;
            updateLegacyEnabled({ enabled });
            if (enabled || hasRequiredAgents()) tick();
          },
          (error41) => {
            if (cancelled || signal.aborted) return;
            deps.log(`server transcript tail gate recheck failed: ${errorLogTag(error41)}`);
            tick();
          }
        );
      });
    };
    signal.addEventListener("abort", cancel, { once: true });
    tick();
    return cancel;
  };
  const runOnce = async (signal) => {
    const enabled = await deps.client.isEnabled();
    if (signal.aborted) return "clean";
    updateLegacyEnabled({ enabled });
    if (signal.aborted) return "clean";
    if ((!phase.gate || phase.legacy.kind !== "serving") && !hasRequiredAgents()) return "disabled";
    const lifetime = new AbortController();
    streamLifetime = lifetime;
    const stream3 = deps.client.watch(
      {
        cursors: cursorsForConnect(),
        includeUnlistedAgents: true,
        inlineBodyMaxBytes: SERVER_TRANSCRIPT_TAIL_INLINE_BODY_MAX_BYTES
      },
      AbortSignal.any([signal, lifetime.signal])
    );
    const stopRecheck = recheckGateWhileOpen(signal);
    let streamConnected = false;
    let stalled = false;
    let idle = null;
    const disarmStall = () => {
      idle?.dispose();
      idle = null;
    };
    const armStall = () => {
      disarmStall();
      if (signal.aborted) return;
      idle = stallWatchdog.arm(() => {
        stalled = true;
        lifetime.abort();
      });
    };
    signal.addEventListener("abort", disarmStall, { once: true });
    armStall();
    try {
      for await (const frame of stream3) {
        disarmStall();
        if (signal.aborted) break;
        if (frame.frame.case === "connected") {
          streamConnected = true;
          activate();
        }
        if (streamConnected) await handleFrame(frame, signal);
        armStall();
      }
    } catch (error41) {
      if (!stalled && !lifetime.signal.aborted) throw error41;
    } finally {
      signal.removeEventListener("abort", disarmStall);
      disarmStall();
      if (streamLifetime === lifetime) streamLifetime = null;
      stopRecheck();
    }
    if (stalled) {
      throw new ServerTranscriptTailStallError(
        "server transcript stream went silent; no frame or heartbeat before the stall watchdog fired"
      );
    }
    return "clean";
  };
  const loop = async (signal) => {
    let failures = 0;
    while (!signal.aborted) {
      let outcome;
      try {
        outcome = await runOnce(signal);
        failures = 0;
      } catch (error41) {
        if (signal.aborted) return;
        if (error41 instanceof ServerTranscriptTailReadSupersededError) {
          failures = 0;
          outcome = "clean";
        } else if (error41 instanceof ServerTranscriptTailDisabledError) {
          outcome = "disabled";
        } else {
          failures += 1;
          outcome = "failed";
          deps.log(`server transcript tail dropped (attempt ${failures}): ${errorLogTag(error41)}`);
          if (failures >= SERVER_TRANSCRIPT_TAIL_FALLBACK_AFTER_FAILURES && fallBack({ reason: `${failures} consecutive stream failures`, recoverable: true })) {
            return;
          }
        }
      }
      if (signal.aborted) return;
      if (outcome === "disabled") {
        if (fallBack({ reason: "gate off" })) return;
        await park(signal);
      } else if (outcome === "clean") {
        await settle(
          cleanReconnectPause.schedule(1, signal, {
            kind: "minimum",
            delayMs: SERVER_TRANSCRIPT_TAIL_CLEAN_RECONNECT_MIN_MS
          }),
          signal
        );
      } else {
        await settle(retryBackoff.schedule(failures, signal), signal);
      }
    }
  };
  const readFailure = (error41) => {
    if (error41 instanceof ServerTranscriptTailDisabledError) {
      fallBack({ reason: "gate off during a read" });
    }
    throw new ServerTranscriptTailReadError(error41 instanceof Error ? error41.message : String(error41));
  };
  const start = () => {
    if (phase.kind === "running") {
      phase.parked?.wake();
      return;
    }
    const controller = new AbortController();
    transition(started(phase, controller));
    void loop(controller.signal).catch((error41) => {
      if (controller.signal.aborted) return;
      deps.log(`server transcript tail loop ended: ${errorLogTag(error41)}`);
    });
  };
  const serverRead = (args, read) => {
    const agentId = args.id;
    const sessionId = normalizeGrokBotSessionId(args.sessionId ?? DEFAULT_GROK_BOT_SESSION_ID);
    return withAgent(tailStateKey(agentId, sessionId), async () => {
      if (phase.kind === "stopped") {
        throw new ServerTranscriptTailReadError("server transcript tail stopped");
      }
      const readGeneration = readGenerationFor(agentId);
      const isNewState = !agents.has(tailStateKey(agentId, sessionId));
      const state = stateFor(agentId, sessionId);
      if (isNewState && !unlistedWatchAdmissionCovers(state)) streamLifetime?.abort();
      if (phase.legacy.kind !== "serving" && requiresServer(agentId)) start();
      let value;
      try {
        value = await read(state);
      } catch (error41) {
        if (readGeneration !== readGenerationFor(agentId)) {
          throw new ServerTranscriptTailReadError("server transcript read superseded");
        }
        return readFailure(error41);
      }
      if (readGeneration !== readGenerationFor(agentId)) {
        throw new ServerTranscriptTailReadError("server transcript read superseded");
      }
      return value;
    });
  };
  return {
    start,
    stop() {
      transition(stopped(phase));
      for (const state of agents.values()) cancelBodyRetry(state);
    },
    isActive: (args) => args === void 0 ? isLegacyActive(phase) : requiresServer(args.agentId) || isLegacyActive(phase),
    noteMountedAgent: (args) => pin(args.id),
    openAgentTail: (args, signal) => {
      pin(args.id);
      return serverRead(
        args,
        (state) => readNewestPage(state, {
          limit: args.limit,
          ...signal === void 0 ? {} : { signal }
        })
      );
    },
    getAgentTranscriptTail: (args, signal) => serverRead(args, async (state) => {
      if (args.beforeSeq === void 0) {
        return readNewestPage(state, {
          limit: args.limit,
          ...signal === void 0 ? {} : { signal }
        });
      }
      const { page } = await listPage(state, {
        limit: args.limit,
        beforeSeq: BigInt(args.beforeSeq),
        ...signal === void 0 ? {} : { signal }
      });
      return page;
    })
  };
}
