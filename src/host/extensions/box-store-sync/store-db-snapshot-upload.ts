var StoreDbSnapshotUpload = class {
  objectStoreProvider;
  now;
  log;
  manifestStore;
  maxObjectBytes;
  largeObjectThreshold;
  vacuumWorkerAvailable = void 0;
  constructor(args) {
    this.objectStoreProvider = args.objectStoreProvider;
    this.now = args.now;
    this.log = args.log;
    this.manifestStore = args.manifestStore;
    this.maxObjectBytes = args.maxObjectBytes;
    this.largeObjectThreshold = args.largeObjectThreshold;
  }
  objectStore(storeId) {
    return this.objectStoreProvider.forStore(storeId);
  }
  elapsedDurationMs(startedAt) {
    return Math.max(0, this.now() - startedAt);
  }
  async uploadAgentDbSnapshot(storeId, manifest, relPath, snapshotPath, mode) {
    let size;
    try {
      size = (await (0, import_promises20.stat)(snapshotPath)).size;
    } catch (error41) {
      this.log(`store.db ${relPath} snapshot stat failed: ${errorMessage(error41)}`);
      return {
        outcome: "error",
        bytesUploaded: 0,
        blobUploadDurationMs: 0,
        failurePhase: "capture"
      };
    }
    if (size > this.maxObjectBytes) {
      this.log(`oversize ${relPath}: ${size}B over ${this.maxObjectBytes}B`);
      return {
        outcome: "oversize",
        bytesUploaded: 0,
        blobUploadDurationMs: 0,
        failurePhase: "capture"
      };
    }
    let sha;
    let bytes;
    try {
      if (size >= this.largeObjectThreshold) {
        sha = await sha256File(snapshotPath);
      } else {
        bytes = await (0, import_promises20.readFile)(snapshotPath);
        sha = sha256Hex(bytes);
      }
    } catch (error41) {
      this.log(`read failed ${relPath}: ${errorMessage(error41)}`);
      return {
        outcome: "error",
        bytesUploaded: 0,
        blobUploadDurationMs: 0,
        failurePhase: "capture"
      };
    }
    const entry = {
      kind: "file",
      sha,
      size,
      mode: mode & 511
    };
    const existing = manifest.get(relPath);
    if (existing != null && isBoxStoreManifestFileEntry(existing) && existing.sha === sha && existing.size === size) {
      this.manifestStore.setManifestEntry(manifest, relPath, entry);
      return {
        outcome: "unchanged",
        bytesUploaded: 0,
        blobUploadDurationMs: 0
      };
    }
    const uploadStartedAt = this.now();
    try {
      if (bytes === void 0) {
        await this.objectStore(storeId).putFromFile(
          `${BOX_STORE_BLOBS_PREFIX}/${sha}`,
          snapshotPath,
          sha,
          size
        );
      } else {
        await this.objectStore(storeId).put(`${BOX_STORE_BLOBS_PREFIX}/${sha}`, bytes, {
          contentAddressed: true
        });
      }
    } catch (error41) {
      this.log(`upload failed ${relPath}: ${errorMessage(error41)}`);
      return {
        outcome: "error",
        bytesUploaded: 0,
        blobUploadDurationMs: this.elapsedDurationMs(uploadStartedAt),
        failurePhase: "blob_upload"
      };
    }
    this.manifestStore.setManifestEntry(manifest, relPath, entry);
    return {
      outcome: "uploaded",
      bytesUploaded: size,
      blobUploadDurationMs: this.elapsedDurationMs(uploadStartedAt)
    };
  }
  /*
   * node:sqlite runs VACUUM INTO synchronously on the calling thread, so the copy runs in a worker
   * thread to keep the host event loop free.
   * https://nodejs.org/docs/latest-v22.x/api/sqlite.html#class-databasesync
   */
  async runVacuumOffThread(args) {
    const entry = defaultVacuumWorkerEntryPath();
    if (this.vacuumWorkerAvailable === void 0) {
      this.vacuumWorkerAvailable = (0, import_node_fs16.existsSync)(entry);
      if (!this.vacuumWorkerAvailable) {
        this.log(`vacuum worker bundle absent (${entry}); using in-process VACUUM`);
      }
    }
    if (this.vacuumWorkerAvailable) {
      try {
        await runVacuumInWorker({
          entryPath: entry,
          srcPath: args.srcPath,
          destPath: args.destPath,
          busyTimeoutMs: DB_BUSY_TIMEOUT_MS
        });
        return;
      } catch (error41) {
        if (!(error41 instanceof VacuumWorkerUnavailableError)) throw error41;
        this.vacuumWorkerAvailable = false;
        this.log(`vacuum worker unavailable; using in-process VACUUM: ${errorMessage(error41)}`);
      }
    }
    await this.discardSnapshotTemp({ tmpPath: args.destPath, label: "vacuum fallback pre-clean" });
    sqliteVacuumInto(args.srcPath, args.destPath);
  }
  async discardSnapshotTemp(args) {
    try {
      await (0, import_promises20.unlink)(args.tmpPath);
    } catch (error41) {
      if (findSystemErrno(error41) === "ENOENT") return;
      this.log(`temp cleanup failed ${args.label}: ${errorMessage(error41)}`);
    }
  }
};
function defaultVacuumWorkerEntryPath() {
  return (0, import_node_path17.join)(
    (0, import_node_path17.dirname)((0, import_node_url4.fileURLToPath)(__import_meta_url)),
    "extensions/box-store-sync/box-store-vacuum-worker.cjs"
  );
}
var VacuumWorkerUnavailableError = class extends SandDomainError {
  name = "VacuumWorkerUnavailableError";
};
function runVacuumInWorker(args) {
  const { entryPath, srcPath, destPath, busyTimeoutMs } = args;
  return new Promise((resolve29, reject2) => {
    let worker;
    try {
      worker = new import_node_worker_threads.Worker(entryPath);
    } catch (error41) {
      reject2(new VacuumWorkerUnavailableError(errorMessage(error41)));
      return;
    }
    let settled = false;
    const finish = (run) => {
      if (settled) return;
      settled = true;
      void worker.terminate();
      run();
    };
    worker.on(
      "message",
      (msg) => {
        if (msg?.ok === true) finish(resolve29);
        else finish(() => reject2(new Error(msg?.message ?? "vacuum worker reported failure")));
      }
    );
    worker.on(
      "error",
      (error41) => finish(() => reject2(new VacuumWorkerUnavailableError(errorMessage(error41))))
    );
    worker.on(
      "exit",
      (code) => finish(
        () => reject2(
          new VacuumWorkerUnavailableError(`vacuum worker exited (${code}) before completing`)
        )
      )
    );
    worker.postMessage({ srcPath, destPath, busyTimeoutMs });
  });
}
