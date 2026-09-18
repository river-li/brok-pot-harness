var UNWIRED_TURN_EXECUTION = {
  canExecute: false,
  canExecuteGroupMember: false,
  isLocalWorkAllowed: true,
  isRunReady: async () => true,
  createRunner: () => {
    invariant(false, RUNNER_UNATTACHED_MESSAGE);
  },
  createGroupMemberRunner: () => {
    invariant(false, RUNNER_UNATTACHED_MESSAGE);
  }
};
var NOOP_TRANSCRIPT_ATTACHMENTS = {
  ingest: async (_agentDir, sourcePath) => ({ absolutePath: sourcePath }),
  ingestBytes: async (agentDir, filename) => ({
    absolutePath: (0, import_node_path174.join)(getAgentAttachmentsDir(agentDir), filename)
  }),
  persistImageBytes: async (targetDir, data) => {
    const absolutePath = (0, import_node_path174.join)(targetDir, "unwired-image");
    return {
      absolutePath,
      fileUrl: (0, import_node_url18.pathToFileURL)(absolutePath).href,
      bytes: data.byteLength,
      width: null,
      height: null
    };
  },
  readImageDimensions: async () => null
};
var EMPTY_FOREVER_BOX = {
  getStatus: async ({ id }) => ({
    agentId: id,
    state: "absent",
    vncUrl: null
  }),
  captureScreenshot: async () => null
};
var NO_TRAY_ERRORS = {
  pushError: () => {
  },
  clearForAgent: () => {
  }
};
function unavailableMemoryStore() {
  return {
    recall: () => ({ profile: [], recent: [] }),
    listMemories: () => [],
    addMemory: () => null,
    removeMemoryByContent: () => false,
    getLocation: () => null
  };
}
var NO_MEMORY = {
  createAgentStore: () => unavailableMemoryStore(),
  agentHasContent: () => false
};
var NO_CONTENT_SEARCH = {
  isSearchReady: false,
  maxMatchesPerAgent: 5,
  maxResults: 50,
  searchMessages: () => null,
  searchMedia: () => null,
  findTranscriptMatches: () => []
};
var RUN_LIFECYCLE_UNCONFIGURED = {
  schedulerDisabled: false,
  watchdogMs: void 0,
  watchdogGraceMs: void 0,
  forcedPauseReapMs: void 0
};
var TranscriptManager = class {
  constructor(sessionStore, upgradeResumeStore, ackObligationStore, acceptanceLedger = new PromptAcceptanceLedger(null), pendingWakeStore, taskBoundary = createTaskBoundaryPolicy({
    name: "transcript.roster-emit-coalesce"
  }), ackRedrivePolicy = createExpiryPolicy({
    name: "transcript.ack-redrive",
    ttlMs: ACK_REDRIVE_IDLE_DELAY_MS
  }), clock = realClock, options2 = {}) {
    this.sessionStore = sessionStore;
    this.upgradeResumeStore = upgradeResumeStore;
    this.ackObligationStore = ackObligationStore;
    this.acceptanceLedger = acceptanceLedger;
    this.pendingWakeStore = pendingWakeStore;
    this.taskBoundary = taskBoundary;
    this.ackRedrivePolicy = ackRedrivePolicy;
    this.clock = clock;
    this.agentInboundCoalesceMs = options2.agentInboundCoalesceMs ?? 0;
    this.sessions = new SessionRuntime(
      this,
      options2.windowedActivationDefer ?? createTaskBoundaryPolicy({ name: "transcript.windowed-activation-defer" })
    );
    this.runLifecycle = new RunLifecycle(this, options2.runLifecycle ?? RUN_LIFECYCLE_UNCONFIGURED);
    this.upgradeResume = new UpgradeRecreateResume(
      this,
      options2.recreateWakeCarryDisabled ?? false
    );
    this.sessionStore.setBeingDeletedPredicate((id) => this.sessions.deletedAgentIds.has(id));
    void this.sessionStore.cleanupLegacyGroupMemberDirs();
  }
  sessionStore;
  upgradeResumeStore;
  ackObligationStore;
  acceptanceLedger;
  pendingWakeStore;
  taskBoundary;
  ackRedrivePolicy;
  clock;
  sendPipeline = new SendPipeline(this);
  turnRuntime = new TurnRuntime(this);
  runnerRegistry = new RunnerRegistry(this);
  sessions;
  runLifecycle;
  roster = new RosterProjection(this);
  agentLifecycle = new AgentLifecycle(this);
  groupChat = new GroupChatGlue(this);
  backgroundWakes = new BackgroundWakes(this);
  pendingWakes = new PendingWakeRearm(this);
  ackObligations = new AckObligations(this);
  upgradeResume;
  boxHandoff = new BoxHandoffResume(this);
  agentInboundCoalesceMs;
  voiceCalls = new VoiceCallRuntime(this);
  automationRuntime = new AutomationRuntime(this);
  agentTodos = new AgentTodosRuntime(this);
  skillCommands = new SkillCommands(this);
  widgetResponses = new WidgetResponses(this);
  userFormResponses = new UserFormResponses(this, {
    end: (...args) => this.userFormPort.end(...args),
    recordResolution: (...args) => this.userFormPort.recordResolution(...args),
    fill: (...args) => this.userFormPort.fill(...args),
    holdForRemap: (...args) => this.userFormPort.holdForRemap(...args),
    settleRemap: (...args) => this.userFormPort.settleRemap(...args),
    startHandoff: (...args) => this.userFormPort.startHandoff(...args)
  });
  userFormPort = {
    end: () => null,
    recordResolution: () => {
    },
    fill: async (_agentId, values) => ({
      outcomes: values.map(
        (entry) => entry.field.target != null ? { id: entry.field.id, filled: false, fillFailed: true } : { id: entry.field.id, filled: false }
      ),
      hostTiming: { prefillMs: 0, totalMs: 0 }
    }),
    holdForRemap: () => false,
    settleRemap: () => ({ kind: "not_remapped" }),
    startHandoff: () => ({ kind: "started", requestId: crypto.randomUUID() })
  };
  draftSends = new DraftSends(this);
  memory = NO_MEMORY;
  contentSearch = NO_CONTENT_SEARCH;
  execution = UNWIRED_TURN_EXECUTION;
  trayErrors = NO_TRAY_ERRORS;
  attachments = NOOP_TRANSCRIPT_ATTACHMENTS;
  channelDelivery = async () => {
    throw new SandChannelDeliveryUnregisteredError();
  };
  temporalMemberDelegate = null;
  draftExecution = null;
  channelActivity;
  channelConfigChanged;
  boxSecretStore = async () => false;
  requestCredentialAutoFill = async () => ({ accepted: false });
  automationConfigChanged;
  automationRunCompletionReporter;
  isAutomationAgentGoneTerminalEnabled;
  isAutomationSubagentEnabled = () => false;
  shouldEmitAutomations = () => true;
  disposed = false;
  telemetry = createNoopSandTelemetry();
  cloudAgentMetrics = void 0;
  productAnalytics = createNoopSandProductAnalytics();
  traceFlusher = () => {
  };
  hostLog = () => {
  };
  foreverBox = EMPTY_FOREVER_BOX;
  onAgentForgotten;
  onListenerConnectCard;
  onConnectorConnectCard;
  agentRunLifecycleObserver;
  setAgentForgottenObserver(observer) {
    this.onAgentForgotten = observer;
  }
  setListenerConnectObserver(observer) {
    this.onListenerConnectCard = observer;
  }
  setConnectorConnectCardObserver(observer) {
    this.onConnectorConnectCard = observer;
  }
  setAgentRunLifecycleObserver(observer) {
    this.agentRunLifecycleObserver = observer;
  }
  emitAgentRunLifecycle(event) {
    this.agentRunLifecycleObserver?.(event);
  }
  setTurnExecution(execution) {
    this.execution = execution;
  }
  setTelemetry(telemetry) {
    this.telemetry = telemetry;
  }
  setCloudAgentMetrics(metrics2) {
    this.cloudAgentMetrics = metrics2;
  }
  setProductAnalytics(analytics) {
    this.productAnalytics = analytics;
  }
  setTraceFlusher(flush) {
    this.traceFlusher = flush;
  }
  setHostLog(log4) {
    this.hostLog = log4;
  }
  reportTurnEmptyDelivery(report) {
    this.telemetry.reportTurnEmptyDelivery(report);
    this.hostLog(`[sand-host] ${turnEmptyDeliveryLogLine(report)}`, "info");
  }
  setForeverBox(foreverBox) {
    this.foreverBox = foreverBox;
  }
  setUserFormPort(port) {
    this.userFormPort = port;
  }
  setUserFormVault(vault) {
    this.userFormResponses.setVault(vault);
  }
  setTrayErrors(trays) {
    this.trayErrors = trays;
  }
  setCredentialAutoFillPort(port) {
    this.requestCredentialAutoFill = port;
  }
  setBoxSecretStore(store) {
    this.boxSecretStore = store;
  }
  storeBoxSecret(secret) {
    return this.boxSecretStore(secret);
  }
  setAttachments(attachments) {
    this.attachments = attachments;
  }
  setMemory(memory) {
    this.memory = memory;
    this.sessionStore.setMemory(memory);
  }
  setContentSearch(contentSearch) {
    this.contentSearch = contentSearch;
  }
  setChannelDelivery(deliver) {
    this.channelDelivery = deliver;
  }
  setChannelActivity(notify) {
    this.channelActivity = notify;
  }
  setChannelConfigChanged(onChanged) {
    this.channelConfigChanged = onChanged;
  }
  setAutomationConfigChanged(onChanged) {
    this.automationConfigChanged = onChanged;
  }
  setAutomationRunCompletionReporter(reporter) {
    this.automationRunCompletionReporter = reporter;
  }
  setAutomationAgentGoneTerminalGate(isEnabled) {
    this.isAutomationAgentGoneTerminalEnabled = isEnabled;
  }
  setAutomationSubagentGate(isEnabled) {
    this.isAutomationSubagentEnabled = isEnabled;
  }
  setShouldEmitAutomations(shouldEmit) {
    this.shouldEmitAutomations = shouldEmit;
  }
  setTemporalMemberDelegate(delegate) {
    this.temporalMemberDelegate = delegate;
  }
  setServerActivityOverlayProvider(...args) {
    this.runLifecycle.setServerActivityOverlayProvider(...args);
  }
  receiveRoomMemberTurnResult(...args) {
    return this.groupChat.receiveRoomMemberTurnResult(...args);
  }
  runRemoteRoomMemberTurn(...args) {
    return this.groupChat.runRemoteRoomMemberTurn(...args);
  }
  cancelRemoteRoomMemberTurn(...args) {
    return this.groupChat.cancelRemoteRoomMemberTurn(...args);
  }
  createAttachmentIngestor(session) {
    return async (sourcePath) => {
      const agentDir = (0, import_node_path174.dirname)(session.dbPath);
      const result = await this.attachments.ingest(agentDir, sourcePath);
      return result.absolutePath;
    };
  }
  createAssetImagePersister(session) {
    return async (data, mimeType) => {
      const assetsDir = getAgentAssetsDir((0, import_node_path174.dirname)(session.dbPath));
      try {
        return await this.attachments.persistImageBytes(assetsDir, data, mimeType);
      } catch (error41) {
        reportFallback("transcript_manager", error41);
        return null;
      }
    };
  }
  createMediaBytesPersister(session) {
    return async (filename, data) => {
      const agentDir = (0, import_node_path174.dirname)(session.dbPath);
      try {
        const result = await this.attachments.ingestBytes(agentDir, filename, data);
        return (0, import_node_url18.pathToFileURL)(result.absolutePath).href;
      } catch (error41) {
        reportFallback("transcript_manager", error41);
        return null;
      }
    };
  }
  async dispose() {
    this.disposed = true;
    this.runLifecycle.runScheduler?.dispose();
    await Promise.allSettled([this.sessions.windowedActivationTail]);
    this.boxHandoff.foreverBoxListeners.clear();
    this.boxHandoff.boxHandoffs.clear();
    this.acceptanceLedger.dispose();
    this.widgetResponses.dispose();
    const runners = /* @__PURE__ */ new Set([
      ...this.runnerRegistry.runners.values(),
      ...this.runnerRegistry.activeGroupMemberRunners.values()
    ]);
    for (const runner of runners) runner.interruptAll("transcript manager disposed");
    await this.runnerRegistry.subagentOwnership.abortAndDrain("transcript manager disposed");
    for (const runner of runners) runner.interruptAll("transcript manager disposed");
    await this.runnerRegistry.subagentOwnership.abortAndDrain("transcript manager disposed");
    for (const runner of runners) await runner.drainBackgroundSubagents();
    for (const armed of this.ackObligations.ackRedriveTimers.values()) {
      armed.dispose();
    }
    this.ackObligations.ackRedriveTimers.clear();
    this.ackObligations.ackRunTokens.clear();
    for (const batch of this.automationRuntime.pendingEventFireBatches.values()) {
      batch.debounce?.abort();
      for (const item of batch.items) item.resolve(void 0);
    }
    this.automationRuntime.pendingEventFireBatches.clear();
    this.unwatchActiveSession();
    this.roster.stopOutlineStreamCoalescing();
    for (const runner of this.runnerRegistry.runners.values()) {
      runner.cancelBackgroundShellRewatches();
    }
    this.runnerRegistry.runners.clear();
    for (const runner of this.runnerRegistry.activeGroupMemberRunners.values()) {
      runner.cancelBackgroundShellRewatches();
    }
    this.runnerRegistry.activeGroupMemberRunners.clear();
    await this.roster.emitsSettled();
    const sessions = new Set(this.sessions.liveSessions.values());
    if (this.sessions.activeSession != null) sessions.add(this.sessions.activeSession);
    this.sessions.liveSessions.clear();
    for (const pending of this.sessions.pendingSessionOpens.values()) {
      const settled = await this.sessions.settledOpen(pending);
      if (settled != null) sessions.add(settled);
    }
    this.sessions.pendingSessionOpens.clear();
    for (const session of sessions) {
      await session.agentStore.dispose();
      session.db.close({ checkpoint: true });
    }
    await this.sessionStore.closeWorkerPool();
  }
  async getAgentChannels(agentId) {
    return this.sessionStore.listAgentChannels(agentId);
  }
  async listAgentIds() {
    return this.sessionStore.listAgentIds();
  }
  listChannelConfigs(agentId) {
    return this.sessionStore.listChannelConfigs(agentId);
  }
  async getAgentAvatarPng(agentId) {
    return this.sessionStore.getAgentAvatarPng(agentId);
  }
  async getAgentProfileText(agentId) {
    return this.sessionStore.getAgentProfileText(agentId);
  }
  connectChannel(agentId, platform2, token) {
    const trimmed = token.trim();
    if (trimmed.length === 0) return false;
    return this.sessionStore.storeConnectorCredential(
      agentId,
      platform2,
      CHANNEL_CREDENTIAL_FIELD,
      trimmed
    );
  }
  disconnectChannel(agentId, platform2) {
    return this.sessionStore.disconnectChannel(agentId, platform2);
  }
  promptAcceptanceStatus(...args) {
    return this.sendPipeline.promptAcceptanceStatus(...args);
  }
  sendPrompt(...args) {
    return this.sendPipeline.sendPrompt(...args);
  }
  resolveBoxRequestEntry(...args) {
    return this.sendPipeline.resolveBoxRequestEntry(...args);
  }
  devAppendSendMessage(...args) {
    return this.sendPipeline.devAppendSendMessage(...args);
  }
  appendConnectorCard(...args) {
    return this.sendPipeline.appendConnectorCard(...args);
  }
  handleAgentUpdate(...args) {
    return this.turnRuntime.handleAgentUpdate(...args);
  }
  noteTurnBotBlock(...args) {
    return this.turnRuntime.noteBotBlock(...args);
  }
  activeTemplateSetupWriteProvenance(...args) {
    return this.turnRuntime.activeTemplateSetupWriteProvenance(...args);
  }
  activeTurnActsAsBoxOwner(...args) {
    return this.turnRuntime.activeTurnActsAsBoxOwner(...args);
  }
  interruptAgentRun(...args) {
    return this.runnerRegistry.interruptRunForUpdateEscape(...args);
  }
  attachRunner(...args) {
    return this.runnerRegistry.attachRunner(...args);
  }
  attachRunnerFactory(...args) {
    return this.runnerRegistry.attachRunnerFactory(...args);
  }
  attachGroupMemberRunnerFactory(...args) {
    return this.runnerRegistry.attachGroupMemberRunnerFactory(...args);
  }
  attachRunReadinessProbe(...args) {
    return this.runnerRegistry.attachRunReadinessProbe(...args);
  }
  getActiveAgentDir(...args) {
    return this.sessions.getActiveAgentDir(...args);
  }
  ensureLoaded(...args) {
    return this.sessions.ensureLoaded(...args);
  }
  getEntries(...args) {
    return this.sessions.getEntries(...args);
  }
  appendEntry(...args) {
    return this.sessions.appendEntry(...args);
  }
  setWindowFocused(...args) {
    return this.sessions.setWindowFocused(...args);
  }
  getActiveAgentId(...args) {
    return this.sessions.getActiveAgentId(...args);
  }
  getWindowFocusedAtMs(...args) {
    return this.sessions.getWindowFocusedAtMs(...args);
  }
  noteDesktopContact(...args) {
    return this.sessions.noteDesktopContact(...args);
  }
  switchAgent(...args) {
    return this.sessions.switchAgent(...args);
  }
  announceRemoteActivation(...args) {
    return this.sessions.announceRemoteActivation(...args);
  }
  openAgentWindowed(...args) {
    return this.sessions.openAgentWindowed(...args);
  }
  openAgentTail(...args) {
    return this.sessions.openAgentTail(...args);
  }
  getAgentTranscriptWindow(...args) {
    return this.sessions.getAgentTranscriptWindow(...args);
  }
  getAgentTranscriptTail(...args) {
    return this.sessions.getAgentTranscriptTail(...args);
  }
  getAgentThread(...args) {
    return this.sessions.getAgentThread(...args);
  }
  getAgentTranscript(...args) {
    return this.sessions.getAgentTranscript(...args);
  }
  getAgentTranscriptPage(...args) {
    return this.sessions.getAgentTranscriptPage(...args);
  }
  getRunQueueDiagnostics(...args) {
    return this.runLifecycle.getRunQueueDiagnostics(...args);
  }
  liveRunningAgentIds(...args) {
    return this.runLifecycle.liveRunningAgentIds(...args);
  }
  hasAgentsWithRunningSubagents() {
    return this.roster.liveSubagentParentIds().size > 0;
  }
  listAgents(...args) {
    return this.roster.listAgents(...args);
  }
  countAgentsOnDisk(...args) {
    return this.roster.countAgentsOnDisk(...args);
  }
  unwatchActiveSession() {
    this.automationRuntime.watchedAutomations?.setOnChange(void 0);
    this.automationRuntime.watchedAutomations = void 0;
    this.skillCommands.watchedSkills?.setOnChange(void 0);
    this.skillCommands.watchedSkills = void 0;
    this.roster.stopWatchingProfile();
  }
  searchAgents(...args) {
    return this.roster.searchAgents(...args);
  }
  searchMedia(...args) {
    return this.roster.searchMedia(...args);
  }
  listAgentsSync(...args) {
    return this.roster.listAgentsSync(...args);
  }
  subscribeAgents(...args) {
    return this.roster.subscribeAgents(...args);
  }
  subscribeAgentUpserted(...args) {
    return this.roster.subscribeAgentUpserted(...args);
  }
  subscribeProfileChanged(...args) {
    return this.roster.subscribeProfileChanged(...args);
  }
  noteAgentIdentityRenamed(...args) {
    return this.roster.noteAgentIdentityRenamed(...args);
  }
  refreshAgentRoster() {
    return this.roster.emitAgents();
  }
  emitAgentUpdate(...args) {
    return this.roster.emitAgentUpdate(...args);
  }
  getAgentDisplayProfile(...args) {
    return this.roster.getAgentDisplayProfile(...args);
  }
  subscribe(...args) {
    return this.roster.subscribe(...args);
  }
  subscribeOutline(...args) {
    return this.roster.subscribeOutline(...args);
  }
  subscribeSubagents(...args) {
    return this.roster.subscribeSubagents(...args);
  }
  subscribeAsyncTasks(...args) {
    return this.roster.subscribeAsyncTasks(...args);
  }
  getSubagents(...args) {
    return this.roster.getSubagents(...args);
  }
  getAsyncTasks(...args) {
    return this.roster.getAsyncTasks(...args);
  }
  getConversationOutline(...args) {
    return this.roster.getConversationOutline(...args);
  }
  createAgent(...args) {
    return this.agentLifecycle.createAgent(...args);
  }
  createBackgroundAgent(...args) {
    return this.agentLifecycle.createBackgroundAgent(...args);
  }
  kickstartAgent(...args) {
    return this.agentLifecycle.kickstartAgent(...args);
  }
  requestDiskSaverAudit(...args) {
    return this.agentLifecycle.requestDiskSaverAudit(...args);
  }
  cloneAgent(...args) {
    return this.agentLifecycle.cloneAgent(...args);
  }
  deleteAgent(...args) {
    return this.agentLifecycle.deleteAgent(...args);
  }
  deleteAgents(...args) {
    return this.agentLifecycle.deleteAgents(...args);
  }
  updateAgent(...args) {
    return this.agentLifecycle.updateAgent(...args);
  }
  seedConversationName(...args) {
    return this.agentLifecycle.seedConversationName(...args);
  }
  setAgentUnread(...args) {
    return this.agentLifecycle.setAgentUnread(...args);
  }
  setAgentVoice(...args) {
    return this.agentLifecycle.setAgentVoice(...args);
  }
  setAgentNotifyOnUpdates(...args) {
    return this.agentLifecycle.setAgentNotifyOnUpdates(...args);
  }
  setAgentHiddenFromSidebar(...args) {
    return this.agentLifecycle.setAgentHiddenFromSidebar(...args);
  }
  setAgentAvatarBytes(...args) {
    return this.agentLifecycle.setAgentAvatarBytes(...args);
  }
  setAgentAvatarBytesIfVersion(...args) {
    return this.agentLifecycle.setAgentAvatarBytesIfVersion(...args);
  }
  getAgentAvatar(...args) {
    return this.agentLifecycle.getAgentAvatar(...args);
  }
  getAgentNotificationAvatar(agentId) {
    return this.sessionStore.getAgentNotificationAvatar(agentId);
  }
  createGroup(...args) {
    return this.groupChat.createGroup(...args);
  }
  createGroupInBackground(...args) {
    return this.groupChat.createGroupInBackground(...args);
  }
  setGroupMembers(...args) {
    return this.groupChat.setGroupMembers(...args);
  }
  postToGroup(...args) {
    return this.groupChat.postToGroup(...args);
  }
  wakeForInbound(...args) {
    return this.backgroundWakes.wakeForInbound(...args);
  }
  sendToAgent(...args) {
    return this.backgroundWakes.sendToAgent(...args);
  }
  sendToRemotePeer(...args) {
    return this.backgroundWakes.sendToRemotePeer(...args);
  }
  receivePeerAgentMessage(...args) {
    return this.backgroundWakes.receivePeerAgentMessage(...args);
  }
  appendAgentOutboundEntry(...args) {
    return this.backgroundWakes.appendAgentOutboundEntry(...args);
  }
  appendAgentInboundEntry(...args) {
    return this.backgroundWakes.appendAgentInboundEntry(...args);
  }
  broadcastToAgents(...args) {
    return this.backgroundWakes.broadcastToAgents(...args);
  }
  emitTimelineEvent(...args) {
    return this.backgroundWakes.emitTimelineEvent(...args);
  }
  hasRunningBackgroundShellWork(...args) {
    return this.backgroundWakes.hasRunningBackgroundShellWork(...args);
  }
  hasPendingAutomationSubagentRun(runUuid) {
    return this.pendingWakeStore?.listPending().some((marker17) => marker17.kind === "subagent" && marker17.automationRunUuid === runUuid) ?? false;
  }
  rearmPendingWakes(...args) {
    return this.pendingWakes.rearmPendingWakes(...args);
  }
  redriveUnfulfilledAckObligations(...args) {
    return this.ackObligations.redriveUnfulfilledAckObligations(...args);
  }
  pauseTurnsForUpgrade(...args) {
    return this.upgradeResume.pauseTurnsForUpgrade(...args);
  }
  isPausingForUpgrade(...args) {
    return this.upgradeResume.isPausingForUpgrade(...args);
  }
  isForcedUpgradePauseActive(...args) {
    return this.upgradeResume.isForcedUpgradePauseActive(...args);
  }
  invalidateResumeOwnership(...args) {
    return this.upgradeResume.invalidateResumeOwnership(...args);
  }
  setResumeOwnershipRecoveryRequester(...args) {
    return this.upgradeResume.setResumeOwnershipRecoveryRequester(...args);
  }
  cancelForcedUpgradePause(...args) {
    return this.upgradeResume.cancelForcedUpgradePause(...args);
  }
  abandonOverBudgetUpgradePause(...args) {
    return this.upgradeResume.abandonOverBudgetUpgradePause(...args);
  }
  markAllRunningAgentsForUpgradeResume(...args) {
    return this.upgradeResume.markAllRunningAgentsForUpgradeResume(...args);
  }
  resumeInterruptedUpgradeTurns(...args) {
    return this.upgradeResume.resumeInterruptedUpgradeTurns(...args);
  }
  listResumePendingAgentIds(...args) {
    return this.upgradeResume.listResumePendingAgentIds(...args);
  }
  pauseTurnsForRecreate(...args) {
    return this.upgradeResume.pauseTurnsForRecreate(...args);
  }
  getPauseState() {
    return this.upgradeResume.getPauseState();
  }
  hasCarryablePendingWake(...args) {
    return this.upgradeResume.hasCarryablePendingWake(...args);
  }
  hasMidDrainRevival(...args) {
    return this.upgradeResume.hasMidDrainRevival(...args);
  }
  hasPauseResumeInFlight(...args) {
    return this.upgradeResume.hasPauseResumeInFlight(...args);
  }
  parkResumeAfterIdentityReconcileFailure(...args) {
    return this.upgradeResume.parkResumeAfterIdentityReconcileFailure(...args);
  }
  resumeAfterRecreate(...args) {
    return this.upgradeResume.resumeAfterRecreate(...args);
  }
  subscribeForeverBox(...args) {
    return this.boxHandoff.subscribeForeverBox(...args);
  }
  withBoxHandoff(...args) {
    return this.boxHandoff.withBoxHandoff(...args);
  }
  readMainAgentContext(...args) {
    return this.voiceCalls.readMainAgentContext(...args);
  }
  readVoiceCallSentMessages(...args) {
    return this.voiceCalls.readWrittenMessages(...args);
  }
  nudgeVoiceCall(...args) {
    return this.voiceCalls.nudge(...args);
  }
  recordVoiceCall(...args) {
    return this.voiceCalls.record(...args);
  }
  setVoiceCallPresence(...args) {
    return this.voiceCalls.setVoiceCallPresence(...args);
  }
  overhearServerActivity(...args) {
    return this.voiceCalls.overhearServerActivity(...args);
  }
  forwardServerVoiceChannelSend(...args) {
    return this.voiceCalls.forwardServerVoiceChannelSend(...args);
  }
  subscribeVoiceCallNudges(...args) {
    return this.voiceCalls.subscribeInboundNudges(...args);
  }
  readVoiceCall(...args) {
    return this.voiceCalls.read(...args);
  }
  createAwaitingStateSink(...args) {
    return this.boxHandoff.createAwaitingStateSink(...args);
  }
  handBackForeverBox(...args) {
    return this.boxHandoff.handBackForeverBox(...args);
  }
  emitForeverBoxStatus(...args) {
    return this.boxHandoff.emitForeverBoxStatus(...args);
  }
  resumeAfterBoxHandoff(...args) {
    return this.boxHandoff.resumeAfterBoxHandoff(...args);
  }
  resumeAfterMcpAuth(...args) {
    return this.boxHandoff.resumeAfterMcpAuth(...args);
  }
  resumeAfterListenerConnect(...args) {
    return this.boxHandoff.resumeAfterListenerConnect(...args);
  }
  resumeAfterScmConnect(...args) {
    return this.boxHandoff.resumeAfterScmConnect(...args);
  }
  scmConnectLaunchBlockedReason(...args) {
    return this.boxHandoff.scmConnectLaunchBlockedReason(...args);
  }
  subscribeAutomations(...args) {
    return this.automationRuntime.subscribeAutomations(...args);
  }
  subscribeTodos(...args) {
    return this.agentTodos.subscribe(...args);
  }
  getAgentTodos(...args) {
    return this.agentTodos.get(...args);
  }
  getAgentAutomations(...args) {
    return this.automationRuntime.getAgentAutomations(...args);
  }
  listAllAutomations(...args) {
    return this.automationRuntime.listAllAutomations(...args);
  }
  listAllAutomationDefinitions(...args) {
    return this.automationRuntime.listAllAutomationDefinitions(...args);
  }
  setAgentAutomationEnabled(...args) {
    return this.automationRuntime.setAgentAutomationEnabled(...args);
  }
  createAgentAutomation(...args) {
    return this.automationRuntime.createAgentAutomation(...args);
  }
  updateAgentAutomation(...args) {
    return this.automationRuntime.updateAgentAutomation(...args);
  }
  deleteAgentAutomation(...args) {
    return this.automationRuntime.deleteAgentAutomation(...args);
  }
  runAgentAutomationNow(...args) {
    return this.automationRuntime.runAgentAutomationNow(...args);
  }
  runServerScheduledAutomation(...args) {
    return this.automationRuntime.runServerScheduledAutomation(...args);
  }
  runAutomationForEvent(...args) {
    return this.automationRuntime.runAutomationForEvent(...args);
  }
  runServerAutomationForEvent(...args) {
    return this.automationRuntime.runServerAutomationForEvent(...args);
  }
  subscribeSkills(...args) {
    return this.skillCommands.subscribeSkills(...args);
  }
  getAgentWorkflows(...args) {
    return this.skillCommands.getAgentWorkflows(...args);
  }
  createAgentWorkflow(...args) {
    return this.skillCommands.createAgentWorkflow(...args);
  }
  updateAgentWorkflow(...args) {
    return this.skillCommands.updateAgentWorkflow(...args);
  }
  deleteAgentWorkflow(...args) {
    return this.skillCommands.deleteAgentWorkflow(...args);
  }
  importAgentSkillMarkdown(...args) {
    return this.skillCommands.importAgentSkillMarkdown(...args);
  }
  importAgentSkillSource(...args) {
    return this.skillCommands.importAgentSkillSource(...args);
  }
  importAgentWorkflowUrl(...args) {
    return this.skillCommands.importAgentWorkflowUrl(...args);
  }
  portAgentLocalSkills(...args) {
    return this.skillCommands.portAgentLocalSkills(...args);
  }
  runAgentWorkflowNow(...args) {
    return this.skillCommands.runAgentWorkflowNow(...args);
  }
  respondToWidget(...args) {
    return this.widgetResponses.respondToWidget(...args);
  }
  settleStaleAutoReviewCard(...args) {
    return this.widgetResponses.settleStaleAutoReviewCard(...args);
  }
  expireAllPendingAutoReviewApprovalCards(...args) {
    return this.widgetResponses.expireAllPendingAutoReviewApprovalCards(...args);
  }
  dismissWidget(...args) {
    return this.widgetResponses.dismissWidget(...args);
  }
  submitSecret(...args) {
    return this.widgetResponses.submitSecret(...args);
  }
  storeSecret(...args) {
    return this.widgetResponses.storeSecret(...args);
  }
  submitUserForm(...args) {
    return this.userFormResponses.submitUserForm(...args);
  }
  dismissUserForm(...args) {
    return this.userFormResponses.dismissUserForm(...args);
  }
  reactToMessage(...args) {
    return this.widgetResponses.reactToMessage(...args);
  }
  sendDraft(...args) {
    return this.draftSends.sendDraft(...args);
  }
  discardDraft(...args) {
    return this.draftSends.discardDraft(...args);
  }
};
