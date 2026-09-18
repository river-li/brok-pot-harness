var HOOK_STEP_CARRIER_SPECS = Object.fromEntries(Array.from(HOOK_STEPS_SUPPORTING_ADDITIONAL_CONTEXT).map((step) => {
  if (!isHookStepAdditionalContextEventName(step)) {
    throw new Error(`HOOK_STEPS_SUPPORTING_ADDITIONAL_CONTEXT lists ${step} but HookStepAdditionalContextEventName does not include it. Extend the Extract<> union in spec.ts.`);
  }
  return [step, { hookEventName: step }];
}));
function isHookStepAdditionalContextEventName(step) {
  return step === HookStep.sessionStart || step === HookStep.beforeSubmitPrompt || step === HookStep.preToolUse || step === HookStep.postToolUse || step === HookStep.postToolUseFailure;
}
