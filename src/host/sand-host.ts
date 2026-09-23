var BOX_READY_STAGE_MARKER_PATH = "/tmp/sand-box-ready-stage";
var BOX_READY_REPORT_ATTEMPTS = 3;
var BOX_READY_REPORT_RETRY_MS = 3e4;
var HOST_EXTENSION_START_TIMEOUT_MS = 5 * 6e4;
var SandHost = class {
  environment;
  startExtensions;
  constructor(options2) {
    this.environment = options2.environment;
    this.startExtensions = options2.startExtensions ?? startHostPluginRegistry;
  }
  mcpAuthCompletion = new HostMcpAuthCompletion({
    getMcp: () => this.requireHostExtensions().api("mcp"),
    getTranscript: () => this.transcript
  });
  hostEvents = new SandHostEventBus(
    (report) => this.hostExtensions?.api("telemetry").logs.reportHostEventBusFailure(report)
  );
  hostExtensions;
  backgroundWorkReady = Promise.withResolvers();
  listeners = /* @__PURE__ */ new Set();
  focusReportStream;
  ctx = createContext().with(loggerKey, { log: () => {
  } });
  rosterBookkeeping;
  runnerComposition;
  stopResumeOwnership;
  startedAt = Date.now();
  lastBusyAtMs = Date.now();
  reportProcessCrash(_error, kind) {
    try {
      this.hostExtensions?.api("telemetry").logs.reportHostCrash(kind);
    } catch {
    }
  }
  reportHostDiagnostic(diagnostic) {
    this.hostExtensions?.api("telemetry").logs.reportHostDiagnostic(diagnostic);
  }
  reportInvariantViolation(report) {
    this.hostExtensions?.api("telemetry").logs.reportInvariantViolation(report);
  }
  reportPolicyStopped(stop) {
    this.hostExtensions?.api("telemetry").logs.reportPolicyStopped(stop);
  }
  reportGatewayCommandError(report) {
    try {
      const { level, metadata } = commandErrorReportToTelemetry(report);
      this.requireHostExtensions().api("telemetry").logs.reportGatewayCommandError(level, metadata);
    } catch {
    }
  }
  reportGatewayCommandSuccess(report) {
    try {
      const { level, metadata } = commandSuccessReportToTelemetry(report);
      this.telemetry.reportGatewayCommandTiming(level, metadata);
    } catch {
    }
  }
  async reportBoxReady() {
    const { id: bootId, startedAtMs: bootStartedAtMs } = this.environment.boxBoot;
    if (bootId == null || bootId.length === 0 || !Number.isFinite(bootStartedAtMs)) {
      return;
    }
    const reportedBootId = await (0, import_promises83.readFile)(BOX_READY_STAGE_MARKER_PATH, "utf8").catch(() => null);
    if (reportedBootId === bootId) return;
    const readyDurationMs = Math.max(0, Date.now() - bootStartedAtMs);
    for (let attempt = 1; attempt <= BOX_READY_REPORT_ATTEMPTS; attempt += 1) {
      const delivered = await this.telemetry.reportBoxBootStageConfirmed({
        stage: "ready",
        durationMs: readyDurationMs
      });
      if (delivered) {
        try {
          await (0, import_promises83.writeFile)(BOX_READY_STAGE_MARKER_PATH, bootId);
        } catch {
          return;
        }
        return;
      }
      if (attempt < BOX_READY_REPORT_ATTEMPTS) {
        await delay3(BOX_READY_REPORT_RETRY_MS);
      }
    }
  }
  async start(hooks = {}) {
    const lifecycleStartedAt = performance.now();
    const extensionOptions = {
      host: {
        log: (message, level = "info") => {
          console[level](`[sand-host] ${message}`);
        },
        environment: this.environment,
        events: this.hostEvents,
        isIdle: () => this.rosterBookkeeping?.isBusy !== true && !(this.hostExtensions?.api("transcript").hasRunningBackgroundShellWork() ?? false),
        whenBackgroundWorkReady: this.backgroundWorkReady.promise
      },
      startTimeoutMs: HOST_EXTENSION_START_TIMEOUT_MS
    };
    const hostExtensions = await this.startExtensions(extensionOptions);
    this.hostExtensions = hostExtensions;
    const lifecycle = hostExtensions.api("telemetry").createHostLifecycleProgress(lifecycleStartedAt);
    try {
      await this.startWithLifecycle(lifecycle, hooks);
    } catch (error42) {
      lifecycle.fail();
      throw error42;
    }
  }
  async startWithLifecycle(lifecycle, hooks) {
    const hostExtensions = this.requireHostExtensions();
    lifecycle.complete({
      phase: "plugin_graph",
      pluginCount: hostExtensions.order.length
    });
    this.telemetry.reportHostLog(
      "info",
      `[sand-host] host extensions started in graph order: ${hostExtensions.order.join(" -> ")}`
    );
    const mcp = hostExtensions.api("mcp");
    mcp.subscribeToAuthCompletion((completion) => {
      this.mcpAuthCompletion.resolve(completion);
      this.emit({ channel: "mcp-auth", payload: completion });
    });
    mcp.subscribeToServersUpdated((event) => {
      this.emit({ channel: "mcp-servers", payload: event });
    });
    hostExtensions.api("settings").subscribeToChanges((payload) => {
      this.emit({ channel: "host-settings", payload });
    });
    const telemetry = hostExtensions.api("telemetry");
    const foreverBox = hostExtensions.api("forever-box");
    this.wireDiskPressureGateway(foreverBox);
    this.hostEvents.on("session.box-handoff-started", ({ agentId, instruction }) => {
      this.awaitingSink.set(agentId, {
        tabId: "box",
        reason: instruction,
        since: Date.now()
      });
    });
    this.hostEvents.on(
      "session.box-handoff-ended",
      async ({ agentId, requestId: requestId2, resolution, trigger: trigger2 }) => {
        const pendingApproval = this.requireHostExtensions().api("auto-review").pendingAwaitingState(agentId);
        if (pendingApproval == null) this.awaitingSink.clear(agentId);
        else this.awaitingSink.set(agentId, pendingApproval);
        const entryId = await this.transcript.resolveBoxRequestEntry(
          agentId,
          requestId2,
          resolution,
          { wakeOutcomeUnseen: true }
        );
        await this.emitForeverBox(agentId);
        await this.transcript.resumeAfterBoxHandoff(agentId, trigger2, {
          wakeOutcomeEntryIds: entryId == null ? [] : [entryId]
        });
      }
    );
    this.hostEvents.on("session.box-handoff-status-changed", ({ agentId }) => {
      void this.emitForeverBox(agentId);
    });
    this.rosterBookkeeping = createHostRosterBookkeeping(hostExtensions);
    this.runnerComposition = createHostRunnerComposition({
      extensions: hostExtensions,
      environment: this.environment,
      ctx: this.ctx,
      log: (message) => telemetry.logs.reportHostLog("info", `[sand-host] ${message}`),
      emitGatewayEvent: (event) => this.emit(event)
    });
    hostExtensions.api("local-tool-permission").bindAskSurfaces(
      (agentId) => this.runnerComposition?.canAskLocalToolPermission(agentId) ?? false
    );
    hostExtensions.api("local-tool-permission").bindLiveComputerCheck(
      (agentId) => this.hostExtensions?.api("local-exec").checkLiveComputerForAsk(agentId) ?? false
    );
    hostExtensions.api("turn-execution").bindExecutor({
      createRunner: (session, hooks2) => this.requireRunnerComposition().createRunner(session, hooks2),
      createGroupMemberRunner: (session, hooks2) => this.requireRunnerComposition().createGroupMemberRunner(session, hooks2),
      isInferenceReady: () => this.requireHostExtensions().api("inference").isReady()
    });
    const hostUpgrade = this.hostUpgrade;
    const hostBundleVersion = await hostUpgrade.resolveHostBundleIdentityVersion(
      (true ? "405d732" : null) ?? "unknown"
    );
    let resolvedBoxStoreId;
    try {
      resolvedBoxStoreId = await this.boxStore.getStoreId();
    } catch (error42) {
      reportFallback("sand_host", error42);
      resolvedBoxStoreId = void 0;
    }
    lifecycle.complete({ phase: "identity" });
    await telemetry.setHostBundleIdentity({
      hostBundleVersion,
      boxStoreId: resolvedBoxStoreId
    });
    lifecycle.complete({ phase: "log_catchup" });
    const entryCount = await this.ensureLoadedResilient();
    lifecycle.complete({ phase: "transcript_read", entryCount });
    this.transcript.setAgentForgottenObserver((agentId) => {
      void this.boxStore.forgetAgent(agentId);
      foreverBox.diskPressureReminder.forgetAgent(agentId);
    });
    this.transcript.setShouldEmitAutomations(() => this.listeners.size > 0);
    this.wireEvents();
    this.backgroundWorkReady.resolve();
    hostUpgrade.startSharedUpdateWatch({
      isBoxAutoUpdateEnabled: false,
      runRootUpdateTick: async () => {
      }
    });
    this.transcript.setConnectorConnectCardObserver(
      (event) => this.mcpAuthCompletion.registerConnectCard(event)
    );
    const resumeOwnership = this.requireHostExtensions().api("resume-ownership");
    this.stopResumeOwnership = () => resumeOwnership.stop();
    await hooks.beforeResumeOwnership?.();
    await resumeOwnership.resumeAtStartup();
    telemetry.logs.reportHostStartup({
      auto_update: String(foreverBox.isAutoUpdateEnabled),
      duration_ms: String(Date.now() - this.startedAt),
      host_bundle_version: hostBundleVersion
    });
    hostUpgrade.activateAfterHostIdentityReady();
    this.reportHostState();
    lifecycle.complete({ phase: "ready" });
  }
  reportHostState() {
    if (!this.environment.inBox) return;
    const extensions = this.hostExtensions;
    if (extensions === void 0) return;
    const { hostVersion, hostUpdateAvailable } = extensions.api("host-upgrade").getVersionState();
    void extensions.api("box-lifecycle").reportHostState({
      diskPressure: extensions.api("forever-box").diskPressureLevel ?? "none",
      hostVersion,
      hostUpdateAvailable
    }).catch((error42) => reportFallback("sand_host", error42));
  }
  async ensureLoadedResilient() {
    const entryCount = await loadInitialTranscriptResiliently(
      this.transcript,
      (level, line) => this.telemetry.reportHostLog(level, line)
    );
    this.requireRosterBookkeeping().apply(this.transcript.getActiveAgentId());
    return entryCount;
  }
  async kickstartIfPending(agentId) {
    return await this.transcript.kickstartAgent(
      agentId,
      await this.requireHostExtensions().api("inference").isReady()
    );
  }
  async requestDiskSaverAudit(agentId) {
    return await this.transcript.requestDiskSaverAudit(
      agentId,
      await this.requireHostExtensions().api("inference").isReady()
    );
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.noteEventStreamListeners();
    const level = this.requireHostExtensions().api("forever-box").diskPressureLevel;
    listener({
      channel: "box-disk-pressure",
      payload: level === null ? null : { level }
    });
    const openGrants = this.requireHostExtensions().api("messages-grants").openRequest();
    if (openGrants !== void 0) {
      listener({ channel: "messages-grants", payload: openGrants });
    }
    return () => {
      this.listeners.delete(listener);
      this.noteEventStreamListeners();
      if (listener === this.focusReportStream || this.listeners.size === 0) {
        this.focusReportStream = void 0;
        void this.transcript.setWindowFocused(false);
      }
    };
  }
  setWindowFocused(isFocused) {
    this.focusReportStream = [...this.listeners].at(-1);
    return this.transcript.setWindowFocused(isFocused);
  }
  noteEventStreamListeners() {
    this.hostExtensions?.api("server-agent-proxy").noteEventStreamListeners(this.listeners.size);
    this.hostExtensions?.api("cloud-agents").updates.noteConsumers(this.listeners.size);
  }
  wireDiskPressureGateway(foreverBox) {
    foreverBox.subscribeToDiskPressure((level) => {
      if (level !== null) {
        foreverBox.diskPressureReminder.enroll(this.transcript.liveRunningAgentIds());
      }
      this.emit({
        channel: "box-disk-pressure",
        payload: level === null ? null : { level }
      });
      this.reportHostState();
      const agentId = this.transcript.getActiveAgentId() ?? this.rosterBookkeeping?.latestActiveAgentId;
      if (agentId != null) {
        void this.emitForeverBox(agentId);
      }
    });
  }
  noteDesktopContact() {
    this.transcript.noteDesktopContact();
  }
  getApi() {
    return createHostGatewayApi({
      extensions: this.requireHostExtensions(),
      environment: this.environment,
      hostEvents: this.hostEvents,
      rosterBookkeeping: this.requireRosterBookkeeping(),
      decorateForeverBoxStatus: (status) => this.decorateForeverBoxStatus(status),
      getHealth: () => this.getHealth(),
      setWindowFocused: (isFocused) => this.setWindowFocused(isFocused),
      kickstartIfPending: (agentId) => this.kickstartIfPending(agentId),
      requestDiskSaverAudit: (agentId) => this.requestDiskSaverAudit(agentId),
      releaseAgentBox: (agentId) => this.releaseAgentBox(agentId),
      handleDesktopMcpAuthCompletion: (completion) => this.mcpAuthCompletion.resolveDesktop(completion),
      forgetLocalToolPermission: (agentId) => this.forgetLocalToolPermission(agentId)
    });
  }
  forgetLocalToolPermission(agentId) {
    this.runnerComposition?.forgetLocalToolPermission(agentId);
  }
  getHealth() {
    const runningTurnsBusy = this.rosterBookkeeping?.isBusy === true;
    const otherWorkBusy = this.transcript.hasRunningBackgroundShellWork() || this.transcript.hasCarryablePendingWake() || this.transcript.hasMidDrainRevival() || this.transcript.isPausingForUpgrade() || this.transcript.hasPauseResumeInFlight();
    const isBusy = runningTurnsBusy || otherWorkBusy;
    const busyOnlyAwaitingApproval = runningTurnsBusy && !otherWorkBusy && this.allRunningAgentsAwaitApproval();
    if (isBusy && !busyOnlyAwaitingApproval) {
      this.lastBusyAtMs = Date.now();
    }
    return {
      isBusy,
      busyOnlyAwaitingApproval,
      activeAgentId: this.rosterBookkeeping?.latestActiveAgentId ?? null,
      lastBusyAtMs: this.lastBusyAtMs
    };
  }
  allRunningAgentsAwaitApproval() {
    const autoReview = this.hostExtensions?.api("auto-review");
    if (autoReview === void 0) return false;
    if (this.transcript.hasAgentsWithRunningSubagents()) return false;
    const running = this.transcript.liveRunningAgentIds();
    if (running.size === 0) return false;
    const awaiting = new Set(autoReview.agentIdsWithPendingApprovals());
    for (const agentId of running) {
      if (!awaiting.has(agentId)) return false;
    }
    return true;
  }
  async prepareForUpgrade() {
    return await this.hostUpgrade.prepareForUpgrade();
  }
  getLocalExecBridge() {
    return this.requireHostExtensions().api("local-exec");
  }
  getWebAuthnBridge() {
    return this.requireHostExtensions().api("webauthn-proxy");
  }
  getCookieOriginApprovalBridge() {
    return this.requireHostExtensions().api("cookie-origin-approval");
  }
  async dispose() {
    if (this.transcript.isPausingForUpgrade()) {
      this.transcript.markAllRunningAgentsForUpgradeResume();
    }
    this.hostExtensions?.api("managed-setup").dispose();
    await Promise.all([
      this.stopResumeOwnership?.(),
      this.hostExtensions?.api("automations").suspendWakes()
    ]);
    this.hostExtensions?.api("auto-review").expirePendingApprovals();
    await this.transcript.dispose();
    await this.runnerComposition?.dispose();
    this.runnerComposition = void 0;
    await this.hostExtensions?.stop();
  }
  async flushTelemetryForFatalExit() {
    try {
      await this.hostExtensions?.api("telemetry").flushForFatalExit();
    } catch {
    }
  }
  get boxStore() {
    return this.requireHostExtensions().api("box-store-sync");
  }
  get hostUpgrade() {
    return this.requireHostExtensions().api("host-upgrade");
  }
  get session() {
    return this.requireHostExtensions().api("session");
  }
  get transcript() {
    return this.requireHostExtensions().api("transcript");
  }
  get awaitingSink() {
    return this.transcript.createAwaitingStateSink();
  }
  requireHostExtensions() {
    invariant(
      this.hostExtensions != null,
      "[sand-host] host extensions are not started; SandHost.start() walks the peer graph before any capability is used"
    );
    return this.hostExtensions;
  }
  requireRosterBookkeeping() {
    invariant(
      this.rosterBookkeeping != null,
      "[sand-host] roster bookkeeping is not built; SandHost.start() builds it before the agents stream is wired"
    );
    return this.rosterBookkeeping;
  }
  requireRunnerComposition() {
    invariant(
      this.runnerComposition != null,
      "[sand-host] the runner composition is not built; SandHost.start() binds it before any turn can run"
    );
    return this.runnerComposition;
  }
  get telemetry() {
    return this.requireHostExtensions().api("telemetry").logs;
  }
  async emitForeverBox(agentId) {
    try {
      const status = await this.requireHostExtensions().api("forever-box").getStatus({ id: agentId });
      this.emit({
        channel: "forever-box",
        payload: this.decorateForeverBoxStatus(status)
      });
    } catch {
    }
  }
  decorateForeverBoxStatus(status) {
    const { hostVersion, hostUpdateAvailable } = this.hostUpgrade.getVersionState();
    const diskPressureLevel = this.requireHostExtensions().api("forever-box").diskPressureLevel;
    this.reportHostState();
    return {
      ...status,
      handoff: this.session.pendingHandoff(status.agentId),
      ...hostVersion !== null ? { hostVersion } : {},
      ...hostUpdateAvailable !== null ? { hostUpdateAvailable } : {},
      ...diskPressureLevel !== null ? { diskPressure: { level: diskPressureLevel } } : {}
    };
  }
  async releaseAgentBox(agentId) {
    await this.requireHostExtensions().api("forever-box").releaseAgent(agentId);
  }
  wireEvents() {
    this.hostEvents.emit({
      kind: "notification-baseline",
      agents: this.transcript.listAgentsSync()
    });
    this.transcript.subscribe((payload) => this.emit({ channel: "transcript", payload }));
    this.requireHostExtensions().api("server-agent-proxy").bindGatewayEvents((payload) => {
      this.transcript.forwardServerVoiceChannelSend(payload);
      this.emit({ channel: "transcript", payload });
    });
    this.transcript.subscribeAgents((payload) => {
      this.requireRosterBookkeeping().apply(payload.activeAgentId);
      this.hostEvents.emit({
        kind: "notification-agents",
        event: payload,
        presence: { windowFocusedAtMs: this.transcript.getWindowFocusedAtMs() }
      });
      this.emit({ channel: "agents", payload });
    });
    this.transcript.subscribeAgentUpserted((payload) => {
      this.requireRosterBookkeeping().apply(payload.activeAgentId);
      this.hostEvents.emit({
        kind: "notification-agent-upserted",
        event: payload,
        presence: { windowFocusedAtMs: this.transcript.getWindowFocusedAtMs() }
      });
      this.emit({ channel: "agent-upserted", payload });
    });
    this.transcript.subscribeOutline((payload) => this.emit({ channel: "outline", payload }));
    this.transcript.subscribeSubagents((payload) => this.emit({ channel: "subagents", payload }));
    this.transcript.subscribeAsyncTasks(
      (payload) => this.emit({ channel: "async-tasks", payload })
    );
    this.transcript.subscribeAutomations(
      (payload) => this.emit({ channel: "automations", payload })
    );
    this.transcript.subscribeTodos((payload) => this.emit({ channel: "todos", payload }));
    this.transcript.subscribeSkills((payload) => this.emit({ channel: "workflows", payload }));
    this.requireHostExtensions().api("trays").subscribe((payload) => this.emit({ channel: "tray", payload }));
    const emitForeverBox = (payload) => {
      this.emit({
        channel: "forever-box",
        payload: this.decorateForeverBoxStatus(payload)
      });
    };
    this.requireHostExtensions().api("forever-box").subscribe((payload) => emitForeverBox(payload));
    this.requireHostExtensions().api("teach-recording").subscribe((payload) => this.emit({ channel: "teach-recording", payload }));
    this.transcript.subscribeVoiceCallNudges(
      (payload) => this.emit({ channel: "voice-call-nudge", payload })
    );
    this.requireHostExtensions().api("messages-grants").subscribe((payload) => this.emit({ channel: "messages-grants", payload }));
    this.requireHostExtensions().api("cloud-agents").updates.subscribe((payload) => this.emit({ channel: "cloud-agent-update", payload }));
  }
  emit(event) {
    for (const listener of this.listeners) listener(event);
  }
};
