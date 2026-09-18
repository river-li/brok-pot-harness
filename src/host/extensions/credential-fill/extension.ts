var credentialFillExtension = defineHostExtension({
  id: "credential-fill",
  dependencies: [],
  start: (context2) => new CredentialFillExecutor({
    reportFailure: (stage) => context2.host.log(`credential fill failed (${stage})`)
  })
});
