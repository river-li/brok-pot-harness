/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/voice-call-runtime.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_fs97 = require("node:fs");
var import_node_path161 = require("node:path");
init_errors();

// @recovered-fragment 2/2
var VOICE_CALLS_DIR = "voice-calls";
function voiceCallsDir(agentId) {
  return (0, import_node_path161.join)(resolveSandAgentDir(agentId), VOICE_CALLS_DIR);
}
function voiceCallPath({ agentId, callId }) {
  return (0, import_node_path161.join)(voiceCallsDir(agentId), `${callId}.json`);
}
function readRecordFile(ref) {
  try {
    const value = JSON.parse((0, import_node_fs97.readFileSync)(voiceCallPath(ref), "utf8"));
    return SandVoiceCallRecords.isRecord(value) ? { kind: "record", record: value } : { kind: "unreadable" };
  } catch (error42) {
    reportFallbackUnlessAbsent("voice_call_runtime", error42);
    return { kind: "unreadable" };
  }
}
var SandVoiceCallReceiptUndeliverableError = class extends SandDomainError {
  name = "SandVoiceCallReceiptUndeliverableError";
};
var SandVoiceRelayDroppedError = class extends SandDomainError {
  name = "SandVoiceRelayDroppedError";
};
async function writeRecordFile(record2) {
  const target = voiceCallPath({ agentId: record2.agentId, callId: record2.callId });
  const bytes = new TextEncoder().encode(`${JSON.stringify(record2, null, 2)}
`);
  await writeFileAtomic(target, bytes);
}
var NOT_WORTH_OVERHEARING = /* @__PURE__ */ new Set([
  SEND_MESSAGE_TOOL_CALL_OUTLINE_NAME,
  SAND_SEND_TO_USER_TOOL_NAME,
  "SendMessage",
  "ReactToMessage",
  "update_state",
  COMMUNICATE_ENVELOPE_TOOL_NAME
]);
var OVERHEARD_CALL_BUDGET = { seeds: 120, chars: 6e4 };
function isWorthOverhearing(toolName) {
  return !NOT_WORTH_OVERHEARING.has(toolName);
}
function overheardStep({ tool, detail }) {
  return [tool, detail].filter((part) => part != null).join(" ");
}
var VoiceCallRuntime = class _VoiceCallRuntime {
  constructor(tm) {
    this.tm = tm;
  }
  tm;
  nudgeListeners = /* @__PURE__ */ new Set();
  liveCallByAgent = /* @__PURE__ */ new Map();
  retiredCallByAgent = /* @__PURE__ */ new Map();
  acceptedRequestsByCall = /* @__PURE__ */ new Map();
  overheardCallers = /* @__PURE__ */ new Set();
  thinkingBlockInFlight = /* @__PURE__ */ new Map();
  resolvedToolActivity = /* @__PURE__ */ new Map();
  serverStepHeardByAgent = /* @__PURE__ */ new Map();
  overheardSpentByAgent = /* @__PURE__ */ new Map();
  spokenServerSendIds = /* @__PURE__ */ new Set();
  finalWord = new VoiceCallFinalWord();
  isOverheardEnabled = () => false;
  isSteerEnabled = () => false;
  isFinalWordEnabled = () => false;
  authorCardCopy = () => Promise.resolve(void 0);
  subscribeInboundNudges(listener) {
    this.nudgeListeners.add(listener);
    return () => void this.nudgeListeners.delete(listener);
  }
  setOverheardGate(isEnabled) {
    this.isOverheardEnabled = isEnabled;
  }
  setSteerGate(isEnabled) {
    this.isSteerEnabled = isEnabled;
  }
  setFinalWordGate(isEnabled) {
    this.isFinalWordEnabled = isEnabled;
  }
  setCardCopyAuthor(author) {
    this.authorCardCopy = author;
  }
  setVoiceCallPresence({
    agentId,
    callId,
    isOnTheLine,
    acceptsOverheard = false
  }) {
    if (isOnTheLine) {
      if (this.retiredCallByAgent.get(agentId) === callId) return;
      this.liveCallByAgent.set(agentId, callId);
      this.overheardSpentByAgent.delete(agentId);
      this.serverStepHeardByAgent.delete(agentId);
      if (acceptsOverheard) this.overheardCallers.add(agentId);
      return;
    }
    this.retiredCallByAgent.set(agentId, callId);
    if (this.liveCallByAgent.get(agentId) !== callId) return;
    this.liveCallByAgent.delete(agentId);
    this.overheardCallers.delete(agentId);
    this.overheardSpentByAgent.delete(agentId);
    this.serverStepHeardByAgent.delete(agentId);
    this.dropTheBlockInFlight(agentId);
  }
  overhear(update, agentId) {
    if (update.type === "request-id") {
      void this.stampRequestId({ agentId, requestId: update.requestId });
    }
    this.readTheFinalWordOntoTheLine(update, agentId);
    if (!this.isOverheardEnabled()) return;
    const requestSource = this.tm.turnRuntime.activeRequestSources.get(agentId);
    if (!VoiceCallChannel.isOwnerStarted(requestSource)) return;
    if (update.type === "thinking-delta") {
      if (update.text.length === 0) return;
      const pooled = (this.thinkingBlockInFlight.get(agentId) ?? "") + update.text;
      this.thinkingBlockInFlight.set(
        agentId,
        pooled.slice(0, VoiceCallItemSeeding.OVERHEARD_CHAR_LIMIT)
      );
      return;
    }
    if (update.type === "turn-ended" || update.type === "retrying") {
      this.dropTheBlockInFlight(agentId);
      return;
    }
    const finishedBlock = this.thinkingBlockInFlight.get(agentId);
    if (finishedBlock !== void 0) {
      this.thinkingBlockInFlight.delete(agentId);
      this.deliverOverheard(finishedBlock, agentId);
    }
    if (update.type !== "tool-call") return;
    const activity = deriveToolCallActivity(update);
    const resolvedByCall = this.resolvedToolActivity.get(agentId);
    if (update.status !== "done") {
      if (activity.tool === COMMUNICATE_ENVELOPE_TOOL_NAME) return;
      if (resolvedByCall == null) {
        this.resolvedToolActivity.set(agentId, /* @__PURE__ */ new Map([[update.id, activity]]));
        return;
      }
      resolvedByCall.set(update.id, activity);
      return;
    }
    const resolved = resolvedByCall?.get(update.id) ?? activity;
    resolvedByCall?.delete(update.id);
    if (resolved.tool == null || !isWorthOverhearing(resolved.tool)) return;
    this.deliverOverheard(overheardStep(resolved), agentId);
  }
  overhearServerActivity(agentId, live) {
    if (!this.isOverheardEnabled()) return;
    const step = _VoiceCallRuntime.ownerSessionServerStep(live);
    if (step === void 0) {
      this.serverStepHeardByAgent.delete(agentId);
      return;
    }
    if (areAgentActivitiesEqual(this.serverStepHeardByAgent.get(agentId), step)) return;
    if (step.tool == null || !isWorthOverhearing(step.tool)) return;
    if (this.deliverOverheard(overheardStep(step), agentId)) {
      this.serverStepHeardByAgent.set(agentId, step);
    }
  }
  static ownerSessionServerStep(live) {
    if (live?.isRunning !== true) return void 0;
    if (!live.runningSessionIds?.includes(DEFAULT_GROK_BOT_SESSION_ID)) return void 0;
    const activity = live.currentActivity;
    return activity?.kind === "tool" ? activity : void 0;
  }
  forgetOverheard(agentId) {
    this.dropTheBlockInFlight(agentId);
    this.finalWord.abandonTheTurn(agentId);
  }
  dropTheBlockInFlight(agentId) {
    this.thinkingBlockInFlight.delete(agentId);
    this.resolvedToolActivity.delete(agentId);
  }
  readTheFinalWordOntoTheLine(update, agentId) {
    if (!this.isFinalWordEnabled()) return;
    const word = this.finalWord.wordOwedToTheLineAfter(update, agentId);
    if (word === null) return;
    const requestSource = this.tm.turnRuntime.activeRequestSources.get(agentId);
    if (!VoiceCallChannel.isOwnerStarted(requestSource)) return;
    const typedInTheChat2 = requestSource === "turn" ? this.tm.turnRuntime.activeRequestPrompts.get(agentId) : void 0;
    const said = typedInTheChat2 === void 0 ? word : VoiceCallFinalWord.asAnUpdateOnTheLine({ job: typedInTheChat2, word });
    this.deliverToLiveCall({ agentId, update: said, kind: "outcome" });
  }
  deliverOverheard(step, agentId) {
    if (step.length === 0 || !this.overheardCallers.has(agentId)) return false;
    const seed = step.slice(0, VoiceCallItemSeeding.OVERHEARD_CHAR_LIMIT);
    const spent = this.overheardSpentByAgent.get(agentId) ?? { seeds: 0, chars: 0 };
    if (spent.seeds >= OVERHEARD_CALL_BUDGET.seeds || spent.chars + seed.length > OVERHEARD_CALL_BUDGET.chars) {
      return false;
    }
    this.overheardSpentByAgent.set(agentId, {
      seeds: spent.seeds + 1,
      chars: spent.chars + seed.length
    });
    return this.deliverToLiveCall({ agentId, update: seed, kind: "overheard" });
  }
  lineIsOpen({
    agentId,
    address
  }) {
    const callId = VoiceCallChannel.callIdOf(address);
    return callId !== null && this.liveCallByAgent.get(agentId) === callId;
  }
  speak({
    agentId,
    address,
    text: text2
  }) {
    const spoken = VoiceCallChannelSends.spokenText(text2);
    const refusal = this.refuseUnlessSpeakable({ agentId, address, spokenText: spoken });
    if (refusal !== null) return refusal;
    const callId = VoiceCallChannel.callIdOf(address);
    if (callId === null || spoken === null) return "call-closed";
    this.emitInbound({ agentId, callId, update: spoken, kind: "outcome" });
    this.finalWord.spokenOnTheLine(agentId);
    return null;
  }
  forwardServerVoiceChannelSend(event) {
    if (event.type !== "appended") return;
    const { entry, agentId } = event;
    if (agentId === void 0) return;
    if (entry.kind !== "send-message") return;
    if (entry.message.type !== "text") return;
    const address = entry.message.channel;
    if (address === void 0) return;
    const callId = VoiceCallChannel.callIdOf(address);
    if (callId === null) return;
    const spokenKey = `${agentId}:${entry.id}`;
    if (this.spokenServerSendIds.has(spokenKey)) return;
    const spoken = VoiceCallChannelSends.spokenText(entry.message.content);
    if (spoken === null) return;
    if (!this.lineIsOpen({ agentId, address })) return;
    this.spokenServerSendIds.add(spokenKey);
    this.emitInbound({ agentId, callId, update: spoken, kind: "outcome" });
    this.finalWord.spokenOnTheLine(agentId);
  }
  refusalFor({
    agentId,
    address,
    message
  }) {
    const outbound = buildChannelOutboundMessage(message);
    return this.refuseUnlessSpeakable({
      agentId,
      address,
      spokenText: outbound?.kind === "text" ? VoiceCallChannelSends.spokenText(outbound.text) : null
    });
  }
  refuseUnlessSpeakable({
    agentId,
    address,
    spokenText
  }) {
    return VoiceCallChannelSends.refusal({
      isLive: this.lineIsOpen({ agentId, address }),
      spokenText
    });
  }
  deliverToLiveCall({ agentId, update, kind }) {
    const liveCallId = this.liveCallByAgent.get(agentId);
    if (liveCallId === void 0) return false;
    this.emitInbound({ agentId, callId: liveCallId, kind, update });
    return true;
  }
  readMainAgentContext({ agentId }) {
    return Promise.resolve({
      agentId,
      isWorking: this.tm.runLifecycle.runningAgentIds().has(agentId)
    });
  }
  readWrittenMessages(agentId) {
    return VoiceCallWrittenMessages.recall(
      (query) => this.tm.sessionStore.readAgentTranscriptTail(agentId, query)
    );
  }
  async nudge(args) {
    if (args.request.trim().length === 0) return { kind: "refused", refusal: "empty-request" };
    const parsed2 = VoiceCallRequests.parse(args.request);
    if (parsed2.kind === "rejected") throw new SandWireParseError(parsed2.error);
    const request5 = parsed2.request;
    if (args.sink.kind === "server-loop") {
      let output;
      try {
        output = await args.sink.relay({ callId: args.callId, request: request5 });
      } catch (error42) {
        reportFallback("voice_call_runtime", error42);
        return { kind: "refused", refusal: "agent-unavailable" };
      }
      if (output.relay !== "accepted") return { kind: "refused", refusal: "agent-unavailable" };
      this.rememberAccepted(args.callId, request5);
      return { kind: "accepted" };
    }
    const text2 = MainLoopVoicePrompt.relayed({ request: request5 });
    const session = await this.resolveSession(args.agentId);
    if (session === null || !this.tm.execution.canExecute) {
      return { kind: "refused", refusal: "agent-unavailable" };
    }
    const envelope = this.envelope({ callId: args.callId, text: text2 });
    const steered = this.steerTheLiveTurn(session, envelope);
    if (steered === null) {
      if (!this.tm.backgroundWakes.wakeForInbound(args.agentId, envelope)) {
        return { kind: "refused", refusal: "agent-unavailable" };
      }
    } else {
      const alreadyShownByTheSteer = { ...envelope, isDisplayed: true };
      void this.queueIfTheSteerIsDropped(
        { agentId: args.agentId, callId: args.callId },
        steered,
        () => this.tm.backgroundWakes.wakeForInbound(args.agentId, alreadyShownByTheSteer)
      );
    }
    this.rememberAccepted(args.callId, request5);
    return { kind: "accepted" };
  }
  rememberAccepted(callId, request5) {
    this.acceptedRequestsByCall.set(callId, [
      ...this.acceptedRequestsByCall.get(callId) ?? [],
      request5
    ]);
  }
  steerTheLiveTurn(session, envelope) {
    if (!this.isSteerEnabled()) return null;
    if (!this.tm.runLifecycle.runningAgentIds().has(session.id)) return null;
    if (!VoiceCallChannel.isOwnerStarted(this.tm.turnRuntime.activeRequestSources.get(session.id))) {
      return null;
    }
    const runner = this.tm.runnerRegistry.runners.get(session.id);
    if (runner === void 0) return null;
    const steered = runner.steer(
      [MainLoopVoicePrompt.midTurn(), "", buildChannelInboundWakePrompt([envelope])].join("\n"),
      { hidden: true }
    );
    if (steered.kind !== "steered") return null;
    appendChannelInboundEntries(this.tm, session, [
      {
        channel: formatChannelAddress(envelope.address),
        text: envelope.text,
        timestampMs: envelope.timestampMs,
        sender: envelope.sender
      }
    ]);
    return steered.deliveredAtStepBoundary;
  }
  async queueIfTheSteerIsDropped({ agentId, callId }, delivered, queue) {
    if (await delivered) return;
    if (queue()) return;
    const dropped = new SandVoiceRelayDroppedError(
      `agent ${agentId} could no longer be woken after its voice relay was accepted mid-turn, so the relay never ran`
    );
    this.tm.telemetry.reportAgentError({
      source: "resume",
      conversationId: agentId,
      error: classifyAgentError(dropped),
      detail: sandErrorDetail(dropped)
    });
    if (this.liveCallByAgent.get(agentId) !== callId) return;
    this.emitInbound({
      agentId,
      callId,
      kind: "outcome",
      update: "That task did not run. You could not get to your work."
    });
  }
  async record(record2, sink) {
    if (this.liveCallByAgent.get(record2.agentId) === record2.callId) {
      this.setVoiceCallPresence({
        agentId: record2.agentId,
        callId: record2.callId,
        isOnTheLine: false
      });
    }
    if (!isSafeFolderId(record2.callId)) {
      throw new SandVoiceCallReceiptUndeliverableError(
        `voice call ${record2.callId} has no storable id, so its hang-up receipt was dropped`
      );
    }
    await writeRecordFile(record2);
    const leftover = MainLoopVoicePrompt.leftoverFromTheEndedCall(
      VoiceCallLeftover.callerLines(record2, this.acceptedRequestsByCall.get(record2.callId) ?? [])
    );
    this.acceptedRequestsByCall.delete(record2.callId);
    await this.deliverReceipt(record2, sink, void 0);
    if (sink.kind === "box-chat") {
      this.wake({
        agentId: record2.agentId,
        callId: record2.callId,
        texts: leftover == null ? [VOICE_CALL_ENDED_MESSAGE] : [VOICE_CALL_ENDED_MESSAGE, leftover]
      });
    }
    void this.backfillCardCopy(record2, sink);
  }
  async deliverReceipt(record2, sink, authored) {
    switch (sink.kind) {
      case "server":
        await sink.publish(record2, authored);
        return;
      case "box-chat":
        await this.appendReceiptToBoxChat(record2, authored);
        return;
    }
  }
  async backfillCardCopy(record2, sink) {
    let authored;
    try {
      authored = await this.authorCardCopy(record2);
    } catch (error42) {
      reportFallback("voice_call_runtime", error42);
      return;
    }
    if (authored === void 0) return;
    try {
      switch (sink.kind) {
        case "server":
          await sink.publish(record2, authored);
          return;
        case "box-chat":
          await this.patchReceiptInBoxChat(record2, authored);
          return;
      }
    } catch (error42) {
      reportFallback("voice_call_runtime", error42);
    }
  }
  async appendReceiptToBoxChat(record2, authored) {
    const entries = voiceCallHangupEntries(record2, authored);
    if (entries.length === 0) return;
    const session = await this.resolveSession(record2.agentId);
    if (session === null) {
      throw new SandVoiceCallReceiptUndeliverableError(
        `agent ${record2.agentId} is unavailable, so the call was saved to disk but its hang-up receipt never reached the chat`
      );
    }
    if (this.tm.sessions.activeSession?.id === session.id) {
      for (const entry of entries) this.tm.appendEntry(entry);
      return;
    }
    for (const entry of entries) {
      session.db.appendTranscriptEntry(entry);
      this.tm.roster.emit({ type: "appended", entry }, session.id);
    }
    await this.tm.roster.emitAgentUpdate(session.id);
  }
  async patchReceiptInBoxChat(record2, authored) {
    const session = await this.resolveSession(record2.agentId);
    if (session === null) return;
    const entryId = voiceCallReceiptEntry(record2).id;
    const apply = (entry) => applyVoiceCallCardCopy(entry, authored);
    if (this.tm.sessions.activeSession?.id === session.id) {
      const updated2 = updateEntry(entryId, apply);
      if (updated2 == null || updated2.kind !== "voice-call" || updated2.call.description === void 0) {
        return;
      }
      this.tm.roster.emit({ type: "updated", entry: updated2 });
      session.db.updateTranscriptEntry(entryId, apply);
      return;
    }
    const updated = session.db.updateTranscriptEntry(entryId, apply);
    if (updated == null || updated.kind !== "voice-call" || updated.call.description === void 0) {
      return;
    }
    this.tm.roster.emit({ type: "updated", entry: updated }, session.id);
    await this.tm.roster.emitAgentUpdate(session.id);
  }
  read({ agentId, callId }) {
    if (!isSafeFolderId(callId)) return null;
    const stored = readRecordFile({ agentId, callId });
    return stored.kind === "record" ? stored.record : null;
  }
  async stampRequestId({ agentId, requestId: requestId2 }) {
    const addresses = this.tm.turnRuntime.activeChannelAddresses.get(agentId) ?? [];
    const callId = addresses.map((address) => VoiceCallChannel.callIdOf(address)).find((id) => id !== null && isSafeFolderId(id));
    if (callId == null) return;
    const stored = readRecordFile({ agentId, callId });
    if (stored.kind !== "record" || stored.record.agentRequestId === requestId2) return;
    try {
      await writeRecordFile({ ...stored.record, agentRequestId: requestId2 });
    } catch (error42) {
      this.tm.telemetry.reportAgentError({
        source: "resume",
        conversationId: agentId,
        error: classifyAgentError(error42),
        detail: sandErrorDetail(error42)
      });
    }
  }
  emitInbound(nudge) {
    for (const listener of this.nudgeListeners) listener(nudge);
  }
  wake({ agentId, callId, texts }) {
    const [first, ...rest] = texts.map((text2) => this.envelope({ callId, text: text2 }));
    if (first === void 0) return false;
    return this.tm.backgroundWakes.wakeForInbound(agentId, first, ...rest);
  }
  envelope({
    callId,
    text: text2
  }) {
    return {
      address: { platform: VOICE_CALL_CHANNEL_PLATFORM, chat: callId },
      text: text2,
      sender: VOICE_CALL_SENDER,
      timestampMs: Date.now()
    };
  }
  async resolveSession(agentId) {
    const resolved = await resolveSessionOrRefusal(this.tm, agentId);
    if (resolved.kind !== "session") return null;
    return this.tm.groupChat.isGroupSession(resolved.session) ? null : resolved.session;
  }
};
async function resolveSessionOrRefusal(tm, agentId) {
  try {
    return { kind: "session", session: await tm.sessions.resolveBackgroundSession(agentId) };
  } catch (error42) {
    if (!isAgentAbsent(error42)) reportFallback("voice_call_runtime", error42);
    return { kind: "unavailable" };
  }
}

