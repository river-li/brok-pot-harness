/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/cloud_canvas_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage88, __protoMessage385, WriteCanvasFailReason, ReadCanvasFailReason, CloudCanvasToolDiagnosticPosition, CloudCanvasToolDiagnosticRange, CloudCanvasToolDiagnostic, WriteCanvasArgs, WriteCanvasSuccess, WriteCanvasFailure, WriteCanvasResult, WriteCanvasToolCall, ReadCanvasArgs, ReadCanvasSuccess, ReadCanvasFailure, ReadCanvasResult, ReadCanvasToolCall;
var init_cloud_canvas_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/cloud_canvas_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage88 = "agent.v1.";
    __protoMessage385 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage88;
      }
    };
    WriteCanvasFailReason = /* @__PURE__ */ enumType(proto3, __protoPackage88, "WriteCanvasFailReason", [[0, "UNSPECIFIED"], [1, "TYPECHECK_FAILED"], [2, "COMPILE_FAILED"], [3, "TOO_LARGE"], [4, "UNAVAILABLE"], [5, "NOT_FOUND"], [6, "REFUSED"]], 1);
    ReadCanvasFailReason = /* @__PURE__ */ enumType(proto3, __protoPackage88, "ReadCanvasFailReason", [[0, "UNSPECIFIED"], [1, "NOT_FOUND"], [2, "UNAVAILABLE"], [3, "REFUSED"], [4, "INVALID_REFERENCE"]], 1);
    CloudCanvasToolDiagnosticPosition = class _CloudCanvasToolDiagnosticPosition extends __protoMessage385 {
      constructor(data) {
        super();
        this.line = 0;
        this.character = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloudCanvasToolDiagnosticPosition().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloudCanvasToolDiagnosticPosition().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloudCanvasToolDiagnosticPosition().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloudCanvasToolDiagnosticPosition, a, b2);
      }
      static $() {
        return ["CloudCanvasToolDiagnosticPosition|1 line 5|2 character 5"];
      }
    };
    CloudCanvasToolDiagnosticRange = class _CloudCanvasToolDiagnosticRange extends __protoMessage385 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloudCanvasToolDiagnosticRange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloudCanvasToolDiagnosticRange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloudCanvasToolDiagnosticRange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloudCanvasToolDiagnosticRange, a, b2);
      }
      static $() {
        return ["CloudCanvasToolDiagnosticRange|1 start #0|2 end #0", CloudCanvasToolDiagnosticPosition];
      }
    };
    CloudCanvasToolDiagnostic = class _CloudCanvasToolDiagnostic extends __protoMessage385 {
      constructor(data) {
        super();
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloudCanvasToolDiagnostic().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloudCanvasToolDiagnostic().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloudCanvasToolDiagnostic().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloudCanvasToolDiagnostic, a, b2);
      }
      static $() {
        return ["CloudCanvasToolDiagnostic|1 message 9|2 code 9?|3 severity 5?|4 range #0?", CloudCanvasToolDiagnosticRange];
      }
    };
    WriteCanvasArgs = class _WriteCanvasArgs extends __protoMessage385 {
      constructor(data) {
        super();
        this.contents = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteCanvasArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteCanvasArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteCanvasArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteCanvasArgs, a, b2);
      }
      static $() {
        return ["WriteCanvasArgs|1 contents 9|2 canvas_id 9?|3 title 9?"];
      }
    };
    WriteCanvasSuccess = class _WriteCanvasSuccess extends __protoMessage385 {
      constructor(data) {
        super();
        this.canvasId = "";
        this.url = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteCanvasSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteCanvasSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteCanvasSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteCanvasSuccess, a, b2);
      }
      static $() {
        return ["WriteCanvasSuccess|1 canvas_id 9|2 title 9?|3 url 9"];
      }
    };
    WriteCanvasFailure = class _WriteCanvasFailure extends __protoMessage385 {
      constructor(data) {
        super();
        this.reason = WriteCanvasFailReason.UNSPECIFIED;
        this.diagnostics = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteCanvasFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteCanvasFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteCanvasFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteCanvasFailure, a, b2);
      }
      static $() {
        return ["WriteCanvasFailure|1 reason #0|2 diagnostics #1*|3 detail 9?", WriteCanvasFailReason, CloudCanvasToolDiagnostic];
      }
    };
    WriteCanvasResult = class _WriteCanvasResult extends __protoMessage385 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteCanvasResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteCanvasResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteCanvasResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteCanvasResult, a, b2);
      }
      static $() {
        return ["WriteCanvasResult|1 success #0 result|2 failure #1 result", WriteCanvasSuccess, WriteCanvasFailure];
      }
    };
    WriteCanvasToolCall = class _WriteCanvasToolCall extends __protoMessage385 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteCanvasToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteCanvasToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteCanvasToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteCanvasToolCall, a, b2);
      }
      static $() {
        return ["WriteCanvasToolCall|1 args #0|2 result #1", WriteCanvasArgs, WriteCanvasResult];
      }
    };
    ReadCanvasArgs = class _ReadCanvasArgs extends __protoMessage385 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadCanvasArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadCanvasArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadCanvasArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadCanvasArgs, a, b2);
      }
      static $() {
        return ["ReadCanvasArgs|1 canvas_id 9?|2 url 9?"];
      }
    };
    ReadCanvasSuccess = class _ReadCanvasSuccess extends __protoMessage385 {
      constructor(data) {
        super();
        this.canvasId = "";
        this.url = "";
        this.source = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadCanvasSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadCanvasSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadCanvasSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadCanvasSuccess, a, b2);
      }
      static $() {
        return ["ReadCanvasSuccess|1 canvas_id 9|2 title 9?|3 url 9|4 source 9"];
      }
    };
    ReadCanvasFailure = class _ReadCanvasFailure extends __protoMessage385 {
      constructor(data) {
        super();
        this.reason = ReadCanvasFailReason.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadCanvasFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadCanvasFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadCanvasFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadCanvasFailure, a, b2);
      }
      static $() {
        return ["ReadCanvasFailure|1 reason #0|2 detail 9?", ReadCanvasFailReason];
      }
    };
    ReadCanvasResult = class _ReadCanvasResult extends __protoMessage385 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadCanvasResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadCanvasResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadCanvasResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadCanvasResult, a, b2);
      }
      static $() {
        return ["ReadCanvasResult|1 success #0 result|2 failure #1 result", ReadCanvasSuccess, ReadCanvasFailure];
      }
    };
    ReadCanvasToolCall = class _ReadCanvasToolCall extends __protoMessage385 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadCanvasToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadCanvasToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadCanvasToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadCanvasToolCall, a, b2);
      }
      static $() {
        return ["ReadCanvasToolCall|1 args #0|2 result #1", ReadCanvasArgs, ReadCanvasResult];
      }
    };
  }
});

