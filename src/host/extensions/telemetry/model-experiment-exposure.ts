/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/model-experiment-exposure.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var HYDRATION_WAIT_MS = 6e4;
function createModelExperimentExposureLatch(deps) {
  let logged = false;
  async function flush() {
    if (logged) return;
    const envOverride = deps.modelExperimentOverride;
    if (envOverride == null && !deps.experiments.hasHydratedStatsigUserId()) {
      const ready3 = await deps.experiments.waitForHydratedStatsigUserId(HYDRATION_WAIT_MS);
      if (logged) return;
      if (!ready3) return;
    }
    const state = envOverride ?? deps.experiments.getSandModelExperimentState();
    if (state == null || !state.active) return;
    const sdkExposed = deps.experiments.logSandModelExperimentExposure();
    if (!sdkExposed) {
      if (envOverride == null) return;
      if (!deps.analytics.canRecordEvents()) return;
    }
    logged = true;
    if (deps.analytics.canRecordEvents()) {
      deps.analytics.trackEvent("sand.model_experiment.exposure", {
        arm: state.arm
      });
    }
  }
  return {
    note: () => {
      if (logged) return;
      void flush();
    }
  };
}

