/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/record_screen_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage35 = "agent.v1.";
var __protoMessage334 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage35;
  }
};
var RecordScreenToolCall = class _RecordScreenToolCall extends __protoMessage334 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenToolCall, a, b);
  }
  static $() {
    return ["RecordScreenToolCall|1 args #0|2 result #1", RecordScreenArgs, RecordScreenResult];
  }
};

