/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/mcp_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_esm13();
init_utils_pb();

// @recovered-fragment 2/2
init_compact();
var __protoPackage23 = "agent.v1.";
var __protoMessage323 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage23;
  }
};
var McpArgs = class _McpArgs extends __protoMessage323 {
  constructor(data) {
    super();
    this.name = "";
    this.args = {};
    this.toolCallId = "";
    this.providerIdentifier = "";
    this.toolName = "";
    this.smartModeApprovalOnly = false;
    this.skipApproval = false;
    this.serverIdentifier = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpArgs, a, b2);
  }
  static $() {
    return ["McpArgs|1 name 9|2 args 9,#0|3 tool_call_id 9|4 provider_identifier 9|5 tool_name 9|6 smart_mode_approval #1?|7 smart_mode_approval_only 8|8 skip_approval 8|9 server_identifier 9", Value, SmartModeApproval];
  }
};
var McpResult = class _McpResult extends __protoMessage323 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpResult, a, b2);
  }
  static $() {
    return ["McpResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 permission_denied #3 result|5 tool_not_found #4 result|6 server_not_found #5 result|7 approved #6 result", McpSuccess, McpError, McpRejected, McpPermissionDenied, McpToolNotFound, McpServerNotFound, McpApproved];
  }
};
var McpApproved = class _McpApproved extends __protoMessage323 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpApproved().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpApproved().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpApproved().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpApproved, a, b2);
  }
  static $() {
    return ["McpApproved"];
  }
};
var McpToolNotFound = class _McpToolNotFound extends __protoMessage323 {
  constructor(data) {
    super();
    this.name = "";
    this.availableTools = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpToolNotFound().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpToolNotFound().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpToolNotFound().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpToolNotFound, a, b2);
  }
  static $() {
    return ["McpToolNotFound|1 name 9|2 available_tools 9*"];
  }
};
var McpServerNotFound = class _McpServerNotFound extends __protoMessage323 {
  constructor(data) {
    super();
    this.name = "";
    this.availableServers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpServerNotFound().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpServerNotFound().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpServerNotFound().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpServerNotFound, a, b2);
  }
  static $() {
    return ["McpServerNotFound|1 name 9|2 available_servers 9*"];
  }
};
var McpTextContent = class _McpTextContent extends __protoMessage323 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpTextContent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpTextContent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpTextContent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpTextContent, a, b2);
  }
  static $() {
    return ["McpTextContent|1 text 9|2 output_location #0?", OutputLocation];
  }
};
var McpImageContent = class _McpImageContent extends __protoMessage323 {
  constructor(data) {
    super();
    this.data = new Uint8Array(0);
    this.mimeType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpImageContent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpImageContent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpImageContent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpImageContent, a, b2);
  }
  static $() {
    return ["McpImageContent|1 data 12|2 mime_type 9"];
  }
};
var McpToolResultContentItem = class _McpToolResultContentItem extends __protoMessage323 {
  constructor(data) {
    super();
    this.content = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpToolResultContentItem().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpToolResultContentItem().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpToolResultContentItem().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpToolResultContentItem, a, b2);
  }
  static $() {
    return ["McpToolResultContentItem|1 text #0 content|2 image #1 content", McpTextContent, McpImageContent];
  }
};
var McpSuccess = class _McpSuccess extends __protoMessage323 {
  constructor(data) {
    super();
    this.content = [];
    this.isError = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpSuccess, a, b2);
  }
  static $() {
    return ["McpSuccess|1 content #0*|2 is_error 8|3 structured_content #1", McpToolResultContentItem, Struct];
  }
};
var McpError = class _McpError extends __protoMessage323 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpError, a, b2);
  }
  static $() {
    return ["McpError|1 error 9|2 needs_auth 8?"];
  }
};
var McpRejected = class _McpRejected extends __protoMessage323 {
  constructor(data) {
    super();
    this.reason = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpRejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpRejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpRejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpRejected, a, b2);
  }
  static $() {
    return ["McpRejected|1 reason 9|2 is_readonly 8"];
  }
};
var McpPermissionDenied = class _McpPermissionDenied extends __protoMessage323 {
  constructor(data) {
    super();
    this.error = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpPermissionDenied().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpPermissionDenied().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpPermissionDenied().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpPermissionDenied, a, b2);
  }
  static $() {
    return ["McpPermissionDenied|1 error 9|2 is_readonly 8"];
  }
};
var McpStateExecArgs = class _McpStateExecArgs extends __protoMessage323 {
  constructor(data) {
    super();
    this.serverIdentifiers = [];
    this.kickOnly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpStateExecArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpStateExecArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpStateExecArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpStateExecArgs, a, b2);
  }
  static $() {
    return ["McpStateExecArgs|1 server_identifiers 9*|2 kick_only 8"];
  }
};
var McpStateExecResult = class _McpStateExecResult extends __protoMessage323 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpStateExecResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpStateExecResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpStateExecResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpStateExecResult, a, b2);
  }
  static $() {
    return ["McpStateExecResult|1 success #0 result|2 error #1 result|3 rejected #2 result", McpStateSuccess, McpStateError, McpStateRejected];
  }
};
var McpStateServer = class _McpStateServer extends __protoMessage323 {
  constructor(data) {
    super();
    this.serverName = "";
    this.serverIdentifier = "";
    this.tools = [];
    this.instructions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpStateServer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpStateServer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpStateServer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpStateServer, a, b2);
  }
  static $() {
    return ["McpStateServer|1 server_name 9|2 server_identifier 9|3 plugin 9?|4 marketplace 9?|5 tools #0*|6 instructions #1*|7 status 9?|8 error_message 9?", McpToolDefinition, McpInstructions];
  }
};
var McpStateSuccess = class _McpStateSuccess extends __protoMessage323 {
  constructor(data) {
    super();
    this.servers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpStateSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpStateSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpStateSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpStateSuccess, a, b2);
  }
  static $() {
    return ["McpStateSuccess|1 servers #0*", McpStateServer];
  }
};
var McpStateError = class _McpStateError extends __protoMessage323 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpStateError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpStateError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpStateError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpStateError, a, b2);
  }
  static $() {
    return ["McpStateError|1 error 9"];
  }
};
var McpStateRejected = class _McpStateRejected extends __protoMessage323 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpStateRejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpStateRejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpStateRejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpStateRejected, a, b2);
  }
  static $() {
    return ["McpStateRejected|1 reason 9"];
  }
};
var ListMcpResourcesExecArgs = class _ListMcpResourcesExecArgs extends __protoMessage323 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMcpResourcesExecArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMcpResourcesExecArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMcpResourcesExecArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMcpResourcesExecArgs, a, b2);
  }
  static $() {
    return ["ListMcpResourcesExecArgs|1 server 9?"];
  }
};
var ListMcpResourcesExecResult = class _ListMcpResourcesExecResult extends __protoMessage323 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMcpResourcesExecResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMcpResourcesExecResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMcpResourcesExecResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMcpResourcesExecResult, a, b2);
  }
  static $() {
    return ["ListMcpResourcesExecResult|1 success #0 result|2 error #1 result|3 rejected #2 result", ListMcpResourcesSuccess, ListMcpResourcesError, ListMcpResourcesRejected];
  }
};
var ListMcpResourcesExecResult_McpResource = class _ListMcpResourcesExecResult_McpResource extends __protoMessage323 {
  constructor(data) {
    super();
    this.uri = "";
    this.server = "";
    this.annotations = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMcpResourcesExecResult_McpResource().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMcpResourcesExecResult_McpResource().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMcpResourcesExecResult_McpResource().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMcpResourcesExecResult_McpResource, a, b2);
  }
  static $() {
    return ["ListMcpResourcesExecResult.McpResource|1 uri 9|2 name 9?|3 description 9?|4 mime_type 9?|5 server 9|6 annotations 9,9"];
  }
};
var ListMcpResourcesSuccess = class _ListMcpResourcesSuccess extends __protoMessage323 {
  constructor(data) {
    super();
    this.resources = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMcpResourcesSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMcpResourcesSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMcpResourcesSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMcpResourcesSuccess, a, b2);
  }
  static $() {
    return ["ListMcpResourcesSuccess|1 resources #0*", ListMcpResourcesExecResult_McpResource];
  }
};
var ListMcpResourcesError = class _ListMcpResourcesError extends __protoMessage323 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMcpResourcesError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMcpResourcesError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMcpResourcesError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMcpResourcesError, a, b2);
  }
  static $() {
    return ["ListMcpResourcesError|1 error 9"];
  }
};
var ListMcpResourcesRejected = class _ListMcpResourcesRejected extends __protoMessage323 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListMcpResourcesRejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListMcpResourcesRejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListMcpResourcesRejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListMcpResourcesRejected, a, b2);
  }
  static $() {
    return ["ListMcpResourcesRejected|1 reason 9"];
  }
};
var ReadMcpResourceExecArgs = class _ReadMcpResourceExecArgs extends __protoMessage323 {
  constructor(data) {
    super();
    this.server = "";
    this.uri = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadMcpResourceExecArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadMcpResourceExecArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadMcpResourceExecArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadMcpResourceExecArgs, a, b2);
  }
  static $() {
    return ["ReadMcpResourceExecArgs|1 server 9|2 uri 9|3 download_path 9?|4 tool_call_id 9|5 smart_mode_approval #0?", SmartModeApproval];
  }
};
var ReadMcpResourceExecResult = class _ReadMcpResourceExecResult extends __protoMessage323 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadMcpResourceExecResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadMcpResourceExecResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadMcpResourceExecResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadMcpResourceExecResult, a, b2);
  }
  static $() {
    return ["ReadMcpResourceExecResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 not_found #3 result", ReadMcpResourceSuccess, ReadMcpResourceError, ReadMcpResourceRejected, ReadMcpResourceNotFound];
  }
};
var ReadMcpResourceSuccess = class _ReadMcpResourceSuccess extends __protoMessage323 {
  constructor(data) {
    super();
    this.uri = "";
    this.content = { case: void 0 };
    this.annotations = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadMcpResourceSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadMcpResourceSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadMcpResourceSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadMcpResourceSuccess, a, b2);
  }
  static $() {
    return ["ReadMcpResourceSuccess|1 uri 9|2 name 9?|3 description 9?|4 mime_type 9?|5 text 9 content|6 blob 12 content|7 annotations 9,9|8 download_path 9?|9 output_location #0?", OutputLocation];
  }
};
var ReadMcpResourceError = class _ReadMcpResourceError extends __protoMessage323 {
  constructor(data) {
    super();
    this.uri = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadMcpResourceError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadMcpResourceError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadMcpResourceError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadMcpResourceError, a, b2);
  }
  static $() {
    return ["ReadMcpResourceError|1 uri 9|2 error 9"];
  }
};
var ReadMcpResourceRejected = class _ReadMcpResourceRejected extends __protoMessage323 {
  constructor(data) {
    super();
    this.uri = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadMcpResourceRejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadMcpResourceRejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadMcpResourceRejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadMcpResourceRejected, a, b2);
  }
  static $() {
    return ["ReadMcpResourceRejected|1 uri 9|2 reason 9"];
  }
};
var ReadMcpResourceNotFound = class _ReadMcpResourceNotFound extends __protoMessage323 {
  constructor(data) {
    super();
    this.uri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ReadMcpResourceNotFound().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ReadMcpResourceNotFound().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ReadMcpResourceNotFound().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ReadMcpResourceNotFound, a, b2);
  }
  static $() {
    return ["ReadMcpResourceNotFound|1 uri 9"];
  }
};

