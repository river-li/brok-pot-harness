/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/environment-filter.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isEnvironmentEligible(item, targetEnv) {
  var _a20, _b2;
  const disabledEnvironments = (_a20 = item.disabledEnvironments) !== null && _a20 !== void 0 ? _a20 : [];
  if (disabledEnvironments.includes(targetEnv)) {
    return false;
  }
  const environments = (_b2 = item.environments) !== null && _b2 !== void 0 ? _b2 : [];
  if (environments.length === 0) {
    return true;
  }
  return environments.includes(targetEnv);
}
function filterByEnvironment(items, targetEnv) {
  return items.filter((item) => isEnvironmentEligible(item, targetEnv));
}

