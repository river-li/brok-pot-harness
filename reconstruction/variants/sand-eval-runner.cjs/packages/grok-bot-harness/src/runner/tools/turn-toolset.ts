/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/turn-toolset.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
var SAND_BOX_READ_TOOL_DESCRIPTION = `Reads a file on your own computer (the box), the same filesystem ${SAND_BOX_SHELL_TOOL_NAME} and CopyToBox act on. This is your default surface, including your own files under /home/box.

Text files include line numbers and support offset/limit paging. Image files (jpeg/jpg, png, gif, webp) are returned inline so you can see them. PDF files are converted to text.`;
var SAND_COMPUTER_USE_BOX_READ_TOOL_DESCRIPTION = `Reads a file on the box, the same filesystem ${SAND_BOX_SHELL_TOOL_NAME} acts on.

Text files include line numbers and support offset/limit paging. Image files (jpeg/jpg, png, gif, webp) are returned inline so you can see them. PDF files are converted to text.`;
var SAND_MACHINE_ROUTING_SHELL_DESCRIPTION = `Omit machineId to run on your box. To run on one of the user's computers instead, call ${SAND_LIST_MACHINES_TOOL_NAME} and pass its machineId. Machine-targeted commands use that computer's filesystem and require the user's local-tool approval.`;
var SAND_MACHINE_ROUTING_READ_DESCRIPTION = `Omit machineId to read from your box. To read from one of the user's computers instead, call ${SAND_LIST_MACHINES_TOOL_NAME} and pass its machineId. A machine-targeted read uses that computer's filesystem and requires the user's local-tool approval.`;
var SAND_MACHINE_ROUTING_AWAIT_DESCRIPTION = `Omit machineId for a command started on your box. For a command started on one of the user's computers, pass the same machineId that was used for the ${SAND_BOX_SHELL_TOOL_NAME} call.`;
var SAND_FORCED_STATIC_TOOL_NAMES = /* @__PURE__ */ new Set([
  SAND_UPDATE_STATE_TOOL_NAME,
  SAND_RECALL_MEMORY_TOOL_NAME,
  SAND_REACT_TO_MESSAGE_TOOL_NAME
]);
var SAND_WEB_SEARCH_DESCRIPTION_SUFFIX = `Results come from an external search index that some sites block, so a missing or stale result is not evidence a page or fact does not exist. When search comes up empty for something that should exist, try WebFetch on a likely URL, then fall back to a browser subagent when one is available, or \`curl\` via Shell.`;
var SAND_WEB_FETCH_DESCRIPTION_SUFFIX = `Some sites' firewalls block this tool's fetch provider with a 403 or a block page (e.g. "Request Rejected"). That is not evidence the page does not exist: fall back to a browser subagent when one is available, or \`curl\` via Shell (your box egresses from a different network).`;
var SAND_DYNAMIC_TOOL_HINTS = {
  CLOUD_AGENT: "Launch and manage Cursor cloud coding agents for repository work. A Project is a coordinator cloud agent the user can ask for explicitly, and the CloudAgent tool description has the details.",
  SEARCH_PLUGINS: "Search installable plugins/connectors when a task needs a service.",
  AUTHENTICATE_MCP_SERVER: "Start authentication for a connector that needs auth.",
  COPY_TO_BOX: "Copy a file from the user's computer onto your box.",
  COPY_FROM_BOX: "Copy a file from your box onto the user's computer.",
  DOWNLOAD_FILE: "Fetch a file from Google Drive/OneDrive/Gmail. Not for URLs (WebFetch, curl) or box files (Read).",
  UPLOAD_FILE: "Send a file from your box into a connected Google Drive / OneDrive / Gmail account.",
  REQUEST_BOX_HELP: "Hand your box's desktop to the user for a sign-in or manual step.",
  REQUEST_USER_FORM: "Show the user an in-chat form; the host fills the box browser with their answers.",
  REQUEST_VIRTUAL_CARD: "Ask the user to authorize a one-time virtual card for a specific purchase.",
  SEND_FEEDBACK: "Send the user's product feedback to the SpaceXAI team when they ask. Ask whether they want a reply unless they already said.",
  CHECK_SUBSCRIPTION_USAGE: "Report the user's Grok Bot subscription plan, usage so far this cycle, and when it resets.",
  TASK: "Spawn agents.",
  CHECK_SUBAGENT: "Inspect a running background subagent's status and recent actions.",
  MESSAGE_SUBAGENT: "Send a new instruction into a running background subagent.",
  STOP_SUBAGENT: "Abort a running background subagent.",
  SEARCH_CONVERSATIONS: "Read your full transcript, a subagent's, or another owned agent's, with tool calls.",
  READ_AGENT_ACTIVITY: "Summarize what the user's other bots did lately: last messages, open todos, unanswered questions.",
  FIND_IMESSAGE_CHATS: "Find a chat in the user's Messages app on their Mac.",
  CHAT_ITEMS: "Read a conversation out of the user's Messages history.",
  SEARCH_IMESSAGES: "Search the text of the user's Messages history.",
  IMESSAGE_ACTIVITY: "Count Messages activity per chat over a time window.",
  FETCH_IMESSAGE_ATTACHMENT: "Fetch one attachment out of a Messages conversation.",
  SEND_IMESSAGE: "Send a message from the user's Mac, as the user.",
  CHECK_IMESSAGE_PERMISSIONS: "Check which Messages grants the user's Mac has given.",
  FIND_CONTACTS: "Look up a person by name in the user's Contacts on their Mac."
};
var AUTOMATION_PARENT_MEDIATED_MCP_TOOL_NAMES = /* @__PURE__ */ new Set([
  "InstallPlugin",
  "AddMcpServer",
  "AuthenticateMcpServer"
]);
function withDynamicToolPlacement(tool) {
  if (SAND_FORCED_STATIC_TOOL_NAMES.has(tool.name)) {
    return { ...tool, contextType: { type: "static" } };
  }
  if (tool.contextType !== void 0) return tool;
  const hint = SAND_DYNAMIC_TOOL_HINTS[tool.toolIdentifier];
  if (hint === void 0) return tool;
  return { ...tool, contextType: { type: "dynamic", conciseStaticContext: hint } };
}
var SAND_READ_FORMATTING_OPTIONS = {
  shouldUseFormatCodeblock: false,
  gpt5StyleLineNumbers: false,
  gpt5CodexCatN: false,
  enableLineNumbers: true
};
function withLocalToolScope(tool, agentId, permission, action) {
  if (permission === void 0) return tool;
  return {
    ...tool,
    execute: async (ctx, interactionHandler, argsStream, meta) => {
      const directionEpoch = ctx.get(sandTurnDirectionEpochKey);
      const scope = {
        agentId,
        toolCallId: meta.toolCallId,
        ...directionEpoch !== void 0 ? { directionEpoch } : {},
        ...action !== void 0 ? { action } : {}
      };
      try {
        return await tool.execute(
          ctx.with(sandLocalToolScopeKey, scope),
          interactionHandler,
          argsStream,
          meta
        );
      } finally {
        permission.completeScope(scope);
      }
    }
  };
}
function withRecordedToolCallNames(tool, record2) {
  return {
    ...tool,
    execute: (ctx, interactionHandler, argsStream, meta) => {
      record2(meta.toolCallId);
      return tool.execute(ctx, interactionHandler, argsStream, meta);
    }
  };
}
function createMachineRoutedTool({
  boxTool,
  machineTool,
  descriptionSuffix
}) {
  return {
    ...boxTool,
    parameters: machineTool.parameters,
    descriptionGenerator: (props, options2) => `${boxTool.descriptionGenerator(props, options2)}

${descriptionSuffix}`,
    execute: async (ctx, interactionHandler, argsStream, meta) => {
      let rawArgs = "";
      for await (const chunk of argsStream) {
        rawArgs += chunk;
      }
      let targetsUserComputer = false;
      try {
        const parsed = JSON.parse(rawArgs);
        targetsUserComputer = parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) && Object.prototype.hasOwnProperty.call(parsed, "machineId");
      } catch {
        targetsUserComputer = false;
      }
      const replay = (async function* () {
        yield rawArgs;
      })();
      return (targetsUserComputer ? machineTool : boxTool).execute(
        ctx,
        interactionHandler,
        replay,
        meta
      );
    }
  };
}
function buildTurnTools(host, turn, props) {
  const {
    toolSession,
    summarizationSession,
    config: config2,
    subagentConfigs,
    parentModelInfo,
    subagentModels,
    geminiVideoAttachedMediaUrlProvider,
    boxConnection,
    resourceAccessor,
    remoteBoxResourceAccessor,
    webSearchService,
    webFetchService,
    summarizationHandler,
    autoReviewModes,
    getAutoReviewUserInstructions,
    autoReviewRequestContext,
    hostShellApprovalProvider,
    boxShellApprovalProvider,
    mcpApprovalProvider,
    isThisRunAwaitingUser,
    isTeamSetupUnderway,
    ackToken,
    emitConnectorCard,
    pauseThisRun,
    updateObservers,
    endThisRunAwaitingUser,
    requestAutomationParentWake,
    privacyMode
  } = turn;
  if (host.isSubagentRunner && isMediaReviewSubagentType(host.subagentType)) {
    return fencedToolSet([], host.gates.spotlight());
  }
  const sharePassTools = sharePassSubagentTools(host);
  if (sharePassTools !== void 0) {
    return fencedToolSet(sharePassTools, host.gates.spotlight());
  }
  const hasParentToolParity = !host.isSubagentRunner || host.isParentMediatedAutomationSubagent;
  const extractAutoReviewConversationContext = createSandAutoReviewClassifierContextExtractor(
    host.getAutoReviewParentConversationState,
    { automationSubagent: host.isParentMediatedAutomationSubagent }
  );
  const dynamicToolRegistry = hasParentToolParity && !host.isBoxScopedSubagent && host.gates.dynamicTools() ? new DynamicToolRegistry() : void 0;
  const mcpMetaToolNames = sandMcpMetaToolNames(dynamicToolRegistry !== void 0);
  const tools = [];
  const toolHandoff = createToolHandoff();
  if (requestAutomationParentWake !== void 0) {
    tools.push(
      defineCommunicateTool(
        { requestAutomationParentWake },
        {
          id: "COMMUNICATE_UPDATE",
          name: "WakeParent",
          description: "End this automation turn immediately and wake the parent agent so it can take over. You MUST use this when the saved instruction itself requires user-visible communication, such as pinging, reminding, telling, notifying, asking, or saying something to the user, because the parent is the only route to the user; a normal final assistant response does not wake the parent or reach the user. Old saved instructions may name SendMessage or SendToUser; both are deprecated and unavailable here, so treat either as communication intent, do not try to discover or call it, and use WakeParent with the complete payload or handoff. Also use this when the parent must communicate with another agent, make a decision, or handle a blocker you cannot resolve autonomously. Do not use it for background results that can wait until the parent's next natural safe boundary. Put the complete outcome, relevant context, and what the parent should communicate or do in the message; you cannot continue or add anything after this call.",
          parameters: external_exports.object({
            message: external_exports.string().trim().min(1).describe(
              "The complete handoff for the parent: what happened, why it is being woken, and exactly what it should communicate or do next."
            )
          }),
          execute: async (_ctx, args, deps) => {
            deps.requestAutomationParentWake(args.message);
            return "The parent was awakened and this automation turn has ended.";
          }
        }
      )
    );
  }
  const shellFileOutputThresholdBytes = isLargeOutputSpillEnabled() ? SAND_SHELL_FILE_OUTPUT_THRESHOLD_BYTES : BigInt(0);
  if (hasParentToolParity && subagentConfigs != null) {
    tools.push(
      createTaskTool(
        new CombinedResourceAccessor(props.resourceAccessor, [
          resourceEntry(readExecutorResource, remoteBoxResourceAccessor.get(readExecutorResource))
        ]),
        async () => ({
          agentConfig: {
            ...config2,
            prependedUserMessageDedupeFloorMessageId: void 0,
            toolsGenerator: () => fencedToolSet([], host.gates.spotlight())
          },
          promptSession: toolSession,
          summarizationHandler
        }),
        parentModelInfo,
        props.stateHandler,
        subagentConfigs,
        {
          resumeOnlySubagentConfigs: [
            createSandBrowserUseSubagentConfig({
              credentialFillEnabled: !host.isSubagentRunner && !host.isSystemPromptOverridden && host.credentialAccess != null
            })
          ],
          supportsRetiredSubagentReattachment: host.detachedSubagents?.supportsTaskReattachment === true,
          readonlyShellEnabled: false,
          allowCustomModelId: false,
          includeModelParameter: turn.executorProfileSelectionEnabled,
          modelParameterDescription: "Optional effort level for a new executor. Choose a listed level based on task difficulty, or omit it for the default. It is ignored for other subagent types and resumed executors.",
          includeExploreSubagent: false,
          subagentModels,
          forceModelId: void 0,
          subagentModelForcePolicy: SubagentModelForcePolicy.None,
          requireServerSideSubagent: false,
          compareModelCosts: () => 0,
          requiresMaxMode: void 0,
          isModelBlocked: () => false,
          isModelValid: () => true,
          useClientSideSubagent: true,
          requireExplicitSubagentTypeForNewSession: turn.conservativeExecutorReuse,
          enableExploreParentModelInheritance: true,
          enableJobCompletionNotifications: true,
          geminiVideoAttachedMediaUrlProvider,
          enableAgentChatLinks: false,
          trustedVideoAttachmentRoots: host.remoteBoxHasDesktop ? [SAND_BOX_WORKSPACE_ROOT] : []
        }
      )
    );
  }
  if (hasParentToolParity && !host.isSystemPromptOverridden) {
    tools.push(createSandMultitaskTodoTool(props.resourceAccessor, props.stateHandler));
  }
  const hasUserFacingChat = !host.isSubagentRunner || host.isAutomationSubagent && !host.isParentMediatedAutomationSubagent;
  if (hasUserFacingChat) {
    tools.push(
      createSendMessageTool2({
        completeTurnAfterSend: turn.offerSendToUserEndTurn() ? turn.completeThisRun : void 0,
        onSendMessage: (message, timestampMs, deliverTo) => {
          host.emitUpdate(
            {
              type: "send-message",
              message,
              timestampMs,
              ...deliverTo != null ? { deliverTo } : {},
              ...ackToken != null ? { ackToken } : {}
            },
            updateObservers
          );
          return host.transport?.lastSentMessageId?.();
        },
        getIngestAttachment: () => host.ingestAttachment,
        readMediaDimensions: host.readMediaDimensions,
        isAwaitingUserSelection: isThisRunAwaitingUser,
        getSendBlockReason: (message, deliverTo) => host.transport?.sendMessageBlockReason?.(message, deliverTo),
        resolveCloudAgentTitle: host.resolveCloudAgentTitle,
        resolveBoxAttachment: (ctx, boxPath) => resolveBoxMediaAttachment({
          ctx,
          boxPath,
          box: host.remoteBox,
          boxId: host.resolveBoxId(),
          remoteBoxHasDesktop: host.remoteBoxHasDesktop,
          persistImage: host.persistImage,
          persistMediaBytes: host.persistMediaBytes
        }),
        chromeCookieImport: host.gates.chromeCookieImport,
        boxEgressTunnel: host.gates.boxEgressTunnel,
        updateCommunication: host.gates.updateCommunication,
        leanDescription: () => !host.isSystemPromptOverridden && host.gates.leanSendToUserDescription(),
        resolveCredentialBrowserTarget: host.credentialAccess?.resolveBrowserTarget,
        resolveSecretRequestTarget: host.resolveSecretRequestTarget,
        toolNotesInSystemPrompt: host.toolNotesInSystemPrompt
      })
    );
  }
  const draftTool = createDraftToolForTurn(host, turn, {
    stateHandler: props.stateHandler,
    extractConversationContext: extractAutoReviewConversationContext
  });
  if (draftTool != null) tools.push(draftTool);
  if (hasParentToolParity && !host.isParentMediatedAutomationSubagent && host.sendToAgentImpl != null) {
    const sendToAgent = host.sendToAgentImpl;
    const attachmentSourceDeps = {
      getIngestAttachment: () => host.ingestAttachment,
      resolveBoxAttachment: (ctx, boxPath) => resolveBoxMediaAttachment({
        ctx,
        boxPath,
        box: host.remoteBox,
        boxId: host.resolveBoxId(),
        remoteBoxHasDesktop: host.remoteBoxHasDesktop,
        persistImage: host.persistImage,
        persistMediaBytes: host.persistMediaBytes
      })
    };
    tools.push(
      createSendToAgentTool({
        getSelfAgentId: () => host.getConversationId(),
        sendToAgent: (toAgentId, text2, images, priority) => sendToAgent(toAgentId, text2, images, priority),
        resolveImageSource: async (ctx, url2) => (await resolveAttachmentSource(ctx, url2, attachmentSourceDeps)).url,
        acceptArgumentAliases: host.gates.reducePeerChatter,
        priorityRequired: host.gates.reducePeerChatter,
        onArgsRejected: host.observeToolCallArgsRejected
      })
    );
  }
  if (hasParentToolParity && !host.isParentMediatedAutomationSubagent) {
    tools.push(
      createReactToMessageTool({
        react: ({ messageAddress, emoji: emoji2 }) => host.emitUpdate({ type: "react-to-message", messageAddress, emoji: emoji2 }, updateObservers),
        activeReactions: host.gates.activeReactions
      })
    );
    if (host.slackReaction != null) {
      tools.push(createReactToSlackMessageTool(host.slackReaction));
    }
  }
  if (hasParentToolParity && host.submitProductFeedback != null) {
    tools.push(
      createSendFeedbackTool({
        submitProductFeedback: host.submitProductFeedback,
        getConversationId: () => host.getConversationId(),
        autoReviewController: host.autoReviewController,
        getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource()),
        privacyMode
      })
    );
  }
  if (hasParentToolParity && host.getCycleUsage != null && host.gates.checkSubscriptionUsage()) {
    tools.push(createCheckSubscriptionUsageTool({ getCycleUsage: host.getCycleUsage }));
  }
  maybeAddCommunicationTools({ tools, host, hasParentToolParity });
  if (hasParentToolParity) {
    tools.push(
      ...emailTurnTools(host, {
        mode: autoReviewModes.mcp,
        resourceAccessor,
        stateHandler: props.stateHandler,
        getUserInstructions: getAutoReviewUserInstructions,
        extractConversationContext: extractAutoReviewConversationContext
      })
    );
  }
  if (hasParentToolParity && host.slackReadTools != null && host.isMcpDiscoveryUnavailableForTurn?.() !== true && !hasSlackReadMcpTools(props.mcpTools)) {
    for (const tool of host.slackReadTools()) {
      tools.push(withRecordedToolCallNames(tool, (id) => host.recordModelToolName(id, tool.name)));
    }
  }
  if (hasParentToolParity && host.transcriptReader != null) {
    tools.push(createReadTranscriptTool({ transcriptReader: host.transcriptReader }));
  }
  if (hasParentToolParity && host.agentActivity != null) {
    tools.push(createReadAgentActivityTool({ agentActivity: host.agentActivity }));
  }
  const offersCredentialTools = !host.isSubagentRunner && !host.isSystemPromptOverridden;
  if (offersCredentialTools && host.credentialProviderStatus != null) {
    tools.push(createCredentialProviderStatusTool(host.credentialProviderStatus));
  }
  if (offersCredentialTools && host.credentialAccess != null) {
    tools.push(...createCredentialTools(host.credentialAccess));
  }
  if (offersCredentialTools && (host.credentialProviderStatus != null || host.credentialAccess != null)) {
    const credentialTurnRefusal = host.credentialAccess?.turnRefusal ?? host.credentialProviderStatus?.turnRefusal;
    tools.push(
      createRequestOnePasswordConnectTool({
        ...credentialTurnRefusal === void 0 ? {} : { turnRefusal: credentialTurnRefusal },
        onSendMessage: (message, timestampMs) => host.emitUpdate(
          {
            type: "send-message",
            message,
            timestampMs,
            ...ackToken != null ? { ackToken } : {}
          },
          updateObservers
        )
      })
    );
  }
  if (hasParentToolParity && host.agentManagement != null) {
    const agentManagement = host.agentManagement;
    tools.push(
      createListSectionsTool(agentManagement),
      createCreateAgentTool(agentManagement),
      createUpdateAgentTool(agentManagement)
    );
    if (agentManagement.setPrimaryBot != null) {
      tools.push(createSetPrimaryBotTool(agentManagement.setPrimaryBot.bind(agentManagement)));
    }
  }
  if (hasParentToolParity && !host.isParentMediatedAutomationSubagent && host.botTemplateShare != null && host.gates.botShare()) {
    tools.push(
      createCreateBotShareJsonTool({
        share: host.botTemplateShare,
        emitShare: (message) => host.emitUpdate(
          {
            type: "send-message",
            message,
            timestampMs: Date.now(),
            ...ackToken != null ? { ackToken } : {}
          },
          updateObservers
        ),
        getSourceAgentId: () => host.getConversationId(),
        getSourceAvatar: () => host.getSourceAvatar?.() ?? {},
        getShareScope: () => host.botTemplateShare?.getShareScope?.(),
        peekShareScope: () => host.botTemplateShare?.peekShareScope?.(),
        canPublish: host.autoReviewController?.canResolveApprovals === true,
        isGettingStartedEnabled: host.gates.botShareGettingStarted
      })
    );
  }
  if (hasParentToolParity && host.channelManagement != null) {
    const channelManagement = host.channelManagement;
    tools.push(
      createCreateChannelTool(channelManagement),
      createUpdateChannelTool(channelManagement)
    );
  }
  if (hasParentToolParity && !host.isSystemPromptOverridden && host.memoryStore != null) {
    tools.push(
      createRecallMemoryTool({
        memoryStore: () => host.memoryStore,
        userMemory: () => host.userMemory
      })
    );
  }
  if (hasParentToolParity && !host.isSystemPromptOverridden && host.agentState != null) {
    tools.push(
      createSandStateTool({
        state: host.agentState,
        conversationMemory: host.memoryStore?.memoryScopes,
        metricsHarness: host.metricsHarness,
        memoryTelemetry: host.memoryTelemetry,
        skillStore: host.skillStore,
        automationStore: host.automationStore,
        assertNoPendingAutoReviewApproval: () => host.assertNoPendingAutoReviewApproval(),
        automationWriteProvenance: () => host.automationWriteProvenance?.() ?? (host.trustsAutomationWrites?.() === false ? "untrusted" : sandAutomationWriteProvenance(host.activeTurnRequestSource())),
        canReviewAutomationWrites: () => host.canReviewAutomationWrites?.() ?? host.trustsAutomationWrites?.() !== false,
        canCreateAutomation: () => host.activeTurnRequestSource() !== "automation",
        activeAutomationWakeId: () => host.activeTurnAutomationWakeId(),
        fiveMinuteAutomationFloorEnabled: host.gates.fiveMinuteAutomationFloor,
        teamBot: () => host.teamBot?.() !== void 0,
        isTeamSetupUnderway,
        ...host.isParentMediatedAutomationSubagent ? {} : {
          onListenerAutomationSaved: (trigger) => surfaceListenerConnectCards({
            trigger,
            isListenerPlatformConnected: host.isListenerPlatformConnected,
            emit: (message) => host.emitUpdate(
              {
                type: "send-message",
                message,
                timestampMs: Date.now(),
                ...ackToken != null ? { ackToken } : {}
              },
              updateObservers
            )
          })
        },
        reviewAutomationWrite: (target, toolCallId) => reviewSandAutomationWrite({
          ctx: host.ctx,
          toolCallId,
          target,
          options: {
            mode: host.automationWriteReviewMode?.(target) ?? autoReviewModes.automationWrite,
            agentId: host.getConversationId(),
            resourceAccessor,
            stateHandler: props.stateHandler,
            autoReviewController: host.autoReviewController,
            getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource()),
            userAutoRunInstructions: getAutoReviewUserInstructions(),
            extractConversationContext: extractAutoReviewConversationContext
          }
        })
      })
    );
  }
  if (hasParentToolParity && !host.isSystemPromptOverridden && host.appHome != null) {
    tools.push(createUpdateAppHomeTool(host.appHome));
  }
  const localToolAgentId = host.getConversationId();
  function scopeLocalTool(tool, action) {
    return withLocalToolScope(tool, localToolAgentId, host.localToolPermission, action);
  }
  const { machineIds } = turn;
  const machineIdOptions = {
    machineIds,
    machineIdParameterSchema: "open"
  };
  const fileTransferController = host.createFileTransferController();
  const userComputers = fileTransferController.userComputers;
  const resolveMachineTerminalsFolder = (machineId) => {
    if (machineId === void 0) return boxConnection.terminalsFolder;
    return userComputers.resolve(machineId, { agentId: localToolAgentId })?.terminalsFolder?.() ?? boxConnection.terminalsFolder;
  };
  const hasUserComputer = host.hasUserComputer?.() !== false;
  let machineShellTool;
  let machineReadTool;
  let machineAwaitTool;
  if (!host.isBoxScopedSubagent && hasUserComputer) {
    tools.push(createListMachinesTool(userComputers));
    machineShellTool = scopeLocalTool(
      withRecordedToolCallNames(
        createShellTool(props.resourceAccessor, {
          terminalsFolder: resolveMachineTerminalsFolder,
          ...machineIdOptions,
          enableBlockUntilMs: true,
          defaultBlockUntilMs: 3e4,
          enableJobCompletionNotifications: true,
          enableTerminalFiles: true,
          smartModeClassifierMode: autoReviewModes.hostShell === "enforce",
          smartModeClassifierShadowMode: autoReviewModes.hostShell === "shadow",
          requestContext: autoReviewRequestContext,
          agentType: AgentType.IDE,
          smartModeApprovalSurface: "host_machine",
          smartModeApprovalProvider: hostShellApprovalProvider,
          extractSmartModeClassifierConversationContext: extractAutoReviewConversationContext,
          suppressSmartModeClassifierTelemetryIds: true,
          smartModeClassifierMaxAttempts: SAND_AUTO_REVIEW_CLASSIFIER_MAX_ATTEMPTS,
          loadSmartModeWorkspacePermissionFiles: false,
          disableSmartModeAllowlistPrecheck: true,
          userAutoRunInstructions: getAutoReviewUserInstructions(),
          fileOutputThresholdBytes: shellFileOutputThresholdBytes
        }),
        (id) => host.recordModelToolName(id, SAND_BOX_SHELL_TOOL_NAME)
      ),
      "run-command"
    );
    machineReadTool = scopeLocalTool(
      withRecordedToolCallNames(
        createReadTool(props.resourceAccessor, SAND_READ_FORMATTING_OPTIONS, "latest", {
          enableNegativeOffset: true,
          ...machineIdOptions
        }),
        (id) => host.recordModelToolName(id, SAND_BOX_READ_TOOL_NAME)
      ),
      "read-file"
    );
    machineAwaitTool = scopeLocalTool(
      withRecordedToolCallNames(
        createAwaitTool(props.resourceAccessor, {
          terminalsFolder: resolveMachineTerminalsFolder,
          ...machineIdOptions,
          enableSubagentAwaiting: false,
          defaultBlockUntilMs: 3e4,
          enableJobCompletionNotifications: true
        }),
        (id) => host.recordModelToolName(id, SAND_BOX_AWAIT_SHELL_TOOL_NAME)
      ),
      "read-file"
    );
  }
  const messages = host.messages;
  if (!host.isSubagentRunner && host.gates.messagesTools() && messages !== void 0 && messages.enabled() === true) {
    tools.push(
      ...createMessagesTools({
        messages,
        agentBox: host.remoteBox,
        getBoxId: () => host.resolveBoxId(),
        ...host.messagesGrants !== void 0 ? { messagesGrants: host.messagesGrants } : {},
        ...host.onMessagesToolUse !== void 0 ? { reportToolUse: host.onMessagesToolUse } : {},
        ...host.onMessagesGrantsAsk !== void 0 ? { reportGrantsAsk: host.onMessagesGrantsAsk } : {}
      }).map((tool) => scopeLocalTool(tool, messagesToolAction(tool.toolIdentifier)))
    );
  }
  if (!host.isBoxScopedSubagent) {
    tools.push(
      createWebSearchTool(webSearchService, "latest", {
        conversationStartedDate: props.stateHandler.getOrInitializeConversationStartedDate(
          host.requestContext.resolve().timeZone
        ),
        descriptionSuffix: SAND_WEB_SEARCH_DESCRIPTION_SUFFIX
      }),
      createWebFetchTool(webFetchService, "latest", {
        resourceAccessor: props.resourceAccessor,
        descriptionSuffix: SAND_WEB_FETCH_DESCRIPTION_SUFFIX
      })
    );
  }
  const cloudCanvas = host.cloudCanvas;
  if (cloudCanvas !== void 0 && cloudCanvasToolsGateEligible(host)) {
    tools.push(...createCloudCanvasTools({ port: cloudCanvas }));
  }
  const generateImageService = host.generateImageService;
  const generateImageResourceAccessor = host.generateImageResourceAccessor;
  const agentDir = host.getAgentDirImpl?.();
  if (hasParentToolParity && generateImageService != null && generateImageResourceAccessor != null && agentDir != null && agentDir.length > 0) {
    tools.push(
      createGenerateImageTool(
        generateImageResourceAccessor,
        generateImageService,
        "latest",
        new RequestContext({
          env: new RequestContextEnv({ projectFolder: agentDir })
        }),
        host.imageGenerationConcurrencyLimiter
      )
    );
  }
  if (!host.isBoxScopedSubagent && !host.gates.cloudAgentsDisabledByTeam()) {
    const reviewAction2 = autoReviewModes.cloudAgent === "off" ? void 0 : async ({ args, toolCallId, images, files, sessionManaged, signal }) => {
      host.assertNoPendingAutoReviewApproval();
      const target = buildSandCloudAgentReviewTarget(args, {
        images: describeSandCloudAgentReviewImages(
          (args.images ?? []).map((image2) => image2.url),
          images
        ),
        files: describeSandCloudAgentReviewFiles(files),
        sessionManaged
      });
      if (target === void 0) return { allowed: true };
      return reviewSandCloudAgentAction({
        ctx: host.ctx,
        toolCallId,
        ...signal !== void 0 ? { signal } : {},
        target,
        options: {
          mode: autoReviewModes.cloudAgent,
          agentId: host.getConversationId(),
          resourceAccessor,
          stateHandler: props.stateHandler,
          autoReviewController: host.autoReviewController,
          getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource()),
          userAutoRunInstructions: getAutoReviewUserInstructions(),
          extractConversationContext: extractAutoReviewConversationContext
        }
      });
    };
    if (host.createCloudAgentTool != null) {
      const scmConnectCard = host.gates.scmConnectCard();
      const offersScmConnectCard = scmConnectCard && hasUserFacingChat;
      tools.push(
        host.createCloudAgentTool({
          fallbackLineage: turn.childRequestLineage,
          ...reviewAction2 !== void 0 ? { reviewAction: reviewAction2 } : {},
          ...scmConnectCard ? { scmConnectCard } : {},
          ...offersScmConnectCard ? {
            describeScmConnect: async ({ repoUrl, rejection, knownIntent, blockedAction }) => describeScmConnectBlocker({
              provider: detectScmProviderForRepoUrl(repoUrl),
              ...repoUrl == null ? {} : { repoUrl },
              ...rejection == null ? {} : { rejection },
              ...knownIntent == null ? {} : { knownIntent },
              ...host.isListenerPlatformConnected != null ? { isConnected: host.isListenerPlatformConnected } : {},
              blockedAction
            })
          } : {},
          isCanvasesEnabled: false,
          artifactsEnabled: host.gates.cloudAgentArtifacts(),
          durableWatchEnabled: host.gates.cloudAgentDurableWatch(),
          replyModesEnabled: host.gates.cloudAgentReplyModes(),
          exchangeEnabled: !host.isSubagentRunner && host.gates.cloudAgentExchange()
        })
      );
      if (offersScmConnectCard) {
        tools.push(
          createRequestScmConnectTool({
            onSendMessage: (message, timestampMs) => host.emitUpdate(
              {
                type: "send-message",
                message,
                timestampMs,
                ...ackToken != null ? { ackToken } : {}
              },
              updateObservers
            ),
            ...host.registerScmConnectWait != null ? { registerScmConnectWait: host.registerScmConnectWait } : {}
          })
        );
      }
    }
  }
  if (host.getRemoteBoxAvailable()) {
    const boxShellTool = withRecordedToolCallNames(
      createShellTool(remoteBoxResourceAccessor, {
        terminalsFolder: () => host.resolveBoxTerminalsFolder(),
        enableGithubTools: !host.isBoxScopedSubagent,
        compactShellDescription: host.isBoxScopedSubagent,
        enableBlockUntilMs: true,
        defaultBlockUntilMs: 3e4,
        enableJobCompletionNotifications: true,
        enableTerminalFiles: true,
        smartModeClassifierMode: autoReviewModes.boxShell === "enforce",
        smartModeClassifierShadowMode: autoReviewModes.boxShell === "shadow",
        requestContext: autoReviewRequestContext,
        agentType: AgentType.IDE,
        smartModeApprovalSurface: "isolated_box",
        smartModeApprovalProvider: boxShellApprovalProvider,
        extractSmartModeClassifierConversationContext: extractAutoReviewConversationContext,
        suppressSmartModeClassifierTelemetryIds: true,
        smartModeClassifierMaxAttempts: SAND_AUTO_REVIEW_CLASSIFIER_MAX_ATTEMPTS,
        loadSmartModeWorkspacePermissionFiles: false,
        disableSmartModeAllowlistPrecheck: true,
        userAutoRunInstructions: getAutoReviewUserInstructions(),
        fileOutputThresholdBytes: shellFileOutputThresholdBytes
      }),
      (id) => host.recordModelToolName(id, SAND_BOX_SHELL_TOOL_NAME)
    );
    const boxReadTool = withRecordedToolCallNames(
      createReadTool(remoteBoxResourceAccessor, SAND_READ_FORMATTING_OPTIONS, "latest", {
        toolDescription: host.isBoxScopedSubagent ? SAND_COMPUTER_USE_BOX_READ_TOOL_DESCRIPTION : SAND_BOX_READ_TOOL_DESCRIPTION,
        enableNegativeOffset: true
      }),
      (id) => host.recordModelToolName(id, SAND_BOX_READ_TOOL_NAME)
    );
    tools.push(
      machineShellTool === void 0 ? boxShellTool : createMachineRoutedTool({
        boxTool: boxShellTool,
        machineTool: machineShellTool,
        descriptionSuffix: SAND_MACHINE_ROUTING_SHELL_DESCRIPTION
      }),
      machineReadTool === void 0 ? boxReadTool : createMachineRoutedTool({
        boxTool: boxReadTool,
        machineTool: machineReadTool,
        descriptionSuffix: SAND_MACHINE_ROUTING_READ_DESCRIPTION
      })
    );
    if (!host.isBoxScopedSubagent) {
      const boxAwaitTool = withRecordedToolCallNames(
        createAwaitTool(remoteBoxResourceAccessor, {
          terminalsFolder: () => host.resolveBoxTerminalsFolder(),
          enableSubagentAwaiting: false,
          defaultBlockUntilMs: 3e4,
          enableJobCompletionNotifications: true
        }),
        (id) => host.recordModelToolName(id, SAND_BOX_AWAIT_SHELL_TOOL_NAME)
      );
      tools.push(
        machineAwaitTool === void 0 ? boxAwaitTool : createMachineRoutedTool({
          boxTool: boxAwaitTool,
          machineTool: machineAwaitTool,
          descriptionSuffix: SAND_MACHINE_ROUTING_AWAIT_DESCRIPTION
        })
      );
    }
    if (!host.isBoxScopedSubagent && hasUserComputer) {
      tools.push(
        ...createFileTransferTools(fileTransferController, machineIds).map(
          (tool) => scopeLocalTool(tool)
        )
      );
    }
  }
  const resolveCredentialFillWindow = async (ctx) => {
    await host.remoteBox.ensureReady(ctx, host.resolveBoxId());
    const windowIndex = boxAgentWindowIndex(host.remoteBox, host.resolveBoxId());
    if (windowIndex !== void 0) return windowIndex;
    return boxSupportsMultiWindow(host.remoteBox) ? void 0 : 1;
  };
  const gateOnCredentialFillLease = (tool) => gateToolOnCredentialFillLease(tool, host.credentialFillLease, resolveCredentialFillWindow);
  if (host.isComputerUseSubagent && host.remoteBoxHasDesktop && host.getRemoteBoxAvailable()) {
    tools.push(
      gateOnCredentialFillLease(
        createComputerTool(remoteBoxResourceAccessor, {
          harness: host.browserOperationHarness,
          reportComputerOperation: host.reportComputerOperation,
          getCombinedMode: host.getCombinedComputerUseSelection,
          getBrowserSurface: () => sandBrowserToolSurface(host.gates),
          getPersistImage: () => host.persistImage,
          isUnicodeTypingEnabled: host.gates.unicodeTyping,
          ...autoReviewModes.computer !== "off" ? {
            autoReview: {
              mode: autoReviewModes.computer,
              agentId: host.getConversationId(),
              boxIdentity: {
                boxId: host.resolveBoxId(),
                windowGeneration: `${host.autoReviewController?.hostGeneration ?? "host"}:${host.resolveBoxId()}`
              },
              resolveDisplayNumber: async (ctx) => {
                await host.remoteBox.ensureReady(ctx, host.resolveBoxId());
                const windowIndex = boxAgentWindowIndex(host.remoteBox, host.resolveBoxId());
                if (windowIndex !== void 0) return windowIndex;
                return boxSupportsMultiWindow(host.remoteBox) ? void 0 : 1;
              },
              autoReviewController: host.autoReviewController,
              getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource()),
              personalInstructions: host.getAutoReviewInstructions?.(),
              extractConversationContext: extractAutoReviewConversationContext
            }
          } : {},
          onComputerAction: (action) => host.onComputerAction?.({
            agentId: host.getTranscriptId(),
            action
          })
        })
      )
    );
  }
  const browserSurface = resolveSandBrowserSurface(host);
  if (browserSurface !== "none") {
    const browserAutoReview = autoReviewModes.computer !== "off" ? {
      mode: autoReviewModes.computer,
      agentId: host.getConversationId(),
      boxIdentity: {
        boxId: host.resolveBoxId(),
        windowGeneration: `${host.autoReviewController?.hostGeneration ?? "host"}:${host.resolveBoxId()}`
      },
      resolveDisplayNumber: async (ctx) => {
        await host.remoteBox.ensureReady(ctx, host.resolveBoxId());
        const windowIndex = boxAgentWindowIndex(host.remoteBox, host.resolveBoxId());
        if (windowIndex !== void 0) return windowIndex;
        return boxSupportsMultiWindow(host.remoteBox) ? void 0 : 1;
      },
      autoReviewController: host.autoReviewController,
      getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource()),
      personalInstructions: host.getAutoReviewInstructions?.(),
      extractConversationContext: extractAutoReviewConversationContext
    } : void 0;
    const getWindowIndex = async (ctx) => {
      await host.remoteBox.ensureReady(ctx, host.resolveBoxId());
      return boxAgentWindowIndex(host.remoteBox, host.resolveBoxId());
    };
    const onPossibleNavigation = (ctx) => {
      const windowIndex = boxAgentWindowIndex(host.remoteBox, host.resolveBoxId());
      if (windowIndex === void 0) return;
      host.getOrCreateNavigationProbe()?.probe(ctx.withDetached(), remoteBoxResourceAccessor, windowIndex);
    };
    if (browserSurface === "driver") {
      tools.push(
        ...createSandBrowserTools({
          harness: host.browserOperationHarness,
          reportBrowserOperation: host.reportBrowserOperation,
          resourceAccessor: remoteBoxResourceAccessor,
          agentBox: host.remoteBox,
          getBoxId: () => host.resolveBoxId(),
          ...browserAutoReview !== void 0 ? { autoReview: browserAutoReview } : {},
          getWindowIndex,
          getPersistImage: () => host.persistImage,
          getDefaultViewId: () => host.getTranscriptId(),
          isNavigationRecoveryEnabled: host.gates.browserNavigationRecovery,
          onPossibleNavigation
        }).map(gateOnCredentialFillLease)
      );
    } else {
      tools.push(
        ...createPlaywrightBrowserTools({
          harness: host.browserOperationHarness,
          resourceAccessor: props.resourceAccessor,
          getWindowIndex,
          onPossibleNavigation,
          ...browserAutoReview !== void 0 ? {
            autoReview: {
              ...browserAutoReview,
              resourceAccessor: remoteBoxResourceAccessor
            }
          } : {}
        }).map(gateOnCredentialFillLease)
      );
    }
  }
  if (hasParentToolParity && host.remoteBoxHasDesktop && host.getRemoteBoxAvailable()) {
    tools.push(
      gateOnCredentialFillLease(
        createScreenshotTool(remoteBoxResourceAccessor, {
          harness: host.browserOperationHarness,
          reportComputerOperation: host.reportComputerOperation,
          getCombinedMode: host.getCombinedComputerUseSelection,
          getPersistImage: () => host.persistImage
        })
      )
    );
  }
  if (hasParentToolParity && !host.isParentMediatedAutomationSubagent && host.remoteBoxHasDesktop && host.getRemoteBoxAvailable() && host.boxHandoff != null) {
    const boxHandoff = host.boxHandoff;
    tools.push(
      createRequestBoxHelpTool({
        requestHelp: (request3) => boxHandoff.requestHelp(request3),
        getAgentId: () => host.getConversationId(),
        getTurnId: () => turn.childRequestLineage.parentRequestId,
        getRevivingSubagentAgentId: () => turn.revivingDesktopSubagentAgentId,
        onSendMessage: (message, timestampMs, boxHandoffStamp) => host.emitUpdate(
          {
            type: "send-message",
            message,
            timestampMs,
            boxHandoff: boxHandoffStamp,
            ...ackToken != null ? { ackToken } : {}
          },
          updateObservers
        ),
        endTurn: ({ toolCallId }) => {
          toolHandoff.stopOtherTools({ toolCallId });
          pauseThisRun();
        },
        credentialFillEnabled: !host.isSubagentRunner && !host.isSystemPromptOverridden && host.credentialAccess != null
      })
    );
  }
  if (hasParentToolParity && !host.isParentMediatedAutomationSubagent && host.remoteBoxHasDesktop && host.getRemoteBoxAvailable() && host.userForm != null && turn.offerUserForm()) {
    const userForm = host.userForm;
    tools.push(
      createRequestUserFormTool({
        requestForm: (request3) => userForm.requestForm(request3),
        ...turn.userFormVaultKeys !== void 0 ? { vaultKeysCatalog: turn.userFormVaultKeys } : {},
        getAgentId: () => host.getConversationId(),
        onSendMessage: (message, timestampMs, userFormStamp) => host.emitUpdate(
          {
            type: "send-message",
            message,
            timestampMs,
            userForm: userFormStamp,
            ...ackToken != null ? { ackToken } : {}
          },
          updateObservers
        ),
        endTurn: ({ toolCallId }) => {
          toolHandoff.stopOtherTools({ toolCallId });
          pauseThisRun();
        }
      })
    );
    const remapTargets = userForm.remapTargets;
    if (remapTargets != null) {
      tools.push(
        createRemapUserFormTargetsTool({
          remapTargets: (args) => remapTargets.call(userForm, args),
          hasRemapHold: (agentId) => userForm.hasRemapHold?.(agentId) === true,
          getAgentId: () => host.getConversationId()
        })
      );
    }
  }
  const emitCard = (message, timestampMs) => {
    host.emitUpdate(
      {
        type: "send-message",
        message,
        timestampMs,
        ...ackToken != null ? { ackToken } : {}
      },
      updateObservers
    );
  };
  if (!host.isSubagentRunner && host.gates.teamAccessCards()) {
    tools.push(
      createOfferTeamAccessTool({ onSendMessage: emitCard }),
      createOfferSlackConnectTool({ onSendMessage: emitCard })
    );
  }
  if (!host.isSubagentRunner && host.slackSetup != null) {
    tools.push(
      createSlackSetupTool({
        setup: host.slackSetup,
        onSendMessage: emitCard,
        isTeamSetupUnderway
      })
    );
  }
  if (!host.isSubagentRunner && host.memoryStore?.memoryScopes?.privateMain === true) {
    tools.push(
      createSortMemoriesTool({
        memoryScopes: () => host.memoryStore?.memoryScopes,
        onSendMessage: emitCard,
        isAwaitingUserSelection: isThisRunAwaitingUser
      })
    );
  }
  if (offersCookieOriginApproval(host)) {
    tools.push(
      createRequestCookieOriginApprovalTool(
        withCookieOriginApprovalCards(host.cookieOriginApproval, host)
      )
    );
  }
  if (!host.isSubagentRunner && host.virtualCard != null && host.gates.stripeLink() && hasStripeLinkConnector(props.mcpTools)) {
    const virtualCard = host.virtualCard;
    tools.push(
      createRequestVirtualCardTool({
        requestCard: (request3) => virtualCard.requestCard(request3),
        retireCard: (args) => virtualCard.retireCard(args),
        getAgentId: () => host.getConversationId(),
        onSendMessage: (message, timestampMs) => host.emitUpdate(
          {
            type: "send-message",
            message,
            timestampMs,
            ...ackToken != null ? { ackToken } : {}
          },
          updateObservers
        ),
        endTurn: () => endThisRunAwaitingUser("awaiting virtual card approval")
      })
    );
  }
  if (host.connectorFiles != null && !host.isBoxScopedSubagent && offersConnectorFileTools({
    hasConnectorFilesPort: true,
    mcpToolCount: props.mcpTools.length,
    mcpDiscoveryUnavailable: host.isMcpDiscoveryUnavailableForTurn?.() === true
  })) {
    const connectorFiles = host.connectorFiles;
    const connectorReviewOptions = () => ({
      mode: autoReviewModes.mcp,
      agentId: host.getConversationId(),
      resourceAccessor,
      stateHandler: props.stateHandler,
      autoReviewController: host.autoReviewController,
      getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource()),
      personalInstructions: host.getAutoReviewInstructions?.(),
      userAutoRunInstructions: getAutoReviewUserInstructions(),
      extractConversationContext: extractAutoReviewConversationContext
    });
    const reviewUpload = autoReviewModes.mcp === "off" ? void 0 : async ({ toolCallId, target, signal }) => {
      host.assertNoPendingAutoReviewApproval();
      return reviewSandConnectorUpload({
        ctx: host.ctx,
        toolCallId,
        ...signal !== void 0 ? { signal } : {},
        target,
        options: connectorReviewOptions()
      });
    };
    const reviewDownload = autoReviewModes.mcp === "off" ? void 0 : async ({ toolCallId, target, signal }) => {
      host.assertNoPendingAutoReviewApproval();
      return reviewSandConnectorDownload({
        ctx: host.ctx,
        toolCallId,
        ...signal !== void 0 ? { signal } : {},
        target,
        options: connectorReviewOptions()
      });
    };
    tools.push(
      createUploadFileTool({
        listConnections: () => connectorFiles.listConnections(),
        stage: (request3) => connectorFiles.stage(request3),
        getAgentId: () => host.getConversationId(),
        ...reviewUpload !== void 0 ? { reviewUpload } : {},
        onArgsRejected: host.observeToolCallArgsRejected
      }),
      createDownloadFileTool({
        listConnections: () => connectorFiles.listConnections(),
        prepareDownload: (request3) => connectorFiles.prepareDownload(request3),
        getAgentId: () => host.getConversationId(),
        ...reviewDownload !== void 0 ? { reviewDownload } : {},
        onArgsRejected: host.observeToolCallArgsRejected
      })
    );
  }
  if ((host.mcp != null || dynamicToolRegistry !== void 0) && !host.isBoxScopedSubagent) {
    const mcpMetaToolOptions = createSandMcpMetaToolOptions(props.mcpTools);
    tools.push(
      createGetMcpToolsTool(mcpMetaToolOptions, {
        resourceAccessor: props.resourceAccessor,
        ...dynamicToolRegistry !== void 0 ? {
          dynamicToolRegistry,
          omitBuiltinToolNamesFromDescription: host.gates.stableDynamicToolCatalog()
        } : {},
        toolName: mcpMetaToolNames.discovery,
        callMcpToolName: mcpMetaToolNames.invocation
      })
    );
    tools.push(
      createCallMcpTool({
        resourceAccessor: props.resourceAccessor,
        mcpMetaToolOptions,
        ...dynamicToolRegistry !== void 0 ? { dynamicToolRegistry } : {},
        name: mcpMetaToolNames.invocation,
        getMcpToolsToolName: mcpMetaToolNames.discovery,
        validateMcpToolDescriptors: host.gates.browserUsePlaywright(),
        smartModeClassifierMode: autoReviewModes.mcp === "enforce",
        smartModeClassifierShadowMode: autoReviewModes.mcp === "shadow",
        requestContext: autoReviewRequestContext,
        agentType: AgentType.IDE,
        extractSmartModeClassifierConversationContext: extractAutoReviewConversationContext,
        smartModeApprovalProvider: mcpApprovalProvider,
        suppressSmartModeClassifierTelemetryIds: true,
        smartModeClassifierMaxAttempts: SAND_AUTO_REVIEW_CLASSIFIER_MAX_ATTEMPTS,
        loadSmartModeWorkspacePermissionFiles: false,
        disableSmartModeAllowlistPrecheck: true,
        userAutoRunInstructions: getAutoReviewUserInstructions()
      })
    );
  }
  if (hasParentToolParity && host.mcpManagement != null) {
    const mcpManagementTools = createMcpManagementTools(
      host.mcpManagement,
      () => host.getConversationId(),
      isThisRunAwaitingUser,
      host.gates.mcpMultiAccount,
      emitConnectorCard,
      mcpMetaToolNames,
      { teamBot: host.teamBot?.() !== void 0, isTeamSetupUnderway }
    );
    tools.push(
      ...host.isParentMediatedAutomationSubagent ? mcpManagementTools.filter(
        (tool) => !AUTOMATION_PARENT_MEDIATED_MCP_TOOL_NAMES.has(tool.name)
      ) : mcpManagementTools
    );
  }
  if (hasParentToolParity && subagentConfigs != null) {
    const detached = host.detachedSubagents;
    const subagentController = detached !== void 0 ? {
      listRunningSubagents: () => detached.listRunning(),
      getRunningSubagent: (subagentAgentId) => detached.getRunning(subagentAgentId),
      steerSubagent: (subagentAgentId, message) => detached.steer({ subagentAgentId, message }),
      abortSubagent: (subagentAgentId) => detached.abort(subagentAgentId),
      ...detached.stopDelegatedWork === void 0 ? {} : { stopDelegatedWork: detached.stopDelegatedWork.bind(detached) }
    } : {
      listRunningSubagents: () => host.listRunningSubagents(),
      getRunningSubagent: (subagentAgentId) => host.getRunningSubagent(subagentAgentId),
      steerSubagent: (subagentAgentId, message) => host.steerSubagent(subagentAgentId, message),
      abortSubagent: (subagentAgentId) => host.abortSubagent(subagentAgentId)
    };
    tools.push(
      ...createSubagentManagementTools({
        ...subagentController,
        ...autoReviewModes.subagentLaunch === "off" ? {} : {
          reviewSteer: async (steerCtx, steerArgs) => {
            const target = buildSandSubagentSteerReviewTarget({
              message: steerArgs.message,
              subagentAgentId: steerArgs.subagentId,
              subagentType: (await subagentController.getRunningSubagent(steerArgs.subagentId))?.subagentType
            });
            if (target === void 0) return { allowed: true };
            host.assertNoPendingAutoReviewApproval();
            return reviewSandSubagentAction({
              ctx: steerCtx,
              toolCallId: steerArgs.toolCallId,
              target,
              signal: steerCtx.signal,
              options: {
                mode: autoReviewModes.subagentLaunch,
                agentId: host.getConversationId(),
                resourceAccessor,
                stateHandler: props.stateHandler,
                autoReviewController: host.autoReviewController,
                getApprovalExpiryPolicy: () => sandAutoReviewApprovalExpiryPolicy(host.activeTurnRequestSource()),
                userAutoRunInstructions: getAutoReviewUserInstructions(),
                extractConversationContext: extractAutoReviewConversationContext
              }
            });
          }
        }
      })
    );
  }
  const contextHintedTools = dynamicToolRegistry === void 0 ? tools : tools.map(withDynamicToolPlacement);
  return fencedToolSet(
    contextHintedTools.map(toolHandoff.wrapTool).map((tool) => {
      if (tool.dynamicToolMetaRole === "invocation") {
        return wrapDynamicInvocationToolWithTimeout({
          tool,
          dynamicToolRegistry,
          isComputerUseSubagent: host.isComputerUseSubagent,
          registerPauseCancel: (cancel) => host.registerPauseMcpCancel(cancel),
          observeDynamicToolCall: host.observeDynamicToolCall
        });
      }
      const executionTimeoutMs = sandToolCallExecutionTimeoutMs(
        tool.name,
        host.isComputerUseSubagent
      );
      return wrapToolWithTimeout(tool, {
        timeoutMs: executionTimeoutMs,
        createTimeoutError: () => createToolCallExecutionTimeoutError({
          toolName: tool.name,
          executionTimeoutMs
        })
      });
    }),
    host.gates.spotlight(),
    dynamicToolRegistry
  );
}

