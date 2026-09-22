/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/ls_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_ls_exec_pb();
init_compact();
var __protoPackage19 = "agent.v1.";
var __protoMessage319 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage19;
  }
};
var LsToolCall = class _LsToolCall extends __protoMessage319 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LsToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LsToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LsToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LsToolCall, a, b2);
  }
  static $() {
    return ["LsToolCall|1 args #0|2 result #1", LsArgs, LsResult];
  }
};

