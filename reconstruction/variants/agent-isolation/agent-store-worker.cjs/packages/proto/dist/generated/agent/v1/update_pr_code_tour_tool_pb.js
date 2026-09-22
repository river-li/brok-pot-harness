/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/update_pr_code_tour_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage55 = "agent.v1.";
var __protoMessage354 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage55;
  }
};
var UpdatePrCodeTourExecutionMode = /* @__PURE__ */ enumType(proto3, __protoPackage55, "UpdatePrCodeTourExecutionMode", [[0, "UNSPECIFIED"], [1, "SERVER_SCHEDULED"], [2, "CLIENT_REQUIRED"], [3, "SKIPPED"], [4, "EDITED"]], 1);
var UpdatePrCodeTourArgs = class _UpdatePrCodeTourArgs extends __protoMessage354 {
  constructor(data) {
    super();
    this.feedback = "";
    this.toolCallId = "";
    this.scopeCommitHashes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrCodeTourArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrCodeTourArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrCodeTourArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrCodeTourArgs, a, b);
  }
  static $() {
    return ["UpdatePrCodeTourArgs|1 feedback 9|2 tool_call_id 9|3 base_sha 9?|4 head_sha 9?|5 source_revision_id 9?|6 revision_id 9?|7 markdown 9?|8 heading 9?|9 artifact_path 9?|10 artifact_alt 9?|11 scope_commit_hashes 9*|12 explicit_user_prompt 9?"];
  }
};
var UpdatePrCodeTourResult = class _UpdatePrCodeTourResult extends __protoMessage354 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrCodeTourResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrCodeTourResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrCodeTourResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrCodeTourResult, a, b);
  }
  static $() {
    return ["UpdatePrCodeTourResult|1 success #0 result|2 error #1 result", UpdatePrCodeTourSuccess, UpdatePrCodeTourError];
  }
};
var UpdatePrCodeTourSuccess = class _UpdatePrCodeTourSuccess extends __protoMessage354 {
  constructor(data) {
    super();
    this.revisionId = "";
    this.message = "";
    this.executionMode = UpdatePrCodeTourExecutionMode.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrCodeTourSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrCodeTourSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrCodeTourSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrCodeTourSuccess, a, b);
  }
  static $() {
    return ["UpdatePrCodeTourSuccess|1 revision_id 9|2 message 9|3 execution_mode #0", UpdatePrCodeTourExecutionMode];
  }
};
var UpdatePrCodeTourError = class _UpdatePrCodeTourError extends __protoMessage354 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrCodeTourError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrCodeTourError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrCodeTourError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrCodeTourError, a, b);
  }
  static $() {
    return ["UpdatePrCodeTourError|1 error 9"];
  }
};
var UpdatePrCodeTourToolCall = class _UpdatePrCodeTourToolCall extends __protoMessage354 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UpdatePrCodeTourToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UpdatePrCodeTourToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UpdatePrCodeTourToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UpdatePrCodeTourToolCall, a, b);
  }
  static $() {
    return ["UpdatePrCodeTourToolCall|1 args #0|2 result #1", UpdatePrCodeTourArgs, UpdatePrCodeTourResult];
  }
};

