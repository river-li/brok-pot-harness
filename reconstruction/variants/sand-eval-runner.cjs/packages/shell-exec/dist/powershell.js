/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/powershell.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function getPowerShellExecutable() {
  if (process.platform !== "win32") {
    const shell = process.env.SHELL;
    if (shell?.includes("pwsh") || shell?.includes("powershell")) {
      return shell;
    }
  }
  let pwsh = findActualExecutable("pwsh", []).cmd;
  if (pwsh !== "pwsh") {
    return pwsh;
  }
  pwsh = findActualExecutable("powershell", []).cmd;
  if (pwsh !== "powershell") {
    return pwsh;
  }
  if (process.platform === "win32") {
    pwsh = path6.join(process.env.SYSTEMROOT, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
    if ((0, import_node_fs6.existsSync)(pwsh)) {
      return pwsh;
    }
  }
  throw new Error("Neither 'pwsh' (PowerShell Core) nor 'powershell' (Windows PowerShell) found in PATH");
}
async function writeFileWithBom(filePath, content) {
  await fs4.writeFile(filePath, UTF8_BOM + content, { encoding: "utf8" });
}
async function initPowerShellState() {
  return new PowerShellState(process.cwd(), "");
}
var import_node_crypto3, import_node_fs6, fs4, import_promises6, os5, path6, __addDisposableResource4, __disposeResources4, PowerShellState, UTF8_BOM;
var init_powershell = __esm({
  "../packages/shell-exec/dist/powershell.js"() {
    "use strict";
    import_node_crypto3 = require("node:crypto");
    import_node_fs6 = require("node:fs");
    fs4 = __toESM(require("node:fs/promises"), 1);
    import_promises6 = require("node:fs/promises");
    os5 = __toESM(require("node:os"), 1);
    path6 = __toESM(require("node:path"), 1);
    init_dist();
    init_dist3();
    init_core2();
    init_dump_powershell_state();
    init_output_limiter();
    init_policy_merge();
    init_sudo();
    init_types4();
    __addDisposableResource4 = function(env, value, async) {
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
    __disposeResources4 = /* @__PURE__ */ (function(SuppressedError2) {
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
    PowerShellState = class _PowerShellState {
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
        return new _PowerShellState(workingDirectory ?? this.cwd, this.state);
      }
      async *execute(ctx, command, options2) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
          const span = __addDisposableResource4(env_1, createSpan(ctx.withName("PowerShellState.execute")), false);
          const pipeStdin = options2?.pipeStdin ?? false;
          const cwd = options2?.workingDirectory ?? this.cwd;
          const iterable = createWritableIterable();
          const env = {
            ...process.env,
            ...SHELL_ENV_OVERRIDES,
            ...options2?.env
          };
          const transformedCommand = shouldEnableSudoAskpass(env) ? transformSudoCommand(command) : command;
          const tempDir = os5.tmpdir();
          const stateOutFile = path6.join(tempDir, `ps-state-out-${(0, import_node_crypto3.randomUUID)()}.txt`);
          const commandScript = dump_powershell_state_default(this.state, cwd, transformedCommand, stateOutFile);
          const scriptFile = path6.join(tempDir, `ps-script-${(0, import_node_crypto3.randomUUID)()}.ps1`);
          await writeFileWithBom(scriptFile, commandScript);
          const args = ["-ExecutionPolicy", "Bypass"];
          if (!pipeStdin) {
            args.push("-NonInteractive");
          }
          args.push("-File", scriptFile);
          const pwsh = getPowerShellExecutable();
          const isWindows4 = process.platform === "win32";
          const sandboxWorkspaceRoot = options2?.sandboxWorkspaceRoot ?? cwd;
          const resolvedPolicy = (await resolveSandboxPolicyForWorkspace(sandboxWorkspaceRoot, options2?.sandboxPolicy)).policy;
          const sandboxPolicy = resolvedPolicy.type !== "insecure_none" ? { ...resolvedPolicy, sandboxWorkspaceRoot } : resolvedPolicy;
          const child = spawnWithSignal(pwsh, args, {
            env,
            // Use 'ignore' for stdin (unless interactive) to prevent background processes
            // from inheriting an open stdin pipe, which would prevent the 'close' event from firing
            stdio: [pipeStdin ? "pipe" : "ignore", "pipe", "pipe"],
            cwd,
            // Use detached to create a new process group. This allows killing all
            // child processes (e.g., python servers) when aborting, not just the shell.
            // On Windows, avoid detached as it creates a new console and breaks stdio;
            // spawnWithSignal walks the tree with taskkill there instead.
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
          const cleanup = async () => {
            try {
              const newState = await fs4.readFile(stateOutFile, "utf8");
              const { cwd: newCwd, rest } = splitPwdAndState(newState);
              this.state = rest;
              this.cwd = newCwd.trim();
              await (0, import_promises6.rm)(stateOutFile).catch(() => {
              });
            } catch (_error) {
            }
            await (0, import_promises6.rm)(scriptFile).catch(() => {
            });
          };
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
                await cleanup();
                iterable.throw(error3 instanceof Error ? error3 : new Error(String(error3)));
                return;
              }
            }
            await outputPump.flush();
            try {
              await iterable.write({
                type: "exit",
                code: exitCode,
                data: "",
                aborted: options2?.signal?.aborted ?? false
              });
              await cleanup();
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
                console.warn(`[shell-exec] Close event did not fire within ${timeout2}ms after exit. This may indicate a background process is holding file descriptors open. Proceeding anyway to prevent hang.`);
                emitExitAndClose(false);
              }, timeout2);
            }
          });
          child.on("close", async () => {
            await emitExitAndClose(true);
          });
          child.on("error", (error3) => {
            cleanup().catch(() => {
            });
            iterable.throw(error3);
          });
          yield* iterable;
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          __disposeResources4(env_1);
        }
      }
    };
    UTF8_BOM = "\uFEFF";
  }
});

