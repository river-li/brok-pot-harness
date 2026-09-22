/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/working-state-export/working-state-export-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist3();
init_errors();
var READ_BATCH_BLOBS = 32;
var EXPORT_PUT_CONCURRENCY = 8;
var MAX_READ_BATCH_BLOBS = 64;
var MAX_EXPORT_PUT_CONCURRENCY = 32;
var BLOB_HASH_MISMATCH_CODE = "BLOB_HASH_MISMATCH";
var CLIENT_STATE_PREVIEW_MAX_CHARS = 200;
var DURABLE_BLOB_HEX_PREFIXES = "0123456789abcdef".split("");
var DURABLE_BLOB_LIST_CONCURRENCY = 16;
function boundedConcurrency(value, fallback2, maximum) {
  if (value === void 0 || !Number.isInteger(value) || value < 1) return fallback2;
  return value > maximum ? maximum : value;
}
function workingStateExportErrorClass(error42) {
  if (typeof error42 === "object" && error42 !== null && "code" in error42 && error42.code === BLOB_HASH_MISMATCH_CODE) {
    return "blob-hash-mismatch";
  }
  return errorClassOf(error42);
}
function workingStateExportClientStateSeedFromSummary(summary) {
  if (summary === null) return void 0;
  const lastActivityAtMs = Math.max(summary.lastActivityAt ?? 0, summary.updatedAt);
  if (!Number.isSafeInteger(lastActivityAtMs) || lastActivityAtMs <= 0) return void 0;
  const lastViewedAtMs = summary.lastViewedAt;
  const lastEntryId = summary.newestEntryId;
  const lastMessageId = summary.lastMessageId;
  const lastMessagePreview = clientStatePreviewOf(summary.lastMessagePreview);
  let lastMessage = {};
  if (lastMessageId !== null && lastMessageId.length > 0) {
    lastMessage = {
      lastMessageId,
      ...lastMessagePreview === void 0 ? {} : { lastMessagePreview }
    };
  }
  return {
    lastActivityAtMs,
    unreadCount: summary.hasUnread ? Math.max(1, Math.floor(summary.unreadCount ?? 0)) : 0,
    ...lastViewedAtMs === void 0 || !Number.isSafeInteger(lastViewedAtMs) || lastViewedAtMs <= 0 ? {} : { lastViewedAtMs },
    ...lastEntryId === void 0 || lastEntryId === null || lastEntryId.length === 0 ? {} : { lastEntryId },
    ...lastMessage
  };
}
function clientStatePreviewOf(preview) {
  if (preview === void 0 || preview === null || preview.length === 0) return void 0;
  if (preview.length <= CLIENT_STATE_PREVIEW_MAX_CHARS) return preview;
  return `${preview.slice(0, CLIENT_STATE_PREVIEW_MAX_CHARS - 1)}\u2026`;
}
async function waitForWorkingStateOperation(startOperation, control) {
  if (control == null) return await startOperation();
  control.signal.throwIfAborted();
  const operation = startOperation();
  const result = await new Promise((resolve29, reject2) => {
    const aborted2 = () => reject2(control.signal.reason);
    control.signal.addEventListener("abort", aborted2, { once: true });
    void operation.then(
      (value) => {
        control.signal.removeEventListener("abort", aborted2);
        resolve29(value);
      },
      (error42) => {
        control.signal.removeEventListener("abort", aborted2);
        reject2(error42);
      }
    );
  });
  control.signal.throwIfAborted();
  control.onProgress();
  return result;
}
var skipped = (reason, hasTranscript, pendingCompletions) => ({
  outcome: "skipped",
  reason,
  ...hasTranscript === void 0 ? {} : { hasTranscript },
  ...pendingCompletions === void 0 ? {} : { pendingCompletions }
});
function reportFields(progress) {
  return {
    listingOutcome: progress.listingOutcome,
    listingPages: progress.listingPages,
    listedBlobs: progress.listedBlobs,
    listingKnownBlobs: progress.listingKnownBlobs,
    listingDurationMs: progress.listingDurationMs,
    snapshotDurationMs: progress.snapshotDurationMs,
    readDurationMs: progress.readDurationMs,
    uploadDurationMs: progress.uploadDurationMs,
    closureBlobs: progress.closureBlobs,
    closureBytes: progress.closureBytes,
    uploadedBlobs: progress.uploadedBlobs,
    uploadedBytes: progress.uploadedBytes
  };
}
var WorkingStateExporter = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  uploadedHexIdsByAgent = /* @__PURE__ */ new Map();
  durableHexIds;
  durableListing;
  async exportAgent(agentId, limits = {}) {
    const startedAt = this.deps.now();
    const progress = {
      listingOutcome: "not_attempted",
      readDurationMs: 0,
      uploadDurationMs: 0
    };
    let outcome;
    try {
      outcome = await this.uploadClosure(agentId, limits, progress);
    } catch (error42) {
      outcome = { outcome: "failed", errorClass: workingStateExportErrorClass(error42) };
    }
    const alreadyDurableBlobs = outcome.outcome === "exported" ? Math.max(0, outcome.closureBlobCount - outcome.uploadedBlobs) : void 0;
    const alreadyDurableBytes = outcome.outcome === "exported" && progress.uploadedBytes !== void 0 ? Math.max(0, outcome.closureByteSize - progress.uploadedBytes) : void 0;
    const report = {
      agentId,
      trigger: limits.trigger ?? "manual",
      outcome: outcome.outcome,
      ...outcome.outcome === "skipped" ? { skipReason: outcome.reason } : {},
      ...outcome.outcome === "failed" ? { errorClass: outcome.errorClass } : {},
      possibleReupload: outcome.outcome === "exported" && progress.listingOutcome === "failed" && outcome.uploadedBlobs === outcome.closureBlobCount,
      ...reportFields(progress),
      ...alreadyDurableBlobs !== void 0 ? { alreadyDurableBlobs } : {},
      ...alreadyDurableBytes !== void 0 ? { alreadyDurableBytes } : {},
      durationMs: Math.max(0, this.deps.now() - startedAt)
    };
    try {
      this.deps.report(report);
    } catch (error42) {
      this.deps.log(`[sand:working-state-export] telemetry report failed (${errorLogTag(error42)})`);
    }
    return outcome;
  }
  async warmAgent(agentId, limits, control) {
    const startedAt = this.deps.now();
    const progress = {
      listingOutcome: "not_attempted",
      readDurationMs: 0,
      uploadDurationMs: 0
    };
    let outcome;
    try {
      const result = await this.uploadClosure(agentId, limits, progress, false, control);
      outcome = result.outcome === "exported" ? {
        outcome: "warmed",
        closureBlobCount: result.closureBlobCount,
        closureByteSize: result.closureByteSize,
        uploadedBlobs: result.uploadedBlobs
      } : result;
    } catch (error42) {
      outcome = { outcome: "failed", errorClass: workingStateExportErrorClass(error42) };
    }
    const dependencyBlobs = progress.closureBlobs !== void 0 ? Math.max(0, progress.closureBlobs - 1) : void 0;
    const dependencyBytes = progress.closureBytes !== void 0 && progress.rootBytes !== void 0 ? Math.max(0, progress.closureBytes - progress.rootBytes) : void 0;
    const hasTranscript = progress.hasTranscript ?? (outcome.outcome === "skipped" ? outcome.hasTranscript : void 0);
    const report = {
      agentId,
      ...control.populationAgents !== void 0 ? { populationAgents: control.populationAgents } : {},
      putConcurrency: control.putConcurrency,
      trigger: "turn_end",
      outcome: outcome.outcome,
      ...outcome.outcome === "skipped" ? { skipReason: outcome.reason } : {},
      ...hasTranscript === void 0 ? {} : { hasTranscript },
      ...outcome.outcome === "failed" ? { errorClass: outcome.errorClass } : {},
      possibleReupload: outcome.outcome === "warmed" && progress.listingOutcome === "failed" && progress.uploadedBlobs === dependencyBlobs,
      ...reportFields(progress),
      ...outcome.outcome === "warmed" && dependencyBlobs !== void 0 && progress.uploadedBlobs !== void 0 ? { alreadyDurableBlobs: Math.max(0, dependencyBlobs - progress.uploadedBlobs) } : {},
      ...outcome.outcome === "warmed" && dependencyBytes !== void 0 && progress.uploadedBytes !== void 0 ? { alreadyDurableBytes: Math.max(0, dependencyBytes - progress.uploadedBytes) } : {},
      durationMs: Math.max(0, this.deps.now() - startedAt)
    };
    try {
      this.deps.reportWarm(report);
    } catch (error42) {
      this.deps.log(`[sand:working-state-warm] telemetry report failed (${errorLogTag(error42)})`);
    }
    return outcome;
  }
  async durableBlobHexIdsOrNoneWhenUnlisted(progress, control) {
    if (this.durableHexIds !== void 0) {
      progress.listingOutcome = "ok";
      progress.listingPages = 0;
      progress.listedBlobs = 0;
      progress.listingKnownBlobs = this.durableHexIds.size;
      progress.listingDurationMs = 0;
      return this.durableHexIds;
    }
    const startedAt = this.deps.now();
    progress.listingPages = 0;
    progress.listedBlobs = 0;
    progress.listingKnownBlobs = 0;
    const listing = this.durableBlobListing();
    const onPage = (blobHexIds) => {
      if (control?.signal.aborted === true) return;
      progress.listingPages = (progress.listingPages ?? 0) + 1;
      progress.listedBlobs = (progress.listedBlobs ?? 0) + blobHexIds.length;
      progress.listingKnownBlobs = progress.listedBlobs;
      control?.onProgress();
    };
    listing.pageSubscribers.add(onPage);
    try {
      const listed = await waitForWorkingStateOperation(() => listing.promise, control);
      progress.listingOutcome = "ok";
      progress.listingKnownBlobs = listed.size;
      progress.listingDurationMs = Math.max(0, this.deps.now() - startedAt);
      return listed;
    } catch (error42) {
      progress.listingOutcome = control?.signal.aborted === true ? "interrupted" : "failed";
      progress.listingDurationMs = Math.max(0, this.deps.now() - startedAt);
      if (control?.signal.aborted === true) {
        throw error42;
      }
      this.deps.log(
        `[sand:working-state-export] durable blob listing failed (${errorLogTag(error42)}); uploading every blob this attempt`
      );
      return /* @__PURE__ */ new Set();
    } finally {
      listing.pageSubscribers.delete(onPage);
    }
  }
  durableBlobListing() {
    if (this.durableListing !== void 0) return this.durableListing;
    const token = /* @__PURE__ */ Symbol();
    const controller = new AbortController();
    const pageSubscribers = /* @__PURE__ */ new Set();
    const listPrefix = async (hexPrefix, signal) => await this.deps.listDurableBlobHexIds({
      ...hexPrefix === void 0 ? {} : { hexPrefix },
      ...signal === void 0 ? {} : { signal },
      onPage: (blobHexIds) => {
        for (const subscriber of pageSubscribers) subscriber(blobHexIds);
      }
    });
    const promise2 = Promise.resolve().then(async () => {
      const parallelListing = this.deps.parallelListing();
      if (!parallelListing) return [await listPrefix()];
      return await asyncMapValues(
        DURABLE_BLOB_HEX_PREFIXES,
        async (hexPrefix) => await listPrefix(hexPrefix, controller.signal),
        { max: DURABLE_BLOB_LIST_CONCURRENCY }
      );
    }).catch((error42) => {
      controller.abort(error42);
      throw error42;
    }).then((listedByPrefix) => {
      const listed = /* @__PURE__ */ new Set();
      for (const prefixSet of listedByPrefix) {
        for (const blobHexId of prefixSet) listed.add(blobHexId);
      }
      this.durableHexIds ??= listed;
      return this.durableHexIds;
    }).finally(() => {
      if (this.durableListing?.token === token) this.durableListing = void 0;
    });
    const listing = { token, promise: promise2, pageSubscribers };
    this.durableListing = listing;
    return listing;
  }
  forgetAgent(agentId) {
    this.uploadedHexIdsByAgent.delete(agentId);
  }
  async uploadClosure(agentId, limits, progress, includeRoot = true, control) {
    if (this.deps.isTemporalAgent(agentId)) return skipped("temporal-agent");
    if (limits.expectedServerId !== void 0) {
      const serverId = this.deps.readServerId(agentId);
      if (serverId === null) return skipped("agent-unstamped");
      if (serverId !== limits.expectedServerId) return skipped("agent-id-mismatch");
    }
    if (!this.deps.isStoreEnabled()) return skipped("store-disabled");
    if (this.deps.isTurnInFlight(agentId)) return skipped("turn-inflight");
    const snapshotStartedAt = this.deps.now();
    const snapshot = await waitForWorkingStateOperation(
      () => this.deps.readSnapshot(agentId, limits, (walkProgress) => {
        progress.hasTranscript = walkProgress.hasTranscript;
        if (walkProgress.kind === "closure") {
          progress.closureBlobs = walkProgress.closureBlobCount;
          progress.closureBytes = walkProgress.closureByteSize;
        }
      }),
      control
    );
    progress.snapshotDurationMs = Math.max(0, this.deps.now() - snapshotStartedAt);
    if (snapshot == null) return skipped("agent-missing");
    const skippedAfterSnapshot = (reason) => skipped(
      reason,
      snapshot.hasTranscript,
      includeRoot ? snapshot.pendingCompletions : void 0
    );
    if (this.deps.isTurnInFlight(agentId)) return skippedAfterSnapshot("turn-inflight");
    const { walk } = snapshot;
    if (walk.outcome !== "walked") return skippedAfterSnapshot(walk.reason);
    if (walk.unresolvedProtoRefs > 0) return skippedAfterSnapshot("unresolved-refs");
    if (walk.closureByteSize > (limits.maxClosureBytes ?? Infinity) || walk.reachableHexIds.length + 1 > (limits.maxClosureBlobs ?? Infinity)) {
      return skippedAfterSnapshot("oversize");
    }
    progress.closureBlobs = walk.reachableHexIds.length + 1;
    progress.closureBytes = walk.closureByteSize;
    progress.rootBytes = walk.rootBytes.byteLength;
    progress.uploadedBlobs = 0;
    progress.uploadedBytes = 0;
    let uploaded = this.uploadedHexIdsByAgent.get(agentId);
    if (uploaded == null) {
      uploaded = /* @__PURE__ */ new Set();
      this.uploadedHexIdsByAgent.set(agentId, uploaded);
    }
    const durable = await this.durableBlobHexIdsOrNoneWhenUnlisted(progress, control);
    if (control !== void 0 && this.deps.isTurnInFlight(agentId)) {
      return skippedAfterSnapshot("turn-inflight");
    }
    const missing = walk.reachableHexIds.filter(
      (hexId) => !uploaded.has(hexId) && !durable.has(hexId)
    );
    const readBatchBlobs = boundedConcurrency(
      limits.readBatchBlobs,
      READ_BATCH_BLOBS,
      MAX_READ_BATCH_BLOBS
    );
    const putConcurrency = control?.putConcurrency ?? boundedConcurrency(limits.putConcurrency, EXPORT_PUT_CONCURRENCY, MAX_EXPORT_PUT_CONCURRENCY);
    for (let start = 0; start < missing.length; start += readBatchBlobs) {
      if (control !== void 0 && this.deps.isTurnInFlight(agentId)) {
        return skippedAfterSnapshot("turn-inflight");
      }
      const chunkIds = missing.slice(start, start + readBatchBlobs);
      const readStartedAt = this.deps.now();
      const chunk = await waitForWorkingStateOperation(
        () => this.deps.readBlobs(agentId, chunkIds),
        control
      );
      progress.readDurationMs += Math.max(0, this.deps.now() - readStartedAt);
      if (control !== void 0 && this.deps.isTurnInFlight(agentId)) {
        return skippedAfterSnapshot("turn-inflight");
      }
      if (chunk.some((bytes) => bytes === void 0)) {
        return skippedAfterSnapshot("blob-missing");
      }
      for (let putStart = 0; putStart < chunkIds.length; putStart += putConcurrency) {
        if (control !== void 0 && this.deps.isTurnInFlight(agentId)) {
          return skippedAfterSnapshot("turn-inflight");
        }
        const uploadStartedAt = this.deps.now();
        try {
          await Promise.all(
            chunkIds.slice(putStart, putStart + putConcurrency).map(async (hexId, offset) => {
              const bytes = chunk[putStart + offset];
              if (bytes === void 0) return;
              await waitForWorkingStateOperation(
                () => control == null ? this.deps.putBlob(hexId, bytes) : this.deps.putBlob(hexId, bytes, control.signal),
                control
              );
              uploaded.add(hexId);
              progress.uploadedBlobs = (progress.uploadedBlobs ?? 0) + 1;
              progress.uploadedBytes = (progress.uploadedBytes ?? 0) + bytes.byteLength;
            })
          );
          if (control !== void 0 && this.deps.isTurnInFlight(agentId)) {
            return skippedAfterSnapshot("turn-inflight");
          }
        } finally {
          progress.uploadDurationMs += Math.max(0, this.deps.now() - uploadStartedAt);
        }
      }
    }
    const rootMissing = includeRoot && !uploaded.has(walk.rootHexId) && !durable.has(walk.rootHexId);
    if (rootMissing) {
      const uploadStartedAt = this.deps.now();
      try {
        await waitForWorkingStateOperation(
          () => control == null ? this.deps.putBlob(walk.rootHexId, walk.rootBytes) : this.deps.putBlob(walk.rootHexId, walk.rootBytes, control.signal),
          control
        );
        uploaded.add(walk.rootHexId);
        progress.uploadedBlobs = (progress.uploadedBlobs ?? 0) + 1;
        progress.uploadedBytes = (progress.uploadedBytes ?? 0) + walk.rootBytes.byteLength;
      } finally {
        progress.uploadDurationMs += Math.max(0, this.deps.now() - uploadStartedAt);
      }
    }
    const clientStateSeed = includeRoot ? await this.deps.readClientStateSeed(agentId) : void 0;
    if (includeRoot && this.deps.isTurnInFlight(agentId)) {
      return skippedAfterSnapshot("turn-inflight");
    }
    return {
      outcome: "exported",
      rootBlobId: walk.rootHexId,
      closureBlobCount: walk.reachableHexIds.length + 1,
      closureByteSize: walk.closureByteSize,
      uploadedBlobs: missing.length + (rootMissing ? 1 : 0),
      pendingCompletions: snapshot.pendingCompletions,
      ...clientStateSeed === void 0 ? {} : { clientStateSeed }
    };
  }
};

