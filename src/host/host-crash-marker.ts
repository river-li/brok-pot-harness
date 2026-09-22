/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/host-crash-marker.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_promises7 = require("node:fs/promises");

// @recovered-fragment 2/2
init_scheduling();
init_errors();
var HOST_CRASH_EXIT_SIGNALS = [
  "none",
  "unknown",
  "other",
  "SIGABRT",
  "SIGALRM",
  "SIGBUS",
  "SIGFPE",
  "SIGHUP",
  "SIGILL",
  "SIGINT",
  "SIGKILL",
  "SIGPIPE",
  "SIGQUIT",
  "SIGSEGV",
  "SIGTERM",
  "SIGTRAP",
  "SIGUSR1",
  "SIGUSR2",
  "SIGXCPU",
  "SIGXFSZ"
];
var HOST_FATAL_STARTUP_STAGES = ["host_start", "gateway", "discovery"];
function isNonNegativeFinite(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
function isFatalExitSignal(value) {
  return typeof value === "string" && value !== "none" && value !== "unknown" && HOST_CRASH_EXIT_SIGNALS.some((signal) => signal === value);
}
function isFatalStartupStage(value) {
  return HOST_FATAL_STARTUP_STAGES.some((stage) => stage === value);
}
var MAX_TAG_LENGTH = 128;
function isBoundedTag(value) {
  return typeof value === "string" && value.length > 0 && value.length <= MAX_TAG_LENGTH;
}
function hasErrnoCode(error42, code) {
  return error42 instanceof Error && "code" in error42 && error42.code === code;
}
function readCommonTimes(value) {
  if (!("startedAtMs" in value) || !("crashedAtMs" in value) || !("uptimeMs" in value) || !isNonNegativeFinite(value.startedAtMs) || !isNonNegativeFinite(value.crashedAtMs) || !isNonNegativeFinite(value.uptimeMs)) {
    return null;
  }
  return {
    startedAtMs: value.startedAtMs,
    crashedAtMs: value.crashedAtMs,
    uptimeMs: value.uptimeMs
  };
}
function parseJson(raw) {
  try {
    return { kind: "parsed", value: JSON.parse(raw) };
  } catch {
    return { kind: "invalid" };
  }
}
function parseFatalStartupMarker(value) {
  const times = readCommonTimes(value);
  if (times === null || !("stage" in value) || !isFatalStartupStage(value.stage) || !("errorClass" in value) || !isBoundedTag(value.errorClass)) {
    return null;
  }
  const extensionId = "extensionId" in value ? value.extensionId : void 0;
  if (extensionId !== void 0 && !isBoundedTag(extensionId)) return null;
  return {
    schemaVersion: 1,
    kind: "fatal_startup",
    stage: value.stage,
    ...extensionId === void 0 ? {} : { extensionId },
    errorClass: value.errorClass,
    ...times
  };
}
function parseHostCrashMarker(raw) {
  const parsed2 = parseJson(raw);
  if (parsed2.kind === "invalid") return null;
  const { value } = parsed2;
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  if (!("schemaVersion" in value) || value.schemaVersion !== 1) return null;
  if ("kind" in value && value.kind === "fatal_startup") return parseFatalStartupMarker(value);
  if (!("errorClass" in value) || !("exitSignal" in value)) return null;
  if (value.errorClass === "signal_exit" && isFatalExitSignal(value.exitSignal)) {
    const times = readCommonTimes(value);
    return times === null ? null : {
      schemaVersion: 1,
      errorClass: value.errorClass,
      exitSignal: value.exitSignal,
      ...times
    };
  }
  if ((value.errorClass === "nonzero_exit" || value.errorClass === "unexpected_clean_exit") && value.exitSignal === "none") {
    const times = readCommonTimes(value);
    return times === null ? null : {
      schemaVersion: 1,
      errorClass: value.errorClass,
      exitSignal: value.exitSignal,
      ...times
    };
  }
  if (value.errorClass !== "unobserved_exit" || value.exitSignal !== "unknown" || !("crashedAtMs" in value) || !isNonNegativeFinite(value.crashedAtMs)) {
    return null;
  }
  const startedAtMs = "startedAtMs" in value ? value.startedAtMs : void 0;
  const uptimeMs = "uptimeMs" in value ? value.uptimeMs : void 0;
  if (startedAtMs !== void 0 && !isNonNegativeFinite(startedAtMs) || uptimeMs !== void 0 && !isNonNegativeFinite(uptimeMs)) {
    return null;
  }
  return {
    schemaVersion: 1,
    errorClass: value.errorClass,
    exitSignal: value.exitSignal,
    ...startedAtMs === void 0 ? {} : { startedAtMs },
    crashedAtMs: value.crashedAtMs,
    ...uptimeMs === void 0 ? {} : { uptimeMs }
  };
}
function extensionStartErrorClass(cause) {
  return cause instanceof DeadlineExceededError && cause.policyName === HOST_EXTENSION_START_DEADLINE ? `${cause.name} (${cause.policyName})` : errorLogTag(cause);
}
function fatalStartupCrashMarker(crash) {
  const failedStart = crash.error instanceof HostExtensionStartError ? crash.error : void 0;
  return {
    schemaVersion: 1,
    kind: "fatal_startup",
    stage: crash.stage,
    ...failedStart === void 0 ? {} : { extensionId: failedStart.extensionId },
    errorClass: failedStart === void 0 ? errorLogTag(crash.error) : extensionStartErrorClass(failedStart.cause),
    startedAtMs: crash.startedAtMs,
    crashedAtMs: crash.crashedAtMs,
    uptimeMs: Math.max(0, crash.crashedAtMs - crash.startedAtMs)
  };
}
function createHostCrashMarkerStore(path31 = getHostCrashMarkerPath()) {
  return {
    read: async () => {
      try {
        return { kind: "present", raw: await (0, import_promises7.readFile)(path31, "utf8") };
      } catch (error42) {
        return { kind: hasErrnoCode(error42, "ENOENT") ? "absent" : "unavailable" };
      }
    },
    write: async (marker17) => {
      try {
        await (0, import_promises7.writeFile)(path31, JSON.stringify(marker17), { flag: "wx" });
        return "written";
      } catch (error42) {
        return hasErrnoCode(error42, "EEXIST") ? "present" : "unavailable";
      }
    },
    delete: async () => {
      try {
        await (0, import_promises7.rm)(path31, { force: true });
        return "deleted";
      } catch (error42) {
        reportFallback("host_crash_marker", error42);
        return "unavailable";
      }
    }
  };
}

