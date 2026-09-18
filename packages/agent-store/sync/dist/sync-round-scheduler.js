var __awaiter15 = function(thisArg, _arguments, P2, generator) {
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
var ROUND_ABANDONED = /* @__PURE__ */ Symbol("sync-round-abandoned");
var SyncRoundStoodAsideError = class extends Error {
  constructor() {
    super("Agent store full sync stood aside for path sync");
    this.name = "SyncRoundStoodAsideError";
  }
};
function isSyncRoundStoodAsideError(error41) {
  return error41 instanceof SyncRoundStoodAsideError;
}
var SyncRoundScheduler = class {
  constructor() {
    this.pending = [];
  }
  enqueue(kind, run) {
    return new Promise((resolve29, reject2) => {
      var _a19;
      const entry = { kind, run, resolve: resolve29, reject: reject2 };
      if (kind === "path") {
        (_a19 = this.fullRoundStandAside) === null || _a19 === void 0 ? void 0 : _a19.abort(new SyncRoundStoodAsideError());
        const fullIdx = this.pending.findIndex((item) => item.kind === "full");
        if (fullIdx === -1) {
          this.pending.push(entry);
        } else {
          this.pending.splice(fullIdx, 0, entry);
        }
      } else {
        this.pending.push(entry);
      }
      void this.ensurePump();
    });
  }
  /**
   * Unjam the pump after a session watchdog abandons a wedged round. Rejects
   * not-yet-started pending entries, stops awaiting the in-flight body (which
   * continues in the background and still settles its enqueue promise), and
   * lets a later `enqueue` start a fresh pump once fail-fast clears.
   */
  abandonInFlight() {
    var _a19;
    const pending = this.pending.splice(0);
    for (const entry of pending) {
      entry.reject(new Error("Agent store sync round abandoned by watchdog"));
    }
    (_a19 = this.abandonInFlightReject) === null || _a19 === void 0 ? void 0 : _a19.call(this, ROUND_ABANDONED);
    this.abandonInFlightReject = void 0;
    this.fullRoundStandAside = void 0;
  }
  drain() {
    return __awaiter15(this, void 0, void 0, function* () {
      var _a19;
      while (this.pending.length > 0 || this.pumping !== void 0) {
        yield (_a19 = this.pumping) !== null && _a19 !== void 0 ? _a19 : Promise.resolve();
      }
    });
  }
  ensurePump() {
    if (this.pumping !== void 0) {
      return;
    }
    this.pumping = this.pump().finally(() => {
      this.pumping = void 0;
      if (this.pending.length > 0) {
        this.ensurePump();
      }
    });
  }
  pump() {
    return __awaiter15(this, void 0, void 0, function* () {
      while (this.pending.length > 0) {
        const next = this.pending.shift();
        const standAside = next.kind === "full" ? new AbortController() : void 0;
        if (standAside !== void 0) {
          this.fullRoundStandAside = standAside;
        }
        const runPromise = next.run(standAside === null || standAside === void 0 ? void 0 : standAside.signal);
        const abandonPromise = new Promise((_2, reject2) => {
          this.abandonInFlightReject = reject2;
        });
        try {
          const summary = yield Promise.race([runPromise, abandonPromise]);
          next.resolve(summary);
        } catch (error41) {
          if (error41 === ROUND_ABANDONED) {
            void runPromise.then(next.resolve, next.reject);
            break;
          }
          next.reject(error41);
        } finally {
          if (this.abandonInFlightReject !== void 0) {
            this.abandonInFlightReject = void 0;
          }
          if (this.fullRoundStandAside === standAside) {
            this.fullRoundStandAside = void 0;
          }
        }
      }
    });
  }
};
