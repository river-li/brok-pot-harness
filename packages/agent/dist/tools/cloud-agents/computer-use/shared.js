/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/cloud-agents/computer-use/shared.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_agent_pb();
init_computer_use_tool_pb();
init_dist3();

// @recovered-fragment 2/2
var DEFAULT_SCREENSHOT_MIME_TYPE = "image/webp";
function isModelCanvasWebp(bytes) {
  const dimensions = readWebpDimensions(bytes);
  return dimensions !== void 0 && WEBP_PASSTHROUGH_DIMENSIONS.some((canvas) => canvas.width === dimensions.width && canvas.height === dimensions.height);
}
async function boundComputerUseScreenshot(ctx, result) {
  const value = result.result.case === "success" || result.result.case === "error" ? result.result.value : void 0;
  if (value === void 0 || !value.screenshot) {
    return result;
  }
  const bytes = Buffer.from(value.screenshot, "base64");
  const mimeType = screenshotMimeTypeFromBase64(value.screenshot);
  if (mimeType === "image/webp" && !isModelCanvasWebp(bytes)) {
    return result;
  }
  const bounded = await boundInlineImageForModel(ctx, bytes, {
    mimeType,
    source: "cloud_agent_computer_use"
  });
  if (bounded.data.byteLength === bytes.byteLength) {
    return result;
  }
  value.screenshot = Buffer.from(bounded.data).toString("base64");
  return result;
}
function screenshotMimeTypeFromBase64(data) {
  const prefix = Buffer.from(data.slice(0, 24), "base64");
  if (prefix.length >= 8 && prefix[0] === 137 && prefix.subarray(1, 4).toString("ascii") === "PNG") {
    return "image/png";
  }
  if (prefix.length >= 12 && prefix.subarray(0, 4).toString("ascii") === "RIFF" && prefix.subarray(8, 12).toString("ascii") === "WEBP") {
    return "image/webp";
  }
  return DEFAULT_SCREENSHOT_MIME_TYPE;
}
var COMPUTER_USE_UNSUPPORTED_ON_VM_MESSAGE = "Computer use is not supported on this Cloud Agent VM because the computer-use executor is not enabled. Do NOT retry this tool call. If the user was directly requesting computer use, end your response immediately with an informative error description. Otherwise, continue testing via automated testing rather than manual testing.";
function createComputerUseUnsupportedOnVmError() {
  return new CustomToolCallError(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
    clientVisibleErrorMessage: COMPUTER_USE_UNSUPPORTED_ON_VM_MESSAGE,
    modelVisibleErrorMessage: COMPUTER_USE_UNSUPPORTED_ON_VM_MESSAGE,
    error: COMPUTER_USE_UNSUPPORTED_ON_VM_MESSAGE
  });
}
function createToolCallProto(computerUseTool) {
  return new ToolCall({
    tool: {
      case: "computerUseToolCall",
      value: computerUseTool
    }
  });
}
function serializeComputerUseError(error42) {
  const errorMessage6 = error42 instanceof Error ? error42.message : String(error42);
  return createToolCallProto(new ComputerUseToolCall({
    result: new ComputerUseResult({
      result: {
        case: "error",
        value: new ComputerUseError({
          error: errorMessage6,
          actionCount: 0,
          durationMs: 0
        })
      }
    })
  }));
}
async function renderComputerUseResult(_ctx, output, includeCursorPosition = false, _props) {
  const content = [];
  const { result } = output;
  if (result.case === "success") {
    const { log: log4, screenshot, screenshotPath, cursorPosition } = result.value;
    if (log4) {
      content.push({ type: "text", text: log4 });
    }
    if (includeCursorPosition && cursorPosition) {
      content.push({
        type: "text",
        text: `Cursor position: (${cursorPosition.x}, ${cursorPosition.y})`
      });
    }
    if (screenshotPath) {
      content.push({
        type: "text",
        text: `Screenshot saved to ${screenshotPath}`
      });
    }
    if (screenshot) {
      content.push({
        type: "image",
        data: screenshot,
        mimeType: screenshotMimeTypeFromBase64(screenshot)
      });
    }
    return { content, isError: false };
  } else if (result.case === "error") {
    const { error: error42, log: log4 } = result.value;
    if (log4) {
      content.push({ type: "text", text: log4 });
    }
    content.push({ type: "text", text: `Error: ${error42}` });
    return { content, isError: true };
  }
  return createStringResult("Unknown error", true);
}

