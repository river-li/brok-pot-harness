/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/scheduling/dist/internal/policies.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function failedStop(policyName, reason, cause) {
  return { policyName, reason, errorClass: cause instanceof Error ? cause.name : typeof cause };
}
function createTaskBoundaryPolicy(options2) {
  var _a19;
  assertName(options2.name);
  const clock = (_a19 = options2.clock) !== null && _a19 !== void 0 ? _a19 : realClock;
  return {
    name: options2.name,
    settled() {
      return new Promise((resolve29) => {
        clock.schedule(0, resolve29);
      });
    }
  };
}
function createDeadlinePolicy(options2) {
  var _a19;
  assertName(options2.name);
  assertDuration(options2.timeoutMs, "timeoutMs");
  const clock = (_a19 = options2.clock) !== null && _a19 !== void 0 ? _a19 : realClock;
  return {
    name: options2.name,
    run(work, signal) {
      return __awaiter(this, void 0, void 0, function* () {
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
          throw abortReason(signal, options2.name);
        const controller = new AbortController();
        let rejectTimeout = () => {
        };
        const timeout2 = new Promise((_2, reject2) => {
          rejectTimeout = reject2;
        });
        let rejectCancellation = () => {
        };
        const cancellation = new Promise((_2, reject2) => {
          rejectCancellation = reject2;
        });
        let removeAbortListener = () => {
        };
        if (signal != null) {
          const abort = () => {
            const reason = abortReason(signal, options2.name);
            rejectCancellation(reason);
            controller.abort(reason);
          };
          signal.addEventListener("abort", abort, { once: true });
          removeAbortListener = () => signal.removeEventListener("abort", abort);
        }
        const deadline = clock.schedule(options2.timeoutMs, () => {
          const error42 = new DeadlineExceededError(options2.name);
          rejectTimeout(error42);
          controller.abort(error42);
        });
        try {
          return yield Promise.race([work(controller.signal), timeout2, cancellation]);
        } finally {
          deadline.dispose();
          removeAbortListener();
        }
      });
    }
  };
}
function createRetryPolicy(options2) {
  var _a19, _b2, _c2, _d, _e2, _f;
  assertName(options2.name);
  const maxAttempts = options2.mode === "until-signal" ? null : options2.maxAttempts;
  if (maxAttempts !== null)
    assertPositiveInteger(maxAttempts, "maxAttempts");
  assertDuration(options2.initialDelayMs, "initialDelayMs");
  assertDuration(options2.maxDelayMs, "maxDelayMs");
  if (options2.maxDelayMs < options2.initialDelayMs) {
    throw new RangeError(`${options2.name}: maxDelayMs must be at least initialDelayMs`);
  }
  const backoffFactor = (_a19 = options2.backoffFactor) !== null && _a19 !== void 0 ? _a19 : 2;
  if (!Number.isFinite(backoffFactor) || backoffFactor < 1) {
    throw new RangeError(`${options2.name}: backoffFactor must be a finite number at least 1`);
  }
  const clock = (_b2 = options2.clock) !== null && _b2 !== void 0 ? _b2 : realClock;
  const random = (_c2 = options2.random) !== null && _c2 !== void 0 ? _c2 : Math.random;
  const shouldRetry = (_d = options2.shouldRetry) !== null && _d !== void 0 ? _d : (() => true);
  const delayHintFrom = (_e2 = options2.delayHintFrom) !== null && _e2 !== void 0 ? _e2 : (() => void 0);
  const scheduleOptions = options2.keepEventLoopAliveDuringWaits ? { keepEventLoopAlive: true } : void 0;
  const curve = {
    initialDelayMs: options2.initialDelayMs,
    maxDelayMs: options2.maxDelayMs,
    backoffFactor,
    jitter: (_f = options2.jitter) !== null && _f !== void 0 ? _f : "none"
  };
  const policy = {
    name: options2.name,
    schedule(attempt, signal, hint) {
      assertPositiveInteger(attempt, "attempt");
      if (hint != null)
        assertDuration(hint.delayMs, "hint.delayMs");
      const window2 = retryDelayWindow(curve, attempt, hint);
      const width = window2.highMs - window2.lowMs;
      const delayMs = width > 0 ? window2.lowMs + random() * width : window2.lowMs;
      return createDelay(clock, options2.name, delayMs, signal, scheduleOptions);
    },
    runWithRetry(work, signal) {
      return __awaiter(this, void 0, void 0, function* () {
        if (maxAttempts === null && signal == null) {
          throw new TypeError(`${options2.name}: runWithRetry needs the signal that ends an until-signal policy`);
        }
        const workSignal = signal !== null && signal !== void 0 ? signal : new AbortController().signal;
        let rejectCancellation = () => {
        };
        const cancellation = new Promise((_2, reject2) => {
          rejectCancellation = reject2;
        });
        let removeAbortListener = () => {
        };
        if (signal != null) {
          const abort = () => rejectCancellation(abortReason(signal, options2.name));
          signal.addEventListener("abort", abort, { once: true });
          removeAbortListener = () => signal.removeEventListener("abort", abort);
        }
        try {
          for (let attempt = 1; ; attempt += 1) {
            if (signal === null || signal === void 0 ? void 0 : signal.aborted)
              throw abortReason(signal, options2.name);
            try {
              return yield Promise.race([work(attempt, workSignal), cancellation]);
            } catch (error42) {
              if (signal === null || signal === void 0 ? void 0 : signal.aborted)
                throw abortReason(signal, options2.name);
              if (!shouldRetry(error42, attempt))
                throw error42;
              if (maxAttempts !== null && attempt >= maxAttempts) {
                throw new RetryExhaustedError(options2.name, attempt, { cause: error42 });
              }
              const delay5 = policy.schedule(attempt, signal, delayHintFrom(error42, attempt));
              try {
                yield delay5.elapsed;
              } finally {
                delay5.dispose();
              }
            }
          }
        } finally {
          removeAbortListener();
        }
      });
    }
  };
  return policy;
}
function createPollingPolicy(options2) {
  var _a19, _b2;
  assertName(options2.name);
  assertDuration(options2.intervalMs, "intervalMs");
  if (options2.intervalMs === 0) {
    throw new RangeError(`${options2.name}: intervalMs must be greater than 0`);
  }
  const clock = (_a19 = options2.clock) !== null && _a19 !== void 0 ? _a19 : realClock;
  const report = (_b2 = options2.report) !== null && _b2 !== void 0 ? _b2 : noSchedulingReport;
  return {
    name: options2.name,
    start(tick, signal) {
      var _a20;
      const lifecycle = createLifecycle();
      let resolveStopped = () => {
      };
      const stopped2 = new Promise((resolve29) => {
        resolveStopped = resolve29;
      });
      let removeAbortListener = () => {
      };
      const stop = (stopReason) => {
        if (!lifecycle.dispose())
          return false;
        removeAbortListener();
        resolveStopped(stopReason);
        return true;
      };
      const dispose = () => {
        stop({ policyName: options2.name, reason: "disposed" });
      };
      const tickFailed = (cause) => {
        if (!stop({ policyName: options2.name, reason: "tick-failed", cause }))
          return;
        report(failedStop(options2.name, "tick-failed", cause));
      };
      const run = () => {
        lifecycle.fired();
        if (lifecycle.current.state === "disposed")
          return;
        let completion;
        try {
          completion = tick();
        } catch (cause) {
          tickFailed(cause);
          return;
        }
        void completion.then(() => {
          if (lifecycle.current.state === "disposed")
            return;
          lifecycle.arm(clock.schedule(options2.intervalMs, run));
        }, tickFailed);
      };
      const polling = { dispose, stopped: stopped2 };
      if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
        dispose();
        return polling;
      }
      if (signal != null) {
        signal.addEventListener("abort", dispose, { once: true });
        removeAbortListener = () => signal.removeEventListener("abort", dispose);
      }
      if ((_a20 = options2.leading) !== null && _a20 !== void 0 ? _a20 : true) {
        run();
      } else {
        lifecycle.arm(clock.schedule(options2.intervalMs, run));
      }
      return polling;
    }
  };
}
function createDebouncePolicy(options2) {
  var _a19;
  assertName(options2.name);
  assertDuration(options2.delayMs, "delayMs");
  const clock = (_a19 = options2.clock) !== null && _a19 !== void 0 ? _a19 : realClock;
  const wrap2 = (fn) => {
    const lifecycle = createLifecycle();
    return Object.assign((...args) => {
      if (lifecycle.current.state === "disposed")
        return;
      lifecycle.arm(clock.schedule(options2.delayMs, () => {
        lifecycle.fired();
        fn(...args);
      }));
    }, {
      dispose() {
        lifecycle.dispose();
      }
    });
  };
  return {
    name: options2.name,
    wrap: wrap2
  };
}
function createIdleWatchdogPolicy(options2) {
  var _a19;
  assertName(options2.name);
  assertDuration(options2.idleMs, "idleMs");
  const clock = (_a19 = options2.clock) !== null && _a19 !== void 0 ? _a19 : realClock;
  return {
    name: options2.name,
    arm(onIdle) {
      const lifecycle = createLifecycle();
      const rearm = () => {
        lifecycle.arm(clock.schedule(options2.idleMs, () => {
          lifecycle.fired();
          onIdle();
        }));
      };
      rearm();
      return {
        kick() {
          if (lifecycle.current.state === "disposed")
            return;
          rearm();
        },
        dispose() {
          lifecycle.dispose();
        }
      };
    }
  };
}
function createExpiryPolicy(options2) {
  var _a19;
  assertName(options2.name);
  assertDuration(options2.ttlMs, "ttlMs");
  const clock = (_a19 = options2.clock) !== null && _a19 !== void 0 ? _a19 : realClock;
  const pending = /* @__PURE__ */ new Map();
  return {
    name: options2.name,
    arm(key, onExpire) {
      var _a20;
      (_a20 = pending.get(key)) === null || _a20 === void 0 ? void 0 : _a20.dispose();
      const scheduled = clock.schedule(options2.ttlMs, () => {
        pending.delete(key);
        onExpire();
      });
      pending.set(key, scheduled);
      return {
        dispose() {
          const isCurrentArming = pending.get(key) === scheduled;
          if (!isCurrentArming)
            return;
          pending.delete(key);
          scheduled.dispose();
        }
      };
    }
  };
}
function createLifecycle() {
  let current = { state: "running" };
  return {
    get current() {
      return current;
    },
    arm(handle) {
      if (current.state === "disposed") {
        handle.dispose();
        return;
      }
      if (current.state === "armed")
        current.handle.dispose();
      current = { state: "armed", handle };
    },
    fired() {
      if (current.state === "armed")
        current = { state: "running" };
    },
    dispose() {
      if (current.state === "disposed")
        return false;
      if (current.state === "armed")
        current.handle.dispose();
      current = { state: "disposed" };
      return true;
    }
  };
}
function retryDelayWindow(curve, attempt, hint) {
  const cap = curve.maxDelayMs;
  const spread = JITTER_SPREAD[curve.jitter];
  const growth = Math.min(Math.pow(curve.backoffFactor, attempt - 1), Number.MAX_VALUE);
  const base = Math.min(cap, curve.initialDelayMs * growth);
  const underCurve = { lowMs: base * (1 - spread), highMs: base };
  if (hint == null)
    return underCurve;
  switch (hint.kind) {
    case "replace": {
      const delayMs = Math.min(cap, hint.delayMs);
      return { lowMs: delayMs, highMs: delayMs };
    }
    case "minimum": {
      const floor2 = hint.delayMs;
      return {
        lowMs: Math.min(cap, Math.max(underCurve.lowMs, floor2)),
        highMs: Math.min(cap, Math.max(underCurve.highMs, floor2 * (1 + spread)))
      };
    }
    default: {
      const exhaustive = hint;
      throw new TypeError(`Unknown delay hint ${String(exhaustive)}`);
    }
  }
}
function createDelay(clock, policyName, delayMs, signal, scheduleOptions) {
  let settled = false;
  let resolveElapsed = () => {
  };
  let rejectElapsed = () => {
  };
  const elapsed = new Promise((resolve29, reject2) => {
    resolveElapsed = resolve29;
    rejectElapsed = reject2;
  });
  void elapsed.catch(() => {
  });
  let removeAbortListener = () => {
  };
  const scheduled = clock.schedule(delayMs, () => {
    if (settled)
      return;
    settled = true;
    removeAbortListener();
    resolveElapsed();
  }, scheduleOptions);
  const cancel = (reason) => {
    if (settled)
      return;
    settled = true;
    scheduled.dispose();
    removeAbortListener();
    rejectElapsed(reason !== null && reason !== void 0 ? reason : createAbortError(policyName));
  };
  if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
    cancel(signal.reason);
  } else if (signal != null) {
    const abort = () => cancel(signal.reason);
    signal.addEventListener("abort", abort, { once: true });
    removeAbortListener = () => signal.removeEventListener("abort", abort);
  }
  return {
    elapsed,
    delayMs,
    dispose: () => cancel()
  };
}
function abortReason(signal, policyName) {
  var _a19;
  return (_a19 = signal.reason) !== null && _a19 !== void 0 ? _a19 : createAbortError(policyName);
}
function createAbortError(policyName) {
  const error42 = new Error(`Operation aborted for ${policyName}`);
  error42.name = "AbortError";
  return error42;
}
function assertName(name17) {
  if (!POLICY_NAME_PATTERN.test(name17)) {
    throw new TypeError(`name must be lowercase segments joined by "-" or ".", got ${JSON.stringify(name17)}`);
  }
}
function assertDuration(value, name17) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name17} must be a finite non-negative number`);
  }
}
function assertPositiveInteger(value, name17) {
  if (!Number.isInteger(value) || value < 1 || value >= Number.MAX_SAFE_INTEGER) {
    throw new RangeError(`${name17} must be a positive integer below Number.MAX_SAFE_INTEGER`);
  }
}
var __awaiter, noSchedulingReport, DeadlineExceededError, RetryExhaustedError, JITTER_SPREAD, POLICY_NAME_PATTERN;
var init_policies = __esm({
  "../dune/scheduling/dist/internal/policies.js"() {
    "use strict";
    init_clock();
    __awaiter = function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve29) {
          resolve29(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject2(e);
          }
        }
        function rejected3(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject2(e);
          }
        }
        function step(result) {
          result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    noSchedulingReport = () => {
    };
    DeadlineExceededError = class extends Error {
      constructor(policyName) {
        super(`Deadline exceeded for ${policyName}`);
        this.code = "deadline_exceeded";
        this.name = "DeadlineExceededError";
        this.policyName = policyName;
      }
    };
    RetryExhaustedError = class extends Error {
      constructor(policyName, attempts2, options2) {
        super(`Retry exhausted for ${policyName} after ${attempts2} attempts`, options2);
        this.code = "retry_exhausted";
        this.name = "RetryExhaustedError";
        this.policyName = policyName;
        this.attempts = attempts2;
      }
    };
    JITTER_SPREAD = { none: 0, equal: 1 / 2, full: 1 };
    POLICY_NAME_PATTERN = /^[a-z0-9]+([-.][a-z0-9]+)*$/;
  }
});

