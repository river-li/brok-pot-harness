init_invariant();
var UNBOUND_EXECUTION_MESSAGE = "Sand turn execution is not bound: the host asked for a runner before the composition root handed the turn-execution extension its executor.";
var DOUBLE_BIND_MESSAGE = "Sand turn execution is already bound: a second executor would mint a second runner for the same agent.";
var TurnExecutionRegistry = class {
  executor;
  localWorkAllowed = true;
  get canExecute() {
    return this.executor !== void 0;
  }
  get isLocalWorkAllowed() {
    return this.localWorkAllowed;
  }
  setLocalWorkAllowed(allowed) {
    this.localWorkAllowed = allowed;
  }
  bindExecutor(executor) {
    invariant(this.executor === void 0, DOUBLE_BIND_MESSAGE);
    this.executor = executor;
  }
  async isRunReady() {
    if (this.executor === void 0 || !this.localWorkAllowed) return false;
    return await this.executor.isInferenceReady();
  }
  createRunner(session, hooks) {
    return this.require().createRunner(session, hooks);
  }
  createGroupMemberRunner(session, hooks) {
    return this.require().createGroupMemberRunner(session, hooks);
  }
  require() {
    invariant(this.executor !== void 0, UNBOUND_EXECUTION_MESSAGE);
    return this.executor;
  }
};
