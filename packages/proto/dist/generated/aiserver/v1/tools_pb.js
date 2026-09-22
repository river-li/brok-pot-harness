/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/tools_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage96, __protoMessage392, ClientSideToolV2, BuiltinTool, RunTerminalCommandEndedReason, ReapplyParams, ApplyAgentDiffParams, ReapplyResult, FetchRulesParams, FetchRulesResult, ReapplyStream, ToolResultError, ToolResultError_EditFileError, ToolResultError_SearchReplaceError, ClientSideToolV2Call, ClientSideToolV2Result, NudgeMessage, ToolResultAttachments, ToolResultAttachments_TodoReminderType, ToolResultAttachments_DiscoveryBudgetReminder, StreamedBackToolCall, EditFileV2Params, EditFileV2Params_StreamingEditText, EditFileV2Params_StreamingEditCode, EditFileV2Result, EditFileV2Stream, EditFileParams, EditFileResult, EditFileResult_FileDiff, EditFileResult_FileDiff_Editor, EditFileResult_FileDiff_ChunkDiff, EditFileResult_RecoverableError, EditFileResult_RecoverableError_RecoverableErrorType, EditFileResult_EditFileHumanReview, EditFileResult_HumanFeedback, HumanReview, EditFileStream, ToolCallFileSearchParams, ToolCallFileSearchStream, ToolCallFileSearchResult, ToolCallFileSearchResult_File, ListDirParams, ListDirResult, ListDirResult_File, ListDirStream, ReadFileParams, ReadFileResult, ReadFileStream, RipgrepSearchParams, RipgrepSearchParams_IPatternInfoProto, RipgrepSearchParams_IPatternInfoProto_INotebookPatternInfoProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExtraFileResourcesProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExcludePatternProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPatternBuilderProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPathPatternBuilderProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto_ITextSearchPreviewOptionsProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto_INotebookSearchConfigProto, RipgrepSearchResult, RipgrepSearchResultInternal, RipgrepSearchResultInternal_TextSearchCompleteMessageType, RipgrepSearchResultInternal_SearchCompletionExitCode, RipgrepSearchResultInternal_IFileMatch, RipgrepSearchResultInternal_ITextSearchResult, RipgrepSearchResultInternal_ITextSearchMatch, RipgrepSearchResultInternal_ITextSearchContext, RipgrepSearchResultInternal_ISearchRangeSetPairing, RipgrepSearchResultInternal_ISearchRange, RipgrepSearchResultInternal_ITextSearchCompleteMessage, RipgrepSearchResultInternal_IFileSearchStats, RipgrepSearchResultInternal_IFileSearchStats_FileSearchProviderType, RipgrepSearchResultInternal_ITextSearchStats, RipgrepSearchResultInternal_ITextSearchStats_TextSearchProviderType, RipgrepSearchResultInternal_ISearchEngineStats, RipgrepSearchResultInternal_ICachedSearchStats, RipgrepSearchResultInternal_IFileSearchProviderStats, RipgrepSearchStream, ReadSemsearchFilesParams, MissingFile, MissingFile_MissingReason, Knowledge, ToolPullRequestResult, ReadSemsearchFilesResult, ReadSemsearchFilesStream, SemanticSearchFullParams, SemanticSearchFullResult, SemanticSearchFullStream, DeleteFileParams, DeleteFileResult, DeleteFileStream, BuiltinToolCall, BuiltinToolResult, AddUiStepParams, AddUiStepParams_SearchResult, AddUiStepParams_SearchResults, AddUiStepResult, ToolCall2, ToolResult, ReadWithLinterParams, ReadWithLinterResult, RunTerminalCommandsParams, RunTerminalCommandsResult, CreateRmFilesParams, CreateRmFilesResult, GetProjectStructureParams, GetProjectStructureResult, GetProjectStructureResult_File, NewFileParams, SemanticSearchParams, Range3, MatchRange, SemanticSearchResult, SemanticSearchResult_Item, SearchParams, SearchToolFileSearchResult, SearchToolFileSearchResult_Line, SearchResult, ReadChunkParams, ReadChunkResult, UndoEditParams, EndParams, NewFileResult, UndoEditResult, EndResult, CustomToolCall, CustomToolResult, GotodefParams, GotodefDefinition, GotodefResult, ErrorToolResult, NewEditParams, NewEditResult, EditParams, EditParams_FrontendEditType, EditResult2, EditResult_RelatedInformation, EditResult_Feedback, AddTestParams, AddTestResult, AddTestResult_RelatedInformation, AddTestResult_Feedback, RunTestParams, RunTestResult, GetTestsParams, GetTestsResult, GetTestsResult_Test, DeleteTestParams, DeleteTestResult, SaveFileParams, SaveFileResult, GetSymbolsParams, GetSymbolsParams_LineRange, GetSymbolsResult, ShellCommandParsingResult2, ShellCommandParsingResult_ExecutableCommandArg2, ShellCommandParsingResult_ExecutableCommand2, ShellCommandParsingResult_Redirect2, RunTerminalCommandV2Params, RunTerminalCommandV2Params_ExecutionOptions, OutputLocation2, RunTerminalCommandV2Result, RunTerminalCommandV2Stream, FetchRulesStream, WebSearchParams, WebSearchResult2, WebSearchResult_WebReference, WebSearchStream, MCPParams, MCPParams_Tool, MCPParams_TranscriptDisplay, MCPResult, MCPStream, ListMcpResourcesParams, ListMcpResourcesResult, ListMcpResourcesResult_MCPResource, ReadMcpResourceParams, ReadMcpResourceResult, CallMcpToolParams, CallMcpToolResult, GetMcpToolsParams, GetMcpToolsResult, SearchSymbolsParams, SearchSymbolsResult, SearchSymbolsResult_SymbolMatch, SearchSymbolsStream, BackgroundComposerFollowupParams, BackgroundComposerFollowupResult, BackgroundComposerFollowupStream, KnowledgeBaseParams, KnowledgeBaseResult, KnowledgeBaseStream, FetchPullRequestParams, FetchPullRequestResult, IssueComment, FetchPullRequestStream, PullRequestReference, DeepSearchParams, DeepSearchResult, DeepSearchStream, CreateDiagramParams, CreateDiagramResult, CreateDiagramStream, FixLintsParams, FixLintsResult, FixLintsResult_FileResult, FixLintsStream, ReadLintsParams, ReadLintsResult, ReadLintsStream, GotodefStream, TaskParams, TaskResult2, TaskResult_CompletedTaskResult, TaskResult_AsyncTaskResult, TaskStream, TaskV2Params, TaskV2Result, TaskV2Stream, RipgrepRawSearchParams, RipgrepRawSearchResult, RipgrepRawSearchError, RipgrepRawSearchSuccess, RipgrepRawSearchUnionResult, RipgrepRawSearchCountResult, RipgrepRawSearchFileCount, RipgrepRawSearchFilesResult, RipgrepRawSearchFilesResult_FileEntry, RipgrepRawSearchContentResult, RipgrepRawSearchFileMatch, RipgrepRawSearchContentMatch, RipgrepRawSearchStream, AwaitTaskParams, AwaitTaskResult, AwaitTaskResult_TaskResultItem, AwaitTaskStream, TodoReadParams, TodoItem2, TodoReadResult, TodoReadStream, TodoWriteParams, TodoWriteResult, TodoWriteStream, ListDirV2Params, ListDirV2Result, ListDirV2Result_DirectoryTreeNode, ListDirV2Result_DirectoryTreeNode_File, ListDirV2Stream, ReadFileV2Params, ReadFileV2Result, ReadFileV2Stream, GlobFileSearchParams, GlobFileSearchResult, GlobFileSearchResult_File, GlobFileSearchResult_Directory, GlobFileSearchStream, ListMcpResourcesStream, CallMcpToolStream, ReadMcpResourceStream, Step, PlanPhase, CreatePlanParams, CreatePlanResult2, CreatePlanResult_Accepted, CreatePlanResult_Rejected, CreatePlanResult_Modified, CreatePlanStream, ReadProjectParams, ReadProjectResult, ReadProjectStream, UpdateProjectStringReplacement, UpdateProjectParams, UpdateProjectResult, UpdateProjectStream, AskQuestionParams, AskQuestionParams_Question, AskQuestionParams_Option, AskQuestionResult2, AskQuestionResult_Answer, AskQuestionStream, SwitchModeParams, SwitchModeResult2, SwitchModeStream, ComputerUseParams, ComputerUseResult2, ComputerUseStream, WriteShellStdinStream, WebFetchParams, WebFetchResult2, WebFetchStream, ReportBugfixResultsParams, ReportBugfixResultsResult2, ReportBugfixResultsStream, McpAuthParams, McpAuthResult2, McpAuthStream, ConnectScmParams, ConnectScmGithub2, ConnectScmGithubRepository2, ConnectScmResult2, ConnectScmStream;
var init_tools_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/tools_pb.js"() {
    "use strict";
    init_esm();
    init_utils_pb();
    init_background_shell_exec_pb();
    init_record_screen_exec_pb();
    init_apply_agent_diff_tool_pb();
    init_generate_image_tool_pb();
    init_ai_attribution_tool_pb();
    init_repository_pb();
    init_sandbox_pb();
    init_shell_exec_pb();
    init_subagents_pb();
    init_ls_exec_pb();
    init_computer_use_tool_pb();
    init_report_bugfix_results_tool_pb();
    init_compact();
    __protoPackage96 = "aiserver.v1.";
    __protoMessage392 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage96;
      }
    };
    ClientSideToolV2 = /* @__PURE__ */ enumType(proto3, __protoPackage96, "ClientSideToolV2", [[0, "UNSPECIFIED"], [1, "READ_SEMSEARCH_FILES"], [3, "RIPGREP_SEARCH"], [5, "READ_FILE"], [6, "LIST_DIR"], [7, "EDIT_FILE"], [8, "FILE_SEARCH"], [9, "SEMANTIC_SEARCH_FULL"], [11, "DELETE_FILE"], [12, "REAPPLY"], [15, "RUN_TERMINAL_COMMAND_V2"], [16, "FETCH_RULES"], [18, "WEB_SEARCH"], [19, "MCP"], [23, "SEARCH_SYMBOLS"], [24, "BACKGROUND_COMPOSER_FOLLOWUP"], [25, "KNOWLEDGE_BASE"], [26, "FETCH_PULL_REQUEST"], [27, "DEEP_SEARCH"], [28, "CREATE_DIAGRAM"], [29, "FIX_LINTS"], [30, "READ_LINTS"], [31, "GO_TO_DEFINITION"], [32, "TASK"], [33, "AWAIT_TASK"], [34, "TODO_READ"], [35, "TODO_WRITE"], [38, "EDIT_FILE_V2"], [39, "LIST_DIR_V2"], [40, "READ_FILE_V2"], [41, "RIPGREP_RAW_SEARCH"], [42, "GLOB_FILE_SEARCH"], [43, "CREATE_PLAN"], [44, "LIST_MCP_RESOURCES"], [45, "READ_MCP_RESOURCE"], [46, "READ_PROJECT"], [47, "UPDATE_PROJECT"], [48, "TASK_V2"], [49, "CALL_MCP_TOOL"], [50, "APPLY_AGENT_DIFF"], [51, "ASK_QUESTION"], [52, "SWITCH_MODE"], [53, "GENERATE_IMAGE"], [54, "COMPUTER_USE"], [55, "WRITE_SHELL_STDIN"], [56, "RECORD_SCREEN"], [57, "WEB_FETCH"], [58, "REPORT_BUGFIX_RESULTS"], [59, "AI_ATTRIBUTION"], [60, "MCP_AUTH"], [61, "REFLECT"], [62, "AWAIT"], [63, "GET_MCP_TOOLS"], [65, "SEND_TO_USER"], [66, "CONNECT_SCM"]], 1);
    BuiltinTool = /* @__PURE__ */ enumType(proto3, __protoPackage96, "BuiltinTool", [[0, "UNSPECIFIED"], [1, "SEARCH"], [2, "READ_CHUNK"], [3, "GOTODEF"], [4, "EDIT"], [5, "UNDO_EDIT"], [6, "END"], [7, "NEW_FILE"], [8, "ADD_TEST"], [9, "RUN_TEST"], [10, "DELETE_TEST"], [11, "SAVE_FILE"], [12, "GET_TESTS"], [13, "GET_SYMBOLS"], [14, "SEMANTIC_SEARCH"], [15, "GET_PROJECT_STRUCTURE"], [16, "CREATE_RM_FILES"], [17, "RUN_TERMINAL_COMMANDS"], [18, "NEW_EDIT"], [19, "READ_WITH_LINTER"]], 1);
    RunTerminalCommandEndedReason = /* @__PURE__ */ enumType(proto3, __protoPackage96, "RunTerminalCommandEndedReason", [[0, "UNSPECIFIED"], [1, "EXECUTION_COMPLETED"], [2, "EXECUTION_ABORTED"], [3, "EXECUTION_FAILED"], [4, "ERROR_OCCURRED_CHECKING_REASON"], [5, "IDLE_TIMEOUT"]], 1);
    ReapplyParams = class _ReapplyParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReapplyParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReapplyParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReapplyParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReapplyParams, a, b2);
      }
      static $() {
        return ["ReapplyParams|1 relative_workspace_path 9"];
      }
    };
    ApplyAgentDiffParams = class _ApplyAgentDiffParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.agentId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ApplyAgentDiffParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ApplyAgentDiffParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ApplyAgentDiffParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ApplyAgentDiffParams, a, b2);
      }
      static $() {
        return ["ApplyAgentDiffParams|1 agent_id 9"];
      }
    };
    ReapplyResult = class _ReapplyResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.isApplied = false;
        this.applyFailed = false;
        this.linterErrors = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReapplyResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReapplyResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReapplyResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReapplyResult, a, b2);
      }
      static $() {
        return ["ReapplyResult|1 diff #0|2 is_applied 8|3 apply_failed 8|4 linter_errors #1*|5 rejected 8?", EditFileResult_FileDiff, LinterError];
      }
    };
    FetchRulesParams = class _FetchRulesParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.ruleNames = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchRulesParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchRulesParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchRulesParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchRulesParams, a, b2);
      }
      static $() {
        return ["FetchRulesParams|1 rule_names 9*"];
      }
    };
    FetchRulesResult = class _FetchRulesResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.rules = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchRulesResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchRulesResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchRulesResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchRulesResult, a, b2);
      }
      static $() {
        return ["FetchRulesResult|1 rules #0*", CursorRule];
      }
    };
    ReapplyStream = class _ReapplyStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReapplyStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReapplyStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReapplyStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReapplyStream, a, b2);
      }
      static $() {
        return ["ReapplyStream"];
      }
    };
    ToolResultError = class _ToolResultError extends __protoMessage392 {
      constructor(data) {
        super();
        this.clientVisibleErrorMessage = "";
        this.modelVisibleErrorMessage = "";
        this.errorDetails = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolResultError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolResultError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolResultError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolResultError, a, b2);
      }
      static $() {
        return ["ToolResultError|1 client_visible_error_message 9|2 model_visible_error_message 9|3 actual_error_message_only_send_from_client_to_server_never_the_other_way_around_because_that_may_be_a_security_risk 9?|5 edit_file_error_details #0 error_details|6 search_replace_error_details #1 error_details", ToolResultError_EditFileError, ToolResultError_SearchReplaceError];
      }
    };
    ToolResultError_EditFileError = class _ToolResultError_EditFileError extends __protoMessage392 {
      constructor(data) {
        super();
        this.numLinesInFileBeforeEdit = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolResultError_EditFileError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolResultError_EditFileError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolResultError_EditFileError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolResultError_EditFileError, a, b2);
      }
      static $() {
        return ["ToolResultError.EditFileError|1 num_lines_in_file_before_edit 5"];
      }
    };
    ToolResultError_SearchReplaceError = class _ToolResultError_SearchReplaceError extends __protoMessage392 {
      constructor(data) {
        super();
        this.numLinesInFileBeforeEdit = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolResultError_SearchReplaceError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolResultError_SearchReplaceError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolResultError_SearchReplaceError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolResultError_SearchReplaceError, a, b2);
      }
      static $() {
        return ["ToolResultError.SearchReplaceError|1 num_lines_in_file_before_edit 5"];
      }
    };
    ClientSideToolV2Call = class _ClientSideToolV2Call extends __protoMessage392 {
      constructor(data) {
        super();
        this.tool = ClientSideToolV2.UNSPECIFIED;
        this.params = { case: void 0 };
        this.toolCallId = "";
        this.name = "";
        this.isStreaming = false;
        this.isLastMessage = false;
        this.internal = false;
        this.rawArgs = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ClientSideToolV2Call().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ClientSideToolV2Call().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ClientSideToolV2Call().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ClientSideToolV2Call, a, b2);
      }
      static $() {
        return ["ClientSideToolV2Call|1 tool #0|2 read_semsearch_files_params #1 params|5 ripgrep_search_params #2 params|8 read_file_params #3 params|12 list_dir_params #4 params|13 edit_file_params #5 params|16 file_search_params #6 params|17 semantic_search_full_params #7 params|19 delete_file_params #8 params|20 reapply_params #9 params|23 run_terminal_command_v2_params #10 params|24 fetch_rules_params #11 params|26 web_search_params #12 params|27 mcp_params #13 params|31 search_symbols_params #14 params|41 gotodef_params #15 params|32 background_composer_followup_params #16 params|33 knowledge_base_params #17 params|34 fetch_pull_request_params #18 params|35 deep_search_params #19 params|36 create_diagram_params #20 params|37 fix_lints_params #21 params|38 read_lints_params #22 params|42 task_params #23 params|43 await_task_params #24 params|44 todo_read_params #25 params|45 todo_write_params #26 params|50 edit_file_v2_params #27 params|52 list_dir_v2_params #28 params|53 read_file_v2_params #29 params|54 ripgrep_raw_search_params #30 params|55 glob_file_search_params #31 params|56 create_plan_params #32 params|57 list_mcp_resources_params #33 params|58 read_mcp_resource_params #34 params|59 read_project_params #35 params|60 update_project_params #36 params|61 task_v2_params #37 params|62 call_mcp_tool_params #38 params|63 apply_agent_diff_params #39 params|64 ask_question_params #40 params|65 switch_mode_params #41 params|66 computer_use_params #42 params|67 write_shell_stdin_params #43 params|68 record_screen_params #44 params|69 web_fetch_params #45 params|70 report_bugfix_results_params #46 params|71 mcp_auth_params #47 params|72 get_mcp_tools_params #48 params|73 connect_scm_params #49 params|3 tool_call_id 9|6 timeout_ms 1?|9 name 9|14 is_streaming 8|15 is_last_message 8|51 internal 8|10 raw_args 9|48 tool_index 13?|49 model_call_id 9?", ClientSideToolV2, ReadSemsearchFilesParams, RipgrepSearchParams, ReadFileParams, ListDirParams, EditFileParams, ToolCallFileSearchParams, SemanticSearchFullParams, DeleteFileParams, ReapplyParams, RunTerminalCommandV2Params, FetchRulesParams, WebSearchParams, MCPParams, SearchSymbolsParams, GotodefParams, BackgroundComposerFollowupParams, KnowledgeBaseParams, FetchPullRequestParams, DeepSearchParams, CreateDiagramParams, FixLintsParams, ReadLintsParams, TaskParams, AwaitTaskParams, TodoReadParams, TodoWriteParams, EditFileV2Params, ListDirV2Params, ReadFileV2Params, RipgrepRawSearchParams, GlobFileSearchParams, CreatePlanParams, ListMcpResourcesParams, ReadMcpResourceParams, ReadProjectParams, UpdateProjectParams, TaskV2Params, CallMcpToolParams, ApplyAgentDiffParams, AskQuestionParams, SwitchModeParams, ComputerUseParams, WriteShellStdinArgs, RecordScreenArgs, WebFetchParams, ReportBugfixResultsParams, McpAuthParams, GetMcpToolsParams, ConnectScmParams];
      }
    };
    ClientSideToolV2Result = class _ClientSideToolV2Result extends __protoMessage392 {
      constructor(data) {
        super();
        this.tool = ClientSideToolV2.UNSPECIFIED;
        this.result = { case: void 0 };
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ClientSideToolV2Result().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ClientSideToolV2Result().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ClientSideToolV2Result().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ClientSideToolV2Result, a, b2);
      }
      static $() {
        return ["ClientSideToolV2Result|1 tool #0|2 read_semsearch_files_result #1 result|4 ripgrep_search_result #2 result|6 read_file_result #3 result|9 list_dir_result #4 result|10 edit_file_result #5 result|11 file_search_result #6 result|18 semantic_search_full_result #7 result|20 delete_file_result #8 result|21 reapply_result #9 result|24 run_terminal_command_v2_result #10 result|25 fetch_rules_result #11 result|27 web_search_result #12 result|28 mcp_result #13 result|32 search_symbols_result #14 result|33 background_composer_followup_result #15 result|34 knowledge_base_result #16 result|36 fetch_pull_request_result #17 result|37 deep_search_result #18 result|38 create_diagram_result #19 result|39 fix_lints_result #20 result|40 read_lints_result #21 result|41 gotodef_result #22 result|42 task_result #23 result|43 await_task_result #24 result|44 todo_read_result #25 result|45 todo_write_result #26 result|51 edit_file_v2_result #27 result|52 list_dir_v2_result #28 result|53 read_file_v2_result #29 result|54 ripgrep_raw_search_result #30 result|55 glob_file_search_result #31 result|56 create_plan_result #32 result|57 list_mcp_resources_result #33 result|58 read_mcp_resource_result #34 result|59 read_project_result #35 result|60 update_project_result #36 result|61 task_v2_result #37 result|62 call_mcp_tool_result #38 result|63 apply_agent_diff_result #39 result|64 ask_question_result #40 result|65 switch_mode_result #41 result|66 computer_use_result #42 result|67 generate_image_result #43 result|68 write_shell_stdin_result #44 result|69 record_screen_result #45 result|70 web_fetch_result #46 result|71 report_bugfix_results_result #47 result|72 ai_attribution_result #48 result|73 mcp_auth_result #49 result|74 get_mcp_tools_result #50 result|75 connect_scm_result #51 result|35 tool_call_id 9|8 error #52?|48 model_call_id 9?|49 tool_index 13?|50 attachments #53?", ClientSideToolV2, ReadSemsearchFilesResult, RipgrepSearchResult, ReadFileResult, ListDirResult, EditFileResult, ToolCallFileSearchResult, SemanticSearchFullResult, DeleteFileResult, ReapplyResult, RunTerminalCommandV2Result, FetchRulesResult, WebSearchResult2, MCPResult, SearchSymbolsResult, BackgroundComposerFollowupResult, KnowledgeBaseResult, FetchPullRequestResult, DeepSearchResult, CreateDiagramResult, FixLintsResult, ReadLintsResult, GotodefResult, TaskResult2, AwaitTaskResult, TodoReadResult, TodoWriteResult, EditFileV2Result, ListDirV2Result, ReadFileV2Result, RipgrepRawSearchResult, GlobFileSearchResult, CreatePlanResult2, ListMcpResourcesResult, ReadMcpResourceResult, ReadProjectResult, UpdateProjectResult, TaskV2Result, CallMcpToolResult, ApplyAgentDiffResult, AskQuestionResult2, SwitchModeResult2, ComputerUseResult2, GenerateImageResult, WriteShellStdinResult, RecordScreenResult, WebFetchResult2, ReportBugfixResultsResult2, AiAttributionResult, McpAuthResult2, GetMcpToolsResult, ConnectScmResult2, ToolResultError, ToolResultAttachments];
      }
    };
    NudgeMessage = class _NudgeMessage extends __protoMessage392 {
      constructor(data) {
        super();
        this.rawMessage = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NudgeMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NudgeMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NudgeMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NudgeMessage, a, b2);
      }
      static $() {
        return ["NudgeMessage|1 raw_message 9"];
      }
    };
    ToolResultAttachments = class _ToolResultAttachments extends __protoMessage392 {
      constructor(data) {
        super();
        this.originalTodos = [];
        this.updatedTodos = [];
        this.nudgeMessages = [];
        this.shouldShowTodoWriteReminder = false;
        this.todoReminderType = ToolResultAttachments_TodoReminderType.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolResultAttachments().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolResultAttachments().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolResultAttachments().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolResultAttachments, a, b2);
      }
      static $() {
        return ["ToolResultAttachments|1 original_todos #0*|2 updated_todos #0*|3 nudge_messages #1*|4 should_show_todo_write_reminder 8|5 todo_reminder_type #2|6 discovery_budget_reminder #3?", TodoItem2, NudgeMessage, ToolResultAttachments_TodoReminderType, ToolResultAttachments_DiscoveryBudgetReminder];
      }
    };
    ToolResultAttachments_TodoReminderType = /* @__PURE__ */ enumType(proto3, __protoPackage96, "ToolResultAttachments.TodoReminderType", [[0, "UNSPECIFIED"], [1, "EVERY_10_TURNS"], [2, "AFTER_EDIT"]], 1);
    ToolResultAttachments_DiscoveryBudgetReminder = class _ToolResultAttachments_DiscoveryBudgetReminder extends __protoMessage392 {
      constructor(data) {
        super();
        this.discoveryRoundsRemaining = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolResultAttachments_DiscoveryBudgetReminder().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolResultAttachments_DiscoveryBudgetReminder().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolResultAttachments_DiscoveryBudgetReminder().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolResultAttachments_DiscoveryBudgetReminder, a, b2);
      }
      static $() {
        return ["ToolResultAttachments.DiscoveryBudgetReminder|1 discovery_rounds_remaining 5|2 discovery_effort 9?"];
      }
    };
    StreamedBackToolCall = class _StreamedBackToolCall extends __protoMessage392 {
      constructor(data) {
        super();
        this.tool = ClientSideToolV2.UNSPECIFIED;
        this.toolCallId = "";
        this.params = { case: void 0 };
        this.name = "";
        this.rawArgs = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _StreamedBackToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _StreamedBackToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _StreamedBackToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_StreamedBackToolCall, a, b2);
      }
      static $() {
        return ["StreamedBackToolCall|1 tool #0|2 tool_call_id 9|3 read_semsearch_files_stream #1 params|5 ripgrep_search_stream #2 params|7 read_file_stream #3 params|12 list_dir_stream #4 params|13 edit_file_stream #5 params|14 file_search_stream #6 params|19 semantic_search_full_stream #7 params|21 delete_file_stream #8 params|22 reapply_stream #9 params|25 run_terminal_command_v2_stream #10 params|26 fetch_rules_stream #11 params|28 web_search_stream #12 params|29 mcp_stream #13 params|33 search_symbols_stream #14 params|41 gotodef_stream #15 params|34 background_composer_followup_stream #16 params|35 knowledge_base_stream #17 params|36 fetch_pull_request_stream #18 params|37 deep_search_stream #19 params|38 create_diagram_stream #20 params|39 fix_lints_stream #21 params|40 read_lints_stream #22 params|42 task_stream #23 params|43 await_task_stream #24 params|44 todo_read_stream #25 params|45 todo_write_stream #26 params|52 edit_file_v2_stream #27 params|53 list_dir_v2_stream #28 params|54 read_file_v2_stream #29 params|55 ripgrep_raw_search_stream #30 params|56 glob_file_search_stream #31 params|57 create_plan_stream #32 params|58 list_mcp_resources_stream #33 params|59 read_mcp_resource_stream #34 params|60 read_project_stream #35 params|61 update_project_stream #36 params|62 task_v2_stream #37 params|63 call_mcp_tool_stream #38 params|64 ask_question_stream #39 params|65 switch_mode_stream #40 params|66 computer_use_stream #41 params|67 write_shell_stdin_stream #42 params|68 web_fetch_stream #43 params|69 report_bugfix_results_stream #44 params|70 mcp_auth_stream #45 params|71 connect_scm_stream #46 params|8 name 9|9 raw_args 9|10 error #47?|50 tool_index 13?|51 model_call_id 9?", ClientSideToolV2, ReadSemsearchFilesStream, RipgrepSearchStream, ReadFileStream, ListDirStream, EditFileStream, ToolCallFileSearchStream, SemanticSearchFullStream, DeleteFileStream, ReapplyStream, RunTerminalCommandV2Stream, FetchRulesStream, WebSearchStream, MCPStream, SearchSymbolsStream, GotodefStream, BackgroundComposerFollowupStream, KnowledgeBaseStream, FetchPullRequestStream, DeepSearchStream, CreateDiagramStream, FixLintsStream, ReadLintsStream, TaskStream, AwaitTaskStream, TodoReadStream, TodoWriteStream, EditFileV2Stream, ListDirV2Stream, ReadFileV2Stream, RipgrepRawSearchStream, GlobFileSearchStream, CreatePlanStream, ListMcpResourcesStream, ReadMcpResourceStream, ReadProjectStream, UpdateProjectStream, TaskV2Stream, CallMcpToolStream, AskQuestionStream, SwitchModeStream, ComputerUseStream, WriteShellStdinStream, WebFetchStream, ReportBugfixResultsStream, McpAuthStream, ConnectScmStream, ToolResultError];
      }
    };
    EditFileV2Params = class _EditFileV2Params extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.streamingEdit = { case: void 0 };
        this.shouldSendBackLinterErrors = false;
        this.resultForModel = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileV2Params().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileV2Params().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileV2Params().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileV2Params, a, b2);
      }
      static $() {
        return ["EditFileV2Params|1 relative_workspace_path 9|2 contents_after_edit 9?|3 waiting_for_file_contents 8?|4 text #0 streaming_edit|5 code #1 streaming_edit|6 should_send_back_linter_errors 8|7 diff #2?|8 result_for_model 9|9 streaming_content 9?|10 no_codeblock 8?|11 cloud_agent_edit 8?", EditFileV2Params_StreamingEditText, EditFileV2Params_StreamingEditCode, EditFileResult_FileDiff];
      }
    };
    EditFileV2Params_StreamingEditText = class _EditFileV2Params_StreamingEditText extends __protoMessage392 {
      constructor(data) {
        super();
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileV2Params_StreamingEditText().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileV2Params_StreamingEditText().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileV2Params_StreamingEditText().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileV2Params_StreamingEditText, a, b2);
      }
      static $() {
        return ["EditFileV2Params.StreamingEditText|1 text 9"];
      }
    };
    EditFileV2Params_StreamingEditCode = class _EditFileV2Params_StreamingEditCode extends __protoMessage392 {
      constructor(data) {
        super();
        this.code = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileV2Params_StreamingEditCode().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileV2Params_StreamingEditCode().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileV2Params_StreamingEditCode().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileV2Params_StreamingEditCode, a, b2);
      }
      static $() {
        return ["EditFileV2Params.StreamingEditCode|1 code 9"];
      }
    };
    EditFileV2Result = class _EditFileV2Result extends __protoMessage392 {
      constructor(data) {
        super();
        this.fileWasCreated = false;
        this.linterErrors = [];
        this.sentBackLinterErrors = false;
        this.shouldAutoFixLints = false;
        this.resultForModel = "";
        this.afterContentId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileV2Result().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileV2Result().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileV2Result().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileV2Result, a, b2);
      }
      static $() {
        return ["EditFileV2Result|1 contents_before_edit 9?|9 eol_sequence 9?|11 detected_language 9?|2 file_was_created 8|3 diff #0?|4 rejected 8?|5 linter_errors #1*|6 sent_back_linter_errors 8|8 should_auto_fix_lints 8|7 human_review_v2 #2?|10 result_for_model 9|12 contents_after_edit 9?|13 before_content_id 9?|14 after_content_id 9", EditFileResult_FileDiff, LinterError, HumanReview];
      }
    };
    EditFileV2Stream = class _EditFileV2Stream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileV2Stream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileV2Stream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileV2Stream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileV2Stream, a, b2);
      }
      static $() {
        return ["EditFileV2Stream"];
      }
    };
    EditFileParams = class _EditFileParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.language = "";
        this.blocking = false;
        this.contents = "";
        this.lineRanges = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileParams, a, b2);
      }
      static $() {
        return ["EditFileParams|1 relative_workspace_path 9|2 language 9|4 blocking 8|3 contents 9|5 instructions 9?|12 should_edit_file_fail_for_large_files 8?|6 old_string 9?|7 new_string 9?|8 allow_multiple_matches 8?|10 use_whitespace_insensitive_fallback 8?|11 use_did_you_mean_fuzzy_match 8?|16 gracefully_handle_recoverable_errors 8?|9 line_ranges #0*|13 notebook_cell_idx 5?|14 is_new_cell 8?|15 cell_language 9?|17 edit_category 9?|18 should_eagerly_process_lints 8?", LineRange];
      }
    };
    EditFileResult = class _EditFileResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.isApplied = false;
        this.applyFailed = false;
        this.linterErrors = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileResult, a, b2);
      }
      static $() {
        return ["EditFileResult|1 diff #0|2 is_applied 8|3 apply_failed 8|4 linter_errors #1*|5 rejected 8?|6 num_matches 5?|7 whitespace_insensitive_fallback_found_match 8?|8 no_match_found_in_line_ranges 8?|11 recoverable_error #2?|9 num_lines_in_file 5?|10 is_subagent_edit 8?|12 diff_became_no_op_due_to_on_save_fixes 8?|13 human_review #3?|14 human_feedback #4?|15 should_eagerly_process_lints 8?|16 human_review_v2 #5?|17 were_all_new_linter_errors_resolved_by_this_edit 8?", EditFileResult_FileDiff, LinterError, EditFileResult_RecoverableError, EditFileResult_EditFileHumanReview, EditFileResult_HumanFeedback, HumanReview];
      }
    };
    EditFileResult_FileDiff = class _EditFileResult_FileDiff extends __protoMessage392 {
      constructor(data) {
        super();
        this.chunks = [];
        this.editor = EditFileResult_FileDiff_Editor.UNSPECIFIED;
        this.hitTimeout = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileResult_FileDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileResult_FileDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileResult_FileDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileResult_FileDiff, a, b2);
      }
      static $() {
        return ["EditFileResult.FileDiff|1 chunks #0*|2 editor #1|3 hit_timeout 8", EditFileResult_FileDiff_ChunkDiff, EditFileResult_FileDiff_Editor];
      }
    };
    EditFileResult_FileDiff_Editor = /* @__PURE__ */ enumType(proto3, __protoPackage96, "EditFileResult.FileDiff.Editor", [[0, "UNSPECIFIED"], [1, "AI"], [2, "HUMAN"]], 1);
    EditFileResult_FileDiff_ChunkDiff = class _EditFileResult_FileDiff_ChunkDiff extends __protoMessage392 {
      constructor(data) {
        super();
        this.diffString = "";
        this.oldStart = 0;
        this.newStart = 0;
        this.oldLines = 0;
        this.newLines = 0;
        this.linesRemoved = 0;
        this.linesAdded = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileResult_FileDiff_ChunkDiff().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileResult_FileDiff_ChunkDiff().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileResult_FileDiff_ChunkDiff().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileResult_FileDiff_ChunkDiff, a, b2);
      }
      static $() {
        return ["EditFileResult.FileDiff.ChunkDiff|1 diff_string 9|2 old_start 5|3 new_start 5|4 old_lines 5|5 new_lines 5|6 lines_removed 5|7 lines_added 5"];
      }
    };
    EditFileResult_RecoverableError = class _EditFileResult_RecoverableError extends __protoMessage392 {
      constructor(data) {
        super();
        this.errorType = EditFileResult_RecoverableError_RecoverableErrorType.UNSPECIFIED;
        this.modelMessage = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileResult_RecoverableError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileResult_RecoverableError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileResult_RecoverableError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileResult_RecoverableError, a, b2);
      }
      static $() {
        return ["EditFileResult.RecoverableError|1 error_type #0|2 model_message 9", EditFileResult_RecoverableError_RecoverableErrorType];
      }
    };
    EditFileResult_RecoverableError_RecoverableErrorType = /* @__PURE__ */ enumType(proto3, __protoPackage96, "EditFileResult.RecoverableError.RecoverableErrorType", [[0, "UNSPECIFIED"], [1, "SEARCH_STRING_NOT_FOUND"], [2, "AMBIGUOUS_SEARCH_STRING"]], 1);
    EditFileResult_EditFileHumanReview = class _EditFileResult_EditFileHumanReview extends __protoMessage392 {
      constructor(data) {
        super();
        this.isEditAccepted = false;
        this.textResult = "";
        this.stopAndGetNewUserInput = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileResult_EditFileHumanReview().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileResult_EditFileHumanReview().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileResult_EditFileHumanReview().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileResult_EditFileHumanReview, a, b2);
      }
      static $() {
        return ["EditFileResult.EditFileHumanReview|1 is_edit_accepted 8|2 text_result 9|3 stop_and_get_new_user_input 8"];
      }
    };
    EditFileResult_HumanFeedback = class _EditFileResult_HumanFeedback extends __protoMessage392 {
      constructor(data) {
        super();
        this.selectedOption = "";
        this.feedbackText = "";
        this.submitFeedbackAsNewMessage = false;
        this.bubbleId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileResult_HumanFeedback().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileResult_HumanFeedback().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileResult_HumanFeedback().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileResult_HumanFeedback, a, b2);
      }
      static $() {
        return ["EditFileResult.HumanFeedback|1 selected_option 9|2 feedback_text 9|3 submit_feedback_as_new_message 8|4 bubble_id 9"];
      }
    };
    HumanReview = class _HumanReview extends __protoMessage392 {
      constructor(data) {
        super();
        this.selectedOption = "";
        this.feedbackText = "";
        this.submitFeedbackAsNewMessage = false;
        this.bubbleId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _HumanReview().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _HumanReview().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _HumanReview().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_HumanReview, a, b2);
      }
      static $() {
        return ["HumanReview|1 selected_option 9|2 feedback_text 9|3 submit_feedback_as_new_message 8|4 bubble_id 9"];
      }
    };
    EditFileStream = class _EditFileStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileStream, a, b2);
      }
      static $() {
        return ["EditFileStream"];
      }
    };
    ToolCallFileSearchParams = class _ToolCallFileSearchParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.query = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolCallFileSearchParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolCallFileSearchParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolCallFileSearchParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolCallFileSearchParams, a, b2);
      }
      static $() {
        return ["ToolCallFileSearchParams|1 query 9"];
      }
    };
    ToolCallFileSearchStream = class _ToolCallFileSearchStream extends __protoMessage392 {
      constructor(data) {
        super();
        this.query = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolCallFileSearchStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolCallFileSearchStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolCallFileSearchStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolCallFileSearchStream, a, b2);
      }
      static $() {
        return ["ToolCallFileSearchStream|1 query 9"];
      }
    };
    ToolCallFileSearchResult = class _ToolCallFileSearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.files = [];
        this.numResults = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolCallFileSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolCallFileSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolCallFileSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolCallFileSearchResult, a, b2);
      }
      static $() {
        return ["ToolCallFileSearchResult|1 files #0*|2 limit_hit 8?|3 num_results 5", ToolCallFileSearchResult_File];
      }
    };
    ToolCallFileSearchResult_File = class _ToolCallFileSearchResult_File extends __protoMessage392 {
      constructor(data) {
        super();
        this.uri = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolCallFileSearchResult_File().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolCallFileSearchResult_File().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolCallFileSearchResult_File().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolCallFileSearchResult_File, a, b2);
      }
      static $() {
        return ["ToolCallFileSearchResult.File|1 uri 9"];
      }
    };
    ListDirParams = class _ListDirParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.directoryPath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirParams, a, b2);
      }
      static $() {
        return ["ListDirParams|1 directory_path 9"];
      }
    };
    ListDirResult = class _ListDirResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.files = [];
        this.directoryRelativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirResult, a, b2);
      }
      static $() {
        return ["ListDirResult|1 files #0*|2 directory_relative_workspace_path 9", ListDirResult_File];
      }
    };
    ListDirResult_File = class _ListDirResult_File extends __protoMessage392 {
      constructor(data) {
        super();
        this.name = "";
        this.isDirectory = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirResult_File().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirResult_File().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirResult_File().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirResult_File, a, b2);
      }
      static $() {
        return ["ListDirResult.File|1 name 9|2 is_directory 8|3 size 3?|4 last_modified #0?|5 num_children 5?|6 num_lines 5?", Timestamp];
      }
    };
    ListDirStream = class _ListDirStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirStream, a, b2);
      }
      static $() {
        return ["ListDirStream"];
      }
    };
    ReadFileParams = class _ReadFileParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.readEntireFile = false;
        this.fileIsAllowedToBeReadEntirely = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadFileParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadFileParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadFileParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadFileParams, a, b2);
      }
      static $() {
        return ["ReadFileParams|1 relative_workspace_path 9|2 read_entire_file 8|3 start_line_one_indexed 5?|4 end_line_one_indexed_inclusive 5?|5 file_is_allowed_to_be_read_entirely 8|6 max_lines 5?|7 max_chars 5?|8 min_lines 5?"];
      }
    };
    ReadFileResult = class _ReadFileResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.contents = "";
        this.didDowngradeToLineRange = false;
        this.didShortenLineRange = false;
        this.didSetDefaultLineRange = false;
        this.relativeWorkspacePath = "";
        this.didShortenCharRange = false;
        this.matchingCursorRules = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadFileResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadFileResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadFileResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadFileResult, a, b2);
      }
      static $() {
        return ["ReadFileResult|1 contents 9|2 did_downgrade_to_line_range 8|3 did_shorten_line_range 8|4 did_set_default_line_range 8|5 full_file_contents 9?|6 outline 9?|7 start_line_one_indexed 5?|8 end_line_one_indexed_inclusive 5?|9 relative_workspace_path 9|10 did_shorten_char_range 8|11 read_full_file 8?|12 total_lines 5?|13 matching_cursor_rules #0*|14 file_git_context #1", CursorRule, FileGit];
      }
    };
    ReadFileStream = class _ReadFileStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadFileStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadFileStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadFileStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadFileStream, a, b2);
      }
      static $() {
        return ["ReadFileStream"];
      }
    };
    RipgrepSearchParams = class _RipgrepSearchParams extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchParams, a, b2);
      }
      static $() {
        return ["RipgrepSearchParams|1 options #0|2 pattern_info #1", RipgrepSearchParams_ITextQueryBuilderOptionsProto, RipgrepSearchParams_IPatternInfoProto];
      }
    };
    RipgrepSearchParams_IPatternInfoProto = class _RipgrepSearchParams_IPatternInfoProto extends __protoMessage392 {
      constructor(data) {
        super();
        this.pattern = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchParams_IPatternInfoProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchParams_IPatternInfoProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchParams_IPatternInfoProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchParams_IPatternInfoProto, a, b2);
      }
      static $() {
        return ["RipgrepSearchParams.IPatternInfoProto|1 pattern 9|2 is_reg_exp 8?|3 is_word_match 8?|4 word_separators 9?|5 is_multiline 8?|6 is_unicode 8?|7 is_case_sensitive 8?|8 notebook_info #0|9 pattern_was_escaped 8?", RipgrepSearchParams_IPatternInfoProto_INotebookPatternInfoProto];
      }
    };
    RipgrepSearchParams_IPatternInfoProto_INotebookPatternInfoProto = class _RipgrepSearchParams_IPatternInfoProto_INotebookPatternInfoProto extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchParams_IPatternInfoProto_INotebookPatternInfoProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchParams_IPatternInfoProto_INotebookPatternInfoProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchParams_IPatternInfoProto_INotebookPatternInfoProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchParams_IPatternInfoProto_INotebookPatternInfoProto, a, b2);
      }
      static $() {
        return ["RipgrepSearchParams.IPatternInfoProto.INotebookPatternInfoProto|1 is_in_notebook_markdown_input 8?|2 is_in_notebook_markdown_preview 8?|3 is_in_notebook_cell_input 8?|4 is_in_notebook_cell_output 8?"];
      }
    };
    RipgrepSearchParams_ITextQueryBuilderOptionsProto = class _RipgrepSearchParams_ITextQueryBuilderOptionsProto extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchParams_ITextQueryBuilderOptionsProto, a, b2);
      }
      static $() {
        return ["RipgrepSearchParams.ITextQueryBuilderOptionsProto|1 preview_options #0|2 file_encoding 9?|3 surrounding_context 5?|4 is_smart_case 8?|5 notebook_search_config #1|6 exclude_pattern #2|7 include_pattern #3|8 expand_patterns 8?|9 max_results 5?|10 max_file_size 5?|11 disregard_ignore_files 8?|12 disregard_global_ignore_files 8?|13 disregard_parent_ignore_files 8?|14 disregard_exclude_settings 8?|15 disregard_search_exclude_settings 8?|16 ignore_symlinks 8?|17 only_open_editors 8?|18 only_file_scheme 8?|19 reason 9?|20 extra_file_resources #4", RipgrepSearchParams_ITextQueryBuilderOptionsProto_ITextSearchPreviewOptionsProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto_INotebookSearchConfigProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExcludePatternProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPathPatternBuilderProto, RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExtraFileResourcesProto];
      }
    };
    RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExtraFileResourcesProto = class _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExtraFileResourcesProto extends __protoMessage392 {
      constructor(data) {
        super();
        this.extraFileResources = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExtraFileResourcesProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExtraFileResourcesProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExtraFileResourcesProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExtraFileResourcesProto, a, b2);
      }
      static $() {
        return ["RipgrepSearchParams.ITextQueryBuilderOptionsProto.ExtraFileResourcesProto|1 extra_file_resources 9*"];
      }
    };
    RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExcludePatternProto = class _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExcludePatternProto extends __protoMessage392 {
      constructor(data) {
        super();
        this.excludePattern = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExcludePatternProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExcludePatternProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExcludePatternProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchParams_ITextQueryBuilderOptionsProto_ExcludePatternProto, a, b2);
      }
      static $() {
        return ["RipgrepSearchParams.ITextQueryBuilderOptionsProto.ExcludePatternProto|1 exclude_pattern #0*", RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPatternBuilderProto];
      }
    };
    RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPatternBuilderProto = class _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPatternBuilderProto extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPatternBuilderProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPatternBuilderProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPatternBuilderProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPatternBuilderProto, a, b2);
      }
      static $() {
        return ["RipgrepSearchParams.ITextQueryBuilderOptionsProto.ISearchPatternBuilderProto|1 uri 9?|2 pattern #0", RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPathPatternBuilderProto];
      }
    };
    RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPathPatternBuilderProto = class _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPathPatternBuilderProto extends __protoMessage392 {
      constructor(data) {
        super();
        this.patterns = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPathPatternBuilderProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPathPatternBuilderProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPathPatternBuilderProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchParams_ITextQueryBuilderOptionsProto_ISearchPathPatternBuilderProto, a, b2);
      }
      static $() {
        return ["RipgrepSearchParams.ITextQueryBuilderOptionsProto.ISearchPathPatternBuilderProto|1 pattern 9?|2 patterns 9*"];
      }
    };
    RipgrepSearchParams_ITextQueryBuilderOptionsProto_ITextSearchPreviewOptionsProto = class _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ITextSearchPreviewOptionsProto extends __protoMessage392 {
      constructor(data) {
        super();
        this.matchLines = 0;
        this.charsPerLine = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ITextSearchPreviewOptionsProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ITextSearchPreviewOptionsProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_ITextSearchPreviewOptionsProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchParams_ITextQueryBuilderOptionsProto_ITextSearchPreviewOptionsProto, a, b2);
      }
      static $() {
        return ["RipgrepSearchParams.ITextQueryBuilderOptionsProto.ITextSearchPreviewOptionsProto|1 match_lines 5|2 chars_per_line 5"];
      }
    };
    RipgrepSearchParams_ITextQueryBuilderOptionsProto_INotebookSearchConfigProto = class _RipgrepSearchParams_ITextQueryBuilderOptionsProto_INotebookSearchConfigProto extends __protoMessage392 {
      constructor(data) {
        super();
        this.includeMarkupInput = false;
        this.includeMarkupPreview = false;
        this.includeCodeInput = false;
        this.includeOutput = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_INotebookSearchConfigProto().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_INotebookSearchConfigProto().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchParams_ITextQueryBuilderOptionsProto_INotebookSearchConfigProto().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchParams_ITextQueryBuilderOptionsProto_INotebookSearchConfigProto, a, b2);
      }
      static $() {
        return ["RipgrepSearchParams.ITextQueryBuilderOptionsProto.INotebookSearchConfigProto|1 include_markup_input 8|2 include_markup_preview 8|3 include_code_input 8|4 include_output 8"];
      }
    };
    RipgrepSearchResult = class _RipgrepSearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResult, a, b2);
      }
      static $() {
        return ["RipgrepSearchResult|1 internal #0", RipgrepSearchResultInternal];
      }
    };
    RipgrepSearchResultInternal = class _RipgrepSearchResultInternal extends __protoMessage392 {
      constructor(data) {
        super();
        this.results = [];
        this.messages = [];
        this.stats = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal|1 results #0*|2 exit #1?|3 limit_hit 8?|4 messages #2*|5 file_search_stats #3 stats|6 text_search_stats #4 stats", RipgrepSearchResultInternal_IFileMatch, RipgrepSearchResultInternal_SearchCompletionExitCode, RipgrepSearchResultInternal_ITextSearchCompleteMessage, RipgrepSearchResultInternal_IFileSearchStats, RipgrepSearchResultInternal_ITextSearchStats];
      }
    };
    RipgrepSearchResultInternal_TextSearchCompleteMessageType = /* @__PURE__ */ enumType(proto3, __protoPackage96, "RipgrepSearchResultInternal.TextSearchCompleteMessageType", [[0, "UNSPECIFIED"], [1, "INFORMATION"], [2, "WARNING"]], 1);
    RipgrepSearchResultInternal_SearchCompletionExitCode = /* @__PURE__ */ enumType(proto3, __protoPackage96, "RipgrepSearchResultInternal.SearchCompletionExitCode", [[0, "UNSPECIFIED"], [1, "NORMAL"], [2, "NEW_SEARCH_STARTED"]], 1);
    RipgrepSearchResultInternal_IFileMatch = class _RipgrepSearchResultInternal_IFileMatch extends __protoMessage392 {
      constructor(data) {
        super();
        this.resource = "";
        this.results = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_IFileMatch().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_IFileMatch().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_IFileMatch().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_IFileMatch, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.IFileMatch|1 resource 9|2 results #0*", RipgrepSearchResultInternal_ITextSearchResult];
      }
    };
    RipgrepSearchResultInternal_ITextSearchResult = class _RipgrepSearchResultInternal_ITextSearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_ITextSearchResult, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.ITextSearchResult|1 match #0 result|2 context #1 result", RipgrepSearchResultInternal_ITextSearchMatch, RipgrepSearchResultInternal_ITextSearchContext];
      }
    };
    RipgrepSearchResultInternal_ITextSearchMatch = class _RipgrepSearchResultInternal_ITextSearchMatch extends __protoMessage392 {
      constructor(data) {
        super();
        this.rangeLocations = [];
        this.previewText = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchMatch().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchMatch().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchMatch().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_ITextSearchMatch, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.ITextSearchMatch|1 uri 9?|2 range_locations #0*|3 preview_text 9|4 webview_index 5?|5 cell_fragment 9?", RipgrepSearchResultInternal_ISearchRangeSetPairing];
      }
    };
    RipgrepSearchResultInternal_ITextSearchContext = class _RipgrepSearchResultInternal_ITextSearchContext extends __protoMessage392 {
      constructor(data) {
        super();
        this.text = "";
        this.lineNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchContext().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchContext().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchContext().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_ITextSearchContext, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.ITextSearchContext|1 uri 9?|2 text 9|3 line_number 5"];
      }
    };
    RipgrepSearchResultInternal_ISearchRangeSetPairing = class _RipgrepSearchResultInternal_ISearchRangeSetPairing extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_ISearchRangeSetPairing().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_ISearchRangeSetPairing().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_ISearchRangeSetPairing().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_ISearchRangeSetPairing, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.ISearchRangeSetPairing|1 source #0|2 preview #0", RipgrepSearchResultInternal_ISearchRange];
      }
    };
    RipgrepSearchResultInternal_ISearchRange = class _RipgrepSearchResultInternal_ISearchRange extends __protoMessage392 {
      constructor(data) {
        super();
        this.startLineNumber = 0;
        this.startColumn = 0;
        this.endLineNumber = 0;
        this.endColumn = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_ISearchRange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_ISearchRange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_ISearchRange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_ISearchRange, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.ISearchRange|1 start_line_number 5|2 start_column 5|3 end_line_number 5|4 end_column 5"];
      }
    };
    RipgrepSearchResultInternal_ITextSearchCompleteMessage = class _RipgrepSearchResultInternal_ITextSearchCompleteMessage extends __protoMessage392 {
      constructor(data) {
        super();
        this.text = "";
        this.type = RipgrepSearchResultInternal_TextSearchCompleteMessageType.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchCompleteMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchCompleteMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchCompleteMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_ITextSearchCompleteMessage, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.ITextSearchCompleteMessage|1 text 9|2 type #0|3 trusted 8?", RipgrepSearchResultInternal_TextSearchCompleteMessageType];
      }
    };
    RipgrepSearchResultInternal_IFileSearchStats = class _RipgrepSearchResultInternal_IFileSearchStats extends __protoMessage392 {
      constructor(data) {
        super();
        this.fromCache = false;
        this.detailStats = { case: void 0 };
        this.resultCount = 0;
        this.type = RipgrepSearchResultInternal_IFileSearchStats_FileSearchProviderType.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_IFileSearchStats().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_IFileSearchStats().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_IFileSearchStats().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_IFileSearchStats, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.IFileSearchStats|1 from_cache 8|2 search_engine_stats #0 detail_stats|3 cached_search_stats #1 detail_stats|4 file_search_provider_stats #2 detail_stats|5 result_count 5|6 type #3|7 sorting_time 5?", RipgrepSearchResultInternal_ISearchEngineStats, RipgrepSearchResultInternal_ICachedSearchStats, RipgrepSearchResultInternal_IFileSearchProviderStats, RipgrepSearchResultInternal_IFileSearchStats_FileSearchProviderType];
      }
    };
    RipgrepSearchResultInternal_IFileSearchStats_FileSearchProviderType = /* @__PURE__ */ enumType(proto3, __protoPackage96, "RipgrepSearchResultInternal.IFileSearchStats.FileSearchProviderType", [[0, "UNSPECIFIED"], [1, "FILE_SEARCH_PROVIDER"], [2, "SEARCH_PROCESS"]], 1);
    RipgrepSearchResultInternal_ITextSearchStats = class _RipgrepSearchResultInternal_ITextSearchStats extends __protoMessage392 {
      constructor(data) {
        super();
        this.type = RipgrepSearchResultInternal_ITextSearchStats_TextSearchProviderType.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchStats().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchStats().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_ITextSearchStats().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_ITextSearchStats, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.ITextSearchStats|1 type #0", RipgrepSearchResultInternal_ITextSearchStats_TextSearchProviderType];
      }
    };
    RipgrepSearchResultInternal_ITextSearchStats_TextSearchProviderType = /* @__PURE__ */ enumType(proto3, __protoPackage96, "RipgrepSearchResultInternal.ITextSearchStats.TextSearchProviderType", [[0, "UNSPECIFIED"], [1, "TEXT_SEARCH_PROVIDER"], [2, "SEARCH_PROCESS"], [3, "AI_TEXT_SEARCH_PROVIDER"]], 1);
    RipgrepSearchResultInternal_ISearchEngineStats = class _RipgrepSearchResultInternal_ISearchEngineStats extends __protoMessage392 {
      constructor(data) {
        super();
        this.fileWalkTime = 0;
        this.directoriesWalked = 0;
        this.filesWalked = 0;
        this.cmdTime = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_ISearchEngineStats().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_ISearchEngineStats().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_ISearchEngineStats().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_ISearchEngineStats, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.ISearchEngineStats|1 file_walk_time 5|2 directories_walked 5|3 files_walked 5|4 cmd_time 5|5 cmd_result_count 5?"];
      }
    };
    RipgrepSearchResultInternal_ICachedSearchStats = class _RipgrepSearchResultInternal_ICachedSearchStats extends __protoMessage392 {
      constructor(data) {
        super();
        this.cacheWasResolved = false;
        this.cacheLookupTime = 0;
        this.cacheFilterTime = 0;
        this.cacheEntryCount = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_ICachedSearchStats().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_ICachedSearchStats().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_ICachedSearchStats().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_ICachedSearchStats, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.ICachedSearchStats|1 cache_was_resolved 8|2 cache_lookup_time 5|3 cache_filter_time 5|4 cache_entry_count 5"];
      }
    };
    RipgrepSearchResultInternal_IFileSearchProviderStats = class _RipgrepSearchResultInternal_IFileSearchProviderStats extends __protoMessage392 {
      constructor(data) {
        super();
        this.providerTime = 0;
        this.postProcessTime = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchResultInternal_IFileSearchProviderStats().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchResultInternal_IFileSearchProviderStats().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchResultInternal_IFileSearchProviderStats().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchResultInternal_IFileSearchProviderStats, a, b2);
      }
      static $() {
        return ["RipgrepSearchResultInternal.IFileSearchProviderStats|1 provider_time 5|2 post_process_time 5"];
      }
    };
    RipgrepSearchStream = class _RipgrepSearchStream extends __protoMessage392 {
      constructor(data) {
        super();
        this.query = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepSearchStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepSearchStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepSearchStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepSearchStream, a, b2);
      }
      static $() {
        return ["RipgrepSearchStream|1 query 9"];
      }
    };
    ReadSemsearchFilesParams = class _ReadSemsearchFilesParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.codeResults = [];
        this.query = "";
        this.prReferences = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadSemsearchFilesParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadSemsearchFilesParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadSemsearchFilesParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadSemsearchFilesParams, a, b2);
      }
      static $() {
        return ["ReadSemsearchFilesParams|1 repository_info #0|2 code_results #1*|3 query 9|4 pr_references #2*|5 pr_search_on 8?", RepositoryInfo, CodeResult, PullRequestReference];
      }
    };
    MissingFile = class _MissingFile extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.missingReason = MissingFile_MissingReason.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MissingFile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MissingFile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MissingFile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MissingFile, a, b2);
      }
      static $() {
        return ["MissingFile|1 relative_workspace_path 9|2 missing_reason #0|3 num_lines 5?", MissingFile_MissingReason];
      }
    };
    MissingFile_MissingReason = /* @__PURE__ */ enumType(proto3, __protoPackage96, "MissingFile.MissingReason", [[0, "UNSPECIFIED"], [1, "TOO_LARGE"], [2, "NOT_FOUND"]], 1);
    Knowledge = class _Knowledge extends __protoMessage392 {
      constructor(data) {
        super();
        this.knowledge = "";
        this.title = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Knowledge().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Knowledge().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Knowledge().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Knowledge, a, b2);
      }
      static $() {
        return ["Knowledge|1 knowledge 9|2 title 9"];
      }
    };
    ToolPullRequestResult = class _ToolPullRequestResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.sha = "";
        this.fullPrContents = "";
        this.score = 0;
        this.changedFiles = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolPullRequestResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolPullRequestResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolPullRequestResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolPullRequestResult, a, b2);
      }
      static $() {
        return ["ToolPullRequestResult|1 sha 9|2 full_pr_contents 9|3 score 2|4 title 9?|5 summary 9?|6 pr_number 13?|7 changed_files 9*|8 author 9?|9 date 9?"];
      }
    };
    ReadSemsearchFilesResult = class _ReadSemsearchFilesResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.codeResults = [];
        this.allFiles = [];
        this.missingFiles = [];
        this.knowledgeResults = [];
        this.prResults = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadSemsearchFilesResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadSemsearchFilesResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadSemsearchFilesResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadSemsearchFilesResult, a, b2);
      }
      static $() {
        return ["ReadSemsearchFilesResult|1 code_results #0*|2 all_files #1*|3 missing_files #2*|4 knowledge_results #3*|5 pr_results #4*|6 git_remote_url 9?|7 pr_hydration_timed_out 8?", CodeResult, File2, MissingFile, Knowledge, ToolPullRequestResult];
      }
    };
    ReadSemsearchFilesStream = class _ReadSemsearchFilesStream extends __protoMessage392 {
      constructor(data) {
        super();
        this.numFiles = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadSemsearchFilesStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadSemsearchFilesStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadSemsearchFilesStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadSemsearchFilesStream, a, b2);
      }
      static $() {
        return ["ReadSemsearchFilesStream|1 num_files 5"];
      }
    };
    SemanticSearchFullParams = class _SemanticSearchFullParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.query = "";
        this.topK = 0;
        this.prReferences = [];
        this.codeResults = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SemanticSearchFullParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SemanticSearchFullParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SemanticSearchFullParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SemanticSearchFullParams, a, b2);
      }
      static $() {
        return ["SemanticSearchFullParams|1 repository_info #0|2 query 9|3 include_pattern 9?|4 exclude_pattern 9?|5 top_k 5|6 pr_references #1*|7 pr_search_on 8?|8 explanation 9?|9 code_results #2*", RepositoryInfo, PullRequestReference, CodeResult];
      }
    };
    SemanticSearchFullResult = class _SemanticSearchFullResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.codeResults = [];
        this.allFiles = [];
        this.missingFiles = [];
        this.knowledgeResults = [];
        this.prResults = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SemanticSearchFullResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SemanticSearchFullResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SemanticSearchFullResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SemanticSearchFullResult, a, b2);
      }
      static $() {
        return ["SemanticSearchFullResult|1 code_results #0*|2 all_files #1*|3 missing_files #2*|4 knowledge_results #3*|5 pr_results #4*|6 git_remote_url 9?|7 pr_hydration_timed_out 8?", CodeResult, File2, MissingFile, Knowledge, ToolPullRequestResult];
      }
    };
    SemanticSearchFullStream = class _SemanticSearchFullStream extends __protoMessage392 {
      constructor(data) {
        super();
        this.numFiles = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SemanticSearchFullStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SemanticSearchFullStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SemanticSearchFullStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SemanticSearchFullStream, a, b2);
      }
      static $() {
        return ["SemanticSearchFullStream|1 num_files 5"];
      }
    };
    DeleteFileParams = class _DeleteFileParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteFileParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteFileParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteFileParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteFileParams, a, b2);
      }
      static $() {
        return ["DeleteFileParams|1 relative_workspace_path 9"];
      }
    };
    DeleteFileResult = class _DeleteFileResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.rejected = false;
        this.fileNonExistent = false;
        this.fileDeletedSuccessfully = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteFileResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteFileResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteFileResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteFileResult, a, b2);
      }
      static $() {
        return ["DeleteFileResult|1 rejected 8|2 file_non_existent 8|3 file_deleted_successfully 8"];
      }
    };
    DeleteFileStream = class _DeleteFileStream extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteFileStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteFileStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteFileStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteFileStream, a, b2);
      }
      static $() {
        return ["DeleteFileStream|1 relative_workspace_path 9"];
      }
    };
    BuiltinToolCall = class _BuiltinToolCall extends __protoMessage392 {
      constructor(data) {
        super();
        this.tool = BuiltinTool.UNSPECIFIED;
        this.params = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BuiltinToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BuiltinToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BuiltinToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BuiltinToolCall, a, b2);
      }
      static $() {
        return ["BuiltinToolCall|1 tool #0|2 search_params #1 params|3 read_chunk_params #2 params|4 gotodef_params #3 params|5 edit_params #4 params|6 undo_edit_params #5 params|7 end_params #6 params|8 new_file_params #7 params|9 add_test_params #8 params|10 run_test_params #9 params|11 delete_test_params #10 params|12 save_file_params #11 params|13 get_tests_params #12 params|14 get_symbols_params #13 params|15 semantic_search_params #14 params|16 get_project_structure_params #15 params|17 create_rm_files_params #16 params|18 run_terminal_commands_params #17 params|19 new_edit_params #18 params|20 read_with_linter_params #19 params|21 add_ui_step_params #20 params|23 read_semsearch_files_params #21 params|26 delete_file_params #22 params|22 tool_call_id 9?", BuiltinTool, SearchParams, ReadChunkParams, GotodefParams, EditParams, UndoEditParams, EndParams, NewFileParams, AddTestParams, RunTestParams, DeleteTestParams, SaveFileParams, GetTestsParams, GetSymbolsParams, SemanticSearchParams, GetProjectStructureParams, CreateRmFilesParams, RunTerminalCommandsParams, NewEditParams, ReadWithLinterParams, AddUiStepParams, ReadSemsearchFilesParams, DeleteFileParams];
      }
    };
    BuiltinToolResult = class _BuiltinToolResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.tool = BuiltinTool.UNSPECIFIED;
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BuiltinToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BuiltinToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BuiltinToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BuiltinToolResult, a, b2);
      }
      static $() {
        return ["BuiltinToolResult|1 tool #0|2 search_result #1 result|3 read_chunk_result #2 result|4 gotodef_result #3 result|5 edit_result #4 result|6 undo_edit_result #5 result|7 end_result #6 result|8 new_file_result #7 result|9 add_test_result #8 result|10 run_test_result #9 result|11 delete_test_result #10 result|12 save_file_result #11 result|13 get_tests_result #12 result|14 get_symbols_result #13 result|15 semantic_search_result #14 result|16 get_project_structure_result #15 result|17 create_rm_files_result #16 result|18 run_terminal_commands_result #17 result|19 new_edit_result #18 result|20 read_with_linter_result #19 result|21 add_ui_step_result #20 result|22 read_semsearch_files_result #21 result|24 delete_file_result #22 result", BuiltinTool, SearchResult, ReadChunkResult, GotodefResult, EditResult2, UndoEditResult, EndResult, NewFileResult, AddTestResult, RunTestResult, DeleteTestResult, SaveFileResult, GetTestsResult, GetSymbolsResult, SemanticSearchResult, GetProjectStructureResult, CreateRmFilesResult, RunTerminalCommandsResult, NewEditResult, ReadWithLinterResult, AddUiStepResult, ReadSemsearchFilesResult, DeleteFileResult];
      }
    };
    AddUiStepParams = class _AddUiStepParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.conversationId = "";
        this.step = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AddUiStepParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AddUiStepParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AddUiStepParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AddUiStepParams, a, b2);
      }
      static $() {
        return ["AddUiStepParams|1 conversation_id 9|2 search_results #0 step", AddUiStepParams_SearchResults];
      }
    };
    AddUiStepParams_SearchResult = class _AddUiStepParams_SearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AddUiStepParams_SearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AddUiStepParams_SearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AddUiStepParams_SearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AddUiStepParams_SearchResult, a, b2);
      }
      static $() {
        return ["AddUiStepParams.SearchResult|1 relative_workspace_path 9"];
      }
    };
    AddUiStepParams_SearchResults = class _AddUiStepParams_SearchResults extends __protoMessage392 {
      constructor(data) {
        super();
        this.searchResults = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AddUiStepParams_SearchResults().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AddUiStepParams_SearchResults().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AddUiStepParams_SearchResults().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AddUiStepParams_SearchResults, a, b2);
      }
      static $() {
        return ["AddUiStepParams.SearchResults|1 search_results #0*", AddUiStepParams_SearchResult];
      }
    };
    AddUiStepResult = class _AddUiStepResult extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AddUiStepResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AddUiStepResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AddUiStepResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AddUiStepResult, a, b2);
      }
      static $() {
        return ["AddUiStepResult"];
      }
    };
    ToolCall2 = class _ToolCall extends __protoMessage392 {
      constructor(data) {
        super();
        this.toolCall = { case: void 0 };
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
        return ["ToolCall|1 builtin_tool_call #0 tool_call|2 custom_tool_call #1 tool_call", BuiltinToolCall, CustomToolCall];
      }
    };
    ToolResult = class _ToolResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.toolResult = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ToolResult, a, b2);
      }
      static $() {
        return ["ToolResult|1 builtin_tool_result #0 tool_result|2 custom_tool_result #1 tool_result|3 error_tool_result #2 tool_result", BuiltinToolResult, CustomToolResult, ErrorToolResult];
      }
    };
    ReadWithLinterParams = class _ReadWithLinterParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadWithLinterParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadWithLinterParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadWithLinterParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadWithLinterParams, a, b2);
      }
      static $() {
        return ["ReadWithLinterParams|1 relative_workspace_path 9"];
      }
    };
    ReadWithLinterResult = class _ReadWithLinterResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.contents = "";
        this.diagnostics = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadWithLinterResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadWithLinterResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadWithLinterResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadWithLinterResult, a, b2);
      }
      static $() {
        return ["ReadWithLinterResult|1 contents 9|2 diagnostics #0*", Diagnostic];
      }
    };
    RunTerminalCommandsParams = class _RunTerminalCommandsParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.commands = [];
        this.commandsUuid = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RunTerminalCommandsParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RunTerminalCommandsParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RunTerminalCommandsParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RunTerminalCommandsParams, a, b2);
      }
      static $() {
        return ["RunTerminalCommandsParams|1 commands 9*|2 commands_uuid 9"];
      }
    };
    RunTerminalCommandsResult = class _RunTerminalCommandsResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.outputs = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RunTerminalCommandsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RunTerminalCommandsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RunTerminalCommandsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RunTerminalCommandsResult, a, b2);
      }
      static $() {
        return ["RunTerminalCommandsResult|1 outputs 9*"];
      }
    };
    CreateRmFilesParams = class _CreateRmFilesParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.removedFilePaths = [];
        this.createdFilePaths = [];
        this.createdDirectoryPaths = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreateRmFilesParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreateRmFilesParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreateRmFilesParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreateRmFilesParams, a, b2);
      }
      static $() {
        return ["CreateRmFilesParams|1 removed_file_paths 9*|2 created_file_paths 9*|3 created_directory_paths 9*"];
      }
    };
    CreateRmFilesResult = class _CreateRmFilesResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.createdFilePaths = [];
        this.removedFilePaths = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreateRmFilesResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreateRmFilesResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreateRmFilesResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreateRmFilesResult, a, b2);
      }
      static $() {
        return ["CreateRmFilesResult|1 created_file_paths 9*|2 removed_file_paths 9*"];
      }
    };
    GetProjectStructureParams = class _GetProjectStructureParams extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetProjectStructureParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetProjectStructureParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetProjectStructureParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetProjectStructureParams, a, b2);
      }
      static $() {
        return ["GetProjectStructureParams"];
      }
    };
    GetProjectStructureResult = class _GetProjectStructureResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.files = [];
        this.rootWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetProjectStructureResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetProjectStructureResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetProjectStructureResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetProjectStructureResult, a, b2);
      }
      static $() {
        return ["GetProjectStructureResult|1 files #0*|2 root_workspace_path 9", GetProjectStructureResult_File];
      }
    };
    GetProjectStructureResult_File = class _GetProjectStructureResult_File extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.outline = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetProjectStructureResult_File().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetProjectStructureResult_File().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetProjectStructureResult_File().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetProjectStructureResult_File, a, b2);
      }
      static $() {
        return ["GetProjectStructureResult.File|1 relative_workspace_path 9|2 outline 9"];
      }
    };
    NewFileParams = class _NewFileParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NewFileParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NewFileParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NewFileParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NewFileParams, a, b2);
      }
      static $() {
        return ["NewFileParams|1 relative_workspace_path 9"];
      }
    };
    SemanticSearchParams = class _SemanticSearchParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.query = "";
        this.topK = 0;
        this.grabWholeFile = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SemanticSearchParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SemanticSearchParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SemanticSearchParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SemanticSearchParams, a, b2);
      }
      static $() {
        return ["SemanticSearchParams|1 query 9|2 include_pattern 9?|3 exclude_pattern 9?|4 top_k 5|5 index_id 9?|6 grab_whole_file 8"];
      }
    };
    Range3 = class _Range extends __protoMessage392 {
      constructor(data) {
        super();
        this.startLine = 0;
        this.startCharacter = 0;
        this.endLine = 0;
        this.endCharacter = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Range().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Range().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Range().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Range, a, b2);
      }
      static $() {
        return ["Range|1 start_line 5|2 start_character 5|3 end_line 5|4 end_character 5"];
      }
    };
    MatchRange = class _MatchRange extends __protoMessage392 {
      constructor(data) {
        super();
        this.start = 0;
        this.end = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MatchRange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MatchRange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MatchRange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MatchRange, a, b2);
      }
      static $() {
        return ["MatchRange|1 start 5|2 end 5"];
      }
    };
    SemanticSearchResult = class _SemanticSearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.results = [];
        this.files = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SemanticSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SemanticSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SemanticSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SemanticSearchResult, a, b2);
      }
      static $() {
        return ["SemanticSearchResult|1 results #0*|2 files 9,9", SemanticSearchResult_Item];
      }
    };
    SemanticSearchResult_Item = class _SemanticSearchResult_Item extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.score = 0;
        this.content = "";
        this.detailedLines = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SemanticSearchResult_Item().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SemanticSearchResult_Item().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SemanticSearchResult_Item().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SemanticSearchResult_Item, a, b2);
      }
      static $() {
        return ["SemanticSearchResult.Item|1 relative_workspace_path 9|2 score 2|3 content 9|4 range #0|5 original_content 9?|6 detailed_lines #1*", SimpleRange, DetailedLine];
      }
    };
    SearchParams = class _SearchParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.query = "";
        this.regex = false;
        this.includePattern = "";
        this.excludePattern = "";
        this.filenameSearch = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SearchParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SearchParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SearchParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SearchParams, a, b2);
      }
      static $() {
        return ["SearchParams|1 query 9|2 regex 8|3 include_pattern 9|4 exclude_pattern 9|5 filename_search 8"];
      }
    };
    SearchToolFileSearchResult = class _SearchToolFileSearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.numMatches = 0;
        this.potentiallyRelevantLines = [];
        this.cropped = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SearchToolFileSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SearchToolFileSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SearchToolFileSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SearchToolFileSearchResult, a, b2);
      }
      static $() {
        return ["SearchToolFileSearchResult|1 relative_workspace_path 9|2 num_matches 5|3 potentially_relevant_lines #0*|4 cropped 8", SearchToolFileSearchResult_Line];
      }
    };
    SearchToolFileSearchResult_Line = class _SearchToolFileSearchResult_Line extends __protoMessage392 {
      constructor(data) {
        super();
        this.lineNumber = 0;
        this.text = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SearchToolFileSearchResult_Line().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SearchToolFileSearchResult_Line().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SearchToolFileSearchResult_Line().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SearchToolFileSearchResult_Line, a, b2);
      }
      static $() {
        return ["SearchToolFileSearchResult.Line|1 line_number 5|2 text 9"];
      }
    };
    SearchResult = class _SearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.fileResults = [];
        this.numTotalMatches = 0;
        this.numTotalMatchedFiles = 0;
        this.numTotalMayBeIncomplete = false;
        this.filesOnly = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SearchResult, a, b2);
      }
      static $() {
        return ["SearchResult|1 file_results #0*|2 num_total_matches 5|3 num_total_matched_files 5|4 num_total_may_be_incomplete 8|5 files_only 8", SearchToolFileSearchResult];
      }
    };
    ReadChunkParams = class _ReadChunkParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.startLineNumber = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadChunkParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadChunkParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadChunkParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadChunkParams, a, b2);
      }
      static $() {
        return ["ReadChunkParams|1 relative_workspace_path 9|2 start_line_number 5|3 num_lines 5?"];
      }
    };
    ReadChunkResult = class _ReadChunkResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.startLineNumber = 0;
        this.lines = [];
        this.totalNumLines = 0;
        this.cropped = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadChunkResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadChunkResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadChunkResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadChunkResult, a, b2);
      }
      static $() {
        return ["ReadChunkResult|1 relative_workspace_path 9|2 start_line_number 5|3 lines 9*|4 total_num_lines 5|5 cropped 8"];
      }
    };
    UndoEditParams = class _UndoEditParams extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UndoEditParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UndoEditParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UndoEditParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UndoEditParams, a, b2);
      }
      static $() {
        return ["UndoEditParams"];
      }
    };
    EndParams = class _EndParams extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EndParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EndParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EndParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EndParams, a, b2);
      }
      static $() {
        return ["EndParams"];
      }
    };
    NewFileResult = class _NewFileResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.fileTotalLines = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NewFileResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NewFileResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NewFileResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NewFileResult, a, b2);
      }
      static $() {
        return ["NewFileResult|1 relative_workspace_path 9|2 file_total_lines 5"];
      }
    };
    UndoEditResult = class _UndoEditResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.feedback = [];
        this.relativeWorkspacePath = "";
        this.contextStartLineNumber = 0;
        this.contextLines = [];
        this.contextTotalNumLines = 0;
        this.fileTotalLines = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UndoEditResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UndoEditResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UndoEditResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UndoEditResult, a, b2);
      }
      static $() {
        return ["UndoEditResult|1 feedback 9*|4 relative_workspace_path 9|2 context_start_line_number 5|3 context_lines 9*|5 context_total_num_lines 5|6 file_total_lines 5"];
      }
    };
    EndResult = class _EndResult extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EndResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EndResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EndResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EndResult, a, b2);
      }
      static $() {
        return ["EndResult"];
      }
    };
    CustomToolCall = class _CustomToolCall extends __protoMessage392 {
      constructor(data) {
        super();
        this.toolId = "";
        this.params = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CustomToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CustomToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CustomToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CustomToolCall, a, b2);
      }
      static $() {
        return ["CustomToolCall|1 tool_id 9|2 params 9"];
      }
    };
    CustomToolResult = class _CustomToolResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.toolId = "";
        this.result = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CustomToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CustomToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CustomToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CustomToolResult, a, b2);
      }
      static $() {
        return ["CustomToolResult|1 tool_id 9|2 result 9"];
      }
    };
    GotodefParams = class _GotodefParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.symbol = "";
        this.startLine = 0;
        this.endLine = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GotodefParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GotodefParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GotodefParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GotodefParams, a, b2);
      }
      static $() {
        return ["GotodefParams|1 relative_workspace_path 9|2 symbol 9|3 start_line 5|4 end_line 5"];
      }
    };
    GotodefDefinition = class _GotodefDefinition extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.startLine = 0;
        this.endLine = 0;
        this.codeContextLines = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GotodefDefinition().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GotodefDefinition().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GotodefDefinition().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GotodefDefinition, a, b2);
      }
      static $() {
        return ["GotodefDefinition|1 relative_workspace_path 9|2 fully_qualified_name 9?|3 symbol_kind 9?|4 start_line 5|5 end_line 5|6 code_context_lines 9*"];
      }
    };
    GotodefResult = class _GotodefResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.definitions = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GotodefResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GotodefResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GotodefResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GotodefResult, a, b2);
      }
      static $() {
        return ["GotodefResult|1 definitions #0*", GotodefDefinition];
      }
    };
    ErrorToolResult = class _ErrorToolResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.errorMessage = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ErrorToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ErrorToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ErrorToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ErrorToolResult, a, b2);
      }
      static $() {
        return ["ErrorToolResult|1 error_message 9"];
      }
    };
    NewEditParams = class _NewEditParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.text = "";
        this.editId = "";
        this.firstEdit = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NewEditParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NewEditParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NewEditParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NewEditParams, a, b2);
      }
      static $() {
        return ["NewEditParams|1 relative_workspace_path 9|2 start_line_number 5?|3 end_line_number 5?|4 text 9|5 edit_id 9|6 first_edit 8"];
      }
    };
    NewEditResult = class _NewEditResult extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _NewEditResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _NewEditResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _NewEditResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_NewEditResult, a, b2);
      }
      static $() {
        return ["NewEditResult"];
      }
    };
    EditParams = class _EditParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.replaceNumLines = 0;
        this.newLines = [];
        this.editId = "";
        this.frontendEditType = EditParams_FrontendEditType.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditParams, a, b2);
      }
      static $() {
        return ["EditParams|1 relative_workspace_path 9|2 line_number 5?|3 replace_num_lines 5|4 new_lines 9*|7 replace_whole_file 8?|5 edit_id 9|6 frontend_edit_type #0|8 auto_fix_all_linter_errors_in_file 8?", EditParams_FrontendEditType];
      }
    };
    EditParams_FrontendEditType = /* @__PURE__ */ enumType(proto3, __protoPackage96, "EditParams.FrontendEditType", [[0, "UNSPECIFIED"], [1, "INLINE_DIFFS"], [2, "SIMPLE"]], 1);
    EditResult2 = class _EditResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.feedback = [];
        this.contextStartLineNumber = 0;
        this.contextLines = [];
        this.file = "";
        this.fileTotalLines = 0;
        this.structuredFeedback = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditResult, a, b2);
      }
      static $() {
        return ["EditResult|1 feedback 9*|2 context_start_line_number 5|3 context_lines 9*|4 file 9|5 file_total_lines 5|6 structured_feedback #0*", EditResult_Feedback];
      }
    };
    EditResult_RelatedInformation = class _EditResult_RelatedInformation extends __protoMessage392 {
      constructor(data) {
        super();
        this.message = "";
        this.startLineNumber = 0;
        this.endLineNumber = 0;
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditResult_RelatedInformation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditResult_RelatedInformation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditResult_RelatedInformation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditResult_RelatedInformation, a, b2);
      }
      static $() {
        return ["EditResult.RelatedInformation|1 message 9|2 start_line_number 5|3 end_line_number 5|4 relative_workspace_path 9"];
      }
    };
    EditResult_Feedback = class _EditResult_Feedback extends __protoMessage392 {
      constructor(data) {
        super();
        this.message = "";
        this.severity = "";
        this.startLineNumber = 0;
        this.endLineNumber = 0;
        this.relatedInformation = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditResult_Feedback().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditResult_Feedback().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditResult_Feedback().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditResult_Feedback, a, b2);
      }
      static $() {
        return ["EditResult.Feedback|1 message 9|2 severity 9|3 start_line_number 5|4 end_line_number 5|5 related_information #0*", EditResult_RelatedInformation];
      }
    };
    AddTestParams = class _AddTestParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.testName = "";
        this.testCode = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AddTestParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AddTestParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AddTestParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AddTestParams, a, b2);
      }
      static $() {
        return ["AddTestParams|1 relative_workspace_path 9|2 test_name 9|3 test_code 9"];
      }
    };
    AddTestResult = class _AddTestResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.feedback = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AddTestResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AddTestResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AddTestResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AddTestResult, a, b2);
      }
      static $() {
        return ["AddTestResult|1 feedback #0*", AddTestResult_Feedback];
      }
    };
    AddTestResult_RelatedInformation = class _AddTestResult_RelatedInformation extends __protoMessage392 {
      constructor(data) {
        super();
        this.message = "";
        this.startLineNumber = 0;
        this.endLineNumber = 0;
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AddTestResult_RelatedInformation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AddTestResult_RelatedInformation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AddTestResult_RelatedInformation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AddTestResult_RelatedInformation, a, b2);
      }
      static $() {
        return ["AddTestResult.RelatedInformation|1 message 9|2 start_line_number 5|3 end_line_number 5|4 relative_workspace_path 9"];
      }
    };
    AddTestResult_Feedback = class _AddTestResult_Feedback extends __protoMessage392 {
      constructor(data) {
        super();
        this.message = "";
        this.severity = "";
        this.startLineNumber = 0;
        this.endLineNumber = 0;
        this.relatedInformation = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AddTestResult_Feedback().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AddTestResult_Feedback().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AddTestResult_Feedback().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AddTestResult_Feedback, a, b2);
      }
      static $() {
        return ["AddTestResult.Feedback|1 message 9|2 severity 9|3 start_line_number 5|4 end_line_number 5|5 related_information #0*", AddTestResult_RelatedInformation];
      }
    };
    RunTestParams = class _RunTestParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RunTestParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RunTestParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RunTestParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RunTestParams, a, b2);
      }
      static $() {
        return ["RunTestParams|1 relative_workspace_path 9|2 test_name 9?"];
      }
    };
    RunTestResult = class _RunTestResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.result = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RunTestResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RunTestResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RunTestResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RunTestResult, a, b2);
      }
      static $() {
        return ["RunTestResult|1 result 9"];
      }
    };
    GetTestsParams = class _GetTestsParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetTestsParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetTestsParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetTestsParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetTestsParams, a, b2);
      }
      static $() {
        return ["GetTestsParams|1 relative_workspace_path 9"];
      }
    };
    GetTestsResult = class _GetTestsResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.tests = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetTestsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetTestsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetTestsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetTestsResult, a, b2);
      }
      static $() {
        return ["GetTestsResult|1 tests #0*", GetTestsResult_Test];
      }
    };
    GetTestsResult_Test = class _GetTestsResult_Test extends __protoMessage392 {
      constructor(data) {
        super();
        this.name = "";
        this.lines = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetTestsResult_Test().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetTestsResult_Test().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetTestsResult_Test().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetTestsResult_Test, a, b2);
      }
      static $() {
        return ["GetTestsResult.Test|1 name 9|2 lines 9*"];
      }
    };
    DeleteTestParams = class _DeleteTestParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteTestParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteTestParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteTestParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteTestParams, a, b2);
      }
      static $() {
        return ["DeleteTestParams|1 relative_workspace_path 9|2 test_name 9?"];
      }
    };
    DeleteTestResult = class _DeleteTestResult extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteTestResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteTestResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteTestResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteTestResult, a, b2);
      }
      static $() {
        return ["DeleteTestResult"];
      }
    };
    SaveFileParams = class _SaveFileParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SaveFileParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SaveFileParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SaveFileParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SaveFileParams, a, b2);
      }
      static $() {
        return ["SaveFileParams|1 relative_workspace_path 9"];
      }
    };
    SaveFileResult = class _SaveFileResult extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SaveFileResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SaveFileResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SaveFileResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SaveFileResult, a, b2);
      }
      static $() {
        return ["SaveFileResult"];
      }
    };
    GetSymbolsParams = class _GetSymbolsParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.relativeWorkspacePath = "";
        this.includeChildren = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetSymbolsParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetSymbolsParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetSymbolsParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetSymbolsParams, a, b2);
      }
      static $() {
        return ["GetSymbolsParams|1 relative_workspace_path 9|2 line_range #0?|3 include_children 8", GetSymbolsParams_LineRange];
      }
    };
    GetSymbolsParams_LineRange = class _GetSymbolsParams_LineRange extends __protoMessage392 {
      constructor(data) {
        super();
        this.startLineNumber = 0;
        this.endLineNumberInclusive = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetSymbolsParams_LineRange().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetSymbolsParams_LineRange().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetSymbolsParams_LineRange().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetSymbolsParams_LineRange, a, b2);
      }
      static $() {
        return ["GetSymbolsParams.LineRange|1 start_line_number 5|2 end_line_number_inclusive 5"];
      }
    };
    GetSymbolsResult = class _GetSymbolsResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.symbols = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetSymbolsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetSymbolsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetSymbolsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetSymbolsResult, a, b2);
      }
      static $() {
        return ["GetSymbolsResult|1 symbols #0*", DocumentSymbol];
      }
    };
    ShellCommandParsingResult2 = class _ShellCommandParsingResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.parsingFailed = false;
        this.executableCommands = [];
        this.hasRedirects = false;
        this.hasCommandSubstitution = false;
        this.redirects = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellCommandParsingResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellCommandParsingResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellCommandParsingResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellCommandParsingResult, a, b2);
      }
      static $() {
        return ["ShellCommandParsingResult|1 parsing_failed 8|2 executable_commands #0*|3 has_redirects 8|4 has_command_substitution 8|5 all_redirects_are_dev_null 8?|6 redirects #1*", ShellCommandParsingResult_ExecutableCommand2, ShellCommandParsingResult_Redirect2];
      }
    };
    ShellCommandParsingResult_ExecutableCommandArg2 = class _ShellCommandParsingResult_ExecutableCommandArg extends __protoMessage392 {
      constructor(data) {
        super();
        this.type = "";
        this.value = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellCommandParsingResult_ExecutableCommandArg().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellCommandParsingResult_ExecutableCommandArg().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellCommandParsingResult_ExecutableCommandArg().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellCommandParsingResult_ExecutableCommandArg, a, b2);
      }
      static $() {
        return ["ShellCommandParsingResult.ExecutableCommandArg|1 type 9|2 value 9"];
      }
    };
    ShellCommandParsingResult_ExecutableCommand2 = class _ShellCommandParsingResult_ExecutableCommand extends __protoMessage392 {
      constructor(data) {
        super();
        this.name = "";
        this.args = [];
        this.fullText = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellCommandParsingResult_ExecutableCommand().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellCommandParsingResult_ExecutableCommand().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellCommandParsingResult_ExecutableCommand().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellCommandParsingResult_ExecutableCommand, a, b2);
      }
      static $() {
        return ["ShellCommandParsingResult.ExecutableCommand|1 name 9|2 args #0*|3 full_text 9", ShellCommandParsingResult_ExecutableCommandArg2];
      }
    };
    ShellCommandParsingResult_Redirect2 = class _ShellCommandParsingResult_Redirect extends __protoMessage392 {
      constructor(data) {
        super();
        this.operator = "";
        this.destinationFds = [];
        this.targetNodeType = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ShellCommandParsingResult_Redirect().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ShellCommandParsingResult_Redirect().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ShellCommandParsingResult_Redirect().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ShellCommandParsingResult_Redirect, a, b2);
      }
      static $() {
        return ["ShellCommandParsingResult.Redirect|1 operator 9|2 destination_fds 13*|3 target_node_type 9|4 target_text 9?"];
      }
    };
    RunTerminalCommandV2Params = class _RunTerminalCommandV2Params extends __protoMessage392 {
      constructor(data) {
        super();
        this.command = "";
        this.isBackground = false;
        this.requireUserApproval = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RunTerminalCommandV2Params().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RunTerminalCommandV2Params().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RunTerminalCommandV2Params().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RunTerminalCommandV2Params, a, b2);
      }
      static $() {
        return ["RunTerminalCommandV2Params|1 command 9|2 cwd 9?|3 new_session 8?|4 options #0?|5 is_background 8|6 require_user_approval 8|7 parsing_result #1?|8 idle_timeout_seconds 5?|9 requested_sandbox_policy #2?|10 file_output_threshold_bytes 3?|11 command_description 9?|12 classifier_result #3?", RunTerminalCommandV2Params_ExecutionOptions, ShellCommandParsingResult2, SandboxPolicy, CommandClassifierResult];
      }
    };
    RunTerminalCommandV2Params_ExecutionOptions = class _RunTerminalCommandV2Params_ExecutionOptions extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RunTerminalCommandV2Params_ExecutionOptions().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RunTerminalCommandV2Params_ExecutionOptions().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RunTerminalCommandV2Params_ExecutionOptions().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RunTerminalCommandV2Params_ExecutionOptions, a, b2);
      }
      static $() {
        return ["RunTerminalCommandV2Params.ExecutionOptions|1 timeout 5?|2 skip_ai_check 8?|3 command_run_timeout_ms 5?|4 command_change_check_interval_ms 5?|5 ai_finish_check_max_attempts 5?|6 ai_finish_check_interval_ms 5?|7 delayer_interval_ms 5?|8 ai_check_for_hangs 8?"];
      }
    };
    OutputLocation2 = class _OutputLocation extends __protoMessage392 {
      constructor(data) {
        super();
        this.filePath = "";
        this.sizeBytes = protoInt64.zero;
        this.lineCount = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _OutputLocation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _OutputLocation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _OutputLocation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_OutputLocation, a, b2);
      }
      static $() {
        return ["OutputLocation|1 file_path 9|2 size_bytes 3|3 line_count 3"];
      }
    };
    RunTerminalCommandV2Result = class _RunTerminalCommandV2Result extends __protoMessage392 {
      constructor(data) {
        super();
        this.output = "";
        this.exitCode = 0;
        this.poppedOutIntoBackground = false;
        this.isRunningInBackground = false;
        this.notInterrupted = false;
        this.resultingWorkingDirectory = "";
        this.didUserChange = false;
        this.endedReason = RunTerminalCommandEndedReason.UNSPECIFIED;
        this.outputRaw = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RunTerminalCommandV2Result().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RunTerminalCommandV2Result().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RunTerminalCommandV2Result().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RunTerminalCommandV2Result, a, b2);
      }
      static $() {
        return ["RunTerminalCommandV2Result|1 output 9|2 exit_code 5|3 rejected 8?|4 popped_out_into_background 8|5 is_running_in_background 8|6 not_interrupted 8|7 resulting_working_directory 9|8 did_user_change 8|9 ended_reason #0|10 exit_code_v2 5?|11 updated_command 9?|12 output_raw 9|13 human_review_v2 #1?|14 effective_sandbox_policy #2?|15 terminal_instance_id 5?|16 output_location #3?|17 terminal_instance_path 9?|18 background_shell_id 13?", RunTerminalCommandEndedReason, HumanReview, SandboxPolicy, OutputLocation2];
      }
    };
    RunTerminalCommandV2Stream = class _RunTerminalCommandV2Stream extends __protoMessage392 {
      constructor(data) {
        super();
        this.command = "";
        this.isBackground = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RunTerminalCommandV2Stream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RunTerminalCommandV2Stream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RunTerminalCommandV2Stream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RunTerminalCommandV2Stream, a, b2);
      }
      static $() {
        return ["RunTerminalCommandV2Stream|1 command 9|2 is_background 8|7 parsing_result #0?|8 idle_timeout_seconds 5?|9 requested_sandbox_policy #1?", ShellCommandParsingResult2, SandboxPolicy];
      }
    };
    FetchRulesStream = class _FetchRulesStream extends __protoMessage392 {
      constructor(data) {
        super();
        this.ruleNames = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchRulesStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchRulesStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchRulesStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchRulesStream, a, b2);
      }
      static $() {
        return ["FetchRulesStream|1 rule_names 9*"];
      }
    };
    WebSearchParams = class _WebSearchParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.searchTerm = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebSearchParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebSearchParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebSearchParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebSearchParams, a, b2);
      }
      static $() {
        return ["WebSearchParams|1 search_term 9"];
      }
    };
    WebSearchResult2 = class _WebSearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.references = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebSearchResult, a, b2);
      }
      static $() {
        return ["WebSearchResult|1 references #0*|2 is_final 8?|3 rejected 8?", WebSearchResult_WebReference];
      }
    };
    WebSearchResult_WebReference = class _WebSearchResult_WebReference extends __protoMessage392 {
      constructor(data) {
        super();
        this.title = "";
        this.url = "";
        this.chunk = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebSearchResult_WebReference().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebSearchResult_WebReference().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebSearchResult_WebReference().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebSearchResult_WebReference, a, b2);
      }
      static $() {
        return ["WebSearchResult.WebReference|1 title 9|2 url 9|3 chunk 9"];
      }
    };
    WebSearchStream = class _WebSearchStream extends __protoMessage392 {
      constructor(data) {
        super();
        this.searchTerm = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebSearchStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebSearchStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebSearchStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebSearchStream, a, b2);
      }
      static $() {
        return ["WebSearchStream|1 search_term 9"];
      }
    };
    MCPParams = class _MCPParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.tools = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MCPParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MCPParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MCPParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MCPParams, a, b2);
      }
      static $() {
        return ["MCPParams|1 tools #0*|2 file_output_threshold_bytes 3?", MCPParams_Tool];
      }
    };
    MCPParams_Tool = class _MCPParams_Tool extends __protoMessage392 {
      constructor(data) {
        super();
        this.name = "";
        this.description = "";
        this.parameters = "";
        this.serverName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MCPParams_Tool().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MCPParams_Tool().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MCPParams_Tool().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MCPParams_Tool, a, b2);
      }
      static $() {
        return ["MCPParams.Tool|1 name 9|2 description 9|3 parameters 9|4 server_name 9|5 transcript_display #0?", MCPParams_TranscriptDisplay];
      }
    };
    MCPParams_TranscriptDisplay = class _MCPParams_TranscriptDisplay extends __protoMessage392 {
      constructor(data) {
        super();
        this.loading = "";
        this.success = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MCPParams_TranscriptDisplay().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MCPParams_TranscriptDisplay().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MCPParams_TranscriptDisplay().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MCPParams_TranscriptDisplay, a, b2);
      }
      static $() {
        return ["MCPParams.TranscriptDisplay|1 loading 9|2 success 9|3 error 9"];
      }
    };
    MCPResult = class _MCPResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.selectedTool = "";
        this.result = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MCPResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MCPResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MCPResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MCPResult, a, b2);
      }
      static $() {
        return ["MCPResult|1 selected_tool 9|2 result 9"];
      }
    };
    MCPStream = class _MCPStream extends __protoMessage392 {
      constructor(data) {
        super();
        this.tools = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _MCPStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _MCPStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _MCPStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_MCPStream, a, b2);
      }
      static $() {
        return ["MCPStream|1 tools #0*", MCPParams_Tool];
      }
    };
    ListMcpResourcesParams = class _ListMcpResourcesParams extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListMcpResourcesParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListMcpResourcesParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListMcpResourcesParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListMcpResourcesParams, a, b2);
      }
      static $() {
        return ["ListMcpResourcesParams|1 server 9?"];
      }
    };
    ListMcpResourcesResult = class _ListMcpResourcesResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.resources = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListMcpResourcesResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListMcpResourcesResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListMcpResourcesResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListMcpResourcesResult, a, b2);
      }
      static $() {
        return ["ListMcpResourcesResult|1 resources #0*", ListMcpResourcesResult_MCPResource];
      }
    };
    ListMcpResourcesResult_MCPResource = class _ListMcpResourcesResult_MCPResource extends __protoMessage392 {
      constructor(data) {
        super();
        this.uri = "";
        this.server = "";
        this.annotations = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListMcpResourcesResult_MCPResource().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListMcpResourcesResult_MCPResource().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListMcpResourcesResult_MCPResource().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListMcpResourcesResult_MCPResource, a, b2);
      }
      static $() {
        return ["ListMcpResourcesResult.MCPResource|1 uri 9|2 name 9?|3 description 9?|4 mime_type 9?|5 server 9|6 annotations 9,9"];
      }
    };
    ReadMcpResourceParams = class _ReadMcpResourceParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.server = "";
        this.uri = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadMcpResourceParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadMcpResourceParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadMcpResourceParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadMcpResourceParams, a, b2);
      }
      static $() {
        return ["ReadMcpResourceParams|1 server 9|2 uri 9|3 download_path 9?"];
      }
    };
    ReadMcpResourceResult = class _ReadMcpResourceResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.uri = "";
        this.content = { case: void 0 };
        this.annotations = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadMcpResourceResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadMcpResourceResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadMcpResourceResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadMcpResourceResult, a, b2);
      }
      static $() {
        return ["ReadMcpResourceResult|1 uri 9|2 name 9?|3 description 9?|4 mime_type 9?|5 text 9 content|6 blob 12 content|7 annotations 9,9"];
      }
    };
    CallMcpToolParams = class _CallMcpToolParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.server = "";
        this.toolName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CallMcpToolParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CallMcpToolParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CallMcpToolParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CallMcpToolParams, a, b2);
      }
      static $() {
        return ["CallMcpToolParams|1 server 9|2 tool_name 9|3 tool_args #0", Struct];
      }
    };
    CallMcpToolResult = class _CallMcpToolResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.server = "";
        this.toolName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CallMcpToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CallMcpToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CallMcpToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CallMcpToolResult, a, b2);
      }
      static $() {
        return ["CallMcpToolResult|1 server 9|2 tool_name 9|3 result #0", Struct];
      }
    };
    GetMcpToolsParams = class _GetMcpToolsParams extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetMcpToolsParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetMcpToolsParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetMcpToolsParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetMcpToolsParams, a, b2);
      }
      static $() {
        return ["GetMcpToolsParams|1 server 9?|2 tool_name 9?|3 pattern 9?"];
      }
    };
    GetMcpToolsResult = class _GetMcpToolsResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetMcpToolsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetMcpToolsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetMcpToolsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetMcpToolsResult, a, b2);
      }
      static $() {
        return ["GetMcpToolsResult|1 content 9|2 output_file_path 9?"];
      }
    };
    SearchSymbolsParams = class _SearchSymbolsParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.query = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SearchSymbolsParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SearchSymbolsParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SearchSymbolsParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SearchSymbolsParams, a, b2);
      }
      static $() {
        return ["SearchSymbolsParams|1 query 9"];
      }
    };
    SearchSymbolsResult = class _SearchSymbolsResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.matches = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SearchSymbolsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SearchSymbolsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SearchSymbolsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SearchSymbolsResult, a, b2);
      }
      static $() {
        return ["SearchSymbolsResult|1 matches #0*|2 rejected 8?", SearchSymbolsResult_SymbolMatch];
      }
    };
    SearchSymbolsResult_SymbolMatch = class _SearchSymbolsResult_SymbolMatch extends __protoMessage392 {
      constructor(data) {
        super();
        this.name = "";
        this.uri = "";
        this.secondaryText = "";
        this.labelMatches = [];
        this.descriptionMatches = [];
        this.score = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SearchSymbolsResult_SymbolMatch().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SearchSymbolsResult_SymbolMatch().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SearchSymbolsResult_SymbolMatch().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SearchSymbolsResult_SymbolMatch, a, b2);
      }
      static $() {
        return ["SearchSymbolsResult.SymbolMatch|1 name 9|2 uri 9|3 range #0|4 secondary_text 9|5 label_matches #1*|6 description_matches #1*|7 score 1", Range3, MatchRange];
      }
    };
    SearchSymbolsStream = class _SearchSymbolsStream extends __protoMessage392 {
      constructor(data) {
        super();
        this.query = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SearchSymbolsStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SearchSymbolsStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SearchSymbolsStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SearchSymbolsStream, a, b2);
      }
      static $() {
        return ["SearchSymbolsStream|1 query 9"];
      }
    };
    BackgroundComposerFollowupParams = class _BackgroundComposerFollowupParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.proposedFollowup = "";
        this.bcId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundComposerFollowupParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundComposerFollowupParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundComposerFollowupParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundComposerFollowupParams, a, b2);
      }
      static $() {
        return ["BackgroundComposerFollowupParams|1 proposed_followup 9|2 bc_id 9"];
      }
    };
    BackgroundComposerFollowupResult = class _BackgroundComposerFollowupResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.proposedFollowup = "";
        this.isSent = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundComposerFollowupResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundComposerFollowupResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundComposerFollowupResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundComposerFollowupResult, a, b2);
      }
      static $() {
        return ["BackgroundComposerFollowupResult|1 proposed_followup 9|2 is_sent 8"];
      }
    };
    BackgroundComposerFollowupStream = class _BackgroundComposerFollowupStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BackgroundComposerFollowupStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BackgroundComposerFollowupStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BackgroundComposerFollowupStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BackgroundComposerFollowupStream, a, b2);
      }
      static $() {
        return ["BackgroundComposerFollowupStream"];
      }
    };
    KnowledgeBaseParams = class _KnowledgeBaseParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.knowledgeToStore = "";
        this.title = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _KnowledgeBaseParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _KnowledgeBaseParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _KnowledgeBaseParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_KnowledgeBaseParams, a, b2);
      }
      static $() {
        return ["KnowledgeBaseParams|1 knowledge_to_store 9|2 title 9|3 existing_knowledge_id 9?|4 action 9?"];
      }
    };
    KnowledgeBaseResult = class _KnowledgeBaseResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.success = false;
        this.confirmationMessage = "";
        this.id = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _KnowledgeBaseResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _KnowledgeBaseResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _KnowledgeBaseResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_KnowledgeBaseResult, a, b2);
      }
      static $() {
        return ["KnowledgeBaseResult|1 success 8|2 confirmation_message 9|3 id 9"];
      }
    };
    KnowledgeBaseStream = class _KnowledgeBaseStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _KnowledgeBaseStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _KnowledgeBaseStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _KnowledgeBaseStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_KnowledgeBaseStream, a, b2);
      }
      static $() {
        return ["KnowledgeBaseStream"];
      }
    };
    FetchPullRequestParams = class _FetchPullRequestParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.pullNumberOrCommitHash = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchPullRequestParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchPullRequestParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchPullRequestParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchPullRequestParams, a, b2);
      }
      static $() {
        return ["FetchPullRequestParams|1 pull_number_or_commit_hash 9|2 repo 9?|3 is_github 8?"];
      }
    };
    FetchPullRequestResult = class _FetchPullRequestResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.content = "";
        this.prNumber = 0;
        this.title = "";
        this.body = "";
        this.author = "";
        this.date = "";
        this.diff = "";
        this.comments = [];
        this.labels = [];
        this.assignees = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchPullRequestResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchPullRequestResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchPullRequestResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchPullRequestResult, a, b2);
      }
      static $() {
        return ["FetchPullRequestResult|1 content 9|2 pr_number 13|3 title 9|4 body 9|5 author 9|6 date 9|7 diff 9|8 sha 9?|9 external_link 9?|10 url 9?|11 comments #0*|12 labels 9*|13 assignees 9*|14 is_issue 8?|15 state 9?|16 prompt_connect_github 8?", IssueComment];
      }
    };
    IssueComment = class _IssueComment extends __protoMessage392 {
      constructor(data) {
        super();
        this.id = 0;
        this.body = "";
        this.createdAt = "";
        this.updatedAt = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _IssueComment().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _IssueComment().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _IssueComment().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_IssueComment, a, b2);
      }
      static $() {
        return ["IssueComment|1 id 13|2 body 9|3 author 9?|4 created_at 9|5 updated_at 9|6 author_association 9?"];
      }
    };
    FetchPullRequestStream = class _FetchPullRequestStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FetchPullRequestStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FetchPullRequestStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FetchPullRequestStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FetchPullRequestStream, a, b2);
      }
      static $() {
        return ["FetchPullRequestStream"];
      }
    };
    PullRequestReference = class _PullRequestReference extends __protoMessage392 {
      constructor(data) {
        super();
        this.sha = "";
        this.score = 0;
        this.changedFiles = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PullRequestReference().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PullRequestReference().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PullRequestReference().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PullRequestReference, a, b2);
      }
      static $() {
        return ["PullRequestReference|1 sha 9|2 score 2|3 title 9?|4 summary 9?|5 pr_number 13?|6 author 9?|7 date 9?|8 changed_files 9*"];
      }
    };
    DeepSearchParams = class _DeepSearchParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.query = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeepSearchParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeepSearchParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeepSearchParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeepSearchParams, a, b2);
      }
      static $() {
        return ["DeepSearchParams|1 query 9"];
      }
    };
    DeepSearchResult = class _DeepSearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.success = false;
        this.result = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeepSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeepSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeepSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeepSearchResult, a, b2);
      }
      static $() {
        return ["DeepSearchResult|1 success 8|2 result 9"];
      }
    };
    DeepSearchStream = class _DeepSearchStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeepSearchStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeepSearchStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeepSearchStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeepSearchStream, a, b2);
      }
      static $() {
        return ["DeepSearchStream"];
      }
    };
    CreateDiagramParams = class _CreateDiagramParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreateDiagramParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreateDiagramParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreateDiagramParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreateDiagramParams, a, b2);
      }
      static $() {
        return ["CreateDiagramParams|1 content 9"];
      }
    };
    CreateDiagramResult = class _CreateDiagramResult extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreateDiagramResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreateDiagramResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreateDiagramResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreateDiagramResult, a, b2);
      }
      static $() {
        return ["CreateDiagramResult|1 error 9?"];
      }
    };
    CreateDiagramStream = class _CreateDiagramStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreateDiagramStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreateDiagramStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreateDiagramStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreateDiagramStream, a, b2);
      }
      static $() {
        return ["CreateDiagramStream"];
      }
    };
    FixLintsParams = class _FixLintsParams extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FixLintsParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FixLintsParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FixLintsParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FixLintsParams, a, b2);
      }
      static $() {
        return ["FixLintsParams"];
      }
    };
    FixLintsResult = class _FixLintsResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.fileResults = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FixLintsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FixLintsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FixLintsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FixLintsResult, a, b2);
      }
      static $() {
        return ["FixLintsResult|1 file_results #0*", FixLintsResult_FileResult];
      }
    };
    FixLintsResult_FileResult = class _FixLintsResult_FileResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.filePath = "";
        this.isApplied = false;
        this.applyFailed = false;
        this.linterErrors = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FixLintsResult_FileResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FixLintsResult_FileResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FixLintsResult_FileResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FixLintsResult_FileResult, a, b2);
      }
      static $() {
        return ["FixLintsResult.FileResult|1 file_path 9|2 diff #0|3 is_applied 8|4 apply_failed 8|5 error 9?|6 linter_errors #1*", EditFileResult_FileDiff, LinterError];
      }
    };
    FixLintsStream = class _FixLintsStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FixLintsStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FixLintsStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FixLintsStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FixLintsStream, a, b2);
      }
      static $() {
        return ["FixLintsStream"];
      }
    };
    ReadLintsParams = class _ReadLintsParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.path = "";
        this.paths = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadLintsParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadLintsParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadLintsParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadLintsParams, a, b2);
      }
      static $() {
        return ["ReadLintsParams|1 path 9|2 paths 9*"];
      }
    };
    ReadLintsResult = class _ReadLintsResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.path = "";
        this.linterErrors = [];
        this.linterErrorsByFile = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadLintsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadLintsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadLintsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadLintsResult, a, b2);
      }
      static $() {
        return ["ReadLintsResult|1 path 9|2 linter_errors #0*|3 linter_errors_by_file #1*", LinterError, LinterErrors];
      }
    };
    ReadLintsStream = class _ReadLintsStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadLintsStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadLintsStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadLintsStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadLintsStream, a, b2);
      }
      static $() {
        return ["ReadLintsStream"];
      }
    };
    GotodefStream = class _GotodefStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GotodefStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GotodefStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GotodefStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GotodefStream, a, b2);
      }
      static $() {
        return ["GotodefStream"];
      }
    };
    TaskParams = class _TaskParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.taskDescription = "";
        this.taskTitle = "";
        this.allowedWriteDirectories = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskParams, a, b2);
      }
      static $() {
        return ["TaskParams|1 task_description 9|4 task_title 9|2 async 8?|3 allowed_write_directories 9*|5 model_override 9?|6 max_mode_override 8?|7 default_expanded_while_running 8?"];
      }
    };
    TaskResult2 = class _TaskResult extends __protoMessage392 {
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
        return ["TaskResult|1 completed_task_result #0 result|2 async_task_result #1 result", TaskResult_CompletedTaskResult, TaskResult_AsyncTaskResult];
      }
    };
    TaskResult_CompletedTaskResult = class _TaskResult_CompletedTaskResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.summary = "";
        this.fileResults = [];
        this.userAborted = false;
        this.subagentErrored = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskResult_CompletedTaskResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskResult_CompletedTaskResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskResult_CompletedTaskResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskResult_CompletedTaskResult, a, b2);
      }
      static $() {
        return ["TaskResult.CompletedTaskResult|1 summary 9|2 file_results #0*|3 user_aborted 8|4 subagent_errored 8", FixLintsResult_FileResult];
      }
    };
    TaskResult_AsyncTaskResult = class _TaskResult_AsyncTaskResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.taskId = "";
        this.userAborted = false;
        this.subagentErrored = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskResult_AsyncTaskResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskResult_AsyncTaskResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskResult_AsyncTaskResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskResult_AsyncTaskResult, a, b2);
      }
      static $() {
        return ["TaskResult.AsyncTaskResult|1 task_id 9|2 user_aborted 8|3 subagent_errored 8"];
      }
    };
    TaskStream = class _TaskStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskStream, a, b2);
      }
      static $() {
        return ["TaskStream"];
      }
    };
    TaskV2Params = class _TaskV2Params extends __protoMessage392 {
      constructor(data) {
        super();
        this.description = "";
        this.prompt = "";
        this.subagentType = "";
        this.name = "";
        this.mode = TaskMode.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskV2Params().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskV2Params().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskV2Params().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskV2Params, a, b2);
      }
      static $() {
        return ["TaskV2Params|1 description 9|2 prompt 9|3 subagent_type 9|4 model 9?|5 name 9|6 mode #0", TaskMode];
      }
    };
    TaskV2Result = class _TaskV2Result extends __protoMessage392 {
      constructor(data) {
        super();
        this.isBackground = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskV2Result().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskV2Result().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskV2Result().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskV2Result, a, b2);
      }
      static $() {
        return ["TaskV2Result|1 agent_id 9?|2 is_background 8|3 cloud_agent_bc_id 9?"];
      }
    };
    TaskV2Stream = class _TaskV2Stream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TaskV2Stream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TaskV2Stream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TaskV2Stream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TaskV2Stream, a, b2);
      }
      static $() {
        return ["TaskV2Stream"];
      }
    };
    RipgrepRawSearchParams = class _RipgrepRawSearchParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.pattern = "";
        this.ignoreGlobs = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchParams, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchParams|1 pattern 9|2 path 9?|3 glob 9?|4 output_mode 9?|5 context_before 5?|6 context_after 5?|7 context 5?|8 case_insensitive 8?|9 type 9?|10 head_limit 5?|11 multiline 8?|12 sort 9?|13 sort_ascending 8?|14 ignore_globs 9*|15 offset 5?"];
      }
    };
    RipgrepRawSearchResult = class _RipgrepRawSearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchResult, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchResult|1 success #0 result|2 error #1 result", RipgrepRawSearchSuccess, RipgrepRawSearchError];
      }
    };
    RipgrepRawSearchError = class _RipgrepRawSearchError extends __protoMessage392 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchError, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchError|1 error 9"];
      }
    };
    RipgrepRawSearchSuccess = class _RipgrepRawSearchSuccess extends __protoMessage392 {
      constructor(data) {
        super();
        this.pattern = "";
        this.path = "";
        this.outputMode = "";
        this.workspaceResults = {};
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchSuccess, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchSuccess|1 pattern 9|2 path 9|3 output_mode 9|4 workspace_results 9,#0|5 active_editor_result #0?", RipgrepRawSearchUnionResult];
      }
    };
    RipgrepRawSearchUnionResult = class _RipgrepRawSearchUnionResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchUnionResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchUnionResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchUnionResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchUnionResult, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchUnionResult|1 count #0 result|2 files #1 result|3 content #2 result", RipgrepRawSearchCountResult, RipgrepRawSearchFilesResult, RipgrepRawSearchContentResult];
      }
    };
    RipgrepRawSearchCountResult = class _RipgrepRawSearchCountResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.counts = [];
        this.totalFiles = 0;
        this.totalMatches = 0;
        this.clientTruncated = false;
        this.ripgrepTruncated = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchCountResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchCountResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchCountResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchCountResult, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchCountResult|1 counts #0*|2 total_files 5|3 total_matches 5|4 client_truncated 8|6 head_limit_applied 5?|7 offset_applied 5?|5 ripgrep_truncated 8", RipgrepRawSearchFileCount];
      }
    };
    RipgrepRawSearchFileCount = class _RipgrepRawSearchFileCount extends __protoMessage392 {
      constructor(data) {
        super();
        this.file = "";
        this.count = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchFileCount().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchFileCount().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchFileCount().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchFileCount, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchFileCount|1 file 9|2 count 5|3 is_dirty 8?|4 is_out_of_workspace 8?|5 absolute_path 9?"];
      }
    };
    RipgrepRawSearchFilesResult = class _RipgrepRawSearchFilesResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.files = [];
        this.totalFiles = 0;
        this.clientTruncated = false;
        this.ripgrepTruncated = false;
        this.filesWithMeta = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchFilesResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchFilesResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchFilesResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchFilesResult, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchFilesResult|1 files 9*|2 total_files 5|3 client_truncated 8|4 ripgrep_truncated 8|5 files_with_meta #0*|6 head_limit_applied 5?|7 offset_applied 5?", RipgrepRawSearchFilesResult_FileEntry];
      }
    };
    RipgrepRawSearchFilesResult_FileEntry = class _RipgrepRawSearchFilesResult_FileEntry extends __protoMessage392 {
      constructor(data) {
        super();
        this.file = "";
        this.isDirty = false;
        this.isOutOfWorkspace = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchFilesResult_FileEntry().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchFilesResult_FileEntry().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchFilesResult_FileEntry().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchFilesResult_FileEntry, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchFilesResult.FileEntry|1 file 9|2 is_dirty 8|3 is_out_of_workspace 8|4 absolute_path 9?"];
      }
    };
    RipgrepRawSearchContentResult = class _RipgrepRawSearchContentResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.matches = [];
        this.totalLines = 0;
        this.totalMatchedLines = 0;
        this.clientTruncated = false;
        this.ripgrepTruncated = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchContentResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchContentResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchContentResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchContentResult, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchContentResult|1 matches #0*|2 total_lines 5|3 total_matched_lines 5|4 client_truncated 8|5 ripgrep_truncated 8|6 head_limit_applied 5?|7 offset_applied 5?", RipgrepRawSearchFileMatch];
      }
    };
    RipgrepRawSearchFileMatch = class _RipgrepRawSearchFileMatch extends __protoMessage392 {
      constructor(data) {
        super();
        this.file = "";
        this.matches = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchFileMatch().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchFileMatch().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchFileMatch().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchFileMatch, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchFileMatch|1 file 9|2 matches #0*|3 is_dirty 8?|4 is_out_of_workspace 8?|5 absolute_path 9?", RipgrepRawSearchContentMatch];
      }
    };
    RipgrepRawSearchContentMatch = class _RipgrepRawSearchContentMatch extends __protoMessage392 {
      constructor(data) {
        super();
        this.lineNumber = 0;
        this.content = "";
        this.contentTruncated = false;
        this.isContextLine = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchContentMatch().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchContentMatch().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchContentMatch().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchContentMatch, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchContentMatch|1 line_number 5|2 content 9|3 content_truncated 8|4 is_context_line 8"];
      }
    };
    RipgrepRawSearchStream = class _RipgrepRawSearchStream extends __protoMessage392 {
      constructor(data) {
        super();
        this.pattern = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RipgrepRawSearchStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RipgrepRawSearchStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RipgrepRawSearchStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RipgrepRawSearchStream, a, b2);
      }
      static $() {
        return ["RipgrepRawSearchStream|1 pattern 9"];
      }
    };
    AwaitTaskParams = class _AwaitTaskParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.ids = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitTaskParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitTaskParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitTaskParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitTaskParams, a, b2);
      }
      static $() {
        return ["AwaitTaskParams|1 ids 9*"];
      }
    };
    AwaitTaskResult = class _AwaitTaskResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.taskResults = [];
        this.missingTaskIds = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitTaskResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitTaskResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitTaskResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitTaskResult, a, b2);
      }
      static $() {
        return ["AwaitTaskResult|1 task_results #0*|2 missing_task_ids 9*", AwaitTaskResult_TaskResultItem];
      }
    };
    AwaitTaskResult_TaskResultItem = class _AwaitTaskResult_TaskResultItem extends __protoMessage392 {
      constructor(data) {
        super();
        this.taskId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitTaskResult_TaskResultItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitTaskResult_TaskResultItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitTaskResult_TaskResultItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitTaskResult_TaskResultItem, a, b2);
      }
      static $() {
        return ["AwaitTaskResult.TaskResultItem|1 task_id 9|2 result #0", TaskResult_CompletedTaskResult];
      }
    };
    AwaitTaskStream = class _AwaitTaskStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitTaskStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitTaskStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitTaskStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitTaskStream, a, b2);
      }
      static $() {
        return ["AwaitTaskStream"];
      }
    };
    TodoReadParams = class _TodoReadParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.read = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TodoReadParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TodoReadParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TodoReadParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TodoReadParams, a, b2);
      }
      static $() {
        return ["TodoReadParams|1 read 8"];
      }
    };
    TodoItem2 = class _TodoItem extends __protoMessage392 {
      constructor(data) {
        super();
        this.content = "";
        this.status = "";
        this.id = "";
        this.dependencies = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TodoItem().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TodoItem().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TodoItem().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TodoItem, a, b2);
      }
      static $() {
        return ["TodoItem|1 content 9|2 status 9|3 id 9|4 dependencies 9*"];
      }
    };
    TodoReadResult = class _TodoReadResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.todos = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TodoReadResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TodoReadResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TodoReadResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TodoReadResult, a, b2);
      }
      static $() {
        return ["TodoReadResult|1 todos #0*", TodoItem2];
      }
    };
    TodoReadStream = class _TodoReadStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TodoReadStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TodoReadStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TodoReadStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TodoReadStream, a, b2);
      }
      static $() {
        return ["TodoReadStream"];
      }
    };
    TodoWriteParams = class _TodoWriteParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.todos = [];
        this.merge = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TodoWriteParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TodoWriteParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TodoWriteParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TodoWriteParams, a, b2);
      }
      static $() {
        return ["TodoWriteParams|1 todos #0*|2 merge 8", TodoItem2];
      }
    };
    TodoWriteResult = class _TodoWriteResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.success = false;
        this.readyTaskIds = [];
        this.needsInProgressTodos = false;
        this.finalTodos = [];
        this.initialTodos = [];
        this.wasMerge = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TodoWriteResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TodoWriteResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TodoWriteResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TodoWriteResult, a, b2);
      }
      static $() {
        return ["TodoWriteResult|1 success 8|2 ready_task_ids 9*|3 needs_in_progress_todos 8|4 final_todos #0*|5 initial_todos #0*|6 was_merge 8", TodoItem2];
      }
    };
    TodoWriteStream = class _TodoWriteStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _TodoWriteStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _TodoWriteStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _TodoWriteStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_TodoWriteStream, a, b2);
      }
      static $() {
        return ["TodoWriteStream"];
      }
    };
    ListDirV2Params = class _ListDirV2Params extends __protoMessage392 {
      constructor(data) {
        super();
        this.targetDirectory = "";
        this.ignoreGlobs = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirV2Params().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirV2Params().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirV2Params().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirV2Params, a, b2);
      }
      static $() {
        return ["ListDirV2Params|1 target_directory 9|2 ignore_globs 9*|3 should_enrich_terminal_metadata 8?"];
      }
    };
    ListDirV2Result = class _ListDirV2Result extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirV2Result().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirV2Result().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirV2Result().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirV2Result, a, b2);
      }
      static $() {
        return ["ListDirV2Result|1 directory_tree_root #0", ListDirV2Result_DirectoryTreeNode];
      }
    };
    ListDirV2Result_DirectoryTreeNode = class _ListDirV2Result_DirectoryTreeNode extends __protoMessage392 {
      constructor(data) {
        super();
        this.absPath = "";
        this.childrenDirs = [];
        this.childrenFiles = [];
        this.childrenWereProcessed = false;
        this.fullSubtreeExtensionCounts = {};
        this.numFiles = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirV2Result_DirectoryTreeNode().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirV2Result_DirectoryTreeNode().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirV2Result_DirectoryTreeNode().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirV2Result_DirectoryTreeNode, a, b2);
      }
      static $() {
        return ["ListDirV2Result.DirectoryTreeNode|1 abs_path 9|2 children_dirs #0*|3 children_files #1*|4 children_were_processed 8|5 full_subtree_extension_counts 9,5|6 num_files 5", _ListDirV2Result_DirectoryTreeNode, ListDirV2Result_DirectoryTreeNode_File];
      }
    };
    ListDirV2Result_DirectoryTreeNode_File = class _ListDirV2Result_DirectoryTreeNode_File extends __protoMessage392 {
      constructor(data) {
        super();
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirV2Result_DirectoryTreeNode_File().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirV2Result_DirectoryTreeNode_File().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirV2Result_DirectoryTreeNode_File().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirV2Result_DirectoryTreeNode_File, a, b2);
      }
      static $() {
        return ["ListDirV2Result.DirectoryTreeNode.File|1 name 9|2 terminal_metadata #0?", TerminalMetadata];
      }
    };
    ListDirV2Stream = class _ListDirV2Stream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListDirV2Stream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListDirV2Stream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListDirV2Stream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListDirV2Stream, a, b2);
      }
      static $() {
        return ["ListDirV2Stream"];
      }
    };
    ReadFileV2Params = class _ReadFileV2Params extends __protoMessage392 {
      constructor(data) {
        super();
        this.targetFile = "";
        this.charsLimit = 0;
        this.effectiveUri = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadFileV2Params().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadFileV2Params().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadFileV2Params().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadFileV2Params, a, b2);
      }
      static $() {
        return ["ReadFileV2Params|1 target_file 9|2 offset 5?|3 limit 5?|4 chars_limit 5|5 effective_uri 9|6 enable_line_numbers 8?"];
      }
    };
    ReadFileV2Result = class _ReadFileV2Result extends __protoMessage392 {
      constructor(data) {
        super();
        this.numCharactersInRequestedRange = 0;
        this.matchingCursorRules = [];
        this.images = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadFileV2Result().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadFileV2Result().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadFileV2Result().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadFileV2Result, a, b2);
      }
      static $() {
        return ["ReadFileV2Result|1 contents 9?|2 num_characters_in_requested_range 5|3 offset_is_bigger_than_number_of_lines_in_file 8?|4 total_lines_in_file 5?|5 matching_cursor_rules #0*|6 images #1*", CursorRule, ImageProto];
      }
    };
    ReadFileV2Stream = class _ReadFileV2Stream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadFileV2Stream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadFileV2Stream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadFileV2Stream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadFileV2Stream, a, b2);
      }
      static $() {
        return ["ReadFileV2Stream|1 params #0?", ReadFileV2Params];
      }
    };
    GlobFileSearchParams = class _GlobFileSearchParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.targetDirectory = "";
        this.globPattern = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GlobFileSearchParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GlobFileSearchParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GlobFileSearchParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GlobFileSearchParams, a, b2);
      }
      static $() {
        return ["GlobFileSearchParams|1 target_directory 9|2 glob_pattern 9"];
      }
    };
    GlobFileSearchResult = class _GlobFileSearchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.directories = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GlobFileSearchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GlobFileSearchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GlobFileSearchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GlobFileSearchResult, a, b2);
      }
      static $() {
        return ["GlobFileSearchResult|1 directories #0*", GlobFileSearchResult_Directory];
      }
    };
    GlobFileSearchResult_File = class _GlobFileSearchResult_File extends __protoMessage392 {
      constructor(data) {
        super();
        this.relPath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GlobFileSearchResult_File().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GlobFileSearchResult_File().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GlobFileSearchResult_File().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GlobFileSearchResult_File, a, b2);
      }
      static $() {
        return ["GlobFileSearchResult.File|1 rel_path 9"];
      }
    };
    GlobFileSearchResult_Directory = class _GlobFileSearchResult_Directory extends __protoMessage392 {
      constructor(data) {
        super();
        this.absPath = "";
        this.files = [];
        this.totalFiles = 0;
        this.ripgrepTruncated = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GlobFileSearchResult_Directory().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GlobFileSearchResult_Directory().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GlobFileSearchResult_Directory().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GlobFileSearchResult_Directory, a, b2);
      }
      static $() {
        return ["GlobFileSearchResult.Directory|1 abs_path 9|2 files #0*|3 total_files 5|4 ripgrep_truncated 8", GlobFileSearchResult_File];
      }
    };
    GlobFileSearchStream = class _GlobFileSearchStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GlobFileSearchStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GlobFileSearchStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GlobFileSearchStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GlobFileSearchStream, a, b2);
      }
      static $() {
        return ["GlobFileSearchStream"];
      }
    };
    ListMcpResourcesStream = class _ListMcpResourcesStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ListMcpResourcesStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ListMcpResourcesStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ListMcpResourcesStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ListMcpResourcesStream, a, b2);
      }
      static $() {
        return ["ListMcpResourcesStream"];
      }
    };
    CallMcpToolStream = class _CallMcpToolStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CallMcpToolStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CallMcpToolStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CallMcpToolStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CallMcpToolStream, a, b2);
      }
      static $() {
        return ["CallMcpToolStream"];
      }
    };
    ReadMcpResourceStream = class _ReadMcpResourceStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadMcpResourceStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadMcpResourceStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadMcpResourceStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadMcpResourceStream, a, b2);
      }
      static $() {
        return ["ReadMcpResourceStream"];
      }
    };
    Step = class _Step extends __protoMessage392 {
      constructor(data) {
        super();
        this.id = "";
        this.title = "";
        this.description = "";
        this.instructions = "";
        this.prerequisites = [];
        this.subComposerId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _Step().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _Step().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _Step().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_Step, a, b2);
      }
      static $() {
        return ["Step|1 id 9|2 title 9|3 description 9|4 instructions 9|5 prerequisites 9*|6 sub_composer_id 9"];
      }
    };
    PlanPhase = class _PlanPhase extends __protoMessage392 {
      constructor(data) {
        super();
        this.name = "";
        this.todos = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PlanPhase().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PlanPhase().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PlanPhase().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PlanPhase, a, b2);
      }
      static $() {
        return ["PlanPhase|1 name 9|2 todos #0*", TodoItem2];
      }
    };
    CreatePlanParams = class _CreatePlanParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.plan = "";
        this.title = "";
        this.summary = "";
        this.steps = [];
        this.oldStr = "";
        this.newStr = "";
        this.name = "";
        this.todos = [];
        this.overview = "";
        this.isSpec = false;
        this.isProject = false;
        this.phases = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanParams, a, b2);
      }
      static $() {
        return ["CreatePlanParams|1 plan 9|2 title 9|3 summary 9|4 steps #0*|5 old_str 9|6 new_str 9|7 name 9|8 todos #1*|9 overview 9|10 is_spec 8|11 is_project 8|12 phases #2*", Step, TodoItem2, PlanPhase];
      }
    };
    CreatePlanResult2 = class _CreatePlanResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        this.planUri = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanResult, a, b2);
      }
      static $() {
        return ["CreatePlanResult|1 accepted #0 result|2 rejected #1 result|3 modified #2 result|4 plan_uri 9", CreatePlanResult_Accepted, CreatePlanResult_Rejected, CreatePlanResult_Modified];
      }
    };
    CreatePlanResult_Accepted = class _CreatePlanResult_Accepted extends __protoMessage392 {
      constructor(data) {
        super();
        this.finalTodos = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanResult_Accepted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanResult_Accepted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanResult_Accepted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanResult_Accepted, a, b2);
      }
      static $() {
        return ["CreatePlanResult.Accepted|1 final_todos #0*", TodoItem2];
      }
    };
    CreatePlanResult_Rejected = class _CreatePlanResult_Rejected extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanResult_Rejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanResult_Rejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanResult_Rejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanResult_Rejected, a, b2);
      }
      static $() {
        return ["CreatePlanResult.Rejected"];
      }
    };
    CreatePlanResult_Modified = class _CreatePlanResult_Modified extends __protoMessage392 {
      constructor(data) {
        super();
        this.newPlan = "";
        this.finalTodos = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanResult_Modified().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanResult_Modified().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanResult_Modified().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanResult_Modified, a, b2);
      }
      static $() {
        return ["CreatePlanResult.Modified|1 new_plan 9|2 final_todos #0*", TodoItem2];
      }
    };
    CreatePlanStream = class _CreatePlanStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CreatePlanStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CreatePlanStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CreatePlanStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CreatePlanStream, a, b2);
      }
      static $() {
        return ["CreatePlanStream"];
      }
    };
    ReadProjectParams = class _ReadProjectParams extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadProjectParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadProjectParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadProjectParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadProjectParams, a, b2);
      }
      static $() {
        return ["ReadProjectParams"];
      }
    };
    ReadProjectResult = class _ReadProjectResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.plan = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadProjectResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadProjectResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadProjectResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadProjectResult, a, b2);
      }
      static $() {
        return ["ReadProjectResult|1 plan 9"];
      }
    };
    ReadProjectStream = class _ReadProjectStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadProjectStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadProjectStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadProjectStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadProjectStream, a, b2);
      }
      static $() {
        return ["ReadProjectStream"];
      }
    };
    UpdateProjectStringReplacement = class _UpdateProjectStringReplacement extends __protoMessage392 {
      constructor(data) {
        super();
        this.oldString = "";
        this.newString = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateProjectStringReplacement().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateProjectStringReplacement().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateProjectStringReplacement().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateProjectStringReplacement, a, b2);
      }
      static $() {
        return ["UpdateProjectStringReplacement|1 old_string 9|2 new_string 9"];
      }
    };
    UpdateProjectParams = class _UpdateProjectParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.stringReplacements = [];
        this.summary = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateProjectParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateProjectParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateProjectParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateProjectParams, a, b2);
      }
      static $() {
        return ["UpdateProjectParams|1 string_replacements #0*|2 summary 9", UpdateProjectStringReplacement];
      }
    };
    UpdateProjectResult = class _UpdateProjectResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.success = false;
        this.updatedPlan = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateProjectResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateProjectResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateProjectResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateProjectResult, a, b2);
      }
      static $() {
        return ["UpdateProjectResult|1 success 8|2 updated_plan 9"];
      }
    };
    UpdateProjectStream = class _UpdateProjectStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _UpdateProjectStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _UpdateProjectStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _UpdateProjectStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_UpdateProjectStream, a, b2);
      }
      static $() {
        return ["UpdateProjectStream"];
      }
    };
    AskQuestionParams = class _AskQuestionParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.title = "";
        this.questions = [];
        this.runAsync = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AskQuestionParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AskQuestionParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AskQuestionParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AskQuestionParams, a, b2);
      }
      static $() {
        return ["AskQuestionParams|1 title 9|2 questions #0*|3 run_async 8", AskQuestionParams_Question];
      }
    };
    AskQuestionParams_Question = class _AskQuestionParams_Question extends __protoMessage392 {
      constructor(data) {
        super();
        this.id = "";
        this.prompt = "";
        this.options = [];
        this.allowMultiple = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AskQuestionParams_Question().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AskQuestionParams_Question().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AskQuestionParams_Question().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AskQuestionParams_Question, a, b2);
      }
      static $() {
        return ["AskQuestionParams.Question|1 id 9|2 prompt 9|3 options #0*|4 allow_multiple 8", AskQuestionParams_Option];
      }
    };
    AskQuestionParams_Option = class _AskQuestionParams_Option extends __protoMessage392 {
      constructor(data) {
        super();
        this.id = "";
        this.label = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AskQuestionParams_Option().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AskQuestionParams_Option().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AskQuestionParams_Option().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AskQuestionParams_Option, a, b2);
      }
      static $() {
        return ["AskQuestionParams.Option|1 id 9|2 label 9"];
      }
    };
    AskQuestionResult2 = class _AskQuestionResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.answers = [];
        this.isAsync = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AskQuestionResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AskQuestionResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AskQuestionResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AskQuestionResult, a, b2);
      }
      static $() {
        return ["AskQuestionResult|1 answers #0*|2 is_async 8", AskQuestionResult_Answer];
      }
    };
    AskQuestionResult_Answer = class _AskQuestionResult_Answer extends __protoMessage392 {
      constructor(data) {
        super();
        this.questionId = "";
        this.selectedOptionIds = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AskQuestionResult_Answer().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AskQuestionResult_Answer().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AskQuestionResult_Answer().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AskQuestionResult_Answer, a, b2);
      }
      static $() {
        return ["AskQuestionResult.Answer|1 question_id 9|2 selected_option_ids 9*|3 freeform_text 9?"];
      }
    };
    AskQuestionStream = class _AskQuestionStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AskQuestionStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AskQuestionStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AskQuestionStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AskQuestionStream, a, b2);
      }
      static $() {
        return ["AskQuestionStream|1 params #0", AskQuestionParams];
      }
    };
    SwitchModeParams = class _SwitchModeParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.fromModeId = "";
        this.toModeId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SwitchModeParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SwitchModeParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SwitchModeParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SwitchModeParams, a, b2);
      }
      static $() {
        return ["SwitchModeParams|1 from_mode_id 9|2 to_mode_id 9|3 explanation 9?"];
      }
    };
    SwitchModeResult2 = class _SwitchModeResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.fromModeId = "";
        this.toModeId = "";
        this.autoApproved = false;
        this.userApproved = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SwitchModeResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SwitchModeResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SwitchModeResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SwitchModeResult, a, b2);
      }
      static $() {
        return ["SwitchModeResult|1 from_mode_id 9|2 to_mode_id 9|3 auto_approved 8|4 user_approved 8"];
      }
    };
    SwitchModeStream = class _SwitchModeStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SwitchModeStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SwitchModeStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SwitchModeStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SwitchModeStream, a, b2);
      }
      static $() {
        return ["SwitchModeStream|1 params #0", SwitchModeParams];
      }
    };
    ComputerUseParams = class _ComputerUseParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.actions = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputerUseParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputerUseParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputerUseParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputerUseParams, a, b2);
      }
      static $() {
        return ["ComputerUseParams|1 actions #0*", ComputerUseAction];
      }
    };
    ComputerUseResult2 = class _ComputerUseResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputerUseResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputerUseResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputerUseResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputerUseResult, a, b2);
      }
      static $() {
        return ["ComputerUseResult|1 success #0 result|2 error #1 result", ComputerUseSuccess, ComputerUseError];
      }
    };
    ComputerUseStream = class _ComputerUseStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ComputerUseStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ComputerUseStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ComputerUseStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ComputerUseStream, a, b2);
      }
      static $() {
        return ["ComputerUseStream|1 params #0", ComputerUseParams];
      }
    };
    WriteShellStdinStream = class _WriteShellStdinStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteShellStdinStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteShellStdinStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteShellStdinStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteShellStdinStream, a, b2);
      }
      static $() {
        return ["WriteShellStdinStream|1 params #0", WriteShellStdinArgs];
      }
    };
    WebFetchParams = class _WebFetchParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.url = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchParams, a, b2);
      }
      static $() {
        return ["WebFetchParams|1 url 9"];
      }
    };
    WebFetchResult2 = class _WebFetchResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.url = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchResult, a, b2);
      }
      static $() {
        return ["WebFetchResult|1 url 9|2 markdown 9?|3 error 9?"];
      }
    };
    WebFetchStream = class _WebFetchStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WebFetchStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WebFetchStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WebFetchStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WebFetchStream, a, b2);
      }
      static $() {
        return ["WebFetchStream|1 params #0", WebFetchParams];
      }
    };
    ReportBugfixResultsParams = class _ReportBugfixResultsParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.summary = "";
        this.results = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReportBugfixResultsParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReportBugfixResultsParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReportBugfixResultsParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReportBugfixResultsParams, a, b2);
      }
      static $() {
        return ["ReportBugfixResultsParams|1 summary 9|2 results #0*", BugfixResultItem];
      }
    };
    ReportBugfixResultsResult2 = class _ReportBugfixResultsResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReportBugfixResultsResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReportBugfixResultsResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReportBugfixResultsResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReportBugfixResultsResult, a, b2);
      }
      static $() {
        return ["ReportBugfixResultsResult|1 success #0 result|2 error #1 result", ReportBugfixResultsSuccess, ReportBugfixResultsError];
      }
    };
    ReportBugfixResultsStream = class _ReportBugfixResultsStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReportBugfixResultsStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReportBugfixResultsStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReportBugfixResultsStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReportBugfixResultsStream, a, b2);
      }
      static $() {
        return ["ReportBugfixResultsStream|1 params #0", ReportBugfixResultsParams];
      }
    };
    McpAuthParams = class _McpAuthParams extends __protoMessage392 {
      constructor(data) {
        super();
        this.serverIdentifier = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthParams, a, b2);
      }
      static $() {
        return ["McpAuthParams|1 server_identifier 9"];
      }
    };
    McpAuthResult2 = class _McpAuthResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.success = false;
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthResult, a, b2);
      }
      static $() {
        return ["McpAuthResult|1 success 8|2 message 9"];
      }
    };
    McpAuthStream = class _McpAuthStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _McpAuthStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _McpAuthStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _McpAuthStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_McpAuthStream, a, b2);
      }
      static $() {
        return ["McpAuthStream"];
      }
    };
    ConnectScmParams = class _ConnectScmParams extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmParams().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmParams().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmParams().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmParams, a, b2);
      }
      static $() {
        return ["ConnectScmParams|1 github #0", ConnectScmGithub2];
      }
    };
    ConnectScmGithub2 = class _ConnectScmGithub extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmGithub().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmGithub().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmGithub().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmGithub, a, b2);
      }
      static $() {
        return ["ConnectScmGithub|1 repository #0|2 ghe_application 9?", ConnectScmGithubRepository2];
      }
    };
    ConnectScmGithubRepository2 = class _ConnectScmGithubRepository extends __protoMessage392 {
      constructor(data) {
        super();
        this.owner = "";
        this.repo = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmGithubRepository().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmGithubRepository().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmGithubRepository().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmGithubRepository, a, b2);
      }
      static $() {
        return ["ConnectScmGithubRepository|1 owner 9|2 repo 9"];
      }
    };
    ConnectScmResult2 = class _ConnectScmResult extends __protoMessage392 {
      constructor(data) {
        super();
        this.success = false;
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmResult, a, b2);
      }
      static $() {
        return ["ConnectScmResult|1 success 8|2 message 9"];
      }
    };
    ConnectScmStream = class _ConnectScmStream extends __protoMessage392 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ConnectScmStream().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ConnectScmStream().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ConnectScmStream().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ConnectScmStream, a, b2);
      }
      static $() {
        return ["ConnectScmStream"];
      }
    };
  }
});

