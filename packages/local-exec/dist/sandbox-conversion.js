/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/sandbox-conversion.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_sandbox_pb();
init_dist6();
function convertProtoToNetworkPolicy(policy) {
  if (!policy)
    return void 0;
  const result = {};
  if (policy.version !== void 0) {
    result.version = policy.version;
  }
  if (policy.defaultAction !== void 0) {
    switch (policy.defaultAction) {
      case NetworkPolicy_DefaultAction.ALLOW:
        result.default = "allow";
        break;
      case NetworkPolicy_DefaultAction.DENY:
        result.default = "deny";
        break;
    }
  }
  if (policy.deny && policy.deny.length > 0) {
    result.deny = policy.deny;
  }
  if (policy.allow && policy.allow.length > 0) {
    result.allow = policy.allow;
  }
  if (policy.logging) {
    result.logging = convertProtoToNetworkPolicyLoggingConfig(policy.logging);
  }
  return result;
}
function convertProtoToNetworkPolicyLoggingConfig(config2) {
  const result = {};
  if (config2.decisionLogPath) {
    result.decisionLogPath = config2.decisionLogPath;
  }
  if (config2.logFormat === "jsonl") {
    result.logFormat = "jsonl";
  }
  return result;
}
function resolveNetworkPolicy(policy) {
  const explicit = convertProtoToNetworkPolicy(policy.networkPolicy);
  if (explicit)
    return explicit;
  return policy.networkAccess ? networkAllowAllPolicy() : networkDisabledPolicy();
}
function convertProtoToReadBoundary(mode) {
  switch (mode) {
    case SandboxPolicy_ReadBoundaryMode.SYSTEM:
      return "system";
    case SandboxPolicy_ReadBoundaryMode.WORKSPACE:
      return "workspace";
    case SandboxPolicy_ReadBoundaryMode.UNSPECIFIED:
    default:
      return void 0;
  }
}
function sandboxedProtoFields(policy) {
  const readBoundary = convertProtoToReadBoundary(policy.readBoundary);
  const paths = policy.additionalReadPaths ?? [];
  return {
    readBoundary,
    additionalReadPaths: readBoundary === "workspace" && paths.length > 0 ? paths : void 0
  };
}
function convertProtoToInternalPolicy(policy) {
  if (!policy) {
    return { type: "insecure_none" };
  }
  switch (policy.type) {
    case SandboxPolicy_Type.INSECURE_NONE:
    case SandboxPolicy_Type.UNSPECIFIED:
      return {
        type: "insecure_none",
        allowlistEscalated: policy.allowlistEscalated,
        enableSharedBuildCache: policy.enableSharedBuildCache,
        debugOutputDir: policy.debugOutputDir,
        captureDenies: policy.captureDenies
      };
    case SandboxPolicy_Type.WORKSPACE_READWRITE:
      return {
        type: "workspace_readwrite",
        networkPolicy: resolveNetworkPolicy(policy),
        skipStatsigDefaults: policy.skipStatsigDefaults,
        additionalReadwritePaths: policy.additionalReadwritePaths,
        additionalReadonlyPaths: policy.additionalReadonlyPaths,
        disableTmpWrite: policy.disableTmpWrite,
        enableSharedBuildCache: policy.enableSharedBuildCache,
        debugOutputDir: policy.debugOutputDir,
        captureDenies: policy.captureDenies,
        networkPolicyStrict: policy.networkPolicyStrict,
        ...sandboxedProtoFields(policy)
      };
    case SandboxPolicy_Type.WORKSPACE_READONLY:
      return {
        type: "workspace_readonly",
        networkPolicy: resolveNetworkPolicy(policy),
        skipStatsigDefaults: policy.skipStatsigDefaults,
        additionalReadonlyPaths: policy.additionalReadonlyPaths,
        disableTmpWrite: policy.disableTmpWrite,
        enableSharedBuildCache: policy.enableSharedBuildCache,
        debugOutputDir: policy.debugOutputDir,
        captureDenies: policy.captureDenies,
        networkPolicyStrict: policy.networkPolicyStrict,
        ...sandboxedProtoFields(policy)
      };
    default:
      return { type: "insecure_none" };
  }
}

