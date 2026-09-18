var DEFAULT_HEADLESS_STREAM_RETRY = {
  maxAttempts: 4,
  baseDelayMs: 1e3,
  maxDelayMs: 15e3
};
var DEFAULT_OVERLOAD_STREAM_RETRY = {
  maxAttempts: 3,
  baseDelayMs: 750,
  maxDelayMs: 6e3
};
function readIntEnv(env, name17, min) {
  const raw = env[name17];
  if (raw == null) return void 0;
  const parsed2 = Number.parseInt(raw.trim(), 10);
  if (!Number.isFinite(parsed2) || parsed2 < min) return void 0;
  return parsed2;
}
function resolveSandStreamTuning(env) {
  return {
    headlessRetry: {
      maxAttempts: readIntEnv(env, "SAND_HEADLESS_STREAM_RETRY_ATTEMPTS", 1) ?? DEFAULT_HEADLESS_STREAM_RETRY.maxAttempts,
      baseDelayMs: readIntEnv(env, "SAND_HEADLESS_STREAM_RETRY_BASE_MS", 0) ?? DEFAULT_HEADLESS_STREAM_RETRY.baseDelayMs,
      maxDelayMs: readIntEnv(env, "SAND_HEADLESS_STREAM_RETRY_MAX_MS", 0) ?? DEFAULT_HEADLESS_STREAM_RETRY.maxDelayMs
    },
    overloadRetry: {
      maxAttempts: readIntEnv(env, "SAND_OVERLOAD_STREAM_RETRY_ATTEMPTS", 1) ?? DEFAULT_OVERLOAD_STREAM_RETRY.maxAttempts,
      baseDelayMs: readIntEnv(env, "SAND_OVERLOAD_STREAM_RETRY_BASE_MS", 0) ?? DEFAULT_OVERLOAD_STREAM_RETRY.baseDelayMs,
      maxDelayMs: readIntEnv(env, "SAND_OVERLOAD_STREAM_RETRY_MAX_MS", 0) ?? DEFAULT_OVERLOAD_STREAM_RETRY.maxDelayMs
    },
    deadlineOverrides: {
      firstTokenDeadlineMs: readIntEnv(env, "SAND_FIRST_TOKEN_STALL_DEADLINE_MS", 0),
      idleDeadlineMs: readIntEnv(env, "SAND_STREAM_IDLE_DEADLINE_MS", 0)
    }
  };
}
