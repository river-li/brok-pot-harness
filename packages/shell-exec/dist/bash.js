function getBashPath(userTerminalHint) {
  if (process.platform === "win32") {
    const pathMustMatch = /git.*bash/i;
    if (userTerminalHint && pathMustMatch.test(userTerminalHint)) {
      return userTerminalHint;
    }
    const gitBashPath = findActualExecutable("bash", [], pathMustMatch).cmd;
    if (pathMustMatch.test(gitBashPath)) {
      return gitBashPath;
    } else {
      return null;
    }
  }
  const shell = process.env.SHELL;
  if (shell?.includes("bash")) {
    return shell;
  }
  const bashPath = findActualExecutable("bash", []).cmd;
  return bashPath;
}
function windowsPathToGitBash(windowsPath) {
  if (process.platform !== "win32") {
    return windowsPath;
  }
  const normalized = import_node_path7.default.normalize(windowsPath);
  const driveLetter = normalized[0]?.toLowerCase();
  if (driveLetter && normalized[1] === ":" && normalized[2] === import_node_path7.default.sep) {
    const unixPath = `/${driveLetter}${normalized.slice(2).replace(/\\/g, "/")}`;
    return unixPath;
  }
  return normalized.replace(/\\/g, "/");
}
async function initBashState(options2) {
  const env = {
    ...process.env,
    ...SHELL_ENV_OVERRIDES,
    ...options2?.env
  };
  const STATE_MARKER = "__CURSOR_STATE_MARKER__";
  const args = [
    "-O",
    "extglob",
    "-ilc",
    dump_bash_state_default + ` builtin printf '${STATE_MARKER}\\n'; dump_bash_state`
  ];
  const bashPath = getBashPath(options2?.userTerminalHint);
  if (!bashPath) {
    throw new Error("Can't find Bash");
  }
  const child = spawnWithSignal(bashPath, args, {
    env,
    detached: true,
    // Use 'ignore' for stdin so it's connected to /dev/null from the start
    // This prevents background processes (like ssh-agent) started during
    // initialization from inheriting an open stdin pipe
    stdio: ["ignore", "pipe", "pipe"]
  }, { type: "insecure_none" }, options2?.signal);
  let fullOutput = "";
  child.stdout?.on("data", (data) => {
    fullOutput += data.toString();
  });
  child.on("error", (error3) => {
    console.warn(`[shell-exec] bash state init spawn failed; falling back to empty state: ${error3 instanceof Error ? error3.message : String(error3)}`);
  });
  await new Promise((resolve14) => {
    child.on("close", () => {
      resolve14(void 0);
    });
  });
  const snapshot = parseShellStateOutput(fullOutput, STATE_MARKER);
  const startMarkerLine = `${BASH_STATE_START_MARKER}
`;
  const endMarkerLine = `${BASH_STATE_END_MARKER}
`;
  let stateWithoutMarkers;
  if (snapshot.startsWith(startMarkerLine) && snapshot.endsWith(endMarkerLine)) {
    stateWithoutMarkers = snapshot.slice(startMarkerLine.length);
    stateWithoutMarkers = stateWithoutMarkers.slice(0, -(BASH_STATE_END_MARKER.length + 1));
  } else {
    stateWithoutMarkers = `${process.cwd()}
`;
  }
  const { cwd, rest } = splitPwdAndState(stateWithoutMarkers);
  const useFileStateTransport = process.platform === "win32";
  const initialCwd = process.platform === "win32" ? process.cwd() : cwd;
  return new BashState(initialCwd, rest, options2?.userTerminalHint, useFileStateTransport);
}
var import_promises5, import_node_os4, import_node_path7, __addDisposableResource2, __disposeResources2, BashState;
var init_bash = __esm({
  "../packages/shell-exec/dist/bash.js"() {
    "use strict";
    import_promises5 = require("node:fs/promises");
    import_node_os4 = __toESM(require("node:os"), 1);
    import_node_path7 = __toESM(require("node:path"), 1);
    init_dist();
    init_dist3();
    init_core2();
    init_dump_bash_state();
    init_output_limiter();
    init_policy_merge();
    init_sandbox();
    init_sudo();
    init_types4();
    __addDisposableResource2 = function(env, value, async) {
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
    __disposeResources2 = /* @__PURE__ */ (function(SuppressedError2) {
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
    BashState = class _BashState {
      cwd;
      state;
      userTerminalHint;
      useFileStateTransport;
      constructor(cwd, state, userTerminalHint, useFileStateTransport = false) {
        this.cwd = cwd;
        this.state = state;
        this.userTerminalHint = userTerminalHint;
        this.useFileStateTransport = useFileStateTransport;
      }
      async getCwd() {
        return this.cwd;
      }
      clone(workingDirectory) {
        return new _BashState(workingDirectory ?? this.cwd, this.state, this.userTerminalHint, this.useFileStateTransport);
      }
      async *execute(ctx, command, options2) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
          const span = __addDisposableResource2(env_1, createSpan(ctx.withName("BashState.execute")), false);
          const pipeStdin = options2?.pipeStdin ?? false;
          const iterable = createWritableIterable();
          const cwd = options2?.workingDirectory ?? this.cwd;
          const env = {
            ...process.env,
            ...SHELL_ENV_OVERRIDES,
            ...options2?.env
          };
          let core2 = `builtin eval "$1"`;
          if (!pipeStdin) {
            core2 += " < /dev/null";
          }
          const sudoAliasInjection = getSudoAliasInjection(env);
          const useFileTransport = this.useFileStateTransport;
          let tempDir;
          let stateInputPath;
          let stateOutputPath;
          if (useFileTransport) {
            tempDir = await (0, import_promises5.mkdtemp)(import_node_path7.default.join(import_node_os4.default.tmpdir(), "cursor-bash-state-"));
            const dirname16 = import_node_path7.default.basename(tempDir);
            stateInputPath = import_node_path7.default.join(tempDir, "state-in");
            stateOutputPath = import_node_path7.default.join(tempDir, "state-out");
            await (0, import_promises5.writeFile)(stateInputPath, this.state, "utf8");
            await (0, import_promises5.writeFile)(stateOutputPath, "", "utf8").catch(() => {
            });
            const gitBashInputPath = windowsPathToGitBash(stateInputPath);
            const gitBashOutputPath = windowsPathToGitBash(stateOutputPath);
            env.CURSOR_STATE_INPUT_FILE = gitBashInputPath;
            env.CURSOR_STATE_OUTPUT_FILE = gitBashOutputPath;
          }
          const stateLoader = useFileTransport ? 'snap=$(command cat "$CURSOR_STATE_INPUT_FILE")' : "snap=$(command cat <&3)";
          const stateWriter = useFileTransport ? 'mkdir -p "$(dirname "$CURSOR_STATE_OUTPUT_FILE")" 2>/dev/null; dump_bash_state > "$CURSOR_STATE_OUTPUT_FILE"' : "dump_bash_state >&4";
          const c = `${stateLoader} && builtin shopt -s extglob && builtin eval -- "$snap" && { builtin set +u 2>/dev/null || true; builtin eval "\${__CURSOR_SANDBOX_ENV_RESTORE:-}" 2>/dev/null; builtin export PWD="$(builtin pwd)"; builtin shopt -s expand_aliases 2>/dev/null; ${sudoAliasInjection}${core2}; }; COMMAND_EXIT_CODE=$?; ${stateWriter}; builtin exit $COMMAND_EXIT_CODE`;
          const args = [
            "-O",
            "extglob",
            "-c",
            c,
            "--",
            // This separates options from positional arguments
            command
          ];
          const bashPath = getBashPath(this.userTerminalHint);
          if (!bashPath) {
            throw new Error("Can't find Bash");
          }
          const sandboxWorkspaceRoot = options2?.sandboxWorkspaceRoot ?? cwd;
          const resolvedPolicy = (await resolveSandboxPolicyForWorkspace(sandboxWorkspaceRoot, options2?.sandboxPolicy)).policy;
          const sandboxPolicy = resolvedPolicy.type !== "insecure_none" ? { ...resolvedPolicy, sandboxWorkspaceRoot } : resolvedPolicy;
          let newState = "";
          const readStateFromTransport = async () => {
            if (useFileTransport) {
              if (!stateOutputPath) {
                newState = this.state;
                return;
              }
              try {
                newState = await (0, import_promises5.readFile)(stateOutputPath, "utf8");
              } catch (error3) {
                console.warn("[shell-exec] Failed to read bash state file", error3);
                newState = this.state;
              }
            }
          };
          const cleanupStateFiles = async () => {
            if (tempDir) {
              try {
                await (0, import_promises5.rm)(tempDir, { recursive: true, force: true });
              } catch {
              }
            }
          };
          let child;
          try {
            child = spawnWithSignal(bashPath, args, {
              env,
              // Use 'ignore' for stdin (unless interactive) to prevent background processes
              // from inheriting an open stdin pipe, which would prevent the 'close' event from firing
              stdio: [pipeStdin ? "pipe" : "ignore", "pipe", "pipe", "pipe", "pipe"],
              cwd,
              // Use detached to create a new process group. This allows killing all
              // child processes (e.g., python servers) when aborting, not just the shell.
              detached: true
            }, sandboxPolicy, options2?.signal);
          } catch (error3) {
            await cleanupStateFiles();
            throw error3;
          }
          child.on("spawn", async () => {
            try {
              await iterable.write({
                type: "stdin_ready",
                stdin: child.stdin ?? void 0,
                pid: child.pid
              });
            } catch (_error) {
            }
          });
          const outputPump = attachShellOutputStreams({
            stdout: child.stdout,
            stderr: child.stderr,
            writable: iterable,
            bufferOutputEvents: options2?.bufferOutputEvents,
            outputLimiterOptions: options2?.outputLimiterOptions
          });
          child.on("error", async (error3) => {
            await cleanupStateFiles();
            iterable.throw(error3);
          });
          let exitCode = null;
          let closeTimeoutId = null;
          let hasEmittedExit = false;
          const emitExitAndClose = async (waitForOutputPumps) => {
            if (hasEmittedExit)
              return;
            hasEmittedExit = true;
            if (closeTimeoutId) {
              clearTimeout(closeTimeoutId);
              closeTimeoutId = null;
            }
            reportEvent(span.ctx, "exit");
            if (waitForOutputPumps) {
              try {
                await outputPump.waitForOutput();
              } catch (error3) {
                await cleanupStateFiles();
                iterable.throw(error3 instanceof Error ? error3 : new Error(String(error3)));
                return;
              }
            }
            await outputPump.flush();
            if (!options2?.signal?.aborted) {
              await readStateFromTransport();
              const startMarkerLine = `${BASH_STATE_START_MARKER}
`;
              const endMarkerLine = `${BASH_STATE_END_MARKER}
`;
              if (newState.startsWith(startMarkerLine) && newState.endsWith(endMarkerLine)) {
                let stateWithoutMarkers = newState.slice(startMarkerLine.length);
                stateWithoutMarkers = stateWithoutMarkers.slice(0, -(BASH_STATE_END_MARKER.length + 1));
                const { cwd: nextCwd, rest } = splitPwdAndState(stateWithoutMarkers);
                this.state = rest;
                if (process.platform !== "win32" && nextCwd?.startsWith("/")) {
                  this.cwd = nextCwd;
                }
              }
            }
            if (sandboxPolicy.captureDenies) {
              try {
                const denyEvents = await captureSandboxDenies2(child);
                if (denyEvents && denyEvents.length > 0) {
                  await iterable.write({
                    type: "sandbox_denies",
                    events: denyEvents
                  });
                }
              } catch {
              }
            }
            try {
              await iterable.write({
                type: "exit",
                code: exitCode,
                data: "",
                aborted: options2?.signal?.aborted ?? false
              });
              iterable.close();
            } catch {
              iterable.close();
            }
            await cleanupStateFiles();
          };
          child.on("exit", (code, _signal) => {
            exitCode = code;
            const timeout2 = options2?.closeTimeout ?? 5e3;
            if (timeout2 > 0) {
              closeTimeoutId = setTimeout(() => {
                console.warn(`[shell-exec] Close event did not fire within ${timeout2}ms after exit. This may indicate a background process is holding file descriptors open. Proceeding anyway to prevent hang.`);
                emitExitAndClose(false);
              }, timeout2);
            }
          });
          child.on("close", async () => {
            await emitExitAndClose(true);
          });
          const inFd = child.stdio[3];
          const outFd = child.stdio[4];
          if (!useFileTransport) {
            writeShellStatePipe(inFd, this.state);
            attachShellStateOutput(outFd, (text2) => {
              newState += text2;
            });
          }
          yield* iterable;
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          __disposeResources2(env_1);
        }
      }
    };
  }
});
