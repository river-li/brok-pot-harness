/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/automations/automation-change.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

