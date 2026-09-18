var botTemplateShareExtension = defineHostExtension({
  id: "bot-template-share",
  dependencies: [HostExtensions.AgentIdentity, HostExtensions.Auth, HostExtensions.Telemetry],
  start: (context2) => createBotTemplateShareService(
    createGrokBotTemplateStore({
      client: createSandCursorBackendClient(GrokBotService, {
        backend: context2.host.environment.backend,
        getAccessToken: context2.deps.auth.getAccessToken,
        getTeamId: context2.deps.auth.getTeamId,
        getMachineId: context2.deps.auth.getMachineId
      }),
      ensureServerBacked: context2.deps["agent-identity"].ensureServerBacked
    }),
    (errorClass) => context2.deps.telemetry.logs.reportHostExtensionDiagnostic({
      extension: "bot_template_share",
      errorClass
    })
  )
});
