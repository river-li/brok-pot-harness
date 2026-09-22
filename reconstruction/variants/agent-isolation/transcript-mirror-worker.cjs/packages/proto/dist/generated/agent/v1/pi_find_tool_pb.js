/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_find_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
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
var PiFindToolCall = class _PiFindToolCall extends __protoMessage366 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiFindToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiFindToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiFindToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiFindToolCall, a, b);
  }
  static $() {
    return ["PiFindToolCall|1 args #0|2 result #1", PiFindToolArgs, PiFindToolResult];
  }
};
var PiFindToolArgs = class _PiFindToolArgs extends __protoMessage366 {
  constructor(data) {
    super();
    this.pattern = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiFindToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiFindToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiFindToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiFindToolArgs, a, b);
  }
  static $() {
    return ["PiFindToolArgs|1 pattern 9|2 path 9?|3 limit 5?"];
  }
};
var PiFindToolResult = class _PiFindToolResult extends __protoMessage366 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiFindToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiFindToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiFindToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiFindToolResult, a, b);
  }
  static $() {
    return ["PiFindToolResult|1 success #0 result|2 error #1 result", PiFindToolSuccess, PiFindToolError];
  }
};
var PiFindToolSuccess = class _PiFindToolSuccess extends __protoMessage366 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiFindToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiFindToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiFindToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiFindToolSuccess, a, b);
  }
  static $() {
    return ["PiFindToolSuccess|1 output 9|2 truncation #0?|3 result_limit_reached 13?", PiTruncation];
  }
};
var PiFindToolError = class _PiFindToolError extends __protoMessage366 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiFindToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiFindToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiFindToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiFindToolError, a, b);
  }
  static $() {
    return ["PiFindToolError|1 error 9"];
  }
};

