/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/mcp_resource_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage27 = "agent.v1.";
var __protoMessage326 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage27;
  }
};
var ListMcpResourcesToolCall = class _ListMcpResourcesToolCall extends __protoMessage326 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesToolCall, a, b);
  }
  static $() {
    return ["ListMcpResourcesToolCall|1 args #0|2 result #1", ListMcpResourcesExecArgs, ListMcpResourcesExecResult];
  }
};
var ReadMcpResourceToolCall = class _ReadMcpResourceToolCall extends __protoMessage326 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceToolCall, a, b);
  }
  static $() {
    return ["ReadMcpResourceToolCall|1 args #0|2 result #1", ReadMcpResourceExecArgs, ReadMcpResourceExecResult];
  }
};

