init_scheduling();
function classifyStreamActivity(update) {
  if (update.type === "text-delta" || update.type === "thinking-delta") {
    return { kind: "delta" };
  }
  if (update.type === "tool-call") {
    return { kind: "tool-call", callId: update.id, settled: update.status !== "pending" };
  }
  return void 0;
}
function createStreamWatchdog() {
  let streamOutputProduced = false;
  let deadlineHooks;
  return {
    noteUpdate: (update) => {
      const activity = classifyStreamActivity(update);
      if (activity === void 0) return;
      streamOutputProduced = true;
      deadlineHooks?.noteStreamActivity(activity);
    },
    resetDeadline: () => deadlineHooks?.reset(),
    getStreamOutputProduced: () => streamOutputProduced,
    setStreamOutputProduced: (value) => {
      streamOutputProduced = value;
    },
    setDeadlineHooks: (hooks) => {
      deadlineHooks = hooks;
    },
    clearDeadlineHooksIf: (hooks) => {
      if (deadlineHooks === hooks) deadlineHooks = void 0;
    }
  };
}
function firstRejected(results) {
  return results.find((result) => result.status === "rejected");
}
function createStreamAttempt(host) {
  const ctx = host.ctx;
  let attemptResumeCheckpoint;
  let resumeStreamFrom;
  const inactiveAttempt = {};
  let activeAttempt = inactiveAttempt;
  const runStreamOnce = async () => {
    ctx.signal.throwIfAborted();
    host.setStreamOutputProduced(false);
    attemptResumeCheckpoint = void 0;
    const [attemptCtx, cancelAttempt] = ctx.withCancel();
    const attempt = {};
    activeAttempt = attempt;
    const isCurrentAttempt = () => activeAttempt === attempt;
    const settleAttempt = () => {
      if (isCurrentAttempt()) activeAttempt = inactiveAttempt;
    };
    const checkpointOperations = /* @__PURE__ */ new Set();
    let checkpointFailure;
    const persistCheckpoint = async (checkpointCtx, checkpoint) => {
      if (!isCurrentAttempt()) return;
      const operation = Promise.resolve().then(
        () => host.persistCheckpoint(checkpointCtx, checkpoint, (persistedCheckpoint) => {
          attemptResumeCheckpoint = persistedCheckpoint;
        })
      );
      checkpointOperations.add(operation);
      try {
        await operation;
      } catch (error41) {
        checkpointFailure ??= { status: "rejected", reason: error41 };
        throw error41;
      } finally {
        checkpointOperations.delete(operation);
      }
    };
    const drainCheckpoints = async () => {
      await host.drainStepCheckpoints?.();
      settleAttempt();
      const results = await Promise.allSettled(checkpointOperations);
      return checkpointFailure ?? firstRejected(results);
    };
    let streamPromise;
    try {
      streamPromise = host.startStream(attemptCtx, resumeStreamFrom, persistCheckpoint);
    } catch (error41) {
      settleAttempt();
      throw error41;
    }
    const policy = resolveStreamDeadlinePolicy(
      host.streamTuning.deadlineOverrides,
      host.streamDeadlineConfig()
    );
    if (policy.firstTokenDeadlineMs <= 0) {
      try {
        const state = await streamPromise;
        if (checkpointFailure != null) throw checkpointFailure.reason;
        return state;
      } catch (error41) {
        const failed2 = await drainCheckpoints();
        if (failed2 != null) throw failed2.reason;
        throw error41;
      } finally {
        settleAttempt();
      }
    }
    const attemptScale = 2 ** retriesPerformed;
    const firstTokenDeadlineMs = policy.firstTokenDeadlineMs * attemptScale;
    const idleDeadlineMs = policy.idleDeadlineMs > 0 ? policy.idleDeadlineMs * attemptScale : 0;
    return new Promise((resolve29, reject2) => {
      let settled = false;
      let deadlineFired = false;
      let armedDeadlineMs = firstTokenDeadlineMs;
      const toolCallsInFlight = /* @__PURE__ */ new Set();
      const onDeadline = () => {
        if (settled) return;
        settled = true;
        deadlineFired = true;
        const midStream = host.getStreamOutputProduced();
        cancelAttempt(
          new SandRunAbortError({
            intentional: false,
            reason: midStream ? "stream-idle" : "first-token stall"
          })
        );
        void drainCheckpoints().then((failed2) => {
          if (failed2 != null) {
            reject2(failed2.reason);
            return;
          }
          reject2(
            midStream ? new StreamIdleError(armedDeadlineMs) : new FirstTokenStallError(armedDeadlineMs)
          );
        });
      };
      const firstTokenExpiry = createExpiryPolicy({
        name: "sand-stream-first-token",
        ttlMs: firstTokenDeadlineMs,
        clock: host.clock
      });
      const idleExpiry = idleDeadlineMs > 0 ? createExpiryPolicy({
        name: "sand-stream-idle",
        ttlMs: idleDeadlineMs,
        clock: host.clock
      }) : void 0;
      let armed = firstTokenExpiry.arm("attempt", onDeadline);
      const hooks = {
        disarm: () => {
          settled = true;
          armed.dispose();
          host.clearDeadlineHooksIf(hooks);
        },
        reset: () => {
          if (settled) return;
          if (idleDeadlineMs <= 0 && host.getStreamOutputProduced()) return;
          armedDeadlineMs = firstTokenDeadlineMs;
          armed.dispose();
          armed = firstTokenExpiry.arm("attempt", onDeadline);
        },
        noteStreamActivity: (activity) => {
          if (settled) return;
          if (activity.kind === "tool-call") {
            if (activity.settled) {
              toolCallsInFlight.delete(activity.callId);
            } else {
              toolCallsInFlight.add(activity.callId);
            }
          }
          armed.dispose();
          if (idleExpiry === void 0 || toolCallsInFlight.size > 0) return;
          armedDeadlineMs = idleDeadlineMs;
          armed = idleExpiry.arm("attempt", onDeadline);
        }
      };
      host.setDeadlineHooks(hooks);
      void streamPromise.then(
        (state) => {
          if (deadlineFired) return;
          hooks.disarm();
          settleAttempt();
          if (checkpointFailure == null) {
            resolve29(state);
          } else {
            reject2(checkpointFailure.reason);
          }
        },
        (error41) => {
          if (deadlineFired) return;
          hooks.disarm();
          void drainCheckpoints().then((failed2) => {
            reject2(failed2 == null ? error41 : failed2.reason);
          });
        }
      );
    });
  };
  const automationPolicy = host.transientStreamRetry;
  const retryPolicy = automationPolicy ?? host.streamTuning.overloadRetry;
  const automationIsRetryable = automationPolicy != null ? automationPolicy.isRetryable ?? isTransientStreamError : void 0;
  let retriesPerformed = 0;
  const runBoundedTurn = async () => retryPolicy.maxAttempts > 1 ? await runWithTransientRetry(runStreamOnce, {
    ...retryPolicy,
    isRetryable: (error41) => shouldRetryTurnAttempt({
      error: error41,
      canceled: ctx.canceled,
      streamOutputProduced: host.getStreamOutputProduced(),
      resumeCheckpointAvailable: attemptResumeCheckpoint != null,
      automationIsRetryable
    }),
    onRetry: (info2) => {
      retriesPerformed = info2.attempt;
      if (host.getStreamOutputProduced() && attemptResumeCheckpoint != null) {
        resumeStreamFrom = attemptResumeCheckpoint;
      }
      host.setTraceAttributes({
        "sand.retry_count": info2.attempt
      });
      if (!host.hidden) {
        host.emitRetrying();
      }
      host.reportTurnRetry({
        outcome: "retried",
        attempt: info2.attempt,
        maxAttempts: retryPolicy.maxAttempts,
        delayMs: info2.delayMs,
        serverPaced: info2.serverPaced,
        error: info2.error
      });
      automationPolicy?.onRetry?.(info2);
    }
  }) : await runStreamOnce();
  const run = async () => {
    try {
      return await runBoundedTurn();
    } catch (error41) {
      if (!ctx.canceled) {
        const failingAttempt = retriesPerformed + 1;
        if (retriesPerformed > 0 && retriesPerformed >= retryPolicy.maxAttempts - 1) {
          host.reportTurnRetry({
            outcome: "exhausted",
            attempt: failingAttempt,
            maxAttempts: retryPolicy.maxAttempts,
            error: error41
          });
        } else if (retriesPerformed > 0 || isRetryableProviderError(error41)) {
          host.reportTurnRetry({
            outcome: "gave_up_ineligible",
            attempt: failingAttempt,
            maxAttempts: retryPolicy.maxAttempts,
            error: error41
          });
        }
      }
      throw error41;
    }
  };
  return { run };
}
