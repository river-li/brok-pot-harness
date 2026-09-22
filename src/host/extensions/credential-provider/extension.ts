var SAND_1PASS_INTEGRATION_GATE = "sand_1pass_integration";
var CLEAR_RETRY_INTERVAL_MS = 3e3;
var INTEGRATION_DISABLED_DETAIL = "Credential integration is disabled.";
function fillOutcome(result) {
  return {
    filled: result.filled,
    ...result.detail === void 0 ? {} : { detail: result.detail }
  };
}
function usernameFirstFillDetail(args) {
  const { host, submitted, passwordStepArmed } = args;
  if (!passwordStepArmed) {
    return submitted ? `Submitted the saved username in ${host}. Request this credential again on the password step.` : `Filled the saved username in ${host} but did not submit it because the form does not POST and already holds a password value. Continue to the password step, then request this credential again.`;
  }
  const followUp = "The password (and any one-time code the login carries) will be filled for you on the following step(s) as they appear on this same page; do not send this credential-request again while that fill is pending. Continue with computerUse and submit only per the user's instruction. If the password step is showing and its field is still empty about ten seconds later, that fill did not land: send this same credential-request again for the password step, and never ask the user for the password.";
  return submitted ? `Submitted the saved username in ${host}. ${followUp}` : `Filled the saved username in ${host} but did not submit it because the form does not POST and already holds a password value. Advance to the password step with computerUse. ${followUp}`;
}
function auditEventOf(approvalMode) {
  return approvalMode === "always-allow" ? "auto-fill" : "allow-once";
}
async function startCredentialProvider(context2) {
  const auditLine = createCredentialAuditLogger((message) => context2.host.log(message));
  const audit = (entry, sensitiveValues) => {
    auditLine(entry, sensitiveValues);
    context2.deps.telemetry.logs.reportCredentialFillOutcome({
      event: entry.event,
      operation: entry.operation,
      outcome: entry.outcome,
      reason: entry.reason,
      fillRefusalReason: entry.fillRefusalReason,
      submitRequested: entry.submitRequested,
      inForm: entry.inForm,
      approvalMode: entry.approvalMode
    });
  };
  const enabled = await context2.deps.experiments.checkGate(SAND_1PASS_INTEGRATION_GATE, {
    disableExposureLog: true
  });
  if (!enabled) {
    return {
      access: void 0,
      status: void 0,
      agentToolLease: void 0,
      remoteAgentHolds: void 0,
      getFreshDirectory: async () => null,
      resolveBrowserCredentialTarget: async () => ({
        ok: false,
        detail: INTEGRATION_DISABLED_DETAIL
      }),
      requestAutoFill: async () => ({ accepted: false, detail: INTEGRATION_DISABLED_DETAIL }),
      fillBrowserCredential: async (args) => {
        audit(
          {
            event: auditEventOf(args.approvalMode),
            operation: "browser-fill",
            outcome: "refused",
            reason: "integration-disabled",
            targetUrl: args.targetSite,
            credentialId: args.item.credentialId,
            elements: [],
            submitRequested: true,
            approvalMode: args.approvalMode
          },
          [args.username, args.password, args.oneTimeCode].filter(
            (value) => value !== void 0
          )
        );
        return { filled: false, detail: INTEGRATION_DISABLED_DETAIL };
      },
      fillBrowserPasswordStep: async (args) => {
        audit(
          {
            event: auditEventOf(args.approvalMode),
            operation: "browser-password-step-fill",
            outcome: "refused",
            reason: "integration-disabled",
            targetUrl: args.targetSite,
            credentialId: args.item.credentialId,
            elements: [],
            submitRequested: true,
            approvalMode: args.approvalMode
          },
          [args.username, args.password, args.oneTimeCode].filter(
            (value) => value !== void 0
          )
        );
        return { filled: false, detail: INTEGRATION_DISABLED_DETAIL };
      },
      fillBrowserOneTimeCode: async (args) => {
        audit(
          {
            event: "auto-fill",
            operation: "browser-one-time-code-fill",
            outcome: "refused",
            reason: "integration-disabled",
            targetUrl: args.targetSite,
            credentialId: args.item.credentialId,
            elements: [],
            submitRequested: true
          },
          [args.oneTimeCode]
        );
        return { filled: false, detail: INTEGRATION_DISABLED_DETAIL };
      }
    };
  }
  const auth2 = context2.deps.auth;
  const getBackendUrl = () => context2.host.environment.backend.backendUrl;
  const loadDirectory = createCredentialProviderDirectoryReader({
    getAccessToken: auth2.getAccessToken,
    getBackendUrl
  });
  const credentialFill = context2.deps[HostExtensions.CredentialFill];
  const filler = new BrowserCredentialFiller({
    executeFill: (request5) => credentialFill.fill(request5),
    reportFailure: (stage, error42) => context2.host.log(`credentials: ${stage} failed (${errorLogTag(error42)})`),
    audit
  });
  const lease = new CredentialFillLease({ log: (message) => context2.host.log(message) });
  const remoteAgentHolds = createCredentialFillRemoteHolds(lease, {
    log: (message) => context2.host.log(message)
  });
  context2.onStop(() => remoteAgentHolds.dispose());
  const leasedFill = createLeasedCredentialFill({
    lease,
    verifyCleared: (target) => credentialFill.verifyCleared(target),
    clearRetry: createPollingPolicy2({
      name: "sand-credential-fill-clear-retry",
      intervalMs: CLEAR_RETRY_INTERVAL_MS,
      leading: false
    }),
    log: (message) => context2.host.log(message)
  });
  context2.onStop(() => leasedFill.dispose());
  const coordinator = new CredentialCoordinator({
    loadDirectory,
    resolveBrowserTarget: (item, siteHint) => filler.resolveTarget(item, siteHint),
    log: (message) => context2.host.log(message),
    audit
  });
  const requestAutoFillOnBackend = createCredentialAutoFillRequestResolver({
    getAccessToken: auth2.getAccessToken,
    getBackendUrl
  });
  const oneTimeCodeFollowUp = new CredentialOneTimeCodeFollowUp({
    polling: createPollingPolicy2({
      name: "sand-credential-one-time-code",
      intervalMs: 1e3,
      leading: true
    }),
    filler,
    resolveOneTimeCode: createCredentialOneTimeCodeResolver({
      getAccessToken: auth2.getAccessToken,
      getBackendUrl
    }),
    reportFailure: (stage, error42) => context2.host.log(`credentials: ${stage} failed (${errorLogTag(error42)})`),
    audit
  });
  context2.onStop(() => oneTimeCodeFollowUp.dispose());
  const passwordStepFollowUp = new CredentialPasswordStepFollowUp({
    polling: createPollingPolicy2({
      name: "sand-credential-password-step",
      intervalMs: 1e3,
      leading: true
    }),
    filler,
    canRequest: (target) => lease.canStartAutofill(browserWindowIndexOfCdpPort(target.browserCdpPort)),
    resolvePasswordStep: createCredentialPasswordStepResolver({
      getAccessToken: auth2.getAccessToken,
      getBackendUrl
    }),
    reportFailure: (stage, error42) => context2.host.log(`credentials: ${stage} failed (${errorLogTag(error42)})`),
    audit
  });
  context2.onStop(() => passwordStepFollowUp.dispose());
  const armOneTimeCodeFollowUp = (args, result) => {
    const loginOrigin = result.target === void 0 ? null : trustedBrowserOrigin(result.target.url);
    if (result.filled && result.submitted === true && result.step === "login" && result.target !== void 0 && loginOrigin !== null && args.oneTimeCodeTicket !== void 0) {
      oneTimeCodeFollowUp.watch({
        item: args.item,
        targetWebSocketDebuggerUrl: result.target.webSocketDebuggerUrl,
        loginOrigin,
        oneTimeCodeTicket: args.oneTimeCodeTicket,
        approvalMode: args.approvalMode
      });
    }
  };
  return {
    access: coordinator.createAccess(),
    status: createCredentialProviderStatusReader({
      getAccessToken: auth2.getAccessToken,
      getBackendUrl
    }),
    agentToolLease: lease,
    remoteAgentHolds,
    getFreshDirectory: () => coordinator.getFreshDirectory(),
    resolveBrowserCredentialTarget: (item, siteHint) => coordinator.resolveBrowserTarget(item, siteHint),
    requestAutoFill: async (args) => {
      const auditRequest = (outcome, reason) => audit({
        event: "auto-fill",
        operation: "autofill-request",
        outcome,
        reason,
        targetUrl: args.request.targetSite,
        credentialId: args.request.credentialId,
        approvalMode: "always-allow"
      });
      let decision;
      try {
        decision = await requestAutoFillOnBackend(args);
      } catch (error42) {
        auditRequest("failed", "auto-fill-request-failed");
        context2.host.log(`credentials: auto-fill request failed (${errorLogTag(error42)})`);
        return {
          accepted: false,
          detail: "The 1Password login could not be filled automatically."
        };
      }
      if (!decision.accepted) {
        auditRequest("refused", "approval-required");
        return {
          accepted: false,
          detail: decision.detail ?? "Auto fill is off for this login."
        };
      }
      if (decision.filled !== true) {
        auditRequest("failed", "auto-fill-request-failed");
        return {
          accepted: false,
          detail: decision.detail ?? "The 1Password login could not be filled automatically."
        };
      }
      auditRequest("success", "auto-fill-accepted");
      return { accepted: true };
    },
    fillBrowserCredential: async (args) => {
      const event = auditEventOf(args.approvalMode);
      let outcome;
      if (args.targetWebSocketDebuggerUrl === void 0) {
        const picked = await filler.pickFillTarget(args, event);
        if (!picked.ok) return fillOutcome(picked.result);
        outcome = await leasedFill.run(
          browserWindowIndexOfCdpPort(picked.target.browserCdpPort),
          () => filler.fillPickedTarget(picked.target, args, event)
        );
      } else {
        const targetWebSocketDebuggerUrl = args.targetWebSocketDebuggerUrl;
        outcome = await leasedFill.run(
          browserWindowIndexOfDebuggerUrl(targetWebSocketDebuggerUrl),
          () => filler.fillSelectedTarget(targetWebSocketDebuggerUrl, args, event)
        );
      }
      if (!outcome.ok) {
        audit(
          {
            event,
            operation: "browser-fill",
            outcome: "refused",
            reason: "lease-busy",
            targetUrl: args.targetSite,
            credentialId: args.item.credentialId,
            elements: [],
            submitRequested: true,
            approvalMode: args.approvalMode
          },
          args.username === void 0 ? [args.password] : [args.username, args.password]
        );
        return { filled: false, detail: outcome.detail };
      }
      const { result } = outcome;
      armOneTimeCodeFollowUp(args, result);
      if (result.filled && result.step === "login" && result.target !== void 0) {
        passwordStepFollowUp.markFilled(result.target.webSocketDebuggerUrl);
      }
      if (result.filled && result.step === "username-first" && result.target !== void 0) {
        const loginOrigin = trustedBrowserOrigin(result.target.url);
        const passwordStepArmed = loginOrigin !== null && args.passwordStepTicket !== void 0;
        if (passwordStepArmed) {
          passwordStepFollowUp.watch({
            item: args.item,
            targetWebSocketDebuggerUrl: result.target.webSocketDebuggerUrl,
            loginOrigin,
            passwordStepTicket: args.passwordStepTicket,
            approvalMode: args.approvalMode
          });
        }
        return {
          filled: true,
          detail: usernameFirstFillDetail({
            host: new URL(result.target.url).host,
            submitted: result.submitted === true,
            passwordStepArmed
          })
        };
      }
      return fillOutcome(result);
    },
    fillBrowserPasswordStep: async (args) => {
      const session = passwordStepFollowUp.sessionFor(
        args.targetWebSocketDebuggerUrl,
        args.item,
        args.targetSite
      );
      const sensitiveValues = [args.username, args.password, args.oneTimeCode].filter(
        (value) => value !== void 0
      );
      if (session === void 0) {
        audit(
          {
            event: auditEventOf(args.approvalMode),
            operation: "browser-password-step-fill",
            outcome: "refused",
            reason: "no-follow-up-session",
            targetUrl: args.targetSite,
            credentialId: args.item.credentialId,
            elements: [],
            submitRequested: true,
            approvalMode: args.approvalMode
          },
          sensitiveValues
        );
        return {
          filled: false,
          detail: "No username was submitted from this page recently, so its password was not filled."
        };
      }
      const event = auditEventOf(session.approvalMode);
      const outcome = await leasedFill.runFollowUp(
        browserWindowIndexOfDebuggerUrl(args.targetWebSocketDebuggerUrl),
        () => filler.fillSelectedTarget(args.targetWebSocketDebuggerUrl, args, event, {
          steps: ["login"],
          operation: "browser-password-step-fill"
        })
      );
      if (!outcome.ok) {
        audit(
          {
            event,
            operation: "browser-password-step-fill",
            outcome: "refused",
            reason: "lease-busy",
            targetUrl: args.targetSite,
            credentialId: args.item.credentialId,
            elements: [],
            submitRequested: true,
            approvalMode: session.approvalMode
          },
          sensitiveValues
        );
        return { filled: false, detail: outcome.detail, retryable: true };
      }
      if (outcome.result.filled) passwordStepFollowUp.markFilled(args.targetWebSocketDebuggerUrl);
      armOneTimeCodeFollowUp({ ...args, approvalMode: session.approvalMode }, outcome.result);
      return fillOutcome(outcome.result);
    },
    fillBrowserOneTimeCode: async (args) => {
      const session = oneTimeCodeFollowUp.sessionFor(
        args.targetWebSocketDebuggerUrl,
        args.item,
        args.targetSite
      );
      if (session === void 0) {
        audit(
          {
            event: "auto-fill",
            operation: "browser-one-time-code-fill",
            outcome: "refused",
            reason: "no-follow-up-session",
            targetUrl: args.targetSite,
            credentialId: args.item.credentialId,
            elements: [],
            submitRequested: true
          },
          [args.oneTimeCode]
        );
        return {
          filled: false,
          detail: "No login was filled into this page recently, so its one-time code was not."
        };
      }
      const event = auditEventOf(session.approvalMode);
      const outcome = await leasedFill.runFollowUp(
        browserWindowIndexOfDebuggerUrl(args.targetWebSocketDebuggerUrl),
        () => filler.fillOneTimeCodeOnTarget(args.targetWebSocketDebuggerUrl, args, event)
      );
      if (!outcome.ok) {
        oneTimeCodeFollowUp.retryAfterLeaseRefusal(args.targetWebSocketDebuggerUrl);
        audit(
          {
            event,
            operation: "browser-one-time-code-fill",
            outcome: "refused",
            reason: "lease-busy",
            targetUrl: args.targetSite,
            credentialId: args.item.credentialId,
            elements: [],
            submitRequested: true,
            approvalMode: session.approvalMode
          },
          [args.oneTimeCode]
        );
        return { filled: false, detail: outcome.detail };
      }
      return fillOutcome(outcome.result);
    }
  };
}
var credentialProviderExtension = defineHostExtension({
  id: "credential-provider",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.CredentialFill,
    HostExtensions.Experiments,
    HostExtensions.Telemetry
  ],
  start: startCredentialProvider
});
