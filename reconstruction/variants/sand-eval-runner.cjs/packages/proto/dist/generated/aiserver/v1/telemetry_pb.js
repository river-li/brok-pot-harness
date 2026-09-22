/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/telemetry_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage129 = "aiserver.v1.";
var __protoMessage3127 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage129;
  }
};
var ReportInlineActionRequest = class _ReportInlineActionRequest extends __protoMessage3127 {
  constructor(data) {
    super();
    this.action = "";
    this.generationUuid = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportInlineActionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportInlineActionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportInlineActionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportInlineActionRequest, a, b2);
  }
  static $() {
    return ["ReportInlineActionRequest|1 action 9|2 generation_uuid 9"];
  }
};
var ReportInlineActionResponse = class _ReportInlineActionResponse extends __protoMessage3127 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReportInlineActionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReportInlineActionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReportInlineActionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReportInlineActionResponse, a, b2);
  }
  static $() {
    return ["ReportInlineActionResponse"];
  }
};

