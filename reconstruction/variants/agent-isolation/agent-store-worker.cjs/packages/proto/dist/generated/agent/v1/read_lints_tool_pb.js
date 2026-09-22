/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/read_lints_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage19 = "agent.v1.";
var __protoMessage318 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage19;
  }
};
var ReadLintsToolCall = class _ReadLintsToolCall extends __protoMessage318 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadLintsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadLintsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadLintsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadLintsToolCall, a, b);
  }
  static $() {
    return ["ReadLintsToolCall|1 args #0|2 result #1", ReadLintsToolArgs, ReadLintsToolResult];
  }
};
var ReadLintsToolArgs = class _ReadLintsToolArgs extends __protoMessage318 {
  constructor(data) {
    super();
    this.paths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadLintsToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadLintsToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadLintsToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadLintsToolArgs, a, b);
  }
  static $() {
    return ["ReadLintsToolArgs|1 paths 9*"];
  }
};
var ReadLintsToolResult = class _ReadLintsToolResult extends __protoMessage318 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadLintsToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadLintsToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadLintsToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadLintsToolResult, a, b);
  }
  static $() {
    return ["ReadLintsToolResult|1 success #0 result|2 error #1 result", ReadLintsToolSuccess, ReadLintsToolError];
  }
};
var ReadLintsToolSuccess = class _ReadLintsToolSuccess extends __protoMessage318 {
  constructor(data) {
    super();
    this.fileDiagnostics = [];
    this.totalFiles = 0;
    this.totalDiagnostics = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadLintsToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadLintsToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadLintsToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadLintsToolSuccess, a, b);
  }
  static $() {
    return ["ReadLintsToolSuccess|1 file_diagnostics #0*|2 total_files 5|3 total_diagnostics 5", FileDiagnostics];
  }
};
var FileDiagnostics = class _FileDiagnostics extends __protoMessage318 {
  constructor(data) {
    super();
    this.path = "";
    this.diagnostics = [];
    this.diagnosticsCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FileDiagnostics().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FileDiagnostics().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FileDiagnostics().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FileDiagnostics, a, b);
  }
  static $() {
    return ["FileDiagnostics|1 path 9|2 diagnostics #0*|3 diagnostics_count 5", DiagnosticItem];
  }
};
var DiagnosticItem = class _DiagnosticItem extends __protoMessage318 {
  constructor(data) {
    super();
    this.severity = DiagnosticSeverity.UNSPECIFIED;
    this.message = "";
    this.source = "";
    this.code = "";
    this.isStale = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DiagnosticItem().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DiagnosticItem().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DiagnosticItem().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DiagnosticItem, a, b);
  }
  static $() {
    return ["DiagnosticItem|1 severity #0|2 range #1|3 message 9|4 source 9|5 code 9|6 is_stale 8", DiagnosticSeverity, DiagnosticRange];
  }
};
var DiagnosticRange = class _DiagnosticRange extends __protoMessage318 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DiagnosticRange().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DiagnosticRange().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DiagnosticRange().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DiagnosticRange, a, b);
  }
  static $() {
    return ["DiagnosticRange|1 start #0|2 end #0", Position];
  }
};
var ReadLintsToolError = class _ReadLintsToolError extends __protoMessage318 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadLintsToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadLintsToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadLintsToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadLintsToolError, a, b);
  }
  static $() {
    return ["ReadLintsToolError|1 error_message 9"];
  }
};

