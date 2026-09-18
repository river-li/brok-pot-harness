var RedactedTextPart = class {
  constructor(text2, providerOptions) {
    this.text = text2;
    this.providerOptions = providerOptions;
    this.type = "text";
  }
  toString() {
    return String(this.text);
  }
};
var RedactedImagePart = class {
  constructor(image2, mimeType, providerOptions, modeOrContext) {
    this.image = image2;
    this.mimeType = mimeType;
    this.providerOptions = providerOptions;
    this.type = "image";
    this.__privacyContext = modeOrContext ? toPrivacyContext(modeOrContext) : { privacyMode: PrivacyMode2.UNSPECIFIED };
  }
  toString() {
    const unredactedValue = typeof this.image === "string" ? this.image : this.image.toString();
    return getRedactionAwareDisplayValue({
      privacyMode: this.__privacyContext.privacyMode,
      classification: DataClassification.CODE,
      fieldName: "image",
      unredactedValue,
      enforceRedaction: this.__privacyContext.enforceRedaction
    });
  }
  toJSON() {
    return this.toString();
  }
};
var RedactedFilePart = class {
  constructor(data, mimeType, providerOptions, modeOrContext) {
    this.data = data;
    this.mimeType = mimeType;
    this.providerOptions = providerOptions;
    this.type = "file";
    this.__privacyContext = modeOrContext ? toPrivacyContext(modeOrContext) : { privacyMode: PrivacyMode2.UNSPECIFIED };
  }
  toString() {
    const unredactedValue = typeof this.data === "string" ? this.data : this.data.toString();
    return getRedactionAwareDisplayValue({
      privacyMode: this.__privacyContext.privacyMode,
      classification: DataClassification.CODE,
      fieldName: "file",
      unredactedValue,
      enforceRedaction: this.__privacyContext.enforceRedaction
    });
  }
  toJSON() {
    return this.toString();
  }
};
var RedactedToolCallPart = class {
  constructor(params) {
    this.type = "tool-call";
    this.toolCallId = params.toolCallId;
    this.toolName = params.toolName;
    this.args = params.args;
    this.providerOptions = params.providerOptions;
  }
  toString() {
    return String(this.args);
  }
};
var RedactedUnknownPart = class {
  constructor(originalType, data) {
    this.originalType = originalType;
    this.data = data;
    this.type = "unknown";
  }
  toString() {
    return String(this.data);
  }
};
var RedactedToolResultPart = class {
  constructor(params) {
    this.type = "tool-result";
    this.toolCallId = params.toolCallId;
    this.toolName = params.toolName;
    this.result = params.result;
    this.isError = params.isError;
    this.providerOptions = params.providerOptions;
    this.experimental_content = params.experimental_content;
  }
  toString() {
    return String(this.result);
  }
};
var DEFAULT_MEMO_CONFIG = {
  messageIdentity: true,
  contentIdentity: true
};
var memoConfig = Object.assign({}, DEFAULT_MEMO_CONFIG);
var coreMessageCachesByContext = /* @__PURE__ */ new Map();
function cacheKey2(ctx) {
  var _a19;
  return `${ctx.privacyMode}:${(_a19 = ctx.enforceRedaction) !== null && _a19 !== void 0 ? _a19 : "gate"}`;
}
function getCoreMessageCaches(ctx) {
  const key = cacheKey2(ctx);
  const existing = coreMessageCachesByContext.get(key);
  if (existing !== void 0) {
    return existing;
  }
  const created = {
    message: /* @__PURE__ */ new WeakMap(),
    userContent: /* @__PURE__ */ new WeakMap(),
    assistantContent: /* @__PURE__ */ new WeakMap(),
    toolContent: /* @__PURE__ */ new WeakMap()
  };
  coreMessageCachesByContext.set(key, created);
  return created;
}
function memoize(enabled, cache3, key, build2) {
  if (!enabled) {
    return build2();
  }
  const cached2 = cache3.get(key);
  if (cached2 !== void 0) {
    return cached2;
  }
  const value = build2();
  cache3.set(key, value);
  return value;
}
function toRedactedCoreMessage(message, modeOrContext) {
  const ctx = toPrivacyContext(modeOrContext);
  const caches = getCoreMessageCaches(ctx);
  if (memoConfig.messageIdentity) {
    const cached2 = caches.message.get(message);
    if (cached2 !== void 0) {
      return cached2;
    }
  }
  const role = message.role;
  let result;
  switch (role) {
    case "user":
      result = toRedactedUserMessage(message, ctx, caches);
      break;
    case "assistant":
      result = toRedactedAssistantMessage(message, ctx, caches);
      break;
    case "tool":
      result = toRedactedToolMessage(message, ctx, caches);
      break;
    case "system":
      result = toRedactedSystemMessage(message, ctx);
      break;
    default: {
      const _exhaustive = role;
      throw new Error(`Unhandled CoreMessage role: ${role}`);
    }
  }
  if (memoConfig.messageIdentity) {
    caches.message.set(message, result);
  }
  return result;
}
function fromRedactedCoreMessage(message, purpose, opts) {
  const role = message.role;
  switch (role) {
    case "user":
      return fromRedactedUserMessage(message, purpose, opts);
    case "assistant":
      return fromRedactedAssistantMessage(message, purpose, opts);
    case "tool":
      return fromRedactedToolMessage(message, purpose, opts);
    case "system":
      return fromRedactedSystemMessage(message, purpose, opts);
    default: {
      const _exhaustive = role;
      throw new Error(`Unhandled RedactedCoreMessage role: ${role}`);
    }
  }
}
function toRedactedCoreMessages(messages2, modeOrContext) {
  return messages2.map((msg) => toRedactedCoreMessage(msg, modeOrContext));
}
function fromRedactedCoreMessages(messages2, purpose, opts) {
  return messages2.map((msg) => fromRedactedCoreMessage(msg, purpose, opts));
}
function toRedactedUserContentPart(part, ctx) {
  const partType = part.type;
  switch (partType) {
    case "text":
      return new RedactedTextPart(createRedactedString(part.text, DataClassification.CODE, "user_text", ctx), part.providerOptions);
    case "image":
      return new RedactedImagePart(part.image, part.mimeType, part.providerOptions, ctx);
    case "file":
      return new RedactedFilePart(part.data, part.mimeType, part.providerOptions, ctx);
    default: {
      const _exhaustive = partType;
      throw new Error(`Unhandled user content part type: ${partType}`);
    }
  }
}
function toRedactedAssistantContentPart(part, ctx) {
  const typedPart = part;
  const partType = typedPart.type;
  switch (partType) {
    case "text": {
      const textPart = part;
      return new RedactedTextPart(createRedactedString(textPart.text, DataClassification.CODE, "assistant_text", ctx), textPart.providerOptions);
    }
    case "tool-call": {
      const toolCallPart = part;
      return new RedactedToolCallPart({
        toolCallId: toolCallPart.toolCallId,
        toolName: toolCallPart.toolName,
        args: createRedactedString(JSON.stringify(toolCallPart.args), DataClassification.CODE, "tool_call_args", ctx),
        providerOptions: toolCallPart.providerOptions
      });
    }
    default:
      return new RedactedUnknownPart(partType, createRedactedString(JSON.stringify(typedPart), DataClassification.CODE, `assistant_${partType}`, ctx));
  }
}
function toRedactedUserMessage(message, ctx, caches) {
  if (typeof message.content === "string") {
    return {
      _privacyMode: ctx.privacyMode,
      role: "user",
      content: createRedactedString(message.content, DataClassification.CODE, "user_content", ctx),
      providerOptions: message.providerOptions
    };
  }
  const content = message.content;
  const redactedContent = memoize(memoConfig.contentIdentity, caches.userContent, content, () => content.map((part) => toRedactedUserContentPart(part, ctx)));
  return {
    _privacyMode: ctx.privacyMode,
    role: "user",
    content: redactedContent,
    providerOptions: message.providerOptions
  };
}
function toRedactedAssistantMessage(message, ctx, caches) {
  const msgWithId = message;
  if (typeof message.content === "string") {
    return Object.assign(Object.assign({ _privacyMode: ctx.privacyMode, role: "assistant", content: createRedactedString(message.content, DataClassification.CODE, "assistant_content", ctx) }, msgWithId.id !== void 0 && { id: msgWithId.id }), message.providerOptions !== void 0 && {
      providerOptions: message.providerOptions
    });
  }
  const content = message.content;
  const redactedContent = memoize(memoConfig.contentIdentity, caches.assistantContent, content, () => content.map((part) => toRedactedAssistantContentPart(part, ctx)));
  return Object.assign(Object.assign({ _privacyMode: ctx.privacyMode, role: "assistant", content: redactedContent }, msgWithId.id !== void 0 && { id: msgWithId.id }), message.providerOptions !== void 0 && {
    providerOptions: message.providerOptions
  });
}
function toRedactedToolResultPart(part, ctx) {
  const resultStr = typeof part.result === "string" ? part.result : JSON.stringify(part.result);
  const experimentalContent = part.experimental_content;
  const redactedExperimentalContent = experimentalContent === null || experimentalContent === void 0 ? void 0 : experimentalContent.map((item) => {
    if (item.type === "text" && typeof item.text === "string") {
      return {
        type: "text",
        text: createRedactedString(item.text, DataClassification.CODE, "experimental_content_text", ctx)
      };
    }
    return item;
  });
  return new RedactedToolResultPart({
    toolCallId: part.toolCallId,
    toolName: part.toolName,
    result: createRedactedString(resultStr, DataClassification.CODE, "tool_result", ctx),
    isError: part.isError,
    providerOptions: part.providerOptions,
    experimental_content: redactedExperimentalContent
  });
}
function toRedactedToolMessage(message, ctx, caches) {
  const content = message.content;
  const redactedContent = memoize(memoConfig.contentIdentity, caches.toolContent, content, () => content.map((part) => toRedactedToolResultPart(part, ctx)));
  const toolMsg = message;
  return Object.assign(Object.assign({ _privacyMode: ctx.privacyMode, role: "tool", content: redactedContent }, toolMsg.id !== void 0 && { id: toolMsg.id }), message.providerOptions !== void 0 && {
    providerOptions: message.providerOptions
  });
}
function toRedactedSystemMessage(message, ctx) {
  return {
    _privacyMode: ctx.privacyMode,
    role: "system",
    content: createRedactedString(message.content, DataClassification.CODE, "system_content", ctx),
    providerOptions: message.providerOptions
  };
}
function fromRedactedUserContentPart(part, purpose, opts) {
  const partType = part.type;
  switch (partType) {
    case "text":
      return {
        type: "text",
        text: part.text.unwrap(purpose, opts),
        providerOptions: part.providerOptions
      };
    case "image":
      return {
        type: "image",
        image: part.image,
        mimeType: part.mimeType,
        providerOptions: part.providerOptions
      };
    case "file":
      return {
        type: "file",
        data: part.data,
        mimeType: part.mimeType,
        providerOptions: part.providerOptions
      };
    default: {
      const _exhaustive = partType;
      throw new Error(`Unhandled redacted user content part type: ${partType}`);
    }
  }
}
function fromRedactedAssistantContentPart(part, purpose, opts) {
  const partType = part.type;
  switch (partType) {
    case "text":
      return Object.assign({ type: "text", text: part.text.unwrap(purpose, opts) }, part.providerOptions !== void 0 && {
        providerOptions: part.providerOptions
      });
    case "tool-call": {
      const argsStr = part.args.unwrap(purpose, opts);
      let args;
      try {
        args = JSON.parse(argsStr);
      } catch (_a19) {
        args = argsStr;
      }
      return Object.assign({ type: "tool-call", toolCallId: part.toolCallId, toolName: part.toolName, args }, part.providerOptions !== void 0 && {
        providerOptions: part.providerOptions
      });
    }
    case "unknown": {
      const dataStr = part.data.unwrap(purpose, opts);
      try {
        return JSON.parse(dataStr);
      } catch (_b2) {
        return dataStr;
      }
    }
    default: {
      const _exhaustive = partType;
      throw new Error(`Unhandled redacted assistant content part type: ${partType}`);
    }
  }
}
function fromRedactedUserMessage(message, purpose, opts) {
  if (isRedactedString(message.content)) {
    return {
      role: "user",
      content: message.content.unwrap(purpose, opts),
      providerOptions: message.providerOptions
    };
  }
  const content = message.content.map((part) => fromRedactedUserContentPart(part, purpose, opts));
  return {
    role: "user",
    content,
    providerOptions: message.providerOptions
  };
}
function fromRedactedAssistantMessage(message, purpose, opts) {
  if (isRedactedString(message.content)) {
    return Object.assign(Object.assign({ role: "assistant", content: message.content.unwrap(purpose, opts) }, message.id !== void 0 && { id: message.id }), message.providerOptions !== void 0 && {
      providerOptions: message.providerOptions
    });
  }
  const content = message.content.map((part) => fromRedactedAssistantContentPart(part, purpose, opts));
  return Object.assign(Object.assign({ role: "assistant", content }, message.id !== void 0 && { id: message.id }), message.providerOptions !== void 0 && {
    providerOptions: message.providerOptions
  });
}
function fromRedactedToolMessage(message, purpose, opts) {
  const content = message.content.map((part) => {
    var _a19;
    const resultStr = part.result.unwrap(purpose, opts);
    let result;
    try {
      result = JSON.parse(resultStr);
    } catch (_b2) {
      result = resultStr;
    }
    const unwrappedExperimentalContent = (_a19 = part.experimental_content) === null || _a19 === void 0 ? void 0 : _a19.map((item) => {
      if (item.type === "text" && isRedactedString(item.text)) {
        return {
          type: "text",
          text: item.text.unwrap(purpose, opts)
        };
      }
      return item;
    });
    return Object.assign(Object.assign(Object.assign({ type: "tool-result", toolCallId: part.toolCallId, toolName: part.toolName, result }, part.isError !== void 0 && { isError: part.isError }), part.providerOptions !== void 0 && {
      providerOptions: part.providerOptions
    }), unwrappedExperimentalContent !== void 0 && {
      experimental_content: unwrappedExperimentalContent
    });
  });
  return Object.assign(Object.assign({ role: "tool", content }, message.id !== void 0 && { id: message.id }), message.providerOptions !== void 0 && {
    providerOptions: message.providerOptions
  });
}
function fromRedactedSystemMessage(message, purpose, opts) {
  return {
    role: "system",
    content: message.content.unwrap(purpose, opts),
    providerOptions: message.providerOptions
  };
}
