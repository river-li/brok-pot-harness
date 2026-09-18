var SandSubagentDispatchError = class extends Error {
};
var SAND_COMPUTER_USE_DESKTOP_BUSY_MESSAGE = "A computerUse subagent is already using the box's desktop. Only one can run at a time \u2014 wait for it to finish (you're notified automatically), then dispatch another.";
var SandRequestContextExecutor = class {
  constructor(requestContext, includeTranscripts, autoReviewEnforceEnabled, resolveAgentSkills, modelVisibleTime) {
    this.requestContext = requestContext;
    this.includeTranscripts = includeTranscripts;
    this.autoReviewEnforceEnabled = autoReviewEnforceEnabled;
    this.resolveAgentSkills = resolveAgentSkills;
    this.modelVisibleTime = modelVisibleTime;
  }
  requestContext;
  includeTranscripts;
  autoReviewEnforceEnabled;
  resolveAgentSkills;
  modelVisibleTime;
  rulesPromise;
  async execute(_ctx, _args) {
    const info2 = this.requestContext.resolve();
    const rules = await (this.rulesPromise ??= this.requestContext.resolveRules());
    const env = new RequestContextEnv({
      osVersion: info2.osVersion,
      shell: info2.shell,
      timeZone: info2.timeZone,
      agentTranscriptsFolder: this.includeTranscripts ? info2.transcriptsFolder : void 0,
      smartModeClassifierAutoModeEnabled: this.autoReviewEnforceEnabled,
      mountedAgentStores: [...info2.mountedAgentStores ?? []],
      devMockPromptTime: this.modelVisibleTime === void 0 ? void 0 : Timestamp.fromDate(this.modelVisibleTime)
    });
    return new RequestContextResult({
      result: {
        case: "success",
        value: new RequestContextSuccess({
          requestContext: new RequestContext({
            env,
            rules: rules ?? [],
            rulesInfoComplete: rules !== void 0,
            agentSkills: this.resolveAgentSkills?.() ?? [],
            mcpMetaToolOptions: new McpMetaToolOptions({ enabled: true, mcpDescriptors: [] })
          })
        })
      }
    });
  }
};
var SandSubagentHostAdapter = class {
  constructor(sessions, createRunner, dispatcher, launchReviewRequired, detached, quietOrigin, fallbackLineage, executorProfileNames) {
    this.sessions = sessions;
    this.createRunner = createRunner;
    this.dispatcher = dispatcher;
    this.launchReviewRequired = launchReviewRequired;
    this.detached = detached;
    this.quietOrigin = quietOrigin;
    this.fallbackLineage = fallbackLineage;
    this.executorProfileNames = executorProfileNames;
  }
  sessions;
  createRunner;
  dispatcher;
  launchReviewRequired;
  detached;
  quietOrigin;
  fallbackLineage;
  executorProfileNames;
  reviewLaunch;
  setLaunchReviewer(reviewLaunch) {
    this.reviewLaunch = reviewLaunch;
  }
  async createOrResumeSession(ctx, args) {
    if (ctx.get(pendingSubagentReplayKey)?.reattachOnly === true && this.detached?.supportsTaskReattachment !== true) {
      throw new SandSubagentDispatchError(
        "Retired Task reattachment requires a durable subagent host."
      );
    }
    if (this.detached !== void 0) {
      if (args.resumeAgentId != null && args.resumeAgentId.length > 0) {
        return args.resumeAgentId;
      }
      if (this.detached.mintSubagentId !== void 0) {
        return await this.detached.mintSubagentId({
          subagentType: args.subagentType || "generalPurpose",
          prompt: args.prompt,
          readonly: args.readonly
        });
      }
      return `${SAND_SUBAGENT_ID_PREFIX}${crypto.randomUUID()}`;
    }
    if (args.resumeAgentId != null && args.resumeAgentId.length > 0) {
      if (this.dispatcher.isRunning(args.resumeAgentId)) {
        throw new SandSubagentDispatchError(
          "That background subagent is still running, so it can't be resumed yet \u2014 you're notified automatically when it finishes. To act on it while it runs, use MessageSubagent to send it an instruction or StopSubagent to abort it (CheckSubagent shows how it's doing)."
        );
      }
      if (this.sessions.has(args.resumeAgentId)) return args.resumeAgentId;
    }
    const agentId = args.resumeAgentId ?? `${SAND_SUBAGENT_ID_PREFIX}${crypto.randomUUID()}`;
    const isComputerUse = isComputerUseSubagentType(args.subagentType);
    if (isComputerUse && this.dispatcher.allocateComputerUseWindow(agentId) == null) {
      throw new SandSubagentDispatchError(SAND_COMPUTER_USE_DESKTOP_BUSY_MESSAGE);
    }
    try {
      this.sessions.set(agentId, this.createRunner(agentId, args));
    } catch (error41) {
      if (isComputerUse) {
        this.dispatcher.freeComputerUseWindow(agentId);
      }
      throw error41;
    }
    return agentId;
  }
  async runSession(ctx, agentId, args) {
    if (this.detached !== void 0) {
      return await this.runDetachedSession(ctx, agentId, args, this.detached);
    }
    const runner = this.sessions.get(agentId);
    if (runner == null) {
      return { status: "error", error: `Unknown Grok Bot subagent: ${agentId}` };
    }
    if (this.dispatcher.isRunning(agentId)) {
      return {
        status: "error",
        error: "That background subagent is already running."
      };
    }
    const review = await this.reviewLaunchOrDeny(ctx, agentId, args);
    if (review !== void 0) {
      return review;
    }
    let selectedImages;
    try {
      selectedImages = args.selectedContext?.selectedImages.map(toSandSelectedImageInput);
    } catch (error41) {
      this.releaseSession(agentId);
      return { status: "error", error: error41 instanceof Error ? error41.message : String(error41) };
    }
    const parentTraceCtx = getSpan2(ctx) !== void 0 ? ctx : void 0;
    const lineage = deriveSandRequestLineage(ctx, args.toolCallId, this.fallbackLineage);
    this.dispatcher.dispatch({
      ...args.resumeAgentId ? { resume: true } : {},
      subagentAgentId: agentId,
      subagentType: args.subagentType || "generalPurpose",
      toolCallId: args.toolCallId,
      prompt: args.prompt,
      ...lineage != null ? {
        lineage: {
          parentRequestId: lineage.parentRequestId,
          rootParentRequestId: lineage.rootParentRequestId
        }
      } : {},
      run: () => runner.run(args.prompt, {
        selectedImages,
        selectedVideos: args.selectedContext?.selectedVideos,
        inferenceRequestId: args.toolCallId.length > 0 ? computeSubagentRequestId(args.toolCallId) : void 0,
        ...lineage != null ? { lineage } : {},
        ...parentTraceCtx !== void 0 ? { traceCtx: parentTraceCtx } : {}
      })
    });
    return {
      status: "background",
      backgroundReason: SubagentBackgroundReason.AGENT_REQUEST,
      toolCallCount: 0
    };
  }
  async reviewLaunchOrDeny(ctx, agentId, args) {
    if (this.launchReviewRequired && this.reviewLaunch === void 0) {
      this.releaseSession(agentId);
      return {
        status: "error",
        error: "Subagent launch review is required, but no launch reviewer is registered."
      };
    }
    if (this.reviewLaunch !== void 0) {
      const decision = await this.reviewLaunch(ctx, args);
      if (!decision.allowed) {
        this.releaseSession(agentId);
        return { status: "error", error: decision.reason };
      }
    }
    return void 0;
  }
  async runDetachedSession(ctx, agentId, args, detached) {
    const review = await this.reviewLaunchOrDeny(ctx, agentId, args);
    if (review !== void 0) {
      return review;
    }
    const lineage = deriveSandRequestLineage(ctx, args.toolCallId, this.fallbackLineage);
    const videoAttachments = (args.selectedContext?.selectedVideos ?? []).map((video) => ({
      uuid: video.uuid,
      path: video.path,
      mimeType: video.mimeType,
      filename: video.filename,
      fps: video.fps ?? 0
    }));
    try {
      const decision = this.dispatcher.getCombinedComputerUseDecision?.();
      const modelId = resolveSandSubagentModelId({
        subagentType: args.subagentType,
        modelId: args.modelId,
        acceptsExplicitModel: isMediaReviewSubagentType(args.subagentType),
        executorProfileNames: this.executorProfileNames?.() ?? /* @__PURE__ */ new Set()
      });
      await detached.dispatch({
        ...decision === void 0 ? {} : { combinedComputerUseDecision: decision },
        subagentAgentId: agentId,
        subagentType: args.subagentType || "generalPurpose",
        toolCallId: args.toolCallId,
        prompt: args.prompt,
        readonly: args.readonly ?? false,
        ...ctx.get(pendingSubagentReplayKey)?.reattachOnly === true && ctx.get(pendingSubagentReplayKey)?.toolCallId === args.toolCallId ? { reattachOnly: true } : {},
        ...modelId === void 0 ? {} : { modelId },
        resume: args.resumeAgentId != null && args.resumeAgentId.length > 0,
        ...videoAttachments.length > 0 ? { videoAttachments } : {},
        ...lineage != null ? {
          lineage: {
            parentRequestId: lineage.parentRequestId,
            rootParentRequestId: lineage.rootParentRequestId
          }
        } : {},
        ...this.quietOrigin != null ? { quietOrigin: this.quietOrigin } : {}
      });
    } catch (error41) {
      return { status: "error", error: error41 instanceof Error ? error41.message : String(error41) };
    }
    return {
      status: "background",
      backgroundReason: SubagentBackgroundReason.AGENT_REQUEST,
      toolCallCount: 0
    };
  }
  releaseSession(agentId) {
    if (this.detached !== void 0) return;
    if (this.dispatcher.isRunning(agentId)) return;
    this.sessions.delete(agentId);
    this.dispatcher.freeComputerUseWindow(agentId);
  }
};
var STREAM_UPDATE_CASES = /* @__PURE__ */ new Set([
  "textDelta",
  "thinkingDelta",
  "toolCallStarted",
  "partialToolCall",
  "toolCallCompleted"
]);
var ForwardingInteractionListener = class extends NoopInteractionListener {
  constructor(onUpdate, observers = {}) {
    super();
    this.onUpdate = onUpdate;
    this.observers = observers;
  }
  onUpdate;
  observers;
  staleDropLogged = false;
  async sendUpdate(ctx, update) {
    await super.sendUpdate(ctx, update);
    if (ctx.canceled && STREAM_UPDATE_CASES.has(update.message.case)) {
      if (!this.staleDropLogged) {
        this.staleDropLogged = true;
        process.stderr.write(
          `sand.turn.stale_stream_update_dropped request_id=${ctx.get(requestIdKey) ?? "unknown"} update_case=${update.message.case}
`
        );
      }
      return;
    }
    switch (update.message.case) {
      case "textDelta":
        this.onUpdate({
          type: "text-delta",
          text: update.message.value.text
        });
        break;
      case "thinkingDelta":
        this.onUpdate({
          type: "thinking-delta",
          text: update.message.value.text
        });
        break;
      case "turnEnded": {
        const usage = turnUsageFromTurnEnded(update.message.value);
        this.onUpdate(usage != null ? { type: "turn-ended", usage } : { type: "turn-ended" });
        break;
      }
      case "toolCallStarted":
      case "partialToolCall":
      case "toolCallCompleted": {
        const { callId, toolCall } = update.message.value;
        if (toolCall == null) break;
        this.observers.onToolCall?.(update.message.case, callId, toolCall);
        const outlineName = getOutlineToolCallName(toolCall);
        const forwarded = {
          type: "tool-call",
          id: callId,
          name: this.observers.resolveToolName?.(update.message.case, callId, outlineName) ?? outlineName,
          status: getOutlineToolCallStatus(update.message.case, toolCall),
          summary: getOutlineToolCallSummary(toolCall),
          args: getToolCallActivityArgs(toolCall)
        };
        this.onUpdate(forwarded);
        if (forwarded.status === "pending" && SURFACE_UNRESOLVED_TOOL_CASES.has(forwarded.name)) {
          this.observers.onSurfaceUnresolvedPending?.(callId, forwarded);
        }
        break;
      }
      case "summaryStarted":
      case "summaryCompleted":
        if (!ctx.canceled) {
          this.observers.onSummaryLifecycle?.();
        }
        break;
      default:
        break;
    }
  }
};
