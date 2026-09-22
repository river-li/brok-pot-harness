/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/switch_mode_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage32 = "agent.v1.";
var __protoMessage331 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage32;
  }
};
var SwitchModeArgs = class _SwitchModeArgs extends __protoMessage331 {
  constructor(data) {
    super();
    this.targetModeId = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeArgs, a, b);
  }
  static $() {
    return ["SwitchModeArgs|1 target_mode_id 9|2 explanation 9?|3 tool_call_id 9"];
  }
};
var SwitchModeResult = class _SwitchModeResult extends __protoMessage331 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeResult, a, b);
  }
  static $() {
    return ["SwitchModeResult|1 success #0 result|2 error #1 result|3 rejected #2 result", SwitchModeSuccess, SwitchModeError, SwitchModeRejected];
  }
};
var SwitchModeSuccess = class _SwitchModeSuccess extends __protoMessage331 {
  constructor(data) {
    super();
    this.fromModeId = "";
    this.toModeId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeSuccess, a, b);
  }
  static $() {
    return ["SwitchModeSuccess|1 from_mode_id 9|2 to_mode_id 9"];
  }
};
var SwitchModeError = class _SwitchModeError extends __protoMessage331 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeError, a, b);
  }
  static $() {
    return ["SwitchModeError|1 error 9"];
  }
};
var SwitchModeRejected = class _SwitchModeRejected extends __protoMessage331 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeRejected, a, b);
  }
  static $() {
    return ["SwitchModeRejected|1 reason 9"];
  }
};
var SwitchModeToolCall = class _SwitchModeToolCall extends __protoMessage331 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SwitchModeToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SwitchModeToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SwitchModeToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SwitchModeToolCall, a, b);
  }
  static $() {
    return ["SwitchModeToolCall|1 args #0|2 result #1", SwitchModeArgs, SwitchModeResult];
  }
};

