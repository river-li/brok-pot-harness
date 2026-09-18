function getZshPath() {
  const shell = process.env.SHELL;
  if (shell?.includes("zsh")) {
    return shell;
  }
  return findActualExecutable("zsh", []).cmd;
}
async function initZshState(options2) {
  const env = {
    ...process.env,
    ...SHELL_ENV_OVERRIDES,
    ...options2?.env
  };
  const STATE_MARKER = "__CURSOR_STATE_MARKER__";
  const args = [
    "-o",
    "extendedglob",
    "-ilc",
    `${dump_zsh_state_default} builtin printf '${STATE_MARKER}\\n'; dump_zsh_state`
  ];
  const child = spawnWithSignal(getZshPath(), args, {
    env,
    // Only provide stdio for 0/1/2 to avoid extra FDs being inherited by
    // background processes (e.g., ssh-agent). Write dump to stdout.
    stdio: ["ignore", "pipe", "pipe"],
    detached: true
  }, { type: "insecure_none" }, options2?.signal);
  let fullOutput = "";
  child.stdout?.on("data", (data) => {
    fullOutput += data.toString();
  });
  child.on("error", (error3) => {
    console.warn(`[shell-exec] zsh state init spawn failed; falling back to empty state: ${error3 instanceof Error ? error3.message : String(error3)}`);
  });
  await new Promise((resolve14) => {
    child.on("close", () => {
      resolve14(void 0);
    });
  });
  const snapshot = parseShellStateOutput(fullOutput, STATE_MARKER);
  const startMarkerLine = `${ZSH_STATE_START_MARKER}
`;
  const endMarkerLine = `${ZSH_STATE_END_MARKER}
`;
  let stateWithoutMarkers;
  if (snapshot.startsWith(startMarkerLine) && snapshot.endsWith(endMarkerLine)) {
    stateWithoutMarkers = snapshot.slice(startMarkerLine.length);
    stateWithoutMarkers = stateWithoutMarkers.slice(0, -(ZSH_STATE_END_MARKER.length + 1));
  } else {
    stateWithoutMarkers = `${process.cwd()}
`;
  }
  const { cwd, rest } = splitPwdAndState(stateWithoutMarkers);
  return new ZshState(cwd, rest);
}
var __addDisposableResource6, __disposeResources6, ZshState;
var init_zsh = __esm({
  "../packages/shell-exec/dist/zsh.js"() {
    "use strict";
    init_dist();
    init_dist3();
    init_core2();
    init_dump_zsh_state();
    init_output_limiter();
    init_policy_merge();
    init_sandbox();
    init_sudo();
    init_types4();
    __addDisposableResource6 = function(env, value, async) {
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
    __disposeResources6 = /* @__PURE__ */ (function(SuppressedError2) {
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
    ZshState = class _ZshState {
      cwd;
      state;
      constructor(cwd, state) {
        this.cwd = cwd;
        this.state = state;
      }
      async getCwd() {
        return this.cwd;
      }
      clone(workingDirectory) {
        return new _ZshState(workingDirectory ?? this.cwd, this.state);
      }
      async *execute(ctx, command, options2) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
          const span = __addDisposableResource6(env_1, createSpan(ctx.withName("ZshState.execute")), false);
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
          const c = (
            // Baseline PATH so the snapshot read and its base64/tr restore work even when a non-login .zshenv left PATH empty.
            `builtin export PATH="/usr/bin:/bin:/usr/sbin:/sbin\${PATH:+:$PATH}"; snap=$(command cat <&3); builtin unsetopt aliases 2>/dev/null; builtin unalias -m '*' 2>/dev/null || true; builtin eval "$snap" && { builtin unsetopt nounset 2>/dev/null || true; builtin eval "\${__CURSOR_SANDBOX_ENV_RESTORE:-}" 2>/dev/null; builtin export PWD="$(builtin pwd)"; builtin setopt aliases 2>/dev/null; ${sudoAliasInjection}${core2}; }; COMMAND_EXIT_CODE=$?; dump_zsh_state >&4; builtin exit $COMMAND_EXIT_CODE`
          );
          const args = [
            "-c",
            c,
            "--",
            // This separates options from positional arguments
            command
          ];
          const sandboxWorkspaceRoot = options2?.sandboxWorkspaceRoot ?? cwd;
          const resolvedPolicy = (await resolveSandboxPolicyForWorkspace(sandboxWorkspaceRoot, options2?.sandboxPolicy)).policy;
          const sandboxPolicy = resolvedPolicy.type !== "insecure_none" ? { ...resolvedPolicy, sandboxWorkspaceRoot } : resolvedPolicy;
          const child = spawnWithSignal(getZshPath(), args, {
            env,
            // Use 'ignore' for stdin (unless interactive) to prevent background processes
            // from inheriting an open stdin pipe, which would prevent the 'close' event from firing
            stdio: [pipeStdin ? "pipe" : "ignore", "pipe", "pipe", "pipe", "pipe"],
            cwd,
            // Use detached to create a new process group. This allows killing all
            // child processes (e.g., python servers) when aborting, not just the shell.
            detached: true
          }, sandboxPolicy, options2?.signal);
          let newState = "";
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
          child.on("error", (error3) => {
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
                iterable.throw(error3 instanceof Error ? error3 : new Error(String(error3)));
                return;
              }
            }
            await outputPump.flush();
            if (!options2?.signal?.aborted) {
              const startMarkerLine = `${ZSH_STATE_START_MARKER}
`;
              const endMarkerLine = `${ZSH_STATE_END_MARKER}
`;
              if (newState.startsWith(startMarkerLine) && newState.endsWith(endMarkerLine)) {
                let stateWithoutMarkers = newState.slice(startMarkerLine.length);
                stateWithoutMarkers = stateWithoutMarkers.slice(0, -(ZSH_STATE_END_MARKER.length + 1));
                const { cwd: nextCwd, rest } = splitPwdAndState(stateWithoutMarkers);
                if (nextCwd?.startsWith("/")) {
                  this.state = rest;
                  this.cwd = nextCwd;
                }
              }
            }
            if (sandboxPolicy.captureDenies ?? false) {
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
            } catch (_error) {
              iterable.close();
            }
          };
          child.on("exit", (code, _signal) => {
            exitCode = code;
            const timeout2 = options2?.closeTimeout ?? 5e3;
            if (timeout2 > 0) {
              closeTimeoutId = setTimeout(() => {
                if (hasEmittedExit) {
                  return;
                }
                console.warn(`[shell-exec] Close event did not fire within ${timeout2}ms after exit. This may indicate a background process is holding file descriptors open. Killing detached process group.`);
                killDetachedProcessGroup(child.pid, "SIGKILL");
                emitExitAndClose(false);
              }, timeout2);
            }
          });
          child.on("close", async () => {
            await emitExitAndClose(true);
          });
          const inFd = child.stdio[3];
          const outFd = child.stdio[4];
          writeShellStatePipe(inFd, this.state);
          attachShellStateOutput(outFd, (text2) => {
            newState += text2;
          });
          yield* iterable;
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          __disposeResources6(env_1);
        }
      }
    };
  }
});
