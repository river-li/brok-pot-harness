init_esm2();
var __awaiter18 = function(thisArg, _arguments, P2, generator) {
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
function makeSyncBackoff(options2) {
  return new BackoffScheduler({
    baseDelayMs: options2.baseDelayMs,
    maxDelayMs: options2.maxDelayMs,
    jitter: 0.2
  });
}
function safeInvokeCallback(callback, value) {
  if (callback === void 0) {
    return;
  }
  let result;
  try {
    result = callback(value);
  } catch (_a19) {
    return;
  }
  if (result !== void 0 && result !== null && typeof result.then === "function") {
    result.then(noop3, noop3);
  }
}
function noop3() {
}
var UNWIND_HARD_CAP_MULTIPLIER = 3;
var RESUME_CHECK_INTERVAL_MS = 3e4;
function waitForSettlement(promise2, timeoutMs) {
  return __awaiter18(this, void 0, void 0, function* () {
    let timer;
    const deadline = new Promise((resolve29) => {
      var _a19;
      timer = setTimeout(() => resolve29({ kind: "deadline" }), timeoutMs);
      (_a19 = timer.unref) === null || _a19 === void 0 ? void 0 : _a19.call(timer);
    });
    try {
      return yield Promise.race([promise2, deadline]);
    } finally {
      if (timer !== void 0) {
        clearTimeout(timer);
      }
    }
  });
}
function unwrapSettledRound(outcome) {
  if (outcome.kind === "rejected") {
    throw outcome.error;
  }
  return outcome.summary;
}
function rejectSettledRoundAsAborted(signal, outcome) {
  if (outcome.kind === "rejected") {
    throw outcome.error;
  }
  const reason = signal.reason;
  if (reason instanceof Error) {
    throw reason;
  }
  throw new AgentStoreSyncError(Object.assign({ code: "round_aborted", message: "sync round aborted before completion" }, reason !== void 0 ? { cause: reason } : {}));
}
function awaitBounded(promise2, timeoutMs) {
  return __awaiter18(this, void 0, void 0, function* () {
    if (timeoutMs <= 0) {
      yield promise2;
      return "settled";
    }
    let timer;
    const deadline = new Promise((resolve29) => {
      var _a19;
      timer = setTimeout(() => resolve29("timeout"), timeoutMs);
      (_a19 = timer.unref) === null || _a19 === void 0 ? void 0 : _a19.call(timer);
    });
    const settled = promise2.then(() => "settled");
    try {
      return yield Promise.race([settled, deadline]);
    } finally {
      if (timer !== void 0) {
        clearTimeout(timer);
      }
    }
  });
}
function isTimeoutClassifiedRoundError(error42) {
  if (hasCooperativeRoundAbortInChain(error42)) {
    return false;
  }
  if (error42 instanceof AgentStoreSyncError) {
    return error42.code === "round_aborted" || error42.timeoutClass !== void 0;
  }
  return isDeadlineExceededShaped(error42);
}
function isLifecycleRoundAbortMessage(message) {
  return message === "session closing" || message === "host resumed from suspend";
}
function isCooperativeRoundAbortMessage(message) {
  return isLifecycleRoundAbortMessage(message) || message.includes("still draining after watchdog abandon");
}
function hasRoundAbortInChain(error42, matches) {
  let current = error42;
  const seen = /* @__PURE__ */ new Set();
  while (typeof current === "object" && current !== null && !seen.has(current)) {
    seen.add(current);
    if (current instanceof AgentStoreSyncError && current.code === "round_aborted" && matches(current.message)) {
      return true;
    }
    current = "cause" in current ? current.cause : void 0;
  }
  return false;
}
function hasCooperativeRoundAbortInChain(error42) {
  return hasRoundAbortInChain(error42, isCooperativeRoundAbortMessage);
}
function hasLifecycleRoundAbortInChain(error42) {
  return hasRoundAbortInChain(error42, isLifecycleRoundAbortMessage);
}
function isDeadlineExceededShaped(error42) {
  let current = error42;
  const seen = /* @__PURE__ */ new Set();
  while (typeof current === "object" && current !== null && !seen.has(current)) {
    seen.add(current);
    if ("code" in current) {
      const code = current.code;
      if (code === Code.DeadlineExceeded || code === "DeadlineExceeded" || code === "deadline_exceeded") {
        return true;
      }
    }
    current = "cause" in current ? current.cause : void 0;
  }
  return false;
}
function allSummaryErrorsTimeoutClassified(errors) {
  return errors.length > 0 && errors.every((error42) => {
    if (error42.code === "round_aborted") {
      if (isCooperativeRoundAbortMessage(error42.message)) {
        return false;
      }
    }
    return error42.timeoutClass === "round" || error42.timeoutClass === "rpc";
  });
}
var AgentStoreSyncSession = class _AgentStoreSyncSession {
  static open(options2) {
    return __awaiter18(this, void 0, void 0, function* () {
      const session = new _AgentStoreSyncSession(options2);
      try {
        yield session.initialize();
        yield session.awaitOpenSettlement();
      } catch (error42) {
        yield session.awaitTeardown();
        throw error42;
      }
      if (session.isClosing()) {
        yield session.awaitTeardown();
        throw new Error(`AgentStoreSyncSession for ${options2.key} was invalidated during open`);
      }
      return session;
    });
  }
  constructor(options2) {
    var _a19, _b2, _c2, _d, _e2, _f, _g, _h, _j, _k, _l, _m, _o2, _p, _q;
    this.lastResumeWallMs = 0;
    this.lastResumeMonoMs = 0;
    this.pathSyncRequestFailureDelayMs = 0;
    this.pathSyncRequestRetryNotBeforeMs = 0;
    this.followUpNeeded = false;
    this.roundGeneration = 0;
    this.lifecycle = "open";
    this.roundWatchdogTripped = false;
    this.roundUnwound = true;
    this.consecutiveTimeoutFailures = 0;
    this.resumeBackoffResetPending = false;
    this.activeRoundResumeRecoveryPending = false;
    this.resumeRecoveryInProgress = false;
    this.key = options2.key;
    this.projectStore = (_a19 = options2.isProjectStore) !== null && _a19 !== void 0 ? _a19 : false;
    this.filesDir = options2.paths.filesDir;
    this.client = options2.client;
    this.openIndex = options2.openIndex;
    this.lockProvider = options2.lockProvider;
    this.lockOwnerId = options2.lockOwnerId;
    this.queues = options2.queues;
    this.syncMode = (_b2 = options2.syncMode) !== null && _b2 !== void 0 ? _b2 : "readWrite";
    this.validatePresignedUrl = options2.validatePresignedUrl;
    this.blobTransfer = options2.blobTransfer;
    this.fetchImpl = options2.fetch;
    this.paths = options2.paths;
    this.engineIndexPath = (_c2 = options2.indexPath) !== null && _c2 !== void 0 ? _c2 : options2.paths.indexPath;
    this.guardedPaths = (_d = options2.guardedPaths) !== null && _d !== void 0 ? _d : [
      options2.paths.tmpDir,
      options2.paths.indexPath,
      conflictJournalPathForFilesDir(options2.paths.filesDir),
      conflictPendingJournalPathForFilesDir(options2.paths.filesDir)
    ];
    this.validatePathsHook = (_e2 = options2.validatePaths) !== null && _e2 !== void 0 ? _e2 : (() => {
      for (const guardedPath of this.guardedPaths) {
        assertNoSymlinkInPath(guardedPath);
      }
    });
    this.onStateChangedCallback = options2.onStateChanged;
    this.onSyncSummaryCallback = options2.onSyncSummary;
    this.onSyncErrorCallback = options2.onSyncError;
    this.onInvalidatedCallback = options2.onInvalidated;
    this.metricsEmitter = options2.metricsEmitter;
    this.pathHashSalt = options2.pathHashSalt;
    this.onWarnCallback = options2.onWarn;
    this.maxFileSizeBytes = options2.maxFileSizeBytes;
    this.blobIdleTimeoutMs = options2.blobIdleTimeoutMs;
    this.passiveRetryIntervalMs = options2.passiveRetryIntervalMs;
    this.mintGate = options2.mintGate;
    this.passiveIndexPollIntervalMs = options2.passiveIndexPollIntervalMs;
    this.multipartUploadThresholdBytes = options2.multipartUploadThresholdBytes;
    this.multipartPartSizeBytes = options2.multipartPartSizeBytes;
    this.multipartPresignWindowSize = options2.multipartPresignWindowSize;
    this.pullPresignWindowSize = options2.pullPresignWindowSize;
    this.multipartCompleteMaxAttempts = options2.multipartCompleteMaxAttempts;
    this.multipartMaxRestarts = options2.multipartMaxRestarts;
    this.multipartMaxConflictRenames = options2.multipartMaxConflictRenames;
    this.multipartMaxExpiryRefreshes = options2.multipartMaxExpiryRefreshes;
    this.onPassiveIndexUpdatedCallback = options2.onPassiveIndexUpdated;
    this.onResumeDetectedCallback = options2.onResumeDetected;
    this.syncRoundTimeoutMs = (_f = options2.syncRoundTimeoutMs) !== null && _f !== void 0 ? _f : AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.syncRoundTimeoutMs;
    this.syncRoundUnwindTimeoutMs = (_g = options2.syncRoundUnwindTimeoutMs) !== null && _g !== void 0 ? _g : AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.syncRoundUnwindTimeoutMs;
    this.lockReleaseFailureThreshold = (_h = options2.lockReleaseFailureThreshold) !== null && _h !== void 0 ? _h : AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.lockReleaseFailureThreshold;
    this.resumeGapThresholdMs = (_j = options2.resumeGapThresholdMs) !== null && _j !== void 0 ? _j : AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.resumeGapThresholdMs;
    this.syncDebounceMs = (_k = options2.syncDebounceMs) !== null && _k !== void 0 ? _k : AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.syncDebounceMs;
    this.syncBackoffBaseMs = (_l = options2.syncBackoffBaseMs) !== null && _l !== void 0 ? _l : AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.syncBackoffBaseMs;
    this.syncBackoffMaxMs = (_m = options2.syncBackoffMaxMs) !== null && _m !== void 0 ? _m : AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.syncBackoffMaxMs;
    this.pathSyncRequestPollMs = (_o2 = options2.pathSyncRequestPollMs) !== null && _o2 !== void 0 ? _o2 : PATH_SYNC_REQUEST_POLL_MS;
    this.pathSyncRequestWaitPollMs = (_p = options2.pathSyncRequestWaitPollMs) !== null && _p !== void 0 ? _p : PATH_SYNC_REQUEST_WAIT_POLL_MS;
    this.exclusiveMutationClaimPollMs = (_q = options2.exclusiveMutationClaimPollMs) !== null && _q !== void 0 ? _q : AGENT_STORE_SYNC_CLIENT_CONFIG_DEFAULTS.exclusiveMutationClaimPollMs;
    this.tombstoneFullRefreshRounds = options2.tombstoneFullRefreshRounds;
    this.tombstoneFullRefreshIntervalMs = options2.tombstoneFullRefreshIntervalMs;
    this.tombstonePruneSlackMs = options2.tombstonePruneSlackMs;
    this.syncBackoff = makeSyncBackoff({
      baseDelayMs: this.syncBackoffBaseMs,
      maxDelayMs: this.syncBackoffMaxMs
    });
  }
  /**
   * Apply backend-tunable timing without remounting. Used when Statsig
   * refreshes `agent_store_sync_client_config` on a live session (e.g. after
   * a sync round). Engine knobs such as `maxFileSizeBytes` stay open-time.
   *
   * When `syncDebounceMs` changes and a *periodic* timer is already armed,
   * reschedule it so load-shedding period increases take effect immediately.
   * Failure-backoff timers are left alone so a Statsig refresh cannot wipe an
   * in-flight backoff delay. Backoff base/max updates preserve the failure
   * streak.
   */
  get isProjectStore() {
    return this.projectStore;
  }
  /**
   * A store already mounted for one reader can be reached later by a Project
   * reader. Promotion is one-way: nothing demotes a Project store, so the two
   * readers cannot fight over it.
   */
  promoteToProjectStore() {
    if (this.projectStore) {
      return false;
    }
    this.projectStore = true;
    return true;
  }
  setRemoteTiming(timing) {
    var _a19, _b2, _c2, _d, _e2, _f, _g, _h;
    var _j, _k, _l;
    const previousDebounceMs = this.syncDebounceMs;
    const previousResumeGapThresholdMs = this.resumeGapThresholdMs;
    if (timing.syncDebounceMs !== void 0) {
      this.syncDebounceMs = timing.syncDebounceMs;
    }
    if (timing.syncRoundTimeoutMs !== void 0) {
      this.syncRoundTimeoutMs = timing.syncRoundTimeoutMs;
    }
    if (timing.resumeGapThresholdMs !== void 0) {
      this.resumeGapThresholdMs = timing.resumeGapThresholdMs;
    }
    if (timing.passiveIndexPollIntervalMs !== void 0) {
      this.passiveIndexPollIntervalMs = timing.passiveIndexPollIntervalMs;
      if (!this.isClosing()) {
        (_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.setPassiveIndexPollIntervalMs(timing.passiveIndexPollIntervalMs);
      }
    }
    if (timing.passiveRetryIntervalMs !== void 0) {
      this.passiveRetryIntervalMs = timing.passiveRetryIntervalMs;
      if (!this.isClosing()) {
        const gateMs = (_j = (_b2 = this.mintGate) === null || _b2 === void 0 ? void 0 : _b2.remainingMs) !== null && _j !== void 0 ? _j : 0;
        (_c2 = this.engine) === null || _c2 === void 0 ? void 0 : _c2.setPassiveRetryIntervalMs(Math.max(timing.passiveRetryIntervalMs, gateMs));
      }
    }
    if (this.resumeGapThresholdMs !== previousResumeGapThresholdMs && !this.isClosing()) {
      this.stopResumeDetector();
      this.startResumeDetector();
    }
    const nextBase = (_k = timing.syncBackoffBaseMs) !== null && _k !== void 0 ? _k : this.syncBackoffBaseMs;
    const nextMax = (_l = timing.syncBackoffMaxMs) !== null && _l !== void 0 ? _l : this.syncBackoffMaxMs;
    if (nextBase !== this.syncBackoffBaseMs || nextMax !== this.syncBackoffMaxMs) {
      const priorFailures = this.syncBackoff.failures;
      this.syncBackoffBaseMs = nextBase;
      this.syncBackoffMaxMs = nextMax;
      this.syncBackoff = makeSyncBackoff({
        baseDelayMs: nextBase,
        maxDelayMs: nextMax
      });
      this.syncBackoff.restoreFailures(priorFailures);
    }
    if (this.syncDebounceMs !== previousDebounceMs && this.syncTimer !== void 0 && this.pendingScheduleKind === "periodic" && this.syncing === void 0 && !this.isClosing()) {
      this.scheduleSync(this.syncDebounceMs, "periodic");
    }
    if (timing.tombstoneFullRefreshRounds !== void 0) {
      this.tombstoneFullRefreshRounds = timing.tombstoneFullRefreshRounds;
      if (!this.isClosing()) {
        (_d = this.engine) === null || _d === void 0 ? void 0 : _d.setTombstoneFullRefreshRounds(timing.tombstoneFullRefreshRounds);
      }
    }
    if (timing.tombstoneFullRefreshIntervalMs !== void 0) {
      this.tombstoneFullRefreshIntervalMs = timing.tombstoneFullRefreshIntervalMs;
      if (!this.isClosing()) {
        (_e2 = this.engine) === null || _e2 === void 0 ? void 0 : _e2.setTombstoneFullRefreshIntervalMs(timing.tombstoneFullRefreshIntervalMs);
      }
    }
    if (timing.tombstonePruneSlackMs !== void 0) {
      this.tombstonePruneSlackMs = timing.tombstonePruneSlackMs;
      if (!this.isClosing()) {
        (_f = this.engine) === null || _f === void 0 ? void 0 : _f.setTombstonePruneSlackMs(timing.tombstonePruneSlackMs);
      }
    }
    if (timing.pathSyncRequestWaitPollMs !== void 0) {
      this.pathSyncRequestWaitPollMs = timing.pathSyncRequestWaitPollMs;
    }
    if (timing.pathSyncRequestPollMs !== void 0 && timing.pathSyncRequestPollMs !== this.pathSyncRequestPollMs) {
      this.pathSyncRequestPollMs = timing.pathSyncRequestPollMs;
      if (((_g = this.engine) === null || _g === void 0 ? void 0 : _g.getState()) === "running" && !this.isClosing()) {
        this.stopPathSyncRequestPolling();
        this.startPathSyncRequestPolling();
      }
    }
    if (timing.exclusiveMutationClaimPollMs !== void 0 && timing.exclusiveMutationClaimPollMs !== this.exclusiveMutationClaimPollMs) {
      this.exclusiveMutationClaimPollMs = timing.exclusiveMutationClaimPollMs;
      if (((_h = this.engine) === null || _h === void 0 ? void 0 : _h.getState()) === "running" && !this.isClosing()) {
        this.stopExclusiveMutationClaimPolling();
        this.startExclusiveMutationClaimPolling();
      }
    }
  }
  get lastSyncSummary() {
    return this.lastSummary;
  }
  /** True once lock/index/engine teardown has finished. */
  isClosed() {
    return this.lifecycle === "closed";
  }
  /** True once close or invalidation has started (teardown may still be running). */
  isClosing() {
    return this.lifecycle !== "open";
  }
  getEngineState() {
    var _a19;
    return (_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.getState();
  }
  getResolvedStoreId() {
    var _a19, _b2;
    return (_b2 = (_a19 = this.client).getResolvedStoreId) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, { agentId: this.key });
  }
  awaitTeardown() {
    return __awaiter18(this, void 0, void 0, function* () {
      if (this.teardownPromise !== void 0) {
        yield this.teardownPromise;
      }
    });
  }
  /** Waits for the unpause-triggered initial sync round, if any. */
  awaitOpenSettlement() {
    return __awaiter18(this, void 0, void 0, function* () {
      const syncing = this.syncing;
      if (syncing !== void 0) {
        const abandoned = this.activeRoundAbandoned;
        yield abandoned !== void 0 ? Promise.race([syncing, abandoned]) : syncing;
      }
      yield this.awaitTeardown();
    });
  }
  /**
   * Runs a sync round when the engine is `running`. Returns the round summary
   * when a round completes, otherwise `undefined`.
   */
  forceSync() {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a19;
      if (this.isClosing()) {
        return void 0;
      }
      if (((_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.getState()) !== "running") {
        return void 0;
      }
      return yield this.runSync({ kind: "explicit" });
    });
  }
  /** Path-scoped push for one relative path. */
  syncPath(relPath, options2) {
    return __awaiter18(this, void 0, void 0, function* () {
      return yield this.syncPaths([relPath], options2);
    });
  }
  /**
   * Path-scoped push. When `passive`, waits for the lock holder to ack the
   * inbox request (or becomes holder and syncs locally).
   */
  syncPaths(relPaths, options2) {
    return __awaiter18(this, void 0, void 0, function* () {
      if (this.isClosing()) {
        return void 0;
      }
      const engine = this.engine;
      if (engine === void 0) {
        return void 0;
      }
      const state = engine.getState();
      if (state === "running") {
        if (!this.guardedPathsSafe({ invalidateOnFailure: true })) {
          return void 0;
        }
        try {
          const summary = yield engine.syncPaths(relPaths);
          this.emitSyncMetrics(summary);
          return summary;
        } catch (error42) {
          this.emitThrownSyncMetrics(error42);
          return void 0;
        }
      }
      if (state !== "passive") {
        return void 0;
      }
      return yield this.awaitLockHolderPathSync(relPaths, options2);
    });
  }
  /**
   * Pull named paths, listing only their own parent directories.
   *
   * Mirrors {@link syncPaths}' reading of engine state: only `passive` has
   * another process on this machine that will do the rename and index upsert,
   * so only `passive` yields the kind a caller may wait on. `paused`, a
   * closing session and an unconstructed engine are all `unavailable` —
   * nothing is going to write the file, and reporting them as waitable is
   * what made a click poll a dead mount for the whole budget.
   */
  pullPaths(relPaths) {
    return __awaiter18(this, void 0, void 0, function* () {
      if (this.isClosing()) {
        return { kind: "unavailable" };
      }
      const engine = this.engine;
      if (engine === void 0) {
        return { kind: "unavailable" };
      }
      const state = engine.getState();
      if (state === "passive") {
        return { kind: "holder-owns-fetch" };
      }
      if (state !== "running") {
        return { kind: "unavailable" };
      }
      if (!this.guardedPathsSafe({ invalidateOnFailure: true })) {
        return { kind: "failed" };
      }
      try {
        const summary = yield engine.pullPaths(relPaths);
        this.emitSyncMetrics(summary);
        return pullPathsAttemptFromRound(summary, engine.getState());
      } catch (error42) {
        this.emitThrownSyncMetrics(error42);
        return { kind: "failed" };
      }
    });
  }
  /**
   * Ask this mount's sync index whether it already holds a path. Present rows
   * are what the engine last pushed or pulled, so a caller can confirm a path
   * locally without a round; a `miss` proves nothing about the server,
   * because the index never holds server-only paths.
   */
  getIndexEntry(relPath) {
    const index = this.index;
    if (this.isClosing() || index === void 0) {
      return { kind: "unavailable" };
    }
    try {
      const entry = index.getFile(normalizeRelPath(relPath));
      return entry === void 0 ? { kind: "miss" } : { kind: "hit", entry };
    } catch (_a19) {
      return { kind: "unavailable" };
    }
  }
  /**
   * Clears any pending debounce and attempts an immediate sync round. Used
   * when connectivity is restored.
   */
  wake() {
    if (this.isClosing()) {
      return;
    }
    if (this.syncTimer !== void 0) {
      clearTimeout(this.syncTimer);
      this.syncTimer = void 0;
    }
    void this.runSync();
  }
  recontendForLock() {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a19;
      if (this.isClosing() || ((_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.getState()) !== "passive") {
        return;
      }
      yield this.engine.unpause();
    });
  }
  close(options2) {
    return __awaiter18(this, void 0, void 0, function* () {
      yield this.beginTeardown({ kind: "close", options: options2 });
    });
  }
  initialize() {
    return __awaiter18(this, void 0, void 0, function* () {
      this.assertPathsSafe();
      const index = this.openIndex(this.paths.indexPath);
      this.index = index;
      let engine;
      try {
        engine = new AgentStoreSyncEngine({
          agentId: this.key,
          filesDir: this.paths.filesDir,
          tmpDir: this.paths.tmpDir,
          client: this.client,
          index,
          queues: this.queues,
          syncMode: this.syncMode,
          validatePresignedUrl: this.validatePresignedUrl,
          blobTransfer: this.blobTransfer,
          fetch: this.fetchImpl,
          lockProvider: this.lockProvider,
          initialState: "paused",
          indexPath: this.engineIndexPath,
          maxFileSizeBytes: this.maxFileSizeBytes,
          blobIdleTimeoutMs: this.blobIdleTimeoutMs,
          // Bound lock-provider calls the engine makes from inside `serialize`
          // during resume recovery so a wedged verify/acquire cannot hold the
          // mutex and deadlock a concurrent dispose. Kept within teardown's
          // resume-recovery budget (which covers a multiple of this cap).
          resumeLockCallTimeoutMs: this.unwindHardCapMs(),
          shouldRelinquishLockLost: () => !this.isClosing(),
          passiveRetryIntervalMs: this.passiveRetryIntervalMs,
          passiveIndexPollIntervalMs: this.passiveIndexPollIntervalMs,
          multipartUploadThresholdBytes: this.multipartUploadThresholdBytes,
          multipartPartSizeBytes: this.multipartPartSizeBytes,
          multipartPresignWindowSize: this.multipartPresignWindowSize,
          pullPresignWindowSize: this.pullPresignWindowSize,
          multipartCompleteMaxAttempts: this.multipartCompleteMaxAttempts,
          multipartMaxRestarts: this.multipartMaxRestarts,
          multipartMaxConflictRenames: this.multipartMaxConflictRenames,
          multipartMaxExpiryRefreshes: this.multipartMaxExpiryRefreshes,
          onPassiveIndexUpdated: this.onPassiveIndexUpdatedCallback,
          onStateChanged: (event) => this.onEngineStateChanged(event),
          onWarn: (message, error42) => this.onEngineWarn(message, error42),
          tombstoneFullRefreshRounds: this.tombstoneFullRefreshRounds,
          tombstoneFullRefreshIntervalMs: this.tombstoneFullRefreshIntervalMs,
          tombstonePruneSlackMs: this.tombstonePruneSlackMs
        });
        this.engine = engine;
        yield engine.unpause();
        this.startResumeDetector();
      } catch (error42) {
        yield this.disposeConstructedResources(engine, index);
        throw error42;
      }
    });
  }
  /** Wall-clock suspend/resume detector; disabled when threshold is 0. */
  startResumeDetector() {
    var _a19, _b2;
    if (this.resumeGapThresholdMs <= 0 || this.resumeTimer !== void 0) {
      return;
    }
    this.lastResumeWallMs = Date.now();
    this.lastResumeMonoMs = performance.now();
    this.resumeTimer = setInterval(() => {
      var _a20;
      const wallNow = Date.now();
      const monoNow = performance.now();
      const wallDeltaMs = wallNow - this.lastResumeWallMs;
      const monoDeltaMs = monoNow - this.lastResumeMonoMs;
      this.lastResumeWallMs = wallNow;
      this.lastResumeMonoMs = monoNow;
      const gapMs = wallDeltaMs - monoDeltaMs;
      if (gapMs <= this.resumeGapThresholdMs) {
        return;
      }
      if (this.isClosing()) {
        return;
      }
      if (this.resumeHandling !== void 0) {
        this.pendingResumeGapMs = Math.max((_a20 = this.pendingResumeGapMs) !== null && _a20 !== void 0 ? _a20 : 0, gapMs);
        return;
      }
      this.resumeHandling = this.drainResumeRecovery(gapMs).finally(() => {
        this.resumeHandling = void 0;
      });
    }, RESUME_CHECK_INTERVAL_MS);
    (_b2 = (_a19 = this.resumeTimer).unref) === null || _b2 === void 0 ? void 0 : _b2.call(_a19);
  }
  stopResumeDetector() {
    if (this.resumeTimer !== void 0) {
      clearInterval(this.resumeTimer);
      this.resumeTimer = void 0;
    }
  }
  drainResumeRecovery(initialGapMs) {
    return __awaiter18(this, void 0, void 0, function* () {
      let nextGapMs = initialGapMs;
      while (nextGapMs !== void 0 && !this.isClosing()) {
        const gapMs = nextGapMs;
        this.pendingResumeGapMs = void 0;
        yield this.handleResume(gapMs);
        nextGapMs = this.pendingResumeGapMs;
      }
    });
  }
  /** Abort the in-flight round, re-check lock ownership, and wake. */
  handleResume(gapMs) {
    return __awaiter18(this, void 0, void 0, function* () {
      if (this.isClosing()) {
        return;
      }
      this.onEngineWarn(`resume detected after ~${Math.round(gapMs)}ms wall-clock gap`, void 0);
      this.emitResumeDetected(gapMs);
      this.consecutiveTimeoutFailures = 0;
      this.resumeRecoveryInProgress = true;
      try {
        const abandonedUnhealthy = yield this.drainRoundsForResume();
        if (this.isClosing()) {
          return;
        }
        if (abandonedUnhealthy) {
          yield awaitBounded(this.relinquishEngineLock(), this.unwindHardCapMs());
        } else {
          const engine2 = this.engine;
          if (engine2 !== void 0) {
            yield awaitBounded(engine2.revalidateLockOwnership().catch(() => void 0), this.unwindHardCapMs());
          }
        }
        if (this.isClosing()) {
          return;
        }
        const engine = this.engine;
        if ((engine === null || engine === void 0 ? void 0 : engine.getState()) === "passive" && !engine.hasAbandonedInFlightRounds()) {
          yield awaitBounded(engine.unpause().catch(() => void 0), this.unwindHardCapMs());
        }
        this.wake();
      } finally {
        this.resumeRecoveryInProgress = false;
      }
    });
  }
  /**
   * Abort and await every tracked full round (and any wedged scoped push) so
   * resume's re-contend `wake()` is not queued behind a post-suspend socket.
   * Loops because a settling round's `finally` can race a follow-up start
   * before {@link resumeRecoveryInProgress} suppresses it.
   *
   * @returns true when a hard-cap abandon stopped the lock heartbeat.
   */
  drainRoundsForResume() {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a19, _b2, _c2;
      let sawTrackedRound = false;
      let abandonedUnhealthy = false;
      let laps = 0;
      while (!this.isClosing()) {
        if (this.syncing === void 0) {
          break;
        }
        if (laps >= _AgentStoreSyncSession.RESUME_DRAIN_MAX_LAPS) {
          this.unstickAbandonedRoundWaiters({ unjamChain: true });
          this.resumeBackoffResetPending = false;
          this.activeRoundResumeRecoveryPending = false;
          this.syncBackoff.recordSuccess();
          return true;
        }
        laps += 1;
        sawTrackedRound = true;
        this.activeRoundResumeRecoveryPending = true;
        this.abortActiveRound("host resumed from suspend");
        (_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.abortActiveRound(new AgentStoreSyncError({
          code: "round_aborted",
          message: "host resumed from suspend"
        }));
        this.resumeBackoffResetPending = true;
        const unwind = yield awaitBounded(this.syncing, this.unwindHardCapMs());
        if (this.isClosing()) {
          this.resumeBackoffResetPending = false;
          this.unstickAbandonedRoundWaiters({ unjamChain: unwind === "timeout" });
          return unwind === "timeout" || abandonedUnhealthy;
        }
        if (unwind === "timeout") {
          this.unstickAbandonedRoundWaiters({ unjamChain: true });
          this.resumeBackoffResetPending = false;
          this.activeRoundResumeRecoveryPending = false;
          this.syncBackoff.recordSuccess();
          abandonedUnhealthy = true;
        }
      }
      if (this.isClosing()) {
        return abandonedUnhealthy;
      }
      if (!sawTrackedRound) {
        (_b2 = this.engine) === null || _b2 === void 0 ? void 0 : _b2.abortActiveRound(new AgentStoreSyncError({
          code: "round_aborted",
          message: "host resumed from suspend"
        }));
        if (yield this.recoverWedgedScopedRound()) {
          abandonedUnhealthy = true;
        }
        if (this.isClosing()) {
          return abandonedUnhealthy;
        }
        this.syncBackoff.recordSuccess();
        return abandonedUnhealthy;
      }
      (_c2 = this.engine) === null || _c2 === void 0 ? void 0 : _c2.abortActiveRound(new AgentStoreSyncError({
        code: "round_aborted",
        message: "host resumed from suspend"
      }));
      if (yield this.recoverWedgedScopedRound()) {
        abandonedUnhealthy = true;
      }
      return abandonedUnhealthy;
    });
  }
  /**
   * Recover a path-scoped `syncPaths` push wedged on a dead post-suspend
   * socket. The push has already been aborted via `engine.abortActiveRound`;
   * wait the same bounded unwind window a full round gets, then — if it will
   * not unwind — unjam the engine's roundMutation and stop the heartbeat so
   * the resume wake() can re-contend instead of queuing behind the wedge.
   *
   * @returns true when the heartbeat was stopped as a last resort.
   */
  recoverWedgedScopedRound() {
    return __awaiter18(this, void 0, void 0, function* () {
      const engine = this.engine;
      if (engine === void 0) {
        return false;
      }
      if (this.isClosing()) {
        if (!engine.hasLiveRoundWork()) {
          return false;
        }
        engine.releaseWedgedRoundChain();
        this.markLockUnhealthy();
        return true;
      }
      const settled = yield awaitBounded(engine.awaitInFlightRoundsSettled(), this.unwindHardCapMs());
      if (settled === "settled") {
        return false;
      }
      engine.releaseWedgedRoundChain();
      this.markLockUnhealthy();
      return true;
    });
  }
  /** Budget close waits for an in-flight {@link handleResume} to finish. */
  resumeRecoveryTeardownBudgetMs() {
    return this.unwindHardCapMs() * (_AgentStoreSyncSession.RESUME_DRAIN_MAX_LAPS + 1);
  }
  beginTeardown(args) {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a19, _b2;
      if (this.lifecycle === "closed") {
        return;
      }
      if (this.teardownPromise !== void 0) {
        if (args.kind === "invalidate" && args.reason !== void 0) {
          safeInvokeCallback(this.onInvalidatedCallback, args.reason);
        }
        return yield this.teardownPromise;
      }
      this.lifecycle = "closing";
      (_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.markClosing();
      if (args.options.flush) {
        (_b2 = this.engine) === null || _b2 === void 0 ? void 0 : _b2.markCloseFlushPending();
      }
      this.teardownPromise = this.teardownInternal(args.options);
      if (args.kind === "invalidate" && args.reason !== void 0) {
        safeInvokeCallback(this.onInvalidatedCallback, args.reason);
      }
      try {
        yield this.teardownPromise;
      } finally {
        this.lifecycle = "closed";
      }
    });
  }
  teardownInternal(options2) {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a19, _b2;
      this.clearSyncTimer();
      this.stopPathSyncRequestPolling();
      this.stopResumeDetector();
      this.abortActiveRound("session closing");
      (_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.abortActiveRound(new AgentStoreSyncError({
        code: "round_aborted",
        message: "session closing"
      }));
      if (this.pathSyncRequestDrain !== void 0) {
        yield awaitBounded(this.pathSyncRequestDrain.catch(() => void 0), this.unwindHardCapMs());
      }
      const resumeHandling = this.resumeHandling;
      if (resumeHandling !== void 0) {
        yield awaitBounded(resumeHandling.catch(() => void 0), this.resumeRecoveryTeardownBudgetMs());
      }
      let inFlightSettled = true;
      let inFlightWedged = false;
      if (this.syncing !== void 0) {
        const settled = yield awaitBounded(this.syncing, this.unwindHardCapMs());
        inFlightSettled = settled === "settled";
        inFlightWedged = settled === "timeout";
      }
      if (inFlightSettled && ((_b2 = this.engine) === null || _b2 === void 0 ? void 0 : _b2.hasInFlightRounds()) === true) {
        const settled = yield awaitBounded(this.engine.awaitInFlightRoundsSettled(), this.unwindHardCapMs());
        if (settled === "timeout") {
          inFlightSettled = false;
          inFlightWedged = true;
        }
      }
      const engine = this.engine;
      const index = this.index;
      this.engine = void 0;
      this.index = void 0;
      if (engine === void 0) {
        this.closeIndexSafely(index);
        return;
      }
      let boundedForOrphansOnly = false;
      if (inFlightSettled && engine.hasAbandonedInFlightRounds()) {
        inFlightSettled = false;
        boundedForOrphansOnly = true;
      }
      if (inFlightWedged) {
        engine.releaseWedgedRoundChain();
        this.markLockUnhealthy(engine);
      }
      const disposal = this.disposeEngine(engine, options2, inFlightWedged);
      if (inFlightSettled) {
        yield disposal;
        this.closeIndexSafely(index);
        return;
      }
      if (boundedForOrphansOnly) {
        const timeoutMs = this.syncRoundUnwindTimeoutMs;
        let timer;
        const raced = yield new Promise((resolve29) => {
          var _a20;
          let done = false;
          const finish = (value) => {
            if (done) {
              return;
            }
            done = true;
            if (timer !== void 0) {
              clearTimeout(timer);
            }
            resolve29(value);
          };
          if (timeoutMs > 0) {
            timer = setTimeout(() => finish("timeout"), timeoutMs);
            (_a20 = timer.unref) === null || _a20 === void 0 ? void 0 : _a20.call(timer);
          }
          void disposal.then(() => finish("disposed"), () => finish("disposed"));
          void engine.whenAbandonedInFlightRoundsIdle().then(() => finish("orphans_idle"));
        });
        if (raced === "disposed") {
          if (engine.hasAbandonedInFlightRounds()) {
            this.onEngineWarn("teardown proceeding without a settled round; lock recovery deferred", void 0);
            return;
          }
          this.closeIndexSafely(index);
          return;
        }
        if (raced === "orphans_idle") {
          yield disposal;
          this.closeIndexSafely(index);
          return;
        }
        this.onEngineWarn("teardown proceeding without a settled round; lock recovery deferred", void 0);
        this.markLockUnhealthy(engine);
        void disposal.catch(noop3);
        return;
      }
      const outcome = yield awaitBounded(disposal, this.syncRoundUnwindTimeoutMs);
      if (outcome === "settled") {
        if (engine.hasAbandonedInFlightRounds()) {
          this.onEngineWarn("teardown proceeding without a settled round; lock recovery deferred", void 0);
          return;
        }
        this.closeIndexSafely(index);
        return;
      }
      if (outcome === "timeout") {
        this.onEngineWarn("teardown proceeding without a settled round; lock recovery deferred", void 0);
        this.markLockUnhealthy(engine);
        void disposal.catch(noop3);
      }
    });
  }
  /** Close the local index, swallowing failures (dispose already tried). */
  closeIndexSafely(index) {
    if (index === void 0) {
      return;
    }
    try {
      index.close();
    } catch (_a19) {
    }
  }
  /** Best-effort engine teardown; swallows failures onto the error callback. */
  disposeEngine(engine_1, options_1) {
    return __awaiter18(this, arguments, void 0, function* (engine, options2, deferLockRelease = false) {
      if (options2.flush && this.guardedPathsSafe({ invalidateOnFailure: false })) {
        try {
          yield engine.dispose({ deferLockRelease });
        } catch (error42) {
          safeInvokeCallback(this.onSyncErrorCallback, error42);
        }
        return;
      }
      try {
        yield engine.pause();
      } catch (_a19) {
      }
      try {
        yield engine.dispose({ deferLockRelease });
      } catch (error42) {
        safeInvokeCallback(this.onSyncErrorCallback, error42);
      }
    });
  }
  /** Abort the current round's signal if one is in flight. */
  abortActiveRound(reason) {
    var _a19;
    const cooperative = isCooperativeRoundAbortMessage(reason);
    (_a19 = this.activeRoundAbortController) === null || _a19 === void 0 ? void 0 : _a19.abort(new AgentStoreSyncError(Object.assign({ code: "round_aborted", message: reason }, cooperative ? {} : { timeoutClass: "round" })));
  }
  disposeConstructedResources(engine, index) {
    return __awaiter18(this, void 0, void 0, function* () {
      this.stopResumeDetector();
      if (engine !== void 0) {
        try {
          yield engine.pause();
        } catch (_a19) {
        }
        try {
          yield engine.dispose();
        } catch (error42) {
          safeInvokeCallback(this.onSyncErrorCallback, error42);
        }
      }
      try {
        index.close();
      } catch (_b2) {
      }
      this.engine = void 0;
      this.index = void 0;
    });
  }
  onEngineStateChanged(event) {
    safeInvokeCallback(this.onStateChangedCallback, event);
    if (event.toState === "running" && !this.isClosing()) {
      this.startPathSyncRequestPolling();
      this.clearSyncTimer();
      void this.runSync();
      return;
    }
    this.stopPathSyncRequestPolling();
  }
  awaitLockHolderPathSync(relPaths, options2) {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a19;
      const requestId2 = yield enqueuePathSyncRequest({
        filesDir: this.filesDir,
        relPaths
      });
      if (requestId2 === void 0) {
        return void 0;
      }
      const timeoutMs = options2 === null || options2 === void 0 ? void 0 : options2.passiveWaitTimeoutMs;
      const waitStartedAtMs = Date.now();
      const waitResult = yield waitForPathSyncRequestAck({
        filesDir: this.filesDir,
        requestId: requestId2,
        pollMs: this.pathSyncRequestWaitPollMs,
        shouldAbort: () => {
          var _a20;
          if (this.isClosing()) {
            return true;
          }
          return ((_a20 = this.engine) === null || _a20 === void 0 ? void 0 : _a20.getState()) === "running" || timeoutMs !== void 0 && Date.now() - waitStartedAtMs >= timeoutMs;
        }
      });
      if (this.isClosing()) {
        return void 0;
      }
      if (((_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.getState()) === "running") {
        if (!this.guardedPathsSafe({ invalidateOnFailure: true })) {
          return void 0;
        }
        try {
          const summary = yield this.engine.syncPaths(relPaths);
          ackPathSyncRequests({
            filesDir: this.filesDir,
            requestIds: [requestId2]
          });
          this.emitSyncMetrics(summary);
          return summary;
        } catch (error42) {
          this.emitThrownSyncMetrics(error42);
          return void 0;
        }
      }
      if (waitResult !== "acked") {
        return void 0;
      }
      return Object.assign(Object.assign({}, emptySummary("path")), { walkMs: 0, hashMs: 0 });
    });
  }
  startExclusiveMutationClaimPolling() {
    var _a19, _b2;
    if (this.lockOwnerId === void 0 || this.exclusiveMutationClaimTimer !== void 0 || this.isClosing()) {
      return;
    }
    this.exclusiveMutationClaimTimer = setInterval(() => {
      void this.checkExclusiveMutationClaim();
    }, this.exclusiveMutationClaimPollMs);
    (_b2 = (_a19 = this.exclusiveMutationClaimTimer).unref) === null || _b2 === void 0 ? void 0 : _b2.call(_a19);
    void this.checkExclusiveMutationClaim();
  }
  stopExclusiveMutationClaimPolling() {
    if (this.exclusiveMutationClaimTimer !== void 0) {
      clearInterval(this.exclusiveMutationClaimTimer);
      this.exclusiveMutationClaimTimer = void 0;
    }
  }
  checkExclusiveMutationClaim() {
    return __awaiter18(this, void 0, void 0, function* () {
      const active = this.exclusiveMutationClaimCheck;
      if (active !== void 0) {
        yield active;
        return;
      }
      const operation = this.checkExclusiveMutationClaimInternal();
      this.exclusiveMutationClaimCheck = operation;
      try {
        yield operation;
      } catch (error42) {
        this.onEngineWarn("exclusive mutation claim check failed", error42);
      } finally {
        if (this.exclusiveMutationClaimCheck === operation) {
          this.exclusiveMutationClaimCheck = void 0;
        }
      }
    });
  }
  checkExclusiveMutationClaimInternal() {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a19, _b2;
      const lockOwnerId = this.lockOwnerId;
      if (lockOwnerId === void 0 || this.isClosing() || ((_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.getState()) !== "running") {
        return;
      }
      const claimOwner = yield readAgentStoreExclusiveMutationClaimOwner({
        filesDir: this.filesDir
      });
      if (claimOwner === void 0 || claimOwner.windowId === lockOwnerId) {
        return;
      }
      const summary = yield this.forceSync();
      if (summary === void 0 || summary.errors.length > 0 || this.isClosing() || ((_b2 = this.engine) === null || _b2 === void 0 ? void 0 : _b2.getState()) !== "running") {
        return;
      }
      const currentClaimOwner = yield readAgentStoreExclusiveMutationClaimOwner({
        filesDir: this.filesDir
      });
      if (currentClaimOwner === void 0 || currentClaimOwner.windowId === lockOwnerId) {
        return;
      }
      yield this.relinquishEngineLock();
    });
  }
  startPathSyncRequestPolling() {
    var _a19, _b2;
    if (this.pathSyncRequestTimer !== void 0 || this.isClosing()) {
      return;
    }
    this.startExclusiveMutationClaimPolling();
    this.pathSyncRequestFailureDelayMs = 0;
    this.pathSyncRequestRetryNotBeforeMs = 0;
    if (this.pathSyncRequestPollMs > 0) {
      this.pathSyncRequestTimer = setInterval(() => {
        void this.drainPathSyncRequests();
      }, this.pathSyncRequestPollMs);
      (_b2 = (_a19 = this.pathSyncRequestTimer).unref) === null || _b2 === void 0 ? void 0 : _b2.call(_a19);
    }
    void this.drainPathSyncRequests();
  }
  stopPathSyncRequestPolling() {
    this.stopExclusiveMutationClaimPolling();
    if (this.pathSyncRequestTimer !== void 0) {
      clearInterval(this.pathSyncRequestTimer);
      this.pathSyncRequestTimer = void 0;
    }
  }
  notePathSyncRequestDrainFailure() {
    const baseMs = Math.max(this.pathSyncRequestPollMs, 100);
    this.pathSyncRequestFailureDelayMs = this.pathSyncRequestFailureDelayMs === 0 ? baseMs : Math.min(this.pathSyncRequestFailureDelayMs * 2, 3e4);
    this.pathSyncRequestRetryNotBeforeMs = Date.now() + this.pathSyncRequestFailureDelayMs;
  }
  clearPathSyncRequestDrainFailure() {
    this.pathSyncRequestFailureDelayMs = 0;
    this.pathSyncRequestRetryNotBeforeMs = 0;
  }
  drainPathSyncRequests() {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a19;
      if (this.pathSyncRequestDrain !== void 0) {
        yield this.pathSyncRequestDrain;
        return yield this.drainPathSyncRequests();
      }
      if (this.isClosing() || ((_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.getState()) !== "running") {
        return;
      }
      if (Date.now() < this.pathSyncRequestRetryNotBeforeMs) {
        return;
      }
      this.pathSyncRequestDrain = (() => __awaiter18(this, void 0, void 0, function* () {
        var _a20;
        for (; ; ) {
          if (this.isClosing() || ((_a20 = this.engine) === null || _a20 === void 0 ? void 0 : _a20.getState()) !== "running") {
            return;
          }
          const requests2 = listPathSyncRequests({ filesDir: this.filesDir });
          if (requests2.length === 0) {
            this.clearPathSyncRequestDrainFailure();
            return;
          }
          const relPaths = /* @__PURE__ */ new Set();
          for (const request5 of requests2) {
            for (const relPath of request5.relPaths) {
              relPaths.add(relPath);
            }
          }
          if (!this.guardedPathsSafe({ invalidateOnFailure: true })) {
            return;
          }
          const engine = this.engine;
          if (engine === void 0 || engine.getState() !== "running") {
            return;
          }
          try {
            const summary = yield engine.syncPaths([...relPaths]);
            this.emitSyncMetrics(summary);
            const failedRelPaths = /* @__PURE__ */ new Set();
            let hasUnscopedError = false;
            for (const error42 of summary.errors) {
              if (error42.relPath === void 0) {
                hasUnscopedError = true;
              } else {
                failedRelPaths.add(error42.relPath);
              }
            }
            const ackedIds = hasUnscopedError ? [] : requests2.filter((request5) => request5.relPaths.every((relPath) => !failedRelPaths.has(relPath))).map((request5) => request5.id);
            if (ackedIds.length === 0) {
              this.notePathSyncRequestDrainFailure();
              return;
            }
            this.clearPathSyncRequestDrainFailure();
            ackPathSyncRequests({
              filesDir: this.filesDir,
              requestIds: ackedIds
            });
          } catch (error42) {
            this.emitThrownSyncMetrics(error42);
            this.notePathSyncRequestDrainFailure();
            return;
          }
        }
      }))().finally(() => {
        this.pathSyncRequestDrain = void 0;
      });
      yield this.pathSyncRequestDrain;
    });
  }
  onEngineWarn(message, error42) {
    const callback = this.onWarnCallback;
    if (callback === void 0) {
      return;
    }
    try {
      callback(message, error42);
    } catch (_a19) {
    }
  }
  scheduleSync(delayMs = this.syncDebounceMs, kind = "periodic") {
    var _a19, _b2;
    if (this.isClosing()) {
      return;
    }
    if (this.syncTimer !== void 0) {
      clearTimeout(this.syncTimer);
    }
    this.pendingScheduleKind = kind;
    this.syncTimer = setTimeout(() => {
      this.syncTimer = void 0;
      this.pendingScheduleKind = void 0;
      void this.runSync();
    }, delayMs);
    (_b2 = (_a19 = this.syncTimer).unref) === null || _b2 === void 0 ? void 0 : _b2.call(_a19);
  }
  clearSyncTimer() {
    if (this.syncTimer !== void 0) {
      clearTimeout(this.syncTimer);
      this.syncTimer = void 0;
    }
    this.pendingScheduleKind = void 0;
  }
  getOrCreateExplicitFollowUpDeferred() {
    if (this.explicitFollowUpDeferred === void 0) {
      let resolve29;
      const promise2 = new Promise((deferredResolve) => {
        resolve29 = deferredResolve;
      });
      this.explicitFollowUpDeferred = { promise: promise2, resolve: resolve29 };
    }
    return this.explicitFollowUpDeferred.promise;
  }
  takeExplicitFollowUpDeferred() {
    const deferred = this.explicitFollowUpDeferred;
    this.explicitFollowUpDeferred = void 0;
    return deferred;
  }
  resolveExplicitFollowUp(deferred, summary) {
    deferred === null || deferred === void 0 ? void 0 : deferred.resolve(summary);
  }
  /** Resolves queued explicit waiters when teardown prevents a follow-up round. */
  cancelQueuedExplicitFollowUp() {
    const deferred = this.takeExplicitFollowUpDeferred();
    this.resolveExplicitFollowUp(deferred, void 0);
  }
  /**
   * Detach a resume-abandoned round and unstick everyone waiting on it so
   * nothing hangs on a round that will never settle: the session `syncing`
   * slot is cleared (so wake()/teardown can start or bound a fresh round), the
   * owning `forceSync`/`open()` await is settled via {@link
   * abandonActiveRoundOwner}, and any queued explicit follow-up is resolved.
   * The detached round's own finally/catch stay inert because they only act
   * while {@link isRoundOwner} holds. `unjamChain` additionally unjams the
   * engine's round chain and stops the heartbeat so the stale-steal can recover
   * the lock — pass it when the round never unwound within the budget.
   *
   * Called from both the resume-abandon timeout path and the `isClosing()`
   * early-return, so close always unsticks these waiters even when a resume
   * recovery was mid-flight.
   */
  unstickAbandonedRoundWaiters(options2) {
    var _a19, _b2;
    if (options2.unjamChain) {
      (_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.releaseWedgedRoundChain();
      this.markLockUnhealthy();
    }
    this.syncing = void 0;
    this.followUpNeeded = false;
    this.cancelQueuedExplicitFollowUp();
    (_b2 = this.abandonActiveRoundOwner) === null || _b2 === void 0 ? void 0 : _b2.call(this);
    this.abandonActiveRoundOwner = void 0;
    this.activeRoundAbandoned = void 0;
  }
  runSync() {
    return __awaiter18(this, arguments, void 0, function* (options2 = { kind: "periodic" }) {
      if (this.isClosing()) {
        return void 0;
      }
      const engine = this.engine;
      if (engine === void 0 || engine.getState() !== "running") {
        return void 0;
      }
      if (this.syncing !== void 0) {
        this.followUpNeeded = true;
        if (options2.kind === "explicit") {
          return yield this.getOrCreateExplicitFollowUpDeferred();
        }
        return void 0;
      }
      return yield this.executeSyncRound(options2.kind === "explicit");
    });
  }
  runFollowUpRound(explicitWaiters) {
    return __awaiter18(this, void 0, void 0, function* () {
      const summary = yield this.executeSyncRound(true);
      this.resolveExplicitFollowUp(explicitWaiters, summary);
      if (!this.isClosing() && this.syncing === void 0 && this.syncTimer === void 0) {
        this.scheduleSync();
      }
    });
  }
  /**
   * Run one engine round under a whole-round watchdog (`0` disables).
   * Fulfilled unwind returns the summary; rejected/wedged rounds throw.
   */
  /**
   * True while the round captured by `roundGeneration`/`roundPromise` is still
   * the session's current, owning round. A resume-abandon supersedes a wedged
   * round by clearing `syncing` and starting a replacement round (bumping the
   * generation); once superseded, the abandoned round must never relinquish the
   * lock, apply failure policy, or unjam the chain again — those side effects
   * belong exclusively to the replacement round.
   */
  isRoundOwner(roundPromise, roundGeneration) {
    return this.syncing === roundPromise && this.roundGeneration === roundGeneration;
  }
  /**
   * Reject a late `forceSyncWithWatchdog` path whose round a resume-abandon has
   * superseded. A superseded round was replaced by resume's re-contend round,
   * so its outcome is resume-owned: always surface it as the lifecycle abort
   * (already signalled via `resume_detected`), never the first abort reason.
   * When the watchdog aborted first, `signal.reason` is the stall error rather
   * than a resume abort; rethrowing it would make the caller's catch treat a
   * resume-owned round as a sync failure (metrics + onSyncError). Keep that
   * original reason as `cause` for diagnostics.
   */
  throwSupersededRound(signal) {
    const reason = signal.reason;
    throw new AgentStoreSyncError(Object.assign({ code: "round_aborted", message: "host resumed from suspend" }, reason !== void 0 ? { cause: reason } : {}));
  }
  forceSyncWithWatchdog(engine, abortController, roundGeneration) {
    return __awaiter18(this, void 0, void 0, function* () {
      const startedAt = monotonicNowMs();
      this.emitRoundLifecycle({ kind: "started" });
      const observed = engine.forceSync({ signal: abortController.signal }).then((summary) => ({ kind: "fulfilled", summary }), (error42) => ({ kind: "rejected", error: error42 }));
      if (this.syncRoundTimeoutMs === 0) {
        const settled = yield observed;
        if (abortController.signal.aborted || this.roundGeneration !== roundGeneration) {
          this.emitRoundLifecycle({
            kind: "aborted",
            durationMs: monotonicNowMs() - startedAt
          });
          rejectSettledRoundAsAborted(abortController.signal, settled);
        }
        return unwrapSettledRound(settled);
      }
      const initial = yield waitForSettlement(observed, this.syncRoundTimeoutMs);
      if (initial.kind !== "deadline") {
        if (abortController.signal.aborted || this.roundGeneration !== roundGeneration) {
          this.emitRoundLifecycle({
            kind: "aborted",
            durationMs: monotonicNowMs() - startedAt
          });
          rejectSettledRoundAsAborted(abortController.signal, initial);
        }
        return unwrapSettledRound(initial);
      }
      const elapsedMs3 = monotonicNowMs() - startedAt;
      if (this.roundGeneration !== roundGeneration) {
        this.throwSupersededRound(abortController.signal);
      }
      this.roundWatchdogTripped = true;
      this.emitRoundLifecycle({ kind: "timeout", durationMs: elapsedMs3 });
      const timeoutError = new AgentStoreSyncError({
        code: "round_aborted",
        timeoutClass: "round",
        message: `sync round stalled after ${this.syncRoundTimeoutMs}ms`
      });
      this.onEngineWarn(`round stalled after ${this.syncRoundTimeoutMs}ms`, {
        elapsedMs: elapsedMs3
      });
      abortController.abort(timeoutError);
      this.emitRoundLifecycle({ kind: "aborted", durationMs: elapsedMs3 });
      const unwind = yield waitForSettlement(observed, this.syncRoundUnwindTimeoutMs);
      if (unwind.kind === "fulfilled") {
        if (this.roundGeneration !== roundGeneration) {
          this.throwSupersededRound(abortController.signal);
        }
        this.roundUnwound = true;
        return unwind.summary;
      }
      if (unwind.kind === "rejected") {
        if (this.roundGeneration !== roundGeneration) {
          this.throwSupersededRound(abortController.signal);
        }
        this.roundUnwound = true;
        throw unwind.error;
      }
      const unwindHardCapMs = this.unwindHardCapMs();
      const remainingHardCapMs = unwindHardCapMs - this.syncRoundUnwindTimeoutMs;
      const finalUnwind = remainingHardCapMs > 0 ? yield waitForSettlement(observed, remainingHardCapMs) : { kind: "deadline" };
      if (finalUnwind.kind === "fulfilled") {
        if (this.roundGeneration !== roundGeneration) {
          this.throwSupersededRound(abortController.signal);
        }
        this.roundUnwound = true;
        return finalUnwind.summary;
      }
      if (finalUnwind.kind === "rejected") {
        if (this.roundGeneration !== roundGeneration) {
          this.throwSupersededRound(abortController.signal);
        }
        this.roundUnwound = true;
        throw finalUnwind.error;
      }
      if (this.roundGeneration !== roundGeneration) {
        this.throwSupersededRound(abortController.signal);
      }
      this.roundUnwound = false;
      engine.releaseWedgedRoundChain();
      this.markLockUnhealthy(engine);
      throw new AgentStoreSyncError({
        code: "round_aborted",
        cause: timeoutError,
        timeoutClass: "round",
        message: `sync round did not unwind within ${unwindHardCapMs}ms`
      });
    });
  }
  /**
   * Total budget a watchdog-aborted round is allowed to cooperatively unwind
   * before the heartbeat is stopped as a last resort. The round watchdog,
   * resume abandon, and `close()` all share this so none of them abandons a
   * still-unwinding round earlier than the watchdog's own hard cap.
   */
  unwindHardCapMs() {
    return this.syncRoundUnwindTimeoutMs * UNWIND_HARD_CAP_MULTIPLIER;
  }
  /** Stop the lock heartbeat as a last resort and record it for metrics. */
  markLockUnhealthy(engineOverride) {
    var _a19;
    (_a19 = engineOverride !== null && engineOverride !== void 0 ? engineOverride : this.engine) === null || _a19 === void 0 ? void 0 : _a19.markLockUnhealthy();
    this.emitLockEvent("lock_released_unhealthy");
  }
  /**
   * Relinquish the write lock after a wedged round unwound so a healthy peer
   * can take over. Best-effort; the engine drops to `passive` (`lock_lost`).
   */
  relinquishEngineLock() {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a19;
      try {
        yield (_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.relinquishLock("lock_lost");
      } catch (_b2) {
      }
    });
  }
  /** Relinquish after a watchdog unwind or consecutive timeout failures. */
  applyRoundFailurePolicy(args) {
    return __awaiter18(this, void 0, void 0, function* () {
      if (this.isClosing()) {
        return;
      }
      if (this.activeRoundResumeRecoveryPending) {
        this.activeRoundResumeRecoveryPending = false;
        this.consecutiveTimeoutFailures = 0;
        return;
      }
      if (this.roundWatchdogTripped) {
        this.consecutiveTimeoutFailures = 0;
        if (this.roundUnwound) {
          yield this.relinquishEngineLock();
        }
        return;
      }
      if (!args.roundFailed) {
        this.consecutiveTimeoutFailures = 0;
        return;
      }
      if (args.failureTimeoutClassified) {
        this.consecutiveTimeoutFailures += 1;
        if (this.consecutiveTimeoutFailures >= this.lockReleaseFailureThreshold) {
          this.consecutiveTimeoutFailures = 0;
          yield this.relinquishEngineLock();
        }
        return;
      }
      this.consecutiveTimeoutFailures = 0;
    });
  }
  executeSyncRound(returnSummary) {
    return __awaiter18(this, void 0, void 0, function* () {
      if (this.isClosing()) {
        return void 0;
      }
      const engine = this.engine;
      if (engine === void 0 || engine.getState() !== "running") {
        return void 0;
      }
      if (!this.guardedPathsSafe({ invalidateOnFailure: true })) {
        return void 0;
      }
      let roundSummary;
      let stoodAsideWait;
      const abortController = new AbortController();
      this.activeRoundAbortController = abortController;
      this.roundWatchdogTripped = false;
      this.roundUnwound = true;
      this.activeRoundResumeRecoveryPending = false;
      const roundGeneration = ++this.roundGeneration;
      let roundPromise;
      roundPromise = (() => __awaiter18(this, void 0, void 0, function* () {
        let failed2 = false;
        let stoodAside = false;
        try {
          const summary = yield this.forceSyncWithWatchdog(engine, abortController, roundGeneration);
          roundSummary = summary;
          this.lastSummary = summary;
          this.emitSyncMetrics(summary);
          safeInvokeCallback(this.onSyncSummaryCallback, summary);
          if (summary.errors.length > 0) {
            failed2 = true;
            for (const err of summary.errors) {
              safeInvokeCallback(this.onSyncErrorCallback, err);
            }
          }
          if (this.isRoundOwner(roundPromise, roundGeneration)) {
            yield this.applyRoundFailurePolicy({
              roundFailed: summary.errors.length > 0,
              failureTimeoutClassified: allSummaryErrorsTimeoutClassified(summary.errors)
            });
          }
        } catch (error42) {
          if (isSyncRoundStoodAsideError(error42)) {
            stoodAside = true;
            roundSummary = void 0;
          } else {
            failed2 = !hasCooperativeRoundAbortInChain(error42);
            roundSummary = void 0;
            const resumeOwnedRound = this.activeRoundResumeRecoveryPending;
            if (!resumeOwnedRound && !hasLifecycleRoundAbortInChain(error42)) {
              this.emitThrownSyncMetrics(error42);
              safeInvokeCallback(this.onSyncErrorCallback, error42);
            }
            if (this.isRoundOwner(roundPromise, roundGeneration)) {
              yield this.applyRoundFailurePolicy({
                roundFailed: true,
                failureTimeoutClassified: isTimeoutClassifiedRoundError(error42)
              });
            }
          }
        } finally {
          if (this.activeRoundAbortController === abortController) {
            this.activeRoundAbortController = void 0;
          }
          if (this.syncing === roundPromise) {
            this.syncing = void 0;
            let nextDelayMs = this.syncDebounceMs;
            let nextKind = "periodic";
            if (this.resumeBackoffResetPending) {
              this.resumeBackoffResetPending = false;
              this.syncBackoff.recordSuccess();
            } else if (failed2) {
              nextDelayMs = this.delayAfterRoundFailure();
              nextKind = "backoff";
            } else if (!stoodAside) {
              this.syncBackoff.recordSuccess();
              this.restorePassiveRetryInterval();
            } else if (this.mintGate !== void 0 && this.mintGate.remainingMs <= 0) {
              this.restorePassiveRetryInterval();
            }
            if (this.isClosing()) {
              if (this.followUpNeeded) {
                this.followUpNeeded = false;
                this.cancelQueuedExplicitFollowUp();
              }
            } else if (this.resumeRecoveryInProgress) {
              if (stoodAside) {
                this.followUpNeeded = true;
              }
              if (stoodAside && returnSummary) {
                stoodAsideWait = this.getOrCreateExplicitFollowUpDeferred();
              }
            } else {
              if (stoodAside) {
                this.followUpNeeded = true;
              }
              if (stoodAside && returnSummary) {
                stoodAsideWait = this.getOrCreateExplicitFollowUpDeferred();
              }
              if (this.followUpNeeded) {
                this.followUpNeeded = false;
                const explicitWaiters = this.takeExplicitFollowUpDeferred();
                void this.runFollowUpRound(explicitWaiters);
              } else {
                this.scheduleSync(nextDelayMs, nextKind);
              }
            }
          }
        }
      }))();
      this.syncing = roundPromise;
      let onAbandon;
      const abandoned = new Promise((resolve29) => {
        onAbandon = resolve29;
      });
      this.abandonActiveRoundOwner = onAbandon;
      this.activeRoundAbandoned = abandoned;
      try {
        yield Promise.race([roundPromise, abandoned]);
      } finally {
        if (this.abandonActiveRoundOwner === onAbandon) {
          this.abandonActiveRoundOwner = void 0;
          this.activeRoundAbandoned = void 0;
        }
      }
      if (stoodAsideWait !== void 0) {
        return yield stoodAsideWait;
      }
      return returnSummary ? roundSummary : void 0;
    });
  }
  assertPathsSafe() {
    this.validatePathsHook();
  }
  guardedPathsSafe(options2) {
    try {
      this.validatePathsHook();
      return true;
    } catch (error42) {
      if (options2.invalidateOnFailure) {
        void this.beginTeardown({
          kind: "invalidate",
          options: { flush: false },
          reason: String(error42)
        });
      }
      return false;
    }
  }
  delayAfterRoundFailure() {
    const backoffMs = this.syncBackoff.recordFailure();
    if (this.mintGate === void 0) {
      return backoffMs;
    }
    const gateMs = this.mintGate.remainingMs;
    if (gateMs <= 0) {
      this.restorePassiveRetryInterval();
      return backoffMs;
    }
    this.extendPassiveRetryInterval(gateMs);
    return Math.max(backoffMs, gateMs);
  }
  extendPassiveRetryInterval(gateMs) {
    var _a19;
    var _b2;
    const configured2 = (_b2 = this.passiveRetryIntervalMs) !== null && _b2 !== void 0 ? _b2 : 0;
    (_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.setPassiveRetryIntervalMs(Math.max(configured2, gateMs));
  }
  restorePassiveRetryInterval() {
    var _a19;
    if (this.passiveRetryIntervalMs !== void 0) {
      (_a19 = this.engine) === null || _a19 === void 0 ? void 0 : _a19.setPassiveRetryIntervalMs(this.passiveRetryIntervalMs);
    }
  }
  emitSyncMetrics(summary) {
    const metricsEmitter = this.metricsEmitter;
    if (metricsEmitter === void 0) {
      return;
    }
    if (summary.durationMs === 0 && summary.errors.length === 0 && !summary.listingComplete) {
      return;
    }
    try {
      notifySummaryMetrics({
        agentId: this.key,
        summary,
        metricsEmitter,
        listener: metricsEmitter,
        pathHashSalt: this.pathHashSalt
      });
    } catch (_a19) {
    }
  }
  emitRoundLifecycle(event) {
    var _a19, _b2;
    try {
      (_b2 = (_a19 = this.metricsEmitter) === null || _a19 === void 0 ? void 0 : _a19.onRoundLifecycle) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, Object.assign({ agentId: this.key }, event));
    } catch (_c2) {
    }
  }
  emitLockEvent(kind) {
    var _a19, _b2;
    try {
      (_b2 = (_a19 = this.metricsEmitter) === null || _a19 === void 0 ? void 0 : _a19.onLockEvent) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, { agentId: this.key, kind });
    } catch (_c2) {
    }
  }
  emitResumeDetected(gapMs) {
    var _a19, _b2;
    const event = { agentId: this.key, gapMs };
    safeInvokeCallback(this.onResumeDetectedCallback, event);
    try {
      (_b2 = (_a19 = this.metricsEmitter) === null || _a19 === void 0 ? void 0 : _a19.onResumeDetected) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, event);
    } catch (_c2) {
    }
  }
  emitThrownSyncMetrics(error42) {
    var _a19, _b2;
    const metricsEmitter = this.metricsEmitter;
    if (metricsEmitter === void 0) {
      return;
    }
    const errorClass = error42 instanceof AgentStoreSyncError ? error42.code : "unknown";
    const timeoutClass = hasCooperativeRoundAbortInChain(error42) ? void 0 : error42 instanceof AgentStoreSyncError && error42.timeoutClass !== void 0 ? error42.timeoutClass : isDeadlineExceededShaped(error42) ? "rpc" : void 0;
    try {
      (_a19 = metricsEmitter.onError) === null || _a19 === void 0 ? void 0 : _a19.call(metricsEmitter, Object.assign({ agentId: this.key, op: "unknown", errorClass }, timeoutClass !== void 0 ? { timeoutClass } : {}));
      (_b2 = metricsEmitter.onRoundCompleted) === null || _b2 === void 0 ? void 0 : _b2.call(metricsEmitter, {
        agentId: this.key,
        durationMs: 0,
        filesPushed: 0,
        filesPulled: 0,
        filesSkipped: 0,
        bytesPushed: 0,
        bytesPulled: 0,
        refusals: 0,
        filesConflicted: 0,
        identicalContentConflictsSuppressed: 0,
        conflictProtectionDowngrades: 0,
        legacyProbes: 0,
        pushEntriesParked: 0,
        pullsDeferred: 0,
        pullsSkippedPendingDelete: 0,
        filesDeletedRemote: 0,
        filesDeletedLocal: 0,
        deleteConflicts: 0,
        scanDeletesJournaled: 0,
        recoveryDisarms: 0,
        identityRecoveryWipeFailed: false,
        legacyRowsRestored: 0,
        listingComplete: false,
        errorCount: 1,
        failed: true,
        walkMs: 0,
        hashMs: 0,
        presignMs: 0,
        uploadMs: 0,
        listMs: 0,
        downloadMs: 0,
        scope: "full"
      });
    } catch (_c2) {
    }
  }
};
AgentStoreSyncSession.RESUME_DRAIN_MAX_LAPS = 2;
