var BOX_CDP_PORT_BASE4 = 9222;
var BROWSER_OPERATION_HARNESS2 = { box: "BOX", temporal: "TEMPORAL" };
var SandAgentRunner = class _SandAgentRunner {
  state = new ConversationStateStructure();
  runGeneration = 0;
  fallbackBlobStore = new InMemoryBlobStore();
  transport;
  onRunLifecycle;
  onToolCallEvents;
  subagentOwnership;
  inference;
  diskPressureReminder;
  conversationSizeGuard;
  backgroundSummarizationPropsOverride;
  summaryLifecycle = new SandSummaryLifecycleWatch();
  box;
  remoteBox;
  preparedRemoteBoxConnection;
  remoteBoxTerminalsFolder;
  userComputers;
  remoteBoxHasDesktop;
  getRemoteBoxAvailable;
  boxHandoff;
  userForm;
  cookieOriginApproval;
  virtualCard;
  connectorFiles;
  messages;
  messagesGrants;
  onMessagesToolUse;
  onMessagesGrantsAsk;
  requestContext;
  transcriptMirror;
  isSubagentRunner;
  subagentSendMessageEnabled;
  isAutomationSubagent;
  isParentMediatedAutomationSubagent;
  getAutoReviewParentConversationState;
  subagentType;
  subagentModelId;
  inheritedRequestSource;
  activeTurnRequestSource;
  activeTurnInitiatedBy;
  inheritedAutomationId;
  secretScopeId;
  botSecrets;
  activeTurnAutomationId;
  activeTurnAutomationWakeId;
  activeTurnAutomationWakeEmbedsExternalEvent;
  activeTurnAutomationWakeEmail;
  loopDetection;
  readVideoAttachmentBytes;
  readMediaDimensions;
  subagents;
  observation;
  toolCallIdentity;
  promptGlue;
  turnAgentComposition;
  runShell;
  automationCompletions;
  subagentTranscriptId;
  lastParentTurnPrompt;
  persistedCheckpointHandler;
  onComputerUseUsage;
  onSubagentStalled;
  onBackgroundShellSettled;
  onPendingWakeArmed;
  onPendingWakeDisarmed;
  ctx;
  metricsBackend;
  metricsHarness;
  metricsSessionKind;
  metricsTurnKind;
  fireAndForgetCheckpoints;
  metricsClock;
  steerReach;
  fallbackConversationId = `sand-${crypto.randomUUID()}`;
  webSearchService;
  webFetchService;
  generateImageService;
  generateImageResourceAccessor;
  getAgentDirImpl;
  latestPromptMessagesGetter;
  confirmedUserTurnWatermarkCache;
  confirmedUserTurnWatermarkStore;
  activeRunIsCanceled = () => false;
  activeRunInterrupted = false;
  agentStore;
  agentProfileProvider;
  profilePromptSnapshots;
  promptPrefixSnapshots;
  promptSectionSnapshots;
  toolDescriptionSnapshots;
  systemPromptAssembly;
  turnToolHost;
  pauseMcpCallCancellers = /* @__PURE__ */ new Set();
  ingestAttachment;
  persistImage;
  persistMediaBytes;
  onComputerAction;
  getAgentIdImpl;
  getBoxIdImpl;
  mcp;
  mcpManagement;
  credentialAccess;
  credentialProviderStatus;
  credentialFillLease;
  jevBrowserUse;
  mcpConnectedServerNamesForTurn = [];
  mcpConfigJsonForTurn = void 0;
  mcpCustomInstructionsForTurn = /* @__PURE__ */ new Map();
  mcpDiscoveryUnavailableForTurn = false;
  memoryStore;
  sortMemoriesProposal;
  carryOver;
  skills;
  agentState;
  userMemory;
  memorySnapshots;
  episodeProgress;
  automationStore;
  gates;
  isListenerPlatformConnected;
  registerScmConnectWait;
  registerMcpAuthWait;
  streamTuning;
  streamDeadlineConfig;
  streamDeadlineClock;
  isSystemPromptOverridden;
  skillStore;
  readManagedSkill;
  onManagedSkillRead;
  combinedComputerUse;
  getCombinedComputerUseDecision;
  channelStore;
  connectorManifests;
  localToolPermission;
  hasUserComputer;
  hasGenerateImage;
  detachedSubagents;
  inheritedDirectionEpoch;
  autoReviewController;
  autoReviewModes;
  getAutoReviewModes;
  autoReviewClassifierExecutor;
  getAutoReviewInstructions;
  actionAuditor;
  actionAuditSequencer;
  toolDecisionAudit;
  toolTargets;
  attachBoxServers;
  computerUse;
  autoReviewGate;
  createCloudAgentTool;
  connectedActivity;
  cloudCanvas;
  cloudAgentWatcher;
  resolveCloudAgentTitle;
  canvasCursorAgentIds;
  hiddenCursorAgentCardIds;
  sendToAgentImpl;
  submitProductFeedback;
  getCycleUsage;
  email;
  outboundCall;
  slackReadTools;
  transcriptReader;
  agentActivity;
  activeSessionsDigest;
  getSessionId;
  agentDirectory;
  agentGroups;
  agentsRootDir;
  agentManagement;
  botTemplateShare;
  getSourceAvatar;
  channelManagement;
  appHome;
  slackReaction;
  slackSetup;
  teamPublish;
  backgroundWatches;
  constructor(options2) {
    this.subagentOwnership = options2.subagentOwnership;
    this.metricsBackend = options2.metricsBackend;
    this.metricsHarness = options2.metricsHarness;
    this.metricsSessionKind = options2.metricsSessionKind;
    this.metricsTurnKind = options2.metricsTurnKind;
    this.fireAndForgetCheckpoints = options2.fireAndForgetCheckpoints === true;
    this.steerReach = options2.steerReach ?? { kind: "in-process" };
    this.metricsClock = options2.metricsClock ?? realClock;
    let metricsCtx = createContext().with(loggerKey, options2.loggerBackend ?? { log: () => {
    } });
    if (options2.metricsBackend !== void 0) {
      metricsCtx = metricsCtx.with(metricsKey, options2.metricsBackend);
    }
    const eventTracker = createSandAgentEventTracker({
      telemetry: options2.summaryTelemetry,
      fallback: getAgentEventTracker(metricsCtx),
      getConversationId: () => this.getConversationId(),
      actionAuditor: () => this.actionAuditor,
      resolveBoxId: () => this.resolveBoxId(),
      skills: () => this.skillStore?.list() ?? []
    });
    this.ctx = metricsCtx.with(agentEventTrackerKey, {
      ...eventTracker,
      trackSummaryLifecycle: (ctx, event) => {
        this.summaryLifecycle.note(event);
        eventTracker.trackSummaryLifecycle(ctx, event);
      }
    });
    this.agentStore = options2.agentStore;
    this.confirmedUserTurnWatermarkStore = options2.confirmedUserTurnWatermarkStore;
    this.inference = options2.inference;
    this.diskPressureReminder = options2.diskPressureReminder;
    this.conversationSizeGuard = options2.conversationSizeGuard;
    this.backgroundSummarizationPropsOverride = options2.backgroundSummarizationPropsOverride;
    this.box = options2.box;
    this.remoteBox = options2.remoteBox;
    this.preparedRemoteBoxConnection = options2.preparedRemoteBoxConnection;
    this.userComputers = options2.userComputers ?? createSingleUserComputer({ box: this.box });
    this.remoteBoxHasDesktop = options2.remoteBoxHasDesktop ?? false;
    this.getRemoteBoxAvailable = options2.getRemoteBoxAvailable ?? (() => true);
    this.boxHandoff = options2.boxHandoff;
    this.userForm = options2.userForm;
    this.cookieOriginApproval = options2.cookieOriginApproval;
    this.virtualCard = options2.virtualCard;
    this.connectorFiles = options2.connectorFiles;
    this.messages = options2.messages;
    this.messagesGrants = options2.messagesGrants;
    this.onMessagesToolUse = options2.onMessagesToolUse;
    this.onMessagesGrantsAsk = options2.onMessagesGrantsAsk;
    this.transport = options2.transport;
    this.automationCompletions = options2.automationCompletions;
    this.onRunLifecycle = options2.onRunLifecycle;
    this.onToolCallEvents = options2.onToolCallEvents;
    this.requestContext = options2.requestContext;
    this.transcriptMirror = options2.transcriptMirror;
    this.isSystemPromptOverridden = options2.systemPrompt != null;
    this.isSubagentRunner = options2.isSubagent ?? false;
    this.subagentSendMessageEnabled = options2.subagentSendMessageEnabled ?? false;
    this.isAutomationSubagent = this.isSubagentRunner && this.subagentSendMessageEnabled;
    this.isParentMediatedAutomationSubagent = this.isAutomationSubagent && options2.parentMediatedAutomationSubagent === true;
    this.getAutoReviewParentConversationState = options2.getAutoReviewParentConversationState;
    this.subagentType = options2.subagentType;
    this.subagentModelId = options2.subagentModelId;
    this.inheritedRequestSource = options2.requestSource;
    this.inheritedDirectionEpoch = options2.inheritedDirectionEpoch;
    this.inheritedAutomationId = options2.automationId;
    this.secretScopeId = options2.secretScopeId;
    this.botSecrets = options2.botSecrets;
    this.readVideoAttachmentBytes = options2.readVideoAttachmentBytes;
    this.readMediaDimensions = options2.readMediaDimensions;
    this.subagentTranscriptId = options2.subagentTranscriptId;
    this.agentProfileProvider = options2.agentProfileProvider;
    this.ingestAttachment = options2.ingestAttachment;
    this.persistImage = options2.persistImage;
    this.persistMediaBytes = options2.persistMediaBytes;
    this.onComputerAction = options2.onComputerAction;
    this.getAgentIdImpl = options2.getAgentId;
    this.getBoxIdImpl = options2.getBoxId;
    this.webSearchService = options2.webSearchService;
    this.webFetchService = options2.webFetchService;
    this.generateImageService = options2.generateImageService;
    this.generateImageResourceAccessor = options2.generateImageResourceAccessor;
    this.getAgentDirImpl = options2.getAgentDir;
    this.mcp = options2.mcp;
    this.mcpManagement = options2.mcpManagement;
    this.credentialAccess = options2.credentialAccess;
    this.credentialProviderStatus = options2.credentialProviderStatus;
    this.credentialFillLease = options2.credentialFillLease;
    this.jevBrowserUse = options2.jevBrowserUse;
    this.memoryStore = options2.memoryStore;
    this.sortMemoriesProposal = options2.sortMemoriesProposal;
    this.carryOver = options2.carryOver;
    this.skills = options2.skills;
    this.agentState = options2.agentState;
    this.userMemory = options2.userMemory;
    this.memorySnapshots = options2.memorySnapshots;
    this.profilePromptSnapshots = options2.profilePromptSnapshots;
    this.promptPrefixSnapshots = options2.promptPrefixSnapshots;
    this.promptSectionSnapshots = options2.promptSectionSnapshots;
    this.toolDescriptionSnapshots = options2.toolDescriptionSnapshots;
    this.episodeProgress = options2.episodeProgress;
    this.automationStore = options2.automationStore;
    this.combinedComputerUse = createCombinedComputerUseSelection(options2);
    this.getCombinedComputerUseDecision = this.combinedComputerUse.peekDecision;
    this.gates = options2.gates;
    const detectors = createAuditedDetectors({
      actionAuditor: () => this.actionAuditor,
      getConversationId: () => this.getConversationId(),
      resolveBoxId: () => this.resolveBoxId()
    });
    this.loopDetection = detectors.loopDetection(options2);
    this.isListenerPlatformConnected = options2.isListenerPlatformConnected;
    this.registerScmConnectWait = options2.registerScmConnectWait;
    this.registerMcpAuthWait = options2.registerMcpAuthWait;
    this.streamTuning = options2.streamTuning;
    this.streamDeadlineConfig = options2.streamDeadlineConfig;
    this.streamDeadlineClock = options2.streamDeadlineClock;
    this.skillStore = options2.skillStore;
    this.readManagedSkill = options2.readManagedSkill;
    this.onManagedSkillRead = options2.onManagedSkillRead;
    this.channelStore = options2.channelStore;
    this.connectorManifests = options2.connectorManifests ?? CONNECTOR_MANIFESTS;
    this.localToolPermission = options2.localToolPermission;
    this.hasUserComputer = options2.hasUserComputer;
    this.hasGenerateImage = options2.hasGenerateImage;
    this.detachedSubagents = options2.detachedSubagents;
    this.autoReviewController = options2.autoReviewController;
    this.autoReviewModes = options2.autoReviewModes ?? SAND_AUTO_REVIEW_MODES_OFF;
    this.getAutoReviewModes = options2.getAutoReviewModes;
    this.getAutoReviewInstructions = options2.getAutoReviewInstructions;
    this.attachBoxServers = options2.attachBoxServers;
    const audit = composeRunnerActionAudit(
      options2,
      () => this.activeTurnInitiatedBy,
      detectors.navigation
    );
    this.actionAuditSequencer = audit.sequencer;
    this.actionAuditor = audit.actionAuditor;
    this.autoReviewClassifierExecutor = audit.autoReviewClassifierExecutor;
    this.toolDecisionAudit = audit.toolDecisionAudit;
    this.toolTargets = audit.toolTargets;
    this.ctx = audit.withLedgers(this.ctx);
    this.createCloudAgentTool = options2.createCloudAgentTool;
    this.connectedActivity = options2.connectedActivity;
    this.cloudCanvas = options2.cloudCanvas;
    this.cloudAgentWatcher = options2.cloudAgentWatcher;
    this.resolveCloudAgentTitle = options2.resolveCloudAgentTitle;
    this.canvasCursorAgentIds = options2.canvasCursorAgentIds ?? /* @__PURE__ */ new Set();
    this.hiddenCursorAgentCardIds = options2.hiddenCursorAgentCardIds;
    this.sendToAgentImpl = options2.sendToAgent;
    this.submitProductFeedback = options2.submitProductFeedback;
    this.getCycleUsage = options2.getCycleUsage;
    this.email = options2.email;
    this.outboundCall = options2.outboundCall;
    this.slackReadTools = options2.slackReadTools;
    this.transcriptReader = options2.transcriptReader;
    this.agentActivity = options2.agentActivity;
    this.activeSessionsDigest = options2.activeSessionsDigest;
    this.getSessionId = options2.getSessionId;
    this.agentDirectory = options2.agentDirectory;
    this.agentGroups = options2.agentGroups;
    this.agentsRootDir = options2.agentsRootDir;
    this.agentManagement = options2.agentManagement;
    this.botTemplateShare = options2.botTemplateShare;
    this.getSourceAvatar = options2.getSourceAvatar;
    this.channelManagement = options2.channelManagement;
    this.appHome = options2.appHome;
    this.slackReaction = options2.slackReaction;
    this.slackSetup = options2.slackSetup;
    this.teamPublish = options2.teamPublish;
    this.systemPromptAssembly = createSystemPromptAssembly({
      activeTurnRequestSource: () => this.activeTurnRequestSource,
      basePrompt: options2.systemPrompt ?? "",
      baseSystemPromptOverride: options2.baseSystemPromptOverride,
      isSubagentRunner: this.isSubagentRunner,
      isParentMediatedAutomationSubagent: this.isParentMediatedAutomationSubagent,
      isComputerUseSubagent: this.isComputerUseSubagent,
      isSystemPromptOverridden: this.isSystemPromptOverridden,
      isBoxScopedSubagent: () => this.isBoxScopedSubagent,
      gates: this.gates,
      credentialFillEnabled: !this.isSubagentRunner && !this.isSystemPromptOverridden && options2.credentialAccess != null,
      hasUserComputer: options2.hasUserComputer,
      hasGenerateImage: options2.hasGenerateImage,
      connectorManifests: this.connectorManifests,
      requestContext: this.requestContext,
      sendToAgentImpl: this.sendToAgentImpl,
      agentManagement: this.agentManagement,
      channelManagement: this.channelManagement,
      agentDirectory: this.agentDirectory,
      agentGroups: this.agentGroups,
      agentsRootDir: this.agentsRootDir,
      isUserFormEnabled: () => this.userForm != null && this.gates.userForm(),
      agentProfileProvider: () => this.agentProfileProvider,
      agentStore: () => this.agentStore,
      memoryStore: () => this.memoryStore,
      userMemory: () => this.userMemory,
      memorySnapshots: () => this.memorySnapshots,
      promptSectionSnapshots: () => this.promptSectionSnapshots,
      automationStore: () => this.automationStore,
      skillStore: () => this.skillStore,
      channelStore: () => this.channelStore,
      mcpManagement: () => this.mcpManagement,
      compactionEpoch: () => this.getConversationState().summaryArchives.length,
      activeSessionsDigest: () => this.activeSessionsDigest?.(),
      currentSession: () => options2.currentSession?.(),
      relatedConversations: options2.relatedConversations,
      teamBot: () => options2.teamBot?.(),
      mcpCustomInstructionsSection: () => this.promptGlue.getMcpCustomInstructionsSection(),
      toolNotesSection: () => this.renderToolNotesSection(options2.resolveSecretRequestTarget),
      remoteBoxSection: () => this.promptGlue.getRemoteBoxSection(),
      botSecrets: () => this.botSecrets,
      computerSection: (skillify) => this.promptGlue.getComputerSection(skillify)
    });
    this.computerUse = createComputerUseCoordination({
      ctx: this.ctx,
      remoteBox: this.remoteBox,
      harness: this.browserOperationHarness,
      actionAuditor: () => this.actionAuditor,
      getConversationId: () => this.getConversationId(),
      resolveBoxId: () => this.resolveBoxId(),
      initialNavigationProbe: options2.navigationProbe,
      ...this.attachBoxServers === void 0 ? {} : { attachBoxServers: this.attachBoxServers }
    });
    this.subagents = createSubagentRuntime({
      getCombinedComputerUseDecision: this.combinedComputerUse.peekDecision,
      subagentOwnership: this.subagentOwnership,
      computerUse: this.computerUse,
      actionAuditor: this.actionAuditor,
      getConversationId: () => this.getConversationId(),
      resolveBoxId: () => this.resolveBoxId(),
      emitAsyncTasksChanged: () => this.observation.emitAsyncTasksChanged(),
      get onComputerUseUsage() {
        return self2.onComputerUseUsage;
      },
      get onPendingWakeArmed() {
        return self2.onPendingWakeArmed;
      },
      get onPendingWakeDisarmed() {
        return self2.onPendingWakeDisarmed;
      },
      get onSubagentStalled() {
        return self2.onSubagentStalled;
      }
    });
    this.observation = createTurnObservation(
      {
        getConversationId: () => this.getConversationId(),
        isActiveRunCanceled: () => this.activeRunIsCanceled(),
        isActiveRunInterrupted: () => this.activeRunInterrupted,
        subagentRegistryEntries: () => this.subagents.registryEntries(),
        isSubagentAborting: (subagentAgentId) => this.subagents.isAborting(subagentAgentId),
        listBackgroundShellWork: (query) => this.backgroundWatches.listRegisteredShellWork(query),
        shellRewatchEntries: () => this.backgroundWatches.shellRewatchEntries(),
        cloudAgentWatchEntries: () => this.backgroundWatches.cloudAgentWatchEntries()
      },
      { clock: this.metricsClock }
    );
    this.backgroundWatches = createBackgroundWatches({
      getConversationId: () => this.getConversationId(),
      emitAsyncTasksChanged: () => this.observation.emitAsyncTasksChanged(),
      notifyBackgroundWorkSettled: (completion) => this.subagents.notifyBackgroundWorkSettled(completion),
      cloudAgentWatcher: () => this.cloudAgentWatcher,
      pendingWakeArmedHandler: () => this.onPendingWakeArmed,
      backgroundShellSettledHandler: () => this.onBackgroundShellSettled,
      pollShellTerminalFile: (shellId, isCancelled, settle) => void pollShellTerminalFile(this.shellWatchHost(), shellId, isCancelled, settle)
    });
    this.toolCallIdentity = createToolCallIdentity({
      emitUpdate: (update) => {
        if (update.type !== "tool-call") return;
        this.observation.recordToolActivity(update);
        this.transport?.onUpdate(update);
      }
    });
    const runner = this;
    this.promptGlue = createPromptCollectorGlue({
      isCombinedComputerUseAvailable: this.combinedComputerUse.read,
      get ctx() {
        return runner.ctx;
      },
      get box() {
        return runner.box;
      },
      get remoteBox() {
        return runner.remoteBox;
      },
      get remoteBoxHasDesktop() {
        return runner.remoteBoxHasDesktop;
      },
      get userComputers() {
        return runner.userComputers;
      },
      get isSubagentRunner() {
        return runner.isSubagentRunner;
      },
      get isParentMediatedAutomationSubagent() {
        return runner.isParentMediatedAutomationSubagent;
      },
      get isComputerUseSubagent() {
        return runner.isComputerUseSubagent;
      },
      get isBrowserUseSubagent() {
        return runner.isBrowserUseSubagent;
      },
      get requestContext() {
        return runner.requestContext;
      },
      get mcp() {
        return runner.mcp;
      },
      get automationStore() {
        return runner.automationStore;
      },
      get agentProfileProvider() {
        return runner.agentProfileProvider;
      },
      get readVideoAttachmentBytes() {
        return runner.readVideoAttachmentBytes;
      },
      gates: this.gates,
      hasUserComputer: options2.hasUserComputer,
      getRemoteBoxAvailable: () => runner.getRemoteBoxAvailable(),
      get cookieOriginApproval() {
        return runner.cookieOriginApproval;
      },
      getConversationId: () => this.getConversationId(),
      resolveBoxId: () => this.resolveBoxId(),
      resolveBoxBrowser: () => this.resolveBoxBrowser(),
      mcpConnectedServerNamesForTurn: () => this.mcpConnectedServerNamesForTurn,
      mcpConfigJsonForTurn: () => this.mcpConfigJsonForTurn,
      mcpCustomInstructionsForTurn: () => this.mcpCustomInstructionsForTurn
    });
    this.autoReviewGate = createAutoReviewGate({
      controller: () => this.autoReviewController,
      baseModes: this.autoReviewModes,
      getModes: this.getAutoReviewModes,
      getInstructions: this.getAutoReviewInstructions
    });
    const self2 = this;
    this.turnToolHost = {
      browserOperationHarness: this.browserOperationHarness,
      metricsHarness: this.metricsHarness,
      memoryTelemetry: options2.memoryTelemetry,
      reportBrowserOperation: (report) => options2.browserTelemetry?.reportBrowserOperation(report),
      reportComputerOperation: (report) => options2.computerTelemetry?.reportComputerOperation(report),
      getCombinedComputerUseSelection: this.combinedComputerUse.peek,
      isCombinedComputerUseAvailable: this.combinedComputerUse.read,
      toolNotesInSystemPrompt: () => self2.toolNotesInSystemPrompt(),
      get isSubagentRunner() {
        return self2.isSubagentRunner;
      },
      get isAutomationSubagent() {
        return self2.isAutomationSubagent;
      },
      get isParentMediatedAutomationSubagent() {
        return self2.isParentMediatedAutomationSubagent;
      },
      get isComputerUseSubagent() {
        return self2.isComputerUseSubagent;
      },
      get isBrowserUseSubagent() {
        return self2.isBrowserUseSubagent;
      },
      get isBoxScopedSubagent() {
        return self2.isBoxScopedSubagent;
      },
      gates: this.gates,
      getOrCreateNavigationProbe: () => this.computerUse.getOrCreateNavigationProbe(),
      get isSystemPromptOverridden() {
        return self2.isSystemPromptOverridden;
      },
      get subagentType() {
        return self2.subagentType;
      },
      get ctx() {
        return self2.ctx;
      },
      get requestContext() {
        return self2.requestContext;
      },
      get remoteBox() {
        return self2.remoteBox;
      },
      get remoteBoxHasDesktop() {
        return self2.remoteBoxHasDesktop;
      },
      get getRemoteBoxAvailable() {
        return self2.getRemoteBoxAvailable;
      },
      get transport() {
        return self2.transport;
      },
      boxHandoff: this.boxHandoff,
      userForm: this.userForm,
      cookieOriginApproval: this.cookieOriginApproval,
      virtualCard: this.virtualCard,
      connectorFiles: this.connectorFiles,
      isMcpDiscoveryUnavailableForTurn: () => this.mcpDiscoveryUnavailableForTurn,
      messages: this.messages,
      messagesGrants: this.messagesGrants,
      onMessagesToolUse: this.onMessagesToolUse,
      onMessagesGrantsAsk: this.onMessagesGrantsAsk,
      get mcp() {
        return self2.mcp;
      },
      get mcpManagement() {
        return self2.mcpManagement;
      },
      get credentialAccess() {
        return self2.credentialAccess;
      },
      get credentialProviderStatus() {
        return self2.credentialProviderStatus;
      },
      get credentialFillLease() {
        return self2.credentialFillLease;
      },
      get jevBrowserUse() {
        return self2.jevBrowserUse;
      },
      registerPauseMcpCancel: (cancel) => {
        if (this.isPausingForUpgrade()) {
          cancel();
          return () => {
          };
        }
        this.pauseMcpCallCancellers.add(cancel);
        return () => this.pauseMcpCallCancellers.delete(cancel);
      },
      observeDynamicToolCall: (observation) => this.observation.reportToolCallDiagnostic(observation),
      observeToolCallArgsRejected: (observation) => this.observation.reportToolCallDiagnostic(observation),
      get agentState() {
        return self2.agentState;
      },
      get memoryStore() {
        return self2.memoryStore;
      },
      get sortMemoriesProposal() {
        return self2.sortMemoriesProposal;
      },
      get carryOver() {
        return self2.carryOver;
      },
      get skills() {
        return self2.skills;
      },
      get userMemory() {
        return self2.userMemory;
      },
      get persistImage() {
        return self2.persistImage;
      },
      get persistMediaBytes() {
        return self2.persistMediaBytes;
      },
      get ingestAttachment() {
        return self2.ingestAttachment;
      },
      get readMediaDimensions() {
        return self2.readMediaDimensions;
      },
      get skillStore() {
        return self2.skillStore;
      },
      get automationStore() {
        return self2.automationStore;
      },
      get sendToAgentImpl() {
        return self2.sendToAgentImpl;
      },
      get submitProductFeedback() {
        return self2.submitProductFeedback;
      },
      get getCycleUsage() {
        return self2.getCycleUsage;
      },
      get email() {
        return self2.email;
      },
      get outboundCall() {
        return self2.outboundCall;
      },
      get slackReadTools() {
        return self2.slackReadTools;
      },
      get transcriptReader() {
        return self2.transcriptReader;
      },
      get agentActivity() {
        return self2.agentActivity;
      },
      getSessionId: () => self2.getSessionId?.() ?? "",
      resolveSecretRequestTarget: options2.resolveSecretRequestTarget,
      ...options2.teamBot === void 0 ? {} : { teamBot: options2.teamBot },
      get agentManagement() {
        return self2.agentManagement;
      },
      get botTemplateShare() {
        return self2.botTemplateShare;
      },
      getSourceAvatar: options2.getSourceAvatar,
      get channelManagement() {
        return self2.channelManagement;
      },
      get appHome() {
        return self2.appHome;
      },
      get slackReaction() {
        return self2.slackReaction;
      },
      get slackSetup() {
        return self2.slackSetup;
      },
      get teamPublish() {
        return self2.teamPublish;
      },
      get createCloudAgentTool() {
        return self2.createCloudAgentTool;
      },
      get connectedActivity() {
        return self2.connectedActivity;
      },
      get cloudCanvas() {
        return self2.cloudCanvas;
      },
      get resolveCloudAgentTitle() {
        return self2.resolveCloudAgentTitle;
      },
      get canvasCursorAgentIds() {
        return self2.canvasCursorAgentIds;
      },
      get hiddenCursorAgentCardIds() {
        return self2.hiddenCursorAgentCardIds;
      },
      get localToolPermission() {
        return self2.localToolPermission;
      },
      get generateImageService() {
        return self2.generateImageService;
      },
      get generateImageResourceAccessor() {
        return self2.generateImageResourceAccessor;
      },
      get imageGenerationConcurrencyLimiter() {
        return self2.promptGlue.imageGenerationLimiter();
      },
      autoReviewController: self2.autoReviewController,
      actionAuditor: self2.actionAuditor,
      toolDecisionAudit: this.toolDecisionAudit,
      get getAutoReviewInstructions() {
        return self2.getAutoReviewInstructions;
      },
      get getAutoReviewParentConversationState() {
        return self2.getAutoReviewParentConversationState;
      },
      activeTurnRequestSource: () => self2.activeTurnRequestSource,
      activeTurnAutomationWakeId: () => self2.activeTurnAutomationWakeId,
      activeTurnAutomationWakeEmbedsExternalEvent: () => self2.activeTurnAutomationWakeEmbedsExternalEvent,
      activeTurnAutomationWakeEmail: () => self2.activeTurnAutomationWakeEmail,
      get getAgentDirImpl() {
        return self2.getAgentDirImpl;
      },
      onComputerAction: self2.onComputerAction,
      hasUserComputer: options2.hasUserComputer,
      trustsAutomationWrites: options2.trustsAutomationWrites,
      canReviewAutomationWrites: options2.canReviewAutomationWrites,
      automationWriteProvenance: options2.automationWriteProvenance,
      automationWriteReviewMode: options2.automationWriteReviewMode,
      get isListenerPlatformConnected() {
        return self2.isListenerPlatformConnected;
      },
      registerScmConnectWait: self2.registerScmConnectWait,
      registerMcpAuthWait: self2.registerMcpAuthWait,
      scmWriteBlockedReason: options2.scmWriteBlockedReason,
      recordModelToolName: (toolCallId, name17) => this.toolCallIdentity.recordModelToolName(toolCallId, name17),
      emitUpdate: (update, updateObservers) => this.emitUpdate(update, updateObservers),
      resolveBoxId: () => this.resolveBoxId(),
      getConversationId: () => this.getConversationId(),
      getTranscriptId: () => this.getTranscriptId(),
      resolveBoxTerminalsFolder: () => this.resolveBoxTerminalsFolder(),
      assertNoPendingAutoReviewApproval: () => this.autoReviewGate.assertNoPendingApproval(),
      createFileTransferController: () => this.promptGlue.createFileTransferController(),
      steerSubagent: (subagentAgentId, message) => this.steerSubagent(subagentAgentId, message),
      abortSubagent: (subagentAgentId) => this.abortSubagent(subagentAgentId),
      listRunningSubagents: () => this.listRunningSubagents(),
      getRunningSubagent: (subagentAgentId) => this.getRunningSubagent(subagentAgentId),
      detachedSubagents: this.detachedSubagents
    };
    const parentTransport = this.transport;
    this.turnAgentComposition = (options2.createTurnAgentComposition ?? createTurnAgentComposition)({
      isCombinedComputerUseAvailable: this.combinedComputerUse.read,
      toolDescriptionSnapshots: () => this.frozenToolDescriptionSnapshots(),
      compactionEpoch: () => this.getConversationState().summaryArchives.length,
      subagentOwnership: this.subagentOwnership,
      isSubagentRunner: this.isSubagentRunner,
      isParentMediatedAutomationSubagent: this.isParentMediatedAutomationSubagent,
      subagentType: this.subagentType,
      isBoxScopedSubagent: this.isBoxScopedSubagent,
      isSystemPromptOverridden: this.isSystemPromptOverridden,
      gates: this.gates,
      canvasCursorAgentIds: this.canvasCursorAgentIds,
      hasUserComputer: options2.hasUserComputer,
      inference: this.inference,
      disabledToolIdentifiers: options2.disabledToolIdentifiers,
      loggerBackend: this.ctx.get(loggerKey),
      metricsBackend: this.metricsBackend,
      metricsHarness: this.metricsHarness,
      metricsSessionKind: this.metricsSessionKind,
      metricsClock: this.metricsClock,
      fireAndForgetCheckpoints: this.fireAndForgetCheckpoints,
      streamTuning: this.streamTuning,
      box: this.box,
      remoteBox: this.remoteBox,
      userComputers: this.userComputers,
      remoteBoxHasDesktop: this.remoteBoxHasDesktop,
      getRemoteBoxAvailable: this.getRemoteBoxAvailable,
      requestContext: this.requestContext,
      modelVisibleTime: options2.modelVisibleTime,
      skillStore: () => this.skillStore,
      transcriptMirror: this.transcriptMirror,
      subagentTransport: options2.subagentTransport ?? (parentTransport === void 0 ? void 0 : createSubagentTransport(parentTransport)),
      readVideoAttachmentBytes: this.readVideoAttachmentBytes,
      secretScopeId: this.secretScopeId,
      botSecrets: this.botSecrets,
      onComputerAction: this.onComputerAction,
      onRunLifecycle: this.onRunLifecycle,
      onToolCallEvents: this.onToolCallEvents,
      webSearchService: this.webSearchService,
      webFetchService: this.webFetchService,
      localToolPermission: this.localToolPermission,
      credentialFillLease: this.credentialFillLease,
      backgroundSummarizationPropsOverride: this.backgroundSummarizationPropsOverride,
      pendingSummaryStore: options2.pendingSummaryStore ?? createRunnerPendingSummaryStore(),
      autoReviewController: this.autoReviewController,
      getAutoReviewModes: this.getAutoReviewModes,
      autoReviewClassifierExecutor: this.autoReviewClassifierExecutor,
      getAutoReviewInstructions: this.getAutoReviewInstructions,
      actionAuditor: this.actionAuditor,
      actionAuditSequencer: this.actionAuditSequencer,
      toolDecisionAudit: this.toolDecisionAudit,
      toolTargets: this.toolTargets,
      attachBoxServers: this.attachBoxServers,
      createCloudAgentTool: this.createCloudAgentTool,
      detachedSubagents: this.detachedSubagents,
      subagents: this.subagents,
      computerUse: this.computerUse,
      observation: this.observation,
      toolCallIdentity: this.toolCallIdentity,
      promptGlue: this.promptGlue,
      systemPromptAssembly: this.systemPromptAssembly,
      autoReviewGate: this.autoReviewGate,
      turnToolHost: this.turnToolHost,
      getConversationId: () => this.getConversationId(),
      getTranscriptId: () => this.getTranscriptId(),
      resolveBoxId: () => this.resolveBoxId(),
      getBlobStore: () => this.getBlobStore(),
      getAutoReviewConversationState: (ctx) => this.createAutoReviewConversationState(ctx),
      emitUpdate: (update, updateObservers) => this.emitUpdate(update, updateObservers),
      createRemoteBoxResourceAccessor: () => this.createRemoteBoxResourceAccessor(),
      mcp: () => this.mcp,
      mcpConfigJsonForTurn: () => this.mcpConfigJsonForTurn,
      persistImage: () => this.persistImage,
      setLatestPromptMessagesGetter: (getter) => {
        this.latestPromptMessagesGetter = getter;
      },
      automationCompletions: () => this.automationCompletions,
      activeTurnRequestSource: () => this.activeTurnRequestSource,
      activeTurnAutomationId: () => this.activeTurnAutomationId,
      onLoopDetected: this.loopDetection.onDetected,
      onLoopMitigation: this.loopDetection.onMitigation,
      loopDetectionMode: this.loopDetection.mode,
      constructRunner: (childOptions) => {
        let inheritedOptions = {};
        if (childOptions.subagentSendMessageEnabled === true) {
          inheritedOptions = {
            memoryStore: this.memoryStore,
            userMemory: this.userMemory,
            memorySnapshots: this.memorySnapshots,
            profilePromptSnapshots: this.profilePromptSnapshots,
            episodeProgress: this.episodeProgress,
            automationStore: this.automationStore,
            agentState: this.agentState,
            skillStore: this.skillStore,
            channelStore: this.channelStore,
            connectorManifests: this.connectorManifests,
            ...this.boxHandoff === void 0 ? {} : { boxHandoff: this.boxHandoff },
            ...this.userForm === void 0 ? {} : { userForm: this.userForm },
            ...this.mcpManagement === void 0 ? {} : { mcpManagement: this.mcpManagement },
            ...this.agentProfileProvider === void 0 ? {} : { agentProfileProvider: this.agentProfileProvider },
            ...this.ingestAttachment === void 0 ? {} : { ingestAttachment: this.ingestAttachment },
            ...this.readMediaDimensions === void 0 ? {} : { readMediaDimensions: this.readMediaDimensions },
            ...this.persistMediaBytes === void 0 ? {} : { persistMediaBytes: this.persistMediaBytes },
            ...this.generateImageService === void 0 ? {} : { generateImageService: this.generateImageService },
            ...this.generateImageResourceAccessor === void 0 ? {} : { generateImageResourceAccessor: this.generateImageResourceAccessor },
            ...this.getAgentDirImpl === void 0 ? {} : { getAgentDir: this.getAgentDirImpl },
            ...this.hasUserComputer === void 0 ? {} : { hasUserComputer: this.hasUserComputer },
            ...this.hasGenerateImage === void 0 ? {} : { hasGenerateImage: this.hasGenerateImage },
            ...this.isListenerPlatformConnected === void 0 ? {} : { isListenerPlatformConnected: this.isListenerPlatformConnected },
            ...this.cloudAgentWatcher === void 0 ? {} : { cloudAgentWatcher: this.cloudAgentWatcher },
            ...this.resolveCloudAgentTitle === void 0 ? {} : { resolveCloudAgentTitle: this.resolveCloudAgentTitle },
            canvasCursorAgentIds: this.canvasCursorAgentIds,
            ...this.hiddenCursorAgentCardIds === void 0 ? {} : { hiddenCursorAgentCardIds: this.hiddenCursorAgentCardIds },
            ...this.sendToAgentImpl === void 0 ? {} : { sendToAgent: this.sendToAgentImpl },
            ...this.submitProductFeedback === void 0 ? {} : { submitProductFeedback: this.submitProductFeedback },
            ...this.agentDirectory === void 0 ? {} : { agentDirectory: this.agentDirectory },
            ...this.agentGroups === void 0 ? {} : { agentGroups: this.agentGroups },
            ...this.agentsRootDir === void 0 ? {} : { agentsRootDir: this.agentsRootDir },
            ...this.agentManagement === void 0 ? {} : { agentManagement: this.agentManagement },
            ...this.botTemplateShare === void 0 ? {} : { botTemplateShare: this.botTemplateShare },
            ...this.getSourceAvatar === void 0 ? {} : { getSourceAvatar: this.getSourceAvatar },
            ...this.channelManagement === void 0 ? {} : { channelManagement: this.channelManagement },
            ...this.appHome === void 0 ? {} : { appHome: this.appHome },
            ...this.slackReaction === void 0 ? {} : { slackReaction: this.slackReaction },
            ...this.detachedSubagents === void 0 ? {} : { detachedSubagents: this.detachedSubagents }
          };
        } else if (childOptions.requestSource === "automation") {
          inheritedOptions = {
            memoryStore: this.memoryStore,
            userMemory: this.userMemory,
            memorySnapshots: this.memorySnapshots
          };
        }
        const runnerOptions = {
          readManagedSkill: options2.readManagedSkill,
          onManagedSkillRead: options2.onManagedSkillRead,
          summaryTelemetry: options2.summaryTelemetry,
          browserTelemetry: options2.browserTelemetry,
          computerTelemetry: options2.computerTelemetry,
          memoryTelemetry: options2.memoryTelemetry,
          scmWriteBlockedReason: options2.scmWriteBlockedReason,
          ...childOptions,
          ...inheritedOptions,
          ...options2.resolveSecretRequestTarget === void 0 ? {} : { resolveSecretRequestTarget: refuseNestedSecretRequest }
        };
        return createJevBrowserSubagentRunner(runnerOptions) ?? new _SandAgentRunner(runnerOptions);
      }
    });
    this.runShell = (options2.createTurnRunShell ?? createTurnRunShell)({
      isSubagentRunner: this.isSubagentRunner,
      isParentMediatedAutomationSubagent: this.isParentMediatedAutomationSubagent,
      isComputerUseSubagent: this.isComputerUseSubagent,
      isBrowserUseSubagent: this.isBrowserUseSubagent,
      subagentType: this.subagentType,
      subagentModelId: this.subagentModelId,
      inheritedRequestSource: this.inheritedRequestSource,
      inheritedDirectionEpoch: this.inheritedDirectionEpoch,
      inheritedAutomationId: this.inheritedAutomationId,
      secretScopeId: this.secretScopeId,
      ctx: this.ctx,
      metricsHarness: this.metricsHarness,
      metricsSessionKind: this.metricsSessionKind,
      metricsTurnKind: this.metricsTurnKind,
      metricsActivityStartedAt: options2.metricsActivityStartedAt,
      metricsUserMessageSentAt: options2.metricsUserMessageSentAt,
      metricsTurnStartedAt: options2.metricsTurnStartedAt,
      metricsUserMessagesAccepted: options2.metricsUserMessagesAccepted,
      metricsClock: this.metricsClock,
      steerReach: this.steerReach,
      diskPressureReminder: this.diskPressureReminder,
      conversationSizeGuard: this.conversationSizeGuard,
      localToolPermission: this.localToolPermission,
      transcriptMirror: this.transcriptMirror,
      inference: this.inference,
      box: this.box,
      systemPromptAssembly: this.systemPromptAssembly,
      promptGlue: this.promptGlue,
      computerUse: this.computerUse,
      observation: this.observation,
      backgroundWatches: this.backgroundWatches,
      turnAgentComposition: this.turnAgentComposition,
      subagents: this.subagents,
      resolveUserFormVaultKeysForRun: async () => this.userForm?.listVaultKeys != null && this.gates.userForm() && this.gates.formVault() ? await this.userForm.listVaultKeys() : void 0,
      getConversationId: () => this.getConversationId(),
      getTranscriptId: () => this.getTranscriptId(),
      resolveBoxId: () => this.resolveBoxId(),
      actionAuditor: () => this.actionAuditor,
      getConversationState: () => this.getConversationState(),
      onPersistedCheckpoint: () => {
        this.persistedCheckpointHandler?.();
      },
      noteParentTurnPrompt: (prompt) => void (this.lastParentTurnPrompt = prompt),
      getBlobStore: () => this.getBlobStore(),
      shellWatchHost: () => this.shellWatchHost(),
      emitUpdate: (update) => this.emitUpdate(update),
      emitRunLifecycle: (event) => this.emitRunLifecycle(event),
      beginAutoReviewUserMessageEpoch: () => this.beginAutoReviewUserMessageEpoch(),
      awaitAutoReviewPolicy: options2.awaitAutoReviewPolicy,
      runGeneration: () => this.runGeneration,
      agentStore: () => this.agentStore,
      memoryStore: () => this.memoryStore,
      episodeProgress: () => this.episodeProgress,
      profilePromptSnapshots: () => this.profilePromptSnapshots,
      promptPrefixSnapshots: () => this.promptPrefixSnapshots,
      toolDescriptionSnapshots: () => this.frozenToolDescriptionSnapshots(),
      promptPrefixTelemetry: () => options2.summaryTelemetry,
      mcp: () => this.mcp,
      automationCompletions: () => this.automationCompletions,
      prepareBotTemplateShareScope: async () => {
        if (this.isSubagentRunner && !this.isAutomationSubagent || !this.gates.botShare()) {
          return;
        }
        await this.botTemplateShare?.prepareShareScope?.();
      },
      setLocalState: (state) => {
        this.state = state;
      },
      latestPromptMessagesGetter: () => this.latestPromptMessagesGetter,
      setLatestPromptMessagesGetter: (getter) => {
        this.latestPromptMessagesGetter = getter;
      },
      setActiveRunIsCanceled: (isCanceled) => {
        this.activeRunIsCanceled = isCanceled;
      },
      setActiveRunInterrupted: (value) => {
        this.activeRunInterrupted = value;
      },
      setActiveTurnRequestSource: (source) => void (this.activeTurnRequestSource = source),
      setActiveTurnInitiatedBy: (initiatedBy) => void (this.activeTurnInitiatedBy = initiatedBy),
      resolveTurnLoopDetection: this.loopDetection.resolveTurn,
      setActiveTurnAutomationId: (automationId) => {
        this.activeTurnAutomationId = automationId;
      },
      setActiveTurnAutomationWakeId: (automationWakeId) => {
        this.activeTurnAutomationWakeId = automationWakeId;
      },
      setActiveTurnAutomationWakeEmbedsExternalEvent: (embedsExternalEvent) => {
        this.activeTurnAutomationWakeEmbedsExternalEvent = embedsExternalEvent;
      },
      setActiveTurnAutomationWakeEmail: (email3) => {
        this.activeTurnAutomationWakeEmail = email3;
      },
      streamTuning: this.streamTuning,
      streamDeadlineConfig: () => this.streamDeadlineConfig?.(),
      streamDeadlineClock: this.streamDeadlineClock,
      setMcpDiscoveryUnavailableForTurn: (value) => {
        this.mcpDiscoveryUnavailableForTurn = value;
      },
      noteMcpToolDiscoveryFailed: (error42) => this.noteMcpToolDiscoveryFailed(error42),
      setMcpConnectedServerNamesForTurn: (names3) => {
        this.mcpConnectedServerNamesForTurn = names3;
      },
      setMcpConfigJsonForTurn: (value) => {
        this.mcpConfigJsonForTurn = value;
      },
      setMcpCustomInstructionsForTurn: (instructions) => {
        this.mcpCustomInstructionsForTurn = instructions;
      },
      stampInheritableRunAttributes: (runCtx, inferenceRequestId, turnType) => this.stampInheritableRunAttributes(runCtx, inferenceRequestId, turnType),
      stampCallerTurnRootRequestId: (span, inferenceRequestId) => this.stampCallerTurnRootRequestId(span, inferenceRequestId)
    });
  }
  resolveAutoReviewApproval(approvalId, resolution) {
    return this.autoReviewController?.resolveApproval(approvalId, resolution) !== void 0;
  }
  beginAutoReviewUserMessageEpoch() {
    this.autoReviewController?.beginUserMessageEpoch();
  }
  expireAutoReviewApprovals() {
    this.autoReviewController?.expire("session_end");
  }
  setAgentStore(agentStore, agentProfileProvider) {
    if (this.agentStore !== agentStore) {
      this.confirmedUserTurnWatermarkCache = void 0;
      this.confirmedUserTurnWatermarkStore = void 0;
    }
    this.agentStore = agentStore;
    this.agentProfileProvider = agentProfileProvider;
    this.systemPromptAssembly.resetProfileSnapshotFallback();
    this.runGeneration++;
  }
  setAttachmentIngestor(ingest) {
    this.ingestAttachment = ingest;
  }
  setImagePersister(persistImage) {
    this.persistImage = persistImage;
  }
  setMediaBytesPersister(persistMediaBytes) {
    this.persistMediaBytes = persistMediaBytes;
  }
  setAgentIdProvider(provider) {
    this.getAgentIdImpl = provider;
  }
  setMcp(mcp) {
    this.mcp = mcp;
  }
  setMcpManagement(mcpManagement) {
    this.mcpManagement = mcpManagement;
  }
  setMemoryStore(memoryStore) {
    this.memoryStore = memoryStore;
  }
  setUserMemory(userMemory) {
    this.userMemory = userMemory;
  }
  setMemorySnapshotStore(memorySnapshots) {
    this.memorySnapshots = memorySnapshots;
  }
  setProfilePromptSnapshotStore(profilePromptSnapshots) {
    this.profilePromptSnapshots = profilePromptSnapshots;
    this.systemPromptAssembly.resetProfileSnapshotFallback();
  }
  setEpisodeProgress(episodeProgress) {
    this.episodeProgress = episodeProgress;
  }
  setAutomationStore(automationStore) {
    if (this.automationStore === automationStore) return;
    this.automationStore = automationStore;
    this.promptGlue.resetAutomationStatusReminder();
  }
  enqueueAutomationCompletion(completion) {
    this.automationCompletions?.enqueue(completion);
  }
  setSkillStore(skillStore) {
    this.skillStore = skillStore;
  }
  setChannelStore(channelStore) {
    this.channelStore = channelStore;
  }
  setBackgroundSubagentHandler(handler) {
    this.subagents.setBackgroundSubagentHandler(handler);
  }
  setBackgroundSubagentDispatchHandler(handler) {
    this.subagents.setBackgroundSubagentDispatchHandler(handler);
  }
  runAutomationAsSubagent(args) {
    return this.turnAgentComposition.dispatchAutomationSubagent(args);
  }
  setComputerUseUsageHandler(handler) {
    this.onComputerUseUsage = handler;
  }
  setSubagentStallHandler(handler) {
    this.onSubagentStalled = handler;
  }
  setSubagentEventHandler(handler) {
    this.subagents.setSubagentEventHandler(handler);
  }
  setPersistedCheckpointHandler(handler) {
    this.persistedCheckpointHandler = handler;
  }
  setBackgroundShellHandler(handler) {
    this.onBackgroundShellSettled = handler;
  }
  setPendingWakeArmedHandler(handler) {
    this.onPendingWakeArmed = handler;
  }
  setPendingWakeDisarmedHandler(handler) {
    this.onPendingWakeDisarmed = handler;
  }
  getPendingCloudAgentWatchBcIds() {
    return this.backgroundWatches.pendingCloudAgentWatchBcIds();
  }
  hasRunningBackgroundShellWork() {
    return this.backgroundWatches.hasRunningBackgroundShellWork();
  }
  cancelBackgroundShellRewatches() {
    this.backgroundWatches.cancelBackgroundShellRewatches();
  }
  listRunningSubagents() {
    return (this.subagentOwnership ?? this.subagents).listRunningSubagents();
  }
  getRunningSubagent(subagentAgentId) {
    return (this.subagentOwnership ?? this.subagents).getRunningSubagent(subagentAgentId);
  }
  steerSubagent(subagentAgentId, message) {
    return (this.subagentOwnership ?? this.subagents).steerSubagent(subagentAgentId, message);
  }
  abortSubagent(subagentAgentId) {
    if (this.subagentOwnership !== void 0) {
      return this.subagentOwnership.abortSubagent(subagentAgentId);
    }
    return this.subagents.abortSubagent({ subagentAgentId });
  }
  getComputerUseUsageSnapshot() {
    return this.computerUse.usageSnapshot();
  }
  listSubagents() {
    return this.subagents.listSubagents();
  }
  hasSubagent(subagentAgentId) {
    return this.subagents.hasSubagent(subagentAgentId);
  }
  hasRunningSubagents() {
    return this.subagents.hasRunningSubagents();
  }
  hasRunningBackgroundWork() {
    return this.subagents.hasRunningSubagents() || this.backgroundWatches.pendingCloudAgentWatchBcIds().length > 0 || this.backgroundWatches.hasRunningBackgroundShellWork();
  }
  async drainBackgroundWork() {
    await Promise.all([
      this.subagents.drainBackgroundSubagents(),
      this.backgroundWatches.drainCloudAgentWatches(),
      this.backgroundWatches.drainBackgroundShellWork()
    ]);
  }
  async abortBackgroundWork(reason) {
    this.interruptAll(reason);
    this.backgroundWatches.abortBackgroundShellWork();
    this.backgroundWatches.cancelCloudAgentWatches();
    await this.subagents.drainBackgroundSubagents();
  }
  getSubagentOutline(subagentAgentId) {
    return this.subagents.getSubagentOutline(subagentAgentId);
  }
  async getResolvedOutline() {
    try {
      const state = await deriveConversationStateFromStructure(
        this.ctx,
        this.getConversationState(),
        this.getBlobStore()
      );
      return deriveOutlineFromConversationState(state);
    } catch {
      return [];
    }
  }
  getTranscriptPath() {
    const folder = this.requestContext.resolve().transcriptsFolder;
    if (folder == null || folder.length === 0) return null;
    const id = this.getTranscriptId();
    const base = folder.endsWith("/") ? folder.slice(0, -1) : folder;
    return `${base}/${id}/${id}.jsonl`;
  }
  watchCloudAgent(bcId, options2) {
    this.backgroundWatches.watchCloudAgent(bcId, options2);
  }
  watchBackgroundShell(shellId, options2) {
    this.backgroundWatches.watchBackgroundShell(shellId, options2);
  }
  getPendingShellRewatchIds() {
    return this.backgroundWatches.pendingShellRewatchIds();
  }
  reset() {
    this.state = new ConversationStateStructure();
    this.autoReviewController?.expire("session_end");
    this.subagents.reset();
    this.observation.emitAsyncTasksChanged();
    this.promptGlue.resetAutomationStatusReminder();
    this.runGeneration++;
  }
  setTurnAwaitHandler(handler) {
    this.observation.setTurnAwaitHandler(handler);
  }
  setTurnRetryHandler(handler) {
    this.observation.setTurnRetryHandler(handler);
  }
  setFirstTokenHandler(handler) {
    this.observation.setFirstTokenHandler(handler);
  }
  setSendDispatchHandler(handler) {
    this.observation.setSendDispatchHandler(handler);
  }
  setToolCallDiagnosticHandler(handler) {
    this.observation.setToolCallDiagnosticHandler(handler);
  }
  setAsyncTasksEventHandler(handler) {
    this.observation.setAsyncTasksEventHandler(handler);
  }
  listAsyncTasks() {
    return this.observation.listAsyncTasks();
  }
  getActivitySnapshot() {
    return this.observation.getActivitySnapshot();
  }
  getObservedToolCallCount() {
    return this.observation.getObservedToolCallCount();
  }
  getObservedToolCallNames() {
    return this.observation.getObservedToolCallNames();
  }
  emitRunLifecycle(event) {
    this.onRunLifecycle?.(event);
  }
  getConversationState() {
    return this.agentStore?.getConversationStateStructure() ?? this.state;
  }
  frozenToolDescriptionSnapshots() {
    return this.gates.frozenToolDescriptions() ? this.toolDescriptionSnapshots : void 0;
  }
  toolNotesInSystemPrompt() {
    const hasUserFacingChat = !this.isSubagentRunner || this.isAutomationSubagent && !this.isParentMediatedAutomationSubagent;
    return hasUserFacingChat && this.frozenToolDescriptionSnapshots() !== void 0;
  }
  renderToolNotesSection(resolveSecretRequestTarget) {
    if (!this.toolNotesInSystemPrompt()) return null;
    return renderSendToUserToolNotes({
      resolveSecretRequestTarget,
      chromeCookieImport: this.gates.chromeCookieImport(),
      boxEgressTunnel: this.gates.boxEgressTunnel()
    });
  }
  getBlobStore() {
    return this.agentStore?.getBlobStore() ?? this.fallbackBlobStore;
  }
  async createAutoReviewConversationState(ctx) {
    const privacyMode = await this.inference.resolvePrivacyMode();
    const structure = ConversationStateStructure.fromBinary(this.getConversationState().toBinary());
    return await ConversationStateHandle.fromConversationStateStructure(
      ctx,
      this.getBlobStore(),
      toRedactedConversationStateStructure(structure, privacyMode),
      new BaseRedactedPromptBuilder(),
      {
        shouldUseFormatCodeblock: false,
        gpt5StyleLineNumbers: false,
        gpt5CodexCatN: false,
        enableLineNumbers: true
      },
      void 0,
      void 0,
      { loadRootPromptBlobs: false }
    );
  }
  async wouldRecoverViaPrepend(recentUserMessages, currentMessageId, messageId) {
    try {
      const { lastUserMessageId, hasUserTurn } = await findConfirmedUserTurnWatermark(
        this.shellWatchHost(),
        this.getConversationState()
      );
      return selectUnconfirmedUserMessages({
        recentUserMessages,
        currentMessageId,
        lastTurnUserMessageId: lastUserMessageId,
        hasConfirmedTurns: hasUserTurn
      }).some((message) => message.id === messageId);
    } catch {
      return false;
    }
  }
  getConversationId() {
    return this.getAgentIdImpl?.() ?? this.agentStore?.getId() ?? this.fallbackConversationId;
  }
  resolveBoxId() {
    return this.getBoxIdImpl?.() ?? this.getConversationId();
  }
  get isComputerUseSubagent() {
    return this.isSubagentRunner && isComputerUseSubagentType(this.subagentType);
  }
  get isBrowserUseSubagent() {
    return this.isSubagentRunner && isBrowserUseSubagentType(this.subagentType);
  }
  get isBoxScopedSubagent() {
    return this.isComputerUseSubagent || this.isBrowserUseSubagent;
  }
  get browserOperationHarness() {
    if (this.metricsHarness === void 0) return "unavailable";
    return BROWSER_OPERATION_HARNESS2[this.metricsHarness];
  }
  resolveBoxTerminalsFolder() {
    return boxTerminalsFolder(this.remoteBox) ?? this.remoteBoxTerminalsFolder;
  }
  resolveBoxBrowser() {
    const windowIndex = boxAgentWindowIndex(this.remoteBox, this.resolveBoxId());
    if (windowIndex === void 0) return null;
    return {
      display: `:${windowIndex}`,
      cdpUrl: `http://127.0.0.1:${BOX_CDP_PORT_BASE4 + windowIndex}`
    };
  }
  remoteBoxResourceHost() {
    return {
      remoteBox: this.remoteBox,
      computerUse: this.computerUse,
      autoReviewGate: this.autoReviewGate,
      autoReviewClassifierExecutor: this.autoReviewClassifierExecutor,
      preparedRemoteBoxConnection: this.preparedRemoteBoxConnection,
      remoteBoxHasDesktop: this.remoteBoxHasDesktop,
      readManagedSkill: this.readManagedSkill,
      onManagedSkillRead: this.onManagedSkillRead,
      setRemoteBoxTerminalsFolder: (folder) => {
        this.remoteBoxTerminalsFolder = folder;
      },
      resolveBoxId: () => this.resolveBoxId(),
      getConversationId: () => this.getConversationId(),
      actionAuditor: this.actionAuditor,
      probeNavigationAfterComputerUse: (turnCtx, connection) => this.probeNavigationAfterComputerUse(turnCtx, connection)
    };
  }
  shellWatchHost() {
    return {
      ctx: this.ctx,
      box: this.box,
      getConversationId: () => this.getConversationId(),
      getConversationState: () => this.getConversationState(),
      getBlobStore: () => this.getBlobStore(),
      getConfirmedUserTurnWatermarkCache: () => decodeConfirmedUserTurnWatermark(this.confirmedUserTurnWatermarkStore?.read()) ?? this.confirmedUserTurnWatermarkCache,
      setConfirmedUserTurnWatermarkCache: (cache3) => {
        this.confirmedUserTurnWatermarkCache = cache3;
        this.confirmedUserTurnWatermarkStore?.write(encodeConfirmedUserTurnWatermark(cache3));
      }
    };
  }
  createRemoteBoxResourceAccessor() {
    return createRemoteBoxResourceAccessor(this.remoteBoxResourceHost());
  }
  getComputerUseAuditActionCounts() {
    return this.computerUse.auditActionCounts();
  }
  probeNavigationAfterComputerUse(turnCtx, connection) {
    this.computerUse.getOrCreateNavigationProbe()?.probe(turnCtx.withDetached(), connection.remoteAccessor, connection.windowIndex ?? 1);
  }
  async drainNavigationAudit(timeoutMs = 1e4) {
    const probe = this.computerUse.getOrCreateNavigationProbe();
    if (probe == null) return;
    await Promise.race([
      probe.flush().catch((error42) => {
        process.stderr.write(
          `sand.turn.navigation_audit_drain_failed error_class=${errorLogTag(error42)}
`
        );
      }),
      delay3(timeoutMs)
    ]);
    probe.abandonPendingReports();
  }
  emitUpdate(update, updateObservers) {
    updateObservers?.noteUpdate(update);
    if (update.type === "tool-call") {
      this.observation.recordToolActivity(update);
    }
    if (this.isComputerUseSubagent && update.type === "turn-ended") {
      this.computerUse.recordTurnEnded(update.usage);
    }
    this.transport?.onUpdate(update);
    if (this.transport !== void 0) {
      updateObservers?.noteDelivered(update);
    }
    if (update.type === "react-to-message" && this.transport?.lastReactionApplied?.() === true) {
      updateObservers?.noteReactionApplied();
    }
  }
  interrupt(reason, supersede) {
    return this.runShell.interrupt(reason, supersede);
  }
  requestPauseForUpgrade() {
    this.runShell.requestPauseForUpgrade();
    this.autoReviewController?.expireForHostPause();
    for (const cancel of [...this.pauseMcpCallCancellers]) {
      cancel();
    }
    this.pauseMcpCallCancellers.clear();
  }
  isPausingForUpgrade() {
    return this.runShell.isPausingForUpgrade();
  }
  cancelPauseForUpgrade() {
    this.runShell.cancelPauseForUpgrade();
    this.autoReviewController?.cancelHostPause();
  }
  interruptAll(reason) {
    return this.runShell.interruptAll(reason);
  }
  drainBackgroundSubagents() {
    return this.subagents.drainBackgroundSubagents();
  }
  run(prompt, options2 = {}) {
    if (!this.isSubagentRunner) this.combinedComputerUse.reset();
    return this.runShell.run(prompt, options2);
  }
  getLastParentTurnPrompt() {
    return this.lastParentTurnPrompt;
  }
  hasSummarySinceLastParentCall() {
    const state = this.getConversationState();
    return this.summaryLifecycle.hasUnsettledOrPersistedSince(this.lastParentTurnPrompt, state);
  }
  onSummaryLifecycle(listener) {
    return this.summaryLifecycle.listen(listener);
  }
  compactIdle(options2) {
    return startIdleCompaction(this, options2);
  }
  steer(prompt, options2 = {}) {
    return this.runShell.steer(prompt, options2);
  }
  noteMcpToolDiscoveryFailed(_error) {
    this.mcpDiscoveryUnavailableForTurn = true;
  }
  stampInheritableRunAttributes(runCtx, inferenceRequestId, turnType) {
    try {
      runCtx = withInheritableAttribute(runCtx, "sand.conversation_id", this.getConversationId());
      runCtx = withInheritableAttribute(runCtx, "sand.request_id", inferenceRequestId);
      runCtx = withInheritableAttribute(runCtx, "sand.turn_type", turnType);
      if (this.isSubagentRunner && this.subagentType != null) {
        runCtx = withInheritableAttribute(runCtx, "sand.subagent_type", this.subagentType);
      }
    } catch (error42) {
      process.stderr.write(
        `sand.turn.run_attribute_stamp_failed error_class=${errorLogTag(error42)}
`
      );
    }
    return runCtx;
  }
  stampCallerTurnRootRequestId(span, inferenceRequestId) {
    try {
      span.setAttribute("sand.request_id", inferenceRequestId);
    } catch (error42) {
      process.stderr.write(
        `sand.turn.caller_span_attribute_failed error_class=${errorLogTag(error42)}
`
      );
    }
  }
  getTranscriptId() {
    return this.subagentTranscriptId ?? this.getConversationId();
  }
};
