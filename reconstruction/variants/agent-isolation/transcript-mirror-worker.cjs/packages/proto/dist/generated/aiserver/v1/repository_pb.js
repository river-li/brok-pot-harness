/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/repository_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage23 = "aiserver.v1.";
var __protoMessage322 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage23;
  }
};
var CodeResult = class _CodeResult extends __protoMessage322 {
  constructor(data) {
    super();
    this.score = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CodeResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CodeResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CodeResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CodeResult, a, b);
  }
  static $() {
    return ["CodeResult|1 code_block #0|2 score 2", CodeBlock];
  }
};

