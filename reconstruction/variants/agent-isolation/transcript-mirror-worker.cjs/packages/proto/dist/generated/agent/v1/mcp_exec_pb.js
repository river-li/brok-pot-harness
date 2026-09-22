/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/mcp_exec_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage20 = "agent.v1.";
var __protoMessage319 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage20;
  }
};
var McpArgs = class _McpArgs extends __protoMessage319 {
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
  static fromBinary(bytes, options) {
    return new _McpArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpArgs, a, b);
  }
  static $() {
    return ["McpArgs|1 name 9|2 args 9,#0|3 tool_call_id 9|4 provider_identifier 9|5 tool_name 9|6 smart_mode_approval #1?|7 smart_mode_approval_only 8|8 skip_approval 8|9 server_identifier 9", Value, SmartModeApproval];
  }
};
var McpTextContent = class _McpTextContent extends __protoMessage319 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpTextContent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpTextContent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpTextContent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpTextContent, a, b);
  }
  static $() {
    return ["McpTextContent|1 text 9|2 output_location #0?", OutputLocation];
  }
};
var McpImageContent = class _McpImageContent extends __protoMessage319 {
  constructor(data) {
    super();
    this.data = new Uint8Array(0);
    this.mimeType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpImageContent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpImageContent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpImageContent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpImageContent, a, b);
  }
  static $() {
    return ["McpImageContent|1 data 12|2 mime_type 9"];
  }
};
var McpToolResultContentItem = class _McpToolResultContentItem extends __protoMessage319 {
  constructor(data) {
    super();
    this.content = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpToolResultContentItem().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpToolResultContentItem().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpToolResultContentItem().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpToolResultContentItem, a, b);
  }
  static $() {
    return ["McpToolResultContentItem|1 text #0 content|2 image #1 content", McpTextContent, McpImageContent];
  }
};
var McpSuccess = class _McpSuccess extends __protoMessage319 {
  constructor(data) {
    super();
    this.content = [];
    this.isError = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpSuccess, a, b);
  }
  static $() {
    return ["McpSuccess|1 content #0*|2 is_error 8|3 structured_content #1", McpToolResultContentItem, Struct];
  }
};
var McpRejected = class _McpRejected extends __protoMessage319 {
  constructor(data) {
    super();
    this.reason = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpRejected, a, b);
  }
  static $() {
    return ["McpRejected|1 reason 9|2 is_readonly 8"];
  }
};
var McpPermissionDenied = class _McpPermissionDenied extends __protoMessage319 {
  constructor(data) {
    super();
    this.error = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _McpPermissionDenied().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _McpPermissionDenied().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _McpPermissionDenied().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_McpPermissionDenied, a, b);
  }
  static $() {
    return ["McpPermissionDenied|1 error 9|2 is_readonly 8"];
  }
};
var ListMcpResourcesExecArgs = class _ListMcpResourcesExecArgs extends __protoMessage319 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesExecArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesExecArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesExecArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesExecArgs, a, b);
  }
  static $() {
    return ["ListMcpResourcesExecArgs|1 server 9?"];
  }
};
var ListMcpResourcesExecResult = class _ListMcpResourcesExecResult extends __protoMessage319 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesExecResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesExecResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesExecResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesExecResult, a, b);
  }
  static $() {
    return ["ListMcpResourcesExecResult|1 success #0 result|2 error #1 result|3 rejected #2 result", ListMcpResourcesSuccess, ListMcpResourcesError, ListMcpResourcesRejected];
  }
};
var ListMcpResourcesExecResult_McpResource = class _ListMcpResourcesExecResult_McpResource extends __protoMessage319 {
  constructor(data) {
    super();
    this.uri = "";
    this.server = "";
    this.annotations = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesExecResult_McpResource().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesExecResult_McpResource().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesExecResult_McpResource().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesExecResult_McpResource, a, b);
  }
  static $() {
    return ["ListMcpResourcesExecResult.McpResource|1 uri 9|2 name 9?|3 description 9?|4 mime_type 9?|5 server 9|6 annotations 9,9"];
  }
};
var ListMcpResourcesSuccess = class _ListMcpResourcesSuccess extends __protoMessage319 {
  constructor(data) {
    super();
    this.resources = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesSuccess, a, b);
  }
  static $() {
    return ["ListMcpResourcesSuccess|1 resources #0*", ListMcpResourcesExecResult_McpResource];
  }
};
var ListMcpResourcesError = class _ListMcpResourcesError extends __protoMessage319 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesError, a, b);
  }
  static $() {
    return ["ListMcpResourcesError|1 error 9"];
  }
};
var ListMcpResourcesRejected = class _ListMcpResourcesRejected extends __protoMessage319 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ListMcpResourcesRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ListMcpResourcesRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ListMcpResourcesRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ListMcpResourcesRejected, a, b);
  }
  static $() {
    return ["ListMcpResourcesRejected|1 reason 9"];
  }
};
var ReadMcpResourceExecArgs = class _ReadMcpResourceExecArgs extends __protoMessage319 {
  constructor(data) {
    super();
    this.server = "";
    this.uri = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceExecArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceExecArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceExecArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceExecArgs, a, b);
  }
  static $() {
    return ["ReadMcpResourceExecArgs|1 server 9|2 uri 9|3 download_path 9?|4 tool_call_id 9|5 smart_mode_approval #0?", SmartModeApproval];
  }
};
var ReadMcpResourceExecResult = class _ReadMcpResourceExecResult extends __protoMessage319 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceExecResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceExecResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceExecResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceExecResult, a, b);
  }
  static $() {
    return ["ReadMcpResourceExecResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 not_found #3 result", ReadMcpResourceSuccess, ReadMcpResourceError, ReadMcpResourceRejected, ReadMcpResourceNotFound];
  }
};
var ReadMcpResourceSuccess = class _ReadMcpResourceSuccess extends __protoMessage319 {
  constructor(data) {
    super();
    this.uri = "";
    this.content = { case: void 0 };
    this.annotations = {};
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceSuccess, a, b);
  }
  static $() {
    return ["ReadMcpResourceSuccess|1 uri 9|2 name 9?|3 description 9?|4 mime_type 9?|5 text 9 content|6 blob 12 content|7 annotations 9,9|8 download_path 9?|9 output_location #0?", OutputLocation];
  }
};
var ReadMcpResourceError = class _ReadMcpResourceError extends __protoMessage319 {
  constructor(data) {
    super();
    this.uri = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceError, a, b);
  }
  static $() {
    return ["ReadMcpResourceError|1 uri 9|2 error 9"];
  }
};
var ReadMcpResourceRejected = class _ReadMcpResourceRejected extends __protoMessage319 {
  constructor(data) {
    super();
    this.uri = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceRejected, a, b);
  }
  static $() {
    return ["ReadMcpResourceRejected|1 uri 9|2 reason 9"];
  }
};
var ReadMcpResourceNotFound = class _ReadMcpResourceNotFound extends __protoMessage319 {
  constructor(data) {
    super();
    this.uri = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ReadMcpResourceNotFound().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ReadMcpResourceNotFound().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ReadMcpResourceNotFound().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ReadMcpResourceNotFound, a, b);
  }
  static $() {
    return ["ReadMcpResourceNotFound|1 uri 9"];
  }
};

