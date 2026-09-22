/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function sandErrorDetail(error42) {
  if (error42 instanceof Error) {
    return {
      message: error42.message,
      ...error42.stack !== void 0 ? { stack: error42.stack } : {}
    };
  }
  return { message: String(error42) };
}
var SAND_BOX_BOOT_STAGES = [
  "entrypoint_started",
  "daemon_listening",
  "desktop_up",
  "ready"
];
var SAND_BOX_BOOT_ID_ENV = "SAND_BOX_BOOT_ID";
var SAND_BOX_BOOT_STARTED_AT_MS_ENV = "SAND_BOX_BOOT_STARTED_AT_MS";
var SAND_BOX_AUTH_ID_ENV = "SAND_BOX_AUTH_ID";
var SAND_BOX_TENANT_ID_ENV = "SAND_BOX_TENANT_ID";
var SAND_BOX_STORE_ID_ENV = "SAND_BOX_STORE_ID";
var SAND_BOX_CLUSTER_ENV = "SAND_BOX_CLUSTER";
var SAND_HTTP_PROXY_NAME_ENV = "SAND_HTTP_PROXY_NAME";
function readSandBoxPodEnv(env = process.env) {
  const name17 = env[SAND_HTTP_PROXY_NAME_ENV]?.trim();
  return {
    identityTags: {
      auth_id: env[SAND_BOX_AUTH_ID_ENV]?.trim(),
      tenant_id: env[SAND_BOX_TENANT_ID_ENV]?.trim(),
      box_store_id: env[SAND_BOX_STORE_ID_ENV]?.trim(),
      box_boot_id: env[SAND_BOX_BOOT_ID_ENV]?.trim(),
      cluster: env[SAND_BOX_CLUSTER_ENV]?.trim()
    },
    httpProxyName: name17 === void 0 || name17 === "" ? void 0 : name17
  };
}
function resolveSandBoxIdentityTags(env) {
  return readSandBoxPodEnv(env).identityTags;
}
function resolveSandHttpProxyName(env) {
  return readSandBoxPodEnv(env).httpProxyName;
}
var SAND_CHROME_LAUNCH_MODES = ["prepare", "window"];
var SAND_CHROME_LAUNCH_OUTCOMES = ["ready", "cdp_timeout", "window_timeout"];
var SAND_HOST_LIFECYCLE_PHASES = [
  "plugin_graph",
  "identity",
  "log_catchup",
  "transcript_read",
  "ready"
];
var SAND_EXEC_DAEMON_RESTART_CAUSES = [
  "daemon_exited",
  "startup_listener_timeout",
  "listener_lost"
];
var SAND_SUPERVISOR_RESTART_CAUSES = [
  "supervisor_exited",
  "startup_status_timeout",
  "status_stale",
  "gave_up",
  "restart_intent"
];
var SAND_COOKIE_PERSIST_PHASES = ["capture", "restore"];
var SAND_COOKIE_PERSIST_OUTCOMES = [
  "captured",
  "ok",
  "partial",
  "failed",
  "empty"
];
var SAND_WEB_BOT_AUTH_PHASES = ["fetch_enable", "tick"];
var SAND_WEB_BOT_AUTH_REASONS = [
  "timeout",
  "connection_closed",
  "protocol_error",
  "unexpected_error"
];
var SAND_EGRESS_TUNNEL_OUTCOMES = [
  "ready",
  "restart",
  "startup_timeout",
  "listener_lost",
  "stale_port"
];
var SAND_BOX_BOOT_FAILURE_STAGES = ["desktop"];
var SAND_BOX_BOOT_FAILURE_REASONS = ["x_display_timeout"];
var SAND_PROCESS_CRASH_BINARIES = [
  "cursor",
  "cursor-nightly",
  "cursor-lab",
  "chrome",
  "node",
  "exec-daemon",
  "xvfb",
  "xfwm4",
  "picom",
  "x11vnc",
  "websockify",
  "plank",
  "thunar",
  "xfce4-terminal",
  "other"
];
var SAND_PROCESS_CRASH_SIGNALS = [
  "sigill",
  "sigsegv",
  "sigabrt",
  "sigbus",
  "other"
];
var SAND_HOST_BOOT_FETCH_OUTCOMES = [
  "current",
  "applied",
  "fallback",
  "restore_failed"
];
var SAND_HOST_BOOT_FETCH_REASONS = [
  "current",
  "applied",
  "pointer_unreachable",
  "pointer_malformed",
  "target_vetoed",
  "digest_missing",
  "digest_malformed",
  "download_failed",
  "digest_mismatch",
  "swap_refused",
  "swap_failed_restored",
  "restore_failed",
  "budget_exceeded",
  "unexpected_error"
];
var NOOP_TURN = {
  setModel: () => {
  },
  setRequestId: () => {
  },
  finalize: () => {
  }
};
function createNoopSandTelemetry() {
  return {
    reportComputerOperation: () => {
    },
    reportBrowserOperation: () => {
    },
    startTurn: () => NOOP_TURN,
    reportSummaryLifecycle: () => {
    },
    reportSummaryPersisted: () => {
    },
    reportToolCallError: () => {
    },
    reportToolCallStalled: () => {
    },
    reportToolCallStarted: () => {
    },
    reportToolCallCompleted: () => {
    },
    reportDynamicToolCall: () => {
    },
    reportToolCallArgsRejected: () => {
    },
    reportMessagesTool: () => {
    },
    reportAgentError: () => {
    },
    reportBotBlock: () => {
    },
    reportBotBlockResolved: () => {
    },
    reportAgentLoopDetected: () => {
    },
    reportAgentLoopMitigation: () => {
    },
    reportSiteVisited: () => {
    },
    reportDaemonPing: () => {
    },
    reportBoxBootStage: () => {
    },
    reportExecDaemonRestart: () => {
    },
    reportSupervisorRestart: () => {
    },
    reportAutomationRun: () => {
    },
    reportAutomationFireDropped: () => {
    },
    reportAutomationAgentGoneRecovered: () => {
    },
    reportAutomationLifecycle: () => {
    },
    reportTurnInterrupt: () => {
    },
    reportTurnAwait: () => {
    },
    reportAgentDelete: () => {
    },
    reportTurnRetry: () => {
    },
    reportUserMessageReceived: () => {
    },
    reportClosingSendNudge: () => {
    },
    reportSubagentRevival: () => {
    },
    reportSubagentStalled: () => {
    },
    reportGroupMemberTurnOutcome: () => {
    },
    reportShellRevival: () => {
    },
    reportComputerUseUsage: () => {
    },
    reportComputerUseDispatch: () => {
    },
    reportTtft: () => {
    },
    reportSendDispatch: () => {
    },
    reportQueueAccepted: () => {
    },
    reportQueueDequeued: () => {
    },
    reportQueueWatchdog: () => {
    },
    reportWedgedRunReap: () => {
    },
    reportAckObligation: () => {
    },
    reportPendingWake: () => {
    },
    reportTurnUsage: () => {
    },
    reportPromptPrefixDiff: () => {
    },
    reportTurnEmptyDelivery: () => {
    },
    reportJournalOutcome: () => {
    },
    reportAutoReviewExpireSweepFailed: () => {
    }
  };
}

