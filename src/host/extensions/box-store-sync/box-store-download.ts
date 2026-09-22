var COPY_IN_LARGE_BLOB_CONCURRENCY = 4;
var COPY_IN_WAVE_SIZE = 500;
var BOX_STORE_RESTORE_TMP_SUFFIX = ".box-store-part-";
function boxStoreRestoreTempPath(destPath) {
  return (0, import_node_path12.join)(
    (0, import_node_path12.dirname)(destPath),
    `${BOX_STORE_RESTORE_TMP_SUFFIX}${(0, import_node_crypto8.randomBytes)(8).toString("hex")}`
  );
}
function withoutForeignMountEntries(manifest, log4) {
  const kept = /* @__PURE__ */ new Map();
  let skipped2 = 0;
  for (const [relPath, entry] of manifest) {
    if (isBoxHomeForeignMountPath(relPath)) skipped2 += 1;
    else kept.set(relPath, entry);
  }
  if (skipped2 > 0) {
    log4(`skipping ${skipped2.toString()} manifest entries under the box's foreign mounts`);
  }
  return kept;
}
var LARGE_OBJECT_FREE_SPACE_FACTOR = 2;
var COPY_IN_CRITICAL_BASENAMES = /* @__PURE__ */ new Set([
  "store.db",
  "conversation-blobs.db",
  "Cookies",
  "Login Data",
  "Web Data",
  "source-map.json"
]);
function isCriticalRelPath(relPath) {
  return COPY_IN_CRITICAL_BASENAMES.has(relPath.slice(relPath.lastIndexOf("/") + 1));
}
var BoxStoreDownload = class {
  resolveStoreId;
  objectStore;
  manifestStore;
  log;
  downloadConcurrency;
  largeObjectThreshold;
  downloadByteBudget;
  hasDiskSpaceForLargeObject;
  discardTemp;
  packPipeline;
  constructor(args) {
    this.resolveStoreId = args.resolveStoreId;
    this.objectStore = args.objectStore;
    this.manifestStore = args.manifestStore;
    this.log = args.log;
    this.downloadConcurrency = args.downloadConcurrency;
    this.largeObjectThreshold = args.largeObjectThreshold;
    this.downloadByteBudget = args.downloadByteBudget;
    this.hasDiskSpaceForLargeObject = args.hasDiskSpaceForLargeObject;
    this.discardTemp = args.discardTemp;
    this.packPipeline = args.packPipeline;
  }
  async download(targetDir, options2 = {}) {
    const storeId = await this.resolveStoreId();
    const store = this.objectStore(storeId);
    let manifest;
    if (options2.manifest != null) {
      manifest = options2.manifest;
    } else {
      this.manifestStore.manifest = void 0;
      manifest = await this.manifestStore.loadManifest(storeId);
    }
    manifest = withoutForeignMountEntries(manifest, this.log);
    const failures = [];
    let firstFailure;
    const recordFailure = (detail, failure2) => {
      failures.push(detail);
      firstFailure ??= failure2;
    };
    let files = 0;
    let bytes = 0;
    let verified = 0;
    const targetRoot = (0, import_node_path12.resolve)(targetDir);
    const fileEntries = /* @__PURE__ */ new Map();
    const symlinkEntries = /* @__PURE__ */ new Map();
    const destinationPaths = /* @__PURE__ */ new Map();
    const claimedDestinations = /* @__PURE__ */ new Set();
    for (const [relPath, entry] of manifest) {
      const destPath = resolveRestoreDestination({ targetRoot, relPath });
      if (destPath == null || claimedDestinations.has(destPath)) {
        recordFailure(`${relPath}: unsafe manifest path`, { code: "unsafe-manifest-path" });
        continue;
      }
      claimedDestinations.add(destPath);
      destinationPaths.set(relPath, destPath);
      if (isBoxStoreManifestFileEntry(entry)) {
        fileEntries.set(relPath, entry);
      } else if (isBoxStoreManifestSymlinkEntry(entry)) {
        symlinkEntries.set(relPath, entry);
      }
    }
    let symlinksStarted = 0;
    let symlinksCompleted = 0;
    const activeSymlinkSteps = {
      "prepare-parent": 0,
      "match-existing": 0,
      "create-temp": 0,
      "inspect-destination": 0,
      "remove-directory": 0,
      "rename-temp": 0,
      "apply-owner": 0,
      "verify-target": 0,
      "cleanup-temp": 0
    };
    const reportTrace = (event, detail = {}) => {
      options2.onTrace?.({
        event,
        manifestEntries: manifest.size,
        fileEntries: fileEntries.size,
        symlinkEntries: symlinkEntries.size,
        symlinksStarted,
        symlinksCompleted,
        symlinksInFlight: symlinksStarted - symlinksCompleted,
        activeSymlinkSteps: { ...activeSymlinkSteps },
        ...detail
      });
    };
    const runSymlinkStep = async (step, symlinkOrdinal, operation) => {
      activeSymlinkSteps[step] += 1;
      reportTrace("symlink-step-started", { symlinkOrdinal, symlinkStep: step });
      try {
        return await operation();
      } finally {
        activeSymlinkSteps[step] -= 1;
        reportTrace("symlink-step-finished", { symlinkOrdinal, symlinkStep: step });
      }
    };
    reportTrace("manifest-planned");
    const mkdirOwned = async (dir) => {
      const relDir = (0, import_node_path12.relative)(targetRoot, dir);
      if (relDir === ".." || relDir.startsWith(`..${import_node_path12.sep}`) || (0, import_node_path12.isAbsolute)(relDir)) {
        throw new SandBoxStoreSyncError("restore directory escapes target root", {
          copyInFailureCode: "restore-directory-escapes-root"
        });
      }
      const rootStat = await (0, import_promises14.lstat)(targetRoot);
      if (!rootStat.isDirectory()) {
        throw new SandBoxStoreSyncError("restore target root is not a directory", {
          copyInFailureCode: "restore-root-not-directory"
        });
      }
      let current = targetRoot;
      for (const segment of relDir === "" ? [] : relDir.split(import_node_path12.sep)) {
        current = (0, import_node_path12.join)(current, segment);
        let created = false;
        let info2;
        try {
          info2 = await (0, import_promises14.lstat)(current);
        } catch (error42) {
          if (findSystemErrno(error42) !== "ENOENT") throw error42;
          try {
            await (0, import_promises14.mkdir)(current);
            created = true;
          } catch (mkdirError) {
            if (findSystemErrno(mkdirError) !== "EEXIST") throw mkdirError;
          }
          info2 = await (0, import_promises14.lstat)(current);
        }
        if (!info2.isDirectory()) {
          try {
            await (0, import_promises14.unlink)(current);
          } catch (error42) {
            if (findSystemErrno(error42) !== "ENOENT") {
              const raced = await (0, import_promises14.lstat)(current).then(
                (value) => value,
                () => void 0
              );
              if (!raced?.isDirectory()) throw error42;
              info2 = raced;
            }
          }
          if (!info2.isDirectory()) {
            try {
              await (0, import_promises14.mkdir)(current);
              created = true;
            } catch (mkdirError) {
              if (findSystemErrno(mkdirError) !== "EEXIST") throw mkdirError;
            }
            info2 = await (0, import_promises14.lstat)(current);
          }
          if (!info2.isDirectory()) {
            throw new SandBoxStoreSyncError("restore parent is not a directory", {
              copyInFailureCode: "restore-parent-not-directory"
            });
          }
        }
        if (created && options2.uid != null && options2.gid != null) {
          if (options2.chown != null) {
            await options2.chown(current, options2.uid, options2.gid);
          } else {
            await (0, import_promises14.lchown)(current, options2.uid, options2.gid);
          }
        }
      }
    };
    const applyOpenFileMetadata = async (path31, entry, deferInjectedChown, legacyReplacementMode) => {
      const handle = await (0, import_promises14.open)(path31, import_node_fs11.constants.O_RDONLY | import_node_fs11.constants.O_NOFOLLOW);
      try {
        const info2 = await handle.stat();
        if (!info2.isFile()) {
          throw new SandBoxStoreSyncError("restore destination is not a regular file", {
            copyInFailureCode: "restore-destination-not-file"
          });
        }
        if (options2.uid != null && options2.gid != null && options2.chown == null) {
          await handle.chown(options2.uid, options2.gid);
        }
        const mode = entry.kind === "file" ? entry.mode : legacyReplacementMode;
        if (mode != null) await handle.chmod(mode);
      } finally {
        await handle.close();
      }
      if (!deferInjectedChown && options2.chown != null && options2.uid != null && options2.gid != null) {
        await options2.chown(path31, options2.uid, options2.gid);
      }
    };
    const existingRegularFileMode = async (path31) => {
      const destination = await (0, import_promises14.lstat)(path31).then(
        (value) => value,
        (error42) => {
          if (findSystemErrno(error42) === "ENOENT") return void 0;
          throw error42;
        }
      );
      return destination?.isFile() ? destination.mode & 511 : void 0;
    };
    const replaceDestinationWithTemp = async (tmpPath, destPath, symlinkOrdinal) => {
      const inspectDestination = async () => await (0, import_promises14.lstat)(destPath).then(
        (value) => value,
        (error42) => {
          if (findSystemErrno(error42) === "ENOENT") return void 0;
          throw error42;
        }
      );
      const destination = symlinkOrdinal == null ? await inspectDestination() : await runSymlinkStep("inspect-destination", symlinkOrdinal, inspectDestination);
      if (destination?.isDirectory()) {
        if (symlinkOrdinal == null) {
          await (0, import_promises14.rm)(destPath, { recursive: true, force: true });
        } else {
          await runSymlinkStep("remove-directory", symlinkOrdinal, async () => {
            await (0, import_promises14.rm)(destPath, { recursive: true, force: true });
          });
        }
      }
      if (symlinkOrdinal == null) {
        await (0, import_promises14.rename)(tmpPath, destPath);
      } else {
        await runSymlinkStep("rename-temp", symlinkOrdinal, async () => {
          await (0, import_promises14.rename)(tmpPath, destPath);
        });
      }
    };
    const installVerifiedTemp = async (tmpPath, destPath, relPath) => {
      const entry = fileEntries.get(relPath);
      if (entry == null) {
        throw new SandBoxStoreSyncError("regular-file manifest entry is missing", {
          copyInFailureCode: "manifest-file-entry-missing"
        });
      }
      const legacyReplacementMode = entry.kind === void 0 ? await existingRegularFileMode(destPath) : void 0;
      await applyOpenFileMetadata(tmpPath, entry, true, legacyReplacementMode);
      await replaceDestinationWithTemp(tmpPath, destPath);
      if (options2.chown != null && options2.uid != null && options2.gid != null) {
        await options2.chown(destPath, options2.uid, options2.gid);
      }
    };
    const applyExistingFileMetadata = async (destPath, relPath) => {
      const entry = fileEntries.get(relPath);
      if (entry == null) {
        throw new SandBoxStoreSyncError("regular-file manifest entry is missing", {
          copyInFailureCode: "manifest-file-entry-missing"
        });
      }
      await applyOpenFileMetadata(destPath, entry, false);
    };
    const writeVerifiedBytes = async (destPath, relPath, blob) => {
      const tmpPath = boxStoreRestoreTempPath(destPath);
      try {
        await (0, import_promises14.writeFile)(tmpPath, blob, { flag: "wx" });
        await installVerifiedTemp(tmpPath, destPath, relPath);
      } finally {
        await this.discardTemp({ tmpPath, label: relPath });
      }
    };
    const applySymlinkOwner = async (path31) => {
      if (options2.uid == null || options2.gid == null) return;
      await (options2.lchown ?? import_promises14.lchown)(path31, options2.uid, options2.gid);
    };
    const localSymlinkMatches = async (destPath, entry) => {
      const info2 = await (0, import_promises14.lstat)(destPath).then(
        (value) => value,
        () => null
      );
      if (!info2?.isSymbolicLink()) return false;
      const target = await (0, import_promises14.readlink)(destPath).then(
        (value) => value,
        () => null
      );
      return target === entry.target;
    };
    const restoreSymlink = async (relPath, entry, symlinkOrdinal) => {
      const destPath = destinationPaths.get(relPath);
      if (destPath == null || !symlinkTargetStaysWithinRoot({
        targetRoot,
        destPath,
        target: entry.target
      })) {
        recordFailure(`${relPath}: unsafe symlink target`, { code: "unsafe-symlink-target" });
        return false;
      }
      try {
        await runSymlinkStep("prepare-parent", symlinkOrdinal, async () => {
          await mkdirOwned((0, import_node_path12.dirname)(destPath));
        });
        if (await runSymlinkStep(
          "match-existing",
          symlinkOrdinal,
          async () => await localSymlinkMatches(destPath, entry)
        )) {
          await runSymlinkStep("apply-owner", symlinkOrdinal, async () => {
            await applySymlinkOwner(destPath);
          });
        } else {
          const tmpPath = boxStoreRestoreTempPath(destPath);
          try {
            await runSymlinkStep("create-temp", symlinkOrdinal, async () => {
              await (0, import_promises14.symlink)(entry.target, tmpPath);
            });
            await replaceDestinationWithTemp(tmpPath, destPath, symlinkOrdinal);
            await runSymlinkStep("apply-owner", symlinkOrdinal, async () => {
              await applySymlinkOwner(destPath);
            });
          } finally {
            await runSymlinkStep("cleanup-temp", symlinkOrdinal, async () => {
              await this.discardTemp({ tmpPath, label: relPath });
            });
          }
          if (!await runSymlinkStep(
            "verify-target",
            symlinkOrdinal,
            async () => await localSymlinkMatches(destPath, entry)
          )) {
            throw new SandBoxStoreSyncError("restored symlink target does not match", {
              copyInFailureCode: "symlink-target-mismatch"
            });
          }
        }
      } catch (error42) {
        recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
        return false;
      }
      verified += 1;
      files += 1;
      reportProgress();
      return true;
    };
    const reportProgress = () => {
      options2.onProgress?.({ files, bytes, verified, total: manifest.size });
    };
    const byteBudget = makeInFlightByteBudget(this.downloadByteBudget);
    const restoreSmallGroup = async (group, pending) => {
      await byteBudget.acquire(group.size);
      try {
        let blob;
        try {
          blob = await store.get(`${BOX_STORE_BLOBS_PREFIX}/${group.sha}`);
        } catch (error42) {
          for (const relPath of pending) {
            recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
          }
          return;
        }
        if (blob == null) {
          for (const relPath of pending) {
            recordFailure(`${relPath}: blob ${group.sha} missing`, { code: "missing-blob" });
          }
          return;
        }
        if (blob.byteLength !== group.size || sha256Hex(blob) !== group.sha) {
          for (const relPath of pending) {
            recordFailure(`${relPath}: sha/size mismatch`, { code: "hash-size-mismatch" });
          }
          return;
        }
        for (const relPath of pending) {
          verified += 1;
          const destPath = destinationPaths.get(relPath);
          if (destPath == null) {
            recordFailure(`${relPath}: unsafe manifest path`, { code: "unsafe-manifest-path" });
            continue;
          }
          try {
            await mkdirOwned((0, import_node_path12.dirname)(destPath));
            await writeVerifiedBytes(destPath, relPath, blob);
          } catch (error42) {
            recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
            continue;
          }
          files += 1;
          bytes += blob.byteLength;
          reportProgress();
        }
      } finally {
        byteBudget.release(group.size);
      }
    };
    const restoreLargeToPath = async (group, relPath) => {
      const destPath = destinationPaths.get(relPath);
      if (destPath == null) {
        recordFailure(`${relPath}: unsafe manifest path`, { code: "unsafe-manifest-path" });
        return false;
      }
      try {
        await mkdirOwned((0, import_node_path12.dirname)(destPath));
      } catch (error42) {
        recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
        return false;
      }
      if (!await this.hasDiskSpaceForLargeObject(destPath, group.size)) {
        recordFailure(
          `${relPath}: insufficient disk space for ${group.size}B restore (x${LARGE_OBJECT_FREE_SPACE_FACTOR} required)`,
          { code: "insufficient-disk-space" }
        );
        return false;
      }
      const tmpPath = boxStoreRestoreTempPath(destPath);
      let written;
      try {
        written = await store.getToFile(`${BOX_STORE_BLOBS_PREFIX}/${group.sha}`, tmpPath, {
          maxBytes: group.size
        });
      } catch (error42) {
        await this.discardTemp({ tmpPath, label: relPath });
        recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
        return false;
      }
      if (written == null) {
        await this.discardTemp({ tmpPath, label: relPath });
        recordFailure(`${relPath}: blob ${group.sha} missing`, { code: "missing-blob" });
        return false;
      }
      let actualSha;
      try {
        actualSha = await sha256File(tmpPath);
      } catch (error42) {
        await this.discardTemp({ tmpPath, label: relPath });
        recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
        return false;
      }
      if (written !== group.size || actualSha !== group.sha) {
        await this.discardTemp({ tmpPath, label: relPath });
        recordFailure(`${relPath}: sha/size mismatch`, { code: "hash-size-mismatch" });
        return false;
      }
      verified += 1;
      try {
        await installVerifiedTemp(tmpPath, destPath, relPath);
      } catch (error42) {
        await this.discardTemp({ tmpPath, label: relPath });
        recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
        return false;
      }
      files += 1;
      bytes += written;
      reportProgress();
      return true;
    };
    const copyLargeToPath = async (sourcePath, group, relPath) => {
      const destPath = destinationPaths.get(relPath);
      if (destPath == null) {
        recordFailure(`${relPath}: unsafe manifest path`, { code: "unsafe-manifest-path" });
        return;
      }
      try {
        await mkdirOwned((0, import_node_path12.dirname)(destPath));
      } catch (error42) {
        recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
        return;
      }
      if (!await this.hasDiskSpaceForLargeObject(destPath, group.size)) {
        recordFailure(
          `${relPath}: insufficient disk space for ${group.size}B restore (x${LARGE_OBJECT_FREE_SPACE_FACTOR} required)`,
          { code: "insufficient-disk-space" }
        );
        return;
      }
      const tmpPath = boxStoreRestoreTempPath(destPath);
      try {
        const copied = await copyFileHashing(sourcePath, tmpPath);
        if (copied.size !== group.size || copied.sha !== group.sha) {
          await this.discardTemp({ tmpPath, label: relPath });
          recordFailure(`${relPath}: sha/size mismatch`, { code: "hash-size-mismatch" });
          return;
        }
        verified += 1;
        await installVerifiedTemp(tmpPath, destPath, relPath);
      } catch (error42) {
        await this.discardTemp({ tmpPath, label: relPath });
        recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
        return;
      }
      files += 1;
      bytes += group.size;
      reportProgress();
    };
    const restoreLargeGroup = async (group, pending) => {
      let restoredPath;
      for (const relPath of pending) {
        if (restoredPath == null) {
          if (await restoreLargeToPath(group, relPath)) {
            restoredPath = destinationPaths.get(relPath);
          }
        } else {
          await copyLargeToPath(restoredPath, group, relPath);
        }
      }
    };
    const localFileMatches = async (destPath, group) => {
      try {
        const local = await (0, import_promises14.lstat)(destPath);
        if (!local.isFile() || local.size !== group.size) return false;
        return await sha256File(destPath) === group.sha;
      } catch (error42) {
        if (!isMissingPathError(error42))
          reportBoxStoreDiagnostic({
            extension: "box_store",
            kind: "local_file_compare_failed",
            errorClass: errorLogTag(error42)
          });
        return false;
      }
    };
    const runPhase = async (groups, concurrency, restoreGroup) => {
      await forEachWavePipelined(groups, {
        waveSize: COPY_IN_WAVE_SIZE,
        concurrency,
        prepareWave: async (wave) => {
          const remote = [];
          await forEachBounded(wave, concurrency, async (group) => {
            const pending = [];
            for (const relPath of group.relPaths) {
              const destPath = destinationPaths.get(relPath);
              if (destPath == null) continue;
              try {
                await mkdirOwned((0, import_node_path12.dirname)(destPath));
              } catch (error42) {
                recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
                continue;
              }
              if (await localFileMatches(destPath, group)) {
                verified += 1;
                try {
                  await applyExistingFileMetadata(destPath, relPath);
                } catch (error42) {
                  recordFailure(`${relPath}: ${errorMessage(error42)}`, copyInFailureOf(error42));
                  continue;
                }
                files += 1;
                bytes += group.size;
                reportProgress();
              } else {
                pending.push(relPath);
              }
            }
            if (pending.length > 0) remote.push({ group, pending });
          });
          if (remote.length > 0 && store.prefetchReads != null) {
            try {
              await store.prefetchReads(
                remote.map((r) => `${BOX_STORE_BLOBS_PREFIX}/${r.group.sha}`)
              );
            } catch (error42) {
              this.log(
                `read prefetch failed (falling back to per-blob presign): ${errorMessage(error42)}`
              );
            }
          }
          return remote;
        },
        process: (r) => restoreGroup(r.group, r.pending)
      });
    };
    const criticalSmall = /* @__PURE__ */ new Map();
    const criticalLarge = /* @__PURE__ */ new Map();
    const bulkSmall = /* @__PURE__ */ new Map();
    const bulkLarge = /* @__PURE__ */ new Map();
    for (const [relPath, entry] of fileEntries) {
      const isLarge = entry.size >= this.largeObjectThreshold;
      let phase;
      if (isCriticalRelPath(relPath)) {
        phase = isLarge ? criticalLarge : criticalSmall;
      } else {
        phase = isLarge ? bulkLarge : bulkSmall;
      }
      const key = `${entry.sha}:${entry.size}`;
      const group = phase.get(key);
      if (group == null) {
        phase.set(key, {
          sha: entry.sha,
          size: entry.size,
          relPaths: [relPath]
        });
      } else {
        group.relPaths.push(relPath);
      }
    }
    await runPhase([...criticalSmall.values()], this.downloadConcurrency, restoreSmallGroup);
    await runPhase([...criticalLarge.values()], COPY_IN_LARGE_BLOB_CONCURRENCY, restoreLargeGroup);
    const restoredByPack = await this.packPipeline.restoreBulkSmallFromPacks({
      store,
      targetDir,
      groups: bulkSmall,
      byteBudget,
      localFileMatches,
      mkdirOwned,
      applyExistingFileMetadata,
      writeVerifiedBytes,
      recordRestoredPath: (byteSize) => {
        verified += 1;
        files += 1;
        bytes += byteSize;
        reportProgress();
      }
    });
    const remainingBulkSmall = [];
    for (const group of bulkSmall.values()) {
      const pending = group.relPaths.filter((relPath) => !restoredByPack.has(relPath));
      if (pending.length === 0) continue;
      remainingBulkSmall.push({
        sha: group.sha,
        size: group.size,
        relPaths: pending
      });
    }
    await Promise.all([
      runPhase(remainingBulkSmall, this.downloadConcurrency, restoreSmallGroup),
      runPhase([...bulkLarge.values()], COPY_IN_LARGE_BLOB_CONCURRENCY, restoreLargeGroup)
    ]);
    const symlinks = [...symlinkEntries].map(([relPath, entry], index) => ({
      relPath,
      entry,
      ordinal: index + 1
    }));
    if (symlinks.length > 0) {
      reportTrace("symlink-phase-started");
      await forEachBounded(symlinks, this.downloadConcurrency, async (symlinkEntry) => {
        symlinksStarted += 1;
        reportTrace("symlink-entry-started", {
          symlinkOrdinal: symlinkEntry.ordinal
        });
        const restored = await restoreSymlink(
          symlinkEntry.relPath,
          symlinkEntry.entry,
          symlinkEntry.ordinal
        );
        symlinksCompleted += 1;
        reportTrace("symlink-entry-finished", {
          symlinkOrdinal: symlinkEntry.ordinal,
          symlinkOutcome: restored ? "restored" : "failed"
        });
      });
      reportTrace("symlink-phase-finished");
    }
    return {
      manifestEntries: manifest.size,
      files,
      bytes,
      verified,
      failures,
      ...firstFailure == null ? {} : { firstFailure }
    };
  }
};
function resolveRestoreDestination(args) {
  const { targetRoot, relPath } = args;
  if (relPath.length === 0 || (0, import_node_path12.isAbsolute)(relPath)) return void 0;
  const segments = relPath.split("/");
  if (segments.some((segment) => segment.length === 0 || segment === "." || segment === "..")) {
    return void 0;
  }
  const destPath = (0, import_node_path12.resolve)(targetRoot, relPath);
  const rel = (0, import_node_path12.relative)(targetRoot, destPath);
  if (rel === "" || rel === ".." || rel.startsWith(`..${import_node_path12.sep}`) || (0, import_node_path12.isAbsolute)(rel)) {
    return void 0;
  }
  return destPath;
}
function symlinkTargetStaysWithinRoot(args) {
  const { targetRoot, destPath, target } = args;
  const targetPath = (0, import_node_path12.isAbsolute)(target) ? (0, import_node_path12.resolve)(target) : (0, import_node_path12.resolve)((0, import_node_path12.dirname)(destPath), target);
  const rel = (0, import_node_path12.relative)(targetRoot, targetPath);
  return rel === "" || rel !== ".." && !rel.startsWith(`..${import_node_path12.sep}`) && !(0, import_node_path12.isAbsolute)(rel);
}
function makeInFlightByteBudget(budgetBytes) {
  let inFlightBytes = 0;
  const waiters = [];
  const admitWaiters = () => {
    while (waiters.length > 0) {
      const head = waiters[0];
      if (inFlightBytes > 0 && inFlightBytes + head.bytes > budgetBytes) break;
      waiters.shift();
      inFlightBytes += head.bytes;
      head.admit();
    }
  };
  return {
    async acquire(byteCount) {
      if (byteCount <= 0) return;
      if (waiters.length === 0 && (inFlightBytes === 0 || inFlightBytes + byteCount <= budgetBytes)) {
        inFlightBytes += byteCount;
        return;
      }
      await new Promise((admit) => {
        waiters.push({ bytes: byteCount, admit });
      });
    },
    release(byteCount) {
      if (byteCount <= 0) return;
      inFlightBytes = Math.max(0, inFlightBytes - byteCount);
      admitWaiters();
    }
  };
}
async function sha256File(path31) {
  const hash = (0, import_node_crypto8.createHash)("sha256");
  const handle = await (0, import_promises14.open)(path31, import_node_fs11.constants.O_RDONLY | import_node_fs11.constants.O_NOFOLLOW);
  try {
    const info2 = await handle.stat();
    if (!info2.isFile()) {
      throw new SandBoxStoreSyncError("hash source is not a regular file", {
        copyInFailureCode: "hash-source-not-file"
      });
    }
    await (0, import_promises15.pipeline)(handle.createReadStream({ autoClose: false }), hash);
    return hash.digest("hex");
  } finally {
    await handle.close();
  }
}
async function copyFileHashing(srcPath, destPath) {
  const hash = (0, import_node_crypto8.createHash)("sha256");
  let size = 0;
  const tap = new import_node_stream3.Transform({
    transform(chunk, _encoding, callback) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      hash.update(buffer);
      size += buffer.byteLength;
      callback(null, buffer);
    }
  });
  const handle = await (0, import_promises14.open)(srcPath, import_node_fs11.constants.O_RDONLY | import_node_fs11.constants.O_NOFOLLOW);
  try {
    const info2 = await handle.stat();
    if (!info2.isFile()) {
      throw new SandBoxStoreSyncError("copy source is not a regular file", {
        copyInFailureCode: "copy-source-not-file"
      });
    }
    await (0, import_promises15.pipeline)(
      handle.createReadStream({ autoClose: false }),
      tap,
      (0, import_node_fs11.createWriteStream)(destPath, { flags: "wx" })
    );
    return { sha: hash.digest("hex"), size, mode: info2.mode & 511 };
  } finally {
    await handle.close();
  }
}
