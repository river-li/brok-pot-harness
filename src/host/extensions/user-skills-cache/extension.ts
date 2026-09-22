/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/user-skills-cache/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();
init_grok_bot_connect();
init_cursor_inference();

// @recovered-fragment 2/2
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
      publish: async ({ fingerprint, signal }) => {
        await client.publishGrokBotUserSkillsSnapshot({ fingerprint }, { signal });
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

