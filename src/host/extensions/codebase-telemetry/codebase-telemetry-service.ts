function createCodebaseTelemetryService({
  auth: auth2,
  experiments,
  events,
  createAdapter,
  privacyMode,
  policies: policies2,
  logger: logger108
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
    logger: logger108
  });
  controller = new CodebaseTelemetryController({ host });
  const snapshotTrigger = new CodebaseSnapshotTrigger({
    getSession: () => controller.session,
    logger: logger108
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
      } catch (error42) {
        if (stopping || controller !== failedController) {
          return;
        }
        throw error42;
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
    void restartPromise.catch((error42) => {
      logger108.error("Failed to restart Codebase Telemetry after adapter failure", error42);
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
        } catch (error42) {
          if (!(error42 instanceof DeadlineExceededError)) {
            throw error42;
          }
          logger108.warn("Controller shutdown exceeded its deadline", error42);
        } finally {
          host.dispose();
        }
      })();
      return disposePromise;
    }
  };
}
function createSandCodebaseTelemetryLogger(log4) {
  const write2 = (level, message, error42) => {
    log4(`[codebase-telemetry] ${level}: ${formatLogMessage(message, error42)}`);
  };
  return {
    error: (message, error42) => write2("error", message, error42),
    warn: (message, error42) => write2("warn", message, error42),
    info: (message, error42) => write2("info", message, error42),
    debug: (message, error42) => write2("debug", message, error42)
  };
}
