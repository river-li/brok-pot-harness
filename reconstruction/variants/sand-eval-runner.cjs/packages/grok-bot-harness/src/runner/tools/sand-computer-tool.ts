/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-computer-tool.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_computer_use_tool_pb();
init_zod();

// @recovered-fragment 2/2
var MOUSE_BUTTONS = {
  left: MouseButton.LEFT,
  right: MouseButton.RIGHT,
  middle: MouseButton.MIDDLE
};
var SCROLL_DIRECTIONS = {
  up: ScrollDirection.UP,
  down: ScrollDirection.DOWN,
  left: ScrollDirection.LEFT,
  right: ScrollDirection.RIGHT
};
var SAND_COMPUTER_MAX_WAIT_MS = 3e4;
var SAND_COMPUTER_MAX_HOLD_MS = SAND_COMPUTER_MAX_WAIT_MS;
var HELD_MODIFIER_KEYS = ["ctrl", "alt", "shift", "meta", "super"];
var HELD_MODIFIER_KEY_SET = new Set(HELD_MODIFIER_KEYS);
function heldModifiersSchema() {
  return external_exports.string().refine(
    (value) => value.split("+").every((part) => HELD_MODIFIER_KEY_SET.has(part.toLowerCase())),
    { message: `Modifiers must be +-joined from: ${HELD_MODIFIER_KEYS.join(", ")}.` }
  ).transform((value) => value.toLowerCase());
}
function boxPixelSchema() {
  return external_exports.number().int().refine((value) => value >= 0, {
    message: "Pixel coordinates are non-negative in the box display space (origin top-left)."
  });
}
function scrollAmountSchema() {
  return external_exports.number().int().refine((value) => value >= 1, { message: "Scroll amount is at least 1 click." });
}
var COMPUTER_ACTIONS = [
  "screenshot",
  "click",
  "move",
  "drag",
  "type",
  "key",
  "scroll",
  "wait"
];
function buildComputerActionCoreSchema(actions = COMPUTER_ACTIONS, options2) {
  const describeFields = options2?.describeFields ?? true;
  const withFieldDescription = (schema2, description9) => describeFields ? schema2.describe(description9) : schema2;
  return external_exports.object({
    action: withFieldDescription(
      external_exports.enum(actions),
      "What to do on the box desktop. Every call captures a fresh screenshot of the resulting screen once all of its actions have run."
    ),
    x: withFieldDescription(
      boxPixelSchema().optional(),
      "X pixel in the box display space (origin top-left) for click/move/scroll, or the start point for drag (omit to act at the cursor for click/move/scroll)."
    ),
    y: withFieldDescription(
      boxPixelSchema().optional(),
      "Y pixel in the box display space (origin top-left) for click/move/scroll, or the start point for drag (omit to act at the cursor for click/move/scroll)."
    ),
    x2: withFieldDescription(
      boxPixelSchema().optional(),
      "X pixel for the drag end point. Required with y2 when path is omitted."
    ),
    y2: withFieldDescription(
      boxPixelSchema().optional(),
      "Y pixel for the drag end point. Required with x2 when path is omitted."
    ),
    path: withFieldDescription(
      external_exports.array(
        external_exports.object({
          x: withFieldDescription(boxPixelSchema(), "X pixel for this drag path point."),
          y: withFieldDescription(boxPixelSchema(), "Y pixel for this drag path point.")
        })
      ).optional(),
      "Optional ordered drag path. A path with at least two {x, y} points is used verbatim instead of x/y/x2/y2."
    ),
    text: withFieldDescription(external_exports.string().optional(), "Text to type. Required for type."),
    key: withFieldDescription(
      external_exports.string().optional(),
      "Key or chord in xdotool form, e.g. Return, ctrl+a, Alt+Left. Required for key. A shortcut meant to open a palette or search may not register \u2014 check the returned screenshot that it opened and holds focus before typing a query into it."
    ),
    button: withFieldDescription(
      external_exports.enum(["left", "right", "middle"]).optional(),
      "Mouse button for click or drag (default left)."
    ),
    count: withFieldDescription(
      external_exports.number().int().min(1).max(3).optional(),
      "Click count for click: 1 single, 2 double, 3 triple."
    ),
    modifiers: withFieldDescription(
      heldModifiersSchema().optional(),
      "Modifier keys held for the whole click, drag, or scroll, e.g. shift, ctrl, meta, ctrl+shift. Use for Shift-click range select and Ctrl/Cmd-click multi-select."
    ),
    direction: withFieldDescription(
      external_exports.enum(["up", "down", "left", "right"]).optional(),
      "Scroll direction. Required for scroll."
    ),
    amount: withFieldDescription(
      scrollAmountSchema().optional(),
      "Scroll amount in clicks (default 3)."
    ),
    durationMs: withFieldDescription(
      external_exports.number().int().min(0).max(SAND_COMPUTER_MAX_WAIT_MS).optional(),
      `Milliseconds to wait. Required for wait. Max ${SAND_COMPUTER_MAX_WAIT_MS}. A settle delay before the screenshot is automatic, so do not add a wait just to let the screen settle.`
    ),
    holdDurationMs: withFieldDescription(
      external_exports.number().int().min(1).max(SAND_COMPUTER_MAX_HOLD_MS).optional(),
      `Milliseconds to keep the mouse button pressed before releasing it. Only valid for click. Use for press-and-hold "I'm human" widgets, holding until the widget completes; when it asks you to try again, hold longer. Max ${SAND_COMPUTER_MAX_HOLD_MS}. Cannot be combined with count > 1 or modifiers.`
    )
  });
}
function refineHoldClick(args, ctx) {
  if (args.holdDurationMs === void 0) return;
  if (args.action !== "click") {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "holdDurationMs is only valid for click.",
      path: ["holdDurationMs"]
    });
    return;
  }
  if ((args.count ?? 1) > 1) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "holdDurationMs cannot be combined with a multi-click count.",
      path: ["holdDurationMs"]
    });
  }
  if (args.modifiers !== void 0) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "holdDurationMs cannot be combined with modifiers.",
      path: ["holdDurationMs"]
    });
  }
}
function refineDragCoordinates(args, ctx) {
  if (args.action !== "drag") return;
  if (args.path !== void 0 && args.path.length >= 2) return;
  if (args.x === void 0 || args.y === void 0 || args.x2 === void 0 || args.y2 === void 0) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Drag requires x, y, x2, and y2 or a path with at least 2 points."
    });
  }
}
var SAND_COMPUTER_MAX_FOLLOW_UP_ACTIONS = 9;
function toEnumValues(actions) {
  const [first, ...rest] = actions;
  invariant(first !== void 0, "A Computer action enum needs at least one action.");
  return [first, ...rest];
}
var FOLLOW_UP_ACTIONS = toEnumValues(
  COMPUTER_ACTIONS.filter((action) => action !== "screenshot")
);
var REVIEWABLE_FOLLOW_UP_ACTIONS = toEnumValues(
  FOLLOW_UP_ACTIONS.filter(isSandComputerAutoReviewBypassAction)
);
function isAutoReviewEnforcing(autoReview) {
  return autoReview?.mode === "enforce";
}
function buildFollowUpParameter(autoReview) {
  const allowed = isAutoReviewEnforcing(autoReview) ? REVIEWABLE_FOLLOW_UP_ACTIONS : FOLLOW_UP_ACTIONS;
  const item = buildComputerActionCoreSchema(allowed, {
    describeFields: false
  }).superRefine((args, ctx) => {
    refineDragCoordinates(args, ctx);
    refineHoldClick(args, ctx);
  });
  return external_exports.array(item).min(1).max(SAND_COMPUTER_MAX_FOLLOW_UP_ACTIONS).optional().describe(
    `Up to ${SAND_COMPUTER_MAX_FOLLOW_UP_ACTIONS} more actions to run in this same call, in order, right after the primary action. Each entry takes the same fields as the primary action. The whole sequence shares one ${COMPUTER_USE_SCREENSHOT_SETTLE_DELAY_MS}ms settle and returns one screenshot of the final screen, so batching is several times faster than a call per action. Batch only steps you already know without seeing the screen between them; when a step depends on what the previous one rendered, make separate calls. Allowed here: ${allowed.join(", ")}.`
  );
}
function batchingSentence(autoReview) {
  return isAutoReviewEnforcing(autoReview) ? "When you already know the next few steps without needing to see the screen between them \u2014 scrolling several times to read further down, nudging the pointer before acting \u2014 put them in then so they run in one call; that is several times faster than one call per action." : "When you already know the next few steps without needing to see the screen between them \u2014 typing into a field you just clicked, scrolling several times to read further down, pressing Tab through a form \u2014 put them in then so they run in one call; that is several times faster than one call per action.";
}
function buildComputerParameters(autoReview) {
  const shape = {
    ...buildComputerActionCoreSchema().shape,
    then: buildFollowUpParameter(autoReview),
    description: sandComputerDeclaredPurposeParameter
  };
  return external_exports.object(shape).superRefine((args, ctx) => {
    refineDragCoordinates(args, ctx);
    refineHoldClick(args, ctx);
    if (autoReview?.mode !== "enforce") return;
    if (args.action !== "click" && args.action !== "drag") return;
    const description9 = args.description?.trim();
    if (description9 !== void 0 && description9.length > 0) return;
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Click and drag require description: a concise statement of the intended UI target and purpose.",
      path: ["description"]
    });
  }).describe(
    "A computer-use action against the box desktop, optionally followed by more actions in the same call."
  );
}
var computerActionParameters = buildComputerParameters();
var screenshotParameters = external_exports.object({}).describe("No arguments. Captures the current box desktop screen.");
function toExactActionArgs(args) {
  const { description: _description, then: _then, ...exact } = args;
  return exact;
}
function coordinate(x, y) {
  if (x === void 0 || y === void 0) return void 0;
  return new Coordinate({ x, y });
}
function dragPath(args) {
  if (args.path !== void 0 && args.path.length >= 2) return args.path;
  if (args.x === void 0 || args.y === void 0) return void 0;
  if (args.x2 === void 0 || args.y2 === void 0) return void 0;
  return [
    { x: args.x, y: args.y },
    { x: args.x2, y: args.y2 }
  ];
}
function heldClickActions(args, holdDurationMs) {
  const button = MOUSE_BUTTONS[args.button ?? "left"];
  const target = coordinate(args.x, args.y);
  return [
    ...target === void 0 ? [] : [
      new ComputerUseAction({
        action: { case: "mouseMove", value: new MouseMoveAction({ coordinate: target }) }
      })
    ],
    new ComputerUseAction({
      action: { case: "mouseDown", value: new MouseDownAction({ button }) }
    }),
    new ComputerUseAction({
      action: { case: "wait", value: new WaitAction({ durationMs: holdDurationMs }) }
    }),
    new ComputerUseAction({
      action: { case: "mouseUp", value: new MouseUpAction({ button }) }
    })
  ];
}
function toActions(args) {
  if (args.action === "click" && args.holdDurationMs !== void 0) {
    return heldClickActions(args, args.holdDurationMs);
  }
  return [toAction(args)];
}
function toAction(args) {
  switch (args.action) {
    case "screenshot":
      return new ComputerUseAction({
        action: { case: "screenshot", value: new ScreenshotAction({}) }
      });
    case "click":
      return new ComputerUseAction({
        action: {
          case: "click",
          value: new ClickAction({
            coordinate: coordinate(args.x, args.y),
            button: MOUSE_BUTTONS[args.button ?? "left"],
            count: args.count ?? 1,
            modifierKeys: args.modifiers
          })
        }
      });
    case "move":
      return new ComputerUseAction({
        action: {
          case: "mouseMove",
          value: new MouseMoveAction({ coordinate: coordinate(args.x, args.y) })
        }
      });
    case "drag": {
      const path30 = dragPath(args);
      if (path30 === void 0) {
        throw new SandToolInputError(
          "Drag requires x, y, x2, and y2 or a path with at least 2 points."
        );
      }
      return new ComputerUseAction({
        action: {
          case: "drag",
          value: new DragAction({
            path: path30.map((point) => new Coordinate(point)),
            button: MOUSE_BUTTONS[args.button ?? "left"],
            modifierKeys: args.modifiers
          })
        }
      });
    }
    case "type":
      return new ComputerUseAction({
        action: { case: "type", value: new TypeAction({ text: args.text ?? "" }) }
      });
    case "key":
      return new ComputerUseAction({
        action: { case: "key", value: new KeyAction({ key: args.key ?? "" }) }
      });
    case "scroll":
      return new ComputerUseAction({
        action: {
          case: "scroll",
          value: new ScrollAction({
            coordinate: coordinate(args.x, args.y),
            direction: SCROLL_DIRECTIONS[args.direction ?? "down"],
            amount: args.amount ?? 3,
            modifierKeys: args.modifiers
          })
        }
      });
    case "wait":
      return new ComputerUseAction({
        action: {
          case: "wait",
          value: new WaitAction({ durationMs: args.durationMs ?? 1e3 })
        }
      });
  }
}
function wrapToolCall(value) {
  return new ToolCall({ tool: { case: "computerUseToolCall", value } });
}
function toReportedAction(args) {
  switch (args.action) {
    case "drag": {
      const start = dragPath(args)?.[0];
      if (start === void 0) return void 0;
      return { type: "drag", x: start.x, y: start.y };
    }
    case "move":
    case "scroll": {
      if (args.x === void 0 || args.y === void 0) return void 0;
      return { type: args.action, x: args.x, y: args.y };
    }
    case "click": {
      if (args.x === void 0 || args.y === void 0) return void 0;
      return {
        type: "click",
        x: args.x,
        y: args.y,
        button: args.button ?? "left",
        count: args.count ?? 1
      };
    }
    default:
      return void 0;
  }
}
function reportComputerAction(onComputerAction, sequence) {
  if (onComputerAction == null) return;
  for (const args of sequence) {
    const reported = toReportedAction(args);
    if (reported !== void 0) onComputerAction(reported);
  }
}
function describeOutcome(result, operation) {
  if (result.result.case === "error") {
    return `${operation === "screenshot" ? "Screenshot" : "Computer action"} failed: ${result.result.value.error}`;
  }
  if (result.result.case !== "success") {
    return operation === "screenshot" ? "Screenshot captured from the box desktop." : "Computer action ran on the box desktop.";
  }
  const success = result.result.value;
  const lines2 = [
    operation === "screenshot" ? "Screenshot captured from the box desktop." : "Computer action ran on the box desktop."
  ];
  if (success.screenshotPath != null && success.screenshotPath.length > 0) {
    lines2.push(
      operation === "screenshot" ? `Screenshot saved to ${success.screenshotPath} \u2014 attach this file:// path with SendToUser to show the user the box.` : `Screenshot of the resulting screen saved to ${success.screenshotPath} \u2014 include this file:// path in your report to the parent if it should be shown to the user.`
    );
  }
  if (success.cursorPosition != null) {
    lines2.push(`Cursor is at (${success.cursorPosition.x}, ${success.cursorPosition.y}).`);
  }
  return lines2.join("\n");
}
function renderComputerResult(output, operation) {
  const summary = describeOutcome(output, operation);
  if (output.result.case === "success" && output.result.value.screenshot != null && output.result.value.screenshot.length > 0) {
    return createImageResult(output.result.value.screenshot, "image/webp", summary);
  }
  return createStringResult(summary, output.result.case === "error");
}
function serializeComputerError(error3, args) {
  const message = error3 instanceof Error ? error3.message : "Unknown error";
  return wrapToolCall(
    new ComputerUseToolCall({
      args,
      result: new ComputerUseResult({
        result: { case: "error", value: new ComputerUseError({ error: message }) }
      })
    })
  );
}
var COMBINED_GUIDANCE = {
  driver: " For web-page interaction, use browser_* tools first. Use Computer only for clearly native UI (desktop applications, OS dialogs, or browser chrome) or after a concrete browser-tool limitation blocks the required step. Do not use Computer screenshot or wait solely to inspect or wait for normal web-page state; use browser_snapshot, browser_take_screenshot, and returned browser state unless the visible desktop, native UI, or browser chrome itself is required.",
  playwright: " For web-page interaction, use the Playwright browser_* tools first: browser_navigate, browser_snapshot, browser_find, browser_click, browser_type, browser_fill_form, browser_select_option, browser_press_key, browser_tabs, and browser_take_screenshot. Use Computer only for clearly native UI (desktop applications, OS dialogs, or browser chrome), for a press-and-hold widget (click with holdDurationMs, since browser_click has no hold), or after a concrete browser-tool limitation blocks the required step. Do not use Computer screenshot or wait solely to inspect or wait for normal web-page state; use browser_snapshot, browser_find, browser_take_screenshot, and the ### Page block of each browser result unless the visible desktop, native UI, or browser chrome itself is required."
};
async function executeAndPersistComputerUse(ctx, resourceAccessor, deps, args) {
  const observation = ctx.get(computerOperationObservationKey);
  if (observation !== void 0) observation.stage = "executor";
  const computerUse = resourceAccessor.get(computerUseExecutorResource);
  const result = await computerUse.execute(ctx, args);
  observation?.executorResult(result);
  if (result.result.case === "success" && result.result.value.screenshot != null && result.result.value.screenshot.length > 0) {
    if (observation !== void 0) observation.stage = "persistence";
    const bytes = Buffer.from(result.result.value.screenshot, "base64");
    const persistImage = deps.getPersistImage();
    const saved = await persistImage?.(bytes, "image/webp");
    if (saved != null) {
      result.result.value.screenshotPath = saved.fileUrl;
    }
    result.result.value.screenshot = (await shrinkImageForModel(ctx, bytes, {
      mimeType: "image/webp",
      source: "sand_computer_screenshot"
    })).data;
    if (observation !== void 0) observation.stage = "result";
  }
  return result;
}
function createScreenshotArgs(toolCallId) {
  return new ComputerUseArgs({
    toolCallId,
    actions: [toAction({ action: "screenshot" })]
  });
}
async function captureComputerDisplayStateIdentity(ctx, resourceAccessor, toolCallId, resolveDisplayNumber) {
  let displayNumber;
  try {
    displayNumber = await resolveDisplayNumber(ctx);
  } catch {
    throw new SandComputerAutoReviewBlockedError(
      "Computer Auto-review could not identify this agent's own display; retry once the box desktop is ready.",
      "display_unavailable"
    );
  }
  if (displayNumber === void 0) {
    throw new SandComputerAutoReviewBlockedError(
      SAND_BOX_NO_MONITOR_AVAILABLE_MESSAGE,
      "display_unavailable"
    );
  }
  let result;
  try {
    result = await resourceAccessor.get(shellExecutorResource).execute(
      ctx,
      buildHostShellArgs({
        command: navigationProbeCommand(displayNumber),
        name: "curl",
        workingDirectory: "/workspace",
        toolCallId: `${toolCallId}:auto-review-state`
      })
    );
  } catch {
    throw new SandComputerAutoReviewBlockedError(
      "Computer Auto-review could not capture the current page state.",
      "state_capture_failed"
    );
  }
  const probe = classifyNavigationProbeResult(result, ctx.signal.aborted);
  switch (probe.kind) {
    case "pages":
      return computeSandComputerPageStateIdentity(probe.stdout);
    case "chrome-unreachable":
      return SAND_COMPUTER_PAGE_STATE_CHROME_UNREACHABLE;
    case "capture-failed":
      throw new SandComputerAutoReviewBlockedError(
        "Computer Auto-review could not capture the current page state.",
        "state_capture_failed"
      );
  }
}
function createScreenshotTool(resourceAccessor, deps) {
  const tool = createZodAgentTool("OPENAI_COMPUTER_USE", {
    name: "Screenshot",
    descriptionGenerator: () => "Capture the current box desktop screen without interacting with it. This tool is read-only. To click, type, scroll, wait, or otherwise drive the desktop, delegate the task to a computerUse subagent. The screenshot is saved to disk; attach that file:// path with SendToUser to show the user.",
    parameters: screenshotParameters,
    execute: withSafeParsedArgs(
      screenshotParameters,
      async (ctx, interactionHandler, _rawArgs, meta) => {
        ctx.get(computerOperationObservationKey)?.admitted(["screenshot"]);
        const args = createScreenshotArgs(meta.toolCallId);
        return await interactionHandler.executeToolCall(
          ctx,
          wrapToolCall(new ComputerUseToolCall({ args })),
          meta.toolCallId,
          () => executeAndPersistComputerUse(ctx, resourceAccessor, deps, args),
          (result) => wrapToolCall(new ComputerUseToolCall({ args, result }))
        );
      },
      wrapToolCall(new ComputerUseToolCall()),
      { emitInitialPartialToolCall: false }
    ),
    render: async (_ctx, output) => renderComputerResult(output, "screenshot"),
    serializeError: (error3) => serializeComputerError(error3, createScreenshotArgs())
  });
  return observeComputerTool(tool, "Screenshot", deps);
}
function createComputerTool(resourceAccessor, deps) {
  const parameters2 = buildComputerParameters(deps.autoReview);
  const tool = createZodAgentTool("OPENAI_COMPUTER_USE", {
    name: "Computer",
    descriptionGenerator: () => {
      const combinedGuidance = deps.getCombinedMode?.() === true ? COMBINED_GUIDANCE[deps.getBrowserSurface?.() ?? "driver"] : "";
      return `Control your isolated box's desktop by screenshot, click, move, drag, type, key, scroll, and wait.${combinedGuidance} ${displaySpaceSentence()} Use drag for scrollbars, sliders, moving windows, drag-selecting content, and revealing or repositioning offscreen UI. Shell runs in the same box: Shell for commands and files, Computer for the screen. Every call returns a screenshot of the resulting screen saved to disk; include that file:// path in your report to the parent when it should be shown to the user. ${batchingSentence(deps.autoReview)}`;
    },
    parameters: parameters2,
    execute: withSafeParsedArgs(
      parameters2,
      async (ctx, interactionHandler, rawArgs, meta) => {
        const { then, ...primary } = rawArgs;
        const sequence = [primary, ...then ?? []];
        const observation = ctx.get(computerOperationObservationKey);
        observation?.admitted(sequence.map((action) => action.action));
        const actions = sequence.flatMap(toActions);
        if (sequence.at(-1)?.action !== "screenshot") {
          actions.push(toAction({ action: "screenshot" }));
        }
        const description9 = rawArgs.description?.trim();
        const args = new ComputerUseArgs({
          toolCallId: meta.toolCallId,
          actions,
          ...deps.isUnicodeTypingEnabled?.() === true ? { bindUnmappedCharacters: true } : {},
          ...description9 !== void 0 && description9.length > 0 ? { description: description9 } : {}
        });
        return await interactionHandler.executeToolCall(
          ctx,
          wrapToolCall(new ComputerUseToolCall({ args })),
          meta.toolCallId,
          async () => {
            if (deps.autoReview !== void 0) {
              if (observation !== void 0) observation.stage = "auto_review";
              const { resolveDisplayNumber, ...autoReviewOptions } = deps.autoReview;
              await runSandComputerAutoReviewPreflight({
                ctx,
                resourceAccessor,
                options: {
                  ...autoReviewOptions,
                  captureDisplayStateIdentity: async (stateCtx, stateToolCallId) => await captureComputerDisplayStateIdentity(
                    stateCtx,
                    resourceAccessor,
                    stateToolCallId,
                    resolveDisplayNumber
                  )
                },
                exactAction: toExactActionArgs(rawArgs),
                description: rawArgs.description,
                toolCallId: meta.toolCallId,
                stateHandler: meta.stateHandler,
                workspacePaths: meta.workspacePaths,
                signal: interactionHandler.getAbortSignal(ctx)
              });
            }
            if (observation !== void 0) observation.stage = "action_notification";
            reportComputerAction(deps.onComputerAction, sequence);
            return await executeAndPersistComputerUse(ctx, resourceAccessor, deps, args);
          },
          (result) => wrapToolCall(new ComputerUseToolCall({ args, result }))
        );
      },
      wrapToolCall(new ComputerUseToolCall()),
      { emitInitialPartialToolCall: false }
    ),
    render: async (_ctx, output) => renderComputerResult(output, "computer"),
    serializeError: serializeComputerError
  });
  return observeComputerTool(tool, "Computer", deps);
}
function observeComputerTool(tool, name17, deps) {
  return {
    ...tool,
    execute: (ctx, interactionHandler, argsStream, meta) => {
      const observation = new ComputerOperationObservation({
        ...deps,
        ctx,
        signal: interactionHandler.getAbortSignal(ctx),
        tool: name17,
        toolCallId: meta.toolCallId,
        invocationId: interactionHandler.invocationId
      });
      return observation.run(
        () => tool.execute(
          ctx.with(computerOperationObservationKey, observation),
          interactionHandler,
          argsStream,
          meta
        )
      );
    }
  };
}

