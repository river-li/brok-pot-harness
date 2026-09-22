/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/summarization-tool-context.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();

// @recovered-fragment 2/2
var logger63 = createLogger("@anysphere/agent:summarization-tool-context");
function resolveWriteBarrierTimeoutMs(config2) {
  return config2.resolveWriteBarrierTimeoutMs?.() ?? config2.featureFlags?.writeBarrierTimeoutMs;
}
function hasAutoRunInstructions(instructions) {
  return instructions !== void 0 && (instructions.allowInstructions.length > 0 || instructions.blockInstructions.length > 0);
}
async function loadUserPermissionsFileAutoRunInstructions(ctx) {
  try {
    const provider = await PermissionsFileProvider.load();
    const instructions = provider?.getAutoRunInstructions();
    const result = hasAutoRunInstructions(instructions) ? instructions : void 0;
    return result;
  } catch (error42) {
    logger63.warn(ctx, "Failed to load user permissions auto-run instructions", {
      error: error42 instanceof Error ? error42.message : String(error42)
    });
    return void 0;
  }
}
function getUserPermissionsFileAutoRunInstructions(ctx, config2, requestContext) {
  if (!config2.smartModeClassifierMode && !config2.smartModeClassifierShadowMode) {
    return Promise.resolve(void 0);
  }
  const { userAutoRunInstructions, hasAdminOverride } = smartModeAutoRunInstructionsFromProtos(requestContext);
  if (hasAdminOverride) {
    return Promise.resolve(void 0);
  }
  if (userAutoRunInstructions !== void 0) {
    return Promise.resolve(userAutoRunInstructions);
  }
  return loadUserPermissionsFileAutoRunInstructions(ctx);
}
function getProjectPermissionsFileAutoRunInstructions(requestContext) {
  const { projectAutoRunInstructions } = smartModeAutoRunInstructionsFromProtos(requestContext);
  return projectAutoRunInstructions;
}
async function buildSummarizationToolContext(args) {
  const { ctx, config: config2, stateHandler, requestContext } = args;
  const toolsBuildStartMs = performance.now();
  const toolSetHandle = args.toolsGenerator({
    resourceAccessor: args.resourceAccessor,
    stateHandler,
    agentSessionId: config2.agentSessionId,
    mcpTools: args.mcpTools,
    repositoryInfos: args.repositoryInfos,
    blobStore: stateHandler.getBlobStore(),
    mode: args.mode,
    loggingContext: ctx,
    requestContext,
    fileOperationLockManager: args.fileOperationLockManager,
    smartModeClassifierMode: config2.smartModeClassifierMode,
    smartModeClassifierShadowMode: config2.smartModeClassifierShadowMode,
    autoRejectFirstAskQuestion: config2.autoRejectFirstAskQuestion
  });
  ctx.get(cloudAgentTurnPrepGlueMsRecorderKey)?.("toolsBuildMs", performance.now() - toolsBuildStartMs);
  const tools = toolSetHandle.getStaticTools();
  const userAutoRunInstructions = await getUserPermissionsFileAutoRunInstructions(ctx, config2, requestContext);
  const projectAutoRunInstructions = getProjectPermissionsFileAutoRunInstructions(requestContext);
  const extraT = {
    repositoryInfos: args.repositoryInfos,
    shouldQueryProd: requestContext.repositoryInfoShouldQueryProd,
    stateHandler,
    modelVendor: config2.modelInfo?.vendor,
    enableToolArgPreservation: config2.enableToolArgPreservation === true,
    enableHookAdditionalContext: config2.featureFlags?.enableHookAdditionalContext === true,
    enableAgentStoreConflictNoticeCollector: config2.featureFlags?.enableAgentStoreConflictNotices === true,
    enableAgentStoreConflictNotices: config2.featureFlags?.enableAgentStoreConflictNotices === true,
    writeBarrierTimeoutMs: resolveWriteBarrierTimeoutMs(config2),
    onWriteBarrier: config2.recordAgentStoreWriteBarrier,
    workspacePaths: requestContext.env?.workspacePaths,
    userAutoRunInstructions,
    projectAutoRunInstructions,
    cursorRules: getAllRules(requestContext, config2.nonFileRules, config2.featureFlags),
    agentSkills: requestContext.agentSkills ?? [],
    contextInjectionSignal: args.contextInjectionSignal
  };
  return {
    tools,
    extraT,
    descriptionProps: toolSetHandle.getDescriptionProps(),
    toolSetHandle
  };
}

