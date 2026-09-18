init_scheduling();
function createPollingPolicy2(options2) {
  return createPollingPolicy({ ...options2, report: options2.report ?? reportPolicyStop });
}
