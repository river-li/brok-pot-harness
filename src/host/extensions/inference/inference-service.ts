function createHostInference(options2) {
  const { auth: auth2, experiments, settings } = options2;
  return createCursorSandInference({
    backend: options2.environment.backend,
    agentModelOverride: options2.environment.agentModelOverride,
    agentMockResponse: options2.environment.agentMockResponse,
    getAccessToken: auth2.getAccessToken,
    getGrokBotToken: auth2.getGrokBotToken,
    getTeamId: auth2.getTeamId,
    getMachineId: auth2.getMachineId,
    isGeminiVideoDeveloperApiEnabled: () => experiments.checkFeatureGate("gemini_video_developer_api", { disableExposureLog: true }),
    getDefaultModel: () => settings.getAgentDefaultModel(),
    getComputerUseModel: () => resolveComputerUseModelSelection({
      storedModel: settings.getComputerUseModel(),
      overrideModel: experiments.getComputerUseModelOverride()
    }),
    getBrowserUseModel: () => experiments.getBrowserUseModelOverride(),
    getModelExperimentState: () => {
      const state = experiments.getSandModelExperimentState();
      if (experiments.hasHydratedStatsigUserId()) {
        options2.onModelExperimentApplied();
      }
      return state;
    },
    getConfiguredDefaultModel: () => experiments.getConfiguredDefaultModel(),
    getConfiguredAutomationsModel: () => experiments.getConfiguredAutomationsModel()
  });
}
