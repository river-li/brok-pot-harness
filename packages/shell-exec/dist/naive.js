function createNaiveTerminalExecutor(options2) {
  const isWindows4 = process.platform === "win32";
  const shell = options2?.shell ?? (isWindows4 ? getPowerShellExecutable() : void 0);
  const cwd = process.cwd();
  return new NaiveTerminalExecutor(cwd, { ...options2, shell });
}
var __addDisposableResource5, __disposeResources5, NaiveTerminalExecutor;
var init_naive = __esm({
  "../packages/shell-exec/dist/naive.js"() {
    "use strict";
    init_dist();
    init_dist3();
    init_core2();
    init_output_limiter();
    init_powershell();
    init_policy_merge();
    init_sandbox();
    init_sudo();
    init_types4();
    __addDisposableResource5 = function(env, value, async) {
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
    __disposeResources5 = /* @__PURE__ */ (function(SuppressedError2) {
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
    NaiveTerminalExecutor = class _NaiveTerminalExecutor {
      cwd;
      options;
      constructor(cwd, options2) {
        this.cwd = cwd;
        this.options = options2;
      }
      async getCwd() {
        return this.cwd;
      }
      clone(workingDirectory) {
        return new _NaiveTerminalExecutor(workingDirectory ?? this.cwd, this.options);
      }
      async *execute(ctx, command, options2) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
          const span = __addDisposableResource5(env_1, createSpan(ctx.withName("NaiveTerminalExecutor.execute")), false);
          const iterable = createWritableIterable();
          const pipeStdin = options2?.pipeStdin ?? false;
          const env = {
            ...process.env,
            ...SHELL_ENV_OVERRIDES,
            ...options2?.env
          };
          const transformedCommand = shouldEnableSudoAskpass(env) ? transformSudoCommand(command) : command;
          const cwd = options2?.workingDirectory ?? this.cwd;
          const sandboxWorkspaceRoot = options2?.sandboxWorkspaceRoot ?? cwd;
          const resolvedPolicy = (await resolveSandboxPolicyForWorkspace(sandboxWorkspaceRoot, options2?.sandboxPolicy)).policy;
          const sandboxPolicy = resolvedPolicy.type !== "insecure_none" ? { ...resolvedPolicy, sandboxWorkspaceRoot } : resolvedPolicy;
          const isWindows4 = process.platform === "win32";
          const child = spawnWithSignal(this.options?.shell || process.env.SHELL || "/bin/sh", [...this.options?.shellArgs ?? [], "-c", transformedCommand], {
            env,
            cwd,
            // Use 'ignore' for stdin unless interactive, to prevent background
            // processes from inheriting an open stdin pipe
            stdio: [pipeStdin ? "pipe" : "ignore", "pipe", "pipe"],
            detached: !isWindows4
          }, sandboxPolicy, options2?.signal);
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
          child.on("exit", async (code) => {
            reportEvent(span.ctx, "exit");
            await outputPump.flush();
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
                code,
                data: "",
                aborted: options2?.signal?.aborted ?? false
              });
              iterable.close();
            } catch (_error) {
              iterable.close();
            }
          });
          yield* iterable;
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          __disposeResources5(env_1);
        }
      }
    };
  }
});
