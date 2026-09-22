/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/team-admin-policy/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();
init_dashboard_connect();
init_cursor_inference();

// @recovered-fragment 2/2
var teamAdminPolicyExtension = defineHostExtension({
  id: "team-admin-policy",
  dependencies: [HostExtensions.Auth, HostExtensions.Settings],
  start: (context2) => {
    // There is no organization administrator or remote policy in a local workspace.
    // Cloud-agent tools are unavailable; normal local tool approval remains intact.
    if (process.env.GROKBOT_LOCAL_MODE === "1") return {
      isCloudAgentsDisabled: () => true,
      isAutoReviewEnforced: () => false,
      waitForPolicy: async () => true,
      prefetch() {}, invalidate() {}, dispose() {}
    };
    const auth2 = context2.deps.auth;
    const log4 = (message) => context2.host.log(message);
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
      log: log4
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
