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
var DEFAULT_TOKEN_REFRESH_JITTER_RATIO = 0.5;
var DEFAULT_MIN_TOKEN_SLACK_MS = 5e3;
var DEFAULT_MINT_NEGATIVE_CACHE_BASE_MS = 3e4;
var DEFAULT_MINT_NEGATIVE_CACHE_MAX_MS = 15 * 6e4;
var DEFAULT_MINT_TRANSIENT_NEGATIVE_CACHE_BASE_MS = 5e3;
var DEFAULT_MINT_TRANSIENT_NEGATIVE_CACHE_MAX_MS = 12e4;
var MINT_NEGATIVE_CACHE_JITTER = 0.2;
var DEFAULT_MINT_RETRY_MAX_ATTEMPTS = 2;
var DEFAULT_MINT_RETRY_BASE_DELAY_MS = 250;
var DEFAULT_MINT_RETRY_MAX_DELAY_MS = 2e3;
var MINT_RETRY_JITTER = 0.2;
var SYNC_DISABLED_UNTIL_MS = Number.POSITIVE_INFINITY;
var NOOP_METRICS = {
  tokenMinted() {
  },
  tokenRefreshUnauthorized() {
  }
};
var TokenCachingAgentStoreClient = class {
  constructor(transport, options2 = {}) {
    var _a19, _b2, _c2, _d, _e2, _f, _g, _h, _j, _k, _l, _m, _o2;
    this.transport = transport;
    this.tokens = /* @__PURE__ */ new Map();
    this.refreshAtMs = /* @__PURE__ */ new Map();
    this.resolvedStoreIds = /* @__PURE__ */ new Map();
    this.inFlightMints = /* @__PURE__ */ new Map();
    this.mintNegativeCache = /* @__PURE__ */ new Map();
    this.metrics = (_a19 = options2.metrics) !== null && _a19 !== void 0 ? _a19 : NOOP_METRICS;
    this.now = (_b2 = options2.now) !== null && _b2 !== void 0 ? _b2 : Date.now;
    this.refreshBufferMs = (_c2 = options2.refreshBufferMs) !== null && _c2 !== void 0 ? _c2 : DEFAULT_REFRESH_BUFFER_MS;
    this.tokenRefreshJitterRatio = clampUnitInterval({
      value: (_d = options2.tokenRefreshJitterRatio) !== null && _d !== void 0 ? _d : DEFAULT_TOKEN_REFRESH_JITTER_RATIO,
      name: "tokenRefreshJitterRatio",
      context: "TokenCachingAgentStoreClient"
    });
    this.minTokenSlackMs = ensureFinitePositive({
      value: (_e2 = options2.minTokenSlackMs) !== null && _e2 !== void 0 ? _e2 : DEFAULT_MIN_TOKEN_SLACK_MS,
      name: "minTokenSlackMs",
      context: "TokenCachingAgentStoreClient"
    });
    this.mintNegativeCacheBaseMs = (_f = options2.mintNegativeCacheBaseMs) !== null && _f !== void 0 ? _f : DEFAULT_MINT_NEGATIVE_CACHE_BASE_MS;
    this.mintNegativeCacheMaxMs = (_g = options2.mintNegativeCacheMaxMs) !== null && _g !== void 0 ? _g : DEFAULT_MINT_NEGATIVE_CACHE_MAX_MS;
    this.resolveTransientNegativeCacheBaseMs = resolvePositiveMsOption({
      value: options2.mintTransientNegativeCacheBaseMs,
      fallback: DEFAULT_MINT_TRANSIENT_NEGATIVE_CACHE_BASE_MS,
      name: "mintTransientNegativeCacheBaseMs"
    });
    this.resolveTransientNegativeCacheMaxMs = resolvePositiveMsOption({
      value: options2.mintTransientNegativeCacheMaxMs,
      fallback: DEFAULT_MINT_TRANSIENT_NEGATIVE_CACHE_MAX_MS,
      name: "mintTransientNegativeCacheMaxMs"
    });
    this.resolveMintRetryPolicyVersion = resolveMintRetryPolicyOption(options2.mintRetryPolicyVersion);
    this.mintRetryMaxAttempts = (_h = options2.mintRetryMaxAttempts) !== null && _h !== void 0 ? _h : DEFAULT_MINT_RETRY_MAX_ATTEMPTS;
    if (!Number.isInteger(this.mintRetryMaxAttempts) || this.mintRetryMaxAttempts < 1) {
      throw new RangeError(`TokenCachingAgentStoreClient mintRetryMaxAttempts must be a positive integer, got ${this.mintRetryMaxAttempts}`);
    }
    this.mintRetryBaseDelayMs = ensureFinitePositive({
      value: (_j = options2.mintRetryBaseDelayMs) !== null && _j !== void 0 ? _j : DEFAULT_MINT_RETRY_BASE_DELAY_MS,
      name: "mintRetryBaseDelayMs",
      context: "TokenCachingAgentStoreClient"
    });
    this.mintRetryMaxDelayMs = ensureFinitePositive({
      value: (_k = options2.mintRetryMaxDelayMs) !== null && _k !== void 0 ? _k : DEFAULT_MINT_RETRY_MAX_DELAY_MS,
      name: "mintRetryMaxDelayMs",
      context: "TokenCachingAgentStoreClient"
    });
    if (this.mintRetryBaseDelayMs > this.mintRetryMaxDelayMs) {
      throw new RangeError(`TokenCachingAgentStoreClient mintRetryBaseDelayMs (${this.mintRetryBaseDelayMs}) must be <= mintRetryMaxDelayMs (${this.mintRetryMaxDelayMs})`);
    }
    this.sleep = (_l = options2.sleep) !== null && _l !== void 0 ? _l : defaultMintSleep;
    this.random = (_m = options2.random) !== null && _m !== void 0 ? _m : Math.random;
    this.mintRetryBudget = (_o2 = options2.mintRetryBudget) !== null && _o2 !== void 0 ? _o2 : new AgentStoreMintRetryBudget({ now: this.now });
    this.mintGate = options2.mintGate;
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
        this.evictCachedToken(args.cacheKey);
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
            this.evictCachedToken(args.cacheKey);
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
      const existing = this.tokens.get(cacheKey3);
      if (existing !== void 0 && mintReason !== "after_unauthorized" && !this.shouldRefreshToken(cacheKey3, existing)) {
        return existing;
      }
      const keptThroughCache = this.tryKeepThroughTransientNegativeCache({
        cacheKey: cacheKey3,
        mintAgentId,
        existing,
        mintReason
      });
      if (keptThroughCache !== void 0) {
        return keptThroughCache;
      }
      this.throwIfMintNegativeCached({
        cacheKey: cacheKey3,
        mintAgentId,
        mintReason
      });
      let pending = this.inFlightMints.get(cacheKey3);
      if (pending === void 0) {
        const gatedKeep = this.throwIfMintGateBlockedUnlessKept({
          cacheKey: cacheKey3,
          mintAgentId,
          existing,
          mintReason
        });
        if (gatedKeep !== void 0) {
          return gatedKeep;
        }
        const reason = mintReason !== null && mintReason !== void 0 ? mintReason : existing === void 0 ? "cold" : "near_expiry";
        pending = this.mintWithRetries({
          cacheKey: cacheKey3,
          mintAgentId,
          shareId,
          mintSourceKind,
          reason
        }).finally(() => {
          this.inFlightMints.delete(cacheKey3);
        });
        this.inFlightMints.set(cacheKey3, pending);
      }
      try {
        return yield awaitWithAbortSignal(pending, signal);
      } catch (error42) {
        if (isAgentStoreAbortError(error42)) {
          throw error42;
        }
        if (isAgentStoreMintTransient(error42)) {
          const kept = this.tryKeepExistingToken({
            cacheKey: cacheKey3,
            mintAgentId,
            existing,
            mintReason,
            emitMetric: true,
            error: error42
          });
          if (kept !== void 0) {
            return kept;
          }
        }
        throw error42;
      }
    });
  }
  setMintTiming(timing) {
    let rescheduleRefresh = false;
    if (timing.refreshBufferMs !== void 0) {
      const refreshBufferMs = ensureFiniteNonNegative({
        value: timing.refreshBufferMs,
        name: "refreshBufferMs",
        context: "TokenCachingAgentStoreClient"
      });
      if (refreshBufferMs !== this.refreshBufferMs) {
        this.refreshBufferMs = refreshBufferMs;
        rescheduleRefresh = true;
      }
    }
    if (timing.tokenRefreshJitterRatio !== void 0) {
      const tokenRefreshJitterRatio = clampUnitInterval({
        value: timing.tokenRefreshJitterRatio,
        name: "tokenRefreshJitterRatio",
        context: "TokenCachingAgentStoreClient"
      });
      if (tokenRefreshJitterRatio !== this.tokenRefreshJitterRatio) {
        this.tokenRefreshJitterRatio = tokenRefreshJitterRatio;
        rescheduleRefresh = true;
      }
    }
    if (rescheduleRefresh) {
      this.rescheduleCachedTokenRefreshes();
    }
    if (timing.minTokenSlackMs !== void 0) {
      this.minTokenSlackMs = ensureFinitePositive({
        value: timing.minTokenSlackMs,
        name: "minTokenSlackMs",
        context: "TokenCachingAgentStoreClient"
      });
    }
    if (timing.mintRetryMaxAttempts !== void 0) {
      if (!Number.isInteger(timing.mintRetryMaxAttempts) || timing.mintRetryMaxAttempts < 1) {
        throw new RangeError(`TokenCachingAgentStoreClient mintRetryMaxAttempts must be a positive integer, got ${timing.mintRetryMaxAttempts}`);
      }
      this.mintRetryMaxAttempts = timing.mintRetryMaxAttempts;
    }
    if (timing.mintRetryBaseDelayMs !== void 0) {
      this.mintRetryBaseDelayMs = ensureFinitePositive({
        value: timing.mintRetryBaseDelayMs,
        name: "mintRetryBaseDelayMs",
        context: "TokenCachingAgentStoreClient"
      });
    }
    if (timing.mintRetryMaxDelayMs !== void 0) {
      this.mintRetryMaxDelayMs = ensureFinitePositive({
        value: timing.mintRetryMaxDelayMs,
        name: "mintRetryMaxDelayMs",
        context: "TokenCachingAgentStoreClient"
      });
    }
    if ((timing.mintRetryBaseDelayMs !== void 0 || timing.mintRetryMaxDelayMs !== void 0) && this.mintRetryBaseDelayMs > this.mintRetryMaxDelayMs) {
      throw new RangeError(`TokenCachingAgentStoreClient mintRetryBaseDelayMs (${this.mintRetryBaseDelayMs}) must be <= mintRetryMaxDelayMs (${this.mintRetryMaxDelayMs})`);
    }
  }
  rescheduleCachedTokenRefreshes() {
    for (const [cacheKey3, token] of this.tokens) {
      this.refreshAtMs.set(cacheKey3, this.computeRefreshAtMs(token));
    }
  }
  /** Rebuild transient negative-cache schedulers from the live getters. */
  retuneTransientMintBackoffs() {
    for (const [cacheKey3, entry] of this.mintNegativeCache) {
      if (entry.kind !== "transient") {
        continue;
      }
      const backoff2 = this.createMintNegativeCacheBackoff("transient");
      backoff2.restoreFailures(entry.backoff.failures);
      this.mintNegativeCache.set(cacheKey3, Object.assign(Object.assign({}, entry), { backoff: backoff2 }));
    }
  }
  shouldRefreshToken(cacheKey3, existing) {
    if (this.resolveMintRetryPolicyVersion() < 1) {
      return existing.expiresAtMs - this.now() <= this.refreshBufferMs;
    }
    let refreshAt = this.refreshAtMs.get(cacheKey3);
    if (refreshAt === void 0) {
      refreshAt = this.computeRefreshAtMs(existing);
      this.refreshAtMs.set(cacheKey3, refreshAt);
    }
    return this.now() >= refreshAt;
  }
  canKeepExistingToken(existing, mintReason, error42) {
    return this.resolveMintRetryPolicyVersion() >= 1 && mintReason !== "after_unauthorized" && (error42 === void 0 || !isAgentStoreSyncDisabledError(error42)) && existing.expiresAtMs > this.now() + this.minTokenSlackMs;
  }
  throwIfMintGateBlockedUnlessKept(args) {
    var _a19, _b2;
    if (this.resolveMintRetryPolicyVersion() < 1 || this.mintGate === void 0) {
      return void 0;
    }
    const peeked = this.mintGate.peek();
    if (peeked.allowed) {
      return void 0;
    }
    const kept = this.tryKeepExistingToken(Object.assign(Object.assign({}, args), { emitMetric: false }));
    if (kept !== void 0) {
      return kept;
    }
    (_b2 = (_a19 = this.metrics).tokenMintRetryDenied) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, {
      agentId: args.mintAgentId,
      reason: "gate"
    });
    throw peeked.error;
  }
  tryKeepExistingToken(args) {
    var _a19, _b2;
    const { cacheKey: cacheKey3, mintAgentId, existing, mintReason, emitMetric, error: error42 } = args;
    if (existing === void 0 || this.tokens.get(cacheKey3) !== existing || !this.canKeepExistingToken(existing, mintReason, error42)) {
      return void 0;
    }
    this.deferRefreshAfterKeep(cacheKey3, existing);
    if (emitMetric) {
      (_b2 = (_a19 = this.metrics).tokenRefreshFailedKeptExisting) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, {
        agentId: mintAgentId,
        remainingMs: existing.expiresAtMs - this.now()
      });
    }
    return existing;
  }
  /**
   * Transient remint storms should keep a still-valid token even while the
   * failure is negative-cached. Stand-down and terminal backoff stay
   * fail-closed via {@link throwIfMintNegativeCached}.
   */
  tryKeepThroughTransientNegativeCache(args) {
    const cached2 = this.mintNegativeCache.get(args.cacheKey);
    if (cached2 === void 0 || cached2.kind !== "transient" || this.now() >= cached2.untilMs) {
      return void 0;
    }
    return this.tryKeepExistingToken(Object.assign(Object.assign({}, args), { emitMetric: true }));
  }
  computeRefreshAtMs(token) {
    const ratio = this.tokenRefreshJitterRatio;
    const factor = 1 - ratio + this.unitRandom() * 2 * ratio;
    return token.expiresAtMs - Math.floor(this.refreshBufferMs * factor);
  }
  /**
   * After a failed refresh we still have slack, so push the next attempt
   * out — otherwise the next op remints immediately.
   */
  deferRefreshAfterKeep(cacheKey3, token) {
    const now = this.now();
    this.refreshAtMs.set(cacheKey3, Math.min(token.expiresAtMs - this.minTokenSlackMs, now + this.minTokenSlackMs));
  }
  evictCachedToken(cacheKey3) {
    this.tokens.delete(cacheKey3);
    this.refreshAtMs.delete(cacheKey3);
  }
  throwIfMintNegativeCached(args) {
    var _a19, _b2;
    const { cacheKey: cacheKey3, mintAgentId } = args;
    const cached2 = this.mintNegativeCache.get(cacheKey3);
    if (cached2 === void 0) {
      return;
    }
    if (this.now() >= cached2.untilMs) {
      return;
    }
    if (this.resolveMintRetryPolicyVersion() < 1 && cached2.kind === "transient") {
      return;
    }
    if (args.mintReason === "after_unauthorized" && cached2.kind === "transient") {
      this.mintNegativeCache.delete(cacheKey3);
      return;
    }
    if (cached2.kind === "transient" && this.resolveMintRetryPolicyVersion() >= 1 && this.mintGate !== void 0) {
      const peeked = this.mintGate.peek();
      if (peeked.allowed && peeked.probe) {
        this.mintNegativeCache.delete(cacheKey3);
        return;
      }
    }
    (_b2 = (_a19 = this.metrics).tokenMintNegativeCached) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, {
      agentId: mintAgentId,
      untilMs: cached2.untilMs
    });
    throw cached2.error;
  }
  mintWithRetries(args) {
    return __awaiter8(this, void 0, void 0, function* () {
      var _a19, _b2, _c2, _d, _e2, _f, _g, _h, _j;
      const policy = this.resolveMintRetryPolicyVersion();
      let maxAttempts = policy >= 1 ? this.mintRetryMaxAttempts : 1;
      const target = agentStoreMintTarget({
        agentId: args.mintAgentId,
        shareId: args.shareId,
        sourceKind: args.mintSourceKind
      });
      let attempt = 0;
      let lastError;
      let lastRetryAfterMs;
      let minted = false;
      const gate = policy >= 1 ? this.mintGate : void 0;
      const admission = gate === null || gate === void 0 ? void 0 : gate.begin();
      if (admission !== void 0 && !admission.allowed) {
        (_b2 = (_a19 = this.metrics).tokenMintRetryDenied) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, {
          agentId: args.mintAgentId,
          reason: "gate"
        });
        throw admission.error;
      } else if ((admission === null || admission === void 0 ? void 0 : admission.probe) === true) {
        maxAttempts = 1;
      }
      try {
        while (attempt < maxAttempts && (admission === void 0 || admission.allowed)) {
          attempt += 1;
          if (policy >= 1) {
            this.mintRetryBudget.recordAttempt();
          }
          try {
            const token = yield this.transport.mintToken(target);
            this.mintNegativeCache.delete(args.cacheKey);
            this.tokens.set(args.cacheKey, token);
            this.refreshAtMs.set(args.cacheKey, this.computeRefreshAtMs(token));
            this.metrics.tokenMinted({
              agentId: args.mintAgentId,
              reason: args.reason
            });
            minted = true;
            if ((admission === null || admission === void 0 ? void 0 : admission.allowed) === true) {
              gate === null || gate === void 0 ? void 0 : gate.end({ ok: true }, admission);
            }
            return token;
          } catch (error42) {
            lastError = error42;
            lastRetryAfterMs = (_c2 = parseAgentStoreBackendThrottled(error42)) === null || _c2 === void 0 ? void 0 : _c2.retryAfterMs;
            const decision = this.classifyMintRetry({
              error: error42,
              attempt,
              maxAttempts,
              policy,
              retryAfterMs: lastRetryAfterMs
            });
            if (decision.kind === "stop") {
              if (decision.denied !== void 0) {
                (_e2 = (_d = this.metrics).tokenMintRetryDenied) === null || _e2 === void 0 ? void 0 : _e2.call(_d, {
                  agentId: args.mintAgentId,
                  reason: decision.denied
                });
              }
              break;
            }
            if (policy >= 1 && !this.mintRetryBudget.tryConsumeRetry()) {
              (_g = (_f = this.metrics).tokenMintRetryDenied) === null || _g === void 0 ? void 0 : _g.call(_f, {
                agentId: args.mintAgentId,
                reason: "budget"
              });
              break;
            }
            (_j = (_h = this.metrics).tokenMintRetried) === null || _j === void 0 ? void 0 : _j.call(_h, {
              agentId: args.mintAgentId,
              attempt,
              delayMs: decision.delayMs
            });
            yield this.sleep(decision.delayMs);
          }
        }
      } finally {
        if ((admission === null || admission === void 0 ? void 0 : admission.allowed) === true && !minted && lastError !== void 0) {
          gate === null || gate === void 0 ? void 0 : gate.end({
            ok: false,
            error: new AgentStoreMintFailedError({
              cause: lastError,
              attempts: attempt,
              retryAfterMs: lastRetryAfterMs
            }),
            transient: isAgentStoreMintTransient(lastError)
          }, admission);
        }
      }
      if (isAgentStoreAbortError(lastError)) {
        throw lastError;
      }
      const outgoing = policy < 1 ? lastError : new AgentStoreMintFailedError({
        cause: lastError,
        attempts: attempt,
        retryAfterMs: lastRetryAfterMs
      });
      this.recordMintFailure({
        cacheKey: args.cacheKey,
        agentId: args.mintAgentId,
        error: outgoing
      });
      throw outgoing;
    });
  }
  classifyMintRetry(args) {
    if (args.policy < 1) {
      return { kind: "stop" };
    }
    if (isAgentStoreAbortError(args.error)) {
      return { kind: "stop" };
    }
    if (!isAgentStoreMintTransient(args.error)) {
      return { kind: "stop" };
    }
    if (args.retryAfterMs !== void 0 && args.retryAfterMs > this.mintRetryMaxDelayMs) {
      return { kind: "stop", denied: "retry_after" };
    }
    if (args.attempt >= args.maxAttempts) {
      return { kind: "stop", denied: "max_attempts" };
    }
    const delayMs = args.retryAfterMs !== void 0 ? args.retryAfterMs : this.jitteredMintRetryDelayMs();
    return { kind: "retry", delayMs };
  }
  unitRandom() {
    const rand = this.random();
    return Number.isFinite(rand) ? Math.max(0, Math.min(rand, 1)) : 0;
  }
  jitteredMintRetryDelayMs() {
    const factor = 1 - MINT_RETRY_JITTER + this.unitRandom() * 2 * MINT_RETRY_JITTER;
    return Math.max(1, Math.min(this.mintRetryMaxDelayMs, Math.floor(this.mintRetryBaseDelayMs * factor)));
  }
  recordMintFailure(args) {
    var _a19, _b2, _c2;
    const { cacheKey: cacheKey3, agentId, error: wrapped } = args;
    const error42 = wrapped instanceof AgentStoreMintFailedError ? wrapped.cause : wrapped;
    const syncDisabled = isAgentStoreSyncDisabledError(error42);
    if (syncDisabled) {
      const existing = this.mintNegativeCache.get(cacheKey3);
      const backoff2 = (existing === null || existing === void 0 ? void 0 : existing.kind) === "stand_down" ? existing.backoff : this.createMintNegativeCacheBackoff("stand_down");
      this.mintNegativeCache.set(cacheKey3, {
        error: wrapped,
        untilMs: SYNC_DISABLED_UNTIL_MS,
        backoff: backoff2,
        kind: "stand_down"
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
    if (isAgentStoreMintNegativeCacheable(error42)) {
      this.writeMintNegativeCache({
        cacheKey: cacheKey3,
        agentId,
        error: wrapped,
        kind: "backoff"
      });
      return;
    }
    if (this.resolveMintRetryPolicyVersion() >= 1 && isAgentStoreMintTransient(error42)) {
      this.writeMintNegativeCache({
        cacheKey: cacheKey3,
        agentId,
        error: wrapped,
        kind: "transient",
        retryAfterMs: wrapped instanceof AgentStoreMintFailedError ? wrapped.retryAfterMs : (_c2 = parseAgentStoreBackendThrottled(error42)) === null || _c2 === void 0 ? void 0 : _c2.retryAfterMs
      });
    }
  }
  writeMintNegativeCache(args) {
    var _a19, _b2;
    const existing = this.mintNegativeCache.get(args.cacheKey);
    const backoff2 = (existing === null || existing === void 0 ? void 0 : existing.kind) === args.kind ? existing.backoff : this.createMintNegativeCacheBackoff(args.kind);
    const delayMs = backoff2.recordFailure();
    const retryAfterMs = args.retryAfterMs;
    const waitMs = retryAfterMs !== void 0 ? Math.max(delayMs, this.jitteredRetryAfterMs(retryAfterMs)) : delayMs;
    this.mintNegativeCache.set(args.cacheKey, {
      error: args.error,
      untilMs: this.now() + waitMs,
      backoff: backoff2,
      kind: args.kind
    });
    (_b2 = (_a19 = this.metrics).tokenMintFailureCached) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, {
      agentId: args.agentId,
      kind: args.kind
    });
  }
  createMintNegativeCacheBackoff(kind) {
    const transient = kind === "transient";
    return new BackoffScheduler({
      baseDelayMs: transient ? this.resolveTransientNegativeCacheBaseMs() : this.mintNegativeCacheBaseMs,
      maxDelayMs: transient ? this.resolveTransientNegativeCacheMaxMs() : this.mintNegativeCacheMaxMs,
      jitter: MINT_NEGATIVE_CACHE_JITTER,
      random: this.random
    });
  }
  jitteredRetryAfterMs(retryAfterMs) {
    const factor = 1 - MINT_NEGATIVE_CACHE_JITTER + this.unitRandom() * 2 * MINT_NEGATIVE_CACHE_JITTER;
    return Math.max(retryAfterMs, Math.floor(retryAfterMs * factor));
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
function resolveMintRetryPolicyOption(value) {
  if (typeof value === "function") {
    return value;
  }
  const resolved = value !== null && value !== void 0 ? value : AGENT_STORE_MINT_RETRY_POLICY_VERSION;
  return () => resolved;
}
function resolvePositiveMsOption(args) {
  var _a19;
  if (typeof args.value === "function") {
    return args.value;
  }
  const resolved = ensureFinitePositive({
    value: (_a19 = args.value) !== null && _a19 !== void 0 ? _a19 : args.fallback,
    name: args.name,
    context: "TokenCachingAgentStoreClient"
  });
  return () => resolved;
}
function clampUnitInterval(args) {
  const { value, name: name17, context: context2 } = args;
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${context2} ${name17} must be a finite number in [0, 1], got ${value}`);
  }
  return value;
}
function defaultMintSleep(ms2) {
  if (ms2 <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve29) => {
    setTimeout(resolve29, ms2);
  });
}
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
  if (error42 instanceof AgentStoreMintFailedError && error42.cause instanceof Error) {
    return isAgentStoreUnauthorized(error42.cause);
  }
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
