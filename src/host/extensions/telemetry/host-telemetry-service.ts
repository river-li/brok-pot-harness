var SUPERVISOR_LOG_PATH = "/tmp/sand-supervisor.log";
var DESKTOP_HEALTH_FORWARD_INTERVAL_MS = 3e4;
var DESKTOP_HEALTH_HEARTBEAT_MS = 5 * 6e4;
function subscribeToCredentialRenewalTelemetry(auth2, logs) {
  const reportRenewal = (result) => {
    logs.reportInferenceCredentialRenewal(result.outcome === "failed" ? "error" : "info", {
      outcome: result.outcome,
      consecutive_failures: String(result.consecutiveFailures),
      duration_ms: String(result.durationMs),
      error_summary: result.errorSummary
    });
  };
  const unsubscribe = auth2.subscribeToRenewal(reportRenewal);
  const missedRenewal = auth2.getLastRenewalEvent();
  if (missedRenewal !== null) reportRenewal(missedRenewal);
  return unsubscribe;
}
var HostTelemetryService = class {
  constructor(options2) {
    this.options = options2;
    const { backend } = options2.environment;
    this.logs = new SandStructuredLogTelemetry({
      backend,
      disabled: options2.telemetryDisabled,
      createClient: options2.createAnalyticsClient,
      getAccessToken: options2.auth.getAccessToken,
      getTeamId: options2.auth.getTeamId,
      getMachineId: options2.auth.getMachineId,
      identityTags: options2.identityTags,
      holdFlushForHostBundleIdentity: true,
      flushPolling: options2.flushPolling,
      submitDeadline: options2.submitDeadline,
      identityHoldExpiry: options2.identityHoldExpiry
    });
    this.tracing = (options2.initTracing ?? initSandHostTracing)({
      getToken: options2.auth.peekAccessToken,
      backendUrl: backend.backendUrl,
      serviceVersion: backend.clientVersion,
      reportHostLog: (level, line) => this.logs.reportHostLog(level, line)
    });
    this.analytics = new SandProductAnalytics({
      environment: options2.environment,
      getAccessToken: options2.auth.getAccessToken,
      getMachineId: options2.auth.getMachineId,
      getOsLocale: options2.getOsLocale,
      hostInBox: true,
      onAccessTokenFailure: (error42) => reportFallback("product_analytics", error42)
    });
    this.brain = withAutomationRunAnalytics(this.logs, this.analytics);
    this.metrics = new GrokBotMetricsBackend({
      backend,
      getAccessToken: options2.auth.getAccessToken,
      getTeamId: options2.auth.getTeamId,
      getMachineId: options2.auth.getMachineId,
      isEnabled: () => !options2.telemetryDisabled,
      flushPolling: options2.metricsFlushPolling,
      onFlushError: (error42) => this.reportMetricsFlushError(error42)
    });
    this.modelExperimentExposure = createModelExperimentExposureLatch({
      experiments: options2.experiments,
      analytics: this.analytics,
      modelExperimentOverride: options2.environment.modelExperimentOverride
    });
  }
  options;
  logs;
  analytics;
  brain;
  metrics;
  tracing;
  modelExperimentExposure;
  eventLoop;
  pressureProfiler;
  boxLogShipper;
  desktopHealthPolling;
  egressIpPolling;
  lastEgressIpHash;
  reportedEgressIpProbeFailureReasons = /* @__PURE__ */ new Set();
  reportedMetricsFlushErrorReasons = /* @__PURE__ */ new Set();
  unsubscribeEvents;
  restoreConsole;
  hostCrashMarkerForwarding;
  lastHandledHostCrashMarker;
  lastForwardedDesktopHealthRevision = null;
  lastForwardedDesktopHealthAtMs = null;
  async start() {
    this.restoreConsole = this.installConsoleForwarding();
    await this.adoptPersistedHttpProxyName();
    const unsubscribeRenewal = subscribeToCredentialRenewalTelemetry(this.options.auth, this.logs);
    const unsubscribeModelExperiment = this.options.inference.onModelExperimentApplied(
      () => this.modelExperimentExposure.note()
    );
    this.unsubscribeEvents = () => {
      unsubscribeRenewal();
      unsubscribeModelExperiment();
    };
    const telemetryEnabled = !this.options.telemetryDisabled;
    if (telemetryEnabled) {
      this.pressureProfiler = createPressureCpuProfiler({
        reportHostLog: (level, line) => this.logs.reportHostLog(level, line),
        overrides: () => this.options.experiments.getDynamicConfig("sand_pressure_cpu_profiler_config", {
          disableExposureLog: true
        })
      });
      this.eventLoop = createEventLoopTelemetry({
        report: (summary, trigger2) => {
          this.logs.reportHostEventLoop({ trigger: trigger2, ...summary });
          if (trigger2 === "pressure" && this.options.experiments.checkFeatureGate("sand_enable_pressure_cpu_profiler", {
            disableExposureLog: true
          })) {
            this.pressureProfiler?.onPressure();
          }
        }
      });
      this.logs.setFlushTickListener(() => {
        this.eventLoop?.onTick();
        this.pressureProfiler?.onTick();
      });
      this.desktopHealthPolling = this.options.desktopHealthPolling.start(
        () => this.forwardDesktopHealth()
      );
      this.egressIpPolling = this.options.egressIpPolling.start(() => this.probeEgressIp());
    }
    if (this.options.logShippingEnabled && telemetryEnabled) {
      const { hostLogFile } = this.options;
      const skipPaths = hostLogFile != null ? [hostLogFile] : [SUPERVISOR_LOG_PATH];
      this.boxLogShipper = (this.options.createBoxLogShipper ?? ((deps) => new BoxLogShipper(deps)))({
        reportBatch: (records2, onEntrySettled) => this.logs.reportBoxLogBatch(records2, onEntrySettled),
        reportBoxLogShip: (report, onSettled) => this.logs.reportBoxLogShip(report, onSettled),
        reportHostLog: (level, line) => this.logs.reportHostLog(level, line),
        skipPaths,
        polling: this.options.boxLogPolling,
        clock: this.options.clock
      });
    }
    this.analytics.activate();
    this.analytics.markActive("host_startup");
  }
  api() {
    return {
      logs: this.logs,
      brain: this.brain,
      analytics: this.analytics,
      metrics: this.metrics,
      createHostLifecycleProgress: (startedAt) => new HostLifecycleProgress({
        startedAt,
        now: () => this.options.clock.monotonicNow(),
        watchdog: this.options.hostLifecycleWatchdog,
        report: (report) => this.logs.reportHostLifecycle(report)
      }),
      setHostBundleIdentity: (identity) => this.setHostBundleIdentity(identity),
      setHttpProxyName: (name17) => this.setHttpProxyName(name17),
      flushTracing: () => this.tracing.flush(),
      flushForFatalExit: () => this.flushForFatalExit(),
      reportMessageSent: (report) => this.reportMessageSent(report),
      noteSandModelExperimentActive: () => this.modelExperimentExposure.note()
    };
  }
  async adoptPersistedHttpProxyName() {
    const store = this.options.httpProxyNameOverrideStore;
    if (store === void 0) return;
    try {
      const resolved = await resolveStartupHttpProxyName({
        store,
        bootId: this.options.boxBootId,
        envName: this.logs.getHttpProxyName()
      });
      if (resolved.source === "override") this.logs.setHttpProxyName(resolved.name);
    } catch (error42) {
      reportFallback("http_proxy_name_override", error42);
    }
  }
  async setHttpProxyName(rawName) {
    const applied = rawName === null ? void 0 : normalizeHttpProxyName(rawName);
    const previous = this.logs.getHttpProxyName();
    this.logs.setHttpProxyName(applied);
    let persisted = false;
    const store = this.options.httpProxyNameOverrideStore;
    const bootId = this.options.boxBootId;
    if (store !== void 0 && bootId !== void 0) {
      const written = await store.write({
        name: applied ?? null,
        bootId,
        writtenAtMs: this.options.clock.now()
      });
      persisted = written.kind === "written";
      if (written.kind === "unavailable") {
        reportFallback("http_proxy_name_override", new Error(written.reason));
      }
    }
    this.logs.reportHttpProxyNameChanged({
      previous,
      applied,
      persisted,
      rejected: rawName !== null && applied === void 0
    });
    return { applied: applied ?? null, persisted };
  }
  async setHostBundleIdentity(identity) {
    (this.options.setHostBundleVersionTag ?? setTurnTraceHostBundleVersion)(
      identity.hostBundleVersion
    );
    this.logs.setHostBundleIdentity(identity);
    this.startHostCrashMarkerForwarding();
    await this.boxLogShipper?.start();
  }
  reportMessageSent(report) {
    const text2 = typeof report.prompt === "string" ? report.prompt.trim() : "";
    const charCount = text2.length;
    this.analytics.markActive("user_action");
    this.analytics.trackEvent("sand.message.sent", {
      agent_id: report.agentId,
      char_count: charCount,
      length_bucket: sandMessageLengthBucket(charCount),
      attachment_count: Array.isArray(report.attachmentPaths) ? report.attachmentPaths.length : 0,
      has_rich_text: typeof report.richText === "string" && report.richText.length > 0,
      is_fork: report.isFork === true,
      source: report.source ?? "desktop",
      is_group_room: report.isGroupRoom
    });
  }
  async dispose() {
    await this.metrics.dispose();
    const boxLogShipper = this.boxLogShipper;
    await boxLogShipper?.stopPolling();
    await boxLogShipper?.checkpointOffsets();
    this.boxLogShipper = void 0;
    this.unsubscribeEvents?.();
    this.unsubscribeEvents = void 0;
    this.hostCrashMarkerForwarding?.dispose();
    this.hostCrashMarkerForwarding = void 0;
    this.desktopHealthPolling?.dispose();
    this.desktopHealthPolling = void 0;
    this.egressIpPolling?.dispose();
    this.egressIpPolling = void 0;
    this.logs.setFlushTickListener(void 0);
    this.eventLoop?.dispose();
    this.eventLoop = void 0;
    this.pressureProfiler?.dispose();
    this.pressureProfiler = void 0;
    this.restoreConsole?.();
    this.restoreConsole = void 0;
    await this.analytics.dispose();
    await this.tracing.dispose();
    await this.logs.dispose();
    await boxLogShipper?.dispose();
  }
  startHostCrashMarkerForwarding() {
    if (this.hostCrashMarkerForwarding !== void 0) return;
    this.hostCrashMarkerForwarding = this.options.hostCrashMarkerPolling.start(async () => {
      const result = await forwardHostCrashMarkerWith({
        store: this.options.hostCrashMarkerStore,
        emit: (marker17) => this.logs.reportHostProcessExitConfirmed(marker17),
        emitUnparseable: async () => {
          this.logs.reportHostLog("warn", "sand.host.crash marker_unparseable");
        },
        wasForwarded: (raw) => raw === this.lastHandledHostCrashMarker,
        markForwarded: (raw) => {
          this.lastHandledHostCrashMarker = raw;
        }
      });
      if (result === "absent" || result === "delivered" || result === "parse_error") {
        this.hostCrashMarkerForwarding?.dispose();
        this.hostCrashMarkerForwarding = void 0;
      }
    });
  }
  async flushForFatalExit() {
    try {
      await this.options.fatalFlushDeadline.run(async () => {
        const boxLogShipper = this.boxLogShipper;
        await boxLogShipper?.stopPolling();
        await boxLogShipper?.checkpointOffsets();
        await this.logs.dispose();
        await boxLogShipper?.dispose();
      });
    } catch {
    }
  }
  reportMetricsFlushError(error42) {
    const reason = errorLogTag(error42);
    if (this.reportedMetricsFlushErrorReasons.has(reason)) return;
    this.reportedMetricsFlushErrorReasons.add(reason);
    this.logs.reportHostLog("warn", `[sand-telemetry] harness metrics flush failed (${reason})`);
  }
  async probeEgressIp() {
    if (!this.options.experiments.checkFeatureGate("sand_anonymized_egress_telemetry", {
      disableExposureLog: true
    })) {
      return;
    }
    try {
      const ipHash = await probeEgressIpHash({ deadline: this.options.egressIpProbeDeadline });
      if (ipHash === this.lastEgressIpHash) return;
      this.lastEgressIpHash = ipHash;
      this.logs.setEgressIpHash(ipHash);
      this.analytics.setEgressIpHash(ipHash);
    } catch (error42) {
      const reason = errorLogTag(error42);
      if (this.reportedEgressIpProbeFailureReasons.has(reason)) return;
      this.reportedEgressIpProbeFailureReasons.add(reason);
      this.logs.reportHostLog("warn", `[sand-telemetry] egress ip probe failed (${reason})`);
    }
  }
  async forwardDesktopHealth() {
    try {
      await forwardDesktopHealthWith({
        heartbeatMs: DESKTOP_HEALTH_HEARTBEAT_MS,
        readRaw: async () => {
          try {
            if (!(0, import_node_fs89.existsSync)(SAND_SUPERVISOR_DESKTOP_HEALTH_PATH)) return null;
            return await (0, import_promises74.readFile)(SAND_SUPERVISOR_DESKTOP_HEALTH_PATH, "utf8");
          } catch (error42) {
            reportFallbackUnlessAbsent("host_telemetry_service", error42);
            return null;
          }
        },
        emit: (level, metadata) => this.logs.reportDesktopHealth(level, metadata),
        now: () => Date.now(),
        getLast: () => ({
          revision: this.lastForwardedDesktopHealthRevision,
          atMs: this.lastForwardedDesktopHealthAtMs
        }),
        setLast: (revision, atMs) => {
          this.lastForwardedDesktopHealthRevision = revision;
          this.lastForwardedDesktopHealthAtMs = atMs;
        }
      });
    } catch {
    }
  }
  installConsoleForwarding() {
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalWarn = console.warn;
    const originalError = console.error;
    let forwarding = false;
    const wrap2 = (original, level) => (...args) => {
      if (forwarding) {
        original(...args);
        return;
      }
      forwarding = true;
      try {
        this.logs.reportHostLog(level, (0, import_node_util14.format)(...args));
      } catch {
      } finally {
        forwarding = false;
      }
    };
    const wrappedLog = wrap2(originalLog, "info");
    const wrappedInfo = wrap2(originalInfo, "info");
    const wrappedWarn = wrap2(originalWarn, "warn");
    const wrappedError = wrap2(originalError, "error");
    console.log = wrappedLog;
    console.info = wrappedInfo;
    console.warn = wrappedWarn;
    console.error = wrappedError;
    return () => {
      if (console.log === wrappedLog) console.log = originalLog;
      if (console.info === wrappedInfo) console.info = originalInfo;
      if (console.warn === wrappedWarn) console.warn = originalWarn;
      if (console.error === wrappedError) console.error = originalError;
    };
  }
};
