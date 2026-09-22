/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/inference/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var inferenceExtension = defineHostExtension({
  id: "inference",
  dependencies: [HostExtensions.Auth, HostExtensions.Experiments, HostExtensions.Settings],
  start: (context2) => {
    const modelExperimentsApplied = createSnapshotStore(0);
    const auth2 = context2.deps.auth;
    const environment = context2.host.environment;
    const { backend } = environment;
    return {
      isReady: async () => process.env.GROKBOT_LOCAL_MODE === "1" || environment.agentMockResponse != null || auth2.peekAccessToken() !== null,
      port: createHostInference({
        environment,
        auth: context2.deps.auth,
        experiments: context2.deps.experiments,
        settings: context2.deps.settings,
        onModelExperimentApplied: () => {
          modelExperimentsApplied.update((applied) => applied + 1);
        }
      }),
      onModelExperimentApplied: modelExperimentsApplied.subscribe,
      createWebSearch: ({ modelId, onRequestId }) => createCursorWebSearchService({
        backend,
        getAccessToken: auth2.getAccessToken,
        getTeamId: auth2.getTeamId,
        getMachineId: auth2.getMachineId,
        modelId,
        ...onRequestId != null ? { onRequestId } : {}
      }),
      createWebFetch: ({ onRequestId }) => createCursorWebFetchService({
        backend,
        getAccessToken: auth2.getAccessToken,
        getTeamId: auth2.getTeamId,
        getMachineId: auth2.getMachineId,
        ...onRequestId != null ? { onRequestId } : {}
      }),
      transcribeAudio: createSandTranscribeAudio(backend, auth2),
      previewVoice: createSandVoicePreview(backend, auth2)
    };
  }
});

