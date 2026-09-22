var __awaiter53 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
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
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function gitNonInteractiveLeadingArgs() {
  const args = ["-c", "credential.interactive=false", "-c", "core.fsmonitor=false"];
  if (process.platform === "win32") {
    args.push("-c", "core.longpaths=true");
  }
  return args;
}
function gitNonInteractiveExecOptions(extra) {
  var _a19;
  const env = Object.assign(Object.assign({}, process.env), {
    GIT_TERMINAL_PROMPT: "0",
    GIT_ASKPASS: void 0,
    VSCODE_GIT_ASKPASS_NODE: void 0,
    VSCODE_GIT_ASKPASS_MAIN: void 0,
    VSCODE_GIT_ASKPASS_EXTRA_ARGS: void 0,
    // Tell Git Credential Manager to never show a UI, but leave it enabled so
    // it can still hand back credentials it has already cached. We do NOT set
    // `GCM_PROVIDER`: forcing a provider (or an unrecognized value like
    // "none") interferes with GCM's host auto-detection and can stop it from
    // serving stored GitHub/Azure credentials.
    GCM_INTERACTIVE: "Never"
  });
  env.GIT_CONFIG_NOSYSTEM = void 0;
  if ((extra === null || extra === void 0 ? void 0 : extra.sshBatchMode) === true) {
    const baseSshCommand = ((_a19 = process.env.GIT_SSH_COMMAND) === null || _a19 === void 0 ? void 0 : _a19.trim()) || "ssh";
    env.GIT_SSH_COMMAND = `${baseSshCommand} -oBatchMode=yes`;
  }
  if ((extra === null || extra === void 0 ? void 0 : extra.extraGitConfig) !== void 0) {
    const entries = Object.entries(extra.extraGitConfig).flatMap(([key, value]) => Array.isArray(value) ? value.map((v2) => [key, v2]) : [[key, value]]);
    env.GIT_CONFIG_COUNT = String(entries.length);
    for (const [index, [key, value]] of entries.entries()) {
      env[`GIT_CONFIG_KEY_${index}`] = key;
      env[`GIT_CONFIG_VALUE_${index}`] = value;
    }
  }
  return {
    cwd: extra === null || extra === void 0 ? void 0 : extra.cwd,
    env
  };
}
function resolveExtraGitConfig(provider) {
  return typeof provider === "function" ? provider() : provider;
}
function execGitNonInteractive(args, options2) {
  return __awaiter53(this, void 0, void 0, function* () {
    const execOptions = gitNonInteractiveExecOptions({
      cwd: options2 === null || options2 === void 0 ? void 0 : options2.cwd,
      sshBatchMode: options2 === null || options2 === void 0 ? void 0 : options2.sshBatchMode,
      extraGitConfig: options2 === null || options2 === void 0 ? void 0 : options2.extraGitConfig
    });
    return gitExecFile("git", [...gitNonInteractiveLeadingArgs(), ...args], Object.assign(Object.assign({}, execOptions), (options2 === null || options2 === void 0 ? void 0 : options2.timeoutMs) !== void 0 && {
      timeout: options2.timeoutMs,
      killSignal: "SIGTERM"
    }));
  });
}
