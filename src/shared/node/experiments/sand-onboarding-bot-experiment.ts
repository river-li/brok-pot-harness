/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/experiments/sand-onboarding-bot-experiment.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_ONBOARDING_BOT_EXPERIMENT_NAME = "sand_onboarding_bot_ab";
function resolveSandOnboardingBotExperimentEnabled(inputs) {
  if (inputs.groupName == null || inputs.groupName === "") return void 0;
  return inputs.enabled;
}

