/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/bot-template-share/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_grok_bot_connect();
init_cursor_inference();

// @recovered-fragment 2/2
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

