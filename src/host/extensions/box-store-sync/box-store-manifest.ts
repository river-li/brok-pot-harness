var AGENT_STORE_DB_BASENAMES = ["store.db", "conversation-blobs.db"];
var STORE_DB_MANIFEST_KEY_RE = /^home\/box\/sand-data\/agents\/([^/]+)\/store\.db$/;
function countStoreDbManifestEntries(manifest) {
  if (manifest == null) return 0;
  let count = 0;
  for (const [relPath, entry] of manifest) {
    if (STORE_DB_MANIFEST_KEY_RE.test(relPath) && !isSymlinkManifestValue(entry)) count += 1;
  }
  return count;
}
function getStoreDbManifestAgentIds(manifest) {
  const agentIds = /* @__PURE__ */ new Set();
  for (const [relPath, entry] of manifest ?? []) {
    const match2 = STORE_DB_MANIFEST_KEY_RE.exec(relPath);
    if (match2?.[1] != null && !isSymlinkManifestValue(entry)) agentIds.add(match2[1]);
  }
  return agentIds;
}
var AGENT_DIR_MANIFEST_KEY_RE = /^home\/box\/sand-data\/agents\/([^/]+)\//;
function countAgentDirManifestEntries(manifest) {
  if (manifest == null) return 0;
  const ids = /* @__PURE__ */ new Set();
  for (const relPath of manifest.keys()) {
    const match2 = AGENT_DIR_MANIFEST_KEY_RE.exec(relPath);
    if (match2 != null) ids.add(match2[1]);
  }
  return ids.size;
}
var manifestVersionSchema = external_exports.object({ version: external_exports.number().int() });
var BoxStoreUnsupportedManifestVersionError = class extends SandBoxStoreSyncError {
  constructor(version3) {
    super(`unsupported box store manifest version ${version3}`);
    this.version = version3;
  }
  version;
  name = "BoxStoreUnsupportedManifestVersionError";
};
var BoxStoreManifestPathConflictError = class extends SandBoxStoreSyncError {
  name = "BoxStoreManifestPathConflictError";
  constructor() {
    super("box store manifest contains conflicting node paths");
  }
};
function hasManifestPathConflict(entries) {
  const relPaths = new Set(Object.keys(entries));
  for (const relPath of relPaths) {
    for (let separatorIndex = relPath.indexOf("/"); separatorIndex >= 0; separatorIndex = relPath.indexOf("/", separatorIndex + 1)) {
      if (relPaths.has(relPath.slice(0, separatorIndex))) return true;
    }
  }
  return false;
}
function parseManifest(bytes, onWriteBlockedError) {
  const invalidJson = /* @__PURE__ */ Symbol();
  let value;
  try {
    value = JSON.parse(Buffer.from(bytes).toString("utf8"));
  } catch {
    value = invalidJson;
  }
  if (value === invalidJson) return null;
  const header = manifestVersionSchema.safeParse(value);
  if (header.success && header.data.version !== BOX_STORE_LEGACY_MANIFEST_VERSION && header.data.version !== BOX_STORE_MANIFEST_VERSION) {
    const error41 = new BoxStoreUnsupportedManifestVersionError(header.data.version);
    onWriteBlockedError?.(error41);
    throw error41;
  }
  const parsed2 = manifestSchema.safeParse(value);
  if (!parsed2.success) return null;
  if (hasManifestPathConflict(parsed2.data.entries)) {
    const error41 = new BoxStoreManifestPathConflictError();
    onWriteBlockedError?.(error41);
    throw error41;
  }
  return parsed2.data;
}
var BoxStoreManifestRevisionState = class {
  revisionValue = 0;
  persisted;
  pendingRevisionCounts = /* @__PURE__ */ new Map();
  constructionCount = 0;
  constructor(persisted) {
    this.persisted = persisted;
  }
  get revision() {
    return this.revisionValue;
  }
  get persistedRevision() {
    return this.persisted?.revision;
  }
  get snapshotConstructionCount() {
    return this.constructionCount;
  }
  get hasPendingWriteForRevision() {
    return (this.pendingRevisionCounts.get(this.revisionValue) ?? 0) > 0;
  }
  markChanged() {
    this.revisionValue += 1;
  }
  capture(manifest, fullyHydrated, isRequiredWrite) {
    if (!isRequiredWrite && ((this.pendingRevisionCounts.get(this.revisionValue) ?? 0) > 0 || this.persisted?.revision === this.revisionValue && this.persisted.fullyHydrated === fullyHydrated)) {
      return null;
    }
    const entries = {};
    for (const [relPath, entry] of manifest) {
      entries[relPath] = entry;
    }
    this.constructionCount += 1;
    this.pendingRevisionCounts.set(
      this.revisionValue,
      (this.pendingRevisionCounts.get(this.revisionValue) ?? 0) + 1
    );
    return { revision: this.revisionValue, entries };
  }
  markPersisted(capture, fullyHydrated) {
    this.persisted = { revision: capture.revision, fullyHydrated };
  }
  markFailed() {
    this.persisted = void 0;
  }
  release(capture) {
    const count = this.pendingRevisionCounts.get(capture.revision);
    if (count == null || count <= 1) {
      this.pendingRevisionCounts.delete(capture.revision);
    } else {
      this.pendingRevisionCounts.set(capture.revision, count - 1);
    }
  }
};
var ManifestRetryStoppedError = class extends SandDomainError {
  constructor(conflict) {
    super(conflict.message);
    this.conflict = conflict;
  }
  conflict;
  name = "ManifestRetryStoppedError";
};
var BoxStoreManifestStore = class {
  deps;
  now;
  log;
  writeManifestV2;
  isDisposed;
  manifest;
  manifestRevisions = /* @__PURE__ */ new WeakMap();
  manifestAncestorRefCounts = /* @__PURE__ */ new WeakMap();
  fullyHydrated;
  hydrationManifestReadBlocked = false;
  manifestWriteBlock;
  uncommittedStoreDbEntries = /* @__PURE__ */ new Map();
  manifestWriteQueue = Promise.resolve();
  manifestLoad;
  manifestReads = createSingleFlight({
    read: () => {
      const load2 = this.manifestLoad;
      invariant(load2 != null, "manifest read requires a load request");
      return this.readManifest(load2.storeId).then(
        (manifest) => () => load2.resolve(manifest),
        (error41) => () => load2.reject(error41)
      );
    },
    install: (settle) => {
      this.manifestLoad = void 0;
      settle();
    }
  });
  constructor(args) {
    this.deps = args.deps;
    this.now = args.now;
    this.log = args.log;
    this.isDisposed = args.isDisposed;
    this.writeManifestV2 = args.deps.manifestV2;
  }
  get writeQueue() {
    return this.manifestWriteQueue;
  }
  get isManifestV2Enabled() {
    return this.writeManifestV2;
  }
  enrollManifestV2() {
    this.writeManifestV2 = true;
  }
  objectStore(storeId) {
    return this.deps.objectStoreProvider.forStore(storeId);
  }
  configuredManifestVersion() {
    return this.writeManifestV2 ? BOX_STORE_MANIFEST_VERSION : BOX_STORE_LEGACY_MANIFEST_VERSION;
  }
  configuredEntry(entry) {
    if (this.writeManifestV2) return entry;
    if (entry.kind === "symlink") return void 0;
    return { sha: entry.sha, size: entry.size };
  }
  configuredEntries(entries) {
    const configured2 = {};
    for (const [relPath, entry] of Object.entries(entries)) {
      const value = this.configuredEntry(entry);
      if (value != null) configured2[relPath] = value;
    }
    return configured2;
  }
  parseManifest(bytes) {
    const parsed2 = parseManifest(bytes, (error41) => {
      if (error41 instanceof BoxStoreUnsupportedManifestVersionError || this.manifestWriteBlock == null) {
        this.manifestWriteBlock = error41;
      }
    });
    if (parsed2?.version === BOX_STORE_MANIFEST_VERSION) {
      this.writeManifestV2 = true;
    }
    return parsed2;
  }
  manifestRevisionState(manifest) {
    let state = this.manifestRevisions.get(manifest);
    if (state == null) {
      state = new BoxStoreManifestRevisionState();
      this.manifestRevisions.set(manifest, state);
    }
    return state;
  }
  initializeManifestRevision(manifest, persisted) {
    this.manifestRevisions.set(manifest, new BoxStoreManifestRevisionState(persisted));
  }
  ancestorRefCounts(manifest) {
    let counts = this.manifestAncestorRefCounts.get(manifest);
    if (counts != null) return counts;
    counts = /* @__PURE__ */ new Map();
    for (const relPath of manifest.keys()) {
      this.adjustAncestorRefCounts(counts, relPath, 1);
    }
    this.manifestAncestorRefCounts.set(manifest, counts);
    return counts;
  }
  adjustAncestorRefCounts(counts, relPath, delta) {
    for (let separatorIndex = relPath.indexOf("/"); separatorIndex >= 0; separatorIndex = relPath.indexOf("/", separatorIndex + 1)) {
      const ancestor = relPath.slice(0, separatorIndex);
      const next = (counts.get(ancestor) ?? 0) + delta;
      if (next === 0) {
        counts.delete(ancestor);
      } else {
        counts.set(ancestor, next);
      }
    }
  }
  deleteManifestEntryWithIndex(manifest, relPath, counts) {
    if (!manifest.delete(relPath)) return false;
    if (counts != null) this.adjustAncestorRefCounts(counts, relPath, -1);
    this.uncommittedStoreDbEntries.delete(relPath);
    this.manifestRevisionState(manifest).markChanged();
    return true;
  }
  setManifestEntry(manifest, relPath, entry) {
    const configured2 = this.configuredEntry(entry);
    if (configured2 == null) {
      return this.deleteManifestEntryWithIndex(
        manifest,
        relPath,
        this.manifestAncestorRefCounts.get(manifest)
      );
    }
    const counts = this.ancestorRefCounts(manifest);
    let removedConflict = false;
    for (let separatorIndex = relPath.indexOf("/"); separatorIndex >= 0; separatorIndex = relPath.indexOf("/", separatorIndex + 1)) {
      removedConflict = this.deleteManifestEntryWithIndex(manifest, relPath.slice(0, separatorIndex), counts) || removedConflict;
    }
    if ((counts.get(relPath) ?? 0) > 0) {
      const descendantPrefix = `${relPath}/`;
      for (const existingPath of manifest.keys()) {
        if (!existingPath.startsWith(descendantPrefix)) continue;
        removedConflict = this.deleteManifestEntryWithIndex(manifest, existingPath, counts) || removedConflict;
      }
    }
    const current = manifest.get(relPath);
    if (boxStoreManifestEntriesEqual(current, configured2)) return removedConflict;
    manifest.set(relPath, configured2);
    if (current == null) this.adjustAncestorRefCounts(counts, relPath, 1);
    this.manifestRevisionState(manifest).markChanged();
    return true;
  }
  deleteManifestEntry(manifest, relPath) {
    return this.deleteManifestEntryWithIndex(
      manifest,
      relPath,
      this.manifestAncestorRefCounts.get(manifest)
    );
  }
  elapsedDurationMs(startedAt) {
    return Math.max(0, this.now() - startedAt);
  }
  markStoreDbEntriesCommitted(entries) {
    for (const [relPath, pending] of this.uncommittedStoreDbEntries) {
      const committed = entries[relPath];
      if (boxStoreManifestEntriesEqual(committed, pending)) {
        this.uncommittedStoreDbEntries.delete(relPath);
      }
    }
  }
  isLiveManifest(manifest) {
    return manifest != null && this.manifest === manifest;
  }
  isStoreDbSweepCommitted(manifest, capturedThisSweep) {
    if (!this.isLiveManifest(manifest)) return false;
    for (const relPath of capturedThisSweep) {
      if (this.uncommittedStoreDbEntries.has(relPath)) return false;
    }
    return true;
  }
  loadManifest(storeId) {
    if (this.manifestWriteBlock != null) return Promise.reject(this.manifestWriteBlock);
    if (this.manifest != null) return Promise.resolve(this.manifest);
    let load2 = this.manifestLoad;
    if (load2 == null || !this.manifestReads.isInFlight) {
      load2 = { storeId, ...Promise.withResolvers() };
      this.manifestLoad = load2;
    }
    void this.manifestReads.run();
    return load2.promise;
  }
  async readManifest(storeId) {
    const map4 = /* @__PURE__ */ new Map();
    let persisted;
    const hydrationHandoffPending = this.deps.hydrationHandoffMarkerPath != null && (0, import_node_fs10.existsSync)(this.deps.hydrationHandoffMarkerPath);
    try {
      const bytes = await this.objectStore(storeId).get(BOX_STORE_MANIFEST_REL_PATH);
      if (bytes == null && hydrationHandoffPending) {
        throw new SandBoxStoreSyncError(
          "manifest missing while legacy hydration handoff is pending"
        );
      }
      if (bytes != null) {
        const decoded = this.parseManifest(bytes);
        if (decoded == null) {
          throw new SandBoxStoreSyncError(
            hydrationHandoffPending ? "manifest unreadable while legacy hydration handoff is pending" : "box store manifest is present but unparseable"
          );
        }
        if (hydrationHandoffPending && decoded.fullyHydrated == null && this.deps.hydrationHandoffMarkerPath != null) {
          await removeHydrationHandoffMarker(this.deps.hydrationHandoffMarkerPath);
        }
        this.hydrationManifestReadBlocked = false;
        this.fullyHydrated = decoded.fullyHydrated;
        let isCanonicalSnapshot = true;
        const entries = Object.fromEntries(
          Object.entries(decoded.entries).filter(([relPath]) => {
            if (!isHydrationHandoffManifestPath(relPath)) return true;
            isCanonicalSnapshot = false;
            return false;
          })
        );
        for (const [relPath, entry] of Object.entries(entries)) {
          map4.set(relPath, entry);
        }
        if (isCanonicalSnapshot && decoded.version === this.configuredManifestVersion()) {
          persisted = {
            revision: 0,
            fullyHydrated: decoded.fullyHydrated
          };
        }
      }
    } catch (error41) {
      if (error41 instanceof BoxStoreUnsupportedManifestVersionError || error41 instanceof BoxStoreManifestPathConflictError) {
        throw error41;
      }
      if (hydrationHandoffPending) {
        this.hydrationManifestReadBlocked = true;
        throw error41;
      }
      this.log(
        `manifest load failed; failing closed instead of starting empty (an empty start would publish over the canonical manifest, SAND-3226/SAND-3191); the next load retries the read: ${errorMessage(error41)}`
      );
      throw error41;
    }
    this.initializeManifestRevision(map4, persisted);
    this.manifest ??= map4;
    return this.manifest;
  }
  saveManifest(storeId, options2 = {}) {
    if (this.manifestWriteBlock != null) return Promise.reject(this.manifestWriteBlock);
    if (this.hydrationManifestReadBlocked) {
      return Promise.reject(
        new Error("manifest write blocked until hydration metadata can be read")
      );
    }
    const manifest = this.manifest;
    if (manifest == null) {
      return Promise.reject(
        new SandBoxStoreSyncError(
          "manifest write refused: the canonical manifest has not been read, so this save could only publish an unseeded snapshot over it (clearStore and a successful load both seed the manifest first)"
        )
      );
    }
    const revisionState = this.manifestRevisionState(manifest);
    const isRequiredWrite = options2.acceptMatchingCanonicalOnConflict === true || options2.isForced === true || options2.hydrationUpdate != null;
    const captureTrace = options2.captureTrace;
    const queuedAt = captureTrace == null ? void 0 : this.now();
    const capture = revisionState.capture(manifest, this.fullyHydrated, isRequiredWrite);
    if (capture == null) {
      if (!revisionState.hasPendingWriteForRevision) return Promise.resolve();
      const settled = this.manifestWriteQueue;
      if (captureTrace == null || queuedAt == null) return settled;
      return settled.then(() => {
        captureTrace.queueDurationMs += this.elapsedDurationMs(queuedAt);
      });
    }
    const run = async () => {
      if (captureTrace != null && queuedAt != null) {
        captureTrace.queueDurationMs += this.elapsedDurationMs(queuedAt);
      }
      const commitStartedAt = this.now();
      try {
        if (this.manifestWriteBlock != null) throw this.manifestWriteBlock;
        let fullyHydrated = this.fullyHydrated;
        if (options2.hydrationUpdate === "mark-incomplete") {
          fullyHydrated = false;
        } else if (options2.hydrationUpdate === "promote-complete" || options2.hydrationUpdate === "reset-complete") {
          fullyHydrated = true;
        }
        const entries = this.configuredEntries(capture.entries);
        await this.writeManifestWithRetry(storeId, entries, fullyHydrated, options2);
        revisionState.markPersisted(capture, fullyHydrated);
        this.fullyHydrated = fullyHydrated;
        this.markStoreDbEntriesCommitted(entries);
      } catch (error41) {
        revisionState.markFailed();
        throw error41;
      } finally {
        if (captureTrace != null) {
          captureTrace.manifestCommitDurationMs += this.elapsedDurationMs(commitStartedAt);
        }
        revisionState.release(capture);
      }
    };
    const save = this.manifestWriteQueue.then(run, run);
    this.manifestWriteQueue = save.then(
      () => {
      },
      () => {
      }
    );
    return save;
  }
  async writeManifestWithRetry(storeId, entries, fullyHydrated, options2 = {}) {
    let attempts2 = 0;
    let lastConflict;
    try {
      await this.deps.manifestRetry.runWithRetry(async (attempt) => {
        if (attempt > 1 && this.isDisposed() && lastConflict != null) {
          throw new ManifestRetryStoppedError(lastConflict);
        }
        attempts2 = attempt;
        const manifest = {
          version: this.configuredManifestVersion(),
          updatedAtMs: this.now(),
          writerWindowId: this.deps.windowId,
          fullyHydrated,
          entries
        };
        try {
          await this.writeManifestAttempt(storeId, manifest);
        } catch (error41) {
          if (error41 instanceof ManifestRetryStoppedError) {
            lastConflict = error41.conflict;
          } else if (error41 instanceof BoxStoreCanonicalWriteConflictError) {
            lastConflict = error41;
          }
          throw error41;
        }
      });
      return;
    } catch (error41) {
      const failure2 = error41 instanceof RetryExhaustedError ? error41.cause : error41;
      const conflict = failure2 instanceof ManifestRetryStoppedError ? failure2.conflict : failure2;
      if (!(conflict instanceof BoxStoreCanonicalWriteConflictError)) {
        throw error41;
      }
      if (await this.handleExhaustedManifestConflict(
        storeId,
        entries,
        fullyHydrated,
        conflict,
        attempts2,
        options2
      )) {
        return;
      }
      throw conflict;
    }
  }
  async writeManifestAttempt(storeId, manifest) {
    try {
      await this.objectStore(storeId).put(
        BOX_STORE_MANIFEST_REL_PATH,
        new Uint8Array(Buffer.from(JSON.stringify(manifest), "utf8"))
      );
    } catch (error41) {
      if (error41 instanceof BoxStoreCanonicalWriteConflictError && this.isDisposed()) {
        throw new ManifestRetryStoppedError(error41);
      }
      if (error41 instanceof BoxStoreCanonicalWriteConflictError) {
        const canonical = await this.objectStore(storeId).get(BOX_STORE_MANIFEST_REL_PATH);
        if (canonical != null) this.parseManifest(canonical);
        this.log(
          `manifest save lost a concurrent-write race; retry policy will use the winner's baseline${error41.conflictRelPath == null ? "" : ` (lost attempt preserved at ${error41.conflictRelPath})`}`
        );
      }
      throw error41;
    }
  }
  async handleExhaustedManifestConflict(storeId, entries, fullyHydrated, conflict, attempts2, options2) {
    const canonical = await this.readCanonicalManifestForDiagnostics(storeId);
    const attempted = Object.entries(entries);
    const covered = canonical != null && attempted.length > 0 && attempted.every(([relPath, entry]) => {
      const held = canonical.entries[relPath];
      return boxStoreManifestEntriesEqual(held, entry);
    });
    const canonicalMatchesAttempt = covered && canonical != null && Object.keys(canonical.entries).length === attempted.length && canonical.fullyHydrated === fullyHydrated;
    const live = this.manifest ?? /* @__PURE__ */ new Map();
    const liveViewChanged = live.size !== attempted.length || attempted.some(([relPath, entry]) => {
      const current = live.get(relPath);
      return !boxStoreManifestEntriesEqual(current, entry);
    });
    const accepted = options2.acceptMatchingCanonicalOnConflict === true && canonicalMatchesAttempt && !liveViewChanged;
    this.reportManifestWriteConflict({
      storeId,
      attempts: attempts2,
      accepted,
      covered,
      canonicalMatchesAttempt,
      liveViewChanged,
      attemptedEntries: attempted.length,
      lastBaseEtag: conflict.baseEtag,
      lastBaselineSource: conflict.baselineSource,
      lastConflictRelPath: conflict.conflictRelPath,
      canonicalReadable: canonical != null,
      canonicalEntryCount: canonical == null ? null : Object.keys(canonical.entries).length,
      canonicalUpdatedAtMs: canonical?.updatedAtMs ?? null,
      canonicalWriterWindowId: canonical?.writerWindowId ?? null,
      ourWindowId: this.deps.windowId ?? null
    });
    if (accepted) {
      this.log(
        `manifest save lost a concurrent-write race; canonical manifest already covers the attempted entries (winner ${canonical?.writerWindowId ?? "unknown"}${conflict.conflictRelPath == null ? "" : `; lost attempt preserved at ${conflict.conflictRelPath}`})`
      );
    }
    return accepted;
  }
  async readCanonicalManifestForDiagnostics(storeId) {
    try {
      const bytes = await this.objectStore(storeId).get(BOX_STORE_MANIFEST_REL_PATH);
      if (bytes == null) return null;
      const parsed2 = parseManifest(bytes);
      if (parsed2 == null) return null;
      return {
        entries: parsed2.entries,
        updatedAtMs: parsed2.updatedAtMs,
        writerWindowId: parsed2.writerWindowId ?? null,
        fullyHydrated: parsed2.fullyHydrated
      };
    } catch (error41) {
      this.log(`canonical manifest readback failed after a lost write: ${errorMessage(error41)}`);
      return null;
    }
  }
  async readCanonicalManifestSnapshot() {
    const storeId = await this.deps.resolveStoreId();
    const store = this.objectStore(storeId);
    const bytes = await store.get(BOX_STORE_MANIFEST_REL_PATH);
    if (bytes == null) return null;
    return this.parseManifest(bytes);
  }
  reportManifestWriteConflict(info2) {
    try {
      this.deps.onManifestWriteConflict?.(info2);
    } catch {
    }
  }
  async prepareCanonicalManifestReset(storeId) {
    const bytes = await this.objectStore(storeId).get(BOX_STORE_MANIFEST_REL_PATH);
    if (bytes == null) return;
    try {
      this.parseManifest(bytes);
    } catch (error41) {
      if (!(error41 instanceof BoxStoreManifestPathConflictError)) throw error41;
      if (this.manifestWriteBlock instanceof BoxStoreUnsupportedManifestVersionError) {
        throw this.manifestWriteBlock;
      }
    }
    if (this.manifestWriteBlock instanceof BoxStoreManifestPathConflictError) {
      this.manifestWriteBlock = void 0;
    }
  }
  async readManifestStrict() {
    return (await this.readManifestStrictDetailed()).manifest;
  }
  async readManifestStrictDetailed() {
    if (this.manifestWriteBlock != null) throw this.manifestWriteBlock;
    const storeId = await this.deps.resolveStoreId();
    const bytes = await this.objectStore(storeId).get(BOX_STORE_MANIFEST_REL_PATH);
    const map4 = /* @__PURE__ */ new Map();
    if (bytes == null) {
      this.initializeManifestRevision(map4, void 0);
      this.manifest = map4;
      this.uncommittedStoreDbEntries.clear();
      this.fullyHydrated = void 0;
      this.hydrationManifestReadBlocked = false;
      return { present: false, manifest: map4 };
    }
    const decoded = this.parseManifest(bytes);
    if (decoded == null) {
      throw new SandBoxStoreSyncError("box store manifest is present but unparseable");
    }
    for (const [relPath, entry] of Object.entries(decoded.entries)) {
      map4.set(relPath, entry);
    }
    this.initializeManifestRevision(
      map4,
      decoded.version === this.configuredManifestVersion() ? {
        revision: 0,
        fullyHydrated: decoded.fullyHydrated
      } : void 0
    );
    this.manifest = map4;
    this.uncommittedStoreDbEntries.clear();
    this.fullyHydrated = decoded.fullyHydrated;
    this.hydrationManifestReadBlocked = false;
    return {
      present: true,
      manifest: map4,
      fullyHydrated: decoded.fullyHydrated
    };
  }
  async markLegacyHydrationIncomplete() {
    const storeId = await this.deps.resolveStoreId();
    if (this.deps.hydrationHandoffMarkerPath != null) {
      await removeHydrationHandoffMarker(this.deps.hydrationHandoffMarkerPath);
    }
    this.hydrationManifestReadBlocked = false;
    await this.loadManifest(storeId);
    await this.saveManifest(storeId, { hydrationUpdate: "mark-incomplete" });
  }
  async markLegacyHydrationCompleteForHandoff() {
    const markerPath = this.deps.hydrationHandoffMarkerPath;
    invariant(markerPath != null, "hydration handoff marker path is not configured");
    await writeHydrationHandoffMarker(markerPath);
  }
};
