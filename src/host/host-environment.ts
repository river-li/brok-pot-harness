var AGENT_INBOUND_COALESCE_DEFAULT_MS = 1e3;
function trimmedNonEmpty(raw) {
  const trimmed = raw?.trim();
  return trimmed != null && trimmed.length > 0 ? trimmed : void 0;
}
function isAffirmative(raw) {
  const normalized = raw?.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}
function isNegative(raw) {
  const normalized = raw?.trim().toLowerCase();
  return normalized === "0" || normalized === "false" || normalized === "no";
}
function parseLocalAutoReviewMode(value) {
  return value === "off" || value === "shadow" || value === "enforce" ? value : void 0;
}
function positiveInt(raw) {
  if (raw == null || raw.trim().length === 0) return void 0;
  const parsed2 = Number.parseInt(raw, 10);
  return Number.isFinite(parsed2) && parsed2 > 0 ? parsed2 : void 0;
}
function nonNegativeInt(raw) {
  if (raw == null || raw.trim().length === 0) return void 0;
  const parsed2 = Number.parseInt(raw, 10);
  return Number.isFinite(parsed2) && parsed2 >= 0 ? parsed2 : void 0;
}
function byteLimitOverride(raw) {
  const trimmed = raw?.trim();
  if (trimmed == null || trimmed.length === 0) return void 0;
  const parsed2 = Number(trimmed);
  if (!Number.isFinite(parsed2) || parsed2 <= 0) return void 0;
  return Math.floor(parsed2);
}
function conversationGcOverride(raw) {
  const normalized = raw?.trim().toLowerCase();
  if (normalized === "1" || normalized === "true" || normalized === "on") return true;
  if (normalized === "0" || normalized === "false" || normalized === "off") return false;
  return void 0;
}
function jitterRatio(raw) {
  const parsed2 = Number.parseFloat(raw ?? "");
  return Number.isFinite(parsed2) && parsed2 >= 0 ? parsed2 : void 0;
}
function hostBundleBaseUrlOverride(raw) {
  return trimmedNonEmpty(raw)?.replace(/\/+$/, "");
}
function csnapsBinPathOf(raw) {
  return trimmedNonEmpty(raw) ?? (0, import_node_path27.join)((0, import_node_path27.dirname)((0, import_node_url5.fileURLToPath)(__import_meta_url)), "extensions", "codebase-telemetry", "csnaps");
}
function readSandHostEnvironment(env) {
  const inBox = env.SAND_HOST_IN_BOX === "1";
  return {
    ...readSandProcessEnvironment(env),
    inBox,
    sessionBox: env[SAND_BOX_SESSION_ENV] === SAND_BOX_SESSION_ON_VALUE,
    boxBoot: {
      id: env[SAND_BOX_BOOT_ID_ENV]?.trim(),
      startedAtMs: Number(env[SAND_BOX_BOOT_STARTED_AT_MS_ENV])
    },
    cursorDataDir: env.CURSOR_DATA_DIR,
    agentModelOverride: env.SAND_AGENT_MODEL,
    agentMockResponse: env.SAND_AGENT_MOCK_RESPONSE,
    spotlightOverride: env.SAND_SPOTLIGHT,
    autoReviewMode: parseLocalAutoReviewMode(env.SAND_AUTO_REVIEW_MODE),
    conversation: {
      softLimitBytes: byteLimitOverride(env.SAND_CONVERSATION_SOFT_LIMIT_BYTES),
      hardLimitBytes: byteLimitOverride(env.SAND_CONVERSATION_HARD_LIMIT_BYTES),
      gc: conversationGcOverride(env.SAND_CONVERSATION_GC)
    },
    runLifecycle: {
      schedulerDisabled: env.SAND_DISABLE_RUN_SCHEDULER === "1",
      watchdogMs: positiveInt(env.SAND_RUN_WATCHDOG_MS),
      watchdogGraceMs: positiveInt(env.SAND_RUN_WATCHDOG_GRACE_MS),
      forcedPauseReapMs: positiveInt(env.SAND_FORCED_PAUSE_REAP_MS)
    },
    recreateWakeCarryDisabled: env.SAND_DISABLE_RECREATE_WAKE_CARRY === "1",
    agentInboundCoalesceMs: nonNegativeInt(env.SAND_AGENT_INBOUND_COALESCE_MS) ?? AGENT_INBOUND_COALESCE_DEFAULT_MS,
    gatewaySseGzipDisabled: env.SAND_DISABLE_GATEWAY_SSE_GZIP === "1",
    sendAcceptReturnDisabled: env[DISABLE_SEND_ACCEPT_RETURN_ENV] === "1",
    egressTunnelEnabled: env.SAND_EGRESS_TUNNEL_ENABLED === "1",
    hostDevErrorDetail: env.SAND_HOST_DEV_ERROR_DETAIL === "1",
    lessSubagentFanoutExperimentOverride: env.SAND_LESS_SUBAGENT_FANOUT_EXPERIMENT_OVERRIDE,
    updateCommunicationExperimentOverride: env.SAND_UPDATE_COMMUNICATION_EXPERIMENT_OVERRIDE,
    browserUsePlaywrightExperimentOverride: env.SAND_BROWSER_USE_PLAYWRIGHT_EXPERIMENT_OVERRIDE,
    hostLogFile: trimmedNonEmpty(env.SAND_HOST_LOG_FILE),
    hostBundleS3BaseUrl: hostBundleBaseUrlOverride(env.SAND_HOST_BUNDLE_S3_BASE_URL),
    boxAutoUpdateOptedOut: isNegative(env.SAND_BOX_AUTO_UPDATE),
    boxUpdateWatchIntervalMsRaw: env.SAND_BOX_UPDATE_WATCH_INTERVAL_MS,
    boxUpdateWatchJitterRatio: jitterRatio(env.SAND_BOX_UPDATE_WATCH_JITTER_RATIO),
    boxStore: {
      policy: getBoxStoreBackendPolicy(env),
      syncEnabled: isBoxStoreSyncEnabled(env),
      copyInEnabled: isBoxStoreCopyInEnabled(env),
      packBuildEnabled: !isNegative(env.SAND_BOX_STORE_PACKS),
      stateBackstopEnabled: isAffirmative(env.SAND_STATE_S3_BACKSTOP),
      logShippingEnabled: inBox && !isAffirmative(env.SAND_BOX_LOG_SHIP_DISABLED),
      manifestV2: env[SAND_MANIFEST_V2_ENV] === "1",
      storeIdOverride: trimmedNonEmpty(env.SAND_BOX_STORE_ID),
      wholeHomeCategory: env.SAND_STORE_BETTER_CLI === "1" && env.SAND_USER_NON_ROOT === "1"
    },
    csnapsBinPath: csnapsBinPathOf(env.SAND_CSNAPS_BIN),
    auth: {
      devTokenFile: env.SAND_DEV_INFERENCE_TOKEN_FILE?.trim() ?? "",
      boxIdentityCredential: env.SAND_INFERENCE_RENEWAL_CREDENTIAL?.trim() ?? ""
    },
    shell: env.SHELL || void 0,
    streamTuning: resolveSandStreamTuning(env)
  };
}
