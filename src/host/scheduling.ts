/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/scheduling.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_scheduling();
function createPollingPolicy2(options2) {
  return createPollingPolicy({ ...options2, report: options2.report ?? reportPolicyStop });
}

