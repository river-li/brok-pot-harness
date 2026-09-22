/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/prompt-token-breakdown.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var PROMPT_TOKEN_BREAKDOWN_CATEGORIES = [
  { id: "system_prompt", label: "System prompt" },
  { id: "tools", label: "Tool definitions" },
  { id: "rules", label: "Rules" },
  { id: "skills", label: "Skills" },
  { id: "mcp", label: "MCP & dynamic tools" },
  { id: "subagents", label: "Subagent definitions" },
  { id: "summarized_conversation", label: "Summarized conversation" },
  { id: "conversation", label: "Conversation" }
];
var CACHEABLE_CATEGORY_IDS = PROMPT_TOKEN_BREAKDOWN_CATEGORIES.map((c) => c.id).filter((id) => id !== "conversation");
function buildPromptTokenBreakdownSnapshot(ctx, params) {
  const sources = collectAllCategorySources(params.messages, params.tools, params.descriptionProps);
  const charCounts = mapCategoryRecord(sources, (segments) => sumCharacterCount(segments));
  emitCategoryEstimatedTokensMetric(ctx, sources);
  const previousSnapshot = params.previousSnapshot;
  if (previousSnapshot === void 0 || !snapshotHasCharacterCounts(previousSnapshot)) {
    return buildApportionedSnapshot(sources, charCounts, params);
  }
  const previousByCategory = indexCategoriesById(previousSnapshot);
  const avgRatio = computeAvgRatio(previousByCategory);
  const resolved = resolveCacheableCategories(charCounts, previousByCategory, avgRatio);
  const cacheableSum = sumCacheableEstimatedTokens(resolved);
  const total = roundClampNonNegative(params.totalUsedTokens);
  if (cacheableSum > total) {
    return previousSnapshot;
  }
  return buildSnapshotFromResolvedCategories({
    resolved,
    conversationCharCount: charCounts.conversation,
    conversationEstimatedTokens: total - cacheableSum,
    totalUsedTokens: params.totalUsedTokens,
    maxTokens: params.maxTokens
  });
}
function buildSummarizeRefreshSnapshot(params) {
  if (!snapshotHasCharacterCounts(params.previousSnapshot)) {
    return params.previousSnapshot;
  }
  const previousByCategory = indexCategoriesById(params.previousSnapshot);
  const avgRatio = computeAvgRatio(previousByCategory);
  const resolved = /* @__PURE__ */ new Map();
  for (const id of CACHEABLE_CATEGORY_IDS) {
    if (id === "summarized_conversation") {
      resolved.set(id, resolveCachedCategory(params.newSummarizedConversationCharCount, previousByCategory.get(id), avgRatio));
      continue;
    }
    const previous = previousByCategory.get(id);
    resolved.set(id, {
      characterCount: previous?.characterCount ?? 0,
      estimatedTokens: previous?.estimatedTokens ?? 0
    });
  }
  const cacheableSum = sumCacheableEstimatedTokens(resolved);
  const total = roundClampNonNegative(params.totalUsedTokens);
  if (cacheableSum > total) {
    return params.previousSnapshot;
  }
  const conversationEstimatedTokens = total - cacheableSum;
  const previousConversation = previousByCategory.get("conversation");
  return buildSnapshotFromResolvedCategories({
    resolved,
    conversationCharCount: previousConversation?.characterCount ?? 0,
    conversationEstimatedTokens,
    totalUsedTokens: params.totalUsedTokens,
    maxTokens: params.maxTokens
  });
}
function collectAllCategorySources(messages, tools, descriptionProps) {
  const { tools: toolSegments, subagents: subagentSegments } = collectToolAndSubagentSegments(tools, descriptionProps);
  return {
    system_prompt: collectSystemPromptSegments(messages),
    tools: toolSegments,
    rules: collectRulesSegments(messages),
    skills: collectSkillsSegments(messages),
    mcp: collectMcpPromptBlockSegments(messages),
    subagents: [
      ...subagentSegments,
      ...collectAvailableSubagentModelsSegments(messages),
      ...collectAvailableSubagentTypesSegments(messages)
    ],
    summarized_conversation: collectSummarizedConversationSegments(messages),
    conversation: collectConversationSegments(messages)
  };
}
function collectSystemPromptSegments(messages) {
  const segments = [];
  for (const message of messages) {
    if (message.role !== "system") {
      continue;
    }
    for (const text2 of getTextLikeContentParts(message.content)) {
      segments.push(stripTagBlocks(text2, isToolDiscoveryBlockTag));
    }
  }
  return segments;
}
function collectToolAndSubagentSegments(tools, descriptionProps) {
  const descriptionPropsToUse = descriptionProps ?? buildDescriptionGeneratorProps(tools);
  const agentTools = toAgentTools(tools, descriptionPropsToUse);
  const toolSegments = [];
  const subagentSegments = [];
  for (let index = 0; index < tools.length; index++) {
    const tool = tools[index];
    const agentTool = agentTools[index];
    if (tool === void 0 || agentTool === void 0) {
      continue;
    }
    const split = splitSubagentDescriptionFromTool(tool, agentTool.description, descriptionPropsToUse);
    toolSegments.push(serializeProviderFacingToolDefinition({
      ...agentTool,
      description: split.toolDescription
    }));
    if (split.subagentText.length > 0) {
      subagentSegments.push(split.subagentText);
    }
  }
  return { tools: toolSegments, subagents: subagentSegments };
}
function splitSubagentDescriptionFromTool(tool, description9, descriptionProps) {
  if (tool.toolIdentifier !== "TASK" || !("descriptionTokenPartsGenerator" in tool)) {
    return { toolDescription: description9, subagentText: "" };
  }
  const subagentText = tool.descriptionTokenPartsGenerator?.(descriptionProps).subagentDescriptionText ?? "";
  if (subagentText.length === 0) {
    return { toolDescription: description9, subagentText: "" };
  }
  const lastOccurrence = description9.lastIndexOf(subagentText);
  if (lastOccurrence === -1) {
    return { toolDescription: description9, subagentText: "" };
  }
  return {
    toolDescription: description9.slice(0, lastOccurrence) + description9.slice(lastOccurrence + subagentText.length),
    subagentText
  };
}
function serializeProviderFacingToolDefinition(tool) {
  return `${tool.name} ${tool.description} ${JSON.stringify(tool.customToolFormat ?? tool.parameters)}`;
}
function collectRulesSegments(messages) {
  const initialUserMessage = findInitialUserPromptMessage(messages);
  if (initialUserMessage === void 0) {
    return [];
  }
  const segments = [];
  for (const text2 of getTextLikeContentParts(initialUserMessage.content)) {
    for (const rulesBlock of extractCompleteTagRanges(text2, "rules")) {
      segments.push(text2.slice(rulesBlock.start, rulesBlock.end));
    }
  }
  return segments;
}
function collectSkillsSegments(messages) {
  const initialUserMessage = findInitialUserPromptMessage(messages);
  if (initialUserMessage === void 0) {
    return [];
  }
  const segments = [];
  for (const text2 of getTextLikeContentParts(initialUserMessage.content)) {
    if (extractCompleteTagRanges(text2, "user_info").length === 0) {
      continue;
    }
    for (const skillsBlock of extractCompleteTagRanges(text2, "agent_skills")) {
      segments.push(text2.slice(skillsBlock.start, skillsBlock.end));
    }
  }
  return segments;
}
function collectAvailableSubagentModelsSegments(messages) {
  const initialUserMessage = findInitialUserPromptMessage(messages);
  if (initialUserMessage === void 0) {
    return [];
  }
  const segments = [];
  for (const text2 of getTextLikeContentParts(initialUserMessage.content)) {
    if (extractCompleteTagRanges(text2, "user_info").length === 0) {
      continue;
    }
    for (const block of extractCompleteTagRanges(text2, "available_subagent_models")) {
      segments.push(text2.slice(block.start, block.end));
    }
  }
  return segments;
}
function collectAvailableSubagentTypesSegments(messages) {
  const initialUserMessage = findInitialUserPromptMessage(messages);
  if (initialUserMessage === void 0) {
    return [];
  }
  const segments = [];
  for (const text2 of getTextLikeContentParts(initialUserMessage.content)) {
    if (extractCompleteTagRanges(text2, "user_info").length === 0) {
      continue;
    }
    for (const block of extractCompleteTagRanges(text2, "available_subagent_types")) {
      segments.push(text2.slice(block.start, block.end));
    }
  }
  return segments;
}
function isMcpBlockTag(tagName) {
  return tagName.startsWith("mcp_");
}
function isDynamicToolBlockTag(tagName) {
  return tagName.startsWith("dynamic_tool");
}
function isToolDiscoveryBlockTag(tagName) {
  return isMcpBlockTag(tagName) || isDynamicToolBlockTag(tagName);
}
function collectMcpPromptBlockSegments(messages) {
  const segments = [];
  for (const message of messages) {
    if (message.role === "tool") {
      continue;
    }
    if (isSummaryCarrierMessage(message)) {
      continue;
    }
    for (const text2 of getTextLikeContentParts(message.content)) {
      for (const block of extractMcpBlocks(text2)) {
        segments.push(block);
      }
    }
  }
  return segments;
}
var INITIAL_PROMPT_SCAFFOLD_TAGS_NON_MCP = [
  "user_info",
  "rules",
  "agent_skills",
  "available_subagent_models",
  "available_subagent_types"
];
function isInitialPromptScaffoldTag(tagName) {
  return INITIAL_PROMPT_SCAFFOLD_TAGS_NON_MCP.some((t) => t === tagName) || isToolDiscoveryBlockTag(tagName);
}
function collectConversationSegments(messages) {
  const segments = [];
  let initialUserPromptSeen = false;
  for (const message of messages) {
    if (message.role === "system") {
      continue;
    }
    if (isSummaryCarrierMessage(message)) {
      continue;
    }
    const isInitialUserPrompt = message.role === "user" && !initialUserPromptSeen;
    if (message.role === "user") {
      initialUserPromptSeen = true;
    }
    collectConversationContentSegments(message.content, {
      scaffoldStripMode: isInitialUserPrompt ? "initial-prompt-scaffold" : "mcp-blocks"
    }, segments);
  }
  return segments;
}
function collectSummarizedConversationSegments(messages) {
  const segments = [];
  for (const message of messages) {
    if (!isSummaryCarrierMessage(message)) {
      continue;
    }
    collectConversationContentSegments(message.content, { scaffoldStripMode: "none" }, segments);
  }
  return segments;
}
function collectConversationContentSegments(content, options2, out) {
  if (typeof content === "string") {
    pushConversationText(content, options2, out);
    return;
  }
  if (!Array.isArray(content)) {
    return;
  }
  for (const part of content) {
    collectConversationContentPartSegments(part, options2, out);
  }
}
function collectConversationContentPartSegments(part, options2, out) {
  if (typeof part === "string") {
    pushConversationText(part, options2, out);
    return;
  }
  if (typeof part !== "object" || part === null) {
    return;
  }
  if ("text" in part) {
    const textValue = part.text;
    if (isPromptTextPart(part)) {
      collectConversationPromptValueSegments(textValue, options2, out);
    } else {
      collectConversationStructuredValueSegments(textValue, out);
    }
  }
  for (const field of ["reasoning", "thinking"]) {
    if (field in part) {
      collectConversationStructuredValueSegments(part[field], out);
    }
  }
  if ("toolName" in part && typeof part.toolName === "string") {
    out.push(part.toolName);
  }
  for (const field of ["args", "input", "result"]) {
    if (field in part) {
      collectConversationStructuredValueSegments(part[field], out);
    }
  }
  if (!("result" in part) && "content" in part) {
    collectConversationStructuredValueSegments(part.content, out);
  }
}
function isPromptTextPart(part) {
  return !("type" in part) || part.type === "text";
}
function collectConversationPromptValueSegments(value, options2, out) {
  if (value === void 0 || value === null) {
    return;
  }
  if (typeof value === "string") {
    pushConversationText(value, options2, out);
    return;
  }
  collectConversationStructuredValueSegments(value, out);
}
function collectConversationStructuredValueSegments(value, out) {
  if (value === void 0 || value === null) {
    return;
  }
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  try {
    out.push(JSON.stringify(value));
  } catch {
  }
}
function pushConversationText(text2, options2, out) {
  switch (options2.scaffoldStripMode) {
    case "initial-prompt-scaffold":
      out.push(stripTagBlocks(text2, isInitialPromptScaffoldTag));
      return;
    case "mcp-blocks":
      out.push(stripTagBlocks(text2, isToolDiscoveryBlockTag));
      return;
    case "none":
      out.push(text2);
      return;
  }
}
function apportionRawWeightsToTotal(rawTokensByCategory, targetTotalTokens) {
  const total = roundClampNonNegative(targetTotalTokens);
  const apportioned = Object.fromEntries(PROMPT_TOKEN_BREAKDOWN_CATEGORIES.map((category) => [category.id, 0]));
  if (total === 0) {
    return apportioned;
  }
  const weights = PROMPT_TOKEN_BREAKDOWN_CATEGORIES.map((category, index) => ({
    id: category.id,
    originalIndex: index,
    weight: Math.max(0, rawTokensByCategory[category.id] ?? 0)
  }));
  const weightTotal = weights.reduce((sum, w2) => sum + w2.weight, 0);
  if (weightTotal === 0) {
    apportioned.conversation = total;
    return apportioned;
  }
  const scaled = weights.map(({ id, originalIndex, weight }) => {
    const exact = weight / weightTotal * total;
    const floored = Math.floor(exact);
    return { id, originalIndex, floored, remainder: exact - floored };
  });
  for (const { id, floored } of scaled) {
    apportioned[id] = floored;
  }
  let remaining = total - scaled.reduce((sum, s3) => sum + s3.floored, 0);
  const byLargestRemainder = [...scaled].sort((left, right) => {
    if (right.remainder !== left.remainder) {
      return right.remainder - left.remainder;
    }
    return left.originalIndex - right.originalIndex;
  });
  for (const { id } of byLargestRemainder) {
    if (remaining <= 0) {
      break;
    }
    apportioned[id] += 1;
    remaining -= 1;
  }
  return apportioned;
}
function buildApportionedSnapshot(sources, charCounts, params) {
  const rawTokensByCategory = mapCategoryRecord(sources, (segments) => sumRawTokens(segments));
  const apportioned = apportionRawWeightsToTotal(rawTokensByCategory, params.totalUsedTokens);
  return assemblePromptTokenBreakdownSnapshot({
    estimatedTokensByCategory: apportioned,
    characterCountsByCategory: charCounts,
    totalUsedTokens: params.totalUsedTokens,
    maxTokens: params.maxTokens
  });
}
function resolveCachedCategory(characterCount, cached2, avgRatio) {
  if (characterCount === 0) {
    return { characterCount: 0, estimatedTokens: 0 };
  }
  if (cached2?.characterCount !== void 0 && cached2.characterCount > 0) {
    if (cached2.characterCount === characterCount) {
      return { characterCount, estimatedTokens: cached2.estimatedTokens };
    }
    const scaled = Math.round(cached2.estimatedTokens * (characterCount / cached2.characterCount));
    return { characterCount, estimatedTokens: Math.max(0, scaled) };
  }
  if (avgRatio !== void 0) {
    return {
      characterCount,
      estimatedTokens: Math.max(0, Math.round(characterCount * avgRatio))
    };
  }
  return {
    characterCount,
    estimatedTokens: Math.max(0, Math.round(characterCount / 4))
  };
}
function computeAvgRatio(previousByCategory) {
  let totalChars = 0;
  let totalTokens = 0;
  for (const category of previousByCategory.values()) {
    if (category.characterCount === void 0 || category.characterCount <= 0) {
      continue;
    }
    totalChars += category.characterCount;
    totalTokens += category.estimatedTokens;
  }
  if (totalChars === 0) {
    return void 0;
  }
  return totalTokens / totalChars;
}
function resolveCacheableCategories(charCounts, previousByCategory, avgRatio) {
  const resolved = /* @__PURE__ */ new Map();
  for (const id of CACHEABLE_CATEGORY_IDS) {
    resolved.set(id, resolveCachedCategory(charCounts[id], previousByCategory.get(id), avgRatio));
  }
  return resolved;
}
function indexCategoriesById(snapshot) {
  const map4 = /* @__PURE__ */ new Map();
  if (!snapshot) {
    return map4;
  }
  const knownIds = new Set(PROMPT_TOKEN_BREAKDOWN_CATEGORIES.map((c) => c.id));
  for (const category of snapshot.categories) {
    if (knownIds.has(category.id)) {
      map4.set(category.id, category);
    }
  }
  return map4;
}
function snapshotHasCharacterCounts(snapshot) {
  if (!snapshot) {
    return false;
  }
  return snapshot.categories.some((c) => c.characterCount !== void 0);
}
function sumCacheableEstimatedTokens(resolved) {
  let sum = 0;
  for (const id of CACHEABLE_CATEGORY_IDS) {
    sum += resolved.get(id)?.estimatedTokens ?? 0;
  }
  return sum;
}
function buildSnapshotFromResolvedCategories(args) {
  const resolved = new Map(args.resolved);
  resolved.set("conversation", {
    characterCount: args.conversationCharCount,
    estimatedTokens: args.conversationEstimatedTokens
  });
  return new PromptTokenBreakdownSnapshot({
    totalUsedTokens: roundClampNonNegative(args.totalUsedTokens),
    maxTokens: roundClampNonNegative(args.maxTokens),
    categories: PROMPT_TOKEN_BREAKDOWN_CATEGORIES.map((category) => {
      const entry = resolved.get(category.id) ?? {
        characterCount: 0,
        estimatedTokens: 0
      };
      return new PromptTokenBreakdownCategory({
        id: category.id,
        label: category.label,
        estimatedTokens: entry.estimatedTokens,
        characterCount: entry.characterCount
      });
    })
  });
}
function assemblePromptTokenBreakdownSnapshot(args) {
  return new PromptTokenBreakdownSnapshot({
    totalUsedTokens: roundClampNonNegative(args.totalUsedTokens),
    maxTokens: roundClampNonNegative(args.maxTokens),
    categories: PROMPT_TOKEN_BREAKDOWN_CATEGORIES.map((category) => new PromptTokenBreakdownCategory({
      id: category.id,
      label: category.label,
      estimatedTokens: args.estimatedTokensByCategory[category.id],
      characterCount: args.characterCountsByCategory[category.id]
    }))
  });
}
function sumCharacterCount(segments) {
  let total = 0;
  for (const segment of segments) {
    total += segment.length;
  }
  return total;
}
function sumRawTokens(segments) {
  let total = 0;
  for (const segment of segments) {
    total += estimateStringTokenCount(segment);
  }
  return total;
}
function mapCategoryRecord(record2, fn) {
  const out = {};
  for (const category of PROMPT_TOKEN_BREAKDOWN_CATEGORIES) {
    out[category.id] = fn(record2[category.id], category.id);
  }
  return out;
}
function roundClampNonNegative(value) {
  return Math.max(0, Math.round(value));
}
function getTextLikeContentParts(content) {
  if (typeof content === "string") {
    return [content];
  }
  if (!Array.isArray(content)) {
    return [];
  }
  const out = [];
  for (const part of content) {
    if (typeof part === "string") {
      out.push(part);
      continue;
    }
    if (typeof part === "object" && part !== null && "text" in part && typeof part.text === "string") {
      out.push(part.text);
    }
  }
  return out;
}
function selectOutermostRanges(ranges) {
  const sorted = [...ranges].sort((left, right) => {
    if (left.start !== right.start) {
      return left.start - right.start;
    }
    return right.end - left.end;
  });
  const selected = [];
  let coveredUntil = -1;
  for (const range2 of sorted) {
    if (range2.start < coveredUntil) {
      continue;
    }
    selected.push(range2);
    coveredUntil = range2.end;
  }
  return selected;
}
function extractMcpBlocks(text2) {
  const ranges = extractCompleteTagRangesMatching(text2, isToolDiscoveryBlockTag);
  return selectOutermostRanges(ranges).map((range2) => text2.slice(range2.start, range2.end));
}
function stripTagBlocks(text2, matchesStrippedTag) {
  const ranges = extractCompleteTagRangesMatching(text2, matchesStrippedTag);
  const outermost = selectOutermostRanges(ranges);
  let stripped = "";
  let cursor = 0;
  for (const range2 of outermost) {
    stripped += text2.slice(cursor, range2.start);
    cursor = range2.end;
  }
  stripped += text2.slice(cursor);
  return stripped;
}
function isSummaryCarrierMessage(message) {
  return message.role === "user" && message.providerOptions?.cursor?.isSummary === true;
}
function findInitialUserPromptMessage(messages) {
  return messages.find((message) => message.role === "user" && !isSummaryCarrierMessage(message));
}
var promptTokenBreakdownCategoryEstimatedTokens = createHistogram("agent.prompt_token_breakdown.category_estimated_tokens", {
  description: "Raw (pre-apportionment) estimated tokens per category for the prompt-token breakdown visualizer. Tagged with `category` (system_prompt, tools, rules, skills, mcp, subagents, summarized_conversation, conversation).",
  labelNames: ["category"]
});
function emitCategoryEstimatedTokensMetric(ctx, sources) {
  for (const category of PROMPT_TOKEN_BREAKDOWN_CATEGORIES) {
    promptTokenBreakdownCategoryEstimatedTokens.histogram(ctx, sumRawTokens(sources[category.id]), {
      category: category.id
    });
  }
}

