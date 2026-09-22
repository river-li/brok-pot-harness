/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/cloud_canvas_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage76 = "agent.v1.";
var __protoMessage375 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage76;
  }
};
var WriteCanvasFailReason = /* @__PURE__ */ enumType(proto3, __protoPackage76, "WriteCanvasFailReason", [[0, "UNSPECIFIED"], [1, "TYPECHECK_FAILED"], [2, "COMPILE_FAILED"], [3, "TOO_LARGE"], [4, "UNAVAILABLE"], [5, "NOT_FOUND"], [6, "REFUSED"]], 1);
var ReadCanvasFailReason = /* @__PURE__ */ enumType(proto3, __protoPackage76, "ReadCanvasFailReason", [[0, "UNSPECIFIED"], [1, "NOT_FOUND"], [2, "UNAVAILABLE"], [3, "REFUSED"], [4, "INVALID_REFERENCE"]], 1);
var CloudCanvasToolDiagnosticPosition = class _CloudCanvasToolDiagnosticPosition extends __protoMessage375 {
  constructor(data) {
    super();
    this.line = 0;
    this.character = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CloudCanvasToolDiagnosticPosition().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CloudCanvasToolDiagnosticPosition().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CloudCanvasToolDiagnosticPosition().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CloudCanvasToolDiagnosticPosition, a, b);
  }
  static $() {
    return ["CloudCanvasToolDiagnosticPosition|1 line 5|2 character 5"];
  }
};
var CloudCanvasToolDiagnosticRange = class _CloudCanvasToolDiagnosticRange extends __protoMessage375 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CloudCanvasToolDiagnosticRange().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CloudCanvasToolDiagnosticRange().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CloudCanvasToolDiagnosticRange().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CloudCanvasToolDiagnosticRange, a, b);
  }
  static $() {
    return ["CloudCanvasToolDiagnosticRange|1 start #0|2 end #0", CloudCanvasToolDiagnosticPosition];
  }
};
var CloudCanvasToolDiagnostic = class _CloudCanvasToolDiagnostic extends __protoMessage375 {
  constructor(data) {
    super();
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CloudCanvasToolDiagnostic().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CloudCanvasToolDiagnostic().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CloudCanvasToolDiagnostic().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CloudCanvasToolDiagnostic, a, b);
  }
  static $() {
    return ["CloudCanvasToolDiagnostic|1 message 9|2 code 9?|3 severity 5?|4 range #0?", CloudCanvasToolDiagnosticRange];
  }
};
var WriteCanvasArgs = class _WriteCanvasArgs extends __protoMessage375 {
  constructor(data) {
    super();
    this.contents = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteCanvasArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteCanvasArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteCanvasArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteCanvasArgs, a, b);
  }
  static $() {
    return ["WriteCanvasArgs|1 contents 9|2 canvas_id 9?|3 title 9?"];
  }
};
var WriteCanvasSuccess = class _WriteCanvasSuccess extends __protoMessage375 {
  constructor(data) {
    super();
    this.canvasId = "";
    this.url = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteCanvasSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteCanvasSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteCanvasSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteCanvasSuccess, a, b);
  }
  static $() {
    return ["WriteCanvasSuccess|1 canvas_id 9|2 title 9?|3 url 9"];
  }
};
var WriteCanvasFailure = class _WriteCanvasFailure extends __protoMessage375 {
  constructor(data) {
    super();
    this.reason = WriteCanvasFailReason.UNSPECIFIED;
    this.diagnostics = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteCanvasFailure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteCanvasFailure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteCanvasFailure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteCanvasFailure, a, b);
  }
  static $() {
    return ["WriteCanvasFailure|1 reason #0|2 diagnostics #1*|3 detail 9?", WriteCanvasFailReason, CloudCanvasToolDiagnostic];
  }
};
var WriteCanvasResult = class _WriteCanvasResult extends __protoMessage375 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteCanvasResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteCanvasResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteCanvasResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteCanvasResult, a, b);
  }
  static $() {
    return ["WriteCanvasResult|1 success #0 result|2 failure #1 result", WriteCanvasSuccess, WriteCanvasFailure];
  }
};
var WriteCanvasToolCall = class _WriteCanvasToolCall extends __protoMessage375 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteCanvasToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteCanvasToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteCanvasToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteCanvasToolCall, a, b);
  }
  static $() {
    return ["WriteCanvasToolCall|1 args #0|2 result #1", WriteCanvasArgs, WriteCanvasResult];
  }
};
var ReadCanvasArgs = class _ReadCanvasArgs extends __protoMessage375 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadCanvasArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadCanvasArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadCanvasArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadCanvasArgs, a, b);
  }
  static $() {
    return ["ReadCanvasArgs|1 canvas_id 9?|2 url 9?"];
  }
};
var ReadCanvasSuccess = class _ReadCanvasSuccess extends __protoMessage375 {
  constructor(data) {
    super();
    this.canvasId = "";
    this.url = "";
    this.source = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadCanvasSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadCanvasSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadCanvasSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadCanvasSuccess, a, b);
  }
  static $() {
    return ["ReadCanvasSuccess|1 canvas_id 9|2 title 9?|3 url 9|4 source 9"];
  }
};
var ReadCanvasFailure = class _ReadCanvasFailure extends __protoMessage375 {
  constructor(data) {
    super();
    this.reason = ReadCanvasFailReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadCanvasFailure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadCanvasFailure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadCanvasFailure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadCanvasFailure, a, b);
  }
  static $() {
    return ["ReadCanvasFailure|1 reason #0|2 detail 9?", ReadCanvasFailReason];
  }
};
var ReadCanvasResult = class _ReadCanvasResult extends __protoMessage375 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadCanvasResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadCanvasResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadCanvasResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadCanvasResult, a, b);
  }
  static $() {
    return ["ReadCanvasResult|1 success #0 result|2 failure #1 result", ReadCanvasSuccess, ReadCanvasFailure];
  }
};
var ReadCanvasToolCall = class _ReadCanvasToolCall extends __protoMessage375 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadCanvasToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadCanvasToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadCanvasToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadCanvasToolCall, a, b);
  }
  static $() {
    return ["ReadCanvasToolCall|1 args #0|2 result #1", ReadCanvasArgs, ReadCanvasResult];
  }
};

