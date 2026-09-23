var __protoPackage31, __protoMessage327, ReadLintsToolCall, ReadLintsToolArgs, ReadLintsToolResult, ReadLintsToolSuccess, FileDiagnostics, DiagnosticItem, DiagnosticRange, ReadLintsToolError;
var init_read_lints_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/read_lints_tool_pb.js"() {
    "use strict";
    init_esm();
    init_diagnostics_exec_pb();
    init_utils_pb2();
    init_compact();
    __protoPackage31 = "agent.v1.";
    __protoMessage327 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage31;
      }
    };
    ReadLintsToolCall = class _ReadLintsToolCall extends __protoMessage327 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadLintsToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadLintsToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadLintsToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadLintsToolCall, a, b2);
      }
      static $() {
        return ["ReadLintsToolCall|1 args #0|2 result #1", ReadLintsToolArgs, ReadLintsToolResult];
      }
    };
    ReadLintsToolArgs = class _ReadLintsToolArgs extends __protoMessage327 {
      constructor(data) {
        super();
        this.paths = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadLintsToolArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadLintsToolArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadLintsToolArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadLintsToolArgs, a, b2);
      }
      static $() {
        return ["ReadLintsToolArgs|1 paths 9*"];
      }
    };
    ReadLintsToolResult = class _ReadLintsToolResult extends __protoMessage327 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadLintsToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadLintsToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadLintsToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadLintsToolResult, a, b2);
      }
      static $() {
        return ["ReadLintsToolResult|1 success #0 result|2 error #1 result", ReadLintsToolSuccess, ReadLintsToolError];
      }
    };
    ReadLintsToolSuccess = class _ReadLintsToolSuccess extends __protoMessage327 {
      constructor(data) {
        super();
        this.fileDiagnostics = [];
        this.totalFiles = 0;
        this.totalDiagnostics = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadLintsToolSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadLintsToolSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadLintsToolSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadLintsToolSuccess, a, b2);
      }
      static $() {
        return ["ReadLintsToolSuccess|1 file_diagnostics #0*|2 total_files 5|3 total_diagnostics 5", FileDiagnostics];
      }
    };
    FileDiagnostics = class _FileDiagnostics extends __protoMessage327 {
      constructor(data) {
        super();
        this.path = "";
        this.diagnostics = [];
        this.diagnosticsCount = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FileDiagnostics().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FileDiagnostics().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FileDiagnostics().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FileDiagnostics, a, b2);
      }
      static $() {
        return ["FileDiagnostics|1 path 9|2 diagnostics #0*|3 diagnostics_count 5", DiagnosticItem];
      }
    };
    DiagnosticItem = class _DiagnosticItem extends __protoMessage327 {
      constructor(data) {
        super();
        this.severity = DiagnosticSeverity.UNSPECIFIED;
        this.message = "";
        this.source = "";
        this.code = "";
        this.isStale = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiagnosticItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiagnosticItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiagnosticItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiagnosticItem, a, b2);
      }
      static $() {
        return ["DiagnosticItem|1 severity #0|2 range #1|3 message 9|4 source 9|5 code 9|6 is_stale 8", DiagnosticSeverity, DiagnosticRange];
      }
    };
    DiagnosticRange = class _DiagnosticRange extends __protoMessage327 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiagnosticRange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiagnosticRange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiagnosticRange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiagnosticRange, a, b2);
      }
      static $() {
        return ["DiagnosticRange|1 start #0|2 end #0", Position];
      }
    };
    ReadLintsToolError = class _ReadLintsToolError extends __protoMessage327 {
      constructor(data) {
        super();
        this.errorMessage = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadLintsToolError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadLintsToolError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadLintsToolError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadLintsToolError, a, b2);
      }
      static $() {
        return ["ReadLintsToolError|1 error_message 9"];
      }
    };
  }
});
