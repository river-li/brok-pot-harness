var foreverBoxExtension = defineHostExtension({
  id: "forever-box",
  dependencies: [
    HostExtensions.BoxLifecycle,
    HostExtensions.CodebaseTelemetry,
    HostExtensions.Telemetry,
    HostExtensions.Trays
  ],
  start: (context2) => {
    const { environment } = context2.host;
    const autoUpdateEnabled = isImageAutoUpdateEnabled(environment);
    const intervalMs = imageWatchIntervalMs(environment.boxUpdateWatchIntervalMsRaw);
    const jitterRatio2 = imageWatchJitterRatio(environment.boxUpdateWatchJitterRatio);
    const initialDelayMs = initialImageWatchDelayMs({
      intervalMs,
      ratio: jitterRatio2
    });
    const pollingIntervalMs = jitteredImageWatchIntervalMs({
      intervalMs,
      ratio: jitterRatio2
    });
    const box = new HostBox(
      applySharedDesktop(
        createSandBox({
          telemetry: context2.deps.telemetry.brain,
          protectedBoxPaths: [getSandRootDir()],
          cursorDataDir: environment.cursorDataDir
        }),
        { persistAssignments: true }
      )
    );
    const service = new ForeverBoxService({
      box,
      lifecycleClient: context2.deps["box-lifecycle"],
      trays: context2.deps.trays,
      telemetry: context2.deps.telemetry.logs,
      imagePolling: createPollingPolicy2({
        name: "sand-forever-box-image-watch",
        intervalMs: pollingIntervalMs
      }),
      imagePollingStartDelay: createRetryPolicy({
        name: "sand-forever-box-image-watch-start",
        maxAttempts: 2,
        initialDelayMs,
        maxDelayMs: initialDelayMs
      }),
      imageSeedRetry: createRetryPolicy({
        name: "sand-forever-box-image-seed",
        maxAttempts: 3,
        initialDelayMs: 15e3,
        maxDelayMs: 6e4,
        backoffFactor: 4
      }),
      imageCheckDeadline: createDeadlinePolicy({
        name: "sand-forever-box-image-check",
        timeoutMs: FOREVER_BOX_IMAGE_CHECK_TIMEOUT_MS
      }),
      migrationExpiry: createExpiryPolicy({
        name: "sand-forever-box-migration",
        ttlMs: FOREVER_BOX_MIGRATION_TTL_MS
      }),
      screenshotDeadline: createDeadlinePolicy({
        name: "sand-forever-box-handoff-screenshot",
        timeoutMs: FOREVER_BOX_SCREENSHOT_TIMEOUT_MS
      }),
      recreateFlushWaitDeadline: createDeadlinePolicy({
        name: "sand-forever-box-recreate-flush-wait",
        timeoutMs: FOREVER_BOX_RECREATE_FLUSH_WAIT_MS
      }),
      flushPendingUploads: context2.deps["codebase-telemetry"].flushPendingUploads,
      autoUpdateEnabled,
      hostBundleAutoUpdateEnabled: !environment.boxAutoUpdateOptedOut,
      isInBox: () => environment.inBox,
      log: (message) => context2.host.log(message)
    });
    context2.onStop(() => service.dispose());
    service.start();
    context2.host.log(
      formatSandBoxStartupSummary({
        autoUpdateEnabled,
        isPackaged: environment.packaged
      }).replace("[sand-host] ", "")
    );
    const diskPressure = startDiskPressureWatch({
      polling: createPollingPolicy2({
        name: "sand-forever-box-disk-pressure",
        intervalMs: 6e4
      }),
      report: (report) => context2.deps.telemetry.logs.reportBoxDiskPressure(report),
      isInBox: environment.inBox,
      log: (message) => context2.host.log(message)
    });
    context2.onStop(() => diskPressure.dispose());
    if (environment.inBox) {
      void provisionSandBoxPromptArtifacts().catch((error41) => {
        context2.host.log(`box prompt artifacts were not provisioned: ${errorMessage(error41)}`);
      });
    }
    return {
      box: service.box,
      isAutoUpdateEnabled: service.isAutoUpdateEnabled,
      get diskPressureLevel() {
        return diskPressure.level;
      },
      diskPressureReminder: diskPressure.reminderEpisodes,
      subscribeToDiskPressure: (listener) => diskPressure.subscribe(listener),
      getStatus: (input) => service.getStatus(input),
      ensure: (input) => service.ensure(input),
      update: (input) => service.update(input),
      autoUpdateNow: () => service.autoUpdateNow(),
      setMigrating: (input) => service.setMigrating(input),
      subscribe: (listener) => service.subscribe(listener),
      releaseAgent: (agentId) => service.releaseAgent(agentId),
      captureScreenshot: (agentId) => service.captureScreenshot(agentId),
      setBusy: (isBusy) => service.setBusy(isBusy)
    };
  }
});
function isImageAutoUpdateEnabled(environment) {
  return environment.boxStore.syncEnabled && environment.boxStore.copyInEnabled && !environment.boxAutoUpdateOptedOut;
}
function imageWatchIntervalMs(raw) {
  const parsed2 = Number.parseInt(raw ?? "", 10);
  return Number.isInteger(parsed2) && parsed2 > 0 ? parsed2 : FOREVER_BOX_IMAGE_WATCH_INTERVAL_MS;
}
function imageWatchJitterRatio(ratio) {
  return ratio == null ? 0.5 : Math.min(1, ratio);
}
function initialImageWatchDelayMs({ intervalMs, ratio }) {
  if (ratio <= 0) return 0;
  return Math.round(Math.random() * intervalMs);
}
function jitteredImageWatchIntervalMs({ intervalMs, ratio }) {
  if (ratio <= 0) return intervalMs;
  const spread = intervalMs * ratio;
  return Math.max(1, Math.round(intervalMs - spread + Math.random() * spread * 2));
}
