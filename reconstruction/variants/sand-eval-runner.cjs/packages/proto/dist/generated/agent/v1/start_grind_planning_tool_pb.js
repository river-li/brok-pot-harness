/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/start_grind_planning_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage46 = "agent.v1.";
var __protoMessage346 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage46;
  }
};
var StartGrindPlanningArgs = class _StartGrindPlanningArgs extends __protoMessage346 {
  constructor(data) {
    super();
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartGrindPlanningArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartGrindPlanningArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartGrindPlanningArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartGrindPlanningArgs, a, b2);
  }
  static $() {
    return ["StartGrindPlanningArgs|1 explanation 9?|2 tool_call_id 9"];
  }
};
var StartGrindPlanningResult = class _StartGrindPlanningResult extends __protoMessage346 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartGrindPlanningResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartGrindPlanningResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartGrindPlanningResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartGrindPlanningResult, a, b2);
  }
  static $() {
    return ["StartGrindPlanningResult|1 success #0 result|2 error #1 result", StartGrindPlanningSuccess, StartGrindPlanningError];
  }
};
var StartGrindPlanningSuccess = class _StartGrindPlanningSuccess extends __protoMessage346 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartGrindPlanningSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartGrindPlanningSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartGrindPlanningSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartGrindPlanningSuccess, a, b2);
  }
  static $() {
    return ["StartGrindPlanningSuccess"];
  }
};
var StartGrindPlanningError = class _StartGrindPlanningError extends __protoMessage346 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartGrindPlanningError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartGrindPlanningError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartGrindPlanningError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartGrindPlanningError, a, b2);
  }
  static $() {
    return ["StartGrindPlanningError|1 error 9"];
  }
};
var StartGrindPlanningToolCall = class _StartGrindPlanningToolCall extends __protoMessage346 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StartGrindPlanningToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StartGrindPlanningToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StartGrindPlanningToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StartGrindPlanningToolCall, a, b2);
  }
  static $() {
    return ["StartGrindPlanningToolCall|1 args #0|2 result #1", StartGrindPlanningArgs, StartGrindPlanningResult];
  }
};

