init_unknown_record();
function diffPromptPrefix(previous, current) {
  const changed = [];
  if (previous.toolsSha !== current.toolsSha) changed.push("tools");
  if (previous.systemSha !== current.systemSha) {
    const previousByName = new Map(previous.sections.map((section) => [section.name, section.sha]));
    const seen = /* @__PURE__ */ new Set();
    let namedChange = false;
    for (const section of current.sections) {
      seen.add(section.name);
      if (previousByName.get(section.name) !== section.sha) {
        changed.push(`system:${section.name}`);
        namedChange = true;
      }
    }
    for (const section of previous.sections) {
      if (!seen.has(section.name)) {
        changed.push(`system:${section.name}`);
        namedChange = true;
      }
    }
    if (!namedChange) changed.push("system:unknown");
  }
  if (previous.userInfoSha !== current.userInfoSha) changed.push("user_info");
  return changed;
}
function diffPromptPrefixDynamicTools(previous, current) {
  if (previous.dynamicTools === void 0 || current.dynamicTools === void 0) return void 0;
  const previousNames = new Set(previous.dynamicTools);
  const currentNames = new Set(current.dynamicTools);
  return [
    ...current.dynamicTools.filter((name17) => !previousNames.has(name17)).map((name17) => `+${name17}`),
    ...previous.dynamicTools.filter((name17) => !currentNames.has(name17)).map((name17) => `-${name17}`)
  ];
}
function diffPromptPrefixTools(previous, current) {
  if (previous.tools === void 0 || current.tools === void 0) return void 0;
  const previousByName = new Map(previous.tools.map((tool) => [tool.name, tool.sha]));
  const changed = [];
  const seen = /* @__PURE__ */ new Set();
  for (const tool of current.tools) {
    seen.add(tool.name);
    const previousSha = previousByName.get(tool.name);
    if (previousSha === void 0) changed.push(`+${tool.name}`);
    else if (previousSha !== tool.sha) changed.push(tool.name);
  }
  for (const tool of previous.tools) {
    if (!seen.has(tool.name)) changed.push(`-${tool.name}`);
  }
  if (changed.length === 0) {
    const sameOrder = previous.tools.every(
      (tool, index) => current.tools?.[index]?.name === tool.name
    );
    if (!sameOrder) changed.push("~order");
  }
  return changed;
}
function toToolChangeLabels(change) {
  if (change === "~order") return { tool: "all", change: "reordered" };
  if (change.startsWith("+")) return { tool: boundedToolName(change.slice(1)), change: "added" };
  if (change.startsWith("-")) return { tool: boundedToolName(change.slice(1)), change: "removed" };
  return { tool: boundedToolName(change), change: "content" };
}
var TOOL_NAME_LABEL = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;
function boundedToolName(name17) {
  return TOOL_NAME_LABEL.test(name17) ? name17 : "other";
}
function messageText(message) {
  const content = message.content;
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const part of content) {
    if (!isUnknownRecord(part) || typeof part.type !== "string") continue;
    if (part.type === "text" && typeof part.text === "string") {
      parts.push(part.text);
    } else {
      parts.push(`[${part.type}]`);
    }
  }
  return parts.join("\n");
}
function jsonSchemaOf(parameters2) {
  return isUnknownRecord(parameters2) ? parameters2.jsonSchema : void 0;
}
var messageShaByIdentity = /* @__PURE__ */ new WeakMap();
var toolShaByIdentity = /* @__PURE__ */ new WeakMap();
function shaOfMessage(message) {
  const cached2 = messageShaByIdentity.get(message);
  if (cached2 !== void 0) return cached2;
  const sha = sha256HexOfText(messageText(message));
  messageShaByIdentity.set(message, sha);
  return sha;
}
function toolDefinitionForHash(tool) {
  const cached2 = toolShaByIdentity.get(tool);
  if (cached2 !== void 0) return cached2;
  const description9 = "description" in tool ? tool.description : void 0;
  const parameters2 = "parameters" in tool ? jsonSchemaOf(tool.parameters) : void 0;
  const customToolFormat = "customToolFormat" in tool ? tool.customToolFormat : void 0;
  const providerTool = "parameters" in tool ? void 0 : tool;
  let serialized;
  try {
    serialized = JSON.stringify({
      name: tool.name,
      description: description9,
      parameters: parameters2,
      customToolFormat,
      providerTool
    });
  } catch {
    serialized = JSON.stringify({ name: tool.name, description: description9 });
  }
  const sha = sha256HexOfText(serialized);
  toolShaByIdentity.set(tool, sha);
  return sha;
}
var USER_INFO_MARKER = "<user_info>";
var CURSOR_NAMESPACE_TOOLS = new RegExp(
  `<namespace name="${CURSOR_DYNAMIC_TOOLS_NAMESPACE}" tools="([^"]*)"`
);
var dynamicToolsByIdentity = /* @__PURE__ */ new WeakMap();
function dynamicToolNamesOf(message) {
  if (dynamicToolsByIdentity.has(message)) return dynamicToolsByIdentity.get(message);
  const listed = CURSOR_NAMESPACE_TOOLS.exec(messageText(message))?.[1];
  const names3 = listed?.split(", ").filter((name17) => name17.length > 0);
  dynamicToolsByIdentity.set(message, names3);
  return names3;
}
function hashPromptPrefix(request5) {
  const first = request5.messages[0];
  const system = first?.role === "system" ? first : void 0;
  const systemSha = system === void 0 ? sha256HexOfText("") : shaOfMessage(system);
  const firstUser = request5.messages.find((message) => message.role === "user");
  const userInfo = firstUser !== void 0 && messageText(firstUser).includes(USER_INFO_MARKER) ? firstUser : void 0;
  const userInfoSha = userInfo === void 0 ? void 0 : shaOfMessage(userInfo);
  const dynamicTools = userInfo === void 0 ? void 0 : dynamicToolNamesOf(userInfo);
  const tools = (request5.tools ?? []).map((tool) => ({
    name: tool.name,
    sha: toolDefinitionForHash(tool)
  }));
  const toolsSha = sha256HexOfText(tools.map((tool) => tool.sha).join("\n"));
  return { systemSha, toolsSha, toolCount: tools.length, tools, dynamicTools, userInfoSha };
}
var prefixHitRate = createHistogram("grok_bot.turn.prefix_hit_rate", {
  labelNames: ["harness", "call_index", "request_source", "inference_reason", "prefix"]
});
var prefixChanged = createCounter("grok_bot.turn.prefix_changed", {
  labelNames: ["harness", "call_index", "inference_reason", "section", "compaction"]
});
var prefixToolChanged = createCounter("grok_bot.turn.prefix_tool_changed", {
  labelNames: [
    "harness",
    "call_index",
    "inference_reason",
    "tool",
    "change",
    "compaction"
  ]
});
var prefixDynamicToolChanged = createCounter("grok_bot.turn.prefix_dynamic_tool_changed", {
  labelNames: [
    "harness",
    "call_index",
    "inference_reason",
    "tool",
    "change",
    "compaction"
  ]
});
var SUMMARIZATION_INFERENCE_REASON = "agent-summarization";
var AUXILIARY_INFERENCE_REASON = "auxiliary";
function isSummarizationRequest(request5) {
  const providerOptions = request5.messages.at(-1)?.providerOptions;
  if (!isUnknownRecord(providerOptions) || !isUnknownRecord(providerOptions.cursor)) return false;
  return providerOptions.cursor.inferenceReason === SUMMARIZATION_INFERENCE_REASON;
}
function isAuxiliaryRequest(request5) {
  return (request5.tools?.length ?? 0) === 0;
}
function toCallIndexLabel(callIndex) {
  return callIndex === 1 ? "first" : "later";
}
function toSectionLabel(change) {
  return change.startsWith("system:") ? change.slice("system:".length) : change;
}
function toPrefixLabel(compared, changed) {
  if (compared === void 0) return "unknown";
  return changed.length === 0 ? "stable" : "changed";
}
function createPromptPrefixObservation(deps) {
  const now = deps.now ?? Date.now;
  let callIndex = 0;
  let previousMain;
  let latestMain;
  let firstMainUsage;
  let lastMainUsage;
  let lastMainCompactionEpoch = 0;
  let loadedPersisted = false;
  function loadPersisted() {
    if (loadedPersisted) return;
    loadedPersisted = true;
    const persisted = deps.snapshots?.getPromptPrefixSnapshot() ?? null;
    if (persisted !== null) previousMain = { prefix: persisted, fromPreviousTurn: true };
  }
  function comparedToLatestMain() {
    return latestMain === void 0 ? void 0 : { prefix: latestMain, fromPreviousTurn: false };
  }
  let settlePending;
  function observe2(request5) {
    settlePending?.();
    loadPersisted();
    const sections = deps.sectionShas();
    const compactionEpoch = deps.compactionEpoch();
    const requestSource = deps.requestSource();
    const recordedAtMs = now();
    const harness = deps.harness;
    const summarization = isSummarizationRequest(request5);
    const auxiliary = !summarization && isAuxiliaryRequest(request5);
    let settled;
    const settle = () => {
      if (settled !== void 0) return settled;
      settlePending = void 0;
      if (auxiliary) {
        settled = { kind: "auxiliary", inferenceReason: AUXILIARY_INFERENCE_REASON };
        return settled;
      }
      const { dynamicTools, ...hashed } = hashPromptPrefix(request5);
      const inferenceReason = summarization ? SUMMARIZATION_INFERENCE_REASON : "agent";
      const isMain = inferenceReason === "agent";
      if (isMain) callIndex += 1;
      const currentCallIndex = Math.max(callIndex, 1);
      const current = {
        ...hashed,
        ...dynamicTools !== void 0 ? { dynamicTools } : {},
        sections,
        compactionEpoch,
        requestSource,
        recordedAtMs
      };
      const compared = isMain ? previousMain : comparedToLatestMain();
      const changed = compared === void 0 ? [] : diffPromptPrefix(compared.prefix, current);
      const changedTools = compared !== void 0 && changed.includes("tools") ? diffPromptPrefixTools(compared.prefix, current) : void 0;
      if (isMain) {
        previousMain = { prefix: current, fromPreviousTurn: false };
        latestMain = current;
      }
      const callIndexLabel = toCallIndexLabel(currentCallIndex);
      const compaction = compared !== void 0 && compared.prefix.compactionEpoch !== current.compactionEpoch ? "advanced" : "same";
      if (harness !== void 0) {
        for (const change of changed) {
          prefixChanged.increment(deps.ctx, 1, {
            harness,
            call_index: callIndexLabel,
            inference_reason: inferenceReason,
            section: toSectionLabel(change),
            compaction
          });
        }
        for (const change of changedTools ?? []) {
          prefixToolChanged.increment(deps.ctx, 1, {
            harness,
            call_index: callIndexLabel,
            inference_reason: inferenceReason,
            ...toToolChangeLabels(change),
            compaction
          });
        }
        const changedDynamicTools = compared !== void 0 && changed.includes("user_info") ? diffPromptPrefixDynamicTools(compared.prefix, current) : void 0;
        for (const change of changedDynamicTools ?? []) {
          prefixDynamicToolChanged.increment(deps.ctx, 1, {
            harness,
            call_index: callIndexLabel,
            inference_reason: inferenceReason,
            ...toToolChangeLabels(change),
            compaction
          });
        }
      }
      settled = {
        kind: "prefix",
        inferenceReason,
        currentCallIndex,
        callIndexLabel,
        current,
        compared,
        changed,
        changedTools
      };
      return settled;
    };
    settlePending = settle;
    return {
      onStreamEnd: () => {
        settle();
      },
      onUsage: (usage) => {
        const call = settle();
        const inputTokens = usage.inputTokens;
        const cacheReadTokens = usage.cacheReadTokens;
        if (call.kind === "prefix" && call.inferenceReason === "agent") {
          const mainUsage = {
            inputTokens,
            cacheReadTokens,
            cacheWriteTokens: usage.cacheWriteTokens
          };
          firstMainUsage ??= mainUsage;
          lastMainUsage = mainUsage;
          lastMainCompactionEpoch = call.current.compactionEpoch;
        }
        if (harness !== void 0 && inputTokens > 0) {
          prefixHitRate.histogram(deps.ctx, Math.min(1, cacheReadTokens / inputTokens), {
            harness,
            call_index: call.kind === "prefix" ? call.callIndexLabel : "later",
            request_source: requestSource ?? "unknown",
            inference_reason: call.inferenceReason,
            prefix: call.kind === "prefix" ? toPrefixLabel(call.compared, call.changed) : "unknown"
          });
        }
        if (call.kind !== "prefix") return;
        const { current, compared, changed, changedTools } = call;
        if (changed.length === 0 || compared === void 0) return;
        deps.telemetry?.reportPromptPrefixDiff({
          conversationId: deps.conversationId(),
          requestId: deps.requestId(),
          callIndexInTurn: call.currentCallIndex,
          requestSource,
          previousRequestSource: compared.prefix.requestSource,
          inferenceReason: call.inferenceReason,
          compactionEpoch: current.compactionEpoch,
          comparedToPreviousTurn: compared.fromPreviousTurn,
          compactionAdvanced: compared.prefix.compactionEpoch !== current.compactionEpoch,
          changed,
          changedTools,
          gapMsSincePrevious: Math.max(0, current.recordedAtMs - compared.prefix.recordedAtMs),
          systemSha: current.systemSha,
          toolsSha: current.toolsSha,
          toolCount: current.toolCount,
          cacheReadTokens,
          inputTokens
        });
      }
    };
  }
  return {
    streamObserver: {
      onRequestStart: (_ctx, request5) => observe2(request5)
    },
    finalize: () => {
      settlePending?.();
      if (latestMain !== void 0) deps.snapshots?.setPromptPrefixSnapshot(latestMain);
    },
    parentTurnPrompt: (modelId) => firstMainUsage === void 0 || lastMainUsage === void 0 ? void 0 : {
      modelId,
      firstCall: firstMainUsage,
      lastCall: lastMainUsage,
      lastCallCompactionEpoch: lastMainCompactionEpoch
    }
  };
}
