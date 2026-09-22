/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/read_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage13 = "agent.v1.";
var __protoMessage313 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage13;
  }
};
var ReadToolCall = class _ReadToolCall extends __protoMessage313 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadToolCall, a, b);
  }
  static $() {
    return ["ReadToolCall|1 args #0|2 result #1", ReadToolArgs, ReadToolResult];
  }
};
var ReadToolArgs = class _ReadToolArgs extends __protoMessage313 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadToolArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadToolArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadToolArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadToolArgs, a, b);
  }
  static $() {
    return ["ReadToolArgs|1 path 9|2 offset 5?|3 limit 5?|5 include_line_numbers 8?"];
  }
};
var ReadToolResult = class _ReadToolResult extends __protoMessage313 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadToolResult, a, b);
  }
  static $() {
    return ["ReadToolResult|1 success #0 result|2 error #1 result", ReadToolSuccess, ReadToolError];
  }
};
var ReadRange = class _ReadRange extends __protoMessage313 {
  constructor(data) {
    super();
    this.startLine = 0;
    this.endLine = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadRange().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadRange().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadRange().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadRange, a, b);
  }
  static $() {
    return ["ReadRange|1 start_line 13|2 end_line 13"];
  }
};
var ReadToolSuccess = class _ReadToolSuccess extends __protoMessage313 {
  constructor(data) {
    super();
    this.output = { case: void 0 };
    this.isEmpty = false;
    this.exceededLimit = false;
    this.totalLines = 0;
    this.fileSize = 0;
    this.path = "";
    this.relatedCursorRulePaths = [];
    this.relatedCursorRules = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadToolSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadToolSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadToolSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadToolSuccess, a, b);
  }
  static $() {
    return ["ReadToolSuccess|1 content 9 output|6 data 12 output|9 data_blob_id 12 output|10 content_blob_id 12 output|2 is_empty 8|3 exceeded_limit 8|4 total_lines 13|5 file_size 13|7 path 9|8 read_range #0?|11 include_line_numbers 8?|12 related_cursor_rule_paths 9*|13 related_cursor_rules #1*", ReadRange, CursorRule];
  }
};
var ReadToolError = class _ReadToolError extends __protoMessage313 {
  constructor(data) {
    super();
    this.errorMessage = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadToolError, a, b);
  }
  static $() {
    return ["ReadToolError|1 error_message 9"];
  }
};

