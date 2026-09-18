var GENERAL_PURPOSE_SUBAGENT_TYPE = "generalPurpose";
var EXPLORE_SUBAGENT_TYPE = "explore";
var BEST_OF_N_RUNNER_SUBAGENT_TYPE = "best-of-n-runner";
var DEFAULT_SUBAGENT_SYSTEM_REMINDER = "You are running as a subagent under a parent agent. Do not spawn additional subagents unless requested by the user or by your instructions. Do not create Cursor Canvas files unless requested by the user or by your instructions.";
function normalizeSubagentTypeName(name17) {
  const normalized = name17.trim().toLowerCase().replace(/[-_]/g, "").replace(/(?<=.)(subagenttype|subagent|agent|mode|type)$/, "");
  if (normalized === "mediareview") {
    return "videoreview";
  }
  return normalized;
}
function getSubagentTypeName(subagentType) {
  if (subagentType.type.case === "custom") {
    return subagentType.type.value.name;
  }
  if (subagentType.type.case === "unspecified") {
    return GENERAL_PURPOSE_SUBAGENT_TYPE;
  }
  if (subagentType.type.case === "computerUse") {
    return "computerUse";
  }
  if (subagentType.type.case === "explore") {
    return "explore";
  }
  if (subagentType.type.case === "bash" || subagentType.type.case === "shell") {
    return "shell";
  }
  if (subagentType.type.case === "browserUse") {
    return "browser-use";
  }
  if (subagentType.type.case === "debug") {
    return "debug";
  }
  if (subagentType.type.case === "cursorGuide") {
    return "cursor-guide";
  }
  if (subagentType.type.case === "mediaReview") {
    return "videoReview";
  }
  if (subagentType.type.case === "watchVideo") {
    return "watchVideo";
  }
  return subagentType.type.case ?? "unknown";
}
function isGeminiVideoSubagentType(subagentType) {
  return subagentType?.type.case === "mediaReview" || subagentType?.type.case === "watchVideo";
}
function customSubagentToConfig(subagent, preserveTaskTool) {
  const subagentName = subagent.name;
  const config2 = {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({
          name: subagentName
        })
      }
    }),
    description: subagent.description || void 0,
    preserveTaskTool,
    permissionMode: subagent.permissionMode,
    isBackground: subagent.isBackground,
    userRequestedModelId: subagent.model && subagent.model.toLowerCase() !== "inherit" ? subagent.model : void 0,
    forceDefaultModel: subagent.forceDefaultModel,
    plugin: subagent.plugin,
    marketplace: subagent.marketplace,
    pluginId: subagent.pluginId,
    marketplaceId: subagent.marketplaceId,
    subagentSource: subagent.source
  };
  if (subagent.prompt) {
    const customPrompt = subagent.prompt;
    const headerLines = [
      `You are operating as the "${subagentName}" custom subagent. DO NOT create unnecessary markdown files unless explicitly requested by the user.`
    ];
    if (subagent.description) {
      headerLines.push(subagent.description);
    }
    if (subagent.tools.length > 0) {
      headerLines.push(`Available tools: ${subagent.tools.join(", ")}`);
    }
    const header = headerLines.join("\n");
    config2.systemReminder = () => [header, customPrompt].join("\n\n");
  }
  return config2;
}
var COORDINATOR_SUBAGENT_KEEP_LIST = [
  GENERAL_PURPOSE_SUBAGENT_TYPE,
  EXPLORE_SUBAGENT_TYPE,
  "computerUse",
  "videoReview",
  "bugbot",
  "security-review"
];
var COORDINATOR_KEEP_LIST_NORMALIZED = new Set(COORDINATOR_SUBAGENT_KEEP_LIST.map((name17) => normalizeSubagentTypeName(name17)));
function isCoordinatorKeepListSubagentType(name17) {
  return COORDINATOR_KEEP_LIST_NORMALIZED.has(normalizeSubagentTypeName(name17));
}
function shouldIncludeWatchVideoSubagent(options2) {
  const { agentType, backgroundAgentSource, featureFlags } = options2;
  const slackOrAutomationsBackgroundAgentSupportsWatchVideo = agentType === AgentType.BACKGROUND && (backgroundAgentSource === BackgroundComposerSource.SLACK || backgroundAgentSource === BackgroundComposerSource.AUTOMATIONS) && (featureFlags?.enableSlackVideoAttachments ?? false);
  const websiteBackgroundAgentSupportsWatchVideo = agentType === AgentType.BACKGROUND && backgroundAgentSource === BackgroundComposerSource.WEBSITE && (featureFlags?.enableCloudAgentVideoAttachments ?? false);
  return agentType === AgentType.IDE && (featureFlags?.enableWatchVideoInIdeSubagent ?? false) || slackOrAutomationsBackgroundAgentSupportsWatchVideo || websiteBackgroundAgentSupportsWatchVideo;
}
function buildSubagentConfigs(options2) {
  const { customSubagents, includeComputerUseSubagent, includeWatchVideoSubagent = false, includeVideoReviewSubagent: includeVideoReviewSubagentOption = false, includeExploreSubagent, includeShellSubagent, includeDebugSubagent, includeBrowserUseSubagent, includeVmSetupHelperSubagent, includePastConversationExplorerSubagent, includeCursorBlameLearningSubagent, computerUseSubagentOverrides, includeGrindSwarmSubagent, enableNestedSubagents, includeCursorGuideSubagent, includeCiInvestigatorSubagent, includeBugbotSubagent, bugbotSupportsNaturalLanguage, bugbotEnableProactiveReview, bugbotModelOverride, includeSecurityReviewSubagent, includeFsdSubagent, includeBestOfNRunnerSubagent = true, restrictToCoordinatorKeepList = false, subagentModelOverrides } = options2;
  const includeVideoReviewSubagent = (includeComputerUseSubagent || includeVideoReviewSubagentOption) && applySubagentModelOverride(VIDEO_REVIEW_SUBAGENT_CONFIG, subagentModelOverrides) !== void 0;
  const configs = [
    getDefaultSubagentConfig(enableNestedSubagents ?? false)
  ];
  if (includeExploreSubagent) {
    configs.push(createExploreSubagentConfig());
  }
  if (includeShellSubagent) {
    configs.push(createShellSubagentConfig());
  }
  if (includeDebugSubagent) {
    configs.push(createDebugSubagentConfig());
  }
  if (includeComputerUseSubagent) {
    configs.push(createComputerUseSubagentConfig(computerUseSubagentOverrides));
  }
  if (includeVideoReviewSubagent) {
    configs.push(VIDEO_REVIEW_SUBAGENT_CONFIG);
  }
  if (includeWatchVideoSubagent) {
    configs.push(createWatchVideoSubagentConfig({
      includeVideoReviewReference: includeVideoReviewSubagent
    }));
  }
  if (includeBrowserUseSubagent) {
    configs.push(BROWSER_USE_SUBAGENT_CONFIG);
  }
  if (includeVmSetupHelperSubagent) {
    configs.push(VM_SETUP_HELPER_SUBAGENT_CONFIG);
  }
  if (includePastConversationExplorerSubagent) {
    configs.push(PAST_CONVERSATION_EXPLORER_SUBAGENT_CONFIG);
  }
  if (includeCursorBlameLearningSubagent) {
    configs.push(CURSOR_BLAME_LEARNING_SUBAGENT_CONFIG);
  }
  if (includeGrindSwarmSubagent) {
    configs.push(createCoordinatorAgentConfig());
    configs.push(createWorkerAgentConfig());
  }
  if (includeCursorGuideSubagent) {
    configs.push(createCursorGuideSubagentConfig());
  }
  if (includeCiInvestigatorSubagent) {
    configs.push(createCiInvestigatorSubagentConfig());
  }
  if (includeBugbotSubagent) {
    configs.push(createBugbotSubagentConfig({
      supportNaturalLanguage: bugbotSupportsNaturalLanguage ?? false,
      enableProactiveReview: bugbotEnableProactiveReview ?? false,
      modelOverride: bugbotModelOverride
    }));
  }
  if (includeSecurityReviewSubagent) {
    configs.push(createSecurityReviewSubagentConfig());
  }
  if (includeFsdSubagent) {
    configs.push(createFsdSubagentConfig());
  }
  if (includeBestOfNRunnerSubagent) {
    configs.push(createBestOfNRunnerConfig());
  }
  const keptConfigs = restrictToCoordinatorKeepList ? configs.filter((config2) => isCoordinatorKeepListSubagentType(getSubagentTypeName(config2.subagent_type))) : configs;
  if (!restrictToCoordinatorKeepList) {
    for (const customSubagent of customSubagents) {
      keptConfigs.push(customSubagentToConfig(customSubagent, enableNestedSubagents ?? false));
    }
  }
  const resolvedConfigs = keptConfigs.map((config2) => applySubagentModelOverride(config2, subagentModelOverrides)).filter((config2) => config2 !== void 0).map(applyDefaultSubagentSource).map(applyDefaultSystemReminder);
  if (resolvedConfigs.length === 0) {
    return [
      applyDefaultSystemReminder(applyDefaultSubagentSource(getDefaultSubagentConfig(enableNestedSubagents ?? false)))
    ];
  }
  return resolvedConfigs;
}
function findSubagentModelOverride(overrides, subagentType) {
  const normalizedSubagentType = normalizeSubagentTypeName(subagentType);
  return overrides?.[subagentType] ?? Object.entries(overrides ?? {}).find(([overrideSubagentType]) => normalizeSubagentTypeName(overrideSubagentType) === normalizedSubagentType)?.[1];
}
function applyDefaultSubagentSource(config2) {
  if (config2.subagentSource !== void 0 && config2.subagentSource !== "") {
    return config2;
  }
  if (config2.pluginId !== void 0 || config2.plugin !== void 0) {
    return { ...config2, subagentSource: "plugin" };
  }
  if (config2.subagent_type.type.case === "custom") {
    return { ...config2, subagentSource: "unknown" };
  }
  return { ...config2, subagentSource: "builtin" };
}
function applySubagentModelOverride(config2, overrides) {
  if (config2.subagent_type.type.case === "custom") {
    return config2;
  }
  const override = findSubagentModelOverride(overrides, getSubagentTypeName(config2.subagent_type));
  if (!override) {
    return config2;
  }
  switch (override.type) {
    case "disabled":
      return void 0;
    case "inherit":
      return {
        ...config2,
        defaultModelIds: void 0,
        inheritParentModel: true,
        userRequestedModelId: void 0
      };
    case "model":
      return {
        ...config2,
        defaultModelIds: void 0,
        inheritParentModel: void 0,
        userRequestedModelId: override.modelId
      };
  }
  const _exhaustive = override;
  return _exhaustive;
}
function createBestOfNRunnerConfig() {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "custom",
        value: new SubagentTypeCustom({ name: BEST_OF_N_RUNNER_SUBAGENT_TYPE })
      }
    }),
    description: "Run a task in an isolated git worktree. Each best-of-n-runner gets its own branch and working directory. Use for best-of-N parallel attempts or isolated experiments.",
    preserveTaskTool: false,
    subagentSource: "builtin"
  };
}
function applyDefaultSystemReminder(config2) {
  const existingReminder = config2.systemReminder;
  if (existingReminder === void 0) {
    return {
      ...config2,
      systemReminder: () => DEFAULT_SUBAGENT_SYSTEM_REMINDER
    };
  }
  return {
    ...config2,
    systemReminder: (toolSetHandle) => {
      const trimmedReminder = existingReminder(toolSetHandle).trim();
      return trimmedReminder.length > 0 ? `${DEFAULT_SUBAGENT_SYSTEM_REMINDER}

${trimmedReminder}` : DEFAULT_SUBAGENT_SYSTEM_REMINDER;
    }
  };
}
function findSubagentConfigByName(configs, name17) {
  const normalizedInput = normalizeSubagentTypeName(name17);
  return configs.find((config2) => {
    const configName = getSubagentTypeName(config2.subagent_type);
    const normalizedConfigName = normalizeSubagentTypeName(configName);
    return normalizedConfigName === normalizedInput;
  });
}
function getDefaultSubagentConfig(preserveTaskTool) {
  return {
    subagent_type: new SubagentType({
      type: {
        case: "unspecified",
        value: new SubagentTypeUnspecified()
      }
    }),
    description: "General-purpose agent for researching complex questions, searching for code, and executing multi-step tasks. Use when searching for a keyword or file and not confident you'll find the match quickly.",
    preserveTaskTool
  };
}
function applyToolsOverride(config2, callerTools, props, modelId) {
  const filteredCallerTools = config2.preserveTaskTool ? callerTools : callerTools.filter((tool) => tool.toolIdentifier !== "TASK");
  const overriddenTools = config2.toolsOverride ? config2.toolsOverride(filteredCallerTools, props, modelId) : filteredCallerTools;
  return overriddenTools.filter((tool) => tool.toolIdentifier !== "ASK_QUESTION" && !(tool.toolIdentifier === "PLATFORM_ACTION" && isSubagentExcludedPlatformCommunicationToolName(tool.name)));
}
function applyConversationStateMapping(config2, callerState) {
  if (config2.conversationStateMapper) {
    return config2.conversationStateMapper(callerState);
  }
  return new ConversationStateStructure();
}
