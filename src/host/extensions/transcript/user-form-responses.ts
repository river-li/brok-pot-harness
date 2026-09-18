var USER_FORM_TO_BOX_HELP_REASON = {
  auth: "auth",
  checkout: "payment",
  profile: "other",
  other: "other"
};
var UserFormResponses = class {
  constructor(tm, userForms) {
    this.tm = tm;
    this.userForms = userForms;
  }
  tm;
  userForms;
  entryIdsLatchedUntilResolutionStamp = /* @__PURE__ */ new Set();
  vault;
  setVault(vault) {
    this.vault = vault;
  }
  async submitUserForm(args) {
    const { entryId, values, agentId, platform: platform2 } = args;
    if (this.entryIdsLatchedUntilResolutionStamp.has(entryId)) return;
    this.entryIdsLatchedUntilResolutionStamp.add(entryId);
    const cardResolvedAtMs = Date.now();
    try {
      const located = await this.locatePendingForm(entryId, agentId);
      if (located == null) return;
      const { session, form, requestId: requestId2, entryTimestampMs } = located;
      const sessionId = session.id;
      const fillValues = userFormFillValuesOf(form, values);
      const consentedHost = form.liveHost ?? form.domain;
      const fillResult = await this.userForms.fill(
        sessionId,
        fillValues,
        consentedHost,
        isOneShotSubmitUserForm(form)
      );
      const settle = (result, options2) => this.settleSubmittedForm({
        entryId,
        session,
        form,
        requestId: requestId2,
        entryTimestampMs,
        values,
        fillValues,
        result,
        platform: platform2,
        cardResolvedAtMs,
        ...options2?.remapOutcome != null ? { remapOutcome: options2.remapOutcome } : {},
        ...options2?.wakeOutcomeUnseen === true ? { wakeOutcomeUnseen: true } : {}
      });
      const remap = remapHoldFor(fillResult, fillValues, requestId2, consentedHost);
      if (remap == null || !this.userForms.holdForRemap(sessionId, remap.hold)) {
        const allOutcomes = settle(fillResult, { wakeOutcomeUnseen: true });
        await this.tm.boxHandoff.resumeWithHiddenPrompt(
          sessionId,
          buildUserFormSubmittedAck(
            form,
            allOutcomes,
            fillResult.domainMismatch,
            fillResult.submit,
            fillResult.fillFailureKinds,
            fillResult.pageMoved
          ),
          "resume_after_user_form_failed",
          { wakeOutcomeEntryIds: [entryId] }
        );
        return;
      }
      try {
        await this.tm.boxHandoff.resumeWithHiddenPrompt(
          sessionId,
          buildUserFormSubmittedAck(
            form,
            userFormFieldOutcomesOf(form, fillResult),
            fillResult.domainMismatch,
            fillResult.submit,
            fillResult.fillFailureKinds,
            fillResult.pageMoved,
            remap.offer
          ),
          "resume_after_user_form_failed"
        );
      } finally {
        const settlement = this.userForms.settleRemap({
          agentId: sessionId,
          requestId: remap.hold.requestId
        });
        settle(mergeRemapSettlementIntoFillResult(fillResult, settlement), {
          remapOutcome: remapMetricOutcome(remap.hold, settlement)
        });
      }
    } finally {
      this.entryIdsLatchedUntilResolutionStamp.delete(entryId);
    }
  }
  settleSubmittedForm(args) {
    const {
      entryId,
      session,
      form,
      requestId: requestId2,
      entryTimestampMs,
      values,
      fillValues,
      result,
      platform: platform2
    } = args;
    const allOutcomes = userFormFieldOutcomesOf(form, result);
    const anyFillFailed = allOutcomes.some((outcome) => outcome.fillFailed === true) || result.domainMismatch != null;
    const resolution = anyFillFailed ? "fill_failed" : "submitted";
    this.stampResolution({
      entryId,
      session,
      resolution,
      outcomes: allOutcomes,
      wakeOutcomeUnseen: args.wakeOutcomeUnseen === true
    });
    if (resolution === "submitted" && this.vault != null) {
      const savableFields = form.fields.filter((field) => !isSecretUserFormField(field));
      const filledDomain = form.liveHost ?? form.domain;
      void this.vault.recordSuccessfulFill({
        fields: savableFields,
        values: Object.fromEntries(
          savableFields.flatMap((field) => {
            const value = values[field.id];
            return value != null ? [[field.id, value]] : [];
          })
        ),
        outcomes: allOutcomes,
        filledControls: result.filledControls ?? {},
        ...filledDomain != null ? { formDomain: filledDomain } : {}
      });
    }
    this.finishUserForm({
      agentId: session.id,
      form,
      requestId: requestId2,
      entryTimestampMs,
      outcome: resolution,
      platform: platform2,
      cardResolvedAtMs: args.cardResolvedAtMs,
      fill: {
        result,
        outcomes: allOutcomes,
        targetedFieldCount: fillValues.filter(isTargetedUserFormFillValue).length
      },
      ...args.remapOutcome != null ? { remapOutcome: args.remapOutcome } : {}
    });
    return allOutcomes;
  }
  async dismissUserForm(args) {
    const { entryId, mode, agentId, platform: platform2 } = args;
    if (this.entryIdsLatchedUntilResolutionStamp.has(entryId)) return;
    this.entryIdsLatchedUntilResolutionStamp.add(entryId);
    const cardResolvedAtMs = Date.now();
    try {
      const located = await this.locatePendingForm(entryId, agentId);
      if (located == null) return;
      const { session, form, requestId: requestId2, entryTimestampMs } = located;
      const sessionId = session.id;
      this.stampResolution({
        entryId,
        session,
        resolution: mode,
        wakeOutcomeUnseen: mode === "dismissed"
      });
      this.finishUserForm({
        agentId: sessionId,
        form,
        requestId: requestId2,
        entryTimestampMs,
        outcome: mode === "escalated" ? "escalated_to_box" : "dismissed",
        platform: platform2,
        cardResolvedAtMs
      });
      if (mode === "escalated") {
        await this.openBoxDirectlyAndLeaveAgentParkedForHandBack(sessionId, form);
        return;
      }
      await this.tm.boxHandoff.resumeWithHiddenPrompt(
        sessionId,
        buildUserFormDismissedAck(form),
        "resume_after_user_form_failed",
        { wakeOutcomeEntryIds: [entryId] }
      );
    } finally {
      this.entryIdsLatchedUntilResolutionStamp.delete(entryId);
    }
  }
  async openBoxDirectlyAndLeaveAgentParkedForHandBack(sessionId, form) {
    const trimmedInstruction = form.instruction.trim();
    const instruction = trimmedInstruction.length > 0 ? trimmedInstruction : form.title;
    const outcome = await this.userForms.startHandoff({
      agentId: sessionId,
      instruction,
      telemetry: {
        reason: USER_FORM_TO_BOX_HELP_REASON[form.reason],
        ...form.domain != null ? { domain: form.domain } : {}
      }
    });
    if (outcome.kind === "already-pending") return;
    const entry = stampBoxRequestEntry(
      createSendMessageEntry(
        nextEntryId(getTranscript(), "send-message"),
        { type: "text", content: instruction },
        Date.now()
      ),
      { requestId: outcome.requestId, instruction }
    );
    this.tm.sendPipeline.appendSendMessageEntry(entry);
    void this.tm.roster.emitAgentUpdate(sessionId);
  }
  async locatePendingForm(entryId, agentId) {
    await this.tm.sessions.ensureActionTarget(agentId);
    const session = this.tm.sessions.activeSession;
    if (session == null) return null;
    const entry = findEntry(entryId);
    if (entry == null || entry.kind !== "send-message" || entry.message.type !== "user-form" || entry.formResolution != null) {
      return null;
    }
    return {
      session,
      form: entry.message.formRequest,
      requestId: entry.formRequestId,
      entryTimestampMs: entry.timestampMs
    };
  }
  stampResolution({
    entryId,
    session,
    resolution,
    outcomes,
    wakeOutcomeUnseen
  }) {
    const apply = (item) => {
      if (item.kind !== "send-message" || item.formResolution != null) return item;
      const stamped = {
        ...item,
        formResolution: resolution,
        ...wakeOutcomeUnseen ? { wakeOutcomeUnseen: true } : {}
      };
      return outcomes != null ? { ...stamped, formFieldOutcomes: outcomes } : stamped;
    };
    const persisted = session.db.updateTranscriptEntry(entryId, apply);
    if (persisted == null) return;
    const live = this.tm.sessions.activeSession === session && this.tm.sessions.inMemoryTranscriptAgentId === session.id ? updateEntry(entryId, apply) : null;
    this.tm.roster.emit({ type: "updated", entry: live ?? persisted }, session.id);
  }
  finishUserForm(args) {
    const pending = args.requestId != null ? this.userForms.end(args.agentId, args.requestId) : null;
    const timing = pending != null ? userFormResolutionTiming("pending", pending.shownAtMs) : userFormResolutionTiming("transcript_fallback", args.entryTimestampMs);
    const cardWaitTiming = pending != null ? userFormResolutionTiming("pending", pending.shownAtMs, args.cardResolvedAtMs) : userFormResolutionTiming(
      "transcript_fallback",
      args.entryTimestampMs,
      args.cardResolvedAtMs
    );
    const fill = args.fill;
    const failureReason = fill != null ? classifyUserFormFailureReason(fill.result, fill.outcomes) : void 0;
    const submit = fill?.result.submit;
    const healOutcome = fill?.result.healOutcome ?? "none";
    this.userForms.recordResolution({
      reason: args.form.reason,
      outcome: args.outcome,
      clientPlatform: args.platform ?? "desktop",
      ...failureReason != null ? { failureReason } : {},
      fillAttempted: (fill?.targetedFieldCount ?? 0) > 0,
      liveHostCaptured: args.form.liveHost != null,
      ...args.form.domain != null ? { domain: args.form.domain } : {},
      ...fill?.result.driverFailureStage != null ? { driverFailureStage: fill.result.driverFailureStage } : {},
      ...submit != null ? { submitAfterFillAttempted: submit.attempted } : {},
      ...submit?.attempted === true ? { submitAfterFillSucceeded: submit.succeeded } : {},
      ...args.remapOutcome != null ? { remapOutcome: args.remapOutcome } : {},
      healOutcome,
      timing,
      cardWaitTiming,
      ...fill?.result.hostTiming != null ? { hostFillTiming: fill.result.hostTiming } : {},
      ...fill?.result.hostRemapMs != null ? { hostRemapMs: fill.result.hostRemapMs } : {}
    });
    this.tm.productAnalytics.trackEvent("sand.user_form", {
      agent_id: args.agentId,
      reason: args.form.reason,
      ...args.form.domain != null ? { domain: args.form.domain.slice(0, 64) } : {},
      field_count: args.form.fields.length,
      secret_field_count: args.form.fields.filter((field) => isSecretUserFormField(field)).length,
      outcome: args.outcome,
      ...timing.source !== "missing" ? { time_to_resolve_ms: timing.durationMs } : {},
      client_platform: args.platform ?? "desktop",
      live_host_captured: args.form.liveHost != null,
      ...args.form.liveHost != null ? { live_host: args.form.liveHost.slice(0, 64) } : {},
      ...fill != null ? {
        filled_field_count: fill.outcomes.filter((outcome) => outcome.filled).length,
        failed_field_count: fill.outcomes.filter((outcome) => outcome.fillFailed === true).length,
        targeted_field_count: fill.targetedFieldCount
      } : {},
      ...failureReason != null ? { failure_reason: failureReason } : {},
      ...submitAfterFillDebugProps(fill?.result.submit),
      ...args.remapOutcome != null ? { remap_outcome: args.remapOutcome } : {},
      heal_outcome: healOutcome
    });
  }
};
function remapHoldFor(result, fillValues, requestId2, consentedHost) {
  const offer = result.remap;
  if (offer == null || requestId2 == null || consentedHost == null || result.domainMismatch != null) {
    return void 0;
  }
  const offered = new Set(offer.fieldIds);
  const values = fillValues.filter((entry) => offered.has(entry.field.id));
  if (values.length === 0) return void 0;
  return {
    hold: { requestId: requestId2, consentedHost, values },
    offer: { ...offer, fieldIds: values.map((entry) => entry.field.id) }
  };
}
function mergeRemapSettlementIntoFillResult(fill, settlement) {
  const { remap: _spent, ...fillWithoutTheOffer } = fill;
  if (settlement.kind === "not_remapped") return fillWithoutTheOffer;
  const landed = new Set(
    settlement.result.outcomes.filter((outcome) => outcome.filled).map((outcome) => outcome.id)
  );
  const fillFailureKinds = Object.fromEntries(
    Object.entries(fill.fillFailureKinds ?? {}).filter(([id]) => !landed.has(id))
  );
  const filledControls = { ...fill.filledControls, ...settlement.result.filledControls };
  return {
    ...fillWithoutTheOffer,
    outcomes: fill.outcomes.map(
      (outcome) => landed.has(outcome.id) ? { id: outcome.id, filled: true } : outcome
    ),
    ...Object.keys(fillFailureKinds).length > 0 ? { fillFailureKinds } : {},
    ...Object.keys(filledControls).length > 0 ? { filledControls } : {},
    hostRemapMs: settlement.result.hostRemapMs
  };
}
function remapMetricOutcome(hold, settlement) {
  if (settlement.kind === "not_remapped") return "not_remapped";
  const landedCount = settlement.result.outcomes.filter((outcome) => outcome.filled).length;
  if (landedCount === 0) return "none";
  return landedCount === hold.values.length ? "landed" : "partial";
}
function userFormResolutionTiming(source, shownAtMs, resolvedAtMs = Date.now()) {
  if (shownAtMs === void 0) return { source: "missing" };
  const durationMs = resolvedAtMs - shownAtMs;
  return Number.isFinite(durationMs) && durationMs >= 0 ? { source, durationMs } : { source: "missing" };
}
function submitAfterFillDebugProps(submit) {
  if (submit == null) return {};
  if (!submit.attempted) return { submit_after_fill_attempted: false };
  return { submit_after_fill_attempted: true, submit_after_fill_succeeded: submit.succeeded };
}
