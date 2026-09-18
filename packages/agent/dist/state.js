var __addDisposableResource19 = function(env, value, async) {
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
var __disposeResources19 = /* @__PURE__ */ (function(SuppressedError2) {
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
var __classPrivateFieldGet3 = function(receiver, state, kind, f2) {
  if (kind === "a" && !f2) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f2 : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f2 : kind === "a" ? f2.call(receiver) : f2 ? f2.value : state.get(receiver);
};
var _ConversationStateHandle_instances;
var _ConversationStateHandle_suppressesMultitask;
var _ConversationStateHandle_createAgentTurn;
var _logger3 = createLogger("@anysphere/agent:state");
var textDecoder2 = new TextDecoder();
var MODEL_SWITCH_REMINDER = `<system_reminder>
Earlier turns were produced by a different AI model. It may have called tools that are no longer available to you. Call only the tools currently defined for you, using your current schemas, and follow your own response style rather than imitating the prior model's behavior.
</system_reminder>`;
function renderIncomingMessageIdTag(messageId) {
  const normalizedMessageId = messageId?.trim();
  if (normalizedMessageId === void 0 || normalizedMessageId.length === 0 || hasInvalidXmlTextCharacter(normalizedMessageId)) {
    return void 0;
  }
  return `<incoming_message_id>${escapePromptXmlText(normalizedMessageId)}</incoming_message_id>`;
}
function hasInvalidXmlTextCharacter(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      return true;
    }
  }
  return false;
}
function shouldExposeIncomingMessageId(userMessage2) {
  if (userMessage2.isSimulatedMsg !== true) {
    return true;
  }
  if (userMessage2.simulatedMsgReason === SimulatedMsgReason.USER_QUICK_ACTION) {
    return true;
  }
  if (userMessage2.simulatedMsgReason !== SimulatedMsgReason.SUBSCRIPTION) {
    return false;
  }
  return isNotificationOnlyUserMessage({
    role: "user",
    content: userMessage2.text
  });
}
var DYNAMIC_TOOL_OFFLOAD_REMINDER_MIN_GROWTH = 2;
function shouldInjectDynamicToolsOffloadReminder(previousDynamicToolCount, currentDynamicToolCount) {
  return previousDynamicToolCount !== void 0 && currentDynamicToolCount - previousDynamicToolCount >= DYNAMIC_TOOL_OFFLOAD_REMINDER_MIN_GROWTH;
}
function buildDynamicToolsOffloadedReminder(toolNames, newlyOffloadedToolNames) {
  const { discoveryToolName, invocationToolName } = toolNames;
  const movedTools = newlyOffloadedToolNames.length > 0 ? `${newlyOffloadedToolNames.map((name17) => `\`${name17}\``).join(", ")} are no longer direct tools; they` : "Some tools that appeared as direct tool calls in earlier turns are no longer direct tools; they";
  return `<system_reminder>
The set of dynamic tools in this conversation has expanded. ${movedTools} now live in the \`${CURSOR_DYNAMIC_TOOLS_NAMESPACE}\` namespace. Read their schemas with ${discoveryToolName} and invoke them with ${invocationToolName} (namespace "${CURSOR_DYNAMIC_TOOLS_NAMESPACE}"). Do not call them by their bare names.
</system_reminder>`;
}
async function getPreviousAgentConversationTurn(ctx, turns) {
  for (let i = turns.length - 1; i >= 0; i--) {
    const turnHandle = await turns[i].get(ctx);
    if (turnHandle instanceof AgentConversationTurnHandle) {
      return turnHandle;
    }
  }
  return void 0;
}
var PREVIOUS_RECORDED_DYNAMIC_TOOL_COUNT_SCAN_LIMIT = 16;
async function getPreviousRecordedDynamicToolSnapshot(ctx, turns, scanLimit = PREVIOUS_RECORDED_DYNAMIC_TOOL_COUNT_SCAN_LIMIT) {
  let scanned = 0;
  for (let i = turns.length - 1; i >= 0; i--) {
    if (scanned >= scanLimit) {
      previousRecordedDynamicToolCountScanTurns.histogram(ctx, scanned, {
        outcome: "capped"
      });
      return void 0;
    }
    scanned++;
    const turnHandle = await turns[i].get(ctx);
    if (!(turnHandle instanceof AgentConversationTurnHandle)) {
      continue;
    }
    const inner = turnHandle.getInnerStructure();
    if (inner.dynamicToolCount !== void 0) {
      previousRecordedDynamicToolCountScanTurns.histogram(ctx, scanned, {
        outcome: "found"
      });
      return { count: inner.dynamicToolCount, names: inner.dynamicToolNames };
    }
  }
  previousRecordedDynamicToolCountScanTurns.histogram(ctx, scanned, {
    outcome: "none"
  });
  return void 0;
}
function diffNewlyOffloadedToolNames({ current, previous }) {
  const previousSet = new Set(previous);
  return [...new Set(current)].filter((name17) => !previousSet.has(name17)).sort();
}
function decryptTurnModelMcid(turnHandle, decryptMcidAndParams) {
  if (decryptMcidAndParams === void 0) {
    return void 0;
  }
  const encrypted = turnHandle.getInnerStructure().encryptedModel;
  if (encrypted === void 0 || encrypted.length === 0) {
    return void 0;
  }
  try {
    return decryptMcidAndParams(encrypted);
  } catch {
    return void 0;
  }
}
var SERIALIZE_MESSAGE_SLOW_THRESHOLD_MS = 1;
var stateSnapshotDuration = createHistogram("agent.ttft.createTurn.stateSnapshotMs", {
  description: "Time for computeNewStructure + serialize + getBlobId at the start of createAgentTurn",
  labelNames: ["overlap"]
});
var snapshotJoinWaitDuration = createHistogram("agent.ttft.createTurn.snapshotJoinWaitMs", {
  description: "Time the overlap treatment waits for the pre-turn snapshot after selected-context processing"
});
var overlapSavedDuration = createHistogram("agent.ttft.createTurn.overlapSavedMs", {
  description: "Wall-clock pre-turn snapshot time hidden by concurrent turn preparation in the overlap treatment"
});
var dynamicToolsOffloadReminderInjected = createCounter("agent.dynamic_tools.offload_reminder_injected", {
  description: "Turns whose prompt received the dynamic-tools offload system reminder",
  labelNames: ["named", "user.is_dev"]
});
var userMessageBlobDuration = createHistogram("agent.ttft.createTurn.userMessageBlobMs", {
  description: "Time to serialize, hash, and persist the user message blob at the end of createAgentTurn"
});
var previousRecordedDynamicToolCountScanTurns = createHistogram("agent.dynamic_tool_count.scan_turns", {
  description: "Turns inspected looking for the previous recorded dynamic tool count.",
  labelNames: ["outcome"]
});
function isTextPart(part) {
  return part.type === "text";
}
function hasUserMessageIdTag(contentParts2) {
  if (contentParts2.length === 0) {
    return false;
  }
  const firstPart = contentParts2[0];
  return isTextPart(firstPart) ? parseLeadingUserMessageIdTag(firstPart.text) !== void 0 : false;
}
function normalizeNonEmptyString2(value) {
  const normalized = value?.trim();
  return normalized !== void 0 && normalized.length > 0 ? normalized : void 0;
}
function unwrapPossiblyRedactedCodeString(value) {
  if (value === void 0 || value === null) {
    return void 0;
  }
  return typeof value === "string" ? value : value.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
}
function toCommunicateUpdateTurnState(state) {
  return {
    history: (state.history ?? []).map((entry) => new CommunicateUpdateHistoryEntry({
      step: unwrapPossiblyRedactedCodeString(entry.step) ?? "",
      messageIndex: entry.messageIndex
    })),
    finalSummary: normalizeNonEmptyString2(unwrapPossiblyRedactedCodeString(state.finalSummary)),
    completedSubtitle: normalizeNonEmptyString2(unwrapPossiblyRedactedCodeString(state.completedSubtitle))
  };
}
function getExplicitUserMessageThreadId(userMessage2) {
  return normalizeNonEmptyString2(userMessage2.threadId);
}
function resolveUserMessageThreadId(userMessage2) {
  return getExplicitUserMessageThreadId(userMessage2) ?? normalizeNonEmptyString2(userMessage2.promptReferenceId) ?? normalizeNonEmptyString2(userMessage2.messageId);
}
function withUserMessageThreadId(userMessage2, threadId) {
  return {
    ...userMessage2,
    threadId
  };
}
function resolvePromptReferenceId(isMetaParentAgent, promptReferenceIdFromUserMessage, userMessageId, userContent) {
  const alreadyHasPromptReferenceIdTag = hasUserMessageIdTag(userContent);
  const existingPromptReferenceIdTag = alreadyHasPromptReferenceIdTag && userContent.length > 0 && isTextPart(userContent[0]) ? parseLeadingUserMessageIdTag(userContent[0].text) : void 0;
  const hasStructuredPromptReferenceId = promptReferenceIdFromUserMessage !== void 0 && promptReferenceIdFromUserMessage.length > 0;
  let promptReferenceId = hasStructuredPromptReferenceId ? promptReferenceIdFromUserMessage : existingPromptReferenceIdTag?.id;
  const shouldIncludePromptReferenceIdTag = isMetaParentAgent && !hasStructuredPromptReferenceId && !alreadyHasPromptReferenceIdTag;
  if (shouldIncludePromptReferenceIdTag && promptReferenceId === void 0) {
    promptReferenceId = createPromptReferenceId(userMessageId);
  }
  return {
    hasStructuredPromptReferenceId,
    promptReferenceId,
    shouldIncludePromptReferenceIdTag
  };
}
var conversationStateRestoreDurationMs = createHistogram("agent.conversation_state.restore.duration_ms", {
  description: "Wall time for fromConversationStateStructure (KV blob loads + handle setup).",
  labelNames: ["crossed_large_threshold"]
});
var conversationStateRestoreRootPromptMessageCount = createHistogram("agent.conversation_state.restore.root_prompt_message_count", {
  description: "Count of root prompt message blobs loaded (one getBlob per persisted message).",
  labelNames: ["crossed_large_threshold"]
});
var conversationStateRestoreTurnReferenceCount = createHistogram("agent.conversation_state.restore.turn_reference_count", {
  description: "Count of lazy turn references in persisted state (not materialized here).",
  labelNames: ["crossed_large_threshold"]
});
var conversationStateRestoreFileStatePathCount = createHistogram("agent.conversation_state.restore.file_state_path_count", {
  description: "Number of paths in file_states_v2.",
  labelNames: ["crossed_large_threshold"]
});
var conversationStateRestoreTotalBytes = createHistogram("agent.conversation_state.restore.total_restored_bytes", {
  description: "Bytes eagerly loaded during restore (root prompt blobs).",
  labelNames: ["crossed_large_threshold"]
});
var conversationStateRestorePhaseMs = createHistogram("agent.conversation_state.restore.phase_ms", {
  description: "Wall time for each phase of fromConversationStateStructure (root prompt blob loads, file-state wiring, subagent state refs, other setup). Sum \u2248 restore.duration_ms.",
  labelNames: ["phase", "crossed_large_threshold"]
});
var conversationStateRestoreBlobFetchConcurrency = createHistogram("agent.conversation_state.restore.blob_fetch_concurrency", {
  description: "Effective max concurrent blob reads for this restore (agent_state_restore_config.blob_fetch_concurrency after schema validation; the 32 fallback means the console value was absent or failed to parse)."
});
var conversationStateComputeRootPromptMode = createCounter("agent.conversation_state.compute.root_prompt_mode", {
  description: "Counts whether computeNewStructure rebuilt root prompt blobs or reused a persisted prefix.",
  labelNames: ["mode"]
});
var LARGE_RESTORE_TOTAL_BYTES = 2 * 1024 * 1024;
var LARGE_RESTORE_IMAGE_BYTES = 512 * 1024;
var SLOW_RESTORE_DURATION_MS = 200;
var RESTORE_BLOB_FETCH_CONCURRENCY = 32;
function estimatePayloadBytes(payload) {
  if (typeof payload === "string") {
    return Buffer.byteLength(payload, "utf8");
  }
  if (payload instanceof Uint8Array) {
    return payload.byteLength;
  }
  if (payload instanceof ArrayBuffer) {
    return payload.byteLength;
  }
  if (payload instanceof URL) {
    return Buffer.byteLength(payload.toString(), "utf8");
  }
  return 0;
}
function getCoreMessageImagePayloadStats(message) {
  const stats = { imageBytes: 0, imagePartCount: 0 };
  if (!Array.isArray(message.content)) {
    return stats;
  }
  for (const part of message.content) {
    if (part && typeof part === "object" && part.type === "image") {
      const imagePart = part;
      stats.imagePartCount++;
      stats.imageBytes += estimatePayloadBytes(imagePart.image ?? imagePart.data);
    }
  }
  return stats;
}
function buildCurrentTimestamp(timeZone, mockNow) {
  const now = mockNow ?? /* @__PURE__ */ new Date();
  try {
    const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone || void 0,
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
    const formatted = dateTimeFormatter.format(now);
    const offsetFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone || void 0,
      timeZoneName: "shortOffset"
    });
    const parts = offsetFormatter.formatToParts(now);
    const tzPart = parts.find((p2) => p2.type === "timeZoneName");
    const utcOffset = (tzPart?.value ?? "UTC").replace("GMT", "UTC");
    return `${formatted} (${utcOffset})`;
  } catch {
    return now.toISOString();
  }
}
function buildTimestampPrefix(timeZone, mockNow) {
  return `<timestamp>${buildCurrentTimestamp(timeZone, mockNow)}</timestamp>
`;
}
function isValidTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}
function resolveConversationStartTimeZone(timeZone) {
  if (timeZone && isValidTimeZone(timeZone)) {
    return timeZone;
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
function buildDateStringForTimestampMs(timestampMs2, timeZone) {
  const timestamp3 = new Date(Number(timestampMs2));
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: isValidTimeZone(timeZone) ? timeZone : "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const parts = formatter.formatToParts(timestamp3);
  const partLookup = {};
  for (const part of parts) {
    if (part.type === "literal") {
      continue;
    }
    partLookup[part.type] = part.value;
  }
  const year = partLookup.year;
  const month = partLookup.month;
  const day = partLookup.day;
  if (!year || !month || !day) {
    throw new Error(`Failed to build local date for timestamp ${timestampMs2.toString()} in timezone ${timeZone}`);
  }
  return `${year}-${month}-${day}`;
}
var serializedMessageCache = /* @__PURE__ */ new WeakMap();
var coreToRedactedMap = /* @__PURE__ */ new WeakMap();
var serializedSubagentStateCache = /* @__PURE__ */ new WeakMap();
function createRedactedSerdes(privacyMode) {
  return {
    shellCommand: createRedactedProtoSerde(ShellCommand, toRedactedShellCommand, fromRedactedShellCommand, privacyMode),
    shellOutput: createRedactedProtoSerde(ShellOutput, toRedactedShellOutput, fromRedactedShellOutput, privacyMode),
    userMessage: createRedactedProtoSerde(UserMessage, toRedactedUserMessage2, fromRedactedUserMessage2, privacyMode),
    conversationStep: createRedactedProtoSerde(ConversationStep, toRedactedConversationStep, fromRedactedConversationStep, privacyMode),
    conversationSummary: createRedactedProtoSerde(ConversationSummary, toRedactedConversationSummary, fromRedactedConversationSummary, privacyMode),
    conversationSummaryArchive: createRedactedProtoSerde(ConversationSummaryArchive, toRedactedConversationSummaryArchive, fromRedactedConversationSummaryArchive, privacyMode),
    conversationPlan: createRedactedProtoSerde(ConversationPlan, toRedactedConversationPlan, fromRedactedConversationPlan, privacyMode),
    todoItem: createRedactedProtoSerde(TodoItem, toRedactedTodoItem, fromRedactedTodoItem, privacyMode),
    subagentPersistedState: createRedactedProtoSerde(SubagentPersistedState, toRedactedSubagentPersistedState, fromRedactedSubagentPersistedState, privacyMode),
    coreMessage: createRedactedCoreMessageSerde(privacyMode)
  };
}
function toFileStateContentReference(blobStore, content) {
  return content !== void 0 ? new EagerReference(utf8Serde, blobStore, content) : void 0;
}
function recordFileStateInMap(fileStates, blobStore, path31, content, prevContent, skipReprioritization) {
  const existing = fileStates.get(path31);
  const next = existing === void 0 ? {
    content: toFileStateContentReference(blobStore, content),
    initialContent: toFileStateContentReference(blobStore, prevContent)
  } : {
    content: toFileStateContentReference(blobStore, content),
    initialContent: existing.initialContent
  };
  if (skipReprioritization) {
    fileStates.set(path31, next);
    return;
  }
  const otherEntries = Array.from(fileStates).filter(([key]) => key !== path31);
  fileStates.clear();
  fileStates.set(path31, next);
  for (const [key, value] of otherEntries) {
    fileStates.set(key, value);
  }
}
function parseAgentType(agentType) {
  switch (agentType) {
    case AgentType.IDE:
    case AgentType.CLI:
    case AgentType.BACKGROUND:
    case AgentType.BUGBOT:
      return agentType;
    case void 0:
      return void 0;
    default:
      return void 0;
  }
}
function toTrackedGitRepoBranches(gitRepos) {
  return gitRepos.map((repo) => ({
    repoPath: repo.path,
    branchName: repo.branchName
  }));
}
function collectTrackedGitBranchChanges(previousRepos, currentRepos) {
  if (previousRepos.length === 0 || currentRepos.length === 0) {
    return [];
  }
  const previousByPath = new Map(previousRepos.map((repo) => [repo.repoPath, repo.branchName]));
  const changes = [];
  for (const currentRepo of currentRepos) {
    const previousBranchName = previousByPath.get(currentRepo.repoPath);
    if (previousBranchName === void 0) {
      continue;
    }
    if (previousBranchName === currentRepo.branchName) {
      continue;
    }
    changes.push({
      repoPath: currentRepo.repoPath,
      from: previousBranchName,
      to: currentRepo.branchName
    });
  }
  return changes;
}
function buildLegacyTrackedGitRepoBranchReminder(changes) {
  if (changes.length === 0) {
    return "";
  }
  const changedLines = changes.map((c) => `${c.repoPath} changed from ${c.from} to ${c.to}.`);
  return `<system_reminder>
The active branch changed since the last turn:
${changedLines.join("\n")}
Assume these branch changes were intentional and use the new branch state as the current working context.
</system_reminder>`;
}
function buildTrackedGitRepoBranchReminder(previousRepos, currentGitRepos, enhancedBranchChangeReminder) {
  const currentTracked = toTrackedGitRepoBranches(currentGitRepos);
  const changes = collectTrackedGitBranchChanges(previousRepos, currentTracked);
  if (changes.length === 0) {
    return "";
  }
  if (!enhancedBranchChangeReminder) {
    return buildLegacyTrackedGitRepoBranchReminder(changes);
  }
  const repoByPath = new Map(currentGitRepos.map((r) => [r.path, r]));
  const bodyLines = [];
  let anyAncestor = false;
  for (const c of changes) {
    let line = `${c.repoPath}: changed from "${c.from}" to "${c.to}".`;
    const repo = repoByPath.get(c.repoPath);
    if (repo?.previousBranchIsAncestor === true) {
      line += " The previous branch is an ancestor of the current HEAD.";
      anyAncestor = true;
    }
    bodyLines.push(line);
  }
  const footer = anyAncestor ? "Prior edits should be present on the current branch." : "Use the current branch as the working context.";
  return `<system_reminder>
The active git branch changed since the last turn:
${bodyLines.join("\n")}
${footer}
</system_reminder>`;
}
var ShellConversationTurnHandle = class extends Writeable {
  constructor(blobStore, serdes, turnStructure, blobId = void 0) {
    super();
    this.blobStore = blobStore;
    this.serdes = serdes;
    this.turnStructure = turnStructure;
    this.blobId = blobId;
    this.dirty = false;
    this.mutations = 0;
    this.shellCommand = new LazyReference(serdes.shellCommand, blobStore, this.turnStructure.shellCommand);
    this.shellOutput = new LazyReference(serdes.shellOutput, blobStore, this.turnStructure.shellOutput);
  }
  serialize() {
    return conversationTurnStructureSerde2.serialize(new ConversationTurnStructure({
      turn: { case: "shellConversationTurn", value: this.turnStructure }
    }));
  }
  markDirty() {
    this.dirty = true;
    this.mutations += 1;
  }
  async writeToBlobStore(ctx) {
    if (!this.dirty && this.blobId !== void 0) {
      return this.blobId;
    }
    const mutations = this.mutations;
    const newShellCommandBlobId = await this.shellCommand.writeToBlobStore(ctx);
    const newShellOutputBlobId = await this.shellOutput.writeToBlobStore(ctx);
    const newTurnStructure = new ShellConversationTurnStructure({
      shellCommand: new Uint8Array(newShellCommandBlobId),
      shellOutput: new Uint8Array(newShellOutputBlobId)
    });
    const serializedWrapper = conversationTurnStructureSerde2.serialize(new ConversationTurnStructure({
      turn: { case: "shellConversationTurn", value: newTurnStructure }
    }));
    const newBlobId = await getBlobId(serializedWrapper);
    if (this.blobId !== void 0 && isEqual(this.blobId, newBlobId)) {
      if (this.mutations === mutations)
        this.dirty = false;
      return this.blobId;
    }
    getBlobMetadataCallback(this.blobStore)?.({
      blobId: newBlobId,
      blobType: {
        kind: "proto",
        typeName: "agent.v1.ConversationTurnStructure"
      }
    });
    await this.blobStore.setBlob(ctx, newBlobId, serializedWrapper);
    if (this.mutations === mutations) {
      this.turnStructure = newTurnStructure;
      this.blobId = newBlobId;
      this.dirty = false;
    }
    return newBlobId;
  }
  recordShellOutput(shellOutput) {
    this.shellOutput.set(shellOutput);
    this.markDirty();
  }
};
function extractWorkspaceUris(_ctx, requestContext) {
  const workspacePaths = requestContext.env?.workspacePaths ?? [];
  const uris = [];
  for (const workspacePath of workspacePaths) {
    if (typeof workspacePath !== "string") {
      continue;
    }
    const trimmedPath = workspacePath.trim();
    if (trimmedPath.length === 0) {
      continue;
    }
    if (trimmedPath.includes("://")) {
      uris.push(trimmedPath);
      continue;
    }
    try {
      uris.push((0, import_node_url10.pathToFileURL)(trimmedPath).toString());
    } catch {
    }
  }
  const sortedUris = uris.slice().sort((a, b2) => a.localeCompare(b2));
  return sortedUris.map((uri) => createRedactedString(uri, DataClassification.PATH, "workspaceUri", PrivacyMode.UNSPECIFIED));
}
var AgentConversationTurnHandle = class extends Writeable {
  constructor(blobStore, serdes, privacyMode, turnStructure, rootPromptBuilder, blobId = void 0) {
    super();
    this.blobStore = blobStore;
    this.serdes = serdes;
    this.privacyMode = privacyMode;
    this.turnStructure = turnStructure;
    this.rootPromptBuilder = rootPromptBuilder;
    this.blobId = blobId;
    this.dirty = false;
    this.mutations = 0;
    this.userMessage = new LazyReference(serdes.userMessage, blobStore, turnStructure.userMessage);
    this.steps = turnStructure.steps.map((blobId2) => new LazyReference(serdes.conversationStep, blobStore, blobId2));
    this.sendMessageStepIndices = turnStructure.sendMessageStepIndices.filter((index) => index < this.steps.length);
    this.subagentDispatchSteps = turnStructure.subagentDispatchSteps.filter((dispatch) => dispatch.stepIndex < this.steps.length);
  }
  getInnerStructure() {
    return this.turnStructure;
  }
  hasSendMessageCall() {
    return this.sendMessageStepIndices.length > 0;
  }
  setUserMessage(userMessage2) {
    this.userMessage.set(userMessage2);
    this.markDirty();
  }
  completeOpenMessageStep(completedAtMs) {
    const open9 = this.openMessageStep;
    if (open9 === void 0) {
      return;
    }
    const message = open9.step.message;
    switch (message.case) {
      case "assistantMessage":
      case "thinkingMessage": {
        if (message.value.completedAtMs === void 0) {
          message.value.completedAtMs = completedAtMs;
          open9.reference.set(open9.step);
          this.markDirty();
        }
        break;
      }
      case "toolCall":
      case void 0:
        break;
      default: {
        const _exhaustive = message;
        throw new TypeError(`Unhandled conversation step: ${_exhaustive}`);
      }
    }
    this.openMessageStep = void 0;
  }
  trackOpenMessageStep(reference, step) {
    const message = step.message;
    if ((message.case === "assistantMessage" || message.case === "thinkingMessage") && message.value.completedAtMs === void 0) {
      this.openMessageStep = { reference, step };
    } else {
      this.openMessageStep = void 0;
    }
  }
  pushMessageStep(step) {
    const redactedStep = toRedactedConversationStep(step, this.privacyMode);
    const reference = new EagerReference(this.serdes.conversationStep, this.blobStore, redactedStep);
    this.steps.push(reference);
    this.trackOpenMessageStep(reference, redactedStep);
  }
  serialize() {
    return conversationTurnStructureSerde2.serialize(new ConversationTurnStructure({
      turn: { case: "agentConversationTurn", value: this.turnStructure }
    }));
  }
  appendPromptMessages(messages2) {
    this.rootPromptBuilder.appendMessages(messages2);
  }
  createToolCallStep(toolCall, toolCallId) {
    const toolCallWithId = toolCallId !== void 0 ? { ...toolCall, toolCallId } : toolCall;
    return {
      _privacyMode: this.privacyMode,
      message: { case: "toolCall", value: toolCallWithId }
    };
  }
  /**
   * Keep the turn's per-step dispatch records in step with the step at
   * `stepIndex`. A Task call is first recorded without its result and later
   * upserted with it, so the record at that index is replaced, not appended.
   */
  noteSubagentDispatchStep(step, stepIndex) {
    if (step.message.case !== "toolCall") {
      return;
    }
    const dispatch = subagentDispatchStepFromToolCall(step.message.value, stepIndex);
    const existingIndex = this.subagentDispatchSteps.findIndex((entry) => entry.stepIndex === stepIndex);
    if (dispatch === void 0) {
      if (existingIndex !== -1) {
        this.subagentDispatchSteps.splice(existingIndex, 1);
      }
      return;
    }
    if (existingIndex === -1) {
      this.subagentDispatchSteps.push(dispatch);
    } else {
      this.subagentDispatchSteps[existingIndex] = dispatch;
    }
  }
  recordToolCall(toolCall, toolCallId) {
    this.completeOpenMessageStep(toolCall.startedAtMs ?? BigInt(Date.now()));
    const redactedStep = this.createToolCallStep(toolCall, toolCallId);
    if (redactedStep.message.case === "toolCall" && redactedStep.message.value.tool.case === "sendMessageToolCall") {
      this.sendMessageStepIndices.push(this.steps.length);
    }
    this.noteSubagentDispatchStep(redactedStep, this.steps.length);
    this.steps.push(new EagerReference(this.serdes.conversationStep, this.blobStore, redactedStep));
    this.markDirty();
  }
  async upsertToolCall(ctx, toolCall, toolCallId) {
    this.completeOpenMessageStep(toolCall.startedAtMs ?? BigInt(Date.now()));
    const redactedStep = this.createToolCallStep(toolCall, toolCallId);
    for (let i = this.steps.length - 1; i >= 0; i--) {
      const step = await this.steps[i].get(ctx);
      if (step.message.case === "toolCall" && step.message.value.toolCallId === toolCallId) {
        this.steps[i].set(redactedStep);
        this.noteSubagentDispatchStep(redactedStep, i);
        this.markDirty();
        return;
      }
    }
    if (redactedStep.message.case === "toolCall" && redactedStep.message.value.tool.case === "sendMessageToolCall") {
      this.sendMessageStepIndices.push(this.steps.length);
    }
    this.noteSubagentDispatchStep(redactedStep, this.steps.length);
    this.steps.push(new EagerReference(this.serdes.conversationStep, this.blobStore, redactedStep));
    this.markDirty();
  }
  async recordThinking(ctx, text2, durationMs, startedAtMs, completedAtMs) {
    if (this.steps.length > 0) {
      const lastStepReference = this.steps.at(-1);
      const lastStep = await lastStepReference.get(ctx);
      if (lastStep.message.case === "thinkingMessage" && lastStep.message.value.completedAtMs === void 0 && // Append only while the block is still open. Open steps carry duration 0; a
      // seal records a positive duration (floored at 1ms in interaction-handler), so
      // a following block (e.g. an Anthropic narration block) starts its own step
      // instead of merging in, and rehydration matches the live UI split.
      !((lastStep.message.value.durationMs ?? 0) > 0)) {
        const newStep = {
          _privacyMode: this.privacyMode,
          message: {
            case: "thinkingMessage",
            value: {
              _privacyMode: this.privacyMode,
              text: lastStep.message.value.text.safeTransform((existingText) => existingText + text2),
              durationMs: durationMs ?? 0,
              startedAtMs: lastStep.message.value.startedAtMs ?? startedAtMs ?? BigInt(Date.now()),
              completedAtMs
            }
          }
        };
        lastStepReference.set(newStep);
        this.trackOpenMessageStep(lastStepReference, newStep);
      } else {
        if (text2.length === 0) {
          return;
        }
        const newStep = new ConversationStep({
          message: {
            case: "thinkingMessage",
            value: new ThinkingMessage({
              text: text2,
              durationMs,
              startedAtMs: startedAtMs ?? BigInt(Date.now()),
              completedAtMs
            })
          }
        });
        this.pushMessageStep(newStep);
      }
    } else {
      if (text2.length === 0) {
        return;
      }
      const newStep = new ConversationStep({
        message: {
          case: "thinkingMessage",
          value: new ThinkingMessage({
            text: text2,
            durationMs,
            startedAtMs: startedAtMs ?? BigInt(Date.now()),
            completedAtMs
          })
        }
      });
      this.pushMessageStep(newStep);
    }
    this.markDirty();
  }
  async recordText(ctx, text2, startedAtMs, completedAtMs) {
    if (this.steps.length > 0) {
      const lastStepReference = this.steps.at(-1);
      const lastStep = await lastStepReference.get(ctx);
      if (lastStep.message.case === "assistantMessage" && lastStep.message.value.completedAtMs === void 0) {
        const newStep = {
          _privacyMode: this.privacyMode,
          message: {
            case: "assistantMessage",
            value: {
              _privacyMode: this.privacyMode,
              text: lastStep.message.value.text.safeTransform((existingText) => existingText + text2),
              startedAtMs: lastStep.message.value.startedAtMs ?? startedAtMs ?? BigInt(Date.now()),
              completedAtMs
            }
          }
        };
        lastStepReference.set(newStep);
        this.trackOpenMessageStep(lastStepReference, newStep);
      } else {
        if (text2.length === 0) {
          return;
        }
        const newStep = new ConversationStep({
          message: {
            case: "assistantMessage",
            value: new AssistantMessage({
              text: text2,
              startedAtMs: startedAtMs ?? BigInt(Date.now()),
              completedAtMs
            })
          }
        });
        this.pushMessageStep(newStep);
      }
    } else {
      if (text2.length === 0) {
        return;
      }
      const newStep = new ConversationStep({
        message: {
          case: "assistantMessage",
          value: new AssistantMessage({
            text: text2,
            startedAtMs: startedAtMs ?? BigInt(Date.now()),
            completedAtMs
          })
        }
      });
      this.pushMessageStep(newStep);
    }
    this.markDirty();
  }
  markDirty() {
    this.dirty = true;
    this.mutations += 1;
  }
  async writeToBlobStore(ctx) {
    if (!this.dirty && this.blobId !== void 0) {
      return this.blobId;
    }
    const mutations = this.mutations;
    const steps = [...this.steps];
    const sendMessageStepIndices = [...this.sendMessageStepIndices];
    const subagentDispatchSteps = [...this.subagentDispatchSteps];
    const newUserMessageBlobId = await this.userMessage.writeToBlobStore(ctx);
    const newStepsBlobIds = await Promise.all(steps.map((step) => step.writeToBlobStore(ctx)));
    const newInnerStructure = new AgentConversationTurnStructure({
      userMessage: new Uint8Array(newUserMessageBlobId),
      steps: newStepsBlobIds,
      sendMessageStepIndices,
      subagentDispatchSteps,
      ...this.turnStructure.requestId && {
        requestId: this.turnStructure.requestId
      },
      ...this.turnStructure.encryptedModel !== void 0 && this.turnStructure.encryptedModel.length > 0 ? { encryptedModel: this.turnStructure.encryptedModel } : {},
      ...this.turnStructure.dynamicToolCount !== void 0 ? {
        dynamicToolCount: this.turnStructure.dynamicToolCount,
        dynamicToolNames: [...this.turnStructure.dynamicToolNames]
      } : {},
      ...this.turnStructure.routedModelDisplayName !== void 0 && this.turnStructure.routedModelDisplayName.length > 0 ? { routedModelDisplayName: this.turnStructure.routedModelDisplayName } : {},
      ...this.turnStructure.userMessageId !== void 0 && this.turnStructure.userMessageId.trim().length > 0 ? { userMessageId: this.turnStructure.userMessageId.trim() } : {}
    });
    const serializedWrapper = conversationTurnStructureSerde2.serialize(new ConversationTurnStructure({
      turn: { case: "agentConversationTurn", value: newInnerStructure }
    }));
    const newBlobId = await getBlobId(serializedWrapper);
    if (this.blobId !== void 0 && isEqual(this.blobId, newBlobId)) {
      if (this.mutations === mutations)
        this.dirty = false;
      return this.blobId;
    }
    getBlobMetadataCallback(this.blobStore)?.({
      blobId: newBlobId,
      blobType: {
        kind: "proto",
        typeName: "agent.v1.ConversationTurnStructure"
      }
    });
    await this.blobStore.setBlob(ctx, newBlobId, serializedWrapper);
    if (this.mutations === mutations) {
      this.turnStructure = newInnerStructure;
      this.blobId = newBlobId;
      this.dirty = false;
    }
    return newBlobId;
  }
};
function ensureUserMessageTiming(message) {
  const timestampMs2 = message.startedAtMs !== void 0 && message.startedAtMs > BigInt(0) ? message.startedAtMs : message.completedAtMs !== void 0 && message.completedAtMs > BigInt(0) ? message.completedAtMs : BigInt(Date.now());
  message.startedAtMs = timestampMs2;
  message.completedAtMs = timestampMs2;
  return timestampMs2;
}
function computeSubagentTracking(subagentStates) {
  let lastUsedSubagentId;
  let maxTimestamp = BigInt(0);
  const typeMaxTimestamps = /* @__PURE__ */ new Map();
  for (const [subagentId, state] of subagentStates) {
    const timestamp3 = state.lastUsedTimestampMs;
    const subagentType = state.subagentType;
    if (timestamp3 > maxTimestamp) {
      maxTimestamp = timestamp3;
      lastUsedSubagentId = subagentId;
    }
    if (subagentType) {
      const typeName = getSubagentTypeName(subagentType);
      const existing = typeMaxTimestamps.get(typeName);
      if (!existing || timestamp3 > existing.timestamp) {
        typeMaxTimestamps.set(typeName, { id: subagentId, timestamp: timestamp3 });
      }
    }
  }
  const lastSubagentByType = /* @__PURE__ */ new Map();
  for (const [typeName, { id }] of typeMaxTimestamps) {
    lastSubagentByType.set(typeName, id);
  }
  return { lastUsedSubagentId, lastSubagentByType };
}
var ConversationStateHandle = class _ConversationStateHandle {
  createConversationTurnHandleSerde() {
    return {
      deserialize: (blob) => {
        const outer = conversationTurnStructureSerde2.deserialize(blob);
        switch (outer.turn.case) {
          case "agentConversationTurn":
            return new AgentConversationTurnHandle(this.blobStore, this.serdes, this.privacyMode, outer.turn.value, this.rootPromptBuilder);
          case "shellConversationTurn":
            return new ShellConversationTurnHandle(this.blobStore, this.serdes, outer.turn.value);
          default:
            throw new Error("Invalid ConversationTurnStructure: missing turn case");
        }
      },
      serialize: (value) => value.serialize(),
      getBlobType: () => ({
        kind: "proto",
        typeName: "agent.v1.ConversationTurnStructure"
      })
    };
  }
  static async fromConversationStateStructure(ctx, blobStore, conversationStateStructure, rootPromptBuilder, formattingOptions, modelId, runtimeAgentType, options2) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource19(env_1, createSpan(ctx.withName("fromConversationStateStructure")), false);
      const restoreStart = performance.now();
      let getBlobCount = 0;
      const shouldTrackAgentTypeChange = options2?.shouldTrackAgentTypeChange ?? false;
      const loadRootPromptBlobs = options2?.loadRootPromptBlobs ?? true;
      const restoreBlobFetchConcurrency = options2?.restoreBlobFetchConcurrency ?? RESTORE_BLOB_FETCH_CONCURRENCY;
      const serdes = createRedactedSerdes(conversationStateStructure._privacyMode);
      let rootPromptBytes = 0;
      let rootPromptImageBytes = 0;
      let rootPromptImagePartCount = 0;
      let rootPromptMessageCount = 0;
      const rootPromptPhaseStart = performance.now();
      if (loadRootPromptBlobs) {
        const span2 = createSpan(span.ctx.withName("loadRootPromptMessages"));
        const quietCtx2 = withSuppressedChildSpans(span2.ctx);
        const rootPromptMessageLoads = await asyncMapValues(conversationStateStructure.rootPromptMessagesJson, async (blobId) => {
          const blob = await blobStore.getBlob(quietCtx2, blobId);
          getBlobCount++;
          if (!blob) {
            return { kind: "missing", blobIdHex: toHex3(blobId) };
          }
          try {
            const message = serdes.coreMessage.deserialize(blob);
            serializedMessageCache.set(message, { blobId, blobData: blob });
            const plainMessage = fromRedactedCoreMessage(message, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
            const imageStats = getCoreMessageImagePayloadStats(plainMessage);
            return {
              kind: "loaded",
              entry: {
                message,
                plainMessage,
                blobBytes: blob.byteLength,
                imageBytes: imageStats.imageBytes,
                imagePartCount: imageStats.imagePartCount
              }
            };
          } catch (error41) {
            return { kind: "failed", error: error41 };
          }
        }, { max: restoreBlobFetchConcurrency });
        const missingRootPromptBlobIdHexes = rootPromptMessageLoads.flatMap((load2) => load2.kind === "missing" ? [load2.blobIdHex] : []);
        if (missingRootPromptBlobIdHexes.length > 0) {
          span2.span.setAttribute("missingBlobCount", missingRootPromptBlobIdHexes.length);
          span2.span.end();
          throw new BlobNotFoundError(missingRootPromptBlobIdHexes);
        }
        const firstFailedLoad = rootPromptMessageLoads.find((load2) => load2.kind === "failed");
        if (firstFailedLoad !== void 0 && firstFailedLoad.kind === "failed") {
          span2.span.end();
          throw firstFailedLoad.error;
        }
        const rootPromptMessageEntries = rootPromptMessageLoads.flatMap((load2) => load2.kind === "loaded" ? [load2.entry] : []);
        const rootPromptMessages = rootPromptMessageEntries.map(({ message }) => message);
        if (options2?.onRootPromptImagePresence !== void 0) {
          const plainRootPromptMessages = rootPromptMessageEntries.map(({ plainMessage }) => plainMessage);
          options2.onRootPromptImagePresence(computeCoreMessageImagePresence(plainRootPromptMessages));
        }
        rootPromptBytes = rootPromptMessageEntries.reduce((total, entry) => total + entry.blobBytes, 0);
        rootPromptImageBytes = rootPromptMessageEntries.reduce((total, entry) => total + entry.imageBytes, 0);
        rootPromptImagePartCount = rootPromptMessageEntries.reduce((total, entry) => total + entry.imagePartCount, 0);
        rootPromptMessageCount = rootPromptMessages.length;
        for (const { message, plainMessage } of rootPromptMessageEntries) {
          coreToRedactedMap.set(plainMessage, message);
        }
        rootPromptBuilder.clearMessages();
        rootPromptBuilder.appendMessages(rootPromptMessages);
        span2.span.setAttribute("getBlobCount", getBlobCount);
        span2.span.setAttribute("rootPromptBytes", rootPromptBytes);
        span2.span.setAttribute("rootPromptImageBytes", rootPromptImageBytes);
        span2.span.setAttribute("rootPromptImagePartCount", rootPromptImagePartCount);
        span2.span.end();
        ctx.get(cloudAgentTurnPrepRootPromptRestoreRecorderKey)?.({
          messageCount: rootPromptMessageCount,
          bytes: rootPromptBytes
        });
      } else {
        rootPromptBuilder.clearMessages();
        rootPromptMessageCount = conversationStateStructure.rootPromptMessagesJson.length;
      }
      const rootPromptPhaseMs = performance.now() - rootPromptPhaseStart;
      const span3 = createSpan(span.ctx.withName("loadFileStates"));
      const quietCtx3 = withSuppressedChildSpans(span3.ctx);
      const state = new _ConversationStateHandle(blobStore, conversationStateStructure, rootPromptBuilder, formattingOptions, modelId, options2);
      const subagentPhaseStart = performance.now();
      await state.loadSubagentStateRefs(quietCtx3);
      const subagentStateRefsPhaseMs = performance.now() - subagentPhaseStart;
      state.skippedRootPromptBlobs = !loadRootPromptBlobs;
      state.originalRootPromptMessagesJson = loadRootPromptBlobs ? [] : [...conversationStateStructure.rootPromptMessagesJson];
      const persistedAgentType = state.agentType;
      if (runtimeAgentType !== void 0) {
        state.agentTypeChangedFromPersistedState = shouldTrackAgentTypeChange && persistedAgentType !== void 0 && persistedAgentType !== runtimeAgentType;
        state.agentType = runtimeAgentType;
      }
      const fileStatesV2 = conversationStateStructure.fileStatesV2;
      const fileStateEntries = Array.from(fileStatesV2.entries());
      const fileStateLoadStart = performance.now();
      for (const [pathString, fileStateStructure] of fileStateEntries) {
        const path31 = pathString.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
        const contentBlobId = fileStateStructure.content?.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
        const initialContentBlobId = fileStateStructure.initialContent?.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
        state.fileStates.set(path31, {
          content: contentBlobId !== void 0 ? new LazyReference(utf8Serde, blobStore, contentBlobId) : void 0,
          initialContent: initialContentBlobId !== void 0 ? new LazyReference(utf8Serde, blobStore, initialContentBlobId) : void 0
        });
      }
      span3.span.setAttribute("fileStatePathCount", fileStateEntries.length);
      span3.span.end();
      const fileStatesPhaseMs = performance.now() - fileStateLoadStart;
      for (const path31 of conversationStateStructure.readPaths) {
        state.recordReadPath(path31);
      }
      for (const toolCallId of conversationStateStructure.completedAskQuestionToolCallIds ?? []) {
        state.completedAskQuestionToolCallIds.add(toolCallId);
      }
      if (conversationStateStructure.plans) {
        for (const [planId, redactedEntry] of conversationStateStructure.plans) {
          state.plans.set(planId, fromRedactedPlanRegistryEntry(redactedEntry, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
        }
      }
      if (conversationStateStructure.goalState !== void 0) {
        state.goalState = fromRedactedGoalState(conversationStateStructure.goalState, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      }
      const restoreDurationMs = performance.now() - restoreStart;
      const crossedLargeThreshold = rootPromptBytes >= LARGE_RESTORE_TOTAL_BYTES || rootPromptImageBytes >= LARGE_RESTORE_IMAGE_BYTES || restoreDurationMs >= SLOW_RESTORE_DURATION_MS;
      const largeLabel = {
        crossed_large_threshold: crossedLargeThreshold ? "true" : "false"
      };
      const namedPhasesMs = rootPromptPhaseMs + fileStatesPhaseMs + subagentStateRefsPhaseMs;
      const otherPhaseMs = Math.max(0, restoreDurationMs - namedPhasesMs);
      conversationStateRestorePhaseMs.histogram(span.ctx, rootPromptPhaseMs, {
        phase: "root_prompt_messages",
        ...largeLabel
      });
      conversationStateRestorePhaseMs.histogram(span.ctx, fileStatesPhaseMs, {
        phase: "file_states",
        ...largeLabel
      });
      conversationStateRestorePhaseMs.histogram(span.ctx, subagentStateRefsPhaseMs, { phase: "subagent_state_refs", ...largeLabel });
      conversationStateRestorePhaseMs.histogram(span.ctx, otherPhaseMs, {
        phase: "other",
        ...largeLabel
      });
      conversationStateRestoreDurationMs.histogram(span.ctx, restoreDurationMs, largeLabel);
      conversationStateRestoreBlobFetchConcurrency.histogram(span.ctx, restoreBlobFetchConcurrency);
      conversationStateRestoreRootPromptMessageCount.histogram(span.ctx, rootPromptMessageCount, largeLabel);
      conversationStateRestoreTurnReferenceCount.histogram(span.ctx, conversationStateStructure.turns.length, largeLabel);
      conversationStateRestoreFileStatePathCount.histogram(span.ctx, fileStateEntries.length, largeLabel);
      conversationStateRestoreTotalBytes.histogram(span.ctx, rootPromptBytes, largeLabel);
      if (crossedLargeThreshold) {
        const mem = process.memoryUsage();
        _logger3.warn(span.ctx, "Large conversation state restore", {
          restoreDurationMs,
          rootPromptBytes,
          rootPromptImageBytes,
          rootPromptImagePartCount,
          rootPromptMessageCount,
          turnReferenceCount: conversationStateStructure.turns.length,
          fileStateCount: fileStateEntries.length,
          rss: mem.rss,
          heapUsed: mem.heapUsed,
          external: mem.external,
          arrayBuffers: mem.arrayBuffers
        });
      }
      return state;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources19(env_1);
    }
  }
  getRawPendingMessages() {
    return this.conversationStateStructure.pendingToolCalls;
  }
  getBlobStore() {
    return this.blobStore;
  }
  getProjectSendMessageToolName() {
    return this.projectSendMessageToolName;
  }
  getPrivacyMode() {
    return this.privacyMode;
  }
  assertRootPromptBlobsLoadedForFullPromptRead() {
    if (!this.skippedRootPromptBlobs) {
      return;
    }
    throw new Error("Cannot read full root prompt messages when root prompt blobs were not loaded");
  }
  invalidateRootPromptPrefix() {
    if (this.skippedRootPromptBlobs) {
      this.rootPromptPrefixInvalidated = true;
    }
  }
  constructor(blobStore, conversationStateStructure, rootPromptBuilder, formattingOptions, modelId, options2) {
    _ConversationStateHandle_instances.add(this);
    this.blobStore = blobStore;
    this.conversationStateStructure = conversationStateStructure;
    this.rootPromptBuilder = rootPromptBuilder;
    this.formattingOptions = formattingOptions;
    this.modelId = modelId;
    this.agentTypeChangedFromPersistedState = false;
    this.isRootProjectConversation = false;
    this.plans = /* @__PURE__ */ new Map();
    this.durableSkillBlocks = [];
    this.fileStates = /* @__PURE__ */ new Map();
    this.readPaths = /* @__PURE__ */ new Set();
    this.completedAskQuestionToolCallIds = /* @__PURE__ */ new Set();
    this.communicateUpdateHistory = [];
    this.communicateUpdateStatesByParentToolCallId = /* @__PURE__ */ new Map();
    this.backgroundSummarizationPromiseInfo = null;
    this.messagesUndergoingSummarization = null;
    this.backgroundSummarizationHasCompleted = false;
    this.backgroundSummarizationGenerationDurationMs = null;
    this.backgroundSummarizationCancellationToken = null;
    this.tokenDetailsStaleAfterSummarization = false;
    this.messageCountAtLastCompaction = void 0;
    this.recentUserMessageIds = [];
    this.olderAgentTurnCount = 0;
    this.summaryArchives = [];
    this.selfSummaryCount = 0;
    this.selfSummaryInputLimitFailureTokenCount = 0;
    this.trackedGitRepoBranches = [];
    this.subagentStates = /* @__PURE__ */ new Map();
    this.subagentRunsByParentToolCallId = /* @__PURE__ */ new Map();
    this.subagentThreads = /* @__PURE__ */ new Map();
    this.lastSubagentByType = /* @__PURE__ */ new Map();
    this.turnUsage = {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      reasoningTokens: 0
    };
    this.pendingComputeStructure = null;
    this.skippedRootPromptBlobs = false;
    this.originalRootPromptMessagesJson = [];
    this.rootPromptPrefixInvalidated = false;
    this.privacyMode = this.conversationStateStructure._privacyMode;
    this.serdes = createRedactedSerdes(this.privacyMode);
    this.serializeSubagentStatesAsBlobRefs = options2?.serializeSubagentStatesAsBlobRefs === true;
    this.restoreBlobFetchConcurrency = options2?.restoreBlobFetchConcurrency ?? RESTORE_BLOB_FETCH_CONCURRENCY;
    this.previousWorkspaceUris = this.conversationStateStructure.previousWorkspaceUris.length > 0 ? [...this.conversationStateStructure.previousWorkspaceUris] : void 0;
    this.trackedGitRepoBranches = (this.conversationStateStructure.trackedGitRepoBranches ?? []).map((repo) => ({
      repoPath: repo.repoPath.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
      branchName: repo.branchName
    }));
    this.mode = this.conversationStateStructure.mode;
    this.agentType = parseAgentType(this.conversationStateStructure.agentType);
    this.activeBranchName = this.conversationStateStructure.activeBranchName;
    this.isRootProjectConversation = this.conversationStateStructure.isRootProjectConversation === true;
    const restoredDurableSkillBlocks = this.conversationStateStructure.durableSkillBlocks.map((block) => block.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)).filter((block) => block.length > 0);
    this.durableSkillBlocks = restoredDurableSkillBlocks;
    this.durableCustomModeId = this.conversationStateStructure.durableCustomModeId?.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    this.conversationStartedTimestampMs = this.conversationStateStructure.conversationStartedTimestampMs;
    this.conversationStartedTimeZone = this.conversationStateStructure.conversationStartedTimeZone;
    const conversationTurnHandleSerde = this.createConversationTurnHandleSerde();
    this.turns = this.conversationStateStructure.turns.map((blobId) => new LazyReference(conversationTurnHandleSerde, this.blobStore, blobId));
    this.todos = this.conversationStateStructure.todos.map((blobId) => new LazyReference(this.serdes.todoItem, this.blobStore, blobId));
    this.tokenDetails = this.conversationStateStructure.tokenDetails ?? createRedactedConversationTokenDetails(this.conversationStateStructure._privacyMode, {});
    if (this.conversationStateStructure.summary) {
      this.summary = new LazyReference(this.serdes.conversationSummary, this.blobStore, this.conversationStateStructure.summary);
    }
    if (this.conversationStateStructure.plan) {
      this.plan = new LazyReference(this.serdes.conversationPlan, this.blobStore, this.conversationStateStructure.plan);
    }
    if (this.conversationStateStructure.summaryArchives) {
      this.summaryArchives = this.conversationStateStructure.summaryArchives.map((blobId) => new LazyReference(this.serdes.conversationSummaryArchive, this.blobStore, blobId));
    }
    this.selfSummaryCount = this.conversationStateStructure.selfSummaryCount ?? 0;
    this.messageCountAtLastCompaction = this.conversationStateStructure.messageCountAtLastCompaction;
    this.recentUserMessageIds = [
      ...this.conversationStateStructure.recentUserMessageIds ?? []
    ];
    this.olderAgentTurnCount = this.conversationStateStructure.recentUserMessageIdsOlderTurnCount ?? this.turns.length;
    if (this.conversationStateStructure.subagentStates) {
      for (const [subagentId, redactedState] of this.conversationStateStructure.subagentStates) {
        this.subagentStates.set(subagentId, fromRedactedSubagentPersistedState(redactedState, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
      }
    }
    if (this.conversationStateStructure.subagentRunsByParentToolCallId) {
      for (const [parentToolCallId, redactedState] of this.conversationStateStructure.subagentRunsByParentToolCallId) {
        this.subagentRunsByParentToolCallId.set(parentToolCallId, fromRedactedSubagentRunState(redactedState, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
      }
    }
    const persistedSubagentThreads = this.conversationStateStructure.subagentThreads;
    if (persistedSubagentThreads instanceof Map) {
      for (const [subagentId, threadId] of persistedSubagentThreads) {
        const normalizedThreadId = normalizeNonEmptyString2(threadId);
        if (normalizedThreadId !== void 0) {
          this.subagentThreads.set(subagentId, normalizedThreadId);
        }
      }
    } else if (persistedSubagentThreads !== void 0) {
      for (const [subagentId, threadId] of Object.entries(persistedSubagentThreads)) {
        const normalizedThreadId = normalizeNonEmptyString2(threadId);
        if (normalizedThreadId !== void 0) {
          this.subagentThreads.set(subagentId, normalizedThreadId);
        }
      }
    }
    const legacyCommunicateUpdateHistory = (this.conversationStateStructure.communicateUpdateHistory ?? []).map((entry) => new CommunicateUpdateHistoryEntry({
      step: entry.step.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
      messageIndex: entry.messageIndex
    }));
    const legacyCommunicateUpdateFinalSummary = this.conversationStateStructure.communicateUpdateFinalSummary?.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    const legacyCommunicateUpdateCompletedSubtitle = this.conversationStateStructure.communicateUpdateCompletedSubtitle?.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
    this.communicateUpdateHistory = legacyCommunicateUpdateHistory;
    this.communicateUpdateFinalSummary = legacyCommunicateUpdateFinalSummary;
    this.communicateUpdateCompletedSubtitle = legacyCommunicateUpdateCompletedSubtitle;
    const persistedCommunicateUpdateStatesByParentToolCallId = this.conversationStateStructure.communicateUpdateStatesByParentToolCallId;
    if (persistedCommunicateUpdateStatesByParentToolCallId instanceof Map) {
      for (const [parentToolCallId, state] of persistedCommunicateUpdateStatesByParentToolCallId) {
        this.communicateUpdateStatesByParentToolCallId.set(parentToolCallId, new CommunicateUpdateTurnState({
          ...toCommunicateUpdateTurnState(state)
        }));
      }
    } else if (persistedCommunicateUpdateStatesByParentToolCallId !== void 0) {
      for (const [parentToolCallId, state] of Object.entries(persistedCommunicateUpdateStatesByParentToolCallId)) {
        this.communicateUpdateStatesByParentToolCallId.set(parentToolCallId, new CommunicateUpdateTurnState({
          ...toCommunicateUpdateTurnState(state)
        }));
      }
    }
    this.computeSubagentTrackingFromTimestamps();
  }
  /**
   * Compute lastSubagentByType and lastUsedSubagentId from subagentStates timestamps.
   * Called at initialization and whenever subagent states change.
   */
  computeSubagentTrackingFromTimestamps() {
    const result = computeSubagentTracking(this.subagentStates);
    this.lastUsedSubagentId = result.lastUsedSubagentId;
    this.lastSubagentByType = result.lastSubagentByType;
  }
  /**
   * Load subagent states persisted as content-addressed blob references and
   * merge them into the in-memory map. Inline subagent_states were already
   * loaded by the constructor; a blob reference wins when a subagent ID
   * appears in both forms. Pre-populates serializedSubagentStateCache so the
   * next computeNewStructure skips re-uploading unchanged subagent states.
   */
  async loadSubagentStateRefs(ctx) {
    const subagentStateRefs = this.conversationStateStructure.subagentStateRefs;
    if (subagentStateRefs === void 0 || subagentStateRefs.size === 0) {
      return;
    }
    const loadedEntries = await asyncMapValues(Array.from(subagentStateRefs.entries()), async ([subagentId, blobId]) => {
      const blob = await this.blobStore.getBlob(ctx, blobId);
      if (!blob) {
        if (!this.subagentStates.has(subagentId)) {
          return { kind: "missing", blobIdHex: toHex3(blobId) };
        }
        _logger3.warn(ctx, "Subagent state ref blob not found; falling back to inline entry", { subagentId });
        return { kind: "fallback" };
      }
      try {
        const redactedState = this.serdes.subagentPersistedState.deserialize(blob);
        const state = fromRedactedSubagentPersistedState(redactedState, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
        return { kind: "loaded", subagentId, state, blobId, blobData: blob };
      } catch (error41) {
        return { kind: "failed", error: error41 };
      }
    }, { max: this.restoreBlobFetchConcurrency });
    const missingBlobIdHexes = loadedEntries.flatMap((entry) => entry.kind === "missing" ? [entry.blobIdHex] : []);
    if (missingBlobIdHexes.length > 0) {
      throw new BlobNotFoundError(missingBlobIdHexes);
    }
    const firstFailedLoad = loadedEntries.find((entry) => entry.kind === "failed");
    if (firstFailedLoad !== void 0 && firstFailedLoad.kind === "failed") {
      throw firstFailedLoad.error;
    }
    for (const entry of loadedEntries) {
      if (entry.kind === "loaded") {
        serializedSubagentStateCache.set(entry.state, {
          blobId: entry.blobId,
          blobData: entry.blobData
        });
        this.subagentStates.set(entry.subagentId, entry.state);
      }
    }
    this.computeSubagentTrackingFromTimestamps();
  }
  isDsv3() {
    return isCursorBigModel(this.modelId);
  }
  getOrInitializeConversationStartedDate(timeZone, mockNow) {
    if (this.conversationStartedTimestampMs !== void 0) {
      if (this.conversationStartedTimeZone === void 0) {
        throw new Error("conversationStartedTimestampMs was set without conversationStartedTimeZone");
      }
      return buildDateStringForTimestampMs(this.conversationStartedTimestampMs, this.conversationStartedTimeZone);
    }
    if (this.conversationStartedTimeZone !== void 0) {
      throw new Error("conversationStartedTimeZone was set without conversationStartedTimestampMs");
    }
    const conversationStartedTimestampMs = BigInt(mockNow?.getTime() ?? Date.now());
    const conversationStartedTimeZone = resolveConversationStartTimeZone(timeZone);
    const conversationStartedDate = buildDateStringForTimestampMs(conversationStartedTimestampMs, conversationStartedTimeZone);
    this.conversationStartedTimestampMs = conversationStartedTimestampMs;
    this.conversationStartedTimeZone = conversationStartedTimeZone;
    return conversationStartedDate;
  }
  setTodos(todos) {
    this.todos.length = 0;
    this.todos.push(...todos.map((todo) => new EagerReference(this.serdes.todoItem, this.blobStore, todo)));
  }
  setSummary(summary) {
    this.summary = new EagerReference(this.serdes.conversationSummary, this.blobStore, summary);
  }
  pushSummaryArchive(summaryArchive) {
    this.summaryArchives.push(new EagerReference(this.serdes.conversationSummaryArchive, this.blobStore, summaryArchive));
  }
  /** Increment the self-summary count after a successful self-summary */
  incrementSelfSummaryCount() {
    this.selfSummaryCount++;
    this.clearSelfSummaryInputLimitFailureTokenCount();
  }
  /** Reset the self-summary count to 0 (called when a new user query comes in) */
  resetSelfSummaryCount() {
    this.selfSummaryCount = 0;
  }
  setSelfSummaryInputLimitFailureTokenCount(tokens) {
    this.selfSummaryInputLimitFailureTokenCount = tokens;
  }
  clearSelfSummaryInputLimitFailureTokenCount() {
    this.selfSummaryInputLimitFailureTokenCount = 0;
  }
  shouldSuppressSelfSummaryAfterInputLimitFailure(usedTokens) {
    return this.selfSummaryInputLimitFailureTokenCount !== 0 && usedTokens >= this.selfSummaryInputLimitFailureTokenCount;
  }
  setPlan(plan) {
    this.plan = plan ? new EagerReference(this.serdes.conversationPlan, this.blobStore, plan) : void 0;
  }
  async getPlan(ctx) {
    if (!this.plan) {
      return void 0;
    }
    return await this.plan.get(ctx);
  }
  upsertPlanEntry(entry) {
    this.plans.set(entry.id, entry);
  }
  setGoalState(goalState) {
    this.goalState = goalState;
  }
  recordFileState(path31, content, prevContent, skipReprioritization) {
    recordFileStateInMap(this.fileStates, this.blobStore, path31, content, prevContent, skipReprioritization);
  }
  async getFileState(ctx, path31) {
    const contentRef = this.fileStates.get(path31)?.content;
    if (contentRef === void 0) {
      return void 0;
    }
    return contentRef.get(ctx);
  }
  async hydrateUserMessageBlobText(ctx, userMessage2) {
    const [textBytes, richTextBytes] = await Promise.all([
      userMessage2.text.length === 0 && userMessage2.textBlobId !== void 0 && userMessage2.textBlobId.length > 0 ? this.blobStore.getBlob(ctx, userMessage2.textBlobId) : Promise.resolve(void 0),
      (userMessage2.richText === void 0 || userMessage2.richText.length === 0) && userMessage2.richTextBlobId !== void 0 && userMessage2.richTextBlobId.length > 0 ? this.blobStore.getBlob(ctx, userMessage2.richTextBlobId) : Promise.resolve(void 0)
    ]);
    if (textBytes !== void 0) {
      userMessage2.text = textDecoder2.decode(textBytes);
    } else if (userMessage2.text.length === 0 && userMessage2.textBlobId !== void 0 && userMessage2.textBlobId.length > 0) {
      _logger3.warn(ctx, "Failed to hydrate user message text blob", {
        textBlobIdLength: userMessage2.textBlobId.length
      });
    }
    if (richTextBytes !== void 0) {
      userMessage2.richText = textDecoder2.decode(richTextBytes);
    } else if ((userMessage2.richText === void 0 || userMessage2.richText.length === 0) && userMessage2.richTextBlobId !== void 0 && userMessage2.richTextBlobId.length > 0) {
      _logger3.warn(ctx, "Failed to hydrate user message rich text blob", {
        richTextBlobIdLength: userMessage2.richTextBlobId.length
      });
    }
  }
  /**
   * Get the text of the most recent non-simulated user message.
   * Used for $PROMPT reference resolution in meta-parent agents.
   */
  async getLastUserPromptText(ctx) {
    for (let i = this.turns.length - 1; i >= 0; i--) {
      const turn = await this.turns[i].get(ctx);
      if (turn instanceof AgentConversationTurnHandle) {
        const userMessage2 = await turn.userMessage.get(ctx);
        if (userMessage2.isSimulatedMsg !== true) {
          return userMessage2.text.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
        }
      }
    }
    return void 0;
  }
  async findUserTurnMessageIds(ctx, args) {
    const found = /* @__PURE__ */ new Set();
    if (args.messageIds.size === 0) {
      return found;
    }
    const fromIndex = resolveUserTurnMessageIdsFromIndex(this.recentUserMessageIds, {
      ...args,
      olderTurnCount: this.olderAgentTurnCount
    });
    if (fromIndex !== void 0) {
      return fromIndex;
    }
    for (let i = this.turns.length - 1; i >= 0; i--) {
      const turn = await this.turns[i].get(ctx);
      if (!(turn instanceof AgentConversationTurnHandle)) {
        continue;
      }
      let messageId = turn.getInnerStructure().userMessageId?.trim() ?? "";
      if (messageId.length === 0) {
        messageId = (await turn.userMessage.get(ctx)).messageId;
      }
      if (messageId.length === 0) {
        continue;
      }
      if (args.messageIds.has(messageId)) {
        found.add(messageId);
        if (found.size === args.messageIds.size) {
          break;
        }
      }
      if (messageId === args.stopAtMessageId) {
        break;
      }
    }
    return found;
  }
  async getUserPromptTextsByReferenceId(ctx) {
    const promptTextsByReferenceId = /* @__PURE__ */ new Map();
    for (const turnRef of this.turns) {
      const turn = await turnRef.get(ctx);
      if (!(turn instanceof AgentConversationTurnHandle)) {
        continue;
      }
      const userMessage2 = await turn.userMessage.get(ctx);
      if (userMessage2.isSimulatedMsg === true) {
        continue;
      }
      const promptReferenceId = userMessage2.promptReferenceId;
      if (promptReferenceId === void 0 || promptReferenceId.length === 0 || promptTextsByReferenceId.has(promptReferenceId)) {
        continue;
      }
      promptTextsByReferenceId.set(promptReferenceId, userMessage2.text.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
    }
    return promptTextsByReferenceId;
  }
  async resolvePromptReferenceUserMessageMatches(ctx, promptReferenceIds) {
    const requestedPromptReferenceIds = new Set(promptReferenceIds.filter((id) => id.length > 0));
    if (requestedPromptReferenceIds.size === 0) {
      return [];
    }
    const seenPromptReferenceIds = /* @__PURE__ */ new Set();
    const matches = [];
    for (let i = 0; i < this.turns.length; i++) {
      const turn = await this.turns[i].get(ctx);
      if (!(turn instanceof AgentConversationTurnHandle)) {
        continue;
      }
      const userMessage2 = await turn.userMessage.get(ctx);
      if (userMessage2.isSimulatedMsg === true) {
        continue;
      }
      const promptReferenceId = userMessage2.promptReferenceId;
      if (promptReferenceId === void 0 || promptReferenceId.length === 0 || !requestedPromptReferenceIds.has(promptReferenceId) || seenPromptReferenceIds.has(promptReferenceId)) {
        continue;
      }
      matches.push({
        promptReferenceId,
        messageId: userMessage2.messageId,
        threadId: resolveUserMessageThreadId(userMessage2) ?? promptReferenceId,
        turnIndex: i
      });
      seenPromptReferenceIds.add(promptReferenceId);
      if (seenPromptReferenceIds.size >= requestedPromptReferenceIds.size) {
        break;
      }
    }
    return matches;
  }
  async reassignThreadIds(ctx, sourceThreadIds, targetThreadId) {
    if (sourceThreadIds.size === 0 || targetThreadId.length === 0) {
      return;
    }
    for (const turnRef of this.turns) {
      const turn = await turnRef.get(ctx);
      if (!(turn instanceof AgentConversationTurnHandle)) {
        continue;
      }
      const userMessage2 = await turn.userMessage.get(ctx);
      const currentThreadId = getExplicitUserMessageThreadId(userMessage2);
      if (currentThreadId !== void 0 && sourceThreadIds.has(currentThreadId) && currentThreadId !== targetThreadId) {
        turn.setUserMessage(withUserMessageThreadId(userMessage2, targetThreadId));
      }
    }
    for (const [subagentId, threadId] of this.subagentThreads) {
      if (sourceThreadIds.has(threadId) && threadId !== targetThreadId) {
        this.subagentThreads.set(subagentId, targetThreadId);
      }
    }
  }
  async assignPromptReferenceMatchesToThread(ctx, matches, threadId) {
    for (const match2 of matches) {
      const turnRef = this.turns[match2.turnIndex];
      if (turnRef === void 0) {
        continue;
      }
      const turn = await turnRef.get(ctx);
      if (!(turn instanceof AgentConversationTurnHandle)) {
        continue;
      }
      const userMessage2 = await turn.userMessage.get(ctx);
      if (getExplicitUserMessageThreadId(userMessage2) === threadId) {
        continue;
      }
      turn.setUserMessage(withUserMessageThreadId(userMessage2, threadId));
    }
  }
  async getEarliestTurnIndexByThreadId(ctx, candidateThreadIds) {
    const earliestTurnIndexByThreadId = /* @__PURE__ */ new Map();
    if (candidateThreadIds.size === 0) {
      return earliestTurnIndexByThreadId;
    }
    for (let i = 0; i < this.turns.length; i++) {
      const turn = await this.turns[i].get(ctx);
      if (!(turn instanceof AgentConversationTurnHandle)) {
        continue;
      }
      const userMessage2 = await turn.userMessage.get(ctx);
      const threadId = resolveUserMessageThreadId(userMessage2);
      if (threadId === void 0 || !candidateThreadIds.has(threadId) || earliestTurnIndexByThreadId.has(threadId)) {
        continue;
      }
      earliestTurnIndexByThreadId.set(threadId, i);
      if (earliestTurnIndexByThreadId.size >= candidateThreadIds.size) {
        break;
      }
    }
    return earliestTurnIndexByThreadId;
  }
  async resolveCanonicalThreadIdForPromptReferenceMatches(ctx, matches, additionalThreadIds = []) {
    const orderedThreadIds = [];
    const addThreadId = (candidate) => {
      const threadId = normalizeNonEmptyString2(candidate);
      if (threadId === void 0 || orderedThreadIds.includes(threadId)) {
        return;
      }
      orderedThreadIds.push(threadId);
    };
    for (const threadId of additionalThreadIds) {
      addThreadId(threadId);
    }
    for (const match2 of matches) {
      addThreadId(match2.threadId);
    }
    if (orderedThreadIds.length === 0) {
      return void 0;
    }
    const earliestTurnIndexByThreadId = await this.getEarliestTurnIndexByThreadId(ctx, new Set(orderedThreadIds));
    let canonicalThreadId = orderedThreadIds[0];
    let canonicalTurnIndex = earliestTurnIndexByThreadId.get(canonicalThreadId) ?? Infinity;
    for (const threadId of orderedThreadIds.slice(1)) {
      const turnIndex = earliestTurnIndexByThreadId.get(threadId) ?? Infinity;
      if (turnIndex < canonicalTurnIndex || turnIndex === canonicalTurnIndex && threadId < canonicalThreadId) {
        canonicalThreadId = threadId;
        canonicalTurnIndex = turnIndex;
      }
    }
    return canonicalThreadId;
  }
  async canonicalizePromptReferenceMatchThreads(args) {
    const { ctx, matches, canonicalThreadId, additionalThreadIds = [] } = args;
    const normalizedCanonicalThreadId = normalizeNonEmptyString2(canonicalThreadId);
    if (normalizedCanonicalThreadId === void 0) {
      return;
    }
    const sourceThreadIds = /* @__PURE__ */ new Set();
    for (const threadId of additionalThreadIds) {
      const normalizedThreadId = normalizeNonEmptyString2(threadId);
      if (normalizedThreadId !== void 0 && normalizedThreadId !== normalizedCanonicalThreadId) {
        sourceThreadIds.add(normalizedThreadId);
      }
    }
    for (const match2 of matches) {
      if (match2.threadId !== normalizedCanonicalThreadId) {
        sourceThreadIds.add(match2.threadId);
      }
    }
    await this.reassignThreadIds(ctx, sourceThreadIds, normalizedCanonicalThreadId);
    await this.assignPromptReferenceMatchesToThread(ctx, matches, normalizedCanonicalThreadId);
  }
  getSubagentThreadId(subagentId) {
    const threadId = this.subagentThreads.get(subagentId);
    if (threadId === void 0 || threadId.length === 0) {
      return void 0;
    }
    return threadId;
  }
  setSubagentThreadId(subagentId, threadId) {
    if (subagentId.length === 0) {
      return;
    }
    if (threadId === void 0 || threadId.length === 0) {
      this.subagentThreads.delete(subagentId);
      return;
    }
    this.subagentThreads.set(subagentId, threadId);
  }
  /**
   * Records that a file path was read during this conversation.
   * Used to track which files the agent has accessed.
   */
  recordReadPath(path31) {
    this.readPaths.add(path31.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
  }
  /**
   * Checks if a file path has been read during this conversation.
   * NOTE: the read may have been removed by summarization, and only part of the file may have been read.
   * This is useful for detecting the agent doing completely "blind" operations, like using an MCP without
   * reading its definition, or editing a file without reading it first.
   */
  hasReadPath(path31) {
    return this.readPaths.has(path31.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
  }
  /**
   * Whether an ask_question result for this ORIGINAL tool-call id has already
   * been applied to the conversation through either answer-ingestion path
   * (blocking query response or async completion action).
   */
  hasCompletedAskQuestion(originalToolCallId) {
    return this.completedAskQuestionToolCallIds.has(originalToolCallId);
  }
  /**
   * Marks an ask_question ORIGINAL tool-call id as applied. Must be called in
   * the same mutation batch as the recording it accompanies, so the id and the
   * recorded result persist in the same checkpoint.
   */
  markAskQuestionCompleted(originalToolCallId) {
    this.completedAskQuestionToolCallIds.add(originalToolCallId);
  }
  /**
   * Bound the async-AskQuestion dedupe set to the replay horizon: keep only
   * receipts whose original tool-call id is still referenced by the retained
   * conversation window. Ids whose AskQuestion has been compacted past the
   * horizon can no longer receive a deliverable duplicate, so their receipt is
   * dead weight on the checkpoint hot path.
   */
  retainCompletedAskQuestionReceipts(liveOriginalIds) {
    for (const id of this.completedAskQuestionToolCallIds) {
      if (!liveOriginalIds.has(id)) {
        this.completedAskQuestionToolCallIds.delete(id);
      }
    }
  }
  appendCommunicateUpdateHistoryEntry(entry) {
    const historyEntry = new CommunicateUpdateHistoryEntry({
      step: entry.step,
      messageIndex: entry.messageIndex
    });
    const parentToolCallId = normalizeNonEmptyString2(entry.parentToolCallId);
    if (parentToolCallId !== void 0) {
      const existingState = this.communicateUpdateStatesByParentToolCallId.get(parentToolCallId);
      const nextHistory = [...existingState?.history ?? [], historyEntry];
      this.communicateUpdateStatesByParentToolCallId.set(parentToolCallId, new CommunicateUpdateTurnState({
        history: nextHistory,
        finalSummary: entry.finalSummary ?? existingState?.finalSummary ?? void 0,
        completedSubtitle: entry.completedSubtitle ?? existingState?.completedSubtitle ?? void 0
      }));
      return;
    }
    this.communicateUpdateHistory.push(historyEntry);
    if (entry.finalSummary !== void 0) {
      this.communicateUpdateFinalSummary = entry.finalSummary;
    }
    if (entry.completedSubtitle !== void 0) {
      this.communicateUpdateCompletedSubtitle = entry.completedSubtitle;
    }
  }
  getNextMessageIndex() {
    const loadedMessageCount = this.rootPromptBuilder.getState().length;
    if (this.skippedRootPromptBlobs) {
      return this.originalRootPromptMessagesJson.length + loadedMessageCount;
    }
    if (loadedMessageCount > 0) {
      return loadedMessageCount;
    }
    return this.conversationStateStructure.rootPromptMessagesJson.length;
  }
  generateModeChangeContent(config2, requestContext, previousMode) {
    const currentMode = this.mode;
    if (currentMode === void 0) {
      return "";
    }
    return processModeSystemReminder(currentMode, config2, requestContext, previousMode);
  }
  serialize() {
    return conversationStateStructureSerde.serialize(fromRedactedConversationStateStructure(this.conversationStateStructure, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
  }
  async clearTurns() {
    this.turns.length = 0;
    this.recentUserMessageIds.length = 0;
    this.olderAgentTurnCount = 0;
  }
  async computeNewStructure(parentCtx) {
    const previousPending = this.pendingComputeStructure;
    const computation = (async () => {
      if (previousPending) {
        await previousPending.catch(() => {
        });
      }
      return this.doComputeNewStructure(parentCtx);
    })();
    this.pendingComputeStructure = computation;
    return computation;
  }
  async doComputeNewStructure(parentCtx) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource19(env_2, createSpan(parentCtx.withName("computeNewStructure")), false);
      const ctx = span.ctx;
      const quietCtx = withSuppressedChildSpans(ctx);
      const serializeStart = performance.now();
      let setBlobCount = 0;
      const serializeRootPromptMessages = async (messages2) => {
        const blobIds = await Promise.all(messages2.map(async (message) => {
          const cached2 = serializedMessageCache.get(message);
          if (cached2 !== void 0) {
            if (!isBlobDurable(this.blobStore, cached2.blobId)) {
              await this.blobStore.setBlob(quietCtx, cached2.blobId, cached2.blobData);
            }
            return cached2.blobId;
          }
          let serializedMessage;
          {
            const startEpochMs = Date.now();
            const start = performance.now();
            serializedMessage = this.serdes.coreMessage.serialize(message);
            const duration3 = performance.now() - start;
            if (duration3 > SERIALIZE_MESSAGE_SLOW_THRESHOLD_MS) {
              recordCompletedSpanIfParented(ctx.withName("serializeMessage.slow"), {
                startTime: startEpochMs,
                attributes: {
                  serializedMessageLength: serializedMessage.length,
                  durationMs: duration3,
                  slowThresholdMs: SERIALIZE_MESSAGE_SLOW_THRESHOLD_MS
                }
              }, startEpochMs + duration3);
            }
            if (duration3 > 1e4) {
              _logger3.warn(ctx, `Serializing message took more than 10 seconds`, {
                serializedMessageLength: serializedMessage.length,
                serializationDuration: duration3
              });
            }
          }
          const blobId = await getBlobId(serializedMessage);
          setBlobCount++;
          getBlobMetadataCallback(this.blobStore)?.({
            blobId,
            blobType: { kind: "json" }
          });
          await this.blobStore.setBlob(quietCtx, blobId, serializedMessage);
          serializedMessageCache.set(message, {
            blobId,
            blobData: serializedMessage
          });
          return blobId;
        }));
        return blobIds;
      };
      const rootPromptMessages = this.rootPromptBuilder.getState();
      span.span.setAttribute("rootPromptBlobMode", this.skippedRootPromptBlobs ? "skipped" : "loaded");
      const newRootPromptMessagesJsonPromise = (async () => {
        if (!this.skippedRootPromptBlobs) {
          conversationStateComputeRootPromptMode.increment(ctx, 1, {
            mode: "full"
          });
          return serializeRootPromptMessages(rootPromptMessages);
        }
        if (this.rootPromptPrefixInvalidated) {
          conversationStateComputeRootPromptMode.increment(ctx, 1, {
            mode: "invalidated"
          });
          throw new Error("Cannot compute root prompt pass-through after root prompt prefix was invalidated");
        }
        conversationStateComputeRootPromptMode.increment(ctx, 1, {
          mode: "passthrough"
        });
        const appendedRootPromptMessagesJson = await serializeRootPromptMessages(rootPromptMessages);
        return [
          ...this.originalRootPromptMessagesJson,
          ...appendedRootPromptMessagesJson
        ];
      })();
      const newTurnsPromise = Promise.all(this.turns.map((ref) => {
        setBlobCount++;
        return ref.writeToBlobStore(quietCtx);
      }));
      const newTodosPromise = Promise.all(this.todos.map((ref) => {
        setBlobCount++;
        return ref.writeToBlobStore(quietCtx);
      }));
      let newSummaryPromise;
      if (this.summary) {
        setBlobCount++;
        newSummaryPromise = this.summary.writeToBlobStore(quietCtx);
      }
      let newSummaryArchivesPromise;
      if (this.summaryArchives.length > 0) {
        newSummaryArchivesPromise = Promise.all(this.summaryArchives.map((ref) => {
          setBlobCount++;
          return ref.writeToBlobStore(quietCtx);
        }));
      }
      let newPlanPromise;
      if (this.plan) {
        setBlobCount++;
        newPlanPromise = this.plan.writeToBlobStore(quietCtx);
      }
      const fileStatesEntriesPromise = Promise.all(Array.from(this.fileStates.entries()).map(async ([path31, fileState]) => {
        let contentBlobIdPromise = Promise.resolve(void 0);
        if (fileState.content !== void 0) {
          setBlobCount++;
          contentBlobIdPromise = fileState.content.writeToBlobStore(quietCtx);
        }
        let initialContentBlobIdPromise = Promise.resolve(void 0);
        if (fileState.initialContent !== void 0) {
          setBlobCount++;
          initialContentBlobIdPromise = fileState.initialContent.writeToBlobStore(quietCtx);
        }
        const [contentBlobId, initialContentBlobId] = await Promise.all([
          contentBlobIdPromise,
          initialContentBlobIdPromise
        ]);
        const fileStateStructure = new FileStateStructure({
          content: contentBlobId,
          initialContent: initialContentBlobId
        });
        return [path31, fileStateStructure];
      }));
      const subagentStatesObj = {};
      const subagentStateRefsObj = {};
      let subagentStateRefsPromise;
      if (this.serializeSubagentStatesAsBlobRefs) {
        subagentStateRefsPromise = Promise.all(Array.from(this.subagentStates.entries()).map(async ([subagentId, state]) => {
          const cached2 = serializedSubagentStateCache.get(state);
          if (cached2 !== void 0) {
            if (!isBlobDurable(this.blobStore, cached2.blobId)) {
              await this.blobStore.setBlob(quietCtx, cached2.blobId, cached2.blobData);
            }
            subagentStateRefsObj[subagentId] = cached2.blobId;
            return;
          }
          const serialized = this.serdes.subagentPersistedState.serialize(toRedactedSubagentPersistedState(state, this.privacyMode));
          const blobId = await getBlobId(serialized);
          setBlobCount++;
          getBlobMetadataCallback(this.blobStore)?.({
            blobId,
            blobType: {
              kind: "proto",
              typeName: "agent.v1.SubagentPersistedState"
            }
          });
          await this.blobStore.setBlob(quietCtx, blobId, serialized);
          serializedSubagentStateCache.set(state, {
            blobId,
            blobData: serialized
          });
          subagentStateRefsObj[subagentId] = blobId;
        })).then(() => {
        });
      } else {
        for (const [subagentId, state] of this.subagentStates) {
          subagentStatesObj[subagentId] = state;
        }
      }
      const subagentRunsByParentToolCallIdObj = {};
      for (const [parentToolCallId, state] of this.subagentRunsByParentToolCallId) {
        subagentRunsByParentToolCallIdObj[parentToolCallId] = state;
      }
      const subagentThreadsObj = {};
      for (const [subagentId, threadId] of this.subagentThreads) {
        subagentThreadsObj[subagentId] = threadId;
      }
      const communicateUpdateStatesByParentToolCallIdObj = {};
      for (const [parentToolCallId, state] of this.communicateUpdateStatesByParentToolCallId) {
        communicateUpdateStatesByParentToolCallIdObj[parentToolCallId] = new CommunicateUpdateTurnState({
          ...toCommunicateUpdateTurnState(state)
        });
      }
      const plansObj = {};
      for (const [planId, entry] of this.plans) {
        plansObj[planId] = {
          id: entry.id,
          path: entry.path
        };
      }
      await subagentStateRefsPromise;
      const rootPromptMessagesJson = await newRootPromptMessagesJsonPromise;
      const promptContextUsageSnapshotBlobId = await persistPromptContextUsageSnapshot({
        ctx: quietCtx,
        blobStore: this.blobStore,
        privacyMode: this.privacyMode,
        usageTree: this.tokenDetails.promptContextUsageTree,
        rootPromptMessagesJson
      });
      const tokenDetails = fromRedactedConversationTokenDetails(this.tokenDetails, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      tokenDetails.promptContextUsageSnapshotBlobId = promptContextUsageSnapshotBlobId;
      const conversationStateInit = {
        rootPromptMessagesJson,
        turns: await newTurnsPromise,
        todos: await newTodosPromise,
        tokenDetails,
        summary: await newSummaryPromise,
        plan: await newPlanPromise,
        summaryArchives: await newSummaryArchivesPromise,
        previousWorkspaceUris: this.previousWorkspaceUris?.map((uri) => uri.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)) ?? [],
        trackedGitRepoBranches: this.trackedGitRepoBranches.map((repo) => ({
          repoPath: repo.repoPath,
          branchName: repo.branchName
        })),
        mode: this.mode,
        agentType: this.agentType,
        activeBranchName: this.activeBranchName,
        // Only persisted when true so non-Project conversations keep their
        // serialized bytes unchanged; restore treats absent as false.
        isRootProjectConversation: this.isRootProjectConversation || void 0,
        durableSkillBlocks: this.durableSkillBlocks,
        durableCustomModeId: this.durableCustomModeId,
        conversationStartedTimestampMs: this.conversationStartedTimestampMs,
        conversationStartedTimeZone: this.conversationStartedTimeZone,
        fileStatesV2: Object.fromEntries(await fileStatesEntriesPromise),
        subagentStates: subagentStatesObj,
        subagentStateRefs: subagentStateRefsObj,
        subagentRunsByParentToolCallId: subagentRunsByParentToolCallIdObj,
        subagentThreads: subagentThreadsObj,
        selfSummaryCount: this.selfSummaryCount,
        messageCountAtLastCompaction: this.messageCountAtLastCompaction,
        recentUserMessageIds: [...this.recentUserMessageIds],
        recentUserMessageIdsOlderTurnCount: this.olderAgentTurnCount,
        readPaths: Array.from(this.readPaths),
        completedAskQuestionToolCallIds: Array.from(this.completedAskQuestionToolCallIds),
        plans: plansObj,
        goalState: this.goalState,
        communicateUpdateHistory: this.communicateUpdateHistory.map((entry) => new CommunicateUpdateHistoryEntry({
          step: entry.step,
          messageIndex: entry.messageIndex
        })),
        communicateUpdateFinalSummary: this.communicateUpdateFinalSummary,
        communicateUpdateCompletedSubtitle: this.communicateUpdateCompletedSubtitle,
        communicateUpdateStatesByParentToolCallId: communicateUpdateStatesByParentToolCallIdObj
        // Note: lastSubagentByType and lastUsedSubagentId are computed at runtime
        // from SubagentPersistedState timestamps, not persisted separately
      };
      const newConversationStateStructure = new ConversationStateStructure(conversationStateInit);
      const newRedactedConversationStateStructure = toRedactedConversationStateStructure(newConversationStateStructure, this.conversationStateStructure._privacyMode);
      const serializeDurationMs = performance.now() - serializeStart;
      span.span.setAttribute("setBlobCount", setBlobCount);
      span.span.setAttribute("serializeDurationMs", serializeDurationMs);
      if (setBlobCount >= 50 || serializeDurationMs >= SLOW_RESTORE_DURATION_MS) {
        _logger3.debug(span.ctx, "Large conversation state serialize", {
          serializeDurationMs,
          setBlobCount,
          rootPromptMessageCount: newConversationStateStructure.rootPromptMessagesJson.length,
          turnCount: newConversationStateStructure.turns.length,
          todoCount: newConversationStateStructure.todos.length,
          fileStateCount: Object.keys(newConversationStateStructure.fileStatesV2).length,
          hasSummary: newConversationStateStructure.summary !== void 0,
          summaryArchiveCount: newConversationStateStructure.summaryArchives.length
        });
      }
      this.conversationStateStructure = newRedactedConversationStateStructure;
      return newRedactedConversationStateStructure;
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources19(env_2);
    }
  }
  /**
   * Accumulate token usage from a model call into the turn-level usage.
   * Call this after each successful model call to track total usage for the turn.
   */
  addTurnUsage(usage) {
    this.turnUsage.inputTokens += usage.inputTokens;
    this.turnUsage.outputTokens += usage.outputTokens;
    this.turnUsage.cacheReadTokens += usage.cacheReadTokens;
    this.turnUsage.cacheWriteTokens += usage.cacheWriteTokens;
    this.turnUsage.reasoningTokens = (this.turnUsage.reasoningTokens ?? 0) + (usage.reasoningTokens ?? 0);
  }
  /**
   * Get the accumulated turn usage and reset it for the next turn.
   */
  getTurnUsageAndReset() {
    const usage = { ...this.turnUsage };
    this.turnUsage = {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      reasoningTokens: 0
    };
    return usage;
  }
  // Allow external callers to set latest token details
  setTokenDetails(tokenDetails) {
    this.tokenDetails = tokenDetails;
    this.tokenDetailsStaleAfterSummarization = false;
  }
  /** The mode this turn runs in, given the turn's own stamp. */
  resolveTurnMode(userMessage2) {
    const mode = resolveCurrentTurnMode(this.mode, userMessage2.mode);
    return __classPrivateFieldGet3(this, _ConversationStateHandle_instances, "m", _ConversationStateHandle_suppressesMultitask).call(this, mode) ? AgentMode.AGENT : mode;
  }
  /** The mode a mid-turn step runs in, where the persisted mode wins. */
  resolveStepMode(userMessage2) {
    const mode = resolveCurrentStepMode(this.mode, userMessage2.mode);
    return __classPrivateFieldGet3(this, _ConversationStateHandle_instances, "m", _ConversationStateHandle_suppressesMultitask).call(this, mode) ? AgentMode.AGENT : mode;
  }
  // Allow external callers to set the current mode
  setMode(mode) {
    if (__classPrivateFieldGet3(this, _ConversationStateHandle_instances, "m", _ConversationStateHandle_suppressesMultitask).call(this, mode) || this.mode === mode) {
      return;
    }
    this.mode = mode;
    this.conversationStateStructure.mode = mode;
  }
  hasAgentTypeChangedFromPersistedState() {
    return this.agentTypeChangedFromPersistedState;
  }
  setActiveBranchName(activeBranchName) {
    this.activeBranchName = activeBranchName;
  }
  setBackgroundSummarizationState(promiseInfo, messagesUndergoingSummarization, cancellationToken) {
    this.backgroundSummarizationPromiseInfo = promiseInfo;
    this.messagesUndergoingSummarization = messagesUndergoingSummarization;
    this.backgroundSummarizationHasCompleted = false;
    this.backgroundSummarizationCancellationToken = cancellationToken;
  }
  setBackgroundSummarizationHasCompleted(generationDurationMs) {
    this.backgroundSummarizationHasCompleted = true;
    this.backgroundSummarizationGenerationDurationMs = generationDurationMs;
  }
  clearBackgroundSummarizationState() {
    this.backgroundSummarizationPromiseInfo = null;
    this.messagesUndergoingSummarization = null;
    this.backgroundSummarizationHasCompleted = false;
    this.backgroundSummarizationGenerationDurationMs = null;
    this.backgroundSummarizationCancellationToken = null;
  }
  /**
   * Persist a subagent's state to the parent.
   * @param ctx - The context for the operation
   * @param subagentId - Unique ID for this subagent
   * @param subagentType - The subagent type proto (for LAST_AGENT_SAME_TYPE tracking)
   * @param state - The subagent's persisted state (will have timestamps set)
   */
  persistSubagentState(_ctx, subagentId, subagentType, state) {
    const now = BigInt(Date.now());
    const existingState = this.subagentStates.get(subagentId);
    const createdTimestamp = existingState?.createdTimestampMs ?? now;
    const persistedModelId = state.modelId ?? existingState?.modelId;
    const updatedState = new SubagentPersistedState({
      ...state,
      createdTimestampMs: createdTimestamp,
      lastUsedTimestampMs: now,
      subagentType,
      modelId: persistedModelId
    });
    this.subagentStates.set(subagentId, updatedState);
    const typeName = getSubagentTypeName(subagentType);
    this.lastSubagentByType.set(typeName, subagentId);
    this.lastUsedSubagentId = subagentId;
  }
  recordSubagentRunCompletion(completion) {
    const parentToolCallId = subagentRunParentToolCallId(completion);
    if (parentToolCallId === void 0) {
      return;
    }
    const subagentId = normalizeNonEmptyString2(completion.subagentId) ?? normalizeNonEmptyString2(completion.taskId);
    const run = subagentRunStateFromCompletion({
      completion,
      existingRun: this.subagentRunsByParentToolCallId.get(parentToolCallId),
      // Completions may reference the public agent id (a first-class
      // subagent's bcId); resolve to the internal key so enrichment still
      // finds the state.
      persistedSubagentState: subagentId !== void 0 ? this.subagentStates.get(this.resolveSubagentId(subagentId) ?? subagentId) : void 0
    });
    if (run !== void 0) {
      this.subagentRunsByParentToolCallId.set(parentToolCallId, run);
    }
  }
  /**
   * Restore a subagent's state.
   * @param ctx - The context for the operation
   * @param subagentId - The subagent ID to restore
   * @returns The subagent's persisted state, or undefined if not found
   */
  /**
   * Resolve a public subagent reference to the canonical `subagentStates` map
   * key. First-class cloud subagents surface their durable bcId as the public
   * agent id, so callers (e.g. Task `resume`) may hold a bcId; internal maps
   * stay keyed by the internal subagentId, so persistence must use the
   * resolved key, never the raw public id.
   */
  resolveSubagentId(subagentIdOrBcId) {
    if (this.subagentStates.has(subagentIdOrBcId)) {
      return subagentIdOrBcId;
    }
    for (const [subagentId, state] of this.subagentStates) {
      if (state.cloudSubagent?.bcId === subagentIdOrBcId) {
        return subagentId;
      }
    }
    return void 0;
  }
  restoreSubagentState(_ctx, subagentId) {
    const resolved = this.resolveSubagentId(subagentId);
    return resolved !== void 0 ? this.subagentStates.get(resolved) : void 0;
  }
  /**
   * Get the subagent ID to resume based on resume mode and type.
   * @param typeName - The subagent type name
   * @param mode - The resume mode ('LAST_AGENT', 'LAST_AGENT_SAME_TYPE', or 'DEFAULT')
   * @returns The subagent ID to resume, or undefined if none
   */
  getSubagentIdToResume(typeName, mode) {
    switch (mode) {
      case "DEFAULT":
        return void 0;
      case "LAST_AGENT":
        return this.lastUsedSubagentId;
      case "LAST_AGENT_SAME_TYPE":
        return this.lastSubagentByType.get(typeName);
      default: {
        const _exhaustiveCheck = mode;
        throw new Error(`Unknown resume mode: ${_exhaustiveCheck}`);
      }
    }
  }
  async createShellTurn(ctx, shellCommand) {
    const shellCommandBlob = this.serdes.shellCommand.serialize(shellCommand);
    const shellCommandBlobId = await getBlobId(shellCommandBlob);
    getBlobMetadataCallback(this.blobStore)?.({
      blobId: shellCommandBlobId,
      blobType: { kind: "proto", typeName: "agent.v1.ShellCommand" }
    });
    await this.blobStore.setBlob(ctx, shellCommandBlobId, shellCommandBlob);
    const emptyOutput = toRedactedShellOutput(new ShellOutput({
      stdout: "",
      stderr: "",
      exitCode: 0
    }), this.privacyMode);
    const shellOutputBlob = this.serdes.shellOutput.serialize(emptyOutput);
    const shellOutputBlobId = await getBlobId(shellOutputBlob);
    getBlobMetadataCallback(this.blobStore)?.({
      blobId: shellOutputBlobId,
      blobType: { kind: "proto", typeName: "agent.v1.ShellOutput" }
    });
    await this.blobStore.setBlob(ctx, shellOutputBlobId, shellOutputBlob);
    const shellTurnInner = new ShellConversationTurnStructure({
      shellCommand: new Uint8Array(shellCommandBlobId),
      shellOutput: new Uint8Array(shellOutputBlobId)
    });
    const turn = new ShellConversationTurnHandle(this.blobStore, this.serdes, shellTurnInner);
    this.turns.push(new EagerReference({
      deserialize: (blob) => {
        const outer = conversationTurnStructureSerde2.deserialize(blob);
        if (outer.turn.case !== "shellConversationTurn") {
          throw new Error("Expected shell turn");
        }
        return new ShellConversationTurnHandle(this.blobStore, this.serdes, outer.turn.value);
      },
      serialize: (value) => value.serialize()
    }, this.blobStore, turn));
    return turn;
  }
  async createAgentTurn(parentCtx, userMessage2, requestContext, config2, resourceAccessor, options2) {
    const { turn } = await __classPrivateFieldGet3(this, _ConversationStateHandle_instances, "m", _ConversationStateHandle_createAgentTurn).call(this, parentCtx, userMessage2, requestContext, config2, resourceAccessor, options2, false);
    return turn;
  }
  /**
   * `createAgentTurn` for a BACKGROUND_TASK_COMPLETION turn whose caller writes
   * the turn's prompt message itself. createAgentTurn never appends a prompt
   * message for these turns, so the dynamic-tools offload reminder comes back
   * as `systemReminder` and the caller must append it to that message.
   */
  async createBackgroundTaskCompletionTurn(parentCtx, userMessage2, requestContext, config2, resourceAccessor, options2) {
    return await __classPrivateFieldGet3(this, _ConversationStateHandle_instances, "m", _ConversationStateHandle_createAgentTurn).call(this, parentCtx, userMessage2, requestContext, config2, resourceAccessor, options2, true);
  }
};
_ConversationStateHandle_instances = /* @__PURE__ */ new WeakSet(), _ConversationStateHandle_suppressesMultitask = function _ConversationStateHandle_suppressesMultitask2(mode) {
  return this.isRootProjectConversation && mode === AgentMode.MULTITASK;
}, _ConversationStateHandle_createAgentTurn = async function _ConversationStateHandle_createAgentTurn2(parentCtx, userMessage2, requestContext, config2, resourceAccessor, options2, callerAppendsNotificationPrompt) {
  const env_3 = { stack: [], error: void 0, hasError: false };
  try {
    const span = __addDisposableResource19(env_3, createSpan(parentCtx.withName("createAgentTurn")), false);
    const ctx = span.ctx;
    ensureUserMessageTiming(userMessage2);
    if (userMessage2.isSimulatedMsg !== true) {
      this.resetSelfSummaryCount();
    }
    const projectSubagentDetails = userMessage2.projectDetails?.subagent;
    const projectSideChatDetails = userMessage2.projectDetails?.sideChat;
    const isRootProjectMessage = userMessage2.projectDetails !== void 0 && projectSubagentDetails === void 0 && projectSideChatDetails === void 0;
    if (isRootProjectMessage) {
      this.isRootProjectConversation = true;
    }
    this.getOrInitializeConversationStartedDate(requestContext.env?.timeZone, requestContext.env?.devMockPromptTime?.toDate());
    const sendMessageEnabled = isProjectSendMessageEnabled(this);
    if (options2?.sendMessageToolName !== void 0) {
      this.projectSendMessageToolName = options2.sendMessageToolName;
    }
    const sendMessageToolName = sendMessageEnabled ? this.projectSendMessageToolName : void 0;
    const isProject = isRootProjectMessage;
    const isProjectKickoff = isProject && (options2?.isProjectKickoff ?? this.turns.length === 0);
    const projectName = isProjectKickoff ? normalizeProjectName(unwrapPossiblyRedactedCodeString(userMessage2.projectDetails?.name)) : void 0;
    const projectChildName = projectSubagentDetails !== void 0 || projectSideChatDetails !== void 0 ? normalizeProjectName(unwrapPossiblyRedactedCodeString(userMessage2.projectDetails?.name)) : void 0;
    const skipPreTurnStateSnapshot = config2.featureFlags?.skipPreTurnStateSnapshot === true;
    const overlapPreTurnStateSnapshot = !skipPreTurnStateSnapshot && config2.featureFlags?.overlapPreTurnStateSnapshot === true;
    const stateSnapshotStart = performance.now();
    let stateSnapshotCompletedAt = stateSnapshotStart;
    const stateBeforeMessageBlobIdPromise = skipPreTurnStateSnapshot ? Promise.resolve(void 0) : (async () => {
      const stateBeforeMessage = await this.computeNewStructure(ctx);
      const stateBeforeMessageBytes = conversationStateStructureSerde.serialize(fromRedactedConversationStateStructure(stateBeforeMessage, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
      const stateBeforeMessageBlobId2 = await getBlobId(stateBeforeMessageBytes);
      stateSnapshotCompletedAt = performance.now();
      stateSnapshotDuration.histogram(ctx, stateSnapshotCompletedAt - stateSnapshotStart, { overlap: overlapPreTurnStateSnapshot ? "true" : "false" });
      getBlobMetadataCallback(this.blobStore)?.({
        blobId: stateBeforeMessageBlobId2,
        blobType: {
          kind: "proto",
          typeName: "agent.v1.RedactedConversationStateStructure"
        }
      });
      void this.blobStore.setBlob(ctx, stateBeforeMessageBlobId2, stateBeforeMessageBytes);
      return stateBeforeMessageBlobId2;
    })();
    const overlappingTurnPreparationStart = performance.now();
    if (overlapPreTurnStateSnapshot) {
      void stateBeforeMessageBlobIdPromise.catch(() => {
      });
    }
    let stateBeforeMessageBlobId;
    if (!overlapPreTurnStateSnapshot) {
      stateBeforeMessageBlobId = await stateBeforeMessageBlobIdPromise;
    }
    userMessage2 = new UserMessage({ ...userMessage2 });
    if (__classPrivateFieldGet3(this, _ConversationStateHandle_instances, "m", _ConversationStateHandle_suppressesMultitask).call(this, userMessage2.mode)) {
      userMessage2.mode = AgentMode.AGENT;
    }
    if (stateBeforeMessageBlobId !== void 0) {
      userMessage2.conversationStateBlobId = new Uint8Array(stateBeforeMessageBlobId);
    }
    if (!overlapPreTurnStateSnapshot && userMessage2.projectDetails !== void 0) {
      const nameToKeep = projectName ?? projectChildName;
      if (nameToKeep !== void 0) {
        userMessage2.projectDetails.name = nameToKeep;
      } else {
        delete userMessage2.projectDetails.name;
      }
    }
    await this.hydrateUserMessageBlobText(ctx, userMessage2);
    const modeForContextProcessing = this.resolveTurnMode(userMessage2);
    const { userContent, selectedImages, selectedVideos, selectedDocuments, imageFilePaths } = await processSelectedContext(ctx, userMessage2.selectedContext ?? new SelectedContext(), this.blobStore, config2, requestContext, resourceAccessor, modeForContextProcessing, this.modelId, userMessage2.text, userMessage2.simulatedMsgReason, this.privacyMode);
    if (overlapPreTurnStateSnapshot) {
      const snapshotJoinStart = performance.now();
      stateBeforeMessageBlobId = await stateBeforeMessageBlobIdPromise;
      snapshotJoinWaitDuration.histogram(ctx, performance.now() - snapshotJoinStart);
      overlapSavedDuration.histogram(ctx, Math.max(0, Math.min(stateSnapshotCompletedAt, snapshotJoinStart) - overlappingTurnPreparationStart));
      if (stateBeforeMessageBlobId !== void 0) {
        userMessage2.conversationStateBlobId = new Uint8Array(stateBeforeMessageBlobId);
      }
      if (userMessage2.projectDetails !== void 0) {
        const nameToKeep = projectName ?? projectChildName;
        if (nameToKeep !== void 0) {
          userMessage2.projectDetails.name = nameToKeep;
        } else {
          delete userMessage2.projectDetails.name;
        }
      }
    }
    if (isProject && config2.featureFlags?.cloudCoordinatorToolsEnabled === true) {
      this.communicateUpdateHistory = [];
      this.communicateUpdateFinalSummary = void 0;
      this.communicateUpdateCompletedSubtitle = void 0;
    }
    const customModeIntent = userMessage2.customModeIntent?.intent;
    if (customModeIntent?.case === "exit") {
      this.durableSkillBlocks = [];
      this.durableCustomModeId = void 0;
    } else if (customModeIntent?.case === "enter") {
      const { selectedSkills } = resolveSelectedContextSkillSections(userMessage2.selectedContext ?? new SelectedContext());
      const renderedModeBlock = renderDurableCustomModeSkillBlock(selectedSkills, customModeIntent.value);
      if (renderedModeBlock !== void 0 && renderedModeBlock.length > 0) {
        this.durableSkillBlocks = [renderedModeBlock];
        this.durableCustomModeId = customModeIntent.value.id;
      } else if (this.durableCustomModeId !== void 0 && this.durableCustomModeId !== customModeIntent.value.id) {
        this.durableSkillBlocks = [];
        this.durableCustomModeId = void 0;
      }
    }
    if (imageFilePaths && imageFilePaths.length > 0 && config2.enableImageFiles) {
      const imageFilePathsText = `<image_files>
The following images were provided by the user and saved to disk for future use:
${imageFilePaths.map((path31, i) => `${i + 1}. ${path31}`).join("\n")}

These files can be read with tools, copied to other locations, or attached to subagents using the file_attachments parameter.
</image_files>`;
      userContent.push({
        type: "text",
        text: imageFilePathsText
      });
    }
    let previousMode;
    if (this.turns.length > 0) {
      previousMode = __classPrivateFieldGet3(this, _ConversationStateHandle_instances, "m", _ConversationStateHandle_suppressesMultitask).call(this, this.mode) ? AgentMode.AGENT : this.mode;
    }
    const previousAgentType = this.hasAgentTypeChangedFromPersistedState() === true ? parseAgentType(this.conversationStateStructure.agentType) : this.agentType;
    const workspaceUris = extractWorkspaceUris(parentCtx, requestContext);
    const workspaceReminder = processWorkspaceChangeReminder(parentCtx, workspaceUris.map((uri) => uri.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)), this.previousWorkspaceUris?.map((uri) => uri.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED)), this.agentType, previousAgentType);
    if (workspaceReminder) {
      const needsNewline = userContent.length > 0;
      userContent.push({
        type: "text",
        text: needsNewline ? `

${workspaceReminder}` : workspaceReminder
      });
    }
    this.previousWorkspaceUris = workspaceUris.length > 0 ? [...workspaceUris] : void 0;
    const currentTrackedGitRepoBranches = toTrackedGitRepoBranches(requestContext.gitRepos);
    if (config2.featureFlags?.enableTrackedGitRepoState === true) {
      const branchReminder = buildTrackedGitRepoBranchReminder(this.trackedGitRepoBranches, requestContext.gitRepos, config2.featureFlags.enhancedBranchChangeReminder === true);
      if (branchReminder) {
        const needsNewline = userContent.length > 0;
        userContent.push({
          type: "text",
          text: needsNewline ? `

${branchReminder}` : branchReminder
        });
      }
    }
    this.trackedGitRepoBranches = currentTrackedGitRepoBranches;
    const currentModeForReminder = this.resolveTurnMode(userMessage2);
    const modeReminder = processModeSystemReminder(currentModeForReminder, config2, requestContext, previousMode);
    const shouldSuppressFirstTurnMultitaskEnterReminderInUserContent = this.turns.length === 0 && config2.userInfoDisplayOptions?.disable !== true && currentModeForReminder === AgentMode.MULTITASK;
    const projectSubagentStoreDir = unwrapPossiblyRedactedCodeString(projectSubagentDetails?.storeDir);
    const projectSubagentId = getConversationId(ctx);
    const isProjectThreadFirstMessage = options2?.isProjectKickoff ?? this.turns.length === 0;
    const projectSubagentPrompt = projectSubagentDetails !== void 0 && projectSubagentId !== void 0 && isProjectThreadFirstMessage ? formatProjectThreadPrompt({
      projectName: projectChildName,
      storeDir: projectSubagentStoreDir,
      subagentId: projectSubagentId,
      promptText: config2.projectPromptTextGenerator?.()
    }) : projectSubagentStoreDir !== void 0 && projectSubagentId !== void 0 ? formatProjectSubagentPrompt({
      storeDir: projectSubagentStoreDir,
      subagentId: projectSubagentId
    }) : void 0;
    const projectSideChatStoreDir = unwrapPossiblyRedactedCodeString(projectSideChatDetails?.storeDir);
    const projectSideChatPrompt = projectSideChatStoreDir !== void 0 ? formatProjectSideChatPrompt({
      projectName: projectChildName,
      storeDir: projectSideChatStoreDir,
      promptText: config2.projectPromptTextGenerator?.()
    }) : void 0;
    const projectChildPrompt = projectSubagentPrompt ?? projectSideChatPrompt;
    const projectPrompt = isProject ? `<system_reminder>
${formatProjectPrompt(isProjectKickoff ? "initial" : resolveProjectCadenceKind({
      priorTurnCount: this.turns.length,
      interval: config2.projectReminderCadenceIntervalGenerator?.() ?? config2.projectReminderCadenceInterval
    }), {
      projectName,
      promptText: config2.projectPromptTextGenerator?.(),
      guidanceText: config2.projectPromptGuidanceGenerator?.(),
      sendMessageToolName,
      coordinatorToolsEnabled: config2.featureFlags?.cloudCoordinatorToolsEnabled === true,
      coordinatorProgressEnabled: config2.featureFlags?.cloudCoordinatorProgressEnabled === true,
      coordinatorSteerFollowupsEnabled: config2.featureFlags?.cloudCoordinatorSteerFollowupsEnabled === true,
      coordinatorPlacementConsentEnabled: config2.featureFlags?.cloudCoordinatorPlacementConsentEnabled === true,
      // Turn budget applied here, where the exact prior-turn count is
      // known on every path.
      firstProjectOnboarding: clampFirstProjectOnboardingForTurn(config2.firstProjectOnboarding, this.turns.length)
    })}
</system_reminder>` : projectChildPrompt !== void 0 ? `<system_reminder>
${projectChildPrompt}
</system_reminder>` : "";
    const workerParentMessagingPrompt = config2.featureFlags?.cloudWorkerParentMessagingEnabled === true ? `<system_reminder>
${formatWorkerParentMessagingPrompt()}
</system_reminder>` : "";
    const midLevelParentMessagingPrompt = config2.featureFlags?.cloudMidLevelParentMessagingEnabled === true ? `<system_reminder>
${formatMidLevelParentMessagingPrompt()}
</system_reminder>` : "";
    const userTurnSystemReminder = joinUserTurnSystemReminders(options2?.additionalUserTurnSystemReminder ?? "", processExplicitModelRequestSystemReminder(ctx), processAntiAskQuestionSystemReminder(config2), shouldSuppressFirstTurnMultitaskEnterReminderInUserContent ? "" : modeReminder, projectPrompt, workerParentMessagingPrompt, midLevelParentMessagingPrompt);
    if (userTurnSystemReminder) {
      const needsNewline = userContent.length > 0;
      userContent.push({
        type: "text",
        text: needsNewline ? `

${userTurnSystemReminder}` : userTurnSystemReminder
      });
    }
    const subagentReminder = userMessage2.subagentSystemReminder !== void 0 && userMessage2.subagentSystemReminder !== "" ? `<system_reminder>
${userMessage2.subagentSystemReminder}
</system_reminder>` : "";
    if (subagentReminder) {
      const needsNewline = userContent.length > 0;
      userContent.push({
        type: "text",
        text: needsNewline ? `

${subagentReminder}` : subagentReminder
      });
    }
    const previousAgentTurn = await getPreviousAgentConversationTurn(ctx, this.turns);
    const previousModelMcid = previousAgentTurn !== void 0 ? decryptTurnModelMcid(previousAgentTurn, config2.decryptMcidAndParams) : void 0;
    const currentModelMcid = config2.model?.mcid;
    const skipBetweenTurnReminders = userMessage2.simulatedMsgReason === SimulatedMsgReason.BACKGROUND_TASK_COMPLETION;
    if (!skipBetweenTurnReminders && previousModelMcid !== void 0 && previousModelMcid.length > 0 && currentModelMcid !== void 0 && currentModelMcid.length > 0 && config2.encryptedMcidAndParams !== void 0 && config2.encryptedMcidAndParams.length > 0 && previousModelMcid !== currentModelMcid) {
      const needsNewline = userContent.length > 0;
      userContent.push({
        type: "text",
        text: needsNewline ? `

${MODEL_SWITCH_REMINDER}` : MODEL_SWITCH_REMINDER
      });
    }
    const offloadReminderDelivery = !skipBetweenTurnReminders ? "user_content" : callerAppendsNotificationPrompt ? "caller" : "hidden";
    const currentDynamicToolCount = offloadReminderDelivery === "hidden" ? void 0 : options2?.dynamicToolCount;
    const currentDynamicToolNames = options2?.dynamicToolNames ?? [];
    const dynamicToolMetaNames = options2?.dynamicToolMetaNames;
    let callerOffloadReminder;
    if (currentDynamicToolCount !== void 0 && currentDynamicToolCount > 0 && dynamicToolMetaNames !== void 0) {
      const previousSnapshot = await getPreviousRecordedDynamicToolSnapshot(ctx, this.turns, config2.previousRecordedDynamicToolCountScanLimit ?? PREVIOUS_RECORDED_DYNAMIC_TOOL_COUNT_SCAN_LIMIT);
      if (shouldInjectDynamicToolsOffloadReminder(previousSnapshot?.count, currentDynamicToolCount)) {
        const newlyOffloadedToolNames = diffNewlyOffloadedToolNames({
          current: currentDynamicToolNames,
          previous: previousSnapshot?.names ?? []
        });
        const reminder = buildDynamicToolsOffloadedReminder(dynamicToolMetaNames, newlyOffloadedToolNames);
        dynamicToolsOffloadReminderInjected.increment(ctx, 1, {
          named: newlyOffloadedToolNames.length > 0 ? "true" : "false",
          "user.is_dev": getIsDevFromContext(ctx) ? "true" : "false"
        });
        if (offloadReminderDelivery === "caller") {
          callerOffloadReminder = reminder;
        } else {
          const needsNewline = userContent.length > 0;
          userContent.push({
            type: "text",
            text: needsNewline ? `

${reminder}` : reminder
          });
        }
      }
    }
    const recentlyAddedPluginReminder = buildRecentlyAddedPluginReminder(requestContext.recentlyAddedPlugin);
    if (recentlyAddedPluginReminder) {
      const needsNewline = userContent.length > 0;
      userContent.push({
        type: "text",
        text: needsNewline ? `

${recentlyAddedPluginReminder}` : recentlyAddedPluginReminder
      });
    }
    const enableHookAdditionalContext = config2.featureFlags?.enableHookAdditionalContext === true;
    const enableAgentStoreConflictNotices = config2.featureFlags?.enableAgentStoreConflictNotices === true;
    if (enableHookAdditionalContext || enableAgentStoreConflictNotices) {
      const contexts = enableHookAdditionalContext ? userMessage2.hookAdditionalContexts : userMessage2.hookAdditionalContexts.filter((c) => c.hookEventName === "agentStoreConflict");
      for (const hookAdditionalContext of contexts) {
        const hookAdditionalContextReminder = renderHookAdditionalContextSystemReminder(hookAdditionalContext.content);
        if (hookAdditionalContextReminder) {
          const needsNewline = userContent.length > 0;
          userContent.push({
            type: "text",
            text: needsNewline ? `

${hookAdditionalContextReminder}` : hookAdditionalContextReminder
          });
        }
      }
    }
    const eagerEditingNote = config2.isEagerEditingModel === true ? `<system_reminder>
IMPORTANT: It is bad to be over-eager with making edits vs just answering the question when that is not what the user wants. Think carefully before deciding to edit.
</system_reminder>
` : "";
    const currentTimePrefix = config2.featureFlags?.userMessageTimestamps === true ? buildTimestampPrefix(requestContext.env?.timeZone, requestContext.env?.devMockPromptTime?.toDate()) : "";
    const promptReferenceIdResolution = resolvePromptReferenceId(config2.featureFlags?.glassMetaParentAgent === true, userMessage2.promptReferenceId, userMessage2.messageId, userContent);
    if (promptReferenceIdResolution.shouldIncludePromptReferenceIdTag && promptReferenceIdResolution.promptReferenceId !== void 0) {
      const promptReferenceIdTag = renderUserMessageIdTag(promptReferenceIdResolution.promptReferenceId);
      userContent.unshift({
        type: "text",
        text: promptReferenceIdTag
      });
    }
    const incomingMessageIdTag = sendMessageEnabled && shouldExposeIncomingMessageId(userMessage2) ? renderIncomingMessageIdTag(userMessage2.messageId) : void 0;
    if (incomingMessageIdTag !== void 0) {
      userContent.unshift({
        type: "text",
        text: incomingMessageIdTag
      });
    }
    const isNotificationOnlyText = isNotificationOnlyUserMessage({
      role: "user",
      content: userMessage2.text
    });
    userContent.push({
      type: "text",
      text: isNotificationOnlyText ? `${currentTimePrefix}${userMessage2.text}` : `${currentTimePrefix}<user_query>
${eagerEditingNote}${userMessage2.text}
</user_query>`
    });
    const promptReferenceId = !promptReferenceIdResolution.hasStructuredPromptReferenceId && promptReferenceIdResolution.promptReferenceId !== void 0 ? promptReferenceIdResolution.promptReferenceId : userMessage2.promptReferenceId;
    const threadId = resolveUserMessageThreadId({
      ...userMessage2,
      promptReferenceId,
      messageId: userMessage2.messageId
    });
    const storedSelectedDocuments = this.privacyMode === PrivacyMode.NO_STORAGE ? [] : selectedDocuments;
    const storedSelectedVideos = this.privacyMode === PrivacyMode.NO_STORAGE ? [] : selectedVideos;
    userMessage2 = new UserMessage({
      ...userMessage2,
      ...promptReferenceId !== void 0 ? { promptReferenceId } : {},
      selectedContext: new SelectedContext({
        ...userMessage2.selectedContext,
        selectedDocuments: storedSelectedDocuments,
        selectedImages,
        selectedVideos: storedSelectedVideos
      })
    });
    if (threadId !== void 0) {
      userMessage2.threadId = threadId;
    }
    const requestId2 = getRequestId(ctx);
    const isProjectSendMessageRequestBoundary = sendMessageEnabled && userMessage2.isSimulatedMsg !== true;
    const message = {
      role: "user",
      content: userContent,
      ...(requestId2 !== void 0 || isProjectSendMessageRequestBoundary) && {
        providerOptions: {
          cursor: {
            ...requestId2 !== void 0 ? { requestId: requestId2 } : {},
            ...isProjectSendMessageRequestBoundary ? {
              [PROJECT_SEND_MESSAGE_REQUEST_BOUNDARY_PROVIDER_KEY]: true
            } : {}
          }
        }
      }
    };
    const redactedMessage = toRedactedCoreMessage(message, this.privacyMode);
    coreToRedactedMap.set(message, redactedMessage);
    if (userMessage2.simulatedMsgReason !== SimulatedMsgReason.BACKGROUND_TASK_COMPLETION) {
      this.rootPromptBuilder.appendMessages(redactedMessage);
    }
    const redactedUserMessage = toRedactedUserMessage2(userMessage2, this.privacyMode);
    const userMessageBlobStart = performance.now();
    const serializedUserMessage = this.serdes.userMessage.serialize(redactedUserMessage);
    const userMessageBlobId = await getBlobId(serializedUserMessage);
    getBlobMetadataCallback(this.blobStore)?.({
      blobId: userMessageBlobId,
      blobType: { kind: "proto", typeName: "agent.v1.UserMessage" }
    });
    await this.blobStore.setBlob(ctx, userMessageBlobId, serializedUserMessage);
    userMessageBlobDuration.histogram(ctx, performance.now() - userMessageBlobStart);
    const routedModelDisplayName = options2?.recordRoutedModelDisplayName === true ? config2.routedModelDisplayName?.trim() : void 0;
    const inner = new AgentConversationTurnStructure({
      userMessage: new Uint8Array(userMessageBlobId),
      steps: [],
      requestId: requestId2,
      encryptedModel: config2.encryptedMcidAndParams,
      ...currentDynamicToolCount !== void 0 ? {
        dynamicToolCount: currentDynamicToolCount,
        dynamicToolNames: [...currentDynamicToolNames]
      } : {},
      ...routedModelDisplayName !== void 0 && routedModelDisplayName !== "" ? { routedModelDisplayName } : {},
      ...userMessage2.messageId.trim().length > 0 ? { userMessageId: userMessage2.messageId.trim() } : {}
    });
    const turn = new AgentConversationTurnHandle(this.blobStore, this.serdes, this.privacyMode, inner, this.rootPromptBuilder);
    this.turns.push(new EagerReference({
      deserialize: (blob) => {
        const outer = conversationTurnStructureSerde2.deserialize(blob);
        if (outer.turn.case !== "agentConversationTurn") {
          throw new Error("Expected agent turn");
        }
        return new AgentConversationTurnHandle(this.blobStore, this.serdes, this.privacyMode, outer.turn.value, this.rootPromptBuilder);
      },
      serialize: (value) => value.serialize()
    }, this.blobStore, turn));
    this.olderAgentTurnCount += appendRecentUserMessageId(this.recentUserMessageIds, userMessage2.messageId, config2.recentUserMessageIdIndexLimit ?? RECENT_USER_MESSAGE_ID_INDEX_LIMIT);
    return { turn, systemReminder: callerOffloadReminder };
  } catch (e_3) {
    env_3.error = e_3;
    env_3.hasError = true;
  } finally {
    __disposeResources19(env_3);
  }
};
function buildRecentlyAddedPluginReminder(plugin) {
  if (!plugin || !plugin.displayName) {
    return "";
  }
  const caps = [];
  if (plugin.skills.length) {
    caps.push(`Skills:
${plugin.skills.map((s3) => `  - ${s3.name}${s3.description ? `: ${s3.description}` : ""}`).join("\n")}`);
  }
  if (plugin.subagents.length) {
    caps.push(`Subagents:
${plugin.subagents.map((s3) => `  - ${s3.name}${s3.description ? `: ${s3.description}` : ""}`).join("\n")}`);
  }
  if (plugin.hooks.length) {
    caps.push(`Hooks:
${plugin.hooks.map((h) => `  - ${h.name}${h.description ? `: ${h.description}` : ""}`).join("\n")}`);
  }
  if (plugin.rules.length) {
    caps.push(`Rules:
${plugin.rules.map((r) => `  - ${r.name}${r.description ? `: ${r.description}` : ""}`).join("\n")}`);
  }
  if (plugin.commands.length) {
    caps.push(`Commands:
${plugin.commands.map((c) => `  - ${c.name}${c.description ? `: ${c.description}` : ""}`).join("\n")}`);
  }
  if (plugin.mcpServers.length) {
    caps.push(`MCP Servers:
${plugin.mcpServers.map((s3) => `  - ${s3}`).join("\n")}`);
  }
  let prompt = `The user just installed the "${plugin.displayName}" plugin`;
  if (plugin.description) {
    prompt += ` (${plugin.description})`;
  }
  if (caps.length) {
    prompt += ` with the following capabilities:

${caps.join("\n\n")}`;
  }
  prompt += `

Provide them with an overview of what is contained in the plugin. Keep in mind that:
- Commands can be invoked with \`/\`
- Skills and subagents can be invoked directly with \`/\` or will be used by the agent automatically
- Rules and hooks will be applied automatically`;
  if (plugin.mcpServers.length) {
    prompt += `
- MCP servers likely require authentication. After providing an overview of the plugin, check the STATUS.md file in the server's folder to see if it needs authentication, and follow the instructions in the file to authenticate.`;
  }
  prompt += `

Do NOT do any other searches over file system contents, search the web, etc. and do not think for too long. Just give the user an overview of the plugin they installed.`;
  return `<system_reminder>
${prompt}
</system_reminder>`;
}
