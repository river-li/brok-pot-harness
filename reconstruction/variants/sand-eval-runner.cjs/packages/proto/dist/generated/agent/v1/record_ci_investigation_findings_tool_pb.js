/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/record_ci_investigation_findings_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage61 = "agent.v1.";
var __protoMessage361 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage61;
  }
};
var RecordCiInvestigationFinding = class _RecordCiInvestigationFinding extends __protoMessage361 {
  constructor(data) {
    super();
    this.checkName = "";
    this.tldr = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordCiInvestigationFinding().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordCiInvestigationFinding().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordCiInvestigationFinding().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordCiInvestigationFinding, a, b2);
  }
  static $() {
    return ["RecordCiInvestigationFinding|1 check_name 9|2 details_url 9?|3 tldr 9|4 root_cause 9?|5 failing_signal 9?|6 suggested_next_step 9?|7 diff_relation 9?|8 diff_relation_evidence 9?|9 flake_assessment 9?|10 flake_evidence 9?|11 rerun_available 8?|12 rerun_evidence 9?|13 recommended_action 9?|14 recommended_action_evidence 9?|15 confidence 9?"];
  }
};
var RecordCiInvestigationOverall = class _RecordCiInvestigationOverall extends __protoMessage361 {
  constructor(data) {
    super();
    this.summary = "";
    this.themes = [];
    this.checkKeys = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordCiInvestigationOverall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordCiInvestigationOverall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordCiInvestigationOverall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordCiInvestigationOverall, a, b2);
  }
  static $() {
    return ["RecordCiInvestigationOverall|1 summary 9|2 themes 9*|3 recommended_action 9?|4 recommended_action_evidence 9?|5 check_keys 9*"];
  }
};
var RecordCiInvestigationFindingsArgs = class _RecordCiInvestigationFindingsArgs extends __protoMessage361 {
  constructor(data) {
    super();
    this.findings = [];
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordCiInvestigationFindingsArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordCiInvestigationFindingsArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordCiInvestigationFindingsArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordCiInvestigationFindingsArgs, a, b2);
  }
  static $() {
    return ["RecordCiInvestigationFindingsArgs|1 findings #0*|2 overall #1?|3 tool_call_id 9", RecordCiInvestigationFinding, RecordCiInvestigationOverall];
  }
};
var RecordCiInvestigationFindingsSuccess = class _RecordCiInvestigationFindingsSuccess extends __protoMessage361 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordCiInvestigationFindingsSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordCiInvestigationFindingsSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordCiInvestigationFindingsSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordCiInvestigationFindingsSuccess, a, b2);
  }
  static $() {
    return ["RecordCiInvestigationFindingsSuccess|1 message 9"];
  }
};
var RecordCiInvestigationFindingsError = class _RecordCiInvestigationFindingsError extends __protoMessage361 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordCiInvestigationFindingsError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordCiInvestigationFindingsError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordCiInvestigationFindingsError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordCiInvestigationFindingsError, a, b2);
  }
  static $() {
    return ["RecordCiInvestigationFindingsError|1 error 9"];
  }
};
var RecordCiInvestigationFindingsResult = class _RecordCiInvestigationFindingsResult extends __protoMessage361 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordCiInvestigationFindingsResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordCiInvestigationFindingsResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordCiInvestigationFindingsResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordCiInvestigationFindingsResult, a, b2);
  }
  static $() {
    return ["RecordCiInvestigationFindingsResult|1 success #0 result|2 error #1 result", RecordCiInvestigationFindingsSuccess, RecordCiInvestigationFindingsError];
  }
};
var RecordCiInvestigationFindingsToolCall = class _RecordCiInvestigationFindingsToolCall extends __protoMessage361 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordCiInvestigationFindingsToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordCiInvestigationFindingsToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordCiInvestigationFindingsToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordCiInvestigationFindingsToolCall, a, b2);
  }
  static $() {
    return ["RecordCiInvestigationFindingsToolCall|1 args #0|2 result #1", RecordCiInvestigationFindingsArgs, RecordCiInvestigationFindingsResult];
  }
};

