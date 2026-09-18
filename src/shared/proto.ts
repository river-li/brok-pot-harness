var AiService2, BackgroundComposerService2, DashboardService2;
var init_proto = __esm({
  "src/shared/proto.ts"() {
    "use strict";
    init_aiserver_connect();
    init_background_composer_connect();
    init_dashboard_connect();
    init_agent_skills_pb();
    init_mcp_exec_pb();
    init_todo_tool_pb();
    init_aiserver_pb();
    init_analytics_connect();
    init_analytics_pb();
    init_dashboard_pb();
    init_grok_bot_connect();
    init_grok_bot_pb();
    init_privacy_mode_pb();
    AiService2 = {
      typeName: AiService.typeName,
      methods: {
        availableModels: AiService.methods.availableModels,
        reportClientNumericMetrics: AiService.methods.reportClientNumericMetrics,
        reportSandProcessMetrics: AiService.methods.reportSandProcessMetrics,
        runGenerateImage: AiService.methods.runGenerateImage,
        textToSpeech: AiService.methods.textToSpeech,
        transcribeAudio: AiService.methods.transcribeAudio
      }
    };
    BackgroundComposerService2 = {
      typeName: BackgroundComposerService.typeName,
      methods: {
        getBackgroundComposerInfo: BackgroundComposerService.methods.getBackgroundComposerInfo,
        getBackgroundComposerUserSettings: BackgroundComposerService.methods.getBackgroundComposerUserSettings,
        getPullRequestMergeStatus: BackgroundComposerService.methods.getPullRequestMergeStatus
      }
    };
    DashboardService2 = {
      typeName: DashboardService.typeName,
      methods: {
        cancelSandTrial: DashboardService.methods.cancelSandTrial,
        checkHttpMcpStatus: DashboardService.methods.checkHttpMcpStatus,
        clientAction: DashboardService.methods.clientAction,
        completeGithubConnectFlow: DashboardService.methods.completeGithubConnectFlow,
        completeMcpOAuth: DashboardService.methods.completeMcpOAuth,
        createAutomationWebhookApiKey: DashboardService.methods.createAutomationWebhookApiKey,
        deleteMcpOAuthAccount: DashboardService.methods.deleteMcpOAuthAccount,
        deleteMcpOAuthToken: DashboardService.methods.deleteMcpOAuthToken,
        disconnectGithub: DashboardService.methods.disconnectGithub,
        executeSandMcpTool: DashboardService.methods.executeSandMcpTool,
        getAggregatedUsageEvents: DashboardService.methods.getAggregatedUsageEvents,
        getAvailableMcpServers: DashboardService.methods.getAvailableMcpServers,
        getCanvasPayload: DashboardService.methods.getCanvasPayload,
        getCurrentPeriodUsage: DashboardService.methods.getCurrentPeriodUsage,
        getDailySpendByCategory: DashboardService.methods.getDailySpendByCategory,
        getEffectiveUserPlugins: DashboardService.methods.getEffectiveUserPlugins,
        getGithubRepoAccessStatus: DashboardService.methods.getGithubRepoAccessStatus,
        getHardLimit: DashboardService.methods.getHardLimit,
        getManagedSkills: DashboardService.methods.getManagedSkills,
        getMcpConfig: DashboardService.methods.getMcpConfig,
        getMe: DashboardService.methods.getMe,
        getMonthlyBillingCycle: DashboardService.methods.getMonthlyBillingCycle,
        getPluginMcpConfig: DashboardService.methods.getPluginMcpConfig,
        getSandAccessStatus: DashboardService.methods.getSandAccessStatus,
        getSandMachineMessagesEnabled: DashboardService.methods.getSandMachineMessagesEnabled,
        getSandTrialClaimStatus: DashboardService.methods.getSandTrialClaimStatus,
        getSandUsageStatus: DashboardService.methods.getSandUsageStatus,
        getTeamAdminSettingsOrEmptyIfNotInTeam: DashboardService.methods.getTeamAdminSettingsOrEmptyIfNotInTeam,
        getTeamMembers: DashboardService.methods.getTeamMembers,
        getTeamPluginPopularity: DashboardService.methods.getTeamPluginPopularity,
        getTeams: DashboardService.methods.getTeams,
        getUserPrivacyMode: DashboardService.methods.getUserPrivacyMode,
        installUserPlugin: DashboardService.methods.installUserPlugin,
        listMarketplacePlugins: DashboardService.methods.listMarketplacePlugins,
        listMarketplaces: DashboardService.methods.listMarketplaces,
        listSandMachines: DashboardService.methods.listSandMachines,
        listSandMcpTools: DashboardService.methods.listSandMcpTools,
        listUserCanvases: DashboardService.methods.listUserCanvases,
        prepareGithubConnectFlow: DashboardService.methods.prepareGithubConnectFlow,
        registerSandMachine: DashboardService.methods.registerSandMachine,
        renameMcpOAuthAccount: DashboardService.methods.renameMcpOAuthAccount,
        setHardLimit: DashboardService.methods.setHardLimit,
        setMcpConfig: DashboardService.methods.setMcpConfig,
        uninstallUserPlugin: DashboardService.methods.uninstallUserPlugin,
        updateSandMachineLabel: DashboardService.methods.updateSandMachineLabel,
        updateSandMachineLocalToolPermission: DashboardService.methods.updateSandMachineLocalToolPermission,
        updateSandMachineMessagesEnabled: DashboardService.methods.updateSandMachineMessagesEnabled,
        updateUserName: DashboardService.methods.updateUserName,
        updateUserPluginInstall: DashboardService.methods.updateUserPluginInstall,
        validateMcpOAuthTokens: DashboardService.methods.validateMcpOAuthTokens
      }
    };
  }
});
