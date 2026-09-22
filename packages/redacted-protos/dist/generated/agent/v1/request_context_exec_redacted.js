init_esm();
init_request_context_exec_pb();
function toRedactedGitRepoInfo(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    status: createRedactedString(msg.status, DataClassification.CODE, "status", privacyMode),
    branchName: createRedactedString(msg.branchName, DataClassification.PATH, "branch_name", privacyMode),
    remoteUrl: msg.remoteUrl !== void 0 ? createRedactedString(msg.remoteUrl, DataClassification.PATH, "remote_url", privacyMode) : void 0,
    previousBranchIsAncestor: msg.previousBranchIsAncestor,
    isOriginBacked: msg.isOriginBacked
  };
}
function fromRedactedGitRepoInfo(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GitRepoInfo({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    status: msg.status.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    branchName: msg.branchName.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    remoteUrl: msg.remoteUrl?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    previousBranchIsAncestor: msg.previousBranchIsAncestor,
    isOriginBacked: msg.isOriginBacked
  });
}
function toRedactedRequestContextEnv(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    osVersion: msg.osVersion,
    workspacePaths: msg.workspacePaths.map((v2) => createRedactedString(v2, DataClassification.PATH, "workspace_paths", privacyMode)),
    shell: msg.shell,
    sandboxEnabled: msg.sandboxEnabled,
    terminalsFolder: createRedactedString(msg.terminalsFolder, DataClassification.PATH, "terminals_folder", privacyMode),
    agentSharedNotesFolder: createRedactedString(msg.agentSharedNotesFolder, DataClassification.PATH, "agent_shared_notes_folder", privacyMode),
    agentConversationNotesFolder: createRedactedString(msg.agentConversationNotesFolder, DataClassification.PATH, "agent_conversation_notes_folder", privacyMode),
    timeZone: msg.timeZone,
    projectFolder: createRedactedString(msg.projectFolder, DataClassification.PATH, "project_folder", privacyMode),
    agentTranscriptsFolder: createRedactedString(msg.agentTranscriptsFolder, DataClassification.PATH, "agent_transcripts_folder", privacyMode),
    artifactsFolder: msg.artifactsFolder !== void 0 ? createRedactedString(msg.artifactsFolder, DataClassification.PATH, "artifacts_folder", privacyMode) : void 0,
    sandboxSupported: msg.sandboxSupported,
    sandboxNetworkHasDefaults: msg.sandboxNetworkHasDefaults,
    sandboxNetworkExplicitAllowlist: msg.sandboxNetworkExplicitAllowlist,
    secretRedactionEnabled: msg.secretRedactionEnabled,
    computerUseSupported: msg.computerUseSupported,
    isWorkingDirHomeDir: msg.isWorkingDirHomeDir,
    processWorkingDirectory: msg.processWorkingDirectory !== void 0 ? createRedactedString(msg.processWorkingDirectory, DataClassification.PATH, "process_working_directory", privacyMode) : void 0,
    smartModeClassifierAutoModeEnabled: msg.smartModeClassifierAutoModeEnabled,
    devForceNextSmartModeClassifierBlockToken: msg.devForceNextSmartModeClassifierBlockToken !== void 0 ? createRedactedString(msg.devForceNextSmartModeClassifierBlockToken, DataClassification.CREDENTIALS, "dev_force_next_smart_mode_classifier_block_token", privacyMode) : void 0,
    devDelayNextSmartModeClassifierToken: msg.devDelayNextSmartModeClassifierToken !== void 0 ? createRedactedString(msg.devDelayNextSmartModeClassifierToken, DataClassification.CREDENTIALS, "dev_delay_next_smart_mode_classifier_token", privacyMode) : void 0,
    mountedAgentStores: msg.mountedAgentStores.map((v2) => toRedactedMountedAgentStore(v2, privacyMode)),
    userAgentStoreWebContext: msg.userAgentStoreWebContext !== void 0 ? toRedactedUserAgentStoreWebContext(msg.userAgentStoreWebContext, privacyMode) : void 0,
    devMockPromptTime: msg.devMockPromptTime !== void 0 ? msg.devMockPromptTime.toDate() : void 0
  };
}
function fromRedactedRequestContextEnv(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RequestContextEnv({
    osVersion: msg.osVersion,
    workspacePaths: msg.workspacePaths.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    shell: msg.shell,
    sandboxEnabled: msg.sandboxEnabled,
    terminalsFolder: msg.terminalsFolder.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    agentSharedNotesFolder: msg.agentSharedNotesFolder.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    agentConversationNotesFolder: msg.agentConversationNotesFolder.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    timeZone: msg.timeZone,
    projectFolder: msg.projectFolder.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    agentTranscriptsFolder: msg.agentTranscriptsFolder.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    artifactsFolder: msg.artifactsFolder?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    sandboxSupported: msg.sandboxSupported,
    sandboxNetworkHasDefaults: msg.sandboxNetworkHasDefaults,
    sandboxNetworkExplicitAllowlist: msg.sandboxNetworkExplicitAllowlist,
    secretRedactionEnabled: msg.secretRedactionEnabled,
    computerUseSupported: msg.computerUseSupported,
    isWorkingDirHomeDir: msg.isWorkingDirHomeDir,
    processWorkingDirectory: msg.processWorkingDirectory?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    smartModeClassifierAutoModeEnabled: msg.smartModeClassifierAutoModeEnabled,
    devForceNextSmartModeClassifierBlockToken: msg.devForceNextSmartModeClassifierBlockToken?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    devDelayNextSmartModeClassifierToken: msg.devDelayNextSmartModeClassifierToken?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    mountedAgentStores: msg.mountedAgentStores.map((v2) => fromRedactedMountedAgentStore(v2, purpose, opts)),
    userAgentStoreWebContext: msg.userAgentStoreWebContext !== void 0 ? fromRedactedUserAgentStoreWebContext(msg.userAgentStoreWebContext, purpose, opts) : void 0,
    devMockPromptTime: msg.devMockPromptTime !== void 0 ? Timestamp.fromDate(msg.devMockPromptTime) : void 0
  });
}
function toRedactedMountedAgentStore(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    kind: msg.kind,
    alias: msg.alias !== void 0 ? createRedactedString(msg.alias, DataClassification.PATH, "alias", privacyMode) : void 0,
    readOnly: msg.readOnly,
    inheritedFromPath: msg.inheritedFromPath !== void 0 ? createRedactedString(msg.inheritedFromPath, DataClassification.PATH, "inherited_from_path", privacyMode) : void 0
  };
}
function fromRedactedMountedAgentStore(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new MountedAgentStore({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    kind: msg.kind,
    alias: msg.alias?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    readOnly: msg.readOnly,
    inheritedFromPath: msg.inheritedFromPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedUserAgentStoreWebContext(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    storeId: msg.storeId,
    portalBaseUrl: msg.portalBaseUrl
  };
}
function fromRedactedUserAgentStoreWebContext(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UserAgentStoreWebContext({
    storeId: msg.storeId,
    portalBaseUrl: msg.portalBaseUrl
  });
}
function toRedactedDebugModeConfig(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    logPath: createRedactedString(msg.logPath, DataClassification.PATH, "log_path", privacyMode),
    serverEndpoint: msg.serverEndpoint,
    sessionId: msg.sessionId
  };
}
function fromRedactedDebugModeConfig(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DebugModeConfig({
    logPath: msg.logPath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    serverEndpoint: msg.serverEndpoint,
    sessionId: msg.sessionId
  });
}
function toRedactedSkillDescriptor(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: msg.name,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode),
    folderPath: createRedactedString(msg.folderPath, DataClassification.PATH, "folder_path", privacyMode),
    enabled: msg.enabled,
    parseError: msg.parseError !== void 0 ? createRedactedString(msg.parseError, DataClassification.CODE, "parse_error", privacyMode) : void 0,
    readmeFilePath: createRedactedString(msg.readmeFilePath, DataClassification.PATH, "readme_file_path", privacyMode),
    packageType: msg.packageType
  };
}
function fromRedactedSkillDescriptor(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SkillDescriptor({
    name: msg.name,
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    folderPath: msg.folderPath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    enabled: msg.enabled,
    parseError: msg.parseError?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    readmeFilePath: msg.readmeFilePath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    packageType: msg.packageType
  });
}
function toRedactedSkillOptions(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    skillDescriptors: msg.skillDescriptors.map((v2) => toRedactedSkillDescriptor(v2, privacyMode))
  };
}
function fromRedactedSkillOptions(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SkillOptions({
    skillDescriptors: msg.skillDescriptors.map((v2) => fromRedactedSkillDescriptor(v2, purpose, opts))
  });
}
function toRedactedHooksConfigInfo(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    configuredSteps: msg.configuredSteps
  };
}
function fromRedactedHooksConfigInfo(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new HooksConfigInfo({
    configuredSteps: msg.configuredSteps
  });
}
function toRedactedPermissionsAutoRunInstructions(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    allowInstructions: msg.allowInstructions.map((v2) => createRedactedString(v2, DataClassification.CODE, "allow_instructions", privacyMode)),
    blockInstructions: msg.blockInstructions.map((v2) => createRedactedString(v2, DataClassification.CODE, "block_instructions", privacyMode))
  };
}
function fromRedactedPermissionsAutoRunInstructions(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PermissionsAutoRunInstructions({
    allowInstructions: msg.allowInstructions.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    blockInstructions: msg.blockInstructions.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }))
  });
}
function toRedactedPrecomputedHumanChangeRenderedDiff(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    startLineNumber: msg.startLineNumber,
    endLineNumberExclusive: msg.endLineNumberExclusive,
    beforeContextLines: msg.beforeContextLines.map((v2) => createRedactedString(v2, DataClassification.CODE, "before_context_lines", privacyMode)),
    removedLines: msg.removedLines.map((v2) => createRedactedString(v2, DataClassification.CODE, "removed_lines", privacyMode)),
    addedLines: msg.addedLines.map((v2) => createRedactedString(v2, DataClassification.CODE, "added_lines", privacyMode)),
    afterContextLines: msg.afterContextLines.map((v2) => createRedactedString(v2, DataClassification.CODE, "after_context_lines", privacyMode))
  };
}
function fromRedactedPrecomputedHumanChangeRenderedDiff(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrecomputedHumanChangeRenderedDiff({
    startLineNumber: msg.startLineNumber,
    endLineNumberExclusive: msg.endLineNumberExclusive,
    beforeContextLines: msg.beforeContextLines.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    removedLines: msg.removedLines.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    addedLines: msg.addedLines.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    afterContextLines: msg.afterContextLines.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }))
  });
}
function toRedactedPrecomputedHumanChange(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    renderedDiffs: msg.renderedDiffs.map((v2) => toRedactedPrecomputedHumanChangeRenderedDiff(v2, privacyMode)),
    isNewFile: msg.isNewFile,
    isDeletedFile: msg.isDeletedFile
  };
}
function fromRedactedPrecomputedHumanChange(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrecomputedHumanChange({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    renderedDiffs: msg.renderedDiffs.map((v2) => fromRedactedPrecomputedHumanChangeRenderedDiff(v2, purpose, opts)),
    isNewFile: msg.isNewFile,
    isDeletedFile: msg.isDeletedFile
  });
}
function toRedactedRequestContext(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    rules: msg.rules.map((v2) => toRedactedCursorRule(v2, privacyMode)),
    env: msg.env !== void 0 ? toRedactedRequestContextEnv(msg.env, privacyMode) : void 0,
    repositoryInfo: msg.repositoryInfo.map((v2) => toRedactedRepositoryIndexingInfo(v2, privacyMode)),
    tools: msg.tools.map((v2) => toRedactedMcpToolDefinition(v2, privacyMode)),
    conversationNotesListing: msg.conversationNotesListing !== void 0 ? createRedactedString(msg.conversationNotesListing, DataClassification.CODE, "conversation_notes_listing", privacyMode) : void 0,
    sharedNotesListing: msg.sharedNotesListing !== void 0 ? createRedactedString(msg.sharedNotesListing, DataClassification.CODE, "shared_notes_listing", privacyMode) : void 0,
    gitRepos: msg.gitRepos.map((v2) => toRedactedGitRepoInfo(v2, privacyMode)),
    projectLayouts: msg.projectLayouts.map((v2) => toRedactedLsDirectoryTreeNode(v2, privacyMode)),
    mcpInstructions: msg.mcpInstructions.map((v2) => toRedactedMcpInstructions(v2, privacyMode)),
    debugModeConfig: msg.debugModeConfig !== void 0 ? toRedactedDebugModeConfig(msg.debugModeConfig, privacyMode) : void 0,
    cloudRule: msg.cloudRule !== void 0 ? createRedactedString(msg.cloudRule, DataClassification.CODE, "cloud_rule", privacyMode) : void 0,
    webSearchEnabled: msg.webSearchEnabled,
    skillOptions: msg.skillOptions !== void 0 ? toRedactedSkillOptions(msg.skillOptions, privacyMode) : void 0,
    repositoryInfoShouldQueryProd: msg.repositoryInfoShouldQueryProd,
    fileContents: new Map(Object.entries(msg.fileContents).map(([k2, v2]) => [createRedactedString(k2, DataClassification.PATH, "file_contents", privacyMode), createRedactedString(v2, DataClassification.CODE, "file_contents", privacyMode)])),
    userIntentSummary: msg.userIntentSummary !== void 0 ? createRedactedString(msg.userIntentSummary, DataClassification.CODE, "user_intent_summary", privacyMode) : void 0,
    customSubagents: msg.customSubagents.map((v2) => toRedactedCustomSubagent(v2, privacyMode)),
    mcpFileSystemOptions: msg.mcpFileSystemOptions !== void 0 ? toRedactedMcpFileSystemOptions(msg.mcpFileSystemOptions, privacyMode) : void 0,
    webFetchEnabled: msg.webFetchEnabled,
    hooksAdditionalContext: msg.hooksAdditionalContext !== void 0 ? createRedactedString(msg.hooksAdditionalContext, DataClassification.CODE, "hooks_additional_context", privacyMode) : void 0,
    commitAttributionMessage: msg.commitAttributionMessage !== void 0 ? createRedactedString(msg.commitAttributionMessage, DataClassification.CODE, "commit_attribution_message", privacyMode) : void 0,
    prAttributionMessage: msg.prAttributionMessage !== void 0 ? createRedactedString(msg.prAttributionMessage, DataClassification.CODE, "pr_attribution_message", privacyMode) : void 0,
    hooksConfig: msg.hooksConfig !== void 0 ? toRedactedHooksConfigInfo(msg.hooksConfig, privacyMode) : void 0,
    agentSkills: msg.agentSkills.map((v2) => toRedactedAgentSkill(v2, privacyMode)),
    precomputedHumanChanges: msg.precomputedHumanChanges.map((v2) => toRedactedPrecomputedHumanChange(v2, privacyMode)),
    recentlyAddedPlugin: msg.recentlyAddedPlugin !== void 0 ? toRedactedRecentlyAddedPlugin(msg.recentlyAddedPlugin, privacyMode) : void 0,
    supportsMcpAuth: msg.supportsMcpAuth,
    gitRepoInfoComplete: msg.gitRepoInfoComplete,
    mcpMetaToolOptions: msg.mcpMetaToolOptions !== void 0 ? toRedactedMcpMetaToolOptions(msg.mcpMetaToolOptions, privacyMode) : void 0,
    readLintsEnabled: msg.readLintsEnabled,
    mcpInfoComplete: msg.mcpInfoComplete,
    nonFileRules: msg.nonFileRules.map((v2) => toRedactedCursorRule(v2, privacyMode)),
    matchedInstalledPlugin: msg.matchedInstalledPlugin !== void 0 ? toRedactedMatchedInstalledPlugin(msg.matchedInstalledPlugin, privacyMode) : void 0,
    rulesInfoComplete: msg.rulesInfoComplete,
    envInfoComplete: msg.envInfoComplete,
    repositoryInfoComplete: msg.repositoryInfoComplete,
    customSubagentsInfoComplete: msg.customSubagentsInfoComplete,
    agentSkillsInfoComplete: msg.agentSkillsInfoComplete,
    mcpFileSystemInfoComplete: msg.mcpFileSystemInfoComplete,
    gitStatusInfoComplete: msg.gitStatusInfoComplete,
    userPermissionsAutoRun: msg.userPermissionsAutoRun !== void 0 ? toRedactedPermissionsAutoRunInstructions(msg.userPermissionsAutoRun, privacyMode) : void 0,
    projectPermissionsAutoRun: msg.projectPermissionsAutoRun !== void 0 ? toRedactedPermissionsAutoRunInstructions(msg.projectPermissionsAutoRun, privacyMode) : void 0,
    adminPermissionsAutoRun: msg.adminPermissionsAutoRun !== void 0 ? toRedactedPermissionsAutoRunInstructions(msg.adminPermissionsAutoRun, privacyMode) : void 0,
    disabledTeamRules: msg.disabledTeamRules.map((v2) => createRedactedString(v2, DataClassification.PATH, "disabled_team_rules", privacyMode)),
    searchConversationsEnabled: msg.searchConversationsEnabled,
    sendMessageEnabled: msg.sendMessageEnabled,
    adminCommandDenylist: msg.adminCommandDenylist.map((v2) => createRedactedString(v2, DataClassification.CODE, "admin_command_denylist", privacyMode)),
    systemPromptOverride: msg.systemPromptOverride !== void 0 ? toRedactedSystemPromptSpec(msg.systemPromptOverride, privacyMode) : void 0
  };
}
function fromRedactedRequestContext(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RequestContext({
    rules: msg.rules.map((v2) => fromRedactedCursorRule(v2, purpose, opts)),
    env: msg.env !== void 0 ? fromRedactedRequestContextEnv(msg.env, purpose, opts) : void 0,
    repositoryInfo: msg.repositoryInfo.map((v2) => fromRedactedRepositoryIndexingInfo(v2, purpose, opts)),
    tools: msg.tools.map((v2) => fromRedactedMcpToolDefinition(v2, purpose, opts)),
    conversationNotesListing: msg.conversationNotesListing?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    sharedNotesListing: msg.sharedNotesListing?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    gitRepos: msg.gitRepos.map((v2) => fromRedactedGitRepoInfo(v2, purpose, opts)),
    projectLayouts: msg.projectLayouts.map((v2) => fromRedactedLsDirectoryTreeNode(v2, purpose, opts)),
    mcpInstructions: msg.mcpInstructions.map((v2) => fromRedactedMcpInstructions(v2, purpose, opts)),
    debugModeConfig: msg.debugModeConfig !== void 0 ? fromRedactedDebugModeConfig(msg.debugModeConfig, purpose, opts) : void 0,
    cloudRule: msg.cloudRule?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    webSearchEnabled: msg.webSearchEnabled,
    skillOptions: msg.skillOptions !== void 0 ? fromRedactedSkillOptions(msg.skillOptions, purpose, opts) : void 0,
    repositoryInfoShouldQueryProd: msg.repositoryInfoShouldQueryProd,
    fileContents: Object.fromEntries(Array.from(msg.fileContents.entries()).map(([k2, v2]) => [k2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }), v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })])),
    userIntentSummary: msg.userIntentSummary?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    customSubagents: msg.customSubagents.map((v2) => fromRedactedCustomSubagent(v2, purpose, opts)),
    mcpFileSystemOptions: msg.mcpFileSystemOptions !== void 0 ? fromRedactedMcpFileSystemOptions(msg.mcpFileSystemOptions, purpose, opts) : void 0,
    webFetchEnabled: msg.webFetchEnabled,
    hooksAdditionalContext: msg.hooksAdditionalContext?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    commitAttributionMessage: msg.commitAttributionMessage?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    prAttributionMessage: msg.prAttributionMessage?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    hooksConfig: msg.hooksConfig !== void 0 ? fromRedactedHooksConfigInfo(msg.hooksConfig, purpose, opts) : void 0,
    agentSkills: msg.agentSkills.map((v2) => fromRedactedAgentSkill(v2, purpose, opts)),
    precomputedHumanChanges: msg.precomputedHumanChanges.map((v2) => fromRedactedPrecomputedHumanChange(v2, purpose, opts)),
    recentlyAddedPlugin: msg.recentlyAddedPlugin !== void 0 ? fromRedactedRecentlyAddedPlugin(msg.recentlyAddedPlugin, purpose, opts) : void 0,
    supportsMcpAuth: msg.supportsMcpAuth,
    gitRepoInfoComplete: msg.gitRepoInfoComplete,
    mcpMetaToolOptions: msg.mcpMetaToolOptions !== void 0 ? fromRedactedMcpMetaToolOptions(msg.mcpMetaToolOptions, purpose, opts) : void 0,
    readLintsEnabled: msg.readLintsEnabled,
    mcpInfoComplete: msg.mcpInfoComplete,
    nonFileRules: msg.nonFileRules.map((v2) => fromRedactedCursorRule(v2, purpose, opts)),
    matchedInstalledPlugin: msg.matchedInstalledPlugin !== void 0 ? fromRedactedMatchedInstalledPlugin(msg.matchedInstalledPlugin, purpose, opts) : void 0,
    rulesInfoComplete: msg.rulesInfoComplete,
    envInfoComplete: msg.envInfoComplete,
    repositoryInfoComplete: msg.repositoryInfoComplete,
    customSubagentsInfoComplete: msg.customSubagentsInfoComplete,
    agentSkillsInfoComplete: msg.agentSkillsInfoComplete,
    mcpFileSystemInfoComplete: msg.mcpFileSystemInfoComplete,
    gitStatusInfoComplete: msg.gitStatusInfoComplete,
    userPermissionsAutoRun: msg.userPermissionsAutoRun !== void 0 ? fromRedactedPermissionsAutoRunInstructions(msg.userPermissionsAutoRun, purpose, opts) : void 0,
    projectPermissionsAutoRun: msg.projectPermissionsAutoRun !== void 0 ? fromRedactedPermissionsAutoRunInstructions(msg.projectPermissionsAutoRun, purpose, opts) : void 0,
    adminPermissionsAutoRun: msg.adminPermissionsAutoRun !== void 0 ? fromRedactedPermissionsAutoRunInstructions(msg.adminPermissionsAutoRun, purpose, opts) : void 0,
    disabledTeamRules: msg.disabledTeamRules.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    searchConversationsEnabled: msg.searchConversationsEnabled,
    sendMessageEnabled: msg.sendMessageEnabled,
    adminCommandDenylist: msg.adminCommandDenylist.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    systemPromptOverride: msg.systemPromptOverride !== void 0 ? fromRedactedSystemPromptSpec(msg.systemPromptOverride, purpose, opts) : void 0
  });
}
function toRedactedRequestContextPartReferences(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    rulesBlobId: msg.rulesBlobId,
    rulesByteLength: msg.rulesByteLength,
    skillsBlobId: msg.skillsBlobId,
    skillsByteLength: msg.skillsByteLength,
    subagentsBlobId: msg.subagentsBlobId,
    subagentsByteLength: msg.subagentsByteLength,
    mcpsBlobId: msg.mcpsBlobId,
    mcpsByteLength: msg.mcpsByteLength,
    dynamicContext: msg.dynamicContext !== void 0 ? toRedactedRequestContext(msg.dynamicContext, privacyMode) : void 0
  };
}
function toRedactedRecentlyAddedPlugin(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    displayName: msg.displayName,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode),
    skills: msg.skills.map((v2) => toRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, privacyMode)),
    subagents: msg.subagents.map((v2) => toRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, privacyMode)),
    hooks: msg.hooks.map((v2) => toRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, privacyMode)),
    rules: msg.rules.map((v2) => toRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, privacyMode)),
    commands: msg.commands.map((v2) => toRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, privacyMode)),
    mcpServers: msg.mcpServers
  };
}
function fromRedactedRecentlyAddedPlugin(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecentlyAddedPlugin({
    displayName: msg.displayName,
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    skills: msg.skills.map((v2) => fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, purpose, opts)),
    subagents: msg.subagents.map((v2) => fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, purpose, opts)),
    hooks: msg.hooks.map((v2) => fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, purpose, opts)),
    rules: msg.rules.map((v2) => fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, purpose, opts)),
    commands: msg.commands.map((v2) => fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, purpose, opts)),
    mcpServers: msg.mcpServers
  });
}
function toRedactedRecentlyAddedPlugin_CapabilityDescriptor(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: msg.name,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode)
  };
}
function fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecentlyAddedPlugin_CapabilityDescriptor({
    name: msg.name,
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedMatchedInstalledPlugin(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    displayName: msg.displayName,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode),
    matchedKeyword: msg.matchedKeyword,
    skills: msg.skills.map((v2) => toRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, privacyMode)),
    subagents: msg.subagents.map((v2) => toRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, privacyMode)),
    hooks: msg.hooks.map((v2) => toRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, privacyMode)),
    rules: msg.rules.map((v2) => toRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, privacyMode)),
    commands: msg.commands.map((v2) => toRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, privacyMode)),
    mcpServers: msg.mcpServers
  };
}
function fromRedactedMatchedInstalledPlugin(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new MatchedInstalledPlugin({
    displayName: msg.displayName,
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    matchedKeyword: msg.matchedKeyword,
    skills: msg.skills.map((v2) => fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, purpose, opts)),
    subagents: msg.subagents.map((v2) => fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, purpose, opts)),
    hooks: msg.hooks.map((v2) => fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, purpose, opts)),
    rules: msg.rules.map((v2) => fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, purpose, opts)),
    commands: msg.commands.map((v2) => fromRedactedRecentlyAddedPlugin_CapabilityDescriptor(v2, purpose, opts)),
    mcpServers: msg.mcpServers
  });
}
