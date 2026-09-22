/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/agent_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage82 = "agent.v1.";
var __protoMessage380 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage82;
  }
};
var AgentMode = /* @__PURE__ */ enumType(proto3, __protoPackage82, "AgentMode", [[0, "UNSPECIFIED"], [1, "AGENT"], [2, "ASK"], [3, "PLAN"], [4, "DEBUG"], [5, "TRIAGE"], [6, "PROJECT"], [7, "MULTITASK"], [8, "CUSTOM"]], 1);
var SubagentRunStatus = /* @__PURE__ */ enumType(proto3, __protoPackage82, "SubagentRunStatus", [[0, "UNSPECIFIED"], [1, "RUNNING"], [2, "BACKGROUNDED"], [3, "SUCCESS"], [4, "ERROR"], [5, "ABORTED"]], 1);
var SubagentDispatchTool = /* @__PURE__ */ enumType(proto3, __protoPackage82, "SubagentDispatchTool", [[0, "UNSPECIFIED"], [1, "TASK"], [2, "CREATE_AGENT"], [3, "SEND_TO_AGENT"]], 1);
var CustomModeSource = /* @__PURE__ */ enumType(proto3, __protoPackage82, "CustomModeSource", [[0, "UNSPECIFIED"], [1, "AGENT_SKILL"], [2, "PLUGIN_SKILL"], [3, "REPO_SKILL"], [4, "MANAGED_SKILL"]], 1);
var SimulatedMsgReason = /* @__PURE__ */ enumType(proto3, __protoPackage82, "SimulatedMsgReason", [[0, "UNSPECIFIED"], [1, "PLAN_EXECUTION"], [2, "COMMIT_REMINDER"], [3, "BACKGROUND_TASK_COMPLETION"], [4, "DIFF_TAB_COMMIT"], [5, "DIFF_TAB_COMMIT_AND_PUSH"], [6, "DIFF_TAB_PUSH"], [7, "DIFF_TAB_CREATE_PR"], [8, "DIFF_TAB_FIX_MERGE_CONFLICTS"], [9, "USER_SENT_TO_SUBAGENT"], [10, "USER_INTERRUPTED_SUBAGENT"], [11, "USER_QUEUED_TO_SUBAGENT"], [12, "BABYSIT_PR_IN_CLOUD"], [13, "CI_PANEL_INVESTIGATE_FAILURE"], [14, "MULTITASK"], [15, "BUILD_IN_PARALLEL"], [16, "MULTITASK_SPLIT_PRS"], [17, "APPLY_LOCALLY"], [18, "CHECKOUT_BRANCH"], [19, "DIFF_TAB_UPDATE_BRANCH"], [20, "PR_TAB_BUGBOT_FIX"], [22, "RUN_BUGBOT_REVIEW"], [23, "RUN_SECURITY_REVIEW"], [24, "FSD_APPLY_FINDING"], [25, "FSD_UNDO_FINDING"], [26, "FSD_START"], [27, "FSD_PR_INTERRUPT"], [28, "SUBSCRIPTION"], [29, "DIFF_TAB_CREATE_BRANCH"], [30, "AGENT_STORE_CONFLICT"], [31, "GOAL_CONTINUATION"], [32, "PROJECT_KICKOFF"], [33, "MARKDOWN_PROMPT_BUTTON"], [34, "USER_QUICK_ACTION"]], 1);
var SubscriptionSource = /* @__PURE__ */ enumType(proto3, __protoPackage82, "SubscriptionSource", [[0, "UNSPECIFIED"], [1, "SLACK"], [2, "GITHUB"], [3, "LINEAR"], [4, "ORIGIN"]], 1);
var TaskArgs = class _TaskArgs extends __protoMessage380 {
  constructor(data) {
    super();
    this.description = "";
    this.prompt = "";
    this.attachments = [];
    this.mode = TaskMode.UNSPECIFIED;
    this.respondingToMessageIds = [];
    this.environment = SubagentExecutionEnvironment.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TaskArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TaskArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TaskArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TaskArgs, a, b);
  }
  static $() {
    return ["TaskArgs|1 description 9|2 prompt 9|3 subagent_type #0|4 model 9?|5 resume 9?|6 agent_id 9?|7 attachments 9*|8 mode #1|9 responding_to_message_ids 9*|10 environment #2|11 machine #3?", SubagentType, TaskMode, SubagentExecutionEnvironment, TargetMachine];
  }
};
var TargetMachine = class _TargetMachine extends __protoMessage380 {
  constructor(data) {
    super();
    this.machine = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TargetMachine().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TargetMachine().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TargetMachine().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TargetMachine, a, b);
  }
  static $() {
    return ["TargetMachine|1 same_machine #0 machine|2 new_cloud_vm #1 machine|3 self_hosted_worker #2 machine|4 self_hosted_pool #3 machine", SameMachineTarget, NewCloudVmTarget, SelfHostedWorkerTarget, SelfHostedPoolTarget];
  }
};
var SameMachineTarget = class _SameMachineTarget extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SameMachineTarget().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SameMachineTarget().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SameMachineTarget().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SameMachineTarget, a, b);
  }
  static $() {
    return ["SameMachineTarget"];
  }
};
var NewCloudVmTarget = class _NewCloudVmTarget extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _NewCloudVmTarget().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _NewCloudVmTarget().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _NewCloudVmTarget().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_NewCloudVmTarget, a, b);
  }
  static $() {
    return ["NewCloudVmTarget|1 environment_build_id 9?|2 base_branch 9?"];
  }
};
var SelfHostedWorkerTarget = class _SelfHostedWorkerTarget extends __protoMessage380 {
  constructor(data) {
    super();
    this.workerId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelfHostedWorkerTarget().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelfHostedWorkerTarget().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelfHostedWorkerTarget().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelfHostedWorkerTarget, a, b);
  }
  static $() {
    return ["SelfHostedWorkerTarget|1 worker_id 9"];
  }
};
var SelfHostedPoolTarget = class _SelfHostedPoolTarget extends __protoMessage380 {
  constructor(data) {
    super();
    this.labels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelfHostedPoolTarget().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelfHostedPoolTarget().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelfHostedPoolTarget().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelfHostedPoolTarget, a, b);
  }
  static $() {
    return ["SelfHostedPoolTarget|1 pool 9?|2 labels #0*", SelfHostedWorkerLabel];
  }
};
var SelfHostedWorkerLabel = class _SelfHostedWorkerLabel extends __protoMessage380 {
  constructor(data) {
    super();
    this.key = "";
    this.value = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SelfHostedWorkerLabel().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SelfHostedWorkerLabel().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SelfHostedWorkerLabel().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SelfHostedWorkerLabel, a, b);
  }
  static $() {
    return ["SelfHostedWorkerLabel|1 key 9|2 value 9"];
  }
};
var TaskSuccess = class _TaskSuccess extends __protoMessage380 {
  constructor(data) {
    super();
    this.conversationSteps = [];
    this.isBackground = false;
    this.backgroundReason = SubagentBackgroundReason.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TaskSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TaskSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TaskSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TaskSuccess, a, b);
  }
  static $() {
    return ["TaskSuccess|1 conversation_steps #0*|2 agent_id 9?|3 is_background 8|4 duration_ms 4?|5 result_suffix 9?|6 background_reason #1|7 transcript_path 9?", ConversationStep, SubagentBackgroundReason];
  }
};
var TaskError = class _TaskError extends __protoMessage380 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TaskError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TaskError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TaskError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TaskError, a, b);
  }
  static $() {
    return ["TaskError|1 error 9"];
  }
};
var TaskResult = class _TaskResult extends __protoMessage380 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TaskResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TaskResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TaskResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TaskResult, a, b);
  }
  static $() {
    return ["TaskResult|1 success #0 result|2 error #1 result", TaskSuccess, TaskError];
  }
};
var TaskToolCall = class _TaskToolCall extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TaskToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TaskToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TaskToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TaskToolCall, a, b);
  }
  static $() {
    return ["TaskToolCall|1 args #0|2 result #1|3 cloud_agent_bc_id 9?", TaskArgs, TaskResult];
  }
};
var SetActiveBranchArgs = class _SetActiveBranchArgs extends __protoMessage380 {
  constructor(data) {
    super();
    this.path = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetActiveBranchArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetActiveBranchArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetActiveBranchArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetActiveBranchArgs, a, b);
  }
  static $() {
    return ["SetActiveBranchArgs|1 path 9|2 branch_name 9"];
  }
};
var SetActiveBranchSuccess = class _SetActiveBranchSuccess extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetActiveBranchSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetActiveBranchSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetActiveBranchSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetActiveBranchSuccess, a, b);
  }
  static $() {
    return ["SetActiveBranchSuccess"];
  }
};
var SetActiveBranchError = class _SetActiveBranchError extends __protoMessage380 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetActiveBranchError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetActiveBranchError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetActiveBranchError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetActiveBranchError, a, b);
  }
  static $() {
    return ["SetActiveBranchError|1 error 9"];
  }
};
var SetActiveBranchResult = class _SetActiveBranchResult extends __protoMessage380 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetActiveBranchResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetActiveBranchResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetActiveBranchResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetActiveBranchResult, a, b);
  }
  static $() {
    return ["SetActiveBranchResult|1 success #0 result|2 error #1 result", SetActiveBranchSuccess, SetActiveBranchError];
  }
};
var SetActiveBranchToolCall = class _SetActiveBranchToolCall extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SetActiveBranchToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SetActiveBranchToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SetActiveBranchToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SetActiveBranchToolCall, a, b);
  }
  static $() {
    return ["SetActiveBranchToolCall|1 args #0|2 result #1", SetActiveBranchArgs, SetActiveBranchResult];
  }
};
var ToolCall = class _ToolCall extends __protoMessage380 {
  constructor(data) {
    super();
    this.tool = { case: void 0 };
    this.hookAdditionalContexts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ToolCall, a, b);
  }
  static $() {
    return ["ToolCall|1 shell_tool_call #0 tool|3 delete_tool_call #1 tool|4 glob_tool_call #2 tool|5 grep_tool_call #3 tool|8 read_tool_call #4 tool|9 update_todos_tool_call #5 tool|10 read_todos_tool_call #6 tool|12 edit_tool_call #7 tool|13 ls_tool_call #8 tool|14 read_lints_tool_call #9 tool|15 mcp_tool_call #10 tool|16 sem_search_tool_call #11 tool|17 create_plan_tool_call #12 tool|18 web_search_tool_call #13 tool|19 task_tool_call #14 tool|20 list_mcp_resources_tool_call #15 tool|21 read_mcp_resource_tool_call #16 tool|22 apply_agent_diff_tool_call #17 tool|23 ask_question_tool_call #18 tool|24 fetch_tool_call #19 tool|25 switch_mode_tool_call #20 tool|28 generate_image_tool_call #21 tool|29 record_screen_tool_call #22 tool|30 computer_use_tool_call #23 tool|31 write_shell_stdin_tool_call #24 tool|32 reflect_tool_call #25 tool|33 setup_vm_environment_tool_call #26 tool|34 truncated_tool_call #27 tool|35 start_grind_execution_tool_call #28 tool|36 start_grind_planning_tool_call #29 tool|37 web_fetch_tool_call #30 tool|38 report_bugfix_results_tool_call #31 tool|39 ai_attribution_tool_call #32 tool|40 pr_management_tool_call #33 tool|41 mcp_auth_tool_call #34 tool|42 await_tool_call #35 tool|43 blame_by_file_path_tool_call #36 tool|44 get_mcp_tools_tool_call #37 tool|45 report_bug_tool_call #38 tool|46 set_active_branch_tool_call #39 tool|48 communicate_update_tool_call #40 tool|49 send_final_summary_tool_call #41 tool|50 update_pr_code_tour_tool_call #42 tool|51 replace_env_tool_call #43 tool|52 edit_pr_labels_tool_call #44 tool|53 record_ci_investigation_findings_tool_call #45 tool|55 send_message_tool_call #46 tool|56 fetch_cloud_agent_data_tool_call #47 tool|58 send_to_user_tool_call #48 tool|61 pi_read_tool_call #49 tool|62 pi_bash_tool_call #50 tool|63 pi_edit_tool_call #51 tool|64 pi_write_tool_call #52 tool|65 pi_grep_tool_call #53 tool|66 pi_find_tool_call #54 tool|67 pi_ls_tool_call #55 tool|68 connect_scm_tool_call #56 tool|69 search_conversations_tool_call #57 tool|70 create_goal_tool_call #58 tool|71 update_goal_tool_call #59 tool|72 adopt_tool_call #60 tool|73 get_agent_status_tool_call #61 tool|74 send_to_agent_tool_call #62 tool|75 read_agent_transcript_tool_call #63 tool|76 create_agent_tool_call #64 tool|77 stop_agent_tool_call #65 tool|78 get_pr_code_tour_tool_call #66 tool|79 write_canvas_tool_call #67 tool|80 read_canvas_tool_call #68 tool|54 hook_additional_contexts #69*|57 tool_call_id 9?|59 started_at_ms 4?|60 completed_at_ms 4?", ShellToolCall, DeleteToolCall, GlobToolCall, GrepToolCall, ReadToolCall, UpdateTodosToolCall, ReadTodosToolCall, EditToolCall, LsToolCall, ReadLintsToolCall, McpToolCall, SemSearchToolCall, CreatePlanToolCall, WebSearchToolCall, TaskToolCall, ListMcpResourcesToolCall, ReadMcpResourceToolCall, ApplyAgentDiffToolCall, AskQuestionToolCall, FetchToolCall, SwitchModeToolCall, GenerateImageToolCall, RecordScreenToolCall, ComputerUseToolCall, WriteShellStdinToolCall, ReflectToolCall, SetupVmEnvironmentToolCall, TruncatedToolCall, StartGrindExecutionToolCall, StartGrindPlanningToolCall, WebFetchToolCall, ReportBugfixResultsToolCall, AiAttributionToolCall, PrManagementToolCall, McpAuthToolCall, AwaitToolCall, BlameByFilePathToolCall, GetMcpToolsToolCall, ReportBugToolCall, SetActiveBranchToolCall, CommunicateUpdateToolCall, SendFinalSummaryToolCall, UpdatePrCodeTourToolCall, ReplaceEnvToolCall, EditPrLabelsToolCall, RecordCiInvestigationFindingsToolCall, SendMessageToolCall, FetchCloudAgentDataToolCall, SendToUserToolCall, PiReadToolCall, PiBashToolCall, PiEditToolCall, PiWriteToolCall, PiGrepToolCall, PiFindToolCall, PiLsToolCall, ConnectScmToolCall, SearchConversationsToolCall, CreateGoalToolCall, UpdateGoalToolCall, AdoptToolCall, GetAgentStatusToolCall, SendToAgentToolCall, ReadAgentTranscriptToolCall, CreateAgentToolCall, StopAgentToolCall, GetPrCodeTourToolCall, WriteCanvasToolCall, ReadCanvasToolCall, HookAdditionalContext];
  }
};
var TruncatedToolCallArgs = class _TruncatedToolCallArgs extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TruncatedToolCallArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TruncatedToolCallArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TruncatedToolCallArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TruncatedToolCallArgs, a, b);
  }
  static $() {
    return ["TruncatedToolCallArgs"];
  }
};
var TruncatedToolCallSuccess = class _TruncatedToolCallSuccess extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TruncatedToolCallSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TruncatedToolCallSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TruncatedToolCallSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TruncatedToolCallSuccess, a, b);
  }
  static $() {
    return ["TruncatedToolCallSuccess"];
  }
};
var TruncatedToolCallError = class _TruncatedToolCallError extends __protoMessage380 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TruncatedToolCallError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TruncatedToolCallError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TruncatedToolCallError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TruncatedToolCallError, a, b);
  }
  static $() {
    return ["TruncatedToolCallError|1 error 9"];
  }
};
var TruncatedToolCallResult = class _TruncatedToolCallResult extends __protoMessage380 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TruncatedToolCallResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TruncatedToolCallResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TruncatedToolCallResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TruncatedToolCallResult, a, b);
  }
  static $() {
    return ["TruncatedToolCallResult|1 success #0 result|2 error #1 result", TruncatedToolCallSuccess, TruncatedToolCallError];
  }
};
var TruncatedToolCall = class _TruncatedToolCall extends __protoMessage380 {
  constructor(data) {
    super();
    this.originalStepBlobId = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TruncatedToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TruncatedToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TruncatedToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TruncatedToolCall, a, b);
  }
  static $() {
    return ["TruncatedToolCall|1 original_step_blob_id 12|2 args #0|3 result #1", TruncatedToolCallArgs, TruncatedToolCallResult];
  }
};
var ConversationStep = class _ConversationStep extends __protoMessage380 {
  constructor(data) {
    super();
    this.message = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationStep().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationStep().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationStep().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationStep, a, b);
  }
  static $() {
    return ["ConversationStep|1 assistant_message #0 message|2 tool_call #1 message|3 thinking_message #2 message", AssistantMessage, ToolCall, ThinkingMessage];
  }
};
var TriggeringUserInfo = class _TriggeringUserInfo extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TriggeringUserInfo().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TriggeringUserInfo().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TriggeringUserInfo().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TriggeringUserInfo, a, b);
  }
  static $() {
    return ["TriggeringUserInfo|1 auth_id 9?|2 user_id 5?"];
  }
};
var SubagentRunState = class _SubagentRunState extends __protoMessage380 {
  constructor(data) {
    super();
    this.parentToolCallId = "";
    this.environment = SubagentExecutionEnvironment.UNSPECIFIED;
    this.status = SubagentRunStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentRunState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentRunState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentRunState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentRunState, a, b);
  }
  static $() {
    return ["SubagentRunState|1 parent_tool_call_id 9|2 subagent_id 9?|3 environment #0|4 status #1|5 title 9?|6 detail 9?|7 transcript_path 9?|8 output_path 9?|9 completed_timestamp_ms 4?|10 completion_reason #2?", SubagentExecutionEnvironment, SubagentRunStatus, BackgroundTaskCompletionReason];
  }
};
var SubagentDispatchStep = class _SubagentDispatchStep extends __protoMessage380 {
  constructor(data) {
    super();
    this.stepIndex = 0;
    this.toolCallId = "";
    this.tool = SubagentDispatchTool.UNSPECIFIED;
    this.backgrounded = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentDispatchStep().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentDispatchStep().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentDispatchStep().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentDispatchStep, a, b);
  }
  static $() {
    return ["SubagentDispatchStep|1 step_index 13|2 tool_call_id 9|3 tool #0|4 backgrounded 8", SubagentDispatchTool];
  }
};
var SubmittedCustomMode = class _SubmittedCustomMode extends __protoMessage380 {
  constructor(data) {
    super();
    this.id = "";
    this.label = "";
    this.source = CustomModeSource.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubmittedCustomMode().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubmittedCustomMode().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubmittedCustomMode().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubmittedCustomMode, a, b);
  }
  static $() {
    return ["SubmittedCustomMode|1 id 9|2 label 9|5 source #0|6 source_path 9?|7 source_hash 9?|10 managed_skill_id 9?|11 plugin_id 9?|12 plugin_snapshot_token 9?", CustomModeSource];
  }
};
var SubmittedExitedCustomMode = class _SubmittedExitedCustomMode extends __protoMessage380 {
  constructor(data) {
    super();
    this.id = "";
    this.label = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubmittedExitedCustomMode().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubmittedExitedCustomMode().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubmittedExitedCustomMode().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubmittedExitedCustomMode, a, b);
  }
  static $() {
    return ["SubmittedExitedCustomMode|1 id 9|2 label 9"];
  }
};
var CustomModeExitIntent = class _CustomModeExitIntent extends __protoMessage380 {
  constructor(data) {
    super();
    this.nextMode = AgentMode.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CustomModeExitIntent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CustomModeExitIntent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CustomModeExitIntent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CustomModeExitIntent, a, b);
  }
  static $() {
    return ["CustomModeExitIntent|1 next_mode #0|2 exited_mode #1", AgentMode, SubmittedExitedCustomMode];
  }
};
var CustomModeIntent = class _CustomModeIntent extends __protoMessage380 {
  constructor(data) {
    super();
    this.intent = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CustomModeIntent().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CustomModeIntent().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CustomModeIntent().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CustomModeIntent, a, b);
  }
  static $() {
    return ["CustomModeIntent|1 enter #0 intent|2 exit #1 intent", SubmittedCustomMode, CustomModeExitIntent];
  }
};
var SubscriptionEventDisplay = class _SubscriptionEventDisplay extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubscriptionEventDisplay().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubscriptionEventDisplay().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubscriptionEventDisplay().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubscriptionEventDisplay, a, b);
  }
  static $() {
    return ["SubscriptionEventDisplay|1 display_label 9?|2 resource_url 9?|3 subscription_id 9?"];
  }
};
var ExecutePlanInfo = class _ExecutePlanInfo extends __protoMessage380 {
  constructor(data) {
    super();
    this.planId = "";
    this.planTitle = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ExecutePlanInfo().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ExecutePlanInfo().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ExecutePlanInfo().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ExecutePlanInfo, a, b);
  }
  static $() {
    return ["ExecutePlanInfo|1 plan_id 9|2 plan_title 9"];
  }
};
var ProjectDetails = class _ProjectDetails extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ProjectDetails().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ProjectDetails().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ProjectDetails().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ProjectDetails, a, b);
  }
  static $() {
    return ["ProjectDetails|1 name 9?|2 subagent #0?|3 side_chat #1?", ProjectSubagentDetails, ProjectSideChatDetails];
  }
};
var ProjectSubagentDetails = class _ProjectSubagentDetails extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ProjectSubagentDetails().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ProjectSubagentDetails().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ProjectSubagentDetails().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ProjectSubagentDetails, a, b);
  }
  static $() {
    return ["ProjectSubagentDetails|2 store_dir 9?"];
  }
};
var ProjectSideChatDetails = class _ProjectSideChatDetails extends __protoMessage380 {
  constructor(data) {
    super();
    this.storeDir = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ProjectSideChatDetails().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ProjectSideChatDetails().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ProjectSideChatDetails().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ProjectSideChatDetails, a, b);
  }
  static $() {
    return ["ProjectSideChatDetails|1 store_dir 9"];
  }
};
var UserMessage = class _UserMessage extends __protoMessage380 {
  constructor(data) {
    super();
    this.text = "";
    this.messageId = "";
    this.mode = AgentMode.UNSPECIFIED;
    this.conversationStateBlobId = new Uint8Array(0);
    this.hookAdditionalContexts = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UserMessage().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UserMessage().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UserMessage().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UserMessage, a, b);
  }
  static $() {
    return ["UserMessage|1 text 9|2 message_id 9|3 selected_context #0?|4 mode #1|5 is_simulated_msg 8?|6 best_of_n_group_id 9?|7 try_use_best_of_n_promotion 8?|8 rich_text 9?|9 simulated_msg_reason #2?|10 conversation_state_blob_id 12|11 subagent_system_reminder 9?|13 triggering_user_info #3?|14 execute_plan_info #4?|15 simulated_message_metadata #5?|16 prompt_reference_id 9?|17 thread_id 9?|18 text_blob_id 12?|19 rich_text_blob_id 12?|21 hook_additional_contexts #6*|22 custom_mode_intent #7?|23 project_details #8?|24 turn_steer 8?|25 started_at_ms 4?|26 completed_at_ms 4?|27 sent_by_agent_id 9?", SelectedContext, AgentMode, SimulatedMsgReason, TriggeringUserInfo, ExecutePlanInfo, UserMessage_SimulatedMessageMetadata, HookAdditionalContext, CustomModeIntent, ProjectDetails];
  }
};
var UserMessage_SimulatedMessageMetadata = class _UserMessage_SimulatedMessageMetadata extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _UserMessage_SimulatedMessageMetadata().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _UserMessage_SimulatedMessageMetadata().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _UserMessage_SimulatedMessageMetadata().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_UserMessage_SimulatedMessageMetadata, a, b);
  }
  static $() {
    return ["UserMessage.SimulatedMessageMetadata|1 title 9?|2 task_id 9?|3 fsd_finding_action 9?|4 url 9?|5 subscription_source #0?|6 subscription_event_display #1?", SubscriptionSource, SubscriptionEventDisplay];
  }
};
var AssistantMessage = class _AssistantMessage extends __protoMessage380 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AssistantMessage().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AssistantMessage().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AssistantMessage().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AssistantMessage, a, b);
  }
  static $() {
    return ["AssistantMessage|1 text 9|2 started_at_ms 4?|3 completed_at_ms 4?"];
  }
};
var ThinkingMessage = class _ThinkingMessage extends __protoMessage380 {
  constructor(data) {
    super();
    this.text = "";
    this.durationMs = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ThinkingMessage().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ThinkingMessage().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ThinkingMessage().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ThinkingMessage, a, b);
  }
  static $() {
    return ["ThinkingMessage|1 text 9|2 duration_ms 13|3 started_at_ms 4?|4 completed_at_ms 4?"];
  }
};
var ShellCommand = class _ShellCommand extends __protoMessage380 {
  constructor(data) {
    super();
    this.command = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellCommand().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellCommand().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellCommand().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellCommand, a, b);
  }
  static $() {
    return ["ShellCommand|1 command 9"];
  }
};
var ShellOutput = class _ShellOutput extends __protoMessage380 {
  constructor(data) {
    super();
    this.stdout = "";
    this.stderr = "";
    this.exitCode = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellOutput().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellOutput().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellOutput().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellOutput, a, b);
  }
  static $() {
    return ["ShellOutput|1 stdout 9|2 stderr 9|3 exit_code 5"];
  }
};
var ConversationPlan = class _ConversationPlan extends __protoMessage380 {
  constructor(data) {
    super();
    this.plan = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationPlan().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationPlan().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationPlan().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationPlan, a, b);
  }
  static $() {
    return ["ConversationPlan|1 plan 9"];
  }
};
var PlanRegistryEntry = class _PlanRegistryEntry extends __protoMessage380 {
  constructor(data) {
    super();
    this.id = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PlanRegistryEntry().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PlanRegistryEntry().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PlanRegistryEntry().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PlanRegistryEntry, a, b);
  }
  static $() {
    return ["PlanRegistryEntry|1 id 9|2 path 9"];
  }
};
var GoalState = class _GoalState extends __protoMessage380 {
  constructor(data) {
    super();
    this.conversationId = "";
    this.goalId = "";
    this.objective = "";
    this.status = GoalStatus.UNSPECIFIED;
    this.idleContinuationsWithoutToolCalls = 0;
    this.continuationCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GoalState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GoalState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GoalState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GoalState, a, b);
  }
  static $() {
    return ["GoalState|1 conversation_id 9|2 goal_id 9|3 objective 9|4 status #0|5 idle_continuations_without_tool_calls 13|6 active_duration_ms 4?|7 last_accrued_at_ms 4?|8 continuation_count 13|9 agent_session_id 9?", GoalStatus];
  }
};
var ConversationTurnStructure = class _ConversationTurnStructure extends __protoMessage380 {
  constructor(data) {
    super();
    this.turn = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationTurnStructure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationTurnStructure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationTurnStructure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationTurnStructure, a, b);
  }
  static $() {
    return ["ConversationTurnStructure|1 agent_conversation_turn #0 turn|2 shell_conversation_turn #1 turn", AgentConversationTurnStructure, ShellConversationTurnStructure];
  }
};
var AgentConversationTurnStructure = class _AgentConversationTurnStructure extends __protoMessage380 {
  constructor(data) {
    super();
    this.userMessage = new Uint8Array(0);
    this.steps = [];
    this.sendMessageStepIndices = [];
    this.subagentDispatchSteps = [];
    this.dynamicToolNames = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _AgentConversationTurnStructure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _AgentConversationTurnStructure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _AgentConversationTurnStructure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_AgentConversationTurnStructure, a, b);
  }
  static $() {
    return ["AgentConversationTurnStructure|1 user_message 12|2 steps 12*|3 request_id 9?|4 encrypted_model 9?|5 dynamic_tool_count 13?|6 send_message_step_indices 13*|7 routed_model_display_name 9?|8 subagent_dispatch_steps #0*|9 dynamic_tool_names 9*|10 user_message_id 9?", SubagentDispatchStep];
  }
};
var ShellConversationTurnStructure = class _ShellConversationTurnStructure extends __protoMessage380 {
  constructor(data) {
    super();
    this.shellCommand = new Uint8Array(0);
    this.shellOutput = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ShellConversationTurnStructure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ShellConversationTurnStructure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ShellConversationTurnStructure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ShellConversationTurnStructure, a, b);
  }
  static $() {
    return ["ShellConversationTurnStructure|1 shell_command 12|2 shell_output 12"];
  }
};
var ConversationSummary = class _ConversationSummary extends __protoMessage380 {
  constructor(data) {
    super();
    this.summary = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSummary().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSummary().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSummary().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSummary, a, b);
  }
  static $() {
    return ["ConversationSummary|1 summary 9"];
  }
};
var ConversationSummaryArchive = class _ConversationSummaryArchive extends __protoMessage380 {
  constructor(data) {
    super();
    this.summarizedMessages = [];
    this.summary = "";
    this.windowTail = 0;
    this.summaryMessage = new Uint8Array(0);
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationSummaryArchive().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationSummaryArchive().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationSummaryArchive().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationSummaryArchive, a, b);
  }
  static $() {
    return ["ConversationSummaryArchive|1 summarized_messages 12*|2 summary 9|3 window_tail 13|4 summary_message 12"];
  }
};
var PromptTokenBreakdownCategory = class _PromptTokenBreakdownCategory extends __protoMessage380 {
  constructor(data) {
    super();
    this.id = "";
    this.label = "";
    this.estimatedTokens = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptTokenBreakdownCategory().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptTokenBreakdownCategory().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptTokenBreakdownCategory().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptTokenBreakdownCategory, a, b);
  }
  static $() {
    return ["PromptTokenBreakdownCategory|1 id 9|2 label 9|3 estimated_tokens 13|4 character_count 13?"];
  }
};
var PromptTokenBreakdownSnapshot = class _PromptTokenBreakdownSnapshot extends __protoMessage380 {
  constructor(data) {
    super();
    this.totalUsedTokens = 0;
    this.maxTokens = 0;
    this.categories = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptTokenBreakdownSnapshot().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptTokenBreakdownSnapshot().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptTokenBreakdownSnapshot().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptTokenBreakdownSnapshot, a, b);
  }
  static $() {
    return ["PromptTokenBreakdownSnapshot|1 total_used_tokens 13|2 max_tokens 13|3 categories #0*", PromptTokenBreakdownCategory];
  }
};
var PromptContextSourceRef = class _PromptContextSourceRef extends __protoMessage380 {
  constructor(data) {
    super();
    this.sourceType = "";
    this.messageIndex = 0;
    this.contentPath = "";
    this.startOffset = 0;
    this.endOffset = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptContextSourceRef().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptContextSourceRef().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptContextSourceRef().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptContextSourceRef, a, b);
  }
  static $() {
    return ["PromptContextSourceRef|1 source_type 9|3 message_index 13|4 content_path 9|5 start_offset 13|6 end_offset 13"];
  }
};
var PromptContextNode = class _PromptContextNode extends __protoMessage380 {
  constructor(data) {
    super();
    this.id = "";
    this.kind = "";
    this.label = "";
    this.categoryId = "";
    this.estimatedTokens = 0;
    this.characterCount = 0;
    this.contentAvailable = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptContextNode().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptContextNode().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptContextNode().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptContextNode, a, b);
  }
  static $() {
    return ["PromptContextNode|1 id 9|2 parent_id 9?|3 kind 9|4 label 9|5 category_id 9|6 estimated_tokens 13|7 character_count 13|9 content_available 8|11 source #0?|12 inline_content 9?", PromptContextSourceRef];
  }
};
var PromptContextUsageTree = class _PromptContextUsageTree extends __protoMessage380 {
  constructor(data) {
    super();
    this.schemaVersion = 0;
    this.nodes = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _PromptContextUsageTree().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _PromptContextUsageTree().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _PromptContextUsageTree().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_PromptContextUsageTree, a, b);
  }
  static $() {
    return ["PromptContextUsageTree|1 schema_version 13|2 nodes #0*", PromptContextNode];
  }
};
var ConversationTokenDetails = class _ConversationTokenDetails extends __protoMessage380 {
  constructor(data) {
    super();
    this.usedTokens = 0;
    this.maxTokens = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationTokenDetails().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationTokenDetails().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationTokenDetails().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationTokenDetails, a, b);
  }
  static $() {
    return ["ConversationTokenDetails|1 used_tokens 13|2 max_tokens 13|3 breakdown #0?|4 prompt_context_usage_tree #1?|5 prompt_context_usage_snapshot_blob_id 12?", PromptTokenBreakdownSnapshot, PromptContextUsageTree];
  }
};
var FileState = class _FileState extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FileState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FileState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FileState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FileState, a, b);
  }
  static $() {
    return ["FileState|1 content 9?|2 initial_content 9?"];
  }
};
var FileStateStructure = class _FileStateStructure extends __protoMessage380 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FileStateStructure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FileStateStructure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FileStateStructure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FileStateStructure, a, b);
  }
  static $() {
    return ["FileStateStructure|1 content 12?|2 initial_content 12?"];
  }
};
var StepTiming = class _StepTiming extends __protoMessage380 {
  constructor(data) {
    super();
    this.durationMs = protoInt64.zero;
    this.timestampMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _StepTiming().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _StepTiming().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _StepTiming().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_StepTiming, a, b);
  }
  static $() {
    return ["StepTiming|1 duration_ms 4|2 timestamp_ms 4"];
  }
};
var CommunicateUpdateHistoryEntry = class _CommunicateUpdateHistoryEntry extends __protoMessage380 {
  constructor(data) {
    super();
    this.step = "";
    this.messageIndex = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommunicateUpdateHistoryEntry().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommunicateUpdateHistoryEntry().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommunicateUpdateHistoryEntry().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommunicateUpdateHistoryEntry, a, b);
  }
  static $() {
    return ["CommunicateUpdateHistoryEntry|1 step 9|3 message_index 13"];
  }
};
var CommunicateUpdateTurnState = class _CommunicateUpdateTurnState extends __protoMessage380 {
  constructor(data) {
    super();
    this.history = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CommunicateUpdateTurnState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CommunicateUpdateTurnState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CommunicateUpdateTurnState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CommunicateUpdateTurnState, a, b);
  }
  static $() {
    return ["CommunicateUpdateTurnState|1 history #0*|2 final_summary 9?|3 completed_subtitle 9?", CommunicateUpdateHistoryEntry];
  }
};
var SubagentPersistedState = class _SubagentPersistedState extends __protoMessage380 {
  constructor(data) {
    super();
    this.createdTimestampMs = protoInt64.zero;
    this.lastUsedTimestampMs = protoInt64.zero;
    this.environment = SubagentExecutionEnvironment.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentPersistedState().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentPersistedState().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentPersistedState().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentPersistedState, a, b);
  }
  static $() {
    return ["SubagentPersistedState|1 conversation_state #0|2 created_timestamp_ms 4|3 last_used_timestamp_ms 4|4 subagent_type #1|5 model_id 9?|6 environment #2|7 cloud_subagent #3?|8 first_class_bc_id 9?|9 cloud_requested_environment_build_id 9?|10 machine #4?", ConversationStateStructure, SubagentType, SubagentExecutionEnvironment, CloudSubagentReference, TargetMachine];
  }
};
var CloudSubagentReference = class _CloudSubagentReference extends __protoMessage380 {
  constructor(data) {
    super();
    this.bcId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _CloudSubagentReference().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _CloudSubagentReference().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _CloudSubagentReference().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_CloudSubagentReference, a, b);
  }
  static $() {
    return ["CloudSubagentReference|1 bc_id 9|2 transcript_path 9?"];
  }
};
var TrackedGitRepo = class _TrackedGitRepo extends __protoMessage380 {
  constructor(data) {
    super();
    this.repoPath = "";
    this.branchName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _TrackedGitRepo().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _TrackedGitRepo().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _TrackedGitRepo().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_TrackedGitRepo, a, b);
  }
  static $() {
    return ["TrackedGitRepo|1 repo_path 9|2 branch_name 9"];
  }
};
var ConversationStateStructure = class _ConversationStateStructure extends __protoMessage380 {
  constructor(data) {
    super();
    this.rootPromptMessagesJson = [];
    this.turns = [];
    this.todos = [];
    this.pendingToolCalls = [];
    this.previousWorkspaceUris = [];
    this.fileStates = {};
    this.fileStatesV2 = {};
    this.summaryArchives = [];
    this.turnTimings = [];
    this.subagentStates = {};
    this.selfSummaryCount = 0;
    this.readPaths = [];
    this.plans = {};
    this.trackedGitRepoBranches = [];
    this.communicateUpdateHistory = [];
    this.subagentThreads = {};
    this.communicateUpdateStatesByParentToolCallId = {};
    this.subagentRunsByParentToolCallId = {};
    this.subagentStateRefs = {};
    this.completedAskQuestionToolCallIds = [];
    this.durableSkillBlocks = [];
    this.recentUserMessageIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _ConversationStateStructure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _ConversationStateStructure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _ConversationStateStructure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_ConversationStateStructure, a, b);
  }
  static $() {
    return ["ConversationStateStructure|1 root_prompt_messages_json 12*|8 turns 12*|3 todos 12*|4 pending_tool_calls 9*|5 token_details #0|6 summary 12?|7 plan 12?|9 previous_workspace_uris 9*|10 mode #1?|11 summary_archive 12?|12 file_states 9,12|15 file_states_v2 9,#2|13 summary_archives 12*|14 turn_timings #3*|16 subagent_states 9,#4|17 self_summary_count 13|18 read_paths 9*|19 active_branch_name 9?|20 plans 9,#5|21 tracked_git_repo_branches #6*|22 agent_type 9?|23 communicate_update_history #7*|24 subagent_threads 9,9|25 communicate_update_final_summary 9?|28 communicate_update_completed_subtitle 9?|29 communicate_update_states_by_parent_tool_call_id 9,#8|30 subagent_runs_by_parent_tool_call_id 9,#9|26 conversation_started_timestamp_ms 4?|27 conversation_started_time_zone 9?|31 subagent_state_refs 9,12|32 goal_state #10?|33 is_root_project_conversation 8?|34 completed_ask_question_tool_call_ids 9*|35 durable_skill_blocks 9*|36 durable_custom_mode_id 9?|37 message_count_at_last_compaction 13?|38 recent_user_message_ids 9*|39 recent_user_message_ids_older_turn_count 13?", ConversationTokenDetails, AgentMode, FileStateStructure, StepTiming, SubagentPersistedState, PlanRegistryEntry, TrackedGitRepo, CommunicateUpdateHistoryEntry, CommunicateUpdateTurnState, SubagentRunState, GoalState];
  }
};

