/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/observability/policy-stop-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

