/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/user-message-action/user-message-action-handler.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist();
init_dist3();

// @recovered-fragment 2/2
var __addDisposableResource43 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources43 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var logger74 = createLogger("@anysphere/agent:user-message-action");
function recordInitialCheckpointOutcomeSafely(ctx, record2, outcome) {
  try {
    record2?.(outcome);
  } catch (error3) {
    logger74.warn(ctx, "Failed to record initial checkpoint outcome", { error: error3 });
  }
}
var conversationInitDuration = createHistogram("agent.ttft.conversationInitMs", {
  description: "Time for initializeConversation (system prompt, rules, turn creation)"
});
function recordConversationInitMs(ctx, durationMs) {
  conversationInitDuration.histogram(ctx, durationMs);
  ctx.get(conversationInitMsRecorderKey)?.(durationMs);
}
var getRequestContextDuration = createHistogram("agent.ttft.getRequestContextMs", {
  description: "Time to resolve the request context (may call executor)"
});
var prependedMessagesDuration = createHistogram("agent.ttft.prependedMessagesMs", {
  description: "Time to process prepended user messages (sendUpdate + createAgentTurn per message)",
  labelNames: ["count"]
});
var systemPromptGenerationDuration = createHistogram("agent.ttft.systemPromptGenerationMs", {
  description: "Time for system prompt generation, UserInfo, tool generation, and message assembly"
});
var createMainTurnDuration = createHistogram("agent.ttft.createMainTurnMs", {
  description: "Time for the main stateHandler.createAgentTurn call (includes processSelectedContext)",
  labelNames: ["overlap_pre_turn_state_snapshot"]
});
var postTurnStateDuration = createHistogram("agent.ttft.postTurnStateMs", {
  description: "Time for optional computeNewStructure + onStateUpdate after turn creation"
});
function getFirstUserInfoRequestContextCompleteness(priorMessages) {
  const firstMsg = priorMessages[0];
  if (firstMsg?.role !== "user") {
    return void 0;
  }
  return parseRequestContextCompletenessMetadata(firstMsg.providerOptions?.cursor?.requestContextCompleteness);
}
function getFirstUserInfoSummarizationEpoch(priorMessages) {
  const firstMsg = priorMessages[0];
  if (firstMsg?.role !== "user") {
    return void 0;
  }
  return parseUserInfoSummarizationEpochMetadata(firstMsg.providerOptions?.cursor?.userInfoSummarizationEpoch);
}
function getFirstUserInfoTeamRulesFingerprint(priorMessages) {
  const firstMsg = priorMessages[0];
  if (firstMsg?.role !== "user") {
    return void 0;
  }
  const value = firstMsg.providerOptions?.cursor?.userInfoTeamRulesFingerprint;
  return typeof value === "string" ? value : void 0;
}
function getFirstUserInfoAgentSkillsFingerprint(priorMessages) {
  const firstMsg = priorMessages[0];
  if (firstMsg?.role !== "user") {
    return void 0;
  }
  const value = firstMsg.providerOptions?.cursor?.userInfoAgentSkillsFingerprint;
  return typeof value === "string" ? value : void 0;
}
function hasSummaryCarrierMessage(priorMessages) {
  return priorMessages.some((message) => message.providerOptions?.cursor?.isSummary === true);
}
function getDataUrlBase64(data) {
  const match2 = /^data:image\/[^;,]+;base64,(.*)$/iu.exec(data);
  return match2?.[1];
}
function toCoreUserImage(data, mimeType) {
  if (getDataUrlBase64(data) !== void 0 || mimeType === void 0) {
    return data;
  }
  return `data:${mimeType};base64,${data}`;
}
function toCoreToolImageData(data) {
  return getDataUrlBase64(data) ?? data;
}
function toCoreUserContent(content) {
  const parts = [];
  for (const part of content) {
    switch (part.content.case) {
      case "text":
        parts.push({
          type: "text",
          text: part.content.value.text
        });
        break;
      case "image":
        parts.push({
          type: "image",
          image: toCoreUserImage(part.content.value.data, part.content.value.mimeType),
          mimeType: part.content.value.mimeType
        });
        break;
      case void 0:
        break;
      default: {
        const _exhaustive = part.content;
        return _exhaustive;
      }
    }
  }
  return parts;
}
function toCoreToolResultContent(content) {
  const experimentalContent = [];
  const textParts = [];
  for (const part of content) {
    switch (part.content.case) {
      case "text":
        textParts.push(part.content.value.text);
        experimentalContent.push({
          type: "text",
          text: part.content.value.text
        });
        break;
      case "image":
        experimentalContent.push({
          type: "image",
          data: toCoreToolImageData(part.content.value.data),
          mimeType: part.content.value.mimeType
        });
        break;
      case void 0:
        break;
      default: {
        const _exhaustive = part.content;
        return _exhaustive;
      }
    }
  }
  return {
    result: textParts.length > 0 ? textParts.join("\n") : void 0,
    experimentalContent
  };
}
function toCoreAssistantContent(content) {
  const parts = [];
  for (const part of content) {
    switch (part.content.case) {
      case "text":
        parts.push({
          type: "text",
          text: part.content.value.text
        });
        break;
      case "reasoning":
        parts.push({
          type: "reasoning",
          text: part.content.value.text,
          signature: part.content.value.signature
        });
        break;
      case "redactedReasoning":
        parts.push({
          type: "redacted-reasoning",
          data: part.content.value.data
        });
        break;
      case "toolCall":
        parts.push({
          type: "tool-call",
          toolCallId: part.content.value.toolCallId,
          toolName: part.content.value.toolName,
          args: JSON.parse(part.content.value.argsJson)
        });
        break;
      case void 0:
        break;
      default: {
        const _exhaustive = part.content;
        return _exhaustive;
      }
    }
  }
  if (parts.length === 0) {
    return "";
  }
  if (parts.length === 1 && parts[0]?.type === "text") {
    return parts[0].text;
  }
  return parts;
}
function conversationHistoryToCoreMessages(history) {
  if (history === void 0) {
    return [];
  }
  const messages = [];
  for (const message of history.messages) {
    switch (message.message.case) {
      case "user": {
        messages.push({
          role: "user",
          content: toCoreUserContent(message.message.value.content)
        });
        break;
      }
      case "assistant": {
        messages.push({
          role: "assistant",
          content: toCoreAssistantContent(message.message.value.content)
        });
        break;
      }
      case "tool": {
        const { toolCallId, toolName, content, isError } = message.message.value;
        const { result, experimentalContent } = toCoreToolResultContent(content);
        messages.push({
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolCallId,
              toolName,
              result,
              experimental_content: experimentalContent,
              ...isError !== void 0 && { isError }
            }
          ]
        });
        break;
      }
      case void 0: {
        break;
      }
      default: {
        const _exhaustive = message.message;
        return _exhaustive;
      }
    }
  }
  return messages;
}
function deserializeConversationHistoryMessages(action, privacyMode) {
  const history = action.conversationHistory === void 0 ? void 0 : fromRedactedConversationHistory(action.conversationHistory, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  return toRedactedCoreMessages(conversationHistoryToCoreMessages(history), privacyMode);
}
function shouldMigrateMultitaskEnterReminderToUserInfo(params) {
  return params.hasExistingNonSystemMessages && params.previousTurnMode === AgentMode.MULTITASK && params.resolvedTurnMode === AgentMode.MULTITASK && params.firstUserInfoContent !== void 0 && !params.userInfoAlreadyHasMultitaskEnterReminder && hasSummaryCarrierMessage(params.priorMessages);
}
function getPendingToolCallElapsedMs(message) {
  const startedAtMs = message.providerOptions?.cursor?.pendingToolCallStartedAtMs;
  if (typeof startedAtMs !== "number" || !Number.isFinite(startedAtMs)) {
    return void 0;
  }
  return Math.max(0, Date.now() - startedAtMs);
}
function formatElapsedText(elapsedMs3) {
  return elapsedMs3 !== void 0 ? ` after ${elapsedMs3}ms` : "";
}
function formatInterruptedAwaitResult(elapsedMs3) {
  return `Error: Await was interrupted by the user${formatElapsedText(elapsedMs3)}.`;
}
function formatInterruptedShellResult(args) {
  const snapshot = getInterruptedShellOutputSnapshot(args.toolCallId);
  clearInterruptedShellOutputSnapshot(args.toolCallId);
  const elapsedText = formatElapsedText(args.elapsedMs);
  if (snapshot === void 0 || snapshot.length === 0) {
    return `Error: Shell command was interrupted by the user${elapsedText} before it completed.`;
  }
  const partialOutputSection = formatShellPartialOutputSection(snapshot, {
    heading: "Output collected before interruption",
    truncatedSuffix: " (truncated)"
  });
  return `Error: Shell command was interrupted by the user${elapsedText} before it completed.

${partialOutputSection}`;
}
function formatInterruptedToolResult(args) {
  switch (args.toolIdentifier) {
    case "AWAIT":
      return formatInterruptedAwaitResult(args.elapsedMs);
    case "SHELL":
      return formatInterruptedShellResult({
        toolCallId: args.toolCallId,
        elapsedMs: args.elapsedMs
      });
    default:
      return `Error: ${args.toolName} was interrupted by the user${formatElapsedText(args.elapsedMs)} before it completed.`;
  }
}
function formatResolvedInterruptedToolCall(args) {
  if (args.resolution === void 0) {
    return void 0;
  }
  const resolution = fromRedactedInterruptedPendingToolCallResolution(args.resolution, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED).resolution;
  switch (resolution.case) {
    case "shellResult": {
      const shellResult = resolution.value;
      shellResult.terminalsFolder ??= args.terminalsFolder;
      return {
        result: renderShellResultToString(shellResult, {
          autoBackgroundedForInterruption: true
        }),
        isError: shellResult.result.case !== "success"
      };
    }
    case "taskResult":
      return {
        result: renderTaskResultToString(resolution.value),
        isError: resolution.value.result.case === "error"
      };
    case void 0:
      return void 0;
    default: {
      const _exhaustive = resolution;
      return _exhaustive;
    }
  }
}
function getToolIdentifier(toolName, toolMap) {
  return toolMap[toolName]?.toolIdentifier ?? "other";
}
function buildInterruptedPendingToolCallMessages(stateHandler, tools, interruptedPendingToolCallResolutions, terminalsFolder) {
  const pendingMessages = stateHandler.getRawPendingMessages();
  if (pendingMessages.length === 0) {
    return [];
  }
  const messagesToAppend = [];
  const toolMap = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
  const resolutionByToolCallId = new Map(interruptedPendingToolCallResolutions?.resolutions.map((resolution) => [
    resolution.toolCallId,
    resolution
  ]) ?? []);
  const parsedMessages = pendingMessages.flatMap((pendingMessage) => {
    try {
      return [
        JSON.parse(pendingMessage.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED))
      ];
    } catch {
      return [];
    }
  });
  const completedToolResults = collectCompletedToolResults(parsedMessages);
  const completedMessages = new Set(completedToolResults.values());
  for (const parsed of parsedMessages) {
    if (completedMessages.has(parsed)) {
      continue;
    }
    messagesToAppend.push(parsed);
    if (parsed.role !== "assistant" || !Array.isArray(parsed.content)) {
      continue;
    }
    const elapsedMs3 = getPendingToolCallElapsedMs(parsed);
    let toolResults = [];
    let rawErrorMessages = [];
    const flushInterruptedResults = () => {
      if (toolResults.length === 0) {
        return;
      }
      messagesToAppend.push({
        role: "tool",
        content: toolResults,
        providerOptions: {
          cursor: {
            highLevelToolCallResult: {
              output: toolResults.map((result) => result.result),
              isError: rawErrorMessages.length > 0,
              rawErrorMessages
            }
          }
        }
      });
      toolResults = [];
      rawErrorMessages = [];
    };
    for (const content of parsed.content) {
      if (content.type !== "tool-call") {
        continue;
      }
      const completed = completedToolResults.get(content.toolCallId);
      if (completed !== void 0) {
        flushInterruptedResults();
        if (messagesToAppend.at(-1) !== completed) {
          messagesToAppend.push(completed);
        }
        continue;
      }
      const toolIdentifier = getToolIdentifier(content.toolName, toolMap);
      const resolved = formatResolvedInterruptedToolCall({
        resolution: resolutionByToolCallId.get(content.toolCallId),
        terminalsFolder
      });
      const result = resolved?.result ?? formatInterruptedToolResult({
        toolCallId: content.toolCallId,
        toolName: content.toolName,
        toolIdentifier,
        elapsedMs: elapsedMs3
      });
      if (resolved?.isError !== false) {
        rawErrorMessages.push(result);
      }
      toolResults.push({
        type: "tool-result",
        toolCallId: content.toolCallId,
        toolName: content.toolName,
        result,
        experimental_content: [
          {
            type: "text",
            text: result
          }
        ]
      });
    }
    flushInterruptedResults();
  }
  return toRedactedCoreMessages(messagesToAppend, stateHandler.getPrivacyMode());
}
var DEFAULT_MAX_PREPENDED_USER_MESSAGES = 5;
var UserMessageActionHandler = class extends AbstractUserMessageActionHandler {
  async initializeConversation(ctx, params) {
    const { action, rootPromptExecutor, stateHandler, mcpTools, maxPrependedUserMessages, forcePrependedUserMessages, onStateUpdate, initialCheckpointMode, recordInitialCheckpointOutcome } = params;
    if (!action.userMessage) {
      throw new Error("User message is required");
    }
    const userMessage = action.userMessage;
    const isRootProject = isRootProjectUserMessage(userMessage);
    if (isRootProject) {
      stateHandler.isRootProjectConversation = true;
    }
    const resolvedTurnMode = stateHandler.resolveTurnMode(userMessage);
    const { omitCloudWorkerProcedure, useProjectCoordinatorPrompting } = resolveRootCoordinatorPrompting({
      omitCloudWorkerProcedureGateEnabled: this.config.featureFlags?.projectRootCoordinatorPrompt === true,
      localParityPromptGateEnabled: this.config.featureFlags?.projectRootCoordinatorLocalParityPrompt === true,
      agentType: this.config.agentType,
      mode: resolvedTurnMode,
      useLocalAgentPrompting: this.config.useLocalAgentPrompting === true,
      isNamedAgentSession: getNamedAgentSessionPromptContext(this.config) !== void 0 || isNamedAgentHomePromptSession(this.config),
      isRootProject
    });
    const sendToInteractionListener = action.sendToInteractionListener === true;
    const hasExistingNonSystemMessages = rootPromptExecutor.getMessages().some((message) => message.role !== "system");
    const getRequestContextStart = performance.now();
    const { requestContext, provenance: requestContextProvenance } = await resolveRequestContext({
      parentCtx: ctx,
      maybeRequestContext: action.requestContext ? fromRedactedRequestContext(action.requestContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0,
      resources: this.resourceAccessor,
      options: buildRequestContextOptions(this.config)
    });
    getRequestContextDuration.histogram(ctx, performance.now() - getRequestContextStart);
    stateHandler.getOrInitializeConversationStartedDate(requestContext.env?.timeZone, requestContext.env?.devMockPromptTime?.toDate());
    const mergedMcpTools = this.mergeRequestContextTools(mcpTools, requestContext.tools);
    const toolSetHandle = this.config.toolsGenerator({
      resourceAccessor: this.resourceAccessor,
      stateHandler,
      agentSessionId: this.config.agentSessionId,
      mcpTools: mergedMcpTools,
      repositoryInfos: requestContext.repositoryInfo,
      blobStore: stateHandler.getBlobStore(),
      mode: resolvedTurnMode,
      loggingContext: ctx,
      requestContext,
      fileOperationLockManager: new FileOperationLockManager(),
      smartModeClassifierMode: this.config.smartModeClassifierMode,
      smartModeClassifierShadowMode: this.config.smartModeClassifierShadowMode,
      autoRejectFirstAskQuestion: this.config.autoRejectFirstAskQuestion
    });
    const toolInfo = extractToolInfo(toolSetHandle);
    const sendMessageToolName = toolInfo.allTools.SEND_MESSAGE?.name;
    const dynamicToolTurnOptions = {
      ...getDynamicToolTurnSnapshot(toolSetHandle),
      ...sendMessageToolName !== void 0 ? { sendMessageToolName } : {}
    };
    const isProjectKickoffBeforePrepends = userMessage.projectDetails !== void 0 && userMessage.projectDetails.sideChat === void 0 && stateHandler.turns.length === 0;
    const prependedMessagesStart = performance.now();
    let prependedCount = 0;
    if (this.config.enablePrependedUserActions || forcePrependedUserMessages) {
      const allPrepended = action.prependUserMessages ?? [];
      const droppedCount = Math.max(0, allPrepended.length - maxPrependedUserMessages);
      const prependedMessages = allPrepended.slice(-maxPrependedUserMessages);
      prependedCount = prependedMessages.length;
      if (droppedCount > 0) {
        logger74.warn(ctx, "dropped excess prepended user messages", {
          droppedCount,
          totalCount: allPrepended.length,
          keptCount: prependedMessages.length
        });
      }
      if (prependedMessages.length > 0) {
        logger74.info(ctx, "prepending user messages", {
          prependUserMessagesCount: prependedMessages.length
        });
      }
      const prependedMessageIds = new Set(prependedMessages.map((message) => message.messageId).filter((messageId) => messageId.length > 0));
      const existingUserTurnMessageIds = prependedMessageIds.size > 0 ? await stateHandler.findUserTurnMessageIds(ctx, {
        messageIds: prependedMessageIds,
        stopAtMessageId: this.config.prependedUserMessageDedupeFloorMessageId
      }) : void 0;
      const prependedNamedAgentUserTurnReminder = prependedMessages.length === 0 ? void 0 : isNamedAgentHomePromptSession(this.config) ? renderNamedAgentHomeUserTurnReminder() : this.config.isCloudMetaAgentParent ? renderCloudMetaParentUserTurnReminder(getRequiredToolName(toolInfo.allTools, "TASK"), getNamedAgentSessionPromptContext(this.config)) : void 0;
      for (const prependedMessage of prependedMessages) {
        const prependedUserMessage = fromRedactedUserMessage2(prependedMessage, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
        const prependedMessageId = prependedUserMessage.messageId;
        const duplicateByMessageId = prependedMessageId.length > 0 && existingUserTurnMessageIds?.has(prependedMessageId) === true;
        if (duplicateByMessageId) {
          logger74.info(ctx, "skipping duplicate prepended user message", {
            prependedMessageId,
            duplicateByMessageId
          });
          continue;
        }
        const startedAtMs = ensureUserMessageTiming(prependedMessage);
        prependedUserMessage.startedAtMs = startedAtMs;
        prependedUserMessage.completedAtMs = startedAtMs;
        if (sendToInteractionListener) {
          await this.interactionListener.sendUpdate(ctx, RedactedUpdates.userMessageAppended(prependedMessage));
        }
        await stateHandler.createAgentTurn(ctx, prependedUserMessage, requestContext, this.config, this.resourceAccessor, {
          additionalUserTurnSystemReminder: prependedNamedAgentUserTurnReminder,
          ...dynamicToolTurnOptions
        });
        if (prependedMessageId.length > 0) {
          existingUserTurnMessageIds?.add(prependedMessageId);
        }
      }
    }
    prependedMessagesDuration.histogram(ctx, performance.now() - prependedMessagesStart, {
      count: String(prependedCount)
    });
    const systemPromptStart = performance.now();
    const rules = getAllRules(requestContext, this.config.nonFileRules, this.config.featureFlags);
    const priorMessages = rootPromptExecutor.getMessages().filter((m2) => m2.role !== "system");
    const userInfoCloudTestingSectionsPlacement = getComposer2CloudTestingSectionsPlacement({
      modelInfo: this.config.modelInfo,
      enableComposer2IntelligentTestingPromptSection: this.config.enableComposer2IntelligentTestingPromptSection,
      backgroundAgentSource: this.config.backgroundAgentSource,
      agentType: this.config.agentType,
      enableCloudTesting: this.config.enableCloudTesting,
      featureFlags: this.config.featureFlags,
      namedAgentSessionKind: this.config.namedAgentSessionKind,
      isCloudMetaAgentParent: this.config.isCloudMetaAgentParent
    });
    const newMessages = [];
    const systemPromptProps = {
      requestContext,
      cursorRules: rules,
      env: requestContext.env,
      browserTools: getBrowserToolNames(mcpTools),
      cloudRule: requestContext.cloudRule,
      mode: resolvedTurnMode,
      omitCloudWorkerProcedure,
      useProjectCoordinatorPrompting
    };
    const systemPromptContent = this.config.systemPromptGenerator(systemPromptProps, toolSetHandle);
    const systemPromptFingerprint = buildSystemPromptFingerprint({
      props: systemPromptProps,
      content: systemPromptContent,
      modelInfo: this.config.modelInfo,
      agentType: this.config.agentType,
      featureFlags: this.config.featureFlags,
      toolSetHandle,
      mcpTools: mergedMcpTools
    });
    recordSystemPromptRebuild(ctx, {
      previousMessages: rootPromptExecutor.getMessages(),
      current: systemPromptFingerprint,
      modelInfo: this.config.modelInfo
    });
    newMessages.unshift({
      role: "system",
      content: systemPromptContent,
      providerOptions: { cursor: { systemPromptFingerprint } }
    });
    const shouldRenderDsv3UserInfo = stateHandler.isDsv3() || this.config.modelInfo?.isComposerMatterhorn === true;
    const namedAgentUserTurnReminder = isNamedAgentHomePromptSession(this.config) ? renderNamedAgentHomeUserTurnReminder() : this.config.isCloudMetaAgentParent ? renderCloudMetaParentUserTurnReminder(getRequiredToolName(toolInfo.allTools, "TASK"), getNamedAgentSessionPromptContext(this.config)) : void 0;
    const toolMetadataMap = toolInfo.allTools;
    const awaitToolName = toolMetadataMap.AWAIT?.name;
    const shellToolName = toolMetadataMap.SHELL?.name;
    const grepToolName = toolMetadataMap.GREP?.name;
    const matterhornCustomUserRuleOptions = {
      awaitToolName,
      shellToolName,
      grepToolName
    };
    const expectedCustomUserRules = getComposer2CustomUserRulesForModel(this.config.modelInfo, this.config.featureFlags, matterhornCustomUserRuleOptions);
    const userInfoMcpMetaToolOptions = getUserInfoMcpMetaToolOptions(requestContext.mcpMetaToolOptions, mergedMcpTools, toolSetHandle);
    const hidesMcpMetaToolSnapshot = resolvedTurnMode === AgentMode.ASK && (this.config.enableFilterEditToolsInAskMode ?? true) || this.config.modelInfo?.isComposerMatterhorn === true && this.config.modelInfo.isRawTrainingSlug === true;
    const requestContextCompleteness = getRequestContextCompleteness(requestContext);
    const firstUserInfoContent = getFirstUserInfoMessageContent(priorMessages);
    const firstUserInfoRequestContextCompleteness = getFirstUserInfoRequestContextCompleteness(priorMessages);
    const userInfoTeamRulesFingerprint = fingerprintTeamRules(rules);
    const userInfoAgentSkillsFingerprint = fingerprintBotSkillsCatalog(requestContext.agentSkills ?? []);
    const userInfoCatalogInputs = {
      availableSubagentModelsDescription: toolInfo.availableSubagentModelsDescription,
      availableSubagentTypesDescription: toolInfo.availableSubagentTypesDescription,
      mcpMetaToolOptions: userInfoMcpMetaToolOptions,
      skipDynamicToolSnapshotCheck: hidesMcpMetaToolSnapshot
    };
    const deferUserInfoCatalogRerender = this.config.featureFlags?.deferUserInfoCatalogRerender === true;
    const userInfoRerenderReason = getUserInfoRerenderReason({
      priorMessages,
      agentTypeChanged: stateHandler.hasAgentTypeChangedFromPersistedState(),
      ...userInfoCatalogInputs,
      deferCatalogRerender: deferUserInfoCatalogRerender,
      // Skipped on an incomplete rules fetch: a transient failure must never
      // read as "the admin removed every rule".
      ...this.config.featureFlags?.rerenderUserInfoOnTeamRulesChange === true && requestContextCompleteness.rules && {
        teamRules: {
          currentFingerprint: userInfoTeamRulesFingerprint,
          previousFingerprint: getFirstUserInfoTeamRulesFingerprint(priorMessages)
        }
      },
      agentSkills: {
        currentFingerprint: userInfoAgentSkillsFingerprint,
        previousFingerprint: getFirstUserInfoAgentSkillsFingerprint(priorMessages)
      },
      customUserRules: {
        expectedRules: expectedCustomUserRules,
        modelInfo: this.config.modelInfo,
        featureFlags: this.config.featureFlags,
        toolNames: matterhornCustomUserRuleOptions
      }
    });
    const needsUserInfoRerender = userInfoRerenderReason !== void 0;
    const needsRequestContextRecoveryRerender = this.config.featureFlags?.rerenderUserInfoOnRequestContextRecovery === true && shouldRerenderUserInfoForRequestContextRecovery({
      previousCompleteness: firstUserInfoRequestContextCompleteness,
      currentCompleteness: requestContextCompleteness
    });
    const currentSummarizationEpoch = stateHandler.summaryArchives.length;
    const needsSummarizationRerender = this.config.featureFlags?.rerenderUserInfoOnSummarization === true && shouldRerenderUserInfoAfterSummarization({
      previousEpoch: getFirstUserInfoSummarizationEpoch(priorMessages),
      currentEpoch: currentSummarizationEpoch,
      hasUserInfo: firstUserInfoContent !== void 0
    });
    const needsOmitCloudWorkerProcedureRerender = hasExistingNonSystemMessages && firstUserInfoContent !== void 0 && getFirstUserInfoOmitCloudWorkerProcedure(priorMessages) !== omitCloudWorkerProcedure;
    const needsProjectCoordinatorPromptingRerender = hasExistingNonSystemMessages && firstUserInfoContent !== void 0 && getFirstUserInfoProjectCoordinatorPrompting(priorMessages) !== useProjectCoordinatorPrompting;
    const needsCloudTestingPlacementRerender = hasExistingNonSystemMessages && firstUserInfoContent !== void 0 && userInfoCloudTestingSectionsPlacement !== void 0 && getFirstUserInfoCloudTestingSectionsPlacement(priorMessages) !== userInfoCloudTestingSectionsPlacement;
    const localPrCreationForgeRule = rules.find((rule) => rule.fullPath === LOCAL_PR_CREATION_FORGE_RULE_PATH);
    const needsLocalPrCreationForgeRerender = hasExistingNonSystemMessages && firstUserInfoContent !== void 0 && shouldRerenderUserInfoForLocalPrCreationForge({
      userInfoContent: firstUserInfoContent,
      forgeRuleContent: localPrCreationForgeRule?.content
    });
    const userInfoAlreadyHasMultitaskEnterReminder = firstUserInfoContent !== void 0 && userInfoHasMultitaskModeEnterReminder(firstUserInfoContent);
    const shouldMigrateMultitaskEnterReminderInThisTurn = shouldMigrateMultitaskEnterReminderToUserInfo({
      hasExistingNonSystemMessages,
      previousTurnMode: stateHandler.mode,
      resolvedTurnMode,
      priorMessages,
      firstUserInfoContent,
      userInfoAlreadyHasMultitaskEnterReminder
    });
    const shouldReplaceUserInfoWithImportedHistory = action.conversationHistory?.replaceUserInfo === true && action.conversationHistory.messages.length > 0;
    const shouldRenderUserInfo = (!hasExistingNonSystemMessages || needsUserInfoRerender || needsRequestContextRecoveryRerender || needsSummarizationRerender || needsLocalPrCreationForgeRerender || needsOmitCloudWorkerProcedureRerender || needsProjectCoordinatorPromptingRerender || shouldMigrateMultitaskEnterReminderInThisTurn || needsCloudTestingPlacementRerender) && !this.config.userInfoDisplayOptions?.disable && !shouldReplaceUserInfoWithImportedHistory;
    let userInfoCatalogUpdateReminder;
    if (this.config.featureFlags?.deferUserInfoCatalogRerender !== void 0 && firstUserInfoContent !== void 0) {
      const staleCatalogs = getUserInfoCatalogUpdateKinds({
        priorMessages,
        userInfoContent: shouldRenderUserInfo || !deferUserInfoCatalogRerender ? void 0 : firstUserInfoContent,
        inputs: userInfoCatalogInputs
      });
      if (staleCatalogs.length > 0) {
        userInfoCatalogUpdateReminder = renderUserInfoCatalogUpdateReminder(staleCatalogs, userInfoCatalogInputs);
        logger74.info(ctx, "agent.user_info.catalog_update_appended", {
          catalogs: staleCatalogs
        });
        recordUserInfoCatalogUpdate(ctx, staleCatalogs, this.config.modelInfo);
      }
    }
    const isMainTurnStillFirstConversationTurn = stateHandler.turns.length === 0;
    const shouldAppendMultitaskEnterReminderToUserInfo = shouldRenderUserInfo && resolvedTurnMode === AgentMode.MULTITASK && (!hasExistingNonSystemMessages && isMainTurnStillFirstConversationTurn || userInfoAlreadyHasMultitaskEnterReminder || shouldMigrateMultitaskEnterReminderInThisTurn);
    let didReplaceUserInfo = false;
    if (shouldRenderUserInfo) {
      didReplaceUserInfo = hasExistingNonSystemMessages;
      if (didReplaceUserInfo) {
        const reasons = [];
        if (userInfoRerenderReason !== void 0) {
          reasons.push(userInfoRerenderReason);
        }
        if (needsRequestContextRecoveryRerender) {
          reasons.push("request_context_recovery");
        }
        if (needsSummarizationRerender) {
          reasons.push("summarization_epoch_advanced");
        }
        if (needsLocalPrCreationForgeRerender) {
          reasons.push("local_pr_creation_forge_change");
        }
        if (needsOmitCloudWorkerProcedureRerender) {
          reasons.push("omit_cloud_worker_procedure_change");
        }
        if (needsProjectCoordinatorPromptingRerender) {
          reasons.push("project_coordinator_prompting_change");
        }
        if (shouldMigrateMultitaskEnterReminderInThisTurn) {
          reasons.push("multitask_reminder_migration");
        }
        if (needsCloudTestingPlacementRerender) {
          reasons.push("cloud_testing_placement_recovery");
        }
        logger74.info(ctx, "agent.user_info.rerendered", { reasons });
        recordUserInfoRerendered(ctx, reasons, this.config.modelInfo);
      }
      const subagentToolName = this.config.modelInfo !== void 0 ? getTaskToolName(this.config.modelInfo) : "Task";
      const multitaskModeEnterReminderOptions = {
        ignoreGptPersistenceInstructions: usesGptPersistenceInstructions(this.config.modelInfo),
        modelInfo: this.config.modelInfo,
        hideAsyncSubagentTaskNotifications: this.config.featureFlags?.hideAsyncSubagentTaskNotifications
      };
      let namedAgentSelfDocumentBlock;
      if (this.config.getNamedAgentSelfDocument !== void 0) {
        try {
          namedAgentSelfDocumentBlock = renderNamedAgentSelfDocumentBlock(await this.config.getNamedAgentSelfDocument());
        } catch (error3) {
          logger74.warn(ctx, "agent.named_agent_self_document.load_failed", {
            error: error3
          });
          namedAgentSelfDocumentBlock = extractNamedAgentSelfDocumentBlock(firstUserInfoContent);
        }
      }
      let userInfoContent = UserInfo({
        cursorRules: rules,
        agentSkills: requestContext.agentSkills,
        env: requestContext.env,
        gitRepos: requestContext.gitRepos,
        gitRepoInfoComplete: requestContext.gitRepoInfoComplete,
        cloudRule: requestContext.cloudRule,
        mode: resolvedTurnMode,
        isRootProject,
        omitCloudWorkerProcedure,
        useProjectCoordinatorPrompting,
        dsv3: shouldRenderDsv3UserInfo,
        displayOptions: this.config.userInfoDisplayOptions,
        mcpInfoComplete: requestContext.mcpInfoComplete,
        mcpInstructions: requestContext.mcpInstructions,
        mcpFileSystemOptions: requestContext.mcpFileSystemOptions,
        mcpMetaToolOptions: userInfoMcpMetaToolOptions,
        userIntentSummary: requestContext.userIntentSummary,
        featureFlags: this.config.featureFlags,
        enableFilterEditToolsInAskMode: this.config.enableFilterEditToolsInAskMode,
        skipMcpInstructions: (requestContext.mcpFileSystemOptions?.enabled ?? false) || (userInfoMcpMetaToolOptions?.enabled ?? false),
        hooksAdditionalContext: requestContext.hooksAdditionalContext,
        automationInstructions: this.config.automationInstructions,
        ...this.config.enableTerminalFiles !== false && {
          terminalsFolder: requestContext.env?.terminalsFolder
        },
        ...buildUserInfoAgentNotesProps(this.config, resolvedTurnMode, requestContext.env),
        designatedBranches: this.config.designatedBranches,
        startedAsNewProject: this.config.startedAsNewProject,
        newProjectSeededEmptyRoot: this.config.newProjectSeededEmptyRoot,
        branchPrefix: this.config.branchPrefix,
        branchSuffix: this.config.branchSuffix,
        preferCurrentBranchInMultiPrMode: this.config.preferCurrentBranchInMultiPrMode,
        toolInfo,
        browserTools: getBrowserToolNames(mcpTools),
        agentType: this.config.agentType,
        backgroundAgentSource: this.config.backgroundAgentSource,
        isCloudMetaAgentParent: this.config.isCloudMetaAgentParent,
        isSlackV1_5: this.config.isSlackV1_5,
        namedAgentSessionKind: this.config.namedAgentSessionKind,
        namedAgentSelfDocumentBlock,
        enableCloudTesting: this.config.enableCloudTesting,
        useLocalAgentPrompting: this.config.useLocalAgentPrompting,
        isRepoless: this.config.isRepoless,
        repolessPromptVariant: this.config.repolessPromptVariant,
        modelInfo: this.config.modelInfo,
        agentTokenLimit: this.config.agentTokenLimit,
        enableComposer2IntelligentTestingPromptSection: this.config.enableComposer2IntelligentTestingPromptSection
      });
      if (shouldAppendMultitaskEnterReminderToUserInfo) {
        userInfoContent = `${userInfoContent}

${renderMultitaskModeEnterUserReminder(subagentToolName, multitaskModeEnterReminderOptions)}`;
      }
      newMessages.push({
        role: "user",
        content: userInfoContent,
        providerOptions: {
          cursor: {
            requestContextCompleteness,
            // Stamped unconditionally (not gated on the rerender flag) so a
            // conversation started before the flag rolls out still re-renders
            // at its first post-flag compaction.
            userInfoSummarizationEpoch: currentSummarizationEpoch,
            // Likewise unconditional; absent when no team rules rendered, so a
            // pre-stamp conversation and a rule-less one read the same.
            ...userInfoTeamRulesFingerprint !== void 0 && {
              userInfoTeamRulesFingerprint
            },
            ...userInfoAgentSkillsFingerprint !== void 0 && {
              userInfoAgentSkillsFingerprint
            },
            omitCloudWorkerProcedure,
            useProjectCoordinatorPrompting,
            // Only stamped when this turn resolved a placement: a stamp-less
            // user_info is treated as unknown and re-rendered by the next
            // eligible turn.
            ...userInfoCloudTestingSectionsPlacement !== void 0 && {
              composer2CloudTestingSectionsPlacement: userInfoCloudTestingSectionsPlacement
            }
          }
        }
      });
    }
    const effectivePriorMessages = didReplaceUserInfo ? priorMessages.slice(1) : priorMessages;
    const conversationHistoryMessages = deserializeConversationHistoryMessages(action, stateHandler.getPrivacyMode());
    const interruptedPendingToolCallMessages = buildInterruptedPendingToolCallMessages(stateHandler, getExecutableTools(toolSetHandle.getToolExecutionSet()), action.interruptedPendingToolCallResolutions, requestContext.env?.terminalsFolder);
    rootPromptExecutor.clearMessages();
    rootPromptExecutor.appendMessages(toRedactedCoreMessages(newMessages, stateHandler.getPrivacyMode()));
    rootPromptExecutor.appendMessages([
      ...conversationHistoryMessages,
      ...effectivePriorMessages,
      ...interruptedPendingToolCallMessages
    ]);
    systemPromptGenerationDuration.histogram(ctx, performance.now() - systemPromptStart);
    ensureUserMessageTiming(userMessage);
    if (sendToInteractionListener) {
      await this.interactionListener.sendUpdate(ctx, RedactedUpdates.userMessageAppended(userMessage));
    }
    const createMainTurnStart = performance.now();
    const turn = await stateHandler.createAgentTurn(ctx, fromRedactedUserMessage2(userMessage, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED), requestContext, this.config, this.resourceAccessor, {
      additionalUserTurnSystemReminder: joinUserTurnSystemReminders(namedAgentUserTurnReminder ?? "", userInfoCatalogUpdateReminder ?? "") || void 0,
      ...isProjectKickoffBeforePrepends && { isProjectKickoff: true },
      ...dynamicToolTurnOptions,
      recordRoutedModelDisplayName: true
    });
    const preTurnAssistantNotice = this.config.preTurnAssistantNotice?.trim() ?? "";
    if (preTurnAssistantNotice !== "") {
      await turn.recordText(ctx, `${preTurnAssistantNotice}

`);
    }
    stateHandler.setMode(resolvedTurnMode);
    createMainTurnDuration.histogram(ctx, performance.now() - createMainTurnStart, {
      overlap_pre_turn_state_snapshot: this.config.featureFlags?.overlapPreTurnStateSnapshot === true ? "true" : "false"
    });
    ctx.get(cloudAgentTurnPrepGlueMsRecorderKey)?.("createTurnMs", performance.now() - createMainTurnStart);
    const postTurnStateStart = performance.now();
    let deferredInitialCheckpoint;
    if (this.config.immediatelyUpdateStateOnNewTurn) {
      const persistInitialCheckpoint = async () => {
        const newState = await stateHandler.computeNewStructure(ctx);
        if (onStateUpdate) {
          await onStateUpdate(ctx, newState);
        }
      };
      if (this.config.fireAndForgetCheckpoints) {
        void persistInitialCheckpoint().catch((error3) => {
          logger74.error(ctx, "Failed to persist checkpoint for new turn", {
            error: error3
          });
        });
      } else if (initialCheckpointMode === "overlap_model_step") {
        const startedAtMs = performance.now();
        const timing = {};
        const completion = persistInitialCheckpoint().finally(() => {
          timing.checkpointMs = performance.now() - startedAtMs;
        });
        let joinPromise;
        const join32 = () => {
          if (joinPromise === void 0) {
            const joinStartedAtMs = performance.now();
            joinPromise = completion.finally(() => {
              timing.joinWaitMs = performance.now() - joinStartedAtMs;
            });
          }
          return joinPromise;
        };
        void completion.catch(() => {
        });
        deferredInitialCheckpoint = {
          join: join32,
          startedAtMs,
          timing,
          recordOutcome: recordInitialCheckpointOutcome
        };
      } else {
        const startedAtMs = performance.now();
        let failed = true;
        try {
          await persistInitialCheckpoint();
          failed = false;
        } finally {
          if (initialCheckpointMode === "blocking") {
            recordInitialCheckpointOutcomeSafely(ctx, recordInitialCheckpointOutcome, {
              applied: false,
              checkpointMs: performance.now() - startedAtMs,
              joinWaitMs: 0,
              failed
            });
          }
        }
      }
    }
    postTurnStateDuration.histogram(ctx, performance.now() - postTurnStateStart);
    return {
      turn,
      mergedMcpTools,
      requestContext,
      requestContextProvenance,
      deferredInitialCheckpoint
    };
  }
  async handle(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate, options2 = {}) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource43(env_1, createSpan(parentCtx.withName("UserMessageActionHandler.handle")), false);
      const ctx = span.ctx;
      if (options2.pausedGoalReactivation !== "suppress") {
        await reactivatePausedGoalForTurn(ctx, stateHandler, onStateUpdate);
      }
      const convInitStart = performance.now();
      const { turn, mergedMcpTools, requestContext } = await this.initializeConversation(ctx, {
        action,
        rootPromptExecutor,
        stateHandler,
        mcpTools,
        maxPrependedUserMessages: options2.maxPrependedUserMessages ?? DEFAULT_MAX_PREPENDED_USER_MESSAGES,
        forcePrependedUserMessages: options2.forcePrependedUserMessages ?? false,
        onStateUpdate
      });
      recordConversationInitMs(ctx, performance.now() - convInitStart);
      await this.runTurnLoop(ctx, rootPromptExecutor, stateHandler, turn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo, requestContext, onStateUpdate);
      return await stateHandler.computeNewStructure(ctx);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources43(env_1);
    }
  }
  async initAndMeasure(ctx, action, rootPromptExecutor, stateHandler, mcpTools, options2, onStateUpdate, initialCheckpointMode, recordInitialCheckpointOutcome) {
    const start = performance.now();
    const result = await this.initializeConversation(ctx, {
      action,
      rootPromptExecutor,
      stateHandler,
      mcpTools,
      maxPrependedUserMessages: options2.maxPrependedUserMessages ?? DEFAULT_MAX_PREPENDED_USER_MESSAGES,
      forcePrependedUserMessages: options2.forcePrependedUserMessages ?? false,
      onStateUpdate,
      initialCheckpointMode,
      recordInitialCheckpointOutcome
    });
    recordConversationInitMs(ctx, performance.now() - start);
    return result;
  }
  async handleSingleStep(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate, options2 = {}) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource43(env_2, createSpan(parentCtx.withName("UserMessageActionHandler.handleSingleStep")), false);
      const ctx = span.ctx;
      if (options2.pausedGoalReactivation !== "suppress") {
        await reactivatePausedGoalForTurn(ctx, stateHandler, onStateUpdate);
      }
      const { turn, mergedMcpTools, requestContext } = await this.initAndMeasure(ctx, action, rootPromptExecutor, stateHandler, mcpTools, options2, onStateUpdate);
      const { hasToolCall } = await this.runSingleStep(ctx, rootPromptExecutor, stateHandler, turn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo, requestContext, onStateUpdate);
      return {
        state: await stateHandler.computeNewStructure(ctx),
        hasToolCall
      };
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources43(env_2);
    }
  }
  async handleModelStep(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate, options2 = {}) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource43(env_3, createSpan(parentCtx.withName("UserMessageActionHandler.handleModelStep")), false);
      const ctx = span.ctx;
      if (options2.pausedGoalReactivation !== "suppress") {
        await reactivatePausedGoalForTurn(ctx, stateHandler, onStateUpdate);
      }
      const { turn, mergedMcpTools, requestContext, requestContextProvenance, deferredInitialCheckpoint } = await this.initAndMeasure(ctx, action, rootPromptExecutor, stateHandler, mcpTools, options2, onStateUpdate, this.config.initialCheckpointMode, this.config.recordInitialCheckpointOutcome);
      const onStateUpdateAfterInitialCheckpoint = deferredInitialCheckpoint === void 0 ? onStateUpdate : async (updateCtx, updatedState) => {
        await deferredInitialCheckpoint.join();
        await onStateUpdate(updateCtx, updatedState);
      };
      const { toolCallDescriptors, splitStepData } = await (async () => {
        try {
          return await this.runModelStep(ctx, rootPromptExecutor, stateHandler, turn, this.config.toolsGenerator, mergedMcpTools, requestContext.repositoryInfo, requestContext, onStateUpdateAfterInitialCheckpoint);
        } finally {
          if (deferredInitialCheckpoint !== void 0) {
            let failed = true;
            try {
              await deferredInitialCheckpoint.join();
              failed = false;
            } finally {
              const completedAtMs = performance.now();
              recordInitialCheckpointOutcomeSafely(ctx, deferredInitialCheckpoint.recordOutcome, {
                applied: true,
                checkpointMs: deferredInitialCheckpoint.timing.checkpointMs ?? completedAtMs - deferredInitialCheckpoint.startedAtMs,
                joinWaitMs: deferredInitialCheckpoint.timing.joinWaitMs ?? 0,
                failed
              });
            }
          }
        }
      })();
      return {
        state: await stateHandler.computeNewStructure(ctx),
        toolCallDescriptors,
        splitStepData: {
          ...splitStepData,
          requestContextProvenance
        }
      };
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      __disposeResources43(env_3);
    }
  }
};

