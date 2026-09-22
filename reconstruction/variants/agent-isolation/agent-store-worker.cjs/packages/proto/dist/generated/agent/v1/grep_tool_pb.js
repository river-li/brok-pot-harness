/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/grep_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage11 = "agent.v1.";
var __protoMessage311 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage11;
  }
};
var GrepToolCall = class _GrepToolCall extends __protoMessage311 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GrepToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GrepToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GrepToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GrepToolCall, a, b);
  }
  static $() {
    return ["GrepToolCall|1 args #0|2 result #1", GrepArgs, GrepResult];
  }
};

