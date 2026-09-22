/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/delete_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage8 = "agent.v1.";
var __protoMessage38 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage8;
  }
};
var DeleteToolCall = class _DeleteToolCall extends __protoMessage38 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteToolCall, a, b);
  }
  static $() {
    return ["DeleteToolCall|1 args #0|2 result #1", DeleteArgs, DeleteResult];
  }
};

