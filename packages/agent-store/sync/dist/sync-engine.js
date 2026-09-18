var __awaiter16 = function(thisArg, _arguments, P2, generator) {
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
var __asyncValues5 = function(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o[Symbol.asyncIterator], i;
  return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v2) {
      return new Promise(function(resolve29, reject2) {
        v2 = o[n](v2), settle(resolve29, reject2, v2.done, v2.value);
      });
    };
  }
  function settle(resolve29, reject2, d, v2) {
    Promise.resolve(v2).then(function(v3) {
      resolve29({ value: v3, done: d });
    }, reject2);
  }
};
var DEFAULT_MAX_FILE_SIZE_BYTES = AGENT_STORE_DEFAULT_MAX_FILE_SIZE_BYTES;
var DEFAULT_MULTIPART_UPLOAD_THRESHOLD_BYTES = 64 * 1024 * 1024;
var DEFAULT_MULTIPART_PART_SIZE_BYTES = 16 * 1024 * 1024;
var DEFAULT_MULTIPART_PRESIGN_WINDOW_SIZE = 8;
var DEFAULT_PULL_PRESIGN_WINDOW_SIZE = 500;
var DEFAULT_MULTIPART_COMPLETE_MAX_ATTEMPTS = 3;
var DEFAULT_MULTIPART_MAX_RESTARTS = 1;
var DEFAULT_MULTIPART_MAX_CONFLICT_RENAMES = 1;
var DEFAULT_MULTIPART_MAX_EXPIRY_REFRESHES = 1;
var DEFAULT_BLOB_IDLE_TIMEOUT_MS = 6e4;
var DEFAULT_IDENTICAL_CONFLICT_COMPARE_MAX_BYTES = 16 * 1024 * 1024;
var DEFAULT_PUSH_TERMINAL_BACKOFF_BASE_MS = 5e3;
var DEFAULT_PUSH_TERMINAL_BACKOFF_MAX_MS = 15 * 6e4;
var DELETE_FLUSH_BATCH_SIZE = 500;
var LOCK_OWNERSHIP_CACHE_MS = 1e3;
var TOMBSTONE_ROW_RETENTION_MS = 30 * 24 * 60 * 60 * 1e3;
var DEFAULT_TOMBSTONE_FULL_REFRESH_ROUNDS = 2880;
var DEFAULT_TOMBSTONE_FULL_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1e3;
var DEFAULT_TOMBSTONE_PRUNE_SLACK_MS = 3 * 24 * 60 * 60 * 1e3;
var DELETION_ARMED_META_KEY = META_DELETION_ARMED;
var FILES_ROOT_DEV_META_KEY = META_FILES_ROOT_DEV;
var FILES_ROOT_INO_META_KEY = META_FILES_ROOT_INO;
var AgentStoreSyncError = class extends Error {
  constructor(options2) {
    super(options2.message);
    this.name = "AgentStoreSyncError";
    this.code = options2.code;
    this.relPath = options2.relPath;
    this.cause = options2.cause;
    this.httpStatus = options2.httpStatus;
    this.retryable = options2.retryable;
    this.timeoutClass = options2.timeoutClass;
  }
};
var DEFAULT_PASSIVE_RETRY_INTERVAL_MS = 5e3;
var DEFAULT_PASSIVE_INDEX_POLL_INTERVAL_MS = 2e3;
var PRIVATE_FILE_MODE4 = 384;
var READ_ONLY_FILE_MODE = 256;
var AgentStoreSyncEngine = class {
  constructor(options2) {
    var _a19, _b2, _c2, _d, _e2, _f, _g, _h, _j, _k, _l, _m, _o2, _p, _q, _r2, _s2, _t2, _u;
    this.lockOwnershipCheckedAtMs = 0;
    this.lockOwnershipCached = true;
    this.stateMutation = Promise.resolve();
    this.inFlightRounds = /* @__PURE__ */ new Set();
    this.pendingLockLost = false;
    this.orphanedRounds = /* @__PURE__ */ new Set();
    this.roundScheduler = new SyncRoundScheduler();
    this.roundChainAbandoned = false;
    this.disposed = false;
    this.closeFlushPending = false;
    this.closing = false;
    this.lockReleaseDeferred = false;
    this.lastPullListingComplete = false;
    this.recoveryDisarmed = false;
    this.pathHashSalt = (0, import_node_crypto4.randomBytes)(16).toString("hex");
    this.roundJournaledConflictEmits = [];
    this.pushParkedUntilMs = /* @__PURE__ */ new Map();
    this.pushParkBackoff = /* @__PURE__ */ new Map();
    this.activeRoundLane = "full";
    if (!path9.isAbsolute(options2.filesDir)) {
      throw new Error(`AgentStoreSyncEngine.filesDir must be absolute: ${options2.filesDir}`);
    }
    if (!path9.isAbsolute(options2.tmpDir)) {
      throw new Error(`AgentStoreSyncEngine.tmpDir must be absolute: ${options2.tmpDir}`);
    }
    this.agentId = options2.agentId;
    this.filesDir = path9.resolve(options2.filesDir);
    this.tmpDir = path9.resolve(options2.tmpDir);
    this.client = options2.client;
    this.index = options2.index;
    this.queues = options2.queues;
    this.maxFileSizeBytes = (_a19 = options2.maxFileSizeBytes) !== null && _a19 !== void 0 ? _a19 : DEFAULT_MAX_FILE_SIZE_BYTES;
    this.multipartUploadThresholdBytes = (_b2 = options2.multipartUploadThresholdBytes) !== null && _b2 !== void 0 ? _b2 : DEFAULT_MULTIPART_UPLOAD_THRESHOLD_BYTES;
    this.multipartPartSizeBytes = (_c2 = options2.multipartPartSizeBytes) !== null && _c2 !== void 0 ? _c2 : DEFAULT_MULTIPART_PART_SIZE_BYTES;
    this.multipartPresignWindowSize = (_d = options2.multipartPresignWindowSize) !== null && _d !== void 0 ? _d : DEFAULT_MULTIPART_PRESIGN_WINDOW_SIZE;
    this.pullPresignWindowSize = (_e2 = options2.pullPresignWindowSize) !== null && _e2 !== void 0 ? _e2 : DEFAULT_PULL_PRESIGN_WINDOW_SIZE;
    this.multipartCompleteMaxAttempts = (_f = options2.multipartCompleteMaxAttempts) !== null && _f !== void 0 ? _f : DEFAULT_MULTIPART_COMPLETE_MAX_ATTEMPTS;
    this.multipartMaxRestarts = (_g = options2.multipartMaxRestarts) !== null && _g !== void 0 ? _g : DEFAULT_MULTIPART_MAX_RESTARTS;
    this.multipartMaxConflictRenames = (_h = options2.multipartMaxConflictRenames) !== null && _h !== void 0 ? _h : DEFAULT_MULTIPART_MAX_CONFLICT_RENAMES;
    this.multipartMaxExpiryRefreshes = (_j = options2.multipartMaxExpiryRefreshes) !== null && _j !== void 0 ? _j : DEFAULT_MULTIPART_MAX_EXPIRY_REFRESHES;
    if (!Number.isSafeInteger(this.multipartUploadThresholdBytes) || this.multipartUploadThresholdBytes < 1 || !Number.isSafeInteger(this.multipartPartSizeBytes) || this.multipartPartSizeBytes < 1 || !Number.isSafeInteger(this.multipartPresignWindowSize) || this.multipartPresignWindowSize < 1 || !Number.isSafeInteger(this.pullPresignWindowSize) || this.pullPresignWindowSize < 1 || !Number.isSafeInteger(this.multipartCompleteMaxAttempts) || this.multipartCompleteMaxAttempts < 1 || !Number.isSafeInteger(this.multipartMaxRestarts) || this.multipartMaxRestarts < 0 || !Number.isSafeInteger(this.multipartMaxConflictRenames) || this.multipartMaxConflictRenames < 0 || !Number.isSafeInteger(this.multipartMaxExpiryRefreshes) || this.multipartMaxExpiryRefreshes < 0) {
      throw new RangeError("AgentStoreSyncEngine multipart/pull-presign controls must be safe integers within their minimums");
    }
    this.blobIdleTimeoutMs = normalizeBlobIdleTimeoutMs(options2.blobIdleTimeoutMs);
    this.resumeLockCallTimeoutMs = Math.max(0, (_k = options2.resumeLockCallTimeoutMs) !== null && _k !== void 0 ? _k : 0);
    this.tombstoneFullRefreshRoundsValue = normalizeTombstoneFullRefreshRounds(options2.tombstoneFullRefreshRounds);
    this.tombstoneFullRefreshIntervalMsValue = normalizeTombstoneFullRefreshIntervalMs(options2.tombstoneFullRefreshIntervalMs);
    this.tombstonePruneSlackMsValue = normalizeTombstonePruneSlackMs(options2.tombstonePruneSlackMs);
    if (options2.blobTransfer !== void 0) {
      this.blobTransfer = options2.blobTransfer;
      if (this.blobTransfer instanceof HttpAgentStoreBlobTransfer) {
        this.blobTransfer.setBlobIdleTimeoutMs(this.blobIdleTimeoutMs);
      }
    } else {
      this.blobTransfer = new HttpAgentStoreBlobTransfer({
        maxFileSizeBytes: this.maxFileSizeBytes,
        blobIdleTimeoutMs: this.blobIdleTimeoutMs
      });
    }
    this.fetchImpl = (_l = options2.fetch) !== null && _l !== void 0 ? _l : globalThis.fetch.bind(globalThis);
    this.now = (_m = options2.now) !== null && _m !== void 0 ? _m : Date.now;
    this.monotonicNow = (_o2 = options2.monotonicNow) !== null && _o2 !== void 0 ? _o2 : monotonicNowMs;
    this.validatePresignedUrl = options2.validatePresignedUrl;
    this.lockProvider = options2.lockProvider;
    this.syncMode = (_p = options2.syncMode) !== null && _p !== void 0 ? _p : "readWrite";
    this.platform = (_q = options2.platform) !== null && _q !== void 0 ? _q : process.platform;
    this.onStateChanged = options2.onStateChanged;
    this.passiveRetryIntervalMs = (_r2 = options2.passiveRetryIntervalMs) !== null && _r2 !== void 0 ? _r2 : DEFAULT_PASSIVE_RETRY_INTERVAL_MS;
    this.passiveIndexPollIntervalMs = (_s2 = options2.passiveIndexPollIntervalMs) !== null && _s2 !== void 0 ? _s2 : DEFAULT_PASSIVE_INDEX_POLL_INTERVAL_MS;
    this.indexFilePath = options2.indexPath;
    this.onPassiveIndexUpdated = options2.onPassiveIndexUpdated;
    this.onWarn = options2.onWarn;
    this.defaultSignal = options2.signal;
    this.shouldRelinquishLockLost = (_t2 = options2.shouldRelinquishLockLost) !== null && _t2 !== void 0 ? _t2 : (() => true);
    this.state = (_u = options2.initialState) !== null && _u !== void 0 ? _u : "running";
    if (this.state === "running" && this.lockProvider !== void 0) {
      this.state = "paused";
    }
    this.conflictJournal = new ConflictJournal(conflictJournalPathForFilesDir(this.filesDir), {
      warn: (message, error41) => this.warn(message, error41)
    });
    this.pendingConflictJournal = new PendingConflictJournal(conflictPendingJournalPathForFilesDir(this.filesDir), {
      warn: (message, error41) => this.warn(message, error41)
    });
  }
  getState() {
    return this.state;
  }
  /** Test / observability: path of the append-only conflict journal. */
  conflictJournalPath() {
    return this.conflictJournal.path;
  }
  /** Test helper: append-failure counter (best-effort journal writes). */
  conflictJournalAppendFailureCount() {
    return this.conflictJournal.appendFailureCount();
  }
  /** Test / observability: path of the durable pending-emit sidecar. */
  pendingConflictJournalPath() {
    return this.pendingConflictJournal.path;
  }
  /** Test / observability: count of durably-queued (unflushed) emits. */
  pendingConflictJournalSize() {
    return this.pendingConflictJournal.size();
  }
  /** Best-effort diagnostic; swallows listener errors so warns never throw. */
  warn(message, error41) {
    if (this.onWarn === void 0) {
      return;
    }
    try {
      this.onWarn(message, error41);
    } catch (_a19) {
    }
  }
  pulledFileMode() {
    return this.syncMode === "readOnly" ? READ_ONLY_FILE_MODE : PRIVATE_FILE_MODE4;
  }
  /** Releases the lock and parks the loop. Idempotent under concurrent callers. */
  pause() {
    return __awaiter16(this, void 0, void 0, function* () {
      yield this.serialize(() => __awaiter16(this, void 0, void 0, function* () {
        if (this.state === "paused") {
          return;
        }
        this.transitionTo("paused", "pause");
        yield this.drainInFlightRounds();
        this.attemptPendingConflictJournalFlushForShutdown();
        if (this.orphanedRounds.size > 0) {
          this.warn("pause proceeding with abandoned in-flight round; lock recovery deferred", void 0);
          return;
        }
        if (this.lockReleaseDeferred) {
          return;
        }
        yield this.releaseLockIfHeld();
      }));
    });
  }
  /**
   * Acquires the lock and becomes `running`; sits in `passive` if a provider
   * is set and the lock is held elsewhere. Idempotent. No-op after
   * `dispose()` so a stale passive-mode retry can't resurrect a closed
   * SQLite handle.
   */
  unpause() {
    return __awaiter16(this, void 0, void 0, function* () {
      yield this.serialize(() => __awaiter16(this, void 0, void 0, function* () {
        if (this.disposed || this.closing) {
          return;
        }
        if (this.state === "running") {
          return;
        }
        if (this.lockProvider === void 0) {
          this.transitionTo("running", "unpause");
          return;
        }
        if (this.orphanedRounds.size > 0) {
          if (this.state !== "passive") {
            this.transitionTo("passive", "unpause");
          }
          return;
        }
        const handle = yield this.acquireLockBounded(this.lockProvider);
        if (handle === void 0) {
          if (this.state !== "passive") {
            this.transitionTo("passive", "unpause");
          }
          return;
        }
        this.lockHandle = handle;
        this.lockReleaseDeferred = false;
        this.lockOwnershipCheckedAtMs = 0;
        this.lockOwnershipCached = true;
        this.transitionTo("running", "unpause");
      }));
    });
  }
  /**
   * Releases the lock; if currently `running`, attempts a single best-effort
   * final flush so any local edits made just before close still reach the
   * server. Idempotent. Waits for any in-flight `forceSync()` round to
   * settle before releasing the lock so a concurrent round can't keep
   * operating after the lock has moved on.
   */
  dispose(options2) {
    return __awaiter16(this, void 0, void 0, function* () {
      yield this.serialize(() => __awaiter16(this, void 0, void 0, function* () {
        if (this.disposed) {
          return;
        }
        const fromState = this.state;
        const shouldFlush = this.state === "running" || this.closeFlushPending;
        const deferLockReleaseForThisClose = (options2 === null || options2 === void 0 ? void 0 : options2.deferLockRelease) === true;
        const releaseDeferredBeforeDispose = this.lockReleaseDeferred;
        this.disposed = true;
        this.stopPassiveTimers();
        if (this.state !== "paused") {
          this.transitionTo("paused", "unmount");
        } else {
          this.emitStateChanged({
            fromState,
            toState: "paused",
            reason: "unmount"
          });
        }
        yield this.drainInFlightRounds();
        if (this.orphanedRounds.size > 0) {
          this.attemptPendingConflictJournalFlushForShutdown();
          this.warn("dispose proceeding with abandoned in-flight round; lock recovery deferred", void 0);
          return;
        }
        if (releaseDeferredBeforeDispose && this.closeFlushPending && !deferLockReleaseForThisClose) {
          this.clearLockReleaseDeferredIfIdle();
        }
        if (shouldFlush && // A wedged round abandoned mid-flight (deferred release) must not run
        // a final flush: it may not still own the lock and the flush could
        // race the stale-steal. Re-read the flag live — it may have been set
        // by the session while this dispose awaited the wedged round.
        !this.lockReleaseDeferred && (this.lockProvider === void 0 || this.lockHandle !== void 0)) {
          try {
            yield this.runSyncRound({
              finalFlush: true,
              signal: this.defaultSignal
            });
          } catch (_a19) {
          }
        }
        this.attemptPendingConflictJournalFlushForShutdown();
        if (this.lockReleaseDeferred) {
          return;
        }
        yield this.releaseLockIfHeld();
      }));
    });
  }
  // Private — every transition path runs inside `serialize()`, and a
  // subclass with direct `transitionTo` access could bypass that mutex
  // (e.g. set state to `running` without the lock, or race a concurrent
  // dispose()). Keep the visibility tight to make the invariant
  // structural rather than convention.
  transitionTo(toState, reason) {
    if (this.state === toState) {
      return;
    }
    const fromState = this.state;
    this.state = toState;
    if (toState === "passive") {
      this.resetPassiveIndexBaseline();
      this.startPassiveTimers();
    } else {
      this.stopPassiveTimers();
    }
    this.emitStateChanged({ fromState, toState, reason });
  }
  emitStateChanged(transition) {
    if (this.onStateChanged === void 0) {
      return;
    }
    try {
      this.onStateChanged(Object.assign({ agentId: this.agentId }, transition));
    } catch (_a19) {
    }
  }
  resetPassiveIndexBaseline() {
    this.lastIndexMtimeMs = this.indexFilePath === void 0 ? void 0 : readIndexMtimeSync(this.indexFilePath);
  }
  /**
   * Live-update the passive index poll interval (Statsig refresh). Restarts
   * passive timers when currently passive so enabling poll mid-session takes
   * effect before the dirty-passive stall watchdog arms.
   */
  /** Live-update INCLUDE cadence (Statsig refresh). `1` disables the cursor. */
  setTombstoneFullRefreshRounds(rounds) {
    this.tombstoneFullRefreshRoundsValue = normalizeTombstoneFullRefreshRounds(rounds);
  }
  /** Live-update the wall-clock INCLUDE interval. `0` disables it. */
  setTombstoneFullRefreshIntervalMs(intervalMs) {
    this.tombstoneFullRefreshIntervalMsValue = normalizeTombstoneFullRefreshIntervalMs(intervalMs);
  }
  /** Live-update how far inside the floor a tombstone must be before prune. */
  setTombstonePruneSlackMs(slackMs) {
    this.tombstonePruneSlackMsValue = normalizeTombstonePruneSlackMs(slackMs);
  }
  setPassiveIndexPollIntervalMs(intervalMs) {
    if (intervalMs === this.passiveIndexPollIntervalMs) {
      return;
    }
    this.passiveIndexPollIntervalMs = intervalMs;
    if (!this.disposed && this.state === "passive") {
      this.startPassiveTimers();
    }
  }
  /**
   * Periodically retry the lock and watch the holder's index updates while
   * passive. Both timers `unref()` so they don't keep the process alive.
   */
  startPassiveTimers() {
    var _a19, _b2, _c2, _d;
    this.stopPassiveTimers();
    if (this.disposed || this.lockProvider === void 0) {
      return;
    }
    if (this.passiveRetryIntervalMs > 0) {
      this.passiveRetryTimer = setInterval(() => {
        if (this.disposed || this.closing || this.state !== "passive") {
          return;
        }
        void this.unpause().catch(() => {
        });
      }, this.passiveRetryIntervalMs);
      (_b2 = (_a19 = this.passiveRetryTimer).unref) === null || _b2 === void 0 ? void 0 : _b2.call(_a19);
    }
    if (this.passiveIndexPollIntervalMs > 0 && this.onPassiveIndexUpdated !== void 0 && this.indexFilePath !== void 0) {
      this.passiveIndexTimer = setInterval(() => {
        this.checkPassiveIndexProgress();
      }, this.passiveIndexPollIntervalMs);
      (_d = (_c2 = this.passiveIndexTimer).unref) === null || _d === void 0 ? void 0 : _d.call(_c2);
      this.checkPassiveIndexProgress();
    }
  }
  checkPassiveIndexProgress() {
    var _a19;
    if (this.disposed || this.state !== "passive" || this.indexFilePath === void 0) {
      return;
    }
    const mtime = readIndexMtimeSync(this.indexFilePath);
    if (mtime === void 0) {
      return;
    }
    if (this.lastIndexMtimeMs === void 0) {
      this.lastIndexMtimeMs = mtime;
      return;
    }
    if (mtime > this.lastIndexMtimeMs) {
      this.lastIndexMtimeMs = mtime;
      try {
        (_a19 = this.onPassiveIndexUpdated) === null || _a19 === void 0 ? void 0 : _a19.call(this, {
          agentId: this.agentId,
          mtimeMs: mtime
        });
      } catch (_b2) {
      }
    }
  }
  stopPassiveTimers() {
    if (this.passiveRetryTimer !== void 0) {
      clearInterval(this.passiveRetryTimer);
      this.passiveRetryTimer = void 0;
    }
    if (this.passiveIndexTimer !== void 0) {
      clearInterval(this.passiveIndexTimer);
      this.passiveIndexTimer = void 0;
    }
  }
  /**
   * Release the held lock handle, bounded so it never wedges `serialize`.
   *
   * This is the single release chokepoint for pause / dispose / relinquish /
   * revalidate, so bounding it here makes every release path safe against a
   * dead post-suspend socket — the third face of the same hazard as the
   * bounded verify and acquire. The handle is detached *before* awaiting
   * `release()`, so engine state is already clean if the release hangs, and no
   * later teardown step observes a half-released handle. When a bound is
   * configured ({@link resumeLockCallTimeoutMs} > 0) a wedged `release()` is
   * left to finish in the background (fire-and-forget: the lockfile is unlinked
   * whenever the socket recovers, and the stale-steal covers the meantime)
   * rather than holding `serialize` and deadlocking a concurrent
   * `close()`/`dispose()`. With no bound the release is awaited unbounded, as
   * before.
   */
  releaseLockIfHeld() {
    return __awaiter16(this, void 0, void 0, function* () {
      const handle = this.lockHandle;
      if (handle === void 0) {
        return;
      }
      this.lockHandle = void 0;
      const release = handle.release().catch(() => {
      });
      yield this.raceResumeLockCall(release, void 0);
    });
  }
  /**
   * Relinquish the write lock and drop to `passive` so a healthy peer can take
   * over. Called by the session after a wedged round has unwound (watchdog
   * trip or repeated timeout failures) — never with writes still in flight.
   * Idempotent: a no-op unless currently `running`. Passive retry timers then
   * re-contend on the normal cadence once this host is healthy again.
   */
  relinquishLock() {
    return __awaiter16(this, arguments, void 0, function* (reason = "lock_lost") {
      if (this.lockProvider === void 0) {
        return;
      }
      yield this.serialize(() => __awaiter16(this, void 0, void 0, function* () {
        if (this.disposed || this.state !== "running") {
          return;
        }
        if (this.closeFlushPending || !this.shouldRelinquishLockLost()) {
          this.lockOwnershipCheckedAtMs = 0;
          this.lockOwnershipCached = true;
          return;
        }
        yield this.releaseLockIfHeld();
        this.transitionTo("passive", reason);
      }));
    });
  }
  /**
   * Record that a `close({ flush: true })` has begun so dispose's final flush
   * survives a concurrent wedged-round relinquish. Set synchronously at close
   * entry (before aborting the round or awaiting the in-flight promise) so it
   * is observed by any relinquish serialized after teardown starts. Sticky and
   * idempotent; a disposed engine is never reused.
   */
  markCloseFlushPending() {
    this.closeFlushPending = true;
  }
  /**
   * Record that session teardown has begun (flush or not). Sticky and
   * idempotent; blocks orphan-settle / passive-timer `unpause()` so close
   * cannot lose a race against resume's re-contend path.
   */
  markClosing() {
    this.closing = true;
  }
  /**
   * Last-resort heartbeat stop for an aborted round that will not unwind:
   * ask the lock handle to stop refreshing the lockfile mtime so the existing
   * stale-steal moves ownership. Best-effort and idempotent.
   *
   * Also defers lock release for the current teardown attempt: once the
   * heartbeat is stopped, ownership recovery belongs to the stale-steal, so a
   * dispose/pause that races the still-running wedge must not explicitly
   * release the lockfile (writes may still be in flight, and a peer may
   * already be taking over). The deferral is cleared once the engine goes
   * quiescent — see {@link lockReleaseDeferred} and
   * {@link clearLockReleaseDeferredIfIdle} — so a later idle
   * `close({ flush: true })` after the wedge settled still flushes and
   * releases normally.
   */
  markLockUnhealthy() {
    var _a19, _b2;
    this.lockReleaseDeferred = true;
    (_b2 = (_a19 = this.lockHandle) === null || _a19 === void 0 ? void 0 : _a19.markUnhealthy) === null || _b2 === void 0 ? void 0 : _b2.call(_a19);
  }
  /**
   * Clear the deferred-release latch once the engine is quiescent. A wedged
   * round that tripped {@link markLockUnhealthy} intentionally left the lock
   * to the stale-steal for that teardown attempt, but the deferral must not
   * outlive the wedge: once no round is in flight and no orphan remains, a
   * `close({ flush: true })` is expected to flush and release the lock like
   * any other idle close. No-op while any round is still running (the
   * stale-steal still owns recovery) or when the latch is already clear.
   */
  clearLockReleaseDeferredIfIdle() {
    if (this.lockReleaseDeferred && this.inFlightRounds.size === 0 && this.orphanedRounds.size === 0) {
      this.lockReleaseDeferred = false;
    }
  }
  /**
   * Force a fresh on-disk lock-ownership check (bypassing the fencing cache)
   * and drop to `passive` if a stale-steal moved the lock to another holder.
   * Used after a host suspend/resume, where a silently dead socket may have
   * let a peer take over while this host slept. No-op unless currently
   * `running` with a held contended lock. Best-effort.
   */
  revalidateLockOwnership() {
    return __awaiter16(this, void 0, void 0, function* () {
      if (this.lockProvider === void 0) {
        return;
      }
      yield this.serialize(() => __awaiter16(this, void 0, void 0, function* () {
        if (this.disposed || this.closing || this.state !== "running" || this.lockHandle === void 0) {
          return;
        }
        this.lockOwnershipCheckedAtMs = 0;
        const owned = yield this.raceResumeLockCall(this.isLockStillOwnedOnDisk(), "timeout");
        if (owned !== false) {
          return;
        }
        yield this.releaseLockIfHeld();
        this.transitionTo("passive", "lock_lost");
      }));
    });
  }
  /**
   * Race a lock-provider call made from inside {@link serialize} against
   * {@link resumeLockCallTimeoutMs}. Returns `timeoutValue` if the call does
   * not settle in time so the mutex is released and a concurrent
   * {@link dispose} cannot deadlock behind a wedged `verifyStillOwned` /
   * `acquire`. The underlying call keeps running; this only stops the resume
   * path from awaiting it. A non-positive bound leaves the call unbounded.
   */
  raceResumeLockCall(call, timeoutValue) {
    return __awaiter16(this, void 0, void 0, function* () {
      const timeoutMs = this.resumeLockCallTimeoutMs;
      if (timeoutMs <= 0) {
        return yield call;
      }
      let timer;
      const deadline = new Promise((resolve29) => {
        var _a19;
        timer = setTimeout(() => resolve29(timeoutValue), timeoutMs);
        (_a19 = timer.unref) === null || _a19 === void 0 ? void 0 : _a19.call(timer);
      });
      try {
        return yield Promise.race([call, deadline]);
      } finally {
        if (timer !== void 0) {
          clearTimeout(timer);
        }
      }
    });
  }
  /**
   * `acquire()` bounded by {@link resumeLockCallTimeoutMs}, made leak-safe.
   *
   * Unlike {@link raceResumeLockCall}, `acquire` yields an owned resource: a
   * handle discarded on timeout would keep the on-disk lock held with nothing
   * left to release it, wedging every peer (and this engine) — the classic
   * timed-acquire leak. On timeout this returns `undefined` (so `unpause`
   * stays `passive`, exactly like a lost race) but keeps watching the original
   * `acquire`: a handle that resolves *after* the deadline is always released,
   * never orphaned. It is never adopted as `this.lockHandle` — only a handle
   * returned *before* the deadline (below) becomes the engine's lock — so the
   * post-timeout release can never drop a lock this engine legitimately holds.
   * A non-positive bound leaves `acquire` unbounded (its handle is returned
   * and adopted normally).
   */
  acquireLockBounded(provider) {
    return __awaiter16(this, void 0, void 0, function* () {
      const timeoutMs = this.resumeLockCallTimeoutMs;
      const acquire = provider.acquire();
      if (timeoutMs <= 0) {
        return yield acquire;
      }
      let timer;
      const deadline = new Promise((resolve29) => {
        var _a19;
        timer = setTimeout(() => resolve29("timeout"), timeoutMs);
        (_a19 = timer.unref) === null || _a19 === void 0 ? void 0 : _a19.call(timer);
      });
      let raced;
      try {
        raced = yield Promise.race([acquire, deadline]);
      } finally {
        if (timer !== void 0) {
          clearTimeout(timer);
        }
      }
      if (raced !== "timeout") {
        return raced;
      }
      void acquire.then((handle) => this.releaseOrphanedLockHandle(handle)).catch(() => {
      });
      return void 0;
    });
  }
  /**
   * Release a lock handle that resolved from a timed-out `acquire` and was
   * therefore never adopted as {@link lockHandle}. Identity-guards against the
   * (structurally impossible for a timed-out acquire) case where the engine
   * has adopted this exact handle, so it can never release a live lock.
   */
  releaseOrphanedLockHandle(handle) {
    return __awaiter16(this, void 0, void 0, function* () {
      if (handle === void 0 || handle === this.lockHandle) {
        return;
      }
      try {
        yield handle.release();
      } catch (_a19) {
      }
    });
  }
  /**
   * Re-read the on-disk lockfile owner and report whether this engine still
   * holds it. Cached for {@link LOCK_OWNERSHIP_CACHE_MS} so per-batch fencing
   * stays cheap. Lock providers without `verifyStillOwned` (or tests) are
   * treated as owned; a transient read error never falsely relinquishes.
   */
  isLockStillOwnedOnDisk() {
    return __awaiter16(this, void 0, void 0, function* () {
      const handle = this.lockHandle;
      if ((handle === null || handle === void 0 ? void 0 : handle.verifyStillOwned) === void 0) {
        return true;
      }
      const now = this.now();
      if (this.lockOwnershipCheckedAtMs !== 0 && now - this.lockOwnershipCheckedAtMs < LOCK_OWNERSHIP_CACHE_MS) {
        return this.lockOwnershipCached;
      }
      let owned;
      try {
        owned = yield handle.verifyStillOwned();
      } catch (_a19) {
        owned = true;
      }
      this.lockOwnershipCheckedAtMs = now;
      this.lockOwnershipCached = owned;
      return owned;
    });
  }
  /**
   * Fence a write/blob batch against round abort or a stolen on-disk lock.
   * On mismatch sets `pendingLockLost` and throws; relinquish is deferred
   * to `forceSync`'s `finally` (serialize from inside a round deadlocks).
   */
  assertRoundStillOwnsLock(relPath, options2) {
    return __awaiter16(this, void 0, void 0, function* () {
      this.throwIfRoundAborted(relPath);
      if ((options2 === null || options2 === void 0 ? void 0 : options2.bypassCache) === true) {
        this.lockOwnershipCheckedAtMs = 0;
      }
      if (yield this.isLockStillOwnedOnDisk()) {
        return;
      }
      this.pendingLockLost = true;
      throw new AgentStoreSyncError({
        code: "lock_held_by_other",
        relPath,
        message: `Agent store engine for ${this.agentId} lost the write lock to another holder`
      });
    });
  }
  drainInFlightRounds() {
    return __awaiter16(this, void 0, void 0, function* () {
      yield this.roundScheduler.drain();
      while (this.inFlightRounds.size > 0) {
        yield Promise.allSettled([...this.inFlightRounds]);
      }
    });
  }
  /**
   * Serializes pause/unpause/dispose. The chain swallows rejections so a thrown
   * `work()` rethrows to its caller without poisoning subsequent serializations.
   */
  serialize(work) {
    return __awaiter16(this, void 0, void 0, function* () {
      const next = this.stateMutation.then(work, work);
      this.stateMutation = next.then(noop2, noop2);
      yield next;
    });
  }
  // Push runs before pull within the same tick; that makes "local edits
  // always win" fall out automatically — the upload writes the server etag
  // to the index, and the pull diff then sees `lastSeenEtag === server.etag`
  // for any path we just pushed.
  forceSync(options2) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      const callerSignal = (_a19 = options2 === null || options2 === void 0 ? void 0 : options2.signal) !== null && _a19 !== void 0 ? _a19 : this.defaultSignal;
      this.throwIfSignalAborted(callerSignal);
      return yield this.scheduleRound("full", (schedulerSignal) => this.runSyncRound({
        signal: composeAbortSignals(callerSignal, schedulerSignal)
      }));
    });
  }
  /**
   * Path-scoped push of `relPaths` (no walk/list/pull). Serialized on the
   * round scheduler; path rounds preempt queued full rounds. Does not
   * coalesce concurrent callers.
   */
  syncPaths(relPaths, options2) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      const signal = (_a19 = options2 === null || options2 === void 0 ? void 0 : options2.signal) !== null && _a19 !== void 0 ? _a19 : this.defaultSignal;
      this.throwIfSignalAborted(signal);
      return yield this.scheduleRound("path", () => this.runSyncPaths(relPaths, signal));
    });
  }
  /**
   * Pull named paths without walking or hashing the local tree.
   *
   * Lists each requested path's own parent directory rather than the store,
   * so cost scales with the citation, not the store. Serialized on the round
   * scheduler in the same lane as {@link syncPaths}, so it preempts queued
   * full rounds and never runs concurrently with one.
   */
  pullPaths(relPaths, options2) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      const signal = (_a19 = options2 === null || options2 === void 0 ? void 0 : options2.signal) !== null && _a19 !== void 0 ? _a19 : this.defaultSignal;
      this.throwIfSignalAborted(signal);
      return yield this.scheduleRound("path", () => this.withPublishedRoundSignal(signal, () => this.runPullPathsBody(relPaths)));
    });
  }
  runPullPathsBody(relPaths) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19, _b2;
      const summary = emptySummary("pull-path");
      if (!this.syncRoundStillAuthorized()) {
        this.throwIfRoundAborted();
        return summary;
      }
      yield this.assertRoundStillOwnsLock();
      const start = this.monotonicNow();
      this.throwIfRoundAborted();
      if (!this.tryRemoveObstructingFilesRoot(summary)) {
        summary.durationMs = this.monotonicNow() - start;
        return summary;
      }
      this.ensureDirsExist();
      const byParent = /* @__PURE__ */ new Map();
      for (const rawRelPath of relPaths) {
        let relPath;
        try {
          relPath = normalizeRelPath(rawRelPath);
        } catch (error41) {
          summary.refusals++;
          summary.errors.push({
            relPath: rawRelPath,
            code: "not_regular_file",
            message: error41 instanceof Error ? error41.message : `Unsafe path: ${rawRelPath}`
          });
          continue;
        }
        if (isReservedRelPath(relPath)) {
          summary.reservedPathsSkipped = ((_a19 = summary.reservedPathsSkipped) !== null && _a19 !== void 0 ? _a19 : 0) + 1;
          continue;
        }
        const parent = parentDirRelPath(relPath);
        const siblings = byParent.get(parent);
        if (siblings === void 0) {
          byParent.set(parent, [relPath]);
        } else if (!siblings.includes(relPath)) {
          siblings.push(relPath);
        }
      }
      const candidates = [];
      let listedAny = false;
      let everyListingComplete = true;
      for (const [parent, paths] of byParent) {
        this.throwIfRoundAborted();
        const listStart = this.monotonicNow();
        let listing;
        try {
          listing = yield this.runQueued(this.queues.list, () => this.client.listFiles({
            agentId: this.agentId,
            relPath: parent,
            tombstoneMode: AgentStoreTombstoneMode.OMIT,
            signal: this.activeRoundSignal
          }));
        } catch (error41) {
          this.rethrowIfRoundAbort(error41);
          this.rethrowIfLockLost(error41);
          everyListingComplete = false;
          for (const relPath of paths) {
            summary.errors.push(Object.assign({ relPath, code: error41 instanceof AgentStoreSyncError ? error41.code : "list_failed", message: error41 instanceof Error ? error41.message : String(error41) }, timeoutClassEntry(error41)));
          }
          continue;
        } finally {
          summary.listMs = ((_b2 = summary.listMs) !== null && _b2 !== void 0 ? _b2 : 0) + (this.monotonicNow() - listStart);
        }
        listedAny = true;
        if (listing.listingComplete !== true) {
          everyListingComplete = false;
        }
        candidates.push(...this.pullCandidatesFromListing(listing.files, summary, new Set(paths)));
      }
      summary.listingComplete = listedAny && everyListingComplete;
      yield this.pullCandidates(candidates, summary);
      summary.durationMs = this.monotonicNow() - start;
      return summary;
    });
  }
  /** Prefer the priority lane for path-scoped rounds when available. */
  runQueued(queue, operation) {
    return this.activeRoundLane === "path" && queue.enqueuePriority !== void 0 ? queue.enqueuePriority(operation) : queue.enqueue(operation);
  }
  /** Throws when the engine may not start a round (disposed/paused/passive/lockless). */
  assertRoundAuthorized() {
    if (this.disposed) {
      throw new AgentStoreSyncError({
        code: "paused",
        message: `Agent store engine for ${this.agentId} is disposed`
      });
    }
    if (this.state === "paused") {
      throw new AgentStoreSyncError({
        code: "paused",
        message: `Agent store engine for ${this.agentId} is paused`
      });
    }
    if (this.state === "passive") {
      throw new AgentStoreSyncError({
        code: "lock_held_by_other",
        message: `Agent store engine for ${this.agentId} lock is held by another holder`
      });
    }
    if (this.lockProvider !== void 0 && this.lockHandle === void 0) {
      throw new AgentStoreSyncError({
        code: "lock_held_by_other",
        message: `Agent store engine for ${this.agentId} does not hold the write lock`
      });
    }
  }
  scheduleRound(kind, body) {
    return __awaiter16(this, void 0, void 0, function* () {
      this.assertRoundAuthorized();
      let round;
      yield this.serialize(() => __awaiter16(this, void 0, void 0, function* () {
        this.assertRoundAuthorized();
        if (this.roundChainAbandoned) {
          if (this.orphanedRounds.size > 0 || this.inFlightRounds.size > 0) {
            throw new AgentStoreSyncError({
              code: "round_aborted",
              message: "previous sync round still draining after watchdog abandon"
            });
          }
          this.roundChainAbandoned = false;
        }
        round = this.roundScheduler.enqueue(kind, (signal) => __awaiter16(this, void 0, void 0, function* () {
          this.activeRoundLane = kind;
          const running = body(signal);
          const tracked = running.then(noop2, noop2);
          this.inFlightRounds.add(tracked);
          try {
            return yield running;
          } finally {
            this.inFlightRounds.delete(tracked);
          }
        }));
      }));
      try {
        return yield round;
      } finally {
        if (this.pendingLockLost) {
          this.pendingLockLost = false;
          if (this.shouldRelinquishLockLost()) {
            yield this.relinquishLock("lock_lost");
          } else {
            this.lockOwnershipCheckedAtMs = 0;
            this.lockOwnershipCached = true;
          }
        }
      }
    });
  }
  /**
   * Unjam the round scheduler after the session watchdog abandons a wedged
   * round. Detaches the orphan from the pause/dispose drain set so teardown
   * cannot hang, while follow-up `forceSync` calls fail fast until the
   * orphan settles — never start a parallel `runSyncRound` body.
   */
  releaseWedgedRoundChain() {
    this.roundChainAbandoned = true;
    this.roundScheduler.abandonInFlight();
    for (const tracked of this.inFlightRounds) {
      this.orphanedRounds.add(tracked);
      void tracked.finally(() => {
        this.orphanedRounds.delete(tracked);
        if (this.orphanedRounds.size === 0 && this.state === "passive" && !this.disposed && !this.closing) {
          void this.unpause().catch(() => {
          });
        }
      });
    }
    this.inFlightRounds.clear();
  }
  /**
   * True when a watchdog/resume abandon left work detached from the normal
   * drain set. Session teardown uses this so `close()` still bounds dispose
   * even after the session-level `syncing` promise has already cleared.
   */
  hasAbandonedInFlightRounds() {
    return this.orphanedRounds.size > 0;
  }
  /**
   * True when a round is still tracked in the normal drain set or detached as
   * an orphan — i.e. there is real in-flight or abandoned round work. Resume
   * recovery uses this to avoid stopping the heartbeat (and deferring the
   * unlock) on an idle close that raced a resume with nothing actually wedged.
   */
  hasLiveRoundWork() {
    return this.inFlightRounds.size > 0 || this.orphanedRounds.size > 0;
  }
  /**
   * True when a round is still tracked in the normal drain set (i.e. not yet
   * abandoned as an orphan). Session teardown uses this to give an engine-owned
   * path-scoped `syncPaths` push — which the session's `syncing` promise does
   * not track — the same bounded-abort / unjam treatment as the full round.
   */
  hasInFlightRounds() {
    return this.inFlightRounds.size > 0;
  }
  /**
   * Resolves when no abandoned (orphaned) rounds remain. Resolves immediately
   * when already idle. Used by session teardown to stop bounding dispose once
   * orphans drain so a legitimate final flush is not truncated.
   */
  whenAbandonedInFlightRoundsIdle() {
    if (this.orphanedRounds.size === 0) {
      return Promise.resolve();
    }
    return Promise.allSettled([...this.orphanedRounds]).then(() => this.whenAbandonedInFlightRoundsIdle());
  }
  /** Rejects the round with `round_aborted` if the active signal has fired. */
  throwIfRoundAborted(relPath) {
    const signal = this.activeRoundSignal;
    if ((signal === null || signal === void 0 ? void 0 : signal.aborted) === true) {
      throwForAbortedRoundSignal(relPath, signal.reason);
    }
  }
  /**
   * Rejects with `round_aborted` when `signal` has already fired, before the
   * round is scheduled or its signal published. Lets a pre-aborted round win
   * over `scheduleRound`'s paused/passive/lockless authorization rejections.
   */
  throwIfSignalAborted(signal) {
    if ((signal === null || signal === void 0 ? void 0 : signal.aborted) === true) {
      throwForAbortedRoundSignal(void 0, signal.reason);
    }
  }
  /**
   * True when `error` should be surfaced as a round abort: it already is one,
   * or it is an abort-shaped error raised while the round signal is firing.
   */
  isRoundAbortError(error41) {
    var _a19;
    if (error41 instanceof AgentStoreSyncError) {
      return error41.code === "round_aborted";
    }
    if (((_a19 = this.activeRoundSignal) === null || _a19 === void 0 ? void 0 : _a19.aborted) !== true) {
      return false;
    }
    if (error41 instanceof ConnectError && (error41.code === Code.DeadlineExceeded || error41.code === Code.Canceled)) {
      return true;
    }
    return error41 instanceof Error && (error41.name === "AbortError" || error41.name === "TimeoutError");
  }
  /**
   * Re-throws `error` as a `round_aborted` error when it is (or was caused
   * by) the round abort, so per-file catch blocks propagate the abort
   * instead of recording it as an ordinary upload/download failure. No-op
   * for unrelated errors.
   */
  rethrowIfRoundAbort(error41, relPath) {
    var _a19;
    var _b2;
    if (isSyncRoundStoodAsideError(error41)) {
      throw error41;
    }
    if (!this.isRoundAbortError(error41)) {
      return;
    }
    if (error41 instanceof AgentStoreSyncError && error41.code === "round_aborted") {
      throw error41;
    }
    throwForAbortedRoundSignal(relPath, (_b2 = (_a19 = this.activeRoundSignal) === null || _a19 === void 0 ? void 0 : _a19.reason) !== null && _b2 !== void 0 ? _b2 : error41);
  }
  /** Lock steal must fail the round, not become a soft per-file summary error. */
  rethrowIfLockLost(error41) {
    if (error41 instanceof AgentStoreSyncError && error41.code === "lock_held_by_other") {
      throw error41;
    }
  }
  runSyncRound() {
    return __awaiter16(this, arguments, void 0, function* (options2 = {}) {
      return yield this.withPublishedRoundSignal(options2.signal, () => this.runSyncRoundBody(options2));
    });
  }
  /**
   * Publishes an engine-owned {@link activeRoundSignal} for the lifetime of a
   * round body. The owned signal fires when `callerSignal` fires (its abort
   * reason is forwarded so `round_aborted` propagates unchanged) OR when
   * {@link abortActiveRound} is called. Rounds are serialized on
   * `roundMutation`, so a single owned controller is sufficient; the
   * save/restore keeps a nested final-flush round from clobbering it.
   */
  withPublishedRoundSignal(callerSignal, body) {
    return __awaiter16(this, void 0, void 0, function* () {
      const owned = new AbortController();
      let cleanupForward;
      if (callerSignal !== void 0) {
        if (callerSignal.aborted) {
          owned.abort(callerSignal.reason);
        } else {
          const forward = () => owned.abort(callerSignal.reason);
          callerSignal.addEventListener("abort", forward, { once: true });
          cleanupForward = () => callerSignal.removeEventListener("abort", forward);
        }
      }
      const previousRoundSignal = this.activeRoundSignal;
      const previousRoundAbort = this.activeRoundAbort;
      this.activeRoundSignal = owned.signal;
      this.activeRoundAbort = owned;
      try {
        return yield body();
      } finally {
        this.activeRoundSignal = previousRoundSignal;
        this.activeRoundAbort = previousRoundAbort;
        cleanupForward === null || cleanupForward === void 0 ? void 0 : cleanupForward();
      }
    });
  }
  /**
   * Abort the round body currently executing (full or path-scoped). The
   * session's resume recovery calls this so work stuck on a dead post-suspend
   * socket is cancelled cooperatively — notably a path-scoped `syncPaths`
   * push, which carries no caller-supplied signal. No-op when no body is in
   * flight.
   */
  abortActiveRound(reason) {
    var _a19;
    (_a19 = this.activeRoundAbort) === null || _a19 === void 0 ? void 0 : _a19.abort(reason);
  }
  /**
   * Await the currently tracked in-flight round bodies. Resolves once
   * cooperatively-aborted work drains; a body that ignores its abort keeps
   * this pending, so callers must bound the wait and fall back to
   * {@link releaseWedgedRoundChain}.
   */
  awaitInFlightRoundsSettled() {
    return __awaiter16(this, void 0, void 0, function* () {
      yield this.drainInFlightRounds();
    });
  }
  runSyncRoundBody() {
    return __awaiter16(this, arguments, void 0, function* (options2 = {}) {
      if (options2.finalFlush) {
        if (this.lockProvider !== void 0 && this.lockHandle === void 0) {
          return emptySummary();
        }
      } else if (!this.syncRoundStillAuthorized()) {
        this.throwIfRoundAborted();
        return emptySummary();
      } else {
        yield this.assertRoundStillOwnsLock();
      }
      this.throwIfRoundAborted();
      const start = this.monotonicNow();
      const summary = emptySummary();
      let restoreOnlyRound = false;
      const allowIdentityRecovery = this.syncMode !== "readOnly";
      if (allowIdentityRecovery && this.isDeletionArmed() && !this.recoveryDisarmed) {
        const rootIdentity = this.checkRecordedFilesRootIdentity();
        if (rootIdentity === "compromised") {
          if (!this.prepareIdentityRecovery(summary)) {
            summary.durationMs = this.monotonicNow() - start;
            return summary;
          }
          restoreOnlyRound = true;
        } else if (rootIdentity === "unreadable") {
          summary.errors.push({
            relPath: void 0,
            code: "fs_read_failed",
            message: `Agent store files root temporarily unreadable; deletion journal retained`
          });
          summary.durationMs = this.monotonicNow() - start;
          return summary;
        }
      }
      if (!this.tryRemoveObstructingFilesRoot(summary)) {
        summary.durationMs = this.monotonicNow() - start;
        return summary;
      }
      this.ensureDirsExist();
      let identityAtStart = this.probeFilesRootIdentity();
      if (!restoreOnlyRound) {
        yield this.pushAll(summary);
        if (summary.identityRecoveryWipeFailed) {
          summary.durationMs = this.monotonicNow() - start;
          return summary;
        }
        if (summary.recoveryDisarms > 0) {
          restoreOnlyRound = true;
          this.ensureDirsExist();
          identityAtStart = this.probeFilesRootIdentity();
        }
      }
      this.throwIfRoundAborted();
      yield this.pullAll(summary);
      let identityAtEnd = this.probeFilesRootIdentity();
      const midRoundCompromised = filesRootIdentityCompromisedDuringRound({
        start: identityAtStart,
        end: identityAtEnd
      });
      if (allowIdentityRecovery && midRoundCompromised && summary.recoveryDisarms === 0 && this.isDeletionArmed() && !this.recoveryDisarmed) {
        if (!this.prepareIdentityRecovery(summary)) {
          summary.durationMs = this.monotonicNow() - start;
          return summary;
        }
        restoreOnlyRound = true;
        this.ensureDirsExist();
        const restorePull = yield this.pullAllWithFollowUpWipe(summary);
        if (!restorePull) {
          summary.durationMs = this.monotonicNow() - start;
          return summary;
        }
        identityAtEnd = this.probeFilesRootIdentity();
      } else if (allowIdentityRecovery && midRoundCompromised && (restoreOnlyRound || summary.recoveryDisarms > 0)) {
        if (!this.clearCompromisedFilesRoot(summary)) {
          summary.durationMs = this.monotonicNow() - start;
          return summary;
        }
        this.ensureDirsExist();
        const restorePull = yield this.pullAllWithFollowUpWipe(summary);
        if (!restorePull) {
          summary.durationMs = this.monotonicNow() - start;
          return summary;
        }
        identityAtEnd = this.probeFilesRootIdentity();
      }
      if (!midRoundCompromised && summary.recoveryDisarms === 0) {
        this.maybeArmDeletionDetection({
          summary,
          filesRootIdentity: identityAtEnd
        });
      }
      summary.durationMs = this.monotonicNow() - start;
      return summary;
    });
  }
  runSyncPaths(relPaths, signal) {
    return __awaiter16(this, void 0, void 0, function* () {
      return yield this.withPublishedRoundSignal(signal, () => this.runSyncPathsBody(relPaths, signal));
    });
  }
  runSyncPathsBody(relPaths, signal) {
    return __awaiter16(this, void 0, void 0, function* () {
      if (!this.syncRoundStillAuthorized()) {
        this.throwIfRoundAborted();
        return emptySummary("path");
      }
      yield this.assertRoundStillOwnsLock();
      const start = this.monotonicNow();
      const summary = emptySummary("path");
      this.throwIfRoundAborted();
      if (this.syncMode !== "readOnly" && this.isDeletionArmed() && !this.recoveryDisarmed) {
        const rootIdentity = this.checkRecordedFilesRootIdentity();
        if (rootIdentity === "compromised") {
          if (!this.prepareIdentityRecovery(summary)) {
            summary.durationMs = this.monotonicNow() - start;
            return summary;
          }
          this.ensureDirsExist();
          yield this.pullAllWithFollowUpWipe(summary);
          summary.durationMs = this.monotonicNow() - start;
          return summary;
        }
        if (rootIdentity === "unreadable") {
          summary.errors.push({
            relPath: void 0,
            code: "fs_read_failed",
            message: `Agent store files root temporarily unreadable; deletion journal retained`
          });
          summary.durationMs = this.monotonicNow() - start;
          return summary;
        }
      }
      if (!this.tryRemoveObstructingFilesRoot(summary)) {
        summary.durationMs = this.monotonicNow() - start;
        return summary;
      }
      this.ensureDirsExist();
      if (this.syncMode === "readOnly") {
        this.stripJournaledPendingConflictMirrors();
        this.roundJournaledConflictEmits = [];
        this.flushPendingConflictJournalEmits();
        this.stripJournaledPendingConflictMirrors();
        summary.durationMs = this.monotonicNow() - start;
        return summary;
      }
      this.stripJournaledPendingConflictMirrors();
      this.roundJournaledConflictEmits = [];
      this.flushPendingConflictJournalEmits();
      try {
        yield this.pushPathsBody(relPaths, summary, signal);
      } finally {
        this.stripJournaledPendingConflictMirrors();
      }
      summary.durationMs = this.monotonicNow() - start;
      return summary;
    });
  }
  pushPathsBody(relPaths, summary, signal) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19, _b2;
      const scopedRelPaths = /* @__PURE__ */ new Set();
      const scopedRefusals = [];
      const candidates = [];
      const caseCollisionKeys = /* @__PURE__ */ new Map();
      for (const rawRelPath of relPaths) {
        let relPath;
        try {
          relPath = normalizeRelPath(rawRelPath);
        } catch (error41) {
          summary.refusals++;
          summary.errors.push({
            relPath: rawRelPath,
            code: "not_regular_file",
            message: error41 instanceof Error ? error41.message : `Unsafe path: ${rawRelPath}`
          });
          continue;
        }
        if (scopedRelPaths.has(relPath)) {
          continue;
        }
        scopedRelPaths.add(relPath);
        if (isReservedRelPath(relPath)) {
          summary.reservedPathsSkipped = ((_a19 = summary.reservedPathsSkipped) !== null && _a19 !== void 0 ? _a19 : 0) + 1;
          continue;
        }
        let statResult;
        try {
          statResult = safeStatChild({ base: this.filesDir, relPath });
        } catch (error41) {
          if (error41 instanceof UnsafeAgentStorePathError) {
            summary.refusals++;
            summary.errors.push({
              relPath,
              code: error41.code === "symlink_refused" ? "symlink_refused" : "not_regular_file",
              message: error41.message
            });
            continue;
          }
          summary.errors.push({
            relPath,
            code: "fs_read_failed",
            message: error41 instanceof Error ? error41.message : String(error41)
          });
          continue;
        }
        if (statResult.kind === "absent") {
          continue;
        }
        if (statResult.kind === "refused") {
          scopedRefusals.push(statResult.refusal);
          summary.refusals++;
          summary.errors.push({
            relPath: statResult.refusal.relPath,
            code: statResult.refusal.reason,
            message: `Skipped ${statResult.refusal.relPath} (${statResult.refusal.reason})`
          });
          continue;
        }
        const collisionKey = relPath.toLowerCase();
        const previous = caseCollisionKeys.get(collisionKey);
        if (previous !== void 0 && previous !== relPath) {
          summary.errors.push({
            relPath,
            code: "case_collision",
            message: `Agent store has case-colliding paths: ${previous} and ${relPath}`
          });
          continue;
        }
        caseCollisionKeys.set(collisionKey, relPath);
        const entry = statResult.entry;
        if (entry.size > this.maxFileSizeBytes) {
          summary.errors.push({
            relPath,
            code: "file_too_large",
            message: `File ${relPath} (${entry.size} bytes) exceeds the ${this.maxFileSizeBytes}-byte cap`
          });
          continue;
        }
        candidates.push({
          relPath,
          absPath: entry.absPath,
          size: entry.size,
          mtimeMs: entry.mtimeMs,
          dev: entry.dev,
          ino: entry.ino,
          existing: this.index.getFile(relPath)
        });
      }
      const hashStart = this.monotonicNow();
      const hashed = yield Promise.all(candidates.map((candidate) => this.runQueued(this.queues.hash, () => {
        this.throwIfRoundAborted(candidate.relPath);
        return this.hashCandidate(candidate);
      })));
      summary.hashMs = ((_b2 = summary.hashMs) !== null && _b2 !== void 0 ? _b2 : 0) + (this.monotonicNow() - hashStart);
      this.throwIfRoundAborted();
      const toUpload = this.selectUploadable(hashed, summary);
      yield this.uploadHashedCandidates(toUpload, summary, {
        preferProbeForLegacy: true,
        signal
      });
      this.throwIfRoundAborted();
      yield this.flushPendingDeletes({
        summary,
        presentRelPaths: new Set(candidates.map((candidate) => candidate.relPath)),
        refusals: scopedRefusals,
        scopeRelPaths: scopedRelPaths
      });
    });
  }
  /**
   * Arms scan-based deletion detection at the end of a fully-successful
   * round: zero errors/refusals AND a listing the transport vouched was
   * complete. Records the caller-supplied stable `files/` root identity
   * (dev/ino); a later root recreation trips the identity guard into
   * recovery instead of deleting. Also how a recovery-disarmed store
   * re-arms — the recovery round restores the mirror, and the next clean
   * round records a fresh identity.
   */
  maybeArmDeletionDetection(args) {
    const { summary, filesRootIdentity } = args;
    if (this.syncMode === "readOnly") {
      return;
    }
    if (summary.recoveryDisarms > 0) {
      return;
    }
    if (summary.errors.length > 0 || summary.refusals > 0) {
      return;
    }
    if (!this.lastPullListingComplete) {
      return;
    }
    if (filesRootIdentity.kind !== "present") {
      return;
    }
    this.index.armDeletionWithIdentity(filesRootIdentity.identity);
    this.recoveryDisarmed = false;
  }
  /**
   * Recursively removes a compromised `files/` tree so recovery pull rebuilds
   * from server truth. ENOENT is success; other errors are recorded and
   * return false.
   */
  clearCompromisedFilesRoot(summary) {
    try {
      fs8.rmSync(this.filesDir, { recursive: true, force: true });
      return true;
    } catch (error41) {
      if (isNodeError4(error41) && error41.code === "ENOENT") {
        return true;
      }
      summary.errors.push({
        relPath: void 0,
        code: "fs_write_failed",
        message: `Failed to clear compromised agent store files root: ${error41 instanceof Error ? error41.message : String(error41)}`
      });
      return false;
    }
  }
  /**
   * Clears obstruction + compromised tree, then disarms. Order matters: never
   * disarm if the wipe fails (would leave an unrestorable half-cleared store).
   */
  prepareIdentityRecovery(summary) {
    if (!this.tryRemoveObstructingFilesRoot(summary)) {
      return false;
    }
    if (!this.clearCompromisedFilesRoot(summary)) {
      return false;
    }
    this.enterDeletionRecovery(summary);
    return true;
  }
  /**
   * Pull, then wipe+re-pull once if `files/` identity flips during the pull
   * (tmp-cleaner swap mid-restore). Returns false when a wipe fails.
   */
  pullAllWithFollowUpWipe(summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      const identityBefore = this.probeFilesRootIdentity();
      yield this.pullAll(summary);
      const identityAfter = this.probeFilesRootIdentity();
      if (!filesRootIdentityCompromisedDuringRound({
        start: identityBefore,
        end: identityAfter
      })) {
        return true;
      }
      if (!this.clearCompromisedFilesRoot(summary)) {
        return false;
      }
      this.ensureDirsExist();
      yield this.pullAll(summary);
      return true;
    });
  }
  /**
   * Removes a non-directory (file or symlink) at `files/` so
   * `ensureDirsExist` can recreate a real directory and pull can restore.
   * Returns false (and records an error) when removal fails for a reason
   * other than absence — callers must not disarm until this succeeds.
   */
  tryRemoveObstructingFilesRoot(summary) {
    try {
      const stat28 = fs8.lstatSync(this.filesDir);
      if (!stat28.isDirectory() || stat28.isSymbolicLink()) {
        fs8.rmSync(this.filesDir, { recursive: true, force: true });
      }
      return true;
    } catch (error41) {
      if (isNodeError4(error41) && error41.code === "ENOENT") {
        return true;
      }
      summary.errors.push({
        relPath: void 0,
        code: "fs_write_failed",
        message: `Failed to clear obstructing agent store files root: ${error41 instanceof Error ? error41.message : String(error41)}`
      });
      return false;
    }
  }
  /** True when scan-based deletion is armed for this store. */
  isDeletionArmed() {
    return this.index.getMeta(DELETION_ARMED_META_KEY) === "1";
  }
  /** Live `files/` identity, or absent/unreadable (do not recover on the latter). */
  probeFilesRootIdentity() {
    try {
      const stat28 = fs8.lstatSync(this.filesDir);
      if (!stat28.isDirectory() || stat28.isSymbolicLink()) {
        return { kind: "absent" };
      }
      return { kind: "present", identity: { dev: stat28.dev, ino: stat28.ino } };
    } catch (error41) {
      if (isNodeError4(error41) && error41.code === "ENOENT") {
        return { kind: "absent" };
      }
      return { kind: "unreadable" };
    }
  }
  /** Unarm, clear pending deletes, and latch recovery until a clean round. */
  enterDeletionRecovery(summary) {
    this.index.disarmDeletionAndClearPending();
    this.recoveryDisarmed = true;
    summary.recoveryDisarms++;
  }
  /**
   * Journal bare local deletes for armed stores.
   * - `ok`: flush pending deletes and continue uploads
   * - `hold`: keep pending deletes; uploads may continue (unreadable root)
   * - `abort_uploads`: identity recovery (or failed wipe) — skip flush and
   *   do not upload this walk
   */
  detectScanDeletions(walk, summary) {
    if (this.syncMode === "readOnly") {
      return "ok";
    }
    if (this.lockProvider !== void 0 && this.lockHandle === void 0) {
      return "ok";
    }
    if (!this.isDeletionArmed() || this.recoveryDisarmed) {
      return "ok";
    }
    const rootIdentity = this.checkRecordedFilesRootIdentity();
    if (rootIdentity === "compromised") {
      if (!this.prepareIdentityRecovery(summary)) {
        summary.identityRecoveryWipeFailed = true;
        return "abort_uploads";
      }
      return "abort_uploads";
    }
    if (rootIdentity === "unreadable") {
      summary.errors.push({
        relPath: void 0,
        code: "fs_read_failed",
        message: `Agent store files root temporarily unreadable; pending deletes retained`
      });
      return "hold";
    }
    const presentPaths = new Set(walk.files.map((file2) => file2.relPath));
    for (const entry of this.index.listFiles()) {
      if (entry.state === "tombstoned") {
        continue;
      }
      if (isReservedRelPath(entry.relPath)) {
        continue;
      }
      if (presentPaths.has(entry.relPath)) {
        continue;
      }
      if (this.index.hasPendingDelete(entry.relPath)) {
        continue;
      }
      if (refusalCoversPath(walk.refusals, entry.relPath)) {
        continue;
      }
      if (entry.lastSeenEtag === void 0 || entry.lastSeenEtag.length === 0) {
        summary.legacyRowsRestored++;
        continue;
      }
      let absPath;
      try {
        absPath = resolveSafeChildPath({
          base: this.filesDir,
          relPath: entry.relPath
        });
      } catch (_a19) {
        continue;
      }
      try {
        fs8.lstatSync(absPath);
        continue;
      } catch (error41) {
        if (!isNodeError4(error41) || error41.code !== "ENOENT") {
          continue;
        }
      }
      this.index.upsertPendingDelete({
        relPath: entry.relPath,
        baseEtag: entry.lastSeenEtag,
        requestedAtMs: this.now(),
        mutationId: (0, import_node_crypto4.randomUUID)()
      });
      summary.scanDeletesJournaled++;
    }
    return "ok";
  }
  /** intact | compromised (recover) | unreadable (hold journal). */
  checkRecordedFilesRootIdentity() {
    const recordedDev = this.index.getMeta(FILES_ROOT_DEV_META_KEY);
    const recordedIno = this.index.getMeta(FILES_ROOT_INO_META_KEY);
    if (recordedDev === void 0 || recordedIno === void 0) {
      return "compromised";
    }
    const probe = this.probeFilesRootIdentity();
    switch (probe.kind) {
      case "unreadable":
        return "unreadable";
      case "absent":
        return "compromised";
      case "present":
        return String(probe.identity.dev) === recordedDev && String(probe.identity.ino) === recordedIno ? "intact" : "compromised";
      default: {
        const _exhaustive = probe;
        throw new Error(`unexpected files root probe: ${_exhaustive}`);
      }
    }
  }
  syncRoundStillAuthorized() {
    if (this.disposed) {
      return false;
    }
    if (this.state !== "running") {
      return false;
    }
    if (this.lockProvider !== void 0 && this.lockHandle === void 0) {
      return false;
    }
    return true;
  }
  /**
   * Flushes the `pending_deletes` journal as batched conditional server
   * deletes. A pending row is cancelled instead of sent when any of these
   * hold — last op wins, and we never delete a path we cannot currently
   * vouch is gone:
   *  - the path reappeared in this round's walk (`presentRelPaths`),
   *  - the path is under a walk refusal (`refusals`): the subtree is
   *    unobservable, so absence is not deletion intent,
   *  - a direct `lstat` shows the path back on disk (recreated between the
   *    scan and the flush; anything other than ENOENT is not deletion).
   * Every sent entry is individually etag-guarded (`baseEtag` from the row's
   * last-seen etag); the server refuses deletes over newer content with a
   * semantic `conflict` outcome. RPC failures keep the journal intact for
   * the next round.
   */
  flushPendingDeletes(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      var _b2, _c2, _d;
      const { summary, presentRelPaths, refusals = [], scopeRelPaths } = args;
      const pending = scopeRelPaths === void 0 ? this.index.listPendingDeletes() : this.index.listPendingDeletes().filter((entry) => scopeRelPaths.has(entry.relPath));
      if (pending.length === 0) {
        yield this.flushPendingRmdirs({
          summary,
          ackedDeletePaths: [],
          refusals,
          presentRelPaths,
          scopeRelPaths
        });
        return;
      }
      const toDelete = [];
      for (const entry of pending) {
        if (isReservedRelPath(entry.relPath)) {
          this.index.removePendingDelete(entry.relPath);
          continue;
        }
        if (presentRelPaths.has(entry.relPath)) {
          this.index.removePendingDelete(entry.relPath);
          continue;
        }
        if (refusalCoversPath(refusals, entry.relPath)) {
          this.index.removePendingDelete(entry.relPath);
          continue;
        }
        let absPath;
        try {
          absPath = resolveSafeChildPath({
            base: this.filesDir,
            relPath: entry.relPath
          });
        } catch (_e2) {
          this.index.removePendingDelete(entry.relPath);
          continue;
        }
        try {
          fs8.lstatSync(absPath);
          this.index.removePendingDelete(entry.relPath);
          continue;
        } catch (error41) {
          if (!isNodeError4(error41) || error41.code !== "ENOENT") {
            this.index.removePendingDelete(entry.relPath);
            summary.errors.push({
              relPath: entry.relPath,
              code: "delete_failed",
              message: error41 instanceof Error ? error41.message : String(error41)
            });
            continue;
          }
        }
        toDelete.push(entry);
      }
      if (toDelete.length === 0) {
        yield this.flushPendingRmdirs({
          summary,
          ackedDeletePaths: [],
          refusals,
          presentRelPaths,
          scopeRelPaths
        });
        return;
      }
      const deleteFiles = (_a19 = this.client.deleteFiles) === null || _a19 === void 0 ? void 0 : _a19.bind(this.client);
      if (deleteFiles === void 0) {
        summary.errors.push({
          relPath: void 0,
          code: "delete_failed",
          message: `Agent store client for ${this.agentId} does not support deleteFiles; ${toDelete.length} pending delete(s) deferred`
        });
        yield this.flushPendingRmdirs({
          summary,
          ackedDeletePaths: [],
          refusals,
          presentRelPaths,
          scopeRelPaths
        });
        return;
      }
      const ackedDeletePaths = [];
      for (let offset = 0; offset < toDelete.length; offset += DELETE_FLUSH_BATCH_SIZE) {
        const batch = toDelete.slice(offset, offset + DELETE_FLUSH_BATCH_SIZE);
        let outcomes;
        yield this.assertRoundStillOwnsLock();
        try {
          outcomes = yield this.runQueued(this.queues.presign, () => deleteFiles({
            agentId: this.agentId,
            files: batch.map((entry) => Object.assign({ relPath: entry.relPath, baseEtag: entry.baseEtag }, entry.mutationId !== void 0 ? { mutationId: entry.mutationId } : {})),
            signal: this.activeRoundSignal
          }));
        } catch (error41) {
          this.rethrowIfRoundAbort(error41);
          summary.errors.push({
            relPath: void 0,
            code: "delete_failed",
            message: `Failed to delete ${toDelete.length - offset} agent store file(s): ${error41 instanceof Error ? error41.message : String(error41)}`
          });
          yield this.flushPendingRmdirs({
            summary,
            ackedDeletePaths,
            refusals,
            presentRelPaths,
            scopeRelPaths
          });
          return;
        }
        const outcomeByPath = new Map(outcomes.map((outcome) => [outcome.relPath, outcome]));
        for (const entry of batch) {
          const outcome = outcomeByPath.get(entry.relPath);
          if (outcome === void 0) {
            summary.errors.push({
              relPath: entry.relPath,
              code: "delete_failed",
              message: `Server returned no delete outcome for ${entry.relPath}`
            });
            continue;
          }
          this.index.removePendingDelete(entry.relPath);
          switch (outcome.status) {
            case "deleted":
            case "already_deleted": {
              const tombstoneEtag = outcome.tombstoneEtag;
              if (tombstoneEtag !== void 0 && tombstoneEtag.length > 0) {
                const existing = this.index.getFile(entry.relPath);
                this.index.upsertFile(Object.assign(Object.assign({ relPath: entry.relPath, lastSyncedSha: (_b2 = existing === null || existing === void 0 ? void 0 : existing.lastSyncedSha) !== null && _b2 !== void 0 ? _b2 : "" }, (existing === null || existing === void 0 ? void 0 : existing.lastSeenEtag) !== void 0 ? { lastSeenEtag: existing.lastSeenEtag } : {}), { size: (_c2 = existing === null || existing === void 0 ? void 0 : existing.size) !== null && _c2 !== void 0 ? _c2 : 0, lastSyncedMs: this.now(), direction: (_d = existing === null || existing === void 0 ? void 0 : existing.direction) !== null && _d !== void 0 ? _d : "pushed", state: "tombstoned", tombstoneEtag, deletedAtMs: this.now() }));
              } else {
                this.index.deleteFile(entry.relPath);
              }
              summary.filesDeletedRemote++;
              ackedDeletePaths.push(entry.relPath);
              break;
            }
            case "conflict":
              summary.deleteConflicts++;
              break;
          }
        }
      }
      yield this.flushPendingRmdirs({
        summary,
        ackedDeletePaths,
        refusals,
        presentRelPaths,
        scopeRelPaths
      });
    });
  }
  /**
   * After acked file deletes, `lstat` each parent; only `ENOENT` is rmdir
   * intent. Walks up until a directory still exists or the server returns
   * not-empty. Journaled before the RPC so a crash mid-chain resumes.
   */
  flushPendingRmdirs(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      var _b2;
      const { summary, ackedDeletePaths, refusals, presentRelPaths } = args;
      const candidates = /* @__PURE__ */ new Set();
      for (const relPath of ackedDeletePaths) {
        const parent = parentRelPath(relPath);
        if (parent !== void 0 && parent !== "") {
          candidates.add(parent);
        }
      }
      for (const entry of this.index.listPendingRmdirs()) {
        if (args.scopeRelPaths !== void 0 && !relPathIsInScope(entry.relPath, args.scopeRelPaths)) {
          continue;
        }
        candidates.add(entry.relPath);
      }
      if (candidates.size === 0) {
        return;
      }
      const rmdir = (_a19 = this.client.rmdir) === null || _a19 === void 0 ? void 0 : _a19.bind(this.client);
      const dropSkipped = (dir) => {
        if (this.index.hasLiveDescendantFiles(dir) || presentRelPathsHasDescendant(presentRelPaths, dir)) {
          this.index.removePendingRmdir(dir);
          return true;
        }
        if (refusalCoversPath(refusals, dir)) {
          this.index.removePendingRmdir(dir);
          return true;
        }
        return false;
      };
      if (rmdir === void 0) {
        for (const dir of candidates) {
          if (dropSkipped(dir)) {
            continue;
          }
          if (!this.hasPendingDeletesUnder(dir) && !this.index.hasPendingRmdir(dir)) {
            this.index.upsertPendingRmdir({
              relPath: dir,
              requestedAtMs: this.now()
            });
          }
        }
        return;
      }
      for (const dir of candidates) {
        if (dropSkipped(dir)) {
          continue;
        }
        this.index.upsertPendingRmdir({
          relPath: dir,
          requestedAtMs: this.now()
        });
      }
      const queue = [...candidates].sort(compareRelPathDepthDesc);
      const seen = /* @__PURE__ */ new Set();
      let rmdirAttempts = 0;
      while (queue.length > 0) {
        const dir = queue.shift();
        if (dir === "" || seen.has(dir)) {
          continue;
        }
        seen.add(dir);
        if (relPathDepth(dir) > MAX_RMDIR_CHAIN_DEPTH) {
          this.index.removePendingRmdir(dir);
          const parent2 = parentRelPath(dir);
          if (parent2 !== void 0 && parent2 !== "" && !seen.has(parent2)) {
            this.index.upsertPendingRmdir({
              relPath: parent2,
              requestedAtMs: this.now()
            });
            queue.push(parent2);
            queue.sort(compareRelPathDepthDesc);
          }
          continue;
        }
        if (this.hasPendingDeletesUnder(dir)) {
          continue;
        }
        if (dropSkipped(dir)) {
          continue;
        }
        let dirStat;
        try {
          dirStat = safeLstatDirectory({
            base: this.filesDir,
            relPath: dir
          });
        } catch (error41) {
          if (error41 instanceof UnsafeAgentStorePathError) {
            this.index.removePendingRmdir(dir);
            continue;
          }
          if (!isNodeError4(error41) || error41.code !== "ENOENT") {
            continue;
          }
          dirStat = { kind: "absent" };
        }
        if (dirStat.kind === "refused") {
          const reusedName = dirStat.refusal.relPath === dir && dirStat.refusal.reason === "not_regular_file";
          if (!reusedName) {
            this.index.removePendingRmdir(dir);
            continue;
          }
        }
        if (dirStat.kind === "directory") {
          continue;
        }
        if (rmdirAttempts >= RMDIR_FLUSH_MAX_PER_ROUND) {
          break;
        }
        this.index.upsertPendingRmdir({
          relPath: dir,
          requestedAtMs: this.now()
        });
        yield this.assertRoundStillOwnsLock();
        rmdirAttempts += 1;
        try {
          yield this.runQueued(this.queues.presign, () => rmdir({
            agentId: this.agentId,
            relPath: dir,
            signal: this.activeRoundSignal
          }));
        } catch (error41) {
          this.rethrowIfRoundAbort(error41);
          if (error41 instanceof AgentStoreDirectoryNotEmptyError) {
            this.index.removePendingRmdir(dir);
            let ancestor = parentRelPath(dir);
            while (ancestor !== void 0 && ancestor !== "") {
              this.index.removePendingRmdir(ancestor);
              seen.add(ancestor);
              ancestor = parentRelPath(ancestor);
            }
            continue;
          }
          summary.errors.push({
            relPath: dir,
            code: "delete_failed",
            message: `Failed to rmdir ${dir}: ${error41 instanceof Error ? error41.message : String(error41)}`
          });
          return;
        }
        this.index.removePendingRmdir(dir);
        summary.rmdirPushed = ((_b2 = summary.rmdirPushed) !== null && _b2 !== void 0 ? _b2 : 0) + 1;
        const parent = parentRelPath(dir);
        if (parent !== void 0 && parent !== "" && !seen.has(parent)) {
          this.index.upsertPendingRmdir({
            relPath: parent,
            requestedAtMs: this.now()
          });
          queue.push(parent);
          queue.sort(compareRelPathDepthDesc);
        }
      }
    });
  }
  hasPendingDeletesUnder(dir) {
    return this.index.hasPendingDeletesUnder(dir);
  }
  hasLiveIndexRowsUnder(dir) {
    return this.index.hasLiveFilesUnder(dir);
  }
  pushAll() {
    return __awaiter16(this, arguments, void 0, function* (summary = emptySummary()) {
      this.ensureDirsExist();
      this.stripJournaledPendingConflictMirrors();
      this.roundJournaledConflictEmits = [];
      this.flushPendingConflictJournalEmits();
      try {
        return yield this.pushAllBody(summary);
      } finally {
        this.stripJournaledPendingConflictMirrors();
      }
    });
  }
  pushAllBody(summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      const walk = safeWalk(this.filesDir);
      summary.reservedPathsSkipped = ((_a19 = summary.reservedPathsSkipped) !== null && _a19 !== void 0 ? _a19 : 0) + partitionReservedWalkFiles(walk);
      const scanOutcome = this.detectScanDeletions(walk, summary);
      if (this.syncMode === "readOnly") {
        for (const entry of this.index.listPendingDeletes()) {
          this.index.removePendingDelete(entry.relPath);
        }
        for (const entry of this.index.listPendingRmdirs()) {
          this.index.removePendingRmdir(entry.relPath);
        }
      } else if (scanOutcome === "ok") {
        yield this.flushPendingDeletes({
          summary,
          presentRelPaths: new Set(walk.files.map((file2) => file2.relPath)),
          refusals: walk.refusals
        });
      }
      if (this.syncMode === "readOnly" || scanOutcome === "abort_uploads" || summary.recoveryDisarms > 0) {
        return summary;
      }
      for (const refusal of walk.refusals) {
        summary.refusals++;
        summary.errors.push({
          relPath: refusal.relPath,
          code: refusal.reason,
          message: `Skipped ${refusal.relPath} (${refusal.reason})`
        });
      }
      const indexed = /* @__PURE__ */ new Map();
      for (const entry of this.index.listFiles()) {
        indexed.set(entry.relPath, entry);
      }
      const candidates = [];
      const caseCollisionKeys = /* @__PURE__ */ new Map();
      for (const file2 of walk.files) {
        const collisionKey = file2.relPath.toLowerCase();
        const previous = caseCollisionKeys.get(collisionKey);
        if (previous !== void 0 && previous !== file2.relPath) {
          summary.errors.push({
            relPath: file2.relPath,
            code: "case_collision",
            message: `Agent store has case-colliding paths: ${previous} and ${file2.relPath}`
          });
          continue;
        }
        caseCollisionKeys.set(collisionKey, file2.relPath);
        if (file2.size > this.maxFileSizeBytes) {
          summary.errors.push({
            relPath: file2.relPath,
            code: "file_too_large",
            message: `File ${file2.relPath} (${file2.size} bytes) exceeds the ${this.maxFileSizeBytes}-byte cap`
          });
          continue;
        }
        candidates.push({
          relPath: file2.relPath,
          absPath: file2.absPath,
          size: file2.size,
          mtimeMs: file2.mtimeMs,
          dev: file2.dev,
          ino: file2.ino,
          existing: indexed.get(file2.relPath)
        });
      }
      const hashed = yield Promise.all(candidates.map((candidate) => this.queues.hash.enqueue(() => {
        this.throwIfRoundAborted(candidate.relPath);
        return this.hashCandidate(candidate);
      })));
      const toUpload = this.selectUploadable(hashed, summary);
      yield this.uploadHashedCandidates(toUpload, summary);
      return summary;
    });
  }
  /**
   * Filters hashed candidates down to the ones that must upload: records hash
   * errors, skips sha-identical non-tombstoned rows (refreshing their synced
   * time), and skips paths still parked from a prior terminal rejection.
   */
  selectUploadable(hashed, summary) {
    const toUpload = [];
    for (const result of hashed) {
      if (result.kind === "error") {
        summary.errors.push({
          relPath: result.relPath,
          code: result.code,
          message: result.message
        });
        continue;
      }
      if (result.existing !== void 0 && result.existing.state !== "tombstoned" && result.existing.lastSyncedSha === result.sha && result.existing.size === result.size) {
        summary.filesSkipped++;
        this.clearPushPark(result.relPath);
        this.index.upsertFile(Object.assign(Object.assign({}, result.existing), { lastSyncedMs: this.now() }));
        continue;
      }
      if (this.isPushParked(result.relPath)) {
        summary.pushEntriesParked++;
        continue;
      }
      toUpload.push(result);
    }
    return toUpload;
  }
  /**
   * Resolve preconditions → presign → conditional PUT → index bookkeeping for
   * an already-hashed, already-filtered set of candidates. Single-sourced
   * between the whole-store push and the path-scoped push; only the legacy
   * baseline strategy differs (`preferProbeForLegacy` probes each legacy row
   * instead of a whole-store listing). `options.signal` aborts between the
   * resolve/presign/upload phases (throws the signal's abort reason).
   */
  uploadHashedCandidates(toUpload_1, summary_1) {
    return __awaiter16(this, arguments, void 0, function* (toUpload, summary, options2 = {}) {
      if (toUpload.length === 0) {
        return;
      }
      const { preconditions: preconditionByPath, skippedDueToListingFailure } = yield this.resolvePushPreconditions(toUpload, summary, {
        preferProbeForLegacy: options2.preferProbeForLegacy
      });
      const uploadable = toUpload.filter((candidate) => !skippedDueToListingFailure.has(candidate.relPath));
      if (uploadable.length === 0) {
        return;
      }
      this.throwIfRoundAborted();
      for (let windowStart = 0; windowStart < uploadable.length; windowStart += this.multipartPresignWindowSize) {
        yield this.pushUploadWindow({
          candidates: uploadable.slice(windowStart, windowStart + this.multipartPresignWindowSize),
          preconditionByPath,
          summary,
          signal: options2.signal
        });
      }
    });
  }
  pushUploadWindow(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19, _b2;
      const toUpload = args.candidates;
      const preconditionByPath = args.preconditionByPath;
      const summary = args.summary;
      this.throwIfRoundAborted();
      yield this.assertRoundStillOwnsLock();
      let presigned;
      const presignStart = this.monotonicNow();
      try {
        presigned = yield this.runQueued(this.queues.presign, () => this.client.presignWrites({
          agentId: this.agentId,
          files: toUpload.map((candidate) => {
            const precondition = preconditionByPath.get(candidate.relPath);
            return Object.assign({ relPath: candidate.relPath, sha: candidate.sha, size: candidate.size }, precondition !== void 0 ? Object.assign({ multipartParts: candidate.multipartParts }, precondition) : {});
          }),
          signal: this.activeRoundSignal
        }));
      } catch (error41) {
        this.rethrowIfRoundAbort(error41);
        if (isAgentStoreSyncDisabledError(error41)) {
          throw error41;
        }
        if (!isAgentStoreConnectCode(error41, Code.FailedPrecondition) && !isAgentStoreConnectCode(error41, Code.InvalidArgument)) {
          throw error41;
        }
        const unconditional = toUpload.filter((candidate) => !preconditionByPath.has(candidate.relPath));
        const quota = parseAgentStoreQuotaExceeded(error41);
        const toPark = quota !== void 0 ? toUpload : unconditional.length > 0 ? unconditional : toUpload;
        for (const candidate of toPark) {
          if (quota !== void 0) {
            this.parkQuotaExceededEntry({
              relPath: candidate.relPath,
              absPath: candidate.absPath,
              summary,
              quota,
              message: agentStoreErrorSummaryMessage(error41, "Agent-store quota exceeded")
            });
          } else {
            this.parkPushEntry({
              relPath: candidate.relPath,
              summary,
              message: error41 instanceof Error ? error41.message : "Terminal push rejection from presignWrites"
            });
          }
        }
        return;
      }
      summary.presignMs = ((_a19 = summary.presignMs) !== null && _a19 !== void 0 ? _a19 : 0) + (this.monotonicNow() - presignStart);
      this.throwIfRoundAborted();
      const presignedByPath = /* @__PURE__ */ new Map();
      for (const presign of presigned) {
        let canonical;
        try {
          canonical = normalizeRelPath(presign.relPath);
        } catch (error41) {
          summary.errors.push({
            relPath: presign.relPath,
            code: "presign_response_mismatch",
            message: `Server returned an unsafe relPath: ${presign.relPath} (${error41 instanceof Error ? error41.message : String(error41)})`
          });
          continue;
        }
        presignedByPath.set(canonical, presign);
      }
      const multipartPaths = yield this.processMultipartWrites({
        candidates: toUpload,
        presignedByPath,
        preconditionByPath,
        summary
      });
      const uploadStart = this.monotonicNow();
      yield Promise.all(toUpload.map((candidate) => __awaiter16(this, void 0, void 0, function* () {
        yield this.assertRoundStillOwnsLock(candidate.relPath, {
          bypassCache: true
        });
        if (multipartPaths.has(candidate.relPath)) {
          return;
        }
        const presign = presignedByPath.get(candidate.relPath);
        if (presign === void 0) {
          summary.errors.push({
            relPath: candidate.relPath,
            code: "presign_response_mismatch",
            message: `Server returned no presigned URL for ${candidate.relPath}`
          });
          return;
        }
        if (presign.sha !== candidate.sha) {
          summary.errors.push({
            relPath: candidate.relPath,
            code: "presign_response_mismatch",
            message: `Presigned write sha mismatch for ${candidate.relPath} (got ${presign.sha}, expected ${candidate.sha})`
          });
          return;
        }
        const precondition = preconditionByPath.get(candidate.relPath);
        if (presignHasExpiredLockRedirect(presign, this.now())) {
          try {
            yield this.refreshAndCompleteLegacyWrite({
              candidate,
              precondition,
              summary
            });
          } catch (error41) {
            if (this.tryParkQuotaExceeded({
              relPath: candidate.relPath,
              absPath: candidate.absPath,
              summary,
              error: error41
            })) {
              return;
            }
            summary.errors.push(syncRoundErrorFor(candidate.relPath, error41));
          }
          return;
        }
        if (presignUsesConflictTarget(presign)) {
          if (precondition === void 0 || presign.conflict === void 0) {
            summary.errors.push({
              relPath: candidate.relPath,
              code: "presign_response_mismatch",
              message: `Conflict-directed write for ${candidate.relPath} did not include a conflict target and write precondition`
            });
            return;
          }
          try {
            yield this.handleWriteConflict({
              candidate,
              conflict: presign.conflict,
              precondition,
              summary,
              suppressIfRemoteIdentical: presign.primaryPreconditionFailed === true
            });
          } catch (error41) {
            this.rethrowIfRoundAbort(error41, candidate.relPath);
            this.rethrowIfLockLost(error41);
            if (this.tryParkQuotaExceeded({
              relPath: candidate.relPath,
              absPath: candidate.absPath,
              summary,
              error: error41
            })) {
              return;
            }
            this.emitConflictFallbackFailed({ candidate });
            summary.errors.push(syncRoundErrorFor(candidate.relPath, error41));
          }
          return;
        }
        if (presign.expiresAtMs <= this.now()) {
          try {
            yield this.refreshAndCompleteLegacyWrite({
              candidate,
              precondition,
              summary
            });
          } catch (error41) {
            if (this.tryParkQuotaExceeded({
              relPath: candidate.relPath,
              absPath: candidate.absPath,
              summary,
              error: error41
            })) {
              return;
            }
            summary.errors.push(syncRoundErrorFor(candidate.relPath, error41));
          }
          return;
        }
        const conflictProtectionDowngraded = precondition !== void 0 && presign.conflict === void 0;
        if (conflictProtectionDowngraded) {
          if (presignHasConditionalHeaders(presign)) {
            summary.errors.push({
              relPath: candidate.relPath,
              code: "presign_response_mismatch",
              message: `Presigned write for ${candidate.relPath} carries a conditional header but no conflict instruction`
            });
            return;
          }
        }
        try {
          const uploaded = yield this.uploadPrimaryWithConflictRetry(candidate, presign, summary);
          this.recordPrimaryPushSuccess({
            candidate,
            etag: uploaded.etag,
            summary
          });
          if (conflictProtectionDowngraded) {
            summary.conflictProtectionDowngrades++;
          }
        } catch (error41) {
          this.rethrowIfRoundAbort(error41, candidate.relPath);
          this.rethrowIfLockLost(error41);
          if (isAgentStoreSyncDisabledError(error41)) {
            throw error41;
          }
          if (isAgentStoreConnectCode(error41, Code.FailedPrecondition) || isAgentStoreConnectCode(error41, Code.InvalidArgument)) {
            const quota = parseAgentStoreQuotaExceeded(error41);
            if (quota !== void 0) {
              this.parkQuotaExceededEntry({
                relPath: candidate.relPath,
                absPath: candidate.absPath,
                summary,
                quota,
                message: agentStoreErrorSummaryMessage(error41, "Agent-store quota exceeded")
              });
            } else {
              this.parkPushEntry({
                relPath: candidate.relPath,
                summary,
                message: error41 instanceof Error ? error41.message : "Terminal push rejection during upload"
              });
            }
            return;
          }
          if (isPresignedUrlExpiredError(error41)) {
            try {
              yield this.refreshAndCompleteLegacyWrite({
                candidate,
                precondition,
                summary
              });
            } catch (refreshError) {
              if (this.tryParkQuotaExceeded({
                relPath: candidate.relPath,
                absPath: candidate.absPath,
                summary,
                error: refreshError
              })) {
                return;
              }
              summary.errors.push(syncRoundErrorFor(candidate.relPath, refreshError));
            }
            return;
          }
          if (isWriteConflictError(error41) && precondition !== void 0 && presign.conflict !== void 0) {
            try {
              yield this.handleWriteConflict({
                candidate,
                conflict: presign.conflict,
                precondition,
                summary,
                suppressIfRemoteIdentical: true
              });
              return;
            } catch (conflictError) {
              this.rethrowIfRoundAbort(conflictError, candidate.relPath);
              this.rethrowIfLockLost(conflictError);
              if (this.tryParkQuotaExceeded({
                relPath: candidate.relPath,
                absPath: candidate.absPath,
                summary,
                error: conflictError
              })) {
                return;
              }
              this.emitConflictFallbackFailed({ candidate });
              summary.errors.push(syncRoundErrorFor(candidate.relPath, conflictError));
              return;
            }
          }
          summary.errors.push(syncRoundErrorFor(candidate.relPath, error41));
        }
      })));
      summary.uploadMs = ((_b2 = summary.uploadMs) !== null && _b2 !== void 0 ? _b2 : 0) + (this.monotonicNow() - uploadStart);
    });
  }
  processMultipartWrites(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      const handledPaths = /* @__PURE__ */ new Set();
      const pendingContexts = /* @__PURE__ */ new Map();
      const initialWorks = [];
      try {
        for (const candidate of args.candidates) {
          const presign = args.presignedByPath.get(candidate.relPath);
          if (presign === void 0) {
            continue;
          }
          const useConflictDirectly = presignUsesConflictTarget(presign);
          const hasMultipartContext = presign.multipart !== void 0 || ((_a19 = presign.conflict) === null || _a19 === void 0 ? void 0 : _a19.multipart) !== void 0;
          if (!hasMultipartContext) {
            continue;
          }
          const precondition = args.preconditionByPath.get(candidate.relPath);
          try {
            this.registerMultipartContexts({ presign, pendingContexts });
            if (presign.sha !== candidate.sha || precondition === void 0) {
              continue;
            }
            let work;
            if (useConflictDirectly) {
              const conflict = presign.conflict;
              if ((conflict === null || conflict === void 0 ? void 0 : conflict.multipart) === void 0) {
                continue;
              }
              if (presign.primaryPreconditionFailed === true && (yield this.trySuppressIdenticalWriteConflict(candidate, args.summary))) {
                handledPaths.add(candidate.relPath);
                continue;
              }
              work = {
                target: "conflict",
                candidate,
                presign,
                conflict,
                upload: conflict.multipart,
                precondition,
                restartCount: 0,
                conflictRenameCount: 0,
                expiryRefreshCount: 0
              };
            } else {
              if (presign.multipart === void 0) {
                continue;
              }
              if (presign.conflict === void 0) {
                throw new AgentStoreSyncError({
                  code: "presign_response_mismatch",
                  relPath: candidate.relPath,
                  message: `Multipart primary write for ${candidate.relPath} did not include conflict protection`
                });
              }
              work = {
                target: "primary",
                candidate,
                presign,
                upload: presign.multipart,
                precondition,
                restartCount: 0,
                conflictRenameCount: 0,
                expiryRefreshCount: 0
              };
            }
            initialWorks.push(work);
            handledPaths.add(candidate.relPath);
          } catch (error41) {
            this.rethrowIfRoundAbort(error41, candidate.relPath);
            args.summary.errors.push(syncRoundErrorFor(candidate.relPath, error41));
          }
        }
        let works = initialWorks;
        while (works.length > 0) {
          works = yield this.runMultipartWorkWave({
            works,
            pendingContexts,
            summary: args.summary
          });
        }
        return handledPaths;
      } finally {
        yield this.abortPendingMultipartContexts(pendingContexts);
      }
    });
  }
  runMultipartWorkWave(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      const outcomes = yield Promise.all(args.works.map((originalWork) => __awaiter16(this, void 0, void 0, function* () {
        let work = originalWork;
        try {
          while (work.upload.partUrlsExpiresAtMs <= this.now() || presignHasExpiredLockRedirect(work.presign, this.now())) {
            const refreshed = yield this.refreshExpiredMultipartWork({
              work,
              pendingContexts: args.pendingContexts,
              summary: args.summary
            });
            if (refreshed === void 0) {
              return { kind: "finished" };
            }
            work = refreshed;
          }
          return {
            kind: "uploaded",
            entry: yield this.uploadMultipartWork(work, args.summary)
          };
        } catch (error41) {
          this.rethrowIfRoundAbort(error41, work.candidate.relPath);
          this.rethrowIfLockLost(error41);
          if (isPresignedUrlExpiredError(error41)) {
            try {
              const refreshed = yield this.refreshExpiredMultipartWork({
                work,
                pendingContexts: args.pendingContexts,
                summary: args.summary
              });
              return refreshed === void 0 ? { kind: "finished" } : { kind: "retry", work: refreshed };
            } catch (refreshError) {
              this.rethrowIfRoundAbort(refreshError, work.candidate.relPath);
              this.rethrowIfLockLost(refreshError);
              if (this.tryParkQuotaExceeded({
                relPath: work.candidate.relPath,
                absPath: work.candidate.absPath,
                summary: args.summary,
                error: refreshError
              })) {
                return { kind: "finished" };
              }
              args.summary.errors.push(syncRoundErrorFor(work.candidate.relPath, refreshError));
              return { kind: "finished" };
            }
          }
          if (this.tryParkQuotaExceeded({
            relPath: work.candidate.relPath,
            absPath: work.candidate.absPath,
            summary: args.summary,
            error: error41
          })) {
            return { kind: "finished" };
          }
          args.summary.errors.push(syncRoundErrorFor(work.candidate.relPath, error41));
          return { kind: "finished" };
        }
      })));
      const uploaded = outcomes.filter((outcome) => outcome.kind === "uploaded").map((outcome) => outcome.entry);
      const nextWorks = outcomes.filter((outcome) => outcome.kind === "retry").map((outcome) => outcome.work);
      if (uploaded.length === 0) {
        return nextWorks;
      }
      this.throwIfRoundAborted();
      let results;
      try {
        yield this.assertRoundStillOwnsLock(void 0, { bypassCache: true });
        results = yield this.completeMultipartWithTransientRetries(uploaded);
      } catch (error41) {
        this.rethrowIfRoundAbort(error41);
        this.rethrowIfLockLost(error41);
        for (const entry of uploaded) {
          if (this.tryParkQuotaExceeded({
            relPath: entry.work.candidate.relPath,
            absPath: entry.work.candidate.absPath,
            summary: args.summary,
            error: error41
          })) {
            continue;
          }
          args.summary.errors.push(syncRoundErrorFor(entry.work.candidate.relPath, error41));
        }
        return nextWorks;
      }
      for (let index = 0; index < uploaded.length; index++) {
        const entry = uploaded[index];
        const result = results[index];
        if (entry === void 0 || result === void 0) {
          continue;
        }
        if (result.kind === "rpc_error") {
          this.rethrowIfRoundAbort(result.error, entry.work.candidate.relPath);
          if (this.tryParkQuotaExceeded({
            relPath: entry.work.candidate.relPath,
            absPath: entry.work.candidate.absPath,
            summary: args.summary,
            error: result.error
          })) {
            continue;
          }
          args.summary.errors.push(syncRoundErrorFor(entry.work.candidate.relPath, result.error));
          continue;
        }
        try {
          const next = yield this.handleMultipartCompletionResult({
            entry,
            result,
            pendingContexts: args.pendingContexts,
            summary: args.summary
          });
          if (next !== void 0) {
            nextWorks.push(next);
          }
        } catch (error41) {
          this.rethrowIfRoundAbort(error41, entry.work.candidate.relPath);
          this.rethrowIfLockLost(error41);
          if (this.tryParkQuotaExceeded({
            relPath: entry.work.candidate.relPath,
            absPath: entry.work.candidate.absPath,
            summary: args.summary,
            error: error41
          })) {
            continue;
          }
          args.summary.errors.push(syncRoundErrorFor(entry.work.candidate.relPath, error41));
        }
      }
      return nextWorks;
    });
  }
  refreshExpiredMultipartWork(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      if (args.work.expiryRefreshCount >= this.multipartMaxExpiryRefreshes) {
        throw new AgentStoreSyncError({
          code: "presigned_url_expired",
          relPath: args.work.candidate.relPath,
          message: `Multipart upload URLs for ${args.work.candidate.relPath} expired again after a fresh presign`,
          retryable: false
        });
      }
      yield this.assertRoundStillOwnsLock(args.work.candidate.relPath, {
        bypassCache: true
      });
      return yield this.presignFreshMultipartWork({
        previous: args.work,
        pendingContexts: args.pendingContexts,
        summary: args.summary,
        expiryRefreshCount: args.work.expiryRefreshCount + 1
      });
    });
  }
  uploadMultipartWork(work, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      const relPath = work.target === "primary" ? work.candidate.relPath : work.conflict.relPath;
      this.validateMultipartInstruction(work);
      const multipartParts = work.candidate.multipartParts;
      if (multipartParts === void 0) {
        throw new AgentStoreSyncError({
          code: "presign_response_mismatch",
          relPath: work.candidate.relPath,
          message: `Multipart instructions were returned without client part checksums for ${work.candidate.relPath}`
        });
      }
      const partOutcomes = yield Promise.all(work.upload.parts.map((part, index) => __awaiter16(this, void 0, void 0, function* () {
        try {
          const requestedPart = multipartParts[index];
          if (requestedPart === void 0) {
            throw new AgentStoreSyncError({
              code: "presign_response_mismatch",
              relPath: work.candidate.relPath,
              message: `Multipart part ${part.partNumber} was not requested for ${work.candidate.relPath}`
            });
          }
          this.assertPresignedUrlSafe({
            rawUrl: part.url,
            relPath
          });
          const uploaded = yield this.runQueued(this.queues.s3, () => __awaiter16(this, void 0, void 0, function* () {
            var _a19;
            yield this.assertRoundStillOwnsLock(relPath, {
              bypassCache: true
            });
            return this.blobTransfer.uploadPart({
              url: part.url,
              relPath,
              absPath: work.candidate.absPath,
              partNumber: part.partNumber,
              offset: part.offsetBytes,
              size: part.sizeBytes,
              fileSize: work.candidate.size,
              expiresAtMs: work.upload.partUrlsExpiresAtMs,
              expectedDev: work.candidate.dev,
              expectedIno: work.candidate.ino,
              checksumSha256: requestedPart.checksumSha256,
              presignHeaders: (_a19 = part.headers) !== null && _a19 !== void 0 ? _a19 : {},
              signal: this.activeRoundSignal
            });
          }));
          return {
            kind: "success",
            part: {
              partNumber: part.partNumber,
              etag: uploaded.etag,
              checksumSha256: requestedPart.checksumSha256
            }
          };
        } catch (error41) {
          return { kind: "failure", error: error41 };
        }
      })));
      const failedPart = partOutcomes.find((outcome) => outcome.kind === "failure");
      if (failedPart !== void 0) {
        throw failedPart.error;
      }
      const parts = partOutcomes.map((outcome) => {
        if (outcome.kind === "failure") {
          throw outcome.error;
        }
        return outcome.part;
      });
      const current = yield streamHashFileNoFollow({
        absPath: work.candidate.absPath,
        maxBytes: this.maxFileSizeBytes,
        expectedDev: work.candidate.dev,
        expectedIno: work.candidate.ino
      });
      if (current.size !== work.candidate.size || current.sha !== work.candidate.sha) {
        throw new AgentStoreSyncError({
          code: "sha_mismatch",
          relPath: work.candidate.relPath,
          message: `Local file ${work.candidate.relPath} changed during multipart upload`
        });
      }
      return {
        work,
        completion: {
          context: work.upload.context,
          parts
        }
      };
    });
  }
  completeMultipartWithTransientRetries(uploaded) {
    return __awaiter16(this, void 0, void 0, function* () {
      const completeMultipartWrites = this.client.completeMultipartWrites;
      if (completeMultipartWrites === void 0) {
        throw new AgentStoreSyncError({
          code: "upload_failed",
          message: "Agent store client does not support multipart completion"
        });
      }
      const finalResults = new Array(uploaded.length);
      let pending = uploaded.map((entry, index) => ({ entry, index }));
      for (let attempt = 1; attempt <= this.multipartCompleteMaxAttempts && pending.length > 0; attempt++) {
        let results;
        try {
          results = yield completeMultipartWrites.call(this.client, {
            agentId: this.agentId,
            completions: pending.map((item) => item.entry.completion),
            signal: this.activeRoundSignal
          });
        } catch (error41) {
          for (const item of pending) {
            finalResults[item.index] = {
              kind: "rpc_error",
              error: error41
            };
          }
          pending = [];
          break;
        }
        const retry2 = [];
        for (let index = 0; index < pending.length; index++) {
          const item = pending[index];
          const result = results[index];
          if (item === void 0 || result === void 0) {
            throw new AgentStoreSyncError({
              code: "presign_response_mismatch",
              message: "Multipart completion response did not match its request"
            });
          }
          if (result.kind === "failure" && result.code === "transient" && attempt < this.multipartCompleteMaxAttempts) {
            retry2.push(item);
          } else {
            finalResults[item.index] = result;
          }
        }
        pending = retry2;
      }
      return finalResults.map((result) => {
        if (result === void 0) {
          throw new AgentStoreSyncError({
            code: "upload_failed",
            message: "Multipart completion exhausted transient retries"
          });
        }
        return result;
      });
    });
  }
  handleMultipartCompletionResult(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      const { work } = args.entry;
      if (args.result.kind === "success") {
        args.pendingContexts.delete(work.upload.context.uploadId);
        if (work.target === "primary") {
          this.recordPrimaryPushSuccess({
            candidate: work.candidate,
            etag: args.result.etag,
            summary: args.summary
          });
        } else {
          yield this.handleWriteConflict({
            candidate: work.candidate,
            conflict: work.conflict,
            precondition: work.precondition,
            summary: args.summary,
            completedUpload: { etag: args.result.etag }
          });
        }
        return void 0;
      }
      switch (args.result.code) {
        case "precondition_failed": {
          if (work.target === "primary") {
            if (yield this.trySuppressIdenticalWriteConflict(work.candidate, args.summary)) {
              return void 0;
            }
            const conflict = work.presign.conflict;
            if (conflict === void 0) {
              throw new AgentStoreSyncError({
                code: "write_conflict",
                relPath: work.candidate.relPath,
                message: `Multipart write for ${work.candidate.relPath} lost its precondition without a conflict target`
              });
            }
            if (conflict.multipart === void 0) {
              yield this.handleWriteConflict({
                candidate: work.candidate,
                conflict,
                precondition: work.precondition,
                summary: args.summary,
                suppressIfRemoteIdentical: true
              });
              return void 0;
            }
            return {
              target: "conflict",
              candidate: work.candidate,
              presign: work.presign,
              conflict,
              upload: conflict.multipart,
              precondition: work.precondition,
              restartCount: work.restartCount,
              conflictRenameCount: work.conflictRenameCount,
              expiryRefreshCount: 0
            };
          }
          if (work.conflictRenameCount >= this.multipartMaxConflictRenames) {
            throw new AgentStoreSyncError({
              code: "write_conflict",
              relPath: work.candidate.relPath,
              message: `Multipart conflict target for ${work.candidate.relPath} collided after a fresh presign`
            });
          }
          return yield this.presignFreshMultipartWork({
            previous: work,
            pendingContexts: args.pendingContexts,
            summary: args.summary,
            conflictRenameCount: work.conflictRenameCount + 1
          });
        }
        case "restart_required": {
          if (work.restartCount >= this.multipartMaxRestarts) {
            throw new AgentStoreSyncError({
              code: "upload_failed",
              relPath: work.candidate.relPath,
              message: `Multipart upload for ${work.candidate.relPath} still required restart after a fresh presign`
            });
          }
          return yield this.presignFreshMultipartWork({
            previous: work,
            pendingContexts: args.pendingContexts,
            summary: args.summary,
            restartCount: work.restartCount + 1
          });
        }
        case "checksum_mismatch":
          throw new AgentStoreSyncError({
            code: "sha_mismatch",
            relPath: work.candidate.relPath,
            message: `Multipart checksum did not match ${work.candidate.relPath}`
          });
        case "upload_not_found":
          args.pendingContexts.delete(work.upload.context.uploadId);
          throw new AgentStoreSyncError({
            code: "upload_failed",
            relPath: work.candidate.relPath,
            message: `Multipart upload for ${work.candidate.relPath} no longer exists`
          });
        case "invalid_parts":
          throw new AgentStoreSyncError({
            code: "presign_response_mismatch",
            relPath: work.candidate.relPath,
            message: `Multipart completion rejected the uploaded part list for ${work.candidate.relPath}`
          });
        case "transient":
          throw new AgentStoreSyncError({
            code: "upload_failed",
            relPath: work.candidate.relPath,
            message: `Multipart completion exhausted transient retries for ${work.candidate.relPath}`
          });
        case "internal":
        case "unknown":
          throw new AgentStoreSyncError({
            code: "upload_failed",
            relPath: work.candidate.relPath,
            message: `Multipart completion failed internally for ${work.candidate.relPath}`
          });
      }
    });
  }
  presignFreshMultipartWork(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19, _b2, _c2;
      const fresh = yield this.presignFreshWrite(args.previous.candidate, args.previous.precondition, args.summary);
      this.registerMultipartContexts({
        presign: fresh,
        pendingContexts: args.pendingContexts
      });
      const restartCount = (_a19 = args.restartCount) !== null && _a19 !== void 0 ? _a19 : args.previous.restartCount;
      const conflictRenameCount = (_b2 = args.conflictRenameCount) !== null && _b2 !== void 0 ? _b2 : args.previous.conflictRenameCount;
      const expiryRefreshCount = (_c2 = args.expiryRefreshCount) !== null && _c2 !== void 0 ? _c2 : args.previous.expiryRefreshCount;
      const previousConflictRemainsAuthoritative = args.previous.target === "conflict" && !presignHasExpiredLockRedirect(args.previous.presign, this.now());
      if (previousConflictRemainsAuthoritative || presignUsesConflictTarget(fresh)) {
        const conflict = fresh.conflict;
        if (conflict === void 0) {
          throw new AgentStoreSyncError({
            code: "presign_response_mismatch",
            relPath: args.previous.candidate.relPath,
            message: `Fresh presign for ${args.previous.candidate.relPath} did not include conflict instructions`
          });
        }
        const conflictCameFromPrecondition = fresh.lockRedirect === void 0 && (fresh.primaryPreconditionFailed === true || args.previous.target === "conflict" && args.previous.presign.lockRedirect === void 0);
        if (conflictCameFromPrecondition && (yield this.trySuppressIdenticalWriteConflict(args.previous.candidate, args.summary))) {
          return void 0;
        }
        if (conflict.multipart === void 0) {
          yield this.handleWriteConflict({
            candidate: args.previous.candidate,
            conflict,
            precondition: args.previous.precondition,
            summary: args.summary,
            suppressIfRemoteIdentical: conflictCameFromPrecondition
          });
          return void 0;
        }
        return {
          target: "conflict",
          candidate: args.previous.candidate,
          presign: fresh,
          conflict,
          upload: conflict.multipart,
          precondition: args.previous.precondition,
          restartCount,
          conflictRenameCount,
          expiryRefreshCount
        };
      }
      if (fresh.multipart === void 0) {
        try {
          yield this.completeFreshLegacyWrite({
            candidate: args.previous.candidate,
            presign: fresh,
            precondition: args.previous.precondition,
            summary: args.summary
          });
          return void 0;
        } catch (error41) {
          if (!isPresignedUrlExpiredError(error41) || expiryRefreshCount >= this.multipartMaxExpiryRefreshes) {
            throw error41;
          }
          return yield this.presignFreshMultipartWork({
            previous: args.previous,
            pendingContexts: args.pendingContexts,
            summary: args.summary,
            restartCount,
            conflictRenameCount,
            expiryRefreshCount: expiryRefreshCount + 1
          });
        }
      }
      if (fresh.conflict === void 0) {
        throw new AgentStoreSyncError({
          code: "presign_response_mismatch",
          relPath: args.previous.candidate.relPath,
          message: `Fresh multipart presign for ${args.previous.candidate.relPath} did not include conflict instructions`
        });
      }
      return {
        target: "primary",
        candidate: args.previous.candidate,
        presign: fresh,
        upload: fresh.multipart,
        precondition: args.previous.precondition,
        restartCount,
        conflictRenameCount,
        expiryRefreshCount
      };
    });
  }
  completeFreshLegacyWrite(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      if (presignHasExpiredLockRedirect(args.presign, this.now())) {
        throw new AgentStoreSyncError({
          code: "presigned_url_expired",
          relPath: args.candidate.relPath,
          message: `Fresh presign for ${args.candidate.relPath} contained an expired lock redirect`
        });
      }
      if (presignUsesConflictTarget(args.presign)) {
        if (args.presign.conflict === void 0 || args.precondition === void 0) {
          throw new AgentStoreSyncError({
            code: "presign_response_mismatch",
            relPath: args.candidate.relPath,
            message: `Fresh conflict-only presign for ${args.candidate.relPath} did not include a conflict target and write precondition`
          });
        }
        yield this.handleWriteConflict({
          candidate: args.candidate,
          conflict: args.presign.conflict,
          precondition: args.precondition,
          summary: args.summary,
          suppressIfRemoteIdentical: args.presign.primaryPreconditionFailed === true
        });
        return;
      }
      const conflictProtectionDowngraded = args.precondition !== void 0 && args.presign.conflict === void 0;
      if (args.presign.conflict === void 0) {
        if (presignHasConditionalHeaders(args.presign)) {
          throw new AgentStoreSyncError({
            code: "presign_response_mismatch",
            relPath: args.candidate.relPath,
            message: `Fresh conditional presign for ${args.candidate.relPath} did not include a conflict target`
          });
        }
      }
      try {
        const uploaded = yield this.uploadPrimaryWithConflictRetry(args.candidate, args.presign, args.summary);
        this.recordPrimaryPushSuccess({
          candidate: args.candidate,
          etag: uploaded.etag,
          summary: args.summary
        });
        if (conflictProtectionDowngraded) {
          args.summary.conflictProtectionDowngrades++;
        }
      } catch (error41) {
        if (isWriteConflictError(error41) && args.presign.conflict !== void 0 && args.precondition !== void 0) {
          yield this.handleWriteConflict({
            candidate: args.candidate,
            conflict: args.presign.conflict,
            precondition: args.precondition,
            summary: args.summary,
            suppressIfRemoteIdentical: true
          });
          return;
        }
        throw error41;
      }
    });
  }
  refreshAndCompleteLegacyWrite(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      yield this.withFreshLegacyPresign({
        candidate: args.candidate,
        precondition: args.precondition,
        summary: args.summary,
        operation: (fresh) => __awaiter16(this, void 0, void 0, function* () {
          yield this.completeFreshLegacyWrite({
            candidate: args.candidate,
            presign: fresh,
            precondition: args.precondition,
            summary: args.summary
          });
        })
      });
    });
  }
  presignFreshWrite(candidate, precondition, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      const fresh = yield this.runQueued(this.queues.presign, () => this.client.presignWrites({
        agentId: this.agentId,
        files: [
          Object.assign({ relPath: candidate.relPath, sha: candidate.sha, size: candidate.size }, precondition !== void 0 ? Object.assign({ multipartParts: candidate.multipartParts }, precondition) : {})
        ],
        signal: this.activeRoundSignal
      }));
      const instruction = fresh[0];
      if (instruction === void 0 || instruction.sha !== candidate.sha || normalizeRelPath(instruction.relPath) !== candidate.relPath) {
        throw new AgentStoreSyncError({
          code: "presign_response_mismatch",
          relPath: candidate.relPath,
          message: `Fresh presign did not match ${candidate.relPath}`
        });
      }
      return instruction;
    });
  }
  withFreshLegacyPresign(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      const pendingContexts = /* @__PURE__ */ new Map();
      try {
        const presign = yield this.presignFreshWrite(args.candidate, args.precondition, args.summary);
        this.registerMultipartContexts({ presign, pendingContexts });
        return yield args.operation(presign);
      } finally {
        yield this.abortPendingMultipartContexts(pendingContexts);
      }
    });
  }
  registerMultipartContexts(args) {
    var _a19;
    for (const upload of [
      args.presign.multipart,
      (_a19 = args.presign.conflict) === null || _a19 === void 0 ? void 0 : _a19.multipart
    ]) {
      if (upload === void 0) {
        continue;
      }
      const uploadId = upload.context.uploadId;
      if (uploadId.length === 0 || args.pendingContexts.has(uploadId)) {
        throw new AgentStoreSyncError({
          code: "presign_response_mismatch",
          relPath: args.presign.relPath,
          message: `Multipart presign for ${args.presign.relPath} returned an invalid or duplicate upload context`
        });
      }
      args.pendingContexts.set(uploadId, upload.context);
    }
  }
  validateMultipartInstruction(work) {
    var _a19;
    const { candidate, upload } = work;
    const relPath = work.target === "primary" ? candidate.relPath : work.conflict.relPath;
    const contextPreconditionMatches = work.target === "conflict" ? upload.context.precondition.case === "expectAbsent" && upload.context.precondition.value === true : work.precondition.baseEtag !== void 0 ? upload.context.precondition.case === "baseEtag" && upload.context.precondition.value === work.precondition.baseEtag : work.precondition.expectAbsent === true && upload.context.precondition.case === "expectAbsent" && upload.context.precondition.value === true;
    const requestedParts = candidate.multipartParts;
    if (requestedParts === void 0 || normalizeRelPath(upload.context.relPath) !== normalizeRelPath(relPath) || upload.context.sha !== candidate.sha || upload.context.sizeBytes !== candidate.size || !contextPreconditionMatches || upload.context.expectedPartCount !== upload.parts.length || requestedParts.length !== upload.parts.length || upload.context.uploadId.length === 0 || upload.context.storeId.length === 0 || upload.context.sessionId.length === 0 || upload.parts.length === 0 || !Number.isFinite(upload.partUrlsExpiresAtMs)) {
      throw new AgentStoreSyncError({
        code: "presign_response_mismatch",
        relPath: candidate.relPath,
        message: `Multipart instructions did not match ${candidate.relPath}`
      });
    }
    let expectedOffset = 0;
    for (let index = 0; index < upload.parts.length; index++) {
      const part = upload.parts[index];
      const requestedPart = requestedParts[index];
      if (part === void 0 || requestedPart === void 0 || part.partNumber !== index + 1 || part.partNumber !== requestedPart.partNumber || !Number.isSafeInteger(part.offsetBytes) || part.offsetBytes !== expectedOffset || part.offsetBytes !== requestedPart.offsetBytes || !Number.isSafeInteger(part.sizeBytes) || part.sizeBytes <= 0 || part.sizeBytes !== requestedPart.sizeBytes || getHeaderCaseInsensitive((_a19 = part.headers) !== null && _a19 !== void 0 ? _a19 : {}, "x-amz-checksum-sha256") !== Buffer.from(requestedPart.checksumSha256).toString("base64") || part.url.length === 0) {
        throw new AgentStoreSyncError({
          code: "presign_response_mismatch",
          relPath: candidate.relPath,
          message: `Multipart part layout did not match ${candidate.relPath}`
        });
      }
      expectedOffset += part.sizeBytes;
    }
    if (expectedOffset !== candidate.size) {
      throw new AgentStoreSyncError({
        code: "presign_response_mismatch",
        relPath: candidate.relPath,
        message: `Multipart parts did not cover ${candidate.relPath}`
      });
    }
  }
  abortPendingMultipartContexts(pendingContexts) {
    return __awaiter16(this, void 0, void 0, function* () {
      if (pendingContexts.size === 0) {
        return;
      }
      const abortMultipartWrites = this.client.abortMultipartWrites;
      if (abortMultipartWrites === void 0) {
        return;
      }
      try {
        yield abortMultipartWrites.call(this.client, {
          agentId: this.agentId,
          uploads: [...pendingContexts.values()].map((context2) => ({ context: context2 })),
          // Thread the round signal so a close/watchdog abort also cancels the
          // cleanup RPC instead of outliving the aborted round.
          signal: this.activeRoundSignal
        });
      } catch (error41) {
        this.rethrowIfRoundAbort(error41);
      }
    });
  }
  recordPrimaryPushSuccess(args) {
    this.clearPushPark(args.candidate.relPath);
    this.throwIfRoundAborted(args.candidate.relPath);
    args.summary.filesPushed++;
    args.summary.bytesPushed += args.candidate.size;
    this.index.upsertFile({
      relPath: args.candidate.relPath,
      lastSeenEtag: args.etag,
      lastSyncedSha: args.candidate.sha,
      size: args.candidate.size,
      lastSyncedMs: this.now(),
      direction: "pushed"
    });
  }
  /**
   * Resolves per-file write preconditions for a push. Index rows with a
   * recorded etag become `baseEtag`; missing rows become `expectAbsent`.
   * Legacy rows (pre-etag feature, row exists but no `lastSeenEtag`) are
   * resolved from one pre-push recursive listing — push runs before pull in
   * a round, so no current-round listing exists yet, and the listing only
   * fires while legacy rows exist. Listing failures skip those rows as
   * `list_failed`; listed-but-etag-less rows are re-probed or skipped as
   * `probe_failed`. Never unconditional-push (could resurrect a tombstone).
   *
   * `preferProbeForLegacy` (path-scoped pushes) resolves each legacy row by
   * an exact-object probe instead of a whole-store listing — a scoped push
   * must never pay for or claim a full listing.
   */
  resolvePushPreconditions(toUpload_1, summary_1) {
    return __awaiter16(this, arguments, void 0, function* (toUpload, summary, options2 = {}) {
      const preferProbeForLegacy = options2.preferProbeForLegacy === true;
      const preconditions = /* @__PURE__ */ new Map();
      const skippedDueToListingFailure = /* @__PURE__ */ new Set();
      const hasLegacyRow = toUpload.some((candidate) => candidate.existing !== void 0 && candidate.existing.state !== "tombstoned" && (candidate.existing.lastSeenEtag === void 0 || candidate.existing.lastSeenEtag.length === 0));
      let legacyListing;
      let legacyListingFailed = false;
      if (hasLegacyRow && !preferProbeForLegacy) {
        try {
          const listed = yield this.listServerFiles(summary, {
            tombstoneMode: AgentStoreTombstoneMode.OMIT
          });
          const listedPaths = /* @__PURE__ */ new Set();
          const etagByPath = /* @__PURE__ */ new Map();
          for (const file2 of listed.files) {
            let canonical;
            try {
              canonical = normalizeRelPath(file2.relPath);
            } catch (_a19) {
              continue;
            }
            listedPaths.add(canonical);
            const etag = normalizeS3Etag(file2.etag);
            if (etag.length > 0) {
              etagByPath.set(canonical, etag);
            }
          }
          legacyListing = { listedPaths, etagByPath };
        } catch (error41) {
          this.rethrowIfRoundAbort(error41);
          legacyListingFailed = true;
          summary.errors.push({
            relPath: void 0,
            code: "list_failed",
            message: `Failed to list agent store for legacy push baselines: ${error41 instanceof Error ? error41.message : String(error41)}`
          });
        }
      }
      for (const candidate of toUpload) {
        if (candidate.existing === void 0) {
          preconditions.set(candidate.relPath, { expectAbsent: true });
          continue;
        }
        if (candidate.existing.state === "tombstoned") {
          const tombstoneEtag = candidate.existing.tombstoneEtag;
          if (tombstoneEtag !== void 0 && tombstoneEtag.length > 0) {
            preconditions.set(candidate.relPath, { baseEtag: tombstoneEtag });
          } else {
            preconditions.set(candidate.relPath, { expectAbsent: true });
          }
          continue;
        }
        const knownEtag = candidate.existing.lastSeenEtag;
        if (knownEtag !== void 0 && knownEtag.length > 0) {
          preconditions.set(candidate.relPath, { baseEtag: knownEtag });
          continue;
        }
        if (preferProbeForLegacy) {
          const probed2 = yield this.probeLegacyPushPrecondition(candidate.relPath, summary);
          if (probed2 === void 0) {
            skippedDueToListingFailure.add(candidate.relPath);
          } else {
            preconditions.set(candidate.relPath, probed2);
          }
          continue;
        }
        if (legacyListingFailed || legacyListing === void 0) {
          skippedDueToListingFailure.add(candidate.relPath);
          continue;
        }
        if (!legacyListing.listedPaths.has(candidate.relPath)) {
          preconditions.set(candidate.relPath, { expectAbsent: true });
          continue;
        }
        const listedEtag = legacyListing.etagByPath.get(candidate.relPath);
        if (listedEtag !== void 0) {
          preconditions.set(candidate.relPath, { baseEtag: listedEtag });
          continue;
        }
        const probed = yield this.probeLegacyPushPrecondition(candidate.relPath, summary);
        if (probed === void 0) {
          skippedDueToListingFailure.add(candidate.relPath);
        } else {
          preconditions.set(candidate.relPath, probed);
        }
      }
      return { preconditions, skippedDueToListingFailure };
    });
  }
  /**
   * Resolves a legacy etag-less row's write precondition by probing the exact
   * object (Sand's `resolveMutableWriteBaseline` pattern): absent ⇒
   * `expectAbsent`, present ⇒ `baseEtag`. Never resolves unconditionally (a
   * tombstone at the path would be resurrected). Returns `undefined` and
   * records a `probe_failed` error when the probe fails; sync-disabled
   * propagates for session stand-down.
   */
  probeLegacyPushPrecondition(relPath, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      try {
        const probe = yield probeAgentStoreObject({
          client: this.client,
          agentId: this.agentId,
          relPath,
          fetchImpl: this.fetchImpl,
          validatePresignedUrl: this.validatePresignedUrl,
          runPresign: (fn) => this.runQueued(this.queues.presign, fn),
          runS3: (fn) => this.runQueued(this.queues.s3, fn),
          // Cancel the presign RPC and the ranged GET when the round aborts.
          signal: this.activeRoundSignal
        });
        summary.legacyProbes++;
        if (probe.kind === "absent") {
          return { expectAbsent: true };
        }
        return { baseEtag: probe.etag };
      } catch (error41) {
        if (isAgentStoreSyncDisabledError(error41)) {
          throw error41;
        }
        this.rethrowIfRoundAbort(error41, relPath);
        summary.errors.push({
          relPath,
          code: "probe_failed",
          message: `Failed to probe agent store object for legacy push baseline: ${error41 instanceof Error ? error41.message : String(error41)}`
        });
        return void 0;
      }
    });
  }
  isPushParked(relPath) {
    const untilMs = this.pushParkedUntilMs.get(relPath);
    if (untilMs === void 0) {
      return false;
    }
    if (this.now() >= untilMs) {
      this.pushParkedUntilMs.delete(relPath);
      return false;
    }
    return true;
  }
  clearPushPark(relPath) {
    this.pushParkedUntilMs.delete(relPath);
    const backoff2 = this.pushParkBackoff.get(relPath);
    if (backoff2 !== void 0) {
      backoff2.recordSuccess();
      this.pushParkBackoff.delete(relPath);
    }
  }
  parkPushEntry(args) {
    var _a19;
    let backoff2 = this.pushParkBackoff.get(args.relPath);
    if (backoff2 === void 0) {
      backoff2 = new BackoffScheduler({
        baseDelayMs: DEFAULT_PUSH_TERMINAL_BACKOFF_BASE_MS,
        maxDelayMs: DEFAULT_PUSH_TERMINAL_BACKOFF_MAX_MS,
        jitter: 0.2
      });
      this.pushParkBackoff.set(args.relPath, backoff2);
    }
    const delayMs = backoff2.recordFailure();
    this.pushParkedUntilMs.set(args.relPath, this.now() + delayMs);
    args.summary.pushEntriesParked++;
    args.summary.errors.push({
      relPath: args.relPath,
      code: (_a19 = args.code) !== null && _a19 !== void 0 ? _a19 : "push_terminal",
      message: `${args.message} (parked ${delayMs}ms)`
    });
  }
  parkQuotaExceededEntry(args) {
    this.parkPushEntry({
      relPath: args.relPath,
      summary: args.summary,
      message: args.message,
      code: "quota_exceeded"
    });
    this.emitQuotaExceededJournal({
      relPath: args.relPath,
      absPath: args.absPath,
      quota: args.quota
    });
  }
  /**
   * Parks + journals a quota FailedPrecondition/InvalidArgument when the
   * error carries the agent_store_quota_exceeded marker. Returns true when
   * parked so callers skip hot-looping `syncRoundErrorFor` paths (multipart
   * complete / fresh-presign refresh).
   */
  tryParkQuotaExceeded(args) {
    if (!isAgentStoreConnectCode(args.error, Code.FailedPrecondition) && !isAgentStoreConnectCode(args.error, Code.InvalidArgument)) {
      return false;
    }
    if (isAgentStoreSyncDisabledError(args.error)) {
      return false;
    }
    const quota = parseAgentStoreQuotaExceeded(args.error);
    if (quota === void 0) {
      return false;
    }
    this.parkQuotaExceededEntry({
      relPath: args.relPath,
      absPath: args.absPath,
      summary: args.summary,
      quota,
      message: agentStoreErrorSummaryMessage(args.error, "Agent-store quota exceeded")
    });
    return true;
  }
  emitQuotaExceededJournal(args) {
    const emit = {
      kind: "quota_exceeded",
      storeId: this.agentId,
      originalRelPath: args.relPath,
      originalAbsPath: args.absPath,
      source: "local_sync",
      scopeKind: args.quota.scopeKind,
      limitBytes: args.quota.limitBytes,
      usageBytes: args.quota.usageBytes
    };
    this.emitConflictJournalEventWithRetry(emit);
  }
  /**
   * Uploads to the primary presigned URL. S3 returns 409
   * (`ConditionalRequestConflict`) under concurrent conditional operations;
   * retry the primary exactly once, then treat the failure as a 412 (the
   * caller's conflict fallback takes over).
   */
  uploadPrimaryWithConflictRetry(candidate, presign, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      try {
        return yield this.uploadOne(candidate, presign, summary);
      } catch (error41) {
        if (isWriteConflictError(error41) && error41.httpStatus === 409) {
          return yield this.uploadOne(candidate, presign, summary);
        }
        throw error41;
      }
    });
  }
  /**
   * `expectAbsent` 412 / primaryPreconditionFailed: a pruned row may still
   * collide with a same-key tombstone whose lifecycle sweep is late. Re-list
   * the parent with INCLUDE and retry once with the tombstone etag when that
   * tombstone is older than floor minus slack. In-retention tombstones stay
   * on the conflict path.
   */
  tryRecreateOverListedTombstone(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19, _b2, _c2, _d;
      var _e2;
      (_b2 = (_a19 = this.client).invalidateListCache) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, { agentId: this.agentId });
      const parent = parentDirRelPath(args.candidate.relPath);
      let listing;
      try {
        listing = yield this.runQueued(this.queues.list, () => this.client.listFiles({
          agentId: this.agentId,
          relPath: parent,
          tombstoneMode: AgentStoreTombstoneMode.INCLUDE,
          signal: this.activeRoundSignal
        }));
      } catch (error41) {
        this.rethrowIfRoundAbort(error41, args.candidate.relPath);
        this.rethrowIfLockLost(error41);
        return false;
      }
      const floorMs = protoPositiveMs2(listing.tombstoneFloorMs);
      if (floorMs === void 0) {
        return false;
      }
      const cutoffMs = floorMs - this.tombstonePruneSlackMs();
      let tombstoneEtag;
      for (const tombstone of (_e2 = listing.tombstones) !== null && _e2 !== void 0 ? _e2 : []) {
        let canonical;
        try {
          canonical = normalizeRelPath(tombstone.relPath);
        } catch (_f) {
          continue;
        }
        if (canonical !== args.candidate.relPath) {
          continue;
        }
        const etag = normalizeS3Etag(tombstone.tombstoneEtag);
        if (etag.length === 0 || tombstone.deletedAtMs <= 0) {
          continue;
        }
        if (tombstone.deletedAtMs >= cutoffMs) {
          continue;
        }
        tombstoneEtag = etag;
        break;
      }
      if (tombstoneEtag === void 0) {
        return false;
      }
      try {
        const presign = yield this.presignFreshWrite(args.candidate, { baseEtag: tombstoneEtag }, args.summary);
        if (presignUsesConflictTarget(presign) || presign.multipart !== void 0) {
          return false;
        }
        const uploaded = yield this.uploadPrimaryWithConflictRetry(args.candidate, presign, args.summary);
        try {
          this.recordPrimaryPushSuccess({
            candidate: args.candidate,
            etag: uploaded.etag,
            summary: args.summary
          });
          return true;
        } finally {
          (_d = (_c2 = this.client).invalidateListCache) === null || _d === void 0 ? void 0 : _d.call(_c2, { agentId: this.agentId });
        }
      } catch (error41) {
        this.rethrowIfRoundAbort(error41, args.candidate.relPath);
        this.rethrowIfLockLost(error41);
        return false;
      }
    });
  }
  /**
   * The conflict branch of a conditional push: the primary PUT was rejected
   * with 412, so the loser's bytes are preserved at the server-generated
   * conflict path instead. The original push still counts as a success from
   * the caller's point of view (Dropbox semantics). Throws only when even
   * the conflict write could not be committed.
   */
  handleWriteConflict(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      const { candidate, precondition, summary } = args;
      if (args.completedUpload === void 0 && args.suppressIfRemoteIdentical === true && (yield this.trySuppressIdenticalWriteConflict(candidate, summary))) {
        return;
      }
      if (args.completedUpload === void 0 && args.suppressIfRemoteIdentical === true && precondition.expectAbsent === true && (yield this.tryRecreateOverListedTombstone({
        candidate,
        summary
      }))) {
        return;
      }
      let conflict = args.conflict;
      let uploaded = args.completedUpload;
      if (uploaded === void 0) {
        let uploadError;
        try {
          if (conflict.expiresAtMs <= this.now()) {
            ({ conflict, uploaded } = yield this.uploadFreshLegacyConflict(candidate, precondition, summary));
          } else {
            uploaded = yield this.uploadConflict(candidate, conflict, summary);
          }
        } catch (error41) {
          uploadError = error41;
        }
        if (uploaded === void 0) {
          this.rethrowIfRoundAbort(uploadError, candidate.relPath);
          if (!isWriteConflictError(uploadError) && !isPresignedUrlExpiredError(uploadError)) {
            throw uploadError;
          }
          ({ conflict, uploaded } = yield this.uploadFreshLegacyConflict(candidate, precondition, summary));
        }
      }
      summary.filesConflicted++;
      summary.conflicts.push({
        relPath: candidate.relPath,
        conflictRelPath: conflict.relPath,
        conflictEtag: uploaded.etag
      });
      try {
        this.materializeAndRecordConflict({
          candidate,
          conflict,
          precondition,
          uploaded
        });
      } catch (postCommitError) {
        summary.errors.push({
          relPath: candidate.relPath,
          code: postCommitError instanceof AgentStoreSyncError ? postCommitError.code : "upload_failed",
          message: postCommitError instanceof Error ? postCommitError.message : String(postCommitError)
        });
      }
    });
  }
  /**
   * On a lost conditional write, compare the current remote bytes with the
   * already-hashed candidate. A match means the write is logically complete:
   * record the GET-observed ETag as the new baseline and skip the redundant
   * conflict object. Any probe/transfer failure falls back to normal conflict
   * preservation; round cancellation still propagates.
   */
  trySuppressIdenticalWriteConflict(candidate, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      var _b2, _c2;
      if (candidate.size > DEFAULT_IDENTICAL_CONFLICT_COMPARE_MAX_BYTES) {
        return false;
      }
      let response;
      try {
        const reads = yield this.runQueued(this.queues.presign, () => this.client.presignReads({
          agentId: this.agentId,
          relPaths: [candidate.relPath],
          signal: this.activeRoundSignal
        }));
        const presign = reads[0];
        if (presign === void 0 || normalizeRelPath(presign.relPath) !== candidate.relPath) {
          return false;
        }
        this.assertPresignedUrlSafe({
          rawUrl: presign.url,
          relPath: candidate.relPath
        });
        response = yield this.runQueued(this.queues.s3, () => __awaiter16(this, void 0, void 0, function* () {
          this.throwIfRoundAborted(candidate.relPath);
          return yield this.fetchImpl(presign.url, Object.assign({ redirect: "error" }, this.activeRoundSignal !== void 0 ? { signal: this.activeRoundSignal } : {}));
        }));
        if (response.status !== 200) {
          return false;
        }
        const remoteEtag = normalizeS3Etag((_b2 = response.headers.get("etag")) !== null && _b2 !== void 0 ? _b2 : void 0);
        if (remoteEtag.length === 0) {
          return false;
        }
        const remoteHash = (0, import_node_crypto4.createHash)("sha256");
        let remoteSize = 0;
        if (response.body !== null) {
          const reader = response.body.getReader();
          try {
            for (; ; ) {
              const next = yield reader.read();
              if (next.done) {
                break;
              }
              remoteSize += next.value.byteLength;
              if (remoteSize > Math.min(candidate.size, DEFAULT_IDENTICAL_CONFLICT_COMPARE_MAX_BYTES)) {
                yield reader.cancel();
                return false;
              }
              remoteHash.update(next.value);
            }
          } finally {
            reader.releaseLock();
          }
        }
        if (remoteSize !== candidate.size || remoteHash.digest("hex") !== candidate.sha) {
          return false;
        }
        const current = yield streamHashFileNoFollow({
          absPath: candidate.absPath,
          maxBytes: this.maxFileSizeBytes,
          expectedDev: candidate.dev,
          expectedIno: candidate.ino
        });
        if (current.size !== candidate.size || current.sha !== candidate.sha) {
          return false;
        }
        this.clearPushPark(candidate.relPath);
        this.throwIfRoundAborted(candidate.relPath);
        summary.identicalContentConflictsSuppressed = ((_c2 = summary.identicalContentConflictsSuppressed) !== null && _c2 !== void 0 ? _c2 : 0) + 1;
        this.index.upsertFile({
          relPath: candidate.relPath,
          lastSeenEtag: remoteEtag,
          lastSyncedSha: candidate.sha,
          size: candidate.size,
          lastSyncedMs: this.now(),
          direction: "pushed"
        });
        return true;
      } catch (error41) {
        this.rethrowIfRoundAbort(error41, candidate.relPath);
        return false;
      } finally {
        yield (_a19 = response === null || response === void 0 ? void 0 : response.body) === null || _a19 === void 0 ? void 0 : _a19.cancel().catch(() => {
        });
      }
    });
  }
  materializeAndRecordConflict(args) {
    var _a19, _b2;
    const { candidate, conflict, precondition, uploaded } = args;
    try {
      this.materializeConflictBookkeeping({
        candidate,
        conflict,
        precondition,
        uploaded
      });
    } finally {
      (_b2 = (_a19 = this.client).invalidateListCache) === null || _b2 === void 0 ? void 0 : _b2.call(_a19, { agentId: this.agentId });
    }
  }
  materializeConflictBookkeeping(args) {
    var _a19, _b2;
    const { candidate, conflict, precondition, uploaded } = args;
    const materialized2 = this.materializeConflictRename(candidate, conflict.relPath);
    this.emitConflictJournalEvent({
      candidate,
      conflictRelPath: conflict.relPath,
      precondition,
      remoteOnly: materialized2 === void 0
    });
    if (materialized2 !== void 0) {
      this.index.upsertFile({
        relPath: materialized2.canonicalRelPath,
        lastSeenEtag: uploaded.etag,
        lastSyncedSha: candidate.sha,
        size: candidate.size,
        lastSyncedMs: this.now(),
        direction: "pushed"
      });
      const legacyEtag = (_a19 = candidate.existing) === null || _a19 === void 0 ? void 0 : _a19.lastSeenEtag;
      if (candidate.existing !== void 0 && (legacyEtag === void 0 || legacyEtag.length === 0)) {
        this.index.upsertFile(Object.assign(Object.assign({}, candidate.existing), { lastSeenEtag: uploaded.etag, lastSyncedSha: candidate.sha, size: candidate.size, lastSyncedMs: this.now(), direction: "pushed" }));
      }
    } else {
      const priorEtag = (_b2 = candidate.existing) === null || _b2 === void 0 ? void 0 : _b2.lastSeenEtag;
      this.index.upsertFile({
        relPath: candidate.relPath,
        lastSeenEtag: priorEtag !== void 0 && priorEtag.length > 0 ? priorEtag : uploaded.etag,
        lastSyncedSha: candidate.sha,
        size: candidate.size,
        lastSyncedMs: this.now(),
        direction: "pushed"
      });
    }
  }
  emitConflictJournalEvent(args) {
    const kind = args.precondition.expectAbsent === true ? "create_conflict" : "write_conflict";
    let conflictAbsPath;
    try {
      conflictAbsPath = resolveSafeChildPath({
        base: this.filesDir,
        relPath: normalizeRelPath(args.conflictRelPath)
      });
    } catch (_a19) {
      conflictAbsPath = void 0;
    }
    const emit = {
      kind,
      storeId: this.agentId,
      originalRelPath: args.candidate.relPath,
      conflictRelPath: args.conflictRelPath,
      originalAbsPath: args.candidate.absPath,
      conflictAbsPath,
      preservedBytes: args.candidate.size,
      source: "local_sync",
      remoteOnly: args.remoteOnly
    };
    this.emitConflictJournalEventWithRetry(emit);
  }
  /**
   * Shared retry+durable-queue path for every conflict emit. The remote
   * conflict object is already committed, so the journal must not silently
   * drop the notice. `emit` warns internally on the first failure and leaves
   * the dedup key unrecorded; retry once inline, then durably queue the emit
   * so a later push round (or a fresh engine after restart) retries even if
   * index bookkeeping makes the conflict file look fully synced.
   */
  emitConflictJournalEventWithRetry(emit) {
    if (this.tryEmitConflictJournalEvent(emit)) {
      return;
    }
    if (this.tryEmitConflictJournalEvent(emit)) {
      return;
    }
    this.enqueuePendingConflictJournalEmit(emit);
    this.warn(`conflict journal append or dedup refresh failed after retry for ${hashRelPath({
      relPath: emit.originalRelPath,
      salt: this.pathHashSalt
    })}; conflict preserved remotely and event queued for next push round (failures=${this.conflictJournal.appendFailureCount()})`, void 0);
  }
  /**
   * Append `emit` and, on a size-triggered rotation that wiped earlier
   * same-round lines, re-queue every emit journaled this round (including
   * `emit`) into the pending sidecar. Rotation is checked even when the
   * append fails: `maybeRotateLocked` can wipe prior same-round lines
   * before a subsequent append error, and an early return would drop them.
   */
  tryEmitConflictJournalEvent(emit) {
    if (!this.conflictJournal.refreshDedupFromDisk()) {
      return false;
    }
    const alreadyDeduped = this.conflictJournal.wouldDedup(emit);
    const rotationsBefore = this.conflictJournal.rotationCount();
    const ok = this.conflictJournal.emit(emit);
    if (this.conflictJournal.rotationCount() !== rotationsBefore) {
      for (const prior of this.roundJournaledConflictEmits) {
        this.enqueuePendingConflictJournalEmit(prior);
      }
      if (!alreadyDeduped) {
        this.enqueuePendingConflictJournalEmit(emit);
      }
      this.roundJournaledConflictEmits = [];
      this.warn(`conflict journal rotated during emit; re-queued same-round notice(s) into the pending sidecar so a rotation cannot wipe a just-flushed event with nothing left to retry`, void 0);
      return ok;
    }
    if (!ok) {
      return false;
    }
    if (alreadyDeduped) {
      return true;
    }
    this.roundJournaledConflictEmits.push(emit);
    this.enqueuePendingConflictJournalEmit(emit);
    return true;
  }
  enqueuePendingConflictJournalEmit(emit) {
    this.pendingConflictJournal.enqueue(emit);
  }
  /**
   * Best-effort: retry every durably-queued emit against the journal and
   * durably rewrite the sidecar with only the ones that still fail. Callers
   * must hold the write lock (or run lock-free) so the shared journal's
   * single-appender invariant holds.
   *
   * Successfully journaled rows stay in the sidecar as same-round durable
   * mirrors (matching {@link tryEmitConflictJournalEvent}) so a later
   * size-triggered rotation crash cannot leave notices in neither file.
   * Dedup hits are not pushed into {@link roundJournaledConflictEmits} —
   * that would resurrect prior-round events on the next rotation.
   * {@link stripJournaledPendingConflictMirrors} removes mirrors once the
   * round (or shutdown flush) is done.
   */
  flushPendingConflictJournalEmits() {
    this.pendingConflictJournal.reload();
    if (!this.conflictJournal.refreshDedupFromDisk()) {
      return;
    }
    if (this.pendingConflictJournal.isEmpty()) {
      return;
    }
    const pending = this.pendingConflictJournal.list();
    const rotationsBefore = this.conflictJournal.rotationCount();
    const stillPending = [];
    const newlyJournaled = [];
    const durableMirrors = [];
    let failures = 0;
    for (const emit of pending) {
      const alreadyDeduped = this.conflictJournal.wouldDedup(emit);
      if (!this.conflictJournal.emit(emit)) {
        failures++;
        stillPending.push(emit);
      } else {
        durableMirrors.push(emit);
        if (!alreadyDeduped) {
          newlyJournaled.push(emit);
        }
      }
    }
    if (this.conflictJournal.rotationCount() !== rotationsBefore) {
      this.warn(`conflict journal rotated during pending flush; keeping ${this.pendingConflictJournal.size()} queued event(s) for the next push round to avoid losing a rotated notice`, void 0);
      return;
    }
    this.roundJournaledConflictEmits.push(...newlyJournaled);
    this.pendingConflictJournal.replaceAll([
      ...stillPending,
      ...durableMirrors
    ]);
    if (failures > 0) {
      this.warn(`conflict journal pending retry failed for ${failures} event(s); will retry on the next push round (pending=${this.pendingConflictJournal.size()}, failures=${this.conflictJournal.appendFailureCount()})`, void 0);
    }
  }
  /**
   * Drop pending sidecar rows that are already present in the journal dedup
   * set. Used at push-round boundaries (and after shutdown flush) so
   * same-round durable mirrors do not accumulate across rounds or get
   * mistaken for fresh appends.
   */
  stripJournaledPendingConflictMirrors() {
    this.pendingConflictJournal.reload();
    if (!this.conflictJournal.refreshDedupFromDisk()) {
      return;
    }
    if (this.pendingConflictJournal.isEmpty()) {
      return;
    }
    const remaining = [];
    for (const emit of this.pendingConflictJournal.list()) {
      if (!this.conflictJournal.wouldDedup(emit)) {
        remaining.push(emit);
      }
    }
    if (remaining.length !== this.pendingConflictJournal.size()) {
      this.pendingConflictJournal.replaceAll(remaining);
    }
  }
  /**
   * True when the conflict journal and pending sidecar leaves are safe to
   * open for a shutdown flush (missing is fine; a planted symlink is not).
   */
  conflictJournalPathsSafeForShutdownFlush() {
    for (const targetPath of [
      this.conflictJournal.path,
      this.pendingConflictJournal.path
    ]) {
      try {
        if (fs8.lstatSync(targetPath).isSymbolicLink()) {
          return false;
        }
      } catch (error41) {
        if (!isNodeError4(error41) || error41.code !== "ENOENT") {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * Attempt a pending flush during pause / dispose so a shutdown does not
   * strand a committed conflict in the sidecar until the next engine start.
   * Only appends when this engine can legally append to the shared journal
   * (no lock provider, or the write lock is held); otherwise the durable
   * sidecar keeps the emits for a later lock-holding engine.
   * Skips entirely when a journal/pending leaf is a symlink so invalidate
   * teardown cannot follow a planted path into the real journal.
   */
  attemptPendingConflictJournalFlushForShutdown() {
    if (this.lockProvider !== void 0 && this.lockHandle === void 0) {
      return;
    }
    if (!this.conflictJournalPathsSafeForShutdownFlush()) {
      this.warn("conflict journal shutdown flush skipped; journal or pending sidecar path is not a safe regular file", void 0);
      return;
    }
    this.flushPendingConflictJournalEmits();
    this.stripJournaledPendingConflictMirrors();
  }
  emitConflictFallbackFailed(args) {
    this.emitConflictJournalEventWithRetry({
      kind: "conflict_fallback_failed",
      storeId: this.agentId,
      originalRelPath: args.candidate.relPath,
      originalAbsPath: args.candidate.absPath,
      source: "local_sync"
    });
  }
  uploadFreshLegacyConflict(candidate, precondition, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      yield this.assertRoundStillOwnsLock(candidate.relPath, {
        bypassCache: true
      });
      return yield this.withFreshLegacyPresign({
        candidate,
        precondition,
        summary,
        operation: (instruction) => __awaiter16(this, void 0, void 0, function* () {
          if (instruction.conflict === void 0) {
            throw new AgentStoreSyncError({
              code: "write_conflict",
              relPath: candidate.relPath,
              message: `Conflict write for ${candidate.relPath} collided and the fresh presign returned no usable conflict instruction`
            });
          }
          const conflict = instruction.conflict;
          return {
            conflict,
            uploaded: yield this.uploadConflict(candidate, conflict, summary)
          };
        })
      });
    });
  }
  uploadConflict(candidate, conflict, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      this.assertPresignedUrlSafe({
        rawUrl: conflict.url,
        relPath: conflict.relPath
      });
      return yield this.runQueued(this.queues.s3, () => __awaiter16(this, void 0, void 0, function* () {
        this.throwIfRoundAborted(conflict.relPath);
        this.assertPresignedUrlNotExpired({
          expiresAtMs: conflict.expiresAtMs,
          relPath: conflict.relPath
        });
        yield this.assertRoundStillOwnsLock(candidate.relPath, {
          bypassCache: true
        });
        return yield this.blobTransfer.uploadFile({
          url: conflict.url,
          relPath: conflict.relPath,
          absPath: candidate.absPath,
          sha: candidate.sha,
          size: candidate.size,
          expectedDev: candidate.dev,
          expectedIno: candidate.ino,
          presignHeaders: conflict.headers,
          signal: this.activeRoundSignal
        });
      }));
    });
  }
  /** Move unsynced bytes beside `relPath` before applying a RO tombstone. */
  parkUnsyncedBytesBesidePath(args) {
    return this.parkUnsyncedBytesAtRelPath({
      absPath: args.absPath,
      parkedRelPath: localParkedConflictRelPath(args.relPath)
    });
  }
  /**
   * Park leftover edits outside a removed prefix so a reused file can
   * land at that name. A beside-path park would stay under the prefix.
   */
  parkUnsyncedBytesOutsideRemovedDir(args) {
    return this.parkUnsyncedBytesAtRelPath({
      absPath: args.absPath,
      parkedRelPath: localParkedConflictRelPath(hoistRelPathOutOfDir({ relPath: args.relPath, dir: args.dir }))
    });
  }
  parkUnsyncedBytesAtRelPath(args) {
    const moved = this.materializeConflictRename({ absPath: args.absPath }, args.parkedRelPath);
    if (moved === void 0) {
      return false;
    }
    let size = 0;
    try {
      size = fs8.lstatSync(resolveSafeChildPath({
        base: this.filesDir,
        relPath: moved.canonicalRelPath
      })).size;
    } catch (_a19) {
    }
    this.index.upsertFile({
      relPath: moved.canonicalRelPath,
      lastSyncedSha: "",
      size,
      lastSyncedMs: this.now(),
      direction: "pushed"
    });
    return true;
  }
  /**
   * Moves the just-uploaded local file to the conflict rel path under
   * `files/` (with the same path-safety guards as the pull path). A rename
   * keeps the inode, so a writer holding an open handle keeps operating on
   * the conflict file instead of being stranded when the pull replaces the
   * original path with the winner. If the file was edited (or even
   * replaced) after the upload, those bytes travel with the rename and the
   * next push round syncs them to the conflict object — its etag is the
   * recorded baseline, so that push is an ordinary compare-and-set. Only a
   * non-regular-file swap (e.g. a symlink planted during the upload) is
   * refused: renaming it to a name the engine treats as synced could mask
   * or leak it. Returns `undefined` on any failure — callers must then skip
   * the local index insert, and the next pull fetches the authoritative
   * conflict bytes from S3.
   */
  materializeConflictRename(candidate, conflictRelPath, options2 = {}) {
    try {
      const canonicalRelPath = normalizeRelPath(conflictRelPath);
      assertWindowsMaterializableRelPath({
        relPath: canonicalRelPath,
        platform: this.platform
      });
      const destAbsPath = resolveSafeChildPath({
        base: this.filesDir,
        relPath: canonicalRelPath
      });
      const parent = path9.dirname(destAbsPath);
      assertParentInsideBase({
        base: this.filesDir,
        parent,
        relPath: canonicalRelPath
      });
      safeCreateDirChain({
        base: this.filesDir,
        target: parent,
        relPath: canonicalRelPath
      });
      assertTargetWritable({
        absPath: destAbsPath,
        relPath: canonicalRelPath
      });
      const sourceStat = fs8.lstatSync(candidate.absPath);
      if (sourceStat.isDirectory()) {
        return void 0;
      }
      if (options2.requireRegularFile !== false && !sourceStat.isFile()) {
        return void 0;
      }
      fs8.renameSync(candidate.absPath, destAbsPath);
      return { canonicalRelPath };
    } catch (_a19) {
      return void 0;
    }
  }
  // Pulled bytes land in `<storeRoot>/.sync/tmp/<random>`, are etag-
  // verified while streaming to disk, and are atomically renamed into
  // `files/`. Every resolved path goes through `resolveSafeChildPath`
  // and every existing target is `lstat`-checked, so a server returning
  // a hostile relPath or pre-planting a symlink under `files/` can't
  // escape the store.
  pullAll() {
    return __awaiter16(this, arguments, void 0, function* (summary = emptySummary()) {
      this.ensureDirsExist();
      const lastCompleteRoundMs = this.lastCompleteRoundMs();
      let listing = yield this.listServerFiles(summary);
      const listStartMs = listing.listStartMs;
      const absenceDecision = this.shouldApplyAbsenceDeletes({
        listingComplete: listing.listingComplete,
        listedWithInclude: listing.listedWithInclude,
        tombstoneFloorMs: listing.tombstoneFloorMs,
        lastCompleteRoundMs
      });
      if (absenceDecision === "needs-include") {
        listing = yield this.listServerFiles(summary, {
          tombstoneMode: AgentStoreTombstoneMode.INCLUDE
        });
      }
      const { files: serverFiles, tombstones, listingComplete, removedSubdirs, tombstoneWatermarkMs, tombstoneFloorMs, listedWithInclude } = listing;
      this.lastPullListingComplete = listingComplete;
      summary.listingComplete = listingComplete;
      const listedApply = yield this.applyRemoteTombstones(tombstones, summary);
      const absenceApply = yield this.applyAbsenceDeletes({
        files: serverFiles,
        tombstones,
        removedSubdirs,
        listingComplete,
        listedWithInclude,
        tombstoneFloorMs,
        lastCompleteRoundMs,
        summary
      });
      this.pruneExpiredTombstoneRows({
        tombstones,
        listingComplete,
        tombstoneFloorMs,
        listedWithInclude
      });
      this.commitTombstoneCursor({
        watermarkMs: tombstoneWatermarkMs,
        listingComplete,
        listedWithInclude,
        deferred: listedApply.deferred,
        summary
      });
      yield this.applyRemovedLocalDirs(removedSubdirs, serverFiles, summary);
      const candidates = this.pullCandidatesFromListing(serverFiles, summary);
      yield this.pullCandidates(candidates, summary);
      this.commitLastCompleteRoundMs({
        listingComplete,
        listStartMs,
        watermarkMs: tombstoneWatermarkMs,
        absenceNeeded: absenceDecision !== "no",
        tombstoneFloorMs,
        absenceDeferred: absenceApply.deferred
      });
      return summary;
    });
  }
  pullDownloadWindow(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      const candidates = args.candidates;
      const summary = args.summary;
      this.throwIfRoundAborted();
      yield this.assertRoundStillOwnsLock(void 0, { bypassCache: true });
      const presignStart = this.monotonicNow();
      const presigned = yield this.runQueued(this.queues.presign, () => this.client.presignReads({
        agentId: this.agentId,
        relPaths: candidates.map((candidate) => candidate.relPath),
        signal: this.activeRoundSignal
      }));
      summary.presignMs = ((_a19 = summary.presignMs) !== null && _a19 !== void 0 ? _a19 : 0) + (this.monotonicNow() - presignStart);
      const presignedByPath = /* @__PURE__ */ new Map();
      for (const presign of presigned) {
        let canonical;
        try {
          canonical = normalizeRelPath(presign.relPath);
        } catch (error41) {
          summary.errors.push({
            relPath: presign.relPath,
            code: "presign_response_mismatch",
            message: `Server returned an unsafe relPath: ${presign.relPath} (${error41.message})`
          });
          continue;
        }
        presignedByPath.set(canonical, presign);
      }
      yield Promise.all(candidates.map((candidate) => this.queues.s3.enqueue(() => __awaiter16(this, void 0, void 0, function* () {
        yield this.assertRoundStillOwnsLock(candidate.relPath, {
          bypassCache: true
        });
        const presign = presignedByPath.get(candidate.relPath);
        if (presign === void 0) {
          summary.errors.push({
            relPath: candidate.relPath,
            code: "presign_response_mismatch",
            message: `Server returned no presigned URL for ${candidate.relPath}`
          });
          return;
        }
        try {
          const downloaded = yield this.downloadOne(candidate, presign);
          if (downloaded.kind === "deferred") {
            summary.pullsDeferred++;
            return;
          }
          this.throwIfRoundAborted(candidate.relPath);
          summary.filesPulled++;
          summary.bytesPulled += downloaded.size;
          this.index.upsertFile({
            relPath: candidate.relPath,
            lastSeenEtag: candidate.serverEtag,
            lastSyncedSha: downloaded.sha,
            size: downloaded.size,
            lastSyncedMs: this.now(),
            direction: "pulled"
          });
        } catch (error41) {
          this.rethrowIfRoundAbort(error41, candidate.relPath);
          this.rethrowIfLockLost(error41);
          summary.errors.push(Object.assign({ relPath: candidate.relPath, code: error41 instanceof AgentStoreSyncError ? error41.code : "download_failed", message: error41 instanceof Error ? error41.message : String(error41) }, timeoutClassEntry(error41)));
        }
      }))));
    });
  }
  // BFS over server-side directories, honoring the per-dir
  // `{files, subdirs}` contract on `IAgentStoreClient.listFiles`.
  // `seenDirs` guards a transport that returns a directory as one of its
  // own `subdirs`; `seenFiles` lets us also tolerate transports that return
  // a flat prefix scan, so the same file may show up at multiple BFS levels.
  // Dedupe by the canonical form when
  // available so `foo/bar.txt` and `foo//bar.txt` collapse to one entry;
  // unparseable paths fall back to their raw key (refusal-bound below).
  listServerFiles(summary, options2) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19, _b2;
      const listStartMs = this.now();
      let listingMode;
      if ((options2 === null || options2 === void 0 ? void 0 : options2.tombstoneMode) === AgentStoreTombstoneMode.OMIT) {
        listingMode = {
          include: false,
          request: { tombstoneMode: AgentStoreTombstoneMode.OMIT }
        };
      } else if ((options2 === null || options2 === void 0 ? void 0 : options2.tombstoneMode) === AgentStoreTombstoneMode.INCLUDE) {
        listingMode = {
          include: true,
          request: { tombstoneMode: AgentStoreTombstoneMode.INCLUDE }
        };
      } else {
        listingMode = this.tombstoneListingMode();
      }
      const files = [];
      const seenFiles = /* @__PURE__ */ new Set();
      const tombstones = /* @__PURE__ */ new Map();
      const removedSubdirs = /* @__PURE__ */ new Set();
      let listingComplete = true;
      let tombstoneWatermarkMs;
      let tombstoneFloorMs;
      let sawListingClock = false;
      const pending = [""];
      const seenDirs = /* @__PURE__ */ new Set([""]);
      while (pending.length > 0) {
        const dir = pending.shift();
        this.throwIfRoundAborted();
        let listing;
        try {
          listing = yield this.queues.list.enqueue(() => this.client.listFiles(Object.assign({ agentId: this.agentId, relPath: dir, signal: this.activeRoundSignal }, listingMode.request)));
        } catch (error41) {
          this.rethrowIfRoundAbort(error41);
          throw error41;
        }
        this.throwIfRoundAborted();
        if (listing.listingComplete !== true) {
          listingComplete = false;
        }
        const nextWatermark = protoPositiveMs2(listing.tombstoneWatermarkMs);
        const nextFloor = protoPositiveMs2(listing.tombstoneFloorMs);
        if (!sawListingClock) {
          tombstoneWatermarkMs = nextWatermark;
          tombstoneFloorMs = nextFloor;
          sawListingClock = true;
        } else {
          tombstoneWatermarkMs = minDefinedMs2(tombstoneWatermarkMs, nextWatermark);
          tombstoneFloorMs = minDefinedMs2(tombstoneFloorMs, nextFloor);
        }
        for (const removed of (_a19 = listing.removedSubdirs) !== null && _a19 !== void 0 ? _a19 : []) {
          let canonical;
          try {
            canonical = normalizeRelPath(removed);
          } catch (_c2) {
            continue;
          }
          removedSubdirs.add(canonical);
          if (this.index.hasLiveDescendantFiles(canonical)) {
            this.enqueueRemovedDirWalk(canonical, pending, seenDirs);
          }
        }
        const listedUnderRemoved = [...removedSubdirs].some((marker17) => dir === marker17 || dir.startsWith(`${marker17}/`));
        if (!listedUnderRemoved) {
          for (const file2 of listing.files) {
            let dedupKey;
            try {
              dedupKey = normalizeRelPath(file2.relPath);
            } catch (_d) {
              dedupKey = file2.relPath;
            }
            if (seenFiles.has(dedupKey))
              continue;
            if (isLeftoverHiddenByRemovedPrefix({
              relPath: dedupKey,
              listedDir: dir,
              removed: removedSubdirs
            })) {
              continue;
            }
            seenFiles.add(dedupKey);
            files.push(file2);
          }
        }
        for (const tombstone of (_b2 = listing.tombstones) !== null && _b2 !== void 0 ? _b2 : []) {
          let canonical;
          try {
            canonical = normalizeRelPath(tombstone.relPath);
          } catch (_e2) {
            summary.refusals++;
            continue;
          }
          if (!tombstones.has(canonical)) {
            tombstones.set(canonical, Object.assign(Object.assign({}, tombstone), { relPath: canonical }));
          }
        }
        for (const sub of listing.subdirs) {
          let canonical;
          try {
            canonical = normalizeRelPath(sub);
          } catch (error41) {
            summary.errors.push({
              relPath: sub,
              code: "presign_response_mismatch",
              message: `Server returned an unsafe subdir: ${sub} (${error41.message})`
            });
            continue;
          }
          if (seenDirs.has(canonical))
            continue;
          if ([...removedSubdirs].some((marker17) => canonical === marker17 || canonical.startsWith(`${marker17}/`))) {
            continue;
          }
          seenDirs.add(canonical);
          pending.push(canonical);
        }
      }
      const tombstoneList = [...tombstones.values()];
      summary.tombstonesReceived = tombstoneList.length;
      return {
        files,
        tombstones: tombstoneList,
        listingComplete,
        removedSubdirs: [...removedSubdirs],
        tombstoneWatermarkMs,
        tombstoneFloorMs,
        listedWithInclude: listingMode.include,
        listStartMs
      };
    });
  }
  /**
   * List a removed directory and every index-known descendant dir under it.
   * Parent markers hide child `subdirs`/`removedSubdirs`, so paginated
   * exact-path tombstones only appear when those nested dirs are listed.
   */
  enqueueRemovedDirWalk(dir, pending, seenDirs) {
    if (!seenDirs.has(dir)) {
      seenDirs.add(dir);
      pending.push(dir);
    }
    for (const entry of this.index.listFiles()) {
      if (entry.state === "tombstoned") {
        continue;
      }
      if (!isUnderDir({ relPath: entry.relPath, dir })) {
        continue;
      }
      let current = parentRelPath(entry.relPath);
      while (current !== void 0 && current !== "") {
        if (!isUnderDir({ relPath: current, dir })) {
          break;
        }
        if (!seenDirs.has(current)) {
          seenDirs.add(current);
          pending.push(current);
        }
        current = parentRelPath(current);
      }
    }
  }
  /**
   * `rmdirSync` empty local folders that the server marked removed, then
   * walk empty parents toward the mirror root. Non-empty dirs stay.
   */
  applyRemovedLocalDirs(removedDirs, serverFiles, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      const reusedExact = /* @__PURE__ */ new Set();
      for (const file2 of serverFiles) {
        try {
          reusedExact.add(normalizeRelPath(file2.relPath));
        } catch (_a19) {
        }
      }
      const sorted = [...new Set(removedDirs)].sort(compareRelPathDepthDesc);
      for (const dir of sorted) {
        if (dir === "") {
          continue;
        }
        this.index.removePendingRmdir(dir);
        if (reusedExact.has(dir)) {
          yield this.clearLeftoverDescendantsForReusedFile(dir, summary);
          this.rmdirLocalEmptyAncestors(dir, summary);
          continue;
        }
        if (this.hasLiveIndexRowsUnder(dir)) {
          continue;
        }
        this.rmdirLocalEmptyAncestors(dir, summary);
      }
    });
  }
  clearLeftoverDescendantsForReusedFile(dir, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      for (const entry of this.index.listFiles()) {
        if (entry.state === "tombstoned" || entry.relPath === dir) {
          continue;
        }
        if (!isUnderDir({ relPath: entry.relPath, dir })) {
          continue;
        }
        const verified = verifiedLeftoverLeaf({
          base: this.filesDir,
          relPath: entry.relPath
        });
        if (verified.kind === "absent") {
          this.index.deleteFile(entry.relPath);
          continue;
        }
        if (verified.kind === "refused") {
          summary.errors.push({
            relPath: entry.relPath,
            code: "not_regular_file",
            message: verified.message
          });
          continue;
        }
        const absPath = verified.leafAbs;
        let stat28;
        try {
          stat28 = fs8.lstatSync(absPath);
        } catch (error41) {
          if (!isNodeError4(error41) || error41.code !== "ENOENT") {
            summary.errors.push({
              relPath: entry.relPath,
              code: "fs_read_failed",
              message: error41 instanceof Error ? error41.message : String(error41)
            });
            continue;
          }
          this.index.deleteFile(entry.relPath);
          continue;
        }
        if (stat28.isSymbolicLink() || !stat28.isFile()) {
          if (stat28.isDirectory()) {
            continue;
          }
          const relocated = this.relocateBlockerOutsideRemovedDir({
            absPath,
            relPath: entry.relPath,
            dir
          });
          if (!relocated) {
            summary.errors.push({
              relPath: entry.relPath,
              code: "fs_write_failed",
              message: `Failed to park leftover ${entry.relPath} under reused ${dir}`
            });
            continue;
          }
          this.index.deleteFile(entry.relPath);
          continue;
        }
        let localSha;
        try {
          const hashed = yield streamHashFileNoFollow({
            absPath,
            maxBytes: this.maxFileSizeBytes,
            expectedDev: stat28.dev,
            expectedIno: stat28.ino
          });
          localSha = hashed.sha;
        } catch (error41) {
          summary.errors.push({
            relPath: entry.relPath,
            code: error41 instanceof AgentStoreSyncError ? error41.code : "fs_read_failed",
            message: error41 instanceof Error ? error41.message : String(error41)
          });
          continue;
        }
        const stillVerified = verifiedLeftoverLeaf({
          base: this.filesDir,
          relPath: entry.relPath
        });
        if (stillVerified.kind !== "ready" || stillVerified.leafAbs !== absPath) {
          summary.errors.push({
            relPath: entry.relPath,
            code: "not_regular_file",
            message: `Refusing leftover ${entry.relPath}: parent changed before park or unlink`
          });
          continue;
        }
        if (localSha !== entry.lastSyncedSha) {
          if (!this.parkUnsyncedBytesOutsideRemovedDir({
            absPath,
            relPath: entry.relPath,
            dir
          })) {
            summary.errors.push({
              relPath: entry.relPath,
              code: "fs_write_failed",
              message: `Failed to park leftover ${entry.relPath} under reused ${dir}`
            });
            continue;
          }
        } else {
          try {
            fs8.unlinkSync(absPath);
          } catch (error41) {
            if (!isNodeError4(error41) || error41.code !== "ENOENT") {
              summary.errors.push({
                relPath: entry.relPath,
                code: "fs_write_failed",
                message: `Failed to unlink leftover ${entry.relPath} under reused ${dir}: ${error41 instanceof Error ? error41.message : String(error41)}`
              });
              continue;
            }
          }
          summary.filesDeletedLocal++;
        }
        this.index.deleteFile(entry.relPath);
      }
      this.clearUnindexedDiskLeftoversForReusedFile(dir, summary);
    });
  }
  /**
   * Index rows miss never-synced files. Those leftovers still keep the
   * local directory non-empty, so empty-rmdir refuses and the reused file
   * cannot be pulled. Park them outside the prefix; move other non-directory
   * blockers (symlinks) the same way without treating them as pushable files.
   */
  clearUnindexedDiskLeftoversForReusedFile(dir, summary) {
    const leftovers = this.listDiskNodesUnder(dir, summary);
    leftovers.sort((left, right) => compareRelPathDepthDesc(left.relPath, right.relPath));
    for (const leftover of leftovers) {
      const indexed = this.index.getFile(leftover.relPath);
      if (indexed !== void 0 && indexed.state !== "tombstoned") {
        continue;
      }
      const parked2 = leftover.kind === "file" ? this.parkUnsyncedBytesOutsideRemovedDir({
        absPath: leftover.absPath,
        relPath: leftover.relPath,
        dir
      }) : this.relocateBlockerOutsideRemovedDir({
        absPath: leftover.absPath,
        relPath: leftover.relPath,
        dir
      });
      if (!parked2) {
        summary.errors.push({
          relPath: leftover.relPath,
          code: "fs_write_failed",
          message: `Failed to park unindexed leftover ${leftover.relPath} under reused ${dir}`
        });
        continue;
      }
      if (indexed !== void 0) {
        this.index.deleteFile(leftover.relPath);
      }
    }
  }
  /**
   * Rename a non-directory node that empty-rmdir cannot remove. Unlike a
   * file park, this does not index the destination: a symlink must not
   * become a push candidate.
   */
  relocateBlockerOutsideRemovedDir(args) {
    return this.materializeConflictRename({ absPath: args.absPath }, localParkedConflictRelPath(hoistRelPathOutOfDir({ relPath: args.relPath, dir: args.dir })), { requireRegularFile: false }) !== void 0;
  }
  listDiskNodesUnder(dir, summary) {
    const found = [];
    let root;
    try {
      root = safeLstatDirectory({ base: this.filesDir, relPath: dir });
    } catch (error41) {
      summary.errors.push({
        relPath: dir,
        code: "fs_read_failed",
        message: error41 instanceof Error ? error41.message : String(error41)
      });
      return found;
    }
    if (root.kind !== "directory") {
      return found;
    }
    const pending = [{ relPath: dir, absPath: root.absPath }];
    while (pending.length > 0) {
      const current = pending.pop();
      if (current === void 0) {
        break;
      }
      let names3;
      try {
        const before = fs8.lstatSync(current.absPath);
        if (before.isSymbolicLink() || !before.isDirectory()) {
          summary.errors.push({
            relPath: current.relPath,
            code: "not_regular_file",
            message: `Refusing to walk leftover parent ${current.relPath}: not a directory`
          });
          continue;
        }
        names3 = fs8.readdirSync(current.absPath, { withFileTypes: true });
        const after = fs8.lstatSync(current.absPath);
        if (after.isSymbolicLink() || !after.isDirectory() || after.dev !== before.dev || after.ino !== before.ino) {
          summary.errors.push({
            relPath: current.relPath,
            code: "not_regular_file",
            message: `Refusing to walk leftover parent ${current.relPath}: directory changed during readdir`
          });
          continue;
        }
      } catch (error41) {
        if (isNodeError4(error41) && error41.code === "ENOENT") {
          continue;
        }
        summary.errors.push({
          relPath: current.relPath,
          code: "fs_read_failed",
          message: error41 instanceof Error ? error41.message : String(error41)
        });
        continue;
      }
      for (const entry of names3) {
        if (entry.name === "." || entry.name === ".." || entry.name.length === 0 || entry.name.includes("/") || entry.name.includes("\\")) {
          continue;
        }
        const childRel = current.relPath === "" ? entry.name : `${current.relPath}/${entry.name}`;
        try {
          normalizeRelPath(childRel);
        } catch (error41) {
          summary.errors.push({
            relPath: childRel,
            code: "fs_read_failed",
            message: error41 instanceof Error ? error41.message : String(error41)
          });
          continue;
        }
        const childAbs = path9.join(current.absPath, entry.name);
        let stat28;
        try {
          stat28 = fs8.lstatSync(childAbs);
        } catch (error41) {
          if (isNodeError4(error41) && error41.code === "ENOENT") {
            continue;
          }
          summary.errors.push({
            relPath: childRel,
            code: "fs_read_failed",
            message: error41 instanceof Error ? error41.message : String(error41)
          });
          continue;
        }
        if (stat28.isSymbolicLink() || !stat28.isDirectory()) {
          found.push({
            relPath: childRel,
            absPath: childAbs,
            kind: stat28.isFile() ? "file" : "blocker"
          });
          continue;
        }
        pending.push({ relPath: childRel, absPath: childAbs });
      }
    }
    return found;
  }
  rmdirLocalEmptyAncestors(dirRelPath, summary) {
    var _a19;
    const { removedCount } = rmdirLocalEmptyAncestors({
      base: this.filesDir,
      dirRelPath
    });
    if (removedCount > 0) {
      summary.removedDirsApplied = ((_a19 = summary.removedDirsApplied) !== null && _a19 !== void 0 ? _a19 : 0) + removedCount;
    }
  }
  /**
   * Applies explicit remote deletion signals locally: an unmodified local
   * copy (`sha === lastSyncedSha`) is unlinked and its row marked
   * `tombstoned`; a locally MODIFIED file keeps its bytes and its live row —
   * the next push's conditional PUT 412s into a conflict copy via the
   * existing machinery (deletion stands at the canonical path, edits are
   * preserved beside it), and the tombstone applies on a later round once
   * the path is clear. Rows are recorded for never-synced tombstoned paths
   * too, so a future local create at that path recreates at the original
   * path instead of minting a conflict file. This consumption path is
   * deliberately ungated (mirrors the server's ungated tombstone listing).
   */
  applyRemoteTombstones(tombstones, summary, options2) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19, _b2, _c2;
      const acceptEmptyTombstoneEtag = (options2 === null || options2 === void 0 ? void 0 : options2.acceptEmptyTombstoneEtag) === true;
      let deferred = 0;
      let applied = 0;
      let skippedModified = 0;
      for (const tombstone of tombstones) {
        if (tombstone.tombstoneEtag.length === 0 && !acceptEmptyTombstoneEtag) {
          deferred++;
          continue;
        }
        const relPath = tombstone.relPath;
        const indexEntry = this.index.getFile(relPath);
        if ((indexEntry === null || indexEntry === void 0 ? void 0 : indexEntry.state) === "tombstoned") {
          const tombstoneEtag = recordedTombstoneEtag(tombstone.tombstoneEtag);
          if (tombstoneEtag !== void 0 && indexEntry.tombstoneEtag !== tombstoneEtag) {
            this.index.upsertFile(Object.assign(Object.assign({}, indexEntry), { lastSyncedMs: this.now(), state: "tombstoned", tombstoneEtag, deletedAtMs: tombstone.deletedAtMs > 0 ? tombstone.deletedAtMs : this.now() }));
          }
          continue;
        }
        let absPath;
        try {
          absPath = resolveSafeChildPath({ base: this.filesDir, relPath });
        } catch (error41) {
          summary.refusals++;
          summary.errors.push({
            relPath,
            code: "not_regular_file",
            message: error41 instanceof Error ? error41.message : String(error41)
          });
          deferred++;
          continue;
        }
        let stat28;
        try {
          stat28 = fs8.lstatSync(absPath);
        } catch (error41) {
          if (!isNodeError4(error41) || error41.code !== "ENOENT") {
            summary.errors.push({
              relPath,
              code: "fs_read_failed",
              message: error41 instanceof Error ? error41.message : String(error41)
            });
            deferred++;
            continue;
          }
        }
        if (stat28 !== void 0) {
          if (!stat28.isFile() || stat28.isSymbolicLink()) {
            summary.errors.push({
              relPath,
              code: "not_regular_file",
              message: `Refusing to apply tombstone over non-regular file: ${relPath}`
            });
            deferred++;
            continue;
          }
          if (indexEntry === void 0) {
            if (this.syncMode === "readWrite") {
              deferred++;
              continue;
            }
            const parked2 = this.parkUnsyncedBytesBesidePath({
              absPath,
              relPath
            });
            if (!parked2) {
              deferred++;
              continue;
            }
            summary.filesDeletedLocal++;
            this.index.upsertFile({
              relPath,
              lastSyncedSha: "",
              size: 0,
              lastSyncedMs: this.now(),
              direction: "pulled",
              state: "tombstoned",
              tombstoneEtag: recordedTombstoneEtag(tombstone.tombstoneEtag),
              deletedAtMs: tombstone.deletedAtMs > 0 ? tombstone.deletedAtMs : this.now()
            });
            applied++;
            continue;
          }
          let localSha;
          try {
            const hashed = yield streamHashFileNoFollow({
              absPath,
              maxBytes: this.maxFileSizeBytes,
              expectedDev: stat28.dev,
              expectedIno: stat28.ino
            });
            localSha = hashed.sha;
          } catch (error41) {
            summary.errors.push({
              relPath,
              code: error41 instanceof AgentStoreSyncError ? error41.code : "fs_read_failed",
              message: error41 instanceof Error ? error41.message : String(error41)
            });
            deferred++;
            continue;
          }
          if (localSha !== indexEntry.lastSyncedSha) {
            if (this.syncMode === "readWrite") {
              deferred++;
              skippedModified++;
              continue;
            }
            const parked2 = this.parkUnsyncedBytesBesidePath({
              absPath,
              relPath
            });
            if (!parked2) {
              deferred++;
              continue;
            }
          }
          const sameRoundConflict = summary.conflicts.find((entry) => entry.relPath === relPath);
          if (sameRoundConflict !== void 0) {
            const moved = this.materializeConflictRename({ absPath }, sameRoundConflict.conflictRelPath);
            if (moved === void 0) {
              deferred++;
              continue;
            }
            this.index.upsertFile({
              relPath: moved.canonicalRelPath,
              // Use the conflict object's upload etag, not the original
              // path's stale pre-delete etag — compare-and-set against the
              // conflict object must match what handleWriteConflict records.
              lastSeenEtag: sameRoundConflict.conflictEtag,
              lastSyncedSha: localSha,
              size: stat28.size,
              lastSyncedMs: this.now(),
              direction: "pushed"
            });
          } else {
            try {
              fs8.unlinkSync(absPath);
            } catch (error41) {
              if (!isNodeError4(error41) || error41.code !== "ENOENT") {
                summary.errors.push({
                  relPath,
                  code: "fs_write_failed",
                  message: `Failed to unlink remotely deleted ${relPath}: ${error41 instanceof Error ? error41.message : String(error41)}`
                });
                deferred++;
                continue;
              }
            }
            summary.filesDeletedLocal++;
          }
        }
        this.index.upsertFile(Object.assign(Object.assign({ relPath, lastSyncedSha: (_a19 = indexEntry === null || indexEntry === void 0 ? void 0 : indexEntry.lastSyncedSha) !== null && _a19 !== void 0 ? _a19 : "" }, (indexEntry === null || indexEntry === void 0 ? void 0 : indexEntry.lastSeenEtag) !== void 0 ? { lastSeenEtag: indexEntry.lastSeenEtag } : {}), { size: (_b2 = indexEntry === null || indexEntry === void 0 ? void 0 : indexEntry.size) !== null && _b2 !== void 0 ? _b2 : 0, lastSyncedMs: this.now(), direction: (_c2 = indexEntry === null || indexEntry === void 0 ? void 0 : indexEntry.direction) !== null && _c2 !== void 0 ? _c2 : "pulled", state: "tombstoned", tombstoneEtag: recordedTombstoneEtag(tombstone.tombstoneEtag), deletedAtMs: tombstone.deletedAtMs > 0 ? tombstone.deletedAtMs : this.now() }));
        applied++;
      }
      return { deferred, applied, skippedModified };
    });
  }
  /**
   * INCLUDE until a cursor exists, then SINCE that cursor. Every Nth round,
   * or when the last INCLUDE is older than the configured interval, fetch
   * the full set so a SINCE filter bug cannot starve deletes. A slow client
   * that rarely runs rounds still refreshes on the wall-clock interval.
   */
  tombstoneListingMode() {
    const cursorMs = parsePositiveMetaMs(this.index.getMeta(META_TOMBSTONE_CURSOR_MS));
    const refreshEvery = this.tombstoneFullRefreshRounds();
    const roundsSinceInclude = parseNonNegativeMetaInt(this.index.getMeta(META_TOMBSTONE_ROUNDS_SINCE_INCLUDE));
    const lastIncludeMs = parsePositiveMetaMs(this.index.getMeta(META_TOMBSTONE_LAST_INCLUDE_MS));
    const refreshIntervalMs = this.tombstoneFullRefreshIntervalMs();
    const includeStale = refreshIntervalMs > 0 && cursorMs !== void 0 && (lastIncludeMs === void 0 || this.now() - lastIncludeMs >= refreshIntervalMs);
    if (cursorMs === void 0 || refreshEvery <= 1 || roundsSinceInclude + 1 >= refreshEvery || includeStale) {
      return {
        include: true,
        request: { tombstoneMode: AgentStoreTombstoneMode.INCLUDE }
      };
    }
    return {
      include: false,
      request: {
        tombstoneMode: AgentStoreTombstoneMode.SINCE,
        tombstonesSinceMs: cursorMs
      }
    };
  }
  tombstoneFullRefreshRounds() {
    return this.tombstoneFullRefreshRoundsValue;
  }
  tombstoneFullRefreshIntervalMs() {
    return this.tombstoneFullRefreshIntervalMsValue;
  }
  tombstonePruneSlackMs() {
    return this.tombstonePruneSlackMsValue;
  }
  /**
   * Persist the round's min watermark after tombstones have been applied.
   * Incomplete walks skip all writes. A complete INCLUDE still records the
   * refresh clocks so a deferred apply cannot pin later rounds to INCLUDE;
   * the cursor itself stays put until every tombstone is applied.
   */
  commitTombstoneCursor(args) {
    if (!args.listingComplete) {
      return;
    }
    if (args.listedWithInclude) {
      this.index.setMeta({
        key: META_TOMBSTONE_ROUNDS_SINCE_INCLUDE,
        value: "0"
      });
      this.index.setMeta({
        key: META_TOMBSTONE_LAST_INCLUDE_MS,
        value: String(this.now())
      });
    }
    if (args.watermarkMs === void 0 || args.deferred > 0) {
      return;
    }
    const priorMs = parsePositiveMetaMs(this.index.getMeta(META_TOMBSTONE_CURSOR_MS));
    this.index.setMeta({
      key: META_TOMBSTONE_CURSOR_MS,
      value: String(args.watermarkMs)
    });
    args.summary.tombstoneCursorAdvancedMs = priorMs === void 0 ? 0 : args.watermarkMs - priorMs;
    if (args.listedWithInclude) {
      return;
    }
    const next = parseNonNegativeMetaInt(this.index.getMeta(META_TOMBSTONE_ROUNDS_SINCE_INCLUDE)) + 1;
    this.index.setMeta({
      key: META_TOMBSTONE_ROUNDS_SINCE_INCLUDE,
      value: String(next)
    });
  }
  /**
   * When the server issues a floor, drop `tombstoned` rows older than
   * floor minus slack. Without a floor, fall back to absence from a
   * complete INCLUDE listing plus {@link TOMBSTONE_ROW_RETENTION_MS}.
   * SINCE rounds must not treat "unlisted" as "gone".
   */
  pruneExpiredTombstoneRows({ tombstones, listingComplete, tombstoneFloorMs, listedWithInclude }) {
    var _a19, _b2;
    if (tombstoneFloorMs !== void 0) {
      const cutoffMs2 = tombstoneFloorMs - this.tombstonePruneSlackMs();
      for (const entry of this.index.listFiles()) {
        if (entry.state !== "tombstoned") {
          continue;
        }
        const recordedAtMs = (_a19 = entry.deletedAtMs) !== null && _a19 !== void 0 ? _a19 : entry.lastSyncedMs;
        if (recordedAtMs >= cutoffMs2) {
          continue;
        }
        this.index.deleteFile(entry.relPath);
      }
      return;
    }
    if (!listingComplete || !listedWithInclude) {
      return;
    }
    const listed = new Set(tombstones.map((tombstone) => tombstone.relPath));
    const cutoffMs = this.now() - TOMBSTONE_ROW_RETENTION_MS;
    for (const entry of this.index.listFiles()) {
      if (entry.state !== "tombstoned") {
        continue;
      }
      if (listed.has(entry.relPath)) {
        continue;
      }
      const recordedAtMs = (_b2 = entry.deletedAtMs) !== null && _b2 !== void 0 ? _b2 : entry.lastSyncedMs;
      if (recordedAtMs > cutoffMs) {
        continue;
      }
      this.index.deleteFile(entry.relPath);
    }
  }
  /** Last complete listing's list-start, else index first-open; unset means inert. */
  lastCompleteRoundMs() {
    var _a19;
    return (_a19 = parsePositiveMetaMs(this.index.getMeta(META_LAST_COMPLETE_ROUND_MS))) !== null && _a19 !== void 0 ? _a19 : parsePositiveMetaMs(this.index.getMeta(META_INDEX_CREATED_MS));
  }
  commitLastCompleteRoundMs(args) {
    var _a19;
    if (!args.listingComplete) {
      return;
    }
    if (args.absenceNeeded && args.tombstoneFloorMs === void 0) {
      return;
    }
    if (args.absenceDeferred > 0) {
      return;
    }
    this.index.setMeta({
      key: META_LAST_COMPLETE_ROUND_MS,
      value: String((_a19 = args.watermarkMs) !== null && _a19 !== void 0 ? _a19 : args.listStartMs)
    });
  }
  /**
   * `ready` — complete INCLUDE below the floor.
   * `needs-include` — floor rule applies but this walk was SINCE/OMIT.
   * `no` — absence is not deletion.
   */
  shouldApplyAbsenceDeletes(args) {
    if (!args.listingComplete || args.tombstoneFloorMs === void 0 || args.lastCompleteRoundMs === void 0 || args.lastCompleteRoundMs >= args.tombstoneFloorMs) {
      return "no";
    }
    return args.listedWithInclude ? "ready" : "needs-include";
  }
  /**
   * A client whose last complete round is older than the server floor has
   * been away longer than tombstone retention. On a complete INCLUDE listing,
   * a synced live row that is in neither `files` nor `tombstones` is a
   * delete whose tombstone has already expired.
   */
  applyAbsenceDeletes(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      const floorMs = args.tombstoneFloorMs;
      if (this.shouldApplyAbsenceDeletes({
        listingComplete: args.listingComplete,
        listedWithInclude: args.listedWithInclude,
        tombstoneFloorMs: floorMs,
        lastCompleteRoundMs: args.lastCompleteRoundMs
      }) !== "ready" || floorMs === void 0) {
        return { deferred: 0 };
      }
      const listedFiles = /* @__PURE__ */ new Set();
      for (const file2 of args.files) {
        try {
          listedFiles.add(normalizeRelPath(file2.relPath));
        } catch (_b2) {
          continue;
        }
      }
      const listedTombstones = new Set(args.tombstones.map((tombstone) => tombstone.relPath));
      const synthesized = [];
      for (const entry of this.index.listFiles()) {
        if (entry.state !== "live") {
          continue;
        }
        if (entry.lastSeenEtag === void 0 || entry.lastSeenEtag.length === 0) {
          continue;
        }
        if (isReservedRelPath(entry.relPath)) {
          continue;
        }
        if (this.index.hasPendingDelete(entry.relPath)) {
          continue;
        }
        if (listedFiles.has(entry.relPath) || listedTombstones.has(entry.relPath)) {
          continue;
        }
        if (args.removedSubdirs.some((marker17) => isUnderDir({ relPath: entry.relPath, dir: marker17 }))) {
          continue;
        }
        synthesized.push({
          relPath: entry.relPath,
          tombstoneEtag: "",
          deletedAtMs: floorMs
        });
      }
      const result = yield this.applyRemoteTombstones(synthesized, args.summary, {
        acceptEmptyTombstoneEtag: true
      });
      args.summary.absenceDeletesApplied = result.applied;
      args.summary.absenceDeletesSkippedModified = result.skippedModified;
      const emptiedDirs = /* @__PURE__ */ new Set();
      for (const tombstone of synthesized) {
        if (((_a19 = this.index.getFile(tombstone.relPath)) === null || _a19 === void 0 ? void 0 : _a19.state) !== "tombstoned") {
          continue;
        }
        const parent = parentRelPath(tombstone.relPath);
        if (parent !== void 0 && parent !== "") {
          emptiedDirs.add(parent);
        }
      }
      for (const dir of [...emptiedDirs].sort(compareRelPathDepthDesc)) {
        if (!this.hasLiveIndexRowsUnder(dir)) {
          this.rmdirLocalEmptyAncestors(dir, args.summary);
        }
      }
      return { deferred: result.deferred };
    });
  }
  // Normalize + bounds-check a server-supplied entry. Returns `undefined`
  // (after recording a refusal/error) if the path is unsafe, oversized, or
  // already present locally with a matching etag.
  preparePullCandidate(serverEntry, summary) {
    let canonicalRel;
    let absPath;
    try {
      canonicalRel = normalizeRelPath(serverEntry.relPath);
      assertWindowsMaterializableRelPath({
        relPath: canonicalRel,
        platform: this.platform
      });
      absPath = resolveSafeChildPath({
        base: this.filesDir,
        relPath: canonicalRel
      });
    } catch (error41) {
      summary.refusals++;
      let code = "presign_response_mismatch";
      if (error41 instanceof UnsafeAgentStorePathError) {
        code = error41.code === "windows_incompatible" ? "windows_incompatible" : "not_regular_file";
      }
      summary.errors.push({
        relPath: serverEntry.relPath,
        code,
        message: error41 instanceof Error ? error41.message : String(error41)
      });
      return void 0;
    }
    if (serverEntry.size > this.maxFileSizeBytes) {
      summary.errors.push({
        relPath: canonicalRel,
        code: "file_too_large",
        message: `Server file ${canonicalRel} (${serverEntry.size} bytes) exceeds the ${this.maxFileSizeBytes}-byte cap`
      });
      return void 0;
    }
    const indexEntry = this.index.getFile(canonicalRel);
    if (indexEntry !== void 0 && indexEntry.lastSeenEtag === normalizeS3Etag(serverEntry.etag) && regularFileExistsNoFollow(absPath)) {
      this.index.upsertFile(Object.assign(Object.assign({}, indexEntry), { lastSyncedMs: this.now(), state: "live", tombstoneEtag: void 0, deletedAtMs: void 0 }));
      summary.filesSkipped++;
      return void 0;
    }
    return {
      relPath: canonicalRel,
      absPath,
      serverEtag: normalizeS3Etag(serverEntry.etag),
      serverSize: serverEntry.size
    };
  }
  /**
   * Turn a server listing into pull candidates, applying the guards every
   * pull must honour regardless of scope.
   *
   * Shared so a new pull scope inherits them by construction: the previous
   * arrangement had each scope re-derive the candidate list, and a scope that
   * forgot the pending-delete guard would re-download a path the user had
   * just deleted and fight its unflushed delete.
   */
  pullCandidatesFromListing(serverFiles, summary, wanted) {
    const pendingDeletePaths = new Set(this.index.listPendingDeletes().map((entry) => entry.relPath));
    const candidates = [];
    const caseCollisionKeys = /* @__PURE__ */ new Map();
    for (const serverEntry of serverFiles) {
      let canonical;
      try {
        canonical = normalizeRelPath(serverEntry.relPath);
      } catch (error41) {
        if (wanted === void 0) {
          summary.refusals++;
          summary.errors.push({
            relPath: serverEntry.relPath,
            code: "presign_response_mismatch",
            message: error41 instanceof Error ? error41.message : String(error41)
          });
        }
        continue;
      }
      const collisionKey = canonical.toLowerCase();
      const previous = caseCollisionKeys.get(collisionKey);
      if (previous !== void 0 && previous !== canonical) {
        if (wanted === void 0 || wanted.has(canonical)) {
          summary.errors.push({
            relPath: canonical,
            code: "case_collision",
            message: `Server listing has case-colliding paths: ${previous} and ${canonical}`
          });
        }
        continue;
      }
      caseCollisionKeys.set(collisionKey, canonical);
      if (wanted !== void 0 && !wanted.has(canonical)) {
        continue;
      }
      if (pendingDeletePaths.has(canonical)) {
        summary.pullsSkippedPendingDelete++;
        continue;
      }
      const candidate = this.preparePullCandidate(serverEntry, summary);
      if (candidate !== void 0) {
        candidates.push(candidate);
      }
    }
    return candidates;
  }
  /**
   * Presign and download candidates in sequential windows.
   *
   * Listings can return far more files than one `presignReads` call accepts
   * (server cap `agentStore:maxPresignFiles`). Window N's downloads settle
   * before window N+1 presigns, so a mid-round failure keeps earlier windows
   * indexed and the next round's candidate set shrinks.
   */
  pullCandidates(candidates, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      for (let windowStart = 0; windowStart < candidates.length; windowStart += this.pullPresignWindowSize) {
        yield this.pullDownloadWindow({
          candidates: candidates.slice(windowStart, windowStart + this.pullPresignWindowSize),
          summary
        });
      }
    });
  }
  downloadOne(candidate, presign) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19, _b2, _c2;
      this.assertPresignedUrlSafe({
        rawUrl: presign.url,
        relPath: candidate.relPath
      });
      const roundSignal = this.activeRoundSignal;
      const idleWatch = createBlobIdleWatch(this.blobIdleTimeoutMs);
      const fetchSignal = composeAbortSignals(roundSignal, idleWatch === null || idleWatch === void 0 ? void 0 : idleWatch.signal);
      let response;
      try {
        response = yield this.fetchImpl(presign.url, Object.assign({ method: "GET", redirect: "error" }, fetchSignal !== void 0 ? { signal: fetchSignal } : {}));
      } catch (error41) {
        idleWatch === null || idleWatch === void 0 ? void 0 : idleWatch.clear();
        if ((roundSignal === null || roundSignal === void 0 ? void 0 : roundSignal.aborted) === true) {
          throwForAbortedRoundSignal(candidate.relPath, (_a19 = roundSignal.reason) !== null && _a19 !== void 0 ? _a19 : error41);
        }
        if (isBlobIdleAbortError(error41, idleWatch === null || idleWatch === void 0 ? void 0 : idleWatch.signal)) {
          throw new AgentStoreSyncError({
            code: "download_failed",
            relPath: candidate.relPath,
            timeoutClass: "blob_get",
            message: `blob_get idle timeout after ${this.blobIdleTimeoutMs}ms (url=${redactPresignedUrlString(presign.url)})`
          });
        }
        throw error41;
      }
      if (!response.ok) {
        idleWatch === null || idleWatch === void 0 ? void 0 : idleWatch.clear();
        const body = yield safeReadBody(response);
        throw new AgentStoreSyncError({
          code: "download_failed",
          relPath: candidate.relPath,
          message: `Download of ${candidate.relPath} failed (${response.status} ${response.statusText}, url=${redactPresignedUrlString(presign.url)}): ${body}`
        });
      }
      if (response.body === null) {
        idleWatch === null || idleWatch === void 0 ? void 0 : idleWatch.clear();
        throw new AgentStoreSyncError({
          code: "download_failed",
          relPath: candidate.relPath,
          message: `Download of ${candidate.relPath} returned an empty response body`
        });
      }
      const parent = path9.dirname(candidate.absPath);
      assertParentInsideBase({
        base: this.filesDir,
        parent,
        relPath: candidate.relPath
      });
      safeCreateDirChain({
        base: this.filesDir,
        target: parent,
        relPath: candidate.relPath
      });
      assertTargetWritable({
        absPath: candidate.absPath,
        relPath: candidate.relPath
      });
      const tempName = `${(0, import_node_crypto4.randomBytes)(16).toString("hex")}.bin`;
      const tempPath = resolveSafeChildPath({
        base: this.tmpDir,
        relPath: tempName
      });
      const tempFd = fs8.openSync(tempPath, symlinkSafeWriteFlags(), PRIVATE_FILE_MODE4);
      let observedSize = 0;
      const sha2563 = (0, import_node_crypto4.createHash)("sha256");
      const maxBytes = this.maxFileSizeBytes;
      const sizeTap = new import_node_stream.Transform({
        transform(chunk, _encoding, callback) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          observedSize += buffer.byteLength;
          idleWatch === null || idleWatch === void 0 ? void 0 : idleWatch.rearm();
          if (observedSize > maxBytes) {
            callback(new AgentStoreSyncError({
              code: "file_too_large",
              relPath: candidate.relPath,
              message: `Server returned >${maxBytes} bytes for ${candidate.relPath}`
            }));
            return;
          }
          sha2563.update(buffer);
          callback(null, buffer);
        }
      });
      const writeStream = fs8.createWriteStream("", {
        fd: tempFd,
        // We own the fd lifecycle so we can fsync before rename and close
        // explicitly afterwards. With `autoClose: true` the fd is gone by
        // the time we want to call `fsync` on it.
        autoClose: false
      });
      const rearmIdleOnDrain = () => {
        idleWatch === null || idleWatch === void 0 ? void 0 : idleWatch.rearm();
      };
      let renameSucceeded = false;
      let tempFdClosed = false;
      let downloadedSha = "";
      try {
        try {
          idleWatch === null || idleWatch === void 0 ? void 0 : idleWatch.rearm();
          writeStream.on("drain", rearmIdleOnDrain);
          yield (0, import_promises5.pipeline)(
            // The global `ReadableStream` type and the one expected by
            // `Readable.fromWeb` (from `node:stream/web`) drift between TS
            // lib versions; the runtime shape is identical.
            import_node_stream.Readable.fromWeb(response.body),
            sizeTap,
            writeStream
          );
        } catch (error41) {
          if (error41 instanceof AgentStoreSyncError) {
            throw error41;
          }
          if ((roundSignal === null || roundSignal === void 0 ? void 0 : roundSignal.aborted) === true) {
            throwForAbortedRoundSignal(candidate.relPath, (_b2 = roundSignal.reason) !== null && _b2 !== void 0 ? _b2 : error41);
          }
          if (isBlobIdleAbortError(error41, idleWatch === null || idleWatch === void 0 ? void 0 : idleWatch.signal)) {
            throw new AgentStoreSyncError({
              code: "download_failed",
              relPath: candidate.relPath,
              timeoutClass: "blob_get",
              message: `blob_get idle timeout after ${this.blobIdleTimeoutMs}ms (url=${redactPresignedUrlString(presign.url)})`
            });
          }
          throw new AgentStoreSyncError({
            code: "download_failed",
            relPath: candidate.relPath,
            message: `Streaming ${candidate.relPath} from ${redactPresignedUrlString(presign.url)} failed: ${error41 instanceof Error ? error41.message : String(error41)}`
          });
        } finally {
          writeStream.off("drain", rearmIdleOnDrain);
          idleWatch === null || idleWatch === void 0 ? void 0 : idleWatch.clear();
        }
        try {
          fs8.fsyncSync(tempFd);
        } catch (_d) {
        }
        fs8.closeSync(tempFd);
        tempFdClosed = true;
        const responseEtag = normalizeS3Etag((_c2 = response.headers.get("etag")) !== null && _c2 !== void 0 ? _c2 : void 0);
        if (responseEtag.length === 0) {
          throw new AgentStoreSyncError({
            code: "etag_mismatch",
            relPath: candidate.relPath,
            message: `Download of ${candidate.relPath} returned no ETag header (expected ${candidate.serverEtag})`
          });
        }
        if (responseEtag !== candidate.serverEtag) {
          throw new AgentStoreSyncError({
            code: "etag_mismatch",
            relPath: candidate.relPath,
            message: `Downloaded ${candidate.relPath} etag ${responseEtag}, expected ${candidate.serverEtag}`
          });
        }
        if (observedSize !== candidate.serverSize) {
          throw new AgentStoreSyncError({
            code: "etag_mismatch",
            relPath: candidate.relPath,
            message: `Downloaded ${candidate.relPath} size ${observedSize}, expected ${candidate.serverSize}`
          });
        }
        downloadedSha = sha2563.digest("hex");
        if (this.syncMode === "readWrite" && !(yield this.isLocalFileReplaceable(candidate, downloadedSha))) {
          return { kind: "deferred" };
        }
        try {
          fs8.renameSync(tempPath, candidate.absPath);
          renameSucceeded = true;
        } catch (error41) {
          throw new AgentStoreSyncError({
            code: "fs_write_failed",
            relPath: candidate.relPath,
            message: `Failed to rename staged blob into ${candidate.absPath}: ${error41 instanceof Error ? error41.message : String(error41)}`
          });
        }
        try {
          fs8.chmodSync(candidate.absPath, this.pulledFileMode());
        } catch (_e2) {
        }
      } finally {
        if (!tempFdClosed) {
          try {
            fs8.closeSync(tempFd);
          } catch (_f) {
          }
        }
        if (!renameSucceeded) {
          try {
            fs8.unlinkSync(tempPath);
          } catch (_g) {
          }
        }
      }
      return {
        kind: "downloaded",
        size: observedSize,
        sha: downloadedSha
      };
    });
  }
  /**
   * Whether the pull may replace the local file at the candidate's path:
   * the file is absent (nothing to lose — including the deliberate
   * "delete the local file and the next sync re-fetches it" contract), or
   * its current bytes hash to the index row's `lastSyncedSha` — i.e. they
   * are exactly the bytes the engine recorded at its last push or pull of
   * this path (including this round's push half) — or to the DOWNLOADED
   * bytes themselves, where the rename is a byte-identical no-op. The
   * identical-bytes case is what lets a crashed previous round self-repair:
   * a crash between the pull's rename and its index upsert leaves server
   * bytes on disk with a stale (or missing) row, and only re-pulling can
   * bring the row back in line. Anything else is unsynced local data: a
   * mid-round edit, or a file created after the push walk with no index
   * row at all. The index sha is used rather than a hash remembered from
   * the push phase so the guard also covers standalone `pullAll` calls and
   * paths the push never visited.
   *
   * Errors count as not-replaceable: when in doubt, keep the local bytes
   * and let the next round sort it out.
   */
  isLocalFileReplaceable(candidate, downloadedSha) {
    return __awaiter16(this, void 0, void 0, function* () {
      let stat28;
      try {
        stat28 = fs8.lstatSync(candidate.absPath);
      } catch (error41) {
        if (isNodeError4(error41) && error41.code === "ENOENT") {
          return true;
        }
        return false;
      }
      if (!stat28.isFile()) {
        return false;
      }
      if (stat28.nlink > 1) {
        return true;
      }
      try {
        const { sha } = yield streamHashFileNoFollow({
          absPath: candidate.absPath,
          maxBytes: this.maxFileSizeBytes,
          expectedDev: stat28.dev,
          expectedIno: stat28.ino
        });
        if (sha === downloadedSha) {
          return true;
        }
        const entry = this.index.getFile(candidate.relPath);
        return entry !== void 0 && sha === entry.lastSyncedSha;
      } catch (_a19) {
        return false;
      }
    });
  }
  hashCandidate(candidate) {
    return __awaiter16(this, void 0, void 0, function* () {
      let resolvedAbs;
      try {
        resolvedAbs = resolveSafeChildPath({
          base: this.filesDir,
          relPath: candidate.relPath
        });
      } catch (error41) {
        return {
          kind: "error",
          relPath: candidate.relPath,
          code: "not_regular_file",
          message: error41 instanceof Error ? error41.message : `Unsafe path: ${candidate.relPath}`
        };
      }
      if (resolvedAbs !== candidate.absPath) {
        return {
          kind: "error",
          relPath: candidate.relPath,
          code: "not_regular_file",
          message: `Resolved path ${resolvedAbs} did not match walk-reported path ${candidate.absPath}`
        };
      }
      let size;
      let sha;
      let etag;
      let multipartParts;
      try {
        const result = yield streamHashFileNoFollow(Object.assign({ absPath: candidate.absPath, maxBytes: this.maxFileSizeBytes, expectedDev: candidate.dev, expectedIno: candidate.ino }, candidate.size >= this.multipartUploadThresholdBytes ? { multipartPartSizeBytes: this.multipartPartSizeBytes } : {}));
        size = result.size;
        sha = result.sha;
        etag = result.etag;
        multipartParts = result.multipartParts;
      } catch (error41) {
        if (error41 instanceof AgentStoreSyncError) {
          return {
            kind: "error",
            relPath: candidate.relPath,
            code: error41.code,
            message: error41.message
          };
        }
        return {
          kind: "error",
          relPath: candidate.relPath,
          code: "fs_read_failed",
          message: error41 instanceof Error ? error41.message : `Failed to hash file: ${error41}`
        };
      }
      return Object.assign(Object.assign({
        kind: "hashed",
        relPath: candidate.relPath,
        absPath: candidate.absPath,
        size,
        mtimeMs: candidate.mtimeMs,
        dev: candidate.dev,
        ino: candidate.ino,
        sha,
        etag
      }, multipartParts !== void 0 ? { multipartParts } : {}), { existing: candidate.existing });
    });
  }
  uploadOne(candidate, presign, summary) {
    return __awaiter16(this, void 0, void 0, function* () {
      this.assertPresignedUrlSafe({
        rawUrl: presign.url,
        relPath: candidate.relPath
      });
      return yield this.runQueued(this.queues.s3, () => __awaiter16(this, void 0, void 0, function* () {
        this.throwIfRoundAborted(candidate.relPath);
        this.assertPresignedUrlNotExpired({
          expiresAtMs: presign.expiresAtMs,
          relPath: candidate.relPath
        });
        yield this.assertRoundStillOwnsLock(candidate.relPath, {
          bypassCache: true
        });
        return yield this.blobTransfer.uploadFile({
          url: presign.url,
          relPath: candidate.relPath,
          absPath: candidate.absPath,
          sha: candidate.sha,
          size: candidate.size,
          expectedDev: candidate.dev,
          expectedIno: candidate.ino,
          presignHeaders: presign.headers,
          signal: this.activeRoundSignal
        });
      }));
    });
  }
  assertPresignedUrlNotExpired(args) {
    if (args.expiresAtMs <= this.now()) {
      throw new AgentStoreSyncError({
        code: "presigned_url_expired",
        relPath: args.relPath,
        message: `Presigned upload URL expired before ${args.relPath} could be sent`,
        retryable: false
      });
    }
  }
  // Object args: a positional swap would embed the raw URL (including
  // SigV4 credentials) into the `relPath` field of the error, defeating
  // the redaction this method exists to provide.
  assertPresignedUrlSafe({ rawUrl, relPath }) {
    try {
      assertPresignedUrlSafe({
        rawUrl,
        relPath,
        validatePresignedUrl: this.validatePresignedUrl
      });
    } catch (error41) {
      throw new AgentStoreSyncError({
        code: "presigned_url_rejected",
        relPath,
        message: error41 instanceof Error ? error41.message : String(error41),
        cause: error41 instanceof Error ? error41 : void 0
      });
    }
  }
  ensureDirsExist() {
    fs8.mkdirSync(this.filesDir, { recursive: true, mode: PRIVATE_DIR_MODE });
    fs8.mkdirSync(this.tmpDir, { recursive: true, mode: PRIVATE_DIR_MODE });
  }
};
function isWriteConflictError(error41) {
  return error41 instanceof AgentStoreSyncError && error41.code === "write_conflict";
}
function isPresignedUrlExpiredError(error41) {
  return error41 instanceof AgentStoreSyncError && error41.code === "presigned_url_expired";
}
function presignUsesConflictTarget(presign) {
  return presign.primaryPreconditionFailed === true || presign.lockRedirect !== void 0;
}
function presignHasExpiredLockRedirect(presign, nowMs2) {
  return presign.primaryPreconditionFailed !== true && presign.lockRedirect !== void 0 && presign.lockRedirect.lockExpiresAtMs <= nowMs2;
}
function presignHasConditionalHeaders(presign) {
  var _a19;
  for (const name17 of Object.keys((_a19 = presign.headers) !== null && _a19 !== void 0 ? _a19 : {})) {
    const key = name17.toLowerCase();
    if (key === "if-match" || key === "if-none-match") {
      return true;
    }
  }
  return false;
}
function getHeaderCaseInsensitive(headers, name17) {
  const normalizedName = name17.toLowerCase();
  for (const [headerName, value] of Object.entries(headers)) {
    if (headerName.toLowerCase() === normalizedName) {
      return value;
    }
  }
  return void 0;
}
function syncRoundErrorFor(relPath, error41) {
  return Object.assign({ relPath, code: error41 instanceof AgentStoreSyncError ? error41.code : "upload_failed", message: error41 instanceof Error ? error41.message : String(error41) }, timeoutClassEntry(error41));
}
function noop2() {
}
function localParkedConflictRelPath(relPath) {
  const lastSlash = relPath.lastIndexOf("/");
  const dir = lastSlash >= 0 ? relPath.slice(0, lastSlash + 1) : "";
  const base = lastSlash >= 0 ? relPath.slice(lastSlash + 1) : relPath;
  const lastDot = base.lastIndexOf(".");
  const hasExt = lastDot > 0;
  const stem = hasExt ? base.slice(0, lastDot) : base;
  const ext2 = hasExt ? base.slice(lastDot) : "";
  return `${dir}${stem}.local-conflict.${(0, import_node_crypto4.randomUUID)()}${ext2}`;
}
function filesRootIdentityCompromisedDuringRound(args) {
  const { start, end } = args;
  if (start.kind === "unreadable" || end.kind === "unreadable") {
    return false;
  }
  if (start.kind === "absent" || end.kind === "absent") {
    return true;
  }
  return start.identity.dev !== end.identity.dev || start.identity.ino !== end.identity.ino;
}
function partitionReservedWalkFiles(walk) {
  const kept = [];
  let reserved = 0;
  for (const file2 of walk.files) {
    if (isReservedRelPath(file2.relPath)) {
      reserved++;
    } else {
      kept.push(file2);
    }
  }
  walk.files = kept;
  return reserved;
}
function refusalCoversPath(refusals, relPath) {
  for (const refusal of refusals) {
    const refused2 = refusal.relPath;
    if (refused2 === "." || refused2 === relPath || relPath.startsWith(`${refused2}/`)) {
      return true;
    }
  }
  return false;
}
var MAX_RMDIR_CHAIN_DEPTH = 64;
var RMDIR_FLUSH_MAX_PER_ROUND = 200;
function verifiedLeftoverLeaf(args) {
  let normalized;
  try {
    normalized = normalizeRelPath(args.relPath);
  } catch (error41) {
    return {
      kind: "refused",
      message: error41 instanceof Error ? error41.message : String(error41)
    };
  }
  const slash = normalized.lastIndexOf("/");
  const parentRel = slash < 0 ? "" : normalized.slice(0, slash);
  const leafName = slash < 0 ? normalized : normalized.slice(slash + 1);
  if (leafName.length === 0 || leafName === "." || leafName === ".." || leafName.includes("/")) {
    return {
      kind: "refused",
      message: `Refusing leftover leaf ${normalized}`
    };
  }
  let parentAbs;
  if (parentRel === "") {
    try {
      const baseStat = fs8.lstatSync(args.base);
      if (baseStat.isSymbolicLink() || !baseStat.isDirectory()) {
        return {
          kind: "refused",
          message: "Refusing leftover under a non-directory store base"
        };
      }
    } catch (error41) {
      return {
        kind: "refused",
        message: error41 instanceof Error ? error41.message : String(error41)
      };
    }
    parentAbs = args.base;
  } else {
    let parent;
    try {
      parent = safeLstatDirectory({ base: args.base, relPath: parentRel });
    } catch (error41) {
      return {
        kind: "refused",
        message: error41 instanceof Error ? error41.message : String(error41)
      };
    }
    if (parent.kind === "absent") {
      return { kind: "absent" };
    }
    if (parent.kind !== "directory") {
      return {
        kind: "refused",
        message: `Refusing leftover ${normalized}: parent ${parentRel} is not a directory`
      };
    }
    parentAbs = parent.absPath;
  }
  try {
    const post = fs8.lstatSync(parentAbs);
    if (post.isSymbolicLink() || !post.isDirectory()) {
      return {
        kind: "refused",
        message: `Refusing leftover ${normalized}: parent changed before the leaf stat`
      };
    }
  } catch (error41) {
    if (isNodeError4(error41) && error41.code === "ENOENT") {
      return { kind: "absent" };
    }
    return {
      kind: "refused",
      message: error41 instanceof Error ? error41.message : String(error41)
    };
  }
  return { kind: "ready", leafAbs: path9.join(parentAbs, leafName) };
}
function hoistRelPathOutOfDir(args) {
  const prefix = `${args.dir}/`;
  const rest = args.relPath.startsWith(prefix) ? args.relPath.slice(prefix.length) : args.relPath;
  const flattened = rest.replaceAll("/", "-");
  const parent = parentRelPath(args.dir);
  if (parent === void 0 || parent === "") {
    return flattened;
  }
  return `${parent}/${flattened}`;
}
function parentRelPath(relPath) {
  if (relPath === "") {
    return void 0;
  }
  const slash = relPath.lastIndexOf("/");
  return slash < 0 ? "" : relPath.slice(0, slash);
}
function isUnderDir(args) {
  const { relPath, dir } = args;
  if (dir === "") {
    return true;
  }
  return relPath === dir || relPath.startsWith(`${dir}/`);
}
function relPathDepth(relPath) {
  if (relPath === "") {
    return 0;
  }
  return relPath.split("/").length;
}
function compareRelPathDepthDesc(left, right) {
  return relPathDepth(right) - relPathDepth(left);
}
function presentRelPathsHasDescendant(presentRelPaths, dir) {
  if (dir === "") {
    return presentRelPaths.size > 0;
  }
  const prefix = `${dir}/`;
  for (const relPath of presentRelPaths) {
    if (relPath.startsWith(prefix)) {
      return true;
    }
  }
  return false;
}
function relPathIsInScope(relPath, scopeRelPaths) {
  for (const scoped of scopeRelPaths) {
    if (isUnderDir({ relPath: scoped, dir: relPath }) || isUnderDir({ relPath, dir: scoped })) {
      return true;
    }
  }
  return false;
}
function readIndexMtimeSync(indexPath) {
  let max;
  for (const candidate of [indexPath, `${indexPath}-wal`, `${indexPath}-shm`]) {
    try {
      const mtime = fs8.lstatSync(candidate).mtimeMs;
      if (max === void 0 || mtime > max) {
        max = mtime;
      }
    } catch (_a19) {
    }
  }
  return max;
}
function parentDirRelPath(relPath) {
  const slash = relPath.lastIndexOf("/");
  return slash <= 0 ? "" : relPath.slice(0, slash);
}
function recordedTombstoneEtag(etag) {
  return etag.length > 0 ? etag : void 0;
}
function protoPositiveMs2(value) {
  if (value === void 0 || !Number.isSafeInteger(value) || value <= 0) {
    return void 0;
  }
  return value;
}
function minDefinedMs2(left, right) {
  if (left === void 0 || right === void 0) {
    return void 0;
  }
  return Math.min(left, right);
}
function parsePositiveMetaMs(value) {
  if (value === void 0 || value === "") {
    return void 0;
  }
  const parsed2 = Number(value);
  if (!Number.isSafeInteger(parsed2) || parsed2 <= 0) {
    return void 0;
  }
  return parsed2;
}
function parseNonNegativeMetaInt(value) {
  if (value === void 0 || value === "") {
    return 0;
  }
  const parsed2 = Number(value);
  if (!Number.isSafeInteger(parsed2) || parsed2 < 0) {
    return 0;
  }
  return parsed2;
}
function normalizeTombstoneFullRefreshRounds(value) {
  if (value === void 0 || !Number.isSafeInteger(value) || value < 1) {
    return DEFAULT_TOMBSTONE_FULL_REFRESH_ROUNDS;
  }
  return value;
}
function normalizeTombstoneFullRefreshIntervalMs(value) {
  if (value === void 0 || !Number.isSafeInteger(value) || value < 0) {
    return DEFAULT_TOMBSTONE_FULL_REFRESH_INTERVAL_MS;
  }
  return value;
}
function normalizeTombstonePruneSlackMs(value) {
  if (value === void 0 || !Number.isSafeInteger(value) || value < 0) {
    return DEFAULT_TOMBSTONE_PRUNE_SLACK_MS;
  }
  return value;
}
function emptySummary(scope = "full") {
  return {
    filesPushed: 0,
    bytesPushed: 0,
    filesPulled: 0,
    bytesPulled: 0,
    filesSkipped: 0,
    refusals: 0,
    reservedPathsSkipped: 0,
    filesConflicted: 0,
    conflicts: [],
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
    rmdirPushed: 0,
    removedDirsApplied: 0,
    recoveryDisarms: 0,
    identityRecoveryWipeFailed: false,
    legacyRowsRestored: 0,
    listingComplete: false,
    errors: [],
    durationMs: 0,
    walkMs: 0,
    hashMs: 0,
    presignMs: 0,
    uploadMs: 0,
    listMs: 0,
    downloadMs: 0,
    scope
  };
}
function openExistingFileNoFollow({ absPath, maxBytes, expectedDev, expectedIno }) {
  const flags = symlinkSafeReadFlags();
  let fd;
  try {
    fd = fs8.openSync(absPath, flags);
  } catch (error41) {
    if (isNodeError4(error41) && (error41.code === "ELOOP" || error41.code === "EMLINK" || error41.code === "ENOENT")) {
      throw new AgentStoreSyncError({
        code: "not_regular_file",
        message: `Refused to open ${absPath}: ${error41.code}`
      });
    }
    throw error41;
  }
  try {
    const fdStat = fs8.fstatSync(fd);
    if (!fdStat.isFile()) {
      throw new AgentStoreSyncError({
        code: "not_regular_file",
        message: `Refused to read non-regular file: ${absPath}`
      });
    }
    if (fdStat.dev !== expectedDev || fdStat.ino !== expectedIno) {
      throw new AgentStoreSyncError({
        code: "toctou_swap_refused",
        message: `Refused to read ${absPath}: filesystem identity changed between safeWalk and open (expected dev=${expectedDev} ino=${expectedIno}, got dev=${fdStat.dev} ino=${fdStat.ino})`
      });
    }
    if (fdStat.nlink > 1) {
      throw new AgentStoreSyncError({
        code: "not_regular_file",
        message: `Refused to read ${absPath}: hard-linked file (nlink=${fdStat.nlink})`
      });
    }
    if (fdStat.size > maxBytes) {
      throw new AgentStoreSyncError({
        code: "file_too_large",
        message: `${absPath} (${fdStat.size} bytes) exceeds the ${maxBytes}-byte cap`
      });
    }
    return { fd, size: fdStat.size };
  } catch (error41) {
    fs8.closeSync(fd);
    throw error41;
  }
}
function streamHashFileNoFollow(_a19) {
  return __awaiter16(this, arguments, void 0, function* ({ absPath, maxBytes, expectedDev, expectedIno, multipartPartSizeBytes }) {
    var _b2, e_1, _c2, _d;
    if (multipartPartSizeBytes !== void 0 && (!Number.isSafeInteger(multipartPartSizeBytes) || multipartPartSizeBytes <= 0)) {
      throw new RangeError("multipartPartSizeBytes must be a positive integer");
    }
    const { fd } = openExistingFileNoFollow({
      absPath,
      maxBytes,
      expectedDev,
      expectedIno
    });
    const stream3 = fs8.createReadStream(absPath, { fd, autoClose: true });
    const sha2563 = (0, import_node_crypto4.createHash)("sha256");
    const md5 = (0, import_node_crypto4.createHash)("md5");
    let multipartPartHash = multipartPartSizeBytes !== void 0 ? (0, import_node_crypto4.createHash)("sha256") : void 0;
    const multipartParts = [];
    let multipartPartOffset = 0;
    let multipartPartBytes = 0;
    let size = 0;
    try {
      try {
        for (var _e2 = true, stream_1 = __asyncValues5(stream3), stream_1_1; stream_1_1 = yield stream_1.next(), _b2 = stream_1_1.done, !_b2; _e2 = true) {
          _d = stream_1_1.value;
          _e2 = false;
          const chunk = _d;
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          size += buffer.byteLength;
          if (size > maxBytes) {
            stream3.destroy();
            throw new AgentStoreSyncError({
              code: "file_too_large",
              message: `File at ${absPath} exceeded ${maxBytes} bytes while hashing`
            });
          }
          sha2563.update(buffer);
          md5.update(buffer);
          if (multipartPartSizeBytes !== void 0 && multipartPartHash !== void 0) {
            let chunkOffset = 0;
            while (chunkOffset < buffer.byteLength) {
              const bytesToHash = Math.min(multipartPartSizeBytes - multipartPartBytes, buffer.byteLength - chunkOffset);
              multipartPartHash.update(buffer.subarray(chunkOffset, chunkOffset + bytesToHash));
              multipartPartBytes += bytesToHash;
              chunkOffset += bytesToHash;
              if (multipartPartBytes === multipartPartSizeBytes) {
                multipartParts.push({
                  partNumber: multipartParts.length + 1,
                  offsetBytes: multipartPartOffset,
                  sizeBytes: multipartPartBytes,
                  checksumSha256: new Uint8Array(multipartPartHash.digest())
                });
                multipartPartOffset += multipartPartBytes;
                multipartPartBytes = 0;
                multipartPartHash = (0, import_node_crypto4.createHash)("sha256");
              }
            }
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (!_e2 && !_b2 && (_c2 = stream_1.return)) yield _c2.call(stream_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    } finally {
      if (!stream3.destroyed)
        stream3.destroy();
    }
    if (multipartPartHash !== void 0 && multipartPartBytes > 0) {
      multipartParts.push({
        partNumber: multipartParts.length + 1,
        offsetBytes: multipartPartOffset,
        sizeBytes: multipartPartBytes,
        checksumSha256: new Uint8Array(multipartPartHash.digest())
      });
    }
    return Object.assign({ sha: sha2563.digest("hex"), etag: md5.digest("hex"), size }, multipartPartSizeBytes !== void 0 ? { multipartParts } : {});
  });
}
var symlinkSafeWriteFlags = symlinkSafeExclusiveWriteFlags;
function regularFileExistsNoFollow(absPath) {
  try {
    const stat28 = fs8.lstatSync(absPath);
    return stat28.isFile() && !stat28.isSymbolicLink();
  } catch (_a19) {
    return false;
  }
}
function assertTargetWritable({ absPath, relPath }) {
  let existing;
  try {
    existing = fs8.lstatSync(absPath);
  } catch (error41) {
    if (!isNodeError4(error41) || error41.code !== "ENOENT") {
      throw error41;
    }
    return;
  }
  if (existing.isSymbolicLink()) {
    throw new AgentStoreSyncError({
      code: "not_regular_file",
      relPath,
      message: `Refusing to overwrite symlinked target: ${absPath}`
    });
  }
  if (!existing.isFile()) {
    throw new AgentStoreSyncError({
      code: "not_regular_file",
      relPath,
      message: `Refusing to overwrite non-regular target: ${absPath}`
    });
  }
}
function assertParentInsideBase({ base, parent, relPath }) {
  const resolvedBase = path9.resolve(base);
  const resolvedParent = path9.resolve(parent);
  if (!isEqualOrParent({ parent: resolvedBase, candidate: resolvedParent })) {
    throw new AgentStoreSyncError({
      code: "not_regular_file",
      relPath,
      message: `Refusing to write outside the agent store base (${resolvedBase}): ${resolvedParent}`
    });
  }
}
function safeCreateDirChain({ base, target, relPath }) {
  const resolvedBase = path9.resolve(base);
  const resolvedTarget = path9.resolve(target);
  if (resolvedTarget === resolvedBase) {
    assertRealDirectory({ targetPath: resolvedBase, relPath });
    return;
  }
  const relative18 = path9.relative(resolvedBase, resolvedTarget);
  if (relative18.length === 0 || relative18.startsWith("..") || path9.isAbsolute(relative18)) {
    throw new AgentStoreSyncError({
      code: "not_regular_file",
      relPath,
      message: `Refusing to create ${resolvedTarget} (outside of ${resolvedBase})`
    });
  }
  const segments = relative18.split(path9.sep).filter((segment) => segment.length > 0);
  let current = resolvedBase;
  assertRealDirectory({ targetPath: current, relPath });
  for (const segment of segments) {
    current = path9.join(current, segment);
    let stat28;
    try {
      stat28 = fs8.lstatSync(current);
    } catch (error41) {
      if (isNodeError4(error41) && error41.code === "ENOENT") {
        try {
          fs8.mkdirSync(current, { mode: PRIVATE_DIR_MODE });
        } catch (mkErr) {
          if (!isNodeError4(mkErr) || mkErr.code !== "EEXIST") {
            throw mkErr;
          }
        }
        stat28 = fs8.lstatSync(current);
      } else {
        throw error41;
      }
    }
    if (stat28.isSymbolicLink()) {
      throw new AgentStoreSyncError({
        code: "not_regular_file",
        relPath,
        message: `Refusing to traverse symlinked ancestor: ${current}`
      });
    }
    if (!stat28.isDirectory()) {
      throw new AgentStoreSyncError({
        code: "not_regular_file",
        relPath,
        message: `Refusing to use non-directory ancestor: ${current}`
      });
    }
  }
}
function assertRealDirectory({ targetPath, relPath }) {
  const stat28 = fs8.lstatSync(targetPath);
  if (stat28.isSymbolicLink()) {
    throw new AgentStoreSyncError({
      code: "not_regular_file",
      relPath,
      message: `Refusing to use symlinked agent store base: ${targetPath}`
    });
  }
  if (!stat28.isDirectory()) {
    throw new AgentStoreSyncError({
      code: "not_regular_file",
      relPath,
      message: `Refusing to use non-directory agent store base: ${targetPath}`
    });
  }
}
function symlinkSafeReadFlags() {
  var _a19;
  const constants11 = fs8.constants;
  let flags = (_a19 = constants11.O_RDONLY) !== null && _a19 !== void 0 ? _a19 : 0;
  if (typeof constants11.O_NOFOLLOW === "number") {
    flags |= constants11.O_NOFOLLOW;
  }
  if (typeof constants11.O_CLOEXEC === "number") {
    flags |= constants11.O_CLOEXEC;
  }
  return flags;
}
function isNodeError4(error41) {
  return error41 instanceof Error && typeof error41.code === "string";
}
function safeReadBody(response) {
  return __awaiter16(this, void 0, void 0, function* () {
    try {
      return yield response.text();
    } catch (_a19) {
      return "";
    }
  });
}
var SAFE_PRESIGN_HEADER_PREFIX = "x-amz-";
var SAFE_PRESIGN_HEADER_EXACTS = /* @__PURE__ */ new Set([
  "content-md5",
  "content-type",
  "if-match",
  "if-none-match"
]);
function sanitizePresignHeaders(headers, relPath, expectedContentLength) {
  const safe = {};
  for (const [name17, value] of Object.entries(headers)) {
    const key = name17.toLowerCase();
    if (key === "content-length") {
      if (expectedContentLength === void 0 || value.trim() !== String(expectedContentLength)) {
        throw new AgentStoreSyncError({
          code: "presign_response_mismatch",
          relPath,
          message: `Refusing to forward mismatched content-length for ${relPath}`
        });
      }
      safe["content-length"] = String(expectedContentLength);
      continue;
    }
    if (key.startsWith(SAFE_PRESIGN_HEADER_PREFIX) || SAFE_PRESIGN_HEADER_EXACTS.has(key)) {
      safe[name17] = value;
      continue;
    }
    throw new AgentStoreSyncError({
      code: "presign_response_mismatch",
      relPath,
      message: `Refusing to forward unsanctioned presign header for ${relPath}: ${name17}`
    });
  }
  return safe;
}
var HttpAgentStoreBlobTransfer = class {
  constructor(options2 = {}) {
    var _a19, _b2, _c2, _d, _e2, _f;
    this.maxFileSizeBytes = (_a19 = options2.maxFileSizeBytes) !== null && _a19 !== void 0 ? _a19 : 1024 * 1024 * 1024;
    this.allowInsecureScheme = (_b2 = options2.allowInsecureScheme) !== null && _b2 !== void 0 ? _b2 : false;
    this.partUploadMaxAttempts = (_c2 = options2.partUploadMaxAttempts) !== null && _c2 !== void 0 ? _c2 : 3;
    if (!Number.isInteger(this.partUploadMaxAttempts) || this.partUploadMaxAttempts < 1) {
      throw new RangeError(`HttpAgentStoreBlobTransfer partUploadMaxAttempts must be a positive integer, got ${this.partUploadMaxAttempts}`);
    }
    this.partUploadBaseDelayMs = (_d = options2.partUploadBaseDelayMs) !== null && _d !== void 0 ? _d : 250;
    if (!Number.isFinite(this.partUploadBaseDelayMs) || this.partUploadBaseDelayMs < 0) {
      throw new RangeError(`HttpAgentStoreBlobTransfer partUploadBaseDelayMs must be non-negative, got ${this.partUploadBaseDelayMs}`);
    }
    this.now = (_e2 = options2.now) !== null && _e2 !== void 0 ? _e2 : Date.now;
    this.sleep = (_f = options2.sleep) !== null && _f !== void 0 ? _f : ((ms2) => __awaiter16(this, void 0, void 0, function* () {
      yield new Promise((resolve29) => {
        setTimeout(resolve29, ms2);
      });
    }));
    this.blobIdleTimeoutMs = normalizeBlobIdleTimeoutMs(options2.blobIdleTimeoutMs);
  }
  /**
   * Align PUT idle watching with an owning engine's `blobIdleTimeoutMs`
   * (including `0` to disable). Used when the transfer is injected into
   * {@link AgentStoreSyncEngine}.
   */
  setBlobIdleTimeoutMs(blobIdleTimeoutMs) {
    this.blobIdleTimeoutMs = normalizeBlobIdleTimeoutMs(blobIdleTimeoutMs);
  }
  uploadFile(request3) {
    return __awaiter16(this, void 0, void 0, function* () {
      var _a19;
      const uploaded = yield this.uploadRange({
        url: request3.url,
        relPath: request3.relPath,
        absPath: request3.absPath,
        offset: 0,
        size: request3.size,
        fileSize: request3.size,
        expectedDev: request3.expectedDev,
        expectedIno: request3.expectedIno,
        presignHeaders: (_a19 = request3.presignHeaders) !== null && _a19 !== void 0 ? _a19 : {
          "x-amz-meta-content-sha256": request3.sha
        },
        signal: request3.signal
      });
      return { etag: normalizeS3Etag(uploaded.etag) };
    });
  }
  uploadPart(request3) {
    return __awaiter16(this, void 0, void 0, function* () {
      const expectedChecksum = Buffer.from(request3.checksumSha256).toString("base64");
      if (request3.checksumSha256.byteLength !== 32 || getHeaderCaseInsensitive(request3.presignHeaders, "x-amz-checksum-sha256") !== expectedChecksum) {
        throw new AgentStoreSyncError({
          code: "presign_response_mismatch",
          relPath: request3.relPath,
          message: `Multipart part ${request3.partNumber} of ${request3.relPath} is missing its signed SHA-256 checksum`,
          retryable: false
        });
      }
      for (let attempt = 1; ; attempt++) {
        if (request3.expiresAtMs <= this.now()) {
          throw new AgentStoreSyncError({
            code: "presigned_url_expired",
            relPath: request3.relPath,
            message: `Multipart upload URL expired before part ${request3.partNumber} of ${request3.relPath} could be sent`,
            retryable: false
          });
        }
        try {
          return yield this.uploadRange({
            url: request3.url,
            relPath: request3.relPath,
            absPath: request3.absPath,
            offset: request3.offset,
            size: request3.size,
            fileSize: request3.fileSize,
            expectedDev: request3.expectedDev,
            expectedIno: request3.expectedIno,
            presignHeaders: request3.presignHeaders,
            signal: request3.signal
          });
        } catch (error41) {
          const retryable = error41 instanceof AgentStoreSyncError && error41.retryable === true;
          if (!retryable || attempt >= this.partUploadMaxAttempts) {
            throw error41;
          }
          yield this.sleep(this.partUploadBaseDelayMs * Math.pow(2, Math.max(0, attempt - 1)));
        }
      }
    });
  }
  uploadRange(args) {
    return __awaiter16(this, void 0, void 0, function* () {
      const isEmptyWholeFile = args.offset === 0 && args.size === 0 && args.fileSize === 0;
      if (!Number.isSafeInteger(args.offset) || args.offset < 0 || !Number.isSafeInteger(args.size) || args.size < 0 || args.size === 0 && !isEmptyWholeFile || args.offset + args.size > args.fileSize) {
        throw new AgentStoreSyncError({
          code: "presign_response_mismatch",
          relPath: args.relPath,
          message: `Invalid multipart byte range for ${args.relPath}`,
          retryable: false
        });
      }
      const parsedUrl = new URL(args.url);
      const client = this.clientForUrl({ parsedUrl, relPath: args.relPath });
      const safePresignHeaders = sanitizePresignHeaders(args.presignHeaders, args.relPath, args.size);
      const redactedUrl = redactPresignedUrlString(args.url);
      const { fd, size: openedSize } = openExistingFileNoFollow({
        absPath: args.absPath,
        maxBytes: this.maxFileSizeBytes,
        expectedDev: args.expectedDev,
        expectedIno: args.expectedIno
      });
      if (openedSize !== args.fileSize) {
        fs8.closeSync(fd);
        throw new AgentStoreSyncError({
          code: "sha_mismatch",
          relPath: args.relPath,
          message: `Local file ${args.relPath} changed between hash and upload (size ${args.fileSize} -> ${openedSize})`,
          retryable: false
        });
      }
      let body;
      if (isEmptyWholeFile) {
        fs8.closeSync(fd);
        body = import_node_stream.Readable.from([]);
      } else {
        body = fs8.createReadStream(args.absPath, {
          fd,
          autoClose: true,
          start: args.offset,
          end: args.offset + args.size - 1
        });
      }
      try {
        return yield new Promise((resolve29, reject2) => {
          let settled = false;
          let removeAbortListener = () => {
          };
          const settle = (outcome) => {
            if (settled) {
              return;
            }
            settled = true;
            removeAbortListener();
            if (outcome.kind === "success") {
              resolve29({ etag: outcome.etag });
              return;
            }
            const { error: error41 } = outcome;
            if (error41 instanceof AgentStoreSyncError) {
              reject2(error41);
              return;
            }
            reject2(new AgentStoreSyncError({
              code: "upload_failed",
              relPath: args.relPath,
              message: `Upload of ${args.relPath} failed (url=${redactedUrl}): ${error41 instanceof Error ? error41.message : String(error41)}`,
              cause: error41,
              retryable: true
            }));
          };
          const putHeaders = Object.assign(Object.assign({}, safePresignHeaders), { "content-length": String(args.size) });
          const httpRequest = client.request(parsedUrl, {
            method: "PUT",
            headers: putHeaders
          }, (response) => {
            response.on("error", (error41) => settle({ kind: "failure", error: error41 }));
            response.resume();
            response.on("end", () => {
              var _a19, _b2;
              const status = (_a19 = response.statusCode) !== null && _a19 !== void 0 ? _a19 : 0;
              if (status >= 200 && status < 300) {
                const responseEtag = stripS3EtagQuotes(response.headers.etag);
                if (responseEtag.length > 0) {
                  settle({ kind: "success", etag: responseEtag });
                  return;
                }
                settle({
                  kind: "failure",
                  error: new AgentStoreSyncError({
                    code: "upload_failed",
                    relPath: args.relPath,
                    message: `Upload of ${args.relPath} succeeded but returned no ETag (url=${redactedUrl})`,
                    retryable: false
                  })
                });
                return;
              }
              settle({
                kind: "failure",
                error: new AgentStoreSyncError({
                  code: status === 412 || status === 409 ? "write_conflict" : "upload_failed",
                  relPath: args.relPath,
                  httpStatus: status,
                  message: `Upload of ${args.relPath} failed (${status} ${(_b2 = response.statusMessage) !== null && _b2 !== void 0 ? _b2 : ""}, url=${redactedUrl})`,
                  retryable: status === 408 || status === 429 || status >= 500
                })
              });
            });
          });
          httpRequest.on("error", (error41) => settle({ kind: "failure", error: error41 }));
          let putIdleArmed = false;
          const armPutIdleTimeout = () => {
            if (putIdleArmed || this.blobIdleTimeoutMs <= 0) {
              return;
            }
            putIdleArmed = true;
            httpRequest.setTimeout(this.blobIdleTimeoutMs, () => {
              const timeoutError = new AgentStoreSyncError({
                code: "upload_failed",
                relPath: args.relPath,
                timeoutClass: "blob_put",
                // Keep the store-relative path off `message` (structured
                // `relPath` remains for callers that hash before logging).
                message: `blob_put idle timeout after ${this.blobIdleTimeoutMs}ms (url=${redactedUrl})`,
                retryable: true
              });
              body.destroy();
              httpRequest.destroy(timeoutError);
              settle({ kind: "failure", error: timeoutError });
            });
          };
          const signal = args.signal;
          if (signal !== void 0) {
            const onAbort = () => {
              const abortError = isSyncRoundStoodAsideError(signal.reason) ? signal.reason : roundAbortedError(args.relPath, signal.reason);
              body.destroy();
              httpRequest.destroy(abortError);
              settle({ kind: "failure", error: abortError });
            };
            if (signal.aborted) {
              onAbort();
              return;
            }
            signal.addEventListener("abort", onAbort, { once: true });
            removeAbortListener = () => {
              signal.removeEventListener("abort", onAbort);
            };
          }
          if (this.blobIdleTimeoutMs > 0 && isEmptyWholeFile) {
            armPutIdleTimeout();
            void (0, import_promises5.pipeline)(body, httpRequest).catch((error41) => settle({ kind: "failure", error: error41 }));
          } else if (this.blobIdleTimeoutMs > 0) {
            const armOnFirstByte = new import_node_stream.Transform({
              transform(chunk, _encoding, callback) {
                armPutIdleTimeout();
                callback(null, chunk);
              }
            });
            void (0, import_promises5.pipeline)(body, armOnFirstByte, httpRequest).catch((error41) => settle({ kind: "failure", error: error41 }));
          } else {
            void (0, import_promises5.pipeline)(body, httpRequest).catch((error41) => settle({ kind: "failure", error: error41 }));
          }
        });
      } catch (error41) {
        body.destroy();
        throw error41;
      }
    });
  }
  clientForUrl(args) {
    const { parsedUrl, relPath } = args;
    let client;
    if (parsedUrl.protocol === "https:") {
      client = https;
    } else if (parsedUrl.protocol === "http:" && this.allowInsecureScheme) {
      client = http;
    }
    if (client === void 0) {
      throw new AgentStoreSyncError({
        code: "upload_failed",
        relPath,
        message: `Refusing to upload over unsupported scheme: ${parsedUrl.protocol}`,
        retryable: false
      });
    }
    return client;
  }
};
function normalizeBlobIdleTimeoutMs(value) {
  if (value === void 0) {
    return DEFAULT_BLOB_IDLE_TIMEOUT_MS;
  }
  if (!Number.isFinite(value) || value < 0) {
    return DEFAULT_BLOB_IDLE_TIMEOUT_MS;
  }
  return Math.floor(value);
}
function createBlobIdleWatch(idleTimeoutMs) {
  if (idleTimeoutMs <= 0) {
    return void 0;
  }
  const controller = new AbortController();
  let timer;
  const arm = () => {
    var _a19;
    if (controller.signal.aborted) {
      return;
    }
    if (timer !== void 0) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      controller.abort(new DOMException(`blob transfer idle timeout after ${idleTimeoutMs}ms`, "TimeoutError"));
    }, idleTimeoutMs);
    (_a19 = timer.unref) === null || _a19 === void 0 ? void 0 : _a19.call(timer);
  };
  return {
    signal: controller.signal,
    rearm: arm,
    clear: () => {
      if (timer !== void 0) {
        clearTimeout(timer);
        timer = void 0;
      }
    }
  };
}
function throwForAbortedRoundSignal(relPath, reason) {
  if (isSyncRoundStoodAsideError(reason)) {
    throw reason;
  }
  throw roundAbortedError(relPath, reason);
}
function isCooperativeRoundAbortCause(cause) {
  let current = cause;
  const seen = /* @__PURE__ */ new Set();
  while (typeof current === "object" && current !== null && !seen.has(current)) {
    seen.add(current);
    if (current instanceof Error) {
      const message = current.message;
      if (message === "session closing" || message === "host resumed from suspend" || message.includes("still draining after watchdog abandon")) {
        return true;
      }
    }
    current = "cause" in current ? current.cause : void 0;
  }
  return false;
}
function roundAbortedError(relPath, cause) {
  const cooperativeCause = isCooperativeRoundAbortCause(cause);
  return new AgentStoreSyncError(Object.assign({
    code: "round_aborted",
    message: relPath !== void 0 ? `Agent store sync round aborted before syncing ${relPath}` : "Agent store sync round aborted",
    relPath,
    cause
  }, cooperativeCause ? {} : { timeoutClass: "round" }));
}
function timeoutClassEntry(error41) {
  return error41 instanceof AgentStoreSyncError && error41.timeoutClass !== void 0 ? { timeoutClass: error41.timeoutClass } : {};
}
function composeAbortSignals(a, b2) {
  if (a === void 0) {
    return b2;
  }
  if (b2 === void 0) {
    return a;
  }
  return AbortSignal.any([a, b2]);
}
function isBlobIdleAbortError(error41, signal) {
  if ((signal === null || signal === void 0 ? void 0 : signal.aborted) !== true || !isBlobIdleTimeoutReason(signal.reason)) {
    return false;
  }
  if (error41 === signal.reason) {
    return true;
  }
  if (!(error41 instanceof Error)) {
    return false;
  }
  return error41.name === "TimeoutError" || error41.name === "AbortError";
}
function isBlobIdleTimeoutReason(reason) {
  return reason instanceof Error && reason.name === "TimeoutError" && reason.message.includes("blob transfer idle timeout");
}
