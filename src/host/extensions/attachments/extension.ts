/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/attachments/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var attachmentsExtension = defineHostExtension({
  id: "attachments",
  dependencies: [HostExtensions.Auth, HostExtensions.Telemetry],
  start: (context2) => createAttachmentsService({
    environment: context2.host.environment,
    auth: context2.deps.auth,
    report: (diagnostic) => context2.deps.telemetry.logs.reportHostExtensionDiagnostic(diagnostic),
    reportRenditionFailure: (failure2) => context2.deps.telemetry.logs.reportHostLog(
      "warn",
      `[sand:${failure2.medium}-rendition] ${failure2.stage} failed (${failure2.errorClass})`
    )
  })
});

