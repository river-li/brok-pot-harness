init_bounded();
function hostStartupTelemetry(metadata, hostBuiltAtMs) {
  return {
    level: "info",
    event: HOST_STARTUP_EVENT,
    metadata: {
      host_built_at_ms: hostBuiltAtMs,
      ...metadata
    }
  };
}
function hostLifecycleTelemetry(report) {
  let level = "info";
  if (report.outcome === "stuck") level = "warn";
  if (report.outcome === "failed") level = "error";
  const errorTags = report.outcome === "completed" ? {} : sandErrorTags(report.error);
  return {
    level,
    event: HOST_LIFECYCLE_EVENT,
    metadata: {
      phase: report.phase,
      outcome: report.outcome,
      duration_ms: String(report.durationMs),
      plugin_count: report.outcome === "completed" && report.phase === "plugin_graph" ? String(report.pluginCount) : void 0,
      entry_count: report.outcome === "completed" && report.phase === "transcript_read" ? String(report.entryCount) : void 0,
      ...errorTags
    }
  };
}
function daemonPingTelemetry(report) {
  return {
    level: report.outcome === "ok" ? "info" : "error",
    event: DAEMON_PING_EVENT,
    metadata: {
      outcome: report.outcome,
      attempts: String(report.attempts),
      duration_ms: String(report.durationMs),
      unready_duration_ms: String(report.unreadyDurationMs),
      readiness_state: report.readinessState,
      target: report.target,
      cause: report.outcome === "ok" ? void 0 : report.causeSummary
    }
  };
}
function boxImageCheckTelemetry(report) {
  let level = "info";
  let errorTags = {};
  if (report.outcome === "timeout" || report.outcome === "failed") {
    level = "warn";
    errorTags = sandErrorTags(report.error);
  }
  return {
    level,
    event: BOX_IMAGE_CHECK_EVENT,
    metadata: {
      trigger: brandLiteralEnum(report.trigger),
      outcome: report.outcome,
      duration_ms: String(report.durationMs),
      skip_reason: report.outcome === "skipped" ? report.skipReason : void 0,
      ...errorTags
    }
  };
}
var COOKIE_PERSIST_LEVELS = {
  captured: "info",
  ok: "info",
  empty: "info",
  partial: "warn",
  failed: "error"
};
function boxInfrastructureTelemetry(event) {
  switch (event.kind) {
    case "boot_stage":
      return {
        level: "info",
        event: BOX_BOOT_STAGE_EVENT,
        metadata: {
          stage: event.stage,
          duration_ms: String(event.durationMs)
        }
      };
    case "boot_failure":
      return {
        level: "error",
        event: BOX_BOOT_FAILURE_EVENT,
        metadata: {
          stage: event.stage,
          reason: event.reason,
          duration_ms: String(event.durationMs)
        }
      };
    case "egress_tunnel":
      return {
        level: event.outcome === "ready" ? "info" : "warn",
        event: EGRESS_TUNNEL_EVENT,
        metadata: {
          outcome: event.outcome,
          attempt: String(event.attempt),
          exit_status: event.exitStatus !== void 0 ? String(event.exitStatus) : void 0,
          runtime_s: event.runtimeS !== void 0 ? String(event.runtimeS) : void 0
        }
      };
    case "host_boot_fetch": {
      let level = "info";
      if (event.outcome === "fallback") level = "warn";
      if (event.outcome === "restore_failed" || event.reason === "digest_mismatch") level = "error";
      return {
        level,
        event: HOST_BOOT_FETCH_EVENT,
        metadata: {
          outcome: event.outcome,
          reason: event.reason,
          duration_ms: String(event.durationMs),
          swap_ms: event.swapMs !== void 0 ? String(event.swapMs) : void 0,
          from_version: event.fromVersion,
          to_version: event.toVersion
        }
      };
    }
    case "exec_daemon_restart":
      return {
        level: "error",
        event: EXEC_DAEMON_RESTART_EVENT,
        metadata: {
          restart_attempt: String(event.restartAttempt),
          runtime_s: String(event.runtimeS),
          cause: event.cause,
          exit_status: String(event.exitStatus)
        }
      };
    case "supervisor_restart":
      return {
        level: "error",
        event: SUPERVISOR_RESTART_EVENT,
        metadata: {
          restart_attempt: String(event.restartAttempt),
          runtime_s: String(event.runtimeS),
          cause: event.cause,
          exit_status: String(event.exitStatus)
        }
      };
    case "cookie_persist":
      return {
        level: COOKIE_PERSIST_LEVELS[event.outcome],
        event: COOKIE_PERSIST_EVENT,
        metadata: {
          phase: event.phase,
          outcome: event.outcome,
          seed_cookies: String(event.seedCookies),
          injected: event.injected !== void 0 ? String(event.injected) : void 0,
          missing_after: event.missingAfter !== void 0 ? String(event.missingAfter) : void 0,
          attempts: event.attempts !== void 0 ? String(event.attempts) : void 0
        }
      };
    case "process_crash":
      return {
        level: "warn",
        event: BOX_PROCESS_CRASH_EVENT,
        metadata: {
          binary: event.binary,
          signal: event.signal,
          count: String(event.count)
        }
      };
    case "web_bot_auth":
      return {
        level: event.phase === "fetch_enable" ? "error" : "warn",
        event: WEB_BOT_AUTH_EVENT,
        metadata: {
          phase: event.phase,
          reason: event.reason,
          count: String(event.count)
        }
      };
    case "memory_sample":
      return {
        level: "info",
        event: BOX_MEMORY_SAMPLE_EVENT,
        metadata: {
          mem_total_kb: String(event.memTotalKb),
          mem_available_kb: String(event.memAvailableKb),
          processes: String(event.processes),
          pss_fallback_processes: String(event.pssFallbackProcesses),
          chrome_processes: String(event.chromeProcesses),
          chrome_profiles: String(event.chromeProfiles),
          chrome_renderers: String(event.chromeRenderers),
          chrome_tabs: String(event.chromeTabs),
          chrome_tabs_probed_profiles: String(event.chromeTabsProbedProfiles),
          chrome_browser_pss_kb: String(event.chromeBrowserPssKb),
          chrome_renderer_pss_kb: String(event.chromeRendererPssKb),
          chrome_gpu_pss_kb: String(event.chromeGpuPssKb),
          chrome_utility_pss_kb: String(event.chromeUtilityPssKb),
          chrome_other_pss_kb: String(event.chromeOtherPssKb),
          chrome_renderer_max_pss_kb: String(event.chromeRendererMaxPssKb),
          host_pss_kb: String(event.hostPssKb),
          desktop_pss_kb: String(event.desktopPssKb),
          other_pss_kb: String(event.otherPssKb)
        }
      };
    case "chrome_profile_sample":
      return {
        level: "info",
        event: BOX_CHROME_PROFILE_SAMPLE_EVENT,
        metadata: {
          display: String(event.display),
          processes: String(event.processes),
          renderers: String(event.renderers),
          tabs: event.tabs !== void 0 ? String(event.tabs) : void 0,
          pss_kb: String(event.pssKb),
          renderer_max_pss_kb: String(event.rendererMaxPssKb),
          cpu_millicores: event.cpuMillicores !== void 0 ? String(event.cpuMillicores) : void 0
        }
      };
    case "chrome_launch":
      return {
        level: event.outcome === "ready" ? "info" : "warn",
        event: BOX_CHROME_LAUNCH_EVENT,
        metadata: {
          display: String(event.display),
          mode: event.mode,
          attempt: String(event.attempt),
          outcome: event.outcome,
          duration_ms: String(event.durationMs)
        }
      };
    default: {
      const _exhaustive = event;
      return _exhaustive;
    }
  }
}
