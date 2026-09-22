var DEFAULT_SAND_MODEL = "gpt-5.5-high-fast";
var SandAutomationCompletionCheckpointError = class extends SandDomainError {
  name = "SandAutomationCompletionCheckpointError";
};
var SandAgentSectionNotFoundError = class extends SandDomainError {
  name = "SandAgentSectionNotFoundError";
};
function createHostRunnerComposition(deps) {
  const { extensions, environment, ctx } = deps;
  const auth2 = extensions.api("auth");
  const botTemplateShare = extensions.api("bot-template-share");
  const remoteAgentMessaging = extensions.api("remote-agent-messaging");
  const localToolPermission2 = extensions.api("local-tool-permission");
  const localToolPermissionSurfaces = /* @__PURE__ */ new Map();
  let mirrorOffloadPool = null;
  let transcriptJournal = null;
  const getMirrorOffloadPool = () => {
    mirrorOffloadPool ??= new TranscriptMirrorOffloadPool({
      reportHostLog: (level, line) => extensions.api("telemetry").logs.reportHostLog(level, line)
    });
    return mirrorOffloadPool;
  };
  const resolveAgentDisplayName = (agentId) => extensions.api("transcript").listAgentsSync().find((agent) => agent.id === agentId && !agent.isGroup)?.name ?? null;
  function createRunner(session, hooks, overrides) {
    const localExec = extensions.api("local-exec");
    const attachments = extensions.api("attachments");
    const memory = extensions.api("memory");
    const transcript = extensions.api("transcript");
    const experiments = extensions.api("experiments");
    const telemetryApi = extensions.api("telemetry");
    const analytics = telemetryApi.analytics;
    const navigationTelemetry = {
      telemetry: telemetryApi.brain,
      onBotBlock: (hit, record2) => {
        transcript.noteTurnBotBlock(
          record2.agentId,
          {
            family: hit.family,
            confidence: hit.confidence
          },
          record2.rootTurnId ?? record2.turnId
        );
        telemetryApi.analytics.trackEvent("sand.bot_block", {
          agent_id: record2.agentId,
          ...record2.subagentId === void 0 ? {} : { subagent_agent_id: record2.subagentId },
          family: hit.family,
          confidence: hit.confidence,
          blocked_host: hit.blockedHost,
          blocked_url: hit.blockedUrl
        });
      },
      onSiteVisited: (visit2, record2) => {
        telemetryApi.analytics.trackEvent("sand.site.visited", {
          agent_id: record2.agentId,
          ...record2.subagentId === void 0 ? {} : { subagent_agent_id: record2.subagentId },
          host: visit2.siteBucket,
          ...record2.turnId === void 0 ? {} : { request_id: record2.turnId },
          ...record2.rootTurnId === void 0 ? {} : { root_parent_request_id: record2.rootTurnId },
          ...visit2.webBotAuthSigned === void 0 ? {} : { web_bot_auth_signed: visit2.webBotAuthSigned }
        });
      },
      lookupWebBotAuthSigned: lookupWebBotAuthSignedDetail
    };
    const mcp = extensions.api("mcp");
    const credentialProvider = extensions.api("credential-provider");
    const sessionApi = extensions.api("session");
    const transcriptsDir = sessionApi.transcriptsDir();
    const settings = extensions.api("settings");
    const onRequestIdFor = (source) => (requestId2) => {
      hooks.transport.onUpdate({ type: "request-id", requestId: requestId2, source });
    };
    let runnerRef;
    const cloudAgents = extensions.api("cloud-agents");
    const autoReview = extensions.api("auto-review").bindRunner({
      agentId: session.id,
      approvalsResolvable: overrides?.groupMemberTurn !== true,
      onUpdate: (update) => hooks.transport.onUpdate(update)
    });
    localToolPermissionSurfaces.get(session.id)?.();
    localToolPermissionSurfaces.delete(session.id);
    if (overrides?.groupMemberTurn !== true) {
      localToolPermissionSurfaces.set(
        session.id,
        localToolPermission2.subscribe((event) => {
          if (event.request.agentId !== session.id) return;
          if (event.type === "created") {
            const machine = event.request.machineId === void 0 ? void 0 : localExec.userComputers.list().find((candidate) => candidate.id === event.request.machineId);
            hooks.transport.onUpdate({
              type: "send-message",
              message: {
                type: "local-tool-permission",
                ask: {
                  requestId: event.request.id,
                  action: event.request.action,
                  target: event.request.target,
                  ...event.request.machineId !== void 0 ? { machineId: event.request.machineId } : {},
                  ...machine !== void 0 ? { machineLabel: machine.label } : {},
                  ...event.request.targetKind !== void 0 ? { targetKind: event.request.targetKind } : {},
                  status: "pending",
                  ...event.request.description !== void 0 ? { description: event.request.description } : {},
                  ...event.request.recipientName !== void 0 ? { recipientName: event.request.recipientName } : {},
                  standingGrant: { kind: "unavailable", reason: "harness-cannot-persist" }
                }
              },
              timestampMs: Date.now()
            });
            return;
          }
          hooks.transport.onUpdate({
            type: "local-tool-permission-status",
            requestId: event.request.id,
            status: event.request.status === "pending" ? "expired" : event.request.status
          });
        })
      );
    }
    const remoteBox = extensions.api("forever-box").box;
    const buildRunner = deps.buildRunner ?? ((options2) => new SandAgentRunner(options2));
    const automationCompletions = createSandAutomationCompletionInbox(
      session.db.getPendingAutomationCompletions(),
      {
        onCommit: (completions) => {
          if (session.db.acknowledgeAutomationCompletions(
            completions.map((completion) => completion.id)
          )) {
            try {
              for (const pending of session.db.getPendingAutomationCompletions()) {
                automationCompletions.enqueue(pending);
              }
            } catch (error42) {
              telemetryApi.logs.reportSessionDiagnostic({
                family: "maintenance",
                kind: "automation_completion_refill_failed",
                agentId: session.id,
                errorClass: errorLogTag(error42)
              });
            }
            return;
          }
          throw new SandAutomationCompletionCheckpointError(
            `Failed to checkpoint ${completions.length} automation completions`
          );
        }
      }
    );
    const gates = composeBoxRunnerGates({
      spotlightOverride: environment.spotlightOverride,
      experiments,
      isCloudAgentsDisabledByTeamAdmin: () => cloudAgents.isDisabledByTeamAdmin(),
      isAgentEmailAllowedByTeamAdmin: () => extensions.api("email").isEnabled()
    });
    const cloudAgentPeer = (message) => ({
      id: message.bcId,
      name: message.name,
      kind: "cloud-agent"
    });
    const exchange = {
      recordOutbound: async (message) => transcript.appendAgentOutboundEntry(
        session.id,
        cloudAgentPeer(message),
        message.text,
        message.timestampMs,
        {
          ...message.images === void 0 ? {} : { images: message.images },
          ...message.attachments === void 0 ? {} : { attachments: message.attachments }
        }
      ),
      recordInbound: async (message) => transcript.appendAgentInboundEntry(
        session.id,
        cloudAgentPeer(message),
        message.text,
        message.timestampMs
      )
    };
    const runner = buildRunner({
      inference: extensions.api("inference").port,
      summaryTelemetry: telemetryApi.brain,
      browserTelemetry: telemetryApi.brain,
      computerTelemetry: telemetryApi.brain,
      loggerBackend: {
        log: (_ctx, entry) => {
          if (entry.level !== "warn" && entry.level !== "error") return;
          deps.log(entry.message);
        }
      },
      metricsBackend: telemetryApi.metrics,
      metricsHarness: "box",
      diskPressureReminder: extensions.api("forever-box").diskPressureReminder,
      box: localExec.box,
      remoteBox,
      userComputers: localExec.userComputers,
      remoteBoxHasDesktop: true,
      boxHandoff: {
        requestHelp: (request5) => extensions.api("session").startHandoff(request5)
      },
      userForm: {
        requestForm: (request5) => extensions.api("session").startUserForm(request5),
        listVaultKeys: () => extensions.api("user-form-vault").listKeys(),
        hasRemapHold: (agentId) => extensions.api("session").hasUserFormRemapHold(agentId),
        remapTargets: (args) => extensions.api("session").remapUserFormTargets(args)
      },
      cookieOriginApproval: {
        request: (request5) => extensions.api("cookie-origin-approval").request(request5)
      },
      virtualCard: {
        requestCard: (request5) => extensions.api("session").startVirtualCard(request5),
        retireCard: (args) => extensions.api("transcript").widgetResponses.retireSupersededVirtualCard(args)
      },
      messages: {
        enabled: () => settings.getMessagesEnabled(),
        run: (ctx2, op, display) => localExec.runMessagesOp(ctx2, op, void 0, display)
      },
      messagesGrants: {
        request: (ask) => extensions.api("messages-grants").request(ask)
      },
      onMessagesToolUse: (use) => telemetryApi.brain.reportMessagesTool({ conversationId: session.id, ...use }),
      transport: hooks.transport,
      subagentOwnership: hooks.subagentOwnership,
      onRunLifecycle: hooks.onRunLifecycle,
      requestContext: createHostRequestContext({
        transcriptsFolder: transcriptsDir,
        shell: environment.shell,
        resolveUserTimeZone: () => settings.getUserTimeZone(),
        resolveRules: () => extensions.api("managed-setup").resolveTeamRules(),
        resolveUserFullName: () => auth2.getUserFullName()
      }),
      transcriptMirror: (transcriptJournal ??= new FileTranscriptMirror(
        transcriptsDir,
        (report) => telemetryApi.brain.reportJournalOutcome(report)
      )).routed(
        OffloadingTranscriptMirror.forTranscriptsDir(
          () => getMirrorOffloadPool(),
          {
            transcriptsDir,
            blobDbPaths: [sessionApi.conversationBlobsPath(session.dbPath), session.dbPath]
          },
          session.agentStore.getConversationStateStructure().rootPromptMessagesJson.length
        ),
        () => experiments.checkGate("sand_new_transcript_journal", { disableExposureLog: true })
      ),
      mcp: mcp.mcpForAgent(session.id, gates),
      mcpManagement: mcp.management,
      ...credentialProvider.access === void 0 ? {} : { credentialAccess: credentialProvider.access },
      ...credentialProvider.status === void 0 ? {} : { credentialProviderStatus: credentialProvider.status },
      ...credentialProvider.agentToolLease === void 0 ? {} : { credentialFillLease: credentialProvider.agentToolLease },
      agentState: memory.createAgentState({
        memory: session.memory,
        automations: session.automations,
        skills: session.skills,
        channels: session.channels,
        agentDir: (0, import_node_path180.dirname)(session.dbPath),
        agentId: session.id,
        readBoxFile: (boxPath) => remoteBox.downloadFile(ctx, session.id, boxPath)
      }),
      localToolPermission: localToolPermission2,
      ...autoReview,
      trustsAutomationWrites: () => transcript.activeTemplateSetupWriteProvenance(session.id) !== SAND_AUTOMATION_WRITE_PROVENANCE_UNTRUSTED,
      automationWriteProvenance: () => transcript.activeTemplateSetupWriteProvenance(session.id) === SAND_AUTOMATION_WRITE_PROVENANCE_TEMPLATE_IMPORT ? SAND_AUTOMATION_WRITE_PROVENANCE_TEMPLATE_IMPORT : void 0,
      canReviewAutomationWrites: () => true,
      actionAuditor: extensions.api("action-audit"),
      navigationTelemetry,
      webSearchService: extensions.api("inference").createWebSearch({
        modelId: environment.agentModelOverride ?? DEFAULT_SAND_MODEL,
        onRequestId: onRequestIdFor("web-search")
      }),
      webFetchService: extensions.api("inference").createWebFetch({
        onRequestId: onRequestIdFor("web-fetch")
      }),
      generateImageService: attachments.createGenerateImageService({
        persistImage: hooks.persistImage,
        onRequestId: onRequestIdFor("generate-image")
      }),
      generateImageResourceAccessor: attachments.createGenerateImageResourceAccessor(
        (0, import_node_path180.dirname)(session.dbPath)
      ),
      getAgentDir: () => (0, import_node_path180.dirname)(session.dbPath),
      onComputerAction: ({ agentId, action }) => deps.emitGatewayEvent({
        channel: "computer-action",
        payload: { agentId, ...action }
      }),
      agentStore: session.agentStore,
      conversationSizeGuard: () => sessionApi.store.ensureConversationCapacityForTurn(session),
      memoryStore: session.memory,
      userMemory: memory.createUserMemory({
        agentId: session.id,
        resolveAgentName: (agentId) => resolveAgentDisplayName(agentId)
      }),
      memorySnapshots: session.db,
      profilePromptSnapshots: session.db,
      promptPrefixSnapshots: session.db,
      promptSectionSnapshots: session.db,
      episodeProgress: session.db,
      systemPrompt: overrides?.systemPrompt,
      baseSystemPromptOverride: () => experiments.getDynamicConfig("grok_bot_system_prompt_override", {
        disableExposureLog: true
      }).basePrompt,
      automationStore: session.automations,
      automationCompletions,
      gates,
      loopDetectionMode: () => parseSandLoopDetectionMode(
        experiments.getDynamicConfig("grok_bot_loop_detection", {
          disableExposureLog: true
        }).mode
      ),
      onLoopDetected: (report) => telemetryApi.brain.reportAgentLoopDetected(report),
      onLoopMitigation: (report) => telemetryApi.brain.reportAgentLoopMitigation(report),
      isListenerPlatformConnected: (platform2) => extensions.api("automations").isListenerPlatformConnected(platform2),
      registerScmConnectWait: async ({ provider, intent, repoSlug, cardProvider }) => {
        if (!isConnectCardPlatform(provider)) return;
        await extensions.api("automations").watchScmConnect({
          agentId: session.id,
          platform: provider,
          ...intent == null ? {} : { intent },
          ...repoSlug == null ? {} : { repoSlug },
          ...cardProvider == null ? {} : { cardProvider }
        });
      },
      scmWriteBlockedReason: async () => transcript.scmConnectLaunchBlockedReason(session.id),
      streamTuning: environment.streamTuning,
      streamDeadlineConfig: () => ({
        rollingIdleEnabled: experiments.checkFeatureGate("sand_stream_idle_deadline", {
          disableExposureLog: true
        }),
        ...experiments.getDynamicConfig("sand_stream_deadline_config", {
          disableExposureLog: true
        })
      }),
      skillStore: session.skills,
      channelStore: session.channels,
      connectorManifests: CONNECTOR_MANIFESTS,
      agentProfileProvider: hooks.agentProfileProvider,
      ingestAttachment: hooks.ingestAttachment,
      persistImage: hooks.persistImage,
      persistMediaBytes: hooks.persistMediaBytes,
      readVideoAttachmentBytes: attachments.readVideoBytes,
      readMediaDimensions: attachments.readMediaDimensions,
      getAgentId: () => session.id,
      connectedActivity: createCursorConnectedActivityPort(cloudAgents, {
        isAvailable: () => overrides?.groupMemberTurn !== true && transcript.activeTurnActsAsBoxOwner(session)
      }),
      createCloudAgentTool: (options2) => createCloudAgentTool({
        api: cloudAgents,
        launchedIds: cloudAgents.launchedIds,
        canvasCursorAgentIds: cloudAgents.canvasCursorAgentIds,
        hiddenCursorAgentCardIds: cloudAgents.hiddenCursorAgentCardIds,
        isCanvasesEnabled: options2.isCanvasesEnabled,
        artifactsEnabled: options2.artifactsEnabled,
        ...options2.exchangeEnabled ? { exchange } : {},
        watch: (bcId, watchOptions) => runnerRef?.watchCloudAgent(bcId, watchOptions),
        writeBoxFile: (toolCtx, boxPath, data) => remoteBox.uploadFile(toolCtx, session.id, boxPath, data),
        agentDir: (0, import_node_path180.dirname)(session.dbPath),
        readBoxFile: (toolCtx, boxPath, options3) => remoteBox.downloadFile(toolCtx, session.id, boxPath, options3),
        harness: "box",
        onLaunched: (info2) => analytics.trackEvent("sand.cloud_agent.launched", {
          agent_id: session.id,
          bc_id: info2.bcId,
          ...info2.model != null && info2.model.length > 0 ? { model: info2.model } : {},
          harness: "box"
        }),
        onFollowupSent: (info2) => analytics.trackEvent("sand.cloud_agent.followup_sent", {
          agent_id: session.id,
          bc_id: info2.bcId,
          interrupt: info2.interrupt,
          ...info2.model != null && info2.model.length > 0 ? { model: info2.model } : {},
          harness: "box"
        }),
        ...options2.fallbackLineage !== void 0 ? { fallbackLineage: options2.fallbackLineage } : {},
        ...options2.reviewAction !== void 0 ? { reviewAction: options2.reviewAction } : {},
        ...options2.describeScmConnect !== void 0 ? { describeScmConnect: options2.describeScmConnect } : {},
        ...options2.scmConnectCard !== void 0 ? { scmConnectCard: options2.scmConnectCard } : {},
        launchBlockedReason: async () => transcript.scmConnectLaunchBlockedReason(session.id)
      }),
      cloudAgentWatcher: {
        awaitCompletion: async (bcId, options2) => {
          if (options2?.hiddenCard === true) {
            cloudAgents.hiddenCursorAgentCardIds.add(bcId);
          }
          const result = await cloudAgents.awaitCompletion(bcId, options2);
          analytics.trackEvent("sand.cloud_agent.completed", {
            agent_id: session.id,
            bc_id: bcId,
            outcome: result.status,
            harness: "box"
          });
          const artifactsEnabled = experiments.checkFeatureGate("sand_cloud_agent_artifacts", {
            disableExposureLog: true
          });
          const augmented = await augmentCloudAgentWatchResult({
            result,
            api: cloudAgents,
            writeBoxFile: (boxPath, data) => remoteBox.uploadFile(ctx, session.id, boxPath, data),
            bcId,
            artifactsEnabled,
            syncArtifacts: (planned) => cloudAgents.artifacts.syncPlanned(session.id, bcId, planned),
            metrics: { ctx: ctx.with(metricsKey, telemetryApi.metrics), harness: "box" }
          });
          if (gates.cloudAgentExchange() && !cloudAgents.hiddenCursorAgentCardIds.has(bcId)) {
            try {
              await exchange.recordInbound({
                bcId,
                name: result.name ?? bcId,
                text: cloudAgentExchangeReportText(result),
                timestampMs: Date.now()
              });
            } catch (error42) {
              deps.log(
                `sand.cloud_agent.exchange_record_failed agent_id=${session.id} bc_id=${bcId} error_class=${errorLogTag(error42)}`
              );
            }
          }
          return augmented;
        }
      },
      resolveCloudAgentTitle: async (_ctx, bcId) => (await cloudAgents.get(bcId))?.name,
      canvasCursorAgentIds: cloudAgents.canvasCursorAgentIds,
      hiddenCursorAgentCardIds: cloudAgents.hiddenCursorAgentCardIds,
      sendToAgent: async (toAgentId, text2, images, priority) => {
        const target = transcript.listAgentsSync().find((agent) => agent.id === toAgentId);
        const store = extensions.api("session").store;
        const profilePath = store.agentDirExists(toAgentId) ? getSandProfilePath(store.getAgentDir(toAgentId)) : void 0;
        const profile = profilePath !== void 0 && (0, import_node_fs101.existsSync)(profilePath) ? parseProfileJson((0, import_node_fs101.readFileSync)(profilePath, "utf8")) : void 0;
        if (profile === null) return "Cannot message this agent: invalid profile.";
        const harness = profile?.harness ?? target?.harness;
        if (harness != null && harness !== "box" && harness !== "temporal") {
          return "Cannot message this agent: unsupported harness.";
        }
        if (harness === "temporal" || target === void 0 && profile === void 0 && remoteAgentMessaging.isEnabled()) {
          return await transcript.sendToRemotePeer({
            fromAgentId: session.id,
            toAgentId,
            text: text2,
            images,
            priority,
            deliver: (send) => remoteAgentMessaging.sendToRemoteAgent(send)
          });
        }
        return await transcript.sendToAgent(session.id, toAgentId, text2, images, priority);
      },
      submitProductFeedback: (args) => extensions.api("feedback").submitProductFeedback(args),
      getCycleUsage: () => extensions.api("cycle-usage").getCycleUsage(),
      ...extensions.api("email").isEnabled() ? { email: extensions.api("email").email } : {},
      agentDirectory: () => transcript.listAgentsSync().filter((agent) => agent.id !== session.id && !agent.isGroup).map((agent) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description
      })),
      agentGroups: () => {
        const roster = transcript.listAgentsSync();
        const byId = new Map(roster.map((agent) => [agent.id, agent]));
        return roster.filter((agent) => agent.isGroup && agent.memberIds.includes(session.id)).map((group) => ({
          id: group.id,
          name: group.name,
          members: group.memberIds.filter((memberId) => memberId !== session.id).flatMap((memberId) => {
            const member = byId.get(memberId);
            return member != null ? [member] : [];
          }).map((member) => ({
            id: member.id,
            name: member.name,
            description: member.description
          }))
        }));
      },
      botTemplateShare: botTemplateShare == null ? void 0 : /* @__PURE__ */ (() => {
        let currentShareScope;
        const getPolicy = () => {
          const peek = { disableExposureLog: true };
          return sandShareBotExportPolicyOf(
            typeof experiments.getDynamicConfig === "function" ? experiments.getDynamicConfig("sand_share_bot_export_policy", peek) : void 0
          );
        };
        const resolveLiveShareScope = async () => {
          const teamId = typeof auth2.getTeamId === "function" ? await auth2.getTeamId() : void 0;
          let parentVisibility;
          if (typeof botTemplateShare.getForSourceAgent === "function") {
            try {
              const view = await botTemplateShare.getForSourceAgent({
                sourceAgentId: session.id
              });
              if (isSandBotTemplateVisibility(view?.visibility)) {
                parentVisibility = view.visibility;
              } else if (typeof botTemplateShare.peekForSourceAgent === "function") {
                const peeked = botTemplateShare.peekForSourceAgent({
                  sourceAgentId: session.id
                });
                if (isSandBotTemplateVisibility(peeked?.visibility)) {
                  parentVisibility = peeked.visibility;
                }
              }
            } catch (error42) {
              void errorLogTag(error42);
              const policyOnFailure = botTemplateShare.peekExportPolicy?.() ?? getPolicy();
              if (policyOnFailure === "none") {
                return { kind: "disabled" };
              }
              return void 0;
            }
          }
          const policy = botTemplateShare.peekExportPolicy?.() ?? getPolicy();
          if (policy === "none") {
            return { kind: "disabled" };
          }
          return resolveBotTemplateShareScope({
            policy,
            hasTeam: resolvedShareScopeHasTeam({
              serverHasTeam: botTemplateShare.peekHasTeam?.(),
              selectedTeamId: teamId
            }),
            parentVisibility
          });
        };
        const getShareScope = async () => {
          currentShareScope = await resolveLiveShareScope();
          return currentShareScope;
        };
        const peekShareScope = () => currentShareScope;
        const prepareShareScope = async () => {
          currentShareScope = await resolveLiveShareScope();
        };
        return {
          create: async (input, signal) => {
            if (input.blob == null) return botTemplateShare.create(input, signal);
            const parsed2 = parseBotTemplateRecipeBlob(input.blob);
            if (parsed2.kind === "not-a-recipe") {
              return botTemplateShare.create(input, signal);
            }
            if (parsed2.kind === "refused") {
              telemetryApi.logs.reportHostExtensionDiagnostic({
                extension: "bot_template_share",
                errorClass: errorLogTag(parsed2.error)
              });
              throw parsed2.error;
            }
            const recipe = packMemoriesIntoRecipe(
              packPluginsIntoRecipe(
                packAutomationsIntoRecipe(
                  packUserSkillsIntoRecipe(parsed2.recipe, session.skills.list()),
                  session.automations.listDefinitions()
                ),
                await mcp.management.listPlugins()
              )
            );
            return botTemplateShare.create(
              {
                ...input,
                blob: {
                  bytes: encodeBotTemplateRecipe(recipe),
                  contentType: BOT_TEMPLATE_RECIPE_CONTENT_TYPE
                }
              },
              signal
            );
          },
          prepareShareScope,
          getShareScope,
          peekShareScope
        };
      })(),
      getSourceAvatar: () => {
        const agent = transcript.listAgentsSync().find((row) => row.id === session.id);
        if (grokBotHasCustomPicture(agent ?? {})) {
          return {};
        }
        const mark = resolveGrokBotMark({
          agentId: session.id,
          avatarShape: agent?.avatarShape,
          avatarColor: agent?.avatarColor
        });
        return {
          avatarShape: mark.shape,
          avatarColor: mark.color
        };
      },
      agentManagement: {
        listSections: async () => settings.listSidebarSections().map(({ id, name: name17 }) => ({ id, name: name17 })),
        create: async (input) => {
          if (input.sectionId !== void 0 && !settings.listSidebarSections().some((section) => section.id === input.sectionId)) {
            throw new SandAgentSectionNotFoundError(
              `No sidebar section found with id ${input.sectionId}.`
            );
          }
          const { agent } = await transcript.createBackgroundAgent(
            { name: input.name, description: input.description },
            "user"
          );
          extensions.api("agent-identity").noteAgentMinted(agent.id);
          if (input.sectionId !== void 0 && settings.assignAgentToSidebarSection(agent.id, input.sectionId) === null) {
            throw new SandAgentSectionNotFoundError(
              `No sidebar section found with id ${input.sectionId}.`
            );
          }
          return {
            id: agent.id,
            name: agent.name,
            description: agent.description
          };
        },
        update: async (id, patch) => {
          const current = (await transcript.listAgents()).find((agent) => agent.id === id);
          if (current == null || current.isGroup) return null;
          const summary = await transcript.updateAgent(id, {
            name: patch.name ?? current.name,
            description: patch.description ?? current.description
          });
          return summary == null ? null : {
            id: summary.id,
            name: summary.name,
            description: summary.description
          };
        }
      },
      channelManagement: {
        create: async (input) => {
          const summary = await transcript.createGroupInBackground({
            name: input.name,
            memberIds: input.memberIds
          });
          const roster = transcript.listAgentsSync();
          const members = summary.memberIds.flatMap((memberId) => {
            const member = roster.find((agent) => agent.id === memberId);
            return member == null ? [] : [{ id: member.id, name: member.name, description: member.description }];
          });
          return {
            channel: {
              id: summary.id,
              name: summary.name,
              description: summary.description,
              isGroup: true
            },
            members
          };
        },
        members: (channelId) => {
          const roster = transcript.listAgentsSync();
          const channel = roster.find((agent) => agent.id === channelId && isLocalGroup(agent));
          if (channel == null || !channel.memberIds.includes(session.id)) return null;
          return channel.memberIds.flatMap((memberId) => {
            const member = roster.find((agent) => agent.id === memberId);
            return member == null ? [] : [{ id: member.id, name: member.name, description: member.description }];
          });
        },
        setMembers: async (channelId, memberIds) => {
          const channel = transcript.listAgentsSync().find((agent) => agent.id === channelId && isLocalGroup(agent));
          if (channel == null || !channel.memberIds.includes(session.id)) return null;
          const summary = await transcript.setGroupMembers(channelId, memberIds);
          return summary == null ? null : {
            id: summary.id,
            name: summary.name,
            description: summary.description,
            isGroup: true
          };
        }
      },
      agentsRootDir: () => (0, import_node_path180.dirname)((0, import_node_path180.dirname)(session.dbPath))
    });
    runnerRef = runner;
    return runner;
  }
  return {
    createRunner: (session, hooks) => createRunner(session, hooks),
    createGroupMemberRunner: (session, hooks) => createRunner(session, hooks, {
      groupMemberTurn: true
    }),
    canAskLocalToolPermission: (agentId) => localToolPermissionSurfaces.has(agentId),
    forgetLocalToolPermission: (agentId) => {
      localToolPermissionSurfaces.get(agentId)?.();
      localToolPermissionSurfaces.delete(agentId);
      localToolPermission2.forgetAgent(agentId);
    },
    dispose: async () => {
      for (const unsubscribe of localToolPermissionSurfaces.values()) {
        unsubscribe();
      }
      localToolPermissionSurfaces.clear();
      await mirrorOffloadPool?.closeAll();
      mirrorOffloadPool = null;
    }
  };
}
