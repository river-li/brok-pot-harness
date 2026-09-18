function snapshotAuthoredAutomation({
  automation
}) {
  return {
    name: automation.name,
    prompt: automation.prompt,
    trigger: triggerIdentity(automation.trigger),
    isEnabled: automation.isEnabled
  };
}
function diffAuthoredAutomationAction({
  before,
  after
}) {
  const isAuthoredChanged = before.name !== after.name || before.prompt !== after.prompt || before.trigger !== after.trigger;
  if (isAuthoredChanged) return "updated";
  if (before.isEnabled !== after.isEnabled) {
    return after.isEnabled ? "enabled" : "disabled";
  }
  return null;
}
