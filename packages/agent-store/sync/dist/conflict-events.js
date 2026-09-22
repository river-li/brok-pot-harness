var CONFLICT_JOURNAL_ROTATE_BYTES = 4 * 1024 * 1024;
var MAX_DEDUP_ENTRIES = 65536;
var EVENT_SCHEMA_VERSION = 1;
var PRIVATE_FILE_MODE = 384;
function sanitizeConflictJournalWarnError(error42) {
  if (!(error42 instanceof Error)) {
    return typeof error42 === "string" ? "<redacted>" : error42;
  }
  const code = error42.code;
  const redacted = new Error(code !== void 0 ? `${error42.name}: ${code}` : error42.name);
  redacted.name = error42.name;
  if (code !== void 0) {
    redacted.code = code;
  }
  return redacted;
}
function wrapConflictJournalWarn(warn2) {
  return (message, error42) => {
    warn2(message, sanitizeConflictJournalWarnError(error42));
  };
}
var O_NOFOLLOW_FLAG = fs3.constants.O_NOFOLLOW;
function nowMs() {
  return Date.now();
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function asString(value) {
  return typeof value === "string" ? value : void 0;
}
function asNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function asBoolean(value) {
  return typeof value === "boolean" ? value : void 0;
}
var KNOWN_KINDS = /* @__PURE__ */ new Set([
  "write_conflict",
  "create_conflict",
  "truncate_conflict_failed",
  "conflict_fallback_failed",
  "quota_exceeded",
  "gap"
]);
function parseConflictEvent(raw) {
  if (!isRecord(raw)) {
    return void 0;
  }
  const eventId = asString(raw.event_id);
  const journalEpoch = asString(raw.journal_epoch);
  const kindRaw = asString(raw.kind);
  const seq2 = asNumber(raw.seq);
  const tsMs = asNumber(raw.ts_ms);
  const v2 = asNumber(raw.v);
  if (eventId === void 0 || journalEpoch === void 0 || kindRaw === void 0 || seq2 === void 0 || tsMs === void 0 || v2 === void 0 || !KNOWN_KINDS.has(kindRaw)) {
    return void 0;
  }
  const kind = kindRaw;
  const sourceRaw = asString(raw.source);
  const source = sourceRaw === "local_sync" ? "local_sync" : void 0;
  const remoteOnly = asBoolean(raw.remote_only);
  return Object.assign(Object.assign({ v: v2, event_id: eventId, journal_epoch: journalEpoch, seq: seq2, ts_ms: tsMs, kind, store_id: asString(raw.store_id), original_rel_path: asString(raw.original_rel_path), conflict_rel_path: asString(raw.conflict_rel_path), original_abs_path: asString(raw.original_abs_path), conflict_abs_path: asString(raw.conflict_abs_path), preserved_bytes: asNumber(raw.preserved_bytes), scope_kind: asString(raw.scope_kind), limit_bytes: asNumber(raw.limit_bytes), usage_bytes: asNumber(raw.usage_bytes) }, source !== void 0 ? { source } : {}), remoteOnly === true ? { remote_only: true } : {});
}
function parseConflictJournalLines(body) {
  const out = [];
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }
    let parsed2;
    try {
      parsed2 = JSON.parse(trimmed);
    } catch (_a19) {
      continue;
    }
    const event = parseConflictEvent(parsed2);
    if (event !== void 0) {
      out.push(event);
    }
  }
  return out;
}
function eventToJsonLine(event) {
  const row = {
    v: event.v,
    event_id: event.event_id,
    journal_epoch: event.journal_epoch,
    seq: event.seq,
    ts_ms: event.ts_ms,
    kind: event.kind
  };
  if (event.store_id !== void 0) {
    row.store_id = event.store_id;
  }
  if (event.original_rel_path !== void 0) {
    row.original_rel_path = event.original_rel_path;
  }
  if (event.conflict_rel_path !== void 0) {
    row.conflict_rel_path = event.conflict_rel_path;
  }
  if (event.original_abs_path !== void 0) {
    row.original_abs_path = event.original_abs_path;
  }
  if (event.conflict_abs_path !== void 0) {
    row.conflict_abs_path = event.conflict_abs_path;
  }
  if (event.scope_kind !== void 0) {
    row.scope_kind = event.scope_kind;
  }
  if (event.limit_bytes !== void 0) {
    row.limit_bytes = event.limit_bytes;
  }
  if (event.usage_bytes !== void 0) {
    row.usage_bytes = event.usage_bytes;
  }
  if (event.preserved_bytes !== void 0) {
    row.preserved_bytes = event.preserved_bytes;
  }
  if (event.source !== void 0) {
    row.source = event.source;
  }
  if (event.remote_only === true) {
    row.remote_only = true;
  }
  return `${JSON.stringify(row)}
`;
}
function dedupKeyFor(emit) {
  var _a19;
  if (emit.conflictRelPath !== void 0) {
    return `${emit.storeId}\0${emit.conflictRelPath}`;
  }
  if (emit.kind === "truncate_conflict_failed") {
    return `${emit.storeId}\0\0truncate:${emit.originalRelPath}`;
  }
  if (emit.kind === "conflict_fallback_failed") {
    return `${emit.storeId}\0\0fallback:${emit.originalRelPath}`;
  }
  if (emit.kind === "quota_exceeded") {
    const scope = (_a19 = emit.scopeKind) !== null && _a19 !== void 0 ? _a19 : "store";
    return `${emit.storeId}\0\0quota:${scope}`;
  }
  return void 0;
}
function dedupKeyForEvent(event) {
  var _a19;
  if (event.store_id === void 0) {
    return void 0;
  }
  if (event.conflict_rel_path !== void 0) {
    return `${event.store_id}\0${event.conflict_rel_path}`;
  }
  if (event.kind === "quota_exceeded") {
    const scope = (_a19 = event.scope_kind) !== null && _a19 !== void 0 ? _a19 : "store";
    return `${event.store_id}\0\0quota:${scope}`;
  }
  if (event.original_rel_path === void 0) {
    return void 0;
  }
  if (event.kind === "truncate_conflict_failed") {
    return `${event.store_id}\0\0truncate:${event.original_rel_path}`;
  }
  if (event.kind === "conflict_fallback_failed") {
    return `${event.store_id}\0\0fallback:${event.original_rel_path}`;
  }
  return void 0;
}
function pendingConflictEmitKey(emit) {
  var _a19;
  return [emit.storeId, emit.kind, emit.originalRelPath, (_a19 = emit.conflictRelPath) !== null && _a19 !== void 0 ? _a19 : ""].join("\0");
}
var PENDING_EMIT_KINDS = /* @__PURE__ */ new Set([
  "write_conflict",
  "create_conflict",
  "truncate_conflict_failed",
  "conflict_fallback_failed",
  "quota_exceeded"
]);
function parsePendingConflictEmit(raw) {
  if (!isRecord(raw)) {
    return void 0;
  }
  const kind = asString(raw.kind);
  const storeId = asString(raw.storeId);
  const originalRelPath = asString(raw.originalRelPath);
  const originalAbsPath = asString(raw.originalAbsPath);
  if (kind === void 0 || storeId === void 0 || originalRelPath === void 0 || originalAbsPath === void 0 || !PENDING_EMIT_KINDS.has(kind)) {
    return void 0;
  }
  const sourceRaw = asString(raw.source);
  const remoteOnly = asBoolean(raw.remoteOnly);
  return Object.assign(Object.assign({
    kind,
    storeId,
    originalRelPath,
    conflictRelPath: asString(raw.conflictRelPath),
    originalAbsPath,
    conflictAbsPath: asString(raw.conflictAbsPath),
    preservedBytes: asNumber(raw.preservedBytes),
    scopeKind: asString(raw.scopeKind),
    limitBytes: asNumber(raw.limitBytes),
    usageBytes: asNumber(raw.usageBytes)
  }, sourceRaw === "local_sync" ? { source: "local_sync" } : {}), remoteOnly === true ? { remoteOnly: true } : {});
}
function pendingEmitToJsonLine(emit) {
  const row = {
    kind: emit.kind,
    storeId: emit.storeId,
    originalRelPath: emit.originalRelPath,
    originalAbsPath: emit.originalAbsPath
  };
  if (emit.conflictRelPath !== void 0) {
    row.conflictRelPath = emit.conflictRelPath;
  }
  if (emit.conflictAbsPath !== void 0) {
    row.conflictAbsPath = emit.conflictAbsPath;
  }
  if (emit.preservedBytes !== void 0) {
    row.preservedBytes = emit.preservedBytes;
  }
  if (emit.scopeKind !== void 0) {
    row.scopeKind = emit.scopeKind;
  }
  if (emit.limitBytes !== void 0) {
    row.limitBytes = emit.limitBytes;
  }
  if (emit.usageBytes !== void 0) {
    row.usageBytes = emit.usageBytes;
  }
  if (emit.source !== void 0) {
    row.source = emit.source;
  }
  if (emit.remoteOnly === true) {
    row.remoteOnly = true;
  }
  return `${JSON.stringify(row)}
`;
}
function openNoFollowSync(targetPath, options2) {
  const { baseFlags, mode, nofollowFlag } = options2;
  if (typeof nofollowFlag === "number") {
    return fs3.openSync(targetPath, baseFlags | nofollowFlag, mode);
  }
  let existing;
  try {
    existing = fs3.lstatSync(targetPath);
  } catch (error42) {
    if (!isEnoent(error42)) {
      throw error42;
    }
  }
  if ((existing === null || existing === void 0 ? void 0 : existing.isSymbolicLink()) === true) {
    const refusal = new Error(`refusing to open symlinked journal path: ${targetPath}`);
    refusal.code = "ELOOP";
    throw refusal;
  }
  return fs3.openSync(targetPath, baseFlags, mode);
}
function readFileNoFollowSync(targetPath) {
  const fd = openNoFollowSync(targetPath, {
    baseFlags: fs3.constants.O_RDONLY,
    mode: PRIVATE_FILE_MODE,
    nofollowFlag: O_NOFOLLOW_FLAG
  });
  try {
    return fs3.readFileSync(fd, "utf8");
  } finally {
    fs3.closeSync(fd);
  }
}
var ConflictJournal = class {
  constructor(journalPath, options2) {
    var _a19;
    this.nextSeq = 1;
    this.appendFailures = 0;
    this.rotations = 0;
    this.emittedConflicts = /* @__PURE__ */ new Set();
    this.path = journalPath;
    this.epoch = (0, import_node_crypto.randomUUID)();
    this.warn = wrapConflictJournalWarn((_a19 = options2 === null || options2 === void 0 ? void 0 : options2.warn) !== null && _a19 !== void 0 ? _a19 : ((message, error42) => {
      void message;
      void error42;
    }));
    this.hydrateDedupFromDisk();
  }
  /**
   * Seed the in-memory dedup set from the conflicts already on disk. The set is
   * otherwise process-local, so a fresh engine (restart / lock handoff) would
   * re-append a durably-queued pending emit that a previous holder already
   * journaled, producing a duplicate row with a new `event_id`. Rebuilding from
   * the current file makes that re-emit a no-op — while a conflict wiped by a
   * rotation is (correctly) absent here, so it is re-appended rather than lost.
   * Best-effort: a missing/unreadable journal simply yields an empty set.
   */
  hydrateDedupFromDisk() {
    const keys = this.readDedupKeysFromDisk();
    if (keys === void 0) {
      return;
    }
    this.replaceDedupKeys(keys);
  }
  /**
   * Read dedup keys from the on-disk journal.
   * Returns `undefined` when the journal exists but cannot be read (keep the
   * in-memory set). Returns an empty array for a missing journal (ENOENT).
   */
  readDedupKeysFromDisk() {
    let body;
    try {
      body = readFileNoFollowSync(this.path);
    } catch (error42) {
      if (!isEnoent(error42)) {
        this.warn("conflict journal dedup hydrate failed", error42);
        return void 0;
      }
      return [];
    }
    const keys = [];
    for (const event of parseConflictJournalLines(body)) {
      const key = dedupKeyForEvent(event);
      if (key === void 0) {
        continue;
      }
      keys.push(key);
    }
    return keys;
  }
  replaceDedupKeys(keys) {
    this.emittedConflicts.clear();
    for (const key of keys) {
      if (this.emittedConflicts.size >= MAX_DEDUP_ENTRIES) {
        this.emittedConflicts.clear();
      }
      this.emittedConflicts.add(key);
    }
  }
  /**
   * Rebuild the in-memory dedup set from the on-disk journal. Call before a
   * pending-sidecar flush after lock handoff so another holder's journaled
   * conflicts are visible as dedup hits instead of duplicate rows. On a
   * non-ENOENT read failure, leave the existing set untouched so a transient
   * I/O error cannot empty dedup and re-append duplicates.
   *
   * @returns `true` when the on-disk journal was read successfully (including
   *   ENOENT → empty set). `false` when the read failed and the prior in-memory
   *   set was kept — callers that strip pending mirrors must not treat that
   *   stale set as authoritative.
   */
  refreshDedupFromDisk() {
    const keys = this.readDedupKeysFromDisk();
    if (keys === void 0) {
      return false;
    }
    this.replaceDedupKeys(keys);
    return true;
  }
  appendFailureCount() {
    return this.appendFailures;
  }
  /**
   * Count of size-triggered rotations (gap rewrites) so far. A rotation wipes
   * every line written before it, so a caller flushing a batch of durably
   * queued emits can detect that an earlier-appended notice was discarded and
   * keep it queued for the next round instead of dropping it.
   */
  rotationCount() {
    return this.rotations;
  }
  /**
   * Whether {@link emit} would be a no-op because this conflict path is
   * already in the in-memory dedup set (journaled earlier this process, or
   * rebuilt from disk). Used by the pending flush so dedup hits are not
   * mistaken for fresh same-round appends.
   */
  wouldDedup(emit) {
    const key = dedupKeyFor(emit);
    return key !== void 0 && this.emittedConflicts.has(key);
  }
  /**
   * Best-effort emit. Returns `true` when recorded or already deduped so
   * callers can keep retrying a failed append.
   */
  emit(emit) {
    const key = dedupKeyFor(emit);
    if (key !== void 0 && this.emittedConflicts.has(key)) {
      return true;
    }
    try {
      this.appendEmit(emit, key);
      return true;
    } catch (error42) {
      this.appendFailures += 1;
      this.warn(`conflict journal append failed; sync round still succeeded (failures=${this.appendFailures})`, error42);
      return false;
    }
  }
  appendEmit(emit, key) {
    if (key !== void 0 && this.emittedConflicts.has(key)) {
      return;
    }
    const parent = path3.dirname(this.path);
    if (parent.length > 0) {
      ensureSecureDirectoryChain(parent);
    }
    this.maybeRotateLocked();
    const seq2 = this.nextSeq;
    const event = Object.assign(Object.assign({ v: EVENT_SCHEMA_VERSION, event_id: (0, import_node_crypto.randomUUID)(), journal_epoch: this.epoch, seq: seq2, ts_ms: nowMs(), kind: emit.kind, store_id: emit.storeId, original_rel_path: emit.originalRelPath, conflict_rel_path: emit.conflictRelPath, original_abs_path: emit.originalAbsPath, conflict_abs_path: emit.conflictAbsPath, preserved_bytes: emit.preservedBytes, scope_kind: emit.scopeKind, limit_bytes: emit.limitBytes, usage_bytes: emit.usageBytes }, emit.source !== void 0 ? { source: emit.source } : {}), emit.remoteOnly === true ? { remote_only: true } : {});
    this.writeJsonlLine(event);
    this.nextSeq = seq2 + 1;
    if (key !== void 0) {
      if (this.emittedConflicts.size >= MAX_DEDUP_ENTRIES) {
        this.emittedConflicts.clear();
      }
      this.emittedConflicts.add(key);
    }
  }
  writeJsonlLine(event) {
    const line = eventToJsonLine(event);
    const fd = openNoFollowSync(this.path, {
      baseFlags: fs3.constants.O_WRONLY | fs3.constants.O_CREAT | fs3.constants.O_APPEND,
      mode: PRIVATE_FILE_MODE,
      nofollowFlag: O_NOFOLLOW_FLAG
    });
    try {
      try {
        fs3.fchmodSync(fd, PRIVATE_FILE_MODE);
      } catch (_a19) {
      }
      fs3.writeSync(fd, line);
      try {
        fs3.fsyncSync(fd);
      } catch (_b2) {
      }
    } finally {
      fs3.closeSync(fd);
    }
  }
  maybeRotateLocked() {
    let size;
    try {
      size = fs3.statSync(this.path).size;
    } catch (error42) {
      if (typeof error42 === "object" && error42 !== null && "code" in error42 && error42.code === "ENOENT") {
        return;
      }
      this.warn("conflict journal metadata failed; skipping rotate", error42);
      return;
    }
    if (size < CONFLICT_JOURNAL_ROTATE_BYTES) {
      return;
    }
    try {
      this.forceGapRewriteLocked();
    } catch (error42) {
      this.warn("conflict journal rotate rewrite failed; appending onto oversized journal", error42);
    }
  }
  forceGapRewriteLocked() {
    const seq2 = this.nextSeq;
    const gap = {
      v: EVENT_SCHEMA_VERSION,
      event_id: (0, import_node_crypto.randomUUID)(),
      journal_epoch: this.epoch,
      seq: seq2,
      ts_ms: nowMs(),
      kind: "gap"
    };
    const line = eventToJsonLine(gap);
    const tmp = `${this.path}.rotate-tmp`;
    try {
      fs3.unlinkSync(tmp);
    } catch (error42) {
      if (!isEnoent(error42)) {
        throw error42;
      }
    }
    const fd = openNoFollowSync(tmp, {
      baseFlags: fs3.constants.O_WRONLY | fs3.constants.O_CREAT | fs3.constants.O_EXCL,
      mode: PRIVATE_FILE_MODE,
      nofollowFlag: O_NOFOLLOW_FLAG
    });
    try {
      try {
        fs3.fchmodSync(fd, PRIVATE_FILE_MODE);
      } catch (_a19) {
      }
      fs3.writeSync(fd, line);
      try {
        fs3.fsyncSync(fd);
      } catch (_b2) {
      }
    } finally {
      fs3.closeSync(fd);
    }
    fs3.renameSync(tmp, this.path);
    this.nextSeq = seq2 + 1;
    this.emittedConflicts.clear();
    this.rotations += 1;
  }
};
function conflictJournalPathForFilesDir(filesDir) {
  return path3.join(path3.dirname(path3.resolve(filesDir)), AGENT_STORE_SYNC_DIR_NAME, AGENT_STORE_CONFLICT_EVENTS_FILE_NAME);
}
function conflictPendingJournalPathForFilesDir(filesDir) {
  return path3.join(path3.dirname(path3.resolve(filesDir)), AGENT_STORE_SYNC_DIR_NAME, AGENT_STORE_CONFLICT_PENDING_FILE_NAME);
}
var PendingConflictJournal = class {
  constructor(pendingPath, options2) {
    var _a19;
    this.pending = [];
    this.keys = /* @__PURE__ */ new Set();
    this.persistFailures = 0;
    this.dirty = false;
    this.loadFailed = false;
    this.path = pendingPath;
    this.warn = wrapConflictJournalWarn((_a19 = options2 === null || options2 === void 0 ? void 0 : options2.warn) !== null && _a19 !== void 0 ? _a19 : ((message, error42) => {
      void message;
      void error42;
    }));
    const loaded = this.tryReadDisk();
    if (loaded !== void 0) {
      this.pending = loaded.pending;
      this.keys = loaded.keys;
    } else {
      this.loadFailed = true;
    }
  }
  size() {
    return this.pending.length;
  }
  isEmpty() {
    return this.pending.length === 0;
  }
  /** Snapshot copy so callers can iterate while mutating the queue. */
  list() {
    return [...this.pending];
  }
  persistFailureCount() {
    return this.persistFailures;
  }
  /**
   * Re-read the sidecar so a newly active engine picks up emits queued by a
   * previous lock holder and drops stale in-memory rows a previous holder
   * already flushed. Disk is normally the source of truth, so its contents
   * replace the in-memory queue.
   *
   * While {@link dirty} (a failed persist left unpersisted emits only in
   * memory) disk cannot simply replace memory — that would drop the
   * not-yet-persisted emits — but the in-memory copy must not be kept
   * verbatim either, or a lock handoff's disk-only emits would be lost every
   * time a persist has ever failed (the flag was previously sticky, so a
   * single failed persist permanently blinded this engine to other holders'
   * queues). Instead the two queues are unioned by dedup key and the merged
   * result re-persisted, so neither side is lost. `dirty` clears only once
   * that rewrite lands; a hard read error (unreadable file) keeps the current
   * queue rather than clobbering it.
   */
  reload() {
    const loaded = this.tryReadDisk();
    if (loaded === void 0) {
      return;
    }
    this.loadFailed = false;
    if (!this.dirty) {
      this.pending = loaded.pending;
      this.keys = loaded.keys;
      return;
    }
    const mergedByKey = /* @__PURE__ */ new Map();
    for (const emit of loaded.pending) {
      mergedByKey.set(pendingConflictEmitKey(emit), emit);
    }
    for (const emit of this.pending) {
      mergedByKey.set(pendingConflictEmitKey(emit), emit);
    }
    const merged = [...mergedByKey.values()];
    this.pending = merged;
    this.keys = new Set(mergedByKey.keys());
    this.dirty = !this.persistPending(merged);
  }
  /** Add an emit (deduped) and durably persist the new queue. */
  enqueue(emit) {
    const key = pendingConflictEmitKey(emit);
    if (this.keys.has(key)) {
      if (this.dirty || this.loadFailed) {
        this.dirty = !this.persistPending(this.pending);
      }
      return;
    }
    this.keys.add(key);
    this.pending.push(emit);
    this.dirty = !this.persistPending(this.pending);
  }
  /**
   * Replace the whole queue (after a flush attempt drains some emits) and
   * durably persist. The reduced queue is adopted only once the rewrite (or,
   * for an empty queue, the file removal) actually lands; if it fails, the
   * existing — never smaller — queue is kept so the next flush retries the
   * write. Otherwise a failed `removeFile` after a successful journal flush
   * would empty memory while the sidecar still held already-journaled emits,
   * and `isEmpty()` would skip the retry, stranding the stale file for a later
   * engine to re-append.
   */
  replaceAll(emits) {
    const next = [];
    const nextKeys = /* @__PURE__ */ new Set();
    for (const emit of emits) {
      const key = pendingConflictEmitKey(emit);
      if (nextKeys.has(key)) {
        continue;
      }
      nextKeys.add(key);
      next.push(emit);
    }
    const recoveringLoad = this.loadFailed;
    if (this.persistPending(next)) {
      if (!recoveringLoad) {
        this.pending = next;
        this.keys = nextKeys;
      }
      this.dirty = false;
    }
  }
  tryReadDisk() {
    let body;
    try {
      body = readFileNoFollowSync(this.path);
    } catch (error42) {
      if (isEnoent(error42)) {
        return { pending: [], keys: /* @__PURE__ */ new Set() };
      }
      this.warn("conflict pending journal load failed", error42);
      return void 0;
    }
    const pending = [];
    const keys = /* @__PURE__ */ new Set();
    for (const line of body.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        continue;
      }
      let parsed2;
      try {
        parsed2 = JSON.parse(trimmed);
      } catch (_a19) {
        continue;
      }
      const emit = parsePendingConflictEmit(parsed2);
      if (emit === void 0) {
        continue;
      }
      const key = pendingConflictEmitKey(emit);
      if (keys.has(key)) {
        continue;
      }
      keys.add(key);
      pending.push(emit);
    }
    return { pending, keys };
  }
  /**
   * Persist `pending` to disk (or remove the file when empty). Returns whether
   * the write landed. Best-effort — failures warn + count and never propagate,
   * so a failed sidecar write cannot abort the sync round whose remote conflict
   * object already committed.
   */
  persistPending(pending) {
    if (this.loadFailed) {
      const loaded = this.tryReadDisk();
      if (loaded === void 0) {
        this.persistFailures += 1;
        this.warn(`conflict pending journal persist skipped; sidecar still unreadable (failures=${this.persistFailures})`, void 0);
        return false;
      }
      this.loadFailed = false;
      const mergedByKey = /* @__PURE__ */ new Map();
      for (const emit of loaded.pending) {
        mergedByKey.set(pendingConflictEmitKey(emit), emit);
      }
      for (const emit of pending) {
        mergedByKey.set(pendingConflictEmitKey(emit), emit);
      }
      const merged = [...mergedByKey.values()];
      this.pending = merged;
      this.keys = new Set(mergedByKey.keys());
      return this.persistPending(merged);
    }
    try {
      if (pending.length === 0) {
        this.removeFile();
        return true;
      }
      const parent = path3.dirname(this.path);
      if (parent.length > 0) {
        ensureSecureDirectoryChain(parent);
      }
      const body = pending.map(pendingEmitToJsonLine).join("");
      this.atomicRewrite(body);
      return true;
    } catch (error42) {
      this.persistFailures += 1;
      this.warn(`conflict pending journal persist failed (failures=${this.persistFailures})`, error42);
      return false;
    }
  }
  atomicRewrite(body) {
    const tmp = `${this.path}.pending-tmp`;
    try {
      fs3.unlinkSync(tmp);
    } catch (error42) {
      if (!isEnoent(error42)) {
        throw error42;
      }
    }
    const fd = openNoFollowSync(tmp, {
      baseFlags: fs3.constants.O_WRONLY | fs3.constants.O_CREAT | fs3.constants.O_EXCL,
      mode: PENDING_FILE_MODE,
      nofollowFlag: O_NOFOLLOW_FLAG
    });
    try {
      try {
        fs3.fchmodSync(fd, PENDING_FILE_MODE);
      } catch (_a19) {
      }
      fs3.writeSync(fd, body);
      try {
        fs3.fsyncSync(fd);
      } catch (_b2) {
      }
    } finally {
      fs3.closeSync(fd);
    }
    fs3.renameSync(tmp, this.path);
  }
  removeFile() {
    try {
      fs3.unlinkSync(this.path);
    } catch (error42) {
      if (!isEnoent(error42)) {
        throw error42;
      }
    }
  }
};
var PENDING_FILE_MODE = 384;
function isEnoent(error42) {
  return typeof error42 === "object" && error42 !== null && "code" in error42 && error42.code === "ENOENT";
}
