var __addDisposableResource32 = function(env, value, async) {
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
var __disposeResources32 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error41, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error41, e.suppressed = suppressed, e;
});
var logger84 = createLogger("tools/read");
var pdfTextCache = /* @__PURE__ */ new Map();
var MAX_CONVERSATION_ID_LENGTH2 = 200;
var READ_LINE_NUMBER_INTERVAL = 10;
function getSafeConversationId3(conversationId) {
  let safe = encodeURIComponent(conversationId);
  safe = safe.replace(/%/g, "_");
  if (safe.length > MAX_CONVERSATION_ID_LENGTH2) {
    safe = safe.slice(0, MAX_CONVERSATION_ID_LENGTH2);
  }
  return safe;
}
function getLastPathComponent(filePath) {
  const parts = filePath.split(/[/\\]+/).filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : filePath;
}
function stripKnownTranscriptExtension(fileName) {
  if (fileName.endsWith(".txt")) {
    return fileName.slice(0, -4);
  }
  if (fileName.endsWith(".json")) {
    return fileName.slice(0, -5);
  }
  return fileName;
}
function getSkillIdFromPath2(filePath) {
  const normalized = filePath.replace(/\\/g, "/").replace(/\/+$/, "");
  const withoutSkillSuffix = normalized.replace(/\/SKILL\.md$/i, "");
  const parts = withoutSkillSuffix.split("/").filter(Boolean);
  if (parts.length > 0) {
    return parts[parts.length - 1] ?? withoutSkillSuffix;
  }
  return getLastPathComponent(withoutSkillSuffix);
}
function normalizeComparablePath(filePath) {
  return filePath.replace(/\\/g, "/").replace(/\/+$/, "");
}
function findMatchingAgentSkill(filePath, agentSkills) {
  if (!agentSkills || agentSkills.length === 0) {
    return void 0;
  }
  const normalized = normalizeComparablePath(filePath);
  return agentSkills.find((skill) => {
    const fullPath = skill.fullPath;
    if (!fullPath) {
      return false;
    }
    return normalizeComparablePath(fullPath) === normalized;
  });
}
function findMatchingCursorRule(filePath, cursorRules) {
  if (!cursorRules || cursorRules.length === 0) {
    return void 0;
  }
  const normalized = normalizeComparablePath(filePath);
  return cursorRules.find((rule) => {
    const fullPath = rule.fullPath;
    if (!fullPath) {
      return false;
    }
    return normalizeComparablePath(fullPath) === normalized;
  });
}
function normalizeLineEndings2(content) {
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function toSkillReminderReadPath(skillPath) {
  return `__skill_reminder__:${skillPath}`;
}
var readErrorsDistribution = createHistogram("agent.tools.read.errors", {
  description: "Number of errors per read operation",
  labelNames: []
});
var readTotalCounter = createCounter("agent.tools.read.total", {
  description: "Total file read operations",
  labelNames: []
});
var readSuccessCounter = createCounter("agent.tools.read.success", {
  description: "Successful file read operations by requested scope",
  // explicit_desc mirrors the read_file_explicit_offset_limit_description
  // experiment arm so Datadog can split Control vs Test without a warehouse join.
  labelNames: [
    "read_scope",
    "repeat_status",
    "exceeded_limit",
    "explicit_desc"
  ]
});
var readReturnedLinesHistogram = createHistogram("agent.tools.read.returned_lines", {
  description: "Number of lines returned by successful file reads",
  labelNames: ["read_scope", "repeat_status", "explicit_desc"]
});
var readTotalFileLinesHistogram = createHistogram("agent.tools.read.total_file_lines", {
  description: "Total number of lines in successfully read files",
  labelNames: ["read_scope", "repeat_status", "explicit_desc"]
});
var readFileSizeBytesHistogram = createHistogram("agent.tools.read.file_size_bytes", {
  description: "Size in bytes of successfully read files",
  labelNames: ["read_scope", "repeat_status", "explicit_desc"]
});
var readReturnedBytesHistogram = createHistogram("agent.tools.read.returned_bytes", {
  description: "Number of bytes returned by successful file reads",
  labelNames: ["read_scope", "repeat_status", "explicit_desc"]
});
var readCoveragePercentHistogram = createHistogram("agent.tools.read.coverage_percent", {
  description: "Percentage of file lines returned by successful file reads",
  labelNames: ["read_scope", "repeat_status", "explicit_desc"]
});
var EXPLICIT_OFFSET_OMIT_BULLET = "Omit offset and limit to read the entire file.";
var EXPLICIT_OFFSET_PROVIDE_BULLET = "Provide offset and limit to read a specific line range (especially for long files).";
function appliesExplicitOffsetLimitDescription(args) {
  if (!args.useExplicitOffsetLimitDescription || args.useMinimalHarness || args.hasToolDescriptionOverride) {
    return false;
  }
  switch (args.promptVersion) {
    case "cursor-0226":
    case "haiku":
      return false;
    case "dsv3-1018":
    case "dsv3-1205":
    case "gpt5-codex":
    case "codex-cloud":
    case "latest":
      return true;
    default: {
      const _exhaustive = args.promptVersion;
      throw new Error(`Unhandled version: ${_exhaustive}`);
    }
  }
}
function getReadScope(offset, limit) {
  if (limit !== void 0) {
    return "limited";
  }
  if (offset !== void 0) {
    return "offset_to_end";
  }
  return "full_file";
}
function getReturnedLineCount(success2) {
  if (success2.exceededLimit) {
    return void 0;
  }
  const readRange = success2.readRange;
  if (!readRange) {
    return void 0;
  }
  return Math.max(0, readRange.endLine - readRange.startLine + 1);
}
function getReturnedByteCount(success2, blobBackedReturnedByteCount) {
  const output = success2.output;
  if (!output || success2.exceededLimit) {
    return void 0;
  }
  switch (output.case) {
    case "content":
      return Buffer.byteLength(output.value, "utf8");
    case "data":
      return output.value.byteLength;
    case "contentBlobId":
    case "dataBlobId":
      return blobBackedReturnedByteCount;
  }
}
function recordReadSuccessMetrics(ctx, success2, readScope, repeatStatus, blobBackedReturnedByteCount, explicitDesc) {
  const labels = {
    read_scope: readScope,
    repeat_status: repeatStatus,
    explicit_desc: explicitDesc
  };
  readSuccessCounter.increment(ctx, 1, {
    ...labels,
    exceeded_limit: success2.exceededLimit ? "true" : "false"
  });
  readTotalFileLinesHistogram.histogram(ctx, success2.totalLines, labels);
  readFileSizeBytesHistogram.histogram(ctx, success2.fileSize, labels);
  const returnedLines = getReturnedLineCount(success2);
  if (returnedLines !== void 0) {
    readReturnedLinesHistogram.histogram(ctx, returnedLines, labels);
    if (success2.totalLines > 0) {
      readCoveragePercentHistogram.histogram(ctx, returnedLines / success2.totalLines * 100, labels);
    }
  }
  const returnedBytes = getReturnedByteCount(success2, blobBackedReturnedByteCount);
  if (returnedBytes !== void 0) {
    readReturnedBytesHistogram.histogram(ctx, returnedBytes, labels);
  }
}
function createReadToolCall(readTool) {
  return new ToolCall({
    tool: {
      case: "readToolCall",
      value: readTool
    }
  });
}
function createSuccessResult(content, totalLines, fileSize, filePath, readRange, includeLineNumbers) {
  if (content.length > READ_CHAR_HARD_LIMIT) {
    return new ReadToolResult({
      result: {
        case: "success",
        value: new ReadToolSuccess({
          output: {
            case: "content",
            value: ""
          },
          isEmpty: false,
          exceededLimit: true,
          totalLines,
          fileSize,
          path: filePath,
          readRange,
          includeLineNumbers
        })
      }
    });
  }
  return new ReadToolResult({
    result: {
      case: "success",
      value: new ReadToolSuccess({
        output: {
          case: "content",
          value: content
        },
        // Only mark as empty when the file itself is empty (not when a selected
        // range happens to consist of empty line(s)).
        isEmpty: totalLines === 0 && content === "",
        exceededLimit: false,
        totalLines,
        fileSize,
        path: filePath,
        readRange,
        includeLineNumbers
      })
    }
  });
}
function computeReadSlice(totalLines, offset, limit) {
  if (offset === void 0 && limit === void 0) {
    return void 0;
  }
  const effectiveOffset = offset ?? 1;
  const effectiveLimit = limit ?? (effectiveOffset < 0 ? Math.abs(effectiveOffset) : totalLines);
  const startIndex = effectiveOffset < 0 ? Math.max(0, totalLines + effectiveOffset) : Math.max(0, effectiveOffset - 1);
  const endIndex = Math.min(totalLines, startIndex + effectiveLimit);
  if (startIndex >= totalLines) {
    throw new ToolCallUnexpectedEnvironmentError(`Offset ${offset} is beyond file length (${totalLines} lines)`);
  }
  return {
    startIndex,
    endIndex,
    readRange: new ReadRange({
      startLine: startIndex + 1,
      endLine: endIndex
    })
  };
}
function createOffsetSchema(options2 = {}) {
  const baseNumberSchema = options2.requireInt ? external_exports.number().int() : external_exports.number();
  const allowNegative = options2.includeNegativeOffset ?? false;
  const description10 = allowNegative ? "The line number to start reading from. Positive values are 1-indexed from the start of the file. Negative values count backwards from the end (e.g. -1 is the last line). Only provide if the file is too large to read at once." : "The line number to start reading from. Only provide if the file is too large to read at once.";
  const errorMessage6 = allowNegative ? "Offset must be >= 1 or <= -1." : "Offset must be >= 1.";
  return lenientNumber(baseNumberSchema).optional().refine((val) => {
    if (val === void 0 || val === 0 || val >= 1)
      return true;
    if (allowNegative && val <= -1)
      return true;
    return false;
  }, errorMessage6).transform((val) => {
    if (val === void 0)
      return void 0;
    if (val === 0)
      return 1;
    return val;
  }).describe(description10);
}
function createLimitSchema(options2 = {}) {
  const baseNumberSchema = options2.requireInt ? external_exports.number().int() : external_exports.number();
  return lenientNumber(baseNumberSchema).optional().refine((val) => val === void 0 || val >= 1, "Limit must be >= 1.").describe("The number of lines to read. Only provide if the file is too large to read at once.");
}
function createIncludeLineNumbersSchema(useSparseReadLineNumbers) {
  const denseFormatDescription = useSparseReadLineNumbers ? "" : " Lines are numbered starting at 1, using the format LINE_NUMBER|LINE_CONTENT.";
  return external_exports.boolean().optional().describe(`Whether to include line numbers in the output.${denseFormatDescription} Prefer using this only when needed, e.g. for citing codeblocks to the user. Defaults to false.`);
}
function createParametersSchemaLatest({ includeEnableLineNumbers, includeNegativeOffset, useSparseReadLineNumbers }) {
  const baseSchema = external_exports.object({
    path: external_exports.string().describe("The absolute path of the file to read."),
    // ReadArgs.offset/limit are int32 in proto, so reject fractional values early.
    offset: createOffsetSchema({ requireInt: true, includeNegativeOffset }),
    limit: createLimitSchema({ requireInt: true })
  });
  if (includeEnableLineNumbers) {
    return baseSchema.extend({
      include_line_numbers: createIncludeLineNumbersSchema(useSparseReadLineNumbers)
    });
  }
  return baseSchema;
}
function createParametersSchemaDsv3({ includeEnableLineNumbers, useSparseReadLineNumbers }) {
  const baseSchema = external_exports.object({
    target_file: external_exports.string().describe("The path of the file to read. You can use either a relative path in the workspace or an absolute path. If an absolute path is provided, it will be preserved as is."),
    offset: createOffsetSchema({ requireInt: true }),
    limit: createLimitSchema({ requireInt: true })
  });
  if (includeEnableLineNumbers) {
    return baseSchema.extend({
      include_line_numbers: createIncludeLineNumbersSchema(useSparseReadLineNumbers)
    });
  }
  return baseSchema;
}
function createParametersSchemaHaiku({ includeEnableLineNumbers, useSparseReadLineNumbers }) {
  const baseSchema = external_exports.object({
    path: external_exports.string().describe("The absolute path of the file to read."),
    line_range: external_exports.array(external_exports.number().int()).min(2).max(2).optional().describe("Optional. A two-element array [start_line, end_line] specifying the range of lines to read (1-indexed, inclusive). Example: [100, 150] reads lines 100 through 150.")
  });
  if (includeEnableLineNumbers) {
    return baseSchema.extend({
      include_line_numbers: createIncludeLineNumbersSchema(useSparseReadLineNumbers)
    });
  }
  return baseSchema;
}
function getParametersSchema({ version: version3, includeEnableLineNumbers, includeNegativeOffset, useSparseReadLineNumbers }) {
  switch (version3) {
    case "dsv3-1018":
      return createParametersSchemaDsv3({
        includeEnableLineNumbers,
        useSparseReadLineNumbers
      });
    case "cursor-0226":
      return createParametersSchemaLatest({
        includeEnableLineNumbers,
        // 0226 always uses negative offsets in training, so always include it regardless of feature-flag
        includeNegativeOffset: true,
        useSparseReadLineNumbers
      });
    case "dsv3-1205":
    case "latest":
    case "gpt5-codex":
    case "codex-cloud":
      return createParametersSchemaLatest({
        includeEnableLineNumbers,
        includeNegativeOffset,
        useSparseReadLineNumbers
      });
    case "haiku":
      return createParametersSchemaHaiku({
        includeEnableLineNumbers,
        useSparseReadLineNumbers
      });
    default: {
      const _exhaustive = version3;
      throw new Error(`Unhandled version: ${_exhaustive}`);
    }
  }
}
var createReadTool = (resourceAccessor, formattingOptions, promptVersion, options2) => {
  const readExecutor = options2?.preferRedactedRead ? resourceAccessor.get(redactedReadExecutorResource) : resourceAccessor.get(readExecutorResource);
  promptVersion = promptVersion ?? "latest";
  const enableLineNumbersArg = options2?.enableLineNumbersArg ?? false;
  const enableNegativeOffset = options2?.enableNegativeOffset ?? false;
  const useMinimalHarness = options2?.useMinimalHarness ?? false;
  const useExplicitOffsetLimitDescription = options2?.useExplicitOffsetLimitDescription === true;
  const useSparseReadLineNumbers = formattingOptions.useSparseReadLineNumbers === true;
  const appliedExplicitDescLabel = appliesExplicitOffsetLimitDescription({
    promptVersion,
    useExplicitOffsetLimitDescription,
    useMinimalHarness,
    hasToolDescriptionOverride: options2?.toolDescription !== void 0
  }) ? "true" : "false";
  const execute = async (parentCtx, interactionHandler, rawArgs, meta) => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource32(env_1, createSpan(parentCtx.withName("readExecute")), false);
      const machineId = resolveMachineIdArgument(options2?.machineIds, rawArgs);
      const originalPath = "target_file" in rawArgs ? rawArgs.target_file : rawArgs.path;
      const path31 = maybeRedirectWorktriesPath(originalPath);
      trackMcpDirectoryAccessIfApplicable(spanCtxt.ctx, path31, "read");
      if (isAgentTranscriptPath(path31)) {
        const conversationId = getConversationId(spanCtxt.ctx);
        const safeConversationId = conversationId !== void 0 ? getSafeConversationId3(conversationId) : void 0;
        const targetLeaf = stripKnownTranscriptExtension(getLastPathComponent(path31));
        const wasOwnTranscript = conversationId !== void 0 ? targetLeaf === conversationId || targetLeaf === safeConversationId : void 0;
        logger84.info(spanCtxt.ctx, "Model accessed agent transcript path", {
          tool: "read",
          toolCallId: meta.toolCallId,
          wasOwnTranscript
        });
      }
      const UNSUPPORTED_BINARY_EXTENSIONS = /\.(zip|tar|gz|exe|dll|so|dylib|bin|mp4|webm|mov|avi|mkv|wmv|flv|m4v)$/i;
      if (UNSUPPORTED_BINARY_EXTENSIONS.test(path31)) {
        const ext2 = path31.toLowerCase().match(/\.([^.]+)$/)?.[1] ?? "unknown";
        return new ReadToolResult({
          result: {
            case: "error",
            value: new ReadToolError({
              errorMessage: `Cannot read binary files of type ${ext2}`
            })
          }
        });
      }
      let offset;
      let limit;
      if ("line_range" in rawArgs && rawArgs.line_range !== void 0) {
        const [startLine, endLine] = rawArgs.line_range;
        offset = startLine;
        limit = endLine - startLine + 1;
      } else if ("offset" in rawArgs || "limit" in rawArgs) {
        offset = "offset" in rawArgs ? rawArgs.offset : void 0;
        limit = "limit" in rawArgs ? rawArgs.limit : void 0;
      }
      const includeLineNumbers = rawArgs.include_line_numbers;
      if (enableLineNumbersArg) {
        logger84.info(spanCtxt.ctx, "nal.read.include_line_numbers_arg", {
          modelPassedArg: includeLineNumbers !== void 0,
          includeLineNumbersValue: includeLineNumbers ?? false,
          path: path31,
          toolCallId: meta.toolCallId
        });
      }
      if (offset !== void 0 || limit !== void 0) {
        logger84.info(spanCtxt.ctx, "Read called with offset or limit", {
          offset,
          limit,
          path: path31,
          toolCallId: meta.toolCallId
        });
      }
      const toolArgs = new ReadToolArgs({
        path: path31,
        offset,
        limit,
        includeLineNumbers
      });
      const baseToolCall = new ReadToolCall({
        args: toolArgs,
        result: void 0
      });
      let errorCount = 0;
      let blobBackedReturnedByteCount;
      const readToolResult = await interactionHandler.executeToolCall(spanCtxt.ctx, createReadToolCall(baseToolCall), meta.toolCallId, async (ctx) => {
        const execArgs = new ReadArgs({
          path: path31,
          toolCallId: meta.toolCallId,
          offset,
          limit
        });
        const execId = generateSeededUuid(meta.toolCallId);
        const execResult = await readExecutor.execute(ctx, execArgs, {
          execId,
          hookContextCollector: meta.hookContextCollector,
          ...machineId !== void 0 ? { machineId } : {}
        });
        if (execResult.result.case === "success") {
          const execSuccess = execResult.result.value;
          const resolvedPath = execSuccess.path;
          const fileSizeBigInt = execSuccess.fileSize;
          const fileSize = Number(fileSizeBigInt);
          const executorAppliedRange = execSuccess.rangeApplied === true;
          const executorTotalLines = execSuccess.totalLines;
          const execOutput = execSuccess.output;
          let pdfContentOverride;
          if (execOutput.case === "data") {
            let binaryData = execOutput.value;
            if (isPdfBinary(binaryData, resolvedPath)) {
              const cachedPdfText = pdfTextCache.get(resolvedPath);
              if (cachedPdfText !== void 0) {
                pdfContentOverride = cachedPdfText;
                logger84.info(ctx, "Using cached PDF text content", {
                  path: resolvedPath,
                  toolCallId: meta.toolCallId
                });
              } else {
                const extractedPdfText = await extractPdfText(binaryData);
                pdfContentOverride = normalizeLineEndings2(extractedPdfText);
                pdfTextCache.set(resolvedPath, pdfContentOverride);
                logger84.info(ctx, "Converted PDF binary to text content", {
                  path: resolvedPath,
                  toolCallId: meta.toolCallId
                });
              }
            }
            if (pdfContentOverride === void 0) {
              const imageMimeType = detectImageMimeType(binaryData, resolvedPath);
              if (imageMimeType !== void 0) {
                const bounded = await boundInlineImageForModel(ctx, binaryData, { mimeType: imageMimeType, source: "read" });
                if (bounded.data !== binaryData) {
                  binaryData = bounded.data;
                  execSuccess.outputBlobId = void 0;
                }
              }
              let blobId = execSuccess.outputBlobId;
              const blobStore2 = meta.stateHandler?.getBlobStore();
              if (blobStore2) {
                blobBackedReturnedByteCount = binaryData.byteLength;
                if (!blobId || blobId.length === 0) {
                  blobId = await getBlobId(binaryData);
                  await blobStore2.setBlob(ctx, blobId, binaryData);
                } else {
                  await blobStore2.setBlobLocallyOnly(ctx, blobId, binaryData);
                }
                return new ReadToolResult({
                  result: {
                    case: "success",
                    value: new ReadToolSuccess({
                      output: { case: "dataBlobId", value: blobId },
                      isEmpty: false,
                      exceededLimit: false,
                      totalLines: 0,
                      fileSize,
                      path: resolvedPath,
                      readRange: void 0
                    })
                  }
                });
              }
              return new ReadToolResult({
                result: {
                  case: "success",
                  value: new ReadToolSuccess({
                    output: { case: "data", value: binaryData },
                    isEmpty: false,
                    exceededLimit: false,
                    totalLines: 0,
                    fileSize,
                    path: resolvedPath,
                    readRange: void 0
                  })
                }
              });
            }
          }
          let content;
          if (pdfContentOverride !== void 0) {
            content = pdfContentOverride;
          } else if (execOutput.case === "content") {
            content = execOutput.value;
          } else {
            errorCount++;
            throw new ToolCallUnexpectedEnvironmentError("Unknown output type");
          }
          if (content === "" && !executorAppliedRange) {
            return createSuccessResult("", 0, fileSize, resolvedPath, void 0, includeLineNumbers);
          }
          if (executorAppliedRange) {
            const readSlice2 = computeReadSlice(executorTotalLines, offset, limit);
            const readRange2 = readSlice2?.readRange ?? new ReadRange({
              startLine: 1,
              endLine: executorTotalLines
            });
            return createSuccessResult(content, executorTotalLines, fileSize, resolvedPath, readRange2, includeLineNumbers);
          }
          const lines2 = content.split("\n");
          const totalLines = lines2.length;
          const readSlice = computeReadSlice(totalLines, offset, limit);
          if (readSlice !== void 0) {
            const selectedLines = lines2.slice(readSlice.startIndex, readSlice.endIndex);
            const selectedContent = selectedLines.join("\n");
            return createSuccessResult(selectedContent, totalLines, fileSize, resolvedPath, readSlice.readRange, includeLineNumbers);
          }
          const readRange = new ReadRange({
            startLine: 1,
            endLine: totalLines
          });
          const blobStore = meta.stateHandler?.getBlobStore();
          if (blobStore && content.length > LARGE_TEXT_BLOB_THRESHOLD && content.length <= READ_CHAR_HARD_LIMIT) {
            const contentBytes = new TextEncoder().encode(content);
            blobBackedReturnedByteCount = contentBytes.byteLength;
            let blobId = execSuccess.outputBlobId;
            if (!blobId || blobId.length === 0) {
              blobId = await getBlobId(contentBytes);
              await blobStore.setBlob(ctx, blobId, contentBytes);
            } else {
              await blobStore.setBlobLocallyOnly(ctx, blobId, contentBytes);
            }
            return new ReadToolResult({
              result: {
                case: "success",
                value: new ReadToolSuccess({
                  output: { case: "contentBlobId", value: blobId },
                  isEmpty: false,
                  exceededLimit: false,
                  totalLines,
                  fileSize,
                  path: resolvedPath,
                  readRange,
                  includeLineNumbers
                })
              }
            });
          }
          return createSuccessResult(content, totalLines, fileSize, resolvedPath, readRange, includeLineNumbers);
        } else {
          errorCount++;
          switch (execResult.result.case) {
            case "error":
              throw new ToolCallError({
                clientVisibleErrorMessage: execResult.result.value.error,
                modelVisibleErrorMessage: execResult.result.value.error,
                error: execResult.result.value.error
              });
            case "rejected":
              throw new ToolCallRejectedError(execResult.result.value.reason || "Read operation rejected");
            case "fileNotFound":
              throw new ToolCallUnexpectedEnvironmentError("File not found");
            case "permissionDenied":
              throw new ToolCallUnexpectedEnvironmentError("Permission denied");
            case "invalidFile":
              throw new ToolCallUnexpectedEnvironmentError(execResult.result.value.reason || "Path is not a valid file to read");
            default:
              throw new Error("Unknown error");
          }
        }
      }, (result) => createReadToolCall(new ReadToolCall({ ...baseToolCall, result })), meta.hookContextCollector);
      if (readToolResult.result.case === "success") {
        const { path: resolvedPath } = readToolResult.result.value;
        const hasSeenReadPath = (path32) => (meta.stateHandler?.readPaths?.has(path32) ?? false) || (meta.stepReadPathDedup?.has(path32) ?? false);
        const rememberReadPath = (path32) => {
          meta.stateHandler?.recordReadPath(safeString(path32));
          meta.stepReadPathDedup?.add(path32);
        };
        const isNewPath = !hasSeenReadPath(resolvedPath);
        recordReadSuccessMetrics(spanCtxt.ctx, readToolResult.result.value, getReadScope(offset, limit), isNewPath ? "first" : "repeat", blobBackedReturnedByteCount, appliedExplicitDescLabel);
        if (isNewPath && meta.cursorRules && meta.cursorRules.length > 0) {
          const matches = matchFileScopedRulesToReadPaths({
            readPaths: [resolvedPath],
            rules: meta.cursorRules,
            workspacePaths: meta.workspacePaths ?? []
          });
          if (matches.size > 0) {
            const ruleByPath = new Map(meta.cursorRules.filter((rule) => rule.fullPath).map((rule) => [rule.fullPath, rule]));
            const relatedCursorRules = [];
            for (const rulePath of Array.from(matches.keys()).sort()) {
              if (hasSeenReadPath(rulePath)) {
                continue;
              }
              const rule = ruleByPath.get(rulePath);
              if (!rule) {
                continue;
              }
              relatedCursorRules.push(rule);
              rememberReadPath(rulePath);
            }
            if (relatedCursorRules.length > 0) {
              readToolResult.result.value.relatedCursorRules = relatedCursorRules;
            }
          }
        }
        if (isNewPath && meta.agentSkills && meta.agentSkills.length > 0) {
          const eligibleAgentSkills = filterByAgentEnvironment(meta.agentSkills, meta.stateHandler?.agentType);
          const skillMatches = matchFileScopedSkillsToReadPaths({
            readPaths: [resolvedPath],
            skills: eligibleAgentSkills,
            workspacePaths: meta.workspacePaths ?? []
          });
          const newSkills = [];
          for (const [skillPath, skill] of Array.from(skillMatches.entries()).sort((a, b2) => a[0].localeCompare(b2[0]))) {
            const skillReminderReadPath = toSkillReminderReadPath(skillPath);
            if (hasSeenReadPath(skillReminderReadPath)) {
              continue;
            }
            newSkills.push(skill);
            rememberReadPath(skillReminderReadPath);
          }
          if (newSkills.length > 0) {
            relatedSkillsBySuccess.set(readToolResult.result.value, newSkills);
          } else {
            relatedSkillsBySuccess.delete(readToolResult.result.value);
          }
        } else {
          relatedSkillsBySuccess.delete(readToolResult.result.value);
        }
        rememberReadPath(resolvedPath);
        if (resolvedPath.endsWith("SKILL.md")) {
          const tracker = getAgentEventTracker(spanCtxt.ctx);
          const matchedSkill = findMatchingAgentSkill(resolvedPath, meta.agentSkills) ?? findMatchingCursorRule(resolvedPath, meta.cursorRules);
          const plugin = matchedSkill?.plugin;
          const marketplace = matchedSkill?.marketplace;
          const pluginId = matchedSkill?.pluginId;
          const marketplaceId = matchedSkill?.marketplaceId;
          tracker.trackSkillUsed(spanCtxt.ctx, {
            plugin,
            marketplace,
            pluginId,
            marketplaceId
          });
          recordSkillApplied(spanCtxt.ctx, {
            entrypoint: "agent_read",
            stateHandler: meta.stateHandler,
            // Only on the (rare) SKILL.md read: resolves the current turn's
            // user message so `skill_name_in_prompt` can be reported by loops
            // that never see the request action (cloud agents).
            userMessageText: await resolveCurrentTurnUserMessageText(spanCtxt.ctx, meta.stateHandler).catch(() => void 0),
            skillId: getSkillIdFromPath2(resolvedPath),
            skillSource: getSkillSourceFromPath(resolvedPath),
            plugin,
            marketplace,
            pluginId,
            marketplaceId
          });
        }
      }
      readTotalCounter.increment(spanCtxt.ctx, 1);
      readErrorsDistribution.histogram(spanCtxt.ctx, errorCount);
      if (isMcpDirectoryPath2(path31) && readToolResult.result.case === "success" && readToolResult.result.value.output?.case === "content") {
        trackMcpDirectoryResponseBytes(spanCtxt.ctx, Buffer.byteLength(readToolResult.result.value.output.value, "utf8"), "read");
      }
      return readToolResult;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources32(env_1);
    }
  };
  const renderCursorRuleReminder = (relatedCursorRules) => {
    if (relatedCursorRules.length === 0) {
      return void 0;
    }
    const ruleBlocks = relatedCursorRules.map((rule) => {
      const content = rule.content.trimEnd();
      const body = content.length > 0 ? content : "(Rule file is empty.)";
      const rulePath = rule.fullPath || "(unknown rule path)";
      return `- ${rulePath}
${body}`;
    });
    const lines2 = [
      "The following cursor rule files are relevant to the files you just read:",
      ...ruleBlocks
    ];
    lines2.push("Consider these rules if they affect your changes.");
    return lines2.join("\n\n");
  };
  const getRelatedCursorRules = (success2) => success2.relatedCursorRules ?? [];
  const relatedSkillsBySuccess = /* @__PURE__ */ new WeakMap();
  const getRelatedSkills = (success2) => relatedSkillsBySuccess.get(success2) ?? [];
  const renderSkillReminder = (skills) => {
    if (skills.length === 0) {
      return void 0;
    }
    const skillBlocks = skills.map((skill) => {
      const description11 = skill.description || "(No description)";
      return `- ${skill.fullPath}
${description11}`;
    });
    const lines2 = [
      "The following skills may be relevant to the files you just read:",
      ...skillBlocks
    ];
    return lines2.join("\n\n");
  };
  const render2 = async (ctx, { result }, props) => {
    const hydratedBlobs = /* @__PURE__ */ new Map();
    if (result?.case === "success") {
      const outputCase = result.value.output?.case;
      if (outputCase === "dataBlobId" || outputCase === "contentBlobId") {
        const blobId = result.value.output.value;
        if (props.blobStore) {
          const blobIdHex = toHex3(blobId);
          const blobData = await props.blobStore.getBlob(ctx, blobId);
          if (!blobData) {
            throw new Error(`Failed to hydrate blob ${blobIdHex} for tool Read`);
          }
          hydratedBlobs.set(blobIdHex, blobData);
        } else {
          throw new Error(`Cannot hydrate blobs for tool Read: no blob store available`);
        }
      }
    }
    if (!result) {
      return createStringResult("Unknown error", true);
    }
    const renderImageBinary = (imgData, filePath) => {
      const mimeType = detectImageMimeType(imgData, filePath);
      const base64Data = Buffer.from(imgData).toString("base64");
      return {
        content: [
          {
            type: "text",
            text: `Read image file: ${filePath}`
          },
          {
            type: "image",
            data: base64Data,
            mimeType
          }
        ],
        isError: false
      };
    };
    switch (result.case) {
      case "success":
        if (result.value.isEmpty) {
          return createStringResult("File is empty.");
        } else if (result.value.exceededLimit) {
          return createStringResult(`File content (${result.value.fileSize} characters) exceeds maximum allowed characters (${READ_CHAR_HARD_LIMIT} characters).
Please use offset and limit parameters to read specific portions of the file, or use the 'grep' tool to search for specific content.`);
        } else {
          const output = result.value.output;
          if (!output) {
            return createStringResult("Unknown error: no output", true);
          }
          switch (output.case) {
            case "content":
            case "contentBlobId": {
              let rawContent;
              if (output.case === "content") {
                rawContent = output.value;
              } else {
                const blobIdHex = toHex3(output.value);
                const contentBytes = hydratedBlobs.get(blobIdHex);
                if (!contentBytes) {
                  throw new Error(`Content blob not hydrated for render: ${blobIdHex} (path: ${result.value.path})`);
                }
                rawContent = utf8Serde.deserialize(contentBytes);
              }
              const filePath = result.value.path;
              const totalLines = result.value.totalLines;
              const startLineNumber = result.value.readRange?.startLine ?? 1;
              const isNotebook = isJupyterNotebook2(filePath);
              if (isNotebook) {
                const notebookFormatted = formatNotebookForLLM(rawContent);
                const cursorRuleReminder2 = renderCursorRuleReminder(getRelatedCursorRules(result.value));
                const skillReminder2 = renderSkillReminder(getRelatedSkills(result.value));
                let finalContent2 = notebookFormatted;
                if (cursorRuleReminder2) {
                  finalContent2 = `${finalContent2}

${cursorRuleReminder2}`;
                }
                if (skillReminder2) {
                  finalContent2 = `${finalContent2}

${skillReminder2}`;
                }
                return createStringResult(finalContent2);
              }
              const shouldIncludeLineNumbers = result.value.includeLineNumbers ?? (enableLineNumbersArg ? false : formattingOptions.enableLineNumbers ?? false);
              const formattedContent = formatCodeBlock({
                content: rawContent,
                filePath,
                startLineNumber,
                totalLineNumbersInFile: totalLines,
                formattingOptions: {
                  ...formattingOptions,
                  gpt5StyleLineNumbers: useSparseReadLineNumbers ? false : formattingOptions.gpt5StyleLineNumbers,
                  gpt5CodexCatN: useSparseReadLineNumbers ? false : formattingOptions.gpt5CodexCatN,
                  enableLineNumbers: shouldIncludeLineNumbers,
                  sparseLineNumbers: useSparseReadLineNumbers ? READ_LINE_NUMBER_INTERVAL : formattingOptions.sparseLineNumbers
                }
              }, {
                addAmountOfOmittedLines: result.value.readRange !== void 0 && (result.value.readRange.startLine > 1 || result.value.readRange.endLine < totalLines)
              });
              const cursorRuleReminder = renderCursorRuleReminder(getRelatedCursorRules(result.value));
              const skillReminder = renderSkillReminder(getRelatedSkills(result.value));
              let finalContent = formattedContent;
              if (cursorRuleReminder) {
                finalContent = `${finalContent}

${cursorRuleReminder}`;
              }
              if (skillReminder) {
                finalContent = `${finalContent}

${skillReminder}`;
              }
              return createStringResult(finalContent);
            }
            case "data": {
              return renderImageBinary(output.value, result.value.path);
            }
            case "dataBlobId": {
              const blobId = output.value;
              const { path: path31 } = result.value;
              const blobIdHex = toHex3(blobId);
              const blobData = hydratedBlobs.get(blobIdHex);
              if (!blobData) {
                throw new Error(`Image blob not hydrated for render: ${blobIdHex} (path: ${path31})`);
              }
              return renderImageBinary(blobData, path31);
            }
            case void 0:
              return createStringResult("Unknown error: no output case", true);
            default: {
              const _exhaustiveOutputCheck = output;
              throw new Error(`Unhandled output case: ${_exhaustiveOutputCheck}`);
            }
          }
        }
      case "error":
        return createStringResult(`Error: ${result.value.errorMessage}`, true);
      case void 0:
        return createStringResult("Unknown error", true);
      default: {
        const _exhaustiveCheck = result;
        throw new Error(`Unhandled result case: ${_exhaustiveCheck}`);
      }
    }
  };
  function getToolName5(version3) {
    switch (version3) {
      case "dsv3-1018":
        return "read_file";
      case "gpt5-codex":
      case "codex-cloud":
        return "ReadFile";
      case "cursor-0226":
      case "dsv3-1205":
      case "latest":
      case "haiku":
        return "Read";
      default: {
        const _exhaustive = version3;
        throw new Error(`Unhandled version: ${_exhaustive}`);
      }
    }
  }
  function getOffsetLimitUsageLines({ useExplicitOffsetLimitDescription: useExplicit }) {
    if (useExplicit) {
      return `- ${EXPLICIT_OFFSET_OMIT_BULLET}
- ${EXPLICIT_OFFSET_PROVIDE_BULLET}`;
    }
    return "- You can optionally specify a line offset and limit (especially handy for long files), but it's recommended to read the whole file by not providing these parameters.";
  }
  function getDescription4({ version: version3, includeLineNumbersInDescription, useMinimalHarnessDescription, useSparseReadLineNumbersDescription, useExplicitOffsetLimitDescription: useExplicitOffsetLimit }) {
    if (useMinimalHarnessDescription) {
      return "View an image on the local filesystem. This tool can only view IMAGE files. For normal file reads use the Shell tool.";
    }
    const lineNumbersLine = "- Lines in the output are numbered starting at 1, using following format: LINE_NUMBER|LINE_CONTENT";
    const shouldDescribeLineNumbers = includeLineNumbersInDescription && !useSparseReadLineNumbersDescription;
    const offsetLimitUsageLines = getOffsetLimitUsageLines({
      useExplicitOffsetLimitDescription: useExplicitOffsetLimit
    });
    switch (version3) {
      case "cursor-0226":
        return "Reads a file from the local filesystem. This tool can also read image files when called with the appropriate path. Formats supported: jpeg/jpg, png, gif, webp.";
      case "dsv3-1018":
        return `
Reads a file from the local filesystem. You can access any file directly by using this tool.
If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.

Usage:
${offsetLimitUsageLines}
${shouldDescribeLineNumbers ? `${lineNumbersLine}.
` : ""}- You have the capability to call multiple tools in a single response. It is always better to speculatively read multiple files as a batch that are potentially useful.
- If you read a file that exists but has empty contents you will receive 'File is empty.'.`;
      case "dsv3-1205":
        return `Reads a file from the local filesystem. You can access any file directly by using this tool.
If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.

Usage:
${offsetLimitUsageLines}
${shouldDescribeLineNumbers ? `${lineNumbersLine}
` : ""}- You have the capability to call multiple tools in a single response. It is always better to speculatively read multiple files as a batch that are potentially useful.
- If you read a file that exists but has empty contents you will receive 'File is empty.'

Image Support:
- This tool can also read image files when called with the appropriate path.
- Supported image formats: jpeg/jpg, png, gif, webp.`;
      case "gpt5-codex":
      case "codex-cloud":
      case "latest":
        return `Reads a file from the local filesystem. You can access any file directly by using this tool.
If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.

Usage:
${offsetLimitUsageLines}
${shouldDescribeLineNumbers ? `${lineNumbersLine}
` : ""}- You have the capability to call multiple tools in a single response. It is always better to speculatively read multiple files as a batch that are potentially useful.
- If you read a file that exists but has empty contents you will receive 'File is empty.'

Image Support:
- This tool can also read image files when called with the appropriate path.
- Supported image formats: jpeg/jpg, png, gif, webp.

PDF Support:
- PDF files are converted into text content automatically (subject to the same character limits as other files).`;
      case "haiku":
        return `Reads a file from the local filesystem. You can access any file directly by using this tool.
If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.

Usage:
- For partial file reads, use the line_range parameter with [start_line, end_line] format (1-indexed, inclusive). Example: [100, 150] reads lines 100 through 150.
- It's recommended to read the whole file by not providing line_range, unless the file is too large.
${shouldDescribeLineNumbers ? `${lineNumbersLine}
` : ""}- You have the capability to call multiple tools in a single response. It is always better to speculatively read multiple files as a batch that are potentially useful.
- If you read a file that exists but has empty contents you will receive 'File is empty.'

Image Support:
- This tool can also read image files when called with the appropriate path.
- Supported image formats: jpeg/jpg, png, gif, webp.

PDF Support:
- PDF files are converted into text content automatically (subject to the same character limits as other files).`;
      default: {
        const _exhaustive = version3;
        throw new Error(`Unhandled version: ${_exhaustive}`);
      }
    }
  }
  const name17 = useMinimalHarness ? "ViewImage" : getToolName5(promptVersion);
  const description10 = options2?.toolDescription ?? getDescription4({
    version: promptVersion,
    includeLineNumbersInDescription: !enableLineNumbersArg,
    useMinimalHarnessDescription: useMinimalHarness,
    useSparseReadLineNumbersDescription: useSparseReadLineNumbers,
    useExplicitOffsetLimitDescription
  });
  const baseParametersSchema3 = useMinimalHarness ? external_exports.object({
    path: external_exports.string().describe("The absolute path of the image to view.")
  }) : getParametersSchema({
    version: promptVersion,
    includeEnableLineNumbers: enableLineNumbersArg,
    includeNegativeOffset: enableNegativeOffset,
    useSparseReadLineNumbers
  });
  const parametersSchema29 = extendMachineIdParameter(baseParametersSchema3, options2?.machineIds, options2?.machineIdParameterSchema);
  return createZodAgentTool("READ", {
    name: name17,
    descriptionGenerator: (_props) => description10,
    parameters: parametersSchema29,
    execute: withSafeParsedArgs(parametersSchema29, execute, createReadToolCall(new ReadToolCall())),
    render: render2,
    serializeError: (error41) => {
      const errorMessage6 = error41 instanceof Error ? error41.message : String(error41);
      return createReadToolCall(new ReadToolCall({
        result: new ReadToolResult({
          result: {
            case: "error",
            value: new ReadToolError({
              errorMessage: errorMessage6
            })
          }
        })
      }));
    }
  });
};
