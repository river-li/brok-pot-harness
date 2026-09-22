/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/credential-fill/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var credentialFillExtension = defineHostExtension({
  id: "credential-fill",
  dependencies: [],
  start: (context2) => new CredentialFillExecutor({
    reportFailure: (stage) => context2.host.log(`credential fill failed (${stage})`)
  })
});

