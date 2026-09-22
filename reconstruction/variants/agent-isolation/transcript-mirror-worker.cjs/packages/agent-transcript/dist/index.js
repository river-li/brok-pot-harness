/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-transcript/dist/index.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __addDisposableResource = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var getSafeConversationId2 = getSafeConversationId;
function agentModeToString(mode) {
  switch (mode) {
    case AgentMode.AGENT:
      return "agent";
    case AgentMode.ASK:
      return "ask";
    case AgentMode.PLAN:
      return "plan";
    case AgentMode.DEBUG:
      return "debug";
    case AgentMode.TRIAGE:
      return "triage";
    case AgentMode.PROJECT:
      return "project";
    case AgentMode.MULTITASK:
      return "multitask";
    case AgentMode.CUSTOM:
      return "custom";
    case AgentMode.UNSPECIFIED:
    case void 0:
      return "agent";
    default: {
      const _exhaustive = mode;
      return "agent";
    }
  }
}
function toHex2(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function jsonReplacer(_key, value) {
  if (value instanceof Uint8Array) {
    return {
      __type: "Uint8Array",
      hex: toHex2(value)
    };
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}
function createTranscriptBinaryPlaceholder(byteLength) {
  return `[Binary data omitted from transcript: ${byteLength} bytes]`;
}
function jsonReviver(_key, value) {
  if (value && typeof value === "object" && value.__type === "Uint8Array" && typeof value.hex === "string") {
    const v = value;
    return createTranscriptBinaryPlaceholder(v.hex.length / 2);
  }
  return value;
}
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
var SERIALIZED_UINT8_ARRAY_MARKER = '"__type":"Uint8Array"';
var OVERSIZE_TRANSCRIPT_BLOB_THRESHOLD_BYTES = 5e6;
function formatBlobSizeMegabytes(bytes) {
  return `${(bytes / 1e6).toFixed(1)} MB`;
}
function createOversizeBlobOmittedMessage(blobSizeBytes) {
  return {
    role: "assistant",
    content: `[Oversize transcript blob omitted: ${formatBlobSizeMegabytes(blobSizeBytes)}]`
  };
}
function createEmptyHydratedBlobIdsResult() {
  return {
    messages: [],
    hydratedBlobCount: 0,
    hydratedBlobBytes: 0,
    largestHydratedBlobBytes: 0,
    totalDeserializeDurationMs: 0,
    omittedOversizeBlobCount: 0,
    omittedOversizeBlobBytes: 0,
    largestOmittedOversizeBlobBytes: 0
  };
}
var CoreMessageSerde = class {
  serialize(value) {
    const json = JSON.stringify(value, jsonReplacer);
    return textEncoder.encode(json);
  }
  deserialize(blob) {
    const json = textDecoder.decode(blob);
    if (json.includes(SERIALIZED_UINT8_ARRAY_MARKER)) {
      return JSON.parse(json, jsonReviver);
    }
    return JSON.parse(json);
  }
};
var coreMessageSerde = new CoreMessageSerde();
function isSummaryMessage(message) {
  var _a;
  const providerOptions = message.providerOptions;
  return ((_a = providerOptions === null || providerOptions === void 0 ? void 0 : providerOptions.cursor) === null || _a === void 0 ? void 0 : _a.isSummary) === true;
}
function hydrateBlobIds(ctx, blobStore, blobIds) {
  return __awaiter2(this, void 0, void 0, function* () {
    const messages = [];
    let hydratedBlobCount = 0;
    let hydratedBlobBytes = 0;
    let largestHydratedBlobBytes = 0;
    let totalDeserializeDurationMs = 0;
    let omittedOversizeBlobCount = 0;
    let omittedOversizeBlobBytes = 0;
    let largestOmittedOversizeBlobBytes = 0;
    for (const blobId of blobIds) {
      const blob = yield blobStore.getBlob(ctx, blobId);
      if (blob) {
        if (blob.length > OVERSIZE_TRANSCRIPT_BLOB_THRESHOLD_BYTES) {
          messages.push(createOversizeBlobOmittedMessage(blob.length));
          omittedOversizeBlobCount++;
          omittedOversizeBlobBytes += blob.length;
          largestOmittedOversizeBlobBytes = Math.max(largestOmittedOversizeBlobBytes, blob.length);
          continue;
        }
        try {
          const deserializeStart = performance.now();
          const message = coreMessageSerde.deserialize(blob);
          const deserializeDurationMs = performance.now() - deserializeStart;
          messages.push(message);
          hydratedBlobCount++;
          hydratedBlobBytes += blob.length;
          largestHydratedBlobBytes = Math.max(largestHydratedBlobBytes, blob.length);
          totalDeserializeDurationMs += deserializeDurationMs;
        } catch (_a) {
        }
      }
    }
    return {
      messages,
      hydratedBlobCount,
      hydratedBlobBytes,
      largestHydratedBlobBytes,
      totalDeserializeDurationMs,
      omittedOversizeBlobCount,
      omittedOversizeBlobBytes,
      largestOmittedOversizeBlobBytes
    };
  });
}
function hydrateMessages(ctx, blobStore, state) {
  return __awaiter2(this, void 0, void 0, function* () {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource(env_1, createSpan(ctx.withName("hydrateSummaryArchives")), false);
      let getBlobCount = 0;
      const quietCtx = withSuppressedChildSpans(span.ctx);
      const allMessages = [];
      let hydratedArchivedBlobCount = 0;
      let hydratedArchivedBlobBytes = 0;
      let largestHydratedArchivedBlobBytes = 0;
      let totalArchivedDeserializeDurationMs = 0;
      let omittedArchivedBlobCount = 0;
      let omittedArchivedBlobBytes = 0;
      let largestOmittedArchivedBlobBytes = 0;
      const summaryArchives = yield Promise.all(state.summaryArchives.map((summaryArchiveRef) => __awaiter2(this, void 0, void 0, function* () {
        getBlobCount++;
        const archiveBlob = yield blobStore.getBlob(quietCtx, summaryArchiveRef);
        if (archiveBlob) {
          try {
            const archive = ConversationSummaryArchive.fromBinary(archiveBlob);
            getBlobCount += archive.summarizedMessages.length;
            const archivedMessages = yield hydrateBlobIds(quietCtx, blobStore, archive.summarizedMessages);
            return archivedMessages;
          } catch (_a) {
          }
        }
        return createEmptyHydratedBlobIdsResult();
      })));
      for (const archivedMessages of summaryArchives) {
        allMessages.push(...archivedMessages.messages);
        hydratedArchivedBlobCount += archivedMessages.hydratedBlobCount;
        hydratedArchivedBlobBytes += archivedMessages.hydratedBlobBytes;
        largestHydratedArchivedBlobBytes = Math.max(largestHydratedArchivedBlobBytes, archivedMessages.largestHydratedBlobBytes);
        totalArchivedDeserializeDurationMs += archivedMessages.totalDeserializeDurationMs;
        omittedArchivedBlobCount += archivedMessages.omittedOversizeBlobCount;
        omittedArchivedBlobBytes += archivedMessages.omittedOversizeBlobBytes;
        largestOmittedArchivedBlobBytes = Math.max(largestOmittedArchivedBlobBytes, archivedMessages.largestOmittedOversizeBlobBytes);
      }
      span.span.setAttribute("getBlobCount", getBlobCount);
      span.span.setAttribute("hydratedBlobCount", hydratedArchivedBlobCount);
      span.span.setAttribute("hydratedBlobBytes", hydratedArchivedBlobBytes);
      span.span.setAttribute("largestHydratedBlobBytes", largestHydratedArchivedBlobBytes);
      span.span.setAttribute("totalDeserializeDurationMs", totalArchivedDeserializeDurationMs);
      span.span.setAttribute("omittedOversizeBlobCount", omittedArchivedBlobCount);
      span.span.setAttribute("omittedOversizeBlobBytes", omittedArchivedBlobBytes);
      span.span.setAttribute("largestOmittedOversizeBlobBytes", largestOmittedArchivedBlobBytes);
      const span2 = __addDisposableResource(env_1, createSpan(ctx.withName("hydratePromptMessages")), false);
      const promptMessages = yield hydrateBlobIds(quietCtx, blobStore, state.rootPromptMessagesJson);
      span2.span.setAttribute("getBlobCount", state.rootPromptMessagesJson.length);
      span2.span.setAttribute("hydratedBlobCount", promptMessages.hydratedBlobCount);
      span2.span.setAttribute("hydratedBlobBytes", promptMessages.hydratedBlobBytes);
      span2.span.setAttribute("largestHydratedBlobBytes", promptMessages.largestHydratedBlobBytes);
      span2.span.setAttribute("totalDeserializeDurationMs", promptMessages.totalDeserializeDurationMs);
      span2.span.setAttribute("omittedOversizeBlobCount", promptMessages.omittedOversizeBlobCount);
      span2.span.setAttribute("omittedOversizeBlobBytes", promptMessages.omittedOversizeBlobBytes);
      span2.span.setAttribute("largestOmittedOversizeBlobBytes", promptMessages.largestOmittedOversizeBlobBytes);
      const tailMessages = promptMessages.messages.filter((msg) => msg.role !== "system" && !isSummaryMessage(msg));
      allMessages.push(...tailMessages);
      return allMessages;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources(env_1);
    }
  });
}
function formatToolArgs(args) {
  if (args === null || args === void 0) {
    return "";
  }
  if (typeof args !== "object") {
    return String(args);
  }
  const obj = args;
  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return "";
  }
  const lines = entries.map(([key, value]) => {
    let valueStr;
    if (typeof value === "string") {
      valueStr = value;
    } else if (typeof value === "object" && value !== null) {
      valueStr = JSON.stringify(value);
    } else {
      valueStr = String(value);
    }
    return `  ${key}: ${valueStr}`;
  });
  return `
${lines.join("\n")}`;
}
function formatContentPart(part, stripTags2) {
  switch (part.type) {
    case "text":
      return stripTags2 ? stripXmlTags(part.text) : part.text;
    case "image":
      return "[Image]";
    case "file":
      return part.filename ? `[File: ${part.filename}]` : "[File]";
    case "reasoning":
      return `[Thinking] ${part.text}`;
    case "redacted-reasoning":
      return "[Thinking]";
    case "tool-call":
      return `[Tool call] ${part.toolName}${formatToolArgs(part.args)}`;
    case "tool-result":
      return `[Tool result] ${part.toolName}`;
    default:
      return "";
  }
}
function stripXmlTags(text) {
  return stripContextTags(text);
}
function stripHiddenThinkingTags(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").replace(/\n{3,}/g, "\n\n").trim();
}
function formatContent(content, stripTags2, stripThinkTags) {
  if (content === void 0) {
    return "";
  }
  if (typeof content === "string") {
    const maybeStripped = stripTags2 ? stripXmlTags(content) : content;
    return stripThinkTags ? stripHiddenThinkingTags(maybeStripped) : maybeStripped;
  }
  return content.map((part) => {
    if (stripThinkTags && part.type === "text") {
      const updatedText = stripHiddenThinkingTags(stripTags2 ? stripXmlTags(part.text) : part.text);
      return formatContentPart(Object.assign(Object.assign({}, part), { text: updatedText }), false);
    }
    return formatContentPart(part, stripTags2);
  }).filter(Boolean).join("\n");
}
function formatTranscript(messages) {
  let filteredMessages = messages.filter((msg) => msg.role !== "system");
  if (filteredMessages.length >= 2 && filteredMessages[0].role === "user" && filteredMessages[1].role === "user") {
    filteredMessages = filteredMessages.slice(1);
  }
  const lines = [];
  for (const message of filteredMessages) {
    const stripTags2 = message.role === "user";
    const stripThinkTags = message.role === "assistant";
    const content = formatContent(message.content, stripTags2, stripThinkTags);
    if (content.trim()) {
      if (message.role === "tool") {
        lines.push(content);
      } else {
        lines.push(`${message.role}:
${content}`);
      }
    }
  }
  return lines.join("\n\n");
}
function formatMessageToJson(message, stripTags2) {
  const json = {
    role: message.role
  };
  const content = message.content;
  if (typeof content === "string") {
    const processedText = stripTags2 ? stripXmlTags(content) : content;
    const maybeStrippedThinking = message.role === "assistant" ? stripHiddenThinkingTags(processedText) : processedText;
    if (maybeStrippedThinking.trim()) {
      json.text = maybeStrippedThinking;
    }
  } else if (Array.isArray(content)) {
    const textParts = [];
    const thinkingParts = [];
    const toolCalls = [];
    let toolResult;
    for (const part of content) {
      switch (part.type) {
        case "text": {
          const processedText = stripTags2 ? stripXmlTags(part.text) : part.text;
          const maybeStrippedThinking = message.role === "assistant" ? stripHiddenThinkingTags(processedText) : processedText;
          if (maybeStrippedThinking.trim()) {
            textParts.push(maybeStrippedThinking);
          }
          break;
        }
        case "reasoning":
          if (part.text.trim()) {
            thinkingParts.push(part.text);
          }
          break;
        case "redacted-reasoning":
          thinkingParts.push("[REDACTED]");
          break;
        case "image":
          textParts.push("[Image]");
          break;
        case "file":
          textParts.push(part.filename ? `[File: ${part.filename}]` : "[File]");
          break;
        case "tool-call":
          toolCalls.push({
            toolName: part.toolName,
            args: part.args
          });
          break;
        case "tool-result":
          toolResult = {
            toolName: part.toolName
          };
          break;
      }
    }
    if (textParts.length > 0) {
      json.text = textParts.join("\n");
    }
    if (thinkingParts.length > 0) {
      json.thinking = thinkingParts.join("\n");
    }
    if (toolCalls.length > 0) {
      json.toolCalls = toolCalls;
    }
    if (toolResult) {
      json.toolResult = toolResult;
    }
  }
  return json;
}
function formatTranscriptJson(messages) {
  let filteredMessages = messages.filter((msg) => msg.role !== "system");
  if (filteredMessages.length >= 2 && filteredMessages[0].role === "user" && filteredMessages[1].role === "user") {
    filteredMessages = filteredMessages.slice(1);
  }
  const jsonMessages = [];
  for (const message of filteredMessages) {
    const stripTags2 = message.role === "user";
    const jsonMessage = formatMessageToJson(message, stripTags2);
    if (jsonMessage.text || jsonMessage.thinking || jsonMessage.toolCalls || jsonMessage.toolResult) {
      jsonMessages.push(jsonMessage);
    }
  }
  if (jsonMessages.length === 0) {
    return "";
  }
  return JSON.stringify(jsonMessages, null, 2);
}
function prependOverviewMetadataLine(jsonlContent, overview) {
  const metadataLine = {
    type: "metadata",
    metadata: {
      overview
    }
  };
  return `${JSON.stringify(metadataLine)}
${jsonlContent}`;
}
function ensureTrailingNewline(content) {
  return content.endsWith("\n") ? content : `${content}
`;
}
function formatTurnEndedText(turnEnded) {
  switch (turnEnded.status) {
    case "success":
      return "Turn ended: success.";
    case "error":
      return `Turn ended: error: ${turnEnded.error}`;
    case "aborted":
      return turnEnded.error ? `Turn ended: aborted: ${turnEnded.error}` : "Turn ended: aborted.";
    default: {
      const _exhaustive = turnEnded;
      return _exhaustive;
    }
  }
}
function getTranscriptTerminalMarkers(options) {
  const { turnEnded } = options;
  const textSuffixes = [];
  const jsonFields = {};
  const jsonlLines = [];
  if (turnEnded !== void 0) {
    textSuffixes.push(formatTurnEndedText(turnEnded));
    jsonFields.turnEnded = turnEnded;
    jsonlLines.push(JSON.stringify(Object.assign({ type: "turn_ended" }, turnEnded)));
  }
  return {
    textSuffixes,
    jsonFields,
    jsonlLines
  };
}
function formatSingleMessageJsonl(message) {
  if (message.role === "system" || isSummaryMessage(message)) {
    return void 0;
  }
  const stripTags2 = message.role === "user";
  const jsonMessage = formatMessageToJson(message, stripTags2);
  const content = [];
  const textParts = [];
  if (jsonMessage.text) {
    textParts.push(jsonMessage.text);
  }
  if (jsonMessage.thinking) {
    textParts.push(jsonMessage.thinking);
  }
  if (textParts.length > 0) {
    content.push({ type: "text", text: textParts.join("\n\n") });
  }
  if (jsonMessage.toolCalls) {
    for (const call of jsonMessage.toolCalls) {
      content.push({
        type: "tool_use",
        name: call.toolName,
        input: call.args
      });
    }
  }
  if (content.length === 0) {
    return void 0;
  }
  const line = {
    role: message.role,
    message: { content }
  };
  return JSON.stringify(line);
}
function formatTranscriptJsonl(messages) {
  let filteredMessages = messages.filter((msg) => msg.role !== "system");
  if (filteredMessages.length >= 2 && filteredMessages[0].role === "user" && filteredMessages[1].role === "user") {
    filteredMessages = filteredMessages.slice(1);
  }
  const lines = [];
  for (const message of filteredMessages) {
    const line = formatSingleMessageJsonl(message);
    if (line) {
      lines.push(line);
    }
  }
  return lines.join("\n");
}
var TranscriptStore = class {
  constructor(projectDir, blobStore, writeFile2, options = {}) {
    var _a, _b, _c, _d;
    this.projectDir = projectDir;
    this.blobStore = blobStore;
    this.writeFile = writeFile2;
    this.options = {
      writeText: (_a = options.writeText) !== null && _a !== void 0 ? _a : true,
      writeJson: (_b = options.writeJson) !== null && _b !== void 0 ? _b : false,
      writeJsonl: (_c = options.writeJsonl) !== null && _c !== void 0 ? _c : false,
      pathResolver: options.pathResolver,
      appendFile: options.appendFile,
      fallbackToFullWriteOnIncrementalFailure: (_d = options.fallbackToFullWriteOnIncrementalFailure) !== null && _d !== void 0 ? _d : true
    };
  }
  /**
   * Resolve the full file path for a transcript.
   *
   * Delegates to the caller-provided `pathResolver` if one was supplied,
   * otherwise falls back to the default nested layout:
   *   `{projectDir}/agent-transcripts/<safeId>/<safeId>.<ext>`
   */
  resolveFilePath(conversationId, ext) {
    if (this.options.pathResolver) {
      return this.options.pathResolver(conversationId, ext);
    }
    const relPath = getTranscriptRelativePath({
      conversationId,
      ext,
      kind: "primary"
    });
    return `${this.projectDir}/${relPath}`;
  }
  /**
   * Writes a transcript from a ConversationStateStructure (full overwrite).
   *
   * Hydrates all messages from the blob store and rewrites the entire file.
   * For repeated writes during an agent session, prefer `writeFromStateIncremental`
   * which only hydrates and appends new messages.
   *
   * Writes each enabled format (`writeText` / `writeJson` / `writeJsonl`).
   * If `options.overviewFactory` is set, the JSONL output is prefixed with a
   * `{"type":"metadata","metadata":{"overview":"..."}}` header.
   * If `options.turnEnded` is set, each format appends a terminal marker
   * (see `WriteFromStateOptions.turnEnded`) and the file is written even
   * when hydrated messages are empty — otherwise empty transcripts are skipped.
   *
   * Output path is determined by the `pathResolver` option or the default
   * nested layout. Best-effort: errors are logged but not thrown.
   *
   * @returns `true` when the write completed (including the no-op empty case),
   *   `false` when it failed. Callers tracking an append cursor use this to
   *   avoid advancing past content that never reached disk.
   */
  writeFromStateFull(ctx_1, state_1, conversationId_1) {
    return __awaiter2(this, arguments, void 0, function* (ctx, state, conversationId, options = {}) {
      const env_2 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource(env_2, createSpan(ctx.withName("writeFromState")), false);
        try {
          const messages = yield hydrateMessages(span.ctx, this.blobStore, state);
          const { overviewFactory } = options;
          const terminalMarkers = getTranscriptTerminalMarkers(options);
          if (messages.length === 0 && terminalMarkers.jsonlLines.length === 0) {
            return true;
          }
          let formattedConversation;
          if (this.options.writeText || overviewFactory) {
            formattedConversation = formatTranscript(messages);
          }
          if (this.options.writeText) {
            const base = formattedConversation !== null && formattedConversation !== void 0 ? formattedConversation : "";
            const textContent = terminalMarkers.textSuffixes.length > 0 ? base.trim().length > 0 ? `${base}

${terminalMarkers.textSuffixes.join("\n")}` : terminalMarkers.textSuffixes.join("\n") : base;
            if (textContent.trim()) {
              yield this.writeFile(this.resolveFilePath(conversationId, "txt"), textContent);
            }
          }
          if (this.options.writeJson) {
            const jsonContent = formatTranscriptJson(messages);
            if (jsonContent || terminalMarkers.jsonlLines.length > 0) {
              const wrapper = Object.assign({ mode: agentModeToString(state.mode), messages: jsonContent ? JSON.parse(jsonContent) : [] }, terminalMarkers.jsonFields);
              yield this.writeFile(this.resolveFilePath(conversationId, "json"), JSON.stringify(wrapper, null, 2));
            }
          }
          if (this.options.writeJsonl) {
            const body = formatTranscriptJsonl(messages);
            let finalJsonl = [body, ...terminalMarkers.jsonlLines].filter((line) => line.length > 0).join("\n");
            if (finalJsonl && overviewFactory && (formattedConversation === null || formattedConversation === void 0 ? void 0 : formattedConversation.trim())) {
              try {
                const overview = yield overviewFactory(formattedConversation);
                const trimmed = overview.trim();
                if (trimmed) {
                  finalJsonl = prependOverviewMetadataLine(finalJsonl, trimmed);
                }
              } catch (overviewError) {
                console.error("[TranscriptStore] Failed to generate transcript overview:", overviewError);
              }
            }
            if (finalJsonl) {
              yield this.writeFile(this.resolveFilePath(conversationId, "jsonl"), ensureTrailingNewline(finalJsonl));
            }
          }
          return true;
        } catch (error) {
          console.error("[TranscriptStore] Failed to write transcript:", error);
          return false;
        }
      } catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
      } finally {
        __disposeResources(env_2);
      }
    });
  }
  /**
   * Incrementally appends new messages and terminal markers to a JSONL transcript file.
   *
   * Only hydrates blob IDs beyond `previousRootPromptCount` from the blob store,
   * formats them as JSONL lines, and appends to the existing file. Marker-only
   * writes append directly. This turns each checkpoint write from
   * O(total messages) to O(new messages).
   *
   * Falls back to a full `writeFromState` when:
   * - This is the first write (previousRootPromptCount === 0)
   * - Overview metadata must be prepended (requires a full rewrite)
   * - No appendFile callback is configured
   * - writeText or writeJson are enabled (these formats don't support append)
   *
   * @returns The new rootPromptMessagesJson count after writing, for the caller
   *   to track as the next `previousRootPromptCount`. Returns `0` when the
   *   write could not be persisted (both the append and the full-write fallback
   *   failed) so the caller re-attempts a full rewrite on the next checkpoint
   *   instead of appending past content that never reached disk.
   */
  writeFromStateIncremental(ctx_1, state_1, conversationId_1, previousRootPromptCount_1) {
    return __awaiter2(this, arguments, void 0, function* (ctx, state, conversationId, previousRootPromptCount, options = {}) {
      const env_3 = { stack: [], error: void 0, hasError: false };
      try {
        const currentCount = state.rootPromptMessagesJson.length;
        const terminalMarkers = getTranscriptTerminalMarkers(options);
        const hasTerminalMarker = terminalMarkers.jsonlLines.length > 0;
        if (currentCount === previousRootPromptCount && !hasTerminalMarker && !options.overviewFactory) {
          return currentCount;
        }
        const appendFile2 = this.options.appendFile;
        const canAppend = appendFile2 && this.options.writeJsonl && !this.options.writeText && !this.options.writeJson && previousRootPromptCount > 0 && currentCount >= previousRootPromptCount && (currentCount > previousRootPromptCount || hasTerminalMarker) && !options.overviewFactory;
        if (!canAppend) {
          const ok = yield this.writeFromStateFull(ctx, state, conversationId, options);
          return ok ? currentCount : 0;
        }
        const span = __addDisposableResource(env_3, createSpan(ctx.withName("writeFromStateIncremental")), false);
        if (currentCount === previousRootPromptCount && hasTerminalMarker) {
          try {
            yield appendFile2(this.resolveFilePath(conversationId, "jsonl"), ensureTrailingNewline(terminalMarkers.jsonlLines.join("\n")));
            return currentCount;
          } catch (error) {
            console.error(this.options.fallbackToFullWriteOnIncrementalFailure ? "[TranscriptStore] Failed to append transcript, falling back to full write:" : "[TranscriptStore] Failed to append transcript:", error);
            if (!this.options.fallbackToFullWriteOnIncrementalFailure) {
              return 0;
            }
            const ok = yield this.writeFromStateFull(ctx, state, conversationId, options);
            return ok ? currentCount : 0;
          }
        }
        try {
          const newBlobIds = state.rootPromptMessagesJson.slice(previousRootPromptCount);
          const newMessages = yield hydrateBlobIds(span.ctx, this.blobStore, newBlobIds);
          span.span.setAttribute("hydratedBlobCount", newMessages.hydratedBlobCount);
          span.span.setAttribute("hydratedBlobBytes", newMessages.hydratedBlobBytes);
          span.span.setAttribute("largestHydratedBlobBytes", newMessages.largestHydratedBlobBytes);
          span.span.setAttribute("totalDeserializeDurationMs", newMessages.totalDeserializeDurationMs);
          span.span.setAttribute("omittedOversizeBlobCount", newMessages.omittedOversizeBlobCount);
          span.span.setAttribute("omittedOversizeBlobBytes", newMessages.omittedOversizeBlobBytes);
          span.span.setAttribute("largestOmittedOversizeBlobBytes", newMessages.largestOmittedOversizeBlobBytes);
          const lines = [];
          for (const message of newMessages.messages) {
            const line = formatSingleMessageJsonl(message);
            if (line) {
              lines.push(line);
            }
          }
          lines.push(...terminalMarkers.jsonlLines);
          if (lines.length > 0) {
            const content = ensureTrailingNewline(lines.join("\n"));
            yield appendFile2(this.resolveFilePath(conversationId, "jsonl"), content);
          }
          return currentCount;
        } catch (error) {
          console.error(this.options.fallbackToFullWriteOnIncrementalFailure ? "[TranscriptStore] Failed to append transcript, falling back to full write:" : "[TranscriptStore] Failed to append transcript:", error);
          if (!this.options.fallbackToFullWriteOnIncrementalFailure) {
            return 0;
          }
          const ok = yield this.writeFromStateFull(ctx, state, conversationId, options);
          return ok ? currentCount : 0;
        }
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        __disposeResources(env_3);
      }
    });
  }
};

