var __addDisposableResource28 = function(env, value, async) {
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
var __disposeResources28 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error42, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error42, e.suppressed = suppressed, e;
});
var logger73 = createLogger("task-tool");
var TASK_RESUME_SELF_SENTINEL = "self";
var SUBAGENT_STREAM_CLOSED_ERROR = "The subagent's connection closed before it finished (the run was torn down mid-flight). This is usually transient \u2014 please try again.";
function isWritableIterableClosedError(error42) {
  return error42 instanceof WriteIterableClosedError || error42 instanceof Error && error42.message.includes("WritableIterable is closed");
}
function formatSubagentBackgroundMessage(reason, transcriptPath, options2) {
  let intro;
  switch (reason) {
    case SubagentBackgroundReason.USER_REQUEST:
      intro = "The user manually backgrounded the subagent. It is still running; you can continue with other work.";
      break;
    case SubagentBackgroundReason.QUEUED_FOLLOW_UP:
      intro = RUNNING_SUBAGENT_FOLLOWUP_ERROR;
      break;
    case SubagentBackgroundReason.AGENT_REQUEST:
    case SubagentBackgroundReason.UNSPECIFIED:
      intro = "Subagent is running in the background.";
      break;
    default: {
      const _exhaustive = reason;
      intro = "Subagent is running in the background.";
    }
  }
  const displayTranscriptPath = transcriptPath?.trim();
  if (!displayTranscriptPath) {
    return intro;
  }
  if (options2?.enableJobCompletionNotifications === true) {
    return `${intro} If needed, you can monitor its output by tailing the transcript at: ${displayTranscriptPath}. When you end your turn, you will be automatically sent the subagent's final response upon its completion, so do not wait for it - either end your turn or work on something else.
Do NOT mention the transcript path to the user. Do NOT try to predict the subagent's response before it replies.`;
  }
  return `${intro} You can monitor its output by tailing the transcript at: ${displayTranscriptPath}. Do not mention the transcript path to the user.`;
}
function buildClientContinuationConfig(config2) {
  const policy = config2.continuationPolicy;
  if (!policy) {
    return void 0;
  }
  const msg = policy.continuationMessage;
  const nudgeMessage = typeof msg === "function" ? msg({ isEscapeHatch: false, idleCount: 0, escapeToken: "" }) : msg;
  const IDLE_SENTINEL = 99999;
  const TOKEN_SENTINEL = "___ESCAPE_TOKEN_PLACEHOLDER___";
  let escapeMessageTemplate;
  if (typeof msg === "function") {
    escapeMessageTemplate = msg({
      isEscapeHatch: true,
      idleCount: IDLE_SENTINEL,
      escapeToken: TOKEN_SENTINEL
    }).replace(String(IDLE_SENTINEL), "{idle_count}").replace(TOKEN_SENTINEL, "{escape_token}");
  } else {
    escapeMessageTemplate = "You've made {idle_count} responses without tool calls. If you're done, respond with exactly: {escape_token}\nIf not, continue working.";
  }
  const isCoordinatorAgent = getSubagentTypeName(config2.subagent_type) === "coordinator-agent";
  return new ClientContinuationConfig({
    idleThreshold: policy.idleThreshold,
    maxLoops: policy.maxLoops ?? 0,
    nudgeMessage,
    escapeMessageTemplate,
    collectBackgroundChildren: isCoordinatorAgent,
    childrenCompletedMessageTemplate: isCoordinatorAgent ? "The following background agents have completed:\n\n{summaries}\n\nReview their results. If more work is needed, spawn additional workers. Otherwise, wrap up." : ""
  });
}
var SubagentBlockedByHookError = class extends Error {
  constructor(message) {
    super(message);
    this.toolCallAuditOutcome = "denied";
    this.name = "SubagentBlockedByHookError";
  }
};
async function executeSubagentStartHook(params) {
  const env_1 = { stack: [], error: void 0, hasError: false };
  try {
    const { resourceAccessor, toolCallId, subagentId, subagentType, overriddenModelId, task, parentCtx, enableExecuteHookExec, configuredSteps } = params;
    const span = __addDisposableResource28(env_1, createSpan(parentCtx.withName("agent.lifecycleHook.subagentStart")), false);
    const hookCtx = span.ctx;
    const result = await executeRemoteSubagentStartHook({
      ctx: hookCtx,
      subagentId,
      subagentType,
      task,
      subagentModel: overriddenModelId,
      isParallelWorker: false,
      requestContext: {
        toolCallId,
        model: overriddenModelId
      },
      options: {
        resourceAccessor,
        enableExecuteHookExec,
        configuredSteps
      }
    });
    if (result.permission === "deny") {
      const denyMessage = result.userMessage ? `Subagent creation blocked by hook: ${result.userMessage}` : "Subagent creation blocked by hook";
      logger73.warn(hookCtx, "Subagent blocked by subagentStart hook", {
        toolCallId,
        subagentType,
        denyMessage
      });
      throw new SubagentBlockedByHookError(denyMessage);
    }
    if (result.permission === "ask") {
      const askMessage = "The 'ask' permission for subagentStart hooks is not yet implemented. Use 'allow' or 'deny' instead.";
      logger73.warn(hookCtx, "Subagent blocked - 'ask' permission not implemented", {
        toolCallId,
        subagentType
      });
      throw new SubagentBlockedByHookError(askMessage);
    }
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    __disposeResources28(env_1);
  }
}
async function executeSubagentStopHook(params) {
  const env_2 = { stack: [], error: void 0, hasError: false };
  try {
    const { resourceAccessor, toolCallId, subagentId, subagentType, overriddenModelId, status, durationMs, messageCount, toolCallCount: toolCallCount2, summary, errorMessage: errorMessage7, loopCount, task, description: description9, parentCtx, enableExecuteHookExec, configuredSteps } = params;
    const span = __addDisposableResource28(env_2, createSpan(parentCtx.withName("agent.lifecycleHook.subagentStop")), false);
    const hookCtx = span.ctx;
    const result = await executeRemoteSubagentStopHook({
      ctx: hookCtx,
      subagentId,
      subagentType,
      status,
      durationMs,
      summary,
      messageCount,
      toolCallCount: toolCallCount2,
      errorMessage: errorMessage7,
      loopCount,
      task,
      description: description9,
      requestContext: {
        toolCallId,
        model: overriddenModelId
      },
      options: {
        resourceAccessor,
        enableExecuteHookExec,
        configuredSteps
      }
    });
    return status === "completed" ? result.followupMessage : void 0;
  } catch (e_2) {
    env_2.error = e_2;
    env_2.hasError = true;
  } finally {
    __disposeResources28(env_2);
  }
}
async function extractLastAssistantMessage(ctx, newTurns, blobStore, logContext) {
  const env_3 = { stack: [], error: void 0, hasError: false };
  try {
    const span = __addDisposableResource28(env_3, createSpan(ctx.withName("extractLastAssistantMessage")), false);
    const spanCtx = span.ctx;
    span.span.setAttribute("turn_count", newTurns.length);
    for (let i = newTurns.length - 1; i >= 0; i--) {
      const turnBlobId = newTurns[i];
      const turnBlob = await blobStore.getBlob(spanCtx, turnBlobId);
      if (turnBlob === void 0) {
        logger73.warn(spanCtx, "Turn blob not found when extracting result", {
          toolCallId: logContext.toolCallId,
          subagentType: logContext.subagentType,
          turnIndex: logContext.turnsOffset + i
        });
        continue;
      }
      const turnStruct = ConversationTurnStructure.fromBinary(turnBlob);
      if (turnStruct.turn.case === "agentConversationTurn") {
        const stepsBlobIds = turnStruct.turn.value.steps;
        const steps = await collectConversationStepsFromStepBlobIds({
          ctx: spanCtx,
          stepBlobIds: stepsBlobIds,
          blobStore,
          logContext: {
            toolCallId: logContext.toolCallId,
            subagentType: logContext.subagentType,
            turnIndex: logContext.turnsOffset + i
          }
        });
        for (let j2 = steps.length - 1; j2 >= 0; j2--) {
          const step = steps[j2];
          if (step.message.case === "assistantMessage") {
            return step.message.value.text;
          }
        }
      }
    }
    return void 0;
  } catch (e_3) {
    env_3.error = e_3;
    env_3.hasError = true;
  } finally {
    __disposeResources28(env_3);
  }
}
async function collectConversationStepsFromStepBlobIds({ ctx, stepBlobIds, blobStore, logContext }) {
  const env_4 = { stack: [], error: void 0, hasError: false };
  try {
    const span = __addDisposableResource28(env_4, createSpan(ctx.withName("collectConversationStepsFromStepBlobIds")), false);
    const spanCtx = span.ctx;
    span.span.setAttribute("step_blob_count", stepBlobIds.length);
    const stepBlobs = await Promise.all(stepBlobIds.map((stepBlobId) => blobStore.getBlob(spanCtx, stepBlobId)));
    const conversationSteps = [];
    let missingStepCount = 0;
    for (const [stepIndex, stepBlob] of stepBlobs.entries()) {
      if (stepBlob === void 0) {
        missingStepCount++;
        if (logContext !== void 0) {
          logger73.warn(spanCtx, "Step blob not found when extracting result", {
            toolCallId: logContext.toolCallId,
            subagentType: logContext.subagentType,
            turnIndex: logContext.turnIndex,
            stepIndex
          });
        }
        continue;
      }
      conversationSteps.push(ConversationStep.fromBinary(stepBlob));
    }
    span.span.setAttribute("missing_step_blob_count", missingStepCount);
    span.span.setAttribute("conversation_step_count", conversationSteps.length);
    return conversationSteps;
  } catch (e_4) {
    env_4.error = e_4;
    env_4.hasError = true;
  } finally {
    __disposeResources28(env_4);
  }
}
async function collectConversationTurnStructures({ ctx, turns, blobStore }) {
  const env_5 = { stack: [], error: void 0, hasError: false };
  try {
    const span = __addDisposableResource28(env_5, createSpan(ctx.withName("collectConversationTurnStructures")), false);
    const spanCtx = span.ctx;
    span.span.setAttribute("turn_blob_count", turns.length);
    const turnBlobs = await Promise.all(turns.map((turnBlobId) => blobStore.getBlob(spanCtx, turnBlobId)));
    const turnStructs = [];
    let missingTurnCount = 0;
    for (const turnBlob of turnBlobs) {
      if (turnBlob === void 0) {
        missingTurnCount++;
        turnStructs.push(void 0);
        continue;
      }
      turnStructs.push(ConversationTurnStructure.fromBinary(turnBlob));
    }
    span.span.setAttribute("missing_turn_blob_count", missingTurnCount);
    span.span.setAttribute("conversation_turn_count", turnStructs.length);
    return turnStructs;
  } catch (e_5) {
    env_5.error = e_5;
    env_5.hasError = true;
  } finally {
    __disposeResources28(env_5);
  }
}
async function collectConversationStepsWithToolCallCount(ctx, turns, blobStore) {
  const env_6 = { stack: [], error: void 0, hasError: false };
  try {
    const span = __addDisposableResource28(env_6, createSpan(ctx.withName("collectConversationStepsWithToolCallCount")), false);
    const spanCtx = span.ctx;
    span.span.setAttribute("turn_count", turns.length);
    const turnStructs = await collectConversationTurnStructures({
      ctx: spanCtx,
      turns,
      blobStore
    });
    const stepsByTurn = await Promise.all(turnStructs.map((turnStruct) => {
      if (turnStruct?.turn.case !== "agentConversationTurn") {
        return [];
      }
      return collectConversationStepsFromStepBlobIds({
        ctx: spanCtx,
        stepBlobIds: turnStruct.turn.value.steps,
        blobStore
      });
    }));
    const conversationSteps = stepsByTurn.flat();
    const toolCallCount2 = conversationSteps.filter((step) => step.message.case === "toolCall").length;
    span.span.setAttribute("conversation_step_count", conversationSteps.length);
    span.span.setAttribute("tool_call_count", toolCallCount2);
    return { conversationSteps, toolCallCount: toolCallCount2 };
  } catch (e_6) {
    env_6.error = e_6;
    env_6.hasError = true;
  } finally {
    __disposeResources28(env_6);
  }
}
function extractFinalSummaryFromSteps(steps) {
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i];
    if (step.message.case !== "toolCall") {
      continue;
    }
    const tool = step.message.value.tool;
    if (tool.case === "sendFinalSummaryToolCall") {
      const summary = tool.value.args?.finalSummary?.trim();
      if (summary !== void 0 && summary.length > 0) {
        return summary;
      }
      continue;
    }
    if (tool.case === "communicateUpdateToolCall") {
      const summary = tool.value.args?.finalSummary?.trim();
      if (summary !== void 0 && summary.length > 0) {
        return summary;
      }
    }
  }
  return void 0;
}
function getTaskSuccessResultText(taskSuccess, options2) {
  const isPreformattedResponseBody2 = (text2) => text2.includes("<response>") && text2.includes("</response>");
  const lastAssistantOutput = taskSuccess.conversationSteps.toReversed().map((step) => step.message.case === "assistantMessage" ? step.message.value?.text : void 0).find((text2) => text2 !== void 0);
  const responseBody = lastAssistantOutput ?? "No output";
  if (options2?.hideAsyncSubagentTaskNotifications !== true) {
    const finalSummary = extractFinalSummaryFromSteps(taskSuccess.conversationSteps);
    if (finalSummary !== void 0) {
      return [
        "response:",
        "<user_visible_high_level_summary>",
        finalSummary,
        "</user_visible_high_level_summary>",
        "<response>",
        responseBody,
        "</response>"
      ].join("\n");
    }
  }
  if (lastAssistantOutput !== void 0 && isPreformattedResponseBody2(lastAssistantOutput)) {
    return ["response:", lastAssistantOutput].join("\n");
  }
  return ["response:", "<response>", responseBody, "</response>"].join("\n");
}
function renderTaskResultToString(taskResult, options2) {
  const enableAgentChatLinks = options2?.enableAgentChatLinks ?? true;
  const chatLinkExample = (agentId) => options2?.hideAsyncSubagentTaskNotifications === true ? `\`[Name](${agentId})\`. Don't use a generic label such as \`[agent]\`, \`[worker]\`, or \`[subagent]\`. For cloud subagents, when the agent has edited code, link to \`[Review](${agentId}#changes)\`, or, if you know the exact added and deleted line counts, \`[Review +A \u2212D](${agentId}#changes)\`, replacing A and D with those counts. Never write A or D literally. Use \`[Try Live](${agentId}#desktop)\` only when the agent used computer use` : `\`[label](${agentId})\``;
  switch (taskResult.result.case) {
    case "success": {
      const taskSuccess = taskResult.result.value;
      const agentIdInfo = taskSuccess.agentId ? options2?.cloudCoordinatorTaskVariant === true ? `

Agent ID: ${taskSuccess.agentId}${enableAgentChatLinks ? ` (to link to this agent/subagent in user-facing text use ${chatLinkExample(taskSuccess.agentId)})` : ""}` : `

Agent ID: ${taskSuccess.agentId} (can be used with the \`resume\` parameter to send a follow-up after it completes${enableAgentChatLinks ? `, or to link to this agent/subagent in user-facing text with ${chatLinkExample(taskSuccess.agentId)}` : ""})` : "";
      const suffixInfo = taskSuccess.resultSuffix ? `

${taskSuccess.resultSuffix}` : "";
      if (taskSuccess.backgroundReason !== SubagentBackgroundReason.UNSPECIFIED) {
        const statusText = formatSubagentBackgroundMessage(taskSuccess.backgroundReason, taskSuccess.transcriptPath, options2);
        return `${statusText}${agentIdInfo}${suffixInfo}`;
      }
      const messageText2 = getTaskSuccessResultText(taskSuccess, options2);
      return `This is the output of the subagent:

${messageText2}${agentIdInfo}${suffixInfo}`;
    }
    case "error":
      return `Error: ${taskResult.result.value.error}`;
    case void 0:
      return "Unknown error";
    default: {
      const _exhaustiveCheck = taskResult.result;
      throw new Error(`Unhandled result case: ${_exhaustiveCheck}`);
    }
  }
}
async function countToolCallsFromTurns(ctx, turns, blobStore) {
  const { toolCallCount: toolCallCount2 } = await collectConversationStepsWithToolCallCount(ctx, turns, blobStore);
  return toolCallCount2;
}
function createSubagentAgentConfig({ baseAgentConfig, subagentConfig, overriddenModelId, subagentInstanceId }) {
  const isNamedAgentSession = baseAgentConfig.namedAgentId !== void 0;
  const isComputerUseSubagent = subagentConfig.subagent_type.type.case === "computerUse";
  const subagentFeatureFlags = baseAgentConfig.featureFlags ? {
    ...baseAgentConfig.featureFlags,
    glassMetaParentAgent: false
  } : void 0;
  return {
    ...baseAgentConfig,
    featureFlags: subagentFeatureFlags,
    isCloudMetaAgentParent: false,
    // Server notices belong to the main conversation, never to subagents.
    preTurnAssistantNotice: void 0,
    // The routing disclosure is for the user-initiated parent turn; a subagent
    // turn runs its own (possibly overridden) model and must not record it.
    routedModelDisplayName: void 0,
    userInfoDisplayOptions: isComputerUseSubagent ? {
      ...baseAgentConfig.userInfoDisplayOptions,
      displaySkills: false,
      displayCursorRules: false,
      computerUseSubagentSurface: true,
      excludeAgentTranscripts: true
    } : baseAgentConfig.userInfoDisplayOptions,
    ...isNamedAgentSession && {
      namedAgentId: void 0,
      namedAgentSessionKey: void 0,
      namedAgentSessionKind: void 0,
      namedAgentName: void 0
    },
    // Subagents are not the Named Agent: never embed (or refresh) the
    // parent's self document in their user_info.
    getNamedAgentSelfDocument: void 0,
    getUserInfoMemoryContext: void 0,
    // Wrap toolsGenerator to apply toolsOverride from subagent config
    toolsGenerator: (props) => {
      const propsWithSubagentId = {
        ...props,
        isCloudMetaAgentParent: false,
        ...subagentInstanceId !== void 0 && { subagentInstanceId }
      };
      const propsForToolsOverride = {
        ...propsWithSubagentId,
        featureFlags: subagentFeatureFlags
      };
      const originalHandle = baseAgentConfig.toolsGenerator({
        ...propsWithSubagentId,
        subagentConfig
      });
      return originalHandle.transformToolsInPlace((tools) => applyToolsOverride(subagentConfig, tools, propsForToolsOverride, overriddenModelId));
    },
    // Use caller's system prompt unchanged (subagentType is injected for prompt pipeline).
    // For static reminders, we use user_message.subagent_system_reminder.
    // For function reminders, evaluate at prompt-generation time where tool metadata is available.
    // When systemPromptOverride is set, use it instead for a full prompt replacement.
    systemPromptGenerator: (internalProps, toolSetHandle) => {
      const internalPropsWithSubagentType = {
        ...internalProps,
        isCloudMetaAgentParent: false,
        subagentType: subagentConfig.subagent_type
      };
      const baseSystemPrompt = (() => {
        if (subagentConfig.systemPromptOverride) {
          return subagentConfig.systemPromptOverride(internalPropsWithSubagentType, toolSetHandle, {
            subagentInstanceId,
            baseSystemPromptGenerator: baseAgentConfig.systemPromptGenerator
          });
        }
        return baseAgentConfig.systemPromptGenerator(internalPropsWithSubagentType, toolSetHandle);
      })();
      const reminderGenerator = subagentConfig.systemReminder;
      if (reminderGenerator === void 0 || reminderGenerator.length === 0) {
        return baseSystemPrompt;
      }
      const generatedReminder = reminderGenerator(toolSetHandle).trim();
      if (generatedReminder.length === 0) {
        return baseSystemPrompt;
      }
      return `<system_reminder>
${generatedReminder}
</system_reminder>

${baseSystemPrompt}`;
    },
    // Pass through messageHistoryModifier from subagent config if present
    messageHistoryModifier: subagentConfig.messageHistoryModifier ?? void 0
  };
}
function createUserMessageAction(subagentConfig, prompt, messageId, useAskMode, selectedContext, sentByAgentId) {
  const reminderGenerator = subagentConfig.systemReminder;
  const staticSystemReminder = reminderGenerator !== void 0 && reminderGenerator.length === 0 ? reminderGenerator() : void 0;
  const userMessage2 = new UserMessage({
    text: prompt,
    messageId,
    mode: useAskMode ? AgentMode.ASK : AgentMode.AGENT,
    selectedContext,
    ...staticSystemReminder !== void 0 && staticSystemReminder !== "" && {
      subagentSystemReminder: staticSystemReminder
    },
    ...sentByAgentId !== void 0 && sentByAgentId !== "" && { sentByAgentId }
  });
  return new ConversationAction({
    action: {
      case: "userMessageAction",
      value: new UserMessageAction({
        userMessage: userMessage2
      })
    }
  });
}
async function getLatestParentCursorCommands(ctx, stateHandler) {
  for (let i = stateHandler.turns.length - 1; i >= 0; i--) {
    const turn = await stateHandler.turns[i].get(ctx);
    if (turn.userMessage === void 0) {
      continue;
    }
    const userMessage2 = await turn.userMessage.get(ctx);
    if (userMessage2.isSimulatedMsg === true) {
      continue;
    }
    const redactedContext = userMessage2.selectedContext;
    if (!redactedContext) {
      return void 0;
    }
    const selectedContext = fromRedactedSelectedContext(redactedContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    const cursorCommands = selectedContext.cursorCommands;
    if (cursorCommands.length === 0) {
      return void 0;
    }
    return cursorCommands;
  }
  return void 0;
}
async function getUserAttachedVideoPaths(ctx, stateHandler) {
  const videoPaths = /* @__PURE__ */ new Set();
  for (const turnHandle of stateHandler.turns) {
    const turn = await turnHandle.get(ctx);
    if (turn.userMessage === void 0) {
      continue;
    }
    const userMessage2 = await turn.userMessage.get(ctx);
    if (userMessage2.isSimulatedMsg === true) {
      continue;
    }
    const redactedContext = userMessage2.selectedContext;
    if (!redactedContext) {
      continue;
    }
    const selectedContext = fromRedactedSelectedContext(redactedContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    for (const selectedVideo of selectedContext.selectedVideos) {
      const videoPath = selectedVideo.path.trim();
      if (videoPath.length > 0) {
        videoPaths.add(videoPath);
      }
    }
  }
  return [...videoPaths];
}
function getEffectiveReadonlyForSubagent(subagentConfig) {
  return subagentConfig.permissionMode === CustomSubagentPermissionMode.READONLY;
}
function shouldUseAskModeForSubagent(effectiveReadonly, subagentConfig) {
  return effectiveReadonly && !subagentConfig.computeAllowedWritePaths;
}
function createTaskToolCall(taskTool) {
  return new ToolCall({
    tool: {
      case: "taskToolCall",
      value: taskTool
    }
  });
}
var PROVIDER_ERROR_PREFIX = "Provider error:";
var NOT_FOUND_ERROR_PREFIX = "Not found error:";
var API_ERROR_PREFIX = "API Error:";
var TASK_ERROR_SHAPE_MAX_JSON_CHARS = 4e3;
var TASK_ERROR_SHAPE_MAX_KEYS = 50;
function buildTaskErrorShapeSnapshot(error42) {
  const seen = /* @__PURE__ */ new WeakSet();
  const stringifyReplacer = (_key, value) => {
    if (value instanceof Error) {
      const maybeCode = "code" in value && (typeof value.code === "string" || typeof value.code === "number") ? value.code : void 0;
      const maybeCause = "cause" in value && value.cause !== void 0 ? value.cause : void 0;
      return {
        __error: true,
        name: value.name,
        message: value.message,
        ...value.stack !== void 0 ? { stack: value.stack } : {},
        ...maybeCode !== void 0 ? { code: maybeCode } : {},
        ...maybeCause !== void 0 ? { cause: maybeCause } : {}
      };
    }
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }
    return value;
  };
  const base = {
    typeof: typeof error42,
    isErrorInstance: error42 instanceof Error
  };
  if (error42 instanceof Error) {
    const maybeCode = "code" in error42 && (typeof error42.code === "string" || typeof error42.code === "number") ? error42.code : void 0;
    const maybeCause = "cause" in error42 && error42.cause !== void 0 ? error42.cause : void 0;
    return {
      ...base,
      constructorName: error42.constructor?.name,
      name: error42.name,
      message: error42.message,
      ...maybeCode !== void 0 ? { code: maybeCode } : {},
      ...maybeCause !== void 0 ? { causeTypeof: typeof maybeCause } : {},
      ...error42.stack !== void 0 ? { hasStack: true } : {}
    };
  }
  if (typeof error42 === "object" && error42 !== null) {
    const objectError = error42;
    const ownKeys = Object.keys(objectError);
    let jsonPreview;
    try {
      const serialized = JSON.stringify(objectError, stringifyReplacer);
      if (serialized !== void 0) {
        jsonPreview = serialized.length > TASK_ERROR_SHAPE_MAX_JSON_CHARS ? `${serialized.slice(0, TASK_ERROR_SHAPE_MAX_JSON_CHARS)}...<truncated>` : serialized;
      }
    } catch (serializationError) {
      jsonPreview = `serialization_failed:${String(serializationError)}`;
    }
    return {
      ...base,
      constructorName: objectError.constructor?.name,
      ownKeys: ownKeys.slice(0, TASK_ERROR_SHAPE_MAX_KEYS),
      ownKeyCount: ownKeys.length,
      ...typeof objectError.message === "string" ? { message: objectError.message } : {},
      ...jsonPreview !== void 0 ? { jsonPreview } : {}
    };
  }
  return {
    ...base,
    stringValue: String(error42)
  };
}
function readNumericStatus(value) {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed2 = Number(value);
    return Number.isFinite(parsed2) ? parsed2 : void 0;
  }
  return void 0;
}
function parseProviderErrorFromMessage(errorMessage7) {
  const payloadCandidates = [];
  const knownPrefixes = [PROVIDER_ERROR_PREFIX, NOT_FOUND_ERROR_PREFIX];
  for (const prefix of knownPrefixes) {
    const prefixIndex = errorMessage7.indexOf(prefix);
    if (prefixIndex >= 0) {
      const rawPayload = errorMessage7.slice(prefixIndex + prefix.length).trim();
      if (rawPayload.length > 0) {
        payloadCandidates.push(rawPayload);
      }
    }
  }
  const apiErrorIndex = errorMessage7.indexOf(API_ERROR_PREFIX);
  if (apiErrorIndex >= 0) {
    const apiErrorSection = errorMessage7.slice(apiErrorIndex + API_ERROR_PREFIX.length).trim();
    const fencedJsonMatch = /```(?:json)?\s*([\s\S]*?)\s*```/i.exec(apiErrorSection);
    if (fencedJsonMatch !== null && fencedJsonMatch[1].trim().length > 0) {
      payloadCandidates.push(fencedJsonMatch[1].trim());
    }
  }
  for (const rawPayload of payloadCandidates) {
    try {
      const parsed2 = JSON.parse(rawPayload);
      if (typeof parsed2 !== "object" || parsed2 === null) {
        continue;
      }
      const envelope = parsed2;
      const status = readNumericStatus(envelope.error?.provider?.status) ?? readNumericStatus(envelope.error?.code);
      return {
        reason: typeof envelope.error?.reason === "string" ? envelope.error.reason : void 0,
        type: typeof envelope.error?.type === "string" ? envelope.error.type : void 0,
        status
      };
    } catch {
    }
  }
  return void 0;
}
function getObjectMessage(value) {
  if (typeof value === "object" && value !== null && "message" in value && typeof value.message === "string") {
    return value.message;
  }
  return void 0;
}
function getNestedErrorObject(value) {
  if (typeof value === "object" && value !== null && "error" in value) {
    return value.error;
  }
  return void 0;
}
function collectTaskProviderErrorCandidateMessages(error42) {
  const candidateMessages = [];
  const pushMessage = (message) => {
    if (message !== void 0 && !candidateMessages.includes(message)) {
      candidateMessages.push(message);
    }
  };
  pushMessage(getObjectMessage(error42));
  const cause = typeof error42 === "object" && error42 !== null && "cause" in error42 ? error42.cause : void 0;
  pushMessage(getObjectMessage(cause));
  pushMessage(getObjectMessage(getNestedErrorObject(cause)));
  pushMessage(getObjectMessage(getNestedErrorObject(error42)));
  return candidateMessages;
}
function classifyTaskProviderError(error42) {
  const candidateMessages = collectTaskProviderErrorCandidateMessages(error42);
  if (candidateMessages.length === 0) {
    return void 0;
  }
  for (const message of candidateMessages) {
    const parsedProviderError = parseProviderErrorFromMessage(message);
    if (parsedProviderError === void 0 || !(parsedProviderError.reason === "provider_error" || parsedProviderError.type === "provider" || parsedProviderError.status !== void 0)) {
      continue;
    }
    const statusCode = parsedProviderError.status;
    const classification = statusCode === 429 || statusCode !== void 0 && statusCode >= 500 ? ToolErrorClassification.PROVIDER_ERROR : ToolErrorClassification.OTHER_ERROR;
    const details = statusCode === void 0 ? message : `${message}. provider_status=${statusCode}`;
    return new CustomToolCallError(classification, {
      clientVisibleErrorMessage: message,
      modelVisibleErrorMessage: message,
      error: details
    });
  }
  return void 0;
}
function shouldBubbleTaskErrorToOuterRetryLayer(ctx, error42, runStreamCompleted) {
  if (!getShouldBubbleRetryableTaskErrorsFromContext(ctx) || runStreamCompleted) {
    return false;
  }
  const providerError = classifyTaskProviderError(error42);
  if (providerError !== void 0 && providerError.classification === ToolErrorClassification.PROVIDER_ERROR) {
    return true;
  }
  const connectErrorCode = getConnectErrorCode(error42);
  return connectErrorCode === Code.Unavailable || connectErrorCode === Code.DeadlineExceeded || connectErrorCode === Code.ResourceExhausted;
}
var StreamingTaskInteractionListener = class {
  constructor(interactionHandler, toolCallId) {
    this.interactionHandler = interactionHandler;
    this.toolCallId = toolCallId;
  }
  async sendUpdate(ctx, update) {
    await this.interactionHandler.emitToolCallDelta(ctx, this.toolCallId, new ToolCallDelta({
      delta: {
        case: "taskToolCallDelta",
        value: new TaskToolCallDelta({
          interactionUpdate: update
        })
      }
    }));
  }
  async query(_ctx, query) {
    switch (query.query.case) {
      case "webSearchRequestQuery":
        return Responses.webSearchApproved(query.id);
      case "webFetchRequestQuery":
        return Responses.webFetchApproved(query.id);
      case "generateImageRequestQuery":
        return Responses.generateImageApproved(query.id);
      default: {
        throw new Error(`Unhandled interaction query type: ${query.query.case}`);
      }
    }
  }
};
function maybeAppendInterruptRetryHint(error42, enableSubagentInterrupt, interruptAlreadyRequested) {
  if (!enableSubagentInterrupt || interruptAlreadyRequested || error42 !== RUNNING_SUBAGENT_FOLLOWUP_ERROR) {
    return error42;
  }
  return `${error42}
${RUNNING_SUBAGENT_INTERRUPT_RETRY_HINT}`;
}
function taskEnvironmentToProto(environment) {
  switch (environment) {
    case "cloud":
      return SubagentExecutionEnvironment.CLOUD;
    case "local":
      return SubagentExecutionEnvironment.LOCAL;
    default:
      return SubagentExecutionEnvironment.UNSPECIFIED;
  }
}
function targetMachineToEnvironment(target) {
  return target.type === "same_machine" ? SubagentExecutionEnvironment.LOCAL : SubagentExecutionEnvironment.CLOUD;
}
function toClientSubagentPlacement(target) {
  switch (target.type) {
    case "same_machine":
      return {
        environment: SubagentExecutionEnvironment.LOCAL,
        cloudBaseBranch: void 0
      };
    case "new_cloud_vm":
      return {
        environment: SubagentExecutionEnvironment.CLOUD,
        cloudBaseBranch: target.base_branch
      };
    case "self_hosted_worker":
    case "self_hosted_pool":
      throw new ToolCallArgParseError("Invalid arguments:\nSelf-hosted machine placement requires server-side first-class subagent execution and is not supported by a fresh client-executed Task.");
    default: {
      const exhaustiveTarget = target;
      throw new ToolCallArgParseError(`Invalid arguments:
Unsupported machine placement for a fresh client-executed Task: ${JSON.stringify(exhaustiveTarget)}.`);
    }
  }
}
function targetMachineFromLegacyArgs(args) {
  if (args.environment !== "cloud") {
    return { type: "same_machine" };
  }
  const baseBranch = args.cloud_base_branch?.trim();
  const buildId = args.cloud_requested_environment_build_id?.trim();
  return {
    type: "new_cloud_vm",
    ...baseBranch !== void 0 && baseBranch.length > 0 ? { base_branch: baseBranch } : {},
    ...buildId !== void 0 && buildId.length > 0 ? { environment_build_id: buildId } : {}
  };
}
function targetMachineToProto(target) {
  switch (target.type) {
    case "same_machine":
      return new TargetMachine({
        machine: {
          case: "sameMachine",
          value: new SameMachineTarget()
        }
      });
    case "new_cloud_vm":
      return new TargetMachine({
        machine: {
          case: "newCloudVm",
          value: new NewCloudVmTarget({
            environmentBuildId: target.environment_build_id,
            baseBranch: target.base_branch
          })
        }
      });
    case "self_hosted_worker":
      return new TargetMachine({
        machine: {
          case: "selfHostedWorker",
          value: new SelfHostedWorkerTarget({
            workerId: target.worker_id
          })
        }
      });
    case "self_hosted_pool":
      return new TargetMachine({
        machine: {
          case: "selfHostedPool",
          value: new SelfHostedPoolTarget({
            pool: target.pool,
            labels: Object.entries(target.labels ?? {}).map(([key, value]) => new SelfHostedWorkerLabel({ key, value }))
          })
        }
      });
  }
}
function targetMachineFromProto(proto) {
  switch (proto?.machine.case) {
    case "sameMachine":
      return { type: "same_machine" };
    case "newCloudVm":
      return {
        type: "new_cloud_vm",
        ...proto.machine.value.environmentBuildId !== void 0 ? { environment_build_id: proto.machine.value.environmentBuildId } : {},
        ...proto.machine.value.baseBranch !== void 0 ? { base_branch: proto.machine.value.baseBranch } : {}
      };
    case "selfHostedWorker":
      return {
        type: "self_hosted_worker",
        worker_id: proto.machine.value.workerId
      };
    case "selfHostedPool":
      return {
        type: "self_hosted_pool",
        ...proto.machine.value.pool !== void 0 ? { pool: proto.machine.value.pool } : {},
        ...proto.machine.value.labels.length > 0 ? {
          labels: Object.fromEntries(proto.machine.value.labels.map((label) => [label.key, label.value]))
        } : {}
      };
    default:
      return void 0;
  }
}
function buildCloudSubagentPersistedState(args) {
  return new SubagentPersistedState({
    environment: SubagentExecutionEnvironment.CLOUD,
    cloudSubagent: new CloudSubagentReference({
      bcId: args.bcId,
      transcriptPath: args.transcriptPath
    }),
    modelId: args.modelId,
    machine: targetMachineToProto(args.machine)
  });
}
function isResumeSelfForkRequest(resume) {
  return resume?.trim().toLowerCase() === TASK_RESUME_SELF_SENTINEL;
}
function assertResumeSelfForkAllowed(args, allowResumeSelfFork) {
  if (allowResumeSelfFork || !isResumeSelfForkRequest(args.resume)) {
    return;
  }
  throw new ToolCallArgParseError(`Invalid arguments:
resume: "${TASK_RESUME_SELF_SENTINEL}" is not supported. Use a valid requestId or do not specify the resume parameter.`);
}
function assertMachineAndLegacyArgsNotBothSet(args) {
  if (args.machine === void 0) {
    return;
  }
  const conflicting = ["environment", "cloud_base_branch", "cloud_requested_environment_build_id"].filter((key) => args[key] !== void 0);
  if (conflicting.length > 0) {
    throw new ToolCallArgParseError(`Invalid arguments:
machine replaces ${conflicting.join(", ")}; specify machine alone.`);
  }
}
function assertCloudOnlyTaskArgsAllowed(args) {
  const hasCloudBaseBranch = args.cloud_base_branch !== void 0 && args.cloud_base_branch.trim().length > 0;
  if (hasCloudBaseBranch && args.environment !== "cloud") {
    throw new ToolCallArgParseError("Invalid arguments:\ncloud_base_branch may only be specified when environment equals cloud.");
  }
  const hasRequestedBuild = args.cloud_requested_environment_build_id !== void 0 && args.cloud_requested_environment_build_id.trim().length > 0;
  if (hasRequestedBuild && args.environment !== "cloud") {
    throw new ToolCallArgParseError("Invalid arguments:\ncloud_requested_environment_build_id may only be specified when environment equals cloud.");
  }
}
async function resolveSubagentModel(args) {
  const { subagentConfig, requestedModel, parentModelId, enableExploreParentModelInheritance = false, forceModelId, subagentModelForcePolicy, parentMaxMode, subagentModels, isModelBlocked, isModelValid = () => true, compareModelCosts, requiresMaxMode, logContext } = args;
  const userRequestedModelId = subagentConfig.userRequestedModelId;
  const forceDefaultModel = subagentConfig.forceDefaultModel === true;
  const isExploreSubagent = getSubagentTypeName(subagentConfig.subagent_type) === EXPLORE_SUBAGENT_TYPE;
  const allowedModelSlugs = [...subagentModels.modelsBySlug.keys()].sort();
  const allowedModelSlugList = allowedModelSlugs.length > 0 ? allowedModelSlugs.map((slug) => `- ${slug}`).join("\n") : "- (none)";
  const buildInvalidRequestedModelError = (requestedModelValue, reason) => {
    const reasonText = reason === void 0 ? "Model could not be resolved to a valid subagent model." : reason;
    return `Invalid model selection "${requestedModelValue}". ${reasonText}
Allowed model slugs:
${allowedModelSlugList}

The \`model\` parameter is optional. If omitted, the subagent uses the same model as the parent agent.`;
  };
  const buildNoUsableSubagentModelError = () => `No usable model is available for this subagent. The parent model "${parentModelId}" is blocked or unavailable, and no configured subagent default can be used.
Allowed model slugs:
${allowedModelSlugList}

Choose a supported model with the \`model\` parameter or omit this subagent call.`;
  const logResolvedModel = ({ resolvedModelId, modelResolutionReason, reasonDetails }) => {
    if (!logContext) {
      return resolvedModelId;
    }
    const parentRequestId = getRequestId(logContext.ctx);
    if (!parentRequestId) {
      return resolvedModelId;
    }
    logger73.info(logContext.ctx, "Subagent model resolved", {
      parentRequestId,
      rootParentRequestId: getRootParentRequestId(logContext.ctx) ?? parentRequestId,
      subagentRequestId: logContext.subagentRequestId,
      parentAgentToolCallId: logContext.parentAgentToolCallId,
      modelId: resolvedModelId,
      modelResolutionReason,
      ...reasonDetails
    });
    return resolvedModelId;
  };
  const p2 = parentModelId.toLowerCase();
  const parentIsGenericbaseModel = p2.startsWith("genericbase-");
  const parentIsAutoSmartModel = p2 === "auto-smart";
  const parentIsAutoModel = parentIsAutoSmartModel || p2 === "default" || p2 === "premium" || p2 === "auto-low" || p2 === "auto-medium" || p2 === "auto-high";
  const subagentHasExplicitDefaultModels = subagentConfig.defaultModelIds !== void 0 && subagentConfig.defaultModelIds.length > 0;
  const configuredDefaultModelIds = new Set((subagentConfig.defaultModelIds ?? []).map((modelId) => canonicalSubagentComposerSlug(modelId)));
  const isMaxModeCompatible = async (modelId) => {
    if (requiresMaxMode === void 0) {
      return true;
    }
    const modelRequiresMaxMode = await requiresMaxMode(modelId);
    return parentMaxMode || !modelRequiresMaxMode;
  };
  let parentModelUsablePromise;
  const isParentModelUsable = () => {
    parentModelUsablePromise ??= (async () => !isModelBlocked(parentModelId) && await isMaxModeCompatible(parentModelId))();
    return parentModelUsablePromise;
  };
  if (parentIsAutoModel && userRequestedModelId === void 0 && requestedModel === void 0 && !subagentHasExplicitDefaultModels && await isParentModelUsable()) {
    return logResolvedModel({
      resolvedModelId: parentModelId,
      modelResolutionReason: "parent_auto_model",
      reasonDetails: {
        parentModelId
      }
    });
  }
  const logResolvedCandidateModel = ({ candidateModelId, modelResolutionReason, reasonDetails }) => {
    const canonicalCandidateModelId = canonicalSubagentComposerSlug(candidateModelId);
    const shouldPreserveGenericbaseParentModel = parentIsGenericbaseModel && (isComposerSubagentDefaultId(canonicalCandidateModelId) || configuredDefaultModelIds.has(canonicalCandidateModelId));
    if (!shouldPreserveGenericbaseParentModel) {
      return logResolvedModel({
        resolvedModelId: candidateModelId,
        modelResolutionReason,
        reasonDetails
      });
    }
    return logResolvedModel({
      resolvedModelId: parentModelId,
      modelResolutionReason,
      reasonDetails: {
        ...reasonDetails ?? {},
        preserveGenericbaseParentModel: true,
        genericbaseParentModelId: parentModelId,
        originalCandidateModelId: candidateModelId,
        canonicalCandidateModelId
      }
    });
  };
  const forcedModelId = await tryResolveForcedSubagentModel({
    subagentModelForcePolicy,
    forceModelId,
    userRequestedModelId,
    isModelBlocked,
    isModelValid,
    isMaxModeCompatible,
    logForcedModel: logResolvedCandidateModel
  });
  if (forcedModelId !== void 0) {
    return forcedModelId;
  }
  if (subagentModelForcePolicy === SubagentModelForcePolicy.ParentPin && forceModelId !== void 0) {
    throw new ToolCallArgParseError(buildNoUsableSubagentModelError());
  }
  let resolvedRequestedModelId;
  const requestedModelIsInherit = requestedModel?.trim().toLowerCase() === "inherit";
  if (requestedModel !== void 0 && !requestedModelIsInherit) {
    const trimmedRequestedModel = requestedModel.trim();
    if (trimmedRequestedModel.length === 0) {
      throw new ToolCallArgParseError(buildInvalidRequestedModelError(requestedModel, "Model must be a non-empty string when provided."));
    }
    const normalizedRequestedModel = normalizeTaskArgModelInput(trimmedRequestedModel, subagentModels.modelsBySlug);
    const aliasNormalizedRequestedModel = subagentModels.normalizeSlugAlias?.(normalizedRequestedModel) ?? normalizedRequestedModel;
    const requestedModelMatchesParentModel = (!parentIsAutoModel || parentIsAutoSmartModel) && (trimmedRequestedModel === parentModelId || aliasNormalizedRequestedModel === parentModelId);
    const requestedModelId = requestedModelMatchesParentModel ? parentModelId : resolveTaskArgToSubagentComposerSlug(trimmedRequestedModel, subagentModels.modelsBySlug, subagentModels.normalizeSlugAlias);
    const requestedModelIsUsable = requestedModelId !== void 0 && (requestedModelMatchesParentModel || isModelValid(requestedModelId)) && !isModelBlocked(requestedModelId) && await isMaxModeCompatible(requestedModelId);
    if (!requestedModelIsUsable) {
      if (trimmedRequestedModel.toLowerCase() === "fast") {
        if (logContext) {
          const parentRequestId = getRequestId(logContext.ctx);
          logger73.info(logContext.ctx, "Ignoring unresolvable 'fast' model alias from task tool args", {
            parentRequestId,
            parentAgentToolCallId: logContext.parentAgentToolCallId,
            subagentRequestId: logContext.subagentRequestId,
            requestedModelAlias: trimmedRequestedModel,
            resolvedRequestedModelId: requestedModelId
          });
        }
      } else {
        throw new ToolCallArgParseError(buildInvalidRequestedModelError(trimmedRequestedModel));
      }
    } else {
      resolvedRequestedModelId = requestedModelId;
    }
  }
  if (requestedModel && resolvedRequestedModelId && !forceDefaultModel) {
    return logResolvedCandidateModel({
      candidateModelId: resolvedRequestedModelId,
      modelResolutionReason: "tool_arg_model_alias",
      reasonDetails: {
        requestedModelAlias: requestedModel,
        resolvedAliasModelId: resolvedRequestedModelId
      }
    });
  }
  if (subagentConfig.inheritParentModel === true && await isParentModelUsable()) {
    return logResolvedModel({
      resolvedModelId: parentModelId,
      modelResolutionReason: "subagent_config_inherit_parent_model",
      reasonDetails: {
        parentModelId
      }
    });
  }
  if (userRequestedModelId && !isModelBlocked(userRequestedModelId) && await isMaxModeCompatible(userRequestedModelId)) {
    if (!isModelValid(userRequestedModelId)) {
      if (await isParentModelUsable()) {
        return logResolvedModel({
          resolvedModelId: parentModelId,
          modelResolutionReason: "user_requested_model_invalid_fallback_parent",
          reasonDetails: {
            userRequestedModelId,
            parentModelId
          }
        });
      }
    } else {
      return logResolvedCandidateModel({
        candidateModelId: userRequestedModelId,
        modelResolutionReason: "user_requested_model_from_subagent_config",
        reasonDetails: {
          userRequestedModelId
        }
      });
    }
  }
  if (enableExploreParentModelInheritance && isExploreSubagent && !isComposerSubagentDefaultId(parentModelId) && subagentModels.modelsBySlug.has(parentModelId) && !isModelBlocked(parentModelId) && isModelValid(parentModelId) && await isMaxModeCompatible(parentModelId)) {
    return logResolvedModel({
      resolvedModelId: parentModelId,
      modelResolutionReason: "explore_parent_model",
      reasonDetails: {
        parentModelId
      }
    });
  }
  if (subagentConfig.defaultModelIds && subagentConfig.defaultModelIds.length > 0) {
    const useOrderedExploreComposerCandidates = isExploreSubagent && subagentConfig.defaultModelIds.length > 1;
    const defaultModelCandidates = useOrderedExploreComposerCandidates ? orderedExploreSubagentComposerIds(subagentConfig.defaultModelIds, parentModelId, compareModelCosts) : subagentConfig.defaultModelIds;
    for (const modelId of defaultModelCandidates) {
      if (isExploreSubagent && compareModelCosts(modelId, parentModelId) > 0) {
        continue;
      }
      if (isModelValid(modelId) && !isModelBlocked(modelId) && await isMaxModeCompatible(modelId)) {
        return logResolvedCandidateModel({
          candidateModelId: modelId,
          modelResolutionReason: "subagent_default_model",
          reasonDetails: {
            selectedDefaultModelId: modelId
          }
        });
      }
    }
  }
  if (await isParentModelUsable()) {
    return logResolvedModel({
      resolvedModelId: parentModelId,
      modelResolutionReason: "fallback_parent_model",
      reasonDetails: {
        parentModelId,
        requestedModelAlias: requestedModel,
        userRequestedModelId,
        forceModelId
      }
    });
  }
  throw new ToolCallArgParseError(buildNoUsableSubagentModelError());
}
var blankToUndefined = (val) => typeof val === "string" && val.trim() === "" ? void 0 : val;
var sameMachineSchema = external_exports.object({ type: external_exports.literal("same_machine") }).strict().describe("Run on this machine, sharing its checkout and branch. The default.");
var selfHostedWorkerSchema = external_exports.object({
  type: external_exports.literal("self_hosted_worker"),
  worker_id: external_exports.string().min(1).describe("Worker to run on, from cursor-cloud-list-self-hosted-workers. Only your own machines can be targeted this way; use self_hosted_pool for a team pool worker. Check that tool's sharedAssignmentAllowed first: a shared worker runs this subagent alongside others, otherwise the subagent waits for the worker to free up.")
}).strict().describe("Run on one specific self-hosted worker of your own. The subagent uses that machine's existing checkout and branch, so it cannot be given a base branch.");
var selfHostedPoolSchema = external_exports.object({
  type: external_exports.literal("self_hosted_pool"),
  pool: external_exports.string().optional().describe("Pool to draw a worker from. Defaults to the team's default pool."),
  labels: external_exports.record(external_exports.string()).optional().describe("Key/value labels a candidate worker must all match.")
}).strict().describe("Run on any free worker in a self-hosted pool. Pool workers are claimed exclusively, so the subagent queues until one is free.");
function buildTargetMachineField(options2) {
  const newCloudVmSchema = external_exports.object({
    type: external_exports.literal("new_cloud_vm"),
    base_branch: external_exports.preprocess(blankToUndefined, external_exports.string().optional().describe("Branch the subagent's own generated branch starts from. Defaults to the current branch. Uses the remote version, so uncommitted or unpushed work is not visible.")),
    ...options2.includeEnvironmentBuildId ? {
      environment_build_id: external_exports.preprocess(blankToUndefined, external_exports.string().optional().describe("Exact environment build id (e.g. bld-YYYYMMDD-<uuid>) for the subagent's VM to boot from, instead of the environment's latest successful build. Must belong to the same team and environment; an invalid or inaccessible build fails the subagent."))
    } : {}
  }).strict().describe("Run on a dedicated cloud VM with its own clone and generated branch. After the subagent finishes, follow user instructions on whether to merge that branch, check it out, or neither.");
  const arms = [
    sameMachineSchema,
    newCloudVmSchema,
    ...options2.includeSelfHostedTargets ? [selfHostedWorkerSchema, selfHostedPoolSchema] : []
  ];
  return external_exports.discriminatedUnion("type", arms).optional().describe("Optional placement: where the subagent runs. Omit to run on this machine, which is almost always right. ONLY set this if the user explicitly asks for a cloud subagent or a specific machine.");
}
function buildTaskParametersSchema(configs, options2) {
  const inheritGuidance = options2.subagentInheritGuidance ?? options2.subagentModelsInUserInfo === true;
  const modelListLocationSentence = options2.subagentModelsInUserInfo === true ? "The available model slugs are listed in <available_subagent_models> in the initial user-info message. " : "The available model slugs are listed in this tool's description. ";
  const modelFailureModeSentence = "An invalid slug fails the call with the allowed list \u2014 pick a listed slug or omit this parameter; never retry an invalid slug unchanged. ";
  const baseModelDescription = options2.modelParameterDescription ?? (inheritGuidance ? `Optional model slug for this agent. If provided, it must resolve to one of the available model slugs. ${modelListLocationSentence}${modelFailureModeSentence}If omitted, the subagent uses the same model as the parent agent. Do not pass if resume field is set (prior model will be used). Use "inherit" unless the user explicitly requested another listed model.` : `Optional model slug for this agent. If provided, it must resolve to one of the available model slugs. ${modelListLocationSentence}${modelFailureModeSentence}If omitted, the subagent uses the same model as the parent agent. Do not pass if resume field is set (prior model will be used). Only choose an explicit model when the user directly requests it.`);
  const configNames = configs.map((c) => getSubagentTypeName(c.subagent_type));
  const enumValues = configNames;
  const normalizedToCanonical = /* @__PURE__ */ new Map();
  for (const canonicalName of configNames) {
    const normalizedName = normalizeSubagentTypeName(canonicalName);
    normalizedToCanonical.set(normalizedName, canonicalName);
  }
  const resumeOnlyNames = (options2.resumeOnlySubagentConfigs ?? []).map((config2) => getSubagentTypeName(config2.subagent_type));
  const parsingNormalizedToCanonical = new Map(normalizedToCanonical);
  for (const canonicalName of resumeOnlyNames) {
    const normalizedName = normalizeSubagentTypeName(canonicalName);
    if (!parsingNormalizedToCanonical.has(normalizedName)) {
      parsingNormalizedToCanonical.set(normalizedName, canonicalName);
    }
  }
  const promptField = external_exports.string().refine((value) => value.trim().length > 0, {
    message: "prompt is required"
  }).describe("The task for the agent to perform");
  const modelField = external_exports.preprocess((value) => value === null ? void 0 : value, external_exports.string().optional()).describe(baseModelDescription);
  const supportsAsyncSubagentResume = options2.useClientSideSubagent || options2.includeRunInBackgroundInTaskSchema === true;
  const baseResumeDescription = supportsAsyncSubagentResume ? `Optional agent ID to resume from. If provided, sends a follow-up message to the agent after it has completed. Requests to a currently running asynchronous agent ${options2.enableSubagentInterrupt ? "fail unless `interrupt` is true; set `interrupt` to true only when you intend to interrupt the running agent." : "fail; wait for completion before resuming."}` : "Optional agent ID to resume from. If provided, the agent will continue from the previous execution transcript.";
  const resumeFieldDescription = options2.allowResumeSelfFork ? `${baseResumeDescription} Use "${TASK_RESUME_SELF_SENTINEL}" to start a new agent with your own entire conversation history as a starting point (aka 'self-fork').` : baseResumeDescription;
  const resumeField = external_exports.string().optional().describe(resumeFieldDescription);
  const interruptField = external_exports.boolean().optional().describe("If true and `resume` targets a running async agent, interrupt the current run and send this prompt immediately. Only use when the user explicitly asks to interrupt or change what the running agent is doing.");
  const defaultSubagentTypeName = configNames.includes(GENERAL_PURPOSE_SUBAGENT_TYPE) ? GENERAL_PURPOSE_SUBAGENT_TYPE : enumValues[0];
  const normalizeSubagentTypeWithNames = (value, names3) => {
    if (value === null || value === void 0)
      return void 0;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length === 0)
        return void 0;
      const normalizedInput = normalizeSubagentTypeName(trimmed);
      const canonicalName = names3.get(normalizedInput);
      return canonicalName ?? trimmed;
    }
    return value;
  };
  const normalizeSubagentType = (value) => normalizeSubagentTypeWithNames(value, normalizedToCanonical);
  const preprocessSubagentType = (value) => {
    const normalized = normalizeSubagentType(value);
    return normalized === void 0 ? defaultSubagentTypeName : normalized;
  };
  const normalizeParsingSubagentType = (value) => normalizeSubagentTypeWithNames(value, parsingNormalizedToCanonical);
  const subagentTypeDescription = `Subagent type to use for this task. Must be one of: ${configNames.join(", ")}.`;
  const parsingTypeEnum = external_exports.enum([enumValues[0], ...enumValues.slice(1), ...resumeOnlyNames]);
  const defaultingSubagentTypeField = external_exports.preprocess(preprocessSubagentType, external_exports.enum(enumValues)).describe(subagentTypeDescription);
  const explicitSubagentTypeField = external_exports.preprocess(normalizeSubagentType, external_exports.enum(enumValues)).describe(subagentTypeDescription);
  const parsingSubagentTypeField = external_exports.preprocess(normalizeParsingSubagentType, parsingTypeEnum.optional()).describe(subagentTypeDescription);
  const modelFacingSubagentTypeField = options2.subagentModelsInUserInfo === true ? external_exports.preprocess(options2.requireExplicitSubagentTypeForNewSession === true ? normalizeSubagentType : preprocessSubagentType, external_exports.string()).describe("Subagent type to use for this task. Available types are listed in the initial user-info message.") : options2.requireExplicitSubagentTypeForNewSession === true ? explicitSubagentTypeField : defaultingSubagentTypeField;
  const fileAttachmentsField = external_exports.array(external_exports.string()).optional().describe("Optional array of file paths to images or videos to attach to the subagent. Files are read and attached to the subagent's context. Use to forward relevant media to any subagent (e.g. pass a user-attached image's saved file path so the subagent sees the actual image rather than a prose description).");
  const environmentField = external_exports.enum(["local", "cloud"]).optional().describe('Optional execution environment for the subagent. Use "local" (default) for normal local subagents, or "cloud" to run the subagent as a cloud agent (i.e. in its own separate worktree). ONLY set to cloud if the user explicitly requests a cloud subagent. DO NOT set to cloud if user does not request cloud. Cloud subagents will work on their own git branch on their own VM. After subagent completion, follow user instructions on whether to merge that branch into your own branch, check it out, or neither.' + (options2.hideAsyncSubagentTaskNotifications === true ? " If you mention an agent or subagent in your response, link it with the `[Name](id)` Don't use generic label such as `[agent]`, `[worker]`, or `[subagent]`." + // enableAgentChatLinks is only set for local (IDE-like) parents, so
  // cloud parents never get the #changes/#desktop view-link guidance.
  (options2.enableAgentChatLinks === true ? " For cloud subagents, when the agent has edited code, link to `[Review](bc-id#changes)`, or, if you know the exact added and deleted line counts, `[Review +A \u2212D](bc-id#changes)`, replacing A and D with those counts. Never write A or D literally. Use `[Try Live](bc-id#desktop)` only when the agent used computer use." : "") : ""));
  const cloudBaseBranchField = external_exports.preprocess((val) => typeof val === "string" && val.trim() === "" ? void 0 : val, external_exports.string().optional().describe("Base branch for the cloud subagent's branch to start from. Default is current branch. Uses remote version of branch; uncommitted or un-pushed branches will fail. Only specify this parameter if environment equals cloud."));
  const cloudRequestedEnvironmentBuildIdField = external_exports.preprocess((val) => typeof val === "string" && val.trim() === "" ? void 0 : val, external_exports.string().optional().describe("Exact environment build id (e.g. bld-YYYYMMDD-<uuid>) for the cloud subagent's VM to boot from, instead of the environment's latest successful build. Use to test a specific environment build in an isolated cloud subagent. Only specify this parameter if environment equals cloud. The build must belong to the same team and environment; an invalid or inaccessible build fails the subagent."));
  const machineField = buildTargetMachineField({
    includeEnvironmentBuildId: options2.requestedEnvironmentBuildParamForSubagent === true,
    includeSelfHostedTargets: options2.cloudSubagentTargeting === true
  });
  function buildSchema(descriptionField, subagentTypeField, { forParsing }) {
    const fullBaseObjectSchema = external_exports.object({
      description: descriptionField,
      prompt: promptField,
      model: modelField,
      resume: resumeField,
      subagent_type: subagentTypeField,
      file_attachments: fileAttachmentsField
    });
    const baseObjectSchema = options2.includeModelParameter === false ? fullBaseObjectSchema.omit({
      model: true
    }) : fullBaseObjectSchema;
    const legacyPlacementFields = {
      environment: environmentField,
      cloud_base_branch: cloudBaseBranchField,
      ...options2.requestedEnvironmentBuildParamForSubagent ? {
        cloud_requested_environment_build_id: cloudRequestedEnvironmentBuildIdField
      } : {}
    };
    const schemaWithEnvironment = !options2.environmentParamForSubagent ? baseObjectSchema : options2.cloudSubagentTargeting === true ? baseObjectSchema.extend({
      machine: machineField,
      ...forParsing ? legacyPlacementFields : {}
    }) : baseObjectSchema.extend({
      ...legacyPlacementFields,
      // Accept a structured machine on the parsing side even before the
      // model is offered it, so a persisted call or a newer client is
      // never silently downgraded.
      ...forParsing ? { machine: machineField } : {}
    });
    const schemaWithInterrupt = options2.enableSubagentInterrupt === true ? schemaWithEnvironment.extend({
      interrupt: interruptField
    }) : schemaWithEnvironment;
    const objectSchema = options2.includeRunInBackgroundInTaskSchema === true ? schemaWithInterrupt.extend({
      run_in_background: lenientBoolean().optional().describe(
        // Cloud first-class subagents have no output file and cannot
        // be polled or awaited; results are pushed to the parent when
        // the child completes. Only client-side subagents write a
        // transcript the parent can check.
        (options2.useClientSideSubagent ? "Run the agent in the background (returns output_file path to check later)." : "Run the agent in the background. A background subagent cannot be polled or awaited; after spawning it, continue other work or end your turn, and its final result will be delivered to you automatically when it completes.") + (options2.defaultSubagentsRunInBackground === true ? " Defaults true." : "") + " If this is false, you will be blocked until the agent completes." + (options2.enableMultitaskMode ? " If the user is currently in Multitask Mode, always set this parameter to True." : "") + (options2.taskToolNotificationHintsEnabled ? options2.hideAsyncSubagentTaskNotifications === true ? " When true, the background subagent will send a notification when it completes." : " When true, the background subagent will send a notification when it completes. That notification includes a user-visible summary portion; do not summarize or restate a completed background subagent's result unless the user asks, multiple background subagents need synthesis, or a background subagent reports a blocker requiring parent action outside of the user-visible high level summary." : "")
      )
    }) : schemaWithInterrupt;
    const refinedSchema = objectSchema.superRefine((args, ctx) => {
      if (args.subagent_type !== void 0 && resumeOnlyNames.includes(args.subagent_type) && !args.resume?.trim()) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["subagent_type"],
          message: "This retired subagent type can only resume an existing child"
        });
      }
      if (options2.requireExplicitSubagentTypeForNewSession === true && args.subagent_type === void 0 && (args.resume === void 0 || args.resume.trim().length === 0)) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["subagent_type"],
          message: "subagent_type is required when creating a new subagent"
        });
      }
      if (args.environment === "cloud") {
        return;
      }
      if (args.cloud_base_branch !== void 0) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["cloud_base_branch"],
          message: "cloud_base_branch may only be specified when environment equals cloud"
        });
      }
      if (args.cloud_requested_environment_build_id !== void 0) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["cloud_requested_environment_build_id"],
          message: "cloud_requested_environment_build_id may only be specified when environment equals cloud"
        });
      }
    });
    const normalizedSchema = refinedSchema.transform((args) => {
      const hasResume = args.resume !== void 0 && args.resume.trim().length > 0;
      if (hasResume || options2.requireExplicitSubagentTypeForNewSession === true) {
        return args;
      }
      return {
        ...args,
        subagent_type: args.subagent_type ?? defaultSubagentTypeName
      };
    });
    const taskArgsSchema = normalizedSchema;
    return Object.assign(taskArgsSchema, { shape: objectSchema.shape });
  }
  const descriptionFieldDescription = "A short, user-friendly title for the subagent. This appears in the UI as the subagent's name. Make it concrete and distinct, consider recent titles to avoid reuse. For resumed subagents which you are prompting to work on a separate task, give an updated description based on the latest work the subagent is performing. (Do not rename if the subagent is continuing work on the same high-level task.)";
  const schemaTowardsModel = buildSchema(external_exports.string().describe(descriptionFieldDescription), modelFacingSubagentTypeField, { forParsing: false });
  const schemaForParsing = buildSchema(external_exports.string().default("").describe(descriptionFieldDescription), parsingSubagentTypeField, { forParsing: true });
  return { schemaTowardsModel, schemaForParsing };
}
function buildTaskToolDescriptionBase(args) {
  const { includeExploreSubagent, subagentModelsInUserInfo, useClientSideSubagent, includeRunInBackgroundInTaskSchema = false, enableSubagentInterrupt, taskToolNotificationHintsEnabled = false, hideAsyncSubagentTaskNotifications = false, allowResumeSelfFork, enableAgentChatLinks, toolLabel, readToolName, globToolName, subagentExperimentGroup } = args;
  const includeExploreProactiveRecommendation = !subagentModelsInUserInfo && subagentExperimentGroup !== "no-subagent-unless-asked";
  const doNotUseExamples = [
    ...readToolName ? [
      `  - If you want to read a specific file path, use the ${readToolName}${globToolName ? ` or ${globToolName}` : ""} tool instead of the ${toolLabel} tool, to find the match more quickly`,
      `  - If you are searching for code within a specific file or set of 2-3 files, use the ${readToolName} tool instead of the ${toolLabel} tool, to find the match more quickly`
    ] : [],
    ...globToolName ? [
      `  - If you are searching for a specific class definition like "class Foo", use the ${globToolName} tool instead, to find the match more quickly`
    ] : []
  ].join("\n");
  const exploreRecommendation = includeExploreSubagent ? `
${includeExploreProactiveRecommendation ? `
VERY IMPORTANT: When broadly exploring the codebase to gather context for a large task, it is recommended that you use the ${toolLabel} tool with subagent_type="${EXPLORE_SUBAGENT_TYPE}" instead of running search commands directly.
` : ""}
If the query is a narrow or specific question, you should NOT use the ${toolLabel} and instead address the query directly using the other tools available to you.

Examples:
- user: "Where is the ClientError class defined?" assistant: [Uses Grep directly - this is a needle query for a specific class]
- user: "Run this query using my database API" assistant: [Calls the MCP directly - this is not a broad exploration task]
- user: "What is the codebase structure?" assistant: [Uses the ${toolLabel} tool with subagent_type="${EXPLORE_SUBAGENT_TYPE}"]

If it is possible to explore different areas of the codebase in parallel, you should launch multiple agents concurrently.` : "";
  const resultVisibilityNote = taskToolNotificationHintsEnabled ? hideAsyncSubagentTaskNotifications ? "- When the agent is done, it will return a single message back to you. Specify exactly what information the agent should return back in its final response to you." : "- When the agent is done, it will return a single message back to you. Specify exactly what information the agent should return back in its final response to you. Background subagent completion messages already include a user-visible summary portion; do not summarize or restate a single background subagent's result by default. Respond only when the user asks, multiple background subagents need synthesis, or the background subagent reports a blocker requiring parent action outside of the user-visible high level summary." : "- When the agent is done, it will return a single message back to you. Specify exactly what information the agent should return back in its final response to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.";
  const supportsAsyncSubagentResume = useClientSideSubagent || includeRunInBackgroundInTaskSchema;
  const resumeBehavior = supportsAsyncSubagentResume ? enableSubagentInterrupt ? "This sends a follow-up message after the agent has completed, preserving existing context. If the agent is still running, the request fails unless `interrupt` is true. Set `interrupt` to true only when the user explicitly wants to interrupt the running agent." : "This sends a follow-up message after the agent has completed, preserving existing context. If the agent is still running, the request fails; wait for completion before resuming." : "When resumed, the agent continues with its full previous context preserved.";
  const resumeUsageNote = `
- Agents can be resumed using the \`resume\` parameter by passing the agent ID from a previous invocation. ${resumeBehavior}${allowResumeSelfFork ? ` You can also set \`resume\` to "${TASK_RESUME_SELF_SENTINEL}" to fork the current parent agent into a new child subagent.` : ""} When NOT resuming, each invocation starts fresh and you should provide a detailed task description with all necessary context.`;
  return `Launch a new agent to handle complex, multi-step tasks autonomously.

The ${toolLabel} tool launches specialized subagents (subprocesses) that autonomously handle complex tasks. Each subagent_type has specific capabilities and tools available to it.

When using the ${toolLabel} tool, you must specify a subagent_type parameter to select which agent type to use.${exploreRecommendation}

When NOT to use the ${toolLabel} tool:
- Simple, single or few-step tasks that can be performed by a single agent (using parallel or sequential tool calls) -- just call the tools directly instead.
${doNotUseExamples.length > 0 ? `- For example:
${doNotUseExamples}` : ""}

Usage notes:
- Always include a short description (3-5 words) summarizing what the agent will do
- Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses.
${resultVisibilityNote}${resumeUsageNote}
${enableAgentChatLinks ? hideAsyncSubagentTaskNotifications ? "- If you mention an agent or subagent in your response, link it with the `[Name](id)` Don't use generic label such as `[agent]`, `[worker]`, or `[subagent]`. For cloud subagents, when the agent has edited code, link to `[Review](bc-id#changes)`, or, if you know the exact added and deleted line counts, `[Review +A \u2212D](bc-id#changes)`, replacing A and D with those counts. Never write A or D literally. Use `[Try Live](bc-id#desktop)` only when the agent used computer use.\n" : "- In user-facing responses, you may link to agents and subagents with markdown chat links in the `[label](id)` format, using the agent ID as the link target. Do not print raw agent IDs separately.\n" : ""}- When using the ${toolLabel} tool, the subagent invocation does not have access to the user's message or prior assistant steps. Therefore, you should provide a highly detailed task description with all necessary context for the agent to perform its task autonomously.
- The subagent's outputs should generally be trusted
- Clearly tell the subagent which tasks you want it to perform, since it is not aware of the user's intent or your prior assistant steps (tool calls, thinking, or messages).
- If the subagent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first. Use your judgement.
- If the user specifies that they want you to run subagents "in parallel", you MUST send a single message with multiple ${toolLabel} tool use content blocks. For example, if you need to launch both a code-reviewer subagent and a test-runner subagent in parallel, send a single message with both tool calls.
- Avoid delegating the full query to the ${toolLabel} tool and returning the result. In these cases, you should address the query using the other tools available to you.`;
}
function formatSubagentConfigForDescription(config2, defaultResumeMode) {
  const name17 = getSubagentTypeName(config2.subagent_type);
  const effectiveResumeMode = config2.resumeModeOverride ?? defaultResumeMode;
  let description9 = config2.description ?? "";
  if (effectiveResumeMode !== SubagentResumeMode.DEFAULT) {
    const resumeNote = effectiveResumeMode === SubagentResumeMode.LAST_AGENT_SAME_TYPE ? " (Auto-resumes most recent agent of this type; `resume` arg is ignored)" : " (Auto-resumes most recent agent; `resume` arg is ignored)";
    description9 = description9 ? `${description9}${resumeNote}` : resumeNote;
  }
  if (description9) {
    return `- ${name17}: ${description9}`;
  }
  return `- ${name17}`;
}
function buildTaskToolDescriptionParts(options2) {
  const { configs, defaultResumeMode, includeExploreSubagent, useClientSideSubagent, includeRunInBackgroundInTaskSchema, enableSubagentInterrupt, taskToolNotificationHintsEnabled, hideAsyncSubagentTaskNotifications, allowResumeSelfFork, enableAgentChatLinks = true, includeModelParameter = true, subagentModels, subagentModelsInUserInfo = false, toolLabel, readToolName, globToolName, subagentExperimentGroup } = options2;
  const catalogsInUserInfo = options2.catalogsInUserInfo ?? subagentModelsInUserInfo;
  const subagentInheritGuidance = options2.subagentInheritGuidance ?? subagentModelsInUserInfo;
  const baseDescription = buildTaskToolDescriptionBase({
    includeExploreSubagent: includeExploreSubagent && configs.some((config2) => getSubagentTypeName(config2.subagent_type) === EXPLORE_SUBAGENT_TYPE),
    subagentModelsInUserInfo,
    useClientSideSubagent,
    includeRunInBackgroundInTaskSchema,
    enableSubagentInterrupt,
    taskToolNotificationHintsEnabled,
    hideAsyncSubagentTaskNotifications,
    allowResumeSelfFork,
    enableAgentChatLinks,
    toolLabel,
    readToolName,
    globToolName,
    subagentExperimentGroup
  });
  const sections = [baseDescription];
  let subagentTypeDescriptionsText = "";
  if (configs.length > 0) {
    const configDescriptions = configs.map((c) => formatSubagentConfigForDescription(c, defaultResumeMode)).join("\n");
    subagentTypeDescriptionsText = `Available subagent_types and a quick description of what they do:
${configDescriptions}`;
    sections.push(catalogsInUserInfo ? "Available subagent_types and descriptions are listed in <available_subagent_types> in the initial user-info message at the start of this conversation." : subagentTypeDescriptionsText);
  }
  const modelsDescription = includeModelParameter ? buildAvailableModelsDescription(subagentModels, subagentInheritGuidance) : "";
  if (includeModelParameter) {
    sections.push(catalogsInUserInfo ? "Available model slugs for subagents are listed in <available_subagent_models> in the initial user-info message at the start of this conversation." : modelsDescription);
  }
  return {
    baseDescription,
    subagentTypeDescriptionsText,
    modelsDescription,
    fullDescription: sections.join("\n\n")
  };
}
var createTaskTool = (resourceAccessor, getTaskToolConfig, parentModelInfo, stateHandler, subagentConfigs, options2) => {
  const { readonlyShellEnabled, allowCustomModelId, includeModelParameter = true, modelParameterDescription, includeExploreSubagent, enableExecuteHookExec, subagentModels, subagentModelsInUserInfo = false, subagentInheritGuidance = subagentModelsInUserInfo, isModelBlocked, isModelValid, parentMaxMode, forceModelId, subagentModelForcePolicy, compareModelCosts, requiresMaxMode, requireServerSideSubagent, configuredSteps, useClientSideSubagent, enableCloudAsyncSubagents, defaultSubagentsRunInBackground, enableMultitaskMode, enableJobCompletionNotifications, hideAsyncSubagentTaskNotifications, enableAgentChatLinks = true, cloudCoordinatorTaskVariant, enableExploreParentModelInheritance, subagentExperimentGroup, subagentCredentials, attachedMediaUrlProvider, geminiVideoAttachedMediaUrlProvider, inlineVideoMaxBytes, signedUrlVideoMaxBytes, trustedVideoAttachmentRoots } = options2;
  const canUseClientSideSubagent = Boolean(useClientSideSubagent) && !requireServerSideSubagent;
  const supportsAsyncSubagents = canUseClientSideSubagent || enableCloudAsyncSubagents === true;
  const allowResumeSelfFork = supportsAsyncSubagents && options2.allowResumeSelfFork === true;
  const enableSubagentInterrupt = supportsAsyncSubagents && options2.enableSubagentInterrupt === true;
  const shouldDefaultSubagentsRunInBackground = supportsAsyncSubagents && defaultSubagentsRunInBackground === true;
  const taskToolNotificationHintsEnabled = enableJobCompletionNotifications === true && supportsAsyncSubagents;
  const enableTaskToolHooksExec = Boolean(enableExecuteHookExec);
  const taskSchemaOptions = {
    resumeOnlySubagentConfigs: options2.resumeOnlySubagentConfigs,
    allowCustomModelId,
    includeModelParameter,
    modelParameterDescription,
    subagentModels,
    subagentModelsInUserInfo,
    subagentInheritGuidance,
    useClientSideSubagent: canUseClientSideSubagent,
    includeRunInBackgroundInTaskSchema: supportsAsyncSubagents,
    defaultSubagentsRunInBackground: shouldDefaultSubagentsRunInBackground,
    enableSubagentInterrupt,
    environmentParamForSubagent: options2.environmentParamForSubagent === true,
    requestedEnvironmentBuildParamForSubagent: options2.requestedEnvironmentBuildParamForSubagent === true,
    cloudSubagentTargeting: options2.cloudSubagentTargeting === true,
    requireExplicitSubagentTypeForNewSession: options2.requireExplicitSubagentTypeForNewSession === true,
    allowResumeSelfFork,
    enableMultitaskMode,
    taskToolNotificationHintsEnabled,
    hideAsyncSubagentTaskNotifications,
    enableAgentChatLinks
  };
  const { schemaTowardsModel, schemaForParsing } = buildTaskParametersSchema(subagentConfigs, taskSchemaOptions);
  const replayConfigs = (options2.resumeOnlySubagentConfigs ?? []).filter((config2) => findSubagentConfigByName(subagentConfigs, getSubagentTypeName(config2.subagent_type)) === void 0);
  const replaySchema = replayConfigs.length > 0 && options2.supportsRetiredSubagentReattachment === true && canUseClientSideSubagent ? buildTaskParametersSchema([subagentConfigs[0], ...subagentConfigs.slice(1), ...replayConfigs], { ...taskSchemaOptions, resumeOnlySubagentConfigs: void 0 }).schemaForParsing : schemaForParsing;
  const isPendingReplay = (ctx, meta) => options2.supportsRetiredSubagentReattachment === true && replayConfigs.length > 0 && canUseClientSideSubagent && ctx.get(pendingSubagentReplayKey) !== void 0 && meta.toolCallId.length > 0 && ctx.get(pendingSubagentReplayKey)?.toolCallId === meta.toolCallId;
  const toolName = getTaskToolName(parentModelInfo);
  const areCatalogsInUserInfo = (options3) => subagentModelsInUserInfo || !isPromptVisibleDescription(options3);
  const taskDescriptionPartsCache = /* @__PURE__ */ new WeakMap();
  const getTaskDescriptionParts = (props, catalogsInUserInfo) => {
    let partsByPlacement = taskDescriptionPartsCache.get(props);
    const cachedParts = partsByPlacement?.get(catalogsInUserInfo);
    if (cachedParts !== void 0) {
      return cachedParts;
    }
    const { allTools } = props;
    const parts = buildTaskToolDescriptionParts({
      parentModelInfo,
      configs: subagentConfigs,
      defaultResumeMode: SubagentResumeMode.DEFAULT,
      includeExploreSubagent,
      useClientSideSubagent: canUseClientSideSubagent,
      includeRunInBackgroundInTaskSchema: supportsAsyncSubagents,
      enableSubagentInterrupt,
      taskToolNotificationHintsEnabled,
      hideAsyncSubagentTaskNotifications,
      allowResumeSelfFork,
      enableAgentChatLinks,
      includeModelParameter,
      subagentModels,
      subagentModelsInUserInfo,
      subagentInheritGuidance,
      catalogsInUserInfo,
      toolLabel: toolName,
      readToolName: allTools.READ?.name,
      globToolName: allTools.GLOB?.name,
      subagentExperimentGroup
    });
    let fullDescription = parts.fullDescription;
    if (taskToolNotificationHintsEnabled) {
      const awaitToolName = allTools.AWAIT?.name;
      fullDescription += awaitToolName ? `

When an agent runs in the background, you will be automatically notified when it completes after you end your own turn - do NOT ${awaitToolName}, poll, or proactively check on its progress. Continue with other work or end your turn instead. Don't mention this to the user.` : `

When an agent runs in the background, you will be automatically notified when it completes after you end your own turn - do NOT poll or proactively check on its progress. Continue with other work or end your turn instead. Don't mention this to the user.`;
    }
    if (subagentExperimentGroup === "no-subagent-unless-asked") {
      fullDescription = `IMPORTANT: Do NOT use this tool unless the user has explicitly asked you to use subagents, delegate to agents, or use the ${toolName} tool. You should perform tasks directly using your own tools instead of delegating to subagents. Only use this tool when the user specifically requests it.

` + fullDescription;
    }
    const descriptionParts = { ...parts, fullDescription };
    if (partsByPlacement === void 0) {
      partsByPlacement = /* @__PURE__ */ new Map();
      taskDescriptionPartsCache.set(props, partsByPlacement);
    }
    partsByPlacement.set(catalogsInUserInfo, descriptionParts);
    return descriptionParts;
  };
  const buildTaskDescription = (props, options3) => getTaskDescriptionParts(props, areCatalogsInUserInfo(options3)).fullDescription;
  const createParentStateAccessor = () => ({
    restoreSubagentState: (ctx, subagentId) => stateHandler.restoreSubagentState(ctx, subagentId),
    resolveSubagentId: (subagentIdOrBcId) => stateHandler.resolveSubagentId(subagentIdOrBcId),
    getSubagentIdToResume: (typeName, mode) => stateHandler.getSubagentIdToResume(typeName, mode),
    getConversationState: async (ctx) => {
      const result = await stateHandler.computeNewStructure(ctx);
      return fromRedactedConversationStateStructure(result, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    }
  });
  const parseTaskToolCallArgs = (rawArgs) => {
    let parsedJson;
    try {
      parsedJson = typeof rawArgs === "string" ? JSON.parse(rawArgs) : rawArgs;
    } catch (error42) {
      const message = error42 instanceof Error ? error42.message : "Failed to parse arguments";
      throw new ToolCallArgParseError(`Invalid arguments:
argument: ${message}`);
    }
    const parseResult = schemaForParsing.safeParse(parsedJson);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.errors.map((err) => {
        const path31 = err.path.length > 0 ? err.path.join(".") : "argument";
        return `${path31}: ${err.message}`;
      });
      throw new ToolCallArgParseError(`Invalid arguments:
${errorMessages.join("\n")}`);
    }
    const parsedArgs = parseResult.data;
    assertResumeSelfForkAllowed(parsedArgs, allowResumeSelfFork);
    assertMachineAndLegacyArgsNotBothSet(parsedArgs);
    assertCloudOnlyTaskArgsAllowed(parsedArgs);
    return parsedArgs;
  };
  const createTaskToolHookInput = (args) => ({
    description: args.description,
    prompt: args.prompt,
    model: args.model,
    environment: args.environment,
    cloud_base_branch: args.cloud_base_branch,
    cloud_requested_environment_build_id: args.cloud_requested_environment_build_id,
    machine: args.machine,
    resume: args.resume,
    interrupt: args.interrupt,
    subagent_type: args.subagent_type,
    run_in_background: args.run_in_background,
    file_attachments: args.file_attachments
  });
  const applyUpdatedInputToTaskArgs = (rawArgs, updatedInput) => {
    const mergedArgs = {
      ...rawArgs,
      ...updatedInput
    };
    const parseResult = schemaForParsing.safeParse(mergedArgs);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.errors.map((err) => {
        const path31 = err.path.length > 0 ? err.path.join(".") : "argument";
        return `${path31}: ${err.message}`;
      });
      throw new ToolCallArgParseError(`Invalid preToolUse updated_input:
${errorMessages.join("\n")}`);
    }
    const parsedArgs = parseResult.data;
    assertResumeSelfForkAllowed(parsedArgs, allowResumeSelfFork);
    assertMachineAndLegacyArgsNotBothSet(parsedArgs);
    assertCloudOnlyTaskArgsAllowed(parsedArgs);
    return parsedArgs;
  };
  const applyTaskPreToolUseUpdatedInput = async (ctx, rawArgs, toolCallId) => {
    if (!enableTaskToolHooksExec) {
      return rawArgs;
    }
    const hookResult = await executeRemotePreToolUseHookWithPermissionCheck({
      ctx,
      toolName,
      toolInput: createTaskToolHookInput(rawArgs),
      requestContext: {
        toolCallId
      },
      options: {
        resourceAccessor,
        enableExecuteHookExec: enableTaskToolHooksExec,
        configuredSteps
      }
    });
    if (!hookResult.updatedInput) {
      return rawArgs;
    }
    return applyUpdatedInputToTaskArgs(rawArgs, hookResult.updatedInput);
  };
  const applyDefaultRunInBackground = (rawArgs) => {
    if (!shouldDefaultSubagentsRunInBackground || rawArgs.run_in_background !== void 0) {
      return rawArgs;
    }
    return {
      ...rawArgs,
      run_in_background: true
    };
  };
  const getUpdatedTaskRawArgs = async (ctx, rawArgs, toolCallId) => await applyTaskPreToolUseUpdatedInput(ctx, applyDefaultRunInBackground(rawArgs), toolCallId);
  const getTaskToolRuntimeConfig = async (ctx, prepared) => {
    logger73.info(ctx, "Getting Task tool config", {
      toolCallId: prepared.toolCallId,
      subagentType: prepared.subagentTypeName,
      overriddenModelId: prepared.resolvedModelId
    });
    try {
      return await getTaskToolConfig(prepared.resolvedModelId, prepared.subagentType);
    } catch (configError) {
      logger73.error(ctx, "Failed to get Task tool config", configError, {
        toolCallId: prepared.toolCallId,
        subagentType: prepared.subagentTypeName,
        overriddenModelId: prepared.resolvedModelId
      });
      throw configError;
    }
  };
  const runPreparedTaskSubagentLaunchSetup = async (ctx, prepared, taskToolConfig, creationAnalytics) => {
    if (!prepared.isResume) {
      try {
        await executeSubagentStartHook({
          resourceAccessor,
          toolCallId: prepared.toolCallId,
          subagentId: prepared.subagentId,
          subagentType: prepared.subagentTypeName,
          overriddenModelId: prepared.resolvedModelId,
          task: prepared.taskPrompt,
          parentCtx: ctx,
          enableExecuteHookExec: enableTaskToolHooksExec,
          configuredSteps
        });
      } catch (hookError) {
        if (hookError instanceof SubagentBlockedByHookError) {
          throw hookError;
        }
        logger73.error(ctx, "Error executing subagentStart hook", hookError, {
          toolCallId: prepared.toolCallId,
          subagentType: prepared.subagentTypeName
        });
      }
    }
    if (prepared.parentRequestId) {
      taskToolConfig.logSubagentStart?.({
        parentRequestId: prepared.parentRequestId,
        rootParentRequestId: prepared.rootParentRequestId ?? prepared.parentRequestId,
        parentAgentToolCallId: prepared.toolCallId,
        subagentRequestId: prepared.subagentRequestId,
        action: prepared.initialAction,
        conversationState: prepared.conversationState,
        modelId: prepared.resolvedModelId
      });
    }
    if (creationAnalytics) {
      trackPreparedTaskSubagentCreated(ctx, prepared, creationAnalytics);
    }
  };
  const prepareResolvedTaskSubagentForLaunch = async (ctx, rawArgs, meta, resolved, parentState, options3) => {
    const parentCursorCommands = await getLatestParentCursorCommands(ctx, stateHandler);
    const prepared = await prepareTaskSubagent({
      resolved,
      ctx,
      rawArgs,
      meta,
      parentState,
      resourceAccessor,
      parentModelInfo,
      subagentCredentials,
      enableExecuteHookExec: enableTaskToolHooksExec,
      configuredSteps,
      readonlyShellEnabled,
      toolName,
      parentCursorCommands: parentCursorCommands ?? void 0,
      privacyMode: stateHandler.getPrivacyMode(),
      attachedMediaUrlProvider,
      geminiVideoAttachedMediaUrlProvider,
      inlineVideoMaxBytes,
      signedUrlVideoMaxBytes
    });
    const taskToolConfig = options3?.taskToolConfig ?? await getTaskToolRuntimeConfig(ctx, {
      toolCallId: prepared.toolCallId,
      subagentTypeName: prepared.subagentTypeName,
      subagentType: prepared.subagentType,
      resolvedModelId: prepared.resolvedModelId
    });
    await runPreparedTaskSubagentLaunchSetup(ctx, prepared, taskToolConfig, options3?.creationAnalytics);
    return { prepared, taskToolConfig };
  };
  const prepareTaskSubagentForLaunch = async (ctx, rawArgs, meta, launchOptions) => {
    const updatedRawArgs = await getUpdatedTaskRawArgs(ctx, rawArgs, meta.toolCallId);
    const parentState = createParentStateAccessor();
    const resolved = await resolveTaskSubagentConfig({
      ctx,
      rawArgs: updatedRawArgs,
      meta,
      subagentConfigs,
      resumeOnlySubagentConfigs: options2.resumeOnlySubagentConfigs,
      parentState,
      parentModelInfo,
      options: {
        forceModelId,
        subagentModelForcePolicy,
        parentRequestedModelName: options2.parentRequestedModelName,
        parentModelParameters: options2.parentModelParameters,
        parentMaxMode,
        subagentModels,
        isModelBlocked,
        isModelValid,
        requiresMaxMode,
        compareModelCosts,
        enableExploreParentModelInheritance
      }
    });
    const { prepared } = await prepareResolvedTaskSubagentForLaunch(ctx, updatedRawArgs, meta, resolved, parentState, launchOptions);
    return prepared;
  };
  const execute = async (parentCtx, interactionHandler, rawArgs, meta) => {
    const env_7 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource28(env_7, createSpan(parentCtx.withName("taskExecute")), false);
      const updatedRawArgs = await getUpdatedTaskRawArgs(spanCtxt.ctx, rawArgs, meta.toolCallId);
      assertResumeSelfForkAllowed(updatedRawArgs, allowResumeSelfFork);
      const parentState = createParentStateAccessor();
      const reattachOnly = isPendingReplay(spanCtxt.ctx, meta) && !updatedRawArgs.resume && findSubagentConfigByName(replayConfigs, updatedRawArgs.subagent_type ?? "") !== void 0;
      const executionCtx = reattachOnly ? spanCtxt.ctx.with(pendingSubagentReplayKey, {
        toolCallId: meta.toolCallId,
        reattachOnly: true
      }) : spanCtxt.ctx;
      const resolved = await resolveTaskSubagentConfig({
        ctx: executionCtx,
        rawArgs: updatedRawArgs,
        meta,
        subagentConfigs,
        resumeOnlySubagentConfigs: options2.resumeOnlySubagentConfigs,
        reattachOnly,
        parentState,
        parentModelInfo,
        options: {
          forceModelId,
          subagentModelForcePolicy,
          parentRequestedModelName: options2.parentRequestedModelName,
          parentModelParameters: options2.parentModelParameters,
          parentMaxMode,
          subagentModels,
          isModelBlocked,
          isModelValid,
          requiresMaxMode,
          compareModelCosts,
          enableExploreParentModelInheritance
        }
      });
      const { subagentConfig, effectiveReadonly, useAskModeForSubagent, typeName, analyticsSubagentType, resolvedModelId, resolvedModelParameters, subagentIdToResume, subagentId, isSelfForkRequested, effectiveEnvironment, effectiveTargetMachine } = resolved;
      const freshClientSubagentPlacement = canUseClientSideSubagent && subagentIdToResume === void 0 ? toClientSubagentPlacement(effectiveTargetMachine) : void 0;
      const args = new TaskArgs({
        description: updatedRawArgs.description,
        prompt: updatedRawArgs.prompt,
        subagentType: subagentConfig.subagent_type,
        model: resolvedModelId,
        resume: updatedRawArgs.resume,
        agentId: subagentId,
        attachments: updatedRawArgs.file_attachments,
        environment: effectiveEnvironment,
        machine: targetMachineToProto(effectiveTargetMachine)
      });
      const baseToolCall = new TaskToolCall({
        args,
        result: void 0
      });
      await interactionHandler.emitPartialToolCall(executionCtx, meta.toolCallId, createTaskToolCall(new TaskToolCall({ args, result: void 0 })));
      const taskResult = await interactionHandler.executeToolCall(executionCtx, createTaskToolCall(baseToolCall), meta.toolCallId, async (ctx) => {
        const executionStartTime = Date.now();
        const eventTracker = getAgentEventTracker(ctx);
        if (canUseClientSideSubagent) {
          logger73.info(ctx, "Using client-side subagent execution", {
            toolCallId: meta.toolCallId,
            subagentType: typeName,
            modelId: resolvedModelId
          });
          trackTaskSubagentCreated(ctx, {
            analyticsSubagentType,
            subagentTypeName: typeName,
            resolvedModelId,
            effectiveReadonly,
            isResume: subagentIdToResume !== void 0,
            rawArgs: new TaskToolCallArgsProto({
              description: updatedRawArgs.description,
              prompt: updatedRawArgs.prompt,
              model: updatedRawArgs.model,
              subagentType: updatedRawArgs.subagent_type,
              resume: updatedRawArgs.resume,
              runInBackground: updatedRawArgs.run_in_background,
              attachments: updatedRawArgs.file_attachments ?? [],
              environment: effectiveEnvironment,
              cloudBaseBranch: updatedRawArgs.cloud_base_branch,
              cloudRequestedEnvironmentBuildId: updatedRawArgs.cloud_requested_environment_build_id,
              interrupt: updatedRawArgs.interrupt
            }),
            toolCallId: meta.toolCallId,
            plugin: subagentConfig.plugin,
            marketplace: subagentConfig.marketplace,
            pluginId: subagentConfig.pluginId,
            marketplaceId: subagentConfig.marketplaceId,
            subagentSource: subagentConfig.subagentSource,
            parentModelName: parentModelInfo.modelName
          }, {
            isParallel: false,
            parallelBatchSize: void 0
          });
          try {
            const subagentExecutor = resourceAccessor.get(subagentExecutorResource);
            const continuationConfig = buildClientContinuationConfig(subagentConfig);
            const clientReadonly = useAskModeForSubagent;
            const rootParentConversationId = getConversationGroupId(ctx);
            const parentConversationId = getConversationId(ctx);
            const runInBackground = updatedRawArgs.run_in_background ?? subagentConfig.isBackground;
            let selectedContext2;
            const privacyMode = stateHandler.getPrivacyMode();
            if (updatedRawArgs.file_attachments && updatedRawArgs.file_attachments.length > 0) {
              const userAttachedVideoPaths = await getUserAttachedVideoPaths(ctx, stateHandler);
              selectedContext2 = await buildClientSubagentAttachmentsContext(ctx, updatedRawArgs.file_attachments, resourceAccessor, meta.toolCallId, {
                resolvedModelId,
                privacyMode,
                attachedMediaUrlProvider: isGeminiVideoSubagentType(subagentConfig.subagent_type) ? geminiVideoAttachedMediaUrlProvider ?? attachedMediaUrlProvider : attachedMediaUrlProvider,
                conversationId: parentConversationId,
                inlineVideoMaxBytes,
                signedUrlVideoMaxBytes,
                userAttachedVideoPaths,
                trustedVideoAttachmentRoots
              });
            }
            const steerSignal = meta.contextInjectionSignal;
            let stopSteerHandoff;
            if (steerSignal !== void 0 && runInBackground !== true) {
              const STEER_HANDOFF_RETRY_MS = 500;
              let stopped2 = false;
              let handoffInFlight = false;
              let handoffAccepted = false;
              let retryTimer;
              let unsubscribe;
              const requestSteerHandoff = () => {
                if (stopped2 || handoffInFlight || handoffAccepted) {
                  return;
                }
                handoffInFlight = true;
                void (async () => {
                  try {
                    const forceBackgroundExecutor = resourceAccessor.get(forceBackgroundSubagentExecutorResource);
                    const forceBackgroundResult = await forceBackgroundExecutor.execute(ctx, new ForceBackgroundSubagentArgs({
                      toolCallId: meta.toolCallId
                    }));
                    if (forceBackgroundResult.status === ForceBackgroundSubagentStatus.ACCEPTED) {
                      handoffAccepted = true;
                    }
                  } catch (error42) {
                    logger73.debug(ctx, "Steer-driven subagent background handoff failed", {
                      toolCallId: meta.toolCallId,
                      error: error42
                    });
                  } finally {
                    handoffInFlight = false;
                    if (!stopped2 && !handoffAccepted && retryTimer === void 0 && steerSignal.hasPendingUserInjections()) {
                      retryTimer = setTimeout(() => {
                        retryTimer = void 0;
                        requestSteerHandoff();
                      }, STEER_HANDOFF_RETRY_MS);
                    }
                  }
                })();
              };
              stopSteerHandoff = () => {
                stopped2 = true;
                if (retryTimer !== void 0) {
                  clearTimeout(retryTimer);
                  retryTimer = void 0;
                }
                unsubscribe?.();
                unsubscribe = void 0;
              };
              unsubscribe = steerSignal.onUserInjectionAdmitted(() => {
                requestSteerHandoff();
              });
              if (steerSignal.hasPendingUserInjections()) {
                requestSteerHandoff();
              }
            }
            let result;
            try {
              result = await subagentExecutor.execute(ctx, new SubagentArgs({
                toolCallId: meta.toolCallId,
                subagentType: typeName,
                modelId: resolvedModelId,
                // Present only when the subagent runs the parent's model;
                // carries the parent's parameter selection (e.g. Auto Smart
                // `optimize_for`) so hosts don't re-derive parameters.
                modelParameters: resolvedModelParameters?.map((parameter) => ({
                  id: parameter.id,
                  value: parameter.value
                })),
                credentials: subagentCredentials,
                prompt: updatedRawArgs.prompt,
                readonly: clientReadonly,
                resumeAgentId: isSelfForkRequested ? void 0 : subagentIdToResume,
                forkAgentId: isSelfForkRequested ? parentConversationId : void 0,
                interrupt: enableSubagentInterrupt && updatedRawArgs.interrupt === true ? true : void 0,
                runInBackground,
                continuationConfig,
                rootParentConversationId,
                parentConversationId,
                selectedContext: selectedContext2,
                environment: freshClientSubagentPlacement?.environment ?? effectiveEnvironment,
                cloudBaseBranch: subagentIdToResume === void 0 ? freshClientSubagentPlacement?.cloudBaseBranch : updatedRawArgs.cloud_base_branch
              }));
            } finally {
              stopSteerHandoff?.();
            }
            if (result.result.case === "error") {
              const error42 = result.result.value;
              const durationMs2 = Date.now() - executionStartTime;
              logger73.warn(ctx, "Client-side subagent failed or was aborted", {
                toolCallId: meta.toolCallId,
                subagentType: typeName,
                agentId: error42.agentId,
                error: error42.error,
                durationMs: durationMs2
              });
              throw new Error(maybeAppendInterruptRetryHint(error42.error ?? "Unknown subagent error", enableSubagentInterrupt, updatedRawArgs.interrupt === true));
            }
            if (result.result.case !== "success") {
              throw new Error("Unknown subagent result");
            }
            const success2 = result.result.value;
            if (success2.backgroundReason === SubagentBackgroundReason.QUEUED_FOLLOW_UP) {
              return new TaskResult({
                result: {
                  case: "error",
                  value: new TaskError({
                    error: maybeAppendInterruptRetryHint(RUNNING_SUBAGENT_FOLLOWUP_ERROR, enableSubagentInterrupt, updatedRawArgs.interrupt === true)
                  })
                }
              });
            }
            const lastAgentId = effectiveEnvironment === SubagentExecutionEnvironment.CLOUD ? success2.agentId : success2.agentId ?? subagentId;
            if (lastAgentId !== void 0 && lastAgentId.length > 0 && (!reattachOnly || stateHandler.restoreSubagentState(ctx, lastAgentId) === void 0)) {
              stateHandler.persistSubagentState(ctx, lastAgentId, subagentConfig.subagent_type, reattachOnly ? new SubagentPersistedState() : effectiveEnvironment === SubagentExecutionEnvironment.CLOUD ? buildCloudSubagentPersistedState({
                bcId: lastAgentId,
                modelId: resolvedModelId,
                transcriptPath: success2.transcriptPath,
                machine: effectiveTargetMachine
              }) : new SubagentPersistedState({
                modelId: resolvedModelId
              }));
            }
            const isBackground = success2.backgroundReason !== SubagentBackgroundReason.UNSPECIFIED;
            const totalLoops = 1;
            const durationMs = Date.now() - executionStartTime;
            logger73.info(ctx, "Client-side subagent completed successfully", {
              toolCallId: meta.toolCallId,
              subagentType: typeName,
              agentId: lastAgentId,
              durationMs,
              totalLoops
            });
            eventTracker.trackSubagentCompleted(ctx, {
              subagentType: analyticsSubagentType,
              subagentModel: resolvedModelId,
              parentModel: parentModelInfo.modelName,
              status: "success",
              durationMs,
              toolCallCount: success2.toolCallCount,
              messageCount: 0,
              isReadonly: effectiveReadonly,
              isParallel: false,
              toolCallId: meta.toolCallId,
              plugin: subagentConfig.plugin,
              marketplace: subagentConfig.marketplace,
              pluginId: subagentConfig.pluginId,
              marketplaceId: subagentConfig.marketplaceId
            });
            const conversationSteps = [];
            if (!isBackground && success2.finalMessage) {
              conversationSteps.push(new ConversationStep({
                message: {
                  case: "assistantMessage",
                  value: new AssistantMessage({
                    text: success2.finalMessage
                  })
                }
              }));
            }
            return new TaskResult({
              result: {
                case: "success",
                value: new TaskSuccess({
                  conversationSteps,
                  durationMs: BigInt(durationMs),
                  agentId: lastAgentId,
                  isBackground,
                  backgroundReason: success2.backgroundReason,
                  transcriptPath: success2.transcriptPath
                })
              }
            });
          } catch (error42) {
            if (error42 instanceof DeferredInteractionResponseError) {
              throw error42;
            }
            const durationMs = Date.now() - executionStartTime;
            const isStreamClosed = isWritableIterableClosedError(error42);
            const errorMessage7 = isStreamClosed ? SUBAGENT_STREAM_CLOSED_ERROR : error42 instanceof Error ? error42.message : String(error42);
            if (isStreamClosed) {
              logger73.info(ctx, "Client-side subagent execution interrupted by stream teardown", {
                toolCallId: meta.toolCallId,
                subagentType: typeName,
                durationMs
              });
            } else {
              logger73.error(ctx, "Client-side subagent execution threw error", error42, {
                toolCallId: meta.toolCallId,
                subagentType: typeName,
                durationMs
              });
            }
            eventTracker.trackSubagentCompleted(ctx, {
              subagentType: analyticsSubagentType,
              subagentModel: resolvedModelId,
              parentModel: parentModelInfo.modelName,
              status: "error",
              durationMs,
              toolCallCount: 0,
              messageCount: 0,
              isReadonly: effectiveReadonly,
              isParallel: false,
              toolCallId: meta.toolCallId,
              plugin: subagentConfig.plugin,
              marketplace: subagentConfig.marketplace,
              pluginId: subagentConfig.pluginId,
              marketplaceId: subagentConfig.marketplaceId
            });
            return new TaskResult({
              result: {
                case: "error",
                value: new TaskError({
                  error: errorMessage7
                })
              }
            });
          }
        }
        const overriddenModelId = resolvedModelId;
        let state;
        const blobStore = stateHandler.getBlobStore();
        const interactionListener = toRedactedInteractionListener(new StreamingTaskInteractionListener(interactionHandler, meta.toolCallId), stateHandler.getPrivacyMode());
        const conversationActionReceiver = new NoopConversationActionReceiver();
        const { prepared, taskToolConfig } = await prepareResolvedTaskSubagentForLaunch(ctx, updatedRawArgs, meta, resolved, parentState);
        const selectedContext = prepared.selectedContext;
        const action = prepared.initialAction;
        const conversationState = prepared.conversationState;
        const postToolUseHookInput = buildPreparedTaskToolHookInput(prepared);
        const { agentConfig: baseAgentConfig, promptSession, summarizationHandler } = taskToolConfig;
        let effectiveResourceAccessor = resourceAccessor;
        if (effectiveReadonly) {
          effectiveResourceAccessor = createReadonlyResourceAccessor(resourceAccessor, !readonlyShellEnabled);
        }
        const subagentRequestId = prepared.subagentRequestId;
        const subagentAgentConfig = createSubagentAgentConfig({
          baseAgentConfig,
          subagentConfig,
          overriddenModelId,
          subagentInstanceId: subagentRequestId
        });
        const initialTurnsCount = prepared.initialTurnsCount;
        logger73.info(ctx, "Creating subagent and starting execution", {
          toolCallId: meta.toolCallId,
          subagentType: typeName,
          modelId: subagentAgentConfig.modelId,
          initialTurnsCount,
          subagentId
        });
        const subagentDetachedCtx = ctx.withDetached();
        const [subagentCtx, cancelSubagent] = subagentDetachedCtx.withCancel();
        const registry2 = resourceAccessor.get(subagentRegistryResource);
        const parentRequestId = prepared.parentRequestId;
        const rootParentRequestId = prepared.rootParentRequestId;
        const baseSubagentCtx = createSubagentContext(subagentCtx, subagentRequestId, meta.toolCallId);
        const telemetryModelName = subagentConfig.isGithubBugbotSubagent ? "github_bugbot" : overriddenModelId;
        let subagentCtxWithTelemetry = baseSubagentCtx.with(requestModelNameKey, telemetryModelName);
        if (parentRequestId) {
          subagentCtxWithTelemetry = subagentCtxWithTelemetry.with(parentRequestIdKey2, parentRequestId);
        }
        registry2.register(subagentId, { cancel: cancelSubagent }, meta.toolCallId);
        const executionTimeoutMs = subagentConfig.executionTimeoutMs;
        const executionTimeoutId = executionTimeoutMs !== void 0 && Number.isFinite(executionTimeoutMs) && executionTimeoutMs > 0 ? setTimeout(() => {
          registry2.cancel(subagentId, {
            intentional: true,
            reason: `Subagent exceeded execution timeout of ${executionTimeoutMs}ms`
          });
        }, executionTimeoutMs) : void 0;
        const isParallel = registry2.size > 1;
        const parallelBatchSize = isParallel ? registry2.size : void 0;
        trackPreparedTaskSubagentCreated(ctx, prepared, {
          isParallel,
          parallelBatchSize
        });
        const agent = new AnysphereAgent(subagentAgentConfig, promptSession, interactionListener, effectiveResourceAccessor, blobStore, summarizationHandler, conversationActionReceiver);
        const iterState = {
          loopCount: 0,
          runStreamCompleted: false,
          subagentStopCalled: false
        };
        let currentAction = action;
        let currentState = conversationState;
        const completionCtx = {
          subagentId,
          subagentRequestId,
          toolCallId: meta.toolCallId,
          typeName,
          analyticsSubagentType,
          overriddenModelId,
          effectiveReadonly,
          useAskModeForSubagent,
          initialTurnsCount,
          executionStartTime,
          isParallel,
          parentModelName: parentModelInfo.modelName,
          resultSuffix: subagentConfig.resultSuffix,
          selectedContext,
          plugin: subagentConfig.plugin,
          marketplace: subagentConfig.marketplace,
          pluginId: subagentConfig.pluginId,
          marketplaceId: subagentConfig.marketplaceId,
          rawArgsPrompt: updatedRawArgs.prompt,
          rawArgsDescription: updatedRawArgs.description
        };
        const hookContext = {
          resourceAccessor,
          toolCallId: meta.toolCallId,
          subagentId,
          subagentType: typeName,
          overriddenModelId,
          parentCtx: ctx,
          enableExecuteHookExec: enableTaskToolHooksExec,
          configuredSteps
        };
        const completionDeps = {
          ctx,
          blobStore,
          resourceAccessor,
          registry: registry2,
          hookContext,
          enableTaskToolHooksExec,
          configuredSteps,
          toolName,
          postToolUseHookInput
        };
        try {
          while (true) {
            iterState.runStreamCompleted = false;
            iterState.subagentStopCalled = false;
            const turnsAtStartOfIteration = iterState.loopCount === 0 ? initialTurnsCount : currentState.turns.length;
            try {
              state = await agent.runStream(subagentCtxWithTelemetry, toRedactedConversationStateStructure(currentState, stateHandler.getPrivacyMode()), toRedactedConversationAction(currentAction, stateHandler.getPrivacyMode()), [], async (_ctx, _state) => {
              });
              iterState.runStreamCompleted = true;
              currentState = state;
            } catch (runStreamError) {
              await handleSubagentRunStreamError(runStreamError, currentState, iterState, completionCtx, completionDeps, subagentCtx.canceled, registry2.lastAbortOptions);
            }
            const iterResult = await processSubagentIterationSuccess(currentState, turnsAtStartOfIteration, iterState, completionCtx, completionDeps, (persistCtx, persistSubagentId, _subagentType, persistedState) => {
              stateHandler.persistSubagentState(persistCtx, persistSubagentId, subagentConfig.subagent_type, persistedState);
            }, subagentConfig.subagent_type);
            if (iterResult.shouldContinue) {
              currentAction = iterResult.nextAction;
            } else {
              return iterResult.finalResult;
            }
          }
        } catch (error42) {
          return await handleSubagentExecutionError(error42, state, iterState, completionCtx, completionDeps, subagentCtx.canceled, registry2.lastAbortOptions);
        } finally {
          if (executionTimeoutId !== void 0) {
            clearTimeout(executionTimeoutId);
          }
        }
      }, (r) => createTaskToolCall(new TaskToolCall({ args: baseToolCall.args, result: r })));
      return taskResult;
    } catch (e_7) {
      env_7.error = e_7;
      env_7.hasError = true;
    } finally {
      __disposeResources28(env_7);
    }
  };
  const render2 = async (_ctx, taskResult, _props) => {
    const fullText = renderTaskResultToString(taskResult, {
      enableJobCompletionNotifications: taskToolNotificationHintsEnabled,
      hideAsyncSubagentTaskNotifications,
      enableAgentChatLinks,
      cloudCoordinatorTaskVariant
    });
    if (taskResult.result.case === "success" && taskResult.result.value.backgroundReason === SubagentBackgroundReason.UNSPECIFIED) {
      const hydratedResult = tryHydrateReferencedImages(fullText, taskResult.result.value.conversationSteps);
      if (hydratedResult !== void 0) {
        return hydratedResult;
      }
    }
    return createStringResult(fullText, taskResult.result.case === "error");
  };
  return createZodAgentTool("TASK", {
    name: toolName,
    contextType: {
      type: "dynamic",
      conciseStaticContext: "Spawn local and cloud agents natively."
    },
    descriptionGenerator: buildTaskDescription,
    descriptionTokenPartsGenerator: (props, options3) => {
      const catalogsInUserInfo = areCatalogsInUserInfo(options3);
      const parts = getTaskDescriptionParts(props, catalogsInUserInfo);
      return {
        subagentDescriptionText: catalogsInUserInfo ? void 0 : parts.subagentTypeDescriptionsText,
        availableSubagentModelsDescriptionText: includeModelParameter && catalogsInUserInfo ? parts.modelsDescription : void 0,
        availableSubagentTypesDescriptionText: catalogsInUserInfo ? parts.subagentTypeDescriptionsText : void 0
      };
    },
    parameters: schemaTowardsModel,
    prepareSubagent: async (ctx, rawArgs, meta) => {
      const parsedArgs = parseTaskToolCallArgs(rawArgs);
      return await prepareTaskSubagentForLaunch(ctx, parsedArgs, meta);
    },
    execute: (ctx, handler, argsStream, meta) => withSafeParsedArgs(isPendingReplay(ctx, meta) ? replaySchema : schemaForParsing, execute, createTaskToolCall(new TaskToolCall()))(ctx, handler, argsStream, meta),
    render: render2,
    serializeError: (error42) => {
      const errorMessage7 = error42 instanceof Error ? error42.message : String(error42);
      return createTaskToolCall(new TaskToolCall({
        result: new TaskResult({
          result: {
            case: "error",
            value: new TaskError({
              error: errorMessage7
            })
          }
        })
      }));
    }
  });
};
