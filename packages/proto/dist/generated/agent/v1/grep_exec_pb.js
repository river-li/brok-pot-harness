var __protoPackage21, __protoMessage318, GrepArgs, GrepResult, GrepError, GrepSuccess, GrepUnionResult, GrepCountResult, GrepFileCount, GrepFilesResult, GrepContentResult, GrepFileMatch, GrepContentMatch;
var init_grep_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/grep_exec_pb.js"() {
    "use strict";
    init_esm();
    init_sandbox_pb();
    init_compact();
    __protoPackage21 = "agent.v1.";
    __protoMessage318 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage21;
      }
    };
    GrepArgs = class _GrepArgs extends __protoMessage318 {
      constructor(data) {
        super();
        this.pattern = "";
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepArgs, a, b2);
      }
      static $() {
        return ["GrepArgs|1 pattern 9|2 path 9?|3 glob 9?|4 output_mode 9?|5 context_before 5?|6 context_after 5?|7 context 5?|8 case_insensitive 8?|9 type 9?|10 head_limit 5?|11 multiline 8?|12 sort 9?|13 sort_ascending 8?|14 tool_call_id 9|15 sandbox_policy #0?|16 offset 5?", SandboxPolicy];
      }
    };
    GrepResult = class _GrepResult extends __protoMessage318 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepResult, a, b2);
      }
      static $() {
        return ["GrepResult|1 success #0 result|2 error #1 result", GrepSuccess, GrepError];
      }
    };
    GrepError = class _GrepError extends __protoMessage318 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepError, a, b2);
      }
      static $() {
        return ["GrepError|1 error 9"];
      }
    };
    GrepSuccess = class _GrepSuccess extends __protoMessage318 {
      constructor(data) {
        super();
        this.pattern = "";
        this.path = "";
        this.outputMode = "";
        this.workspaceResults = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepSuccess, a, b2);
      }
      static $() {
        return ["GrepSuccess|1 pattern 9|2 path 9|3 output_mode 9|4 workspace_results 9,#0|5 active_editor_result #0?", GrepUnionResult];
      }
    };
    GrepUnionResult = class _GrepUnionResult extends __protoMessage318 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepUnionResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepUnionResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepUnionResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepUnionResult, a, b2);
      }
      static $() {
        return ["GrepUnionResult|1 count #0 result|2 files #1 result|3 content #2 result", GrepCountResult, GrepFilesResult, GrepContentResult];
      }
    };
    GrepCountResult = class _GrepCountResult extends __protoMessage318 {
      constructor(data) {
        super();
        this.counts = [];
        this.totalFiles = 0;
        this.totalMatches = 0;
        this.clientTruncated = false;
        this.ripgrepTruncated = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepCountResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepCountResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepCountResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepCountResult, a, b2);
      }
      static $() {
        return ["GrepCountResult|1 counts #0*|2 total_files 5|3 total_matches 5|4 client_truncated 8|5 ripgrep_truncated 8|6 head_limit_applied 5?|7 offset_applied 5?", GrepFileCount];
      }
    };
    GrepFileCount = class _GrepFileCount extends __protoMessage318 {
      constructor(data) {
        super();
        this.file = "";
        this.count = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepFileCount().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepFileCount().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepFileCount().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepFileCount, a, b2);
      }
      static $() {
        return ["GrepFileCount|1 file 9|2 count 5"];
      }
    };
    GrepFilesResult = class _GrepFilesResult extends __protoMessage318 {
      constructor(data) {
        super();
        this.files = [];
        this.totalFiles = 0;
        this.clientTruncated = false;
        this.ripgrepTruncated = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepFilesResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepFilesResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepFilesResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepFilesResult, a, b2);
      }
      static $() {
        return ["GrepFilesResult|1 files 9*|2 total_files 5|3 client_truncated 8|4 ripgrep_truncated 8|5 head_limit_applied 5?|6 offset_applied 5?"];
      }
    };
    GrepContentResult = class _GrepContentResult extends __protoMessage318 {
      constructor(data) {
        super();
        this.matches = [];
        this.totalLines = 0;
        this.totalMatchedLines = 0;
        this.clientTruncated = false;
        this.ripgrepTruncated = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepContentResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepContentResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepContentResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepContentResult, a, b2);
      }
      static $() {
        return ["GrepContentResult|1 matches #0*|2 total_lines 5|3 total_matched_lines 5|4 client_truncated 8|5 ripgrep_truncated 8|6 head_limit_applied 5?|7 offset_applied 5?", GrepFileMatch];
      }
    };
    GrepFileMatch = class _GrepFileMatch extends __protoMessage318 {
      constructor(data) {
        super();
        this.file = "";
        this.matches = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepFileMatch().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepFileMatch().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepFileMatch().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepFileMatch, a, b2);
      }
      static $() {
        return ["GrepFileMatch|1 file 9|2 matches #0*", GrepContentMatch];
      }
    };
    GrepContentMatch = class _GrepContentMatch extends __protoMessage318 {
      constructor(data) {
        super();
        this.lineNumber = 0;
        this.content = "";
        this.contentTruncated = false;
        this.isContextLine = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrepContentMatch().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrepContentMatch().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrepContentMatch().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrepContentMatch, a, b2);
      }
      static $() {
        return ["GrepContentMatch|1 line_number 5|2 content 9|3 content_truncated 8|4 is_context_line 8"];
      }
    };
  }
});
