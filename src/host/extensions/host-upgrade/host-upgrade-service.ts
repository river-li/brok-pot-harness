/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/host-upgrade/host-upgrade-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist2();
init_errors();

// @recovered-fragment 2/2
var HostUpgradeService = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  updateState = {
    stagedVersion: null,
    lastFailedVersion: void 0,
    swapRetryAttempts: /* @__PURE__ */ new Map()
  };
  updateInFlight = false;
  localVersion = null;
  latestVersion = null;
  markerForwarding;
  markerForwardInFlight = false;
  hostIdentityReady = false;
  markerForwardNow;
  lastHandledMarker;
  retainedAppliedOperation;
  sharedUpdateWatchStarted = false;
  sharedUpdateWatchActive = false;
  sharedUpdateDelay;
  runRootUpdateTick;
  prepareUpgradeInFlight;
  get isAutoUpdateEnabled() {
    return this.deps.isAutoUpdateEnabled;
  }
  async resolveHostBundleIdentityVersion(fallbackVersion) {
    const onDiskVersion = await this.deps.readLocalVersion();
    if (onDiskVersion !== null) this.localVersion = onDiskVersion;
    return onDiskVersion ?? this.localVersion ?? fallbackVersion ?? "unknown";
  }
  startMarkerForwardWake() {
    if (this.markerForwarding != null) return;
    this.markerForwarding = this.deps.markerForwardPolicy.start(async () => {
      if (!this.hostIdentityReady) return;
      await this.abandonOverBudgetUpgradePause(true);
      await this.forwardHostUpgradeMarker();
    });
  }
  activateAfterHostIdentityReady() {
    if (this.hostIdentityReady) return;
    this.hostIdentityReady = true;
    void this.forwardHostUpgradeMarker();
  }
  startSharedUpdateWatch(options2) {
    if (this.sharedUpdateWatchStarted) return;
    this.sharedUpdateWatchStarted = true;
    this.runRootUpdateTick = options2.runRootUpdateTick;
    const watcherEnabled = options2.isBoxAutoUpdateEnabled || this.deps.isAutoUpdateEnabled;
    if (!watcherEnabled && !this.deps.isInBox) return;
    void this.deps.readLocalVersion().then((version3) => {
      this.localVersion = version3;
    });
    void this.deps.resolveBundleSource().then((source) => {
      if (source != null) this.latestVersion = source.version;
    }).catch(() => {
    });
    this.sharedUpdateWatchActive = true;
    this.scheduleSharedUpdateWatch(
      hostBundleWatchInitialDelayMs(
        this.deps.getUpdateWatchIntervalMs(),
        this.deps.updateWatchJitterRatio,
        this.deps.random
      )
    );
  }
  async updateHostNow(options2) {
    const { force = true, includeErrorDetail = false } = options2;
    const source = await this.deps.resolveBundleSource();
    if (source == null) {
      return { started: false, reason: "no-bundle-source" };
    }
    this.latestVersion = source.version;
    const local = await this.deps.readLocalVersion();
    this.localVersion = local;
    if (!isSandHostUpgradeAvailable(local, source.version)) {
      return {
        started: false,
        reason: "already-latest",
        version: source.version
      };
    }
    if (await this.deps.isVersionSwapVetoed({
      version: source.version,
      localVersion: local
    })) {
      return {
        started: false,
        reason: "host-version-rolled-back",
        version: source.version
      };
    }
    const result = await this.runHostBundleFetchStage({
      source,
      localVersion: local,
      trigger: force ? "manual-update-host" : "manual-update-host-idle",
      forceNow: force
    });
    if (!result.ok) {
      const allowRawErrorDetail = includeErrorDetail && this.deps.hostDevErrorDetail;
      return {
        started: false,
        reason: allowRawErrorDetail ? describeHostBundleErrorDetail(result.error, result.phase) : String(result.error)
      };
    }
    return { started: true, version: source.version };
  }
  getVersionState() {
    return {
      hostVersion: this.localVersion,
      latestHostVersion: this.latestVersion,
      hostUpdateAvailable: this.latestVersion === null ? null : isSandHostUpgradeAvailable(this.localVersion, this.latestVersion)
    };
  }
  async prepareForUpgrade() {
    if (this.prepareUpgradeInFlight != null) {
      return await this.prepareUpgradeInFlight;
    }
    const operation = this.prepareForUpgradeOnce();
    this.prepareUpgradeInFlight = operation;
    try {
      return await operation;
    } finally {
      if (this.prepareUpgradeInFlight === operation) {
        this.prepareUpgradeInFlight = void 0;
      }
    }
  }
  async readAppliedUpgradeOperation() {
    const raw = await this.deps.markerStore.readRaw();
    if (raw === null) return void 0;
    const marker17 = parseHostUpgradeMarker(raw);
    if (marker17 === null || marker17.outcome !== "applied" || marker17.commandId === void 0) {
      return void 0;
    }
    return {
      operationId: marker17.commandId,
      markerRaw: raw
    };
  }
  retainAppliedUpgradeOperation(operation) {
    this.retainedAppliedOperation = operation;
  }
  async releaseAppliedUpgradeOperation(operationId) {
    const retained = this.retainedAppliedOperation;
    if (retained?.operationId !== operationId) return;
    await this.forwardHostUpgradeMarker();
    this.retainedAppliedOperation = void 0;
    const raw = await this.deps.markerStore.readRaw();
    if (raw === retained.markerRaw) {
      await this.deps.markerStore.deleteMarker();
    }
  }
  async prepareForUpgradeOnce() {
    const abandonedRunningTurns = await this.abandonOverBudgetUpgradePause(false);
    if (abandonedRunningTurns !== null) {
      return { quiescing: false, runningTurns: abandonedRunningTurns };
    }
    const requested = await this.deps.transcript.pauseTurnsForUpgrade();
    if (!requested.quiescing) return requested;
    try {
      await this.deps.automations.suspendWakes();
    } catch (error42) {
      this.deps.transcript.cancelForcedUpgradePause();
      await this.resumeBackgroundWorkIfUnpaused();
      throw error42;
    }
    if (!this.deps.transcript.isForcedUpgradePauseActive()) {
      await this.resumeBackgroundWorkIfUnpaused();
      return { quiescing: false, runningTurns: refuseSwapRunningTurns(requested.runningTurns) };
    }
    const refreshed = await this.deps.transcript.pauseTurnsForUpgrade();
    if (!refreshed.quiescing || !this.deps.transcript.isForcedUpgradePauseActive()) {
      await this.resumeBackgroundWorkIfUnpaused();
      return { quiescing: false, runningTurns: refuseSwapRunningTurns(refreshed.runningTurns) };
    }
    return refreshed;
  }
  async forwardHostUpgradeMarker() {
    if (this.markerForwardInFlight) return void 0;
    this.markerForwardInFlight = true;
    try {
      return await forwardHostUpgradeMarkerWith({
        readRaw: () => this.deps.markerStore.readRaw(),
        deleteMarker: async () => {
          if (this.retainedAppliedOperation === void 0) {
            await this.deps.markerStore.deleteMarker();
          }
        },
        emit: (metadata) => this.deps.telemetry.reportHostUpgradeConfirmed(metadata),
        warn: (message) => this.deps.log("warn", message),
        now: (raw) => {
          if (this.markerForwardNow?.raw !== raw) {
            this.markerForwardNow = {
              raw,
              nowMs: this.deps.clock.now()
            };
          }
          return this.markerForwardNow.nowMs;
        },
        wasForwarded: (raw) => raw === this.lastHandledMarker,
        markForwarded: (raw) => {
          this.lastHandledMarker = raw;
        },
        onForwarded: (marker17) => {
          if (noteFailedSwapMarkerForRetry(this.updateState, marker17)) {
            this.deps.log(
              "info",
              `supervisor swap of ${marker17.toVersion ?? "?"} failed (${marker17.swapError ?? "swap-failed"}); re-staging on the next idle watch tick`
            );
          }
        }
      });
    } finally {
      this.markerForwardInFlight = false;
    }
  }
  async abandonOverBudgetUpgradePause(allowIdleAfterStalePoll) {
    const abandoned = this.deps.transcript.abandonOverBudgetUpgradePause({
      allowIdleAfterStalePoll
    });
    if (abandoned === null) return null;
    await this.resumeBackgroundWorkIfUnpaused();
    return abandoned.runningTurns;
  }
  async resumeBackgroundWorkIfUnpaused() {
    if (this.deps.transcript.isPausingForUpgrade()) return;
    this.deps.automations.resumeWakes();
  }
  dispose() {
    this.sharedUpdateWatchActive = false;
    this.sharedUpdateDelay?.dispose();
    this.sharedUpdateDelay = void 0;
    this.markerForwarding?.dispose();
    this.markerForwarding = void 0;
  }
  scheduleSharedUpdateWatch(delayMs) {
    if (!this.sharedUpdateWatchActive) return;
    if (delayMs === 0) {
      void this.runSharedUpdateWatchAndRearm();
      return;
    }
    let primed = false;
    let delayHandle;
    delayHandle = this.deps.createUpdateWatchDelayPolicy(delayMs).start(async () => {
      if (!primed) {
        primed = true;
        return;
      }
      delayHandle?.dispose();
      if (this.sharedUpdateDelay === delayHandle) {
        this.sharedUpdateDelay = void 0;
      }
      await this.runSharedUpdateWatchAndRearm();
    });
    this.sharedUpdateDelay = delayHandle;
  }
  async runSharedUpdateWatchAndRearm() {
    try {
      await this.runRootUpdateTick?.();
      await this.maybeAutoUpdateHostBundle();
    } catch (error42) {
      this.deps.log("warn", `shared update watch failed: ${errorLogTag(error42)}`);
    } finally {
      if (this.sharedUpdateWatchActive) {
        this.scheduleSharedUpdateWatch(
          hostBundleWatchNextDelayMs(
            this.deps.getUpdateWatchIntervalMs(),
            this.deps.updateWatchJitterRatio,
            this.deps.random
          )
        );
      }
    }
  }
  async maybeAutoUpdateHostBundle() {
    if (!this.deps.isAutoUpdateEnabled) return;
    if (this.updateInFlight) return;
    const source = await this.deps.resolveBundleSource();
    if (source == null) return;
    this.latestVersion = source.version;
    const local = this.localVersion ?? await this.deps.readLocalVersion();
    this.localVersion = local;
    if (!isSandHostUpgradeAvailable(local, source.version)) return;
    if (this.updateState.stagedVersion === source.version) return;
    if (await this.deps.isVersionSwapVetoed({
      version: source.version,
      localVersion: local
    })) {
      return;
    }
    await this.runHostBundleFetchStage({
      source,
      localVersion: local,
      trigger: "idle-auto-update",
      forceNow: false
    });
  }
  async runHostBundleFetchStage({
    source,
    localVersion,
    trigger: trigger2,
    forceNow
  }) {
    if (this.updateInFlight) {
      return {
        ok: false,
        error: new Error("host bundle update already in flight")
      };
    }
    this.updateInFlight = true;
    try {
      return await fetchStageAndReportHostBundle({
        source,
        fromVersion: localVersion,
        trigger: trigger2,
        state: this.updateState,
        stage: async ({ bytes, sha256: sha2563 }) => {
          await this.deps.stageUpgrade({
            version: source.version,
            bytes,
            sha256: sha2563,
            forceNow,
            reason: trigger2
          });
        },
        reportUpgrade: (metadata) => this.deps.telemetry.reportHostUpgrade(metadata),
        log: (level, message) => this.deps.log(level, message)
      });
    } finally {
      this.updateInFlight = false;
    }
  }
};

