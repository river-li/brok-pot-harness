var HUB_RECONCILE_INTERVAL_MS = 15e3;
var RELAY_POLL_INTERVAL_MS = 4e3;
var CONNECT_WATCH_POLL_INTERVAL_MS = 5e3;
function getBoxUptimeMs(bootStartedAtMs) {
  return Number.isFinite(bootStartedAtMs) && bootStartedAtMs > 0 ? Math.max(0, Date.now() - bootStartedAtMs) : void 0;
}
function reconcileWhenAuthenticated({
  auth: auth2,
  reconcile
}) {
  let hasReconciled = false;
  const reconcileOnce = () => {
    if (hasReconciled || auth2.peekAccessToken() === null) return;
    hasReconciled = true;
    reconcile();
  };
  const unsubscribe = auth2.subscribeToRenewal(reconcileOnce);
  reconcileOnce();
  return unsubscribe;
}
function isBoxHostedForAutomationSync(hosting) {
  if (hosting.onSessionBox) return false;
  if (hosting.harness !== null) return hosting.harness === "box";
  return !hosting.isServerBacked;
}
function boxHostedAutomationSources(args) {
  const boxHostedAgentIds = async () => new Set(
    (await args.listAgentIds()).filter(
      (agentId) => isBoxHostedForAutomationSync(args.readHosting(agentId))
    )
  );
  return {
    listAgentIds: async () => [...await boxHostedAgentIds()],
    listAutomations: async () => {
      const agentIds = await boxHostedAgentIds();
      return (await args.listAutomations()).filter((scheduled) => agentIds.has(scheduled.agentId));
    }
  };
}
var automationsExtension = defineHostExtension({
  id: "automations",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.Experiments,
    HostExtensions.Settings,
    HostExtensions.Telemetry,
    HostExtensions.Transcript,
    HostExtensions.Trays,
    HostExtensions.TurnExecution,
    HostExtensions.NotifyBus
  ],
  start: (context2) => {
    const transcript = context2.deps.transcript;
    const auth2 = context2.deps.auth;
    const { backend, sessionBox } = context2.host.environment;
    const notifyBus = context2.deps["notify-bus"];
    const isReady = () => context2.deps["turn-execution"].isRunReady();
    const automationSyncFailureTrayIds = /* @__PURE__ */ new Map();
    let notifySchedulingAuthorityChanged = () => {
    };
    const readHosting = (agentId) => {
      const profilePath = getSandProfilePath((0, import_node_path98.join)(getSandAgentsRootDir(), agentId));
      return {
        harness: readSandProfileHarness(profilePath),
        isServerBacked: readSandProfileServerId(profilePath) !== null,
        onSessionBox: sessionBox
      };
    };
    const credentialService = new SandWebhookCredentialService({
      client: createSandCursorBackendClient(DashboardService, {
        backend,
        getAccessToken: auth2.getAccessToken,
        getTeamId: auth2.getTeamId,
        getMachineId: async () => await auth2.getMachineId()
      }),
      backend,
      log: context2.host.log
    });
    const boxHostedSources = boxHostedAutomationSources({
      listAgentIds: () => transcript.listAgentIds(),
      readHosting,
      listAutomations: () => transcript.listAllAutomationDefinitions()
    });
    const relay = createBackendRelaySources({
      backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      polling: createPollingPolicy2({
        name: "automations.relay-poll",
        intervalMs: RELAY_POLL_INTERVAL_MS
      }),
      isNotifyConnected: () => notifyBus.isConnected(),
      isNotifySafetyPollEnabled: () => notifyBus.isSafetyPollEnabled()
    });
    const automationsClient = createSandCursorBackendClient(AutomationsService, {
      backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      getMachineId: async () => await auth2.getMachineId()
    });
    const cloudSync = new SandAutomationCloudSync({
      client: automationsClient,
      reportDiagnostic: (diagnostic) => context2.deps.telemetry.logs.reportHostExtensionDiagnostic(diagnostic),
      hasCredential: () => auth2.peekAccessToken() !== null,
      listAgentIds: boxHostedSources.listAgentIds,
      listAutomations: boxHostedSources.listAutomations,
      getTimeZone: () => context2.deps.settings.getUserTimeZone(),
      isGithubSubscribed: relay.isGithubSubscribed,
      ensureWebhookKeys: (automationIds) => credentialService.ensureKeys(automationIds),
      dropWebhookKeys: (automationIds) => credentialService.dropKeys(automationIds),
      inspectLocalDefinitions: (agentId) => inspectAgentAutomationDefinitions((0, import_node_path98.join)(getSandAgentsRootDir(), agentId)),
      reportShadowPrune: (report) => context2.deps.telemetry.logs.reportAutomationShadowPrune({
        ...report,
        boxUptimeMs: getBoxUptimeMs(context2.host.environment.boxBoot.startedAtMs)
      }),
      onFailure: (failure2) => {
        const agentId = failure2.agentId;
        if (agentId === void 0 || automationSyncFailureTrayIds.has(agentId)) return;
        const tray = context2.deps.trays.pushError({
          agentId,
          ...hostTrayTitle({ kind: "routine_sync_failed" }),
          errorKind: "routine_sync_failed"
        });
        automationSyncFailureTrayIds.set(agentId, tray.id);
      },
      onRecovery: (agentId) => {
        const trayId = automationSyncFailureTrayIds.get(agentId);
        if (trayId === void 0) return;
        context2.deps.trays.dismiss({ id: trayId });
        automationSyncFailureTrayIds.delete(agentId);
      },
      onSchedulingAuthorityChanged: () => {
        notifySchedulingAuthorityChanged();
      }
    });
    const fireConsumer = new SandAutomationFireConsumer({
      backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      getTimeZone: () => context2.deps.settings.getUserTimeZone(),
      getBoxUptimeMs: () => getBoxUptimeMs(context2.host.environment.boxBoot.startedAtMs),
      isReady,
      isBoxHostedAgent: (agentId) => isBoxHostedForAutomationSync(readHosting(agentId)),
      listAutomations: () => transcript.listAllAutomationDefinitions(),
      fire: (args) => transcript.runServerScheduledAutomation(args),
      fireForEvent: (args) => transcript.runServerAutomationForEvent(args),
      hasPendingAutomationSubagentRun: (runUuid) => transcript.hasPendingAutomationSubagentRun(runUuid),
      telemetry: context2.deps.telemetry.brain,
      isNotifyConnected: () => notifyBus.isConnected(),
      isNotifySafetyPollEnabled: () => notifyBus.isSafetyPollEnabled(),
      log: context2.host.log
    });
    transcript.setAutomationRunCompletionReporter(
      (completion) => fireConsumer.reportRecoveredSubagentCompletion(completion)
    );
    context2.onStop(
      notifyBus.onNotify("automation-fires", () => {
        fireConsumer.requestDrain();
      })
    );
    context2.onStop(
      notifyBus.onNotify("listener-events", () => {
        relay.requestDrain();
      })
    );
    const hub = new SandTriggerHub({
      polling: createPollingPolicy2({
        name: "automations.hub-reconcile",
        intervalMs: HUB_RECONCILE_INTERVAL_MS
      }),
      sources: [relay.slack, relay.github, relay.origin],
      listAutomations: () => transcript.listAllAutomationDefinitions(),
      fire: (agentId, automation, event) => transcript.runAutomationForEvent(agentId, automation, event),
      isReady,
      log: context2.host.log,
      shouldScheduleLocally: (agentId, automation, event) => cloudSync.shouldScheduleLocally({ agentId, automation }, event),
      onReconcile: () => {
        void cloudSync.reconcileNow();
        void fireConsumer.tick();
      }
    });
    notifySchedulingAuthorityChanged = () => {
      void hub.reconcileNow();
    };
    const listenerReads = createListenerIntegrationReads({
      backend,
      auth: auth2,
      transcript,
      sourceStatuses: () => hub.getSourceStatuses(),
      log: context2.host.log,
      isDesktopScmConnectEnabled: () => context2.deps.experiments.checkFeatureGate("sand_desktop_scm_connect", {
        disableExposureLog: true
      })
    });
    const watcher = new ListenerConnectWatcher({
      polling: createPollingPolicy2({
        name: "automations.connect-watch",
        intervalMs: CONNECT_WATCH_POLL_INTERVAL_MS
      }),
      isPlatformConnected: (platform2) => listenerReads.isPlatformConnected(platform2),
      onConnected: (agentId, platform2) => {
        void transcript.resumeAfterListenerConnect(agentId, platform2);
      }
    });
    const scmConnectWatcher = new ListenerConnectWatcher({
      polling: createPollingPolicy2({
        name: "automations.scm-connect-watch",
        intervalMs: CONNECT_WATCH_POLL_INTERVAL_MS
      }),
      isPlatformConnected: (platform2) => listenerReads.isPlatformConnected(platform2),
      onConnected: (agentId, platform2, grantedRepo) => {
        void transcript.resumeAfterScmConnect({ agentId, platform: platform2, grantedRepo });
      }
    });
    relay.scmConnect.start((event) => {
      const { provider } = event;
      if (!isConnectCardPlatform(provider)) return;
      for (const agentId of event.agentIds) {
        const watchLostToRestart = !scmConnectWatcher.completesOnGrant(
          provider,
          agentId,
          event.repo
        );
        if (!watchLostToRestart) continue;
        scmConnectWatcher.watch({
          agentId,
          platform: provider,
          ...event.repo == null ? {} : { repoSlug: event.repo }
        });
      }
      scmConnectWatcher.notifyHandoff(provider, {
        connected: true,
        ...event.agentIds.length === 0 ? {} : { agentIds: event.agentIds },
        ...event.repo == null ? {} : { grantedRepos: [event.repo] }
      });
    });
    const offConfigChanged = context2.host.events.on("transcript.automation-config-changed", () => {
      fireConsumer.resetPollDelay();
      void hub.reconcileNow();
    });
    const offConnectCard = context2.host.events.on(
      "transcript.listener-connect-card",
      ({ agentId, platform: platform2 }) => {
        watcher.watch({ agentId, platform: platform2 });
      }
    );
    hub.start();
    const stopAuthenticatedReconcile = reconcileWhenAuthenticated({
      auth: auth2,
      reconcile: () => {
        void hub.reconcileNow();
      }
    });
    context2.onStop(async () => {
      stopAuthenticatedReconcile();
      offConfigChanged();
      offConnectCard();
      watcher.dispose();
      scmConnectWatcher.dispose();
      relay.scmConnect.stop();
      transcript.setAutomationRunCompletionReporter(void 0);
      fireConsumer.stop();
      await hub.stop();
    });
    return {
      sourceStatuses: () => hub.getSourceStatuses(),
      suspendWakes: async () => {
        watcher.suspend();
        scmConnectWatcher.suspend();
        fireConsumer.stop();
        await hub.stop();
      },
      resumeWakes: () => {
        watcher.resume();
        scmConnectWatcher.resume();
        hub.start();
        fireConsumer.start();
      },
      deleteAgentSchedules: (agentId) => cloudSync.deleteAgent(agentId),
      getWebhookCredential: async ({ agentId, localId }) => {
        const automation = (await transcript.getAgentAutomations(agentId)).find(
          (candidate) => candidate.id === localId
        );
        assertWebhookCredentialTarget(automation, localId);
        return credentialService.getCredential({ agentId, localId });
      },
      runNowInSession: (args) => runSandAutomationNowInSession(
        {
          client: automationsClient,
          listAutomations: () => transcript.listAllAutomationDefinitions()
        },
        args
      ),
      reconcileNow: () => hub.reconcileNow(),
      getListenerIntegrations: async () => {
        const view = await listenerReads.getIntegrations();
        const granted = scmConnectWatcher.grantedRepos();
        if (granted.length === 0) return view;
        return {
          ...view,
          integrations: view.integrations.map(
            (entry) => entry.platform === "github" ? { ...entry, grantedRepos: granted } : entry
          )
        };
      },
      getListenerConnectUrl: (platform2, options2) => listenerReads.getConnectUrl(platform2, options2),
      disconnectListenerPlatform: (platform2) => listenerReads.disconnectPlatform(platform2),
      completeGithubConnect: async (args) => {
        const result = await listenerReads.completeGithubConnect(args);
        if (result.outcome === "connected" || result.outcome === "pending_approval") {
          scmConnectWatcher.notifyHandoff(scmConnectPlatformForState(args.state), {
            connected: result.outcome === "connected"
          });
        }
        return result;
      },
      isListenerPlatformConnected: (platform2) => listenerReads.isPlatformConnected(platform2),
      watchScmConnect: async (watch4) => {
        const completesOnlyOnPushedGrant = watch4.repoSlug != null;
        if (watch4.platform !== "origin" && watch4.platform !== "slack") {
          try {
            await relay.registerScmConnectWait({
              agentId: watch4.agentId,
              provider: watch4.platform,
              ...watch4.intent == null ? {} : { intent: watch4.intent },
              ...watch4.repoSlug == null ? {} : { repoSlug: watch4.repoSlug },
              ...watch4.cardProvider == null ? {} : { cardProvider: watch4.cardProvider }
            });
          } catch (error41) {
            if (completesOnlyOnPushedGrant) throw error41;
            context2.host.log(
              `scm-connect wait not registered with the backend: ${errorLogTag(error41)}`
            );
          }
        }
        scmConnectWatcher.watch(watch4);
      },
      getAgentChannels: (agentId) => listenerReads.getAgentChannels(agentId)
    };
  }
});
