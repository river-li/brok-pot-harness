var import_node_fs90 = require("node:fs");
var import_promises75 = require("node:fs/promises");
var import_node_path148 = require("node:path");
var import_node_sqlite6 = require("node:sqlite");
init_scheduling();
init_dist3();
init_errors();
init_system_errno();
init_unknown_record();
var TRANSCRIPT_PUBLISH_DEBOUNCE_MS = 150;
var TRANSCRIPT_PUBLISH_BULK_DEBOUNCE_MS = 5e3;
var INLINE_BODY_MAX = 1024 * 1024;
var BATCH_MAX_ROWS = 100;
var BATCH_BYTE_BUDGET = 4 * 1024 * 1024;
var READ_FIRST_PAGE_ROWS = 32;
var READ_PAGE_ROWS = 256;
var READ_PAGE_CHARS = 2 * 1024 * 1024;
var READ_SLICE_MS = 10;
var STORE_FILENAME3 = "store.db";
var LEDGER_VERSION = 2;
var GENERATION_MARKER_SEQ = 0;
var FRESH_LEDGER = {
  version: LEDGER_VERSION,
  generation: 1,
  writerSeq: 0,
  publishedThroughSeq: 0
};
var TranscriptLedgerCorruptError = class extends SandDomainError {
  constructor(code) {
    super(`transcript ledger corrupt: ${code}`);
    this.code = code;
  }
  code;
  name = "TranscriptLedgerCorruptError";
};
function isInteractiveTranscriptMutation(mutation) {
  switch (mutation.kind) {
    case "agent-needs-reindex":
      return false;
    case "entries-upserted":
      return mutation.entries.some((entry) => entry.kind !== "spend-initiation");
    default:
      return true;
  }
}
function triggerOf(state) {
  const hasMutation = state.entryIds.size > 0 || state.deletedSeqs.size > 0 || state.resweep || state.cleared;
  return state.backfill && !hasMutation ? "backfill" : "mutation";
}
function isInteractiveDirty(state) {
  return state.entryIds.size > 0 || state.deletedSeqs.size > 0 || state.cleared || state.removed;
}
function isCounter(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function parseLedger(raw) {
  const parsed2 = attemptSync(() => JSON.parse(raw));
  if (!parsed2.ok) return new TranscriptLedgerCorruptError("invalid_json");
  if (!isUnknownRecord(parsed2.value)) return new TranscriptLedgerCorruptError("not_a_record");
  const { version: version3, generation, writerSeq, publishedThroughSeq, anchorSeq, anchorId } = parsed2.value;
  if (version3 !== LEDGER_VERSION) return new TranscriptLedgerCorruptError("unsupported_version");
  if (!isCounter(generation) || generation < 1) {
    return new TranscriptLedgerCorruptError("invalid_generation");
  }
  if (!isCounter(writerSeq)) return new TranscriptLedgerCorruptError("invalid_writer_seq");
  if (!isCounter(publishedThroughSeq)) {
    return new TranscriptLedgerCorruptError("invalid_published_through_seq");
  }
  if (anchorSeq === void 0 && anchorId === void 0) {
    return { version: LEDGER_VERSION, generation, writerSeq, publishedThroughSeq };
  }
  if (!isCounter(anchorSeq) || typeof anchorId !== "string" || anchorId.length === 0) {
    return new TranscriptLedgerCorruptError("invalid_anchor");
  }
  return {
    version: LEDGER_VERSION,
    generation,
    writerSeq,
    publishedThroughSeq,
    anchorSeq,
    anchorId
  };
}
var TranscriptEntryCommitRejectedError = class extends SandDomainError {
  name = "TranscriptEntryCommitRejectedError";
};
var TranscriptEntryPublisher = class {
  constructor(deps) {
    this.deps = deps;
    this.clock = deps.clock ?? realClock;
    this.readBoundary = createTaskBoundaryPolicy({
      name: "transcript-publish-read-page",
      clock: this.clock
    });
    this.report = (level, metadata) => {
      try {
        deps.report(level, metadata);
      } catch {
        this.droppedReports += 1;
      }
    };
  }
  deps;
  dirty = /* @__PURE__ */ new Map();
  ledgers = /* @__PURE__ */ new Map();
  lane = Promise.resolve();
  droppedReports = 0;
  report;
  clock;
  readBoundary;
  applyMutation(mutation) {
    switch (mutation.kind) {
      case "entries-upserted": {
        const state = this.dirtyFor(mutation.agentId);
        for (const entry of mutation.entries) state.entryIds.add(entry.id);
        return;
      }
      case "entry-deleted":
        if (mutation.seq !== void 0) {
          this.dirtyFor(mutation.agentId).deletedSeqs.set(mutation.seq, mutation.entryId);
        }
        return;
      case "agent-needs-reindex":
        this.dirtyFor(mutation.agentId).resweep = true;
        return;
      case "conversation-cleared": {
        const state = this.dirtyFor(mutation.agentId);
        state.entryIds.clear();
        state.deletedSeqs.clear();
        state.cleared = true;
        return;
      }
      case "agent-removed":
        this.ledgers.delete(mutation.agentId);
        this.dirtyFor(mutation.agentId).removed = true;
        return;
    }
  }
  flush(scope = "all") {
    const settled = this.lane.then(() => this.drain(scope)).catch((error42) => {
      this.report("warn", { outcome: "failed", error_class: errorLogTag(error42) });
    });
    this.lane = settled;
    return settled;
  }
  async flushAgent(agentId) {
    this.dirtyFor(agentId).backfill = true;
    const settled = this.lane.then(() => this.drainAgent(agentId)).catch((error42) => {
      this.report("warn", {
        outcome: "failed",
        agent_id: agentId,
        error_class: errorLogTag(error42)
      });
    });
    this.lane = settled;
    await settled;
    return !this.dirty.has(agentId);
  }
  async sweepAllAgents() {
    const startedAt = performance.now();
    let swept = 0;
    try {
      const dirents = await (0, import_promises75.readdir)(this.deps.agentsRootDir, { withFileTypes: true });
      for (const dirent of dirents) {
        if (!dirent.isDirectory()) continue;
        if (!(0, import_node_fs90.existsSync)((0, import_node_path148.join)(this.deps.agentsRootDir, dirent.name, STORE_FILENAME3))) continue;
        this.dirtyFor(dirent.name).backfill = true;
        swept += 1;
      }
    } catch (error42) {
      if (findSystemErrno(error42) !== "ENOENT") {
        this.report("warn", {
          outcome: "failed",
          trigger: "backfill",
          error_class: errorLogTag(error42),
          duration_ms: String(Math.round(performance.now() - startedAt))
        });
        return swept;
      }
    }
    this.report("info", {
      outcome: "sweep",
      swept_agents: String(swept),
      duration_ms: String(Math.round(performance.now() - startedAt))
    });
    return swept;
  }
  dirtyFor(agentId) {
    let state = this.dirty.get(agentId);
    if (state == null) {
      state = {
        entryIds: /* @__PURE__ */ new Set(),
        deletedSeqs: /* @__PURE__ */ new Map(),
        resweep: false,
        resweepDeferred: false,
        cleared: false,
        removed: false,
        backfill: false
      };
      this.dirty.set(agentId, state);
    }
    return state;
  }
  ledgerPath(agentId) {
    return (0, import_node_path148.join)(this.deps.ledgerDir, `${agentId}.json`);
  }
  async drain(scope) {
    const batch = this.dirty;
    this.dirty = /* @__PURE__ */ new Map();
    if (scope === "interactive") {
      for (const [agentId, state] of batch) {
        if (!isInteractiveDirty(state)) {
          batch.delete(agentId);
          this.dirty.set(agentId, state);
          continue;
        }
        if (state.removed || !state.resweep && !state.backfill) continue;
        batch.set(agentId, {
          ...state,
          resweep: false,
          resweepDeferred: state.resweep,
          backfill: false
        });
        const deferred = this.dirtyFor(agentId);
        deferred.resweep ||= state.resweep;
        deferred.backfill ||= state.backfill;
      }
    }
    const ordered = [...batch].sort(
      ([, a], [, b2]) => Number(triggerOf(a) === "backfill") - Number(triggerOf(b2) === "backfill")
    );
    for (const [agentId, state] of ordered) {
      try {
        await this.publishAgent(agentId, state);
      } catch (error42) {
        this.report("warn", {
          outcome: "failed",
          agent_id: agentId,
          trigger: triggerOf(state),
          error_class: errorLogTag(error42)
        });
      }
    }
  }
  async drainAgent(agentId) {
    const state = this.dirty.get(agentId);
    if (state == null) return;
    this.dirty.delete(agentId);
    await this.publishAgent(agentId, state);
  }
  async publishAgent(agentId, state) {
    const startedAt = performance.now();
    if (state.removed) {
      this.ledgers.delete(agentId);
      await (0, import_promises75.rm)(this.ledgerPath(agentId), { force: true });
      return;
    }
    if (this.deps.isTemporalAgent(agentId)) return;
    const trigger2 = triggerOf(state);
    let outcome;
    try {
      outcome = await this.publishAgentInner(agentId, state);
    } catch (error42) {
      this.redirtyUnlessClearSuperseded(agentId, state);
      this.report("warn", {
        outcome: "failed",
        agent_id: agentId,
        trigger: trigger2,
        error_class: errorLogTag(error42),
        duration_ms: String(Math.round(performance.now() - startedAt))
      });
      return;
    }
    if (outcome == null) return;
    this.report("info", {
      outcome: "ok",
      agent_id: agentId,
      trigger: trigger2,
      committed_rows: String(outcome.committedCount),
      deleted_rows: outcome.deletedCount > 0 ? String(outcome.deletedCount) : void 0,
      duration_ms: String(Math.round(performance.now() - startedAt))
    });
  }
  redirtyUnlessClearSuperseded(agentId, state) {
    const retry2 = this.dirtyFor(agentId);
    if (!retry2.cleared) {
      for (const id of state.entryIds) retry2.entryIds.add(id);
      for (const [seq2, entryId] of state.deletedSeqs) retry2.deletedSeqs.set(seq2, entryId);
      retry2.resweep ||= state.resweep;
    }
    retry2.cleared ||= state.cleared;
    retry2.backfill ||= state.backfill;
  }
  async loadLedger(agentId) {
    const cached2 = this.ledgers.get(agentId);
    if (cached2 != null) return cached2;
    let raw;
    try {
      raw = (await (0, import_promises75.readFile)(this.ledgerPath(agentId))).toString();
    } catch (error42) {
      if (findSystemErrno(error42) !== "ENOENT") throw error42;
      return FRESH_LEDGER;
    }
    const ledger = parseLedger(raw);
    if (ledger instanceof TranscriptLedgerCorruptError) throw ledger;
    return ledger;
  }
  async saveLedger(agentId, ledger) {
    await writeFileAtomic(this.ledgerPath(agentId), JSON.stringify(ledger));
    this.ledgers.set(agentId, ledger);
  }
  async publishAgentInner(agentId, state) {
    const dbPath = (0, import_node_path148.join)(this.deps.agentsRootDir, agentId, STORE_FILENAME3);
    if (!(0, import_node_fs90.existsSync)(dbPath)) return null;
    let ledger = await this.loadLedger(agentId);
    let maxSeq = 0;
    let minRow = null;
    const rows = /* @__PURE__ */ new Map();
    let resweep = false;
    let readHold;
    const db = new import_node_sqlite6.DatabaseSync(dbPath, { readOnly: true });
    try {
      db.exec(`PRAGMA busy_timeout = ${DB_BUSY_TIMEOUT_MS}`);
      const maxRow = db.prepare("SELECT COALESCE(MAX(seq), 0) AS maxSeq FROM transcript_entries").get();
      maxSeq = typeof maxRow?.maxSeq === "number" ? maxRow.maxSeq : 0;
      const first = db.prepare("SELECT seq, id FROM transcript_entries ORDER BY seq LIMIT 1").get();
      if (first != null && typeof first.seq === "number" && typeof first.id === "string") {
        minRow = { seq: first.seq, id: first.id };
      }
      if (!state.cleared && ledger.anchorId != null && ledger.anchorSeq != null && !state.deletedSeqs.has(ledger.anchorSeq)) {
        const anchorIntact = minRow != null && minRow.seq === ledger.anchorSeq && minRow.id === ledger.anchorId;
        if (!anchorIntact) state.cleared = true;
      }
      if (state.cleared) {
        ledger = {
          ...ledger,
          generation: ledger.generation + 1,
          publishedThroughSeq: 0,
          anchorSeq: void 0,
          anchorId: void 0
        };
        await this.saveLedger(agentId, ledger);
        state.cleared = false;
        state.resweep = true;
        state.deletedSeqs.set(GENERATION_MARKER_SEQ, void 0);
      }
      resweep = state.resweep;
      const collect = (row) => {
        if (row != null && typeof row.seq === "number" && typeof row.id === "string" && typeof row.entry === "string" && typeof row.entryKind === "string") {
          rows.set(row.seq, {
            seq: row.seq,
            entryId: row.id,
            entryKind: row.entryKind,
            entry: row.entry
          });
        }
      };
      const pageStatement = db.prepare(
        `SELECT seq, id, entry, json_extract(entry, '$.kind') AS entryKind
				 FROM transcript_entries WHERE seq > ? AND seq <= ? ORDER BY seq LIMIT ?`
      );
      let sliceStartedAt = this.clock.monotonicNow();
      let pageRows = READ_FIRST_PAGE_ROWS;
      for (let afterSeq = resweep ? 0 : ledger.publishedThroughSeq; afterSeq < maxSeq; ) {
        const page = pageStatement.all(afterSeq, maxSeq, pageRows);
        let pageChars = 0;
        for (const row of page) {
          collect(row);
          if (typeof row.entry === "string") pageChars += row.entry.length;
        }
        const lastSeq = page.at(-1)?.seq;
        if (page.length < pageRows || typeof lastSeq !== "number") break;
        afterSeq = lastSeq;
        pageRows = Math.min(
          READ_PAGE_ROWS,
          Math.max(1, Math.floor(READ_PAGE_CHARS * page.length / Math.max(1, pageChars)))
        );
        if (elapsedMs(sliceStartedAt, this.clock.monotonicNow()) >= READ_SLICE_MS) {
          readHold ??= createProcessKeepAlive({ name: "transcript-publish-read-page" });
          await this.readBoundary.settled();
          sliceStartedAt = this.clock.monotonicNow();
        }
      }
      if (!resweep && state.entryIds.size > 0) {
        const byIdStatement = db.prepare(
          `SELECT seq, id, entry, json_extract(entry, '$.kind') AS entryKind
					 FROM transcript_entries WHERE id = ?`
        );
        for (const entryId of state.entryIds) collect(byIdStatement.get(entryId));
      }
    } finally {
      readHold?.dispose();
      db.close();
    }
    const deletedSeqs = [...state.deletedSeqs].filter(([seq2]) => !rows.has(seq2));
    if (rows.size === 0 && deletedSeqs.length === 0) return null;
    let writerSeq = Math.max(ledger.writerSeq, maxSeq);
    let committedCount = 0;
    let deletedCount = 0;
    const orderedRows = [...rows.values()].sort((a, b2) => a.seq - b2.seq);
    for (let start = 0; start < orderedRows.length; ) {
      const batch = [];
      let batchBytes = 0;
      while (start < orderedRows.length && batch.length < BATCH_MAX_ROWS) {
        const row = orderedRows[start];
        const bytes = Buffer.from(row.entry);
        if (batch.length > 0 && batchBytes + bytes.byteLength > BATCH_BYTE_BUDGET) break;
        writerSeq = Math.max(writerSeq + 1, row.seq);
        if (bytes.byteLength > INLINE_BODY_MAX) {
          const blobHash = sha256Hex(bytes);
          await this.deps.putBlob(blobHash, bytes);
          batch.push({
            seq: row.seq,
            entryKind: row.entryKind,
            entryId: row.entryId,
            blobHash,
            updatedSeq: writerSeq
          });
        } else {
          batch.push({
            seq: row.seq,
            entryKind: row.entryKind,
            entryId: row.entryId,
            body: bytes,
            updatedSeq: writerSeq
          });
          batchBytes += bytes.byteLength;
        }
        start += 1;
      }
      writerSeq = await this.sendCommit({
        agentId,
        generation: ledger.generation,
        writerSeq,
        entries: batch,
        deletes: []
      });
      committedCount += batch.length;
    }
    for (let start = 0; start < deletedSeqs.length; start += BATCH_MAX_ROWS) {
      const deletes = deletedSeqs.slice(start, start + BATCH_MAX_ROWS).map(([seq2, entryId]) => {
        writerSeq = Math.max(writerSeq + 1, seq2);
        return { seq: seq2, updatedSeq: writerSeq, ...entryId == null ? {} : { entryId } };
      });
      writerSeq = await this.sendCommit({
        agentId,
        generation: ledger.generation,
        writerSeq,
        entries: [],
        deletes
      });
      deletedCount += deletes.length;
    }
    await this.saveLedger(agentId, {
      version: LEDGER_VERSION,
      generation: ledger.generation,
      writerSeq,
      publishedThroughSeq: state.resweepDeferred && !resweep ? 0 : maxSeq,
      anchorSeq: minRow?.seq,
      anchorId: minRow?.id
    });
    return { committedCount, deletedCount };
  }
  async sendCommit(args) {
    const { agentId, generation, entries, deletes } = args;
    let writerSeq = args.writerSeq;
    const result = await this.deps.commit({ agentId, generation, entries, deletes });
    if (result.rejections.length === 0) return writerSeq;
    const rejectedSeqs = new Set(result.rejections.map((rejection) => rejection.seq));
    for (const rejection of result.rejections) {
      writerSeq = Math.max(writerSeq, rejection.currentUpdatedSeq);
    }
    const reissue = (seq2) => {
      writerSeq = Math.max(writerSeq + 1, seq2);
      return writerSeq;
    };
    const retry2 = await this.deps.commit({
      agentId,
      generation,
      entries: entries.filter((entry) => rejectedSeqs.has(entry.seq)).map((entry) => ({ ...entry, updatedSeq: reissue(entry.seq) })),
      deletes: deletes.filter((del) => rejectedSeqs.has(del.seq)).map((del) => ({ ...del, updatedSeq: reissue(del.seq) }))
    });
    if (retry2.rejections.length > 0) {
      throw new TranscriptEntryCommitRejectedError(
        `transcript entry commit rejected for ${agentId}: ${retry2.rejections.length} row(s)`
      );
    }
    return writerSeq;
  }
};
