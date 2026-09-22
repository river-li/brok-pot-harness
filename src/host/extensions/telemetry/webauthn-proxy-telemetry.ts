/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/webauthn-proxy-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_bounded();
var KNOWN_DOM_ERROR_NAMES = [
  "NotAllowedError",
  "InvalidStateError",
  "NotSupportedError",
  "SecurityError",
  "AbortError",
  "ConstraintError",
  "DataError",
  "TimeoutError",
  "NetworkError",
  "OperationError",
  "UnknownError"
];
var brandedDomError = brandedEnumOf(KNOWN_DOM_ERROR_NAMES, "OtherError");
var brandedSignErrorClass = brandedEnumOf(WEBAUTHN_SIGN_ERROR_CLASSES, "other");
function causeError(cause, rawDomErrorName, rawSignErrorClass) {
  switch (cause) {
    case "no_provider":
      return SandError.webauthnNoProvider();
    case "provider_stale":
      return SandError.webauthnProviderStale();
    case "dispatch_failed":
      return SandError.webauthnDispatchFailed();
    case "timeout":
      return SandError.webauthnCeremonyTimedOut();
    case "consent_declined":
      return SandError.webauthnConsentDeclined();
    case "sign_failed":
      return SandError.webauthnSignFailed({
        domError: brandedDomError(rawDomErrorName),
        signErrorClass: brandedSignErrorClass(rawSignErrorClass)
      });
    case "desktop_failed":
      return SandError.webauthnDesktopFailed({
        domError: brandedDomError(rawDomErrorName),
        signErrorClass: brandedSignErrorClass(rawSignErrorClass)
      });
  }
}
function webauthnProxyTelemetry(report) {
  return {
    level: report.outcome === "failed" || report.outcome === "timeout" ? "warn" : "info",
    event: WEBAUTHN_PROXY_EVENT,
    metadata: {
      stage: report.stage,
      outcome: report.outcome,
      origin_class: report.originClass,
      ceremony_kind: report.ceremonyKind,
      request_id: report.requestId,
      elapsed_ms: String(Math.round(report.elapsedMs)),
      provider_count: report.providerCount !== void 0 ? String(report.providerCount) : void 0,
      live_provider_count: report.liveProviderCount !== void 0 ? String(report.liveProviderCount) : void 0,
      ...report.cause !== void 0 ? sandErrorTags(causeError(report.cause, report.rawDomErrorName, report.rawSignErrorClass)) : {}
    }
  };
}
function webauthnProviderTelemetry(report) {
  return {
    level: "info",
    event: WEBAUTHN_PROVIDER_EVENT,
    metadata: {
      phase: report.phase,
      provider_id: report.providerId,
      provider_count: String(report.providerCount),
      ...report.phase === "hello" ? {
        hello_delay_ms: String(Math.round(report.helloDelayMs)),
        computer_id_present: String(report.computerIdPresent)
      } : {},
      ...report.phase === "detached" ? {
        age_ms: String(Math.round(report.ageMs)),
        had_hello: String(report.hadHello),
        has_heartbeat: String(report.hasHeartbeat),
        was_live: String(report.wasLive),
        emptied: String(report.emptied)
      } : {}
    }
  };
}

