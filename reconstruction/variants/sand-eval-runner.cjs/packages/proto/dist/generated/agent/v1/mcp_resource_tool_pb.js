/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/mcp_resource_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage31 = "agent.v1.";
var __protoMessage331 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage31;
  }
};
var ListMcpResourcesToolCall = class _ListMcpResourcesToolCall extends __protoMessage331 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMcpResourcesToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMcpResourcesToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMcpResourcesToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMcpResourcesToolCall, a, b2);
  }
  static $() {
    return ["ListMcpResourcesToolCall|1 args #0|2 result #1", ListMcpResourcesExecArgs, ListMcpResourcesExecResult];
  }
};
var ReadMcpResourceToolCall = class _ReadMcpResourceToolCall extends __protoMessage331 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadMcpResourceToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadMcpResourceToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadMcpResourceToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadMcpResourceToolCall, a, b2);
  }
  static $() {
    return ["ReadMcpResourceToolCall|1 args #0|2 result #1", ReadMcpResourceExecArgs, ReadMcpResourceExecResult];
  }
};

