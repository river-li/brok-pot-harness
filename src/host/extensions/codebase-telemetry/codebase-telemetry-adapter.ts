init_scheduling();
init_errors();
var CsnapsCodebaseTelemetryAdapter = class _CsnapsCodebaseTelemetryAdapter {
  state;
  stateSender;
  terminalFailure;
  closePromise;
  static async create({
    credentials,
    paths,
    backendUrl,
    csnapsBinPath,
    spawnCsnaps: spawnCsnaps2,
    uploadPolling,
    createUploadCredentials,
    logger: logger108,
    signal
  }) {
    const { handle: csnaps, initialState } = await spawnCsnaps2({
      executablePath: csnapsBinPath,
      initializeParams: {
        authId: credentials.authId,
        codebaseUuidStatePath: paths.codebaseUuidStatePath,
        snapshotsBaseDir: paths.snapshotsBaseDir,
        environment: CodebaseEnvironment.SAND_BOX,
        backendUrl
      },
      deadlines: {
        ping: createDeadlinePolicy({
          name: "csnaps-ping",
          timeoutMs: 1e4
        }),
        initialize: createDeadlinePolicy({
          name: "csnaps-initialize",
          timeoutMs: 2 * 60 * 1e3
        }),
        getState: createDeadlinePolicy({
          name: "csnaps-get-state",
          timeoutMs: 1e4
        }),
        applyCodebaseSpecs: createDeadlinePolicy({
          name: "csnaps-apply-codebase-specs",
          timeoutMs: 10 * 60 * 1e3
        }),
        snapshot: createDeadlinePolicy({
          name: "csnaps-snapshot",
          timeoutMs: 10 * 60 * 1e3
        }),
        triggerUpload: createDeadlinePolicy({
          name: "csnaps-trigger-upload",
          timeoutMs: 3e4
        }),
        flushPendingUploads: createDeadlinePolicy({
          name: "csnaps-flush-pending-uploads",
          timeoutMs: 30 * 60 * 1e3
        }),
        shutdown: createDeadlinePolicy({
          name: "csnaps-shutdown",
          timeoutMs: 1e3
        }),
        exit: createDeadlinePolicy({
          name: "csnaps-exit",
          timeoutMs: 500
        })
      },
      signal
    });
    try {
      return new _CsnapsCodebaseTelemetryAdapter({
        csnaps,
        authId: credentials.authId,
        initialState,
        uploadPolling,
        createUploadCredentials,
        logger: logger108
      });
    } catch (error42) {
      try {
        await csnaps.close();
      } catch (cleanupError) {
        throw new CodebaseTelemetryCleanupError(
          [cleanupError],
          "Failed to clean up csnaps after adapter creation failure",
          { cause: error42 }
        );
      }
      throw error42;
    }
  }
  constructor({
    csnaps,
    authId,
    initialState,
    uploadPolling,
    createUploadCredentials,
    logger: logger108
  }) {
    this.csnaps = csnaps;
    this.authId = authId;
    this.logger = logger108;
    this.uploadPollingPolicy = uploadPolling;
    this.createUploadCredentials = createUploadCredentials;
    [this.stateSender, this.state] = createWatchChannel({
      initialValue: toAdapterState(authId, initialState),
      onSubscriberError: (error42) => logger108.error("Adapter state subscriber failed", error42)
    });
    const terminalFailure = Promise.withResolvers();
    this.terminalFailure = terminalFailure.promise;
    void csnaps.terminalFailure.then((error42) => {
      if (this.isDisposed) {
        return;
      }
      this.stateSender.send({
        trackedCodebases: [],
        isWithinStorageBudget: false
      });
      terminalFailure.resolve(error42);
    });
  }
  csnaps;
  authId;
  logger;
  uploadPollingPolicy;
  createUploadCredentials;
  uploadPolling;
  nextStateRequestSequence = 0;
  latestPublishedStateRequestSequence = 0;
  async reconcileFeatureGates(_values) {
  }
  async setDesiredCodebases(codebases) {
    if (this.isDisposed) {
      return;
    }
    const stateRequestSequence = ++this.nextStateRequestSequence;
    const result = await this.csnaps.applyCodebaseSpecs(codebases);
    if (this.isDisposed) {
      return;
    }
    if (result.rejected.length > 0) {
      throw new CsnapsAdapterError("csnaps rejected a required codebase");
    }
    this.publishState(stateRequestSequence, result.state);
    this.uploadPolling ??= this.uploadPollingPolicy.start(() => this.runUploadPoll());
  }
  snapshot(reason) {
    if (this.isDisposed) {
      return Promise.resolve();
    }
    return this.csnaps.snapshot(reason);
  }
  async runGitHistoryCapture() {
  }
  async flushPendingUploads() {
    if (this.isDisposed) {
      return;
    }
    const credentials = await this.createUploadCredentials();
    if (this.isDisposed) {
      return;
    }
    await this.csnaps.flushPendingUploads(credentials);
  }
  close() {
    if (this.closePromise !== void 0) {
      return this.closePromise;
    }
    this.closePromise = Promise.resolve().then(() => this.releaseResources());
    return this.closePromise;
  }
  dispose() {
    void this.close().then(
      (result) => {
        if (result.kind === "cleanupFailed") {
          this.logger.error(
            "Failed to close adapter",
            new CodebaseTelemetryCleanupError(result.errors, "Failed to release adapter resources")
          );
        }
      },
      (error42) => this.logger.error("Failed to close adapter", error42)
    );
  }
  async releaseResources() {
    const errors = [];
    try {
      this.uploadPolling?.dispose();
    } catch (error42) {
      errors.push(error42);
    }
    try {
      await this.csnaps.close();
    } catch (error42) {
      errors.push(error42);
    }
    try {
      this.stateSender.dispose();
    } catch (error42) {
      errors.push(error42);
    }
    const cleanupErrors = toNonEmptyErrors(errors);
    return cleanupErrors === void 0 ? { kind: "closed" } : { kind: "cleanupFailed", errors: cleanupErrors };
  }
  get isDisposed() {
    return this.closePromise !== void 0;
  }
  async runUploadPoll() {
    await Promise.all([this.refreshState(), this.triggerUpload()]);
  }
  async refreshState() {
    if (this.isDisposed) {
      return;
    }
    const stateRequestSequence = ++this.nextStateRequestSequence;
    try {
      const state = await this.csnaps.getState();
      if (this.isDisposed) {
        return;
      }
      this.publishState(stateRequestSequence, state);
    } catch (error42) {
      if (!this.isDisposed) {
        this.logger.warn("Failed to refresh snapshot service state", error42);
      }
    }
  }
  publishState(stateRequestSequence, state) {
    if (stateRequestSequence <= this.latestPublishedStateRequestSequence) {
      return;
    }
    this.latestPublishedStateRequestSequence = stateRequestSequence;
    this.stateSender.send(toAdapterState(this.authId, state));
  }
  async triggerUpload() {
    if (this.isDisposed) {
      return;
    }
    try {
      const credentials = await this.createUploadCredentials();
      if (this.isDisposed) {
        return;
      }
      await this.csnaps.triggerUpload(credentials);
    } catch (error42) {
      if (!this.isDisposed) {
        this.logger.warn("Failed to trigger snapshot upload", error42);
      }
    }
  }
};
var CsnapsAdapterError = class extends SandDomainError {
  name = "CsnapsAdapterError";
};
function toAdapterState(authId, state) {
  return {
    trackedCodebases: state.tracked.map((codebase) => toCodebase(authId, codebase)),
    isWithinStorageBudget: state.isWithinStorageBudget
  };
}
function toCodebase(authId, codebase) {
  if (!isCodebaseKind(codebase.kind) || !isCodebaseEnvironment(codebase.environment)) {
    throw new CsnapsAdapterError("csnaps returned an invalid codebase classification");
  }
  if (codebase.kind !== CodebaseKind.WORKSPACE_ROOT && codebase.kind !== CodebaseKind.HOME_DIRECTORY || codebase.environment !== CodebaseEnvironment.SAND_BOX) {
    throw new CsnapsAdapterError("csnaps returned a codebase outside Sand");
  }
  return {
    codebaseUuid: codebase.codebaseUuid,
    authId,
    path: codebase.path,
    kind: codebase.kind,
    environment: codebase.environment
  };
}
