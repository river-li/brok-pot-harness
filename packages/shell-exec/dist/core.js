function resolveProcessTreeKillMode(options2) {
  if (options2.platform === "win32") {
    return "windows_tree";
  }
  return options2.detached ? "process_group" : "single_process";
}
function killProcessTree(child, mode, signal) {
  const pid = child.pid;
  if (pid === void 0) {
    return;
  }
  const killChildOnly = () => {
    try {
      child.kill(signal);
    } catch {
    }
  };
  switch (mode) {
    case "process_group":
      try {
        process.kill(-pid, signal);
      } catch {
        killChildOnly();
      }
      return;
    case "windows_tree":
      try {
        (0, import_node_child_process5.spawn)("taskkill", ["/pid", String(pid), "/t", "/f"], {
          stdio: "ignore",
          windowsHide: true
        }).on("error", killChildOnly);
      } catch {
        killChildOnly();
      }
      return;
    case "single_process":
      killChildOnly();
      return;
    default: {
      const _exhaustive = mode;
      throw new Error(`Unknown process tree kill mode: ${String(mode)}`);
    }
  }
}
function spawnWithSignal(command, args = [], options2 = {}, sandboxPolicy, signal) {
  const child = spawnInSandbox(command, args, {
    ...options2,
    env: withConfiguredRipgrepEnv(options2.env ?? process.env)
  }, sandboxPolicy);
  if (signal) {
    const killMode = resolveProcessTreeKillMode({
      platform: process.platform,
      detached: options2.detached === true
    });
    const abortHandler = () => {
      if (!child.pid) {
        return;
      }
      killProcessTree(child, killMode, "SIGTERM");
      const forceKillTimeout = setTimeout(() => {
        if (!child.killed && child.pid) {
          killProcessTree(child, killMode, "SIGKILL");
        }
      }, 1e3);
      child.once("exit", () => {
        clearTimeout(forceKillTimeout);
      });
    };
    if (signal.aborted) {
      abortHandler();
    } else {
      signal.addEventListener("abort", abortHandler, { once: true });
      child.once("exit", () => {
        signal.removeEventListener("abort", abortHandler);
      });
    }
  }
  return child;
}
function killDetachedProcessGroup(pid, signal, forceKillAfterMs) {
  if (!pid) {
    return;
  }
  try {
    process.kill(-pid, signal);
  } catch {
    return;
  }
  if (signal === "SIGTERM" && forceKillAfterMs !== void 0 && forceKillAfterMs > 0) {
    setTimeout(() => {
      try {
        process.kill(-pid, "SIGKILL");
      } catch {
      }
    }, forceKillAfterMs);
  }
}
function ignoreStreamErrors(stream3) {
  stream3?.on("error", () => {
  });
}
function writeShellStatePipe(inFd, state) {
  if (!inFd) {
    return;
  }
  ignoreStreamErrors(inFd);
  inFd.write(state);
  inFd.end();
}
function attachShellStateOutput(outFd, onChunk) {
  if (!outFd) {
    return;
  }
  ignoreStreamErrors(outFd);
  outFd.on("data", (data) => {
    onChunk(data.toString());
  });
}
function splitPwdAndState(state) {
  const firstLineIndex = state.indexOf("\n");
  const cwd = state.substring(0, firstLineIndex);
  const rest = state.substring(firstLineIndex);
  return { cwd, rest };
}
function parseShellStateOutput(fullOutput, marker17) {
  const markerWithNewline = `${marker17}
`;
  const markerIndex = fullOutput.indexOf(markerWithNewline);
  return markerIndex >= 0 ? fullOutput.slice(markerIndex + markerWithNewline.length) : fullOutput;
}
var import_node_child_process5;
var init_core2 = __esm({
  "../packages/shell-exec/dist/core.js"() {
    "use strict";
    import_node_child_process5 = require("node:child_process");
    init_ripgrep();
    init_sandbox();
    init_types4();
  }
});
