var import_node_crypto13 = require("node:crypto");
var import_node_fs17 = require("node:fs");
var import_promises23 = require("node:fs/promises");
var import_node_path36 = __toESM(require("node:path"), 1);
init_dist();
init_utils_pb();
init_dist4();
init_dist3();
var __addDisposableResource20 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources20 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var logger21 = createLogger("local-exec:shell-core");
var isWindows3 = process.platform === "win32";
var REQUEST_SCOPED_SHELL_ENV_KEYS = [
  "CURSOR_CONVERSATION_ID",
  "CURSOR_REQUEST_ID",
  "CURSOR_AGENT_STORE_FILES_DIR",
  "CURSOR_AGENT_STORE_SHARED_PATHS"
];
function shellSingleQuote(value) {
  return `'${value.replace(/'/g, "'\\''")}'`;
}
function getEffectiveShellEnvValue(env, key) {
  return env[key] ?? process.env[key];
}
var SHELL_ENV_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
var CURSOR_SANDBOX_ENV_NAME_PATTERN2 = /CURSOR_SANDBOX/i;
function isRequestScopedEnvKey(key) {
  return SHELL_ENV_NAME_PATTERN.test(key) && !CURSOR_SANDBOX_ENV_NAME_PATTERN2.test(key);
}
function appendRequestScopedEnvRestore(env, requestScopedEnv) {
  const scopedKeys = Object.keys(requestScopedEnv).filter((key) => isRequestScopedEnvKey(key) && !REQUEST_SCOPED_SHELL_ENV_KEYS.includes(key));
  const unsetAll = `builtin unset ${[...REQUEST_SCOPED_SHELL_ENV_KEYS, ...scopedKeys].join(" ")} 2>/dev/null || true`;
  const exportParts = [];
  for (const key of REQUEST_SCOPED_SHELL_ENV_KEYS) {
    const value = getEffectiveShellEnvValue(env, key);
    if (value !== void 0) {
      exportParts.push(`builtin export ${key}=${shellSingleQuote(value)}`);
    }
  }
  for (const key of scopedKeys) {
    const value = requestScopedEnv[key];
    if (value !== void 0) {
      exportParts.push(`builtin export ${key}=${shellSingleQuote(value)}`);
    }
  }
  const existingRestore = env.__CURSOR_SANDBOX_ENV_RESTORE?.trim();
  const processRestore = process.env.__CURSOR_SANDBOX_ENV_RESTORE?.trim();
  env.__CURSOR_SANDBOX_ENV_RESTORE = [unsetAll, processRestore, existingRestore, ...exportParts].filter((part) => part !== void 0 && part !== "").join("; ");
}
function appendUnique(paths, pathToAdd) {
  const next = paths === void 0 ? [] : [...paths];
  if (!next.includes(pathToAdd)) {
    next.push(pathToAdd);
  }
  return next;
}
function agentStoreSandboxPolicyFromEnv(policy, env) {
  const filesDir = getEffectiveShellEnvValue(env, "CURSOR_AGENT_STORE_FILES_DIR");
  const sharedPaths = parseAgentStoreSharedPathsEnv(getEffectiveShellEnvValue(env, "CURSOR_AGENT_STORE_SHARED_PATHS"));
  if (filesDir === void 0 && sharedPaths.length === 0) {
    return policy;
  }
  const existingPerUser = policy?.perUser;
  const referencePolicy = policy?.perRepo ?? policy?.perUser ?? policy?.teamAdmin;
  if (referencePolicy?.type !== "workspace_readwrite" && referencePolicy?.type !== "workspace_readonly") {
    return policy;
  }
  const perUser = existingPerUser?.type === referencePolicy.type ? { ...existingPerUser } : { type: referencePolicy.type };
  const addSelfStorePath = (pathToAdd) => {
    if (perUser.type === "workspace_readwrite") {
      perUser.additionalReadwritePaths = appendUnique(perUser.additionalReadwritePaths, pathToAdd);
      return;
    }
    perUser.additionalReadonlyPaths = appendUnique(perUser.additionalReadonlyPaths, pathToAdd);
  };
  if (filesDir !== void 0) {
    addSelfStorePath(filesDir);
  }
  for (const entry of sharedPaths) {
    if (!entry.readOnly && perUser.type === "workspace_readwrite") {
      perUser.additionalReadwritePaths = appendUnique(perUser.additionalReadwritePaths, entry.path);
      continue;
    }
    perUser.additionalReadonlyPaths = appendUnique(perUser.additionalReadonlyPaths, entry.path);
  }
  return { ...policy, perUser };
}
function parseAgentStoreSharedPathsEnv(value) {
  if (value === void 0) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null) {
      return [];
    }
    const out = [];
    for (const entry of Object.values(parsed)) {
      if (typeof entry === "object" && entry !== null && "path" in entry && "readOnly" in entry && typeof entry.path === "string" && typeof entry.readOnly === "boolean") {
        out.push({ path: entry.path, readOnly: entry.readOnly });
      }
    }
    return out;
  } catch {
    return [];
  }
}
var BaseShellCoreExecutor = class {
  constructor(executor, workspacePath, projectDir, shellOutputBackpressureOptions, extraEnvProvider) {
    this.executor = executor;
    this.workspacePath = workspacePath;
    this.projectDir = projectDir;
    this.shellOutputBackpressureOptions = shellOutputBackpressureOptions;
    this.extraEnvProvider = extraEnvProvider;
    this.conversationExecutors = /* @__PURE__ */ new Map();
  }
  executorFor(conversationId) {
    if (!conversationId) {
      return this.executor;
    }
    let executor = this.conversationExecutors.get(conversationId);
    if (executor === void 0) {
      executor = this.executor.clone(this.workspacePath);
      this.conversationExecutors.set(conversationId, executor);
    }
    return executor;
  }
  /**
   * Execute a shell command and yield events for stdout, stderr, trimming, and exit
   */
  async *execute(ctx, args) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource20(env_1, createSpan(ctx.withName("ShellCoreExecutor.execute")), false);
      const startMonotonicMs = performance.now();
      const executor = this.executorFor(args.conversationId);
      const workingDirectory = args.workingDirectory || await executor.getCwd();
      const resolvedWorkingDir = resolvePath(workingDirectory, this.workspacePath);
      let stdoutSize = 0;
      let stderrSize = 0;
      let stdoutTrimmed = false;
      let stderrTrimmed = false;
      let suppressionNoticeSent = false;
      let mergedOutput;
      if (args.fileOutputThresholdBytes && this.projectDir) {
        mergedOutput = {
          buffer: "",
          lineCount: 0,
          size: 0,
          threshold: Number(args.fileOutputThresholdBytes)
        };
      }
      const signal = args.signal;
      const env = {
        CURSOR_AGENT: "1"
      };
      if (args.conversationId) {
        env.CURSOR_CONVERSATION_ID = getSafeConversationId(args.conversationId);
      }
      if (args.requestId) {
        env.CURSOR_REQUEST_ID = args.requestId;
      }
      if (this.projectDir) {
        env.AGENT_TRANSCRIPTS = import_node_path36.default.join(this.projectDir, TRANSCRIPTS_SUBDIR);
      }
      const extraEnv = this.extraEnvProvider?.(ctx, args);
      if (extraEnv !== void 0) {
        Object.assign(env, extraEnv);
      }
      const requestScopedEnv = args.requestScopedEnv ?? {};
      for (const [key, value] of Object.entries(requestScopedEnv)) {
        if (value !== void 0 && isRequestScopedEnvKey(key)) {
          env[key] = value;
        }
      }
      appendRequestScopedEnvRestore(env, requestScopedEnv);
      const sandboxPolicy = agentStoreSandboxPolicyFromEnv(args.sandboxPolicy, env);
      const policyType = getSandboxPolicyType(sandboxPolicy ?? INSECURE_NONE_SANDBOX_POLICY);
      if (sandboxPolicy) {
        yield {
          type: "start",
          sandboxed: policyType === "workspace_readonly" || policyType === "workspace_readwrite"
        };
      }
      if (args.askpassConfig && !isWindows3) {
        env.SUDO_ASKPASS = args.askpassConfig.helperPath;
        env.CURSOR_ASKPASS_SOCKET = args.askpassConfig.socketPath;
        env.CURSOR_ASKPASS_SECRET = args.askpassConfig.secret;
      }
      let dataSize = 0;
      let outputData = "";
      for await (const event of executor.execute(ctx, args.command, {
        signal,
        workingDirectory: resolvedWorkingDir,
        env,
        sandboxPolicy,
        sandboxWorkspaceRoot: this.workspacePath,
        pipeStdin: args.pipeStdin ?? false,
        bufferOutputEvents: this.shellOutputBackpressureOptions?.bufferOutputEvents,
        outputLimiterOptions: this.shellOutputBackpressureOptions?.outputLimiterOptions
      })) {
        dataSize = 0;
        outputData = "";
        if (event.type === "stdout" || event.type === "stderr") {
          outputData = event.data.toString();
          dataSize = event.data.length;
          if (mergedOutput) {
            mergedOutput.size += dataSize;
            mergedOutput.lineCount += outputData.split("\n").length - 1;
            if (mergedOutput.size > MAX_OUTPUT_FILE_SIZE) {
            } else if (mergedOutput.file) {
              mergedOutput.file.write(outputData);
            } else {
              mergedOutput.buffer += outputData;
              if (mergedOutput.size > mergedOutput.threshold) {
                const agentToolsDir = import_node_path36.default.join(this.projectDir, AGENT_TOOLS_DIR);
                mergedOutput.path = import_node_path36.default.join(agentToolsDir, `${(0, import_node_crypto13.randomUUID)()}.txt`);
                await (0, import_promises23.mkdir)(import_node_path36.default.dirname(mergedOutput.path), { recursive: true });
                mergedOutput.file = (0, import_node_fs17.createWriteStream)(mergedOutput.path);
                mergedOutput.file.write(mergedOutput.buffer);
                mergedOutput.buffer = "";
              }
            }
          }
        }
        switch (event.type) {
          case "stdout": {
            if (!stdoutTrimmed) {
              if (stdoutSize + dataSize > MAX_BUFFER_SIZE) {
                stdoutTrimmed = true;
                yield { type: "stdout_trimmed" };
              } else {
                stdoutSize += dataSize;
                yield { type: "stdout", data: outputData };
              }
            }
            break;
          }
          case "suppressed_output": {
            if (!suppressionNoticeSent) {
              suppressionNoticeSent = true;
              yield {
                type: "stdout",
                data: SHELL_OUTPUT_SUPPRESSED_NOTICE
              };
            }
            break;
          }
          case "stderr": {
            if (!stderrTrimmed) {
              if (stderrSize + dataSize > MAX_BUFFER_SIZE) {
                stderrTrimmed = true;
                yield { type: "stderr_trimmed" };
              } else {
                stderrSize += dataSize;
                yield { type: "stderr", data: outputData };
              }
            }
            break;
          }
          case "exit": {
            const localExecutionTimeMs = Math.max(0, Math.round(performance.now() - startMonotonicMs));
            let outputLocation;
            if (mergedOutput?.file) {
              await new Promise((resolve14) => mergedOutput.file.end(resolve14));
              outputLocation = new OutputLocation({
                filePath: mergedOutput.path,
                sizeBytes: BigInt(mergedOutput.size),
                lineCount: BigInt(mergedOutput.lineCount)
              });
            }
            yield {
              type: "exit",
              code: event.code,
              aborted: event.aborted,
              outputLocation,
              localExecutionTimeMs
            };
            break;
          }
          case "stdin_ready": {
            yield { type: "stdin_ready", stdin: event.stdin, pid: event.pid };
            break;
          }
          case "sandbox_denies": {
            yield { type: "sandbox_denies", events: event.events };
            break;
          }
        }
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources20(env_1);
    }
  }
  /**
   * Get the current working directory from the underlying executor
   */
  async getCwd(conversationId) {
    return this.executorFor(conversationId).getCwd();
  }
  /**
   * Get the workspace root path
   */
  getWorkspacePath() {
    if (!this.workspacePath) {
      throw new Error("Workspace path is not configured");
    }
    return this.workspacePath;
  }
};
