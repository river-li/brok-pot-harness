/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/mcp_auth_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage48 = "agent.v1.";
var __protoMessage347 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage48;
  }
};
var McpAuthArgs = class _McpAuthArgs extends __protoMessage347 {
  constructor(data) {
    super();
    this.serverIdentifier = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthArgs, a, b);
  }
  static $() {
    return ["McpAuthArgs|1 server_identifier 9|2 tool_call_id 9"];
  }
};
var McpAuthResult = class _McpAuthResult extends __protoMessage347 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthResult, a, b);
  }
  static $() {
    return ["McpAuthResult|1 success #0 result|2 error #1 result|3 rejected #2 result", McpAuthSuccess, McpAuthError, McpAuthRejected];
  }
};
var McpAuthSuccess = class _McpAuthSuccess extends __protoMessage347 {
  constructor(data) {
    super();
    this.serverIdentifier = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthSuccess, a, b);
  }
  static $() {
    return ["McpAuthSuccess|1 server_identifier 9"];
  }
};
var McpAuthError = class _McpAuthError extends __protoMessage347 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthError, a, b);
  }
  static $() {
    return ["McpAuthError|1 error 9"];
  }
};
var McpAuthRejected = class _McpAuthRejected extends __protoMessage347 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthRejected, a, b);
  }
  static $() {
    return ["McpAuthRejected|1 reason 9"];
  }
};
var McpAuthToolCall = class _McpAuthToolCall extends __protoMessage347 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpAuthToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpAuthToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpAuthToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpAuthToolCall, a, b);
  }
  static $() {
    return ["McpAuthToolCall|1 args #0|2 result #1", McpAuthArgs, McpAuthResult];
  }
};

