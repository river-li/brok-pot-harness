/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/webauthn-proxy/extension.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();

// @recovered-fragment 2/2
var webauthnProxyExtension = defineHostExtension({
  id: "webauthn-proxy",
  dependencies: [HostExtensions.Telemetry],
  start: (context2) => {
    const logs = context2.deps.telemetry.logs;
    const bridge = new SandWebAuthnBridge({
      clock: realClock,
      ceremonyDeadline: createDeadlinePolicy({
        name: "sand-webauthn-ceremony",
        timeoutMs: SAND_WEBAUTHN_CEREMONY_TIMEOUT_MS
      }),
      report: {
        ceremony: (report) => logs.reportWebAuthnProxy(report),
        provider: (report) => logs.reportWebAuthnProvider(report)
      }
    });
    return {
      requestCeremony: (ceremony) => bridge.requestCeremony(ceremony),
      registerProvider: (send) => bridge.registerProvider(send),
      submitResponses: (batch) => bridge.submitResponses(batch),
      applyEnablement: (enabled) => applyWebAuthnProxyMarker(enabled)
    };
  }
});

