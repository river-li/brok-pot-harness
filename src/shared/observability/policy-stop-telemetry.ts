init_bounded();
function policyStoppedTelemetry(stop, process3) {
  return {
    level: "warn",
    metadata: {
      policy_name: stop.policyName,
      reason: stop.reason,
      error_class: stop.errorClass,
      process: process3,
      ...sandErrorTags(SandError.policyStopped({ reason: brandLiteralEnum(stop.reason) }))
    }
  };
}
