/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/start_grind_planning_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage43 = "agent.v1.";
var __protoMessage342 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage43;
  }
};
var StartGrindPlanningArgs = class _StartGrindPlanningArgs extends __protoMessage342 {
  constructor(data) {
    super();
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindPlanningArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindPlanningArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindPlanningArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindPlanningArgs, a, b);
  }
  static $() {
    return ["StartGrindPlanningArgs|1 explanation 9?|2 tool_call_id 9"];
  }
};
var StartGrindPlanningResult = class _StartGrindPlanningResult extends __protoMessage342 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindPlanningResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindPlanningResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindPlanningResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindPlanningResult, a, b);
  }
  static $() {
    return ["StartGrindPlanningResult|1 success #0 result|2 error #1 result", StartGrindPlanningSuccess, StartGrindPlanningError];
  }
};
var StartGrindPlanningSuccess = class _StartGrindPlanningSuccess extends __protoMessage342 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindPlanningSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindPlanningSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindPlanningSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindPlanningSuccess, a, b);
  }
  static $() {
    return ["StartGrindPlanningSuccess"];
  }
};
var StartGrindPlanningError = class _StartGrindPlanningError extends __protoMessage342 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindPlanningError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindPlanningError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindPlanningError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindPlanningError, a, b);
  }
  static $() {
    return ["StartGrindPlanningError|1 error 9"];
  }
};
var StartGrindPlanningToolCall = class _StartGrindPlanningToolCall extends __protoMessage342 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StartGrindPlanningToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StartGrindPlanningToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StartGrindPlanningToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StartGrindPlanningToolCall, a, b);
  }
  static $() {
    return ["StartGrindPlanningToolCall|1 args #0|2 result #1", StartGrindPlanningArgs, StartGrindPlanningResult];
  }
};

