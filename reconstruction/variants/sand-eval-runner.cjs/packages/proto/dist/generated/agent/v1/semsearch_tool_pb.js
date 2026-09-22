/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/semsearch_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_repository_pb();
init_compact();
var __protoPackage28 = "agent.v1.";
var __protoMessage328 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage28;
  }
};
var SemSearchToolCall = class _SemSearchToolCall extends __protoMessage328 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SemSearchToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SemSearchToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SemSearchToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SemSearchToolCall, a, b2);
  }
  static $() {
    return ["SemSearchToolCall|1 args #0|2 result #1", SemSearchToolArgs, SemSearchToolResult];
  }
};
var SemSearchToolArgs = class _SemSearchToolArgs extends __protoMessage328 {
  constructor(data) {
    super();
    this.query = "";
    this.targetDirectories = [];
    this.explanation = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SemSearchToolArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SemSearchToolArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SemSearchToolArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SemSearchToolArgs, a, b2);
  }
  static $() {
    return ["SemSearchToolArgs|1 query 9|2 target_directories 9*|3 explanation 9"];
  }
};
var SemSearchToolResult = class _SemSearchToolResult extends __protoMessage328 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SemSearchToolResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SemSearchToolResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SemSearchToolResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SemSearchToolResult, a, b2);
  }
  static $() {
    return ["SemSearchToolResult|1 success #0 result|2 error #1 result", SemSearchToolSuccess, SemSearchToolError];
  }
};
var SemSearchToolSuccess = class _SemSearchToolSuccess extends __protoMessage328 {
  constructor(data) {
    super();
    this.results = "";
    this.codeResults = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SemSearchToolSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SemSearchToolSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SemSearchToolSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SemSearchToolSuccess, a, b2);
  }
  static $() {
    return ["SemSearchToolSuccess|1 results 9|2 code_results #0*", CodeResult];
  }
};
var SemSearchToolError = class _SemSearchToolError extends __protoMessage328 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SemSearchToolError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SemSearchToolError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SemSearchToolError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SemSearchToolError, a, b2);
  }
  static $() {
    return ["SemSearchToolError|1 error_message 9"];
  }
};

