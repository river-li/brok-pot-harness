var __addDisposableResource24 = function(env, value, async) {
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
var __disposeResources24 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error41, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error41, e.suppressed = suppressed, e;
});
var logger65 = createLogger("@anysphere/agent");
var SUBAGENT_NOTIFICATION_VISIBLE_SUMMARY_LEAD = "The beginning of the above subagent result is already visible to the user.";
var SUBAGENT_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_WITH_VISIBLE_SUMMARY_BASE = SUBAGENT_NOTIFICATION_VISIBLE_SUMMARY_LEAD + " Perform any follow-up actions (if needed). DO NOT regurgitate or reiterate its result unless asked. If multiple subagents have now completed and none are still running, briefly summarize the findings and conclusions across all of them. Otherwise, if no follow-ups remain, end your response with a brief third-person confirmation that the subagent has completed.";
var SUBAGENT_NOTIFICATION_HIDDEN_SUMMARY_LEAD = "Perform any necessary follow-up actions in response to the subagent completion above.";
var SUBAGENT_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_HIDDEN_SUMMARY_BASE = SUBAGENT_NOTIFICATION_HIDDEN_SUMMARY_LEAD + " If no follow-up work is needed, no further action is required.";
var SUBAGENT_NOTIFICATION_ABORTED_INSTRUCTION = " A status of `aborted` means the subagent's turn was deliberately stopped (for example, the user pressed stop); treat the stop as intentional, not as a failure or accidental interruption, and do not resume, restart, re-dispatch, or send new instructions to it unless the user explicitly asks you to.";
var SUBAGENT_NOTIFICATION_CHAT_LINK_INSTRUCTION = " If you mention an agent or subagent in your response, link it with the `[label](id)` format using the agent_id or task_id from the notification instead of printing the raw ID.";
var SUBAGENT_NOTIFICATION_NAMED_LINK_INSTRUCTION = " If you mention an agent or subagent in your response, link it with the `[Name](id)` Don't use generic label such as `[agent]`, `[worker]`, or `[subagent]`.";
var SUBAGENT_NOTIFICATION_CLOUD_VIEW_LINK_INSTRUCTION = " For cloud subagents, when the agent has edited code, link to `[Review](bc-id#changes)`, or, if you know the exact added and deleted line counts, `[Review +A \u2212D](bc-id#changes)`, replacing A and D with those counts. Never write A or D literally. Use `[Try Live](bc-id#desktop)` only when the agent used computer use.";
var SUBAGENT_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_SUFFIX = " Don't repeat the same confirmation every time.";
var MIXED_WORKER_MESSAGE_INSTRUCTION = " Entries marked `reason: worker_message` are mid-turn messages from workers whose turns may still be running \u2014 they are NOT completions; do not treat those workers as finished, and take any coordination action their messages call for.";
var WORKER_MESSAGE_LEAD = "A worker agent sent you a message mid-turn.";
var WORKER_MESSAGE_ACKNOWLEDGEMENT_USER_QUERY_BASE = WORKER_MESSAGE_LEAD + " The worker's turn may still be running \u2014 do NOT treat this as the worker finishing. Take any coordination action the message calls for (reply via SendToAgent if the worker needs input). If no action is needed, no further response is required.";
var MIXED_WORKER_NEEDS_ATTENTION_INSTRUCTION = " Entries marked `reason: worker_needs_attention` are workers paused waiting for the user to respond \u2014 they are NOT completions; tell the user which worker is blocked and what it is waiting on, and do not answer on the user's behalf.";
var WORKER_NEEDS_ATTENTION_LEAD = "A worker agent is paused waiting for the user to respond.";
var WORKER_NEEDS_ATTENTION_ACKNOWLEDGEMENT_USER_QUERY_BASE = WORKER_NEEDS_ATTENTION_LEAD + " Its turn is paused, not finished \u2014 do NOT treat this as the worker completing. Tell the user which worker is blocked and what it is waiting on (the notification detail has the question or authentication request), so they can respond to the worker directly. Do NOT answer the question or approve the authentication yourself, do NOT reply via SendToAgent on the user's behalf, and do NOT start polling the worker. The user may have already responded \u2014 the worker resumes on its own once they do, so simply inform the user and end your turn if nothing else is pending.";
var USER_DRIVEN_INTERACTIVE_CHILD_LEAD = "The user is actively driving this Project child.";
var USER_DRIVEN_INTERACTIVE_CHILD_ACKNOWLEDGEMENT_USER_QUERY_BASE = USER_DRIVEN_INTERACTIVE_CHILD_LEAD + " Record the completion for coordination, but do not message the user or take over the child thread. If no coordinator bookkeeping is required, end without further action.";
var SHELL_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_BASE = "Briefly inform the user about the task result and perform any follow-up actions (if needed).";
var SHELL_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY = `<user_query>${SHELL_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_BASE}</user_query>`;
var SYNTHETIC_ACKNOWLEDGEMENT_USER_QUERY_PREFIXES = [
  SHELL_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_BASE,
  SUBAGENT_NOTIFICATION_VISIBLE_SUMMARY_LEAD,
  SUBAGENT_NOTIFICATION_HIDDEN_SUMMARY_LEAD,
  USER_DRIVEN_INTERACTIVE_CHILD_LEAD,
  WORKER_MESSAGE_LEAD,
  WORKER_NEEDS_ATTENTION_LEAD
];
var COMPOSER_SHELL_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY = `<user_query>${SHELL_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_BASE} If there's no follow-ups needed, don't explicitly say that.</user_query>`;
function wrapUserQuery(inner) {
  return `<user_query>${inner}</user_query>`;
}
function neutralizeBackgroundTaskDetailCloseTags(detail) {
  return detail.replace(/<\/\s*(task|system_notification)\s*>/gi, "&lt;/$1>").replace(/<(\/?)\s*user_query\s*>/gi, "&lt;$1user_query>");
}
function getShellNotificationAcknowledgementUserQuery(parentModelInfo) {
  if (parentModelInfo?.isComposer1 || parentModelInfo?.isComposer15 || parentModelInfo?.isComposer2 || parentModelInfo?.isComposerMatterhorn) {
    return COMPOSER_SHELL_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY;
  }
  return SHELL_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY;
}
function composeCompletionPromptMessage({ promptBody, systemReminderBlocks, acknowledgementQuery }) {
  const remindersThenBody = [...systemReminderBlocks, promptBody].join("\n\n");
  return acknowledgementQuery === void 0 ? remindersThenBody : `${remindersThenBody}
${acknowledgementQuery}`;
}
function getNotificationAcknowledgementUserQuery(completions, opts) {
  if (completions.length > 0 && completions.every((completion) => completion.notificationContext === BackgroundTaskNotificationContext.USER_DRIVEN_INTERACTIVE_CHILD)) {
    return wrapUserQuery(USER_DRIVEN_INTERACTIVE_CHILD_ACKNOWLEDGEMENT_USER_QUERY_BASE + SUBAGENT_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_SUFFIX);
  }
  if (completions.length > 0 && completions.every(isWorkerMessageCompletion)) {
    return wrapUserQuery(WORKER_MESSAGE_ACKNOWLEDGEMENT_USER_QUERY_BASE + (opts.enableAgentChatLinks ? SUBAGENT_NOTIFICATION_NAMED_LINK_INSTRUCTION : "") + SUBAGENT_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_SUFFIX);
  }
  if (completions.length > 0 && completions.every(isWorkerNeedsAttentionCompletion)) {
    return wrapUserQuery(WORKER_NEEDS_ATTENTION_ACKNOWLEDGEMENT_USER_QUERY_BASE + (opts.enableAgentChatLinks ? SUBAGENT_NOTIFICATION_NAMED_LINK_INSTRUCTION : "") + SUBAGENT_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_SUFFIX);
  }
  const hasAbortedSubagent = completions.some((completion) => completion.kind === BackgroundTaskKind.SUBAGENT && completion.status === BackgroundTaskStatus.ABORTED);
  const hasWorkerMessage = completions.some(isWorkerMessageCompletion);
  const hasWorkerNeedsAttention = completions.some(isWorkerNeedsAttentionCompletion);
  for (const completion of completions) {
    if (completion.kind === BackgroundTaskKind.SUBAGENT) {
      const basePrompt = opts.hideAsyncSubagentTaskNotifications ? SUBAGENT_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_HIDDEN_SUMMARY_BASE : SUBAGENT_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_WITH_VISIBLE_SUMMARY_BASE;
      let chatLinkInstruction = "";
      if (opts.enableAgentChatLinks) {
        if (opts.hideAsyncSubagentTaskNotifications) {
          chatLinkInstruction = SUBAGENT_NOTIFICATION_NAMED_LINK_INSTRUCTION;
          if (opts.includeCloudSubagentViewLinks) {
            chatLinkInstruction += SUBAGENT_NOTIFICATION_CLOUD_VIEW_LINK_INSTRUCTION;
          }
        } else {
          chatLinkInstruction = SUBAGENT_NOTIFICATION_CHAT_LINK_INSTRUCTION;
        }
      }
      return wrapUserQuery(basePrompt + chatLinkInstruction + (hasAbortedSubagent ? SUBAGENT_NOTIFICATION_ABORTED_INSTRUCTION : "") + (hasWorkerMessage ? MIXED_WORKER_MESSAGE_INSTRUCTION : "") + (hasWorkerNeedsAttention ? MIXED_WORKER_NEEDS_ATTENTION_INSTRUCTION : "") + SUBAGENT_NOTIFICATION_ACKNOWLEDGEMENT_USER_QUERY_SUFFIX);
    }
  }
  return getShellNotificationAcknowledgementUserQuery(opts.parentModelInfo);
}
function backgroundTaskKindLabel(kind) {
  switch (kind) {
    case BackgroundTaskKind.SHELL:
      return "shell";
    case BackgroundTaskKind.SUBAGENT:
      return "subagent";
    case BackgroundTaskKind.UNSPECIFIED:
      return "unknown";
    default: {
      const _exhaustive = kind;
      return _exhaustive;
    }
  }
}
function backgroundTaskStatusLabel(status) {
  switch (status) {
    case BackgroundTaskStatus.SUCCESS:
      return "success";
    case BackgroundTaskStatus.ERROR:
      return "error";
    case BackgroundTaskStatus.ABORTED:
      return "aborted";
    case BackgroundTaskStatus.UNSPECIFIED:
      return "unknown";
    default: {
      const _exhaustive = status;
      return _exhaustive;
    }
  }
}
function BackgroundCompletionsPrompt({ completions }) {
  const allCompletionsAreShellOutputProgress = completions.length > 0 && completions.every(isShellOutputCompletion);
  const allCompletionsAreWorkerMessages = completions.length > 0 && completions.every(isWorkerMessageCompletion);
  const allCompletionsAreWorkerNeedsAttention = completions.length > 0 && completions.every(isWorkerNeedsAttentionCompletion);
  const intro = allCompletionsAreWorkerNeedsAttention ? completions.length === 1 ? "The following worker agent is paused waiting for the user to respond. Its turn is paused, not finished \u2014 this is not a completion." : "The following worker agents are paused waiting for the user to respond. Their turns are paused, not finished \u2014 these are not completions." : allCompletionsAreWorkerMessages ? completions.length === 1 ? "The following worker agent sent you a message. Its turn may still be running \u2014 this is not a completion." : "The following worker agents sent you messages. Their turns may still be running \u2014 these are not completions." : allCompletionsAreShellOutputProgress ? completions.length === 1 ? "The following task has notified. If you were already aware, ignore this notification and do not restate prior responses." : "The following tasks notified. If you were already aware, ignore this notification and do not restate prior responses." : completions.length === 1 ? "The following task has finished. If you were already aware, ignore this notification and do not restate prior responses." : "The following tasks finished. If you were already aware, ignore this notification and do not restate prior responses.";
  return jsxs("section", { title: SYSTEM_NOTIFICATION_TAG, children: [jsx("p", { children: intro }), completions.map((completion, i) => {
    const kind = backgroundTaskKindLabel(completion.kind);
    const status = backgroundTaskStatusLabel(completion.status);
    const lines2 = [
      `kind: ${kind}`,
      `status: ${status}`,
      // Worker adoption/reparent events reuse the completion shape but
      // are not turn completions; surface the reason so the model does
      // not treat the attach as a finished work task.
      ...completion.reason === BackgroundTaskCompletionReason.WORKER_REPARENTED ? ["reason: worker_reparented"] : [],
      // Worker mid-turn parent messages likewise reuse the shape;
      // the worker's turn may still be running.
      ...completion.reason === BackgroundTaskCompletionReason.WORKER_MESSAGE ? ["reason: worker_message"] : [],
      // A durably paused worker likewise reuses the shape; its turn is
      // paused on user input, not finished.
      ...completion.reason === BackgroundTaskCompletionReason.WORKER_NEEDS_ATTENTION ? ["reason: worker_needs_attention"] : [],
      `task_id: ${escapePromptXmlText(completion.taskId)}`,
      `title: ${escapePromptXmlText(completion.title)}`,
      ...completion.toolCallId ? [`tool_call_id: ${escapePromptXmlText(completion.toolCallId)}`] : [],
      ...completion.subagentId ? [`agent_id: ${escapePromptXmlText(completion.subagentId)}`] : [],
      ...completion.detail ? [
        `detail: ${neutralizeBackgroundTaskDetailCloseTags(completion.detail)}`
      ] : [],
      ...completion.outputPath ? [`output_path: ${escapePromptXmlText(completion.outputPath)}`] : []
    ];
    return jsx("section", { title: "task", children: lines2.join("\n") }, i);
  })] });
}
function formatBackgroundCompletionsBody(completions, opts) {
  const prefix = opts.includeTimestamp ? buildTimestampPrefix(opts.timeZone, opts.mockNow) : "";
  const body = renderContent(jsx(BackgroundCompletionsPrompt, { completions }));
  return `${prefix}${body}`;
}
function formatMetaParentBackgroundCompletionsBody(completions, opts) {
  const prefix = opts.includeTimestamp ? buildTimestampPrefix(opts.timeZone, opts.mockNow) : "";
  const body = completions.map((completion) => {
    const includeSubagentResult = completion.kind !== BackgroundTaskKind.SUBAGENT || opts.hideAsyncSubagentTaskNotifications;
    const rawResultText = includeSubagentResult ? completion.detail ?? completion.outputPath ?? completion.title ?? "No result was provided." : "Subagent completed; result is already visible to the user.";
    const resultText = normalizeMetaParentResponseBody(rawResultText);
    const status = backgroundTaskStatusLabel(completion.status);
    const titleLine = completion.title && includeSubagentResult ? `title: ${escapePromptXmlText(completion.title)}
` : "";
    switch (completion.status) {
      case BackgroundTaskStatus.SUCCESS:
      case BackgroundTaskStatus.ERROR:
      case BackgroundTaskStatus.ABORTED:
      case BackgroundTaskStatus.UNSPECIFIED:
        return `${META_PARENT_COMPLETION_OPEN_TAG}
agent_id: ${escapePromptXmlText(completion.taskId)}
status: ${status}
${titleLine}response:
${resultText}
${META_PARENT_COMPLETION_CLOSE_TAG}`;
      default: {
        const _exhaustiveCheck = completion.status;
        return _exhaustiveCheck;
      }
    }
  }).join("\n\n");
  return `${prefix}${META_PARENT_COMPLETION_SYSTEM_REMINDER}

${body}`;
}
function summarizeBackgroundTaskCompletions(completions) {
  const kindCounts = { shell: 0, subagent: 0, unknown: 0 };
  const statusCounts = { success: 0, error: 0, aborted: 0, unknown: 0 };
  for (const completion of completions) {
    switch (completion.kind) {
      case BackgroundTaskKind.SHELL:
        kindCounts.shell += 1;
        break;
      case BackgroundTaskKind.SUBAGENT:
        kindCounts.subagent += 1;
        break;
      case BackgroundTaskKind.UNSPECIFIED:
        kindCounts.unknown += 1;
        break;
      default: {
        const _exhaustive = completion.kind;
        void _exhaustive;
        kindCounts.unknown += 1;
        break;
      }
    }
    switch (completion.status) {
      case BackgroundTaskStatus.SUCCESS:
        statusCounts.success += 1;
        break;
      case BackgroundTaskStatus.ERROR:
        statusCounts.error += 1;
        break;
      case BackgroundTaskStatus.ABORTED:
        statusCounts.aborted += 1;
        break;
      case BackgroundTaskStatus.UNSPECIFIED:
        statusCounts.unknown += 1;
        break;
      default: {
        const _exhaustive = completion.status;
        void _exhaustive;
        statusCounts.unknown += 1;
        break;
      }
    }
  }
  return {
    num_completions: completions.length,
    kind_counts: kindCounts,
    status_counts: statusCounts
  };
}
function isShellOutputCompletion(completion) {
  return completion.reason === BackgroundTaskCompletionReason.TASK_PROGRESS;
}
function isWorkerMessageCompletion(completion) {
  return completion.reason === BackgroundTaskCompletionReason.WORKER_MESSAGE;
}
function isWorkerNeedsAttentionCompletion(completion) {
  return completion.reason === BackgroundTaskCompletionReason.WORKER_NEEDS_ATTENTION;
}
function logBackgroundTaskCompletionOutcome(ctx, outcome, summary, extra) {
  logger65.info(ctx, "agent.background_task_completion", {
    event: "agent.background_task_completion",
    outcome,
    ...summary,
    ...extra
  });
}
function deriveBackgroundShellExitOutcome(completion) {
  switch (completion.status) {
    case BackgroundTaskStatus.SUCCESS:
      return { exitCode: 0, aborted: false };
    case BackgroundTaskStatus.ABORTED:
      return { exitCode: null, aborted: true };
    default: {
      const match2 = completion.detail?.match(/^exit_code=(-?\d+)$/);
      return {
        exitCode: match2 ? Number(match2[1]) : null,
        aborted: false
      };
    }
  }
}
function recordShellCompletionExit(ctx, completion) {
  if (completion.kind === BackgroundTaskKind.SHELL && completion.reason === BackgroundTaskCompletionReason.TASK_FINISHED) {
    recordBackgroundShellExited(ctx, completion.taskId, deriveBackgroundShellExitOutcome(completion));
  }
}
function getBackgroundTaskCompletionMetadata(completions) {
  const metadataCandidates = completions.map((completion) => {
    const title = completion.title?.trim();
    const taskId = completion.taskId?.trim();
    const parsedTitle = title !== void 0 && title.length > 0 ? title : void 0;
    const parsedTaskId = taskId !== void 0 && taskId.length > 0 ? taskId : void 0;
    if (parsedTitle === void 0 && parsedTaskId === void 0) {
      return void 0;
    }
    return {
      ...parsedTitle !== void 0 ? { title: parsedTitle } : {},
      ...parsedTaskId !== void 0 ? { taskId: parsedTaskId } : {}
    };
  }).filter((metadata) => metadata !== void 0);
  if (metadataCandidates.length === 0) {
    return void 0;
  }
  return metadataCandidates[0];
}
function collectBackgroundTaskCompletionIds(completions) {
  return completions.map((completion) => completion.taskId?.trim()).filter((taskId) => taskId !== void 0 && taskId.length > 0);
}
function getBackgroundTaskCompletionThreadId(completions, stateHandler) {
  let resolvedThreadId;
  for (const completion of completions) {
    const threadId = completion.threadId?.trim() || stateHandler.getSubagentThreadId(completion.taskId);
    if (threadId === void 0 || threadId.length === 0) {
      continue;
    }
    if (resolvedThreadId === void 0) {
      resolvedThreadId = threadId;
      continue;
    }
    if (threadId !== resolvedThreadId) {
      return void 0;
    }
  }
  return resolvedThreadId;
}
var BackgroundTaskCompletionActionHandler = class extends AbstractUserMessageActionHandler {
  async prepareFollowupTurn(ctx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const completionAction = fromRedactedBackgroundTaskCompletionAction(action, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    for (const completion of completionAction.completions) {
      stateHandler.recordSubagentRunCompletion(completion);
      recordShellCompletionExit(ctx, completion);
    }
    const isMetaParentAgent = this.config.featureFlags?.glassMetaParentAgent === true;
    if (this.config.featureFlags?.disableBackgroundTaskFollowUp && !isMetaParentAgent) {
      logBackgroundTaskCompletionOutcome(ctx, "skipped_disabled", summarizeBackgroundTaskCompletions(completionAction.completions), {
        is_meta_parent: isMetaParentAgent,
        task_ids: collectBackgroundTaskCompletionIds(completionAction.completions)
      });
      return {
        kind: "skip",
        ctx,
        state: await stateHandler.computeNewStructure(ctx)
      };
    }
    const modelVisibleCompletions = completionAction.completions.filter((completion) => !completion.recordOnly);
    if (modelVisibleCompletions.length === 0 && completionAction.completions.length > 0) {
      logBackgroundTaskCompletionOutcome(ctx, "skipped_record_only", summarizeBackgroundTaskCompletions(completionAction.completions), {
        is_meta_parent: isMetaParentAgent,
        task_ids: collectBackgroundTaskCompletionIds(completionAction.completions)
      });
      return {
        kind: "record_only",
        ctx,
        state: await stateHandler.computeNewStructure(ctx)
      };
    }
    const completions = this.config.featureFlags?.enableBackgroundTaskProgress ? modelVisibleCompletions : modelVisibleCompletions.filter((completion) => !isShellOutputCompletion(completion));
    const summary = summarizeBackgroundTaskCompletions(completions);
    if (completions.length === 0) {
      logBackgroundTaskCompletionOutcome(ctx, "skipped_empty", summary, {
        is_meta_parent: isMetaParentAgent,
        task_ids: collectBackgroundTaskCompletionIds(completionAction.completions)
      });
      return {
        kind: "skip",
        ctx,
        state: await stateHandler.computeNewStructure(ctx)
      };
    }
    await reactivatePausedGoalForTurn(ctx, stateHandler, onStateUpdate);
    const lastTurnRef = stateHandler.turns.at(-1);
    let sourceUserMessage;
    if (lastTurnRef) {
      const lastTurn = await lastTurnRef.get(ctx);
      if (lastTurn instanceof AgentConversationTurnHandle) {
        sourceUserMessage = await lastTurn.userMessage.get(ctx);
      }
    }
    const requestContext = await getRedactedRequestContext(ctx, void 0, this.resourceAccessor, buildRequestContextOptions(this.config));
    const unredactedRequestContext = fromRedactedRequestContext(requestContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    const mergedMcpTools = this.mergeRequestContextTools(mcpTools, requestContext.tools);
    const repositoryInfos = requestContext.repositoryInfo.map((ri2) => fromRedactedRepositoryIndexingInfo(ri2, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
    const followUpMode = stateHandler.mode ?? sourceUserMessage?.mode ?? AgentMode.AGENT;
    const enableAgentChatLinks = this.config.featureFlags?.enableAgentChatLinks !== false;
    const hideAsyncSubagentTaskNotifications = this.config.featureFlags?.hideAsyncSubagentTaskNotifications === true;
    const includeCloudSubagentViewLinks = this.config.agentType === AgentType.IDE || this.config.useLocalAgentPrompting === true;
    const formatOpts = {
      timeZone: unredactedRequestContext.env?.timeZone,
      mockNow: unredactedRequestContext.env?.devMockPromptTime?.toDate(),
      includeTimestamp: this.config.featureFlags?.userMessageTimestamps === true && !stateHandler.isDsv3(),
      parentModelInfo: this.config.modelInfo,
      enableAgentChatLinks,
      hideAsyncSubagentTaskNotifications,
      includeCloudSubagentViewLinks
    };
    if (!stateHandler.isRootProjectConversation) {
      stateHandler.isRootProjectConversation = (await resolveProjectConversationContext(ctx, stateHandler)).isRootProject;
    }
    const sendMessageEnabled = isProjectSendMessageEnabled(stateHandler);
    const acknowledgementQuery = getNotificationAcknowledgementUserQuery(completions, formatOpts);
    const batchSystemReminder = completionAction.systemReminder?.trim();
    const perCompletionMessages = completions.map((completion, index) => {
      const body = isMetaParentAgent ? formatMetaParentBackgroundCompletionsBody([completion], formatOpts) : formatBackgroundCompletionsBody([completion], formatOpts);
      const isLast = index === completions.length - 1;
      const completionMessage = isLast ? `${body}
${acknowledgementQuery}` : body;
      const systemReminder = isLast && batchSystemReminder !== void 0 && batchSystemReminder !== "" ? batchSystemReminder : void 0;
      const messageId = (0, import_node_crypto33.randomUUID)();
      const incomingMessageIdTag = sendMessageEnabled ? renderIncomingMessageIdTag(messageId) : void 0;
      return {
        completionMessage,
        promptBody: incomingMessageIdTag === void 0 ? body : `${incomingMessageIdTag}
${body}`,
        promptAcknowledgementQuery: isLast ? acknowledgementQuery : void 0,
        systemReminder,
        completionMetadata: getBackgroundTaskCompletionMetadata([completion]),
        completionThreadId: getBackgroundTaskCompletionThreadId([completion], stateHandler),
        messageId
      };
    });
    logBackgroundTaskCompletionOutcome(ctx, "ran_followup", summary, {
      is_meta_parent: isMetaParentAgent,
      has_source_user_message: sourceUserMessage !== void 0,
      task_ids: collectBackgroundTaskCompletionIds(completions)
    });
    const dynamicToolTurnOptions = getDynamicToolTurnSnapshot(this.config.toolsGenerator({
      resourceAccessor: this.resourceAccessor,
      stateHandler,
      agentSessionId: this.config.agentSessionId,
      mcpTools: mergedMcpTools,
      repositoryInfos,
      blobStore: stateHandler.getBlobStore(),
      mode: stateHandler.resolveStepMode({ mode: followUpMode }),
      loggingContext: ctx,
      requestContext: unredactedRequestContext,
      fileOperationLockManager: new FileOperationLockManager(),
      smartModeClassifierMode: this.config.smartModeClassifierMode,
      smartModeClassifierShadowMode: this.config.smartModeClassifierShadowMode,
      autoRejectFirstAskQuestion: this.config.autoRejectFirstAskQuestion
    }));
    let latestTurn;
    for (const { completionMessage, promptBody, promptAcknowledgementQuery, systemReminder, completionMetadata, completionThreadId, messageId } of perCompletionMessages) {
      const syntheticUserMessage = new UserMessage({
        text: completionMessage,
        messageId,
        selectedContext: sourceUserMessage?.selectedContext ? fromRedactedSelectedContext(sourceUserMessage.selectedContext, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : new SelectedContext(),
        mode: followUpMode,
        isSimulatedMsg: true,
        simulatedMsgReason: SimulatedMsgReason.BACKGROUND_TASK_COMPLETION,
        ...completionMetadata !== void 0 && {
          simulatedMessageMetadata: completionMetadata
        },
        ...systemReminder !== void 0 && {
          subagentSystemReminder: systemReminder
        }
      });
      ensureUserMessageTiming(syntheticUserMessage);
      if (completionThreadId !== void 0 && completionThreadId.length > 0) {
        syntheticUserMessage.threadId = completionThreadId;
      }
      await this.interactionListener.sendUpdate(ctx, toRedactedInteractionUpdate(Updates.userMessageAppended(syntheticUserMessage), stateHandler.getPrivacyMode()));
      const { turn, systemReminder: offloadReminder } = await stateHandler.createBackgroundTaskCompletionTurn(ctx, syntheticUserMessage, unredactedRequestContext, this.config, this.resourceAccessor, dynamicToolTurnOptions);
      latestTurn = turn;
      rootPromptExecutor.appendMessages(toRedactedCoreMessages([
        {
          role: "user",
          content: composeCompletionPromptMessage({
            promptBody,
            systemReminderBlocks: [
              ...systemReminder !== void 0 ? [
                `<system_reminder>
${systemReminder}
</system_reminder>`
              ] : [],
              ...offloadReminder !== void 0 ? [offloadReminder] : []
            ],
            acknowledgementQuery: promptAcknowledgementQuery
          })
        }
      ], stateHandler.getPrivacyMode()));
    }
    if (latestTurn === void 0) {
      return {
        kind: "skip",
        ctx,
        state: await stateHandler.computeNewStructure(ctx)
      };
    }
    return {
      kind: "ready",
      ctx,
      latestTurn,
      mergedMcpTools,
      repositoryInfos,
      requestContext: unredactedRequestContext
    };
  }
  async handle(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource24(env_1, createSpan(parentCtx.withName("handleBackgroundTaskCompletionAction")), false);
      const followup = await this.prepareFollowupTurn(span.ctx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate);
      if (followup.kind === "ready") {
        await this.runTurnLoop(followup.ctx, rootPromptExecutor, stateHandler, followup.latestTurn, this.config.toolsGenerator, followup.mergedMcpTools, followup.repositoryInfos, followup.requestContext, onStateUpdate);
      }
      return await stateHandler.computeNewStructure(followup.ctx);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources24(env_1);
    }
  }
  async handleSingleStep(ctx, action, _rootPromptExecutor, stateHandler, _mcpTools, _onStateUpdate) {
    const completionAction = fromRedactedBackgroundTaskCompletionAction(action, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    for (const completion of completionAction.completions) {
      stateHandler.recordSubagentRunCompletion(completion);
      recordShellCompletionExit(ctx, completion);
    }
    return {
      state: await stateHandler.computeNewStructure(ctx),
      hasToolCall: false
    };
  }
  async handleModelStep(parentCtx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource24(env_2, createSpan(parentCtx.withName("handleBackgroundTaskCompletionModelStep")), false);
      const followup = await this.prepareFollowupTurn(span.ctx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate);
      if (followup.kind === "record_only") {
        return {
          state: followup.state,
          toolCallDescriptors: [],
          splitStepData: { modelResponseMessages: [], stateOnlyStep: true }
        };
      }
      if (followup.kind === "skip") {
        return {
          state: followup.state,
          toolCallDescriptors: [],
          splitStepData: { modelResponseMessages: [] }
        };
      }
      const { toolCallDescriptors, splitStepData } = await this.runModelStep(followup.ctx, rootPromptExecutor, stateHandler, followup.latestTurn, this.config.toolsGenerator, followup.mergedMcpTools, followup.repositoryInfos, followup.requestContext, onStateUpdate);
      return {
        state: await stateHandler.computeNewStructure(followup.ctx),
        toolCallDescriptors,
        splitStepData
      };
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources24(env_2);
    }
  }
};
