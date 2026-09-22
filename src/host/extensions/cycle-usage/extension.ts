/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/cycle-usage/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();
init_dashboard_connect();
init_dashboard_pb();
init_cursor_inference();

// @recovered-fragment 2/2
var cycleUsageDeadline = createDeadlinePolicy({
  name: "cycle-usage-lookup",
  timeoutMs: 5e3
});
var cycleUsageExtension = defineHostExtension({
  id: "cycle-usage",
  dependencies: [HostExtensions.Auth],
  start: (context2) => {
    const auth2 = context2.deps.auth;
    const client = createSandCursorBackendClient(DashboardService, {
      backend: context2.host.environment.backend,
      getAccessToken: auth2.getAccessToken,
      getTeamId: auth2.getTeamId,
      getMachineId: auth2.getMachineId
    });
    return {
      getCycleUsage: () => cycleUsageDeadline.run(
        async (signal) => cycleUsageFromStatusResponse(
          await client.getSandUsageStatus(new GetSandUsageStatusRequest({}), { signal })
        )
      )
    };
  }
});

