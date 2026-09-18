var DEFAULT_MAX_OBJECT_BYTES = 32 * 1024 * 1024 * 1024;
var DEFAULT_COPY_IN_CONCURRENCY = 128;
var DEFAULT_SNAPSHOT_OUT_CONCURRENCY = 8;
var LARGE_OBJECT_THRESHOLD_BYTES = 64 * 1024 * 1024;
var DOWNLOAD_IN_FLIGHT_BYTE_BUDGET = 256 * 1024 * 1024;
var BoxStoreSync = class {
  constructor(deps) {
    this.deps = deps;
    const maxObjectBytes = deps.maxObjectBytes ?? DEFAULT_MAX_OBJECT_BYTES;
    const downloadConcurrency = Math.max(
      1,
      deps.downloadConcurrency ?? DEFAULT_COPY_IN_CONCURRENCY
    );
    const uploadConcurrency = Math.max(
      1,
      deps.uploadConcurrency ?? DEFAULT_SNAPSHOT_OUT_CONCURRENCY
    );
    const largeObjectThreshold = Math.max(
      1,
      deps.largeObjectThresholdBytes ?? LARGE_OBJECT_THRESHOLD_BYTES
    );
    const downloadByteBudget = Math.max(
      1,
      deps.downloadInFlightByteBudgetBytes ?? DOWNLOAD_IN_FLIGHT_BYTE_BUDGET
    );
    this.now = deps.now ?? Date.now;
    this.log = deps.log;
    this.manifestStore = new BoxStoreManifestStore({
      deps,
      now: this.now,
      log: this.log,
      isDisposed: () => this.disposed
    });
    this.transfer = new BoxStoreTransfer({
      deps,
      now: this.now,
      log: this.log,
      manifestStore: this.manifestStore,
      maxObjectBytes,
      downloadConcurrency,
      uploadConcurrency,
      largeObjectThreshold,
      downloadByteBudget,
      getFlushWaiters: () => this.flushWaiters
    });
    this.storeDbCapture = new StoreDbCapture({
      deps,
      now: this.now,
      log: this.log,
      manifestStore: this.manifestStore,
      transfer: this.transfer,
      maxObjectBytes,
      uploadConcurrency,
      largeObjectThreshold,
      ensureWriterLock: () => this.ensureWriterLock(),
      isStopped: () => this.stopped
    });
  }
  deps;
  manifestStore;
  transfer;
  storeDbCapture;
  now;
  log;
  writerLock;
  pendingStoreDb = /* @__PURE__ */ new Map();
  cycleInFlight = false;
  flushWaiters = 0;
  inFlight;
  disposed = false;
  stopped = false;
  get manifestV2Enabled() {
    return this.manifestStore.isManifestV2Enabled;
  }
  enrollManifestV2() {
    this.manifestStore.enrollManifestV2();
  }
  elapsedDurationMs(startedAt) {
    return Math.max(0, this.now() - startedAt);
  }
  async ensureWriterLock() {
    const lockPath = this.deps.lockPath;
    if (lockPath == null) return true;
    if (this.writerLock != null) {
      const stillOwned = this.writerLock.verifyStillOwned == null ? true : await this.writerLock.verifyStillOwned();
      if (stillOwned) return true;
      this.log("writer lock is no longer ours (removed or taken); dropping it before any write");
      const lost = this.writerLock;
      this.writerLock = void 0;
      await lost.release().catch((error41) => {
        this.log(`writer lock release after loss failed: ${errorMessage(error41)}`);
      });
    }
    const acquire = this.deps.acquireWriterLock ?? defaultAcquireWriterLock;
    try {
      const lock = await acquire({
        lockPath,
        windowId: this.deps.windowId ?? `box-store-${process.pid}`
      });
      if (lock == null) return false;
      this.writerLock = lock;
      return true;
    } catch (error41) {
      this.log(`writer lock error: ${errorMessage(error41)}`);
      return false;
    }
  }
  async snapshotNow(options2 = {}) {
    if (this.stopped) {
      return this.emptyCycle("stopped", this.now());
    }
    if (this.cycleInFlight) {
      if (!options2.waitForInFlight) {
        return this.emptyCycle("in-flight", this.now());
      }
      this.flushWaiters += 1;
      try {
        while (this.cycleInFlight) {
          await Promise.allSettled([this.inFlight]);
        }
      } finally {
        this.flushWaiters -= 1;
      }
    }
    this.cycleInFlight = true;
    const run = this.runCycle(options2);
    this.inFlight = run;
    try {
      return await run;
    } finally {
      this.cycleInFlight = false;
      this.inFlight = void 0;
    }
  }
  async runCycle(options2) {
    const start = this.now();
    let storeDbCapture;
    let isStoreDbCaptureReported = false;
    try {
      if (!await this.ensureWriterLock()) {
        return this.report(this.emptyCycle("locked", start));
      }
      const storeId = await this.deps.resolveStoreId();
      const categories = [];
      for (const category of this.deps.categories) {
        if (options2.chromeSessionOnly && !category.stageOnly) continue;
        if (category.idleOnly && !options2.includeIdleOnly) continue;
        try {
          categories.push(await this.transfer.syncCategory(storeId, category));
        } catch (error41) {
          this.log(`category ${category.name} failed: ${errorMessage(error41)}`);
          categories.push({
            name: category.name,
            filesScanned: 0,
            filesUploaded: 0,
            bytesUploaded: 0,
            skippedUnchanged: 0,
            removed: 0,
            oversize: 0,
            failures: 1,
            metadataFailures: 0
          });
        }
      }
      await this.storeDbCapture.pruneMissingAgentStoreDbs(storeId);
      let storeDbComplete = false;
      let capturedThisSweep = /* @__PURE__ */ new Set();
      if (options2.includeStoreDbs) {
        const startedAt = this.now();
        let sweep;
        try {
          sweep = await this.storeDbCapture.runAgentStoreDbsSweep(
            storeId,
            options2.skipLiveHandleStoreDbs === true
          );
        } catch (error41) {
          this.log(`store.db flush failed: ${errorMessage(error41)}`);
          const captureTrace = createStoreDbCaptureTrace();
          recordStoreDbCaptureFailure(captureTrace, "capture");
          sweep = {
            summary: {
              name: "store.db",
              filesScanned: 0,
              filesUploaded: 0,
              bytesUploaded: 0,
              skippedUnchanged: 0,
              removed: 0,
              oversize: 0,
              failures: 1,
              metadataFailures: 0
            },
            complete: false,
            agentCount: 0,
            capturedThisSweep: /* @__PURE__ */ new Set(),
            captureTrace,
            manifest: void 0
          };
        }
        storeDbCapture = { startedAt, storeId, sweep };
        categories.push(sweep.summary);
        storeDbComplete = sweep.complete;
        capturedThisSweep = sweep.capturedThisSweep;
      }
      const prunedAfterSweep = await this.storeDbCapture.pruneMissingAgentStoreDbs(storeId);
      if (options2.includeStoreDbs && storeDbComplete && prunedAfterSweep > 0) {
        const category = this.deps.categories.find((candidate) => candidate.containsAgentStoreDbs);
        if (category != null) {
          storeDbComplete = await this.storeDbCapture.verifyAgentDbsComplete(
            (0, import_node_path19.join)(category.absRoot, "agents"),
            category.relPrefix,
            await this.manifestStore.loadManifest(storeId),
            capturedThisSweep
          );
        }
      }
      const markerPath = this.deps.hydrationHandoffMarkerPath;
      const promoteFullyHydrated = markerPath != null && (0, import_node_fs18.existsSync)(markerPath) && options2.includeIdleOnly === true && options2.includeStoreDbs === true && storeDbComplete && categories.every((category) => category.failures === 0 && category.oversize === 0);
      const hasCycleFailures = categories.some(
        (category) => category.failures > 0 || category.oversize > 0
      );
      try {
        await this.manifestStore.saveManifest(storeId, {
          acceptMatchingCanonicalOnConflict: options2.acceptMatchingCanonicalOnConflict === true,
          isForced: hasCycleFailures,
          hydrationUpdate: promoteFullyHydrated ? "promote-complete" : void 0,
          captureTrace: storeDbCapture?.sweep.captureTrace
        });
      } catch (error41) {
        if (storeDbCapture != null) {
          recordStoreDbCaptureFailure(storeDbCapture.sweep.captureTrace, "manifest_commit");
        }
        throw error41;
      }
      if (storeDbCapture != null) {
        const outcome = aggregateStoreDbSweepOutcome(storeDbCapture.sweep.summary);
        this.reportStoreDbSweepCapture(storeDbCapture, outcome, {
          isCommitted: storeDbCapture.sweep.complete && (outcome === "uploaded" || outcome === "unchanged") && this.manifestStore.isStoreDbSweepCommitted(
            storeDbCapture.sweep.manifest,
            storeDbCapture.sweep.capturedThisSweep
          )
        });
        isStoreDbCaptureReported = true;
      }
      if (promoteFullyHydrated) {
        await removeHydrationHandoffMarker(markerPath).catch((error41) => {
          this.log(`hydration handoff marker cleanup failed: ${errorMessage(error41)}`);
        });
      }
      if (options2.includePacks === true && this.deps.packBuildEnabled) {
        categories.push(await this.transfer.syncPacks(storeId));
      }
      return this.report(this.buildSummary(storeId, start, categories, storeDbComplete));
    } catch (error41) {
      if (storeDbCapture != null && !isStoreDbCaptureReported) {
        recordStoreDbCaptureFailure(storeDbCapture.sweep.captureTrace, "capture");
        this.reportStoreDbSweepCapture(storeDbCapture, "error", {
          isCommitted: false
        });
      }
      this.log(`cycle failed: ${errorMessage(error41)}`);
      return this.report(this.emptyCycle(errorMessage(error41), start));
    }
  }
  scheduleStoreDbSnapshot(agentId) {
    if (this.disposed || this.stopped) return;
    let trigger2 = this.pendingStoreDb.get(agentId);
    if (trigger2 === void 0) {
      trigger2 = this.deps.storeDbDebounce.wrap(() => {
        void this.snapshotStoreDb(agentId).catch((error41) => {
          this.log(`turn-end store.db snapshot rejected: ${errorMessage(error41)}`);
        });
      });
      this.pendingStoreDb.set(agentId, trigger2);
    }
    trigger2();
  }
  async snapshotStoreDb(agentId) {
    const start = this.now();
    const result = await this.storeDbCapture.runAgentStoreDbSnapshot(agentId);
    this.reportStoreDbCapture({
      trigger: "turn_end",
      outcome: result.outcome,
      agentCount: result.outcome === "skipped" ? 0 : 1,
      filesScanned: result.summary.filesScanned,
      filesUploaded: result.summary.filesUploaded,
      bytes: result.summary.bytesUploaded,
      durationMs: this.elapsedDurationMs(start),
      queueDurationMs: result.captureTrace.queueDurationMs,
      captureDurationMs: result.captureTrace.captureDurationMs,
      blobUploadDurationMs: result.captureTrace.blobUploadDurationMs,
      manifestCommitDurationMs: result.captureTrace.manifestCommitDurationMs,
      isCommitted: result.isCommitted,
      failurePhase: result.captureTrace.failurePhase,
      storeId: result.storeId
    });
    return result.outcome;
  }
  async download(targetDir, options2 = {}) {
    return this.transfer.download(targetDir, options2);
  }
  async readManifestStrict() {
    return this.manifestStore.readManifestStrict();
  }
  async readManifestStrictDetailed() {
    return this.manifestStore.readManifestStrictDetailed();
  }
  async markLegacyHydrationIncomplete() {
    return this.manifestStore.markLegacyHydrationIncomplete();
  }
  async markLegacyHydrationCompleteForHandoff() {
    return this.manifestStore.markLegacyHydrationCompleteForHandoff();
  }
  async sweepLeakedTemps() {
    return this.transfer.sweepLeakedTemps();
  }
  async readStoreStatus() {
    const empty2 = {
      durable: false,
      fullyHydrated: void 0,
      entryCount: 0,
      storeDbEntries: 0,
      agentDirEntries: 0,
      totalBytes: 0,
      lastSnapshotAtMs: 0
    };
    try {
      const snapshot = await this.manifestStore.readCanonicalManifestSnapshot();
      if (snapshot == null) return empty2;
      const manifest = new Map(Object.entries(snapshot.entries));
      const entries = [...manifest.values()];
      const totalBytes = entries.reduce(
        (sum, entry) => sum + (isBoxStoreManifestFileEntry(entry) ? entry.size : 0),
        0
      );
      return {
        durable: entries.length > 0,
        fullyHydrated: snapshot.fullyHydrated,
        entryCount: entries.length,
        storeDbEntries: countStoreDbManifestEntries(manifest),
        agentDirEntries: countAgentDirManifestEntries(manifest),
        totalBytes,
        lastSnapshotAtMs: snapshot.updatedAtMs
      };
    } catch (error41) {
      this.log(`readStoreStatus failed: ${errorMessage(error41)}`);
      return empty2;
    }
  }
  async clearStore() {
    this.stopped = true;
    for (const trigger2 of this.pendingStoreDb.values()) trigger2.dispose();
    this.pendingStoreDb.clear();
    try {
      if (!await this.ensureWriterLock()) {
        return { ok: false, reason: "locked" };
      }
      const storeId = await this.deps.resolveStoreId();
      await this.manifestStore.prepareCanonicalManifestReset(storeId);
      if (this.deps.hydrationHandoffMarkerPath != null) {
        await removeHydrationHandoffMarker(this.deps.hydrationHandoffMarkerPath);
      }
      this.manifestStore.hydrationManifestReadBlocked = false;
      this.manifestStore.manifest = /* @__PURE__ */ new Map();
      this.manifestStore.initializeManifestRevision(this.manifestStore.manifest, void 0);
      this.manifestStore.uncommittedStoreDbEntries.clear();
      await this.manifestStore.saveManifest(storeId, {
        hydrationUpdate: "reset-complete"
      });
      return { ok: true };
    } catch (error41) {
      return { ok: false, reason: errorMessage(error41) };
    }
  }
  async forgetAgent(agentId) {
    const pending = this.pendingStoreDb.get(agentId);
    if (pending != null) {
      pending.dispose();
      this.pendingStoreDb.delete(agentId);
    }
    try {
      if (!await this.ensureWriterLock()) {
        return { ok: false, reason: "locked" };
      }
      const storeId = await this.deps.resolveStoreId();
      const manifest = await this.manifestStore.loadManifest(storeId);
      const needle = `/agents/${agentId}/`;
      const ownPrefix = `agents/${agentId}/`;
      let removed = 0;
      for (const relPath of [...manifest.keys()]) {
        if (relPath.includes(needle) || relPath.startsWith(ownPrefix)) {
          this.manifestStore.deleteManifestEntry(manifest, relPath);
          this.transfer.localStat.delete(relPath);
          this.storeDbCapture.storeDbCaptures.delete(relPath);
          removed += 1;
        }
      }
      if (removed > 0) {
        await this.manifestStore.saveManifest(storeId);
        this.log(`forgot ${agentId} (${removed} entries)`);
      }
      return { ok: true };
    } catch (error41) {
      this.log(`forget ${agentId} failed: ${errorMessage(error41)}`);
      return { ok: false, reason: errorMessage(error41) };
    }
  }
  async dispose() {
    this.disposed = true;
    for (const trigger2 of this.pendingStoreDb.values()) trigger2.dispose();
    this.pendingStoreDb.clear();
    await this.manifestStore.writeQueue;
    await this.writerLock?.release().catch((error41) => {
      this.log(`writer lock release failed: ${errorMessage(error41)}`);
    });
    this.writerLock = void 0;
  }
  buildSummary(storeId, start, categories, storeDbComplete) {
    return {
      ok: true,
      storeId,
      durationMs: this.now() - start,
      categories,
      manifestEntries: this.manifestStore.manifest?.size ?? 0,
      storeDbEntries: countStoreDbManifestEntries(this.manifestStore.manifest),
      storeDbComplete,
      agentDirEntries: countAgentDirManifestEntries(this.manifestStore.manifest),
      totalFilesUploaded: categories.reduce((n, c) => n + c.filesUploaded, 0),
      totalBytesUploaded: categories.reduce((n, c) => n + c.bytesUploaded, 0),
      totalFailures: categories.reduce((n, c) => n + c.failures + c.oversize, 0),
      metadataFailures: categories.reduce((n, c) => n + c.metadataFailures, 0)
    };
  }
  emptyCycle(reason, start) {
    return {
      ok: false,
      reason,
      storeId: null,
      durationMs: this.now() - start,
      categories: [],
      manifestEntries: this.manifestStore.manifest?.size ?? 0,
      storeDbEntries: countStoreDbManifestEntries(this.manifestStore.manifest),
      storeDbComplete: false,
      agentDirEntries: countAgentDirManifestEntries(this.manifestStore.manifest),
      totalFilesUploaded: 0,
      totalBytesUploaded: 0,
      totalFailures: 0,
      metadataFailures: 0
    };
  }
  reportStoreDbSweepCapture(capture, outcome, publication) {
    const { sweep } = capture;
    this.reportStoreDbCapture({
      trigger: "flush",
      outcome,
      agentCount: sweep.agentCount,
      filesScanned: sweep.summary.filesScanned,
      filesUploaded: sweep.summary.filesUploaded,
      bytes: sweep.summary.bytesUploaded,
      durationMs: this.elapsedDurationMs(capture.startedAt),
      queueDurationMs: sweep.captureTrace.queueDurationMs,
      captureDurationMs: sweep.captureTrace.captureDurationMs,
      blobUploadDurationMs: sweep.captureTrace.blobUploadDurationMs,
      manifestCommitDurationMs: sweep.captureTrace.manifestCommitDurationMs,
      isCommitted: publication.isCommitted,
      failurePhase: sweep.captureTrace.failurePhase,
      storeId: capture.storeId
    });
  }
  reportStoreDbCapture(summary) {
    try {
      this.deps.onStoreDbCapture?.(summary);
    } catch {
    }
  }
  report(summary) {
    if (summary.ok) {
      this.log(
        `cycle ok in ${summary.durationMs}ms: ${summary.totalFilesUploaded} files / ${summary.totalBytesUploaded}B up, ${summary.manifestEntries} entries, ${summary.totalFailures} failures`
      );
    } else {
      this.log(`cycle skipped (${summary.reason})`);
    }
    try {
      this.deps.onCycle?.(summary);
    } catch {
    }
    return summary;
  }
};
async function defaultAcquireWriterLock(args) {
  const result = await tryAcquireStoreLock({
    lockPath: args.lockPath,
    windowId: args.windowId
  });
  if (result.kind === "acquired") {
    return {
      release: () => result.lock.dispose(),
      verifyStillOwned: () => result.lock.verifyStillOwned()
    };
  }
  return null;
}
function boxStoreSyncCycleTelemetry(summary) {
  if (!summary.ok) {
    if (summary.reason === "in-flight") return null;
    return {
      level: "warn",
      metadata: {
        ok: "false",
        reason: summary.reason === "locked" ? "locked" : "error",
        duration_ms: String(summary.durationMs),
        manifest_entries: String(summary.manifestEntries),
        store_db_entries: String(summary.storeDbEntries)
      }
    };
  }
  const excludedFiles = summary.categories.reduce((n, c) => n + (c.excludedFiles ?? 0), 0);
  const excludedBytes = summary.categories.reduce((n, c) => n + (c.excludedBytes ?? 0), 0);
  const prunedDirs = summary.categories.reduce((n, c) => n + (c.prunedDirs ?? 0), 0);
  const skippedInaccessible = summary.categories.reduce(
    (n, c) => n + (c.skippedInaccessible ?? 0),
    0
  );
  const metadata = {
    ok: "true",
    duration_ms: String(summary.durationMs),
    files_uploaded: String(summary.totalFilesUploaded),
    bytes_uploaded: String(summary.totalBytesUploaded),
    manifest_entries: String(summary.manifestEntries),
    excluded_files: String(excludedFiles),
    excluded_bytes: String(excludedBytes),
    pruned_dirs: String(prunedDirs),
    skipped_inaccessible: String(skippedInaccessible),
    store_db_entries: String(summary.storeDbEntries),
    store_id: summary.storeId ?? "",
    failures: String(summary.totalFailures)
  };
  for (const category of summary.categories) {
    metadata[`${category.name}_uploaded`] = String(category.filesUploaded);
    metadata[`${category.name}_bytes`] = String(category.bytesUploaded);
  }
  return { level: "info", metadata };
}
function evaluateBoxStoreFlush(summary, opts) {
  if (summary?.ok !== true) {
    return {
      ok: false,
      manifestEntries: 0,
      storeDbEntries: 0,
      agentDirEntries: 0,
      storeDbComplete: false,
      filesUploaded: 0,
      reason: summary?.reason ?? "error"
    };
  }
  const storeDbAttempted = summary.categories.some((c) => c.name === "store.db");
  if (storeDbAttempted && !summary.storeDbComplete) {
    return {
      ok: false,
      manifestEntries: summary.manifestEntries,
      storeDbEntries: summary.storeDbEntries,
      agentDirEntries: summary.agentDirEntries,
      storeDbComplete: false,
      filesUploaded: summary.totalFilesUploaded,
      reason: "store-db-incomplete"
    };
  }
  if (summary.metadataFailures > 0) {
    return {
      ok: false,
      manifestEntries: summary.manifestEntries,
      storeDbEntries: summary.storeDbEntries,
      agentDirEntries: summary.agentDirEntries,
      storeDbComplete: summary.storeDbComplete,
      filesUploaded: summary.totalFilesUploaded,
      reason: "filesystem-metadata-incomplete"
    };
  }
  const sessionFailures = summary.categories.find((c) => c.name === opts.sessionCategoryName)?.failures ?? 0;
  if (sessionFailures > 0) {
    return {
      ok: false,
      manifestEntries: summary.manifestEntries,
      storeDbEntries: summary.storeDbEntries,
      agentDirEntries: summary.agentDirEntries,
      storeDbComplete: summary.storeDbComplete,
      filesUploaded: summary.totalFilesUploaded,
      reason: "chrome-session-stage-failed"
    };
  }
  return {
    ok: true,
    manifestEntries: summary.manifestEntries,
    storeDbEntries: summary.storeDbEntries,
    agentDirEntries: summary.agentDirEntries,
    storeDbComplete: summary.storeDbComplete,
    filesUploaded: summary.totalFilesUploaded,
    reason: ""
  };
}
