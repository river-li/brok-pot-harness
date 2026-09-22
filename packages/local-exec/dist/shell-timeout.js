/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/shell-timeout.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_shell_exec_pb();
var DEFAULT_SHELL_FOREGROUND_TIMEOUT_MS = 3e4;
function resolveShellTimeoutMs(args) {
  if (args.timeout !== 0) {
    return args.timeout;
  }
  if (args.isBackground || args.timeoutBehavior === TimeoutBehavior.BACKGROUND || args.hardTimeout !== void 0 && args.hardTimeout > 0) {
    return 0;
  }
  return DEFAULT_SHELL_FOREGROUND_TIMEOUT_MS;
}

