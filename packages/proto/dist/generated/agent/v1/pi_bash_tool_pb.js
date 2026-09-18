var __protoPackage75, __protoMessage372, PiBashToolCall, PiBashToolArgs, PiBashToolResult, PiBashToolSuccess, PiBashToolError;
var init_pi_bash_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_bash_tool_pb.js"() {
    "use strict";
    init_esm();
    init_pi_common_pb();
    init_compact();
    __protoPackage75 = "agent.v1.";
    __protoMessage372 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage75;
      }
    };
    PiBashToolCall = class _PiBashToolCall extends __protoMessage372 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiBashToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiBashToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiBashToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiBashToolCall, a, b2);
      }
      static $() {
        return ["PiBashToolCall|1 args #0|2 result #1", PiBashToolArgs, PiBashToolResult];
      }
    };
    PiBashToolArgs = class _PiBashToolArgs extends __protoMessage372 {
      constructor(data) {
        super();
        this.command = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiBashToolArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiBashToolArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiBashToolArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiBashToolArgs, a, b2);
      }
      static $() {
        return ["PiBashToolArgs|1 command 9|2 timeout 1?"];
      }
    };
    PiBashToolResult = class _PiBashToolResult extends __protoMessage372 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiBashToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiBashToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiBashToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiBashToolResult, a, b2);
      }
      static $() {
        return ["PiBashToolResult|1 success #0 result|2 error #1 result", PiBashToolSuccess, PiBashToolError];
      }
    };
    PiBashToolSuccess = class _PiBashToolSuccess extends __protoMessage372 {
      constructor(data) {
        super();
        this.output = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiBashToolSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiBashToolSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiBashToolSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiBashToolSuccess, a, b2);
      }
      static $() {
        return ["PiBashToolSuccess|1 output 9|2 truncation #0?|3 full_output_path 9?", PiTruncation];
      }
    };
    PiBashToolError = class _PiBashToolError extends __protoMessage372 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiBashToolError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiBashToolError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiBashToolError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiBashToolError, a, b2);
      }
      static $() {
        return ["PiBashToolError|1 error 9|2 truncation #0?|3 full_output_path 9?", PiTruncation];
      }
    };
  }
});
