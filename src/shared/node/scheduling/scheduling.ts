init_scheduling();
function createPollingPolicy3(options2) {
  return createPollingPolicy({ ...options2, report: options2.report ?? reportPolicyStop });
}
