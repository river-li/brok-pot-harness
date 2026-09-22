/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/box-store-transfer.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto11 = require("node:crypto");
var import_node_fs14 = require("node:fs");
var import_promises18 = require("node:fs/promises");
var import_node_path15 = require("node:path");
init_errors();
init_system_errno();

// @recovered-fragment 2/2
var DISK_BOX_STORE_FS = { lstat: import_promises18.lstat, open: import_promises18.open, readdir: import_promises18.readdir, readlink: import_promises18.readlink, stat: import_promises18.stat };
var SNAPSHOT_OUT_LARGE_CONCURRENCY = 2;
var BOX_STORE_SNAPSHOT_TMP_SUFFIX = ".box-store-snap-";
async function readFreeDiskBytes(path31) {
  let current = path31;
  for (; ; ) {
    try {
      const stats = await (0, import_promises18.statfs)(current);
      return Number(stats.bavail) * Number(stats.bsize);
    } catch {
      const parent = (0, import_node_path15.dirname)(current);
      if (parent === current) return void 0;
      current = parent;
    }
  }
}
function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\?]/g, "\\$&");
  const body = escaped.replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/\u0000/g, ".*");
  return new RegExp(`^${body}(?:/.*)?$`);
}
function tallyFileOutcome(summary, outcome, size) {
  if (outcome === "uploaded") {
    summary.filesUploaded += 1;
    summary.bytesUploaded += size;
  } else if (outcome === "unchanged") {
    summary.skippedUnchanged += 1;
  } else if (outcome === "oversize") {
    summary.oversize += 1;
  } else if (outcome === "skipped-inaccessible") {
    tallySkippedInaccessible(summary);
  } else {
    summary.failures += 1;
    if (outcome === "metadata-error") summary.metadataFailures += 1;
  }
}
function tallyMetadataFailure(summary) {
  summary.failures += 1;
  summary.metadataFailures += 1;
}
function tallySkippedInaccessible(summary) {
  summary.skippedInaccessible = (summary.skippedInaccessible ?? 0) + 1;
}
function isPermissionDenied(error42) {
  const errno = findSystemErrno(error42);
  return errno === "EACCES" || errno === "EPERM";
}
function isSnapshotNodeRace(error42) {
  const errno = findSystemErrno(error42);
  return errno === "ENOENT" || errno === "ELOOP" || error42 instanceof SandBoxStoreSyncError;
}
function classifyFileFailure(existing, mode, fallback2) {
  return existing != null && (existing.kind === "symlink" || existing.kind === "file" && existing.mode !== mode) ? "metadata-error" : fallback2;
}
var BoxStoreTransfer = class {
  deps;
  log;
  manifestStore;
  maxObjectBytes;
  readFreeDiskBytes;
  uploadConcurrency;
  largeObjectThreshold;
  packPipeline;
  downloader;
  localStat = /* @__PURE__ */ new Map();
  fs;
  constructor(args) {
    this.deps = args.deps;
    this.log = args.log;
    this.manifestStore = args.manifestStore;
    this.maxObjectBytes = args.maxObjectBytes;
    this.readFreeDiskBytes = args.deps.readFreeDiskBytes ?? readFreeDiskBytes;
    this.fs = args.deps.fs ?? DISK_BOX_STORE_FS;
    this.uploadConcurrency = args.uploadConcurrency;
    this.largeObjectThreshold = args.largeObjectThreshold;
    this.packPipeline = new BoxStorePackPipeline({
      categories: args.deps.categories,
      objectStore: (storeId) => this.objectStore(storeId),
      manifestStore: args.manifestStore,
      now: args.now,
      log: args.log,
      getFlushWaiters: args.getFlushWaiters,
      discardTemp: (temp) => this.discardTemp(temp),
      sha256File
    });
    this.downloader = new BoxStoreDownload({
      resolveStoreId: args.deps.resolveStoreId,
      objectStore: (storeId) => this.objectStore(storeId),
      manifestStore: args.manifestStore,
      log: args.log,
      downloadConcurrency: args.downloadConcurrency,
      largeObjectThreshold: args.largeObjectThreshold,
      downloadByteBudget: args.downloadByteBudget,
      hasDiskSpaceForLargeObject: (path31, objectBytes) => this.hasDiskSpaceForLargeObject(path31, objectBytes),
      discardTemp: (temp) => this.discardTemp(temp),
      packPipeline: this.packPipeline
    });
  }
  objectStore(storeId) {
    return this.deps.objectStoreProvider.forStore(storeId);
  }
  skipInaccessibleEnabled() {
    return this.deps.isSkipInaccessibleEnabled?.() ?? false;
  }
  manifestFormatLacksSymlinkEntries() {
    return !this.manifestStore.isManifestV2Enabled;
  }
  async discardTemp(args) {
    try {
      await (0, import_promises18.unlink)(args.tmpPath);
    } catch (error42) {
      if (findSystemErrno(error42) === "ENOENT") return;
      this.log(`temp cleanup failed ${args.label}: ${errorMessage(error42)}`);
    }
  }
  async hasDiskSpaceForLargeObject(path31, objectBytes) {
    const freeBytes = await this.readFreeDiskBytes((0, import_node_path15.dirname)(path31));
    if (freeBytes === void 0) return true;
    return freeBytes >= objectBytes * LARGE_OBJECT_FREE_SPACE_FACTOR;
  }
  async syncFile(storeId, manifest, relPath, absPath, fileStat, bypassStatCache = false, modeOverride) {
    const existing = manifest.get(relPath);
    let mode = (modeOverride ?? fileStat.mode) & 511;
    if (fileStat.size > this.maxObjectBytes) {
      this.log(`oversize ${relPath}: ${fileStat.size}B over ${this.maxObjectBytes}B`);
      return classifyFileFailure(existing, mode, "oversize");
    }
    const cached2 = this.localStat.get(relPath);
    if (!bypassStatCache && cached2 != null && cached2.mtimeMs === fileStat.mtimeMs && cached2.size === fileStat.size && existing != null && isBoxStoreManifestFileEntry(existing) && existing.sha === cached2.sha && existing.size === cached2.size) {
      this.localStat.set(relPath, { ...cached2, mode });
      this.manifestStore.setManifestEntry(manifest, relPath, {
        kind: "file",
        sha: cached2.sha,
        size: cached2.size,
        mode
      });
      return "unchanged";
    }
    if (fileStat.size >= this.largeObjectThreshold) {
      return this.syncLargeFile(
        storeId,
        manifest,
        relPath,
        absPath,
        fileStat.size,
        mode,
        modeOverride
      );
    }
    let bytes;
    let effectiveStat = fileStat;
    try {
      const handle = await this.fs.open(absPath, import_node_fs14.constants.O_RDONLY | import_node_fs14.constants.O_NOFOLLOW);
      try {
        const live = await handle.stat();
        if (!live.isFile()) {
          throw new SandBoxStoreSyncError("snapshot source is not a regular file");
        }
        mode = (modeOverride ?? live.mode) & 511;
        effectiveStat = {
          mtimeMs: live.mtimeMs,
          size: live.size,
          mode
        };
        bytes = await handle.readFile();
      } finally {
        await handle.close();
      }
    } catch (error42) {
      if (this.skipInaccessibleEnabled() && isPermissionDenied(error42)) {
        return "skipped-inaccessible";
      }
      this.log(`read failed ${relPath}: ${errorMessage(error42)}`);
      return isSnapshotNodeRace(error42) ? "metadata-error" : classifyFileFailure(existing, mode, "error");
    }
    const sha = sha256Hex(bytes);
    this.localStat.set(relPath, {
      mtimeMs: effectiveStat.mtimeMs,
      size: bytes.byteLength,
      sha,
      mode
    });
    if (existing != null && isBoxStoreManifestFileEntry(existing) && existing.sha === sha && existing.size === bytes.byteLength) {
      this.manifestStore.setManifestEntry(manifest, relPath, {
        kind: "file",
        sha,
        size: bytes.byteLength,
        mode
      });
      return "unchanged";
    }
    try {
      await this.objectStore(storeId).put(`${BOX_STORE_BLOBS_PREFIX}/${sha}`, bytes, {
        contentAddressed: true
      });
    } catch (error42) {
      this.log(`upload failed ${relPath}: ${errorMessage(error42)}`);
      return classifyFileFailure(existing, mode, "error");
    }
    this.manifestStore.setManifestEntry(manifest, relPath, {
      kind: "file",
      sha,
      size: bytes.byteLength,
      mode
    });
    return "uploaded";
  }
  async syncLargeFile(storeId, manifest, relPath, absPath, expectedSizeBytes, expectedMode, modeOverride) {
    const existing = manifest.get(relPath);
    if (existing != null && isBoxStoreManifestFileEntry(existing) && existing.mode !== expectedMode) {
      const [matchResult] = await Promise.allSettled([
        this.matchExistingLargeFile(absPath, existing, expectedMode, modeOverride != null)
      ]);
      const matched = matchResult.status === "fulfilled" ? matchResult.value : void 0;
      if (matched != null) {
        this.localStat.set(relPath, matched);
        this.manifestStore.setManifestEntry(manifest, relPath, {
          kind: "file",
          sha: matched.sha,
          size: matched.size,
          mode: matched.mode
        });
        return "unchanged";
      }
    }
    const hasDiskSpace = await this.hasDiskSpaceForLargeObject(absPath, expectedSizeBytes);
    if (!hasDiskSpace) {
      this.log(
        `insufficient disk space for ${relPath} snapshot copy (${expectedSizeBytes}B needed x${LARGE_OBJECT_FREE_SPACE_FACTOR}); deferring to a later cycle`
      );
      return classifyFileFailure(existing, expectedMode, "error");
    }
    const tmpPath = `${absPath}${BOX_STORE_SNAPSHOT_TMP_SUFFIX}${(0, import_node_crypto11.randomBytes)(8).toString("hex")}`;
    let sha;
    let size;
    let mode;
    try {
      const copied = await copyFileHashing(absPath, tmpPath);
      sha = copied.sha;
      size = copied.size;
      mode = (modeOverride ?? copied.mode) & 511;
    } catch (error42) {
      await this.discardTemp({ tmpPath, label: relPath });
      if (this.skipInaccessibleEnabled() && isPermissionDenied(error42)) {
        return "skipped-inaccessible";
      }
      this.log(`read failed ${relPath}: ${errorMessage(error42)}`);
      return isSnapshotNodeRace(error42) ? "metadata-error" : classifyFileFailure(existing, expectedMode, "error");
    }
    try {
      if (size > this.maxObjectBytes) {
        this.log(`oversize ${relPath}: ${size}B over ${this.maxObjectBytes}B`);
        return classifyFileFailure(existing, mode, "oversize");
      }
      const alreadyStored = existing != null && isBoxStoreManifestFileEntry(existing) && existing.sha === sha && existing.size === size;
      if (!alreadyStored) {
        await this.objectStore(storeId).putFromFile(
          `${BOX_STORE_BLOBS_PREFIX}/${sha}`,
          tmpPath,
          sha,
          size
        );
      }
      this.manifestStore.setManifestEntry(manifest, relPath, {
        kind: "file",
        sha,
        size,
        mode
      });
      await this.rememberLargeLocalStat(relPath, absPath, sha, size, mode);
      return alreadyStored ? "unchanged" : "uploaded";
    } catch (error42) {
      this.log(`upload failed ${relPath}: ${errorMessage(error42)}`);
      return classifyFileFailure(existing, mode, "error");
    } finally {
      await this.discardTemp({ tmpPath, label: relPath });
    }
  }
  async matchExistingLargeFile(absPath, existing, expectedMode, hasModeOverride) {
    const before = await (0, import_promises18.lstat)(absPath, { bigint: true });
    if (!before.isFile() || before.size !== BigInt(existing.size)) return void 0;
    const sha = await sha256File(absPath);
    const after = await (0, import_promises18.lstat)(absPath, { bigint: true });
    const sourceMode = Number(after.mode) & 511;
    if (!after.isFile() || before.dev !== after.dev || before.ino !== after.ino || before.size !== after.size || before.mtimeNs !== after.mtimeNs || before.ctimeNs !== after.ctimeNs || before.mode !== after.mode || sha !== existing.sha || !hasModeOverride && sourceMode !== expectedMode) {
      return void 0;
    }
    return {
      mtimeMs: Number(after.mtimeNs) / 1e6,
      size: existing.size,
      sha,
      mode: expectedMode
    };
  }
  async rememberLargeLocalStat(relPath, absPath, sha, size, mode) {
    try {
      const live = await this.fs.lstat(absPath);
      if (live.isFile() && live.size === size && (live.mode & 511) === mode) {
        this.localStat.set(relPath, {
          mtimeMs: live.mtimeMs,
          size,
          sha,
          mode
        });
        return;
      }
    } catch {
    }
    this.localStat.delete(relPath);
  }
  async syncSymlink(args) {
    const { manifest, relPath, absPath } = args;
    try {
      const target = await this.fs.readlink(absPath);
      const changed = this.manifestStore.setManifestEntry(manifest, relPath, {
        kind: "symlink",
        target
      });
      this.localStat.delete(relPath);
      return changed ? "uploaded" : "unchanged";
    } catch (error42) {
      this.log(`readlink failed ${relPath}: ${errorMessage(error42)}`);
      return "metadata-error";
    }
  }
  async syncCategory(storeId, category) {
    const summary = {
      name: category.name,
      filesScanned: 0,
      filesUploaded: 0,
      bytesUploaded: 0,
      skippedUnchanged: 0,
      removed: 0,
      oversize: 0,
      failures: 0,
      metadataFailures: 0
    };
    const treeExists = category.stageOnly || (0, import_node_fs14.existsSync)(category.absRoot);
    let staged;
    if (category.stage != null && treeExists) {
      try {
        staged = await category.stage();
      } catch (error42) {
        this.log(`stage ${category.name} failed: ${errorMessage(error42)}`);
      }
    }
    try {
      const excludes = (category.excludes ?? []).map(globToRegExp);
      if (category.containsAgentStoreDbs) {
        for (const basename24 of AGENT_STORE_DB_BASENAMES) {
          for (const suffix of ["", ...SQLITE_DB_SIDECAR_SUFFIXES]) {
            excludes.push(globToRegExp(`${category.relPrefix}/**/${basename24}${suffix}`));
          }
          excludes.push(globToRegExp(`${category.relPrefix}/**/${basename24}.corrupt-*`));
          excludes.push(globToRegExp(`${category.relPrefix}/**/${basename24}.replacement*`));
          excludes.push(globToRegExp(`${category.relPrefix}/**/${basename24}.pending`));
        }
      }
      const seen = /* @__PURE__ */ new Set();
      const manifest = await this.manifestStore.loadManifest(storeId);
      const ignore4 = category.ignore?.();
      const candidates = [];
      let walkComplete = true;
      if (!category.stageOnly && treeExists) {
        const shouldSkipDir = ignore4 ? (relDir) => {
          if (!ignore4.canPruneDir(relDir)) return false;
          summary.prunedDirs = (summary.prunedDirs ?? 0) + 1;
          return true;
        } : void 0;
        for await (const node of walkNodes(category.absRoot, this.fs, shouldSkipDir)) {
          if (node.kind === "readdir-error") {
            walkComplete = false;
            if (this.skipInaccessibleEnabled() && isPermissionDenied(node.error)) {
              tallySkippedInaccessible(summary);
            } else {
              tallyMetadataFailure(summary);
            }
            continue;
          }
          const absPath = node.absPath;
          const markerPath = this.deps.hydrationHandoffMarkerPath;
          if (markerPath != null && (absPath === markerPath || absPath.startsWith(`${markerPath}.`) && absPath.endsWith(".tmp"))) {
            continue;
          }
          const relUnderRoot = (0, import_node_path15.relative)(category.absRoot, absPath).split(import_node_path15.sep).join("/");
          const relPath = `${category.relPrefix}/${relUnderRoot}`;
          if (excludes.some((re3) => re3.test(relPath))) continue;
          if (relPath.includes(BOX_STORE_SNAPSHOT_TMP_SUFFIX) || relPath.includes(BOX_STORE_RESTORE_TMP_SUFFIX)) {
            continue;
          }
          let fileStat;
          try {
            fileStat = await this.fs.lstat(absPath);
          } catch (error42) {
            seen.add(relPath);
            if (this.skipInaccessibleEnabled() && isPermissionDenied(error42)) {
              tallySkippedInaccessible(summary);
            } else {
              tallyMetadataFailure(summary);
            }
            continue;
          }
          if (!fileStat.isFile() && !fileStat.isSymbolicLink()) {
            seen.add(relPath);
            if (this.skipInaccessibleEnabled()) tallySkippedInaccessible(summary);
            else tallyMetadataFailure(summary);
            continue;
          }
          if (ignore4?.ignores(relUnderRoot)) {
            summary.excludedFiles = (summary.excludedFiles ?? 0) + 1;
            summary.excludedBytes = (summary.excludedBytes ?? 0) + fileStat.size;
            continue;
          }
          seen.add(relPath);
          candidates.push({
            relPath,
            absPath,
            fileStat,
            nodeKind: fileStat.isSymbolicLink() ? "symlink" : "file"
          });
        }
      }
      if (ignore4 != null && ((summary.prunedDirs ?? 0) > 0 || (summary.excludedFiles ?? 0) > 0)) {
        this.log(
          `${category.name} ignore: pruned ${summary.prunedDirs ?? 0} dirs, excluded ${summary.excludedFiles ?? 0} files (${summary.excludedBytes ?? 0}B)`
        );
      }
      for (const file2 of staged?.files ?? []) {
        let fileStat;
        try {
          fileStat = await this.fs.lstat(file2.absPath);
        } catch (error42) {
          if (this.skipInaccessibleEnabled() && isPermissionDenied(error42)) {
            seen.add(file2.relPath);
            tallySkippedInaccessible(summary);
          } else {
            tallyMetadataFailure(summary);
          }
          continue;
        }
        if (!fileStat.isFile()) {
          if (this.skipInaccessibleEnabled()) {
            seen.add(file2.relPath);
            tallySkippedInaccessible(summary);
          } else {
            tallyMetadataFailure(summary);
          }
          continue;
        }
        seen.add(file2.relPath);
        candidates.push({
          relPath: file2.relPath,
          absPath: file2.absPath,
          fileStat,
          nodeKind: "file",
          modeOverride: file2.mode,
          bypassStatCache: true
        });
      }
      await this.uploadCandidates(storeId, manifest, candidates, summary);
      summary.failures += staged?.skipped ?? 0;
      const missingRootBlocksPrune = !treeExists && category.missingRootMeansDeleted !== true;
      if (!category.stageOnly && missingRootBlocksPrune) {
        const survivors = [...manifest.keys()].filter(
          (relPath) => relPath.startsWith(`${category.relPrefix}/`)
        ).length;
        if (survivors > 0) {
          this.log(
            `${category.name} root is missing while the manifest holds ${survivors} entries under it; skipping the prune (a lost local tree is disk failure, not deletion)`
          );
        }
      }
      if (!category.stageOnly && walkComplete && !missingRootBlocksPrune) {
        for (const relPath of [...manifest.keys()]) {
          if (!relPath.startsWith(`${category.relPrefix}/`)) continue;
          if (excludes.some((re3) => re3.test(relPath))) continue;
          if (seen.has(relPath)) continue;
          this.manifestStore.deleteManifestEntry(manifest, relPath);
          this.localStat.delete(relPath);
          summary.removed += 1;
        }
      }
      return summary;
    } finally {
      await staged?.cleanup().catch((error42) => {
        this.log(`stage cleanup ${category.name} failed: ${errorMessage(error42)}`);
      });
    }
  }
  async uploadCandidates(storeId, manifest, candidates, summary) {
    const small = [];
    const large = [];
    for (const candidate of candidates) {
      (candidate.nodeKind === "file" && candidate.fileStat.size >= this.largeObjectThreshold ? large : small).push(candidate);
    }
    const upload = async (candidate) => {
      let fileStat;
      try {
        fileStat = await this.fs.lstat(candidate.absPath);
      } catch (error42) {
        if (this.skipInaccessibleEnabled() && isPermissionDenied(error42)) {
          tallySkippedInaccessible(summary);
          return;
        }
        tallyMetadataFailure(summary);
        return;
      }
      summary.filesScanned += 1;
      if (fileStat.isSymbolicLink()) {
        if (this.skipInaccessibleEnabled() && this.manifestFormatLacksSymlinkEntries()) {
          tallySkippedInaccessible(summary);
          return;
        }
        const outcome2 = await this.syncSymlink({
          manifest,
          relPath: candidate.relPath,
          absPath: candidate.absPath
        });
        tallyFileOutcome(summary, outcome2, 0);
        return;
      }
      if (!fileStat.isFile()) {
        if (this.skipInaccessibleEnabled()) tallySkippedInaccessible(summary);
        else tallyMetadataFailure(summary);
        return;
      }
      const outcome = await this.syncFile(
        storeId,
        manifest,
        candidate.relPath,
        candidate.absPath,
        {
          mtimeMs: fileStat.mtimeMs,
          size: fileStat.size,
          mode: fileStat.mode
        },
        candidate.bypassStatCache === true,
        candidate.modeOverride
      );
      tallyFileOutcome(summary, outcome, fileStat.size);
    };
    await forEachBounded(small, this.uploadConcurrency, upload);
    await forEachBounded(large, SNAPSHOT_OUT_LARGE_CONCURRENCY, upload);
  }
  async syncPacks(storeId) {
    return this.packPipeline.syncPacks(storeId);
  }
  async download(targetDir, options2 = {}) {
    return this.downloader.download(targetDir, options2);
  }
  async sweepLeakedTemps() {
    const roots = dedupeNestedRoots(
      this.deps.categories.filter((c) => !c.stageOnly).map((c) => c.absRoot)
    );
    let removed = 0;
    for (const root of roots) {
      for await (const node of walkNodes(root, this.fs)) {
        if (node.kind !== "file") continue;
        const absPath = node.absPath;
        if (!absPath.includes(BOX_STORE_SNAPSHOT_TMP_SUFFIX) && !absPath.includes(BOX_STORE_RESTORE_TMP_SUFFIX)) {
          continue;
        }
        try {
          await (0, import_promises18.unlink)(absPath);
          removed += 1;
        } catch {
          continue;
        }
      }
    }
    return removed;
  }
};
async function* walkNodes(root, fs33, shouldSkipDir) {
  async function* walk(dir) {
    let entries;
    try {
      entries = await fs33.readdir(dir, { withFileTypes: true });
    } catch (error42) {
      yield { kind: "readdir-error", error: error42 };
      return;
    }
    for (const entry of entries) {
      const abs = (0, import_node_path15.join)(dir, entry.name);
      if (entry.isSymbolicLink()) {
        yield { absPath: abs, kind: "symlink" };
      } else if (entry.isDirectory()) {
        if (shouldSkipDir != null) {
          const relDir = (0, import_node_path15.relative)(root, abs).split(import_node_path15.sep).join("/");
          if (shouldSkipDir(relDir)) continue;
        }
        yield* walk(abs);
      } else if (entry.isFile()) {
        yield { absPath: abs, kind: "file" };
      }
    }
  }
  yield* walk(root);
}
function dedupeNestedRoots(roots) {
  const unique = [...new Set(roots)];
  return unique.filter(
    (root) => !unique.some((other) => other !== root && root.startsWith(`${other}/`))
  );
}

