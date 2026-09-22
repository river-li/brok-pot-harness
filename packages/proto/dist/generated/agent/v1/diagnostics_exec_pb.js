/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/diagnostics_exec_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage29, __protoMessage326, DiagnosticSeverity, DiagnosticsArgs, DiagnosticsResult, DiagnosticsSuccess, Diagnostic2, DiagnosticsError, DiagnosticsRejected, DiagnosticsFileNotFound, DiagnosticsPermissionDenied;
var init_diagnostics_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/diagnostics_exec_pb.js"() {
    "use strict";
    init_esm();
    init_utils_pb2();
    init_compact();
    __protoPackage29 = "agent.v1.";
    __protoMessage326 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage29;
      }
    };
    DiagnosticSeverity = /* @__PURE__ */ enumType(proto3, __protoPackage29, "DiagnosticSeverity", [[0, "UNSPECIFIED"], [1, "ERROR"], [2, "WARNING"], [3, "INFORMATION"], [4, "HINT"]], 1);
    DiagnosticsArgs = class _DiagnosticsArgs extends __protoMessage326 {
      constructor(data) {
        super();
        this.path = "";
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiagnosticsArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiagnosticsArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiagnosticsArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiagnosticsArgs, a, b2);
      }
      static $() {
        return ["DiagnosticsArgs|1 path 9|2 tool_call_id 9"];
      }
    };
    DiagnosticsResult = class _DiagnosticsResult extends __protoMessage326 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiagnosticsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiagnosticsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiagnosticsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiagnosticsResult, a, b2);
      }
      static $() {
        return ["DiagnosticsResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 file_not_found #3 result|5 permission_denied #4 result", DiagnosticsSuccess, DiagnosticsError, DiagnosticsRejected, DiagnosticsFileNotFound, DiagnosticsPermissionDenied];
      }
    };
    DiagnosticsSuccess = class _DiagnosticsSuccess extends __protoMessage326 {
      constructor(data) {
        super();
        this.path = "";
        this.diagnostics = [];
        this.totalDiagnostics = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiagnosticsSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiagnosticsSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiagnosticsSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiagnosticsSuccess, a, b2);
      }
      static $() {
        return ["DiagnosticsSuccess|1 path 9|2 diagnostics #0*|3 total_diagnostics 5", Diagnostic2];
      }
    };
    Diagnostic2 = class _Diagnostic extends __protoMessage326 {
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
        return new _Diagnostic().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Diagnostic().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Diagnostic().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Diagnostic, a, b2);
      }
      static $() {
        return ["Diagnostic|1 severity #0|2 range #1|3 message 9|4 source 9|5 code 9|6 is_stale 8", DiagnosticSeverity, Range2];
      }
    };
    DiagnosticsError = class _DiagnosticsError extends __protoMessage326 {
      constructor(data) {
        super();
        this.path = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiagnosticsError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiagnosticsError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiagnosticsError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiagnosticsError, a, b2);
      }
      static $() {
        return ["DiagnosticsError|1 path 9|2 error 9"];
      }
    };
    DiagnosticsRejected = class _DiagnosticsRejected extends __protoMessage326 {
      constructor(data) {
        super();
        this.path = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiagnosticsRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiagnosticsRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiagnosticsRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiagnosticsRejected, a, b2);
      }
      static $() {
        return ["DiagnosticsRejected|1 path 9|2 reason 9"];
      }
    };
    DiagnosticsFileNotFound = class _DiagnosticsFileNotFound extends __protoMessage326 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiagnosticsFileNotFound().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiagnosticsFileNotFound().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiagnosticsFileNotFound().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiagnosticsFileNotFound, a, b2);
      }
      static $() {
        return ["DiagnosticsFileNotFound|1 path 9"];
      }
    };
    DiagnosticsPermissionDenied = class _DiagnosticsPermissionDenied extends __protoMessage326 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DiagnosticsPermissionDenied().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DiagnosticsPermissionDenied().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DiagnosticsPermissionDenied().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DiagnosticsPermissionDenied, a, b2);
      }
      static $() {
        return ["DiagnosticsPermissionDenied|1 path 9"];
      }
    };
  }
});

