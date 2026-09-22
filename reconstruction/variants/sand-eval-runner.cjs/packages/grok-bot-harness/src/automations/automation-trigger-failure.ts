/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/automations/automation-trigger-failure.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function triggerParseFailure(family, reason) {
  return { ok: false, family, reason };
}
function isTriggerParseFailure(value) {
  return "ok" in value && value.ok === false;
}
function renderTriggerParseFailure(failure) {
  let subject = `${failure.family} trigger`;
  if (failure.family === "unrecognized") subject = "trigger";
  else if (failure.family === "group") subject = "trigger set";
  return `the ${subject} ${failure.reason}.`;
}

