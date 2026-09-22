var __addDisposableResource11 = function(env, value, async) {
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
var __disposeResources11 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error42, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error42, e.suppressed = suppressed, e;
});
var DEFAULT_MAX_RIPWALK_THREADS = 2;
var RIPWALK_THREADS_ENV_VAR = "CURSOR_RIPWALK_THREADS";
function getRipwalkThreadCount(env = process.env) {
  const raw = env[RIPWALK_THREADS_ENV_VAR]?.trim();
  if (raw !== void 0 && raw !== "") {
    const override = Number(raw);
    if (Number.isInteger(override) && override >= 0) {
      return override === 0 ? void 0 : override;
    }
  }
  return Math.min(DEFAULT_MAX_RIPWALK_THREADS, (0, import_node_os10.availableParallelism)());
}
function spawnRipgrep(ctx, args, cwd, sandboxPolicy) {
  const proc = spawnInSandbox(getRipgrepBinaryPath(), args, { cwd }, sandboxPolicy);
  const stderrChunks = [];
  proc.stderr?.on("data", (chunk) => {
    stderrChunks.push(chunk);
  });
  const processExit = new Promise((resolve29, reject2) => {
    proc.on("error", reject2);
    proc.on("close", (code) => resolve29(code ?? 0));
  });
  if (!proc.stdout) {
    throw new Error("No stdout from ripgrep process");
  }
  const aborted2 = new Promise((resolve29) => {
    if (ctx.signal.aborted) {
      resolve29("aborted");
      return;
    }
    ctx.signal.addEventListener("abort", () => resolve29("aborted"), {
      once: true
    });
  });
  return {
    stdout: proc.stdout,
    processExit,
    stderr: () => Buffer.concat(stderrChunks).toString(),
    aborted: aborted2,
    [Symbol.dispose]() {
      proc.kill();
    }
  };
}
function ripwalk(ctx, { root, searchPaths = [], includeGlobs = [], excludeGlobs = [], caseSensitive = false, cursorIgnoreFiles = [], sandboxPolicy = { type: "insecure_none" }, noIgnoreVcs = false, followSymlinks = false, source = "ripwalk" }) {
  const args = [
    "--files",
    "--hidden",
    "--no-require-git",
    "--no-config",
    "--color=never"
  ];
  const threads = getRipwalkThreadCount();
  if (threads !== void 0) {
    args.push("--threads", String(threads));
  }
  if (followSymlinks) {
    args.push("--follow");
  }
  if (noIgnoreVcs) {
    args.push("--no-ignore-vcs");
  }
  if (caseSensitive) {
    args.push("--case-sensitive");
  }
  for (const ignoreFile of cursorIgnoreFiles) {
    args.push("--cursor-ignore", ignoreFile);
  }
  for (const glob of includeGlobs) {
    args.push("--iglob", glob);
  }
  for (const glob of excludeGlobs) {
    args.push("--iglob", `!${glob}`);
  }
  if (searchPaths.length > 0) {
    args.push("--", ...searchPaths);
  }
  let abortResolved = false;
  let resolveDidTimeout;
  const didTimeout = new Promise((resolve29) => {
    resolveDidTimeout = resolve29;
  });
  async function* streamLines() {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const ripgrep = __addDisposableResource11(env_1, spawnRipgrep(ctx, args, root, sandboxPolicy), false);
      if (isRipgrepInvocationRecordingEnabled()) {
        recordRipgrepInvocation({
          timestamp: Date.now(),
          source,
          mode: "files",
          patternLength: 0,
          hasPath: true,
          includeGlobCount: includeGlobs.length,
          excludeGlobCount: excludeGlobs.length,
          sandboxPolicyType: sandboxPolicy.type
        });
      }
      let filesYielded = 0;
      const fileIterator = lines(ripgrep.stdout)[Symbol.asyncIterator]();
      while (true) {
        const result = await Promise.race([fileIterator.next(), ripgrep.aborted]);
        if (result === "aborted") {
          abortResolved = true;
          resolveDidTimeout(true);
          break;
        }
        if (result.done)
          break;
        filesYielded++;
        yield result.value;
      }
      if (filesYielded > 0) {
      } else if (!abortResolved) {
        const exitCode = await ripgrep.processExit;
        if (exitCode !== 0 && exitCode !== 1) {
          const stderr = ripgrep.stderr();
          throw new Error(`Ripgrep failed (exit ${exitCode}) with no results${stderr ? `: ${stderr}` : ""}`);
        }
      }
      if (!abortResolved) {
        resolveDidTimeout(false);
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources11(env_1);
    }
  }
  return {
    lines: streamLines(),
    didTimeout
  };
}
async function* lines(stream3) {
  let buffer = "";
  for await (const chunk of stream3) {
    buffer += chunk.toString();
    const parts = buffer.split("\n");
    buffer = parts.pop() ?? "";
    yield* parts;
  }
  if (buffer)
    yield buffer;
}
