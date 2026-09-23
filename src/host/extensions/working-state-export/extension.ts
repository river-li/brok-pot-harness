var WORKING_STATE_BLOB_KEY_PREFIX = "working-state/blobs/";
var WORKING_STATE_WARM_GATE = "sand_working_state_warming";
var WORKING_STATE_WARM_DELAY_MS = 1e4;
var WORKING_STATE_WARM_OPERATION_TIMEOUT_MS = 18e4;
function workingStateBlobHexIds(keys) {
  return keys.filter((key) => key.startsWith(WORKING_STATE_BLOB_KEY_PREFIX)).map((key) => key.slice(WORKING_STATE_BLOB_KEY_PREFIX.length));
}
var workingStateExportExtension = defineHostExtension({
  id: "working-state-export",
  dependencies: [
    "agent-identity",
    "box-store-sync",
    "experiments",
    "session",
    "telemetry",
    "transcript"
  ],
  start: (context2) => startWorkingStateExport(context2)
});
function startWorkingStateExport(context2) {
  const agentIdentity = context2.deps["agent-identity"];
  const boxStoreSync = context2.deps["box-store-sync"];
  const sessionStore = context2.deps.session.store;
  const metricsContext = createContext().with(metricsKey, context2.deps.telemetry.metrics);
  const readWarmingConfig = () => context2.deps.experiments.getDynamicConfig("sand_working_state_warming_config", {
    disableExposureLog: true
  });
  const agentHarness = (agentId) => readSandProfileHarness(getSandProfilePath(sessionStore.getAgentDir(agentId)));
  const isBoxAgent = (agentId) => agentHarness(agentId) === "box";
  const readClientStateSeed = async (agentId) => workingStateExportClientStateSeedFromSummary(
    await sessionStore.summarizeAgentById(agentId, void 0)
  );
  const exporter = new WorkingStateExporter({
    isTemporalAgent: (agentId) => agentHarness(agentId) === "temporal",
    readServerId: (agentId) => readSandProfileServerId(getSandProfilePath(sessionStore.getAgentDir(agentId))),
    isStoreEnabled: () => boxStoreSync.isEnabled,
    isTurnInFlight: (agentId) => context2.deps.transcript.liveRunningAgentIds().has(agentId),
    parallelListing: () => readWarmingConfig().parallelListing && boxStoreSync.isV2Enabled,
    readClientStateSeed,
    readSnapshot: (agentId, limits, onProgress) => sessionStore.readWorkingStateExportSnapshot(agentId, limits, onProgress),
    readBlobs: (agentId, blobIdsHex) => sessionStore.readConversationBlobsByHexIds(agentId, blobIdsHex),
    putBlob: async (blobIdHex, bytes, signal) => {
      const storeId = await boxStoreSync.getStoreId();
      await boxStoreSync.objectStoreProvider.forStore(storeId).put(`${WORKING_STATE_BLOB_KEY_PREFIX}${blobIdHex}`, bytes, {
        contentAddressed: true,
        signal
      });
    },
    log: (message) => context2.host.log(message),
    now: () => performance.now(),
    report: (report) => {
      recordWorkingStateExportMetrics(metricsContext, report);
      context2.deps.telemetry.logs.reportWorkingStateExport(report);
    },
    reportWarm: (report) => {
      recordWorkingStateWarmMetrics(metricsContext, report);
      context2.deps.telemetry.logs.reportWorkingStateWarm(report);
    },
    listDurableBlobHexIds: async (options2) => {
      const storeId = await boxStoreSync.getStoreId();
      const store = boxStoreSync.objectStoreProvider.forStore(storeId);
      const listPrefix = options2.hexPrefix !== void 0 ? `${WORKING_STATE_BLOB_KEY_PREFIX}${options2.hexPrefix}` : WORKING_STATE_BLOB_KEY_PREFIX;
      const keys = await store.list(listPrefix, {
        ...options2.signal === void 0 ? {} : { signal: options2.signal },
        onPage: (page) => options2.onPage(workingStateBlobHexIds(page.keys))
      });
      return new Set(workingStateBlobHexIds(keys));
    }
  });
  const warmer = new WorkingStateWarmer({
    listAgentPopulation: async () => {
      const agentIds = await sessionStore.listAgentIds();
      const runningAgentIds = context2.deps.transcript.liveRunningAgentIds();
      return boxAgentPopulation(agentIds, runningAgentIds, isBoxAgent);
    },
    isEligible: (agentId, logExposure) => isWorkingStateWarmEligible(agentId, {
      isStoreEnabled: () => boxStoreSync.isEnabled,
      isV2StoreEnabled: () => boxStoreSync.isV2Enabled,
      hasActivePause: () => context2.deps.transcript.getPauseState().owner !== null,
      hasAuthenticatedBootstrap: () => context2.deps.experiments.hasAuthenticatedStatsigBootstrap(),
      isBoxAgent,
      checkGate: () => context2.deps.experiments.checkFeatureGate(WORKING_STATE_WARM_GATE, {
        disableExposureLog: !logExposure
      })
    }),
    config: () => {
      const config2 = readWarmingConfig();
      return {
        limits: {
          maxClosureBytes: config2.maxClosureBytes,
          maxClosureBlobs: config2.maxClosureBlobs
        },
        putConcurrency: config2.putConcurrency
      };
    },
    warmAgent: (agentId, limits, control) => exporter.warmAgent(agentId, limits, control),
    debounce: createDebouncePolicy({
      name: "working-state-warm",
      delayMs: WORKING_STATE_WARM_DELAY_MS
    }),
    operationTimeout: createIdleWatchdogPolicy({
      name: "working-state-warm-operation-timeout",
      idleMs: WORKING_STATE_WARM_OPERATION_TIMEOUT_MS
    }),
    log: (message) => context2.host.log(message)
  });
  const unsubscribe = subscribeTranscriptMutations((mutation) => {
    if (mutation.kind !== "agent-removed") return;
    exporter.forgetAgent(mutation.agentId);
    warmer.forgetAgent(mutation.agentId);
  });
  context2.onStop(async () => {
    unsubscribe();
    await warmer.dispose();
  });
  return {
    exportAgent: async (agentId, limits) => {
      if (limits?.expectedServerId !== void 0 && agentHarness(agentId) !== "temporal") {
        const profilePath = getSandProfilePath(sessionStore.getAgentDir(agentId));
        if (readSandProfileServerId(profilePath) === null && readSandProfileFile(profilePath) !== null) {
          await agentIdentity.adoptServerAgentById(agentId);
        }
      }
      return await exporter.exportAgent(agentId, limits);
    },
    readClientStateSeed,
    scheduleWarm: (agentId) => warmer.schedule(agentId)
  };
}
