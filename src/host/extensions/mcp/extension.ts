function startPluginSkillsWhenAuthenticated(options2) {
  let started2 = false;
  let disposed = false;
  let pollingHandle;
  const start = () => {
    if (started2 || disposed) return;
    started2 = true;
    let isFirstTick = true;
    pollingHandle = options2.polling.start(async () => {
      const trigger2 = isFirstTick ? "startup" : "refresh";
      isFirstTick = false;
      try {
        await options2.service.sync(trigger2);
      } catch {
        return;
      }
      if (trigger2 === "startup" && !disposed) options2.onStartupSyncSucceeded();
    });
  };
  const handleRenewal = (event) => {
    if (disposed || event.outcome !== "renewed") return;
    if (!started2) {
      if (options2.auth.peekAccessToken() !== null) start();
      return;
    }
    if (event.isFirstCredential) options2.service.handleAuthChange();
  };
  const unsubscribe = options2.auth.subscribeToRenewal(handleRenewal);
  if (options2.auth.peekAccessToken() !== null) start();
  return () => {
    if (disposed) return;
    disposed = true;
    unsubscribe();
    pollingHandle?.dispose();
  };
}
var mcpExtension = defineHostExtension({
  id: "mcp",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.Experiments,
    HostExtensions.ForeverBox,
    HostExtensions.Settings,
    HostExtensions.Telemetry
  ],
  start: async (context2) => {
    pinMcpDiagnosticsReporter(
      (failure2) => context2.deps.telemetry.logs.reportHostExtensionDiagnostic({
        extension: "mcp",
        ...failure2
      })
    );
    try {
      const result = await cleanupLegacyMcpAuthCredentials(getSandRootDir());
      context2.deps.telemetry.logs.reportMcpAuthCleanup(result.outcome, result.removedCount);
    } catch {
    }
    const sandRootDir = getSandRootDir();
    const { backend } = context2.host.environment;
    const pluginSkills = new SandPluginSkillsService({
      sandRootDir,
      load: createSharedInstalledPluginsLoader({
        sandRootDir,
        backend,
        auth: context2.deps.auth,
        log: context2.host.log,
        isSparsePluginClonesEnabled: () => context2.deps.experiments.isSparsePluginClonesEnabled()
      }),
      log: context2.host.log,
      reportSync: (report) => context2.deps.telemetry.logs.reportPluginSkillsSync(report)
    });
    const stopPluginSkillsStartup = startPluginSkillsWhenAuthenticated({
      auth: context2.deps.auth,
      service: pluginSkills,
      polling: createPollingPolicy2({
        name: "sand-plugin-skills-refresh",
        intervalMs: PLUGIN_SKILLS_REFRESH_INTERVAL_MS
      }),
      onStartupSyncSucceeded: () => {
        void sweepLegacyPluginSkillReferences({
          sandRootDir,
          backend,
          auth: context2.deps.auth,
          log: context2.host.log
        });
      }
    });
    const service = createMcpService({
      isCatalogServerStatusDisabled: () => context2.deps.experiments.checkFeatureGate("grok_bot_mcp_catalog_status_killswitch", {
        disableExposureLog: true
      }),
      backend,
      auth: context2.deps.auth,
      foreverBox: context2.deps["forever-box"],
      settings: context2.deps.settings,
      log: context2.host.log,
      onDiscoveryFailed: (failure2) => context2.deps.telemetry.logs.reportMcpDiscoveryFailed(failure2),
      onConnectorAuth: (report) => {
        context2.deps.telemetry.logs.reportConnectorAuth(report);
        context2.deps.telemetry.analytics.trackEvent(
          "sand.connector_auth",
          connectorAuthAnalyticsProps(report, "host")
        );
      },
      pluginSkills: {
        sync: async (trigger2) => (await pluginSkills.sync(trigger2)).map(toPluginSkillInfo),
        status: () => ({ authBlocked: pluginSkills.currentAuthBlocked() }),
        removeLiveReferences: (sourceUrls) => removeSkillLiveReferences(sandRootDir, sourceUrls)
      }
    });
    const skillPublish = new SandSkillPublishService({
      sandRootDir,
      client: createSandSkillPublishClient({ backend, auth: context2.deps.auth }),
      pluginSkills,
      readMemberPublishMarketplaces: () => service.readMemberPublishMarketplaces(),
      log: context2.host.log,
      reportEdgeFailed: (failure2) => context2.deps.telemetry.logs.reportSkillPublishEdgeFailed(failure2)
    });
    context2.onStop(() => {
      stopPluginSkillsStartup();
      pluginSkills.dispose();
      return service.dispose();
    });
    return { ...service.api, skillPublish };
  }
});
