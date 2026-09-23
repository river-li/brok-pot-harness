var codebaseTelemetryExtension = defineHostExtension({
  id: "codebase-telemetry",
  dependencies: [HostExtensions.Auth, HostExtensions.Experiments, HostExtensions.PrivacyMode],
  start: (context2) => {
    const logger110 = createSandCodebaseTelemetryLogger(context2.host.log);
    const service = createCodebaseTelemetryService({
      auth: context2.deps.auth,
      experiments: context2.deps.experiments,
      events: context2.host.events,
      createAdapter: ({ credentials, signal }) => {
        const { backend } = context2.host.environment;
        return CsnapsCodebaseTelemetryAdapter.create({
          credentials,
          paths: {
            codebaseUuidStatePath: (0, import_node_path100.join)(getSandRootDir(), "telemetry/codebase-uuids.json"),
            snapshotsBaseDir: "/var/lib/sand/telemetry/codebase"
          },
          backendUrl: backend.backendUrl,
          csnapsBinPath: context2.host.environment.csnapsBinPath,
          spawnCsnaps,
          uploadPolling: createPollingPolicy2({
            name: "codebase-snapshot-upload",
            intervalMs: 5 * 60 * 1e3
          }),
          createUploadCredentials: async () => ({
            authToken: credentials.authToken.get(),
            requestHeaders: {
              ...getSandBackendClientHeaders(backend),
              "x-cursor-checksum": createCursorChecksum(await context2.deps.auth.getMachineId()),
              "x-ghost-mode": "false"
            }
          }),
          logger: logger110,
          signal
        });
      },
      privacyMode: context2.deps["privacy-mode"],
      policies: {
        sessionRestartDelay: createRetryPolicy({
          name: "codebase-telemetry-session-restart",
          maxAttempts: 2,
          initialDelayMs: 3e4,
          maxDelayMs: 3e4
        }),
        shutdownDeadline: createDeadlinePolicy({
          name: "codebase-telemetry-shutdown",
          timeoutMs: 3e3
        })
      },
      logger: logger110
    });
    context2.onStop(() => service.dispose());
    return service.api;
  }
});
