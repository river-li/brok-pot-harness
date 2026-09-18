var import_node_path84 = __toESM(require("node:path"), 1);
init_dist3();
init_agent_pb();
init_read_exec_pb();
init_request_context_exec_pb();
init_selected_context_pb();
init_subagents_pb();
var import_mime_types2 = __toESM(require_mime_types(), 1);
var logger71 = createLogger("task-subagent-preparation");
function isExecutedChildState(state) {
  return (state.cloudSubagent?.bcId?.trim() ?? "") !== "" || (state.firstClassBcId?.trim() ?? "") !== "" || (state.modelId?.trim() ?? "") !== "";
}
function protoEnvironmentToTaskEnvironment(environment) {
  switch (environment) {
    case SubagentExecutionEnvironment.CLOUD:
      return "cloud";
    case SubagentExecutionEnvironment.LOCAL:
      return "local";
    default:
      return void 0;
  }
}
function getEffectiveSubagentEnvironment(rawArgs, restoredState) {
  if (rawArgs.machine !== void 0) {
    return targetMachineToEnvironment(rawArgs.machine);
  }
  const requestedEnvironment = taskEnvironmentToProto(rawArgs.environment);
  if (requestedEnvironment !== SubagentExecutionEnvironment.UNSPECIFIED) {
    return requestedEnvironment;
  }
  const restoredMachine = targetMachineFromProto(restoredState?.machine);
  if (restoredMachine !== void 0) {
    return targetMachineToEnvironment(restoredMachine);
  }
  if (restoredState?.environment === SubagentExecutionEnvironment.CLOUD) {
    return SubagentExecutionEnvironment.CLOUD;
  }
  if (restoredState?.environment === SubagentExecutionEnvironment.LOCAL) {
    return SubagentExecutionEnvironment.LOCAL;
  }
  if (restoredState?.cloudSubagent !== void 0) {
    return SubagentExecutionEnvironment.CLOUD;
  }
  return SubagentExecutionEnvironment.UNSPECIFIED;
}
function resolveCanonicalSubagentId(parentState, subagentIdOrBcId) {
  return parentState.resolveSubagentId?.(subagentIdOrBcId) ?? subagentIdOrBcId;
}
var VIDEO_MIME_MAP = {
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  wmv: "video/x-ms-wmv",
  flv: "video/x-flv",
  m4v: "video/x-m4v"
};
function getVideoMimeTypeFromPath(filePath) {
  const ext2 = filePath.split(".").pop()?.toLowerCase();
  return ext2 ? VIDEO_MIME_MAP[ext2] : void 0;
}
function getPotentialVideoMimeTypeFromPath(filePath) {
  const mappedMime = getVideoMimeTypeFromPath(filePath);
  if (mappedMime !== void 0) {
    return mappedMime;
  }
  const lookupMime = (0, import_mime_types2.lookup)(filePath);
  return typeof lookupMime === "string" && lookupMime.startsWith("video/") ? lookupMime : void 0;
}
async function buildClientSubagentAttachmentsContext(ctx, attachmentPaths, resourceAccessor, toolCallId, options2) {
  if (attachmentPaths.length === 0) {
    return void 0;
  }
  const videoPaths = [];
  const nonVideoPaths = [];
  for (const attachmentPath of attachmentPaths) {
    if (getPotentialVideoMimeTypeFromPath(attachmentPath) !== void 0) {
      videoPaths.push(attachmentPath);
      continue;
    }
    nonVideoPaths.push(attachmentPath);
  }
  const selectedContext = (nonVideoPaths.length > 0 ? await processAttachments(ctx, nonVideoPaths, resourceAccessor, toolCallId, options2) : void 0) ?? new SelectedContext();
  if (videoPaths.length === 0) {
    return selectedContext;
  }
  const requestContext = await getRequestContextForAttachmentValidation({
    ctx,
    resourceAccessor
  });
  const resolvedModelId = options2?.resolvedModelId?.trim();
  if (resolvedModelId !== void 0 && resolvedModelId.length > 0 && !isGeminiModelId(resolvedModelId)) {
    throw new Error("Video attachments are only supported for Gemini models");
  }
  const selectedVideos = [...selectedContext.selectedVideos ?? []];
  for (const rawFilePath of videoPaths) {
    const filePath = resolveTrustedAttachmentPath({
      attachmentPath: rawFilePath,
      requestContext,
      userAttachedVideoPaths: options2?.userAttachedVideoPaths,
      trustedVideoAttachmentRoots: options2?.trustedVideoAttachmentRoots
    });
    if (filePath === void 0) {
      throw untrustedAttachmentPathError(rawFilePath);
    }
    const mimeType = getPotentialVideoMimeTypeFromPath(filePath);
    if (mimeType === void 0) {
      throw new Error(`Could not detect mime type for attachment: ${filePath}`);
    }
    selectedVideos.push(new SelectedVideo({
      uuid: generateSeededUuid(`video-${toolCallId}-${filePath}`),
      path: filePath,
      mimeType,
      filename: import_node_path84.default.basename(filePath),
      fps: 4
    }));
  }
  return new SelectedContext({
    ...selectedContext,
    selectedVideos
  });
}
function isPathWithinPrefix2(args) {
  const resolvedTarget = import_node_path84.default.resolve(args.targetPath);
  const resolvedPrefix = import_node_path84.default.resolve(args.prefix);
  return resolvedTarget === resolvedPrefix || resolvedTarget.startsWith(resolvedPrefix + import_node_path84.default.sep);
}
function untrustedAttachmentPathError(attachmentPath) {
  return new Error(`Attachment path is not trusted: ${attachmentPath}. Only videos the user attached to this conversation, or files under this agent's own uploads/artifacts roots, can be passed in file_attachments \u2014 copying the file somewhere else, onto the user's computer especially, cannot make it trusted.`);
}
function resolveTrustedAttachmentPath(args) {
  const posixPath = import_node_path84.default.posix.normalize(args.attachmentPath);
  if ((args.trustedVideoAttachmentRoots ?? []).some(
    // A root that isn't an absolute directory is dropped rather than matched:
    // `""` or `"/"` would make the prefix `/` and trust every absolute path,
    // silently turning a malformed roots array into no trust check at all.
    (root) => root.startsWith("/") && root.length > 1 && posixPath.startsWith(`${root}/`)
  )) {
    return posixPath;
  }
  const canonicalPath = import_node_path84.default.resolve(args.attachmentPath);
  const env = args.requestContext.env;
  const allowedPrefixes = [
    ...env?.projectFolder ? [
      import_node_path84.default.join(env.projectFolder, "uploads"),
      import_node_path84.default.join(env.projectFolder, "attachments")
    ] : [],
    ...env?.workspacePaths.flatMap((workspacePath) => [
      import_node_path84.default.join(workspacePath, "uploads"),
      import_node_path84.default.join(workspacePath, "attachments")
    ]) ?? [],
    env?.artifactsFolder
  ].filter((prefix) => prefix !== void 0);
  if (allowedPrefixes.some((prefix) => isPathWithinPrefix2({ targetPath: canonicalPath, prefix }))) {
    return canonicalPath;
  }
  const userAttachedPaths = (args.userAttachedVideoPaths ?? []).map((attachedPath) => import_node_path84.default.resolve(attachedPath));
  if (userAttachedPaths.includes(canonicalPath)) {
    return canonicalPath;
  }
  return void 0;
}
async function getRequestContextForAttachmentValidation(args) {
  const requestContextExecutor = args.resourceAccessor.get(requestContextExecutorResource);
  const requestContextResult = await requestContextExecutor.execute(args.ctx, new RequestContextArgs());
  if (requestContextResult.result.case !== "success" || requestContextResult.result.value.requestContext === void 0) {
    throw new Error("Failed to validate attachment paths");
  }
  return requestContextResult.result.value.requestContext;
}
function isFreshGeminiVideoSubagentLaunch(args) {
  return !args.isResume && !args.isSelfForkRequested && isGeminiVideoSubagentType(args.subagentType);
}
function requireFileAttachmentsForFreshGeminiVideoSubagent(args) {
  if (!isFreshGeminiVideoSubagentLaunch(args)) {
    return;
  }
  if ((args.fileAttachments?.length ?? 0) > 0) {
    return;
  }
  throw new ToolCallArgParseError("A videoReview or watchVideo launch requires at least one path in file_attachments. A path written in the prompt is not an attachment; call again with the file in file_attachments.");
}
function requireSelectedVideoForFreshGeminiVideoSubagent(args) {
  if (!isFreshGeminiVideoSubagentLaunch(args)) {
    return;
  }
  if ((args.selectedVideos?.length ?? 0) > 0) {
    return;
  }
  throw new ToolCallArgParseError("A videoReview or watchVideo launch requires a video/* attachment. Image-only or undetected attachments are not enough.");
}
async function processAttachments(ctx, attachmentPaths, resourceAccessor, toolCallId, options2) {
  if (attachmentPaths.length === 0)
    return void 0;
  const hasVideoAttachment = attachmentPaths.some((attachmentPath) => getPotentialVideoMimeTypeFromPath(attachmentPath) !== void 0);
  const requestContext = options2?.skipTrustedPathValidation === true || !hasVideoAttachment ? void 0 : await getRequestContextForAttachmentValidation({
    ctx,
    resourceAccessor
  });
  const readExecutor = resourceAccessor.get(readExecutorResource);
  const selectedImages = [];
  const selectedVideos = [];
  for (const rawFilePath of attachmentPaths) {
    const filePath = requestContext !== void 0 && getPotentialVideoMimeTypeFromPath(rawFilePath) !== void 0 ? resolveTrustedAttachmentPath({
      attachmentPath: rawFilePath,
      requestContext
    }) : rawFilePath;
    if (filePath === void 0) {
      throw untrustedAttachmentPathError(rawFilePath);
    }
    const execArgs = new ReadArgs({ path: filePath, toolCallId });
    const execResult = await readExecutor.execute(ctx, execArgs, {
      execId: generateSeededUuid(`${toolCallId}:${filePath}`)
    });
    if (execResult.result.case !== "success") {
      throw new Error(`Failed to read attachment: ${filePath}`);
    }
    const output = execResult.result.value.output;
    if (output.case !== "data") {
      throw new Error(`Attachment is not binary data: ${filePath}`);
    }
    const binaryData = output.value;
    const detectedImageMime = detectImageMimeType(binaryData, filePath);
    const videoMime = getPotentialVideoMimeTypeFromPath(filePath);
    const lookupMime = (0, import_mime_types2.lookup)(filePath);
    const mimeType = detectedImageMime ?? videoMime ?? (typeof lookupMime === "string" ? lookupMime : void 0);
    if (!mimeType) {
      throw new Error(`Could not detect mime type for attachment: ${filePath}`);
    }
    const outputBlobId = execResult.result.value.outputBlobId;
    const dataOrBlobId = outputBlobId && outputBlobId.length > 0 ? {
      case: "blobIdWithData",
      value: {
        blobId: new Uint8Array(outputBlobId),
        data: new Uint8Array(binaryData)
      }
    } : { case: "data", value: new Uint8Array(binaryData) };
    if (mimeType.startsWith("video/")) {
      const resolvedModelId = options2?.resolvedModelId?.trim();
      if (resolvedModelId !== void 0 && resolvedModelId.length > 0 && !isGeminiModelId(resolvedModelId)) {
        throw new Error("Video attachments are only supported for Gemini models");
      }
      const useSignedUrl = isSignedUrlStorageAllowed(options2?.privacyMode) && options2?.attachedMediaUrlProvider !== void 0;
      const maxVideoBytes = useSignedUrl ? options2?.useGeminiDeveloperVideoUpload === true && isGeminiVideoSubagentType(options2.subagentType) ? GEMINI_VIDEO_SUBAGENT_MAX_BYTES : options2?.signedUrlVideoMaxBytes ?? getSignedUrlVideoMaxBytes({}) : options2?.inlineVideoMaxBytes ?? getInlineVideoMaxBytes({});
      if (binaryData.length > maxVideoBytes) {
        throw new Error(`Video exceeds maximum size of ${maxVideoBytes} bytes (${Math.round(maxVideoBytes / 1024 / 1024)}MB)`);
      }
      if (useSignedUrl) {
        const conversationId = options2.conversationId ?? "";
        const signedUrls = await options2.attachedMediaUrlProvider.getSignedUrlForAttachedMedia(ctx, { conversationId, mimeType, contentLengthBytes: binaryData.length });
        await uploadAttachedMediaToSignedUrl({
          putUrl: signedUrls.putUrl,
          data: new Uint8Array(binaryData),
          mimeType,
          signal: ctx.signal
        });
        selectedVideos.push(new SelectedVideo({
          dataOrBlobId: {
            case: "signedUrl",
            value: new SelectedVideo_SignedUrl({
              url: signedUrls.getUrl,
              key: signedUrls.key,
              expiresAtUnixMs: signedUrls.expiresAtUnixMs,
              refreshAfterUnixMs: signedUrls.refreshAfterUnixMs,
              conversationId
            })
          },
          uuid: generateSeededUuid(`video-${filePath}`),
          path: filePath,
          mimeType,
          fps: 4
        }));
        continue;
      }
      selectedVideos.push(new SelectedVideo({
        dataOrBlobId,
        uuid: generateSeededUuid(`video-${filePath}`),
        path: filePath,
        mimeType,
        fps: 4
      }));
    } else if (mimeType.startsWith("image/")) {
      selectedImages.push(new SelectedImage({
        dataOrBlobId,
        uuid: generateSeededUuid(`image-${filePath}`),
        path: filePath,
        mimeType
      }));
    } else {
      throw new Error(`Attachment must be image/* or video/*; got ${mimeType} for ${filePath}`);
    }
  }
  if (selectedImages.length === 0 && selectedVideos.length === 0) {
    return void 0;
  }
  return new SelectedContext({ selectedImages, selectedVideos });
}
async function resolveSubagentConversationState(ctx, subagentConfig, parentState, subagentIdToResume, isSelfForkRequested, toolCallId, typeName) {
  if (isSelfForkRequested) {
    return await parentState.getConversationState(ctx);
  }
  if (subagentIdToResume) {
    const restoredState = parentState.restoreSubagentState(ctx, subagentIdToResume);
    if (restoredState?.conversationState) {
      logger71.info(ctx, "Restored subagent conversation state", {
        toolCallId,
        subagentType: typeName,
        subagentIdToResume,
        turnsCount: restoredState.conversationState.turns.length
      });
      return restoredState.conversationState;
    }
    if (restoredState?.cloudSubagent !== void 0) {
      return new ConversationStateStructure();
    }
    logger71.info(ctx, "Created new conversation state (restore failed)", {
      toolCallId,
      subagentType: typeName
    });
  }
  return applyConversationStateMapping(subagentConfig, await parentState.getConversationState(ctx));
}
async function isPriorSubagentModelUsable(modelId, options2) {
  if (options2.isModelBlocked(modelId)) {
    return false;
  }
  if (options2.requiresMaxMode === void 0) {
    return true;
  }
  const modelRequiresMaxMode = await options2.requiresMaxMode(modelId);
  return options2.parentMaxMode || !modelRequiresMaxMode;
}
async function resolveTaskSubagentConfig(params) {
  const { ctx, rawArgs, meta, subagentConfigs, parentState, parentModelInfo, options: options2 } = params;
  const defaultConfig = findSubagentConfigByName(subagentConfigs, GENERAL_PURPOSE_SUBAGENT_TYPE) ?? subagentConfigs[0];
  const requestedSubagentConfig = rawArgs.subagent_type !== void 0 ? findSubagentConfigByName(subagentConfigs, rawArgs.subagent_type) ?? (params.reattachOnly === true ? findSubagentConfigByName(params.resumeOnlySubagentConfigs ?? [], rawArgs.subagent_type) : void 0) ?? defaultConfig : defaultConfig;
  const effectiveResumeMode = requestedSubagentConfig.resumeModeOverride ?? SubagentResumeMode.DEFAULT;
  const requestedTypeName = getSubagentTypeName(requestedSubagentConfig.subagent_type);
  const subagentRequestId = computeSubagentRequestId(meta.toolCallId);
  const isSelfForkRequested = isResumeSelfForkRequest(rawArgs.resume);
  let subagentIdToResume;
  if (!isSelfForkRequested) {
    if (effectiveResumeMode !== SubagentResumeMode.DEFAULT) {
      subagentIdToResume = parentState.getSubagentIdToResume(requestedTypeName, effectiveResumeMode);
    } else if (rawArgs.resume) {
      subagentIdToResume = resolveCanonicalSubagentId(parentState, rawArgs.resume);
    }
  }
  const restoredSubagentState = subagentIdToResume !== void 0 ? parentState.restoreSubagentState(ctx, subagentIdToResume) : void 0;
  const persistedSubagentType = restoredSubagentState?.subagentType;
  const persistedTypeName = persistedSubagentType?.type.case !== void 0 ? getSubagentTypeName(persistedSubagentType) : void 0;
  const isExplicitResume = subagentIdToResume !== void 0 && effectiveResumeMode === SubagentResumeMode.DEFAULT;
  if (isExplicitResume && persistedTypeName === void 0 && restoredSubagentState !== void 0 && isExecutedChildState(restoredSubagentState)) {
    throw new ToolCallArgParseError("This child's subagent type was not persisted, so it cannot be resumed. Start a new subagent of the original type; this resume cannot continue.");
  }
  if (persistedTypeName === void 0 && params.reattachOnly !== true && rawArgs.subagent_type !== void 0 && findSubagentConfigByName(params.resumeOnlySubagentConfigs ?? [], rawArgs.subagent_type) !== void 0) {
    throw new ToolCallArgParseError("A retired subagent type requires a known persisted child to resume.");
  }
  const persistedSubagentConfig = persistedTypeName !== void 0 ? findSubagentConfigByName(subagentConfigs, persistedTypeName) ?? findSubagentConfigByName(params.resumeOnlySubagentConfigs ?? [], persistedTypeName) : void 0;
  if (persistedTypeName !== void 0 && persistedSubagentConfig === void 0) {
    throw new ToolCallArgParseError(`Cannot resume subagent of type "${persistedTypeName}" because that subagent type is not available.`);
  }
  if (isExplicitResume && persistedTypeName !== void 0 && rawArgs.subagent_type !== void 0 && normalizeSubagentTypeName(rawArgs.subagent_type) !== normalizeSubagentTypeName(persistedTypeName)) {
    throw new ToolCallArgParseError(`Cannot resume a "${persistedTypeName}" subagent as "${rawArgs.subagent_type}".`);
  }
  const subagentConfig = persistedSubagentConfig ?? requestedSubagentConfig;
  const effectiveReadonly = getEffectiveReadonlyForSubagent(subagentConfig);
  const useAskMode = shouldUseAskModeForSubagent(effectiveReadonly, subagentConfig);
  const typeName = getSubagentTypeName(subagentConfig.subagent_type);
  const analyticsSubagentType = subagentConfig.subagent_type.type.case === "custom" ? "custom" : typeName;
  const effectiveEnvironment = getEffectiveSubagentEnvironment(rawArgs, restoredSubagentState);
  const requestedTargetMachine = rawArgs.machine ?? targetMachineFromProto(restoredSubagentState?.machine) ?? (effectiveEnvironment === SubagentExecutionEnvironment.CLOUD ? targetMachineFromLegacyArgs({
    environment: "cloud",
    cloud_base_branch: rawArgs.cloud_base_branch,
    cloud_requested_environment_build_id: rawArgs.cloud_requested_environment_build_id
  }) : { type: "same_machine" });
  const priorModelId = isSelfForkRequested ? options2.parentRequestedModelName ?? parentModelInfo.modelName : restoredSubagentState?.modelId?.trim() || void 0;
  if (priorModelId !== void 0 && options2.subagentModelForcePolicy === SubagentModelForcePolicy.ParentPin && options2.forceModelId !== void 0 && priorModelId !== options2.forceModelId) {
    throw new ToolCallArgParseError(`Cannot resume subagent with model "${priorModelId}" because the active policy requires model "${options2.forceModelId}".`);
  }
  const resolvedModelId = priorModelId !== void 0 ? priorModelId : await resolveSubagentModel({
    subagentConfig,
    forceModelId: options2.forceModelId,
    subagentModelForcePolicy: options2.subagentModelForcePolicy,
    requestedModel: rawArgs.model,
    parentModelId: options2.parentRequestedModelName ?? parentModelInfo.modelName,
    enableExploreParentModelInheritance: options2.enableExploreParentModelInheritance,
    parentMaxMode: options2.parentMaxMode,
    subagentModels: options2.subagentModels,
    isModelBlocked: options2.isModelBlocked,
    isModelValid: options2.isModelValid,
    requiresMaxMode: options2.requiresMaxMode,
    compareModelCosts: options2.compareModelCosts,
    logContext: {
      ctx,
      parentAgentToolCallId: meta.toolCallId,
      subagentRequestId
    }
  });
  if (priorModelId !== void 0 && !await isPriorSubagentModelUsable(priorModelId, options2)) {
    throw new ToolCallArgParseError(`Cannot resume subagent with model "${priorModelId}" because it is blocked or unavailable.`);
  }
  const subagentId = subagentIdToResume ?? generateSeededUuid(`subagent-${typeName}-${meta.toolCallId}`);
  const isResume = subagentIdToResume !== void 0;
  const parentRequestId = getRequestId(ctx);
  const rootParentRequestId = getRootParentRequestId(ctx) ?? parentRequestId;
  const cloudSubagentBcId = restoredSubagentState?.cloudSubagent?.bcId?.trim() || restoredSubagentState?.firstClassBcId?.trim() || void 0;
  const cloudRequestedEnvironmentBuildId = requestedTargetMachine.type === "new_cloud_vm" ? requestedTargetMachine.environment_build_id?.trim() || rawArgs.cloud_requested_environment_build_id?.trim() || restoredSubagentState?.cloudRequestedEnvironmentBuildId?.trim() || void 0 : void 0;
  const effectiveTargetMachine = requestedTargetMachine.type === "new_cloud_vm" && cloudRequestedEnvironmentBuildId !== requestedTargetMachine.environment_build_id ? {
    ...requestedTargetMachine,
    ...cloudRequestedEnvironmentBuildId !== void 0 ? { environment_build_id: cloudRequestedEnvironmentBuildId } : {}
  } : requestedTargetMachine;
  const parentModelIdForParameters = options2.parentRequestedModelName ?? parentModelInfo.modelName;
  const resolvedModelParameters = resolvedModelId === parentModelIdForParameters && (options2.parentModelParameters?.length ?? 0) > 0 ? options2.parentModelParameters : void 0;
  return {
    subagentConfig,
    effectiveReadonly,
    useAskModeForSubagent: useAskMode,
    typeName,
    analyticsSubagentType,
    resolvedModelId,
    resolvedModelParameters,
    subagentIdToResume,
    subagentId,
    isResume,
    parentRequestId,
    rootParentRequestId,
    subagentRequestId,
    isSelfForkRequested,
    effectiveEnvironment,
    effectiveTargetMachine,
    cloudSubagentBcId,
    cloudRequestedEnvironmentBuildId
  };
}
async function prepareTaskSubagent(params) {
  const { resolved, ctx, rawArgs, meta, parentState, resourceAccessor, parentModelInfo, subagentCredentials, enableExecuteHookExec, configuredSteps, readonlyShellEnabled, toolName, parentCursorCommands, privacyMode, attachedMediaUrlProvider, geminiVideoAttachedMediaUrlProvider, inlineVideoMaxBytes, signedUrlVideoMaxBytes } = params;
  const { subagentConfig, typeName, resolvedModelId, subagentIdToResume, subagentId, isResume, isSelfForkRequested, useAskModeForSubagent: useAskMode, effectiveReadonly, analyticsSubagentType, parentRequestId, rootParentRequestId, subagentRequestId, cloudSubagentBcId, cloudRequestedEnvironmentBuildId } = resolved;
  logger71.info(ctx, "Task subagent preparation starting", {
    toolCallId: meta.toolCallId,
    subagentType: typeName,
    promptLength: rawArgs.prompt.length,
    parentModel: parentModelInfo.modelName,
    resolvedModel: resolvedModelId,
    subagentId
  });
  requireFileAttachmentsForFreshGeminiVideoSubagent({
    isResume,
    isSelfForkRequested,
    subagentType: subagentConfig.subagent_type,
    fileAttachments: rawArgs.file_attachments
  });
  let selectedContext;
  if (rawArgs.file_attachments && rawArgs.file_attachments.length > 0) {
    const useGeminiDeveloperVideoUpload = isGeminiVideoSubagentType(subagentConfig.subagent_type) && geminiVideoAttachedMediaUrlProvider !== void 0;
    selectedContext = await processAttachments(ctx, rawArgs.file_attachments, resourceAccessor, meta.toolCallId, {
      resolvedModelId,
      privacyMode,
      attachedMediaUrlProvider: isGeminiVideoSubagentType(subagentConfig.subagent_type) ? geminiVideoAttachedMediaUrlProvider ?? attachedMediaUrlProvider : attachedMediaUrlProvider,
      conversationId: getConversationId(ctx),
      inlineVideoMaxBytes,
      signedUrlVideoMaxBytes,
      subagentType: subagentConfig.subagent_type,
      useGeminiDeveloperVideoUpload,
      skipTrustedPathValidation: true
    });
  }
  requireSelectedVideoForFreshGeminiVideoSubagent({
    isResume,
    isSelfForkRequested,
    subagentType: subagentConfig.subagent_type,
    selectedVideos: selectedContext?.selectedVideos
  });
  if (parentCursorCommands !== void 0 && parentCursorCommands.length > 0) {
    selectedContext = selectedContext ?? new SelectedContext();
    selectedContext.cursorCommands = parentCursorCommands;
  }
  const initialAction = createUserMessageAction(
    subagentConfig,
    rawArgs.prompt,
    generateSeededUuid(meta.toolCallId),
    useAskMode,
    selectedContext,
    // The Task call runs in the parent's lane, so this is the parent's own
    // conversation id (bcId on cloud, composer id locally).
    getConversationId(ctx)
  );
  const conversationState = await resolveSubagentConversationState(ctx, subagentConfig, parentState, subagentIdToResume, isSelfForkRequested, meta.toolCallId, typeName);
  const shouldPersistSubagentCredentials = resolved.effectiveEnvironment !== SubagentExecutionEnvironment.CLOUD;
  const prepared = new PreparedTaskSubagent({
    subagentId,
    subagentTypeName: typeName,
    subagentType: subagentConfig.subagent_type,
    analyticsSubagentType,
    resolvedModelId,
    effectiveReadonly,
    useAskModeForSubagent: useAskMode,
    conversationState,
    initialAction,
    initialTurnsCount: conversationState.turns.length,
    subagentRequestId,
    cloudSubagentBcId,
    toolCallId: meta.toolCallId,
    isResume,
    parentRequestId,
    rootParentRequestId,
    taskPrompt: rawArgs.prompt,
    taskDescription: rawArgs.description,
    selectedContext,
    plugin: subagentConfig.plugin,
    marketplace: subagentConfig.marketplace,
    pluginId: subagentConfig.pluginId,
    marketplaceId: subagentConfig.marketplaceId,
    subagentSource: subagentConfig.subagentSource,
    rawArgs: new TaskToolCallArgsProto({
      description: rawArgs.description,
      prompt: rawArgs.prompt,
      model: rawArgs.model,
      subagentType: rawArgs.subagent_type,
      resume: rawArgs.resume,
      runInBackground: rawArgs.run_in_background,
      attachments: rawArgs.file_attachments ?? [],
      // Legacy scalars stay populated for older readers and in-flight Temporal
      // histories; `target` is the field new readers prefer.
      environment: resolved.effectiveEnvironment,
      cloudBaseBranch: rawArgs.cloud_base_branch ?? (resolved.effectiveTargetMachine.type === "new_cloud_vm" ? resolved.effectiveTargetMachine.base_branch : void 0),
      cloudRequestedEnvironmentBuildId,
      machine: targetMachineToProto(resolved.effectiveTargetMachine),
      interrupt: rawArgs.interrupt
    }),
    parentModelName: parentModelInfo.modelName,
    subagentCredentials: subagentCredentials && shouldPersistSubagentCredentials ? new SubagentCredentials({ credentials: subagentCredentials }) : void 0,
    resultSuffix: subagentConfig.resultSuffix,
    enableExecuteHookExec: enableExecuteHookExec ?? false,
    configuredSteps: configuredSteps ?? [],
    readonlyShellEnabled: readonlyShellEnabled ?? false,
    toolName: toolName ?? "Task",
    preparedTimestampUnixMs: BigInt(Date.now())
  });
  return prepared;
}
function buildPreparedTaskToolHookInput(prepared) {
  const raw = prepared.rawArgs;
  if (!raw) {
    return {
      description: void 0,
      prompt: void 0,
      model: void 0,
      resume: void 0,
      interrupt: void 0,
      environment: void 0,
      cloud_base_branch: void 0,
      cloud_requested_environment_build_id: void 0,
      machine: void 0,
      subagent_type: prepared.subagentTypeName,
      run_in_background: void 0,
      file_attachments: void 0
    };
  }
  return {
    description: raw.description,
    prompt: raw.prompt,
    model: raw.model,
    resume: raw.resume,
    interrupt: raw.interrupt,
    environment: protoEnvironmentToTaskEnvironment(raw.environment),
    cloud_base_branch: raw.cloudBaseBranch,
    cloud_requested_environment_build_id: raw.cloudRequestedEnvironmentBuildId,
    machine: targetMachineFromProto(raw.machine),
    subagent_type: prepared.subagentTypeName,
    run_in_background: raw.runInBackground,
    file_attachments: raw.attachments.length > 0 ? raw.attachments : void 0
  };
}
function trackPreparedTaskSubagentCreated(ctx, prepared, options2) {
  trackTaskSubagentCreated(ctx, {
    analyticsSubagentType: prepared.analyticsSubagentType,
    subagentTypeName: prepared.subagentTypeName,
    resolvedModelId: prepared.resolvedModelId,
    effectiveReadonly: prepared.effectiveReadonly,
    isResume: prepared.isResume,
    rawArgs: prepared.rawArgs,
    toolCallId: prepared.toolCallId,
    plugin: prepared.plugin,
    marketplace: prepared.marketplace,
    pluginId: prepared.pluginId,
    marketplaceId: prepared.marketplaceId,
    subagentSource: prepared.subagentSource,
    parentModelName: prepared.parentModelName
  }, options2);
}
function trackTaskSubagentCreated(ctx, details, { isParallel, parallelBatchSize }) {
  const eventTracker = getAgentEventTracker(ctx);
  eventTracker.trackSubagentCreated(ctx, {
    subagentType: details.analyticsSubagentType,
    subagentName: details.subagentTypeName,
    subagentModel: details.resolvedModelId,
    parentModel: details.parentModelName,
    isReadonly: details.effectiveReadonly,
    isResumed: details.isResume,
    isParallel,
    parallelBatchSize,
    hasAttachments: details.rawArgs !== void 0 && details.rawArgs.attachments.length > 0,
    toolCallId: details.toolCallId,
    plugin: details.plugin,
    marketplace: details.marketplace,
    pluginId: details.pluginId,
    marketplaceId: details.marketplaceId,
    subagentSource: details.subagentSource
  });
}
