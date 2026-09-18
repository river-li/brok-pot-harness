init_sandbox_pb();
function toRedactedNetworkPolicyLoggingConfig(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    decisionLogPath: msg.decisionLogPath !== void 0 ? createRedactedString(msg.decisionLogPath, DataClassification.PATH, "decision_log_path", privacyMode) : void 0,
    logFormat: msg.logFormat
  };
}
function fromRedactedNetworkPolicyLoggingConfig(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new NetworkPolicyLoggingConfig({
    decisionLogPath: msg.decisionLogPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    logFormat: msg.logFormat
  });
}
function toRedactedNetworkPolicy(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    version: msg.version,
    defaultAction: msg.defaultAction,
    deny: msg.deny,
    allow: msg.allow,
    logging: msg.logging !== void 0 ? toRedactedNetworkPolicyLoggingConfig(msg.logging, privacyMode) : void 0
  };
}
function fromRedactedNetworkPolicy(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new NetworkPolicy({
    version: msg.version,
    defaultAction: msg.defaultAction,
    deny: msg.deny,
    allow: msg.allow,
    logging: msg.logging !== void 0 ? fromRedactedNetworkPolicyLoggingConfig(msg.logging, purpose, opts) : void 0
  });
}
function toRedactedSandboxPolicy(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    type: msg.type,
    networkAccess: msg.networkAccess,
    additionalReadwritePaths: msg.additionalReadwritePaths.map((v2) => createRedactedString(v2, DataClassification.PATH, "additional_readwrite_paths", privacyMode)),
    additionalReadonlyPaths: msg.additionalReadonlyPaths.map((v2) => createRedactedString(v2, DataClassification.PATH, "additional_readonly_paths", privacyMode)),
    debugOutputDir: msg.debugOutputDir !== void 0 ? createRedactedString(msg.debugOutputDir, DataClassification.PATH, "debug_output_dir", privacyMode) : void 0,
    disableTmpWrite: msg.disableTmpWrite,
    allowlistEscalated: msg.allowlistEscalated,
    enableSharedBuildCache: msg.enableSharedBuildCache,
    networkPolicy: msg.networkPolicy !== void 0 ? toRedactedNetworkPolicy(msg.networkPolicy, privacyMode) : void 0,
    networkPolicyStrict: msg.networkPolicyStrict,
    captureDenies: msg.captureDenies,
    skipStatsigDefaults: msg.skipStatsigDefaults,
    readBoundary: msg.readBoundary,
    additionalReadPaths: msg.additionalReadPaths.map((v2) => createRedactedString(v2, DataClassification.PATH, "additional_read_paths", privacyMode))
  };
}
function fromRedactedSandboxPolicy(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SandboxPolicy({
    type: msg.type,
    networkAccess: msg.networkAccess,
    additionalReadwritePaths: msg.additionalReadwritePaths.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    additionalReadonlyPaths: msg.additionalReadonlyPaths.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    debugOutputDir: msg.debugOutputDir?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    disableTmpWrite: msg.disableTmpWrite,
    allowlistEscalated: msg.allowlistEscalated,
    enableSharedBuildCache: msg.enableSharedBuildCache,
    networkPolicy: msg.networkPolicy !== void 0 ? fromRedactedNetworkPolicy(msg.networkPolicy, purpose, opts) : void 0,
    networkPolicyStrict: msg.networkPolicyStrict,
    captureDenies: msg.captureDenies,
    skipStatsigDefaults: msg.skipStatsigDefaults,
    readBoundary: msg.readBoundary,
    additionalReadPaths: msg.additionalReadPaths.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }))
  });
}
