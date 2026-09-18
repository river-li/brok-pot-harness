var __protoPackage77, __protoMessage374, PiWriteToolCall, PiWriteToolArgs, PiWriteToolResult, PiWriteToolSuccess, PiWriteToolError, PiWriteToolRejected;
var init_pi_write_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_write_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage77 = "agent.v1.";
    __protoMessage374 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage77;
      }
    };
    PiWriteToolCall = class _PiWriteToolCall extends __protoMessage374 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteToolCall, a, b2);
      }
      static $() {
        return ["PiWriteToolCall|1 args #0|2 result #1", PiWriteToolArgs, PiWriteToolResult];
      }
    };
    PiWriteToolArgs = class _PiWriteToolArgs extends __protoMessage374 {
      constructor(data) {
        super();
        this.path = "";
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteToolArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteToolArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteToolArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteToolArgs, a, b2);
      }
      static $() {
        return ["PiWriteToolArgs|1 path 9|2 content 9"];
      }
    };
    PiWriteToolResult = class _PiWriteToolResult extends __protoMessage374 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteToolResult, a, b2);
      }
      static $() {
        return ["PiWriteToolResult|1 success #0 result|2 error #1 result|3 rejected #2 result", PiWriteToolSuccess, PiWriteToolError, PiWriteToolRejected];
      }
    };
    PiWriteToolSuccess = class _PiWriteToolSuccess extends __protoMessage374 {
      constructor(data) {
        super();
        this.output = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteToolSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteToolSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteToolSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteToolSuccess, a, b2);
      }
      static $() {
        return ["PiWriteToolSuccess|1 output 9"];
      }
    };
    PiWriteToolError = class _PiWriteToolError extends __protoMessage374 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteToolError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteToolError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteToolError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteToolError, a, b2);
      }
      static $() {
        return ["PiWriteToolError|1 error 9"];
      }
    };
    PiWriteToolRejected = class _PiWriteToolRejected extends __protoMessage374 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiWriteToolRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiWriteToolRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiWriteToolRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiWriteToolRejected, a, b2);
      }
      static $() {
        return ["PiWriteToolRejected|1 reason 9"];
      }
    };
  }
});
