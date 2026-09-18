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
