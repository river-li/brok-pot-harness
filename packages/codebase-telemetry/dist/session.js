var __awaiter67 = function(thisArg, _arguments, P2, generator) {
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
var CodebaseTelemetrySession = class _CodebaseTelemetrySession {
  /**
   * Opens and initializes a session.
   *
   * If opening fails or is aborted, the method attempts to release all
   * acquired resources before rejecting.
   */
  static open(_a19) {
    return __awaiter67(this, arguments, void 0, function* ({ credentials, host, logger: logger107, signal }) {
      signal.throwIfAborted();
      const adapter = yield host.createAdapter({ credentials, signal });
      let session;
      try {
        session = new _CodebaseTelemetrySession({
          authId: credentials.authId,
          host,
          adapter,
          logger: logger107
        });
      } catch (err) {
        let closeResult;
        try {
          closeResult = yield adapter.close();
        } catch (cleanupErr) {
          closeResult = { kind: "cleanupFailed", errors: [cleanupErr] };
        }
        if (closeResult.kind === "cleanupFailed") {
          throw new CodebaseTelemetryCleanupError(closeResult.errors, "Session-open cleanup failed", { cause: err });
        }
        throw err;
      }
      try {
        yield rejectWhenAborted2(signal, () => session.initializeOrRejectOnTerminalFailure());
        return session;
      } catch (err) {
        const closeResult = yield session.close();
        if (closeResult.kind === "cleanupFailed") {
          throw new CodebaseTelemetryCleanupError(closeResult.errors, "Session-open cleanup failed", { cause: err });
        }
        throw err;
      }
    });
  }
  /**
   * Constructs an uninitialized session.
   *
   * {@link CodebaseTelemetrySession.open} completes initialization and
   * handles cleanup if it fails.
   */
  constructor({ authId, host, adapter, logger: logger107 }) {
    this.disposables = new DisposableStore();
    this.coalescer = new Coalescer();
    this.featureGates = INITIAL_FEATURE_GATE_STATE;
    this.authId = authId;
    this.host = host;
    this.adapter = adapter;
    this.logger = logger107;
    this.terminalFailure = adapter.terminalFailure;
    const [stateSender, stateReceiver] = createWatchChannel({
      initialValue: this.readState(),
      onSubscriberError: (error41) => this.logger.error("Session state subscriber failed", error41)
    });
    this.stateSender = stateSender;
    this.state = stateReceiver;
    this.disposables.add(stateSender);
  }
  /**
   * Initializes the session, rejecting if its adapter reports a terminal
   * failure first.
   */
  initializeOrRejectOnTerminalFailure() {
    const initialization = this.initialize();
    if (this.terminalFailure === void 0) {
      return initialization;
    }
    return Promise.race([
      initialization,
      this.terminalFailure.then((error41) => {
        throw error41;
      })
    ]);
  }
  /**
   * Initializes the session before it is exposed to callers.
   */
  initialize() {
    return __awaiter67(this, void 0, void 0, function* () {
      this.disposables.add(this.host.desiredCodebases.changes.subscribe(() => {
        void this.applyDesiredCodebases().catch((error41) => {
          if (this.isActive()) {
            this.logger.error("Failed to apply desired codebases", error41);
          }
        });
      }));
      yield this.applyDesiredCodebases();
      this.disposables.add(this.adapter.state.subscribe(() => this.publishState()));
      this.publishState();
    });
  }
  /**
   * Reconciles optional telemetry features with the supplied gate values.
   *
   * Unavailable gate values preserve their current state.
   */
  reconcileFeatureGates(values) {
    return __awaiter67(this, void 0, void 0, function* () {
      if (!this.isActive()) {
        return;
      }
      this.featureGates = mergeFeatureGateValues(this.featureGates, values);
      const results = yield Promise.allSettled([
        this.adapter.reconcileFeatureGates(values),
        this.applyDesiredCodebases()
      ]);
      const errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
      if (errors.length > 0) {
        throw new AggregateError(errors, "Failed to reconcile Codebase Telemetry feature gates");
      }
    });
  }
  /**
   * Returns the current session state.
   *
   * Its tracked codebases are included only while snapshot storage remains
   * within budget.
   *
   * DFTODO: Revisit the layering here.
   */
  readState() {
    const adapterState = this.adapter.state.get();
    return {
      authId: this.authId,
      trackedCodebases: adapterState.isWithinStorageBudget ? adapterState.trackedCodebases : []
    };
  }
  /**
   * Applies desired codebases serially, coalescing pending updates.
   */
  applyDesiredCodebases() {
    return this.coalescer.run(() => __awaiter67(this, void 0, void 0, function* () {
      if (!this.isActive()) {
        return;
      }
      yield this.adapter.setDesiredCodebases(this.host.desiredCodebases.get(this.featureGates));
    }));
  }
  /**
   * Publishes the current session state while the session is active.
   */
  publishState() {
    if (this.isActive()) {
      this.stateSender.send(this.readState());
    }
  }
  /**
   * Captures a snapshot of all currently tracked codebases.
   */
  snapshot(reason) {
    return __awaiter67(this, void 0, void 0, function* () {
      if (!this.isActive()) {
        return;
      }
      yield this.adapter.snapshot(reason);
    });
  }
  /**
   * Runs one Git history capture cycle.
   */
  runGitHistoryCapture() {
    return __awaiter67(this, void 0, void 0, function* () {
      if (!this.isActive()) {
        return;
      }
      yield this.adapter.runGitHistoryCapture();
    });
  }
  /**
   * Closes the session and attempts to release all owned resources.
   *
   * The first call stops accepting new work synchronously and initiates
   * resource cleanup. Subsequent calls return the same promise, so this
   * method is intentionally not `async`.
   */
  close() {
    if (this.closePromise !== void 0) {
      return this.closePromise;
    }
    this.closePromise = Promise.resolve().then(() => this.releaseResources());
    return this.closePromise;
  }
  /**
   * Attempts to release every session resource, collecting all failures in
   * the result.
   */
  releaseResources() {
    return __awaiter67(this, void 0, void 0, function* () {
      const errors = [];
      try {
        this.disposables.dispose();
      } catch (err) {
        errors.push(err);
      }
      try {
        const closeResult = yield this.adapter.close();
        if (closeResult.kind === "cleanupFailed") {
          errors.push(...closeResult.errors);
        }
      } catch (err) {
        errors.push(err);
      }
      const nonEmptyErrors = toNonEmptyErrors(errors);
      return nonEmptyErrors === void 0 ? { kind: "closed" } : { kind: "cleanupFailed", errors: nonEmptyErrors };
    });
  }
  /**
   * Returns whether the session is accepting work.
   */
  isActive() {
    return this.closePromise === void 0;
  }
  /**
   * Starts closing the session without waiting for cleanup to finish.
   */
  dispose() {
    void this.close().catch((error41) => {
      this.logger.error("Failed to close session", error41);
    });
  }
};
var SessionCredentials = class {
  /**
   * Initializes the credentials from the supplied authentication state.
   */
  constructor({ auth: auth2, onSubscriberError }) {
    this.isDisposed = false;
    const [authTokenSender, authTokenReceiver] = createWatchChannel({
      initialValue: auth2.authToken,
      onSubscriberError
    });
    this.authId = auth2.authId;
    this.authToken = authTokenReceiver;
    this.authTokenSender = authTokenSender;
  }
  /**
   * Updates the auth token and notifies subscribers if its value changes.
   */
  updateAuthToken(authToken) {
    if (this.isDisposed || authToken === this.authToken.get()) {
      return;
    }
    this.authTokenSender.send(authToken);
  }
  /**
   * Stops future token updates and removes all token subscribers.
   */
  dispose() {
    if (this.isDisposed) {
      return;
    }
    this.isDisposed = true;
    this.authTokenSender.dispose();
  }
};
