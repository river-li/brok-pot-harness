/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/agent-tools-file.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto8 = require("node:crypto");
var import_node_path27 = __toESM(require("node:path"), 1);
init_utils_pb();
var __awaiter24 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var AGENT_TOOLS_DIR = "agent-tools";
var BIDI_APPEND_LIMIT_BYTES = 50 * 1024 * 1024;
var BIDI_APPEND_HEADROOM_BYTES = 1024 * 1024;
var MAX_OUTPUT_FILE_SIZE = BIDI_APPEND_LIMIT_BYTES - BIDI_APPEND_HEADROOM_BYTES;
var MCP_TEXT_FILE_THRESHOLD_BYTES = 4e4;
function materializeMcpTextOutput(_a20) {
  return __awaiter24(this, arguments, void 0, function* ({ contentItems, thresholdBytes, write: write2 }) {
    const inlineTextItems = contentItems.filter((item) => item.content.case === "text" && item.content.value.outputLocation === void 0);
    const aggregateText = inlineTextItems.map((item) => item.content.case === "text" ? item.content.value.text : "").join("\n\n");
    if (thresholdBytes <= 0 || Buffer.byteLength(aggregateText, "utf8") <= thresholdBytes) {
      return contentItems;
    }
    const outputLocation = yield write2(aggregateText);
    if (outputLocation === void 0) {
      return void 0;
    }
    const materializedItems = [];
    let emittedOutputLocation = false;
    for (const item of contentItems) {
      const isInlineText = item.content.case === "text" && item.content.value.outputLocation === void 0;
      if (!isInlineText) {
        materializedItems.push(item);
        continue;
      }
      if (!emittedOutputLocation) {
        materializedItems.push(new McpToolResultContentItem({
          content: {
            case: "text",
            value: new McpTextContent({ text: "", outputLocation })
          }
        }));
        emittedOutputLocation = true;
      }
    }
    return materializedItems;
  });
}
var AGENT_TOOLS_FILE_WRITE_THRESHOLD_BYTES = 2e4;
function truncateUtf8(text2, maxBytes) {
  const buffer = Buffer.from(text2, "utf8");
  if (buffer.byteLength <= maxBytes) {
    return text2;
  }
  const decoded = buffer.subarray(0, maxBytes).toString("utf8");
  return decoded.endsWith("\uFFFD") ? decoded.slice(0, -1) : decoded;
}
function writeToAgentToolsFile(ctx_1, writeExecutor_1, _a20) {
  return __awaiter24(this, arguments, void 0, function* (ctx, writeExecutor, { content, projectDir, osPlatform, toolCallId, maxSize }) {
    const maxBytes = Math.min(maxSize !== null && maxSize !== void 0 ? maxSize : MAX_OUTPUT_FILE_SIZE, MAX_OUTPUT_FILE_SIZE);
    const contentToWrite = truncateUtf8(content, maxBytes);
    const joinFn = osPlatform === "win32" ? import_node_path27.default.win32.join : import_node_path27.default.posix.join;
    const filePath = joinFn(projectDir, AGENT_TOOLS_DIR, `${(0, import_node_crypto8.randomUUID)()}.txt`);
    const lineCount = contentToWrite.split("\n").length;
    const sizeBytes = Buffer.byteLength(contentToWrite, "utf8");
    const result = yield writeExecutor.execute(ctx, new WriteArgs({
      path: filePath,
      fileText: contentToWrite,
      toolCallId
    }));
    switch (result.result.case) {
      case "success":
        return new OutputLocation({
          filePath: result.result.value.path,
          sizeBytes: BigInt(sizeBytes),
          lineCount: BigInt(lineCount)
        });
      case "permissionDenied":
      case "noSpace":
      case "error":
      case "rejected":
      case void 0:
        return void 0;
      default: {
        const _exhaustive = result.result;
        throw new Error(`Unhandled write result case: ${_exhaustive}`);
      }
    }
  });
}
function formatOutputLocationSize(sizeBytes) {
  const total = Number(sizeBytes);
  return total >= 1024 ? `${(total / 1024).toFixed(1)} KB` : `${total} bytes`;
}
function describeOutputLocation(loc, opts) {
  var _a20;
  const lead = (_a20 = opts === null || opts === void 0 ? void 0 : opts.leadText) !== null && _a20 !== void 0 ? _a20 : "Content";
  return `${lead} written to file: ${loc.filePath}
Size: ${formatOutputLocationSize(loc.sizeBytes)}, ${loc.lineCount} lines`;
}

