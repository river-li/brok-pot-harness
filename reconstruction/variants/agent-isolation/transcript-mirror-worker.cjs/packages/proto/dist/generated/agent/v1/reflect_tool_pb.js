/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/reflect_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage39 = "agent.v1.";
var __protoMessage338 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage39;
  }
};
var ReflectArgs = class _ReflectArgs extends __protoMessage338 {
  constructor(data) {
    super();
    this.unexpectedActionOutcomes = "";
    this.relevantInstructions = "";
    this.scenarioAnalysis = "";
    this.criticalSynthesis = "";
    this.nextSteps = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReflectArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReflectArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReflectArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReflectArgs, a, b);
  }
  static $() {
    return ["ReflectArgs|1 unexpected_action_outcomes 9|2 relevant_instructions 9|3 scenario_analysis 9|4 critical_synthesis 9|5 next_steps 9|6 tool_call_id 9"];
  }
};
var ReflectResult = class _ReflectResult extends __protoMessage338 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReflectResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReflectResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReflectResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReflectResult, a, b);
  }
  static $() {
    return ["ReflectResult|1 success #0 result|2 error #1 result", ReflectSuccess, ReflectError];
  }
};
var ReflectSuccess = class _ReflectSuccess extends __protoMessage338 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReflectSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReflectSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReflectSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReflectSuccess, a, b);
  }
  static $() {
    return ["ReflectSuccess"];
  }
};
var ReflectError = class _ReflectError extends __protoMessage338 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReflectError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReflectError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReflectError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReflectError, a, b);
  }
  static $() {
    return ["ReflectError|1 error 9"];
  }
};
var ReflectToolCall = class _ReflectToolCall extends __protoMessage338 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReflectToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReflectToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReflectToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReflectToolCall, a, b);
  }
  static $() {
    return ["ReflectToolCall|1 args #0|2 result #1", ReflectArgs, ReflectResult];
  }
};

