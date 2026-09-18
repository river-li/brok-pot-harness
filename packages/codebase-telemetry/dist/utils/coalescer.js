var __awaiter66 = function(thisArg, _arguments, P2, generator) {
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
function createPendingWork(task) {
  let resolve29;
  let reject2;
  const promise2 = new Promise((resolvePromise, rejectPromise) => {
    resolve29 = resolvePromise;
    reject2 = rejectPromise;
  });
  return { task, promise: promise2, resolve: resolve29, reject: reject2 };
}
var Coalescer = class {
  constructor() {
    this.state = { kind: "idle" };
  }
  run(task) {
    if (this.state.kind === "running") {
      const pending = this.state.pending;
      if (pending !== void 0) {
        pending.task = task;
        return pending.promise;
      }
      const newPending = createPendingWork(task);
      this.state.pending = newPending;
      return newPending.promise;
    }
    this.state = { kind: "running", pending: void 0 };
    return this.runTask(task);
  }
  runTask(task) {
    return __awaiter66(this, void 0, void 0, function* () {
      try {
        yield task();
      } finally {
        this.advance();
      }
    });
  }
  advance() {
    if (this.state.kind !== "running") {
      throw new Error("Coalescer task settled while idle");
    }
    const pending = this.state.pending;
    if (pending === void 0) {
      this.state = { kind: "idle" };
      return;
    }
    this.state.pending = void 0;
    void this.runPending(pending);
  }
  runPending(pending) {
    return __awaiter66(this, void 0, void 0, function* () {
      try {
        yield this.runTask(pending.task);
        pending.resolve();
      } catch (err) {
        pending.reject(err);
      }
    });
  }
};
