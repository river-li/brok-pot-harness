/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/start_grind_execution_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage42 = "agent.v1.";
var __protoMessage341 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage42;
  }
};
var StartGrindExecutionArgs = class _StartGrindExecutionArgs extends __protoMessage341 {
  constructor(data) {
    super();
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindExecutionArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindExecutionArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindExecutionArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindExecutionArgs, a, b);
  }
  static $() {
    return ["StartGrindExecutionArgs|1 explanation 9?|2 tool_call_id 9"];
  }
};
var StartGrindExecutionResult = class _StartGrindExecutionResult extends __protoMessage341 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindExecutionResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindExecutionResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindExecutionResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindExecutionResult, a, b);
  }
  static $() {
    return ["StartGrindExecutionResult|1 success #0 result|2 error #1 result", StartGrindExecutionSuccess, StartGrindExecutionError];
  }
};
var StartGrindExecutionSuccess = class _StartGrindExecutionSuccess extends __protoMessage341 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindExecutionSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindExecutionSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindExecutionSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindExecutionSuccess, a, b);
  }
  static $() {
    return ["StartGrindExecutionSuccess"];
  }
};
var StartGrindExecutionError = class _StartGrindExecutionError extends __protoMessage341 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindExecutionError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindExecutionError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindExecutionError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindExecutionError, a, b);
  }
  static $() {
    return ["StartGrindExecutionError|1 error 9"];
  }
};
var StartGrindExecutionToolCall = class _StartGrindExecutionToolCall extends __protoMessage341 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindExecutionToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindExecutionToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindExecutionToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindExecutionToolCall, a, b);
  }
  static $() {
    return ["StartGrindExecutionToolCall|1 args #0|2 result #1", StartGrindExecutionArgs, StartGrindExecutionResult];
  }
};

