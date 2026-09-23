var MAX_STEPS = 40;
var MAX_CANDIDATES = 60;
var SNAPSHOT_MAX_CHARS = 4e4;
var ACTIVITY_LINES = 200;
function reportText(outcome) {
  return outcome.kind === "answered" ? outcome.answer : `The browser subagent stopped before finishing: ${outcome.reason}.`;
}
function runOutlineEntries(run) {
  const steps = run.progress.length === 0 ? [] : [
    {
      kind: "thinking",
      id: `jev-steps-${run.requestId}`,
      text: run.progress.join("\n"),
      durationMs: run.endedAtMs - run.startedAtMs
    }
  ];
  return [
    {
      kind: "user",
      id: `jev-user-${run.requestId}`,
      text: run.prompt,
      timestampMs: run.startedAtMs
    },
    ...steps,
    { kind: "assistant-text", id: `jev-answer-${run.requestId}`, text: run.report }
  ];
}
function messageOf(error42) {
  return error42 instanceof Error ? error42.message : String(error42);
}
var JevBrowserSubagentRunner = class {
  options;
  abort = new AbortController();
  runId = (0, import_node_crypto78.randomUUID)();
  activity = [];
  toolCalls = 0;
  turnEnded = 0;
  outline = [];
  constructor(options2) {
    this.options = options2;
  }
  async run(prompt, options2) {
    const requestId2 = options2?.inferenceRequestId ?? this.runId;
    const startedAtMs = Date.now();
    const baseCtx = createContext().with(
      loggerKey,
      this.options.loggerBackend ?? { log: () => {
      } }
    );
    const ctx = (this.options.metricsBackend === void 0 ? baseCtx : baseCtx.with(metricsKey, this.options.metricsBackend)).with(conversationIdKey, this.options.subagentAgentId).with(
      conversationGroupIdKey,
      this.options.conversationGroupId ?? this.options.subagentAgentId
    ).with(requestIdKey, requestId2);
    this.options.emit?.({ type: "request-id", requestId: requestId2 });
    const progress = [];
    const note = (line) => {
      this.activity.push(line);
      if (this.activity.length > ACTIVITY_LINES) this.activity.shift();
      if (!line.startsWith("  ")) {
        progress.push(line.trim());
        this.options.emit?.({ type: "thinking-delta", text: `${line.trim()}
` });
      }
    };
    const outcome = await this.browse(ctx, prompt, note);
    this.turnEnded += 1;
    const report = reportText(outcome);
    note(`report (${String(report.length)} chars): ${report.replace(/\s+/g, " ").slice(0, 400)}`);
    this.options.emit?.({ type: "text-delta", text: report });
    this.options.emit?.({ type: "turn-ended" });
    await this.options.releaseWindow?.(ctx).catch((caught) => {
      note(`window release failed: ${messageOf(caught)}`);
    });
    this.outline.push(
      ...runOutlineEntries({
        requestId: requestId2,
        prompt,
        progress,
        report,
        startedAtMs,
        endedAtMs: Date.now()
      })
    );
    if (this.options.agentStore !== void 0 && this.options.blobStore !== void 0) {
      await checkpointJevTranscript({
        ctx,
        agentStore: this.options.agentStore,
        blobStore: this.options.blobStore,
        requestId: requestId2,
        prompt,
        progress,
        answer: report,
        startedAtMs
      }).catch((caught) => {
        note(`transcript checkpoint failed: ${messageOf(caught)}`);
      });
    }
    return {
      text: report,
      finalAssistantText: report,
      sentMessageCount: 0,
      reacted: false,
      aborted: this.abort.signal.aborted
    };
  }
  async browse(ctx, prompt, note) {
    const telemetry = createJevTelemetry(ctx, {
      model: this.options.modelId,
      subagentId: this.options.subagentAgentId
    });
    const model = telemetry.model(
      new CursorTextModel({
        ctx,
        inference: this.options.inference,
        modelId: this.options.modelId,
        session: { isSubagent: true, skipLabeling: true }
      })
    );
    const jev = telemetry.decider(new JevDecider(this.options.typeSafe));
    try {
      const browser = telemetry.browser(
        new BoxDriverBrowser({
          ctx,
          signal: this.abort.signal,
          driver: await this.options.createDriver(ctx),
          snapshotMaxChars: SNAPSHOT_MAX_CHARS,
          callIdPrefix: `jev-${this.options.subagentAgentId}`,
          readBoxFile: (boxPath) => this.options.readBoxFile(ctx, boxPath),
          note: (line) => note(`  driver ${line}`)
        })
      );
      const plan = await planTask(prompt, model, jev, {
        searchUrlTemplate: DEFAULT_SEARCH_URL_TEMPLATE,
        log: note
      });
      note(`plan  task: ${plan.task}`);
      note(`      start: ${plan.startingUrl} (${plan.reason})`);
      const result = await runAgentLoop(
        { prompt, plan, browser, jev, model },
        {
          maxSteps: MAX_STEPS,
          maxCandidates: MAX_CANDIDATES,
          thresholds: DEFAULT_THRESHOLDS,
          isFatalError: (caught) => caught instanceof DeferredInteractionResponseError,
          observer: telemetry.observer,
          log: { info: note, debug: () => {
          } },
          onStep: async () => {
            this.toolCalls += 1;
            if (this.abort.signal.aborted) {
              throw new Error(
                this.abort.signal.reason instanceof Error ? this.abort.signal.reason.message : "interrupted"
              );
            }
          }
        }
      );
      return { kind: "answered", answer: result.answer };
    } catch (caught) {
      telemetry.endWithoutFinish(this.abort.signal.aborted ? "interrupted" : "error");
      if (caught instanceof DeferredInteractionResponseError) throw caught;
      const reason = messageOf(caught);
      note(`error: ${reason}`);
      return { kind: "stopped", reason };
    }
  }
  interrupt(reason) {
    if (this.abort.signal.aborted) return false;
    this.abort.abort(new Error(reason));
    return true;
  }
  async getResolvedOutline() {
    return [...this.outline];
  }
  getComputerUseUsageSnapshot() {
    return { modelId: this.options.modelId, turnEndedCount: this.turnEnded, usage: void 0 };
  }
  getObservedToolCallCount() {
    return this.toolCalls;
  }
  getComputerUseAuditActionCounts() {
    return /* @__PURE__ */ new Map();
  }
  getActivitySnapshot() {
    return [...this.activity];
  }
  getTranscriptPath() {
    return null;
  }
};
