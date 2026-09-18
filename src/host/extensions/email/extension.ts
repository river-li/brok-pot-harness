var emailDeadline = createDeadlinePolicy({
  name: "email-read",
  timeoutMs: 15e3
});
var emailExtension = defineHostExtension({
  id: "email",
  dependencies: [HostExtensions.Auth, HostExtensions.Experiments, HostExtensions.Telemetry],
  start: (context2) => {
    const { auth: auth2, experiments, telemetry } = context2.deps;
    const client = createSandCursorBackendClient(GrokBotService, {
      backend: context2.host.environment.backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      getMachineId: auth2.getMachineId
    });
    return {
      isEnabled: () => experiments.checkFeatureGate("grok_bot_agent_mail", { disableExposureLog: true }),
      email: createEmailService({
        client,
        deadline: emailDeadline,
        logWarning: (line) => telemetry.logs.reportHostLog("warn", line)
      })
    };
  }
});
