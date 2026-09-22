/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_grep_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage78, __protoMessage375, PiGrepToolCall, PiGrepToolArgs, PiGrepToolResult, PiGrepToolSuccess, PiGrepToolError;
var init_pi_grep_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_grep_tool_pb.js"() {
    "use strict";
    init_esm();
    init_pi_common_pb();
    init_compact();
    __protoPackage78 = "agent.v1.";
    __protoMessage375 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage78;
      }
    };
    PiGrepToolCall = class _PiGrepToolCall extends __protoMessage375 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiGrepToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiGrepToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiGrepToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiGrepToolCall, a, b2);
      }
      static $() {
        return ["PiGrepToolCall|1 args #0|2 result #1", PiGrepToolArgs, PiGrepToolResult];
      }
    };
    PiGrepToolArgs = class _PiGrepToolArgs extends __protoMessage375 {
      constructor(data) {
        super();
        this.pattern = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiGrepToolArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiGrepToolArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiGrepToolArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiGrepToolArgs, a, b2);
      }
      static $() {
        return ["PiGrepToolArgs|1 pattern 9|2 path 9?|3 glob 9?|4 ignore_case 8?|5 literal 8?|6 context 5?|7 limit 5?"];
      }
    };
    PiGrepToolResult = class _PiGrepToolResult extends __protoMessage375 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiGrepToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiGrepToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiGrepToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiGrepToolResult, a, b2);
      }
      static $() {
        return ["PiGrepToolResult|1 success #0 result|2 error #1 result", PiGrepToolSuccess, PiGrepToolError];
      }
    };
    PiGrepToolSuccess = class _PiGrepToolSuccess extends __protoMessage375 {
      constructor(data) {
        super();
        this.output = "";
        this.linesTruncated = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiGrepToolSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiGrepToolSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiGrepToolSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiGrepToolSuccess, a, b2);
      }
      static $() {
        return ["PiGrepToolSuccess|1 output 9|2 truncation #0?|3 match_limit_reached 13?|4 lines_truncated 8", PiTruncation];
      }
    };
    PiGrepToolError = class _PiGrepToolError extends __protoMessage375 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiGrepToolError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiGrepToolError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiGrepToolError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiGrepToolError, a, b2);
      }
      static $() {
        return ["PiGrepToolError|1 error 9"];
      }
    };
  }
});

