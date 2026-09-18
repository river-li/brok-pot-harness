var authExtension = defineHostExtension({
  id: "auth",
  dependencies: [HostExtensions.Settings],
  start: (context2) => {
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
        mint: (request3) => client.mint(request3),
        log: (message) => context2.host.log(message)
      });
      context2.onStop(
        () => started2.then(
          (handle) => handle.stop(),
          (error41) => {
            context2.host.log(`identity socket stop skipped: ${errorLogTag(error41)}`);
          }
        )
      );
      void started2.catch((error41) => {
        context2.host.log(`identity socket failed to bind: ${errorLogTag(error41)}`);
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
