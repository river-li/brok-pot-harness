/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/semsearch_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage25 = "agent.v1.";
var __protoMessage324 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage25;
  }
};
var SemSearchToolCall = class _SemSearchToolCall extends __protoMessage324 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SemSearchToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SemSearchToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SemSearchToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SemSearchToolCall, a, b);
  }
  static $() {
    return ["SemSearchToolCall|1 args #0|2 result #1", SemSearchToolArgs, SemSearchToolResult];
  }
};
var SemSearchToolArgs = class _SemSearchToolArgs extends __protoMessage324 {
  constructor(data) {
    super();
    this.query = "";
    this.targetDirectories = [];
    this.explanation = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SemSearchToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SemSearchToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SemSearchToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SemSearchToolArgs, a, b);
  }
  static $() {
    return ["SemSearchToolArgs|1 query 9|2 target_directories 9*|3 explanation 9"];
  }
};
var SemSearchToolResult = class _SemSearchToolResult extends __protoMessage324 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SemSearchToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SemSearchToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SemSearchToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SemSearchToolResult, a, b);
  }
  static $() {
    return ["SemSearchToolResult|1 success #0 result|2 error #1 result", SemSearchToolSuccess, SemSearchToolError];
  }
};
var SemSearchToolSuccess = class _SemSearchToolSuccess extends __protoMessage324 {
  constructor(data) {
    super();
    this.results = "";
    this.codeResults = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SemSearchToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SemSearchToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SemSearchToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SemSearchToolSuccess, a, b);
  }
  static $() {
    return ["SemSearchToolSuccess|1 results 9|2 code_results #0*", CodeResult];
  }
};
var SemSearchToolError = class _SemSearchToolError extends __protoMessage324 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SemSearchToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SemSearchToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SemSearchToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SemSearchToolError, a, b);
  }
  static $() {
    return ["SemSearchToolError|1 error_message 9"];
  }
};

