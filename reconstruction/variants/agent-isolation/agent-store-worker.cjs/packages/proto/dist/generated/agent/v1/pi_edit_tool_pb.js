/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/pi_edit_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage65 = "agent.v1.";
var __protoMessage364 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage65;
  }
};
var PiEditReplacement = class _PiEditReplacement extends __protoMessage364 {
  constructor(data) {
    super();
    this.oldText = "";
    this.newText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditReplacement().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditReplacement().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditReplacement().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditReplacement, a, b);
  }
  static $() {
    return ["PiEditReplacement|1 old_text 9|2 new_text 9"];
  }
};
var PiEditToolCall = class _PiEditToolCall extends __protoMessage364 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolCall, a, b);
  }
  static $() {
    return ["PiEditToolCall|1 args #0|2 result #1", PiEditToolArgs, PiEditToolResult];
  }
};
var PiEditToolArgs = class _PiEditToolArgs extends __protoMessage364 {
  constructor(data) {
    super();
    this.path = "";
    this.edits = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolArgs, a, b);
  }
  static $() {
    return ["PiEditToolArgs|1 path 9|2 edits #0*", PiEditReplacement];
  }
};
var PiEditToolResult = class _PiEditToolResult extends __protoMessage364 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolResult, a, b);
  }
  static $() {
    return ["PiEditToolResult|1 success #0 result|2 error #1 result|3 rejected #2 result", PiEditToolSuccess, PiEditToolError, PiEditToolRejected];
  }
};
var PiEditToolSuccess = class _PiEditToolSuccess extends __protoMessage364 {
  constructor(data) {
    super();
    this.output = "";
    this.diff = "";
    this.patch = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolSuccess, a, b);
  }
  static $() {
    return ["PiEditToolSuccess|1 output 9|2 diff 9|3 patch 9|4 first_changed_line 13?"];
  }
};
var PiEditToolError = class _PiEditToolError extends __protoMessage364 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolError, a, b);
  }
  static $() {
    return ["PiEditToolError|1 error 9"];
  }
};
var PiEditToolRejected = class _PiEditToolRejected extends __protoMessage364 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PiEditToolRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PiEditToolRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PiEditToolRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PiEditToolRejected, a, b);
  }
  static $() {
    return ["PiEditToolRejected|1 reason 9"];
  }
};

