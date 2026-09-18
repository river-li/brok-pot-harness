var __protoPackage40, __protoMessage340, MouseButton, ScrollDirection, Coordinate, ComputerUseArgs, ComputerUseAction, MouseMoveAction, ClickAction, MouseDownAction, MouseUpAction, DragAction, ScrollAction, TypeAction, KeyAction, WaitAction, ScreenshotAction, CursorPositionAction, ComputerUseResult, ComputerUseSuccess, ComputerUseError, ComputerUseToolCall;
var init_computer_use_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/computer_use_tool_pb.js"() {
    "use strict";
    init_esm13();
    init_compact();
    __protoPackage40 = "agent.v1.";
    __protoMessage340 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage40;
      }
    };
    MouseButton = /* @__PURE__ */ enumType2(proto3, __protoPackage40, "MouseButton", [[0, "UNSPECIFIED"], [1, "LEFT"], [2, "RIGHT"], [3, "MIDDLE"], [4, "BACK"], [5, "FORWARD"]], 1);
    ScrollDirection = /* @__PURE__ */ enumType2(proto3, __protoPackage40, "ScrollDirection", [[0, "UNSPECIFIED"], [1, "UP"], [2, "DOWN"], [3, "LEFT"], [4, "RIGHT"]], 1);
    Coordinate = class _Coordinate extends __protoMessage340 {
      constructor(data) {
        super();
        this.x = 0;
        this.y = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Coordinate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Coordinate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Coordinate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Coordinate, a, b2);
      }
      static $() {
        return ["Coordinate|1 x 5|2 y 5"];
      }
    };
    ComputerUseArgs = class _ComputerUseArgs extends __protoMessage340 {
      constructor(data) {
        super();
        this.toolCallId = "";
        this.actions = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputerUseArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputerUseArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputerUseArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputerUseArgs, a, b2);
      }
      static $() {
        return ["ComputerUseArgs|1 tool_call_id 9|2 actions #0*|3 description 9?|4 bind_unmapped_characters 8?|5 desktop_lease_actor_id 9?", ComputerUseAction];
      }
    };
    ComputerUseAction = class _ComputerUseAction extends __protoMessage340 {
      constructor(data) {
        super();
        this.action = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputerUseAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputerUseAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputerUseAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputerUseAction, a, b2);
      }
      static $() {
        return ["ComputerUseAction|1 mouse_move #0 action|2 click #1 action|3 mouse_down #2 action|4 mouse_up #3 action|5 drag #4 action|6 scroll #5 action|7 type #6 action|8 key #7 action|9 wait #8 action|10 screenshot #9 action|11 cursor_position #10 action", MouseMoveAction, ClickAction, MouseDownAction, MouseUpAction, DragAction, ScrollAction, TypeAction, KeyAction, WaitAction, ScreenshotAction, CursorPositionAction];
      }
    };
    MouseMoveAction = class _MouseMoveAction extends __protoMessage340 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MouseMoveAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MouseMoveAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MouseMoveAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MouseMoveAction, a, b2);
      }
      static $() {
        return ["MouseMoveAction|1 coordinate #0", Coordinate];
      }
    };
    ClickAction = class _ClickAction extends __protoMessage340 {
      constructor(data) {
        super();
        this.button = MouseButton.UNSPECIFIED;
        this.count = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ClickAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ClickAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ClickAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ClickAction, a, b2);
      }
      static $() {
        return ["ClickAction|1 coordinate #0?|2 button #1|3 count 5|4 modifier_keys 9?", Coordinate, MouseButton];
      }
    };
    MouseDownAction = class _MouseDownAction extends __protoMessage340 {
      constructor(data) {
        super();
        this.button = MouseButton.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MouseDownAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MouseDownAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MouseDownAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MouseDownAction, a, b2);
      }
      static $() {
        return ["MouseDownAction|1 button #0", MouseButton];
      }
    };
    MouseUpAction = class _MouseUpAction extends __protoMessage340 {
      constructor(data) {
        super();
        this.button = MouseButton.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MouseUpAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MouseUpAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MouseUpAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MouseUpAction, a, b2);
      }
      static $() {
        return ["MouseUpAction|1 button #0", MouseButton];
      }
    };
    DragAction = class _DragAction extends __protoMessage340 {
      constructor(data) {
        super();
        this.path = [];
        this.button = MouseButton.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DragAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DragAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DragAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DragAction, a, b2);
      }
      static $() {
        return ["DragAction|1 path #0*|2 button #1|3 modifier_keys 9?", Coordinate, MouseButton];
      }
    };
    ScrollAction = class _ScrollAction extends __protoMessage340 {
      constructor(data) {
        super();
        this.direction = ScrollDirection.UNSPECIFIED;
        this.amount = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ScrollAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ScrollAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ScrollAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ScrollAction, a, b2);
      }
      static $() {
        return ["ScrollAction|1 coordinate #0?|2 direction #1|3 amount 5|4 modifier_keys 9?", Coordinate, ScrollDirection];
      }
    };
    TypeAction = class _TypeAction extends __protoMessage340 {
      constructor(data) {
        super();
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TypeAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TypeAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TypeAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TypeAction, a, b2);
      }
      static $() {
        return ["TypeAction|1 text 9"];
      }
    };
    KeyAction = class _KeyAction extends __protoMessage340 {
      constructor(data) {
        super();
        this.key = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _KeyAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _KeyAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _KeyAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_KeyAction, a, b2);
      }
      static $() {
        return ["KeyAction|1 key 9|2 hold_duration_ms 5?"];
      }
    };
    WaitAction = class _WaitAction extends __protoMessage340 {
      constructor(data) {
        super();
        this.durationMs = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WaitAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WaitAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WaitAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WaitAction, a, b2);
      }
      static $() {
        return ["WaitAction|1 duration_ms 5"];
      }
    };
    ScreenshotAction = class _ScreenshotAction extends __protoMessage340 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ScreenshotAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ScreenshotAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ScreenshotAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ScreenshotAction, a, b2);
      }
      static $() {
        return ["ScreenshotAction"];
      }
    };
    CursorPositionAction = class _CursorPositionAction extends __protoMessage340 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CursorPositionAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CursorPositionAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CursorPositionAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CursorPositionAction, a, b2);
      }
      static $() {
        return ["CursorPositionAction"];
      }
    };
    ComputerUseResult = class _ComputerUseResult extends __protoMessage340 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputerUseResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputerUseResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputerUseResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputerUseResult, a, b2);
      }
      static $() {
        return ["ComputerUseResult|1 success #0 result|2 error #1 result", ComputerUseSuccess, ComputerUseError];
      }
    };
    ComputerUseSuccess = class _ComputerUseSuccess extends __protoMessage340 {
      constructor(data) {
        super();
        this.actionCount = 0;
        this.durationMs = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputerUseSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputerUseSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputerUseSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputerUseSuccess, a, b2);
      }
      static $() {
        return ["ComputerUseSuccess|1 action_count 5|2 duration_ms 5|3 screenshot 9?|4 log 9?|5 screenshot_path 9?|6 cursor_position #0?", Coordinate];
      }
    };
    ComputerUseError = class _ComputerUseError extends __protoMessage340 {
      constructor(data) {
        super();
        this.error = "";
        this.actionCount = 0;
        this.durationMs = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputerUseError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputerUseError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputerUseError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputerUseError, a, b2);
      }
      static $() {
        return ["ComputerUseError|1 error 9|2 action_count 5|3 duration_ms 5|4 log 9?|5 screenshot 9?|6 screenshot_path 9?"];
      }
    };
    ComputerUseToolCall = class _ComputerUseToolCall extends __protoMessage340 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputerUseToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputerUseToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputerUseToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputerUseToolCall, a, b2);
      }
      static $() {
        return ["ComputerUseToolCall|1 args #0|2 result #1", ComputerUseArgs, ComputerUseResult];
      }
    };
  }
});
