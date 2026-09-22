/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/shell_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage6 = "agent.v1.";
var __protoMessage36 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage6;
  }
};
var ShellToolCall = class _ShellToolCall extends __protoMessage36 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellToolCall, a, b);
  }
  static $() {
    return ["ShellToolCall|1 args #0|2 result #1|3 description 9?", ShellArgs, ShellResult];
  }
};

