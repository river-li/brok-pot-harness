/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/index.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var dist_exports = {};
__export(dist_exports, {
  BashState: () => BashState,
  INSECURE_NONE_SANDBOX_POLICY: () => INSECURE_NONE_SANDBOX_POLICY,
  KnownShellExecutor: () => KnownShellExecutor,
  NaiveTerminalExecutor: () => NaiveTerminalExecutor,
  OutputSuppressionController: () => OutputSuppressionController,
  PowerShellState: () => PowerShellState,
  SHELL_OUTPUT_SUPPRESSED_NOTICE: () => SHELL_OUTPUT_SUPPRESSED_NOTICE,
  SandboxUnsupportedError: () => SandboxUnsupportedError,
  ZshState: () => ZshState,
  configureRipgrepPath: () => configureRipgrepPath,
  configureSandboxPrereqs: () => configureSandboxPrereqs2,
  createDefaultTerminalExecutor: () => createDefaultTerminalExecutor,
  createIgnoreMapping: () => createIgnoreMapping,
  createNaiveTerminalExecutor: () => createNaiveTerminalExecutor,
  getLastSandboxFailureReason: () => getLastSandboxFailureReason,
  getPowerShellExecutable: () => getPowerShellExecutable,
  getRipgrepBinaryPath: () => getRipgrepBinaryPath,
  getSandboxPolicyType: () => getSandboxPolicyType,
  getShellExecutablePath: () => getShellExecutablePath,
  getSuggestedShell: () => getSuggestedShell,
  isAllowAllNetworkByPolicy: () => isAllowAllNetworkByPolicy,
  isHardcodedWriteProtected: () => isHardcodedWriteProtected,
  isNetworkEnabledByPolicy: () => isNetworkEnabledByPolicy,
  isRipgrepConfigured: () => isRipgrepConfigured,
  isSandboxSupported: () => isSandboxSupported,
  loadSandboxPolicyFromFileOrUndefined: () => loadSandboxPolicyFromFileOrUndefined,
  mergeAdditionalReadPaths: () => mergeAdditionalReadPaths,
  mergeNetworkPolicies: () => mergeNetworkPolicies,
  mergePathsIntersection: () => mergePathsIntersection,
  mergePathsUnion: () => mergePathsUnion,
  mergeReadBoundary: () => mergeReadBoundary,
  networkAllowAllPolicy: () => networkAllowAllPolicy,
  networkDisabledPolicy: () => networkDisabledPolicy,
  parseSandboxPolicyJson: () => parseSandboxPolicyJson,
  primeSandboxSupport: () => primeSandboxSupport,
  resolvePolicyPaths: () => resolvePolicyPaths,
  resolveRipgrepFromPath: () => resolveRipgrepFromPath,
  resolveSandboxPolicyForWorkspace: () => resolveSandboxPolicyForWorkspace,
  spawnInSandbox: () => spawnInSandbox,
  spawnWithSignal: () => spawnWithSignal,
  withConfiguredRipgrepEnv: () => withConfiguredRipgrepEnv
});
function getShellExecutablePath(shell) {
  switch (shell) {
    case KnownShellExecutor.Zsh:
    case KnownShellExecutor.ZshLight:
      return findActualExecutable("zsh", []).cmd;
    case KnownShellExecutor.Bash:
      return findActualExecutable("bash", []).cmd;
    case KnownShellExecutor.PowerShell:
      return getPowerShellExecutable();
    default:
      return process.env.SHELL || "/bin/sh";
  }
}
function commandExists(command) {
  try {
    return findActualExecutable(command, []).cmd !== command;
  } catch (_e2) {
    return false;
  }
}
function getGitBashPathFromExePath(exepath) {
  const normalizedExePath = exepath.replace(/[\\/]+$/, "");
  const basename11 = import_node_path8.default.win32.basename(normalizedExePath).toLowerCase();
  if (basename11 === "bash.exe") {
    return normalizedExePath;
  }
  if (basename11 === "bin") {
    return import_node_path8.default.win32.join(normalizedExePath, "bash.exe");
  }
  return import_node_path8.default.win32.join(normalizedExePath, "bin", "bash.exe");
}
function detectGitBashFromEnvironment() {
  if (process.platform !== "win32") {
    return void 0;
  }
  const msystem = process.env.MSYSTEM;
  if (!msystem) {
    return void 0;
  }
  const exepath = process.env.EXEPATH;
  if (exepath) {
    return getGitBashPathFromExePath(exepath);
  }
  const commonPaths = [
    "C:\\Program Files\\Git\\bin\\bash.exe",
    "C:\\Program Files (x86)\\Git\\bin\\bash.exe"
  ];
  for (const candidatePath of commonPaths) {
    try {
      const result = findActualExecutable(candidatePath, []);
      if (result.cmd === candidatePath) {
        return candidatePath;
      }
    } catch {
    }
  }
  return "C:\\Program Files\\Git\\bin\\bash.exe";
}
function getSuggestedShell(userTerminalHint) {
  if (userTerminalHint === KnownShellExecutor.ZshLight) {
    return KnownShellExecutor.ZshLight;
  }
  const shell = userTerminalHint || process.env.SHELL || "";
  const isWindows4 = process.platform === "win32";
  const gitBashFromEnv = isWindows4 && !userTerminalHint ? detectGitBashFromEnvironment() : void 0;
  const isGitBash = gitBashFromEnv !== void 0 || /git.*bash\.exe$/i.test(shell) || /program.*git.*bin.*bash\.exe$/i.test(shell);
  const bashIsOkay = !isWindows4 || isGitBash;
  if (shell.includes("zsh")) {
    return KnownShellExecutor.Zsh;
  } else if (shell.includes("bash") && bashIsOkay) {
    return KnownShellExecutor.Bash;
  } else if (shell.includes("pwsh") || shell.includes("powershell")) {
    return KnownShellExecutor.PowerShell;
  } else if (gitBashFromEnv) {
    return KnownShellExecutor.Bash;
  } else {
    if (isWindows4) {
      if (commandExists("pwsh") || commandExists("powershell")) {
        return KnownShellExecutor.PowerShell;
      }
    }
    if (commandExists("zsh")) {
      return KnownShellExecutor.Zsh;
    } else if (commandExists("bash") && bashIsOkay) {
      return KnownShellExecutor.Bash;
    } else if (commandExists("pwsh") || commandExists("powershell")) {
      return KnownShellExecutor.PowerShell;
    } else {
      return KnownShellExecutor.Naive;
    }
  }
}
function createDefaultTerminalExecutor(options2) {
  let effectiveOptions = options2;
  if (!options2?.userTerminalHint) {
    const gitBashPath = detectGitBashFromEnvironment();
    if (gitBashPath) {
      effectiveOptions = {
        ...options2,
        userTerminalHint: gitBashPath
      };
    }
  }
  const suggestedShell = getSuggestedShell(effectiveOptions?.userTerminalHint ?? "");
  switch (suggestedShell) {
    case KnownShellExecutor.Zsh:
      return new LazyTerminalExecutor(() => initZshState(effectiveOptions));
    case KnownShellExecutor.Bash:
      return new LazyTerminalExecutor(() => initBashState(effectiveOptions));
    case KnownShellExecutor.PowerShell:
      return new LazyTerminalExecutor(() => initPowerShellState());
    case KnownShellExecutor.ZshLight:
      return new LazyTerminalExecutor(() => initZshLightState(effectiveOptions));
    default:
      return createNaiveTerminalExecutor(effectiveOptions);
  }
}
var import_node_path8, INSECURE_NONE_SANDBOX_POLICY;
var init_dist4 = __esm({
  "../packages/shell-exec/dist/index.js"() {
    "use strict";
    import_node_path8 = __toESM(require("node:path"), 1);
    init_dist3();
    init_bash();
    init_lazy();
    init_naive();
    init_powershell();
    init_types4();
    init_zsh();
    init_zsh_light();
    init_bash();
    init_core2();
    init_ignore_mapping();
    init_naive();
    init_output_suppression();
    init_powershell();
    init_ripgrep();
    init_hardcoded_policy();
    init_network_policy_utils();
    init_policy_loader();
    init_policy_merge();
    init_sandbox();
    init_types4();
    init_zsh();
    INSECURE_NONE_SANDBOX_POLICY = {
      perUser: { type: "insecure_none" }
    };
  }
});

