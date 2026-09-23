init_agent_pb();
init_mcp_exec_pb();
init_mcp_tool_pb();
init_unknown_record();
init_zod();
var PLAYWRIGHT_BROWSER_TOOL_NAMES = [
  "browser_close",
  "browser_resize",
  "browser_console_messages",
  "browser_handle_dialog",
  "browser_file_upload",
  "browser_drop",
  "browser_find",
  "browser_fill_form",
  "browser_press_key",
  "browser_type",
  "browser_navigate",
  "browser_navigate_back",
  "browser_take_screenshot",
  "browser_snapshot",
  "browser_click",
  "browser_drag",
  "browser_hover",
  "browser_select_option",
  "browser_tabs",
  "browser_wait_for"
];
var PLAYWRIGHT_NAVIGABLE_TOOLS = /* @__PURE__ */ new Set([
  "browser_navigate",
  "browser_navigate_back",
  "browser_click",
  "browser_type",
  "browser_press_key",
  "browser_tabs"
]);
var REVIEW_OPS = {
  browser_navigate: "navigate",
  browser_click: "click",
  browser_type: "type",
  browser_select_option: "select_option",
  browser_press_key: "press_key",
  browser_drag: "drag",
  browser_tabs: "tabs"
};
var DRIVER_ARG_NAMES = {
  target: "ref",
  startTarget: "sourceRef",
  endTarget: "targetRef",
  startElement: "element"
};
var PLAYWRIGHT_ROW_ARGS = external_exports.record(external_exports.unknown());
var PLAYWRIGHT_WAIT_FOR_MAX_SECONDS = 5;
var SCREENSHOT_ATTACHED_SENTENCE = "The image comes back attached to this result.";
function normalizeRowArgs(name17, args) {
  if (name17 === "browser_take_screenshot") {
    const { filename: _filename, ...withoutFilename } = args;
    return withoutFilename;
  }
  const { time: time4 } = args;
  const overCap = name17 === "browser_wait_for" && typeof time4 === "number" && time4 > PLAYWRIGHT_WAIT_FOR_MAX_SECONDS;
  return overCap ? { ...args, time: PLAYWRIGHT_WAIT_FOR_MAX_SECONDS } : args;
}
function reviewAction(name17, args, viewId) {
  const op = REVIEW_OPS[name17];
  if (op === void 0) return toBrowserReviewAction("cdp", { method: name17, params: args }, viewId);
  const driverArgs = Object.fromEntries(
    Object.entries(args).map(([key, value]) => [DRIVER_ARG_NAMES[key] ?? key, value])
  );
  return toBrowserReviewAction(op, driverArgs, viewId);
}
var REVIEW_ELEMENT_ARG = {
  browser_click: "element",
  browser_drag: "startElement"
};
function definition(row, server) {
  const inputSchema = JSON.parse(JSON.stringify(row.inputSchema));
  const reviewElement = REVIEW_ELEMENT_ARG[row.name];
  if (reviewElement !== void 0 && isUnknownRecord(inputSchema)) {
    const required2 = inputSchema.required;
    inputSchema.required = [...Array.isArray(required2) ? required2 : [], reviewElement];
  }
  if (row.name === "browser_wait_for" && isUnknownRecord(inputSchema) && isUnknownRecord(inputSchema.properties) && isUnknownRecord(inputSchema.properties.time)) {
    const time4 = inputSchema.properties.time;
    time4.maximum = PLAYWRIGHT_WAIT_FOR_MAX_SECONDS;
    time4.description = `${time4.description}. The harness caps it at ${PLAYWRIGHT_WAIT_FOR_MAX_SECONDS} seconds.`;
  }
  const screenshot = row.name === "browser_take_screenshot";
  if (screenshot && isUnknownRecord(inputSchema) && isUnknownRecord(inputSchema.properties)) {
    delete inputSchema.properties.filename;
  }
  return {
    name: `${server}-${row.name}`,
    toolName: row.name,
    providerIdentifier: server,
    clientKey: server,
    description: screenshot ? `${row.description} ${SCREENSHOT_ATTACHED_SENTENCE}` : row.description,
    inputSchema
  };
}
async function* once(text2) {
  yield text2;
}
var PAGE_URL_LINE = /^- Page URL: (\S+)$/m;
function successOf(result) {
  if (!(result instanceof McpToolResult) || result.result.case !== "success") return void 0;
  return result.result.value;
}
function textOf(success2) {
  return success2.content.flatMap((item) => item.content.case === "text" ? [item.content.value.text] : []).join("\n");
}
function pageUrlOf(result) {
  const success2 = successOf(result);
  return success2 === void 0 ? void 0 : PAGE_URL_LINE.exec(textOf(success2))?.[1];
}
function toolCallResultOf(result) {
  const success2 = successOf(result);
  if (success2 === void 0 || !success2.isError) return { kind: "ok" };
  return { kind: "tool_error", reason: playwrightToolErrorReason(textOf(success2)) };
}
var PLAYWRIGHT_SILENT_SUCCESS_TEXT = "Done. The page URL and title are unchanged.";
var SCREENSHOT_FILE_LINK = /^- \[(Screenshot of [^\]]*)\]\([^)]*\)$/m;
async function withInlineScreenshot(ctx, result) {
  const success2 = successOf(result);
  if (success2 === void 0 || success2.isError) return result;
  if (!success2.content.some((item) => item.content.case === "image")) return result;
  const attached = success2.clone();
  const link = attached.content.find((item) => item.content.case === "text");
  if (link?.content.case === "text") {
    link.content.value.text = link.content.value.text.replace(
      SCREENSHOT_FILE_LINK,
      "$1 is attached to this result."
    );
  }
  for (const item of attached.content) {
    if (item.content.case !== "image") continue;
    const bounded = await boundInlineImageForModel(ctx, item.content.value.data, {
      mimeType: item.content.value.mimeType,
      source: "sand_playwright_screenshot"
    });
    item.content.value.data = new Uint8Array(bounded.data);
    item.content.value.mimeType = bounded.mimeType;
  }
  return new McpToolResult({ result: { case: "success", value: attached } });
}
function withSilentSuccessText(result) {
  const success2 = successOf(result);
  if (success2 === void 0 || success2.isError) return result;
  if (success2.content.some(
    (item) => item.content.case !== "text" || item.content.value.outputLocation !== void 0 || item.content.value.text.trim() !== ""
  )) {
    return result;
  }
  const spoken = success2.clone();
  spoken.content = [
    new McpToolResultContentItem({
      content: {
        case: "text",
        value: new McpTextContent({ text: PLAYWRIGHT_SILENT_SUCCESS_TEXT })
      }
    })
  ];
  return new McpToolResult({ result: { case: "success", value: spoken } });
}
function rowTool(deps, row, lastPageUrl) {
  const toolFor = (server) => createMcpTool(deps.resourceAccessor, definition(row, server), { name: row.name });
  return {
    ...toolFor("unseated"),
    execute: withSafeParsedArgs(
      PLAYWRIGHT_ROW_ARGS,
      async (ctx, interactionHandler, rawArgs, meta) => {
        const args = normalizeRowArgs(row.name, rawArgs);
        const startedAt = performance.now();
        let stage = "window";
        const record2 = (result) => recordPlaywrightToolCall(ctx, {
          tool: row.name,
          harness: deps.harness ?? "unavailable",
          durationMs: performance.now() - startedAt,
          result
        });
        try {
          const windowIndex = await deps.getWindowIndex(ctx);
          if (windowIndex === void 0) throw new PlaywrightWindowUnavailableError();
          const server = playwrightBoxMcpServerName(windowIndex);
          if (deps.autoReview !== void 0 && row.annotations.readOnlyHint !== true) {
            stage = "review";
            const { resourceAccessor, resolveDisplayNumber, ...options2 } = deps.autoReview;
            await runSandBrowserAutoReviewPreflight({
              ctx,
              resourceAccessor,
              options: {
                ...options2,
                captureReviewState: async (stateCtx, stateToolCallId) => {
                  const state = await captureBrowserReviewState({
                    ctx: stateCtx,
                    resourceAccessor,
                    toolCallId: stateToolCallId,
                    resolveDisplayNumber
                  });
                  const targetPageUrl = lastPageUrl.get(windowIndex);
                  return targetPageUrl === void 0 ? state : { ...state, targetPageUrl };
                }
              },
              exactAction: reviewAction(row.name, args, server),
              toolCallId: meta.toolCallId,
              stateHandler: meta.stateHandler,
              workspacePaths: meta.workspacePaths,
              signal: interactionHandler.getAbortSignal(ctx)
            });
          }
          stage = "exec";
          const executed = await toolFor(server).execute(
            ctx,
            interactionHandler,
            once(JSON.stringify(args)),
            meta
          );
          const result = row.name === "browser_take_screenshot" ? await withInlineScreenshot(ctx, executed) : withSilentSuccessText(executed);
          const pageUrl = pageUrlOf(result);
          if (pageUrl !== void 0) lastPageUrl.set(windowIndex, pageUrl);
          record2(toolCallResultOf(result));
          if (PLAYWRIGHT_NAVIGABLE_TOOLS.has(row.name)) {
            deps.onPossibleNavigation?.(ctx);
          }
          return result;
        } catch (error42) {
          record2({ kind: "error", stage, errorClass: playwrightToolCallErrorClass(error42) });
          throw error42;
        }
      },
      new ToolCall({ tool: { case: "mcpToolCall", value: new McpToolCall() } }),
      { emitInitialPartialToolCall: false }
    )
  };
}
function createPlaywrightBrowserTools(deps) {
  const exposed = new Set(PLAYWRIGHT_BROWSER_TOOL_NAMES);
  const lastPageUrl = /* @__PURE__ */ new Map();
  return PLAYWRIGHT_MCP_TOOLS_LIST.filter((row) => exposed.has(row.name)).map(
    (row) => rowTool(deps, row, lastPageUrl)
  );
}
