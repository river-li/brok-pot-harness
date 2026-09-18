var SAND_ONBOARDING_BOT_EXPERIMENT_NAME = "sand_onboarding_bot_ab";
function resolveSandOnboardingBotExperimentEnabled(inputs) {
  if (inputs.groupName == null || inputs.groupName === "") return void 0;
  return inputs.enabled;
}
