/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/bcs-transport.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_agent_store_pb();
init_background_composer_connect();
init_esm2();

// @recovered-fragment 2/2
var __awaiter2 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var AGENT_STORE_TOKEN_HEADER = "x-agent-store-token";
var DIRECTORY_LIST_CACHE_TTL_MS = 1e3;
var DIRECTORY_LIST_PAGE_SIZE = 1e3;
var DIRECTORY_LIST_MAX_PAGES = 10;
var DIRECTORY_LIST_MAX_ENTRIES = DIRECTORY_LIST_PAGE_SIZE * DIRECTORY_LIST_MAX_PAGES;
var DEFAULT_RPC_TIMEOUT_MS = 6e4;
var BcsAgentStoreTransport = class {
  constructor(input) {
    var _a19, _b2;
    this.directoryListCache = /* @__PURE__ */ new Map();
    this.completeFlatListCache = /* @__PURE__ */ new Map();
    this.listCacheGenerationByTarget = /* @__PURE__ */ new Map();
    this.knownLargeTargets = /* @__PURE__ */ new Set();
    this.now = (_a19 = input.now) !== null && _a19 !== void 0 ? _a19 : Date.now;
    this.directoryListCacheTtlMs = (_b2 = input.flatFileListCacheTtlMs) !== null && _b2 !== void 0 ? _b2 : DIRECTORY_LIST_CACHE_TTL_MS;
    this.mintTokenHeaders = input.mintTokenHeaders;
    this.rpcTimeoutMs = normalizeRpcTimeoutMs(input.rpcTimeoutMs);
    if (input.client !== void 0) {
      this.client = input.client;
    } else if (input.transport !== void 0) {
      this.client = createClient(BackgroundComposerService, input.transport);
    } else {
      throw new Error("BcsAgentStoreTransport requires either `client` or `transport`.");
    }
  }
  mintToken(target, options2) {
    return __awaiter2(this, void 0, void 0, function* () {
      try {
        const response = yield this.invokeRpc((callOptions) => this.client.mintAgentStoreToken(mintAgentStoreTokenRequestForTarget(target), callOptions), Object.assign(Object.assign({}, this.mintTokenHeaders === void 0 ? {} : { headers: Object.assign({}, this.mintTokenHeaders) }), (options2 === null || options2 === void 0 ? void 0 : options2.signal) === void 0 ? {} : { signal: options2.signal }));
        return {
          token: response.token,
          expiresAtMs: Number(response.expiresAtMs),
          storeIds: [...response.storeIds.length > 0 ? response.storeIds : response.agentIds]
        };
      } catch (error42) {
        throw mapConnectError(error42);
      }
    });
  }
  listFiles(_a19) {
    return __awaiter2(this, arguments, void 0, function* ({ token, storeId, relPath, shareId, signal, tombstoneMode, tombstonesSinceMs }) {
      return yield this.fetchCachedDirectoryList({
        token,
        storeId,
        relPath,
        shareId,
        signal,
        tombstoneMode,
        tombstonesSinceMs
      });
    });
  }
  presignReads(_a19) {
    return __awaiter2(this, arguments, void 0, function* ({ token, storeId, relPaths, shareId, signal }) {
      try {
        const response = yield this.invokeRpc((options2) => this.client.presignAgentStoreReads(new PresignAgentStoreReadsRequest(shareId !== void 0 ? { shareId, relPaths: [...relPaths] } : { storeId, relPaths: [...relPaths] }), options2), agentStoreCallOptions(token.token, signal));
        return response.instructions.map((instruction) => ({
          relPath: instruction.relPath,
          url: instruction.url,
          expiresAtMs: Number(instruction.expiresAtMs)
        }));
      } catch (error42) {
        throw mapConnectError(error42);
      }
    });
  }
  presignWrites(_a19) {
    return __awaiter2(this, arguments, void 0, function* ({ token, storeId, files, signal }) {
      this.invalidateListCache({ storeId });
      const shaByRelPath = new Map(files.map((file2) => [normalizeRelPath(file2.relPath), file2.sha]));
      for (const file2 of files) {
        if (file2.baseEtag !== void 0 && file2.expectAbsent === true) {
          throw new Error(`Agent store write for ${file2.relPath} sets both baseEtag and expectAbsent; they are mutually exclusive`);
        }
        if (file2.baseEtag !== void 0 && normalizeS3Etag(file2.baseEtag).length === 0) {
          throw new Error(`Agent store write for ${file2.relPath} carries an empty baseEtag`);
        }
      }
      try {
        const response = yield this.invokeRpc((options2) => this.client.presignAgentStoreWrites(new PresignAgentStoreWritesRequest({
          storeId,
          // Capability declaration: this engine forwards a
          // presign-instructed Content-Length header on its PUTs
          // (sanitizePresignHeaders + the single-PUT uploader), so the
          // server may bind the declared size into the signature.
          supportsSignedContentLength: true,
          files: files.map((file2) => {
            var _a20;
            return new AgentStoreWriteFileEntry(Object.assign({ relPath: file2.relPath, sizeBytes: BigInt(file2.size), sha: file2.sha, multipartParts: (_a20 = file2.multipartParts) === null || _a20 === void 0 ? void 0 : _a20.map((part) => new AgentStoreMultipartUploadPartDescriptor({
              partNumber: part.partNumber,
              offsetBytes: BigInt(part.offsetBytes),
              sizeBytes: BigInt(part.sizeBytes),
              checksumSha256: new Uint8Array(part.checksumSha256)
            })) }, file2.baseEtag !== void 0 ? {
              precondition: {
                case: "baseEtag",
                value: normalizeS3Etag(file2.baseEtag)
              }
            } : file2.expectAbsent === true ? {
              precondition: {
                case: "expectAbsent",
                value: true
              }
            } : {}));
          })
        }), options2), agentStoreCallOptions(token.token, signal));
        return response.instructions.map((instruction, instructionIndex) => {
          var _a20;
          var _b2;
          const relPath = instruction.relPath;
          let sha = (_a20 = files[instructionIndex]) === null || _a20 === void 0 ? void 0 : _a20.sha;
          try {
            sha = (_b2 = shaByRelPath.get(normalizeRelPath(relPath))) !== null && _b2 !== void 0 ? _b2 : sha;
          } catch (_c2) {
          }
          if (sha === void 0) {
            throw new Error(`BCS presign write response missing requested file: ${relPath}`);
          }
          return Object.assign(Object.assign(Object.assign(Object.assign({
            relPath,
            sha,
            url: instruction.url,
            headers: Object.assign({}, instruction.headers),
            expiresAtMs: Number(instruction.expiresAtMs)
          }, instruction.multipart !== void 0 ? { multipart: mapMultipartWriteInstruction(instruction.multipart) } : {}), instruction.primaryPreconditionFailed ? { primaryPreconditionFailed: true } : {}), instruction.lockRedirect !== void 0 ? {
            lockRedirect: {
              conflictRelPath: instruction.lockRedirect.conflictRelPath,
              lockExpiresAtMs: Number(instruction.lockRedirect.lockExpiresAtMs)
            }
          } : {}), instruction.conflict !== void 0 ? { conflict: mapConflictWriteInstruction(instruction.conflict) } : {});
        });
      } catch (error42) {
        throw mapConnectError(error42);
      }
    });
  }
  completeMultipartWrites(_a19) {
    return __awaiter2(this, arguments, void 0, function* ({ token, storeId, completions, signal }) {
      this.invalidateListCache({ storeId });
      try {
        const response = yield this.invokeRpc((options2) => this.client.completeAgentStoreMultipartWrites(new CompleteAgentStoreMultipartWritesRequest({
          storeId,
          completions: completions.map((completion) => multipartWriteCompletionToProto(completion))
        }), options2), agentStoreCallOptions(token.token, signal));
        return correlateMultipartCompletionResults({
          inputs: completions,
          results: response.results
        });
      } catch (error42) {
        throw mapConnectError(error42);
      } finally {
        this.invalidateListCache({ storeId });
      }
    });
  }
  abortMultipartWrites(_a19) {
    return __awaiter2(this, arguments, void 0, function* ({ token, storeId, uploads, signal }) {
      try {
        const response = yield this.invokeRpc((options2) => this.client.abortAgentStoreMultipartWrites(new AbortAgentStoreMultipartWritesRequest({
          storeId,
          uploads: uploads.map((upload) => multipartWriteAbortToProto(upload))
        }), options2), agentStoreCallOptions(token.token, signal));
        return correlateMultipartAbortResults({
          inputs: uploads,
          results: response.results
        });
      } catch (error42) {
        throw mapConnectError(error42);
      }
    });
  }
  /**
   * Drop every cached directory listing for the store (across tokens/shares) so
   * the next `listFiles` refetches. Called by the engine after a conflict
   * PUT commits — the presign-time invalidation above happens before the
   * write, and the 1s cache may repopulate in between.
   */
  invalidateListCache({ storeId, shareId }) {
    var _a19;
    const targets = /* @__PURE__ */ new Set([`self:${storeId}`]);
    if (shareId !== void 0) {
      targets.add(`share:${shareId}`);
    }
    for (const target of targets) {
      this.listCacheGenerationByTarget.set(target, ((_a19 = this.listCacheGenerationByTarget.get(target)) !== null && _a19 !== void 0 ? _a19 : 0) + 1);
    }
    for (const key of this.directoryListCache.keys()) {
      const target = key.split("\0", 1)[0];
      if (target !== void 0 && targets.has(target)) {
        this.directoryListCache.delete(key);
      }
    }
    for (const key of this.completeFlatListCache.keys()) {
      const target = key.split("\0", 1)[0];
      if (target !== void 0 && targets.has(target)) {
        this.completeFlatListCache.delete(key);
      }
    }
  }
  fetchCachedDirectoryList(args) {
    var _a19;
    if (((_a19 = args.signal) === null || _a19 === void 0 ? void 0 : _a19.aborted) === true) {
      const reason = args.signal.reason;
      return Promise.reject(reason instanceof Error ? reason : new DOMException("The operation was aborted", "AbortError"));
    }
    const now = this.now();
    for (const [key, candidate] of this.completeFlatListCache) {
      if (candidate.expiresAtMs <= now) {
        this.completeFlatListCache.delete(key);
      }
    }
    const flatCacheKey = completeFlatListCacheKey(args);
    const flat = this.completeFlatListCache.get(flatCacheKey);
    if (flat !== void 0) {
      return Promise.resolve(adaptFlatAgentStoreList({
        files: flat.files,
        relPath: args.relPath,
        tombstones: flat.tombstones,
        listingComplete: true,
        removedSubdirs: flat.removedSubdirs,
        tombstoneWatermarkMs: flat.tombstoneWatermarkMs,
        tombstoneFloorMs: flat.tombstoneFloorMs
      }));
    }
    const cacheKey3 = directoryListCacheKey(args);
    let entry = this.directoryListCache.get(cacheKey3);
    if (entry === void 0 || entry.expiresAtMs <= now) {
      for (const [key, candidate] of this.directoryListCache) {
        if (candidate.expiresAtMs <= now) {
          this.directoryListCache.delete(key);
        }
      }
      const promise2 = this.fetchDirectoryList(args).then((listing) => {
        var _a20;
        if (isUncacheableAllUnsafeListing(listing) && ((_a20 = this.directoryListCache.get(cacheKey3)) === null || _a20 === void 0 ? void 0 : _a20.promise) === promise2) {
          this.directoryListCache.delete(cacheKey3);
        }
        return listing;
      }).catch((error42) => {
        var _a20;
        if (((_a20 = this.directoryListCache.get(cacheKey3)) === null || _a20 === void 0 ? void 0 : _a20.promise) === promise2) {
          this.directoryListCache.delete(cacheKey3);
        }
        throw error42;
      });
      entry = {
        promise: promise2,
        expiresAtMs: now + this.directoryListCacheTtlMs
      };
      this.directoryListCache.set(cacheKey3, entry);
    }
    return entry.promise;
  }
  fetchDirectoryList(_a19) {
    return __awaiter2(this, arguments, void 0, function* ({ token, storeId, relPath, shareId, signal, tombstoneMode, tombstonesSinceMs }) {
      var _b2, _c2, _d;
      try {
        const files = /* @__PURE__ */ new Map();
        const subdirs = /* @__PURE__ */ new Set();
        const tombstones = /* @__PURE__ */ new Map();
        const removedSubdirs = /* @__PURE__ */ new Set();
        const seenPageTokens = /* @__PURE__ */ new Set();
        const targetKey = listingTargetKey({ storeId, shareId });
        const cacheGeneration = (_b2 = this.listCacheGenerationByTarget.get(targetKey)) !== null && _b2 !== void 0 ? _b2 : 0;
        const preferCompleteFlatStore = relPath === "" && !this.knownLargeTargets.has(targetKey);
        const tombstoneRequest = listTombstoneModeFields({
          tombstoneMode,
          tombstonesSinceMs
        });
        let pageToken = "";
        let pageCount = 0;
        let tombstoneWatermarkMs;
        let tombstoneFloorMs;
        let sawListingClock = false;
        const foldListingClock = (response) => {
          const nextWatermark = protoPositiveMs(response.tombstoneWatermarkMs);
          const nextFloor = protoPositiveMs(response.tombstoneFloorMs);
          if (!sawListingClock) {
            tombstoneWatermarkMs = nextWatermark;
            tombstoneFloorMs = nextFloor;
            sawListingClock = true;
            return;
          }
          tombstoneWatermarkMs = minDefinedMs(tombstoneWatermarkMs, nextWatermark);
          tombstoneFloorMs = minDefinedMs(tombstoneFloorMs, nextFloor);
        };
        do {
          pageCount += 1;
          if (pageCount > DIRECTORY_LIST_MAX_PAGES) {
            throw new AgentStoreDirectoryListingError(`Agent store directory listing exceeded ${DIRECTORY_LIST_MAX_PAGES} pages`);
          }
          const response = yield this.invokeRpc((options2) => this.client.listAgentStoreDirectory(new ListAgentStoreDirectoryRequest(Object.assign(Object.assign(Object.assign({}, shareId !== void 0 ? { shareId } : { storeId }), { relativePath: relPath, pageSize: DIRECTORY_LIST_PAGE_SIZE, pageToken, preferCompleteFlatStore: preferCompleteFlatStore && pageToken === "" }), tombstoneRequest)), options2), agentStoreCallOptions(token.token, signal));
          foldListingClock(response);
          if (response.mode === AgentStoreDirectoryListingMode.COMPLETE_FLAT_STORE) {
            const flatFiles = response.files.map((file2) => ({
              relPath: file2.relPath,
              etag: normalizeS3Etag(file2.etag),
              size: Number(file2.sizeBytes),
              serverMtimeMs: Number(file2.lastModifiedMs)
            }));
            const flatTombstones = adaptTombstoneEntries(response.tombstones);
            if (flatFiles.length + flatTombstones.length > DIRECTORY_LIST_MAX_ENTRIES) {
              throw new AgentStoreDirectoryListingError(`Agent store directory listing exceeded ${DIRECTORY_LIST_MAX_ENTRIES} entries`);
            }
            const completeListing = adaptFlatAgentStoreList({
              files: flatFiles,
              relPath: "",
              tombstones: flatTombstones,
              listingComplete: true,
              removedSubdirs: response.removedSubdirs,
              tombstoneWatermarkMs,
              tombstoneFloorMs
            });
            if (((_c2 = this.listCacheGenerationByTarget.get(targetKey)) !== null && _c2 !== void 0 ? _c2 : 0) === cacheGeneration && // Skip caching an all-unsafe empty result so a repaired listing
            // can be observed on the next call.
            !isUncacheableAllUnsafeListing(completeListing)) {
              this.completeFlatListCache.set(completeFlatListCacheKey({
                token,
                storeId,
                shareId,
                tombstoneMode,
                tombstonesSinceMs
              }), {
                // Cache the raw flat snapshot. `adaptFlatAgentStoreList`
                // strips leftovers for the root, but an exact-path list of
                // the removed prefix must still see those objects.
                files: flatFiles,
                tombstones: flatTombstones,
                removedSubdirs: (_d = completeListing.removedSubdirs) !== null && _d !== void 0 ? _d : [],
                tombstoneWatermarkMs,
                tombstoneFloorMs,
                expiresAtMs: this.now() + this.directoryListCacheTtlMs
              });
            }
            return completeListing;
          }
          if (preferCompleteFlatStore && pageToken === "") {
            this.knownLargeTargets.add(targetKey);
          }
          for (const file2 of response.files) {
            files.set(file2.relPath, {
              relPath: file2.relPath,
              etag: normalizeS3Etag(file2.etag),
              size: Number(file2.sizeBytes),
              serverMtimeMs: Number(file2.lastModifiedMs)
            });
          }
          for (const subdir of response.subdirs) {
            const trimmed = trimListedDirName(subdir);
            if (trimmed !== "")
              subdirs.add(trimmed);
          }
          for (const tombstone of adaptTombstoneEntries(response.tombstones)) {
            tombstones.set(tombstone.relPath, tombstone);
          }
          for (const removed of response.removedSubdirs) {
            const trimmed = trimListedDirName(removed);
            if (trimmed === "")
              continue;
            removedSubdirs.add(trimmed);
          }
          for (const name17 of [...subdirs]) {
            if (removedSubdirs.has(name17)) {
              subdirs.delete(name17);
            }
          }
          if (files.size + subdirs.size + tombstones.size > DIRECTORY_LIST_MAX_ENTRIES) {
            throw new AgentStoreDirectoryListingError(`Agent store directory listing exceeded ${DIRECTORY_LIST_MAX_ENTRIES} entries`);
          }
          pageToken = response.nextPageToken;
          if (pageToken !== "" && seenPageTokens.has(pageToken)) {
            throw new AgentStoreDirectoryListingError("Agent store directory listing repeated a page token");
          }
          if (pageToken !== "")
            seenPageTokens.add(pageToken);
        } while (pageToken !== "");
        return Object.assign(Object.assign({
          files: [...files.values()].sort((a, b2) => a.relPath.localeCompare(b2.relPath)),
          subdirs: [...subdirs].sort(),
          tombstones: [...tombstones.values()].sort((a, b2) => a.relPath.localeCompare(b2.relPath)),
          removedSubdirs: [...removedSubdirs].sort(),
          // Paginated without hitting caps (those throw); treat as complete.
          listingComplete: true
        }, tombstoneWatermarkMs !== void 0 ? { tombstoneWatermarkMs } : {}), tombstoneFloorMs !== void 0 ? { tombstoneFloorMs } : {});
      } catch (error42) {
        throw mapConnectError(error42);
      }
    });
  }
  deleteFiles(_a19) {
    return __awaiter2(this, arguments, void 0, function* ({ token, storeId, files, signal }) {
      for (const file2 of files) {
        if (normalizeS3Etag(file2.baseEtag).length === 0) {
          throw new Error(`Agent store delete for ${file2.relPath} carries an empty baseEtag`);
        }
      }
      this.invalidateListCache({ storeId });
      try {
        const response = yield this.invokeRpc((options2) => this.client.deleteAgentStoreFiles(new DeleteAgentStoreFilesRequest({
          storeId,
          files: files.map((file2) => new AgentStoreDeleteFileEntry(Object.assign({ relPath: file2.relPath, baseEtag: normalizeS3Etag(file2.baseEtag) }, file2.mutationId !== void 0 ? { mutationId: file2.mutationId } : {})))
        }), options2), agentStoreCallOptions(token.token, signal));
        const outcomes = response.results.map((result) => {
          const relPath = normalizeHarnessRelPath(result.relPath);
          const tombstoneEtag = normalizeS3Etag(result.tombstoneEtag);
          switch (result.status) {
            case AgentStoreDeleteFileStatus.DELETED:
              return {
                relPath,
                status: "deleted",
                tombstoneEtag
              };
            case AgentStoreDeleteFileStatus.ALREADY_DELETED:
              return Object.assign({ relPath, status: "already_deleted" }, tombstoneEtag.length > 0 ? { tombstoneEtag } : {});
            case AgentStoreDeleteFileStatus.CONFLICT: {
              const currentEtag = normalizeS3Etag(result.currentEtag);
              return Object.assign({ relPath, status: "conflict" }, currentEtag.length > 0 ? { currentEtag } : {});
            }
            case AgentStoreDeleteFileStatus.UNSPECIFIED:
              throw new Error(`BCS delete returned UNSPECIFIED status for ${relPath}`);
            default:
              throw new Error(`BCS delete returned an unknown status for ${relPath}: ${result.status}`);
          }
        });
        this.invalidateListCache({ storeId });
        return outcomes;
      } catch (error42) {
        throw mapConnectError(error42);
      }
    });
  }
  rmdir(_a19) {
    return __awaiter2(this, arguments, void 0, function* ({ token, storeId, relPath, signal }) {
      this.invalidateListCache({ storeId });
      try {
        yield this.invokeRpc((options2) => this.client.rmdirAgentStore(new RmdirAgentStoreRequest({
          storeId,
          relPath
        }), options2), agentStoreCallOptions(token.token, signal));
        this.invalidateListCache({ storeId });
      } catch (error42) {
        throw mapConnectError(error42);
      }
    });
  }
  /**
   * Builds CallOptions with Connect `timeoutMs` + an AbortSignal so a hung
   * RPC rejects even when a mock client ignores CallOptions.
   */
  buildCallOptions(base) {
    if (this.rpcTimeoutMs <= 0) {
      return { options: base, timeoutSignal: void 0 };
    }
    const timeoutSignal = AbortSignal.timeout(this.rpcTimeoutMs);
    const signal = (base === null || base === void 0 ? void 0 : base.signal) !== void 0 ? AbortSignal.any([base.signal, timeoutSignal]) : timeoutSignal;
    return {
      options: Object.assign(Object.assign({}, base), { timeoutMs: this.rpcTimeoutMs, signal }),
      timeoutSignal
    };
  }
  invokeRpc(invoke, base) {
    return __awaiter2(this, void 0, void 0, function* () {
      const { options: options2, timeoutSignal } = this.buildCallOptions(base);
      return yield rejectWhenAborted(invoke(options2), {
        signal: options2 === null || options2 === void 0 ? void 0 : options2.signal,
        timeoutSignal
      });
    });
  }
};
function normalizeRpcTimeoutMs(value) {
  if (value === void 0) {
    return DEFAULT_RPC_TIMEOUT_MS;
  }
  if (!Number.isFinite(value) || value < 0) {
    return DEFAULT_RPC_TIMEOUT_MS;
  }
  return Math.floor(value);
}
function rejectWhenAborted(promise2, { signal, timeoutSignal }) {
  if (signal === void 0) {
    return promise2;
  }
  if (signal.aborted) {
    return Promise.reject(rpcAbortError({ signal, timeoutSignal }));
  }
  return new Promise((resolve29, reject2) => {
    const onAbort = () => {
      cleanup();
      reject2(rpcAbortError({ signal, timeoutSignal }));
    };
    const cleanup = () => {
      signal.removeEventListener("abort", onAbort);
    };
    signal.addEventListener("abort", onAbort, { once: true });
    promise2.then((value) => {
      cleanup();
      resolve29(value);
    }, (error42) => {
      cleanup();
      if ((timeoutSignal === null || timeoutSignal === void 0 ? void 0 : timeoutSignal.aborted) && isAbortShapedRpcError(error42)) {
        reject2(rpcDeadlineExceededError(timeoutSignal));
        return;
      }
      reject2(error42);
    });
  });
}
function rpcAbortError({ signal, timeoutSignal }) {
  if (timeoutSignal === null || timeoutSignal === void 0 ? void 0 : timeoutSignal.aborted) {
    return rpcDeadlineExceededError(timeoutSignal);
  }
  const reason = signal.reason;
  if (reason instanceof ConnectError) {
    return reason;
  }
  if (reason instanceof Error && reason.name === "AbortError") {
    return new ConnectError(reason.message, Code.Canceled);
  }
  const message = reason instanceof Error && reason.message.length > 0 ? reason.message : "agent store RPC canceled";
  return new ConnectError(message, Code.Canceled);
}
function rpcDeadlineExceededError(signal) {
  const reason = signal.reason;
  if (reason instanceof ConnectError) {
    return reason;
  }
  const message = reason instanceof Error && reason.message.length > 0 ? reason.message : "agent store RPC deadline exceeded";
  return new ConnectError(message, Code.DeadlineExceeded);
}
function isAbortShapedRpcError(error42) {
  if (error42 instanceof Error && error42.name === "AbortError") {
    return true;
  }
  if (error42 instanceof ConnectError) {
    return error42.code === Code.Canceled || error42.code === Code.DeadlineExceeded;
  }
  return false;
}
function adaptTombstoneEntries(tombstones) {
  return (tombstones !== null && tombstones !== void 0 ? tombstones : []).map((tombstone) => ({
    relPath: normalizeHarnessRelPath(tombstone.relPath),
    tombstoneEtag: normalizeS3Etag(tombstone.tombstoneEtag),
    deletedAtMs: Number(tombstone.deletedAtMs)
  }));
}
function mintAgentStoreTokenRequestForTarget(target) {
  switch (target.kind) {
    case "share":
      return new MintAgentStoreTokenRequest({ shareId: target.shareId });
    case "store":
      return new MintAgentStoreTokenRequest({ storeId: target.storeId });
    case "source":
      return new MintAgentStoreTokenRequest({
        source: new AgentStoreSourceRef({
          kind: agentStoreSourceKindToProto(target.sourceKind),
          sourceId: target.sourceId
        })
      });
  }
}
function agentStoreSourceKindToProto(kind) {
  switch (kind) {
    case "cloud":
      return AgentStoreSourceKind.CLOUD;
    case "local":
      return AgentStoreSourceKind.LOCAL;
    case "user":
      return AgentStoreSourceKind.USER;
    case "team":
      return AgentStoreSourceKind.TEAM;
    case "automation":
      return AgentStoreSourceKind.AUTOMATION;
  }
}
function agentStoreCallOptions(token, signal) {
  return Object.assign({ headers: {
    [AGENT_STORE_TOKEN_HEADER]: token
  } }, signal !== void 0 ? { signal } : {});
}
function mapConflictWriteInstruction(instruction) {
  return Object.assign({ relPath: instruction.relPath, url: instruction.url, headers: Object.assign({}, instruction.headers), expiresAtMs: Number(instruction.expiresAtMs) }, instruction.multipart !== void 0 ? { multipart: mapMultipartWriteInstruction(instruction.multipart) } : {});
}
function mapMultipartWriteInstruction(instruction) {
  if (instruction.context === void 0) {
    throw new AgentStoreProtocolError("BCS multipart write instruction is missing context");
  }
  return {
    context: multipartContextFromProto(instruction.context),
    parts: instruction.parts.map((part) => ({
      partNumber: part.partNumber,
      url: part.url,
      headers: Object.assign({}, part.headers),
      offsetBytes: Number(part.offsetBytes),
      sizeBytes: Number(part.sizeBytes)
    })),
    partUrlsExpiresAtMs: Number(instruction.partUrlsExpiresAtMs)
  };
}
function multipartContextFromProto(context2) {
  return {
    uploadId: context2.uploadId,
    storeId: context2.storeId,
    relPath: context2.relPath,
    sizeBytes: Number(context2.sizeBytes),
    sha: context2.sha,
    expectedPartCount: context2.expectedPartCount,
    precondition: cloneMultipartPrecondition(context2.precondition),
    sessionId: context2.sessionId
  };
}
function cloneMultipartPrecondition(precondition) {
  switch (precondition.case) {
    case "baseEtag":
      return { case: "baseEtag", value: precondition.value };
    case "expectAbsent":
      return { case: "expectAbsent", value: precondition.value };
    case void 0:
      return { case: void 0 };
  }
}
function multipartContextToProto(context2) {
  return new AgentStoreMultipartUploadContext({
    uploadId: context2.uploadId,
    storeId: context2.storeId,
    relPath: context2.relPath,
    sizeBytes: BigInt(context2.sizeBytes),
    sha: context2.sha,
    expectedPartCount: context2.expectedPartCount,
    precondition: cloneMultipartPrecondition(context2.precondition),
    sessionId: context2.sessionId
  });
}
function multipartWriteCompletionToProto(completion) {
  return new AgentStoreMultipartWriteCompletion({
    context: multipartContextToProto(completion.context),
    parts: completion.parts.map((part) => new AgentStoreMultipartUploadedPart({
      partNumber: part.partNumber,
      etag: part.etag,
      checksumSha256: new Uint8Array(part.checksumSha256)
    }))
  });
}
function multipartWriteAbortToProto(upload) {
  return new AgentStoreMultipartWriteAbort({
    context: multipartContextToProto(upload.context)
  });
}
function correlateMultipartCompletionResults({ inputs, results }) {
  const ordered = Array.from({
    length: inputs.length
  });
  for (const result of results) {
    const inputIndex = validateMultipartResultIndex({
      inputCount: inputs.length,
      inputIndex: result.inputIndex,
      kind: "complete"
    });
    if (ordered[inputIndex] !== void 0) {
      throw new AgentStoreProtocolError(`BCS multipart complete response repeated inputIndex ${inputIndex}`);
    }
    const input = inputs[inputIndex];
    const expectedRelPath = normalizeRelPath(input.context.relPath);
    const relPath = normalizeMultipartResponseRelPath({
      relPath: result.relPath,
      inputIndex,
      kind: "complete"
    });
    if (relPath !== expectedRelPath) {
      throw new AgentStoreProtocolError(`BCS multipart complete response relPath mismatch at inputIndex ${inputIndex}`);
    }
    ordered[inputIndex] = mapMultipartCompletionResult({ result, relPath });
  }
  return requireCompleteMultipartResultSet({
    ordered,
    kind: "complete"
  });
}
function correlateMultipartAbortResults({ inputs, results }) {
  const ordered = Array.from({
    length: inputs.length
  });
  for (const result of results) {
    const inputIndex = validateMultipartResultIndex({
      inputCount: inputs.length,
      inputIndex: result.inputIndex,
      kind: "abort"
    });
    if (ordered[inputIndex] !== void 0) {
      throw new AgentStoreProtocolError(`BCS multipart abort response repeated inputIndex ${inputIndex}`);
    }
    const input = inputs[inputIndex];
    const expectedRelPath = normalizeRelPath(input.context.relPath);
    const relPath = normalizeMultipartResponseRelPath({
      relPath: result.relPath,
      inputIndex,
      kind: "abort"
    });
    if (relPath !== expectedRelPath) {
      throw new AgentStoreProtocolError(`BCS multipart abort response relPath mismatch at inputIndex ${inputIndex}`);
    }
    ordered[inputIndex] = mapMultipartAbortResult({ result, relPath });
  }
  return requireCompleteMultipartResultSet({
    ordered,
    kind: "abort"
  });
}
function validateMultipartResultIndex({ inputCount, inputIndex, kind }) {
  if (!Number.isInteger(inputIndex) || inputIndex < 0 || inputIndex >= inputCount) {
    throw new AgentStoreProtocolError(`BCS multipart ${kind} response returned out-of-range inputIndex ${inputIndex}`);
  }
  return inputIndex;
}
function normalizeMultipartResponseRelPath(args) {
  try {
    return normalizeRelPath(args.relPath);
  } catch (_a19) {
    throw new AgentStoreProtocolError(`BCS multipart ${args.kind} response returned an invalid relPath at inputIndex ${args.inputIndex}`);
  }
}
function requireCompleteMultipartResultSet({ ordered, kind }) {
  const output = [];
  for (const [index, result] of ordered.entries()) {
    if (result === void 0) {
      throw new AgentStoreProtocolError(`BCS multipart ${kind} response missing result for inputIndex ${index}`);
    }
    output.push(result);
  }
  return output;
}
function mapMultipartCompletionResult({ result, relPath }) {
  switch (result.outcome.case) {
    case "success":
      return {
        kind: "success",
        relPath,
        etag: normalizeS3Etag(result.outcome.value.etag)
      };
    case "failure":
      return {
        kind: "failure",
        relPath,
        code: mapMultipartFailureCode(result.outcome.value.code)
      };
    case void 0:
      return { kind: "failure", relPath, code: "internal" };
  }
}
function mapMultipartAbortResult({ result, relPath }) {
  switch (result.outcome.case) {
    case "success":
      return {
        kind: "success",
        relPath,
        alreadyFinished: result.outcome.value.alreadyFinished
      };
    case "failure":
      return {
        kind: "failure",
        relPath,
        code: mapMultipartFailureCode(result.outcome.value.code)
      };
    case void 0:
      return { kind: "failure", relPath, code: "internal" };
  }
}
function mapMultipartFailureCode(code) {
  switch (code) {
    case AgentStoreMultipartOperationFailureCode.UNSPECIFIED:
      return "internal";
    case AgentStoreMultipartOperationFailureCode.PRECONDITION_FAILED:
      return "precondition_failed";
    case AgentStoreMultipartOperationFailureCode.UPLOAD_NOT_FOUND:
      return "upload_not_found";
    case AgentStoreMultipartOperationFailureCode.INVALID_PARTS:
      return "invalid_parts";
    case AgentStoreMultipartOperationFailureCode.CHECKSUM_MISMATCH:
      return "checksum_mismatch";
    case AgentStoreMultipartOperationFailureCode.TRANSIENT:
      return "transient";
    case AgentStoreMultipartOperationFailureCode.INTERNAL:
      return "internal";
    case AgentStoreMultipartOperationFailureCode.RESTART_REQUIRED:
      return "restart_required";
    default:
      return "unknown";
  }
}
function directoryListCacheKey({ token, storeId, relPath, shareId, tombstoneMode, tombstonesSinceMs }) {
  const target = listingTargetKey({ storeId, shareId });
  return `${target}\0${token.token}\0${normalizeHarnessRelPath(relPath)}\0${tombstoneCacheTag({ tombstoneMode, tombstonesSinceMs })}`;
}
function completeFlatListCacheKey({ token, storeId, shareId, tombstoneMode, tombstonesSinceMs }) {
  return `${listingTargetKey({ storeId, shareId })}\0${token.token}\0${tombstoneCacheTag({ tombstoneMode, tombstonesSinceMs })}`;
}
function tombstoneCacheTag({ tombstoneMode, tombstonesSinceMs }) {
  switch (tombstoneMode) {
    case AgentStoreTombstoneMode.OMIT:
      return "omit";
    case AgentStoreTombstoneMode.SINCE:
      return usableTombstonesSinceMs(tombstonesSinceMs) === void 0 ? "include" : `since:${tombstonesSinceMs}`;
    default:
      return "include";
  }
}
function listTombstoneModeFields({ tombstoneMode, tombstonesSinceMs }) {
  switch (tombstoneMode) {
    case AgentStoreTombstoneMode.OMIT:
      return { tombstoneMode: AgentStoreTombstoneMode.OMIT };
    case AgentStoreTombstoneMode.SINCE: {
      const boundMs = usableTombstonesSinceMs(tombstonesSinceMs);
      if (boundMs === void 0) {
        return {};
      }
      return {
        tombstoneMode: AgentStoreTombstoneMode.SINCE,
        tombstonesSinceMs: BigInt(boundMs)
      };
    }
    default:
      return {};
  }
}
function usableTombstonesSinceMs(sinceMs) {
  if (sinceMs === void 0 || !Number.isSafeInteger(sinceMs) || sinceMs <= 0) {
    return void 0;
  }
  return sinceMs;
}
function protoPositiveMs(value) {
  if (value === void 0) {
    return void 0;
  }
  if (typeof value === "bigint") {
    if (value <= BigInt(0) || value > BigInt(Number.MAX_SAFE_INTEGER)) {
      return void 0;
    }
    return Number(value);
  }
  if (!Number.isSafeInteger(value) || value <= 0) {
    return void 0;
  }
  return value;
}
function minDefinedMs(left, right) {
  if (left === void 0 || right === void 0) {
    return void 0;
  }
  return Math.min(left, right);
}
function listingTargetKey({ storeId, shareId }) {
  return shareId !== void 0 ? `share:${shareId}` : `self:${storeId}`;
}
function normalizeHarnessRelPath(relPath) {
  return relPath.replaceAll("\\", "/").replace(/^\/+/, "").replace(/\/+$/, "");
}
function trimListedDirName(name17) {
  return name17.replace(/\/+$/, "");
}
function isUncacheableAllUnsafeListing(listing) {
  var _a19;
  return ((_a19 = listing.skippedUnsafeEntries) !== null && _a19 !== void 0 ? _a19 : 0) > 0 && listing.files.length === 0;
}
function mapConnectError(error42) {
  if (!(error42 instanceof ConnectError)) {
    return error42;
  }
  if (error42.code === Code.Unauthenticated || error42.code === Code.PermissionDenied) {
    return new AgentStoreUnauthorizedError(error42.message);
  }
  if (isAgentStoreDirNotEmptyConnectError(error42)) {
    return new AgentStoreDirectoryNotEmptyError(error42.message);
  }
  return error42;
}

