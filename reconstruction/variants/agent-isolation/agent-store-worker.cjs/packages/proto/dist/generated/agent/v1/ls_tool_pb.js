/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/ls_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage17 = "agent.v1.";
var __protoMessage317 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage17;
  }
};
var LsToolCall = class _LsToolCall extends __protoMessage317 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _LsToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _LsToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _LsToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_LsToolCall, a, b);
  }
  static $() {
    return ["LsToolCall|1 args #0|2 result #1", LsArgs, LsResult];
  }
};

