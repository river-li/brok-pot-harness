var InMemoryLocalWakeupQueue = class {
  constructor() {
    this.pending = [];
    this.inFlightById = /* @__PURE__ */ new Map();
    this.acceptedKeys = /* @__PURE__ */ new Set();
    this.suppressedIdsByConversation = /* @__PURE__ */ new Map();
    this.revision = 0;
  }
  acceptedKey(conversationId, id) {
    return `${conversationId}\0${id}`;
  }
  enqueue(wakeup) {
    var _a19;
    const id = wakeup.id.trim();
    const key = this.acceptedKey(wakeup.conversationId, id);
    if (id.length === 0 || this.acceptedKeys.has(key)) {
      return;
    }
    if ((_a19 = this.suppressedIdsByConversation.get(wakeup.conversationId)) === null || _a19 === void 0 ? void 0 : _a19.has(id)) {
      return;
    }
    this.acceptedKeys.add(key);
    const { queue, replaced } = mergeWakeup(this.pending, Object.assign(Object.assign({}, wakeup), { id }));
    this.pending = queue;
    if (replaced) {
      this.acceptedKeys.delete(this.acceptedKey(replaced.conversationId, replaced.id));
    }
    this.revision++;
  }
  pull(conversationId) {
    const suppressed = this.suppressedIdsByConversation.get(conversationId);
    const pulled = [];
    const rest = [];
    let dropped = 0;
    for (const wakeup of this.pending) {
      if (wakeup.conversationId !== conversationId) {
        rest.push(wakeup);
        continue;
      }
      if (suppressed === null || suppressed === void 0 ? void 0 : suppressed.has(wakeup.id)) {
        this.acceptedKeys.delete(this.acceptedKey(conversationId, wakeup.id));
        dropped++;
        continue;
      }
      pulled.push(wakeup);
      this.inFlightById.set(wakeup.id, wakeup);
    }
    if (pulled.length > 0 || dropped > 0) {
      this.pending = rest;
      this.revision++;
    }
    return pulled.map((wakeup) => Object.assign({}, wakeup));
  }
  pullAll() {
    const conversationIds = [...new Set(this.pending.map((wakeup) => wakeup.conversationId))];
    return conversationIds.flatMap((conversationId) => this.pull(conversationId));
  }
  ack(ids) {
    const acked = [];
    for (const id of ids) {
      const normalizedId = id.trim();
      const wakeup = this.inFlightById.get(normalizedId);
      if (wakeup) {
        this.acceptedKeys.delete(this.acceptedKey(wakeup.conversationId, normalizedId));
        acked.push(wakeup);
      }
      this.inFlightById.delete(normalizedId);
    }
    return acked;
  }
  nack(ids, opts) {
    const requestedIds = new Set(ids.map((id) => id.trim()));
    const selected = [];
    for (const [id, wakeup] of this.inFlightById) {
      if (!requestedIds.has(id)) {
        continue;
      }
      selected.push(wakeup);
      this.inFlightById.delete(id);
    }
    if (!opts.requeue) {
      for (const wakeup of selected) {
        this.acceptedKeys.delete(this.acceptedKey(wakeup.conversationId, wakeup.id));
      }
      return;
    }
    if (selected.length === 0) {
      return;
    }
    let requeued = selected;
    for (const pendingWakeup of this.pending) {
      const { queue, replaced } = mergeWakeup(requeued, pendingWakeup);
      requeued = queue;
      if (replaced) {
        this.acceptedKeys.delete(this.acceptedKey(replaced.conversationId, replaced.id));
      }
    }
    this.pending = requeued;
    this.revision++;
  }
  suppress(conversationId, id) {
    var _a19;
    const normalizedId = id.trim();
    if (normalizedId.length === 0) {
      return;
    }
    const suppressed = (_a19 = this.suppressedIdsByConversation.get(conversationId)) !== null && _a19 !== void 0 ? _a19 : /* @__PURE__ */ new Set();
    suppressed.add(normalizedId);
    this.suppressedIdsByConversation.set(conversationId, suppressed);
    let changed = false;
    const previousLength = this.pending.length;
    this.pending = this.pending.filter((wakeup) => wakeup.conversationId !== conversationId || wakeup.id !== normalizedId);
    if (this.pending.length !== previousLength) {
      this.acceptedKeys.delete(this.acceptedKey(conversationId, normalizedId));
      changed = true;
    }
    const inFlight = this.inFlightById.get(normalizedId);
    if (inFlight && inFlight.conversationId === conversationId) {
      this.inFlightById.delete(normalizedId);
      this.acceptedKeys.delete(this.acceptedKey(conversationId, normalizedId));
      changed = true;
    }
    if (changed) {
      this.revision++;
    }
  }
  unsuppress(conversationId, id) {
    const suppressed = this.suppressedIdsByConversation.get(conversationId);
    if (!(suppressed === null || suppressed === void 0 ? void 0 : suppressed.delete(id.trim()))) {
      return;
    }
    if (suppressed.size === 0) {
      this.suppressedIdsByConversation.delete(conversationId);
    }
  }
  unsuppressId(id) {
    const normalizedId = id.trim();
    for (const conversationId of this.suppressedIdsByConversation.keys()) {
      this.unsuppress(conversationId, normalizedId);
    }
  }
  clear(conversationId) {
    let changed = false;
    const previousPendingLength = this.pending.length;
    this.pending = this.pending.filter((wakeup) => wakeup.conversationId !== conversationId);
    if (this.pending.length !== previousPendingLength) {
      changed = true;
    }
    for (const [id, wakeup] of this.inFlightById) {
      if (wakeup.conversationId === conversationId) {
        this.inFlightById.delete(id);
        changed = true;
      }
    }
    const keyPrefix = this.acceptedKey(conversationId, "");
    for (const key of this.acceptedKeys) {
      if (key.startsWith(keyPrefix)) {
        this.acceptedKeys.delete(key);
        changed = true;
      }
    }
    const hadSuppressed = this.suppressedIdsByConversation.delete(conversationId);
    if (changed || hadSuppressed) {
      this.revision++;
    }
  }
  hasPending(conversationId) {
    return conversationId === void 0 ? this.pending.length > 0 : this.pending.some((wakeup) => wakeup.conversationId === conversationId);
  }
  hasPendingMatching(conversationId, predicate) {
    return this.pending.some((wakeup) => wakeup.conversationId === conversationId && predicate(wakeup.payload));
  }
  getPendingCount() {
    return this.pending.length;
  }
  /** Count pending and pulled-but-not-acked wakeups without an idle gap. */
  getUnsettledCount() {
    return this.acceptedKeys.size;
  }
  getRevision() {
    return this.revision;
  }
};
var LEGACY_LOCAL_WAKEUP_CONVERSATION_ID = "local";
function matchesFilter(record2, filter3) {
  if (!filter3) {
    return true;
  }
  if (filter3.kind && record2.kind !== filter3.kind) {
    return false;
  }
  if (filter3.state && record2.state !== filter3.state) {
    return false;
  }
  if (filter3.ownerId && record2.ownerId !== filter3.ownerId) {
    return false;
  }
  return true;
}
var InMemoryBackgroundWorkRegistry = class {
  constructor() {
    this.records = /* @__PURE__ */ new Map();
    this.wakeups = new InMemoryLocalWakeupQueue();
  }
  upsertWork(record2) {
    this.records.set(record2.id, record2);
  }
  clearWork(id) {
    const deleted = this.records.delete(id);
    this.wakeups.unsuppressId(id);
    return deleted;
  }
  abortWork(id) {
    const record2 = this.records.get(id);
    if (!record2) {
      return false;
    }
    if (record2.abort) {
      record2.abort();
    }
    this.records.delete(id);
    this.wakeups.unsuppressId(id);
    return true;
  }
  hasRunningWork(filter3) {
    for (const record2 of this.records.values()) {
      if (record2.state !== "running") {
        continue;
      }
      if (matchesFilter(record2, filter3)) {
        return true;
      }
    }
    return false;
  }
  abortAllWork(filter3) {
    let aborted2 = 0;
    for (const record2 of [...this.records.values()]) {
      if (!matchesFilter(record2, filter3)) {
        continue;
      }
      if (record2.abort) {
        record2.abort();
      }
      aborted2++;
      this.records.delete(record2.id);
      this.wakeups.unsuppressId(record2.id);
    }
    return aborted2;
  }
  listWork(filter3) {
    const snapshots = [];
    for (const record2 of this.records.values()) {
      if (!matchesFilter(record2, filter3)) {
        continue;
      }
      snapshots.push({
        id: record2.id,
        kind: record2.kind,
        state: record2.state,
        ownerId: record2.ownerId,
        hasAbort: Boolean(record2.abort),
        metadata: record2.metadata
      });
    }
    return snapshots;
  }
  enqueue(wakeup) {
    this.wakeups.enqueue(wakeup);
  }
  pull(conversationId) {
    return this.wakeups.pull(conversationId);
  }
  ack(ids) {
    return this.wakeups.ack(ids);
  }
  nack(ids, opts) {
    this.wakeups.nack(ids, opts);
  }
  suppress(conversationId, id) {
    this.wakeups.suppress(conversationId, id);
  }
  enqueueCompletion(item) {
    this.enqueue({
      conversationId: LEGACY_LOCAL_WAKEUP_CONVERSATION_ID,
      id: item.taskId,
      payload: item,
      source: item.kind
    });
  }
  drainCompletions() {
    const wakeups = this.wakeups.pullAll();
    this.ack(wakeups.map((wakeup) => wakeup.id));
    return wakeups.map((wakeup) => wakeup.payload);
  }
  hasPendingCompletions(conversationId) {
    return this.wakeups.hasPending(conversationId);
  }
  markAwaitedCompletion(taskId) {
    this.suppress(LEGACY_LOCAL_WAKEUP_CONVERSATION_ID, taskId);
  }
  getWakeupRevision() {
    return this.wakeups.getRevision();
  }
};
