/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/observability/policy-stop-pin.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ERROR_CLASS_TOKEN = /^[0-9A-Za-z._-]{1,64}$/;
var policyStopPin = createBufferedReporterPin({
  capacity: 16,
  overflow: "drop-newest"
});
function installPolicyStopReporter(next) {
  policyStopPin.install(next);
}
function reportPolicyStop(stop) {
  policyStopPin.report({
    policyName: stop.policyName,
    reason: stop.reason,
    errorClass: ERROR_CLASS_TOKEN.test(stop.errorClass) ? stop.errorClass : "Error"
  });
}

