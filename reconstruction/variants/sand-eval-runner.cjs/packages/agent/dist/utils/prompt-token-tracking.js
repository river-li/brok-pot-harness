/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/prompt-token-tracking.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function trackPromptTokenUsage(params) {
  const { ctx, mcpTools, requestContext, messages, selectedContext, userInfoDisplayOptions, readToolName, invocationId, agentTokenLimit, modelInfo, featureFlags, stateHandler, mcpMetaToolServerCount } = params;
  const { mcpToolTokens, mcpToolCount } = countMcpToolDefinitionTokens(mcpTools);
  const { mcpEnabled, discoveryMode, serverCount } = getMcpPromptTrackingContext(requestContext, mcpMetaToolServerCount);
  const { ruleTokens, ruleCount } = countCursorRuleTokens({
    rules: requestContext.rules,
    requestContext,
    userInfoDisplayOptions
  });
  const { availableSkillTokens, availableSkillCount } = countAvailableSkillPromptUsage({
    ctx,
    requestContext,
    userInfoDisplayOptions,
    readToolName,
    agentTokenLimit,
    modelInfo,
    featureFlags,
    stateHandler
  });
  const { manuallyAttachedSkillTokens, manuallyAttachedSkillCount } = countManuallyAttachedSkillPromptUsage(selectedContext);
  const { conversationHistoryTokens, conversationHistoryMessageCount } = countConversationHistoryTokens(messages);
  const { fileAttachmentTokens, fileAttachmentCount } = countFileAttachmentTokens(selectedContext);
  emitMcpEligibleModelInvocation(ctx, {
    discoveryMode,
    serverCount
  });
  emitMcpPromptToolStats(ctx, {
    discoveryMode,
    toolCount: mcpToolCount,
    toolTokens: mcpToolTokens
  });
  const options2 = {
    mcpToolTokens,
    mcpToolCount,
    mcpEnabled,
    mcpDiscoveryMode: discoveryMode,
    mcpServerCount: serverCount,
    ruleTokens,
    ruleCount,
    availableSkillTokens,
    availableSkillCount,
    manuallyAttachedSkillTokens,
    manuallyAttachedSkillCount,
    conversationHistoryTokens,
    conversationHistoryMessageCount,
    fileAttachmentTokens,
    fileAttachmentCount,
    invocationId
  };
  const eventTracker = getAgentEventTracker(ctx);
  eventTracker.trackPromptTokens(ctx, options2);
}
function countMcpToolDefinitionTokens(mcpTools) {
  let mcpToolTokens = 0;
  const mcpToolCount = mcpTools.length;
  for (const tool of mcpTools) {
    const toolStr = JSON.stringify({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema
    });
    mcpToolTokens += estimateStringTokenCount(toolStr);
  }
  return { mcpToolTokens, mcpToolCount };
}
function getMcpPromptTrackingContext(requestContext, mcpMetaToolServerCount) {
  const metaToolOptions = requestContext.mcpMetaToolOptions;
  if (metaToolOptions?.enabled) {
    return {
      mcpEnabled: true,
      discoveryMode: "meta",
      serverCount: metaToolOptions.mcpDescriptors.length
    };
  }
  if (mcpMetaToolServerCount !== void 0 && mcpMetaToolServerCount > 0) {
    return {
      mcpEnabled: true,
      discoveryMode: "meta",
      serverCount: mcpMetaToolServerCount
    };
  }
  const fileSystemOptions = requestContext.mcpFileSystemOptions;
  if (fileSystemOptions?.enabled) {
    return {
      mcpEnabled: true,
      discoveryMode: "filesystem",
      serverCount: fileSystemOptions.mcpDescriptors.length
    };
  }
  return {
    mcpEnabled: false,
    discoveryMode: "disabled",
    serverCount: 0
  };
}
function countCursorRuleTokens(params) {
  let ruleTokens = 0;
  const workspacePaths = params.requestContext.env?.workspacePaths ?? [];
  const { globalRules, agentRequestableRules, userRules } = categorizeCursorRules(params.rules, workspacePaths, params.userInfoDisplayOptions?.agentType);
  const promptRules = [...globalRules, ...agentRequestableRules, ...userRules];
  const ruleCount = promptRules.length;
  for (const rule of promptRules) {
    ruleTokens += estimateStringTokenCount(rule.fullPath ?? "");
    ruleTokens += estimateStringTokenCount(rule.content ?? "");
  }
  return { ruleTokens, ruleCount };
}
function countAvailableSkillPromptUsage(params) {
  const { section, skillCount, renderedEstimatedTokens, uncappedEstimatedTokens, omittedSkillCount, strategy } = buildAvailableSkillsPromptSection({
    cursorRules: params.requestContext.rules,
    agentSkills: params.requestContext.agentSkills,
    displayOptions: params.userInfoDisplayOptions,
    env: params.requestContext.env,
    agentTokenLimit: params.agentTokenLimit,
    featureFlags: params.featureFlags,
    modelInfo: params.modelInfo
  }, {
    readToolName: params.readToolName
  });
  if (params.stateHandler !== void 0) {
    params.stateHandler.lastSkillCatalogBudgetStrategy = strategy;
  }
  if (!section) {
    return {
      availableSkillTokens: 0,
      availableSkillCount: 0
    };
  }
  if (strategy !== void 0 && renderedEstimatedTokens !== void 0 && uncappedEstimatedTokens !== void 0) {
    emitSkillCatalogBudgetMetrics(params.ctx, {
      strategy,
      renderedTokens: renderedEstimatedTokens,
      uncappedTokens: uncappedEstimatedTokens,
      omittedCount: omittedSkillCount ?? 0
    });
  }
  return {
    availableSkillTokens: renderedEstimatedTokens ?? estimateStringTokenCount(renderSection(section)),
    availableSkillCount: skillCount
  };
}
function countManuallyAttachedSkillPromptUsage(selectedContext) {
  if (!selectedContext) {
    return {
      manuallyAttachedSkillTokens: 0,
      manuallyAttachedSkillCount: 0
    };
  }
  const normalizedSelectedContext = normalizeSelectedContextSkillInput(selectedContext);
  const { selectedSkills } = resolveSelectedContextSkillSections(normalizedSelectedContext);
  const manuallyAttachedSkillsText = renderManuallyAttachedSkillsSection(selectedSkills);
  return {
    manuallyAttachedSkillTokens: manuallyAttachedSkillsText ? estimateStringTokenCount(manuallyAttachedSkillsText) : 0,
    manuallyAttachedSkillCount: selectedSkills.length
  };
}
function normalizeSelectedContextSkillInput(selectedContext) {
  const selectedContextWithSkills = selectedContext;
  return {
    selectedSkills: (selectedContextWithSkills.selectedSkills ?? []).map((skill) => ({
      fullPath: unwrapMaybeRedactedString(skill.fullPath) ?? "",
      content: unwrapMaybeRedactedString(skill.content) ?? "",
      plugin: unwrapMaybeRedactedString(skill.plugin),
      marketplace: unwrapMaybeRedactedString(skill.marketplace)
    })),
    cursorRules: (selectedContextWithSkills.cursorRules ?? []).map((cursorRule) => ({
      rule: cursorRule.rule === void 0 ? void 0 : {
        fullPath: unwrapMaybeRedactedString(cursorRule.rule.fullPath),
        content: unwrapMaybeRedactedString(cursorRule.rule.content)
      }
    }))
  };
}
function unwrapMaybeRedactedString(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object" && value !== null && "unwrap" in value && typeof value.unwrap === "function") {
    return value.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
  }
  return void 0;
}
function renderSection(section) {
  return renderContent(section);
}
function countConversationHistoryTokens(messages) {
  let conversationHistoryTokens = 0;
  const nonSystemMessages = messages.filter((m2) => m2.role !== "system");
  const conversationHistoryMessageCount = nonSystemMessages.length;
  for (const message of nonSystemMessages) {
    if (typeof message.content === "string") {
      conversationHistoryTokens += estimateStringTokenCount(message.content);
    } else if (Array.isArray(message.content)) {
      for (const part of message.content) {
        if (typeof part === "string") {
          conversationHistoryTokens += estimateStringTokenCount(part);
        } else if (typeof part === "object" && part !== null) {
          if ("text" in part && typeof part.text === "string") {
            conversationHistoryTokens += estimateStringTokenCount(part.text);
          }
          if ("toolName" in part && typeof part.toolName === "string") {
            conversationHistoryTokens += estimateStringTokenCount(part.toolName);
          }
          if ("args" in part && part.args !== void 0) {
            conversationHistoryTokens += estimateStringTokenCount(JSON.stringify(part.args));
          }
          if ("result" in part && part.result !== void 0) {
            conversationHistoryTokens += estimateStringTokenCount(JSON.stringify(part.result));
          }
        }
      }
    }
  }
  return { conversationHistoryTokens, conversationHistoryMessageCount };
}
function countFileAttachmentTokens(selectedContext) {
  let fileAttachmentTokens = 0;
  let fileAttachmentCount = 0;
  if (!selectedContext) {
    return { fileAttachmentTokens, fileAttachmentCount };
  }
  for (const codeSelection of selectedContext.codeSelections) {
    fileAttachmentTokens += estimateRedactedStringTokenCount(codeSelection.path);
    fileAttachmentTokens += estimateRedactedStringTokenCount(codeSelection.content);
    fileAttachmentCount += 1;
  }
  for (const terminal of selectedContext.terminals) {
    fileAttachmentTokens += estimateRedactedStringTokenCount(terminal.content);
    fileAttachmentTokens += estimateRedactedStringTokenCount(terminal.title);
    fileAttachmentCount += 1;
  }
  for (const terminalSelection of selectedContext.terminalSelections) {
    fileAttachmentTokens += estimateRedactedStringTokenCount(terminalSelection.content);
    fileAttachmentTokens += estimateRedactedStringTokenCount(terminalSelection.title);
    fileAttachmentCount += 1;
  }
  for (const file of selectedContext.files) {
    fileAttachmentTokens += estimateRedactedStringTokenCount(file.path);
    fileAttachmentTokens += estimateRedactedStringTokenCount(file.content);
    fileAttachmentCount += 1;
  }
  for (const folder of selectedContext.folders) {
    fileAttachmentTokens += estimateRedactedStringTokenCount(folder.path);
    if (folder.directoryTree) {
      const unwrappedTree = fromRedactedLsDirectoryTreeNode(folder.directoryTree, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
      fileAttachmentTokens += estimateStringTokenCount(JSON.stringify(unwrappedTree));
    }
    fileAttachmentCount += 1;
  }
  return { fileAttachmentTokens, fileAttachmentCount };
}
function estimateRedactedStringTokenCount(str3) {
  if (!str3 || str3.length === 0) {
    return 0;
  }
  return estimateStringTokenCount(str3.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
}

