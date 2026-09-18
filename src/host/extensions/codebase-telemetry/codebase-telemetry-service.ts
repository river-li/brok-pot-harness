function createCodebaseTelemetryService({
  auth: auth2,
  experiments,
  events,
  createAdapter,
  privacyMode,
  policies: policies2,
  logger: logger107
}) {
  let currentAdapter;
  let controller;
  let restartDelay;
  let restartPromise;
  let stopping = false;
  const host = createSandCodebaseTelemetryHost({
    auth: auth2,
    experiments,
    privacyMode,
    createAdapter: async (options2) => {
      const adapter = await createAdapter(options2);
      currentAdapter = adapter;
      void adapter.terminalFailure?.then(() => scheduleRestart(adapter));
      return adapter;
    },
    logger: logger107
  });
  controller = new CodebaseTelemetryController({ host });
  const snapshotTrigger = new CodebaseSnapshotTrigger({
    getSession: () => controller.session,
    logger: logger107
  });
  const unsubscribeFromRunStarted = events.on(
    "transcript.run-started",
    ({ requestId: requestId2 }) => snapshotTrigger.handle({ type: "AGENT_REQUEST_START", requestId: requestId2 })
  );
  const unsubscribeFromRunEnded = events.on(
    "transcript.run-ended",
    ({ requestId: requestId2 }) => snapshotTrigger.handle({ type: "AGENT_REQUEST_END", requestId: requestId2 })
  );
  function scheduleRestart(failedAdapter) {
    if (stopping || currentAdapter !== failedAdapter || restartPromise !== void 0) {
      return;
    }
    const failedController = controller;
    restartPromise = (async () => {
      await failedController.shutdown();
      if (stopping || controller !== failedController) {
        return;
      }
      const delay5 = policies2.sessionRestartDelay.schedule(1);
      restartDelay = delay5;
      try {
        await delay5.elapsed;
      } catch (error41) {
        if (stopping || controller !== failedController) {
          return;
        }
        throw error41;
      } finally {
        if (restartDelay === delay5) {
          restartDelay = void 0;
        }
        delay5.dispose();
      }
      if (!stopping && controller === failedController) {
        controller = new CodebaseTelemetryController({ host });
      }
    })().finally(() => {
      restartPromise = void 0;
    });
    void restartPromise.catch((error41) => {
      logger107.error("Failed to restart Codebase Telemetry after adapter failure", error41);
    });
  }
  let disposePromise;
  return {
    api: {
      async flushPendingUploads() {
        if (controller.session === void 0) {
          return;
        }
        await currentAdapter?.flushPendingUploads();
      }
    },
    dispose() {
      stopping = true;
      restartDelay?.dispose();
      disposePromise ??= (async () => {
        unsubscribeFromRunStarted();
        unsubscribeFromRunEnded();
        try {
          await policies2.shutdownDeadline.run(() => controller.shutdown());
        } catch (error41) {
          if (!(error41 instanceof DeadlineExceededError)) {
            throw error41;
          }
          logger107.warn("Controller shutdown exceeded its deadline", error41);
        } finally {
          host.dispose();
        }
      })();
      return disposePromise;
    }
  };
}
function createSandCodebaseTelemetryLogger(log4) {
  const write = (level, message, error41) => {
    log4(`[codebase-telemetry] ${level}: ${formatLogMessage(message, error41)}`);
  };
  return {
    error: (message, error41) => write("error", message, error41),
    warn: (message, error41) => write("warn", message, error41),
    info: (message, error41) => write("info", message, error41),
    debug: (message, error41) => write("debug", message, error41)
  };
}
