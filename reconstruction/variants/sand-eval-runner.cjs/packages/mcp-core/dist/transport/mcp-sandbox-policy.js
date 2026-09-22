/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/transport/mcp-sandbox-policy.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function normalizeNetworkList(entries) {
  const configuredEntries = (entries !== null && entries !== void 0 ? entries : []).filter((entry) => entry.trim().length > 0);
  const normalizedEntries = configuredEntries.flatMap((entry) => {
    const normalized = normalizeMcpNetworkAllowlistPattern(entry);
    return normalized === void 0 ? [] : [normalized];
  });
  return {
    hasConfiguredEntries: configuredEntries.length > 0,
    hasInvalidEntries: normalizedEntries.length !== configuredEntries.length,
    entries: normalizedEntries
  };
}
function getSandboxAllowlistEntries(allowlist) {
  return allowlist.entries.includes("*") ? [...PROXY_MEDIATED_ALLOW_ALL] : allowlist.entries;
}
function buildMcpNetworkPolicy(config2) {
  const allowlist = normalizeNetworkList(config2.mcpNetworkAllowlist);
  const denylist = normalizeNetworkList(config2.mcpNetworkDenylist);
  const mode = config2.mcpNetworkMode;
  if (mode === "deny_all" || denylist.entries.includes("*") || denylist.hasInvalidEntries) {
    return { version: 1, default: "deny" };
  }
  if (mode === "allow_all") {
    return Object.assign({ version: 1, default: "deny", allow: [...PROXY_MEDIATED_ALLOW_ALL] }, denylist.entries.length > 0 ? { deny: denylist.entries } : {});
  }
  if (mode === "allowlist" || allowlist.hasConfiguredEntries) {
    const sandboxAllowlist = getSandboxAllowlistEntries(allowlist);
    return sandboxAllowlist.length > 0 ? Object.assign({ version: 1, default: "deny", allow: sandboxAllowlist }, denylist.entries.length > 0 ? { deny: denylist.entries } : {}) : { version: 1, default: "deny" };
  }
  return Object.assign({ version: 1, default: "deny", allow: [...PROXY_MEDIATED_ALLOW_ALL] }, denylist.entries.length > 0 ? { deny: denylist.entries } : {});
}
function buildMcpSandboxPolicy(config2, workspaceDir) {
  return __awaiter28(this, void 0, void 0, function* () {
    const { resolveSandboxPolicyForWorkspace: resolveSandboxPolicyForWorkspace2 } = yield Promise.resolve().then(() => (init_dist4(), dist_exports));
    const mcpNetworkPolicy = {
      type: "workspace_readwrite",
      sandboxWorkspaceRoot: workspaceDir,
      // Keep command MCPs sandboxed while allowing default egress through the
      // network proxy unless an admin/user-extension deny pattern closes it.
      networkPolicy: buildMcpNetworkPolicy(config2),
      networkPolicyStrict: true
    };
    const { policy } = yield resolveSandboxPolicyForWorkspace2(workspaceDir, {
      perUser: mcpNetworkPolicy
    });
    return policy;
  });
}
var __awaiter28, PROXY_MEDIATED_ALLOW_ALL;
var init_mcp_sandbox_policy = __esm({
  "../packages/mcp-core/dist/transport/mcp-sandbox-policy.js"() {
    "use strict";
    init_mcp_url_utils();
    __awaiter28 = function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve14) {
          resolve14(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject2(e);
          }
        }
        function rejected3(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject2(e);
          }
        }
        function step(result) {
          result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    PROXY_MEDIATED_ALLOW_ALL = ["0.0.0.0/0", "::/0"];
  }
});

