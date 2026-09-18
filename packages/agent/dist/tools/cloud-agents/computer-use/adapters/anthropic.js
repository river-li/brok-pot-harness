init_computer_use_tool_pb();
function mapScrollDirection(direction) {
  switch (direction) {
    case "up":
      return ScrollDirection.UP;
    case "down":
      return ScrollDirection.DOWN;
    case "left":
      return ScrollDirection.LEFT;
    case "right":
      return ScrollDirection.RIGHT;
    default: {
      const _exhaustive = direction;
      throw new Error(`Unknown scroll direction: ${_exhaustive}`);
    }
  }
}
function makeCoordinate(tuple2) {
  if (tuple2 === void 0) {
    return void 0;
  }
  return new Coordinate({ x: tuple2[0], y: tuple2[1] });
}
var AnthropicAdapter = class {
  constructor() {
    this.providerId = "anthropic";
  }
  parseAction(input, _config) {
    const {
      action,
      coordinate: coordinate2,
      text: text2,
      // Per Python ref: key/type/hold_key actions + scroll modifiers
      key,
      // Per Python ref: click modifiers. Claude sometimes mistakenly uses for key action
      scroll_direction,
      scroll_amount,
      duration: duration3,
      start_coordinate
    } = input;
    switch (action) {
      case "screenshot":
        return [
          new ComputerUseAction({
            action: { case: "screenshot", value: new ScreenshotAction({}) }
          })
        ];
      case "left_click":
        return [
          new ComputerUseAction({
            action: {
              case: "click",
              value: new ClickAction({
                coordinate: makeCoordinate(coordinate2),
                button: MouseButton.LEFT,
                count: 1,
                modifierKeys: key
                // Per Python ref: `key` holds modifier keys for clicks
              })
            }
          })
        ];
      case "right_click":
        return [
          new ComputerUseAction({
            action: {
              case: "click",
              value: new ClickAction({
                coordinate: makeCoordinate(coordinate2),
                button: MouseButton.RIGHT,
                count: 1,
                modifierKeys: key
              })
            }
          })
        ];
      case "middle_click":
        return [
          new ComputerUseAction({
            action: {
              case: "click",
              value: new ClickAction({
                coordinate: makeCoordinate(coordinate2),
                button: MouseButton.MIDDLE,
                count: 1,
                modifierKeys: key
              })
            }
          })
        ];
      case "double_click":
        return [
          new ComputerUseAction({
            action: {
              case: "click",
              value: new ClickAction({
                coordinate: makeCoordinate(coordinate2),
                button: MouseButton.LEFT,
                count: 2,
                modifierKeys: key
              })
            }
          })
        ];
      case "triple_click":
        return [
          new ComputerUseAction({
            action: {
              case: "click",
              value: new ClickAction({
                coordinate: makeCoordinate(coordinate2),
                button: MouseButton.LEFT,
                count: 3,
                modifierKeys: key
              })
            }
          })
        ];
      case "type": {
        if (text2 === void 0) {
          throw new Error("type action requires text");
        }
        return [
          new ComputerUseAction({
            action: {
              case: "type",
              value: new TypeAction({ text: text2 })
            }
          })
        ];
      }
      case "key": {
        const keyToPress = text2 ?? key;
        if (keyToPress === void 0) {
          throw new Error("key action requires text");
        }
        return [
          new ComputerUseAction({
            action: {
              case: "key",
              value: new KeyAction({ key: keyToPress })
            }
          })
        ];
      }
      case "hold_key": {
        const keyToHold = text2 ?? key;
        if (keyToHold === void 0) {
          throw new Error("hold_key action requires text");
        }
        if (duration3 === void 0) {
          throw new Error("hold_key action requires duration");
        }
        if (duration3 < 0) {
          throw new Error("hold_key duration must be non-negative");
        }
        if (duration3 > 100) {
          throw new Error("hold_key duration too long (max 100 seconds)");
        }
        const holdTimeMs = duration3 * 1e3;
        return [
          new ComputerUseAction({
            action: {
              case: "key",
              value: new KeyAction({
                key: keyToHold,
                holdDurationMs: holdTimeMs
              })
            }
          })
        ];
      }
      case "scroll": {
        if (scroll_direction === void 0) {
          throw new Error("scroll action requires scroll_direction");
        }
        if (scroll_amount === void 0) {
          throw new Error("scroll action requires scroll_amount");
        }
        const amount = Math.round(scroll_amount);
        if (!Number.isFinite(amount) || amount < 1) {
          throw new Error(`scroll_amount must be a whole number >= 1, got ${scroll_amount}`);
        }
        return [
          new ComputerUseAction({
            action: {
              case: "scroll",
              value: new ScrollAction({
                coordinate: makeCoordinate(coordinate2),
                direction: mapScrollDirection(scroll_direction),
                amount,
                modifierKeys: text2
                // Anthropic uses 'text' for modifier keys on scroll
              })
            }
          })
        ];
      }
      case "mouse_move": {
        if (coordinate2 === void 0) {
          throw new Error("mouse_move action requires coordinate");
        }
        return [
          new ComputerUseAction({
            action: {
              case: "mouseMove",
              value: new MouseMoveAction({
                coordinate: new Coordinate({
                  x: coordinate2[0],
                  y: coordinate2[1]
                })
              })
            }
          })
        ];
      }
      case "left_click_drag": {
        if (start_coordinate === void 0) {
          throw new Error("left_click_drag action requires start_coordinate");
        }
        if (coordinate2 === void 0) {
          throw new Error("left_click_drag action requires coordinate");
        }
        return [
          new ComputerUseAction({
            action: {
              case: "drag",
              value: new DragAction({
                path: [
                  new Coordinate({
                    x: start_coordinate[0],
                    y: start_coordinate[1]
                  }),
                  new Coordinate({ x: coordinate2[0], y: coordinate2[1] })
                ],
                button: MouseButton.LEFT
              })
            }
          })
        ];
      }
      case "wait": {
        if (duration3 === void 0) {
          throw new Error("wait action requires duration");
        }
        if (duration3 < 0) {
          throw new Error("wait duration must be non-negative");
        }
        if (duration3 > 100) {
          throw new Error("wait duration too long (max 100 seconds)");
        }
        const waitTimeMs = duration3 * 1e3;
        return [
          new ComputerUseAction({
            action: {
              case: "wait",
              value: new WaitAction({ durationMs: waitTimeMs })
            }
          })
        ];
      }
      case "cursor_position":
        return [
          new ComputerUseAction({
            action: {
              case: "cursorPosition",
              value: new CursorPositionAction({})
            }
          })
        ];
      case "left_mouse_down":
        return [
          new ComputerUseAction({
            action: {
              case: "mouseDown",
              value: new MouseDownAction({ button: MouseButton.LEFT })
            }
          })
        ];
      case "left_mouse_up":
        return [
          new ComputerUseAction({
            action: {
              case: "mouseUp",
              value: new MouseUpAction({ button: MouseButton.LEFT })
            }
          })
        ];
      default: {
        const _exhaustive = action;
        throw new Error(`Unknown Anthropic action: ${_exhaustive}`);
      }
    }
  }
};
var anthropicAdapter = new AnthropicAdapter();
