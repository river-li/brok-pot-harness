/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/transport/mcp-sandbox-policy-fingerprint.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function hasConfiguredNetworkAllowlist(config2) {
  var _a20;
  return ((_a20 = config2.mcpNetworkAllowlist) !== null && _a20 !== void 0 ? _a20 : []).some((entry) => entry.trim().length > 0);
}
function normalizeNetworkListForFingerprint(entries) {
  const configuredEntries = (entries !== null && entries !== void 0 ? entries : []).filter((entry) => entry.trim().length > 0);
  const normalizedEntries = configuredEntries.flatMap((entry) => {
    const normalized = normalizeMcpNetworkAllowlistPattern(entry);
    return normalized === void 0 ? [] : [normalized];
  });
  return {
    hasInvalidEntries: normalizedEntries.length !== configuredEntries.length,
    entries: normalizedEntries
  };
}
function getSandboxAllowlistFingerprintEntries(config2) {
  if (config2.mcpNetworkMode === "allow_all") {
    return [...PROXY_MEDIATED_ALLOW_ALL2];
  }
  const allowlist = normalizeNetworkListForFingerprint(config2.mcpNetworkAllowlist);
  if (config2.mcpNetworkMode === "allowlist") {
    return allowlist.entries.includes("*") ? [...PROXY_MEDIATED_ALLOW_ALL2] : allowlist.entries;
  }
  if (!hasConfiguredNetworkAllowlist(config2)) {
    return [...PROXY_MEDIATED_ALLOW_ALL2];
  }
  const effectiveAllowlist = getEffectiveMcpNetworkAllowlist(config2);
  return effectiveAllowlist.includes("*") ? [...PROXY_MEDIATED_ALLOW_ALL2] : effectiveAllowlist;
}
function computeMcpSandboxPolicyFingerprint(config2) {
  const enabled = config2.enabled === true;
  const denylist = normalizeNetworkListForFingerprint(config2.mcpNetworkDenylist);
  const denyAll = config2.mcpNetworkMode === "deny_all" || denylist.entries.includes("*") || denylist.hasInvalidEntries;
  const allow = enabled ? getSandboxAllowlistFingerprintEntries(config2) : [];
  const deny = enabled ? denyAll ? ["*"] : denylist.entries : [];
  return JSON.stringify({
    enabled,
    mode: config2.mcpNetworkMode,
    allow: denyAll ? [] : allow,
    deny
  });
}
var PROXY_MEDIATED_ALLOW_ALL2;
var init_mcp_sandbox_policy_fingerprint = __esm({
  "../packages/mcp-core/dist/transport/mcp-sandbox-policy-fingerprint.js"() {
    "use strict";
    init_mcp_url_utils();
    PROXY_MEDIATED_ALLOW_ALL2 = ["0.0.0.0/0", "::/0"];
  }
});

