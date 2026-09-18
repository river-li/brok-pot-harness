init_dist();
var __awaiter7 = function(thisArg, _arguments, P2, generator) {
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
      this.completeMultipartWrites = (request3) => this.callWithRefresh({
        cacheKey: request3.agentId,
        mintAgentId: request3.agentId,
        mintSourceKind: request3.mintSourceKind,
        opName: "completeMultipartWrites",
        op: (token, storeId) => completeMultipartWrites.call(transport, {
          completions: request3.completions,
          storeId,
          token,
          signal: request3.signal
        })
      });
    }
    const abortMultipartWrites = transport.abortMultipartWrites;
    if (abortMultipartWrites !== void 0) {
      this.abortMultipartWrites = (request3) => this.callWithRefresh({
        cacheKey: request3.agentId,
        mintAgentId: request3.agentId,
        mintSourceKind: request3.mintSourceKind,
        opName: "abortMultipartWrites",
        op: (token, storeId) => abortMultipartWrites.call(transport, {
          uploads: request3.uploads,
          storeId,
          token,
          signal: request3.signal
        })
      });
    }
    const rmdir = transport.rmdir;
    if (rmdir !== void 0) {
      this.rmdir = (request3) => this.callWithRefresh({
        cacheKey: request3.agentId,
        mintAgentId: request3.agentId,
        mintSourceKind: request3.mintSourceKind,
        opName: "rmdir",
        signal: request3.signal,
        op: (token, storeId) => rmdir.call(transport, {
          relPath: request3.relPath,
          storeId,
          token,
          signal: request3.signal
        })
      });
    }
  }
  getResolvedStoreId(request3) {
    return this.resolvedStoreIds.get(tokenCacheKey(request3));
  }
  listFiles(request3) {
    return __awaiter7(this, void 0, void 0, function* () {
      return yield this.callWithRefresh({
        cacheKey: tokenCacheKey(request3),
        mintAgentId: request3.agentId,
        shareId: request3.shareId,
        mintSourceKind: request3.mintSourceKind,
        opName: "listFiles",
        signal: request3.signal,
        op: (token, storeId) => this.transport.listFiles({
          relPath: request3.relPath,
          shareId: request3.shareId,
          storeId,
          token,
          signal: request3.signal,
          tombstoneMode: request3.tombstoneMode,
          tombstonesSinceMs: request3.tombstonesSinceMs
        })
      });
    });
  }
  presignReads(request3) {
    return __awaiter7(this, void 0, void 0, function* () {
      return yield this.callWithRefresh({
        cacheKey: tokenCacheKey(request3),
        mintAgentId: request3.agentId,
        shareId: request3.shareId,
        mintSourceKind: request3.mintSourceKind,
        opName: "presignReads",
        signal: request3.signal,
        op: (token, storeId) => this.transport.presignReads({
          relPaths: request3.relPaths,
          shareId: request3.shareId,
          storeId,
          token,
          signal: request3.signal
        })
      });
    });
  }
  presignWrites(request3) {
    return __awaiter7(this, void 0, void 0, function* () {
      return yield this.callWithRefresh({
        cacheKey: request3.agentId,
        mintAgentId: request3.agentId,
        mintSourceKind: request3.mintSourceKind,
        opName: "presignWrites",
        signal: request3.signal,
        op: (token, storeId) => this.transport.presignWrites({
          files: request3.files,
          storeId,
          token,
          signal: request3.signal
        })
      });
    });
  }
  /** Same token path as writes — deletes reuse the `write` capability. */
  deleteFiles(request3) {
    return __awaiter7(this, void 0, void 0, function* () {
      var _a19;
      const deleteFiles = (_a19 = this.transport.deleteFiles) === null || _a19 === void 0 ? void 0 : _a19.bind(this.transport);
      if (deleteFiles === void 0) {
        throw new Error("TokenCachingAgentStoreClient: transport does not support deleteFiles");
      }
      return yield this.callWithRefresh({
        cacheKey: request3.agentId,
        mintAgentId: request3.agentId,
        mintSourceKind: request3.mintSourceKind,
        opName: "deleteFiles",
        signal: request3.signal,
        op: (token, storeId) => deleteFiles({
          files: request3.files,
          storeId,
          token,
          signal: request3.signal
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
  invalidateListCache(request3) {
    var _a19, _b2;
    const token = this.tokens.get(tokenCacheKey(request3));
    if (token === void 0) {
      return;
    }
    const storeId = token.storeIds[0];
    if (storeId === void 0 || storeId === "") {
      return;
    }
    (_b2 = (_a19 = this.transport).invalidateListCache) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, {
      storeId,
      shareId: request3.shareId
    });
  }
  callWithRefresh(args) {
    return __awaiter7(this, void 0, void 0, function* () {
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
      } catch (error41) {
        if (!(error41 instanceof Error && isAgentStoreUnauthorized(error41) || typeof error41 === "object" && error41 !== null && isAgentStoreUnauthorized(error41))) {
          throw error41;
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
    return __awaiter7(this, void 0, void 0, function* () {
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
        }, (error41) => {
          this.recordMintFailure({ cacheKey: cacheKey3, agentId: mintAgentId, error: error41 });
          throw error41;
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
    const { cacheKey: cacheKey3, agentId, error: error41 } = args;
    const syncDisabled = isAgentStoreSyncDisabledError(error41);
    if (syncDisabled) {
      const existing2 = this.mintNegativeCache.get(cacheKey3);
      const backoff3 = (_e2 = existing2 === null || existing2 === void 0 ? void 0 : existing2.backoff) !== null && _e2 !== void 0 ? _e2 : new BackoffScheduler({
        baseDelayMs: this.mintNegativeCacheBaseMs,
        maxDelayMs: this.mintNegativeCacheMaxMs,
        jitter: 0.2
      });
      this.mintNegativeCache.set(cacheKey3, {
        error: error41,
        untilMs: SYNC_DISABLED_UNTIL_MS,
        backoff: backoff3
      });
      (_b2 = (_a19 = this.metrics).tokenMintFailureCached) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, {
        agentId,
        kind: "stand_down"
      });
      this.safeNotifySyncDisabledMint({
        agentId,
        message: error41 instanceof Error ? error41.message : String(error41)
      });
      return;
    }
    if (!isAgentStoreMintNegativeCacheable(error41)) {
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
      error: error41,
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
  return __awaiter7(this, void 0, void 0, function* () {
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
      }, (error41) => {
        cleanup();
        reject2(error41);
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
function tokenCacheKey(request3) {
  var _a19;
  return (_a19 = request3.shareId) !== null && _a19 !== void 0 ? _a19 : request3.agentId;
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
function isAgentStoreUnauthorized(error41) {
  if (error41 instanceof AgentStoreUnauthorizedError) {
    return true;
  }
  const status = "status" in error41 ? error41.status : void 0;
  if (status === 401 || status === 403) {
    return true;
  }
  const code = "code" in error41 ? error41.code : void 0;
  return code === 7 || code === 16 || code === "PermissionDenied" || code === "Unauthenticated" || code === "PERMISSION_DENIED" || code === "UNAUTHENTICATED";
}
