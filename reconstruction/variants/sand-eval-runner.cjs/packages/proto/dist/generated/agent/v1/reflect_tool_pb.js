/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/reflect_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage43 = "agent.v1.";
var __protoMessage343 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage43;
  }
};
var ReflectArgs = class _ReflectArgs extends __protoMessage343 {
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
  static fromBinary(bytes, options2) {
    return new _ReflectArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReflectArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReflectArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReflectArgs, a, b2);
  }
  static $() {
    return ["ReflectArgs|1 unexpected_action_outcomes 9|2 relevant_instructions 9|3 scenario_analysis 9|4 critical_synthesis 9|5 next_steps 9|6 tool_call_id 9"];
  }
};
var ReflectResult = class _ReflectResult extends __protoMessage343 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReflectResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReflectResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReflectResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReflectResult, a, b2);
  }
  static $() {
    return ["ReflectResult|1 success #0 result|2 error #1 result", ReflectSuccess, ReflectError];
  }
};
var ReflectSuccess = class _ReflectSuccess extends __protoMessage343 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReflectSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReflectSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReflectSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReflectSuccess, a, b2);
  }
  static $() {
    return ["ReflectSuccess"];
  }
};
var ReflectError = class _ReflectError extends __protoMessage343 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReflectError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReflectError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReflectError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReflectError, a, b2);
  }
  static $() {
    return ["ReflectError|1 error 9"];
  }
};
var ReflectToolCall = class _ReflectToolCall extends __protoMessage343 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReflectToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReflectToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReflectToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReflectToolCall, a, b2);
  }
  static $() {
    return ["ReflectToolCall|1 args #0|2 result #1", ReflectArgs, ReflectResult];
  }
};

