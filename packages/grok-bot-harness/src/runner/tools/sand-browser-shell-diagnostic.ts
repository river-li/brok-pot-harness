var import_node_buffer4 = require("node:buffer");
init_shell_exec_pb();
function describeSignal(signal) {
  switch (signal) {
    case "":
      return "none";
    case "SIGKILL":
    case "SIGTERM":
    case "SIGABRT":
    case "SIGSEGV":
      return signal;
    default:
      return "other";
  }
}
function describeAbortReason(reason) {
  switch (reason) {
    case void 0:
      return "absent";
    case ShellAbortReason.UNSPECIFIED:
      return "unspecified";
    case ShellAbortReason.USER_ABORT:
      return "user_abort";
    case ShellAbortReason.TIMEOUT:
      return "timeout";
    default:
      return "unknown";
  }
}
function classifyStderr(stderr) {
  if (stderr.length === 0) return "empty";
  if (/\b(?:ERR_)?MODULE_NOT_FOUND\b/.test(stderr)) return "module_not_found";
  if (stderr.includes("SyntaxError:")) return "syntax_error";
  return "other";
}
function describeProcess(result) {
  return `signal=${describeSignal(result.signal)} stdout_bytes=${import_node_buffer4.Buffer.byteLength(result.stdout, "utf8")} stderr_bytes=${import_node_buffer4.Buffer.byteLength(result.stderr, "utf8")} marker=${result.stdout.includes(SAND_BROWSER_RESULT_MARKER)} stderr_class=${classifyStderr(result.stderr)} output_redirected=${result.outputLocation !== void 0}`;
}
function describeSandBrowserShellError(result) {
  const outcome = result.result;
  switch (outcome.case) {
    case "success":
      return `Browser driver produced no result (exit ${outcome.value.exitCode}): ${describeProcess(outcome.value)}`;
    case "failure":
      return `Browser driver shell failed (failure): exit_code=${outcome.value.exitCode} ${describeProcess(outcome.value)} aborted=${outcome.value.aborted} abort_reason=${describeAbortReason(outcome.value.abortReason)}`;
    case "timeout":
      return `Browser driver shell failed (timeout): timeout_ms=${outcome.value.timeoutMs}`;
    case "rejected":
      return "Browser driver shell failed (rejected)";
    case "spawnError":
      return "Browser driver shell failed (spawnError)";
    case "permissionDenied":
      return "Browser driver shell failed (permissionDenied)";
    default:
      return "Browser driver shell failed (unknown)";
  }
}
