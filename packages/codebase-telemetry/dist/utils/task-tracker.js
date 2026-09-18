var __awaiter68 = function(thisArg, _arguments, P2, generator) {
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
var TaskTracker = class {
  constructor() {
    this.inflight = /* @__PURE__ */ new Set();
  }
  /**
   * Tracks an already-started task until it settles.
   */
  add(task) {
    const settled = task.then(() => void 0, () => void 0);
    this.inflight.add(settled);
    void settled.finally(() => this.inflight.delete(settled));
  }
  /**
   * Waits until no tracked tasks remain in flight.
   *
   * Aborting the signal does not interrupt tasks already being awaited.
   * Once those tasks settle, the drain rejects without awaiting tasks added
   * while it was waiting. Those tasks remain tracked for a later drain.
   */
  drain(signal) {
    return __awaiter68(this, void 0, void 0, function* () {
      do {
        yield Promise.all(this.inflight);
        signal === null || signal === void 0 ? void 0 : signal.throwIfAborted();
      } while (this.inflight.size > 0);
    });
  }
};
