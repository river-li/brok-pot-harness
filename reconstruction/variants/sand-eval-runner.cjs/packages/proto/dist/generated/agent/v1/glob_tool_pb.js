/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/glob_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage11 = "agent.v1.";
var __protoMessage311 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage11;
  }
};
var GlobToolArgs = class _GlobToolArgs extends __protoMessage311 {
  constructor(data) {
    super();
    this.globPattern = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GlobToolArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GlobToolArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GlobToolArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GlobToolArgs, a, b2);
  }
  static $() {
    return ["GlobToolArgs|1 target_directory 9?|2 glob_pattern 9"];
  }
};
var GlobToolResult = class _GlobToolResult extends __protoMessage311 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GlobToolResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GlobToolResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GlobToolResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GlobToolResult, a, b2);
  }
  static $() {
    return ["GlobToolResult|1 success #0 result|2 error #1 result", GlobToolSuccess, GlobToolError];
  }
};
var GlobToolError = class _GlobToolError extends __protoMessage311 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GlobToolError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GlobToolError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GlobToolError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GlobToolError, a, b2);
  }
  static $() {
    return ["GlobToolError|1 error 9"];
  }
};
var GlobToolSuccess = class _GlobToolSuccess extends __protoMessage311 {
  constructor(data) {
    super();
    this.pattern = "";
    this.path = "";
    this.files = [];
    this.totalFiles = 0;
    this.clientTruncated = false;
    this.ripgrepTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GlobToolSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GlobToolSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GlobToolSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GlobToolSuccess, a, b2);
  }
  static $() {
    return ["GlobToolSuccess|1 pattern 9|2 path 9|3 files 9*|4 total_files 5|5 client_truncated 8|6 ripgrep_truncated 8"];
  }
};
var GlobToolCall = class _GlobToolCall extends __protoMessage311 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GlobToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GlobToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GlobToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GlobToolCall, a, b2);
  }
  static $() {
    return ["GlobToolCall|1 args #0|2 result #1", GlobToolArgs, GlobToolResult];
  }
};

