var __protoPackage81, __protoMessage377, PiLsToolCall, PiLsToolArgs, PiLsToolResult, PiLsToolSuccess, PiLsToolError;
var init_pi_ls_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_ls_tool_pb.js"() {
    "use strict";
    init_esm();
    init_pi_common_pb();
    init_compact();
    __protoPackage81 = "agent.v1.";
    __protoMessage377 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage81;
      }
    };
    PiLsToolCall = class _PiLsToolCall extends __protoMessage377 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiLsToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiLsToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiLsToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiLsToolCall, a, b2);
      }
      static $() {
        return ["PiLsToolCall|1 args #0|2 result #1", PiLsToolArgs, PiLsToolResult];
      }
    };
    PiLsToolArgs = class _PiLsToolArgs extends __protoMessage377 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiLsToolArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiLsToolArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiLsToolArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiLsToolArgs, a, b2);
      }
      static $() {
        return ["PiLsToolArgs|1 path 9?|2 limit 5?"];
      }
    };
    PiLsToolResult = class _PiLsToolResult extends __protoMessage377 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiLsToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiLsToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiLsToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiLsToolResult, a, b2);
      }
      static $() {
        return ["PiLsToolResult|1 success #0 result|2 error #1 result", PiLsToolSuccess, PiLsToolError];
      }
    };
    PiLsToolSuccess = class _PiLsToolSuccess extends __protoMessage377 {
      constructor(data) {
        super();
        this.output = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiLsToolSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiLsToolSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiLsToolSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiLsToolSuccess, a, b2);
      }
      static $() {
        return ["PiLsToolSuccess|1 output 9|2 truncation #0?|3 entry_limit_reached 13?", PiTruncation];
      }
    };
    PiLsToolError = class _PiLsToolError extends __protoMessage377 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiLsToolError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiLsToolError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiLsToolError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiLsToolError, a, b2);
      }
      static $() {
        return ["PiLsToolError|1 error 9"];
      }
    };
  }
});
