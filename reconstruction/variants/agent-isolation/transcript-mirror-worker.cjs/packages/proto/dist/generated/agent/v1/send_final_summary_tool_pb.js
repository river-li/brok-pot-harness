/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/send_final_summary_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage53 = "agent.v1.";
var __protoMessage352 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage53;
  }
};
var SendFinalSummaryArgs = class _SendFinalSummaryArgs extends __protoMessage352 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendFinalSummaryArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendFinalSummaryArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendFinalSummaryArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendFinalSummaryArgs, a, b);
  }
  static $() {
    return ["SendFinalSummaryArgs|1 final_summary 9?"];
  }
};
var SendFinalSummarySuccess = class _SendFinalSummarySuccess extends __protoMessage352 {
  constructor(data) {
    super();
    this.finalSummary = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendFinalSummarySuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendFinalSummarySuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendFinalSummarySuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendFinalSummarySuccess, a, b);
  }
  static $() {
    return ["SendFinalSummarySuccess|1 final_summary 9"];
  }
};
var SendFinalSummaryError = class _SendFinalSummaryError extends __protoMessage352 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendFinalSummaryError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendFinalSummaryError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendFinalSummaryError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendFinalSummaryError, a, b);
  }
  static $() {
    return ["SendFinalSummaryError|1 error 9"];
  }
};
var SendFinalSummaryResult = class _SendFinalSummaryResult extends __protoMessage352 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendFinalSummaryResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendFinalSummaryResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendFinalSummaryResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendFinalSummaryResult, a, b);
  }
  static $() {
    return ["SendFinalSummaryResult|1 success #0 result|2 error #1 result", SendFinalSummarySuccess, SendFinalSummaryError];
  }
};
var SendFinalSummaryToolCall = class _SendFinalSummaryToolCall extends __protoMessage352 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendFinalSummaryToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendFinalSummaryToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendFinalSummaryToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendFinalSummaryToolCall, a, b);
  }
  static $() {
    return ["SendFinalSummaryToolCall|1 args #0|2 result #1", SendFinalSummaryArgs, SendFinalSummaryResult];
  }
};

