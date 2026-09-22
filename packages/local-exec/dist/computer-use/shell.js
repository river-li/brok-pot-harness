/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/computer-use/shell.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_child_process7 = require("node:child_process");
init_dist3();
var DEFAULT_TIMEOUT_MS = 3e4;
var execFileUtf8 = import_node_child_process7.execFile;
function exec(command, args, options2) {
  return new Promise((resolve29, reject2) => {
    options2?.signal?.throwIfAborted();
    const opts = {
      timeout: options2?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      env: options2?.env ? { ...process.env, ...options2.env } : void 0,
      signal: options2?.signal
    };
    spawnWorkload(execFileUtf8, command, args.map(String), { ...opts, encoding: "utf8" }, (error42, stdout) => {
      if (error42)
        reject2(error42);
      else
        resolve29(stdout);
    });
  });
}

