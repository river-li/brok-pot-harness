/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/write_shell_stdin_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_background_shell_exec_pb();
init_compact();
var __protoPackage42 = "agent.v1.";
var __protoMessage342 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage42;
  }
};
var WriteShellStdinToolCall = class _WriteShellStdinToolCall extends __protoMessage342 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WriteShellStdinToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WriteShellStdinToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WriteShellStdinToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WriteShellStdinToolCall, a, b2);
  }
  static $() {
    return ["WriteShellStdinToolCall|1 args #0|2 result #1", WriteShellStdinArgs, WriteShellStdinResult];
  }
};

