/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_read_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage62 = "agent.v1.";
var __protoMessage361 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage62;
  }
};
var PiReadToolCall = class _PiReadToolCall extends __protoMessage361 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiReadToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiReadToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiReadToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiReadToolCall, a, b);
  }
  static $() {
    return ["PiReadToolCall|1 args #0|2 result #1", PiReadToolArgs, PiReadToolResult];
  }
};
var PiReadToolArgs = class _PiReadToolArgs extends __protoMessage361 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiReadToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiReadToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiReadToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiReadToolArgs, a, b);
  }
  static $() {
    return ["PiReadToolArgs|1 path 9|2 offset 5?|3 limit 5?"];
  }
};
var PiReadToolResult = class _PiReadToolResult extends __protoMessage361 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiReadToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiReadToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiReadToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiReadToolResult, a, b);
  }
  static $() {
    return ["PiReadToolResult|1 success #0 result|2 error #1 result", PiReadToolSuccess, PiReadToolError];
  }
};
var PiReadToolSuccess = class _PiReadToolSuccess extends __protoMessage361 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiReadToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiReadToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiReadToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiReadToolSuccess, a, b);
  }
  static $() {
    return ["PiReadToolSuccess|1 output 9|2 truncation #0?", PiTruncation];
  }
};
var PiReadToolError = class _PiReadToolError extends __protoMessage361 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiReadToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiReadToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiReadToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiReadToolError, a, b);
  }
  static $() {
    return ["PiReadToolError|1 error 9"];
  }
};

