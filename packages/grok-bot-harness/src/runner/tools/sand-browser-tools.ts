var BOX_CDP_PORT_BASE = 9222;
var browserOperationObservationKey = createKey(
  /* @__PURE__ */ Symbol("browserOperationObservation"),
  void 0
);
function encodeEnvelope2(envelope) {
  return JSON.stringify(envelope);
}
function objectFields(source) {
  return new Map(Object.entries(source));
}
function stringField(fields2, key) {
  const value = fields2.get(key);
  if (typeof value !== "string") return void 0;
  return value;
}
function booleanField(fields2, key) {
  const value = fields2.get(key);
  if (typeof value !== "boolean") return void 0;
  return value;
}
function nonnegativeNumberField(fields2, key) {
  const value = fields2.get(key);
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return void 0;
  return value;
}
function snapshotMetaField(fields2, key) {
  const value = fields2.get(key);
  if (value === null || typeof value !== "object") return void 0;
  const raw = objectFields(value);
  const unreachableFrames = raw.get("unreachableFrames");
  const selectorMatched = booleanField(raw, "selectorMatched");
  const selectorClosedShadow = booleanField(raw, "selectorClosedShadow");
  const selectorInvalid = booleanField(raw, "selectorInvalid");
  return {
    ...typeof unreachableFrames === "number" ? { unreachableFrames } : {},
    ...selectorMatched !== void 0 ? { selectorMatched } : {},
    ...selectorClosedShadow !== void 0 ? { selectorClosedShadow } : {},
    ...selectorInvalid !== void 0 ? { selectorInvalid } : {}
  };
}
function decodeEnvelope(raw) {
  try {
    const parsed2 = JSON.parse(raw);
    if (parsed2 !== null && typeof parsed2 === "object") {
      const fields2 = objectFields(parsed2);
      const text2 = stringField(fields2, "text");
      if (text2 !== void 0) {
        return { text: text2, imageKey: stringField(fields2, "imageKey") };
      }
    }
  } catch (error42) {
    process.stderr.write(
      `sand.computer_use.browser_result_envelope_unparseable error_class=${errorLogTag(error42)}
`
    );
  }
  return { text: raw };
}
var SAND_TOOL_MARKER = "__sand_tool__";
function encodeSandStep(payload) {
  return JSON.stringify({ [SAND_TOOL_MARKER]: true, ...payload });
}
function toolCallWrapper(payload) {
  return new ToolCall({
    tool: {
      case: "communicateUpdateToolCall",
      value: new CommunicateUpdateToolCall({
        args: new CommunicateUpdateArgs({
          currentStep: encodeSandStep(payload)
        })
      })
    }
  });
}
function toResultProto(output) {
  if (output.isError === true) {
    return new CommunicateUpdateResult({
      result: {
        case: "error",
        value: new CommunicateUpdateError({ error: output.text })
      }
    });
  }
  return new CommunicateUpdateResult({
    result: {
      case: "success",
      value: new CommunicateUpdateSuccess({
        currentStep: encodeEnvelope2({
          text: output.text,
          ...output.imageKey !== void 0 ? { imageKey: output.imageKey } : {}
        })
      })
    }
  });
}
function buildResultToolCall(tool, result) {
  if (result.result.case === "error") {
    return new ToolCall({
      tool: {
        case: "communicateUpdateToolCall",
        value: new CommunicateUpdateToolCall({
          args: new CommunicateUpdateArgs({
            currentStep: encodeSandStep({
              tool,
              error: result.result.value.error || "The browser action failed."
            })
          }),
          result
        })
      }
    });
  }
  const text2 = result.result.case === "success" ? decodeEnvelope(result.result.value.currentStep).text : "";
  return new ToolCall({
    tool: {
      case: "communicateUpdateToolCall",
      value: new CommunicateUpdateToolCall({
        args: new CommunicateUpdateArgs({
          currentStep: encodeSandStep({ tool, result: text2 })
        }),
        result
      })
    }
  });
}
async function renderBrowserToolOutput(output, takeScreenshot) {
  if (output.result.case === "error") {
    return createStringResult(output.result.value.error || "The browser action failed.", true);
  }
  if (output.result.case !== "success") {
    return createStringResult("The browser action completed.");
  }
  const envelope = decodeEnvelope(output.result.value.currentStep);
  if (envelope.imageKey !== void 0) {
    const image2 = takeScreenshot(envelope.imageKey);
    if (image2 !== void 0) {
      return createImageResult(image2.data, image2.mimeType, envelope.text);
    }
    process.stderr.write("sand.computer_use.browser_screenshot_missing\n");
  }
  return createStringResult(envelope.text);
}
function sanitizeForBoxPath(value) {
  const cleaned = value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return cleaned.length > 0 ? cleaned : `call-${Date.now()}`;
}
var SandBrowserDriverError = class extends SandBrowserOperationError {
};
var NAVIGATING_OPS = /* @__PURE__ */ new Set([
  "navigate",
  "click",
  "mouse_click_xy",
  "type",
  "type_focused",
  "press_key",
  "cdp",
  "tabs"
]);
var JAVASCRIPT_URL_ERROR = "javascript: URLs are not allowed; open an http(s) page instead.";
var SandBrowserDriver = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  inflightScreenshots = /* @__PURE__ */ new Map();
  uploaded;
  windowIndex;
  takeScreenshot(imageKey) {
    const image2 = this.inflightScreenshots.get(imageKey);
    this.inflightScreenshots.delete(imageKey);
    return image2;
  }
  resolveWindowIndex(ctx) {
    this.windowIndex ??= this.deps.getWindowIndex(ctx).then((index) => {
      if (index === void 0) {
        this.windowIndex = void 0;
        throw new SandBrowserDriverError(
          "The box has not assigned this agent a browser window yet; try again in a moment.",
          "window_unavailable"
        );
      }
      return index;
    }).catch((error42) => {
      this.windowIndex = void 0;
      throw error42 instanceof SandBrowserDriverError ? error42 : new SandBrowserDriverError(
        `Could not resolve this agent's browser window: ${errorMessage(error42)}`,
        "window_resolution_failed"
      );
    });
    return this.windowIndex;
  }
  ensureUploaded(ctx) {
    this.uploaded ??= this.deps.agentBox.uploadFile(
      ctx,
      this.deps.getBoxId(),
      SAND_BROWSER_DRIVER_BOX_PATH,
      import_node_buffer6.Buffer.from(SAND_BROWSER_DRIVER_SOURCE, "utf8")
    ).catch((error42) => {
      this.uploaded = void 0;
      throw new SandBrowserDriverError(
        `Could not install the browser driver on the box: ${errorMessage(error42)}`,
        "upload_failed"
      );
    });
    return this.uploaded;
  }
  async run(ctx, {
    op,
    toolCallId,
    args,
    skipScreenshot,
    observation
  }) {
    observation.stage = "setup";
    const [windowIndex] = await Promise.all([
      this.resolveWindowIndex(ctx),
      this.ensureUploaded(ctx)
    ]);
    let screenshotPath;
    if (skipScreenshot === true) {
      screenshotPath = void 0;
    } else if (op === "screenshot") {
      screenshotPath = `/workspace/screenshots/shot-${sanitizeForBoxPath(toolCallId)}.png`;
    } else {
      screenshotPath = `${SAND_BROWSER_DRIVER_BOX_DIR}/shot-${sanitizeForBoxPath(toolCallId)}.png`;
    }
    const request5 = {
      ...args,
      op,
      display: windowIndex,
      cdpPort: BOX_CDP_PORT_BASE + windowIndex,
      viewId: typeof args["viewId"] === "string" && args["viewId"].length > 0 ? args["viewId"] : this.deps.getDefaultViewId(),
      navigationRecovery: this.deps.isNavigationRecoveryEnabled?.() === true,
      ...screenshotPath !== void 0 ? { screenshotPath } : {}
    };
    const encoded = import_node_buffer6.Buffer.from(JSON.stringify(request5), "utf8").toString("base64");
    const shell = this.deps.resourceAccessor.get(shellExecutorResource);
    observation.stage = "shell";
    const shellResult = shell.execute(
      ctx,
      buildHostShellArgs({
        command: `node ${SAND_BROWSER_DRIVER_BOX_PATH} ${encoded}`,
        name: "node",
        workingDirectory: "/workspace",
        toolCallId,
        timeoutMs: SAND_BROWSER_DRIVER_SHELL_TIMEOUT_MS
      })
    );
    const result = await observation.shellResult(shellResult);
    if (result.result.case !== "success") {
      throw new SandBrowserDriverError(describeSandBrowserShellError(result));
    }
    const { stdout } = result.result.value;
    const response = parseDriverResponse(stdout);
    if (response === void 0) {
      throw new SandBrowserDriverError(describeSandBrowserShellError(result));
    }
    observation.driverResponded(response.opDurationMs, {
      connectMs: response.connectMs,
      screenshotMs: response.screenshotMs
    });
    observation.stage = "action";
    if (!response.ok) {
      if (response.protocolInvalid === true) {
        observation.stage = "protocol";
        observation.fail("protocol_invalid");
      } else {
        observation.fail(response.infra === true ? "driver_infra_error" : "driver_error");
      }
      return {
        text: response.error ?? "The browser action failed.",
        isError: true
      };
    }
    if (op === "screenshot" && response.screenshot !== true) {
      observation.fail("screenshot_missing");
      return { text: "Failed to capture the screenshot.", isError: true };
    }
    const parts = [
      op === "screenshot" && screenshotPath !== void 0 ? `Saved a screenshot to ${screenshotPath}` : response.summary ?? "Done."
    ];
    if (response.url !== void 0 && response.url.length > 0) {
      parts.push(`Current page: ${response.title ?? ""} (${response.url})`);
    }
    if (response.data !== void 0 && response.data.length > 0) {
      parts.push(response.data);
    }
    let imageKey;
    if (response.screenshot === true && screenshotPath !== void 0) {
      const image2 = await observation.screenshot(
        this.fetchScreenshot(ctx, screenshotPath, observation)
      );
      if (image2 !== void 0) {
        this.inflightScreenshots.set(toolCallId, image2);
        imageKey = toolCallId;
      }
    }
    return { text: parts.join("\n\n"), imageKey };
  }
  async call(ctx, op, args, options2) {
    const observation = new BrowserOperationObservation({
      ctx,
      signal: options2.signal,
      operation: op,
      toolCallId: options2.toolCallId,
      invocationId: void 0,
      harness: this.deps.harness ?? "unavailable",
      report: this.deps.reportBrowserOperation
    });
    const onAbort = () => {
      observation.fail("cancelled");
      observation.finish();
    };
    options2.signal.addEventListener("abort", onAbort, { once: true });
    if (options2.signal.aborted) onAbort();
    try {
      return await this.perform(ctx, op, args, options2, observation);
    } catch (error42) {
      observation.caught(error42);
      throw error42;
    } finally {
      options2.signal.removeEventListener("abort", onAbort);
      observation.finish();
    }
  }
  async perform(ctx, op, args, options2, observation) {
    try {
      const url2 = stringArg(args, "url");
      if (url2 !== void 0 && isJavascriptUrl(url2)) {
        observation.fail("invalid_arguments");
        return { ok: false, error: JAVASCRIPT_URL_ERROR };
      }
      if (op === "cdp") observation.admittedCdpMethod(stringArg(args, "method") ?? "");
      if (this.deps.autoReview !== void 0 && options2.readOnlyProbe !== true) {
        observation.stage = "auto_review";
        const { resolveDisplayNumber, ...autoReviewOptions } = this.deps.autoReview;
        const exactAction = toBrowserReviewAction(op, args, this.deps.getDefaultViewId());
        await runSandBrowserAutoReviewPreflight({
          ctx,
          resourceAccessor: this.deps.resourceAccessor,
          options: {
            ...autoReviewOptions,
            captureReviewState: async (stateCtx, stateToolCallId) => await captureBrowserReviewState({
              ctx: stateCtx,
              resourceAccessor: this.deps.resourceAccessor,
              toolCallId: stateToolCallId,
              resolveDisplayNumber,
              ...op !== "tabs" && exactAction.viewId !== void 0 ? { viewId: exactAction.viewId } : {}
            })
          },
          exactAction,
          toolCallId: options2.toolCallId,
          stateHandler: options2.stateHandler,
          workspacePaths: options2.workspacePaths,
          signal: options2.signal
        });
      }
      observation.stage = "setup";
      const [windowIndex] = await Promise.all([
        this.resolveWindowIndex(ctx),
        this.ensureUploaded(ctx)
      ]);
      const wantScreenshot = options2.screenshot === true || op === "screenshot";
      const screenshotPath = wantScreenshot ? `${SAND_BROWSER_DRIVER_BOX_DIR}/shot-${sanitizeForBoxPath(options2.toolCallId)}.png` : void 0;
      const request5 = {
        ...args,
        op,
        display: windowIndex,
        cdpPort: BOX_CDP_PORT_BASE + windowIndex,
        viewId: typeof args["viewId"] === "string" && args["viewId"].length > 0 ? args["viewId"] : this.deps.getDefaultViewId(),
        navigationRecovery: this.deps.isNavigationRecoveryEnabled?.() === true,
        ...screenshotPath !== void 0 ? { screenshotPath } : {}
      };
      const encoded = import_node_buffer6.Buffer.from(JSON.stringify(request5), "utf8").toString("base64");
      const shell = this.deps.resourceAccessor.get(shellExecutorResource);
      observation.stage = "shell";
      const result = await observation.shellResult(
        shell.execute(
          ctx,
          buildHostShellArgs({
            command: `node ${SAND_BROWSER_DRIVER_BOX_PATH} ${encoded}`,
            name: "node",
            workingDirectory: "/workspace",
            toolCallId: options2.toolCallId,
            timeoutMs: SAND_BROWSER_DRIVER_SHELL_TIMEOUT_MS
          })
        )
      );
      if (result.result.case !== "success") {
        throw new SandBrowserDriverError(describeSandBrowserShellError(result));
      }
      const response = parseDriverResponse(result.result.value.stdout);
      if (response === void 0) {
        throw new SandBrowserDriverError(describeSandBrowserShellError(result));
      }
      observation.driverResponded(response.opDurationMs, {
        connectMs: response.connectMs,
        screenshotMs: response.screenshotMs
      });
      observation.stage = "action";
      if (NAVIGATING_OPS.has(op)) this.deps.onPossibleNavigation?.(ctx);
      if (!response.ok) {
        if (response.protocolInvalid === true) {
          observation.stage = "protocol";
          observation.fail("protocol_invalid");
        } else {
          observation.fail(response.infra === true ? "driver_infra_error" : "driver_error");
        }
        return { ok: false, error: response.error ?? "The browser action failed." };
      }
      if (wantScreenshot && (response.screenshot !== true || screenshotPath === void 0)) {
        observation.fail("screenshot_missing");
        return { ok: false, error: "Failed to capture the screenshot." };
      }
      const screenshot = screenshotPath === void 0 ? void 0 : await observation.download(
        this.deps.agentBox.downloadFile(ctx, this.deps.getBoxId(), screenshotPath)
      );
      observation.stage = "result";
      return {
        ok: true,
        summary: response.summary,
        data: response.data,
        url: response.url,
        title: response.title,
        screenshot
      };
    } catch (error42) {
      if (error42 instanceof DeferredInteractionResponseError || error42 instanceof SandBrowserAutoReviewBlockedError) {
        observation.fail("auto_review_blocked");
      }
      throw error42;
    }
  }
  async fetchScreenshot(ctx, boxPath, observation) {
    try {
      const bytes = await observation.download(
        this.deps.agentBox.downloadFile(ctx, this.deps.getBoxId(), boxPath)
      );
      if (bytes.length === 0) return void 0;
      const persistImage = this.deps.getPersistImage();
      if (persistImage !== void 0) {
        await persistImage(bytes, "image/png").catch((error42) => {
          process.stderr.write(
            `sand.computer_use.browser_screenshot_persist_failed error_class=${errorLogTag(error42)}
`
          );
        });
      }
      return await shrinkImageForModel(ctx, bytes, {
        mimeType: "image/png",
        source: "sand_browser_screenshot"
      });
    } catch {
      return void 0;
    }
  }
};
function toDriverResponse(parsed2) {
  const fields2 = objectFields(parsed2);
  return {
    ok: booleanField(fields2, "ok") ?? false,
    protocolInvalid: booleanField(fields2, "ok") === void 0 ? true : void 0,
    error: stringField(fields2, "error"),
    infra: booleanField(fields2, "infra"),
    summary: stringField(fields2, "summary"),
    data: stringField(fields2, "data"),
    url: stringField(fields2, "url"),
    title: stringField(fields2, "title"),
    viewId: stringField(fields2, "viewId"),
    screenshot: booleanField(fields2, "screenshot"),
    meta: snapshotMetaField(fields2, "meta"),
    control: filledControlField(fields2, "control"),
    opDurationMs: nonnegativeNumberField(fields2, "opDurationMs"),
    connectMs: nonnegativeNumberField(fields2, "connectMs"),
    screenshotMs: nonnegativeNumberField(fields2, "screenshotMs")
  };
}
function filledControlField(fields2, key) {
  const value = fields2.get(key);
  if (value === null || typeof value !== "object") return void 0;
  const raw = objectFields(value);
  const type2 = stringField(raw, "type");
  const autoComplete = stringField(raw, "autoComplete");
  const descriptor2 = stringField(raw, "descriptor");
  const splitCharGroup = booleanField(raw, "splitCharGroup");
  if (type2 === void 0 && autoComplete === void 0) return void 0;
  return {
    ...type2 !== void 0 ? { type: type2 } : {},
    ...autoComplete !== void 0 ? { autoComplete } : {},
    ...descriptor2 !== void 0 ? { descriptor: descriptor2 } : {},
    ...splitCharGroup !== void 0 ? { splitCharGroup } : {}
  };
}
function parseDriverResponse(stdout) {
  const lines2 = stdout.split("\n");
  for (let i = lines2.length - 1; i >= 0; i--) {
    const line = lines2[i] ?? "";
    const markerIndex = line.indexOf(SAND_BROWSER_RESULT_MARKER);
    if (markerIndex < 0) continue;
    try {
      const parsed2 = JSON.parse(
        line.slice(markerIndex + SAND_BROWSER_RESULT_MARKER.length)
      );
      if (parsed2 !== null && typeof parsed2 === "object") {
        return toDriverResponse(parsed2);
      }
    } catch {
      return void 0;
    }
  }
  return void 0;
}
function stringArg(args, key) {
  const value = args[key];
  return typeof value === "string" ? value : void 0;
}
var SAND_BROWSER_MAX_HOLD_DURATION_MS = 3e4;
function browserHoldDurationField(description9) {
  return external_exports.number().int().min(1).max(SAND_BROWSER_MAX_HOLD_DURATION_MS).optional().describe(`${description9} Max ${SAND_BROWSER_MAX_HOLD_DURATION_MS}.`);
}
function numberArg(args, key) {
  const value = args[key];
  return typeof value === "number" ? value : void 0;
}
function booleanArg(args, key) {
  const value = args[key];
  return typeof value === "boolean" ? value : void 0;
}
function stringArrayArg(args, key) {
  const value = args[key];
  if (!Array.isArray(value)) return void 0;
  return value.filter((entry) => typeof entry === "string");
}
function toBrowserReviewAction(op, args, defaultViewId) {
  return {
    op,
    viewId: stringArg(args, "viewId") ?? defaultViewId,
    url: stringArg(args, "url"),
    ref: stringArg(args, "ref"),
    element: stringArg(args, "element"),
    text: stringArg(args, "text"),
    value: stringArg(args, "value"),
    values: stringArrayArg(args, "values"),
    key: stringArg(args, "key"),
    cdpMethod: op === "cdp" ? stringArg(args, "method") : void 0,
    cdpParams: op === "cdp" && args["params"] !== void 0 ? JSON.stringify(args["params"]) : void 0,
    tabsAction: op === "tabs" ? stringArg(args, "action") : void 0,
    tabIndex: op === "tabs" ? numberArg(args, "index") : void 0,
    x: numberArg(args, "x"),
    y: numberArg(args, "y"),
    sourceRef: stringArg(args, "sourceRef"),
    sourceX: numberArg(args, "sourceX"),
    sourceY: numberArg(args, "sourceY"),
    targetRef: stringArg(args, "targetRef"),
    targetX: numberArg(args, "targetX"),
    targetY: numberArg(args, "targetY"),
    newTab: booleanArg(args, "newTab"),
    submit: booleanArg(args, "submit"),
    clear: booleanArg(args, "clear"),
    doubleClick: booleanArg(args, "doubleClick"),
    holdDurationMs: numberArg(args, "holdDurationMs"),
    button: stringArg(args, "button"),
    modifiers: stringArrayArg(args, "modifiers")
  };
}
var BROWSER_REVIEW_STATE_MARKER = "__SAND_BROWSER_VIEW_STATE__";
var viewIdKeyedStrings = external_exports.record(external_exports.string()).transform((entries) => new Map(Object.entries(entries)));
var browserViewStateSchema = external_exports.object({ views: viewIdKeyedStrings, urls: viewIdKeyedStrings });
function parseBrowserViewState(stateJson) {
  let parsed2;
  try {
    parsed2 = JSON.parse(stateJson);
  } catch {
    return void 0;
  }
  const state = browserViewStateSchema.safeParse(parsed2);
  return state.success ? state.data : void 0;
}
function resolveBrowserTargetPageUrl({
  probeStdout,
  stateJson,
  viewId
}) {
  const state = parseBrowserViewState(stateJson);
  if (state === void 0) return void 0;
  const targetId = state.views.get(viewId);
  if (targetId !== void 0 && targetId.length > 0) {
    for (const target of parseNavigationProbeOutput(probeStdout)) {
      if (target.type !== "page" || target.id !== targetId) continue;
      if (typeof target.url === "string" && target.url.length > 0) {
        return normalizeNavigationUrl(target.url);
      }
    }
  }
  const lastUrl = state.urls.get(viewId);
  return lastUrl !== void 0 && lastUrl.length > 0 ? normalizeNavigationUrl(lastUrl) : void 0;
}
async function captureBrowserReviewState(args) {
  let displayNumber;
  try {
    displayNumber = await args.resolveDisplayNumber(args.ctx);
  } catch {
    throw new SandBrowserAutoReviewBlockedError(
      "Browser Auto-review could not identify this agent's own display; retry once the box desktop is ready.",
      "display_unavailable"
    );
  }
  if (displayNumber === void 0) {
    throw new SandBrowserAutoReviewBlockedError(
      SAND_BOX_NO_MONITOR_AVAILABLE_MESSAGE,
      "display_unavailable"
    );
  }
  let result;
  try {
    result = await args.resourceAccessor.get(shellExecutorResource).execute(
      args.ctx,
      buildHostShellArgs({
        command: `${navigationProbeCommand(displayNumber)} && echo ${BROWSER_REVIEW_STATE_MARKER} && (cat ${SAND_BROWSER_DRIVER_BOX_DIR}/views-${displayNumber}.json 2>/dev/null || true)`,
        name: "curl",
        workingDirectory: "/workspace",
        toolCallId: `${args.toolCallId}:auto-review-state`
      })
    );
  } catch {
    throw new SandBrowserAutoReviewBlockedError(
      "Browser Auto-review could not capture the current page state.",
      "state_capture_failed"
    );
  }
  const probe = classifyNavigationProbeResult(result, args.ctx.signal.aborted);
  if (probe.kind === "chrome-unreachable") {
    return { displayStateIdentity: SAND_COMPUTER_PAGE_STATE_CHROME_UNREACHABLE };
  }
  if (probe.kind === "capture-failed") {
    throw new SandBrowserAutoReviewBlockedError(
      "Browser Auto-review could not capture the current page state.",
      "state_capture_failed"
    );
  }
  const { stdout } = probe;
  const markerIndex = stdout.indexOf(BROWSER_REVIEW_STATE_MARKER);
  const probePart = markerIndex >= 0 ? stdout.slice(0, markerIndex) : stdout;
  const statePart = markerIndex >= 0 ? stdout.slice(markerIndex + BROWSER_REVIEW_STATE_MARKER.length) : "";
  const targetPageUrl = args.viewId !== void 0 ? resolveBrowserTargetPageUrl({
    probeStdout: probePart,
    stateJson: statePart.trim(),
    viewId: args.viewId
  }) : void 0;
  return {
    displayStateIdentity: computeSandComputerPageStateIdentity(probePart),
    ...targetPageUrl !== void 0 ? { targetPageUrl } : {}
  };
}
function defineBrowserTool(driver, deps, spec) {
  const tool = createZodAgentTool(
    spec.id,
    {
      name: spec.name,
      descriptionGenerator: () => spec.description,
      parameters: spec.parameters,
      execute: withSafeParsedArgs(
        spec.parameters,
        async (ctx, interactionHandler, parsedArgs, meta) => {
          const observation = ctx.get(browserOperationObservationKey);
          if (observation === void 0) {
            throw new Error("Browser operation observation missing");
          }
          observation.stage = "result";
          const initial = toolCallWrapper({
            phase: "executing",
            tool: spec.name
          });
          return await interactionHandler.executeToolCall(
            ctx,
            initial,
            meta.toolCallId,
            async () => {
              try {
                const mapped = spec.mapArgs ? spec.mapArgs(parsedArgs) : parsedArgs;
                if (spec.op === "cdp") {
                  observation.admittedCdpMethod(stringArg(mapped, "method") ?? "");
                }
                if (deps.autoReview !== void 0) {
                  observation.stage = "auto_review";
                  const { resolveDisplayNumber, ...autoReviewOptions } = deps.autoReview;
                  const exactAction = toBrowserReviewAction(
                    spec.op,
                    mapped,
                    deps.getDefaultViewId()
                  );
                  await runSandBrowserAutoReviewPreflight({
                    ctx,
                    resourceAccessor: deps.resourceAccessor,
                    options: {
                      ...autoReviewOptions,
                      captureReviewState: async (stateCtx, stateToolCallId) => await captureBrowserReviewState({
                        ctx: stateCtx,
                        resourceAccessor: deps.resourceAccessor,
                        toolCallId: stateToolCallId,
                        resolveDisplayNumber,
                        ...spec.op !== "tabs" && exactAction.viewId !== void 0 ? { viewId: exactAction.viewId } : {}
                      })
                    },
                    exactAction,
                    toolCallId: meta.toolCallId,
                    stateHandler: meta.stateHandler,
                    workspacePaths: meta.workspacePaths,
                    signal: interactionHandler.getAbortSignal(ctx)
                  });
                }
                const output = await driver.run(ctx, {
                  op: spec.op,
                  toolCallId: meta.toolCallId,
                  args: mapped,
                  skipScreenshot: spec.skipScreenshot,
                  observation
                });
                observation.stage = "result";
                if (spec.canNavigate === true) {
                  deps.onPossibleNavigation?.(ctx);
                }
                return toResultProto(output);
              } catch (error42) {
                if (error42 instanceof DeferredInteractionResponseError) {
                  observation.fail("auto_review_blocked");
                  throw error42;
                }
                if (error42 instanceof SandBrowserAutoReviewBlockedError) {
                  observation.fail("auto_review_blocked");
                } else {
                  observation.caught(error42);
                }
                return toResultProto({
                  text: errorMessage(error42),
                  isError: true
                });
              }
            },
            (result) => buildResultToolCall(spec.name, result)
          );
        },
        toolCallWrapper({ tool: spec.name }),
        { emitInitialPartialToolCall: false }
      ),
      render: (_ctx, output) => renderBrowserToolOutput(output, (imageKey) => driver.takeScreenshot(imageKey)),
      serializeError: (error42) => buildResultToolCall(spec.name, toResultProto({ text: errorMessage(error42), isError: true }))
    }
  );
  return {
    ...tool,
    execute: (ctx, interactionHandler, argsStream, meta) => {
      const observation = new BrowserOperationObservation({
        ctx,
        signal: interactionHandler.getAbortSignal(ctx),
        operation: spec.op,
        toolCallId: meta.toolCallId,
        invocationId: interactionHandler.invocationId,
        harness: deps.harness ?? "unavailable",
        report: deps.reportBrowserOperation
      });
      return observation.run(
        () => tool.execute(
          ctx.with(browserOperationObservationKey, observation),
          interactionHandler,
          argsStream,
          meta
        )
      );
    }
  };
}
var viewIdField = external_exports.string().optional().describe("Tab to act on. Omit to use your own tab; browser_tabs new or select re-points it.");
function isJavascriptUrl(url2) {
  try {
    return new URL(url2).protocol === "javascript:";
  } catch {
    return false;
  }
}
function browserUrlField(description9) {
  return external_exports.string().min(1).refine((url2) => !isJavascriptUrl(url2), {
    message: "javascript: URLs are not allowed; open an http(s) page instead."
  }).describe(description9);
}
var elementField = external_exports.string().optional().describe("Human-readable description of the element.");
function createSandBrowserTools(deps) {
  const driver = new SandBrowserDriver(deps);
  return [
    defineBrowserTool(driver, deps, {
      id: "BROWSER_NAVIGATE",
      name: "browser_navigate",
      description: "Navigate the box browser to a URL. By default reuses your tab; set newTab: true to open in a new tab. Returns the resulting page state with a screenshot.",
      op: "navigate",
      canNavigate: true,
      parameters: external_exports.object({
        url: browserUrlField("The URL to navigate to"),
        viewId: viewIdField,
        newTab: external_exports.boolean().optional().describe(
          "When true, creates a new tab before navigating instead of reusing an existing tab. Defaults to false."
        )
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_SNAPSHOT",
      name: "browser_snapshot",
      description: "Capture a structured snapshot of the current page with [ref=eN] handles for interactive elements. The snapshot pierces open shadow roots and same-origin iframes, so fields inside custom elements or embedded login frames get real refs; a frame it cannot enter (cross-origin) is called out in a trailing note instead. This is the source of truth for page structure. Refs stay valid across snapshots of this page load; they go stale on navigation, when the element is gone, or when its role or name changes. Reuse a ref until then - snapshot when the screenshot shows a new page or a control you have no ref for. Better than a screenshot for deciding what to click or type.",
      op: "snapshot",
      parameters: external_exports.object({
        viewId: viewIdField,
        interactive: external_exports.boolean().optional().describe(
          "When true, keep interactive elements and headings and drop paragraph, list, label, and table text. Defaults to false."
        ),
        maxDepth: external_exports.number().optional().describe("Maximum depth for snapshot output. Defaults to 20."),
        selector: external_exports.string().optional().describe(
          `Optional CSS selector to scope the snapshot to a subtree. It is resolved deeply, meaning open shadow roots and same-origin iframes are searched, and the explicit '>>>' combinator re-roots each following stage at the previous match (e.g. 'faceplate-text-input[name="username"] >>> input').`
        )
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_CLICK",
      name: "browser_click",
      description: "Click an element by ref from browser_snapshot. Scrolls the element into view first.",
      op: "click",
      canNavigate: true,
      parameters: external_exports.object({
        ref: external_exports.string().min(1).describe("Element ref from browser_snapshot."),
        element: external_exports.string().optional().describe(
          "Concise description of the element being clicked and why. Always include it. The safety check that runs before the action reads it and may refuse the call without it."
        ),
        offsetX: external_exports.number().optional().describe("Optional x offset from the element center."),
        offsetY: external_exports.number().optional().describe("Optional y offset from the element center."),
        doubleClick: external_exports.boolean().optional().describe("When true, double-click the element."),
        button: external_exports.enum(["left", "right", "middle"]).optional().describe("Mouse button. Defaults to left."),
        modifiers: external_exports.array(external_exports.enum(["Control", "Shift", "Alt", "Meta", "ControlOrMeta"])).optional().describe("Optional modifier keys."),
        holdDurationMs: browserHoldDurationField(
          `Milliseconds to hold the mouse button down before release. Use for press-and-hold "I'm human" widgets, holding until the widget completes; when it asks you to try again, hold longer.`
        ),
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_MOUSE_CLICK_XY",
      name: "browser_mouse_click_xy",
      description: "Click at viewport coordinates. Prefer browser_click with refs when possible.",
      op: "mouse_click_xy",
      canNavigate: true,
      parameters: external_exports.object({
        x: external_exports.number().describe("Viewport x coordinate."),
        y: external_exports.number().describe("Viewport y coordinate."),
        element: external_exports.string().optional().describe(
          "Concise description of the element being clicked and why. Always include it. The safety check that runs before the action reads it and may refuse the call without it."
        ),
        button: external_exports.enum(["left", "right", "middle"]).optional().describe("Mouse button. Defaults to left."),
        holdDurationMs: browserHoldDurationField(
          `Milliseconds to hold the mouse button down before release. Use for press-and-hold "I'm human" widgets, holding until the widget completes; when it asks you to try again, hold longer.`
        ),
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_TYPE",
      name: "browser_type",
      description: "Send keystrokes into an input, textarea, or contenteditable element by ref, like a user typing. Use it for autocomplete, search-as-you-type, and rich text editors. For ordinary form fields use browser_fill, which sets the value in one step.",
      op: "type",
      canNavigate: true,
      parameters: external_exports.object({
        ref: external_exports.string().min(1).describe("Element ref from browser_snapshot."),
        text: external_exports.string().describe("Text to type."),
        element: elementField,
        clear: external_exports.boolean().optional().describe("When true, clear existing text first."),
        submit: external_exports.boolean().optional().describe("When true, press Enter after typing."),
        slowly: external_exports.boolean().optional().describe("When true, pause 40ms between keystrokes for pages that debounce input."),
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_FILL",
      name: "browser_fill",
      description: "Set the value of an input, textarea, or contenteditable element by ref in one step, then verify the page kept it. Handles masked inputs and split one-time-code boxes. Prefer this over browser_type for form fields.",
      op: "fill",
      parameters: external_exports.object({
        ref: external_exports.string().min(1).describe("Element ref from browser_snapshot."),
        value: external_exports.string().describe("Value to set."),
        element: elementField,
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_SELECT_OPTION",
      name: "browser_select_option",
      description: "Select one or more options in a select element by ref.",
      op: "select_option",
      parameters: external_exports.object({
        ref: external_exports.string().min(1).describe("Element ref from browser_snapshot."),
        values: external_exports.array(external_exports.string()).describe("Option values or labels to select."),
        element: elementField,
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_PRESS_KEY",
      name: "browser_press_key",
      description: "Press a key in the browser page, for example Enter, Escape, Tab, ArrowDown, or a single character.",
      op: "press_key",
      canNavigate: true,
      parameters: external_exports.object({
        key: external_exports.string().min(1).describe(
          "Key to press, for example Enter, Escape, Tab, ArrowDown, or a single character."
        ),
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_SCROLL",
      name: "browser_scroll",
      description: "Scroll the page or scroll an element into view (pass its ref).",
      op: "scroll",
      parameters: external_exports.object({
        ref: external_exports.string().optional().describe(
          "Optional element ref from browser_snapshot to scroll into view. When set, direction, amount, deltaX, and deltaY are ignored."
        ),
        element: elementField,
        direction: external_exports.enum(["up", "down", "left", "right"]).optional().describe("Scroll direction. Defaults to down."),
        amount: external_exports.number().optional().describe("Positive scroll amount in pixels. Defaults to 300."),
        deltaX: external_exports.number().optional().describe("Explicit horizontal scroll delta."),
        deltaY: external_exports.number().optional().describe("Explicit vertical scroll delta."),
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_DRAG",
      name: "browser_drag",
      description: "Drag an element by ref to another ref or viewport coordinates.",
      op: "drag",
      parameters: external_exports.object({
        sourceRef: external_exports.string().min(1).describe("Source element ref from browser_snapshot."),
        element: external_exports.string().optional().describe(
          "Concise description of what is being dragged where, and why. Always include it. The safety check that runs before the action reads it and may refuse the call without it."
        ),
        targetRef: external_exports.string().optional().describe("Optional target element ref from browser_snapshot."),
        targetX: external_exports.number().optional().describe("Optional target viewport x coordinate."),
        targetY: external_exports.number().optional().describe("Optional target viewport y coordinate."),
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_GET_BOUNDING_BOX",
      name: "browser_get_bounding_box",
      description: "Get the viewport bounding box for an element ref.",
      op: "get_bounding_box",
      skipScreenshot: true,
      parameters: external_exports.object({
        ref: external_exports.string().min(1).describe("Element ref from browser_snapshot."),
        element: elementField,
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_HIGHLIGHT",
      name: "browser_highlight",
      description: "Highlight an element by ref in the browser page for visual grounding. The returned screenshot shows the highlight.",
      op: "highlight",
      parameters: external_exports.object({
        ref: external_exports.string().min(1).describe("Element ref from browser_snapshot."),
        element: elementField,
        durationMs: external_exports.number().optional().describe("Highlight duration in milliseconds. Defaults to 2000, max 5000."),
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_CDP",
      name: "browser_cdp",
      description: "Send a Chrome DevTools Protocol command to the target browser tab. Do not use CDP Input.* methods; use dedicated browser tools for clicks, text input, key presses, scrolling, and drag-and-drop. Browser-wide, storage, cookie, cache, permission, and target-management commands are denied. Results over 20k characters are written to /workspace/browser-cdp (not packed into the box store); the tool returns {truncated, outputFile, bytes, preview}. Read that file, or Shell/jq if a single line exceeds Read's 100k-character limit.",
      op: "cdp",
      canNavigate: true,
      parameters: external_exports.object({
        method: external_exports.string().min(1).describe(
          "CDP method name, for example Runtime.evaluate, DOM.getDocument, or Performance.getMetrics."
        ),
        params: external_exports.object({}).passthrough().optional().describe("CDP params object. Omit or pass {} when the command takes no params."),
        viewId: viewIdField
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_TABS",
      name: "browser_tabs",
      description: "List, create, close, or select a browser tab. Creating or selecting a tab re-points your own tab at it, so subsequent browser tools (snapshot, click, \u2026) act on that tab. On first use your own tab adopts the browser's most recently used open page, or a new blank tab when none is open.",
      op: "tabs",
      skipScreenshot: true,
      canNavigate: true,
      parameters: external_exports.object({
        action: external_exports.enum(["list", "new", "close", "select"]).describe("Operation to perform"),
        url: browserUrlField(
          'URL to open in the new tab. Used with "new"; equivalent to browser_navigate with newTab: true.'
        ).optional(),
        index: external_exports.number().optional().describe(
          'Tab index. Required for "select". Optional for "close" (defaults to current tab).'
        )
      })
    }),
    defineBrowserTool(driver, deps, {
      id: "BROWSER_TAKE_SCREENSHOT",
      name: "browser_take_screenshot",
      description: "Save a screenshot of the current page to /workspace/screenshots (not packed into the box store). Use fullPage for the full scrollable page.",
      op: "screenshot",
      parameters: external_exports.object({
        viewId: viewIdField,
        fullPage: external_exports.boolean().optional().describe(
          "When true, captures the full scrollable page instead of the visible viewport."
        )
      })
    })
  ];
}
