/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-automation-auto-review.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_smart_mode_classifier_exec_pb();
var SAND_AUTOMATION_WRITE_CLASSIFIER_TARGET_ACTION = "sand_automation_write";
var SAND_AUTOMATION_WRITE_CLASSIFIER_ERROR_REASON = "An error occurred while reviewing this routine. Please review manually.";
function sandAutomationWriteProvenance(source) {
  return source === "turn" || source === "handoff-resume" ? "user" : "untrusted";
}
function isTemplateSetupConsentedWrite(args) {
  return args.operation === "create" && args.spec.isEnabled === false && args.spec.trigger.type === "cron";
}
function reviewedWriteProvenance(turnProvenance) {
  return turnProvenance === "template_import" ? "untrusted" : turnProvenance;
}
function buildSandAutomationWriteRiskTarget(args) {
  const {
    operation,
    id,
    spec,
    referencedSkills,
    referencingRoutines,
    writeProvenance,
    firingRoutine
  } = args.target;
  return new SmartModeRiskTarget({
    action: SAND_AUTOMATION_WRITE_CLASSIFIER_TARGET_ACTION,
    arguments: structFromRecord({
      surface: "automation_write",
      operation,
      write_provenance: writeProvenance,
      ...firingRoutine === void 0 ? {} : {
        firing_routine: {
          id: firingRoutine.id,
          name: firingRoutine.name,
          prompt: firingRoutine.prompt,
          provenance: firingRoutine.provenance
        }
      },
      automation_id: id,
      name: spec.name,
      prompt: spec.prompt,
      trigger: serializeStoredTrigger(spec.trigger),
      schedule: triggerSchedule(spec.trigger) ?? void 0,
      trigger_description: describeTrigger(spec.trigger),
      enabled: spec.isEnabled,
      referenced_workflows: referencedSkills?.map((skill) => ({
        id: skill.id,
        name: skill.name,
        body: skill.body
      })) ?? [],
      referencing_routines: referencingRoutines?.map((automation) => ({
        id: automation.id,
        name: automation.name,
        prompt: automation.prompt
      })) ?? [],
      project_permissions: buildProjectPermissionsContext({
        personalInstructions: args.personalInstructions,
        userAutoRunInstructions: args.userAutoRunInstructions,
        projectAutoRunInstructions: args.projectAutoRunInstructions
      })
    })
  });
}
var SAND_AUTOMATION_WRITE_REVIEW_SPEC = {
  surface: "automation_write",
  classifierErrorReason: SAND_AUTOMATION_WRITE_CLASSIFIER_ERROR_REASON,
  buildRiskTarget: buildSandAutomationWriteRiskTarget,
  fingerprintPayload: (target) => ({
    operation: target.operation,
    id: target.id,
    spec: target.spec,
    referencedSkills: target.referencedSkills ?? [],
    referencingRoutines: target.referencingRoutines ?? []
  }),
  summarize: (target) => summarizeSandAutomationWriteAction({
    operation: target.operation,
    name: target.spec.name,
    triggerDescription: describeTrigger(target.spec.trigger),
    prompt: target.spec.prompt,
    isEnabled: target.spec.isEnabled,
    referencingAutomationNames: target.referencingRoutines?.map((r) => r.name)
  }),
  abortPolicy: { kind: "pass-through" }
};
async function reviewSandAutomationWrite(args) {
  return await runSandAutoReviewFlow({ ...args, spec: SAND_AUTOMATION_WRITE_REVIEW_SPEC });
}

