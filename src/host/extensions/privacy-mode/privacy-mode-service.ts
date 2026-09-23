init_scheduling();
init_privacy_mode_pb();
init_esm2();
init_cursor_token();
function createPrivacyModeService({
  auth: auth2,
  load: load2,
  policies: policies2,
  clock,
  logger: logger110
}) {
  let activeAuth;
  let activeRefresh;
  let generation = 0;
  let disposed = false;
  const [observationSender, observationReceiver] = createWatchChannel({
    initialValue: {
      kind: "unresolved",
      authId: null
    },
    onSubscriberError: (error42) => logger110.error("Privacy mode subscriber failed", error42)
  });
  const publish = (next) => {
    const current = observationReceiver.get();
    if (next.kind === "unresolved" && current.kind === "unresolved" && next.authId === current.authId) {
      return;
    }
    observationSender.send(next);
  };
  const refresh = async () => {
    const auth3 = activeAuth;
    if (auth3 === void 0 || disposed) {
      return;
    }
    const refreshGeneration = ++generation;
    activeRefresh?.abort();
    const refreshController = new AbortController();
    activeRefresh = refreshController;
    try {
      const value = await policies2.lookupRetry.runWithRetry(
        (_attempt, retrySignal) => policies2.lookupDeadline.run((signal) => load2({ auth: auth3, signal }), retrySignal),
        refreshController.signal
      );
      if (!disposed && refreshGeneration === generation) {
        publish({
          kind: "resolved",
          authId: auth3.authId,
          privacyMode: toPrivacyMode2(value),
          observedAtMs: clock.now()
        });
      }
    } catch (error42) {
      if (!disposed && refreshGeneration === generation) {
        logger110.warn("Privacy mode lookup failed", error42);
      }
    } finally {
      if (activeRefresh === refreshController) {
        activeRefresh = void 0;
      }
    }
  };
  const reconcileAuth = () => {
    const nextAuth = readAuth(auth2.peekAccessToken(), logger110);
    if (nextAuth?.authId === activeAuth?.authId && nextAuth?.authToken === activeAuth?.authToken) {
      return;
    }
    const identityChanged = nextAuth?.authId !== activeAuth?.authId;
    activeAuth = nextAuth;
    if (nextAuth === void 0) {
      generation++;
      activeRefresh?.abort();
      activeRefresh = void 0;
      publish({ kind: "unresolved", authId: null });
      return;
    }
    if (identityChanged) {
      generation++;
      publish({ kind: "unresolved", authId: nextAuth.authId });
    }
    void refresh();
  };
  const unsubscribeFromRenewal = auth2.subscribeToRenewal((event) => {
    const accessToken = auth2.peekAccessToken();
    if (event.outcome === "renewed" || accessToken === null || accessToken.length === 0) {
      reconcileAuth();
    }
  });
  const polling = policies2.refreshPolling.start(refresh);
  reconcileAuth();
  return {
    get: () => observationReceiver.get(),
    subscribe(listener) {
      const subscription = observationReceiver.subscribe(listener);
      return () => subscription.dispose();
    },
    dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      generation++;
      unsubscribeFromRenewal();
      activeRefresh?.abort();
      activeRefresh = void 0;
      polling.dispose();
      observationSender.dispose();
    }
  };
}
function createPrivacyModeLogger(log5) {
  const write2 = (level, message, error42) => {
    log5(`[privacy-mode] ${level}: ${formatLogMessage(message, error42)}`);
  };
  return {
    error: (message, error42) => write2("error", message, error42),
    warn: (message, error42) => write2("warn", message, error42)
  };
}
function isRetryablePrivacyModeLookupError(error42) {
  return error42 instanceof DeadlineExceededError || error42 instanceof ConnectError && (error42.code === Code.DeadlineExceeded || error42.code === Code.Unavailable && !error42.metadata.has("retry-after"));
}
function readAuth(accessToken, logger110) {
  if (accessToken === null || accessToken.length === 0) {
    return void 0;
  }
  const authId = parseJwtPayload(accessToken)?.sub;
  if (authId === void 0 || authId.length === 0) {
    logger110.warn("Credential has no usable subject claim");
    return void 0;
  }
  return { authId, authToken: accessToken };
}
function toPrivacyMode2(value) {
  switch (value) {
    case PrivacyMode.NO_STORAGE:
    case PrivacyMode.NO_TRAINING:
    case PrivacyMode.USAGE_DATA_TRAINING_ALLOWED:
    case PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED:
      return value;
    default:
      return PrivacyMode.UNSPECIFIED;
  }
}
