var __addDisposableResource17 = function(env, value, async) {
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
var __disposeResources17 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var PDF_EXTENSION = ".pdf";
var STREAMING_READ_CHUNK_BYTES = 64 * 1024;
var MAX_FILE_ENCODINGS2 = 100;
var logger19 = createLogger("LocalReadExecutor");
var watchdog = async (ctx, msg, ms2, f2) => {
  const timeout2 = setTimeout(() => {
    logger19.warn(ctx, `[watchdog, LocalReadExecutor] ${msg} still not completed after ${ms2}ms`);
  }, ms2);
  try {
    return await f2();
  } finally {
    clearTimeout(timeout2);
  }
};
function isPdfFilePath(filePath) {
  return (0, import_node_path35.extname)(filePath).toLowerCase() === PDF_EXTENSION;
}
function findTerminalFrontmatterEnd(buf) {
  if (buf.length < 5 || buf[0] !== 45 || buf[1] !== 45 || buf[2] !== 45 || buf[3] !== 10) {
    return 0;
  }
  const closingDelimiter = Buffer.from("\n---\n");
  const idx = buf.indexOf(closingDelimiter, 4);
  if (idx === -1) {
    return 0;
  }
  return idx + closingDelimiter.length;
}
var TERMINAL_DETECT_MIN_PAIRED_MATCHES = 8;
function isPrintableAsciiOrCommonWhitespace(byte) {
  return byte >= 32 && byte <= 126 || byte === 9 || byte === 10 || byte === 13;
}
function detectTerminalBodyEncoding(body) {
  if (body.length >= 2) {
    if (body[0] === 255 && body[1] === 254)
      return "utf-16le";
    if (body[0] === 254 && body[1] === 255)
      return "utf-16be";
  }
  const sampleLen = Math.min(4096, body.length);
  if (sampleLen < 16)
    return "utf-8";
  let utf16leMatches = 0;
  let utf16beMatches = 0;
  for (let i = 0; i + 1 < sampleLen; i += 2) {
    const lo2 = body[i];
    const hi2 = body[i + 1];
    if (hi2 === 0 && isPrintableAsciiOrCommonWhitespace(lo2)) {
      utf16leMatches++;
    }
    if (lo2 === 0 && isPrintableAsciiOrCommonWhitespace(hi2)) {
      utf16beMatches++;
    }
  }
  if (utf16leMatches >= TERMINAL_DETECT_MIN_PAIRED_MATCHES && utf16leMatches >= 4 * Math.max(1, utf16beMatches)) {
    return "utf-16le";
  }
  if (utf16beMatches >= TERMINAL_DETECT_MIN_PAIRED_MATCHES && utf16beMatches >= 4 * Math.max(1, utf16leMatches)) {
    return "utf-16be";
  }
  return "utf-8";
}
var TERMINAL_BLOCK_DELIMITER = Buffer.from("\n---\n");
var TERMINAL_FOOTER_MAX_BYTES = 4096;
function isValidTerminalFooterBody(text2) {
  for (let i = 0; i < text2.length; i++) {
    const c = text2.charCodeAt(i);
    if (c !== 10 && (c < 32 || c > 126))
      return false;
  }
  const lines2 = text2.split("\n").filter((line) => line.length > 0);
  if (lines2.length < 2 || lines2.length > 3)
    return false;
  const first = lines2[0];
  const last = lines2[lines2.length - 1];
  if (!/^(exit_code: (?:-?\d+|unknown)|error: .+)$/.test(first))
    return false;
  if (!last.startsWith("ended_at: "))
    return false;
  if (lines2.length === 3 && !/^elapsed_ms: \d+$/.test(lines2[1]))
    return false;
  return true;
}
function findTerminalFooterStart(buf, minStart) {
  const len = buf.length;
  if (len < TERMINAL_BLOCK_DELIMITER.length * 2)
    return len;
  if (buf[len - 1] !== 10 || buf[len - 2] !== 45 || buf[len - 3] !== 45 || buf[len - 4] !== 45 || buf[len - 5] !== 10) {
    return len;
  }
  const scanFloor = Math.max(minStart, len - TERMINAL_FOOTER_MAX_BYTES);
  const openingPos = buf.lastIndexOf(TERMINAL_BLOCK_DELIMITER, len - TERMINAL_BLOCK_DELIMITER.length - 1);
  if (openingPos === -1 || openingPos < scanFloor)
    return len;
  const footerBodyText = buf.subarray(openingPos + TERMINAL_BLOCK_DELIMITER.length, len - "---\n".length).toString("utf-8");
  if (!isValidTerminalFooterBody(footerBodyText))
    return len;
  return openingPos;
}
function decodeTerminalFile(rawBuf) {
  const frontmatterEnd = findTerminalFrontmatterEnd(rawBuf);
  const frontmatter = frontmatterEnd > 0 ? rawBuf.subarray(0, frontmatterEnd).toString("utf-8") : "";
  const footerStart = findTerminalFooterStart(rawBuf, frontmatterEnd);
  const footer = footerStart < rawBuf.length ? rawBuf.subarray(footerStart).toString("utf-8") : "";
  const body = rawBuf.subarray(frontmatterEnd, footerStart);
  const bodyEncoding = detectTerminalBodyEncoding(body);
  let bodyText;
  if (bodyEncoding === "utf-16le") {
    bodyText = body.toString("utf16le");
  } else if (bodyEncoding === "utf-16be") {
    const evenLen = body.length - body.length % 2;
    const swapped = Buffer.from(body.subarray(0, evenLen));
    swapped.swap16();
    bodyText = swapped.toString("utf16le");
  } else {
    bodyText = body.toString("utf-8");
  }
  if (bodyText.charCodeAt(0) === 65279) {
    bodyText = bodyText.slice(1);
  }
  return frontmatter + bodyText + footer;
}
var KNOWN_BINARY_MAGIC_PREFIXES = [
  // ── Documents ──
  Buffer.from("%PDF-", "ascii"),
  // PDF
  Buffer.from([208, 207, 17, 224, 161, 177, 26, 225]),
  // OLE2 / Compound File Binary (.msi, legacy .doc/.xls/.ppt, .msg)
  // ── ZIP family (DOCX/XLSX/PPTX/JAR/EPUB/APK/IPA all start with these) ──
  Buffer.from([80, 75, 3, 4]),
  // ZIP local file header
  Buffer.from([80, 75, 5, 6]),
  // ZIP empty archive end-of-central-dir
  Buffer.from([80, 75, 7, 8]),
  // ZIP spanned / data descriptor
  // ── Executables ──
  Buffer.from([127, 69, 76, 70]),
  // ELF (Linux/BSD .so/.elf executables)
  Buffer.from([254, 237, 250, 206]),
  // Mach-O 32-bit BE
  Buffer.from([254, 237, 250, 207]),
  // Mach-O 64-bit BE
  Buffer.from([206, 250, 237, 254]),
  // Mach-O 32-bit LE
  Buffer.from([207, 250, 237, 254]),
  // Mach-O 64-bit LE
  Buffer.from([77, 90, 144]),
  // Windows PE / DOS MZ (.exe / .dll). 3-byte
  // prefix avoids text false positives on the ASCII bigram "MZ" — every
  // Microsoft-toolchain PE has e_cblp = 0x0090 in the third byte.
  Buffer.from([0, 97, 115, 109]),
  // WASM module ("\0asm")
  // ── Images (rejected for agent-tools .txt — real images are read via the
  //    image branch on the slow path; here they only appear if a download
  //    landed an image at a .txt suffix) ──
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  // PNG (8-byte signature)
  Buffer.from([255, 216, 255]),
  // JPEG
  Buffer.from("GIF87a", "ascii"),
  // GIF87a
  Buffer.from("GIF89a", "ascii"),
  // GIF89a
  // ── Databases ──
  Buffer.from("SQLite format 3\0", "ascii"),
  // SQLite 3 database
  // ── Compression / archives ──
  Buffer.from([31, 139]),
  // gzip
  Buffer.from("BZh", "ascii"),
  // bzip2 (always followed by '1'-'9' block size)
  Buffer.from([253, 55, 122, 88, 90, 0]),
  // xz
  Buffer.from([40, 181, 47, 253]),
  // zstd (Zstandard frame magic)
  Buffer.from([55, 122, 188, 175, 39, 28]),
  // 7z
  Buffer.from([82, 97, 114, 33, 26, 7, 0]),
  // RAR (v1.50 - v4.x)
  Buffer.from([82, 97, 114, 33, 26, 7, 1, 0])
  // RAR5 (v5.0+)
];
function bufferStartsWith(buf, prefix) {
  return buf.length >= prefix.length && buf.subarray(0, prefix.length).equals(prefix);
}
function looksLikeKnownBinaryFormat(buf) {
  return KNOWN_BINARY_MAGIC_PREFIXES.some((prefix) => bufferStartsWith(buf, prefix));
}
function buildBinaryFileRejection(resolvedPath) {
  const fileExtension = (0, import_node_path35.extname)(resolvedPath).toLowerCase();
  const reason = fileExtension === "" ? "Binary files without an extension are not supported by the read executor" : `Binary files of type ${fileExtension} are not supported by the read executor`;
  return new ReadResult({
    result: {
      case: "invalidFile",
      value: new ReadInvalidFile({
        path: resolvedPath,
        reason
      })
    }
  });
}
function tryApplyRequestedReadRange(content, totalLines, args) {
  if (args.offset === void 0 && args.limit === void 0) {
    return { content, rangeApplied: false };
  }
  if (content === "") {
    return { content, rangeApplied: false };
  }
  const effectiveOffset = args.offset ?? 1;
  const effectiveLimit = args.limit ?? (effectiveOffset < 0 ? Math.abs(effectiveOffset) : totalLines);
  const startIndex = effectiveOffset < 0 ? Math.max(0, totalLines + effectiveOffset) : Math.max(0, effectiveOffset - 1);
  if (startIndex >= totalLines) {
    return { content, rangeApplied: false };
  }
  const endIndex = Math.min(totalLines, startIndex + effectiveLimit);
  const lines2 = content.split("\n");
  const rangedContent = lines2.slice(startIndex, endIndex).join("\n");
  return { content: rangedContent, rangeApplied: true };
}
function appendBounded(current, addition, maxChars = MAX_TEXT_SIZE) {
  if (addition.length === 0) {
    return current;
  }
  const remaining = maxChars - current.text.length;
  if (remaining <= 0) {
    return { text: current.text, truncated: true };
  }
  if (addition.length > remaining) {
    return {
      text: current.text + addition.slice(0, remaining),
      truncated: true
    };
  }
  return { text: current.text + addition, truncated: current.truncated };
}
function appendToCappedLine(line, addition) {
  const appended = appendBounded(line, addition);
  return { text: appended.text, truncated: appended.truncated };
}
function normalizeRetainedCrlfLine(retainedLine, shouldNormalize) {
  const { line, hasNewline } = retainedLine;
  if (!shouldNormalize || !hasNewline || !line.text.endsWith("\r")) {
    return line;
  }
  return {
    ...line,
    text: line.text.slice(0, -1)
  };
}
function appendRetainedLines(current, retainedLines, shouldNormalizeCrlf) {
  let result = current;
  retainedLines.forEach((retainedLine, index) => {
    const outputLine = normalizeRetainedCrlfLine(retainedLine, shouldNormalizeCrlf);
    if (index > 0) {
      result = appendBounded(result, "\n");
    }
    result = appendBounded(result, outputLine.text);
    if (outputLine.truncated) {
      result = {
        text: result.text,
        truncated: true
      };
    }
  });
  return result;
}
function setCachedFileEncoding(path30, encoding) {
  if (_FILE_TO_ENCODING.has(path30)) {
    _FILE_TO_ENCODING.delete(path30);
  }
  _FILE_TO_ENCODING.set(path30, encoding);
  if (_FILE_TO_ENCODING.size <= MAX_FILE_ENCODINGS2) {
    return;
  }
  const oldestKey = _FILE_TO_ENCODING.keys().next().value;
  if (oldestKey !== void 0) {
    _FILE_TO_ENCODING.delete(oldestKey);
  }
}
function normalizeReadEncoding(encoding) {
  const normalized = encoding.toLowerCase();
  if (normalized === "utf-8") {
    return "utf8";
  }
  if (normalized === "utf-8-bom" || normalized === "utf-8 bom") {
    return "utf8bom";
  }
  if (normalized === "latin-1") {
    return "latin1";
  }
  return normalized;
}
function toIconvEncoding(encoding) {
  const normalized = normalizeReadEncoding(encoding);
  if (normalized === "utf8bom") {
    return "utf8";
  }
  return normalized;
}
var InvalidUtf8Error = class extends Error {
  constructor() {
    super("Invalid UTF-8 while streaming read");
    this.name = "InvalidUtf8Error";
  }
};
function getReadEncoding(file, format2, encodingHint) {
  return normalizeReadEncoding(encodingHint ?? _FILE_TO_ENCODING.get(file) ?? format2.encoding);
}
function getStreamingDecoderConfig(file, format2, encodingHint) {
  const requestedEncoding = getReadEncoding(file, format2, encodingHint);
  const iconvEncoding = toIconvEncoding(requestedEncoding);
  if (iconvEncoding === "utf8") {
    return {
      kind: "strictUtf8",
      cacheEncoding: "utf8"
    };
  }
  if (import_iconv_lite2.default.encodingExists(iconvEncoding)) {
    return {
      kind: "iconv",
      decoderEncoding: iconvEncoding,
      cacheEncoding: requestedEncoding
    };
  }
  return {
    kind: "strictUtf8",
    cacheEncoding: "utf8"
  };
}
async function* decodeFileChunks(ctx, file, decoderConfig) {
  if (decoderConfig.kind === "strictUtf8") {
    const decoder2 = new import_node_util8.TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
    const stream3 = (0, import_node_fs16.createReadStream)(file, {
      highWaterMark: STREAMING_READ_CHUNK_BYTES,
      signal: ctx.signal
    });
    try {
      for await (const chunk of stream3) {
        const text2 = decoder2.decode(chunk, { stream: true });
        if (text2.length > 0) {
          yield text2;
        }
      }
      const finalText = decoder2.decode();
      if (finalText.length > 0) {
        yield finalText;
      }
    } catch (error3) {
      if (error3 instanceof TypeError) {
        throw new InvalidUtf8Error();
      }
      throw error3;
    }
    return;
  }
  const decoded = (0, import_node_fs16.createReadStream)(file, {
    highWaterMark: STREAMING_READ_CHUNK_BYTES,
    signal: ctx.signal
  }).pipe(import_iconv_lite2.default.decodeStream(decoderConfig.decoderEncoding));
  for await (const chunk of decoded) {
    yield typeof chunk === "string" ? chunk : String(chunk);
  }
}
async function readTextStreaming(ctx, file, format2, args) {
  const decoderConfig = getStreamingDecoderConfig(file, format2, args.encodingHint);
  try {
    return await readTextStreamingWithDecoder(ctx, file, args, decoderConfig);
  } catch (error3) {
    if (error3 instanceof InvalidUtf8Error) {
      return await readTextStreamingWithDecoder(ctx, file, args, {
        kind: "iconv",
        decoderEncoding: "latin1",
        cacheEncoding: "latin1"
      });
    }
    throw error3;
  }
}
async function readTextStreamingWithDecoder(ctx, file, args, decoderConfig) {
  const hasRange = args.offset !== void 0 || args.limit !== void 0;
  const isNegativeOffset = (args.offset ?? 1) < 0;
  const effectiveOffset = args.offset ?? 1;
  const positiveStartIndex = Math.max(0, effectiveOffset - 1);
  const positiveEndIndex = args.limit === void 0 ? void 0 : positiveStartIndex + args.limit;
  const tailLineCapacity = isNegativeOffset ? Math.abs(effectiveOffset) : 0;
  const fallbackLines = [];
  let fallbackBytes = 0;
  let fallbackTruncated = false;
  const selectedLines = [];
  let selectedBytes = 0;
  let selectedTruncated = false;
  const tailLines = [];
  let tailBytes = 0;
  let tailTruncated = false;
  let pendingLine = { text: "", truncated: false };
  let totalLines = 0;
  let crlfCount = 0;
  let lfOnlyCount = 0;
  let strippedLeadingBom = false;
  let hadLeadingBom = false;
  const normalizeChunk = (rawChunk) => {
    let chunk = rawChunk;
    if (!strippedLeadingBom && chunk.length > 0) {
      strippedLeadingBom = true;
      if (chunk.charCodeAt(0) === 65279) {
        hadLeadingBom = true;
        chunk = chunk.slice(1);
      }
    }
    return chunk;
  };
  const appendSelectedLine = (line, hasNewline) => {
    if (selectedTruncated && selectedBytes >= MAX_TEXT_SIZE) {
      return;
    }
    const separatorBytes = selectedLines.length > 0 ? 1 : 0;
    let remainingBytes = MAX_TEXT_SIZE - selectedBytes;
    if (separatorBytes > 0) {
      if (remainingBytes <= 0) {
        selectedTruncated = true;
        return;
      }
      remainingBytes--;
    }
    const retainedLine = line.text.length > remainingBytes ? {
      line: {
        text: line.text.slice(0, remainingBytes),
        truncated: true
      },
      hasNewline
    } : { line, hasNewline };
    selectedLines.push(retainedLine);
    selectedBytes += separatorBytes + retainedLine.line.text.length;
    if (line.truncated) {
      selectedTruncated = true;
    }
    if (retainedLine.line.truncated) {
      selectedTruncated = true;
    }
  };
  const appendFallbackLine = (line, hasNewline) => {
    if (fallbackTruncated && fallbackBytes >= MAX_TEXT_SIZE) {
      return;
    }
    const separatorChars = fallbackLines.length > 0 ? 1 : 0;
    let remainingChars = MAX_TEXT_SIZE - fallbackBytes;
    if (separatorChars > 0) {
      if (remainingChars <= 0) {
        fallbackTruncated = true;
        return;
      }
      remainingChars--;
    }
    const retainedLine = line.text.length > remainingChars ? {
      line: {
        text: line.text.slice(0, remainingChars),
        truncated: true
      },
      hasNewline
    } : { line, hasNewline };
    fallbackLines.push(retainedLine);
    fallbackBytes += separatorChars + retainedLine.line.text.length;
    if (line.truncated || retainedLine.line.truncated) {
      fallbackTruncated = true;
    }
  };
  const finishLine = (line, hasNewline) => {
    const lineIndex = totalLines;
    if (hasNewline) {
      if (line.text.endsWith("\r")) {
        crlfCount++;
      } else {
        lfOnlyCount++;
      }
    }
    appendFallbackLine(line, hasNewline);
    if (!isNegativeOffset) {
      const inRequestedRange = hasRange && lineIndex >= positiveStartIndex && (positiveEndIndex === void 0 || lineIndex < positiveEndIndex);
      if (inRequestedRange) {
        appendSelectedLine(line, hasNewline);
      }
    } else if (tailLineCapacity > 0) {
      tailLines.push({ line, hasNewline });
      tailBytes += line.text.length + 1;
      while (tailLines.length > tailLineCapacity) {
        const dropped = tailLines.shift();
        if (dropped !== void 0) {
          tailBytes -= dropped.line.text.length + 1;
        }
      }
      while (tailLines.length > 1 && tailBytes > MAX_TEXT_SIZE) {
        const dropped = tailLines.shift();
        if (dropped !== void 0) {
          tailBytes -= dropped.line.text.length + 1;
          tailTruncated = true;
        }
      }
    }
    totalLines++;
  };
  for await (const rawChunk of decodeFileChunks(ctx, file, decoderConfig)) {
    const chunk = normalizeChunk(rawChunk);
    let start = 0;
    let at3 = chunk.indexOf("\n", start);
    while (at3 !== -1) {
      pendingLine = appendToCappedLine(pendingLine, chunk.slice(start, at3));
      finishLine(pendingLine, true);
      pendingLine = { text: "", truncated: false };
      start = at3 + 1;
      at3 = chunk.indexOf("\n", start);
    }
    if (start < chunk.length) {
      pendingLine = appendToCappedLine(pendingLine, chunk.slice(start));
    }
  }
  finishLine(pendingLine, false);
  const totalLineEndings = crlfCount + lfOnlyCount;
  const shouldNormalizeCrlf = totalLineEndings > 0 && crlfCount / totalLineEndings * 100 >= 5;
  const cacheEncoding = decoderConfig.cacheEncoding === "utf8" && hadLeadingBom ? "utf8bom" : decoderConfig.cacheEncoding;
  setCachedFileEncoding(file, cacheEncoding);
  let fallback2 = { text: "", truncated: fallbackTruncated };
  fallback2 = appendRetainedLines(fallback2, fallbackLines, shouldNormalizeCrlf);
  if (!hasRange) {
    return {
      content: fallback2.text,
      totalLines,
      truncated: fallback2.truncated,
      rangeApplied: false
    };
  }
  if (fallback2.text === "") {
    return {
      content: "",
      totalLines,
      truncated: false,
      rangeApplied: false
    };
  }
  if (isNegativeOffset) {
    const effectiveLimit = args.limit ?? tailLineCapacity;
    let negativeSelected = { text: "", truncated: tailTruncated };
    negativeSelected = appendRetainedLines(negativeSelected, tailLines.slice(0, effectiveLimit), shouldNormalizeCrlf);
    return {
      content: negativeSelected.text,
      totalLines,
      truncated: negativeSelected.truncated,
      rangeApplied: true
    };
  }
  if (positiveStartIndex >= totalLines) {
    return {
      content: fallback2.text,
      totalLines,
      truncated: fallback2.truncated,
      rangeApplied: false
    };
  }
  let selected = { text: "", truncated: selectedTruncated };
  selected = appendRetainedLines(selected, selectedLines, shouldNormalizeCrlf);
  return {
    content: selected.text,
    totalLines,
    truncated: selected.truncated,
    rangeApplied: true
  };
}
var LocalReadExecutor = class {
  constructor(permissionsService, workspacePath, _options) {
    this.permissionsService = permissionsService;
    this.workspacePath = workspacePath;
    this.mcpStateAccessor = _options?.mcpStateAccessor;
    this.useStreamingRead = _options?.useStreamingRead;
    this.pendingDecisionProvider = _options?.pendingDecisionProvider;
  }
  async execute(ctx, args) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource17(env_1, createSpan(ctx.withName("LocalReadExecutor.execute")), false);
      const filePath = args.path;
      const resolvedPath = resolvePath(filePath, this.workspacePath);
      const shouldBlock = await watchdog(ctx, "permissionsService.shouldBlockFileRead", 3e3, () => shouldBlockFileRead(this.permissionsService, resolvedPath));
      if (shouldBlock) {
        const resolution = await watchdog(ctx, "resolveFileReadBlock", 3e3, () => resolveFileReadBlock(shouldBlock, {
          pendingDecisionProvider: this.pendingDecisionProvider,
          toolCallId: args.toolCallId
        }));
        if (resolution.kind === "rejected") {
          return new ReadResult({
            result: {
              case: "rejected",
              value: new ReadRejected({
                path: resolvedPath,
                reason: resolution.reason ?? ""
              })
            }
          });
        }
        if (resolution.kind === "denied") {
          return new ReadResult({
            result: {
              case: "permissionDenied",
              value: new ReadPermissionDenied({ path: resolvedPath })
            }
          });
        }
      }
      if (this.mcpStateAccessor !== void 0) {
        scheduleDiskMcpDiscoveryFreshnessOnMcpsPathAccess(ctx, this.mcpStateAccessor, resolvedPath);
      }
      try {
        const stats = await watchdog(ctx, "stat", 3e3, () => (0, import_promises22.stat)(resolvedPath));
        if (stats.isDirectory()) {
          return new ReadResult({
            result: {
              case: "invalidFile",
              value: new ReadInvalidFile({
                path: resolvedPath,
                reason: "Path is a directory, not a file"
              })
            }
          });
        }
        if (!stats.isFile()) {
          return new ReadResult({
            result: {
              case: "invalidFile",
              value: new ReadInvalidFile({
                path: resolvedPath,
                reason: "Path is neither a file nor a directory"
              })
            }
          });
        }
        const isTerminalPath = isTerminalFilePath(resolvedPath);
        const isAgentToolPath = isAgentToolOutputFile(resolvedPath);
        if (isTerminalPath || isAgentToolPath) {
          return await this.readTerminalFile(ctx, resolvedPath, stats, args, isAgentToolPath && !isTerminalPath);
        }
        const contentInfo = await watchdog(ctx, "getFormatForFile", 3e3, () => getFormatForFile(resolvedPath));
        const isImage = contentInfo.isImageFile;
        const isPdf = isPdfFilePath(resolvedPath);
        const isVideo = isVideoFilePath(resolvedPath);
        if (isImage) {
          const resizedImage = await watchdog(ctx, "resizeImageIfNeeded", 3e3, async () => {
            const imageData = await (0, import_promises22.readFile)(resolvedPath);
            return resizeImageBufferIfNeeded(imageData);
          });
          return new ReadResult({
            result: {
              case: "success",
              value: new ReadSuccess({
                path: resolvedPath,
                output: {
                  case: "data",
                  value: resizedImage.data
                },
                totalLines: 0,
                fileSize: BigInt(stats.size),
                truncated: false
              })
            }
          });
        } else if (isPdf) {
          const pdfData = await watchdog(ctx, "readPdfBinary", 3e3, () => (0, import_promises22.readFile)(resolvedPath));
          return new ReadResult({
            result: {
              case: "success",
              value: new ReadSuccess({
                path: resolvedPath,
                output: {
                  case: "data",
                  value: pdfData
                },
                totalLines: 0,
                fileSize: BigInt(stats.size),
                truncated: false
              })
            }
          });
        } else if (contentInfo.isBinaryFile && isVideo) {
          const binaryData = await watchdog(ctx, "readBinaryFile", 3e3, () => (0, import_promises22.readFile)(resolvedPath));
          return new ReadResult({
            result: {
              case: "success",
              value: new ReadSuccess({
                path: resolvedPath,
                output: {
                  case: "data",
                  value: binaryData
                },
                totalLines: 0,
                fileSize: BigInt(stats.size),
                truncated: false
              })
            }
          });
        } else if (contentInfo.isBinaryFile) {
          return buildBinaryFileRejection(resolvedPath);
        } else {
          const useStreamingRead = this.useStreamingRead;
          const streamingReadEnabled = useStreamingRead ? await watchdog(ctx, "useStreamingRead", 3e3, () => useStreamingRead()) : true;
          if (streamingReadEnabled) {
            const streamedRead = await watchdog(ctx, "readTextStreaming", 7e3, () => readTextStreaming(ctx, resolvedPath, contentInfo, args));
            return new ReadResult({
              result: {
                case: "success",
                value: new ReadSuccess({
                  path: resolvedPath,
                  output: {
                    case: "content",
                    value: streamedRead.content
                  },
                  totalLines: streamedRead.totalLines,
                  fileSize: BigInt(stats.size),
                  truncated: streamedRead.truncated,
                  rangeApplied: streamedRead.rangeApplied
                })
              }
            });
          }
          const fullContent = await watchdog(ctx, "readText", 3e3, () => readText(resolvedPath, args.encodingHint));
          const totalLines = await watchdog(ctx, "countLines", 3e3, () => countLines(fullContent));
          const rangedRead = tryApplyRequestedReadRange(fullContent, totalLines, args);
          let content = rangedRead.content;
          let truncated = false;
          if (content.length > MAX_TEXT_SIZE) {
            content = content.substring(0, MAX_TEXT_SIZE);
            truncated = true;
          }
          return new ReadResult({
            result: {
              case: "success",
              value: new ReadSuccess({
                path: resolvedPath,
                output: {
                  case: "content",
                  value: content
                },
                totalLines,
                fileSize: BigInt(stats.size),
                truncated,
                rangeApplied: rangedRead.rangeApplied
              })
            }
          });
        }
      } catch (error3) {
        const err = error3;
        if (err.code === "ENOENT") {
          return new ReadResult({
            result: {
              case: "fileNotFound",
              value: new ReadFileNotFound({ path: resolvedPath })
            }
          });
        }
        if (err.code === "EACCES" || err.code === "EPERM") {
          return new ReadResult({
            result: {
              case: "permissionDenied",
              value: new ReadPermissionDenied({ path: resolvedPath })
            }
          });
        }
        return new ReadResult({
          result: {
            case: "error",
            value: new ReadError({
              path: resolvedPath,
              error: err instanceof Error ? err.message : "Unknown error occurred"
            })
          }
        });
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources17(env_1);
    }
  }
  async readTerminalFile(ctx, resolvedPath, stats, args, checkForBinaryMagicBytes) {
    const rawBuf = await watchdog(ctx, "readTerminalFile", 3e3, () => (0, import_promises22.readFile)(resolvedPath));
    if (checkForBinaryMagicBytes && looksLikeKnownBinaryFormat(rawBuf)) {
      return buildBinaryFileRejection(resolvedPath);
    }
    let content = decodeTerminalFile(rawBuf).replaceAll("\r\n", "\n");
    const totalLines = countLines(content);
    const rangedRead = tryApplyRequestedReadRange(content, totalLines, args);
    content = rangedRead.content;
    let truncated = false;
    if (content.length > MAX_TEXT_SIZE) {
      content = content.substring(0, MAX_TEXT_SIZE);
      truncated = true;
    }
    return new ReadResult({
      result: {
        case: "success",
        value: new ReadSuccess({
          path: resolvedPath,
          output: {
            case: "content",
            value: content
          },
          totalLines,
          fileSize: BigInt(stats.size),
          truncated,
          rangeApplied: rangedRead.rangeApplied
        })
      }
    });
  }
};
