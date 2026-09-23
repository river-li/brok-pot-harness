var BROWSER_OPERATION_HARNESS = { box: "BOX", temporal: "TEMPORAL" };
var WINDOW_INDEX_RETRY = createRetryPolicy({
  name: "sand-browser-use-jev-window",
  maxAttempts: 8,
  initialDelayMs: 4e3,
  maxDelayMs: 4e3,
  jitter: "none"
});
function createJevBrowserSubagentRunner(options2) {
  if (options2.isSubagent !== true || !isBrowserUseJevSubagentType(options2.subagentType)) {
    return void 0;
  }
  const deps = options2.jevBrowserUse;
  if (deps === void 0) {
    throw new Error(
      "browserUseJev subagent dispatched to a worker without jev browser-use deps (TypeSafe client); refusing to run it as a general agent"
    );
  }
  const conversationId = options2.getAgentId?.() ?? options2.agentStore?.getId();
  const agentId = options2.subagentTranscriptId ?? conversationId;
  if (agentId === void 0 || agentId === null) {
    throw new Error("browserUseJev subagent needs an agent id for its box window");
  }
  const remoteBox = options2.remoteBox;
  const metricsHarness = options2.metricsHarness;
  const boxId = options2.getBoxId?.() ?? conversationId ?? agentId;
  const resolveWindowIndex = (ctx) => WINDOW_INDEX_RETRY.runWithRetry(async () => {
    await remoteBox.ensureReady(ctx, agentId);
    const windowIndex = boxAgentWindowIndex(remoteBox, agentId);
    if (windowIndex === void 0) {
      throw new Error(`no box window assigned to ${agentId} yet`);
    }
    return windowIndex;
  });
  const reviewMode = options2.autoReviewModes?.computer ?? "off";
  const autoReview = reviewMode === "off" ? void 0 : {
    mode: reviewMode,
    agentId,
    boxIdentity: {
      boxId,
      windowGeneration: `${options2.autoReviewController?.hostGeneration ?? "host"}:${boxId}`
    },
    resolveDisplayNumber: resolveWindowIndex,
    autoReviewController: options2.autoReviewController,
    getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(options2.requestSource),
    personalInstructions: options2.getAutoReviewInstructions?.()
  };
  return new JevBrowserSubagentRunner({
    subagentAgentId: agentId,
    ...conversationId == null ? {} : { conversationGroupId: conversationId },
    createDriver: async (ctx) => {
      const connection = await remoteBox.ensureReady(ctx, agentId);
      const classifier = options2.autoReviewClassifierExecutor;
      const resourceAccessor = autoReview === void 0 || classifier === void 0 ? connection.remoteAccessor : new CombinedResourceAccessor(connection.remoteAccessor, [
        resourceEntry(smartModeClassifierExecutorResource, classifier)
      ]);
      return new SandBrowserDriver({
        harness: metricsHarness === void 0 ? "unavailable" : BROWSER_OPERATION_HARNESS[metricsHarness],
        reportBrowserOperation: (report) => options2.browserTelemetry?.reportBrowserOperation(report),
        resourceAccessor,
        agentBox: remoteBox,
        getBoxId: () => boxId,
        getWindowIndex: resolveWindowIndex,
        ...autoReview === void 0 ? {} : { autoReview },
        getPersistImage: () => options2.persistImage,
        getDefaultViewId: () => agentId,
        isNavigationRecoveryEnabled: options2.gates.browserNavigationRecovery
      });
    },
    readBoxFile: (ctx, boxPath) => remoteBox.downloadFile(ctx, agentId, boxPath),
    releaseWindow: (ctx) => remoteBox.releaseWindow?.(ctx, agentId) ?? Promise.resolve(),
    typeSafe: deps.typeSafe,
    inference: options2.inference,
    modelId: deps.modelId,
    ...options2.loggerBackend === void 0 ? {} : { loggerBackend: options2.loggerBackend },
    ...options2.metricsBackend === void 0 ? {} : { metricsBackend: options2.metricsBackend },
    emit: (update) => options2.transport?.onUpdate(update),
    ...options2.agentStore === void 0 ? {} : { agentStore: options2.agentStore, blobStore: options2.agentStore.getBlobStore() }
  });
}
