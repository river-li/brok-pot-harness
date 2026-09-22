var KV_PURPOSE = "purpose";
var KV_LEGACY_BLOB_RETIREMENT_VERSION = "legacyStoreBlobRetirementVersion";
function parseEntryRows(rows) {
  const entries = [];
  for (const row of rows) {
    if (typeof row.entry !== "string") continue;
    const entry = parseTranscriptEntry(row.entry);
    if (entry != null) entries.push(entry);
  }
  return entries;
}
var SandCheckpointPublicationError = class extends SandDomainError {
  name = "SandCheckpointPublicationError";
  isSandCheckpointPublicationError = true;
};
var SandAgentDb = class {
  db;
  statements;
  notifyBoundary = createTaskBoundaryPolicy({
    name: "agent-db.subscriber-notify"
  });
  dbPath;
  options;
  agentDirName;
  resolvedDbPath;
  onBusyError;
  hasRecoveredFromCorruption = false;
  handleRegistered = false;
  isClosed = false;
  metadataVersions = {
    agentId: createSnapshotStore(0),
    latestRootBlobId: createSnapshotStore(0),
    name: createSnapshotStore(0),
    createdAt: createSnapshotStore(0),
    mode: createSnapshotStore(0),
    isRunEverything: createSnapshotStore(0),
    lastUsedModel: createSnapshotStore(0),
    lastDebugServerPort: createSnapshotStore(0),
    currentPlanUri: createSnapshotStore(0)
  };
  constructor(dbPath, options2 = {}) {
    this.dbPath = dbPath;
    this.options = options2;
    this.agentDirName = (0, import_node_path128.basename)((0, import_node_path128.dirname)(dbPath));
    this.resolvedDbPath = (0, import_node_path128.resolve)(dbPath);
    this.onBusyError = options2.onBusyError;
    (0, import_node_fs79.mkdirSync)((0, import_node_path128.dirname)(dbPath), { recursive: true });
    const hasOtherLiveHandles = liveDbHandleCount(this.resolvedDbPath) > 0;
    this.db = openConfiguredDb(dbPath, this.agentDirName, options2, hasOtherLiveHandles);
    this.statements = prepareStatements(this.db);
    registerLiveDbHandle(this.resolvedDbPath);
    this.handleRegistered = true;
    try {
      this.seedDefaultMetadataIfMissing();
    } catch (error42) {
      this.close();
      throw error42;
    }
  }
  seedDefaultMetadataIfMissing() {
    if (this.readKv(KV_METADATA) == null) {
      this.writeMetadata(getDefaultAgentMetadata(this.agentDirName));
    }
  }
  get isOpen() {
    return !this.isClosed;
  }
  close(options2 = {}) {
    if (this.handleRegistered) {
      this.handleRegistered = false;
      releaseLiveDbHandle(this.resolvedDbPath);
    }
    if (this.isClosed) return;
    this.isClosed = true;
    if (options2.checkpoint) {
      try {
        this.db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
      } catch (error42) {
        reportHostDiagnostic({
          kind: "fallback_taken",
          stage: "agent_session",
          errorClass: boundedConnectErrorClassOf(error42)
        });
        this.options.onFailure?.({ kind: "checkpoint_on_close_failed", error: error42 });
      }
    }
    this.db.close();
  }
  runWrite(operation, write2) {
    if (this.isClosed) return false;
    try {
      const didWrite = write2() !== false;
      if (didWrite) bumpDbWriteGeneration(this.resolvedDbPath);
      return true;
    } catch (error42) {
      if (isSqliteBusyError(error42)) {
        const normalized = error42 instanceof Error ? error42 : new Error(String(error42));
        reportHostDiagnostic({
          kind: "fallback_taken",
          stage: "agent_session",
          errorClass: boundedConnectErrorClassOf(normalized)
        });
        this.options.onFailure?.({ kind: "write_busy", operation, error: normalized });
        this.onBusyError?.(operation, normalized);
        return false;
      }
      if ((this.options.recoverOnCorruption ?? true) && !this.hasRecoveredFromCorruption && isSqliteCorruptError(error42)) {
        this.options.onFailure?.({ kind: "write_corrupt", operation, error: error42 });
        if (this.recoverInPlace(error42)) {
          try {
            const didWrite = write2() !== false;
            if (didWrite) bumpDbWriteGeneration(this.resolvedDbPath);
            return true;
          } catch (retryError) {
            if (isSqliteBusyError(retryError)) return false;
            throw retryError;
          }
        }
      }
      throw error42;
    }
  }
  recoverInPlace(cause) {
    const otherLiveHandles = liveDbHandleCount(this.resolvedDbPath) - (this.handleRegistered ? 1 : 0);
    if (otherLiveHandles > 0) {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "agent_session",
        errorClass: boundedConnectErrorClassOf(cause)
      });
      this.options.onFailure?.({ kind: "recovery_deferred", otherLiveHandles });
      return false;
    }
    try {
      this.db.close();
      this.db = recoverCorruptStoreDb(this.dbPath, this.agentDirName, this.options, cause);
      this.statements = prepareStatements(this.db);
      this.seedDefaultMetadataIfMissing();
      this.hasRecoveredFromCorruption = true;
      return true;
    } catch (error42) {
      this.isClosed = true;
      if (this.handleRegistered) {
        this.handleRegistered = false;
        releaseLiveDbHandle(this.resolvedDbPath);
      }
      reportSessionDiagnostic({
        family: "maintenance",
        kind: "recovery_failed",
        agentId: this.agentDirName,
        errorClass: boundedConnectErrorClassOf(error42)
      });
      this.options.onFailure?.({ kind: "recovery_failed", error: error42 });
      return false;
    }
  }
  readKv(key) {
    if (this.isClosed) return null;
    const value = this.statements.getKv.get(key)?.value;
    return typeof value === "string" ? value : null;
  }
  writeKv(key, value) {
    return this.runWrite(`writeKv:${key}`, () => this.statements.setKv.run(key, value));
  }
  deleteKv(key) {
    this.runWrite(`deleteKv:${key}`, () => this.statements.deleteKv.run(key));
  }
  readMetadata() {
    const raw = this.readKv(KV_METADATA);
    if (raw == null) return getDefaultAgentMetadata(this.agentDirName);
    return agentMetadataSerde.deserialize(fromHex(raw));
  }
  serializeMetadata(metadata) {
    return toHex3(agentMetadataSerde.serialize(metadata));
  }
  writeMetadata(metadata) {
    return this.writeKv(KV_METADATA, this.serializeMetadata(metadata));
  }
  get(key) {
    return this.readMetadata()[key];
  }
  set(key, value) {
    const metadata = this.readMetadata();
    const current = metadata[key];
    if (key !== "latestRootBlobId" && current === value) return;
    if (key === "latestRootBlobId" && toHex3(current) === toHex3(value)) {
      return;
    }
    const wrote = this.writeMetadata({ ...metadata, [key]: value });
    if (key === "latestRootBlobId" && !wrote) {
      throw new SandCheckpointPublicationError(
        "checkpoint root metadata was not durably persisted"
      );
    }
    void this.notifyBoundary.settled().then(() => {
      this.metadataVersions[key]?.update((changes) => changes + 1);
    });
  }
  compareAndSetLatestRootBlobId({
    expectedRoot,
    nextRoot
  }) {
    const raw = this.readKv(KV_METADATA);
    if (raw == null) return false;
    const metadata = agentMetadataSerde.deserialize(fromHex(raw));
    if (toHex3(metadata.latestRootBlobId) !== toHex3(expectedRoot)) return false;
    const next = this.serializeMetadata({
      ...metadata,
      latestRootBlobId: nextRoot
    });
    let changed = false;
    const wrote = this.runWrite("compareAndSetLatestRootBlobId", () => {
      changed = Number(this.statements.compareAndSetKv.run(next, KV_METADATA, raw).changes) === 1;
    });
    return wrote && changed;
  }
  subscribe(key, listener) {
    return this.metadataVersions[key]?.subscribe(listener) ?? (() => {
    });
  }
  getSandProfile() {
    return parseProfile(this.readKv(KV_PROFILE));
  }
  setSandProfile(next) {
    const current = this.getSandProfile();
    if (current.description === next.description && current.avatarPath === next.avatarPath) {
      return;
    }
    this.writeKv(
      KV_PROFILE,
      JSON.stringify({
        description: next.description,
        avatarPath: next.avatarPath
      })
    );
  }
  getUnreadState() {
    return parseUnreadState(this.readKv(KV_UNREAD_STATE));
  }
  getAutomationSpendGuardState() {
    return resolveSpendGuardState({
      state: this.readKv(KV_SPEND_GUARD_STATE),
      legacyNudgedAt: this.readKv(KV_SPEND_GUARD_NUDGED_AT)
    });
  }
  setAutomationSpendGuardState(state) {
    const raw = serializeSpendGuardState(state);
    if (raw == null) this.deleteKv(KV_SPEND_GUARD_STATE);
    else this.writeKv(KV_SPEND_GUARD_STATE, raw);
    this.deleteKv(KV_SPEND_GUARD_NUDGED_AT);
  }
  updateUnreadState(operation, update) {
    this.runWrite(`writeKv:${KV_UNREAD_STATE}:${operation}`, () => {
      this.db.exec("BEGIN IMMEDIATE");
      try {
        const next = update(this.getUnreadState());
        if (next !== void 0) {
          this.statements.setKv.run(KV_UNREAD_STATE, JSON.stringify(next));
        }
        this.db.exec("COMMIT");
        return next !== void 0;
      } catch (error42) {
        this.db.exec("ROLLBACK");
        throw error42;
      }
    });
  }
  markActivity(at2 = Date.now(), options2 = {}) {
    this.updateUnreadState("markActivity", (current) => {
      const incrementsUnread = options2.incrementsUnread !== false && at2 > current.lastViewedAt && at2 > current.lastUnreadActivityAt;
      if (current.lastActivityAt >= at2 && !incrementsUnread) return void 0;
      return {
        ...current,
        lastActivityAt: Math.max(current.lastActivityAt, at2),
        lastUnreadActivityAt: incrementsUnread ? at2 : current.lastUnreadActivityAt,
        unreadCount: current.unreadCount + (incrementsUnread ? 1 : 0)
      };
    });
  }
  seedActivityAsRead(at2) {
    this.updateUnreadState("seedActivityAsRead", (current) => {
      if (current.lastActivityAt >= at2) return void 0;
      return {
        ...current,
        lastActivityAt: at2,
        lastUnreadActivityAt: Math.max(current.lastUnreadActivityAt, at2),
        lastViewedAt: Math.max(current.lastViewedAt, at2)
      };
    });
  }
  markViewed(at2 = Date.now(), options2 = {}) {
    this.updateUnreadState("markViewed", (current) => {
      if (options2.preserveManualUnread && current.isManuallyUnread) return void 0;
      if (!current.isManuallyUnread && current.lastViewedAt >= at2) return void 0;
      const lastViewedAt = Math.max(current.lastViewedAt, at2);
      return {
        ...current,
        lastViewedAt,
        isManuallyUnread: false,
        unreadCount: lastViewedAt >= current.lastUnreadActivityAt ? 0 : current.unreadCount
      };
    });
  }
  markUnread(at2 = Date.now()) {
    this.updateUnreadState("markUnread", (current) => {
      const lastActivityAt = current.lastActivityAt > 0 ? current.lastActivityAt : at2;
      const lastUnreadActivityAt = lastActivityAt;
      const newestEntryAt = this.getNewestDividerAnchorTimestampMs();
      const lastViewedAt = Math.min(
        current.lastViewedAt,
        lastUnreadActivityAt - 1,
        at2 - 1,
        newestEntryAt > 0 ? newestEntryAt - 1 : Number.POSITIVE_INFINITY
      );
      const unreadCount = Math.max(current.unreadCount, 1);
      if (current.isManuallyUnread && current.lastActivityAt === lastActivityAt && current.lastUnreadActivityAt === lastUnreadActivityAt && current.lastViewedAt === lastViewedAt && current.unreadCount === unreadCount) {
        return void 0;
      }
      return {
        lastActivityAt,
        lastUnreadActivityAt,
        lastViewedAt,
        isManuallyUnread: true,
        unreadCount
      };
    });
  }
  markRead(at2 = Date.now()) {
    this.updateUnreadState("markRead", (current) => {
      const lastViewedAt = Math.max(current.lastActivityAt, current.lastUnreadActivityAt, at2);
      if (!current.isManuallyUnread && current.lastViewedAt >= lastViewedAt) {
        return void 0;
      }
      return {
        ...current,
        lastViewedAt,
        isManuallyUnread: false,
        unreadCount: 0
      };
    });
  }
  getAwaitingUserResponse() {
    return parseAwaitingState(this.readKv(KV_AWAITING_USER_RESPONSE));
  }
  getLastTurnSettlement() {
    return parseTurnSettlement(this.readKv(KV_LAST_TURN_SETTLEMENT));
  }
  setLastTurnSettlement(settlement) {
    this.writeKv(KV_LAST_TURN_SETTLEMENT, JSON.stringify(settlement));
  }
  setAwaitingUserResponseForTab(tabId, state, options2) {
    const current = this.getAwaitingUserResponse();
    if (current != null && current.tabId !== tabId) return false;
    if (state == null) {
      if (current == null) return false;
      if (options2?.ifSinceBefore != null && current.since >= options2.ifSinceBefore) {
        return false;
      }
      this.setAwaitingUserResponse(null);
      return true;
    }
    if (current != null && current.tabId === state.tabId && current.reason === state.reason && current.since === state.since) {
      return false;
    }
    this.setAwaitingUserResponse(state);
    return true;
  }
  setAwaitingUserResponse(state) {
    const current = this.getAwaitingUserResponse();
    if (state == null && current == null) return;
    if (state != null && current != null && current.tabId === state.tabId && current.reason === state.reason && current.since === state.since) {
      return;
    }
    if (state == null) {
      this.deleteKv(KV_AWAITING_USER_RESPONSE);
    } else {
      this.writeKv(KV_AWAITING_USER_RESPONSE, JSON.stringify(state));
    }
  }
  getRequestIds() {
    const records2 = parseRequestRecords(this.readKv(KV_REQUEST_IDS));
    if (records2.length > 0) return records2;
    const legacy = this.readKv(KV_LATEST_REQUEST_ID)?.trim();
    return legacy != null && legacy.length > 0 ? [{ id: legacy, at: 0 }] : [];
  }
  recordRequestId(requestId2, at2 = Date.now(), prompt, source) {
    const trimmed = requestId2.trim();
    if (trimmed.length === 0) return;
    const records2 = this.getRequestIds();
    if (records2.at(-1)?.id === trimmed) return;
    const label = prompt?.trim().slice(0, REQUEST_ID_PROMPT_MAX);
    const record2 = {
      id: trimmed,
      at: at2,
      ...label != null && label.length > 0 ? { prompt: label } : {},
      ...source != null ? { source } : {}
    };
    const next = [...records2, record2].slice(-REQUEST_ID_HISTORY_MAX);
    this.writeKv(KV_REQUEST_IDS, JSON.stringify(next));
  }
  getAgentOrigin() {
    const metadata = readSandProfileCreationMetadata(getSandProfilePath((0, import_node_path128.dirname)(this.dbPath)));
    return metadata.origin ?? (this.readKv(KV_ORIGIN) === "dev" ? "dev" : "user");
  }
  setAgentOrigin(origin) {
    if (this.readKv(KV_ORIGIN) === origin) return;
    this.writeKv(KV_ORIGIN, origin);
  }
  getIntroductionPending() {
    return this.readKv(KV_INTRODUCTION_PENDING) === "1";
  }
  getIntroductionLanguage() {
    return parseIntroductionLanguage(this.readKv(KV_INTRODUCTION_LANGUAGE));
  }
  setIntroductionPending(pending, language) {
    const wasPending = this.readKv(KV_INTRODUCTION_PENDING) === "1";
    const storedLanguage = this.readKv(KV_INTRODUCTION_LANGUAGE);
    if (pending && wasPending && (language === void 0 || language === storedLanguage)) return;
    if (!pending && !wasPending && storedLanguage == null) return;
    this.runWrite("setIntroductionPending", () => {
      this.db.exec("BEGIN IMMEDIATE");
      try {
        if (pending) {
          this.statements.setKv.run(KV_INTRODUCTION_PENDING, "1");
          if (language !== void 0) this.statements.setKv.run(KV_INTRODUCTION_LANGUAGE, language);
        } else {
          this.statements.deleteKv.run(KV_INTRODUCTION_PENDING);
          this.statements.deleteKv.run(KV_INTRODUCTION_LANGUAGE);
        }
        this.db.exec("COMMIT");
      } catch (error42) {
        this.db.exec("ROLLBACK");
        throw error42;
      }
    });
  }
  getServerIntroductionState() {
    return parseServerIntroductionState(this.readKv(KV_SERVER_INTRODUCTION));
  }
  setServerIntroductionState(state) {
    if (this.readKv(KV_SERVER_INTRODUCTION) === state) return;
    this.writeKv(KV_SERVER_INTRODUCTION, state);
  }
  getHiddenEntryRepairVersion() {
    const raw = this.readKv(KV_HIDDEN_ENTRY_REPAIR_VERSION);
    if (raw == null) return 0;
    const parsed2 = Number.parseInt(raw, 10);
    return Number.isFinite(parsed2) && parsed2 > 0 ? parsed2 : 0;
  }
  setHiddenEntryRepairVersion(version3) {
    this.writeKv(KV_HIDDEN_ENTRY_REPAIR_VERSION, String(version3));
  }
  getStaleRootCleanupVersion() {
    const raw = this.readKv(KV_STALE_ROOT_CLEANUP_VERSION);
    if (raw == null) return 0;
    const parsed2 = Number.parseInt(raw, 10);
    return Number.isFinite(parsed2) && parsed2 > 0 ? parsed2 : 0;
  }
  setStaleRootCleanupVersion(version3) {
    return this.writeKv(KV_STALE_ROOT_CLEANUP_VERSION, String(version3));
  }
  getWatchedSlackChannels() {
    const raw = this.readKv(KV_WATCHED_SLACK_CHANNELS);
    if (raw == null) return [];
    return raw.split("\n").filter((channel) => channel.length > 0);
  }
  hasWatchedSlackChannel(channel) {
    const trimmed = channel.trim().toLowerCase();
    return this.getWatchedSlackChannels().some((watched) => watched.toLowerCase() === trimmed);
  }
  addWatchedSlackChannel(channel) {
    const trimmed = channel.trim();
    if (trimmed.length === 0 || trimmed.includes("\n") || this.hasWatchedSlackChannel(trimmed)) {
      return false;
    }
    const existing = this.getWatchedSlackChannels();
    this.writeKv(KV_WATCHED_SLACK_CHANNELS, [...existing, trimmed].sort().join("\n"));
    return true;
  }
  hasLegacyConversationBlobs() {
    return !this.isClosed && this.statements.hasLegacyBlob.get() != null;
  }
  legacyConversationBlobBytes() {
    if (this.isClosed) return 0;
    const total = this.statements.legacyBlobBytes.get()?.total;
    if (typeof total === "bigint") return Number(total);
    return typeof total === "number" && Number.isFinite(total) ? total : 0;
  }
  getTranscriptEntries() {
    if (this.isClosed) return [];
    return parseEntryRows(this.statements.listTranscriptEntries.all());
  }
  getTranscriptEntriesAfter(id) {
    if (this.isClosed) return [];
    const seq2 = this.statements.getTranscriptEntrySeq.get(id)?.seq;
    if (typeof seq2 !== "number") return [];
    return parseEntryRows(this.statements.listTranscriptEntriesAfterSeq.all(seq2));
  }
  getNewestDividerAnchorTimestampMs() {
    if (this.isClosed) return 0;
    const value = this.statements.newestDividerAnchorTimestamp.get()?.timestampMs;
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
  }
  getTranscriptPage(query) {
    if (this.isClosed) return { entries: [] };
    return readTranscriptPage(this.statements, query);
  }
  getTranscriptWindow(query) {
    if (this.isClosed) return { entries: [] };
    return readTranscriptWindow(this.statements, query, (entries) => this.threadCountsFor(entries));
  }
  getTranscriptTail(query) {
    if (this.isClosed) return { entries: [] };
    return readTranscriptTail(this.statements, query);
  }
  getThread(rootId) {
    if (this.isClosed) return { entries: [] };
    const root = this.getEntryById(rootId);
    const descendants = threadDescendants(rootId, this.getBranchedEntries());
    return { entries: root != null ? [root, ...descendants] : descendants };
  }
  threadCountsFor(entries) {
    const counts = branchReplyCounts(this.getBranchedEntries());
    const present = {};
    for (const entry of entries) {
      const count = counts.get(entry.id);
      if (count !== void 0) present[entry.id] = count;
    }
    return present;
  }
  getBranchedEntries() {
    if (this.isClosed) return [];
    return parseEntryRows(this.statements.listBranchedEntries.all());
  }
  getEntryById(id) {
    if (this.isClosed) return null;
    const raw = this.statements.getTranscriptEntry.get(id)?.entry;
    if (typeof raw !== "string") return null;
    return parseTranscriptEntry(raw);
  }
  getPendingAutomationCompletions() {
    if (this.isClosed) return [];
    const completions = [];
    for (const row of this.statements.listPendingAutomationCompletions.all(
      SAND_AUTOMATION_COMPLETION_MAX_PENDING
    )) {
      if (typeof row.id !== "string" || typeof row.text !== "string" || typeof row.attribution !== "string") {
        continue;
      }
      const completion = boundSandAutomationCompletion({
        id: row.id,
        text: row.text,
        attribution: row.attribution
      });
      if (completion !== void 0) completions.push(completion);
    }
    return completions;
  }
  storeAutomationCompletion(rawCompletion) {
    if (this.isClosed) return "failed";
    const completion = boundSandAutomationCompletion(rawCompletion);
    if (completion === void 0) return "failed";
    let acknowledged;
    const isCommitted = this.runWrite("storeAutomationCompletion", () => {
      this.db.exec("BEGIN IMMEDIATE");
      try {
        this.statements.insertAutomationCompletion.run(
          completion.id,
          completion.text,
          completion.attribution
        );
        const row = this.statements.getAutomationCompletionState.get(completion.id);
        acknowledged = typeof row?.acknowledged === "number" ? row.acknowledged : void 0;
        this.db.exec("COMMIT");
      } catch (error42) {
        this.db.exec("ROLLBACK");
        throw error42;
      }
    });
    if (!isCommitted || acknowledged === void 0) return "failed";
    return acknowledged === 1 ? "acknowledged" : "pending";
  }
  acknowledgeAutomationCompletions(ids) {
    if (this.isClosed) return false;
    const uniqueIds = [...new Set(ids)];
    if (uniqueIds.some((id) => this.statements.getAutomationCompletionState.get(id) === void 0)) {
      return false;
    }
    return this.runWrite("acknowledgeAutomationCompletions", () => {
      this.db.exec("BEGIN IMMEDIATE");
      try {
        for (const id of uniqueIds) {
          this.statements.acknowledgeAutomationCompletion.run(id);
        }
        this.db.exec("COMMIT");
      } catch (error42) {
        this.db.exec("ROLLBACK");
        throw error42;
      }
    });
  }
  getSpendInitiation(requestId2) {
    if (this.isClosed) return null;
    const raw = this.statements.getTranscriptEntry.get(`spend-initiation:${requestId2}`)?.entry;
    const entry = typeof raw === "string" ? parseSandSpendInitiationEntry(raw) : null;
    return entry?.agentId === this.agentDirName && entry.requestId === requestId2 ? entry : null;
  }
  appendSpendInitiation(entry) {
    const bounded = parseSandSpendInitiationEntry(JSON.stringify(entry));
    if (bounded == null || bounded.agentId !== this.agentDirName) return false;
    let isInserted = false;
    let hasMatchingInitiation = false;
    const committed = this.runWrite("appendSpendInitiation", () => {
      isInserted = Number(
        this.statements.insertTranscriptEntry.run(bounded.id, JSON.stringify(bounded)).changes
      ) > 0;
      const persisted = isInserted ? bounded : this.getSpendInitiation(bounded.requestId);
      hasMatchingInitiation = persisted?.initiation.type === bounded.initiation.type && persisted.initiation.id === bounded.initiation.id && persisted.initiation.timestampMs === bounded.initiation.timestampMs;
    });
    if (committed && isInserted) {
      publishTranscriptMutation({
        kind: "entries-upserted",
        agentId: this.agentDirName,
        entries: [bounded]
      });
    }
    return committed && hasMatchingInitiation;
  }
  appendTranscriptEntry(rawEntry) {
    const entry = withTimestampMs(rawEntry);
    let isInserted = false;
    const isCommitted = this.runWrite("appendTranscriptEntry", () => {
      isInserted = Number(this.statements.insertTranscriptEntry.run(entry.id, JSON.stringify(entry)).changes) > 0;
    });
    if (isCommitted && isInserted) {
      publishTranscriptMutation({
        kind: "entries-upserted",
        agentId: this.agentDirName,
        entries: [entry]
      });
    }
    return isCommitted;
  }
  appendTranscriptEntries(rawEntries) {
    const entries = rawEntries.map(withTimestampMs);
    if (entries.length === 0) return true;
    const inserted = [];
    const isCommitted = this.runWrite("appendTranscriptEntries", () => {
      inserted.length = 0;
      this.db.exec("BEGIN IMMEDIATE");
      try {
        for (const entry of entries) {
          const changes = Number(
            this.statements.insertTranscriptEntry.run(entry.id, JSON.stringify(entry)).changes
          );
          if (changes > 0) inserted.push(entry);
        }
        this.db.exec("COMMIT");
      } catch (error42) {
        this.db.exec("ROLLBACK");
        throw error42;
      }
    });
    if (isCommitted && inserted.length > 0) {
      publishTranscriptMutation({
        kind: "entries-upserted",
        agentId: this.agentDirName,
        entries: inserted
      });
    }
    return isCommitted;
  }
  updateTranscriptEntry(id, update, options2) {
    if (this.isClosed) return null;
    const raw = this.statements.getTranscriptEntry.get(id)?.entry;
    if (typeof raw !== "string") return null;
    const existing = parseTranscriptEntry(raw);
    if (existing == null) return null;
    const updated = update(existing);
    const isCommitted = this.runWrite(
      "updateTranscriptEntry",
      () => this.statements.updateTranscriptEntry.run(JSON.stringify(updated), id)
    );
    if (isCommitted) {
      publishTranscriptMutation({
        kind: "entries-upserted",
        agentId: this.agentDirName,
        entries: [updated]
      });
    }
    if (!isCommitted && options2?.durable === true) return null;
    return updated;
  }
  deleteTranscriptEntry(id) {
    let seq2;
    if (!this.isClosed) {
      const row = this.statements.getTranscriptEntrySeq.get(id);
      if (typeof row?.seq === "number") seq2 = row.seq;
    }
    const isCommitted = this.runWrite(
      "deleteTranscriptEntry",
      () => this.statements.deleteTranscriptEntry.run(id)
    );
    if (isCommitted) {
      publishTranscriptMutation({
        kind: "entry-deleted",
        agentId: this.agentDirName,
        entryId: id,
        seq: seq2
      });
    }
    return isCommitted;
  }
  getPendingEpisodeTurns() {
    return parsePendingEpisodeTurns(this.readKv(KV_EPISODE_PENDING));
  }
  recordEpisodeTurn(turn) {
    this.writeKv(
      KV_EPISODE_PENDING,
      JSON.stringify(appendPendingEpisodeTurn(this.getPendingEpisodeTurns(), turn))
    );
  }
  clearPendingEpisodeTurns() {
    this.deleteKv(KV_EPISODE_PENDING);
  }
  getMemoryPromptSnapshot() {
    return parseMemoryPromptSnapshot(this.readKv(KV_MEMORY_PROMPT_SNAPSHOT));
  }
  setMemoryPromptSnapshot(snapshot) {
    this.writeKv(KV_MEMORY_PROMPT_SNAPSHOT, JSON.stringify(snapshot));
  }
  clearMemoryPromptSnapshot() {
    this.deleteKv(KV_MEMORY_PROMPT_SNAPSHOT);
    this.unpinPromptSectionSoDeletedMemoryLeavesThePrompt();
  }
  unpinPromptSectionSoDeletedMemoryLeavesThePrompt() {
    const { memory: _memory, ...rest } = parsePromptSectionSnapshotsJson(
      this.readKv(KV_PROMPT_SECTION_SNAPSHOTS)
    );
    this.writeKv(KV_PROMPT_SECTION_SNAPSHOTS, JSON.stringify(rest));
  }
  getPromptPrefixSnapshot() {
    return parsePromptPrefixSnapshotJson(this.readKv(KV_PROMPT_PREFIX_SNAPSHOT));
  }
  setPromptPrefixSnapshot(snapshot) {
    this.writeKv(KV_PROMPT_PREFIX_SNAPSHOT, JSON.stringify(snapshot));
  }
  getPromptSectionSnapshot(name17) {
    return parsePromptSectionSnapshotsJson(this.readKv(KV_PROMPT_SECTION_SNAPSHOTS))[name17] ?? null;
  }
  setPromptSectionSnapshot(name17, snapshot) {
    const snapshots = parsePromptSectionSnapshotsJson(this.readKv(KV_PROMPT_SECTION_SNAPSHOTS));
    this.writeKv(KV_PROMPT_SECTION_SNAPSHOTS, JSON.stringify({ ...snapshots, [name17]: snapshot }));
  }
  getAgentProfilePromptSnapshot() {
    return parseAgentProfilePromptSnapshot(this.readKv(KV_AGENT_PROFILE_PROMPT_SNAPSHOT));
  }
  setAgentProfilePromptSnapshot(snapshot) {
    this.writeKv(KV_AGENT_PROFILE_PROMPT_SNAPSHOT, JSON.stringify(snapshot));
  }
  clearAgentProfilePromptSnapshot() {
    this.deleteKv(KV_AGENT_PROFILE_PROMPT_SNAPSHOT);
  }
  clearTransientState() {
    this.deleteKv(KV_UNREAD_STATE);
    this.deleteKv(KV_SPEND_GUARD_NUDGED_AT);
    this.deleteKv(KV_SPEND_GUARD_STATE);
    this.deleteKv(KV_AWAITING_USER_RESPONSE);
    this.deleteKv(KV_LAST_TURN_SETTLEMENT);
    this.deleteKv(KV_LATEST_REQUEST_ID);
    this.deleteKv(KV_REQUEST_IDS);
    this.deleteKv(KV_EPISODE_PENDING);
    this.deleteKv(KV_MEMORY_PROMPT_SNAPSHOT);
    this.deleteKv(KV_AGENT_PROFILE_PROMPT_SNAPSHOT);
    this.deleteKv(KV_PROMPT_PREFIX_SNAPSHOT);
    this.deleteKv(KV_PROMPT_SECTION_SNAPSHOTS);
  }
  clearConversation() {
    if (this.isClosed) return false;
    const metadata = this.readMetadata();
    const isCleared = this.runWrite("clearConversation", () => {
      this.db.exec("BEGIN IMMEDIATE");
      try {
        this.statements.clearBlobs.run();
        this.statements.clearTranscriptEntries.run();
        this.statements.clearAutomationCompletions.run();
        this.statements.deleteKv.run(KV_AWAITING_USER_RESPONSE);
        this.statements.deleteKv.run(KV_LAST_TURN_SETTLEMENT);
        this.statements.deleteKv.run(KV_LATEST_REQUEST_ID);
        this.statements.deleteKv.run(KV_REQUEST_IDS);
        this.statements.deleteKv.run(KV_EPISODE_PENDING);
        this.statements.deleteKv.run(KV_MEMORY_PROMPT_SNAPSHOT);
        this.statements.deleteKv.run(KV_AGENT_PROFILE_PROMPT_SNAPSHOT);
        this.statements.deleteKv.run(KV_PROMPT_PREFIX_SNAPSHOT);
        this.statements.deleteKv.run(KV_PROMPT_SECTION_SNAPSHOTS);
        this.statements.setKv.run(
          KV_METADATA,
          this.serializeMetadata({
            ...metadata,
            latestRootBlobId: new Uint8Array(),
            currentPlanUri: ""
          })
        );
        this.db.exec("COMMIT");
      } catch (error42) {
        this.db.exec("ROLLBACK");
        throw error42;
      }
    });
    if (!isCleared) return false;
    publishTranscriptMutation({
      kind: "conversation-cleared",
      agentId: this.agentDirName
    });
    void this.notifyBoundary.settled().then(() => {
      this.metadataVersions.latestRootBlobId.update((changes) => changes + 1);
      this.metadataVersions.currentPlanUri?.update((changes) => changes + 1);
    });
    return true;
  }
  getAgentPurpose() {
    const metadata = readSandProfileCreationMetadata(getSandProfilePath((0, import_node_path128.dirname)(this.dbPath)));
    if (metadata.purpose !== void 0) return metadata.purpose;
    const stored = this.readKv(KV_PURPOSE);
    return isSandAgentPurpose(stored) ? stored : null;
  }
  setAgentPurpose(purpose) {
    if (this.readKv(KV_PURPOSE) === purpose) return;
    this.writeKv(KV_PURPOSE, purpose);
  }
  clearAgentPurpose() {
    this.deleteKv(KV_PURPOSE);
  }
  getLegacyBlobRetirementVersion() {
    const raw = this.readKv(KV_LEGACY_BLOB_RETIREMENT_VERSION);
    if (raw == null) return 0;
    const parsed2 = Number.parseInt(raw, 10);
    return Number.isFinite(parsed2) && parsed2 > 0 ? parsed2 : 0;
  }
  retireLegacyConversationBlobs(version3) {
    if (this.isClosed) return false;
    return this.runWrite("retireLegacyConversationBlobs", () => {
      this.db.exec("BEGIN IMMEDIATE");
      try {
        this.statements.clearBlobs.run();
        this.statements.setKv.run(KV_LEGACY_BLOB_RETIREMENT_VERSION, String(version3));
        this.db.exec("COMMIT");
      } catch (error42) {
        this.db.exec("ROLLBACK");
        throw error42;
      }
    });
  }
};
