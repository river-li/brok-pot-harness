/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/pressure-cpu-profiler.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs88 = require("node:fs");
var import_promises73 = require("node:inspector/promises");
var import_node_path147 = require("node:path");
init_errors();
init_invariant();
var SandProfilerCaptureError = class extends SandDomainError {
  name = "SandProfilerCaptureError";
};
var DEFAULT_PROFILE_DURATION_MS = 15e3;
var DEFAULT_MIN_INTERVAL_MS = 6 * 60 * 6e4;
var DEFAULT_MAX_RETAINED_PROFILES = 3;
var DEFAULT_SUSTAINED_PRESSURE_WINDOW_MS = 15e4;
var PROFILER_SAMPLING_INTERVAL_US = 1e4;
var PRESSURE_CPU_PROFILE_PREFIX = "sand-host-pressure-";
var PRESSURE_CPU_PROFILE_DIR = "/tmp/sand-host-profiles";
function createInspectorBackend() {
  let session;
  return {
    start: async () => {
      const starting = new import_promises73.Session();
      starting.connect();
      try {
        await starting.post("Profiler.enable");
        await starting.post("Profiler.setSamplingInterval", {
          interval: PROFILER_SAMPLING_INTERVAL_US
        });
        await starting.post("Profiler.start");
      } catch (error42) {
        try {
          starting.disconnect();
        } catch {
        }
        throw error42;
      }
      session = starting;
    },
    stop: async () => {
      const active = session;
      invariant(active != null, "profiler session not started");
      try {
        const { profile } = await active.post("Profiler.stop");
        if (profile == null) throw new SandProfilerCaptureError("profiler returned no profile");
        return JSON.stringify(profile);
      } finally {
        active.disconnect();
        session = void 0;
      }
    },
    dispose: () => {
      session?.disconnect();
      session = void 0;
    }
  };
}
function createPressureCpuProfiler(options2) {
  const directory = options2.directory ?? PRESSURE_CPU_PROFILE_DIR;
  const backend = options2.backend ?? createInspectorBackend();
  const now = options2.now ?? Date.now;
  const knobs = () => {
    let live;
    try {
      live = options2.overrides?.();
    } catch {
      live = void 0;
    }
    return {
      sustainedPressureWindowMs: live?.sustainedPressureWindowMs ?? options2.sustainedPressureWindowMs ?? DEFAULT_SUSTAINED_PRESSURE_WINDOW_MS,
      profileDurationMs: live?.profileDurationMs ?? options2.profileDurationMs ?? DEFAULT_PROFILE_DURATION_MS,
      minIntervalMs: live?.minIntervalMs ?? options2.minIntervalMs ?? DEFAULT_MIN_INTERVAL_MS,
      maxRetainedProfiles: Math.max(
        1,
        live?.maxRetainedProfiles ?? options2.maxRetainedProfiles ?? DEFAULT_MAX_RETAINED_PROFILES
      )
    };
  };
  let state = "idle";
  let captureDeadlineMs = 0;
  let lastCaptureStartedAtMs;
  let previousPressureAtMs;
  let disposed = false;
  const pruneOldProfiles = (maxRetainedProfiles) => {
    const profiles = (0, import_node_fs88.readdirSync)(directory).filter((name17) => name17.startsWith(PRESSURE_CPU_PROFILE_PREFIX)).sort();
    for (const name17 of profiles.slice(0, Math.max(0, profiles.length - maxRetainedProfiles))) {
      (0, import_node_fs88.rmSync)((0, import_node_path147.join)(directory, name17), { force: true });
    }
  };
  const finishCapture = async () => {
    state = "stopping";
    try {
      const profileJson = await backend.stop();
      if (disposed) return;
      (0, import_node_fs88.mkdirSync)(directory, { recursive: true });
      const path31 = (0, import_node_path147.join)(directory, `${PRESSURE_CPU_PROFILE_PREFIX}${now()}.cpuprofile`);
      (0, import_node_fs88.writeFileSync)(path31, profileJson);
      pruneOldProfiles(knobs().maxRetainedProfiles);
      options2.reportHostLog("warn", `[sand-host] pressure CPU profile written: ${path31}`);
      options2.onCaptured?.(path31);
    } catch (error42) {
      options2.reportHostLog(
        "warn",
        `[sand-host] pressure CPU profile capture failed: ${errorLogTag(error42)}`
      );
    } finally {
      state = "idle";
    }
  };
  return {
    onPressure: () => {
      if (disposed || state !== "idle") return;
      const nowMs2 = now();
      const effective = knobs();
      if (lastCaptureStartedAtMs != null && nowMs2 - lastCaptureStartedAtMs < effective.minIntervalMs) {
        return;
      }
      const sustained = previousPressureAtMs != null && nowMs2 - previousPressureAtMs <= effective.sustainedPressureWindowMs;
      if (!sustained) {
        previousPressureAtMs = nowMs2;
        return;
      }
      previousPressureAtMs = void 0;
      state = "starting";
      lastCaptureStartedAtMs = nowMs2;
      void backend.start().then(() => {
        if (disposed) {
          backend.dispose();
          state = "idle";
          return;
        }
        if (state === "starting") {
          captureDeadlineMs = now() + effective.profileDurationMs;
          state = "profiling";
        }
      }).catch((error42) => {
        options2.reportHostLog(
          "warn",
          `[sand-host] pressure CPU profile start failed: ${errorLogTag(error42)}`
        );
        state = "idle";
        lastCaptureStartedAtMs = void 0;
      });
    },
    onTick: () => {
      if (disposed || state !== "profiling") return;
      if (now() < captureDeadlineMs) return;
      void finishCapture();
    },
    dispose: () => {
      if (disposed) return;
      disposed = true;
      if (state === "starting" || state === "profiling") {
        backend.dispose();
      }
      state = "idle";
    }
  };
}

