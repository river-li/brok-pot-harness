/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/fetch_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage31 = "agent.v1.";
var __protoMessage330 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage31;
  }
};
var FetchToolCall = class _FetchToolCall extends __protoMessage330 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchToolCall, a, b);
  }
  static $() {
    return ["FetchToolCall|1 args #0|2 result #1", FetchArgs, FetchResult];
  }
};

