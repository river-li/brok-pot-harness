/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/request_context_exec_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
init_esm13();

// @recovered-fragment 2/3
init_ls_exec_pb();
init_subagents_pb();

// @recovered-fragment 3/3
init_compact();
var __protoPackage85 = "agent.v1.";
var __protoMessage384 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage85;
  }
};
var MountedAgentStoreKind = /* @__PURE__ */ enumType2(proto3, __protoPackage85, "MountedAgentStoreKind", [[0, "UNSPECIFIED"], [1, "SELF"], [2, "PEER"], [3, "SHARE"], [4, "PRINCIPAL"]], 1);
var RequestContextArgs = class _RequestContextArgs extends __protoMessage384 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestContextArgs().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestContextArgs().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestContextArgs().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestContextArgs, a, b2);
  }
  static $() {
    return ["RequestContextArgs|2 notes_session_id 9?|3 workspace_id 9?|4 read_only_pinned_tree_sha 9?|5 read_only_plugin_cache_root 9?|7 use_cached 8?|8 wait_for_workspace_cache 8?"];
  }
};
var RequestContextResult = class _RequestContextResult extends __protoMessage384 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestContextResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestContextResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestContextResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestContextResult, a, b2);
  }
  static $() {
    return ["RequestContextResult|1 success #0 result|2 error #1 result|3 rejected #2 result", RequestContextSuccess, RequestContextError, RequestContextRejected];
  }
};
var RequestContextSuccess = class _RequestContextSuccess extends __protoMessage384 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestContextSuccess().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestContextSuccess().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestContextSuccess().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestContextSuccess, a, b2);
  }
  static $() {
    return ["RequestContextSuccess|1 request_context #0|2 served_from_disk_cache 8?", RequestContext];
  }
};
var RequestContextError = class _RequestContextError extends __protoMessage384 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestContextError().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestContextError().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestContextError().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestContextError, a, b2);
  }
  static $() {
    return ["RequestContextError|1 error 9"];
  }
};
var RequestContextRejected = class _RequestContextRejected extends __protoMessage384 {
  constructor(data) {
    super();
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestContextRejected().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestContextRejected().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestContextRejected().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestContextRejected, a, b2);
  }
  static $() {
    return ["RequestContextRejected|1 reason 9"];
  }
};
var GitRepoInfo = class _GitRepoInfo extends __protoMessage384 {
  constructor(data) {
    super();
    this.path = "";
    this.status = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitRepoInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitRepoInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitRepoInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitRepoInfo, a, b2);
  }
  static $() {
    return ["GitRepoInfo|1 path 9|2 status 9|3 branch_name 9|4 remote_url 9?|5 previous_branch_is_ancestor 8?|6 is_origin_backed 8?"];
  }
};
var RequestContextEnv = class _RequestContextEnv extends __protoMessage384 {
  constructor(data) {
    super();
    this.osVersion = "";
    this.workspacePaths = [];
    this.shell = "";
    this.sandboxEnabled = false;
    this.terminalsFolder = "";
    this.agentSharedNotesFolder = "";
    this.agentConversationNotesFolder = "";
    this.timeZone = "";
    this.projectFolder = "";
    this.agentTranscriptsFolder = "";
    this.sandboxNetworkExplicitAllowlist = [];
    this.mountedAgentStores = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestContextEnv().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestContextEnv().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestContextEnv().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestContextEnv, a, b2);
  }
  static $() {
    return ["RequestContextEnv|1 os_version 9|2 workspace_paths 9*|3 shell 9|5 sandbox_enabled 8|7 terminals_folder 9|8 agent_shared_notes_folder 9|9 agent_conversation_notes_folder 9|10 time_zone 9|11 project_folder 9|12 agent_transcripts_folder 9|13 artifacts_folder 9?|14 sandbox_supported 8?|16 sandbox_network_has_defaults 8?|17 sandbox_network_explicit_allowlist 9*|18 secret_redaction_enabled 8?|19 computer_use_supported 8?|20 is_working_dir_home_dir 8?|21 process_working_directory 9?|22 smart_mode_classifier_auto_mode_enabled 8?|23 dev_force_next_smart_mode_classifier_block_token 9?|24 dev_delay_next_smart_mode_classifier_token 9?|25 mounted_agent_stores #0*|26 user_agent_store_web_context #1?|27 dev_mock_prompt_time #2?", MountedAgentStore, UserAgentStoreWebContext, Timestamp];
  }
};
var MountedAgentStore = class _MountedAgentStore extends __protoMessage384 {
  constructor(data) {
    super();
    this.path = "";
    this.kind = MountedAgentStoreKind.UNSPECIFIED;
    this.readOnly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MountedAgentStore().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MountedAgentStore().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MountedAgentStore().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MountedAgentStore, a, b2);
  }
  static $() {
    return ["MountedAgentStore|1 path 9|2 kind #0|3 alias 9?|4 read_only 8|5 inherited_from_path 9?", MountedAgentStoreKind];
  }
};
var UserAgentStoreWebContext = class _UserAgentStoreWebContext extends __protoMessage384 {
  constructor(data) {
    super();
    this.storeId = "";
    this.portalBaseUrl = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UserAgentStoreWebContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UserAgentStoreWebContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UserAgentStoreWebContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UserAgentStoreWebContext, a, b2);
  }
  static $() {
    return ["UserAgentStoreWebContext|1 store_id 9|2 portal_base_url 9"];
  }
};
var DebugModeConfig = class _DebugModeConfig extends __protoMessage384 {
  constructor(data) {
    super();
    this.logPath = "";
    this.serverEndpoint = "";
    this.sessionId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DebugModeConfig().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DebugModeConfig().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DebugModeConfig().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DebugModeConfig, a, b2);
  }
  static $() {
    return ["DebugModeConfig|1 log_path 9|2 server_endpoint 9|3 session_id 9"];
  }
};
var SkillDescriptor = class _SkillDescriptor extends __protoMessage384 {
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
  static fromBinary(bytes, options2) {
    return new _SkillDescriptor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SkillDescriptor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SkillDescriptor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SkillDescriptor, a, b2);
  }
  static $() {
    return ["SkillDescriptor|1 name 9|2 description 9|3 folder_path 9|4 enabled 8|5 parse_error 9?|6 readme_file_path 9|7 package_type #0", PackageType];
  }
};
var SkillOptions = class _SkillOptions extends __protoMessage384 {
  constructor(data) {
    super();
    this.skillDescriptors = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SkillOptions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SkillOptions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SkillOptions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SkillOptions, a, b2);
  }
  static $() {
    return ["SkillOptions|1 skill_descriptors #0*", SkillDescriptor];
  }
};
var HooksConfigInfo = class _HooksConfigInfo extends __protoMessage384 {
  constructor(data) {
    super();
    this.configuredSteps = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _HooksConfigInfo().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _HooksConfigInfo().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _HooksConfigInfo().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_HooksConfigInfo, a, b2);
  }
  static $() {
    return ["HooksConfigInfo|1 configured_steps 9*"];
  }
};
var PermissionsAutoRunInstructions = class _PermissionsAutoRunInstructions extends __protoMessage384 {
  constructor(data) {
    super();
    this.allowInstructions = [];
    this.blockInstructions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PermissionsAutoRunInstructions().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PermissionsAutoRunInstructions().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PermissionsAutoRunInstructions().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PermissionsAutoRunInstructions, a, b2);
  }
  static $() {
    return ["PermissionsAutoRunInstructions|1 allow_instructions 9*|2 block_instructions 9*"];
  }
};
var PrecomputedHumanChangeRenderedDiff = class _PrecomputedHumanChangeRenderedDiff extends __protoMessage384 {
  constructor(data) {
    super();
    this.startLineNumber = 0;
    this.endLineNumberExclusive = 0;
    this.beforeContextLines = [];
    this.removedLines = [];
    this.addedLines = [];
    this.afterContextLines = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrecomputedHumanChangeRenderedDiff().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrecomputedHumanChangeRenderedDiff().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrecomputedHumanChangeRenderedDiff().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrecomputedHumanChangeRenderedDiff, a, b2);
  }
  static $() {
    return ["PrecomputedHumanChangeRenderedDiff|1 start_line_number 5|2 end_line_number_exclusive 5|3 before_context_lines 9*|4 removed_lines 9*|5 added_lines 9*|6 after_context_lines 9*"];
  }
};
var PrecomputedHumanChange = class _PrecomputedHumanChange extends __protoMessage384 {
  constructor(data) {
    super();
    this.path = "";
    this.renderedDiffs = [];
    this.isNewFile = false;
    this.isDeletedFile = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _PrecomputedHumanChange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _PrecomputedHumanChange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _PrecomputedHumanChange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_PrecomputedHumanChange, a, b2);
  }
  static $() {
    return ["PrecomputedHumanChange|1 path 9|2 rendered_diffs #0*|3 is_new_file 8|4 is_deleted_file 8", PrecomputedHumanChangeRenderedDiff];
  }
};
var RequestContext = class _RequestContext extends __protoMessage384 {
  constructor(data) {
    super();
    this.rules = [];
    this.repositoryInfo = [];
    this.tools = [];
    this.gitRepos = [];
    this.projectLayouts = [];
    this.mcpInstructions = [];
    this.fileContents = {};
    this.customSubagents = [];
    this.agentSkills = [];
    this.precomputedHumanChanges = [];
    this.nonFileRules = [];
    this.disabledTeamRules = [];
    this.adminCommandDenylist = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestContext, a, b2);
  }
  static $() {
    return ["RequestContext|2 rules #0*|4 env #1|6 repository_info #2*|7 tools #3*|8 conversation_notes_listing 9?|9 shared_notes_listing 9?|11 git_repos #4*|13 project_layouts #5*|14 mcp_instructions #6*|15 debug_mode_config #7?|16 cloud_rule 9?|17 web_search_enabled 8?|18 skill_options #8?|19 repository_info_should_query_prod 8?|20 file_contents 9,9|21 user_intent_summary 9?|22 custom_subagents #9*|23 mcp_file_system_options #10?|24 web_fetch_enabled 8?|25 hooks_additional_context 9?|26 commit_attribution_message 9?|27 pr_attribution_message 9?|28 hooks_config #11?|29 agent_skills #12*|30 precomputed_human_changes #13*|31 recently_added_plugin #14?|32 supports_mcp_auth 8?|33 git_repo_info_complete 8?|34 mcp_meta_tool_options #15?|35 read_lints_enabled 8?|36 mcp_info_complete 8?|37 non_file_rules #0*|38 matched_installed_plugin #16?|39 rules_info_complete 8?|40 env_info_complete 8?|41 repository_info_complete 8?|42 custom_subagents_info_complete 8?|43 agent_skills_info_complete 8?|44 mcp_file_system_info_complete 8?|45 git_status_info_complete 8?|46 user_permissions_auto_run #17?|47 project_permissions_auto_run #17?|48 admin_permissions_auto_run #17?|49 disabled_team_rules 9*|50 search_conversations_enabled 8?|51 send_message_enabled 8?|52 admin_command_denylist 9*|53 system_prompt_override #18?", CursorRule, RequestContextEnv, RepositoryIndexingInfo, McpToolDefinition, GitRepoInfo, LsDirectoryTreeNode, McpInstructions, DebugModeConfig, SkillOptions, CustomSubagent, McpFileSystemOptions, HooksConfigInfo, AgentSkill, PrecomputedHumanChange, RecentlyAddedPlugin, McpMetaToolOptions, MatchedInstalledPlugin, PermissionsAutoRunInstructions, SystemPromptSpec];
  }
};
var RequestContextPartReferences = class _RequestContextPartReferences extends __protoMessage384 {
  constructor(data) {
    super();
    this.rulesBlobId = new Uint8Array(0);
    this.rulesByteLength = 0;
    this.skillsBlobId = new Uint8Array(0);
    this.skillsByteLength = 0;
    this.subagentsBlobId = new Uint8Array(0);
    this.subagentsByteLength = 0;
    this.mcpsBlobId = new Uint8Array(0);
    this.mcpsByteLength = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RequestContextPartReferences().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RequestContextPartReferences().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RequestContextPartReferences().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RequestContextPartReferences, a, b2);
  }
  static $() {
    return ["RequestContextPartReferences|1 rules_blob_id 12|2 rules_byte_length 13|3 skills_blob_id 12|4 skills_byte_length 13|5 subagents_blob_id 12|6 subagents_byte_length 13|7 mcps_blob_id 12|8 mcps_byte_length 13|9 dynamic_context #0", RequestContext];
  }
};
var RecentlyAddedPlugin = class _RecentlyAddedPlugin extends __protoMessage384 {
  constructor(data) {
    super();
    this.displayName = "";
    this.description = "";
    this.skills = [];
    this.subagents = [];
    this.hooks = [];
    this.rules = [];
    this.commands = [];
    this.mcpServers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecentlyAddedPlugin().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecentlyAddedPlugin().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecentlyAddedPlugin().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecentlyAddedPlugin, a, b2);
  }
  static $() {
    return ["RecentlyAddedPlugin|1 display_name 9|2 description 9|3 skills #0*|4 subagents #0*|5 hooks #0*|6 rules #0*|7 commands #0*|8 mcp_servers 9*", RecentlyAddedPlugin_CapabilityDescriptor];
  }
};
var RecentlyAddedPlugin_CapabilityDescriptor = class _RecentlyAddedPlugin_CapabilityDescriptor extends __protoMessage384 {
  constructor(data) {
    super();
    this.name = "";
    this.description = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _RecentlyAddedPlugin_CapabilityDescriptor().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _RecentlyAddedPlugin_CapabilityDescriptor().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _RecentlyAddedPlugin_CapabilityDescriptor().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_RecentlyAddedPlugin_CapabilityDescriptor, a, b2);
  }
  static $() {
    return ["RecentlyAddedPlugin.CapabilityDescriptor|1 name 9|2 description 9"];
  }
};
var MatchedInstalledPlugin = class _MatchedInstalledPlugin extends __protoMessage384 {
  constructor(data) {
    super();
    this.displayName = "";
    this.description = "";
    this.matchedKeyword = "";
    this.skills = [];
    this.subagents = [];
    this.hooks = [];
    this.rules = [];
    this.commands = [];
    this.mcpServers = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _MatchedInstalledPlugin().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _MatchedInstalledPlugin().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _MatchedInstalledPlugin().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_MatchedInstalledPlugin, a, b2);
  }
  static $() {
    return ["MatchedInstalledPlugin|1 display_name 9|2 description 9|3 matched_keyword 9|4 skills #0*|5 subagents #0*|6 hooks #0*|7 rules #0*|8 commands #0*|9 mcp_servers 9*", RecentlyAddedPlugin_CapabilityDescriptor];
  }
};

