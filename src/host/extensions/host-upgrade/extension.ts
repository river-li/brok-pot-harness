var HOST_UPGRADE_MARKER_FORWARD_INTERVAL_MS = 5 * 6e4;
function createMarkerStore() {
  const markerPath = getHostUpgradeMarkerPath();
  return {
    readRaw: async () => {
      try {
        if (!(0, import_node_fs63.existsSync)(markerPath)) return null;
        return await (0, import_promises56.readFile)(markerPath, "utf8");
      } catch (error41) {
        reportFallbackUnlessAbsent("host_upgrade_extension", error41);
        return null;
      }
    },
    deleteMarker: async () => {
      try {
        await (0, import_promises56.rm)(markerPath, { force: true });
      } catch {
      }
    }
  };
}
var hostUpgradeExtension = defineHostExtension({
  id: "host-upgrade",
  dependencies: [
    HostExtensions.Automations,
    HostExtensions.Experiments,
    HostExtensions.Telemetry,
    HostExtensions.Transcript
  ],
  start: (context2) => {
    const environment = context2.host.environment;
    const log4 = (level, message) => context2.deps.telemetry.logs.reportHostLog(level, `[sand-host] ${message}`);
    const readLiveReleaseConfig = () => context2.deps.experiments.getDynamicConfig("sand_host_bundle_channel", {
      disableExposureLog: true
    });
    let loggedChannel;
    const resolveChannel = () => {
      const channel = resolveHostBundleChannel(readLiveReleaseConfig().channel);
      if (channel !== loggedChannel) {
        const from2 = loggedChannel === void 0 ? "" : ` (was ${loggedChannel})`;
        log4("info", `host bundle release channel: ${channel}${from2}`);
        loggedChannel = channel;
      }
      return channel;
    };
    const service = new HostUpgradeService({
      automations: context2.deps.automations,
      telemetry: context2.deps.telemetry.logs,
      transcript: context2.deps.transcript,
      markerStore: createMarkerStore(),
      markerForwardPolicy: createPollingPolicy2({
        name: "host-upgrade-marker-forward",
        intervalMs: HOST_UPGRADE_MARKER_FORWARD_INTERVAL_MS
      }),
      createUpdateWatchDelayPolicy: (delayMs) => createPollingPolicy2({
        name: "host-upgrade-shared-update-watch",
        intervalMs: delayMs
      }),
      clock: realClock,
      random: Math.random,
      isInBox: environment.inBox,
      isAutoUpdateEnabled: !environment.boxAutoUpdateOptedOut,
      getUpdateWatchIntervalMs: () => resolveHostBundleWatchIntervalMs(
        readLiveReleaseConfig().watchIntervalMs,
        environment.boxUpdateWatchIntervalMsRaw
      ),
      updateWatchJitterRatio: environment.boxUpdateWatchJitterRatio ?? HOST_BUNDLE_WATCH_JITTER_RATIO,
      hostDevErrorDetail: environment.hostDevErrorDetail,
      resolveBundleSource: () => resolveHostBundleSource(
        fetch,
        resolveChannel(),
        hostBundleBaseUrl(environment.hostBundleS3BaseUrl)
      ),
      readLocalVersion: readLocalHostVersion,
      isVersionSwapVetoed: isHostVersionSwapVetoed,
      stageUpgrade: stageHostBundleUpgrade,
      log: log4
    });
    context2.onStop(() => service.dispose());
    service.startMarkerForwardWake();
    return service;
  }
});
