init_cursor_token();
var SAND_CODEBASE_TELEMETRY_FEATURE_GATE = "sand_codebase_telemetry";
function createSandCodebaseTelemetryHost({
  auth: auth2,
  experiments,
  privacyMode,
  createAdapter,
  logger: logger108
}) {
  const disposables = new DisposableStore();
  const authSource = disposables.add(createAuthSource({ auth: auth2, logger: logger108 }));
  const privacyModeSource = createPrivacyModeSource(authSource.receiver, privacyMode);
  const featureGates = disposables.add(createFeatureGateSource({ experiments, logger: logger108 }));
  const desiredCodebases = {
    changes: {
      subscribe: () => ({ dispose: () => {
      } })
    },
    get: () => [
      { path: SAND_BOX_WORKSPACE_ROOT, kind: CodebaseKind.WORKSPACE_ROOT },
      { path: SAND_BOX_HOME_DIR, kind: CodebaseKind.HOME_DIRECTORY }
    ]
  };
  return {
    logger: logger108,
    auth: authSource.receiver,
    privacyMode: privacyModeSource,
    featureGates: featureGates.receiver,
    desiredCodebases,
    createAdapter,
    dispose() {
      disposables.dispose();
    }
  };
}
function createAuthSource({
  auth: auth2,
  logger: logger108
}) {
  const [sender, receiver] = createWatchChannel({
    initialValue: void 0,
    onSubscriberError: (error42) => logger108.error("Authentication subscriber failed", error42)
  });
  const clearCredential = () => {
    if (receiver.get() === void 0) {
      return;
    }
    sender.send(void 0);
  };
  const pushCredential = () => {
    const currentAuth = receiver.get();
    const accessToken = auth2.peekAccessToken();
    if (accessToken === null || accessToken.length === 0) {
      clearCredential();
      return;
    }
    const authId = parseJwtPayload(accessToken)?.sub;
    if (authId === void 0 || authId.length === 0) {
      logger108.warn("Credential has no usable subject claim");
      clearCredential();
      return;
    }
    const nextAuth = { authId, authToken: accessToken };
    if (currentAuth?.authId === authId && currentAuth.authToken === accessToken) {
      return;
    }
    sender.send(nextAuth);
  };
  const unsubscribeFromRenewal = auth2.subscribeToRenewal((event) => {
    const accessToken = auth2.peekAccessToken();
    if (event.outcome === "renewed" || accessToken === null || accessToken.length === 0) {
      pushCredential();
    }
  });
  pushCredential();
  return {
    receiver,
    dispose() {
      unsubscribeFromRenewal();
      sender.dispose();
    }
  };
}
function createPrivacyModeSource(auth2, privacyModeApi) {
  const get = () => {
    const currentAuth = auth2.get();
    const privacyModeState = privacyModeApi.get();
    if (currentAuth === void 0 || privacyModeState.kind !== "resolved" || privacyModeState.authId !== currentAuth.authId) {
      return PrivacyMode3.UNSPECIFIED;
    }
    return toPrivacyMode(privacyModeState.privacyMode);
  };
  return {
    get,
    subscribe(listener) {
      let previous = get();
      const notifyIfChanged = () => {
        const next = get();
        if (next === previous) {
          return;
        }
        previous = next;
        listener();
      };
      const authSubscription = auth2.subscribe(notifyIfChanged);
      const unsubscribeFromPrivacyMode = privacyModeApi.subscribe(notifyIfChanged);
      return {
        dispose() {
          authSubscription.dispose();
          unsubscribeFromPrivacyMode();
        }
      };
    }
  };
}
function createFeatureGateSource({
  experiments,
  logger: logger108
}) {
  const [sender, changes] = createEventChannel({
    onSubscriberError: (error42) => logger108.error("Feature gate subscriber failed", error42)
  });
  let lastMainGateValue = readMainGate(experiments);
  const unsubscribe = experiments.subscribe(() => {
    const nextMainGateValue = readMainGate(experiments);
    if (nextMainGateValue !== lastMainGateValue) {
      lastMainGateValue = nextMainGateValue;
      sender.send({
        kind: "some",
        gates: [CodebaseTelemetryFeatureGate.MAIN]
      });
    }
  });
  return {
    receiver: {
      changes,
      async check(gate) {
        switch (gate) {
          case CodebaseTelemetryFeatureGate.MAIN:
            return await experiments.checkGate(SAND_CODEBASE_TELEMETRY_FEATURE_GATE, {
              disableExposureLog: true
            });
          case CodebaseTelemetryFeatureGate.GIT_HISTORY:
          case CodebaseTelemetryFeatureGate.AGENT_DOT_DIRS:
          case CodebaseTelemetryFeatureGate.CODEBASE_PROTECTION_ENFORCEMENT:
            return false;
        }
      }
    },
    dispose() {
      unsubscribe();
      sender.dispose();
    }
  };
}
function readMainGate(experiments) {
  return experiments.checkFeatureGate(SAND_CODEBASE_TELEMETRY_FEATURE_GATE, {
    disableExposureLog: true
  });
}
