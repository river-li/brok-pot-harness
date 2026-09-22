/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/write_shell_stdin_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage50, __protoMessage347, WriteShellStdinToolCall;
var init_write_shell_stdin_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/write_shell_stdin_tool_pb.js"() {
    "use strict";
    init_esm();
    init_background_shell_exec_pb();
    init_compact();
    __protoPackage50 = "agent.v1.";
    __protoMessage347 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage50;
      }
    };
    WriteShellStdinToolCall = class _WriteShellStdinToolCall extends __protoMessage347 {
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
  }
});

