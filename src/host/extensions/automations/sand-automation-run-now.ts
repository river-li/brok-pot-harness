/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/automations/sand-automation-run-now.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm2();
var SAND_AUTOMATION_RUN_NOW_LISTENER_IN_SESSION_MESSAGE = "Only scheduled routines can be run from this conversation; run listener routines from the main conversation.";
var REFUSAL_CODES = /* @__PURE__ */ new Set([
  Code.NotFound,
  Code.InvalidArgument,
  Code.PermissionDenied,
  Code.FailedPrecondition
]);
function isScheduleOnlyTrigger(trigger2) {
  return triggerCronSchedules(trigger2).length > 0 && triggerEventTriggers(trigger2).length === 0;
}
async function runSandAutomationNowInSession(deps, args) {
  const target = (await deps.listAutomations()).find(
    (entry) => entry.agentId === args.agentId && entry.automation.id === args.localId
  );
  if (target !== void 0 && !isScheduleOnlyTrigger(target.automation.trigger)) {
    throw new SandAutomationRunNowRefusedError(SAND_AUTOMATION_RUN_NOW_LISTENER_IN_SESSION_MESSAGE);
  }
  try {
    await deps.client.testAutomation(
      new TestAutomationRequest({
        automationId: stableAutomationId({ agentId: args.agentId, localId: args.localId }),
        samplePayload: { case: "cron", value: new CronSamplePayload() },
        grokBotSessionId: args.sessionId
      })
    );
  } catch (error42) {
    if (error42 instanceof ConnectError && REFUSAL_CODES.has(error42.code)) {
      throw new SandAutomationRunNowRefusedError(error42.rawMessage);
    }
    throw error42;
  }
}

