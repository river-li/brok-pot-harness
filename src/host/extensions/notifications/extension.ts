/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/notifications/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_grok_bot_connect();
init_cursor_inference();

// @recovered-fragment 2/2
var notificationsExtension = defineHostExtension({
  id: "notifications",
  dependencies: [HostExtensions.Auth],
  start: (context2) => {
    const notifier = new SandMobilePushNotifier({
      notify: createSandMobilePushSender(
        createSandCursorBackendClient(GrokBotService, {
          backend: context2.host.environment.backend,
          getAccessToken: context2.deps.auth.getAccessToken,
          getTeamId: context2.deps.auth.getTeamId,
          getMachineId: context2.deps.auth.getMachineId
        })
      )
    });
    const unsubscribe = context2.host.events.subscribe((event) => {
      switch (event.kind) {
        case "notification-baseline":
          notifier.seedBaseline(event.agents);
          break;
        case "notification-agents":
          notifier.handleAgentsEvent(event.event, event.presence);
          break;
        case "notification-agent-upserted":
          notifier.handleAgentUpsertedEvent(event.event, event.presence);
          break;
        case "notification-agent-forgotten":
          notifier.forget(event.agentId);
          break;
      }
    });
    context2.onStop(unsubscribe);
    return {};
  }
});

