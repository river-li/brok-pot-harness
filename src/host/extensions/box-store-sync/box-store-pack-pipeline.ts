var import_node_crypto10 = require("node:crypto");
var import_promises17 = require("node:fs/promises");
var import_node_os4 = require("node:os");
var import_node_path14 = require("node:path");
init_errors();
var PACK_DOWNLOAD_CONCURRENCY = 2;
var PACK_RESTORE_MIN_MEMBERS = 16;
var PACK_RESTORE_MIN_BYTE_SHARE = 8;
var PACK_EXTRACT_CONCURRENCY = 16;
var PACK_BUILD_MIN_MEMBERS = PACK_RESTORE_MIN_MEMBERS;
var PACK_BUILD_MIN_BYTES = 4 * 1024 * 1024;
var PACK_TMP_DIR_NAME = "sand-box-store-pack";
var PACK_TMP_MAX_AGE_MS = 24 * 60 * 60 * 1e3;
var BoxStorePackPipeline = class {
  categories;
  objectStore;
  manifestStore;
  now;
  log;
  getFlushWaiters;
  discardTemp;
  sha256File;
  constructor(args) {
    this.categories = args.categories;
    this.objectStore = args.objectStore;
    this.manifestStore = args.manifestStore;
    this.now = args.now;
    this.log = args.log;
    this.getFlushWaiters = args.getFlushWaiters;
    this.discardTemp = args.discardTemp;
    this.sha256File = args.sha256File;
  }
  resolveLocalPathForRelPath(relPath) {
    let best;
    for (const category of this.categories) {
      if (category.stageOnly) continue;
      if (!relPath.startsWith(`${category.relPrefix}/`)) continue;
      if (best == null || category.relPrefix.length > best.relPrefix.length) {
        best = category;
      }
    }
    if (best == null) return void 0;
    return (0, import_node_path14.join)(best.absRoot, ...relPath.slice(best.relPrefix.length + 1).split("/"));
  }
  async ensureSweptPackTmpDir() {
    const dir = (0, import_node_path14.join)((0, import_node_os4.tmpdir)(), PACK_TMP_DIR_NAME);
    await (0, import_promises17.mkdir)(dir, { recursive: true });
    try {
      const now = this.now();
      for (const name17 of await (0, import_promises17.readdir)(dir)) {
        const path31 = (0, import_node_path14.join)(dir, name17);
        try {
          const info2 = await (0, import_promises17.stat)(path31);
          if (now - info2.mtimeMs > PACK_TMP_MAX_AGE_MS) {
            await (0, import_promises17.unlink)(path31);
          }
        } catch {
        }
      }
    } catch {
    }
    return dir;
  }
  async syncPacks(storeId) {
    const summary = {
      name: "packs",
      filesScanned: 0,
      filesUploaded: 0,
      bytesUploaded: 0,
      skippedUnchanged: 0,
      removed: 0,
      oversize: 0,
      failures: 0,
      metadataFailures: 0
    };
    try {
      const store = this.objectStore(storeId);
      const manifest = await this.manifestStore.loadManifest(storeId);
      const live = /* @__PURE__ */ new Map();
      const eligible = /* @__PURE__ */ new Map();
      const localBySha = /* @__PURE__ */ new Map();
      for (const [relPath, entry] of manifest) {
        if (!isBoxStoreManifestFileEntry(entry)) continue;
        live.set(entry.sha, entry.size);
        if (entry.size >= PACK_MEMBER_MAX_BYTES) continue;
        if (eligible.has(entry.sha)) continue;
        const absPath = this.resolveLocalPathForRelPath(relPath);
        if (absPath == null) continue;
        try {
          const info2 = await (0, import_promises17.lstat)(absPath);
          if (!info2.isFile() || info2.size !== entry.size) continue;
        } catch {
          continue;
        }
        eligible.set(entry.sha, entry.size);
        localBySha.set(entry.sha, absPath);
      }
      const rawIndex = await store.get(BOX_STORE_PACK_INDEX_KEY);
      const index = rawIndex == null || rawIndex.byteLength > PACK_INDEX_MAX_BYTES ? null : parsePackIndex(Buffer.from(rawIndex).toString("utf8"));
      if (rawIndex != null && index == null) {
        this.log("pack index unparseable; rebuilding from scratch");
      }
      const plan = planPackMaintenance({
        live,
        eligible,
        index,
        maxPackMemberSizeSum: PACK_MAX_MEMBER_SIZE_SUM,
        minPackMembers: PACK_BUILD_MIN_MEMBERS,
        minPackBytes: PACK_BUILD_MIN_BYTES
      });
      summary.skippedUnchanged = plan.keptPacks.length;
      summary.removed = plan.retiredPackIds.length;
      summary.filesScanned = plan.newPacks.length;
      if (plan.newPacks.length === 0 && plan.retiredPackIds.length === 0) {
        return summary;
      }
      const yieldToFlush = () => this.getFlushWaiters() > 0;
      const tmpDir = await this.ensureSweptPackTmpDir();
      const builtPacks = [];
      for (const planned of plan.newPacks) {
        if (yieldToFlush()) {
          this.log("pack round yielded to a waiting flush; will retry later");
          return summary;
        }
        const tmpPath = (0, import_node_path14.join)(tmpDir, `build-${(0, import_node_crypto10.randomBytes)(8).toString("hex")}`);
        try {
          const built = await buildPackFile(
            tmpPath,
            planned.flatMap((member) => {
              const absPath = localBySha.get(member.sha);
              return absPath == null ? [] : [{ ...member, absPath }];
            }),
            yieldToFlush
          );
          if (built == null) {
            this.log("pack round yielded to a waiting flush; will retry later");
            return summary;
          }
          if (built.members.length === 0) continue;
          const builtSizeSum = built.members.reduce((sum, member) => sum + member.size, 0);
          if (built.members.length < PACK_BUILD_MIN_MEMBERS && builtSizeSum < PACK_BUILD_MIN_BYTES) {
            continue;
          }
          const packId = await this.sha256File(tmpPath);
          await store.putFromFile(
            `${BOX_STORE_PACKS_PREFIX}/${packId}`,
            tmpPath,
            packId,
            built.fileBytes
          );
          builtPacks.push({
            id: packId,
            bytes: built.fileBytes,
            members: [...built.members]
          });
          summary.filesUploaded += 1;
          summary.bytesUploaded += built.fileBytes;
        } finally {
          await this.discardTemp({ tmpPath, label: "pack build" });
        }
      }
      if (yieldToFlush()) {
        this.log("pack round yielded to a waiting flush; will retry later");
        return summary;
      }
      if (builtPacks.length === 0 && plan.retiredPackIds.length === 0) {
        return summary;
      }
      const nextIndex = {
        version: 1,
        maxVmtime: Math.max(
          index?.maxVmtime ?? 0,
          ...builtPacks.flatMap((pack) => pack.members.map((m2) => m2.vmtime))
        ),
        packs: [...plan.keptPacks, ...builtPacks]
      };
      const referenced = new Set(nextIndex.packs.map((pack) => pack.id));
      const retiring = plan.retiredPackIds.filter((id) => !referenced.has(id));
      try {
        const rawRetired = await store.get(BOX_STORE_PACK_RETIRED_KEY);
        let existing;
        if (rawRetired == null) {
          existing = [];
        } else {
          existing = parsePackRetired(Buffer.from(rawRetired).toString("utf8"));
        }
        if (existing == null) {
          if (retiring.length > 0) {
            throw new SandBoxStoreSyncError(
              "packs/retired.json is present but unreadable; refusing to overwrite"
            );
          }
          this.log(
            "packs/retired.json unreadable; proceeding without tombstone update (nothing retiring)"
          );
        } else {
          const merged = [.../* @__PURE__ */ new Set([...existing, ...retiring])].filter(
            (id) => !referenced.has(id)
          );
          const changed = merged.length !== existing.length || merged.some((id, i) => existing[i] !== id);
          if (changed) {
            await store.put(
              BOX_STORE_PACK_RETIRED_KEY,
              new Uint8Array(Buffer.from(serializePackRetired(merged), "utf8"))
            );
          }
        }
      } catch (error41) {
        this.log(`pack retired-list write failed: ${errorMessage(error41)}`);
        summary.failures += 1;
        return summary;
      }
      await store.put(
        BOX_STORE_PACK_INDEX_KEY,
        new Uint8Array(Buffer.from(JSON.stringify(nextIndex), "utf8"))
      );
      if (store.delete != null) {
        for (const packId of retiring) {
          try {
            await store.delete(`${BOX_STORE_PACKS_PREFIX}/${packId}`);
          } catch (error41) {
            this.log(`pack ${packId} delete failed: ${errorMessage(error41)}`);
          }
        }
      }
      if (plan.deferredMembers > 0) {
        this.log(`pack round deferred ${plan.deferredMembers} member(s) under the build floor`);
      }
    } catch (error41) {
      this.log(`pack maintenance round failed: ${errorMessage(error41)}`);
      summary.failures += 1;
    }
    return summary;
  }
  async restoreBulkSmallFromPacks(args) {
    const {
      store,
      targetDir,
      groups: bulkSmall,
      byteBudget,
      localFileMatches,
      mkdirOwned,
      applyExistingFileMetadata,
      writeVerifiedBytes,
      recordRestoredPath
    } = args;
    const restoredByPack = new ClaimSet();
    const ensuredDirs = /* @__PURE__ */ new Set();
    const ensureDir2 = async (dir) => {
      if (ensuredDirs.has(dir)) return;
      await mkdirOwned(dir);
      ensuredDirs.add(dir);
    };
    const restoreFromPack = async (pack) => {
      const usable = [];
      let usableClen = 0;
      let usableSize = 0;
      for (const member of pack.members) {
        const group = bulkSmall.get(`${member.sha}:${member.size}`);
        if (group == null) continue;
        let pending = false;
        for (const relPath of group.relPaths) {
          if (restoredByPack.has(relPath)) continue;
          const destPath = (0, import_node_path14.join)(targetDir, relPath);
          await ensureDir2((0, import_node_path14.dirname)(destPath));
          if (await localFileMatches(destPath, group)) {
            continue;
          }
          pending = true;
          break;
        }
        if (pending) {
          usable.push(member);
          usableClen += member.clen;
          usableSize += member.size;
        }
      }
      if (usable.length < PACK_RESTORE_MIN_MEMBERS && usableSize < PACK_BUILD_MIN_BYTES) {
        return;
      }
      if (usableClen * PACK_RESTORE_MIN_BYTE_SHARE < pack.bytes) return;
      const tmpPath = (0, import_node_path14.join)(
        await this.ensureSweptPackTmpDir(),
        `restore-${(0, import_node_crypto10.randomBytes)(8).toString("hex")}`
      );
      try {
        const written = await store.getToFile(`${BOX_STORE_PACKS_PREFIX}/${pack.id}`, tmpPath, {
          maxBytes: pack.bytes
        });
        if (written == null) return;
        const result = await extractPackMembers({
          packPath: tmpPath,
          members: pack.members,
          concurrency: PACK_EXTRACT_CONCURRENCY,
          admitBytes: async (memberBytes) => {
            await byteBudget.acquire(memberBytes);
            return () => byteBudget.release(memberBytes);
          },
          wants: (member) => {
            const group = bulkSmall.get(`${member.sha}:${member.size}`);
            return group != null && group.relPaths.some((relPath) => !restoredByPack.has(relPath));
          },
          onBlob: async (member, blobBytes) => {
            const group = bulkSmall.get(`${member.sha}:${member.size}`);
            if (group == null) return;
            for (const relPath of group.relPaths) {
              if (!restoredByPack.tryClaim(relPath)) continue;
              const destPath = (0, import_node_path14.join)(targetDir, relPath);
              try {
                await ensureDir2((0, import_node_path14.dirname)(destPath));
                if (await localFileMatches(destPath, group)) {
                  await applyExistingFileMetadata(destPath, relPath);
                } else {
                  await writeVerifiedBytes(destPath, relPath, blobBytes);
                }
              } catch {
                restoredByPack.release(relPath);
                continue;
              }
              recordRestoredPath(group.size);
            }
          }
        });
        if (result.mismatched > 0) {
          this.log(
            `pack ${pack.id}: ${result.mismatched} member(s) failed sha verify; falling back to loose blobs`
          );
        }
      } finally {
        await this.discardTemp({ tmpPath, label: `pack ${pack.id}` });
      }
    };
    if (bulkSmall.size > 0) {
      let packIndex = null;
      try {
        const rawIndex = await store.get(BOX_STORE_PACK_INDEX_KEY);
        packIndex = rawIndex == null || rawIndex.byteLength > PACK_INDEX_MAX_BYTES ? null : parsePackIndex(Buffer.from(rawIndex).toString("utf8"));
      } catch (error41) {
        this.log(`pack index read failed (falling back to loose blobs): ${errorMessage(error41)}`);
      }
      if (packIndex != null && packIndex.packs.length > 0) {
        await forEachBounded([...packIndex.packs], PACK_DOWNLOAD_CONCURRENCY, async (pack) => {
          try {
            await restoreFromPack(pack);
          } catch (error41) {
            this.log(
              `pack ${pack.id} restore failed (falling back to loose blobs): ${errorMessage(error41)}`
            );
          }
        });
      }
    }
    return restoredByPack.snapshot();
  }
};
