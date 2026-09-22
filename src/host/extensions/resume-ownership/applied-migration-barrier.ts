init_errors();
init_invariant();
var AppliedMigrationBarrier = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  activeOperationId;
  async prepare() {
    try {
      const operation = await this.deps.readOperation();
      if (operation === void 0) return { kind: "none" };
      this.deps.retainOperation(operation);
      return { kind: "ready", operation };
    } catch (error42) {
      return { kind: "failed", errorClass: errorLogTag(error42) };
    }
  }
  async run(prepared, signal) {
    if (prepared.kind === "none") return "absent";
    if (prepared.kind === "failed") {
      this.deps.log(
        `[sand:resume-ownership] applied host operation unavailable (${prepared.errorClass})`
      );
      return "deferred";
    }
    invariant(
      this.activeOperationId === void 0,
      "settled-host migration window is already active"
    );
    const operation = prepared.operation;
    this.activeOperationId = operation.operationId;
    try {
      let state;
      try {
        state = await this.deps.runWindow(operation, signal);
      } catch (error42) {
        signal.throwIfAborted();
        this.deps.log(
          `[sand:resume-ownership] harness migration abandoned (${errorLogTag(error42)})`
        );
        return await this.abandon(operation, signal, true);
      }
      if (state === "pending") return "deferred";
      if (state === "abandoned" || state === "abandoned_after_drain") {
        return await this.abandon(operation, signal, state === "abandoned_after_drain");
      }
      await this.deps.releaseOperation(operation.operationId);
      return "terminal";
    } finally {
      if (this.activeOperationId === operation.operationId) {
        this.activeOperationId = void 0;
      }
    }
  }
  async abandon(operation, signal, drain) {
    this.activeOperationId = void 0;
    if (drain) await this.deps.waitForCutoverDrain(signal);
    await this.deps.releaseOperation(operation.operationId);
    return "abandoned";
  }
  getWindow() {
    const operationId = this.activeOperationId;
    if (operationId === void 0) return { kind: "inactive" };
    if (this.deps.isLocalWorkAllowed()) {
      return { kind: "active", operationId, status: "fence_open" };
    }
    return {
      kind: "active",
      operationId,
      status: this.deps.isQuiescent() ? "ready" : "busy"
    };
  }
};
