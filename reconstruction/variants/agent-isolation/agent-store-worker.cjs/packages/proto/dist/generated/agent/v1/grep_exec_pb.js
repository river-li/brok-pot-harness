/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/grep_exec_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage10 = "agent.v1.";
var __protoMessage310 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage10;
  }
};
var GrepArgs = class _GrepArgs extends __protoMessage310 {
  constructor(data) {
    super();
    this.pattern = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepArgs, a, b);
  }
  static $() {
    return ["GrepArgs|1 pattern 9|2 path 9?|3 glob 9?|4 output_mode 9?|5 context_before 5?|6 context_after 5?|7 context 5?|8 case_insensitive 8?|9 type 9?|10 head_limit 5?|11 multiline 8?|12 sort 9?|13 sort_ascending 8?|14 tool_call_id 9|15 sandbox_policy #0?|16 offset 5?", SandboxPolicy];
  }
};
var GrepResult = class _GrepResult extends __protoMessage310 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepResult, a, b);
  }
  static $() {
    return ["GrepResult|1 success #0 result|2 error #1 result", GrepSuccess, GrepError];
  }
};
var GrepError = class _GrepError extends __protoMessage310 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepError, a, b);
  }
  static $() {
    return ["GrepError|1 error 9"];
  }
};
var GrepSuccess = class _GrepSuccess extends __protoMessage310 {
  constructor(data) {
    super();
    this.pattern = "";
    this.path = "";
    this.outputMode = "";
    this.workspaceResults = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepSuccess, a, b);
  }
  static $() {
    return ["GrepSuccess|1 pattern 9|2 path 9|3 output_mode 9|4 workspace_results 9,#0|5 active_editor_result #0?", GrepUnionResult];
  }
};
var GrepUnionResult = class _GrepUnionResult extends __protoMessage310 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepUnionResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepUnionResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepUnionResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepUnionResult, a, b);
  }
  static $() {
    return ["GrepUnionResult|1 count #0 result|2 files #1 result|3 content #2 result", GrepCountResult, GrepFilesResult, GrepContentResult];
  }
};
var GrepCountResult = class _GrepCountResult extends __protoMessage310 {
  constructor(data) {
    super();
    this.counts = [];
    this.totalFiles = 0;
    this.totalMatches = 0;
    this.clientTruncated = false;
    this.ripgrepTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepCountResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepCountResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepCountResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepCountResult, a, b);
  }
  static $() {
    return ["GrepCountResult|1 counts #0*|2 total_files 5|3 total_matches 5|4 client_truncated 8|5 ripgrep_truncated 8|6 head_limit_applied 5?|7 offset_applied 5?", GrepFileCount];
  }
};
var GrepFileCount = class _GrepFileCount extends __protoMessage310 {
  constructor(data) {
    super();
    this.file = "";
    this.count = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepFileCount().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepFileCount().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepFileCount().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepFileCount, a, b);
  }
  static $() {
    return ["GrepFileCount|1 file 9|2 count 5"];
  }
};
var GrepFilesResult = class _GrepFilesResult extends __protoMessage310 {
  constructor(data) {
    super();
    this.files = [];
    this.totalFiles = 0;
    this.clientTruncated = false;
    this.ripgrepTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepFilesResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepFilesResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepFilesResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepFilesResult, a, b);
  }
  static $() {
    return ["GrepFilesResult|1 files 9*|2 total_files 5|3 client_truncated 8|4 ripgrep_truncated 8|5 head_limit_applied 5?|6 offset_applied 5?"];
  }
};
var GrepContentResult = class _GrepContentResult extends __protoMessage310 {
  constructor(data) {
    super();
    this.matches = [];
    this.totalLines = 0;
    this.totalMatchedLines = 0;
    this.clientTruncated = false;
    this.ripgrepTruncated = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepContentResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepContentResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepContentResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepContentResult, a, b);
  }
  static $() {
    return ["GrepContentResult|1 matches #0*|2 total_lines 5|3 total_matched_lines 5|4 client_truncated 8|5 ripgrep_truncated 8|6 head_limit_applied 5?|7 offset_applied 5?", GrepFileMatch];
  }
};
var GrepFileMatch = class _GrepFileMatch extends __protoMessage310 {
  constructor(data) {
    super();
    this.file = "";
    this.matches = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepFileMatch().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepFileMatch().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepFileMatch().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepFileMatch, a, b);
  }
  static $() {
    return ["GrepFileMatch|1 file 9|2 matches #0*", GrepContentMatch];
  }
};
var GrepContentMatch = class _GrepContentMatch extends __protoMessage310 {
  constructor(data) {
    super();
    this.lineNumber = 0;
    this.content = "";
    this.contentTruncated = false;
    this.isContextLine = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepContentMatch().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepContentMatch().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepContentMatch().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepContentMatch, a, b);
  }
  static $() {
    return ["GrepContentMatch|1 line_number 5|2 content 9|3 content_truncated 8|4 is_context_line 8"];
  }
};

