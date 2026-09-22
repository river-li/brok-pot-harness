var cookieOriginApprovalExtension = defineHostExtension({
  id: "cookie-origin-approval",
  dependencies: [
    HostExtensions.ChromeCookieImport,
    HostExtensions.Transcript,
    HostExtensions.Telemetry
  ],
  start: (context2) => {
    const bridge = new SandCookieOriginApprovalBridge({ clock: realClock });
    const port = createCookieOriginApprovalPort({
      desktop: bridge,
      inject: (cookies) => context2.deps["chrome-cookie-import"].inject(cookies),
      log: (message) => context2.host.log(message)
    });
    const instrumented = instrumentCookieOriginApproval(port, {
      harness: "BOX",
      now: () => realClock.now(),
      report: (report) => context2.deps.telemetry.logs.reportCookieOriginApproval(report),
      log: (message) => context2.host.log(message)
    });
    const bootStartedAtMs = realClock.now();
    const sweepPendingCardsOnBoot = async () => {
      await context2.host.whenBackgroundWorkReady;
      try {
        await context2.deps.transcript.widgetResponses.expireAllPendingCookieOriginApprovalCards({
          ifPendingBeforeMs: bootStartedAtMs,
          unlessRequestId: (requestId2) => bridge.hasPendingRequest(requestId2)
        });
      } catch (error42) {
        context2.host.log(`cookie approval boot sweep failed (${errorLogTag(error42)})`);
      }
    };
    void sweepPendingCardsOnBoot();
    return {
      request: (args) => instrumented.request(args),
      beginRequest: (args) => port.beginRequest(args),
      awaitRequest: (args) => port.awaitRequest(args),
      cancelRequest: (args) => port.cancelRequest(args),
      registerProvider: (send) => bridge.registerProvider(send),
      submitResponses: (batch) => bridge.submitResponses(batch)
    };
  }
});
