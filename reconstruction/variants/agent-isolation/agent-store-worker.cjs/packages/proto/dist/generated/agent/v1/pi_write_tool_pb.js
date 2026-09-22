/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_write_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage66 = "agent.v1.";
var __protoMessage365 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage66;
  }
};
var PiWriteToolCall = class _PiWriteToolCall extends __protoMessage365 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolCall, a, b);
  }
  static $() {
    return ["PiWriteToolCall|1 args #0|2 result #1", PiWriteToolArgs, PiWriteToolResult];
  }
};
var PiWriteToolArgs = class _PiWriteToolArgs extends __protoMessage365 {
  constructor(data) {
    super();
    this.path = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolArgs, a, b);
  }
  static $() {
    return ["PiWriteToolArgs|1 path 9|2 content 9"];
  }
};
var PiWriteToolResult = class _PiWriteToolResult extends __protoMessage365 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolResult, a, b);
  }
  static $() {
    return ["PiWriteToolResult|1 success #0 result|2 error #1 result|3 rejected #2 result", PiWriteToolSuccess, PiWriteToolError, PiWriteToolRejected];
  }
};
var PiWriteToolSuccess = class _PiWriteToolSuccess extends __protoMessage365 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolSuccess, a, b);
  }
  static $() {
    return ["PiWriteToolSuccess|1 output 9"];
  }
};
var PiWriteToolError = class _PiWriteToolError extends __protoMessage365 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolError, a, b);
  }
  static $() {
    return ["PiWriteToolError|1 error 9"];
  }
};
var PiWriteToolRejected = class _PiWriteToolRejected extends __protoMessage365 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiWriteToolRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiWriteToolRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiWriteToolRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiWriteToolRejected, a, b);
  }
  static $() {
    return ["PiWriteToolRejected|1 reason 9"];
  }
};

