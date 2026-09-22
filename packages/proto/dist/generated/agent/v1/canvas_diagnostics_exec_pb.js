/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/canvas_diagnostics_exec_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage105, __protoMessage3101, CanvasDiagnosticsArgs, CanvasDiagnosticsResult, CanvasDiagnosticsSuccess, CanvasDiagnosticsError;
var init_canvas_diagnostics_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/canvas_diagnostics_exec_pb.js"() {
    "use strict";
    init_esm();
    init_diagnostics_exec_pb();
    init_compact();
    __protoPackage105 = "agent.v1.";
    __protoMessage3101 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage105;
      }
    };
    CanvasDiagnosticsArgs = class _CanvasDiagnosticsArgs extends __protoMessage3101 {
      constructor(data) {
        super();
        this.path = "";
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CanvasDiagnosticsArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CanvasDiagnosticsArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CanvasDiagnosticsArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CanvasDiagnosticsArgs, a, b2);
      }
      static $() {
        return ["CanvasDiagnosticsArgs|1 path 9|2 tool_call_id 9"];
      }
    };
    CanvasDiagnosticsResult = class _CanvasDiagnosticsResult extends __protoMessage3101 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CanvasDiagnosticsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CanvasDiagnosticsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CanvasDiagnosticsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CanvasDiagnosticsResult, a, b2);
      }
      static $() {
        return ["CanvasDiagnosticsResult|1 success #0 result|2 error #1 result|3 canvas_id 9?|4 title 9?|5 save_state 9?|6 save_detail 9?", CanvasDiagnosticsSuccess, CanvasDiagnosticsError];
      }
    };
    CanvasDiagnosticsSuccess = class _CanvasDiagnosticsSuccess extends __protoMessage3101 {
      constructor(data) {
        super();
        this.path = "";
        this.diagnostics = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CanvasDiagnosticsSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CanvasDiagnosticsSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CanvasDiagnosticsSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CanvasDiagnosticsSuccess, a, b2);
      }
      static $() {
        return ["CanvasDiagnosticsSuccess|1 path 9|2 diagnostics #0*", Diagnostic2];
      }
    };
    CanvasDiagnosticsError = class _CanvasDiagnosticsError extends __protoMessage3101 {
      constructor(data) {
        super();
        this.path = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CanvasDiagnosticsError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CanvasDiagnosticsError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CanvasDiagnosticsError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CanvasDiagnosticsError, a, b2);
      }
      static $() {
        return ["CanvasDiagnosticsError|1 path 9|2 error 9"];
      }
    };
  }
});

