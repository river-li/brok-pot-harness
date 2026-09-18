var COMPUTER_USE_ACTION_KINDS = [
  "mouse_move",
  "click",
  "mouse_down",
  "mouse_up",
  "drag",
  "scroll",
  "type",
  "key",
  "wait",
  "screenshot",
  "cursor_position"
];
function summarizeComputerUseActions(actions) {
  const actionCounts = {
    mouse_move: 0,
    click: 0,
    mouse_down: 0,
    mouse_up: 0,
    drag: 0,
    scroll: 0,
    type: 0,
    key: 0,
    wait: 0,
    screenshot: 0,
    cursor_position: 0
  };
  for (const action of actions) {
    switch (action.action.case) {
      case "mouseMove":
        actionCounts.mouse_move += 1;
        break;
      case "click":
        actionCounts.click += 1;
        break;
      case "mouseDown":
        actionCounts.mouse_down += 1;
        break;
      case "mouseUp":
        actionCounts.mouse_up += 1;
        break;
      case "drag":
        actionCounts.drag += 1;
        break;
      case "scroll":
        actionCounts.scroll += 1;
        break;
      case "type":
        actionCounts.type += 1;
        break;
      case "key":
        actionCounts.key += 1;
        break;
      case "wait":
        actionCounts.wait += 1;
        break;
      case "screenshot":
        actionCounts.screenshot += 1;
        break;
      case "cursorPosition":
        actionCounts.cursor_position += 1;
        break;
      case void 0:
        break;
    }
  }
  return { actionCount: actions.length, actionCounts };
}
var COMPUTER_USE_SCREENSHOT_SETTLE_DELAY_MS = 2e3;
var computerUseExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("computerUseArgs"), createClientDeserializer("computerUseResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("computerUseArgs"), createClientSerializer("computerUseResult")));
});
