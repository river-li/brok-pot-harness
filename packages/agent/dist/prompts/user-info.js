var SKILL_GLOB_PATTERNS = [
  "**/.cursor/skills/**",
  "**/.cursor/skills-cursor/**",
  "**/.claude/skills/**",
  "**/.codex/skills/**",
  "**/.grok/skills/**",
  "**/.claude/plugins/**",
  "**/.agents/skills/**",
  "**/SKILL.md",
  "**/.cursor/plugins/cache/**/skills/**"
];
function isSkillPath(path31) {
  const normalizedPath = path31.replace(/\\/g, "/");
  return SKILL_GLOB_PATTERNS.some((pattern) => minimatch(normalizedPath, pattern, { dot: true }));
}
var GIT_STATUS_CHARACTER_LIMIT = 1e4;
var REQUEST_CONTEXT_COMPLETENESS_KEYS = [
  "rules",
  "env",
  "repositoryInfo",
  "customSubagents",
  "agentSkills",
  "gitRepos",
  "gitStatus",
  "mcp",
  "mcpFileSystem"
];
function getRequestContextCompleteness(requestContext) {
  return {
    rules: requestContext.rulesInfoComplete !== false,
    env: requestContext.envInfoComplete !== false,
    repositoryInfo: requestContext.repositoryInfoComplete !== false,
    customSubagents: requestContext.customSubagentsInfoComplete !== false,
    agentSkills: requestContext.agentSkillsInfoComplete !== false,
    gitRepos: requestContext.gitRepoInfoComplete !== false,
    gitStatus: requestContext.gitStatusInfoComplete !== false,
    mcp: requestContext.mcpInfoComplete !== false,
    mcpFileSystem: requestContext.mcpFileSystemInfoComplete !== false
  };
}
function isRequestContextComplete(completeness) {
  return REQUEST_CONTEXT_COMPLETENESS_KEYS.every((key) => completeness[key]);
}
function requestContextCompletenessScore(completeness) {
  return REQUEST_CONTEXT_COMPLETENESS_KEYS.filter((key) => completeness[key]).length;
}
function requestContextCompletenessIsStrictlyMoreComplete(previous, current) {
  const neverRegressed = REQUEST_CONTEXT_COMPLETENESS_KEYS.every((key) => previous[key] === false || current[key] === true);
  return neverRegressed && requestContextCompletenessScore(current) > requestContextCompletenessScore(previous);
}
function parseRequestContextCompletenessMetadata(value) {
  if (typeof value !== "object" || value === null) {
    return void 0;
  }
  const record2 = value;
  const parsed2 = {};
  for (const key of REQUEST_CONTEXT_COMPLETENESS_KEYS) {
    const item = record2[key];
    if (typeof item !== "boolean") {
      return void 0;
    }
    parsed2[key] = item;
  }
  return parsed2;
}
function shouldRerenderUserInfoForRequestContextRecovery(params) {
  if (params.previousCompleteness === void 0 || isRequestContextComplete(params.previousCompleteness)) {
    return false;
  }
  return requestContextCompletenessIsStrictlyMoreComplete(params.previousCompleteness, params.currentCompleteness);
}
function parseUserInfoSummarizationEpochMetadata(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : void 0;
}
function shouldRerenderUserInfoAfterSummarization(params) {
  if (!params.hasUserInfo) {
    return false;
  }
  const previousEpoch = params.previousEpoch ?? 0;
  return params.currentEpoch > previousEpoch;
}
var SEP3 = "/";
function sanitizeRemoteUrlForPrompt(remoteUrl) {
  const trimmedRemoteUrl = remoteUrl.trim();
  if (trimmedRemoteUrl === "") {
    return trimmedRemoteUrl;
  }
  try {
    const parsedRemoteUrl = new URL(trimmedRemoteUrl);
    parsedRemoteUrl.username = "";
    parsedRemoteUrl.password = "";
    return parsedRemoteUrl.toString();
  } catch {
    return trimmedRemoteUrl;
  }
}
function getRuleDir2(mdcPath) {
  const normalizedPath = normalizeToUnixPath(mdcPath);
  const literalRuleDir = normalizeToUnixPath((0, import_node_path83.normalize)((0, import_node_path83.dirname)(normalizedPath)));
  const segments = literalRuleDir.split(SEP3);
  for (let i = segments.length - 2; i >= 0; i--) {
    if (segments[i] === ".cursor" && segments[i + 1] === "rules") {
      const parentSegments = segments.slice(0, i);
      if (parentSegments.length === 0) {
        return SEP3;
      }
      return parentSegments.join(SEP3);
    }
  }
  return literalRuleDir;
}
function MountedAgentStoresSection({ stores }) {
  const userStore = stores.find((store) => store.kind === MountedAgentStoreKind.PRINCIPAL && store.alias === AGENT_STORE_USER_MOUNT_NAME);
  const hasReadOnlyStores = stores.some((store) => store.readOnly);
  const describeStore = (store) => {
    const readOnlySuffix = store.readOnly ? " (read-only)" : "";
    const quotedAlias = store.alias !== void 0 && store.alias.length > 0 ? ` "${store.alias}"` : "";
    switch (store.kind) {
      case MountedAgentStoreKind.SELF:
        return `Current agent's store: ${store.path}${readOnlySuffix}`;
      case MountedAgentStoreKind.PRINCIPAL:
        switch (store.alias) {
          case AGENT_STORE_USER_MOUNT_NAME:
            return `User's personal store: ${store.path}${readOnlySuffix}`;
          case AGENT_STORE_TEAM_MOUNT_NAME:
            return `Current team's shared store: ${store.path}${readOnlySuffix}`;
          case AGENT_STORE_AUTOMATION_MOUNT_NAME:
            return `Current automation's shared store: ${store.path}${readOnlySuffix}`;
          case NAMED_AGENT_HOME_STORE_MOUNT_NAME:
            return `Current named agent's shared home store: ${store.path}${readOnlySuffix}`;
          default:
            return `${store.path}${readOnlySuffix}`;
        }
      case MountedAgentStoreKind.PEER:
        return `Peer agent store${quotedAlias}: ${store.path}${readOnlySuffix}`;
      case MountedAgentStoreKind.SHARE:
        return `Shared store${quotedAlias}: ${store.path}${readOnlySuffix}`;
      default:
        return `${store.path}${readOnlySuffix}`;
    }
  };
  return jsxs("p", { children: ["Available persistent agent stores:", jsx("br", {}), stores.map((store) => `- ${describeStore(store)}`).join("\n"), jsx("br", {}), hasReadOnlyStores ? "Use normal file tools with these absolute paths. Stores marked (read-only) must not be written to; all other stores support reads and writes. " : "Use normal file tools with these absolute paths to read or write store contents. ", userStore !== void 0 && `When the user says "my user store" or "my personal store," use ${userStore.path}. `, "Only use stores listed here; omitted stores are unavailable."] });
}
var CURSOR_WORKTREE_NOTE = `You are operating in a Cursor worktree, do not edit files outside of it unless explicitly asked to do so by the user.`;
var NON_PRIMARY_WORKTREE_NOTE = `If editing a git workspace within your current directory, do not search or edit non-primary worktrees unless the user explicitly requests you to do so.`;
var HOME_DIR_WORKTREE_NOTE = `This applies especially to Cursor-managed worktrees in ~/.cursor/worktrees.`;
function buildFriendlyDate(date6, timeZone) {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "long",
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
    const parts = formatter.formatToParts(date6);
    const partLookup = {};
    for (const part of parts) {
      if (part.type === "literal") {
        continue;
      }
      partLookup[part.type] = part.value;
    }
    const weekday = partLookup.weekday;
    const month = partLookup.month;
    const day = partLookup.day;
    const year = partLookup.year;
    if (weekday && month && day && year) {
      const normalizedDay = Number.parseInt(day, 10).toString();
      return `${weekday} ${month} ${normalizedDay}, ${year}`;
    }
  } catch {
  }
  return void 0;
}
function getFriendlyDateForTimeZone(timeZone, mockNow) {
  const now = mockNow ?? /* @__PURE__ */ new Date();
  const formatted = buildFriendlyDate(now, timeZone);
  if (formatted) {
    return formatted;
  }
  const fallbackFormatted = buildFriendlyDate(now, void 0);
  if (fallbackFormatted) {
    return fallbackFormatted;
  }
  return now.toISOString().split("T")[0];
}
function truncateGitStatus(status) {
  if (!status)
    return "";
  if (status.length <= GIT_STATUS_CHARACTER_LIMIT)
    return status;
  let truncated = status.slice(0, GIT_STATUS_CHARACTER_LIMIT);
  const lastNewlineIndex = truncated.lastIndexOf("\n");
  if (lastNewlineIndex > 0) {
    truncated = truncated.slice(0, lastNewlineIndex);
  }
  return `${truncated}

... (git status truncated)`;
}
function getAgentRequestableRuleDescription(rule, ruleDir) {
  if (rule.type?.type.case === "fileGlobbed") {
    const globPattern = rule.type?.type.value.globs.join(", ");
    return `${getFirstNonEmptyLine(rule.content ?? "")}, glob pattern(s) for applicable files: ${globPattern}`;
  } else if (rule.type?.type.case === "agentFetched") {
    return rule.type?.type.value.description;
  } else if (rule.type?.type.case === "global") {
    return `${getFirstNonEmptyLine(rule.content ?? "")}, applicable for all files within ${ruleDir}`;
  }
  return void 0;
}
function UserInfoSection({ env, dsv3, mode, hasGitRepos, gitRepoInfoComplete, gitRepos, todaysDate, terminalsFolder, agentSharedNotesFolder, agentConversationNotesFolder, metaAgentNotesDirectory, metaAgentNotesEnabled, displayTodaysDate, displayGitRepoStatusLine, agentStorePathsAdvertisedInPromptEnabled, agentStorePrincipalAutoMount }) {
  const knownRepoText = hasGitRepos ? gitRepos.length > 1 ? `at:
${gitRepos.map((r) => `- ${r.path}`).join("\n")}` : `at ${gitRepos[0].path}` : "";
  const gitRepoStatusText = gitRepoInfoComplete === false ? hasGitRepos ? `Yes (potentially incomplete while git repository detection is still warming), currently found ${knownRepoText}` : "Unknown (git repository detection still warming)" : hasGitRepos ? `Yes, ${knownRepoText}` : "No";
  const shouldShowNonPrimaryWorktreeWarning = !hasGitRepos && gitRepoInfoComplete !== false;
  const allMountedAgentStores = env.mountedAgentStores ?? [];
  const mountedAgentStores = allMountedAgentStores.filter((store) => {
    const isPrincipalStore = store.kind === MountedAgentStoreKind.PRINCIPAL;
    if (isPrincipalStore && store.alias === AGENT_STORE_TEAM_MOUNT_NAME) {
      return false;
    }
    return agentStorePathsAdvertisedInPromptEnabled || !(isPrincipalStore && store.alias === AGENT_STORE_USER_MOUNT_NAME);
  });
  const hasUserAgentStore = mountedAgentStores.some((store) => store.kind === MountedAgentStoreKind.PRINCIPAL && store.alias === AGENT_STORE_USER_MOUNT_NAME);
  const hasAutomationAgentStore = allMountedAgentStores.some((store) => store.kind === MountedAgentStoreKind.PRINCIPAL && store.alias === AGENT_STORE_AUTOMATION_MOUNT_NAME);
  const showMountedAgentStores = hasUserAgentStore || agentStorePrincipalAutoMount !== true && !hasAutomationAgentStore && mountedAgentStores.some((store) => store.kind === MountedAgentStoreKind.SELF);
  if (dsv3) {
    const shouldShowAgentNotesPaths = mode === AgentMode.PROJECT || metaAgentNotesEnabled === true;
    return jsxs("section", { title: "user_info", children: [jsxs("p", { children: ["OS Version: ", env.osVersion] }), jsxs("p", { children: ["Shell: ", env.shell ?? "bash"] }), env.workspacePaths.length > 1 ? jsxs("p", { children: ["Workspace Paths:", jsx("br", {}), env.workspacePaths.map((p2) => `- ${p2}`).join("\n")] }) : env.workspacePaths.length === 1 ? jsxs("p", { children: ["Workspace Path: ", env.workspacePaths[0], isWorktreesPath(env.workspacePaths[0]) && jsxs(Fragment, { children: [jsx("br", {}), CURSOR_WORKTREE_NOTE] }), shouldShowNonPrimaryWorktreeWarning && jsxs(Fragment, { children: [jsx("br", {}), NON_PRIMARY_WORKTREE_NOTE] }), shouldShowNonPrimaryWorktreeWarning && env.isWorkingDirHomeDir === true && jsxs(Fragment, { children: [jsx("br", {}), HOME_DIR_WORKTREE_NOTE] })] }) : jsx("p", { children: "Workspace Path: unknown" }), displayGitRepoStatusLine && jsxs("p", { children: ["Is directory a git repo: ", gitRepoStatusText] }), terminalsFolder && jsxs("p", { children: ["Terminals folder: ", terminalsFolder] }), showMountedAgentStores && jsx(MountedAgentStoresSection, { stores: mountedAgentStores }), displayTodaysDate && jsxs("p", { children: ["Today's date: ", todaysDate] }), shouldShowAgentNotesPaths && metaAgentNotesEnabled !== true && agentSharedNotesFolder && jsxs("p", { children: ["Agent shared notes folder: ", agentSharedNotesFolder] }), shouldShowAgentNotesPaths && (metaAgentNotesEnabled === true ? metaAgentNotesDirectory : agentConversationNotesFolder) && jsx("p", { children: metaAgentNotesEnabled === true ? `Meta-agent notes folder: ${metaAgentNotesDirectory}` : `Agent conversation notes folder: ${agentConversationNotesFolder}` }), jsx("p", { children: "Note: Prefer using absolute paths over relative paths as tool call args when possible." })] });
  }
  return jsxs("section", { title: "user_info", children: [jsxs("p", { children: ["OS Version: ", env.osVersion] }), jsxs("p", { children: ["Shell: ", env.shell ?? "bash"] }), env.workspacePaths.length > 1 ? jsxs("p", { children: ["Workspace Paths:", jsx("br", {}), env.workspacePaths.map((p2) => `- ${p2}`).join("\n")] }) : env.workspacePaths.length === 1 ? jsxs("p", { children: ["Workspace Path: ", env.workspacePaths[0], isWorktreesPath(env.workspacePaths[0]) && jsxs(Fragment, { children: [jsx("br", {}), CURSOR_WORKTREE_NOTE] }), shouldShowNonPrimaryWorktreeWarning && jsxs(Fragment, { children: [jsx("br", {}), NON_PRIMARY_WORKTREE_NOTE] }), shouldShowNonPrimaryWorktreeWarning && env.isWorkingDirHomeDir === true && jsxs(Fragment, { children: [jsx("br", {}), HOME_DIR_WORKTREE_NOTE] })] }) : jsx("p", { children: "Workspace Path: unknown" }), displayGitRepoStatusLine && jsxs("p", { children: ["Is directory a git repo: ", gitRepoStatusText] }), displayTodaysDate && jsxs("p", { children: ["Today's date: ", todaysDate] }), terminalsFolder && jsxs("p", { children: ["Terminals folder: ", terminalsFolder] }), showMountedAgentStores && jsx(MountedAgentStoresSection, { stores: mountedAgentStores }), agentSharedNotesFolder && metaAgentNotesEnabled !== true && jsxs("p", { children: ["Agent shared notes folder: ", agentSharedNotesFolder] }), (metaAgentNotesEnabled === true ? metaAgentNotesDirectory : agentConversationNotesFolder) && jsx("p", { children: metaAgentNotesEnabled === true ? `Meta-agent notes folder: ${metaAgentNotesDirectory}` : `Agent conversation notes folder: ${agentConversationNotesFolder}` })] });
}
function MetaAgentProjectNotesDirectorySection({ notesDirectory }) {
  return jsx("section", { title: "project_notes_directory", children: formatMetaAgentNotesDirectoryInstruction(notesDirectory) });
}
function resolveMetaAgentNotesDirectory(props) {
  if (props.metaAgentNotesEnabled !== true) {
    return void 0;
  }
  const conversationNotesFolder = props.agentConversationNotesFolder;
  if (conversationNotesFolder && conversationNotesFolder.length > 0) {
    return props.agentConversationNotesFolder;
  }
  const notesSessionId = props.notesSessionId;
  const projectFolder = props.env?.projectFolder;
  if (notesSessionId && notesSessionId.length > 0 && projectFolder && projectFolder.length > 0) {
    return (0, import_node_path83.join)(projectFolder, "agent-notes", notesSessionId);
  }
  return void 0;
}
function wrapGitStatusInCodeFence(status) {
  const trimmed = status.trim();
  if (trimmed === "") {
    return "";
  }
  return `\`\`\`
${trimmed}
\`\`\``;
}
function GitStatusSection({ gitRepos, gitReposWithStatus, initialWorkingDirectory, agentType, toolInfo }) {
  const statusNote = "This is the git status at the start of the conversation. Note that this status is a snapshot in time, and will not update during the conversation.";
  const initialWd = initialWorkingDirectory !== void 0 && initialWorkingDirectory.trim() !== "" ? initialWorkingDirectory.trim() : void 0;
  const cloudMultiRepoFirstSentence = agentType === AgentType.BACKGROUND && gitRepos.length > 1 ? "This cloud workspace has multiple independent git repositories, each listed below with its own status." : void 0;
  const cloudMultiRepoExplanation = cloudMultiRepoFirstSentence !== void 0 ? initialWd !== void 0 ? `${cloudMultiRepoFirstSentence} The agent process initial working directory is ${initialWd}.` : cloudMultiRepoFirstSentence : void 0;
  const isCloudMultiRepo = agentType === AgentType.BACKGROUND && gitRepos.length > 1;
  const shouldShowRemoteUrls = isCloudMultiRepo && toolInfo?.allTools.PR_MANAGEMENT !== void 0;
  const reposWithStatusPaths = new Set(gitReposWithStatus.map((repo) => repo.path));
  const reposToDisplay = shouldShowRemoteUrls ? deduplicateRepos(gitRepos, gitReposWithStatus) : gitReposWithStatus;
  return jsxs("section", { title: "git_status", children: [jsx("p", { children: statusNote }), cloudMultiRepoExplanation !== void 0 && jsx("p", { children: cloudMultiRepoExplanation }), reposToDisplay.map((repo, index) => {
    const remoteUrl = shouldShowRemoteUrls && repo.remoteUrl !== void 0 && repo.remoteUrl.trim() !== "" ? sanitizeRemoteUrlForPrompt(repo.remoteUrl) : void 0;
    const hasStatus = reposWithStatusPaths.has(repo.path);
    return jsxs(Fragment, { children: [index > 0 && jsx("br", {}), jsx("br", {}), jsxs("p", { children: ["Git repo: ", repo.path, remoteUrl !== void 0 && ` (remote: ${remoteUrl})`] }), hasStatus && wrapGitStatusInCodeFence(truncateGitStatus(repo.status))] });
  })] });
}
function deduplicateRepos(gitRepos, gitReposWithStatus) {
  const statusPaths = new Set(gitReposWithStatus.map((r) => r.path));
  const extras = gitRepos.filter((r) => !statusPaths.has(r.path) && r.remoteUrl !== void 0 && r.remoteUrl.trim() !== "");
  return [...gitReposWithStatus, ...extras];
}
function AgentTranscriptsSection({ agentTranscriptsFolder, agentType, enableAgentChatLinks }) {
  const isIDE = agentType === AgentType.IDE;
  const citationInstruction = isIDE ? [
    `cite parent chat transcripts to the user as [<title for chat <=6 words>](<uuid excluding .jsonl>).${enableAgentChatLinks ? "" : " Do not cite subagent transcript files from this folder."}`,
    `Don't discuss the folder structure.`
  ].join(" ") : `Don't cite the file directly to the user.`;
  return jsx("section", { title: "agent_transcripts", children: jsxs("p", { children: ["Agent transcripts (past chats) live in ", agentTranscriptsFolder, ". They have names like ", "<uuid>", ".jsonl, ", citationInstruction] }) });
}
function AlwaysAppliedWorkspaceRulesSection({ globalRules }) {
  return jsx("section", { title: "always_applied_workspace_rules", description: "These are workspace-level rules that the agent must always follow.", children: globalRules.map((rule) => jsx("x", { tag: "always_applied_workspace_rule", name: rule.fullPath, children: rule.content })) });
}
function AgentRequestableWorkspaceRulesSection({ agentRequestableRules, readToolName }) {
  const description10 = readToolName ? `These are workspace-level rules that the agent should follow. Use the ${readToolName} tool to fetch full contents from the provided absolute path. Read each rule file using the ${readToolName} tool when it is relevant to your work.` : "These are workspace-level rules that the agent should follow. Fetch full contents from the provided absolute path.";
  return jsx("section", { title: "agent_requestable_workspace_rules", description: description10, children: agentRequestableRules.map((rule) => {
    const mdcPath = rule.fullPath;
    const ruleDir = getRuleDir2(mdcPath);
    const description11 = getAgentRequestableRuleDescription(rule, ruleDir);
    return jsx("x", { tag: "agent_requestable_workspace_rule", fullPath: rule.fullPath, children: description11 });
  }) });
}
function AgentSkillsSectionLayout({ skillItems, omittedNotice, hasOmittedSkills, hasListedSkills = skillItems.length > 0, raw, readToolName, isGpt56 }) {
  const skillsDescription = readToolName ? `Skills the agent can use. Use the ${readToolName} tool with the provided absolute path to fetch full contents.` : "Skills the agent can use. Fetch full contents from the provided absolute path.";
  if (raw) {
    return jsxs("section", { title: "agent_skills", description: skillsDescription, children: [skillItems, omittedNotice] });
  }
  return jsxs("section", { title: "agent_skills", children: [isGpt56 ? jsxs(Fragment, { children: [jsxs("p", { children: ["When the user names a skill, use it faithfully as part of the current task.", readToolName ? ` Read the skill file using the ${readToolName} tool before following its instructions.` : " Read the skill file before following its instructions.", " ", "The user's instructions take precedence over skill guidance, and an invoked skill takes precedence over autonomous judgment where they do not conflict."] }), jsxs("p", { children: ["Tell the user in `commentary` when a skill causes a material action or pause. Before using a skill the user did not name, briefly explain why it is relevant and keep its use within the task's scope. Mention material effects in the final response, but do not cite skills you merely inspected.", " ", !hasListedSkills && hasOmittedSkills ? "No skills are listed below, but additional skills may exist in the directories shown in the skills section if a later task specifically requires discovering more skills." : hasOmittedSkills ? "Use the skills listed below. If a later task specifically requires discovering more skills, additional skills may exist in the directories shown in the skills section." : "Only use skills listed below."] })] }) : jsxs("p", { children: ["When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.", readToolName ? ` To use a skill, read the skill file at the provided absolute path using the ${readToolName} tool, then follow the instructions within.` : " To use a skill, read the skill file at the provided absolute path, then follow the instructions within.", " ", "When a skill is relevant, read and follow it IMMEDIATELY as your first action. NEVER just announce or mention a skill without actually reading and following it.", " ", !hasListedSkills && hasOmittedSkills ? "No skills are listed below, but additional skills may exist in the directories shown in the skills section if a later task specifically requires discovering more skills." : hasOmittedSkills ? "Use the skills listed below. If a later task specifically requires discovering more skills, additional skills may exist in the directories shown in the skills section." : "Only use skills listed below."] }), jsx("br", {}), jsxs("section", { title: "available_skills", description: skillsDescription, children: [skillItems, omittedNotice] }), jsx("br", {})] });
}
function renderAgentSkillItems(skills) {
  return skills.map((skill) => jsx("x", { tag: "agent_skill", fullPath: skill.fullPath, children: skill.description || void 0 }));
}
function OmittedSkillsNotice({ directories, omittedCount }) {
  return jsx("p", { children: `Additional skills omitted from this initial list (${omittedCount}). Directories containing omitted skills: ${directories.join(", ")}.` });
}
function BudgetedAgentSkillsSection({ skillItems, agentTokenLimit, raw, readToolName, isGpt56, protectLoopSkill }) {
  const budgetResult = applySkillCatalogBudget({
    skills: skillItems,
    agentTokenLimit,
    protectLoopSkill,
    renderSection: (skills, omittedNotice) => jsx(AgentSkillsSectionLayout, { skillItems: renderAgentSkillItems(skills), omittedNotice, hasOmittedSkills: omittedNotice !== void 0, raw, readToolName, isGpt56 }),
    renderOmittedNotice: (directories, omittedCount) => jsx(OmittedSkillsNotice, { directories, omittedCount })
  });
  return {
    section: budgetResult.section,
    skillCount: budgetResult.retainedCount,
    renderedEstimatedTokens: budgetResult.renderedEstimatedTokens,
    uncappedEstimatedTokens: budgetResult.uncappedEstimatedTokens,
    omittedSkillCount: budgetResult.omittedCount,
    strategy: budgetResult.strategy
  };
}
function toLegacySkillCatalogItems(skills) {
  return skills.map((rule) => {
    const ruleDir = getRuleDir2(rule.fullPath);
    return {
      fullPath: rule.fullPath,
      description: getAgentRequestableRuleDescription(rule, ruleDir)
    };
  });
}
function buildAvailableSkillsPromptSection(props, overrides) {
  const workspacePaths = props.env?.workspacePaths ?? [];
  const skills = overrides?.skills ?? categorizeCursorRules(props.cursorRules, workspacePaths, props.displayOptions?.agentType).skills;
  const computerUseSubagentSurface = props.displayOptions?.computerUseSubagentSurface === true;
  const agentSkillsFromProto = filterByAgentEnvironment(props.agentSkills ?? [], props.displayOptions?.agentType).filter((s3) => !s3.disableModelInvocation && !isFileScopedSkill(s3, workspacePaths));
  const useAgentSkillsProto = (props.agentSkills?.length ?? 0) > 0;
  const filteredAgentSkillsFromProto = computerUseSubagentSurface ? agentSkillsFromProto.filter((skill) => isComputerUseGuidedSkill(skill)) : agentSkillsFromProto;
  const filteredLegacySkills = computerUseSubagentSurface ? skills.filter((skill) => isComputerUseGuidedSkill({
    fullPath: skill.fullPath,
    description: getAgentRequestableRuleDescription(skill, getRuleDir2(skill.fullPath))
  })) : skills;
  const availableSkillCount = useAgentSkillsProto ? filteredAgentSkillsFromProto.length : filteredLegacySkills.length;
  const shouldRenderSection = availableSkillCount > 0 && (computerUseSubagentSurface || props.displayOptions?.displaySkills === true && props.displayOptions?.displayCursorRules !== false);
  if (!shouldRenderSection) {
    return { skillCount: 0 };
  }
  const protectLoopSkill = props.featureFlags?.protectLoopSkillDescription === true;
  const budgetedSection = useAgentSkillsProto ? BudgetedAgentSkillsSection({
    skillItems: filteredAgentSkillsFromProto.map((skill) => ({
      fullPath: skill.fullPath,
      description: skill.description || void 0
    })),
    agentTokenLimit: props.agentTokenLimit,
    readToolName: overrides?.readToolName,
    isGpt56: props.modelInfo?.isGpt56 === true,
    protectLoopSkill
  }) : BudgetedAgentSkillsSection({
    skillItems: toLegacySkillCatalogItems(filteredLegacySkills),
    agentTokenLimit: props.agentTokenLimit,
    readToolName: overrides?.readToolName,
    isGpt56: props.modelInfo?.isGpt56 === true,
    protectLoopSkill
  });
  return {
    section: budgetedSection.section,
    skillCount: budgetedSection.skillCount,
    renderedEstimatedTokens: budgetedSection.renderedEstimatedTokens,
    uncappedEstimatedTokens: budgetedSection.uncappedEstimatedTokens,
    omittedSkillCount: budgetedSection.omittedSkillCount,
    strategy: budgetedSection.strategy
  };
}
function buildComposer2CustomUserRuleRealEnvironment({ includeCommandExecutionEnforcement, includeDateAuthority }) {
  return [
    "IMPORTANT: This is a real environment with full shell access and network, not a simulated one.",
    "- You MUST run commands and use tools to investigate and solve problems yourself.",
    ...includeCommandExecutionEnforcement ? [
      "- You MUST NOT simply tell the user what to run \u2014 execute it yourself."
    ] : [],
    "- You MUST NOT give up after a single failure \u2014 try alternative approaches, or diagnose and retry.",
    ...includeDateAuthority ? [
      "- The `Today's date:` field in the user info section is authoritative: when giving the current date, or picking a date for search or knowledge retrieval, default to that year (2026); the year is **NOT** 2025."
    ] : [],
    ...includeCommandExecutionEnforcement ? [
      "- If you are about to write instructions for the user instead of executing them, execute or implement them yourself."
    ] : []
  ].join("\n");
}
var COMPOSER2_CUSTOM_USER_RULE_REAL_ENVIRONMENT = buildComposer2CustomUserRuleRealEnvironment({
  includeCommandExecutionEnforcement: true,
  includeDateAuthority: true
});
var MATTERHORN_TRAINING_CUSTOM_USER_RULE_REAL_ENVIRONMENT = buildComposer2CustomUserRuleRealEnvironment({
  includeCommandExecutionEnforcement: false,
  includeDateAuthority: false
});
var COMPOSER2_CUSTOM_USER_RULE_INSTRUCTION_FOLLOWING = `Follow ALL user, tool, system, and skill instructions precisely and completely:
- Think about ALL instructions in user rules, user queries, skills, system reminders, and MCP server/tool descriptions in FULL. Do NOT skip or only partially apply them.
- When a skill, rule, system reminder, or tool description specifies a particular format, output structure, naming convention, or step-by-step workflow, FOLLOW it \u2014 even if you think a different approach might be better.
- Pay special attention to constraints embedded in tool descriptions, skills, and MCP server instructions. These are not suggestions \u2014 they are requirements that govern how you must use each tool/skill.
- Skills are special files/instructions that users create to guide you in completing their tasks \u2014 they provide enormous value; find and use them when they are relevant rather than improvising without them.
- Users provide MCP tools to help you interact with or gather needed context from external sources \u2014 use them extensively when they fit the task.
`;
var MATTERHORN_TRAINING_CUSTOM_USER_RULE_SKILL_AND_MCP_REMINDER = `Remember to use skills and MCP tools:
- If there is a <manually_attached_skills> block, read and use the skills, especially if the user references one of the skills via a slash command, like \`/skillName\`. The slash command may also reference a skill in <agent_skills>.
- Always read and remember relevant skill and MCP tool descriptions.
- Prefer using skills and MCP tools over writing scripts.
- Report issues using skills and MCPs to the user.
`;
var COMPOSER2_CUSTOM_USER_RULE_USER_COMMUNICATION = `When communicating with the user:
- Use code citation blocks to reference existing code: \`\`\`startLine:endLine:filepath format. Code citations are strictly better than describing code in prose or stringing backticked identifiers together \u2014 they give the user one-click navigation and immediate context.
- Code citation fences (the opening \`\`\`) MUST be on their own line, never prefixed by list markers or other text on the same line. E.g. "- \`\`\`12:34:path" will render incorrectly.
- Inside fenced code blocks and inline backticked text, content is shown literally: do not use HTML character references (e.g. &amp;, &lt;) expecting them to become symbols \u2014 use the actual characters.
- In code citations, it is preferred to skip large irrelevant chunks of code using \`...\`, or pseudocode comments.
- In non-citation code blocks, especially when meant for copy-pasting suggested commands, write full commands \u2014 no \`...\` or other omissions.
- Users prefer markdown links for ease of navigation when referencing web content. When you cite paths or URLs (https://, s3://, file paths, etc.), give the full string; do not shorten or elide prefixes or middle segments for brevity.
- Write like an excellent technical blog post \u2014 precise, well-structured, and clear, in complete sentences. Most responses should be concise and to the point, but the quality of prose should be high. Never use telegraphic shorthand, or sentence fragment chains.
- Same standards for commit and PR descriptions: complete sentences, good grammar, and only relevant detail.
- Prefer simple, accessible language over dense technical jargon. Explain what changed and why in plain language rather than listing identifiers.
- Keep final responses proportional to task complexity. A simple CI fix doesn't need multiple paragraphs.
- Do not overuse bolding or backticks for decoration. Use them very sparingly for emphasis.
- Avoid "\xA7" in user-facing text (these don't render well in the product UI).
- Use mermaid and ascii diagrams to explain complex logic flows and architecture when appropriate \u2014 but not for simple changes.
- Avoid engagement baiting at the end of responses. If there are obvious follow ups, simply ask the user directly if they want those done, but do not force suggestions or follow ups in every response like 'say the word and I'll do X'.
- Mark todo items done as they are completed, and do not leave todos marked as in_progress if they are actually completed.`;
var MATTERHORN_TRAINING_CUSTOM_USER_RULE_USER_COMMUNICATION = `When communicating with the user:
- Use high quality prose with complete sentences, proper grammar, correct spelling, and punctuation. Be precise and clear, and ensure that ideas flow from sentence to sentence. Avoid stuttered phrasing, unnatural sentence structures, and shorthand.
- Do not write out comma-separated lists of more than 4 items in prose or parentheticals. When enumerating many items, use bulleted or numbered lists.
- Only use tables to display tabular data for visualization or analysis.
- Emphasize important concepts through word choice rather than bolding terms. Never bold terms in the middle of a sentence. Never bold an entire sentence or paragraph.
- Do not overuse bolding or backticks for decoration. Headings or short lead sentences are viable alternatives to bolding.
- Avoid using tilde to denote approximate numbers because these may be incorrectly parsed as strikeouts. Instead, use the word "approximately" or "about".
- Use code citation blocks to reference existing code: \`\`\`startLine:endLine:filepath format. Code citations are strictly better than describing code in prose or stringing backticked identifiers together \u2014 They give the user one-click navigation and immediate context.
- Prefer citing only the code file and line numbers in the final response instead of displaying the code content.
- Code citation fences (the opening \`\`\`) MUST be on their own line, never prefixed by list markers or other text on the same line. E.g. "- \`\`\`12:34:path" will render incorrectly.
- In code citations, it is preferred to skip large irrelevant chunks of code using \`...\`, or pseudocode comments.
- In non-citation code blocks, especially when meant for copy-pasting suggested commands, write full commands \u2014 Never use \`...\`, \u2026, or other omissions.
- Users prefer markdown links for ease of navigation when referencing web content. When you cite paths or URLs (https://, s3://, file paths, etc.), give the full string; do not shorten or elide prefixes or middle segments for brevity.
- When the user asks for one item per line, use Markdown hard line breaks with two trailing spaces.
- Before running any terminal commands that mutate the environment or long-running jobs, ALWAYS inform the user with a status update before running the command or job.
- Do not include tangential background details in the final response.
- Follow these communication rules by default, but adjust style and verbosity when explicitly requested by the user.`;
var COMPOSER2_CUSTOM_USER_RULE_CONVERSATION_INTENT = `Reason about conversation history to understand user intent:
- Think about every user query in light of the full conversation history. The latest message inherits context from prior turns \u2014 e.g. "How does this work?" after discussing edge cases likely means explaining that code's behavior around those edge cases, not a generic overview.
- Identify the user's underlying goal and implicit requirements from the arc of the conversation, not just the literal text of the latest message. Think about what they are trying to accomplish, what constraints they care about, and what they would consider a successful outcome.
- When the user sends a message mid-task, think carefully about whether it's a refinement of the current task or a genuine change of direction or new task. Default to treating it as guidance for the work in progress \u2014 users are more often steering than canceling.`;
var COMPOSER2_CUSTOM_USER_RULE_CODE_PRINCIPLES = `**Always follow these principles when writing code** (recall them in your thinking but don't mention them to the user):
1. Minimize scope \u2014 Use the simplest correct diff. Do not add or change unrelated or unrequested code, especially for question-only or review-only tasks. A focused 5-line change that solves the root problem is strictly better than a 100-line diff.
2. Avoid over-engineering - Do not over abstract the code, like adding one or two line helpers that should just be inline. Do not use excessive error handling or fallbacks for edges cases that are impossible or extremely unlikely.
3. Use existing conventions \u2014 Read the surrounding code before writing. Match its naming, types, abstractions, import style, and documentation level. Your additions should read as if written by the same author. Reuse and extend existing functions and components rather than reimplementing similar logic. When no convention exists, follow language and framework best practices.
4. Comments \u2014 Good code should mostly be self-explanatory. Only add comments that explain non-obvious business logic or deep technical details.
5. Useful tests only \u2014 Only add tests if requested or they add meaningful coverage of real behavior. Do not add tests that trivially assert the obvious.`;
function buildMatterhornShellToolUserRule(shellToolName) {
  return `When using ${shellToolName}:
- To run a command in the background, set \`block_until_ms: 0\` to immediately background (use for dev servers, watchers, or any long-running process).
- Never use '&' at the end of commands to background them.
- Do not kill a process unless explicitly requested by the user.
`;
}
function buildMatterhornAwaitToolUserRule(awaitToolName) {
  return `When using ${awaitToolName} on a background shell:
- Configure block_until_ms duration based on the expected time until the pattern appears, plus a small margin. Do not use a large default.
- Be defensive when considering duration. The command may unexpectedly hang or not match the pattern, so a high block_until_ms will block the user. Prefer checking in sooner rather than later.
- block_until_ms should be shorter than the time it would take the command to exit.
`;
}
function buildMatterhornGrepRule(grepToolName) {
  return `When using ${grepToolName}:
- NEVER glob every single file with "**/*", "**/**", or similar pattern.
`;
}
var COMPOSER2_CUSTOM_USER_RULES = [
  COMPOSER2_CUSTOM_USER_RULE_INSTRUCTION_FOLLOWING,
  COMPOSER2_CUSTOM_USER_RULE_REAL_ENVIRONMENT,
  COMPOSER2_CUSTOM_USER_RULE_USER_COMMUNICATION,
  COMPOSER2_CUSTOM_USER_RULE_CONVERSATION_INTENT,
  COMPOSER2_CUSTOM_USER_RULE_CODE_PRINCIPLES
];
var TAHOMA_USER_RULE_INTERVENTION = `
When writing a final response for the user, keep the following communication rules in mind:
- Communicate directly and concisely.
- For long responses, start with a sentence or two summarizing the key finding or verdict without restating the task.
- Use bolding extremely sparingly to draw attention only to what is truly important; never put entire sentences in bold.
- Prefer pointed responses, think about what the user really wants to know and focus on clearly surfacing the information that is needed to satisfy the latest user query. Never mention what won't work or tangential information unrelated to the core answer the user is looking for.
- Only provide thorough detail when requested. Prefer to keep it concise with a sentence or two if possible per point. Only expand into full sections when needed. Don't restate the bottom line in a dedicated section.
`;
function getComposer2CustomUserRulesForModel(modelInfo, featureFlags, options2) {
  const uiBrowserVerificationRule = shouldInjectUiBrowserVerificationPrompt(modelInfo) ? [UI_BROWSER_VERIFICATION_USER_RULE] : [];
  if (modelInfo?.isComposerMatterhorn === true && modelInfo?.isRawTrainingSlug === true) {
    return [...uiBrowserVerificationRule];
  }
  const tahomaInterventionRule = featureFlags?.enableTahomaUserRuleIntervention === true ? [TAHOMA_USER_RULE_INTERVENTION] : [];
  const vegaFrontendInterventionRule = featureFlags?.enableVegaFrontendUserRuleIntervention === true ? [VEGA_FRONTEND_USER_RULE_INTERVENTION] : [];
  const composer2CustomUserRules = featureFlags?.enableComposer2CustomUserRules === true ? COMPOSER2_CUSTOM_USER_RULES : [];
  if (modelInfo?.isComposerMatterhorn !== true) {
    return [
      ...composer2CustomUserRules,
      ...uiBrowserVerificationRule,
      ...vegaFrontendInterventionRule,
      ...tahomaInterventionRule
    ];
  }
  if (featureFlags?.enableComposer2CustomUserRules !== true) {
    return [
      ...uiBrowserVerificationRule,
      ...vegaFrontendInterventionRule,
      ...tahomaInterventionRule
    ];
  }
  const enableMatterhornPromptTweaks = featureFlags?.enableMatterhornPromptTweaks === true;
  const userCommunicationRule = enableMatterhornPromptTweaks ? MATTERHORN_TRAINING_CUSTOM_USER_RULE_USER_COMMUNICATION : COMPOSER2_CUSTOM_USER_RULE_USER_COMMUNICATION;
  const skillAndMcpReminderRule = enableMatterhornPromptTweaks ? [MATTERHORN_TRAINING_CUSTOM_USER_RULE_SKILL_AND_MCP_REMINDER] : [];
  const awaitToolName = options2?.awaitToolName;
  const awaitToolRule = enableMatterhornPromptTweaks && awaitToolName !== void 0 ? [buildMatterhornAwaitToolUserRule(awaitToolName)] : [];
  const shellToolName = options2?.shellToolName;
  const shellToolRule = enableMatterhornPromptTweaks && shellToolName !== void 0 ? [buildMatterhornShellToolUserRule(shellToolName)] : [];
  const grepToolName = options2?.grepToolName;
  const grepRule = enableMatterhornPromptTweaks && featureFlags?.enableGrepBroadGlobGuard === true && grepToolName !== void 0 ? [buildMatterhornGrepRule(grepToolName)] : [];
  return [
    COMPOSER2_CUSTOM_USER_RULE_INSTRUCTION_FOLLOWING,
    ...skillAndMcpReminderRule,
    MATTERHORN_TRAINING_CUSTOM_USER_RULE_REAL_ENVIRONMENT,
    userCommunicationRule,
    COMPOSER2_CUSTOM_USER_RULE_CONVERSATION_INTENT,
    COMPOSER2_CUSTOM_USER_RULE_CODE_PRINCIPLES,
    ...shellToolRule,
    ...grepRule,
    ...awaitToolRule,
    ...uiBrowserVerificationRule,
    ...vegaFrontendInterventionRule,
    ...tahomaInterventionRule
  ];
}
function stripWhitespace(s3) {
  return s3.replace(/\s+/g, "");
}
var MULTITASK_MODE_ENTER_REMINDER_SENTINEL = stripWhitespace(renderMultitaskModeEnterUserReminderInner("Task").slice(0, 40));
var COMPOSER2_RULES_PRESENCE_SENTINEL = stripWhitespace(COMPOSER2_CUSTOM_USER_RULE_INSTRUCTION_FOLLOWING);
var TAHOMA_USER_RULE_INTERVENTION_SENTINEL = stripWhitespace(TAHOMA_USER_RULE_INTERVENTION);
var VEGA_FRONTEND_USER_RULE_INTERVENTION_SENTINEL = stripWhitespace(VEGA_FRONTEND_USER_RULE_INTERVENTION);
var UI_BROWSER_VERIFICATION_USER_RULE_SENTINEL = stripWhitespace(UI_BROWSER_VERIFICATION_USER_RULE);
function userInfoHasAnyGeneratedCustomUserRules(content) {
  const stripped = stripWhitespace(content);
  return stripped.includes(COMPOSER2_RULES_PRESENCE_SENTINEL) || stripped.includes(TAHOMA_USER_RULE_INTERVENTION_SENTINEL) || stripped.includes(VEGA_FRONTEND_USER_RULE_INTERVENTION_SENTINEL) || stripped.includes(UI_BROWSER_VERIFICATION_USER_RULE_SENTINEL);
}
function userInfoHasExpectedCustomUserRules(content, modelInfo, featureFlags, options2) {
  const stripped = stripWhitespace(content);
  const resolvedFeatureFlags = {
    enableComposer2CustomUserRules: true,
    ...featureFlags
  };
  const rules = getComposer2CustomUserRulesForModel(modelInfo, resolvedFeatureFlags, options2);
  const strippedRules = rules.map(stripWhitespace);
  const expectsTahomaIntervention = featureFlags?.enableTahomaUserRuleIntervention === true;
  const hasTahomaIntervention = stripped.includes(TAHOMA_USER_RULE_INTERVENTION_SENTINEL);
  const expectsVegaFrontendIntervention = featureFlags?.enableVegaFrontendUserRuleIntervention === true;
  const hasVegaFrontendIntervention = stripped.includes(VEGA_FRONTEND_USER_RULE_INTERVENTION_SENTINEL);
  const expectsUiBrowserVerification = shouldInjectUiBrowserVerificationPrompt(modelInfo);
  const hasUiBrowserVerification = stripped.includes(UI_BROWSER_VERIFICATION_USER_RULE_SENTINEL);
  const expectsComposer2CustomRules = strippedRules.some((rule) => rule === COMPOSER2_RULES_PRESENCE_SENTINEL);
  const hasComposer2CustomRules = stripped.includes(COMPOSER2_RULES_PRESENCE_SENTINEL);
  if (hasTahomaIntervention !== expectsTahomaIntervention || hasVegaFrontendIntervention !== expectsVegaFrontendIntervention || hasUiBrowserVerification !== expectsUiBrowserVerification || hasComposer2CustomRules !== expectsComposer2CustomRules) {
    return false;
  }
  return rules.length > 0 && strippedRules.every((rule) => stripped.includes(rule));
}
function userInfoHasMultitaskModeEnterReminder(content) {
  return stripWhitespace(content).includes(MULTITASK_MODE_ENTER_REMINDER_SENTINEL);
}
function UserRulesSection({ userRules, composer2CustomUserRules = [] }) {
  return jsxs("section", { title: "user_rules", description: "These are rules set by the user that you should follow if appropriate.", children: [composer2CustomUserRules.map((rule, index) => jsx("x", { tag: "user_rule", children: rule }, index)), userRules.map((rule) => jsx("x", { tag: "user_rule", children: rule.content }))] });
}
function RulesSection({ globalRules, agentRequestableRules, userRules, readToolName, composer2CustomUserRules }) {
  const hasUserRules = userRules.length > 0 || composer2CustomUserRules.length > 0;
  return jsxs("section", { title: "rules", children: [jsx("p", { children: "The rules section has a number of possible rules/memories/context that you should consider. In each subsection, we provide instructions about what information the subsection contains and how you should consider/follow the contents of the subsection." }), jsx("br", {}), globalRules.length > 0 && jsx(AlwaysAppliedWorkspaceRulesSection, { globalRules }), agentRequestableRules.length > 0 && jsx(AgentRequestableWorkspaceRulesSection, { agentRequestableRules, readToolName }), hasUserRules && jsx(UserRulesSection, { userRules, composer2CustomUserRules }), jsx("br", {})] });
}
function buildRulesPromptSection(props, options2) {
  if (props.displayOptions?.displayCursorRules === false) {
    return { ruleCount: 0 };
  }
  const workspacePaths = props.env?.workspacePaths ?? [];
  const { globalRules, agentRequestableRules, userRules } = options2?.categorizedRules ?? categorizeCursorRules(props.cursorRules, workspacePaths, props.displayOptions?.agentType);
  const filteredAgentRequestableRules = agentRequestableRules.filter((rule) => !isFileScopedCursorRule(rule, workspacePaths));
  const isCloudAgentPrompt = props.backgroundAgentSource !== void 0;
  const resolvedAgentType = props.displayOptions?.agentType ?? props.agentType;
  const composerGitUserRules = !isCloudAgentPrompt && shouldInjectComposerGitUserRules(props.modelInfo, resolvedAgentType) && props.toolInfo?.allTools !== void 0 ? getComposerGitUserRules(props.toolInfo, props.featureFlags?.prCreationForgeGuidance === true) : [];
  const composer2CustomUserRules = getComposer2CustomUserRulesForModel(props.modelInfo, props.featureFlags, {
    awaitToolName: options2?.awaitToolName,
    shellToolName: options2?.shellToolName,
    grepToolName: options2?.grepToolName
  });
  const askQuestionToolName = props.toolInfo?.allTools?.ASK_QUESTION?.name ?? "AskQuestion";
  const antiAskQuestionUserRules = props.featureFlags?.enableAntiAskQuestionUserRule === true ? [buildAntiAskQuestionUserRule(askQuestionToolName)] : [];
  const customUserRules = [
    ...antiAskQuestionUserRules,
    ...composerGitUserRules,
    ...composer2CustomUserRules
  ];
  const hasRules = globalRules.length > 0 || filteredAgentRequestableRules.length > 0 || userRules.length > 0 || customUserRules.length > 0;
  if (!hasRules) {
    return { ruleCount: 0 };
  }
  return {
    section: jsx(RulesSection, { globalRules, agentRequestableRules: filteredAgentRequestableRules, userRules, readToolName: options2?.readToolName, composer2CustomUserRules: customUserRules }),
    ruleCount: globalRules.length + filteredAgentRequestableRules.length + userRules.length + customUserRules.length
  };
}
function CloudInstructionsSection({ cloudRuleContent }) {
  return jsxs("section", { title: "cloud_instructions", description: "Instructions pulled from AGENTS.md", children: [jsx("p", { children: "AGENTS.md contents:" }), jsx("br", {}), cloudRuleContent] });
}
function McpInstructionsSection({ mcpEntries }) {
  return jsx("section", { title: "mcp_instructions", description: "Instructions provided by MCP servers to help use them properly", children: mcpEntries.map((entry) => `Server: ${entry.serverName ?? "unknown"}
${entry.instructions}`).join("\n\n") });
}
function UserIntentSection({ content }) {
  return jsx("section", { title: "user_profile", description: "Summary of the user's work style and preferences. DO NOT mention this information in your responses, but use it to guide your responses and behavior when interacting with the user, and suggest next steps to the user if there is a matching workflow in the profile.", children: content });
}
function HooksAdditionalContextSection({ content }) {
  return jsx("section", { title: "hooks_context", description: "Additional context provided by session hooks. This may include project-specific information, configuration, or instructions from the user's hooks setup.", children: content });
}
function AutomationInstructionsSection({ content }) {
  return jsx("section", { title: "automation_instructions", children: content });
}
function McpMetaToolServersSection({ mcpMetaToolOptions, mcpInfoComplete }) {
  const useDynamicToolNamespaces = mcpMetaToolOptions.snapshotToolNames?.useDynamicToolNamespaces ?? false;
  const serverList = McpMetaToolServerList(mcpMetaToolOptions.mcpDescriptors, useDynamicToolNamespaces);
  if (serverList.length === 0 && mcpInfoComplete !== false) {
    return null;
  }
  return jsxs("section", { title: useDynamicToolNamespaces ? "dynamic_tool_catalog" : "mcp_server_catalog", children: [mcpInfoComplete === false && jsx("p", { children: useDynamicToolNamespaces ? "Dynamic namespace discovery is still warming. The namespace and tool list may be incomplete." : "MCP server discovery is still warming. The server and tool list below may be incomplete; additional servers may become available shortly." }), jsxs("p", { children: [useDynamicToolNamespaces ? "These dynamic tool namespaces were available when this conversation started. Availability may have changed, so " : "These were the available MCP servers and tools when this conversation started. Tool availability may have changed since then, so ", mcpMetaToolOptions.snapshotToolNames ? jsxs(Fragment, { children: ["use `", mcpMetaToolOptions.snapshotToolNames.discoveryToolName, "` to check current state before calling `", mcpMetaToolOptions.snapshotToolNames.invocationToolName, "`."] }) : jsx(Fragment, { children: "use the MCP tool-discovery meta tool to check current state before calling the MCP tool-invocation meta tool." })] }), serverList] });
}
function AvailableSubagentModelsSection({ description: description10 }) {
  return jsx("section", { title: "available_subagent_models", children: jsx("p", { children: description10 }) });
}
function AvailableSubagentTypesSection({ description: description10 }) {
  return jsx("section", { title: "available_subagent_types", children: jsx("p", { children: description10 }) });
}
function renderAvailableSubagentModelsSection(description10) {
  return renderContent(jsx(AvailableSubagentModelsSection, { description: description10 }));
}
function renderAvailableSubagentTypesSection(description10) {
  return renderContent(jsx(AvailableSubagentTypesSection, { description: description10 }));
}
function userInfoMatchesAvailableSubagentModels(content, description10) {
  if (description10 === void 0) {
    return !content.includes("<available_subagent_models>");
  }
  return content.includes(renderAvailableSubagentModelsSection(description10));
}
function userInfoMatchesAvailableSubagentTypes(content, description10) {
  if (description10 === void 0) {
    return !content.includes("<available_subagent_types>");
  }
  return content.includes(renderAvailableSubagentTypesSection(description10));
}
function UserInfoComponent({ props }) {
  const dropCustomPromptContext = props.featureFlags?.dropCustomPromptContext === true;
  const gitRepos = props.gitRepos ?? [];
  const hasGitRepos = gitRepos.length > 0;
  const gitRepoInfoComplete = props.gitRepoInfoComplete;
  const workspacePaths = props.env?.workspacePaths ?? [];
  const { globalRules, agentRequestableRules, userRules, skills } = categorizeCursorRules(props.cursorRules, workspacePaths, props.displayOptions?.agentType);
  const readToolName = props.toolInfo?.allTools?.READ?.name;
  const awaitToolName = props.toolInfo?.allTools?.AWAIT?.name;
  const shellToolName = props.toolInfo?.allTools?.SHELL?.name;
  const grepToolName = props.toolInfo?.allTools?.GREP?.name;
  const { section: rulesSection } = buildRulesPromptSection(props, {
    categorizedRules: {
      globalRules,
      agentRequestableRules,
      userRules,
      skills
    },
    readToolName,
    awaitToolName,
    shellToolName,
    grepToolName
  });
  const { section: availableSkillsSection } = buildAvailableSkillsPromptSection(props, {
    skills,
    readToolName
  });
  const todaysDate = getFriendlyDateForTimeZone(props.env?.timeZone, props.env?.devMockPromptTime?.toDate());
  const cloudRuleContent = props.cloudRule?.trim() ?? "";
  const disableMcpForRawMatterhorn = props.modelInfo?.isComposerMatterhorn === true && props.modelInfo?.isRawTrainingSlug === true;
  const mcpEntries = disableMcpForRawMatterhorn ? [] : (props.mcpInstructions ?? []).filter((i) => typeof i?.instructions === "string" && i.instructions.trim().length > 0);
  const shouldFilterEditToolsInAskMode = props.mode === AgentMode.ASK && (props.enableFilterEditToolsInAskMode ?? true);
  const shouldRestrictProjectWorkspace = props.mode === AgentMode.PROJECT || props.isRootProject === true;
  const mcpMetaToolOptions = shouldRestrictProjectWorkspace && props.mcpMetaToolOptions !== void 0 ? {
    ...props.mcpMetaToolOptions,
    mcpDescriptors: filterProjectWorkspaceMutationMcpDescriptors(props.mcpMetaToolOptions.mcpDescriptors)
  } : props.mcpMetaToolOptions;
  const shouldShowMcpMetaToolSnapshot = mcpMetaToolOptions?.enabled === true && mcpMetaToolOptions.mcpDescriptors.length > 0 && !disableMcpForRawMatterhorn && !shouldFilterEditToolsInAskMode;
  const dsv3McpMetaFullInstructionsBlock = props.dsv3 === true && shouldShowMcpMetaToolSnapshot && mcpMetaToolOptions !== void 0 ? McpMetaToolInstructions(mcpMetaToolOptions.mcpDescriptors, {
    discoveryToolName: mcpMetaToolOptions.snapshotToolNames?.discoveryToolName ?? "GetMcpTools",
    invocationToolName: mcpMetaToolOptions.snapshotToolNames?.invocationToolName ?? "CallMcpTool",
    useDynamicToolNamespaces: mcpMetaToolOptions.snapshotToolNames?.useDynamicToolNamespaces ?? false,
    ...mcpMetaToolOptions.snapshotToolNames?.fetchMcpResourceToolName ? {
      fetchMcpResourceToolName: mcpMetaToolOptions.snapshotToolNames.fetchMcpResourceToolName
    } : mcpMetaToolOptions.snapshotToolNames?.useDynamicToolNamespaces ? {} : { fetchMcpResourceToolName: "FetchMcpResource" },
    ...mcpMetaToolOptions.snapshotToolNames?.listMcpResourcesToolName ? {
      listMcpResourcesToolName: mcpMetaToolOptions.snapshotToolNames.listMcpResourcesToolName
    } : {}
  }) : "";
  const shouldShiftDsv3McpFilesInstructionsToUserMsg = props.featureFlags?.shiftDsv3McpFilesInstructionsToUserMsg === true;
  const mcpInstructionsForUserMsg = props.dsv3 === true && shouldShiftDsv3McpFilesInstructionsToUserMsg && !disableMcpForRawMatterhorn ? getDsv3McpFileSystemInstructions({
    mode: props.mode,
    enableFilterEditToolsInAskMode: props.enableFilterEditToolsInAskMode,
    mcpFileSystemOptions: props.mcpFileSystemOptions,
    // getDsv3McpFileSystemInstructions expects protobuf McpMetaToolOptions.
    // UserInfo carries an augmented shape for snapshot rendering.
    mcpMetaToolOptions: mcpMetaToolOptions ? {
      enabled: mcpMetaToolOptions.enabled,
      mcpDescriptors: mcpMetaToolOptions.mcpDescriptors
    } : void 0,
    featureFlags: props.featureFlags,
    modelInfo: props.modelInfo
  }) : "";
  const mcpInstructionsBlock = mcpInstructionsForUserMsg.length > 0 ? `

${mcpInstructionsForUserMsg}` : "";
  const gitReposWithStatus = gitRepos.filter((repo) => !!repo.status);
  const userIntentContent = props.userIntentSummary?.trim() ?? "";
  const includeOnlyUserInfoAndGitStatus = props.displayOptions?.includeOnlyUserInfoAndGitStatus === true;
  const displayTodaysDate = props.displayOptions?.displayTodaysDate !== false;
  const displayGitRepoStatusLine = props.displayOptions?.displayGitRepoStatusLine !== false;
  const useLocalAgentPrompting = props.useLocalAgentPrompting === true;
  const isNamedAgentHome = isNamedAgentHomePromptSession(props);
  const resolvedAgentType = useLocalAgentPrompting ? AgentType.IDE : props.agentType ?? props.displayOptions?.agentType;
  const initialWorkingDirectory = props.env?.processWorkingDirectory?.trim() || void 0;
  const previewSharingFormat = getPreviewSharingFormat({
    agentPreviewCard: props.featureFlags?.agentPreviewCard === true,
    modelInfo: props.modelInfo
  });
  const shouldRenderCloudTaskInstructions = props.designatedBranches !== void 0 && props.omitCloudWorkerProcedure !== true && !useLocalAgentPrompting && !isNamedAgentHome && props.displayOptions?.computerUseSubagentSurface !== true;
  const shouldRenderCoordinatorNewProjectGuidance = !shouldRenderCloudTaskInstructions && props.omitCloudWorkerProcedure === true && props.startedAsNewProject === true && props.designatedBranches !== void 0 && !useLocalAgentPrompting && !isNamedAgentHome && props.displayOptions?.computerUseSubagentSurface !== true;
  const metaAgentNotesDirectory = resolveMetaAgentNotesDirectory(props);
  if (includeOnlyUserInfoAndGitStatus) {
    return jsxs(Fragment, { children: [props.toolInfo?.availableSubagentTypesDescription !== void 0 && jsx(AvailableSubagentTypesSection, { description: props.toolInfo.availableSubagentTypesDescription }), props.toolInfo?.availableSubagentModelsDescription !== void 0 && jsx(AvailableSubagentModelsSection, { description: props.toolInfo.availableSubagentModelsDescription }), props.env !== void 0 && jsx(UserInfoSection, { env: props.env, dsv3: props.dsv3, mode: props.mode, hasGitRepos, gitRepoInfoComplete, gitRepos, todaysDate, terminalsFolder: props.terminalsFolder, agentSharedNotesFolder: props.agentSharedNotesFolder, agentConversationNotesFolder: props.agentConversationNotesFolder, metaAgentNotesDirectory, metaAgentNotesEnabled: props.metaAgentNotesEnabled, displayTodaysDate, displayGitRepoStatusLine, agentStorePathsAdvertisedInPromptEnabled: props.featureFlags?.agentStorePathsAdvertisedInPrompt === true, agentStorePrincipalAutoMount: props.featureFlags?.agentStorePrincipalAutoMount }), metaAgentNotesDirectory !== void 0 && jsx(MetaAgentProjectNotesDirectorySection, { notesDirectory: metaAgentNotesDirectory }), props.displayOptions?.displayGitStatus !== false && gitReposWithStatus.length > 0 && jsx(GitStatusSection, { gitRepos, gitReposWithStatus, initialWorkingDirectory, agentType: resolvedAgentType, toolInfo: props.toolInfo })] });
  }
  const computerUseSubagentSurface = props.displayOptions?.computerUseSubagentSurface === true;
  const composer2CloudTestingSections = !computerUseSubagentSurface && props.omitCloudWorkerProcedure !== true && getComposer2CloudTestingSectionsPlacement(props) === "user_info" ? getComposer2CloudTestingSectionElements({
    ...props,
    startedAsNewProject: props.startedAsNewProject === true
  }) : void 0;
  const automationInstructions = props.automationInstructions === void 0 ? void 0 : materializeAutomationMemoryInstruction(props.automationInstructions, props.env?.mountedAgentStores ?? []);
  return jsxs(Fragment, { children: [props.env !== void 0 && jsx(UserInfoSection, { env: props.env, dsv3: props.dsv3, mode: props.mode, hasGitRepos, gitRepoInfoComplete, gitRepos, todaysDate, terminalsFolder: props.terminalsFolder, agentSharedNotesFolder: props.agentSharedNotesFolder, agentConversationNotesFolder: props.agentConversationNotesFolder, metaAgentNotesDirectory, metaAgentNotesEnabled: props.metaAgentNotesEnabled, displayTodaysDate, displayGitRepoStatusLine, agentStorePathsAdvertisedInPromptEnabled: props.featureFlags?.agentStorePathsAdvertisedInPrompt === true, agentStorePrincipalAutoMount: props.featureFlags?.agentStorePrincipalAutoMount }), props.namedAgentSelfDocumentBlock !== void 0 && jsx("p", { children: props.namedAgentSelfDocumentBlock }), metaAgentNotesDirectory !== void 0 && jsx(MetaAgentProjectNotesDirectorySection, { notesDirectory: metaAgentNotesDirectory }), userIntentContent.length > 0 && jsx(UserIntentSection, { content: userIntentContent }), props.displayOptions?.displayGitStatus !== false && gitReposWithStatus.length > 0 && jsx(GitStatusSection, { gitRepos, gitReposWithStatus, initialWorkingDirectory, agentType: resolvedAgentType, toolInfo: props.toolInfo }), composer2CloudTestingSections?.gitAndSubmission, !props.displayOptions?.excludeAgentTranscripts && props.env?.agentTranscriptsFolder && // Don't show agent transcripts section for cloud agents - they use a different
  // mechanism (pastConversationExplorer subagent reads from /opt/cursor/past-transcripts/)
  props.displayOptions?.agentType !== AgentType.BACKGROUND && jsx(AgentTranscriptsSection, { agentTranscriptsFolder: props.env.agentTranscriptsFolder, agentType: props.displayOptions?.agentType, enableAgentChatLinks: props.featureFlags?.enableAgentChatLinks !== false }), !computerUseSubagentSurface && !dropCustomPromptContext && rulesSection, !computerUseSubagentSurface && props.toolInfo?.availableSubagentTypesDescription !== void 0 && jsx(AvailableSubagentTypesSection, { description: props.toolInfo.availableSubagentTypesDescription }), !computerUseSubagentSurface && props.toolInfo?.availableSubagentModelsDescription !== void 0 && jsx(AvailableSubagentModelsSection, { description: props.toolInfo.availableSubagentModelsDescription }), !dropCustomPromptContext && availableSkillsSection, !computerUseSubagentSurface && cloudRuleContent.length > 0 && props.useProjectCoordinatorPrompting !== true && jsx(CloudInstructionsSection, { cloudRuleContent }), composer2CloudTestingSections?.testing, composer2CloudTestingSections?.computerUse, shouldRenderCloudTaskInstructions && jsx(CloudTaskInstructions, {
    gitRepos,
    designatedBranches: props.designatedBranches,
    startedAsNewProject: props.startedAsNewProject === true,
    newProjectSeededEmptyRoot: props.newProjectSeededEmptyRoot === true,
    agentPreviewCard: props.featureFlags?.agentPreviewCard === true,
    preferMarkdownPreviewLink: previewSharingFormat === "markdown-link",
    // The model's markdown-link preference must not skip the
    // screenshot when the surface can't render the link substitute:
    // iOS-sourced runs have the preview card off AND
    // preferMarkdownPreviewLink resolves false (format "off"), so a
    // model-only skip here would strand them in the text-overview
    // branch. iOS always takes the screenshot branch instead.
    skipPreviewScreenshot: prefersMarkdownPreviewLink(props.modelInfo) && props.backgroundAgentSource !== BackgroundComposerSource.IOS_APP,
    agentPreviewCardSkipScreenshot: props.featureFlags?.agentPreviewCardSkipScreenshot === true,
    agentPreviewCardXmllint: props.featureFlags?.agentPreviewCardXmllint === true,
    artifactsDir: resolvePromptArtifactsDir({ env: props.env }),
    branchPrefix: props.branchPrefix,
    branchSuffix: props.branchSuffix,
    preferCurrentBranchInMultiPrMode: props.preferCurrentBranchInMultiPrMode,
    allowMultipleBranches: props.featureFlags?.backgroundComposerMultiPrs ?? false,
    toolInfo: props.toolInfo,
    staleBuildGitRefs: props.featureFlags?.cloudAgentStaleBuildGitRefs
  }), shouldRenderCoordinatorNewProjectGuidance && jsx("section", { title: "new_project_from_scratch", children: jsx(NewProjectFromScratchGuidance, {
    agentPreviewCard: props.featureFlags?.agentPreviewCard === true,
    preferMarkdownPreviewLink: previewSharingFormat === "markdown-link",
    // Same iOS carve-out as the CloudTaskInstructions mount above.
    skipPreviewScreenshot: prefersMarkdownPreviewLink(props.modelInfo) && props.backgroundAgentSource !== BackgroundComposerSource.IOS_APP,
    agentPreviewCardSkipScreenshot: props.featureFlags?.agentPreviewCardSkipScreenshot === true,
    agentPreviewCardXmllint: props.featureFlags?.agentPreviewCardXmllint === true,
    artifactsDir: resolvePromptArtifactsDir({ env: props.env }),
    seededEmptyRoot: props.newProjectSeededEmptyRoot === true,
    sendMessageToolName: props.toolInfo?.allTools.SEND_MESSAGE?.name
  }) }), !computerUseSubagentSurface && !dropCustomPromptContext && mcpInstructionsBlock, !computerUseSubagentSurface && !dropCustomPromptContext && dsv3McpMetaFullInstructionsBlock.length > 0 && dsv3McpMetaFullInstructionsBlock, !computerUseSubagentSurface && !dropCustomPromptContext && shouldShowMcpMetaToolSnapshot && props.dsv3 !== true && mcpMetaToolOptions !== void 0 && jsx(McpMetaToolServersSection, { mcpMetaToolOptions, mcpInfoComplete: props.mcpInfoComplete }), !computerUseSubagentSurface && !dropCustomPromptContext && !props.skipMcpInstructions && mcpEntries.length > 0 && jsx(McpInstructionsSection, { mcpEntries }), props.hooksAdditionalContext && props.hooksAdditionalContext.trim().length > 0 && jsx(HooksAdditionalContextSection, { content: props.hooksAdditionalContext }), automationInstructions !== void 0 && automationInstructions.trim().length > 0 && jsx(AutomationInstructionsSection, { content: automationInstructions })] });
}
var UserInfo = (props) => {
  return renderContent(jsx(UserInfoComponent, { props }));
};
function hasDisableModelInvocation(rule) {
  if (!rule.content) {
    return false;
  }
  try {
    const parsed2 = grayMatter(rule.content);
    return parsed2.data?.["disable-model-invocation"] === true;
  } catch {
    return false;
  }
}
function categorizeCursorRules(cursorRules, workspacePaths = [], agentType) {
  const filteredRules = filterByAgentEnvironment(cursorRules, agentType);
  const globalRules = [];
  const agentRequestableRules = [];
  const userRules = [];
  const skills = [];
  for (const rule of filteredRules) {
    const mdcPath = rule.fullPath;
    if (isSkillPath(mdcPath)) {
      if (rule.type?.type.case === "global") {
        globalRules.push(rule);
      } else if (!hasDisableModelInvocation(rule)) {
        skills.push(rule);
      }
      continue;
    }
    if (rule.source === CursorRuleSource.USER) {
      userRules.push(rule);
      continue;
    }
    if (rule.source === CursorRuleSource.TEAM) {
      if (rule.type?.type.case !== "fileGlobbed") {
        globalRules.push(rule);
      }
      continue;
    }
    if (rule.type?.type.case === "manuallyAttached") {
      continue;
    }
    if (rule.type?.type.case !== "global") {
      agentRequestableRules.push(rule);
      continue;
    }
    if (isFileScopedCursorRule(rule, workspacePaths)) {
      agentRequestableRules.push(rule);
    } else {
      globalRules.push(rule);
    }
  }
  return { globalRules, agentRequestableRules, userRules, skills };
}
