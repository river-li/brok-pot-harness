/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/chat-inference-proto/dist/client.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();

// @recovered-fragment 2/2
var __asyncValues12 = function(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o[Symbol.asyncIterator], i;
  return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v2) {
      return new Promise(function(resolve29, reject2) {
        v2 = o[n](v2), settle(resolve29, reject2, v2.done, v2.value);
      });
    };
  }
  function settle(resolve29, reject2, d, v2) {
    Promise.resolve(v2).then(function(v3) {
      resolve29({ value: v3, done: d });
    }, reject2);
  }
};
var __await13 = function(v2) {
  return this instanceof __await13 ? (this.v = v2, this) : new __await13(v2);
};
var __asyncGenerator13 = function(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g2 = generator.apply(thisArg, _arguments || []), i, q2 = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f2) {
    return function(v2) {
      return Promise.resolve(v2).then(f2, reject2);
    };
  }
  function verb(n, f2) {
    if (g2[n]) {
      i[n] = function(v2) {
        return new Promise(function(a, b2) {
          q2.push([n, v2, a, b2]) > 1 || resume(n, v2);
        });
      };
      if (f2) i[n] = f2(i[n]);
    }
  }
  function resume(n, v2) {
    try {
      step(g2[n](v2));
    } catch (e) {
      settle(q2[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await13 ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q2[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject2(value) {
    resume("throw", value);
  }
  function settle(f2, v2) {
    if (f2(v2), q2.shift(), q2.length) resume(q2[0][0], q2[0][1]);
  }
};
function preventUnhandledRejection(promise2) {
  void promise2.catch(() => {
  });
}
var ProtoPromptBuilder = class extends BasePromptBuilder {
  /**
   * Replace a stored message (matched by identity) with an updated copy.
   * Returns false when the message is no longer held (e.g. the builder was
   * cleared while a stream was in flight), in which case nothing changes.
   *
   * Replacement deliberately swaps the message OBJECT rather than mutating it
   * in place: downstream persistence layers (e.g. the agent's conversation
   * state serializer) cache serialized blobs by message identity, so an
   * in-place mutation would silently never be re-persisted.
   */
  replaceMessage(previous, next) {
    const index = this.messages.indexOf(previous);
    if (index === -1) {
      return false;
    }
    this.messages[index] = next;
    return true;
  }
};
function stampImageDescriptionsOnMessage(message, entries) {
  var _a19, _b2, _c2, _d, _e2;
  var _f;
  if (!Array.isArray(message.content)) {
    return void 0;
  }
  if (message.role === "user") {
    const updatedContent = [...message.content];
    let updatedAny = false;
    for (const entry of entries) {
      if (entry.expContentIndex !== void 0) {
        continue;
      }
      const part = updatedContent[entry.partIndex];
      if (part === void 0 || part.type !== "image") {
        continue;
      }
      updatedContent[entry.partIndex] = Object.assign(Object.assign({}, part), { providerOptions: Object.assign(Object.assign({}, part.providerOptions), { cursor: Object.assign(Object.assign({}, (_a19 = part.providerOptions) === null || _a19 === void 0 ? void 0 : _a19.cursor), { imageDescription: entry.description }) }) });
      updatedAny = true;
    }
    return updatedAny ? Object.assign(Object.assign({}, message), { content: updatedContent }) : void 0;
  }
  if (message.role === "tool") {
    const updatedContent = [...message.content];
    let updatedAny = false;
    for (const entry of entries) {
      if (entry.expContentIndex === void 0) {
        continue;
      }
      const part = updatedContent[entry.partIndex];
      if (part === void 0 || part.type !== "tool-result" || !Array.isArray(part.experimental_content) || ((_b2 = part.experimental_content[entry.expContentIndex]) === null || _b2 === void 0 ? void 0 : _b2.type) !== "image") {
        continue;
      }
      const existingDescriptions = (_f = (_d = (_c2 = part.providerOptions) === null || _c2 === void 0 ? void 0 : _c2.cursor) === null || _d === void 0 ? void 0 : _d.imageDescriptions) !== null && _f !== void 0 ? _f : {};
      updatedContent[entry.partIndex] = Object.assign(Object.assign({}, part), { providerOptions: Object.assign(Object.assign({}, part.providerOptions), { cursor: Object.assign(Object.assign({}, (_e2 = part.providerOptions) === null || _e2 === void 0 ? void 0 : _e2.cursor), { imageDescriptions: Object.assign(Object.assign({}, existingDescriptions), { [entry.expContentIndex]: entry.description }) }) }) });
      updatedAny = true;
    }
    return updatedAny ? Object.assign(Object.assign({}, message), { content: updatedContent }) : void 0;
  }
  return void 0;
}
var ProtoPromptExecutor = class extends BasePromptExecutor {
  constructor(builder, client, requestedModel, modelConfig, inferenceReason) {
    super(builder);
    this.client = client;
    this.requestedModel = requestedModel;
    this.modelConfig = modelConfig;
    this.inferenceReason = inferenceReason;
    this.protoBuilder = builder;
  }
  /**
   * Persist backend-generated image captions onto the stored messages so the
   * next request re-sends them and the backend's already-described guard skips
   * re-captioning. Entries address images by their position in the request
   * this stream call sent (`requestMessages`); affected messages are replaced
   * with updated copies by identity, so a builder that was cleared or rebuilt
   * mid-stream (stale indices) is left untouched.
   */
  applyImageDescriptions(requestMessages, info2) {
    var _a19;
    const entriesByMessageIndex = /* @__PURE__ */ new Map();
    for (const entry of info2.descriptions) {
      if (entry.description.length === 0) {
        continue;
      }
      const entries = (_a19 = entriesByMessageIndex.get(entry.messageIndex)) !== null && _a19 !== void 0 ? _a19 : [];
      entries.push(entry);
      entriesByMessageIndex.set(entry.messageIndex, entries);
    }
    for (const [messageIndex, entries] of entriesByMessageIndex) {
      const original = requestMessages[messageIndex];
      if (original === void 0) {
        continue;
      }
      const updated = stampImageDescriptionsOnMessage(original, entries);
      if (updated === void 0) {
        continue;
      }
      this.protoBuilder.replaceMessage(original, updated);
    }
  }
  stream(ctx, invocationId, tools, options2) {
    var _a19;
    var _b2;
    const agentTools = [];
    const providerDefinedTools = [];
    for (const tool of tools !== null && tools !== void 0 ? tools : []) {
      if ("type" in tool && tool.type === "provider-defined") {
        providerDefinedTools.push(tool);
      } else {
        agentTools.push(tool);
      }
    }
    const effectiveModelConfig = (options2 === null || options2 === void 0 ? void 0 : options2.maxTokens) !== void 0 ? Object.assign(Object.assign({}, this.modelConfig), { maxTokens: options2.maxTokens }) : this.modelConfig;
    const requestedModel = (_b2 = ctx.get(requestedModelKey)) !== null && _b2 !== void 0 ? _b2 : this.requestedModel;
    const requestMessages = this.builder.getMessages();
    const request5 = buildStreamRequest({
      messages: requestMessages,
      requestedModel,
      tools: agentTools,
      providerDefinedTools,
      modelConfig: effectiveModelConfig,
      invocationId,
      conversationId: ctx.get(conversationIdKey),
      conversationGroupId: ctx.get(conversationGroupIdKey),
      automationId: ctx.get(automationIdKey),
      parentRequestId: ctx.get(parentRequestIdKey),
      rootParentRequestId: ctx.get(rootParentRequestIdKey),
      parentAgentToolCallId: ctx.get(parentAgentToolCallIdKey),
      subagentType: ctx.get(subagentTypeKey),
      compactionEpoch: (_a19 = ctx.get(compactionEpochKey)) === null || _a19 === void 0 ? void 0 : _a19(),
      inferenceReason: this.inferenceReason,
      acceptedUnadvertisedToolNames: options2.acceptedUnadvertisedToolNames
    });
    const requestId2 = ctx.get(requestIdKey);
    const headers = {};
    if (requestId2) {
      headers["x-request-id"] = requestId2;
    }
    try {
      const spanContext = getSpanContextData(ctx);
      if (spanContext !== void 0) {
        const traceparent = `00-${spanContext.traceId}-${spanContext.spanId}-${spanContext.traceFlags.toString(16).padStart(2, "0")}`;
        headers["traceparent"] = traceparent;
        headers["backend-traceparent"] = traceparent;
      }
    } catch (_c2) {
    }
    const streamPromise = this.client.stream(request5, {
      signal: ctx.signal,
      headers
    });
    let resolveUsage;
    let rejectUsage;
    const usagePromise = new Promise((resolve29, reject2) => {
      resolveUsage = resolve29;
      rejectUsage = reject2;
    });
    preventUnhandledRejection(usagePromise);
    let resolveExtendedUsage;
    let rejectExtendedUsage;
    const extendedUsagePromise = new Promise((resolve29, reject2) => {
      resolveExtendedUsage = resolve29;
      rejectExtendedUsage = reject2;
    });
    preventUnhandledRejection(extendedUsagePromise);
    let resolveProviderMetadata;
    let rejectProviderMetadata;
    const providerMetadataPromise = new Promise((resolve29, reject2) => {
      resolveProviderMetadata = resolve29;
      rejectProviderMetadata = reject2;
    });
    preventUnhandledRejection(providerMetadataPromise);
    let resolveInvocationId;
    let rejectInvocationId;
    const invocationIdPromise = new Promise((resolve29, reject2) => {
      resolveInvocationId = resolve29;
      rejectInvocationId = reject2;
    });
    preventUnhandledRejection(invocationIdPromise);
    let resolveResponse;
    let rejectResponse;
    const responsePromise = new Promise((resolve29, reject2) => {
      resolveResponse = resolve29;
      rejectResponse = reject2;
    });
    preventUnhandledRejection(responsePromise);
    const fullStream = this.createFullStream(streamPromise, {
      resolveUsage,
      rejectUsage,
      resolveExtendedUsage,
      rejectExtendedUsage,
      resolveProviderMetadata,
      rejectProviderMetadata,
      resolveInvocationId,
      rejectInvocationId,
      resolveResponse,
      rejectResponse
    }, ctx, requestMessages);
    return {
      fullStream,
      usage: usagePromise,
      extendedUsage: extendedUsagePromise,
      providerMetadata: providerMetadataPromise,
      invocationId: invocationIdPromise,
      response: responsePromise
    };
  }
  createFullStream(streamPromise, resolvers, _ctx, requestMessages) {
    return __asyncGenerator13(this, arguments, function* createFullStream_1() {
      var _a19, e_1, _b2, _c2;
      var _d;
      var _e2, _f;
      let usageResolved = false;
      let extendedUsageResolved = false;
      let providerMetadataResolved = false;
      let invocationIdResolved = false;
      let responseResolved = false;
      let streamError;
      try {
        try {
          for (var _g = true, streamPromise_1 = __asyncValues12(streamPromise), streamPromise_1_1; streamPromise_1_1 = yield __await13(streamPromise_1.next()), _a19 = streamPromise_1_1.done, !_a19; _g = true) {
            _c2 = streamPromise_1_1.value;
            _g = false;
            const response = _c2;
            const parts = this.protoResponseToStreamParts(response);
            if (response.response.case === "usage") {
              const usage = response.response.value;
              resolvers.resolveUsage({
                promptTokens: usage.promptTokens,
                completionTokens: usage.completionTokens,
                totalTokens: (_e2 = usage.totalTokens) !== null && _e2 !== void 0 ? _e2 : 0
              });
              usageResolved = true;
            } else if (response.response.case === "extendedUsage") {
              const extUsage = response.response.value;
              resolvers.resolveExtendedUsage({
                inputTokens: extUsage.inputTokens,
                outputTokens: extUsage.outputTokens,
                cacheReadTokens: extUsage.cacheReadTokens,
                cacheWriteTokens: extUsage.cacheWriteTokens,
                maxTokens: extUsage.maxTokens
              });
              extendedUsageResolved = true;
            } else if (response.response.case === "providerMetadata") {
              const metadata = (_d = response.response.value.metadata) === null || _d === void 0 ? void 0 : _d.toJson();
              resolvers.resolveProviderMetadata(metadata);
              providerMetadataResolved = true;
            } else if (response.response.case === "invocationId") {
              resolvers.resolveInvocationId(response.response.value.invocationId);
              invocationIdResolved = true;
            } else if (response.response.case === "responseInfo") {
              const info2 = response.response.value;
              resolvers.resolveResponse({
                id: info2.id,
                modelId: info2.model,
                timestamp: new Date(Number(info2.createdAt)),
                messages: this.protoMessagesToResponseMessages(info2),
                // Classify by message so a token-limit error surfaced here (rather
                // than as a typed stream error) is still recognized by the agent
                // loop's instanceof checks. Provider/capacity ConnectErrors don't
                // travel this path — the server re-throws them so Connect delivers a
                // native ConnectError to the stream `catch` below, code + details
                // intact (see streamFromResult).
                error: info2.errorMessage ? (_f = classifyTokenLimitErrorFromMessage(info2.errorMessage)) !== null && _f !== void 0 ? _f : new Error(info2.errorMessage) : void 0,
                inferenceExtraData: info2.inferenceExtraData ? this.protoExtraDataToInferenceExtraData(info2.inferenceExtraData) : void 0,
                supportsSelfSummary: info2.supportsSelfSummary,
                earlyCompactionContextTokenThreshold: info2.earlyCompactionContextTokenThreshold
              });
              responseResolved = true;
            } else if (response.response.case === "error") {
              streamError = protoStreamErrorToError(response.response.value);
            } else if (response.response.case === "imageDescriptions") {
              this.applyImageDescriptions(requestMessages, response.response.value);
            }
            for (const part of parts) {
              yield yield __await13(part);
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (!_g && !_a19 && (_b2 = streamPromise_1.return)) yield __await13(_b2.call(streamPromise_1));
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      } catch (error42) {
        streamError = error42 instanceof Error ? error42 : new Error(String(error42));
      }
      if (!usageResolved) {
        if (streamError) {
          resolvers.rejectUsage(streamError);
        } else {
          resolvers.resolveUsage({
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
          });
        }
      }
      if (!extendedUsageResolved) {
        if (streamError) {
          resolvers.rejectExtendedUsage(streamError);
        } else {
          resolvers.resolveExtendedUsage({
            inputTokens: 0,
            outputTokens: 0,
            cacheReadTokens: 0,
            cacheWriteTokens: 0,
            maxTokens: 0
          });
        }
      }
      if (!providerMetadataResolved) {
        if (streamError) {
          resolvers.rejectProviderMetadata(streamError);
        } else {
          resolvers.resolveProviderMetadata(void 0);
        }
      }
      if (!invocationIdResolved) {
        if (streamError) {
          resolvers.rejectInvocationId(streamError);
        } else {
          resolvers.resolveInvocationId(crypto.randomUUID());
        }
      }
      if (!responseResolved) {
        if (streamError) {
          resolvers.rejectResponse(streamError);
        } else {
          resolvers.resolveResponse({
            id: "",
            modelId: "",
            timestamp: /* @__PURE__ */ new Date(),
            messages: []
          });
        }
      }
      if (streamError) {
        throw streamError;
      }
    });
  }
  protoResponseToStreamParts(response) {
    const parts = [];
    switch (response.response.case) {
      case "textPart": {
        const textPart = response.response.value;
        if (textPart.isFinal) {
          parts.push({
            type: "finish",
            finishReason: "stop",
            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
          });
        } else if (textPart.text) {
          parts.push({ type: "text-delta", textDelta: textPart.text });
        }
        break;
      }
      case "thinkingPart": {
        const thinkingPart = response.response.value;
        if (thinkingPart.text) {
          parts.push({ type: "reasoning", textDelta: thinkingPart.text });
        }
        if (thinkingPart.signature) {
          parts.push({
            type: "reasoning-signature",
            signature: thinkingPart.signature
          });
        }
        break;
      }
      case "toolCallPart": {
        const toolCallPart = response.response.value;
        if (toolCallPart.isComplete) {
          let args;
          try {
            args = JSON.parse(toolCallPart.args);
          } catch (_a19) {
            args = {};
          }
          parts.push({
            type: "tool-call",
            toolCallId: toolCallPart.toolCallId,
            toolName: toolCallPart.toolName,
            args
          });
        } else if (toolCallPart.toolName) {
          parts.push({
            type: "tool-call-streaming-start",
            toolCallId: toolCallPart.toolCallId,
            toolName: toolCallPart.toolName
          });
        } else {
          parts.push({
            type: "tool-call-delta",
            toolCallId: toolCallPart.toolCallId,
            toolName: "",
            argsTextDelta: toolCallPart.args
          });
        }
        break;
      }
      case "error": {
        parts.push({
          type: "error",
          error: protoStreamErrorToError(response.response.value)
        });
        break;
      }
      default:
        break;
    }
    return parts;
  }
  protoMessagesToResponseMessages(info2) {
    return info2.messages.map((msg) => {
      var _a19;
      const role = msg.role === InferenceMessageRole.ASSISTANT ? "assistant" : msg.role === InferenceMessageRole.TOOL ? "tool" : "assistant";
      if (role === "assistant") {
        const content = [];
        for (const rp of msg.reasoningParts) {
          if (rp.isRedacted) {
            content.push(Object.assign({ type: "redacted-reasoning", data: (_a19 = rp.redactedData) !== null && _a19 !== void 0 ? _a19 : "" }, providerOptionsFromModelName(rp.modelName)));
          } else {
            const part = Object.assign({ type: "reasoning", text: rp.text }, providerOptionsFromModelName(rp.modelName));
            if (rp.signature !== void 0) {
              part.signature = rp.signature;
            }
            content.push(part);
          }
        }
        if (msg.content) {
          content.push({ type: "text", text: msg.content });
        }
        for (const tc of msg.toolCalls) {
          content.push({
            type: "tool-call",
            toolCallId: tc.toolCallId,
            toolName: tc.toolName,
            args: toolCallArgsFromProto(tc)
          });
        }
        const providerOptions = providerOptionsFromResponsesMetadata(msg.modelProviderMessageId, msg.openaiPhase, msg.openaiPhaseNull === true);
        return Object.assign({ id: msg.id, role: "assistant", content }, providerOptions !== void 0 ? { providerOptions } : {});
      } else {
        return {
          id: msg.id,
          role: "tool",
          content: msg.toolResult ? msg.toolResult.parts.map((part) => {
            var _a20;
            return {
              type: "tool-result",
              toolCallId: part.toolCallId,
              toolName: part.toolName,
              result: (_a20 = part.result) === null || _a20 === void 0 ? void 0 : _a20.toJson(),
              isError: part.isError || void 0
            };
          }) : []
        };
      }
    });
  }
  protoExtraDataToInferenceExtraData(data) {
    return {
      tokenLogprobs: data.tokenLogprobs.length ? data.tokenLogprobs.map((lp) => lp.values) : void 0,
      tokenIds: data.tokenIds.length ? data.tokenIds.map((ids) => ids.values.map(Number)) : void 0,
      promptTokenIds: data.promptTokenIds.length ? data.promptTokenIds.map((ids) => ids.values.map(Number)) : void 0,
      extraTokens: data.extraTokens.length ? data.extraTokens.map((ids) => ids.values.map(Number)) : void 0,
      extraLogprobs: data.extraLogprobs.length ? data.extraLogprobs.map((lp) => lp.values) : void 0,
      routingMatrix: data.routingMatrix.length ? data.routingMatrix.map((row) => row.values.map((v2) => v2 === "" ? null : v2)) : void 0
    };
  }
};
var ProtoPromptSession = class {
  constructor(client, requestedModel, middleware, modelConfig, inferenceReason) {
    this.client = client;
    this.requestedModel = requestedModel;
    this.middleware = middleware;
    this.modelConfig = modelConfig;
    this.inferenceReason = inferenceReason;
  }
  getExecutor(state) {
    const builder = new ProtoPromptBuilder(state);
    const executor = new ProtoPromptExecutor(builder, this.client, this.requestedModel, this.modelConfig, this.inferenceReason);
    return this.middleware ? this.middleware(executor) : executor;
  }
  getModelId() {
    return this.requestedModel.modelId;
  }
};
var ProtoSessionProvider = class {
  constructor(client, requestedModel, modelConfig, inferenceReason) {
    this.client = client;
    this.requestedModel = requestedModel;
    this.modelConfig = modelConfig;
    this.inferenceReason = inferenceReason;
  }
  getSession(middleware) {
    return new ProtoPromptSession(this.client, this.requestedModel, middleware, this.modelConfig, this.inferenceReason);
  }
  getProviderName() {
    return "proto";
  }
  getModelId() {
    return this.requestedModel.modelId;
  }
  getThinkingDetails() {
    return void 0;
  }
};
function createProtoSessionProvider(client, requestedModel, modelConfig, inferenceReason) {
  return new ProtoSessionProvider(client, requestedModel, modelConfig, inferenceReason);
}

