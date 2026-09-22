/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/report_bugfix_results_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage45 = "agent.v1.";
var __protoMessage344 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage45;
  }
};
var BugfixVerdict = /* @__PURE__ */ enumType(proto3, __protoPackage45, "BugfixVerdict", [[0, "UNSPECIFIED"], [1, "FIXED"], [2, "FALSE_POSITIVE"], [3, "COULD_NOT_FIX"], [4, "RESOLVED_BY_OTHER_FIX"]], 1);
var BugfixResultItem = class _BugfixResultItem extends __protoMessage344 {
  constructor(data) {
    super();
    this.bugId = "";
    this.bugTitle = "";
    this.verdict = BugfixVerdict.UNSPECIFIED;
    this.explanation = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _BugfixResultItem().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _BugfixResultItem().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _BugfixResultItem().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_BugfixResultItem, a, b);
  }
  static $() {
    return ["BugfixResultItem|1 bug_id 9|2 bug_title 9|3 verdict #0|4 explanation 9|5 severity 9?", BugfixVerdict];
  }
};
var ReportBugfixResultsArgs = class _ReportBugfixResultsArgs extends __protoMessage344 {
  constructor(data) {
    super();
    this.summary = "";
    this.results = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugfixResultsArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugfixResultsArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugfixResultsArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugfixResultsArgs, a, b);
  }
  static $() {
    return ["ReportBugfixResultsArgs|1 summary 9|2 results #0*", BugfixResultItem];
  }
};
var ReportBugfixResultsSuccess = class _ReportBugfixResultsSuccess extends __protoMessage344 {
  constructor(data) {
    super();
    this.results = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugfixResultsSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugfixResultsSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugfixResultsSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugfixResultsSuccess, a, b);
  }
  static $() {
    return ["ReportBugfixResultsSuccess|1 results #0*", BugfixResultItem];
  }
};
var ReportBugfixResultsError = class _ReportBugfixResultsError extends __protoMessage344 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugfixResultsError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugfixResultsError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugfixResultsError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugfixResultsError, a, b);
  }
  static $() {
    return ["ReportBugfixResultsError|1 error 9"];
  }
};
var ReportBugfixResultsResult = class _ReportBugfixResultsResult extends __protoMessage344 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugfixResultsResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugfixResultsResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugfixResultsResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugfixResultsResult, a, b);
  }
  static $() {
    return ["ReportBugfixResultsResult|1 success #0 result|2 error #1 result", ReportBugfixResultsSuccess, ReportBugfixResultsError];
  }
};
var ReportBugfixResultsToolCall = class _ReportBugfixResultsToolCall extends __protoMessage344 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReportBugfixResultsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReportBugfixResultsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReportBugfixResultsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReportBugfixResultsToolCall, a, b);
  }
  static $() {
    return ["ReportBugfixResultsToolCall|1 args #0|2 result #1", ReportBugfixResultsArgs, ReportBugfixResultsResult];
  }
};

