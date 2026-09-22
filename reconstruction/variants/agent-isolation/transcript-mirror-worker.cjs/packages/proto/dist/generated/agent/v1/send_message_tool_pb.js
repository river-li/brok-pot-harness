/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/send_message_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage58 = "agent.v1.";
var __protoMessage357 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage58;
  }
};
var SendMessageText = class _SendMessageText extends __protoMessage357 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageText().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageText().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageText().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageText, a, b);
  }
  static $() {
    return ["SendMessageText|1 content 9"];
  }
};
var SendMessageAttachment = class _SendMessageAttachment extends __protoMessage357 {
  constructor(data) {
    super();
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageAttachment().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageAttachment().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageAttachment().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageAttachment, a, b);
  }
  static $() {
    return ["SendMessageAttachment|1 url 9|2 alt 9?"];
  }
};
var SendMessageArgs = class _SendMessageArgs extends __protoMessage357 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageArgs, a, b);
  }
  static $() {
    return ["SendMessageArgs|1 text #0 message|2 attachment #1 message", SendMessageText, SendMessageAttachment];
  }
};
var SendMessageSuccess = class _SendMessageSuccess extends __protoMessage357 {
  constructor(data) {
    super();
    this.timestamp = protoInt64.zero;
    this.messageId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageSuccess, a, b);
  }
  static $() {
    return ["SendMessageSuccess|1 timestamp 4|2 message_id 9"];
  }
};
var SendMessageError = class _SendMessageError extends __protoMessage357 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageError, a, b);
  }
  static $() {
    return ["SendMessageError|1 error 9"];
  }
};
var SendMessageResult = class _SendMessageResult extends __protoMessage357 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageResult, a, b);
  }
  static $() {
    return ["SendMessageResult|1 success #0 result|2 error #1 result", SendMessageSuccess, SendMessageError];
  }
};
var SendMessageToolCall = class _SendMessageToolCall extends __protoMessage357 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SendMessageToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SendMessageToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SendMessageToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SendMessageToolCall, a, b);
  }
  static $() {
    return ["SendMessageToolCall|1 args #0|2 result #1", SendMessageArgs, SendMessageResult];
  }
};

