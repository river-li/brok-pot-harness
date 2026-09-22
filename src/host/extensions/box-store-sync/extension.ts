/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_scheduling();
var boxStoreSyncExtension = defineHostExtension({
  id: "box-store-sync",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.Experiments,
    HostExtensions.Mcp,
    HostExtensions.SourceMap,
    HostExtensions.Telemetry
  ],
  start: (context2) => {
    pinBoxStoreDiagnosticsReporter(
      (diagnostic) => context2.deps.telemetry.logs.reportHostExtensionDiagnostic(diagnostic)
    );
    const service = createBoxStoreSyncService({
      backend: context2.host.environment.backend,
      auth: context2.deps.auth,
      sourceMap: context2.deps["source-map"],
      telemetry: context2.deps.telemetry.logs,
      isIdle: context2.host.isIdle,
      polling: createPollingPolicy2({
        name: "box-store-sync-cycle",
        intervalMs: BOX_STORE_SYNC_INTERVAL_MS
      }),
      storeDbDebounce: createDebouncePolicy({
        name: "box-store-sync-store-db",
        delayMs: BOX_STORE_DB_DEBOUNCE_MS
      }),
      chromeSessionDebounce: createDebouncePolicy({
        name: "box-store-sync-chrome-session",
        delayMs: CHROME_SESSION_CHANGE_DEBOUNCE_MS
      }),
      manifestRetry: createRetryPolicy({
        name: "box-store-sync-manifest-cas",
        maxAttempts: BOX_STORE_MANIFEST_RETRY_ATTEMPTS,
        initialDelayMs: BOX_STORE_MANIFEST_RETRY_DELAY_MS,
        maxDelayMs: BOX_STORE_MANIFEST_RETRY_DELAY_MS,
        shouldRetry: (error42) => error42 instanceof BoxStoreCanonicalWriteConflictError
      }),
      chromeStageRetry: createRetryPolicy({
        name: "box-store-sync-chrome-stage",
        maxAttempts: CHROME_SESSION_STAGE_MAX_ATTEMPTS,
        initialDelayMs: CHROME_SESSION_STAGE_RETRY_DELAY_MS,
        maxDelayMs: CHROME_SESSION_STAGE_RETRY_DELAY_MS,
        shouldRetry: isChromeSessionStageRetryable
      }),
      clock: realClock,
      log: context2.host.log,
      boxStore: context2.host.environment.boxStore,
      isSkipInaccessibleEnabled: () => context2.deps.experiments.checkFeatureGate("sand_box_store_skip_inaccessible", {
        disableExposureLog: true
      })
    });
    context2.onStop(() => service.dispose());
    service.start();
    return service.api;
  }
});

