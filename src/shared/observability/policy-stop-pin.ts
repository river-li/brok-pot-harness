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
