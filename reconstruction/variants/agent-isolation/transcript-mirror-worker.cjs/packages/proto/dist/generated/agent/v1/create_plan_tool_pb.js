/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/create_plan_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage25 = "agent.v1.";
var __protoMessage324 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage25;
  }
};
var CreatePlanToolCall = class _CreatePlanToolCall extends __protoMessage324 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePlanToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePlanToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePlanToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePlanToolCall, a, b);
  }
  static $() {
    return ["CreatePlanToolCall|1 args #0|2 result #1", CreatePlanArgs, CreatePlanResult];
  }
};
var Phase = class _Phase extends __protoMessage324 {
  constructor(data) {
    super();
    this.name = "";
    this.todos = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _Phase().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Phase().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Phase().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Phase, a, b);
  }
  static $() {
    return ["Phase|1 name 9|2 todos #0*", TodoItem];
  }
};
var CreatePlanArgs = class _CreatePlanArgs extends __protoMessage324 {
  constructor(data) {
    super();
    this.plan = "";
    this.todos = [];
    this.overview = "";
    this.name = "";
    this.isProject = false;
    this.phases = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePlanArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePlanArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePlanArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePlanArgs, a, b);
  }
  static $() {
    return ["CreatePlanArgs|1 plan 9|2 todos #0*|3 overview 9|4 name 9|5 is_project 8|6 phases #1*", TodoItem, Phase];
  }
};
var CreatePlanResult = class _CreatePlanResult extends __protoMessage324 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    this.planUri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePlanResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePlanResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePlanResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePlanResult, a, b);
  }
  static $() {
    return ["CreatePlanResult|1 success #0 result|2 error #1 result|3 plan_uri 9", CreatePlanSuccess, CreatePlanError];
  }
};
var CreatePlanSuccess = class _CreatePlanSuccess extends __protoMessage324 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePlanSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePlanSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePlanSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePlanSuccess, a, b);
  }
  static $() {
    return ["CreatePlanSuccess"];
  }
};
var CreatePlanError = class _CreatePlanError extends __protoMessage324 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CreatePlanError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CreatePlanError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CreatePlanError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CreatePlanError, a, b);
  }
  static $() {
    return ["CreatePlanError|1 error 9"];
  }
};

