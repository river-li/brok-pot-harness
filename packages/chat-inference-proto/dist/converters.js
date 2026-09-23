function applyToolCallArgs(tc, args, explicitRawToolCallArgs) {
  const isJsonObject3 = typeof args === "object" && args !== null && !Array.isArray(args);
  if (isJsonObject3) {
    tc.args = Struct.fromJson(args);
    if (explicitRawToolCallArgs !== void 0) {
      tc.rawToolCallArgs = explicitRawToolCallArgs;
    }
    return;
  }
  const rawText = typeof args === "string" ? args : JSON.stringify(args);
  if (rawText === void 0) {
    throw new Error(`cannot represent tool call arguments of type ${typeof args} as a JSON object or raw text`);
  }
  tc.rawToolCallArgs = explicitRawToolCallArgs !== null && explicitRawToolCallArgs !== void 0 ? explicitRawToolCallArgs : rawText;
}
function toolCallArgsFromProto(tc) {
  var _a19;
  var _b2, _c2;
  return (_c2 = (_b2 = (_a19 = tc.args) === null || _a19 === void 0 ? void 0 : _a19.toJson()) !== null && _b2 !== void 0 ? _b2 : tc.rawToolCallArgs) !== null && _c2 !== void 0 ? _c2 : {};
}
function cursorBillingFromProviderOptions(providerOptions) {
  const cursor = providerOptions === null || providerOptions === void 0 ? void 0 : providerOptions.cursor;
  const inferenceReason = typeof (cursor === null || cursor === void 0 ? void 0 : cursor.inferenceReason) === "string" && cursor.inferenceReason.length > 0 ? cursor.inferenceReason : void 0;
  const featureType = typeof (cursor === null || cursor === void 0 ? void 0 : cursor.featureType) === "string" && cursor.featureType.length > 0 ? cursor.featureType : void 0;
  const isSummary = (cursor === null || cursor === void 0 ? void 0 : cursor.isSummary) === true ? true : void 0;
  return { inferenceReason, featureType, isSummary };
}
function applyCursorBillingToProto(protoMsg, providerOptions) {
  const { inferenceReason, featureType, isSummary } = cursorBillingFromProviderOptions(providerOptions);
  if (inferenceReason !== void 0) {
    protoMsg.cursorInferenceReason = inferenceReason;
  }
  if (featureType !== void 0) {
    protoMsg.cursorFeatureType = featureType;
  }
  if (isSummary) {
    protoMsg.cursorIsSummary = true;
  }
}
function cursorToolCallIsErrorFromProviderOptions(msg) {
  var _a19, _b2, _c2;
  const isError = (_c2 = (_b2 = (_a19 = msg.providerOptions) === null || _a19 === void 0 ? void 0 : _a19.cursor) === null || _b2 === void 0 ? void 0 : _b2.highLevelToolCallResult) === null || _c2 === void 0 ? void 0 : _c2.isError;
  return typeof isError === "boolean" ? isError : void 0;
}
function coreMessageToProto(msg) {
  var _a19, _b2;
  const protoMsg = new InferenceCoreMessage();
  protoMsg.role = roleToProto(msg.role);
  applyCursorBillingToProto(protoMsg, msg.providerOptions);
  if (msg.role === "user") {
    if (typeof msg.content === "string") {
      protoMsg.content = { case: "text", value: msg.content };
    } else if (Array.isArray(msg.content)) {
      const parts = new InferenceContentParts();
      parts.parts = msg.content.map((p2) => userContentPartToProto(p2));
      protoMsg.content = { case: "parts", value: parts };
    }
  } else if (msg.role === "assistant") {
    const responsesMetadata = getResponsesMetadataFromProviderOptions(msg);
    if (responsesMetadata.modelProviderMessageId !== void 0) {
      protoMsg.modelProviderMessageId = responsesMetadata.modelProviderMessageId;
    }
    if (typeof responsesMetadata.openaiPhase === "string") {
      protoMsg.openaiPhase = responsesMetadata.openaiPhase;
    } else if (responsesMetadata.openaiPhase === null) {
      protoMsg.openaiPhaseNull = true;
    }
    if (typeof msg.content === "string") {
      protoMsg.content = { case: "text", value: msg.content };
    } else if (Array.isArray(msg.content)) {
      const textParts = [];
      for (const part of msg.content) {
        if (part.type === "text") {
          textParts.push(part.text);
        } else if (part.type === "tool-call") {
          const toolCallPart = part;
          const tc = new InferenceToolCall();
          tc.toolCallId = part.toolCallId;
          tc.toolName = part.toolName;
          const rawToolCallArgs = (_b2 = (_a19 = toolCallPart.providerOptions) === null || _a19 === void 0 ? void 0 : _a19.cursor) === null || _b2 === void 0 ? void 0 : _b2.rawToolCallArgs;
          applyToolCallArgs(tc, part.args, typeof rawToolCallArgs === "string" ? rawToolCallArgs : void 0);
          protoMsg.toolCalls.push(tc);
        } else if (part.type === "reasoning") {
          const reasoningPart = part;
          protoMsg.reasoningParts.push(new InferenceReasoningPart({
            isRedacted: false,
            text: reasoningPart.text,
            signature: reasoningPart.signature,
            modelName: getCursorModelName(reasoningPart)
          }));
        } else if (part.type === "redacted-reasoning") {
          const reasoningPart = part;
          protoMsg.reasoningParts.push(new InferenceReasoningPart({
            isRedacted: true,
            redactedData: reasoningPart.data,
            modelName: getCursorModelName(reasoningPart)
          }));
        }
      }
      if (textParts.length > 0) {
        protoMsg.content = { case: "text", value: textParts.join("") };
      }
    }
  } else if (msg.role === "tool") {
    if (Array.isArray(msg.content)) {
      const cursorToolCallIsError = cursorToolCallIsErrorFromProviderOptions(msg);
      const toolResultContent = new InferenceToolResultContent();
      toolResultContent.parts = msg.content.filter((part) => part.type === "tool-result").map((part) => {
        const protoPart = new InferenceToolResultPart();
        protoPart.toolCallId = part.toolCallId;
        protoPart.toolName = part.toolName;
        if (part.result !== void 0) {
          protoPart.result = Value.fromJson(typeof part.result === "string" ? part.result : JSON.parse(JSON.stringify(part.result)));
        }
        if (part.isError) {
          protoPart.isError = true;
        }
        if (cursorToolCallIsError !== void 0) {
          protoPart.cursorToolCallIsError = cursorToolCallIsError;
        }
        if (part.experimental_content !== void 0 && part.experimental_content.length > 0) {
          protoPart.experimentalContent = toolResultExperimentalContentToProto(part.experimental_content);
        }
        protoPart.providerOptions = providerOptionsToProto(part.providerOptions);
        return protoPart;
      });
      protoMsg.content = { case: "toolContent", value: toolResultContent };
    }
  } else if (msg.role === "system") {
    protoMsg.content = { case: "text", value: msg.content };
  }
  return protoMsg;
}
function getResponsesMetadataFromProviderOptions(msg) {
  var _a19;
  const cursorOptions = (_a19 = msg.providerOptions) === null || _a19 === void 0 ? void 0 : _a19.cursor;
  const modelProviderMessageId = cursorOptions === null || cursorOptions === void 0 ? void 0 : cursorOptions.modelProviderMessageId;
  const openaiPhase = cursorOptions === null || cursorOptions === void 0 ? void 0 : cursorOptions.openaiPhase;
  return {
    modelProviderMessageId: typeof modelProviderMessageId === "string" ? modelProviderMessageId : void 0,
    openaiPhase: typeof openaiPhase === "string" || openaiPhase === null ? openaiPhase : void 0
  };
}
function providerOptionsFromResponsesMetadata(modelProviderMessageId, openaiPhase, openaiPhaseIsNull) {
  if (modelProviderMessageId === void 0 && openaiPhase === void 0 && !openaiPhaseIsNull) {
    return void 0;
  }
  return {
    cursor: Object.assign(Object.assign({}, modelProviderMessageId !== void 0 ? { modelProviderMessageId } : {}), openaiPhase !== void 0 ? { openaiPhase } : openaiPhaseIsNull ? { openaiPhase: null } : {})
  };
}
function roleToProto(role) {
  switch (role) {
    case "user":
      return InferenceMessageRole.USER;
    case "assistant":
      return InferenceMessageRole.ASSISTANT;
    case "tool":
      return InferenceMessageRole.TOOL;
    case "system":
      return InferenceMessageRole.SYSTEM;
    default:
      return InferenceMessageRole.UNSPECIFIED;
  }
}
function cursorOptionsToProto(cursor) {
  if (!cursor || typeof cursor !== "object") {
    return void 0;
  }
  const protoCursor = new InferenceCursorOptions();
  let hasOptions = false;
  if (typeof cursor.imageDescription === "string" && cursor.imageDescription.length > 0) {
    protoCursor.imageDescription = cursor.imageDescription;
    hasOptions = true;
  }
  if (cursor.imageDescriptions !== null && typeof cursor.imageDescriptions === "object") {
    for (const [key, value] of Object.entries(cursor.imageDescriptions)) {
      const index = Number(key);
      if (Number.isInteger(index) && index >= 0 && typeof value === "string" && value.length > 0) {
        protoCursor.imageDescriptions[index] = value;
        hasOptions = true;
      }
    }
  }
  return hasOptions ? protoCursor : void 0;
}
function providerOptionsToProto(options2) {
  var _a19;
  if (!options2 || typeof options2 !== "object") {
    return void 0;
  }
  const opts = options2;
  const protoOptions = new InferenceProviderOptions();
  let hasOptions = false;
  if ((_a19 = opts.anthropic) === null || _a19 === void 0 ? void 0 : _a19.cacheControl) {
    const anthropicOptions = new InferenceAnthropicOptions();
    const cacheControl = new InferenceCacheControl();
    cacheControl.type = opts.anthropic.cacheControl.type;
    anthropicOptions.cacheControl = cacheControl;
    protoOptions.anthropic = anthropicOptions;
    hasOptions = true;
  }
  const cursorOptions = cursorOptionsToProto(opts.cursor);
  if (cursorOptions !== void 0) {
    protoOptions.cursor = cursorOptions;
    hasOptions = true;
  }
  return hasOptions ? protoOptions : void 0;
}
var DEFAULT_IMAGE_MIME_TYPE2 = "image/png";
function imageBytesToDataUrl(bytes, mimeType) {
  const mime2 = typeof mimeType === "string" && mimeType.trim() !== "" ? mimeType : DEFAULT_IMAGE_MIME_TYPE2;
  return `data:${mime2};base64,${Buffer.from(bytes).toString("base64")}`;
}
function userContentPartToProto(part) {
  var _a19;
  const protoPart = new InferenceContentPart();
  if (part.type === "text") {
    const textPart = new InferenceTextPart();
    textPart.text = part.text;
    textPart.providerOptions = providerOptionsToProto(part.providerOptions);
    protoPart.part = { case: "text", value: textPart };
  } else if (part.type === "image") {
    const imagePart = new InferenceImagePart();
    const image2 = part.image;
    if (typeof image2 === "string") {
      imagePart.data = image2;
    } else if (image2 instanceof URL) {
      imagePart.data = image2.toString();
    } else if (image2 instanceof Uint8Array) {
      imagePart.data = imageBytesToDataUrl(image2, part.mimeType);
    } else if (image2 instanceof ArrayBuffer) {
      imagePart.data = imageBytesToDataUrl(new Uint8Array(image2), part.mimeType);
    }
    imagePart.mimeType = part.mimeType;
    imagePart.providerOptions = providerOptionsToProto(part.providerOptions);
    protoPart.part = { case: "image", value: imagePart };
  } else if (part.type === "file") {
    const textPart = new InferenceTextPart();
    textPart.text = `[File: ${(_a19 = part.name) !== null && _a19 !== void 0 ? _a19 : "unnamed"}]`;
    protoPart.part = { case: "text", value: textPart };
  } else {
    const textPart = new InferenceTextPart();
    textPart.text = "";
    protoPart.part = { case: "text", value: textPart };
  }
  return protoPart;
}
function toolResultExperimentalContentToProto(content) {
  return content.map((item) => {
    const protoPart = new InferenceContentPart();
    if (item.type === "image") {
      protoPart.part = {
        case: "image",
        value: new InferenceImagePart({
          data: item.data,
          mimeType: item.mimeType
        })
      };
    } else {
      protoPart.part = {
        case: "text",
        value: new InferenceTextPart({ text: item.text })
      };
    }
    return protoPart;
  });
}
function agentToolToProto(tool) {
  const protoTool = new InferenceAgentTool();
  protoTool.name = tool.name;
  protoTool.description = tool.description;
  protoTool.parameters = Struct.fromJsonString(JSON.stringify(tool.parameters));
  if (tool.customToolFormat) {
    const customFormat = new InferenceCustomToolFormat();
    customFormat.type = tool.customToolFormat.type;
    customFormat.definition = tool.customToolFormat.definition;
    customFormat.syntax = tool.customToolFormat.syntax;
    protoTool.customToolFormat = customFormat;
  }
  return protoTool;
}
function namedProviderDefinedToolToProto(tool) {
  const protoTool = new InferenceNamedProviderDefinedTool();
  protoTool.name = tool.name;
  protoTool.id = tool.id;
  protoTool.type = tool.type;
  if (tool.options) {
    protoTool.options = Struct.fromJson(tool.options);
  }
  return protoTool;
}
function protoStreamErrorToError(protoError) {
  var _a19;
  if (protoError.errorType === InferenceStreamErrorType.INPUT_TOKEN_LIMIT || protoError.isInputTokenLimitError) {
    return new InputTokenLimitError(protoError.message);
  }
  if (protoError.errorType === InferenceStreamErrorType.OUTPUT_TOKEN_LIMIT || protoError.isOutputTokenLimitError) {
    return new OutputTokensLimitExceededError(protoError.message);
  }
  return (_a19 = classifyTokenLimitErrorFromMessage(protoError.message)) !== null && _a19 !== void 0 ? _a19 : new Error(protoError.message);
}
function buildStreamRequest(options2) {
  var _a19;
  const { messages: messages2, requestedModel, tools, providerDefinedTools, modelConfig, invocationId, conversationId, conversationGroupId, automationId, parentRequestId, rootParentRequestId, parentAgentToolCallId, subagentType, turnUnitId, turnUnitType, compactionEpoch, inferenceReason, acceptedUnadvertisedToolNames } = options2;
  const request5 = new InferenceStreamRequest();
  request5.messages = messages2.map(coreMessageToProto);
  request5.tools = (tools !== null && tools !== void 0 ? tools : []).map(agentToolToProto);
  request5.providerDefinedTools = (providerDefinedTools !== null && providerDefinedTools !== void 0 ? providerDefinedTools : []).map(namedProviderDefinedToolToProto);
  request5.acceptedUnadvertisedToolNames = [...acceptedUnadvertisedToolNames !== null && acceptedUnadvertisedToolNames !== void 0 ? acceptedUnadvertisedToolNames : []];
  request5.requestedModel = new InferenceRequestedModel({
    modelId: requestedModel.modelId,
    maxMode: requestedModel.maxMode,
    parameters: requestedModel.parameters.map((parameter) => new InferenceModelParameterValue({
      id: parameter.id,
      value: parameter.value
    })),
    builtInModel: requestedModel.builtInModel
  });
  if (invocationId) {
    request5.invocationId = invocationId;
  }
  if (conversationId) {
    request5.conversationId = conversationId;
  }
  if (conversationGroupId) {
    request5.conversationGroupId = conversationGroupId;
  }
  if (automationId) {
    request5.automationId = automationId;
  }
  if (parentRequestId) {
    request5.parentRequestId = parentRequestId;
  }
  if (rootParentRequestId) {
    request5.rootParentRequestId = rootParentRequestId;
  }
  if (parentAgentToolCallId) {
    request5.parentAgentToolCallId = parentAgentToolCallId;
  }
  if (subagentType) {
    request5.subagentType = subagentType;
  }
  if (turnUnitId) {
    request5.turnUnitId = turnUnitId;
  }
  if (turnUnitType) {
    request5.turnUnitType = turnUnitType;
  }
  if (compactionEpoch !== void 0) {
    request5.compactionEpoch = compactionEpoch;
  }
  if (inferenceReason) {
    request5.inferenceReason = inferenceReason;
  }
  if (modelConfig) {
    const config2 = new InferenceModelConfig();
    config2.maxTokens = modelConfig.maxTokens;
    config2.temperature = modelConfig.temperature;
    config2.topP = modelConfig.topP;
    config2.stopSequences = (_a19 = modelConfig.stopSequences) !== null && _a19 !== void 0 ? _a19 : [];
    request5.modelConfig = config2;
  }
  return request5;
}
