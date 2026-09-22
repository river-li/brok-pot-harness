/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/write_shell_stdin_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage38 = "agent.v1.";
var __protoMessage337 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage38;
  }
};
var WriteShellStdinToolCall = class _WriteShellStdinToolCall extends __protoMessage337 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _WriteShellStdinToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _WriteShellStdinToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _WriteShellStdinToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_WriteShellStdinToolCall, a, b);
  }
  static $() {
    return ["WriteShellStdinToolCall|1 args #0|2 result #1", WriteShellStdinArgs, WriteShellStdinResult];
  }
};

