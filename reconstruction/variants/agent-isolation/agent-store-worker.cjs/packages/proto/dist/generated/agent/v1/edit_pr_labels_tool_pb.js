/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/edit_pr_labels_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage57 = "agent.v1.";
var __protoMessage356 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage57;
  }
};
var EditPrLabelsArgs = class _EditPrLabelsArgs extends __protoMessage356 {
  constructor(data) {
    super();
    this.toolCallId = "";
    this.prUrl = "";
    this.addLabels = [];
    this.removeLabels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditPrLabelsArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditPrLabelsArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditPrLabelsArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditPrLabelsArgs, a, b);
  }
  static $() {
    return ["EditPrLabelsArgs|1 tool_call_id 9|2 pr_url 9|4 add_labels 9*|5 remove_labels 9*"];
  }
};
var EditPrLabelsResult = class _EditPrLabelsResult extends __protoMessage356 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditPrLabelsResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditPrLabelsResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditPrLabelsResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditPrLabelsResult, a, b);
  }
  static $() {
    return ["EditPrLabelsResult|1 success #0 result|2 error #1 result", EditPrLabelsSuccess, EditPrLabelsError];
  }
};
var EditPrLabelsSuccess = class _EditPrLabelsSuccess extends __protoMessage356 {
  constructor(data) {
    super();
    this.prUrl = "";
    this.prNumber = 0;
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditPrLabelsSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditPrLabelsSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditPrLabelsSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditPrLabelsSuccess, a, b);
  }
  static $() {
    return ["EditPrLabelsSuccess|1 pr_url 9|2 pr_number 5|3 message 9"];
  }
};
var EditPrLabelsError = class _EditPrLabelsError extends __protoMessage356 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditPrLabelsError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditPrLabelsError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditPrLabelsError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditPrLabelsError, a, b);
  }
  static $() {
    return ["EditPrLabelsError|1 error 9"];
  }
};
var EditPrLabelsToolCall = class _EditPrLabelsToolCall extends __protoMessage356 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditPrLabelsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditPrLabelsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditPrLabelsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditPrLabelsToolCall, a, b);
  }
  static $() {
    return ["EditPrLabelsToolCall|1 args #0|2 result #1", EditPrLabelsArgs, EditPrLabelsResult];
  }
};

