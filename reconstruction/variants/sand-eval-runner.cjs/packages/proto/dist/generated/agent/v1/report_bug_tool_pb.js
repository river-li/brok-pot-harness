/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/report_bug_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage55 = "agent.v1.";
var __protoMessage355 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage55;
  }
};
var ReportBugArgs = class _ReportBugArgs extends __protoMessage355 {
  constructor(data) {
    super();
    this.title = "";
    this.file = "";
    this.startLine = 0;
    this.endLine = 0;
    this.description = "";
    this.severity = "";
    this.category = "";
    this.rationale = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportBugArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportBugArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportBugArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportBugArgs, a, b2);
  }
  static $() {
    return ["ReportBugArgs|1 title 9|2 file 9|3 start_line 5|4 end_line 5|5 description 9|6 severity 9|7 category 9|8 rationale 9"];
  }
};
var ReportBugSuccess = class _ReportBugSuccess extends __protoMessage355 {
  constructor(data) {
    super();
    this.output = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportBugSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportBugSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportBugSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportBugSuccess, a, b2);
  }
  static $() {
    return ["ReportBugSuccess|1 output 9"];
  }
};
var ReportBugError = class _ReportBugError extends __protoMessage355 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportBugError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportBugError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportBugError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportBugError, a, b2);
  }
  static $() {
    return ["ReportBugError|1 error_message 9"];
  }
};
var ReportBugResult = class _ReportBugResult extends __protoMessage355 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportBugResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportBugResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportBugResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportBugResult, a, b2);
  }
  static $() {
    return ["ReportBugResult|1 success #0 result|2 error #1 result", ReportBugSuccess, ReportBugError];
  }
};
var ReportBugToolCall = class _ReportBugToolCall extends __protoMessage355 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportBugToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportBugToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportBugToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportBugToolCall, a, b2);
  }
  static $() {
    return ["ReportBugToolCall|1 args #0|2 result #1", ReportBugArgs, ReportBugResult];
  }
};

