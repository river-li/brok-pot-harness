/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/cloud-agents/computer-use/observation.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function trackComputerUseExecution(ctx, args) {
  const requested = summarizeComputerUseActions(args.input.actions);
  const { result } = args.output;
  if (result.case !== "success" && result.case !== "error") {
    return;
  }
  const value = result.value;
  getAgentEventTracker(ctx).trackComputerUseExecution(ctx, {
    provider: args.provider,
    toolCallId: args.input.toolCallId,
    requestedActionCount: requested.actionCount,
    executedActionCount: result.case === "success" ? value.actionCount : void 0,
    mouseMoveCount: requested.actionCounts.mouse_move,
    clickCount: requested.actionCounts.click,
    mouseDownCount: requested.actionCounts.mouse_down,
    mouseUpCount: requested.actionCounts.mouse_up,
    dragCount: requested.actionCounts.drag,
    scrollCount: requested.actionCounts.scroll,
    typeCount: requested.actionCounts.type,
    keyCount: requested.actionCounts.key,
    waitCount: requested.actionCounts.wait,
    screenshotCount: requested.actionCounts.screenshot,
    cursorPositionCount: requested.actionCounts.cursor_position,
    outcome: result.case,
    durationMs: args.durationMs,
    screenshotProduced: result.case === "success" && value.screenshot !== void 0 && value.screenshot.length > 0,
    screenshotSavedToTemp: result.case === "success" && value.screenshotPath !== void 0 && value.screenshotPath.length > 0,
    diagnosticScreenshotProduced: result.case === "error" && value.screenshot !== void 0 && value.screenshot.length > 0,
    diagnosticScreenshotSavedToTemp: result.case === "error" && value.screenshotPath !== void 0 && value.screenshotPath.length > 0,
    requestId: getRequestId(ctx),
    parentRequestId: getParentRequestId(ctx),
    rootParentRequestId: getRootParentRequestId(ctx),
    conversationId: getConversationId(ctx),
    requestModelName: ctx.get(requestModelNameKey),
    isSubagent: getIsSubagentFromContext(ctx)
  });
}
function trackComputerUseFailure(ctx, args) {
  const requested = summarizeComputerUseActions(args.input.actions);
  getAgentEventTracker(ctx).trackComputerUseExecution(ctx, {
    provider: args.provider,
    toolCallId: args.input.toolCallId,
    requestedActionCount: requested.actionCount,
    mouseMoveCount: requested.actionCounts.mouse_move,
    clickCount: requested.actionCounts.click,
    mouseDownCount: requested.actionCounts.mouse_down,
    mouseUpCount: requested.actionCounts.mouse_up,
    dragCount: requested.actionCounts.drag,
    scrollCount: requested.actionCounts.scroll,
    typeCount: requested.actionCounts.type,
    keyCount: requested.actionCounts.key,
    waitCount: requested.actionCounts.wait,
    screenshotCount: requested.actionCounts.screenshot,
    cursorPositionCount: requested.actionCounts.cursor_position,
    outcome: "error",
    durationMs: args.durationMs,
    screenshotProduced: false,
    screenshotSavedToTemp: false,
    diagnosticScreenshotProduced: false,
    diagnosticScreenshotSavedToTemp: false,
    requestId: getRequestId(ctx),
    parentRequestId: getParentRequestId(ctx),
    rootParentRequestId: getRootParentRequestId(ctx),
    conversationId: getConversationId(ctx),
    requestModelName: ctx.get(requestModelNameKey),
    isSubagent: getIsSubagentFromContext(ctx)
  });
}

