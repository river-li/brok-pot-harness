/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/cloud-agents/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();

// @recovered-fragment 2/2
var cloudAgentsExtension = defineHostExtension({
  id: "cloud-agents",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.Experiments,
    HostExtensions.ForeverBox,
    HostExtensions.TeamAdminPolicy
  ],
  start: (context2) => {
    const teamAdminPolicy = context2.deps["team-admin-policy"];
    const experiments = context2.deps.experiments;
    const service = new SandCloudAgentManager({
      backend: context2.host.environment.backend,
      getCursorAccessToken: context2.deps.auth.getAccessToken,
      getTeamId: context2.deps.auth.getTeamId,
      getMachineId: context2.deps.auth.getMachineId,
      completionPolling: createPollingPolicy2({
        name: "cloud-agent-completion",
        intervalMs: CLOUD_AGENT_POLL_INTERVAL_MS
      }),
      clock: realClock,
      isDisabledByTeamAdmin: () => teamAdminPolicy.isCloudAgentsDisabled(),
      isConversationEnabled: () => experiments.checkFeatureGate("sand_enable_bot2bot_cloud_agent_ui", {
        disableExposureLog: true
      }),
      artifacts: {
        box: context2.deps["forever-box"].box,
        isEnabled: () => experiments.checkFeatureGate("sand_cloud_agent_artifacts", {
          disableExposureLog: true
        })
      },
      updates: {
        isEnabled: () => experiments.checkFeatureGate("sand_cloud_agent_status_stream", {
          disableExposureLog: true
        })
      }
    });
    context2.onStop(() => service.dispose());
    return service;
  }
});

