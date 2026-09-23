var PUBLISH_TIMEOUT_MS = 15e3;
var userSkillsCacheExtension = defineHostExtension({
  id: "user-skills-cache",
  dependencies: [HostExtensions.Auth],
  start: (context2) => {
    const { environment } = context2.host;
    const client = createSandCursorBackendClient(GrokBotService, {
      backend: environment.backend,
      getAccessToken: context2.deps.auth.getAccessToken,
      getTeamId: context2.deps.auth.getTeamId,
      getMachineId: context2.deps.auth.getMachineId
    });
    const service = createUserSkillsCacheService({
      isInBox: environment.inBox,
      libraryDir: getGlobalSkillsDir(getSandRootDir()),
      fingerprintLibrary: fingerprintUserSkillsLibrary,
      publish: async ({ fingerprint: fingerprint2, signal }) => {
        await client.publishGrokBotUserSkillsSnapshot({ fingerprint: fingerprint2 }, { signal });
      },
      debounce: createUserSkillsCacheDebounce(),
      publishDeadline: createDeadlinePolicy({
        name: "user-skills-cache-rpc",
        timeoutMs: PUBLISH_TIMEOUT_MS
      }),
      publishRetry: createUserSkillsCachePublishRetry(),
      log: context2.host.log
    });
    context2.onStop(() => service.dispose());
    return service.api;
  }
});
