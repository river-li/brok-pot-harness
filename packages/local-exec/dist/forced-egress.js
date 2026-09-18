var FORCED_SHELL_EGRESS_ENV = "CURSOR_FORCED_SHELL_EGRESS";
var FORCED_SHELL_EGRESS_DEPENDENCY_REGEX_ENV = "CURSOR_FORCED_SHELL_EGRESS_DEPENDENCY_REGEX";
var FORCED_SHELL_EGRESS_EXTRA_DEPENDENCY_REGEX_ENV = "CURSOR_FORCED_SHELL_EGRESS_EXTRA_DEPENDENCY_REGEX";
var FORCED_SHELL_EGRESS_SOURCE_REGEX_ENV = "CURSOR_FORCED_SHELL_EGRESS_SOURCE_REGEX";
var FORCED_SHELL_EGRESS_EXTRA_SOURCE_REGEX_ENV = "CURSOR_FORCED_SHELL_EGRESS_EXTRA_SOURCE_REGEX";
var FORCED_SHELL_EGRESS_NETWORK_DEFAULT_ENV = "CURSOR_FORCED_SHELL_EGRESS_NETWORK_DEFAULT";
var FORCED_SHELL_EGRESS_DENY_DOMAINS_ENV = "CURSOR_FORCED_SHELL_EGRESS_DENY_DOMAINS";
var FORCED_SHELL_EGRESS_DEPENDENCY_DENY_DOMAINS_ENV = "CURSOR_FORCED_SHELL_EGRESS_DEPENDENCY_DENY_DOMAINS";
var FORCED_SHELL_EGRESS_ALLOW_DOMAINS_ENV = "CURSOR_FORCED_SHELL_EGRESS_ALLOW_DOMAINS";
var FORCED_SHELL_EGRESS_WRITABLE_PATHS_ENV = "CURSOR_FORCED_SHELL_EGRESS_WRITABLE_PATHS";
var SUBSTITUTION_RE = /\$\(|`|<\(|>\(/;
var CONTROL_OPERATOR_RE = /[;&|]/;
var ENV_ASSIGNMENT_PREFIX = "(?:[A-Za-z_][A-Za-z0-9_]*=[^\\s]*\\s+)*";
var cachedEnabled;
var cachedDependencyRe;
var cachedSourceLookupRe;
var cachedPolicyOverrides;
function isForcedShellEgressEnabled() {
  if (cachedEnabled === void 0) {
    const raw = (process.env[FORCED_SHELL_EGRESS_ENV] ?? "").trim().toLowerCase();
    cachedEnabled = raw !== "" && raw !== "0" && raw !== "false" && raw !== "off";
  }
  return cachedEnabled;
}
function requiredRegexSource(envVar) {
  const raw = (process.env[envVar] ?? "").trim();
  if (!raw) {
    return void 0;
  }
  try {
    new RegExp(raw, "i");
    return raw;
  } catch (error3) {
    throw new Error(`[forced-egress] invalid regex in ${envVar}: ${String(error3)}`);
  }
}
function parseDomainListEnv(envVar) {
  return (process.env[envVar] ?? "").split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
}
function parseWritablePathsEnv(envVar) {
  const entries = (process.env[envVar] ?? "").split(":").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  const absolute = entries.filter((entry) => entry.startsWith("/"));
  const dropped = entries.length - absolute.length;
  if (dropped > 0) {
    console.error(`[forced-egress] ignoring ${dropped} non-absolute path(s) in ${envVar}.`);
  }
  return absolute;
}
function policyOverrides() {
  if (cachedPolicyOverrides === void 0) {
    const rawDefault = (process.env[FORCED_SHELL_EGRESS_NETWORK_DEFAULT_ENV] ?? "").trim().toLowerCase();
    let networkDefault = "deny";
    if (rawDefault === "allow" || rawDefault === "deny") {
      networkDefault = rawDefault;
    } else if (rawDefault !== "") {
      console.error(`[forced-egress] ignoring invalid value in ${FORCED_SHELL_EGRESS_NETWORK_DEFAULT_ENV} (expected "allow" or "deny"); using "deny".`);
    }
    const denyDomains = parseDomainListEnv(FORCED_SHELL_EGRESS_DENY_DOMAINS_ENV);
    const rawDependencyDeny = (process.env[FORCED_SHELL_EGRESS_DEPENDENCY_DENY_DOMAINS_ENV] ?? "").trim();
    let dependencyDenyDomains = denyDomains;
    if (rawDependencyDeny.toLowerCase() === "none") {
      dependencyDenyDomains = [];
    } else if (rawDependencyDeny !== "") {
      dependencyDenyDomains = parseDomainListEnv(FORCED_SHELL_EGRESS_DEPENDENCY_DENY_DOMAINS_ENV);
    }
    cachedPolicyOverrides = {
      networkDefault,
      denyDomains,
      dependencyDenyDomains,
      allowDomains: parseDomainListEnv(FORCED_SHELL_EGRESS_ALLOW_DOMAINS_ENV),
      writablePaths: parseWritablePathsEnv(FORCED_SHELL_EGRESS_WRITABLE_PATHS_ENV)
    };
  }
  return cachedPolicyOverrides;
}
function compileConfigurablePattern(overrideEnv, extraEnv, options2 = {}) {
  const parts = [
    requiredRegexSource(overrideEnv),
    requiredRegexSource(extraEnv)
  ].filter((part) => part !== void 0).map((part) => `(?:${part})`);
  if (parts.length === 0) {
    return null;
  }
  const body = parts.join("|");
  const pattern = options2.anchorToExecutable ? `^\\s*${ENV_ASSIGNMENT_PREFIX}(?:${body})` : body;
  return new RegExp(pattern, "i");
}
function dependencyRegex() {
  if (cachedDependencyRe === void 0) {
    cachedDependencyRe = compileConfigurablePattern(FORCED_SHELL_EGRESS_DEPENDENCY_REGEX_ENV, FORCED_SHELL_EGRESS_EXTRA_DEPENDENCY_REGEX_ENV, { anchorToExecutable: true });
  }
  return cachedDependencyRe;
}
function sourceLookupRegex() {
  if (cachedSourceLookupRe === void 0) {
    cachedSourceLookupRe = compileConfigurablePattern(FORCED_SHELL_EGRESS_SOURCE_REGEX_ENV, FORCED_SHELL_EGRESS_EXTRA_SOURCE_REGEX_ENV);
  }
  return cachedSourceLookupRe;
}
function forcedLoopbackEgressPolicy() {
  const overrides = policyOverrides();
  return {
    type: "workspace_readwrite",
    ...overrides.writablePaths.length > 0 ? { additionalReadwritePaths: overrides.writablePaths } : {},
    networkPolicy: {
      version: 1,
      default: overrides.networkDefault,
      allow: ["127.0.0.0/8", "::1/128", "localhost", ...overrides.allowDomains],
      ...overrides.denyDomains.length > 0 ? { deny: overrides.denyDomains } : {}
    },
    networkPolicyStrict: true,
    skipStatsigDefaults: true,
    enableSharedBuildCache: true
  };
}
function forcedDependencyEgressPolicy() {
  const overrides = policyOverrides();
  return {
    type: "workspace_readwrite",
    ...overrides.writablePaths.length > 0 ? { additionalReadwritePaths: overrides.writablePaths } : {},
    networkPolicy: {
      version: 1,
      default: "allow",
      ...overrides.dependencyDenyDomains.length > 0 ? { deny: overrides.dependencyDenyDomains } : {}
    },
    skipStatsigDefaults: true,
    enableSharedBuildCache: true
  };
}
function forcedShellSandboxPolicy(command, parsingResult) {
  const loopback = forcedLoopbackEgressPolicy();
  const dependencyRe = dependencyRegex();
  if (dependencyRe === null) {
    return loopback;
  }
  const commands = parsingResult?.executableCommands ?? [];
  if (parsingResult?.parsingFailed || commands.length === 0) {
    return loopback;
  }
  if (SUBSTITUTION_RE.test(command)) {
    return loopback;
  }
  const sourceLookupRe = sourceLookupRegex();
  for (const cmd of commands) {
    const text2 = cmd.fullText?.trim() || cmd.name?.trim() || "";
    if (!text2 || sourceLookupRe?.test(text2) || CONTROL_OPERATOR_RE.test(text2)) {
      return loopback;
    }
  }
  const allDependency = commands.every((cmd) => dependencyRe.test(cmd.fullText?.trim() || cmd.name?.trim() || ""));
  return allDependency ? forcedDependencyEgressPolicy() : loopback;
}
