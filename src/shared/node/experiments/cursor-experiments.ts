var BASE_POLL_INTERVAL_MS = 5 * 60 * 1e3;
var MIN_POLL_INTERVAL_MS = 30 * 1e3;
var POLL_JITTER_FRACTION = 0.3;
var BOOTSTRAP_TIMEOUT_MS = 3e4;
var GATE_READY_TIMEOUT_MS = 1e4;
var PEEK_OPTIONS = { disableExposureLog: true };
var EXPOSE_OPTIONS = { disableExposureLog: false };
function envDynamicConfigOverride(raw, name17, fallback2) {
  if (raw == null || raw.length === 0) return void 0;
  const parsed2 = parseJsonOrUndefined(raw);
  if (!isUnknownRecord(parsed2) || !isUnknownRecord(fallback2)) return void 0;
  const override = parsed2[name17];
  if (!isUnknownRecord(override)) {
    return void 0;
  }
  for (const [key, value] of Object.entries(override)) {
    if (!Object.hasOwn(fallback2, key)) return void 0;
    const expected = fallback2[key];
    if (expected === null && value !== null || expected !== null && value === null || expected !== null && typeof value !== typeof expected || Array.isArray(value) !== Array.isArray(expected)) {
      return void 0;
    }
  }
  return override;
}
function jitteredSandExperimentPollIntervalMs(isDevBuild) {
  const base = isDevBuild ? MIN_POLL_INTERVAL_MS : Math.max(BASE_POLL_INTERVAL_MS, MIN_POLL_INTERVAL_MS);
  return Math.floor(base * (1 + Math.random() * POLL_JITTER_FRACTION));
}
function statsigClientPort(client) {
  let stagedValues;
  return {
    dataAdapter: {
      setData: ({ config: config2, values, user }) => {
        client.dataAdapter.setData(config2);
        invariant(
          config2 === "{}" || client.dataAdapter.getDataSync(user)?.data === config2,
          "Statsig bootstrap data was rejected"
        );
        stagedValues = config2 === "{}" ? void 0 : values;
      }
    },
    initializeSync: () => {
      invariant(
        client.initializeSync().success !== false && (stagedValues === void 0 || areJsonValuesEqual(client.getContext().values, stagedValues)),
        "Statsig initialization did not apply bootstrap data"
      );
      stagedValues = void 0;
    },
    updateUserSync: (user) => {
      invariant(
        client.loadingStatus !== "Uninitialized" || client.initializeSync().success !== false,
        "Statsig initialization failed"
      );
      invariant(
        client.updateUserSync(user).success !== false && (stagedValues === void 0 || areJsonValuesEqual(client.getContext().values, stagedValues)),
        "Statsig user update did not apply bootstrap data"
      );
      stagedValues = void 0;
    },
    checkGate: (name17, options2) => client.checkGate(name17, options2),
    getExperiment: (name17, parse11, options2) => {
      const experiment = client.getExperiment(name17, options2);
      return { groupName: experiment.groupName, value: parse11(experiment.value) };
    },
    getDynamicConfig: (name17, parse11, options2) => parse11(client.getDynamicConfig(name17, options2).value),
    logEvent: (eventName) => client.logEvent(eventName),
    flush: () => client.flush(),
    shutdown: () => client.shutdown()
  };
}
var defaultCreateStatsigClient = (key, user, options2) => statsigClientPort(new import_js_client.StatsigClient(key, user, options2));
var SandExperimentServiceCore = class {
  constructor(options2) {
    this.options = options2;
    this.registry = options2.registry;
    this.clock = options2.clock ?? realClock;
    this.bootstrapDeadline = createDeadlinePolicy({
      name: "sand-experiments-bootstrap",
      timeoutMs: options2.bootstrapTimeoutMs ?? BOOTSTRAP_TIMEOUT_MS,
      clock: this.clock
    });
    this.refreshPoll = createPollingPolicy3({
      name: "sand-experiments-refresh-poll",
      intervalMs: options2.pollIntervalMs ?? jitteredSandExperimentPollIntervalMs(options2.isDevBuild === true),
      clock: this.clock
    });
    this.overrideStore = new SandFeatureFlagOverrideStore(
      options2.getCacheDir,
      options2.registry.FLAGS,
      this.clock
    );
    if (this.canUseFeatureFlagOverrides()) {
      this.overrideStore.hydrateFromDisk();
    }
    this.snapshot = this.computeSnapshot();
  }
  options;
  client = null;
  hydratedBootstrap;
  savedBootstrap;
  isInitialized = false;
  isRefreshing = false;
  pendingRefreshTrigger = null;
  isDisposed = false;
  pollHandle;
  hasStartupTickRun = false;
  currentRefresh = null;
  hasAuthenticatedNetworkBootstrap = false;
  hasLiveNetworkBootstrap = false;
  hasFreshAuthenticatedExperimentBootstrap = false;
  authRevision = 0;
  authenticatedBootstrapPending = true;
  disposeAbort = new AbortController();
  releaseRateLimitWait = null;
  registry;
  snapshot;
  listeners = /* @__PURE__ */ new Set();
  gateProperties = /* @__PURE__ */ new Map();
  overrideStore;
  isAnysphereUser = false;
  loggedModelConfigRejections = /* @__PURE__ */ new Map();
  reportedParseFailures = /* @__PURE__ */ new Set();
  rateLimitedUntilMs;
  flagsFetchedAtMs;
  clock;
  bootstrapDeadline;
  refreshPoll;
  start() {
    const cached2 = loadCachedBootstrap(this.options.getCacheDir());
    if (cached2 != null) {
      this.savedBootstrap = cached2;
      try {
        this.hydrate(cached2.config);
        this.flagsFetchedAtMs = cached2.fetchedAtMs;
      } catch (error42) {
        reportExperimentsDiagnostic({
          kind: "bootstrap_cache_hydrate_failed",
          errorClass: errorLogTag(error42)
        });
      }
    }
    this.refreshSnapshot();
    this.pollHandle = this.refreshPoll.start(() => {
      const trigger2 = this.hasStartupTickRun ? "poll" : "startup";
      this.hasStartupTickRun = true;
      return this.refresh(trigger2);
    });
  }
  handleAuthChange() {
    this.authRevision += 1;
    this.hasFreshAuthenticatedExperimentBootstrap = false;
    this.authenticatedBootstrapPending = true;
    this.refreshSnapshot();
    void this.refresh("auth_change");
  }
  async refreshNow() {
    await this.refresh("manual");
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  getSnapshot() {
    return this.snapshot;
  }
  getFeatureGateProperty(name17) {
    let property = this.gateProperties.get(name17);
    if (property == null) {
      property = new MutableGateProperty(this.checkFeatureGate(name17, PEEK_OPTIONS));
      this.gateProperties.set(name17, property);
    }
    return property;
  }
  pinGateOnAuthenticatedBootstrap(name17, pin) {
    if (this.hasAuthenticatedNetworkBootstrap) {
      pin(this.checkFeatureGate(name17, PEEK_OPTIONS));
      return;
    }
    const unsubscribe = this.subscribe(() => {
      if (!this.hasAuthenticatedNetworkBootstrap) return;
      unsubscribe();
      pin(this.checkFeatureGate(name17, PEEK_OPTIONS));
    });
  }
  checkFeatureGate(name17, options2) {
    if (this.authenticatedBootstrapPending && this.registry.FLAGS[name17]?.requiresAuthenticatedBootstrap === true) {
      return false;
    }
    const localOverride = this.overrideStore.read(name17);
    if (localOverride != null) return localOverride;
    const override = this.canUseFeatureFlagOverrides() ? this.options.featureGateOverrides[name17] : void 0;
    if (override != null) return override;
    const client = this.client;
    if (client == null) {
      return this.registry.FLAGS[name17]?.default ?? false;
    }
    try {
      return client.checkGate(name17, options2);
    } catch {
      return this.registry.FLAGS[name17]?.default ?? false;
    }
  }
  hasAuthenticatedStatsigBootstrap() {
    return this.hasAuthenticatedNetworkBootstrap;
  }
  hasLiveStatsigBootstrap() {
    return this.hasLiveNetworkBootstrap;
  }
  getFlagsAgeMs() {
    return this.flagsFetchedAtMs == null ? void 0 : Math.max(0, this.clock.now() - this.flagsFetchedAtMs);
  }
  canUseFeatureFlagOverrides() {
    return this.options.isDevBuild === true || this.isAnysphereUser;
  }
  setIsAnysphereUser(isAnysphereUser) {
    if (this.isAnysphereUser === isAnysphereUser) return;
    const wasEnabled = this.canUseFeatureFlagOverrides();
    this.isAnysphereUser = isAnysphereUser;
    const isEnabled = this.canUseFeatureFlagOverrides();
    if (wasEnabled === isEnabled) return;
    if (isEnabled) {
      this.overrideStore.hydrateFromDisk();
    } else {
      this.overrideStore.clearAll();
    }
    this.refreshSnapshot();
  }
  getFeatureFlagOverrides() {
    return this.overrideStore.activeOverrides();
  }
  setFeatureFlagOverride(name17, value) {
    if (!this.canUseFeatureFlagOverrides()) return;
    if (!this.overrideStore.set(name17, value)) return;
    this.persistAndBroadcastOverrides();
  }
  clearFeatureFlagOverride(name17) {
    if (!this.canUseFeatureFlagOverrides()) return;
    if (this.overrideStore.clear(name17)) {
      this.persistAndBroadcastOverrides();
    }
  }
  clearAllFeatureFlagOverrides() {
    if (!this.canUseFeatureFlagOverrides() || this.overrideStore.size === 0) {
      return;
    }
    this.overrideStore.clearAll();
    this.persistAndBroadcastOverrides();
  }
  setAllFeatureFlagOverridesToBundledValues() {
    if (!this.canUseFeatureFlagOverrides()) return;
    this.overrideStore.setAllToBundledDefaults();
    this.persistAndBroadcastOverrides();
  }
  replaceFeatureFlagOverrides(overrides) {
    this.overrideStore.replaceAll(overrides);
    this.persistAndBroadcastOverrides();
  }
  getFeatureFlagOverridesRecord() {
    return this.overrideStore.activeRecord();
  }
  applyFeatureFlagOverrideCommand(command) {
    switch (command.kind) {
      case "set":
        if (this.overrideStore.isFlagName(command.name)) {
          this.setFeatureFlagOverride(command.name, command.value);
        }
        break;
      case "clear":
        if (this.overrideStore.isFlagName(command.name)) {
          this.clearFeatureFlagOverride(command.name);
        }
        break;
      case "clear-all":
        this.clearAllFeatureFlagOverrides();
        break;
      case "set-all-bundled":
        this.setAllFeatureFlagOverridesToBundledValues();
        break;
    }
  }
  persistAndBroadcastOverrides() {
    void this.overrideStore.persist();
    this.refreshSnapshot();
  }
  computeFeatureFlagDevPanel() {
    if (!this.canUseFeatureFlagOverrides()) return void 0;
    const overrides = this.overrideStore.activeOverrides();
    const items = [];
    for (const name17 of Object.keys(this.registry.FLAGS)) {
      if (!this.overrideStore.isFlagName(name17)) continue;
      const override = overrides.get(name17);
      items.push({
        name: name17,
        value: this.checkFeatureGate(name17, PEEK_OPTIONS),
        defaultValue: this.registry.FLAGS[name17]?.default ?? false,
        override: override === void 0 ? null : override
      });
    }
    return { items, isLive: this.hasLiveNetworkBootstrap };
  }
  async whenReady(timeoutMs = GATE_READY_TIMEOUT_MS) {
    if (this.hasLiveNetworkBootstrap) return;
    const drain = async () => {
      let lastAwaited = null;
      while (!this.hasLiveNetworkBootstrap && !this.isDisposed) {
        const inFlight = this.currentRefresh;
        if (inFlight == null || inFlight === lastAwaited) return;
        lastAwaited = inFlight;
        await inFlight;
      }
    };
    if (timeoutMs <= 0) {
      await drain();
      return;
    }
    const deadline = createDeadlinePolicy({
      name: "sand-experiments-gate-ready",
      timeoutMs,
      clock: this.clock
    });
    try {
      await deadline.run(drain);
    } catch (error42) {
      if (!(error42 instanceof DeadlineExceededError)) throw error42;
    }
  }
  async checkGate(name17, options2) {
    const { timeoutMs, ...readOptions } = options2;
    await this.whenReady(timeoutMs ?? GATE_READY_TIMEOUT_MS);
    return this.checkFeatureGate(name17, readOptions);
  }
  getExperiment(name17, options2) {
    return this.readExperiment(name17, options2)?.value ?? this.registry.EXPERIMENTS[name17].fallbackValues;
  }
  readExperiment(name17, options2) {
    const client = this.client;
    if (client == null) return void 0;
    try {
      const experiment = client.getExperiment(name17, this.registry.EXPERIMENTS[name17].parse, options2);
      return {
        groupName: experiment.groupName,
        value: experiment.value
      };
    } catch (error42) {
      this.reportConfigParseFailure(name17, error42);
      return void 0;
    }
  }
  reportConfigParseFailure(name17, error42) {
    if (!(error42 instanceof SandConfigParseError)) return;
    const key = `${name17} ${error42.path}`;
    if (this.reportedParseFailures.has(key)) return;
    this.reportedParseFailures.add(key);
    reportExperimentsDiagnostic({ kind: "config_parse_failed", stage: name17, reason: error42.path });
  }
  getExperimentGroupName(name17, options2) {
    return this.readExperiment(name17, options2)?.groupName ?? null;
  }
  hasHydratedStatsigUserId() {
    return this.lastHydratedUserId != null && this.lastHydratedUserId.length > 0;
  }
  async waitForHydratedStatsigUserId(timeoutMs = 6e4) {
    if (this.hasHydratedStatsigUserId()) {
      return true;
    }
    if (this.hydratedUserIdReady == null) {
      this.hydratedUserIdReady = new Promise((resolve29) => {
        this.resolveHydratedUserIdReady = resolve29;
      });
    }
    const ready3 = this.hydratedUserIdReady;
    const deadline = createDeadlinePolicy({
      name: "sand-experiments-hydrated-user",
      timeoutMs,
      clock: this.clock
    });
    try {
      return await deadline.run(() => ready3);
    } catch (error42) {
      if (error42 instanceof DeadlineExceededError) return false;
      throw error42;
    }
  }
  getSandModelExperimentState() {
    const envOverride = this.options.modelExperimentOverride;
    if (envOverride != null) return envOverride;
    if (!this.hasHydratedStatsigUserId()) {
      return void 0;
    }
    if (!Object.hasOwn(this.registry.EXPERIMENTS, SAND_MODEL_EXPERIMENT_NAME)) {
      return void 0;
    }
    return resolveSandModelExperimentState({
      groupName: this.getExperimentGroupName(SAND_MODEL_EXPERIMENT_NAME, PEEK_OPTIONS),
      enabled: this.getExperiment(SAND_MODEL_EXPERIMENT_NAME, PEEK_OPTIONS).enabled
    });
  }
  getComposerTriggerExperimentEnabled() {
    if (!this.hasHydratedStatsigUserId()) return {};
    const enabledByTrigger = {};
    for (const trigger2 of SAND_COMPOSER_TRIGGERS) {
      const name17 = SAND_COMPOSER_TRIGGER_EXPERIMENTS[trigger2].experiment;
      if (!Object.hasOwn(this.registry.EXPERIMENTS, name17)) continue;
      const groupName = this.getExperimentGroupName(name17, PEEK_OPTIONS);
      if (groupName == null || groupName === "") continue;
      enabledByTrigger[trigger2] = this.getExperiment(name17, PEEK_OPTIONS).enabled;
    }
    return enabledByTrigger;
  }
  getGroupChatDiscouragementPolicy() {
    if (this.options.isDevBuild === true && this.options.groupChatDiscouragementExperimentOverride !== void 0) {
      return this.options.groupChatDiscouragementExperimentOverride;
    }
    if (!this.hasHydratedStatsigUserId()) return void 0;
    const groupName = this.getExperimentGroupName(
      SAND_GROUP_CHAT_DISCOURAGEMENT_EXPERIMENT_NAME,
      PEEK_OPTIONS
    );
    if (groupName == null || groupName === "") return void 0;
    return this.getExperiment(SAND_GROUP_CHAT_DISCOURAGEMENT_EXPERIMENT_NAME, PEEK_OPTIONS).policy;
  }
  offerLessSubagentFanout() {
    return this.offerEnabledArm(
      SAND_LESS_SUBAGENT_FANOUT_EXPERIMENT_NAME,
      this.options.lessSubagentFanoutExperimentOverride
    );
  }
  offerBrowserUsePlaywright() {
    return this.offerEnabledArm(
      GROK_BOT_BROWSER_USE_PLAYWRIGHT_EXPERIMENT_NAME,
      this.options.browserUsePlaywrightExperimentOverride
    );
  }
  peekBrowserUsePlaywright() {
    return this.peekEnabledArm(
      GROK_BOT_BROWSER_USE_PLAYWRIGHT_EXPERIMENT_NAME,
      this.options.browserUsePlaywrightExperimentOverride
    );
  }
  memoryFactsInUserInfo(options2) {
    const groupName = this.getExperimentGroupName(
      SAND_MEMORY_FACTS_IN_USER_INFO_EXPERIMENT_NAME,
      PEEK_OPTIONS
    );
    return groupName != null && groupName !== "" && this.getExperiment(SAND_MEMORY_FACTS_IN_USER_INFO_EXPERIMENT_NAME, options2).enabled;
  }
  allocateEnabledArm(name17, devOverride) {
    if (this.options.isDevBuild === true) {
      const override = devOverride?.trim().toLowerCase();
      if (override === "control") return { kind: "forced", enabled: false };
      if (override === "treatment") return { kind: "forced", enabled: true };
    }
    if (!this.hasFreshAuthenticatedExperimentBootstrap) return { kind: "unallocated" };
    const assignment = this.readExperiment(name17, PEEK_OPTIONS);
    if (assignment?.groupName == null || assignment.groupName === "") {
      return { kind: "unallocated" };
    }
    const value = assignment.value;
    return { kind: "allocated", enabled: isUnknownRecord(value) && value.enabled === true };
  }
  peekEnabledArm(name17, devOverride) {
    const allocation = this.allocateEnabledArm(name17, devOverride);
    return allocation.kind !== "unallocated" && allocation.enabled;
  }
  offerEnabledArm(name17, devOverride) {
    const allocation = this.allocateEnabledArm(name17, devOverride);
    if (allocation.kind === "unallocated") return false;
    if (allocation.kind === "forced") return allocation.enabled;
    const exposed = this.readExperiment(name17, EXPOSE_OPTIONS);
    if (exposed?.groupName == null || exposed.groupName === "") return false;
    void this.flushExposureLog();
    const value = exposed.value;
    return isUnknownRecord(value) && value.enabled === true;
  }
  logSandModelExperimentExposure() {
    return this.logExperimentExposure(SAND_MODEL_EXPERIMENT_NAME);
  }
  logComposerTriggerExperimentExposure(trigger2) {
    return this.logExperimentExposure(SAND_COMPOSER_TRIGGER_EXPERIMENTS[trigger2].experiment);
  }
  logGroupChatDiscouragementExperimentExposure() {
    return this.logExperimentExposure(SAND_GROUP_CHAT_DISCOURAGEMENT_EXPERIMENT_NAME);
  }
  peekUsageWarningAssignment() {
    if (!this.hasAuthenticatedNetworkBootstrap || !this.hasLiveNetworkBootstrap) return null;
    if (this.authenticatedBootstrapPending) return null;
    if (!this.hasHydratedStatsigUserId()) return null;
    const peeked = this.readExperiment(SAND_USAGE_WARNING_EXPERIMENT_NAME, PEEK_OPTIONS);
    if (peeked?.groupName == null || peeked.groupName === "") return false;
    return sandUsageWarningExperimentAssignmentOf(peeked.value) != null;
  }
  exposeUsageWarningExperiment(percentUsed) {
    if (!this.hasAuthenticatedNetworkBootstrap || !this.hasLiveNetworkBootstrap) return null;
    if (this.authenticatedBootstrapPending) return null;
    if (!this.hasHydratedStatsigUserId()) return null;
    const peeked = this.readExperiment(SAND_USAGE_WARNING_EXPERIMENT_NAME, PEEK_OPTIONS);
    if (peeked?.groupName == null || peeked.groupName === "") return null;
    const peekedAssignment = sandUsageWarningExperimentAssignmentOf(peeked.value);
    if (peekedAssignment == null) return null;
    if (percentUsed < peekedAssignment.firstThresholdPercent) return { kind: "below-threshold" };
    const exposed = this.readExperiment(SAND_USAGE_WARNING_EXPERIMENT_NAME, EXPOSE_OPTIONS);
    if (exposed?.groupName == null || exposed.groupName === "") return null;
    const assignment = sandUsageWarningExperimentAssignmentOf(exposed.value);
    if (assignment == null) return null;
    void this.flushExposureLog();
    return { kind: "assignment", assignment };
  }
  exposeFeatureGate(name17) {
    if (!this.overrideStore.isFlagName(name17)) return;
    if (!this.hasCurrentStatsigIdentity()) {
      this.gateExposuresAwaitingUser.add(name17);
      return;
    }
    this.checkFeatureGate(name17, EXPOSE_OPTIONS);
  }
  hasCurrentStatsigIdentity() {
    return !this.authenticatedBootstrapPending && this.hasHydratedStatsigUserId();
  }
  exposeGatesAwaitingUser() {
    if (!this.hasCurrentStatsigIdentity()) return;
    for (const name17 of this.gateExposuresAwaitingUser) {
      this.checkFeatureGate(name17, EXPOSE_OPTIONS);
    }
    this.gateExposuresAwaitingUser.clear();
  }
  logExperimentExposure(name17) {
    const client = this.client;
    if (client == null) {
      return false;
    }
    if (!this.hasHydratedStatsigUserId()) {
      return false;
    }
    if (!Object.hasOwn(this.registry.EXPERIMENTS, name17)) {
      return false;
    }
    const { parse: parse11 } = this.registry.EXPERIMENTS[name17];
    try {
      const peek = client.getExperiment(name17, parse11, PEEK_OPTIONS);
      if (peek.groupName == null) {
        return false;
      }
      client.getExperiment(name17, parse11, EXPOSE_OPTIONS);
      void this.flushExposureLog();
      return true;
    } catch (error42) {
      this.reportConfigParseFailure(name17, error42);
      return false;
    }
  }
  async flushExposureLog() {
    const client = this.client;
    if (client == null) return;
    try {
      await client.flush();
    } catch (error42) {
      reportExperimentsDiagnostic({
        kind: "exposure_flush_failed",
        errorClass: errorLogTag(error42)
      });
    }
  }
  getDynamicConfig(name17, options2) {
    const entry = this.registry.DYNAMIC_CONFIGS[name17];
    const override = this.options.isDevBuild === true ? envDynamicConfigOverride(this.options.dynamicConfigOverrides, name17, entry.fallbackValues) : void 0;
    try {
      const parsed2 = override !== void 0 ? entry.parse(override) : this.client?.getDynamicConfig(name17, entry.parse, options2);
      return parsed2 === void 0 ? entry.fallbackValues : parsed2;
    } catch (error42) {
      this.reportConfigParseFailure(name17, error42);
      return entry.fallbackValues;
    }
  }
  getConfiguredDefaultModel() {
    return this.resolveConfiguredModel(SAND_DEFAULT_MODEL_CONFIG_NAME);
  }
  getConfiguredAutomationsModel() {
    return this.resolveConfiguredModel(SAND_AUTOMATIONS_MODEL_CONFIG_NAME);
  }
  resolveConfiguredModel(configName) {
    const isRegistered = Object.hasOwn(this.registry.DYNAMIC_CONFIGS, configName);
    const resolution = resolveSandDefaultModelConfig({
      raw: isRegistered ? this.getDynamicConfig(configName, PEEK_OPTIONS) : void 0,
      hasHydratedStatsigUserId: this.hasHydratedStatsigUserId()
    });
    if (resolution.rejection != null) {
      this.reportModelConfigRejection(configName, resolution.rejection);
    }
    return resolution.selection;
  }
  reportModelConfigRejection(configName, rejection) {
    let logged = this.loggedModelConfigRejections.get(configName);
    if (logged == null) {
      logged = /* @__PURE__ */ new Set();
      this.loggedModelConfigRejections.set(configName, logged);
    }
    if (logged.has(rejection)) return;
    logged.add(rejection);
    reportExperimentsDiagnostic({
      kind: "config_not_applied",
      stage: configName,
      reason: rejection
    });
  }
  getComputerUseModelOverride() {
    return this.getDynamicConfig(SAND_COMPUTER_USE_MODEL_CONFIG_NAME, PEEK_OPTIONS);
  }
  getBrowserUseModelOverride() {
    return this.getDynamicConfig(SAND_BROWSER_USE_MODEL_CONFIG_NAME, PEEK_OPTIONS);
  }
  async dispose() {
    this.isDisposed = true;
    this.pollHandle?.dispose();
    this.pollHandle = void 0;
    this.disposeAbort.abort();
    this.releaseRateLimitWait?.();
    await this.currentRefresh;
    const resolve29 = this.resolveHydratedUserIdReady;
    this.resolveHydratedUserIdReady = null;
    this.hydratedUserIdReady = null;
    resolve29?.(false);
    this.hasAuthenticatedNetworkBootstrap = false;
    this.listeners.clear();
    for (const property of this.gateProperties.values()) {
      property.clearListeners();
    }
    const client = this.client;
    this.client = null;
    try {
      await client?.shutdown();
    } catch (error42) {
      reportExperimentsDiagnostic({
        kind: "shutdown_failed",
        errorClass: errorLogTag(error42)
      });
    }
  }
  refresh(trigger2) {
    if (this.isDisposed) {
      return Promise.resolve();
    }
    if (this.isRefreshing) {
      this.pendingRefreshTrigger = trigger2;
      return this.currentRefresh ?? Promise.resolve();
    }
    this.isRefreshing = true;
    const work = this.runRefresh(trigger2);
    this.currentRefresh = work;
    return work;
  }
  async waitOutRateLimit() {
    const untilMs = this.rateLimitedUntilMs;
    if (untilMs == null) return;
    const remainingMs = Math.max(0, untilMs - this.clock.now());
    if (remainingMs <= 0) return;
    await new Promise((resolve29) => {
      this.releaseRateLimitWait = resolve29;
      this.clock.schedule(remainingMs, resolve29);
    });
    this.releaseRateLimitWait = null;
  }
  async runRefresh(trigger2) {
    try {
      if (trigger2 === "auth_change") {
        this.rateLimitedUntilMs = void 0;
      } else {
        await this.waitOutRateLimit();
        if (this.isDisposed) {
          return;
        }
      }
      const requestAuthRevision = this.authRevision;
      const result = await fetchStatsigBootstrap({
        backend: this.options.backend,
        deadline: this.bootstrapDeadline,
        signal: this.disposeAbort.signal,
        getAccessToken: this.options.getAccessToken,
        getTeamId: this.options.getTeamId,
        getMachineId: this.options.getMachineId
      });
      if (this.isDisposed) {
        return;
      }
      const config2 = result.config;
      if (config2 == null) {
        if (result.retryAfterMs != null && result.retryAfterMs > 0) {
          this.rateLimitedUntilMs = this.clock.now() + result.retryAfterMs;
        }
        return;
      }
      this.rateLimitedUntilMs = void 0;
      if (requestAuthRevision !== this.authRevision) {
        reportExperimentsDiagnostic({
          kind: "bootstrap_discarded_auth_changed",
          stage: trigger2
        });
        return;
      }
      const userId = readStatsigBootstrapUserId(config2);
      const acceptedConfig = this.hydrate(config2);
      this.flagsFetchedAtMs = this.clock.now();
      this.hasLiveNetworkBootstrap = true;
      this.hasAuthenticatedNetworkBootstrap = userId != null && userId.length > 0;
      this.hasFreshAuthenticatedExperimentBootstrap = this.hasAuthenticatedNetworkBootstrap;
      this.authenticatedBootstrapPending = !this.hasAuthenticatedNetworkBootstrap;
      this.exposeGatesAwaitingUser();
      if (this.savedBootstrap?.config !== acceptedConfig || this.savedBootstrap?.userId !== userId) {
        const saved = await saveCachedBootstrap(this.options.getCacheDir(), {
          config: acceptedConfig,
          userId,
          fetchedAtMs: this.flagsFetchedAtMs
        });
        if (saved) this.savedBootstrap = { config: acceptedConfig, userId };
      }
      this.refreshSnapshot();
      const gatesOnCount = Object.values(this.snapshot.featureGates).filter(Boolean).length;
      reportExperimentsDiagnostic({
        kind: "bootstrap_resolved",
        stage: trigger2,
        authenticated: this.hasAuthenticatedNetworkBootstrap,
        gatesOnCount
      });
    } catch (error42) {
      if (!this.isDisposed && !isStatsigBootstrapTeamStateUnavailableError(error42)) {
        reportExperimentsDiagnostic({
          kind: "bootstrap_failed",
          stage: trigger2,
          errorClass: errorLogTag(error42)
        });
      }
    } finally {
      this.isRefreshing = false;
      const pending = this.pendingRefreshTrigger;
      this.pendingRefreshTrigger = null;
      if (pending != null && !this.isDisposed) {
        void this.refresh(pending);
      }
    }
  }
  lastHydratedUserId = null;
  gateExposuresAwaitingUser = /* @__PURE__ */ new Set();
  hydratedUserIdReady = null;
  resolveHydratedUserIdReady = null;
  settleHydratedUserIdReady() {
    if (!this.hasHydratedStatsigUserId()) return;
    const resolve29 = this.resolveHydratedUserIdReady;
    this.resolveHydratedUserIdReady = null;
    this.hydratedUserIdReady = null;
    resolve29?.(true);
  }
  hydrate(config2) {
    let bootstrap = parseStatsigBootstrap(config2, this.options.backend.clientVersion);
    const previous = this.hydratedBootstrap;
    if (previous != null && (previous.config === bootstrap.config || areJsonValuesEqual(JSON.parse(previous.config), bootstrap.values))) {
      if (previous.authRevision === this.authRevision) return previous.config;
      bootstrap = { ...bootstrap, config: previous.config };
    }
    const user = { ...bootstrap.user, appVersion: this.options.backend.clientVersion };
    this.hydratedBootstrap = void 0;
    if (this.client == null) {
      const createClient2 = this.options.createStatsigClient ?? defaultCreateStatsigClient;
      this.client = createClient2(STATSIG_CLIENT_KEY, user, {
        loggingEnabled: "always",
        disableStorage: true,
        disableEvaluationMemoization: true,
        logEventCompressionMode: import_js_client.LogEventCompressionMode.Forced,
        networkConfig: {
          api: STATSIG_LOG_EVENT_PROXY_URL,
          networkOverrideFunc: sandStatsigNetworkOverride
        }
      });
      this.client.dataAdapter.setData(bootstrap);
      this.client.initializeSync();
    } else {
      this.client.dataAdapter.setData(bootstrap);
      this.client.updateUserSync(user);
    }
    this.isInitialized = config2 !== "{}";
    this.lastHydratedUserId = typeof user.userID === "string" ? user.userID : null;
    if (bootstrap.config !== "{}") {
      this.hydratedBootstrap = { config: bootstrap.config, authRevision: this.authRevision };
    }
    if (this.hasHydratedStatsigUserId()) {
      this.client.logEvent(STATSIG_USER_HYDRATED_EVENT);
      void this.flushExposureLog();
    }
    this.settleHydratedUserIdReady();
    return bootstrap.config;
  }
  computeSnapshot() {
    const featureGates = {};
    for (const name17 of Object.keys(this.registry.FLAGS)) {
      if (!this.overrideStore.isFlagName(name17)) continue;
      const flag2 = this.registry.FLAGS[name17];
      featureGates[name17] = this.authenticatedBootstrapPending && flag2?.requiresAuthenticatedBootstrap === true ? false : this.checkFeatureGate(name17, PEEK_OPTIONS);
    }
    const experiments = {};
    for (const name17 of Object.keys(this.registry.EXPERIMENTS)) {
      if (!isKeyOf(this.registry.EXPERIMENTS, name17)) continue;
      experiments[name17] = this.getExperiment(name17, PEEK_OPTIONS);
    }
    const dynamicConfigs = {};
    for (const name17 of Object.keys(this.registry.DYNAMIC_CONFIGS)) {
      if (!isKeyOf(this.registry.DYNAMIC_CONFIGS, name17)) continue;
      dynamicConfigs[name17] = this.getDynamicConfig(name17, PEEK_OPTIONS);
    }
    const sandModelExperiment = this.getSandModelExperimentState();
    const composerTriggerExperimentEnabled = this.getComposerTriggerExperimentEnabled();
    const groupChatDiscouragementPolicy = this.getGroupChatDiscouragementPolicy();
    const rawAllowedModelIds = this.hasAuthenticatedNetworkBootstrap && sandModelExperiment == null && Object.hasOwn(this.registry.DYNAMIC_CONFIGS, SAND_MODEL_FILTER_CONFIG_NAME) ? this.getDynamicConfig(SAND_MODEL_FILTER_CONFIG_NAME, PEEK_OPTIONS).allowedModelIds : void 0;
    const allowedModelIds = Array.isArray(rawAllowedModelIds) ? rawAllowedModelIds.filter((modelId) => typeof modelId === "string") : [];
    const sandModelFilterAllowedIds = Array.isArray(rawAllowedModelIds) && allowedModelIds.length === rawAllowedModelIds.length && allowedModelIds.length > 0 ? [...new Set(allowedModelIds)] : [];
    const wide = {
      isInitialized: this.isInitialized,
      isAnysphereUser: this.isAnysphereUser,
      featureGates,
      experiments,
      dynamicConfigs,
      sandModelExperiment,
      composerTriggerExperimentEnabled,
      groupChatDiscouragementPolicy,
      sandModelFilterAllowedIds,
      featureFlags: this.computeFeatureFlagDevPanel()
    };
    return wide;
  }
  refreshSnapshot() {
    const snapshot = this.computeSnapshot();
    if (!areJsonValuesEqual(this.snapshot, snapshot)) this.snapshot = snapshot;
    for (const [name17, property] of this.gateProperties) {
      property.set(this.snapshot.featureGates[name17]);
    }
    for (const listener of this.listeners) {
      try {
        listener(this.snapshot);
      } catch (error42) {
        reportExperimentsDiagnostic({
          kind: "snapshot_listener_failed",
          errorClass: errorLogTag(error42)
        });
      }
    }
  }
};
var SandExperimentService = class extends SandExperimentServiceCore {
  constructor(options2) {
    super({ ...options2, registry: SAND_EXPERIMENT_REGISTRY });
  }
};
