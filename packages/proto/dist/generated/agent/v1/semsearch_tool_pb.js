/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/semsearch_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage36, __protoMessage333, SemSearchToolCall, SemSearchToolArgs, SemSearchToolResult, SemSearchToolSuccess, SemSearchToolError;
var init_semsearch_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/semsearch_tool_pb.js"() {
    "use strict";
    init_esm();
    init_repository_pb();
    init_compact();
    __protoPackage36 = "agent.v1.";
    __protoMessage333 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage36;
      }
    };
    SemSearchToolCall = class _SemSearchToolCall extends __protoMessage333 {
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
    SemSearchToolArgs = class _SemSearchToolArgs extends __protoMessage333 {
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
    SemSearchToolResult = class _SemSearchToolResult extends __protoMessage333 {
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
    SemSearchToolSuccess = class _SemSearchToolSuccess extends __protoMessage333 {
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
    SemSearchToolError = class _SemSearchToolError extends __protoMessage333 {
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
  }
});

