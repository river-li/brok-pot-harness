var BOX_HOME_CATEGORY_NAME = "home";
var BOX_HOME_DIR = "/home/box";
var BOX_HOME_REL_PREFIX = "home/box";
var BOX_HOME_PRUNE_GUARDED_FOREIGN_TREES = [
  `${BOX_HOME_REL_PREFIX}/cli-config`,
  `${BOX_HOME_REL_PREFIX}/chrome-profile*`,
  `${BOX_HOME_REL_PREFIX}/sand-data`,
  `${BOX_HOME_REL_PREFIX}/sand-host`,
  `${BOX_HOME_REL_PREFIX}/deps`
];
var BOX_HOME_REGENERABLE_JUNK_IGNORE_PATTERNS = [
  "/cli-config/",
  "/chrome-profile*/",
  "/sand-data/",
  "/sand-host/",
  "/deps/",
  ...BOX_HOME_FOREIGN_MOUNT_NAMES.map((name17) => `/${name17}/`),
  "/.config/origin-cli/",
  ".cache/",
  "/.npm/",
  "/.nvm/",
  "/.rustup/",
  "/.cargo/registry/",
  "/.cargo/git/",
  "/.local/share/pnpm/",
  "/.local/share/Trash/",
  "/.local/state/",
  "/.docker/buildx/",
  "/.gradle/caches/",
  "/.gradle/daemon/",
  "/.gradle/wrapper/",
  "/.m2/repository/",
  "/.vnc/",
  "/.dbus/",
  "/.Xauthority",
  "*.sock"
];
function buildBoxHomeCategory(absRoot) {
  return {
    name: BOX_HOME_CATEGORY_NAME,
    absRoot,
    relPrefix: BOX_HOME_REL_PREFIX,
    excludes: BOX_HOME_PRUNE_GUARDED_FOREIGN_TREES,
    ignore: () => compileWorkspaceIgnore(BOX_HOME_REGENERABLE_JUNK_IGNORE_PATTERNS)
  };
}
var BOX_STORE_SYNC_INTERVAL_MS = 2 * 6e4;
var BOX_STORE_CHROME_INTERVAL_MS = 15 * 6e4;
var BOX_STORE_DB_DEBOUNCE_MS = 5e3;
var CHROME_SESSION_CHANGE_DEBOUNCE_MS = 5e3;
var BOX_STORE_MANIFEST_RETRY_ATTEMPTS = 3;
var BOX_STORE_MANIFEST_RETRY_DELAY_MS = 100;
var DefaultBoxStoreSyncService = class {
  constructor(deps) {
    this.deps = deps;
    this.sandRoot = getSandRootDir();
    this.backendPolicy = deps.boxStore.policy;
    const objectStoreProvider = resolveBoxObjectStoreProvider({
      policy: this.backendPolicy,
      agentStore: { backend: deps.backend, ...deps.auth }
    });
    const enabled = deps.boxStore.syncEnabled;
    this.lastChromeSyncMs = deps.clock.monotonicNow();
    this.sync = enabled ? this.createSync(
      buildBoxStoreCategories({
        sandRoot: this.sandRoot,
        chromeStageRetry: deps.chromeStageRetry,
        reportChromeSessionStage: (outcome) => this.reportChromeSessionStage(outcome),
        wholeHomeCategory: deps.boxStore.wholeHomeCategory
      }),
      objectStoreProvider,
      `[box-store-sync]`
    ) : void 0;
    this.api = {
      isEnabled: enabled,
      isV2Enabled: enabled && this.backendPolicy.kind === "sand-box-store-v2",
      objectStoreProvider,
      getStoreId: () => this.getStoreId(),
      snapshotBoxStoreNow: (args) => this.snapshotBoxStoreNow(args),
      getBoxStoreStatus: () => this.accessor().readStoreStatus(),
      clearBoxStoreNow: () => this.clearBoxStoreNow(),
      scheduleStoreDbSnapshot: (agentId) => this.sync?.scheduleStoreDbSnapshot(agentId),
      forgetAgent: async (agentId) => {
        await (this.sync ?? this.accessor()).forgetAgent(agentId);
      }
    };
  }
  deps;
  api;
  sandRoot;
  backendPolicy;
  sync;
  accessorInstance;
  pollingHandle;
  chromeSessionWatcher;
  lastChromeSyncMs;
  started = false;
  start() {
    if (this.started) return;
    this.started = true;
    if (this.sync == null) {
      this.deps.telemetry.reportBoxStoreSyncCycle("warn", {
        ok: "false",
        reason: "disabled",
        phase: "startup"
      });
      return;
    }
    const startupSweep = this.sync.sweepLeakedTemps().then((removed) => {
      if (removed > 0) {
        this.deps.log(`swept ${removed} leaked box-store temp file(s)`);
      }
    }).catch((error41) => {
      this.deps.log(`box-store temp sweep failed: ${errorMessage(error41)}`);
    });
    this.pollingHandle = this.deps.polling.start(async () => {
      await startupSweep;
      await this.runCycle();
    });
    this.chromeSessionWatcher = new ChromeSessionWatcher({
      watchDir: CHROME_SESSION_DB_DIR,
      sessionDbNames: CHROME_SESSION_DB_NAMES,
      debounce: this.deps.chromeSessionDebounce,
      onSessionChange: () => {
        void this.sync?.snapshotNow({ chromeSessionOnly: true, waitForInFlight: true }).catch((error41) => {
          this.deps.log(`chrome-session snapshot rejected: ${errorMessage(error41)}`);
        });
      },
      log: this.deps.log
    });
    this.chromeSessionWatcher.start();
    this.deps.log("box-store sync enabled (snapshot-out only)");
    this.deps.telemetry.reportBoxStoreSyncCycle("info", {
      ok: "true",
      reason: "enabled",
      phase: "startup"
    });
  }
  async dispose() {
    this.pollingHandle?.dispose();
    this.pollingHandle = void 0;
    this.chromeSessionWatcher?.stop();
    this.chromeSessionWatcher = void 0;
    await this.sync?.dispose();
    if (this.accessorInstance != null && this.accessorInstance !== this.sync) {
      await this.accessorInstance.dispose();
    }
    this.accessorInstance = void 0;
  }
  createSync(categories, objectStoreProvider, logPrefix) {
    return new BoxStoreSync({
      resolveStoreId: () => this.getStoreId(),
      categories,
      objectStoreProvider,
      manifestV2: this.deps.boxStore.manifestV2,
      packBuildEnabled: this.deps.boxStore.packBuildEnabled,
      isSkipInaccessibleEnabled: this.deps.isSkipInaccessibleEnabled,
      hydrationHandoffMarkerPath: (0, import_node_path23.join)(this.sandRoot, BOX_STORE_HYDRATION_HANDOFF_FILE_NAME),
      storeDbDebounce: this.deps.storeDbDebounce,
      manifestRetry: this.deps.manifestRetry,
      now: () => this.deps.clock.now(),
      log: (message) => this.deps.log(`${logPrefix} ${message}`),
      ...categories.length > 0 ? {
        lockPath: (0, import_node_path23.join)(this.sandRoot, "box-store-sync.lock"),
        windowId: `sand-host-${process.pid}`,
        onCycle: (summary) => this.reportBoxStoreSyncCycle(summary),
        onStoreDbCapture: (summary) => this.reportBoxStoreDbCapture(summary),
        onManifestWriteConflict: (info2) => this.reportBoxStoreManifestConflict(info2)
      } : {}
    });
  }
  accessor() {
    if (this.sync != null) return this.sync;
    this.accessorInstance ??= this.createSync(
      [],
      this.api.objectStoreProvider,
      "[box-store-access]"
    );
    return this.accessorInstance;
  }
  async getStoreId() {
    const override = this.deps.boxStore.storeIdOverride;
    if (override != null && isAgentStoreSourceId(override)) return override;
    return (await this.deps.sourceMap.getOrCreateBoxStore()).sourceId;
  }
  async snapshotBoxStoreNow(args) {
    if (this.sync == null) {
      return {
        ok: false,
        manifestEntries: 0,
        storeDbEntries: 0,
        agentDirEntries: 0,
        filesUploaded: 0,
        reason: "store-sync-disabled"
      };
    }
    const summary = await this.sync.snapshotNow({
      includeIdleOnly: args.includeIdleOnly === true,
      includeStoreDbs: true,
      waitForInFlight: true,
      acceptMatchingCanonicalOnConflict: true
    }).catch((error41) => {
      this.deps.log(`flush snapshot rejected: ${errorMessage(error41)}`);
      return void 0;
    });
    return evaluateBoxStoreFlush(summary, {
      sessionCategoryName: CHROME_SESSION_CATEGORY_NAME
    });
  }
  async clearBoxStoreNow() {
    if (this.backendPolicy.kind === "sand-box-store-v2") {
      const legacy = this.createSync(
        [],
        new AgentStoreObjectStoreProvider({ backend: this.deps.backend, ...this.deps.auth }),
        "[box-store-clear-legacy]"
      );
      const legacyResult = await legacy.clearStore();
      await legacy.dispose();
      if (!legacyResult.ok) {
        return {
          ok: false,
          reason: `legacy store clear failed: ${legacyResult.reason ?? "unknown"}`
        };
      }
    }
    return await this.accessor().clearStore();
  }
  async runCycle() {
    if (this.sync == null) return;
    const idle = this.deps.isIdle();
    const now = this.deps.clock.monotonicNow();
    const hydrationHandoffPending = (0, import_node_fs22.existsSync)(
      (0, import_node_path23.join)(this.sandRoot, BOX_STORE_HYDRATION_HANDOFF_FILE_NAME)
    );
    const sealHydrationHandoff = hydrationHandoffPending && idle;
    const includeIdleOnly = sealHydrationHandoff || idle && now - this.lastChromeSyncMs >= BOX_STORE_CHROME_INTERVAL_MS;
    if (includeIdleOnly) this.lastChromeSyncMs = now;
    await this.sync.snapshotNow({
      includeIdleOnly,
      includeStoreDbs: idle,
      skipLiveHandleStoreDbs: !sealHydrationHandoff,
      includePacks: includeIdleOnly
    }).catch((error41) => {
      this.deps.log(`periodic snapshot rejected: ${errorMessage(error41)}`);
    });
  }
  reportChromeSessionStage(outcome) {
    const failure2 = outcome.failure;
    this.deps.telemetry.reportChromeSessionStage(outcome.skipped > 0 ? "warn" : "info", {
      staged: String(outcome.staged),
      skipped: String(outcome.skipped),
      skipped_dbs: outcome.skippedDbNames.length > 0 ? outcome.skippedDbNames.join(",") : void 0,
      error_class: outcome.errorClass ?? void 0,
      failure_db: failure2?.db,
      failure_phase: failure2?.phase,
      failure_operation: failure2?.operation,
      failure_path_stage: failure2?.pathStage,
      failure_cause: failure2?.cause,
      errno: failure2?.errno,
      sqlite_code: failure2?.sqliteCode === void 0 ? void 0 : String(failure2.sqliteCode)
    });
  }
  reportBoxStoreSyncCycle(summary) {
    const event = boxStoreSyncCycleTelemetry(summary);
    if (event == null) return;
    this.deps.telemetry.reportBoxStoreSyncCycle(event.level, event.metadata);
  }
  reportBoxStoreManifestConflict(info2) {
    this.deps.telemetry.reportBoxStoreManifestConflict("warn", {
      store_id: info2.storeId,
      attempts: String(info2.attempts),
      accepted: String(info2.accepted),
      covered: String(info2.covered),
      canonical_matches_attempt: String(info2.canonicalMatchesAttempt),
      live_view_changed: String(info2.liveViewChanged),
      attempted_entries: String(info2.attemptedEntries),
      last_base_etag: info2.lastBaseEtag ?? void 0,
      last_baseline_source: info2.lastBaselineSource ?? void 0,
      last_conflict_rel_path: info2.lastConflictRelPath ?? void 0,
      canonical_readable: String(info2.canonicalReadable),
      canonical_entry_count: info2.canonicalEntryCount == null ? void 0 : String(info2.canonicalEntryCount),
      canonical_updated_at_ms: info2.canonicalUpdatedAtMs == null ? void 0 : String(info2.canonicalUpdatedAtMs),
      canonical_writer_window_id: info2.canonicalWriterWindowId ?? void 0,
      our_window_id: info2.ourWindowId ?? void 0
    });
  }
  reportBoxStoreDbCapture(summary) {
    const event = boxStoreDbCaptureTelemetry(summary);
    this.deps.telemetry.reportBoxStoreDbCapture(event.level, event.metadata);
  }
};
function buildBoxStoreCategories(args) {
  const sandDataPrefix = "home/box/sand-data";
  return [
    {
      name: "sand-data",
      absRoot: args.sandRoot,
      relPrefix: sandDataPrefix,
      containsAgentStoreDbs: true,
      excludes: [
        `${sandDataPrefix}/host.lock`,
        `${sandDataPrefix}/gateway.json`,
        `${sandDataPrefix}/box-store-sync.lock`,
        `${sandDataPrefix}/${BOX_STORE_HYDRATION_HANDOFF_FILE_NAME}`,
        ...BOX_STORE_SAND_DATA_EXCLUDED_FILE_NAMES.map((name17) => `${sandDataPrefix}/${name17}`)
      ]
    },
    {
      name: "workspace",
      absRoot: "/workspace",
      relPrefix: "workspace",
      ignore: () => loadWorkspaceIgnore("/workspace")
    },
    {
      name: "cli-config",
      absRoot: "/home/box/cli-config",
      relPrefix: "home/box/cli-config",
      excludes: [
        "home/box/cli-config/.cli-auth-tmp*",
        "home/box/cli-config/*.cli-auth-old",
        "home/box/cli-config/**/*.cli-auth-old"
      ]
    },
    {
      name: CHROME_SESSION_CATEGORY_NAME,
      absRoot: CHROME_SESSION_DB_DIR,
      relPrefix: "home/box/chrome-profile",
      stageOnly: true,
      stage: () => stageBoxChromeSession({
        retry: args.chromeStageRetry,
        report: args.reportChromeSessionStage
      })
    },
    ...CHROME_AUTH_STATE_REL_DIRS.map((dir) => ({
      name: `chrome-${dir.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      absRoot: `${CHROME_SESSION_DB_DIR}/${dir}`,
      relPrefix: `${CHROME_SESSION_DB_REL_DIR}/${dir}`,
      excludes: CHROME_AUTH_STATE_CACHE_EXCLUDE_NAMES.map(
        (cache3) => `${CHROME_SESSION_DB_REL_DIR}/${dir}/${cache3}`
      ),
      missingRootMeansDeleted: true
    })),
    {
      name: "chrome-profile",
      absRoot: "/home/box/chrome-profile",
      relPrefix: "home/box/chrome-profile",
      excludes: [
        ...SAND_BOX_PERSIST_ARCHIVE_EXCLUDES,
        ...CHROME_SESSION_DB_NAMES.flatMap(
          (name17) => ["", "-wal", "-shm", "-journal"].map(
            (suffix) => `${CHROME_SESSION_DB_REL_DIR}/${name17}${suffix}`
          )
        ),
        ...CHROME_AUTH_STATE_REL_DIRS.map((dir) => `${CHROME_SESSION_DB_REL_DIR}/${dir}`)
      ],
      idleOnly: true
    },
    ...args.wholeHomeCategory ? [buildBoxHomeCategory(BOX_HOME_DIR)] : []
  ];
}
function createBoxStoreSyncService(deps) {
  return new DefaultBoxStoreSyncService(deps);
}
