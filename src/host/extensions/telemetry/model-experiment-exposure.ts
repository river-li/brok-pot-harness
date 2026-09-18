var HYDRATION_WAIT_MS = 6e4;
function createModelExperimentExposureLatch(deps) {
  let logged = false;
  async function flush() {
    if (logged) return;
    const envOverride = deps.modelExperimentOverride;
    if (envOverride == null && !deps.experiments.hasHydratedStatsigUserId()) {
      const ready2 = await deps.experiments.waitForHydratedStatsigUserId(HYDRATION_WAIT_MS);
      if (logged) return;
      if (!ready2) return;
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
