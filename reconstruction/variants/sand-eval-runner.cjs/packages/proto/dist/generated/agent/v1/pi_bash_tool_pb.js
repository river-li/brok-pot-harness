/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_bash_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage67 = "agent.v1.";
var __protoMessage367 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage67;
  }
};
var PiBashToolCall = class _PiBashToolCall extends __protoMessage367 {
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
var PiBashToolArgs = class _PiBashToolArgs extends __protoMessage367 {
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
var PiBashToolResult = class _PiBashToolResult extends __protoMessage367 {
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
var PiBashToolSuccess = class _PiBashToolSuccess extends __protoMessage367 {
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
var PiBashToolError = class _PiBashToolError extends __protoMessage367 {
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

