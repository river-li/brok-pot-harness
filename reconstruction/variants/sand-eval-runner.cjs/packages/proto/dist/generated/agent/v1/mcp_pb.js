/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/mcp_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage22 = "agent.v1.";
var __protoMessage322 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage22;
  }
};
var McpToolDefinition = class _McpToolDefinition extends __protoMessage322 {
  constructor(data) {
    super();
    this.name = "";
    this.providerIdentifier = "";
    this.toolName = "";
    this.description = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpToolDefinition().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpToolDefinition().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpToolDefinition().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpToolDefinition, a, b2);
  }
  static $() {
    return ["McpToolDefinition|1 name 9|4 provider_identifier 9|5 tool_name 9|2 description 9|3 input_schema #0|6 input_schema_json 9?|7 output_schema_json 9?|8 annotations_json 9?", Value];
  }
};
var McpTools = class _McpTools extends __protoMessage322 {
  constructor(data) {
    super();
    this.mcpTools = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpTools().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpTools().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpTools().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpTools, a, b2);
  }
  static $() {
    return ["McpTools|1 mcp_tools #0*", McpToolDefinition];
  }
};
var McpInstructions = class _McpInstructions extends __protoMessage322 {
  constructor(data) {
    super();
    this.serverName = "";
    this.instructions = "";
    this.serverIdentifier = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpInstructions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpInstructions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpInstructions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpInstructions, a, b2);
  }
  static $() {
    return ["McpInstructions|1 server_name 9|2 instructions 9|3 server_identifier 9"];
  }
};
var McpDescriptor = class _McpDescriptor extends __protoMessage322 {
  constructor(data) {
    super();
    this.serverName = "";
    this.serverIdentifier = "";
    this.tools = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpDescriptor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpDescriptor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpDescriptor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpDescriptor, a, b2);
  }
  static $() {
    return ["McpDescriptor|1 server_name 9|2 server_identifier 9|3 folder_path 9?|4 server_use_instructions 9?|5 tools #0*|7 plugin 9?|8 marketplace 9?|9 plugin_db_id 9?|10 marketplace_id 9?", McpToolDescriptor];
  }
};
var McpToolDescriptor = class _McpToolDescriptor extends __protoMessage322 {
  constructor(data) {
    super();
    this.toolName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpToolDescriptor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpToolDescriptor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpToolDescriptor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpToolDescriptor, a, b2);
  }
  static $() {
    return ["McpToolDescriptor|1 tool_name 9|2 definition_path 9?|3 description 9?|4 input_schema #0?|5 input_schema_json 9?|6 annotations_json 9?", Value];
  }
};
var McpFileSystemOptions = class _McpFileSystemOptions extends __protoMessage322 {
  constructor(data) {
    super();
    this.enabled = false;
    this.workspaceProjectDir = "";
    this.mcpDescriptors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpFileSystemOptions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpFileSystemOptions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpFileSystemOptions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpFileSystemOptions, a, b2);
  }
  static $() {
    return ["McpFileSystemOptions|1 enabled 8|2 workspace_project_dir 9|3 mcp_descriptors #0*", McpDescriptor];
  }
};
var McpMetaToolOptions = class _McpMetaToolOptions extends __protoMessage322 {
  constructor(data) {
    super();
    this.enabled = false;
    this.mcpDescriptors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _McpMetaToolOptions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _McpMetaToolOptions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _McpMetaToolOptions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_McpMetaToolOptions, a, b2);
  }
  static $() {
    return ["McpMetaToolOptions|1 enabled 8|2 mcp_descriptors #0*", McpDescriptor];
  }
};

