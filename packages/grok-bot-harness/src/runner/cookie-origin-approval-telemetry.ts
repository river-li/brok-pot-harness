/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/cookie-origin-approval-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_bounded();
init_errors();
var CHROME_COOKIE_IMPORT_GATE_OFF_ERROR_CLASS = "ChromeCookieImportGateOffError";
function countOf(value) {
  return Array.isArray(value) ? value.length : 0;
}
function cookieOriginApprovalReportOf(outcome, ctx) {
  const base = {
    harness: ctx.harness,
    durationMs: ctx.durationMs,
    requestedOrigins: ctx.requestedOrigins,
    ...ctx.agentId === void 0 ? {} : { agentId: ctx.agentId },
    ...ctx.requestId === void 0 ? {} : { requestId: ctx.requestId }
  };
  switch (outcome.kind) {
    case "listed":
      return { ...base, outcome: "listed", listedItems: countOf(outcome.items) };
    case "resolved":
      return {
        ...base,
        outcome: "resolved",
        decision: outcome.decision,
        grants: countOf(outcome.grants),
        injected: outcome.injected,
        ...outcome.auto === void 0 ? {} : { auto: outcome.auto }
      };
    case "failed":
      return {
        ...base,
        outcome: "failed",
        stage: outcome.stage,
        errorClass: outcome.errorClass,
        decision: outcome.decision,
        grants: countOf(outcome.grants),
        ...outcome.auto === void 0 ? {} : { auto: outcome.auto }
      };
    case "refused":
      return { ...base, outcome: "refused", refusalReason: outcome.reason ?? "unknown" };
  }
}
function cookieOriginApprovalSandErrorOf(report) {
  if (report.outcome === "refused") {
    switch (report.refusalReason) {
      case "no-machine":
        return SandError.cookieApprovalNoMachine();
      case "machine-stale":
        return SandError.cookieApprovalMachineStale();
      case "no-window":
        return SandError.cookieApprovalNoWindow();
      case "no-match":
        return SandError.cookieApprovalNoMatch();
      case "expired":
        return SandError.cookieApprovalExpired();
      case "aborted":
        return SandError.cookieApprovalAborted();
      case "unavailable":
        return SandError.cookieApprovalUnavailable();
      case "denied":
      case "unknown":
      case void 0:
        return void 0;
    }
  }
  if (report.outcome === "failed") {
    const errorClass = brandedErrorClass(report.errorClass);
    switch (report.stage) {
      case "enumerate":
        return SandError.cookieApprovalEnumerateFailed({ errorClass });
      case "collect":
        return SandError.cookieApprovalCollectFailed({ errorClass });
      case "inject":
        return report.errorClass === CHROME_COOKIE_IMPORT_GATE_OFF_ERROR_CLASS ? SandError.cookieImportGateOff() : SandError.cookieInjectFailed({ errorClass });
      case void 0:
        return void 0;
    }
  }
  return void 0;
}
function reportCookieOriginApproval(deps, makeReport) {
  try {
    deps.report(makeReport());
  } catch (error42) {
    deps.log(`Cookie origin approval report failed (${errorLogTag(error42)})`);
  }
}
function instrumentCookieOriginApproval(port, deps) {
  return {
    request: async (args) => {
      const startedAt = deps.now();
      const ctx = {
        harness: deps.harness,
        requestedOrigins: countOf(args.origins),
        ...args.agentId === void 0 ? {} : { agentId: args.agentId },
        ...args.requestId === void 0 ? {} : { requestId: args.requestId }
      };
      let outcome;
      try {
        outcome = await port.request(args);
      } catch (error42) {
        reportCookieOriginApproval(deps, () => ({
          ...ctx,
          outcome: "failed",
          durationMs: deps.now() - startedAt,
          errorClass: errorClassOf(error42)
        }));
        throw error42;
      }
      reportCookieOriginApproval(
        deps,
        () => cookieOriginApprovalReportOf(outcome, { ...ctx, durationMs: deps.now() - startedAt })
      );
      return outcome;
    }
  };
}

