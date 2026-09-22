/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/request_context_exec_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage80 = "agent.v1.";
var __protoMessage378 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage80;
  }
};
var SkillDescriptor = class _SkillDescriptor extends __protoMessage378 {
  constructor(data) {
    super();
    this.name = "";
    this.description = "";
    this.folderPath = "";
    this.enabled = false;
    this.readmeFilePath = "";
    this.packageType = PackageType.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SkillDescriptor().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SkillDescriptor().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SkillDescriptor().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SkillDescriptor, a, b);
  }
  static $() {
    return ["SkillDescriptor|1 name 9|2 description 9|3 folder_path 9|4 enabled 8|5 parse_error 9?|6 readme_file_path 9|7 package_type #0", PackageType];
  }
};
var SkillOptions = class _SkillOptions extends __protoMessage378 {
  constructor(data) {
    super();
    this.skillDescriptors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SkillOptions().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SkillOptions().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SkillOptions().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SkillOptions, a, b);
  }
  static $() {
    return ["SkillOptions|1 skill_descriptors #0*", SkillDescriptor];
  }
};
var RequestContextRulesPart = class _RequestContextRulesPart extends __protoMessage378 {
  constructor(data) {
    super();
    this.rules = [];
    this.nonFileRules = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RequestContextRulesPart().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RequestContextRulesPart().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RequestContextRulesPart().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RequestContextRulesPart, a, b);
  }
  static $() {
    return ["RequestContextRulesPart|1 rules #0*|2 non_file_rules #0*|3 cloud_rule 9?", CursorRule];
  }
};
var RequestContextSkillsPart = class _RequestContextSkillsPart extends __protoMessage378 {
  constructor(data) {
    super();
    this.agentSkills = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RequestContextSkillsPart().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RequestContextSkillsPart().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RequestContextSkillsPart().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RequestContextSkillsPart, a, b);
  }
  static $() {
    return ["RequestContextSkillsPart|1 agent_skills #0*|2 skill_options #1?", AgentSkill, SkillOptions];
  }
};
var RequestContextSubagentsPart = class _RequestContextSubagentsPart extends __protoMessage378 {
  constructor(data) {
    super();
    this.customSubagents = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RequestContextSubagentsPart().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RequestContextSubagentsPart().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RequestContextSubagentsPart().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RequestContextSubagentsPart, a, b);
  }
  static $() {
    return ["RequestContextSubagentsPart|1 custom_subagents #0*", CustomSubagent];
  }
};
var RequestContextMcpsPart = class _RequestContextMcpsPart extends __protoMessage378 {
  constructor(data) {
    super();
    this.tools = [];
    this.mcpInstructions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RequestContextMcpsPart().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RequestContextMcpsPart().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RequestContextMcpsPart().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RequestContextMcpsPart, a, b);
  }
  static $() {
    return ["RequestContextMcpsPart|1 tools #0*|2 mcp_instructions #1*|3 mcp_file_system_options #2?|4 mcp_meta_tool_options #3?", McpToolDefinition, McpInstructions, McpFileSystemOptions, McpMetaToolOptions];
  }
};

