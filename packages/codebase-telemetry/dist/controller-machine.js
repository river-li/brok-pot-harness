/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/codebase-telemetry/dist/controller-machine.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createInitialControllerState(auth2) {
  return { kind: "inactive", auth: auth2 };
}
function transitionController(state, message) {
  switch (message.kind) {
    case "controllerStarted":
      return reconcileEligibility(state, message.authPrivacy);
    case "authChanged":
      return handleAuthChanged(state, message.authPrivacy);
    case "privacyModeChanged":
      return reconcileEligibility(state, message.authPrivacy);
    case "featureGatesChanged":
      return handleFeatureGatesChanged(state, message);
    case "mainGateCheckCompleted":
      return handleMainGateCheckCompleted(state, message);
    case "sessionOpenSucceeded":
      return handleSessionOpenSucceeded(state, message);
    case "sessionOpenFailed":
      return handleSessionOpenFailed(state, message);
    case "sessionFailed":
      return handleSessionFailed(state, message);
    case "disposalRequested":
      return handleDisposalRequested(state);
    case "cleanupFailed":
      return handleCleanupFailed(state);
    default: {
      const _exhaustive = message;
      return _exhaustive;
    }
  }
}
function reconcileEligibility(state, { auth: auth2, privacyMode }, options2 = {}) {
  const { precedingCommands = [] } = options2;
  if (state.kind === "disposed") {
    return createSelfTransition(state);
  }
  if (auth2 === void 0) {
    const { commands } = stopTelemetry(state, "authUnavailable");
    return createTransition(state, { kind: "inactive", auth: void 0 }, [
      ...precedingCommands,
      ...commands
    ]);
  }
  if (!isCodebaseTelemetryAllowed(privacyMode)) {
    const { commands } = stopTelemetry(state, "privacyModeDisallowed");
    return createTransition(state, { kind: "inactive", auth: auth2 }, [...precedingCommands, ...commands]);
  }
  return beginMainGateCheck(state, auth2, { precedingCommands });
}
function beginMainGateCheck(state, auth2, { precedingCommands }) {
  const checkToken = /* @__PURE__ */ Symbol("mainGateCheck");
  const checkCommand = {
    kind: "checkMainGate",
    checkToken
  };
  const checkingState = {
    kind: "checkingMainGate",
    auth: auth2,
    checkToken
  };
  switch (state.kind) {
    case "inactive":
    case "checkingMainGate":
      return createTransition(state, checkingState, [...precedingCommands, checkCommand]);
    case "openingSession":
    case "recheckingMainGateWhileOpening": {
      if (state.openAttempt.expectedAuthId !== auth2.authId) {
        return createTransition(state, checkingState, [
          ...precedingCommands,
          {
            kind: "cancelSessionOpenAttempt",
            openAttempt: state.openAttempt,
            reason: "auth_changed"
          },
          checkCommand
        ]);
      }
      return createTransition(state, {
        kind: "recheckingMainGateWhileOpening",
        auth: auth2,
        openAttempt: state.openAttempt,
        checkToken
      }, [...precedingCommands, checkCommand]);
    }
    case "active":
    case "recheckingMainGate":
    case "mainGateUnavailable": {
      if (state.session.authId !== auth2.authId) {
        const { commands: stopCommands } = stopTelemetry(state, "authIdChanged");
        return createTransition(state, checkingState, [
          ...precedingCommands,
          ...stopCommands,
          checkCommand
        ]);
      }
      return createTransition(state, {
        kind: "recheckingMainGate",
        auth: auth2,
        session: state.session,
        checkToken,
        // Parent rechecks invalidate child work, so always refresh
        // sub-gates after the main gate is confirmed enabled.
        subgatesDirty: true
      }, [
        ...precedingCommands,
        {
          kind: "invalidatePendingSubgateReconciliation",
          session: state.session
        },
        checkCommand
      ]);
    }
    case "disposed":
      return createSelfTransition(state);
    default: {
      const _exhaustive = state;
      return _exhaustive;
    }
  }
}
function handleAuthChanged(state, { auth: auth2, privacyMode }) {
  var _a19;
  if (state.kind === "disposed") {
    return createSelfTransition(state);
  }
  if ((auth2 === null || auth2 === void 0 ? void 0 : auth2.authId) !== ((_a19 = state.auth) === null || _a19 === void 0 ? void 0 : _a19.authId)) {
    const { nextState, commands } = stopTelemetry(state, auth2 === void 0 ? "authUnavailable" : "authIdChanged");
    return reconcileEligibility(nextState, { auth: auth2, privacyMode }, {
      precedingCommands: [{ kind: "reportAuthIdChanged" }, ...commands]
    });
  }
  if (auth2 === void 0) {
    return createSelfTransition(state);
  }
  if (!isCodebaseTelemetryAllowed(privacyMode)) {
    return reconcileEligibility(state, { auth: auth2, privacyMode });
  }
  switch (state.kind) {
    case "inactive":
      return createTransition(state, { kind: "inactive", auth: auth2 });
    case "checkingMainGate":
      return createTransition(state, Object.assign(Object.assign({}, state), { auth: auth2 }));
    case "openingSession":
    case "recheckingMainGateWhileOpening":
      return {
        nextState: Object.assign(Object.assign({}, state), { auth: auth2 }),
        commands: [
          {
            kind: "updateSessionOpenAttemptAuthToken",
            openAttempt: state.openAttempt,
            authToken: auth2.authToken
          }
        ]
      };
    case "active":
    case "recheckingMainGate":
    case "mainGateUnavailable":
      return {
        nextState: Object.assign(Object.assign({}, state), { auth: auth2 }),
        commands: [
          {
            kind: "updateActiveSessionAuthToken",
            session: state.session,
            authToken: auth2.authToken
          }
        ]
      };
    default: {
      const _exhaustive = state;
      return _exhaustive;
    }
  }
}
function handleFeatureGatesChanged(state, { mainGateChanged, subgateChanged, authPrivacy }) {
  var _a19;
  if (state.kind === "disposed") {
    return createSelfTransition(state);
  }
  if (authPrivacy.auth === void 0 || !isCodebaseTelemetryAllowed(authPrivacy.privacyMode) || authPrivacy.auth.authId !== ((_a19 = state.auth) === null || _a19 === void 0 ? void 0 : _a19.authId)) {
    return reconcileEligibility(state, authPrivacy);
  }
  if (mainGateChanged) {
    return reconcileEligibility(state, authPrivacy);
  }
  if (!subgateChanged) {
    return createSelfTransition(state);
  }
  switch (state.kind) {
    case "active":
      return createSelfTransition(state, [{ kind: "reconcileSubgates", session: state.session }]);
    case "recheckingMainGate":
      return createTransition(state, Object.assign(Object.assign({}, state), { subgatesDirty: true }));
    case "mainGateUnavailable":
      return reconcileEligibility(state, authPrivacy);
    case "inactive":
    case "checkingMainGate":
    case "openingSession":
    case "recheckingMainGateWhileOpening":
      return createSelfTransition(state);
    default: {
      const _exhaustive = state;
      return _exhaustive;
    }
  }
}
function handleMainGateCheckCompleted(state, { checkToken, enabled }) {
  switch (state.kind) {
    case "checkingMainGate": {
      if (state.checkToken !== checkToken) {
        return createSelfTransition(state);
      }
      switch (enabled) {
        case true: {
          const openAttempt = {
            expectedAuthId: state.auth.authId
          };
          return createTransition(state, { kind: "openingSession", auth: state.auth, openAttempt }, [{ kind: "beginSessionOpen", openAttempt, auth: state.auth }]);
        }
        case false:
        case void 0:
          return createTransition(state, {
            kind: "inactive",
            auth: state.auth
          });
        default: {
          const _exhaustive = enabled;
          return _exhaustive;
        }
      }
    }
    case "recheckingMainGate": {
      if (state.checkToken !== checkToken) {
        return createSelfTransition(state);
      }
      switch (enabled) {
        case true:
          return createTransition(state, {
            kind: "active",
            auth: state.auth,
            session: state.session
          }, state.subgatesDirty ? [{ kind: "reconcileSubgates", session: state.session }] : []);
        case false:
          return stopTelemetry(state, "mainGateDisabled");
        case void 0:
          return createTransition(state, {
            kind: "mainGateUnavailable",
            auth: state.auth,
            session: state.session,
            subgatesDirty: state.subgatesDirty
          });
        default: {
          const _exhaustive = enabled;
          return _exhaustive;
        }
      }
    }
    case "recheckingMainGateWhileOpening": {
      if (state.checkToken !== checkToken) {
        return createSelfTransition(state);
      }
      switch (enabled) {
        case true:
        case void 0:
          return createTransition(state, {
            kind: "openingSession",
            auth: state.auth,
            openAttempt: state.openAttempt
          });
        case false:
          return stopTelemetry(state, "mainGateDisabled");
        default: {
          const _exhaustive = enabled;
          return _exhaustive;
        }
      }
    }
    case "inactive":
    case "openingSession":
    case "active":
    case "mainGateUnavailable":
    case "disposed":
      return createSelfTransition(state);
    default: {
      const _exhaustive = state;
      return _exhaustive;
    }
  }
}
function handleSessionOpenSucceeded(state, { openAttempt, session }) {
  if (state.kind !== "openingSession" && state.kind !== "recheckingMainGateWhileOpening" || state.openAttempt !== openAttempt) {
    return createSelfTransition(state, [{ kind: "closeStaleSession", session }]);
  }
  if (session.authId !== openAttempt.expectedAuthId) {
    return createTransition(state, { kind: "inactive", auth: state.auth }, [
      {
        kind: "rejectMismatchedSession",
        openAttempt,
        session
      }
    ]);
  }
  if (state.kind === "recheckingMainGateWhileOpening") {
    return createTransition(state, {
      kind: "recheckingMainGate",
      auth: state.auth,
      session,
      checkToken: state.checkToken,
      // Parent rechecks invalidate child work, so always refresh
      // sub-gates after the main gate is confirmed enabled.
      subgatesDirty: true
    }, [
      {
        kind: "activateSession",
        openAttempt,
        session
      }
    ]);
  }
  return createTransition(state, {
    kind: "active",
    auth: state.auth,
    session
  }, [
    {
      kind: "activateSession",
      openAttempt,
      session
    }
  ]);
}
function handleSessionOpenFailed(state, { openAttempt, error: error42 }) {
  if (state.kind !== "openingSession" && state.kind !== "recheckingMainGateWhileOpening" || state.openAttempt !== openAttempt) {
    return createSelfTransition(state, [{ kind: "reportStaleSessionOpenFailure", error: error42 }]);
  }
  if (state.kind === "recheckingMainGateWhileOpening") {
    return createTransition(state, {
      kind: "checkingMainGate",
      auth: state.auth,
      checkToken: state.checkToken
    }, [
      {
        kind: "finalizeFailedSessionOpenAttempt",
        openAttempt,
        error: error42
      }
    ]);
  }
  return createTransition(state, { kind: "inactive", auth: state.auth }, [
    {
      kind: "finalizeFailedSessionOpenAttempt",
      openAttempt,
      error: error42
    }
  ]);
}
function handleSessionFailed(state, { session, error: error42 }) {
  switch (state.kind) {
    case "active":
    case "recheckingMainGate":
    case "mainGateUnavailable": {
      if (state.session !== session) {
        return createSelfTransition(state);
      }
      const { nextState, commands } = transitionToInactive(state);
      return {
        nextState,
        commands: [{ kind: "reportSessionFailure", error: error42 }, ...commands]
      };
    }
    case "inactive":
    case "checkingMainGate":
    case "openingSession":
    case "recheckingMainGateWhileOpening":
    case "disposed":
      return createSelfTransition(state);
    default: {
      const _exhaustive = state;
      return _exhaustive;
    }
  }
}
function handleDisposalRequested(state) {
  if (state.kind === "disposed") {
    return createSelfTransition(state);
  }
  const { commands } = transitionToInactive(state);
  return createTransition(state, { kind: "disposed" }, [
    ...commands,
    { kind: "finalizeControllerDisposal" }
  ]);
}
function handleCleanupFailed(state) {
  if (state.kind === "disposed") {
    return createSelfTransition(state);
  }
  const { commands } = transitionToInactive(state);
  return createTransition(state, { kind: "disposed" }, [
    ...commands,
    { kind: "finalizeControllerDisposal" }
  ]);
}
function createTransition(_fromState, toState, commands = []) {
  return { nextState: toState, commands };
}
function createSelfTransition(state, commands = []) {
  return { nextState: state, commands };
}
function transitionToInactive(state, openAttemptAbandonReason = "disposed") {
  if (state.kind === "inactive" || state.kind === "disposed") {
    return createSelfTransition(state);
  }
  const inactiveState = {
    kind: "inactive",
    auth: state.auth
  };
  switch (state.kind) {
    case "checkingMainGate":
      return createTransition(state, inactiveState);
    case "openingSession":
    case "recheckingMainGateWhileOpening":
      return createTransition(state, inactiveState, [
        {
          kind: "cancelSessionOpenAttempt",
          openAttempt: state.openAttempt,
          reason: openAttemptAbandonReason
        }
      ]);
    case "active":
    case "recheckingMainGate":
    case "mainGateUnavailable":
      return createTransition(state, inactiveState, [
        {
          kind: "closeActiveSession",
          session: state.session
        }
      ]);
    default: {
      const _exhaustive = state;
      return _exhaustive;
    }
  }
}
function abandonReasonFromTelemetryStop(reason) {
  switch (reason) {
    case "authUnavailable":
      return "auth_unavailable";
    case "authIdChanged":
      return "auth_changed";
    case "privacyModeDisallowed":
      return "privacy";
    case "mainGateDisabled":
      return "gate_disabled";
    default: {
      const _exhaustive = reason;
      return _exhaustive;
    }
  }
}
function stopTelemetry(state, reason) {
  const transition = transitionToInactive(state, abandonReasonFromTelemetryStop(reason));
  switch (state.kind) {
    case "openingSession":
    case "recheckingMainGateWhileOpening":
    case "active":
    case "recheckingMainGate":
    case "mainGateUnavailable":
      return {
        nextState: transition.nextState,
        commands: [...transition.commands, { kind: "reportTelemetryStopped", reason }]
      };
    case "inactive":
    case "checkingMainGate":
    case "disposed":
      return transition;
    default: {
      const _exhaustive = state;
      return _exhaustive;
    }
  }
}

