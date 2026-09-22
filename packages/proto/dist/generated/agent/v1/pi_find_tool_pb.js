/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_find_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage79, __protoMessage376, PiFindToolCall, PiFindToolArgs, PiFindToolResult, PiFindToolSuccess, PiFindToolError;
var init_pi_find_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_find_tool_pb.js"() {
    "use strict";
    init_esm();
    init_pi_common_pb();
    init_compact();
    __protoPackage79 = "agent.v1.";
    __protoMessage376 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage79;
      }
    };
    PiFindToolCall = class _PiFindToolCall extends __protoMessage376 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiFindToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiFindToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiFindToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiFindToolCall, a, b2);
      }
      static $() {
        return ["PiFindToolCall|1 args #0|2 result #1", PiFindToolArgs, PiFindToolResult];
      }
    };
    PiFindToolArgs = class _PiFindToolArgs extends __protoMessage376 {
      constructor(data) {
        super();
        this.pattern = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiFindToolArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiFindToolArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiFindToolArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiFindToolArgs, a, b2);
      }
      static $() {
        return ["PiFindToolArgs|1 pattern 9|2 path 9?|3 limit 5?"];
      }
    };
    PiFindToolResult = class _PiFindToolResult extends __protoMessage376 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiFindToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiFindToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiFindToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiFindToolResult, a, b2);
      }
      static $() {
        return ["PiFindToolResult|1 success #0 result|2 error #1 result", PiFindToolSuccess, PiFindToolError];
      }
    };
    PiFindToolSuccess = class _PiFindToolSuccess extends __protoMessage376 {
      constructor(data) {
        super();
        this.output = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiFindToolSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiFindToolSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiFindToolSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiFindToolSuccess, a, b2);
      }
      static $() {
        return ["PiFindToolSuccess|1 output 9|2 truncation #0?|3 result_limit_reached 13?", PiTruncation];
      }
    };
    PiFindToolError = class _PiFindToolError extends __protoMessage376 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiFindToolError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiFindToolError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiFindToolError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiFindToolError, a, b2);
      }
      static $() {
        return ["PiFindToolError|1 error 9"];
      }
    };
  }
});

