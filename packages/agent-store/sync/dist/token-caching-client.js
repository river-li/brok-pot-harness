/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/token-caching-client.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist2();
var __awaiter8 = function(thisArg, _arguments, P2, generator) {
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
var DEFAULT_REFRESH_BUFFER_MS = 6e4;
var DEFAULT_MINT_NEGATIVE_CACHE_BASE_MS = 3e4;
var DEFAULT_MINT_NEGATIVE_CACHE_MAX_MS = 15 * 6e4;
var SYNC_DISABLED_UNTIL_MS = Number.POSITIVE_INFINITY;
var NOOP_METRICS = {
  tokenMinted() {
  },
  tokenRefreshUnauthorized() {
  }
};
var TokenCachingAgentStoreClient = class {
  constructor(transport, options2 = {}) {
    var _a19, _b2, _c2, _d, _e2;
    this.transport = transport;
    this.tokens = /* @__PURE__ */ new Map();
    this.resolvedStoreIds = /* @__PURE__ */ new Map();
    this.inFlightMints = /* @__PURE__ */ new Map();
    this.mintNegativeCache = /* @__PURE__ */ new Map();
    this.metrics = (_a19 = options2.metrics) !== null && _a19 !== void 0 ? _a19 : NOOP_METRICS;
    this.now = (_b2 = options2.now) !== null && _b2 !== void 0 ? _b2 : Date.now;
    this.refreshBufferMs = (_c2 = options2.refreshBufferMs) !== null && _c2 !== void 0 ? _c2 : DEFAULT_REFRESH_BUFFER_MS;
    this.mintNegativeCacheBaseMs = (_d = options2.mintNegativeCacheBaseMs) !== null && _d !== void 0 ? _d : DEFAULT_MINT_NEGATIVE_CACHE_BASE_MS;
    this.mintNegativeCacheMaxMs = (_e2 = options2.mintNegativeCacheMaxMs) !== null && _e2 !== void 0 ? _e2 : DEFAULT_MINT_NEGATIVE_CACHE_MAX_MS;
    this.onResolvedStoreIdChanged = options2.onResolvedStoreIdChanged;
    this.onSyncDisabledMint = options2.onSyncDisabledMint;
    const completeMultipartWrites = transport.completeMultipartWrites;
    if (completeMultipartWrites !== void 0) {
      this.completeMultipartWrites = (request5) => this.callWithRefresh({
        cacheKey: request5.agentId,
        mintAgentId: request5.agentId,
        mintSourceKind: request5.mintSourceKind,
        opName: "completeMultipartWrites",
        op: (token, storeId) => completeMultipartWrites.call(transport, {
          completions: request5.completions,
          storeId,
          token,
          signal: request5.signal
        })
      });
    }
    const abortMultipartWrites = transport.abortMultipartWrites;
    if (abortMultipartWrites !== void 0) {
      this.abortMultipartWrites = (request5) => this.callWithRefresh({
        cacheKey: request5.agentId,
        mintAgentId: request5.agentId,
        mintSourceKind: request5.mintSourceKind,
        opName: "abortMultipartWrites",
        op: (token, storeId) => abortMultipartWrites.call(transport, {
          uploads: request5.uploads,
          storeId,
          token,
          signal: request5.signal
        })
      });
    }
    const rmdir = transport.rmdir;
    if (rmdir !== void 0) {
      this.rmdir = (request5) => this.callWithRefresh({
        cacheKey: request5.agentId,
        mintAgentId: request5.agentId,
        mintSourceKind: request5.mintSourceKind,
        opName: "rmdir",
        signal: request5.signal,
        op: (token, storeId) => rmdir.call(transport, {
          relPath: request5.relPath,
          storeId,
          token,
          signal: request5.signal
        })
      });
    }
  }
  getResolvedStoreId(request5) {
    return this.resolvedStoreIds.get(tokenCacheKey(request5));
  }
  listFiles(request5) {
    return __awaiter8(this, void 0, void 0, function* () {
      return yield this.callWithRefresh({
        cacheKey: tokenCacheKey(request5),
        mintAgentId: request5.agentId,
        shareId: request5.shareId,
        mintSourceKind: request5.mintSourceKind,
        opName: "listFiles",
        signal: request5.signal,
        op: (token, storeId) => this.transport.listFiles({
          relPath: request5.relPath,
          shareId: request5.shareId,
          storeId,
          token,
          signal: request5.signal,
          tombstoneMode: request5.tombstoneMode,
          tombstonesSinceMs: request5.tombstonesSinceMs
        })
      });
    });
  }
  presignReads(request5) {
    return __awaiter8(this, void 0, void 0, function* () {
      return yield this.callWithRefresh({
        cacheKey: tokenCacheKey(request5),
        mintAgentId: request5.agentId,
        shareId: request5.shareId,
        mintSourceKind: request5.mintSourceKind,
        opName: "presignReads",
        signal: request5.signal,
        op: (token, storeId) => this.transport.presignReads({
          relPaths: request5.relPaths,
          shareId: request5.shareId,
          storeId,
          token,
          signal: request5.signal
        })
      });
    });
  }
  presignWrites(request5) {
    return __awaiter8(this, void 0, void 0, function* () {
      return yield this.callWithRefresh({
        cacheKey: request5.agentId,
        mintAgentId: request5.agentId,
        mintSourceKind: request5.mintSourceKind,
        opName: "presignWrites",
        signal: request5.signal,
        op: (token, storeId) => this.transport.presignWrites({
          files: request5.files,
          storeId,
          token,
          signal: request5.signal
        })
      });
    });
  }
  /** Same token path as writes — deletes reuse the `write` capability. */
  deleteFiles(request5) {
    return __awaiter8(this, void 0, void 0, function* () {
      var _a19;
      const deleteFiles = (_a19 = this.transport.deleteFiles) === null || _a19 === void 0 ? void 0 : _a19.bind(this.transport);
      if (deleteFiles === void 0) {
        throw new Error("TokenCachingAgentStoreClient: transport does not support deleteFiles");
      }
      return yield this.callWithRefresh({
        cacheKey: request5.agentId,
        mintAgentId: request5.agentId,
        mintSourceKind: request5.mintSourceKind,
        opName: "deleteFiles",
        signal: request5.signal,
        op: (token, storeId) => deleteFiles({
          files: request5.files,
          storeId,
          token,
          signal: request5.signal
        })
      });
    });
  }
  /**
   * Best-effort, synchronous cache invalidation (see
   * {@link IAgentStoreClient.invalidateListCache}). Resolving agentId ->
   * storeId requires a token; when none is cached there has been no listing
   * through this client either, so there is nothing to invalidate.
   */
  invalidateListCache(request5) {
    var _a19, _b2;
    const token = this.tokens.get(tokenCacheKey(request5));
    if (token === void 0) {
      return;
    }
    const storeId = token.storeIds[0];
    if (storeId === void 0 || storeId === "") {
      return;
    }
    (_b2 = (_a19 = this.transport).invalidateListCache) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, {
      storeId,
      shareId: request5.shareId
    });
  }
  callWithRefresh(args) {
    return __awaiter8(this, void 0, void 0, function* () {
      const token = yield this.getValidToken({
        cacheKey: args.cacheKey,
        mintAgentId: args.mintAgentId,
        shareId: args.shareId,
        mintSourceKind: args.mintSourceKind,
        signal: args.signal
      });
      const storeId = getTokenStoreId(token);
      this.setResolvedStoreId(args, storeId);
      try {
        return yield args.op(token, storeId);
      } catch (error42) {
        if (!(error42 instanceof Error && isAgentStoreUnauthorized(error42) || typeof error42 === "object" && error42 !== null && isAgentStoreUnauthorized(error42))) {
          throw error42;
        }
        this.metrics.tokenRefreshUnauthorized({
          agentId: args.mintAgentId,
          op: args.opName
        });
        this.tokens.delete(args.cacheKey);
        this.setResolvedStoreId(args, void 0);
        const freshToken = yield this.getValidToken({
          cacheKey: args.cacheKey,
          mintAgentId: args.mintAgentId,
          shareId: args.shareId,
          mintSourceKind: args.mintSourceKind,
          mintReason: "after_unauthorized",
          signal: args.signal
        });
        const freshStoreId = getTokenStoreId(freshToken);
        this.setResolvedStoreId(args, freshStoreId);
        try {
          return yield args.op(freshToken, freshStoreId);
        } catch (freshError) {
          if (freshError instanceof Error && isAgentStoreUnauthorized(freshError) || typeof freshError === "object" && freshError !== null && isAgentStoreUnauthorized(freshError)) {
            this.tokens.delete(args.cacheKey);
            this.setResolvedStoreId(args, void 0);
          }
          throw freshError;
        }
      }
    });
  }
  setResolvedStoreId(args, storeId) {
    var _a19;
    const previous = this.resolvedStoreIds.get(args.cacheKey);
    if (previous === storeId) {
      return;
    }
    if (storeId === void 0) {
      this.resolvedStoreIds.delete(args.cacheKey);
    } else {
      this.resolvedStoreIds.set(args.cacheKey, storeId);
    }
    try {
      (_a19 = this.onResolvedStoreIdChanged) === null || _a19 === void 0 ? void 0 : _a19.call(this, {
        agentId: args.mintAgentId,
        shareId: args.shareId,
        storeId
      });
    } catch (_b2) {
    }
  }
  getValidToken(args) {
    return __awaiter8(this, void 0, void 0, function* () {
      const { cacheKey: cacheKey3, mintAgentId, shareId, mintSourceKind, mintReason, signal } = args;
      this.throwIfMintNegativeCached({ cacheKey: cacheKey3, mintAgentId });
      const existing = this.tokens.get(cacheKey3);
      if (existing !== void 0 && existing.expiresAtMs - this.now() > this.refreshBufferMs) {
        return existing;
      }
      let pending = this.inFlightMints.get(cacheKey3);
      if (pending === void 0) {
        this.throwIfMintNegativeCached({ cacheKey: cacheKey3, mintAgentId });
        const reason = mintReason !== null && mintReason !== void 0 ? mintReason : existing === void 0 ? "cold" : "near_expiry";
        pending = this.transport.mintToken(agentStoreMintTarget({
          agentId: mintAgentId,
          shareId,
          sourceKind: mintSourceKind
        })).then((token) => {
          this.mintNegativeCache.delete(cacheKey3);
          this.tokens.set(cacheKey3, token);
          this.metrics.tokenMinted({
            agentId: mintAgentId,
            reason
          });
          return token;
        }, (error42) => {
          this.recordMintFailure({ cacheKey: cacheKey3, agentId: mintAgentId, error: error42 });
          throw error42;
        }).finally(() => {
          this.inFlightMints.delete(cacheKey3);
        });
        this.inFlightMints.set(cacheKey3, pending);
      }
      return yield awaitWithAbortSignal(pending, signal);
    });
  }
  throwIfMintNegativeCached(args) {
    var _a19, _b2;
    const { cacheKey: cacheKey3, mintAgentId } = args;
    const cached2 = this.mintNegativeCache.get(cacheKey3);
    if (cached2 === void 0) {
      return;
    }
    if (this.now() >= cached2.untilMs) {
      this.mintNegativeCache.delete(cacheKey3);
      return;
    }
    (_b2 = (_a19 = this.metrics).tokenMintNegativeCached) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, {
      agentId: mintAgentId,
      untilMs: cached2.untilMs
    });
    throw cached2.error;
  }
  recordMintFailure(args) {
    var _a19, _b2, _c2, _d;
    var _e2, _f;
    const { cacheKey: cacheKey3, agentId, error: error42 } = args;
    const syncDisabled = isAgentStoreSyncDisabledError(error42);
    if (syncDisabled) {
      const existing2 = this.mintNegativeCache.get(cacheKey3);
      const backoff3 = (_e2 = existing2 === null || existing2 === void 0 ? void 0 : existing2.backoff) !== null && _e2 !== void 0 ? _e2 : new BackoffScheduler({
        baseDelayMs: this.mintNegativeCacheBaseMs,
        maxDelayMs: this.mintNegativeCacheMaxMs,
        jitter: 0.2
      });
      this.mintNegativeCache.set(cacheKey3, {
        error: error42,
        untilMs: SYNC_DISABLED_UNTIL_MS,
        backoff: backoff3
      });
      (_b2 = (_a19 = this.metrics).tokenMintFailureCached) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, {
        agentId,
        kind: "stand_down"
      });
      this.safeNotifySyncDisabledMint({
        agentId,
        message: error42 instanceof Error ? error42.message : String(error42)
      });
      return;
    }
    if (!isAgentStoreMintNegativeCacheable(error42)) {
      return;
    }
    const existing = this.mintNegativeCache.get(cacheKey3);
    const backoff2 = (_f = existing === null || existing === void 0 ? void 0 : existing.backoff) !== null && _f !== void 0 ? _f : new BackoffScheduler({
      baseDelayMs: this.mintNegativeCacheBaseMs,
      maxDelayMs: this.mintNegativeCacheMaxMs,
      jitter: 0.2
    });
    const delayMs = backoff2.recordFailure();
    const untilMs = this.now() + delayMs;
    this.mintNegativeCache.set(cacheKey3, {
      error: error42,
      untilMs,
      backoff: backoff2
    });
    (_d = (_c2 = this.metrics).tokenMintFailureCached) === null || _d === void 0 ? void 0 : _d.call(_c2, {
      agentId,
      kind: "backoff"
    });
  }
  safeNotifySyncDisabledMint(event) {
    const callback = this.onSyncDisabledMint;
    if (callback === void 0) {
      return;
    }
    let result;
    try {
      result = callback(event);
    } catch (_a19) {
      return;
    }
    if (result !== void 0 && result !== null && typeof result.then === "function") {
      result.then(() => void 0, () => void 0);
    }
  }
};
function abortReason2(signal) {
  const reason = signal.reason;
  if (reason instanceof Error) {
    return reason;
  }
  return new DOMException("The operation was aborted", "AbortError");
}
function awaitWithAbortSignal(promise2, signal) {
  return __awaiter8(this, void 0, void 0, function* () {
    if (signal === void 0) {
      return yield promise2;
    }
    if (signal.aborted) {
      throw abortReason2(signal);
    }
    return yield new Promise((resolve29, reject2) => {
      const onAbort = () => {
        cleanup();
        reject2(abortReason2(signal));
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
        reject2(error42);
      });
    });
  });
}
function getTokenStoreId(token) {
  const storeId = token.storeIds[0];
  if (storeId === void 0 || storeId === "") {
    throw new AgentStoreUnauthorizedError("Agent store token did not include a scoped store id");
  }
  return storeId;
}
function tokenCacheKey(request5) {
  var _a19;
  return (_a19 = request5.shareId) !== null && _a19 !== void 0 ? _a19 : request5.agentId;
}
function agentStoreMintTarget(args) {
  if (args.shareId !== void 0) {
    return { kind: "share", shareId: args.shareId };
  }
  if (args.sourceKind !== void 0) {
    return {
      kind: "source",
      sourceKind: args.sourceKind,
      sourceId: args.agentId
    };
  }
  if (AGENT_STORE_ID_PATTERN.test(args.agentId)) {
    return { kind: "store", storeId: args.agentId };
  }
  if (isCloudAgentStoreId(args.agentId)) {
    return { kind: "source", sourceKind: "cloud", sourceId: args.agentId };
  }
  if (isValidBareUuid(args.agentId)) {
    return { kind: "source", sourceKind: "local", sourceId: args.agentId };
  }
  if (parseUserAgentStoreSourceId(args.agentId) !== void 0) {
    return { kind: "source", sourceKind: "user", sourceId: args.agentId };
  }
  if (parseTeamAgentStoreSourceId(args.agentId) !== void 0) {
    return { kind: "source", sourceKind: "team", sourceId: args.agentId };
  }
  throw new AgentStoreUnauthorizedError("Agent store target is not a valid store or source id");
}
function isAgentStoreUnauthorized(error42) {
  if (error42 instanceof AgentStoreUnauthorizedError) {
    return true;
  }
  const status = "status" in error42 ? error42.status : void 0;
  if (status === 401 || status === 403) {
    return true;
  }
  const code = "code" in error42 ? error42.code : void 0;
  return code === 7 || code === 16 || code === "PermissionDenied" || code === "Unauthenticated" || code === "PERMISSION_DENIED" || code === "UNAUTHENTICATED";
}

