/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/sandbox/network-policy-utils.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isNetworkEnabledByPolicy(policy) {
  if (policy === void 0) {
    return false;
  }
  if (policy.default === "allow") {
    return true;
  }
  if (policy.allow !== void 0 && policy.allow.length > 0) {
    return true;
  }
  return false;
}
function networkDisabledPolicy() {
  return { version: 1, default: "deny" };
}
function networkAllowAllPolicy() {
  return { version: 1, default: "allow" };
}
var init_network_policy_utils = __esm({
  "../packages/shell-exec/dist/sandbox/network-policy-utils.js"() {
    "use strict";
  }
});

