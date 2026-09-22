/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/get_mcp_tools_tool_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage54 = "agent.v1.";
var __protoMessage354 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage54;
  }
};
var GetMcpToolsArgs = class _GetMcpToolsArgs extends __protoMessage354 {
  constructor(data) {
    super();
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMcpToolsArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMcpToolsArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMcpToolsArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMcpToolsArgs, a, b2);
  }
  static $() {
    return ["GetMcpToolsArgs|1 server 9?|2 tool_name 9?|3 pattern 9?|4 tool_call_id 9"];
  }
};
var GetMcpToolsAgentResult = class _GetMcpToolsAgentResult extends __protoMessage354 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMcpToolsAgentResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMcpToolsAgentResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMcpToolsAgentResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMcpToolsAgentResult, a, b2);
  }
  static $() {
    return ["GetMcpToolsAgentResult|1 success #0 result|2 error #1 result", GetMcpToolsSuccess, GetMcpToolsError];
  }
};
var GetMcpToolsSuccess = class _GetMcpToolsSuccess extends __protoMessage354 {
  constructor(data) {
    super();
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMcpToolsSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMcpToolsSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMcpToolsSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMcpToolsSuccess, a, b2);
  }
  static $() {
    return ["GetMcpToolsSuccess|1 content 9|2 output_file_path 9?"];
  }
};
var GetMcpToolsError = class _GetMcpToolsError extends __protoMessage354 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMcpToolsError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMcpToolsError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMcpToolsError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMcpToolsError, a, b2);
  }
  static $() {
    return ["GetMcpToolsError|1 error 9"];
  }
};
var GetMcpToolsToolCall = class _GetMcpToolsToolCall extends __protoMessage354 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetMcpToolsToolCall().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetMcpToolsToolCall().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetMcpToolsToolCall().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetMcpToolsToolCall, a, b2);
  }
  static $() {
    return ["GetMcpToolsToolCall|1 args #0|2 result #1", GetMcpToolsArgs, GetMcpToolsAgentResult];
  }
};

