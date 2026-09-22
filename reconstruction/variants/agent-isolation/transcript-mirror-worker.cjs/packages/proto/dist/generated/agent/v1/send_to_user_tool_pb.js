/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/send_to_user_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage60 = "agent.v1.";
var __protoMessage359 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage60;
  }
};
var SendToUserArgs = class _SendToUserArgs extends __protoMessage359 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToUserArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToUserArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToUserArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToUserArgs, a, b);
  }
  static $() {
    return ["SendToUserArgs|1 message 9"];
  }
};
var SendToUserSuccess = class _SendToUserSuccess extends __protoMessage359 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToUserSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToUserSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToUserSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToUserSuccess, a, b);
  }
  static $() {
    return ["SendToUserSuccess"];
  }
};
var SendToUserError = class _SendToUserError extends __protoMessage359 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToUserError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToUserError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToUserError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToUserError, a, b);
  }
  static $() {
    return ["SendToUserError|1 error 9"];
  }
};
var SendToUserResult = class _SendToUserResult extends __protoMessage359 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToUserResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToUserResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToUserResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToUserResult, a, b);
  }
  static $() {
    return ["SendToUserResult|1 success #0 result|2 error #1 result", SendToUserSuccess, SendToUserError];
  }
};
var SendToUserToolCall = class _SendToUserToolCall extends __protoMessage359 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendToUserToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendToUserToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendToUserToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendToUserToolCall, a, b);
  }
  static $() {
    return ["SendToUserToolCall|1 args #0|2 result #1", SendToUserArgs, SendToUserResult];
  }
};

