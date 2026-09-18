function resolveCopyInConcurrency(env) {
  const raw = env.SAND_BOX_STORE_COPY_IN_CONCURRENCY?.trim();
  if (raw == null || raw === "") return void 0;
  const parsed2 = Number.parseInt(raw, 10);
  return Number.isFinite(parsed2) && parsed2 > 0 ? parsed2 : void 0;
}
function resolveCopyInOwnerTeamId(env) {
  const raw = env.SAND_BOX_OWNER_TEAM_ID?.trim();
  if (raw == null || raw === "") return void 0;
  const teamId = Number(raw);
  return Number.isSafeInteger(teamId) && teamId > 0 ? teamId : void 0;
}
function shouldHydrateFromLegacyStore(policyKind, env) {
  return policyKind === "sand-box-store-v2" && !isLegacyBoxStoreHydrateSkipped(env);
}
var BOX_COPY_IN_EXIT_NOOP = 0;
var BOX_COPY_IN_EXIT_FAILED = 1;
var BOX_COPY_IN_EXIT_HYDRATED = 10;
function classifyCopyInMeteredOutcome(result) {
  if (result.outcome === "hydrated") return "hydrated";
  if (result.outcome === "noop") return "empty";
  switch (result.reasonCode) {
    case "partial-hydrate":
    case "incomplete-legacy-hydrate":
    case "legacy-store-db-identities-empty":
    case "legacy-store-db-coverage-conflict":
      return "partial";
    default:
      return "failed";
  }
}
var SAND_BOX_COPY_IN_STATUS_PATH = "/tmp/sand-copy-in-status.json";
var COPY_IN_STATUS_THROTTLE_MS = 750;
function buildCopyInStatusFromResult(result) {
  const failed2 = result.outcome === "failed";
  return {
    phase: failed2 ? "failed" : "done",
    restored: result.files,
    total: result.manifestEntries,
    bytes: result.bytes,
    outcome: classifyCopyInMeteredOutcome(result),
    storeDbEntries: result.storeDbEntries,
    reason: bucketCopyInReason(result),
    ...failed2 ? {
      errorClass: classifyCopyInFailure(result),
      errorSummary: redactCopyInErrorForTelemetry(result.failures[0] ?? result.reason),
      failureCount: result.failures.length
    } : {},
    ...result.restoredStoreDbEntries != null ? { restoredStoreDbEntries: result.restoredStoreDbEntries } : {},
    ...result.hydrateSource != null ? { hydrateSource: result.hydrateSource } : {}
  };
}
function makeCopyInStatusWriter(path31 = SAND_BOX_COPY_IN_STATUS_PATH, now = Date.now) {
  let lastWriteMs = 0;
  return (status, options2) => {
    const ts2 = now();
    if (!(options2?.force ?? false) && ts2 - lastWriteMs < COPY_IN_STATUS_THROTTLE_MS) {
      return;
    }
    lastWriteMs = ts2;
    try {
      writeFileAtomicSync(path31, JSON.stringify(status));
    } catch {
    }
  };
}
var COPY_IN_RETRY_ATTEMPTS = 5;
var COPY_IN_RETRY_BASE_MS = 1e3;
var COPY_IN_RETRY_MAX_MS = 15e3;
var COPY_IN_CREDENTIAL_RETRY = createRetryPolicy({
  name: "box-copy-in-inference-credential",
  maxAttempts: COPY_IN_RETRY_ATTEMPTS,
  initialDelayMs: COPY_IN_RETRY_BASE_MS,
  maxDelayMs: COPY_IN_RETRY_MAX_MS,
  keepEventLoopAliveDuringWaits: true
});
var COPY_IN_STORE_DB_DEBOUNCE = createDebouncePolicy({
  name: "box-copy-in-store-db",
  delayMs: 0
});
var COPY_IN_MANIFEST_RETRY = createRetryPolicy({
  name: "box-copy-in-manifest",
  maxAttempts: BOX_STORE_MANIFEST_RETRY_ATTEMPTS,
  initialDelayMs: BOX_STORE_MANIFEST_RETRY_DELAY_MS,
  maxDelayMs: BOX_STORE_MANIFEST_RETRY_DELAY_MS,
  shouldRetry: (error41) => error41 instanceof BoxStoreCanonicalWriteConflictError,
  keepEventLoopAliveDuringWaits: true
});
var COPY_IN_HYDRATE_ATTEMPTS = 8;
function resolveCopyInAttempts(env) {
  const raw = env.SAND_BOX_COPY_IN_ATTEMPTS?.trim();
  if (raw == null || raw === "") return COPY_IN_HYDRATE_ATTEMPTS;
  const parsed2 = Number.parseInt(raw, 10);
  return Number.isFinite(parsed2) && parsed2 > 0 ? parsed2 : COPY_IN_HYDRATE_ATTEMPTS;
}
var TOKEN_REFRESH_LEEWAY_MS2 = 6e4;
var COPY_IN_STUCK_THRESHOLD_MS = 5 * 60 * 1e3;
function resolveCopyInStuckThresholdMs(env) {
  const raw = env.SAND_BOX_COPY_IN_STUCK_MS?.trim();
  if (raw == null || raw === "") return COPY_IN_STUCK_THRESHOLD_MS;
  const parsed2 = Number.parseInt(raw, 10);
  return Number.isFinite(parsed2) && parsed2 > 0 ? parsed2 : COPY_IN_STUCK_THRESHOLD_MS;
}
function buildCopyInWatchdogEvent(input) {
  const metadata = {
    outcome: input.progressedSinceLastTick ? "slow" : "stuck",
    reason: input.progressedSinceLastTick ? "moving-data-in-slow-but-advancing" : "moving-data-in-exceeded-threshold",
    manifest_entries: String(input.progress.total),
    files: String(input.progress.files),
    bytes: String(input.progress.bytes),
    duration_ms: String(input.elapsedMs),
    threshold_ms: String(input.thresholdMs)
  };
  const trace2 = input.trace;
  if (trace2?.copyStage != null) metadata.stage = trace2.copyStage;
  if (trace2?.fileEntries != null) metadata.file_entries = String(trace2.fileEntries);
  if (trace2?.symlinkEntries != null) metadata.symlink_entries = String(trace2.symlinkEntries);
  if (trace2?.symlinksStarted != null) metadata.symlinks_started = String(trace2.symlinksStarted);
  if (trace2?.symlinksCompleted != null)
    metadata.symlinks_completed = String(trace2.symlinksCompleted);
  if (trace2?.symlinksInFlight != null) metadata.symlinks_in_flight = String(trace2.symlinksInFlight);
  if (trace2?.activeSymlinkSteps != null) {
    const activeSteps = Object.entries(trace2.activeSymlinkSteps).filter(([, count]) => count > 0).map(([step, count]) => `${step}:${count}`).join(",");
    if (activeSteps !== "") metadata.active_symlink_steps = activeSteps;
  }
  return {
    level: input.progressedSinceLastTick ? "info" : "warn",
    metadata
  };
}
async function resolveCopyInDownloadOwner(deps) {
  const getuid = deps?.getuid ?? process.getuid;
  if (getuid == null || getuid() !== 0) return void 0;
  try {
    const home = await (deps?.statHomeDir ?? (() => (0, import_promises23.stat)(BOX_HOME_DIR)))();
    return home.uid > 0 ? { uid: home.uid, gid: home.gid } : void 0;
  } catch (error41) {
    if (!isMissingPathError(error41)) {
      reportBoxStoreDiagnostic({
        extension: "box_store",
        kind: "home_dir_stat_failed",
        errorClass: boundedErrorClass(error41)
      });
    }
    return void 0;
  }
}
function boundedErrorClass(error41) {
  return brandedErrorClass(findSystemErrno(error41) ?? connectErrorClassOf(error41));
}
function reportTelemetryTokenUnavailable(reported2, error41) {
  const errorClass = boundedErrorClass(error41);
  if (reported2.has(errorClass)) return;
  reported2.add(errorClass);
  reportBoxStoreDiagnostic({
    extension: "box_store",
    kind: "telemetry_token_unavailable",
    errorClass
  });
}
async function pruneRestoredOriginCliStoredLogins(targetDir) {
  const mirrorDir = (0, import_node_path24.join)(targetDir, "home/box/cli-config");
  const credentialDirs = [
    (0, import_node_path24.join)(targetDir, "home/box/.config/origin-cli"),
    (0, import_node_path24.join)(mirrorDir, ".config/origin-cli")
  ];
  const errors = [];
  try {
    for (const entry of await (0, import_promises23.readdir)((0, import_node_path24.join)(mirrorDir, ".by-home"), { withFileTypes: true })) {
      if (entry.isDirectory()) {
        credentialDirs.push((0, import_node_path24.join)(mirrorDir, ".by-home", entry.name, ".config/origin-cli"));
      }
    }
  } catch (error41) {
    if (findSystemErrno(error41) !== "ENOENT") errors.push(error41);
  }
  const removals = await Promise.allSettled(
    credentialDirs.map((credentialDir) => (0, import_promises23.rm)(credentialDir, { recursive: true, force: true }))
  );
  for (const removal of removals) {
    if (removal.status === "rejected") errors.push(removal.reason);
  }
  if (errors.length > 0) {
    throw new AggregateError(errors, "failed to prune restored Origin CLI stored logins");
  }
}
async function runBoxCopyIn(deps) {
  const log4 = deps.log ?? (() => {
  });
  let manifestPresent;
  let manifest;
  let primaryFullyHydrated;
  try {
    ({
      present: manifestPresent,
      manifest,
      fullyHydrated: primaryFullyHydrated
    } = await deps.sync.readManifestStrictDetailed());
  } catch (error41) {
    return {
      outcome: "failed",
      reasonCode: "primary-manifest-unreadable",
      failure: copyInFailureOf(error41),
      reason: `store manifest unreadable: ${errorMessage(error41)}`,
      manifestEntries: 0,
      storeDbEntries: 0,
      files: 0,
      bytes: 0,
      verified: 0,
      failures: [errorMessage(error41)]
    };
  }
  let downloadVia = deps.sync;
  let hydrateSource;
  let downloadFromLegacy = false;
  let authoritativeStoreDbEntries;
  let authoritativeStoreDbAgentIds;
  if ((!manifestPresent || primaryFullyHydrated === false) && deps.legacySync != null) {
    let legacyManifest;
    try {
      legacyManifest = await deps.legacySync.readManifestStrict();
    } catch (error41) {
      if (!manifestPresent && error41 instanceof ConnectError && error41.code === Code.NotFound) {
        log4("legacy store is unavailable (not_found); booting the fresh V2 store");
        return empty("legacy-source-not-found", "legacy source unavailable: not_found; first boot");
      }
      return {
        outcome: "failed",
        reasonCode: "legacy-manifest-unreadable",
        failure: copyInFailureOf(error41),
        reason: `legacy store manifest unreadable: ${errorMessage(error41)}`,
        manifestEntries: 0,
        storeDbEntries: 0,
        files: 0,
        bytes: 0,
        verified: 0,
        failures: [errorMessage(error41)],
        hydrateSource: "legacy"
      };
    }
    if (legacyManifest.size > 0) {
      if (deps.legacySync.manifestV2Enabled === true) {
        deps.sync.enrollManifestV2?.();
      }
      authoritativeStoreDbEntries = countStoreDbManifestEntries(legacyManifest);
      authoritativeStoreDbAgentIds = getStoreDbManifestAgentIds(legacyManifest);
      hydrateSource = "legacy";
      if (primaryFullyHydrated === false && manifest.size > 0) {
        const primaryStoreDbAgentIds = getStoreDbManifestAgentIds(manifest);
        if (authoritativeStoreDbAgentIds.size === 0) {
          return {
            outcome: "failed",
            reasonCode: "legacy-store-db-identities-empty",
            reason: `${INCOMPLETE_LEGACY_HYDRATE_REASON} legacy source has no store.db identities to validate V2`,
            manifestEntries: manifest.size,
            storeDbEntries: 0,
            restoredStoreDbEntries: 0,
            files: 0,
            bytes: 0,
            verified: 0,
            failures: ["legacy source store.db identity set is empty"],
            hydrateSource
          };
        }
        const primaryCoversLegacyAgents = [...authoritativeStoreDbAgentIds].every(
          (agentId) => primaryStoreDbAgentIds.has(agentId)
        );
        if (!primaryCoversLegacyAgents) {
          return {
            outcome: "failed",
            reasonCode: "legacy-store-db-coverage-conflict",
            reason: `${INCOMPLETE_LEGACY_HYDRATE_REASON} primary V2 store.db coverage is below the legacy source`,
            manifestEntries: manifest.size,
            storeDbEntries: authoritativeStoreDbEntries,
            restoredStoreDbEntries: [...authoritativeStoreDbAgentIds].filter(
              (agentId) => primaryStoreDbAgentIds.has(agentId)
            ).length,
            files: 0,
            bytes: 0,
            verified: 0,
            failures: ["incomplete primary V2 store.db agent coverage"],
            hydrateSource
          };
        }
        log4(
          `primary V2 manifest is not sealed but covers all ${authoritativeStoreDbEntries} legacy store.db entries; hydrating the newer V2 store`
        );
      } else {
        log4(
          `own store never seeded; hydrating ${legacyManifest.size} entries from the legacy store (v2 migration)`
        );
        manifest = legacyManifest;
        downloadVia = deps.legacySync;
        downloadFromLegacy = true;
      }
    } else if (primaryFullyHydrated === false) {
      return {
        outcome: "failed",
        reasonCode: "legacy-source-empty-for-incomplete-primary",
        reason: "legacy source manifest is empty for incomplete primary",
        manifestEntries: manifest.size,
        storeDbEntries: countStoreDbManifestEntries(manifest),
        restoredStoreDbEntries: 0,
        files: 0,
        bytes: 0,
        verified: 0,
        failures: ["legacy source manifest is empty"],
        hydrateSource: "legacy"
      };
    } else {
      return empty("legacy-source-empty", "legacy source empty; first boot");
    }
  }
  manifest = withoutForeignMountEntries(manifest, log4);
  if (manifest.size === 0) {
    return empty("store-empty", "store empty; first boot");
  }
  if (hydrateSource === "legacy") {
    try {
      if (deps.sync.markLegacyHydrationIncomplete == null) {
        throw new SandBoxStoreSyncError("primary sync cannot mark legacy hydrate incomplete", {
          copyInFailureCode: "legacy-hydration-mark-unsupported"
        });
      }
      await deps.sync.markLegacyHydrationIncomplete();
    } catch (error41) {
      return {
        outcome: "failed",
        reasonCode: "legacy-hydration-mark-error",
        failure: copyInFailureOf(error41),
        reason: `failed to mark legacy hydrate incomplete: ${errorMessage(error41)}`,
        manifestEntries: manifest.size,
        storeDbEntries: countStoreDbManifestEntries(manifest),
        files: 0,
        bytes: 0,
        verified: 0,
        failures: [errorMessage(error41)],
        hydrateSource
      };
    }
  }
  const advertisedStoreDbEntries = authoritativeStoreDbEntries ?? countStoreDbManifestEntries(manifest);
  let summary;
  try {
    summary = await downloadVia.download(deps.targetDir, {
      manifest,
      onProgress: deps.onProgress,
      onTrace: deps.onTrace,
      ...deps.downloadOwner
    });
  } catch (error41) {
    try {
      await pruneRestoredOriginCliStoredLogins(deps.targetDir);
    } catch (pruneError) {
      log4(`origin-cli stored-login prune failed: ${errorMessage(pruneError)}`);
    }
    return {
      outcome: "failed",
      reasonCode: "download-error",
      failure: copyInFailureOf(error41),
      reason: `download threw: ${errorMessage(error41)}`,
      manifestEntries: manifest.size,
      storeDbEntries: advertisedStoreDbEntries,
      restoredStoreDbEntries: 0,
      files: 0,
      bytes: 0,
      verified: 0,
      failures: [errorMessage(error41)],
      hydrateSource
    };
  }
  try {
    await pruneRestoredOriginCliStoredLogins(deps.targetDir);
  } catch (error41) {
    return {
      outcome: "failed",
      reasonCode: "origin-cli-login-prune-error",
      failure: copyInFailureOf(error41),
      reason: `origin-cli stored-login prune failed: ${errorMessage(error41)}`,
      manifestEntries: manifest.size,
      storeDbEntries: advertisedStoreDbEntries,
      restoredStoreDbEntries: 0,
      files: summary.files,
      bytes: summary.bytes,
      verified: summary.verified,
      failures: [errorMessage(error41)],
      hydrateSource
    };
  }
  const restoredStoreDbEntries = authoritativeStoreDbAgentIds == null ? countStoreDbManifestEntries(
    new Map([...manifest].filter(([relPath]) => (0, import_node_fs23.existsSync)((0, import_node_path24.join)(deps.targetDir, relPath))))
  ) : [...authoritativeStoreDbAgentIds].filter(
    (agentId) => (0, import_node_fs23.existsSync)((0, import_node_path24.join)(deps.targetDir, "home/box/sand-data/agents", agentId, "store.db"))
  ).length;
  const legacyStoreDbsComplete = restoredStoreDbEntries >= advertisedStoreDbEntries;
  const fullyHydrated = isBoxStoreFullyHydrated({
    hydrateSource: downloadFromLegacy ? "legacy" : void 0,
    failures: summary.failures,
    manifestEntries: manifest.size,
    files: summary.files,
    verified: summary.verified,
    authoritativeStoreDbEntries: advertisedStoreDbEntries,
    restoredStoreDbEntries
  }) && (hydrateSource !== "legacy" || legacyStoreDbsComplete);
  if (!fullyHydrated) {
    log4(
      `partial hydrate: ${summary.files}/${manifest.size} files, ${summary.failures.length} failures`
    );
    const reason = hydrateSource === "legacy" && !legacyStoreDbsComplete ? `${INCOMPLETE_LEGACY_HYDRATE_REASON} advertised_store_db=${advertisedStoreDbEntries} restored_store_db=${restoredStoreDbEntries} advisory_advertised_files=${manifest.size} advisory_restored_files=${summary.files}` : `partial hydrate (${summary.files}/${manifest.size} files, ${summary.failures.length} failures)`;
    return {
      outcome: "failed",
      reasonCode: hydrateSource === "legacy" && !legacyStoreDbsComplete ? "incomplete-legacy-hydrate" : "partial-hydrate",
      failure: summary.firstFailure,
      reason,
      manifestEntries: manifest.size,
      storeDbEntries: advertisedStoreDbEntries,
      restoredStoreDbEntries,
      files: summary.files,
      bytes: summary.bytes,
      verified: summary.verified,
      failures: summary.failures,
      hydrateSource
    };
  }
  if (hydrateSource === "legacy") {
    try {
      if (deps.sync.markLegacyHydrationCompleteForHandoff == null) {
        throw new SandBoxStoreSyncError("primary sync cannot persist legacy hydrate handoff");
      }
      await deps.sync.markLegacyHydrationCompleteForHandoff();
    } catch (error41) {
      log4(
        `failed to persist legacy hydrate handoff after complete restore: ${errorMessage(error41)}`
      );
    }
  }
  return {
    outcome: "hydrated",
    reasonCode: "hydrated",
    reason: hydrateSource === "legacy" ? "store hydrated from legacy (v2 migration)" : "store hydrated",
    manifestEntries: manifest.size,
    storeDbEntries: advertisedStoreDbEntries,
    files: summary.files,
    bytes: summary.bytes,
    verified: summary.verified,
    failures: [],
    hydrateSource
  };
}
async function runBoxCopyInWithRetry(deps, options2) {
  let advertisedLegacyManifest;
  const legacySync = deps.legacySync;
  const retryDeps = legacySync == null ? deps : {
    ...deps,
    legacySync: {
      get manifestV2Enabled() {
        return legacySync.manifestV2Enabled;
      },
      download: legacySync.download.bind(legacySync),
      readManifestStrict: async () => {
        if (advertisedLegacyManifest != null) {
          return advertisedLegacyManifest;
        }
        const liveLegacyManifest = await legacySync.readManifestStrict();
        if (liveLegacyManifest.size > 0) {
          advertisedLegacyManifest = liveLegacyManifest;
        }
        return liveLegacyManifest;
      }
    }
  };
  let result = await runBoxCopyIn(retryDeps);
  for (let attempt = 1; attempt < options2.attempts && isTransientCopyInFailure(result); attempt += 1) {
    const wait = options2.retry.schedule(attempt);
    deps.log?.(
      `copy-in failed transiently (attempt ${attempt}/${options2.attempts}): ${result.reason}; retrying in ${wait.delayMs}ms`
    );
    try {
      await wait.elapsed;
    } finally {
      wait.dispose();
    }
    result = await runBoxCopyIn(retryDeps);
  }
  return result;
}
async function executeBoxCopyInFromEnv(env, createTelemetryClient) {
  const startedAt = Date.now();
  const log4 = (message) => {
    process.stdout.write(`[box-copy-in] ${message}
`);
  };
  if (!isBoxStoreCopyInEnabled(env)) {
    log4("disabled (SAND_BOX_STORE_COPY_IN not truthy); no-op");
    return BOX_COPY_IN_EXIT_NOOP;
  }
  const sandRoot = getSandRootDir();
  const storeId = await resolveCopyInStoreId(env, new SandSourceMap());
  if (storeId == null) {
    log4(
      "no per-box store id (SAND_BOX_STORE_ID unset and no source-map entry); boot fresh \u2014 no-op"
    );
    return BOX_COPY_IN_EXIT_NOOP;
  }
  const backendPolicy = getBoxStoreBackendPolicy(env);
  const { backend } = readSandProcessEnvironment(env);
  const accessToken = backendPolicy.localDir != null ? null : makeCopyInAccessTokenGetter(env, backend, log4);
  const sync = new BoxStoreSync({
    objectStoreProvider: resolveBoxObjectStoreProvider({
      policy: backendPolicy,
      agentStore: {
        backend,
        getAccessToken: accessToken ?? (async () => ""),
        getMachineId: () => getOrCreateHostMachineId(),
        getTeamId: async () => resolveCopyInOwnerTeamId(env)
      }
    }),
    resolveStoreId: async () => storeId,
    categories: [],
    manifestV2: env[SAND_MANIFEST_V2_ENV] === "1",
    packBuildEnabled: isBoxStorePackBuildEnabled(env),
    storeDbDebounce: COPY_IN_STORE_DB_DEBOUNCE,
    manifestRetry: COPY_IN_MANIFEST_RETRY,
    hydrationHandoffMarkerPath: (0, import_node_path24.join)(sandRoot, BOX_STORE_HYDRATION_HANDOFF_FILE_NAME),
    downloadConcurrency: resolveCopyInConcurrency(env),
    log: log4
  });
  if (backendPolicy.kind === "sand-box-store-v2" && isLegacyBoxStoreHydrateSkipped(env)) {
    log4("broker stamped the legacy store absent; skipping the legacy-hydrate fallback");
  }
  const legacySync = shouldHydrateFromLegacyStore(backendPolicy.kind, env) ? new BoxStoreSync({
    objectStoreProvider: new AgentStoreObjectStoreProvider({
      backend,
      getAccessToken: accessToken ?? (async () => ""),
      getMachineId: () => getOrCreateHostMachineId(),
      getTeamId: async () => resolveCopyInOwnerTeamId(env)
    }),
    resolveStoreId: async () => storeId,
    categories: [],
    manifestV2: env[SAND_MANIFEST_V2_ENV] === "1",
    packBuildEnabled: isBoxStorePackBuildEnabled(env),
    storeDbDebounce: COPY_IN_STORE_DB_DEBOUNCE,
    manifestRetry: COPY_IN_MANIFEST_RETRY,
    downloadConcurrency: resolveCopyInConcurrency(env),
    log: (message) => log4(`[legacy] ${message}`)
  }) : void 0;
  const reportedTokenClasses = /* @__PURE__ */ new Set();
  const telemetry = new SandStructuredLogTelemetry({
    backend,
    disabled: env.SAND_DISABLE_TELEMETRY === "1",
    createClient: createTelemetryClient,
    getAccessToken: async () => {
      if (accessToken == null) return "";
      try {
        return await accessToken();
      } catch (error41) {
        reportTelemetryTokenUnavailable(reportedTokenClasses, error41);
        return "";
      }
    },
    getMachineId: () => getOrCreateHostMachineId(),
    getTeamId: async () => resolveCopyInOwnerTeamId(env),
    identityTags: {
      ...resolveSandBoxIdentityTags(env),
      store_backend: backendPolicy.kind
    },
    flushPolling: createPollingPolicy2({
      name: "sand-box-copy-in-telemetry-flush",
      intervalMs: TELEMETRY_FLUSH_TICK_MS
    }),
    submitDeadline: createDeadlinePolicy({
      name: "sand-box-copy-in-structured-log-submit",
      timeoutMs: STRUCTURED_LOG_SUBMIT_DEADLINE_MS
    })
  });
  pinBoxStoreDiagnosticsReporter(
    (diagnostic) => telemetry.reportHostExtensionDiagnostic(diagnostic)
  );
  let lastProgress = {
    files: 0,
    bytes: 0,
    total: 0
  };
  let progressEvents = 0;
  let lastTraceStatus = {};
  const reportCopyIn = (result) => {
    const failureClass = classifyCopyInFailure(result);
    telemetry.reportBoxCopyIn(result.outcome === "failed" ? "error" : "info", {
      outcome: result.outcome,
      hydrate_source: result.hydrateSource,
      reason: bucketCopyInReason(result),
      error_class: failureClass === void 0 ? void 0 : brandLiteralEnum(failureClass),
      manifest_entries: String(result.manifestEntries),
      store_db_entries: String(result.storeDbEntries),
      restored_store_db_entries: result.restoredStoreDbEntries == null ? void 0 : String(result.restoredStoreDbEntries),
      files: String(result.files),
      bytes: String(result.bytes),
      verified: String(result.verified),
      failures: String(result.failures.length),
      duration_ms: String(Date.now() - startedAt)
    });
  };
  let legacyFallbackReason = "legacy-fallback-not-applicable";
  if (backendPolicy.kind === "sand-box-store-v2") {
    legacyFallbackReason = legacySync == null ? "legacy-fallback-skipped-backend-absent" : "legacy-fallback-enabled";
  }
  telemetry.reportBoxCopyIn("info", {
    outcome: "started",
    reason: legacyFallbackReason,
    duration_ms: "0"
  });
  const stuckThresholdMs = resolveCopyInStuckThresholdMs(env);
  let progressEventsAtLastTick = 0;
  const stuckWatchdog = createIdleWatchdogPolicy({
    name: "box-copy-in-stuck",
    idleMs: stuckThresholdMs
  });
  const stuckWatchdogHandle = stuckWatchdog.arm(() => {
    const elapsedMs3 = Date.now() - startedAt;
    const tick = buildCopyInWatchdogEvent({
      elapsedMs: elapsedMs3,
      thresholdMs: stuckThresholdMs,
      progressedSinceLastTick: progressEvents > progressEventsAtLastTick,
      progress: lastProgress,
      trace: lastTraceStatus
    });
    progressEventsAtLastTick = progressEvents;
    log4(
      `STILL copying after ${elapsedMs3}ms (files=${lastProgress.files}/${lastProgress.total} bytes=${lastProgress.bytes} active_symlink_steps=${tick.metadata.active_symlink_steps ?? "none"}); emitting ${tick.metadata.outcome} event`
    );
    telemetry.reportBoxCopyIn(tick.level, tick.metadata);
    stuckWatchdogHandle.kick();
  });
  try {
    const lockPath = (0, import_node_path24.join)(sandRoot, "box-store-sync.lock");
    const lock = await acquireCopyInLock(lockPath, log4);
    if (lock == null) {
      log4("could not acquire box-store lock (live writer?); failing closed");
      const lockResult = {
        outcome: "failed",
        reasonCode: "lock-held",
        failure: { code: "lock-held" },
        reason: "lock-held",
        manifestEntries: 0,
        storeDbEntries: 0,
        files: 0,
        bytes: 0,
        verified: 0,
        failures: []
      };
      makeCopyInStatusWriter()(buildCopyInStatusFromResult(lockResult), {
        force: true
      });
      reportCopyIn(lockResult);
      return BOX_COPY_IN_EXIT_FAILED;
    }
    const writeStatus = makeCopyInStatusWriter();
    writeStatus({ phase: "copying", restored: 0, total: 0, bytes: 0 }, { force: true });
    try {
      const hydrateAttempts = resolveCopyInAttempts(env);
      const hydrateRetry = createRetryPolicy({
        name: "box-copy-in-hydrate",
        maxAttempts: hydrateAttempts,
        initialDelayMs: COPY_IN_RETRY_BASE_MS,
        maxDelayMs: COPY_IN_RETRY_MAX_MS,
        keepEventLoopAliveDuringWaits: true
      });
      const result = await runBoxCopyInWithRetry(
        {
          sync,
          legacySync,
          targetDir: "/",
          downloadOwner: await resolveCopyInDownloadOwner(),
          log: log4,
          onProgress: (progress) => {
            progressEvents += 1;
            lastProgress = {
              files: progress.files,
              bytes: progress.bytes,
              total: progress.total
            };
            writeStatus({
              phase: "copying",
              restored: progress.files,
              total: progress.total,
              bytes: progress.bytes,
              ...lastTraceStatus
            });
          },
          onTrace: (trace2) => {
            const copyStage = trace2.event === "manifest-planned" ? "manifest" : "symlink";
            lastTraceStatus = {
              copyStage,
              fileEntries: trace2.fileEntries,
              symlinkEntries: trace2.symlinkEntries,
              symlinksStarted: trace2.symlinksStarted,
              symlinksCompleted: trace2.symlinksCompleted,
              symlinksInFlight: trace2.symlinksInFlight,
              activeSymlinkSteps: trace2.activeSymlinkSteps
            };
          }
        },
        {
          attempts: hydrateAttempts,
          retry: hydrateRetry
        }
      );
      writeStatus(buildCopyInStatusFromResult(result), { force: true });
      log4(
        `result outcome=${result.outcome} store_entries=${result.manifestEntries} files=${result.files} bytes=${result.bytes} verified=${result.verified} failures=${result.failures.length} duration_ms=${Date.now() - startedAt} reason="${result.reason}"`
      );
      for (const failure2 of result.failures.slice(0, 20)) {
        log4(`  failure: ${failure2}`);
      }
      reportCopyIn(result);
      return outcomeToExitCode(result.outcome);
    } catch (error41) {
      const thrown = {
        outcome: "failed",
        reasonCode: "copy-in-error",
        failure: copyInFailureOf(error41),
        reason: `copy-in threw: ${errorMessage(error41)}`,
        manifestEntries: 0,
        storeDbEntries: 0,
        files: 0,
        bytes: 0,
        verified: 0,
        failures: [errorMessage(error41)]
      };
      writeStatus(buildCopyInStatusFromResult(thrown), { force: true });
      reportCopyIn(thrown);
      return BOX_COPY_IN_EXIT_FAILED;
    } finally {
      await lock.release().catch(() => {
      });
    }
  } finally {
    stuckWatchdogHandle.dispose();
    await telemetry.dispose().catch(() => {
    });
  }
}
function bucketCopyInReason(result) {
  if (result.outcome === "hydrated") return "hydrated";
  if (result.outcome === "noop") {
    if (result.reasonCode === "legacy-source-not-found" || result.reasonCode === "legacy-source-empty") {
      return result.reasonCode;
    }
    return "noop";
  }
  switch (result.reasonCode) {
    case "incomplete-legacy-hydrate":
    case "legacy-store-db-identities-empty":
    case "legacy-store-db-coverage-conflict":
      return INCOMPLETE_LEGACY_HYDRATE_REASON;
    case "partial-hydrate":
    case "primary-manifest-unreadable":
    case "legacy-manifest-unreadable":
    case "download-error":
      return result.reasonCode;
    default:
      return "error";
  }
}
function classifyCopyInFailure(result) {
  if (result.outcome !== "failed") return void 0;
  return result.failure == null ? "unknown" : copyInFailureClassOf(result.failure);
}
function isTransientCopyInFailure(result) {
  if (result.outcome !== "failed") return false;
  switch (result.reasonCode) {
    case "legacy-store-db-coverage-conflict":
    case "legacy-store-db-identities-empty":
    case "legacy-source-empty-for-incomplete-primary":
      return false;
    case "partial-hydrate":
    case "incomplete-legacy-hydrate":
      return true;
  }
  const cls = classifyCopyInFailure(result);
  return cls !== "auth" && cls !== "no-credential" && cls !== "lock-held";
}
function redactCopyInErrorForTelemetry(raw) {
  return raw.replace(/https?:\/\/\S+/gi, "<url>").replace(/\/[^\s"']+/g, "<path>").replace(/[A-Za-z0-9_-]{24,}/g, "<id>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function outcomeToExitCode(outcome) {
  switch (outcome) {
    case "hydrated":
      return BOX_COPY_IN_EXIT_HYDRATED;
    case "failed":
      return BOX_COPY_IN_EXIT_FAILED;
    case "noop":
      return BOX_COPY_IN_EXIT_NOOP;
  }
}
async function resolveCopyInStoreId(env, sourceMap) {
  const override = env.SAND_BOX_STORE_ID?.trim();
  if (override != null && override.length > 0 && isAgentStoreSourceId(override)) {
    return override;
  }
  return (await sourceMap.getBoxStore())?.sourceId ?? null;
}
function makeCopyInAccessTokenGetter(env, backend, log4) {
  let cached2;
  return async () => {
    if (cached2 != null && cached2.expiresAtMs - Date.now() > TOKEN_REFRESH_LEEWAY_MS2) {
      return cached2.token;
    }
    const renewed = await withRetry(
      "inference credential",
      () => fetchCopyInCredential(env, backend),
      log4
    );
    cached2 = { token: renewed.accessToken, expiresAtMs: renewed.expiresAtMs };
    return renewed.accessToken;
  };
}
async function fetchCopyInCredential(env, backend) {
  const devTokenFile = env[SAND_DEV_INFERENCE_TOKEN_FILE_ENV]?.trim();
  if (devTokenFile != null && devTokenFile.length > 0) {
    return readDevInferenceCredentialFile({ path: devTokenFile });
  }
  const credential = env[SAND_INFERENCE_RENEWAL_CREDENTIAL_ENV]?.trim();
  if (credential != null && credential.length > 0) {
    return renewSandBoxInferenceCredential({ backend, credential });
  }
  throw new SandBoxStoreSyncError(
    `no inference credential for copy-in (set ${SAND_INFERENCE_RENEWAL_CREDENTIAL_ENV} or ${SAND_DEV_INFERENCE_TOKEN_FILE_ENV})`,
    { copyInFailureCode: "no-credential" }
  );
}
var BOOT_COPY_IN_STALE_LOCK_MS = 5 * STORE_LOCK_MTIME_UPDATE_MS;
var BOOT_COPY_IN_STALE_RECHECK_MS = 2 * STORE_LOCK_MTIME_UPDATE_MS;
var BOOT_COPY_IN_HEARTBEAT_POLL_ATTEMPTS = (BOOT_COPY_IN_STALE_LOCK_MS + BOOT_COPY_IN_STALE_RECHECK_MS) / STORE_LOCK_MTIME_UPDATE_MS + 2;
var BOOT_COPY_IN_HEARTBEAT_POLL = createRetryPolicy({
  name: "box-copy-in-lock-heartbeat-poll",
  maxAttempts: BOOT_COPY_IN_HEARTBEAT_POLL_ATTEMPTS,
  initialDelayMs: STORE_LOCK_MTIME_UPDATE_MS,
  maxDelayMs: STORE_LOCK_MTIME_UPDATE_MS,
  keepEventLoopAliveDuringWaits: true
});
var LockHeartbeatUndecided = class extends Error {
};
async function acquireCopyInLock(lockPath, log4) {
  try {
    const existing = await judgeExistingLockByHeartbeat(lockPath);
    if (existing.kind === "live") {
      log4(`box-store lock held by ${existing.windowId} with a live heartbeat`);
      return null;
    }
    if (existing.kind === "stale") {
      log4(
        `box-store lock left by ${existing.windowId} stopped beating ${Math.round(existing.ageMs / 1e3)}s ago; taking it`
      );
      await (0, import_promises23.rm)(lockPath, { force: true });
    }
    const result = await tryAcquireStoreLock({
      lockPath,
      windowId: `sand-copy-in-${process.pid}`,
      staleLockMs: BOOT_COPY_IN_STALE_LOCK_MS,
      staleRecheckDelayMs: BOOT_COPY_IN_STALE_RECHECK_MS,
      processExists: pidIsNotEvidenceAcrossContainers
    });
    if (result.kind === "acquired") {
      return { release: () => result.lock.dispose() };
    }
    log4(
      `box-store lock held by ${result.owner?.windowId ?? "an unknown holder"} with a live heartbeat`
    );
    return null;
  } catch (error41) {
    log4(`store lock error: ${errorMessage(error41)}`);
    return null;
  }
}
async function judgeExistingLockByHeartbeat(lockPath) {
  let firstMtimeMs;
  let firstReadAtMs = 0;
  return BOOT_COPY_IN_HEARTBEAT_POLL.runWithRetry(async () => {
    let raw;
    let mtimeMs;
    try {
      raw = await (0, import_promises23.readFile)(lockPath, "utf8");
      mtimeMs = (await (0, import_promises23.stat)(lockPath)).mtimeMs;
    } catch (error41) {
      if (findSystemErrno(error41) === "ENOENT") return { kind: "absent" };
      throw error41;
    }
    const owner = parseLockOwnerFields(raw);
    if (owner == null) return { kind: "absent" };
    const windowId = owner.windowId ?? "an unknown holder";
    const now = Date.now();
    if (firstMtimeMs == null) {
      firstMtimeMs = mtimeMs;
      firstReadAtMs = now;
    } else if (mtimeMs !== firstMtimeMs) {
      return { kind: "live", windowId };
    }
    const ageMs = now - mtimeMs;
    if (ageMs > BOOT_COPY_IN_STALE_LOCK_MS && now - firstReadAtMs >= BOOT_COPY_IN_STALE_RECHECK_MS) {
      return { kind: "stale", windowId, ageMs };
    }
    throw new LockHeartbeatUndecided(windowId);
  });
}
function pidIsNotEvidenceAcrossContainers() {
  return true;
}
function parseLockOwnerFields(raw) {
  const invalidJson = /* @__PURE__ */ Symbol();
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    parsed2 = invalidJson;
  }
  if (parsed2 === invalidJson || typeof parsed2 !== "object" || parsed2 == null) return void 0;
  const fields2 = {};
  if ("uid" in parsed2 && typeof parsed2.uid === "number") fields2.uid = parsed2.uid;
  if ("sid" in parsed2 && typeof parsed2.sid === "string") fields2.sid = parsed2.sid;
  if ("windowId" in parsed2 && typeof parsed2.windowId === "string")
    fields2.windowId = parsed2.windowId;
  return fields2;
}
async function withRetry(label, fn, log4) {
  return COPY_IN_CREDENTIAL_RETRY.runWithRetry(async (attempt) => {
    try {
      return await fn();
    } catch (error41) {
      if (attempt < COPY_IN_RETRY_ATTEMPTS) {
        log4(
          `${label} failed (attempt ${attempt}/${COPY_IN_RETRY_ATTEMPTS}): ${errorMessage(error41)}; retrying`
        );
      }
      throw error41;
    }
  });
}
function empty(reasonCode, reason) {
  return {
    outcome: "noop",
    reasonCode,
    reason,
    manifestEntries: 0,
    storeDbEntries: 0,
    files: 0,
    bytes: 0,
    verified: 0,
    failures: []
  };
}
