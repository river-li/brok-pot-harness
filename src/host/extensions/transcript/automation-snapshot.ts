/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/automation-snapshot.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function snapshotAutomations(automations) {
  const map4 = /* @__PURE__ */ new Map();
  for (const automation of automations) {
    map4.set(automation.id, {
      id: automation.id,
      ...snapshotAuthoredAutomation({ automation }),
      triggerType: automation.trigger.type,
      schedule: automation.schedule,
      ...automation.provenance === void 0 ? {} : { provenance: automation.provenance },
      createdAt: automation.createdAt,
      recordedRunCount: automation.runs.length
    });
  }
  return map4;
}
function diffAutomationAction(before, after) {
  return diffAuthoredAutomationAction({ before, after });
}

