/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/store-db-capture.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_fs17 = require("node:fs");
var import_promises21 = require("node:fs/promises");
var import_node_path18 = require("node:path");
init_errors();
init_system_errno();

// @recovered-fragment 2/2
function aggregateStoreDbSweepOutcome(summary) {
  if (summary.failures > 0) return "error";
  if (summary.oversize > 0) return "oversize";
  if (summary.filesUploaded > 0) return "uploaded";
  if (summary.filesScanned === 0) return "skipped";
  return "unchanged";
}
var StoreDbCapture = class {
  fs;
  deps;
  log;
  manifestStore;
  transfer;
  uploadConcurrency;
  largeObjectThreshold;
  hasLiveHandle;
  ensureWriterLock;
  isStopped;
  snapshotUpload;
  bundleCapture;
  storeDbCaptures = /* @__PURE__ */ new Map();
  constructor(args) {
    this.deps = args.deps;
    this.log = args.log;
    this.manifestStore = args.manifestStore;
    this.transfer = args.transfer;
    this.uploadConcurrency = args.uploadConcurrency;
    this.largeObjectThreshold = args.largeObjectThreshold;
    this.hasLiveHandle = args.deps.hasLiveHandle ?? hasLiveSandAgentDbHandle;
    this.fs = args.deps.fs ?? DISK_BOX_STORE_FS;
    this.ensureWriterLock = args.ensureWriterLock;
    this.isStopped = args.isStopped;
    this.snapshotUpload = new StoreDbSnapshotUpload({
      objectStoreProvider: args.deps.objectStoreProvider,
      now: args.now,
      log: args.log,
      manifestStore: args.manifestStore,
      maxObjectBytes: args.maxObjectBytes,
      largeObjectThreshold: args.largeObjectThreshold
    });
    this.bundleCapture = new StoreDbBundleCapture({
      now: args.now,
      log: args.log,
      manifestStore: args.manifestStore,
      transfer: args.transfer,
      largeObjectThreshold: args.largeObjectThreshold,
      snapshotUpload: this.snapshotUpload,
      vacuumInto: args.deps.vacuumInto,
      getWriteGeneration: args.deps.getWriteGeneration,
      storeDbCaptures: this.storeDbCaptures
    });
  }
  async runAgentStoreDbsSweep(storeId, skipLiveHandles) {
    const captureTrace = createStoreDbCaptureTrace();
    const summary = {
      name: "store.db",
      filesScanned: 0,
      filesUploaded: 0,
      bytesUploaded: 0,
      skippedUnchanged: 0,
      removed: 0,
      oversize: 0,
      failures: 0,
      metadataFailures: 0
    };
    const category = this.deps.categories.find((c) => c.containsAgentStoreDbs);
    if (category == null)
      return {
        summary,
        complete: true,
        agentCount: 0,
        capturedThisSweep: /* @__PURE__ */ new Set(),
        captureTrace,
        manifest: void 0
      };
    const agentsRoot = (0, import_node_path18.join)(category.absRoot, "agents");
    let roster;
    try {
      roster = await (0, import_promises21.readdir)(agentsRoot, { withFileTypes: true });
    } catch (error42) {
      const complete2 = findSystemErrno(error42) === "ENOENT";
      if (!complete2) recordStoreDbCaptureFailure(captureTrace, "capture");
      return {
        summary,
        complete: complete2,
        agentCount: 0,
        capturedThisSweep: /* @__PURE__ */ new Set(),
        captureTrace,
        manifest: void 0
      };
    }
    const manifest = await this.manifestStore.loadManifest(storeId);
    const bundles = [];
    for (const entry of roster) {
      if (!entry.isDirectory()) continue;
      const targets = [];
      let bundleBlocked = false;
      const blobRecoveryPending = await this.bundleCapture.agentHasPendingDbRecovery(
        (0, import_node_path18.join)(agentsRoot, entry.name)
      );
      if (blobRecoveryPending) {
        summary.failures += 1;
        recordStoreDbCaptureFailure(captureTrace, "capture");
        continue;
      }
      for (const basename24 of AGENT_STORE_DB_BASENAMES) {
        const relPath = `${category.relPrefix}/agents/${entry.name}/${basename24}`;
        const absPath = (0, import_node_path18.join)(agentsRoot, entry.name, basename24);
        let fileStat;
        try {
          fileStat = await this.fs.stat(absPath);
        } catch (error42) {
          if (findSystemErrno(error42) === "ENOENT") {
          } else {
            this.log(`agent db ${relPath} stat failed: ${errorMessage(error42)}`);
            summary.failures += 1;
            recordStoreDbCaptureFailure(captureTrace, "capture");
            bundleBlocked = true;
          }
          continue;
        }
        const walStat = await this.bundleCapture.readWalStat(absPath);
        const effectiveSize = fileStat.size + (walStat != null && walStat.size > 0 ? walStat.size : 0);
        targets.push({ relPath, absPath, effectiveSize });
      }
      if (bundleBlocked) continue;
      if (targets.length === 0) continue;
      const storeTarget = targets.find((target) => target.relPath.endsWith("/store.db"));
      if (skipLiveHandles && storeTarget != null && this.hasLiveHandle(storeTarget.absPath)) {
        continue;
      }
      bundles.push({
        agentId: entry.name,
        targets,
        effectiveSize: targets.reduce((total, target) => total + target.effectiveSize, 0)
      });
    }
    const bySizeDesc = (a, b2) => b2.effectiveSize - a.effectiveSize;
    const large = bundles.filter((bundle) => bundle.effectiveSize >= this.largeObjectThreshold).sort(bySizeDesc);
    const small = bundles.filter((bundle) => bundle.effectiveSize < this.largeObjectThreshold).sort(bySizeDesc);
    let agentCount = 0;
    const capturedThisSweep = /* @__PURE__ */ new Set();
    const capture = async (bundle) => {
      agentCount += 1;
      const failuresBefore = summary.failures;
      const oversizeBefore = summary.oversize;
      let committed = false;
      try {
        committed = await this.bundleCapture.captureAgentDbBundle({
          agentId: bundle.agentId,
          agentDir: (0, import_node_path18.join)(agentsRoot, bundle.agentId),
          relPrefix: category.relPrefix,
          storeId,
          manifest,
          targets: bundle.targets,
          summary,
          captureTrace
        });
      } catch (error42) {
        this.log(`agent db bundle ${bundle.agentId} capture failed: ${errorMessage(error42)}`);
        recordStoreDbCaptureFailure(captureTrace, "capture");
      }
      if (committed) {
        for (const target of bundle.targets) {
          capturedThisSweep.add(target.relPath);
        }
      } else if (summary.failures === failuresBefore && summary.oversize === oversizeBefore) {
        summary.failures += 1;
        recordStoreDbCaptureFailure(captureTrace, "capture");
      }
    };
    await forEachBounded(large, SNAPSHOT_OUT_LARGE_CONCURRENCY, capture);
    await forEachBounded(small, this.uploadConcurrency, capture);
    const complete = await this.verifyAgentDbsComplete(
      agentsRoot,
      category.relPrefix,
      manifest,
      capturedThisSweep
    );
    return {
      summary,
      complete,
      agentCount,
      capturedThisSweep,
      captureTrace,
      manifest
    };
  }
  async verifyAgentDbsComplete(agentsRoot, relPrefix, manifest, capturedThisSweep) {
    let entries;
    try {
      entries = await (0, import_promises21.readdir)(agentsRoot, { withFileTypes: true });
    } catch (error42) {
      return findSystemErrno(error42) === "ENOENT";
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const blobRecoveryPending = await this.bundleCapture.agentHasPendingDbRecovery(
        (0, import_node_path18.join)(agentsRoot, entry.name)
      );
      if (blobRecoveryPending) return false;
      for (const basename24 of AGENT_STORE_DB_BASENAMES) {
        const relPath = `${relPrefix}/agents/${entry.name}/${basename24}`;
        const absPath = (0, import_node_path18.join)(agentsRoot, entry.name, basename24);
        let fileStat;
        try {
          fileStat = await this.fs.stat(absPath);
        } catch (error42) {
          if (findSystemErrno(error42) === "ENOENT") continue;
          return false;
        }
        if (!await this.bundleCapture.isAgentDbSnapshotDurable(
          relPath,
          absPath,
          fileStat,
          manifest,
          capturedThisSweep
        )) {
          return false;
        }
      }
    }
    return true;
  }
  async pruneMissingAgentStoreDbs(storeId) {
    const category = this.deps.categories.find((c) => c.containsAgentStoreDbs);
    if (category == null) return 0;
    const agentsRoot = (0, import_node_path18.join)(category.absRoot, "agents");
    let existing;
    try {
      const entries = await (0, import_promises21.readdir)(agentsRoot, { withFileTypes: true });
      existing = new Set(entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
    } catch (error42) {
      if (!isMissingPathError(error42))
        reportBoxStoreDiagnostic({
          extension: "box_store",
          kind: "agent_prune_scan_failed",
          errorClass: errorLogTag(error42)
        });
      return 0;
    }
    const manifest = await this.manifestStore.loadManifest(storeId);
    const prefix = `${category.relPrefix}/agents/`;
    let removed = 0;
    for (const relPath of [...manifest.keys()]) {
      if (!relPath.startsWith(prefix)) continue;
      const fileName = relPath.slice(relPath.lastIndexOf("/") + 1);
      if (AGENT_STORE_DB_BASENAMES.some((name17) => fileName.startsWith(`${name17}.corrupt-`)) || AGENT_STORE_DB_BASENAMES.some(
        (name17) => SQLITE_DB_SIDECAR_SUFFIXES.some((suffix2) => fileName === `${name17}${suffix2}`)
      ) || AGENT_STORE_DB_BASENAMES.some(
        (name17) => fileName === `${name17}.pending` || fileName.startsWith(`${name17}.replacement`)
      )) {
        this.manifestStore.deleteManifestEntry(manifest, relPath);
        this.transfer.localStat.delete(relPath);
        this.storeDbCaptures.delete(relPath);
        removed += 1;
        continue;
      }
      const basename24 = AGENT_STORE_DB_BASENAMES.find((name17) => relPath.endsWith(`/${name17}`));
      if (basename24 == null) continue;
      const suffix = `/${basename24}`;
      const rest = relPath.slice(prefix.length, relPath.length - suffix.length);
      const topId = rest.split("/")[0] ?? "";
      if (topId.length === 0) continue;
      const isGone = !existing.has(topId) || rest.includes("/");
      if (!isGone) continue;
      this.manifestStore.deleteManifestEntry(manifest, relPath);
      this.transfer.localStat.delete(relPath);
      this.storeDbCaptures.delete(relPath);
      removed += 1;
    }
    if (removed > 0) {
      this.log(`pruned ${removed} agent db entries for deleted files/agents`);
    }
    return removed;
  }
  async runAgentStoreDbSnapshot(agentId) {
    const summary = {
      name: "store.db",
      filesScanned: 0,
      filesUploaded: 0,
      bytesUploaded: 0,
      skippedUnchanged: 0,
      removed: 0,
      oversize: 0,
      failures: 0,
      metadataFailures: 0
    };
    const captureTrace = createStoreDbCaptureTrace();
    let storeId = null;
    const finish = (outcome, isCommitted) => ({
      outcome,
      summary,
      captureTrace,
      isCommitted,
      storeId
    });
    if (this.isStopped()) return finish("skipped", false);
    const category = this.deps.categories.find((c) => c.containsAgentStoreDbs);
    if (category == null) return finish("skipped", false);
    const agentDir = (0, import_node_path18.join)(category.absRoot, "agents", agentId);
    if (!AGENT_STORE_DB_BASENAMES.some((basename24) => (0, import_node_fs17.existsSync)((0, import_node_path18.join)(agentDir, basename24)))) {
      return finish("skipped", false);
    }
    try {
      if (!await this.ensureWriterLock()) {
        return finish("skipped", false);
      }
      storeId = await this.deps.resolveStoreId();
      const manifest = await this.manifestStore.loadManifest(storeId);
      let manifestChanged = false;
      const targets = [];
      let bundleBlocked = false;
      const blobRecoveryPending = await this.bundleCapture.agentHasPendingDbRecovery(agentDir);
      if (blobRecoveryPending) {
        summary.failures += 1;
        recordStoreDbCaptureFailure(captureTrace, "capture");
        bundleBlocked = true;
      }
      for (const basename24 of AGENT_STORE_DB_BASENAMES) {
        const absPath = (0, import_node_path18.join)(agentDir, basename24);
        const relPath = `${category.relPrefix}/agents/${agentId}/${basename24}`;
        let fileStat;
        try {
          fileStat = await this.fs.stat(absPath);
        } catch (error42) {
          if (findSystemErrno(error42) === "ENOENT") {
          } else {
            this.log(`agent db ${relPath} stat failed: ${errorMessage(error42)}`);
            summary.failures += 1;
            recordStoreDbCaptureFailure(captureTrace, "capture");
            bundleBlocked = true;
          }
          continue;
        }
        const walStat = await this.bundleCapture.readWalStat(absPath);
        const effectiveSize = fileStat.size + (walStat != null && walStat.size > 0 ? walStat.size : 0);
        targets.push({ relPath, absPath, effectiveSize });
      }
      let bundleCommitted = false;
      if (!bundleBlocked && targets.length > 0) {
        const failuresBefore = summary.failures;
        const oversizeBefore = summary.oversize;
        const targetEntriesBeforeCapture = new Map(
          targets.map((target) => [target.relPath, manifest.get(target.relPath)])
        );
        bundleCommitted = await this.bundleCapture.captureAgentDbBundle({
          agentId,
          agentDir,
          relPrefix: category.relPrefix,
          storeId,
          manifest,
          targets,
          summary,
          captureTrace
        });
        if (bundleCommitted) {
          manifestChanged = targets.some(
            (target) => !boxStoreManifestEntriesEqual(
              targetEntriesBeforeCapture.get(target.relPath),
              manifest.get(target.relPath)
            )
          );
        } else if (summary.failures === failuresBefore && summary.oversize === oversizeBefore) {
          summary.failures += 1;
          recordStoreDbCaptureFailure(captureTrace, "capture");
        }
      }
      try {
        await this.fs.stat(agentDir);
      } catch (error42) {
        if (findSystemErrno(error42) === "ENOENT") {
          for (const basename24 of AGENT_STORE_DB_BASENAMES) {
            const relPath = `${category.relPrefix}/agents/${agentId}/${basename24}`;
            if (this.manifestStore.deleteManifestEntry(manifest, relPath)) {
              this.transfer.localStat.delete(relPath);
              this.storeDbCaptures.delete(relPath);
              summary.removed += 1;
              manifestChanged = true;
            }
          }
        }
      }
      if (manifestChanged || summary.failures > 0) {
        try {
          await this.manifestStore.saveManifest(storeId, {
            isForced: summary.failures > 0,
            captureTrace
          });
        } catch (error42) {
          recordStoreDbCaptureFailure(captureTrace, "manifest_commit");
          throw error42;
        }
      }
      if (targets.some((target) => this.manifestStore.uncommittedStoreDbEntries.has(target.relPath))) {
        await this.manifestStore.writeQueue;
      }
      const outcome = aggregateStoreDbSweepOutcome(summary);
      const isCommitted = bundleCommitted && (outcome === "uploaded" || outcome === "unchanged") && this.bundleCapture.isAgentDbBundleCommitted(manifest, targets);
      if (!isCommitted && (outcome === "uploaded" || outcome === "unchanged")) {
        recordStoreDbCaptureFailure(captureTrace, "manifest_commit");
        return finish("error", false);
      }
      if (outcome === "uploaded") this.log(`agent db bundle ${agentId} uploaded`);
      return finish(outcome, isCommitted);
    } catch (error42) {
      this.log(`store.db ${agentId} failed: ${errorMessage(error42)}`);
      recordStoreDbCaptureFailure(captureTrace, "capture");
      return finish("error", false);
    }
  }
};
function boxStoreDbCaptureTelemetry(summary) {
  return {
    level: summary.outcome === "error" || summary.outcome === "skipped" ? "warn" : "info",
    metadata: {
      outcome: summary.outcome,
      trigger: summary.trigger,
      failure_phase: summary.failurePhase,
      committed: String(summary.isCommitted),
      agent_count: String(summary.agentCount),
      files_scanned: String(summary.filesScanned),
      files_uploaded: String(summary.filesUploaded),
      bytes: String(summary.bytes),
      duration_ms: String(summary.durationMs),
      queue_duration_ms: String(summary.queueDurationMs),
      capture_duration_ms: String(summary.captureDurationMs),
      blob_upload_duration_ms: String(summary.blobUploadDurationMs),
      manifest_commit_duration_ms: String(summary.manifestCommitDurationMs),
      store_id: summary.storeId ?? void 0
    }
  };
}

