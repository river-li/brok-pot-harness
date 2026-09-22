/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/mcp/mcp-output-spill.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_mcp_exec_pb();
function normalizeProjectDir(projectDir) {
  return projectDir === void 0 || projectDir.length === 0 ? void 0 : projectDir;
}
async function spillLargeMcpTextOutput({ ctx, result, resourceAccessor, projectDir: projectDirArg, osPlatform, toolCallId }) {
  if (result.result.case !== "success") {
    return result;
  }
  const projectDir = normalizeProjectDir(projectDirArg);
  let spillAttempted = false;
  let failureReason = "write_failed";
  const content = await materializeMcpTextOutput({
    contentItems: result.result.value.content,
    thresholdBytes: MCP_TEXT_FILE_THRESHOLD_BYTES,
    write: async (aggregateText) => {
      spillAttempted = true;
      if (projectDir === void 0) {
        failureReason = "no_project_dir";
        return void 0;
      }
      try {
        return await writeToAgentToolsFile(ctx, resourceAccessor.get(writeExecutorResource), {
          content: aggregateText,
          projectDir,
          osPlatform,
          toolCallId
        });
      } catch {
        return void 0;
      }
    }
  });
  if (!spillAttempted) {
    return result;
  }
  if (content !== void 0) {
    emitMcpOutputSpillOutcome(ctx, "spilled");
    const spilledResult = result.clone();
    if (spilledResult.result.case === "success") {
      spilledResult.result.value.content = content;
    }
    return spilledResult;
  }
  emitMcpOutputSpillOutcome(ctx, failureReason);
  const truncatedResult = result.clone();
  if (truncatedResult.result.case === "success") {
    truncatedResult.result.value.content = buildTruncatedInlineContent(truncatedResult.result.value.content);
  }
  return truncatedResult;
}
function buildTruncatedInlineContent(contentItems) {
  const aggregateText = contentItems.filter((item) => item.content.case === "text" && item.content.value.outputLocation === void 0).map((item) => item.content.case === "text" ? item.content.value.text : "").join("\n\n");
  const materializedItems = [];
  let emittedTruncatedItem = false;
  for (const item of contentItems) {
    const isInlineText = item.content.case === "text" && item.content.value.outputLocation === void 0;
    if (!isInlineText) {
      materializedItems.push(item);
      continue;
    }
    if (!emittedTruncatedItem) {
      materializedItems.push(new McpToolResultContentItem({
        content: {
          case: "text",
          value: new McpTextContent({
            text: buildTruncatedTextWithNotice(aggregateText)
          })
        }
      }));
      emittedTruncatedItem = true;
    }
  }
  return materializedItems;
}
function buildTruncatedTextWithNotice(text2) {
  const totalBytes = Buffer.byteLength(text2, "utf8");
  const truncatedText = truncateUtf82(text2, MCP_TEXT_FILE_THRESHOLD_BYTES);
  const notice = `

[Output truncated: the full MCP tool output was ${totalBytes} bytes, which exceeds the inline limit of ${MCP_TEXT_FILE_THRESHOLD_BYTES} bytes, and could not be written to a file. The remainder was discarded; do not retry the same call expecting the full output.]`;
  return truncatedText + notice;
}
function truncateUtf82(text2, maxBytes) {
  const buffer = Buffer.from(text2, "utf8");
  if (buffer.byteLength <= maxBytes) {
    return text2;
  }
  const decoded = new TextDecoder("utf-8", { fatal: false }).decode(buffer.subarray(0, maxBytes));
  return decoded.endsWith("\uFFFD") ? decoded.slice(0, -1) : decoded;
}

