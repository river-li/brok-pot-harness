init_privacy_mode_pb();
var USER_FORM_DOMAIN_TAG_MAX_LENGTH = 64;
var userFormRequest = createCounter("grok_bot.user_form.request", {
  labelNames: [
    "reason",
    "outcome",
    "preflight_outcome",
    "has_fill_target",
    "submit_after_fill"
  ]
});
var userFormPreflightUnchecked = createCounter("grok_bot.user_form.preflight_unchecked", {
  labelNames: ["reason", "outcome", "unchecked_reason"]
});
var userFormResolution = createCounter("grok_bot.user_form.resolution", {
  labelNames: [
    "reason",
    "outcome",
    "client_platform",
    "failure_reason",
    "fill_attempted",
    "live_host_captured",
    "submit_after_fill_attempted",
    "submit_after_fill_succeeded",
    "remap_outcome",
    "heal_outcome"
  ]
});
var userFormDriverUnavailable = createCounter("grok_bot.user_form.driver_unavailable", {
  labelNames: ["reason", "client_platform", "stage"]
});
var userFormResolutionTimingMissing = createCounter(
  "grok_bot.user_form.resolution_timing_missing",
  {
    labelNames: ["reason", "outcome", "client_platform"]
  }
);
var userFormTimeToResolve = createHistogram("grok_bot.user_form.time_to_resolve_ms", {
  labelNames: ["reason", "outcome", "client_platform", "timing_source"]
});
var userFormStageDuration = createHistogram("grok_bot.user_form.stage_duration_ms", {
  labelNames: [
    "stage",
    "reason",
    "outcome",
    "client_platform",
    "failure_reason",
    "fill_attempted",
    "timing_source"
  ]
});
var RUNNER_RETRY = createRetryPolicy({
  name: "sand-user-form-runner",
  maxAttempts: 2,
  initialDelayMs: 1500,
  maxDelayMs: 1500
});
var UserFormService = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  pendingByAgent = /* @__PURE__ */ new Map();
  remapHoldByAgent = /* @__PURE__ */ new Map();
  forget(agentId) {
    this.pendingByAgent.delete(agentId);
    this.remapHoldByAgent.delete(agentId);
  }
  holdForRemap(agentId, hold) {
    if (this.remapHoldByAgent.has(agentId)) return false;
    this.remapHoldByAgent.set(agentId, { ...hold });
    return true;
  }
  hasRemapHold(agentId) {
    const hold = this.remapHoldByAgent.get(agentId);
    return hold != null && hold.spent !== true;
  }
  async remap(args) {
    const hold = this.remapHoldByAgent.get(args.agentId);
    if (hold == null || hold.spent === true) return { kind: "no_hold" };
    const heldById = new Map(hold.values.map((entry) => [entry.field.id, entry]));
    const unknownFieldIds = args.targets.map((target) => target.fieldId).filter((fieldId) => !heldById.has(fieldId));
    if (unknownFieldIds.length > 0) {
      return { kind: "unknown_fields", heldFieldIds: [...heldById.keys()], unknownFieldIds };
    }
    const remapped = args.targets.flatMap((target) => {
      const held = heldById.get(target.fieldId);
      return held == null ? [] : [{ field: { ...held.field, target: target.target }, value: held.value }];
    });
    const remappedIds = new Set(remapped.map((entry) => entry.field.id));
    const notRemappedFieldIds = hold.values.map((entry) => entry.field.id).filter((id) => !remappedIds.has(id));
    hold.spent = true;
    const result = await this.runRemap(args.agentId, remapped, hold.consentedHost);
    hold.settlement = { kind: "remapped", result, notRemappedFieldIds };
    let domainMismatch;
    if (result.domainMismatch?.liveHost != null) {
      domainMismatch = { liveHost: result.domainMismatch.liveHost };
    } else if (result.domainMismatch != null) {
      domainMismatch = {};
    }
    return {
      kind: "remapped",
      outcomes: result.outcomes,
      notRemappedFieldIds,
      ...domainMismatch !== void 0 ? { domainMismatch } : {},
      ...result.fillFailureKinds != null ? { fillFailureKinds: result.fillFailureKinds } : {}
    };
  }
  settleRemap({ agentId, requestId: requestId2 }) {
    const hold = this.remapHoldByAgent.get(agentId);
    if (hold == null || hold.requestId !== requestId2) return { kind: "not_remapped" };
    this.remapHoldByAgent.delete(agentId);
    return hold.settlement ?? { kind: "not_remapped" };
  }
  start(request3) {
    const requestId2 = crypto.randomUUID();
    const pending = this.pendingByAgent.get(request3.agentId) ?? /* @__PURE__ */ new Map();
    pending.set(requestId2, {
      requestId: requestId2,
      form: request3.form
    });
    this.pendingByAgent.set(request3.agentId, pending);
    if (request3.form.domain == null) {
      this.reportRequest(request3, "shown", "not_applicable");
      this.markShown(request3.agentId, requestId2);
      return { kind: "started", requestId: requestId2 };
    }
    const hostPreflightStartedAt = performance.now();
    return this.probeLiveHostAndPreflightFailingOpen(request3.agentId, request3.form).then(
      ({ liveHost, preflight, uncheckedReason, driverUnavailable }) => {
        const hostPreflightMs = Math.max(0, performance.now() - hostPreflightStartedAt);
        const preflightOutcome = classifyUserFormPreflight(request3.form, preflight);
        if (this.pendingByAgent.get(request3.agentId)?.has(requestId2) !== true) {
          this.reportRequest(
            request3,
            "canceled",
            preflightOutcome,
            uncheckedReason,
            hostPreflightMs
          );
          return { kind: "canceled" };
        }
        if (driverUnavailable && hasHostFillableUserFormTargets(request3.form.fields)) {
          this.end(request3.agentId, requestId2);
          this.reportRequest(
            request3,
            "driver_unavailable",
            preflightOutcome,
            uncheckedReason,
            hostPreflightMs
          );
          return { kind: "driver_unavailable" };
        }
        if (preflightOutcome === "unfillable") {
          this.end(request3.agentId, requestId2);
          this.reportRequest(
            request3,
            "preflight_unfillable",
            preflightOutcome,
            uncheckedReason,
            hostPreflightMs
          );
          return { kind: "unfillable", fieldKinds: preflight.doomedFieldKinds };
        }
        const skipped2 = Object.keys(preflight.doomedFieldKinds).length > 0;
        this.reportRequest(request3, "shown", preflightOutcome, uncheckedReason, hostPreflightMs);
        this.markShown(request3.agentId, requestId2);
        return {
          kind: "started",
          requestId: requestId2,
          ...liveHost != null ? { liveHost } : {},
          ...skipped2 ? { skippedFieldKinds: preflight.doomedFieldKinds } : {}
        };
      }
    );
  }
  reportRequest(request3, outcome, preflightOutcome, uncheckedReason, hostPreflightMs) {
    const domainTag = this.domainTag(request3.form.domain);
    userFormRequest.increment(this.deps.ctx, 1, {
      reason: request3.form.reason,
      outcome,
      preflight_outcome: preflightOutcome,
      has_fill_target: String(request3.form.fields.some((field) => field.target != null)),
      submit_after_fill: String(request3.form.submitAfterFill === true),
      ...domainTag
    });
    if (preflightOutcome === "unchecked" && uncheckedReason != null) {
      userFormPreflightUnchecked.increment(this.deps.ctx, 1, {
        reason: request3.form.reason,
        outcome,
        unchecked_reason: uncheckedReason
      });
    }
    if (hostPreflightMs !== void 0) {
      userFormStageDuration.histogram(this.deps.ctx, hostPreflightMs, {
        stage: "host_request_preflight",
        reason: request3.form.reason,
        outcome,
        client_platform: "unknown",
        failure_reason: "none",
        fill_attempted: "unknown",
        timing_source: "host_monotonic",
        ...domainTag
      });
    }
  }
  markShown(agentId, requestId2) {
    const pending = this.pendingByAgent.get(agentId);
    if (pending == null) return;
    const form = pending.get(requestId2);
    if (form == null) return;
    pending.set(requestId2, { ...form, shownAtMs: Date.now() });
  }
  recordResolution(report) {
    const domainTag = this.domainTag(report.domain);
    userFormResolution.increment(this.deps.ctx, 1, {
      reason: report.reason,
      outcome: report.outcome,
      client_platform: report.clientPlatform,
      failure_reason: report.failureReason ?? "none",
      fill_attempted: String(report.fillAttempted),
      live_host_captured: String(report.liveHostCaptured),
      submit_after_fill_attempted: optionalBooleanMetricTag(report.submitAfterFillAttempted),
      submit_after_fill_succeeded: optionalBooleanMetricTag(report.submitAfterFillSucceeded),
      remap_outcome: report.remapOutcome ?? "none_offered",
      heal_outcome: report.healOutcome ?? "none",
      ...domainTag
    });
    if (report.failureReason === "driver_unavailable" && report.driverFailureStage != null) {
      userFormDriverUnavailable.increment(this.deps.ctx, 1, {
        reason: report.reason,
        client_platform: report.clientPlatform,
        stage: report.driverFailureStage
      });
    }
    if (report.timing.source === "missing") {
      userFormResolutionTimingMissing.increment(this.deps.ctx, 1, {
        reason: report.reason,
        outcome: report.outcome,
        client_platform: report.clientPlatform
      });
    } else {
      userFormTimeToResolve.histogram(this.deps.ctx, report.timing.durationMs, {
        reason: report.reason,
        outcome: report.outcome,
        client_platform: report.clientPlatform,
        timing_source: report.timing.source
      });
    }
    const stageLabels = {
      reason: report.reason,
      outcome: report.outcome,
      client_platform: report.clientPlatform,
      failure_reason: report.failureReason ?? "none",
      fill_attempted: String(report.fillAttempted),
      ...domainTag
    };
    const reportStage = ({ stage, durationMs, timingSource }) => {
      userFormStageDuration.histogram(this.deps.ctx, durationMs, {
        stage,
        ...stageLabels,
        timing_source: timingSource
      });
    };
    if (report.cardWaitTiming.source !== "missing") {
      reportStage({
        stage: "form_card_wait",
        durationMs: report.cardWaitTiming.durationMs,
        timingSource: report.cardWaitTiming.source
      });
    }
    const host = report.hostFillTiming;
    if (host !== void 0) {
      for (const [stage, durationMs] of [
        ["host_prefill", host.prefillMs],
        ["host_fill_write", host.writeMs],
        ["host_heal", host.healMs],
        ["host_submit", host.submitMs],
        ["total_host_fill", host.totalMs]
      ]) {
        if (durationMs !== void 0) {
          reportStage({ stage, durationMs, timingSource: "host_monotonic" });
        }
      }
    }
    if (report.hostRemapMs !== void 0) {
      reportStage({
        stage: "host_remap",
        durationMs: report.hostRemapMs,
        timingSource: "host_monotonic"
      });
    }
  }
  domainTag(domain2) {
    const tag = userFormDomainMetricTag(domain2, this.deps.privacyMode.get());
    return tag === void 0 ? {} : { domain: tag };
  }
  async probeLiveHostAndPreflightFailingOpen(agentId, form) {
    const unchecked = { checked: false, doomedFieldKinds: {} };
    if (form.domain == null) return { liveHost: void 0, preflight: unchecked };
    const runnerStart = await this.createRunner(agentId);
    if (runnerStart.kind === "unavailable") {
      return {
        liveHost: void 0,
        preflight: unchecked,
        uncheckedReason: runnerStart.stage,
        driverUnavailable: true
      };
    }
    const observed = observeUserFormDriverFailures(runnerStart.runner);
    try {
      const liveHost = await resolveUserFormLiveHost(this.deps.ctx, observed.runner, form.domain);
      const preflight = await preflightUserFormTargets(
        this.deps.ctx,
        observed.runner,
        form.fields,
        form.domain
      );
      return {
        liveHost,
        preflight,
        ...!preflight.checked ? {
          uncheckedReason: observed.firstFailureStage() ?? "page_unavailable_or_mismatch"
        } : {}
      };
    } catch (error41) {
      reportFallback("user_form_service", error41);
      return {
        liveHost: void 0,
        preflight: unchecked,
        uncheckedReason: observed.firstFailureStage() ?? "preflight_exception"
      };
    }
  }
  end(agentId, requestId2) {
    const pending = this.pendingByAgent.get(agentId);
    if (pending == null) return null;
    const live = pending.get(requestId2);
    if (live == null) return null;
    pending.delete(requestId2);
    if (pending.size === 0) this.pendingByAgent.delete(agentId);
    return live;
  }
  async fill(agentId, values, consentedHost, submitAfterFill) {
    const timing = createUserFormHostFillTiming();
    const runnerStart = await this.createRunner(agentId);
    if (runnerStart.kind === "unavailable") {
      return {
        ...driverUnavailableFillResult(values, submitAfterFill),
        driverFailureStage: runnerStart.stage,
        hostTiming: timing.finish()
      };
    }
    const observed = observeUserFormDriverFailures(runnerStart.runner);
    try {
      const result = await fillSandUserFormValues(
        this.deps.ctx,
        observed.runner,
        values,
        consentedHost,
        submitAfterFill,
        timing.observe
      );
      const stage = observed.firstFailureStage();
      const driverRemainedUnavailable = Object.values(result.fillFailureKinds ?? {}).includes(
        "driver_unavailable"
      );
      return {
        ...result,
        ...stage != null && driverRemainedUnavailable ? { driverFailureStage: stage } : {},
        hostTiming: timing.finish()
      };
    } catch (error41) {
      reportFallback("user_form_service", error41);
      return {
        ...driverUnavailableFillResult(values, submitAfterFill),
        driverFailureStage: observed.firstFailureStage() ?? "fill_exception",
        hostTiming: timing.finish()
      };
    }
  }
  async runRemap(agentId, values, consentedHost) {
    const startedAt = performance.now();
    const finish = (result2) => ({
      ...result2,
      hostRemapMs: Math.max(0, performance.now() - startedAt)
    });
    const runnerStart = await this.createRunner(agentId);
    if (runnerStart.kind === "unavailable") {
      return finish({
        ...driverUnavailableFillResult(values),
        driverFailureStage: runnerStart.stage
      });
    }
    const observed = observeUserFormDriverFailures(runnerStart.runner);
    const result = await remapSandUserFormValues(
      this.deps.ctx,
      observed.runner,
      values,
      consentedHost
    );
    const stage = observed.firstFailureStage();
    return finish(stage != null ? { ...result, driverFailureStage: stage } : result);
  }
  async createRunner(agentId) {
    const first = await this.createRunnerOnce(agentId);
    if (first.kind === "ready") return first;
    await (this.deps.runnerRetry ?? RUNNER_RETRY).schedule(1).elapsed;
    return this.createRunnerOnce(agentId);
  }
  async createRunnerOnce(agentId) {
    let connection;
    try {
      connection = await this.deps.box.ensureReady(this.deps.ctx, agentId);
    } catch (error41) {
      reportFallback("user_form_service", error41);
      return { kind: "unavailable", stage: "ensure_ready" };
    }
    const windowIndex = boxAgentWindowIndex(this.deps.box, agentId);
    if (windowIndex === void 0) return { kind: "unavailable", stage: "window_missing" };
    return {
      kind: "ready",
      runner: createSandBrowserOpRunner({
        resourceAccessor: connection.remoteAccessor,
        agentBox: this.deps.box,
        boxId: agentId,
        terminalsFolder: connection.terminalsFolder,
        windowIndex,
        protectSubmittedValues: true
      })
    };
  }
};
function createUserFormHostFillTiming() {
  const startedAt = performance.now();
  const durations2 = /* @__PURE__ */ new Map();
  return {
    observe: (stage, durationMs) => {
      const duration3 = Number.isFinite(durationMs) ? Math.max(0, durationMs) : 0;
      durations2.set(stage, (durations2.get(stage) ?? 0) + duration3);
    },
    finish: () => {
      const totalMs = Math.max(0, performance.now() - startedAt);
      const writeMs = durations2.get("write");
      const healMs = durations2.get("heal");
      const submitMs = durations2.get("submit");
      const measuredMs = (writeMs ?? 0) + (healMs ?? 0) + (submitMs ?? 0);
      return {
        prefillMs: Math.max(0, totalMs - measuredMs),
        ...writeMs !== void 0 ? { writeMs } : {},
        ...healMs !== void 0 ? { healMs } : {},
        ...submitMs !== void 0 ? { submitMs } : {},
        totalMs
      };
    }
  };
}
function observeUserFormDriverFailures(runner) {
  let firstFailureStage;
  return {
    runner: {
      run: async (ctx, op, args) => {
        const result = await runner.run(ctx, op, args);
        if (result.infra === true) {
          firstFailureStage ??= userFormDriverFailureStage(op);
        }
        return result;
      }
    },
    firstFailureStage: () => firstFailureStage
  };
}
function userFormDriverFailureStage(op) {
  switch (op) {
    case "screenshot":
      return "page_probe";
    case "tabs":
      return "tab_management";
    case "snapshot":
      return "target_lookup";
    case "fill":
    case "select_option":
      return "fill";
    case "type":
      return "submit";
    default:
      return "other";
  }
}
function classifyUserFormPreflight(form, preflight) {
  if (!preflight.checked) return "unchecked";
  if (isUserFormPreflightUnfillable(form.fields, preflight)) return "unfillable";
  return Object.keys(preflight.doomedFieldKinds).length > 0 ? "partially_unfillable" : "fillable";
}
function optionalBooleanMetricTag(value) {
  return value === void 0 ? "none" : String(value);
}
function userFormDomainMetricTag(domain2, privacyMode) {
  if (domain2 == null || !userFormDomainTagAllowed(privacyMode)) return void 0;
  const bucket = boundedSiteBucket(domain2);
  return bucket.length > USER_FORM_DOMAIN_TAG_MAX_LENGTH ? void 0 : bucket;
}
function userFormDomainTagAllowed(state) {
  if (state.kind !== "resolved") return false;
  switch (state.privacyMode) {
    case PrivacyMode.USAGE_DATA_TRAINING_ALLOWED:
    case PrivacyMode.USAGE_CODEBASE_TRAINING_ALLOWED:
      return true;
    case PrivacyMode.NO_STORAGE:
    case PrivacyMode.NO_TRAINING:
    case PrivacyMode.UNSPECIFIED:
      return false;
    default:
      return false;
  }
}
