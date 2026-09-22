init_errors();
function toError(value) {
  return value instanceof Error ? value : new Error(String(value));
}
function handleProcessCrash(options2, kind, value) {
  const error42 = toError(value);
  console.error(`[${options2.scope}] ${kind} (kept alive): ${errorLogTag(error42)}`);
  try {
    options2.onError?.(error42, kind);
  } catch (reporterError) {
    process.stderr.write(
      `sand.host.crash_reporter_failed kind=${kind} error_class=${errorLogTag(reporterError)}
`
    );
  }
}
function installProcessCrashGuards(options2) {
  let reporter = options2.onError;
  const report = (kind, value) => handleProcessCrash({ scope: options2.scope, onError: reporter }, kind, value);
  process.on("uncaughtException", (value) => report("uncaughtException", value));
  process.on("unhandledRejection", (value) => report("unhandledRejection", value));
  return {
    setReporter: (onError) => {
      reporter = onError;
    }
  };
}
