/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/experiments/sand-model-experiment.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function parseSandModelExperimentOverride(value) {
  const raw = value?.trim().toLowerCase();
  if (raw == null || raw.length === 0) return void 0;
  if (raw === "control") return { active: true, arm: "control" };
  if (raw === "treatment" || raw === "test") {
    return { active: true, arm: "treatment" };
  }
  return void 0;
}

