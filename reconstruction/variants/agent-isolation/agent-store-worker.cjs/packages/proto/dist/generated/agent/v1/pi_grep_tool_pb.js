/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_grep_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage67 = "agent.v1.";
var __protoMessage366 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage67;
  }
};
var PiGrepToolCall = class _PiGrepToolCall extends __protoMessage366 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiGrepToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiGrepToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiGrepToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiGrepToolCall, a, b);
  }
  static $() {
    return ["PiGrepToolCall|1 args #0|2 result #1", PiGrepToolArgs, PiGrepToolResult];
  }
};
var PiGrepToolArgs = class _PiGrepToolArgs extends __protoMessage366 {
  constructor(data) {
    super();
    this.pattern = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiGrepToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiGrepToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiGrepToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiGrepToolArgs, a, b);
  }
  static $() {
    return ["PiGrepToolArgs|1 pattern 9|2 path 9?|3 glob 9?|4 ignore_case 8?|5 literal 8?|6 context 5?|7 limit 5?"];
  }
};
var PiGrepToolResult = class _PiGrepToolResult extends __protoMessage366 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiGrepToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiGrepToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiGrepToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiGrepToolResult, a, b);
  }
  static $() {
    return ["PiGrepToolResult|1 success #0 result|2 error #1 result", PiGrepToolSuccess, PiGrepToolError];
  }
};
var PiGrepToolSuccess = class _PiGrepToolSuccess extends __protoMessage366 {
  constructor(data) {
    super();
    this.output = "";
    this.linesTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiGrepToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiGrepToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiGrepToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiGrepToolSuccess, a, b);
  }
  static $() {
    return ["PiGrepToolSuccess|1 output 9|2 truncation #0?|3 match_limit_reached 13?|4 lines_truncated 8", PiTruncation];
  }
};
var PiGrepToolError = class _PiGrepToolError extends __protoMessage366 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiGrepToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiGrepToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiGrepToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiGrepToolError, a, b);
  }
  static $() {
    return ["PiGrepToolError|1 error 9"];
  }
};

