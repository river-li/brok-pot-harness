/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/privacy-mode/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();
init_dashboard_connect();
init_dashboard_pb();
init_privacy_mode_pb();
init_cursor_inference();

// @recovered-fragment 2/2
var privacyModeExtension = defineHostExtension({
  id: "privacy-mode",
  dependencies: [HostExtensions.Auth],
  start: (context2) => {
    const auth2 = context2.deps.auth;
    const service = createPrivacyModeService({
      auth: auth2,
      load: async ({ auth: lookupAuth, signal }) => {
        const client = createSandCursorBackendClient(DashboardService, {
          backend: context2.host.environment.backend,
          getAccessToken: async () => lookupAuth.authToken,
          getTeamId: auth2.getTeamId,
          getMachineId: () => auth2.getMachineId()
        });
        const response = await client.getUserPrivacyMode(
          new GetUserPrivacyModeRequest({
            inferredPrivacyMode: PrivacyMode.NO_STORAGE
          }),
          { signal }
        );
        return response.privacyMode;
      },
      policies: {
        lookupDeadline: createDeadlinePolicy({
          name: "privacy-mode-lookup",
          timeoutMs: 3e3
        }),
        lookupRetry: createRetryPolicy({
          name: "privacy-mode-lookup-retry",
          maxAttempts: 2,
          initialDelayMs: 1e4,
          maxDelayMs: 1e4,
          shouldRetry: isRetryablePrivacyModeLookupError
        }),
        refreshPolling: createPollingPolicy2({
          name: "privacy-mode-refresh",
          intervalMs: 5 * 60 * 1e3
        })
      },
      clock: realClock,
      logger: createPrivacyModeLogger(context2.host.log)
    });
    context2.onStop(() => service.dispose());
    return service;
  }
});

