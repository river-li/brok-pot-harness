var experimentsExtension = defineHostExtension({
  id: "experiments",
  dependencies: [HostExtensions.Auth, HostExtensions.Settings],
  start: (context2) => {
    const auth2 = context2.deps.auth;
    const environment = context2.host.environment;
    const service = new SandExperimentService({
      backend: environment.backend,
      featureGateOverrides: environment.featureGateOverrides,
      modelExperimentOverride: environment.modelExperimentOverride,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      getMachineId: auth2.getMachineId,
      getCacheDir: () => getSandRootDir(),
      isDevBuild: !environment.packaged || environment.hostDevErrorDetail,
      dynamicConfigOverrides: environment.dynamicConfigOverrides,
      lessSubagentFanoutExperimentOverride: environment.lessSubagentFanoutExperimentOverride,
      updateCommunicationExperimentOverride: environment.updateCommunicationExperimentOverride,
      browserUsePlaywrightExperimentOverride: environment.browserUsePlaywrightExperimentOverride
    });
    service.start();
    context2.onStop(() => service.dispose());
    context2.onStop(
      auth2.subscribeToRenewal((event) => {
        if (event.outcome !== "renewed") return;
        if (event.isFirstCredential || !service.hasAuthenticatedStatsigBootstrap()) {
          service.handleAuthChange();
        }
      })
    );
    if (auth2.peekAccessToken() !== null) service.handleAuthChange();
    const peek = { disableExposureLog: true };
    context2.onStop(
      context2.deps.settings.subscribeToFeatureFlagOverrides((overrides) => {
        service.replaceFeatureFlagOverrides(overrides);
      })
    );
    context2.onStop(
      context2.deps.settings.subscribeToChanges((event) => {
        if (event.fields.includes("selectedTeamId")) {
          service.handleAuthChange();
        }
      })
    );
    return {
      checkFeatureGate: (name17, options2) => service.checkFeatureGate(name17, options2),
      getFeatureGateProperty: (name17) => service.getFeatureGateProperty(name17),
      checkGate: (name17, options2) => service.checkGate(name17, options2),
      getDynamicConfig: (name17, options2) => service.getDynamicConfig(name17, options2),
      flushExposureLog: () => service.flushExposureLog(),
      subscribe: (listener) => service.subscribe(listener),
      pinGateOnAuthenticatedBootstrap: (name17, pin) => service.pinGateOnAuthenticatedBootstrap(name17, pin),
      hasHydratedStatsigUserId: () => service.hasHydratedStatsigUserId(),
      waitForHydratedStatsigUserId: (timeoutMs) => service.waitForHydratedStatsigUserId(timeoutMs),
      hasAuthenticatedStatsigBootstrap: () => service.hasAuthenticatedStatsigBootstrap(),
      getSandModelExperimentState: () => service.getSandModelExperimentState(),
      logSandModelExperimentExposure: () => service.logSandModelExperimentExposure(),
      offerLessSubagentFanout: () => service.offerLessSubagentFanout(),
      offerUpdateCommunication: () => service.offerUpdateCommunication(),
      offerBrowserUsePlaywright: () => service.offerBrowserUsePlaywright(),
      getConfiguredDefaultModel: () => service.getConfiguredDefaultModel(),
      getConfiguredAutomationsModel: () => service.getConfiguredAutomationsModel(),
      getComputerUseModelOverride: () => service.getComputerUseModelOverride(),
      getBrowserUseModelOverride: () => service.getBrowserUseModelOverride(),
      isSparsePluginClonesEnabled: () => service.checkFeatureGate("enable_sparse_plugin_clones", peek),
      isUaTokenKillSwitchEnabled: () => service.checkFeatureGate("sand_browser_ua_token_kill_switch", peek),
      isBrowserFingerprintSpoofEnabled: () => service.checkFeatureGate("sand_browser_fingerprint_spoof", peek),
      isEnableSpoofGpuEnabled: () => service.checkFeatureGate("sand_enable_spoof_gpu", peek),
      isWebBotAuthSigningEnabled: () => service.checkFeatureGate("sand_web_bot_auth_signing", peek),
      isWebBotAuthXhrFetchSigningEnabled: () => service.checkFeatureGate("sand_web_bot_auth_sign_xhr_fetch", peek),
      isWebBotAuthIframeSigningEnabled: () => service.checkFeatureGate("sand_web_bot_auth_sign_iframes", peek)
    };
  }
});
