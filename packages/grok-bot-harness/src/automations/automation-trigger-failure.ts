/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/automations/automation-trigger-failure.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function triggerParseFailure(family, reason) {
  return { ok: false, family, reason };
}
function isTriggerParseFailure(value) {
  return "ok" in value && value.ok === false;
}
function renderTriggerParseFailure(failure2) {
  let subject = `${failure2.family} trigger`;
  if (failure2.family === "unrecognized") subject = "trigger";
  else if (failure2.family === "group") subject = "trigger set";
  return `the ${subject} ${failure2.reason}.`;
}

