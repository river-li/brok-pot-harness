/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/apply_agent_diff_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage29 = "agent.v1.";
var __protoMessage328 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage29;
  }
};
var ApplyAgentDiffToolCall = class _ApplyAgentDiffToolCall extends __protoMessage328 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ApplyAgentDiffToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ApplyAgentDiffToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ApplyAgentDiffToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ApplyAgentDiffToolCall, a, b);
  }
  static $() {
    return ["ApplyAgentDiffToolCall|1 args #0|2 result #1", ApplyAgentDiffArgs, ApplyAgentDiffResult];
  }
};
var ApplyAgentDiffArgs = class _ApplyAgentDiffArgs extends __protoMessage328 {
  constructor(data) {
    super();
    this.agentId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ApplyAgentDiffArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ApplyAgentDiffArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ApplyAgentDiffArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ApplyAgentDiffArgs, a, b);
  }
  static $() {
    return ["ApplyAgentDiffArgs|1 agent_id 9"];
  }
};
var ApplyAgentDiffResult = class _ApplyAgentDiffResult extends __protoMessage328 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ApplyAgentDiffResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ApplyAgentDiffResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ApplyAgentDiffResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ApplyAgentDiffResult, a, b);
  }
  static $() {
    return ["ApplyAgentDiffResult|1 success #0 result|2 error #1 result", ApplyAgentDiffSuccess, ApplyAgentDiffError];
  }
};
var ApplyAgentDiffSuccess = class _ApplyAgentDiffSuccess extends __protoMessage328 {
  constructor(data) {
    super();
    this.appliedChanges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ApplyAgentDiffSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ApplyAgentDiffSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ApplyAgentDiffSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ApplyAgentDiffSuccess, a, b);
  }
  static $() {
    return ["ApplyAgentDiffSuccess|1 applied_changes #0*", AppliedAgentChange];
  }
};
var AppliedAgentChange = class _AppliedAgentChange extends __protoMessage328 {
  constructor(data) {
    super();
    this.path = "";
    this.changeType = AppliedAgentChange_ChangeType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AppliedAgentChange().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AppliedAgentChange().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AppliedAgentChange().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AppliedAgentChange, a, b);
  }
  static $() {
    return ["AppliedAgentChange|1 path 9|2 change_type #0|3 before_content 9?|4 after_content 9?|5 error 9?|6 message_for_model 9?", AppliedAgentChange_ChangeType];
  }
};
var AppliedAgentChange_ChangeType = /* @__PURE__ */ enumType(proto3, __protoPackage29, "AppliedAgentChange.ChangeType", [[0, "UNSPECIFIED"], [1, "CREATED"], [2, "MODIFIED"], [3, "DELETED"]], 1);
var ApplyAgentDiffError = class _ApplyAgentDiffError extends __protoMessage328 {
  constructor(data) {
    super();
    this.error = "";
    this.appliedChanges = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ApplyAgentDiffError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ApplyAgentDiffError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ApplyAgentDiffError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ApplyAgentDiffError, a, b);
  }
  static $() {
    return ["ApplyAgentDiffError|1 error 9|2 applied_changes #0*", AppliedAgentChange];
  }
};

