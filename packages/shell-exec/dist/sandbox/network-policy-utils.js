function getEffectiveNetworkPolicy(policy) {
  if (policy !== void 0) {
    return policy;
  }
  return { version: 1, default: "deny" };
}
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
function isAllowAllNetworkByPolicy(policy) {
  if (policy === void 0) {
    return false;
  }
  return policy.default === "allow";
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
