/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/mcp_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage21 = "agent.v1.";
var __protoMessage320 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage21;
  }
};
var McpToolError = class _McpToolError extends __protoMessage320 {
  constructor(data) {
    super();
    this.error = "";
    this.readToolDefReminder = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpToolError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpToolError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpToolError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpToolError, a, b);
  }
  static $() {
    return ["McpToolError|1 error 9|2 read_tool_def_reminder 9"];
  }
};
var McpToolResult = class _McpToolResult extends __protoMessage320 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpToolResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpToolResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpToolResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpToolResult, a, b);
  }
  static $() {
    return ["McpToolResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 permission_denied #3 result", McpSuccess, McpToolError, McpRejected, McpPermissionDenied];
  }
};
var McpToolCall = class _McpToolCall extends __protoMessage320 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpToolCall, a, b);
  }
  static $() {
    return ["McpToolCall|1 args #0|2 result #1|3 description 9?", McpArgs, McpToolResult];
  }
};

