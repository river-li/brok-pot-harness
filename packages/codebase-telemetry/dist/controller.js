var __awaiter71 = function(thisArg, _arguments, P2, generator) {
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
var CodebaseTelemetryController = class {
  /**
   * Creates a controller and starts it immediately.
   */
  constructor(params) {
    this.subscriptions = new DisposableStore();
    this.mailbox = [];
    this.isDrainingMailbox = false;
    this.openAttemptResources = /* @__PURE__ */ new Map();
    this.activeSessionResources = /* @__PURE__ */ new Map();
    this.cleanupTracker = new TaskTracker();
    const { host } = params;
    this.host = host;
    this.logger = scopeLogger(createNonThrowingLogger(host.logger), "CodebaseTelemetryController");
    this.metrics = createNonThrowingMetrics(params.metrics, this.logger);
    const [sessionStateSender, sessionStateReceiver] = createWatchChannel({
      initialValue: void 0,
      onSubscriberError: (error42) => this.logger.error("Session state subscriber failed", error42)
    });
    this.sessionStateSender = sessionStateSender;
    this.sessionState = sessionStateReceiver;
    let lastAuth = host.auth.get();
    let lastPrivacyMode = host.privacyMode.get();
    this.state = createInitialControllerState(lastAuth);
    this.subscriptions.add(host.auth.subscribe(() => {
      const authPrivacy = this.readAuthPrivacyValues();
      const currentAuth = authPrivacy.auth;
      if (areAuthStatesEqual(lastAuth, currentAuth)) {
        return;
      }
      lastAuth = currentAuth;
      this.sendMessage({
        kind: "authChanged",
        authPrivacy
      });
      this.logger.info("Authentication state changed; reconciled");
    }));
    this.subscriptions.add(host.privacyMode.subscribe(() => {
      const authPrivacy = this.readAuthPrivacyValues();
      const currentPrivacyMode = authPrivacy.privacyMode;
      if (lastPrivacyMode === currentPrivacyMode) {
        return;
      }
      const previousPrivacyMode = lastPrivacyMode;
      lastPrivacyMode = currentPrivacyMode;
      this.sendMessage({
        kind: "privacyModeChanged",
        authPrivacy
      });
      this.logger.info(`Privacy mode changed from ${previousPrivacyMode} to ${currentPrivacyMode}; reconciled`);
    }));
    this.subscriptions.add(host.featureGates.changes.subscribe((change) => {
      const gates = resolveFeatureGateChange(change);
      if (gates.length === 0) {
        return;
      }
      this.logger.info(`Feature gates changed: [${gates.join(", ")}]; reconciling`);
      this.sendMessage({
        kind: "featureGatesChanged",
        mainGateChanged: gates.includes(CodebaseTelemetryFeatureGate.MAIN),
        subgateChanged: gates.some((gate) => gate !== CodebaseTelemetryFeatureGate.MAIN),
        authPrivacy: this.readAuthPrivacyValues()
      });
    }));
    this.sendMessage({
      kind: "controllerStarted",
      authPrivacy: this.readAuthPrivacyValues()
    });
  }
  /**
   * The currently active telemetry session, if any.
   */
  get session() {
    return this.activeSession;
  }
  // ── Mailbox ────────────────────────────────────────────────────────
  /**
   * Enqueues a message and starts a mailbox drain unless one is already
   * active.
   */
  sendMessage(message) {
    this.mailbox.push(message);
    this.drainMailbox();
  }
  /**
   * Processes messages in FIFO order.
   *
   * A reentrant send remains queued until processing of the current
   * message completes.
   */
  drainMailbox() {
    if (this.isDrainingMailbox) {
      return;
    }
    this.isDrainingMailbox = true;
    try {
      while (true) {
        const message = this.mailbox.shift();
        if (message === void 0) {
          break;
        }
        try {
          this.processMessage(message);
        } catch (err) {
          this.logger.error(`Failed to process controller message '${message.kind}'`, err);
        }
      }
    } finally {
      this.isDrainingMailbox = false;
    }
  }
  /**
   * Applies the message's state transition, then executes its emitted
   * commands.
   */
  processMessage(message) {
    const transition = transitionController(this.state, message);
    this.state = transition.nextState;
    for (const command of transition.commands) {
      try {
        const followUpMessage = this.executeCommand(command);
        if (followUpMessage !== void 0) {
          const wasDisposed = this.state.kind === "disposed";
          this.processMessage(followUpMessage);
          if (!wasDisposed) {
            break;
          }
        }
      } catch (err) {
        this.logger.error(`Failed to execute controller command '${command.kind}'`, err);
        const wasDisposed = this.state.kind === "disposed";
        this.processMessage({ kind: "cleanupFailed" });
        if (!wasDisposed) {
          break;
        }
      }
    }
  }
  // ── Command execution ──────────────────────────────────────────────
  /**
   * Executes a command emitted by the state machine and returns any
   * synchronous follow-up message.
   */
  executeCommand(command) {
    switch (command.kind) {
      case "checkMainGate":
        this.checkMainGate(command);
        return;
      case "beginSessionOpen":
        this.beginSessionOpen(command);
        return;
      case "updateSessionOpenAttemptAuthToken":
        this.updateSessionOpenAttemptAuthToken(command);
        return;
      case "cancelSessionOpenAttempt":
        this.cancelSessionOpenAttempt(command);
        return;
      case "activateSession":
        this.activateSession(command);
        return;
      case "rejectMismatchedSession":
        this.rejectMismatchedSession(command);
        return;
      case "closeStaleSession":
        this.closeStaleSession(command);
        return;
      case "finalizeFailedSessionOpenAttempt":
        return this.finalizeFailedSessionOpenAttempt(command);
      case "reportStaleSessionOpenFailure":
        return this.reportStaleSessionOpenFailure(command);
      case "updateActiveSessionAuthToken":
        this.updateActiveSessionAuthToken(command);
        return;
      case "reconcileSubgates":
        this.reconcileSubgates(command);
        return;
      case "invalidatePendingSubgateReconciliation":
        this.invalidatePendingSubgateReconciliation(command);
        return;
      case "closeActiveSession":
        this.closeActiveSession(command);
        return;
      case "reportTelemetryStopped":
        this.reportTelemetryStopped(command);
        return;
      case "reportSessionFailure":
        this.reportSessionFailure(command);
        return;
      case "reportAuthIdChanged":
        this.reportAuthIdChanged();
        return;
      case "finalizeControllerDisposal":
        this.finalizeControllerDisposal();
        return;
      default: {
        const _exhaustive = command;
        throw new Error(`Unexpected controller command: ${String(_exhaustive)}`);
      }
    }
  }
  /**
   * Checks whether the main feature gate is enabled and enqueues the result.
   */
  checkMainGate({ checkToken }) {
    void tryCheckFeatureGate(this.host, this.logger, CodebaseTelemetryFeatureGate.MAIN).then((enabled) => {
      this.sendMessage({
        kind: "mainGateCheckCompleted",
        checkToken,
        enabled
      });
    });
  }
  /**
   * Begins an attempt to open a telemetry session.
   */
  beginSessionOpen({ auth: auth2, openAttempt }) {
    const credentials = new SessionCredentials({
      auth: auth2,
      onSubscriberError: (error42) => this.logger.error("Auth token subscriber failed", error42)
    });
    const abortController = new AbortController();
    const completion = this.openSession(credentials, abortController.signal).then((session) => {
      this.sendMessage({
        kind: "sessionOpenSucceeded",
        openAttempt,
        session
      });
    }, (error42) => {
      if (error42 instanceof CodebaseTelemetryCleanupError) {
        this.recordCleanupFailure(error42);
      }
      this.sendMessage({
        kind: "sessionOpenFailed",
        openAttempt,
        error: error42
      });
    });
    this.openAttemptResources.set(openAttempt, {
      credentials,
      abortController,
      completion
    });
    this.incrementMetric(CodebaseTelemetrySessionMetric.OpenStarted);
    this.logger.info("Opening Codebase Telemetry session");
  }
  /**
   * Updates the auth token for an in-progress session-open attempt.
   */
  updateSessionOpenAttemptAuthToken({ openAttempt, authToken }) {
    const resources = this.requireSessionOpenAttemptResources(openAttempt);
    resources.credentials.updateAuthToken(authToken);
  }
  /**
   * Cancels a session-open attempt and releases its resources.
   */
  cancelSessionOpenAttempt({ openAttempt, reason }) {
    const resources = this.takeSessionOpenAttemptResources(openAttempt);
    this.incrementMetric(CodebaseTelemetrySessionMetric.OpenAbandoned, {
      reason
    });
    this.trackCleanup(resources.completion);
    resources.abortController.abort();
    resources.credentials.dispose();
  }
  /**
   * Activates a newly opened session, publishes its state, and starts
   * sub-gate reconciliation.
   */
  activateSession({ openAttempt, session }) {
    const { credentials } = this.takeSessionOpenAttemptResources(openAttempt);
    const subgateController = new SessionSubgateController(this.host, this.logger, session);
    const publishSessionState = () => {
      if (this.activeSession === session) {
        this.sessionStateSender.send(session.state.get());
      }
    };
    const sessionStateSubscription = session.state.subscribe(publishSessionState);
    this.activeSessionResources.set(session, {
      credentials,
      subgateController,
      sessionStateSubscription
    });
    if (session.terminalFailure !== void 0) {
      void session.terminalFailure.then((error42) => {
        this.sendMessage({ kind: "sessionFailed", session, error: error42 });
      });
    }
    this.publishSession(session);
    subgateController.reconcile();
  }
  /**
   * Starts closing a session opened for an unexpected auth identity and
   * releases its resources.
   */
  rejectMismatchedSession({ openAttempt, session }) {
    const resources = this.takeSessionOpenAttemptResources(openAttempt);
    resources.abortController.abort();
    try {
      this.closeSession(session);
    } finally {
      resources.credentials.dispose();
    }
    this.logger.error("Opened session has an unexpected auth identity");
  }
  /**
   * Starts closing a session returned after its open attempt is no longer
   * current.
   */
  closeStaleSession({ session }) {
    this.closeSession(session);
  }
  /**
   * Releases resources from a failed session-open attempt and logs the error.
   */
  finalizeFailedSessionOpenAttempt({ openAttempt, error: error42 }) {
    const { credentials } = this.takeSessionOpenAttemptResources(openAttempt);
    credentials.dispose();
    this.logger.error("Failed to open session", error42);
    return error42 instanceof CodebaseTelemetryCleanupError ? { kind: "cleanupFailed" } : void 0;
  }
  /**
   * Logs a stale session-open failure and propagates any cleanup failure.
   */
  reportStaleSessionOpenFailure({ error: error42 }) {
    if (error42 instanceof CodebaseTelemetryCleanupError) {
      this.logger.error("Failed to clean up cancelled or superseded session-open attempt", error42);
      return { kind: "cleanupFailed" };
    }
    this.logger.debug("Ignoring failure from a cancelled or superseded session-open attempt", error42);
  }
  /**
   * Updates the auth token used by the active session.
   */
  updateActiveSessionAuthToken({ session, authToken }) {
    const resources = this.activeSessionResources.get(session);
    resources === null || resources === void 0 ? void 0 : resources.credentials.updateAuthToken(authToken);
  }
  /**
   * Starts feature sub-gate reconciliation for the active session.
   */
  reconcileSubgates({ session }) {
    const resources = this.activeSessionResources.get(session);
    resources === null || resources === void 0 ? void 0 : resources.subgateController.reconcile();
  }
  /**
   * Invalidates checked and queued sub-gate work before a main-gate recheck.
   */
  invalidatePendingSubgateReconciliation({ session }) {
    const resources = this.activeSessionResources.get(session);
    resources === null || resources === void 0 ? void 0 : resources.subgateController.invalidatePending();
  }
  /**
   * Starts closing the active session, stops publishing it, and releases
   * its resources.
   */
  closeActiveSession({ session }) {
    const resources = this.activeSessionResources.get(session);
    this.activeSessionResources.delete(session);
    resources === null || resources === void 0 ? void 0 : resources.subgateController.dispose();
    try {
      this.closeSession(session);
    } finally {
      try {
        resources === null || resources === void 0 ? void 0 : resources.sessionStateSubscription.dispose();
      } finally {
        this.unpublishSession(session);
        resources === null || resources === void 0 ? void 0 : resources.credentials.dispose();
      }
    }
  }
  /**
   * Logs why the controller stopped a session or session-open attempt.
   */
  reportTelemetryStopped({ reason }) {
    switch (reason) {
      case "authUnavailable":
        this.logger.info("Stopped Codebase Telemetry because authentication became unavailable");
        return;
      case "authIdChanged":
        this.logger.info("Stopped Codebase Telemetry for the previous auth ID");
        return;
      case "privacyModeDisallowed":
        this.logger.info("Stopped Codebase Telemetry because the current privacy mode disallows it");
        return;
      case "mainGateDisabled":
        this.logger.info("Stopped Codebase Telemetry because the main feature gate was disabled");
        return;
      default: {
        const _exhaustive = reason;
        throw new Error(`Unexpected telemetry stop reason: ${String(_exhaustive)}`);
      }
    }
  }
  reportSessionFailure({ error: error42 }) {
    this.logger.error("Session adapter encountered a terminal failure", error42);
  }
  /**
   * Logs an auth ID change that triggered reconciliation.
   */
  reportAuthIdChanged() {
    this.logger.info("Auth ID changed; reconciling Codebase Telemetry");
  }
  /**
   * Disposes host subscriptions and closes the session-state channel.
   */
  finalizeControllerDisposal() {
    try {
      this.subscriptions.dispose();
    } finally {
      this.sessionStateSender.dispose();
    }
  }
  // ── Shared helpers ─────────────────────────────────────────────────
  /**
   * Reads the host's current authentication state and privacy mode.
   */
  readAuthPrivacyValues() {
    return {
      auth: this.host.auth.get(),
      privacyMode: this.host.privacyMode.get()
    };
  }
  /**
   * Returns the resources for a current session-open attempt.
   */
  requireSessionOpenAttemptResources(openAttempt) {
    const resources = this.openAttemptResources.get(openAttempt);
    if (resources === void 0) {
      throw new Error("Session-open attempt resources are missing");
    }
    return resources;
  }
  /**
   * Removes and returns the resources for a current session-open attempt.
   */
  takeSessionOpenAttemptResources(openAttempt) {
    const resources = this.requireSessionOpenAttemptResources(openAttempt);
    this.openAttemptResources.delete(openAttempt);
    return resources;
  }
  /**
   * Emits a session-lifecycle counter when a metrics sink is configured.
   */
  incrementMetric(stat28, tags) {
    var _a19;
    (_a19 = this.metrics) === null || _a19 === void 0 ? void 0 : _a19.increment(stat28, 1, tags);
  }
  /**
   * Opens and initializes a new session once all prior cleanup has completed
   * successfully.
   */
  openSession(credentials, signal) {
    return __awaiter71(this, void 0, void 0, function* () {
      yield this.cleanupTracker.drain(signal);
      if (this.cleanupFailure !== void 0) {
        throw this.cleanupFailure;
      }
      return CodebaseTelemetrySession.open({
        credentials,
        host: this.host,
        logger: this.logger,
        signal
      });
    });
  }
  /**
   * Starts closing a session and tracks the resulting cleanup.
   */
  closeSession(session) {
    const cleanupTask = session.close().then((result) => {
      if (result.kind === "closed") {
        return;
      }
      const cleanupError = new CodebaseTelemetryCleanupError(result.errors, "Session cleanup failed");
      this.recordCleanupFailure(cleanupError);
      this.logger.error("Failed to close session", cleanupError);
      this.sendMessage({ kind: "cleanupFailed" });
    });
    this.trackCleanup(cleanupTask);
  }
  /**
   * Marks a session as active and publishes its current state.
   */
  publishSession(session) {
    this.activeSession = session;
    this.sessionStateSender.send(session.state.get());
  }
  /**
   * Stops publishing a session if it is still the active session.
   */
  unpublishSession(session) {
    if (this.activeSession !== session) {
      return;
    }
    this.activeSession = void 0;
    this.sessionStateSender.send(void 0);
  }
  /**
   * Tracks cleanup work that must settle before the controller opens
   * another session or completes shutdown.
   *
   * Any failure is recorded before the tracked promise settles, so
   * {@link CodebaseTelemetryController.cleanupFailure} is up to date
   * when a drain completes.
   */
  trackCleanup(cleanupTask) {
    this.cleanupTracker.add(cleanupTask.catch((error42) => {
      const cleanupError = error42 instanceof CodebaseTelemetryCleanupError ? error42 : new CodebaseTelemetryCleanupError([error42], "Codebase telemetry cleanup failed");
      this.logger.error("Unexpected cleanup failure", cleanupError);
      this.recordCleanupFailure(cleanupError);
      this.sendMessage({ kind: "cleanupFailed" });
    }));
  }
  /**
   * Records the first cleanup failure.
   *
   * The controller then fails closed. No later session may open because
   * the failed cleanup may have left resources active.
   */
  recordCleanupFailure(error42) {
    var _a19;
    (_a19 = this.cleanupFailure) !== null && _a19 !== void 0 ? _a19 : this.cleanupFailure = error42;
  }
  /**
   * Stops the controller and begins cleaning up its resources.
   *
   * Use {@link CodebaseTelemetryController.shutdown} to await cleanup.
   */
  dispose() {
    if (this.state.kind === "disposed") {
      return;
    }
    this.sendMessage({ kind: "disposalRequested" });
  }
  /**
   * Stops the controller and waits for all initiated cleanup to settle.
   *
   * Cleanup failures are logged rather than thrown.
   */
  shutdown() {
    return __awaiter71(this, void 0, void 0, function* () {
      this.dispose();
      yield this.cleanupTracker.drain();
    });
  }
};
function createNonThrowingMetrics(metrics2, logger108) {
  if (metrics2 === void 0) {
    return void 0;
  }
  return {
    increment(stat28, value, tags) {
      try {
        metrics2.increment(stat28, value, tags);
      } catch (error42) {
        logger108.debug("Failed to emit codebase telemetry counter", error42);
      }
    }
  };
}
var SessionSubgateController = class {
  constructor(host, logger108, session) {
    this.host = host;
    this.logger = logger108;
    this.session = session;
    this.coalescer = new Coalescer();
    this.isDisposed = false;
  }
  /**
   * Checks all feature sub-gates and schedules the latest result.
   */
  reconcile() {
    if (this.isDisposed) {
      return;
    }
    const checkToken = /* @__PURE__ */ Symbol("subgateCheck");
    this.latestCheckToken = checkToken;
    void Promise.all([
      tryCheckFeatureGate(this.host, this.logger, CodebaseTelemetryFeatureGate.GIT_HISTORY),
      tryCheckFeatureGate(this.host, this.logger, CodebaseTelemetryFeatureGate.AGENT_DOT_DIRS),
      tryCheckFeatureGate(this.host, this.logger, CodebaseTelemetryFeatureGate.CODEBASE_PROTECTION_ENFORCEMENT)
    ]).then(([gitHistory, agentDotDirs, codebaseProtectionEnforcement]) => {
      if (this.latestCheckToken !== checkToken) {
        return;
      }
      this.scheduleReconciliation(checkToken, {
        gitHistory,
        agentDotDirs,
        codebaseProtectionEnforcement
      });
    }).catch((err) => {
      if (this.latestCheckToken === checkToken) {
        this.logger.error("Failed to check feature sub-gates", err);
      }
    });
  }
  /**
   * Schedules checked feature-gate values for serialized reconciliation.
   */
  scheduleReconciliation(checkToken, gates) {
    void this.coalescer.run(() => __awaiter71(this, void 0, void 0, function* () {
      if (this.isDisposed || this.latestCheckToken !== checkToken) {
        return;
      }
      yield this.session.reconcileFeatureGates(gates);
    })).catch((err) => {
      if (!this.isDisposed && this.latestCheckToken === checkToken) {
        this.logger.error("Failed to reconcile feature sub-gates", err);
      }
    });
  }
  /**
   * Invalidates gate checks and queued reconciliation without interrupting
   * work that has already entered the session.
   */
  invalidatePending() {
    this.latestCheckToken = void 0;
  }
  /**
   * Invalidates outstanding checks and pending reconciliation.
   */
  dispose() {
    this.isDisposed = true;
    this.latestCheckToken = void 0;
  }
};
function areAuthStatesEqual(left, right) {
  return (left === null || left === void 0 ? void 0 : left.authId) === (right === null || right === void 0 ? void 0 : right.authId) && (left === null || left === void 0 ? void 0 : left.authToken) === (right === null || right === void 0 ? void 0 : right.authToken);
}
function tryCheckFeatureGate(host, logger108, gate) {
  return __awaiter71(this, void 0, void 0, function* () {
    try {
      return yield host.featureGates.check(gate);
    } catch (err) {
      logger108.warn(`Failed to evaluate feature gate ${gate}`, err);
      return void 0;
    }
  });
}
