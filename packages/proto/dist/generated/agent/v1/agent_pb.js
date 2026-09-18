var __protoPackage95, __protoMessage391, AgentMode, BackgroundTaskKind, BackgroundTaskStatus, BackgroundTaskNotificationContext, SubagentRunStatus, SubagentDispatchTool, CustomModeSource, SimulatedMsgReason, SubscriptionSource, ThinkingStyle, ResponseComparisonDisplayOrder, ResponseComparisonSkipReason, TaskArgs, TargetMachine, SameMachineTarget, NewCloudVmTarget, SelfHostedWorkerTarget, SelfHostedPoolTarget, SelfHostedWorkerLabel, TaskSuccess, TaskError, TaskResult, TaskToolCall, TaskToolCallDelta, SetActiveBranchArgs, SetActiveBranchSuccess, SetActiveBranchError, SetActiveBranchResult, SetActiveBranchToolCall, ToolCall, TruncatedToolCallArgs, TruncatedToolCallSuccess, TruncatedToolCallError, TruncatedToolCallResult, TruncatedToolCall, ToolCallDelta, ConversationStep, ConversationAction, TriggeringUserInfo, BackgroundTaskCompletionAction, BackgroundTaskCompletion, SubagentRunState, SubagentDispatchStep, CancelSubagentAction, BackgroundShellAction, BackgroundSubagentAction, InterruptedPendingToolCallResolution, InterruptedPendingToolCallResolutions, ConversationHistory, ConversationHistoryMessage, ConversationHistoryUserMessage, ConversationHistoryUserContent, ConversationHistoryTextContent, ConversationHistoryImageContent, ConversationHistoryAssistantMessage, ConversationHistoryAssistantContent, ConversationHistoryReasoningContent, ConversationHistoryRedactedReasoningContent, ConversationHistoryToolCall, ConversationHistoryToolMessage, ConversationHistoryToolResultContent, UserMessageAction, SubscriptionNotificationAction, GoalContinuationAction, InjectContextAction, UserContextInjection, SystemContextInjection, ContextInjectionState, ContextInjectionQueued, ContextInjectionDelivered, ContextInjectionQueuedForNextTurn, ContextInjectionCancelled, ContextInjectionRejected, SubmittedCustomMode, CustomModeDescriptor, SubmittedExitedCustomMode, CustomModeExitIntent, CustomModeIntent, CancelAction, ResumeAction, AsyncAskQuestionCompletionAction, SummarizeAction, ShellCommandAction, StartPlanAction, ExecutePlanAction, SubscriptionEventDisplay, UserDisplayInfo, ExecutePlanInfo, ProjectDetails, ProjectSubagentDetails, ProjectSideChatDetails, UserMessage, UserMessage_SimulatedMessageMetadata, AssistantMessage, ThinkingMessage, ShellCommand, ShellOutput, ConversationTurn, ConversationPlan, PlanRegistryEntry, GoalState, ConversationTurnStructure, AgentConversationTurn, AgentConversationTurnStructure, ShellConversationTurn, ShellConversationTurnStructure, ConversationSummary, ConversationSummaryArchive, PromptTokenBreakdownCategory, PromptTokenBreakdownSnapshot, PromptContextSourceRef, PromptContextNode, PromptContextUsageTree, PromptContextUsageSnapshot, ConversationTokenDetails, FileState, FileStateStructure, StepTiming, ConversationState, CommunicateUpdateHistoryEntry, CommunicateUpdateTurnState, SubagentPersistedState, CloudSubagentReference, TrackedGitRepo, ConversationStateStructure, ThinkingDetails, ClientLlmGatewayCredential, ModelDetails2, SubagentModelOverride, PreFetchedBlob, AgentRunRequest, TextDeltaUpdate, RoutedModelUpdate, ToolCallStartedUpdate, ToolCallCompletedUpdate, ToolCallDeltaUpdate, PartialToolCallUpdate, ThinkingDeltaUpdate, ThinkingCompletedUpdate, TokenDeltaUpdate, SummaryUpdate, SummaryStartedUpdate, HeartbeatUpdate, SummaryCompletedUpdate, ShellOutputDeltaUpdate, TurnEndedUpdate, UserMessageAppendedUpdate, StepStartedUpdate, StepCompletedUpdate, PromptSuggestionUpdate, ActiveBranchChange, FeedbackRequestCategory, FeedbackRequestCategoryGroup, FeedbackRequestUpdate, ResponseComparisonStarted, ResponseComparisonTextDelta, ResponseComparisonCompleted, ResponseComparisonSkipped, ResponseComparisonUpdate, InteractionUpdate, ContextInjectionStateUpdate, PostRequestPromptUpdate, GrokBotNudgeUpdate, InteractionQuery, InteractionResponse, AskQuestionInteractionQuery, AskQuestionInteractionResponse, TaskToolCallArgsProto, SubagentCredentials, CloudSubagentInheritedContext, PreparedTaskSubagent;
var init_agent_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/agent_pb.js"() {
    "use strict";
    init_esm();
    init_subagents_pb();
    init_shell_tool_pb();
    init_delete_tool_pb();
    init_glob_tool_pb();
    init_grep_tool_pb();
    init_read_tool_pb();
    init_todo_tool_pb();
    init_edit_tool_pb();
    init_ls_tool_pb();
    init_read_lints_tool_pb();
    init_mcp_tool_pb();
    init_semsearch_tool_pb();
    init_create_plan_tool_pb();
    init_web_search_tool_pb();
    init_mcp_resource_tool_pb();
    init_apply_agent_diff_tool_pb();
    init_ask_question_tool_pb();
    init_fetch_tool_pb();
    init_switch_mode_tool_pb();
    init_generate_image_tool_pb();
    init_record_screen_tool_pb();
    init_computer_use_tool_pb();
    init_write_shell_stdin_tool_pb();
    init_reflect_tool_pb();
    init_setup_vm_environment_tool_pb();
    init_start_grind_execution_tool_pb();
    init_start_grind_planning_tool_pb();
    init_web_fetch_tool_pb();
    init_report_bugfix_results_tool_pb();
    init_ai_attribution_tool_pb();
    init_pr_management_tool_pb();
    init_mcp_auth_tool_pb();
    init_await_tool_pb();
    init_blame_by_file_path_tool_pb();
    init_get_mcp_tools_tool_pb();
    init_report_bug_tool_pb();
    init_communicate_update_tool_pb();
    init_send_final_summary_tool_pb();
    init_update_pr_code_tour_tool_pb();
    init_replace_env_tool_pb();
    init_edit_pr_labels_tool_pb();
    init_record_ci_investigation_findings_tool_pb();
    init_send_message_tool_pb();
    init_fetch_cloud_agent_data_tool_pb();
    init_send_to_user_tool_pb();
    init_pi_read_tool_pb();
    init_pi_bash_tool_pb();
    init_pi_edit_tool_pb();
    init_pi_write_tool_pb();
    init_pi_grep_tool_pb();
    init_pi_find_tool_pb();
    init_pi_ls_tool_pb();
    init_connect_scm_tool_pb();
    init_search_conversations_tool_pb();
    init_goal_tool_pb();
    init_adopt_tool_pb();
    init_coordinator_tools_pb();
    init_get_pr_code_tour_tool_pb();
    init_cloud_canvas_tool_pb();
    init_hook_additional_context_pb();
    init_request_context_exec_pb();
    init_shell_exec_pb();
    init_selected_context_pb();
    init_requested_model_pb();
    init_mcp_pb();
    init_system_prompt_pb();
    init_compact();
    __protoPackage95 = "agent.v1.";
    __protoMessage391 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage95;
      }
    };
    AgentMode = /* @__PURE__ */ enumType(proto3, __protoPackage95, "AgentMode", [[0, "UNSPECIFIED"], [1, "AGENT"], [2, "ASK"], [3, "PLAN"], [4, "DEBUG"], [5, "TRIAGE"], [6, "PROJECT"], [7, "MULTITASK"], [8, "CUSTOM"]], 1);
    BackgroundTaskKind = /* @__PURE__ */ enumType(proto3, __protoPackage95, "BackgroundTaskKind", [[0, "UNSPECIFIED"], [1, "SHELL"], [2, "SUBAGENT"]], 1);
    BackgroundTaskStatus = /* @__PURE__ */ enumType(proto3, __protoPackage95, "BackgroundTaskStatus", [[0, "UNSPECIFIED"], [1, "SUCCESS"], [2, "ERROR"], [3, "ABORTED"]], 1);
    BackgroundTaskNotificationContext = /* @__PURE__ */ enumType(proto3, __protoPackage95, "BackgroundTaskNotificationContext", [[0, "UNSPECIFIED"], [1, "USER_DRIVEN_INTERACTIVE_CHILD"]], 1);
    SubagentRunStatus = /* @__PURE__ */ enumType(proto3, __protoPackage95, "SubagentRunStatus", [[0, "UNSPECIFIED"], [1, "RUNNING"], [2, "BACKGROUNDED"], [3, "SUCCESS"], [4, "ERROR"], [5, "ABORTED"]], 1);
    SubagentDispatchTool = /* @__PURE__ */ enumType(proto3, __protoPackage95, "SubagentDispatchTool", [[0, "UNSPECIFIED"], [1, "TASK"], [2, "CREATE_AGENT"], [3, "SEND_TO_AGENT"]], 1);
    CustomModeSource = /* @__PURE__ */ enumType(proto3, __protoPackage95, "CustomModeSource", [[0, "UNSPECIFIED"], [1, "AGENT_SKILL"], [2, "PLUGIN_SKILL"], [3, "REPO_SKILL"], [4, "MANAGED_SKILL"]], 1);
    SimulatedMsgReason = /* @__PURE__ */ enumType(proto3, __protoPackage95, "SimulatedMsgReason", [[0, "UNSPECIFIED"], [1, "PLAN_EXECUTION"], [2, "COMMIT_REMINDER"], [3, "BACKGROUND_TASK_COMPLETION"], [4, "DIFF_TAB_COMMIT"], [5, "DIFF_TAB_COMMIT_AND_PUSH"], [6, "DIFF_TAB_PUSH"], [7, "DIFF_TAB_CREATE_PR"], [8, "DIFF_TAB_FIX_MERGE_CONFLICTS"], [9, "USER_SENT_TO_SUBAGENT"], [10, "USER_INTERRUPTED_SUBAGENT"], [11, "USER_QUEUED_TO_SUBAGENT"], [12, "BABYSIT_PR_IN_CLOUD"], [13, "CI_PANEL_INVESTIGATE_FAILURE"], [14, "MULTITASK"], [15, "BUILD_IN_PARALLEL"], [16, "MULTITASK_SPLIT_PRS"], [17, "APPLY_LOCALLY"], [18, "CHECKOUT_BRANCH"], [19, "DIFF_TAB_UPDATE_BRANCH"], [20, "PR_TAB_BUGBOT_FIX"], [22, "RUN_BUGBOT_REVIEW"], [23, "RUN_SECURITY_REVIEW"], [24, "FSD_APPLY_FINDING"], [25, "FSD_UNDO_FINDING"], [26, "FSD_START"], [27, "FSD_PR_INTERRUPT"], [28, "SUBSCRIPTION"], [29, "DIFF_TAB_CREATE_BRANCH"], [30, "AGENT_STORE_CONFLICT"], [31, "GOAL_CONTINUATION"], [32, "PROJECT_KICKOFF"], [33, "MARKDOWN_PROMPT_BUTTON"], [34, "USER_QUICK_ACTION"]], 1);
    SubscriptionSource = /* @__PURE__ */ enumType(proto3, __protoPackage95, "SubscriptionSource", [[0, "UNSPECIFIED"], [1, "SLACK"], [2, "GITHUB"], [3, "LINEAR"], [4, "ORIGIN"]], 1);
    ThinkingStyle = /* @__PURE__ */ enumType(proto3, __protoPackage95, "ThinkingStyle", [[0, "UNSPECIFIED"], [1, "DEFAULT"], [2, "CODEX"], [3, "GPT5"]], 1);
    ResponseComparisonDisplayOrder = /* @__PURE__ */ enumType(proto3, __protoPackage95, "ResponseComparisonDisplayOrder", [[0, "UNSPECIFIED"], [1, "PARENT_FIRST"], [2, "ALTERNATE_FIRST"]], 1);
    ResponseComparisonSkipReason = /* @__PURE__ */ enumType(proto3, __protoPackage95, "ResponseComparisonSkipReason", [[0, "UNSPECIFIED"], [1, "ALTERNATE_TOOL_CALL"], [2, "INFERENCE_ERROR"], [3, "TIMEOUT"], [4, "CANCELLED"]], 1);
    TaskArgs = class _TaskArgs extends __protoMessage391 {
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
      static fromBinary(bytes, options2) {
        return new _TaskArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskArgs, a, b2);
      }
      static $() {
        return ["TaskArgs|1 description 9|2 prompt 9|3 subagent_type #0|4 model 9?|5 resume 9?|6 agent_id 9?|7 attachments 9*|8 mode #1|9 responding_to_message_ids 9*|10 environment #2|11 machine #3?", SubagentType, TaskMode, SubagentExecutionEnvironment, TargetMachine];
      }
    };
    TargetMachine = class _TargetMachine extends __protoMessage391 {
      constructor(data) {
        super();
        this.machine = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TargetMachine().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TargetMachine().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TargetMachine().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TargetMachine, a, b2);
      }
      static $() {
        return ["TargetMachine|1 same_machine #0 machine|2 new_cloud_vm #1 machine|3 self_hosted_worker #2 machine|4 self_hosted_pool #3 machine", SameMachineTarget, NewCloudVmTarget, SelfHostedWorkerTarget, SelfHostedPoolTarget];
      }
    };
    SameMachineTarget = class _SameMachineTarget extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SameMachineTarget().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SameMachineTarget().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SameMachineTarget().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SameMachineTarget, a, b2);
      }
      static $() {
        return ["SameMachineTarget"];
      }
    };
    NewCloudVmTarget = class _NewCloudVmTarget extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NewCloudVmTarget().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NewCloudVmTarget().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NewCloudVmTarget().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NewCloudVmTarget, a, b2);
      }
      static $() {
        return ["NewCloudVmTarget|1 environment_build_id 9?|2 base_branch 9?"];
      }
    };
    SelfHostedWorkerTarget = class _SelfHostedWorkerTarget extends __protoMessage391 {
      constructor(data) {
        super();
        this.workerId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SelfHostedWorkerTarget().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SelfHostedWorkerTarget().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SelfHostedWorkerTarget().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SelfHostedWorkerTarget, a, b2);
      }
      static $() {
        return ["SelfHostedWorkerTarget|1 worker_id 9"];
      }
    };
    SelfHostedPoolTarget = class _SelfHostedPoolTarget extends __protoMessage391 {
      constructor(data) {
        super();
        this.labels = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SelfHostedPoolTarget().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SelfHostedPoolTarget().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SelfHostedPoolTarget().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SelfHostedPoolTarget, a, b2);
      }
      static $() {
        return ["SelfHostedPoolTarget|1 pool 9?|2 labels #0*", SelfHostedWorkerLabel];
      }
    };
    SelfHostedWorkerLabel = class _SelfHostedWorkerLabel extends __protoMessage391 {
      constructor(data) {
        super();
        this.key = "";
        this.value = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SelfHostedWorkerLabel().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SelfHostedWorkerLabel().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SelfHostedWorkerLabel().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SelfHostedWorkerLabel, a, b2);
      }
      static $() {
        return ["SelfHostedWorkerLabel|1 key 9|2 value 9"];
      }
    };
    TaskSuccess = class _TaskSuccess extends __protoMessage391 {
      constructor(data) {
        super();
        this.conversationSteps = [];
        this.isBackground = false;
        this.backgroundReason = SubagentBackgroundReason.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskSuccess, a, b2);
      }
      static $() {
        return ["TaskSuccess|1 conversation_steps #0*|2 agent_id 9?|3 is_background 8|4 duration_ms 4?|5 result_suffix 9?|6 background_reason #1|7 transcript_path 9?", ConversationStep, SubagentBackgroundReason];
      }
    };
    TaskError = class _TaskError extends __protoMessage391 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskError, a, b2);
      }
      static $() {
        return ["TaskError|1 error 9"];
      }
    };
    TaskResult = class _TaskResult extends __protoMessage391 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskResult, a, b2);
      }
      static $() {
        return ["TaskResult|1 success #0 result|2 error #1 result", TaskSuccess, TaskError];
      }
    };
    TaskToolCall = class _TaskToolCall extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskToolCall, a, b2);
      }
      static $() {
        return ["TaskToolCall|1 args #0|2 result #1|3 cloud_agent_bc_id 9?", TaskArgs, TaskResult];
      }
    };
    TaskToolCallDelta = class _TaskToolCallDelta extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskToolCallDelta().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskToolCallDelta().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskToolCallDelta().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskToolCallDelta, a, b2);
      }
      static $() {
        return ["TaskToolCallDelta|1 interaction_update #0", InteractionUpdate];
      }
    };
    SetActiveBranchArgs = class _SetActiveBranchArgs extends __protoMessage391 {
      constructor(data) {
        super();
        this.path = "";
        this.branchName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetActiveBranchArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetActiveBranchArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetActiveBranchArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetActiveBranchArgs, a, b2);
      }
      static $() {
        return ["SetActiveBranchArgs|1 path 9|2 branch_name 9"];
      }
    };
    SetActiveBranchSuccess = class _SetActiveBranchSuccess extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetActiveBranchSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetActiveBranchSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetActiveBranchSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetActiveBranchSuccess, a, b2);
      }
      static $() {
        return ["SetActiveBranchSuccess"];
      }
    };
    SetActiveBranchError = class _SetActiveBranchError extends __protoMessage391 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetActiveBranchError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetActiveBranchError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetActiveBranchError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetActiveBranchError, a, b2);
      }
      static $() {
        return ["SetActiveBranchError|1 error 9"];
      }
    };
    SetActiveBranchResult = class _SetActiveBranchResult extends __protoMessage391 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetActiveBranchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetActiveBranchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetActiveBranchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetActiveBranchResult, a, b2);
      }
      static $() {
        return ["SetActiveBranchResult|1 success #0 result|2 error #1 result", SetActiveBranchSuccess, SetActiveBranchError];
      }
    };
    SetActiveBranchToolCall = class _SetActiveBranchToolCall extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SetActiveBranchToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SetActiveBranchToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SetActiveBranchToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SetActiveBranchToolCall, a, b2);
      }
      static $() {
        return ["SetActiveBranchToolCall|1 args #0|2 result #1", SetActiveBranchArgs, SetActiveBranchResult];
      }
    };
    ToolCall = class _ToolCall extends __protoMessage391 {
      constructor(data) {
        super();
        this.tool = { case: void 0 };
        this.hookAdditionalContexts = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolCall, a, b2);
      }
      static $() {
        return ["ToolCall|1 shell_tool_call #0 tool|3 delete_tool_call #1 tool|4 glob_tool_call #2 tool|5 grep_tool_call #3 tool|8 read_tool_call #4 tool|9 update_todos_tool_call #5 tool|10 read_todos_tool_call #6 tool|12 edit_tool_call #7 tool|13 ls_tool_call #8 tool|14 read_lints_tool_call #9 tool|15 mcp_tool_call #10 tool|16 sem_search_tool_call #11 tool|17 create_plan_tool_call #12 tool|18 web_search_tool_call #13 tool|19 task_tool_call #14 tool|20 list_mcp_resources_tool_call #15 tool|21 read_mcp_resource_tool_call #16 tool|22 apply_agent_diff_tool_call #17 tool|23 ask_question_tool_call #18 tool|24 fetch_tool_call #19 tool|25 switch_mode_tool_call #20 tool|28 generate_image_tool_call #21 tool|29 record_screen_tool_call #22 tool|30 computer_use_tool_call #23 tool|31 write_shell_stdin_tool_call #24 tool|32 reflect_tool_call #25 tool|33 setup_vm_environment_tool_call #26 tool|34 truncated_tool_call #27 tool|35 start_grind_execution_tool_call #28 tool|36 start_grind_planning_tool_call #29 tool|37 web_fetch_tool_call #30 tool|38 report_bugfix_results_tool_call #31 tool|39 ai_attribution_tool_call #32 tool|40 pr_management_tool_call #33 tool|41 mcp_auth_tool_call #34 tool|42 await_tool_call #35 tool|43 blame_by_file_path_tool_call #36 tool|44 get_mcp_tools_tool_call #37 tool|45 report_bug_tool_call #38 tool|46 set_active_branch_tool_call #39 tool|48 communicate_update_tool_call #40 tool|49 send_final_summary_tool_call #41 tool|50 update_pr_code_tour_tool_call #42 tool|51 replace_env_tool_call #43 tool|52 edit_pr_labels_tool_call #44 tool|53 record_ci_investigation_findings_tool_call #45 tool|55 send_message_tool_call #46 tool|56 fetch_cloud_agent_data_tool_call #47 tool|58 send_to_user_tool_call #48 tool|61 pi_read_tool_call #49 tool|62 pi_bash_tool_call #50 tool|63 pi_edit_tool_call #51 tool|64 pi_write_tool_call #52 tool|65 pi_grep_tool_call #53 tool|66 pi_find_tool_call #54 tool|67 pi_ls_tool_call #55 tool|68 connect_scm_tool_call #56 tool|69 search_conversations_tool_call #57 tool|70 create_goal_tool_call #58 tool|71 update_goal_tool_call #59 tool|72 adopt_tool_call #60 tool|73 get_agent_status_tool_call #61 tool|74 send_to_agent_tool_call #62 tool|75 read_agent_transcript_tool_call #63 tool|76 create_agent_tool_call #64 tool|77 stop_agent_tool_call #65 tool|78 get_pr_code_tour_tool_call #66 tool|79 write_canvas_tool_call #67 tool|80 read_canvas_tool_call #68 tool|54 hook_additional_contexts #69*|57 tool_call_id 9?|59 started_at_ms 4?|60 completed_at_ms 4?", ShellToolCall, DeleteToolCall, GlobToolCall, GrepToolCall, ReadToolCall, UpdateTodosToolCall, ReadTodosToolCall, EditToolCall, LsToolCall, ReadLintsToolCall, McpToolCall, SemSearchToolCall, CreatePlanToolCall, WebSearchToolCall, TaskToolCall, ListMcpResourcesToolCall, ReadMcpResourceToolCall, ApplyAgentDiffToolCall, AskQuestionToolCall, FetchToolCall, SwitchModeToolCall, GenerateImageToolCall, RecordScreenToolCall, ComputerUseToolCall, WriteShellStdinToolCall, ReflectToolCall, SetupVmEnvironmentToolCall, TruncatedToolCall, StartGrindExecutionToolCall, StartGrindPlanningToolCall, WebFetchToolCall, ReportBugfixResultsToolCall, AiAttributionToolCall, PrManagementToolCall, McpAuthToolCall, AwaitToolCall, BlameByFilePathToolCall, GetMcpToolsToolCall, ReportBugToolCall, SetActiveBranchToolCall, CommunicateUpdateToolCall, SendFinalSummaryToolCall, UpdatePrCodeTourToolCall, ReplaceEnvToolCall, EditPrLabelsToolCall, RecordCiInvestigationFindingsToolCall, SendMessageToolCall, FetchCloudAgentDataToolCall, SendToUserToolCall, PiReadToolCall, PiBashToolCall, PiEditToolCall, PiWriteToolCall, PiGrepToolCall, PiFindToolCall, PiLsToolCall, ConnectScmToolCall, SearchConversationsToolCall, CreateGoalToolCall, UpdateGoalToolCall, AdoptToolCall, GetAgentStatusToolCall, SendToAgentToolCall, ReadAgentTranscriptToolCall, CreateAgentToolCall, StopAgentToolCall, GetPrCodeTourToolCall, WriteCanvasToolCall, ReadCanvasToolCall, HookAdditionalContext];
      }
    };
    TruncatedToolCallArgs = class _TruncatedToolCallArgs extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TruncatedToolCallArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TruncatedToolCallArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TruncatedToolCallArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TruncatedToolCallArgs, a, b2);
      }
      static $() {
        return ["TruncatedToolCallArgs"];
      }
    };
    TruncatedToolCallSuccess = class _TruncatedToolCallSuccess extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TruncatedToolCallSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TruncatedToolCallSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TruncatedToolCallSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TruncatedToolCallSuccess, a, b2);
      }
      static $() {
        return ["TruncatedToolCallSuccess"];
      }
    };
    TruncatedToolCallError = class _TruncatedToolCallError extends __protoMessage391 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TruncatedToolCallError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TruncatedToolCallError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TruncatedToolCallError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TruncatedToolCallError, a, b2);
      }
      static $() {
        return ["TruncatedToolCallError|1 error 9"];
      }
    };
    TruncatedToolCallResult = class _TruncatedToolCallResult extends __protoMessage391 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TruncatedToolCallResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TruncatedToolCallResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TruncatedToolCallResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TruncatedToolCallResult, a, b2);
      }
      static $() {
        return ["TruncatedToolCallResult|1 success #0 result|2 error #1 result", TruncatedToolCallSuccess, TruncatedToolCallError];
      }
    };
    TruncatedToolCall = class _TruncatedToolCall extends __protoMessage391 {
      constructor(data) {
        super();
        this.originalStepBlobId = new Uint8Array(0);
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TruncatedToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TruncatedToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TruncatedToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TruncatedToolCall, a, b2);
      }
      static $() {
        return ["TruncatedToolCall|1 original_step_blob_id 12|2 args #0|3 result #1", TruncatedToolCallArgs, TruncatedToolCallResult];
      }
    };
    ToolCallDelta = class _ToolCallDelta extends __protoMessage391 {
      constructor(data) {
        super();
        this.delta = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolCallDelta().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolCallDelta().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolCallDelta().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolCallDelta, a, b2);
      }
      static $() {
        return ["ToolCallDelta|1 shell_tool_call_delta #0 delta|2 task_tool_call_delta #1 delta|3 edit_tool_call_delta #2 delta|4 replace_env_tool_call_delta #3 delta", ShellToolCallDelta, TaskToolCallDelta, EditToolCallDelta, ReplaceEnvToolCallDelta];
      }
    };
    ConversationStep = class _ConversationStep extends __protoMessage391 {
      constructor(data) {
        super();
        this.message = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationStep().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationStep().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationStep().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationStep, a, b2);
      }
      static $() {
        return ["ConversationStep|1 assistant_message #0 message|2 tool_call #1 message|3 thinking_message #2 message", AssistantMessage, ToolCall, ThinkingMessage];
      }
    };
    ConversationAction = class _ConversationAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.action = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationAction, a, b2);
      }
      static $() {
        return ["ConversationAction|1 user_message_action #0 action|2 resume_action #1 action|3 cancel_action #2 action|4 summarize_action #3 action|5 shell_command_action #4 action|6 start_plan_action #5 action|7 execute_plan_action #6 action|8 async_ask_question_completion_action #7 action|10 cancel_subagent_action #8 action|12 background_task_completion_action #9 action|13 background_shell_action #10 action|14 background_subagent_action #11 action|16 subscription_notification_action #12 action|18 goal_continuation_action #13 action|19 inject_context_action #14 action|11 triggering_auth_id 9?|15 triggering_user_info #15?|17 request_context_parts #16?", UserMessageAction, ResumeAction, CancelAction, SummarizeAction, ShellCommandAction, StartPlanAction, ExecutePlanAction, AsyncAskQuestionCompletionAction, CancelSubagentAction, BackgroundTaskCompletionAction, BackgroundShellAction, BackgroundSubagentAction, SubscriptionNotificationAction, GoalContinuationAction, InjectContextAction, TriggeringUserInfo, RequestContextPartReferences];
      }
    };
    TriggeringUserInfo = class _TriggeringUserInfo extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TriggeringUserInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TriggeringUserInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TriggeringUserInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TriggeringUserInfo, a, b2);
      }
      static $() {
        return ["TriggeringUserInfo|1 auth_id 9?|2 user_id 5?"];
      }
    };
    BackgroundTaskCompletionAction = class _BackgroundTaskCompletionAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.completions = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundTaskCompletionAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundTaskCompletionAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundTaskCompletionAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundTaskCompletionAction, a, b2);
      }
      static $() {
        return ["BackgroundTaskCompletionAction|1 completions #0*|2 system_reminder 9?", BackgroundTaskCompletion];
      }
    };
    BackgroundTaskCompletion = class _BackgroundTaskCompletion extends __protoMessage391 {
      constructor(data) {
        super();
        this.taskId = "";
        this.kind = BackgroundTaskKind.UNSPECIFIED;
        this.status = BackgroundTaskStatus.UNSPECIFIED;
        this.title = "";
        this.reason = BackgroundTaskCompletionReason.UNSPECIFIED;
        this.notificationContext = BackgroundTaskNotificationContext.UNSPECIFIED;
        this.recordOnly = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundTaskCompletion().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundTaskCompletion().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundTaskCompletion().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundTaskCompletion, a, b2);
      }
      static $() {
        return ["BackgroundTaskCompletion|1 task_id 9|2 kind #0|3 status #1|4 title 9|5 detail 9?|6 output_path 9?|7 thread_id 9?|8 reason #2|9 subagent_id 9?|10 tool_call_id 9?|11 notification_context #3|12 completed_at_ms 4?|13 record_only 8", BackgroundTaskKind, BackgroundTaskStatus, BackgroundTaskCompletionReason, BackgroundTaskNotificationContext];
      }
    };
    SubagentRunState = class _SubagentRunState extends __protoMessage391 {
      constructor(data) {
        super();
        this.parentToolCallId = "";
        this.environment = SubagentExecutionEnvironment.UNSPECIFIED;
        this.status = SubagentRunStatus.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentRunState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentRunState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentRunState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentRunState, a, b2);
      }
      static $() {
        return ["SubagentRunState|1 parent_tool_call_id 9|2 subagent_id 9?|3 environment #0|4 status #1|5 title 9?|6 detail 9?|7 transcript_path 9?|8 output_path 9?|9 completed_timestamp_ms 4?|10 completion_reason #2?", SubagentExecutionEnvironment, SubagentRunStatus, BackgroundTaskCompletionReason];
      }
    };
    SubagentDispatchStep = class _SubagentDispatchStep extends __protoMessage391 {
      constructor(data) {
        super();
        this.stepIndex = 0;
        this.toolCallId = "";
        this.tool = SubagentDispatchTool.UNSPECIFIED;
        this.backgrounded = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentDispatchStep().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentDispatchStep().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentDispatchStep().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentDispatchStep, a, b2);
      }
      static $() {
        return ["SubagentDispatchStep|1 step_index 13|2 tool_call_id 9|3 tool #0|4 backgrounded 8", SubagentDispatchTool];
      }
    };
    CancelSubagentAction = class _CancelSubagentAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.subagentId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CancelSubagentAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CancelSubagentAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CancelSubagentAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CancelSubagentAction, a, b2);
      }
      static $() {
        return ["CancelSubagentAction|1 subagent_id 9"];
      }
    };
    BackgroundShellAction = class _BackgroundShellAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundShellAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundShellAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundShellAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundShellAction, a, b2);
      }
      static $() {
        return ["BackgroundShellAction|1 tool_call_id 9"];
      }
    };
    BackgroundSubagentAction = class _BackgroundSubagentAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundSubagentAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundSubagentAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundSubagentAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundSubagentAction, a, b2);
      }
      static $() {
        return ["BackgroundSubagentAction|1 tool_call_id 9"];
      }
    };
    InterruptedPendingToolCallResolution = class _InterruptedPendingToolCallResolution extends __protoMessage391 {
      constructor(data) {
        super();
        this.toolCallId = "";
        this.resolution = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InterruptedPendingToolCallResolution().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InterruptedPendingToolCallResolution().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InterruptedPendingToolCallResolution().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InterruptedPendingToolCallResolution, a, b2);
      }
      static $() {
        return ["InterruptedPendingToolCallResolution|1 tool_call_id 9|2 shell_result #0 resolution|3 task_result #1 resolution", ShellResult, TaskResult];
      }
    };
    InterruptedPendingToolCallResolutions = class _InterruptedPendingToolCallResolutions extends __protoMessage391 {
      constructor(data) {
        super();
        this.resolutions = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InterruptedPendingToolCallResolutions().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InterruptedPendingToolCallResolutions().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InterruptedPendingToolCallResolutions().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InterruptedPendingToolCallResolutions, a, b2);
      }
      static $() {
        return ["InterruptedPendingToolCallResolutions|1 resolutions #0*", InterruptedPendingToolCallResolution];
      }
    };
    ConversationHistory = class _ConversationHistory extends __protoMessage391 {
      constructor(data) {
        super();
        this.messages = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistory, a, b2);
      }
      static $() {
        return ["ConversationHistory|1 messages #0*|2 replace_user_info 8?", ConversationHistoryMessage];
      }
    };
    ConversationHistoryMessage = class _ConversationHistoryMessage extends __protoMessage391 {
      constructor(data) {
        super();
        this.message = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryMessage, a, b2);
      }
      static $() {
        return ["ConversationHistoryMessage|1 user #0 message|2 assistant #1 message|3 tool #2 message", ConversationHistoryUserMessage, ConversationHistoryAssistantMessage, ConversationHistoryToolMessage];
      }
    };
    ConversationHistoryUserMessage = class _ConversationHistoryUserMessage extends __protoMessage391 {
      constructor(data) {
        super();
        this.content = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryUserMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryUserMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryUserMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryUserMessage, a, b2);
      }
      static $() {
        return ["ConversationHistoryUserMessage|1 content #0*", ConversationHistoryUserContent];
      }
    };
    ConversationHistoryUserContent = class _ConversationHistoryUserContent extends __protoMessage391 {
      constructor(data) {
        super();
        this.content = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryUserContent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryUserContent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryUserContent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryUserContent, a, b2);
      }
      static $() {
        return ["ConversationHistoryUserContent|1 text #0 content|2 image #1 content", ConversationHistoryTextContent, ConversationHistoryImageContent];
      }
    };
    ConversationHistoryTextContent = class _ConversationHistoryTextContent extends __protoMessage391 {
      constructor(data) {
        super();
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryTextContent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryTextContent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryTextContent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryTextContent, a, b2);
      }
      static $() {
        return ["ConversationHistoryTextContent|1 text 9"];
      }
    };
    ConversationHistoryImageContent = class _ConversationHistoryImageContent extends __protoMessage391 {
      constructor(data) {
        super();
        this.data = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryImageContent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryImageContent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryImageContent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryImageContent, a, b2);
      }
      static $() {
        return ["ConversationHistoryImageContent|1 data 9|2 mime_type 9?"];
      }
    };
    ConversationHistoryAssistantMessage = class _ConversationHistoryAssistantMessage extends __protoMessage391 {
      constructor(data) {
        super();
        this.content = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryAssistantMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryAssistantMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryAssistantMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryAssistantMessage, a, b2);
      }
      static $() {
        return ["ConversationHistoryAssistantMessage|1 content #0*", ConversationHistoryAssistantContent];
      }
    };
    ConversationHistoryAssistantContent = class _ConversationHistoryAssistantContent extends __protoMessage391 {
      constructor(data) {
        super();
        this.content = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryAssistantContent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryAssistantContent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryAssistantContent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryAssistantContent, a, b2);
      }
      static $() {
        return ["ConversationHistoryAssistantContent|1 text #0 content|2 reasoning #1 content|3 redacted_reasoning #2 content|4 tool_call #3 content", ConversationHistoryTextContent, ConversationHistoryReasoningContent, ConversationHistoryRedactedReasoningContent, ConversationHistoryToolCall];
      }
    };
    ConversationHistoryReasoningContent = class _ConversationHistoryReasoningContent extends __protoMessage391 {
      constructor(data) {
        super();
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryReasoningContent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryReasoningContent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryReasoningContent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryReasoningContent, a, b2);
      }
      static $() {
        return ["ConversationHistoryReasoningContent|1 text 9|2 signature 9?"];
      }
    };
    ConversationHistoryRedactedReasoningContent = class _ConversationHistoryRedactedReasoningContent extends __protoMessage391 {
      constructor(data) {
        super();
        this.data = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryRedactedReasoningContent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryRedactedReasoningContent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryRedactedReasoningContent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryRedactedReasoningContent, a, b2);
      }
      static $() {
        return ["ConversationHistoryRedactedReasoningContent|1 data 9"];
      }
    };
    ConversationHistoryToolCall = class _ConversationHistoryToolCall extends __protoMessage391 {
      constructor(data) {
        super();
        this.toolCallId = "";
        this.toolName = "";
        this.argsJson = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryToolCall, a, b2);
      }
      static $() {
        return ["ConversationHistoryToolCall|1 tool_call_id 9|2 tool_name 9|3 args_json 9"];
      }
    };
    ConversationHistoryToolMessage = class _ConversationHistoryToolMessage extends __protoMessage391 {
      constructor(data) {
        super();
        this.toolCallId = "";
        this.toolName = "";
        this.content = [];
        this.hookAdditionalContexts = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryToolMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryToolMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryToolMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryToolMessage, a, b2);
      }
      static $() {
        return ["ConversationHistoryToolMessage|1 tool_call_id 9|2 tool_name 9|3 content #0*|4 is_error 8?|5 hook_additional_contexts #1*", ConversationHistoryToolResultContent, HookAdditionalContext];
      }
    };
    ConversationHistoryToolResultContent = class _ConversationHistoryToolResultContent extends __protoMessage391 {
      constructor(data) {
        super();
        this.content = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationHistoryToolResultContent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationHistoryToolResultContent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationHistoryToolResultContent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationHistoryToolResultContent, a, b2);
      }
      static $() {
        return ["ConversationHistoryToolResultContent|1 text #0 content|2 image #1 content", ConversationHistoryTextContent, ConversationHistoryImageContent];
      }
    };
    UserMessageAction = class _UserMessageAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.prependUserMessages = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UserMessageAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UserMessageAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UserMessageAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UserMessageAction, a, b2);
      }
      static $() {
        return ["UserMessageAction|1 user_message #0|2 request_context #1|3 send_to_interaction_listener 8?|4 prepend_user_messages #0*|6 interrupted_pending_tool_call_resolutions #2?|7 conversation_history #3?", UserMessage, RequestContext, InterruptedPendingToolCallResolutions, ConversationHistory];
      }
    };
    SubscriptionNotificationAction = class _SubscriptionNotificationAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.notifications = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubscriptionNotificationAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubscriptionNotificationAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubscriptionNotificationAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubscriptionNotificationAction, a, b2);
      }
      static $() {
        return ["SubscriptionNotificationAction|1 notifications #0*|2 request_context #1|3 send_to_interaction_listener 8?", UserMessage, RequestContext];
      }
    };
    GoalContinuationAction = class _GoalContinuationAction extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GoalContinuationAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GoalContinuationAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GoalContinuationAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GoalContinuationAction, a, b2);
      }
      static $() {
        return ["GoalContinuationAction"];
      }
    };
    InjectContextAction = class _InjectContextAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.injectionId = "";
        this.expectedRunId = "";
        this.payload = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InjectContextAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InjectContextAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InjectContextAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InjectContextAction, a, b2);
      }
      static $() {
        return ["InjectContextAction|1 injection_id 9|2 expected_run_id 9|3 user_context #0 payload|4 system_context #1 payload", UserContextInjection, SystemContextInjection];
      }
    };
    UserContextInjection = class _UserContextInjection extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UserContextInjection().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UserContextInjection().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UserContextInjection().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UserContextInjection, a, b2);
      }
      static $() {
        return ["UserContextInjection|1 user_message #0|2 request_context #1", UserMessage, RequestContext];
      }
    };
    SystemContextInjection = class _SystemContextInjection extends __protoMessage391 {
      constructor(data) {
        super();
        this.producer = "";
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SystemContextInjection().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SystemContextInjection().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SystemContextInjection().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SystemContextInjection, a, b2);
      }
      static $() {
        return ["SystemContextInjection|1 producer 9|2 content 9"];
      }
    };
    ContextInjectionState = class _ContextInjectionState extends __protoMessage391 {
      constructor(data) {
        super();
        this.state = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextInjectionState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextInjectionState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextInjectionState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextInjectionState, a, b2);
      }
      static $() {
        return ["ContextInjectionState|1 queued #0 state|2 delivered #1 state|3 queued_for_next_turn #2 state|4 cancelled #3 state|5 rejected #4 state", ContextInjectionQueued, ContextInjectionDelivered, ContextInjectionQueuedForNextTurn, ContextInjectionCancelled, ContextInjectionRejected];
      }
    };
    ContextInjectionQueued = class _ContextInjectionQueued extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextInjectionQueued().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextInjectionQueued().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextInjectionQueued().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextInjectionQueued, a, b2);
      }
      static $() {
        return ["ContextInjectionQueued"];
      }
    };
    ContextInjectionDelivered = class _ContextInjectionDelivered extends __protoMessage391 {
      constructor(data) {
        super();
        this.step = 0;
        this.deliveryBatchId = "";
        this.deliveredAtMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextInjectionDelivered().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextInjectionDelivered().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextInjectionDelivered().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextInjectionDelivered, a, b2);
      }
      static $() {
        return ["ContextInjectionDelivered|1 step 5|2 delivery_batch_id 9|3 delivered_at_ms 3"];
      }
    };
    ContextInjectionQueuedForNextTurn = class _ContextInjectionQueuedForNextTurn extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextInjectionQueuedForNextTurn().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextInjectionQueuedForNextTurn().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextInjectionQueuedForNextTurn().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextInjectionQueuedForNextTurn, a, b2);
      }
      static $() {
        return ["ContextInjectionQueuedForNextTurn"];
      }
    };
    ContextInjectionCancelled = class _ContextInjectionCancelled extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextInjectionCancelled().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextInjectionCancelled().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextInjectionCancelled().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextInjectionCancelled, a, b2);
      }
      static $() {
        return ["ContextInjectionCancelled"];
      }
    };
    ContextInjectionRejected = class _ContextInjectionRejected extends __protoMessage391 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextInjectionRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextInjectionRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextInjectionRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextInjectionRejected, a, b2);
      }
      static $() {
        return ["ContextInjectionRejected|1 reason 9"];
      }
    };
    SubmittedCustomMode = class _SubmittedCustomMode extends __protoMessage391 {
      constructor(data) {
        super();
        this.id = "";
        this.label = "";
        this.source = CustomModeSource.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmittedCustomMode().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmittedCustomMode().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmittedCustomMode().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmittedCustomMode, a, b2);
      }
      static $() {
        return ["SubmittedCustomMode|1 id 9|2 label 9|5 source #0|6 source_path 9?|7 source_hash 9?|10 managed_skill_id 9?|11 plugin_id 9?|12 plugin_snapshot_token 9?", CustomModeSource];
      }
    };
    CustomModeDescriptor = class _CustomModeDescriptor extends __protoMessage391 {
      constructor(data) {
        super();
        this.id = "";
        this.label = "";
        this.source = CustomModeSource.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CustomModeDescriptor().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CustomModeDescriptor().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CustomModeDescriptor().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CustomModeDescriptor, a, b2);
      }
      static $() {
        return ["CustomModeDescriptor|1 id 9|2 label 9|3 description 9?|4 icon 9?|5 color 9?|6 source #0|7 source_path 9?|8 source_hash 9?|9 managed_skill_id 9?|10 plugin_id 9?|11 plugin_snapshot_token 9?", CustomModeSource];
      }
    };
    SubmittedExitedCustomMode = class _SubmittedExitedCustomMode extends __protoMessage391 {
      constructor(data) {
        super();
        this.id = "";
        this.label = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubmittedExitedCustomMode().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubmittedExitedCustomMode().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubmittedExitedCustomMode().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubmittedExitedCustomMode, a, b2);
      }
      static $() {
        return ["SubmittedExitedCustomMode|1 id 9|2 label 9"];
      }
    };
    CustomModeExitIntent = class _CustomModeExitIntent extends __protoMessage391 {
      constructor(data) {
        super();
        this.nextMode = AgentMode.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CustomModeExitIntent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CustomModeExitIntent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CustomModeExitIntent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CustomModeExitIntent, a, b2);
      }
      static $() {
        return ["CustomModeExitIntent|1 next_mode #0|2 exited_mode #1", AgentMode, SubmittedExitedCustomMode];
      }
    };
    CustomModeIntent = class _CustomModeIntent extends __protoMessage391 {
      constructor(data) {
        super();
        this.intent = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CustomModeIntent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CustomModeIntent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CustomModeIntent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CustomModeIntent, a, b2);
      }
      static $() {
        return ["CustomModeIntent|1 enter #0 intent|2 exit #1 intent", SubmittedCustomMode, CustomModeExitIntent];
      }
    };
    CancelAction = class _CancelAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CancelAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CancelAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CancelAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CancelAction, a, b2);
      }
      static $() {
        return ["CancelAction|1 reason 9|3 interrupted_pending_tool_call_resolutions #0?", InterruptedPendingToolCallResolutions];
      }
    };
    ResumeAction = class _ResumeAction extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ResumeAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ResumeAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ResumeAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ResumeAction, a, b2);
      }
      static $() {
        return ["ResumeAction|2 request_context #0", RequestContext];
      }
    };
    AsyncAskQuestionCompletionAction = class _AsyncAskQuestionCompletionAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.originalToolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AsyncAskQuestionCompletionAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AsyncAskQuestionCompletionAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AsyncAskQuestionCompletionAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AsyncAskQuestionCompletionAction, a, b2);
      }
      static $() {
        return ["AsyncAskQuestionCompletionAction|1 original_tool_call_id 9|2 original_args #0|3 result #1", AskQuestionArgs, AskQuestionResult];
      }
    };
    SummarizeAction = class _SummarizeAction extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SummarizeAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SummarizeAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SummarizeAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SummarizeAction, a, b2);
      }
      static $() {
        return ["SummarizeAction"];
      }
    };
    ShellCommandAction = class _ShellCommandAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.execId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellCommandAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellCommandAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellCommandAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellCommandAction, a, b2);
      }
      static $() {
        return ["ShellCommandAction|1 shell_command #0|2 exec_id 9", ShellCommand];
      }
    };
    StartPlanAction = class _StartPlanAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.isSpec = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StartPlanAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StartPlanAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StartPlanAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StartPlanAction, a, b2);
      }
      static $() {
        return ["StartPlanAction|1 user_message #0|2 request_context #1|3 is_spec 8", UserMessage, RequestContext];
      }
    };
    ExecutePlanAction = class _ExecutePlanAction extends __protoMessage391 {
      constructor(data) {
        super();
        this.executionMode = AgentMode.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecutePlanAction().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecutePlanAction().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecutePlanAction().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecutePlanAction, a, b2);
      }
      static $() {
        return ["ExecutePlanAction|1 request_context #0|2 plan #1?|3 plan_file_uri 9?|4 plan_file_content 9?|5 execution_mode #2|6 kickoff_message_id 9?|7 plan_id 9?|8 plan_file_path 9?", RequestContext, ConversationPlan, AgentMode];
      }
    };
    SubscriptionEventDisplay = class _SubscriptionEventDisplay extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubscriptionEventDisplay().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubscriptionEventDisplay().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubscriptionEventDisplay().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubscriptionEventDisplay, a, b2);
      }
      static $() {
        return ["SubscriptionEventDisplay|1 display_label 9?|2 resource_url 9?|3 subscription_id 9?"];
      }
    };
    UserDisplayInfo = class _UserDisplayInfo extends __protoMessage391 {
      constructor(data) {
        super();
        this.userId = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UserDisplayInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UserDisplayInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UserDisplayInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UserDisplayInfo, a, b2);
      }
      static $() {
        return ["UserDisplayInfo|1 user_id 5|2 display_name 9?|3 email 9?|4 profile_picture_url 9?"];
      }
    };
    ExecutePlanInfo = class _ExecutePlanInfo extends __protoMessage391 {
      constructor(data) {
        super();
        this.planId = "";
        this.planTitle = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ExecutePlanInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ExecutePlanInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ExecutePlanInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ExecutePlanInfo, a, b2);
      }
      static $() {
        return ["ExecutePlanInfo|1 plan_id 9|2 plan_title 9"];
      }
    };
    ProjectDetails = class _ProjectDetails extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ProjectDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ProjectDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ProjectDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ProjectDetails, a, b2);
      }
      static $() {
        return ["ProjectDetails|1 name 9?|2 subagent #0?|3 side_chat #1?", ProjectSubagentDetails, ProjectSideChatDetails];
      }
    };
    ProjectSubagentDetails = class _ProjectSubagentDetails extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ProjectSubagentDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ProjectSubagentDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ProjectSubagentDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ProjectSubagentDetails, a, b2);
      }
      static $() {
        return ["ProjectSubagentDetails|2 store_dir 9?"];
      }
    };
    ProjectSideChatDetails = class _ProjectSideChatDetails extends __protoMessage391 {
      constructor(data) {
        super();
        this.storeDir = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ProjectSideChatDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ProjectSideChatDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ProjectSideChatDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ProjectSideChatDetails, a, b2);
      }
      static $() {
        return ["ProjectSideChatDetails|1 store_dir 9"];
      }
    };
    UserMessage = class _UserMessage extends __protoMessage391 {
      constructor(data) {
        super();
        this.text = "";
        this.messageId = "";
        this.mode = AgentMode.UNSPECIFIED;
        this.conversationStateBlobId = new Uint8Array(0);
        this.hookAdditionalContexts = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UserMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UserMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UserMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UserMessage, a, b2);
      }
      static $() {
        return ["UserMessage|1 text 9|2 message_id 9|3 selected_context #0?|4 mode #1|5 is_simulated_msg 8?|6 best_of_n_group_id 9?|7 try_use_best_of_n_promotion 8?|8 rich_text 9?|9 simulated_msg_reason #2?|10 conversation_state_blob_id 12|11 subagent_system_reminder 9?|13 triggering_user_info #3?|14 execute_plan_info #4?|15 simulated_message_metadata #5?|16 prompt_reference_id 9?|17 thread_id 9?|18 text_blob_id 12?|19 rich_text_blob_id 12?|21 hook_additional_contexts #6*|22 custom_mode_intent #7?|23 project_details #8?|24 turn_steer 8?|25 started_at_ms 4?|26 completed_at_ms 4?|27 sent_by_agent_id 9?", SelectedContext, AgentMode, SimulatedMsgReason, TriggeringUserInfo, ExecutePlanInfo, UserMessage_SimulatedMessageMetadata, HookAdditionalContext, CustomModeIntent, ProjectDetails];
      }
    };
    UserMessage_SimulatedMessageMetadata = class _UserMessage_SimulatedMessageMetadata extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UserMessage_SimulatedMessageMetadata().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UserMessage_SimulatedMessageMetadata().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UserMessage_SimulatedMessageMetadata().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UserMessage_SimulatedMessageMetadata, a, b2);
      }
      static $() {
        return ["UserMessage.SimulatedMessageMetadata|1 title 9?|2 task_id 9?|3 fsd_finding_action 9?|4 url 9?|5 subscription_source #0?|6 subscription_event_display #1?", SubscriptionSource, SubscriptionEventDisplay];
      }
    };
    AssistantMessage = class _AssistantMessage extends __protoMessage391 {
      constructor(data) {
        super();
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AssistantMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AssistantMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AssistantMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AssistantMessage, a, b2);
      }
      static $() {
        return ["AssistantMessage|1 text 9|2 started_at_ms 4?|3 completed_at_ms 4?"];
      }
    };
    ThinkingMessage = class _ThinkingMessage extends __protoMessage391 {
      constructor(data) {
        super();
        this.text = "";
        this.durationMs = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ThinkingMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ThinkingMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ThinkingMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ThinkingMessage, a, b2);
      }
      static $() {
        return ["ThinkingMessage|1 text 9|2 duration_ms 13|3 started_at_ms 4?|4 completed_at_ms 4?"];
      }
    };
    ShellCommand = class _ShellCommand extends __protoMessage391 {
      constructor(data) {
        super();
        this.command = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellCommand().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellCommand().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellCommand().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellCommand, a, b2);
      }
      static $() {
        return ["ShellCommand|1 command 9"];
      }
    };
    ShellOutput = class _ShellOutput extends __protoMessage391 {
      constructor(data) {
        super();
        this.stdout = "";
        this.stderr = "";
        this.exitCode = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellOutput().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellOutput().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellOutput().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellOutput, a, b2);
      }
      static $() {
        return ["ShellOutput|1 stdout 9|2 stderr 9|3 exit_code 5"];
      }
    };
    ConversationTurn = class _ConversationTurn extends __protoMessage391 {
      constructor(data) {
        super();
        this.turn = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationTurn().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationTurn().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationTurn().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationTurn, a, b2);
      }
      static $() {
        return ["ConversationTurn|1 agent_conversation_turn #0 turn|2 shell_conversation_turn #1 turn", AgentConversationTurn, ShellConversationTurn];
      }
    };
    ConversationPlan = class _ConversationPlan extends __protoMessage391 {
      constructor(data) {
        super();
        this.plan = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationPlan().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationPlan().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationPlan().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationPlan, a, b2);
      }
      static $() {
        return ["ConversationPlan|1 plan 9"];
      }
    };
    PlanRegistryEntry = class _PlanRegistryEntry extends __protoMessage391 {
      constructor(data) {
        super();
        this.id = "";
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PlanRegistryEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PlanRegistryEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PlanRegistryEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PlanRegistryEntry, a, b2);
      }
      static $() {
        return ["PlanRegistryEntry|1 id 9|2 path 9"];
      }
    };
    GoalState = class _GoalState extends __protoMessage391 {
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
      static fromBinary(bytes, options2) {
        return new _GoalState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GoalState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GoalState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GoalState, a, b2);
      }
      static $() {
        return ["GoalState|1 conversation_id 9|2 goal_id 9|3 objective 9|4 status #0|5 idle_continuations_without_tool_calls 13|6 active_duration_ms 4?|7 last_accrued_at_ms 4?|8 continuation_count 13|9 agent_session_id 9?", GoalStatus];
      }
    };
    ConversationTurnStructure = class _ConversationTurnStructure extends __protoMessage391 {
      constructor(data) {
        super();
        this.turn = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationTurnStructure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationTurnStructure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationTurnStructure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationTurnStructure, a, b2);
      }
      static $() {
        return ["ConversationTurnStructure|1 agent_conversation_turn #0 turn|2 shell_conversation_turn #1 turn", AgentConversationTurnStructure, ShellConversationTurnStructure];
      }
    };
    AgentConversationTurn = class _AgentConversationTurn extends __protoMessage391 {
      constructor(data) {
        super();
        this.steps = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentConversationTurn().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentConversationTurn().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentConversationTurn().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentConversationTurn, a, b2);
      }
      static $() {
        return ["AgentConversationTurn|1 user_message #0|2 steps #1*|3 request_id 9?", UserMessage, ConversationStep];
      }
    };
    AgentConversationTurnStructure = class _AgentConversationTurnStructure extends __protoMessage391 {
      constructor(data) {
        super();
        this.userMessage = new Uint8Array(0);
        this.steps = [];
        this.sendMessageStepIndices = [];
        this.subagentDispatchSteps = [];
        this.dynamicToolNames = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentConversationTurnStructure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentConversationTurnStructure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentConversationTurnStructure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentConversationTurnStructure, a, b2);
      }
      static $() {
        return ["AgentConversationTurnStructure|1 user_message 12|2 steps 12*|3 request_id 9?|4 encrypted_model 9?|5 dynamic_tool_count 13?|6 send_message_step_indices 13*|7 routed_model_display_name 9?|8 subagent_dispatch_steps #0*|9 dynamic_tool_names 9*|10 user_message_id 9?", SubagentDispatchStep];
      }
    };
    ShellConversationTurn = class _ShellConversationTurn extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellConversationTurn().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellConversationTurn().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellConversationTurn().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellConversationTurn, a, b2);
      }
      static $() {
        return ["ShellConversationTurn|1 shell_command #0|2 shell_output #1", ShellCommand, ShellOutput];
      }
    };
    ShellConversationTurnStructure = class _ShellConversationTurnStructure extends __protoMessage391 {
      constructor(data) {
        super();
        this.shellCommand = new Uint8Array(0);
        this.shellOutput = new Uint8Array(0);
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellConversationTurnStructure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellConversationTurnStructure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellConversationTurnStructure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellConversationTurnStructure, a, b2);
      }
      static $() {
        return ["ShellConversationTurnStructure|1 shell_command 12|2 shell_output 12"];
      }
    };
    ConversationSummary = class _ConversationSummary extends __protoMessage391 {
      constructor(data) {
        super();
        this.summary = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationSummary().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationSummary().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationSummary().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationSummary, a, b2);
      }
      static $() {
        return ["ConversationSummary|1 summary 9"];
      }
    };
    ConversationSummaryArchive = class _ConversationSummaryArchive extends __protoMessage391 {
      constructor(data) {
        super();
        this.summarizedMessages = [];
        this.summary = "";
        this.windowTail = 0;
        this.summaryMessage = new Uint8Array(0);
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationSummaryArchive().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationSummaryArchive().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationSummaryArchive().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationSummaryArchive, a, b2);
      }
      static $() {
        return ["ConversationSummaryArchive|1 summarized_messages 12*|2 summary 9|3 window_tail 13|4 summary_message 12"];
      }
    };
    PromptTokenBreakdownCategory = class _PromptTokenBreakdownCategory extends __protoMessage391 {
      constructor(data) {
        super();
        this.id = "";
        this.label = "";
        this.estimatedTokens = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PromptTokenBreakdownCategory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PromptTokenBreakdownCategory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PromptTokenBreakdownCategory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PromptTokenBreakdownCategory, a, b2);
      }
      static $() {
        return ["PromptTokenBreakdownCategory|1 id 9|2 label 9|3 estimated_tokens 13|4 character_count 13?"];
      }
    };
    PromptTokenBreakdownSnapshot = class _PromptTokenBreakdownSnapshot extends __protoMessage391 {
      constructor(data) {
        super();
        this.totalUsedTokens = 0;
        this.maxTokens = 0;
        this.categories = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PromptTokenBreakdownSnapshot().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PromptTokenBreakdownSnapshot().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PromptTokenBreakdownSnapshot().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PromptTokenBreakdownSnapshot, a, b2);
      }
      static $() {
        return ["PromptTokenBreakdownSnapshot|1 total_used_tokens 13|2 max_tokens 13|3 categories #0*", PromptTokenBreakdownCategory];
      }
    };
    PromptContextSourceRef = class _PromptContextSourceRef extends __protoMessage391 {
      constructor(data) {
        super();
        this.sourceType = "";
        this.messageIndex = 0;
        this.contentPath = "";
        this.startOffset = 0;
        this.endOffset = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PromptContextSourceRef().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PromptContextSourceRef().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PromptContextSourceRef().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PromptContextSourceRef, a, b2);
      }
      static $() {
        return ["PromptContextSourceRef|1 source_type 9|3 message_index 13|4 content_path 9|5 start_offset 13|6 end_offset 13"];
      }
    };
    PromptContextNode = class _PromptContextNode extends __protoMessage391 {
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
      static fromBinary(bytes, options2) {
        return new _PromptContextNode().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PromptContextNode().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PromptContextNode().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PromptContextNode, a, b2);
      }
      static $() {
        return ["PromptContextNode|1 id 9|2 parent_id 9?|3 kind 9|4 label 9|5 category_id 9|6 estimated_tokens 13|7 character_count 13|9 content_available 8|11 source #0?|12 inline_content 9?", PromptContextSourceRef];
      }
    };
    PromptContextUsageTree = class _PromptContextUsageTree extends __protoMessage391 {
      constructor(data) {
        super();
        this.schemaVersion = 0;
        this.nodes = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PromptContextUsageTree().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PromptContextUsageTree().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PromptContextUsageTree().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PromptContextUsageTree, a, b2);
      }
      static $() {
        return ["PromptContextUsageTree|1 schema_version 13|2 nodes #0*", PromptContextNode];
      }
    };
    PromptContextUsageSnapshot = class _PromptContextUsageSnapshot extends __protoMessage391 {
      constructor(data) {
        super();
        this.rootPromptMessagesJson = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PromptContextUsageSnapshot().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PromptContextUsageSnapshot().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PromptContextUsageSnapshot().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PromptContextUsageSnapshot, a, b2);
      }
      static $() {
        return ["PromptContextUsageSnapshot|1 prompt_context_usage_tree #0|2 root_prompt_messages_json 12*", PromptContextUsageTree];
      }
    };
    ConversationTokenDetails = class _ConversationTokenDetails extends __protoMessage391 {
      constructor(data) {
        super();
        this.usedTokens = 0;
        this.maxTokens = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationTokenDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationTokenDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationTokenDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationTokenDetails, a, b2);
      }
      static $() {
        return ["ConversationTokenDetails|1 used_tokens 13|2 max_tokens 13|3 breakdown #0?|4 prompt_context_usage_tree #1?|5 prompt_context_usage_snapshot_blob_id 12?", PromptTokenBreakdownSnapshot, PromptContextUsageTree];
      }
    };
    FileState = class _FileState extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FileState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FileState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FileState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FileState, a, b2);
      }
      static $() {
        return ["FileState|1 content 9?|2 initial_content 9?"];
      }
    };
    FileStateStructure = class _FileStateStructure extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FileStateStructure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FileStateStructure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FileStateStructure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FileStateStructure, a, b2);
      }
      static $() {
        return ["FileStateStructure|1 content 12?|2 initial_content 12?"];
      }
    };
    StepTiming = class _StepTiming extends __protoMessage391 {
      constructor(data) {
        super();
        this.durationMs = protoInt64.zero;
        this.timestampMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StepTiming().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StepTiming().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StepTiming().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StepTiming, a, b2);
      }
      static $() {
        return ["StepTiming|1 duration_ms 4|2 timestamp_ms 4"];
      }
    };
    ConversationState = class _ConversationState extends __protoMessage391 {
      constructor(data) {
        super();
        this.rootPromptMessagesJson = [];
        this.turns = [];
        this.todos = [];
        this.pendingToolCalls = [];
        this.fileStates = {};
        this.summaryArchives = [];
        this.plans = {};
        this.communicateUpdateHistory = [];
        this.communicateUpdateStatesByParentToolCallId = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConversationState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationState, a, b2);
      }
      static $() {
        return ["ConversationState|1 root_prompt_messages_json 9*|8 turns #0*|3 todos #1*|4 pending_tool_calls 9*|5 token_details #2|6 summary #3?|7 plan #4?|9 summary_archive #5?|10 file_states 9,#6|11 summary_archives #5*|12 plans 9,#7|13 communicate_update_history #8*|14 communicate_update_final_summary 9?|15 communicate_update_completed_subtitle 9?|16 communicate_update_states_by_parent_tool_call_id 9,#9", ConversationTurn, TodoItem, ConversationTokenDetails, ConversationSummary, ConversationPlan, ConversationSummaryArchive, FileState, PlanRegistryEntry, CommunicateUpdateHistoryEntry, CommunicateUpdateTurnState];
      }
    };
    CommunicateUpdateHistoryEntry = class _CommunicateUpdateHistoryEntry extends __protoMessage391 {
      constructor(data) {
        super();
        this.step = "";
        this.messageIndex = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommunicateUpdateHistoryEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommunicateUpdateHistoryEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommunicateUpdateHistoryEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommunicateUpdateHistoryEntry, a, b2);
      }
      static $() {
        return ["CommunicateUpdateHistoryEntry|1 step 9|3 message_index 13"];
      }
    };
    CommunicateUpdateTurnState = class _CommunicateUpdateTurnState extends __protoMessage391 {
      constructor(data) {
        super();
        this.history = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CommunicateUpdateTurnState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CommunicateUpdateTurnState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CommunicateUpdateTurnState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CommunicateUpdateTurnState, a, b2);
      }
      static $() {
        return ["CommunicateUpdateTurnState|1 history #0*|2 final_summary 9?|3 completed_subtitle 9?", CommunicateUpdateHistoryEntry];
      }
    };
    SubagentPersistedState = class _SubagentPersistedState extends __protoMessage391 {
      constructor(data) {
        super();
        this.createdTimestampMs = protoInt64.zero;
        this.lastUsedTimestampMs = protoInt64.zero;
        this.environment = SubagentExecutionEnvironment.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentPersistedState().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentPersistedState().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentPersistedState().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentPersistedState, a, b2);
      }
      static $() {
        return ["SubagentPersistedState|1 conversation_state #0|2 created_timestamp_ms 4|3 last_used_timestamp_ms 4|4 subagent_type #1|5 model_id 9?|6 environment #2|7 cloud_subagent #3?|8 first_class_bc_id 9?|9 cloud_requested_environment_build_id 9?|10 machine #4?", ConversationStateStructure, SubagentType, SubagentExecutionEnvironment, CloudSubagentReference, TargetMachine];
      }
    };
    CloudSubagentReference = class _CloudSubagentReference extends __protoMessage391 {
      constructor(data) {
        super();
        this.bcId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloudSubagentReference().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloudSubagentReference().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloudSubagentReference().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloudSubagentReference, a, b2);
      }
      static $() {
        return ["CloudSubagentReference|1 bc_id 9|2 transcript_path 9?"];
      }
    };
    TrackedGitRepo = class _TrackedGitRepo extends __protoMessage391 {
      constructor(data) {
        super();
        this.repoPath = "";
        this.branchName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TrackedGitRepo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TrackedGitRepo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TrackedGitRepo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TrackedGitRepo, a, b2);
      }
      static $() {
        return ["TrackedGitRepo|1 repo_path 9|2 branch_name 9"];
      }
    };
    ConversationStateStructure = class _ConversationStateStructure extends __protoMessage391 {
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
      static fromBinary(bytes, options2) {
        return new _ConversationStateStructure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConversationStateStructure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConversationStateStructure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConversationStateStructure, a, b2);
      }
      static $() {
        return ["ConversationStateStructure|1 root_prompt_messages_json 12*|8 turns 12*|3 todos 12*|4 pending_tool_calls 9*|5 token_details #0|6 summary 12?|7 plan 12?|9 previous_workspace_uris 9*|10 mode #1?|11 summary_archive 12?|12 file_states 9,12|15 file_states_v2 9,#2|13 summary_archives 12*|14 turn_timings #3*|16 subagent_states 9,#4|17 self_summary_count 13|18 read_paths 9*|19 active_branch_name 9?|20 plans 9,#5|21 tracked_git_repo_branches #6*|22 agent_type 9?|23 communicate_update_history #7*|24 subagent_threads 9,9|25 communicate_update_final_summary 9?|28 communicate_update_completed_subtitle 9?|29 communicate_update_states_by_parent_tool_call_id 9,#8|30 subagent_runs_by_parent_tool_call_id 9,#9|26 conversation_started_timestamp_ms 4?|27 conversation_started_time_zone 9?|31 subagent_state_refs 9,12|32 goal_state #10?|33 is_root_project_conversation 8?|34 completed_ask_question_tool_call_ids 9*|35 durable_skill_blocks 9*|36 durable_custom_mode_id 9?|37 message_count_at_last_compaction 13?|38 recent_user_message_ids 9*|39 recent_user_message_ids_older_turn_count 13?", ConversationTokenDetails, AgentMode, FileStateStructure, StepTiming, SubagentPersistedState, PlanRegistryEntry, TrackedGitRepo, CommunicateUpdateHistoryEntry, CommunicateUpdateTurnState, SubagentRunState, GoalState];
      }
    };
    ThinkingDetails = class _ThinkingDetails extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ThinkingDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ThinkingDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ThinkingDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ThinkingDetails, a, b2);
      }
      static $() {
        return ["ThinkingDetails"];
      }
    };
    ClientLlmGatewayCredential = class _ClientLlmGatewayCredential extends __protoMessage391 {
      constructor(data) {
        super();
        this.bearerToken = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ClientLlmGatewayCredential().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ClientLlmGatewayCredential().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ClientLlmGatewayCredential().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ClientLlmGatewayCredential, a, b2);
      }
      static $() {
        return ["ClientLlmGatewayCredential|1 bearer_token 9"];
      }
    };
    ModelDetails2 = class _ModelDetails extends __protoMessage391 {
      constructor(data) {
        super();
        this.modelId = "";
        this.displayModelId = "";
        this.displayName = "";
        this.displayNameShort = "";
        this.aliases = [];
        this.credentials = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ModelDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ModelDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ModelDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ModelDetails, a, b2);
      }
      static $() {
        return ["ModelDetails|1 model_id 9|3 display_model_id 9|4 display_name 9|5 display_name_short 9|6 aliases 9*|2 thinking_details #0?|7 max_mode 8?|8 api_key_credentials #1 credentials|9 azure_credentials #2 credentials|10 bedrock_credentials #3 credentials", ThinkingDetails, ApiKeyCredentials, AzureCredentials, BedrockCredentials];
      }
    };
    SubagentModelOverride = class _SubagentModelOverride extends __protoMessage391 {
      constructor(data) {
        super();
        this.subagentType = "";
        this.selection = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentModelOverride().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentModelOverride().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentModelOverride().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentModelOverride, a, b2);
      }
      static $() {
        return ["SubagentModelOverride|1 subagent_type 9|2 model #0 selection|3 inherit 8 selection|4 disabled 8 selection", RequestedModel];
      }
    };
    PreFetchedBlob = class _PreFetchedBlob extends __protoMessage391 {
      constructor(data) {
        super();
        this.id = new Uint8Array(0);
        this.value = new Uint8Array(0);
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PreFetchedBlob().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PreFetchedBlob().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PreFetchedBlob().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PreFetchedBlob, a, b2);
      }
      static $() {
        return ["PreFetchedBlob|1 id 12|2 value 12"];
      }
    };
    AgentRunRequest = class _AgentRunRequest extends __protoMessage391 {
      constructor(data) {
        super();
        this.selectedSubagentModels = [];
        this.selectedSubagentModelDetails = [];
        this.preFetchedBlobs = [];
        this.subagentModelOverrides = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AgentRunRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AgentRunRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AgentRunRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AgentRunRequest, a, b2);
      }
      static $() {
        return ["AgentRunRequest|1 conversation_state #0|2 action #1|3 model_details #2|9 requested_model #3?|4 mcp_tools #4|5 conversation_id 9?|6 mcp_file_system_options #5?|7 skill_options #6?|8 custom_system_prompt 9?|10 suggest_next_prompt 8?|11 subagent_type_name 9?|12 exclude_workspace_context 8?|13 harness 9?|14 selected_subagent_models #3*|15 selected_subagent_model_details #2*|16 conversation_group_id 9?|17 pre_fetched_blobs #7*|18 dev_raw_model_slug 9?|19 client_supports_inline_images 8?|20 subagent_model_overrides #8*|21 can_create_cloud_subagents 8?|22 suppress_subagent_progress_update_tool 8?|23 client_supports_send_to_user 8?|24 computer_use_coordinate_mode 9?|25 run_id 9?|26 agent_session_id 9?|27 client_supports_prompt_context_usage_rpc 8?|28 client_supports_routed_model_update 8?|29 system_prompt_spec #9?|30 client_llm_gateway_credential #10?|31 client_supports_preview_card 8?|32 started_as_new_project 8?|33 first_project_onboarding 8?", ConversationStateStructure, ConversationAction, ModelDetails2, RequestedModel, McpTools, McpFileSystemOptions, SkillOptions, PreFetchedBlob, SubagentModelOverride, SystemPromptSpec, ClientLlmGatewayCredential];
      }
    };
    TextDeltaUpdate = class _TextDeltaUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.text = "";
        this.isServerNotice = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TextDeltaUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TextDeltaUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TextDeltaUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TextDeltaUpdate, a, b2);
      }
      static $() {
        return ["TextDeltaUpdate|1 text 9|2 is_server_notice 8"];
      }
    };
    RoutedModelUpdate = class _RoutedModelUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.displayName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RoutedModelUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RoutedModelUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RoutedModelUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RoutedModelUpdate, a, b2);
      }
      static $() {
        return ["RoutedModelUpdate|1 display_name 9"];
      }
    };
    ToolCallStartedUpdate = class _ToolCallStartedUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.callId = "";
        this.modelCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolCallStartedUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolCallStartedUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolCallStartedUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolCallStartedUpdate, a, b2);
      }
      static $() {
        return ["ToolCallStartedUpdate|1 call_id 9|2 tool_call #0|3 model_call_id 9", ToolCall];
      }
    };
    ToolCallCompletedUpdate = class _ToolCallCompletedUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.callId = "";
        this.modelCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolCallCompletedUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolCallCompletedUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolCallCompletedUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolCallCompletedUpdate, a, b2);
      }
      static $() {
        return ["ToolCallCompletedUpdate|1 call_id 9|2 tool_call #0|3 model_call_id 9", ToolCall];
      }
    };
    ToolCallDeltaUpdate = class _ToolCallDeltaUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.callId = "";
        this.modelCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolCallDeltaUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolCallDeltaUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolCallDeltaUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolCallDeltaUpdate, a, b2);
      }
      static $() {
        return ["ToolCallDeltaUpdate|1 call_id 9|2 tool_call_delta #0|3 model_call_id 9", ToolCallDelta];
      }
    };
    PartialToolCallUpdate = class _PartialToolCallUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.callId = "";
        this.argsTextDelta = "";
        this.modelCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PartialToolCallUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PartialToolCallUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PartialToolCallUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PartialToolCallUpdate, a, b2);
      }
      static $() {
        return ["PartialToolCallUpdate|1 call_id 9|2 tool_call #0|3 args_text_delta 9|4 model_call_id 9", ToolCall];
      }
    };
    ThinkingDeltaUpdate = class _ThinkingDeltaUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ThinkingDeltaUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ThinkingDeltaUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ThinkingDeltaUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ThinkingDeltaUpdate, a, b2);
      }
      static $() {
        return ["ThinkingDeltaUpdate|1 text 9|2 thinking_style #0?", ThinkingStyle];
      }
    };
    ThinkingCompletedUpdate = class _ThinkingCompletedUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.thinkingDurationMs = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ThinkingCompletedUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ThinkingCompletedUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ThinkingCompletedUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ThinkingCompletedUpdate, a, b2);
      }
      static $() {
        return ["ThinkingCompletedUpdate|1 thinking_duration_ms 5"];
      }
    };
    TokenDeltaUpdate = class _TokenDeltaUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.tokens = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TokenDeltaUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TokenDeltaUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TokenDeltaUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TokenDeltaUpdate, a, b2);
      }
      static $() {
        return ["TokenDeltaUpdate|1 tokens 5"];
      }
    };
    SummaryUpdate = class _SummaryUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.summary = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SummaryUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SummaryUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SummaryUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SummaryUpdate, a, b2);
      }
      static $() {
        return ["SummaryUpdate|1 summary 9"];
      }
    };
    SummaryStartedUpdate = class _SummaryStartedUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SummaryStartedUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SummaryStartedUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SummaryStartedUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SummaryStartedUpdate, a, b2);
      }
      static $() {
        return ["SummaryStartedUpdate"];
      }
    };
    HeartbeatUpdate = class _HeartbeatUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _HeartbeatUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _HeartbeatUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _HeartbeatUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_HeartbeatUpdate, a, b2);
      }
      static $() {
        return ["HeartbeatUpdate"];
      }
    };
    SummaryCompletedUpdate = class _SummaryCompletedUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SummaryCompletedUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SummaryCompletedUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SummaryCompletedUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SummaryCompletedUpdate, a, b2);
      }
      static $() {
        return ["SummaryCompletedUpdate|1 hook_message 9?|2 failed 8?"];
      }
    };
    ShellOutputDeltaUpdate = class _ShellOutputDeltaUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.event = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellOutputDeltaUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellOutputDeltaUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellOutputDeltaUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellOutputDeltaUpdate, a, b2);
      }
      static $() {
        return ["ShellOutputDeltaUpdate|1 stdout #0 event|2 stderr #1 event|3 exit #2 event|4 start #3 event", ShellStreamStdout, ShellStreamStderr, ShellStreamExit, ShellStreamStart];
      }
    };
    TurnEndedUpdate = class _TurnEndedUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TurnEndedUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TurnEndedUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TurnEndedUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TurnEndedUpdate, a, b2);
      }
      static $() {
        return ["TurnEndedUpdate|1 input_tokens 3?|2 output_tokens 3?|3 cache_read_tokens 3?|4 cache_write_tokens 3?|5 reasoning_tokens 3?"];
      }
    };
    UserMessageAppendedUpdate = class _UserMessageAppendedUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UserMessageAppendedUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UserMessageAppendedUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UserMessageAppendedUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UserMessageAppendedUpdate, a, b2);
      }
      static $() {
        return ["UserMessageAppendedUpdate|1 user_message #0", UserMessage];
      }
    };
    StepStartedUpdate = class _StepStartedUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.stepId = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StepStartedUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StepStartedUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StepStartedUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StepStartedUpdate, a, b2);
      }
      static $() {
        return ["StepStartedUpdate|1 step_id 4"];
      }
    };
    StepCompletedUpdate = class _StepCompletedUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.stepId = protoInt64.zero;
        this.stepDurationMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StepCompletedUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StepCompletedUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StepCompletedUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StepCompletedUpdate, a, b2);
      }
      static $() {
        return ["StepCompletedUpdate|1 step_id 4|2 step_duration_ms 3"];
      }
    };
    PromptSuggestionUpdate = class _PromptSuggestionUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.suggestion = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PromptSuggestionUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PromptSuggestionUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PromptSuggestionUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PromptSuggestionUpdate, a, b2);
      }
      static $() {
        return ["PromptSuggestionUpdate|1 suggestion 9"];
      }
    };
    ActiveBranchChange = class _ActiveBranchChange extends __protoMessage391 {
      constructor(data) {
        super();
        this.path = "";
        this.branchName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ActiveBranchChange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ActiveBranchChange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ActiveBranchChange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ActiveBranchChange, a, b2);
      }
      static $() {
        return ["ActiveBranchChange|1 path 9|2 branch_name 9"];
      }
    };
    FeedbackRequestCategory = class _FeedbackRequestCategory extends __protoMessage391 {
      constructor(data) {
        super();
        this.id = "";
        this.label = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FeedbackRequestCategory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FeedbackRequestCategory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FeedbackRequestCategory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FeedbackRequestCategory, a, b2);
      }
      static $() {
        return ["FeedbackRequestCategory|1 id 9|2 label 9"];
      }
    };
    FeedbackRequestCategoryGroup = class _FeedbackRequestCategoryGroup extends __protoMessage391 {
      constructor(data) {
        super();
        this.id = "";
        this.prompt = "";
        this.categories = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FeedbackRequestCategoryGroup().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FeedbackRequestCategoryGroup().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FeedbackRequestCategoryGroup().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FeedbackRequestCategoryGroup, a, b2);
      }
      static $() {
        return ["FeedbackRequestCategoryGroup|1 id 9|2 prompt 9|3 categories #0*", FeedbackRequestCategory];
      }
    };
    FeedbackRequestUpdate = class _FeedbackRequestUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.requestId = "";
        this.categories = [];
        this.categoryGroups = [];
        this.showFormImmediately = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FeedbackRequestUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FeedbackRequestUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FeedbackRequestUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FeedbackRequestUpdate, a, b2);
      }
      static $() {
        return ["FeedbackRequestUpdate|1 request_id 9|2 canonical_model_name 9?|3 categories #0*|4 category_groups #1*|5 show_form_immediately 8|6 title 9?|7 negative_title 9?|8 comment_placeholder 9?", FeedbackRequestCategory, FeedbackRequestCategoryGroup];
      }
    };
    ResponseComparisonStarted = class _ResponseComparisonStarted extends __protoMessage391 {
      constructor(data) {
        super();
        this.displayOrder = ResponseComparisonDisplayOrder.UNSPECIFIED;
        this.parentInvocationId = "";
        this.alternateInvocationId = "";
        this.parentResponse = "";
        this.comparisonConfigId = "";
        this.alternateModelId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ResponseComparisonStarted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ResponseComparisonStarted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ResponseComparisonStarted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ResponseComparisonStarted, a, b2);
      }
      static $() {
        return ["ResponseComparisonStarted|1 display_order #0|2 parent_invocation_id 9|3 alternate_invocation_id 9|4 parent_response 9|5 comparison_config_id 9|6 alternate_model_id 9", ResponseComparisonDisplayOrder];
      }
    };
    ResponseComparisonTextDelta = class _ResponseComparisonTextDelta extends __protoMessage391 {
      constructor(data) {
        super();
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ResponseComparisonTextDelta().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ResponseComparisonTextDelta().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ResponseComparisonTextDelta().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ResponseComparisonTextDelta, a, b2);
      }
      static $() {
        return ["ResponseComparisonTextDelta|1 text 9"];
      }
    };
    ResponseComparisonCompleted = class _ResponseComparisonCompleted extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ResponseComparisonCompleted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ResponseComparisonCompleted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ResponseComparisonCompleted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ResponseComparisonCompleted, a, b2);
      }
      static $() {
        return ["ResponseComparisonCompleted"];
      }
    };
    ResponseComparisonSkipped = class _ResponseComparisonSkipped extends __protoMessage391 {
      constructor(data) {
        super();
        this.reason = ResponseComparisonSkipReason.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ResponseComparisonSkipped().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ResponseComparisonSkipped().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ResponseComparisonSkipped().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ResponseComparisonSkipped, a, b2);
      }
      static $() {
        return ["ResponseComparisonSkipped|1 reason #0", ResponseComparisonSkipReason];
      }
    };
    ResponseComparisonUpdate = class _ResponseComparisonUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.comparisonId = "";
        this.event = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ResponseComparisonUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ResponseComparisonUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ResponseComparisonUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ResponseComparisonUpdate, a, b2);
      }
      static $() {
        return ["ResponseComparisonUpdate|1 comparison_id 9|2 started #0 event|3 text_delta #1 event|4 completed #2 event|5 skipped #3 event", ResponseComparisonStarted, ResponseComparisonTextDelta, ResponseComparisonCompleted, ResponseComparisonSkipped];
      }
    };
    InteractionUpdate = class _InteractionUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.message = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InteractionUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InteractionUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InteractionUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InteractionUpdate, a, b2);
      }
      static $() {
        return ["InteractionUpdate|1 text_delta #0 message|7 partial_tool_call #1 message|15 tool_call_delta #2 message|2 tool_call_started #3 message|3 tool_call_completed #4 message|4 thinking_delta #5 message|5 thinking_completed #6 message|6 user_message_appended #7 message|8 token_delta #8 message|9 summary #9 message|10 summary_started #10 message|11 summary_completed #11 message|12 shell_output_delta #12 message|13 heartbeat #13 message|14 turn_ended #14 message|16 step_started #15 message|17 step_completed #16 message|18 prompt_suggestion #17 message|19 post_request_prompt #18 message|20 active_branch_change #19 message|21 feedback_request #20 message|22 response_comparison #21 message|23 context_injection_state #22 message|24 routed_model #23 message|26 grok_bot_nudge #24 message|25 message_started_at_ms 4?", TextDeltaUpdate, PartialToolCallUpdate, ToolCallDeltaUpdate, ToolCallStartedUpdate, ToolCallCompletedUpdate, ThinkingDeltaUpdate, ThinkingCompletedUpdate, UserMessageAppendedUpdate, TokenDeltaUpdate, SummaryUpdate, SummaryStartedUpdate, SummaryCompletedUpdate, ShellOutputDeltaUpdate, HeartbeatUpdate, TurnEndedUpdate, StepStartedUpdate, StepCompletedUpdate, PromptSuggestionUpdate, PostRequestPromptUpdate, ActiveBranchChange, FeedbackRequestUpdate, ResponseComparisonUpdate, ContextInjectionStateUpdate, RoutedModelUpdate, GrokBotNudgeUpdate];
      }
    };
    ContextInjectionStateUpdate = class _ContextInjectionStateUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.injectionId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContextInjectionStateUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContextInjectionStateUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContextInjectionStateUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContextInjectionStateUpdate, a, b2);
      }
      static $() {
        return ["ContextInjectionStateUpdate|1 injection_id 9|2 state #0", ContextInjectionState];
      }
    };
    PostRequestPromptUpdate = class _PostRequestPromptUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.title = "";
        this.message = "";
        this.buttonLabel = "";
        this.buttonUrl = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PostRequestPromptUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PostRequestPromptUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PostRequestPromptUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PostRequestPromptUpdate, a, b2);
      }
      static $() {
        return ["PostRequestPromptUpdate|1 title 9|2 message 9|3 button_label 9|4 button_url 9"];
      }
    };
    GrokBotNudgeUpdate = class _GrokBotNudgeUpdate extends __protoMessage391 {
      constructor(data) {
        super();
        this.job = "";
        this.description = "";
        this.showNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GrokBotNudgeUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GrokBotNudgeUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GrokBotNudgeUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GrokBotNudgeUpdate, a, b2);
      }
      static $() {
        return ["GrokBotNudgeUpdate|1 job 9|2 description 9|3 show_number 13"];
      }
    };
    InteractionQuery = class _InteractionQuery extends __protoMessage391 {
      constructor(data) {
        super();
        this.id = 0;
        this.query = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InteractionQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InteractionQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InteractionQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InteractionQuery, a, b2);
      }
      static $() {
        return ["InteractionQuery|1 id 13|2 web_search_request_query #0 query|3 ask_question_interaction_query #1 query|4 switch_mode_request_query #2 query|7 create_plan_request_query #3 query|8 setup_vm_environment_args #4 query|9 web_fetch_request_query #5 query|10 pr_management_request_query #6 query|11 mcp_auth_request_query #7 query|12 generate_image_request_query #8 query|13 replace_env_args #9 query|14 connect_scm_request_query #10 query", WebSearchRequestQuery, AskQuestionInteractionQuery, SwitchModeRequestQuery, CreatePlanRequestQuery, SetupVmEnvironmentArgs, WebFetchRequestQuery, PrManagementRequestQuery, McpAuthRequestQuery, GenerateImageRequestQuery, ReplaceEnvArgs, ConnectScmRequestQuery];
      }
    };
    InteractionResponse = class _InteractionResponse extends __protoMessage391 {
      constructor(data) {
        super();
        this.id = 0;
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InteractionResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InteractionResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InteractionResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InteractionResponse, a, b2);
      }
      static $() {
        return ["InteractionResponse|1 id 13|2 web_search_request_response #0 result|3 ask_question_interaction_response #1 result|4 switch_mode_request_response #2 result|7 create_plan_request_response #3 result|8 setup_vm_environment_result #4 result|9 web_fetch_request_response #5 result|10 pr_management_result #6 result|11 mcp_auth_request_response #7 result|12 generate_image_request_response #8 result|13 replace_env_result #9 result|14 connect_scm_request_response #10 result", WebSearchRequestResponse, AskQuestionInteractionResponse, SwitchModeRequestResponse, CreatePlanRequestResponse, SetupVmEnvironmentResult, WebFetchRequestResponse, PrManagementResult, McpAuthRequestResponse, GenerateImageRequestResponse, ReplaceEnvResult, ConnectScmRequestResponse];
      }
    };
    AskQuestionInteractionQuery = class _AskQuestionInteractionQuery extends __protoMessage391 {
      constructor(data) {
        super();
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AskQuestionInteractionQuery().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AskQuestionInteractionQuery().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AskQuestionInteractionQuery().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AskQuestionInteractionQuery, a, b2);
      }
      static $() {
        return ["AskQuestionInteractionQuery|1 args #0|2 tool_call_id 9", AskQuestionArgs];
      }
    };
    AskQuestionInteractionResponse = class _AskQuestionInteractionResponse extends __protoMessage391 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AskQuestionInteractionResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AskQuestionInteractionResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AskQuestionInteractionResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AskQuestionInteractionResponse, a, b2);
      }
      static $() {
        return ["AskQuestionInteractionResponse|1 result #0", AskQuestionResult];
      }
    };
    TaskToolCallArgsProto = class _TaskToolCallArgsProto extends __protoMessage391 {
      constructor(data) {
        super();
        this.description = "";
        this.prompt = "";
        this.subagentType = "";
        this.attachments = [];
        this.environment = SubagentExecutionEnvironment.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskToolCallArgsProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskToolCallArgsProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskToolCallArgsProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskToolCallArgsProto, a, b2);
      }
      static $() {
        return ["TaskToolCallArgsProto|1 description 9|2 prompt 9|3 model 9?|4 subagent_type 9|5 resume 9?|6 readonly 8?|7 run_in_background 8?|8 attachments 9*|9 environment #0|10 cloud_base_branch 9?|11 cloud_requested_environment_build_id 9?|12 machine #1?|13 interrupt 8?", SubagentExecutionEnvironment, TargetMachine];
      }
    };
    SubagentCredentials = class _SubagentCredentials extends __protoMessage391 {
      constructor(data) {
        super();
        this.credentials = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentCredentials().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentCredentials().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentCredentials().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentCredentials, a, b2);
      }
      static $() {
        return ["SubagentCredentials|1 api_key_credentials #0 credentials|2 azure_credentials #1 credentials|3 bedrock_credentials #2 credentials", ApiKeyCredentials, AzureCredentials, BedrockCredentials];
      }
    };
    CloudSubagentInheritedContext = class _CloudSubagentInheritedContext extends __protoMessage391 {
      constructor(data) {
        super();
        this.resolved = false;
        this.inlineMcpConfigBlobId = new Uint8Array(0);
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloudSubagentInheritedContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloudSubagentInheritedContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloudSubagentInheritedContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloudSubagentInheritedContext, a, b2);
      }
      static $() {
        return ["CloudSubagentInheritedContext|1 automation_run_bc_id 9?|3 inline_mcp_config_json 9?|4 resolved 8|5 inline_mcp_config_blob_id 12"];
      }
    };
    PreparedTaskSubagent = class _PreparedTaskSubagent extends __protoMessage391 {
      constructor(data) {
        super();
        this.subagentId = "";
        this.subagentTypeName = "";
        this.analyticsSubagentType = "";
        this.resolvedModelId = "";
        this.effectiveReadonly = false;
        this.useAskModeForSubagent = false;
        this.initialTurnsCount = 0;
        this.subagentRequestId = "";
        this.toolCallId = "";
        this.isResume = false;
        this.taskPrompt = "";
        this.taskDescription = "";
        this.parentModelName = "";
        this.enableExecuteHookExec = false;
        this.configuredSteps = [];
        this.readonlyShellEnabled = false;
        this.toolName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PreparedTaskSubagent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PreparedTaskSubagent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PreparedTaskSubagent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PreparedTaskSubagent, a, b2);
      }
      static $() {
        return ["PreparedTaskSubagent|1 subagent_id 9|2 subagent_type_name 9|3 subagent_type #0|4 analytics_subagent_type 9|5 resolved_model_id 9|6 effective_readonly 8|7 use_ask_mode_for_subagent 8|8 conversation_state #1|9 initial_action #2|10 initial_turns_count 13|11 subagent_request_id 9|12 tool_call_id 9|13 is_resume 8|14 parent_request_id 9?|15 root_parent_request_id 9?|16 task_prompt 9|17 task_description 9|18 selected_context #3?|19 plugin 9?|20 marketplace 9?|21 parent_model_name 9|22 raw_args #4|23 subagent_credentials #5|25 result_suffix 9?|26 enable_execute_hook_exec 8|27 configured_steps 9*|28 readonly_shell_enabled 8|29 tool_name 9|30 prepared_timestamp_unix_ms 3?|31 plugin_id 9?|32 marketplace_id 9?|33 subagent_source 9?|34 cloud_subagent_bc_id 9?|35 provider_tool_name 9?|36 inherited_context #6?|37 usage_uuid 9?", SubagentType, ConversationStateStructure, ConversationAction, SelectedContext, TaskToolCallArgsProto, SubagentCredentials, CloudSubagentInheritedContext];
      }
    };
  }
});
