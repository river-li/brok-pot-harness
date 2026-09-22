/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/generate-image.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path88 = __toESM(require("node:path"), 1);
init_dist4();
init_agent_pb();
init_generate_image_tool_pb();
init_read_exec_pb();
init_write_exec_pb();
init_privacy_mode_pb();
init_dist3();
init_zod();
var __addDisposableResource31 = function(env, value, async) {
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
var __disposeResources31 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error42, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error42, e.suppressed = suppressed, e;
});
var logger83 = createLogger("agent/tools/generate-image");
var generateImageWriteResultCounter = createCounter("agent.tools.generate_image.write_result", {
  description: "Generate image write results by case and location",
  labelNames: ["result", "location", "operation", "is_readonly"]
});
var generateImageAbortCounter = createCounter("agent.tools.generate_image.abort", {
  description: "Generate image aborts by phase and normalized reason",
  labelNames: ["phase", "abort_reason_type"]
});
var generateImageExecuteFinishCounter = createCounter("agent.tools.generate_image.execute.finished", {
  description: "Generate image tool execute outcomes",
  labelNames: ["outcome"]
});
var generateImageExecuteErrorCounter = createCounter("agent.tools.generate_image.execute.error", {
  description: "Generate image tool execute failures by stage",
  labelNames: ["stage"]
});
var generateImageExecuteDurationMs = createHistogram("agent.tools.generate_image.execute.duration_ms", {
  description: "End-to-end generate image execute latency in milliseconds",
  labelNames: ["outcome"]
});
var generateImageRenderFinishCounter = createCounter("agent.tools.generate_image.render.finished", {
  description: "Generate image tool render outcomes",
  labelNames: ["outcome"]
});
var generateImageShortPromptCounter = createCounter("agent.tools.generate_image.short_prompt", {
  description: "Generate image invocations where the description was rejected as too short or suspicious",
  labelNames: ["word_count"]
});
var SHORT_PROMPT_WORD_THRESHOLD = 5;
var VERY_SHORT_PROMPT_WORD_THRESHOLD = 3;
function recordGenerateImageExecuteError(ctx, stage) {
  generateImageExecuteErrorCounter.increment(ctx, 1, { stage });
}
function recordGenerateImageExecuteFinish(ctx, outcome) {
  generateImageExecuteFinishCounter.increment(ctx, 1, { outcome });
}
function recordGenerateImageRenderFinish(ctx, outcome) {
  generateImageRenderFinishCounter.increment(ctx, 1, { outcome });
}
function isResizeImageError(error42) {
  if (!(error42 instanceof Error)) {
    return false;
  }
  const message = error42.message.toLowerCase();
  return message.includes("resize") || message.includes("sharp");
}
function classifyErrorFinishReason(stage) {
  switch (stage) {
    case "project_folder":
      return "missing_project_folder";
    case "provider_inference":
      return "provider_error";
    case "write_output":
      return "write_error";
    case "read_reference_images":
      return "internal_error";
    default: {
      const exhaustiveCheck = stage;
      throw new Error(`Unhandled finish stage: ${exhaustiveCheck}`);
    }
  }
}
function classifyAbortFinishReason(reasonInfo) {
  const errorName = reasonInfo.abortReasonName ?? "";
  const details = `${reasonInfo.abortReasonName ?? ""} ${reasonInfo.abortReasonMessage ?? ""}`.toLowerCase();
  if (errorName === "ToolCallAbortedError" || /user|cancel|cancelled|canceled/.test(details)) {
    return "user_abort";
  }
  if (/disconnect|connection|socket|client closed|broken pipe|econnreset/.test(details)) {
    return "client_disconnect";
  }
  if (/timeout|timed out|deadline|etimedout/.test(details)) {
    return "request_timeout";
  }
  return "internal_error";
}
function classifyAbortFinish(reason) {
  const reasonInfo = getAbortReasonInfo(reason);
  return {
    reasonInfo,
    finishOutcome: classifyAbortFinishReason(reasonInfo)
  };
}
function getPermissionLabels(writeResult) {
  if (writeResult.result.case !== "permissionDenied") {
    return { operation: "n/a", isReadonly: "n/a" };
  }
  const operation = writeResult.result.value.operation || "unknown";
  const isReadonly = writeResult.result.value.isReadonly ? "true" : "false";
  return { operation, isReadonly };
}
function redactPathForLog(value, privacyMode, fieldName) {
  return shouldRedact(privacyMode, DataClassification.PATH) ? formatRedacted(fieldName) : value;
}
var MAX_CONCURRENT_IMAGE_GENERATIONS = 2;
function createImageGenerationConcurrencyLimiter(maxConcurrent = MAX_CONCURRENT_IMAGE_GENERATIONS) {
  const limit = Math.trunc(Number(maxConcurrent));
  if (!Number.isFinite(limit) || limit < 1) {
    throw new RangeError(`createImageGenerationConcurrencyLimiter: maxConcurrent must be a finite number >= 1, got ${maxConcurrent}`);
  }
  let current = 0;
  const waitQueue = [];
  return {
    async acquire() {
      if (current < limit) {
        current++;
        return;
      }
      await new Promise((resolve29) => {
        waitQueue.push(resolve29);
      });
    },
    release() {
      const next = waitQueue.shift();
      if (next) {
        next();
        return;
      }
      if (current > 0) {
        current--;
      }
    }
  };
}
function createGenerateImageToolCall(generateImageTool) {
  return new ToolCall({
    tool: {
      case: "generateImageToolCall",
      value: generateImageTool
    }
  });
}
var supportedAspectRatios = ["1:1", "4:3", "3:4", "16:9", "9:16"];
var parametersSchema16 = external_exports.object({
  description: external_exports.string().describe("A detailed description of the image."),
  filename: external_exports.string().optional().describe("Optional filename for the generated image (e.g., 'diagram.png'). Do not include a directory path - the tool automatically handles where to save and how to display the image. If not provided, a timestamped filename will be generated."),
  reference_image_paths: external_exports.array(external_exports.string()).optional().describe("Optional array of file paths to reference images as additional inputs."),
  aspect_ratio: external_exports.enum(supportedAspectRatios).optional().describe('Optional aspect ratio for the generated image. Supported values are "1:1", "4:3", "3:4", "16:9", and "9:16".')
});
function getImageMimeTypeFromPath(imagePath) {
  const extension3 = import_node_path88.default.extname(imagePath).toLowerCase();
  switch (extension3) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "image/png";
  }
}
function resultToString(result) {
  switch (result.result.case) {
    case "success":
      return `Successfully generated image at: ${result.result.value.filePath}
Always use this absolute path when referring to the image. Do not repeat this image as a Markdown reference; it is already displayed to the user.`;
    case "error":
      return `Failed to generate image, error: ${result.result.value.error}`;
    case void 0:
      return "An unknown error occurred.";
  }
}
function parseProviderErrorFields(responseData) {
  const topErrorSchema = external_exports.object({
    error: external_exports.object({
      message: external_exports.string().optional(),
      provider: external_exports.object({
        body: external_exports.string().optional()
      }).optional()
    }).optional()
  });
  const nestedProviderErrorSchema = external_exports.object({
    error: external_exports.object({
      code: external_exports.string().optional(),
      message: external_exports.string().optional()
    }).optional()
  });
  const topParsed = topErrorSchema.safeParse(responseData);
  if (!topParsed.success || topParsed.data.error === void 0) {
    return {};
  }
  const topError = topParsed.data.error;
  let nestedCode;
  let nestedMessage;
  const providerBody = topError.provider?.body;
  if (providerBody !== void 0) {
    const nestedJson = (() => {
      try {
        return JSON.parse(providerBody);
      } catch {
        return void 0;
      }
    })();
    const nestedParsed = nestedProviderErrorSchema.safeParse(nestedJson);
    if (nestedParsed.success) {
      nestedCode = nestedParsed.data.error?.code?.trim();
      nestedMessage = nestedParsed.data.error?.message?.trim();
    }
  }
  return {
    code: nestedCode && nestedCode.length > 0 ? nestedCode : void 0,
    message: nestedMessage && nestedMessage.length > 0 ? nestedMessage : topError.message && topError.message.trim().length > 0 ? topError.message.trim() : void 0
  };
}
function extractProviderErrorSummary(responseData) {
  const { message: providerMessage, code: providerCode } = parseProviderErrorFields(responseData);
  if (providerMessage === void 0 && providerCode === void 0) {
    return void 0;
  }
  const metadataString = providerCode !== void 0 ? ` (code=${providerCode})` : "";
  const messagePart = providerMessage !== void 0 ? providerMessage : "Image generation request rejected by provider";
  return `${messagePart}${metadataString}`;
}
function isContentSafetyBlockedError(error42) {
  if (error42 instanceof Error) {
    if (error42.name === "ImageGenerationContentSafetyError") {
      return true;
    }
  }
  if (typeof error42 !== "object" || error42 === null) {
    return false;
  }
  const maybeError = error42;
  const fields2 = parseProviderErrorFields(maybeError.response?.data);
  if (fields2.code === "moderation_blocked") {
    return true;
  }
  if (maybeError.cause !== void 0) {
    return isContentSafetyBlockedError(maybeError.cause);
  }
  return false;
}
var CONTENT_SAFETY_BLOCKED_ERROR = "The image generation was blocked due to content safety policies.";
function getProviderResponseStatusCode(error42) {
  if (typeof error42 !== "object" || error42 === null) {
    return void 0;
  }
  const maybeError = error42;
  if (typeof maybeError.response?.status === "number") {
    return maybeError.response.status;
  }
  if (maybeError.cause !== void 0) {
    return getProviderResponseStatusCode(maybeError.cause);
  }
  return void 0;
}
function getProviderResponseDetails(error42) {
  if (typeof error42 !== "object" || error42 === null) {
    return void 0;
  }
  const maybeError = error42;
  const status = typeof maybeError.response?.status === "number" ? maybeError.response.status : void 0;
  const statusText = typeof maybeError.response?.statusText === "string" ? maybeError.response.statusText : void 0;
  const responseData = maybeError.response?.data;
  const providerErrorSummary = extractProviderErrorSummary(responseData);
  if (status !== void 0 || providerErrorSummary !== void 0) {
    const pieces = [];
    if (status !== void 0) {
      pieces.push(statusText && statusText.trim().length > 0 ? `status=${status} ${statusText}` : `status=${status}`);
    }
    if (providerErrorSummary !== void 0) {
      pieces.push(`provider_error=${providerErrorSummary}`);
    }
    return pieces.join(", ");
  }
  if (maybeError.cause !== void 0) {
    return getProviderResponseDetails(maybeError.cause);
  }
  return void 0;
}
function getGenerateImageBaseErrorMessage(error42) {
  return error42 instanceof Error ? error42.message : String(error42);
}
function getGenerateImageDetailedErrorMessage(error42) {
  const baseMessage = getGenerateImageBaseErrorMessage(error42);
  const providerDetails = getProviderResponseDetails(error42);
  if (!providerDetails) {
    return baseMessage;
  }
  if (baseMessage.includes(providerDetails)) {
    return baseMessage;
  }
  return `${baseMessage}. ${providerDetails}`;
}
function classifyProviderStatus(statusCode) {
  return statusCode === 400 ? ToolErrorClassification.INVALID_ARGS : ToolErrorClassification.PROVIDER_ERROR;
}
function createContentSafetyBlockedError() {
  return new CustomToolCallError(ToolErrorClassification.INVALID_ARGS, {
    clientVisibleErrorMessage: CONTENT_SAFETY_BLOCKED_ERROR,
    modelVisibleErrorMessage: CONTENT_SAFETY_BLOCKED_ERROR,
    error: CONTENT_SAFETY_BLOCKED_ERROR
  });
}
function createGenerateImageProviderError({ message, providerStatusCode, contentSafetyBlocked }) {
  if (contentSafetyBlocked) {
    return createContentSafetyBlockedError();
  }
  if (providerStatusCode === void 0) {
    return new Error(message);
  }
  return new CustomToolCallError(classifyProviderStatus(providerStatusCode), {
    clientVisibleErrorMessage: message,
    modelVisibleErrorMessage: message,
    error: `${message}. status=${providerStatusCode}`
  });
}
async function readReferenceImages(ctx, readExecutor, referenceImagePaths, toolCallId, privacyMode) {
  if (referenceImagePaths.length === 0) {
    return [];
  }
  const processReadResult = (imagePath, readResult) => {
    const logImagePath = redactPathForLog(imagePath, privacyMode, "image_path");
    if (readResult.result.case !== "success") {
      logger83.warn(ctx, "[generate-image] ref image read failed", {
        imagePath: logImagePath
      });
      return null;
    }
    const output = readResult.result.value.output;
    if (output.case !== "data" || !output.value || output.value.length === 0) {
      logger83.warn(ctx, "[generate-image] ref image read empty", {
        imagePath: logImagePath
      });
      return null;
    }
    logger83.info(ctx, "[generate-image] ref image read success", {
      imagePath: logImagePath,
      dataLength: output.value.length
    });
    return {
      data: Buffer.from(output.value).toString("base64"),
      mimeType: getImageMimeTypeFromPath(imagePath)
    };
  };
  const results = await Promise.all(referenceImagePaths.map(async (imagePath) => {
    try {
      const readResult = await readExecutor.execute(ctx, new ReadArgs({ path: imagePath, toolCallId }));
      return processReadResult(imagePath, readResult);
    } catch (error42) {
      const logImagePath = redactPathForLog(imagePath, privacyMode, "image_path");
      logger83.error(ctx, "[generate-image] ref image read failed", {
        imagePath: logImagePath,
        error: error42 instanceof Error ? error42.message : String(error42)
      });
      return null;
    }
  }));
  return results.filter((r) => r !== null);
}
function stripDataUriPrefix(imageData) {
  return imageData.includes(",") ? imageData.split(",")[1] : imageData;
}
function crossPlatformBasename(filePath) {
  return import_node_path88.default.basename(normalizeToUnixPath(filePath));
}
function getImageOutputPath(options2) {
  const { projectFolder, filename, artifactsFolder } = options2;
  if (artifactsFolder) {
    return import_node_path88.default.join(artifactsFolder, "assets", filename);
  }
  return import_node_path88.default.join(projectFolder, "assets", filename);
}
async function writeGeneratedImage(ctx, writeExecutor, options2) {
  const { projectFolder, filePath, imageData, artifactsFolder } = options2;
  const location2 = artifactsFolder ? "artifacts" : "project";
  const filename = crossPlatformBasename(filePath);
  const outputPath = getImageOutputPath({
    projectFolder,
    filename,
    artifactsFolder
  });
  const imageBytes = Buffer.from(stripDataUriPrefix(imageData), "base64");
  const privacyMode = options2.privacyMode ?? PrivacyMode.UNSPECIFIED;
  const logOutputPath = redactPathForLog(outputPath, privacyMode, "output_path");
  const writeResult = await writeExecutor.execute(ctx, new WriteArgs({
    path: outputPath,
    fileBytes: new Uint8Array(imageBytes),
    returnFileContentAfterWrite: false
  }));
  const writeResultLabel = writeResult.result.case ?? "undefined";
  const permissionLabels = getPermissionLabels(writeResult);
  generateImageWriteResultCounter.increment(ctx, 1, {
    result: writeResultLabel,
    location: location2,
    operation: permissionLabels.operation,
    is_readonly: permissionLabels.isReadonly
  });
  if (writeResult.result.case !== "success") {
    if (writeResult.result.case === "permissionDenied" && writeResult.result.value.isReadonly) {
      return new GenerateImageResult({
        result: {
          case: "error",
          value: new GenerateImageError({
            error: ASK_MODE_MODEL_ERROR
          })
        }
      });
    }
    const resultCase = writeResult.result.case ?? "undefined";
    let errorDetail;
    let toThrow;
    switch (writeResult.result.case) {
      case "error":
        errorDetail = writeResult.result.value.error;
        toThrow = new Error(`Failed to save generated image: ${errorDetail}`);
        break;
      case "permissionDenied":
        errorDetail = `permission denied (operation=${writeResult.result.value.operation}, isReadonly=${writeResult.result.value.isReadonly}, error=${writeResult.result.value.error})`;
        toThrow = new ToolCallUnexpectedEnvironmentError(`Failed to save generated image: ${errorDetail}`);
        break;
      case "rejected": {
        const rejectedReason = writeResult.result.value.reason;
        errorDetail = `rejected (reason=${rejectedReason})`;
        const message = `Failed to save generated image: ${errorDetail}`;
        toThrow = rejectedReason.includes("Failed to find tool call context") ? new Error(message) : new ToolCallRejectedError(message);
        break;
      }
      case "noSpace":
        errorDetail = "No space left on device";
        toThrow = new CustomToolCallError(ToolErrorClassification.BAD_USER_DEVICE_STATE, {
          clientVisibleErrorMessage: `Failed to save generated image: ${errorDetail}`,
          modelVisibleErrorMessage: `Failed to save generated image: ${errorDetail}`,
          error: `Failed to save generated image: ${errorDetail}`
        });
        break;
      case void 0:
        errorDetail = "unknown result case";
        toThrow = new Error(`Failed to save generated image: ${errorDetail}`);
        break;
      default: {
        const _exhaustive = writeResult.result;
        errorDetail = `unhandled case: ${String(_exhaustive.case)}`;
        toThrow = new Error(`Failed to save generated image: ${errorDetail}`);
        break;
      }
    }
    logger83.error(ctx, "[generate-image] write failed", {
      outputPath: logOutputPath,
      resultCase,
      error: errorDetail
    });
    throw toThrow;
  }
  logger83.info(ctx, "[generate-image] write success", {
    outputPath: logOutputPath,
    size: imageBytes.length
  });
  const resultImageData = artifactsFolder ? "" : Buffer.from((await boundInlineImageForModel(ctx, imageBytes, {
    mimeType: "image/png",
    source: "generate_image"
  })).data).toString("base64");
  return new GenerateImageResult({
    result: {
      case: "success",
      value: new GenerateImageSuccess({
        filePath: outputPath,
        imageData: resultImageData
      })
    }
  });
}
function getToolName(version3) {
  switch (version3) {
    case "dsv3-1018":
      return "generate_image";
    case "cursor-0226":
    case "dsv3-1205":
    case "latest":
    case "gpt5-codex":
    case "codex-cloud":
    case "haiku":
      return "GenerateImage";
    default: {
      const _exhaustive = version3;
      throw new Error(`Unhandled version: ${_exhaustive}`);
    }
  }
}
function getDescription(version3) {
  switch (version3) {
    case "cursor-0226":
    case "dsv3-1205":
    case "gpt5-codex":
    case "codex-cloud":
    case "dsv3-1018":
    case "latest":
    case "haiku":
      return `Generate an image file from a text description.

STRICT INVOCATION RULES (must follow):
- Only use this tool when the user explicitly asks for an image. Do not generate images "just to be helpful".
- Do not use this tool for data heavy visualizations such as charts, plots, tables.

General guidelines:
- Provide a concrete description first: subject(s), layout, style, colors, text (if any), and constraints.
- If the user requests an aspect ratio, set \`aspect_ratio\` to one of "1:1", "4:3", "3:4", "16:9", or "9:16".
- If the user provides reference images, include them in \`reference_image_paths\`.
- Do not repeat generated images as Markdown in your response; the client displays tool-generated images automatically.

Examples that should call this tool:
- user: "Generate an app icon for a note-taking app, minimal flat vector style." (explicitly requests an image asset)
- user: "Make a UI mockup of a settings screen with a dark mode toggle." (explicitly requests a UI mockup)
- user: "Generate an asset of a game character with a sword." (explicitly requests a visual asset)

Examples that should not call this tool:
- user: "Create a plan to refactor this module." (planning request; respond in text or mermaid diagram)
- user: "Generate a chart of sales and revenue using data.csv." (data visualization; generate via code)
`;
    default: {
      const _exhaustive = version3;
      throw new Error(`Unhandled version: ${_exhaustive}`);
    }
  }
}
var DEFAULT_SUSPICIOUS_KEYWORDS = ["ignore", "skip", "stop", "noop"];
var MODEL_RESTRICTED_ERROR = "GenerateImage is not available for the current selected model. If important to generate an image (e.g. the user asked for it), then ask the user to switch models.";
var NO_PROJECT_FOLDER_ERROR = "generate_image needs a workspace/project folder so it has somewhere to save the PNG. Open a folder or run from a workspace, then try again.";
var createGenerateImageTool = (resourceAccessor, generateImageService, promptVersion, requestContext, imageGenerationConcurrencyLimiter, isReadonly, suspiciousKeywords = DEFAULT_SUSPICIOUS_KEYWORDS, isModelRestricted) => {
  promptVersion = promptVersion ?? "latest";
  const execute = async (parentCtx, interactionHandler, rawArgs, meta) => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource31(env_1, createSpan(parentCtx.withName("generateImageExecute")), false);
      const executeStartTimeMs = Date.now();
      let finishRecorded = false;
      let errorStage;
      let executeOutcome = "internal_error";
      const trimmedDescription = rawArgs.description.trim();
      const promptWords = trimmedDescription.length > 0 ? trimmedDescription.split(/\s+/) : [];
      const promptWordCount = promptWords.length;
      const lowerDescription = rawArgs.description.toLowerCase();
      const isSuspicious = promptWordCount <= VERY_SHORT_PROMPT_WORD_THRESHOLD || promptWordCount <= SHORT_PROMPT_WORD_THRESHOLD && suspiciousKeywords.some((kw) => lowerDescription.includes(kw));
      if (isModelRestricted) {
        executeOutcome = "model_restricted";
        recordGenerateImageExecuteFinish(parentCtx, executeOutcome);
        finishRecorded = true;
        generateImageExecuteDurationMs.histogram(parentCtx, Date.now() - executeStartTimeMs, {
          outcome: executeOutcome
        });
        return new GenerateImageResult({
          result: {
            case: "error",
            value: new GenerateImageError({
              error: MODEL_RESTRICTED_ERROR
            })
          }
        });
      }
      if (isSuspicious) {
        generateImageShortPromptCounter.increment(parentCtx, 1, {
          word_count: String(promptWordCount)
        });
        logger83.warn(parentCtx, "[generate-image] short/suspicious prompt rejected", {
          wordCount: promptWordCount
        });
        executeOutcome = "short_prompt_rejected";
        recordGenerateImageExecuteFinish(parentCtx, executeOutcome);
        finishRecorded = true;
        generateImageExecuteDurationMs.histogram(parentCtx, Date.now() - executeStartTimeMs, {
          outcome: executeOutcome
        });
        return new GenerateImageResult({
          result: {
            case: "error",
            value: new GenerateImageError({
              error: "Image generation was not performed \u2014 the tool call appears to be unintended. Do not retry or call GenerateImage again unless the user explicitly asks for an image."
            })
          }
        });
      }
      if (isReadonly) {
        executeOutcome = "readonly_rejected";
        recordGenerateImageExecuteFinish(parentCtx, executeOutcome);
        finishRecorded = true;
        generateImageExecuteDurationMs.histogram(parentCtx, Date.now() - executeStartTimeMs, {
          outcome: executeOutcome
        });
        return new GenerateImageResult({
          result: {
            case: "error",
            value: new GenerateImageError({
              error: ASK_MODE_MODEL_ERROR
            })
          }
        });
      }
      const args = new GenerateImageArgs({
        description: rawArgs.description,
        filePath: rawArgs.filename,
        referenceImagePaths: rawArgs.reference_image_paths ?? [],
        aspectRatio: rawArgs.aspect_ratio
      });
      const baseToolCall = new GenerateImageToolCall({
        args,
        result: void 0
      });
      try {
        const result = await interactionHandler.executeToolCall(spanCtxt.ctx, createGenerateImageToolCall(baseToolCall), meta.toolCallId, async (ctx) => {
          const projectFolder = requestContext?.env?.projectFolder || requestContext?.env?.artifactsFolder || requestContext?.env?.workspacePaths?.[0];
          if (!projectFolder || projectFolder.trim().length === 0) {
            errorStage = "project_folder";
            recordGenerateImageExecuteError(ctx, "project_folder");
            logger83.error(ctx, "[generate-image] no project folder available to save the generated image", {
              generate_image: {
                projectFolder: requestContext?.env?.projectFolder,
                artifactsFolder: requestContext?.env?.artifactsFolder,
                workspacePaths: requestContext?.env?.workspacePaths
              }
            });
            throw new ToolCallUnexpectedEnvironmentError(NO_PROJECT_FOLDER_ERROR);
          }
          const readExecutor = resourceAccessor.get(readExecutorResource);
          const writeExecutor = resourceAccessor.get(writeExecutorResource);
          const privacyMode = meta.stateHandler?.getPrivacyMode() ?? PrivacyMode.UNSPECIFIED;
          let referenceImages;
          try {
            referenceImages = await readReferenceImages(ctx, readExecutor, rawArgs.reference_image_paths ?? [], meta.toolCallId, privacyMode);
          } catch (error42) {
            errorStage = "read_reference_images";
            recordGenerateImageExecuteError(ctx, "read_reference_images");
            throw error42;
          }
          if (imageGenerationConcurrencyLimiter) {
            await imageGenerationConcurrencyLimiter.acquire();
          }
          try {
            let filePath;
            let imageData;
            try {
              const serviceResult = await generateImageService(spanCtxt.ctx, args.description, rawArgs.filename, referenceImages.length > 0 ? referenceImages : void 0, rawArgs.aspect_ratio);
              filePath = serviceResult.filePath;
              imageData = serviceResult.imageData;
              if (serviceResult.usage && meta.stateHandler) {
                meta.stateHandler.addTurnUsage(serviceResult.usage);
              }
            } catch (error42) {
              errorStage = "provider_inference";
              recordGenerateImageExecuteError(ctx, "provider_inference");
              throw error42;
            }
            try {
              return await writeGeneratedImage(ctx, writeExecutor, {
                projectFolder,
                filePath,
                imageData,
                artifactsFolder: requestContext?.env?.artifactsFolder,
                privacyMode
              });
            } catch (error42) {
              errorStage = "write_output";
              recordGenerateImageExecuteError(ctx, "write_output");
              throw error42;
            }
          } finally {
            if (imageGenerationConcurrencyLimiter) {
              imageGenerationConcurrencyLimiter.release();
            }
          }
        }, (result2) => createGenerateImageToolCall(new GenerateImageToolCall({ ...baseToolCall, result: result2 })));
        executeOutcome = "success";
        recordGenerateImageExecuteFinish(parentCtx, executeOutcome);
        finishRecorded = true;
        return result;
      } catch (error42) {
        const isAborted2 = parentCtx.signal.aborted || error42 instanceof ToolCallAbortedError || error42 instanceof Error && error42.name === "AbortError";
        if (isAborted2) {
          const { reasonInfo, finishOutcome } = classifyAbortFinish(parentCtx.reason);
          if (!finishRecorded) {
            executeOutcome = finishOutcome;
            recordGenerateImageExecuteFinish(parentCtx, executeOutcome);
            finishRecorded = true;
          }
          generateImageAbortCounter.increment(parentCtx, 1, {
            phase: "execute",
            abort_reason_type: finishOutcome
          });
          logger83.warn(parentCtx, "[generate-image] aborted", {
            ...reasonInfo,
            abortReason: finishOutcome
          });
        } else if (!finishRecorded) {
          const finishOutcome = errorStage ? classifyErrorFinishReason(errorStage) : "internal_error";
          executeOutcome = finishOutcome;
          recordGenerateImageExecuteFinish(parentCtx, executeOutcome);
          finishRecorded = true;
        }
        const contentSafetyBlocked = isContentSafetyBlockedError(error42);
        if (!isAborted2 && contentSafetyBlocked) {
          throw createContentSafetyBlockedError();
        }
        const providerDetails = getProviderResponseDetails(error42);
        if (!isAborted2 && providerDetails !== void 0) {
          const baseMessage = getGenerateImageBaseErrorMessage(error42);
          const classification = classifyProviderStatus(getProviderResponseStatusCode(error42));
          throw new CustomToolCallError(classification, {
            clientVisibleErrorMessage: baseMessage,
            modelVisibleErrorMessage: baseMessage,
            error: getGenerateImageDetailedErrorMessage(error42)
          });
        }
        throw error42;
      } finally {
        const durationMs = Date.now() - executeStartTimeMs;
        generateImageExecuteDurationMs.histogram(parentCtx, durationMs, {
          outcome: executeOutcome
        });
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources31(env_1);
    }
  };
  const render2 = async (ctx, result, _props) => {
    let renderOutcome = "internal_error";
    try {
      if (result.result.case === "success") {
        const { filePath, imageData } = result.result.value;
        const artifactsFolder = requestContext?.env?.artifactsFolder;
        if (artifactsFolder && filePath.startsWith(artifactsFolder)) {
          renderOutcome = "success";
          return createStringResult(`Successfully generated image. Display it in your response using:
<img src="${filePath}" alt="Generated image" />`);
        }
        const isDsv3Model = promptVersion === "dsv3-1018" || promptVersion === "dsv3-1205" || promptVersion === "cursor-0226";
        if (isDsv3Model) {
          renderOutcome = "success";
          return createStringResult(`Successfully generated image at: ${filePath}
Always use this absolute path when referring to the image. Do not repeat this image as a Markdown reference; it is already displayed to the user.`);
        }
        if (!imageData) {
          renderOutcome = "missing_image_data";
          return createStringResult(`Failed to generate image: no image data returned`);
        }
        const base64Data = imageData.includes(",") ? imageData.split(",")[1] : imageData;
        const imageBuffer = Buffer.from(base64Data, "base64");
        try {
          const resizedImage = await resizeImageBufferIfNeeded(imageBuffer);
          const resizedBase64 = Buffer.from(resizedImage.data).toString("base64");
          renderOutcome = "success";
          return createImageResult(resizedBase64, resizedImage.mimeType, `Successfully generated image at: ${filePath}
Always use this absolute path when referring to the image. Do not repeat this image as a Markdown reference; it is already displayed to the user.`);
        } catch (error42) {
          renderOutcome = isResizeImageError(error42) ? "resize_error" : "internal_error";
          throw error42;
        }
      }
      if (result.result.case === "error" && result.result.value.error === ASK_MODE_MODEL_ERROR) {
        renderOutcome = "success";
        return createStringResult(ASK_MODE_MODEL_ERROR);
      }
      renderOutcome = "success";
      return createStringResult(resultToString(result));
    } finally {
      recordGenerateImageRenderFinish(ctx, renderOutcome);
    }
  };
  const name17 = getToolName(promptVersion);
  const description9 = getDescription(promptVersion);
  return createZodAgentTool("GENERATE_IMAGE", {
    name: name17,
    contextType: { type: "dynamic" },
    descriptionGenerator: (_props) => description9,
    parameters: parametersSchema16,
    execute: withSafeParsedArgs(parametersSchema16, execute, createGenerateImageToolCall(new GenerateImageToolCall())),
    render: render2,
    serializeError: (error42) => {
      const errorMessage6 = error42 instanceof ToolCallError ? error42.clientVisibleErrorMessage : getGenerateImageBaseErrorMessage(error42);
      return createGenerateImageToolCall(new GenerateImageToolCall({
        result: new GenerateImageResult({
          result: {
            case: "error",
            value: new GenerateImageError({
              error: errorMessage6
            })
          }
        })
      }));
    }
  });
};

