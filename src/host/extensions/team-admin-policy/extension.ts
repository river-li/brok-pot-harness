var teamAdminPolicyExtension = defineHostExtension({
  id: "team-admin-policy",
  dependencies: [HostExtensions.Auth, HostExtensions.Settings],
  start: (context2) => {
    const auth2 = context2.deps.auth;
    const log5 = (message) => context2.host.log(message);
    let dashboardClient;
    const service = createTeamAdminPolicyService({
      getDashboardClient: () => dashboardClient ??= createSandCursorBackendClient(DashboardService, {
        backend: context2.host.environment.backend,
        getAccessToken: auth2.getAccessToken,
        getTeamId: auth2.getTeamId,
        getMachineId: auth2.getMachineId
      }),
      getTeamId: () => context2.deps.settings.getSelectedTeamId(),
      clock: realClock,
      log: log5
    });
    context2.onStop(() => service.dispose());
    context2.onStop(
      context2.deps.settings.subscribeToChanges((event) => {
        if (event.fields.includes("selectedTeamId")) service.invalidate();
      })
    );
    service.prefetch();
    return service;
  }
});
