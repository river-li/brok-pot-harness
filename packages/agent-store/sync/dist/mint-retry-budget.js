var DEFAULT_WINDOW_MS = 6e4;
var DEFAULT_RATIO = 0.1;
var DEFAULT_FLOOR = 3;
var DEFAULT_MIN_ATTEMPTS = 1;
var AgentStoreMintRetryBudget = class {
  constructor(options2 = {}) {
    var _a19, _b2, _c2, _d, _e2;
    this.attempts = [];
    this.retries = [];
    this.windowMs = ensureFinitePositive({
      value: (_a19 = options2.windowMs) !== null && _a19 !== void 0 ? _a19 : DEFAULT_WINDOW_MS,
      name: "windowMs",
      context: "AgentStoreMintRetryBudget"
    });
    const ratio = (_b2 = options2.ratio) !== null && _b2 !== void 0 ? _b2 : DEFAULT_RATIO;
    if (!Number.isFinite(ratio) || ratio < 0 || ratio > 1) {
      throw new RangeError(`AgentStoreMintRetryBudget ratio must be in [0, 1], got ${ratio}`);
    }
    this.ratio = ratio;
    const floor2 = (_c2 = options2.floor) !== null && _c2 !== void 0 ? _c2 : DEFAULT_FLOOR;
    if (!Number.isInteger(floor2) || floor2 < 0) {
      throw new RangeError(`AgentStoreMintRetryBudget floor must be a non-negative integer, got ${floor2}`);
    }
    this.floor = floor2;
    const minAttempts = (_d = options2.minAttempts) !== null && _d !== void 0 ? _d : DEFAULT_MIN_ATTEMPTS;
    if (!Number.isInteger(minAttempts) || minAttempts < 1) {
      throw new RangeError(`AgentStoreMintRetryBudget minAttempts must be an integer >= 1, got ${minAttempts}`);
    }
    this.minAttempts = minAttempts;
    this.now = (_e2 = options2.now) !== null && _e2 !== void 0 ? _e2 : Date.now;
  }
  setTimings(args) {
    if (args.ratio !== void 0) {
      if (!Number.isFinite(args.ratio) || args.ratio < 0 || args.ratio > 1) {
        throw new RangeError(`AgentStoreMintRetryBudget ratio must be in [0, 1], got ${args.ratio}`);
      }
      this.ratio = args.ratio;
    }
    if (args.floor !== void 0) {
      if (!Number.isInteger(args.floor) || args.floor < 0) {
        throw new RangeError(`AgentStoreMintRetryBudget floor must be a non-negative integer, got ${args.floor}`);
      }
      this.floor = args.floor;
    }
  }
  recordAttempt() {
    this.prune();
    this.attempts.push(this.now());
  }
  /** False when the trailing retry ratio (after the floor) is exhausted. */
  tryConsumeRetry() {
    this.prune();
    if (this.retries.length < this.floor) {
      this.retries.push(this.now());
      return true;
    }
    const attempts2 = Math.max(this.attempts.length, this.minAttempts);
    if (this.retries.length / attempts2 < this.ratio) {
      this.retries.push(this.now());
      return true;
    }
    return false;
  }
  prune() {
    const cutoff = this.now() - this.windowMs;
    if (this.attempts.length > 0 && this.attempts[0] <= cutoff) {
      this.attempts = this.attempts.filter((stamp) => stamp > cutoff);
    }
    if (this.retries.length > 0 && this.retries[0] <= cutoff) {
      this.retries = this.retries.filter((stamp) => stamp > cutoff);
    }
  }
};
