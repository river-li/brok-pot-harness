/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/record_screen_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_record_screen_exec_pb();
init_compact();
var __protoPackage39 = "agent.v1.";
var __protoMessage339 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage39;
  }
};
var RecordScreenToolCall = class _RecordScreenToolCall extends __protoMessage339 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecordScreenToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecordScreenToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecordScreenToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecordScreenToolCall, a, b2);
  }
  static $() {
    return ["RecordScreenToolCall|1 args #0|2 result #1", RecordScreenArgs, RecordScreenResult];
  }
};

