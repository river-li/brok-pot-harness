/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/computer-use/shell.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_child_process8 = require("node:child_process");
var import_promises13 = require("node:timers/promises");
init_dist3();
var DEFAULT_TIMEOUT_MS = 3e4;
var execFileUtf82 = import_node_child_process8.execFile;
var execFileBuffer = import_node_child_process8.execFile;
var spawnWithPipedStdin = import_node_child_process8.spawn;
function exec(command, args, options2) {
  return new Promise((resolve14, reject2) => {
    options2?.signal?.throwIfAborted();
    const opts = {
      timeout: options2?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      env: options2?.env ? { ...process.env, ...options2.env } : void 0,
      signal: options2?.signal
    };
    spawnWorkload(execFileUtf82, command, args.map(String), { ...opts, encoding: "utf8" }, (error3, stdout) => {
      if (error3)
        reject2(error3);
      else
        resolve14(stdout);
    });
  });
}
function execBuffer(command, args, options2) {
  return new Promise((resolve14, reject2) => {
    options2?.signal?.throwIfAborted();
    const opts = {
      timeout: options2?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      env: options2?.env ? { ...process.env, ...options2.env } : void 0,
      maxBuffer: 50 * 1024 * 1024,
      signal: options2?.signal
    };
    spawnWorkload(execFileBuffer, command, args.map(String), { ...opts, encoding: null }, (error3, stdout) => {
      if (error3)
        reject2(error3);
      else
        resolve14(stdout);
    });
  });
}
function execWithInput(command, args, options2) {
  const { input } = options2;
  return new Promise((resolve14, reject2) => {
    options2.signal?.throwIfAborted();
    const child = spawnWorkload(spawnWithPipedStdin, command, args.map(String), {
      env: options2.env ? { ...process.env, ...options2.env } : void 0,
      stdio: ["pipe", "ignore", "pipe"],
      signal: options2.signal
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    const timer2 = setTimeout(() => {
      child.kill("SIGKILL");
      reject2(new Error(`${command} timed out`));
    }, options2.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    const settle = (finish) => {
      clearTimeout(timer2);
      finish();
    };
    child.on("error", (error3) => settle(() => reject2(error3)));
    child.on("close", (code) => settle(() => {
      if (code === 0)
        resolve14();
      else
        reject2(new Error(`${command} exited with code ${code}${stderr.trim() ? `: ${stderr.trim()}` : ""}`));
    }));
    child.stdin.on("error", (error3) => {
      if (error3.code !== "EPIPE") {
        settle(() => reject2(error3));
      }
    });
    child.stdin.end(input);
  });
}
function sleep(ms2, signal) {
  return (0, import_promises13.setTimeout)(ms2, void 0, { signal });
}

