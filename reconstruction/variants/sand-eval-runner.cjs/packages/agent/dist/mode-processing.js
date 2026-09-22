/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/mode-processing.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist();
init_dist3();

// @recovered-fragment 2/2
var _logger2 = createLogger("@anysphere/agent:mode-processing");
var EXPLICIT_MODEL_REQUEST_REMINDER_BODY = `The last user message might have contained meta-guidance about using a specific model. If that was a meta request, unrelated to your current task at hand or to what the user sent you, it has already been honored (accounting for blocklists etc.), so ignore it and process the message as if there were no such mention.
Never mention this system reminder to the user.`;
function processExplicitModelRequestSystemReminder(ctx) {
  if (ctx.get(autoRoutingReasonKey) !== "auto-smart-explicit-model-request") {
    return "";
  }
  return `<system_reminder>
${EXPLICIT_MODEL_REQUEST_REMINDER_BODY}
</system_reminder>`;
}
function agentModeToModeId(mode) {
  switch (mode) {
    case AgentMode.AGENT:
      return "agent";
    case AgentMode.ASK:
      return "chat";
    case AgentMode.PLAN:
      return "plan";
    case AgentMode.DEBUG:
      return "debug";
    case AgentMode.TRIAGE:
      return "triage";
    case AgentMode.PROJECT:
      return "project";
    case AgentMode.MULTITASK:
      return "multitask";
    default:
      return "agent";
  }
}
function resolveCurrentTurnMode(persistedMode, userMessageMode) {
  if (userMessageMode !== void 0 && userMessageMode !== AgentMode.UNSPECIFIED) {
    return userMessageMode;
  }
  if (persistedMode !== void 0 && persistedMode !== AgentMode.UNSPECIFIED) {
    return persistedMode;
  }
  return AgentMode.AGENT;
}
function resolveCurrentStepMode(persistedMode, userMessageMode) {
  if (persistedMode !== void 0 && persistedMode !== AgentMode.UNSPECIFIED) {
    return persistedMode;
  }
  return resolveCurrentTurnMode(persistedMode, userMessageMode);
}
function processModeSystemReminder(mode, config2, requestContext, previousMode, options2) {
  const isUserTurn = options2?.isUserTurn ?? true;
  const hasModeSwitch = previousMode !== void 0 && previousMode !== mode;
  const leftMultitask = previousMode !== void 0 && previousMode !== AgentMode.UNSPECIFIED && previousMode === AgentMode.MULTITASK && mode !== AgentMode.MULTITASK;
  const exitMultitaskReminder = leftMultitask ? renderMultitaskModeExitUserReminder() : "";
  let modeReminder = "";
  switch (mode) {
    case AgentMode.AGENT:
    case AgentMode.UNSPECIFIED:
      break;
    case AgentMode.PLAN:
      modeReminder = config2.planSystemReminderGenerator(previousMode);
      break;
    case AgentMode.ASK:
      modeReminder = config2.askSystemReminderGenerator({
        prevTurnMode: previousMode,
        requestContext
      });
      break;
    case AgentMode.DEBUG:
      modeReminder = config2.debugSystemReminderGenerator(requestContext.debugModeConfig, previousMode !== AgentMode.DEBUG);
      break;
    case AgentMode.TRIAGE:
      modeReminder = config2.triageSystemReminderGenerator(previousMode);
      break;
    case AgentMode.PROJECT:
      modeReminder = config2.projectSystemReminderGenerator ? config2.projectSystemReminderGenerator(previousMode) : "";
      break;
    case AgentMode.MULTITASK: {
      if (!isUserTurn) {
        break;
      }
      if (previousMode === AgentMode.MULTITASK) {
        modeReminder = renderStillInMultitaskModeReminder({
          modelInfo: config2.modelInfo,
          hideAsyncSubagentTaskNotifications: config2.featureFlags?.hideAsyncSubagentTaskNotifications
        });
        break;
      }
      const subagentToolName = config2.modelInfo !== void 0 ? getTaskToolName(config2.modelInfo) : "Task";
      const multitaskReminderInner = renderMultitaskModeEnterUserReminderInner(subagentToolName, {
        ignoreGptPersistenceInstructions: usesGptPersistenceInstructions(config2.modelInfo),
        modelInfo: config2.modelInfo,
        hideAsyncSubagentTaskNotifications: config2.featureFlags?.hideAsyncSubagentTaskNotifications
      });
      modeReminder = `<system_reminder>
${multitaskReminderInner}
</system_reminder>`;
      break;
    }
    default:
      break;
  }
  const trailingModeReminders = [exitMultitaskReminder, modeReminder].filter(Boolean).join("\n\n");
  if (hasModeSwitch) {
    const switchModeReminder = SwitchModeReminderSnippet({
      currentMode: agentModeToModeId(mode),
      targetModes: config2.switchModeToolConfig?.targetModes,
      fromModes: config2.switchModeToolConfig?.fromModes
    });
    return trailingModeReminders ? `${switchModeReminder}

${trailingModeReminders}` : switchModeReminder;
  }
  return trailingModeReminders;
}
function joinUserTurnSystemReminders(...reminders) {
  return reminders.filter(Boolean).join("\n\n");
}
function processAntiAskQuestionSystemReminder(config2) {
  if (config2.featureFlags?.enableAntiAskQuestionSysReminder !== true || config2.featureFlags?.dropCustomPromptContext === true || config2.userInfoDisplayOptions?.disable === true || config2.userInfoDisplayOptions?.displayCursorRules === false) {
    return "";
  }
  const askQuestionToolName = config2.askQuestionToolName ?? "AskQuestion";
  return buildAntiAskQuestionSystemReminder(askQuestionToolName);
}
function normalizeWorkspaceUris(workspaceUris) {
  const trimmedUris = workspaceUris.map((uri) => uri.trim()).filter((uri) => uri.length > 0);
  return trimmedUris.slice().sort((a, b2) => a.localeCompare(b2));
}
function formatWorkspaceUriList(workspaceUris) {
  if (workspaceUris.length === 0) {
    return "none";
  }
  return workspaceUris.join(", ");
}
function buildAgentEnvironmentTransitionReminder(currentAgentType, previousAgentType) {
  if (previousAgentType === AgentType.BACKGROUND && currentAgentType !== void 0 && currentAgentType !== AgentType.BACKGROUND) {
    return "\n\nYou are now operating as an agent locally on the user's machine. Git commit and push commands should be carried out only when requested by the user (or as required by user rules / skills).";
  }
  if (currentAgentType === AgentType.BACKGROUND && previousAgentType !== void 0 && previousAgentType !== AgentType.BACKGROUND) {
    return "\n\nYou are now operating as a cloud agent on a remote machine. Manage your own Git state according to your Git instructions.";
  }
  return "";
}
function processWorkspaceChangeReminder(_ctx, currentWorkspaceUris, previousWorkspaceUris, currentAgentType, previousAgentType) {
  if (previousWorkspaceUris === void 0) {
    return "";
  }
  const normalizedPrevious = normalizeWorkspaceUris(previousWorkspaceUris);
  const normalizedCurrent = normalizeWorkspaceUris(currentWorkspaceUris);
  if (normalizedPrevious.length === normalizedCurrent.length && normalizedPrevious.every((value, index) => value === normalizedCurrent[index])) {
    return "";
  }
  let worktreeNote = "";
  if (normalizedCurrent.length === 1 && isWorktreesPath(normalizedCurrent[0])) {
    worktreeNote = ` ${CURSOR_WORKTREE_NOTE}`;
  } else {
    worktreeNote = ` Your workspace path has changed, and all future edits should be performed in the new workspace folders.`;
  }
  const agentEnvironmentTransitionReminder = buildAgentEnvironmentTransitionReminder(currentAgentType, previousAgentType);
  return `<system_reminder>
Workspace folders changed from ${formatWorkspaceUriList(normalizedPrevious)} to ${formatWorkspaceUriList(normalizedCurrent)}.${worktreeNote}${agentEnvironmentTransitionReminder}
</system_reminder>`;
}

