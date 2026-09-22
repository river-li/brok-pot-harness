/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/switch_mode_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage36 = "agent.v1.";
var __protoMessage336 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage36;
  }
};
var SwitchModeArgs = class _SwitchModeArgs extends __protoMessage336 {
  constructor(data) {
    super();
    this.targetModeId = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SwitchModeArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SwitchModeArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SwitchModeArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SwitchModeArgs, a, b2);
  }
  static $() {
    return ["SwitchModeArgs|1 target_mode_id 9|2 explanation 9?|3 tool_call_id 9"];
  }
};
var SwitchModeResult = class _SwitchModeResult extends __protoMessage336 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SwitchModeResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SwitchModeResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SwitchModeResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SwitchModeResult, a, b2);
  }
  static $() {
    return ["SwitchModeResult|1 success #0 result|2 error #1 result|3 rejected #2 result", SwitchModeSuccess, SwitchModeError, SwitchModeRejected];
  }
};
var SwitchModeSuccess = class _SwitchModeSuccess extends __protoMessage336 {
  constructor(data) {
    super();
    this.fromModeId = "";
    this.toModeId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SwitchModeSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SwitchModeSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SwitchModeSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SwitchModeSuccess, a, b2);
  }
  static $() {
    return ["SwitchModeSuccess|1 from_mode_id 9|2 to_mode_id 9"];
  }
};
var SwitchModeError = class _SwitchModeError extends __protoMessage336 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SwitchModeError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SwitchModeError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SwitchModeError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SwitchModeError, a, b2);
  }
  static $() {
    return ["SwitchModeError|1 error 9"];
  }
};
var SwitchModeRejected = class _SwitchModeRejected extends __protoMessage336 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SwitchModeRejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SwitchModeRejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SwitchModeRejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SwitchModeRejected, a, b2);
  }
  static $() {
    return ["SwitchModeRejected|1 reason 9"];
  }
};
var SwitchModeToolCall = class _SwitchModeToolCall extends __protoMessage336 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SwitchModeToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SwitchModeToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SwitchModeToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SwitchModeToolCall, a, b2);
  }
  static $() {
    return ["SwitchModeToolCall|1 args #0|2 result #1", SwitchModeArgs, SwitchModeResult];
  }
};
var SwitchModeRequestQuery = class _SwitchModeRequestQuery extends __protoMessage336 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SwitchModeRequestQuery().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SwitchModeRequestQuery().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SwitchModeRequestQuery().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SwitchModeRequestQuery, a, b2);
  }
  static $() {
    return ["SwitchModeRequestQuery|1 args #0", SwitchModeArgs];
  }
};
var SwitchModeRequestResponse = class _SwitchModeRequestResponse extends __protoMessage336 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SwitchModeRequestResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SwitchModeRequestResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SwitchModeRequestResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SwitchModeRequestResponse, a, b2);
  }
  static $() {
    return ["SwitchModeRequestResponse|1 approved #0 result|2 rejected #1 result", SwitchModeRequestResponse_Approved, SwitchModeRequestResponse_Rejected];
  }
};
var SwitchModeRequestResponse_Approved = class _SwitchModeRequestResponse_Approved extends __protoMessage336 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SwitchModeRequestResponse_Approved().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SwitchModeRequestResponse_Approved().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SwitchModeRequestResponse_Approved().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SwitchModeRequestResponse_Approved, a, b2);
  }
  static $() {
    return ["SwitchModeRequestResponse.Approved"];
  }
};
var SwitchModeRequestResponse_Rejected = class _SwitchModeRequestResponse_Rejected extends __protoMessage336 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SwitchModeRequestResponse_Rejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SwitchModeRequestResponse_Rejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SwitchModeRequestResponse_Rejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SwitchModeRequestResponse_Rejected, a, b2);
  }
  static $() {
    return ["SwitchModeRequestResponse.Rejected|1 reason 9"];
  }
};

