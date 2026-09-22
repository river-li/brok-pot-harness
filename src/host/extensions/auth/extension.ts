/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/auth/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();
init_errors();
init_cursor_inference();
init_cursor_token();

// @recovered-fragment 2/2
var authExtension = defineHostExtension({
  id: "auth",
  dependencies: [HostExtensions.Settings],
  start: (context2) => {
    if (process.env.GROKBOT_LOCAL_MODE === "1") {
      return require("./local/host-auth.js").createLocalHostAuth(() => getOrCreateHostMachineId());
    }
    const { backend } = context2.host.environment;
    const service = createHostAuthService({
      backend,
      retry: createRetryPolicy({
        name: "sand-inference-credential-renewal",
        mode: "until-signal",
        initialDelayMs: CREDENTIAL_RETRY_BASE_DELAY_MS,
        maxDelayMs: CREDENTIAL_RETRY_MAX_DELAY_MS
      }),
      clock: realClock,
      log: (message) => context2.host.log(message),
      credentials: context2.host.environment.auth
    });
    context2.onStop(() => service.dispose());
    const getTeamId = createSelectedTeamReader({
      backend,
      peekAccessToken: () => service.peekAccessToken(),
      getAccessToken: (options2) => service.getAccessToken(options2),
      getSelectedTeamIdForAccountScope: (accountScope) => context2.deps.settings.getSelectedTeamIdForAccountScope(accountScope)
    });
    context2.onStop(installSandCursorBackendClientDefaultTeamIdGetter(getTeamId));
    const userFullName = createSandUserFullNameResolver({
      backend,
      getAccessToken: (options2) => service.getAccessToken(options2),
      getTeamId,
      peekAccessToken: () => service.peekAccessToken(),
      getMachineId: () => service.getMachineId(),
      log: (message) => context2.host.log(message)
    });
    const unsubscribeUserFullName = service.subscribeToRenewal((event) => {
      if (event.outcome === "renewed") {
        void userFullName.refresh();
      }
    });
    context2.onStop(unsubscribeUserFullName);
    if (service.peekAccessToken() !== null) {
      void userFullName.refresh();
    }
    context2.deps.settings.setSelectedTeamScopeSource(
      () => tokenSubjectScope(service.peekAccessToken())
    );
    context2.onStop(
      service.subscribeToRenewal(() => context2.deps.settings.noteSelectedTeamScopeSourceChanged())
    );
    if (service.peekAccessToken() !== null) {
      context2.deps.settings.noteSelectedTeamScopeSourceChanged();
    }
    if (service.peekBoxIdentityCredential() !== null) {
      const client = new GrokBotBoxIdentityMintClient({
        backend,
        getBoxCredential: () => service.peekBoxIdentityCredential(),
        log: (message) => context2.host.log(message)
      });
      const started2 = startGrokBotBoxIdentitySocketServer({
        mint: (request5) => client.mint(request5),
        log: (message) => context2.host.log(message)
      });
      context2.onStop(
        () => started2.then(
          (handle) => handle.stop(),
          (error42) => {
            context2.host.log(`identity socket stop skipped: ${errorLogTag(error42)}`);
          }
        )
      );
      void started2.catch((error42) => {
        context2.host.log(`identity socket failed to bind: ${errorLogTag(error42)}`);
      });
    }
    return {
      getAccessToken: (options2) => service.getAccessToken(options2),
      getGrokBotToken: (options2) => service.getGrokBotToken(options2),
      getBestEffortAccessToken: bestEffortAccessToken(backend, service),
      peekAccessToken: () => service.peekAccessToken(),
      getTeamId,
      getLastRenewalEvent: () => service.getLastRenewalEvent(),
      getMachineId: () => service.getMachineId(),
      subscribeToRenewal: (listener) => service.subscribeToRenewal(listener),
      getUserFullName: () => userFullName.getUserFullName()
    };
  }
});

