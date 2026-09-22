var secretsExtension = defineHostExtension({
  id: "secrets",
  dependencies: [HostExtensions.Auth, HostExtensions.ForeverBox],
  start: (context2) => {
    const ctx = createContext().withName("secrets");
    const service = new BoxSecretsApplier({
      applyToBox: (requestContext, update) => boxApplyEnvironment(context2.deps["forever-box"].box, requestContext, update),
      retryPolicy: createRetryPolicy({
        name: "sand-secrets-apply",
        mode: "until-signal",
        initialDelayMs: SECRETS_RETRY_INITIAL_MS,
        maxDelayMs: SECRETS_RETRY_MAX_MS
      }),
      applyDeadline: createDeadlinePolicy({
        name: "sand-secrets-save",
        timeoutMs: SECRETS_APPLY_WAIT_MS
      }),
      log: (message) => context2.host.log(message)
    });
    context2.onStop(() => service.stop());
    void service.applyPersisted(ctx);
    const client = createSandCursorBackendClient(GrokBotService, {
      backend: context2.host.environment.backend,
      getAccessToken: context2.deps.auth.getAccessToken,
      getTeamId: context2.deps.auth.getTeamId,
      getMachineId: context2.deps.auth.getMachineId
    });
    return {
      set: ({ secrets }) => service.setSecrets(ctx, secrets),
      setSecret: (secret) => service.setSecret(ctx, secret),
      syncUserSecrets: (request5) => service.syncUserSecrets(ctx, request5),
      getStatus: () => service.getStatus(),
      carryToBot: (args) => carryBoxSecretsToBot(
        {
          readCard: (names3) => service.readCard(names3),
          client,
          log: (message) => context2.host.log(message)
        },
        args
      )
    };
  }
});
