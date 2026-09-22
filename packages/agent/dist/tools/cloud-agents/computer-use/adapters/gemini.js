/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/cloud-agents/computer-use/adapters/gemini.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_computer_use_tool_pb();
function mapScrollDirection2(direction) {
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
function denormalize(normalized, maxPixels) {
  return Math.round(normalized / 1e3 * maxPixels);
}
var GeminiAdapter = class {
  constructor() {
    this.providerId = "gemini";
  }
  makeCoordinate(x, y, config2) {
    return new Coordinate({
      x: denormalize(x, config2.displayWidth),
      y: denormalize(y, config2.displayHeight)
    });
  }
  parseAction(input, config2) {
    const { name: name17, args } = input;
    switch (name17) {
      case "click_at": {
        if (args.x === void 0 || args.y === void 0) {
          throw new Error("click_at requires x and y");
        }
        return [
          new ComputerUseAction({
            action: {
              case: "click",
              value: new ClickAction({
                coordinate: this.makeCoordinate(args.x, args.y, config2),
                button: MouseButton.LEFT,
                count: 1
              })
            }
          })
        ];
      }
      case "double_click": {
        if (args.x === void 0 || args.y === void 0) {
          throw new Error("double_click requires x and y");
        }
        return [
          new ComputerUseAction({
            action: {
              case: "click",
              value: new ClickAction({
                coordinate: this.makeCoordinate(args.x, args.y, config2),
                button: MouseButton.LEFT,
                count: 2
              })
            }
          })
        ];
      }
      case "hover_at": {
        if (args.x === void 0 || args.y === void 0) {
          throw new Error("hover_at requires x and y");
        }
        return [
          new ComputerUseAction({
            action: {
              case: "mouseMove",
              value: new MouseMoveAction({
                coordinate: this.makeCoordinate(args.x, args.y, config2)
              })
            }
          })
        ];
      }
      case "type_text_at": {
        if (args.x === void 0 || args.y === void 0) {
          throw new Error("type_text_at requires x and y");
        }
        if (args.text === void 0) {
          throw new Error("type_text_at requires text");
        }
        const actions = [];
        actions.push(new ComputerUseAction({
          action: {
            case: "click",
            value: new ClickAction({
              coordinate: this.makeCoordinate(args.x, args.y, config2),
              button: MouseButton.LEFT,
              count: 1
            })
          }
        }));
        if (args.clear_before_typing !== false) {
          actions.push(new ComputerUseAction({
            action: {
              case: "key",
              value: new KeyAction({ key: "ctrl+a" })
            }
          }));
          actions.push(new ComputerUseAction({
            action: {
              case: "key",
              value: new KeyAction({ key: "BackSpace" })
            }
          }));
        }
        actions.push(new ComputerUseAction({
          action: {
            case: "type",
            value: new TypeAction({ text: args.text })
          }
        }));
        if (args.press_enter !== false) {
          actions.push(new ComputerUseAction({
            action: {
              case: "key",
              value: new KeyAction({ key: "Return" })
            }
          }));
        }
        return actions;
      }
      case "key_combination": {
        if (args.keys === void 0) {
          throw new Error("key_combination requires keys");
        }
        return [
          new ComputerUseAction({
            action: {
              case: "key",
              value: new KeyAction({ key: args.keys })
            }
          })
        ];
      }
      case "scroll_at": {
        if (args.x === void 0 || args.y === void 0) {
          throw new Error("scroll_at requires x and y");
        }
        if (args.direction === void 0) {
          throw new Error("scroll_at requires direction");
        }
        const normalizedMagnitude = args.magnitude ?? 800;
        const isVertical = args.direction === "up" || args.direction === "down";
        const denormalizedMagnitude = denormalize(normalizedMagnitude, isVertical ? config2.displayHeight : config2.displayWidth);
        const amount = Math.max(1, Math.round(denormalizedMagnitude / 100));
        return [
          new ComputerUseAction({
            action: {
              case: "scroll",
              value: new ScrollAction({
                coordinate: this.makeCoordinate(args.x, args.y, config2),
                direction: mapScrollDirection2(args.direction),
                amount
              })
            }
          })
        ];
      }
      case "scroll_document": {
        if (args.direction === void 0) {
          throw new Error("scroll_document requires direction");
        }
        const normalizedMagnitude = args.magnitude ?? 800;
        const isVertical = args.direction === "up" || args.direction === "down";
        const denormalizedMagnitude = denormalize(normalizedMagnitude, isVertical ? config2.displayHeight : config2.displayWidth);
        const amount = Math.max(1, Math.round(denormalizedMagnitude / 100));
        return [
          new ComputerUseAction({
            action: {
              case: "scroll",
              value: new ScrollAction({
                direction: mapScrollDirection2(args.direction),
                amount
              })
            }
          })
        ];
      }
      case "drag_and_drop": {
        if (args.x === void 0 || args.y === void 0) {
          throw new Error("drag_and_drop requires x and y");
        }
        if (args.destination_x === void 0 || args.destination_y === void 0) {
          throw new Error("drag_and_drop requires destination_x and destination_y");
        }
        return [
          new ComputerUseAction({
            action: {
              case: "drag",
              value: new DragAction({
                path: [
                  this.makeCoordinate(args.x, args.y, config2),
                  this.makeCoordinate(args.destination_x, args.destination_y, config2)
                ],
                button: MouseButton.LEFT
              })
            }
          })
        ];
      }
      case "wait_5_seconds":
        return [
          new ComputerUseAction({
            action: {
              case: "wait",
              value: new WaitAction({ durationMs: 5e3 })
            }
          })
        ];
      default: {
        const _exhaustive = name17;
        throw new Error(`Unknown Gemini action: ${_exhaustive}`);
      }
    }
  }
};
var geminiAdapter = new GeminiAdapter();

