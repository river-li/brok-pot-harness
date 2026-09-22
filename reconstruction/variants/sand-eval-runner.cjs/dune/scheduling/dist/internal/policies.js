/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/scheduling/dist/internal/policies.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter11 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
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
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var DeadlineExceededError = class extends Error {
  constructor(policyName) {
    super(`Deadline exceeded for ${policyName}`);
    this.code = "deadline_exceeded";
    this.name = "DeadlineExceededError";
    this.policyName = policyName;
  }
};
function createDeadlinePolicy(options2) {
  var _a20;
  assertName(options2.name);
  assertDuration(options2.timeoutMs, "timeoutMs");
  const clock = (_a20 = options2.clock) !== null && _a20 !== void 0 ? _a20 : realClock;
  return {
    name: options2.name,
    run(work, signal) {
      return __awaiter11(this, void 0, void 0, function* () {
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
          const error3 = new DeadlineExceededError(options2.name);
          rejectTimeout(error3);
          controller.abort(error3);
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
function createExpiryPolicy(options2) {
  var _a20;
  assertName(options2.name);
  assertDuration(options2.ttlMs, "ttlMs");
  const clock = (_a20 = options2.clock) !== null && _a20 !== void 0 ? _a20 : realClock;
  const pending = /* @__PURE__ */ new Map();
  return {
    name: options2.name,
    arm(key, onExpire) {
      var _a21;
      (_a21 = pending.get(key)) === null || _a21 === void 0 ? void 0 : _a21.dispose();
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
var JITTER_SPREAD = { none: 0, equal: 1 / 2, full: 1 };
function abortReason(signal, policyName) {
  var _a20;
  return (_a20 = signal.reason) !== null && _a20 !== void 0 ? _a20 : createAbortError(policyName);
}
function createAbortError(policyName) {
  const error3 = new Error(`Operation aborted for ${policyName}`);
  error3.name = "AbortError";
  return error3;
}
var POLICY_NAME_PATTERN = /^[a-z0-9]+([-.][a-z0-9]+)*$/;
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

