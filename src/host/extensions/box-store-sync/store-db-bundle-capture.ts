var import_node_crypto12 = require("node:crypto");
var import_promises19 = require("node:fs/promises");
var import_node_path16 = require("node:path");
init_errors();
init_system_errno();
var STORE_DB_CAPTURE_FAILURE_PHASE_RANK = {
  capture: 0,
  blob_upload: 1,
  manifest_commit: 2
};
function createStoreDbCaptureTrace() {
  return {
    queueDurationMs: 0,
    captureDurationMs: 0,
    blobUploadDurationMs: 0,
    manifestCommitDurationMs: 0
  };
}
function recordStoreDbCaptureFailure(trace2, phase) {
  if (trace2.failurePhase == null || STORE_DB_CAPTURE_FAILURE_PHASE_RANK[phase] > STORE_DB_CAPTURE_FAILURE_PHASE_RANK[trace2.failurePhase]) {
    trace2.failurePhase = phase;
  }
}
var StoreDbBundleCapture = class {
  now;
  log;
  manifestStore;
  transfer;
  largeObjectThreshold;
  snapshotUpload;
  vacuumInto;
  getWriteGeneration;
  storeDbCaptures;
  agentDbCaptureQueues = /* @__PURE__ */ new Map();
  constructor(args) {
    this.now = args.now;
    this.log = args.log;
    this.manifestStore = args.manifestStore;
    this.transfer = args.transfer;
    this.largeObjectThreshold = args.largeObjectThreshold;
    this.snapshotUpload = args.snapshotUpload;
    this.vacuumInto = args.vacuumInto ?? ((vacuumArgs) => args.snapshotUpload.runVacuumOffThread(vacuumArgs));
    this.getWriteGeneration = args.getWriteGeneration ?? getSandAgentDbWriteGeneration;
    this.storeDbCaptures = args.storeDbCaptures;
  }
  elapsedDurationMs(startedAt) {
    return Math.max(0, this.now() - startedAt);
  }
  isAgentDbBundleCommitted(manifest, targets) {
    return this.manifestStore.isLiveManifest(manifest) && targets.length > 0 && targets.every(
      (target) => manifest.has(target.relPath) && !this.manifestStore.uncommittedStoreDbEntries.has(target.relPath)
    );
  }
  async captureAgentDbBundle(args) {
    const previous = this.agentDbCaptureQueues.get(args.agentId);
    const queuedAt = previous == null ? void 0 : this.now();
    const operation = (previous ?? Promise.resolve()).then(() => {
      if (queuedAt != null) {
        args.captureTrace.queueDurationMs += this.elapsedDurationMs(queuedAt);
      }
      return this.captureAgentDbBundleUnlocked(args);
    });
    const tail = operation.then(
      () => {
      },
      () => {
      }
    );
    this.agentDbCaptureQueues.set(args.agentId, tail);
    try {
      return await operation;
    } finally {
      if (this.agentDbCaptureQueues.get(args.agentId) === tail) {
        this.agentDbCaptureQueues.delete(args.agentId);
      }
    }
  }
  async captureAgentDbBundleUnlocked(args) {
    const initialIdentity = await this.agentDbBundleIdentity(args);
    if (initialIdentity == null) {
      recordStoreDbCaptureFailure(args.captureTrace, "capture");
      return false;
    }
    const stagedManifest = new Map(args.manifest);
    let complete = true;
    for (const target of args.targets) {
      args.summary.filesScanned += 1;
      try {
        const fileStat = await (0, import_promises19.stat)(target.absPath);
        const result = await this.captureAgentSqliteDb(
          args.storeId,
          stagedManifest,
          target.relPath,
          target.absPath,
          fileStat
        );
        args.captureTrace.captureDurationMs += result.captureDurationMs;
        args.captureTrace.blobUploadDurationMs += result.blobUploadDurationMs;
        if ("failurePhase" in result) {
          recordStoreDbCaptureFailure(args.captureTrace, result.failurePhase);
        }
        tallyFileOutcome(args.summary, result.outcome, target.effectiveSize);
        if (result.outcome === "error" || result.outcome === "oversize") {
          complete = false;
        }
      } catch (error42) {
        this.log(`agent db ${target.relPath} capture failed: ${errorMessage(error42)}`);
        args.summary.failures += 1;
        recordStoreDbCaptureFailure(args.captureTrace, "capture");
        complete = false;
      }
    }
    if (!complete) {
      return false;
    }
    if (await this.agentDbBundleIdentity(args) !== initialIdentity) {
      recordStoreDbCaptureFailure(args.captureTrace, "capture");
      return false;
    }
    const hasAbsentTrackedSibling = initialIdentity.includes(":absent-tracked");
    if (hasAbsentTrackedSibling) {
      for (const target of args.targets) {
        const staged = stagedManifest.get(target.relPath);
        const current = args.manifest.get(target.relPath);
        const contentEqual = staged != null && current != null && isBoxStoreManifestFileEntry(staged) && isBoxStoreManifestFileEntry(current) && staged.sha === current.sha && staged.size === current.size;
        if (!contentEqual) {
          recordStoreDbCaptureFailure(args.captureTrace, "capture");
          return false;
        }
      }
    }
    for (const target of args.targets) {
      const entry = stagedManifest.get(target.relPath);
      if (entry == null) continue;
      if (this.manifestStore.setManifestEntry(args.manifest, target.relPath, entry)) {
        this.manifestStore.uncommittedStoreDbEntries.set(target.relPath, entry);
      }
    }
    return true;
  }
  async agentDbBundleIdentity(args) {
    const blobRecoveryPending = await this.agentHasPendingDbRecovery(args.agentDir);
    if (blobRecoveryPending) return null;
    const targetPaths = new Set(args.targets.map((target) => target.relPath));
    const identities = [];
    for (const basename24 of AGENT_STORE_DB_BASENAMES) {
      const relPath = `${args.relPrefix}/agents/${args.agentId}/${basename24}`;
      let fileStat;
      try {
        fileStat = await (0, import_promises19.stat)((0, import_node_path16.join)(args.agentDir, basename24));
      } catch (error42) {
        if (findSystemErrno(error42) !== "ENOENT") return null;
      }
      const present = fileStat != null;
      if (present !== targetPaths.has(relPath)) return null;
      identities.push(
        fileStat == null ? `${basename24}:${args.manifest.has(relPath) ? "absent-tracked" : "absent"}` : `${basename24}:${fileStat.dev}:${fileStat.ino}:${fileStat.mode & 511}`
      );
    }
    return identities.join("|");
  }
  async agentHasPendingDbRecovery(agentDir) {
    let names3;
    try {
      names3 = await (0, import_promises19.readdir)(agentDir);
    } catch (error42) {
      if (!isMissingPathError(error42))
        reportBoxStoreDiagnostic({
          extension: "box_store",
          kind: "pending_recovery_scan_failed",
          errorClass: errorLogTag(error42)
        });
      return true;
    }
    for (const name17 of names3) {
      if (name17 === "conversation-blobs.db.pending" || name17.startsWith("conversation-blobs.db.corrupt-") && (name17.endsWith(".intent") || name17.endsWith(".pending"))) {
        return true;
      }
    }
    return false;
  }
  async captureAgentSqliteDb(storeId, manifest, relPath, absPath, fileStat) {
    const captureStartedAt = this.now();
    if (await this.isAgentDbDurablyCaptured(relPath, absPath, fileStat, manifest)) {
      return {
        outcome: "unchanged",
        bytesUploaded: 0,
        blobUploadDurationMs: 0,
        captureDurationMs: this.elapsedDurationMs(captureStartedAt)
      };
    }
    if (fileStat.size >= this.largeObjectThreshold && !await this.transfer.hasDiskSpaceForLargeObject(absPath, fileStat.size)) {
      this.log(
        `insufficient disk space for ${relPath} VACUUM snapshot (${fileStat.size}B needed x${LARGE_OBJECT_FREE_SPACE_FACTOR}); deferring to a later cycle`
      );
      return {
        outcome: "error",
        bytesUploaded: 0,
        blobUploadDurationMs: 0,
        failurePhase: "capture",
        captureDurationMs: this.elapsedDurationMs(captureStartedAt)
      };
    }
    const previousCapture = this.storeDbCaptures.get(relPath);
    const capturedGeneration = this.agentDbWriteGeneration({
      relPath,
      absPath
    });
    const capturedWalRef = await this.readWalStat(absPath) ?? {
      size: -1,
      mtimeMs: -1
    };
    const capturedMainStat = await (0, import_promises19.stat)(absPath).catch((error42) => {
      if (findSystemErrno(error42) !== "ENOENT") {
        this.log(`store.db ${relPath} pre-snapshot stat failed: ${errorMessage(error42)}`);
      }
      return void 0;
    });
    const tmpPath = `${absPath}${BOX_STORE_SNAPSHOT_TMP_SUFFIX}${(0, import_node_crypto12.randomBytes)(8).toString("hex")}`;
    let result;
    try {
      await this.vacuumInto({ srcPath: absPath, destPath: tmpPath });
      result = await this.snapshotUpload.uploadAgentDbSnapshot(
        storeId,
        manifest,
        relPath,
        tmpPath,
        fileStat.mode
      );
    } catch (error42) {
      this.log(`store.db ${relPath} snapshot failed; uncaptured: ${errorMessage(error42)}`);
      if (this.storeDbCaptures.get(relPath) === previousCapture) {
        this.storeDbCaptures.delete(relPath);
      }
      result = {
        outcome: "error",
        bytesUploaded: 0,
        blobUploadDurationMs: 0,
        failurePhase: "capture"
      };
    } finally {
      await this.snapshotUpload.discardSnapshotTemp({ tmpPath, label: relPath });
    }
    const outcome = result.outcome;
    if (this.storeDbCaptures.get(relPath) === previousCapture) {
      if (outcome === "uploaded" || outcome === "unchanged") {
        const entry = manifest.get(relPath);
        if (entry != null && isBoxStoreManifestFileEntry(entry) && capturedMainStat != null && capturedWalRef.size >= 0) {
          this.storeDbCaptures.set(relPath, {
            writeGeneration: capturedGeneration,
            mtimeMs: capturedMainStat.mtimeMs,
            size: capturedMainStat.size,
            sha: entry.sha,
            mode: fileStat.mode & 511,
            walSize: capturedWalRef.size,
            walMtimeMs: capturedWalRef.mtimeMs
          });
        } else {
          this.storeDbCaptures.delete(relPath);
        }
      } else {
        this.storeDbCaptures.delete(relPath);
      }
    }
    return {
      ...result,
      captureDurationMs: Math.max(
        0,
        this.elapsedDurationMs(captureStartedAt) - result.blobUploadDurationMs
      )
    };
  }
  async readWalStat(dbPath) {
    try {
      const s3 = await (0, import_promises19.stat)(`${dbPath}-wal`);
      return { size: s3.size, mtimeMs: s3.mtimeMs };
    } catch (error42) {
      if (findSystemErrno(error42) === "ENOENT") return { size: 0, mtimeMs: 0 };
      return null;
    }
  }
  async walHasNoNewFramesSince(dbPath, ref) {
    if (ref.size < 0) return false;
    const cur = await this.readWalStat(dbPath);
    if (cur === null) return false;
    if (cur.size === 0) return true;
    return cur.size === ref.size && cur.mtimeMs === ref.mtimeMs;
  }
  async isAgentDbDurablyCaptured(relPath, absPath, fileStat, manifest) {
    const cached2 = this.storeDbCaptures.get(relPath);
    const durable = manifest.get(relPath);
    return cached2 != null && durable != null && isBoxStoreManifestFileEntry(durable) && cached2.writeGeneration === this.agentDbWriteGeneration({ relPath, absPath }) && cached2.mtimeMs === fileStat.mtimeMs && cached2.size === fileStat.size && cached2.sha === durable.sha && cached2.mode === (fileStat.mode & 511) && (durable.mode === void 0 || durable.mode === cached2.mode) && await this.walHasNoNewFramesSince(absPath, {
      size: cached2.walSize,
      mtimeMs: cached2.walMtimeMs
    });
  }
  agentDbWriteGeneration(args) {
    return args.relPath.endsWith("/store.db") ? this.getWriteGeneration(args.absPath) : 0;
  }
  async isAgentDbSnapshotDurable(relPath, absPath, fileStat, manifest, capturedThisSweep) {
    const entry = manifest.get(relPath);
    if (capturedThisSweep.has(relPath) && entry != null && isBoxStoreManifestFileEntry(entry)) {
      return true;
    }
    return this.isAgentDbDurablyCaptured(relPath, absPath, fileStat, manifest);
  }
};
