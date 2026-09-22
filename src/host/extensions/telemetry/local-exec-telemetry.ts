/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/local-exec-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function refusalError(cause) {
  switch (cause) {
    case "no_providers":
      return SandError.localExecNoProviders();
    case "stale_heartbeat":
      return SandError.localExecProvidersStale();
    case "computer_unknown":
      return SandError.localExecComputerUnknown();
    case "computer_ambiguous":
      return SandError.localExecComputerAmbiguous();
    case "messages_unsupported":
      return SandError.localExecMessagesUnsupported();
  }
}
function localExecRefusedTelemetry(report) {
  return {
    level: "warn",
    event: LOCAL_EXEC_REFUSED_EVENT,
    metadata: {
      cause: report.cause,
      site: report.site,
      conversation_id: report.conversationId,
      provider_count: String(report.providerCount),
      live_provider_count: String(report.liveProviderCount),
      ever_registered: String(report.everRegistered),
      empty_for_ms: report.emptyForMs !== void 0 ? String(Math.round(report.emptyForMs)) : void 0,
      ...sandErrorTags(refusalError(report.cause))
    }
  };
}
function localExecFailedTelemetry(report) {
  return {
    level: "warn",
    event: LOCAL_EXEC_FAILED_EVENT,
    metadata: {
      error_class: report.errorClass,
      errno: report.errno,
      site: report.site,
      surface: "external",
      conversation_id: report.conversationId,
      cwd_state: report.cwdState
    }
  };
}
function localExecProviderTelemetry(report) {
  const supervised = report.phase === "hello" && report.supervised !== void 0 ? String(report.supervised) : void 0;
  return {
    level: "info",
    event: LOCAL_EXEC_PROVIDER_EVENT,
    metadata: {
      phase: report.phase,
      provider_id: report.providerId,
      provider_count: String(report.providerCount),
      ...report.phase === "hello" ? {
        hello_delay_ms: String(Math.round(report.helloDelayMs)),
        computer_id_present: String(report.computerIdPresent),
        rehello: String(report.rehello),
        supervised,
        variant: report.variant
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

