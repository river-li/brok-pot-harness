function spawn(exe, params, opts) {
  var _a20;
  opts = opts !== null && opts !== void 0 ? opts : {};
  const spawnObs = new import_rxjs2.Observable((subj) => {
    var _a21, _b2;
    const { encoding, timeout: timeout2 } = opts, spawnOpts = __rest2(opts, ["encoding", "timeout"]);
    const { cmd, args } = findActualExecutable(exe, params);
    const stdinObs = spawnOpts.stdin;
    if (stdinObs) {
      delete spawnOpts.stdin;
      (_a21 = spawnOpts.stdio) !== null && _a21 !== void 0 ? _a21 : spawnOpts.stdio = ["pipe", "pipe", "pipe"];
    }
    (_b2 = spawnOpts.stdio) !== null && _b2 !== void 0 ? _b2 : spawnOpts.stdio = ["ignore", "pipe", "pipe"];
    const proc = (0, import_node_child_process.spawn)(cmd, args, spawnOpts);
    if (opts.processInfo && proc.pid !== void 0) {
      opts.processInfo.pid = proc.pid;
    }
    let timeoutHandle = null;
    if (timeout2 && timeout2 > 0) {
      timeoutHandle = setTimeout(() => {
        if (!proc.killed) {
          proc.kill();
        }
        const error3 = new SpawnError(`Process timed out after ${timeout2}ms`, -1, cmd, args);
        subj.error(error3);
      }, timeout2);
    }
    const bufHandler = (source) => (b2) => {
      if (b2.length < 1) {
        return;
      }
      if (opts.echoOutput) {
        (source === "stdout" ? process.stdout : process.stderr).write(b2);
      }
      let chunk = "<< String sent back was too long >>";
      try {
        if (typeof b2 === "string") {
          chunk = b2.toString();
        } else {
          chunk = b2.toString(encoding || "utf8");
        }
      } catch (_a23) {
        chunk = `<< Lost chunk of process output for ${exe} - length was ${b2.length}>>`;
      }
      subj.next({ source, text: chunk });
    };
    const ret = new import_rxjs2.Subscription();
    if (stdinObs) {
      if (proc.stdin) {
        const stdin = proc.stdin;
        ret.add(stdinObs.subscribe({
          next: (x) => stdin.write(x),
          error: subj.error.bind(subj),
          complete: () => stdin.end()
        }));
      } else {
        subj.error(new Error(`opts.stdio conflicts with provided spawn opts.stdin observable, 'pipe' is required`));
      }
    }
    let stderrCompleted = null;
    let stdoutCompleted = null;
    let noClose = false;
    if (proc.stdout) {
      stdoutCompleted = new import_rxjs2.AsyncSubject();
      proc.stdout.on("data", bufHandler("stdout"));
      proc.stdout.on("close", () => {
        stdoutCompleted.next(true);
        stdoutCompleted.complete();
      });
    } else {
      stdoutCompleted = (0, import_rxjs2.of)(true);
    }
    if (proc.stderr) {
      stderrCompleted = new import_rxjs2.AsyncSubject();
      proc.stderr.on("data", bufHandler("stderr"));
      proc.stderr.on("close", () => {
        stderrCompleted.next(true);
        stderrCompleted.complete();
      });
    } else {
      stderrCompleted = (0, import_rxjs2.of)(true);
    }
    proc.on("error", (e) => {
      noClose = true;
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      subj.error(e);
    });
    proc.on("close", (code) => {
      noClose = true;
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      const pipesClosed = (0, import_rxjs2.merge)(stdoutCompleted, stderrCompleted).pipe((0, import_operators.reduce)((_acc) => true, true));
      if (code === 0) {
        pipesClosed.subscribe(() => subj.complete());
      } else {
        pipesClosed.subscribe(() => {
          const error3 = new SpawnError(`Process failed with exit code: ${code}`, code, cmd, args);
          subj.error(error3);
        });
      }
    });
    ret.add(new import_rxjs2.Subscription(() => {
      if (noClose) {
        return;
      }
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      proc.kill();
    }));
    return ret;
  });
  let resultObs = spawnObs;
  if (opts.retries && opts.retries > 0) {
    const retryCount = opts.retries;
    const delay3 = (_a20 = opts.retryDelay) !== null && _a20 !== void 0 ? _a20 : 1e3;
    resultObs = resultObs.pipe((0, import_operators.retry)({
      count: retryCount,
      delay: (error3, _retryIndex) => {
        if (error3 instanceof SpawnError && error3.exitCode !== 0) {
          return (0, import_rxjs2.timer)(delay3);
        }
        throw error3;
      }
    }));
  }
  return opts.split ? resultObs : resultObs.pipe((0, import_operators.map)((x) => x === null || x === void 0 ? void 0 : x.text));
}
function wrapObservableInPromise(obs) {
  return new Promise((res, rej) => {
    let out = "";
    obs.subscribe({
      next: (x) => {
        out += x;
      },
      error: (e) => {
        if (e instanceof SpawnError) {
          const err = new SpawnError(`${out}
${e.message}`, e.exitCode, e.command, e.args, out, e.stderr);
          rej(err);
        } else {
          const err = new Error(`${out}
${e instanceof Error ? e.message : String(e)}`);
          rej(err);
        }
      },
      complete: () => res(out)
    });
  });
}
function wrapObservableInSplitPromise(obs) {
  return new Promise((res, rej) => {
    let out = "";
    let err = "";
    obs.subscribe({
      next: (x) => {
        if (x.source === "stdout") {
          out += x.text;
        } else {
          err += x.text;
        }
      },
      error: (e) => {
        if (e instanceof SpawnError) {
          const error3 = new SpawnError(`${out}
${e.message}`, e.exitCode, e.command, e.args, out, err);
          rej(error3);
        } else {
          const error3 = new Error(`${out}
${e instanceof Error ? e.message : String(e)}`);
          rej(error3);
        }
      },
      complete: () => res([out, err])
    });
  });
}
function spawnPromise(exe, params, opts) {
  if (opts === null || opts === void 0 ? void 0 : opts.split) {
    return wrapObservableInSplitPromise(spawn(exe, params, Object.assign(Object.assign({}, opts !== null && opts !== void 0 ? opts : {}), { split: true })));
  }
  return wrapObservableInPromise(spawn(exe, params, Object.assign(Object.assign({}, opts !== null && opts !== void 0 ? opts : {}), { split: false })));
}
var import_node_child_process, import_rxjs2, import_operators, __rest2, SpawnError;
var init_spawn_promise = __esm({
  "../packages/utils/dist/spawn-promise.js"() {
    "use strict";
    import_node_child_process = require("node:child_process");
    import_rxjs2 = __toESM(require_cjs(), 1);
    import_operators = __toESM(require_operators(), 1);
    init_find_executable();
    __rest2 = function(s3, e) {
      var t = {};
      for (var p2 in s3) if (Object.prototype.hasOwnProperty.call(s3, p2) && e.indexOf(p2) < 0)
        t[p2] = s3[p2];
      if (s3 != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p2 = Object.getOwnPropertySymbols(s3); i < p2.length; i++) {
          if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s3, p2[i]))
            t[p2[i]] = s3[p2[i]];
        }
      return t;
    };
    SpawnError = class _SpawnError extends Error {
      constructor(message, exitCode, command, args, stdout, stderr) {
        super(message);
        this.name = "SpawnError";
        this.exitCode = exitCode;
        this.code = exitCode;
        this.stdout = stdout;
        this.stderr = stderr;
        this.command = command;
        this.args = args;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, _SpawnError);
        }
      }
    };
  }
});
